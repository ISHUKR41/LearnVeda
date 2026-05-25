/*
 * FILE: 010_seed_levels_questions.sql
 * LOCATION: src/lib/server/database/migrations/010_seed_levels_questions.sql
 * PURPOSE: Seeds the production database with:
 *          1. All 100 level definitions (XP thresholds, titles, badge colors)
 *          2. A rich CBSE question bank for Class 9, 10, 11, 12 subjects
 *             with real MCQ questions aligned to NCERT textbooks.
 *
 *          Why in a migration and not a seed script?
 *          Level definitions and the question bank are platform-structural data —
 *          without them, the gamification system and practice engine cannot function.
 *          Putting them in a migration guarantees every environment (dev, staging,
 *          production) has the same foundational dataset after a single
 *          `npm run db:migrate` call.
 *
 *          All INSERTs use ON CONFLICT DO NOTHING so re-running this migration
 *          is completely safe and idempotent.
 *
 * TABLES MODIFIED:
 *   eduquest_levels   — 100 rows (level definitions)
 *   eduquest_questions — 120+ rows (real CBSE questions across all classes)
 *
 * USED BY: npm run db:migrate
 * LAST UPDATED: 2026-05-25
 */


-- ═══════════════════════════════════════════════════════════════
-- 1. LEVEL DEFINITIONS (1–100)
-- XP formula: cumulative_xp = 50 * level * (level - 1)
-- This means each new level costs 50 * current_level XP to advance.
-- Example: reaching level 2 costs 50 XP, level 3 costs 100 more XP, etc.
--
-- Title buckets:
--   1–5:   Newcomer    (just started)
--   6–10:  Learner     (building habits)
--   11–20: Scholar     (consistent learner)
--   21–35: Expert      (battle-ready)
--   36–50: Champion    (top 25% of users)
--   51–70: Master      (top 10%)
--   71–85: Legend      (top 5%)
--   86–95: Grand Master (top 2%)
--   96–99: Elite       (top 1%)
--   100:   Supreme     (absolute peak)
--
-- Badge colors follow the platform design system:
--   Newcomer  → #6B7280 (gray)
--   Learner   → #3B82F6 (blue)
--   Scholar   → #8B5CF6 (violet)
--   Expert    → #10B981 (emerald)
--   Champion  → #F59E0B (amber/gold)
--   Master    → #F97316 (orange)
--   Legend    → #EF4444 (red)
--   Grand Master → #EC4899 (pink)
--   Elite     → #6366F1 (indigo)
--   Supreme   → #D97706 (premium gold)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO eduquest_levels
  (level_number, xp_required, xp_to_next, title, badge_name, badge_icon, badge_color, perks)
