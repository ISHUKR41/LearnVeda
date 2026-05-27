/* MIGRATION: 016a - Audit logs and SEO cache tables ONLY */

CREATE TABLE IF NOT EXISTS audit_logs (
  id            BIGSERIAL    PRIMARY KEY,
  category      VARCHAR(20)  NOT NULL DEFAULT 'SYSTEM',
  action        VARCHAR(100) NOT NULL,
  description   TEXT         NOT NULL DEFAULT '',
  user_id       VARCHAR(50),
  ip_address    VARCHAR(45),
  user_agent    TEXT,
  severity      VARCHAR(10)  NOT NULL DEFAULT 'LOW'
                CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  resource_type VARCHAR(50),
  resource_id   VARCHAR(100),
  metadata      JSONB        NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_category_created
  ON audit_logs (category, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_user_created
  ON audit_logs (user_id, created_at DESC)
  WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_audit_severity_created
  ON audit_logs (severity, created_at DESC)
  WHERE severity IN ('HIGH', 'CRITICAL');

CREATE INDEX IF NOT EXISTS idx_audit_resource
  ON audit_logs (resource_type, resource_id, created_at DESC)
  WHERE resource_type IS NOT NULL;

CREATE TABLE IF NOT EXISTS seo_cache (
  cache_key     VARCHAR(100) PRIMARY KEY,
  content       TEXT         NOT NULL,
  content_type  VARCHAR(50)  NOT NULL DEFAULT 'application/json',
  ttl_seconds   INTEGER      NOT NULL DEFAULT 3600,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  expires_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW() + INTERVAL '1 hour'
);

CREATE INDEX IF NOT EXISTS idx_seo_cache_expires
  ON seo_cache (expires_at);
