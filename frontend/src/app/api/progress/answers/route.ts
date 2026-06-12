/**
 * FILE: route.ts
 * LOCATION: src/app/api/progress/answers/route.ts
 * PURPOSE: Comprehensive answer submission handler. When a student answers a question:
 *
 *   CORRECT ANSWER:
 *     1. Awards XP to eduquest_users (MCQ=15, short=25, long=30, deep=35)
 *     2. Recalculates and updates user level (formula: floor(1 + sqrt(XP / 100)))
 *     3. Awards Stars to eduquest_wallet (MCQ=10, short=15, long=20, deep=25)
 *     4. Writes a wallet transaction record for the Stars credit
 *     5. Upserts eduquest_daily_streaks for today (questions_answered + xp_earned)
 *     6. Updates user streak in eduquest_users if they haven't studied today yet
 *     7. Checks chapter completion milestones and awards level bonuses:
 *        - 25% chapter (10 correct) → +1 level bonus
 *        - 50% chapter (20 correct) → +1 level bonus (cumulative +2)
 *        - 75% chapter (30 correct) → +1 level bonus (cumulative +3)
 *        - 100% chapter (40 correct) → +1 level bonus (cumulative +4)
 *
 *   WRONG ANSWER:
 *     - Only reads current XP/level, no mutations.
 *
 * BODY:
 *   { chapterId, topicId, questionId, userAnswer, isCorrect, timeSpent, questionType? }
 *
 * RESPONSE:
 *   { ok, data: { answerId, xpAwarded, starsAwarded, newXp, newLevel, leveledUp,
 *                 milestoneLevels, milestoneReached } }
 *
 * LAST UPDATED: 2026-06-02
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

/*
 * Chapter milestone thresholds — number of correct answers required to
 * unlock each of the four level-bonus milestones within a chapter.
 *
 *   MILESTONE_25:  10 correct answers = "25% chapter complete"  → +1 level
 *   MILESTONE_50:  20 correct answers = "50% chapter complete"  → +1 level
 *   MILESTONE_75:  30 correct answers = "75% chapter complete"  → +1 level
 *   MILESTONE_100: 40 correct answers = "100% chapter complete" → +1 level
 *
 * Rationale: A standard Zingpath chapter has ~40 questions per topic ×
 * multiple topics. These thresholds map to practical study milestones
 * (~10 questions per session) that are achievable and motivating.
 */
const MILESTONE_THRESHOLDS = {
  25:  10,   /* 25% → needs 10 correct */
  50:  20,   /* 50% → needs 20 correct */
  75:  30,   /* 75% → needs 30 correct */
  100: 40,   /* 100% → needs 40 correct */
} as const;

/* ── Level bonus per milestone ───────────────────────────────────────── */
const MILESTONE_LEVEL_BONUS = 1;  /* Each milestone awards +1 level */

function isoDate(value: Date | string | null): string | null {
  if (!value) return null;
  return value instanceof Date
    ? value.toISOString().slice(0, 10)
    : new Date(value).toISOString().slice(0, 10);
}

function levelFromXp(xp: number): number {
  return Math.max(1, Math.min(100, Math.floor(1 + Math.sqrt(xp / 100))));
}

/* ─────────────────────────────────────────────────────────────────────
 * checkAndAwardChapterMilestones
 *
 * After a correct answer in a chapter, upserts the chapter milestone row
 * and checks whether any new milestone has been reached. For each newly
 * reached milestone, awards a level bonus by incrementing the user's level
 * directly in the database.
 *
 * Returns: { levelsAwarded, milestoneReached }
 * ───────────────────────────────────────────────────────────────────── */
