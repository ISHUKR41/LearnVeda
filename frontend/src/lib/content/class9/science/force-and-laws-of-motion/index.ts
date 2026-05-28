/**
 * FILE: index.ts
 * LOCATION: frontend/src/lib/content/class9/science/force-and-laws-of-motion/index.ts
 * PURPOSE: Chapter aggregator for Force & Laws of Motion. 
 *          Connects all highly modularized topics into a single chapter object.
 */
export * from "./types";
import { Chapter } from "./types";
import { balancedUnbalancedForces } from "./topic-1-balanced-unbalanced-forces";
import { firstLawOfMotionInertia } from "./topic-2-first-law-of-motion";
import { secondLawOfMotion } from "./topic-3-second-law-of-motion";
import { thirdLawOfMotion } from "./topic-4-third-law-of-motion";
import { conservationOfMomentum } from "./topic-5-conservation-of-momentum";

export const forceAndLawsOfMotion: Chapter = {
  id: 'force-and-laws-of-motion',
  title: 'Force & Laws of Motion',
  subject: 'Science',
  class: 'Class 9',
  topics: [
    balancedUnbalancedForces,
    firstLawOfMotionInertia,
    secondLawOfMotion,
    thirdLawOfMotion,
    conservationOfMomentum
  ]
};
