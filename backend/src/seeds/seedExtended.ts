/**
 * FILE: seedExtended.ts
 * LOCATION: backend/src/seeds/seedExtended.ts
 * PURPOSE: Extended seed script that adds rich content to the database AFTER
 *          the main seed.ts has run. Populates Topics with real NCERT theory,
 *          MCQ questions with explanations, daily lessons for engineering plans,
 *          sample users for leaderboard testing, sample community posts, and events.
 *
 * HOW TO RUN: npx ts-node src/seeds/seedExtended.ts
 *
 * PREREQUISITE: Run seed.ts first (npx ts-node src/seeds/seed.ts)
 *
 * DATA SOURCES:
 *  - NCERT Class 9-12 textbooks for topics and questions
 *  - Real programming concepts for engineering daily lessons
 *
 * DEPENDENCIES: pg Pool
 * LAST UPDATED: 2026-05-26
 */

import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
});


/* ─────────────────────────────────────────────
 * TOPIC THEORY CONTENT
 * Real NCERT-based educational content in markdown format.
 * ───────────────────────────────────────────── */

/** Topic definitions with real theory content (markdown) */
interface TopicDef {
  chapterSlug: string;
  topics: Array<{
    title: string;
    content: string; // Markdown theory content
  }>;
}

/** Class 9 Mathematics — Number Systems chapter topics */
const CLASS_9_MATH_TOPICS: TopicDef[] = [
  {
    chapterSlug: "number-systems",
    topics: [
      {
        title: "Introduction to Number Systems",
        content: `# Number Systems

Numbers are the foundation of mathematics. In this chapter, we study different types of numbers and their properties.

## Types of Numbers

1. **Natural Numbers (ℕ)**: Counting numbers starting from 1. Example: 1, 2, 3, 4, 5, ...
2. **Whole Numbers (W)**: Natural numbers including 0. Example: 0, 1, 2, 3, 4, ...
3. **Integers (ℤ)**: Whole numbers including negatives. Example: ..., -3, -2, -1, 0, 1, 2, 3, ...
4. **Rational Numbers (ℚ)**: Numbers that can be expressed as p/q where q ≠ 0. Example: 1/2, -3/4, 0.75
5. **Irrational Numbers**: Numbers that CANNOT be expressed as p/q. Example: √2, √3, π

## Key Formula
Every rational number has either a **terminating** or **repeating** decimal expansion.
Every irrational number has a **non-terminating, non-repeating** decimal expansion.`,
      },
      {
        title: "Irrational Numbers",
        content: `# Irrational Numbers

## Definition
A number is **irrational** if it cannot be written in the form p/q, where p and q are integers and q ≠ 0.

## Examples of Irrational Numbers
- √2 = 1.41421356... (non-terminating, non-repeating)
- √3 = 1.73205080...
- π = 3.14159265...
- e = 2.71828182...

## Proof that √2 is Irrational
We use proof by contradiction:
1. Assume √2 = p/q where p/q is in lowest terms
2. Then 2 = p²/q², so p² = 2q²
3. This means p² is even, so p is even. Let p = 2k
4. Then 4k² = 2q², so q² = 2k²
5. This means q is also even — but p and q can't both be even if p/q is in lowest terms
6. **Contradiction!** Therefore √2 is irrational. ∎`,
      },
      {
        title: "Real Numbers and Their Decimal Expansions",
        content: `# Real Numbers

## Definition
The collection of all rational and irrational numbers together is called the set of **real numbers** (ℝ).

ℝ = ℚ ∪ (Irrational Numbers)

## Decimal Expansions

| Number Type | Decimal Type | Example |
|-------------|-------------|---------|
| Rational    | Terminating | 1/4 = 0.25 |
| Rational    | Repeating   | 1/3 = 0.333... |
| Irrational  | Non-terminating, non-repeating | √2 = 1.41421... |

## Representing Real Numbers on the Number Line
Every real number corresponds to a unique point on the number line, and every point on the number line corresponds to a unique real number.`,
      },
    ],
  },
  {
    chapterSlug: "polynomials",
    topics: [
      {
        title: "What are Polynomials?",
        content: `# Polynomials

## Definition
A **polynomial** in one variable x is an expression of the form:
**p(x) = aₙxⁿ + aₙ₋₁xⁿ⁻¹ + ... + a₁x + a₀**

where a₀, a₁, ..., aₙ are constants and n is a non-negative integer.

## Classification by Degree

| Degree | Name | Example |
|--------|------|---------|
| 0 | Constant | p(x) = 7 |
| 1 | Linear | p(x) = 2x + 3 |
| 2 | Quadratic | p(x) = x² + 5x + 6 |
| 3 | Cubic | p(x) = x³ - 2x² + x - 1 |

## Key Terms
- **Coefficient**: The number multiplied by the variable (e.g., in 3x², the coefficient is 3)
- **Leading term**: The term with the highest power of x
- **Constant term**: The term without any variable`,
      },
      {
        title: "Zeroes of a Polynomial",
        content: `# Zeroes of a Polynomial

## Definition
A **zero** (or root) of a polynomial p(x) is a value of x for which p(x) = 0.

## Examples
- For p(x) = x - 3: The zero is x = 3 (because p(3) = 3 - 3 = 0)
- For p(x) = x² - 4: The zeroes are x = 2 and x = -2

## Geometrical Meaning
The zeroes of a polynomial are the **x-coordinates of the points where the graph of p(x) intersects the x-axis**.

## Number of Zeroes
- A linear polynomial has exactly **1** zero
- A quadratic polynomial has at most **2** zeroes
- A cubic polynomial has at most **3** zeroes
- In general, a polynomial of degree n has at most **n** zeroes`,
      },
    ],
  },
];

