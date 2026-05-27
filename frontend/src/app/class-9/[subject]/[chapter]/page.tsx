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

interface PageProps {
  params: Promise<{
    subject: string;
    chapter: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
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
  const snapshot = await getChapterPracticeSnapshot({
    track: "class-9",
    subject: resolvedParams.subject,
    chapter: resolvedParams.chapter,
  });

  if (!snapshot) {
    notFound();
  }

  const backUrl = `/class-9/${resolvedParams.subject}`;

  return (
    <main style={{ minHeight: "80vh", background: "var(--color-bg-secondary)" }}>
      <ChapterPracticeClient snapshot={snapshot} backUrl={backUrl} />
    </main>
  );
}
