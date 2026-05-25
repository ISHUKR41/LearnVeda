/**
 * FILE: content.ts
 * LOCATION: backend/src/routes/content.ts
 * PURPOSE: REST API routes for academic content — classes, subjects, chapters, topics.
 *          Implements low-latency response caching using the hybrid cache layer (Redis + LRU local fallback)
 *          to support 10k+ concurrent users with sub-millisecond response times.
 *
 * ENDPOINTS:
 *  GET /api/content/classes           — List all class categories (cached)
 *  GET /api/content/classes/:slug     — Single class with its subjects (cached)
 *  GET /api/content/subjects/:id      — Subject with its chapters (cached)
 *  GET /api/content/chapters/:id      — Chapter with topics and questions (cached)
 *  GET /api/content/topics/:id        — Topic with theory content and questions (cached)
 *  GET /api/content/engineering       — All coding languages (cached)
 *  GET /api/content/engineering/:slug — Language with learning plans (cached)
 *  GET /api/content/stats             — Platform-wide statistics (cached)
 *
 * DEPENDENCIES: express, ../config/database, ../config/cache
 * USED BY: frontend pages (class-9, class-10, class-11, class-12, engineering)
 * LAST UPDATED: 2026-05-24
 */

import { Router, Request, Response } from "express";
import pool from "../config/database";
import { cache, CACHE_TTL } from "../config/cache";

const router = Router();

/* ─────────────────────────────────────────────
 * GET /api/content/classes
 * Returns all class categories ordered by position.
 * Cached to prevent database roundtrips on main navigation renders.
 * ───────────────────────────────────────────── */
router.get("/classes", async (_req: Request, res: Response) => {
  try {
    const classes = await cache.getOrSet("content:classes", async () => {
      const result = await pool.query(
        `SELECT id, name, slug, description, icon, color, "orderIndex"
         FROM "ClassCategory"
         WHERE "isActive" = TRUE
         ORDER BY "orderIndex" ASC`
      );

      // Also fetch subject count per class for display
      const countResult = await pool.query(
        `SELECT "classId", COUNT(*) as "subjectCount"
         FROM "Subject"
         WHERE "isActive" = TRUE
         GROUP BY "classId"`
      );

      const subjectCounts = new Map(
        countResult.rows.map((r: { classId: string; subjectCount: string }) => [r.classId, parseInt(r.subjectCount)])
      );

      return result.rows.map((cls: Record<string, unknown>) => ({
        ...cls,
        subjectCount: subjectCounts.get(cls.id as string) ?? 0,
      }));
    }, CACHE_TTL.STATIC);

    res.json({ ok: true, data: { classes } });
  } catch (err) {
    console.error("[content/classes GET] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch classes." } });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/content/classes/:slug
 * Returns a single class category with all its subjects.
 * The slug matches the URL path: "class-9", "class-10", etc.
 * Cached by slug.
 * ───────────────────────────────────────────── */
router.get("/classes/:slug", async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const cachedData = await cache.getOrSet(`content:class:${slug}`, async () => {
      // Fetch the class
      const classResult = await pool.query(
        `SELECT id, name, slug, description, icon, color
         FROM "ClassCategory"
         WHERE slug = $1 AND "isActive" = TRUE`,
        [slug]
      );

      if (classResult.rows.length === 0) {
        return null;
      }

      const classData = classResult.rows[0];

      // Fetch subjects for this class
      const subjectsResult = await pool.query(
        `SELECT s.id, s.name, s.slug, s.description, s.icon, s.color, s."orderIndex",
                st.name AS "streamName", st.slug AS "streamSlug",
                COUNT(c.id) AS "chapterCount"
         FROM "Subject" s
         LEFT JOIN "Stream" st ON s."streamId" = st.id
         LEFT JOIN "Chapter" c ON c."subjectId" = s.id
         WHERE s."classId" = $1 AND s."isActive" = TRUE
         GROUP BY s.id, s.name, s.slug, s.description, s.icon, s.color, s."orderIndex", st.name, st.slug
         ORDER BY s."orderIndex" ASC`,
        [classData.id]
      );

      return {
        class: classData,
        subjects: subjectsResult.rows,
      };
    }, CACHE_TTL.STATIC);

    if (!cachedData) {
      res.status(404).json({ ok: false, error: { message: "Class not found." } });
      return;
    }

    res.json({
      ok: true,
      data: cachedData,
    });
  } catch (err) {
    console.error("[content/classes/:slug GET] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch class details." } });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/content/subjects/:id
 * Returns a subject with all its chapters, ordered by position.
 * Each chapter includes topic count and estimated study time.
 * Cached by subject ID.
 * ───────────────────────────────────────────── */
