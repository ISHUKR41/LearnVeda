/**
 * FILE: platform-summary.ts
 * LOCATION: src/lib/server/data/platform-summary.ts
 * PURPOSE: Computes homepage-ready platform summary numbers from PostgreSQL.
 *          Local development can use documented fallback numbers before a
 *          database is connected, but strict production never silently replaces
 *          database counters with marketing/demo values.
 * USED BY: Home page server component and /api/platform/summary endpoint
 * LAST UPDATED: 2026-05-19
 */

import { CLASSES_SIMPLE, ENGINEERING_LANGUAGES } from "@/lib/constants";
import { shouldAllowStaticFallbackData } from "@/lib/server/env";
import { getCurriculumSummaryCounts } from "@/lib/server/repositories/curriculum-repository";

export interface PlatformSummarySnapshot {
  students: number;
  subjects: number;
  chapters: number;
  languages: number;
  questions: number;
}

/** Local-only fallback that keeps preview pages stable before DB bootstrapping. */
const FALLBACK_SUMMARY: PlatformSummarySnapshot = {
  students: 100,
  subjects: CLASSES_SIMPLE.reduce((total, item) => total + item.subjects.length, 0) + ENGINEERING_LANGUAGES.length,
  chapters: CLASSES_SIMPLE.reduce(
    (total, item) => total + item.subjects.reduce((subjectTotal, subject) => subjectTotal + subject.chapters, 0),
    0,
  ),
  languages: ENGINEERING_LANGUAGES.length,
  questions: 500,
};

/** Builds a neutral empty snapshot when strict production data is unavailable. */
function emptySummary(): PlatformSummarySnapshot {
  return {
    students: 0,
    subjects: 0,
    chapters: 0,
    languages: ENGINEERING_LANGUAGES.length,
    questions: 0,
  };
}

/**
 * Returns PostgreSQL counters for production surfaces.
 *
 * In local development the app may use fallback counters so designers can
 * preview pages without first bootstrapping PostgreSQL. In strict production,
 * the same failure returns zeros instead of pretending unavailable data is
 * real platform activity.
 */
export async function getPlatformSummarySnapshot(): Promise<PlatformSummarySnapshot> {
  const allowFallback = shouldAllowStaticFallbackData();

  try {
    const counts = await getCurriculumSummaryCounts();

    if (counts.subject_count === 0 && counts.chapter_count === 0 && counts.question_count === 0) {
      return allowFallback ? FALLBACK_SUMMARY : emptySummary();
    }

    return {
      students: allowFallback ? Math.max(counts.user_count, FALLBACK_SUMMARY.students) : counts.user_count,
      subjects: allowFallback ? Math.max(counts.subject_count, FALLBACK_SUMMARY.subjects) : counts.subject_count,
      chapters: allowFallback ? Math.max(counts.chapter_count, FALLBACK_SUMMARY.chapters) : counts.chapter_count,
      languages: ENGINEERING_LANGUAGES.length,
      questions: allowFallback ? Math.max(counts.question_count, FALLBACK_SUMMARY.questions) : counts.question_count,
    };
  } catch {
    return allowFallback ? FALLBACK_SUMMARY : emptySummary();
  }
}
