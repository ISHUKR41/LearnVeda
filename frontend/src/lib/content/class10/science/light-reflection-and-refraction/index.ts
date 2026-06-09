/**
 * FILE: index.ts
 * LOCATION: src/lib/content/class10/science/light-reflection-and-refraction/index.ts
 * PURPOSE: Aggregates all topics for the Class 10 Science chapter "Light - Reflection and Refraction"
 *          and exports the single Chapter object for the registry.
 *          Also attaches flash card and mind map data to each topic for the study aids feature.
 * LAST UPDATED: 2026-06-08
 */

import { Chapter } from "../shared-types";
import { topic1IntroAndLawsOfReflection } from "./reflection/topic-1-intro-and-laws-of-reflection";
import { topic2SphericalMirrors } from "./spherical-mirrors/topic-2-concave-convex-mirrors";
import { topic3MirrorFormulaMagnification } from "./mirror-formula/topic-3-mirror-formula-magnification";
import { topic4LawsOfRefraction } from "./refraction/topic-4-laws-of-refraction-and-index";
import { topic5ImageFormationByLenses } from "./spherical-lenses/topic-5-image-formation-by-lenses";
import { topic6LensFormulaAndPower } from "./lens-formula/topic-6-lens-formula-and-power";
import { topic7TotalInternalReflection } from "./tir-optical-fibres/topic-7-total-internal-reflection";
import { topic8DispersionAndHumanEye } from "./dispersion-scattering/topic-8-dispersion-and-human-eye";
import { topic9NumericalsAdvanced } from "./numericals-advanced/topic-9-numericals-advanced";
import { topicFlashCards, topicMindMaps } from "./study-aids/study-aids";

/* ── Helper: Attach study aids to a topic ── */
function enrichTopic(topic: typeof topic1IntroAndLawsOfReflection) {
  return {
    ...topic,
    flashCards: topicFlashCards[topic.id] || [],
    mindMap: topicMindMaps[topic.id] || [],
  };
}

export const lightReflectionAndRefractionChapter: Chapter = {
  id: "light-reflection-and-refraction",
  title: "Light: Reflection and Refraction",
  subject: "Science",
  class: "Class 10",
  chapterNumber: 10,
  topics: [
    enrichTopic(topic1IntroAndLawsOfReflection),
    enrichTopic(topic2SphericalMirrors),
    enrichTopic(topic3MirrorFormulaMagnification),
    enrichTopic(topic4LawsOfRefraction),
    enrichTopic(topic5ImageFormationByLenses),
    enrichTopic(topic6LensFormulaAndPower),
    enrichTopic(topic7TotalInternalReflection),
    enrichTopic(topic8DispersionAndHumanEye),
    enrichTopic(topic9NumericalsAdvanced),
  ],
};
