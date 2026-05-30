/**
 * FILE: route.ts
 * LOCATION: src/app/api/progress/chapters/[chapterId]/route.ts
 * PURPOSE: Updates chapter progress for the authenticated student.
 *          When a student answers a question correctly, this endpoint:
 *            1. Records XP earned (10 XP per correct answer by default)
 *            2. Updates the user's cumulative XP in eduquest_users
 *            3. Calculates and updates the user's level
 *            4. Returns the XP earned + new level so UI can show toast
 * METHODS: PUT (update), GET (fetch current progress)
 * USED BY: TopicStudyClient.tsx via progressLocalApi
 * DEPENDENCIES: current-user auth, PostgreSQL pool
 * LAST UPDATED: 2026-05-30
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { queryPostgres } from "@/lib/server/database/postgres";

/** XP awarded per correct answer. */
const XP_PER_CORRECT = 10;

/** XP needed for each level: level = floor(sqrt(totalXp / 50)) */
function xpToLevel(xp: number): number {
  return Math.max(1, Math.floor(Math.sqrt(xp / 50)));
}

/* ─────────────────────────────────────────────────────────────────
 * PUT /api/progress/chapters/[chapterId]
 * Body: { score: number, completed: boolean, correctCount: number, answers: string }
 * Returns: { xpEarned, totalXp, newLevel, leveledUp, oldLevel }
 * ───────────────────────────────────────────────────────────────── */
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
    const { score = 0, completed = false, correctCount = 1, answers = "" } = body;

    /* ── 1. Calculate XP earned from this update ── */
    const xpEarned = Math.max(0, correctCount * XP_PER_CORRECT);

    /* ── 2. Update user's XP and level in PostgreSQL ── */
    const oldLevel = user.level ?? 1;

    const updated = await queryPostgres<{
      id: string;
      xp: number;
      level: number;
      streak: number;
    }>(
      `UPDATE eduquest_users
          SET xp     = GREATEST(0, xp + $1),
              level  = $2,
              streak = CASE
                         WHEN streak = 0 THEN 1
                         ELSE streak
                       END
        WHERE id = $3
        RETURNING id, xp, level, streak`,
      [
        xpEarned,
        xpToLevel((user.xp ?? 0) + xpEarned),
        user.id,
      ]
    );

    const updatedUser = updated[0];
    const newLevel = updatedUser?.level ?? oldLevel;
    const totalXp = updatedUser?.xp ?? (user.xp ?? 0) + xpEarned;

    /* ── 3. Upsert into the chapter progress table ── */
    /*
     * The eduquest_user_progress table links by UUID chapter_id,
     * but our content system uses slug strings.  We store progress
     * in a separate simple key-value progress store using a JSONB column
     * in the user record. If the table doesn't yet have a slug-keyed table,
     * we fall back to a "soft-insert" approach using the audit log or
     * a simple JSON approach.
     *
     * For now we store in the notifications table as a lightweight store
     * and keep chapter progress in the users.progress_data JSONB column if
     * that column exists, otherwise we just update XP.
     */
    try {
      await queryPostgres(
        `INSERT INTO eduquest_user_progress_slug
              (user_id, chapter_slug, score, is_complete, correct_count, answers_json, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         ON CONFLICT (user_id, chapter_slug)
         DO UPDATE SET
              score        = GREATEST(eduquest_user_progress_slug.score, EXCLUDED.score),
              is_complete  = EXCLUDED.is_complete OR eduquest_user_progress_slug.is_complete,
              correct_count= GREATEST(eduquest_user_progress_slug.correct_count, EXCLUDED.correct_count),
              answers_json = EXCLUDED.answers_json,
              updated_at   = NOW()`,
        [user.id, chapterId, score, completed, correctCount > 0 ? correctCount : 0, answers || "{}"]
      );
    } catch {
      /* Table might not exist yet – create it lazily */
      try {
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
        /* Retry insert */
        await queryPostgres(
          `INSERT INTO eduquest_user_progress_slug
                (user_id, chapter_slug, score, is_complete, correct_count, answers_json, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW())
           ON CONFLICT (user_id, chapter_slug)
           DO UPDATE SET
                score        = GREATEST(eduquest_user_progress_slug.score, EXCLUDED.score),
                is_complete  = EXCLUDED.is_complete OR eduquest_user_progress_slug.is_complete,
                correct_count= GREATEST(eduquest_user_progress_slug.correct_count, EXCLUDED.correct_count),
                answers_json = EXCLUDED.answers_json,
                updated_at   = NOW()`,
          [user.id, chapterId, score, completed, correctCount > 0 ? correctCount : 0, answers || "{}"]
        );
      } catch (createErr) {
        /* Silent fallback: XP was still updated above */
        console.warn("[progress/chapters] Could not upsert slug progress:", createErr);
      }
    }

    return NextResponse.json({
      ok: true,
      data: {
        xpEarned,
        totalXp,
        newLevel,
        oldLevel,
        leveledUp: newLevel > oldLevel,
        streak: updatedUser?.streak ?? user.streak ?? 0,
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

/* ─────────────────────────────────────────────────────────────────
 * GET /api/progress/chapters/[chapterId]
 * Returns the current chapter progress for the authenticated user.
 * ───────────────────────────────────────────────────────────────── */
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

    try {
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

      const row = rows[0];
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
    } catch {
      /* Table doesn't exist yet */
      return NextResponse.json({
        ok: true,
        data: {
          chapterId,
          score: 0,
          isComplete: false,
          correctCount: 0,
          answers: "{}",
          lastUpdated: null,
          userXp: user.xp ?? 0,
          userLevel: user.level ?? 1,
        },
      });
    }
  } catch (error) {
    console.error("[progress/chapters] GET Error:", error);
    return NextResponse.json(
      { ok: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch progress" } },
      { status: 500 }
    );
  }
}
