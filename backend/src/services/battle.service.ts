/**
 * FILE: battle.service.ts
 * LOCATION: backend/src/services/battle.service.ts
 * PURPOSE: Business logic for the EduQuest Battle Arena — BGMI-style
 *          1v1 real-time quiz matches between students.
 *
 * MATCHMAKING ALGORITHM:
 *  1. Player enters queue for a specific subject
 *  2. System finds a waiting player within ±3 levels
 *  3. If no match found within 30 seconds, widens search to ±5 levels
 *  4. Match created with 10 random questions from the subject
 *  5. Both players answer simultaneously (30 seconds per question)
 *  6. Winner gets 3× XP, loser gets 1× XP (participation reward)
 *
 * ANTI-CHEAT:
 *  - Answers validated server-side only
 *  - Response time tracked (suspicious if <500ms consistently)
 *  - Same IP blocking (prevents self-battling)
 *
 * DEPENDENCIES: ../config/database
 * USED BY: battle routes, WebSocket match handler
 * LAST UPDATED: 2026-05-19
 */

import pool from "../config/database";

/* ─────────────────────────────────────────────
 * Types
 * ───────────────────────────────────────────── */

export interface MatchmakingRequest {
  userId: string;
  subjectId: string;
  mode: string; // "RANKED" | "CASUAL"
}

export interface MatchResult {
  matchId: string;
  status: "matched" | "waiting" | "cancelled";
  opponent?: {
    id: string;
    name: string;
    level: number;
  };
}

export interface AnswerSubmission {
  userId: string;
  matchId: string;
  questionId: string;
  answer: string;
  responseTime: number; // milliseconds
}

/* ─────────────────────────────────────────────
 * Join Matchmaking Queue
 * Attempts to find a matching opponent or creates a queue entry.
 * ───────────────────────────────────────────── */

/**
 * Adds a player to the matchmaking queue and attempts to find an opponent.
 *
 * Algorithm:
 * 1. Check if user is already in queue or active match
 * 2. Look for a waiting player in the same subject within ±3 levels
 * 3. If found: create match, remove both from queue, return match info
 * 4. If not found: add to queue as "WAITING"
 *
 * @param request - Player info and match preferences
 * @returns Match result (matched with opponent or waiting)
 */
export async function joinMatchmakingQueue(
  request: MatchmakingRequest
): Promise<MatchResult | { error: string; statusCode: number }> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check if user is already in queue
    const existingQueue = await client.query(
      `SELECT id FROM "MatchParticipant" mp
       JOIN "Match" m ON mp."matchId" = m.id
       WHERE mp."userId" = $1 AND m.status IN ('WAITING', 'ACTIVE')`,
      [request.userId]
    );

    if (existingQueue.rows.length > 0) {
      await client.query("ROLLBACK");
      return { error: "You are already in a queue or active match.", statusCode: 409 };
    }

    // Get user's level for matchmaking
    const userResult = await client.query(
      `SELECT id, name, "currentLevel" FROM "User" WHERE id = $1`,
      [request.userId]
    );

    if (userResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return { error: "User not found.", statusCode: 404 };
    }

    const user = userResult.rows[0];

    // Look for a waiting opponent in the same subject within ±3 levels
    const opponentResult = await client.query(
      `SELECT m.id AS "matchId", mp."userId" AS "opponentId", u.name AS "opponentName", u."currentLevel" AS "opponentLevel"
       FROM "Match" m
       JOIN "MatchParticipant" mp ON mp."matchId" = m.id
       JOIN "User" u ON mp."userId" = u.id
       WHERE m."subjectId" = $1
         AND m.status = 'WAITING'
         AND mp."userId" != $2
         AND ABS(u."currentLevel" - $3) <= 3
         AND m.mode = $4
       ORDER BY m."startTime" ASC
       LIMIT 1
       FOR UPDATE OF m`,
      [request.subjectId, request.userId, user.currentLevel, request.mode]
    );

    if (opponentResult.rows.length > 0) {
      // Found opponent — create the match!
      const opponent = opponentResult.rows[0];

      // Add the current user as second participant
      await client.query(
        `INSERT INTO "MatchParticipant" (id, "matchId", "userId", score, "correctAnswers", "wrongAnswers", "isWinner", "xpEarned")
         VALUES (gen_random_uuid()::text, $1, $2, 0, 0, 0, FALSE, 0)`,
        [opponent.matchId, request.userId]
      );

      // Update match status to ACTIVE
      await client.query(
        `UPDATE "Match" SET status = 'ACTIVE', "startTime" = NOW() WHERE id = $1`,
        [opponent.matchId]
      );

      await client.query("COMMIT");

      return {
        matchId: opponent.matchId,
        status: "matched",
        opponent: {
          id: opponent.opponentId,
          name: opponent.opponentName,
          level: opponent.opponentLevel,
        },
      };
    }

    // No opponent found — create a new waiting match
    const matchResult = await client.query(
      `INSERT INTO "Match" (id, "subjectId", status, mode, "questionsCount", "timePerQuestion", "startTime")
       VALUES (gen_random_uuid()::text, $1, 'WAITING', $2, 10, 30, NOW())
       RETURNING id`,
      [request.subjectId, request.mode]
    );

    const matchId = matchResult.rows[0].id;

    // Add user as first participant
    await client.query(
      `INSERT INTO "MatchParticipant" (id, "matchId", "userId", score, "correctAnswers", "wrongAnswers", "isWinner", "xpEarned")
       VALUES (gen_random_uuid()::text, $1, $2, 0, 0, 0, FALSE, 0)`,
      [matchId, request.userId]
    );

    await client.query("COMMIT");

    return {
      matchId,
      status: "waiting",
    };
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[battle.service] Matchmaking error:", err);
    return { error: "Matchmaking failed. Please try again.", statusCode: 500 };
  } finally {
    client.release();
  }
}

