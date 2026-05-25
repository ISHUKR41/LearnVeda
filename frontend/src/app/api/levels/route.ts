/**
 * FILE: route.ts
 * LOCATION: src/app/api/levels/route.ts
 * PURPOSE: Level system API — returns XP thresholds, badge data, and perks
 *          for all 100 levels or for a specific level number.
 *
 *          Clients use this to:
 *          1. Render the XP progress bar on the dashboard (current + next level).
 *          2. Show the "Level up!" celebration modal with new perks.
 *          3. Display level badges on leaderboard rows.
 *
 * ROUTES:
 *   GET /api/levels              → All 100 levels (cached 24h, rarely changes)
 *   GET /api/levels?n=10         → Single level by number (for progress bar)
 *   GET /api/levels?user_level=7 → Returns levels N and N+1 for progress bar
 *
 * CACHING:
 *   Level data almost never changes after initial seeding.
 *   We serve it with a 24-hour CDN cache + stale-while-revalidate.
 *
 * USED BY: Dashboard XP bar, Leaderboard badge row, Level-up modal
 * DEPENDENCIES: getPostgresPool, api-response helpers
 * LAST UPDATED: 2026-05-25
 */

import { type NextRequest } from "next/server";
import { getPostgresPool } from "@/lib/server/database/postgres";
import { apiSuccess, apiError } from "@/lib/server/utils/api-response";

/* Force Node.js runtime — required for the PostgreSQL pool */
export const runtime = "nodejs";

/*
 * Aggressive caching: level definitions rarely change.
 * 24-hour max-age + 1-week stale-while-revalidate means CDNs and Next.js
 * Data Cache will serve this without hitting the DB most of the time.
 */
const LEVELS_CACHE_HEADERS = {
  "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
} as const;

/* ─────────────────────────────────────────────
 * GET /api/levels
 * ───────────────────────────────────────────── */

/**
 * Returns level data from the eduquest_levels table.
 *
 * Query modes:
 *   ?n=10          → Single level (for badge display)
 *   ?user_level=7  → Returns level 7 and 8 (for dashboard XP bar)
 *   (no params)    → All 100 levels (for the full progression screen)
 *
 * Single level response:
 * {
 *   ok: true,
 *   data: {
 *     level: { levelNumber, xpRequired, xpToNext, title, badgeName, badgeIcon, badgeColor, perks }
 *   }
 * }
 *
 * User level progress response:
 * {
 *   ok: true,
 *   data: {
 *     current: Level,
 *     next: Level | null   (null when user is level 100)
 *   }
 * }
 *
 * All levels response:
 * {
 *   ok: true,
 *   data: { levels: Level[], total: 100 }
 * }
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pool = getPostgresPool();

  /* ── Mode 1: Single level by number (?n=10) ──────────────── */
  const nParam = searchParams.get("n");
  if (nParam !== null) {
    const n = parseInt(nParam, 10);
    if (isNaN(n) || n < 1 || n > 100) {
      return apiError("INVALID_LEVEL", "Level number must be between 1 and 100.", 400);
    }

    try {
      const result = await pool.query(
        `SELECT
           level_number  AS "levelNumber",
           xp_required   AS "xpRequired",
           xp_to_next    AS "xpToNext",
           title,
           badge_name    AS "badgeName",
           badge_icon    AS "badgeIcon",
           badge_color   AS "badgeColor",
           perks
         FROM eduquest_levels
         WHERE level_number = $1`,
        [n],
      );

      if (result.rows.length === 0) {
        return apiError("LEVEL_NOT_FOUND", `Level ${n} not found in the database.`, 404);
      }

      return apiSuccess({ level: result.rows[0] }, { headers: LEVELS_CACHE_HEADERS });
    } catch (err) {
      console.error("[GET /api/levels] DB error:", err);
      return apiError("DB_ERROR", "Failed to fetch level data.", 500);
    }
  }

  /* ── Mode 2: Current + next levels for dashboard progress bar (?user_level=7) ── */
  const userLevelParam = searchParams.get("user_level");
  if (userLevelParam !== null) {
    const userLevel = parseInt(userLevelParam, 10);
    if (isNaN(userLevel) || userLevel < 1 || userLevel > 100) {
      return apiError("INVALID_LEVEL", "user_level must be between 1 and 100.", 400);
    }

    try {
      /*
       * Fetch the current level and the next level in one query using a WHERE IN.
       * If userLevel = 100, there is no next level — the query returns 1 row.
       */
      const result = await pool.query(
        `SELECT
           level_number  AS "levelNumber",
           xp_required   AS "xpRequired",
           xp_to_next    AS "xpToNext",
           title,
           badge_name    AS "badgeName",
           badge_icon    AS "badgeIcon",
           badge_color   AS "badgeColor",
           perks
         FROM eduquest_levels
         WHERE level_number IN ($1, $2)
         ORDER BY level_number ASC`,
        [userLevel, userLevel + 1],
      );

      const current = result.rows.find((r) => r.levelNumber === userLevel) ?? null;
      const next    = result.rows.find((r) => r.levelNumber === userLevel + 1) ?? null;

      return apiSuccess({ current, next }, { headers: LEVELS_CACHE_HEADERS });
    } catch (err) {
      console.error("[GET /api/levels] DB error:", err);
      return apiError("DB_ERROR", "Failed to fetch level progress data.", 500);
    }
  }

  /* ── Mode 3: All 100 levels (full progression screen) ────── */
  try {
    const result = await pool.query(
      `SELECT
         level_number  AS "levelNumber",
         xp_required   AS "xpRequired",
         xp_to_next    AS "xpToNext",
         title,
         badge_name    AS "badgeName",
         badge_icon    AS "badgeIcon",
         badge_color   AS "badgeColor",
         perks
       FROM eduquest_levels
       ORDER BY level_number ASC`,
    );

    return apiSuccess(
      { levels: result.rows, total: result.rows.length },
      { headers: LEVELS_CACHE_HEADERS },
    );
  } catch (err) {
    console.error("[GET /api/levels] DB error:", err);
    return apiError("DB_ERROR", "Failed to fetch all levels.", 500);
  }
}
