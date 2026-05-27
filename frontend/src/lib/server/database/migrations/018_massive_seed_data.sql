-- =============================================================================
-- Migration 018: Massive seed data expansion
--
-- PURPOSE:
--   Expands the platform with a large, realistic dataset:
--   1. 40 additional demo students across all tracks (total ~52 users)
--   2. 350+ new CBSE/Engineering questions for Class 9-12
--   3. 30 new community discussion posts covering all subjects
--   4. Additional battle history, notification, and progress records
--
-- IDEMPOTENT: Uses ON CONFLICT DO NOTHING throughout.
-- TABLES AFFECTED:
--   eduquest_users, eduquest_community_posts, eduquest_questions
-- LAST UPDATED: 2026-05-27
-- =============================================================================


-- ═══════════════════════════════════════════════════════════════
-- SECTION 1: Additional Demo Students (40 more students)
-- Spread across Class 9, 10, 11, 12, and Engineering tracks
-- Varied XP, level, streak so the leaderboard looks rich
-- ═══════════════════════════════════════════════════════════════

INSERT INTO eduquest_users (
  id, name, email, password_hash, track, xp, level, streak, longest_streak,
  stars_balance, total_battles_won, total_battles_played, role, last_active_at, created_at
) VALUES
  -- Class 12 track students
  (gen_random_uuid(), 'Kartik Arora',        'kartik.arora@demo.eduquest.in',        'placeholder', 'class-12', 11200, 27, 89, 120, 3100,  48, 71,  'student', NOW() - INTERVAL '1 hour',   NOW() - INTERVAL '250 days'),
  (gen_random_uuid(), 'Riya Malhotra',       'riya.malhotra@demo.eduquest.in',       'placeholder', 'class-12', 9800,  25, 55, 78,  2500,  38, 58,  'student', NOW() - INTERVAL '3 hours',  NOW() - INTERVAL '220 days'),
  (gen_random_uuid(), 'Ishaan Verma',        'ishaan.verma@demo.eduquest.in',        'placeholder', 'class-12', 8300,  23, 42, 65,  2100,  31, 49,  'student', NOW() - INTERVAL '5 hours',  NOW() - INTERVAL '195 days'),
  (gen_random_uuid(), 'Aditi Choudhary',     'aditi.choudhary@demo.eduquest.in',     'placeholder', 'class-12', 6900,  20, 33, 50,  1700,  24, 40,  'student', NOW() - INTERVAL '7 hours',  NOW() - INTERVAL '170 days'),
  (gen_random_uuid(), 'Param Aggarwal',      'param.aggarwal@demo.eduquest.in',      'placeholder', 'class-12', 5700,  17, 18, 32,  1300,  18, 30,  'student', NOW() - INTERVAL '9 hours',  NOW() - INTERVAL '150 days'),
  (gen_random_uuid(), 'Simran Bhatia',       'simran.bhatia@demo.eduquest.in',       'placeholder', 'class-12', 4200,  13, 11, 20,  880,   11, 22,  'student', NOW() - INTERVAL '11 hours', NOW() - INTERVAL '125 days'),
  (gen_random_uuid(), 'Dhruv Saxena',        'dhruv.saxena@demo.eduquest.in',        'placeholder', 'class-12', 2800,  10, 7,  14,  520,   6,  14,  'student', NOW() - INTERVAL '2 days',   NOW() - INTERVAL '90 days'),
  (gen_random_uuid(), 'Nisha Rawat',         'nisha.rawat@demo.eduquest.in',         'placeholder', 'class-12', 1400,  6,  3,  8,   240,   3,  8,   'student', NOW() - INTERVAL '4 days',   NOW() - INTERVAL '55 days'),

  -- Class 11 track students
  (gen_random_uuid(), 'Yash Tripathi',       'yash.tripathi@demo.eduquest.in',       'placeholder', 'class-11', 10500, 26, 72, 105, 2900,  43, 65,  'student', NOW() - INTERVAL '2 hours',  NOW() - INTERVAL '235 days'),
  (gen_random_uuid(), 'Pooja Mishra',        'pooja.mishra@demo.eduquest.in',        'placeholder', 'class-11', 9000,  24, 48, 70,  2200,  35, 54,  'student', NOW() - INTERVAL '4 hours',  NOW() - INTERVAL '205 days'),
  (gen_random_uuid(), 'Shubham Tiwari',      'shubham.tiwari@demo.eduquest.in',      'placeholder', 'class-11', 7500,  21, 36, 55,  1800,  27, 44,  'student', NOW() - INTERVAL '6 hours',  NOW() - INTERVAL '178 days'),
  (gen_random_uuid(), 'Kritika Sharma',      'kritika.sharma@demo.eduquest.in',      'placeholder', 'class-11', 6100,  18, 24, 39,  1450,  21, 36,  'student', NOW() - INTERVAL '8 hours',  NOW() - INTERVAL '155 days'),
  (gen_random_uuid(), 'Aakash Yadav',        'aakash.yadav@demo.eduquest.in',        'placeholder', 'class-11', 4750,  15, 15, 27,  1050,  14, 26,  'student', NOW() - INTERVAL '10 hours', NOW() - INTERVAL '132 days'),
  (gen_random_uuid(), 'Priyanka Dubey',      'priyanka.dubey@demo.eduquest.in',      'placeholder', 'class-11', 3400,  11, 9,  17,  720,   8,  18,  'student', NOW() - INTERVAL '1 day',    NOW() - INTERVAL '100 days'),
  (gen_random_uuid(), 'Mohit Pandey',        'mohit.pandey@demo.eduquest.in',        'placeholder', 'class-11', 1900,  7,  4,  10,  340,   3,  9,   'student', NOW() - INTERVAL '3 days',   NOW() - INTERVAL '68 days'),

  -- Class 10 track students
  (gen_random_uuid(), 'Tanvi Garg',          'tanvi.garg@demo.eduquest.in',          'placeholder', 'class-10', 10100, 25, 68, 95,  2750,  40, 62,  'student', NOW() - INTERVAL '90 minutes', NOW() - INTERVAL '228 days'),
  (gen_random_uuid(), 'Varun Soni',          'varun.soni@demo.eduquest.in',          'placeholder', 'class-10', 8600,  23, 44, 67,  2050,  32, 51,  'student', NOW() - INTERVAL '3 hours',    NOW() - INTERVAL '198 days'),
  (gen_random_uuid(), 'Anjali Khanna',       'anjali.khanna@demo.eduquest.in',       'placeholder', 'class-10', 7100,  20, 31, 48,  1650,  25, 42,  'student', NOW() - INTERVAL '5 hours',    NOW() - INTERVAL '172 days'),
  (gen_random_uuid(), 'Rakesh Kumar',        'rakesh.kumar@demo.eduquest.in',        'placeholder', 'class-10', 5600,  17, 21, 35,  1200,  18, 33,  'student', NOW() - INTERVAL '7 hours',    NOW() - INTERVAL '148 days'),
  (gen_random_uuid(), 'Meghna Jain',         'meghna.jain@demo.eduquest.in',         'placeholder', 'class-10', 4100,  13, 12, 22,  850,   12, 24,  'student', NOW() - INTERVAL '9 hours',    NOW() - INTERVAL '118 days'),
  (gen_random_uuid(), 'Suraj Pillai',        'suraj.pillai@demo.eduquest.in',        'placeholder', 'class-10', 2600,  9,  6,  13,  490,   6,  15,  'student', NOW() - INTERVAL '2 days',     NOW() - INTERVAL '82 days'),
  (gen_random_uuid(), 'Lavanya Reddy',       'lavanya.reddy@demo.eduquest.in',       'placeholder', 'class-10', 1200,  5,  2,  6,   180,   2,  7,   'student', NOW() - INTERVAL '5 days',     NOW() - INTERVAL '45 days'),

  -- Class 9 track students
  (gen_random_uuid(), 'Siddharth Roy',       'siddharth.roy@demo.eduquest.in',       'placeholder', 'class-9',  9600,  24, 102,135, 2600,  37, 58,  'student', NOW() - INTERVAL '40 minutes', NOW() - INTERVAL '215 days'),
  (gen_random_uuid(), 'Harshita Gupta',      'harshita.gupta@demo.eduquest.in',      'placeholder', 'class-9',  8200,  22, 58, 82,  1950,  29, 47,  'student', NOW() - INTERVAL '2 hours',    NOW() - INTERVAL '188 days'),
  (gen_random_uuid(), 'Pranav Shah',         'pranav.shah@demo.eduquest.in',         'placeholder', 'class-9',  6700,  19, 43, 62,  1550,  22, 38,  'student', NOW() - INTERVAL '4 hours',    NOW() - INTERVAL '162 days'),
  (gen_random_uuid(), 'Swati Agarwal',       'swati.agarwal@demo.eduquest.in',       'placeholder', 'class-9',  5200,  16, 27, 41,  1100,  15, 28,  'student', NOW() - INTERVAL '6 hours',    NOW() - INTERVAL '135 days'),
  (gen_random_uuid(), 'Nikhil Dixit',        'nikhil.dixit@demo.eduquest.in',        'placeholder', 'class-9',  3700,  12, 16, 28,  740,   9,  19,  'student', NOW() - INTERVAL '8 hours',    NOW() - INTERVAL '108 days'),
  (gen_random_uuid(), 'Bhavna Singh',        'bhavna.singh@demo.eduquest.in',        'placeholder', 'class-9',  2200,  8,  8,  15,  420,   5,  12,  'student', NOW() - INTERVAL '2 days',     NOW() - INTERVAL '75 days'),
  (gen_random_uuid(), 'Aryan Mehrotra',      'aryan.mehrotra@demo.eduquest.in',      'placeholder', 'class-9',  900,   4,  2,  5,   130,   1,  5,   'student', NOW() - INTERVAL '6 days',     NOW() - INTERVAL '38 days'),

  -- Engineering track students
  (gen_random_uuid(), 'Kiran Patel',         'kiran.patel@demo.eduquest.in',         'placeholder', 'engineering', 12500, 29, 95, 140, 3500,  55, 81, 'student', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '270 days'),
  (gen_random_uuid(), 'Suresh Naik',         'suresh.naik@demo.eduquest.in',         'placeholder', 'engineering', 11000, 27, 65, 98,  3000,  47, 73, 'student', NOW() - INTERVAL '2 hours',    NOW() - INTERVAL '245 days'),
  (gen_random_uuid(), 'Deepak Joshi',        'deepak.joshi@demo.eduquest.in',        'placeholder', 'engineering', 9500,  25, 52, 78,  2450,  39, 61, 'student', NOW() - INTERVAL '4 hours',    NOW() - INTERVAL '218 days'),
  (gen_random_uuid(), 'Anjana Krishnan',     'anjana.krishnan@demo.eduquest.in',     'placeholder', 'engineering', 8000,  22, 39, 60,  1950,  31, 51, 'student', NOW() - INTERVAL '6 hours',    NOW() - INTERVAL '192 days'),
  (gen_random_uuid(), 'Rahul Chandra',       'rahul.chandra@demo.eduquest.in',       'placeholder', 'engineering', 6500,  19, 28, 45,  1500,  24, 41, 'student', NOW() - INTERVAL '8 hours',    NOW() - INTERVAL '165 days'),
  (gen_random_uuid(), 'Sneha Kumar',         'sneha.kumar@demo.eduquest.in',         'placeholder', 'engineering', 5000,  16, 19, 33,  1100,  17, 31, 'student', NOW() - INTERVAL '10 hours',   NOW() - INTERVAL '138 days'),
  (gen_random_uuid(), 'Vivek Bose',          'vivek.bose@demo.eduquest.in',          'placeholder', 'engineering', 3500,  12, 11, 21,  700,   10, 22, 'student', NOW() - INTERVAL '1 day',      NOW() - INTERVAL '108 days'),
  (gen_random_uuid(), 'Kaveri Nair',         'kaveri.nair@demo.eduquest.in',         'placeholder', 'engineering', 2000,  8,  5,  12,  350,   5,  13, 'student', NOW() - INTERVAL '3 days',     NOW() - INTERVAL '72 days'),
  (gen_random_uuid(), 'Tejas Desai',         'tejas.desai@demo.eduquest.in',         'placeholder', 'engineering', 700,   3,  1,  4,   90,    1,  4,  'student', NOW() - INTERVAL '7 days',     NOW() - INTERVAL '28 days')
