/*
 * FILE: 006_cbse_subjects_chapters.sql
 * LOCATION: src/lib/server/database/migrations/006_cbse_subjects_chapters.sql
 * PURPOSE: Seeds the complete CBSE curriculum into the EduQuest platform.
 *          Inserts all subjects and chapters for Class 9, 10, 11 (Science &
 *          Commerce), 12 (Science & Commerce), and 12 Engineering language tracks.
 *
 *          Why a migration instead of a seed script?
 *          The curriculum data is structural — it defines what subjects and
 *          chapters exist. It belongs in a versioned migration so every
 *          environment (dev, staging, production) gets exactly the same
 *          curriculum data with a single `npm run db:migrate` call.
 *
 *          All INSERTs use ON CONFLICT DO NOTHING so this migration is safe
 *          to re-run without duplicating rows.
 *
 *          Subject slug convention:  "<track>-<subject-name>"
 *          Chapter slug convention:  "<kebab-case-chapter-name>"
 *
 * TABLES MODIFIED:
 *   eduquest_subjects   — one row per subject (e.g. "class-9-mathematics")
 *   eduquest_chapters   — one row per CBSE chapter linked to a subject
 *
 * USED BY: npm run db:migrate  →  src/lib/server/database/migrations/run-migrations.ts
 * LAST UPDATED: 2026-05-18
 */

-- ═══════════════════════════════════════════════════════
-- 1. CLASS 9 SUBJECTS
-- Six core CBSE subjects for Class 9 students.
-- ═══════════════════════════════════════════════════════

INSERT INTO eduquest_subjects
  (track, stream, slug, name, description, chapter_count, color, icon, sequence_order)
VALUES
  ('class-9', NULL, 'class-9-mathematics',
   'Mathematics',
   'Number systems, algebra, geometry, and statistics aligned with NCERT Class 9.',
   15, '#2563EB', 'Calculator', 1),

  ('class-9', NULL, 'class-9-science',
   'Science',
   'Physics, chemistry, and biology topics from the NCERT Class 9 curriculum.',
   15, '#059669', 'FlaskConical', 2),

  ('class-9', NULL, 'class-9-social-science',
   'Social Science',
   'History, geography, political science, and economics for Class 9.',
   20, '#7C3AED', 'Globe', 3),

  ('class-9', NULL, 'class-9-english',
   'English',
   'Reading comprehension, grammar, literature, and writing skills.',
   10, '#D97706', 'BookOpen', 4),

  ('class-9', NULL, 'class-9-hindi',
   'Hindi',
   'Hindi grammar, literature, and essay writing for Class 9.',
   10, '#DC2626', 'Languages', 5),

  ('class-9', NULL, 'class-9-computer-applications',
   'Computer Applications',
   'Fundamentals of computers, operating systems, and basic programming.',
   8,  '#0891B2', 'Monitor', 6)

ON CONFLICT (slug) DO NOTHING;

-- ── Class 9 Mathematics Chapters ───────────────────────
INSERT INTO eduquest_chapters (subject_id, slug, name, description, day_count, sequence_order, difficulty, question_count)
SELECT s.id, c.slug, c.name, c.description, c.day_count, c.seq, c.difficulty, c.qcount
FROM eduquest_subjects s
JOIN (VALUES
  ('number-systems',            'Number Systems',            'Real numbers, irrational numbers, rational numbers on a number line.', 5, 1, 'medium', 20),
  ('polynomials',               'Polynomials',               'Polynomials in one variable, zeroes of a polynomial, factor theorem.', 5, 2, 'medium', 18),
  ('coordinate-geometry',       'Coordinate Geometry',       'Cartesian coordinate system, plotting points in a plane.', 4, 3, 'easy', 15),
  ('linear-equations',          'Linear Equations in Two Variables','Solutions and graphs of linear equations in two variables.', 5, 4, 'medium', 20),
  ('euclids-geometry',          'Euclid''s Geometry',         'Euclid''s definitions, axioms, and postulates.', 4, 5, 'easy', 12),
  ('lines-and-angles',          'Lines and Angles',          'Pairs of angles, parallel lines, transversal, angle sum property.', 5, 6, 'medium', 18),
  ('triangles',                 'Triangles',                 'Congruence rules, properties of triangle, inequalities.', 6, 7, 'hard', 25),
  ('quadrilaterals',            'Quadrilaterals',             'Properties of parallelogram, mid-point theorem.', 5, 8, 'medium', 20),
  ('circles',                   'Circles',                   'Chords, arcs, angles subtended, cyclic quadrilaterals.', 6, 9, 'hard', 22),
  ('heron-formula',             'Heron''s Formula',           'Area of a triangle by Heron''s formula, area of quadrilateral.', 3, 10, 'easy', 12),
  ('surface-area-volume',       'Surface Area and Volume',   'Surface areas and volumes of cuboids, cylinders, cones, spheres.', 7, 11, 'hard', 28),
  ('statistics',                'Statistics',                'Collection of data, presentation, mean, median, mode.', 5, 12, 'medium', 18),
  ('probability',               'Probability',               'Experimental approach to probability, events, frequency.', 4, 13, 'medium', 15),
  ('constructions',             'Constructions',             'Construction of bisectors, triangles with given conditions.', 4, 14, 'medium', 12),
  ('areas-parallelograms',      'Areas of Parallelograms and Triangles', 'Figures on same base, area theorems.', 4, 15, 'medium', 14)
) AS c(slug, name, description, day_count, seq, difficulty, qcount)
ON (s.slug = 'class-9-mathematics')
ON CONFLICT (subject_id, slug) DO NOTHING;

