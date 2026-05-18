/**
 * FILE: platform-summary.ts
 * LOCATION: src/lib/server/data/platform-summary.ts
 * PURPOSE: Computes homepage-ready platform summary numbers from PostgreSQL with
 *          safe static fallbacks when the database is not reachable yet.
 * USED BY: Home page server component and /api/platform/summary endpoint
 * LAST UPDATED: 2026-05-18
 */

import { CLASSES_SIMPLE, ENGINEERING_LANGUAGES } from "@/lib/constants";
import { getCurriculumSummaryCounts } from "@/lib/server/repositories/curriculum-repository";

export interface PlatformSummarySnapshot {
  students: number;
  subjects: number;
  chapters: number;
  languages: number;
  questions: number;
}

/** Static fallback that keeps the homepage stable before DB bootstrapping. */
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

/** Returns production counters while preserving a useful fallback in local setups. */
export async function getPlatformSummarySnapshot(): Promise<PlatformSummarySnapshot> {
  try {
    const counts = await getCurriculumSummaryCounts();

    if (counts.subject_count === 0 && counts.chapter_count === 0 && counts.question_count === 0) {
      return FALLBACK_SUMMARY;
    }

    return {
      students: Math.max(counts.user_count, FALLBACK_SUMMARY.students),
      subjects: Math.max(counts.subject_count, FALLBACK_SUMMARY.subjects),
      chapters: Math.max(counts.chapter_count, FALLBACK_SUMMARY.chapters),
      languages: ENGINEERING_LANGUAGES.length,
      questions: Math.max(counts.question_count, FALLBACK_SUMMARY.questions),
    };
  } catch {
    return FALLBACK_SUMMARY;
  }
}