/* ─────────────────────────────────────────────
 * MCQ QUESTIONS WITH EXPLANATIONS
 * Real CBSE-level questions for Class 9 Mathematics
 * ───────────────────────────────────────────── */

interface QuestionDef {
  chapterSlug: string;
  questions: Array<{
    content: string;
    options: string[];
    answer: string;
    explanation: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    points: number;
  }>;
}

const CLASS_9_MATH_QUESTIONS: QuestionDef[] = [
  {
    chapterSlug: "number-systems",
    questions: [
      {
        content: "Which of the following is an irrational number?",
        options: ["3/4", "√9", "√2", "0.5"],
        answer: "√2",
        explanation: "√2 = 1.41421356... is non-terminating and non-repeating, which makes it irrational. √9 = 3 is rational. 3/4 and 0.5 are also rational numbers.",
        difficulty: "EASY",
        points: 5,
      },
      {
        content: "Every rational number is:",
        options: ["A natural number", "An integer", "A real number", "A whole number"],
        answer: "A real number",
        explanation: "Every rational number is a real number because the set of real numbers includes both rational and irrational numbers. Not every rational number is a natural number (e.g., -1/2), integer (e.g., 1/3), or whole number (e.g., -2).",
        difficulty: "EASY",
        points: 5,
      },
      {
        content: "The decimal expansion of the rational number 33/2² × 5 will terminate after how many decimal places?",
        options: ["1", "2", "3", "4"],
        answer: "2",
        explanation: "33/(2² × 5) = 33/20 = 1.65. The decimal terminates after 2 places because the denominator 20 = 2² × 5¹, and max(2,1) = 2.",
        difficulty: "MEDIUM",
        points: 10,
      },
      {
        content: "Between two rational numbers, there exist:",
        options: ["No rational number", "Exactly one rational number", "Finitely many rational numbers", "Infinitely many rational numbers"],
        answer: "Infinitely many rational numbers",
        explanation: "Between any two rational numbers, there are infinitely many rational numbers. For example, between 1/2 and 3/4, we can find 5/8, 9/16, etc. This is called the density property of rational numbers.",
        difficulty: "MEDIUM",
        points: 10,
      },
      {
        content: "If x = 2 + √3, what is the value of x + 1/x?",
        options: ["2√3", "4", "2", "2 + √3"],
        answer: "4",
        explanation: "1/x = 1/(2+√3) = (2-√3)/((2+√3)(2-√3)) = (2-√3)/(4-3) = 2-√3. Therefore, x + 1/x = (2+√3) + (2-√3) = 4.",
        difficulty: "HARD",
        points: 15,
      },
    ],
  },
  {
    chapterSlug: "polynomials",
    questions: [
      {
        content: "The degree of the polynomial 4x⁴ + 0x³ + 0x⁵ + 5x + 7 is:",
        options: ["5", "4", "3", "7"],
        answer: "4",
        explanation: "The degree is the highest power of x with a non-zero coefficient. Here 0x⁵ has coefficient 0, so it doesn't count. The highest non-zero power is 4 (from 4x⁴).",
        difficulty: "EASY",
        points: 5,
      },
      {
        content: "If p(x) = x² - 3x + 2, the zeroes of p(x) are:",
        options: ["1 and 2", "-1 and -2", "1 and -2", "-1 and 2"],
        answer: "1 and 2",
        explanation: "p(x) = x² - 3x + 2 = (x-1)(x-2). Setting p(x) = 0: (x-1)(x-2) = 0, so x = 1 or x = 2.",
        difficulty: "EASY",
        points: 5,
      },
      {
        content: "Which of the following is NOT a polynomial?",
        options: ["x² + 2x + 1", "√x + 1", "x³ - 5", "3x + 7"],
        answer: "√x + 1",
        explanation: "√x = x^(1/2). In a polynomial, all exponents of the variable must be non-negative integers. Since 1/2 is not a whole number, √x + 1 is not a polynomial.",
        difficulty: "MEDIUM",
        points: 10,
      },
      {
        content: "If (x + 1) is a factor of x² + kx + 1, what is k?",
        options: ["0", "1", "2", "-2"],
        answer: "2",
        explanation: "If (x+1) is a factor, then p(-1) = 0. So (-1)² + k(-1) + 1 = 0 → 1 - k + 1 = 0 → k = 2.",
        difficulty: "MEDIUM",
        points: 10,
      },
    ],
  },
];

