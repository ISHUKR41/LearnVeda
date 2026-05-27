/**
 * FILE: MCQClient.tsx
 * LOCATION: src/app/mcqs/[slug]/MCQClient.tsx
 * PURPOSE: Interactive client-side quiz manager for programmatic MCQs.
 *          Handles selection state, immediate evaluation with visual success/error cues,
 *          accumulated scoreboard tracking, and premium completion dashboards.
 *
 * LAYOUT INTERACTIVE TRIGGERS:
 *  - High-performance button transitions using custom class bindings.
 *  - Displays explanation blocks on check-answer to drive learning intent.
 *  - Responsive reset and next selectors.
 *
 * DEPENDENCIES: programmatic-data.ts, MCQPage.module.css, React
 * LAST UPDATED: 2026-05-26
 */

"use client";

import { useState } from "react";
import styles from "./MCQPage.module.css";
import { ProgrammaticMCQItem } from "@/lib/server/seo/programmatic-data";

interface MCQClientProps {
  questions: ProgrammaticMCQItem[];
}

export default function MCQClient({ questions }: MCQClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (option: string) => {
    if (isChecked) return; // Prevent changing choice after check
    setSelectedOption(option);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption || isChecked) return;

    setIsChecked(true);
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
      setXp((prev) => prev + currentQuestion.points);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsChecked(false);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsChecked(false);
    setScore(0);
    setXp(0);
    setIsCompleted(false);
  };

  if (isCompleted) {
    return (
      <div className={styles.completionCard}>
        <div className={styles.trophyIcon}>🏆</div>
        <h2 className={styles.completionTitle}>Assessment Complete!</h2>
        <p className={styles.completionText}>You have completed this curriculum practice module successfully.</p>
        
        <div className={styles.scoreBanner}>
          <div className={styles.scoreStat}>
            <span className={styles.statVal}>{score} / {questions.length}</span>
            <span className={styles.statLabel}>Total Score</span>
          </div>
          <div className={styles.scoreStat}>
            <span className={styles.statVal}>+{xp} XP</span>
            <span className={styles.statLabel}>XP Gained</span>
          </div>
        </div>

        <div>
          <button className={styles.resetButton} onClick={handleReset}>
            Practice Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mcqCard}>
      {/* Quiz Progress & Scoreboard */}
      <div className={styles.statusBar}>
        <span className={styles.progressText}>
          Question {currentIndex + 1} of {questions.length}
        </span>
        <span className={styles.scoreBadge}>
          {xp} XP Earned
        </span>
      </div>

      {/* Question Text */}
      <div className={styles.questionText}>
        {currentQuestion.questionText}
      </div>

      {/* Answers Options Grid */}
      <div className={styles.optionsGrid}>
        {currentQuestion.options.map((option, idx) => {
          let optionClass = styles.optionButton;
          
          if (isChecked) {
            if (option === currentQuestion.correctAnswer) {
              optionClass = `${styles.optionButton} ${styles.correctOption}`;
            } else if (selectedOption === option) {
              optionClass = `${styles.optionButton} ${styles.wrongOption}`;
            }
          } else if (selectedOption === option) {
            /* Selected but not yet checked — show active highlight */
            optionClass = `${styles.optionButton} ${styles.selectedOption}`;
          }

          return (
            <button
              key={idx}
              className={optionClass}
              onClick={() => handleOptionClick(option)}
              disabled={isChecked}
            >
              <span>{option}</span>
              {isChecked && option === currentQuestion.correctAnswer && (
                <span className={styles.correctLabel}>✓ Correct</span>
              )}
              {isChecked && selectedOption === option && option !== currentQuestion.correctAnswer && (
                <span className={styles.incorrectLabel}>✗ Incorrect</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Check Answer or Next Button trigger */}
      {!isChecked ? (
        <button
          className={styles.nextButton}
          onClick={handleCheckAnswer}
          disabled={!selectedOption}
          style={{ opacity: selectedOption ? 1 : 0.6, cursor: selectedOption ? "pointer" : "not-allowed" }}
        >
          Check Answer
        </button>
      ) : (
        <button className={styles.nextButton} onClick={handleNext}>
          {currentIndex + 1 === questions.length ? "Finish Assessment" : "Next Question"}
        </button>
      )}

      {/* Explanation Details Block */}
      {isChecked && (
        <div className={styles.explanationBox}>
          <h4 className={styles.explanationTitle}>Explanation & Syllabus Mapping:</h4>
          <p className={styles.explanationText}>{currentQuestion.explanation}</p>
        </div>
      )}
    </div>
  );
}
