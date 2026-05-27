/**
 * MIGRATION: 013_analytics_notifications_audit.sql
 * PURPOSE: Creates the analytics_events table for tracking user behavior,
 *          enhances the notifications table, and adds audit logging.
 *          These tables power the admin dashboard, engagement metrics,
 *          and production monitoring capabilities.
 *
 * TABLES CREATED:
 *  - analytics_events: High-volume event tracking (partitioned by month)
 *  - audit_logs: Immutable record of all sensitive operations
 *  - user_preferences: User notification and display preferences
 *  - rate_limit_violations: Tracks rate limit breaches for security
 *  - api_request_logs: Request/response logging for debugging
 *
 * INDEXES: Optimized for the most common query patterns:
 *  - Time-range queries (created_at)
 *  - User-specific queries (user_id)
 *  - Event type filtering (event_type)
 *  - Composite indexes for dashboard aggregations
 *
 * CAPACITY: Designed for 10k+ concurrent users.
 *           analytics_events expected volume: ~100k rows/day.
 *           30-day partition retention recommended for production.
 *
 * LAST UPDATED: 2026-05-26
 */

/* ─────────────────────────────────────────────
 * TABLE: analytics_events
 * High-volume event tracking table for user behavior analytics.
 * Each row represents a single user action (page view, MCQ attempt, etc.)
 *
 * Design decisions:
 *  - JSONB metadata column for flexible schema (avoids ALTER TABLE for new event types)
 *  - ip_hash stored instead of raw IP for GDPR compliance
 *  - session_id enables session-level analysis without cookies
 *  - Partial index on user_id (WHERE user_id IS NOT NULL) for authenticated queries
 * ───────────────────────────────────────────── */

CREATE TABLE IF NOT EXISTS analytics_events (
  /* Primary key — auto-incrementing for partition efficiency */
  id              BIGSERIAL       PRIMARY KEY,

  /* Event classification — what happened */
  event_type      VARCHAR(50)     NOT NULL,

  /* Who triggered it — NULL for anonymous events (page views before login) */
  user_id         UUID            REFERENCES users(id) ON DELETE SET NULL,

  /* Flexible payload — different event types have different metadata shapes */
  metadata        JSONB           NOT NULL DEFAULT '{}',

  /* When the event occurred — critical for time-range queries */
  created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

  /* Context fields for analytics enrichment */
  page_url        VARCHAR(500),                    -- Which page was the user on
  ip_hash         VARCHAR(64),                     -- SHA-256 hash of IP (GDPR-safe)
  user_agent      VARCHAR(500),                    -- Browser/device identification
  session_id      VARCHAR(100)                     -- Client-generated session ID
);

/* Index for time-range dashboard queries (most common pattern) */
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at
  ON analytics_events (created_at DESC);

/* Index for user-specific event history */
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id
  ON analytics_events (user_id)
  WHERE user_id IS NOT NULL;

/* Index for event type filtering (e.g., "show me all battle_completed events") */
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type
  ON analytics_events (event_type, created_at DESC);

/* Composite index for daily aggregation queries (used by getDailyStats) */
CREATE INDEX IF NOT EXISTS idx_analytics_events_daily_agg
  ON analytics_events (DATE(created_at), event_type);

/* Session-level grouping index */
CREATE INDEX IF NOT EXISTS idx_analytics_events_session
  ON analytics_events (session_id, created_at)
  WHERE session_id IS NOT NULL;

COMMENT ON TABLE analytics_events IS
  'High-volume event tracking for user behavior analytics and admin dashboard metrics.';


/* ─────────────────────────────────────────────
 * TABLE: audit_logs
 * Immutable audit trail for all sensitive operations.
 * Used for security compliance (SOC2, GDPR Article 30),
 * incident investigation, and admin accountability.
 *
 * Design decisions:
 *  - No UPDATE or DELETE allowed (append-only via application logic)
 *  - old_value and new_value stored as JSONB for schema flexibility
 *  - ip_address stored for accountability (not hashed — admin operations)
 *  - Separate from analytics_events for different retention policies
 * ───────────────────────────────────────────── */

