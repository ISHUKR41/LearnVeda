/*
 * FILE: 022_chapter_quiz_sessions.sql
 * LOCATION: src/lib/server/database/migrations/022_chapter_quiz_sessions.sql
 * PURPOSE: Creates dedicated tables for tracking quiz sessions, topic-level
 *          progress, and chapter completion data for the Light - Reflection
 *          and Refraction chapter (and all future deep-research chapters).
 *
 *          WHY SEPARATE TABLES?
 *          The existing eduquest_user_progress table tracks high-level chapter
 *          completion. We need finer-grained tracking:
 *            - per-topic scores within a chapter
 *            - individual quiz attempt history
 *            - topic-level completion percentages
 *            - performance analytics (correct/wrong/skipped per topic)
 *
 *          This enables:
 *            - Dashboard "Recent Activity" showing per-topic quiz scores
 *            - Score heat-maps across all topics in a chapter
 *            - Performance analytics per question type (MCQ, short, long, HOTS)
 *            - Retry tracking (how many attempts before mastery)
 *
 * TABLES CREATED:
 *   eduquest_topic_progress  — one row per user+chapter+topic with current score
 *   eduquest_quiz_attempts   — individual question attempt history
 *
 * USED BY:
 *   /api/progress/answers      (writes quiz_attempts rows)
 *   /api/progress/chapters/[id] (reads/writes topic_progress rows)
 *   /api/dashboard             (reads topic_progress for dashboard widget)
 *
 * LAST UPDATED: 2026-06-08
 */

-- ═══════════════════════════════════════════════════════
-- 1. TOPIC-LEVEL PROGRESS TABLE
-- One row per user + chapter + topic combination.
-- Stores cumulative correct/wrong counts and latest score.
-- ═══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS eduquest_topic_progress (
  /* Surrogate primary key */
  id                BIGSERIAL PRIMARY KEY,

  /* The student who owns this progress record */
  user_id           TEXT NOT NULL,

  /* Chapter slug (e.g. "light-reflection-and-refraction") */
  chapter_id        TEXT NOT NULL,

  /* Topic slug (e.g. "intro-and-laws-of-reflection") */
  topic_id          TEXT NOT NULL,

  /* Cumulative counts — updated on every question answer */
  questions_answered  INTEGER NOT NULL DEFAULT 0,
  questions_correct   INTEGER NOT NULL DEFAULT 0,
  questions_wrong     INTEGER NOT NULL DEFAULT 0,

  /* Score as percentage 0–100 */
  score_percent     NUMERIC(5,2) NOT NULL DEFAULT 0,

  /* Raw points earned (sum of per-question points) */
  points_earned     INTEGER NOT NULL DEFAULT 0,

  /* Maximum possible points for this topic */
  points_possible   INTEGER NOT NULL DEFAULT 0,

  /* Whether ALL questions in this topic have been answered */
  is_completed      BOOLEAN NOT NULL DEFAULT FALSE,

  /* Timestamps for auditing and freshness */
  first_studied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_studied_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  /* Prevent duplicate rows — one record per user+chapter+topic */
  CONSTRAINT uq_topic_progress UNIQUE (user_id, chapter_id, topic_id)
);

/* Index for fast lookups by chapter (used in dashboard queries) */
CREATE INDEX IF NOT EXISTS idx_topic_progress_chapter
  ON eduquest_topic_progress (user_id, chapter_id);

/* Index for leaderboard queries sorted by score */
CREATE INDEX IF NOT EXISTS idx_topic_progress_score
  ON eduquest_topic_progress (chapter_id, score_percent DESC);

-- ═══════════════════════════════════════════════════════
-- 2. INDIVIDUAL QUIZ ATTEMPT HISTORY
-- One row per question attempt. Enables per-question analytics
-- and "how many tries" tracking across study sessions.
-- ═══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS eduquest_quiz_attempts (
  /* Surrogate primary key */
  id              BIGSERIAL PRIMARY KEY,

  /* The student making this attempt */
  user_id         TEXT NOT NULL,

  /* Chapter + topic context */
  chapter_id      TEXT NOT NULL,
  topic_id        TEXT NOT NULL,

  /* The specific question being answered */
  question_id     TEXT NOT NULL,

  /* Question type for analytics grouping */
  question_type   TEXT NOT NULL CHECK (question_type IN ('mcq', 'short', 'long', 'thinking')),

  /* Whether this attempt was correct */
  is_correct      BOOLEAN NOT NULL,

  /* The answer the student submitted (may be truncated for text answers) */
  user_answer     TEXT,

  /* Points awarded for this attempt (0 if wrong) */
  points_awarded  INTEGER NOT NULL DEFAULT 0,

  /* XP awarded for this attempt (0 if wrong) */
  xp_awarded      INTEGER NOT NULL DEFAULT 0,

  /* Timestamp */
  attempted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

/* Index for fast per-user+chapter history lookups */
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_chapter
  ON eduquest_quiz_attempts (user_id, chapter_id, topic_id);

/* Index for analytics — how is each question performing across all students? */
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_question
  ON eduquest_quiz_attempts (question_id, is_correct);

-- ═══════════════════════════════════════════════════════
-- 3. CHAPTER SCORE SUMMARY VIEW
-- Convenience view that aggregates topic_progress into a
-- chapter-level summary. Used by the dashboard API.
-- ═══════════════════════════════════════════════════════

CREATE OR REPLACE VIEW eduquest_chapter_score_summary AS
SELECT
  user_id,
  chapter_id,
  COUNT(DISTINCT topic_id)                              AS topics_studied,
  SUM(questions_answered)                               AS total_answered,
  SUM(questions_correct)                                AS total_correct,
  SUM(points_earned)                                    AS total_points_earned,
  SUM(points_possible)                                  AS total_points_possible,
  CASE
    WHEN SUM(points_possible) > 0
    THEN ROUND((SUM(points_earned)::NUMERIC / SUM(points_possible)) * 100, 2)
    ELSE 0
  END                                                   AS overall_score_percent,
  BOOL_AND(is_completed)                               AS chapter_completed,
  MAX(last_studied_at)                                  AS last_studied_at
FROM eduquest_topic_progress
GROUP BY user_id, chapter_id;

-- Track this migration
INSERT INTO eduquest_schema_migrations (name, checksum)
VALUES ('022_chapter_quiz_sessions.sql', 'v022')
ON CONFLICT (name) DO NOTHING;
