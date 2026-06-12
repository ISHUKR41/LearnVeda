/**
 * FILE: page.tsx
 * LOCATION: src/app/class-9/[subject]/page.tsx
 * PURPOSE: Dynamic Class 9 subject detail route generated from the shared
 *          curriculum catalog.
 * USED BY: Subject cards on /class-9
 * DEPENDENCIES: LearningPlanPage, learning catalog
 * LAST UPDATED: 2026-05-11
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LearningPlanPage from "@/components/learning/LearningPlanPage";
import styles from "./SubjectPage.module.css";
import { getSimpleClassParams } from "@/lib/curriculum/learning-catalog";
import { getSubjectPlanForRoute } from "@/lib/server/data/subject-plans";
import { generateBreadcrumbSchema, generateCourseSchema } from "@/lib/server/seo/schema-generators";

export function generateStaticParams() {
  return getSimpleClassParams("class-9");
}

export async function generateMetadata({ params }: { params: Promise<{ subject: string }> }): Promise<Metadata> {
  const { subject } = await params;
  const plan = await getSubjectPlanForRoute({
    track: "class-9",
    subject,
  });

  if (!plan) {
    return {
      title: "Class 9 Subject Plan | Learnova",
      description: "Explore the Class 9 subject learning plan on Learnova.",
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
      url: `${baseUrl}/class-9/${subject}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://learnova.in";
  const courseSchema = generateCourseSchema({
    name: `${plan.title} — ${plan.eyebrow}`,
    description: plan.description,
    providerName: "Learnova Academic Board",
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Class 9", url: `${baseUrl}/class-9` },
    { name: plan.title, url: `${baseUrl}/class-9/${subject}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: courseSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />
      <div className={styles.pageShell}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link href="/class-9" className={styles.breadcrumbLink}>Class 9</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{plan.title}</span>
        </nav>
        <LearningPlanPage plan={plan} />
      </div>
    </>
  );
}
