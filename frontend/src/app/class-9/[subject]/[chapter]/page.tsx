/**
 * FILE: page.tsx
 * LOCATION: src/app/class-9/[subject]/[chapter]/page.tsx
 * PURPOSE: Server-side page route handler for Class 9 Chapter pages.
 *
 *          ROUTING STRATEGY:
 *          1. Looks up the chapter slug in the science chapter registry.
 *             If found → serves DeepResearchChapterClient (rich content, topics, 20 Qs/topic).
 *          2. Falls back to ChapterPracticeClient (database-driven MCQ practice)
 *             for chapters not yet implemented in the deep content system.
 *
 *          This design means any new chapter can be added simply by creating its
 *          content files and registering it in chapter-registry.ts — no changes
 *          needed to this file.
 *
 * USED BY: Next.js App Router
 * DEPENDENCIES: chapter-registry, DeepResearchChapterClient, ChapterPracticeClient
 * LAST UPDATED: 2026-05-28
 */

import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getChapterPracticeSnapshot } from "@/lib/server/data/subject-plans";
import ChapterPracticeClient from "./ChapterPracticeClient";
import DeepResearchChapterClient from "./DeepResearchChapterClient";
import { getChapterBySlug } from "@/lib/content/class9/science/chapter-registry";
import SchemaMarkup from "@/components/seo/SchemaMarkup";

interface PageProps {
  params: Promise<{
    subject: string;
    chapter: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const chapterSlug = resolvedParams.chapter;
  const subjectSlug = resolvedParams.subject;

  /* Check deep-research registry first */
  if (subjectSlug === "science") {
    const deepChapter = getChapterBySlug(chapterSlug);
    if (deepChapter) {
      return {
        title: `${deepChapter.title} Class 9 Notes + MCQs + Questions (2026)`,
        description: `Deep study of ${deepChapter.title}. Understand every concept from basics to advanced with real-life examples. Practice 20 questions per topic — MCQ, Short, Long, and HOTS.`,
      };
    }
  }

  /* Fall back to practice snapshot metadata */
  const data = await getChapterPracticeSnapshot({
    track: "class-9",
    subject: subjectSlug,
    chapter: chapterSlug,
  });

  if (!data) {
    return {
      title: "Chapter Practice | Learnova",
      description: "Practice concept questions on Learnova.",
    };
  }

  return {
    title: `${data.chapterName} - Chapter Practice | Learnova`,
    description: `Interactive questions on ${data.chapterName} for Class 9 ${data.subjectName}. Earn XP points and clear your concepts.`,
  };
}

export default async function Class9ChapterPage({ params }: PageProps) {
  /* NOTE: Chapter content pages are intentionally PUBLIC — students can browse
   * without logging in. Authentication is only required when submitting answers
   * (handled by /api/progress which returns 401 and the client shows a sign-in
   * prompt inline). Removing the server-side auth check fixes the redirect loop:
   * unauthenticated click → /sign-in → Clerk fallback → /dashboard (wrong). */

  const resolvedParams = await params;
  const { subject, chapter } = resolvedParams;
  const backUrl = `/class-9/${subject}`;

  /* ── Deep-research content: science chapters with full topic content ── */
  if (subject === "science") {
    const deepChapter = getChapterBySlug(chapter);
    if (deepChapter) {
      return (
        <main style={{ minHeight: "100vh", background: "var(--color-bg-primary)" }}>
          <SchemaMarkup
            type="Article"
            data={{
              title: deepChapter.title,
              description: `Deep study of ${deepChapter.title} — CBSE Class 9 Science.`,
            }}
          />
          <DeepResearchChapterClient chapterData={deepChapter} backUrl={backUrl} />
        </main>
      );
    }
  }

  /* ── Fallback: database-driven chapter practice ── */
  const snapshot = await getChapterPracticeSnapshot({
    track: "class-9",
    subject,
    chapter,
  });

  if (!snapshot) {
    notFound();
  }

  return (
    <main style={{ minHeight: "80vh", background: "var(--color-bg-secondary)" }}>
      <ChapterPracticeClient snapshot={snapshot} backUrl={backUrl} />
    </main>
  );
}
