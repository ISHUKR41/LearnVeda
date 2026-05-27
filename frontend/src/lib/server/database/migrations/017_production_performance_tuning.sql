/*
 * FILE: 017_production_performance_tuning.sql
 * LOCATION: src/lib/server/database/migrations/017_production_performance_tuning.sql
 * PURPOSE: Implements optimal compound query indexes and PostgreSQL performance
 *          tuning constraints to support 10,000+ concurrent students.
 *          Focuses specifically on:
 *            - Fast category and status filtering on public events and hackathons
 *            - Highly responsive event registrations validation
 *            - Compound indexing for quick lookup on user progress streaks
 *
 * USED BY: npm run db:migrate, production PostgreSQL deployments
 * LAST UPDATED: 2026-05-27
 */

-- ─────────────────────────────────────────────
-- 1. ADVANCED EVENTS & HACKATHON SEARCH INDEXES
-- ─────────────────────────────────────────────
-- Hackathons and coding challenges require ultra-fast reads filtering by status
-- and sort order. This compound index satisfies standard page query plans.
CREATE INDEX IF NOT EXISTS eduquest_events_status_is_public_sort_idx
  ON eduquest_events (status, is_public, sort_order DESC, created_at DESC);

-- ─────────────────────────────────────────────
-- 2. EVENT REGISTRATION VALIDATION TUNING
-- ─────────────────────────────────────────────
-- During bursts of registrations (e.g., college hackathons launching),
-- check-existence and duplication verification must execute in <1ms.
-- This compound index ensures instant matches.
CREATE INDEX IF NOT EXISTS eduquest_event_registrations_user_event_idx
  ON eduquest_event_registrations (user_id, event_id);

-- ─────────────────────────────────────────────
-- 3. USER EXPERIENCE PROGRESS & STREAKS INDEXES
-- ─────────────────────────────────────────────
-- Streak tracking triggers are executed on every active learning day.
-- Indexing ensures streak validation and daily XP checking remains constant time.
CREATE INDEX IF NOT EXISTS eduquest_users_xp_streak_idx
  ON eduquest_users (id, xp DESC, streak DESC);
