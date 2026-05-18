# Curriculum — CBSE and Engineering Content Catalog

## What This Folder Is

This folder contains all the **structured curriculum data** for the EduQuest platform. It is the single source of truth for:

- Which subjects exist for each class (9, 10, 11, 12)
- Which chapters each subject contains
- How many study days each chapter requires
- Question counts per chapter
- Difficulty ratings

## Files in This Folder

| File | Purpose |
|------|---------|
| `cbse-catalog.ts` | Complete CBSE catalog for Class 9–12 (subjects → chapters → days) |
| `learning-catalog.ts` | Learning plan definitions for the `LearningPlanPage` component |

## Data Sources

All chapter names and counts are based on the **NCERT 2025–26 syllabus** for each class.

- Class 9 Mathematics: 15 chapters
- Class 9 Science: 15 chapters
- Class 9 Social Science: 20 chapters (History + Geography + Civics + Economics)
- Class 9 English: 12 chapters
- Class 9 Hindi: 12 chapters
- Class 9 Computer Applications: 8 chapters

## How to Add a New Class or Subject

1. Open `cbse-catalog.ts`
2. Add a new `Subject` object to the appropriate `ClassCatalog`
3. Fill in all chapters with slug, name, description, dayCount, difficulty, questionCount
4. Add the corresponding seed data to `003_subjects_chapters_progress.sql`
5. Re-run `npm run db:migrate` to insert the data into PostgreSQL

## How Study Days Work

Each chapter is divided into daily study sessions. For example, "Number Systems" (Class 9 Math) has 7 days:
- Day 1: Rational numbers
- Day 2: Irrational numbers
- Day 3: Real numbers and decimal expansions
- Day 4: Number line representation
- Day 5: Operations on real numbers
- Day 6: Laws of exponents
- Day 7: Full chapter revision + practice

Each day contains theory, 5–10 questions, and a YouTube hint link.

## Comment Standards

Every file MUST include:
- File-level comment block (FILE, LOCATION, PURPOSE, USED BY, DEPENDENCIES)
- JSDoc on every exported function
- Comments on complex data structures explaining the shape
