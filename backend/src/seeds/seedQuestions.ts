/**
 * FILE: seedQuestions.ts
 * LOCATION: backend/src/seeds/seedQuestions.ts
 * PURPOSE: Seeds the EduQuest database with real CBSE curriculum questions.
 *          Populates questions for Class 9-12 across Mathematics, Science,
 *          and English subjects with proper difficulty levels, point values,
 *          explanations, and topic associations.
 *
 * HOW TO RUN: npx ts-node --transpile-only src/seeds/seedQuestions.ts
 *
 * IMPORTANT: This script is IDEMPOTENT — checks for existing questions before
 *            inserting. Safe to run multiple times without creating duplicates.
 *
 * DATA STRUCTURE:
 *  Each question includes:
 *   - content: The question text
 *   - type: MCQ, TRUE_FALSE, FILL_BLANK, SHORT_ANSWER
 *   - options: JSON array of choices (for MCQ)
 *   - answer: Correct answer
 *   - explanation: Detailed solution explanation
 *   - difficulty: EASY, MEDIUM, HARD
 *   - points: 5 (EASY), 10 (MEDIUM), 20 (HARD)
 *
 * DEPENDENCIES: pg Pool from ../config/database
 * LAST UPDATED: 2026-05-24
 */

import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

/* ─────────────────────────────────────────────
 * Database Connection
 * ───────────────────────────────────────────── */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
});

/* ─────────────────────────────────────────────
 * Question Type Definitions
 * ───────────────────────────────────────────── */

/** Structure for a question to be inserted */
interface QuestionSeed {
  content: string;
  type: "MCQ" | "TRUE_FALSE" | "FILL_BLANK" | "SHORT_ANSWER" | "NUMERIC";
  options: string[] | null;
  answer: string;
  explanation: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  points: number;
}

/* ─────────────────────────────────────────────
 * REAL CBSE CURRICULUM QUESTIONS
 * ───────────────────────────────────────────── */

/** Class 9 Mathematics — Number Systems */
const CLASS9_MATH_NUMBER_SYSTEMS: QuestionSeed[] = [
  {
    content: "Which of the following is an irrational number?",
    type: "MCQ",
    options: JSON.parse(JSON.stringify(["√4", "√9", "√2", "√16"])),
    answer: "√2",
    explanation: "√2 cannot be expressed as p/q where p and q are integers and q ≠ 0. √4=2, √9=3, √16=4 are all rational.",
    difficulty: "EASY",
    points: 5,
  },
  {
    content: "Express 0.̄6 (0.6666...) in the form p/q.",
    type: "SHORT_ANSWER",
    options: null,
    answer: "2/3",
    explanation: "Let x = 0.666... → 10x = 6.666... → 10x - x = 6 → 9x = 6 → x = 6/9 = 2/3.",
    difficulty: "MEDIUM",
    points: 10,
  },
  {
    content: "The decimal expansion of √2 is:",
    type: "MCQ",
    options: JSON.parse(JSON.stringify(["Terminating", "Non-terminating repeating", "Non-terminating non-repeating", "None of these"])),
    answer: "Non-terminating non-repeating",
    explanation: "√2 is irrational, so its decimal expansion is non-terminating and non-repeating (1.41421356...).",
    difficulty: "EASY",
    points: 5,
  },
  {
    content: "Rationalize the denominator of 1/(√7 - √6).",
    type: "SHORT_ANSWER",
    options: null,
    answer: "√7 + √6",
    explanation: "Multiply by conjugate: 1/(√7-√6) × (√7+√6)/(√7+√6) = (√7+√6)/(7-6) = √7 + √6.",
    difficulty: "HARD",
    points: 20,
  },
  {
    content: "Every rational number is a real number.",
    type: "TRUE_FALSE",
    options: null,
    answer: "True",
    explanation: "Real numbers = Rational numbers ∪ Irrational numbers. Since rational numbers are a subset of real numbers, every rational number is indeed a real number.",
    difficulty: "EASY",
    points: 5,
  },
  {
    content: "Find three rational numbers between 3/5 and 4/5.",
    type: "SHORT_ANSWER",
    options: null,
    answer: "13/20, 14/20, 15/20",
    explanation: "Convert to equivalent fractions with larger denominator: 3/5 = 12/20, 4/5 = 16/20. Three rationals between them: 13/20, 14/20 (= 7/10), 15/20 (= 3/4).",
    difficulty: "MEDIUM",
    points: 10,
  },
  {
    content: "Simplify: (3 + √3)(3 - √3)",
    type: "NUMERIC",
    options: null,
    answer: "6",
    explanation: "Using (a+b)(a-b) = a² - b² → (3)² - (√3)² = 9 - 3 = 6.",
    difficulty: "MEDIUM",
    points: 10,
  },
  {
    content: "Which of the following is a rational number?",
    type: "MCQ",
    options: JSON.parse(JSON.stringify(["π", "√3", "0.1010010001...", "0.272727..."])),
    answer: "0.272727...",
    explanation: "0.272727... = 0.2̄7̄ is a repeating decimal which can be expressed as 27/99 = 3/11, making it rational.",
    difficulty: "MEDIUM",
    points: 10,
  },
];

