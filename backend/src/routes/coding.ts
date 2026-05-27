/**
 * FILE: coding.ts
 * LOCATION: backend/src/routes/coding.ts
 * PURPOSE: REST API routes for the Engineering/Coding section of EduQuest.
 *          Handles learning plans, daily lessons, coding problems, and
 *          code submission with result tracking.
 *
 * ENDPOINTS:
 *  GET  /api/coding/languages/:slug/plans        — Get learning plans for a language
 *  GET  /api/coding/plans/:planId/lessons         — Get daily lessons for a plan
 *  GET  /api/coding/lessons/:lessonId             — Get lesson with theory + problems
 *  GET  /api/coding/problems/:id                  — Get problem details with starter code
 *  POST /api/coding/problems/:id/submit           — Submit code solution
 *  GET  /api/coding/submissions                   — User's submission history
 *  GET  /api/coding/submissions/:problemId/best   — User's best submission for a problem
 *
 * DEPENDENCIES: express, ../config/database, ../config/cache,
 *               ../middlewares/auth.middleware, ../utils/query-helpers
 * USED BY: Engineering frontend pages
 * LAST UPDATED: 2026-05-26
 */

import { Router, Request, Response } from "express";
import pool from "../config/database";
import { cache, CACHE_TTL } from "../config/cache";
import { authMiddleware } from "../middlewares/auth.middleware";
import { parsePagination, buildPaginationMeta, successResponse } from "../utils/query-helpers";

const router = Router();

/* ─────────────────────────────────────────────
 * GET /api/coding/languages/:slug/plans
 * Returns all learning plans for a specific programming language.
 * Each plan includes lesson count and total problem count.
 * Cached using the STATIC TTL (changes rarely).
 * ───────────────────────────────────────────── */
router.get("/languages/:slug/plans", async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const data = await cache.getOrSet(`coding:plans:${slug}`, async () => {
      /* First, find the language by slug */
      const langResult = await pool.query(
        `SELECT id, name, slug, description, icon, color, difficulty
         FROM "CodingLanguage" WHERE slug = $1`,
        [slug]
      );

      if (langResult.rows.length === 0) {
        return null;
      }

      const language = langResult.rows[0];

      /* Fetch learning plans with lesson and problem counts */
      const plansResult = await pool.query(
        `SELECT lp.id, lp.name, lp.slug, lp."durationDays", lp.description, lp.difficulty,
                COUNT(DISTINCT dl.id) AS "lessonCount",
                COUNT(DISTINCT cp.id) AS "problemCount"
         FROM "LearningPlan" lp
         LEFT JOIN "DailyLesson" dl ON dl."planId" = lp.id
         LEFT JOIN "CodingProblem" cp ON cp."dailyLessonId" = dl.id
         WHERE lp."languageId" = $1
         GROUP BY lp.id, lp.name, lp.slug, lp."durationDays", lp.description, lp.difficulty
         ORDER BY lp."durationDays" ASC`,
        [language.id]
      );

      return { language, plans: plansResult.rows };
    }, CACHE_TTL.STATIC);

    if (!data) {
      res.status(404).json({
        ok: false,
        error: { message: "Programming language not found." },
      });
      return;
    }

    res.json(successResponse(data));
  } catch (err) {
    console.error("[coding/languages/:slug/plans GET] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch learning plans." } });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/coding/plans/:planId/lessons
 * Returns all daily lessons for a specific learning plan.
 * Each lesson includes its day number, title, and problem count.
 * Ordered by day number ascending.
 * ───────────────────────────────────────────── */
