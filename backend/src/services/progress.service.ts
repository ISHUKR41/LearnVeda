/**
 * FILE: progress.service.ts
 * LOCATION: backend/src/services/progress.service.ts
 * PURPOSE: Business logic for user progress tracking.
 *          Manages chapter completion, XP calculations, streak updates,
 *          and level progression.
 *
 * GAMIFICATION MECHANICS:
 *  - XP earned per chapter: 50 base + (10 × score/100) bonus
 *  - XP earned per question: 10 for correct, 2 for attempt
 *  - Streak bonus: 1.5× XP when streak ≥ 7 days
 *  - Level calculation: Based on total XP using quadratic curve
 *  - Stars: Earned alongside XP (1 Star per 5 XP)
 *
 * DEPENDENCIES: ../config/database
 * USED BY: progress routes, battle service
 * LAST UPDATED: 2026-05-19
 */

import pool from "../config/database";
import { PoolClient } from "pg";

/* ─────────────────────────────────────────────
 * Types
 * ───────────────────────────────────────────── */

export interface ProgressUpdate {
  userId: string;
  chapterId: string;
  completed?: boolean;
  score?: number;
  timeSpent?: number; // minutes
}

export interface XPResult {
  xpEarned: number;
  newTotalXP: number;
  newLevel: number;
  leveledUp: boolean;
  starsEarned: number;
  streakBonus: boolean;
}

/* ─────────────────────────────────────────────
 * Update Chapter Progress
 * Records study progress for a specific chapter.
 * Calculates and awards XP based on score and streak status.
 * ───────────────────────────────────────────── */

/**
 * Updates a user's progress on a specific chapter.
 *
 * @param data - Progress update details
 * @returns XP calculation result with level info
 *
 * Calculation flow:
 * 1. Check if progress record exists → create or update
 * 2. Calculate base XP from score
 * 3. Apply streak multiplier if applicable
 * 4. Update user's total XP
 * 5. Check for level-up
 * 6. Award Stars to wallet
 * 7. Update streak records
 */
export async function updateChapterProgress(
  data: ProgressUpdate
): Promise<XPResult | { error: string; statusCode: number }> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* ── Step 1: Upsert progress record ── */
    const score = data.score ?? 0;
    const timeSpent = data.timeSpent ?? 0;

    await client.query(
      `INSERT INTO "UserProgress" (id, "userId", "chapterId", completed, score, "timeSpent", "lastStudied", "updatedAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, NOW(), NOW())
       ON CONFLICT ("userId", "chapterId")
       DO UPDATE SET
         completed = COALESCE($3, "UserProgress".completed),
         score = GREATEST(COALESCE($4, "UserProgress".score), "UserProgress".score),
         "timeSpent" = "UserProgress"."timeSpent" + COALESCE($5, 0),
         "lastStudied" = NOW(),
         "updatedAt" = NOW()`,
      [data.userId, data.chapterId, data.completed ?? false, score, timeSpent]
    );

    /* ── Step 2: Calculate XP earned ── */
    let baseXP = 20; // Base XP for any study activity

    if (data.completed) {
      baseXP = 50; // Bonus for completing a chapter
    }

    // Score-based bonus (0-10 additional XP)
    const scoreBonus = Math.floor((score / 100) * 10);
    let totalXP = baseXP + scoreBonus;

    /* ── Step 3: Check streak for bonus multiplier ── */
    const userResult = await client.query(
      `SELECT "currentStreak", "highestStreak", xp, "currentLevel" FROM "User" WHERE id = $1 FOR UPDATE`,
      [data.userId]
    );

    if (userResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return { error: "User not found.", statusCode: 404 };
    }

    const user = userResult.rows[0];
    let streakBonus = false;

    if (user.currentStreak >= 7) {
      totalXP = Math.floor(totalXP * 1.5); // 50% streak bonus
      streakBonus = true;
    }

    /* ── Step 4: Update user XP ── */
    const newTotalXP = user.xp + totalXP;

    /* ── Step 5: Calculate new level ── */
    // Level = floor(sqrt(totalXP / 100)) — simple quadratic curve
    const newLevel = Math.max(1, Math.floor(Math.pow(newTotalXP / 100, 1 / 1.5)));
    const leveledUp = newLevel > user.currentLevel;

    await client.query(
      `UPDATE "User"
       SET xp = $1, "currentLevel" = $2, points = points + $3,
           "lastActive" = NOW(), "updatedAt" = NOW()
       WHERE id = $4`,
      [newTotalXP, newLevel, totalXP, data.userId]
    );

    /* ── Step 6: Award Stars ── */
    const starsEarned = Math.max(1, Math.floor(totalXP / 5));

    await client.query(
      `UPDATE "Wallet" SET balance = balance + $1, "totalEarned" = "totalEarned" + $1, "updatedAt" = NOW()
       WHERE "userId" = $2`,
      [starsEarned, data.userId]
    );

    // Record wallet transaction
    await client.query(
      `INSERT INTO "WalletTransaction" (id, "userId", amount, type, description, "balanceBefore", "balanceAfter", "createdAt")
       SELECT gen_random_uuid()::text, $1, $2, 'EARN_QUESTION', $3,
              w.balance - $2, w.balance, NOW()
       FROM "Wallet" w WHERE w."userId" = $1`,
      [data.userId, starsEarned, `Earned ${starsEarned} Stars from chapter study`]
    );

    /* ── Step 7: Update streak ── */
    await client.query(
      `INSERT INTO "StreakRecord" (id, "userId", date, "questionsAnswered", "pointsEarned", "minutesStudied")
       VALUES (gen_random_uuid()::text, $1, CURRENT_DATE, 1, $2, $3)
       ON CONFLICT ("userId", date)
       DO UPDATE SET
         "questionsAnswered" = "StreakRecord"."questionsAnswered" + 1,
         "pointsEarned" = "StreakRecord"."pointsEarned" + $2,
         "minutesStudied" = "StreakRecord"."minutesStudied" + $3`,
      [data.userId, totalXP, timeSpent]
    );

    // Update streak counter
    await updateStreakCounter(client, data.userId);

    /* ── Step 8: Create level-up notification if applicable ── */
    if (leveledUp) {
      await client.query(
        `INSERT INTO "Notification" (id, "userId", type, title, message, "isRead", priority, "createdAt")
         VALUES (gen_random_uuid()::text, $1, 'ACHIEVEMENT', $2, $3, FALSE, 'HIGH', NOW())`,
        [
          data.userId,
          `🎉 Level Up! You reached Level ${newLevel}!`,
          `Congratulations! You've reached Level ${newLevel}. Keep learning to unlock more achievements!`,
        ]
      );
    }

    await client.query("COMMIT");

    return {
      xpEarned: totalXP,
      newTotalXP,
      newLevel,
      leveledUp,
      starsEarned,
      streakBonus,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[progress.service] Error updating chapter progress:", err);
    return { error: "Failed to update progress.", statusCode: 500 };
  } finally {
    client.release();
  }
}