-- ── Class 9 Science Chapters ───────────────────────────
INSERT INTO eduquest_chapters (subject_id, slug, name, description, day_count, sequence_order, difficulty, question_count)
SELECT s.id, c.slug, c.name, c.description, c.day_count, c.seq, c.difficulty, c.qcount
FROM eduquest_subjects s
JOIN (VALUES
  ('matter-in-surroundings',    'Matter in Our Surroundings',    'States of matter, evaporation, sublimation, interconversion.', 5, 1, 'easy', 18),
  ('is-matter-pure',            'Is Matter Around Us Pure?',     'Mixtures, solutions, colloids, separation techniques.', 5, 2, 'medium', 20),
  ('atoms-molecules',           'Atoms and Molecules',           'Law of conservation, atomic/molecular mass, mole concept.', 6, 3, 'hard', 25),
  ('structure-atom',            'Structure of the Atom',         'Sub-atomic particles, Bohr model, isotopes, isobars.', 6, 4, 'hard', 22),
  ('cell-fundamental',          'The Fundamental Unit of Life',  'Cell theory, plant vs animal cells, organelles.', 5, 5, 'medium', 20),
  ('tissues',                   'Tissues',                       'Plant tissues, animal tissues, their functions.', 5, 6, 'medium', 18),
  ('motion',                    'Motion',                        'Distance, displacement, speed, velocity, acceleration, graphs.', 6, 7, 'medium', 25),
  ('force-laws-motion',         'Force and Laws of Motion',      'Newton''s laws, inertia, momentum, conservation.', 6, 8, 'hard', 25),
  ('gravitation',               'Gravitation',                   'Universal law of gravitation, free fall, weight, Archimedes'' principle.', 6, 9, 'hard', 22),
  ('work-energy',               'Work and Energy',               'Work, power, energy, kinetic and potential energy, conservation.', 5, 10, 'medium', 20),
  ('sound',                     'Sound',                         'Propagation of sound, wave characteristics, echo, SONAR.', 5, 11, 'medium', 18),
  ('natural-resources',         'Natural Resources',             'Air, water, biogeochemical cycles, ozone layer.', 4, 12, 'easy', 15),
  ('improvement-food-resources','Improvement in Food Resources', 'Crop improvement, manure, fertilisers, animal husbandry.', 4, 13, 'easy', 14),
  ('why-do-we-fall-ill',        'Why Do We Fall Ill?',           'Health, disease, pathogens, prevention.', 4, 14, 'easy', 15),
  ('diversity-living-organisms','Diversity in Living Organisms', 'Classification of organisms, taxonomy, five kingdoms.', 5, 15, 'medium', 18)
) AS c(slug, name, description, day_count, seq, difficulty, qcount)
ON (s.slug = 'class-9-science')
ON CONFLICT (subject_id, slug) DO NOTHING;

-- ═══════════════════════════════════════════════════════
-- 2. CLASS 10 SUBJECTS
-- ═══════════════════════════════════════════════════════

INSERT INTO eduquest_subjects
  (track, stream, slug, name, description, chapter_count, color, icon, sequence_order)
VALUES
  ('class-10', NULL, 'class-10-mathematics-standard',
   'Mathematics (Standard)',
   'Complete CBSE Class 10 Math — real numbers through probability.',
   15, '#2563EB', 'Calculator', 1),

  ('class-10', NULL, 'class-10-science',
   'Science',
   'Chemical reactions, life processes, electricity, and more — CBSE Class 10.',
   16, '#059669', 'FlaskConical', 2),

  ('class-10', NULL, 'class-10-social-science',
   'Social Science',
   'India and the contemporary world, resources, governance, economics.',
   24, '#7C3AED', 'Globe', 3),

  ('class-10', NULL, 'class-10-english',
   'English Communicative',
   'First Flight, Footprints without Feet, grammar and writing.',
   12, '#D97706', 'BookOpen', 4),

  ('class-10', NULL, 'class-10-computer-applications',
   'Computer Applications',
   'HTML basics, spreadsheets, networking fundamentals, database intro.',
   8,  '#0891B2', 'Monitor', 5)

ON CONFLICT (slug) DO NOTHING;

-- ── Class 10 Mathematics Chapters ──────────────────────
INSERT INTO eduquest_chapters (subject_id, slug, name, description, day_count, sequence_order, difficulty, question_count)
SELECT s.id, c.slug, c.name, c.description, c.day_count, c.seq, c.difficulty, c.qcount
FROM eduquest_subjects s
JOIN (VALUES
  ('real-numbers',          'Real Numbers',           'Euclid''s division lemma, fundamental theorem, irrational numbers.', 5, 1, 'medium', 20),
  ('polynomials-10',        'Polynomials',            'Zeros of polynomial, relationship with coefficients, division algorithm.', 5, 2, 'medium', 18),
  ('pair-linear-equations', 'Pair of Linear Equations','Graphical and algebraic methods, cross-multiplication.', 6, 3, 'hard', 25),
  ('quadratic-equations',   'Quadratic Equations',    'Standard form, factorisation, completing the square, discriminant.', 6, 4, 'hard', 25),
  ('arithmetic-progressions','Arithmetic Progressions','nth term, sum of first n terms, problems.', 5, 5, 'medium', 20),
  ('triangles-10',          'Triangles',              'Similarity criteria, Thales theorem, Pythagoras theorem.', 6, 6, 'hard', 22),
  ('coordinate-geometry-10','Coordinate Geometry',    'Distance formula, section formula, area of triangle.', 5, 7, 'medium', 18),
  ('trigonometry-intro',    'Introduction to Trigonometry','Trig ratios, identities, applications.', 5, 8, 'medium', 20),
  ('trigonometry-applications','Some Applications of Trigonometry','Heights and distances, angle of elevation and depression.', 4, 9, 'hard', 15),
  ('circles-10',            'Circles',                'Tangents to a circle, number of tangents from a point.', 4, 10, 'medium', 15),
  ('areas-related-circles', 'Areas Related to Circles','Perimeter and area of circle, sector, segment.', 4, 11, 'medium', 14),
  ('surface-area-volume-10','Surface Areas and Volumes','Combination of solids, frustum of a cone.', 6, 12, 'hard', 25),
  ('statistics-10',         'Statistics',             'Mean, median, mode for grouped data, ogive.', 5, 13, 'medium', 18),
  ('probability-10',        'Probability',            'Classical definition, sample space, events.', 4, 14, 'easy', 15),
  ('constructions-10',      'Constructions',          'Dividing a line segment, tangents from external point.', 3, 15, 'medium', 12)
) AS c(slug, name, description, day_count, seq, difficulty, qcount)
ON (s.slug = 'class-10-mathematics-standard')
ON CONFLICT (subject_id, slug) DO NOTHING;

