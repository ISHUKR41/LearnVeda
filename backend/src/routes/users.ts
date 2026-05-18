/**
 * FILE: users.ts
 * LOCATION: backend/src/routes/users.ts
 * PURPOSE: REST API routes for EduQuest user profiles and account settings.
 *          Supports reading public profiles, updating user display info,
 *          and fetching user statistics for the dashboard.
 * USED BY: backend/src/index.ts → /api/users
 * DEPENDENCIES: express, pg Pool
 * LAST UPDATED: 2026-05-18
 *
 * Endpoints:
 *  GET    /api/users/:userId           — public user profile
 *  GET    /api/users/:userId/stats     — extended stats (battles, chapters, XP history)
 *  PUT    /api/users/:userId/profile   — update display name / settings (auth required)
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
 * Helpers
 * ───────────────────────────────────────────── */

/** Extracts userId from Bearer token (placeholder for full JWT middleware). */
function extractUserId(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7) ?? null;
}

/** Sanitizes a display name — strips HTML, trims whitespace, enforces max length. */
function sanitizeName(name: unknown): string | null {
  if (typeof name !== "string") return null;
  const cleaned = name
    .trim()
    .replace(/<[^>]*>/g, "")     /* Strip HTML tags */
    .replace(/[^\w\s\-.']/g, "") /* Allow letters, digits, spaces, hyphens, dots, apostrophes */
    .slice(0, 64);
  return cleaned.length >= 2 ? cleaned : null;
}

/* ─────────────────────────────────────────────
 * GET /api/users/:userId
 * Returns a public user profile (name, level, XP, streak, track).
 * Does NOT return email, phone, or password-related fields.
 * ───────────────────────────────────────────── */
router.get("/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId || userId.length > 128) {
    res.status(400).json({ ok: false, error: { message: "Invalid userId." } });
    return;
  }

  try {
    const result = await pool.query(
      `SELECT
         id,
         name,
         xp,
         current_level     AS level,
         current_streak    AS streak,
         highest_streak    AS "highestStreak",
         COALESCE(track, 'general') AS track,
         created_at        AS "joinedAt"
       FROM eduquest_users
       WHERE id = $1 AND is_active = TRUE`,
      [userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ ok: false, error: { message: "User not found." } });
      return;
    }

    res.json({ ok: true, data: { user: result.rows[0] } });
  } catch (err) {
    console.error("[users/:userId GET] DB error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch user profile." } });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/users/:userId/stats
 * Returns extended gamification stats: battle record, chapter progress, XP breakdown.
 * ───────────────────────────────────────────── */
router.get("/:userId/stats", async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId || userId.length > 128) {
    res.status(400).json({ ok: false, error: { message: "Invalid userId." } });
    return;
  }

  try {
    /* Battle stats — wins, losses, total matches */
    const battleResult = await pool.query(
      `SELECT
         COUNT(*)                                         AS "totalBattles",
         COUNT(*) FILTER (WHERE result = 'win')          AS wins,
         COUNT(*) FILTER (WHERE result = 'loss')         AS losses,
         ROUND(
           COUNT(*) FILTER (WHERE result = 'win') * 100.0
           / NULLIF(COUNT(*), 0),
           1
         )                                               AS "winRate"
       FROM eduquest_matchmaking_tickets
       WHERE user_id = $1 AND status = 'matched'`,
      [userId]
    );

    /* Chapter progress stats */
    const progressResult = await pool.query(
      `SELECT
         COUNT(*)                                              AS "totalChapters",
         COUNT(*) FILTER (WHERE is_completed = TRUE)         AS "completedChapters",
         COALESCE(SUM(score), 0)                              AS "totalScore"
       FROM eduquest_user_progress
       WHERE user_id = $1`,
      [userId]
    );

    const battleStats    = battleResult.rows[0]   ?? {};
    const progressStats  = progressResult.rows[0] ?? {};

    res.json({
      ok: true,
      data: {
        userId,
        battles:  battleStats,
        progress: progressStats,
      },
    });
  } catch (err) {
    console.error("[users/:userId/stats GET] DB error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch user stats." } });
  }
});

/* ─────────────────────────────────────────────
 * PUT /api/users/:userId/profile
 * Updates a user's display name and/or preferences.
 * Only the authenticated user can update their own profile.
 *
 * Body: { name?: string, track?: string, languagePreference?: string }
 * ───────────────────────────────────────────── */
router.put("/:userId/profile", async (req: Request, res: Response) => {
  const { userId } = req.params;
  const requesterId = extractUserId(req);

  /* Require authentication */
  if (!requesterId) {
    res.status(401).json({ ok: false, error: { message: "Authentication required." } });
    return;
  }

  /* Users can only edit their own profile (no impersonation) */
  if (requesterId !== userId) {
    res.status(403).json({ ok: false, error: { message: "You can only edit your own profile." } });
    return;
  }

  const { name, track } = req.body as { name?: string; track?: string };

  /* Validate inputs */
  const safeName = name !== undefined ? sanitizeName(name) : undefined;
  if (name !== undefined && safeName === null) {
    res.status(400).json({ ok: false, error: { message: "Name must be 2–64 characters using standard characters." } });
    return;
  }

  /* Build dynamic SET clause — only update provided fields */
  const updates: string[] = [];
  const params: unknown[] = [];

  if (safeName !== undefined) {
    params.push(safeName);
    updates.push(`name = $${params.length}`);
  }

  if (track !== undefined) {
    params.push(String(track).slice(0, 32));
    updates.push(`track = $${params.length}`);
  }

  if (updates.length === 0) {
    res.status(400).json({ ok: false, error: { message: "No valid fields provided to update." } });
    return;
  }

  params.push(userId);
  updates.push(`updated_at = NOW()`);

  try {
    const result = await pool.query(
      `UPDATE eduquest_users
       SET ${updates.join(", ")}
       WHERE id = $${params.length}
       RETURNING id, name, xp, current_level AS level, current_streak AS streak`,
      params
    );

    if (result.rows.length === 0) {
      res.status(404).json({ ok: false, error: { message: "User not found." } });
      return;
    }

    res.json({ ok: true, data: { user: result.rows[0] } });
  } catch (err) {
    console.error("[users/:userId/profile PUT] DB error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to update profile." } });
  }
});

export default router;
