/**
 * FILE: route.ts
 * LOCATION: src/app/api/progress/route.ts
 * PURPOSE: Returns the authenticated user's overall learning progress.
 *          Queries PostgreSQL for real chapter progress data so the
 *          dashboard and study pages display accurate scores and counts.
 *
 * ENDPOINTS:
 *   GET /api/progress — Get user's complete progress data
 *
 * USED BY: Dashboard, TopicStudyClient.tsx
 * DEPENDENCIES: current-user auth, PostgreSQL pool
 * LAST UPDATED: 2026-05-30
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { queryPostgres } from "@/lib/server/database/postgres";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: { code: "UNAUTHORIZED", message: "Sign in required" } },
        { status: 401 }
      );
    }

    /* ── Query real chapter progress from the slug-based progress table ── */
    let chaptersData: Array<{
      chapter_slug: string;
      score: number;
      is_complete: boolean;
      correct_count: number;
      answers_json: string;
      updated_at: string;
    }> = [];

    try {
      const result = await queryPostgres<{
        chapter_slug: string;
        score: number;
        is_complete: boolean;
        correct_count: number;
        answers_json: string;
        updated_at: string;
      }>(
        `SELECT chapter_slug, score, is_complete, correct_count, answers_json, updated_at
           FROM eduquest_user_progress_slug
          WHERE user_id = $1
          ORDER BY updated_at DESC`,
        [user.id]
      );
      chaptersData = result.rows;
    } catch {
      /* Table may not exist yet — return defaults */
    }

    /* ── Aggregate stats across all chapters ── */
    let totalCorrect = 0;
    let totalAnswered = 0;
    let chaptersCompleted = 0;
    const chapters: Record<string, {
      completed: boolean;
      score: number;
      questionsAnswered: number;
      correctCount: number;
      lastAccessed: string;
    }> = {};

    for (const row of chaptersData) {
      totalCorrect += row.correct_count;
      if (row.is_complete) chaptersCompleted++;

      /* Try to parse the answers JSON to count total answered */
      let answeredCount = row.correct_count;
      try {
        const parsed = JSON.parse(row.answers_json || "{}");
        if (parsed.answeredQuestions && Array.isArray(parsed.answeredQuestions)) {
          answeredCount = parsed.answeredQuestions.length;
        }
      } catch {
        /* Fallback to correct_count */
      }
      totalAnswered += answeredCount;

      chapters[row.chapter_slug] = {
        completed: row.is_complete,
        score: row.score,
        questionsAnswered: answeredCount,
        correctCount: row.correct_count,
        lastAccessed: row.updated_at,
      };
    }

    /* ── Build the full progress response ── */
    const progressData = {
      userId: user.id,
      level: user.level || 1,
      xp: user.xp || 0,
      streak: user.streak || 0,
      chaptersCompleted,
      questionsAnswered: totalAnswered,
      correctAnswers: totalCorrect,
      totalTimeSpent: 0,
      chapters,
      /* Include a flat array for easy iteration by TopicStudyClient */
      progress: chaptersData.map((row) => ({
        chapterId: row.chapter_slug,
        score: row.score,
        isComplete: row.is_complete,
        correctCount: row.correct_count,
        answers: row.answers_json,
        lastUpdated: row.updated_at,
      })),
    };

    return NextResponse.json({
      ok: true,
      data: progressData,
    }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Pragma": "no-cache",
      },
    });
  } catch (error) {
    console.error("[progress] Error:", error);
    return NextResponse.json(
      { ok: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch progress" } },
      { status: 500 }
    );
  }
}