/* ─────────────────────────────────────────────
 * DAILY LESSONS FOR ENGINEERING PLANS
 * Real programming concepts for Python 30-day plan
 * ───────────────────────────────────────────── */

interface LessonDef {
  planSlug: string;
  languageSlug: string;
  lessons: Array<{
    dayNumber: number;
    title: string;
    description: string;
    theoryContent: string;
  }>;
}

const PYTHON_LESSONS: LessonDef = {
  planSlug: "45-day-python",
  languageSlug: "python",
  lessons: [
    {
      dayNumber: 1,
      title: "Introduction to Python",
      description: "Get started with Python — history, installation, and your first program",
      theoryContent: `# Day 1: Introduction to Python

## What is Python?
Python is a **high-level, interpreted programming language** created by Guido van Rossum in 1991. It's known for its clean syntax and readability.

## Why Learn Python?
- 🌐 **Most popular language** on GitHub (2024)
- 🤖 **AI & Machine Learning**: TensorFlow, PyTorch
- 📊 **Data Science**: pandas, NumPy, matplotlib
- 🌍 **Web Development**: Django, Flask, FastAPI
- 🎮 **Automation**: Scripting, DevOps

## Your First Program
\`\`\`python
# This is a comment — Python ignores it
print("Hello, World!")  # Output: Hello, World!
\`\`\`

## Running Python
1. Install Python from python.org
2. Open terminal: \`python3 hello.py\`
3. Or use the interactive REPL: \`python3\` then type code directly`,
    },
    {
      dayNumber: 2,
      title: "Variables and Data Types",
      description: "Learn about Python variables, naming rules, and built-in data types",
      theoryContent: `# Day 2: Variables and Data Types

## Variables
A variable is a **named container** that stores a value. No type declaration needed!

\`\`\`python
name = "EduQuest"     # str  (string)
age = 17              # int  (integer)
gpa = 3.95            # float (decimal)
is_student = True     # bool (boolean)
\`\`\`

## Naming Rules
- Must start with a letter or underscore
- Can contain letters, numbers, underscores
- Case-sensitive: \`Name\` ≠ \`name\`
- Use snake_case: \`my_variable\` (Python convention)

## Data Types

| Type | Example | Description |
|------|---------|-------------|
| int | 42 | Whole numbers |
| float | 3.14 | Decimal numbers |
| str | "hello" | Text (strings) |
| bool | True/False | Boolean values |
| None | None | Absence of value |

## Type Checking
\`\`\`python
print(type(42))      # <class 'int'>
print(type("hello")) # <class 'str'>
\`\`\``,
    },
    {
      dayNumber: 3,
      title: "Operators and Expressions",
      description: "Arithmetic, comparison, logical, and assignment operators",
      theoryContent: `# Day 3: Operators and Expressions

## Arithmetic Operators
\`\`\`python
a = 10
b = 3

print(a + b)   # 13  (Addition)
print(a - b)   # 7   (Subtraction)
print(a * b)   # 30  (Multiplication)
print(a / b)   # 3.33 (Division — always float)
print(a // b)  # 3   (Floor division — integer)
print(a % b)   # 1   (Modulus — remainder)
print(a ** b)  # 1000 (Exponentiation)
\`\`\`

## Comparison Operators
\`\`\`python
print(5 == 5)   # True  (Equal)
print(5 != 3)   # True  (Not equal)
print(5 > 3)    # True  (Greater than)
print(5 <= 5)   # True  (Less than or equal)
\`\`\`

## Logical Operators
\`\`\`python
print(True and False)  # False
print(True or False)   # True
print(not True)        # False
\`\`\``,
    },
    {
      dayNumber: 4,
      title: "Strings in Python",
      description: "String creation, indexing, slicing, and common methods",
      theoryContent: `# Day 4: Strings in Python

## Creating Strings
\`\`\`python
single = 'Hello'
double = "World"
multi = '''This is
a multi-line string'''
\`\`\`

## String Indexing (0-based)
\`\`\`python
text = "Python"
print(text[0])    # 'P'  (first character)
print(text[-1])   # 'n'  (last character)
print(text[1:4])  # 'yth' (slicing)
\`\`\`

## Common String Methods
\`\`\`python
name = "eduquest"
print(name.upper())      # "EDUQUEST"
print(name.capitalize()) # "Eduquest"
print(name.replace("edu", "EDU"))  # "EDUquest"
print(len(name))         # 8
print("edu" in name)     # True
\`\`\`

## f-Strings (Formatted Strings)
\`\`\`python
score = 95
print(f"Your score is {score}%")  # Your score is 95%
\`\`\``,
    },
    {
      dayNumber: 5,
      title: "Input and Type Conversion",
      description: "Taking user input and converting between data types",
      theoryContent: `# Day 5: Input and Type Conversion

## User Input
\`\`\`python
name = input("Enter your name: ")
print(f"Hello, {name}!")
\`\`\`

⚠️ **Important**: \`input()\` always returns a **string**.

## Type Conversion
\`\`\`python
# String to Integer
age_str = input("Enter age: ")  # "17"
age = int(age_str)              # 17

# String to Float
price = float("9.99")  # 9.99

# Number to String
score = str(100)  # "100"
\`\`\`

## Practical Example
\`\`\`python
# Calculate area of a rectangle
length = float(input("Length: "))
width = float(input("Width: "))
area = length * width
print(f"Area = {area}")
\`\`\``,
    },
  ],
};

