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
import { useEffect, useState } from "react";
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
 * Fetches from GET /api/activity?userId=<id>&days=84.
 * ───────────────────────────────────────────── */
function ActivityGraph({ userId }: { userId: string }) {
  const [days,       setDays]       = useState<ActivityDay[]>([]);
  const [activeDays, setActiveDays] = useState(0);
  const [curStreak,  setCurStreak]  = useState(0);
  const [isLoading,  setIsLoading]  = useState(true);

  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);

    fetch(`/api/activity?userId=${encodeURIComponent(userId)}&days=84`, {
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
  }, [userId]);

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
 * Fetches from GET /api/achievements?userId=<id>.
 * ───────────────────────────────────────────── */
function AchievementsCard({ userId }: { userId: string }) {
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [summary, setSummary]           = useState({ total: 0, earned: 0, percent: 0 });

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/achievements?userId=${encodeURIComponent(userId)}`)
      .then(r => (r.ok ? r.json() : null))
      .then((payload: AchievementsApiResponse | null) => {
        if (payload?.ok && payload.data) {
          /* Show max 12 achievements (4×3 grid at typical widths) */
          setAchievements(payload.data.achievements.slice(0, 12));
          setSummary(payload.data.summary);
        }
      })
      .catch(() => {});
  }, [userId]);

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
 * DashboardClient — main exported component
 * Fetches dashboard snapshot, wallet, levels, and then renders all sections.
 * The activity graph and achievements card receive the userId from the snapshot
 * and handle their own data fetching independently.
 * ───────────────────────────────────────────── */
export default function DashboardClient() {
  const router = useRouter();

  const [snapshot,     setSnapshot]     = useState<DashboardSnapshot | null>(null);
  const [wallet,       setWallet]       = useState<WalletData | null>(null);
  const [currentLevel, setCurrentLevel] = useState<LevelData | null>(null);
  const [nextLevel,    setNextLevel]    = useState<LevelData | null>(null);
  const [error,        setError]        = useState("");
  const [isLoading,    setIsLoading]    = useState(true);

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
      setIsLoading(true);
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

        /* 401 = Clerk session not yet synced to DB, or key mismatch.
         * Do NOT router.push("/sign-in") here — that creates an infinite loop:
         * dashboard → API 401 → /sign-in → Clerk sees auth → /dashboard → repeat.
         * Instead, show an inline error with a manual sign-in link. */
        if (dashRes.status === 401) {
          setError("Session expired. Please sign in again to view your dashboard.");
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
        if (isMounted) setIsLoading(false);
      }
    }

    /* Initial load */
    loadDashboard();

    /*
     * Re-fetch dashboard when the user returns to this tab after 5+ minutes away.
     * The 5-minute throttle prevents the "baar baar auto refresh" loop where every
     * navigation or Alt+Tab triggered a full reload and caused an infinite refresh
     * cycle. Now refreshes only happen when the tab has been hidden for a while.
     */
    let lastLoadedAt = Date.now();

    function handleVisibilityChange() {
      if (document.visibilityState === "visible" && isMounted) {
        const minutesAway = (Date.now() - lastLoadedAt) / 60_000;
        if (minutesAway >= 5) {
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
  }, [router]);

  /* ── Loading state ─────────────────────────────────────────── */
  if (isLoading) return <DashboardSkeleton />;

  /* ── Error state ───────────────────────────────────────────── */
  if (error || !snapshot) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.errorState} role="alert">
            <AlertCircle size={22} />
            <div>
              <h1>Dashboard could not load</h1>
              <p>{error || "Please sign in again to continue."}</p>
            </div>
            <Link href="/sign-in" className={styles.errorAction}>Sign In</Link>
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
  const userId = snapshot.user.id;

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
          </div>

          {/* ── RIGHT COLUMN: Activity + Streak + Achievements + Activity Feed ── */}
          <div className={styles.columnStack}>

            {/*
             * GitHub-style 12-week activity graph.
             * Conditionally rendered: requires userId from the snapshot.
             * ActivityGraph handles its own loading/empty states internally.
             */}
            {userId && <ActivityGraph userId={userId} />}

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
            {userId && <AchievementsCard userId={userId} />}

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
