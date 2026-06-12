/**
 * FILE: page.tsx
 * LOCATION: src/app/class-10/[subject]/[chapter]/page.tsx
 * PURPOSE: Server-side page route handler for Class 10 Chapter Practice.
 *          Fetches chapter practice questions and configuration, resolves slugs,
 *          and mounts the ChapterPracticeClient component or DeepResearchChapterClient.
 * USED BY: Next.js App Router
 * DEPENDENCIES: getChapterPracticeSnapshot, ChapterPracticeClient, DeepResearchChapterClient
 * LAST UPDATED: 2026-06-08
 */

import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getChapterPracticeSnapshot } from "@/lib/server/data/subject-plans";
import ChapterPracticeClient from "./ChapterPracticeClient";
import DeepResearchChapterClient from "./DeepResearchChapterClient";
import { CLASS10_SCIENCE_CHAPTERS } from "@/lib/content/class10/science/chapter-registry";

interface PageProps {
  params: Promise<{
    subject: string;
    chapter: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  // Check deep research registry first
  if (resolvedParams.subject === "science" && CLASS10_SCIENCE_CHAPTERS[resolvedParams.chapter]) {
    const chapterData = CLASS10_SCIENCE_CHAPTERS[resolvedParams.chapter];
    return {
      title: `${chapterData.title} | Deep Research | VidyaBolt`,
      description: `Comprehensive deep-dive study material, interactive simulations, and practice questions for ${chapterData.title}.`,
    };
  }

  const data = await getChapterPracticeSnapshot({
    track: "class-10",
    subject: resolvedParams.subject,
    chapter: resolvedParams.chapter,
  });

  if (!data) {
    return {
      title: "Chapter Practice | VidyaBolt",
      description: "Practice concept questions on VidyaBolt.",
    };
  }

  return {
    title: `${data.chapterName} - Chapter Practice | VidyaBolt`,
    description: `Take interactive multiple choice questions on ${data.chapterName} for Class 10 ${data.subjectName}. Earn XP points and clear your concepts.`,
  };
}

export default async function Class10ChapterPracticePage({ params }: PageProps) {
  const resolvedParams = await params;
  const backUrl = `/class-10/${resolvedParams.subject}`;

  // 1. Check Deep Research Content First (Static payload)
  if (resolvedParams.subject === "science" && CLASS10_SCIENCE_CHAPTERS[resolvedParams.chapter]) {
    const chapterData = CLASS10_SCIENCE_CHAPTERS[resolvedParams.chapter];
    return (
      <main style={{ minHeight: "80vh", background: "var(--color-bg-secondary)" }}>
        <DeepResearchChapterClient chapterData={chapterData} backUrl={backUrl} />
      </main>
    );
  }

  // 2. Fallback to standard DB-driven practice snapshot
  const snapshot = await getChapterPracticeSnapshot({
    track: "class-10",
    subject: resolvedParams.subject,
    chapter: resolvedParams.chapter,
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
