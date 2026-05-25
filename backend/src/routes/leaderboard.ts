/**
 * FILE: leaderboard.ts
 * LOCATION: backend/src/routes/leaderboard.ts
 * PURPOSE: REST API routes for the EduQuest global leaderboard.
 *          Supports filtering by scope (global, class-9, class-10, class-11,
 *          class-12, engineering) and returns paginated ranked entries.
 *          Tuned for high concurrent loads using the hybrid cache layer.
 * USED BY: backend/src/index.ts → /api/leaderboard
 * DEPENDENCIES: express, pg Pool (database/pool), ../config/cache
 * LAST UPDATED: 2026-05-24
 *
 * Endpoints:
 *  GET /api/leaderboard              — top 50 entries, scope=global by default (cached)
 *  GET /api/leaderboard/:userId      — single user's rank in a given scope (cached)
 */

import { Router, Request, Response } from "express";
import pool from "../config/database";
import { cache, CACHE_TTL } from "../config/cache";

const router = Router();

/* ─────────────────────────────────────────────
 * Valid scope values — prevents SQL injection via the scope query param.
 * ───────────────────────────────────────────── */
const VALID_SCOPES = new Set([
  "global",
  "class-9",
  "class-10",
  "class-11",
  "class-12",
  "engineering",
]);

/* ─────────────────────────────────────────────
 * GET /api/leaderboard
 * Returns the top N students sorted by XP descending.
 * Cached for 2 minutes to prevent heavy DB rankings scans.
 *
 * Query params:
 *  scope  — one of VALID_SCOPES (default: "global")
 *  limit  — number of entries to return (default: 50, max: 100)
 *  offset — pagination offset (default: 0)
 *
 * Response:
 *  { ok: true, data: { scope, entries: LeaderboardEntry[], total } }
 * ───────────────────────────────────────────── */
router.get("/", async (req: Request, res: Response) => {
  const scope = VALID_SCOPES.has(String(req.query.scope))
    ? String(req.query.scope)
    : "global";

  const limit  = Math.min(parseInt(String(req.query.limit  ?? "50"), 10), 100);
  const offset = Math.max(parseInt(String(req.query.offset ?? "0"),  10), 0);

  const cacheKey = `leaderboard:${scope}:l_${limit}:o_${offset}`;

  try {
    const cachedLeaderboard = await cache.getOrSet(cacheKey, async () => {
      /*
       * Build the WHERE clause based on scope.
       * For "global" we return all users; for class/engineering scopes we
       * filter on the user's classLevel.
       */
      const whereClause = scope === "global"
        ? "WHERE u.role = 'STUDENT' AND u.\"isActive\" = TRUE"
        : "WHERE u.role = 'STUDENT' AND u.\"isActive\" = TRUE AND LOWER(u.\"classLevel\") = LOWER($3)";

      const params: (string | number)[] = [limit, offset];
      if (scope !== "global") params.push(scope);

      // Fetch leaderboard entries with rank window function
      const queryText = `
        SELECT
          u.id                                      AS "userId",
          u.name,
          u.xp,
          u."currentLevel"                          AS level,
          u."currentStreak"                         AS streak,
          COALESCE(u."classLevel", 'general')       AS track,
          RANK() OVER (ORDER BY u.xp DESC)          AS rank,
          UPPER(LEFT(COALESCE(u.name, 'A'), 2))     AS initials
        FROM "User" u
        ${whereClause}
        ORDER BY u.xp DESC
        LIMIT $1 OFFSET $2
      `;

      // Also get the total count of student users for pagination calculation
      const countParams = scope !== "global" ? [scope] : [];
      const countQuery = `
        SELECT COUNT(*)::int AS total
        FROM "User" u
        ${scope === "global" ? "WHERE u.role = 'STUDENT' AND u.\"isActive\" = TRUE" : "WHERE u.role = 'STUDENT' AND u.\"isActive\" = TRUE AND LOWER(u.\"classLevel\") = LOWER($1)"}
      `;

      const [entriesResult, countResult] = await Promise.all([
        pool.query(queryText, params),
        pool.query(countQuery, countParams)
      ]);

      return {
        entries: entriesResult.rows,
        total: countResult.rows[0]?.total ?? 0
      };
    }, CACHE_TTL.LEADERBOARD);

    res.json({
      ok: true,
      data: {
        scope,
        entries: cachedLeaderboard.entries,
        total: cachedLeaderboard.total,
        limit,
        offset,
      },
    });
  } catch (err) {
    console.error("[leaderboard] DB/Cache error:", err);
    res.status(500).json({
      ok: false,
      error: { message: "Failed to fetch leaderboard data." },
    });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/leaderboard/:userId
 * Returns a single user's leaderboard entry (rank, XP, level, streak).
 * Cached for 2 minutes to prevent heavy DB scan operations.
 *
 * Path params: userId
 * Query params: scope (default: "global")
 * ───────────────────────────────────────────── */
router.get("/:userId", async (req: Request, res: Response) => {
  const userId = String(req.params.userId);

  const scope = VALID_SCOPES.has(String(req.query.scope))
    ? String(req.query.scope)
    : "global";

  if (!userId || userId.length > 128) {
    res.status(400).json({ ok: false, error: { message: "Invalid userId." } });
    return;
  }

  const cacheKey = `leaderboard:user:${userId}:${scope}`;

  try {
    const cachedUserRank = await cache.getOrSet(cacheKey, async () => {
      const whereScope = scope !== "global"
        ? "WHERE u2.role = 'STUDENT' AND u2.\"isActive\" = TRUE AND LOWER(u2.\"classLevel\") = LOWER($2)"
        : "WHERE u2.role = 'STUDENT' AND u2.\"isActive\" = TRUE";

      const params: string[] = [userId];
      if (scope !== "global") params.push(scope);

      // CTE to rank all users within the selected scope, then filter to target user
      const queryText = `
        WITH ranked AS (
          SELECT
            u2.id,
            u2.name,
            u2.xp,
            u2."currentLevel"  AS level,
            u2."currentStreak" AS streak,
            COALESCE(u2."classLevel", 'general') AS track,
            RANK() OVER (ORDER BY u2.xp DESC) AS rank
          FROM "User" u2
          ${whereScope}
        )
        SELECT *
        FROM ranked
        WHERE id = $1
      `;

      const result = await pool.query(queryText, params);
      return result.rows[0] ?? null;
    }, CACHE_TTL.LEADERBOARD);

    if (!cachedUserRank) {
      res.status(404).json({ ok: false, error: { message: "User rank not found in this scope." } });
      return;
    }

    res.json({ ok: true, data: { entry: cachedUserRank, scope } });
  } catch (err) {
    console.error("[leaderboard/:userId] DB/Cache error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch user rank." } });
  }
});

export default router;