-- ── Class 10 Science Chapters ──────────────────────────
INSERT INTO eduquest_chapters (subject_id, slug, name, description, day_count, sequence_order, difficulty, question_count)
SELECT s.id, c.slug, c.name, c.description, c.day_count, c.seq, c.difficulty, c.qcount
FROM eduquest_subjects s
JOIN (VALUES
  ('chemical-reactions',    'Chemical Reactions and Equations', 'Balancing equations, types of reactions.', 5, 1, 'medium', 20),
  ('acids-bases-salts',     'Acids, Bases and Salts',   'Properties, reactions, pH, salts.', 6, 2, 'hard', 25),
  ('metals-nonmetals',      'Metals and Non-metals',    'Properties, reactivity series, ionic bonds.', 5, 3, 'medium', 20),
  ('carbon-compounds',      'Carbon and its Compounds', 'Covalent bonding, homologous series, reactions of carbon.', 6, 4, 'hard', 25),
  ('life-processes',        'Life Processes',           'Nutrition, respiration, transportation, excretion.', 7, 5, 'hard', 28),
  ('control-coordination',  'Control and Coordination', 'Nervous system, hormones, reflex action.', 5, 6, 'medium', 20),
  ('reproduction',          'How do Organisms Reproduce?','Asexual, sexual reproduction, reproductive health.', 5, 7, 'medium', 20),
  ('heredity-evolution',    'Heredity and Evolution',   'Mendel''s experiments, sex determination, evolution.', 5, 8, 'hard', 20),
  ('light-reflection',      'Light – Reflection and Refraction','Mirror formula, refraction, lens formula, power.', 7, 9, 'hard', 30),
  ('human-eye',             'Human Eye and the Colourful World','Structure, defects, dispersion of light.', 4, 10, 'medium', 15),
  ('electricity',           'Electricity',              'Ohm''s law, resistance, series/parallel circuits, heating effect.', 7, 11, 'hard', 30),
  ('magnetic-effects',      'Magnetic Effects of Current','Magnetic field, motor, generator, electromagnetic induction.', 6, 12, 'hard', 25),
  ('energy-sources',        'Our Environment',          'Ecosystem, food chains, ozone layer depletion.', 4, 13, 'easy', 15),
  ('management-resources',  'Management of Natural Resources','Conservation of forests, water, coal, petroleum.', 3, 14, 'easy', 12),
  ('periodic-classification','Periodic Classification of Elements','Dobereiner, Newlands, Mendeleev, modern periodic table.', 5, 15, 'medium', 18),
  ('chemical-periodic-trends','Periodic Trends',        'Atomic size, metallic character, electronegativity trends.', 4, 16, 'medium', 14)
) AS c(slug, name, description, day_count, seq, difficulty, qcount)
ON (s.slug = 'class-10-science')
ON CONFLICT (subject_id, slug) DO NOTHING;

-- ═══════════════════════════════════════════════════════
-- 3. CLASS 11 — SCIENCE STREAM SUBJECTS
-- ═══════════════════════════════════════════════════════

INSERT INTO eduquest_subjects
  (track, stream, slug, name, description, chapter_count, color, icon, sequence_order)
VALUES
  ('class-11', 'science', 'class-11-physics',
   'Physics',
   'Mechanics, kinematics, laws of motion, work/energy, thermodynamics, waves.',
   15, '#2563EB', 'Zap', 1),

  ('class-11', 'science', 'class-11-chemistry',
   'Chemistry',
   'Structure of atom, periodic table, chemical bonding, equilibrium, organic chemistry.',
   14, '#059669', 'FlaskConical', 2),

  ('class-11', 'science', 'class-11-mathematics',
   'Mathematics',
   'Sets, functions, trigonometry, complex numbers, calculus, statistics.',
   16, '#7C3AED', 'Calculator', 3),

  ('class-11', 'science', 'class-11-biology',
   'Biology',
   'Diversity of life, structural organisation, cell biology, genetics, ecology.',
   22, '#D97706', 'Leaf', 4),

  ('class-11', 'science', 'class-11-computer-science',
   'Computer Science',
   'Python programming, data structures, Boolean algebra, networking basics.',
   10, '#0891B2', 'Code2', 5)

ON CONFLICT (slug) DO NOTHING;