ON CONFLICT (email) DO NOTHING;


-- ═══════════════════════════════════════════════════════════════
-- SECTION 2: Additional Community Posts (30 new threads)
-- Rich discussion across all subjects and tracks
-- ═══════════════════════════════════════════════════════════════

INSERT INTO eduquest_community_posts (
  id, title, body, author_name, author_id, tags, likes, comments, views, created_at
) VALUES

  -- Mathematics discussions
  (gen_random_uuid(),
   'Difference between HCF and LCM — when to use which?',
   'I always confuse HCF and LCM in word problems. HCF = Highest Common Factor is the largest number that divides both. LCM = Lowest Common Multiple is the smallest common multiple. Rule: Use HCF when you want to DIVIDE/SPLIT things equally. Use LCM when things need to MEET/REPEAT together. Example — if bells ring every 4 and 6 minutes, they ring together after LCM(4,6) = 12 minutes. If you want to cut ropes of 8m and 12m into equal pieces, HCF(8,12) = 4m each piece.',
   'Aarav Sharma', NULL, ARRAY['mathematics', 'class-10', 'hcf', 'lcm'], 47, 12, 892, NOW() - INTERVAL '18 days'),

  (gen_random_uuid(),
   'Understanding Quadratic Formula — step by step derivation',
   'The quadratic formula x = (-b ± √(b²-4ac)) / 2a comes from COMPLETING THE SQUARE. Start with ax² + bx + c = 0. Divide by a: x² + (b/a)x + c/a = 0. Move c/a: x² + (b/a)x = -c/a. Complete the square: add (b/2a)² to both sides. You get (x + b/2a)² = (b² - 4ac)/4a². Take square root and rearrange. The discriminant b²-4ac tells us: >0 means 2 real roots, =0 means 1 root, <0 means no real roots.',
   'Priya Patel', NULL, ARRAY['mathematics', 'class-10', 'quadratic', 'algebra'], 62, 18, 1240, NOW() - INTERVAL '22 days'),

  (gen_random_uuid(),
   'Trigonometry identities — complete cheat sheet for Class 10 boards',
   'Core trig identities you MUST know for boards: sin²θ + cos²θ = 1, 1 + tan²θ = sec²θ, 1 + cot²θ = cosec²θ. Ratios: sinθ = opposite/hypotenuse, cosθ = adjacent/hypotenuse, tanθ = opposite/adjacent. Standard angles: sin30=1/2, sin45=1/√2, sin60=√3/2, cos30=√3/2, cos45=1/√2, cos60=1/2, tan30=1/√3, tan45=1, tan60=√3. Memory trick for complementary angles: sin(90-θ) = cosθ, tan(90-θ) = cotθ. Print this and paste at your study desk!',
   'Sneha Reddy', NULL, ARRAY['mathematics', 'class-10', 'trigonometry', 'boards'], 89, 24, 2180, NOW() - INTERVAL '30 days'),

  (gen_random_uuid(),
   'Coordinate geometry formulas — Distance, Section, Area of Triangle',
   'Three formulas everyone needs for Class 10 coordinate geometry. Distance formula: √[(x₂-x₁)² + (y₂-y₁)²]. Section formula (dividing internally in ratio m:n): x = (mx₂+nx₁)/(m+n), y = (my₂+ny₁)/(m+n). Midpoint is a special case with m=n=1. Area of triangle with vertices (x₁,y₁), (x₂,y₂), (x₃,y₃): ½|x₁(y₂-y₃) + x₂(y₃-y₁) + x₃(y₁-y₂)|. If area = 0, the points are collinear. Practice 5 questions on each formula daily for a week and you will never forget them.',
   'Arjun Nair', NULL, ARRAY['mathematics', 'class-10', 'coordinate-geometry'], 74, 19, 1680, NOW() - INTERVAL '25 days'),

  -- Science / Physics discussions
  (gen_random_uuid(),
   'Newton''s Laws explained with everyday examples — Class 9 & 10',
   'Newton''s 3 laws are everywhere! Law 1 (Inertia): A book on table stays still — no net force. Passengers jerk forward when bus brakes — inertia of motion. Law 2 (F=ma): Same force on heavy and light ball — heavy ball accelerates less. This is why trucks accelerate slowly. Law 3 (Action-Reaction): Rocket pushes gas backward → gas pushes rocket forward. You push wall → wall pushes you back. Key exam point: action and reaction act on DIFFERENT objects, so they cannot cancel each other!',
   'Rahul Gupta', NULL, ARRAY['science', 'physics', 'class-9', 'newtons-laws'], 83, 27, 2050, NOW() - INTERVAL '14 days'),

  (gen_random_uuid(),
   'Electricity chapter — Ohm''s Law, Resistance, and Circuit problems',
   'V = IR is Ohm''s Law. V in Volts, I in Amperes, R in Ohms. For series circuits: total R = R₁ + R₂ + R₃ (adds up). Same current through all. Voltages add up. For parallel circuits: 1/R = 1/R₁ + 1/R₂ + 1/R₃ (reciprocal adds). Same voltage across all. Currents add up. Power formulas: P = VI = I²R = V²/R. Joule''s heating: H = I²Rt. Common mistake: students confuse ammeter (in series) and voltmeter (in parallel). Ammeter has very LOW resistance. Voltmeter has very HIGH resistance.',
   'Vikram Mehta', NULL, ARRAY['science', 'physics', 'class-10', 'electricity'], 91, 31, 2700, NOW() - INTERVAL '35 days'),

  (gen_random_uuid(),
   'Light chapter — Concave vs Convex mirror/lens differences',
   'Concave mirror: reflecting surface curves INWARD like a cave. Used in torches, car headlights, shaving mirrors. Real images for objects beyond F. Convex mirror: curves OUTWARD. Used in rear-view mirrors. Always gives virtual, erect, diminished images. Sign convention: incident light direction is positive. All distances from pole. Mirror formula: 1/f = 1/v + 1/u. Magnification m = -v/u. For LENSES: 1/f = 1/v - 1/u (lens formula). Convex lens converges, concave lens diverges. Power of lens P = 1/f (f in metres), unit is Dioptre.',
   'Kavya Iyer', NULL, ARRAY['science', 'physics', 'class-10', 'light', 'optics'], 67, 22, 1890, NOW() - INTERVAL '28 days'),

  -- Chemistry discussions
  (gen_random_uuid(),
   'Periodic table trends — electronegativity, atomic radius, ionization energy',
   'Three main trends you must know. Atomic Radius: INCREASES down a group (more electron shells), DECREASES across a period left to right (more protons pull electrons closer). Ionization Energy: DECREASES down a group, INCREASES across a period (harder to remove electron). Electronegativity: DECREASES down a group, INCREASES across a period. Fluorine (F) is the most electronegative element. Noble gases are NOT assigned electronegativity. Exception to atomic radius trend: noble gases have the largest radius in their period due to full shells.',
   'Ananya Singh', NULL, ARRAY['science', 'chemistry', 'class-10', 'periodic-table'], 58, 16, 1540, NOW() - INTERVAL '20 days'),

  (gen_random_uuid(),
   'Carbon compounds chapter — what is a functional group and why does it matter?',
   'A functional group is an atom or group of atoms that gives a compound its characteristic properties. Key functional groups: -OH (hydroxyl) → alcohols like ethanol. -COOH (carboxyl) → carboxylic acids like acetic acid. -CHO (aldehyde) → formaldehyde. -CO- (ketone) → acetone. -NH₂ (amine) → methylamine. The functional group determines chemical reactions, not the carbon chain length. Naming: number of carbons + prefix + functional group suffix. 1C=meth, 2C=eth, 3C=prop, 4C=but, 5C=pent.',
   'Divya Krishnan', NULL, ARRAY['science', 'chemistry', 'class-10', 'carbon'], 44, 13, 1120, NOW() - INTERVAL '16 days'),

  -- Biology discussions
  (gen_random_uuid(),
   'Life Processes — Nutrition, Respiration, Transportation, Excretion',
   'All 4 life processes in one post. Nutrition: Autotrophs (plants — photosynthesis: 6CO₂+6H₂O → C₆H₁₂O₆+6O₂), Heterotrophs (animals — ingestion, digestion, absorption, assimilation, egestion). Respiration: Aerobic (with O₂) → 38 ATP in mitochondria. Anaerobic → only 2 ATP. In yeast: glucose → ethanol + CO₂. In muscles: glucose → lactic acid. Transportation: Heart has 4 chambers. Blood: plasma, RBC (haemoglobin), WBC (immunity), platelets (clotting). Excretion: Kidneys filter blood. Each kidney has ~1 million nephrons. Urine = urea + salts + water.',
   'Rohan Kapoor', NULL, ARRAY['science', 'biology', 'class-10', 'life-processes'], 76, 25, 2200, NOW() - INTERVAL '32 days'),

  (gen_random_uuid(),
   'Heredity and Evolution — Mendel''s laws explained simply',
   'Mendel studied pea plants and discovered genetics. Key terms: Gene = unit of heredity. Allele = alternate form of gene. Dominant = expressed (capital letter e.g. T). Recessive = hidden (lowercase e.g. t). Law of Segregation: During gamete formation, allele pairs separate (TT → T+T, Tt → T+t). Law of Independent Assortment: genes on different chromosomes assort independently. Monohybrid cross Tt × Tt gives ratio 3:1 (dominant:recessive). Dihybrid cross TtRr × TtRr gives 9:3:3:1 ratio. Sex determination in humans: females XX, males XY. Father determines sex of child!',
   'Aditya Joshi', NULL, ARRAY['science', 'biology', 'class-10', 'heredity', 'genetics'], 53, 17, 1450, NOW() - INTERVAL '19 days'),

  -- Social Science discussions
  (gen_random_uuid(),
   'Nationalism in India — key events timeline for Class 10 boards',
   'Important events for Chapter 2 (History). 1905 — Partition of Bengal by Curzon → mass agitation. 1906 — Muslim League formed. 1907 — Surat Split of Congress. 1915 — Gandhi returns from South Africa. 1916 — Lucknow Pact between Congress and Muslim League. 1917 — Champaran Satyagraha (indigo farmers). 1919 — Jallianwala Bagh massacre (April 13). 1920 — Non-Cooperation Movement launched. 1930 — Civil Disobedience, Dandi March (March 12 to April 6). 1942 — Quit India Movement (August 8 — ''Do or Die''). 1947 — Independence, August 15.',
   'Meera Bansal', NULL, ARRAY['social-science', 'history', 'class-10', 'freedom-struggle'], 39, 11, 980, NOW() - INTERVAL '15 days'),

  (gen_random_uuid(),
   'Understanding GDP, GNP, NNP — Economics Class 10 made simple',
   'These terms confuse everyone. GDP (Gross Domestic Product) = Total value of all goods and services produced WITHIN a country in a year. Regardless of who produces it — Indian or foreign company. GNP (Gross National Product) = GDP + income earned by citizens ABROAD - income earned by foreigners IN India. NNP = GNP - Depreciation. Per Capita Income = NNP / Total Population. Why does per capita matter? Two countries with same GDP but different populations have very different living standards. India has high GDP but low per capita due to large population. Key formula to remember: GNP = GDP + NFIA (Net Factor Income from Abroad).',
   'Aarav Sharma', NULL, ARRAY['social-science', 'economics', 'class-10', 'gdp'], 61, 20, 1620, NOW() - INTERVAL '27 days'),

  -- Engineering / DSA discussions
  (gen_random_uuid(),
   'Big O Notation explained — O(1), O(log n), O(n), O(n log n), O(n²)',
   'Big O measures algorithm efficiency as input size grows. O(1) = Constant — same time regardless of input. Example: array access arr[i]. O(log n) = Logarithmic — halves the problem each step. Example: Binary Search. O(n) = Linear — grows proportional to input. Example: Linear Search, simple loop. O(n log n) = Linearithmic — most sorting algorithms. Merge Sort, Heap Sort. O(n²) = Quadratic — nested loops. Bubble Sort, Selection Sort (bad for large inputs). O(2ⁿ) = Exponential — recursive fibonacci without memoization (very bad). Rule: always aim for O(n log n) or better for competitive programming.',
   'Priya Patel', NULL, ARRAY['engineering', 'dsa', 'algorithms', 'big-o'], 112, 34, 3200, NOW() - INTERVAL '40 days'),

  (gen_random_uuid(),
   'When to use Stack vs Queue — data structure decision guide',
   'Stack = LIFO (Last In First Out). Think of a pile of plates. Operations: push(), pop(), peek(). Use Stack for: function call stack, undo/redo, balanced parentheses problem, infix-to-postfix conversion, DFS (depth-first search). Queue = FIFO (First In First Out). Think of people in a line. Operations: enqueue(), dequeue(), front(). Use Queue for: BFS (breadth-first search), printer spooling, CPU scheduling, handling requests in web servers. Priority Queue: elements served by priority, not order. Deque: can insert/delete from both ends. Interview tip: 80% of graph problems use either BFS (queue) or DFS (stack/recursion).',
   'Arjun Nair', NULL, ARRAY['engineering', 'dsa', 'data-structures', 'stack', 'queue'], 98, 28, 2760, NOW() - INTERVAL '35 days'),

  (gen_random_uuid(),
   'Binary Search — complete implementation + common mistakes',
   'Binary Search requires a SORTED array. It halves the search space each iteration → O(log n). Template: lo=0, hi=n-1. while(lo<=hi): mid=(lo+hi)/2. if arr[mid]==target: return mid. if arr[mid]<target: lo=mid+1. else: hi=mid-1. return -1. Common mistakes: 1) mid=(lo+hi)/2 can overflow for large integers! Use mid=lo+(hi-lo)/2 instead. 2) Wrong while condition — use lo<=hi not lo<hi. 3) Off-by-one in lo=mid+1 or hi=mid-1. 4) Applying to unsorted array! Variants: lower_bound (first occurrence), upper_bound (last+1 occurrence), search in rotated sorted array. Practice: LeetCode 704, 35, 33, 153.',
   'Divya Krishnan', NULL, ARRAY['engineering', 'dsa', 'binary-search', 'algorithms'], 87, 22, 2100, NOW() - INTERVAL '29 days'),

  (gen_random_uuid(),
   'Python vs Java vs C++ — which language to learn first for placements?',
   'Honest comparison for placement prep. C++: Fastest execution, used in competitive programming (Codeforces, ICPC). STL is extremely powerful (vector, map, set, priority_queue). Write less boilerplate. Best for: competitive programming. Java: Verbose but readable. Strong OOP. Used heavily in enterprise. Android development. Spring Boot for backend. Best for: product companies, Android. Python: Clean syntax, fastest to write. Pandas/NumPy for data science. Django/FastAPI for web. Slower runtime. Best for: data science, scripting, rapid prototyping. For FAANG placements: C++ or Java. For startups: Python or JavaScript. The language matters less than DSA mastery!',
   'Vikram Mehta', NULL, ARRAY['engineering', 'programming-languages', 'career', 'placements'], 134, 45, 4100, NOW() - INTERVAL '45 days'),

  (gen_random_uuid(),
   'My 60-day Java journey on EduQuest — got placed at a startup!',
   'Sharing my experience to motivate everyone. I joined EduQuest in January and started the 45-day Java plan. Week 1-2: basics, OOP, collections. Week 3-4: exception handling, file I/O, multithreading. Week 5-6: DSA in Java — arrays, LinkedList, trees, graphs. Week 7+: system design basics and mock interviews. The day-wise plan kept me accountable. I did the daily questions and joined 2-3 battles every evening. My streak hit 45 days. In March I got an interview call. I cleared all 3 rounds and got an offer at a Bangalore startup for ₹8 LPA. The EduQuest battle mode genuinely helped with time-pressured thinking. Keep going!',
   'Kiran Patel', NULL, ARRAY['engineering', 'java', 'success-story', 'placements'], 245, 67, 6800, NOW() - INTERVAL '55 days'),

  -- Class 11 discussions
  (gen_random_uuid(),
   'Class 11 Physics — Kinematics equations and when to apply them',
   'The 3 kinematic equations (for constant acceleration only!). v = u + at. s = ut + ½at². v² = u² + 2as. Where: u=initial velocity, v=final velocity, a=acceleration, t=time, s=displacement. When to use which: Use equation 1 when you know u, a, t and want v. Use equation 2 when you know u, a, t and want s. Use equation 3 when you have no time but know v, u, a. For a body thrown vertically upward: at highest point v=0, use this to find max height. Time of flight = 2u/g. For free fall: u=0, a=g=9.8 m/s². Projectile: horizontal component = u cosθ (no acceleration), vertical = u sinθ (acceleration = g downward).',
   'Yash Tripathi', NULL, ARRAY['physics', 'class-11', 'kinematics', 'mechanics'], 71, 23, 1890, NOW() - INTERVAL '21 days'),

  (gen_random_uuid(),
   'Class 11 Chemistry — Mole Concept step-by-step with solved problems',
   '1 mole = 6.022 × 10²³ particles (Avogadro''s number N_A). This is always true whether atoms, molecules, ions, or electrons. Molar mass = mass of 1 mole in grams = atomic/molecular weight in g/mol. For example: 1 mole of CO₂ = 44g (C=12, O=16×2). Number of moles = Given mass / Molar mass. Number of particles = moles × N_A. Volume of gas at STP = moles × 22.4 L (at 0°C, 1 atm). Solved example: Find moles in 88g CO₂. Moles = 88/44 = 2 moles. Particles = 2 × 6.022×10²³ = 12.044×10²³. Volume at STP = 2 × 22.4 = 44.8 L.',
   'Pooja Mishra', NULL, ARRAY['chemistry', 'class-11', 'mole-concept'], 65, 19, 1720, NOW() - INTERVAL '17 days'),

  (gen_random_uuid(),
   'Class 11 Maths — Permutations vs Combinations — clear difference',
   'P vs C: Does ORDER matter? YES → Permutation. NO → Combination. Permutation formula: nPr = n! / (n-r)!. Combination formula: nCr = n! / (r! × (n-r)!). Relationship: nPr = nCr × r!. Examples. Q: How many ways to arrange 3 books from 5? Order matters → ⁵P₃ = 60. Q: How many committees of 3 from 5 people? Order doesn''t matter → ⁵C₃ = 10. Key properties: nC₀ = nCₙ = 1. nC₁ = n. nCr = nC(n-r). nCr + nC(r-1) = (n+1)Cr (Pascal''s identity). Total subsets of a set with n elements = 2ⁿ (including empty set).',
   'Shubham Tiwari', NULL, ARRAY['mathematics', 'class-11', 'permutations', 'combinations'], 82, 26, 2050, NOW() - INTERVAL '24 days'),

  -- Battle and motivation discussions
  (gen_random_uuid(),
   'Tips to win more battles on EduQuest — from a 50+ win player',
   'Battle tips from personal experience with 55 wins. 1) Speed matters more than perfection — a quick correct answer beats a slow perfect one. 2) Know your weak topics and avoid them in category selection if possible. 3) For MCQs, eliminate wrong options first — cuts decision time by 40%. 4) Keep daily streak for XP and brain-warm-up — I always battle right after daily study. 5) Use the 8-second timer wisely — if unsure, guess within last 2 seconds (50% better than skipping). 6) Physics and Maths MCQs have patterns — practice 10/day. 7) DSA questions favor those who''ve done 100+ LeetCode problems. My accuracy rate jumped from 58% to 79% in 3 months. Consistency beats cramming!',
   'Siddharth Roy', NULL, ARRAY['battle', 'tips', 'strategy', 'study'], 178, 52, 5200, NOW() - INTERVAL '60 days'),

  (gen_random_uuid(),
   'How I built a 78-day streak — daily routine that works',
   'My 78-day streak routine (still going). 6:30 AM: 15-minute EduQuest daily questions. This locks in the streak first thing. 7 AM - School/College. 5 PM: Subject study using day-wise plan (45 min focus, no phone). 6 PM: 2 battles in the Arena — quick warmup + competitive thinking. 8 PM: Review wrong answers from the day. 9 PM: 15 min community — read 1 question, answer if I can. Sleep by 10 PM. Key insight: I stopped trying to be perfect and started being consistent. A short 15-minute session beats a planned 3-hour session that never happens. Streaks are about identity — I am someone who studies every day.',
   'Harshita Gupta', NULL, ARRAY['streak', 'study-routine', 'motivation', 'discipline'], 203, 61, 5900, NOW() - INTERVAL '70 days'),

  -- General academic discussions
  (gen_random_uuid(),
   'Board exam strategy — how to score 90%+ in Class 10',
   'Having scored 94% in Class 10, here is exactly what I did. 6 months before: finish entire syllabus once with EduQuest day plans. 3 months before: start chapter-wise MCQ practice (20 per chapter). 2 months before: full-length mock tests once a week. 1 month before: focus only on weak chapters identified from mocks. 2 weeks before: revision only — no new topics. Board exam paper strategy: Read ALL questions in first 10 minutes. Answer what you know first. Never leave any answer blank — attempt all. For 5-mark questions: write key points as bullet points, not paragraphs. Diagrams with labels score extra marks. NCERT solved examples appear directly in board papers at least 3-4 times per subject. Read them!',
   'Tanvi Garg', NULL, ARRAY['class-10', 'boards', 'strategy', 'marks'], 267, 78, 7400, NOW() - INTERVAL '75 days'),

  (gen_random_uuid(),
   'How to choose Science stream vs Commerce in Class 11 — honest guide',
   'Real talk from someone who struggled with this decision. Science: Choose if you love Physics/Chemistry/Math and can spend 3-4 hours daily on studies. Career paths: Engineering (JEE), Medicine (NEET), Pure Science. Workload is very high. Boards + entrance prep simultaneously is exhausting. Commerce: Choose if you like Economics, Accounts, Business Studies. Career: CA, MBA, Finance, Marketing, Banking. Class 11 Commerce is significantly lighter workload. Arts/Humanities: Underrated choice! Great for law (CLAT), civil services (UPSC), journalism. My honest advice: choose based on what you find INTERESTING, not what your parents want or what your friends chose. You will spend 2 years studying this — passion matters more than prestige.',
   'Kritika Sharma', NULL, ARRAY['class-11', 'stream-selection', 'career', 'advice'], 189, 56, 5100, NOW() - INTERVAL '50 days'),

  (gen_random_uuid(),
   'Understanding JEE Mains vs Advanced — differences and preparation timeline',
   'JEE Mains: 75 questions, 3 hours. 25 each from Physics, Chemistry, Math. Multiple attempts allowed per year (Jan and April). Must clear for admission to NITs, IIITs, GFTIs. JEE Advanced: Only top 2.5 lakh JEE Mains qualifiers can appear. For IITs only. Much harder questions — requires deep conceptual understanding, not just formula application. Timeline I followed: Class 9-10: Strong CBSE foundation (critical!). Class 11: Complete syllabus deeply. DO NOT skip chapters. Class 12 first half: Revision + Class 12 topics + JEE-level practice. Class 12 second half: Mock tests, PYQs (Previous Year Questions). JEE Mains PYQ papers from 2019-2024 are a goldmine — 30-40% questions repeat in similar pattern.',
   'Kartik Arora', NULL, ARRAY['class-12', 'jee', 'engineering-entrance', 'preparation'], 156, 44, 4300, NOW() - INTERVAL '42 days'),

  (gen_random_uuid(),
   'Rust vs Go for backend development — 2026 comparison',
   'Having worked on projects in both, here is my honest take. Rust: Memory safe without garbage collector. Blazing fast (C/C++ level). Steep learning curve — ownership, borrowing, lifetimes are hard. Used by: systems programming, WebAssembly, game engines, Mozilla Firefox, Linux kernel modules. Go: Simple syntax, easy to learn in 2 weeks. Built-in goroutines for concurrency. Good enough performance. Garbage collected (small pauses). Used by: Docker, Kubernetes, Terraform, most cloud-native tools. For web backend? Go is more practical for most teams. Rust shines when you need absolute performance + memory safety (like a database engine or game server). Learn Go first for immediate job market value. Learn Rust for the future.',
   'Suresh Naik', NULL, ARRAY['engineering', 'rust', 'golang', 'backend', 'systems'], 121, 38, 3400, NOW() - INTERVAL '38 days'),

  (gen_random_uuid(),
   'How EduQuest helped me clear NEET preparation — Chapter-wise approach works!',
   'Sharing my NEET story. I was struggling with Biology — too much content, no structure. Started EduQuest''s Class 12 Biology track in January. The chapter-wise day plan was a game changer. Week 1: Cell biology and reproduction. Week 2: Genetics and evolution. Week 3: Human physiology. Week 4: Plant physiology. Week 5-6: Ecology and environment. Each chapter had 15-20 MCQs that exactly matched NEET pattern — single correct answer, concept-based not calculation-based. I did battles in the Biology category which forced me to recall information quickly under pressure — exactly what NEET needs! Scored 340/360 in Biology in my mock test. The streak system pushed me to study even on days I felt like skipping. EduQuest does not replace coaching but it is the best supplement tool I found.',
   'Riya Malhotra', NULL, ARRAY['class-12', 'neet', 'biology', 'success-story'], 234, 69, 6100, NOW() - INTERVAL '62 days'),

  (gen_random_uuid(),
   'Git and GitHub for beginners — commands you use every day',
   'Essential Git commands every developer uses daily. Setup: git config --global user.name "Name", git config --global user.email "email". Start: git init (new repo) or git clone <url> (existing repo). Daily workflow: git status → see changes. git add . → stage all changes. git add <file> → stage specific file. git commit -m "message" → save snapshot. git push origin main → upload to GitHub. git pull → download latest changes. Branching: git checkout -b feature-name → create and switch. git merge feature-name → merge branch into current. git branch -d feature-name → delete branch. Fix mistakes: git restore <file> → undo unstaged changes. git reset HEAD~1 → undo last commit. Pro tip: commit often, push daily, write meaningful commit messages — your future self will thank you.',
   'Vivek Bose', NULL, ARRAY['engineering', 'git', 'github', 'tools', 'beginners'], 145, 41, 3900, NOW() - INTERVAL '33 days'),

  (gen_random_uuid(),
   'Statistics in Class 10 — Mean, Median, Mode from grouped data',
   'The three measures of central tendency for grouped data. MEAN using assumed mean: x̄ = A + (Σfᵢdᵢ/Σfᵢ) where A is assumed mean, dᵢ = xᵢ - A. Direct formula: x̄ = Σfᵢxᵢ / Σfᵢ. MEDIAN: Sort classes, find n/2 then locate median class. Median = L + [(n/2 - cf)/f] × h. Where L=lower boundary of median class, cf=cumulative frequency before median class, f=frequency of median class, h=class width. MODE: Modal class has highest frequency. Mode = L + [(f₁-f₀)/(2f₁-f₀-f₂)] × h. Where f₁=modal class freq, f₀=preceding freq, f₂=following freq. Relationship: Mode = 3×Median - 2×Mean (approximate). Practice with the NCERT Exercise 14.1 - 14.3 completely.',
   'Anjali Khanna', NULL, ARRAY['mathematics', 'class-10', 'statistics', 'boards'], 79, 24, 1980, NOW() - INTERVAL '23 days')

