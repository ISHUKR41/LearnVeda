/**
 * FILE: tests.ts
 * LOCATION: backend/src/routes/tests.ts
 * PURPOSE: REST API routes for mock test execution and results.
 *          Handles test discovery, session creation, answer submission,
 *          score calculation, and detailed result retrieval.
 *
 * ENDPOINTS:
 *  GET  /api/tests/chapter/:chapterId     — Get available tests for a chapter
 *  GET  /api/tests/:testId                — Get test details with questions
 *  POST /api/tests/:testId/start          — Start a test session
 *  POST /api/tests/:testId/submit         — Submit test answers and calculate score
 *  GET  /api/tests/:testId/results/:scoreId — View detailed test results
 *  GET  /api/tests/history                — User's test history
 *
 * FLOW:
 *  1. User browses available tests → GET /api/tests/chapter/:chapterId
 *  2. User selects a test → GET /api/tests/:testId (loads questions)
 *  3. User starts the test → POST /api/tests/:testId/start (creates TestScore entry)
 *  4. User submits answers → POST /api/tests/:testId/submit (calculates score)
 *  5. User views results → GET /api/tests/:testId/results/:scoreId
 *
 * DEPENDENCIES: express, ../config/database, ../config/cache,
 *               ../middlewares/auth.middleware, ../utils/query-helpers
 * USED BY: Test/quiz frontend pages for each class
 * LAST UPDATED: 2026-05-26
 */

import { Router, Request, Response } from "express";
import pool from "../config/database";
import { cache, CACHE_TTL } from "../config/cache";
import { authMiddleware } from "../middlewares/auth.middleware";
import { parsePagination, buildPaginationMeta, successResponse } from "../utils/query-helpers";

const router = Router();

/* ─────────────────────────────────────────────
 * GET /api/tests/chapter/:chapterId
 * Returns all available tests for a specific chapter.
 * Includes test metadata like duration, total marks, type, and question count.
 * Cached using CONTENT TTL.
 * ───────────────────────────────────────────── */
router.get("/chapter/:chapterId", async (req: Request, res: Response) => {
  const { chapterId } = req.params;

  try {
    const data = await cache.getOrSet(`tests:chapter:${chapterId}`, async () => {
      /* Fetch chapter info for context */
      const chapterResult = await pool.query(
        `SELECT ch.id, ch.title, ch.slug,
                s.name AS "subjectName", s.slug AS "subjectSlug",
                cc.name AS "className", cc.slug AS "classSlug"
         FROM "Chapter" ch
         JOIN "Subject" s ON ch."subjectId" = s.id
         JOIN "ClassCategory" cc ON s."classId" = cc.id
         WHERE ch.id = $1`,
        [chapterId]
      );

      if (chapterResult.rows.length === 0) {
        return null;
      }

      /* Fetch available tests for this chapter */
      const testsResult = await pool.query(
        `SELECT mt.id, mt.title, mt.description, mt.duration,
                mt."totalMarks", mt."passMarks", mt."testType",
                mt."isProctored", mt."isActive",
                COUNT(q.id) AS "questionCount"
         FROM "MockTest" mt
         LEFT JOIN "Question" q ON q."testId" = mt.id
         WHERE mt."chapterId" = $1 AND mt."isActive" = TRUE
         GROUP BY mt.id, mt.title, mt.description, mt.duration,
                  mt."totalMarks", mt."passMarks", mt."testType",
                  mt."isProctored", mt."isActive"
         ORDER BY mt."testType" ASC, mt.title ASC`,
        [chapterId]
      );

      return {
        chapter: chapterResult.rows[0],
        tests: testsResult.rows,
      };
    }, CACHE_TTL.CONTENT);

    if (!data) {
      res.status(404).json({ ok: false, error: { message: "Chapter not found." } });
      return;
    }

    res.json(successResponse(data));
  } catch (err) {
    console.error("[tests/chapter/:chapterId GET] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch tests." } });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/tests/:testId
 * Returns test details with all questions (for taking the test).
 * Questions are shuffled randomly for each request.
 *
 * SECURITY: Correct answers are NOT included in the response.
 *           Answers are only revealed after submission.
 * ───────────────────────────────────────────── */
router.get("/:testId", async (req: Request, res: Response) => {
  const { testId } = req.params;

  try {
    /* Fetch test metadata */
    const testResult = await pool.query(
      `SELECT mt.id, mt.title, mt.description, mt.duration,
              mt."totalMarks", mt."passMarks", mt."testType",
              mt."isProctored",
              ch.title AS "chapterTitle",
              s.name AS "subjectName",
              cc.name AS "className"
       FROM "MockTest" mt
       LEFT JOIN "Chapter" ch ON mt."chapterId" = ch.id
       LEFT JOIN "Subject" s ON ch."subjectId" = s.id
       LEFT JOIN "ClassCategory" cc ON s."classId" = cc.id
       WHERE mt.id = $1 AND mt."isActive" = TRUE`,
      [testId]
    );

    if (testResult.rows.length === 0) {
      res.status(404).json({ ok: false, error: { message: "Test not found." } });
      return;
    }

    /* Fetch questions — EXCLUDE correct answers (security) */
    const questionsResult = await pool.query(
      `SELECT id, content, type, options, difficulty, points, "imageUrl"
       FROM "Question"
       WHERE "testId" = $1
       ORDER BY RANDOM()`,
      [testId]
    );

    /* Parse options JSON for each question */
    const questions = questionsResult.rows.map((q: Record<string, unknown>) => ({
      ...q,
      options: q.options ? JSON.parse(q.options as string) : null,
      /* answer is intentionally NOT included — prevents cheating */
    }));

    res.json(successResponse({
      test: testResult.rows[0],
      questions,
      questionCount: questions.length,
    }));
  } catch (err) {
    console.error("[tests/:testId GET] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch test details." } });
  }
});

