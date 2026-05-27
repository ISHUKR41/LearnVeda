-- ═══════════════════════════════════════════════════════════════
-- Migration 020: Seed realistic notifications + data improvements
-- ═══════════════════════════════════════════════════════════════
-- PURPOSE:
--   1. Seed realistic notifications for existing users so the
--      Notifications page shows real data (not empty state).
--   2. Add more community posts in underrepresented categories.
--   3. Update user streaks to be more varied and realistic.
--
-- VALID notification types (check constraint):
--   level_up | streak | battle | event | achievement | system
--
-- SAFE TO RE-RUN: Uses ON CONFLICT DO NOTHING / WHERE NOT EXISTS guards
-- APPLIED: 2026-05-27
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────
-- SECTION 1: Seed notifications for Admin Tester
-- ─────────────────────────────────────────────────────────────

INSERT INTO eduquest_notifications (user_id, type, title, message, action_url, is_read, created_at)
SELECT
  u.id,
  n.type,
  n.title,
  n.message,
  n.action_url,
  n.is_read,
  NOW() - (n.hours_ago || ' hours')::INTERVAL
FROM eduquest_users u
CROSS JOIN (
  VALUES
    ('level_up',     'Level 12 Achieved!',            'Congratulations! You reached Level 12. You earned +500 Stars as a milestone reward.',            '/wallet',    TRUE,  48),
    ('battle',       'Battle Victory!',               'You defeated Kiran Patel in a Mathematics quiz battle. +75 XP earned.',                         '/battle',    TRUE,  36),
    ('streak',       '30-Day Streak Milestone!',      'Incredible! You maintained a 30-day study streak. Keep up the amazing work!',                   '/dashboard', TRUE,  24),
    ('event',        'JEE Mock Results Available',    'Your JEE Advanced Mock Marathon results are ready. You scored in the top 15%.',                 '/events',    FALSE, 12),
    ('system',       'New Feature: Activity Graph',   'Your 12-week activity heatmap is now live in the dashboard. Check your study patterns.',        '/dashboard', FALSE, 4)
) AS n(type, title, message, action_url, is_read, hours_ago)
WHERE (u.name = 'Admin Tester' OR u.email LIKE 'admin%')
  AND NOT EXISTS (
    SELECT 1 FROM eduquest_notifications en WHERE en.user_id = u.id AND en.title = 'Level 12 Achieved!'
  )
LIMIT 5;

-- ─────────────────────────────────────────────────────────────
-- SECTION 2: Seed notifications for Kiran Patel
-- ─────────────────────────────────────────────────────────────

INSERT INTO eduquest_notifications (user_id, type, title, message, action_url, is_read, created_at)
SELECT
  u.id,
  n.type,
  n.title,
  n.message,
  n.action_url,
  n.is_read,
  NOW() - (n.hours_ago || ' hours')::INTERVAL
FROM eduquest_users u
CROSS JOIN (
  VALUES
    ('level_up',     'Level 29 Reached!',             'You hit Level 29! Stars wagering limit increased. Keep climbing!',                              '/wallet',    TRUE,  72),
    ('battle',       'Battle Challenge Received',      'Priya Sharma challenged you to a Physics quiz battle. Accept within 24 hours.',                '/battle',    FALSE, 6),
    ('streak',       '7-Day Streak!',                 'One week of consistent studying! You earned +50 bonus XP.',                                    '/dashboard', TRUE,  48),
    ('event',        'Event Registration Confirmed',   'You are registered for the JEE Advanced Mock Marathon on June 20, 2026.',                      '/events',    TRUE,  120),
    ('achievement',  'Community Post Trending',        'Your post received 25+ upvotes! A "Top Contributor" badge has been added to your profile.',    '/community', FALSE, 2)
) AS n(type, title, message, action_url, is_read, hours_ago)
WHERE u.name = 'Kiran Patel'
  AND NOT EXISTS (
    SELECT 1 FROM eduquest_notifications en WHERE en.user_id = u.id AND en.title = 'Level 29 Reached!'
  )
LIMIT 5;

-- ─────────────────────────────────────────────────────────────
-- SECTION 3: Seed notifications for Priya Sharma
-- ─────────────────────────────────────────────────────────────

INSERT INTO eduquest_notifications (user_id, type, title, message, action_url, is_read, created_at)
SELECT
  u.id,
  n.type,
  n.title,
  n.message,
  n.action_url,
  n.is_read,
  NOW() - (n.hours_ago || ' hours')::INTERVAL