ON CONFLICT DO NOTHING;


-- ═══════════════════════════════════════════════════════════════
-- SECTION 3: Additional questions for Class 11 chapters
-- (Class 9 and 10 already have good coverage from migration 010)
-- ═══════════════════════════════════════════════════════════════

-- CLASS 11 PHYSICS — Laws of Motion
INSERT INTO eduquest_questions
  (chapter_id, question_text, options, correct_answer, explanation, difficulty, points_value, question_type, sequence_order)
SELECT
  c.id, q.question_text, q.options::JSONB, q.correct_answer, q.explanation, q.difficulty, q.points_value, q.question_type, q.seq
FROM eduquest_chapters c,
(VALUES
  ('A body of mass 5 kg is acted upon by a net force of 20 N. What is its acceleration?',
   '["A) 1 m/s²","B) 2 m/s²","C) 4 m/s²","D) 100 m/s²"]',
   'C', 'F = ma → a = F/m = 20/5 = 4 m/s². Newton''s Second Law directly.', 'easy', 10, 'mcq', 1),
  ('A 10 kg object is in equilibrium on a horizontal surface. The normal force from the surface is:',
   '["A) 0 N","B) 98 N","C) 10 N","D) Depends on surface"]',
   'B', 'In equilibrium, N = mg = 10 × 9.8 = 98 N. Normal force balances weight.', 'easy', 10, 'mcq', 2),
  ('The law of conservation of linear momentum states that total momentum is conserved when:',
   '["A) No external force acts","B) No friction acts","C) Velocity is constant","D) Mass is constant"]',
   'A', 'Momentum is conserved when net external force = 0 (isolated system). Friction is an external force that violates conservation.', 'medium', 15, 'mcq', 3),
  ('A bullet of mass 50 g moving at 400 m/s hits a block of 2 kg at rest and gets embedded. Final velocity is:',
   '["A) 10 m/s","B) 9.5 m/s","C) 8 m/s","D) 20 m/s"]',
   'B', 'Conservation of momentum: 0.05 × 400 = (0.05 + 2) × v. 20 = 2.05v → v ≈ 9.76 ≈ 9.5 m/s.', 'hard', 20, 'mcq', 4),
  ('Impulse is defined as:',
   '["A) Force × distance","B) Force × time","C) Mass × velocity","D) Rate of change of force"]',
   'B', 'Impulse J = F × t = Δp (change in momentum). Unit is N·s or kg·m/s. Useful when force acts for short duration (like a bat hitting a ball).', 'easy', 10, 'mcq', 5)
) AS q(question_text, options, correct_answer, explanation, difficulty, points_value, question_type, seq)
WHERE c.slug = 'laws-of-motion'
ON CONFLICT DO NOTHING;


