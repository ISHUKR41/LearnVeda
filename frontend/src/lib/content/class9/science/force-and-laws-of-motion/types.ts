/* ─────────────────────────────────────────────
 * Type Definitions
 * These interfaces define the shape of the content data.
 * ───────────────────────────────────────────── */

/** A single question with its answer and explanation */
export interface Question {
  /** Unique identifier for the question (e.g., "q1", "q2") */
  id: string;
  /** Question category — determines UI rendering and point value */
  type: 'mcq' | 'short' | 'long' | 'thinking';
  /** The question text (supports basic markdown) */
  question: string;
  /** MCQ options — only present when type === 'mcq' */
  options?: string[];
  /** The correct answer text */
  correctAnswer: string;
  /** Detailed explanation of why this answer is correct */
  explanation: string;
  /** Points awarded for a correct answer */
  points: number;
}

/** A single topic/subtopic within a chapter */
export interface Topic {
  /** Unique slug identifier (e.g., "balanced-unbalanced-forces") */
  id: string;
  /** Human-readable title with numbering */
  title: string;
  /** Markdown-formatted deep explanation — basic to advanced */
  content: string;
  /** Array of 20 questions (5 MCQ + 5 Short + 5 Long + 5 Thinking) */
  questions: Question[];
  /** Estimated reading time in minutes */
  estimatedMinutes?: number;
  /** Cover image URL for this topic */
  imageUrl?: string;
}

/** A complete chapter with all its topics */
export interface Chapter {
  /** URL-safe slug (e.g., "force-and-laws-of-motion") */
  id: string;
  /** Display title */
  title: string;
  /** Parent subject name */
  subject: string;
  /** Class level */
  class: string;
  /** All subtopics in this chapter */
  topics: Topic[];
}

/* ─────────────────────────────────────────────
 * CHAPTER DATA: Force & Laws of Motion
 * Class 9 Science — NCERT Chapter 9
 * ───────────────────────────────────────────── */

