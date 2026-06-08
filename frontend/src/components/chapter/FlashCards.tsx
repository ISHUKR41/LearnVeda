/**
 * FILE: FlashCards.tsx
 * PURPOSE: Advanced SM-2 Spaced Repetition flashcard system.
 *          Implements the SuperMemo SM-2 algorithm for scientifically proven
 *          long-term memory retention. Each card is graded on 4 levels
 *          (Again / Hard / Good / Easy) which adjusts review intervals using
 *          the SM-2 ease factor formula.
 *
 * FEATURES:
 *   - Full SM-2 spaced repetition (interval, ease factor, repetition count)
 *   - 4-button grading: Again (1) · Hard (3) · Good (4) · Easy (5)
 *   - localStorage persistence — progress survives page reloads
 *   - Session stats: cards reviewed, accuracy %, streak
 *   - Daily study streak tracking (🔥 consecutive days)
 *   - Card difficulty indicators (🟢 easy · 🟡 moderate · 🔴 hard)
 *   - Leech detection: ⚠️ badge for cards reset 4+ times
 *   - Fisher-Yates shuffle for unbiased randomization
 *   - Keyboard shortcuts: Space = flip · 1/2/3/4 = grade
 *   - Daily new card limit: 20 cards per day (prevents review debt)
 *   - Smooth 3D CSS flip animation
 *
 * SM-2 ALGORITHM:
 *   After each review, grade 1-5 updates: interval I, ease factor EF, count n
 *   grade >= 3 → I = (n==0: 1, n==1: 6, else: round(I*EF)); n++; EF adjusted
 *   grade < 3  → n=0, I=1 (reset), lapses++
 *   EF = EF + 0.1 - (5-grade)*(0.08 + (5-grade)*0.02); EF = max(EF, 1.3)
 *
 * USED BY: TopicStudyClient.tsx
 * LAST UPDATED: 2026-06-08
 */

"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  Layers,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  Brain,
  Flame,
  BarChart2,
  Target,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import styles from "./FlashCards.module.css";

/* ─────────────────────────────────────────────
 * Types
 * ───────────────────────────────────────────── */

/** A single flash card with front/back text */
export interface FlashCardData {
  id: string;
  front: string;
  back: string;
}

/** SM-2 state stored per card in localStorage */
interface SM2State {
  n: number;        // repetition count
  EF: number;       // ease factor (2.5 default)
  I: number;        // interval in days
  due: number;      // next due timestamp (ms)
  lapses: number;   // times card was reset (Again pressed)
}

/** Active session stats */
interface SessionStats {
  reviewed: number;
  correct: number;   // grade >= 3
  newCards: number;
}

/* ─────────────────────────────────────────────
 * Constants
 * ───────────────────────────────────────────── */

const DAILY_NEW_LIMIT = 20;           // max new cards per day
const LEECH_THRESHOLD = 4;            // lapses before leech warning
const SM2_INITIAL_EF = 2.5;           // default ease factor
const SM2_MIN_EF = 1.3;               // minimum ease factor floor
const MS_PER_DAY = 86400000;

/* ─────────────────────────────────────────────
 * SM-2 Algorithm
 * ───────────────────────────────────────────── */

/** Compute new SM-2 state given a grade 1-5 */
function sm2Update(state: SM2State, grade: number): SM2State {
  const now = Date.now();
  let { n, EF, I, lapses } = state;

  if (grade >= 3) {
    // Correct: advance interval
    if (n === 0)      I = 1;
    else if (n === 1) I = 6;
    else              I = Math.round(I * EF);
    n++;
  } else {
    // Incorrect: reset
    n = 0;
    I = 1;
    lapses++;
  }

  // Update ease factor (SM-2 formula)
  EF = EF + 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02);
  EF = Math.max(EF, SM2_MIN_EF);

  const due = now + I * MS_PER_DAY;
  return { n, EF, I, due, lapses };
}

/** Get difficulty label from ease factor */
function getDifficulty(EF: number): "easy" | "medium" | "hard" {
  if (EF >= 2.5) return "easy";
  if (EF >= 1.8) return "medium";
  return "hard";
}

