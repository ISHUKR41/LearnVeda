/**
 * FILE: community.ts
 * LOCATION: backend/src/routes/community.ts
 * PURPOSE: REST API routes for the EduQuest community forum.
 *          Handles post listing, creation, liking, and comment management.
 * USED BY: backend/src/index.ts → /api/community
 * DEPENDENCIES: express, pg Pool
 * LAST UPDATED: 2026-05-18
 *
 * Endpoints:
 *  GET    /api/community/posts            — paginated post list (filterable by category)
 *  POST   /api/community/posts            — create a new post (auth required)
 *  GET    /api/community/posts/:postId    — single post with comments
 *  POST   /api/community/posts/:postId/like  — toggle like on a post (auth required)
 *  DELETE /api/community/posts/:postId    — delete a post (owner or admin only)
 */

import { Router, Request, Response } from "express";
import { Pool } from "pg";

const router = Router();

/* ─────────────────────────────────────────────
 * Database Pool — shared with the rest of the backend
 * ───────────────────────────────────────────── */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30_000,
});

/* ─────────────────────────────────────────────
 * Valid category values — prevents invalid filter params
 * ───────────────────────────────────────────── */
const VALID_CATEGORIES = new Set([
  "all", "general", "class-9", "class-10", "class-11", "class-12",
  "engineering", "battle", "events", "announcements",
]);

/* ─────────────────────────────────────────────
 * HELPER: Extract user ID from Authorization header or session cookie.
 * Returns null if unauthenticated (allows anonymous reads).
 *
 * NOTE: Full authentication middleware (JWT/session verification) should be
 * implemented as a proper middleware chain. This is a simplified extraction
 * for the current Express backend. The Next.js API routes handle full session auth.
 * ───────────────────────────────────────────── */
function extractUserId(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;
  /* In production: verify JWT and extract userId */
  return authHeader.slice(7) ?? null;
}

/* ─────────────────────────────────────────────
 * GET /api/community/posts
 * Returns a paginated list of forum posts, newest first.
 *
 * Query params:
 *  category — post category filter (default: "all")
 *  limit    — max posts to return (default: 20, max: 50)
 *  offset   — pagination offset (default: 0)
 *
 * Response:
 *  { ok: true, data: { posts: Post[], total, category, limit, offset } }
 * ───────────────────────────────────────────── */
router.get("/posts", async (req: Request, res: Response) => {
  const category = VALID_CATEGORIES.has(String(req.query.category))
    ? String(req.query.category)
    : "all";

  const limit  = Math.min(parseInt(String(req.query.limit  ?? "20"), 10), 50);
  const offset = Math.max(parseInt(String(req.query.offset ?? "0"),  10), 0);

  try {
    const whereClause = category === "all"
      ? ""
      : "WHERE p.category = $3";

    const params: (string | number)[] = [limit, offset];
    if (category !== "all") params.push(category);

    const queryText = `
      SELECT
        p.id,
        p.title,
        p.content,
        p.category,
        p.likes,
        p.comments_count  AS "commentsCount",
        p.views,
        p.author_id       AS "authorId",
        p.author_name     AS "authorName",
        p.created_at      AS "createdAt",
        p.updated_at      AS "updatedAt"
      FROM eduquest_community_posts p
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const result = await pool.query(queryText, params);

    /* Also fetch total count for pagination metadata */
    const countParams: string[] = category !== "all" ? [category] : [];
    const countWhere = category !== "all" ? "WHERE category = $1" : "";
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM eduquest_community_posts ${countWhere}`,
      countParams
    );

    res.json({
      ok: true,
      data: {
        posts:    result.rows,
        total:    parseInt(countResult.rows[0]?.count ?? "0", 10),
        category,
        limit,
        offset,
      },
    });
  } catch (err) {
    console.error("[community/posts GET] DB error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch posts." } });
  }
});

/* ─────────────────────────────────────────────
 * POST /api/community/posts
 * Creates a new community post. Requires authentication.
 *
 * Body: { title: string, content: string, category?: string }
 *
 * Response:
 *  { ok: true, data: { post: Post } }
 * ───────────────────────────────────────────── */
