/**
 * FILE: types.ts
 * LOCATION: src/lib/curriculum/chapters/force-laws-of-motion/types.ts
 * PURPOSE: TypeScript interfaces for the Force and Laws of Motion chapter content.
 *          These types define the shape of every topic, subtopic, question,
 *          and formula used in the chapter study pages and question banks.
 * USED BY: content.ts, questions.ts, ChapterStudyClient.tsx
 * DEPENDENCIES: None (pure type definitions)
 * LAST UPDATED: 2026-05-27
 */

/* ─────────────────────────────────────────────
 * Formula — A physics formula with its name,
 * LaTeX-style expression, description, and
 * the meaning of each variable.
 * ───────────────────────────────────────────── */
export interface Formula {
  /** Human-readable name, e.g. "Newton's Second Law" */
  name: string;
  /** The formula expression, e.g. "F = m × a" */
  expression: string;
  /** Plain English description of what this formula calculates */
  description: string;
  /** Map of variable symbol → meaning, e.g. { "F": "Force in Newtons" } */
  variables: Record<string, string>;
}

/* ─────────────────────────────────────────────
 * RealWorldExample — A concrete scenario from
 * everyday life that demonstrates a physics concept.
 * ───────────────────────────────────────────── */
export interface RealWorldExample {
  /** Short title for the example, e.g. "Kicking a Football" */
  title: string;
  /** Detailed explanation connecting the concept to this example */
  explanation: string;
}

/* ─────────────────────────────────────────────
 * KeyPoint — A single important fact or concept
 * that students must remember for exams.
 * ───────────────────────────────────────────── */
export interface KeyPoint {
  /** The core statement, e.g. "Force is a vector quantity" */
  point: string;
  /** Optional elaboration explaining why this matters */
  detail?: string;
}

export interface Illustration {
  url: string;
  caption: string;
}

/* ─────────────────────────────────────────────
 * Subtopic — A detailed subsection within a main
 * topic, containing the actual teaching content.
 * ───────────────────────────────────────────── */
export interface Subtopic {
  /** Unique identifier within the topic, e.g. "1.1" */
  id: string;
  /** Display title, e.g. "The Fundamental Concept of Force" */
  title: string;
  /** Full teaching content in plain English — from basic to advanced */
  content: string;
  /** Important facts students should highlight and memorize */
  keyPoints: KeyPoint[];
  /** Relevant formulas introduced in this subtopic (if any) */
  formulas?: Formula[];
  /** Real-world scenarios that illustrate the subtopic */
  examples: RealWorldExample[];
  /** Optional premium visual diagram/illustration for the subtopic */
  illustration?: Illustration;
}

/* ─────────────────────────────────────────────
 * Topic — A major section of the chapter.
 * Contains multiple subtopics and a summary.
 * ───────────────────────────────────────────── */
export interface Topic {
  /** Numeric identifier, e.g. 1, 2, 3 */
  id: number;
  /** Display title, e.g. "Force and Its Real-World Interactions" */
  title: string;
  /** Short paragraph summarizing what this topic covers */
  summary: string;
  /** Ordered list of subtopics within this topic */
  subtopics: Subtopic[];
}

/* ─────────────────────────────────────────────
 * MCQOption — A single option in a multiple-choice question.
 * ───────────────────────────────────────────── */
export interface MCQOption {
  /** Option label: "a", "b", "c", or "d" */
  label: string;
  /** The text content of this option */
  text: string;
}

/* ─────────────────────────────────────────────
 * MCQ — A multiple-choice question with 4 options,
 * a correct answer label, and a detailed explanation.
 * ───────────────────────────────────────────── */
export interface MCQ {
  /** The question text */
  question: string;
  /** Array of exactly 4 options */
  options: MCQOption[];
  /** The label of the correct option: "a", "b", "c", or "d" */
  correctAnswer: string;
  /** Detailed explanation of why this answer is correct */
  explanation: string;
}

/* ─────────────────────────────────────────────
 * WrittenQuestion — A short answer, long answer,
 * or thinking question with a detailed model answer.
 * ───────────────────────────────────────────── */
export interface WrittenQuestion {
  /** The question text */
  question: string;
  /** The complete model answer */
  answer: string;
  /** Difficulty level for display */
  difficulty: "easy" | "medium" | "hard";
}

/* ─────────────────────────────────────────────
 * TopicQuestionBank — All question types for a
 * single topic, grouped by category.
 * ───────────────────────────────────────────── */
export interface TopicQuestionBank {
  /** Which topic ID (1–5) this bank belongs to */
  topicId: number;
  /** The topic title for display headers */
  topicTitle: string;
  /** 5 MCQs for this topic */
  mcqs: MCQ[];
  /** 5 short answer questions (2–3 sentences each) */
  shortAnswer: WrittenQuestion[];
  /** 5 long answer questions (paragraph-length answers) */
  longAnswer: WrittenQuestion[];
  /** 5 higher-order thinking questions */
  thinkingQuestions: WrittenQuestion[];
}

/* ─────────────────────────────────────────────
 * ChapterContent — The root data structure holding
 * the entire chapter's content and metadata.
 * ───────────────────────────────────────────── */
export interface ChapterContent {
  /** URL-safe slug matching the cbse-catalog entry */
  slug: string;
  /** Display title */
  title: string;
  /** Class and subject context */
  classLevel: string;
  subject: string;
  /** Chapter number in the NCERT textbook */
  chapterNumber: number;
  /** Estimated total study time in hours */
  estimatedHours: number;
  /** Difficulty rating for the overall chapter */
  difficulty: "easy" | "medium" | "hard";
  /** Brief 1–2 sentence overview of the chapter */
  overview: string;
  /** All 5 topics with their subtopics */
  topics: Topic[];
}
