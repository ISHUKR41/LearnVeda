/**
 * FILE: index.ts
 * LOCATION: src/lib/content/class10/science/light-reflection-and-refraction/index.ts
 * PURPOSE: Aggregates all topics for the Class 10 Science chapter "Light - Reflection and Refraction"
 *          and exports the single Chapter object for the registry.
 * LAST UPDATED: 2026-06-08
 */

import { Chapter } from "../shared-types";
import { topic1IntroAndLawsOfReflection } from "./reflection/topic-1-intro-and-laws-of-reflection";
import { topic2SphericalMirrors } from "./spherical-mirrors/topic-2-concave-convex-mirrors";
import { topic3MirrorFormulaMagnification } from "./mirror-formula/topic-3-mirror-formula-magnification";
import { topic4LawsOfRefraction } from "./refraction/topic-4-laws-of-refraction-and-index";
import { topic5ImageFormationByLenses } from "./spherical-lenses/topic-5-image-formation-by-lenses";
import { topic6LensFormulaAndPower } from "./lens-formula/topic-6-lens-formula-and-power";

export const lightReflectionAndRefractionChapter: Chapter = {
  id: "light-reflection-and-refraction",
  title: "Light: Reflection and Refraction",
  subject: "Science",
  class: "Class 10",
  chapterNumber: 10,
  topics: [
    topic1IntroAndLawsOfReflection,
    topic2SphericalMirrors,
    topic3MirrorFormulaMagnification,
    topic4LawsOfRefraction,
    topic5ImageFormationByLenses,
    topic6LensFormulaAndPower
  ]
};