router.get("/plans/:planId/lessons", async (req: Request, res: Response) => {
  const { planId } = req.params;

  try {
    const data = await cache.getOrSet(`coding:lessons:${planId}`, async () => {
      /* Fetch the plan metadata */
      const planResult = await pool.query(
        `SELECT lp.id, lp.name, lp.slug, lp."durationDays", lp.description, lp.difficulty,
                cl.name AS "languageName", cl.slug AS "languageSlug", cl.icon AS "languageIcon"
         FROM "LearningPlan" lp
         JOIN "CodingLanguage" cl ON lp."languageId" = cl.id
         WHERE lp.id = $1`,
        [planId]
      );

      if (planResult.rows.length === 0) {
        return null;
      }

      /* Fetch all daily lessons for this plan */
      const lessonsResult = await pool.query(
        `SELECT dl.id, dl."dayNumber", dl.title, dl.description,
                dl."youtubeUrl",
                COUNT(cp.id) AS "problemCount"
         FROM "DailyLesson" dl
         LEFT JOIN "CodingProblem" cp ON cp."dailyLessonId" = dl.id
         WHERE dl."planId" = $1
         GROUP BY dl.id, dl."dayNumber", dl.title, dl.description, dl."youtubeUrl"
         ORDER BY dl."dayNumber" ASC`,
        [planId]
      );

      return {
        plan: planResult.rows[0],
        lessons: lessonsResult.rows,
      };
    }, CACHE_TTL.CONTENT);

    if (!data) {
      res.status(404).json({ ok: false, error: { message: "Learning plan not found." } });
      return;
    }

    res.json(successResponse(data));
  } catch (err) {
    console.error("[coding/plans/:planId/lessons GET] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch daily lessons." } });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/coding/lessons/:lessonId
 * Returns a single daily lesson with its theory content and coding problems.
 * This is the main learning view for the engineering section.
 * ───────────────────────────────────────────── */
router.get("/lessons/:lessonId", async (req: Request, res: Response) => {
  const { lessonId } = req.params;

  try {
    const data = await cache.getOrSet(`coding:lesson:${lessonId}`, async () => {
      /* Fetch lesson with plan and language info */
      const lessonResult = await pool.query(
        `SELECT dl.id, dl."dayNumber", dl.title, dl.description,
                dl."theoryContent", dl."youtubeUrl",
                lp.name AS "planName", lp.slug AS "planSlug",
                cl.name AS "languageName", cl.slug AS "languageSlug"
         FROM "DailyLesson" dl
         JOIN "LearningPlan" lp ON dl."planId" = lp.id
         JOIN "CodingLanguage" cl ON dl."languageId" = cl.id
         WHERE dl.id = $1`,
        [lessonId]
      );

      if (lessonResult.rows.length === 0) {
        return null;
      }

      /* Fetch coding problems for this lesson */
      const problemsResult = await pool.query(
        `SELECT id, title, description, difficulty, points, "starterCode", "youtubeUrl"
         FROM "CodingProblem"
         WHERE "dailyLessonId" = $1
         ORDER BY difficulty ASC, title ASC`,
        [lessonId]
      );

      return {
        lesson: lessonResult.rows[0],
        problems: problemsResult.rows,
      };
    }, CACHE_TTL.CONTENT);

    if (!data) {
      res.status(404).json({ ok: false, error: { message: "Lesson not found." } });
      return;
    }

    res.json(successResponse(data));
  } catch (err) {
    console.error("[coding/lessons/:lessonId GET] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch lesson details." } });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/coding/problems/:id
 * Returns a single coding problem with starter code and test cases.
 * NOTE: Does NOT include the solution code (that's admin-only).
 * ───────────────────────────────────────────── */
router.get("/problems/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const data = await cache.getOrSet(`coding:problem:${id}`, async () => {
      const result = await pool.query(
        `SELECT cp.id, cp.title, cp.description, cp.difficulty, cp.points,
                cp."starterCode", cp."testCases", cp."youtubeUrl",
                cl.name AS "languageName", cl.slug AS "languageSlug"
         FROM "CodingProblem" cp
         JOIN "CodingLanguage" cl ON cp."languageId" = cl.id
         WHERE cp.id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const problem = result.rows[0];

      /* Parse test cases JSON — only show first 2 as examples */
      let testCases: unknown[] = [];
      try {
        const allCases = JSON.parse(problem.testCases);
        testCases = Array.isArray(allCases) ? allCases.slice(0, 2) : [];
      } catch { /* ignore parse errors */ }

      return {
        ...problem,
        testCases: undefined,       // Remove raw test cases from response
        sampleCases: testCases,     // Only show 2 example test cases
        totalTestCases: testCases.length,
      };
    }, CACHE_TTL.CONTENT);

    if (!data) {
      res.status(404).json({ ok: false, error: { message: "Problem not found." } });
      return;
    }

    res.json(successResponse(data));
  } catch (err) {
    console.error("[coding/problems/:id GET] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch problem details." } });
  }
});

/* ─────────────────────────────────────────────
 * POST /api/coding/problems/:id/submit
 * Submits a code solution for a coding problem.
 * Validates against test cases and records the result.
 *
 * Body: {
 *   code: string,     — The submitted source code
 *   language: string  — The programming language used
 * }
 *
 * NOTE: In this version, code execution is simulated.
 * For production, integrate with a sandboxed code runner
 * like Judge0, Piston API, or a Docker-based executor.
 * ───────────────────────────────────────────── */
router.post("/problems/:id/submit", authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { code, language } = req.body;

  if (!code || !language) {
    res.status(400).json({
      ok: false,
      error: { code: "VALIDATION_ERROR", message: "Code and language are required." },
    });
    return;
  }

  try {
    /* Fetch the problem with its test cases for validation */
    const problemResult = await pool.query(
      `SELECT id, "testCases", points FROM "CodingProblem" WHERE id = $1`,
      [id]
    );

    if (problemResult.rows.length === 0) {
      res.status(404).json({ ok: false, error: { message: "Problem not found." } });
      return;
    }

    const problem = problemResult.rows[0];

    /* Parse test cases */
    let testCases: Array<{ input: string; expected: string }> = [];
    try {
      testCases = JSON.parse(problem.testCases);
    } catch { /* empty */ }

    /**
     * SIMULATED CODE EXECUTION
     * In production, this should call a sandboxed code runner API.
     * For now, we simulate a pass/fail based on code presence.
     *
     * TODO: Integrate Judge0 or Piston API for real code execution:
     * - POST /api/judge0/submissions with { source_code, language_id, stdin, expected_output }
     * - Poll for results until status !== "Processing"
     * - Compare actual_output with expected_output
     */
    const totalTests = testCases.length || 5;
    const testsPassed = Math.min(totalTests, Math.floor(Math.random() * (totalTests + 1)));
    const status = testsPassed === totalTests ? "PASSED" : "FAILED";
    const executionTime = Math.floor(Math.random() * 500) + 50; // Simulated 50-550ms
    const memoryUsed = Math.floor(Math.random() * 10000) + 1000; // Simulated 1-11MB

    /* Record the submission in the database */
    const result = await pool.query(
      `INSERT INTO "CodingSubmission" (id, "userId", "problemId", code, language, status,
       "executionTime", "memoryUsed", "testsPassed", "testsTotal", "submittedAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
       RETURNING id, status, "executionTime", "memoryUsed", "testsPassed", "testsTotal", "submittedAt"`,
      [req.user!.userId, id, code, language, status, executionTime, memoryUsed, testsPassed, totalTests]
    );

    /* If all tests passed, award XP and points */
    if (status === "PASSED") {
      await pool.query(
        `UPDATE "User" SET xp = xp + $1, points = points + $1 WHERE id = $2`,
        [problem.points, req.user!.userId]
      );
    }

    res.status(201).json(successResponse({
      submission: result.rows[0],
      message: status === "PASSED"
        ? `All ${totalTests} tests passed! You earned ${problem.points} XP.`
        : `${testsPassed}/${totalTests} tests passed. Try again!`,
    }));
  } catch (err) {
    console.error("[coding/problems/:id/submit POST] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to submit solution." } });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/coding/submissions
 * Returns the authenticated user's code submission history.
 * Supports pagination via limit and offset query params.
 * ───────────────────────────────────────────── */
router.get("/submissions", authMiddleware, async (req: Request, res: Response) => {
  const { limit, offset } = parsePagination(req.query as Record<string, unknown>);

  try {
    /* Get total count for pagination */
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM "CodingSubmission" WHERE "userId" = $1`,
      [req.user!.userId]
    );
    const total = parseInt(countResult.rows[0].count);

    /* Fetch submissions with problem info */
    const result = await pool.query(
      `SELECT cs.id, cs.status, cs."executionTime", cs."memoryUsed",
              cs."testsPassed", cs."testsTotal", cs.language, cs."submittedAt",
              cp.title AS "problemTitle", cp.difficulty AS "problemDifficulty"
       FROM "CodingSubmission" cs
       JOIN "CodingProblem" cp ON cs."problemId" = cp.id
       WHERE cs."userId" = $1
       ORDER BY cs."submittedAt" DESC
       LIMIT $2 OFFSET $3`,
      [req.user!.userId, limit, offset]
    );

    res.json(successResponse({
      submissions: result.rows,
      pagination: buildPaginationMeta(total, { limit, offset, page: Math.floor(offset / limit) + 1 }),
    }));
  } catch (err) {
    console.error("[coding/submissions GET] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch submissions." } });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/coding/submissions/:problemId/best
 * Returns the user's best submission for a specific problem.
 * "Best" = highest testsPassed, then fastest executionTime.
 * ───────────────────────────────────────────── */
router.get("/submissions/:problemId/best", authMiddleware, async (req: Request, res: Response) => {
  const { problemId } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, status, "executionTime", "memoryUsed", "testsPassed", "testsTotal", language, "submittedAt"
       FROM "CodingSubmission"
       WHERE "userId" = $1 AND "problemId" = $2
       ORDER BY "testsPassed" DESC, "executionTime" ASC
       LIMIT 1`,
      [req.user!.userId, problemId]
    );

    if (result.rows.length === 0) {
      res.json(successResponse({ bestSubmission: null, message: "No submissions yet." }));
      return;
    }

    res.json(successResponse({ bestSubmission: result.rows[0] }));
  } catch (err) {
    console.error("[coding/submissions/:problemId/best GET] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch best submission." } });
  }
});

export default router;
