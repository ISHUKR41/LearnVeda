/**
 * FILE: page.tsx
 * LOCATION: src/app/class-12/[stream]/[subject]/page.tsx
 * PURPOSE: Dynamic Class 12 stream subject detail route generated from the
 *          shared curriculum catalog.
 * USED BY: Stream subject cards on /class-12
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
    track: "class-12",
    stream,
    subject,
  });

  if (!plan) {
    return {
      title: "Class 12 Subject Plan | Learnova",
      description: "Explore the Class 12 subject learning plan on Learnova.",
    };
  }

  const title = `${plan.title} — ${formatLabel(stream)} Stream | Learnova`;
  const description = plan.description;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://learnova.in";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}/class-12/${stream}/${subject}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/** Renders the selected Class 12 stream subject plan. */
export default async function Class12SubjectPage({ params }: { params: Promise<{ stream: string; subject: string }> }) {
  const { stream, subject } = await params;
  const plan = await getSubjectPlanForRoute({
    track: "class-12",
    stream,
    subject,
  });

  if (!plan) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://learnova.in";
  const courseSchema = generateCourseSchema({
    name: `${plan.title} — ${formatLabel(stream)} Stream`,
    description: plan.description,
    providerName: "Learnova Board & Entrance Team",
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Class 12", url: `${baseUrl}/class-12` },
    { name: formatLabel(stream), url: `${baseUrl}/class-12` },
    { name: plan.title, url: `${baseUrl}/class-12/${stream}/${subject}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: courseSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />
      <div className={styles.pageShell}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link href="/class-12" className={styles.breadcrumbLink}>Class 12</Link>
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
