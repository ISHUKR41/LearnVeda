/**
 * FILE: page.tsx
 * LOCATION: src/app/class-9/[subject]/[chapter]/page.tsx
 * PURPOSE: Server-side page route handler for Class 9 Chapter Practice.
 *          Fetches chapter practice questions and configuration, resolves slugs,
 *          and mounts the ChapterPracticeClient component.
 * USED BY: Next.js App Router
 * DEPENDENCIES: getChapterPracticeSnapshot, ChapterPracticeClient
 * LAST UPDATED: 2026-05-20
 * AUTHOR NOTE: Implements standard server component fetching logic and dynamic SEO metadata.
 */

import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getChapterPracticeSnapshot } from "@/lib/server/data/subject-plans";
import ChapterPracticeClient from "./ChapterPracticeClient";
import DeepResearchChapterClient from "./DeepResearchChapterClient";
import { forceAndLawsOfMotion } from "@/lib/content/class9/science/force-and-laws-of-motion";
import SchemaMarkup from "@/components/seo/SchemaMarkup";

interface PageProps {
  params: Promise<{
    subject: string;
    chapter: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  
  const isForceChapter = 
    resolvedParams.chapter === "force-and-laws-of-motion" || 
    resolvedParams.chapter === "force-laws-of-motion" || 
    resolvedParams.chapter === "force-and-laws";

  if (isForceChapter) {
    return {
      title: "Force & Laws of Motion Class 9 Notes + MCQs + PYQs (2026)",
      description: "Deep research on Force & Laws of Motion. Learn concepts from basic to advanced with real-world examples. Practice MCQs, short, and long questions.",
    };
  }
  
  const data = await getChapterPracticeSnapshot({
    track: "class-9",
    subject: resolvedParams.subject,
    chapter: resolvedParams.chapter,
  });

  if (!data) {
    return {
      title: "Chapter Practice | EduQuest",
      description: "Practice concept questions on EduQuest.",
    };
  }

  return {
    title: `${data.chapterName} - Chapter Practice | EduQuest`,
    description: `Take interactive multiple choice questions on ${data.chapterName} for Class 9 ${data.subjectName}. Earn XP points and clear your concepts.`,
  };
}

export default async function Class9ChapterPracticePage({ params }: PageProps) {
  const resolvedParams = await params;
  const backUrl = `/class-9/${resolvedParams.subject}`;

  const isForceChapter = 
    resolvedParams.chapter === "force-and-laws-of-motion" || 
    resolvedParams.chapter === "force-laws-of-motion" || 
    resolvedParams.chapter === "force-and-laws";

  // Serve deep research content for this specific chapter
  if (isForceChapter) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--color-bg-primary)" }}>
        <SchemaMarkup 
          type="Article" 
          data={{ 
            title: "Force & Laws of Motion", 
            description: "Deep research on Force & Laws of Motion. Learn concepts from basic to advanced with real-world examples." 
          }} 
        />
        <DeepResearchChapterClient chapterData={forceAndLawsOfMotion} backUrl={backUrl} />
      </main>
    );
  }

  const snapshot = await getChapterPracticeSnapshot({
    track: "class-9",
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
