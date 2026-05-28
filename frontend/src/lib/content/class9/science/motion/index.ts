/**
 * FILE: index.ts
 * LOCATION: src/lib/content/class9/science/motion/index.ts
 * PURPOSE: Exports the complete Chapter 8 — Motion data object.
 *          Assembles all five topic files into a single Chapter structure.
 *          Used by the chapter registry and the chapter page router.
 * CURRICULUM: CBSE Class 9 Science Chapter 8
 * LAST UPDATED: 2026-05-28
 */

import type { Chapter } from "./types";
import { distanceDisplacement } from "./topic-1-distance-displacement";
import { speedVelocity } from "./topic-2-speed-velocity";
import { acceleration } from "./topic-3-acceleration";
import { equationsOfMotion } from "./topic-4-equations-of-motion";
import { uniformCircularMotion } from "./topic-5-uniform-circular-motion";

export const motion: Chapter = {
  id: "motion",
  title: "Motion",
  subject: "Science",
  class: "Class 9",
  chapterNumber: 8,
  topics: [
    distanceDisplacement,
    speedVelocity,
    acceleration,
    equationsOfMotion,
    uniformCircularMotion,
  ],
};
