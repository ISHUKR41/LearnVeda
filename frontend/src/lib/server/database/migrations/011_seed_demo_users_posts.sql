-- =============================================================================
-- Migration 011: Seed demo users, community posts, and wallet records.
--
-- PURPOSE:
--   Populates the platform with realistic demo data so the leaderboard,
--   community feed, and dashboard all show real content to new visitors.
--
-- IDEMPOTENT: Uses INSERT ... ON CONFLICT DO NOTHING throughout.
-- REVERSIBLE: Delete from the seeded rows by email in case of rollback.
--
-- TABLES AFFECTED:
--   eduquest_users           — 12 demo students across all tracks
--   eduquest_community_posts — 10 seeded discussion threads
--   eduquest_wallet          — one wallet per demo user
--
-- ACTUAL COLUMN STRUCTURE (verified from DB):
--   eduquest_users: id, name, email, password_hash, track, role, level, xp,
--     streak, created_at, stars_balance, longest_streak, last_active_at,
--     avatar_url, bio, subscription_status, total_battles_won, total_battles_played
--   eduquest_community_posts: id, author_id, author_name, title, body, tags,
--     likes, comments, views, created_at, search_vector
--
-- LAST UPDATED: 2026-05-25
-- =============================================================================

-- ─── Section 1: Demo users ───────────────────────────────────────────────────
--
-- 12 students spread across all tracks with varied XP, streak, and level.
-- password_hash is a placeholder — demo accounts cannot sign in.

INSERT INTO eduquest_users (
  id,
  name,
  email,
  password_hash,
  track,
  xp,
  level,
  streak,
  longest_streak,
  stars_balance,
  total_battles_won,
  total_battles_played,
  role,
  last_active_at,
  created_at
)
VALUES
  (gen_random_uuid(), 'Aarav Sharma',   'aarav.sharma@demo.eduquest.in',   'placeholder', 'class-12',    8450, 22, 47, 62, 2400, 34, 51, 'student', NOW() - INTERVAL '2 hours',   NOW() - INTERVAL '180 days'),
  (gen_random_uuid(), 'Priya Patel',    'priya.patel@demo.eduquest.in',    'placeholder', 'engineering', 7820, 21, 62, 87, 1600, 28, 44, 'student', NOW() - INTERVAL '4 hours',   NOW() - INTERVAL '200 days'),
  (gen_random_uuid(), 'Rahul Gupta',    'rahul.gupta@demo.eduquest.in',    'placeholder', 'class-11',    7200, 19, 35, 48, 1350, 21, 39, 'student', NOW() - INTERVAL '1 hour',    NOW() - INTERVAL '160 days'),
  (gen_random_uuid(), 'Sneha Reddy',    'sneha.reddy@demo.eduquest.in',    'placeholder', 'class-10',    6580, 18, 28, 41, 1100, 18, 32, 'student', NOW() - INTERVAL '6 hours',   NOW() - INTERVAL '140 days'),
  (gen_random_uuid(), 'Arjun Nair',     'arjun.nair@demo.eduquest.in',     'placeholder', 'engineering', 5990, 17, 21, 35, 900,  15, 28, 'student', NOW() - INTERVAL '3 hours',   NOW() - INTERVAL '120 days'),
  (gen_random_uuid(), 'Ananya Singh',   'ananya.singh@demo.eduquest.in',   'placeholder', 'class-12',    5450, 16, 19, 27, 780,  12, 24, 'student', NOW() - INTERVAL '8 hours',   NOW() - INTERVAL '110 days'),
  (gen_random_uuid(), 'Vikram Mehta',   'vikram.mehta@demo.eduquest.in',   'placeholder', 'class-9',     4800, 14, 78, 78, 650,  9,  19, 'student', NOW() - INTERVAL '30 minutes',NOW() - INTERVAL '100 days'),
  (gen_random_uuid(), 'Kavya Iyer',     'kavya.iyer@demo.eduquest.in',     'placeholder', 'class-11',    4200, 13, 14, 22, 520,  7,  16, 'student', NOW() - INTERVAL '12 hours',  NOW() - INTERVAL '90 days'),
  (gen_random_uuid(), 'Rohan Kapoor',   'rohan.kapoor@demo.eduquest.in',   'placeholder', 'class-10',    3650, 11, 9,  16, 380,  5,  14, 'student', NOW() - INTERVAL '1 day',     NOW() - INTERVAL '80 days'),
  (gen_random_uuid(), 'Divya Krishnan', 'divya.krishnan@demo.eduquest.in', 'placeholder', 'engineering', 3100, 10, 5,  12, 290,  4,  11, 'student', NOW() - INTERVAL '2 days',    NOW() - INTERVAL '70 days'),
  (gen_random_uuid(), 'Aditya Joshi',   'aditya.joshi@demo.eduquest.in',   'placeholder', 'class-9',     1850, 7,  3,  9,  160,  2,  7,  'student', NOW() - INTERVAL '3 days',    NOW() - INTERVAL '45 days'),
  (gen_random_uuid(), 'Meera Bansal',   'meera.bansal@demo.eduquest.in',   'placeholder', 'class-12',    950,  4,  1,  4,  80,   1,  4,  'student', NOW() - INTERVAL '5 days',    NOW() - INTERVAL '30 days')
