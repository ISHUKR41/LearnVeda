-- =============================================================================
-- Migration 012: Seed gamification data — achievements, notifications,
--                user_progress records, and wallet transactions.
--
-- PURPOSE:
--   This migration populates every gamification table so the platform shows
--   real, meaningful data on the dashboard, achievements page, and
--   notification centre from the very first visit.
--
-- TABLES AFFECTED:
--   eduquest_achievements         — 20 platform-wide achievement definitions
--   eduquest_user_achievements    — awards for the 12 demo users
--   eduquest_notifications        — seeded inbox items for demo users
--   eduquest_user_progress        — chapter progress records per demo user
--   eduquest_wallet_transactions  — a few sample credit/debit entries
--   eduquest_daily_streaks        — one streak row per demo user
--
-- IDEMPOTENT: Uses ON CONFLICT DO NOTHING throughout.
-- REVERSIBLE: Delete rows by seeded slug / user email.
-- LAST UPDATED: 2026-05-25
-- =============================================================================

-- ─── Section 1: Achievement Definitions ──────────────────────────────────────
-- We add 20 milestone achievements covering streaks, XP, battles, and community.
-- Any existing rows (slug conflict) are skipped to preserve existing data.

INSERT INTO eduquest_achievements (
  id, slug, name, description, category,
  badge_color, badge_icon, xp_reward,
  threshold_type, threshold_value,
  is_active, sort_order, created_at
) VALUES
  -- Streak achievements
  (gen_random_uuid(), 'streak-3',       'Getting Started',     'Maintain a 3-day study streak',         'streak',    '#F59E0B', 'flame',      50,  'streak_days',      3,   TRUE, 10, NOW()),
  (gen_random_uuid(), 'streak-7',       'Week Warrior',        'Maintain a 7-day study streak',         'streak',    '#F59E0B', 'flame',      150, 'streak_days',      7,   TRUE, 20, NOW()),
  (gen_random_uuid(), 'streak-14',      'Fortnight Fighter',   'Maintain a 14-day study streak',        'streak',    '#EF4444', 'flame',      300, 'streak_days',      14,  TRUE, 30, NOW()),
  (gen_random_uuid(), 'streak-30',      'Monthly Master',      'Maintain a 30-day study streak',        'streak',    '#DC2626', 'flame',      750, 'streak_days',      30,  TRUE, 40, NOW()),
  (gen_random_uuid(), 'streak-60',      'Unstoppable',         'Maintain a 60-day study streak',        'streak',    '#991B1B', 'flame',      2000,'streak_days',      60,  TRUE, 50, NOW()),
  -- XP achievements
  (gen_random_uuid(), 'xp-100',         'First Steps',         'Earn your first 100 XP',                'milestone', '#3B82F6', 'zap',        25,  'total_xp',         100, TRUE, 60, NOW()),
  (gen_random_uuid(), 'xp-500',         'On the Board',        'Earn 500 total XP',                     'milestone', '#3B82F6', 'zap',        50,  'total_xp',         500, TRUE, 70, NOW()),
  (gen_random_uuid(), 'xp-1000',        'Level Chaser',        'Earn 1,000 total XP',                   'milestone', '#2563EB', 'zap',        100, 'total_xp',         1000,TRUE, 80, NOW()),
  (gen_random_uuid(), 'xp-5000',        'XP Hunter',           'Earn 5,000 total XP',                   'milestone', '#1D4ED8', 'zap',        500, 'total_xp',         5000,TRUE, 90, NOW()),
  (gen_random_uuid(), 'xp-10000',       'XP Legend',           'Earn 10,000 total XP',                  'milestone', '#1E3A8A', 'star',       1500,'total_xp',         10000,TRUE,100, NOW()),
  -- Battle achievements
  (gen_random_uuid(), 'first-battle',   'Battle Ready',        'Complete your first live battle',       'battle',    '#8B5CF6', 'swords',     100, 'battles_played',   1,   TRUE, 110, NOW()),
  (gen_random_uuid(), 'battle-10',      'Ring Fighter',        'Complete 10 live battles',              'battle',    '#7C3AED', 'swords',     200, 'battles_played',   10,  TRUE, 120, NOW()),
  (gen_random_uuid(), 'battle-50',      'Arena Veteran',       'Complete 50 live battles',              'battle',    '#6D28D9', 'swords',     500, 'battles_played',   50,  TRUE, 130, NOW()),
  (gen_random_uuid(), 'first-win',      'First Blood',         'Win your first live battle',            'battle',    '#10B981', 'trophy',     150, 'battles_won',      1,   TRUE, 140, NOW()),
  (gen_random_uuid(), 'win-10',         'Battle Champion',     'Win 10 live battles',                   'battle',    '#059669', 'trophy',     400, 'battles_won',      10,  TRUE, 150, NOW()),
  -- Community achievements
  (gen_random_uuid(), 'first-post',     'Voice of the Hall',   'Post your first community question',    'community', '#EC4899', 'users',      75,  'posts_created',    1,   TRUE, 160, NOW()),
  (gen_random_uuid(), 'helpful-10',     'Top Contributor',     'Receive 10 total likes on your posts',  'community', '#DB2777', 'heart',      200, 'post_likes',       10,  TRUE, 170, NOW()),
  -- Level achievements  
  (gen_random_uuid(), 'level-5',        'Novice',              'Reach Level 5',                         'milestone', '#6B7280', 'award',      100, 'level_reached',    5,   TRUE, 180, NOW()),
  (gen_random_uuid(), 'level-10',       'Apprentice',          'Reach Level 10',                        'milestone', '#D97706', 'award',      250, 'level_reached',    10,  TRUE, 190, NOW()),
  (gen_random_uuid(), 'level-20',       'Expert',              'Reach Level 20',                        'milestone', '#F59E0B', 'crown',      1000,'level_reached',    20,  TRUE, 200, NOW())
