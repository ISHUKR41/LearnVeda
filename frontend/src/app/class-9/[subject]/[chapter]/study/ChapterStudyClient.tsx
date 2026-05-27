/**
 * FILE: ChapterStudyClient.tsx
 * LOCATION: src/app/class-9/[subject]/[chapter]/study/ChapterStudyClient.tsx
 * PURPOSE: Interactive client-side study engine for Class 9 chapter content.
 *          Renders a two-panel layout: sidebar topic navigation + main content reader.
 *          Supports two major tabs: "Study Material" and "Question Bank."
 *          The Study tab shows topic/subtopic content with key points, formulas, examples.
 *          The Question Bank tab provides interactive MCQs and written questions with answers.
 * USED BY: src/app/class-9/[subject]/[chapter]/study/page.tsx
 * DEPENDENCIES: React, Next.js Link, CSS Modules, chapter content data
 * LAST UPDATED: 2026-05-27
 */

"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import styles from "./ChapterStudy.module.css";
import type {
  ChapterContent,
  TopicQuestionBank,
  Topic,
  Subtopic,
  MCQ,
  WrittenQuestion,
} from "@/lib/curriculum/chapters/force-laws-of-motion/types";

/* ─────────────────────────────────────────────
 * Component Props — Data injected by the server page.
 * ───────────────────────────────────────────── */
interface ChapterStudyClientProps {
  /** Full chapter content data (topics, subtopics, formulas, examples) */
  content: ChapterContent;
  /** Full question bank array (one per topic) */
  questions: TopicQuestionBank[];
  /** URL to navigate back to the chapter's parent page */
  backUrl: string;
}

/**
 * Synthesizes standard success/failure chime sound effects using Web Audio API.
 * This guarantees audio works instantly without needing static audio asset files.
 */
function playSound(type: "correct" | "wrong") {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === "correct") {
      // Correct ding: C5 (523Hz) then E5 (659Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";

      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else {
      // Wrong buzz: Sawtooth wave sliding down from 160Hz to 90Hz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";

      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }
  } catch (err) {
    console.warn("Could not play synthesized sound effect:", err);
  }
}

/* ═══════════════════════════════════════════════
 * MCQInteractive — Interactive MCQ card with selection,
 * submission, answer reveal, and explanation display.
 * ═══════════════════════════════════════════════ */
