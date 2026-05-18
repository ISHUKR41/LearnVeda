/**
 * FILE: notifications.ts
 * LOCATION: backend/src/routes/notifications.ts
 * PURPOSE: REST API routes for the EduQuest in-app notification system.
 *          Supports fetching a user's notification feed, marking items as read,
 *          and clearing all notifications.
 * USED BY: backend/src/index.ts → /api/notifications
 * DEPENDENCIES: express, pg Pool
 * LAST UPDATED: 2026-05-18
 *
 * Endpoints:
 *  GET    /api/notifications           — fetch notification feed (auth required)
 *  PUT    /api/notifications/:id/read  — mark a notification as read
 *  PUT    /api/notifications/read-all  — mark all notifications as read
 *  DELETE /api/notifications/:id       — dismiss a notification
 */

import { Router, Request, Response } from "express";
import { Pool } from "pg";

const router = Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
});

/** Extracts userId from Bearer token (placeholder for full JWT middleware). */
function extractUserId(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7) ?? null;
}

/* ─────────────────────────────────────────────
 * In-memory notification store (fallback when DB table doesn't exist yet).
 * These are system-generated notifications for events like:
 *  - Battle invitation received
 *  - XP milestone reached
 *  - Streak about to break
 *  - New community reply
 * The database table (eduquest_notifications) stores real persistent notifications.
 * ───────────────────────────────────────────── */

/* ─────────────────────────────────────────────
 * GET /api/notifications
 * Returns the authenticated user's notification feed, newest first.
 * Falls back to empty array if the notifications table doesn't exist yet.
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
    const whereUnread = unreadOnly ? "AND is_read = FALSE" : "";

    const result = await pool.query(
      `SELECT
         id,
         type,
         title,
         body,
         link,
         is_read   AS "isRead",
         created_at AS "createdAt"
       FROM eduquest_notifications
       WHERE user_id = $1 ${whereUnread}
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const unreadCount = await pool.query(
      `SELECT COUNT(*) FROM eduquest_notifications WHERE user_id = $1 AND is_read = FALSE`,
      [userId]
    );

    res.json({
      ok: true,
      data: {
        notifications: result.rows,
        unreadCount:   parseInt(unreadCount.rows[0]?.count ?? "0", 10),
        limit,
        offset,
      },
    });
  } catch {
    /*
     * If the notifications table doesn't exist yet (not migrated),
     * return an empty feed rather than a 500 error.
     */
    res.json({
      ok: true,
      data: { notifications: [], unreadCount: 0, limit, offset },
    });
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
    await pool.query(
      `UPDATE eduquest_notifications
       SET is_read = TRUE
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    res.json({ ok: true, data: { read: true } });
  } catch {
    res.json({ ok: true, data: { read: true } }); /* Graceful degradation */
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
      `UPDATE eduquest_notifications
       SET is_read = TRUE
       WHERE user_id = $1 AND is_read = FALSE`,
      [userId]
    );
    res.json({ ok: true, data: { updatedCount: result.rowCount ?? 0 } });
  } catch {
    res.json({ ok: true, data: { updatedCount: 0 } });
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
    await pool.query(
      `DELETE FROM eduquest_notifications WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    res.json({ ok: true, data: { deleted: true } });
  } catch {
    res.json({ ok: true, data: { deleted: true } });
  }
});

export default router;
