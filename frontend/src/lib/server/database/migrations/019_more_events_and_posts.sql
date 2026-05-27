-- =============================================================================
-- Migration 019: More events and community posts
--
-- PURPOSE:
--   Adds richer data to make every page feel alive and production-ready:
--   1. 10 new events (JEE/NEET mocks, board tests, coding tournaments)
--   2. 20 new community posts covering Class 11, 12, and Engineering topics
--
-- IDEMPOTENT: Uses ON CONFLICT DO NOTHING throughout.
-- TABLES AFFECTED: eduquest_events, eduquest_community_posts
-- COLUMN REFERENCE:
--   eduquest_events: id TEXT PK, title, description, event_date_label TEXT,
--                    location, participant_count INT, status, gradient,
--                    is_public BOOL, sort_order INT, created_at, updated_at
--   eduquest_community_posts: id UUID PK, author_id UUID (nullable FK),
--                    author_name, title, body, tags TEXT[], likes, comments,
--                    views, created_at
-- LAST UPDATED: 2026-05-27
-- =============================================================================


-- ═══════════════════════════════════════════════════════════════
-- SECTION 1: 10 new competition events
-- Uses correct column names: event_date_label (not event_date)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO eduquest_events (
  id, title, description, event_date_label, location,
  participant_count, status, gradient, is_public, sort_order, created_at, updated_at
) VALUES
  (
    'jee-advanced-mock-marathon',
    'JEE Advanced Mock Marathon',
    'Full-length 3-hour JEE Advanced simulation with Physics, Chemistry, and Math papers. Instant analytics show where you stand against 10,000+ aspirants. Rank list published within 24 hours.',
    'June 20, 2026',
    'Online — EduQuest Test Center',
    3241,
    'upcoming',
    'linear-gradient(135deg, #2563EB, #1D4ED8)',
    TRUE, 10,
    NOW() - INTERVAL '7 days',
    NOW()
  ),
  (
    'neet-biology-olympiad',
    'NEET Biology Olympiad 2026',
    'Compete in a 90-minute Biology mega-quiz covering Botany and Zoology as per the latest NMC syllabus. Top 50 scorers receive personalised performance reports and NEET-readiness certificates.',
    'June 8, 2026',
    'Online — EduQuest Battle Arena',
    1872,
    'upcoming',
    'linear-gradient(135deg, #10B981, #059669)',
    TRUE, 11,
    NOW() - INTERVAL '5 days',
    NOW()
  ),
  (
    'class-12-board-grand-mock',
    'Class 12 Board Grand Mock 2026',
    'Complete Class 12 board syllabus across Maths, Physics, Chemistry, and English in one day. Timed papers mirror the official CBSE pattern. Detailed chapter-wise weakness report included.',
    'June 14, 2026',
    'Online — All Day Event',
    2654,
    'upcoming',
    'linear-gradient(135deg, #8B5CF6, #6D28D9)',
    TRUE, 12,
    NOW() - INTERVAL '6 days',
    NOW()
  ),
  (
    'python-coding-championship',
    'Python Coding Championship',
    'Solve 5 algorithmic problems in 2 hours using Python. Problems range from beginner list manipulation to advanced graph traversal. Rated by EduQuest difficulty scores — no prerequisites required.',
    'July 5, 2026',
    'Online — EduQuest Code Arena',
    987,
    'upcoming',
    'linear-gradient(135deg, #F59E0B, #D97706)',
    TRUE, 13,
    NOW() - INTERVAL '3 days',
    NOW()
  ),
  (
    'class-10-science-battle',
    'Class 10 Science Battle Royale',
    'Real-time head-to-head science quiz for Class 10 students. 64-player bracket — single elimination. Win your bracket to claim the Science Champion badge and 200 bonus XP.',
    'June 3, 2026',
    'Online — Live Battle Bracket',
    448,
    'upcoming',
    'linear-gradient(135deg, #06B6D4, #0891B2)',
    TRUE, 14,
    NOW() - INTERVAL '2 days',
    NOW()
  ),
  (
    'dsa-weekly-challenge-may',
    'DSA Weekly Challenge — May Edition',
    'Three LeetCode-style problems released every Saturday. Solve them before Sunday midnight to earn XP. This week: Arrays, Binary Search, and Linked Lists. Leaderboard resets weekly.',
    'May 31, 2026',
    'Online — Open to All',
    1543,
    'live',
    'linear-gradient(135deg, #EC4899, #DB2777)',
    TRUE, 7,
    NOW() - INTERVAL '1 day',
    NOW()
  ),
  (
    'cbse-class-9-math-quiz',
    'Class 9 Math Mastery Quiz',
    'Test Class 9 Mathematics knowledge across Number Systems, Polynomials, Coordinate Geometry, and Linear Equations. Instant feedback with step-by-step solutions for every answer.',
    'May 10, 2026',
    'Online — Completed',
    2201,
    'completed',
    'linear-gradient(135deg, #3B82F6, #1D4ED8)',
    TRUE, 20,
    NOW() - INTERVAL '20 days',
    NOW()
  ),
  (
    'chemistry-jee-sprint',
    'JEE Chemistry Sprint',
    'Focus on Physical, Organic, and Inorganic Chemistry. 60 MCQs in 60 minutes — just like JEE. Expert solutions released immediately after the timer ends.',
    'June 5, 2026',
    'Online — EduQuest Test Center',
    1129,
    'upcoming',
    'linear-gradient(135deg, #14B8A6, #0D9488)',
    TRUE, 15,
    NOW() - INTERVAL '3 days',
    NOW()
  ),
  (
    'inter-school-debate-tech',
    'Inter-School Tech Debate 2026',
    'Teams of three debate AI, cybersecurity, and future-of-work topics before a panel of judges. Open to Class 11 and 12 students. Online rounds followed by a national final in Delhi.',
    'July 18, 2026',
    'Online Rounds + National Final, Delhi',
    312,
    'upcoming',
    'linear-gradient(135deg, #6366F1, #4338CA)',
    TRUE, 16,
    NOW() - INTERVAL '4 days',
    NOW()
  ),
  (
    'open-source-hackathon-2026',
    'Open Source Hackathon 2026',
    'Build a real feature for an open-source educational project over 48 hours. Solo or team of two. Projects judged on code quality, documentation, and impact. Winners featured on EduQuest Blog.',
    'August 2, 2026',
    'Online — Globally Open',
    203,
    'upcoming',
    'linear-gradient(135deg, #F97316, #EA580C)',
    TRUE, 17,
    NOW() - INTERVAL '1 day',
    NOW()
  )
