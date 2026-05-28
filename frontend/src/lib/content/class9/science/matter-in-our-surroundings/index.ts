/**
 * FILE: index.ts
 * LOCATION: src/lib/content/class9/science/matter-in-our-surroundings/index.ts
 * PURPOSE: Exports the complete Chapter 1 — Matter in Our Surroundings data object.
 *          Assembles all five topic files into a single Chapter structure.
 *          Used by the chapter registry and the chapter page router.
 * CURRICULUM: CBSE Class 9 Science Chapter 1
 * LAST UPDATED: 2026-05-28
 */

import type { Chapter } from "./types";
import { whatIsMatter } from "./topic-1-what-is-matter";
import { statesOfMatter } from "./topic-2-states-of-matter";
import { changeOfState } from "./topic-3-change-of-state";
import { evaporation } from "./topic-4-evaporation";
import { diffusion } from "./topic-5-diffusion";

export const matterInOurSurroundings: Chapter = {
  id: "matter-in-our-surroundings",
  title: "Matter in Our Surroundings",
  subject: "Science",
  class: "Class 9",
  chapterNumber: 1,
  topics: [
    whatIsMatter,
    statesOfMatter,
    changeOfState,
    evaporation,
    diffusion,
  ],
};
