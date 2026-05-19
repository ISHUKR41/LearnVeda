/*
 * FILE: 007_production_indexes_and_search.sql
 * LOCATION: src/lib/server/database/migrations/007_production_indexes_and_search.sql
 * PURPOSE: Adds production-grade query indexes for ranking, dashboards,
 *          notifications, community feeds, battle history, and PostgreSQL
 *          full-text search. These indexes support the MCP requirement that
 *          real PostgreSQL data should stay fast as traffic grows.
 *
 * WHY THIS MIGRATION EXISTS:
 *   The earlier migrations created the tables and starter content. This
 *   migration tunes the read paths that the app already uses frequently:
 *     - leaderboard sorting by XP and level
 *     - user dashboard counts
 *     - unread notification lists
 *     - community feed/search
 *     - subject/chapter discovery
 *     - battle history review
 *
 * USED BY: npm run db:migrate, production PostgreSQL deployments
 * LAST UPDATED: 2026-05-19
 */

-- ─────────────────────────────────────────────
-- USER RANKING INDEXES
-- Leaderboards order by XP, level, and account creation time. These indexes
-- keep global and track-filtered ranking queries predictable as users grow.
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS eduquest_users_global_rank_idx
  ON eduquest_users (xp DESC, level DESC, created_at ASC);

CREATE INDEX IF NOT EXISTS eduquest_users_track_rank_idx
  ON eduquest_users (track, xp DESC, level DESC, created_at ASC);

-- ─────────────────────────────────────────────
-- DASHBOARD COUNT INDEXES
-- Dashboard metrics count user-owned records across community, battles,
-- progress, events, and notifications. These indexes avoid full table scans.
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS eduquest_community_posts_author_created_idx
  ON eduquest_community_posts (author_id, created_at DESC);

CREATE INDEX IF NOT EXISTS eduquest_matchmaking_user_status_created_idx
  ON eduquest_matchmaking_tickets (user_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS eduquest_user_progress_user_complete_idx
  ON eduquest_user_progress (user_id, is_complete, completed_at DESC);

CREATE INDEX IF NOT EXISTS eduquest_notifications_unread_idx
  ON eduquest_notifications (user_id, created_at DESC)
  WHERE is_read = FALSE;

CREATE INDEX IF NOT EXISTS eduquest_battle_history_user_result_idx
  ON eduquest_battle_history (user_id, result, played_at DESC);

-- ─────────────────────────────────────────────
-- EVENT AND HOST APPLICATION OPERATIONS
-- Admin review pages and event registration checks need fast filters by status,
-- event, participant, and institution-facing reference values.
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS eduquest_events_status_public_idx
  ON eduquest_events (status, is_public, sort_order);

CREATE INDEX IF NOT EXISTS eduquest_host_applications_review_queue_idx
  ON eduquest_host_applications (status, created_at DESC, event_date ASC);

-- ─────────────────────────────────────────────
-- POSTGRESQL FULL-TEXT SEARCH
-- The MCP says to start with PostgreSQL search before introducing a dedicated
-- search service. Expression GIN indexes make subject, chapter, and community
-- search useful without extra infrastructure.
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS eduquest_subjects_search_idx
  ON eduquest_subjects
  USING GIN (
    to_tsvector(
      'english',
      coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(track, '') || ' ' || coalesce(stream, '')
    )
  );

CREATE INDEX IF NOT EXISTS eduquest_chapters_search_idx
  ON eduquest_chapters
  USING GIN (
    to_tsvector(
      'english',
      coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(difficulty, '')
    )
  );

CREATE INDEX IF NOT EXISTS eduquest_community_posts_search_idx
  ON eduquest_community_posts
  USING GIN (
    to_tsvector(
      'english',
      coalesce(title, '') || ' ' || coalesce(body, '') || ' ' || array_to_string(tags, ' ')
    )
  );

-- ─────────────────────────────────────────────
-- JSONB SUPPORT INDEXES
-- Audit metadata and background job payloads are stored as JSONB so operations
-- can later filter by provider IDs, job categories, moderation reasons, or
-- structured event metadata without schema churn.
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS eduquest_audit_logs_metadata_idx
  ON eduquest_audit_logs
  USING GIN (metadata);

CREATE INDEX IF NOT EXISTS eduquest_background_jobs_payload_idx
  ON eduquest_background_jobs
  USING GIN (payload);
