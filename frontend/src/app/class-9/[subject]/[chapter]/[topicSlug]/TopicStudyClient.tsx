/**
 * FILE: TopicStudyClient.tsx
 * LOCATION: src/app/class-9/[subject]/[chapter]/[topicSlug]/TopicStudyClient.tsx
 * PURPOSE: Interactive study and practice client interface for a single subtopic.
 *          Renders topic content, manages interactive quizzes, and tracks progress
 *          connected directly to the PostgreSQL database in real-time.
 * USED BY: page.tsx (SubtopicStudyPage)
 * LAST UPDATED: 2026-05-28
 */

"use client";

import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import styles from "./TopicStudy.module.css";
import type { Chapter, Topic, Question } from "@/lib/content/class9/science/force-and-laws-of-motion";
import { progressApi } from "@/lib/api/api";
import { toast } from "react-hot-toast";

interface TopicStudyClientProps {
  /** The full chapter data object */
  chapterData: Chapter;
  /** The active subtopic object to study */
  activeTopic: Topic;
  /** URL to navigate back to the chapter overview */
  backUrl: string;
}

const QUESTION_CONFIG = {
  mcq: { label: "MCQ", color: "#6366f1", points: 10, icon: "◉" },
  short: { label: "SHORT", color: "#10b981", points: 15, icon: "✎" },
  long: { label: "LONG", color: "#f59e0b", points: 20, icon: "✍" },
  thinking: { label: "HOTS", color: "#ef4444", points: 25, icon: "🧠" },
} as const;

