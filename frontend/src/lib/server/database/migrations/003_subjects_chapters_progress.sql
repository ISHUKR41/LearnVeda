/*
 * FILE: 003_subjects_chapters_progress.sql
 * LOCATION: src/lib/server/database/migrations/003_subjects_chapters_progress.sql
 * PURPOSE: Adds the full CBSE curriculum structure to the EduQuest database.
 *          Creates tables for subjects, chapters, questions, and user progress tracking.
 *          This migration enables the day-by-day learning system described in the MCP.
 *
 *          Tables added:
 *            eduquest_subjects        — all CBSE subjects per class/stream
 *            eduquest_chapters        — CBSE chapters per subject (ordered)
 *            eduquest_questions       — MCQ/short-answer questions per chapter
 *            eduquest_user_progress   — tracks which chapters a user has completed
 *            eduquest_user_stats      — aggregated daily activity for streak calculation
 *            eduquest_notifications   — in-app notification messages
 *
 * USED BY: npm run db:migrate, postgres-platform-repository.ts
 * LAST UPDATED: 2026-05-16
 * AUTHOR NOTE: All chapter data is pre-seeded via a separate seed script.
 *              This migration only creates the table structures.
 */

-- ─────────────────────────────────────────────
-- SUBJECTS TABLE
-- Stores every CBSE subject for Class 9–12 and each engineering language.
-- The "track" column matches the user's track field (e.g. 'class-9').
-- The "stream" column is used only for Class 11 and 12 (science/commerce/arts).
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS eduquest_subjects (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track        TEXT NOT NULL,         -- e.g. 'class-9', 'class-10', 'class-11', 'engineering'
  stream       TEXT,                  -- e.g. 'science', 'commerce', 'arts' (null for class 9/10/engineering)
  slug         TEXT NOT NULL UNIQUE,  -- URL-safe identifier e.g. 'class-9-mathematics'
  name         TEXT NOT NULL,         -- Display name e.g. 'Mathematics'
  description  TEXT,                  -- Short description shown on the subject card
  chapter_count INTEGER NOT NULL DEFAULT 0,  -- Total number of chapters in this subject
  color        TEXT NOT NULL DEFAULT '#2563EB',  -- Brand color for the subject card
  icon         TEXT NOT NULL DEFAULT 'BookOpen', -- Lucide icon name for the subject
  sequence_order INTEGER NOT NULL DEFAULT 0,     -- Display order within the track
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS eduquest_subjects_track_idx ON eduquest_subjects (track);
CREATE INDEX IF NOT EXISTS eduquest_subjects_slug_idx  ON eduquest_subjects (slug);

-- ─────────────────────────────────────────────
-- CHAPTERS TABLE
-- Stores every CBSE chapter for each subject in ordered sequence.
-- Each chapter has a day plan — students complete it over multiple days.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS eduquest_chapters (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id     UUID NOT NULL REFERENCES eduquest_subjects(id) ON DELETE CASCADE,
  slug           TEXT NOT NULL,          -- URL-safe identifier e.g. 'number-systems'
  name           TEXT NOT NULL,          -- CBSE chapter name
  description    TEXT,                   -- What this chapter covers
  day_count      INTEGER NOT NULL DEFAULT 7,  -- How many study days this chapter takes
  sequence_order INTEGER NOT NULL,       -- Order within the subject (1-based)
  difficulty     TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  question_count INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (subject_id, slug)
);

CREATE INDEX IF NOT EXISTS eduquest_chapters_subject_idx ON eduquest_chapters (subject_id, sequence_order);

-- ─────────────────────────────────────────────
-- QUESTIONS TABLE
-- Stores practice questions for each chapter.
-- Supports MCQ (multiple choice), short-answer, and true/false question types.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS eduquest_questions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id       UUID NOT NULL REFERENCES eduquest_chapters(id) ON DELETE CASCADE,
  question_text    TEXT NOT NULL,
  question_type    TEXT NOT NULL DEFAULT 'mcq' CHECK (question_type IN ('mcq', 'short_answer', 'true_false', 'fill_blank')),
  difficulty       TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  options          JSONB,            -- For MCQ: array of strings ["option A", "option B", ...]
  correct_answer   TEXT NOT NULL,    -- For MCQ: the correct option string. For others: the answer text.
  explanation      TEXT,             -- Why this is the correct answer (shown after submission)
  points_value     INTEGER NOT NULL DEFAULT 10 CHECK (points_value > 0),
  youtube_hint_url TEXT,             -- YouTube video link for extra help (shown after wrong attempt)
  day_number       INTEGER,          -- Which study day this question belongs to (1-indexed)
  sequence_order   INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS eduquest_questions_chapter_idx ON eduquest_questions (chapter_id, day_number);

-- ─────────────────────────────────────────────
-- USER PROGRESS TABLE
-- Tracks which chapters each user has completed and their scores.
-- One row per (user, chapter) combination.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS eduquest_user_progress (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES eduquest_users(id) ON DELETE CASCADE,
  chapter_id        UUID NOT NULL REFERENCES eduquest_chapters(id) ON DELETE CASCADE,
  subject_id        UUID NOT NULL REFERENCES eduquest_subjects(id) ON DELETE CASCADE,
  completed_days    INTEGER NOT NULL DEFAULT 0,  -- How many days of this chapter are done
  total_days        INTEGER NOT NULL DEFAULT 7,  -- How many days the chapter has
  score             INTEGER NOT NULL DEFAULT 0,  -- Total XP earned in this chapter
  is_complete       BOOLEAN NOT NULL DEFAULT FALSE,
  started_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at      TIMESTAMPTZ,                 -- NULL until the chapter is fully done
  UNIQUE (user_id, chapter_id)                   -- Each user can only have one progress row per chapter
);

CREATE INDEX IF NOT EXISTS eduquest_user_progress_user_idx    ON eduquest_user_progress (user_id);
CREATE INDEX IF NOT EXISTS eduquest_user_progress_subject_idx ON eduquest_user_progress (user_id, subject_id);

-- ─────────────────────────────────────────────
-- USER STATS TABLE
-- Records daily activity for streak calculation.
-- One row per (user, calendar_date) combination.
-- The streak counter is calculated from this table.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS eduquest_user_stats (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES eduquest_users(id) ON DELETE CASCADE,
  activity_date     DATE NOT NULL,         -- The date in IST (India Standard Time)
  questions_solved  INTEGER NOT NULL DEFAULT 0,
  xp_earned        INTEGER NOT NULL DEFAULT 0,
  battles_played   INTEGER NOT NULL DEFAULT 0,
  battles_won      INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, activity_date)          -- One stat row per user per day
);

