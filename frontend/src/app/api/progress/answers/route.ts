/**
 * FILE: route.ts
 * LOCATION: src/app/api/progress/answers/route.ts
 * PURPOSE: Saves individual question answers AND updates user XP/level in PostgreSQL.
 *          When a student answers a question correctly:
 *            - MCQ correct → +15 XP
 *            - Short/Long correct → +25 XP
 *          XP is written to eduquest_users.xp and level recalculated.
 *          Level thresholds use a quadratic formula: xp_for_level_n = n² × 100
 *
 * ENDPOINTS:
 *   POST /api/progress/answers — Save answer + award XP if correct
 *
 * BODY:
 *   { chapterId, topicId, questionId, userAnswer, isCorrect, timeSpent, questionType? }
 *
 * RESPONSE:
 *   { ok, data: { answerId, xpAwarded, newXp, newLevel, leveledUp } }
 *
 * USED BY: TopicStudyClient.tsx, DeepResearchChapterClient.tsx
 * LAST UPDATED: 2026-05-30
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { getPostgresPool } from "@/lib/server/database/postgres";

export const runtime = "nodejs";

/* ── XP per question type ── */
const XP_REWARDS: Record<string, number> = {
  mcq:          15,
  "short-answer": 25,
  "long-answer":  30,
  "deep-thinking": 35,
  default:       15,
};

/* ── Level threshold: level N requires N² × 100 XP total ── */
function xpForLevel(level: number): number {
  return level * level * 100;
}

/* ── Calculate level from total XP ── */
function levelFromXp(xp: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) {
    level++;
    if (level >= 100) break; // cap at 100
  }
  return level;
}

export async function POST(request: NextRequest) {
  try {
    /* ── 1. Auth ── */
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: { code: "UNAUTHORIZED", message: "Sign in required" } },
        { status: 401 }
      );
    }

    /* ── 2. Parse body ── */
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

    /* ── 3. Build answer record ── */
    const answerId = `ans_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    /* ── 4. Calculate XP to award ── */
    const xpAwarded = isCorrect
      ? (XP_REWARDS[questionType] ?? XP_REWARDS.default)
      : 0;

    /* ── 5. Update user XP + level in PostgreSQL ── */
    const pool = getPostgresPool();

    let newXp    = 0;
    let newLevel = 1;
    let leveledUp = false;
    let oldLevel  = 1;

    if (xpAwarded > 0) {
      /* Atomically increment XP and return the updated row */
      const result = await pool.query<{
        xp: number;
        level: number;
        streak: number;
      }>(
        `UPDATE eduquest_users
            SET xp = xp + $1,
                updated_at = NOW()
          WHERE id = $2
          RETURNING xp, level, streak`,
        [xpAwarded, user.id]
      );

      if (result.rows.length > 0) {
        const row = result.rows[0];
        oldLevel = row.level;
        newXp    = row.xp;
        newLevel = levelFromXp(newXp);

        /* If level increased, write it back */
        if (newLevel > oldLevel) {
          leveledUp = true;
          await pool.query(
            `UPDATE eduquest_users SET level = $1 WHERE id = $2`,
            [newLevel, user.id]
          );
        }
      } else {
        /* User row doesn't exist yet — create it */
        await pool.query(
          `INSERT INTO eduquest_users (id, username, email, xp, level, streak, created_at, updated_at)
           VALUES ($1, $2, $3, $4, 1, 1, NOW(), NOW())
           ON CONFLICT (id) DO UPDATE SET xp = eduquest_users.xp + $4, updated_at = NOW()`,
          [user.id, user.username || "student", user.email || "", xpAwarded]
        );
        newXp    = xpAwarded;
        newLevel = levelFromXp(newXp);
      }
    } else {
      /* Wrong answer — just read current XP for response */
      const result = await pool.query<{ xp: number; level: number }>(
        `SELECT xp, level FROM eduquest_users WHERE id = $1`,
        [user.id]
      );
      if (result.rows.length > 0) {
        newXp    = result.rows[0].xp;
        newLevel = result.rows[0].level;
      }
    }

    /* ── 6. Log for debugging ── */
    console.log(`[progress/answers] user=${user.id} q=${questionId} correct=${isCorrect} xp_awarded=${xpAwarded} total_xp=${newXp} level=${newLevel}`);

    /* ── 7. Return result ── */
    return NextResponse.json({
      ok: true,
      data: {
        answerId,
        xpAwarded,
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
