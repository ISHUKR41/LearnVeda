/*
 * FILE: curriculum-repository.ts
 * LOCATION: src/lib/server/repositories/curriculum-repository.ts
 * PURPOSE: PostgreSQL data-access layer for the CBSE curriculum — subjects
 *          and chapters. Provides typed helper functions that query the
 *          eduquest_subjects and eduquest_chapters tables. Used by API routes
 *          and server components that need real curriculum data from the DB.
 * USED BY: src/app/api/subjects/route.ts
 *          src/app/api/subjects/[slug]/chapters/route.ts
 *          Server components that show chapter lists
 * DEPENDENCIES: src/lib/server/database/postgres.ts (queryPostgres helper)
 * LAST UPDATED: 2026-05-17
 */

import { queryPostgres } from "@/lib/server/database/postgres";

// ─── Type Definitions ─────────────────────────────────────────────────────────

/**
 * A single CBSE subject row as stored in the eduquest_subjects table.
 * The 'stream' column is only populated for class-11 and class-12 subjects.
 */
export interface CurriculumSubject {
  id: string;
  track: string;
  stream: string | null;
  slug: string;
  name: string;
  description: string | null;
  chapter_count: number;
  color: string;
  icon: string;
  sequence_order: number;
  created_at: string;
}

/**
 * A single CBSE chapter row as stored in the eduquest_chapters table.
 * Each chapter belongs to exactly one subject via subject_id.
 */
export interface CurriculumChapter {
  id: string;
  subject_id: string;
  slug: string;
  name: string;
  description: string | null;
  day_count: number;
  sequence_order: number;
  difficulty: "easy" | "medium" | "hard";
  question_count: number;
  created_at: string;
}

/** One question row used by chapter practice views and question APIs. */
export interface CurriculumQuestion {
  id: string;
  chapter_id: string;
  question_text: string;
  question_type: "mcq" | "short_answer" | "true_false" | "fill_blank";
  difficulty: "easy" | "medium" | "hard";
  options: unknown;
  correct_answer: string;
  explanation: string | null;
  points_value: number;
  youtube_hint_url: string | null;
  day_number: number | null;
  sequence_order: number;
}

/** Aggregate platform counters rendered on the home page and status dashboards. */
export interface CurriculumSummaryCounts {
  subject_count: number;
  chapter_count: number;
  question_count: number;
  user_count: number;
}

// ─── Subject Queries ──────────────────────────────────────────────────────────

/**
 * Returns all subjects for a given learning track, ordered by sequence_order.
 * This is the main function called by class landing pages (class-9, class-10, etc.)
 * and by the /api/subjects?track=... endpoint.
 *
 * @param track - The track identifier, e.g. 'class-9', 'class-10', 'engineering'
 * @returns An array of CurriculumSubject rows ordered by sequence_order ASC
 */
export async function getSubjectsByTrack(track: string): Promise<CurriculumSubject[]> {
  const result = await queryPostgres<CurriculumSubject>(
    `SELECT id, track, stream, slug, name, description,
            chapter_count, color, icon, sequence_order, created_at
     FROM   eduquest_subjects
     WHERE  track = $1
     ORDER  BY sequence_order ASC, name ASC`,
    [track],
  );
  return result.rows;
}

/**
 * Returns all subjects for a specific track + stream combination.
 * Used exclusively by class-11 and class-12 pages that have
 * Science / Commerce / Arts stream selection.
 *
 * @param track  - e.g. 'class-11' or 'class-12'
 * @param stream - e.g. 'science', 'commerce', 'arts'
 */
export async function getSubjectsByTrackAndStream(
  track: string,
  stream: string,
): Promise<CurriculumSubject[]> {
  const result = await queryPostgres<CurriculumSubject>(
    `SELECT id, track, stream, slug, name, description,
            chapter_count, color, icon, sequence_order, created_at
     FROM   eduquest_subjects
     WHERE  track = $1
       AND  stream = $2
     ORDER  BY sequence_order ASC`,
    [track, stream],
  );
  return result.rows;
}

/**
 * Returns a single subject by its unique slug.
 * Used by subject detail pages and the chapters API to validate that a
 * subject exists before fetching its chapters.
 *
 * @param slug - The URL-safe subject identifier, e.g. 'class-9-mathematics'
 * @returns The matching CurriculumSubject or null if not found
 */
export async function getSubjectBySlug(slug: string): Promise<CurriculumSubject | null> {
  const result = await queryPostgres<CurriculumSubject>(
    `SELECT id, track, stream, slug, name, description,
            chapter_count, color, icon, sequence_order, created_at
     FROM   eduquest_subjects
     WHERE  slug = $1
     LIMIT  1`,
    [slug],
  );
  return result.rows[0] ?? null;
}