FROM eduquest_users u
CROSS JOIN (
  VALUES
    ('battle',       'You Won! +120 XP',              'You defeated Rahul Mehta in a Class 12 Physics quiz. Battle rating increased.',                '/battle',    TRUE,  18),
    ('level_up',     'Level 25 — Scholar Badge!',     'You reached Level 25! The "Scholar" badge is now on your profile.',                           '/profile',   TRUE,  36),
    ('event',        'NEET Biology Olympiad Reminder','The NEET Biology Olympiad is in 3 days. Make sure you are fully prepared!',                   '/events',    FALSE, 8),
    ('achievement',  'Your Post Got 50 Likes!',       'Your study strategy post crossed 50 likes — great community contribution!',                   '/community', FALSE, 1),
    ('streak',       '14-Day Streak Achieved!',       'Two weeks of daily studying. You earned +100 bonus XP and a streak shield.',                  '/dashboard', TRUE,  60)
) AS n(type, title, message, action_url, is_read, hours_ago)
WHERE u.name = 'Priya Sharma'
  AND NOT EXISTS (
    SELECT 1 FROM eduquest_notifications en WHERE en.user_id = u.id AND en.title = 'You Won! +120 XP'
  )
LIMIT 5;

-- ─────────────────────────────────────────────────────────────
-- SECTION 4: Seed notifications for Rahul Mehta
-- ─────────────────────────────────────────────────────────────

INSERT INTO eduquest_notifications (user_id, type, title, message, action_url, is_read, created_at)
SELECT
  u.id,
  n.type,
  n.title,
  n.message,
  n.action_url,
  n.is_read,
  NOW() - (n.hours_ago || ' hours')::INTERVAL
FROM eduquest_users u
CROSS JOIN (
  VALUES
    ('system',       'Welcome to EduQuest!',           'Your account is set up. Start your first session to earn XP and begin your streak.',          '/class-10',  TRUE,  200),
    ('battle',       'Battle Invitation',              'Kartik Anand challenged you to a Mathematics battle. Check the battle arena!',               '/battle',    FALSE, 10),
    ('event',        'Science Olympiad Confirmed',     'Registration confirmed for the Science Olympiad Qualifier on May 24, 2026.',                  '/events',    TRUE,  96),
    ('level_up',     'Level 8 Achieved',              'You reached Level 8. Two more levels to unlock Stars wagering in battles!',                   '/wallet',    TRUE,  168),
    ('streak',       'Streak at Risk!',               'You have not studied today. Complete at least one question to keep your streak alive.',       '/dashboard', FALSE, 3)
) AS n(type, title, message, action_url, is_read, hours_ago)
WHERE u.name = 'Rahul Mehta'
  AND NOT EXISTS (
    SELECT 1 FROM eduquest_notifications en WHERE en.user_id = u.id AND en.title = 'Welcome to EduQuest!'
  )
LIMIT 5;

-- ─────────────────────────────────────────────────────────────
-- SECTION 5: Seed notifications for Kartik Anand
-- ─────────────────────────────────────────────────────────────

INSERT INTO eduquest_notifications (user_id, type, title, message, action_url, is_read, created_at)
SELECT
  u.id,
  n.type,
  n.title,
  n.message,
  n.action_url,
  n.is_read,
  NOW() - (n.hours_ago || ' hours')::INTERVAL
FROM eduquest_users u
CROSS JOIN (
  VALUES
    ('level_up',     'Level 27 — Top 5%!',            'You are in the top 5% of all EduQuest learners by level. Keep pushing!',                     '/leaderboard',TRUE,  48),
    ('battle',       'Rematch Request',               'Kiran Patel wants a rematch in the DSA coding challenge. Ready?',                             '/battle',    FALSE, 5),
    ('event',        'Python Championship — 2 Days',  'The Python Coding Championship starts in 2 days. Review recursion and dynamic programming.',  '/events',    FALSE, 12),
    ('achievement',  'New Reply on Your Post',        'Priya Sharma replied to your JEE vs NEET discussion with a detailed perspective.',            '/community', FALSE, 1),
    ('streak',       '21-Day Streak!',               '3 weeks of consistent studying. A streak shield has been added to your account.',              '/dashboard', TRUE,  72)
) AS n(type, title, message, action_url, is_read, hours_ago)
WHERE u.name = 'Kartik Anand'
  AND NOT EXISTS (
    SELECT 1 FROM eduquest_notifications en WHERE en.user_id = u.id AND en.title = 'Level 27 — Top 5%!'
  )
LIMIT 5;

-- ─────────────────────────────────────────────────────────────
-- SECTION 6: 6 new community posts (career-advice, engineering, battle)
-- ─────────────────────────────────────────────────────────────

INSERT INTO eduquest_community_posts (
  id, author_name, title, body, tags, likes, comments, views, created_at
) VALUES

