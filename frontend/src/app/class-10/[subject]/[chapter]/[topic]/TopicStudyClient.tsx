/**
 * FILE: TopicStudyClient.tsx
 * LOCATION: src/app/class-10/[subject]/[chapter]/[topic]/TopicStudyClient.tsx
 * PURPOSE: Dedicated, single-topic focused study interface.
 *
 *          This component provides a full-screen, distraction-free study
 *          experience for one specific topic within a chapter. Unlike the
 *          chapter overview page (which shows all topics in a sidebar), this
 *          page is entirely focused on one topic — like a textbook chapter page.
 *
 *          It shares the same 5-tab study system as DeepResearchChapterClient:
 *            📖 Learn      — detailed markdown notes
 *            🃏 Flash Cards — flip-card quick revision
 *            🗺️ Mind Map    — interactive concept tree
 *            ❓ Practice   — graded questions with instant feedback
 *            📋 Exam Prep  — key points, formulas, exam tips
 *
 *          KEY DIFFERENCES from the chapter overview page:
 *            • No sidebar — single-topic focus
 *            • Larger hero banner with topic image
 *            • Prev/Next topic navigation at top AND bottom
 *            • "Back to Chapter" link always visible
 *            • Score persisted independently per topic to localStorage
 *
 * SCORE → DASHBOARD FLOW (same as chapter page):
 *   POST /api/progress/answers → PUT /api/progress/chapters/[id]
 *
 * USED BY: page.tsx (TopicStudyPage server component)
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
import { toast } from "react-hot-toast";
import styles from "./TopicStudy.module.css";
import type { Topic, Chapter, Question } from "@/lib/content/class10/science/shared-types";
import { parseMarkdown } from "@/lib/utils/parseMarkdown";
import FlashCards from "@/components/chapter/FlashCards";
import MindMap from "@/components/chapter/MindMap";
import SimulationRenderer from "@/components/simulations/SimulationRegistry";

/* ─────────────────────────────────────────────
 * Types for study tab system
 * ───────────────────────────────────────────── */
type StudyTab = "learn" | "flashcards" | "mindmap" | "practice" | "exam";

/* ─────────────────────────────────────────────
 * Question type config — colors and labels
 * ───────────────────────────────────────────── */
const QUESTION_CONFIG = {
  mcq:      { label: "MCQ",       color: "#818cf8", bgColor: "rgba(129,140,248,0.12)", points: 10, icon: "◉" },
  short:    { label: "Short Ans", color: "#34d399", bgColor: "rgba(52,211,153,0.12)",  points: 15, icon: "✎" },
  long:     { label: "Long Ans",  color: "#fbbf24", bgColor: "rgba(251,191,36,0.12)",  points: 20, icon: "✍" },
  thinking: { label: "HOTS",      color: "#f87171", bgColor: "rgba(248,113,113,0.12)", points: 25, icon: "🧠" },
} as const;

const TABS: { id: StudyTab; label: string; icon: string }[] = [
  { id: "learn",      label: "Learn",       icon: "📖" },
  { id: "flashcards", label: "Flash Cards", icon: "🃏" },
  { id: "mindmap",    label: "Mind Map",    icon: "🗺️" },
  { id: "practice",   label: "Practice",   icon: "❓" },
  { id: "exam",       label: "Exam Prep",  icon: "📋" },
];

/* ─────────────────────────────────────────────
 * Component props
 * ───────────────────────────────────────────── */
interface TopicStudyClientProps {
  topic:       Topic;
  chapterData: Chapter;
  chapterUrl:  string;
  prevTopic:   { id: string; title: string; url: string } | null;
  nextTopic:   { id: string; title: string; url: string } | null;
  topicIndex:  number;
}

/* ═══════════════════════════════════════════════════
 * MAIN COMPONENT: TopicStudyClient
 * ═══════════════════════════════════════════════════ */