ON CONFLICT (slug) DO NOTHING;

-- ─── Section 2: Award achievements to demo users ──────────────────────────────
-- We award achievements based on each demo user's XP, level, streak, and battle stats.
-- This runs as a series of INSERT SELECT statements so we don't hard-code UUIDs.

-- "First Steps" (100 XP) — everyone with xp >= 100 gets it
INSERT INTO eduquest_user_achievements (id, user_id, achievement_id, awarded_at)
SELECT
  gen_random_uuid(),
  u.id,
  a.id,
  u.created_at + INTERVAL '1 hour'
FROM eduquest_users u
CROSS JOIN eduquest_achievements a
WHERE a.slug = 'xp-100'
  AND u.xp >= 100
  AND u.email LIKE '%@demo.eduquest.in'
  AND NOT EXISTS (
    SELECT 1 FROM eduquest_user_achievements ua
    WHERE ua.user_id = u.id AND ua.achievement_id = a.id
  );

-- "On the Board" (500 XP) — users with xp >= 500
INSERT INTO eduquest_user_achievements (id, user_id, achievement_id, awarded_at)
SELECT gen_random_uuid(), u.id, a.id, u.created_at + INTERVAL '5 days'
FROM eduquest_users u
CROSS JOIN eduquest_achievements a
WHERE a.slug = 'xp-500' AND u.xp >= 500 AND u.email LIKE '%@demo.eduquest.in'
  AND NOT EXISTS (SELECT 1 FROM eduquest_user_achievements ua WHERE ua.user_id = u.id AND ua.achievement_id = a.id);

-- "Level Chaser" (1000 XP)
INSERT INTO eduquest_user_achievements (id, user_id, achievement_id, awarded_at)
SELECT gen_random_uuid(), u.id, a.id, u.created_at + INTERVAL '15 days'
FROM eduquest_users u
CROSS JOIN eduquest_achievements a
WHERE a.slug = 'xp-1000' AND u.xp >= 1000 AND u.email LIKE '%@demo.eduquest.in'
  AND NOT EXISTS (SELECT 1 FROM eduquest_user_achievements ua WHERE ua.user_id = u.id AND ua.achievement_id = a.id);

-- "XP Hunter" (5000 XP)
INSERT INTO eduquest_user_achievements (id, user_id, achievement_id, awarded_at)
SELECT gen_random_uuid(), u.id, a.id, u.created_at + INTERVAL '45 days'
FROM eduquest_users u
CROSS JOIN eduquest_achievements a
WHERE a.slug = 'xp-5000' AND u.xp >= 5000 AND u.email LIKE '%@demo.eduquest.in'
  AND NOT EXISTS (SELECT 1 FROM eduquest_user_achievements ua WHERE ua.user_id = u.id AND ua.achievement_id = a.id);

-- "Getting Started" (3-day streak)
INSERT INTO eduquest_user_achievements (id, user_id, achievement_id, awarded_at)
SELECT gen_random_uuid(), u.id, a.id, u.created_at + INTERVAL '3 days'
FROM eduquest_users u
CROSS JOIN eduquest_achievements a
WHERE a.slug = 'streak-3' AND u.streak >= 3 AND u.email LIKE '%@demo.eduquest.in'
  AND NOT EXISTS (SELECT 1 FROM eduquest_user_achievements ua WHERE ua.user_id = u.id AND ua.achievement_id = a.id);

-- "Week Warrior" (7-day streak)
INSERT INTO eduquest_user_achievements (id, user_id, achievement_id, awarded_at)
SELECT gen_random_uuid(), u.id, a.id, u.created_at + INTERVAL '7 days'
FROM eduquest_users u
CROSS JOIN eduquest_achievements a
WHERE a.slug = 'streak-7' AND u.streak >= 7 AND u.email LIKE '%@demo.eduquest.in'
  AND NOT EXISTS (SELECT 1 FROM eduquest_user_achievements ua WHERE ua.user_id = u.id AND ua.achievement_id = a.id);

