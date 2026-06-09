/*
 * FILE: DashboardClient.tsx
 * LOCATION: src/app/dashboard/DashboardClient.tsx
 * PURPOSE: Interactive dashboard UI — fetches protected data and renders:
 *   - Stats grid (streak / XP / battles / rank)
 *   - Level progress bar with real XP thresholds from /api/levels
 *   - Stars wallet balance card
 *   - GitHub-style 12-week activity contribution graph (from /api/activity)
 *   - Achievements badge grid with earned/locked status (from /api/achievements)
 *   - Streak calendar (last 7 days)
 *   - Quick actions and recent activity feed
 * USED BY: src/app/dashboard/page.tsx
 * DEPENDENCIES: next/navigation, lucide-react, Dashboard.module.css,
 *               /api/dashboard, /api/wallet, /api/levels, /api/activity, /api/achievements
 * LAST UPDATED: 2026-05-25
 */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/clerk-shim/client";
import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  CalendarDays,
  Clock,
  Code2,
  Flame,
  Star,
  Swords,
  TrendingUp,
  Trophy,
  Users,
  Zap,
  Wallet,
  Medal,
} from "lucide-react";
import type { DashboardSnapshot } from "@/lib/server/data/dashboard";
import styles from "./Dashboard.module.css";

/* ─────────────────────────────────────────────
 * Icon maps — keyed by tone string from API response
 * ───────────────────────────────────────────── */
const STAT_ICONS = {
  streak:  Flame,
  xp:      Zap,
  battle:  Swords,
  rank:    Trophy,
} as const;

const ACTION_ICONS = {
  learn:     BookOpen,
  battle:    Swords,
  code:      Code2,
  community: Users,
} as const;

/* ─────────────────────────────────────────────
 * Type definitions for all API response shapes
 * ───────────────────────────────────────────── */

interface DashboardApiResponse {
  ok: boolean;
  data?: DashboardSnapshot;
  error?: { message: string };
}

interface WalletData {
  balance:      number;
  totalEarned:  number;
  totalSpent:   number;
}

interface WalletApiResponse {
  ok: boolean;
  data?: { wallet: WalletData; transactions: unknown[]; total: number };
  error?: { message: string };
}

interface LevelData {
  levelNumber: number;
  xpRequired:  number;
  xpToNext:    number;
  title:       string;
  badgeName:   string;
  badgeIcon:   string;
  badgeColor:  string;
  perks:       Record<string, unknown>;
}

interface LevelApiResponse {
  ok: boolean;
  data?: { current: LevelData | null; next: LevelData | null };
}

/* ── New types for activity graph and achievements (added 2026-05-25) ──────── */

/** One day entry in the activity graph response */
interface ActivityDay {
  date:      string;  /* ISO date string, e.g. "2026-04-15" */
  count:     number;  /* questions answered that day */
  /** 0 = none · 1 = 1-5 · 2 = 6-20 · 3 = 21-50 · 4 = 51+ (mirrors GitHub graph) */
  intensity: 0 | 1 | 2 | 3 | 4;
}

interface ActivityApiResponse {
  ok: boolean;
  data?: {
    days:          ActivityDay[];
    activeDays:    number;
    currentStreak: number;
    longestStreak: number;
  };
}

/** One achievement row (merged definition + earned status) */
interface AchievementData {
  id:          string;
  slug:        string;
  name:        string;
  description: string;
  category:    string;
  badgeColor:  string;
  xpReward:    number;
  earned:      boolean;
  awardedAt:   string | null;
}

interface AchievementsApiResponse {
  ok: boolean;
  data?: {
    achievements: AchievementData[];
    summary: { total: number; earned: number; percent: number };
  };
}

/* ─────────────────────────────────────────────
 * INTENSITY_COLORS
 * Maps activity intensity level 0–4 to fill colors.
 * Palette mirrors GitHub's contribution graph (dark → green).
 * ───────────────────────────────────────────── */
const INTENSITY_COLORS: Record<number, string> = {
  0: "var(--color-bg-tertiary, #21262D)",
  1: "#0e4429",
  2: "#006d32",
  3: "#26a641",
  4: "#39d353",
};

/* ─────────────────────────────────────────────
 * DashboardSkeleton
 * Pulse-animated skeleton shown while the protected API responds.
 * ───────────────────────────────────────────── */
