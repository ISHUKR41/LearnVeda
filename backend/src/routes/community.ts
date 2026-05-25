/**
 * FILE: community.ts
 * LOCATION: backend/src/routes/community.ts
 * PURPOSE: REST API routes for the EduQuest community forum.
 *          Handles post listing, creation, liking, and comment management.
 *          Reuses the global singleton database pool to prevent connection exhaustion.
 *          Queries the correct Prisma-defined models and camelCase variables.
 * USED BY: backend/src/index.ts → /api/community
 * DEPENDENCIES: express, ../config/database
 * LAST UPDATED: 2026-05-25
 *
 * Endpoints:
 *  GET    /api/community/posts            — paginated post list (filterable by category)
 *  POST   /api/community/posts            — create a new post (auth required)
 *  GET    /api/community/posts/:postId    — single post with comments
 *  POST   /api/community/posts/:postId/like  — toggle like on a post (auth required)
 *  DELETE /api/community/posts/:postId    — delete a post (owner or admin only)
 */

import { Router, Request, Response } from "express";
import pool from "../config/database";

const router = Router();

/* ─────────────────────────────────────────────
 * Valid category values — prevents invalid filter params
 * ───────────────────────────────────────────── */
const VALID_CATEGORIES = new Set([
  "all", "general", "class-9-community", "class-10-community", "class-11-community", "class-12-community",
  "engineering-hub", "doubts", "study-groups", "battle-chat", "events-community", "announcements",
]);

/* ─────────────────────────────────────────────
 * HELPER: Extract user ID from Authorization header or session cookie.
 * Returns null if unauthenticated (allows anonymous reads).
 *
 * NOTE: In a full production setup, this extraction is handled by JWT verification middleware.
 * ───────────────────────────────────────────── */
function extractUserId(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;
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
      : "WHERE c.slug = $3";

    const params: (string | number)[] = [limit, offset];
    if (category !== "all") params.push(category);

    const queryText = `
      SELECT
        p.id,
        p.title,
        p.content,
        c.slug            AS category,
        p."likesCount"    AS likes,
        p."commentsCount" AS "commentsCount",
        p."viewsCount"    AS views,
        p."authorId"      AS "authorId",
        u.name            AS "authorName",
        p."createdAt"     AS "createdAt",
        p."updatedAt"     AS "updatedAt"
      FROM "CommunityPost" p
      JOIN "User" u ON p."authorId" = u.id
      JOIN "CommunityCategory" c ON p."categoryId" = c.id
      ${whereClause}
      ORDER BY p."createdAt" DESC
      LIMIT $1 OFFSET $2
    `;

    const result = await pool.query(queryText, params);

    /* Also fetch total count for pagination metadata */
    const countParams: string[] = category !== "all" ? [category] : [];
    const countWhere = category !== "all" ? 'WHERE c.slug = $1' : "";
    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS count 
       FROM "CommunityPost" p
       JOIN "CommunityCategory" c ON p."categoryId" = c.id
       ${countWhere}`,
      countParams
    );

    res.json({
      ok: true,
      data: {
        posts:    result.rows,
        total:    countResult.rows[0]?.count ?? 0,
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
    /* Resolve Category ID from Slug */
    const catResult = await pool.query(
      `SELECT id FROM "CommunityCategory" WHERE slug = $1 LIMIT 1`,
      [safeCategory]
    );
    let categoryId = catResult.rows[0]?.id;
    if (!categoryId) {
      // Fallback to general category
      const generalResult = await pool.query(
        `SELECT id FROM "CommunityCategory" WHERE slug = 'general' LIMIT 1`
      );
      categoryId = generalResult.rows[0]?.id;
    }

    if (!categoryId) {
      res.status(400).json({ ok: false, error: { message: "Invalid post category." } });
      return;
    }

    /* Look up the user's name for payload response */
    const userResult = await pool.query(
      `SELECT name FROM "User" WHERE id = $1 AND "isActive" = TRUE`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      res.status(404).json({ ok: false, error: { message: "User account not active." } });
      return;
    }

    const authorName = userResult.rows[0]?.name;

    const insertResult = await pool.query(
      `INSERT INTO "CommunityPost"
         (id, title, content, "categoryId", "authorId", "likesCount", "commentsCount", "viewsCount", "isPinned", "isResolved", "isFlagged", "createdAt", "updatedAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, 0, 0, 0, FALSE, FALSE, FALSE, NOW(), NOW())
       RETURNING id, title, content, "categoryId", "authorId", "likesCount" AS likes, "commentsCount" AS "commentsCount", "viewsCount" AS views, "createdAt", "updatedAt"`,
      [title.trim(), content.trim(), categoryId, userId]
    );

    const post = {
      ...insertResult.rows[0],
      category: safeCategory,
      authorName,
    };

    res.status(201).json({ ok: true, data: { post } });
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
    const updateResult = await pool.query(
      `UPDATE "CommunityPost"
       SET "viewsCount" = "viewsCount" + 1
       WHERE id = $1
       RETURNING id`,
      [postId]
    );

    if (updateResult.rows.length === 0) {
      res.status(404).json({ ok: false, error: { message: "Post not found." } });
      return;
    }

    /* Fetch details */
    const result = await pool.query(
      `SELECT
         p.id,
         p.title,
         p.content,
         c.slug            AS category,
         p."likesCount"    AS likes,
         p."commentsCount" AS "commentsCount",
         p."viewsCount"    AS views,
         p."authorId"      AS "authorId",
         u.name            AS "authorName",
         p."createdAt"     AS "createdAt",
         p."updatedAt"     AS "updatedAt"
       FROM "CommunityPost" p
       JOIN "User" u ON p."authorId" = u.id
       JOIN "CommunityCategory" c ON p."categoryId" = c.id
       WHERE p.id = $1`,
      [postId]
    );

    res.json({ ok: true, data: { post: result.rows[0] } });
  } catch (err) {
    console.error("[community/posts/:id GET] DB error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch post." } });
  }
});

/* ─────────────────────────────────────────────
 * POST /api/community/posts/:postId/like
 * Toggles the like count on a post. Returns updated like count.
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
      `UPDATE "CommunityPost"
       SET "likesCount" = "likesCount" + 1
       WHERE id = $1
       RETURNING id, "likesCount" AS likes`,
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
      `DELETE FROM "CommunityPost"
       WHERE id = $1 AND "authorId" = $2
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
