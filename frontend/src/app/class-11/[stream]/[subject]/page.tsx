/**
 * FILE: page.tsx
 * LOCATION: src/app/class-11/[stream]/[subject]/page.tsx
 * PURPOSE: Dynamic Class 11 stream subject detail route generated from the
 *          shared curriculum catalog.
 * USED BY: Stream subject cards on /class-11
 * DEPENDENCIES: LearningPlanPage, learning catalog
 * LAST UPDATED: 2026-05-11
 */

import { notFound } from "next/navigation";
import LearningPlanPage from "@/components/learning/LearningPlanPage";
import { getStreamClassParams } from "@/lib/curriculum/learning-catalog";
import { getSubjectPlanForRoute } from "@/lib/server/data/subject-plans";

export function generateStaticParams() {
  return getStreamClassParams();
}

/** Renders the selected Class 11 stream subject plan. */
export default async function Class11SubjectPage({ params }: { params: Promise<{ stream: string; subject: string }> }) {
  const { stream, subject } = await params;
  const plan = await getSubjectPlanForRoute({
    track: "class-11",
    stream,
    subject,
  });

  if (!plan) {
    notFound();
  }

  return <LearningPlanPage plan={plan} />;
}