function MCQInteractive({ mcq, index }: { mcq: MCQ; index: number }) {
  /* Track selected option, submission state, and whether to show the answer */
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  /** Handle option selection (only before submission) */
  const handleSelect = (label: string) => {
    if (submitted) return;
    setSelected(label);
  };

  /** Submit the selected answer and evaluate correctness */
  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
    setShowAnswer(true);

    // Play sound effect based on correctness
    const isCorrect = selected === mcq.correctAnswer;
    playSound(isCorrect ? "correct" : "wrong");
  };

  /** Toggle answer visibility without submission */
  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
    if (!showAnswer) setSubmitted(true);
  };

  return (
    <div className={styles.mcqCard}>
      {/* Question number and text */}
      <p className={styles.mcqQuestion}>
        Q{index + 1}. {mcq.question}
      </p>

      {/* Options list — each option is a clickable button */}
      <div className={styles.mcqOptions}>
        {mcq.options.map((opt) => {
          /* Determine the visual state of each option */
          let optionClass = styles.mcqOption;
          if (submitted) {
            if (opt.label === mcq.correctAnswer) {
              /* Always highlight the correct answer in green after submission */
              optionClass += ` ${styles.mcqOptionCorrect}`;
            } else if (opt.label === selected && opt.label !== mcq.correctAnswer) {
              /* Highlight wrong selected answer in red */
              optionClass += ` ${styles.mcqOptionWrong}`;
            }
          } else if (opt.label === selected) {
            /* Pre-submission selected state */
            optionClass += ` ${styles.mcqOptionSelected}`;
          }

          return (
            <button
              key={opt.label}
              className={optionClass}
              onClick={() => handleSelect(opt.label)}
              disabled={submitted}
              aria-label={`Option ${opt.label}: ${opt.text}`}
            >
              <span className={styles.mcqOptionLabel}>{opt.label}.</span>
              <span>{opt.text}</span>
            </button>
          );
        })}
      </div>

      {/* Action buttons — Submit or Show Answer */}
      <div className={styles.mcqActions}>
        {!submitted && (
          <button
            className={styles.mcqSubmitBtn}
            onClick={handleSubmit}
            disabled={!selected}
          >
            Check Answer
          </button>
        )}
        <button className={styles.mcqShowAnswerBtn} onClick={toggleAnswer}>
          {showAnswer ? "Hide Explanation" : "Show Answer"}
        </button>
      </div>

      {/* Explanation — shown after submission or answer reveal */}
      {showAnswer && (
        <div className={styles.mcqExplanation}>
          <strong>Answer: ({mcq.correctAnswer})</strong> — {mcq.explanation}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
 * WrittenQuestionCard — Displays a written question
 * (short, long, or thinking) with a toggleable model answer.
 * ═══════════════════════════════════════════════ */
function WrittenQuestionCard({
  q,
  index,
}: {
  q: WrittenQuestion;
  index: number;
}) {
  const [showAnswer, setShowAnswer] = useState(false);

  /* Map difficulty to CSS class for the colored badge */
  const difficultyClass =
    q.difficulty === "easy"
      ? styles.wqDifficultyEasy
      : q.difficulty === "medium"
        ? styles.wqDifficultyMedium
        : styles.wqDifficultyHard;

  return (
    <div className={styles.writtenQuestionCard}>
      {/* Difficulty badge */}
      <span className={`${styles.wqDifficulty} ${difficultyClass}`}>
        {q.difficulty}
      </span>

      {/* Question text */}
      <p className={styles.wqQuestion}>
        Q{index + 1}. {q.question}
      </p>

      {/* Toggle button to reveal/hide the model answer */}
      <button
        className={styles.wqToggleBtn}
        onClick={() => setShowAnswer(!showAnswer)}
      >
        {showAnswer ? "Hide Answer" : "Show Model Answer"}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{
            transform: showAnswer ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {/* Model answer — conditionally rendered with slide animation */}
      {showAnswer && <div className={styles.wqAnswer}>{q.answer}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════
 * MAIN COMPONENT: ChapterStudyClient
 * ═══════════════════════════════════════════════ */
export default function ChapterStudyClient({
  content,
  questions,
  backUrl,
}: ChapterStudyClientProps) {
  /* ─── State ─── */
  /** Which major tab is active: 'study' or 'questions' */
  const [activeTab, setActiveTab] = useState<"study" | "questions">("study");
  /** Currently selected topic index (0-based) */
  const [activeTopicIdx, setActiveTopicIdx] = useState(0);
  /** Currently selected subtopic id within the active topic */
  const [activeSubtopicId, setActiveSubtopicId] = useState<string | null>(null);

  /* ─── Derived Data ─── */
  const activeTopic: Topic = content.topics[activeTopicIdx];

  /* ─── Handlers ─── */
  /** Switch to a different topic by index */
  const handleTopicChange = useCallback(
    (idx: number) => {
      setActiveTopicIdx(idx);
      setActiveSubtopicId(null);
      /* Scroll to top of content area on topic change */
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    []
  );

  /** Switch to a specific subtopic within the current topic */
  const handleSubtopicClick = useCallback((subtopicId: string) => {
    setActiveSubtopicId(subtopicId);
    /* Scroll to the subtopic element */
    const el = document.getElementById(`subtopic-${subtopicId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  /* ═══════════════════════════════════════════
   * RENDER: Study Material Tab Content
   * ═══════════════════════════════════════════ */
  const renderStudyContent = () => (
    <div className={styles.mainContent}>
      {/* Chapter Overview — shown once at the top */}
      <div className={styles.chapterOverview}>
        <h1 className={styles.chapterTitle}>{content.title}</h1>
        <p className={styles.chapterSubtitle}>{content.overview}</p>
        <div className={styles.chapterStats}>
          <span className={styles.statPill}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
            </svg>
            {content.classLevel} · {content.subject}
          </span>
          <span className={styles.statPill}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ~{content.estimatedHours} hours study time
          </span>
          <span className={styles.statPill}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            {content.topics.length} Topics · {content.topics.reduce((sum, t) => sum + t.subtopics.length, 0)} Subtopics
          </span>
          <span className={styles.statPill}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            Difficulty: {content.difficulty}
          </span>
        </div>
      </div>

      {/* Topic Section — shows the active topic with all its subtopics */}
      <div className={styles.topicSection} key={activeTopic.id}>
        {/* Topic Header */}
        <div className={styles.topicHeader}>
          <span className={styles.topicNumber}>{activeTopic.id}</span>
          <h2 className={styles.topicTitle}>{activeTopic.title}</h2>
        </div>
        <p className={styles.topicSummary}>{activeTopic.summary}</p>

        {/* Subtopics — each rendered as a detailed card */}
        {activeTopic.subtopics.map((sub: Subtopic) => (
          <div
            key={sub.id}
            id={`subtopic-${sub.id}`}
            className={styles.subtopicCard}
          >
            {/* Subtopic title with ID badge */}
            <h3 className={styles.subtopicTitle}>
              <span className={styles.subtopicId}>{sub.id}</span>
              {sub.title}
            </h3>

            {/* Main teaching content */}
            <div className={styles.subtopicContent}>{sub.content}</div>

            {/* Illustration section — if present */}
            {sub.illustration && (
              <div className={styles.illustrationSection}>
                <div className={styles.illustrationWrapper}>
                  <img
                    src={sub.illustration.url}
                    alt={sub.illustration.caption}
                    className={styles.illustrationImage}
                    loading="lazy"
                  />
                </div>
                <p className={styles.illustrationCaption}>{sub.illustration.caption}</p>
              </div>
            )}

            {/* Key Points section */}
            {sub.keyPoints.length > 0 && (
              <div className={styles.keyPointsSection}>
                <div className={styles.sectionLabel}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Key Points to Remember
                </div>
                <ul className={styles.keyPointsList}>
                  {sub.keyPoints.map((kp, i) => (
                    <li key={i} className={styles.keyPointItem}>
                      <span className={styles.keyPointBullet}></span>
                      <div>
                        <span className={styles.keyPointText}>{kp.point}</span>
                        {kp.detail && (
                          <p className={styles.keyPointDetail}>{kp.detail}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Formulas section — only if subtopic has formulas */}
            {sub.formulas && sub.formulas.length > 0 && (
              <div className={styles.formulasSection}>
                <div className={styles.sectionLabel}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
                  </svg>
                  Formulas
                </div>
                {sub.formulas.map((formula, i) => (
                  <div key={i} className={styles.formulaCard}>
                    <div className={styles.formulaName}>{formula.name}</div>
                    <div className={styles.formulaExpression}>
                      {formula.expression}
                    </div>
                    <p className={styles.formulaDesc}>{formula.description}</p>
                    <div className={styles.formulaVars}>
                      {Object.entries(formula.variables).map(([sym, meaning]) => (
                        <span key={sym} className={styles.formulaVar}>
                          <span className={styles.formulaVarSymbol}>{sym}</span>
                          = {meaning}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Real-World Examples section */}
            {sub.examples.length > 0 && (
              <div className={styles.examplesSection}>
                <div className={styles.sectionLabel}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                  Real-World Examples
                </div>
                {sub.examples.map((ex, i) => (
                  <div key={i} className={styles.exampleCard}>
                    <div className={styles.exampleTitle}>{ex.title}</div>
                    <p className={styles.exampleText}>{ex.explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════
   * RENDER: Question Bank Tab Content
   * ═══════════════════════════════════════════ */
  const renderQuestionBank = () => {
    /* Get the question bank for the currently active topic */
    const topicQB = questions.find((qb) => qb.topicId === activeTopic.id);

    if (!topicQB) {
      return (
        <div className={styles.questionBankWrapper}>
          <p style={{ color: "var(--study-text-muted)", textAlign: "center", padding: "48px 0" }}>
            No questions available for this topic yet.
          </p>
        </div>
      );
    }

    return (
      <div className={styles.questionBankWrapper}>
        <div className={styles.qbTopicSection}>
          <h2 className={styles.qbTopicTitle}>
            Topic {topicQB.topicId}: {topicQB.topicTitle}
          </h2>

          {/* MCQs Section */}
          <div className={styles.qbCategorySection}>
            <h3 className={styles.qbCategoryTitle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Multiple Choice Questions
              <span className={styles.qbCategoryBadge}>{topicQB.mcqs.length}</span>
            </h3>
            {topicQB.mcqs.map((mcq, i) => (
              <MCQInteractive key={i} mcq={mcq} index={i} />
            ))}
          </div>

          {/* Short Answer Section */}
          <div className={styles.qbCategorySection}>
            <h3 className={styles.qbCategoryTitle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
              </svg>
              Short Answer Questions
              <span className={styles.qbCategoryBadge}>{topicQB.shortAnswer.length}</span>
            </h3>
            {topicQB.shortAnswer.map((q, i) => (
              <WrittenQuestionCard key={i} q={q} index={i} />
            ))}
          </div>

          {/* Long Answer Section */}
          <div className={styles.qbCategorySection}>
            <h3 className={styles.qbCategoryTitle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              Long Answer Questions
              <span className={styles.qbCategoryBadge}>{topicQB.longAnswer.length}</span>
            </h3>
            {topicQB.longAnswer.map((q, i) => (
              <WrittenQuestionCard key={i} q={q} index={i} />
            ))}
          </div>

          {/* Thinking Questions Section */}
          <div className={styles.qbCategorySection}>
            <h3 className={styles.qbCategoryTitle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
              Higher-Order Thinking Questions
              <span className={styles.qbCategoryBadge}>{topicQB.thinkingQuestions.length}</span>
            </h3>
            {topicQB.thinkingQuestions.map((q, i) => (
              <WrittenQuestionCard key={i} q={q} index={i} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════
   * MAIN RENDER
   * ═══════════════════════════════════════════ */
  return (
    <div className={styles.pageWrapper}>
      {/* ─── Sticky Header Bar ─── */}
      <header className={styles.headerBar}>
        <div className={styles.headerLeft}>
          <Link href={backUrl} className={styles.backLink}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back
          </Link>
          <div>
            <div className={styles.headerTitle}>
              Chapter {content.chapterNumber}: {content.title}
            </div>
            <div className={styles.headerMeta}>
              {content.classLevel} · {content.subject} · NCERT Aligned
            </div>
          </div>
        </div>

        {/* Tab Switcher — Study Material vs Question Bank */}
        <div className={styles.headerRight}>
          <button
            className={`${styles.tabButton} ${activeTab === "study" ? styles.tabButtonActive : ""}`}
            onClick={() => setActiveTab("study")}
          >
            📖 Study Material
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "questions" ? styles.tabButtonActive : ""}`}
            onClick={() => setActiveTab("questions")}
          >
            📝 Question Bank
          </button>
        </div>
      </header>

      {/* ─── Main Split Layout ─── */}
      <div className={styles.contentLayout}>
        {/* Sidebar — Topic Navigation */}
        <nav className={styles.sidebar}>
          <div className={styles.sidebarTitle}>Topics</div>
          <ul className={styles.topicNav}>
            {content.topics.map((topic: Topic, idx: number) => (
              <li key={topic.id} className={styles.topicNavItem}>
                {/* Topic button */}
                <button
                  className={`${styles.topicNavButton} ${idx === activeTopicIdx ? styles.topicNavButtonActive : ""
                    }`}
                  onClick={() => handleTopicChange(idx)}
                >
                  <span className={styles.topicNavNumber}>{topic.id}</span>
                  <span className={styles.topicNavLabel}>{topic.title}</span>
                </button>

                {/* Subtopic links — shown only for the active topic */}
                {idx === activeTopicIdx && (
                  <ul className={styles.subtopicNav}>
                    {topic.subtopics.map((sub: Subtopic) => (
                      <li key={sub.id}>
                        <button
                          className={`${styles.subtopicNavButton} ${activeSubtopicId === sub.id
                            ? styles.subtopicNavButtonActive
                            : ""
                            }`}
                          onClick={() => handleSubtopicClick(sub.id)}
                        >
                          {sub.id} {sub.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Content Area — switches between study and questions */}
        {activeTab === "study" ? renderStudyContent() : renderQuestionBank()}
      </div>
    </div>
  );
}