CREATE INDEX IF NOT EXISTS eduquest_user_stats_user_date_idx ON eduquest_user_stats (user_id, activity_date DESC);

-- ─────────────────────────────────────────────
-- NOTIFICATIONS TABLE
-- In-app notification messages sent to users.
-- Examples: "You reached Level 5!", "Your streak is at risk!", "Event tomorrow!"
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS eduquest_notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES eduquest_users(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('level_up', 'streak', 'battle', 'event', 'achievement', 'system')),
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  action_url  TEXT,             -- Optional URL for a "View" button on the notification
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS eduquest_notifications_user_idx ON eduquest_notifications (user_id, is_read, created_at DESC);

-- ─────────────────────────────────────────────
-- SEED: Class 9 Subjects
-- Pre-populate the subjects table with all CBSE Class 9 subjects.
-- The chapter_count values match the NCERT curriculum for 2025-26.
-- ─────────────────────────────────────────────
INSERT INTO eduquest_subjects (track, slug, name, description, chapter_count, color, icon, sequence_order)
VALUES
  ('class-9', 'class-9-mathematics', 'Mathematics',
   'Master Number Systems, Polynomials, Geometry, Mensuration, and Statistics',
   15, '#2563EB', 'Calculator', 1),
  ('class-9', 'class-9-science', 'Science',
   'Explore Matter, Atoms, Living Organisms, Motion, Forces, and Sound',
   15, '#10B981', 'FlaskConical', 2),
  ('class-9', 'class-9-social-science', 'Social Science',
   'Study History, Geography, Civics, and Economics through real-world contexts',
   20, '#8B5CF6', 'Globe', 3),
  ('class-9', 'class-9-english', 'English',
   'Develop reading, writing, grammar, and literature comprehension skills',
   12, '#F59E0B', 'BookOpen', 4),
  ('class-9', 'class-9-hindi', 'Hindi',
   'Hindi Kshitij, Kritika, Sparsh, and Sanchayan — complete CBSE syllabus',
   12, '#EF4444', 'Languages', 5),
  ('class-9', 'class-9-computer-applications', 'Computer Applications',
   'Introduction to computers, operating systems, MS Office, and basic programming',
   8, '#06B6D4', 'Monitor', 6)
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────
-- SEED: Class 10 Subjects
-- ─────────────────────────────────────────────
INSERT INTO eduquest_subjects (track, slug, name, description, chapter_count, color, icon, sequence_order)
VALUES
  ('class-10', 'class-10-mathematics-standard', 'Maths Standard',
   'Real Numbers, Polynomials, Quadratics, Trigonometry, Circles, Statistics',
   15, '#2563EB', 'Calculator', 1),
  ('class-10', 'class-10-science', 'Science',
   'Chemical Reactions, Acids, Metals, Carbon, Life Processes, Electricity, Light',
   16, '#10B981', 'FlaskConical', 2),
  ('class-10', 'class-10-social-science', 'Social Science',
   'India and Contemporary World, Democratic Politics, Understanding Economics',
   20, '#8B5CF6', 'Globe', 3),
  ('class-10', 'class-10-english', 'English',
   'First Flight, Footprints Without Feet — prose, poetry, and supplementary reader',
   12, '#F59E0B', 'BookOpen', 4),
  ('class-10', 'class-10-hindi', 'Hindi',
   'Kshitij Part 2, Kritika Part 2, Sparsh, and Sanchayan — CBSE board syllabus',
   12, '#EF4444', 'Languages', 5)
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────
-- SEED: Class 11 Science Stream Subjects
-- ─────────────────────────────────────────────
INSERT INTO eduquest_subjects (track, stream, slug, name, description, chapter_count, color, icon, sequence_order)
VALUES
  ('class-11', 'science', 'class-11-science-physics', 'Physics',
   'Physical World, Units, Kinematics, Laws of Motion, Work, Energy, Gravitation, Thermodynamics',
   15, '#2563EB', 'Zap', 1),
  ('class-11', 'science', 'class-11-science-chemistry', 'Chemistry',
   'Some Basic Concepts, Structure of Atom, Classification, Chemical Bonding, States of Matter',
   14, '#10B981', 'FlaskConical', 2),
  ('class-11', 'science', 'class-11-science-mathematics', 'Mathematics',
   'Sets, Relations, Trigonometry, Sequences, Straight Lines, Conic Sections, Statistics',
   16, '#F59E0B', 'Calculator', 3),
  ('class-11', 'science', 'class-11-science-biology', 'Biology',
   'Diversity in Living World, Structural Organisation, Cell Biology, Plant Physiology',
   22, '#84CC16', 'Leaf', 4),
  ('class-11', 'science', 'class-11-science-computer-science', 'Computer Science',
   'Python programming, data types, control flow, functions, lists, strings, dictionaries',
   8, '#06B6D4', 'Code2', 5)
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────
-- SEED: Class 12 Science Stream Subjects
-- ─────────────────────────────────────────────
INSERT INTO eduquest_subjects (track, stream, slug, name, description, chapter_count, color, icon, sequence_order)
VALUES
  ('class-12', 'science', 'class-12-science-physics', 'Physics',
   'Electrostatics, Current Electricity, Magnetism, EMI, Optics, Dual Nature, Atoms, Nuclei, Semiconductors',
   15, '#2563EB', 'Zap', 1),
  ('class-12', 'science', 'class-12-science-chemistry', 'Chemistry',
   'Solutions, Electrochemistry, Surface Chemistry, p-block, Alcohols, Aldehydes, Amines, Biomolecules',
   16, '#10B981', 'FlaskConical', 2),
  ('class-12', 'science', 'class-12-science-mathematics', 'Mathematics',
   'Relations, Inverse Trigonometry, Matrices, Determinants, Continuity, Integration, Differential Equations',
   13, '#F59E0B', 'Calculator', 3),
  ('class-12', 'science', 'class-12-science-biology', 'Biology',
   'Reproduction, Genetics, Evolution, Human Health, Biotechnology, Ecosystems, Biodiversity',
   16, '#84CC16', 'Leaf', 4),
  ('class-12', 'science', 'class-12-science-computer-science', 'Computer Science',
   'Python advanced, OOP, file handling, databases, computer networks, web development basics',
   8, '#06B6D4', 'Code2', 5)
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────
-- SEED: Class 9 Mathematics Chapters
-- All 15 chapters from the NCERT Class 9 Mathematics textbook.
-- ─────────────────────────────────────────────
WITH math_subject AS (
  SELECT id FROM eduquest_subjects WHERE slug = 'class-9-mathematics'
)
INSERT INTO eduquest_chapters (subject_id, slug, name, description, day_count, sequence_order, difficulty, question_count)
SELECT
  math_subject.id,
  ch.slug,
  ch.name,
  ch.description,
  ch.day_count,
  ch.seq,
  ch.difficulty,
  ch.question_count
