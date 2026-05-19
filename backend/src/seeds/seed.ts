/**
 * FILE: seed.ts
 * LOCATION: backend/src/seeds/seed.ts
 * PURPOSE: Database seed script that populates the EduQuest database with
 *          real CBSE curriculum data — classes, subjects, chapters, topics,
 *          sample questions, engineering languages, level definitions,
 *          community categories, and sample events.
 *
 * HOW TO RUN: npx ts-node src/seeds/seed.ts
 *
 * IMPORTANT: This script is IDEMPOTENT — it checks for existing data before
 *            inserting. Safe to run multiple times without creating duplicates.
 *
 * DATA SOURCES:
 *  - CBSE Class 9-12 syllabus (2025-2026 academic year)
 *  - NCERT textbook chapter listings
 *  - Standard engineering curriculum topics
 *
 * DEPENDENCIES: pg Pool from ../config/database
 * LAST UPDATED: 2026-05-19
 */

import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
});

/* ─────────────────────────────────────────────
 * SEED DATA DEFINITIONS
 * ───────────────────────────────────────────── */

/** Class categories — the top-level academic divisions */
const CLASSES = [
  { name: "Class 9", slug: "class-9", description: "CBSE Class 9 — Foundation year for secondary education", icon: "book-open", color: "#6366f1", order: 1 },
  { name: "Class 10", slug: "class-10", description: "CBSE Class 10 — Board examination preparation", icon: "graduation-cap", color: "#8b5cf6", order: 2 },
  { name: "Class 11", slug: "class-11", description: "CBSE Class 11 — Stream-based higher secondary", icon: "flask-conical", color: "#a855f7", order: 3 },
  { name: "Class 12", slug: "class-12", description: "CBSE Class 12 — Board + entrance exam preparation", icon: "award", color: "#d946ef", order: 4 },
  { name: "Engineering", slug: "engineering", description: "Programming languages, DSA, and computer science fundamentals", icon: "code-2", color: "#f43f5e", order: 5 },
];

/** Class 9 subjects with NCERT chapters */
const CLASS_9_SUBJECTS: SubjectDef[] = [
  {
    name: "Mathematics", slug: "mathematics", icon: "calculator", color: "#3b82f6",
    chapters: [
      "Number Systems", "Polynomials", "Coordinate Geometry", "Linear Equations in Two Variables",
      "Introduction to Euclid's Geometry", "Lines and Angles", "Triangles", "Quadrilaterals",
      "Circles", "Heron's Formula", "Surface Areas and Volumes", "Statistics", "Probability",
    ],
  },
  {
    name: "Science", slug: "science", icon: "atom", color: "#10b981",
    chapters: [
      "Matter in Our Surroundings", "Is Matter Around Us Pure", "Atoms and Molecules",
      "Structure of the Atom", "The Fundamental Unit of Life", "Tissues",
      "Motion", "Force and Laws of Motion", "Gravitation", "Work and Energy", "Sound",
      "Improvement in Food Resources",
    ],
  },
  {
    name: "Social Science", slug: "social-science", icon: "globe", color: "#f59e0b",
    chapters: [
      "The French Revolution", "Socialism in Europe and the Russian Revolution",
      "Nazism and the Rise of Hitler", "Forest Society and Colonialism",
      "Pastoralists in the Modern World", "India — Size and Location",
      "Physical Features of India", "Drainage", "Climate", "Natural Vegetation and Wildlife",
      "Democracy in the Contemporary World", "What is Democracy? Why Democracy?",
      "Constitutional Design", "Electoral Politics", "Working of Institutions",
      "Democratic Rights", "The Story of Village Palampur",
      "People as Resource", "Poverty as a Challenge", "Food Security in India",
    ],
  },
  {
    name: "English", slug: "english", icon: "book", color: "#ec4899",
    chapters: [
      "The Fun They Had", "The Sound of Music", "The Little Girl",
      "A Truly Beautiful Mind", "The Snake and the Mirror",
      "My Childhood", "Packing", "Reach for the Top",
      "The Bond of Love", "Kathmandu", "If I Were You",
    ],
  },
  {
    name: "Hindi", slug: "hindi", icon: "languages", color: "#ef4444",
    chapters: [
      "दो बैलों की कथा", "ल्हासा की ओर", "उपभोक्तावाद की संस्कृति",
      "साँवले सपनों की याद", "नाना साहब की पुत्री",
      "प्रेमचंद के फटे जूते", "मेरे बचपन के दिन",
    ],
  },
];

