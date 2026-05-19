/**
 * FILE: battle.ts
 * LOCATION: backend/src/routes/battle.ts
 * PURPOSE: REST API routes for the EduQuest Battle Arena.
 *          Handles matchmaking queue, match lifecycle, answer submission,
 *          and match history.
 *
 * ENDPOINTS:
 *  POST   /api/battle/queue         — Join matchmaking queue
 *  DELETE /api/battle/queue         — Leave matchmaking queue
 *  GET    /api/battle/matches/:id   — Get match details and questions
 *  POST   /api/battle/matches/:id/answer — Submit an answer
 *  POST   /api/battle/matches/:id/complete — Force-complete a match
 *  GET    /api/battle/history       — User's battle history
 *
 * DEPENDENCIES: express, ../services/battle.service, ../middlewares/auth.middleware
 * USED BY: frontend battle arena page
 * LAST UPDATED: 2026-05-19
 */

import { Router, Request, Response } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  joinMatchmakingQueue,
  leaveQueue,
  getMatchQuestions,
  completeMatch,
} from "../services/battle.service";
import pool from "../config/database";

const router = Router();

/* All battle routes require authentication */
router.use(authMiddleware);

/* ─────────────────────────────────────────────
 * POST /api/battle/queue
 * Joins the matchmaking queue for a specific subject.
 * If an opponent is found immediately, returns match info.
 * Otherwise, returns "waiting" status.
 *
 * Body: { subjectId: string, mode?: "RANKED" | "CASUAL" }
 * ───────────────────────────────────────────── */
router.post("/queue", async (req: Request, res: Response) => {
  const { subjectId, mode = "RANKED" } = req.body;

  if (!subjectId) {
    res.status(400).json({ ok: false, error: { message: "Subject ID is required." } });
    return;
  }

  try {
    const result = await joinMatchmakingQueue({
      userId: req.user!.userId,
      subjectId,
      mode,
    });

    if ("error" in result) {
      res.status(result.statusCode).json({ ok: false, error: { message: result.error } });
      return;
    }

    const statusCode = result.status === "matched" ? 200 : 202;
    res.status(statusCode).json({ ok: true, data: result });
  } catch (err) {
    console.error("[battle/queue POST] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Matchmaking failed." } });
  }
});

/* ─────────────────────────────────────────────
 * DELETE /api/battle/queue
 * Leaves the matchmaking queue (cancels waiting match).
 * ───────────────────────────────────────────── */
router.delete("/queue", async (req: Request, res: Response) => {
  try {
    const result = await leaveQueue(req.user!.userId);

    if ("error" in result) {
      res.status(result.statusCode).json({ ok: false, error: { message: result.error } });
      return;
    }

    res.json({ ok: true, data: { message: "Left the queue." } });
  } catch (err) {
    console.error("[battle/queue DELETE] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to leave queue." } });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/battle/matches/:id
 * Returns match details including participants and questions.
 * Questions do NOT include correct answers (anti-cheat).
 * ───────────────────────────────────────────── */
router.get("/matches/:id", async (req: Request, res: Response) => {
  const id = String(req.params.id);

  try {
    // Get match info
    const matchResult = await pool.query(
      `SELECT m.id, m.status, m.mode, m."questionsCount", m."timePerQuestion",
              m."startTime", m."endTime",
              s.name AS "subjectName"
       FROM "Match" m
       JOIN "Subject" s ON m."subjectId" = s.id
       WHERE m.id = $1`,
      [id]
    );

    if (matchResult.rows.length === 0) {
      res.status(404).json({ ok: false, error: { message: "Match not found." } });
      return;
    }

    // Get participants
    const participantsResult = await pool.query(
      `SELECT mp."userId", mp.score, mp."correctAnswers", mp."wrongAnswers",
              mp."isWinner", mp."xpEarned",
              u.name, u."currentLevel" AS level
       FROM "MatchParticipant" mp
       JOIN "User" u ON mp."userId" = u.id
       WHERE mp."matchId" = $1`,
      [id]
    );

    // Get questions if match is active
    let questions = null;
    const match = matchResult.rows[0];
    if (match.status === "ACTIVE" || match.status === "COMPLETED") {
      const questionResult = await getMatchQuestions(id);
      if (!("error" in questionResult)) {
        questions = questionResult.questions;
      }
    }

    res.json({
      ok: true,
      data: {
        match: matchResult.rows[0],
        participants: participantsResult.rows,
        questions,
      },
    });
  } catch (err) {
    console.error("[battle/matches/:id GET] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch match." } });
  }
});

/* ─────────────────────────────────────────────
 * POST /api/battle/matches/:id/answer
 * Submits an answer for a match question.
 * Validates the answer server-side and updates the score.
 *
 * Body: { questionId: string, answer: string, responseTime: number }
 * ───────────────────────────────────────────── */