FROM math_subject, (VALUES
  (1,  'number-systems',              'Number Systems',
   'Rational numbers, irrational numbers, real numbers and their decimal expansions, number line', 7, 'easy', 25),
  (2,  'polynomials',                 'Polynomials',
   'Polynomials in one variable, zeroes, remainder theorem, factor theorem, algebraic identities', 7, 'medium', 25),
  (3,  'coordinate-geometry',         'Coordinate Geometry',
   'Cartesian plane, quadrants, plotting points, distance formula basics', 5, 'easy', 20),
  (4,  'linear-equations-two-variables', 'Linear Equations in Two Variables',
   'Solutions, graph of a linear equation, equations of lines parallel to axes', 6, 'medium', 25),
  (5,  'introduction-euclids-geometry','Introduction to Euclid''s Geometry',
   'Euclid''s axioms and postulates, theorems, equivalent versions of fifth postulate', 5, 'easy', 15),
  (6,  'lines-and-angles',            'Lines and Angles',
   'Pairs of angles, parallel lines, transversal, angle sum property of triangles', 7, 'medium', 25),
  (7,  'triangles',                   'Triangles',
   'Congruence rules (SAS, ASA, SSS, RHS), properties of triangles, inequalities', 8, 'medium', 30),
  (8,  'quadrilaterals',              'Quadrilaterals',
   'Angle sum, properties of parallelogram, mid-point theorem', 6, 'medium', 25),
  (9,  'areas-parallelograms-triangles','Areas of Parallelograms and Triangles',
   'Figures on same base and between same parallels, area relationships', 5, 'medium', 20),
  (10, 'circles',                     'Circles',
   'Chords, arcs, angles subtended, cyclic quadrilaterals, equal chords', 7, 'hard', 25),
  (11, 'constructions',               'Constructions',
   'Bisecting angles, constructing triangles given perimeter or altitude or sides', 5, 'medium', 15),
  (12, 'herons-formula',              'Heron''s Formula',
   'Area of triangle using Heron''s formula, application to quadrilaterals', 4, 'easy', 20),
  (13, 'surface-areas-volumes',       'Surface Areas and Volumes',
   'Cuboid, cube, cylinder, cone, sphere — surface area and volume formulas', 8, 'hard', 30),
  (14, 'statistics',                  'Statistics',
   'Data collection, presentation, mean, median, mode, bar graphs, frequency polygons', 7, 'medium', 25),
  (15, 'probability',                 'Probability',
   'Experimental and theoretical probability, sample space, simple events', 5, 'easy', 20)
) AS ch(seq, slug, name, description, day_count, difficulty, question_count)
ON CONFLICT (subject_id, slug) DO NOTHING;