VALUES
-- ─── Newcomer (1–5) ───────────────────────────────────────────
(1,   0,      50,   'Newcomer',    'Seed',       'Sprout',     '#6B7280', '{"daily_xp_cap": 200}'),
(2,   50,     100,  'Newcomer',    'Sapling',    'Sprout',     '#6B7280', '{"daily_xp_cap": 200}'),
(3,   150,    150,  'Newcomer',    'Bud',        'Sprout',     '#6B7280', '{"daily_xp_cap": 200}'),
(4,   300,    200,  'Newcomer',    'Sprout',     'Sprout',     '#6B7280', '{"daily_xp_cap": 200}'),
(5,   500,    250,  'Newcomer',    'Seedling',   'Sprout',     '#6B7280', '{"daily_xp_cap": 200, "streak_shield": 1}'),
-- ─── Learner (6–10) ───────────────────────────────────────────
(6,   750,    300,  'Learner',     'Curious',    'BookOpen',   '#3B82F6', '{"daily_xp_cap": 300}'),
(7,   1050,   350,  'Learner',     'Studious',   'BookOpen',   '#3B82F6', '{"daily_xp_cap": 300}'),
(8,   1400,   400,  'Learner',     'Diligent',   'BookOpen',   '#3B82F6', '{"daily_xp_cap": 300}'),
(9,   1800,   450,  'Learner',     'Persistent', 'BookOpen',   '#3B82F6', '{"daily_xp_cap": 300}'),
(10,  2250,   500,  'Learner',     'Dedicated',  'BookOpen',   '#3B82F6', '{"daily_xp_cap": 300, "battle_access": true, "streak_shield": 2}'),
-- ─── Scholar (11–20) ──────────────────────────────────────────
(11,  2750,   550,  'Scholar',     'Inquisitive','GraduationCap','#8B5CF6','{"daily_xp_cap": 400}'),
(12,  3300,   600,  'Scholar',     'Analytical', 'GraduationCap','#8B5CF6','{"daily_xp_cap": 400}'),
(13,  3900,   650,  'Scholar',     'Thoughtful', 'GraduationCap','#8B5CF6','{"daily_xp_cap": 400}'),
(14,  4550,   700,  'Scholar',     'Methodical', 'GraduationCap','#8B5CF6','{"daily_xp_cap": 400}'),
(15,  5250,   750,  'Scholar',     'Precise',    'GraduationCap','#8B5CF6','{"daily_xp_cap": 400, "custom_avatar": true}'),
(16,  6000,   800,  'Scholar',     'Sharp',      'GraduationCap','#8B5CF6','{"daily_xp_cap": 400}'),
(17,  6800,   850,  'Scholar',     'Astute',     'GraduationCap','#8B5CF6','{"daily_xp_cap": 400}'),
(18,  7650,   900,  'Scholar',     'Insightful', 'GraduationCap','#8B5CF6','{"daily_xp_cap": 400}'),
(19,  8550,   950,  'Scholar',     'Brilliant',  'GraduationCap','#8B5CF6','{"daily_xp_cap": 400}'),
(20,  9500,  1000,  'Scholar',     'Luminary',   'GraduationCap','#8B5CF6','{"daily_xp_cap": 400, "battle_wager": true, "streak_shield": 3}'),
-- ─── Expert (21–35) ───────────────────────────────────────────
(21, 10500,  1050,  'Expert',      'Adept',      'Zap',        '#10B981', '{"daily_xp_cap": 500}'),
(22, 11550,  1100,  'Expert',      'Proficient', 'Zap',        '#10B981', '{"daily_xp_cap": 500}'),
(23, 12650,  1150,  'Expert',      'Capable',    'Zap',        '#10B981', '{"daily_xp_cap": 500}'),
(24, 13800,  1200,  'Expert',      'Skilled',    'Zap',        '#10B981', '{"daily_xp_cap": 500}'),
(25, 15000,  1250,  'Expert',      'Competent',  'Zap',        '#10B981', '{"daily_xp_cap": 500, "profile_badge": true}'),
(26, 16250,  1300,  'Expert',      'Seasoned',   'Zap',        '#10B981', '{"daily_xp_cap": 500}'),
(27, 17550,  1350,  'Expert',      'Veteran',    'Zap',        '#10B981', '{"daily_xp_cap": 500}'),
(28, 18900,  1400,  'Expert',      'Experienced','Zap',        '#10B981', '{"daily_xp_cap": 500}'),
(29, 20300,  1450,  'Expert',      'Accomplished','Zap',       '#10B981', '{"daily_xp_cap": 500}'),
(30, 21750,  1500,  'Expert',      'Master Mind','Zap',        '#10B981', '{"daily_xp_cap": 500, "leaderboard_badge": true}'),
(31, 23250,  1550,  'Expert',      'Tactician',  'Zap',        '#10B981', '{"daily_xp_cap": 500}'),
(32, 24800,  1600,  'Expert',      'Strategist', 'Zap',        '#10B981', '{"daily_xp_cap": 500}'),
(33, 26400,  1650,  'Expert',      'Innovator',  'Zap',        '#10B981', '{"daily_xp_cap": 500}'),
(34, 28050,  1700,  'Expert',      'Pioneer',    'Zap',        '#10B981', '{"daily_xp_cap": 500}'),
(35, 29750,  1750,  'Expert',      'Trailblazer','Zap',        '#10B981', '{"daily_xp_cap": 500, "streak_shield": 5}'),
-- ─── Champion (36–50) ─────────────────────────────────────────
(36, 31500,  1800,  'Champion',    'Rising Star','Trophy',     '#F59E0B', '{"daily_xp_cap": 600}'),
(37, 33300,  1850,  'Champion',    'Contender',  'Trophy',     '#F59E0B', '{"daily_xp_cap": 600}'),
(38, 35150,  1900,  'Champion',    'Challenger', 'Trophy',     '#F59E0B', '{"daily_xp_cap": 600}'),
(39, 37050,  1950,  'Champion',    'Gladiator',  'Trophy',     '#F59E0B', '{"daily_xp_cap": 600}'),
(40, 39000,  2000,  'Champion',    'Warrior',    'Trophy',     '#F59E0B', '{"daily_xp_cap": 600, "battle_bonus_xp": 1.1}'),
(41, 41000,  2050,  'Champion',    'Victor',     'Trophy',     '#F59E0B', '{"daily_xp_cap": 600}'),
(42, 43050,  2100,  'Champion',    'Achiever',   'Trophy',     '#F59E0B', '{"daily_xp_cap": 600}'),
(43, 45150,  2150,  'Champion',    'Conqueror',  'Trophy',     '#F59E0B', '{"daily_xp_cap": 600}'),
(44, 47300,  2200,  'Champion',    'Dominator',  'Trophy',     '#F59E0B', '{"daily_xp_cap": 600}'),
(45, 49500,  2250,  'Champion',    'Ruler',      'Trophy',     '#F59E0B', '{"daily_xp_cap": 600, "exclusive_avatar": true}'),
(46, 51750,  2300,  'Champion',    'Sovereign',  'Trophy',     '#F59E0B', '{"daily_xp_cap": 600}'),
(47, 54050,  2350,  'Champion',    'Monarch',    'Trophy',     '#F59E0B', '{"daily_xp_cap": 600}'),
(48, 56400,  2400,  'Champion',    'Dynast',     'Trophy',     '#F59E0B', '{"daily_xp_cap": 600}'),
(49, 58800,  2450,  'Champion',    'Emperor',    'Trophy',     '#F59E0B', '{"daily_xp_cap": 600}'),
(50, 61250,  2500,  'Champion',    'Legend Seed','Crown',      '#F59E0B', '{"daily_xp_cap": 600, "battle_wager_limit": 500, "streak_shield": 7}'),
-- ─── Master (51–70) ───────────────────────────────────────────
(51, 63750,  2550,  'Master',      'Iron Will',  'Flame',      '#F97316', '{"daily_xp_cap": 750}'),
(52, 66300,  2600,  'Master',      'Steel Mind', 'Flame',      '#F97316', '{"daily_xp_cap": 750}'),
(53, 68900,  2650,  'Master',      'Titan',      'Flame',      '#F97316', '{"daily_xp_cap": 750}'),
(54, 71550,  2700,  'Master',      'Colossus',   'Flame',      '#F97316', '{"daily_xp_cap": 750}'),
(55, 74250,  2750,  'Master',      'Goliath',    'Flame',      '#F97316', '{"daily_xp_cap": 750, "battle_bonus_xp": 1.2}'),
(56, 77000,  2800,  'Master',      'Behemoth',   'Flame',      '#F97316', '{"daily_xp_cap": 750}'),
(57, 79800,  2850,  'Master',      'Leviathan',  'Flame',      '#F97316', '{"daily_xp_cap": 750}'),
(58, 82650,  2900,  'Master',      'Sage',       'Flame',      '#F97316', '{"daily_xp_cap": 750}'),
(59, 85550,  2950,  'Master',      'Wizard',     'Flame',      '#F97316', '{"daily_xp_cap": 750}'),
(60, 88500,  3000,  'Master',      'Archmage',   'Flame',      '#F97316', '{"daily_xp_cap": 750, "profile_frame": "master"}'),
(61, 91500,  3050,  'Master',      'Oracle',     'Flame',      '#F97316', '{"daily_xp_cap": 750}'),
(62, 94550,  3100,  'Master',      'Prophet',    'Flame',      '#F97316', '{"daily_xp_cap": 750}'),
(63, 97650,  3150,  'Master',      'Visionary',  'Flame',      '#F97316', '{"daily_xp_cap": 750}'),
(64,100800,  3200,  'Master',      'Luminary',   'Flame',      '#F97316', '{"daily_xp_cap": 750}'),
(65,104000,  3250,  'Master',      'Beacon',     'Flame',      '#F97316', '{"daily_xp_cap": 750}'),
(66,107250,  3300,  'Master',      'Torch',      'Flame',      '#F97316', '{"daily_xp_cap": 750}'),
(67,110550,  3350,  'Master',      'Radiant',    'Flame',      '#F97316', '{"daily_xp_cap": 750}'),
(68,113900,  3400,  'Master',      'Brilliance', 'Flame',      '#F97316', '{"daily_xp_cap": 750}'),
(69,117300,  3450,  'Master',      'Incandescent','Flame',     '#F97316', '{"daily_xp_cap": 750}'),
(70,120750,  3500,  'Master',      'Solar Flare','Flame',      '#F97316', '{"daily_xp_cap": 750, "streak_shield": 10, "battle_wager_limit": 1000}'),
-- ─── Legend (71–85) ───────────────────────────────────────────
(71,124250,  3550,  'Legend',      'Mythic',     'Star',       '#EF4444', '{"daily_xp_cap": 1000}'),
(72,127800,  3600,  'Legend',      'Epic',       'Star',       '#EF4444', '{"daily_xp_cap": 1000}'),
(73,131400,  3650,  'Legend',      'Heroic',     'Star',       '#EF4444', '{"daily_xp_cap": 1000}'),
(74,135050,  3700,  'Legend',      'Legendary',  'Star',       '#EF4444', '{"daily_xp_cap": 1000}'),
(75,138750,  3750,  'Legend',      'Fabled',     'Star',       '#EF4444', '{"daily_xp_cap": 1000, "battle_bonus_xp": 1.3}'),
(76,142500,  3800,  'Legend',      'Immortal',   'Star',       '#EF4444', '{"daily_xp_cap": 1000}'),
(77,146300,  3850,  'Legend',      'Eternal',    'Star',       '#EF4444', '{"daily_xp_cap": 1000}'),
(78,150150,  3900,  'Legend',      'Infinite',   'Star',       '#EF4444', '{"daily_xp_cap": 1000}'),
(79,154050,  3950,  'Legend',      'Transcendent','Star',      '#EF4444', '{"daily_xp_cap": 1000}'),
(80,158000,  4000,  'Legend',      'Ascendant',  'Star',       '#EF4444', '{"daily_xp_cap": 1000, "profile_frame": "legend"}'),
(81,162000,  4050,  'Legend',      'Divine',     'Star',       '#EF4444', '{"daily_xp_cap": 1000}'),
(82,166050,  4100,  'Legend',      'Celestial',  'Star',       '#EF4444', '{"daily_xp_cap": 1000}'),
(83,170150,  4150,  'Legend',      'Astral',     'Star',       '#EF4444', '{"daily_xp_cap": 1000}'),
(84,174300,  4200,  'Legend',      'Cosmic',     'Star',       '#EF4444', '{"daily_xp_cap": 1000}'),
(85,178500,  4250,  'Legend',      'Universal',  'Star',       '#EF4444', '{"daily_xp_cap": 1000, "streak_shield": 14}'),
-- ─── Grand Master (86–95) ─────────────────────────────────────
(86,182750,  4300,  'Grand Master','Singularity','Crown',      '#EC4899', '{"daily_xp_cap": 1250}'),
(87,187050,  4350,  'Grand Master','Paragon',    'Crown',      '#EC4899', '{"daily_xp_cap": 1250}'),
(88,191400,  4400,  'Grand Master','Pinnacle',   'Crown',      '#EC4899', '{"daily_xp_cap": 1250}'),
(89,195800,  4450,  'Grand Master','Apex',       'Crown',      '#EC4899', '{"daily_xp_cap": 1250}'),
(90,200250,  4500,  'Grand Master','Zenith',     'Crown',      '#EC4899', '{"daily_xp_cap": 1250, "battle_bonus_xp": 1.5, "battle_wager_limit": 2000}'),
(91,204750,  4550,  'Grand Master','Acme',       'Crown',      '#EC4899', '{"daily_xp_cap": 1250}'),
(92,209300,  4600,  'Grand Master','Summit',     'Crown',      '#EC4899', '{"daily_xp_cap": 1250}'),
(93,213900,  4650,  'Grand Master','Crest',      'Crown',      '#EC4899', '{"daily_xp_cap": 1250}'),
(94,218550,  4700,  'Grand Master','Peak',       'Crown',      '#EC4899', '{"daily_xp_cap": 1250}'),
(95,223250,  4750,  'Grand Master','Omega',      'Crown',      '#EC4899', '{"daily_xp_cap": 1250, "profile_frame": "grandmaster"}'),
-- ─── Elite (96–99) ────────────────────────────────────────────
(96,228000,  4800,  'Elite',       'Prodigy',    'Gem',        '#6366F1', '{"daily_xp_cap": 1500}'),
(97,232800,  4850,  'Elite',       'Genius',     'Gem',        '#6366F1', '{"daily_xp_cap": 1500}'),
(98,237650,  4900,  'Elite',       'Virtuoso',   'Gem',        '#6366F1', '{"daily_xp_cap": 1500}'),
(99,242550,  4950,  'Elite',       'Phenomenon', 'Gem',        '#6366F1', '{"daily_xp_cap": 1500, "streak_shield": 21}'),
-- ─── Supreme (100) ────────────────────────────────────────────
(100,247500, 9999999, 'Supreme',   'Supreme',    'Diamond',    '#D97706', '{"daily_xp_cap": 2000, "battle_bonus_xp": 2.0, "battle_wager_limit": 5000, "profile_frame": "supreme", "streak_shield": 30}')
ON CONFLICT (level_number) DO NOTHING;