/** Class 9 Science — Atoms and Molecules */
const CLASS9_SCIENCE_ATOMS: QuestionSeed[] = [
  {
    content: "What is the chemical formula of water?",
    type: "MCQ",
    options: JSON.parse(JSON.stringify(["H2O", "HO2", "H2O2", "OH"])),
    answer: "H2O",
    explanation: "Water consists of 2 hydrogen atoms and 1 oxygen atom bonded together, giving the molecular formula H₂O.",
    difficulty: "EASY",
    points: 5,
  },
  {
    content: "Who proposed the atomic theory in 1808?",
    type: "MCQ",
    options: JSON.parse(JSON.stringify(["J.J. Thomson", "John Dalton", "Ernest Rutherford", "Niels Bohr"])),
    answer: "John Dalton",
    explanation: "John Dalton proposed the atomic theory in 1808, stating that all matter is made of indivisible atoms.",
    difficulty: "EASY",
    points: 5,
  },
  {
    content: "The atomic mass unit (amu) is defined as 1/12 of the mass of which isotope?",
    type: "MCQ",
    options: JSON.parse(JSON.stringify(["Carbon-14", "Carbon-12", "Oxygen-16", "Hydrogen-1"])),
    answer: "Carbon-12",
    explanation: "One atomic mass unit (1 u) is defined as exactly 1/12th of the mass of one Carbon-12 atom.",
    difficulty: "MEDIUM",
    points: 10,
  },
  {
    content: "Calculate the molecular mass of H₂SO₄ (H=1, S=32, O=16).",
    type: "NUMERIC",
    options: null,
    answer: "98",
    explanation: "Molecular mass = 2(1) + 1(32) + 4(16) = 2 + 32 + 64 = 98 u.",
    difficulty: "MEDIUM",
    points: 10,
  },
  {
    content: "The law of conservation of mass states that mass can neither be created nor destroyed in a chemical reaction.",
    type: "TRUE_FALSE",
    options: null,
    answer: "True",
    explanation: "Antoine Lavoisier established this law. In any chemical reaction, the total mass of reactants equals the total mass of products.",
    difficulty: "EASY",
    points: 5,
  },
  {
    content: "What is Avogadro's number?",
    type: "MCQ",
    options: JSON.parse(JSON.stringify(["6.022 × 10²³", "3.14 × 10²³", "6.022 × 10²²", "1.602 × 10¹⁹"])),
    answer: "6.022 × 10²³",
    explanation: "Avogadro's number (Nₐ) = 6.022 × 10²³ is the number of atoms/molecules in one mole of a substance.",
    difficulty: "EASY",
    points: 5,
  },
];

