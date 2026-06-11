/**
 * FILE: shared-types.ts
 * LOCATION: src/lib/content/class10/science/shared-types.ts
 * PURPOSE: Shared TypeScript interfaces for ALL Class 10 Science chapter content.
 *          Every chapter imports Question, Topic, and Chapter from this single source of truth.
 *          Keeping types centralised prevents drift between chapter modules.
 * USED BY: Every chapter content folder under class10/science/
 * LAST UPDATED: 2026-06-08
 */

/** Difficulty level for a chapter or topic */
export type Difficulty = "easy" | "medium" | "hard";

/** Four question categories — each with a distinct point value and UI style */
export type QuestionType = "mcq" | "short" | "long" | "thinking";

/**
 * A single practice question.
 * • MCQ  — has `options` array; `correctAnswer` matches one option exactly.
 * • short / long / thinking — no options; `correctAnswer` is a model answer.
 */
export interface Question {
  /** Unique question ID, scoped to its chapter (e.g. "t1q3", "t2q17") */
  id: string;
  /** Category determines UI rendering and default point value */
  type: QuestionType;
  /** The question text — supports basic markdown (*bold*, _italic_, `code`) */
  question: string;
  /** Only present for MCQ — 4 answer choices the student selects from */
  options?: string[];
  /** The correct answer text — for MCQ must exactly match one option string */
  correctAnswer: string;
  /** Explanation shown after the answer is revealed (optional for long/short/thinking types) */
  explanation?: string;
  /** Points awarded for correct answer (MCQ=10, short=15, long=20, HOTS=25) */
  points: number;
}

/**
 * A single subtopic within a chapter.
 * Each topic has:
 *  – Rich markdown content (explanation, examples, diagrams-as-text)
 *  – Exactly 20 questions: 5 MCQ + 5 short + 5 long + 5 HOTS
 */
export interface Topic {
  /** URL-safe slug used in the focused-study route (e.g. "states-of-matter") */
  id: string;
  /** Human-readable title shown in sidebar and header (e.g. "1. States of Matter") */
  title: string;
  /**
   * Full topic explanation in markdown.
   * Use ### for h3, #### for h4, **bold**, *italic*, > blockquote, $math$,
   * bullet lists (* item) and ordered lists (1. item).
   */
  content: string;
  /** Questions — MCQ + short + long + HOTS */
  questions: Question[];
  /** Estimated student reading + practice time in minutes */
  estimatedMinutes?: number;
  /** Cover image URL (Unsplash) shown in focused-study mode */
  imageUrl?: string;
  /** Array of simulation component IDs to render alongside this topic */
  simulationIds?: string[];
  /** Flash card data for quick revision — front/back pairs */
  flashCards?: { id: string; front: string; back: string }[];
  /** Mind map tree data for concept visualization */
  mindMap?: { id: string; label: string; children?: any[] }[];
}

/**
 * A complete chapter — the top-level content unit for one NCERT chapter.
 * Exported from each chapter's index.ts and registered in chapter-registry.ts.
 */
export interface Chapter {
  /** URL-safe slug — must match the catalog slug (e.g. "light-reflection-and-refraction") */
  id: string;
  /** Display title shown in the header */
  title: string;
  /** Parent subject name (e.g. "Science") */
  subject: string;
  /** Class level (e.g. "Class 10") */
  class: string;
  /** NCERT chapter number */
  chapterNumber?: number;
  /** All subtopics for this chapter */
  topics: Topic[];
}
