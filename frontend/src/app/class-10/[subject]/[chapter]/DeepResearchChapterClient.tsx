/**
 * FILE: DeepResearchChapterClient.tsx
 * LOCATION: src/app/class-10/[subject]/[chapter]/DeepResearchChapterClient.tsx
 * PURPOSE: Ultra-professional, fully animated, interactive study interface for
 *          the Light - Reflection and Refraction chapter (and all deep-research chapters).
 *
 * ARCHITECTURE:
 *   This is a "smart" client component that owns all local state:
 *   - Which topic is active (via sidebar)
 *   - Which study tab is open (Learn / Flash Cards / Mind Map / Practice / Exam Prep)
 *   - Which questions have been answered + which are correct
 *   - Running score + XP synced to PostgreSQL via /api/progress/answers
 *
 * FEATURES:
 *   ─ Animated chapter hero with glowing light-beam SVG animation
 *   ─ Left sidebar with circular SVG progress rings per topic
 *   ─ 5-tab study interface (Learn / Flash Cards / Mind Map / Practice / Exam Prep)
 *   ─ KaTeX-quality math rendering via parseMarkdown helper
 *   ─ Interactive flip flash cards with keyboard navigation
 *   ─ Expandable mind-map tree with animated branches
 *   ─ MCQ questions with instant correct/wrong feedback + XP toast
 *   ─ Short/Long/HOTS text questions with model answer reveal
 *   ─ Score bar with animated count-up in sticky header
 *   ─ Exam summary section with color-coded key point cards
 *   ─ Fully responsive (mobile sidebar toggle, stacked layout)
 *   ─ LocalStorage persistence (survives page refresh)
 *   ─ Score + XP synced to PostgreSQL on every correct answer
 *
 * SCORE → DASHBOARD FLOW:
 *   1. Student answers MCQ → handleQuestionAnswered() fires
 *   2. POST /api/progress/answers  → awards XP + Stars + updates streak
 *   3. PUT  /api/progress/chapters/[id] → upserts chapter completion %
 *   4. Dashboard GET /api/dashboard picks up fresh XP on next visit
 *
 * USED BY: page.tsx (Class 10 Chapter page server component)
 * DEPENDENCIES: FlashCards, MindMap, SimulationRenderer, parseMarkdown, react-hot-toast
 * LAST UPDATED: 2026-06-08
 */

"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import Link from "next/link";
import styles from "./DeepResearchChapter.module.css";
import type { Chapter, Topic, Question } from "@/lib/content/class10/science/shared-types";
import { parseMarkdown } from "@/lib/utils/parseMarkdown";
import SmartSimulationRenderer from "@/components/simulations/SmartSimulationRenderer";
import FlashCards from "@/components/chapter/FlashCards";
import MindMap from "@/components/chapter/MindMap";
import { getDiagramForTopic } from "@/components/chapter/light/TopicDiagrams";
import { toast } from "react-hot-toast";

/* ─────────────────────────────────────────────
 * TYPE: Study tab names
 * Each topic has 6 study modes the student can switch between.
 * "simulations" is the dedicated interactive physics lab tab.
 * ───────────────────────────────────────────── */
type StudyTab = "learn" | "simulations" | "flashcards" | "mindmap" | "practice" | "exam";

/* ─────────────────────────────────────────────
 * CONSTANTS: Question type configuration
 * Badge colors, labels, icons, and default point values.
 * ───────────────────────────────────────────── */
const QUESTION_CONFIG = {
  mcq:      { label: "MCQ",       color: "#818cf8", bgColor: "rgba(129,140,248,0.12)", points: 10, icon: "◉", emoji: "🔵" },
  short:    { label: "Short Ans", color: "#34d399", bgColor: "rgba(52,211,153,0.12)",  points: 15, icon: "✎", emoji: "🟢" },
  long:     { label: "Long Ans",  color: "#fbbf24", bgColor: "rgba(251,191,36,0.12)",  points: 20, icon: "✍", emoji: "🟡" },
  thinking: { label: "HOTS",      color: "#f87171", bgColor: "rgba(248,113,113,0.12)", points: 25, icon: "🧠", emoji: "🔴" },
} as const;

/* ─────────────────────────────────────────────
 * CONSTANTS: Tab configuration with icons + labels
 * 6 tabs — Learn, Simulations, Flash Cards, Mind Map, Practice, Exam Prep
 * ───────────────────────────────────────────── */
const TABS: { id: StudyTab; label: string; icon: string; description: string }[] = [
  { id: "learn",       label: "Learn",        icon: "📖", description: "Read detailed notes" },
  { id: "simulations", label: "Simulations",  icon: "🔬", description: "Interactive physics lab" },
  { id: "flashcards",  label: "Flash Cards",  icon: "🃏", description: "Quick revision cards" },
  { id: "mindmap",     label: "Mind Map",     icon: "🗺️", description: "Visual concept map" },
  { id: "practice",    label: "Practice",    icon: "❓", description: "Answer questions" },
  { id: "exam",        label: "Exam Prep",   icon: "📋", description: "Key exam points" },
];

/* ─────────────────────────────────────────────
 * COMPONENT PROPS
 * ───────────────────────────────────────────── */
interface DeepResearchChapterClientProps {
  /** The full chapter data object with all topics, questions, flash cards, mind maps */
  chapterData: Chapter;
  /** URL to navigate back to (e.g. "/class-10/science") */
  backUrl: string;
}

/* ═══════════════════════════════════════════════════
 * MAIN COMPONENT: DeepResearchChapterClient
 * ═══════════════════════════════════════════════════ */
