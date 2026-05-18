/**
 * FILE: seed.ts
 * LOCATION: src/lib/server/database/seed.ts
 * PURPOSE: Seeds the EduQuest PostgreSQL database with realistic demo data.
 *          Inserts: 10 leaderboard users, 10 community posts, 6 events.
 *          All INSERTs use ON CONFLICT DO NOTHING — safe to run multiple times.
 * USED BY: npm run db:seed
 * LAST UPDATED: 2026-05-18
 *
 * TABLE SCHEMAS (actual columns):
 *   eduquest_users: id, name, email, password_hash, track, level, xp, streak, created_at
 *   eduquest_community_posts: id, author_id, author_name, title, body,
 *                             tags TEXT[], likes, comments, views, created_at
 *   eduquest_events: id TEXT, title, description, event_date_label, location,
 *                    participant_count, status (live|upcoming|completed),
 *                    gradient, is_public, sort_order, created_at, updated_at
 *   eduquest_event_registrations: id, event_id TEXT, user_id UUID, created_at
 *                                 UNIQUE(event_id, user_id)
 */

import { closePostgresPool, getPostgresPool } from "./postgres";

/* ─────────────────────────────────────────────
 * Demo user data — stable UUIDs allow idempotent cross-table references
 * ───────────────────────────────────────────── */
const DEMO_USERS = [
  { id: "11111111-1111-1111-1111-111111111101", name: "Aryan Sharma",    email: "aryan@demo.edu",    track: "class-12",    level: 9,  xp: 8420, streak: 47 },
  { id: "11111111-1111-1111-1111-111111111102", name: "Priya Nair",       email: "priya@demo.edu",    track: "class-11",    level: 8,  xp: 7310, streak: 31 },
  { id: "11111111-1111-1111-1111-111111111103", name: "Rohan Mehta",      email: "rohan@demo.edu",    track: "engineering", level: 8,  xp: 6980, streak: 22 },
  { id: "11111111-1111-1111-1111-111111111104", name: "Ananya Singh",     email: "ananya@demo.edu",   track: "class-10",    level: 7,  xp: 5850, streak: 18 },
  { id: "11111111-1111-1111-1111-111111111105", name: "Karan Patel",      email: "karan@demo.edu",    track: "engineering", level: 7,  xp: 5420, streak: 12 },
  { id: "11111111-1111-1111-1111-111111111106", name: "Divya Krishnan",   email: "divya@demo.edu",    track: "class-12",    level: 6,  xp: 4900, streak: 9  },
  { id: "11111111-1111-1111-1111-111111111107", name: "Siddharth Rao",    email: "siddharth@demo.edu",track: "class-11",    level: 6,  xp: 4200, streak: 7  },
  { id: "11111111-1111-1111-1111-111111111108", name: "Meera Verma",      email: "meera@demo.edu",    track: "class-9",     level: 5,  xp: 3750, streak: 14 },
  { id: "11111111-1111-1111-1111-111111111109", name: "Aditya Joshi",     email: "aditya@demo.edu",   track: "class-10",    level: 5,  xp: 3100, streak: 5  },
  { id: "11111111-1111-1111-1111-111111111110", name: "Kavya Reddy",      email: "kavya@demo.edu",    track: "class-9",     level: 4,  xp: 2540, streak: 8  },
];

/*
 * A placeholder password hash used for seeded demo accounts.
 * These accounts are for display/demo only — not intended for actual login.
 * The string format is argon2id but the hash body is a placeholder.
 */
const DEMO_HASH = "$argon2id$v=19$m=65536,t=3,p=4$DEMO_PLACEHOLDER_SEED_HASH_NOT_VALID";

/* ─────────────────────────────────────────────
 * Demo community posts
 * tags is TEXT[] (PostgreSQL array) — we pass it as a JS string array
 * ───────────────────────────────────────────── */
