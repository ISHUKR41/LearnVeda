/**
 * FILE: admin.ts
 * LOCATION: backend/src/routes/admin.ts
 * PURPOSE: REST API routes for admin-level content management.
 *          Allows administrators and teachers to create, update, and delete
 *          academic content (subjects, chapters, topics, questions) through
 *          the API without direct database access.
 *
 * ENDPOINTS:
 *  POST   /api/admin/subjects            — Create a new subject
 *  POST   /api/admin/chapters            — Create a new chapter
 *  POST   /api/admin/topics              — Create a new topic with theory content
 *  POST   /api/admin/questions           — Add a single question
 *  POST   /api/admin/questions/bulk      — Bulk add questions (JSON array)
 *  PUT    /api/admin/questions/:id        — Edit an existing question
 *  DELETE /api/admin/questions/:id        — Delete a question
 *  POST   /api/admin/events              — Create a new event
 *  PUT    /api/admin/events/:id           — Update an event
 *  GET    /api/admin/stats               — Platform-wide admin statistics
 *
 * SECURITY:
 *  - All routes require authentication (authMiddleware)
 *  - All routes require ADMIN or TEACHER role (requireRole middleware)
 *  - Input validation on all POST/PUT bodies
 *
 * DEPENDENCIES: express, ../config/database, ../config/cache
 *               ../middlewares/auth.middleware, ../utils/query-helpers
 * USED BY: Admin dashboard frontend page
 * LAST UPDATED: 2026-05-26
 */

import { Router, Request, Response } from "express";
import pool from "../config/database";
import { cache } from "../config/cache";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware";
import { generateSlug, successResponse } from "../utils/query-helpers";

const router = Router();

/* ─────────────────────────────────────────────
 * SECURITY: All admin routes require authentication + admin/teacher role.
 * This middleware stack runs before every route in this file.
 * ───────────────────────────────────────────── */
router.use(authMiddleware);
router.use(requireRole("ADMIN", "TEACHER"));

/* ─────────────────────────────────────────────
 * POST /api/admin/subjects
 * Creates a new subject under a specific class.
 *
 * Body: {
 *   name: string,          — "Advanced Mathematics"
 *   classId: string,       — ID of the parent ClassCategory
 *   description?: string,  — Subject description
 *   icon?: string,         — Lucide icon name
 *   color?: string,        — Hex color code
 *   streamId?: string      — Stream ID (for Class 11/12 only)
 * }
 *
 * Returns: Created subject object
 * ───────────────────────────────────────────── */
router.post("/subjects", async (req: Request, res: Response) => {
  const { name, classId, description, icon, color, streamId } = req.body;

  /* Validate required fields */
  if (!name || !classId) {
    res.status(400).json({
      ok: false,
      error: { code: "VALIDATION_ERROR", message: "Name and classId are required." },
    });
    return;
  }

  try {
    const slug = generateSlug(name);

    /* Get the next orderIndex for this class */
    const orderResult = await pool.query(
      `SELECT COALESCE(MAX("orderIndex"), -1) + 1 AS next_order
       FROM "Subject" WHERE "classId" = $1`,
      [classId]
    );
    const orderIndex = orderResult.rows[0].next_order;

    /* Insert the new subject */
    const result = await pool.query(
      `INSERT INTO "Subject" (id, name, slug, description, icon, color, "classId", "streamId", "orderIndex", "isActive")
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8, TRUE)
       RETURNING id, name, slug, description, icon, color, "orderIndex"`,
      [name, slug, description ?? null, icon ?? null, color ?? null, classId, streamId ?? null, orderIndex]
    );

    /* Invalidate content cache so new subject appears immediately */
    await cache.invalidateByPrefix("content:");

    res.status(201).json(successResponse(result.rows[0]));
  } catch (err) {
    console.error("[admin/subjects POST] Error:", err);
    res.status(500).json({
      ok: false,
      error: { message: "Failed to create subject." },
    });
  }
});