/* ─────────────────────────────────────────────
 * POST /api/tests/:testId/start
 * Starts a test session for the authenticated user.
 * Creates a TestScore entry with status "IN_PROGRESS".
 *
 * Returns: { scoreId: string, startedAt: string }
 * ───────────────────────────────────────────── */
router.post("/:testId/start", authMiddleware, async (req: Request, res: Response) => {
  const { testId } = req.params;

  try {
    /* Verify the test exists and is active */
    const testResult = await pool.query(
      `SELECT id, "totalMarks" FROM "MockTest" WHERE id = $1 AND "isActive" = TRUE`,
      [testId]
    );

    if (testResult.rows.length === 0) {
      res.status(404).json({ ok: false, error: { message: "Test not found or inactive." } });
      return;
    }

    /* Create a new TestScore entry to track this attempt */
    const result = await pool.query(
      `INSERT INTO "TestScore" (id, "testId", "userId", score, total, "completedAt")
       VALUES (gen_random_uuid()::text, $1, $2, 0, $3, NOW())
       RETURNING id, "completedAt" AS "startedAt"`,
      [testId, req.user!.userId, testResult.rows[0].totalMarks]
    );

    res.status(201).json(successResponse({
      scoreId: result.rows[0].id,
      startedAt: result.rows[0].startedAt,
      message: "Test session started. Good luck!",
    }));
  } catch (err) {
    console.error("[tests/:testId/start POST] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to start test." } });
  }
});

/* ─────────────────────────────────────────────
 * POST /api/tests/:testId/submit
 * Submits test answers and calculates the final score.
 *
 * Body: {
 *   scoreId: string,     — The test session ID from /start
 *   answers: Array<{
 *     questionId: string, — ID of the question
 *     userAnswer: string  — User's selected answer
 *   }>,
 *   timeTaken: number     — Total time taken in seconds
 * }
 *
 * Returns: {
 *   score: number, total: number, percentage: number,
 *   passed: boolean, details: Array<{ questionId, correct, userAnswer, correctAnswer }>
 * }
 * ───────────────────────────────────────────── */