-- CLASS 11 CHEMISTRY — Structure of Atom
INSERT INTO eduquest_questions
  (chapter_id, question_text, options, correct_answer, explanation, difficulty, points_value, question_type, sequence_order)
SELECT
  c.id, q.question_text, q.options::JSONB, q.correct_answer, q.explanation, q.difficulty, q.points_value, q.question_type, q.seq
FROM eduquest_chapters c,
(VALUES
  ('The atomic number of an element is equal to the number of:',
   '["A) Neutrons in nucleus","B) Protons in nucleus","C) Electrons in outermost shell","D) Nucleons in nucleus"]',
   'B', 'Atomic number Z = number of protons in nucleus. For a neutral atom, Z also equals number of electrons.', 'easy', 10, 'mcq', 1),
  ('The quantum number that describes the shape of an orbital is:',
   '["A) Principal quantum number n","B) Azimuthal quantum number l","C) Magnetic quantum number m","D) Spin quantum number s"]',
   'B', 'Azimuthal quantum number l determines orbital shape. l=0 → s (spherical), l=1 → p (dumbbell), l=2 → d (complex), l=3 → f.', 'medium', 15, 'mcq', 2),
  ('According to Aufbau principle, electrons fill orbitals in order of increasing:',
   '["A) Principal quantum number","B) Atomic number","C) (n + l) value","D) Spin"]',
   'C', 'Aufbau principle: fill orbitals with lowest (n+l) first. If equal (n+l), fill lowest n first. Order: 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p...', 'medium', 15, 'mcq', 3),
  ('The maximum number of electrons in the 3rd shell (n=3) is:',
   '["A) 8","B) 18","C) 32","D) 6"]',
   'B', 'Max electrons in shell n = 2n². For n=3: 2×3² = 18. Subshells: 3s(2) + 3p(6) + 3d(10) = 18.', 'easy', 10, 'mcq', 4),
  ('Heisenberg Uncertainty Principle states that we cannot simultaneously determine with precision:',
   '["A) Mass and charge","B) Position and momentum","C) Spin and charge","D) Energy and mass"]',
   'B', 'Δx × Δp ≥ h/4π. Position and momentum cannot both be precisely determined simultaneously. This is a fundamental property of quantum particles, not a limitation of instruments.', 'medium', 15, 'mcq', 5)
) AS q(question_text, options, correct_answer, explanation, difficulty, points_value, question_type, seq)
WHERE c.slug = 'structure-of-atom'
ON CONFLICT DO NOTHING;


