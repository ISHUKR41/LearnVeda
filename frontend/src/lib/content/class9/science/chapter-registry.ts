/**
 * FILE: chapter-registry.ts
 * LOCATION: src/lib/content/class9/science/chapter-registry.ts
 * PURPOSE: Central registry mapping URL slugs → Chapter content objects for
 *          ALL Class 9 Science chapters that have deep-research content.
 *
 *          The chapter page router (app/class-9/[subject]/[chapter]/page.tsx)
 *          looks up a slug here. If found → serves DeepResearchChapterClient.
 *          If not found → falls back to ChapterPracticeClient.
 *
 *          To add a new chapter:
 *          1. Create its folder under class9/science/
 *          2. Write topic files + index.ts
 *          3. Import and add to SCIENCE_CHAPTERS below.
 *
 * LAST UPDATED: 2026-05-28
 */

import type { Chapter } from "./shared-types";

/* ── Completed chapters ── */
import { matterInOurSurroundings } from "./matter-in-our-surroundings";
import { motion } from "./motion";
import { forceAndLawsOfMotion } from "./force-and-laws-of-motion";

/**
 * Maps every known URL slug (including alternate slugs from the CBSE catalog)
 * to its Chapter content object.
 *
 * Multiple slugs can point to the same chapter (aliases).
 */
export const SCIENCE_CHAPTERS: Record<string, Chapter> = {
  /* Chapter 1 — Matter in Our Surroundings */
  "matter-in-our-surroundings": matterInOurSurroundings,
  "matter-in-surroundings": matterInOurSurroundings,

  /* Chapter 8 — Motion */
  "motion": motion,

  /* Chapter 9 — Force and Laws of Motion */
  "force-and-laws-of-motion": forceAndLawsOfMotion,
  "force-laws-of-motion": forceAndLawsOfMotion,
  "force-and-laws": forceAndLawsOfMotion,
};

/**
 * Look up a chapter by URL slug.
 * Returns the Chapter or null if not yet implemented.
 */
export function getChapterBySlug(slug: string): Chapter | null {
  return SCIENCE_CHAPTERS[slug] ?? null;
}