router.post("/:testId/submit", authMiddleware, async (req: Request, res: Response) => {
  const { testId } = req.params;
  const { scoreId, answers, timeTaken } = req.body;

  if (!scoreId || !Array.isArray(answers)) {
    res.status(400).json({
      ok: false,
      error: { code: "VALIDATION_ERROR", message: "ScoreId and answers array are required." },
    });
    return;
  }

  try {
    /* Fetch the test and its questions with correct answers */
    const testResult = await pool.query(
      `SELECT id, "totalMarks", "passMarks" FROM "MockTest" WHERE id = $1`,
      [testId]
    );

    if (testResult.rows.length === 0) {
      res.status(404).json({ ok: false, error: { message: "Test not found." } });
      return;
    }

    const test = testResult.rows[0];

    /* Fetch all questions with their correct answers */
    const questionsResult = await pool.query(
      `SELECT id, answer, points, explanation FROM "Question" WHERE "testId" = $1`,
      [testId]
    );

    /* Build a map of question ID → correct answer for fast lookup */
    const answerMap = new Map<string, { answer: string; points: number; explanation: string | null }>(
      questionsResult.rows.map((q: Record<string, unknown>) => [
        q.id as string,
        {
          answer: q.answer as string,
          points: q.points as number,
          explanation: q.explanation as string | null,
        },
      ])
    );

    /* Grade each answer */
    let totalScore = 0;
    const details = answers.map((ans: { questionId: string; userAnswer: string }) => {
      const correct = answerMap.get(ans.questionId);
      if (!correct) {
        return {
          questionId: ans.questionId,
          correct: false,
          userAnswer: ans.userAnswer,
          correctAnswer: null,
          explanation: null,
          pointsEarned: 0,
        };
      }

      /* Case-insensitive comparison for text answers */
      const isCorrect = correct.answer.toLowerCase().trim() === (ans.userAnswer ?? "").toLowerCase().trim();

      if (isCorrect) {
        totalScore += correct.points;
      }

      return {
        questionId: ans.questionId,
        correct: isCorrect,
        userAnswer: ans.userAnswer,
        correctAnswer: correct.answer,
        explanation: correct.explanation,
        pointsEarned: isCorrect ? correct.points : 0,
      };
    });

    /* Calculate percentage */
    const percentage = test.totalMarks > 0 ? Math.round((totalScore / test.totalMarks) * 100) : 0;
    const passed = totalScore >= test.passMarks;

    /* Update the TestScore record with final results */
    await pool.query(
      `UPDATE "TestScore"
       SET score = $1, percentage = $2, "timeTaken" = $3,
           answers = $4, "completedAt" = NOW()
       WHERE id = $5`,
      [totalScore, percentage, timeTaken ?? null, JSON.stringify(details), scoreId]
    );

    /* Award XP for completing the test */
    const xpEarned = Math.floor(totalScore * 0.5); // Half of score as XP
    if (xpEarned > 0) {
      await pool.query(
        `UPDATE "User" SET xp = xp + $1, points = points + $1 WHERE id = $2`,
        [xpEarned, req.user!.userId]
      );
    }

    res.json(successResponse({
      score: totalScore,
      total: test.totalMarks,
      percentage,
      passed,
      passMarks: test.passMarks,
      xpEarned,
      timeTaken: timeTaken ?? null,
      details,
    }));
  } catch (err) {
    console.error("[tests/:testId/submit POST] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to submit test." } });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/tests/:testId/results/:scoreId
 * Returns detailed results for a completed test attempt.
 * Includes per-question breakdown with correct answers and explanations.
 * ───────────────────────────────────────────── */
router.get("/:testId/results/:scoreId", authMiddleware, async (req: Request, res: Response) => {
  const { testId, scoreId } = req.params;

  try {
    /* Fetch the score record */
    const scoreResult = await pool.query(
      `SELECT ts.id, ts.score, ts.total, ts.percentage, ts."timeTaken",
              ts.answers, ts."completedAt",
              mt.title AS "testTitle", mt."testType",
              ch.title AS "chapterTitle",
              s.name AS "subjectName"
       FROM "TestScore" ts
       JOIN "MockTest" mt ON ts."testId" = mt.id
       LEFT JOIN "Chapter" ch ON mt."chapterId" = ch.id
       LEFT JOIN "Subject" s ON ch."subjectId" = s.id
       WHERE ts.id = $1 AND ts."testId" = $2 AND ts."userId" = $3`,
      [scoreId, testId, req.user!.userId]
    );

    if (scoreResult.rows.length === 0) {
      res.status(404).json({ ok: false, error: { message: "Test result not found." } });
      return;
    }

    const result = scoreResult.rows[0];

    /* Parse the answers JSON */
    let answers: unknown[] = [];
    try {
      answers = result.answers ? JSON.parse(result.answers) : [];
    } catch { /* ignore */ }

    res.json(successResponse({
      ...result,
      answers,
    }));
  } catch (err) {
    console.error("[tests/:testId/results/:scoreId GET] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch test results." } });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/tests/history
 * Returns the authenticated user's test history.
 * Supports pagination.
 * ───────────────────────────────────────────── */
router.get("/history", authMiddleware, async (req: Request, res: Response) => {
  const { limit, offset } = parsePagination(req.query as Record<string, unknown>);

  try {
    /* Get total count */
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM "TestScore" WHERE "userId" = $1`,
      [req.user!.userId]
    );
    const total = parseInt(countResult.rows[0].count);

    /* Fetch test history */
    const result = await pool.query(
      `SELECT ts.id AS "scoreId", ts.score, ts.total, ts.percentage,
              ts."timeTaken", ts."completedAt",
              mt.id AS "testId", mt.title AS "testTitle", mt."testType",
              ch.title AS "chapterTitle",
              s.name AS "subjectName"
       FROM "TestScore" ts
       JOIN "MockTest" mt ON ts."testId" = mt.id
       LEFT JOIN "Chapter" ch ON mt."chapterId" = ch.id
       LEFT JOIN "Subject" s ON ch."subjectId" = s.id
       WHERE ts."userId" = $1
       ORDER BY ts."completedAt" DESC
       LIMIT $2 OFFSET $3`,
      [req.user!.userId, limit, offset]
    );

    res.json(successResponse({
      history: result.rows,
      pagination: buildPaginationMeta(total, { limit, offset, page: Math.floor(offset / limit) + 1 }),
    }));
  } catch (err) {
    console.error("[tests/history GET] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch test history." } });
  }
});

export default router;