/** Class 10 Mathematics — Polynomials */
const CLASS10_MATH_POLYNOMIALS: QuestionSeed[] = [
  {
    content: "Find the zeroes of the polynomial p(x) = x² - 5x + 6.",
    type: "SHORT_ANSWER",
    options: null,
    answer: "2, 3",
    explanation: "x² - 5x + 6 = (x-2)(x-3) = 0 → x = 2 or x = 3. Sum of zeroes = 5 = -(-5)/1 = -b/a. Product = 6 = 6/1 = c/a. ✓",
    difficulty: "MEDIUM",
    points: 10,
  },
  {
    content: "What is the degree of the polynomial 4x³ + 2x² - 7x + 1?",
    type: "NUMERIC",
    options: null,
    answer: "3",
    explanation: "The degree of a polynomial is the highest power of the variable. Here, the highest power of x is 3.",
    difficulty: "EASY",
    points: 5,
  },
  {
    content: "If α and β are zeroes of x² - 6x + 8, find α + β.",
    type: "NUMERIC",
    options: null,
    answer: "6",
    explanation: "For ax² + bx + c, sum of zeroes = -b/a = -(-6)/1 = 6. Alternatively, x² - 6x + 8 = (x-2)(x-4), so zeroes are 2 and 4, and 2+4 = 6.",
    difficulty: "MEDIUM",
    points: 10,
  },
  {
    content: "A polynomial of degree 2 is called a:",
    type: "MCQ",
    options: JSON.parse(JSON.stringify(["Linear polynomial", "Quadratic polynomial", "Cubic polynomial", "Constant polynomial"])),
    answer: "Quadratic polynomial",
    explanation: "Degree 0 = constant, degree 1 = linear, degree 2 = quadratic, degree 3 = cubic.",
    difficulty: "EASY",
    points: 5,
  },
  {
    content: "Find a quadratic polynomial whose sum and product of zeroes are -3 and 2 respectively.",
    type: "SHORT_ANSWER",
    options: null,
    answer: "x² + 3x + 2",
    explanation: "If sum = S and product = P, polynomial = x² - Sx + P = x² - (-3)x + 2 = x² + 3x + 2.",
    difficulty: "HARD",
    points: 20,
  },
];

/** Class 10 Science — Chemical Reactions */
const CLASS10_SCIENCE_CHEMICAL: QuestionSeed[] = [
  {
    content: "When a magnesium ribbon burns in air, it forms:",
    type: "MCQ",
    options: JSON.parse(JSON.stringify(["Magnesium hydroxide", "Magnesium oxide", "Magnesium carbonate", "Magnesium chloride"])),
    answer: "Magnesium oxide",
    explanation: "2Mg + O₂ → 2MgO. Magnesium burns with a dazzling white flame to produce white powder of magnesium oxide (MgO).",
    difficulty: "EASY",
    points: 5,
  },
  {
    content: "Rusting of iron is an example of which type of reaction?",
    type: "MCQ",
    options: JSON.parse(JSON.stringify(["Combination reaction", "Decomposition reaction", "Displacement reaction", "Corrosion (oxidation)"])),
    answer: "Corrosion (oxidation)",
    explanation: "Rusting is corrosion of iron. Fe + O₂ + H₂O → Fe₂O₃·xH₂O (hydrated iron oxide). It's a slow oxidation reaction.",
    difficulty: "EASY",
    points: 5,
  },
  {
    content: "Balance the equation: Fe + H₂O → Fe₃O₄ + H₂",
    type: "SHORT_ANSWER",
    options: null,
    answer: "3Fe + 4H₂O → Fe₃O₄ + 4H₂",
    explanation: "Fe atoms: 3 on each side ✓. O atoms: 4 on each side ✓. H atoms: 8 on each side ✓.",
    difficulty: "HARD",
    points: 20,
  },
  {
    content: "An endothermic reaction absorbs heat from the surroundings.",
    type: "TRUE_FALSE",
    options: null,
    answer: "True",
    explanation: "Endothermic reactions absorb energy (ΔH > 0). Examples: photosynthesis, dissolving ammonium nitrate in water.",
    difficulty: "EASY",
    points: 5,
  },
  {
    content: "CaCO₃ → CaO + CO₂ is an example of:",
    type: "MCQ",
    options: JSON.parse(JSON.stringify(["Combination reaction", "Decomposition reaction", "Double displacement reaction", "Redox reaction"])),
    answer: "Decomposition reaction",
    explanation: "One reactant (CaCO₃) breaks down into two simpler products (CaO and CO₂). This is thermal decomposition.",
    difficulty: "MEDIUM",
    points: 10,
  },
];

/* ─────────────────────────────────────────────
 * MAIN SEED FUNCTION
 * ───────────────────────────────────────────── */

