/**
 * FILE: page.tsx
 * LOCATION: src/app/class-9/[subject]/[chapter]/[topicSlug]/page.tsx
 * PURPOSE: Server-side page handler for individual Class 9 subtopic pages.
 *          Resolves chapter data and individual subtopic slugs to present focused
 *          study interfaces.
 * USED BY: Next.js App Router
 * LAST UPDATED: 2026-05-28
 */

import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { forceAndLawsOfMotion } from "@/lib/content/class9/science/force-and-laws-of-motion";
import TopicStudyClient from "./TopicStudyClient";
import SchemaMarkup from "@/components/seo/SchemaMarkup";

interface PageProps {
  params: Promise<{
    subject: string;
    chapter: string;
    topicSlug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { chapter: chapterSlug, topicSlug } = resolvedParams;
  const isForceChapter = 
    chapterSlug === "force-and-laws-of-motion" || 
    chapterSlug === "force-laws-of-motion" || 
    chapterSlug === "force-and-laws";

  if (isForceChapter) {
    const topic = forceAndLawsOfMotion.topics.find((t) => t.id === topicSlug);
    if (topic) {
      const displayTitle = topic.title.replace(/^\d+\.\s*/, "");
      return {
        title: `${displayTitle} - Class 9 Science Study Notes | EduQuest`,
        description: `Master ${displayTitle} with deep concept explanations, real-world examples, interactive MCQs, and deep-thinking HOTS questions.`,
      };
    }
  }

  return {
    title: "Study Subtopic | EduQuest",
    description: "Learn and practice your concepts step-by-step with EduQuest.",
  };
}

export default async function SubtopicStudyPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { subject, chapter, topicSlug } = resolvedParams;
  const isForceChapter = 
    chapter === "force-and-laws-of-motion" || 
    chapter === "force-laws-of-motion" || 
    chapter === "force-and-laws";

  // Currently we have deep content for Force & Laws of Motion
  if (!isForceChapter) {
    notFound();
  }

  const topic = forceAndLawsOfMotion.topics.find((t) => t.id === topicSlug);
  if (!topic) {
    notFound();
  }

  const backUrl = `/class-9/${subject}/${chapter}`;

  return (
    <main style={{ minHeight: "100vh", background: "var(--color-bg-primary)" }}>
      <SchemaMarkup
        type="Article"
        data={{
          title: topic.title,
          description: `Deep study notes and interactive question pool for ${topic.title.replace(/^\d+\.\s*/, "")}.`
        }}
      />
      <TopicStudyClient
        chapterData={forceAndLawsOfMotion}
        activeTopic={topic}
        backUrl={backUrl}
      />
    </main>
  );
}