/* ─────────────────────────────────────────────
 * POST /api/admin/chapters
 * Creates a new chapter under a specific subject.
 *
 * Body: {
 *   title: string,            — "Quadratic Equations"
 *   subjectId: string,        — ID of the parent Subject
 *   description?: string,     — Chapter description
 *   estimatedMinutes?: number, — Estimated study time (default: 60)
 *   difficulty?: string       — "EASY" | "MEDIUM" | "HARD" (default: "MEDIUM")
 * }
 *
 * Returns: Created chapter object
 * ───────────────────────────────────────────── */
router.post("/chapters", async (req: Request, res: Response) => {
  const { title, subjectId, description, estimatedMinutes, difficulty } = req.body;

  if (!title || !subjectId) {
    res.status(400).json({
      ok: false,
      error: { code: "VALIDATION_ERROR", message: "Title and subjectId are required." },
    });
    return;
  }

  try {
    const slug = generateSlug(title);

    /* Get the next orderIndex for this subject */
    const orderResult = await pool.query(
      `SELECT COALESCE(MAX("orderIndex"), -1) + 1 AS next_order
       FROM "Chapter" WHERE "subjectId" = $1`,
      [subjectId]
    );
    const orderIndex = orderResult.rows[0].next_order;

    const result = await pool.query(
      `INSERT INTO "Chapter" (id, title, slug, description, "orderIndex", "subjectId", "estimatedMinutes", difficulty)
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7)
       RETURNING id, title, slug, description, "orderIndex", "estimatedMinutes", difficulty`,
      [title, slug, description ?? null, orderIndex, subjectId, estimatedMinutes ?? 60, difficulty ?? "MEDIUM"]
    );

    await cache.invalidateByPrefix("content:");

    res.status(201).json(successResponse(result.rows[0]));
  } catch (err) {
    console.error("[admin/chapters POST] Error:", err);
    res.status(500).json({
      ok: false,
      error: { message: "Failed to create chapter." },
    });
  }
});

/* ─────────────────────────────────────────────
 * POST /api/admin/topics
 * Creates a new topic under a specific chapter with theory content.
 *
 * Body: {
 *   title: string,          — "Types of Numbers"
 *   chapterId: string,      — ID of the parent Chapter
 *   content?: string,       — Rich text/markdown theory content
 *   youtubeUrl?: string,    — Video lecture URL
 *   hasAnimation?: boolean, — Has interactive animation
 *   hasSimulation?: boolean — Has interactive simulation
 * }
 *
 * Returns: Created topic object
 * ───────────────────────────────────────────── */
router.post("/topics", async (req: Request, res: Response) => {
  const { title, chapterId, content, youtubeUrl, hasAnimation, hasSimulation } = req.body;

  if (!title || !chapterId) {
    res.status(400).json({
      ok: false,
      error: { code: "VALIDATION_ERROR", message: "Title and chapterId are required." },
    });
    return;
  }

  try {
    const slug = generateSlug(title);

    const orderResult = await pool.query(
      `SELECT COALESCE(MAX("orderIndex"), -1) + 1 AS next_order
       FROM "Topic" WHERE "chapterId" = $1`,
      [chapterId]
    );
    const orderIndex = orderResult.rows[0].next_order;

    const result = await pool.query(
      `INSERT INTO "Topic" (id, title, slug, content, "youtubeUrl", "orderIndex", "chapterId", "hasAnimation", "hasSimulation")
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, title, slug, "orderIndex"`,
      [title, slug, content ?? null, youtubeUrl ?? null, orderIndex, chapterId, hasAnimation ?? false, hasSimulation ?? false]
    );

    await cache.invalidateByPrefix("content:");

    res.status(201).json(successResponse(result.rows[0]));
  } catch (err) {
    console.error("[admin/topics POST] Error:", err);
    res.status(500).json({
      ok: false,
      error: { message: "Failed to create topic." },
    });
  }
});

