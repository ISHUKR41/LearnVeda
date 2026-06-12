/**
 * FILE: page.tsx
 * LOCATION: src/app/class-11/[stream]/[subject]/page.tsx
 * PURPOSE: Dynamic Class 11 stream subject detail route generated from the
 *          shared curriculum catalog.
 * USED BY: Stream subject cards on /class-11
 * DEPENDENCIES: LearningPlanPage, learning catalog
 * LAST UPDATED: 2026-05-11
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LearningPlanPage from "@/components/learning/LearningPlanPage";
import styles from "./SubjectPage.module.css";
import { getStreamClassParams } from "@/lib/curriculum/learning-catalog";
import { getSubjectPlanForRoute } from "@/lib/server/data/subject-plans";
import { generateBreadcrumbSchema, generateCourseSchema } from "@/lib/server/seo/schema-generators";

export function generateStaticParams() {
  return getStreamClassParams();
}

function formatLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ stream: string; subject: string }>;
}): Promise<Metadata> {
  const { stream, subject } = await params;
  const plan = await getSubjectPlanForRoute({
    track: "class-11",
    stream,
    subject,
  });

  if (!plan) {
    return {
      title: "Class 11 Subject Plan | LearnVeda",
      description: "Explore the Class 11 subject learning plan on LearnVeda.",
    };
  }

  const title = `${plan.title} — ${formatLabel(stream)} Stream | LearnVeda`;
  const description = plan.description;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://learnveda.in";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}/class-11/${stream}/${subject}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://learnveda.in";
  const courseSchema = generateCourseSchema({
    name: `${plan.title} — ${formatLabel(stream)} Stream`,
    description: plan.description,
    providerName: "LearnVeda Senior Secondary Board",
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Class 11", url: `${baseUrl}/class-11` },
    { name: formatLabel(stream), url: `${baseUrl}/class-11` },
    { name: plan.title, url: `${baseUrl}/class-11/${stream}/${subject}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: courseSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />
      <div className={styles.pageShell}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link href="/class-11" className={styles.breadcrumbLink}>Class 11</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbLink}>{formatLabel(stream)}</span>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{plan.title}</span>
        </nav>
        <LearningPlanPage plan={plan} />
      </div>
    </>
  );
}