-- ─────────────────────────────────────────────
-- SEED: Sample MCQ Questions for Chapter 1 (Number Systems)
-- These demonstrate the question format. Full question banks are added separately.
-- ─────────────────────────────────────────────
WITH ch1 AS (
  SELECT c.id
  FROM eduquest_chapters c
  JOIN eduquest_subjects s ON s.id = c.subject_id
  WHERE s.slug = 'class-9-mathematics' AND c.slug = 'number-systems'
)
INSERT INTO eduquest_questions
  (chapter_id, question_text, question_type, difficulty, options, correct_answer, explanation, points_value, youtube_hint_url, day_number, sequence_order)
SELECT
  ch1.id,
  q.question_text,
  'mcq',
  q.difficulty,
  q.options::JSONB,
  q.correct_answer,
  q.explanation,
  q.points,
  q.youtube_hint_url,
  q.day_number,
  q.seq
FROM ch1, (VALUES
  (1, 'Which of the following is an irrational number?',
   'easy',
   '["√4", "√9", "√2", "√16"]',
   '√2',
   '√2 ≈ 1.41421... is non-terminating and non-recurring, making it irrational. The others (√4=2, √9=3, √16=4) are perfect squares and therefore rational.',
   10, 'https://www.youtube.com/watch?v=example1', 1, 1),

  (2, 'Every rational number is:',
   'easy',
   '["A natural number", "An integer", "A real number", "A whole number"]',
   'A real number',
   'Real numbers include all rational and irrational numbers. Every rational number is a real number, but not necessarily a natural number, whole number, or integer.',
   10, 'https://www.youtube.com/watch?v=example2', 1, 2),

  (3, 'The decimal expansion of 1/3 is:',
   'easy',
   '["0.3", "0.33", "0.333...(recurring)", "0.3030..."]',
   '0.333...(recurring)',
   '1 ÷ 3 = 0.333... where 3 repeats infinitely. This is written as 0.3̄ in standard notation and is a non-terminating recurring decimal.',
   10, 'https://www.youtube.com/watch?v=example3', 1, 3),

  (4, 'Which law of exponents does (x^m)^n = x^(mn) represent?',
   'medium',
   '["Product law", "Quotient law", "Power of a power law", "Zero exponent law"]',
   'Power of a power law',
   'When raising a power to another power, you multiply the exponents. This is the Power of a Power law: (x^m)^n = x^(m×n).',
   20, 'https://www.youtube.com/watch?v=example4', 6, 4),

  (5, 'The value of (256)^(3/4) is:',
   'hard',
   '["16", "32", "64", "128"]',
   '64',
   '256 = 4^4. So (256)^(3/4) = (4^4)^(3/4) = 4^(4×3/4) = 4^3 = 64. Alternatively, 256^(1/4) = 4, then 4^3 = 64.',
   35, 'https://www.youtube.com/watch?v=example5', 6, 5)
) AS q(seq, question_text, difficulty, options, correct_answer, explanation, points, youtube_hint_url, day_number)
ON CONFLICT DO NOTHING;