router.post("/matches/:id/answer", async (req: Request, res: Response) => {
  const matchId = String(req.params.id);
  const userId = req.user!.userId;
  const { questionId, answer, responseTime = 30000 } = req.body;

  if (!questionId || !answer) {
    res.status(400).json({ ok: false, error: { message: "Question ID and answer are required." } });
    return;
  }

  try {
    // Verify match is active
    const matchCheck = await pool.query(
      `SELECT status FROM "Match" WHERE id = $1`,
      [matchId]
    );

    if (matchCheck.rows.length === 0 || matchCheck.rows[0].status !== "ACTIVE") {
      res.status(400).json({ ok: false, error: { message: "Match is not active." } });
      return;
    }

    // Get correct answer
    const questionResult = await pool.query(
      `SELECT answer, points FROM "Question" WHERE id = $1`,
      [questionId]
    );

    if (questionResult.rows.length === 0) {
      res.status(404).json({ ok: false, error: { message: "Question not found." } });
      return;
    }

    const correctAnswer = questionResult.rows[0].answer;
    const points = questionResult.rows[0].points;
    const isCorrect = answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

    // Calculate time bonus (faster = more points)
    let scoreGained = 0;
    if (isCorrect) {
      const timeBonus = Math.max(0, Math.floor((30000 - responseTime) / 3000)); // 0-10 bonus
      scoreGained = points + timeBonus;
    }

    // Update participant score
    await pool.query(
      `UPDATE "MatchParticipant"
       SET score = score + $1,
           "correctAnswers" = "correctAnswers" + $2,
           "wrongAnswers" = "wrongAnswers" + $3,
           "avgResponseTime" = CASE
             WHEN "avgResponseTime" IS NULL THEN $4
             ELSE ("avgResponseTime" + $4) / 2
           END
       WHERE "matchId" = $5 AND "userId" = $6`,
      [scoreGained, isCorrect ? 1 : 0, isCorrect ? 0 : 1, responseTime / 1000, matchId, userId]
    );

    res.json({
      ok: true,
      data: {
        isCorrect,
        correctAnswer: isCorrect ? correctAnswer : undefined, // Only reveal if correct
        scoreGained,
        responseTime,
      },
    });
  } catch (err) {
    console.error("[battle/matches/:id/answer POST] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to submit answer." } });
  }
});

/* ─────────────────────────────────────────────
 * POST /api/battle/matches/:id/complete
 * Completes a match, determines winner, and awards XP.
 * Called when all questions are answered or time expires.
 * ───────────────────────────────────────────── */
router.post("/matches/:id/complete", async (req: Request, res: Response) => {
  const matchId = String(req.params.id);

  try {
    const result = await completeMatch(matchId);

    if ("error" in result) {
      res.status(result.statusCode || 500).json({ ok: false, error: { message: result.error } });
      return;
    }

    res.json({ ok: true, data: result });
  } catch (err) {
    console.error("[battle/matches/:id/complete POST] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to complete match." } });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/battle/history
 * Returns the user's battle history with recent matches.
 *
 * Query params:
 *  limit  — Max records (default: 20)
 *  offset — Pagination offset (default: 0)
 * ───────────────────────────────────────────── */
router.get("/history", async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const limit = Math.min(parseInt(String(req.query.limit ?? "20"), 10), 50);
  const offset = Math.max(parseInt(String(req.query.offset ?? "0"), 10), 0);

  try {
    const result = await pool.query(
      `SELECT
         m.id AS "matchId", m.status, m.mode, m."startTime", m."endTime",
         s.name AS "subjectName",
         mp.score AS "myScore", mp."correctAnswers" AS "myCorrectAnswers",
         mp."isWinner" AS "iWon", mp."xpEarned",
         opp.name AS "opponentName", opp_mp.score AS "opponentScore"
       FROM "MatchParticipant" mp
       JOIN "Match" m ON mp."matchId" = m.id
       JOIN "Subject" s ON m."subjectId" = s.id
       LEFT JOIN "MatchParticipant" opp_mp ON opp_mp."matchId" = m.id AND opp_mp."userId" != $1
       LEFT JOIN "User" opp ON opp_mp."userId" = opp.id
       WHERE mp."userId" = $1 AND m.status = 'COMPLETED'
       ORDER BY m."endTime" DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    // Get total battle count
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM "MatchParticipant" mp
       JOIN "Match" m ON mp."matchId" = m.id
       WHERE mp."userId" = $1 AND m.status = 'COMPLETED'`,
      [userId]
    );

    // Get win/loss stats
    const statsResult = await pool.query(
      `SELECT
         COUNT(*) AS "totalBattles",
         COUNT(*) FILTER (WHERE "isWinner" = TRUE) AS wins,
         COUNT(*) FILTER (WHERE "isWinner" = FALSE) AS losses,
         COALESCE(SUM("xpEarned"), 0) AS "totalXPFromBattles"
       FROM "MatchParticipant" mp
       JOIN "Match" m ON mp."matchId" = m.id
       WHERE mp."userId" = $1 AND m.status = 'COMPLETED'`,
      [userId]
    );

    res.json({
      ok: true,
      data: {
        matches: result.rows,
        total: parseInt(countResult.rows[0].count),
        stats: statsResult.rows[0],
        limit,
        offset,
      },
    });
  } catch (err) {
    console.error("[battle/history GET] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch battle history." } });
  }
});

export default router;