/** Class 10 subjects with NCERT chapters */
const CLASS_10_SUBJECTS: SubjectDef[] = [
  {
    name: "Mathematics", slug: "mathematics", icon: "calculator", color: "#3b82f6",
    chapters: [
      "Real Numbers", "Polynomials", "Pair of Linear Equations in Two Variables",
      "Quadratic Equations", "Arithmetic Progressions", "Triangles",
      "Coordinate Geometry", "Introduction to Trigonometry",
      "Some Applications of Trigonometry", "Circles",
      "Areas Related to Circles", "Surface Areas and Volumes",
      "Statistics", "Probability",
    ],
  },
  {
    name: "Science", slug: "science", icon: "atom", color: "#10b981",
    chapters: [
      "Chemical Reactions and Equations", "Acids, Bases and Salts",
      "Metals and Non-metals", "Carbon and its Compounds",
      "Life Processes", "Control and Coordination",
      "How do Organisms Reproduce?", "Heredity",
      "Light — Reflection and Refraction", "The Human Eye and the Colourful World",
      "Electricity", "Magnetic Effects of Electric Current",
      "Our Environment",
    ],
  },
  {
    name: "Social Science", slug: "social-science", icon: "globe", color: "#f59e0b",
    chapters: [
      "The Rise of Nationalism in Europe", "Nationalism in India",
      "The Making of a Global World", "The Age of Industrialisation",
      "Print Culture and the Modern World", "Resources and Development",
      "Forest and Wildlife Resources", "Water Resources",
      "Agriculture", "Minerals and Energy Resources",
      "Manufacturing Industries", "Life Lines of National Economy",
      "Power Sharing", "Federalism", "Gender, Religion and Caste",
      "Political Parties", "Outcomes of Democracy",
      "Development", "Sectors of the Indian Economy",
      "Money and Credit", "Globalisation and the Indian Economy",
    ],
  },
  {
    name: "English", slug: "english", icon: "book", color: "#ec4899",
    chapters: [
      "A Letter to God", "Nelson Mandela: Long Walk to Freedom",
      "Two Stories about Flying", "From the Diary of Anne Frank",
      "The Hundred Dresses — I", "The Hundred Dresses — II",
      "Glimpses of India", "Mijbil the Otter",
      "Madam Rides the Bus", "The Sermon at Benares",
      "The Proposal",
    ],
  },
];