/* ─────────────────────────────────────────────
 * POST /api/admin/questions
 * Creates a new question linked to a topic or test.
 *
 * Body: {
 *   content: string,       — Question text (supports markdown + LaTeX)
 *   type?: string,         — "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER" | "FILL_BLANK" | "NUMERIC"
 *   options?: string[],    — Answer options for MCQ (array of 4 strings)
 *   answer: string,        — Correct answer text or option index
 *   explanation?: string,  — Detailed solution explanation
 *   youtubeUrl?: string,   — Video solution link
 *   imageUrl?: string,     — Question image URL
 *   difficulty?: string,   — "EASY" | "MEDIUM" | "HARD"
 *   points?: number,       — Points awarded (default: 10)
 *   topicId?: string,      — Link to a Topic
 *   testId?: string        — Link to a MockTest
 * }
 *
 * Returns: Created question object
 * ───────────────────────────────────────────── */
router.post("/questions", async (req: Request, res: Response) => {
  const {
    content, type, options, answer, explanation,
    youtubeUrl, imageUrl, difficulty, points, topicId, testId,
  } = req.body;

  if (!content || !answer) {
    res.status(400).json({
      ok: false,
      error: { code: "VALIDATION_ERROR", message: "Content and answer are required." },
    });
    return;
  }

  try {
    /* Serialize options array to JSON string for storage */
    const optionsJson = options ? JSON.stringify(options) : null;

    const result = await pool.query(
      `INSERT INTO "Question" (id, content, type, options, answer, explanation, "youtubeUrl", "imageUrl", difficulty, points, "topicId", "testId")
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id, content, type, difficulty, points`,
      [content, type ?? "MCQ", optionsJson, answer, explanation ?? null, youtubeUrl ?? null, imageUrl ?? null, difficulty ?? "MEDIUM", points ?? 10, topicId ?? null, testId ?? null]
    );

    await cache.invalidateByPrefix("content:");

    res.status(201).json(successResponse(result.rows[0]));
  } catch (err) {
    console.error("[admin/questions POST] Error:", err);
    res.status(500).json({
      ok: false,
      error: { message: "Failed to create question." },
    });
  }
});

/* ─────────────────────────────────────────────
 * POST /api/admin/questions/bulk
 * Bulk creates multiple questions at once.
 * Accepts a JSON array of question objects.
 *
 * Body: { questions: Array<QuestionInput> }
 *
 * Returns: { created: number, failed: number }
 * ───────────────────────────────────────────── */