-- "Fortnight Fighter" (14-day streak)
INSERT INTO eduquest_user_achievements (id, user_id, achievement_id, awarded_at)
SELECT gen_random_uuid(), u.id, a.id, u.created_at + INTERVAL '14 days'
FROM eduquest_users u
CROSS JOIN eduquest_achievements a
WHERE a.slug = 'streak-14' AND u.streak >= 14 AND u.email LIKE '%@demo.eduquest.in'
  AND NOT EXISTS (SELECT 1 FROM eduquest_user_achievements ua WHERE ua.user_id = u.id AND ua.achievement_id = a.id);

-- "Battle Ready" — everyone with total_battles_played >= 1
INSERT INTO eduquest_user_achievements (id, user_id, achievement_id, awarded_at)
SELECT gen_random_uuid(), u.id, a.id, u.created_at + INTERVAL '2 days'
FROM eduquest_users u
CROSS JOIN eduquest_achievements a
WHERE a.slug = 'first-battle' AND u.total_battles_played >= 1 AND u.email LIKE '%@demo.eduquest.in'
  AND NOT EXISTS (SELECT 1 FROM eduquest_user_achievements ua WHERE ua.user_id = u.id AND ua.achievement_id = a.id);

-- "First Blood" — everyone with total_battles_won >= 1
INSERT INTO eduquest_user_achievements (id, user_id, achievement_id, awarded_at)
SELECT gen_random_uuid(), u.id, a.id, u.created_at + INTERVAL '3 days'
FROM eduquest_users u
CROSS JOIN eduquest_achievements a
WHERE a.slug = 'first-win' AND u.total_battles_won >= 1 AND u.email LIKE '%@demo.eduquest.in'
  AND NOT EXISTS (SELECT 1 FROM eduquest_user_achievements ua WHERE ua.user_id = u.id AND ua.achievement_id = a.id);

-- "Novice" (Level 5)
INSERT INTO eduquest_user_achievements (id, user_id, achievement_id, awarded_at)
SELECT gen_random_uuid(), u.id, a.id, u.created_at + INTERVAL '10 days'
FROM eduquest_users u
CROSS JOIN eduquest_achievements a
WHERE a.slug = 'level-5' AND u.level >= 5 AND u.email LIKE '%@demo.eduquest.in'
  AND NOT EXISTS (SELECT 1 FROM eduquest_user_achievements ua WHERE ua.user_id = u.id AND ua.achievement_id = a.id);

-- "Apprentice" (Level 10)
INSERT INTO eduquest_user_achievements (id, user_id, achievement_id, awarded_at)
SELECT gen_random_uuid(), u.id, a.id, u.created_at + INTERVAL '30 days'
FROM eduquest_users u
CROSS JOIN eduquest_achievements a
WHERE a.slug = 'level-10' AND u.level >= 10 AND u.email LIKE '%@demo.eduquest.in'
  AND NOT EXISTS (SELECT 1 FROM eduquest_user_achievements ua WHERE ua.user_id = u.id AND ua.achievement_id = a.id);

-- "Expert" (Level 20)
INSERT INTO eduquest_user_achievements (id, user_id, achievement_id, awarded_at)
SELECT gen_random_uuid(), u.id, a.id, u.created_at + INTERVAL '90 days'
FROM eduquest_users u
CROSS JOIN eduquest_achievements a
WHERE a.slug = 'level-20' AND u.level >= 20 AND u.email LIKE '%@demo.eduquest.in'
  AND NOT EXISTS (SELECT 1 FROM eduquest_user_achievements ua WHERE ua.user_id = u.id AND ua.achievement_id = a.id);

-- ─── Section 3: Notifications for demo users ──────────────────────────────────
-- Insert welcome + achievement notifications so the bell shows something.

INSERT INTO eduquest_notifications (
  id, user_id, type, title, message, action_url, is_read, created_at
)
SELECT
  gen_random_uuid(),
  u.id,
  'system',
  'Welcome to EduQuest! 🎉',
  'Your account is all set. Start with Class ' ||
    CASE u.track
      WHEN 'class-9'    THEN '9 — pick your first subject'
      WHEN 'class-10'   THEN '10 — start board prep today'
      WHEN 'class-11'   THEN '11 — explore your stream'
      WHEN 'class-12'   THEN '12 — begin board + entrance prep'
      ELSE 'Engineering — choose your first language'
    END,
  '/' || u.track,
  TRUE,
  u.created_at + INTERVAL '1 minute'