export default function DeepResearchChapterClient({
  chapterData,
  backUrl,
}: DeepResearchChapterClientProps) {
  /* ── Active topic state ── */
  const [activeTopicId, setActiveTopicId] = useState<string>(
    chapterData.topics[0]?.id || ""
  );

  /* ── Active study tab state (default: learn) ── */
  const [activeTab, setActiveTab] = useState<StudyTab>("learn");

  /* ── Sidebar open/close on mobile ── */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ── Question answer tracking — persisted to localStorage ── */
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [correctAnswers, setCorrectAnswers]       = useState<Set<string>>(new Set());
  const [selectedOptionsMap, setSelectedOptionsMap] = useState<Record<string, string>>({});

  /* ── Content area ref for scroll-to-top on topic change ── */
  const contentRef = useRef<HTMLElement>(null);

  /* ── Hero visibility for animated entrance ── */
  const [heroVisible, setHeroVisible] = useState(false);

  /* ── Score animation ── */
  const [displayScore, setDisplayScore] = useState(0);

  /* ─────────────────────────────────────────────
   * EFFECT: Load persisted state from localStorage on mount
   * This restores the student's progress if they leave and come back.
   * ───────────────────────────────────────────── */
  useEffect(() => {
    const key = `eduquest_${chapterData.id}`;
    try {
      const answered  = localStorage.getItem(`${key}_answered`);
      const correct   = localStorage.getItem(`${key}_correct`);
      const selected  = localStorage.getItem(`${key}_selected`);
      if (answered)  setAnsweredQuestions(new Set(JSON.parse(answered)));
      if (correct)   setCorrectAnswers(new Set(JSON.parse(correct)));
      if (selected)  setSelectedOptionsMap(JSON.parse(selected));
    } catch {
      /* Corrupt localStorage — ignore, start fresh */
    }

    /* Trigger hero entrance animation after a short delay */
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, [chapterData.id]);

  /* ─────────────────────────────────────────────
   * DERIVED: Active topic object
   * ───────────────────────────────────────────── */
  const activeTopic = useMemo(
    () => chapterData.topics.find((t) => t.id === activeTopicId),
    [chapterData.topics, activeTopicId]
  );

  /* ─────────────────────────────────────────────
   * DERIVED: Per-topic progress statistics for sidebar rings
   * ───────────────────────────────────────────── */
  const topicStats = useMemo(() => {
    const stats: Record<string, { answered: number; correct: number; total: number; percent: number }> = {};
    chapterData.topics.forEach((topic) => {
      const answered = topic.questions.filter((q) => answeredQuestions.has(q.id)).length;
      const correct  = topic.questions.filter((q) => correctAnswers.has(q.id)).length;
      const total    = topic.questions.length;
      stats[topic.id] = {
        answered,
        correct,
        total,
        percent: total > 0 ? Math.round((correct / total) * 100) : 0,
      };
    });
    return stats;
  }, [chapterData.topics, answeredQuestions, correctAnswers]);

  /* ─────────────────────────────────────────────
   * DERIVED: Chapter-level score totals
   * ───────────────────────────────────────────── */
  const { totalScore, maxScore } = useMemo(() => {
    let total = 0;
    let max   = 0;
    chapterData.topics.forEach((t) =>
      t.questions.forEach((q) => {
        max += q.points || QUESTION_CONFIG[q.type].points;
        if (correctAnswers.has(q.id)) total += q.points || QUESTION_CONFIG[q.type].points;
      })
    );
    return { totalScore: total, maxScore: max };
  }, [chapterData.topics, correctAnswers]);

  /* ─────────────────────────────────────────────
   * EFFECT: Animate score count-up when totalScore changes
   * ───────────────────────────────────────────── */
  useEffect(() => {
    if (totalScore === displayScore) return;
    const step = totalScore > displayScore ? 1 : -1;
    const interval = setInterval(() => {
      setDisplayScore((prev) => {
        const next = prev + step * Math.max(1, Math.floor(Math.abs(totalScore - prev) / 5));
        if ((step > 0 && next >= totalScore) || (step < 0 && next <= totalScore)) {
          clearInterval(interval);
          return totalScore;
        }
        return next;
      });
    }, 16);
    return () => clearInterval(interval);
  }, [totalScore, displayScore]);

  /* ─────────────────────────────────────────────
   * HANDLER: Topic change with scroll-to-top + tab reset
   * ───────────────────────────────────────────── */
  const handleTopicChange = useCallback((topicId: string) => {
    setActiveTopicId(topicId);
    setSidebarOpen(false);
    setActiveTab("learn"); /* Reset to Learn tab on topic change */
    /* Scroll content area to top */
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* ─────────────────────────────────────────────
   * HANDLER: Save text answer (short/long/HOTS) to localStorage
   * Does NOT mark the question as "answered" until "Reveal" is clicked.
   * ───────────────────────────────────────────── */
  const handleSaveTextAnswer = useCallback(
    (questionId: string, text: string) => {
      setSelectedOptionsMap((prev) => {
        const next = { ...prev, [questionId]: text };
        localStorage.setItem(
          `eduquest_${chapterData.id}_selected`,
          JSON.stringify(next)
        );
        return next;
      });
    },
    [chapterData.id]
  );

  /* ─────────────────────────────────────────────
   * HANDLER: Question answered — the main score-tracking function.
   *
   * Flow:
   *   1. Mark question as answered in local state + localStorage
   *   2. If correct → add to correctAnswers set
   *   3. POST to /api/progress/answers → awards XP + Stars + updates streak
   *   4. PUT  to /api/progress/chapters/[id] → upserts chapter progress %
   *   5. Show toast with XP earned or level-up celebration
   * ───────────────────────────────────────────── */
  const handleQuestionAnswered = useCallback(
    (questionId: string, isCorrect: boolean, selectedOpt?: string) => {
      /* Map internal question types to API's expected string format */
      const question    = activeTopic?.questions.find((q) => q.id === questionId);
      const questionType =
        question?.type === "thinking" ? "deep-thinking"
        : question?.type === "short"   ? "short-answer"
        : question?.type === "long"    ? "long-answer"
        : "mcq";

      /* Mark as answered in local state */
      setAnsweredQuestions((prev) => {
        const next = new Set(prev).add(questionId);
        localStorage.setItem(
          `eduquest_${chapterData.id}_answered`,
          JSON.stringify(Array.from(next))
        );
        return next;
      });

      /* Save selected option */
      if (selectedOpt !== undefined) {
        setSelectedOptionsMap((prev) => {
          const next = { ...prev, [questionId]: selectedOpt };
          localStorage.setItem(
            `eduquest_${chapterData.id}_selected`,
            JSON.stringify(next)
          );
          return next;
        });
      }

      /* ── API CALL 1: Save individual answer + award XP ── */
      fetch("/api/progress/answers", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterId:    chapterData.id,
          topicId:      activeTopicId,
          questionId,
          userAnswer:   selectedOpt || "",
          isCorrect,
          timeSpent:    0,
          questionType,
        }),
      })
        .then((r) => r.json())
        .then((res) => {
          if (res.ok && res.data && isCorrect) {
            const { xpAwarded, starsAwarded, leveledUp, newLevel } = res.data;
            if (leveledUp) {
              toast.success(`🎉 Level Up! You're now Level ${newLevel}!`, {
                duration: 4000,
                style: {
                  background: "linear-gradient(135deg, #1e1b4b, #312e81)",
                  color: "#c7d2fe",
                  border: "1px solid rgba(129,140,248,0.3)",
                  borderRadius: "12px",
                  padding: "14px 20px",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                },
                icon: "🏆",
              });
            } else if (xpAwarded > 0) {
              toast.success(`+${xpAwarded} XP · +${starsAwarded} ⭐`, {
                duration: 2000,
                style: {
                  background: "rgba(30,41,59,0.95)",
                  color: "#a7f3d0",
                  border: "1px solid rgba(52,211,153,0.3)",
                  borderRadius: "10px",
                  padding: "10px 16px",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                },
              });
            }
          }
        })
        .catch(console.error);

      /* ── Handle correctAnswers state + API CALL 2 ── */
      if (isCorrect) {
        setCorrectAnswers((prev) => {
          const next = new Set(prev).add(questionId);
          localStorage.setItem(
            `eduquest_${chapterData.id}_correct`,
            JSON.stringify(Array.from(next))
          );

          /* Per-topic correct count — read by dashboard ChapterProgressWidget.
           * Key: eduquest_<chapterId>_correct_<topicId> = integer count */
          const topicCorrectCount = Array.from(next).filter((qId) =>
            activeTopic?.questions.some((q) => q.id === qId)
          ).length;
          localStorage.setItem(
            `eduquest_${chapterData.id}_correct_${activeTopicId}`,
            String(topicCorrectCount)
          );

          /* Calculate new chapter score to send to progress API */
          const totalQuestions = chapterData.topics.reduce(
            (acc, t) => acc + t.questions.length,
            0
          );
          const newScore    = Math.round((next.size / totalQuestions) * 100);
          const isCompleted = next.size === totalQuestions;

          fetch(`/api/progress/chapters/${encodeURIComponent(chapterData.id)}`, {
            method:  "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              score:        newScore,
              completed:    isCompleted,
              correctCount: next.size,
              answers:      JSON.stringify({ answered: Array.from(next) }),
            }),
          }).catch(console.error);

          return next;
        });
      } else {
        /* Even on wrong answers, update the chapter progress score */
        const totalQuestions = chapterData.topics.reduce(
          (acc, t) => acc + t.questions.length,
          0
        );
        const newScore = Math.round((correctAnswers.size / totalQuestions) * 100);
        fetch(`/api/progress/chapters/${encodeURIComponent(chapterData.id)}`, {
          method:  "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            score:        newScore,
            completed:    false,
            correctCount: correctAnswers.size,
          }),
        }).catch(console.error);

        /* Show a gentle wrong-answer toast */
        toast.error("Incorrect — check the explanation below 👇", {
          duration: 2000,
          style: {
            background: "rgba(30,10,10,0.95)",
            color: "#fca5a5",
            border: "1px solid rgba(248,113,113,0.3)",
            borderRadius: "10px",
            padding: "10px 16px",
            fontSize: "0.875rem",
          },
        });
      }
    },
    [correctAnswers, chapterData, activeTopicId, activeTopic]
  );

  /* ─────────────────────────────────────────────
   * DERIVED: Overall chapter progress percentage
   * ───────────────────────────────────────────── */
  const chapterProgressPercent = useMemo(() => {
    const totalQ = chapterData.topics.reduce((acc, t) => acc + t.questions.length, 0);
    return totalQ > 0 ? Math.round((correctAnswers.size / totalQ) * 100) : 0;
  }, [chapterData.topics, correctAnswers]);

  /* ─────────────────────────────────────────────
   * DERIVED: Active topic index for navigation
   * ───────────────────────────────────────────── */
  const activeTopicIndex = useMemo(
    () => chapterData.topics.findIndex((t) => t.id === activeTopicId),
    [chapterData.topics, activeTopicId]
  );

  /* ── SVG progress ring helper: dasharray math for circular progress ── */
  const getProgressRing = (percent: number, radius = 14) => {
    const circumference = 2 * Math.PI * radius;
    const dash = (percent / 100) * circumference;
    return { circumference, dash };
  };

  /* ══════════════════════════════════════════════
   * RENDER
   * ══════════════════════════════════════════════ */
  return (
    <div className={styles.container}>

      {/* ── STICKY HEADER ── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          {/* Back link */}
          <Link href={backUrl} className={styles.backBtn} aria-label="Back to subject">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span className={styles.backBtnText}>Back</span>
          </Link>

          {/* Mobile sidebar toggle */}
          <button
            className={styles.menuBtn}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle topics"
            aria-expanded={sidebarOpen}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h10M4 18h14" strokeLinecap="round" />
            </svg>
            <span>Topics</span>
          </button>
        </div>

        {/* Chapter title (center) */}
        <div className={styles.headerCenter}>
          <span className={styles.headerSubject}>{chapterData.subject}</span>
          <span className={styles.headerDivider}>·</span>
          <span className={styles.headerTitle}>{chapterData.title}</span>
        </div>

        {/* Score display (right) */}
        <div className={styles.headerRight}>
          {/* Chapter progress bar */}
          <div className={styles.headerProgress}>
            <div
              className={styles.headerProgressBar}
              style={{ width: `${chapterProgressPercent}%` }}
            />
          </div>
          <div className={styles.scoreChip}>
            <span className={styles.scoreIcon}>⭐</span>
            <span className={styles.scoreValue}>{displayScore}</span>
            <span className={styles.scoreMax}>/{maxScore}</span>
          </div>
        </div>
      </header>

      {/* ── MAIN LAYOUT: sidebar + content ── */}
      <div className={styles.layout}>

        {/* ────────────────────────────
         * LEFT SIDEBAR
         * Shows all topics with circular progress rings.
         * On mobile: slides in from left as overlay.
         * ──────────────────────────── */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarVisible : ""}`}>

          {/* Sidebar header */}
          <div className={styles.sidebarHeader}>
            <div className={styles.sidebarChapterBadge}>
              <span className={styles.sidebarBadgeIcon}>💡</span>
              <div>
                <div className={styles.sidebarBadgeTitle}>{chapterData.class}</div>
                <div className={styles.sidebarBadgeSub}>{chapterData.subject}</div>
              </div>
            </div>

            {/* Overall chapter progress */}
            <div className={styles.sidebarProgress}>
              <div className={styles.sidebarProgressRow}>
                <span className={styles.sidebarProgressLabel}>Chapter Progress</span>
                <span className={styles.sidebarProgressPct}>{chapterProgressPercent}%</span>
              </div>
              <div className={styles.sidebarProgressTrack}>
                <div
                  className={styles.sidebarProgressFill}
                  style={{ width: `${chapterProgressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Topic list */}
          <nav className={styles.topicNav} aria-label="Chapter topics">
            <div className={styles.topicNavLabel}>Topics ({chapterData.topics.length})</div>
            <ul className={styles.topicList} role="listbox">
              {chapterData.topics.map((topic, idx) => {
                const stats      = topicStats[topic.id];
                const isActive   = activeTopicId === topic.id;
                const isDone     = stats.correct > 0 && stats.correct === stats.total;
                const ring       = getProgressRing(stats.percent);

                return (
                  <li key={topic.id} role="option" aria-selected={isActive}>
                    <button
                      className={`${styles.topicBtn} ${isActive ? styles.topicBtnActive : ""} ${isDone ? styles.topicBtnDone : ""}`}
                      onClick={() => handleTopicChange(topic.id)}
                    >
                      {/* Circular SVG progress ring */}
                      <div className={styles.topicRingWrapper} aria-hidden="true">
                        <svg width="36" height="36" viewBox="0 0 36 36" className={styles.topicRingSvg}>
                          {/* Background track */}
                          <circle
                            cx="18" cy="18" r="14"
                            fill="none"
                            stroke="rgba(255,255,255,0.08)"
                            strokeWidth="2.5"
                          />
                          {/* Progress arc */}
                          <circle
                            cx="18" cy="18" r="14"
                            fill="none"
                            stroke={isDone ? "#34d399" : isActive ? "#818cf8" : "rgba(99,102,241,0.5)"}
                            strokeWidth="2.5"
                            strokeDasharray={`${ring.dash} ${ring.circumference - ring.dash}`}
                            strokeDashoffset={ring.circumference * 0.25} /* Start at top */
                            strokeLinecap="round"
                            style={{ transition: "stroke-dasharray 0.5s ease" }}
                          />
                          {/* Center number or check */}
                          <text
                            x="18" y="22"
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight="700"
                            fill={isDone ? "#34d399" : isActive ? "#c7d2fe" : "#94a3b8"}
                          >
                            {isDone ? "✓" : idx + 1}
                          </text>
                        </svg>
                      </div>

                      {/* Topic text info */}
                      <div className={styles.topicInfo}>
                        <span className={styles.topicName}>
                          {topic.title.replace(/^\d+\.\s*/, "")}
                        </span>
                        <span className={styles.topicMeta}>
                          {stats.correct}/{stats.total} correct
                          {topic.estimatedMinutes ? ` · ${topic.estimatedMinutes}m` : ""}
                        </span>
                      </div>

                      {/* Active indicator dot */}
                      {isActive && <span className={styles.activeIndicator} aria-hidden="true" />}
                    </button>

                    {/* Focused study link — opens the dedicated per-topic page */}
                    <Link
                      href={`${backUrl}/${chapterData.id}/${topic.id}`}
                      className={styles.topicFocusLink}
                      title={`Open focused study mode for: ${topic.title}`}
                      aria-label={`Study ${topic.title} in focused mode`}
                    >
                      Focus →
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar footer: quick stats */}
          <div className={styles.sidebarFooter}>
            <div className={styles.sidebarStat}>
              <span className={styles.sidebarStatNum}>{correctAnswers.size}</span>
              <span className={styles.sidebarStatLabel}>Correct</span>
            </div>
            <div className={styles.sidebarStatDiv} />
            <div className={styles.sidebarStat}>
              <span className={styles.sidebarStatNum}>{answeredQuestions.size}</span>
              <span className={styles.sidebarStatLabel}>Answered</span>
            </div>
            <div className={styles.sidebarStatDiv} />
            <div className={styles.sidebarStat}>
              <span className={styles.sidebarStatNum}>{chapterProgressPercent}%</span>
              <span className={styles.sidebarStatLabel}>Score</span>
            </div>
          </div>
        </aside>

        {/* Mobile overlay — clicking it closes the sidebar */}
        {sidebarOpen && (
          <div
            className={styles.overlay}
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ────────────────────────────
         * MAIN CONTENT AREA
         * ──────────────────────────── */}
        <main ref={contentRef} className={styles.content}>
          {activeTopic ? (
            <div className={styles.topicWrapper}>

              {/* ── TOPIC HERO BANNER ── */}
              <div className={styles.topicHero}>
                {/* Background image */}
                {activeTopic.imageUrl && (
                  <img
                    src={activeTopic.imageUrl}
                    alt=""
                    className={styles.heroImage}
                    loading="lazy"
                    aria-hidden="true"
                  />
                )}
                {/* Gradient overlay */}
                <div className={styles.heroOverlay} />

                {/* Hero content */}
                <div className={styles.heroContent}>
                  <div className={styles.heroBreadcrumb}>
                    <span className={styles.heroBreadcrumbItem}>{chapterData.class}</span>
                    <span className={styles.heroBreadcrumbSep}>›</span>
                    <span className={styles.heroBreadcrumbItem}>{chapterData.subject}</span>
                    <span className={styles.heroBreadcrumbSep}>›</span>
                    <span className={styles.heroBreadcrumbActive}>{chapterData.title}</span>
                  </div>

                  <h2 className={styles.heroTopicTitle}>{activeTopic.title}</h2>

                  <div className={styles.heroStats}>
                    <span className={styles.heroStatChip}>
                      <span>❓</span>
                      {activeTopic.questions.length} Questions
                    </span>
                    {activeTopic.estimatedMinutes && (
                      <span className={styles.heroStatChip}>
                        <span>⏱️</span>
                        {activeTopic.estimatedMinutes} min
                      </span>
                    )}
                    <span className={styles.heroStatChip}>
                      <span>⭐</span>
                      {activeTopic.questions.reduce((acc, q) => acc + (q.points || QUESTION_CONFIG[q.type].points), 0)} pts max
                    </span>
                    {topicStats[activeTopic.id]?.correct > 0 && (
                      <span className={`${styles.heroStatChip} ${styles.heroStatChipGreen}`}>
                        <span>✅</span>
                        {topicStats[activeTopic.id].correct}/{topicStats[activeTopic.id].total} done
                      </span>
                    )}
                  </div>
                </div>

                {/* Topic navigation arrows (prev/next) */}
                <div className={styles.heroNav}>
                  {activeTopicIndex > 0 && (
                    <button
                      className={styles.heroNavBtn}
                      onClick={() => handleTopicChange(chapterData.topics[activeTopicIndex - 1].id)}
                      aria-label="Previous topic"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                    </button>
                  )}
                  {activeTopicIndex < chapterData.topics.length - 1 && (
                    <button
                      className={`${styles.heroNavBtn} ${styles.heroNavBtnNext}`}
                      onClick={() => handleTopicChange(chapterData.topics[activeTopicIndex + 1].id)}
                      aria-label="Next topic"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* ── STUDY TABS ── */}
              <div className={styles.tabs} role="tablist" aria-label="Study modes">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className={styles.tabIcon}>{tab.icon}</span>
                    <span className={styles.tabLabel}>{tab.label}</span>
                    {/* Simulation count badge on Simulations tab */}
                    {tab.id === "simulations" && activeTopic.simulationIds && activeTopic.simulationIds.length > 0 && (
                      <span className={styles.tabBadge}>{activeTopic.simulationIds.length}</span>
                    )}
                    {/* Question count badge on Practice tab */}
                    {tab.id === "practice" && (
                      <span className={styles.tabBadge}>{activeTopic.questions.length}</span>
                    )}
                    {/* Completion badge on Practice tab if all answered */}
                    {tab.id === "practice" && topicStats[activeTopic.id]?.correct === topicStats[activeTopic.id]?.total && topicStats[activeTopic.id]?.total > 0 && (
                      <span className={styles.tabDoneBadge}>✓</span>
                    )}
                  </button>
                ))}
              </div>

              {/* ── TAB PANEL CONTENT ── */}
              <div className={styles.tabPanel}>

                {/* ────────── TAB: LEARN ────────── */}
                {activeTab === "learn" && (() => {
                  /* Get the animated SVG diagram for this topic (null if not found) */
                  const TopicDiagram = getDiagramForTopic(activeTopic.id);
                  return (
                    <div className={styles.learnPanel} role="tabpanel" aria-label="Learn">
                      {/* Render markdown content with KaTeX math support */}
                      <div
                        className={styles.markdownBody}
                        dangerouslySetInnerHTML={{
                          __html: parseMarkdown(activeTopic.content),
                        }}
                      />

                      {/* ── TOPIC DIAGRAM ILLUSTRATION ──
                          Each topic has a professional animated SVG diagram.
                          Shown after the text notes, before simulations. */}
                      {TopicDiagram && (
                        <div className={styles.diagramSection}>
                          <div className={styles.sectionHeading}>
                            <span className={styles.sectionHeadingIcon}>📐</span>
                            Concept Diagram
                          </div>
                          <TopicDiagram />
                        </div>
                      )}

                      {/* Physics simulations (if any defined for this topic)
                          expandedMode=true shows metadata header above each canvas,
                          matching the dedicated Simulations tab experience. */}
                      {activeTopic.simulationIds && activeTopic.simulationIds.length > 0 && (
                        <div className={styles.simulationsSection}>
                          {/* Section heading shows live simulation count */}
                          <div className={styles.sectionHeading}>
                            <span className={styles.sectionHeadingIcon}>🔬</span>
                            {activeTopic.simulationIds.length} Interactive Simulation{activeTopic.simulationIds.length !== 1 ? "s" : ""}
                          </div>
                          <SmartSimulationRenderer
                            simulationIds={activeTopic.simulationIds}
                            expandedMode={true}
                          />
                        </div>
                      )}

                      {/* ── WORKED NUMERICAL EXAMPLES ──
                          Shown in the Learn tab after simulations.
                          Renders the Given / Find / Steps / Answer structure
                          for each worked example in the topic. */}
                      {activeTopic.workedExamples && activeTopic.workedExamples.length > 0 && (
                        <div style={{ marginTop: "2.5rem" }}>
                          {/* Section heading */}
                          <div className={styles.sectionHeading}>
                            <span className={styles.sectionHeadingIcon}>📐</span>
                            Worked Numerical Examples ({activeTopic.workedExamples.length})
                          </div>

                          {/* One card per example */}
                          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1rem" }}>
                            {activeTopic.workedExamples.map((ex, exIdx) => {
                              /* Difficulty colour mapping */
                              const diffColor =
                                ex.difficulty === "easy"   ? "#10b981" :
                                ex.difficulty === "medium" ? "#f59e0b" :
                                                             "#f87171";
                              const diffBg =
                                ex.difficulty === "easy"   ? "rgba(16,185,129,0.08)" :
                                ex.difficulty === "medium" ? "rgba(245,158,11,0.08)" :
                                                             "rgba(248,113,113,0.08)";

                              return (
                                <div
                                  key={ex.id}
                                  style={{
                                    background: "rgba(15,23,42,0.6)",
                                    border: "1px solid rgba(99,102,241,0.2)",
                                    borderRadius: "16px",
                                    overflow: "hidden",
                                    backdropFilter: "blur(8px)",
                                  }}
                                >
                                  {/* Card header */}
                                  <div style={{
                                    background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(16,185,129,0.06) 100%)",
                                    borderBottom: "1px solid rgba(99,102,241,0.12)",
                                    padding: "16px 20px",
                                    display: "flex",
                                    alignItems: "flex-start",
                                    justifyContent: "space-between",
                                    gap: "12px",
                                    flexWrap: "wrap",
                                  }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                                        {/* Example number badge */}
                                        <span style={{
                                          background: "rgba(99,102,241,0.2)",
                                          color: "#818cf8",
                                          fontSize: "0.72rem",
                                          fontWeight: 700,
                                          padding: "2px 8px",
                                          borderRadius: "999px",
                                          letterSpacing: "0.04em",
                                          textTransform: "uppercase",
                                        }}>
                                          Example {exIdx + 1}
                                        </span>
                                        {/* Difficulty badge */}
                                        <span style={{
                                          background: diffBg,
                                          color: diffColor,
                                          fontSize: "0.72rem",
                                          fontWeight: 700,
                                          padding: "2px 8px",
                                          borderRadius: "999px",
                                          letterSpacing: "0.04em",
                                          textTransform: "uppercase",
                                          border: `1px solid ${diffColor}33`,
                                        }}>
                                          {ex.difficulty}
                                        </span>
                                      </div>
                                      {/* Title */}
                                      <h4 style={{
                                        fontSize: "1rem",
                                        fontWeight: 700,
                                        color: "#e2e8f0",
                                        margin: 0,
                                        lineHeight: 1.3,
                                      }}>
                                        {ex.title}
                                      </h4>
                                      {/* Topic tag */}
                                      <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "4px" }}>
                                        {ex.topic}
                                      </div>
                                    </div>
                                  </div>

                                  <div style={{ padding: "20px" }}>
                                    {/* GIVEN + FIND row */}
                                    <div style={{
                                      display: "grid",
                                      gridTemplateColumns: "1fr 1fr",
                                      gap: "12px",
                                      marginBottom: "20px",
                                    }}>
                                      {/* Given */}
                                      <div style={{
                                        background: "rgba(16,185,129,0.05)",
                                        border: "1px solid rgba(16,185,129,0.15)",
                                        borderRadius: "10px",
                                        padding: "12px 14px",
                                      }}>
                                        <div style={{
                                          fontSize: "0.7rem",
                                          fontWeight: 800,
                                          color: "#10b981",
                                          letterSpacing: "0.08em",
                                          textTransform: "uppercase",
                                          marginBottom: "8px",
                                        }}>
                                          Given
                                        </div>
                                        {ex.given.map((g, gi) => (
                                          <div key={gi} style={{
                                            fontSize: "0.82rem",
                                            color: "#94a3b8",
                                            lineHeight: 1.6,
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: "6px",
                                          }}>
                                            <span style={{ color: "#10b981", marginTop: "2px", flexShrink: 0 }}>•</span>
                                            <span>{g}</span>
                                          </div>
                                        ))}
                                      </div>

                                      {/* Find */}
                                      <div style={{
                                        background: "rgba(245,158,11,0.05)",
                                        border: "1px solid rgba(245,158,11,0.15)",
                                        borderRadius: "10px",
                                        padding: "12px 14px",
                                      }}>
                                        <div style={{
                                          fontSize: "0.7rem",
                                          fontWeight: 800,
                                          color: "#f59e0b",
                                          letterSpacing: "0.08em",
                                          textTransform: "uppercase",
                                          marginBottom: "8px",
                                        }}>
                                          Find
                                        </div>
                                        {ex.find.map((f, fi) => (
                                          <div key={fi} style={{
                                            fontSize: "0.82rem",
                                            color: "#94a3b8",
                                            lineHeight: 1.6,
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: "6px",
                                          }}>
                                            <span style={{ color: "#f59e0b", marginTop: "2px", flexShrink: 0 }}>?</span>
                                            <span>{f}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* SOLUTION STEPS */}
                                    <div style={{ marginBottom: "16px" }}>
                                      <div style={{
                                        fontSize: "0.7rem",
                                        fontWeight: 800,
                                        color: "#818cf8",
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        marginBottom: "10px",
                                      }}>
                                        Solution
                                      </div>
                                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                        {ex.steps.map((step) => (
                                          <div
                                            key={step.step}
                                            style={{
                                              display: "flex",
                                              gap: "12px",
                                              alignItems: "flex-start",
                                            }}
                                          >
                                            {/* Step number circle */}
                                            <div style={{
                                              width: "28px",
                                              height: "28px",
                                              borderRadius: "50%",
                                              background: "rgba(99,102,241,0.15)",
                                              border: "1px solid rgba(99,102,241,0.3)",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              fontSize: "0.75rem",
                                              fontWeight: 800,
                                              color: "#818cf8",
                                              flexShrink: 0,
                                              marginTop: "2px",
                                            }}>
                                              {step.step}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                              {/* Step title */}
                                              <div style={{
                                                fontSize: "0.83rem",
                                                fontWeight: 700,
                                                color: "#c7d2fe",
                                                marginBottom: "4px",
                                              }}>
                                                {step.title}
                                              </div>
                                              {/* Step working — monospace for math */}
                                              <div style={{
                                                background: "rgba(0,0,0,0.3)",
                                                borderRadius: "8px",
                                                padding: "10px 12px",
                                                fontFamily: "'JetBrains Mono', monospace",
                                                fontSize: "0.8rem",
                                                color: "#e2e8f0",
                                                lineHeight: 1.7,
                                                whiteSpace: "pre-wrap",
                                                overflowX: "auto",
                                              }}>
                                                {step.work}
                                              </div>
                                              {/* Optional note */}
                                              {step.note && (
                                                <div style={{
                                                  marginTop: "6px",
                                                  background: "rgba(245,158,11,0.06)",
                                                  border: "1px solid rgba(245,158,11,0.2)",
                                                  borderLeft: "3px solid #f59e0b",
                                                  borderRadius: "0 6px 6px 0",
                                                  padding: "6px 10px",
                                                  fontSize: "0.78rem",
                                                  color: "#fbbf24",
                                                  lineHeight: 1.5,
                                                }}>
                                                  💡 {step.note}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* ANSWER BOX */}
                                    <div style={{
                                      background: "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(99,102,241,0.06) 100%)",
                                      border: "1px solid rgba(16,185,129,0.25)",
                                      borderRadius: "10px",
                                      padding: "12px 16px",
                                      marginBottom: ex.realLifeConnect ? "12px" : "0",
                                    }}>
                                      <div style={{
                                        fontSize: "0.7rem",
                                        fontWeight: 800,
                                        color: "#10b981",
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        marginBottom: "6px",
                                      }}>
                                        ✓ Answer
                                      </div>
                                      <div style={{
                                        fontSize: "0.875rem",
                                        color: "#d1fae5",
                                        fontWeight: 600,
                                        lineHeight: 1.6,
                                      }}>
                                        {ex.answer}
                                      </div>
                                    </div>

                                    {/* REAL-LIFE CONNECTION */}
                                    {ex.realLifeConnect && (
                                      <div style={{
                                        background: "rgba(99,102,241,0.06)",
                                        border: "1px solid rgba(99,102,241,0.15)",
                                        borderLeft: "3px solid #818cf8",
                                        borderRadius: "0 10px 10px 0",
                                        padding: "10px 14px",
                                        display: "flex",
                                        gap: "8px",
                                        alignItems: "flex-start",
                                      }}>
                                        <span style={{ fontSize: "1rem", flexShrink: 0 }}>🌍</span>
                                        <div>
                                          <div style={{
                                            fontSize: "0.68rem",
                                            fontWeight: 800,
                                            color: "#818cf8",
                                            letterSpacing: "0.06em",
                                            textTransform: "uppercase",
                                            marginBottom: "3px",
                                          }}>
                                            Real-life connection
                                          </div>
                                          <div style={{
                                            fontSize: "0.8rem",
                                            color: "#94a3b8",
                                            lineHeight: 1.6,
                                          }}>
                                            {ex.realLifeConnect}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* CTA to move to practice */}
                      <div className={styles.learnCta}>
                        <p className={styles.learnCtaText}>
                          Ready to test your knowledge?
                        </p>
                        <button
                          className={styles.learnCtaBtn}
                          onClick={() => setActiveTab("practice")}
                        >
                          Start Practice Questions →
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* ────────── TAB: SIMULATIONS ────────── */}
                {/* Dedicated full-width interactive physics lab panel.
                    Each simulation gets a large, fully rendered card.
                    Uses IntersectionObserver lazy-mounting via SmartSimulationRenderer. */}
                {activeTab === "simulations" && (
                  <div role="tabpanel" aria-label="Simulations" style={{ padding: "0 0 2rem 0" }}>
                    {activeTopic.simulationIds && activeTopic.simulationIds.length > 0 ? (
                      <>
                        {/* Section intro */}
                        <div style={{
                          background: "linear-gradient(135deg, rgba(129,140,248,0.08) 0%, rgba(16,185,129,0.05) 100%)",
                          border: "1px solid rgba(129,140,248,0.15)",
                          borderRadius: "16px",
                          padding: "20px 24px",
                          marginBottom: "24px",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "16px",
                        }}>
                          <div style={{
                            width: "44px", height: "44px", borderRadius: "12px",
                            background: "rgba(129,140,248,0.15)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "20px", flexShrink: 0,
                          }}>🔬</div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: "1rem", color: "#c7d2fe", marginBottom: "4px" }}>
                              {activeTopic.simulationIds.length} Interactive Simulation{activeTopic.simulationIds.length !== 1 ? "s" : ""} — {activeTopic.title.replace(/^\d+\.\s*/, "")}
                            </div>
                            <div style={{ fontSize: "0.84rem", color: "#94a3b8", lineHeight: 1.5 }}>
                              Drag, interact, and explore the physics concepts. Each simulation uses real-time calculations to visualise what your textbook describes.
                            </div>
                          </div>
                        </div>
                        {/* All simulations rendered full-width */}
                        <SmartSimulationRenderer
                          simulationIds={activeTopic.simulationIds}
                          expandedMode={true}
                        />
                        {/* Link to focus mode for distraction-free studying */}
                        <div style={{ textAlign: "center", marginTop: "32px", padding: "20px" }}>
                          <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "12px" }}>
                            Want a distraction-free full-screen experience?
                          </p>
                          <Link
                            href={`${backUrl}/${chapterData.id}/${activeTopic.id}`}
                            style={{
                              display: "inline-flex", alignItems: "center", gap: "8px",
                              background: "linear-gradient(135deg, #4f46e5, #818cf8)",
                              color: "#fff", padding: "10px 22px", borderRadius: "10px",
                              fontWeight: 600, fontSize: "0.875rem", textDecoration: "none",
                            }}
                          >
                            🎯 Open Focus Mode
                          </Link>
                        </div>
                      </>
                    ) : (
                      <EmptyState
                        icon="🔬"
                        title="No Simulations for This Topic"
                        description="Interactive simulations will be added for this topic soon."
                      />
                    )}
                  </div>
                )}

                {/* ────────── TAB: FLASH CARDS ────────── */}
                {activeTab === "flashcards" && (
                  <div className={styles.flashCardsPanel} role="tabpanel" aria-label="Flash Cards">
                    {activeTopic.flashCards && activeTopic.flashCards.length > 0 ? (
                      <FlashCards
                        cards={activeTopic.flashCards}
                        title={`Flash Cards: ${activeTopic.title.replace(/^\d+\.\s*/, "")}`}
                      />
                    ) : (
                      <EmptyState
                        icon="🃏"
                        title="No Flash Cards Yet"
                        description="Flash cards for this topic are coming soon."
                      />
                    )}
                  </div>
                )}

                {/* ────────── TAB: MIND MAP ────────── */}
                {activeTab === "mindmap" && (
                  <div className={styles.mindMapPanel} role="tabpanel" aria-label="Mind Map">
                    {activeTopic.mindMap && activeTopic.mindMap.length > 0 ? (
                      <MindMap
                        nodes={activeTopic.mindMap}
                        title={`Concept Map: ${activeTopic.title.replace(/^\d+\.\s*/, "")}`}
                      />
                    ) : (
                      <EmptyState
                        icon="🗺️"
                        title="No Mind Map Yet"
                        description="Mind map for this topic is coming soon."
                      />
                    )}
                  </div>
                )}

                {/* ────────── TAB: PRACTICE ────────── */}
                {activeTab === "practice" && (
                  <div className={styles.practicePanel} role="tabpanel" aria-label="Practice Questions">

                    {/* Practice header with question type breakdown */}
                    <div className={styles.practiceHeader}>
                      <h3 className={styles.practiceTitle}>Practice Questions</h3>
                      <div className={styles.questionTypeSummary}>
                        {Object.entries(QUESTION_CONFIG).map(([type, cfg]) => {
                          const count  = activeTopic.questions.filter((q) => q.type === type).length;
                          const doneCt = activeTopic.questions.filter(
                            (q) => q.type === type && correctAnswers.has(q.id)
                          ).length;
                          if (count === 0) return null;
                          return (
                            <div key={type} className={styles.qTypePill} style={{ "--pill-color": cfg.color } as React.CSSProperties}>
                              <span className={styles.qTypePillIcon}>{cfg.emoji}</span>
                              <span className={styles.qTypePillLabel}>{cfg.label}</span>
                              <span className={styles.qTypePillCount}>{doneCt}/{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Question cards */}
                    <div className={styles.questionList}>
                      {activeTopic.questions.map((q, idx) => (
                        <QuestionCard
                          key={q.id}
                          question={q}
                          index={idx + 1}
                          isAnswered={answeredQuestions.has(q.id)}
                          isCorrect={correctAnswers.has(q.id)}
                          selectedOption={selectedOptionsMap[q.id] || null}
                          onAnswer={handleQuestionAnswered}
                          onTextSave={handleSaveTextAnswer}
                        />
                      ))}
                    </div>

                    {/* Topic navigation at bottom of practice section */}
                    <div className={styles.bottomNav}>
                      {activeTopicIndex > 0 && (
                        <button
                          className={styles.bottomNavBtn}
                          onClick={() => handleTopicChange(chapterData.topics[activeTopicIndex - 1].id)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                          </svg>
                          Previous Topic
                        </button>
                      )}
                      <div className={styles.bottomNavSpacer} />
                      {activeTopicIndex < chapterData.topics.length - 1 && (
                        <button
                          className={`${styles.bottomNavBtn} ${styles.bottomNavBtnPrimary}`}
                          onClick={() => handleTopicChange(chapterData.topics[activeTopicIndex + 1].id)}
                        >
                          Next Topic
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* ────────── TAB: EXAM PREP ────────── */}
                {activeTab === "exam" && (
                  <div className={styles.examPanel} role="tabpanel" aria-label="Exam Preparation">
                    <ExamSummaryPanel topic={activeTopic} chapterData={chapterData} />
                  </div>
                )}

              </div>
              {/* end tabPanel */}

            </div>
          ) : (
            <EmptyState
              icon="📚"
              title="Select a Topic"
              description="Choose a topic from the sidebar to start learning."
            />
          )}
        </main>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 * SUB-COMPONENT: QuestionCard
 * Renders a single practice question with MCQ or text input,
 * answer reveal, and correct/wrong feedback animations.
 * ═══════════════════════════════════════════════════════════════════ */
interface QuestionCardProps {
  question:       Question;
  index:          number;
  isAnswered:     boolean;
  isCorrect:      boolean;
  selectedOption: string | null;
  onAnswer:       (id: string, correct: boolean, opt?: string) => void;
  onTextSave:     (id: string, text: string) => void;
}

function QuestionCard({
  question,
  index,
  isAnswered,
  isCorrect,
  selectedOption: initialSelected,
  onAnswer,
  onTextSave,
}: QuestionCardProps) {
  const [selected,     setSelected]     = useState<string | null>(
    question.type === "mcq" ? (initialSelected || null) : null
  );
  const [typedAnswer,  setTypedAnswer]  = useState<string>(
    question.type !== "mcq" ? (initialSelected || "") : ""
  );
  const [showAnswer,   setShowAnswer]   = useState(isAnswered);

  const cfg = QUESTION_CONFIG[question.type];

  /* Sync external state changes (e.g. when localStorage is loaded) */
  useEffect(() => {
    if (isAnswered) setShowAnswer(true);
    if (initialSelected) {
      if (question.type === "mcq") setSelected(initialSelected);
      else setTypedAnswer(initialSelected);
    }
  }, [isAnswered, initialSelected, question.type]);

  const handleOptionClick = (opt: string) => {
    if (isAnswered) return;
    setSelected(opt);
  };

  const handleTextBlur = () => {
    onTextSave(question.id, typedAnswer);
  };

  const handleReveal = () => {
    if (showAnswer && isAnswered) {
      setShowAnswer(false);
      return;
    }
    if (!showAnswer) {
      setShowAnswer(true);
      if (!isAnswered) {
        if (question.type === "mcq") {
          onAnswer(question.id, selected === question.correctAnswer, selected || undefined);
        } else {
          /* Text questions always marked correct when revealed (self-assessed) */
          onAnswer(question.id, true, typedAnswer || undefined);
        }
      }
    }
  };

  /* State-based card styling */
  const cardClass = [
    styles.questionCard,
    isAnswered && isCorrect   ? styles.questionCorrect   : "",
    isAnswered && !isCorrect  ? styles.questionIncorrect : "",
  ].filter(Boolean).join(" ");

  return (
    <article className={cardClass}>
      {/* Question header: type badge + number + points */}
      <div className={styles.qHeader}>
        <div className={styles.qHeaderLeft}>
          <span
            className={styles.qTypeBadge}
            style={{
              color:       cfg.color,
              background:  cfg.bgColor,
              borderColor: `${cfg.color}30`,
            }}
          >
            {cfg.icon} {cfg.label}
          </span>
          <span className={styles.qNumber}>Q{index}</span>
        </div>
        <span className={styles.qPoints} style={{ color: cfg.color }}>
          +{question.points || cfg.points} pts
        </span>
      </div>

      {/* Question text — supports markdown + KaTeX */}
      <div
        className={styles.qText}
        dangerouslySetInnerHTML={{ __html: parseMarkdown(question.question) }}
      />

      {/* MCQ Options */}
      {question.type === "mcq" && question.options && (
        <ul className={styles.optionList} role="radiogroup">
          {question.options.map((opt, i) => {
            const isSelected   = selected === opt;
            const isCorrectOpt = showAnswer && opt === question.correctAnswer;
            const isWrongOpt   = showAnswer && isSelected && opt !== question.correctAnswer;

            return (
              <li key={i}>
                <button
                  role="radio"
                  aria-checked={isSelected}
                  className={[
                    styles.optionBtn,
                    isSelected   ? styles.optionSelected   : "",
                    isCorrectOpt ? styles.optionCorrect    : "",
                    isWrongOpt   ? styles.optionWrong      : "",
                  ].filter(Boolean).join(" ")}
                  onClick={() => handleOptionClick(opt)}
                  disabled={isAnswered}
                >
                  {/* Option letter label */}
                  <span className={styles.optionLetter}>
                    {isCorrectOpt ? "✓" : isWrongOpt ? "✗" : String.fromCharCode(65 + i)}
                  </span>
                  {/* Option text — supports inline math */}
                  <span
                    className={styles.optionText}
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(opt) }}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Text Answer (Short / Long / HOTS) */}
      {question.type !== "mcq" && (
        <div className={styles.textAreaWrapper}>
          <textarea
            className={styles.textArea}
            placeholder="Write your answer here... (auto-saved)"
            value={typedAnswer}
            onChange={(e) => setTypedAnswer(e.target.value)}
            onBlur={handleTextBlur}
            disabled={isAnswered && showAnswer}
            rows={5}
            aria-label="Your answer"
          />
          {typedAnswer.length > 0 && !isAnswered && (
            <span className={styles.textSavedHint}>✓ Draft saved</span>
          )}
        </div>
      )}

      {/* Reveal / Check Answer button */}
      <button
        className={styles.revealBtn}
        style={{
          borderColor: cfg.color,
          color:       cfg.color,
        }}
        onClick={handleReveal}
        disabled={question.type === "mcq" && !selected && !showAnswer}
      >
        {showAnswer
          ? "Hide Explanation"
          : question.type === "mcq"
          ? "Check Answer"
          : "Reveal Answer & Explanation"}
      </button>

      {/* Answer reveal panel */}
      {showAnswer && (
        <div className={styles.answerPanel}>
          {/* Correct answer */}
          <div className={styles.correctBox} style={{ borderColor: `${cfg.color}25` }}>
            <div className={styles.correctBoxHeader} style={{ color: cfg.color }}>
              <span>✅</span>
              <span>Correct Answer</span>
            </div>
            <div
              className={styles.answerText}
              dangerouslySetInnerHTML={{ __html: parseMarkdown(question.correctAnswer) }}
            />
          </div>

          {/* Explanation */}
          <div className={styles.explanationBox}>
            <div className={styles.explanationHeader}>
              <span>📖</span>
              <span>Explanation</span>
            </div>
            <div
              className={styles.explanationText}
              dangerouslySetInnerHTML={{ __html: parseMarkdown(question.explanation ?? "") }}
            />
          </div>
        </div>
      )}
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 * SUB-COMPONENT: ExamSummaryPanel
 * Renders a structured exam preparation section extracted from the
 * topic's "Exam Summary" section in the content markdown.
 * Shows color-coded key-point cards, formula boxes, and quick tips.
 * ═══════════════════════════════════════════════════════════════════ */
function ExamSummaryPanel({ topic, chapterData }: { topic: Topic; chapterData: Chapter }) {
  /* Extract the "Exam Summary" section from the content markdown.
   * Topics should have a section starting with "### Exam Summary"
   * or we fall back to extracting all headings and their content. */
  const examContent = useMemo(() => {
    const content = topic.content;
    /* Try to find the Exam Summary section */
    const examIdx = content.indexOf("### Exam Summary");
    if (examIdx !== -1) {
      return content.slice(examIdx);
    }
    /* Fallback: return last section with all bullet points */
    const lastH3 = content.lastIndexOf("###");
    return lastH3 !== -1 ? content.slice(lastH3) : content;
  }, [topic.content]);

  /* Extract key formulas — lines containing $ signs */
  const keyFormulas = useMemo(() => {
    const lines = topic.content.split("\n");
    return lines.filter((l) => l.includes("$$") || (l.includes("$") && l.trim().startsWith(">")));
  }, [topic.content]);

  /* Topic-specific color accent */
  const topicIndex  = chapterData.topics.findIndex((t) => t.id === topic.id);
  const accentColors = ["#818cf8", "#34d399", "#fbbf24", "#f87171", "#60a5fa", "#a78bfa"];
  const accent       = accentColors[topicIndex % accentColors.length];

  return (
    <div className={styles.examPrepContainer}>
      {/* Header */}
      <div className={styles.examPrepHeader}>
        <div className={styles.examPrepIcon} style={{ background: `${accent}18`, borderColor: `${accent}30` }}>
          📋
        </div>
        <div>
          <h3 className={styles.examPrepTitle} style={{ color: accent }}>
            Exam Preparation
          </h3>
          <p className={styles.examPrepSubtitle}>
            Key points for {topic.title.replace(/^\d+\.\s*/, "")} — must-know for CBSE exams
          </p>
        </div>
      </div>

      {/* ── FORMULA QUICK-REFERENCE CARDS ──
          Extract all display formulas ($$ ... $$) from the content and show
          them as visual flash chips for quick revision before exams. */}
      {keyFormulas.length > 0 && (
        <div className={styles.formulaCardsSection}>
          <div className={styles.formulaCardsSectionHeader} style={{ color: accent }}>
            <span>🧮</span>
            <span>Key Formulas & Laws</span>
            <span className={styles.formulaCount}>{keyFormulas.length}</span>
          </div>
          <div className={styles.formulaCardsGrid}>
            {keyFormulas.slice(0, 8).map((formula, idx) => (
              <div
                key={idx}
                className={styles.formulaCard}
                style={{ borderColor: `${accent}25`, background: `${accent}06` }}
              >
                <div
                  className={styles.formulaCardBody}
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(formula.replace(/^>\s*/, "")) }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exam summary content from markdown */}
      <div className={styles.examSummaryCard} style={{ borderColor: `${accent}20` }}>
        <div className={styles.examSummaryCardHeader} style={{ background: `${accent}10`, color: accent }}>
          <span>📝</span>
          <span>Key Points to Remember</span>
        </div>
        <div
          className={`${styles.markdownBody} ${styles.examMarkdown}`}
          dangerouslySetInnerHTML={{ __html: parseMarkdown(examContent) }}
        />
      </div>

      {/* Quick tip cards: question type guide */}
      <div className={styles.examTipGrid}>
        <div className={styles.examTipCard} style={{ borderColor: "#818cf820", background: "#818cf808" }}>
          <div className={styles.examTipHeader} style={{ color: "#818cf8" }}>🔵 MCQ Questions</div>
          <div className={styles.examTipBody}>
            Focus on definitions, laws (angle of incidence = angle of reflection), sign conventions, and numerical values like refractive indices.
          </div>
        </div>
        <div className={styles.examTipCard} style={{ borderColor: "#34d39920", background: "#34d39908" }}>
          <div className={styles.examTipHeader} style={{ color: "#34d399" }}>🟢 Short Answer (2-3 marks)</div>
          <div className={styles.examTipBody}>
            State laws, define terms, write properties. Use bullet points. One sentence per point.
          </div>
        </div>
        <div className={styles.examTipCard} style={{ borderColor: "#fbbf2420", background: "#fbbf2408" }}>
          <div className={styles.examTipHeader} style={{ color: "#fbbf24" }}>🟡 Long Answer (5 marks)</div>
          <div className={styles.examTipBody}>
            Include ray diagrams, derive formulas, explain image formation with all object positions. Show working for numerical problems.
          </div>
        </div>
        <div className={styles.examTipCard} style={{ borderColor: "#f8717120", background: "#f8717108" }}>
          <div className={styles.examTipHeader} style={{ color: "#f87171" }}>🔴 HOTS (Higher Order)</div>
          <div className={styles.examTipBody}>
            Real-life applications, why questions, comparison between mirrors/lenses, critical thinking. Explain your reasoning step-by-step.
          </div>
        </div>
      </div>

      {/* Score progress for this topic */}
      <div className={styles.examScoreCard} style={{ borderColor: `${accent}20` }}>
        <div className={styles.examScoreTitle}>Your Practice Score for This Topic</div>
        <div className={styles.examScoreRow}>
          <div
            className={styles.examScoreBar}
            style={{ "--accent": accent } as React.CSSProperties}
          >
            <div
              className={styles.examScoreBarFill}
              style={{
                width: `${
                  topic.questions.length > 0
                    ? Math.round(
                        (topic.questions.filter((q) =>
                          typeof window !== "undefined" &&
                          (JSON.parse(localStorage.getItem(`eduquest_${chapterData.id}_correct`) || "[]") as string[]).includes(q.id)
                        ).length / topic.questions.length) * 100
                      )
                    : 0
                }%`,
                background: `linear-gradient(90deg, ${accent}, ${accent}aa)`,
              }}
            />
          </div>
          <button
            className={styles.examPracticeBtn}
            style={{ borderColor: accent, color: accent }}
            onClick={() => {
              /* This component is a child of the parent which owns tab state,
               * so we use a custom event to communicate upward. */
              document.dispatchEvent(new CustomEvent("switch-tab", { detail: "practice" }));
            }}
          >
            Practice Now →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 * SUB-COMPONENT: EmptyState
 * A centered placeholder shown when a section has no content.
 * ═══════════════════════════════════════════════════════════════════ */
function EmptyState({
  icon,
  title,
  description,
}: {
  icon:        string;
  title:       string;
  description: string;
}) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyStateIcon}>{icon}</div>
      <h3 className={styles.emptyStateTitle}>{title}</h3>
      <p className={styles.emptyStateDesc}>{description}</p>
    </div>
  );
}
