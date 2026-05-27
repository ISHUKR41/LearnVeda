/**
 * FILE: InterviewClient.tsx
 * LOCATION: src/app/interviews/[slug]/InterviewClient.tsx
 * PURPOSE: Scoped interactive accordion toggles manager for Technical Interview sheets.
 *          Maintains toggle expand states, SVG rotates, and renders embedded pre-formatted
 *          coding syntax blocks.
 *
 * LAYOUT INTERACTIVE TRIGGERS:
 *  - Slide toggles using reactive React maps.
 *  - High-performance visual height expand.
 *
 * DEPENDENCIES: programmatic-data.ts, InterviewPage.module.css, React
 * LAST UPDATED: 2026-05-26
 */

"use client";

import { useState } from "react";
import styles from "./InterviewPage.module.css";
import { InterviewQnA } from "@/lib/server/seo/programmatic-data";

interface InterviewClientProps {
  questions: InterviewQnA[];
}

export default function InterviewClient({ questions }: InterviewClientProps) {
  // Store the open states of each index in a map record
  const [openIndexes, setOpenIndexes] = useState<Record<number, boolean>>({
    0: true, // Keep the first interview QnA expanded by default for ideal UX
  });

  const toggleIndex = (index: number) => {
    setOpenIndexes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className={styles.accordionsList}>
      {questions.map((item, index) => {
        const isOpen = !!openIndexes[index];

        return (
          <div key={index} className={styles.accordionItem}>
            {/* Clickable question toggle trigger */}
            <button
              className={styles.accordionHeader}
              onClick={() => toggleIndex(index)}
              aria-expanded={isOpen}
            >
              <span className={styles.questionText}>{item.question}</span>
              <svg
                className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Answer body panel */}
            {isOpen && (
              <div className={styles.accordionContent}>
                <p className={styles.answerText}>{item.answer}</p>
                {item.codeSnippet && (
                  <pre className={styles.codeBox}>
                    <code>{item.codeSnippet.trim()}</code>
                  </pre>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