-- ── Class 11 Physics Chapters ──────────────────────────
INSERT INTO eduquest_chapters (subject_id, slug, name, description, day_count, sequence_order, difficulty, question_count)
SELECT s.id, c.slug, c.name, c.description, c.day_count, c.seq, c.difficulty, c.qcount
FROM eduquest_subjects s
JOIN (VALUES
  ('physical-world',            'Physical World',                'Scope and excitement of physics, nature of physical laws.', 3, 1, 'easy', 10),
  ('units-measurements',        'Units and Measurements',        'SI system, significant figures, errors, dimensions.', 5, 2, 'medium', 20),
  ('motion-straight-line',      'Motion in a Straight Line',     'Position, path length, velocity, acceleration, kinematic equations.', 6, 3, 'medium', 25),
  ('motion-plane',              'Motion in a Plane',             'Vectors, projectile motion, circular motion.', 7, 4, 'hard', 28),
  ('laws-of-motion',            'Laws of Motion',                'Newton''s laws, momentum, friction, circular motion dynamics.', 7, 5, 'hard', 28),
  ('work-energy-power',         'Work, Energy and Power',        'Work-energy theorem, potential energy, conservation, power.', 6, 6, 'hard', 25),
  ('system-particles-rotation', 'System of Particles and Rotational Motion','Centre of mass, angular momentum, torque, moment of inertia.', 8, 7, 'hard', 30),
  ('gravitation-11',            'Gravitation',                   'Kepler''s laws, universal gravitation, escape velocity, satellites.', 6, 8, 'hard', 25),
  ('mechanical-properties-solids','Mechanical Properties of Solids','Stress, strain, elastic moduli, Hooke''s law.', 5, 9, 'medium', 18),
  ('mechanical-properties-fluids','Mechanical Properties of Fluids','Pressure, viscosity, Bernoulli''s principle, surface tension.', 6, 10, 'hard', 22),
  ('thermal-properties',        'Thermal Properties of Matter',  'Temperature, specific heat, thermal expansion, calorimetry.', 5, 11, 'medium', 20),
  ('thermodynamics',            'Thermodynamics',                'Zeroth, first, second laws, heat engines, refrigerators.', 6, 12, 'hard', 25),
  ('kinetic-theory',            'Kinetic Theory',                'Molecular speeds, equipartition, degrees of freedom.', 5, 13, 'hard', 18),
  ('oscillations',              'Oscillations',                  'SHM, energy, oscillation of spring, pendulum.', 6, 14, 'hard', 22),
  ('waves',                     'Waves',                         'Transverse and longitudinal waves, speed, beats, Doppler effect.', 7, 15, 'hard', 25)
) AS c(slug, name, description, day_count, seq, difficulty, qcount)
ON (s.slug = 'class-11-physics')
ON CONFLICT (subject_id, slug) DO NOTHING;

-- ── Class 11 Chemistry Chapters ────────────────────────
INSERT INTO eduquest_chapters (subject_id, slug, name, description, day_count, sequence_order, difficulty, question_count)
SELECT s.id, c.slug, c.name, c.description, c.day_count, c.seq, c.difficulty, c.qcount
FROM eduquest_subjects s
JOIN (VALUES
  ('basic-concepts-chemistry',  'Some Basic Concepts of Chemistry',  'Mole concept, stoichiometry, molarity.', 5, 1, 'medium', 20),
  ('structure-of-atom-11',      'Structure of Atom',                 'Bohr model, quantum numbers, orbitals, Aufbau principle.', 6, 2, 'hard', 25),
  ('periodic-table-11',         'Classification of Elements and Periodicity','Periodic trends: atomic radius, IE, electron affinity.', 5, 3, 'medium', 20),
  ('chemical-bonding-11',       'Chemical Bonding and Molecular Structure','VSEPR, hybridisation, molecular orbital theory.', 7, 4, 'hard', 28),
  ('states-of-matter',          'States of Matter',                  'Gas laws, ideal gas equation, kinetic molecular theory.', 5, 5, 'medium', 20),
  ('thermodynamics-chem',       'Thermodynamics',                    'Enthalpy, entropy, Gibbs energy, Hess''s law.', 6, 6, 'hard', 25),
  ('equilibrium',               'Equilibrium',                       'Le Chatelier''s principle, Kp, Kc, acids and bases, buffer.', 7, 7, 'hard', 28),
  ('redox-reactions',           'Redox Reactions',                   'Oxidation number, balancing redox equations.', 4, 8, 'medium', 18),
  ('hydrogen',                  'Hydrogen',                          'Properties, preparation, uses of hydrogen and its compounds.', 3, 9, 'easy', 12),
  ('s-block-elements',          's-Block Elements',                  'Group 1 and 2 elements, anomalous behaviour.', 4, 10, 'medium', 15),
  ('p-block-elements-11',       'Some p-Block Elements',             'Groups 13 and 14, boron, carbon compounds.', 4, 11, 'medium', 15),
  ('organic-basic',             'Organic Chemistry — Basic Principles','IUPAC nomenclature, isomerism, reactive intermediates.', 5, 12, 'hard', 22),
  ('hydrocarbons',              'Hydrocarbons',                      'Alkanes, alkenes, alkynes, aromatic hydrocarbons.', 6, 13, 'hard', 25),
  ('environmental-chemistry',   'Environmental Chemistry',           'Air/water/soil pollution, greenhouse effect, strategies.', 3, 14, 'easy', 12)
) AS c(slug, name, description, day_count, seq, difficulty, qcount)
ON (s.slug = 'class-11-chemistry')
ON CONFLICT (subject_id, slug) DO NOTHING;

