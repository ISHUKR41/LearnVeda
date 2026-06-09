/**
 * FILE: ChapterPracticeClient.tsx
 * LOCATION: src/app/class-10/[subject]/[chapter]/ChapterPracticeClient.tsx
 * PURPOSE: Interactive client-side quiz engine for Class 10 Chapter Practice.
 *          Renders MCQ options, provides feedback on submission, updates XP points,
 *          and shows a completion summary.
 * USED BY: src/app/class-10/[subject]/[chapter]/page.tsx
 * DEPENDENCIES: React, CSS modules, Next.js navigation components
 * LAST UPDATED: 2026-05-20
 * AUTHOR NOTE: Fully self-contained interactive component with high-end animations and premium visuals tailored for Class 10.
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./ChapterPractice.module.css";

interface Question {
  id: string;
  text: string;
  difficulty: "easy" | "medium" | "hard";
  options: string[];
  answer: string;
  explanation: string;
  points: number;
  youtubeHintUrl: string | null;
}

interface ChapterPracticeSnapshot {
  subjectName: string;
  chapterName: string;
  chapterDescription: string;
  chapterDifficulty: "easy" | "medium" | "hard";
  chapterDays: number;
  chapterQuestionCount: number;
  questions: Question[];
}

interface ChapterPracticeClientProps {
  snapshot: ChapterPracticeSnapshot;
  backUrl: string;
}

export default function ChapterPracticeClient({ snapshot, backUrl }: ChapterPracticeClientProps) {
  const { questions, subjectName, chapterName } = snapshot;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [showHint, setShowHint] = useState(false);

  // If there are no questions, display fallback empty state.
  if (!questions || questions.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyCard}>
          <div className={styles.emptyIcon}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className={styles.emptyTitle}>No Questions Available</h2>
          <p className={styles.emptyDesc}>
            Practice questions for {chapterName} are currently under curation. Check back soon for concept-based questions!
          </p>
          <Link href={backUrl} className={styles.backButton}>
            Back to Curriculum
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const progressPercent = Math.round((currentIdx / questions.length) * 100);

  const handleOptionSelect = (option: string) => {
    if (isSubmitted) return;
    setSelectedOption(option);
    setShowHint(false);
  };

  const handleSubmit = async () => {
    if (!selectedOption || isSubmitted) return;

    const correct = selectedOption === currentQuestion.answer;
    setIsCorrect(correct);
    setIsSubmitted(true);
    setShowExplanation(true);

    const questionId = currentQuestion.id;
    const currentAttempts = (attempts[questionId] || 0) + 1;
    setAttempts({ ...attempts, [questionId]: currentAttempts });

    let pointsAwarded = 0;
    if (correct) {
      setScore((prev) => prev + 1);
      pointsAwarded = currentAttempts === 1 ? currentQuestion.points : Math.round(currentQuestion.points / 2);
      setXpEarned((prev) => prev + pointsAwarded);
    }

    try {
      await fetch("/api/progress/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterId: "light-reflection-and-refraction", // using default or derive from props
          topicId: "chapter-practice",
          questionId,
          userAnswer: selectedOption,
          isCorrect: correct,
          timeSpent: 10, // dummy value for now
          questionType: "mcq"
        }),
      });
    } catch (e) {
      console.error("Failed to sync progress:", e);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsCorrect(null);
    setShowExplanation(false);
    setShowHint(false);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handleRetryQuestion = () => {
    const questionId = currentQuestion.id;
    setAttempts({ ...attempts, [questionId]: (attempts[questionId] || 0) + 1 });
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsCorrect(null);
    setShowExplanation(false);
  };

  const handleResetPractice = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsCorrect(null);
    setScore(0);
    setXpEarned(0);
    setShowExplanation(false);
    setShowSummary(false);
    setAttempts({});
    setShowHint(false);
  };

  if (showSummary) {
    const accuracy = Math.round((score / questions.length) * 100);
    return (
      <div className={styles.container}>
        <div className={styles.summaryCard}>
          <div className={styles.trophyWrapper}>
            <div className={styles.trophyGlow}></div>
            <svg className={styles.trophyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-5.25c-.621 0-1.125.504-1.125 1.125v3.375m9 0H7.5m9-13.5h3.75c.621 0 1.125.504 1.125 1.125V8.25c0 .621-.504 1.125-1.125 1.125H16.5M7.5 5.25h-3.75A1.125 1.125 0 002.625 6.375V8.25c0 .621.504 1.125 1.125 1.125H7.5m3-3.75h3m-3 0a1.5 1.5 0 00-3 3v3.75m9-6.75a1.5 1.5 0 013 3v3.75m-9 0h3" />
            </svg>
          </div>

          <h1 className={styles.summaryTitle}>Practice Completed!</h1>
          <p className={styles.summarySubtitle}>
            Great job finishing the practice questions for <strong>{chapterName}</strong>. Keep up the consistent study!
          </p>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Score</div>
              <div className={styles.statValue}>{score} / {questions.length}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Accuracy</div>
              <div className={styles.statValue}>{accuracy}%</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Total XP</div>
              <div className={styles.statValue} style={{ color: "var(--color-accent)" }}>+{xpEarned} XP</div>
            </div>
          </div>

          <div className={styles.summaryActions}>
            <button onClick={handleResetPractice} className={styles.primaryButton}>
              Practice Again
            </button>
            <Link href={backUrl} className={styles.secondaryButton}>
              Back to Subject
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const questionAttempts = attempts[currentQuestion.id] || 0;

  return (
    <div className={styles.container}>
      {/* Header Info */}
      <div className={styles.header}>
        <Link href={backUrl} className={styles.backLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Subject
        </Link>
        <div className={styles.metaInfo}>
          <span className={styles.subjectTag}>{subjectName}</span>
          <span className={styles.chapterTag}>{chapterName}</span>
        </div>
      </div>

      {/* Progress & Score Bar */}
      <div className={styles.progressSection}>
        <div className={styles.progressRow}>
          <span className={styles.progressText}>Question {currentIdx + 1} of {questions.length}</span>
          <span className={styles.xpCounter}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--color-accent)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.214.172a3.25 3.25 0 104.572-4.574A3.25 3.25 0 008.25 10.5h1.5a3.25 3.25 0 114.573 4.574L12 14.182z" />
            </svg>
            <strong>{xpEarned} XP</strong>
          </span>
        </div>
        <div className={styles.progressBarBg}>
          <div className={styles.progressBarFill} style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {/* Main Question Panel */}
      <div className={styles.quizPanel}>
        <div className={styles.questionHeader}>
          <span className={`${styles.difficultyBadge} ${styles[`difficulty-${currentQuestion.difficulty}`]}`}>
            {currentQuestion.difficulty}
          </span>
          <span className={styles.pointsBadge}>+{currentQuestion.points} XP</span>
        </div>

        <h2 className={styles.questionText}>{currentQuestion.text}</h2>

        {/* Options */}
        <div className={styles.optionsList}>
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const optionLetter = String.fromCharCode(65 + idx);

            let optionClass = styles.optionItem;
            if (isSelected) optionClass += ` ${styles.selected}`;
            
            if (isSubmitted) {
              if (option === currentQuestion.answer) {
                optionClass += ` ${styles.correct}`;
              } else if (isSelected && !isCorrect) {
                optionClass += ` ${styles.incorrect}`;
              } else {
                optionClass += ` ${styles.disabled}`;
              }
            }

            return (
              <button
                key={option}
                onClick={() => handleOptionSelect(option)}
                disabled={isSubmitted}
                className={optionClass}
              >
                <span className={styles.optionLetter}>{optionLetter}</span>
                <span className={styles.optionText}>{option}</span>
                {isSubmitted && option === currentQuestion.answer && (
                  <span className={styles.statusIndicator}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{ color: "var(--color-success)" }}>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
                {isSubmitted && isSelected && !isCorrect && (
                  <span className={styles.statusIndicator}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{ color: "var(--color-danger)" }}>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Panel */}
        <div className={styles.actionPanel}>
          {!isSubmitted ? (
            <div className={styles.actionRow}>
              <button
                onClick={() => setShowHint(!showHint)}
                className={styles.hintToggle}
              >
                {showHint ? "Hide Hint" : "Show Hint"}
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedOption}
                className={styles.submitButton}
              >
                Submit Answer
              </button>
            </div>
          ) : (
            <div className={styles.actionRow}>
              {!isCorrect && questionAttempts < 2 && (
                <button
                  onClick={handleRetryQuestion}
                  className={styles.retryButton}
                >
                  Try Again
                </button>
              )}
              <button
                onClick={handleNext}
                className={styles.nextButton}
              >
                {currentIdx + 1 === questions.length ? "Finish Practice" : "Next Question"}
              </button>
            </div>
          )}
        </div>

        {/* Hint Box */}
        {showHint && (
          <div className={styles.hintBox}>
            <div className={styles.hintTitle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
              </svg>
              Quick Hint
            </div>
            <p className={styles.hintText}>
              Read the options carefully and look for basic definitions. If you get stuck, try answering to see the detailed explanation!
            </p>
          </div>
        )}

        {/* Explanation Panel */}
        {showExplanation && (
          <div className={`${styles.explanationBox} ${isCorrect ? styles.expCorrect : styles.expIncorrect}`}>
            <h3 className={styles.explanationTitle}>
              {isCorrect ? "Correct! Well done." : "Incorrect Answer"}
            </h3>
            <p className={styles.explanationText}>{currentQuestion.explanation}</p>
            {currentQuestion.youtubeHintUrl && (
              <a
                href={currentQuestion.youtubeHintUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.videoLink}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#FF0000" }}>
                  <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.5 12 3.5 12 3.5s-7.517 0-9.388.553a3.002 3.002 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.553 9.388.553 9.388.553s7.518 0 9.388-.553a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                Watch concept video hint on YouTube
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
