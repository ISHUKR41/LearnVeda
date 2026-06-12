/**
 * FILE: page.tsx
 * LOCATION: src/app/engineering/[slug]/page.tsx
 * PURPOSE: Dynamic engineering language/skill detail route generated from the
 *          shared curriculum catalog.
 * USED BY: Cards on /engineering
 * DEPENDENCIES: LearningPlanPage, learning catalog
 * LAST UPDATED: 2026-05-11
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LearningPlanPage from "@/components/learning/LearningPlanPage";
import styles from "./PlanPage.module.css";
import { getEngineeringParams, getEngineeringPlan } from "@/lib/curriculum/learning-catalog";
import { generateBreadcrumbSchema, generateCourseSchema } from "@/lib/server/seo/schema-generators";

export function generateStaticParams() {
  return getEngineeringParams();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const plan = getEngineeringPlan(slug);

  if (!plan) {
    return {
      title: "Engineering Plan | Learnova",
      description: "Explore engineering learning plans on Learnova.",
    };
  }

  const title = `${plan.title} — ${plan.eyebrow} | Learnova`;
  const description = plan.description;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://learnova.in";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}/engineering/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/** Renders the selected engineering plan. */
export default async function EngineeringPlanPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const plan = getEngineeringPlan(slug);

  if (!plan) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://learnova.in";
  const courseSchema = generateCourseSchema({
    name: `${plan.title} — ${plan.eyebrow}`,
    description: plan.description,
    providerName: "Learnova Engineering Faculty",
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Engineering", url: `${baseUrl}/engineering` },
    { name: plan.title, url: `${baseUrl}/engineering/${slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: courseSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />
      <div className={styles.pageShell}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link href="/engineering" className={styles.breadcrumbLink}>Engineering</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{plan.title}</span>
        </nav>
        <LearningPlanPage plan={plan} />
      </div>
    </>
  );
}