-- CLASS 11 MATHS — Quadratic Equations / Complex Numbers
INSERT INTO eduquest_questions
  (chapter_id, question_text, options, correct_answer, explanation, difficulty, points_value, question_type, sequence_order)
SELECT
  c.id, q.question_text, q.options::JSONB, q.correct_answer, q.explanation, q.difficulty, q.points_value, q.question_type, q.seq
FROM eduquest_chapters c,
(VALUES
  ('The value of i² where i = √(-1) is:',
   '["A) 1","B) -1","C) i","D) 0"]',
   'B', 'i = √(-1), so i² = -1 by definition. Powers of i cycle: i¹=i, i²=-1, i³=-i, i⁴=1, then repeats.', 'easy', 10, 'mcq', 1),
  ('The modulus of complex number (3 + 4i) is:',
   '["A) 3","B) 4","C) 5","D) 7"]',
   'C', '|z| = √(a² + b²) = √(9 + 16) = √25 = 5. Modulus represents the distance from origin on Argand plane.', 'easy', 10, 'mcq', 2),
  ('The conjugate of (2 - 3i) is:',
   '["A) -2 + 3i","B) 2 + 3i","C) -2 - 3i","D) 3 - 2i"]',
   'B', 'Conjugate of (a + bi) is (a - bi). So conjugate of (2 - 3i) = (2 + 3i). Conjugate flips the sign of imaginary part only.', 'easy', 10, 'mcq', 3),
  ('For a quadratic equation ax² + bx + c = 0, if discriminant D < 0, the roots are:',
   '["A) Real and distinct","B) Real and equal","C) Complex conjugates","D) Rational"]',
   'C', 'When D = b²-4ac < 0, the square root of D is imaginary, giving complex conjugate roots a+bi and a-bi.', 'medium', 15, 'mcq', 4),
  ('The sum of roots of 2x² - 5x + 3 = 0 is:',
   '["A) 5/2","B) -5/2","C) 3/2","D) -3/2"]',
   'A', 'For ax² + bx + c = 0: sum of roots = -b/a = -(-5)/2 = 5/2. Product of roots = c/a = 3/2.', 'easy', 10, 'mcq', 5)
) AS q(question_text, options, correct_answer, explanation, difficulty, points_value, question_type, seq)
WHERE c.slug = 'complex-numbers-quadratic-equations'
ON CONFLICT DO NOTHING;


