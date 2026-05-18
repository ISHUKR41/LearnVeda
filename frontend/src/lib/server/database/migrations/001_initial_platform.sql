/*
 * FILE: 001_initial_platform.sql
 * LOCATION: src/lib/server/database/migrations/001_initial_platform.sql
 * PURPOSE: Initial PostgreSQL schema for the production EduQuest backend.
 *          These tables replace the MVP JSON store for users, battles,
 *          community posts, event registrations, and migration history.
 * USED BY: npm run db:migrate, PostgreSQL repository adapter
 * LAST UPDATED: 2026-05-12
 */

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS eduquest_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  track TEXT NOT NULL CHECK (track IN ('class-9', 'class-10', 'class-11', 'class-12', 'engineering')),
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'parent', 'teacher', 'organizer', 'admin')),
  level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1),
  xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
  streak INTEGER NOT NULL DEFAULT 0 CHECK (streak >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS eduquest_users_track_idx ON eduquest_users (track);
CREATE INDEX IF NOT EXISTS eduquest_users_level_idx ON eduquest_users (level DESC);

CREATE TABLE IF NOT EXISTS eduquest_matchmaking_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES eduquest_users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'matched', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS eduquest_matchmaking_lookup_idx
  ON eduquest_matchmaking_tickets (category, status, created_at);

CREATE TABLE IF NOT EXISTS eduquest_community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES eduquest_users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  likes INTEGER NOT NULL DEFAULT 0 CHECK (likes >= 0),
  comments INTEGER NOT NULL DEFAULT 0 CHECK (comments >= 0),
  views INTEGER NOT NULL DEFAULT 0 CHECK (views >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS eduquest_community_posts_created_idx
  ON eduquest_community_posts (created_at DESC);

CREATE INDEX IF NOT EXISTS eduquest_community_posts_tags_idx
  ON eduquest_community_posts USING GIN (tags);

CREATE TABLE IF NOT EXISTS eduquest_event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES eduquest_users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, user_id)
);

CREATE INDEX IF NOT EXISTS eduquest_event_registrations_user_idx
  ON eduquest_event_registrations (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS eduquest_event_registrations_event_idx
  ON eduquest_event_registrations (event_id, created_at DESC);