const DEMO_POSTS = [
  {
    id: "22222222-2222-2222-2222-222222222201",
    author_id: "11111111-1111-1111-1111-111111111101",
    author_name: "Aryan Sharma",
    title: "How I cracked JEE Mains with EduQuest's 60-day plan",
    body: "I followed the structured day-wise plan for Class 12 Physics and Maths. The key is consistency — 3 hours daily for 60 days. The XP system kept me motivated through the tough weeks.",
    tags: ["class-12", "jee", "motivation"],
    likes: 142, comments: 28, views: 1840,
  },
  {
    id: "22222222-2222-2222-2222-222222222202",
    author_id: "11111111-1111-1111-1111-111111111103",
    author_name: "Rohan Mehta",
    title: "DSA in 45 days — my full journey from basics to interview-ready",
    body: "Started with absolutely zero knowledge of data structures. The EduQuest DSA plan takes you from arrays and linked lists all the way to graphs and dynamic programming. The battle arena for DSA problems is a game changer.",
    tags: ["engineering", "dsa", "placement"],
    likes: 98, comments: 19, views: 1220,
  },
  {
    id: "22222222-2222-2222-2222-222222222203",
    author_id: "11111111-1111-1111-1111-111111111104",
    author_name: "Ananya Singh",
    title: "Class 10 Science — best strategy for 95+ in boards",
    body: "Don't just read NCERT — solve every in-text question and example. For Physics numericals, practice at least 5 problems per chapter type.",
    tags: ["class-10", "boards", "science"],
    likes: 87, comments: 14, views: 980,
  },
  {
    id: "22222222-2222-2222-2222-222222222204",
    author_id: "11111111-1111-1111-1111-111111111102",
    author_name: "Priya Nair",
    title: "Stream selection advice — Science vs Commerce for Class 11",
    body: "If you love problem-solving and don't mind 3-4 hours of daily study, Science is worth it. If you want flexibility, Commerce is underrated.",
    tags: ["class-11", "streams", "advice"],
    likes: 74, comments: 22, views: 890,
  },
  {
    id: "22222222-2222-2222-2222-222222222205",
    author_id: "11111111-1111-1111-1111-111111111105",
    author_name: "Karan Patel",
    title: "Python vs Java — which should engineering students learn first?",
    body: "Python for quick wins and data science path. Java for core CS placement prep. I did Python first (30 days), then switched to Java for campus placement.",
    tags: ["engineering", "python", "java"],
    likes: 61, comments: 11, views: 740,
  },
  {
    id: "22222222-2222-2222-2222-222222222206",
    author_id: "11111111-1111-1111-1111-111111111108",
    author_name: "Meera Verma",
    title: "Class 9 Maths — understanding Real Numbers without cramming",
    body: "Most students try to memorize Real Numbers theorems without understanding why they work. This unit is actually about the structure of number systems.",
    tags: ["class-9", "maths", "ncert"],
    likes: 45, comments: 8, views: 560,
  },
  {
    id: "22222222-2222-2222-2222-222222222207",
    author_id: "11111111-1111-1111-1111-111111111106",
    author_name: "Divya Krishnan",
    title: "Battle Arena strategies — how to win more quiz battles",
    body: "Speed matters, but accuracy matters more. In EduQuest battles each correct answer is worth more. Skip questions you're unsure about, come back at the end.",
    tags: ["battle", "strategy", "tips"],
    likes: 39, comments: 7, views: 480,
  },
  {
    id: "22222222-2222-2222-2222-222222222208",
    author_id: "11111111-1111-1111-1111-111111111107",
    author_name: "Siddharth Rao",
    title: "How to maintain a 30-day streak while balancing school",
    body: "Block 45 minutes every evening before dinner. Consistency beats volume. The streak system here really rewires your habit loop.",
    tags: ["general", "streak", "habit"],
    likes: 33, comments: 6, views: 420,
  },
  {
    id: "22222222-2222-2222-2222-222222222209",
    author_id: "11111111-1111-1111-1111-111111111109",
    author_name: "Aditya Joshi",
    title: "C++ for beginners — is it really that hard?",
    body: "C++ has a reputation for being difficult but the EduQuest plan breaks it into very manageable daily tasks. Week 1 is syntax, Week 2 is functions and arrays, Week 3 is OOP basics.",
    tags: ["engineering", "cpp", "beginner"],
    likes: 29, comments: 5, views: 360,
  },
  {
    id: "22222222-2222-2222-2222-222222222210",
    author_id: "11111111-1111-1111-1111-111111111110",
    author_name: "Kavya Reddy",
    title: "My first week on EduQuest — honest review",
    body: "I joined 7 days ago. The UI is clean, the chapters are well-organized, and I already have a 7-day streak going. The battle feature is surprisingly addictive.",
    tags: ["general", "review"],
    likes: 21, comments: 9, views: 290,
  },
];

/* ─────────────────────────────────────────────
 * Demo events — matches the actual schema from migration 002:
 * id TEXT, title, description, event_date_label, location,
 * participant_count, status (live|upcoming|completed), gradient, sort_order
 * ───────────────────────────────────────────── */
