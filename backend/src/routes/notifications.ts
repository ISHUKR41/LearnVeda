/**
 * FILE: notifications.ts
 * LOCATION: backend/src/routes/notifications.ts
 * PURPOSE: REST API routes for the EduQuest in-app notification system.
 *          Supports fetching a user's notification feed, marking items as read,
 *          and clearing all notifications.
 *          Reuses the global database pool and maps queries to correct Prisma models.
 * USED BY: backend/src/index.ts → /api/notifications
 * DEPENDENCIES: express, ../config/database
 * LAST UPDATED: 2026-05-25
 *
 * Endpoints:
 *  GET    /api/notifications           — fetch notification feed (auth required)
 *  PUT    /api/notifications/:id/read  — mark a notification as read
 *  PUT    /api/notifications/read-all  — mark all notifications as read
 *  DELETE /api/notifications/:id       — dismiss a notification
 */

import { Router, Request, Response } from "express";
import pool from "../config/database";

const router = Router();

/** Extracts userId from Bearer token. */
function extractUserId(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7) ?? null;
}

/* ─────────────────────────────────────────────
 * GET /api/notifications
 * Returns the authenticated user's notification feed, newest first.
 *
 * Query params: limit (default: 20), offset (default: 0), unread_only (boolean)
 * ───────────────────────────────────────────── */
router.get("/", async (req: Request, res: Response) => {
  const userId = extractUserId(req);
  if (!userId) {
    res.status(401).json({ ok: false, error: { message: "Authentication required." } });
    return;
  }

  const limit  = Math.min(parseInt(String(req.query.limit  ?? "20"), 10), 50);
  const offset = Math.max(parseInt(String(req.query.offset ?? "0"),  10), 0);
  const unreadOnly = req.query.unread_only === "true";

  try {
    const whereUnread = unreadOnly ? 'AND "isRead" = FALSE' : "";

    const result = await pool.query(
      `SELECT
         id,
         type,
         title,
         message    AS "body",
         "actionUrl" AS "link",
         "isRead"   AS "isRead",
         "createdAt" AS "createdAt"
       FROM "Notification"
       WHERE "userId" = $1 ${whereUnread}
       ORDER BY "createdAt" DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const unreadCount = await pool.query(
      `SELECT COUNT(*)::int AS count 
       FROM "Notification" 
       WHERE "userId" = $1 AND "isRead" = FALSE`,
      [userId]
    );

    res.json({
      ok: true,
      data: {
        notifications: result.rows,
        unreadCount:   unreadCount.rows[0]?.count ?? 0,
        limit,
        offset,
      },
    });
  } catch (err) {
    console.error("[notifications GET] DB error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch notifications." } });
  }
});

/* ─────────────────────────────────────────────
 * PUT /api/notifications/:id/read
 * Marks a single notification as read.
 * ───────────────────────────────────────────── */
router.put("/:id/read", async (req: Request, res: Response) => {
  const userId = extractUserId(req);
  if (!userId) {
    res.status(401).json({ ok: false, error: { message: "Authentication required." } });
    return;
  }

  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE "Notification"
       SET "isRead" = TRUE
       WHERE id = $1 AND "userId" = $2
       RETURNING id`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ ok: false, error: { message: "Notification not found." } });
      return;
    }

    res.json({ ok: true, data: { read: true } });
  } catch (err) {
    console.error("[notifications/:id/read PUT] DB error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to mark notification as read." } });
  }
});

/* ─────────────────────────────────────────────
 * PUT /api/notifications/read-all
 * Marks ALL of the user's notifications as read.
 * ───────────────────────────────────────────── */
router.put("/read-all", async (req: Request, res: Response) => {
  const userId = extractUserId(req);
  if (!userId) {
    res.status(401).json({ ok: false, error: { message: "Authentication required." } });
    return;
  }

  try {
    const result = await pool.query(
      `UPDATE "Notification"
       SET "isRead" = TRUE
       WHERE "userId" = $1 AND "isRead" = FALSE`,
      [userId]
    );
    res.json({ ok: true, data: { updatedCount: result.rowCount ?? 0 } });
  } catch (err) {
    console.error("[notifications/read-all PUT] DB error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to mark all notifications as read." } });
  }
});

/* ─────────────────────────────────────────────
 * DELETE /api/notifications/:id
 * Dismisses (hard-deletes) a single notification for the user.
 * ───────────────────────────────────────────── */
router.delete("/:id", async (req: Request, res: Response) => {
  const userId = extractUserId(req);
  if (!userId) {
    res.status(401).json({ ok: false, error: { message: "Authentication required." } });
    return;
  }

  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM "Notification" WHERE id = $1 AND "userId" = $2 RETURNING id`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ ok: false, error: { message: "Notification not found." } });
      return;
    }

    res.json({ ok: true, data: { deleted: true } });
  } catch (err) {
    console.error("[notifications/:id DELETE] DB error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to dismiss notification." } });
  }
});

export default router;
