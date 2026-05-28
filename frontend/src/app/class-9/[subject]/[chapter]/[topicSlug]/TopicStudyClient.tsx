/**
 * FILE: TopicStudyClient.tsx
 * LOCATION: src/app/class-9/[subject]/[chapter]/[topicSlug]/TopicStudyClient.tsx
 * PURPOSE: Interactive study and practice client for a single subtopic.
 *          Uses real KaTeX math rendering, physics simulations, and saves
 *          all answered questions to PostgreSQL via progressApi.
 * LAST UPDATED: 2026-05-28
 */

"use client";

import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import styles from "./TopicStudy.module.css";
import type { Chapter, Topic, Question } from "@/lib/content/class9/science/force-and-laws-of-motion";
import { parseMarkdown } from "@/lib/utils/parseMarkdown";
import { progressApi } from "@/lib/api/api";
import { toast } from "react-hot-toast";
import TopicSimulation from "@/components/physics/PhysicsSimulation";

interface TopicStudyClientProps {
  chapterData: Chapter;
  activeTopic: Topic;
  backUrl: string;
}

const QUESTION_CONFIG = {
  mcq:      { label: "MCQ",   color: "#6366f1", points: 10, icon: "◉" },
  short:    { label: "SHORT", color: "#10b981", points: 15, icon: "✎" },
  long:     { label: "LONG",  color: "#f59e0b", points: 20, icon: "✍" },
  thinking: { label: "HOTS",  color: "#ef4444", points: 25, icon: "🧠" },
} as const;

export default function TopicStudyClient({ chapterData, activeTopic, backUrl }: TopicStudyClientProps) {
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [correctAnswers, setCorrectAnswers] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"all" | "mcq" | "short" | "long" | "thinking">("all");

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
    (questionId: string, isCorrect: boolean) => {
      setAnsweredQuestions((prev) => new Set(prev).add(questionId));

      if (isCorrect) {
        setCorrectAnswers((prev) => {
          const next = new Set(prev).add(questionId);
          const totalQuestions = chapterData.topics.reduce((acc, t) => acc + t.questions.length, 0);
          const newScore = Math.round((next.size / totalQuestions) * 100);
          const isCompleted = next.size === totalQuestions;

          progressApi
            .updateChapterProgress(chapterData.id, { completed: isCompleted, score: newScore })
            .then((res) => {
              if (res.data?.ok) {
                const d = res.data.data;
                if (d.leveledUp) toast.success(`🎉 Level Up! You are now Level ${d.newLevel}!`);
                else toast.success(`+${d.xpEarned} XP earned!`);
              }
            })
            .catch(console.error);

          return next;
        });
      } else {
        const totalQuestions = chapterData.topics.reduce((acc, t) => acc + t.questions.length, 0);
        const newScore = Math.round((correctAnswers.size / totalQuestions) * 100);
        progressApi
          .updateChapterProgress(chapterData.id, { completed: false, score: newScore })
          .catch(console.error);
      }
    },
    [correctAnswers, chapterData, answeredQuestions]
  );

  const answeredCount = activeTopic.questions.filter((q) => answeredQuestions.has(q.id)).length;
  const correctCount  = activeTopic.questions.filter((q) => correctAnswers.has(q.id)).length;
  const totalQuestions = activeTopic.questions.length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  /* Rendered content */
  const renderedContent = useMemo(
    () => parseMarkdown(activeTopic.content),
    [activeTopic.content]
  );

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
          <span className={styles.scoreValue}>{correctCount * 10} / {totalQuestions * 10} XP</span>
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

            {/* Physics Simulation */}
            <div className={styles.cardContent}>
              <TopicSimulation topicId={activeTopic.id} />

              {/* KaTeX-rendered markdown content */}
              <div
                className={styles.markdownBody}
                dangerouslySetInnerHTML={{ __html: renderedContent }}
              />
            </div>
          </div>

          {/* Topic navigation */}
          <div className={styles.pageNavigation}>
            {prevTopic ? (
              <Link
                href={`/class-9/science/force-and-laws-of-motion/${prevTopic.id}`}
                className={styles.navButton}
              >
                ← {prevTopic.title.replace(/^\d+\.\s*/, "")}
              </Link>
            ) : <div />}
            {nextTopic ? (
              <Link
                href={`/class-9/science/force-and-laws-of-motion/${nextTopic.id}`}
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

/* ─────────────────────────────────────────────
 * QuestionItem
 * ───────────────────────────────────────────── */
interface QuestionItemProps {
  question: Question;
  index: number;
  isAnswered: boolean;
  isCorrect: boolean;
  onAnswer: (questionId: string, isCorrect: boolean) => void;
}

function QuestionItem({ question, index, isAnswered, isCorrect, onAnswer }: QuestionItemProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const config = QUESTION_CONFIG[question.type];

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };

  const handleRevealAnswer = () => {
    if (!showAnswer) {
      setShowAnswer(true);
      if (question.type === "mcq") {
        onAnswer(question.id, selectedOption === question.correctAnswer);
      } else {
        onAnswer(question.id, true);
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
          <span className={styles.points}>+{question.points || config.points} pts</span>
        </div>
      </div>

      <p className={styles.questionText}>{question.question}</p>

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
                  <span className={styles.optionText}>{opt}</span>
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
            <strong style={{ color: "#10b981" }}>✓ Correct Answer:</strong> {question.correctAnswer}
          </div>
          <div className={styles.explanation}>
            <strong>📖 Explanation:</strong> {question.explanation}
          </div>
        </div>
      )}
    </div>
  );
}
