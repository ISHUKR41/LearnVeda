/*
 * FILE: 009_questions_levels_wallet.sql
 * LOCATION: src/lib/server/database/migrations/009_questions_levels_wallet.sql
 * PURPOSE: Adds the level system, wallet economy, subscriptions, and daily streak
 *          tables. Also backfills missing columns on existing tables (eduquest_questions
 *          and eduquest_users) that were created in earlier migrations.
 *
 * WHY THIS MIGRATION:
 *   Migrations 001–008 created the core schema. This migration extends it with:
 *   1. eduquest_levels      — XP thresholds for levels 1–100 (the gamification spine)
 *   2. eduquest_wallet      — Stars balance per user (virtual economy)
 *   3. eduquest_wallet_transactions — Immutable Stars ledger (auditable)
 *   4. eduquest_subscriptions — ₹200/month Pro plan records
 *   5. eduquest_daily_streaks — Per-day activity log for accurate streak tracking
 *   Plus ALTER TABLE backfills on eduquest_questions and eduquest_users.
 *
 * DESIGN DECISIONS:
 *   - All CREATE TABLE use IF NOT EXISTS so this migration is idempotent.
 *   - All ALTER TABLE use ADD COLUMN IF NOT EXISTS (PostgreSQL 9.6+).
 *   - eduquest_notifications already exists from migration 005; it is not recreated.
 *   - eduquest_questions already exists from migration 003; we only backfill
 *     the is_active column and add the missing index.
 *
 * USED BY: npm run db:migrate
 * LAST UPDATED: 2026-05-25
 */


-- ═══════════════════════════════════════════════════════════════
-- 1. BACKFILL eduquest_questions — add is_active column
-- Migration 003 created this table but did not include a soft-delete flag.
-- We add it here with a safe default (TRUE = visible to all students).
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE eduquest_questions
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

-- Now the index that filters only active questions per chapter is safe to create.
CREATE INDEX IF NOT EXISTS eduquest_questions_chapter_active_idx
  ON eduquest_questions (chapter_id, is_active, sequence_order);

CREATE INDEX IF NOT EXISTS eduquest_questions_difficulty_active_idx
  ON eduquest_questions (difficulty, is_active);


-- ═══════════════════════════════════════════════════════════════
-- 2. BACKFILL eduquest_users — add gamification and profile columns
-- Migration 001 created the users table with minimal columns.
-- We extend it with the data the dashboard and wallet features need.
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE eduquest_users
  ADD COLUMN IF NOT EXISTS stars_balance       INTEGER     NOT NULL DEFAULT 0  CHECK (stars_balance >= 0),
  ADD COLUMN IF NOT EXISTS longest_streak      INTEGER     NOT NULL DEFAULT 0  CHECK (longest_streak >= 0),
  ADD COLUMN IF NOT EXISTS last_active_at      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS avatar_url          TEXT,
  ADD COLUMN IF NOT EXISTS bio                 TEXT,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT        NOT NULL DEFAULT 'free'
                                               CHECK (subscription_status IN ('free', 'pro', 'pro_plus')),
  ADD COLUMN IF NOT EXISTS total_battles_won   INTEGER     NOT NULL DEFAULT 0  CHECK (total_battles_won >= 0),
  ADD COLUMN IF NOT EXISTS total_battles_played INTEGER    NOT NULL DEFAULT 0  CHECK (total_battles_played >= 0);

-- Indexes for the new columns used in leaderboard and dashboard queries
CREATE INDEX IF NOT EXISTS eduquest_users_stars_idx
  ON eduquest_users (stars_balance DESC);

CREATE INDEX IF NOT EXISTS eduquest_users_last_active_idx
  ON eduquest_users (last_active_at DESC NULLS LAST);


-- ═══════════════════════════════════════════════════════════════
-- 3. LEVEL SYSTEM (1–100)
-- XP formula: xp_required(n) = 50 * n * (n - 1)
--   Level 1  →       0 XP  (starting point — no XP required)
--   Level 2  →      50 XP
--   Level 5  →    1000 XP
--   Level 10 →    4500 XP
--   Level 25 →   30000 XP
--   Level 50 →  122500 XP
--   Level 100→  495000 XP
-- At 200 XP/day this represents about 7 years of consistent daily study.
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS eduquest_levels (
  level_number  INTEGER     PRIMARY KEY CHECK (level_number BETWEEN 1 AND 100),

  -- Total cumulative XP needed to REACH this level
  xp_required   INTEGER     NOT NULL CHECK (xp_required >= 0),

  -- XP needed to advance to the NEXT level (for progress bar calculations)
  xp_to_next    INTEGER     NOT NULL CHECK (xp_to_next > 0),

  -- Human-readable rank title shown on profile and leaderboard
  title         TEXT        NOT NULL,

  -- Short badge name (shown in compact form in battle rooms)
  badge_name    TEXT        NOT NULL,

  -- Lucide icon name rendered in the badge UI component
  badge_icon    TEXT        NOT NULL DEFAULT 'Star',

  -- CSS hex color for the badge (matches design system palette)
  badge_color   TEXT        NOT NULL DEFAULT '#6B7280',

  -- JSON object of perks unlocked at this level
  -- e.g. {"battle_access": true, "daily_xp_cap": 300, "streak_shield": 2}
  perks         JSONB       NOT NULL DEFAULT '{}'
);


