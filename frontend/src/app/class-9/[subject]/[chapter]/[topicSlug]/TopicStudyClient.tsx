/**
 * FILE: TopicStudyClient.tsx
 * LOCATION: src/app/class-9/[subject]/[chapter]/[topicSlug]/TopicStudyClient.tsx
 * PURPOSE: Interactive study and practice client for a single subtopic.
 *          Uses real KaTeX math rendering, chapter-aware physics simulations,
 *          and saves all answered questions to PostgreSQL via progressApi.
 * LAST UPDATED: 2026-05-29
 */

"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import styles from "./TopicStudy.module.css";
import type { Chapter, Topic, Question } from "@/lib/content/class9/science/force-and-laws-of-motion";
import { parseMarkdown } from "@/lib/utils/parseMarkdown";
import { progressApi } from "@/lib/api/api";
import { toast } from "react-hot-toast";

/* ─────────────────────────────────────────────────────────────────────────
 * Dynamic imports for each chapter's simulation component.
 * We load them lazily so heavy canvas code doesn't bloat the initial bundle.
 * ───────────────────────────────────────────────────────────────────────── */
const PhysicsSimulation = dynamic(
  () => import("@/components/physics/PhysicsSimulation"),
  { ssr: false, loading: () => <div style={{ height: 40 }} /> }
);
const MatterSimulation = dynamic(
  () => import("@/components/physics/MatterSimulation"),
  { ssr: false, loading: () => <div style={{ height: 40 }} /> }
);
const MotionSimulation = dynamic(
  () => import("@/components/physics/MotionSimulation"),
  { ssr: false, loading: () => <div style={{ height: 40 }} /> }
);

/* ─────────────────────────────────────────────────────────────────────────
 * Chapter ID → Simulation component map
 * ───────────────────────────────────────────────────────────────────────── */
function SimulationForChapter({
  chapterId,
  topicId,
}: {
  chapterId: string;
  topicId: string;
}) {
  if (chapterId === "force-and-laws-of-motion") {
    return <PhysicsSimulation topicId={topicId} />;
  }
  if (chapterId === "matter-in-our-surroundings") {
    return <MatterSimulation topicId={topicId} />;
  }
  if (chapterId === "motion") {
    return <MotionSimulation topicId={topicId} />;
  }
  /* Fallback: try Physics simulation (covers most Class 9 science) */
  return <PhysicsSimulation topicId={topicId} />;
}

interface TopicStudyClientProps {
  chapterData: Chapter;
  activeTopic: Topic;
  backUrl: string;
}

/* XP values match /api/progress/answers route exactly */
const QUESTION_CONFIG = {
  mcq:      { label: "MCQ",      color: "#6366f1", points: 15, icon: "◉" },
  short:    { label: "SHORT",    color: "#10b981", points: 25, icon: "✎" },
  long:     { label: "LONG",     color: "#f59e0b", points: 30, icon: "✍" },
  thinking: { label: "THINKING", color: "#ef4444", points: 35, icon: "🧠" },
} as const;

/* ─────────────────────────────────────────────────────────────────────────
 * Main component
 * ───────────────────────────────────────────────────────────────────────── */