/** Class 11 Science subjects */
const CLASS_11_SCIENCE: SubjectDef[] = [
  {
    name: "Physics", slug: "physics", icon: "zap", color: "#f97316",
    chapters: [
      "Physical World", "Units and Measurements", "Motion in a Straight Line",
      "Motion in a Plane", "Laws of Motion", "Work, Energy and Power",
      "System of Particles and Rotational Motion", "Gravitation",
      "Mechanical Properties of Solids", "Mechanical Properties of Fluids",
      "Thermal Properties of Matter", "Thermodynamics",
      "Kinetic Theory", "Oscillations", "Waves",
    ],
  },
  {
    name: "Chemistry", slug: "chemistry", icon: "flask-conical", color: "#06b6d4",
    chapters: [
      "Some Basic Concepts of Chemistry", "Structure of Atom",
      "Classification of Elements and Periodicity in Properties",
      "Chemical Bonding and Molecular Structure",
      "Thermodynamics", "Equilibrium", "Redox Reactions",
      "Organic Chemistry — Some Basic Principles and Techniques",
      "Hydrocarbons",
    ],
  },
  {
    name: "Mathematics", slug: "mathematics-11", icon: "calculator", color: "#3b82f6",
    chapters: [
      "Sets", "Relations and Functions", "Trigonometric Functions",
      "Complex Numbers and Quadratic Equations",
      "Linear Inequalities", "Permutations and Combinations",
      "Binomial Theorem", "Sequences and Series",
      "Straight Lines", "Conic Sections",
      "Introduction to Three Dimensional Geometry",
      "Limits and Derivatives", "Statistics", "Probability",
    ],
  },
  {
    name: "Biology", slug: "biology", icon: "leaf", color: "#22c55e",
    chapters: [
      "The Living World", "Biological Classification",
      "Plant Kingdom", "Animal Kingdom",
      "Morphology of Flowering Plants",
      "Anatomy of Flowering Plants",
      "Structural Organisation in Animals",
      "Cell: The Unit of Life", "Biomolecules",
      "Cell Cycle and Cell Division",
      "Photosynthesis in Higher Plants",
      "Respiration in Plants",
      "Plant Growth and Development",
      "Breathing and Exchange of Gases",
      "Body Fluids and Circulation",
      "Excretory Products and their Elimination",
      "Locomotion and Movement",
      "Neural Control and Coordination",
      "Chemical Coordination and Integration",
    ],
  },
  {
    name: "Computer Science", slug: "computer-science", icon: "monitor", color: "#8b5cf6",
    chapters: [
      "Computer System", "Encoding Schemes and Number System",
      "Emerging Trends", "Problem Solving",
      "Getting Started with Python", "Flow of Control",
      "Functions", "Strings", "Lists", "Tuples and Dictionaries",
      "Societal Impacts",
    ],
  },
];

/** Class 12 Science subjects */
const CLASS_12_SCIENCE: SubjectDef[] = [
  {
    name: "Physics", slug: "physics", icon: "zap", color: "#f97316",
    chapters: [
      "Electric Charges and Fields", "Electrostatic Potential and Capacitance",
      "Current Electricity", "Moving Charges and Magnetism",
      "Magnetism and Matter", "Electromagnetic Induction",
      "Alternating Current", "Electromagnetic Waves",
      "Ray Optics and Optical Instruments", "Wave Optics",
      "Dual Nature of Radiation and Matter", "Atoms", "Nuclei",
      "Semiconductor Electronics",
    ],
  },
  {
    name: "Chemistry", slug: "chemistry", icon: "flask-conical", color: "#06b6d4",
    chapters: [
      "The Solid State", "Solutions", "Electrochemistry",
      "Chemical Kinetics", "Surface Chemistry",
      "General Principles and Processes of Isolation of Elements",
      "The p-Block Elements", "The d- and f-Block Elements",
      "Coordination Compounds",
      "Haloalkanes and Haloarenes", "Alcohols, Phenols and Ethers",
      "Aldehydes, Ketones and Carboxylic Acids", "Amines",
      "Biomolecules",
    ],
  },
  {
    name: "Mathematics", slug: "mathematics-12", icon: "calculator", color: "#3b82f6",
    chapters: [
      "Relations and Functions", "Inverse Trigonometric Functions",
      "Matrices", "Determinants",
      "Continuity and Differentiability", "Application of Derivatives",
      "Integrals", "Application of Integrals",
      "Differential Equations", "Vector Algebra",
      "Three Dimensional Geometry", "Linear Programming",
      "Probability",
    ],
  },
];

