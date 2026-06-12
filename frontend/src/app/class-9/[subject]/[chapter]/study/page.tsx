/**
 * FILE: page.tsx
 * LOCATION: src/app/class-9/[subject]/[chapter]/study/page.tsx
 * PURPOSE: Server-side page route handler for the Chapter Study page.
 *          Resolves dynamic route segments ([subject]/[chapter]),
 *          loads the chapter content and question bank data,
 *          generates SEO metadata, and mounts the ChapterStudyClient.
 * ROUTE: /class-9/:subject/:chapter/study
 * EXAMPLE: /class-9/science/force-laws-of-motion/study
 * USED BY: Next.js App Router
 * DEPENDENCIES: ChapterStudyClient, chapter content modules
 * LAST UPDATED: 2026-05-27
 */

import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ChapterStudyClient from "./ChapterStudyClient";

/* ─── Import all available chapter content modules ─── */
import {
  FORCE_AND_LAWS_CONTENT,
  FORCE_AND_LAWS_QUESTIONS,
} from "@/lib/curriculum/chapters/force-laws-of-motion";

/* ─── Type for the dynamic route parameters ─── */
interface PageProps {
  params: Promise<{
    subject: string;
    chapter: string;
  }>;
}

/* ═══════════════════════════════════════════════
 * Chapter Content Registry — Maps URL slugs to
 * their content data and question banks.
 * Add new chapters here as they are created.
 * ═══════════════════════════════════════════════ */
const CHAPTER_REGISTRY: Record<
  string,
  {
    content: typeof FORCE_AND_LAWS_CONTENT;
    questions: typeof FORCE_AND_LAWS_QUESTIONS;
  }
> = {
  /* Force and Laws of Motion — Class 9 Science Chapter 9 */
  "force-laws-of-motion": {
    content: FORCE_AND_LAWS_CONTENT,
    questions: FORCE_AND_LAWS_QUESTIONS,
  },
  "force-and-laws-of-motion": {
    content: FORCE_AND_LAWS_CONTENT,
    questions: FORCE_AND_LAWS_QUESTIONS,
  },
  "force-and-laws": {
    content: FORCE_AND_LAWS_CONTENT,
    questions: FORCE_AND_LAWS_QUESTIONS,
  },
  /* ─── ADD MORE CHAPTERS HERE ─── */
  /* Example:
   * "motion": {
   *   content: MOTION_CONTENT,
   *   questions: MOTION_QUESTIONS,
   * },
   */
};

/* ═══════════════════════════════════════════════
 * generateMetadata — Dynamic SEO metadata based
 * on the chapter content. Called by Next.js at build/request time.
 * ═══════════════════════════════════════════════ */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const chapter = CHAPTER_REGISTRY[resolvedParams.chapter];

  /* If chapter doesn't exist in registry, return fallback metadata */
  if (!chapter) {
    return {
      title: "Chapter Study | LearnVeda",
      description:
        "Deep-dive into chapter concepts with interactive study material and question bank.",
    };
  }

  const { content } = chapter;
  const topicCount = content.topics.length;
  const subtopicCount = content.topics.reduce(
    (sum, t) => sum + t.subtopics.length,
    0
  );

  return {
    title: `${content.title} — ${content.classLevel} ${content.subject} Study | LearnVeda`,
    description: `${content.overview} Covers ${topicCount} topics and ${subtopicCount} subtopics with key formulas, real-world examples, and a 100-question bank. NCERT aligned.`,
    keywords: [
      content.title,
      content.classLevel,
      content.subject,
      "NCERT",
      "study notes",
      "question bank",
      "MCQ",
      "Newton's laws",
      "momentum",
      "force",
      "inertia",
    ],
    openGraph: {
      title: `${content.title} — Complete Study Guide | LearnVeda`,
      description: content.overview,
      type: "article",
    },
  };
}

/* ═══════════════════════════════════════════════
 * Page Component — Server Component that resolves
 * data and renders the client study engine.
 * ═══════════════════════════════════════════════ */
export default async function ChapterStudyPage({ params }: PageProps) {
  /* Look up the chapter in the registry using the URL slug */
  const resolvedParams = await params;
  const chapter = CHAPTER_REGISTRY[resolvedParams.chapter];

  /* If the chapter slug doesn't match any registered chapter, show 404 */
  if (!chapter) {
    notFound();
  }

  /* Construct the back navigation URL to the parent chapter page */
  const backUrl = `/class-9/${resolvedParams.subject}/${resolvedParams.chapter}`;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://learnveda.in";

  // 1. Dynamic Course Schema
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": `${chapter.content.title} — ${chapter.content.classLevel} ${chapter.content.subject}`,
    "description": chapter.content.overview,
    "provider": {
      "@type": "Organization",
      "name": "LearnVeda",
      "sameAs": baseUrl
    }
  };

  // 2. Dynamic FAQ Page Schema (sourced from topic 1's actual short answers)
  const firstTopicQuestions = chapter.questions[0];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": firstTopicQuestions
      ? firstTopicQuestions.shortAnswer.map((q) => ({
          "@type": "Question",
          "name": q.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": q.answer
          }
        }))
      : []
  };

  // 3. Dynamic Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": chapter.content.classLevel,
        "item": `${baseUrl}/class-9`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": chapter.content.subject,
        "item": `${baseUrl}/class-9/${resolvedParams.subject}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": chapter.content.title,
        "item": `${baseUrl}/class-9/${resolvedParams.subject}/${resolvedParams.chapter}`
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Study Material",
        "item": `${baseUrl}/class-9/${resolvedParams.subject}/${resolvedParams.chapter}/study`
      }
    ]
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0f" }}>
      {/* Dynamic structured data scripts parsed in the head immediately on fetch */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <ChapterStudyClient
        content={chapter.content}
        questions={chapter.questions}
        backUrl={backUrl}
      />
    </main>
  );
}
