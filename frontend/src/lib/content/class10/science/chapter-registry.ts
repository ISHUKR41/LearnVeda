/**
 * FILE: chapter-registry.ts
 * LOCATION: src/lib/content/class10/science/chapter-registry.ts
 * PURPOSE: Central registry to route class10 science catalog slugs to their full DeepResearch content payload.
 * USED BY: src/app/class-10/[subject]/[chapter]/page.tsx
 * LAST UPDATED: 2026-06-08
 */

import { Chapter } from "./shared-types";
import { lightReflectionAndRefractionChapter } from "./light-reflection-and-refraction";

/**
 * Registry mapping URL slugs to full chapter payloads.
 * This pattern avoids massive single-file bundling by lazy-loading
 * or chunking chapter data down the road if needed.
 */
export const CLASS10_SCIENCE_CHAPTERS: Record<string, Chapter> = {
  "light-reflection-and-refraction": lightReflectionAndRefractionChapter,
};
