/**
 * FILE: DeepResearchChapterClient.tsx
 * LOCATION: frontend/src/app/class-9/[subject]/[chapter]/DeepResearchChapterClient.tsx
 * PURPOSE: Professional, interactive study interface for deep-research chapters.
 *          Renders topic content with markdown, manages questions with interactive
 *          MCQ selection, answer reveals, progress tracking, and score calculation.
 *
 * FEATURES:
 *   - Sidebar navigation with topic progress indicators
 *   - Markdown content rendering with formula support
 *   - Interactive MCQ options (click to select → reveal answer)
 *   - Question categorization by type (MCQ, Short, Long, Thinking)
 *   - Score tracking per topic
 *   - Smooth animations for answer reveals
 *   - Fully responsive layout (mobile: stacked, desktop: sidebar)
 *
 * USED BY: page.tsx (Class 9 Chapter page server component)
 * DEPENDENCIES: React, next/link, Chapter/Topic/Question types
 * LAST UPDATED: 2026-05-28
 */

"use client";

import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import styles from "./DeepResearchChapter.module.css";
import type { Chapter, Topic, Question } from "@/lib/content/class9/science/force-and-laws-of-motion";
import { progressApi } from "@/lib/api/api";
import { toast } from "react-hot-toast";

/* ─────────────────────────────────────────────
 * Component Props Interface
 * ───────────────────────────────────────────── */
interface DeepResearchChapterClientProps {
  /** The full chapter data object containing all topics and questions */
  chapterData: Chapter;
  /** URL to navigate back to the subject listing */
  backUrl: string;
}

/* ─────────────────────────────────────────────
 * Question Type Configuration
 * Maps question types to display labels, colors, and point values
 * ───────────────────────────────────────────── */
const QUESTION_CONFIG = {
  mcq: { label: "MCQ", color: "#6366f1", points: 10, icon: "◉" },
  short: { label: "SHORT", color: "#10b981", points: 15, icon: "✎" },
  long: { label: "LONG", color: "#f59e0b", points: 20, icon: "✍" },
  thinking: { label: "HOTS", color: "#ef4444", points: 25, icon: "🧠" },
} as const;

/* ─────────────────────────────────────────────
 * Main Component
 * ───────────────────────────────────────────── */
