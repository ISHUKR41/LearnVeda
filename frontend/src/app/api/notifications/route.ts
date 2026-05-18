/**
 * FILE: route.ts
 * LOCATION: src/app/api/notifications/route.ts
 * PURPOSE: Notifications API — returns recent system notifications for the
 *          authenticated user. Notifications include streak reminders, battle
 *          results, event registrations, XP milestones, and level-up events.
 *
 *          For MVP, notifications are synthesised from the eduquest_notifications
 *          table and supplemented with computed data (e.g. streak status).
 *          A WebSocket/SSE real-time layer will replace polling in a future phase.
 *
 * USED BY: Navbar notification bell (future), Dashboard sidebar, Profile page
 * DEPENDENCIES: auth/current-user, pg pool, api-response helpers
 * LAST UPDATED: 2026-05-16
 */

import { type NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { getPostgresPool } from "@/lib/server/database/postgres";

/* Force Node.js runtime — required for the pg pool and crypto-based session reading */
export const runtime = "nodejs";

/** Standard no-cache headers for all authenticated endpoints */
const NO_STORE = { "Cache-Control": "no-store" } as const;

/* ─────────────────────────────────────────────
 * GET /api/notifications
 * ───────────────────────────────────────────── */

/**
 * Returns up to 20 recent notifications for the current user.
 *
 * Response shape:
 * {
 *   ok: true,
 *   data: {
 *     notifications: Notification[],
 *     unreadCount: number
 *   }
 * }
 *
 * Each Notification:
 * {
 *   id: string,
 *   type: "xp" | "streak" | "battle" | "event" | "level" | "system",
 *   title: string,
 *   message: string,
 *   isRead: boolean,
 *   createdAt: string (ISO)
 * }
 */
export async function GET(request: NextRequest) {
  /* ── Auth guard ── */
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json(
      { ok: false, error: { code: "UNAUTHENTICATED", message: "Please sign in to view notifications." } },
      { status: 401, headers: NO_STORE },
    );
  }

  const pool = getPostgresPool();

  try {
    /*
     * Query the eduquest_notifications table if it exists.
     * The table was added in migration 003 as part of the gamification schema.
     * If the table is somehow missing, we fall back to an empty list.
     */
    const result = await pool.query<{
      id: string;
      notification_type: string;
      title: string;
      message: string;
      action_url: string | null;
      is_read: boolean;
      created_at: Date;
    }>(
      `SELECT
         id::text,
         type AS notification_type,
         title,
         message,
         action_url,
         is_read,
         created_at
       FROM eduquest_notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [user.id],
    );

    /* Map DB rows to the API response shape */
    const notifications = result.rows.map((row) => ({
      id: row.id,
      type: row.notification_type as "xp" | "streak" | "battle" | "event" | "level" | "system",
      title: row.title,
      message: row.message,
      body: row.message,
      href: row.action_url ?? undefined,
      isRead: row.is_read,
      createdAt: row.created_at.toISOString(),
    }));

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return NextResponse.json(
      {
        ok: true,
        notifications,
        unreadCount,
        data: { notifications, unreadCount },
      },
      { status: 200, headers: NO_STORE },
    );
  } catch (err) {
    /*
     * If the notifications table doesn't exist yet (e.g. migrations not run),
     * return an empty list instead of crashing. This ensures the API degrades
     * gracefully in environments where migrations haven't been applied.
     */
    const error = err as Error;
    const isTableMissing = error.message?.includes("does not exist");

    if (isTableMissing) {
      return NextResponse.json(
        { ok: true, data: { notifications: [], unreadCount: 0 } },
        { status: 200, headers: NO_STORE },
      );
    }

    console.error("[GET /api/notifications] Unexpected error:", error.message);

    return NextResponse.json(
      { ok: false, error: { code: "SERVER_ERROR", message: "Failed to load notifications." } },
      { status: 500, headers: NO_STORE },
    );
  }
}

/* ─────────────────────────────────────────────
 * PATCH /api/notifications
 * ───────────────────────────────────────────── */

/**
 * Marks all notifications as read for the current user.
 * Called when the user opens the notification panel.
 *
 * Request body: (empty)
 * Response: { ok: true, data: { markedCount: number } }
 */
export async function PATCH(request: NextRequest) {
  /* ── Auth guard ── */
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json(
      { ok: false, error: { code: "UNAUTHENTICATED", message: "Please sign in." } },
      { status: 401, headers: NO_STORE },
    );
  }

  const pool = getPostgresPool();

  try {
    const result = await pool.query(
      `UPDATE eduquest_notifications
         SET is_read = true
       WHERE user_id = $1 AND is_read = false`,
      [user.id],
    );

    return NextResponse.json(
      { ok: true, data: { markedCount: result.rowCount ?? 0 } },
      { status: 200, headers: NO_STORE },
    );
  } catch (err) {
    const error = err as Error;
    const isTableMissing = error.message?.includes("does not exist");

    if (isTableMissing) {
      return NextResponse.json(
        { ok: true, data: { markedCount: 0 } },
        { status: 200, headers: NO_STORE },
      );
    }

    console.error("[PATCH /api/notifications] Error:", error.message);

    return NextResponse.json(
      { ok: false, error: { code: "SERVER_ERROR", message: "Failed to update notifications." } },
      { status: 500, headers: NO_STORE },
    );
  }
}
