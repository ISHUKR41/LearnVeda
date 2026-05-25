/**
 * FILE: route.ts
 * LOCATION: src/app/api/questions/route.ts
 * PURPOSE: Question bank API — returns practice questions for a given chapter.
 *          Supports filtering by difficulty, question type, and pagination.
 *          Questions are served from the eduquest_questions table seeded with
 *          real CBSE NCERT-aligned content.
 *
 * ROUTE:   GET /api/questions?chapter_id=UUID[&difficulty=easy|medium|hard]
 *                                        [&type=mcq|true_false|fill_blank]
 *                                        [&limit=N&offset=N]
 *
 * SECURITY:
 *   - No authentication required (questions are public curriculum content).
 *   - Rate limited by the upstream Nginx/reverse proxy (not in this handler).
 *   - chapter_id must be a valid UUID — invalid values return 400.
 *
 * CACHING:
 *   - Chapter questions rarely change → 10-minute stale-while-revalidate.
 *   - `Cache-Control: public, max-age=600, stale-while-revalidate=3600`
 *   - Individual question detail would use the [id] dynamic segment (future).
 *
 * USED BY: Question practice modal, battle matchmaking service, chapter pages
 * DEPENDENCIES: getPostgresPool, api-response helpers
 * LAST UPDATED: 2026-05-25
 */

import { type NextRequest } from "next/server";
import { getPostgresPool } from "@/lib/server/database/postgres";
import { apiSuccess, apiError } from "@/lib/server/utils/api-response";

/* Force Node.js runtime — required for the PostgreSQL pool */
export const runtime = "nodejs";

/* Public curriculum questions can be cached for 10 minutes */
const QUESTIONS_CACHE_HEADERS = {
  "Cache-Control": "public, max-age=600, stale-while-revalidate=3600",
} as const;

/* Allowed difficulty values checked against the DB constraint */
const VALID_DIFFICULTIES = new Set(["easy", "medium", "hard"]);

/* Allowed question type values matching the DB CHECK constraint */
const VALID_TYPES = new Set(["mcq", "true_false", "fill_blank", "short_answer"]);

/* ─────────────────────────────────────────────
 * GET /api/questions
 * ───────────────────────────────────────────── */

/**
 * Returns practice questions for a specific chapter.
 * The chapter_id is required — without it the caller gets all questions which
 * could be thousands of rows and is never a valid UI use-case.
 *
 * Response shape:
 * {
 *   ok: true,
 *   data: {
 *     questions: Question[],
 *     total: number,
 *     chapterId: string,
 *     filters: { difficulty, type, limit, offset }
 *   }
 * }
 *
 * Each Question:
 * {
 *   id, chapterId, questionText, questionType, difficulty,
 *   options, correctAnswer, explanation, pointsValue,
 *   youtubeHintUrl, sequenceOrder, createdAt
 * }
 *
 * NOTE: correctAnswer and explanation are returned here to support
 * self-paced practice. In battle mode, the battle service strips
 * these fields from the WebSocket event before broadcasting.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  /* ── Required: chapter_id ─────────────────────────────────── */
  const chapterId = searchParams.get("chapter_id");
  if (!chapterId) {
    return apiError("MISSING_CHAPTER_ID", "chapter_id query parameter is required.", 400);
  }

  /* Validate the chapter_id is a well-formed UUID to prevent SQL injection
   * via format-confusion (the pg driver parameterises, but we validate early). */
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(chapterId)) {
    return apiError("INVALID_CHAPTER_ID", "chapter_id must be a valid UUID.", 400);
  }

  /* ── Optional filters ─────────────────────────────────────── */
  const difficulty = searchParams.get("difficulty");
  if (difficulty && !VALID_DIFFICULTIES.has(difficulty)) {
    return apiError("INVALID_DIFFICULTY", "difficulty must be one of: easy, medium, hard.", 400);
  }

  const questionType = searchParams.get("type");
  if (questionType && !VALID_TYPES.has(questionType)) {
    return apiError("INVALID_TYPE", "type must be one of: mcq, true_false, fill_blank, short_answer.", 400);
  }

  /* ── Pagination ───────────────────────────────────────────── */
  const rawLimit  = parseInt(searchParams.get("limit")  ?? "20", 10);
  const rawOffset = parseInt(searchParams.get("offset") ?? "0",  10);

  /* Clamp limit to 1–50 to prevent clients from requesting thousands of rows */
  const limit  = Math.min(Math.max(rawLimit, 1), 50);
  const offset = Math.max(rawOffset, 0);

  /* ── Build query ──────────────────────────────────────────── */
  const pool = getPostgresPool();

  /*
   * Parameterised query — no string interpolation, fully injection-safe.
   * We build the WHERE clause dynamically but always use numbered params ($N).
   */
  const conditions: string[] = ["q.chapter_id = $1", "q.is_active = TRUE"];
  const params: unknown[]    = [chapterId];
  let   paramIndex           = 2;

  if (difficulty) {
    conditions.push(`q.difficulty = $${paramIndex}`);
    params.push(difficulty);
    paramIndex++;
  }

  if (questionType) {
    conditions.push(`q.question_type = $${paramIndex}`);
    params.push(questionType);
    paramIndex++;
  }

  const whereClause = conditions.join(" AND ");

  /* Count query gives the client total results for pagination UI */
  const countQuery = `
    SELECT COUNT(*)::INTEGER AS total
    FROM   eduquest_questions q
    WHERE  ${whereClause}
  `;

  /* Main data query — includes join to chapter for context */
  const dataQuery = `
    SELECT
      q.id,
      q.chapter_id                AS "chapterId",
      q.question_text             AS "questionText",
      q.question_type             AS "questionType",
      q.difficulty,
      q.options,
      q.correct_answer            AS "correctAnswer",
      q.explanation,
      q.points_value              AS "pointsValue",
      q.youtube_hint_url          AS "youtubeHintUrl",
      q.sequence_order            AS "sequenceOrder",
      q.created_at                AS "createdAt",
      ch.name                     AS "chapterName",
      ch.slug                     AS "chapterSlug"
    FROM   eduquest_questions     q
    JOIN   eduquest_chapters      ch ON ch.id = q.chapter_id
    WHERE  ${whereClause}
    ORDER  BY q.sequence_order ASC, q.created_at ASC
    LIMIT  $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  params.push(limit, offset);

  try {
    /* Run both queries in parallel for speed */
    const [countResult, dataResult] = await Promise.all([
      pool.query(countQuery, params.slice(0, paramIndex - 1)),
      pool.query(dataQuery, params),
    ]);

    const total     = countResult.rows[0]?.total ?? 0;
    const questions = dataResult.rows;

    return apiSuccess(
      {
        questions,
        total,
        chapterId,
        filters: {
          difficulty: difficulty ?? null,
          type:       questionType ?? null,
          limit,
          offset,
        },
      },
      { headers: QUESTIONS_CACHE_HEADERS },
    );
  } catch (err) {
    console.error("[GET /api/questions] Database error:", err);
    return apiError("DB_ERROR", "Failed to fetch questions. Please try again.", 500);
  }
}