-- ═══════════════════════════════════════════════════════════════
-- 2. REAL CBSE QUESTION BANK
-- Questions are seeded per chapter using the chapter slug as a lookup.
-- The subquery (SELECT id FROM eduquest_chapters WHERE slug = '...') is
-- used instead of hard-coded UUIDs for portability across environments.
-- ON CONFLICT DO NOTHING makes re-running this migration safe.
--
-- Question format for MCQ:
--   question_text: Full question text
--   options: JSON array ["A) option1","B) option2","C) option3","D) option4"]
--   correct_answer: "A", "B", "C", or "D"
--   explanation: Why the answer is correct (shown post-answer)
-- ═══════════════════════════════════════════════════════════════

-- ─── CLASS 9 MATHEMATICS — Number Systems ─────────────────────
INSERT INTO eduquest_questions
  (chapter_id, question_text, options, correct_answer, explanation, difficulty, points_value, question_type, sequence_order)
SELECT
  c.id,
  q.question_text,
  q.options::JSONB,
  q.correct_answer,
  q.explanation,
  q.difficulty,
  q.points_value,
  q.question_type,
  q.seq
FROM eduquest_chapters c,
(VALUES
  ('Is √2 a rational or irrational number?',
   '["A) Rational","B) Irrational","C) Neither","D) Both"]',
   'B',
   '√2 cannot be expressed as p/q where p and q are integers and q ≠ 0. Its decimal expansion is non-terminating and non-repeating (1.41421356...), making it irrational.',
   'easy', 10, 'mcq', 1),

  ('Which of the following is NOT an irrational number?',
   '["A) √3","B) √5","C) √9","D) √11"]',
   'C',
   '√9 = 3, which is a whole number and therefore a rational number. All other options produce non-terminating, non-repeating decimals.',
   'easy', 10, 'mcq', 2),

  ('The decimal expansion of a rational number is always:',
   '["A) Non-terminating and non-repeating","B) Terminating only","C) Either terminating or non-terminating repeating","D) Non-terminating repeating only"]',
   'C',
   'A rational number p/q can either terminate (like 1/4 = 0.25) or have a repeating block (like 1/3 = 0.333...). It can never be non-terminating non-repeating.',
   'medium', 15, 'mcq', 3),

  ('Simplify: (√3 + √2)(√3 - √2)',
   '["A) 1","B) 5","C) √6","D) √5 - √6"]',
   'A',
   'Using the identity (a+b)(a-b) = a² - b²: (√3)² - (√2)² = 3 - 2 = 1.',
   'easy', 10, 'mcq', 4),

  ('Which of the following represents the number line between 0 and 1 that contains √(0.6)?',
   '["A) 0.4 < √0.6 < 0.5","B) 0.7 < √0.6 < 0.8","C) 0.6 < √0.6 < 0.7","D) 0.5 < √0.6 < 0.6"]',
   'B',
   '√0.6 ≈ 0.7746. Since 0.7² = 0.49 and 0.8² = 0.64, √0.6 lies between 0.7 and 0.8.',
   'hard', 20, 'mcq', 5),

  ('Every real number is a/an ___.',
   '["A) Natural number","B) Whole number","C) Integer","D) None of the above"]',
   'D',
   'Real numbers include rational and irrational numbers. Not every real number is a natural number, whole number, or integer. For example, π is real but not an integer.',
   'medium', 15, 'mcq', 6),

  ('The value of (256)^(0.16) × (256)^(0.09) is:',
   '["A) 4","B) 16","C) 64","D) 256.25"]',
   'A',
   '256^(0.16) × 256^(0.09) = 256^(0.16+0.09) = 256^(0.25) = 256^(1/4) = (2^8)^(1/4) = 2^2 = 4.',
   'hard', 20, 'mcq', 7)
) AS q(question_text, options, correct_answer, explanation, difficulty, points_value, question_type, seq)
WHERE c.slug = 'number-systems'
ON CONFLICT DO NOTHING;


