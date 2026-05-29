/**
 * FILE: progress.ts
 * LOCATION: backend/src/routes/progress.ts
 * PURPOSE: REST API routes for user learning progress tracking.
 *          Records chapter completion, calculates XP, updates streaks,
 *          and provides progress analytics.
 *
 * ENDPOINTS:
 *  GET    /api/progress              — User's overall progress summary
 *  GET    /api/progress/chapters     — Chapter-wise progress details
 *  PUT    /api/progress/chapters/:id — Update progress for a specific chapter
 *  GET    /api/progress/streak       — Current streak info and history
 *  GET    /api/progress/stats        — Detailed stats (XP breakdown, time spent)
 *
 * DEPENDENCIES: express, ../services/progress.service, ../middlewares/auth.middleware
 * USED BY: frontend dashboard, class pages, progress analytics
 * LAST UPDATED: 2026-05-19
 */

import { Router, Request, Response } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  updateChapterProgress,
  getUserProgressSummary,
} from "../services/progress.service";
import pool from "../config/database";

const router = Router();

/* All progress routes require authentication */
router.use(authMiddleware);

/* ─────────────────────────────────────────────
 * GET /api/progress
 * Returns the authenticated user's overall learning progress.
 * Includes completion stats, time spent, and XP breakdown.
 * ───────────────────────────────────────────── */
router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const result = await getUserProgressSummary(userId);

    // Get user's current XP/level info
    const userResult = await pool.query(
      `SELECT xp, "currentLevel", "currentStreak", "highestStreak", points
       FROM "User" WHERE id = $1`,
      [userId]
    );

    res.json({
      ok: true,
      data: {
        ...result,
        user: userResult.rows[0] ?? null,
      },
    });
  } catch (err) {
    console.error("[progress GET] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch progress." } });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/progress/chapters
 * Returns chapter-wise progress for the user.
 * Optionally filterable by class or subject.
 *
 * Query params:
 *  classSlug   — Filter by class ("class-9", etc.)
 *  subjectSlug — Filter by subject
 * ───────────────────────────────────────────── */
router.get("/chapters", async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const classSlug = req.query.class ? String(req.query.class) : null;
  const subjectSlug = req.query.subject ? String(req.query.subject) : null;

  try {
    const params: (string | number)[] = [userId];
    let whereClause = `WHERE up."userId" = $1`;

    if (classSlug) {
      params.push(classSlug);
      whereClause += ` AND cc.slug = $${params.length}`;
    }

    if (subjectSlug) {
      params.push(subjectSlug);
      whereClause += ` AND s.slug = $${params.length}`;
    }

    const result = await pool.query(
      `SELECT
         up."chapterId", up.completed, up.score, up."timeSpent", up.answers, up."lastStudied",
         ch.title AS "chapterTitle", ch."orderIndex",
         s.name AS "subjectName", s.slug AS "subjectSlug",
         cc.name AS "className", cc.slug AS "classSlug"
       FROM "UserProgress" up
       JOIN "Chapter" ch ON up."chapterId" = ch.id
       JOIN "Subject" s ON ch."subjectId" = s.id
       JOIN "ClassCategory" cc ON s."classId" = cc.id
       ${whereClause}
       ORDER BY cc."orderIndex" ASC, s."orderIndex" ASC, ch."orderIndex" ASC`,
      params
    );

    res.json({
      ok: true,
      data: { chapters: result.rows },
    });
  } catch (err) {
    console.error("[progress/chapters GET] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch chapter progress." } });
  }
});

/* ─────────────────────────────────────────────
 * PUT /api/progress/chapters/:id
 * Updates the user's progress on a specific chapter.
 * Triggers XP calculation, streak update, and wallet credit.
 *
 * Body: { completed?: boolean, score?: number, timeSpent?: number }
 * Returns: XP calculation result with level-up info
 * ───────────────────────────────────────────── */