router.post("/questions/bulk", async (req: Request, res: Response) => {
  const { questions } = req.body;

  if (!Array.isArray(questions) || questions.length === 0) {
    res.status(400).json({
      ok: false,
      error: { code: "VALIDATION_ERROR", message: "A non-empty questions array is required." },
    });
    return;
  }

  /* Limit bulk insert to 100 questions per request */
  if (questions.length > 100) {
    res.status(400).json({
      ok: false,
      error: { code: "LIMIT_EXCEEDED", message: "Maximum 100 questions per bulk insert." },
    });
    return;
  }

  const client = await pool.connect();
  let created = 0;
  let failed = 0;

  try {
    await client.query("BEGIN");

    for (const q of questions) {
      try {
        const optionsJson = q.options ? JSON.stringify(q.options) : null;

        await client.query(
          `INSERT INTO "Question" (id, content, type, options, answer, explanation, "youtubeUrl", "imageUrl", difficulty, points, "topicId", "testId")
           VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [q.content, q.type ?? "MCQ", optionsJson, q.answer, q.explanation ?? null, q.youtubeUrl ?? null, q.imageUrl ?? null, q.difficulty ?? "MEDIUM", q.points ?? 10, q.topicId ?? null, q.testId ?? null]
        );
        created++;
      } catch {
        failed++;
      }
    }

    await client.query("COMMIT");
    await cache.invalidateByPrefix("content:");

    res.status(201).json(successResponse({ created, failed, total: questions.length }));
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[admin/questions/bulk POST] Error:", err);
    res.status(500).json({
      ok: false,
      error: { message: "Bulk question creation failed." },
    });
  } finally {
    client.release();
  }
});

/* ─────────────────────────────────────────────
 * PUT /api/admin/questions/:id
 * Updates an existing question.
 *
 * Body: Any subset of question fields to update
 * Returns: Updated question object
 * ───────────────────────────────────────────── */
router.put("/questions/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content, type, options, answer, explanation, youtubeUrl, imageUrl, difficulty, points } = req.body;

  try {
    const optionsJson = options ? JSON.stringify(options) : undefined;

    /* Build dynamic SET clause — only update fields that were provided */
    const updates: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (content !== undefined) { updates.push(`content = $${paramIndex++}`); values.push(content); }
    if (type !== undefined) { updates.push(`type = $${paramIndex++}`); values.push(type); }
    if (optionsJson !== undefined) { updates.push(`options = $${paramIndex++}`); values.push(optionsJson); }
    if (answer !== undefined) { updates.push(`answer = $${paramIndex++}`); values.push(answer); }
    if (explanation !== undefined) { updates.push(`explanation = $${paramIndex++}`); values.push(explanation); }
    if (youtubeUrl !== undefined) { updates.push(`"youtubeUrl" = $${paramIndex++}`); values.push(youtubeUrl); }
    if (imageUrl !== undefined) { updates.push(`"imageUrl" = $${paramIndex++}`); values.push(imageUrl); }
    if (difficulty !== undefined) { updates.push(`difficulty = $${paramIndex++}`); values.push(difficulty); }
    if (points !== undefined) { updates.push(`points = $${paramIndex++}`); values.push(points); }

    if (updates.length === 0) {
      res.status(400).json({
        ok: false,
        error: { message: "No fields provided to update." },
      });
      return;
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE "Question" SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING id, content, type, difficulty, points`,
      values
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        ok: false,
        error: { message: "Question not found." },
      });
      return;
    }

    await cache.invalidateByPrefix("content:");

    res.json(successResponse(result.rows[0]));
  } catch (err) {
    console.error("[admin/questions/:id PUT] Error:", err);
    res.status(500).json({
      ok: false,
      error: { message: "Failed to update question." },
    });
  }
});

/* ─────────────────────────────────────────────
 * DELETE /api/admin/questions/:id
 * Permanently deletes a question.
 * ───────────────────────────────────────────── */
router.delete("/questions/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM "Question" WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        ok: false,
        error: { message: "Question not found." },
      });
      return;
    }

    await cache.invalidateByPrefix("content:");

    res.json(successResponse({ deleted: true, id }));
  } catch (err) {
    console.error("[admin/questions/:id DELETE] Error:", err);
    res.status(500).json({
      ok: false,
      error: { message: "Failed to delete question." },
    });
  }
});

/* ─────────────────────────────────────────────
 * POST /api/admin/events
 * Creates a new event or competition.
 *
 * Body: {
 *   title: string,
 *   description: string,
 *   eventType?: string,         — "COMPETITION" | "HACKATHON" | "QUIZ" | "WORKSHOP"
 *   venue?: string,
 *   maxParticipants?: number,
 *   startTime: string (ISO),
 *   endTime: string (ISO),
 *   registrationDeadline?: string (ISO),
 *   isProctored?: boolean,
 *   bannerUrl?: string,
 *   collegeName?: string
 * }
 * ───────────────────────────────────────────── */
