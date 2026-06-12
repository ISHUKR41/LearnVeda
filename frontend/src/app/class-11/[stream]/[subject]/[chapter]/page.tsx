/**
 * FILE: page.tsx
 * LOCATION: src/app/class-11/[stream]/[subject]/[chapter]/page.tsx
 * PURPOSE: Server-side page route handler for Class 11 Chapter Practice.
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
  params: {
    stream: string;
    subject: string;
    chapter: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await getChapterPracticeSnapshot({
    track: "class-11",
    stream: params.stream,
    subject: params.subject,
    chapter: params.chapter,
  });

  if (!data) {
    return {
      title: "Chapter Practice | LearnVeda",
      description: "Practice concept questions on LearnVeda.",
    };
  }

  return {
    title: `${data.chapterName} - Chapter Practice | LearnVeda`,
    description: `Take interactive multiple choice questions on ${data.chapterName} for Class 11 ${data.subjectName} (${params.stream}). Earn XP points and clear your concepts.`,
  };
}

export default async function Class11ChapterPracticePage({ params }: PageProps) {
  const snapshot = await getChapterPracticeSnapshot({
    track: "class-11",
    stream: params.stream,
    subject: params.subject,
    chapter: params.chapter,
  });

  if (!snapshot) {
    notFound();
  }

  const backUrl = `/class-11/${params.stream}/${params.subject}`;

  return (
    <main style={{ minHeight: "80vh", background: "var(--color-bg-secondary)" }}>
      <ChapterPracticeClient snapshot={snapshot} backUrl={backUrl} />
    </main>
  );
}