export default function TopicStudyClient({
  topic,
  chapterData,
  chapterUrl,
  prevTopic,
  nextTopic,
  topicIndex,
}: TopicStudyClientProps) {
  /* ── Local state ── */
  const [activeTab,         setActiveTab]         = useState<StudyTab>("learn");
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [correctAnswers,    setCorrectAnswers]    = useState<Set<string>>(new Set());
  const [selectedOptionsMap, setSelectedOptionsMap] = useState<Record<string, string>>({});
  const [displayScore,      setDisplayScore]      = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  /* ── LocalStorage key (scoped to this topic) ── */
  const storageKey = useMemo(
    () => `eduquest_${chapterData.id}_${topic.id}`,
    [chapterData.id, topic.id]
  );

  /* ─────────────────────────────────────────────
   * EFFECT: Load saved progress from localStorage
   * ───────────────────────────────────────────── */
  useEffect(() => {
    try {
      const answered = localStorage.getItem(`${storageKey}_answered`);
      const correct  = localStorage.getItem(`${storageKey}_correct`);
      const selected = localStorage.getItem(`${storageKey}_selected`);
      if (answered) setAnsweredQuestions(new Set(JSON.parse(answered)));
      if (correct)  setCorrectAnswers(new Set(JSON.parse(correct)));
      if (selected) setSelectedOptionsMap(JSON.parse(selected));
    } catch { /* ignore corrupt storage */ }
  }, [storageKey]);

  /* ─────────────────────────────────────────────
   * DERIVED: Score statistics
   * ───────────────────────────────────────────── */
  const { totalScore, maxScore, scorePercent } = useMemo(() => {
    let total = 0;
    let max   = 0;
    topic.questions.forEach((q) => {
      const pts = q.points || QUESTION_CONFIG[q.type].points;
      max += pts;
      if (correctAnswers.has(q.id)) total += pts;
    });
    const pct = max > 0 ? Math.round((total / max) * 100) : 0;
    return { totalScore: total, maxScore: max, scorePercent: pct };
  }, [topic.questions, correctAnswers]);

  /* ─────────────────────────────────────────────
   * EFFECT: Animate score count-up
   * ───────────────────────────────────────────── */
  useEffect(() => {
    if (totalScore === displayScore) return;
    const step     = totalScore > displayScore ? 1 : -1;
    const interval = setInterval(() => {
      setDisplayScore((prev) => {
        const delta = Math.max(1, Math.floor(Math.abs(totalScore - prev) / 5));
        const next  = prev + step * delta;
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
   * HANDLER: Save text answer draft
   * ───────────────────────────────────────────── */
  const handleSaveText = useCallback(
    (questionId: string, text: string) => {
      setSelectedOptionsMap((prev) => {
        const next = { ...prev, [questionId]: text };
        localStorage.setItem(`${storageKey}_selected`, JSON.stringify(next));
        return next;
      });
    },
    [storageKey]
  );

  /* ─────────────────────────────────────────────
   * HANDLER: Question answered — awards XP + saves progress
   * ───────────────────────────────────────────── */
  const handleQuestionAnswered = useCallback(
    (questionId: string, isCorrect: boolean, selectedOpt?: string) => {
      const question     = topic.questions.find((q) => q.id === questionId);
      const questionType =
        question?.type === "thinking" ? "deep-thinking"
        : question?.type === "short"   ? "short-answer"
        : question?.type === "long"    ? "long-answer"
        : "mcq";

      /* Save answered state */
      setAnsweredQuestions((prev) => {
        const next = new Set(prev).add(questionId);
        localStorage.setItem(`${storageKey}_answered`, JSON.stringify(Array.from(next)));
        return next;
      });

      /* Save selected option */
      if (selectedOpt !== undefined) {
        setSelectedOptionsMap((prev) => {
          const next = { ...prev, [questionId]: selectedOpt };
          localStorage.setItem(`${storageKey}_selected`, JSON.stringify(next));
          return next;
        });
      }

      /* API: Award XP */
      fetch("/api/progress/answers", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterId:    chapterData.id,
          topicId:      topic.id,
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
              toast.success(`🎉 Level Up! Level ${newLevel}!`, { duration: 4000 });
            } else if (xpAwarded > 0) {
              toast.success(`+${xpAwarded} XP · +${starsAwarded} ⭐`, {
                duration: 2000,
                style: {
                  background: "rgba(30,41,59,0.95)",
                  color: "#a7f3d0",
                  border: "1px solid rgba(52,211,153,0.3)",
                  borderRadius: "10px",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                },
              });
            }
          } else if (!isCorrect) {
            toast.error("Incorrect — check the explanation 👇", {
              duration: 2000,
              style: {
                background: "rgba(30,10,10,0.95)",
                color: "#fca5a5",
                border: "1px solid rgba(248,113,113,0.3)",
                borderRadius: "10px",
                fontSize: "0.875rem",
              },
            });
          }
        })
        .catch(console.error);

      /* Save correct state + update chapter progress */
      if (isCorrect) {
        setCorrectAnswers((prev) => {
          const next = new Set(prev).add(questionId);
          localStorage.setItem(`${storageKey}_correct`, JSON.stringify(Array.from(next)));
          const newScore = Math.round((next.size / topic.questions.length) * 100);
          fetch(`/api/progress/chapters/${encodeURIComponent(chapterData.id)}`, {
            method:  "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              score:        newScore,
              completed:    next.size === topic.questions.length,
              correctCount: next.size,
            }),
          }).catch(console.error);
          return next;
        });
      }
    },
    [chapterData.id, topic.id, topic.questions, storageKey]
  );

  /* ─────────────────────────────────────────────
   * DERIVED: Progress stats for question type badges
   * ───────────────────────────────────────────── */
  const qTypeCounts = useMemo(() => {
    const counts: Record<string, { total: number; done: number }> = {};
    topic.questions.forEach((q) => {
      if (!counts[q.type]) counts[q.type] = { total: 0, done: 0 };
      counts[q.type].total++;
      if (correctAnswers.has(q.id)) counts[q.type].done++;
    });
    return counts;
  }, [topic.questions, correctAnswers]);

  /* ── Exam summary content extraction ── */
  const examContent = useMemo(() => {
    const idx = topic.content.indexOf("### Exam Summary");
    return idx !== -1 ? topic.content.slice(idx) : topic.content.slice(topic.content.lastIndexOf("###") || 0);
  }, [topic.content]);

  /* ══════════════════════════════════════════════
   * RENDER
   * ══════════════════════════════════════════════ */
  return (
    <div className={styles.container}>

      {/* ── STICKY TOP BAR ── */}
      <header className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <Link href={chapterUrl} className={styles.backChapterBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            All Topics
          </Link>
        </div>

        <div className={styles.topBarCenter}>
          <span className={styles.topBarChapter}>{chapterData.title}</span>
          <span className={styles.topBarSep}>›</span>
          <span className={styles.topBarTopic}>{topic.title.replace(/^\d+\.\s*/, "")}</span>
        </div>

        <div className={styles.topBarRight}>
          {/* Circular score indicator */}
          <div className={styles.topBarScore}>
            <svg width="36" height="36" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="14" fill="none"
                stroke={scorePercent >= 80 ? "#34d399" : scorePercent >= 50 ? "#fbbf24" : "#818cf8"}
                strokeWidth="3"
                strokeDasharray={`${(scorePercent / 100) * 87.96} 87.96`}
                strokeDashoffset="21.99" strokeLinecap="round"
                style={{ transition: "stroke-dasharray 0.5s ease" }}
              />
              <text x="18" y="22" textAnchor="middle" fontSize="9" fontWeight="700" fill="#e2e8f0">
                {scorePercent}%
              </text>
            </svg>
            <div className={styles.topBarScoreText}>
              <span className={styles.topBarScoreVal}>{displayScore}</span>
              <span className={styles.topBarScoreMax}>/{maxScore} pts</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER ── */}
      <div className={styles.hero}>
        {topic.imageUrl && (
          <img src={topic.imageUrl} alt="" className={styles.heroImg} aria-hidden="true" loading="eager" />
        )}
        <div className={styles.heroOverlay} />

        {/* Light-beam animation layer */}
        <div className={styles.heroBeam} aria-hidden="true" />

        <div className={styles.heroContent}>
          {/* Topic number badge */}
          <div className={styles.heroTopicNum}>Topic {topicIndex + 1} of {chapterData.topics.length}</div>

          {/* Topic title */}
          <h1 className={styles.heroTitle}>{topic.title.replace(/^\d+\.\s*/, "")}</h1>

          {/* Stats row */}
          <div className={styles.heroStats}>
            <span className={styles.heroStat}>
              <span>❓</span> {topic.questions.length} Questions
            </span>
            {topic.estimatedMinutes && (
              <span className={styles.heroStat}><span>⏱️</span> {topic.estimatedMinutes} min</span>
            )}
            <span className={styles.heroStat}><span>⭐</span> {maxScore} pts max</span>
            {correctAnswers.size > 0 && (
              <span className={`${styles.heroStat} ${styles.heroStatGreen}`}>
                <span>✅</span> {correctAnswers.size}/{topic.questions.length} done
              </span>
            )}
          </div>
        </div>

        {/* Prev/Next navigation in hero */}
        <div className={styles.heroNavRow}>
          {prevTopic ? (
            <Link href={prevTopic.url} className={styles.heroNavBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              <span className={styles.heroNavBtnLabel}>{prevTopic.title.replace(/^\d+\.\s*/, "")}</span>
            </Link>
          ) : <div />}

          {nextTopic && (
            <Link href={nextTopic.url} className={`${styles.heroNavBtn} ${styles.heroNavBtnNext}`}>
              <span className={styles.heroNavBtnLabel}>{nextTopic.title.replace(/^\d+\.\s*/, "")}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* ── STUDY TABS ── */}
      <div className={styles.tabs} role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
            onClick={() => {
              setActiveTab(tab.id);
              contentRef.current?.scrollTo({ top: 0 });
            }}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span className={styles.tabLabel}>{tab.label}</span>
            {tab.id === "practice" && (
              <span className={styles.tabBadge}>{topic.questions.length}</span>
            )}
            {tab.id === "practice" && correctAnswers.size === topic.questions.length && topic.questions.length > 0 && (
              <span className={styles.tabCheck}>✓</span>
            )}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ── */}
      <div ref={contentRef} className={styles.tabContent}>

        {/* LEARN */}
        {activeTab === "learn" && (
          <div className={styles.learnPanel}>
            <div
              className={styles.markdown}
              dangerouslySetInnerHTML={{ __html: parseMarkdown(topic.content) }}
            />
            {topic.simulationIds && topic.simulationIds.length > 0 && (
              <div className={styles.simSection}>
                <div className={styles.simHeading}>🔬 Interactive Simulations</div>
                <SimulationRenderer simulationIds={topic.simulationIds} />
              </div>
            )}
            <div className={styles.learnCta}>
              <p>Ready to test yourself?</p>
              <button className={styles.learnCtaBtn} onClick={() => setActiveTab("practice")}>
                Start Practice Questions →
              </button>
            </div>
          </div>
        )}

        {/* FLASH CARDS */}
        {activeTab === "flashcards" && (
          <div className={styles.panelPad}>
            {topic.flashCards && topic.flashCards.length > 0 ? (
              <FlashCards cards={topic.flashCards} title={`Flash Cards: ${topic.title.replace(/^\d+\.\s*/, "")}`} />
            ) : (
              <EmptyState icon="🃏" title="No Flash Cards Yet" description="Coming soon for this topic." />
            )}
          </div>
        )}

        {/* MIND MAP */}
        {activeTab === "mindmap" && (
          <div className={styles.panelPad}>
            {topic.mindMap && topic.mindMap.length > 0 ? (
              <MindMap nodes={topic.mindMap} title={`Concept Map: ${topic.title.replace(/^\d+\.\s*/, "")}`} />
            ) : (
              <EmptyState icon="🗺️" title="No Mind Map Yet" description="Coming soon for this topic." />
            )}
          </div>
        )}

        {/* PRACTICE */}
        {activeTab === "practice" && (
          <div className={styles.practicePanel}>
            <div className={styles.practiceHeader}>
              <h2 className={styles.practiceTitle}>Practice Questions</h2>
              <div className={styles.qTypeRow}>
                {Object.entries(QUESTION_CONFIG).map(([type, cfg]) => {
                  const ct = qTypeCounts[type];
                  if (!ct) return null;
                  return (
                    <span key={type} className={styles.qTypePill} style={{ "--c": cfg.color } as React.CSSProperties}>
                      {cfg.icon} {cfg.label} · {ct.done}/{ct.total}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className={styles.questionList}>
              {topic.questions.map((q, idx) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={idx + 1}
                  isAnswered={answeredQuestions.has(q.id)}
                  isCorrect={correctAnswers.has(q.id)}
                  selectedOption={selectedOptionsMap[q.id] || null}
                  onAnswer={handleQuestionAnswered}
                  onTextSave={handleSaveText}
                />
              ))}
            </div>

            {/* Bottom navigation */}
            <div className={styles.bottomNav}>
              {prevTopic && (
                <Link href={prevTopic.url} className={styles.bottomNavBtn}>
                  ← {prevTopic.title.replace(/^\d+\.\s*/, "")}
                </Link>
              )}
              <div className={styles.bottomNavSpacer} />
              {nextTopic && (
                <Link href={nextTopic.url} className={`${styles.bottomNavBtn} ${styles.bottomNavBtnPrimary}`}>
                  {nextTopic.title.replace(/^\d+\.\s*/, "")} →
                </Link>
              )}
            </div>
          </div>
        )}

        {/* EXAM PREP */}
        {activeTab === "exam" && (
          <div className={styles.examPanel}>
            <ExamPrepSection topic={topic} examContent={examContent} />
          </div>
        )}

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
 * SUB-COMPONENT: QuestionCard
 * Same as in DeepResearchChapterClient — handles
 * MCQ + text questions with reveal and feedback.
 * ═══════════════════════════════════════════════════ */
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
  question, index, isAnswered, isCorrect, selectedOption: initOpt,
  onAnswer, onTextSave,
}: QuestionCardProps) {
  const [selected,    setSelected]    = useState<string | null>(
    question.type === "mcq" ? (initOpt || null) : null
  );
  const [typed,       setTyped]       = useState(question.type !== "mcq" ? (initOpt || "") : "");
  const [showAnswer,  setShowAnswer]  = useState(isAnswered);
  const cfg = QUESTION_CONFIG[question.type];

  useEffect(() => {
    if (isAnswered) setShowAnswer(true);
    if (initOpt) {
      if (question.type === "mcq") setSelected(initOpt);
      else setTyped(initOpt);
    }
  }, [isAnswered, initOpt, question.type]);

  const handleReveal = () => {
    if (showAnswer && isAnswered) { setShowAnswer(false); return; }
    setShowAnswer(true);
    if (!isAnswered) {
      if (question.type === "mcq") onAnswer(question.id, selected === question.correctAnswer, selected || undefined);
      else onAnswer(question.id, true, typed || undefined);
    }
  };

  return (
    <article className={[
      styles.qCard,
      isAnswered && isCorrect  ? styles.qCorrect   : "",
      isAnswered && !isCorrect ? styles.qIncorrect : "",
    ].filter(Boolean).join(" ")}>

      <div className={styles.qHead}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span className={styles.qBadge} style={{ color: cfg.color, background: cfg.bgColor, borderColor: `${cfg.color}30` }}>
            {cfg.icon} {cfg.label}
          </span>
          <span className={styles.qNum}>Q{index}</span>
        </div>
        <span className={styles.qPts} style={{ color: cfg.color }}>+{question.points || cfg.points} pts</span>
      </div>

      <div className={styles.qText} dangerouslySetInnerHTML={{ __html: parseMarkdown(question.question) }} />

      {question.type === "mcq" && question.options && (
        <ul className={styles.options}>
          {question.options.map((opt, i) => {
            const isSelected  = selected === opt;
            const isCorrectOpt = showAnswer && opt === question.correctAnswer;
            const isWrongOpt   = showAnswer && isSelected && opt !== question.correctAnswer;
            return (
              <li key={i}>
                <button
                  className={[
                    styles.optBtn,
                    isSelected    ? styles.optSelected : "",
                    isCorrectOpt  ? styles.optCorrect  : "",
                    isWrongOpt    ? styles.optWrong    : "",
                  ].filter(Boolean).join(" ")}
                  onClick={() => !isAnswered && setSelected(opt)}
                  disabled={isAnswered}
                >
                  <span className={styles.optLetter}>
                    {isCorrectOpt ? "✓" : isWrongOpt ? "✗" : String.fromCharCode(65 + i)}
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: parseMarkdown(opt) }} />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {question.type !== "mcq" && (
        <div className={styles.textWrap}>
          <textarea
            className={styles.textArea}
            placeholder="Write your answer here…"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            onBlur={() => onTextSave(question.id, typed)}
            disabled={isAnswered && showAnswer}
            rows={5}
          />
        </div>
      )}

      <button
        className={styles.revealBtn}
        style={{ borderColor: cfg.color, color: cfg.color }}
        onClick={handleReveal}
        disabled={question.type === "mcq" && !selected && !showAnswer}
      >
        {showAnswer ? "Hide Explanation" : question.type === "mcq" ? "Check Answer" : "Reveal Answer"}
      </button>

      {showAnswer && (
        <div className={styles.answerPanel}>
          <div className={styles.correctBox}>
            <div className={styles.correctLabel}>✅ Correct Answer</div>
            <div dangerouslySetInnerHTML={{ __html: parseMarkdown(question.correctAnswer) }} className={styles.answerTxt} />
          </div>
          <div className={styles.explanBox}>
            <div className={styles.explanLabel}>📖 Explanation</div>
            <div dangerouslySetInnerHTML={{ __html: parseMarkdown(question.explanation) }} className={styles.explanTxt} />
          </div>
        </div>
      )}
    </article>
  );
}

/* ═══════════════════════════════════════════════════
 * SUB-COMPONENT: ExamPrepSection
 * ═══════════════════════════════════════════════════ */
function ExamPrepSection({ topic, examContent }: { topic: Topic; examContent: string }) {
  return (
    <div className={styles.examContainer}>
      <div className={styles.examHeader}>
        <div className={styles.examIcon}>📋</div>
        <div>
          <h2 className={styles.examTitle}>Exam Preparation</h2>
          <p className={styles.examSubtitle}>Key points for CBSE exam — must-know before your test</p>
        </div>
      </div>

      <div className={styles.examCard}>
        <div className={styles.examCardHead}>📝 Key Points to Remember</div>
        <div
          className={`${styles.markdown} ${styles.examMarkdown}`}
          dangerouslySetInnerHTML={{ __html: parseMarkdown(examContent) }}
        />
      </div>

      <div className={styles.examTips}>
        {[
          { color: "#818cf8", label: "🔵 MCQ",        tip: "Focus on definitions, laws, sign conventions, and standard values (like refractive index of glass = 1.5)." },
          { color: "#34d399", label: "🟢 Short Ans",   tip: "State laws, define terms clearly, use bullet points. 2–3 sentences per point." },
          { color: "#fbbf24", label: "🟡 Long Ans",    tip: "Include ray diagrams, derive formulas step-by-step, show numerical working clearly." },
          { color: "#f87171", label: "🔴 HOTS",        tip: "Real-life applications, comparison tables, 'why' and 'what if' reasoning. Explain fully." },
        ].map((tip) => (
          <div key={tip.label} className={styles.examTip} style={{ borderColor: `${tip.color}20`, background: `${tip.color}08` }}>
            <div className={styles.examTipHead} style={{ color: tip.color }}>{tip.label}</div>
            <p className={styles.examTipText}>{tip.tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
 * SUB-COMPONENT: EmptyState
 * ═══════════════════════════════════════════════════ */
function EmptyState({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>{icon}</div>
      <h3 className={styles.emptyTitle}>{title}</h3>
      <p className={styles.emptyDesc}>{description}</p>
    </div>
  );
}
