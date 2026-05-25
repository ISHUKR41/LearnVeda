/*
 * FILE: 008_sessions.sql
 * LOCATION: src/lib/server/database/migrations/008_sessions.sql
 * PURPOSE: PostgreSQL schema for centralized server-side sessions.
 * USED BY: npm run db:migrate, PostgreSQL repository adapter
 * LAST UPDATED: 2026-05-21
 */

CREATE TABLE IF NOT EXISTS eduquest_sessions (
  token_id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES eduquest_users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  client_key TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  revoke_reason TEXT
);

CREATE INDEX IF NOT EXISTS eduquest_sessions_user_idx ON eduquest_sessions (user_id);