/* ─────────────────────────────────────────────
 * Fisher-Yates Shuffle
 * ───────────────────────────────────────────── */
function fisherYatesShuffle<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/* ─────────────────────────────────────────────
 * Component Props
 * ───────────────────────────────────────────── */
interface FlashCardsProps {
  cards: FlashCardData[];
  title?: string;
  /** Namespace for localStorage keys — should be unique per topic */
  storageKey?: string;
}

/* ═══════════════════════════════════════════════════
 * MAIN COMPONENT: FlashCards (SM-2 powered)
 * ═══════════════════════════════════════════════════ */
export default function FlashCards({
  cards,
  title = "Flash Cards",
  storageKey = "default",
}: FlashCardsProps) {

  /* ── SM-2 state map: cardId → SM2State ── */
  const [sm2Map, setSm2Map] = useState<Record<string, SM2State>>({});
  /* ── Card queue for current session ── */
  const [queue, setQueue] = useState<FlashCardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  /* ── Session tracking ── */
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    reviewed: 0,
    correct: 0,
    newCards: 0,
  });
  /* ── Study streak ── */
  const [streak, setStreak] = useState(0);
  /* ── View: study | stats ── */
  const [view, setView] = useState<"study" | "stats">("study");
  /* ── Graded animation feedback ── */
  const [lastGrade, setLastGrade] = useState<number | null>(null);
  const gradeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── localStorage key namespacing ── */
  const lsKey = `eduquest_fc_${storageKey}`;
  const streakKey = `eduquest_streak_${storageKey}`;

  /* ─────────────────────────────────────────────
   * EFFECT: Load SM-2 state + streak from localStorage
   * ───────────────────────────────────────────── */
  useEffect(() => {
    try {
      const savedSm2 = localStorage.getItem(lsKey);
      const parsedSm2: Record<string, SM2State> = savedSm2 ? JSON.parse(savedSm2) : {};

      // Initialize any new cards with fresh SM-2 state
      const initializedMap: Record<string, SM2State> = {};
      cards.forEach((c) => {
        initializedMap[c.id] = parsedSm2[c.id] || {
          n: 0,
          EF: SM2_INITIAL_EF,
          I: 0,
          due: 0,
          lapses: 0,
        };
      });
      setSm2Map(initializedMap);

      // Build session queue (due cards first, then shuffled new cards)
      buildQueue(cards, initializedMap);

      // Load streak
      const streakData = localStorage.getItem(streakKey);
      if (streakData) {
        const { count, lastStudyDay } = JSON.parse(streakData);
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - MS_PER_DAY).toDateString();
        if (lastStudyDay === today || lastStudyDay === yesterday) {
          setStreak(count);
        } else {
          setStreak(0); // streak broken
        }
      }
    } catch {
      // corrupt localStorage — start fresh
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards, lsKey]);

  /* ─────────────────────────────────────────────
   * Build session queue: due cards first, then new
   * ───────────────────────────────────────────── */
  function buildQueue(
    allCards: FlashCardData[],
    stateMap: Record<string, SM2State>
  ) {
    const now = Date.now();

    // Split into due (review) and new cards
    const dueCards = allCards
      .filter((c) => stateMap[c.id]?.n > 0 && stateMap[c.id]?.due <= now)
      .sort((a, b) => (stateMap[a.id]?.due ?? 0) - (stateMap[b.id]?.due ?? 0));

    const newCards = fisherYatesShuffle(
      allCards.filter((c) => !stateMap[c.id] || stateMap[c.id].n === 0)
    ).slice(0, DAILY_NEW_LIMIT);

    setQueue([...dueCards, ...newCards]);
    setCurrentIndex(0);
    setIsFlipped(false);
  }

  /* ─────────────────────────────────────────────
   * Persist SM-2 map to localStorage
   * ───────────────────────────────────────────── */
  function persistSm2(newMap: Record<string, SM2State>) {
    try {
      localStorage.setItem(lsKey, JSON.stringify(newMap));
    } catch { /* storage full */ }
  }

  /* ─────────────────────────────────────────────
   * Update streak on any review
   * ───────────────────────────────────────────── */
  function touchStreak(currentStreak: number) {
    const today = new Date().toDateString();
    try {
      const data = localStorage.getItem(streakKey);
      if (data) {
        const { lastStudyDay, count } = JSON.parse(data);
        if (lastStudyDay === today) return; // already studied today
        const yesterday = new Date(Date.now() - MS_PER_DAY).toDateString();
        const newCount = lastStudyDay === yesterday ? count + 1 : 1;
        setStreak(newCount);
        localStorage.setItem(streakKey, JSON.stringify({ count: newCount, lastStudyDay: today }));
      } else {
        setStreak(1);
        localStorage.setItem(streakKey, JSON.stringify({ count: 1, lastStudyDay: today }));
      }
    } catch { /* ignore */ }
  }

  /* ─────────────────────────────────────────────
   * Grade a card (Again=1, Hard=3, Good=4, Easy=5)
   * ───────────────────────────────────────────── */
  const gradeCard = useCallback(
    (grade: number) => {
      const card = queue[currentIndex];
      if (!card) return;

      const prevState = sm2Map[card.id] || { n: 0, EF: SM2_INITIAL_EF, I: 0, due: 0, lapses: 0 };
      const newState = sm2Update(prevState, grade);

      const updatedMap = { ...sm2Map, [card.id]: newState };
      setSm2Map(updatedMap);
      persistSm2(updatedMap);

      // Update session stats
      const isNew = prevState.n === 0;
      setSessionStats((prev) => ({
        reviewed: prev.reviewed + 1,
        correct: grade >= 3 ? prev.correct + 1 : prev.correct,
        newCards: isNew ? prev.newCards + 1 : prev.newCards,
      }));

      // Touch streak
      touchStreak(streak);

      // Show grade animation
      setLastGrade(grade);
      if (gradeTimerRef.current) clearTimeout(gradeTimerRef.current);
      gradeTimerRef.current = setTimeout(() => setLastGrade(null), 600);

      // Advance to next card
      setIsFlipped(false);
      if (currentIndex < queue.length - 1) {
        setCurrentIndex((i) => i + 1);
      }
    },
    [queue, currentIndex, sm2Map, streak]
  );

  /* ─────────────────────────────────────────────
   * Navigation (browse mode — no SM-2)
   * ───────────────────────────────────────────── */
  const goNext = useCallback(() => {
    if (currentIndex < queue.length - 1) {
      setIsFlipped(false);
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, queue.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  const handleShuffle = useCallback(() => {
    setQueue(fisherYatesShuffle(queue));
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [queue]);

  const handleReset = useCallback(() => {
    try { localStorage.removeItem(lsKey); } catch { /* ignore */ }
    const freshMap: Record<string, SM2State> = {};
    cards.forEach((c) => {
      freshMap[c.id] = { n: 0, EF: SM2_INITIAL_EF, I: 0, due: 0, lapses: 0 };
    });
    setSm2Map(freshMap);
    setSessionStats({ reviewed: 0, correct: 0, newCards: 0 });
    buildQueue(cards, freshMap);
  }, [cards, lsKey]);

  /* ─────────────────────────────────────────────
   * Keyboard shortcuts
   * ───────────────────────────────────────────── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === "TEXTAREA") return;
      if (e.key === "ArrowLeft")  goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setIsFlipped((f) => !f);
      } else if (e.key === "1" && isFlipped) gradeCard(1); // Again
      else if (e.key === "2" && isFlipped) gradeCard(3);   // Hard
      else if (e.key === "3" && isFlipped) gradeCard(4);   // Good
      else if (e.key === "4" && isFlipped) gradeCard(5);   // Easy
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goPrev, goNext, gradeCard, isFlipped]);

  /* ─────────────────────────────────────────────
   * Derived values
   * ───────────────────────────────────────────── */
  const accuracy = sessionStats.reviewed > 0
    ? Math.round((sessionStats.correct / sessionStats.reviewed) * 100)
    : 0;

  const progressPercent = queue.length > 0
    ? Math.round((currentIndex / queue.length) * 100)
    : 0;

  const dueCount = useMemo(() => {
    const now = Date.now();
    return cards.filter((c) => sm2Map[c.id]?.n > 0 && sm2Map[c.id]?.due <= now).length;
  }, [cards, sm2Map]);

  /* ─────────────────────────────────────────────
   * Early return — no cards
   * ───────────────────────────────────────────── */
  if (!cards || cards.length === 0) return null;
  if (queue.length === 0) {
    // All cards studied — show completion screen
    return (
      <div className={styles.container}>
        <div className={styles.completionScreen}>
          <div className={styles.completionIcon}><CheckCircle size={48} /></div>
          <h3 className={styles.completionTitle}>All caught up! 🎉</h3>
          <p className={styles.completionDesc}>
            You have no cards due right now. Come back tomorrow for your next review session.
          </p>
          <div className={styles.completionStats}>
            <div className={styles.statPill}>
              <Brain size={14} /> {sessionStats.reviewed} reviewed
            </div>
            <div className={styles.statPill}>
              <Target size={14} /> {accuracy}% accuracy
            </div>
            {streak > 0 && (
              <div className={styles.statPill}>
                <Flame size={14} /> {streak}-day streak
              </div>
            )}
          </div>
          <button className={styles.resetBtn} onClick={handleReset}>
            <RotateCcw size={14} /> Study All Cards Again
          </button>
        </div>
      </div>
    );
  }

  const currentCard = queue[currentIndex];
  const cardState = sm2Map[currentCard?.id] || { n: 0, EF: SM2_INITIAL_EF, I: 0, due: 0, lapses: 0 };
  const difficulty = getDifficulty(cardState.EF);
  const isLeech = cardState.lapses >= LEECH_THRESHOLD;
  const isSessionDone = currentIndex >= queue.length;

  /* ─────────────────────────────────────────────
   * RENDER
   * ───────────────────────────────────────────── */
  return (
    <div className={styles.container}>

      {/* ── HEADER ── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3 className={styles.title}>
            <Layers size={18} className={styles.titleIcon} />
            {title}
          </h3>
          {streak > 0 && (
            <span className={styles.streakBadge}>
              <Flame size={13} /> {streak}d streak
            </span>
          )}
        </div>
        <div className={styles.headerRight}>
          <span className={styles.counter}>{currentIndex + 1} / {queue.length}</span>
          <button
            className={styles.iconBtn}
            onClick={() => setView(view === "study" ? "stats" : "study")}
            title="View stats"
          >
            <BarChart2 size={16} />
          </button>
        </div>
      </div>

      {/* ── STATS OVERLAY ── */}
      {view === "stats" && (
        <div className={styles.statsPanel}>
          <button className={styles.statsPanelClose} onClick={() => setView("study")}>✕ Close</button>
          <h4 className={styles.statsPanelTitle}>Session Statistics</h4>
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <span className={styles.statValue}>{sessionStats.reviewed}</span>
              <span className={styles.statLabel}>Cards Reviewed</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statValue}>{accuracy}%</span>
              <span className={styles.statLabel}>Accuracy</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statValue}>{dueCount}</span>
              <span className={styles.statLabel}>Due Now</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statValue}>{streak}</span>
              <span className={styles.statLabel}>Day Streak</span>
            </div>
          </div>

          {/* Difficulty breakdown */}
          <div className={styles.diffBreakdown}>
            {["easy", "medium", "hard"].map((d) => {
              const count = cards.filter((c) => getDifficulty(sm2Map[c.id]?.EF ?? SM2_INITIAL_EF) === d).length;
              return (
                <div key={d} className={`${styles.diffBox} ${styles[`diff_${d}`]}`}>
                  <span className={styles.diffCount}>{count}</span>
                  <span className={styles.diffLabel}>{d}</span>
                </div>
              );
            })}
          </div>

          <button className={styles.resetBtn} onClick={handleReset}>
            <RotateCcw size={13} /> Reset All Progress
          </button>
        </div>
      )}

      {/* ── PROGRESS BAR ── */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
        </div>
        <span className={styles.progressLabel}>{progressPercent}%</span>
      </div>

      {/* ── CARD BADGES ── */}
      {currentCard && (
        <div className={styles.cardMeta}>
          <span className={`${styles.diffDot} ${styles[`diffDot_${difficulty}`]}`} title={`Difficulty: ${difficulty}`} />
          {isLeech && (
            <span className={styles.leechBadge} title="Leech — this card is frequently forgotten">
              <AlertTriangle size={11} /> Leech
            </span>
          )}
          {cardState.n === 0 && <span className={styles.newBadge}>NEW</span>}
          {cardState.n > 0 && cardState.due <= Date.now() && <span className={styles.dueBadge}>DUE</span>}
          {cardState.I > 0 && <span className={styles.intervalBadge}>next in {cardState.I}d</span>}
        </div>
      )}

      {/* ── 3D FLIP CARD ── */}
      {currentCard && (
        <div
          className={`${styles.cardViewport} ${lastGrade !== null ? (lastGrade >= 3 ? styles.gradeCorrect : styles.gradeWrong) : ""}`}
          onClick={() => setIsFlipped((f) => !f)}
        >
          <div className={`${styles.cardWrapper} ${isFlipped ? styles.flipped : ""}`}>
            {/* Front Face */}
            <div className={`${styles.cardFace} ${styles.cardFront}`}>
              <span className={styles.cardLabel}>Question</span>
              <div className={styles.cardContent}>{currentCard.front}</div>
              <span className={styles.flipHint}>
                <RotateCcw size={12} /> Click or press Space to reveal answer
              </span>
            </div>
            {/* Back Face */}
            <div className={`${styles.cardFace} ${styles.cardBack}`}>
              <span className={styles.cardLabel}>Answer</span>
              <div className={styles.cardContent}>{currentCard.back}</div>
              {isFlipped && (
                <span className={styles.flipHint} style={{ color: "#6ee7b7" }}>
                  Rate your recall below ↓
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── GRADING BUTTONS (shown when flipped) ── */}
      {isFlipped && (
        <div className={styles.gradePanel}>
          <span className={styles.gradePanelLabel}>How well did you recall?</span>
          <div className={styles.gradeBtns}>
            <button
              className={`${styles.gradeBtn} ${styles.gradeBtnAgain}`}
              onClick={(e) => { e.stopPropagation(); gradeCard(1); }}
              title="Press 1"
            >
              <span className={styles.gradeBtnIcon}>✗</span>
              <span className={styles.gradeBtnLabel}>Again</span>
              <kbd>1</kbd>
            </button>
            <button
              className={`${styles.gradeBtn} ${styles.gradeBtnHard}`}
              onClick={(e) => { e.stopPropagation(); gradeCard(3); }}
              title="Press 2"
            >
              <span className={styles.gradeBtnIcon}>~</span>
              <span className={styles.gradeBtnLabel}>Hard</span>
              <kbd>2</kbd>
            </button>
            <button
              className={`${styles.gradeBtn} ${styles.gradeBtnGood}`}
              onClick={(e) => { e.stopPropagation(); gradeCard(4); }}
              title="Press 3"
            >
              <span className={styles.gradeBtnIcon}>✓</span>
              <span className={styles.gradeBtnLabel}>Good</span>
              <kbd>3</kbd>
            </button>
            <button
              className={`${styles.gradeBtn} ${styles.gradeBtnEasy}`}
              onClick={(e) => { e.stopPropagation(); gradeCard(5); }}
              title="Press 4"
            >
              <span className={styles.gradeBtnIcon}>★</span>
              <span className={styles.gradeBtnLabel}>Easy</span>
              <kbd>4</kbd>
            </button>
          </div>
        </div>
      )}

      {/* ── NAVIGATION CONTROLS ── */}
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
          <Shuffle size={14} /> Shuffle
        </button>

        <button
          className={styles.navBtn}
          onClick={goNext}
          disabled={currentIndex >= queue.length - 1}
          aria-label="Next card"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* ── KEYBOARD HINTS ── */}
      <div className={styles.keyboardHints}>
        <span className={styles.keyHint}><kbd>←</kbd> Prev</span>
        <span className={styles.keyHint}><kbd>Space</kbd> Flip</span>
        <span className={styles.keyHint}><kbd>→</kbd> Next</span>
        {isFlipped && <span className={styles.keyHint}><kbd>1-4</kbd> Grade</span>}
      </div>
    </div>
  );
}
