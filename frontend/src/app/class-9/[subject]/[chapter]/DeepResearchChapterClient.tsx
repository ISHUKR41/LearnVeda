/**
 * FILE: DeepResearchChapterClient.tsx
 * LOCATION: frontend/src/app/class-9/[subject]/[chapter]/DeepResearchChapterClient.tsx
 * PURPOSE: Professional, interactive study interface for deep-research chapters.
 *          Renders topic content with proper KaTeX math, topic images, physics
 *          simulations, interactive MCQ questions, progress tracking, and scoring.
 *
 * FEATURES:
 *   - Sidebar navigation with topic progress indicators
 *   - Real KaTeX math rendering (proper textbook-quality formulas)
 *   - Topic cover images with gradient overlay
 *   - Interactive physics simulations per topic
 *   - MCQ option selection with answer reveal and XP feedback
 *   - Score + XP tracking saved to PostgreSQL via progressApi
 *   - Fully responsive (mobile sidebar toggle)
 *
 * USED BY: page.tsx (Class 9 Chapter page server component)
 * LAST UPDATED: 2026-05-28
 */

"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import styles from "./DeepResearchChapter.module.css";
import type { Chapter, Topic, Question } from "@/lib/content/class9/science/force-and-laws-of-motion";
import { parseMarkdown } from "@/lib/utils/parseMarkdown";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";
import SimulationRenderer from "@/components/simulations/SimulationRegistry";

/* ─────────────────────────────────────────────
 * Component Props
 * ───────────────────────────────────────────── */
interface DeepResearchChapterClientProps {
  chapterData: Chapter;
  backUrl: string;
}

/* ─────────────────────────────────────────────
 * Question type config — badge colors and icons
 * ───────────────────────────────────────────── */
const QUESTION_CONFIG = {
  mcq:      { label: "MCQ",   color: "#6366f1", points: 10, icon: "◉" },
  short:    { label: "SHORT", color: "#10b981", points: 15, icon: "✎" },
  long:     { label: "LONG",  color: "#f59e0b", points: 20, icon: "✍" },
  thinking: { label: "HOTS",  color: "#ef4444", points: 25, icon: "🧠" },
} as const;

/* ─────────────────────────────────────────────
 * Main Component
 * ───────────────────────────────────────────── */