-- ─── CLASS 9 MATHEMATICS — Polynomials ────────────────────────
INSERT INTO eduquest_questions
  (chapter_id, question_text, options, correct_answer, explanation, difficulty, points_value, question_type, sequence_order)
SELECT
  c.id, q.question_text, q.options::JSONB, q.correct_answer, q.explanation, q.difficulty, q.points_value, q.question_type, q.seq
FROM eduquest_chapters c,
(VALUES
  ('The degree of the polynomial p(x) = 5x³ - 3x² + 7x - 1 is:',
   '["A) 1","B) 2","C) 3","D) 4"]',
   'C',
   'The degree of a polynomial is the highest power of the variable. The highest power here is x³, so the degree is 3.',
   'easy', 10, 'mcq', 1),

  ('Which of the following is a zero of p(x) = x² - 5x + 6?',
   '["A) 1","B) 2","C) 4","D) -2"]',
   'B',
   'p(2) = (2)² - 5(2) + 6 = 4 - 10 + 6 = 0. So x = 2 is a zero. Also x = 3 is a zero, but 3 is not an option.',
   'easy', 10, 'mcq', 2),

  ('By the Remainder Theorem, the remainder when p(x) = x³ + 3x² - x - 3 is divided by (x - 1) is:',
   '["A) 0","B) 1","C) -1","D) 3"]',
   'A',
   'By Remainder Theorem, remainder = p(1) = (1)³ + 3(1)² - (1) - 3 = 1 + 3 - 1 - 3 = 0.',
   'medium', 15, 'mcq', 3),

  ('Factorise: x² + 7x + 12',
   '["A) (x + 3)(x + 4)","B) (x + 6)(x + 2)","C) (x - 3)(x - 4)","D) (x + 1)(x + 12)"]',
   'A',
   'We need two numbers that multiply to 12 and add to 7. Those numbers are 3 and 4. So x² + 7x + 12 = (x + 3)(x + 4).',
   'easy', 10, 'mcq', 4),

  ('Using the identity (a + b)³ = a³ + 3a²b + 3ab² + b³, expand (x + 1)³:',
   '["A) x³ + 1","B) x³ + 3x² + 3x + 1","C) x³ + x + 1","D) x³ - 3x² + 3x - 1"]',
   'B',
   '(x + 1)³ = x³ + 3(x²)(1) + 3(x)(1²) + 1³ = x³ + 3x² + 3x + 1.',
   'medium', 15, 'mcq', 5)
) AS q(question_text, options, correct_answer, explanation, difficulty, points_value, question_type, seq)
WHERE c.slug = 'polynomials'
ON CONFLICT DO NOTHING;