-- ── Class 11 Mathematics Chapters ─────────────────────
INSERT INTO eduquest_chapters (subject_id, slug, name, description, day_count, sequence_order, difficulty, question_count)
SELECT s.id, c.slug, c.name, c.description, c.day_count, c.seq, c.difficulty, c.qcount
FROM eduquest_subjects s
JOIN (VALUES
  ('sets',                   'Sets',                          'Types of sets, operations, Venn diagrams, De Morgan''s law.', 4, 1, 'easy', 15),
  ('relations-functions',    'Relations and Functions',       'Ordered pairs, Cartesian product, types of functions.', 5, 2, 'medium', 20),
  ('trig-functions-11',      'Trigonometric Functions',       'Radian measure, trig functions, identities, graphs.', 7, 3, 'hard', 28),
  ('complex-numbers',        'Complex Numbers and Quadratic Equations','Argand plane, modulus, argument, roots of quadratic.', 6, 4, 'hard', 25),
  ('linear-inequalities',    'Linear Inequalities',           'Graphical representation, solutions in one and two variables.', 4, 5, 'medium', 15),
  ('permutations-combinations','Permutations and Combinations','Fundamental principle, factorial, nPr, nCr.', 5, 6, 'medium', 22),
  ('binomial-theorem',       'Binomial Theorem',              'Pascal''s triangle, general term, middle term.', 5, 7, 'hard', 20),
  ('sequences-series',       'Sequences and Series',          'AP, GP, AGP, sum of special series.', 6, 8, 'hard', 25),
  ('straight-lines',         'Straight Lines',                'Slope, intercepts, forms of equations, angle between lines.', 5, 9, 'medium', 20),
  ('conic-sections',         'Conic Sections',                'Circle, parabola, ellipse, hyperbola — standard equations.', 7, 10, 'hard', 28),
  ('3d-intro',               'Introduction to 3D Geometry',   'Coordinate axes, distance formula in 3D, section formula.', 4, 11, 'medium', 15),
  ('limits-derivatives',     'Limits and Derivatives',        'Algebra of limits, derivative of standard functions.', 7, 12, 'hard', 28),
  ('statistics-11',          'Statistics',                    'Measures of dispersion: range, variance, standard deviation.', 5, 13, 'medium', 20),
  ('probability-11',         'Probability',                   'Events, sample space, axiomatic probability.', 5, 14, 'medium', 20),
  ('mathematical-reasoning', 'Mathematical Reasoning',        'Statements, logical connectives, contradiction, converse.', 3, 15, 'easy', 12),
  ('mathematical-induction', 'Principle of Mathematical Induction','Induction principle, applications.', 3, 16, 'medium', 12)
) AS c(slug, name, description, day_count, seq, difficulty, qcount)
ON (s.slug = 'class-11-mathematics')
ON CONFLICT (subject_id, slug) DO NOTHING;

-- ═══════════════════════════════════════════════════════
-- 4. CLASS 11 — COMMERCE STREAM SUBJECTS
-- ═══════════════════════════════════════════════════════

INSERT INTO eduquest_subjects
  (track, stream, slug, name, description, chapter_count, color, icon, sequence_order)
VALUES
  ('class-11', 'commerce', 'class-11-accountancy',
   'Accountancy',
   'Accounting principles, journal entries, ledger, trial balance, financial statements.',
   15, '#059669', 'BookCheck', 1),

  ('class-11', 'commerce', 'class-11-business-studies',
   'Business Studies',
   'Nature of business, forms of organisation, business finance, marketing.',
   12, '#2563EB', 'Briefcase', 2),

  ('class-11', 'commerce', 'class-11-economics',
   'Economics',
   'Micro- and macro-economics: demand, supply, national income, banking.',
   20, '#D97706', 'TrendingUp', 3),

  ('class-11', 'commerce', 'class-11-mathematics-commerce',
   'Mathematics (Commerce)',
   'Sets, relations, matrices, statistics, and linear programming.',
   14, '#7C3AED', 'Calculator', 4)

ON CONFLICT (slug) DO NOTHING;

-- ── Class 11 Accountancy Chapters ─────────────────────
INSERT INTO eduquest_chapters (subject_id, slug, name, description, day_count, sequence_order, difficulty, question_count)
SELECT s.id, c.slug, c.name, c.description, c.day_count, c.seq, c.difficulty, c.qcount
FROM eduquest_subjects s
JOIN (VALUES
  ('intro-accounting',       'Introduction to Accounting',     'Meaning, objectives, scope, limitations.', 3, 1, 'easy', 12),
  ('accounting-process',     'Theory Base of Accounting',      'GAAP, assumptions, accounting standards.', 4, 2, 'medium', 15),
  ('recording-transactions', 'Recording of Transactions I',    'Vouchers, books of original entry, journal.', 5, 3, 'medium', 20),
  ('recording-transactions-2','Recording of Transactions II',  'Cash book, petty cash book, subsidiary books.', 5, 4, 'medium', 20),
  ('bank-reconciliation',    'Bank Reconciliation Statement',  'Causes of difference, preparation of BRS.', 4, 5, 'hard', 18),
  ('trial-balance',          'Trial Balance and Rectification','Preparation, errors and their rectification.', 5, 6, 'hard', 20),
  ('depreciation',           'Depreciation, Provisions and Reserves','SLM, WDV methods, provisions.', 5, 7, 'hard', 22),
  ('bills-of-exchange',      'Bill of Exchange',               'Meaning, types, dishonour, accommodation bills.', 4, 8, 'hard', 18),
  ('financial-statements-1', 'Financial Statements I',         'Trading account, profit & loss account.', 5, 9, 'medium', 20),
  ('financial-statements-2', 'Financial Statements II',        'Balance sheet, adjustments, closing entries.', 6, 10, 'hard', 25),
  ('accounts-incomplete',    'Accounts from Incomplete Records','Single entry system, statement of affairs.', 4, 11, 'hard', 15),
  ('partnership-accounts',   'Accounts of Partnership Firms',  'Partnership deed, fixed/fluctuating capital.', 6, 12, 'hard', 25),
  ('goodwill',               'Goodwill: Nature and Valuation', 'Methods of goodwill valuation.', 3, 13, 'medium', 12),
  ('reconstitution-firm',    'Reconstitution of a Partnership Firm','Admission, retirement, death of partner.', 5, 14, 'hard', 22),
  ('dissolution',            'Dissolution of Partnership Firm','Realization account, settlement.', 4, 15, 'hard', 15)
) AS c(slug, name, description, day_count, seq, difficulty, qcount)
ON (s.slug = 'class-11-accountancy')
ON CONFLICT (subject_id, slug) DO NOTHING;