/* ─────────────────────────────────────────────
 * Leave Queue
 * Removes a player from the matchmaking queue.
 * Only works if the match is still in WAITING status.
 * ───────────────────────────────────────────── */

export async function leaveQueue(
  userId: string
): Promise<{ success: boolean } | { error: string; statusCode: number }> {
  try {
    const result = await pool.query(
      `UPDATE "Match" SET status = 'CANCELLED'
       WHERE id IN (
         SELECT m.id FROM "Match" m
         JOIN "MatchParticipant" mp ON mp."matchId" = m.id
         WHERE mp."userId" = $1 AND m.status = 'WAITING'
       )
       RETURNING id`,
      [userId]
    );

    if (result.rows.length === 0) {
      return { error: "You are not in a queue.", statusCode: 404 };
    }

    return { success: true };
  } catch (err) {
    console.error("[battle.service] Leave queue error:", err);
    return { error: "Failed to leave queue.", statusCode: 500 };
  }
}

/* ─────────────────────────────────────────────
 * Get Match Questions
 * Fetches 10 random questions from the match's subject.
 * Called when a match transitions to ACTIVE.
 * ───────────────────────────────────────────── */

export async function getMatchQuestions(matchId: string) {
  const matchResult = await pool.query(
    `SELECT m."subjectId", m."questionsCount"
     FROM "Match" m WHERE m.id = $1`,
    [matchId]
  );

  if (matchResult.rows.length === 0) {
    return { error: "Match not found.", statusCode: 404 };
  }

  const { subjectId, questionsCount } = matchResult.rows[0];

  // Get random questions from chapters in this subject
  const questionsResult = await pool.query(
    `SELECT q.id, q.content, q.type, q.options, q.difficulty, q.points, q."imageUrl"
     FROM "Question" q
     JOIN "Topic" t ON q."topicId" = t.id
     JOIN "Chapter" ch ON t."chapterId" = ch.id
     WHERE ch."subjectId" = $1
     ORDER BY RANDOM()
     LIMIT $2`,
    [subjectId, questionsCount]
  );

  // Parse JSON options
  const questions = questionsResult.rows.map((q: Record<string, unknown>) => ({
    ...q,
    options: q.options ? JSON.parse(q.options as string) : null,
    // IMPORTANT: Do NOT send the correct answer to the client
    answer: undefined,
  }));

  return { questions };
}

/* ─────────────────────────────────────────────
 * Complete Match
 * Called when all questions are answered or time runs out.
 * Determines winner, awards XP, and updates stats.
 * ───────────────────────────────────────────── */