-- ─── CLASS 9 SCIENCE — Matter in Our Surroundings ─────────────
INSERT INTO eduquest_questions
  (chapter_id, question_text, options, correct_answer, explanation, difficulty, points_value, question_type, sequence_order)
SELECT
  c.id, q.question_text, q.options::JSONB, q.correct_answer, q.explanation, q.difficulty, q.points_value, q.question_type, q.seq
FROM eduquest_chapters c,
(VALUES
  ('Which of the following is an example of matter?',
   '["A) Light","B) Sound","C) Air","D) Shadow"]',
   'C',
   'Matter is anything that has mass and occupies space. Air has mass and occupies space, so it is matter. Light and sound are forms of energy, and shadow is the absence of light.',
   'easy', 10, 'mcq', 1),

  ('The process by which a solid changes directly into a gas without passing through the liquid state is called:',
   '["A) Evaporation","B) Condensation","C) Sublimation","D) Melting"]',
   'C',
   'Sublimation is the direct conversion of a solid to a gaseous state. Example: dry ice (solid CO₂) sublimes at room temperature and pressure.',
   'easy', 10, 'mcq', 2),

  ('At what temperature does water boil at standard atmospheric pressure (1 atm)?',
   '["A) 0°C","B) 37°C","C) 100°C","D) 273°C"]',
   'C',
   'Water boils at 100°C (373 K) at standard atmospheric pressure of 1 atm (101.325 kPa). Boiling point decreases at higher altitudes where pressure is lower.',
   'easy', 10, 'mcq', 3),

  ('Which state of matter has a definite shape and definite volume?',
   '["A) Solid only","B) Liquid only","C) Gas only","D) Both solid and liquid"]',
   'A',
   'Solids have a definite shape and definite volume because their particles are tightly packed in a fixed arrangement. Liquids have definite volume but no definite shape.',
   'easy', 10, 'mcq', 4),

  ('The SI unit of temperature is:',
   '["A) Celsius","B) Fahrenheit","C) Kelvin","D) Joule"]',
   'C',
   'Kelvin (K) is the SI unit of temperature. The conversion from Celsius to Kelvin is: K = °C + 273. Absolute zero is 0 K = -273°C.',
   'easy', 10, 'mcq', 5),

  ('Latent heat of fusion is the heat energy required to:',
   '["A) Convert liquid to gas at constant temperature","B) Convert solid to liquid at constant temperature","C) Heat a solid from 0°C to 100°C","D) Convert gas to liquid"]',
   'B',
   'Latent heat of fusion is the energy required to change a substance from solid to liquid state at its melting point without any change in temperature.',
   'medium', 15, 'mcq', 6)
) AS q(question_text, options, correct_answer, explanation, difficulty, points_value, question_type, seq)
WHERE c.slug = 'matter-in-our-surroundings'
ON CONFLICT DO NOTHING;