router.get("/subjects/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const cachedData = await cache.getOrSet(`content:subject:${id}`, async () => {
      const subjectResult = await pool.query(
        `SELECT s.id, s.name, s.slug, s.description, s.icon, s.color,
                cc.name AS "className", cc.slug AS "classSlug"
         FROM "Subject" s
         JOIN "ClassCategory" cc ON s."classId" = cc.id
         WHERE s.id = $1`,
        [id]
      );

      if (subjectResult.rows.length === 0) {
        return null;
      }

      const chaptersResult = await pool.query(
        `SELECT ch.id, ch.title, ch.slug, ch.description, ch."orderIndex",
                ch."estimatedMinutes", ch.difficulty,
                COUNT(t.id) AS "topicCount"
         FROM "Chapter" ch
         LEFT JOIN "Topic" t ON t."chapterId" = ch.id
         WHERE ch."subjectId" = $1
         GROUP BY ch.id, ch.title, ch.slug, ch.description, ch."orderIndex", ch."estimatedMinutes", ch.difficulty
         ORDER BY ch."orderIndex" ASC`,
        [id]
      );

      return {
        subject: subjectResult.rows[0],
        chapters: chaptersResult.rows,
      };
    }, CACHE_TTL.STATIC);

    if (!cachedData) {
      res.status(404).json({ ok: false, error: { message: "Subject not found." } });
      return;
    }

    res.json({
      ok: true,
      data: cachedData,
    });
  } catch (err) {
    console.error("[content/subjects/:id GET] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch subject details." } });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/content/chapters/:id
 * Returns a chapter with all its topics and question counts.
 * Topics include theory content, video links, and question counts.
 * Cached by chapter ID.
 * ───────────────────────────────────────────── */
router.get("/chapters/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const cachedData = await cache.getOrSet(`content:chapter:${id}`, async () => {
      const chapterResult = await pool.query(
        `SELECT ch.id, ch.title, ch.slug, ch.description, ch."estimatedMinutes", ch.difficulty,
                s.name AS "subjectName", s.slug AS "subjectSlug",
                cc.name AS "className", cc.slug AS "classSlug"
         FROM "Chapter" ch
         JOIN "Subject" s ON ch."subjectId" = s.id
         JOIN "ClassCategory" cc ON s."classId" = cc.id
         WHERE ch.id = $1`,
        [id]
      );

      if (chapterResult.rows.length === 0) {
        return null;
      }

      const topicsResult = await pool.query(
        `SELECT t.id, t.title, t.slug, t."youtubeUrl", t."orderIndex",
                t."hasAnimation", t."hasSimulation",
                COUNT(q.id) AS "questionCount"
         FROM "Topic" t
         LEFT JOIN "Question" q ON q."topicId" = t.id
         WHERE t."chapterId" = $1
         GROUP BY t.id, t.title, t.slug, t."youtubeUrl", t."orderIndex", t."hasAnimation", t."hasSimulation"
         ORDER BY t."orderIndex" ASC`,
        [id]
      );

      return {
        chapter: chapterResult.rows[0],
        topics: topicsResult.rows,
      };
    }, CACHE_TTL.CONTENT);

    if (!cachedData) {
      res.status(404).json({ ok: false, error: { message: "Chapter not found." } });
      return;
    }

    res.json({
      ok: true,
      data: cachedData,
    });
  } catch (err) {
    console.error("[content/chapters/:id GET] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch chapter details." } });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/content/topics/:id
 * Returns a topic with its theory content, video link, and all questions.
 * This is the main learning view — students study theory then attempt questions.
 * Cached by topic ID.
 * ───────────────────────────────────────────── */
router.get("/topics/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const cachedData = await cache.getOrSet(`content:topic:${id}`, async () => {
      const topicResult = await pool.query(
        `SELECT t.id, t.title, t.slug, t.content, t."youtubeUrl",
                t."hasAnimation", t."hasSimulation",
                ch.title AS "chapterTitle", ch.slug AS "chapterSlug",
                s.name AS "subjectName"
         FROM "Topic" t
         JOIN "Chapter" ch ON t."chapterId" = ch.id
         JOIN "Subject" s ON ch."subjectId" = s.id
         WHERE t.id = $1`,
         [id]
      );

      if (topicResult.rows.length === 0) {
        return null;
      }

      const questionsResult = await pool.query(
        `SELECT id, content, type, options, difficulty, points, "youtubeUrl", "imageUrl"
         FROM "Question"
         WHERE "topicId" = $1
         ORDER BY difficulty ASC`,
        [id]
      );

      // Parse JSON options for each question
      const questions = questionsResult.rows.map((q: Record<string, unknown>) => ({
        ...q,
        options: q.options ? JSON.parse(q.options as string) : null,
      }));

      return {
        topic: topicResult.rows[0],
        questions,
      };
    }, CACHE_TTL.CONTENT);

    if (!cachedData) {
      res.status(404).json({ ok: false, error: { message: "Topic not found." } });
      return;
    }

    res.json({
      ok: true,
      data: cachedData,
    });
  } catch (err) {
    console.error("[content/topics/:id GET] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch topic details." } });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/content/engineering
 * Returns all coding languages available on the engineering page.
 * Each language includes the number of available plans and problems.
 * Cached.
 * ───────────────────────────────────────────── */