export default function DeepResearchChapterClient({ chapterData, backUrl }: DeepResearchChapterClientProps) {
  const [activeTopicId, setActiveTopicId] = useState<string>(chapterData.topics[0]?.id || "");
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [correctAnswers, setCorrectAnswers] = useState<Set<string>>(new Set());
  const [selectedOptionsMap, setSelectedOptionsMap] = useState<Record<string, string>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const cachedAnswered = localStorage.getItem(`answered_qs_${chapterData.id}`);
    const cachedCorrect = localStorage.getItem(`correct_qs_${chapterData.id}`);
    const cachedSelected = localStorage.getItem(`selected_opts_${chapterData.id}`);
    if (cachedAnswered) {
      try {
        setAnsweredQuestions(new Set(JSON.parse(cachedAnswered)));
      } catch (e) {
        console.error(e);
      }
    }
    if (cachedCorrect) {
      try {
        setCorrectAnswers(new Set(JSON.parse(cachedCorrect)));
      } catch (e) {
        console.error(e);
      }
    }
    if (cachedSelected) {
      try {
        setSelectedOptionsMap(JSON.parse(cachedSelected));
      } catch (e) {
        console.error(e);
      }
    }
  }, [chapterData.id]);

  const activeTopic = useMemo(
    () => chapterData.topics.find((t) => t.id === activeTopicId),
    [chapterData.topics, activeTopicId]
  );

  /* Per-topic progress stats for the sidebar */
  const topicStats = useMemo(() => {
    const stats: Record<string, { answered: number; correct: number; total: number }> = {};
    chapterData.topics.forEach((topic) => {
      stats[topic.id] = {
        answered: topic.questions.filter((q) => answeredQuestions.has(q.id)).length,
        correct:  topic.questions.filter((q) => correctAnswers.has(q.id)).length,
        total:    topic.questions.length,
      };
    });
    return stats;
  }, [chapterData.topics, answeredQuestions, correctAnswers]);

  /* Save text answer without grading it immediately */
  const handleSaveTextAnswer = useCallback(
    (questionId: string, text: string) => {
      setSelectedOptionsMap((prev) => {
        const next = { ...prev, [questionId]: text };
        localStorage.setItem(`selected_opts_${chapterData.id}`, JSON.stringify(next));
        return next;
      });
    },
    [chapterData.id]
  );

  /* Save progress to DB and award XP on correct answer.
   * Uses fetch() directly to the Next.js internal API routes so that
   * XP, Stars, Streak, and Level all get saved to PostgreSQL properly.
   */
  const handleQuestionAnswered = useCallback(
    (questionId: string, isCorrect: boolean, selectedOpt?: string) => {
      /* Find the question to determine its type for XP calculation */
      const question = activeTopic?.questions.find((q) => q.id === questionId);
      const questionType = question?.type === "thinking" ? "deep-thinking"
        : question?.type === "short" ? "short-answer"
        : question?.type === "long" ? "long-answer"
        : "mcq";

      setAnsweredQuestions((prev) => {
        const next = new Set(prev).add(questionId);
        localStorage.setItem(`answered_qs_${chapterData.id}`, JSON.stringify(Array.from(next)));
        return next;
      });

      if (selectedOpt) {
        setSelectedOptionsMap((prev) => {
          const next = { ...prev, [questionId]: selectedOpt };
          localStorage.setItem(`selected_opts_${chapterData.id}`, JSON.stringify(next));
          return next;
        });
      }

      /* ── 1. Save individual answer via /api/progress/answers (awards XP + Stars + Streak) ── */
      fetch("/api/progress/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterId: chapterData.id,
          topicId: activeTopicId,
          questionId,
          userAnswer: selectedOpt || "",
          isCorrect,
          timeSpent: 0,
          questionType,
        }),
      })
        .then((r) => r.json())
        .then((res) => {
          if (res.ok && res.data) {
            const d = res.data;
            if (d.isCorrect && d.xpAwarded > 0) {
              if (d.leveledUp) {
                toast.success(`🎉 Level Up! You are now Level ${d.newLevel}!`);
              } else {
                toast.success(`+${d.xpAwarded} XP · +${d.starsAwarded} ⭐ earned!`);
              }
            }
          }
        })
        .catch(console.error);

      /* ── 2. Update chapter-level progress via /api/progress/chapters/[chapterId] ── */
      if (isCorrect) {
        setCorrectAnswers((prev) => {
          const next = new Set(prev).add(questionId);
          localStorage.setItem(`correct_qs_${chapterData.id}`, JSON.stringify(Array.from(next)));
          const totalQuestions = chapterData.topics.reduce((acc, t) => acc + t.questions.length, 0);
          const newScore = Math.round((next.size / totalQuestions) * 100);
          const isCompleted = next.size === totalQuestions;

          fetch(`/api/progress/chapters/${encodeURIComponent(chapterData.id)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              score: newScore,
              completed: isCompleted,
              correctCount: next.size,
              answers: JSON.stringify({ answeredQuestions: Array.from(next) }),
            }),
          }).catch(console.error);

          return next;
        });
      } else {
        const totalQuestions = chapterData.topics.reduce((acc, t) => acc + t.questions.length, 0);
        const newScore = Math.round((correctAnswers.size / totalQuestions) * 100);
        fetch(`/api/progress/chapters/${encodeURIComponent(chapterData.id)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            score: newScore,
            completed: false,
            correctCount: correctAnswers.size,
          }),
        }).catch(console.error);
      }
    },
    [correctAnswers, chapterData, activeTopicId, activeTopic]
  );

  const handleTopicChange = useCallback((topicId: string) => {
    setActiveTopicId(topicId);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* Score totals */
  const totalScore = useMemo(() => {
    let s = 0;
    chapterData.topics.forEach((t) =>
      t.questions.forEach((q) => { if (correctAnswers.has(q.id)) s += q.points || QUESTION_CONFIG[q.type].points; })
    );
    return s;
  }, [chapterData.topics, correctAnswers]);

  const maxScore = useMemo(() => {
    let m = 0;
    chapterData.topics.forEach((t) =>
      t.questions.forEach((q) => { m += q.points || QUESTION_CONFIG[q.type].points; })
    );
    return m;
  }, [chapterData.topics]);

  return (
    <div className={styles.container}>
      {/* ── Sticky Header ── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href={backUrl} className={styles.backLink} aria-label="Back to subject">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span>Back</span>
          </Link>
          <button
            className={styles.mobileSidebarToggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle topic list"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Topics
          </button>
        </div>

        <div className={styles.headerCenter}>
          <span className={styles.subjectTag}>{chapterData.subject}</span>
          <h1 className={styles.chapterTitle}>{chapterData.title}</h1>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.scoreDisplay}>
            <span className={styles.scoreLabel}>Score</span>
            <span className={styles.scoreValue}>{totalScore}/{maxScore}</span>
          </div>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <div className={styles.mainLayout}>
        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <h3 className={styles.sidebarTitle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              Topics ({chapterData.topics.length})
            </h3>
          </div>

          <ul className={styles.topicList}>
            {chapterData.topics.map((topic, idx) => {
              const stats = topicStats[topic.id];
              const progressPercent = stats ? Math.round((stats.answered / stats.total) * 100) : 0;
              const isActive = activeTopicId === topic.id;
              const isDone = stats && stats.answered === stats.total;

              return (
                <li key={topic.id}>
                  <button
                    className={`${styles.topicButton} ${isActive ? styles.activeTopic : ""}`}
                    onClick={() => handleTopicChange(topic.id)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className={styles.topicNumber}>{idx + 1}</span>
                    <div className={styles.topicInfo}>
                      <span className={styles.topicName}>{topic.title.replace(/^\d+\.\s*/, "")}</span>
                      {stats && stats.answered > 0 && (
                        <div className={styles.topicProgress}>
                          <div className={styles.progressBar}>
                            <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
                          </div>
                          <span className={styles.progressText}>{stats.correct}/{stats.total}</span>
                        </div>
                      )}
                    </div>
                    {isDone && <span className={styles.completedBadge}>✓</span>}
                  </button>
                </li>
              );
            })}
          </ul>

          {activeTopic?.estimatedMinutes && (
            <div className={styles.readingTime}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              ~{activeTopic.estimatedMinutes} min read
            </div>
          )}
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)} />
        )}

        {/* Content Area */}
        <section className={styles.contentArea}>
          {activeTopic ? (
            <div className={styles.topicContent}>
              {/* ── Topic Hero Image ── */}
              {activeTopic.imageUrl && (
                <div className={styles.topicHeroImage}>
                  <img
                    src={activeTopic.imageUrl}
                    alt={activeTopic.title}
                    className={styles.heroImg}
                    loading="lazy"
                  />
                  <div className={styles.heroImgOverlay} />
                  <div className={styles.heroImgText}>
                    <h2 className={styles.heroTitle}>{activeTopic.title}</h2>
                    <div className={styles.heroMeta}>
                      <span className={styles.heroTag}>{activeTopic.questions.length} Questions</span>
                      {activeTopic.estimatedMinutes && (
                        <span className={styles.heroTag}>{activeTopic.estimatedMinutes} min read</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Topic header (no image fallback) */}
              {!activeTopic.imageUrl && (
                <div style={{ marginBottom: "32px" }}>
                  <h2 className={styles.topicHeader}>{activeTopic.title}</h2>
                  <div className={styles.topicMeta}>
                    <span className={styles.questionsCount}>{activeTopic.questions.length} Questions</span>
                    {activeTopic.estimatedMinutes && (
                      <span className={styles.readTime}>{activeTopic.estimatedMinutes} min read</span>
                    )}
                  </div>
                </div>
              )}

              {/* Focused Study Mode link — uses the real chapter slug */}
              <div style={{ marginBottom: "24px", display: "flex", justifyContent: "flex-end" }}>
                <Link
                  href={`/class-9/science/${chapterData.id}/${activeTopic.id}`}
                  className={styles.focusedStudyBtn}
                >
                  ⚡ Focused Study Mode
                </Link>
              </div>

              {/* ── Rendered Markdown Content with KaTeX math ── */}
              <div
                className={styles.markdownBody}
                dangerouslySetInnerHTML={{ __html: parseMarkdown(activeTopic.content) }}
              />

              {/* ── Interactive Simulations ── */}
              {activeTopic.simulationIds && activeTopic.simulationIds.length > 0 && (
                <div className={styles.simulationsSection}>
                  <SimulationRenderer simulationIds={activeTopic.simulationIds} />
                </div>
              )}

              {/* ── Divider ── */}
              <div className={styles.sectionDivider}>
                <span className={styles.dividerLine} />
                <span className={styles.dividerText}>Practice Questions</span>
                <span className={styles.dividerLine} />
              </div>

              {/* Question type filter tags */}
              <div className={styles.questionTypeFilters}>
                {Object.entries(QUESTION_CONFIG).map(([type, config]) => {
                  const count = activeTopic.questions.filter((q) => q.type === type).length;
                  return (
                    <span key={type} className={styles.filterTag} style={{ borderColor: config.color }}>
                      <span style={{ color: config.color }}>{config.icon}</span>{" "}
                      {config.label} ({count})
                    </span>
                  );
                })}
              </div>

              {/* ── Questions ── */}
              <div className={styles.questionsContainer}>
                {activeTopic.questions.map((q, idx) => (
                    <QuestionItem
                      key={q.id}
                      index={idx + 1}
                      question={q}
                      isAnswered={answeredQuestions.has(q.id)}
                      isCorrect={correctAnswers.has(q.id)}
                      selectedOption={selectedOptionsMap[q.id] || null}
                      onAnswer={handleQuestionAnswered}
                      onTextSave={handleSaveTextAnswer}
                    />
                ))}
              </div>

              {/* ── Topic Navigation ── */}
              <div className={styles.topicNavigation}>
                {chapterData.topics.indexOf(activeTopic) > 0 && (
                  <button
                    className={styles.navButton}
                    onClick={() => {
                      const i = chapterData.topics.indexOf(activeTopic);
                      handleTopicChange(chapterData.topics[i - 1].id);
                    }}
                  >
                    ← Previous Topic
                  </button>
                )}
                <div className={styles.navSpacer} />
                {chapterData.topics.indexOf(activeTopic) < chapterData.topics.length - 1 && (
                  <button
                    className={`${styles.navButton} ${styles.navButtonPrimary}`}
                    onClick={() => {
                      const i = chapterData.topics.indexOf(activeTopic);
                      handleTopicChange(chapterData.topics[i + 1].id);
                    }}
                  >
                    Next Topic →
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4">
                <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              <p>Select a topic from the sidebar to begin learning.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
 * QuestionItem — single question card
 * ───────────────────────────────────────────── */
interface QuestionItemProps {
  question: Question;
  index: number;
  isAnswered: boolean;
  isCorrect: boolean;
  selectedOption: string | null;
  onAnswer: (questionId: string, isCorrect: boolean, selectedOpt?: string) => void;
  onTextSave: (questionId: string, text: string) => void;
}

function QuestionItem({ question, index, isAnswered, isCorrect, selectedOption: initialSelected, onAnswer, onTextSave }: QuestionItemProps) {
  const [showAnswer, setShowAnswer] = useState(isAnswered);
  const [selectedOption, setSelectedOption] = useState<string | null>(question.type === "mcq" ? (initialSelected || null) : null);
  const [typedAnswer, setTypedAnswer] = useState<string>(question.type !== "mcq" ? (initialSelected || "") : "");
  const config = QUESTION_CONFIG[question.type];

  useEffect(() => {
    if (isAnswered) {
      setShowAnswer(true);
    }
    if (initialSelected) {
      if (question.type === "mcq") {
        setSelectedOption(initialSelected);
      } else {
        setTypedAnswer(initialSelected);
      }
    }
  }, [isAnswered, initialSelected, question.type]);

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };

  const handleTextBlur = () => {
    onTextSave(question.id, typedAnswer);
  };

  const handleRevealAnswer = () => {
    if (!showAnswer) {
      setShowAnswer(true);
      if (!isAnswered) {
        if (question.type === "mcq") {
          onAnswer(question.id, selectedOption === question.correctAnswer, selectedOption || undefined);
        } else {
          onAnswer(question.id, true, typedAnswer || undefined);
        }
      }
    } else {
      setShowAnswer(false);
    }
  };

  return (
    <div
      className={`${styles.questionCard} ${
        isAnswered ? (isCorrect ? styles.questionCorrect : styles.questionIncorrect) : ""
      }`}
    >
      <div className={styles.questionHeader}>
        <div className={styles.questionTags}>
          <span
            className={styles.questionTypeBadge}
            style={{ background: `${config.color}18`, color: config.color, borderColor: `${config.color}30` }}
          >
            {config.icon} {config.label}
          </span>
          <span className={styles.questionNumber}>Q{index}</span>
        </div>
        <span className={styles.questionPoints}>+{question.points || config.points} pts</span>
      </div>

      {/* Question text: rendered through parseMarkdown so any inline KaTeX/LaTeX is displayed correctly */}
      <div
        className={styles.questionText}
        dangerouslySetInnerHTML={{ __html: parseMarkdown(question.question) }}
      />

      {/* MCQ Options */}
      {question.type === "mcq" && question.options && (
        <ul className={styles.optionsList}>
          {question.options.map((opt, i) => {
            const isSelected = selectedOption === opt;
            const isCorrectOpt = showAnswer && opt === question.correctAnswer;
            const isWrong = showAnswer && isSelected && opt !== question.correctAnswer;

            return (
              <li key={i}>
                <button
                  className={`${styles.optionButton} ${isSelected ? styles.optionSelected : ""} ${isCorrectOpt ? styles.optionCorrect : ""} ${isWrong ? styles.optionWrong : ""}`}
                  onClick={() => handleOptionSelect(opt)}
                  disabled={isAnswered}
                >
                  <span className={styles.optionLetter}>{String.fromCharCode(65 + i)}</span>
                  {/* Option text also rendered through markdown to handle any formula inside options */}
                  <span
                    className={styles.optionText}
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(opt) }}
                  />
                  {isCorrectOpt && <span className={styles.optionCheck}>✓</span>}
                  {isWrong && <span className={styles.optionX}>✗</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Non-MCQ Text Area */}
      {question.type !== "mcq" && (
        <div className={styles.textAreaWrapper}>
          <textarea
            className={styles.answerTextArea}
            placeholder="Type your answer here to save your progress..."
            value={typedAnswer}
            onChange={(e) => setTypedAnswer(e.target.value)}
            onBlur={handleTextBlur}
            disabled={isAnswered && showAnswer}
            rows={4}
          />
        </div>
      )}

      <button
        onClick={handleRevealAnswer}
        className={styles.revealButton}
        style={{ borderColor: config.color, color: config.color }}
        disabled={question.type === "mcq" && !selectedOption && !showAnswer}
      >
        {showAnswer
          ? "Hide Explanation"
          : question.type === "mcq"
          ? "Check Answer"
          : "Reveal Answer & Explanation"}
      </button>

      {showAnswer && (
        <div className={styles.answerReveal} style={{ borderColor: `${config.color}25` }}>
          <div className={styles.correctAnswerBox} style={{ background: `${config.color}12` }}>
            <span className={styles.answerLabel}>✓ Correct Answer</span>
            {/* Correct answer rendered via markdown to show any LaTeX formulas */}
            <div
              className={styles.answerText}
              dangerouslySetInnerHTML={{ __html: parseMarkdown(question.correctAnswer) }}
            />
          </div>
          <div className={styles.explanationBox}>
            <span className={styles.explanationLabel}>📖 Explanation</span>
            {/* Explanation also rendered via markdown for full LaTeX + bold/italic support */}
            <div
              className={styles.explanationText}
              dangerouslySetInnerHTML={{ __html: parseMarkdown(question.explanation) }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