export default function TopicStudyClient({ chapterData, activeTopic, backUrl }: TopicStudyClientProps) {
  /** Tracks which questions have been answered */
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());

  /** Tracks correct answers for score calculation */
  const [correctAnswers, setCorrectAnswers] = useState<Set<string>>(new Set());

  /** Active question filter tab (all, mcq, short, long, thinking) */
  const [activeTab, setActiveTab] = useState<"all" | "mcq" | "short" | "long" | "thinking">("all");

  /** Filter questions based on active tab */
  const filteredQuestions = useMemo(() => {
    if (activeTab === "all") return activeTopic.questions;
    return activeTopic.questions.filter((q) => q.type === activeTab);
  }, [activeTopic.questions, activeTab]);

  /** Find indices of current topic in chapter list for navigation */
  const currentIdx = useMemo(() => chapterData.topics.findIndex((t) => t.id === activeTopic.id), [chapterData.topics, activeTopic.id]);
  const prevTopic = chapterData.topics[currentIdx - 1] || null;
  const nextTopic = chapterData.topics[currentIdx + 1] || null;

  /** Handle marking a question as answered and pushing progress to database */
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
        // Since we are studying one topic, let's update progress on the whole chapter!
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

  /** Calculate progress percentages */
  const answeredCount = activeTopic.questions.filter((q) => answeredQuestions.has(q.id)).length;
  const correctCount = activeTopic.questions.filter((q) => correctAnswers.has(q.id)).length;
  const totalQuestions = activeTopic.questions.length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

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
        {/* Left Side: Study Content */}
        <section className={styles.studySection}>
          <div className={styles.card}>
            {activeTopic.imageUrl && (
              <div className={styles.heroImageWrapper}>
                <img
                  src={activeTopic.imageUrl}
                  alt={activeTopic.title}
                  className={styles.heroImage}
                />
                <div className={styles.heroOverlay} />
              </div>
            )}
            <div className={styles.cardContent}>
              <div className={styles.markdownBody} dangerouslySetInnerHTML={{ __html: parseMarkdown(activeTopic.content) }} />
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className={styles.pageNavigation}>
            {prevTopic ? (
              <Link href={`/class-9/science/force-and-laws-of-motion/${prevTopic.id}`} className={styles.navButton}>
                ← Previous: {prevTopic.title.replace(/^\d+\.\s*/, "")}
              </Link>
            ) : (
              <div />
            )}
            {nextTopic ? (
              <Link href={`/class-9/science/force-and-laws-of-motion/${nextTopic.id}`} className={`${styles.navButton} ${styles.navButtonPrimary}`}>
                Next: {nextTopic.title.replace(/^\d+\.\s*/, "")} →
              </Link>
            ) : (
              <Link href={backUrl} className={`${styles.navButton} ${styles.navButtonPrimary}`}>
                Finish Chapter! 🎓
              </Link>
            )}
          </div>
        </section>

        {/* Right Side: Interactive Practice Panel */}
        <aside className={styles.quizSection}>
          <div className={styles.stickyPanel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitleGroup}>
                <h3 className={styles.panelTitle}>Topic Practice</h3>
                <span className={styles.panelSubtitle}>Test your concepts in real-time</span>
              </div>
              <div className={styles.progressCircleContainer}>
                <div className={styles.progressTextGroup}>
                  <span className={styles.progressVal}>{progressPercent}%</span>
                  <span className={styles.progressLbl}>Done</span>
                </div>
              </div>
            </div>

            {/* Interactive Filters */}
            <div className={styles.tabsContainer}>
              {(["all", "mcq", "short", "long", "thinking"] as const).map((tab) => (
                <button
                  key={tab}
                  className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Questions List */}
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
                  <p>No questions of this type for this topic.</p>
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
 * parseMarkdown — Converts markdown content to HTML
 * ───────────────────────────────────────────── */
function parseMarkdown(text: string): string {
  let html = text
    .replace(/^#### (.*$)/gim, '<h4 class="md-h4">$1</h4>')
    .replace(/^### (.*$)/gim, '<h3 class="md-h3">$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
    .replace(/^> (.*$)/gim, '<blockquote class="md-quote">$1</blockquote>')
    .replace(/\$\$(.*?)\$\$/gim, '<code class="md-math-block">$1</code>')
    .replace(/\$(.*?)\$/gim, '<code class="md-math">$1</code>')
    .replace(/^\d+\. (.*$)/gim, '<li class="md-li-ordered">$1</li>')
    .replace(/^\* (.*$)/gim, '<li class="md-li">$1</li>')
    .replace(/\n\n/gim, "</p><p>")
    .replace(/\n/gim, "<br/>");

  return `<p>${html}</p>`;
}

/* ─────────────────────────────────────────────
 * QuestionItem Component
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
        const correct = selectedOption === question.correctAnswer;
        onAnswer(question.id, correct);
      } else {
        onAnswer(question.id, true);
      }
    } else {
      setShowAnswer(false);
    }
  };

  return (
    <div className={`${styles.questionCard} ${isAnswered ? (isCorrect ? styles.questionCorrect : styles.questionIncorrect) : ""}`}>
      <div className={styles.questionCardHeader}>
        <span className={styles.badge} style={{ background: `${config.color}15`, color: config.color }}>
          {config.icon} {config.label}
        </span>
        <span className={styles.points}>+{question.points || config.points} pts</span>
      </div>
      <p className={styles.questionText}>{question.question}</p>

      {question.type === "mcq" && question.options && (
        <ul className={styles.optionsList}>
          {question.options.map((opt, i) => {
            const isSelected = selectedOption === opt;
            const isCorrectOption = showAnswer && opt === question.correctAnswer;
            const isWrongSelection = showAnswer && isSelected && opt !== question.correctAnswer;

            return (
              <li key={i}>
                <button
                  className={`${styles.optionButton} ${isSelected ? styles.optionSelected : ""} ${isCorrectOption ? styles.optionCorrect : ""} ${isWrongSelection ? styles.optionWrong : ""}`}
                  onClick={() => handleOptionSelect(opt)}
                  disabled={isAnswered}
                >
                  <span className={styles.optionLetter}>{String.fromCharCode(65 + i)}</span>
                  <span className={styles.optionText}>{opt}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <button
        onClick={handleRevealAnswer}
        className={styles.revealBtn}
        disabled={question.type === "mcq" && !selectedOption && !showAnswer}
      >
        {showAnswer ? "Hide Explanation" : (question.type === "mcq" ? "Check Answer" : "Reveal Answer & Explanation")}
      </button>

      {showAnswer && (
        <div className={styles.answerBox}>
          <div className={styles.correctAnswer}>
            <strong>Correct Answer:</strong> {question.correctAnswer}
          </div>
          <div className={styles.explanation}>
            <strong>Explanation:</strong> {question.explanation}
          </div>
        </div>
      )}
    </div>
  );
}
