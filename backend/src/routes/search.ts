/**
 * FILE: search.ts
 * LOCATION: backend/src/routes/search.ts
 * PURPOSE: REST API routes for cross-entity search on EduQuest.
 *          Supports searching across users (leaderboard), community posts,
 *          and chapter titles. Returns categorized results.
 *          Reuses the global singleton database pool and maps queries to correct Prisma models.
 * USED BY: backend/src/index.ts → /api/search
 * DEPENDENCIES: express, ../config/database
 * LAST UPDATED: 2026-05-25
 *
 * Endpoints:
 *  GET /api/search?q=query&type=all|users|posts|chapters
 */

import { Router, Request, Response } from "express";
import pool from "../config/database";

const router = Router();

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
        `SELECT id, name, xp, "currentLevel" AS level, COALESCE("classLevel", 'general') AS track
         FROM "User"
         WHERE name ILIKE $1 AND "isActive" = TRUE
         ORDER BY xp DESC
         LIMIT $2`,
        [`%${safeQuery}%`, limit]
      );
      results.users = usersResult.rows;
    }

    /* ── Search Community Posts ── */
    if (type === "all" || type === "posts") {
      const postsResult = await pool.query(
        `SELECT p.id, p.title, c.slug AS category, u.name AS "authorName", p."createdAt" AS "createdAt"
         FROM "CommunityPost" p
         JOIN "User" u ON p."authorId" = u.id
         JOIN "CommunityCategory" c ON p."categoryId" = c.id
         WHERE p.title ILIKE $1 OR p.content ILIKE $1
         ORDER BY p."createdAt" DESC
         LIMIT $2`,
        [`%${safeQuery}%`, limit]
      );
      results.posts = postsResult.rows;
    }

    /* ── Search Chapters ── */
    if (type === "all" || type === "chapters") {
      const chaptersResult = await pool.query(
        `SELECT c.id, c.title, c.slug, s.slug AS "subjectSlug", cc.slug AS "classSlug"
         FROM "Chapter" c
         JOIN "Subject" s ON c."subjectId" = s.id
         JOIN "ClassCategory" cc ON s."classId" = cc.id
         WHERE c.title ILIKE $1
         ORDER BY c."orderIndex" ASC
         LIMIT $2`,
        [`%${safeQuery}%`, limit]
      );
      results.chapters = chaptersResult.rows;
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