ON CONFLICT (id) DO NOTHING;


-- ═══════════════════════════════════════════════════════════════
-- SECTION 2: 20 new community posts (Class 11, 12, Engineering)
-- author_id is nullable (FK with ON DELETE SET NULL) — use NULL for demo posts
-- ═══════════════════════════════════════════════════════════════

INSERT INTO eduquest_community_posts (
  id, author_id, author_name, title, body, tags, likes, comments, views, created_at
) VALUES
  (
    gen_random_uuid(), NULL, 'Priya Sharma',
    'How I scored 95+ in Class 12 Physics — my complete strategy',
    'After failing my first Physics unit test with 62%, I completely changed my approach. Here is exactly what worked: 1) NCERT first — read every line before touching any reference book. 2) Derivations: wrote them out by hand at least 3 times each. 3) PYQs from 2015-2025: patterns repeat more than you think. 4) Numerical practice daily — even 5 problems keeps the formulas fresh. The biggest mistake I see is jumping straight to HC Verma before finishing NCERT. Master the basics first.',
    ARRAY['class-12', 'physics', 'strategy', 'boards'],
    94, 28, 1843,
    NOW() - INTERVAL '12 hours'
  ),
  (
    gen_random_uuid(), NULL, 'Rahul Mehta',
    'JEE vs NEET — which one should I choose after Class 10?',
    'I get this question a lot in my coaching group. Here is my honest take after going through JEE Main preparation: If you genuinely enjoy solving puzzles and can spend 6+ hours on a single problem — JEE. If you are better at memorisation and conceptual understanding of biology — NEET. Both are hard. The real question is: do you see yourself as an engineer or a doctor in 10 years? Visit a hospital, visit an engineering firm. Then decide. Do NOT choose based on which is easier.',
    ARRAY['jee', 'neet', 'class-10', 'career-advice'],
    87, 41, 2205,
    NOW() - INTERVAL '1 day'
  ),
  (
    gen_random_uuid(), NULL, 'Arjun Nair',
    'Complete roadmap for learning Python from zero to job-ready',
    'I landed my first Python developer role after 8 months of self-study. The roadmap that worked: Week 1-4: Basics (variables, loops, functions, OOP). Month 2: Data structures — lists, dicts, sets. Month 3: File I/O, exceptions, modules. Month 4: Web fundamentals with Flask. Month 5-6: Build 3 real projects (portfolio tracker, weather app, quiz bot). Month 7-8: DSA in Python for interviews — LeetCode Easy to Medium. The trick is building something real every 2 weeks, not just following tutorials.',
    ARRAY['python', 'engineering', 'career', 'roadmap'],
    121, 35, 3412,
    NOW() - INTERVAL '2 days'
  ),
  (
    gen_random_uuid(), NULL, 'Sneha Patel',
    'Class 11 Chemistry Organic reactions — a simple memory trick',
    'Organic reactions felt impossible until I found this pattern: every reaction either adds, removes, or replaces something. Addition reactions add atoms across a double bond. Elimination removes to form a double bond. Substitution replaces one group with another. Once I framed every reaction in these three categories, the entire chapter became predictable. Draw the reactant, identify what is happening structurally, then apply the pattern. Works 90% of the time without memorising individual reactions.',
    ARRAY['class-11', 'chemistry', 'organic', 'tips'],
    73, 19, 1298,
    NOW() - INTERVAL '3 days'
  ),
  (
    gen_random_uuid(), NULL, 'Vikram Singh',
    'How to use EduQuest battles to actually improve — not just grind XP',
    'I spent two weeks just grinding battles to climb the leaderboard and my actual understanding barely improved. Then I changed strategy: 1) Before a battle, revise the subject topic for 15 mins. 2) After losing a question, look up why — do not just move on. 3) Focus on one subject per battle session, not random all-subject mode. 4) Use the battle history to find your 3 weakest topics each week. My XP growth slowed initially but my test scores jumped 20 points. Battle smarter, not harder.',
    ARRAY['battle', 'strategy', 'learning', 'tips'],
    68, 22, 1567,
    NOW() - INTERVAL '4 days'
  ),
  (
    gen_random_uuid(), NULL, 'Aditya Joshi',
    'Understanding pointers in C — explained simply for beginners',
    'Pointers confused me for months. Here is the simplest way I found to think about it: A variable stores a value. A pointer stores the address of where that value lives in memory. int x = 5 — x stores 5. int *p = &x — p stores the address of x. *p gives you back 5 by going to that address. The key insight: modifying *p is the same as modifying x directly. This is why pointers are powerful — you can pass around addresses instead of copying large data. Once this clicked, dynamic memory allocation made complete sense.',
    ARRAY['c-language', 'engineering', 'pointers', 'beginner'],
    56, 14, 1102,
    NOW() - INTERVAL '5 days'
  ),
  (
    gen_random_uuid(), NULL, 'Kavya Reddy',
    'Class 12 Maths — integration without memorising all 25 formulas',
    'Integration has ~25 standard forms to remember but I found a pattern-matching approach that reduces the memory load. 90% of problems fall into: 1) Standard forms (basic 6 — just memorise these). 2) Substitution — look for f(x) whose derivative is also in the integral. 3) Integration by parts — whenever you see lnx, arctan, or a product. 4) Partial fractions — when you have a rational expression. Learn to identify which category a problem belongs to before trying to solve it. Category identification is the actual skill.',
    ARRAY['class-12', 'mathematics', 'integration', 'calculus'],
    89, 31, 2341,
    NOW() - INTERVAL '6 days'
  ),
  (
    gen_random_uuid(), NULL, 'Rohan Gupta',
    'Git and GitHub for beginners — what every engineering student must know',
    'Before my first internship I had never used Git. It cost me two days of embarrassment. Here is the absolute minimum: git init starts a repo. git add . stages all changes. git commit -m saves a snapshot. git push sends to GitHub. git pull gets latest from remote. git branch feature-name creates a new branch. That is honestly 80% of daily Git usage. Install Git, create a GitHub account, and commit your next assignment there. Future employers will see it.',
    ARRAY['git', 'engineering', 'internship', 'beginner'],
    103, 27, 2876,
    NOW() - INTERVAL '7 days'
  ),
  (
    gen_random_uuid(), NULL, 'Anika Sharma',
    'CBSE Class 11 Physics — chapters ranked by difficulty and weightage',
    'After going through 3 years of CBSE PYQs, here is my difficulty + weightage analysis: HIGH weightage + HARD: Laws of Motion (8-10 marks every year, concepts tricky), Work Energy Power, Rotational Motion. HIGH weightage + MODERATE: Kinematics, Gravitation, Oscillations. HIGH weightage + EASY: Units and Measurements (always 1-2 direct questions). Focus 60% of your time on Laws of Motion, WEP, and Rotation. They appear every year and students consistently lose marks on them.',
    ARRAY['class-11', 'physics', 'cbse', 'weightage'],
    77, 24, 1892,
    NOW() - INTERVAL '8 days'
  ),
  (
    gen_random_uuid(), NULL, 'Siddharth Rao',
    'Time complexity explained — why O(n²) will fail your interview',
    'In every SDE interview I have been asked to optimise an O(n²) solution. Here is how to think about it: O(1) — constant, does not grow. O(log n) — binary search, halves each time. O(n) — linear scan, one pass. O(n log n) — merge sort, efficient sorting. O(n²) — nested loops, avoid for large inputs. The rule: if n > 10,000, O(n²) will time out. Always ask: can I use a hash map to trade space for speed? Most O(n²) problems become O(n) with a dictionary. Practice identifying the bottleneck loop first.',
    ARRAY['dsa', 'engineering', 'interview', 'complexity'],
    134, 38, 3987,
    NOW() - INTERVAL '9 days'
  ),
  (
    gen_random_uuid(), NULL, 'Priya Nair',
    'How to maintain a 100+ day streak without burning out',
    'I am on day 138 right now. The strategy that kept me going without burning out: 1) Set a minimum viable session — even 15 minutes counts. On bad days, do the minimum and stop. 2) Do not break for travel — even one question on your phone counts. 3) Weekends are catch-up days, not off days. 4) Use the leaderboard as motivation but not as your only metric. 5) Take one full subject break per week — switch subjects to avoid mental fatigue. The streak is a commitment to consistency, not perfection.',
    ARRAY['streak', 'motivation', 'consistency', 'tips'],
    112, 44, 3102,
    NOW() - INTERVAL '10 days'
  ),
  (
    gen_random_uuid(), NULL, 'Kartik Menon',
    'SQL basics every engineering student must know before placements',
    'Most campus placement rounds include at least one SQL question. Here is what you need: SELECT with WHERE, ORDER BY, LIMIT. GROUP BY with COUNT, SUM, AVG. JOINs — INNER, LEFT, RIGHT. Subqueries in WHERE clause. The most common question pattern: Find the second highest salary. Practice on HackerRank SQL Easy section — 20 problems will cover 90% of campus round questions. Make sure you understand the difference between WHERE and HAVING — that trips up a lot of students.',
    ARRAY['sql', 'engineering', 'placements', 'interview'],
    91, 29, 2543,
    NOW() - INTERVAL '11 days'
  ),
  (
    gen_random_uuid(), NULL, 'Meera Iyer',
    'Class 12 Economics — how to write perfect 6-mark answers',
    'CBSE Economics 6-mark answers have a strict structure that examiners look for: 1) One-line definition of the concept. 2) Diagram (if applicable — always draw one, even basic ones get marks). 3) Explanation in 3-4 points. 4) One real-world example. 5) Conclusion linking back to the question. I went from 60% to 85% just by following this structure for every long answer. The examiners use marking keys — give them exactly what the key expects.',
    ARRAY['class-12', 'economics', 'cbse', 'answer-writing'],
    65, 21, 1453,
    NOW() - INTERVAL '12 days'
  ),
  (
    gen_random_uuid(), NULL, 'Harsh Bhatia',
    'Recursion vs iteration — when to use which in coding interviews',
    'The rule I use: If the problem has a natural tree or recursive structure — use recursion (tree traversal, factorial, fibonacci). If performance is critical and stack overflow is a risk — use iteration. In interviews: first solve recursively (cleaner code, easier to explain), then mention the iterative approach when asked about optimisation. The tricky part is understanding the call stack. Draw out the recursion tree for small inputs first. Once you can draw it, you can code it.',
    ARRAY['dsa', 'recursion', 'engineering', 'interview'],
    78, 26, 2012,
    NOW() - INTERVAL '13 days'
  ),
  (
    gen_random_uuid(), NULL, 'Tanvi Kulkarni',
    'Class 11 Biology — best way to study cell division (Mitosis vs Meiosis)',
    'These two chapters account for 8+ marks in CBSE and NEET. My method: Draw the stages of both from memory every week — Prophase, Metaphase, Anaphase, Telophase. Focus on what is DIFFERENT between them: Mitosis = 1 division, 2 identical cells. Meiosis = 2 divisions, 4 genetically different cells. The specific differences in Prophase I (crossing over) and the separation of homologous chromosomes in Meiosis I are the most frequently tested points. Draw, label, test yourself.',
    ARRAY['class-11', 'biology', 'cell-division', 'neet'],
    69, 17, 1723,
    NOW() - INTERVAL '14 days'
  ),
  (
    gen_random_uuid(), NULL, 'Dev Sharma',
    'JavaScript async/await explained — I finally understand Promises',
    'Promises and async/await broke my brain for months. Here is the simplest mental model: A Promise is a box that will eventually contain a value (or an error). async marks a function as one that returns a Promise. await pauses the function until the Promise resolves. The key insight: await only pauses the current function — not the whole program. So other code runs while you wait. Error handling: wrap await in try/catch — it catches Promise rejections the same way synchronous code throws errors.',
    ARRAY['javascript', 'engineering', 'async', 'promises'],
    99, 33, 2678,
    NOW() - INTERVAL '15 days'
  ),
  (
    gen_random_uuid(), NULL, 'Ananya Singh',
    'NEET 2027 preparation — complete timeline from Class 11',
    'Starting NEET prep in Class 11 gives you a real advantage. Here is the 2-year timeline: Class 11 Year 1: Master Physics (mechanics + electricity), Chemistry (physical + some organic), Biology (all units). Do NOT skip any chapter — NEET covers Class 11 and 12 equally. Summer after Class 11: Complete revision of Class 11 + start Class 12. Class 12 Year 2: Finish new syllabus by January. Feb-March: Full-length mock tests every week. April: Only revise weak areas. The formula is consistency — 4-5 hours daily, not 12-hour cramming sessions.',
    ARRAY['neet', 'class-11', 'preparation', 'timeline'],
    145, 52, 4231,
    NOW() - INTERVAL '16 days'
  ),
  (
    gen_random_uuid(), NULL, 'Karan Joshi',
    'Object-Oriented Programming concepts — explained with real examples',
    'OOP is not just theory — here is each concept with a real-world example: Encapsulation = a car engine. You press the accelerator without knowing internal combustion details. Class hides complexity. Inheritance = a Dog is an Animal. Dog inherits eat() and sleep() from Animal, adds fetch(). Polymorphism = the same method name bark() behaves differently for a Dog vs a Cat. Abstraction = ATM machine — you interact with the interface, not the bank server code. In interviews, always explain with examples.',
    ARRAY['java', 'oop', 'engineering', 'concepts'],
    88, 30, 2345,
    NOW() - INTERVAL '17 days'
  ),
  (
    gen_random_uuid(), NULL, 'Shruti Verma',
    'Class 12 English — tips for scoring 95+ in the written section',
    'The writing section (16-20 marks) is the easiest to improve quickly. Here is what helped me: Notice Writing: Strictly follow format — NOTICE, institution name, date, subject, body, signatory. No mark for content if format is wrong. Article/Speech: Start with a rhetorical question or shocking statistic. End with a call to action. 300-word limit — never exceed. Letter Writing: Formal letters need proper salutation + subject line + closing. Practice 2 full-length writing tasks every week for 4 weeks before boards.',
    ARRAY['class-12', 'english', 'boards', 'writing'],
    71, 23, 1654,
    NOW() - INTERVAL '18 days'
  ),
  (
    gen_random_uuid(), NULL, 'Nikhil Kumar',
    'Binary search — the one algorithm that appears in every SDE interview',
    'I have had binary search appear in 7 out of 10 SDE interviews I have given. The template every engineer should know: lo = 0, hi = n-1. While lo <= hi: mid = (lo + hi) // 2. If target == arr[mid]: return mid. If target < arr[mid]: hi = mid - 1. Else: lo = mid + 1. The harder problems apply this template on the ANSWER SPACE instead of an array. Practice: LC 704 (basic), 33 (rotated array), 162 (find peak), 1011 (capacity to ship). These four cover 90% of variations.',
    ARRAY['dsa', 'binary-search', 'engineering', 'interview'],
    156, 47, 4567,
    NOW() - INTERVAL '19 days'
  )
ON CONFLICT DO NOTHING;