ON CONFLICT (email) DO NOTHING;

-- ─── Section 2: Community posts ──────────────────────────────────────────────
--
-- 10 realistic discussion posts. No updated_at column exists.
-- author_id is NULL so posts display even before users create accounts.

INSERT INTO eduquest_community_posts (
  id,
  title,
  body,
  author_name,
  author_id,
  tags,
  likes,
  comments,
  views,
  created_at
)
VALUES
  (
    gen_random_uuid(),
    'How do I solve quadratic equations quickly in Class 10?',
    'I keep making errors with the discriminant formula. Is there a faster mental method to check if roots are real? I''ve tried factoring but some questions don''t factor nicely.',
    'Sneha Reddy', NULL, ARRAY['class-10', 'mathematics', 'algebra'],
    24, 8, 312, NOW() - INTERVAL '3 days'
  ),
  (
    gen_random_uuid(),
    'Best resources for JEE Physics — Waves and Optics?',
    'Class 12 student here. I''ve finished NCERT but need something more challenging for JEE Main. Is HC Verma enough or should I go for DC Pandey? Does EduQuest have JEE-level questions?',
    'Aarav Sharma', NULL, ARRAY['class-12', 'physics', 'jee', 'entrance'],
    41, 15, 587, NOW() - INTERVAL '5 days'
  ),
  (
    gen_random_uuid(),
    'Tips for mastering Data Structures in C++?',
    'I''m on Day 18 of the Engineering DSA track. Trees are clicking but I''m struggling with graph traversal (BFS/DFS). Any visualisation tools that helped you? I find it hard to trace the recursion stack mentally.',
    'Arjun Nair', NULL, ARRAY['engineering', 'dsa', 'cpp', 'graphs'],
    38, 12, 445, NOW() - INTERVAL '7 days'
  ),
  (
    gen_random_uuid(),
    'Class 9 Science — How to remember the periodic table?',
    'First year student here. We need to memorise the first 20 elements for CBSE. Any mnemonic tricks that actually work? I keep forgetting the order after Calcium.',
    'Aditya Joshi', NULL, ARRAY['class-9', 'science', 'chemistry'],
    19, 22, 298, NOW() - INTERVAL '2 days'
  ),
  (
    gen_random_uuid(),
    'Accountancy vs Economics for Commerce Class 11 — which is harder?',
    'I just picked Commerce stream and I''m unsure where to focus first. Everyone says Accountancy needs daily practice but Economics is easier to score. What has been your experience?',
    'Kavya Iyer', NULL, ARRAY['class-11', 'commerce', 'accountancy', 'economics'],
    16, 9, 201, NOW() - INTERVAL '4 days'
  ),
  (
    gen_random_uuid(),
    'How to use Python for competitive programming — is it fast enough?',
    'I battle in the Engineering category and always lose to C++ users on speed. Is Python viable for competitive programming or should I switch? I know Python well but TLE kills me on graph problems.',
    'Priya Patel', NULL, ARRAY['engineering', 'python', 'competitive-programming', 'battle'],
    52, 18, 634, NOW() - INTERVAL '8 days'
  ),
  (
    gen_random_uuid(),
    'Battle Arena strategy: How to prepare for Class 12 Physics battles?',
    'I''ve been losing most battles in Physics. My accuracy is ~65% but I run out of time on every question. Should I focus on speed or accuracy first? Does matchmaking consider previous battle history?',
    'Ananya Singh', NULL, ARRAY['battle', 'class-12', 'physics', 'strategy'],
    29, 11, 389, NOW() - INTERVAL '6 days'
  ),
  (
    gen_random_uuid(),
    'CBSE Class 10 Board tips — Maths 35/35 strategy',
    'I scored 35/35 last year. My approach: 1) NCERT + NCERT Exemplar cover 90% of patterns. 2) Time allocation — scan all internal choices first (15 min). 3) Show all steps even for MCQs to get method marks.',
    'Rohan Kapoor', NULL, ARRAY['class-10', 'board-exam', 'mathematics', 'tips'],
    73, 31, 1204, NOW() - INTERVAL '10 days'
  ),
  (
    gen_random_uuid(),
    'System Design for freshers — where to start?',
    'Final year CS student, going for placements. System Design rounds feel overwhelming. I''ve watched videos but they assume deep database knowledge. What order should I learn things? Is the EduQuest System Design track right for beginners?',
    'Divya Krishnan', NULL, ARRAY['engineering', 'system-design', 'placements', 'cs-fundamentals'],
    44, 20, 521, NOW() - INTERVAL '11 days'
  ),
  (
    gen_random_uuid(),
    'Streak recovery — is there a streak freeze feature?',
    'I had a 47-day streak going and missed yesterday because of a power outage. Is there a way to recover it? Many apps have streak freezes for emergencies. Would love to see this feature in EduQuest!',
    'Vikram Mehta', NULL, ARRAY['general', 'streaks', 'feature-request'],
    61, 14, 478, NOW() - INTERVAL '1 day'
  )
