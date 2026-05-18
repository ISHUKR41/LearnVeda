/**
 * FILE: page.tsx
 * LOCATION: src/app/class-10/[subject]/page.tsx
 * PURPOSE: Dynamic Class 10 subject detail route generated from the shared
 *          curriculum catalog.
 * USED BY: Subject cards on /class-10
 * DEPENDENCIES: LearningPlanPage, learning catalog
 * LAST UPDATED: 2026-05-11
 */

import { notFound } from "next/navigation";
import LearningPlanPage from "@/components/learning/LearningPlanPage";
import { getSimpleClassParams } from "@/lib/curriculum/learning-catalog";
import { getSubjectPlanForRoute } from "@/lib/server/data/subject-plans";

export function generateStaticParams() {
  return getSimpleClassParams("class-10");
}

/** Renders the selected Class 10 subject plan. */
export default async function Class10SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params;
  const plan = await getSubjectPlanForRoute({
    track: "class-10",
    subject,
  });

  if (!plan) {
    notFound();
  }

  return <LearningPlanPage plan={plan} />;
}