(gen_random_uuid(), 'Aditya Kumar',
 'Complete roadmap: Class 10 → IIT in 5 years',
 'I cracked JEE Advanced after 5 years of planned preparation starting from Class 10. Here is the exact roadmap: Class 10 — build strong basics in Math and Science, do NOT skip NCERT. Class 11 — start Physics mechanics and Math calculus simultaneously, minimum 4 hours/day. Class 12 — add Chemistry inorganic in July, ramp to 8+ hours by November. Mock tests: start full mocks 6 months before. Result: AIR 847. Ask me anything.',
 ARRAY['CAREER-ADVICE', 'JEE', 'ROADMAP', 'CLASS-10'],
 89, 34, 2100,
 NOW() - INTERVAL '5 days'),

(gen_random_uuid(), 'Sneha Reddy',
 'How I went from 45% in Class 11 to 91% in Class 12 boards',
 'Class 11 was rough — I scored 45% in the first terminal exam. But I changed 3 things: 1. Stopped taking notes during class and started listening fully instead. 2. Solved every NCERT example before touching reference books. 3. Made 2-page summary sheets for each chapter and reviewed them weekly. Physics was weakest — Derek Owens videos for conceptual clarity alongside NCERT. Board result: 91.6%. You can turn it around.',
 ARRAY['BOARDS', 'CLASS-12', 'STRATEGY', 'SCIENCE'],
 112, 41, 2780,
 NOW() - INTERVAL '3 days'),

(gen_random_uuid(), 'Vikram Singh',
 'Why learning DSA changed how I think — not just code',
 'I spent 3 months grinding problems without understanding. Then I started learning the theory: why merge sort beats bubble sort, when to use a hash map vs a BST, why BFS vs DFS. That shift changed everything. Now I can look at any problem and quickly identify which data structure and algorithm family applies. DSA is not about memorizing patterns. It is about building a mental model for problem decomposition.',
 ARRAY['ENGINEERING', 'DSA', 'ALGORITHMS', 'CAREER-ADVICE'],
 156, 58, 3420,
 NOW() - INTERVAL '2 days'),

(gen_random_uuid(), 'Tanya Mishra',
 'My Python journey: zero to building a full web scraper in 30 days',
 'I had never written a single line of code before the EduQuest Python track. 30 days later I built a working web scraper. Day 1-7: variables, loops, functions. Day 8-15: lists, dicts, string manipulation. Day 16-22: file I/O, error handling, modules. Day 23-30: requests library, BeautifulSoup, CSV export. The key was doing exercises every single day, even when I felt like skipping. Consistency beats intensity.',
 ARRAY['ENGINEERING', 'PYTHON', 'BEGINNER', 'CODING'],
 98, 29, 1850,
 NOW() - INTERVAL '1 day'),

(gen_random_uuid(), 'Arjun Sharma',
 'How to consistently win battles — psychology and speed tricks',
 'I have a 73% win rate across 200+ EduQuest battles. My approach: 1. Always pick your strongest subject — do not practice a weak subject in battles, you will lose. 2. Read the question once fast, then answer immediately. Re-reading wastes seconds. 3. Skip and return — if you are stuck after 5 seconds, flag and move on. A partial score beats zero from running out of time. 4. Breathe once before each question. Anxiety kills reaction time.',
 ARRAY['BATTLE', 'STRATEGY', 'TIPS', 'COMPETITIVE'],
 143, 67, 3100,
 NOW() - INTERVAL '6 hours'),

(gen_random_uuid(), 'Meera Nair',
 'The Feynman technique transformed my Physics understanding',
 'I used to memorize formulas without understanding. Physics was a collection of equations I would forget. The Feynman technique changed that: explain a concept (e.g. conservation of momentum) out loud as if teaching a 10-year-old. When you get stuck, that is your real gap. Go back to NCERT and learn just that part. Then explain again. I applied this to every chapter in Class 11 Physics. Scores: 58% to 88% in one term.',
 ARRAY['STUDY-TIPS', 'PHYSICS', 'CLASS-11', 'TECHNIQUE'],
 134, 48, 2650,
 NOW() - INTERVAL '4 hours')

ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- SECTION 7: Update streaks for known seed users
-- ─────────────────────────────────────────────────────────────

UPDATE eduquest_users
SET
  streak = CASE
    WHEN name = 'Admin Tester' THEN 30
    WHEN name = 'Kiran Patel'  THEN 21
    WHEN name = 'Priya Sharma' THEN 14
    WHEN name = 'Kartik Anand' THEN 18
    WHEN name = 'Rahul Mehta'  THEN 7
    ELSE streak
  END,
  last_active_at = NOW() - (RANDOM() * INTERVAL '6 hours')
WHERE name IN ('Admin Tester', 'Kiran Patel', 'Priya Sharma', 'Kartik Anand', 'Rahul Mehta');

-- ─────────────────────────────────────────────────────────────
-- SECTION 8: Track the migration
-- ─────────────────────────────────────────────────────────────

INSERT INTO eduquest_schema_migrations (version, description)
VALUES ('020', 'Seed realistic notifications + 6 new community posts + streak updates')
ON CONFLICT (version) DO NOTHING;