function DashboardSkeleton() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.skeletonHeader} />
        <div className={styles.statsGrid}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={`${styles.statCard} ${styles.skeletonCard}`} />
          ))}
        </div>
        <div className={styles.mainGrid}>
          <div className={styles.card}><div className={styles.skeletonBlock} /></div>
          <div className={styles.card}><div className={styles.skeletonBlock} /></div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
 * WalletCard
 * Shows the user's Stars balance with a mini spend/earn summary.
 * ───────────────────────────────────────────── */
function WalletCard({ wallet }: { wallet: WalletData | null }) {
  if (!wallet) {
    return (
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>
          <Wallet size={18} aria-hidden="true" /> Stars Wallet
        </h2>
        <p className={styles.walletEmpty}>Your wallet is loading…</p>
      </div>
    );
  }

  return (
    <div className={`${styles.card} ${styles.walletCard}`}>
      <h2 className={styles.cardTitle}>
        <Wallet size={18} aria-hidden="true" /> Stars Wallet
      </h2>

      {/* Large balance number */}
      <div className={styles.walletBalance}>
        <Star size={20} className={styles.walletStar} aria-hidden="true" />
        <span className={styles.walletBalanceNumber}>
          {wallet.balance.toLocaleString("en-IN")}
        </span>
        <span className={styles.walletBalanceLabel}>Stars</span>
      </div>

      {/* Earn / spend summary row */}
      <div className={styles.walletStats}>
        <div className={styles.walletStatItem}>
          <span className={styles.walletStatValue} style={{ color: "var(--color-success)" }}>
            +{wallet.totalEarned.toLocaleString("en-IN")}
          </span>
          <span className={styles.walletStatLabel}>Earned</span>
        </div>
        <div className={styles.walletStatDivider} />
        <div className={styles.walletStatItem}>
          <span className={styles.walletStatValue} style={{ color: "var(--color-danger)" }}>
            -{wallet.totalSpent.toLocaleString("en-IN")}
          </span>
          <span className={styles.walletStatLabel}>Spent</span>
        </div>
      </div>

      <p className={styles.walletHint}>
        Earn Stars by answering questions correctly and winning battles.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
 * LevelProgressCard
 * Shows the XP progress bar towards the next level using real thresholds.
 * ───────────────────────────────────────────── */
function LevelProgressCard({
  snapshot,
  currentLevel,
  nextLevel,
}: {
  snapshot: DashboardSnapshot;
  currentLevel: LevelData | null;
  nextLevel: LevelData | null;
}) {
  /*
   * Progress calculation:
   *   progressXp = how much XP the user has earned WITHIN the current level
   *   xpToNext   = total XP needed to complete the current level
   *   xpProgress = percentage complete (0–100)
   */
  const xpRequired  = currentLevel?.xpRequired ?? 0;
  const xpToNext    = nextLevel
    ? nextLevel.xpRequired - xpRequired
    : snapshot.xpToNextLevel;

  const currentXp   = snapshot.user.xp;
  const progressXp  = Math.max(0, currentXp - xpRequired);
  const xpProgress  = xpToNext > 0 ? Math.min(100, (progressXp / xpToNext) * 100) : 100;

  const badgeColor  = currentLevel?.badgeColor ?? "#6B7280";
  const levelTitle  = currentLevel?.title       ?? "Learner";

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>
        <TrendingUp size={18} aria-hidden="true" /> Level Progress
      </h2>

      {/* Level badge row */}
      <div className={styles.levelBadgeRow}>
        <div
          className={styles.levelBadgePill}
          style={{ background: `${badgeColor}22`, border: `1px solid ${badgeColor}55`, color: badgeColor }}
        >
          <Medal size={12} aria-hidden="true" />
          Level {snapshot.user.level} · {levelTitle}
        </div>
        {nextLevel && (
          <span className={styles.levelNextLabel}>
            Next: Level {nextLevel.levelNumber} · {nextLevel.title}
          </span>
        )}
      </div>

      {/* XP bar header */}
      <div className={styles.xpProgressHeader}>
        <span>Lv. {snapshot.user.level}</span>
        <span>{Math.round(xpProgress)}% complete</span>
        <span>Lv. {snapshot.user.level + 1}</span>
      </div>

      {/* Animated XP bar */}
      <div className={styles.xpBar}>
        <div
          className={styles.xpBarFill}
          style={{
            "--xp-w":   `${xpProgress}%`,
            background: `linear-gradient(90deg, ${badgeColor}, ${badgeColor}99)`,
          } as React.CSSProperties}
        />
      </div>

      {/* Numeric XP info */}
      <div className={styles.xpInfo}>
        <span>{currentXp.toLocaleString("en-IN")} XP total</span>
        <span>
          {xpToNext > progressXp
            ? `${(xpToNext - progressXp).toLocaleString("en-IN")} XP to level ${snapshot.user.level + 1}`
            : "Max level!"}
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
 * ActivityGraph
 * Renders a 12-week GitHub-style contribution grid.
 * Each cell = one day; fill color encodes question volume (intensity 0–4).
 * The grid is padded so the first column always starts on Sunday.
 * Fetches from GET /api/activity?days=84.
 * ───────────────────────────────────────────── */
function ActivityGraph() {
  const [days,       setDays]       = useState<ActivityDay[]>([]);
  const [activeDays, setActiveDays] = useState(0);
  const [curStreak,  setCurStreak]  = useState(0);
  const [isLoading,  setIsLoading]  = useState(true);

  useEffect(() => {
    setIsLoading(true);

    fetch("/api/activity?days=84", {
      cache: "no-store",
    })
      .then(r => (r.ok ? r.json() : null))
      .then((payload: ActivityApiResponse | null) => {
        if (payload?.ok && payload.data) {
          setDays(payload.data.days);
          setActiveDays(payload.data.activeDays);
          setCurStreak(payload.data.currentStreak);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  /*
   * Pad the day array so the first visible cell falls on Sunday (col 0).
   * Sunday = getDay() === 0. We insert null sentinel values for empty cells.
   */
  const paddedDays: (ActivityDay | null)[] = [];
  if (days.length > 0) {
    const firstDow = new Date(`${days[0].date}T00:00:00`).getDay();
    for (let i = 0; i < firstDow; i++) paddedDays.push(null);
  }
  paddedDays.push(...days);

  /* Number of weeks = number of columns in the CSS grid */
  const totalCols = Math.max(12, Math.ceil(paddedDays.length / 7));

  return (
    <div className={styles.card}>
      {/* Header row: title + summary stats */}
      <div className={styles.activityGraphHeader}>
        <h2 className={styles.cardTitle}>
          <CalendarDays size={18} aria-hidden="true" /> Activity Graph
        </h2>
        <div className={styles.activityGraphMeta}>
          <span className={styles.activityMetaStat}>{activeDays} active days</span>
          <span className={styles.activityMetaStat}>
            <Flame size={12} style={{ color: "var(--color-warning)" }} aria-hidden="true" />
            {curStreak}d streak
          </span>
        </div>
      </div>

      {isLoading ? (
        /* Skeleton grid while data loads */
        <div className={styles.activityLoadingGrid}>
          {Array.from({ length: 84 }).map((_, i) => (
            <div key={i} className={styles.activityCellSkeleton} />
          ))}
        </div>
      ) : days.length === 0 ? (
        <p className={styles.activityEmpty}>
          Start answering questions to build your activity graph! 🌱
        </p>
      ) : (
        <div className={styles.activityGraphWrap}>
          {/*
           * CSS Grid with grid-auto-flow: column fills cells column-by-column
           * (week-by-week), giving the GitHub calendar layout.
           * grid-template-rows: repeat(7, 1fr) = one row per day of week.
           */}
          <div
            className={styles.activityGrid}
            style={{ gridTemplateColumns: `repeat(${totalCols}, 1fr)` }}
            aria-label="Study activity over the last 12 weeks"
          >
            {paddedDays.map((day, i) => (
              <div
                key={i}
                className={styles.activityCell}
                style={{
                  background: day ? INTENSITY_COLORS[day.intensity] : "transparent",
                  visibility: day ? "visible" : "hidden",
                }}
                title={day ? `${day.date}: ${day.count} questions` : undefined}
                role={day ? "img" : undefined}
                aria-label={day ? `${day.date}: ${day.count} questions answered` : undefined}
              />
            ))}
          </div>

          {/* Intensity legend */}
          <div className={styles.activityLegend} aria-label="Activity intensity legend">
            <span className={styles.legendLabel}>Less</span>
            {([0, 1, 2, 3, 4] as const).map(intensity => (
              <div
                key={intensity}
                className={styles.legendCell}
                style={{ background: INTENSITY_COLORS[intensity] }}
              />
            ))}
            <span className={styles.legendLabel}>More</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
 * AchievementsCard
 * Shows a compact grid of earned and locked achievement badges.
 * Earned badges glow with the achievement's brand color.
 * Locked badges are dimmed to guide the user on what to unlock next.
 * Fetches from GET /api/achievements.
 * ───────────────────────────────────────────── */
function AchievementsCard() {
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [summary, setSummary]           = useState({ total: 0, earned: 0, percent: 0 });

  useEffect(() => {
    fetch("/api/achievements", { cache: "no-store" })
      .then(r => (r.ok ? r.json() : null))
      .then((payload: AchievementsApiResponse | null) => {
        if (payload?.ok && payload.data) {
          /* Show max 12 achievements (4×3 grid at typical widths) */
          setAchievements(payload.data.achievements.slice(0, 12));
          setSummary(payload.data.summary);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className={styles.card}>
      {/* Header: title + progress count */}
      <div className={styles.achievementHeader}>
        <h2 className={styles.cardTitle}>
          <Trophy size={18} aria-hidden="true" /> Achievements
        </h2>
        <span className={styles.achievementProgress}>
          {summary.earned}/{summary.total}
        </span>
      </div>

      {/* Overall completion bar */}
      <div
        className={styles.achievementProgressBar}
        role="progressbar"
        aria-valuenow={summary.percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${summary.percent}% achievements earned`}
      >
        <div
          className={styles.achievementProgressFill}
          style={{ width: `${summary.percent}%` }}
        />
      </div>

      {/* Badge grid */}
      <div className={styles.achievementGrid}>
        {achievements.length === 0
          ? /* Placeholder tiles while data loads or achievements not seeded */
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`${styles.achievementBadge} ${styles.achievementLocked}`}>
                <div className={styles.achievementIcon}>
                  <Star size={14} aria-hidden="true" />
                </div>
                <span className={styles.achievementName}>Locked</span>
              </div>
            ))
          : achievements.map(ach => (
              <div
                key={ach.id}
                className={`${styles.achievementBadge} ${ach.earned ? styles.achievementEarned : styles.achievementLocked}`}
                title={`${ach.name} — ${ach.description}${ach.earned ? " ✓" : " (locked)"}`}
              >
                <div
                  className={styles.achievementIcon}
                  style={
                    ach.earned
                      ? {
                          background: `${ach.badgeColor}22`,
                          color:       ach.badgeColor,
                          border:     `1.5px solid ${ach.badgeColor}55`,
                        }
                      : {}
                  }
                >
                  {ach.earned
                    ? <Award size={14} aria-hidden="true" />
                    : <Star size={14}  aria-hidden="true" />}
                </div>
                <span className={styles.achievementName}>{ach.name}</span>
                {ach.earned && (
                  <span className={styles.achievementXp}>+{ach.xpReward}</span>
                )}
              </div>
            ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
 * ChapterProgressWidget
 * Reads the "Light – Reflection and Refraction" quiz state from localStorage
 * (written by DeepResearchChapterClient) and displays per-topic progress bars
 * along with an overall completion ring and a "Continue Studying" CTA.
 *
 * Purely client-side — no API call needed because the chapter client caches
 * scores in localStorage immediately after every answered question.
 * ───────────────────────────────────────────── */
const LIGHT_TOPICS = [
  { id: "intro-and-laws-of-reflection",  label: "Laws of Reflection",         totalQ: 5 },
  { id: "concave-convex-mirrors",         label: "Spherical Mirrors",           totalQ: 5 },
  { id: "mirror-formula-magnification",   label: "Mirror Formula",              totalQ: 5 },
  { id: "laws-of-refraction-and-index",   label: "Refraction & Index",          totalQ: 5 },
  { id: "image-formation-by-lenses",      label: "Spherical Lenses",            totalQ: 5 },
  { id: "lens-formula-and-power",         label: "Lens Formula & Power",        totalQ: 5 },
] as const;

const CHAPTER_ID = "light-reflection-and-refraction";
const CHAPTER_URL = "/class-10/science/light-reflection-and-refraction";

function ChapterProgressWidget() {
  /* ── State: per-topic correct counts read from localStorage ── */
  const [topicScores, setTopicScores] = useState<Record<string, number>>({});
  const [mounted, setMounted] = useState(false);

  /* ── Read localStorage on mount (avoids SSR hydration mismatch) ── */
  useEffect(() => {
    try {
      /* The chapter client stores correct answers as a comma-joined list per topic.
       * Key pattern: eduquest_<chapterId>_correct_<topicId> = count (number)
       * Fall back to the chapter-wide "correct" set if per-topic key not found. */
      const scores: Record<string, number> = {};

      /* Try per-topic scores first */
      LIGHT_TOPICS.forEach(({ id }) => {
        const raw = localStorage.getItem(`eduquest_${CHAPTER_ID}_correct_${id}`);
        scores[id] = raw ? parseInt(raw, 10) || 0 : 0;
      });

      /* If no per-topic data found, fall back to the aggregate correct Set */
      const totalStored = Object.values(scores).reduce((a, b) => a + b, 0);
      if (totalStored === 0) {
        const raw = localStorage.getItem(`eduquest_${CHAPTER_ID}_correct`);
        if (raw) {
          try {
            const arr: string[] = JSON.parse(raw);
            /* Distribute evenly by topic prefix (qId format: t1q1, t2q3, etc.) */
            arr.forEach((qId) => {
              const match = qId.match(/^t(\d+)q/);
              if (match) {
                const idx = parseInt(match[1], 10) - 1;
                const topic = LIGHT_TOPICS[idx];
                if (topic) scores[topic.id] = (scores[topic.id] || 0) + 1;
              }
            });
          } catch { /* ignore parse errors */ }
        }
      }

      setTopicScores(scores);
    } catch { /* localStorage not available (SSR guard) */ }
    setMounted(true);
  }, []);

  /* ── Aggregate totals ── */
  const totalCorrect = Object.values(topicScores).reduce((a, b) => a + b, 0);
  const totalQuestions = LIGHT_TOPICS.reduce((a, t) => a + t.totalQ, 0);
  const overallPercent = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const topicsCompleted = LIGHT_TOPICS.filter(
    ({ id, totalQ }) => (topicScores[id] || 0) >= totalQ
  ).length;

  /* Don't render on the server to avoid hydration mismatch */
  if (!mounted) return null;

  return (
    <div className={styles.card}>
      {/* ── Header ── */}
      <div className={styles.chapterWidgetHeader}>
        <div>
          <h2 className={styles.cardTitle}>
            <BookOpen size={16} aria-hidden="true" /> Chapter Progress
          </h2>
          <p className={styles.chapterWidgetSubtitle}>Light – Reflection & Refraction</p>
        </div>
        {/* Overall score ring */}
        <div className={styles.chapterWidgetRing} aria-label={`${overallPercent}% complete`}>
          <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden="true">
            <circle cx="26" cy="26" r="20" fill="none" stroke="rgba(99,102,241,0.12)" strokeWidth="3.5" />
            <circle
              cx="26" cy="26" r="20"
              fill="none"
              stroke={overallPercent >= 80 ? "#34d399" : overallPercent >= 40 ? "#818cf8" : "#6366f1"}
              strokeWidth="3.5"
              strokeDasharray={`${(overallPercent / 100) * (2 * Math.PI * 20)} ${2 * Math.PI * 20}`}
              strokeDashoffset={2 * Math.PI * 20 * 0.25}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 0.6s ease" }}
            />
            <text x="26" y="30" textAnchor="middle" fontSize="11" fontWeight="700" fill="#e2e8f0">
              {overallPercent}%
            </text>
          </svg>
        </div>
      </div>

      {/* ── Summary line ── */}
      <p className={styles.chapterWidgetSummary}>
        {topicsCompleted}/{LIGHT_TOPICS.length} topics completed · {totalCorrect}/{totalQuestions} correct
      </p>

      {/* ── Per-topic mini progress bars ── */}
      <ul className={styles.chapterTopicList} aria-label="Topic progress">
        {LIGHT_TOPICS.map(({ id, label, totalQ }) => {
          const correct  = topicScores[id] || 0;
          const percent  = totalQ > 0 ? Math.round((correct / totalQ) * 100) : 0;
          const done     = correct >= totalQ;

          return (
            <li key={id} className={styles.chapterTopicRow}>
              <Link
                href={`${CHAPTER_URL}/${id}`}
                className={styles.chapterTopicLink}
                title={`Study: ${label}`}
              >
                {/* Label + score */}
                <div className={styles.chapterTopicMeta}>
                  <span className={`${styles.chapterTopicName} ${done ? styles.chapterTopicDone : ""}`}>
                    {done && <span className={styles.chapterTopicCheck} aria-hidden="true">✓ </span>}
                    {label}
                  </span>
                  <span className={styles.chapterTopicScore}>{correct}/{totalQ}</span>
                </div>
                {/* Progress bar */}
                <div className={styles.chapterTopicBar} role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
                  <div
                    className={styles.chapterTopicBarFill}
                    style={{
                      width: `${percent}%`,
                      background: done
                        ? "linear-gradient(90deg,#34d399,#10b981)"
                        : "linear-gradient(90deg,#6366f1,#818cf8)",
                    }}
                  />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* ── CTA ── */}
      <Link href={CHAPTER_URL} className={styles.chapterWidgetCta}>
        {overallPercent === 100 ? "Review Chapter" : "Continue Studying"}
        <ArrowRight size={14} aria-hidden="true" />
      </Link>
    </div>
  );
}

/* ─────────────────────────────────────────────
 * DashboardClient — main exported component
 * Fetches dashboard snapshot, wallet, levels, and then renders all sections.
 * Activity and achievements are bound to the authenticated user on the server.
 * ───────────────────────────────────────────── */
export default function DashboardClient() {
  const router = useRouter();
  /* Clerk client-side auth state — used to prevent the redirect loop:
   * If Clerk says user IS signed in but API returns 401 (server-side JWT
   * validation issue), we show an error instead of bouncing to sign-in. */
  const { isLoaded: clerkLoaded, isSignedIn } = useUser();

  const [snapshot,     setSnapshot]     = useState<DashboardSnapshot | null>(null);
  const [wallet,       setWallet]       = useState<WalletData | null>(null);
  const [currentLevel, setCurrentLevel] = useState<LevelData | null>(null);
  const [nextLevel,    setNextLevel]    = useState<LevelData | null>(null);
  const [error,        setError]        = useState("");
  const [isLoading,    setIsLoading]    = useState(true);
  const hasLoadedOnceRef = useRef(false);

  /*
   * userId is derived directly from snapshot in the render path (below).
   * No separate useState is needed — avoids the race condition where
   * ActivityGraph and AchievementsCard received empty string on first render.
   */

  /*
   * loadDashboard — fetches all dashboard data from the backend.
   * Extracted as a standalone async function so it can be called:
   *   1. On initial mount
   *   2. When the browser tab becomes visible again (visibilitychange)
   *   3. When the window regains focus (user switches back from study page)
   * This ensures XP/level/streak are always up-to-date.
   */
  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      if (!hasLoadedOnceRef.current) {
        setIsLoading(true);
      }
      setError("");

      try {
        /*
         * Step 1: Fetch the dashboard snapshot.
         * This is the primary data source — gives us user info, stats, streakDays,
         * quickActions, and recentActivity.
         */
        const dashRes     = await fetch("/api/dashboard", { cache: "no-store" });
        const dashPayload = (await dashRes.json()) as DashboardApiResponse;

        if (!isMounted) return;

        /* 401 = Session missing or Clerk JWT validation failed on server side.
         *
         * IMPORTANT: We check isSignedIn (Clerk client-side) before redirecting.
         * If Clerk client says user IS signed in but API returns 401, it means
         * server-side auth is having a transient issue — redirecting would cause
         * an infinite loop (sign-in → dashboard → 401 → sign-in → ...).
         * In that case we retry once after a short delay, then show an error.
         */
        if (dashRes.status === 401) {
          if (clerkLoaded && isSignedIn) {
            /* User is genuinely signed in — server auth glitch, retry once */
            await new Promise(r => setTimeout(r, 800));
            const retry = await fetch("/api/dashboard", { cache: "no-store" });
            if (retry.ok) {
              const retryPayload = await retry.json() as DashboardApiResponse;
              if (retryPayload.ok && retryPayload.data && isMounted) {
                setSnapshot(retryPayload.data);
              }
            } else if (isMounted) {
              setError("Session authentication error. Please refresh the page or sign in again.");
            }
          } else if (clerkLoaded && !isSignedIn) {
            /* Genuinely not signed in — safe to redirect */
            router.replace("/sign-in?redirect_url=/dashboard");
          }
          /* If !clerkLoaded yet, wait — the effect will re-run when clerkLoaded changes */
          return;
        }

        if (!dashRes.ok || !dashPayload.ok || !dashPayload.data) {
          setError(dashPayload.error?.message ?? "Unable to load dashboard.");
          return;
        }

        const snap = dashPayload.data;
        setSnapshot(snap);

        /*
         * Step 2: Fetch wallet and level data in parallel for speed.
         * These are independent of each other so we fire them together.
         * Level data uses no-store so it reflects XP changes immediately.
         */
        const [walletRes, levelRes] = await Promise.all([
          fetch("/api/wallet", { cache: "no-store" }),
          fetch(`/api/levels?user_level=${snap.user.level}`, {
            cache: "no-store",
          }),
        ]);

        const [walletPayload, levelPayload] = await Promise.all([
          walletRes.json() as Promise<WalletApiResponse>,
          levelRes.json()  as Promise<LevelApiResponse>,
        ]);

        if (isMounted) {
          if (walletPayload.ok && walletPayload.data?.wallet) {
            setWallet(walletPayload.data.wallet);
          }
          if (levelPayload.ok && levelPayload.data) {
            setCurrentLevel(levelPayload.data.current ?? null);
            setNextLevel(levelPayload.data.next    ?? null);
          }
        }
      } catch {
        if (isMounted) {
          setError("Network error while loading your dashboard.");
        }
      } finally {
        hasLoadedOnceRef.current = true;
        if (isMounted) setIsLoading(false);
      }
    }

    /* Initial load */
    loadDashboard();

    /*
     * Re-fetch dashboard when the user returns to this tab.
     * Uses a 30-second minimum debounce so:
     *   • Quick Alt+Tab / accidental navigation doesn't trigger a full reload
     *   • After a quiz session (~1-2 min away) the dashboard shows fresh XP immediately
     * This is intentionally shorter than the old 5-minute window to make XP
     * updates visible as soon as the student returns from a study/quiz session.
     */
    let lastLoadedAt = Date.now();

    function handleVisibilityChange() {
      if (document.visibilityState === "visible" && isMounted) {
        const secondsAway = (Date.now() - lastLoadedAt) / 1_000;
        if (secondsAway >= 30) {
          lastLoadedAt = Date.now();
          loadDashboard();
        }
      } else {
        /* record when tab was hidden */
        lastLoadedAt = Date.now();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router, clerkLoaded, isSignedIn]);

  /* ── Loading state ─────────────────────────────────────────── */
  if (isLoading) return <DashboardSkeleton />;

  /* ── Error state ───────────────────────────────────────────── */
  if (error || !snapshot) {
    /*
     * IMPORTANT: Do NOT show a "Sign In" link here when the user IS already
     * signed in. Clicking "Sign In" while signed in creates an infinite loop:
     *   error → "Sign In" link → /sign-in → Clerk redirects back to /dashboard
     *   → same error → same link → loop forever.
     *
     * Instead:
     *   - Signed in but data failed  → show "Refresh Page" button (transient API error)
     *   - Not signed in              → show "Sign In" link (actually needs auth)
     */
    const needsSignIn = clerkLoaded && !isSignedIn;
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.errorState} role="alert">
            <AlertCircle size={22} />
            <div>
              <h1>Dashboard could not load</h1>
              <p>
                {error ||
                  (needsSignIn
                    ? "Please sign in to view your dashboard."
                    : "A temporary error occurred. Please refresh the page.")}
              </p>
            </div>
            {needsSignIn ? (
              <Link href="/sign-in" className={styles.errorAction}>Sign In</Link>
            ) : (
              <button
                className={styles.errorAction}
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── Derived values ────────────────────────────────────────── */
  const firstName = snapshot.user.name.split(" ")[0];
  const hours     = new Date().getHours();
  const greeting  = hours < 12 ? "Good morning" : hours < 18 ? "Good afternoon" : "Good evening";

  /*
   * Derive userId directly from snapshot — no separate useState or useEffect.
   * PublicUser.id is always present (see src/types/auth.ts).
   * This guarantees ActivityGraph and AchievementsCard always receive a
   * valid userId from the very first render after snapshot loads.
   */
  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        {/* ── Welcome row ────────────────────────────────────── */}
        <div className={styles.welcomeRow}>
          <div className={styles.greetingSection}>
            <h1 className={styles.welcomeTitle}>
              {greeting}, {firstName}! <Zap size={24} className={styles.welcomeZap} />
            </h1>
            <p className={styles.welcomeSub}>
              Your {snapshot.user.track.replace(/-/g, " ")} workspace is ready for today.
            </p>
          </div>
          <div className={styles.levelBadge}>
            <Star size={14} /> Level {snapshot.user.level} — {snapshot.user.role}
          </div>
        </div>

        {/* ── Stats grid: streak / XP / battles / rank ───────── */}
        <div className={styles.statsGrid}>
          {snapshot.stats.map((stat) => {
            const Icon = STAT_ICONS[stat.tone];
            return (
              <div key={stat.label} className={`${styles.statCard} ${styles[`statCard_${stat.tone}`]}`}>
                <div className={styles.statCardHeader}>
                  <div className={`${styles.statCardIcon} ${styles[`statCardIcon_${stat.tone}`]}`}>
                    <Icon size={20} />
                  </div>
                  <span className={styles.statCardLabel}>{stat.label}</span>
                </div>
                <div className={styles.statCardValue}>{stat.value}</div>
              </div>
            );
          })}
        </div>

        {/* ── Main two-column grid ────────────────────────────── */}
        <div className={styles.mainGrid}>

          {/* ── LEFT COLUMN: Level + Quick Actions + Wallet ──── */}
          <div className={styles.columnStack}>

            {/* Level progress bar with real XP thresholds */}
            <LevelProgressCard
              snapshot={snapshot}
              currentLevel={currentLevel}
              nextLevel={nextLevel}
            />

            {/* Quick actions — links to study, battle, etc. */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Quick Actions</h2>
              <div className={styles.quickActions}>
                {snapshot.quickActions.map((action) => {
                  const Icon = ACTION_ICONS[action.tone];
                  return (
                    <Link key={action.title} href={action.href} className={styles.actionCard}>
                      <div className={`${styles.actionIcon} ${styles[`actionIcon${action.tone}`]}`}>
                        <Icon size={20} />
                      </div>
                      <div className={styles.actionContent}>
                        <div className={styles.actionTitle}>{action.title}</div>
                        <div className={styles.actionDesc}>{action.description}</div>
                      </div>
                      <ArrowRight size={16} className={styles.actionArrow} />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Stars wallet card */}
            <WalletCard wallet={wallet} />

            {/* Chapter progress widget — shows Light chapter score from localStorage */}
            <ChapterProgressWidget />
          </div>

          {/* ── RIGHT COLUMN: Activity + Streak + Achievements + Activity Feed ── */}
          <div className={styles.columnStack}>

            {/*
             * GitHub-style 12-week activity graph.
             * Conditionally rendered: requires userId from the snapshot.
             * ActivityGraph handles its own loading/empty states internally.
             */}
            <ActivityGraph />

            {/* Streak calendar — last 7 days with visual status dots */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <Flame size={18} className={styles.streakIcon} aria-hidden="true" />
                Streak Calendar
              </h2>
              <p className={styles.streakCountText}>
                {snapshot.user.streak > 0
                  ? `You are on a ${snapshot.user.streak}-day streak! 🔥`
                  : "Study today to start your streak!"}
              </p>
              <div className={styles.streakGrid}>
                {snapshot.streakDays.slice(-7).map((day) => (
                  <div key={day.isoDate} className={styles.streakDayWrapper}>
                    <div
                      className={`${styles.streakDay}
                        ${day.status === "active" ? styles.streakDayActive : ""}
                        ${day.status === "today"  ? styles.streakDayToday  : ""}
                        ${day.status === "missed" ? styles.streakDayMissed : ""}`}
                      title={day.status}
                    />
                    <span className={styles.streakDayLabel}>
                      {new Date(day.isoDate).toLocaleDateString("en-US", { weekday: "narrow" })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/*
             * Achievements badge grid — up to 12 earned/locked badges.
             * Conditionally rendered: requires userId from the snapshot.
             */}
            <AchievementsCard />

            {/* Recent activity feed */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <Clock size={18} aria-hidden="true" />
                Recent Activity
              </h2>
              <ul className={styles.activityList}>
                {snapshot.recentActivity.map((item) => (
                  <li key={`${item.text}-${item.time}`} className={styles.activityItem}>
                    <div className={`${styles.activityDot} ${styles[`activityDot_${item.tone}`]}`} />
                    <div className={styles.activityContent}>
                      <span className={styles.activityText}>{item.text}</span>
                      <span className={styles.activityTime}>{item.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