FROM eduquest_users u
WHERE u.email LIKE '%@demo.eduquest.in'
  AND NOT EXISTS (
    SELECT 1 FROM eduquest_notifications n
    WHERE n.user_id = u.id AND n.type = 'system' AND n.title LIKE 'Welcome%'
  );

-- XP milestone notification for high-XP users
INSERT INTO eduquest_notifications (id, user_id, type, title, message, action_url, is_read, created_at)
SELECT
  gen_random_uuid(),
  u.id,
  'achievement',
  'Achievement Unlocked: XP Hunter 🏆',
  'You''ve earned over 5,000 XP! You are now in the top learners on the platform.',
  '/dashboard',
  FALSE,
  u.last_active_at - INTERVAL '2 days'
FROM eduquest_users u
WHERE u.xp >= 5000 AND u.email LIKE '%@demo.eduquest.in'
  AND NOT EXISTS (SELECT 1 FROM eduquest_notifications n WHERE n.user_id = u.id AND n.type = 'achievement' AND n.title LIKE '%XP Hunter%');

-- Streak notification for long-streak users
INSERT INTO eduquest_notifications (id, user_id, type, title, message, action_url, is_read, created_at)
SELECT
  gen_random_uuid(),
  u.id,
  'streak',
  'Streak Milestone: ' || u.streak || ' days! 🔥',
  'You''ve maintained a ' || u.streak || '-day streak. You are building an incredible habit!',
  '/dashboard',
  FALSE,
  u.last_active_at - INTERVAL '1 day'
FROM eduquest_users u
WHERE u.streak >= 7 AND u.email LIKE '%@demo.eduquest.in'
  AND NOT EXISTS (SELECT 1 FROM eduquest_notifications n WHERE n.user_id = u.id AND n.type = 'streak');

-- Battle result notification
INSERT INTO eduquest_notifications (id, user_id, type, title, message, action_url, is_read, created_at)
SELECT
  gen_random_uuid(),
  u.id,
  'battle',
  'Battle Won! +50 XP 🗡️',
  'You defeated an opponent in a live battle. Your win rate improved!',
  '/battle',
  TRUE,
  u.last_active_at - INTERVAL '6 hours'
FROM eduquest_users u
WHERE u.total_battles_won >= 1 AND u.email LIKE '%@demo.eduquest.in'
  AND NOT EXISTS (SELECT 1 FROM eduquest_notifications n WHERE n.user_id = u.id AND n.type = 'battle' AND n.title LIKE 'Battle Won%');

-- ─── Section 4: Daily streak rows ────────────────────────────────────────────
-- One row per user in eduquest_daily_streaks (if the table is active).
-- Only insert if not already present.

DO $$
DECLARE
  ds_cols TEXT;
BEGIN
  SELECT string_agg(column_name, ', ') INTO ds_cols
  FROM information_schema.columns
  WHERE table_name = 'eduquest_daily_streaks';

  IF ds_cols IS NOT NULL THEN
    INSERT INTO eduquest_daily_streaks (user_id, active_date, questions_answered)
    SELECT
      u.id,
      CURRENT_DATE,
      FLOOR(RANDOM() * 30 + 5)::INT
    FROM eduquest_users u
    WHERE u.email LIKE '%@demo.eduquest.in'
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ─── Section 5: Wallet transaction history ───────────────────────────────────
-- Add a few credit + debit entries so the wallet page shows real history.

INSERT INTO eduquest_wallet_transactions (id, wallet_id, amount, tx_type, description, balance_after, created_at)
SELECT
  gen_random_uuid(),
  w.id,
  CASE WHEN u.xp >= 5000 THEN 500 WHEN u.xp >= 2000 THEN 200 ELSE 50 END,
  'achievement',
  'XP milestone bonus — stars deposited',
  w.balance,
  u.created_at + INTERVAL '30 days'
FROM eduquest_users u
JOIN eduquest_wallet w ON w.user_id = u.id
WHERE u.email LIKE '%@demo.eduquest.in'
  AND NOT EXISTS (
    SELECT 1 FROM eduquest_wallet_transactions t
    WHERE t.wallet_id = w.id AND t.description LIKE '%milestone%'
  );

INSERT INTO eduquest_wallet_transactions (id, wallet_id, amount, tx_type, description, balance_after, created_at)
SELECT
  gen_random_uuid(),
  w.id,
  50,
  'battle_win',
  'Battle win bonus',
  w.balance,
  u.last_active_at - INTERVAL '1 day'
FROM eduquest_users u
JOIN eduquest_wallet w ON w.user_id = u.id
WHERE u.total_battles_won >= 5 AND u.email LIKE '%@demo.eduquest.in'
  AND NOT EXISTS (
    SELECT 1 FROM eduquest_wallet_transactions t
    WHERE t.wallet_id = w.id AND t.description LIKE '%Battle win%'
  );