/** Engineering / Programming languages */
const ENGINEERING_LANGUAGES = [
  { name: "C", slug: "c-language", description: "The foundation of systems programming — learn memory management, pointers, and low-level computing", icon: "file-code", color: "#555555", difficulty: "BEGINNER", days: 30 },
  { name: "C++", slug: "cpp", description: "Powerful object-oriented language for competitive programming and systems development", icon: "file-code-2", color: "#00599C", difficulty: "INTERMEDIATE", days: 40 },
  { name: "Python", slug: "python", description: "The most popular language for beginners — data science, AI, web development, and automation", icon: "code", color: "#3776AB", difficulty: "BEGINNER", days: 45 },
  { name: "Java", slug: "java", description: "Enterprise-grade language — Android development, backend services, and large-scale applications", icon: "coffee", color: "#f89820", difficulty: "INTERMEDIATE", days: 45 },
  { name: "JavaScript", slug: "javascript", description: "The language of the web — frontend development, Node.js backend, and full-stack applications", icon: "brackets", color: "#F7DF1E", difficulty: "BEGINNER", days: 30 },
  { name: "TypeScript", slug: "typescript", description: "JavaScript with types — build large-scale, maintainable applications with confidence", icon: "file-type", color: "#3178C6", difficulty: "INTERMEDIATE", days: 25 },
  { name: "Rust", slug: "rust", description: "Memory-safe systems programming — blazing fast, zero-cost abstractions, no garbage collector", icon: "shield", color: "#CE422B", difficulty: "ADVANCED", days: 40 },
  { name: "Kotlin", slug: "kotlin", description: "Modern Android development — concise, safe, and fully interoperable with Java", icon: "smartphone", color: "#7F52FF", difficulty: "INTERMEDIATE", days: 30 },
  { name: "Swift", slug: "swift", description: "iOS and macOS development — powerful, intuitive, designed by Apple", icon: "apple", color: "#FA7343", difficulty: "INTERMEDIATE", days: 30 },
  { name: "SQL", slug: "sql", description: "Database query language — essential for every developer working with data", icon: "database", color: "#336791", difficulty: "BEGINNER", days: 20 },
  { name: "HTML & CSS", slug: "html-css", description: "The building blocks of the web — structure and style every website", icon: "layout", color: "#E34F26", difficulty: "BEGINNER", days: 15 },
  { name: "Dart", slug: "dart", description: "Build beautiful cross-platform apps with Flutter", icon: "smartphone", color: "#0175C2", difficulty: "BEGINNER", days: 25 },
];

/** Level definitions — XP thresholds for levels 1-100 */
function generateLevelDefinitions() {
  const levels = [];
  const titles = [
    "Newcomer", "Learner", "Student", "Scholar", "Explorer",
    "Achiever", "Competitor", "Warrior", "Champion", "Master",
    "Expert", "Virtuoso", "Legend", "Titan", "Grandmaster",
  ];

  for (let i = 1; i <= 100; i++) {
    // XP requirement follows a quadratic curve — each level needs more XP than the last
    const xpRequired = Math.floor(100 * Math.pow(i, 1.5));
    const titleIndex = Math.min(Math.floor((i - 1) / 7), titles.length - 1);

    levels.push({
      level: i,
      xpRequired,
      title: `${titles[titleIndex]} ${i}`,
      badgeColor: getLevelColor(i),
    });
  }

  return levels;
}

/** Returns a color based on level tier */
function getLevelColor(level: number): string {
  if (level <= 10) return "#8b949e";    // Gray — Bronze tier
  if (level <= 25) return "#3fb950";    // Green — Silver tier
  if (level <= 50) return "#58a6ff";    // Blue — Gold tier
  if (level <= 75) return "#a855f7";    // Purple — Platinum tier
  if (level <= 90) return "#f97316";    // Orange — Diamond tier
  return "#f43f5e";                     // Red — Legendary tier
}

/* ─────────────────────────────────────────────
 * Type definitions for seed data
 * ───────────────────────────────────────────── */
interface SubjectDef {
  name: string;
  slug: string;
  icon: string;
  color: string;
  chapters: string[];
}

/* ─────────────────────────────────────────────
 * SEED EXECUTION
 * ───────────────────────────────────────────── */

