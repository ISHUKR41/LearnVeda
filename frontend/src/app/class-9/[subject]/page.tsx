/**
 * FILE: page.tsx
 * LOCATION: src/app/class-9/[subject]/page.tsx
 * PURPOSE: Dynamic Class 9 subject detail route generated from the shared
 *          curriculum catalog.
 * USED BY: Subject cards on /class-9
 * DEPENDENCIES: LearningPlanPage, learning catalog
 * LAST UPDATED: 2026-05-11
 */

import { notFound } from "next/navigation";
import LearningPlanPage from "@/components/learning/LearningPlanPage";
import { getSimpleClassParams } from "@/lib/curriculum/learning-catalog";
import { getSubjectPlanForRoute } from "@/lib/server/data/subject-plans";

export function generateStaticParams() {
  return getSimpleClassParams("class-9");
}

/** Renders the selected Class 9 subject plan. */
export default async function Class9SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params;
  const plan = await getSubjectPlanForRoute({
    track: "class-9",
    subject,
  });

  if (!plan) {
    notFound();
  }

  return <LearningPlanPage plan={plan} />;
}
