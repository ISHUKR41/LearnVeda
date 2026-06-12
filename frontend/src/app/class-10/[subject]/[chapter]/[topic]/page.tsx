/**
 * FILE: page.tsx
 * LOCATION: src/app/class-10/[subject]/[chapter]/[topic]/page.tsx
 * PURPOSE: Server-side route for a single focused-study topic page.
 *
 *          URL PATTERN:
 *            /class-10/science/light-reflection-and-refraction/intro-and-laws-of-reflection
 *
 *          WHAT IT DOES:
 *            1. Resolves subject + chapter + topic slug from the URL params.
 *            2. Looks up the topic in the deep-research chapter registry.
 *            3. If found → renders TopicStudyClient with the single topic.
 *            4. If not found → calls notFound() (renders 404).
 *
 *          SEO:
 *            Generates topic-specific <title> and <description> metadata for
 *            search engine discoverability (each topic is its own indexable URL).
 *
 * USED BY: Next.js App Router dynamic routing
 * DEPENDS ON: CLASS10_SCIENCE_CHAPTERS registry, TopicStudyClient
 * LAST UPDATED: 2026-06-08
 */

import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { CLASS10_SCIENCE_CHAPTERS } from "@/lib/content/class10/science/chapter-registry";
import TopicStudyClient from "./TopicStudyClient";

/* ─────────────────────────────────────────────
 * Page props — Next.js App Router passes dynamic
 * segments as a Promise in Next.js 15+
 * ───────────────────────────────────────────── */
interface PageProps {
  params: Promise<{
    subject: string;
    chapter: string;
    topic:   string;
  }>;
}

/* ═══════════════════════════════════════════════════
 * generateMetadata — SEO metadata per topic
 * Each topic gets its own <title> tag for search ranking.
 * ═══════════════════════════════════════════════════ */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { subject, chapter, topic } = await params;

  /* Only deep-research chapters are served by this route */
  if (subject !== "science" || !CLASS10_SCIENCE_CHAPTERS[chapter]) {
    return { title: "Topic Study | LearnVeda" };
  }

  const chapterData = CLASS10_SCIENCE_CHAPTERS[chapter];
  const topicData   = chapterData.topics.find((t) => t.id === topic);

  if (!topicData) {
    return { title: "Topic Not Found | LearnVeda" };
  }

  const topicTitle = topicData.title.replace(/^\d+\.\s*/, ""); /* Strip "1. " prefix */

  return {
    title: `${topicTitle} — ${chapterData.title} | Class 10 Science | LearnVeda`,
    description: `Study ${topicTitle} from the ${chapterData.title} chapter. ` +
      `Includes detailed notes, flash cards, mind map, ${topicData.questions.length} practice questions, ` +
      `and exam summaries for CBSE Class 10.`,
    openGraph: {
      title:       `${topicTitle} | LearnVeda`,
      description: `Class 10 Science — ${chapterData.title}: ${topicTitle}`,
      images:      topicData.imageUrl ? [topicData.imageUrl] : [],
    },
  };
}

/* ═══════════════════════════════════════════════════
 * generateStaticParams — pre-generate all topic URLs
 * Tells Next.js to statically pre-render every topic
 * page at build time for maximum performance.
 * ═══════════════════════════════════════════════════ */
export function generateStaticParams() {
  const paths: { subject: string; chapter: string; topic: string }[] = [];

  /* Iterate over every chapter in the deep-research registry */
  Object.entries(CLASS10_SCIENCE_CHAPTERS).forEach(([chapterId, chapterData]) => {
    chapterData.topics.forEach((topicData) => {
      paths.push({
        subject: "science",
        chapter: chapterId,
        topic:   topicData.id,
      });
    });
  });

  return paths;
}

/* ═══════════════════════════════════════════════════
 * Page Component (Server)
 * ═══════════════════════════════════════════════════ */
export default async function TopicStudyPage({ params }: PageProps) {
  const { subject, chapter, topic } = await params;

  /* Only science deep-research chapters have topic sub-pages */
  if (subject !== "science" || !CLASS10_SCIENCE_CHAPTERS[chapter]) {
    notFound();
  }

  const chapterData = CLASS10_SCIENCE_CHAPTERS[chapter];
  const topicData   = chapterData.topics.find((t) => t.id === topic);

  if (!topicData) {
    notFound();
  }

  /* Build the previous/next topic slugs for navigation */
  const topicIndex  = chapterData.topics.findIndex((t) => t.id === topic);
  const prevTopic   = topicIndex > 0 ? chapterData.topics[topicIndex - 1] : null;
  const nextTopic   = topicIndex < chapterData.topics.length - 1
    ? chapterData.topics[topicIndex + 1]
    : null;

  /* URLs for navigation */
  const chapterUrl    = `/class-10/${subject}/${chapter}`;
  const prevTopicUrl  = prevTopic  ? `/class-10/${subject}/${chapter}/${prevTopic.id}` : null;
  const nextTopicUrl  = nextTopic  ? `/class-10/${subject}/${chapter}/${nextTopic.id}` : null;

  return (
    <TopicStudyClient
      topic={topicData}
      chapterData={chapterData}
      chapterUrl={chapterUrl}
      prevTopic={prevTopic ? { id: prevTopic.id, title: prevTopic.title, url: prevTopicUrl! } : null}
      nextTopic={nextTopic ? { id: nextTopic.id, title: nextTopic.title, url: nextTopicUrl! } : null}
      topicIndex={topicIndex}
    />
  );
}