const DEMO_EVENTS = [
  {
    id: "national-science-olympiad-2026",
    title: "National Science Olympiad 2026",
    description: "Test your Class 9-10 science knowledge against students from across India. Top 3 scorers win cash prizes.",
    event_date_label: "June 1, 2026",
    location: "Online",
    participant_count: 312,
    status: "upcoming",
    gradient: "linear-gradient(135deg, #3B82F6, #06B6D4)",
    sort_order: 5,
  },
  {
    id: "jee-mains-mock-marathon",
    title: "JEE Mains Mock Marathon",
    description: "Full-length 3-hour JEE Mains simulation with Class 12 Physics, Chemistry, and Maths. Personalized report provided.",
    event_date_label: "May 22, 2026",
    location: "Online",
    participant_count: 187,
    status: "upcoming",
    gradient: "linear-gradient(135deg, #7C3AED, #2563EB)",
    sort_order: 6,
  },
  {
    id: "python-hackathon-24h",
    title: "Python Hackathon — Build in 24 Hours",
    description: "Teams of 1-3 build a Python project in 24 hours. Judged on code quality, functionality, and creativity.",
    event_date_label: "June 8, 2026",
    location: "Online",
    participant_count: 94,
    status: "upcoming",
    gradient: "linear-gradient(135deg, #10B981, #3B82F6)",
    sort_order: 7,
  },
  {
    id: "class9-maths-championship",
    title: "Class 9 Mathematics Championship",
    description: "Speed and accuracy challenge across all 15 chapters of Class 9 Mathematics. Leaderboard resets each round.",
    event_date_label: "May 18 – 23, 2026",
    location: "Online",
    participant_count: 258,
    status: "live",
    gradient: "linear-gradient(135deg, #F59E0B, #EF4444)",
    sort_order: 8,
  },
  {
    id: "dsa-battle-tournament-s2",
    title: "DSA Battle Tournament — Season 2",
    description: "1v1 battle format across 64 participants. Single elimination, DSA medium difficulty. Prize: EduQuest Pro 6 months.",
    event_date_label: "May 17 – 24, 2026",
    location: "Online",
    participant_count: 64,
    status: "live",
    gradient: "linear-gradient(135deg, #EF4444, #F97316)",
    sort_order: 9,
  },
  {
    id: "cbse-board-bootcamp-2026",
    title: "CBSE Board Revision Bootcamp",
    description: "Intensive 3-day online revision bootcamp for Class 10 board exam preparation covering all major subjects.",
    event_date_label: "May 8 – 10, 2026",
    location: "Online",
    participant_count: 389,
    status: "completed",
    gradient: "linear-gradient(135deg, #6B7280, #374151)",
    sort_order: 10,
  },
];

/* ─────────────────────────────────────────────
 * Main seed function
 * ───────────────────────────────────────────── */
async function seed(): Promise<void> {
  const pool = getPostgresPool();
  console.log("EduQuest seed: starting…");

  /* ── 1. Demo Users ───────────────────────────────────────────────────────── */
  console.log("  Seeding 10 demo users…");
  for (const user of DEMO_USERS) {
    await pool.query(
      `INSERT INTO eduquest_users
         (id, name, email, password_hash, track, level, xp, streak, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8,
               NOW() - (RANDOM() * INTERVAL '90 days'))
       ON CONFLICT (id) DO NOTHING`,
      [user.id, user.name, user.email, DEMO_HASH, user.track, user.level, user.xp, user.streak]
    );
  }

  /* ── 2. Community Posts ─────────────────────────────────────────────────── */
  console.log("  Seeding 10 community posts…");
  for (const post of DEMO_POSTS) {
    /*
     * tags is TEXT[] in PostgreSQL.
     * Passing a JS string array directly works with node-postgres — it serializes
     * the array to the PostgreSQL ARRAY literal format automatically.
     */
    await pool.query(
      `INSERT INTO eduquest_community_posts
         (id, author_id, author_name, title, body, tags, likes, comments, views, created_at)
       VALUES ($1, $2, $3, $4, $5, $6::TEXT[], $7, $8, $9,
               NOW() - (RANDOM() * INTERVAL '30 days'))
       ON CONFLICT (id) DO NOTHING`,
      [
        post.id,
        post.author_id,
        post.author_name,
        post.title,
        post.body,
        post.tags,
        post.likes,
        post.comments,
        post.views,
      ]
    );
  }

  /* ── 3. Events ──────────────────────────────────────────────────────────── */
  console.log("  Seeding 6 events…");
  for (const event of DEMO_EVENTS) {
    await pool.query(
      `INSERT INTO eduquest_events
         (id, title, description, event_date_label, location, participant_count,
          status, gradient, sort_order, is_public, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE, NOW(), NOW())
       ON CONFLICT (id) DO NOTHING`,
      [
        event.id,
        event.title,
        event.description,
        event.event_date_label,
        event.location,
        event.participant_count,
        event.status,
        event.gradient,
        event.sort_order,
      ]
    );
  }

  /* ── 4. Event Registrations ─────────────────────────────────────────────── */
  console.log("  Seeding event registrations…");
  const registrations = [
    { event_id: "national-science-olympiad-2026", user_id: "11111111-1111-1111-1111-111111111104" },
    { event_id: "jee-mains-mock-marathon",        user_id: "11111111-1111-1111-1111-111111111101" },
    { event_id: "jee-mains-mock-marathon",        user_id: "11111111-1111-1111-1111-111111111106" },
    { event_id: "python-hackathon-24h",            user_id: "11111111-1111-1111-1111-111111111103" },
    { event_id: "python-hackathon-24h",            user_id: "11111111-1111-1111-1111-111111111105" },
    { event_id: "dsa-battle-tournament-s2",        user_id: "11111111-1111-1111-1111-111111111103" },
  ];

  for (const reg of registrations) {
    await pool.query(
      `INSERT INTO eduquest_event_registrations (event_id, user_id, created_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (event_id, user_id) DO NOTHING`,
      [reg.event_id, reg.user_id]
    );
  }

  console.log("EduQuest seed: completed successfully.");
}

seed()
  .catch((err) => {
    console.error("EduQuest seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closePostgresPool();
  });
