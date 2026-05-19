/**
 * FILE: leaderboard.ts
 * LOCATION: backend/src/routes/leaderboard.ts
 * PURPOSE: REST API routes for the EduQuest global leaderboard.
 *          Supports filtering by scope (global, class-9, class-10, class-11,
 *          class-12, engineering) and returns paginated ranked entries.
 * USED BY: backend/src/index.ts → /api/leaderboard
 * DEPENDENCIES: express, pg Pool (database/pool), query-sanitize utilities
 * LAST UPDATED: 2026-05-18
 *
 * Endpoints:
 *  GET /api/leaderboard              — top 50 entries, scope=global by default
 *  GET /api/leaderboard/:userId      — single user's rank in a given scope
 */

import { Router, Request, Response } from "express";
import { Pool } from "pg";

const router = Router();

/* ─────────────────────────────────────────────
 * Database Pool
 * Reuse a single Pool across all leaderboard queries.
 * Connection string is read from the DATABASE_URL environment variable.
 * ───────────────────────────────────────────── */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                /* Maximum simultaneous connections */
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

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

  try {
    /*
     * Build the WHERE clause based on scope.
     * For "global" we return all users; for class/engineering scopes we
     * filter on the user's current track stored in eduquest_users.
     */
    const whereClause = scope === "global"
      ? ""
      : "WHERE LOWER(u.track) = LOWER($3)";

    const params: (string | number)[] = [limit, offset];
    if (scope !== "global") params.push(scope);

    const queryText = `
      SELECT
        u.id                                      AS "userId",
        u.name,
        u.xp,
        u.current_level                           AS level,
        u.current_streak                          AS streak,
        COALESCE(u.track, 'general')              AS track,
        RANK() OVER (ORDER BY u.xp DESC)          AS rank,
        UPPER(LEFT(COALESCE(u.name, 'A'), 2))     AS initials
      FROM eduquest_users u
      ${whereClause}
      ORDER BY u.xp DESC
      LIMIT $1 OFFSET $2
    `;

    const result = await pool.query(queryText, params);

    res.json({
      ok: true,
      data: {
        scope,
        entries: result.rows,
        total:   result.rowCount ?? result.rows.length,
        limit,
        offset,
      },
    });
  } catch (err) {
    console.error("[leaderboard] DB error:", err);
    res.status(500).json({
      ok: false,
      error: { message: "Failed to fetch leaderboard data." },
    });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/leaderboard/:userId
 * Returns a single user's leaderboard entry (rank, XP, level, streak).
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

  try {
    const whereScope = scope !== "global"
      ? "AND LOWER(u2.track) = LOWER($2)"
      : "";

    const params: string[] = [userId];
    if (scope !== "global") params.push(scope);

    const queryText = `
      WITH ranked AS (
        SELECT
          u2.id,
          u2.name,
          u2.xp,
          u2.current_level  AS level,
          u2.current_streak AS streak,
          COALESCE(u2.track, 'general') AS track,
          RANK() OVER (ORDER BY u2.xp DESC) AS rank
        FROM eduquest_users u2
        WHERE 1=1 ${whereScope}
      )
      SELECT *
      FROM ranked
      WHERE id = $1
    `;

    const result = await pool.query(queryText, params);

    if (result.rows.length === 0) {
      res.status(404).json({ ok: false, error: { message: "User not found." } });
      return;
    }

    res.json({ ok: true, data: { entry: result.rows[0], scope } });
  } catch (err) {
    console.error("[leaderboard/:userId] DB error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch user rank." } });
  }
});

export default router;
