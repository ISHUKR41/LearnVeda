/**
 * FILE: users.ts
 * LOCATION: backend/src/routes/users.ts
 * PURPOSE: REST API routes for EduQuest user profiles and account settings.
 *          Provides endpoints for reading user profile summaries, details,
 *          gamification stats, and updating profile settings.
 *          Integrated with proper JWT auth verification and hybrid caching.
 * USED BY: backend/src/index.ts → /api/users
 * DEPENDENCIES: express, pg Pool, ../middlewares/auth.middleware, ../config/cache
 * LAST UPDATED: 2026-05-24
 *
 * Endpoints:
 *  GET    /api/users/:userId           — public user profile (cached)
 *  GET    /api/users/:userId/stats     — extended stats (battles, chapters, XP history) (cached)
 *  PUT    /api/users/:userId/profile   — update display name / settings (auth required)
 */

import { Router, Request, Response } from "express";
import pool from "../config/database";
import { authMiddleware } from "../middlewares/auth.middleware";
import { cache, CACHE_TTL } from "../config/cache";

const router = Router();

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
 * Returns a public user profile (name, level, XP, streak, classLevel).
 * Does NOT return email, phone, or password-related fields.
 * Cached to support high concurrent profiling loads.
 * ───────────────────────────────────────────── */
router.get("/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId || userId.length > 128) {
    res.status(400).json({ ok: false, error: { message: "Invalid userId." } });
    return;
  }

  const cacheKey = `user:profile:${userId}`;

  try {
    const cachedProfile = await cache.getOrSet(cacheKey, async () => {
      const result = await pool.query(
        `SELECT
           id,
           name,
           xp,
           "currentLevel"     AS level,
           "currentStreak"    AS streak,
           "highestStreak"    AS "highestStreak",
           COALESCE("classLevel", 'general') AS track,
           "createdAt"        AS "joinedAt"
         FROM "User"
         WHERE id = $1 AND "isActive" = TRUE`,
        [userId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    }, CACHE_TTL.USER);

    if (!cachedProfile) {
      res.status(404).json({ ok: false, error: { message: "User not found." } });
      return;
    }

    res.json({ ok: true, data: { user: cachedProfile } });
  } catch (err) {
    console.error("[users/:userId GET] DB/Cache error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch user profile." } });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/users/:userId/stats
 * Returns extended gamification stats: battle record, chapter progress, XP breakdown.
 * Cached to prevent complex JOIN aggregations.
 * ───────────────────────────────────────────── */
router.get("/:userId/stats", async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId || userId.length > 128) {
    res.status(400).json({ ok: false, error: { message: "Invalid userId." } });
    return;
  }

  const cacheKey = `user:stats:${userId}`;

  try {
    const cachedStats = await cache.getOrSet(cacheKey, async () => {
      /* Battle stats — wins, losses, total matches from MatchParticipant + Match */
      const battleResult = await pool.query(
        `SELECT
           COUNT(*)::int AS "totalBattles",
           COUNT(*) FILTER (WHERE mp."isWinner" = TRUE)::int AS wins,
           COUNT(*) FILTER (WHERE mp."isWinner" = FALSE AND m.status = 'COMPLETED')::int AS losses,
           ROUND(
             COALESCE(COUNT(*) FILTER (WHERE mp."isWinner" = TRUE) * 100.0 / NULLIF(COUNT(*), 0), 0),
             1
           )::float AS "winRate"
         FROM "MatchParticipant" mp
         JOIN "Match" m ON mp."matchId" = m.id
         WHERE mp."userId" = $1 AND m.status = 'COMPLETED'`,
        [userId]
      );

      /* Chapter progress stats from UserProgress */
      const progressResult = await pool.query(
        `SELECT
           COUNT(*)::int AS "totalChapters",
           COUNT(*) FILTER (WHERE up.completed = TRUE)::int AS "completedChapters",
           COALESCE(SUM(score), 0)::int AS "totalScore"
         FROM "UserProgress" up
         WHERE up."userId" = $1`,
        [userId]
      );

      return {
        battles: battleResult.rows[0] ?? { totalBattles: 0, wins: 0, losses: 0, winRate: 0 },
        progress: progressResult.rows[0] ?? { totalChapters: 0, completedChapters: 0, totalScore: 0 },
      };
    }, CACHE_TTL.USER);

    res.json({
      ok: true,
      data: {
        userId,
        battles: cachedStats.battles,
        progress: cachedStats.progress,
      },
    });
  } catch (err) {
    console.error("[users/:userId/stats GET] DB/Cache error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch user stats." } });
  }
});

/* ─────────────────────────────────────────────
 * PUT /api/users/:userId/profile
 * Updates a user's display name and/or class level.
 * Only the authenticated user can update their own profile.
 * Invalidates user profile and stats cache.
 *
 * Body: { name?: string, track?: string }
 * ───────────────────────────────────────────── */
router.put("/:userId/profile", authMiddleware, async (req: Request, res: Response) => {
  const { userId } = req.params;
  const requester = req.user;

  /* Users can only edit their own profile */
  if (requester?.userId !== userId) {
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
    updates.push(`"classLevel" = $${params.length}`);
  }

  if (updates.length === 0) {
    res.status(400).json({ ok: false, error: { message: "No valid fields provided to update." } });
    return;
  }

  params.push(userId);
  updates.push(`"updatedAt" = NOW()`);

  try {
    const result = await pool.query(
      `UPDATE "User"
       SET ${updates.join(", ")}
       WHERE id = $${params.length}
       RETURNING id, name, xp, "currentLevel" AS level, "currentStreak" AS streak`,
      params
    );

    if (result.rows.length === 0) {
      res.status(404).json({ ok: false, error: { message: "User not found." } });
      return;
    }

    // Write-Through: Invalidate target user cache endpoints so updates reflect immediately
    await cache.del(`user:profile:${userId}`);
    await cache.del(`user:stats:${userId}`);
    // Also delete user leaderboard cache entries since streak or name might have changed
    await cache.invalidateByPrefix("leaderboard:");

    res.json({ ok: true, data: { user: result.rows[0] } });
  } catch (err) {
    console.error("[users/:userId/profile PUT] DB error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to update profile." } });
  }
});

export default router;
