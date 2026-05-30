/**
 * FILE: route.ts
 * LOCATION: src/app/api/progress/answers/route.ts
 * PURPOSE: Comprehensive answer submission handler. When a student answers a question:
 *
 *   CORRECT ANSWER:
 *     1. Awards XP to eduquest_users (MCQ=15, short=25, long=30, deep=35)
 *     2. Recalculates and updates user level (quadratic: level N = N²×100 XP)
 *     3. Awards Stars to eduquest_wallet (MCQ=10, short=15, long=20, deep=25)
 *     4. Writes a wallet transaction record for the Stars credit
 *     5. Upserts eduquest_daily_streaks for today (questions_answered + xp_earned)
 *     6. Updates user streak in eduquest_users if they haven't studied today yet
 *
 *   WRONG ANSWER:
 *     - Only reads current XP/level, no mutations.
 *
 * BODY:
 *   { chapterId, topicId, questionId, userAnswer, isCorrect, timeSpent, questionType? }
 *
 * RESPONSE:
 *   { ok, data: { answerId, xpAwarded, starsAwarded, newXp, newLevel, leveledUp } }
 *
 * LAST UPDATED: 2026-05-30
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { getPostgresPool } from "@/lib/server/database/postgres";

export const runtime = "nodejs";

/* ── XP per question type ───────────────────────────────────────────── */
const XP_REWARDS: Record<string, number> = {
  mcq:             15,
  "short-answer":  25,
  "long-answer":   30,
  "deep-thinking": 35,
  default:         15,
};

/* ── Stars (virtual currency) per question type ─────────────────────── */
const STARS_REWARDS: Record<string, number> = {
  mcq:             10,
  "short-answer":  15,
  "long-answer":   20,
  "deep-thinking": 25,
  default:         10,
};

/* ── Level threshold: level N requires N² × 100 XP total ────────────── */
function xpForLevel(level: number): number {
  return level * level * 100;
}

/* ── Calculate level from total XP ──────────────────────────────────── */
function levelFromXp(xp: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) {
    level++;
    if (level >= 100) break;
  }
  return level;
}

/* ─────────────────────────────────────────────────────────────────────
 * POST /api/progress/answers
 * ───────────────────────────────────────────────────────────────────── */