ON CONFLICT DO NOTHING;

-- ─── Section 3: Wallet rows for demo users ───────────────────────────────────
--
-- Create wallet records linked to the demo users by their email.
-- Stars balance is proportional to XP earned.

INSERT INTO eduquest_wallet (user_id, balance, total_earned, total_spent)
SELECT
  u.id,
  CASE
    WHEN u.xp >= 7000 THEN 2400
    WHEN u.xp >= 5000 THEN 1600
    WHEN u.xp >= 3000 THEN 900
    WHEN u.xp >= 1000 THEN 400
    ELSE 100
  END AS balance,
  CASE
    WHEN u.xp >= 7000 THEN 3200
    WHEN u.xp >= 5000 THEN 2100
    WHEN u.xp >= 3000 THEN 1200
    WHEN u.xp >= 1000 THEN 550
    ELSE 150
  END AS total_earned,
  CASE
    WHEN u.xp >= 7000 THEN 800
    WHEN u.xp >= 5000 THEN 500
    WHEN u.xp >= 3000 THEN 300
    WHEN u.xp >= 1000 THEN 150
    ELSE 50
  END AS total_spent
FROM eduquest_users u
WHERE u.email LIKE '%@demo.eduquest.in'
  AND NOT EXISTS (
    SELECT 1 FROM eduquest_wallet w WHERE w.user_id = u.id
  );
