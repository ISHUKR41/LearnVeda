/*
 * FILE: 004_event_host_applications.sql
 * LOCATION: src/lib/server/database/migrations/004_event_host_applications.sql
 * PURPOSE: Adds a dedicated production table for institution event-hosting
 *          applications. This replaces the earlier audit-log-only intake path
 *          with queryable, reviewable, structured data.
 * USED BY: npm run db:migrate, /api/events/host-application
 * LAST UPDATED: 2026-05-18
 */

CREATE TABLE IF NOT EXISTS eduquest_host_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number TEXT NOT NULL UNIQUE,

  institution_name TEXT NOT NULL,
  institution_type TEXT NOT NULL CHECK (institution_type IN ('college', 'school', 'coaching', 'corporate', 'other')),
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  website TEXT,

  organizer_name TEXT NOT NULL,
  organizer_email TEXT NOT NULL,
  organizer_phone TEXT,
  organizer_role TEXT,

  event_name TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('coding', 'quiz', 'hackathon', 'olympiad', 'other')),
  event_date DATE NOT NULL,
  expected_participants INTEGER NOT NULL CHECK (expected_participants > 0),
  target_audience TEXT,
  event_description TEXT,

  needs_safe_browser BOOLEAN NOT NULL DEFAULT TRUE,
  needs_certificates BOOLEAN NOT NULL DEFAULT TRUE,
  needs_leaderboard BOOLEAN NOT NULL DEFAULT TRUE,
  needs_prize_integration BOOLEAN NOT NULL DEFAULT FALSE,

  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'needs_info')),
  submitted_by_user_id UUID REFERENCES eduquest_users(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,

  review_notes TEXT,
  reviewed_by_user_id UUID REFERENCES eduquest_users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS eduquest_host_applications_status_idx
  ON eduquest_host_applications (status, created_at DESC);

CREATE INDEX IF NOT EXISTS eduquest_host_applications_email_idx
  ON eduquest_host_applications (organizer_email, created_at DESC);

CREATE INDEX IF NOT EXISTS eduquest_host_applications_institution_idx
  ON eduquest_host_applications (institution_name, city, state);