-- ═══════════════════════════════════════════════════════
-- 5. CLASS 12 — SCIENCE STREAM SUBJECTS
-- ═══════════════════════════════════════════════════════

INSERT INTO eduquest_subjects
  (track, stream, slug, name, description, chapter_count, color, icon, sequence_order)
VALUES
  ('class-12', 'science', 'class-12-physics',
   'Physics',
   'Electrostatics, current electricity, magnetism, optics, modern physics, semiconductors.',
   15, '#2563EB', 'Zap', 1),

  ('class-12', 'science', 'class-12-chemistry',
   'Chemistry',
   'Solid state, solutions, electrochemistry, kinetics, p/d-block, biomolecules.',
   16, '#059669', 'FlaskConical', 2),

  ('class-12', 'science', 'class-12-mathematics',
   'Mathematics',
   'Relations, matrices, calculus, vectors, probability — full NCERT Class 12.',
   13, '#7C3AED', 'Calculator', 3),

  ('class-12', 'science', 'class-12-biology',
   'Biology',
   'Reproduction, genetics, evolution, biotechnology, ecology for Class 12.',
   16, '#D97706', 'Leaf', 4),

  ('class-12', 'science', 'class-12-computer-science',
   'Computer Science',
   'Python advanced, DBMS, networking, web development, cybersecurity basics.',
   10, '#0891B2', 'Code2', 5)

ON CONFLICT (slug) DO NOTHING;

-- ── Class 12 Physics Chapters ──────────────────────────
INSERT INTO eduquest_chapters (subject_id, slug, name, description, day_count, sequence_order, difficulty, question_count)
SELECT s.id, c.slug, c.name, c.description, c.day_count, c.seq, c.difficulty, c.qcount
FROM eduquest_subjects s
JOIN (VALUES
  ('electric-charges-fields', 'Electric Charges and Fields',   'Coulomb''s law, field lines, Gauss''s law.', 7, 1, 'hard', 28),
  ('electrostatic-potential', 'Electrostatic Potential and Capacitance','Potential, capacitors, energy stored.', 6, 2, 'hard', 25),
  ('current-electricity',     'Current Electricity',           'Ohm''s law, Kirchhoff''s laws, Wheatstone bridge.', 7, 3, 'hard', 28),
  ('moving-charges-magnetism','Moving Charges and Magnetism',  'Biot-Savart law, Ampere''s law, cyclotron.', 7, 4, 'hard', 28),
  ('magnetism-matter',        'Magnetism and Matter',          'Magnetic dipole, para/dia/ferromagnetism.', 5, 5, 'medium', 18),
  ('electromagnetic-induction','Electromagnetic Induction',    'Faraday''s law, Lenz''s law, motional EMF.', 6, 6, 'hard', 25),
  ('alternating-current',     'Alternating Current',           'RMS, phasors, LC oscillations, transformer.', 7, 7, 'hard', 28),
  ('em-waves',                'Electromagnetic Waves',         'Displacement current, EM spectrum, properties.', 4, 8, 'medium', 15),
  ('ray-optics',              'Ray Optics and Optical Instruments','Mirror/lens formulae, microscope, telescope.', 7, 9, 'hard', 30),
  ('wave-optics',             'Wave Optics',                   'Huygens'' principle, interference, diffraction, polarisation.', 6, 10, 'hard', 25),
  ('dual-nature',             'Dual Nature of Radiation and Matter','Photoelectric effect, de Broglie wavelength.', 5, 11, 'hard', 20),
  ('atoms-12',                'Atoms',                         'Rutherford, Bohr model, energy levels, spectra.', 5, 12, 'hard', 20),
  ('nuclei',                  'Nuclei',                        'Composition, mass defect, binding energy, radioactivity.', 5, 13, 'hard', 20),
  ('semiconductor-devices',   'Semiconductor Electronics',     'p-n junction, diode, transistor, logic gates.', 6, 14, 'hard', 25),
  ('communication-systems',   'Communication Systems',         'Modulation, AM, FM, bandwidth, internet.', 3, 15, 'medium', 12)
) AS c(slug, name, description, day_count, seq, difficulty, qcount)
ON (s.slug = 'class-12-physics')
ON CONFLICT (subject_id, slug) DO NOTHING;

-- ── Class 12 Mathematics Chapters ─────────────────────
INSERT INTO eduquest_chapters (subject_id, slug, name, description, day_count, sequence_order, difficulty, question_count)
SELECT s.id, c.slug, c.name, c.description, c.day_count, c.seq, c.difficulty, c.qcount
FROM eduquest_subjects s
JOIN (VALUES
  ('relations-functions-12',   'Relations and Functions',      'Types of relations and functions, composition, inverse.', 5, 1, 'medium', 20),
  ('inverse-trig',             'Inverse Trigonometric Functions','Definitions, properties, principal values.', 5, 2, 'medium', 20),
  ('matrices-12',              'Matrices',                     'Types, operations, transpose, invertible matrices.', 6, 3, 'hard', 25),
  ('determinants',             'Determinants',                 'Properties, cofactors, adjoint, inverse, Cramer''s rule.', 6, 4, 'hard', 25),
  ('continuity-differentiability','Continuity and Differentiability','Chain rule, implicit, parametric, higher derivatives.', 7, 5, 'hard', 28),
  ('applications-derivatives', 'Applications of Derivatives',  'Rate of change, tangents, monotonicity, maxima/minima.', 7, 6, 'hard', 28),
  ('integrals',                'Integrals',                    'Integration by parts, partial fractions, definite integrals.', 8, 7, 'hard', 32),
  ('applications-integrals',   'Applications of Integrals',   'Area under curves, between curves.', 5, 8, 'hard', 20),
  ('differential-equations',   'Differential Equations',      'Formation, solutions, variable separable, linear DE.', 6, 9, 'hard', 25),
  ('vector-algebra',           'Vector Algebra',               'Types, dot product, cross product, scalar triple product.', 5, 10, 'medium', 20),
  ('3d-geometry',              'Three Dimensional Geometry',   'Direction cosines, lines, planes, angles.', 6, 11, 'hard', 25),
  ('linear-programming',       'Linear Programming',           'Feasible region, corner point, maximisation/minimisation.', 4, 12, 'medium', 18),
  ('probability-12',           'Probability',                  'Conditional probability, Bayes'' theorem, random variables.', 6, 13, 'hard', 25)
) AS c(slug, name, description, day_count, seq, difficulty, qcount)
ON (s.slug = 'class-12-mathematics')
ON CONFLICT (subject_id, slug) DO NOTHING;