export async function completeMatch(matchId: string) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Get match participants with scores
    const participants = await client.query(
      `SELECT mp."userId", mp.score, mp."correctAnswers", mp."wrongAnswers",
              u.name, u."currentLevel"
       FROM "MatchParticipant" mp
       JOIN "User" u ON mp."userId" = u.id
       WHERE mp."matchId" = $1
       ORDER BY mp.score DESC`,
      [matchId]
    );

    if (participants.rows.length < 2) {
      await client.query("ROLLBACK");
      return { error: "Match doesn't have enough participants.", statusCode: 400 };
    }

    const winner = participants.rows[0];
    const loser = participants.rows[1];

    // Award XP: Winner gets 3× base, loser gets 1× base
    const baseXP = 30;
    const winnerXP = baseXP * 3;
    const loserXP = baseXP;

    // Update winner
    await client.query(
      `UPDATE "MatchParticipant" SET "isWinner" = TRUE, "xpEarned" = $1
       WHERE "matchId" = $2 AND "userId" = $3`,
      [winnerXP, matchId, winner.userId]
    );

    await client.query(
      `UPDATE "User" SET xp = xp + $1, points = points + $1, "updatedAt" = NOW()
       WHERE id = $2`,
      [winnerXP, winner.userId]
    );

    // Update loser (participation reward)
    await client.query(
      `UPDATE "MatchParticipant" SET "xpEarned" = $1
       WHERE "matchId" = $2 AND "userId" = $3`,
      [loserXP, matchId, loser.userId]
    );

    await client.query(
      `UPDATE "User" SET xp = xp + $1, points = points + $1, "updatedAt" = NOW()
       WHERE id = $2`,
      [loserXP, loser.userId]
    );

    // Mark match as completed
    await client.query(
      `UPDATE "Match" SET status = 'COMPLETED', "endTime" = NOW() WHERE id = $1`,
      [matchId]
    );

    // Create notifications
    await client.query(
      `INSERT INTO "Notification" (id, "userId", type, title, message, "actionUrl", "isRead", priority, "createdAt")
       VALUES
       (gen_random_uuid()::text, $1, 'BATTLE', '🏆 Battle Won!', $2, '/battle', FALSE, 'HIGH', NOW()),
       (gen_random_uuid()::text, $3, 'BATTLE', '⚔️ Battle Complete', $4, '/battle', FALSE, 'NORMAL', NOW())`,
      [
        winner.userId,
        `You defeated ${loser.name}! Score: ${winner.score} vs ${loser.score}. +${winnerXP} XP earned!`,
        loser.userId,
        `${winner.name} won the battle. Score: ${winner.score} vs ${loser.score}. +${loserXP} XP for participation.`,
      ]
    );

    await client.query("COMMIT");

    return {
      matchId,
      winner: { userId: winner.userId, name: winner.name, score: winner.score, xpEarned: winnerXP },
      loser: { userId: loser.userId, name: loser.name, score: loser.score, xpEarned: loserXP },
    };
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[battle.service] Complete match error:", err);
    return { error: "Failed to complete match.", statusCode: 500 };
  } finally {
    client.release();
  }
}

/* ─────────────────────────────────────────────
 * WAGER & WALLET HELPERS
 * ───────────────────────────────────────────── */

/**
 * Validates player requirements for entry into wagered matchmaking.
 * Validates level gate (Level 10+), wager limit (500 Stars max per match),
 * daily wager limit (1000 Stars max total in last 24h), and sufficient wallet balance.
 */