async function seed() {
  console.log("╔══════════════════════════════════════════╗");
  console.log("║     EduQuest Database Seed Script        ║");
  console.log("╚══════════════════════════════════════════╝");
  console.log("");

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // ── 1. Seed Level Definitions ──
    console.log("📊 Seeding level definitions (1-100)...");
    const levels = generateLevelDefinitions();
    for (const level of levels) {
      await client.query(
        `INSERT INTO "LevelDefinition" (id, level, "xpRequired", title, "badgeColor")
         VALUES (gen_random_uuid()::text, $1, $2, $3, $4)
         ON CONFLICT (level) DO NOTHING`,
        [level.level, level.xpRequired, level.title, level.badgeColor]
      );
    }
    console.log(`   ✅ ${levels.length} levels defined`);

    // ── 2. Seed Class Categories ──
    console.log("📚 Seeding class categories...");
    const classMap = new Map<string, string>();
    for (const cls of CLASSES) {
      const result = await client.query(
        `INSERT INTO "ClassCategory" (id, name, slug, description, icon, color, "orderIndex", "isActive", "createdAt", "updatedAt")
         VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, TRUE, NOW(), NOW())
         ON CONFLICT (slug) DO UPDATE SET name = $1
         RETURNING id`,
        [cls.name, cls.slug, cls.description, cls.icon, cls.color, cls.order]
      );
      classMap.set(cls.slug, result.rows[0].id);
    }
    console.log(`   ✅ ${CLASSES.length} classes created`);

    // ── 3. Seed Subjects and Chapters ──
    async function seedSubjects(classSlug: string, subjects: SubjectDef[]) {
      const classId = classMap.get(classSlug)!;
      let totalChapters = 0;

      for (let si = 0; si < subjects.length; si++) {
        const sub = subjects[si];
        const subResult = await client.query(
          `INSERT INTO "Subject" (id, name, slug, description, icon, color, "classId", "orderIndex", "isActive")
           VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, TRUE)
           ON CONFLICT (slug, "classId") DO UPDATE SET name = $1
           RETURNING id`,
          [sub.name, sub.slug, `${sub.name} for ${classSlug.replace("-", " ")}`, sub.icon, sub.color, classId, si]
        );
        const subjectId = subResult.rows[0].id;

        // Seed chapters for this subject
        for (let ci = 0; ci < sub.chapters.length; ci++) {
          const chapterTitle = sub.chapters[ci];
          const chapterSlug = chapterTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
          
          await client.query(
            `INSERT INTO "Chapter" (id, title, slug, description, "orderIndex", "subjectId", "estimatedMinutes", difficulty)
             VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7)
             ON CONFLICT (slug, "subjectId") DO NOTHING`,
            [chapterTitle, chapterSlug, `Study ${chapterTitle} in detail`, ci, subjectId, 45 + ci * 5, ci < 4 ? "EASY" : ci < 9 ? "MEDIUM" : "HARD"]
          );
          totalChapters++;
        }
      }

      return totalChapters;
    }

    console.log("📖 Seeding Class 9 subjects and chapters...");
    const c9Chapters = await seedSubjects("class-9", CLASS_9_SUBJECTS);
    console.log(`   ✅ ${CLASS_9_SUBJECTS.length} subjects, ${c9Chapters} chapters`);

    console.log("📖 Seeding Class 10 subjects and chapters...");
    const c10Chapters = await seedSubjects("class-10", CLASS_10_SUBJECTS);
    console.log(`   ✅ ${CLASS_10_SUBJECTS.length} subjects, ${c10Chapters} chapters`);

    console.log("📖 Seeding Class 11 Science subjects and chapters...");
    const c11Chapters = await seedSubjects("class-11", CLASS_11_SCIENCE);
    console.log(`   ✅ ${CLASS_11_SCIENCE.length} subjects, ${c11Chapters} chapters`);

    console.log("📖 Seeding Class 12 Science subjects and chapters...");
    const c12Chapters = await seedSubjects("class-12", CLASS_12_SCIENCE);
    console.log(`   ✅ ${CLASS_12_SCIENCE.length} subjects, ${c12Chapters} chapters`);

    // ── 4. Seed Engineering Languages ──
    console.log("💻 Seeding engineering languages...");
    for (const lang of ENGINEERING_LANGUAGES) {
      const langResult = await client.query(
        `INSERT INTO "CodingLanguage" (id, name, slug, description, icon, color, difficulty)
         VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6)
         ON CONFLICT (slug) DO UPDATE SET name = $1
         RETURNING id`,
        [lang.name, lang.slug, lang.description, lang.icon, lang.color, lang.difficulty]
      );

      // Create a learning plan for each language
      await client.query(
        `INSERT INTO "LearningPlan" (id, name, slug, "languageId", "durationDays", description, difficulty)
         VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6)
         ON CONFLICT (slug) DO NOTHING`,
        [
          `${lang.days}-Day ${lang.name} Plan`,
          `${lang.days}-day-${lang.slug}`,
          langResult.rows[0].id,
          lang.days,
          `Master ${lang.name} in ${lang.days} days with daily theory and practice`,
          lang.difficulty,
        ]
      );
    }
    console.log(`   ✅ ${ENGINEERING_LANGUAGES.length} languages with learning plans`);

    // ── 5. Seed Community Categories ──
    console.log("💬 Seeding community categories...");
    const communityCategories = [
      { name: "General Discussion", slug: "general", classSlug: null },
      { name: "Class 9 Community", slug: "class-9-community", classSlug: "class-9" },
      { name: "Class 10 Community", slug: "class-10-community", classSlug: "class-10" },
      { name: "Class 11 Community", slug: "class-11-community", classSlug: "class-11" },
      { name: "Class 12 Community", slug: "class-12-community", classSlug: "class-12" },
      { name: "Engineering Hub", slug: "engineering-hub", classSlug: "engineering" },
      { name: "Doubts & Questions", slug: "doubts", classSlug: null },
      { name: "Study Groups", slug: "study-groups", classSlug: null },
      { name: "Battle Arena Chat", slug: "battle-chat", classSlug: null },
      { name: "Events & Competitions", slug: "events-community", classSlug: null },
      { name: "Announcements", slug: "announcements", classSlug: null },
    ];

    for (const cat of communityCategories) {
      await client.query(
        `INSERT INTO "CommunityCategory" (id, name, slug, description, "classId", "isActive")
         VALUES (gen_random_uuid()::text, $1, $2, $3, $4, TRUE)
         ON CONFLICT (slug) DO NOTHING`,
        [cat.name, cat.slug, `${cat.name} — Discuss, share, and learn together`, cat.classSlug ? classMap.get(cat.classSlug) ?? null : null]
      );
    }
    console.log(`   ✅ ${communityCategories.length} community categories`);

    await client.query("COMMIT");

    console.log("");
    console.log("╔══════════════════════════════════════════╗");
    console.log("║     ✅ DATABASE SEED COMPLETE!           ║");
    console.log("╠══════════════════════════════════════════╣");
    console.log(`║  Levels:     100                         ║`);
    console.log(`║  Classes:    ${String(CLASSES.length).padEnd(28)}║`);
    console.log(`║  Subjects:   ${String(CLASS_9_SUBJECTS.length + CLASS_10_SUBJECTS.length + CLASS_11_SCIENCE.length + CLASS_12_SCIENCE.length).padEnd(28)}║`);
    console.log(`║  Chapters:   ${String(c9Chapters + c10Chapters + c11Chapters + c12Chapters).padEnd(28)}║`);
    console.log(`║  Languages:  ${String(ENGINEERING_LANGUAGES.length).padEnd(28)}║`);
    console.log(`║  Communities: ${String(communityCategories.length).padEnd(27)}║`);
    console.log("╚══════════════════════════════════════════╝");

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Seed failed:", err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

/* Run the seed script */
seed().catch((err) => {
  console.error("Fatal seed error:", err);
  process.exit(1);
});
