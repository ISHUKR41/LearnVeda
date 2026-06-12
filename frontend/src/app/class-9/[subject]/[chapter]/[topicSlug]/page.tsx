/**
 * FILE: page.tsx
 * LOCATION: src/app/class-9/[subject]/[chapter]/[topicSlug]/page.tsx
 * PURPOSE: Server-side page handler for individual Class 9 subtopic pages.
 *          Resolves chapter data and individual subtopic slugs to present focused
 *          study interfaces. Supports three chapters:
 *          - force-and-laws-of-motion
 *          - matter-in-our-surroundings
 *          - motion
 * LAST UPDATED: 2026-05-29
 */

import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { forceAndLawsOfMotion } from "@/lib/content/class9/science/force-and-laws-of-motion";
import { matterInOurSurroundings } from "@/lib/content/class9/science/matter-in-our-surroundings";
import { motion as motionChapter } from "@/lib/content/class9/science/motion";
import TopicStudyClient from "./TopicStudyClient";
import SchemaMarkup from "@/components/seo/SchemaMarkup";

interface PageProps {
  params: Promise<{
    subject: string;
    chapter: string;
    topicSlug: string;
  }>;
}

/* Map chapter slugs to their chapter data objects */
const CHAPTER_MAP: Record<string, typeof forceAndLawsOfMotion> = {
  "force-and-laws-of-motion": forceAndLawsOfMotion,
  "force-laws-of-motion":     forceAndLawsOfMotion, /* alias */
  "force-and-laws":           forceAndLawsOfMotion, /* alias */
  "matter-in-our-surroundings": matterInOurSurroundings as typeof forceAndLawsOfMotion,
  "matter":                   matterInOurSurroundings as typeof forceAndLawsOfMotion,
  "motion":                   motionChapter as typeof forceAndLawsOfMotion,
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { chapter: chapterSlug, topicSlug } = resolvedParams;
  const chapterData = CHAPTER_MAP[chapterSlug];

  if (chapterData) {
    const topic = chapterData.topics.find((t) => t.id === topicSlug);
    if (topic) {
      const displayTitle = topic.title.replace(/^\d+\.\s*/, "");
      return {
        title: `${displayTitle} — Class 9 Science Study Notes | VidyaBolt`,
        description: `Master ${displayTitle} with deep concept explanations, real-world examples, interactive simulations, MCQs, and HOTS questions.`,
      };
    }
  }

  return {
    title: "Study Subtopic | VidyaBolt",
    description: "Learn and practice your concepts step-by-step with VidyaBolt.",
  };
}

export default async function SubtopicStudyPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { subject, chapter, topicSlug } = resolvedParams;

  const chapterData = CHAPTER_MAP[chapter];
  if (!chapterData) notFound();

  const topic = chapterData.topics.find((t) => t.id === topicSlug);
  if (!topic) notFound();

  const backUrl = `/class-9/${subject}/${chapter}`;

  return (
    <main style={{ minHeight: "100vh", background: "var(--color-bg-primary)" }}>
      <SchemaMarkup
        type="Article"
        data={{
          title: topic.title,
          description: `Deep study notes and interactive simulations for ${topic.title.replace(/^\d+\.\s*/, "")}.`,
        }}
      />
      <TopicStudyClient
        chapterData={chapterData}
        activeTopic={topic}
        backUrl={backUrl}
      />
    </main>
  );
}
