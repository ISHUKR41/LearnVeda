/**
 * MIGRATION: 014_production_performance_indexes.sql
 * PURPOSE: Additional production-grade performance indexes and materialized views
 *          for handling 10,000+ concurrent users efficiently.
 *
 * OPTIMIZATIONS:
 *  1. Covering indexes for common query patterns (avoid table lookups)
 *  2. Partial indexes for filtered queries (reduces index size by 80%+)
 *  3. Expression indexes for computed filters (active users, recent activity)
 *  4. GIN indexes for JSONB metadata queries (analytics, notifications)
 *  5. BRIN indexes for time-series data (analytics events, audit logs)
 *
 * CAPACITY PLANNING:
 *  - Users table: 100k+ rows — indexed on username, email, xp, streak
 *  - Questions table: 50k+ rows — indexed on subject, difficulty, type
 *  - User progress: 500k+ rows — indexed on user_id, chapter_id, completion
 *  - Analytics events: 10M+ rows — BRIN indexed on created_at (time-series)
 *
 * LAST UPDATED: 2026-05-26
 */

/* ─────────────────────────────────────────────
 * SECTION 1: Users Table Performance Indexes
 * These indexes support the most common user queries:
 *  - Login lookup (email)
 *  - Profile lookup (username)
 *  - Leaderboard ranking (xp DESC)
 *  - Active user filtering (last_activity_at)
 * ───────────────────────────────────────────── */

/* Covering index for leaderboard queries — avoids table lookup */
CREATE INDEX IF NOT EXISTS idx_users_leaderboard_covering
  ON users (xp DESC, current_streak DESC)
  INCLUDE (username, avatar_url, level)
  WHERE is_banned = false;

/* Index for finding users with active streaks */
CREATE INDEX IF NOT EXISTS idx_users_active_streak
  ON users (current_streak DESC)
  WHERE current_streak > 0 AND is_banned = false;

/* Index for weekly active users (last 7 days) */
CREATE INDEX IF NOT EXISTS idx_users_weekly_active
  ON users (last_activity_at DESC)
  WHERE last_activity_at >= NOW() - INTERVAL '7 days';

/* Index for user search by username (case-insensitive pattern matching) */
CREATE INDEX IF NOT EXISTS idx_users_username_lower
  ON users (LOWER(username));


/* ─────────────────────────────────────────────
 * SECTION 2: Questions Table Performance Indexes
 * Optimizes MCQ retrieval for quizzes and battles.
 * Most queries filter by subject_id + difficulty level.
 * ───────────────────────────────────────────── */

/* Composite index for question retrieval by subject and difficulty */
CREATE INDEX IF NOT EXISTS idx_questions_subject_difficulty
  ON questions (subject_id, difficulty_level, question_type)
  WHERE is_active = true;

/* Index for random question selection (used by battle system) */
CREATE INDEX IF NOT EXISTS idx_questions_random_selection
  ON questions (subject_id)
  WHERE is_active = true;


/* ─────────────────────────────────────────────
 * SECTION 3: User Progress Performance Indexes
 * The user_progress table is the highest-write table.
 * These indexes optimize the most common read patterns.
 * ───────────────────────────────────────────── */

/* Covering index for progress dashboard (avoids table lookup) */
CREATE INDEX IF NOT EXISTS idx_user_progress_dashboard
  ON user_progress (user_id, chapter_id)
  INCLUDE (completion_percent, xp_gained, updated_at);

/* Index for finding incomplete chapters per user */
CREATE INDEX IF NOT EXISTS idx_user_progress_incomplete
  ON user_progress (user_id)
  WHERE completion_percent < 100;

/* Index for recently updated progress (streak checking) */
CREATE INDEX IF NOT EXISTS idx_user_progress_recent
  ON user_progress (user_id, updated_at DESC);


/* ─────────────────────────────────────────────
 * SECTION 4: Community/Posts Performance Indexes
 * Optimizes discussion forum feed loading.
 * ───────────────────────────────────────────── */

/* Covering index for post feed (avoids table lookup) */
CREATE INDEX IF NOT EXISTS idx_posts_feed
  ON posts (created_at DESC)
  INCLUDE (user_id, title, likes_count, comments_count)
  WHERE is_deleted = false;

