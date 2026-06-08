/**
 * FILE: FlashCards.tsx
 * PURPOSE: Interactive 3D flip-card study component for chapter revision.
 *          Each card has a "Question/Term" front and an "Answer/Definition" back.
 *          Supports keyboard navigation (← → Space), shuffle, and progress tracking.
 *
 * FEATURES:
 *   - Smooth 3D CSS flip animation (perspective + rotateY)
 *   - Keyboard shortcuts: ← prev, → next, Space/Enter to flip
 *   - Shuffle button to randomize card order
 *   - Progress bar showing cards viewed
 *   - Responsive design for mobile and desktop
 *   - Lucide React icons for professional look
 *
 * USED BY: DeepResearchChapterClient.tsx
 * LAST UPDATED: 2026-06-08
 */

"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  Layers,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
} from "lucide-react";
import styles from "./FlashCards.module.css";

/* ── Data shape for a single flash card ── */
export interface FlashCardData {
  /** Unique identifier for this card */
  id: string;
  /** The front of the card — a question, term, or concept name */
  front: string;
  /** The back of the card — the answer, definition, or explanation */
  back: string;
}

/* ── Component Props ── */
interface FlashCardsProps {
  /** Array of flash card data to display */
  cards: FlashCardData[];
  /** Optional title override (defaults to "Flash Cards") */
  title?: string;
}

/* ── Fisher-Yates shuffle algorithm ── */
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function FlashCards({ cards, title = "Flash Cards" }: FlashCardsProps) {
  const [orderedCards, setOrderedCards] = useState<FlashCardData[]>(cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewedCards, setViewedCards] = useState<Set<number>>(new Set([0]));

  /* Track which cards have been viewed for progress */
  const progressPercent = useMemo(
    () => Math.round((viewedCards.size / orderedCards.length) * 100),
    [viewedCards, orderedCards.length]
  );

  /* Navigation handlers */
  const goNext = useCallback(() => {
    if (currentIndex < orderedCards.length - 1) {
      setIsFlipped(false);
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setViewedCards((prev) => new Set(prev).add(nextIdx));
    }
  }, [currentIndex, orderedCards.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const toggleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleShuffle = useCallback(() => {
    setOrderedCards(shuffleArray(cards));
    setCurrentIndex(0);
    setIsFlipped(false);
    setViewedCards(new Set([0]));
  }, [cards]);

  /* Keyboard navigation */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        toggleFlip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goPrev, goNext, toggleFlip]);

  if (!cards || cards.length === 0) return null;

  const currentCard = orderedCards[currentIndex];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>
          <span className={styles.titleIcon}>
            <Layers size={18} />
          </span>
          {title}
        </h3>
        <span className={styles.counter}>
          {currentIndex + 1} / {orderedCards.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 3D Flip Card */}
      <div className={styles.cardViewport} onClick={toggleFlip}>
        <div className={`${styles.cardWrapper} ${isFlipped ? styles.flipped : ""}`}>
          {/* Front Face */}
          <div className={`${styles.cardFace} ${styles.cardFront}`}>
            <span className={styles.cardLabel}>Question</span>
            <div className={styles.cardContent}>{currentCard.front}</div>
            <span className={styles.flipHint}>
              <RotateCcw size={12} /> Click or press Space to flip
            </span>
          </div>

          {/* Back Face */}
          <div className={`${styles.cardFace} ${styles.cardBack}`}>
            <span className={styles.cardLabel}>Answer</span>
            <div className={styles.cardContent}>{currentCard.back}</div>
            <span className={styles.flipHint}>
              <RotateCcw size={12} /> Click to flip back
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className={styles.controls}>
        <button
          className={styles.navBtn}
          onClick={goPrev}
          disabled={currentIndex === 0}
          aria-label="Previous card"
        >
          <ChevronLeft size={20} />
        </button>

        <button className={styles.shuffleBtn} onClick={handleShuffle}>
          <Shuffle size={16} /> Shuffle
        </button>

        <button
          className={styles.navBtn}
          onClick={goNext}
          disabled={currentIndex === orderedCards.length - 1}
          aria-label="Next card"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Keyboard hints */}
      <div className={styles.keyboardHints}>
        <span className={styles.keyHint}><kbd>←</kbd> Prev</span>
        <span className={styles.keyHint}><kbd>Space</kbd> Flip</span>
        <span className={styles.keyHint}><kbd>→</kbd> Next</span>
      </div>
    </div>
  );
}
