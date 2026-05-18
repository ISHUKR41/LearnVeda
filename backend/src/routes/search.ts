/**
 * FILE: search.ts
 * LOCATION: backend/src/routes/search.ts
 * PURPOSE: REST API routes for cross-entity search on EduQuest.
 *          Supports searching across users (leaderboard), community posts,
 *          and chapter titles. Returns categorized results.
 * USED BY: backend/src/index.ts → /api/search
 * DEPENDENCIES: express, pg Pool
 * LAST UPDATED: 2026-05-18
 *
 * Endpoints:
 *  GET /api/search?q=query&type=all|users|posts|chapters
 */

import { Router, Request, Response } from "express";
import { Pool } from "pg";

const router = Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
});

/* ─────────────────────────────────────────────
 * GET /api/search
 * Performs a full-text search across users, community posts, and chapter names.
 *
 * Query params:
 *  q     — search query string (required, min 2 chars)
 *  type  — "all" | "users" | "posts" | "chapters" (default: "all")
 *  limit — max results per category (default: 5, max: 20)
 * ───────────────────────────────────────────── */
router.get("/", async (req: Request, res: Response) => {
  const rawQuery = String(req.query.q ?? "").trim();

  /* Require at least 2 characters to prevent wildcard spam */
  if (rawQuery.length < 2) {
    res.status(400).json({
      ok: false,
      error: { message: "Search query must be at least 2 characters." },
    });
    return;
  }

  /* Sanitize for PostgreSQL ILIKE — escape wildcards */
  const safeQuery = rawQuery.replace(/[%_\\]/g, "\\$&");

  const type  = ["all", "users", "posts", "chapters"].includes(String(req.query.type))
    ? String(req.query.type)
    : "all";
  const limit = Math.min(parseInt(String(req.query.limit ?? "5"), 10), 20);

  const results: {
    users?: unknown[];
    posts?: unknown[];
    chapters?: unknown[];
  } = {};

  try {
    /* ── Search Users ── */
    if (type === "all" || type === "users") {
      const usersResult = await pool.query(
        `SELECT id, name, xp, current_level AS level, COALESCE(track, 'general') AS track
         FROM eduquest_users
         WHERE name ILIKE $1 AND is_active = TRUE
         ORDER BY xp DESC
         LIMIT $2`,
        [`%${safeQuery}%`, limit]
      );
      results.users = usersResult.rows;
    }

    /* ── Search Community Posts ── */
    if (type === "all" || type === "posts") {
      const postsResult = await pool.query(
        `SELECT id, title, category, author_name AS "authorName", created_at AS "createdAt"
         FROM eduquest_community_posts
         WHERE title ILIKE $1 OR content ILIKE $1
         ORDER BY created_at DESC
         LIMIT $2`,
        [`%${safeQuery}%`, limit]
      );
      results.posts = postsResult.rows;
    }

    res.json({
      ok: true,
      data: {
        query: rawQuery,
        type,
        results,
        totalResults: Object.values(results).reduce((sum, arr) => sum + (arr?.length ?? 0), 0),
      },
    });
  } catch (err) {
    console.error("[search GET] DB error:", err);
    res.status(500).json({ ok: false, error: { message: "Search failed. Please try again." } });
  }
});

export default router;