router.post("/events", async (req: Request, res: Response) => {
  const {
    title, description, eventType, venue, maxParticipants,
    startTime, endTime, registrationDeadline, isProctored,
    bannerUrl, collegeName,
  } = req.body;

  if (!title || !description || !startTime || !endTime) {
    res.status(400).json({
      ok: false,
      error: { code: "VALIDATION_ERROR", message: "Title, description, startTime, and endTime are required." },
    });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO "Event" (id, title, description, "organizerId", "eventType", venue, "maxParticipants",
       "startTime", "endTime", "registrationDeadline", "isProctored", "requiresSafeBrowser",
       status, "bannerUrl", "collegeName", "createdAt", "updatedAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, FALSE,
       'PUBLISHED', $11, $12, NOW(), NOW())
       RETURNING id, title, "eventType", status, "startTime", "endTime"`,
      [title, description, req.user!.userId, eventType ?? "COMPETITION", venue ?? "Online", maxParticipants ?? null, startTime, endTime, registrationDeadline ?? null, isProctored ?? false, bannerUrl ?? null, collegeName ?? null]
    );

    res.status(201).json(successResponse(result.rows[0]));
  } catch (err) {
    console.error("[admin/events POST] Error:", err);
    res.status(500).json({
      ok: false,
      error: { message: "Failed to create event." },
    });
  }
});

/* ─────────────────────────────────────────────
 * PUT /api/admin/events/:id
 * Updates an existing event.
 * ───────────────────────────────────────────── */
router.put("/events/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, eventType, venue, maxParticipants, startTime, endTime, registrationDeadline, status, bannerUrl, collegeName } = req.body;

  try {
    const updates: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (title !== undefined) { updates.push(`title = $${paramIndex++}`); values.push(title); }
    if (description !== undefined) { updates.push(`description = $${paramIndex++}`); values.push(description); }
    if (eventType !== undefined) { updates.push(`"eventType" = $${paramIndex++}`); values.push(eventType); }
    if (venue !== undefined) { updates.push(`venue = $${paramIndex++}`); values.push(venue); }
    if (maxParticipants !== undefined) { updates.push(`"maxParticipants" = $${paramIndex++}`); values.push(maxParticipants); }
    if (startTime !== undefined) { updates.push(`"startTime" = $${paramIndex++}`); values.push(startTime); }
    if (endTime !== undefined) { updates.push(`"endTime" = $${paramIndex++}`); values.push(endTime); }
    if (registrationDeadline !== undefined) { updates.push(`"registrationDeadline" = $${paramIndex++}`); values.push(registrationDeadline); }
    if (status !== undefined) { updates.push(`status = $${paramIndex++}`); values.push(status); }
    if (bannerUrl !== undefined) { updates.push(`"bannerUrl" = $${paramIndex++}`); values.push(bannerUrl); }
    if (collegeName !== undefined) { updates.push(`"collegeName" = $${paramIndex++}`); values.push(collegeName); }

    updates.push(`"updatedAt" = NOW()`);

    if (updates.length <= 1) {
      res.status(400).json({ ok: false, error: { message: "No fields provided to update." } });
      return;
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE "Event" SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING id, title, status`,
      values
    );

    if (result.rows.length === 0) {
      res.status(404).json({ ok: false, error: { message: "Event not found." } });
      return;
    }

    res.json(successResponse(result.rows[0]));
  } catch (err) {
    console.error("[admin/events/:id PUT] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to update event." } });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/admin/stats
 * Returns comprehensive platform statistics for the admin dashboard.
 * ───────────────────────────────────────────── */
router.get("/stats", async (_req: Request, res: Response) => {
  try {
    const [users, subjects, chapters, questions, topics, events, posts, matches] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM "User" WHERE "isActive" = TRUE`),
      pool.query(`SELECT COUNT(*) FROM "Subject" WHERE "isActive" = TRUE`),
      pool.query(`SELECT COUNT(*) FROM "Chapter"`),
      pool.query(`SELECT COUNT(*) FROM "Question"`),
      pool.query(`SELECT COUNT(*) FROM "Topic"`),
      pool.query(`SELECT COUNT(*) FROM "Event"`),
      pool.query(`SELECT COUNT(*) FROM "CommunityPost"`),
      pool.query(`SELECT COUNT(*) FROM "Match"`),
    ]);

    res.json(successResponse({
      totalUsers: parseInt(users.rows[0].count),
      totalSubjects: parseInt(subjects.rows[0].count),
      totalChapters: parseInt(chapters.rows[0].count),
      totalQuestions: parseInt(questions.rows[0].count),
      totalTopics: parseInt(topics.rows[0].count),
      totalEvents: parseInt(events.rows[0].count),
      totalPosts: parseInt(posts.rows[0].count),
      totalMatches: parseInt(matches.rows[0].count),
    }));
  } catch (err) {
    console.error("[admin/stats GET] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch admin stats." } });
  }
});

export default router;