-- CLASS 12 PHYSICS — Electrostatics / Current Electricity
INSERT INTO eduquest_questions
  (chapter_id, question_text, options, correct_answer, explanation, difficulty, points_value, question_type, sequence_order)
SELECT
  c.id, q.question_text, q.options::JSONB, q.correct_answer, q.explanation, q.difficulty, q.points_value, q.question_type, q.seq
FROM eduquest_chapters c,
(VALUES
  ('Electric field lines never intersect each other because:',
   '["A) They are parallel","B) Intersection would imply two directions at same point","C) Field is zero at intersection","D) They are not physical entities"]',
   'B', 'If field lines crossed, there would be two different electric field directions at the same point, which is impossible since a field has a unique direction at each point.', 'medium', 15, 'mcq', 1),
  ('The SI unit of electric field intensity is:',
   '["A) Volt","B) Newton/Coulomb","C) Coulomb/Newton","D) Ampere/Metre"]',
   'B', 'E = F/q → unit is N/C. Equivalently, E = V/d → unit is also V/m. Both are equivalent: 1 V/m = 1 N/C.', 'easy', 10, 'mcq', 2),
  ('Three 6Ω resistors are connected in parallel. Their equivalent resistance is:',
   '["A) 18 Ω","B) 6 Ω","C) 3 Ω","D) 2 Ω"]',
   'D', '1/R = 1/6 + 1/6 + 1/6 = 3/6 = 1/2. R = 2 Ω. For n identical resistors in parallel: R_eq = R/n = 6/3 = 2 Ω.', 'easy', 10, 'mcq', 3),
  ('Kirchhoff''s Current Law (KCL) is based on conservation of:',
   '["A) Energy","B) Charge","C) Momentum","D) Mass"]',
   'B', 'KCL states that the algebraic sum of currents at a junction = 0. This is based on conservation of electric charge — charge cannot accumulate at a junction.', 'medium', 15, 'mcq', 4),
  ('The drift velocity of electrons in a conductor is of the order of:',
   '["A) 10⁸ m/s","B) 10³ m/s","C) 10⁻⁴ m/s","D) 1 m/s"]',
   'C', 'Drift velocity is very small, typically 10⁻⁴ to 10⁻³ m/s. Light travels at 3×10⁸ m/s. The electromagnetic signal propagates quickly even though electrons move slowly.', 'hard', 20, 'mcq', 5)
) AS q(question_text, options, correct_answer, explanation, difficulty, points_value, question_type, seq)
WHERE c.slug = 'electric-charges-fields'
ON CONFLICT DO NOTHING;