-- ═══════════════════════════════════════════════════════
-- 6. ENGINEERING TRACK — PROGRAMMING LANGUAGE SUBJECTS
-- Each language is treated as a "subject" with day-wise chapters.
-- ═══════════════════════════════════════════════════════

INSERT INTO eduquest_subjects
  (track, stream, slug, name, description, chapter_count, color, icon, sequence_order)
VALUES
  ('engineering', NULL, 'eng-python',
   'Python',
   'From basics to data structures, OOP, file handling, and intro to data science.',
   12, '#3B82F6', 'Code2', 1),

  ('engineering', NULL, 'eng-javascript',
   'JavaScript',
   'ES6+, async/await, DOM, Node.js fundamentals, and modern web patterns.',
   12, '#F59E0B', 'Globe', 2),

  ('engineering', NULL, 'eng-java',
   'Java',
   'OOP, collections, generics, multithreading, Spring Boot essentials.',
   14, '#DC2626', 'Coffee', 3),

  ('engineering', NULL, 'eng-cpp',
   'C++',
   'STL, memory management, OOP, templates, competitive programming patterns.',
   13, '#7C3AED', 'Cpu', 4),

  ('engineering', NULL, 'eng-typescript',
   'TypeScript',
   'Type system, interfaces, generics, decorators, full-stack TypeScript.',
   10, '#0891B2', 'FileCode2', 5),

  ('engineering', NULL, 'eng-rust',
   'Rust',
   'Ownership, borrowing, lifetimes, traits, async Rust, WASM targets.',
   12, '#D97706', 'Shield', 6),

  ('engineering', NULL, 'eng-golang',
   'Go (Golang)',
   'Goroutines, channels, Go modules, REST APIs, microservices.',
   11, '#059669', 'Server', 7),

  ('engineering', NULL, 'eng-sql',
   'SQL & Databases',
   'Relational databases, joins, indexes, transactions, PostgreSQL in production.',
   10, '#6366F1', 'Database', 8),

  ('engineering', NULL, 'eng-react',
   'React & Next.js',
   'Components, hooks, state management, server components, full-stack apps.',
   12, '#38BDF8', 'Layers', 9),

  ('engineering', NULL, 'eng-dsa',
   'Data Structures & Algorithms',
   'Arrays, trees, graphs, sorting, dynamic programming, competitive coding.',
   16, '#EC4899', 'GitBranch', 10),

  ('engineering', NULL, 'eng-system-design',
   'System Design',
   'Scalability, load balancing, caching, databases, microservices, CAP theorem.',
   10, '#14B8A6', 'Network', 11),

  ('engineering', NULL, 'eng-devops',
   'DevOps & Cloud',
   'Docker, Kubernetes, CI/CD, AWS basics, monitoring, infra-as-code.',
   10, '#F97316', 'Cloud', 12)

ON CONFLICT (slug) DO NOTHING;

-- ── Python Chapters ────────────────────────────────────
INSERT INTO eduquest_chapters (subject_id, slug, name, description, day_count, sequence_order, difficulty, question_count)
SELECT s.id, c.slug, c.name, c.description, c.day_count, c.seq, c.difficulty, c.qcount
FROM eduquest_subjects s
JOIN (VALUES
  ('py-basics',           'Python Basics',                'Variables, data types, operators, input/output.', 5, 1, 'easy', 20),
  ('py-control-flow',     'Control Flow',                 'if/elif/else, for/while loops, break, continue.', 5, 2, 'easy', 20),
  ('py-functions',        'Functions',                    'Defining functions, args, kwargs, scope, lambda, recursion.', 6, 3, 'medium', 25),
  ('py-data-structures',  'Lists, Tuples, Dicts, Sets',   'Core data structures, list comprehensions, dict methods.', 6, 4, 'medium', 25),
  ('py-oop',              'Object-Oriented Python',       'Classes, inheritance, magic methods, encapsulation.', 7, 5, 'hard', 28),
  ('py-file-io',          'File Handling & Exceptions',   'Reading/writing files, try/except, custom exceptions.', 5, 6, 'medium', 20),
  ('py-modules',          'Modules and Packages',         'import system, __init__.py, pip, virtual environments.', 4, 7, 'medium', 15),
  ('py-itertools',        'Iterators and Generators',     'iter/next, generator functions, yield, lazy evaluation.', 5, 8, 'hard', 20),
  ('py-decorators',       'Decorators and Closures',      'First-class functions, closures, functools.wraps.', 5, 9, 'hard', 18),
  ('py-concurrency',      'Concurrency',                  'threading, multiprocessing, asyncio, event loops.', 6, 10, 'hard', 22),
  ('py-data-science',     'Intro to Data Science',        'NumPy, pandas, matplotlib basics.', 6, 11, 'medium', 20),
  ('py-testing',          'Testing in Python',            'unittest, pytest, mocking, TDD introduction.', 4, 12, 'medium', 15)
) AS c(slug, name, description, day_count, seq, difficulty, qcount)
ON (s.slug = 'eng-python')
ON CONFLICT (subject_id, slug) DO NOTHING;

