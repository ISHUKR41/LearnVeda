/**
 * FILE: route.ts
 * LOCATION: src/app/api/activity/route.ts
 * PURPOSE: Returns daily activity data for the last N days for a given user.
 *          Drives the GitHub-style contribution graph on the dashboard.
 *
 *          Activity is derived from the eduquest_user_progress_slug table
 *          (chapter completions by updated_at date). Falls back to empty data
 *          gracefully if the table does not exist yet.
 *
 * ENDPOINT:
 *   GET /api/activity?userId=<id>&days=84
 *
 * RESPONSE:
 *   {
 *     ok: true,
 *     data: {
 *       days:          ActivityDay[],
 *       totalDays:     number,
 *       activeDays:    number,
 *       currentStreak: number,
 *       longestStreak: number,
 *     }
 *   }
 *
 * intensity values:
 *   0 = no activity  (gray cell)
 *   1 = 1–2 chapters (lightest green)
 *   2 = 3–5 chapters (medium green)
 *   3 = 6–10 chapters (dark green)
 *   4 = 11+ chapters  (darkest green)
 *
 * LAST UPDATED: 2026-05-31
 */

import { type NextRequest, NextResponse } from "next/server";
import { getPostgresPool } from "@/lib/server/database/postgres";

export const runtime = "nodejs";

/* ─── Intensity thresholds ──────────────────────────────────────────────────── */
function toIntensity(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0)  return 0;
  if (count <= 2)   return 1;
  if (count <= 5)   return 2;
  if (count <= 10)  return 3;
  return 4;
}

/* ─── Build an array of ISO date strings for the last N days ───────────────── */
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

/* ─── GET handler ────────────────────────────────────────────────────────────── */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const userId   = searchParams.get("userId");
  const daysParam = parseInt(searchParams.get("days") ?? "84", 10);

  if (!userId) {
    return NextResponse.json(
      { ok: false, error: { message: "userId query parameter is required." } },
      { status: 400 },
    );
  }

  const days = Math.min(Math.max(daysParam, 7), 365);
  const pool = getPostgresPool();

  try {
    /*
     * Query chapter completions grouped by day from eduquest_user_progress_slug.
     * Each row is an answered chapter — we count how many distinct chapters
     * the user interacted with per day.
     * Falls back to 0 rows if the table doesn't exist (caught below).
     */
    let activityMap: Record<string, number> = {};
    let currentStreak = 0;
    let longestStreak = 0;

    try {
      const actResult = await pool.query<{ activity_date: string; chapter_count: string }>(
        `SELECT
           TO_CHAR(updated_at::DATE, 'YYYY-MM-DD') AS activity_date,
           COUNT(DISTINCT chapter_slug)::TEXT       AS chapter_count
         FROM eduquest_user_progress_slug
         WHERE user_id    = $1
           AND updated_at >= NOW() - ($2 || ' days')::INTERVAL
         GROUP BY updated_at::DATE
         ORDER BY activity_date ASC`,
        [userId, days],
      );

      for (const row of actResult.rows) {
        activityMap[row.activity_date] = parseInt(row.chapter_count, 10) || 0;
      }
    } catch {
      /* Table not created yet — activity map stays empty */
    }

    /* Fetch streak from the users table (always exists) */
    try {
      const userResult = await pool.query<{ streak: number | null }>(
        `SELECT streak FROM eduquest_users WHERE id = $1`,
        [userId],
      );
      currentStreak = userResult.rows[0]?.streak ?? 0;
      longestStreak = currentStreak; /* best approximation without a separate column */
    } catch {
      /* Non-fatal: leave streaks at 0 */
    }

    /* Build the full day-by-day array */
    const dateRange = buildDateRange(days);
    const dayRows = dateRange.map(date => ({
      date,
      count:     activityMap[date] ?? 0,
      intensity: toIntensity(activityMap[date] ?? 0),
    }));

    const activeDays = dayRows.filter(d => d.count > 0).length;

    const response = NextResponse.json({
      ok: true,
      data: {
        days:          dayRows,
        totalDays:     dayRows.length,
        activeDays,
        currentStreak,
        longestStreak,
      },
    });

    response.headers.set("Cache-Control", "private, max-age=30, stale-while-revalidate=60");
    return response;

  } catch (err) {
    console.error("[API /api/activity] Error:", err);
    /* Return empty data instead of 500 so the dashboard still renders */
    const dateRange = buildDateRange(days);
    return NextResponse.json({
      ok: true,
      data: {
        days:          dateRange.map(date => ({ date, count: 0, intensity: 0 })),
        totalDays:     dateRange.length,
        activeDays:    0,
        currentStreak: 0,
        longestStreak: 0,
      },
    });
  }
}