// ─── Chapter Queries ──────────────────────────────────────────────────────────

/**
 * Returns all chapters for a subject, looked up by the subject's slug.
 * Chapters are ordered by sequence_order so they appear in the correct NCERT order.
 * Used by subject detail pages and the /api/subjects/[slug]/chapters endpoint.
 *
 * @param subjectSlug - The parent subject slug, e.g. 'class-9-mathematics'
 * @returns Ordered array of CurriculumChapter rows
 */
export async function getChaptersBySubjectSlug(
  subjectSlug: string,
): Promise<CurriculumChapter[]> {
  const result = await queryPostgres<CurriculumChapter>(
    `SELECT c.id, c.subject_id, c.slug, c.name, c.description,
            c.day_count, c.sequence_order, c.difficulty, c.question_count, c.created_at
     FROM   eduquest_chapters  c
     JOIN   eduquest_subjects  s ON s.id = c.subject_id
     WHERE  s.slug = $1
     ORDER  BY c.sequence_order ASC`,
    [subjectSlug],
  );
  return result.rows;
}

/**
 * Returns a single chapter by its slug within a given subject.
 * Used by chapter detail pages to load the specific chapter content.
 *
 * @param subjectSlug - The parent subject's slug, e.g. 'class-9-mathematics'
 * @param chapterSlug - The chapter's own slug, e.g. 'number-systems'
 */
export async function getChapterBySlug(
  subjectSlug: string,
  chapterSlug: string,
): Promise<CurriculumChapter | null> {
  const result = await queryPostgres<CurriculumChapter>(
    `SELECT c.id, c.subject_id, c.slug, c.name, c.description,
            c.day_count, c.sequence_order, c.difficulty, c.question_count, c.created_at
     FROM   eduquest_chapters  c
     JOIN   eduquest_subjects  s ON s.id = c.subject_id
     WHERE  s.slug = $1
       AND  c.slug = $2
     LIMIT  1`,
    [subjectSlug, chapterSlug],
  );
  return result.rows[0] ?? null;
}

/**
 * Returns all distinct track values from the subjects table.
 * Used by admin analytics, search filters, and leaderboard track selectors.
 *
 * @returns Sorted array of unique track strings
 */
export async function getDistinctTracks(): Promise<string[]> {
  const result = await queryPostgres<{ track: string }>(
    `SELECT DISTINCT track FROM eduquest_subjects ORDER BY track ASC`,
    [],
  );
  return result.rows.map((row) => row.track);
}

/**
 * Returns chapter questions for one subject/chapter pair in deterministic order.
 * This powers chapter practice pages and preserves question sequencing by day.
 */
export async function getQuestionsByChapterSlug(
  subjectSlug: string,
  chapterSlug: string,
  limit = 50,
): Promise<CurriculumQuestion[]> {
  const safeLimit = Math.min(Math.max(limit, 1), 200);
  const result = await queryPostgres<CurriculumQuestion>(
    `SELECT q.id, q.chapter_id, q.question_text, q.question_type, q.difficulty,
            q.options, q.correct_answer, q.explanation, q.points_value,
            q.youtube_hint_url, q.day_number, q.sequence_order
     FROM   eduquest_questions q
     JOIN   eduquest_chapters c ON c.id = q.chapter_id
     JOIN   eduquest_subjects s ON s.id = c.subject_id
     WHERE  s.slug = $1
       AND  c.slug = $2
     ORDER  BY q.day_number ASC NULLS LAST, q.sequence_order ASC, q.created_at ASC
     LIMIT  $3`,
    [subjectSlug, chapterSlug, safeLimit],
  );
  return result.rows;
}

/** Returns production summary counts used on the public home page. */
export async function getCurriculumSummaryCounts(): Promise<CurriculumSummaryCounts> {
  const result = await queryPostgres<CurriculumSummaryCounts>(
    `SELECT
       (SELECT COUNT(*)::int FROM eduquest_subjects)  AS subject_count,
       (SELECT COUNT(*)::int FROM eduquest_chapters)  AS chapter_count,
       (SELECT COUNT(*)::int FROM eduquest_questions) AS question_count,
       (SELECT COUNT(*)::int FROM eduquest_users)     AS user_count`,
    [],
  );
  return result.rows[0] ?? {
    subject_count: 0,
    chapter_count: 0,
    question_count: 0,
    user_count: 0,
  };
}