export default function TopicStudyClient({
  chapterData,
  activeTopic,
  backUrl,
}: TopicStudyClientProps) {
  /* Persistent progress state — restored from localStorage on mount */
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [correctAnswers,    setCorrectAnswers]    = useState<Set<string>>(new Set());
  const [selectedOptionsMap,setSelectedOptionsMap]= useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"all" | "mcq" | "short" | "long" | "thinking">("all");

  /* Load progress from database and fallback to localStorage on mount */
  useEffect(() => {
    const key = chapterData.id;
    
    // 1. Restore from localStorage first for immediate visual hydration
    const cachedAnswered = localStorage.getItem(`answered_qs_${key}`);
    const cachedCorrect  = localStorage.getItem(`correct_qs_${key}`);
    const cachedSelected = localStorage.getItem(`selected_opts_${key}`);
    if (cachedAnswered) {
      try { setAnsweredQuestions(new Set(JSON.parse(cachedAnswered))); } catch (e) {}
    }
    if (cachedCorrect) {
      try { setCorrectAnswers(new Set(JSON.parse(cachedCorrect))); } catch (e) {}
    }
    if (cachedSelected) {
      try { setSelectedOptionsMap(JSON.parse(cachedSelected)); } catch (e) {}
    }

    // 2. Query DB to fetch the persistent global state and keep it in sync
    progressApi.getUserProgress()
      .then((res: any) => {
        if (res.data?.ok && res.data.data?.progress) {
          const chapProgress = res.data.data.progress.find((p: any) => p.chapterId === key);
          if (chapProgress && chapProgress.answers) {
            try {
              const parsed = JSON.parse(chapProgress.answers);
              if (parsed.answeredQuestions) {
                const aq = new Set<string>(parsed.answeredQuestions);
                setAnsweredQuestions(aq);
                localStorage.setItem(`answered_qs_${key}`, JSON.stringify(Array.from(aq)));
              }
              if (parsed.correctAnswers) {
                const cq = new Set<string>(parsed.correctAnswers);
                setCorrectAnswers(cq);
                localStorage.setItem(`correct_qs_${key}`, JSON.stringify(Array.from(cq)));
              }
              if (parsed.selectedOptions) {
                setSelectedOptionsMap(parsed.selectedOptions);
                localStorage.setItem(`selected_opts_${key}`, JSON.stringify(parsed.selectedOptions));
              }
            } catch (e) {
              console.error("[TopicStudyClient] Error parsing DB answers:", e);
            }
          }
        }
      })
      .catch((err) => console.error("[TopicStudyClient] Error loading progress from DB:", err));
  }, [chapterData.id]);

  const filteredQuestions = useMemo(() => {
    if (activeTab === "all") return activeTopic.questions;
    return activeTopic.questions.filter((q) => q.type === activeTab);
  }, [activeTopic.questions, activeTab]);

  const currentIdx = useMemo(
    () => chapterData.topics.findIndex((t) => t.id === activeTopic.id),
    [chapterData.topics, activeTopic.id]
  );
  const prevTopic = chapterData.topics[currentIdx - 1] || null;
  const nextTopic = chapterData.topics[currentIdx + 1] || null;

  const handleQuestionAnswered = useCallback(
    (questionId: string, isCorrect: boolean, selectedOpt?: string) => {
      const question = activeTopic.questions.find((q) => q.id === questionId);
      const questionType = question?.type === "thinking" ? "deep-thinking"
        : question?.type === "short" ? "short-answer"
        : question?.type === "long" ? "long-answer"
        : "mcq";
      let nextAnswered = new Set<string>();
      let nextSelected: Record<string, string> = {};

      setAnsweredQuestions((prev) => {
        const next = new Set(prev).add(questionId);
        nextAnswered = next;
        localStorage.setItem(`answered_qs_${chapterData.id}`, JSON.stringify(Array.from(next)));
        return next;
      });

      if (selectedOpt) {
        setSelectedOptionsMap((prev) => {
          const next = { ...prev, [questionId]: selectedOpt };
          nextSelected = next;
          localStorage.setItem(`selected_opts_${chapterData.id}`, JSON.stringify(next));
          return next;
        });
      } else {
        setSelectedOptionsMap((prev) => {
          nextSelected = prev;
          return prev;
        });
      }

      if (isCorrect) {
        fetch("/api/progress/answers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            chapterId: chapterData.id,
            topicId: activeTopic.id,
            questionId,
            userAnswer: selectedOpt || "",
            isCorrect,
            timeSpent: 0,
            questionType,
          }),
        })
          .then((r) => r.json())
          .then((res) => {
            if (res.ok && res.data?.isCorrect && res.data.xpAwarded > 0) {
              /* Show milestone celebration first if one was reached */
              if (res.data.milestoneReached && res.data.milestoneLevels > 0) {
                toast.success(
                  `🏆 ${res.data.milestoneReached} chapter complete! +${res.data.milestoneLevels} level bonus!`,
                  { duration: 5000 }
                );
              } else if (res.data.leveledUp) {
                toast.success(
                  `⬆️ Level Up! You reached Level ${res.data.newLevel}!`,
                  { duration: 4000 }
                );
              } else {
                toast.success(
                  `+${res.data.xpAwarded} XP  •  +${res.data.starsAwarded} ⭐ Stars`,
                  { duration: 2500 }
                );
              }
            }
          })
          .catch(console.error);

        setCorrectAnswers((prev) => {
          const next = new Set(prev).add(questionId);
          localStorage.setItem(`correct_qs_${chapterData.id}`, JSON.stringify(Array.from(next)));
          
          const totalQuestions = chapterData.topics.reduce((acc, t) => acc + t.questions.length, 0);
          const newScore = Math.round((next.size / totalQuestions) * 100);
          const isCompleted = next.size === totalQuestions;

          // Prepare answers JSON payload for DB update
          const answersPayload = JSON.stringify({
            answeredQuestions: Array.from(nextAnswered.size ? nextAnswered : new Set([questionId])),
            correctAnswers: Array.from(next),
            selectedOptions: Object.keys(nextSelected).length ? nextSelected : { [questionId]: selectedOpt || "" },
          });

          fetch(`/api/progress/chapters/${chapterData.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              completed: isCompleted,
              score: newScore,
              answers: answersPayload,
              correctCount: next.size,
            }),
          })
            .then((r) => r.json())
            .then((data) => {
              if (data.ok) {
                const d = data.data;
                if (d?.leveledUp) toast.success(`🎉 Level Up! You are now Level ${d.newLevel}!`);
                else if (d?.xpEarned) toast.success(`+${d.xpEarned} XP earned!`);
              }
            })
            .catch(console.error);

          return next;
        });
      } else {
        setCorrectAnswers((prev) => {
          const totalQuestions = chapterData.topics.reduce((acc, t) => acc + t.questions.length, 0);
          const newScore = Math.round((prev.size / totalQuestions) * 100);

          // Prepare answers JSON payload for DB update
          const answersPayload = JSON.stringify({
            answeredQuestions: Array.from(nextAnswered.size ? nextAnswered : new Set([questionId])),
            correctAnswers: Array.from(prev),
            selectedOptions: Object.keys(nextSelected).length ? nextSelected : { [questionId]: selectedOpt || "" },
          });

          fetch(`/api/progress/chapters/${chapterData.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ completed: false, score: newScore, answers: answersPayload, correctCount: prev.size }),
          }).catch(console.error);

          return prev;
        });
      }
    },
    [chapterData, activeTopic]
  );

  const answeredCount  = activeTopic.questions.filter((q) => answeredQuestions.has(q.id)).length;
  const correctCount   = activeTopic.questions.filter((q) => correctAnswers.has(q.id)).length;
  const totalQuestions = activeTopic.questions.length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  /* Calculate total XP earned using the actual per-type XP values */
  const earnedXp = activeTopic.questions
    .filter((q) => correctAnswers.has(q.id))
    .reduce((sum, q) => {
      const cfg = QUESTION_CONFIG[q.type as keyof typeof QUESTION_CONFIG];
      return sum + (cfg?.points ?? 15);
    }, 0);
  const maxXp = activeTopic.questions.reduce((sum, q) => {
    const cfg = QUESTION_CONFIG[q.type as keyof typeof QUESTION_CONFIG];
    return sum + (cfg?.points ?? 15);
  }, 0);

  /* KaTeX-rendered markdown content */
  const renderedContent = useMemo(
    () => parseMarkdown(activeTopic.content),
    [activeTopic.content]
  );

  /* Topic nav URLs use the actual chapter slug from chapterData */
  const chapterSlug = chapterData.id;

  return (
    <div className={styles.container}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <Link href={backUrl} className={styles.backButton}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <span>Chapter Dashboard</span>
        </Link>
        <div className={styles.headerTitleContainer}>
          <span className={styles.subjectTag}>{chapterData.subject} • {chapterData.class}</span>
          <h1 className={styles.headerTitle}>{activeTopic.title.replace(/^\d+\.\s*/, "")}</h1>
        </div>
        <div className={styles.scoreBadge}>
          <span className={styles.scoreLabel}>Score</span>
          <span className={styles.scoreValue}>{earnedXp} / {maxXp} XP</span>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <div className={styles.mainLayout}>
        {/* Left: Study Content */}
        <section className={styles.studySection}>
          <div className={styles.card}>
            {/* Hero image */}
            {activeTopic.imageUrl && (
              <div className={styles.heroImageWrapper}>
                <img
                  src={activeTopic.imageUrl}
                  alt={activeTopic.title}
                  className={styles.heroImage}
                  loading="lazy"
                />
                <div className={styles.heroOverlay} />
                <div className={styles.heroTextOverlay}>
                  <h2 className={styles.heroTopicTitle}>{activeTopic.title.replace(/^\d+\.\s*/, "")}</h2>
                  <div className={styles.heroMeta}>
                    <span>{totalQuestions} Questions</span>
                    {activeTopic.estimatedMinutes && <span>{activeTopic.estimatedMinutes} min read</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Chapter-aware simulation component */}
            <div className={styles.cardContent}>
              <SimulationForChapter
                chapterId={chapterData.id}
                topicId={activeTopic.id}
              />

              {/* KaTeX-rendered markdown content */}
              <div
                className={styles.markdownBody}
                dangerouslySetInnerHTML={{ __html: renderedContent }}
              />
            </div>
          </div>

          {/* Topic navigation — uses the real chapter slug */}
          <div className={styles.pageNavigation}>
            {prevTopic ? (
              <Link
                href={`/class-9/science/${chapterSlug}/${prevTopic.id}`}
                className={styles.navButton}
              >
                ← {prevTopic.title.replace(/^\d+\.\s*/, "")}
              </Link>
            ) : <div />}
            {nextTopic ? (
              <Link
                href={`/class-9/science/${chapterSlug}/${nextTopic.id}`}
                className={`${styles.navButton} ${styles.navButtonPrimary}`}
              >
                {nextTopic.title.replace(/^\d+\.\s*/, "")} →
              </Link>
            ) : (
              <Link href={backUrl} className={`${styles.navButton} ${styles.navButtonPrimary}`}>
                Finish Chapter! 🎓
              </Link>
            )}
          </div>
        </section>

        {/* Right: Quiz Panel */}
        <aside className={styles.quizSection}>
          <div className={styles.stickyPanel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitleGroup}>
                <h3 className={styles.panelTitle}>Topic Practice</h3>
                <span className={styles.panelSubtitle}>Test your concepts in real-time</span>
              </div>
              {/* Circular progress */}
              <div className={styles.progressCircleContainer}>
                <svg width="52" height="52" viewBox="0 0 52 52" className={styles.progressCircle}>
                  <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                  <circle
                    cx="26" cy="26" r="22" fill="none"
                    stroke="#6366f1" strokeWidth="4"
                    strokeDasharray={`${(progressPercent / 100) * 138} 138`}
                    strokeLinecap="round"
                    transform="rotate(-90 26 26)"
                    style={{ transition: "stroke-dasharray 0.4s ease" }}
                  />
                </svg>
                <div className={styles.progressTextGroup}>
                  <span className={styles.progressVal}>{progressPercent}%</span>
                </div>
              </div>
            </div>

            {/* Filter tabs */}
            <div className={styles.tabsContainer}>
              {(["all", "mcq", "short", "long", "thinking"] as const).map((tab) => {
                const count = tab === "all"
                  ? activeTopic.questions.length
                  : activeTopic.questions.filter((q) => q.type === tab).length;
                return (
                  <button
                    key={tab}
                    className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ""}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === "all" ? "ALL" : QUESTION_CONFIG[tab].label}
                    <span className={styles.tabCount}>{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Questions */}
            <div className={styles.questionsList}>
              {filteredQuestions.map((q, idx) => (
                <QuestionItem
                  key={q.id}
                  question={q}
                  index={idx + 1}
                  isAnswered={answeredQuestions.has(q.id)}
                  isCorrect={correctAnswers.has(q.id)}
                  selectedOption={selectedOptionsMap[q.id] || null}
                  onAnswer={handleQuestionAnswered}
                />
              ))}
              {filteredQuestions.length === 0 && (
                <div className={styles.emptyQuestions}>
                  <p>No questions of this type.</p>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * QuestionItem
 * ───────────────────────────────────────────────────────────────────────── */
interface QuestionItemProps {
  question: Question;
  index: number;
  isAnswered: boolean;
  isCorrect: boolean;
  selectedOption: string | null;
  onAnswer: (questionId: string, isCorrect: boolean, selectedOpt?: string) => void;
}

function QuestionItem({ question, index, isAnswered, isCorrect, selectedOption: initialSelected, onAnswer }: QuestionItemProps) {
  const [showAnswer, setShowAnswer]     = useState(isAnswered);
  const [selectedOption, setSelectedOption] = useState<string | null>(initialSelected || null);
  const config = QUESTION_CONFIG[question.type];

  useEffect(() => {
    if (isAnswered) setShowAnswer(true);
    if (initialSelected) setSelectedOption(initialSelected);
  }, [isAnswered, initialSelected]);

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };

  const handleRevealAnswer = () => {
    if (!showAnswer) {
      setShowAnswer(true);
      if (!isAnswered) {
        if (question.type === "mcq") {
          onAnswer(question.id, selectedOption === question.correctAnswer, selectedOption || undefined);
        } else {
          onAnswer(question.id, true);
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
      <div className={styles.questionCardHeader}>
        <span
          className={styles.badge}
          style={{ background: `${config.color}18`, color: config.color, border: `1px solid ${config.color}30` }}
        >
          {config.icon} {config.label}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className={styles.questionNum}>Q{index}</span>
          <span className={styles.points}>+{config.points} pts</span>
        </div>
      </div>

      {/* Question text — through parseMarkdown for LaTeX support */}
      <div
        className={styles.questionText}
        dangerouslySetInnerHTML={{ __html: parseMarkdown(question.question) }}
      />

      {question.type === "mcq" && question.options && (
        <ul className={styles.optionsList}>
          {question.options.map((opt, i) => {
            const isSelected    = selectedOption === opt;
            const isCorrectOpt  = showAnswer && opt === question.correctAnswer;
            const isWrong       = showAnswer && isSelected && opt !== question.correctAnswer;

            return (
              <li key={i}>
                <button
                  className={`${styles.optionButton} ${isSelected ? styles.optionSelected : ""} ${isCorrectOpt ? styles.optionCorrect : ""} ${isWrong ? styles.optionWrong : ""}`}
                  onClick={() => handleOptionSelect(opt)}
                  disabled={isAnswered}
                >
                  <span className={styles.optionLetter}>{String.fromCharCode(65 + i)}</span>
                  {/* Option text through parseMarkdown for inline formula support */}
                  <span
                    className={styles.optionText}
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(opt) }}
                  />
                  {isCorrectOpt && <span>✓</span>}
                  {isWrong && <span>✗</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <button
        onClick={handleRevealAnswer}
        className={styles.revealBtn}
        style={{ borderColor: `${config.color}50`, color: config.color }}
        disabled={question.type === "mcq" && !selectedOption && !showAnswer}
      >
        {showAnswer
          ? "Hide Explanation"
          : question.type === "mcq"
          ? "Check Answer"
          : "Reveal Answer & Explanation"}
      </button>

      {showAnswer && (
        <div className={styles.answerBox}>
          <div className={styles.correctAnswer}>
            <strong style={{ color: "#10b981" }}>✓ Correct Answer:</strong>
            {/* Correct answer through parseMarkdown for LaTeX formula support */}
            <span dangerouslySetInnerHTML={{ __html: parseMarkdown(question.correctAnswer) }} />
          </div>
          <div className={styles.explanation}>
            <strong>📖 Explanation:</strong>
            {/* Explanation through parseMarkdown for full LaTeX and formatting support */}
            <span dangerouslySetInnerHTML={{ __html: parseMarkdown(question.explanation) }} />
          </div>
        </div>
      )}
    </div>
  );
}
