/*
 * FILE: 021_chapter_milestones.sql
 * LOCATION: src/lib/server/database/migrations/021_chapter_milestones.sql
 * PURPOSE: Chapter completion milestone system.
 *
 *   Tracks per-user, per-chapter progress and awards level bonuses at
 *   four milestone thresholds as students answer questions correctly:
 *
 *     25% of chapter (10 correct answers) → +1 level bonus
 *     50% of chapter (20 correct answers) → +1 level bonus  (cumulative +2)
 *     75% of chapter (30 correct answers) → +1 level bonus  (cumulative +3)
 *    100% of chapter (40 correct answers) → +1 level bonus  (cumulative +4)
 *
 *   Milestones are idempotent — once awarded they are never re-awarded.
 *   The answers route checks and updates this table on every correct answer.
 *
 * DESIGN DECISIONS:
 *   - Primary key is (user_id, chapter_id) for O(1) upsert on every answer.
 *   - Milestone flags are individual boolean columns for fast single-field updates.
 *   - chapter_id is TEXT (matches content file IDs like "force-and-laws-of-motion").
 *   - All CREATE TABLE / ADD COLUMN use IF NOT EXISTS for idempotency.
 *
 * USED BY: /api/progress/answers (route handler)
 * LAST UPDATED: 2026-06-02
 */


-- ═══════════════════════════════════════════════════════════════
-- 1. CHAPTER MILESTONE TRACKING TABLE
-- Records how many questions each student has answered correctly
-- in each chapter, and which milestone level-up bonuses have fired.
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS eduquest_chapter_milestones (
  /* Composite primary key — one row per (user, chapter) pair */
  user_id    TEXT     NOT NULL,
  chapter_id TEXT     NOT NULL,

  /* Total CORRECT answers in this chapter (incremented on each correct answer) */
  questions_correct INTEGER NOT NULL DEFAULT 0 CHECK (questions_correct >= 0),

  /* Milestone flags — set to TRUE once the bonus level has been awarded.
   * Never reset; prevents double-awarding if the user somehow answers more questions. */
  milestone_25_awarded  BOOLEAN NOT NULL DEFAULT FALSE,   /* 10 correct  → +1 level */
  milestone_50_awarded  BOOLEAN NOT NULL DEFAULT FALSE,   /* 20 correct  → +1 level */
  milestone_75_awarded  BOOLEAN NOT NULL DEFAULT FALSE,   /* 30 correct  → +1 level */
  milestone_100_awarded BOOLEAN NOT NULL DEFAULT FALSE,   /* 40 correct  → +1 level */

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  PRIMARY KEY (user_id, chapter_id)
);

/* Index for the dashboard query that lists a user's chapter completion badges */
CREATE INDEX IF NOT EXISTS eduquest_chapter_milestones_user_idx
  ON eduquest_chapter_milestones (user_id);

/* Index for admin analytics — find which chapters have highest completion rates */
CREATE INDEX IF NOT EXISTS eduquest_chapter_milestones_chapter_idx
  ON eduquest_chapter_milestones (chapter_id, questions_correct DESC);

COMMENT ON TABLE eduquest_chapter_milestones IS
  'Per-user chapter progress and level milestone awards. Each row tracks how many '
  'correct answers a student has in a specific chapter and which of the four '
  '25/50/75/100% completion milestones have been converted into level bonuses.';
