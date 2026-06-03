/**
 * FILE: route.ts
 * LOCATION: src/app/api/activity/route.ts
 * PURPOSE: Returns authenticated-user daily activity for the dashboard
 *          contribution graph. The API never trusts a browser-supplied userId.
 *
 * ENDPOINT:
 *   GET /api/activity?days=84
 *
 * LAST UPDATED: 2026-06-01
 */

import { type NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { getPostgresPool } from "@/lib/server/database/postgres";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toIntensity(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
}

function buildDateRange(days: number): string[] {
  const dates: string[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }

  return dates;
}

async function readActivityMap(
  pool: ReturnType<typeof getPostgresPool>,
  userId: string,
  days: number,
): Promise<Record<string, number>> {
  const activityMap: Record<string, number> = {};

  try {
    const result = await pool.query<{ activity_date: string; question_count: string }>(
      `SELECT
         TO_CHAR(active_date, 'YYYY-MM-DD') AS activity_date,
         questions_answered::TEXT           AS question_count
       FROM eduquest_daily_streaks
       WHERE user_id = $1
         AND active_date >= CURRENT_DATE - ($2::INTEGER - 1)
       ORDER BY active_date ASC`,
      [userId, days],
    );

    for (const row of result.rows) {
      activityMap[row.activity_date] = parseInt(row.question_count, 10) || 0;
    }

    return activityMap;
  } catch {
    /* Older deployments may not have daily streak rows yet. */
  }

  try {
    const result = await pool.query<{ activity_date: string; chapter_count: string }>(
      `SELECT
         TO_CHAR(updated_at::DATE, 'YYYY-MM-DD') AS activity_date,
         COUNT(DISTINCT chapter_slug)::TEXT       AS chapter_count
       FROM eduquest_user_progress_slug
       WHERE user_id = $1
         AND updated_at >= NOW() - ($2 || ' days')::INTERVAL
       GROUP BY updated_at::DATE
       ORDER BY activity_date ASC`,
      [userId, days],
    );

    for (const row of result.rows) {
      activityMap[row.activity_date] = parseInt(row.chapter_count, 10) || 0;
    }
  } catch {
    /* No progress table yet. The graph will render empty, not broken. */
  }

  return activityMap;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json(
      { ok: false, error: { message: "Please sign in to view activity." } },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const daysParam = parseInt(searchParams.get("days") ?? "84", 10);
  const days = Math.min(Math.max(daysParam, 7), 365);
  const pool = getPostgresPool();

  try {
    const activityMap = await readActivityMap(pool, user.id, days);

    let currentStreak = user.streak ?? 0;
    let longestStreak = currentStreak;

    try {
      const result = await pool.query<{ streak: number | null; longest_streak: number | null }>(
        `SELECT streak, longest_streak FROM eduquest_users WHERE id = $1`,
        [user.id],
      );
      currentStreak = result.rows[0]?.streak ?? currentStreak;
      longestStreak = result.rows[0]?.longest_streak ?? currentStreak;
    } catch {
      /* Non-fatal: user snapshot still has the current streak. */
    }

    const dayRows = buildDateRange(days).map((date) => {
      const count = activityMap[date] ?? 0;
      return { date, count, intensity: toIntensity(count) };
    });

    const response = NextResponse.json({
      ok: true,
      data: {
        days: dayRows,
        totalDays: dayRows.length,
        activeDays: dayRows.filter((d) => d.count > 0).length,
        currentStreak,
        longestStreak,
      },
    });

    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch (err) {
    console.error("[API /api/activity] Error:", err);
    const dayRows = buildDateRange(days).map((date) => ({ date, count: 0, intensity: 0 }));

    return NextResponse.json({
      ok: true,
      data: {
        days: dayRows,
        totalDays: dayRows.length,
        activeDays: 0,
        currentStreak: user.streak ?? 0,
        longestStreak: user.streak ?? 0,
      },
    });
  }
}
