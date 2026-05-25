/*
 * FILE: route.ts
 * LOCATION: src/app/api/activity/route.ts
 * PURPOSE: Returns daily activity data for the last N days for a given user.
 *          This drives the GitHub-style contribution graph on the dashboard.
 *
 * ENDPOINTS:
 *   GET /api/activity?userId=<uuid>&days=180
 *
 *   userId (required) — the user whose activity history to fetch.
 *   days   (optional) — number of past days to return, default 180, max 365.
 *
 * RESPONSE FORMAT:
 *   {
 *     ok: true,
 *     data: {
 *       days: [
 *         { date: "2026-04-01", count: 12, intensity: 2 },
 *         ...
 *       ],
 *       totalDays: 180,
 *       activeDays: 47,
 *       longestStreak: 34,
 *       currentStreak: 14,
 *     }
 *   }
 *
 *   intensity values:
 *     0 = no activity  (gray cell)
 *     1 = 1–5 answers  (lightest green)
 *     2 = 6–20 answers (medium green)
 *     3 = 21–50 answers (dark green)
 *     4 = 51+ answers  (darkest green)
 *
 * DATABASE TABLES READ:
 *   eduquest_daily_streaks  — one row per (user_id, date) with questions_solved
 *   eduquest_users          — current_streak, longest_streak for quick access
 *
 * CACHING:
 *   Private, short TTL (30 s) so streak updates reflect quickly.
 *
 * LAST UPDATED: 2026-05-25
 */

import { type NextRequest, NextResponse } from "next/server";
import { getPostgresPool } from "@/lib/server/database/postgres";

/* ─── Intensity thresholds — questions solved → visual intensity level ──────── */
function toIntensity(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0)  return 0;
  if (count <= 5)   return 1;
  if (count <= 20)  return 2;
  if (count <= 50)  return 3;
  return 4;
}

/* ─── GET handler ────────────────────────────────────────────────────────────── */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const daysParam = parseInt(searchParams.get("days") ?? "180", 10);

  /* userId is required — without it we cannot fetch user-specific data */
  if (!userId) {
    return NextResponse.json(
      { ok: false, error: { message: "userId query parameter is required." } },
      { status: 400 }
    );
  }

  /* Cap the lookback window to 365 days to prevent expensive queries */
  const days = Math.min(Math.max(daysParam, 7), 365);

  try {
    const pool = getPostgresPool();

    /*
     * Fetch daily streak rows for the requested window.
     * We use generate_series to ensure every date in the range has a row,
     * filling missing dates with count = 0.
     */
    const result = await pool.query<{ date: string; count: number }>(`
      WITH date_range AS (
        SELECT generate_series(
          (CURRENT_DATE - ($2 || ' days')::INTERVAL)::DATE,
          CURRENT_DATE,
          '1 day'::INTERVAL
        )::DATE AS day
      )
      SELECT
        TO_CHAR(dr.day, 'YYYY-MM-DD') AS date,
        COALESCE(ds.questions_solved, 0)  AS count
      FROM date_range dr
      LEFT JOIN eduquest_daily_streaks ds
             ON ds.streak_date = dr.day
            AND ds.user_id     = $1
      ORDER BY dr.day ASC
    `, [userId, days]);

    /* Build the day objects */
    const dayRows = result.rows.map(r => ({
      date:      r.date,
      count:     Number(r.count),
      intensity: toIntensity(Number(r.count)),
    }));

    /* Count active days (days where at least 1 question was answered) */
    const activeDays = dayRows.filter(d => d.count > 0).length;

    /*
     * Fetch the user's current and longest streak from the users table.
     * This is faster than computing it from the activity log.
     */
    const userResult = await pool.query<{ streak: number; longest_streak: number }>(
      `SELECT streak, longest_streak FROM eduquest_users WHERE id = $1`,
      [userId]
    );

    const userRow = userResult.rows[0];

    const response = NextResponse.json({
      ok: true,
      data: {
        days:           dayRows,
        totalDays:      dayRows.length,
        activeDays,
        currentStreak:  userRow?.streak         ?? 0,
        longestStreak:  userRow?.longest_streak  ?? 0,
      },
    });

    /* Short private cache — user data changes frequently */
    response.headers.set("Cache-Control", "private, max-age=30, stale-while-revalidate=60");
    return response;

  } catch (err) {
    console.error("[API /api/activity] Error:", err);
    return NextResponse.json(
      { ok: false, error: { message: "Failed to load activity data." } },
      { status: 500 }
    );
  }
}