router.put("/chapters/:id", async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const chapterId = String(req.params.id);

  const { completed, score, timeSpent, answers } = req.body as {
    completed?: boolean;
    score?: number;
    timeSpent?: number;
    answers?: string;
  };

  // Validate score range
  if (score !== undefined && (score < 0 || score > 100)) {
    res.status(400).json({ ok: false, error: { message: "Score must be between 0 and 100." } });
    return;
  }

  try {
    // Verify chapter exists
    const chapterCheck = await pool.query(
      `SELECT id FROM "Chapter" WHERE id = $1`,
      [chapterId]
    );

    if (chapterCheck.rows.length === 0) {
      res.status(404).json({ ok: false, error: { message: "Chapter not found." } });
      return;
    }

    const result = await updateChapterProgress({
      userId,
      chapterId,
      completed,
      score,
      timeSpent,
      answers,
    });

    if ("error" in result) {
      res.status(result.statusCode).json({ ok: false, error: { message: result.error } });
      return;
    }

    res.json({
      ok: true,
      data: {
        message: result.leveledUp
          ? `🎉 Level Up! You reached Level ${result.newLevel}!`
          : `Progress saved. +${result.xpEarned} XP earned!`,
        ...result,
      },
    });
  } catch (err) {
    console.error("[progress/chapters/:id PUT] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to update progress." } });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/progress/streak
 * Returns the user's current streak info and last 30 days of activity.
 * ───────────────────────────────────────────── */
router.get("/streak", async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  try {
    // Get user streak info
    const userResult = await pool.query(
      `SELECT "currentStreak", "highestStreak", "lastActive"
       FROM "User" WHERE id = $1`,
      [userId]
    );

    // Get last 30 days of streak records
    const streakResult = await pool.query(
      `SELECT date, "questionsAnswered", "pointsEarned", "minutesStudied"
       FROM "StreakRecord"
       WHERE "userId" = $1 AND date >= CURRENT_DATE - INTERVAL '30 days'
       ORDER BY date DESC`,
      [userId]
    );

    const user = userResult.rows[0] ?? {};

    // Generate last 30 days with active/inactive status
    const activeDates = new Set(
      streakResult.rows.map((r: { date: string }) => new Date(r.date).toISOString().split("T")[0])
    );

    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const isoDate = date.toISOString().split("T")[0];
      days.push({
        date: isoDate,
        isActive: activeDates.has(isoDate),
        isToday: i === 0,
      });
    }

    res.json({
      ok: true,
      data: {
        currentStreak: user.currentStreak ?? 0,
        highestStreak: user.highestStreak ?? 0,
        lastActive: user.lastActive,
        days,
        records: streakResult.rows,
      },
    });
  } catch (err) {
    console.error("[progress/streak GET] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch streak data." } });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/progress/stats
 * Returns detailed learning statistics — XP history, study time, battle stats.
 * ───────────────────────────────────────────── */
router.get("/stats", async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  try {
    // XP breakdown by source (last 30 days)
    const xpResult = await pool.query(
      `SELECT type, SUM(amount) AS total
       FROM "WalletTransaction"
       WHERE "userId" = $1 AND amount > 0 AND "createdAt" >= NOW() - INTERVAL '30 days'
       GROUP BY type
       ORDER BY total DESC`,
      [userId]
    );

    // Weekly study time (last 4 weeks)
    const timeResult = await pool.query(
      `SELECT
         DATE_TRUNC('week', date) AS week,
         SUM("minutesStudied") AS "totalMinutes",
         SUM("questionsAnswered") AS "totalQuestions"
       FROM "StreakRecord"
       WHERE "userId" = $1 AND date >= CURRENT_DATE - INTERVAL '28 days'
       GROUP BY week
       ORDER BY week ASC`,
      [userId]
    );

    // Subject-wise progress
    const subjectResult = await pool.query(
      `SELECT
         s.name AS "subjectName",
         COUNT(up.id) AS "chaptersStudied",
         COUNT(up.id) FILTER (WHERE up.completed = TRUE) AS "chaptersCompleted",
         COALESCE(AVG(up.score), 0) AS "avgScore"
       FROM "UserProgress" up
       JOIN "Chapter" ch ON up."chapterId" = ch.id
       JOIN "Subject" s ON ch."subjectId" = s.id
       WHERE up."userId" = $1
       GROUP BY s.name
       ORDER BY "chaptersStudied" DESC`,
      [userId]
    );

    res.json({
      ok: true,
      data: {
        xpBreakdown: xpResult.rows,
        weeklyActivity: timeResult.rows,
        subjectProgress: subjectResult.rows,
      },
    });
  } catch (err) {
    console.error("[progress/stats GET] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch stats." } });
  }
});

export default router;