-- ═══════════════════════════════════════════════════════════════
-- 4. WALLET (STARS BALANCE)
-- One row per user. Stars are the virtual currency earned by answering
-- questions correctly, winning battles, and maintaining streaks.
-- Stars are NOT real money and cannot be withdrawn.
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS eduquest_wallet (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL UNIQUE REFERENCES eduquest_users(id) ON DELETE CASCADE,

  -- Current Stars balance (never goes below 0)
  balance       INTEGER     NOT NULL DEFAULT 0 CHECK (balance >= 0),

  -- Lifetime stats for the wallet history page
  total_earned  INTEGER     NOT NULL DEFAULT 0 CHECK (total_earned >= 0),
  total_spent   INTEGER     NOT NULL DEFAULT 0 CHECK (total_spent >= 0),

  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS eduquest_wallet_user_idx
  ON eduquest_wallet (user_id);


-- ═══════════════════════════════════════════════════════════════
-- 5. WALLET TRANSACTION LEDGER
-- Immutable append-only log of every Stars credit and debit.
-- Never UPDATE or DELETE rows — only INSERT.
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS eduquest_wallet_transactions (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id     UUID        NOT NULL REFERENCES eduquest_wallet(id) ON DELETE CASCADE,

  -- Positive = credit (earned), negative = debit (spent)
  amount        INTEGER     NOT NULL CHECK (amount != 0),

  -- Source category drives the icon shown in the wallet history UI
  tx_type       TEXT        NOT NULL
                CHECK (tx_type IN (
                  'question_correct', 'streak_bonus', 'battle_win',
                  'battle_loss',      'battle_wager', 'level_up_bonus',
                  'daily_login',      'achievement',  'refund',
                  'admin_grant',      'subscription_reward', 'event_prize'
                )),

  -- Plain-English description shown to the student
  description   TEXT        NOT NULL,

  -- Running balance snapshot AFTER this transaction (for instant display)
  balance_after INTEGER     NOT NULL CHECK (balance_after >= 0),

  -- Optional link to the entity that triggered this transaction
  reference_id  UUID,

  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS eduquest_wallet_tx_wallet_idx
  ON eduquest_wallet_transactions (wallet_id, created_at DESC);

CREATE INDEX IF NOT EXISTS eduquest_wallet_tx_type_idx
  ON eduquest_wallet_transactions (tx_type, created_at DESC);


-- ═══════════════════════════════════════════════════════════════
-- 6. SUBSCRIPTIONS
-- Records the Pro plan (₹200/month) subscription lifecycle.
-- Razorpay gateway integration is planned; payment_id is nullable until then.
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS eduquest_subscriptions (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES eduquest_users(id) ON DELETE CASCADE,

  plan          TEXT        NOT NULL DEFAULT 'pro'
                CHECK (plan IN ('pro', 'pro_plus', 'institution')),

  status        TEXT        NOT NULL DEFAULT 'active'
                CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),

  starts_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at    TIMESTAMPTZ NOT NULL,

  -- Amount in Indian Paise (₹200 = 20000 paise)
  amount_paise  INTEGER     NOT NULL DEFAULT 20000 CHECK (amount_paise > 0),

  -- Razorpay payment reference (NULL while gateway integration is pending)
  payment_id    TEXT,

  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS eduquest_subscriptions_user_idx
  ON eduquest_subscriptions (user_id, status, expires_at DESC);


-- ═══════════════════════════════════════════════════════════════
-- 7. DAILY STREAK TRACKING
-- One row per user per calendar day. Authoritative streak source — the
-- eduquest_users.streak column is a fast-access cache derived from this table.
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS eduquest_daily_streaks (
  id                  UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID    NOT NULL REFERENCES eduquest_users(id) ON DELETE CASCADE,

  -- UTC calendar date (no time component — one record per day per user)
  active_date         DATE    NOT NULL,

  -- Number of questions answered correctly this day
  questions_answered  INTEGER NOT NULL DEFAULT 0 CHECK (questions_answered >= 0),

  -- XP earned from all activities on this day
  xp_earned          INTEGER NOT NULL DEFAULT 0  CHECK (xp_earned >= 0),

  UNIQUE (user_id, active_date)
);

CREATE INDEX IF NOT EXISTS eduquest_daily_streaks_user_date_idx
  ON eduquest_daily_streaks (user_id, active_date DESC);
