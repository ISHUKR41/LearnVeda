/**
 * FILE: subject-plans.ts
 * LOCATION: src/lib/server/data/subject-plans.ts
 * PURPOSE: Server-only curriculum aggregation helpers that combine route params,
 *          DB-backed subjects/chapters/questions, and static fallback catalogs.
 * USED BY: Class pages, subject pages, and chapter practice routes
 * LAST UPDATED: 2026-05-18
 */

import { CLASSES_SIMPLE } from "@/lib/constants";
import { sanitizeSlugSegment } from "@/lib/curriculum/subject-routing";
import {
  getEngineeringPlan,
  getSimpleClassPlan,
  getStreamClassPlan,
} from "@/lib/curriculum/learning-catalog";
import type {
  CurriculumQuestion,
  CurriculumSubject,
} from "@/lib/server/repositories/curriculum-repository";
import {
  getChapterBySlug,
  getChaptersBySubjectSlug,
  getQuestionsByChapterSlug,
  getSubjectBySlug,
  getSubjectsByTrack,
} from "@/lib/server/repositories/curriculum-repository";

type SupportedTrack = "class-9" | "class-10" | "class-11" | "class-12";

export interface SubjectPlanChapter {
  slug: string;
  name: string;
  description: string;
  dayCount: number;
  questionCount: number;
  difficulty: "easy" | "medium" | "hard";
}

export interface SubjectPlanSnapshot {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  durationDays: number;
  accent: string;
  iconName: string;
  backHref: string;
  chapterHrefBase: string;
  chapters: SubjectPlanChapter[];
}

export interface TrackSubjectCard {
  id: string;
  name: string;
  description: string;
  chapterCount: number;
  iconName: string;
}

export interface ChapterPracticeQuestion {
  id: string;
  text: string;
  difficulty: "easy" | "medium" | "hard";
  options: string[];
  answer: string;
  explanation: string;
  points: number;
  youtubeHintUrl: string | null;
}

export interface ChapterPracticeSnapshot {
  subjectName: string;
  chapterName: string;
  chapterDescription: string;
  chapterDifficulty: "easy" | "medium" | "hard";
  chapterDays: number;
  chapterQuestionCount: number;
  questions: ChapterPracticeQuestion[];
}

/** Converts free-form chapter names into stable URL slugs for fallback plans. */
function slugifyChapterName(value: string): string {
  return sanitizeSlugSegment(value);
}

/** Builds the canonical DB subject slug from route params. */
export function buildSubjectSlug(
  track: SupportedTrack,
  subject: string,
  stream?: string,
): string {
  if ((track === "class-11" || track === "class-12") && stream) {
    return `${track}-${sanitizeSlugSegment(stream)}-${sanitizeSlugSegment(subject)}`;
  }

  return `${track}-${sanitizeSlugSegment(subject)}`;
}

/** Converts repository chapter rows into UI-friendly chapter cards. */
function mapSubjectChapters(rows: Awaited<ReturnType<typeof getChaptersBySubjectSlug>>): SubjectPlanChapter[] {
  return rows.map((chapter) => ({
    slug: chapter.slug,
    name: chapter.name,
    description: chapter.description ?? "Chapter goals and practice checkpoints.",
    dayCount: chapter.day_count,
    questionCount: chapter.question_count,
    difficulty: chapter.difficulty,
  }));
}

type FallbackChapterItem = string | {
  slug: string;
  name: string;
  description?: string;
  dayCount?: number;
  questionCount?: number;
  difficulty?: "easy" | "medium" | "hard";
};

/** Maps static learning-plan chapter strings to structured chapter cards. */
function buildFallbackChapters(chapters: FallbackChapterItem[], totalDays: number): SubjectPlanChapter[] {
  const daysPerChapter = Math.max(1, Math.round(totalDays / Math.max(chapters.length, 1)));
  return chapters.map((item, index) => {
    if (typeof item === "string") {
      return {
        slug: slugifyChapterName(item),
        name: item,
        description: "Structured concept notes, solved examples, and adaptive practice questions.",
        dayCount: index === 0 ? daysPerChapter + 1 : daysPerChapter,
        questionCount: 15,
        difficulty: index < 2 ? "easy" : index > chapters.length - 3 ? "hard" : "medium",
      };
    }
    return {
      slug: item.slug || slugifyChapterName(item.name),
      name: item.name,
      description: item.description ?? "Structured concept notes, solved examples, and adaptive practice questions.",
      dayCount: item.dayCount ?? (index === 0 ? daysPerChapter + 1 : daysPerChapter),
      questionCount: item.questionCount ?? 15,
      difficulty: item.difficulty ?? (index < 2 ? "easy" : index > chapters.length - 3 ? "hard" : "medium"),
    };
  });
}

/** Creates a typed fallback for classes when DB records are not reachable yet. */
function buildFallbackClassPlan(
  track: SupportedTrack,
  subject: string,
  stream?: string,
): SubjectPlanSnapshot | null {
  const staticPlan = track === "class-9" || track === "class-10"
    ? getSimpleClassPlan(track, subject)
    : getStreamClassPlan(track, stream ?? "", subject);

  if (!staticPlan) {
    return null;
  }

  const chapterHrefBase = track === "class-11" || track === "class-12"
    ? `/${track}/${sanitizeSlugSegment(stream ?? "")}/${sanitizeSlugSegment(subject)}`
    : `/${track}/${sanitizeSlugSegment(subject)}`;

  return {
    slug: buildSubjectSlug(track, subject, stream),
    title: staticPlan.title,
    eyebrow: staticPlan.eyebrow,
    description: staticPlan.description,
    durationDays: staticPlan.durationDays,
    accent: staticPlan.accent,
    iconName: "BookOpen",
    backHref: staticPlan.backHref,
    chapterHrefBase,
    chapters: buildFallbackChapters(staticPlan.chapters, staticPlan.durationDays),
  };
}

