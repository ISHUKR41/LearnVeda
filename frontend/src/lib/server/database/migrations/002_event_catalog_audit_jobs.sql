/*
 * FILE: 002_event_catalog_audit_jobs.sql
 * LOCATION: src/lib/server/database/migrations/002_event_catalog_audit_jobs.sql
 * PURPOSE: Adds production tables for the public event catalog, persistent
 *          audit logs, and durable background job intents. These tables close
 *          the gap between the repository contracts and the PostgreSQL schema.
 * USED BY: npm run db:migrate, PostgreSQL repository adapter
 * LAST UPDATED: 2026-05-17
 */

CREATE TABLE IF NOT EXISTS eduquest_events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date_label TEXT NOT NULL,
  location TEXT NOT NULL,
  participant_count INTEGER NOT NULL DEFAULT 0 CHECK (participant_count >= 0),
  status TEXT NOT NULL CHECK (status IN ('live', 'upcoming', 'completed')),
  gradient TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS eduquest_events_public_order_idx
  ON eduquest_events (is_public, sort_order, created_at);

INSERT INTO eduquest_events (
  id, title, description, event_date_label, location, participant_count,
  status, gradient, sort_order
)
VALUES
  (
    'science-olympiad-2026',
    'Science Olympiad 2026',
    'Test your science knowledge across Physics, Chemistry, and Biology in this national-level competition.',
    'May 24, 2026',
    'Online',
    1250,
    'upcoming',
    'linear-gradient(135deg, #3B82F6, #06B6D4)',
    10
  ),
  (
    'code-sprint-dsa',
    'Code Sprint — DSA Challenge',
    'Solve 10 DSA problems in 2 hours. Top performers win premium subscriptions and certificates.',
    'May 12, 2026',
    'Online',
    890,
    'live',
    'linear-gradient(135deg, #EF4444, #F97316)',
    20
  ),
  (
    'math-battle-royale',
    'Math Battle Royale',
    '50 players, 1 winner. Quick-fire math questions with elimination rounds.',
    'Jun 2, 2026',
    'Online',
    650,
    'upcoming',
    'linear-gradient(135deg, #8B5CF6, #A855F7)',
    30
  ),
  (
    'inter-college-hackathon',
    'Inter-College Hackathon',
    'Build a full-stack project in 24 hours. Teams of 3-4. Open to all engineering students.',
    'Jun 20, 2026',
    'Delhi NCR',
    420,
    'upcoming',
    'linear-gradient(135deg, #10B981, #14B8A6)',
    40
  ),
  (
    'class-10-board-mock',
    'Board Exam Mock Test — Class 10',
    'Full-length mock exam simulating actual CBSE board exam conditions with instant analysis.',
    'Apr 28, 2026',
    'Online',
    2100,
    'completed',
    'linear-gradient(135deg, #6B7280, #9CA3AF)',
    50
  ),
  (
    'python-championship',
    'Python Championship',
    'Competitive programming contest focused on Python. Beginner to advanced problems included.',
    'Jul 5, 2026',
    'Online',
    780,
    'upcoming',
    'linear-gradient(135deg, #F59E0B, #D97706)',
    60
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  event_date_label = EXCLUDED.event_date_label,
  location = EXCLUDED.location,
  participant_count = EXCLUDED.participant_count,
  status = EXCLUDED.status,
  gradient = EXCLUDED.gradient,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

CREATE TABLE IF NOT EXISTS eduquest_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  actor_id UUID REFERENCES eduquest_users(id) ON DELETE SET NULL,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('anonymous', 'student', 'system')),
  target_type TEXT NOT NULL,
  target_id TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS eduquest_audit_logs_created_idx
  ON eduquest_audit_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS eduquest_audit_logs_actor_idx
  ON eduquest_audit_logs (actor_id, created_at DESC);

CREATE INDEX IF NOT EXISTS eduquest_audit_logs_action_idx
  ON eduquest_audit_logs (action, created_at DESC);

CREATE TABLE IF NOT EXISTS eduquest_background_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL,
  subject_type TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  run_after TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS eduquest_background_jobs_due_idx
  ON eduquest_background_jobs (status, run_after, created_at);

CREATE INDEX IF NOT EXISTS eduquest_background_jobs_subject_idx
  ON eduquest_background_jobs (subject_type, subject_id);