export default function DeepResearchChapterClient({ chapterData, backUrl }: DeepResearchChapterClientProps) {
  /** Currently selected topic ID — defaults to the first topic */
  const [activeTopicId, setActiveTopicId] = useState<string>(chapterData.topics[0]?.id || "");

  /** Tracks which questions have been answered (by question ID) */
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());

  /** Tracks correct answers for score calculation */
  const [correctAnswers, setCorrectAnswers] = useState<Set<string>>(new Set());

  /** Whether the mobile sidebar is open */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /** Find the currently active topic object */
  const activeTopic = useMemo(
    () => chapterData.topics.find((t) => t.id === activeTopicId),
    [chapterData.topics, activeTopicId]
  );

  /** Calculate progress statistics for the sidebar */
  const topicStats = useMemo(() => {
    const stats: Record<string, { answered: number; correct: number; total: number }> = {};
    chapterData.topics.forEach((topic) => {
      const answered = topic.questions.filter((q) => answeredQuestions.has(q.id)).length;
      const correct = topic.questions.filter((q) => correctAnswers.has(q.id)).length;
      stats[topic.id] = { answered, correct, total: topic.questions.length };
    });
    return stats;
  }, [chapterData.topics, answeredQuestions, correctAnswers]);

  /** Handle marking a question as answered */
  const handleQuestionAnswered = useCallback((questionId: string, isCorrect: boolean) => {
    setAnsweredQuestions((prev) => {
      const nextAnswered = new Set(prev).add(questionId);
      return nextAnswered;
    });

    let newCorrectAnswersCount = correctAnswers.size;
    if (isCorrect) {
      setCorrectAnswers((prev) => {
        const nextCorrect = new Set(prev).add(questionId);
        newCorrectAnswersCount = nextCorrect.size;
        
        // Trigger DB progress update
        const totalQuestions = chapterData.topics.reduce((acc, t) => acc + t.questions.length, 0);
        const newScore = Math.round((newCorrectAnswersCount / totalQuestions) * 100);
        const isCompleted = nextCorrect.size === totalQuestions;

        progressApi.updateChapterProgress(chapterData.id, {
          completed: isCompleted,
          score: newScore,
        }).then((res) => {
          if (res.data?.ok) {
            const resData = res.data.data;
            if (resData.leveledUp) {
              toast.success(`🎉 Level Up! You reached Level ${resData.newLevel}!`);
            } else {
              toast.success(`+${resData.xpEarned} XP earned!`);
            }
          }
        }).catch((err) => {
          console.error("Failed to update progress in DB:", err);
        });

        return nextCorrect;
      });
    } else {
      // Still trigger progress update for attempts, so time spent is saved
      const totalQuestions = chapterData.topics.reduce((acc, t) => acc + t.questions.length, 0);
      const newScore = Math.round((newCorrectAnswersCount / totalQuestions) * 100);
      const isCompleted = answeredQuestions.size + 1 === totalQuestions;
      
      progressApi.updateChapterProgress(chapterData.id, {
        completed: isCompleted,
        score: newScore,
      }).catch((err) => {
        console.error("Failed to update progress in DB:", err);
      });
    }
  }, [correctAnswers, chapterData, answeredQuestions]);

  /** Handle topic navigation — also closes mobile sidebar */
  const handleTopicChange = useCallback((topicId: string) => {
    setActiveTopicId(topicId);
    setSidebarOpen(false);
    // Scroll to top of content area smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /** Total score across all topics */
  const totalScore = useMemo(() => {
    let score = 0;
    chapterData.topics.forEach((topic) => {
      topic.questions.forEach((q) => {
        if (correctAnswers.has(q.id)) {
          score += q.points || QUESTION_CONFIG[q.type].points;
        }
      });
    });
    return score;
  }, [chapterData.topics, correctAnswers]);

  /** Maximum possible score */
  const maxScore = useMemo(() => {
    let max = 0;
    chapterData.topics.forEach((topic) => {
      topic.questions.forEach((q) => {
        max += q.points || QUESTION_CONFIG[q.type].points;
      });
    });
    return max;
  }, [chapterData.topics]);

  return (
    <div className={styles.container}>
      {/* ── Top Header Bar ── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href={backUrl} className={styles.backLink} aria-label="Back to subject">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span>Back</span>
          </Link>

          {/* Mobile sidebar toggle button */}
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

      {/* ── Main Content Layout ── */}
      <div className={styles.mainLayout}>
        {/* Sidebar — Topic Navigation */}
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
                            <div
                              className={styles.progressFill}
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                          <span className={styles.progressText}>
                            {stats.correct}/{stats.total}
                          </span>
                        </div>
                      )}
                    </div>
                    {stats && stats.answered === stats.total && (
                      <span className={styles.completedBadge}>✓</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Estimated reading time */}
          {activeTopic?.estimatedMinutes && (
            <div className={styles.readingTime}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              ~{activeTopic.estimatedMinutes} min read
            </div>
          )}
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content Area */}
        <section className={styles.contentArea}>
          {activeTopic ? (
            <div className={styles.topicContent}>
              {/* Topic Header */}
              <div className={styles.topicHeaderSection} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "32px" }}>
                <div>
                  <h2 className={styles.topicHeader}>{activeTopic.title}</h2>
                  <div className={styles.topicMeta}>
                    <span className={styles.questionsCount}>
                      {activeTopic.questions.length} Questions
                    </span>
                    {activeTopic.estimatedMinutes && (
                      <span className={styles.readTime}>
                        {activeTopic.estimatedMinutes} min read
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  href={`/class-9/science/force-and-laws-of-motion/${activeTopic.id}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 20px",
                    background: "linear-gradient(135deg, #6366f1, #a855f7)",
                    border: "none",
                    borderRadius: "10px",
                    color: "#ffffff",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
                    transition: "all 0.2s ease"
                  }}
                >
                  Focused Study Mode ⚡
                </Link>
              </div>

              {/* Rendered Markdown Content */}
              <div
                className={styles.markdownBody}
                dangerouslySetInnerHTML={{ __html: parseMarkdown(activeTopic.content) }}
              />

              {/* Divider */}
              <div className={styles.sectionDivider}>
                <span className={styles.dividerLine} />
                <span className={styles.dividerText}>Practice Questions</span>
                <span className={styles.dividerLine} />
              </div>

              {/* Question Type Filter Tabs */}
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

              {/* Questions Container */}
              <div className={styles.questionsContainer}>
                {activeTopic.questions.map((q, idx) => (
                  <QuestionItem
                    key={q.id}
                    question={q}
                    index={idx + 1}
                    isAnswered={answeredQuestions.has(q.id)}
                    isCorrect={correctAnswers.has(q.id)}
                    onAnswer={handleQuestionAnswered}
                  />
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className={styles.topicNavigation}>
                {chapterData.topics.indexOf(activeTopic) > 0 && (
                  <button
                    className={styles.navButton}
                    onClick={() => {
                      const currentIdx = chapterData.topics.indexOf(activeTopic);
                      handleTopicChange(chapterData.topics[currentIdx - 1].id);
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
                      const currentIdx = chapterData.topics.indexOf(activeTopic);
                      handleTopicChange(chapterData.topics[currentIdx + 1].id);
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
                <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
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
 * parseMarkdown — Simple internal markdown parser
 * Converts basic markdown syntax to HTML for rendering.
 * Handles: headings (h3, h4), bold, italic, blockquotes,
 * ordered/unordered lists, math ($...$), paragraphs.
 * ───────────────────────────────────────────── */
function parseMarkdown(text: string): string {
  let html = text
    // Headings (process h4 before h3 to avoid conflicts)
    .replace(/^#### (.*$)/gim, '<h4 class="md-h4">$1</h4>')
    .replace(/^### (.*$)/gim, '<h3 class="md-h3">$1</h3>')
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote class="md-quote">$1</blockquote>')
    // Inline math (wrap in <code> for styling)
    .replace(/\$\$(.*?)\$\$/gim, '<code class="md-math-block">$1</code>')
    .replace(/\$(.*?)\$/gim, '<code class="md-math">$1</code>')
    // Ordered list items
    .replace(/^\d+\. (.*$)/gim, '<li class="md-li-ordered">$1</li>')
    // Unordered list items
    .replace(/^\* (.*$)/gim, '<li class="md-li">$1</li>')
    // Double newlines → paragraph breaks
    .replace(/\n\n/gim, "</p><p>")
    // Single newlines → line breaks
    .replace(/\n/gim, "<br/>");

  return `<p>${html}</p>`;
}

/* ─────────────────────────────────────────────
 * QuestionItem Component
 * Renders a single question card with:
 *   - Type badge (MCQ/SHORT/LONG/HOTS)
 *   - Question text
 *   - MCQ option selection (for MCQs)
 *   - Answer reveal toggle
 *   - Correct/incorrect feedback
 * ───────────────────────────────────────────── */
interface QuestionItemProps {
  question: Question;
  index: number;
  isAnswered: boolean;
  isCorrect: boolean;
  onAnswer: (questionId: string, isCorrect: boolean) => void;
}

function QuestionItem({ question, index, isAnswered, isCorrect, onAnswer }: QuestionItemProps) {
  /** Whether the answer is currently revealed */
  const [showAnswer, setShowAnswer] = useState(false);
  /** Selected MCQ option (only for MCQ questions) */
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const config = QUESTION_CONFIG[question.type];

  /** Handle MCQ option selection */
  const handleOptionSelect = (option: string) => {
    if (isAnswered) return; // Don't allow changing answer after it's been submitted
    setSelectedOption(option);
  };

  /** Handle answer submission / reveal */
  const handleRevealAnswer = () => {
    if (!showAnswer) {
      // First click — reveal the answer
      setShowAnswer(true);

      if (question.type === "mcq") {
        // For MCQs, check if the selected option is correct
        const correct = selectedOption === question.correctAnswer;
        onAnswer(question.id, correct);
      } else {
        // For non-MCQ, mark as "answered" (user self-evaluates)
        onAnswer(question.id, true);
      }
    } else {
      // Toggle answer visibility
      setShowAnswer(false);
    }
  };

  return (
    <div
      className={`${styles.questionCard} ${
        isAnswered ? (isCorrect ? styles.questionCorrect : styles.questionIncorrect) : ""
      }`}
    >
      {/* Question Header — Type Badge + Question Number + Points */}
      <div className={styles.questionHeader}>
        <div className={styles.questionTags}>
          <span
            className={styles.questionTypeBadge}
            style={{ background: `${config.color}15`, color: config.color, borderColor: `${config.color}30` }}
          >
            {config.icon} {config.label}
          </span>
          <span className={styles.questionPoints}>+{question.points || config.points} pts</span>
        </div>
        <span className={styles.questionNumber}>Q{index}</span>
      </div>

      {/* Question Text */}
      <p className={styles.questionText}>{question.question}</p>

      {/* MCQ Options (only for MCQ type) */}
      {question.type === "mcq" && question.options && (
        <ul className={styles.optionsList}>
          {question.options.map((opt, i) => {
            const isSelected = selectedOption === opt;
            const isCorrectOption = showAnswer && opt === question.correctAnswer;
            const isWrongSelection = showAnswer && isSelected && opt !== question.correctAnswer;

            return (
              <li key={i}>
                <button
                  className={`${styles.optionButton} ${
                    isSelected ? styles.optionSelected : ""
                  } ${isCorrectOption ? styles.optionCorrect : ""} ${
                    isWrongSelection ? styles.optionWrong : ""
                  }`}
                  onClick={() => handleOptionSelect(opt)}
                  disabled={isAnswered}
                >
                  <span className={styles.optionLetter}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className={styles.optionText}>{opt}</span>
                  {isCorrectOption && <span className={styles.optionIcon}>✓</span>}
                  {isWrongSelection && <span className={styles.optionIcon}>✗</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Reveal/Hide Answer Button */}
      <button
        onClick={handleRevealAnswer}
        className={`${styles.revealButton} ${showAnswer ? styles.revealButtonActive : ""}`}
        disabled={question.type === "mcq" && !selectedOption && !showAnswer}
      >
        {showAnswer ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
            Hide Answer
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {question.type === "mcq"
              ? selectedOption
                ? "Check Answer"
                : "Select an option first"
              : "Reveal Answer & Explanation"}
          </>
        )}
      </button>

      {/* Answer Box — shown when answer is revealed */}
      {showAnswer && (
        <div className={styles.answerBox}>
          <div className={styles.correctAnswer}>
            <span className={styles.answerLabel}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Answer
            </span>
            <p>{question.correctAnswer}</p>
          </div>
          <div className={styles.explanation}>
            <span className={styles.answerLabel}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
              Explanation
            </span>
            <p>{question.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