export async function POST(request: NextRequest) {
  try {
    /* ── 1. Auth ──────────────────────────────────────────────────── */
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: { code: "UNAUTHORIZED", message: "Sign in required" } },
        { status: 401 }
      );
    }

    /* ── 2. Parse body ────────────────────────────────────────────── */
    const body = await request.json();
    const {
      chapterId,
      topicId,
      questionId,
      userAnswer,
      isCorrect,
      timeSpent,
      questionType,
    } = body;

    if (!chapterId || !topicId || !questionId || userAnswer === undefined) {
      return NextResponse.json(
        { ok: false, error: { code: "BAD_REQUEST", message: "Missing required fields" } },
        { status: 400 }
      );
    }

    /* ── 3. Build unique answer record ID ─────────────────────────── */
    const answerId = `ans_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    /* ── 4. Calculate rewards ─────────────────────────────────────── */
    const xpAwarded    = isCorrect ? (XP_REWARDS[questionType]    ?? XP_REWARDS.default)    : 0;
    const starsAwarded = isCorrect ? (STARS_REWARDS[questionType] ?? STARS_REWARDS.default) : 0;

    const pool = getPostgresPool();

    let newXp     = 0;
    let newLevel  = 1;
    let leveledUp = false;
    let oldLevel  = 1;

    if (xpAwarded > 0) {
      /*
       * ── 5a. Update XP atomically and get current user state.
       * We read streak too so we can check if today is a new streak day.
       */
      const userResult = await pool.query<{
        xp: number;
        level: number;
        streak: number;
        last_active: string | null;
      }>(
        `UPDATE eduquest_users
            SET xp         = xp + $1,
                updated_at = NOW()
          WHERE id = $2
          RETURNING xp, level, streak, last_active_at AS last_active`,
        [xpAwarded, user.id]
      );

      if (userResult.rows.length > 0) {
        const row = userResult.rows[0];
        oldLevel = row.level;
        newXp    = row.xp;
        newLevel = levelFromXp(newXp);

        /* ── 5b. Level up if threshold crossed ─────────────────────── */
        if (newLevel > oldLevel) {
          leveledUp = true;
          await pool.query(
            `UPDATE eduquest_users SET level = $1 WHERE id = $2`,
            [newLevel, user.id]
          );
        }

        /* ── 5c. Update daily streak record ─────────────────────────── *
         * Upsert: if a row for today already exists, increment counts.
         * If not, insert a new row and check if streak should increase.
         */
        const todayUTC = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

        await pool.query(
          `INSERT INTO eduquest_daily_streaks
             (user_id, active_date, questions_answered, xp_earned)
           VALUES ($1, $2::DATE, 1, $3)
           ON CONFLICT (user_id, active_date)
           DO UPDATE SET
             questions_answered = eduquest_daily_streaks.questions_answered + 1,
             xp_earned          = eduquest_daily_streaks.xp_earned + $3`,
          [user.id, todayUTC, xpAwarded]
        );

        /* ── 5d. Update streak counter if this is a new active day ──── *
         * Only increment streak if last_active_at was yesterday or null.
         * If last_active_at is today, streak is already counted.
         */
        const lastActive = row.last_active ? row.last_active.slice(0, 10) : null;
        const yesterday  = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);

        if (lastActive !== todayUTC) {
          /* New day — either extend streak (if yesterday) or reset to 1 */
          const newStreak = (lastActive === yesterday)
            ? row.streak + 1
            : 1;

          await pool.query(
            `UPDATE eduquest_users
                SET streak         = $1,
                    last_active_at = NOW()
              WHERE id = $2`,
            [newStreak, user.id]
          );
        }
      }

      /* ── 6. Award Stars via wallet upsert + transaction record ─────── */
      if (starsAwarded > 0) {
        /* Ensure the wallet row exists (lazy-create on first answer) */
        await pool.query(
          `INSERT INTO eduquest_wallet (user_id, balance, total_earned, total_spent)
           VALUES ($1, 0, 0, 0)
           ON CONFLICT (user_id) DO NOTHING`,
          [user.id]
        );

        /* Increment balance and total_earned atomically; get wallet id */
        const walletResult = await pool.query<{ id: string; balance: number }>(
          `UPDATE eduquest_wallet
              SET balance      = balance + $1,
                  total_earned = total_earned + $1,
                  updated_at   = NOW()
            WHERE user_id = $2
            RETURNING id, balance`,
          [starsAwarded, user.id]
        );

        /* Write an immutable ledger entry for audit purposes */
        if (walletResult.rows.length > 0) {
          const walletId     = walletResult.rows[0].id;
          const balanceAfter = walletResult.rows[0].balance;

          await pool.query(
            `INSERT INTO eduquest_wallet_transactions
               (wallet_id, amount, tx_type, description, balance_after)
             VALUES ($1, $2, 'question_correct', $3, $4)`,
            [
              walletId,
              starsAwarded,
              `Correct ${questionType ?? "mcq"} answer in topic ${topicId}`,
              balanceAfter,
            ]
          );
        }
      }
    } else {
      /* ── Wrong answer — read current state only (no writes) ─────── */
      const result = await pool.query<{ xp: number; level: number }>(
        `SELECT xp, level FROM eduquest_users WHERE id = $1`,
        [user.id]
      );
      if (result.rows.length > 0) {
        newXp    = result.rows[0].xp;
        newLevel = result.rows[0].level;
      }
    }

    console.log(
      `[progress/answers] user=${user.id} q=${questionId} correct=${isCorrect} ` +
      `xp+${xpAwarded} stars+${starsAwarded} total_xp=${newXp} level=${newLevel}`
    );

    /* ── 7. Return result ────────────────────────────────────────── */
    return NextResponse.json({
      ok: true,
      data: {
        answerId,
        xpAwarded,
        starsAwarded,
        newXp,
        newLevel,
        leveledUp,
        isCorrect: Boolean(isCorrect),
      },
    });
  } catch (error) {
    console.error("[progress/answers] Error:", error);
    return NextResponse.json(
      { ok: false, error: { code: "INTERNAL_ERROR", message: "Failed to save answer" } },
      { status: 500 }
    );
  }
}
