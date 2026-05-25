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
-- Expression GIN indexes using to_tsvector() are rejected because the function
-- is not IMMUTABLE when a config argument is present. Instead we add a plain
-- tsvector column maintained by BEFORE INSERT/UPDATE triggers, then index that
-- column. A plain column index is always accepted.
-- ─────────────────────────────────────────────

-- subjects search
ALTER TABLE eduquest_subjects
  ADD COLUMN IF NOT EXISTS search_vector tsvector;

UPDATE eduquest_subjects
SET search_vector = to_tsvector(
  'english',
  coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(track, '') || ' ' || coalesce(stream, '')
);

CREATE OR REPLACE FUNCTION eduquest_subjects_search_vector_update()
  RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.search_vector := to_tsvector(
    'english',
    coalesce(NEW.name, '') || ' ' || coalesce(NEW.description, '') || ' ' || coalesce(NEW.track, '') || ' ' || coalesce(NEW.stream, '')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS eduquest_subjects_search_vector_trg ON eduquest_subjects;
CREATE TRIGGER eduquest_subjects_search_vector_trg
  BEFORE INSERT OR UPDATE ON eduquest_subjects
  FOR EACH ROW EXECUTE FUNCTION eduquest_subjects_search_vector_update();

CREATE INDEX IF NOT EXISTS eduquest_subjects_search_idx
  ON eduquest_subjects USING GIN (search_vector);

-- chapters search
ALTER TABLE eduquest_chapters
  ADD COLUMN IF NOT EXISTS search_vector tsvector;

UPDATE eduquest_chapters
SET search_vector = to_tsvector(
  'english',
  coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(difficulty, '')
);

CREATE OR REPLACE FUNCTION eduquest_chapters_search_vector_update()
  RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.search_vector := to_tsvector(
    'english',
    coalesce(NEW.name, '') || ' ' || coalesce(NEW.description, '') || ' ' || coalesce(NEW.difficulty, '')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS eduquest_chapters_search_vector_trg ON eduquest_chapters;
CREATE TRIGGER eduquest_chapters_search_vector_trg
  BEFORE INSERT OR UPDATE ON eduquest_chapters
  FOR EACH ROW EXECUTE FUNCTION eduquest_chapters_search_vector_update();

CREATE INDEX IF NOT EXISTS eduquest_chapters_search_idx
  ON eduquest_chapters USING GIN (search_vector);

-- community posts search
ALTER TABLE eduquest_community_posts
  ADD COLUMN IF NOT EXISTS search_vector tsvector;

UPDATE eduquest_community_posts
SET search_vector = to_tsvector(
  'english',
  coalesce(title, '') || ' ' || coalesce(body, '') || ' ' || array_to_string(tags, ' ')
);

CREATE OR REPLACE FUNCTION eduquest_community_posts_search_vector_update()
  RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.search_vector := to_tsvector(
    'english',
    coalesce(NEW.title, '') || ' ' || coalesce(NEW.body, '') || ' ' || array_to_string(NEW.tags, ' ')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS eduquest_community_posts_search_vector_trg ON eduquest_community_posts;
CREATE TRIGGER eduquest_community_posts_search_vector_trg
  BEFORE INSERT OR UPDATE ON eduquest_community_posts
  FOR EACH ROW EXECUTE FUNCTION eduquest_community_posts_search_vector_update();

CREATE INDEX IF NOT EXISTS eduquest_community_posts_search_idx
  ON eduquest_community_posts USING GIN (search_vector);

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
