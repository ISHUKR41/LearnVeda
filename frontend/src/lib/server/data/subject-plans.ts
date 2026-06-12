/**
 * FILE: subject-plans.ts
 * LOCATION: src/lib/server/data/subject-plans.ts
 * PURPOSE: Server-only curriculum aggregation helpers that combine route params,
 *          DB-backed subjects/chapters/questions, and local-only fallback catalogs.
 * USED BY: Class pages, subject pages, and chapter practice routes
 * LAST UPDATED: 2026-05-19
 */

import { CLASSES_SIMPLE } from "@/lib/constants";
import { sanitizeSlugSegment } from "@/lib/curriculum/subject-routing";
import {
  getEngineeringPlan,
  getSimpleClassPlan,
  getStreamClassPlan,
} from "@/lib/curriculum/learning-catalog";
import { shouldAllowStaticFallbackData } from "@/lib/server/env";
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
  chapterId: string;
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

/**
 * Returns track-level subject cards from PostgreSQL.
 *
 * Static fallback data is allowed only for local previews. In strict production
 * mode the function returns an empty list when the database cannot provide real
 * curriculum rows, making data issues visible to readiness checks and QA.
 */
export async function getTrackSubjects(track: "class-9" | "class-10"): Promise<TrackSubjectCard[]> {
  try {
    const subjects = await getSubjectsByTrack(track);
    if (subjects.length > 0) {
      return subjects.map((subject) => mapTrackSubjectCard(subject, track));
    }
  } catch {
    // Local fallback below; strict production must not hide DB failures.
  }

  if (!shouldAllowStaticFallbackData()) {
    return [];
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

/** Returns one subject plan from DB with local-only fallback curriculum data. */
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
    // Local fallback below; strict production must not hide DB failures.
  }

  if (!shouldAllowStaticFallbackData()) {
    return null;
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

/**
 * Generates dynamic, context-appropriate fallback questions for local previews
 * when the database does not contain pre-seeded questions for a chapter.
 *
 * FILE: subject-plans.ts
 * LOCATION: src/lib/server/data/subject-plans.ts
 * PURPOSE: Generate fallback questions for development/local testing.
 * USED BY: getChapterPracticeSnapshot
 */
function generateFallbackQuestionsForChapter(
  subjectName: string,
  chapterName: string,
): ChapterPracticeQuestion[] {
  const sub = subjectName.toLowerCase();

  if (sub.includes("math")) {
    return [
      {
        id: "fb-math-1",
        text: `Which of the following is a fundamental concept in ${chapterName}?`,
        difficulty: "easy",
        options: ["Rational definition", "Irrational derivation", "Axiomatic proof", "None of the above"],
        answer: "Axiomatic proof",
        explanation: `In ${chapterName}, establishing truth requires starting from basic axioms and using logical proof steps.`,
        points: 10,
        youtubeHintUrl: null,
      },
      {
        id: "fb-math-2",
        text: `Solve: If x + 5 = 12, what is the value of x?`,
        difficulty: "easy",
        options: ["5", "7", "12", "17"],
        answer: "7",
        explanation: "Subtracting 5 from both sides of the equation gives x = 12 - 5 = 7.",
        points: 10,
        youtubeHintUrl: null,
      },
      {
        id: "fb-math-3",
        text: "Which of these represents a prime number?",
        difficulty: "medium",
        options: ["9", "15", "17", "21"],
        answer: "17",
        explanation: "17 is only divisible by 1 and itself, making it a prime number. The others are composite numbers.",
        points: 20,
        youtubeHintUrl: null,
      },
      {
        id: "fb-math-4",
        text: `What is the primary formula used to solve standard problems in ${chapterName}?`,
        difficulty: "medium",
        options: ["Pythagorean theorem", "Quadratic formula", "Euclid's division lemma", "Depends on specific sub-topic"],
        answer: "Depends on specific sub-topic",
        explanation: "Different sections of this chapter focus on specialized geometric, algebraic, or numerical relations.",
        points: 20,
        youtubeHintUrl: null,
      },
      {
        id: "fb-math-5",
        text: "What type of number is Pi (π)?",
        difficulty: "hard",
        options: ["Integer", "Rational number", "Irrational number", "Whole number"],
        answer: "Irrational number",
        explanation: "Pi has a non-terminating, non-repeating decimal expansion, so it cannot be expressed as a simple fraction.",
        points: 35,
        youtubeHintUrl: null,
      },
    ];
  }

  if (sub.includes("science") || sub.includes("physics") || sub.includes("chemistry") || sub.includes("biology")) {
    return [
      {
        id: "fb-sci-1",
        text: `Which of the following is the SI unit of measurement related to ${chapterName}?`,
        difficulty: "easy",
        options: ["Joule", "Newton", "Kelvin", "Depends on physical quantity"],
        answer: "Depends on physical quantity",
        explanation: `Depending on which concept of ${chapterName} is being measured, the unit can be for force, energy, temperature, or mass.`,
        points: 10,
        youtubeHintUrl: null,
      },
      {
        id: "fb-sci-2",
        text: "What is the smallest unit of matter that retains all chemical properties of an element?",
        difficulty: "easy",
        options: ["Molecule", "Atom", "Electron", "Proton"],
        answer: "Atom",
        explanation: "An atom is the basic building block of chemistry and the smallest unit of an element that retains its identity.",
        points: 10,
        youtubeHintUrl: null,
      },
      {
        id: "fb-sci-3",
        text: "What state of matter has a definite volume but no definite shape?",
        difficulty: "medium",
        options: ["Solid", "Liquid", "Gas", "Plasma"],
        answer: "Liquid",
        explanation: "Liquids flow and take the shape of their container, but they maintain a constant volume regardless of shape.",
        points: 20,
        youtubeHintUrl: null,
      },
      {
        id: "fb-sci-4",
        text: `What is a core observation when conducting experiments in ${chapterName}?`,
        difficulty: "medium",
        options: ["Mass is always lost", "Conservation principles hold true", "Temperature stays perfectly constant", "Reactions always produce light"],
        answer: "Conservation principles hold true",
        explanation: "Fundamental laws of physics and chemistry dictate that energy, momentum, and mass are conserved in closed systems.",
        points: 20,
        youtubeHintUrl: null,
      },
      {
        id: "fb-sci-5",
        text: "Which cell organelle is known as the powerhouse of the cell?",
        difficulty: "hard",
        options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi apparatus"],
        answer: "Mitochondria",
        explanation: "Mitochondria generate most of the chemical energy (ATP) needed to power the cell's biochemical reactions.",
        points: 35,
        youtubeHintUrl: null,
      },
    ];
  }

  if (sub.includes("computer") || sub.includes("code") || sub.includes("python") || sub.includes("application")) {
    return [
      {
        id: "fb-comp-1",
        text: "Which of the following is a valid variable name in programming languages?",
        difficulty: "easy",
        options: ["2myVar", "_my_var", "my-var", "class"],
        answer: "_my_var",
        explanation: "Identifiers cannot start with a digit, cannot contain hyphens, and cannot use reserved keywords like 'class'. They can start with underscores.",
        points: 10,
        youtubeHintUrl: null,
      },
      {
        id: "fb-comp-2",
        text: "What is the correct tag for inserting a line break in HTML?",
        difficulty: "easy",
        options: ["<break>", "<lb>", "<br>", "<next>"],
        answer: "<br>",
        explanation: "The <br> tag is an empty tag used to insert a single line break in HTML documents.",
        points: 10,
        youtubeHintUrl: null,
      },
      {
        id: "fb-comp-3",
        text: "Which data structure follows the Last-In-First-Out (LIFO) principle?",
        difficulty: "medium",
        options: ["Queue", "Stack", "Linked List", "Tree"],
        answer: "Stack",
        explanation: "A stack is a linear data structure where elements are added and removed from the same end (LIFO).",
        points: 20,
        youtubeHintUrl: null,
      },
      {
        id: "fb-comp-4",
        text: `What is the main security risk associated with ${chapterName} processes?`,
        difficulty: "medium",
        options: ["Malware injection", "Data loss", "Identity theft", "All of the above"],
        answer: "All of the above",
        explanation: "Modern computer networks and operations face threats including malicious software, physical storage faults, and phishing.",
        points: 20,
        youtubeHintUrl: null,
      },
      {
        id: "fb-comp-5",
        text: "What is the time complexity of searching in a balanced binary search tree?",
        difficulty: "hard",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        answer: "O(log n)",
        explanation: "In a balanced BST, each step divides the search space in half, resulting in logarithmic time complexity O(log n).",
        points: 35,
        youtubeHintUrl: null,
      },
    ];
  }

  // Generic/fallback questions for English, Social Science, Hindi, or general streams
  return [
    {
      id: "fb-gen-1",
      text: `Which option best summarizes the core theme of ${chapterName}?`,
      difficulty: "easy",
      options: ["Historical evolution", "Grammatical syntax", "Structural analysis", "Context-dependent theory"],
      answer: "Context-dependent theory",
      explanation: `Studying ${chapterName} requires understanding the specific contextual settings, terminology, and definitions.`,
      points: 10,
      youtubeHintUrl: null,
    },
    {
      id: "fb-gen-2",
      text: "Which of the following is a synonym of the word 'diligent'?",
      difficulty: "easy",
      options: ["Lazy", "Careful", "Hardworking", "Sloppy"],
      answer: "Hardworking",
      explanation: "Diligent means showing care and conscientiousness in one's work or duties, which is synonymous with hardworking.",
      points: 10,
      youtubeHintUrl: null,
    },
    {
      id: "fb-gen-3",
      text: `What is a primary objective when studying modules in ${subjectName}?`,
      difficulty: "medium",
      options: ["Memorizing dates blindly", "Rote learning definitions", "Developing critical thinking and analytical analysis", "Passing exams with minimum effort"],
      answer: "Developing critical thinking and analytical analysis",
      explanation: "Learnova focuses on building conceptual clarity and analytical logic rather than mechanical memorization.",
      points: 20,
      youtubeHintUrl: null,
    },
    {
      id: "fb-gen-4",
      text: "Which of these is considered a secondary source in historical research?",
      difficulty: "medium",
      options: ["A diary written during the event", "A biography written 50 years later", "An official treaty document", "A photograph of the event"],
      answer: "A biography written 50 years later",
      explanation: "Secondary sources interpret, analyze, or synthesize primary sources. A biography written later is a secondary source.",
      points: 20,
      youtubeHintUrl: null,
    },
    {
      id: "fb-gen-5",
      text: "What is the main benefit of structured revision plans?",
      difficulty: "hard",
      options: ["They eliminate the need to study", "They guarantee 100% marks without effort", "They optimize memory recall and reduce exam anxiety", "They make quizzes completely optional"],
      answer: "They optimize memory recall and reduce exam anxiety",
      explanation: "Spaced repetition and structured review have been scientifically proven to build long-term retention and confidence.",
      points: 35,
      youtubeHintUrl: null,
    },
  ];
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
      let questions = mapQuestions(await getQuestionsByChapterSlug(subjectSlug, chapter.slug, 40));
      if (questions.length === 0 && shouldAllowStaticFallbackData()) {
        questions = generateFallbackQuestionsForChapter(subject.name, chapter.name);
      }
      return {
        chapterId: chapter.id,
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
    // Local fallback below; strict production must not hide DB failures.
  }

  if (!shouldAllowStaticFallbackData()) {
    return null;
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
    chapterId: fallbackChapter.slug,
    subjectName: fallbackPlan.title,
    chapterName: fallbackChapter.name,
    chapterDescription: fallbackChapter.description,
    chapterDifficulty: fallbackChapter.difficulty,
    chapterDays: fallbackChapter.dayCount,
    chapterQuestionCount: fallbackChapter.questionCount,
    questions: generateFallbackQuestionsForChapter(fallbackPlan.title, fallbackChapter.name),
  };
}

/** Engineering plans still use the static curated catalog in this release. */
export function getEngineeringPlanSnapshot(slug: string) {
  return getEngineeringPlan(slug);
}