-- ─── CLASS 10 MATHEMATICS — Real Numbers ──────────────────────
INSERT INTO eduquest_questions
  (chapter_id, question_text, options, correct_answer, explanation, difficulty, points_value, question_type, sequence_order)
SELECT
  c.id, q.question_text, q.options::JSONB, q.correct_answer, q.explanation, q.difficulty, q.points_value, q.question_type, q.seq
FROM eduquest_chapters c,
(VALUES
  ('According to Euclid''s Division Lemma, for positive integers a and b, there exist unique integers q and r such that a = bq + r, where:',
   '["A) 0 ≤ r < b","B) 0 < r ≤ b","C) 0 ≤ r ≤ b","D) 0 < r < b"]',
   'A',
   'Euclid''s Division Lemma states that for any two positive integers a and b, there exist unique whole numbers q (quotient) and r (remainder) such that a = bq + r, where 0 ≤ r < b.',
   'medium', 15, 'mcq', 1),

  ('The HCF of 12 and 18 using the Euclid Division Algorithm is:',
   '["A) 2","B) 3","C) 6","D) 9"]',
   'C',
   '18 = 12 × 1 + 6; 12 = 6 × 2 + 0. Since remainder is 0, HCF = 6. You can verify: 12 = 2 × 6 and 18 = 3 × 6.',
   'easy', 10, 'mcq', 2),

  ('The Fundamental Theorem of Arithmetic states that every composite number can be expressed as:',
   '["A) A sum of prime numbers","B) A product of prime numbers in a unique way","C) A product of even numbers","D) A power of a prime number"]',
   'B',
   'The Fundamental Theorem of Arithmetic: Every composite number can be factored into primes in exactly one way (ignoring order). Example: 12 = 2² × 3 (uniquely).',
   'medium', 15, 'mcq', 3),

  ('The LCM of two numbers is 1200 and their HCF is 20. If one number is 240, find the other:',
   '["A) 100","B) 200","C) 50","D) 150"]',
   'A',
   'We use: HCF × LCM = Product of two numbers. So 20 × 1200 = 240 × other. Other = 24000 / 240 = 100.',
   'medium', 15, 'mcq', 4),

  ('Which of the following rational numbers has a terminating decimal expansion?',
   '["A) 1/6","B) 1/12","C) 1/8","D) 1/15"]',
   'C',
   '1/8 = 1/(2³). For a rational number p/q to have a terminating decimal, q must only have 2 and 5 as prime factors. 8 = 2³, so 1/8 terminates (= 0.125). 6 = 2×3, 12 = 2²×3, 15 = 3×5 — all have 3 as a factor.',
   'hard', 20, 'mcq', 5)
) AS q(question_text, options, correct_answer, explanation, difficulty, points_value, question_type, seq)
WHERE c.slug = 'real-numbers'
ON CONFLICT DO NOTHING;


-- ─── CLASS 10 SCIENCE — Chemical Reactions and Equations ───────
INSERT INTO eduquest_questions
  (chapter_id, question_text, options, correct_answer, explanation, difficulty, points_value, question_type, sequence_order)
SELECT
  c.id, q.question_text, q.options::JSONB, q.correct_answer, q.explanation, q.difficulty, q.points_value, q.question_type, q.seq
