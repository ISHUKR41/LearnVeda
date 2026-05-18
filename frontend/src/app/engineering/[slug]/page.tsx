/**
 * FILE: page.tsx
 * LOCATION: src/app/engineering/[slug]/page.tsx
 * PURPOSE: Dynamic engineering language/skill detail route generated from the
 *          shared curriculum catalog.
 * USED BY: Cards on /engineering
 * DEPENDENCIES: LearningPlanPage, learning catalog
 * LAST UPDATED: 2026-05-11
 */

import { notFound } from "next/navigation";
import LearningPlanPage from "@/components/learning/LearningPlanPage";
import { getEngineeringParams, getEngineeringPlan } from "@/lib/curriculum/learning-catalog";

export function generateStaticParams() {
  return getEngineeringParams();
}

/** Renders the selected engineering plan. */
export default async function EngineeringPlanPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const plan = getEngineeringPlan(slug);

  if (!plan) {
    notFound();
  }

  return <LearningPlanPage plan={plan} />;
}