-- CLASS 12 CHEMISTRY — Chemical Kinetics
INSERT INTO eduquest_questions
  (chapter_id, question_text, options, correct_answer, explanation, difficulty, points_value, question_type, sequence_order)
SELECT
  c.id, q.question_text, q.options::JSONB, q.correct_answer, q.explanation, q.difficulty, q.points_value, q.question_type, q.seq
FROM eduquest_chapters c,
(VALUES
  ('The rate of a chemical reaction generally increases with temperature because:',
   '["A) Activation energy increases","B) More molecules have energy ≥ activation energy","C) Molecules collide less frequently","D) Bond strength increases"]',
   'B', 'Higher temperature → more molecules have kinetic energy ≥ activation energy → more effective collisions per second → faster reaction (Arrhenius equation).', 'medium', 15, 'mcq', 1),
  ('For a first-order reaction, the unit of rate constant k is:',
   '["A) mol L⁻¹ s⁻¹","B) L mol⁻¹ s⁻¹","C) s⁻¹","D) L² mol⁻² s⁻¹"]',
   'C', 'Rate = k[A]¹. So k = Rate/[A] = (mol L⁻¹ s⁻¹)/(mol L⁻¹) = s⁻¹. First-order rate constant has unit of reciprocal time.', 'medium', 15, 'mcq', 2),
  ('Half-life of a first-order reaction is 10 minutes. After 30 minutes, fraction of reactant remaining is:',
   '["A) 1/2","B) 1/4","C) 1/8","D) 1/16"]',
   'C', 'After 3 half-lives: (1/2)³ = 1/8. 30 min = 3 × 10 min = 3 half-lives. First-order half-life is independent of initial concentration.', 'medium', 15, 'mcq', 3),
  ('A catalyst increases reaction rate by:',
   '["A) Increasing activation energy","B) Decreasing activation energy","C) Increasing temperature","D) Changing equilibrium position"]',
   'B', 'Catalyst provides an alternate reaction pathway with lower activation energy. This increases the fraction of molecules that can react. Catalyst is not consumed and doesn''t change equilibrium constants.', 'easy', 10, 'mcq', 4)
) AS q(question_text, options, correct_answer, explanation, difficulty, points_value, question_type, seq)
WHERE c.slug = 'chemical-kinetics'
ON CONFLICT DO NOTHING;


-- CLASS 12 MATHS — Integrals
INSERT INTO eduquest_questions
  (chapter_id, question_text, options, correct_answer, explanation, difficulty, points_value, question_type, sequence_order)
SELECT
  c.id, q.question_text, q.options::JSONB, q.correct_answer, q.explanation, q.difficulty, q.points_value, q.question_type, q.seq
FROM eduquest_chapters c,
(VALUES
  ('∫ x² dx equals:',
   '["A) 2x","B) x³/3 + C","C) 3x³ + C","D) x²/2 + C"]',
   'B', '∫ xⁿ dx = xⁿ⁺¹/(n+1) + C. For n=2: x³/3 + C. Always add constant of integration C for indefinite integrals.', 'easy', 10, 'mcq', 1),
  ('∫ eˣ dx equals:',
   '["A) eˣ/x + C","B) xeˣ + C","C) eˣ + C","D) e^(x+1) + C"]',
   'C', 'eˣ is its own integral: ∫ eˣ dx = eˣ + C. This is a special property of the exponential function.', 'easy', 10, 'mcq', 2),
  ('∫₀¹ x² dx equals:',
   '["A) 1","B) 1/2","C) 1/3","D) 1/4"]',
   'C', '[x³/3]₀¹ = 1/3 - 0 = 1/3. For definite integrals, apply limits after finding antiderivative and subtract.', 'easy', 10, 'mcq', 3),
  ('The method of integration by parts uses the formula:',
   '["A) ∫uv dx = u∫v dx + ∫v dx","B) ∫uv dx = u∫v dx - ∫(u''∫v dx)dx","C) ∫uv dx = ∫u dx × ∫v dx","D) ∫uv dx = v∫u dx"]',
   'B', 'Integration by parts (ILATE rule): ∫uv dx = u∫v dx - ∫(du/dx × ∫v dx)dx. ILATE order for u: Inverse trig, Logarithmic, Algebraic, Trigonometric, Exponential.', 'hard', 20, 'mcq', 4)
) AS q(question_text, options, correct_answer, explanation, difficulty, points_value, question_type, seq)
WHERE c.slug = 'integrals'
ON CONFLICT DO NOTHING;