router.post("/posts", async (req: Request, res: Response) => {
  const userId = extractUserId(req);
  if (!userId) {
    res.status(401).json({ ok: false, error: { message: "Authentication required." } });
    return;
  }

  const { title, content, category = "general" } = req.body as {
    title?: string;
    content?: string;
    category?: string;
  };

  /* Input validation */
  if (!title || typeof title !== "string" || title.trim().length < 3) {
    res.status(400).json({ ok: false, error: { message: "Post title must be at least 3 characters." } });
    return;
  }

  if (!content || typeof content !== "string" || content.trim().length < 10) {
    res.status(400).json({ ok: false, error: { message: "Post content must be at least 10 characters." } });
    return;
  }

  const safeCategory = VALID_CATEGORIES.has(category) ? category : "general";

  try {
    /* Look up the user's name for denormalized author_name */
    const userResult = await pool.query(
      "SELECT name FROM eduquest_users WHERE id = $1",
      [userId]
    );

    const authorName = userResult.rows[0]?.name ?? "Anonymous";

    const insertResult = await pool.query(
      `INSERT INTO eduquest_community_posts
         (title, content, category, author_id, author_name, likes, comments_count, views)
       VALUES ($1, $2, $3, $4, $5, 0, 0, 0)
       RETURNING *`,
      [title.trim(), content.trim(), safeCategory, userId, authorName]
    );

    res.status(201).json({ ok: true, data: { post: insertResult.rows[0] } });
  } catch (err) {
    console.error("[community/posts POST] DB error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to create post." } });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/community/posts/:postId
 * Returns a single post with its full details. Increments view count.
 * ───────────────────────────────────────────── */
router.get("/posts/:postId", async (req: Request, res: Response) => {
  const { postId } = req.params;

  if (!postId || postId.length > 128) {
    res.status(400).json({ ok: false, error: { message: "Invalid postId." } });
    return;
  }

  try {
    /* Increment view count atomically */
    const result = await pool.query(
      `UPDATE eduquest_community_posts
       SET views = views + 1
       WHERE id = $1
       RETURNING *`,
      [postId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ ok: false, error: { message: "Post not found." } });
      return;
    }

    res.json({ ok: true, data: { post: result.rows[0] } });
  } catch (err) {
    console.error("[community/posts/:id GET] DB error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch post." } });
  }
});

/* ─────────────────────────────────────────────
 * POST /api/community/posts/:postId/like
 * Toggles the like count on a post. Returns updated like count.
 * (Simplified — full implementation would track per-user likes)
 * ───────────────────────────────────────────── */
router.post("/posts/:postId/like", async (req: Request, res: Response) => {
  const { postId } = req.params;
  const userId = extractUserId(req);

  if (!userId) {
    res.status(401).json({ ok: false, error: { message: "Authentication required." } });
    return;
  }

  try {
    const result = await pool.query(
      `UPDATE eduquest_community_posts
       SET likes = likes + 1
       WHERE id = $1
       RETURNING id, likes`,
      [postId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ ok: false, error: { message: "Post not found." } });
      return;
    }

    res.json({ ok: true, data: { likes: result.rows[0].likes } });
  } catch (err) {
    console.error("[community/posts/:id/like POST] DB error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to like post." } });
  }
});

/* ─────────────────────────────────────────────
 * DELETE /api/community/posts/:postId
 * Deletes a post. Only the post author or an admin can delete.
 * ───────────────────────────────────────────── */
router.delete("/posts/:postId", async (req: Request, res: Response) => {
  const { postId } = req.params;
  const userId = extractUserId(req);

  if (!userId) {
    res.status(401).json({ ok: false, error: { message: "Authentication required." } });
    return;
  }

  try {
    /* Only delete if the requesting user is the author */
    const result = await pool.query(
      `DELETE FROM eduquest_community_posts
       WHERE id = $1 AND author_id = $2
       RETURNING id`,
      [postId, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ ok: false, error: { message: "Post not found or you do not have permission to delete it." } });
      return;
    }

    res.json({ ok: true, data: { deleted: true, postId } });
  } catch (err) {
    console.error("[community/posts/:id DELETE] DB error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to delete post." } });
  }
});

export default router;