-- ── DSA Chapters (most important for competitive coding) ─
INSERT INTO eduquest_chapters (subject_id, slug, name, description, day_count, sequence_order, difficulty, question_count)
SELECT s.id, c.slug, c.name, c.description, c.day_count, c.seq, c.difficulty, c.qcount
FROM eduquest_subjects s
JOIN (VALUES
  ('dsa-arrays',          'Arrays and Strings',           'Sliding window, two pointers, prefix sums.', 6, 1, 'medium', 30),
  ('dsa-linked-lists',    'Linked Lists',                 'Singly/doubly/circular linked lists, Floyd cycle detection.', 5, 2, 'medium', 25),
  ('dsa-stacks-queues',   'Stacks and Queues',            'Implementation, monotonic stack, BFS using queue.', 5, 3, 'medium', 22),
  ('dsa-trees',           'Binary Trees',                 'Traversals, BST, AVL trees, segment trees.', 7, 4, 'hard', 30),
  ('dsa-heaps',           'Heaps and Priority Queues',    'Min/max heaps, heap sort, top-K problems.', 5, 5, 'hard', 20),
  ('dsa-graphs',          'Graphs',                       'BFS/DFS, shortest paths (Dijkstra, Bellman-Ford), MST.', 8, 6, 'hard', 35),
  ('dsa-sorting',         'Sorting Algorithms',           'Merge sort, quicksort, counting sort, radix sort.', 5, 7, 'medium', 22),
  ('dsa-searching',       'Searching Algorithms',         'Binary search and its patterns/variants.', 5, 8, 'medium', 25),
  ('dsa-dynamic-prog',    'Dynamic Programming',          'Memoisation, tabulation, classic DP patterns.', 8, 9, 'hard', 35),
  ('dsa-greedy',          'Greedy Algorithms',            'Activity selection, interval scheduling, Huffman coding.', 5, 10, 'hard', 20),
  ('dsa-backtracking',    'Backtracking',                 'N-Queens, Sudoku solver, subset/permutation generation.', 5, 11, 'hard', 20),
  ('dsa-bit-manipulation','Bit Manipulation',             'XOR tricks, bit masks, counting set bits.', 4, 12, 'hard', 18),
  ('dsa-tries',           'Tries and Advanced Trees',     'Prefix trees, suffix arrays, segment trees with lazy.', 5, 13, 'hard', 18),
  ('dsa-complexity',      'Time and Space Complexity',    'Big-O notation, amortized analysis, trade-offs.', 4, 14, 'medium', 15),
  ('dsa-math',            'Mathematical Algorithms',      'Prime sieves, GCD, modular arithmetic, combinatorics.', 5, 15, 'hard', 20),
  ('dsa-patterns',        'Problem Solving Patterns',     'Competitive programming strategies, contest prep.', 5, 16, 'hard', 20)
) AS c(slug, name, description, day_count, seq, difficulty, qcount)
ON (s.slug = 'eng-dsa')
ON CONFLICT (subject_id, slug) DO NOTHING;

-- ── JavaScript Chapters ────────────────────────────────
INSERT INTO eduquest_chapters (subject_id, slug, name, description, day_count, sequence_order, difficulty, question_count)
SELECT s.id, c.slug, c.name, c.description, c.day_count, c.seq, c.difficulty, c.qcount
FROM eduquest_subjects s
JOIN (VALUES
  ('js-fundamentals',     'JS Fundamentals',              'Variables, types, operators, coercion, strict mode.', 5, 1, 'easy', 20),
  ('js-functions',        'Functions and Scope',          'Closures, IIFE, arrow functions, this binding.', 6, 2, 'medium', 25),
  ('js-async',            'Asynchronous JavaScript',      'Callbacks, Promises, async/await, event loop.', 7, 3, 'hard', 28),
  ('js-dom',              'DOM and Browser APIs',         'DOM manipulation, events, fetch, storage, workers.', 6, 4, 'medium', 22),
  ('js-es6-patterns',     'ES6+ Patterns',                'Destructuring, spread, generators, proxy, Reflect.', 5, 5, 'medium', 20),
  ('js-modules',          'Modules and Tooling',          'ESM, CommonJS, Webpack, Vite, bundlers.', 4, 6, 'medium', 15),
  ('js-oop',              'OOP in JavaScript',            'Prototypes, classes, mixins, design patterns.', 6, 7, 'hard', 25),
  ('js-fp',               'Functional Programming',       'Pure functions, immutability, monads, Ramda.', 5, 8, 'hard', 20),
  ('js-node',             'Node.js Fundamentals',         'Event loop, streams, fs, crypto, CLI tools.', 6, 9, 'medium', 22),
  ('js-rest-api',         'Building REST APIs',           'Express.js, middleware, routing, authentication.', 6, 10, 'medium', 22),
  ('js-testing',          'Testing JavaScript',           'Jest, Vitest, RTL, E2E with Playwright.', 5, 11, 'medium', 18),
  ('js-performance',      'Performance and Security',     'Memoisation, Web Workers, XSS/CSRF prevention.', 4, 12, 'hard', 15)
) AS c(slug, name, description, day_count, seq, difficulty, qcount)
ON (s.slug = 'eng-javascript')
ON CONFLICT (subject_id, slug) DO NOTHING;

-- ── Update chapter_count on subjects to reflect actual chapter counts ─────
UPDATE eduquest_subjects s
SET    chapter_count = (
  SELECT COUNT(*) FROM eduquest_chapters c WHERE c.subject_id = s.id
);