router.get("/engineering", async (_req: Request, res: Response) => {
  try {
    const languages = await cache.getOrSet("content:engineering", async () => {
      const result = await pool.query(
        `SELECT cl.id, cl.name, cl.slug, cl.description, cl.icon, cl.color, cl.difficulty,
                COUNT(DISTINCT lp.id) AS "planCount",
                COUNT(DISTINCT cp.id) AS "problemCount"
         FROM "CodingLanguage" cl
         LEFT JOIN "LearningPlan" lp ON lp."languageId" = cl.id
         LEFT JOIN "CodingProblem" cp ON cp."languageId" = cl.id
         GROUP BY cl.id, cl.name, cl.slug, cl.description, cl.icon, cl.color, cl.difficulty
         ORDER BY cl.name ASC`
      );
      return result.rows;
    }, CACHE_TTL.STATIC);

    res.json({ ok: true, data: { languages } });
  } catch (err) {
    console.error("[content/engineering GET] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch engineering languages." } });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/content/engineering/:slug
 * Returns a specific coding language with its learning plans and daily lessons.
 * Cached by language slug.
 * ───────────────────────────────────────────── */
router.get("/engineering/:slug", async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const cachedData = await cache.getOrSet(`content:engineering:${slug}`, async () => {
      const langResult = await pool.query(
        `SELECT id, name, slug, description, icon, color, difficulty
         FROM "CodingLanguage"
         WHERE slug = $1`,
        [slug]
      );

      if (langResult.rows.length === 0) {
        return null;
      }

      const language = langResult.rows[0];

      // Fetch learning plans
      const plansResult = await pool.query(
        `SELECT lp.id, lp.name, lp.slug, lp."durationDays", lp.description, lp.difficulty,
                COUNT(dl.id) AS "lessonCount"
         FROM "LearningPlan" lp
         LEFT JOIN "DailyLesson" dl ON dl."planId" = lp.id
         WHERE lp."languageId" = $1
         GROUP BY lp.id, lp.name, lp.slug, lp."durationDays", lp.description, lp.difficulty
         ORDER BY lp."durationDays" ASC`,
        [language.id]
      );

      return {
        language,
        plans: plansResult.rows,
      };
    }, CACHE_TTL.STATIC);

    if (!cachedData) {
      res.status(404).json({ ok: false, error: { message: "Programming language not found." } });
      return;
    }

    res.json({
      ok: true,
      data: cachedData,
    });
  } catch (err) {
    console.error("[content/engineering/:slug GET] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch language details." } });
  }
});

/* ─────────────────────────────────────────────
 * GET /api/content/stats
 * Returns platform-wide statistics for the home page.
 * Cached using Hybrid Cache with a 5-minute TTL.
 * ───────────────────────────────────────────── */
router.get("/stats", async (_req: Request, res: Response) => {
  try {
    const stats = await cache.getOrSet("content:stats", async () => {
      const [users, subjects, chapters, questions] = await Promise.all([
        pool.query(`SELECT COUNT(*) FROM "User" WHERE "isActive" = TRUE`),
        pool.query(`SELECT COUNT(*) FROM "Subject" WHERE "isActive" = TRUE`),
        pool.query(`SELECT COUNT(*) FROM "Chapter"`),
        pool.query(`SELECT COUNT(*) FROM "Question"`),
      ]);

      return {
        totalStudents: parseInt(users.rows[0].count),
        totalSubjects: parseInt(subjects.rows[0].count),
        totalChapters: parseInt(chapters.rows[0].count),
        totalQuestions: parseInt(questions.rows[0].count),
      };
    }, 5 * 60 * 1000); // 5 minutes TTL

    res.json({ ok: true, data: stats });
  } catch (err) {
    console.error("[content/stats GET] Error:", err);
    res.status(500).json({ ok: false, error: { message: "Failed to fetch platform stats." } });
  }
});

export default router;