/** Converts DB subject metadata to a compact landing-card structure. */
function mapTrackSubjectCard(subject: CurriculumSubject, track: SupportedTrack): TrackSubjectCard {
  const withoutTrackPrefix = subject.slug.startsWith(`${track}-`)
    ? subject.slug.slice(`${track}-`.length)
    : subject.slug;
  const routeId = subject.stream
    ? withoutTrackPrefix.replace(`${subject.stream}-`, "")
    : withoutTrackPrefix;

  return {
    id: routeId,
    name: subject.name,
    description: subject.description ?? "Structured study plan with chapter practice and progress tracking.",
    chapterCount: subject.chapter_count,
    iconName: subject.icon,
  };
}

/** Returns track-level subject cards from DB with safe static fallback. */
export async function getTrackSubjects(track: "class-9" | "class-10"): Promise<TrackSubjectCard[]> {
  try {
    const subjects = await getSubjectsByTrack(track);
    if (subjects.length > 0) {
      return subjects.map((subject) => mapTrackSubjectCard(subject, track));
    }
  } catch {
    // Fallback below.
  }

  const fallback = CLASSES_SIMPLE.find((item) => item.id === track);
  return (fallback?.subjects ?? []).map((subject) => ({
    id: subject.id,
    name: subject.name,
    description: "Chapter-wise lessons, tests, and revision checkpoints.",
    chapterCount: subject.chapters,
    iconName: "BookOpen",
  }));
}

/** Returns one subject plan from DB and falls back to static curriculum data. */
export async function getSubjectPlanForRoute(input: {
  track: SupportedTrack;
  subject: string;
  stream?: string;
}): Promise<SubjectPlanSnapshot | null> {
  const subjectSlug = buildSubjectSlug(input.track, input.subject, input.stream);

  try {
    const subject = await getSubjectBySlug(subjectSlug);
    if (subject) {
      const chapters = mapSubjectChapters(await getChaptersBySubjectSlug(subjectSlug));
      const durationDays = chapters.reduce((total, chapter) => total + chapter.dayCount, 0);
      const chapterHrefBase = input.track === "class-11" || input.track === "class-12"
        ? `/${input.track}/${sanitizeSlugSegment(input.stream ?? "")}/${sanitizeSlugSegment(input.subject)}`
        : `/${input.track}/${sanitizeSlugSegment(input.subject)}`;

      return {
        slug: subjectSlug,
        title: subject.name,
        eyebrow: input.track === "class-11" || input.track === "class-12"
          ? `${input.track.replace("-", " ").toUpperCase()} · ${(subject.stream ?? "").toUpperCase()}`
          : input.track.replace("-", " ").toUpperCase(),
        description: subject.description ?? "Complete this chapter path with daily practice and milestone tests.",
        durationDays: Math.max(durationDays, subject.chapter_count * 5),
        accent: subject.color || "#2563EB",
        iconName: subject.icon || "BookOpen",
        backHref: `/${input.track}`,
        chapterHrefBase,
        chapters,
      };
    }
  } catch {
    // Fallback below.
  }

  return buildFallbackClassPlan(input.track, input.subject, input.stream);
}

/** Converts DB question rows into safe client payloads. */
function mapQuestions(rows: CurriculumQuestion[]): ChapterPracticeQuestion[] {
  return rows.map((question) => {
    const rawOptions = Array.isArray(question.options)
      ? question.options
      : [];
    const options = rawOptions
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);

    return {
      id: question.id,
      text: question.question_text,
      difficulty: question.difficulty,
      options,
      answer: question.correct_answer,
      explanation: question.explanation ?? "Review the concept and retry this question.",
      points: question.points_value,
      youtubeHintUrl: question.youtube_hint_url,
    };
  });
}

/** Returns chapter practice content with DB-first and static fallback behavior. */
export async function getChapterPracticeSnapshot(input: {
  track: SupportedTrack;
  subject: string;
  chapter: string;
  stream?: string;
}): Promise<ChapterPracticeSnapshot | null> {
  const subjectSlug = buildSubjectSlug(input.track, input.subject, input.stream);

  try {
    const subject = await getSubjectBySlug(subjectSlug);
    const chapter = await getChapterBySlug(subjectSlug, sanitizeSlugSegment(input.chapter));
    if (subject && chapter) {
      const questions = mapQuestions(await getQuestionsByChapterSlug(subjectSlug, chapter.slug, 40));
      return {
        subjectName: subject.name,
        chapterName: chapter.name,
        chapterDescription: chapter.description ?? "Practice this chapter with curated concept-based questions.",
        chapterDifficulty: chapter.difficulty,
        chapterDays: chapter.day_count,
        chapterQuestionCount: chapter.question_count,
        questions,
      };
    }
  } catch {
    // Fallback below.
  }

  const fallbackPlan = await getSubjectPlanForRoute({
    track: input.track,
    stream: input.stream,
    subject: input.subject,
  });
  const fallbackChapter = fallbackPlan?.chapters.find((chapter) => chapter.slug === sanitizeSlugSegment(input.chapter));

  if (!fallbackPlan || !fallbackChapter) {
    return null;
  }

  return {
    subjectName: fallbackPlan.title,
    chapterName: fallbackChapter.name,
    chapterDescription: fallbackChapter.description,
    chapterDifficulty: fallbackChapter.difficulty,
    chapterDays: fallbackChapter.dayCount,
    chapterQuestionCount: fallbackChapter.questionCount,
    questions: [],
  };
}

/** Engineering plans still use the static curated catalog in this release. */
export function getEngineeringPlanSnapshot(slug: string) {
  return getEngineeringPlan(slug);
}

