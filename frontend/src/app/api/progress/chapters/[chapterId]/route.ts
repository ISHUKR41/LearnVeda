import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { queryPostgres } from "@/lib/server/database/postgres";

export const runtime = "nodejs";

function levelMilestoneFromScore(score: number): number {
  return Math.max(0, Math.min(4, Math.floor(Math.max(0, score) / 25)));
}

async function ensureSlugProgressTable() {
  await queryPostgres(
    `CREATE TABLE IF NOT EXISTS eduquest_user_progress_slug (
      id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id       TEXT NOT NULL,
      chapter_slug  TEXT NOT NULL,
      score         INTEGER NOT NULL DEFAULT 0,
      is_complete   BOOLEAN NOT NULL DEFAULT FALSE,
      correct_count INTEGER NOT NULL DEFAULT 0,
      answers_json  TEXT NOT NULL DEFAULT '{}',
      updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (user_id, chapter_slug)
    )`,
    []
  );
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ chapterId: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: { code: "UNAUTHORIZED", message: "Sign in required" } },
        { status: 401 }
      );
    }

    const { chapterId } = await context.params;
    const body = await request.json();
    const normalizedScore = Math.max(0, Math.min(100, Number(body.score ?? 0) || 0));
    const completed = Boolean(body.completed);
    const correctCount = Math.max(0, Number(body.correctCount ?? 0) || 0);
    const answers = typeof body.answers === "string" && body.answers.trim() ? body.answers : "{}";

    await ensureSlugProgressTable();

    const previous = await queryPostgres<{
      score: number;
      is_complete: boolean;
    }>(
      `SELECT score, is_complete
         FROM eduquest_user_progress_slug
        WHERE user_id = $1 AND chapter_slug = $2
        LIMIT 1`,
      [user.id, chapterId]
    );

    const previousScore = previous.rows[0]?.score ?? 0;
    const wasComplete = previous.rows[0]?.is_complete ?? false;
    const oldMilestone = wasComplete ? 4 : levelMilestoneFromScore(previousScore);
    const newMilestone = completed ? 4 : levelMilestoneFromScore(normalizedScore);
    const levelsAwarded = Math.max(0, newMilestone - oldMilestone);

const LEVEL_XP_THRESHOLDS = [0, 150, 400, 800, 1400, 2200, 3200, 4500, 6200, 8500];

    const oldLevel = user.level ?? 1;
    let newLevel = oldLevel;
    let totalXp = user.xp ?? 0;
    let streak = user.streak ?? 0;

    if (levelsAwarded > 0) {
      const targetLevel = Math.min(10, oldLevel + levelsAwarded);
      const targetMinXp = LEVEL_XP_THRESHOLDS[targetLevel - 1] ?? 0;

      const updated = await queryPostgres<{
        xp: number;
        level: number;
        streak: number;
      }>(
        `UPDATE eduquest_users
            SET level = $1,
                xp = GREATEST(xp, $2),
                streak = CASE WHEN streak = 0 THEN 1 ELSE streak END,
                updated_at = NOW()
          WHERE id = $3
          RETURNING xp, level, streak`,
        [targetLevel, targetMinXp, user.id]
      );

      newLevel = updated.rows[0]?.level ?? targetLevel;
      totalXp = updated.rows[0]?.xp ?? totalXp;
      streak = updated.rows[0]?.streak ?? streak;
    }

    await queryPostgres(
      `INSERT INTO eduquest_user_progress_slug
            (user_id, chapter_slug, score, is_complete, correct_count, answers_json, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       ON CONFLICT (user_id, chapter_slug)
       DO UPDATE SET
            score         = GREATEST(eduquest_user_progress_slug.score, EXCLUDED.score),
            is_complete   = EXCLUDED.is_complete OR eduquest_user_progress_slug.is_complete,
            correct_count = GREATEST(eduquest_user_progress_slug.correct_count, EXCLUDED.correct_count),
            answers_json  = EXCLUDED.answers_json,
            updated_at    = NOW()`,
      [user.id, chapterId, normalizedScore, completed, correctCount, answers]
    );

    return NextResponse.json({
      ok: true,
      data: {
        xpEarned: 0,
        levelsAwarded,
        totalXp,
        newLevel,
        oldLevel,
        leveledUp: newLevel > oldLevel,
        streak,
      },
    });
  } catch (error) {
    console.error("[progress/chapters] Error:", error);
    return NextResponse.json(
      { ok: false, error: { code: "INTERNAL_ERROR", message: "Failed to update progress" } },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ chapterId: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: { code: "UNAUTHORIZED", message: "Sign in required" } },
        { status: 401 }
      );
    }

    const { chapterId } = await context.params;
    await ensureSlugProgressTable();

    const rows = await queryPostgres<{
      score: number;
      is_complete: boolean;
      correct_count: number;
      answers_json: string;
      updated_at: string;
    }>(
      `SELECT score, is_complete, correct_count, answers_json, updated_at
         FROM eduquest_user_progress_slug
        WHERE user_id = $1 AND chapter_slug = $2
        LIMIT 1`,
      [user.id, chapterId]
    );

    const row = rows.rows[0];
    return NextResponse.json({
      ok: true,
      data: {
        chapterId,
        score: row?.score ?? 0,
        isComplete: row?.is_complete ?? false,
        correctCount: row?.correct_count ?? 0,
        answers: row?.answers_json ?? "{}",
        lastUpdated: row?.updated_at ?? null,
        userXp: user.xp ?? 0,
        userLevel: user.level ?? 1,
      },
    });
  } catch (error) {
    console.error("[progress/chapters] GET Error:", error);
    return NextResponse.json(
      { ok: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch progress" } },
      { status: 500 }
    );
  }
}