CREATE TABLE IF NOT EXISTS audit_logs (
  /* Unique identifier */
  id              BIGSERIAL       PRIMARY KEY,

  /* Who performed the action */
  actor_id        UUID            REFERENCES users(id) ON DELETE SET NULL,
  actor_email     VARCHAR(255),                    -- Denormalized for quick lookups
  actor_role      VARCHAR(50),                     -- 'admin', 'moderator', 'system'

  /* What was done */
  action          VARCHAR(100)    NOT NULL,         -- 'user.ban', 'content.delete', etc.
  resource_type   VARCHAR(50)     NOT NULL,         -- 'user', 'chapter', 'question', etc.
  resource_id     VARCHAR(100),                     -- ID of the affected resource

  /* Before and after state for diff tracking */
  old_value       JSONB,                           -- State before the change
  new_value       JSONB,                           -- State after the change

  /* Context */
  ip_address      INET,                            -- Admin's IP address
  user_agent      VARCHAR(500),                    -- Admin's browser info
  request_id      VARCHAR(100),                    -- X-Request-ID for cross-referencing logs

  /* Timestamp */
  created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

/* Index for actor-based queries (who did what) */
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor
  ON audit_logs (actor_id, created_at DESC);

/* Index for resource-based queries (what happened to X) */
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource
  ON audit_logs (resource_type, resource_id, created_at DESC);

/* Index for action-based queries (all bans, all deletes, etc.) */
CREATE INDEX IF NOT EXISTS idx_audit_logs_action
  ON audit_logs (action, created_at DESC);

/* Time-range index for compliance reports */
CREATE INDEX IF NOT EXISTS idx_audit_logs_time
  ON audit_logs (created_at DESC);

COMMENT ON TABLE audit_logs IS
  'Immutable audit trail for security-sensitive operations. Supports SOC2 and GDPR compliance.';


/* ─────────────────────────────────────────────
 * TABLE: user_preferences
 * Stores per-user settings for notifications, display, and privacy.
 * Separate from users table to avoid schema bloat on the core table.
 * ───────────────────────────────────────────── */

CREATE TABLE IF NOT EXISTS user_preferences (
  /* Links to users table */
  user_id                 UUID          PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

  /* Notification channel preferences */
  email_notifications     BOOLEAN       NOT NULL DEFAULT true,
  push_notifications      BOOLEAN       NOT NULL DEFAULT true,
  in_app_notifications    BOOLEAN       NOT NULL DEFAULT true,

  /* Notification type preferences (which types the user wants to receive) */
  notify_achievements     BOOLEAN       NOT NULL DEFAULT true,
  notify_battles          BOOLEAN       NOT NULL DEFAULT true,
  notify_community        BOOLEAN       NOT NULL DEFAULT true,
  notify_events           BOOLEAN       NOT NULL DEFAULT true,
  notify_streak_reminder  BOOLEAN       NOT NULL DEFAULT true,
  notify_weekly_report    BOOLEAN       NOT NULL DEFAULT true,
  notify_leaderboard      BOOLEAN       NOT NULL DEFAULT false,

  /* Display preferences */
  theme                   VARCHAR(20)   NOT NULL DEFAULT 'dark',         -- 'dark', 'light', 'auto'
  language                VARCHAR(10)   NOT NULL DEFAULT 'en',           -- ISO 639-1 code
  compact_mode            BOOLEAN       NOT NULL DEFAULT false,
  animations_enabled      BOOLEAN       NOT NULL DEFAULT true,

  /* Privacy preferences */
  show_online_status      BOOLEAN       NOT NULL DEFAULT true,
  show_profile_public     BOOLEAN       NOT NULL DEFAULT true,
  show_leaderboard        BOOLEAN       NOT NULL DEFAULT true,
  allow_battle_invites    BOOLEAN       NOT NULL DEFAULT true,

  /* Timestamps */
  created_at              TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE user_preferences IS
  'Per-user notification, display, and privacy settings. Created on first user login.';


/* ─────────────────────────────────────────────
 * TABLE: rate_limit_violations
 * Tracks IP addresses and users who hit rate limits.
 * Used for security monitoring and automatic IP blocking.
 * ───────────────────────────────────────────── */

CREATE TABLE IF NOT EXISTS rate_limit_violations (
  id              BIGSERIAL       PRIMARY KEY,
  ip_address      INET            NOT NULL,
  user_id         UUID            REFERENCES users(id) ON DELETE SET NULL,
  endpoint        VARCHAR(200)    NOT NULL,
  violation_count INTEGER         NOT NULL DEFAULT 1,
  first_violation TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  last_violation  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  is_blocked      BOOLEAN         NOT NULL DEFAULT false,
  blocked_until   TIMESTAMPTZ
);

/* Index for IP-based lookups (used by rate limiter middleware) */
CREATE INDEX IF NOT EXISTS idx_rate_violations_ip
  ON rate_limit_violations (ip_address, is_blocked);

/* Index for time-based cleanup */
CREATE INDEX IF NOT EXISTS idx_rate_violations_time
  ON rate_limit_violations (last_violation DESC);

COMMENT ON TABLE rate_limit_violations IS
  'Tracks rate limit breaches for security monitoring and automatic IP blocking.';


/* ─────────────────────────────────────────────
 * TABLE: api_request_logs
 * Structured HTTP request logging for debugging and performance analysis.
 * Only logs requests that match configured criteria (errors, slow requests, etc.)
 * ───────────────────────────────────────────── */

CREATE TABLE IF NOT EXISTS api_request_logs (
  id              BIGSERIAL       PRIMARY KEY,
  request_id      VARCHAR(100)    NOT NULL,          -- X-Request-ID for tracing
  method          VARCHAR(10)     NOT NULL,           -- GET, POST, PUT, DELETE
  path            VARCHAR(500)    NOT NULL,           -- Request path
  status_code     SMALLINT        NOT NULL,           -- HTTP response status
  response_time_ms INTEGER        NOT NULL,           -- How long the request took
  user_id         UUID            REFERENCES users(id) ON DELETE SET NULL,
  ip_address      INET,
  user_agent      VARCHAR(500),
  error_message   TEXT,                               -- Only populated for error responses
  created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

/* Index for request tracing by ID */
CREATE INDEX IF NOT EXISTS idx_api_logs_request_id
  ON api_request_logs (request_id);

/* Index for finding slow or error requests */
CREATE INDEX IF NOT EXISTS idx_api_logs_status_time
  ON api_request_logs (status_code, response_time_ms DESC);

/* Index for time-range analysis */
CREATE INDEX IF NOT EXISTS idx_api_logs_created_at
  ON api_request_logs (created_at DESC);

/* Partial index for error-only queries (4xx and 5xx) */
CREATE INDEX IF NOT EXISTS idx_api_logs_errors
  ON api_request_logs (created_at DESC)
  WHERE status_code >= 400;

COMMENT ON TABLE api_request_logs IS
  'Structured HTTP request logs for debugging, performance analysis, and error tracking.';


/* ─────────────────────────────────────────────
 * Enhance existing notifications table (add missing columns if not present)
 * ───────────────────────────────────────────── */

DO $$
BEGIN
  /* Add priority column if it doesn't exist */
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notifications' AND column_name = 'priority'
  ) THEN
    ALTER TABLE notifications ADD COLUMN priority VARCHAR(20) NOT NULL DEFAULT 'normal';
  END IF;

  /* Add read_at timestamp column if it doesn't exist */
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notifications' AND column_name = 'read_at'
  ) THEN
    ALTER TABLE notifications ADD COLUMN read_at TIMESTAMPTZ;
  END IF;

  /* Add action_label column if it doesn't exist */
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notifications' AND column_name = 'action_label'
  ) THEN
    ALTER TABLE notifications ADD COLUMN action_label VARCHAR(100);
  END IF;

  /* Add metadata JSONB column if it doesn't exist */
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notifications' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE notifications ADD COLUMN metadata JSONB NOT NULL DEFAULT '{}';
  END IF;
END $$;

/* Priority-aware ordering index for notification queries */
CREATE INDEX IF NOT EXISTS idx_notifications_priority_order
  ON notifications (user_id, priority, created_at DESC)
  WHERE is_read = false;