/* ─────────────────────────────────────────────
 * Streak Counter Update
 * Calculates the user's current streak based on consecutive daily records.
 * A streak breaks if there's a gap of more than 1 day.
 * ───────────────────────────────────────────── */

/**
 * Updates the user's currentStreak and highestStreak based on StreakRecord data.
 * Called internally after progress updates.
 */
async function updateStreakCounter(client: PoolClient, userId: string) {
  // Count consecutive days with activity, with automatic expiration logic if the last active date is older than 24 hours.
  const result = await client.query(
    `WITH last_streak AS (
       SELECT MAX(date) AS last_active_date
       FROM "StreakRecord"
       WHERE "userId" = $1
     ),
     streak_days AS (
       SELECT date,
              date - INTERVAL '1 day' * ROW_NUMBER() OVER (ORDER BY date DESC) AS streak_group
       FROM "StreakRecord"
       WHERE "userId" = $1
       ORDER BY date DESC
     ),
     consecutive AS (
       SELECT COUNT(*)::int AS streak_length
       FROM streak_days
       WHERE streak_group = (
         SELECT streak_group FROM streak_days LIMIT 1
       )
     )
     SELECT 
       CASE 
         WHEN (SELECT last_active_date FROM last_streak) >= CURRENT_DATE - INTERVAL '1 day' THEN (SELECT streak_length FROM consecutive)
         ELSE 0
       END AS streak_length`,
    [userId]
  );

  const currentStreak = parseInt(result.rows[0]?.streak_length ?? "0", 10);

  await client.query(
    `UPDATE "User"
     SET "currentStreak" = $1,
         "highestStreak" = GREATEST("highestStreak", $1)
     WHERE id = $2`,
    [currentStreak, userId]
  );
}

/**
 * Gets the full progress summary for a user across all chapters.
 */
export async function getUserProgressSummary(userId: string) {
  const result = await pool.query(
    `SELECT
       up.id, up."chapterId", up.completed, up.score, up."timeSpent", up."lastStudied",
       ch.title AS "chapterTitle", ch.slug AS "chapterSlug",
       s.name AS "subjectName", s.slug AS "subjectSlug",
       cc.name AS "className", cc.slug AS "classSlug"
     FROM "UserProgress" up
     JOIN "Chapter" ch ON up."chapterId" = ch.id
     JOIN "Subject" s ON ch."subjectId" = s.id
     JOIN "ClassCategory" cc ON s."classId" = cc.id
     WHERE up."userId" = $1
     ORDER BY up."lastStudied" DESC`,
    [userId]
  );

  const totalChapters = result.rows.length;
  const completedChapters = result.rows.filter((r: { completed: boolean }) => r.completed).length;
  const totalTimeSpent = result.rows.reduce((sum: number, r: { timeSpent: number }) => sum + r.timeSpent, 0);

  return {
    progress: result.rows,
    summary: {
      totalChapters,
      completedChapters,
      completionRate: totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0,
      totalTimeSpent,
    },
  };
}
