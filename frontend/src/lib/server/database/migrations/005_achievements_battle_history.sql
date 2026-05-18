/*
 * FILE: 005_achievements_battle_history.sql
 * LOCATION: src/lib/server/database/migrations/005_achievements_battle_history.sql
 * PURPOSE: Adds achievement badges and detailed battle history to the EduQuest schema.
 *          Creates tables for:
 *            - eduquest_achievements      — global achievement definitions
 *            - eduquest_user_achievements — per-user awarded badges
 *            - eduquest_battle_history    — per-match detailed result log
 *            - eduquest_daily_challenges  — daily XP challenge prompts
 *
 * USED BY: npm run db:migrate, postgres-platform-repository.ts
 * LAST UPDATED: 2026-05-18
 * NOTES: All tables use UUID primary keys with gen_random_uuid().
 *        Foreign key to eduquest_users.id uses ON DELETE CASCADE
 *        so deleting a user cleans up all their game data.
 */

-- ─────────────────────────────────────────────
-- ACHIEVEMENTS DEFINITION TABLE
-- Master list of all platform achievements / badges.
-- Each row represents one type of achievement students can unlock.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS eduquest_achievements (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  slug          TEXT NOT NULL UNIQUE,  -- Stable machine-readable ID, e.g. 'streak-30'
  name          TEXT NOT NULL,         -- Display name, e.g. '30-Day Warrior'
  description   TEXT NOT NULL,         -- How to earn it, shown on the achievements page
  category      TEXT NOT NULL          -- 'streak' | 'battle' | 'academic' | 'community' | 'milestone'
                  CHECK (category IN ('streak', 'battle', 'academic', 'community', 'milestone')),

  badge_color   TEXT NOT NULL DEFAULT '#2563EB', -- CSS hex color for the badge icon
  badge_icon    TEXT NOT NULL DEFAULT 'Trophy',   -- Lucide icon name for the badge
  xp_reward     INTEGER NOT NULL DEFAULT 0,        -- Bonus XP awarded when this achievement is unlocked

  /* Trigger thresholds — checked by the backend when updating user stats */
  threshold_type  TEXT,                    -- 'streak_days' | 'battles_won' | 'chapters_done' | 'xp_total' | NULL (manual)
  threshold_value INTEGER,                 -- Numeric value at which the achievement unlocks

  is_active     BOOLEAN NOT NULL DEFAULT TRUE,  -- FALSE = achievement temporarily disabled or retired
  sort_order    INTEGER NOT NULL DEFAULT 0,      -- Display order on the achievements page

  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS eduquest_achievements_category_idx
  ON eduquest_achievements (category);

CREATE INDEX IF NOT EXISTS eduquest_achievements_slug_idx
  ON eduquest_achievements (slug);

-- ─────────────────────────────────────────────
-- USER ACHIEVEMENTS TABLE
-- Records which achievements each user has earned and when.
-- One row per (user_id, achievement_id) pair.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS eduquest_user_achievements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES eduquest_users(id) ON DELETE CASCADE,
  achievement_id  UUID NOT NULL REFERENCES eduquest_achievements(id) ON DELETE CASCADE,
  awarded_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  /* Each user can earn each achievement only once */
  UNIQUE (user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS eduquest_user_achievements_user_idx
  ON eduquest_user_achievements (user_id);

-- ─────────────────────────────────────────────
-- BATTLE HISTORY TABLE
-- Records the outcome of every completed battle for a given user.
-- Each battle has one row per participant (two rows per match).
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS eduquest_battle_history (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES eduquest_users(id) ON DELETE CASCADE,

  match_id      TEXT NOT NULL,          -- Matches the battle matchmaking ticket ID
  opponent_id   UUID,                   -- NULL if opponent deleted their account
  opponent_name TEXT,                   -- Denormalized for display when opponent is gone
  category      TEXT NOT NULL,          -- Battle category e.g. 'class-9-science'
  result        TEXT NOT NULL           -- 'win' | 'loss' | 'draw' | 'abandoned'
                  CHECK (result IN ('win', 'loss', 'draw', 'abandoned')),

  user_score    INTEGER NOT NULL DEFAULT 0,      -- Questions answered correctly (0–10)
  opponent_score INTEGER NOT NULL DEFAULT 0,     -- Opponent's correct answers

  xp_earned     INTEGER NOT NULL DEFAULT 0,      -- XP this battle awarded to the user
  duration_secs INTEGER,                          -- How long the battle lasted in seconds

  played_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS eduquest_battle_history_user_idx
  ON eduquest_battle_history (user_id, played_at DESC);

CREATE INDEX IF NOT EXISTS eduquest_battle_history_match_idx
  ON eduquest_battle_history (match_id);

-- ─────────────────────────────────────────────
-- DAILY CHALLENGES TABLE
-- Platform-curated daily challenges that give students a bonus XP goal.
-- Active for exactly one calendar day (active_date).
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS eduquest_daily_challenges (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  active_date   DATE NOT NULL UNIQUE,   -- The calendar date this challenge is active

  title         TEXT NOT NULL,          -- e.g. 'Science Blitz'
  description   TEXT NOT NULL,          -- What the student must do
  category      TEXT NOT NULL,          -- 'battle' | 'academic' | 'community' | 'streak'
  xp_reward     INTEGER NOT NULL DEFAULT 50,  -- Bonus XP for completing the challenge

  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- DAILY CHALLENGE COMPLETIONS TABLE
-- Tracks which users have completed each day's challenge.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS eduquest_challenge_completions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES eduquest_daily_challenges(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES eduquest_users(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (challenge_id, user_id)
);

CREATE INDEX IF NOT EXISTS eduquest_challenge_completions_user_idx
  ON eduquest_challenge_completions (user_id);

-- ─────────────────────────────────────────────
-- SEED: DEFAULT ACHIEVEMENT DEFINITIONS
-- Inserts the standard set of achievements that all EduQuest students
-- can unlock through normal platform usage.
-- Uses ON CONFLICT DO NOTHING to make the migration idempotent.
-- ─────────────────────────────────────────────
INSERT INTO eduquest_achievements
  (slug, name, description, category, badge_color, badge_icon, xp_reward, threshold_type, threshold_value, sort_order)
VALUES
  ('first-chapter', 'First Step', 'Complete your first chapter.', 'academic', '#2563EB', 'BookOpen', 25, 'chapters_done', 1, 10),
  ('ten-chapters', 'Dedicated Learner', 'Complete 10 chapters.', 'academic', '#059669', 'BookOpen', 100, 'chapters_done', 10, 20),
  ('fifty-chapters', 'Chapter Master', 'Complete 50 chapters.', 'academic', '#7C3AED', 'Award', 500, 'chapters_done', 50, 30),
  ('streak-3', 'Consistent', '3-day study streak.', 'streak', '#D97706', 'Flame', 30, 'streak_days', 3, 40),
  ('streak-7', 'Week Warrior', '7-day study streak.', 'streak', '#F59E0B', 'Flame', 70, 'streak_days', 7, 50),
  ('streak-30', '30-Day Warrior', '30-day study streak.', 'streak', '#EF4444', 'Flame', 300, 'streak_days', 30, 60),
  ('streak-100', 'Centurion', '100-day study streak.', 'streak', '#DC2626', 'Flame', 1000, 'streak_days', 100, 70),
  ('first-battle', 'Battle Initiate', 'Complete your first battle.', 'battle', '#F85149', 'Swords', 50, 'battles_won', 1, 80),
  ('ten-battles', 'Battle Veteran', 'Win 10 battles.', 'battle', '#B91C1C', 'Swords', 200, 'battles_won', 10, 90),
  ('fifty-battles', 'Battle Champion', 'Win 50 battles.', 'battle', '#991B1B', 'Trophy', 500, 'battles_won', 50, 100),
  ('xp-1000', 'Rising Star', 'Reach 1,000 XP.', 'milestone', '#2563EB', 'Zap', 100, 'xp_total', 1000, 110),
  ('xp-10000', 'EduQuest Legend', 'Reach 10,000 XP.', 'milestone', '#7C3AED', 'Star', 1000, 'xp_total', 10000, 120),
  ('first-post', 'Community Member', 'Post your first community question.', 'community', '#0891B2', 'MessageSquare', 20, NULL, NULL, 130)
ON CONFLICT (slug) DO NOTHING;