async function checkAndAwardChapterMilestones(
  userId: string,
  chapterId: string,
): Promise<{ levelsAwarded: number; milestoneReached: string | null }> {
  if (!chapterId) return { levelsAwarded: 0, milestoneReached: null };

  const pool = getPostgresPool();

  try {
    /* Upsert the chapter milestone row, incrementing correct count atomically.
     * Return the updated state so we can check which milestones are newly hit. */
    const result = await pool.query<{
      questions_correct:     number;
      milestone_25_awarded:  boolean;
      milestone_50_awarded:  boolean;
      milestone_75_awarded:  boolean;
      milestone_100_awarded: boolean;
    }>(
      `INSERT INTO eduquest_chapter_milestones
         (user_id, chapter_id, questions_correct)
       VALUES ($1, $2, 1)
       ON CONFLICT (user_id, chapter_id) DO UPDATE
         SET questions_correct = eduquest_chapter_milestones.questions_correct + 1,
             updated_at        = NOW()
       RETURNING
         questions_correct,
         milestone_25_awarded,
         milestone_50_awarded,
         milestone_75_awarded,
         milestone_100_awarded`,
      [userId, chapterId],
    );

    if (result.rows.length === 0) return { levelsAwarded: 0, milestoneReached: null };

    const row = result.rows[0];
    const correct = row.questions_correct;

    /* Determine which milestone(s) have been newly reached this answer.
     * We check each threshold and only fire if:
     *   1. The new correct count crosses the threshold
     *   2. The milestone has NOT been awarded yet
     */
    let levelsAwarded  = 0;
    let milestoneLabel: string | null = null;

    const checks: Array<{
      pct: 25 | 50 | 75 | 100;
      alreadyAwarded: boolean;
      flagColumn: string;
      label: string;
    }> = [
      { pct: 25,  alreadyAwarded: row.milestone_25_awarded,  flagColumn: "milestone_25_awarded",  label: "25%" },
      { pct: 50,  alreadyAwarded: row.milestone_50_awarded,  flagColumn: "milestone_50_awarded",  label: "50%" },
      { pct: 75,  alreadyAwarded: row.milestone_75_awarded,  flagColumn: "milestone_75_awarded",  label: "75%" },
      { pct: 100, alreadyAwarded: row.milestone_100_awarded, flagColumn: "milestone_100_awarded", label: "100%" },
    ];

    for (const check of checks) {
      const threshold = MILESTONE_THRESHOLDS[check.pct];
      if (correct >= threshold && !check.alreadyAwarded) {
        /* Mark this milestone as awarded (idempotent — won't fire again) */
        await pool.query(
          `UPDATE eduquest_chapter_milestones
              SET ${check.flagColumn} = TRUE, updated_at = NOW()
            WHERE user_id = $1 AND chapter_id = $2`,
          [userId, chapterId],
        );

        /* Award the level bonus directly to the user */
        await pool.query(
          `UPDATE eduquest_users
              SET level = LEAST(100, level + $1), updated_at = NOW()
            WHERE id = $2`,
          [MILESTONE_LEVEL_BONUS, userId],
        );

        levelsAwarded++;
        milestoneLabel = check.label;

        /* Only award ONE milestone per answer (prevents multiple pop-ups on first use) */
        break;
      }
    }

    return { levelsAwarded, milestoneReached: milestoneLabel };
  } catch (err) {
    /* Milestone errors must NEVER break the core answer flow — log and continue */
    console.error("[progress/answers] Chapter milestone check failed:", err);
    return { levelsAwarded: 0, milestoneReached: null };
  }
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

    let newXp          = 0;
    let newLevel       = 1;
    let leveledUp      = false;
    let oldLevel       = 1;
    let milestoneLevels = 0;
    let milestoneReached: string | null = null;

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

        /* ── 5b. Level up if XP threshold crossed ─────────────────── */
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
        const todayUTC = new Date().toISOString().slice(0, 10);

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
        const lastActive = isoDate(row.last_active);
        const yesterday  = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);

        if (lastActive !== todayUTC) {
          const newStreak = (lastActive === yesterday) ? row.streak + 1 : 1;

          await pool.query(
            `UPDATE eduquest_users
                SET streak         = $1,
                    longest_streak = GREATEST(longest_streak, $1),
                    last_active_at = NOW()
              WHERE id = $2`,
            [newStreak, user.id]
          );
        }

        /* ── 5e. Check chapter completion milestones ─────────────────── *
         * Runs AFTER XP/streak updates so that level bonuses are additive
         * on top of the XP-based level, not overwriting it.
         */
        const milestoneResult = await checkAndAwardChapterMilestones(user.id, chapterId);
        milestoneLevels  = milestoneResult.levelsAwarded;
        milestoneReached = milestoneResult.milestoneReached;

        /* If milestone awarded extra levels, re-read final level from DB */
        if (milestoneLevels > 0) {
          const lvlResult = await pool.query<{ level: number }>(
            `SELECT level FROM eduquest_users WHERE id = $1`,
            [user.id]
          );
          if (lvlResult.rows.length > 0) {
            newLevel = lvlResult.rows[0].level;
            leveledUp = true;  /* Milestone = level up too */
          }
        }
      }

      /* ── 6. Award Stars via wallet upsert + transaction record ─────── */
      if (starsAwarded > 0) {
        await pool.query(
          `INSERT INTO eduquest_wallet (user_id, balance, total_earned, total_spent)
           VALUES ($1, 0, 0, 0)
           ON CONFLICT (user_id) DO NOTHING`,
          [user.id]
        );

        const walletResult = await pool.query<{ id: string; balance: number }>(
          `UPDATE eduquest_wallet
              SET balance      = balance + $1,
                  total_earned = total_earned + $1,
                  updated_at   = NOW()
            WHERE user_id = $2
            RETURNING id, balance`,
          [starsAwarded, user.id]
        );

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
      `xp+${xpAwarded} stars+${starsAwarded} total_xp=${newXp} level=${newLevel}` +
      (milestoneLevels > 0 ? ` MILESTONE:${milestoneReached}(+${milestoneLevels}lvl)` : "")
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
        isCorrect:       Boolean(isCorrect),
        /* Milestone fields — used by the frontend to show a celebration banner */
        milestoneLevels,
        milestoneReached,
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