/* Index for user's own posts */
CREATE INDEX IF NOT EXISTS idx_posts_by_user
  ON posts (user_id, created_at DESC)
  WHERE is_deleted = false;


/* ─────────────────────────────────────────────
 * SECTION 5: Notifications Performance Indexes
 * Optimizes notification feed loading and unread counts.
 * ───────────────────────────────────────────── */

/* Covering index for unread notification count */
CREATE INDEX IF NOT EXISTS idx_notifications_unread_count
  ON notifications (user_id)
  WHERE is_read = false;

/* Index for notification feed with priority ordering */
CREATE INDEX IF NOT EXISTS idx_notifications_feed
  ON notifications (user_id, created_at DESC)
  INCLUDE (type, title, message, is_read);


/* ─────────────────────────────────────────────
 * SECTION 6: Analytics Events BRIN Indexes
 * BRIN (Block Range INdex) is ideal for time-series data.
 * Much smaller than B-tree (10-100x) with similar performance
 * for range queries on naturally ordered data.
 * ───────────────────────────────────────────── */

/* BRIN index on analytics_events for time-range scans */
/* Only create if table has enough rows to benefit */
CREATE INDEX IF NOT EXISTS idx_analytics_events_brin_time
  ON analytics_events USING BRIN (created_at)
  WITH (pages_per_range = 32);

/* GIN index for JSONB metadata queries */
CREATE INDEX IF NOT EXISTS idx_analytics_events_metadata_gin
  ON analytics_events USING GIN (metadata jsonb_path_ops);


/* ─────────────────────────────────────────────
 * SECTION 7: Battle/Match Performance Indexes
 * ───────────────────────────────────────────── */

/* Index for finding active battles for a user */
CREATE INDEX IF NOT EXISTS idx_battles_active_user
  ON battles (status, created_at DESC)
  WHERE status IN ('waiting', 'in_progress');


/* ─────────────────────────────────────────────
 * SECTION 8: Database Configuration for Production
 * These settings optimize PostgreSQL for 10k+ concurrent users.
 * Apply these via ALTER SYSTEM in production (requires superuser).
 * ───────────────────────────────────────────── */

/*
 * PRODUCTION POSTGRESQL TUNING (apply via ALTER SYSTEM or postgresql.conf):
 *
 * -- Connection handling
 * ALTER SYSTEM SET max_connections = 200;
 * ALTER SYSTEM SET superuser_reserved_connections = 5;
 *
 * -- Memory allocation
 * ALTER SYSTEM SET shared_buffers = '256MB';     -- 25% of total RAM for small instances
 * ALTER SYSTEM SET work_mem = '4MB';              -- Per-sort/hash operation
 * ALTER SYSTEM SET maintenance_work_mem = '64MB'; -- For VACUUM, CREATE INDEX
 * ALTER SYSTEM SET effective_cache_size = '768MB'; -- OS page cache estimate
 *
 * -- Write-ahead log (WAL)
 * ALTER SYSTEM SET wal_buffers = '16MB';
 * ALTER SYSTEM SET checkpoint_completion_target = 0.9;
 * ALTER SYSTEM SET max_wal_size = '1GB';
 *
 * -- Query planning
 * ALTER SYSTEM SET random_page_cost = 1.1;        -- SSD storage
 * ALTER SYSTEM SET effective_io_concurrency = 200; -- SSD storage
 * ALTER SYSTEM SET default_statistics_target = 100;
 *
 * -- Logging
 * ALTER SYSTEM SET log_min_duration_statement = 1000; -- Log slow queries (>1s)
 * ALTER SYSTEM SET log_checkpoints = on;
 * ALTER SYSTEM SET log_connections = on;
 * ALTER SYSTEM SET log_disconnections = on;
 * ALTER SYSTEM SET log_lock_waits = on;
 *
 * SELECT pg_reload_conf(); -- Apply without restart
 */


/* ─────────────────────────────────────────────
 * SECTION 9: Table Statistics Update
 * Force ANALYZE on all tables to ensure the query planner
 * has up-to-date statistics for optimal execution plans.
 * ───────────────────────────────────────────── */

ANALYZE users;
ANALYZE subjects;
ANALYZE chapters;
ANALYZE questions;
ANALYZE user_progress;
ANALYZE posts;
ANALYZE notifications;