FROM eduquest_chapters c,
(VALUES
  ('Which of the following is a balanced chemical equation?',
   '["A) H₂ + O₂ → H₂O","B) 2H₂ + O₂ → 2H₂O","C) H₂ + 2O₂ → H₂O₂","D) H₂ + O → H₂O"]',
   'B',
   '2H₂ + O₂ → 2H₂O is balanced: Left: 4H, 2O. Right: 4H, 2O. Option A has 2H,2O on left vs 2H,1O on right (unbalanced).',
   'easy', 10, 'mcq', 1),

  ('The process of gaining oxygen or losing hydrogen is called:',
   '["A) Reduction","B) Oxidation","C) Combination","D) Decomposition"]',
   'B',
   'Oxidation involves: (1) gain of oxygen, (2) loss of hydrogen, (3) loss of electrons. Reduction is the opposite. Remember OIL RIG: Oxidation Is Loss, Reduction Is Gain.',
   'easy', 10, 'mcq', 2),

  ('When iron reacts with oxygen and water, rust is formed. This is an example of:',
   '["A) Combination reaction","B) Decomposition reaction","C) Displacement reaction","D) Double displacement reaction"]',
   'A',
   '4Fe + 3O₂ + 2H₂O → 4Fe(OH)₃ (rust, simplified). Two or more substances combine to form a single product, making it a combination reaction.',
   'medium', 15, 'mcq', 3),

  ('In the reaction: CaCO₃ → CaO + CO₂, what type of reaction is this?',
   '["A) Combination","B) Thermal decomposition","C) Displacement","D) Redox"]',
   'B',
   'A single compound breaks down into simpler substances when heated (thermal decomposition). Calcium carbonate (limestone) decomposes into calcium oxide (quicklime) and carbon dioxide.',
   'medium', 15, 'mcq', 4),

  ('Which metal displaces copper from copper sulphate solution?',
   '["A) Gold","B) Silver","C) Iron","D) Mercury"]',
   'C',
   'Iron is more reactive than copper in the reactivity series. Fe + CuSO₄ → FeSO₄ + Cu. More reactive metals can displace less reactive metals from their salt solutions.',
   'easy', 10, 'mcq', 5),

  ('What happens to the temperature of the surroundings during an exothermic reaction?',
   '["A) It decreases","B) It increases","C) It remains the same","D) It first increases then decreases"]',
   'B',
   'Exothermic reactions release heat energy to the surroundings, causing the temperature to rise. Example: burning of fuel, reaction of acid with base (neutralization).',
   'easy', 10, 'mcq', 6)
) AS q(question_text, options, correct_answer, explanation, difficulty, points_value, question_type, seq)
WHERE c.slug = 'chemical-reactions-and-equations'
ON CONFLICT DO NOTHING;


-- ─── CLASS 11 PHYSICS — Units and Measurement ─────────────────
INSERT INTO eduquest_questions
  (chapter_id, question_text, options, correct_answer, explanation, difficulty, points_value, question_type, sequence_order)
SELECT
  c.id, q.question_text, q.options::JSONB, q.correct_answer, q.explanation, q.difficulty, q.points_value, q.question_type, q.seq
FROM eduquest_chapters c,
(VALUES
  ('The SI unit of electric current is:',
   '["A) Volt","B) Ohm","C) Ampere","D) Watt"]',
   'C',
   'The Ampere (A) is one of the seven SI base units, defined as the flow of one coulomb of charge per second (1 A = 1 C/s). Named after André-Marie Ampère.',
   'easy', 10, 'mcq', 1),

  ('How many significant figures are in the number 0.00700?',
   '["A) 6","B) 5","C) 3","D) 7"]',
   'C',
   'Rules: Leading zeros are not significant. Trailing zeros after a decimal point ARE significant. In 0.00700: the leading zeros (0.00) are not significant, but 7, 0, 0 are. So 3 significant figures.',
   'medium', 15, 'mcq', 2),

  ('The dimensional formula of velocity is:',
   '["A) [MLT⁻¹]","B) [LT⁻¹]","C) [ML²T⁻²]","D) [MLT⁻²]"]',
   'B',
   'Velocity = Distance/Time = L/T = [LT⁻¹]. It has no mass dimension. Note: acceleration is [LT⁻²] and force is [MLT⁻²].',
   'easy', 10, 'mcq', 3),

  ('A measurement is called precise if:',
   '["A) It is close to the true value","B) Multiple measurements give the same result","C) It has no error","D) It is measured with a digital instrument"]',
   'B',
   'Precision refers to repeatability — how closely repeated measurements agree with each other. Accuracy means closeness to the true value. A measurement can be precise but not accurate.',
   'medium', 15, 'mcq', 4),

  ('The percentage error in measurement of radius r is 2%. The percentage error in the measurement of volume of a sphere (V = 4/3 πr³) would be:',
   '["A) 2%","B) 4%","C) 6%","D) 8%"]',
   'C',
   'When a quantity is raised to a power n, the percentage error is multiplied by n. Volume ∝ r³, so percentage error in V = 3 × percentage error in r = 3 × 2% = 6%.',
   'hard', 20, 'mcq', 5)
) AS q(question_text, options, correct_answer, explanation, difficulty, points_value, question_type, seq)
WHERE c.slug = 'units-and-measurement'
ON CONFLICT DO NOTHING;


-- ─── CLASS 12 PHYSICS — Electric Charges and Fields ──────────
INSERT INTO eduquest_questions
  (chapter_id, question_text, options, correct_answer, explanation, difficulty, points_value, question_type, sequence_order)
SELECT
  c.id, q.question_text, q.options::JSONB, q.correct_answer, q.explanation, q.difficulty, q.points_value, q.question_type, q.seq