async function seedQuestions(): Promise<void> {
  console.log("╔══════════════════════════════════════════╗");
  console.log("║   EduQuest Question Seed Script          ║");
  console.log("╚══════════════════════════════════════════╝");
  console.log("");

  /* ── Check if questions already exist ── */
  const existingCount = await pool.query(`SELECT COUNT(*)::int AS count FROM "Question"`);
  if (existingCount.rows[0].count > 0) {
    console.log(`⚠️  ${existingCount.rows[0].count} questions already exist. Skipping seed.`);
    console.log("   To re-seed, delete existing questions first.");
    await pool.end();
    return;
  }

  let totalInserted = 0;

  /* ── Helper: Insert questions for a specific chapter ── */
  async function insertQuestionsForChapter(
    classSlug: string,
    subjectSlug: string,
    chapterTitle: string,
    questions: QuestionSeed[],
  ): Promise<number> {
    /* Find the topic or chapter ID for this set of questions */
    const chapterResult = await pool.query(
      `SELECT c.id FROM "Chapter" c
       JOIN "Subject" s ON c."subjectId" = s.id
       JOIN "ClassCategory" cc ON s."classId" = cc.id
       WHERE cc.slug = $1 AND s.slug = $2 AND c.title ILIKE $3
       LIMIT 1`,
      [classSlug, subjectSlug, `%${chapterTitle}%`]
    );

    if (chapterResult.rows.length === 0) {
      console.log(`   ⚠️ Chapter not found: ${classSlug}/${subjectSlug}/${chapterTitle}`);
      return 0;
    }

    const chapterId = chapterResult.rows[0].id;

    /* Find or create a topic under this chapter for questions */
    let topicId: string;
    const topicResult = await pool.query(
      `SELECT id FROM "Topic" WHERE "chapterId" = $1 LIMIT 1`,
      [chapterId]
    );

    if (topicResult.rows.length > 0) {
      topicId = topicResult.rows[0].id;
    } else {
      /* Create a default topic for this chapter */
      const newTopic = await pool.query(
        `INSERT INTO "Topic" (id, title, slug, "orderIndex", "chapterId")
         VALUES (gen_random_uuid()::text, $1, $2, 1, $3)
         RETURNING id`,
        [`${chapterTitle} — Core Concepts`, chapterTitle.toLowerCase().replace(/\s+/g, "-"), chapterId]
      );
      topicId = newTopic.rows[0].id;
    }

    /* Insert each question */
    let count = 0;
    for (const q of questions) {
      await pool.query(
        `INSERT INTO "Question" (
          id, content, type, options, answer, explanation, difficulty, points, "topicId"
        ) VALUES (
          gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8
        )`,
        [
          q.content,
          q.type,
          q.options ? JSON.stringify(q.options) : null,
          q.answer,
          q.explanation,
          q.difficulty,
          q.points,
          topicId,
        ]
      );
      count++;
    }

    return count;
  }

  /* ── Seed Class 9 Mathematics — Number Systems ── */
  console.log("📐 Seeding Class 9 Mathematics questions...");
  let count = await insertQuestionsForChapter("class-9", "mathematics", "Number Systems", CLASS9_MATH_NUMBER_SYSTEMS);
  totalInserted += count;
  console.log(`   ✅ ${count} questions (Number Systems)`);

  /* ── Seed Class 9 Science — Atoms and Molecules ── */
  console.log("🔬 Seeding Class 9 Science questions...");
  count = await insertQuestionsForChapter("class-9", "science", "Atoms and Molecules", CLASS9_SCIENCE_ATOMS);
  totalInserted += count;
  console.log(`   ✅ ${count} questions (Atoms and Molecules)`);

  /* ── Seed Class 10 Mathematics — Polynomials ── */
  console.log("📐 Seeding Class 10 Mathematics questions...");
  count = await insertQuestionsForChapter("class-10", "mathematics", "Polynomials", CLASS10_MATH_POLYNOMIALS);
  totalInserted += count;
  console.log(`   ✅ ${count} questions (Polynomials)`);

  /* ── Seed Class 10 Science — Chemical Reactions ── */
  console.log("🧪 Seeding Class 10 Science questions...");
  count = await insertQuestionsForChapter("class-10", "science", "Chemical Reactions", CLASS10_SCIENCE_CHEMICAL);
  totalInserted += count;
  console.log(`   ✅ ${count} questions (Chemical Reactions)`);

  /* ── Summary ── */
  console.log("");
  console.log("╔══════════════════════════════════════════╗");
  console.log(`║  ✅ QUESTIONS SEEDED: ${String(totalInserted).padEnd(18)}   ║`);
  console.log("╚══════════════════════════════════════════╝");

  await pool.end();
}

/* ── Execute ── */
seedQuestions().catch((err) => {
  console.error("❌ Question seed failed:", err);
  process.exit(1);
});