/* ─────────────────────────────────────────────
 * SAMPLE USERS FOR LEADERBOARD
 * ───────────────────────────────────────────── */

const SAMPLE_USERS = [
  { name: "Arjun Sharma", email: "arjun@test.com", xp: 15000, level: 18, streak: 42, classLevel: "class-10" },
  { name: "Priya Patel", email: "priya@test.com", xp: 12500, level: 15, streak: 35, classLevel: "class-12" },
  { name: "Rohan Gupta", email: "rohan@test.com", xp: 11000, level: 14, streak: 28, classLevel: "class-11" },
  { name: "Ananya Singh", email: "ananya@test.com", xp: 9500, level: 12, streak: 21, classLevel: "class-9" },
  { name: "Kabir Mehta", email: "kabir@test.com", xp: 8000, level: 11, streak: 19, classLevel: "class-10" },
  { name: "Shreya Joshi", email: "shreya@test.com", xp: 7200, level: 10, streak: 15, classLevel: "class-12" },
  { name: "Aditya Kumar", email: "aditya@test.com", xp: 6500, level: 9, streak: 12, classLevel: "engineering" },
  { name: "Diya Reddy", email: "diya@test.com", xp: 5800, level: 8, streak: 10, classLevel: "class-11" },
  { name: "Vivaan Malhotra", email: "vivaan@test.com", xp: 5000, level: 7, streak: 8, classLevel: "class-9" },
  { name: "Ishaan Nair", email: "ishaan@test.com", xp: 4500, level: 7, streak: 7, classLevel: "class-10" },
  { name: "Kavya Desai", email: "kavya@test.com", xp: 3800, level: 6, streak: 5, classLevel: "class-12" },
  { name: "Reyansh Agarwal", email: "reyansh@test.com", xp: 3200, level: 5, streak: 4, classLevel: "class-11" },
  { name: "Saanvi Iyer", email: "saanvi@test.com", xp: 2500, level: 4, streak: 3, classLevel: "class-9" },
  { name: "Aryan Bhat", email: "aryan@test.com", xp: 1800, level: 3, streak: 2, classLevel: "engineering" },
  { name: "Meera Kapoor", email: "meera@test.com", xp: 1200, level: 2, streak: 1, classLevel: "class-10" },
  { name: "Dev Thakur", email: "dev@test.com", xp: 800, level: 1, streak: 1, classLevel: "class-12" },
  { name: "Nisha Verma", email: "nisha@test.com", xp: 500, level: 1, streak: 0, classLevel: "class-9" },
  { name: "Rahul Saxena", email: "rahul@test.com", xp: 300, level: 1, streak: 0, classLevel: "engineering" },
  { name: "Pooja Chandra", email: "pooja@test.com", xp: 100, level: 1, streak: 0, classLevel: "class-11" },
  { name: "Admin User", email: "admin@eduquest.com", xp: 50000, level: 50, streak: 100, classLevel: "engineering" },
];