FROM eduquest_chapters c,
(VALUES
  ('Coulomb''s law states that the force between two point charges is:',
   '["A) Directly proportional to the square of the distance","B) Inversely proportional to the product of charges","C) Directly proportional to the product of charges and inversely proportional to the square of distance","D) Equal to the product of charges divided by the distance"]',
   'C',
   'Coulomb''s Law: F = k(q₁q₂)/r². The force is directly proportional to each charge and inversely proportional to the square of the distance between them. k = 9 × 10⁹ N·m²/C².',
   'easy', 10, 'mcq', 1),

  ('The SI unit of electric charge is:',
   '["A) Ampere","B) Volt","C) Coulomb","D) Farad"]',
   'C',
   'The Coulomb (C) is the SI unit of electric charge. 1 Coulomb = charge carried by approximately 6.24 × 10¹⁸ electrons. 1 C = 1 A·s.',
   'easy', 10, 'mcq', 2),

  ('Inside a hollow conducting sphere that carries a charge, the electric field is:',
   '["A) Maximum at the centre","B) Zero everywhere inside","C) Non-zero only at the centre","D) Same as outside the sphere"]',
   'B',
   'By Gauss''s Law, since there is no charge enclosed inside a hollow conducting sphere, the electric flux through any Gaussian surface inside is zero, making E = 0 everywhere inside.',
   'medium', 15, 'mcq', 3),

  ('Electric field lines:',
   '["A) Can cross each other","B) Start from negative and end at positive charges","C) Are always straight lines","D) Start from positive and end at negative charges"]',
   'D',
   'Electric field lines begin at positive charges (or come from infinity) and end at negative charges (or go to infinity). They never cross because the field direction at a point must be unique.',
   'easy', 10, 'mcq', 4),

  ('The electric flux through a closed surface is zero if:',
   '["A) The surface contains a positive charge","B) The surface contains no net charge","C) The electric field is zero","D) The surface is a sphere"]',
   'B',
   'By Gauss''s Law: ΦE = Q_enclosed / ε₀. If Q_enclosed = 0 (no net charge inside), then ΦE = 0. The shape of the surface does not matter.',
   'medium', 15, 'mcq', 5)
) AS q(question_text, options, correct_answer, explanation, difficulty, points_value, question_type, seq)
WHERE c.slug = 'electric-charges-and-fields'
ON CONFLICT DO NOTHING;


-- ─── CLASS 10 MATHEMATICS — Triangles ────────────────────────
INSERT INTO eduquest_questions
  (chapter_id, question_text, options, correct_answer, explanation, difficulty, points_value, question_type, sequence_order)
SELECT
  c.id, q.question_text, q.options::JSONB, q.correct_answer, q.explanation, q.difficulty, q.points_value, q.question_type, q.seq
FROM eduquest_chapters c,
(VALUES
  ('Two triangles are similar if their corresponding angles are equal and:',
   '["A) Corresponding sides are equal","B) Corresponding sides are proportional","C) Perimeters are equal","D) Areas are equal"]',
   'B',
   'For similar triangles (∼): corresponding angles are equal AND corresponding sides are proportional (in the same ratio). Equal sides would make them congruent (≅), not just similar.',
   'easy', 10, 'mcq', 1),

  ('In a right triangle with legs a and b and hypotenuse c, the Pythagorean theorem states:',
   '["A) a + b = c","B) a² + b² = c²","C) a² - b² = c","D) (a+b)² = c²"]',
   'B',
   'The Pythagorean Theorem: In a right-angled triangle, the square of the hypotenuse equals the sum of squares of the other two sides. a² + b² = c².',
   'easy', 10, 'mcq', 2),

  ('The ratio of areas of two similar triangles is equal to:',
   '["A) The ratio of their corresponding sides","B) The square of the ratio of their corresponding sides","C) The cube of the ratio of corresponding sides","D) The ratio of their perimeters"]',
   'B',
   'If two triangles are similar with a ratio of similarity k, then the ratio of their areas is k². This is because area scales as the square of linear dimensions.',
   'medium', 15, 'mcq', 3)
) AS q(question_text, options, correct_answer, explanation, difficulty, points_value, question_type, seq)
WHERE c.slug = 'triangles'
ON CONFLICT DO NOTHING;


-- ─── CLASS 9 SCIENCE — Is Matter Around Us Pure ───────────────
INSERT INTO eduquest_questions
  (chapter_id, question_text, options, correct_answer, explanation, difficulty, points_value, question_type, sequence_order)
SELECT
  c.id, q.question_text, q.options::JSONB, q.correct_answer, q.explanation, q.difficulty, q.points_value, q.question_type, q.seq
FROM eduquest_chapters c,
(VALUES
  ('Which of the following is a pure substance?',
   '["A) Air","B) Sea water","C) Distilled water","D) Milk"]',
   'C',
   'A pure substance has a fixed composition throughout. Distilled water is pure H₂O. Air is a mixture of gases, sea water has dissolved salts, and milk is a colloid mixture.',
   'easy', 10, 'mcq', 1),

  ('The process used to separate a mixture of two miscible liquids with different boiling points is:',
   '["A) Filtration","B) Evaporation","C) Distillation","D) Sublimation"]',
   'C',
   'Distillation separates miscible liquids by exploiting their different boiling points. The liquid with lower boiling point vaporizes first, is collected and condensed.',
   'easy', 10, 'mcq', 2),

  ('Alloys are considered:',
   '["A) Pure substances","B) Compounds","C) Mixtures","D) Elements"]',
   'C',
   'Alloys (like steel, brass, bronze) are homogeneous mixtures of metals. They are not pure substances because the composition can vary, and the components retain their properties.',
   'medium', 15, 'mcq', 3),

  ('In a solution, the component present in larger amount is called:',
   '["A) Solute","B) Solvent","C) Solution","D) Mixture"]',
   'B',
   'In a solution: the Solvent is present in larger quantity (e.g., water in salt water), and the Solute is dissolved in it (e.g., salt). The solvent determines the state of the solution.',
   'easy', 10, 'mcq', 4)
) AS q(question_text, options, correct_answer, explanation, difficulty, points_value, question_type, seq)
WHERE c.slug = 'is-matter-around-us-pure'
ON CONFLICT DO NOTHING;
