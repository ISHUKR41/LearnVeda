/**
 * FILE: index.ts
 * LOCATION: src/lib/curriculum/chapters/force-laws-of-motion/index.ts
 * PURPOSE: Barrel export file for the Force and Laws of Motion chapter module.
 *          Provides clean, single-import access to all chapter content, questions, and types.
 * USAGE: import { FORCE_AND_LAWS_CONTENT, FORCE_AND_LAWS_QUESTIONS } from '@/lib/curriculum/chapters/force-laws-of-motion';
 * LAST UPDATED: 2026-05-27
 */

/* ─── Re-export all TypeScript types ─── */
export type {
  Formula,
  RealWorldExample,
  KeyPoint,
  Subtopic,
  Topic,
  MCQOption,
  MCQ,
  WrittenQuestion,
  TopicQuestionBank,
  ChapterContent,
} from "./types";

/* ─── Re-export the chapter content data ─── */
export { FORCE_AND_LAWS_CONTENT } from "./content";

/* ─── Re-export the question bank data ─── */
export { FORCE_AND_LAWS_QUESTIONS } from "./questions";