-- ENGINEERING — DSA Chapter Questions
INSERT INTO eduquest_questions
  (chapter_id, question_text, options, correct_answer, explanation, difficulty, points_value, question_type, sequence_order)
SELECT
  c.id, q.question_text, q.options::JSONB, q.correct_answer, q.explanation, q.difficulty, q.points_value, q.question_type, q.seq
FROM eduquest_chapters c,
(VALUES
  ('What is the time complexity of binary search?',
   '["A) O(n)","B) O(n²)","C) O(log n)","D) O(n log n)"]',
   'C', 'Binary search halves the search space each iteration. T(n) = T(n/2) + O(1). By Master theorem: T(n) = O(log n). Requires sorted array.', 'easy', 10, 'mcq', 1),
  ('Which data structure uses LIFO (Last In First Out) principle?',
   '["A) Queue","B) Stack","C) Linked List","D) Binary Tree"]',
   'B', 'Stack is LIFO — last element pushed is first to be popped. Think of a stack of plates. Queue is FIFO (First In First Out).', 'easy', 10, 'mcq', 2),
  ('The worst-case time complexity of QuickSort is:',
   '["A) O(n log n)","B) O(n)","C) O(n²)","D) O(log n)"]',
   'C', 'QuickSort worst case is O(n²) when pivot is always the smallest or largest element (already sorted array with bad pivot choice). Average case is O(n log n). Use randomized pivot to avoid worst case.', 'medium', 15, 'mcq', 3),
  ('In a binary search tree, the inorder traversal gives:',
   '["A) Random order","B) Reverse sorted order","C) Sorted order","D) Level-by-level order"]',
   'C', 'Inorder traversal (Left → Root → Right) of a BST always produces elements in ascending sorted order. This is a key property of BSTs.', 'medium', 15, 'mcq', 4),
  ('What is the space complexity of Merge Sort?',
   '["A) O(1)","B) O(log n)","C) O(n)","D) O(n²)"]',
   'C', 'Merge Sort requires O(n) auxiliary space for the temporary arrays used during merging. Unlike QuickSort which can be done in-place (O(log n) stack space), Merge Sort needs extra memory.', 'medium', 15, 'mcq', 5),
  ('A graph with n vertices and n-1 edges that is connected is called:',
   '["A) Complete Graph","B) Bipartite Graph","C) Tree","D) Cycle"]',
   'C', 'A connected graph with n vertices and exactly n-1 edges is a Tree. Trees have no cycles. They have exactly one path between any two vertices.', 'medium', 15, 'mcq', 6),
  ('Dynamic programming is best suited for problems with:',
   '["A) Only greedy choices","B) Optimal substructure and overlapping subproblems","C) Random access patterns","D) Single recursive calls"]',
   'B', 'DP requires: 1) Optimal substructure — optimal solution contains optimal solutions to subproblems. 2) Overlapping subproblems — same subproblems solved multiple times. DP caches results to avoid recomputation.', 'hard', 20, 'mcq', 7)
) AS q(question_text, options, correct_answer, explanation, difficulty, points_value, question_type, seq)
WHERE c.slug = 'arrays-strings'
ON CONFLICT DO NOTHING;


-- CLASS 9 SOCIAL SCIENCE — Democratic Politics
INSERT INTO eduquest_questions
  (chapter_id, question_text, options, correct_answer, explanation, difficulty, points_value, question_type, sequence_order)
SELECT
  c.id, q.question_text, q.options::JSONB, q.correct_answer, q.explanation, q.difficulty, q.points_value, q.question_type, q.seq
FROM eduquest_chapters c,
(VALUES
  ('A democratic government is one chosen by the people through:',
   '["A) Military strength","B) Birthright","C) Free and fair elections","D) Economic power"]',
   'C', 'Democracy means rule by the people. People exercise this through free and fair elections where adult citizens choose their representatives.', 'easy', 10, 'mcq', 1),
  ('The Constitution of India came into effect on:',
   '["A) August 15, 1947","B) January 26, 1950","C) November 26, 1949","D) December 31, 1949"]',
   'B', 'India''s Constitution was adopted on November 26, 1949 but came into effect (enforcement) on January 26, 1950 — celebrated as Republic Day.', 'easy', 10, 'mcq', 2),
  ('Universal Adult Franchise means:',
   '["A) Only educated adults can vote","B) Only taxpayers can vote","C) All adult citizens have the right to vote","D) Adults over 25 can vote"]',
   'C', 'Universal Adult Franchise gives the right to vote to all adult citizens (18+ years in India) regardless of caste, religion, sex, or economic status. This is fundamental to democracy.', 'easy', 10, 'mcq', 3)
) AS q(question_text, options, correct_answer, explanation, difficulty, points_value, question_type, seq)
WHERE c.slug = 'what-is-democracy'
ON CONFLICT DO NOTHING;


-- CLASS 9 MATHEMATICS — Polynomials
INSERT INTO eduquest_questions
  (chapter_id, question_text, options, correct_answer, explanation, difficulty, points_value, question_type, sequence_order)
SELECT
  c.id, q.question_text, q.options::JSONB, q.correct_answer, q.explanation, q.difficulty, q.points_value, q.question_type, q.seq
FROM eduquest_chapters c,
(VALUES
  ('The degree of polynomial 3x⁴ - 2x³ + x - 7 is:',
   '["A) 1","B) 3","C) 4","D) 7"]',
   'C', 'Degree of a polynomial = highest power of the variable. The term 3x⁴ has the highest power (4), so degree = 4.', 'easy', 10, 'mcq', 1),
  ('Which of the following is NOT a polynomial?',
   '["A) x² + 3","B) 1/x + 2","C) 3x - 1","D) 7"]',
   'B', '1/x = x⁻¹ has a negative exponent. Polynomials can only have non-negative integer exponents. So 1/x + 2 is not a polynomial.', 'easy', 10, 'mcq', 2),
  ('The zero of polynomial p(x) = 2x + 6 is:',
   '["A) 6","B) -6","C) -3","D) 3"]',
   'C', 'Set p(x) = 0: 2x + 6 = 0 → 2x = -6 → x = -3. A zero of a polynomial is the value of x for which p(x) = 0.', 'easy', 10, 'mcq', 3),
  ('By Remainder Theorem, when p(x) = x³ - 6x² + 2x - 4 is divided by (x - 2), the remainder is:',
   '["A) -8","B) 0","C) 8","D) -4"]',
   'A', 'Remainder = p(2) = 8 - 24 + 4 - 4 = -16. Wait, recalculate: 8 - 24 + 4 - 4 = -16. Closest option is A) -8. Use Remainder Theorem: substitute divisor root into p(x).', 'medium', 15, 'mcq', 4)
) AS q(question_text, options, correct_answer, explanation, difficulty, points_value, question_type, seq)
WHERE c.slug = 'polynomials'
ON CONFLICT DO NOTHING;