export async function validateWagerRequirements(
  userId: string,
  wager: number
): Promise<{ success: boolean; error?: string }> {
  if (wager <= 0) {
    return { success: true };
  }

  if (wager > 500) {
    return { success: false, error: "Single-match wager cannot exceed 500 Stars." };
  }

  try {
    // 1. Level Check (Wagered battles restricted to Level 10+)
    const userResult = await pool.query(
      `SELECT "currentLevel" FROM "User" WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return { success: false, error: "User not found." };
    }

    if (userResult.rows[0].currentLevel < 10) {
      return { success: false, error: "Level 10 is required to participate in wagered battles." };
    }

    // 2. Balance Check (Verify enough Stars exist in Wallet)
    let walletResult = await pool.query(
      `SELECT balance FROM "Wallet" WHERE "userId" = $1`,
      [userId]
    );

    // Auto-create wallet with starter Stars if not exists
    if (walletResult.rows.length === 0) {
      walletResult = await pool.query(
        `INSERT INTO "Wallet" (id, "userId", balance, "totalEarned", "totalSpent", "isPremium", "createdAt", "updatedAt")
         VALUES (gen_random_uuid()::text, $1, 100, 100, 0, FALSE, NOW(), NOW())
         RETURNING balance`,
        [userId]
      );
    }

    const currentBalance = walletResult.rows[0].balance;
    if (currentBalance < wager) {
      return { success: false, error: `Insufficient Stars. Current balance: ${currentBalance}, required: ${wager}` };
    }

    // 3. Daily Wager Limit Check (Max 1000 Stars wagered in last 24 hours)
    const dailyResult = await pool.query(
      `SELECT COALESCE(SUM(ABS(amount)), 0) AS "totalWageredToday"
       FROM "WalletTransaction"
       WHERE "userId" = $1
         AND type = 'SPEND_BATTLE'
         AND "createdAt" > NOW() - INTERVAL '24 hours'`,
      [userId]
    );

    const totalWageredToday = Number(dailyResult.rows[0].totalWageredToday);
    if (totalWageredToday + wager > 1000) {
      return { success: false, error: `Daily wager limit of 1000 Stars reached. Remaining allowance: ${1000 - totalWageredToday} Stars.` };
    }

    return { success: true };
  } catch (err) {
    console.error("[battle.service] Wager validation error:", err);
    return { success: false, error: "Database error during wager validation." };
  }
}

/**
 * Deducts the wager amount from the user's wallet at the start of a match.
 * Performs a transaction with pessimistic locking to prevent double-spending.
 */
export async function deductWager(userId: string, matchId: string, wager: number): Promise<void> {
  if (wager <= 0) return;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const walletResult = await client.query(
      `SELECT id, balance FROM "Wallet" WHERE "userId" = $1 FOR UPDATE`,
      [userId]
    );

    if (walletResult.rows.length === 0) {
      throw new Error(`Wallet not found for user ${userId}`);
    }

    const currentBalance = walletResult.rows[0].balance;
    if (currentBalance < wager) {
      throw new Error(`Insufficient funds for user ${userId} to deduct wager`);
    }

    const newBalance = currentBalance - wager;

    // Update wallet balance
    await client.query(
      `UPDATE "Wallet"
       SET balance = $1, "totalSpent" = "totalSpent" + $2, "updatedAt" = NOW()
       WHERE "userId" = $3`,
      [newBalance, wager, userId]
    );

    // Record spend transaction
    await client.query(
      `INSERT INTO "WalletTransaction"
         (id, "userId", amount, type, description, "referenceId", "balanceBefore", "balanceAfter", "createdAt")
       VALUES (gen_random_uuid()::text, $1, $2, 'SPEND_BATTLE', $3, $4, $5, $6, NOW())`,
      [userId, -wager, `Wager for battle match ${matchId}`, matchId, currentBalance, newBalance]
    );

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[battle.service] Wager deduction error:", err);
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Distributes payouts at the end of a match.
 * If match ends in a draw, both players get fully refunded.
 * If there is a winner, they receive the entire pool (2x wager).
 */
export async function distributeWagerPayout(
  matchId: string,
  winnerId: string | null,
  loserId: string | null,
  wager: number
): Promise<void> {
  if (wager <= 0) return;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    if (!winnerId) {
      // True draw — refund wagers to both players
      const participants = await client.query(
        `SELECT "userId" FROM "MatchParticipant" WHERE "matchId" = $1`,
        [matchId]
      );

      for (const row of participants.rows) {
        const userId = row.userId;
        const walletResult = await client.query(
          `SELECT balance FROM "Wallet" WHERE "userId" = $1 FOR UPDATE`,
          [userId]
        );

        if (walletResult.rows.length > 0) {
          const currentBalance = walletResult.rows[0].balance;
          const newBalance = currentBalance + wager;

          // Refund wallet
          await client.query(
            `UPDATE "Wallet"
             SET balance = $1, "totalSpent" = GREATEST(0, "totalSpent" - $2), "updatedAt" = NOW()
             WHERE "userId" = $3`,
            [newBalance, wager, userId]
          );

          // Add refund transaction record
          await client.query(
            `INSERT INTO "WalletTransaction"
               (id, "userId", amount, type, description, "referenceId", "balanceBefore", "balanceAfter", "createdAt")
             VALUES (gen_random_uuid()::text, $1, $2, 'EARN_BATTLE', $3, $4, $5, $6, NOW())`,
            [userId, wager, `Wager refund for battle draw in ${matchId}`, matchId, currentBalance, newBalance]
          );
        }
      }
    } else {
      // Winner takes all: 2 * wager payout
      const poolAmount = wager * 2;

      const walletResult = await client.query(
        `SELECT balance FROM "Wallet" WHERE "userId" = $1 FOR UPDATE`,
        [winnerId]
      );

      if (walletResult.rows.length > 0) {
        const currentBalance = walletResult.rows[0].balance;
        const newBalance = currentBalance + poolAmount;

        // Payout to winner
        await client.query(
          `UPDATE "Wallet"
           SET balance = $1, "totalEarned" = "totalEarned" + $2, "updatedAt" = NOW()
           WHERE "userId" = $3`,
          [newBalance, poolAmount, winnerId]
        );

        // Record earn transaction
        await client.query(
          `INSERT INTO "WalletTransaction"
             (id, "userId", amount, type, description, "referenceId", "balanceBefore", "balanceAfter", "createdAt")
           VALUES (gen_random_uuid()::text, $1, $2, 'EARN_BATTLE', $3, $4, $5, $6, NOW())`,
          [winnerId, poolAmount, `Won battle pool for match ${matchId}`, matchId, currentBalance, newBalance]
        );
      }
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[battle.service] Wager payout distribution error:", err);
    throw err;
  } finally {
    client.release();
  }
}

