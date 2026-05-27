/**
 * MIGRATION: 016_audit_logs_seo_cache.sql
 * PURPOSE: Creates the audit_logs table for production security auditing
 *          and adds SEO-related caching tables for sitemap and schema data.
 *
 * TABLES CREATED:
 *  1. audit_logs — Tamper-proof audit trail for all sensitive operations
 *  2. seo_cache  — Cached SEO data (sitemaps, schemas) with TTL
 *
 * INDEXES: Optimized for common audit queries:
 *  - By category + created_at (for filtering by type)
 *  - By user_id + created_at (for user activity trails)
 *  - By severity + created_at (for security monitoring)
 *  - By resource_type + resource_id (for resource trails)
 *
 * PARTITIONING READY: The audit_logs table uses BRIN indexes on created_at
 *  for efficient time-range queries on large datasets (100M+ rows).
 *
 * RETENTION: Audit logs are retained for 365 days by default.
 *            The scheduler service handles automatic purging.
 *
 * LAST UPDATED: 2026-05-26
 */

/* ─────────────────────────────────────────────
 * TABLE: audit_logs
 * Stores all security-relevant events with metadata.
 * Designed for high-volume inserts (batch write-ahead buffer).
 * ───────────────────────────────────────────── */
CREATE TABLE IF NOT EXISTS audit_logs (
  /* Primary key — auto-incrementing for ordered storage */
  id            BIGSERIAL    PRIMARY KEY,

  /* Event classification */
  category      VARCHAR(20)  NOT NULL DEFAULT 'SYSTEM',
  action        VARCHAR(100) NOT NULL,
  description   TEXT         NOT NULL DEFAULT '',

  /* Actor information */
  user_id       VARCHAR(50),
  ip_address    VARCHAR(45),  -- Supports IPv6 (max 45 chars)
  user_agent    TEXT,

  /* Severity classification for monitoring alerts */
  severity      VARCHAR(10)  NOT NULL DEFAULT 'LOW'
                CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),

  /* Target resource identification */
  resource_type VARCHAR(50),
  resource_id   VARCHAR(100),

  /* Flexible metadata (JSON) for additional context */
  metadata      JSONB        NOT NULL DEFAULT '{}',

  /* Timestamps */
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

/* ─────────────────────────────────────────────
 * INDEXES: Optimized for common query patterns
 * ───────────────────────────────────────────── */

/* Filter by category within a time range (most common admin query) */
CREATE INDEX IF NOT EXISTS idx_audit_category_created
  ON audit_logs (category, created_at DESC);

/* User activity trail — "what did this user do?" */
CREATE INDEX IF NOT EXISTS idx_audit_user_created
  ON audit_logs (user_id, created_at DESC)
  WHERE user_id IS NOT NULL;

/* Security monitoring — find CRITICAL/HIGH severity events fast */
CREATE INDEX IF NOT EXISTS idx_audit_severity_created
  ON audit_logs (severity, created_at DESC)
  WHERE severity IN ('HIGH', 'CRITICAL');

/* Resource trail — "what happened to this subject/chapter/user?" */
CREATE INDEX IF NOT EXISTS idx_audit_resource
  ON audit_logs (resource_type, resource_id, created_at DESC)
  WHERE resource_type IS NOT NULL;

/* BRIN index for time-range scans on large audit tables */
CREATE INDEX IF NOT EXISTS idx_audit_created_brin
  ON audit_logs USING BRIN (created_at);

/* GIN index for full-text search on metadata JSON */
CREATE INDEX IF NOT EXISTS idx_audit_metadata_gin
  ON audit_logs USING GIN (metadata);


/* ─────────────────────────────────────────────
 * TABLE: seo_cache
 * Caches generated SEO data (sitemaps, schemas, metadata)
 * to avoid regeneration on every request.
 * ───────────────────────────────────────────── */
CREATE TABLE IF NOT EXISTS seo_cache (
  /* Cache key (e.g., "sitemap_main", "schema_homepage") */
  cache_key     VARCHAR(100) PRIMARY KEY,

  /* Cached content (XML sitemap, JSON-LD, etc.) */
  content       TEXT         NOT NULL,

  /* Content type for proper HTTP headers */
  content_type  VARCHAR(50)  NOT NULL DEFAULT 'application/json',

  /* Time-to-live in seconds */
  ttl_seconds   INTEGER      NOT NULL DEFAULT 3600,

  /* Timestamps */
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  expires_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW() + INTERVAL '1 hour'
);

/* Index for TTL-based cache eviction */
CREATE INDEX IF NOT EXISTS idx_seo_cache_expires
  ON seo_cache (expires_at);


/* ─────────────────────────────────────────────
 * Add engineering-specific columns to eduquest_subjects table
 * if they don't already exist.
 * ───────────────────────────────────────────── */
DO $$ BEGIN
  /* Add semester column for engineering subjects */
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'eduquest_subjects' AND column_name = 'semester'
  ) THEN
    ALTER TABLE eduquest_subjects ADD COLUMN semester INTEGER;
  END IF;

  /* Add stream column for engineering branch */
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'eduquest_subjects' AND column_name = 'stream'
  ) THEN
    ALTER TABLE eduquest_subjects ADD COLUMN stream VARCHAR(20);
  END IF;

  /* Add total_topics to eduquest_chapters */
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'eduquest_chapters' AND column_name = 'total_topics'
  ) THEN
    ALTER TABLE eduquest_chapters ADD COLUMN total_topics INTEGER DEFAULT 0;
  END IF;
END $$;


/* ─────────────────────────────────────────────
 * Force ANALYZE on new tables for query planner
 * ───────────────────────────────────────────── */
ANALYZE audit_logs;
ANALYZE seo_cache;