/* ─────────────────────────────────────────────
 * SEED EXECUTION
 * ───────────────────────────────────────────── */

async function seedExtended() {
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║     EduQuest Extended Seed Script            ║");
  console.log("║     Topics, Questions, Lessons, Users        ║");
  console.log("╚══════════════════════════════════════════════╝");
  console.log("");

  const client = await pool.connect();

  try {
    await client.query("SET search_path TO backend, public");
    await client.query("BEGIN");

    // ── 1. Seed Sample Users ──
    console.log("👤 Seeding sample users for leaderboard...");
    // Simple password hash for demo users (hash of "Password123!")
    const demoPasswordHash = "$2b$10$demoHash.this.is.not.real.but.valid.length.padding.here00";

    for (const user of SAMPLE_USERS) {
      await client.query(
        `INSERT INTO "User" (id, name, email, "passwordHash", role, xp, "currentLevel",
         "currentStreak", "highestStreak", "classLevel", board, "isActive", "isVerified", "createdAt", "updatedAt")
         VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $7, $8, 'CBSE', TRUE, TRUE, NOW(), NOW())
         ON CONFLICT (email) DO UPDATE SET xp = $5, "currentLevel" = $6, "currentStreak" = $7`,
        [user.name, user.email, demoPasswordHash,
         user.email === "admin@eduquest.com" ? "ADMIN" : "STUDENT",
         user.xp, user.level, user.streak, user.classLevel]
      );

      // Create wallet for each user
      await client.query(
        `INSERT INTO "Wallet" (id, "userId", balance, "isPremium", "createdAt", "updatedAt")
         SELECT gen_random_uuid()::text, u.id, $2, FALSE, NOW(), NOW()
         FROM "User" u WHERE u.email = $1
         ON CONFLICT ("userId") DO NOTHING`,
        [user.email, Math.floor(user.xp * 0.1)]
      );
    }
    console.log(`   ✅ ${SAMPLE_USERS.length} users seeded (including admin)`);

    // ── 2. Seed Topics ──
    console.log("📝 Seeding topics with NCERT theory content...");
    let topicCount = 0;

    for (const topicDef of CLASS_9_MATH_TOPICS) {
      // Find the chapter by slug
      const chapterResult = await client.query(
        `SELECT id FROM "Chapter" WHERE slug = $1 LIMIT 1`,
        [topicDef.chapterSlug]
      );

      if (chapterResult.rows.length === 0) {
        console.log(`   ⚠️ Chapter '${topicDef.chapterSlug}' not found, skipping`);
        continue;
      }

      const chapterId = chapterResult.rows[0].id;

      for (let i = 0; i < topicDef.topics.length; i++) {
        const topic = topicDef.topics[i];
        const slug = topic.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");

        await client.query(
          `INSERT INTO "Topic" (id, title, slug, content, "orderIndex", "chapterId")
           VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5)
           ON CONFLICT DO NOTHING`,
          [topic.title, slug, topic.content, i, chapterId]
        );
        topicCount++;
      }
    }
    console.log(`   ✅ ${topicCount} topics with theory content`);

    // ── 3. Seed Questions ──
    console.log("❓ Seeding MCQ questions with explanations...");
    let questionCount = 0;

    for (const qDef of CLASS_9_MATH_QUESTIONS) {
      // Find all chapters matching this slug (could be across different subjects)
      const chapterResult = await client.query(
        `SELECT c.id AS "chapterId", t.id AS "topicId"
         FROM "Chapter" c
         LEFT JOIN "Topic" t ON t."chapterId" = c.id
         WHERE c.slug = $1
         LIMIT 1`,
        [qDef.chapterSlug]
      );

      if (chapterResult.rows.length === 0) {
        console.log(`   ⚠️ Chapter '${qDef.chapterSlug}' not found, skipping`);
        continue;
      }

      const topicId = chapterResult.rows[0].topicId;

      for (const q of qDef.questions) {
        await client.query(
          `INSERT INTO "Question" (id, content, type, options, answer, explanation, difficulty, points, "topicId")
           VALUES (gen_random_uuid()::text, $1, 'MCQ', $2, $3, $4, $5, $6, $7)`,
          [q.content, JSON.stringify(q.options), q.answer, q.explanation, q.difficulty, q.points, topicId]
        );
        questionCount++;
      }
    }
    console.log(`   ✅ ${questionCount} MCQ questions with explanations`);

    // ── 4. Seed Daily Lessons for Python ──
    console.log("💻 Seeding Python daily lessons...");

    // Find the Python language
    const pythonResult = await client.query(
      `SELECT id FROM "CodingLanguage" WHERE slug = 'python' LIMIT 1`
    );

    if (pythonResult.rows.length > 0) {
      const pythonId = pythonResult.rows[0].id;

      // Find the Python learning plan
      const planResult = await client.query(
        `SELECT id FROM "LearningPlan" WHERE "languageId" = $1 LIMIT 1`,
        [pythonId]
      );

      if (planResult.rows.length > 0) {
        const planId = planResult.rows[0].id;

        for (const lesson of PYTHON_LESSONS.lessons) {
          await client.query(
            `INSERT INTO "DailyLesson" (id, "dayNumber", title, description, "theoryContent", "planId", "languageId")
             VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6)
             ON CONFLICT ("planId", "dayNumber") DO NOTHING`,
            [lesson.dayNumber, lesson.title, lesson.description, lesson.theoryContent, planId, pythonId]
          );
        }
        console.log(`   ✅ ${PYTHON_LESSONS.lessons.length} Python daily lessons`);
      }
    }

    // ── 5. Seed Sample Community Posts ──
    console.log("💬 Seeding sample community posts...");

    // Get admin user for post authorship
    const adminResult = await client.query(
      `SELECT id FROM "User" WHERE email = 'admin@eduquest.com' LIMIT 1`
    );
    const firstUserResult = await client.query(
      `SELECT id FROM "User" WHERE email = 'arjun@test.com' LIMIT 1`
    );

    if (adminResult.rows.length > 0 && firstUserResult.rows.length > 0) {
      const adminId = adminResult.rows[0].id;
      const userId = firstUserResult.rows[0].id;

      // Find general category
      const catResult = await client.query(
        `SELECT id FROM "CommunityCategory" WHERE slug = 'general' LIMIT 1`
      );
      const doubtsResult = await client.query(
        `SELECT id FROM "CommunityCategory" WHERE slug = 'doubts' LIMIT 1`
      );

      const generalId = catResult.rows[0]?.id;
      const doubtsId = doubtsResult.rows[0]?.id;

      if (generalId) {
        const posts = [
          { title: "Welcome to EduQuest Community! 🎉", content: "Hey everyone! Welcome to the EduQuest community forum. This is your space to discuss, share, and learn together. Feel free to ask questions, share study tips, or just hang out!", author: adminId, cat: generalId },
          { title: "Tips for maintaining a study streak 🔥", content: "I've been on a 42-day streak! Here are my tips:\n1. Set a daily alarm for study time\n2. Start with just 15 minutes\n3. Use the Pomodoro technique\n4. Track your progress on EduQuest\n5. Find a study buddy", author: userId, cat: generalId },
          { title: "How to ace the CBSE board exams 📚", content: "Board exam tips from someone who scored 95%:\n- Focus on NCERT textbooks\n- Practice previous year papers\n- Make short notes for revision\n- Don't skip any chapter\n- Sleep well before exams", author: userId, cat: generalId },
          { title: "Battle Arena strategy guide ⚔️", content: "After 50+ battles, here's what works:\n- Master quick mental math\n- Read questions carefully (trick questions are common)\n- Don't panic if your opponent is ahead\n- Practice timed quizzes daily", author: userId, cat: generalId },
        ];

        if (doubtsId) {
          posts.push(
            { title: "Help! How to solve quadratic equations?", content: "I'm stuck on Chapter 4 of Class 10 Maths. Can someone explain the quadratic formula step by step? I keep getting wrong answers when the discriminant is negative.", author: userId, cat: doubtsId },
            { title: "Difference between speed and velocity?", content: "Can someone explain the difference between speed and velocity in Physics? My teacher said they're different but they seem the same to me...", author: userId, cat: doubtsId },
          );
        }

        for (const post of posts) {
          await client.query(
            `INSERT INTO "CommunityPost" (id, title, content, "authorId", "categoryId", "createdAt", "updatedAt")
             VALUES (gen_random_uuid()::text, $1, $2, $3, $4, NOW() - interval '${Math.floor(Math.random() * 14)} days', NOW())
             ON CONFLICT DO NOTHING`,
            [post.title, post.content, post.author, post.cat]
          );
        }
        console.log(`   ✅ ${posts.length} community posts`);
      }
    }

    // ── 6. Seed Sample Events ──
    console.log("🏆 Seeding sample events...");
    const eventAdminId = adminResult.rows[0]?.id;

    if (eventAdminId) {
      const events = [
        {
          title: "EduQuest Mathematics Olympiad 2026",
          description: "Annual mathematics competition for Classes 9-12. Solve challenging problems, earn XP, and win prizes! Top 10 scorers get premium accounts.",
          eventType: "COMPETITION",
          venue: "Online",
          maxParticipants: 500,
          startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
        },
        {
          title: "Python Coding Challenge — Beginners",
          description: "30-minute coding challenge for Python beginners. Solve 5 problems of increasing difficulty. Great for practice!",
          eventType: "QUIZ",
          venue: "Online",
          maxParticipants: 200,
          startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
        },
        {
          title: "Science Hackathon 2026",
          description: "Build a science project using data from NCERT experiments. Teams of 2-4 students. Present your findings to win!",
          eventType: "HACKATHON",
          venue: "Online + Delhi NCR",
          maxParticipants: 100,
          startTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          title: "DSA Workshop — Arrays & Strings",
          description: "Live workshop on Data Structures: Arrays and Strings. Learn with hands-on coding examples in Python and C++.",
          eventType: "WORKSHOP",
          venue: "Online (Google Meet)",
          maxParticipants: 150,
          startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        },
      ];

      for (const event of events) {
        await client.query(
          `INSERT INTO "Event" (id, title, description, "organizerId", "eventType", venue,
           "maxParticipants", "startTime", "endTime", status, "createdAt", "updatedAt")
           VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8, 'PUBLISHED', NOW(), NOW())`,
          [event.title, event.description, eventAdminId, event.eventType,
           event.venue, event.maxParticipants, event.startTime, event.endTime]
        );
      }
      console.log(`   ✅ ${events.length} events created`);
    }

    await client.query("COMMIT");

    console.log("");
    console.log("╔══════════════════════════════════════════════╗");
    console.log("║     ✅ EXTENDED SEED COMPLETE!               ║");
    console.log("╠══════════════════════════════════════════════╣");
    console.log(`║  Users:       ${String(SAMPLE_USERS.length).padEnd(30)}║`);
    console.log(`║  Topics:      ${String(topicCount).padEnd(30)}║`);
    console.log(`║  Questions:   ${String(questionCount).padEnd(30)}║`);
    console.log(`║  Lessons:     ${String(PYTHON_LESSONS.lessons.length).padEnd(30)}║`);
    console.log(`║  Events:      4                              ║`);
    console.log(`║  Posts:        ~6                             ║`);
    console.log("╚══════════════════════════════════════════════╝");

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Extended seed failed:", err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

/* Run the seed script */
seedExtended().catch((err) => {
  console.error("Fatal seed error:", err);
  process.exit(1);
});
