/*
 * FILE: DashboardClient.tsx
 * LOCATION: src/app/dashboard/DashboardClient.tsx
 * PURPOSE: Interactive dashboard UI that fetches protected dashboard data and
 *          wallet balance from the backend API. Shows loading/error states and
 *          redirects guests to sign in. Includes:
 *          - Stats grid (streak, XP, battles, rank)
 *          - Level progress bar with real XP thresholds from /api/levels
 *          - Stars (wallet) balance card
 *          - Quick actions, streak calendar, recent activity
 * USED BY: src/app/dashboard/page.tsx
 * DEPENDENCIES: next/navigation, lucide-react, Dashboard.module.css
 * LAST UPDATED: 2026-05-25
 */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
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
 * Icon maps — keyed by the tone string from the API response.
 * Using a const assertion so TypeScript knows the exact keys.
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
 * Type definitions
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
 * Data is fetched in parallel with the dashboard snapshot.
 * ───────────────────────────────────────────── */
function WalletCard({ wallet }: { wallet: WalletData | null }) {
  if (!wallet) {
    return (
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>
          <Coins size={18} aria-hidden="true" /> Stars Wallet
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
 * Shows XP bar with real thresholds from the /api/levels endpoint.
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
   * Use level data from the API if available, otherwise fall back to
   * the snapshot's xpToNextLevel value for the progress calculation.
   */
  const xpRequired = currentLevel?.xpRequired ?? 0;
  const xpToNext   = nextLevel
    ? nextLevel.xpRequired - xpRequired
    : snapshot.xpToNextLevel;

  const currentXp = snapshot.user.xp;

  /*
   * Progress = how far into the current level the user is, as a percentage.
   * e.g. Level 5 requires 500 XP, level 6 requires 750 XP.
   *      User has 620 XP → 120 / 250 = 48%.
   */
  const progressXp = Math.max(0, currentXp - xpRequired);
  const xpProgress = xpToNext > 0 ? Math.min(100, (progressXp / xpToNext) * 100) : 100;

  const badgeColor = currentLevel?.badgeColor ?? "#6B7280";
  const levelTitle = currentLevel?.title      ?? "Learner";

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

      {/* XP bar */}
      <div className={styles.xpBar}>
        <div
          className={styles.xpBarFill}
          style={{
            "--xp-w":    `${xpProgress}%`,
            background:  `linear-gradient(90deg, ${badgeColor}, ${badgeColor}99)`,
          } as React.CSSProperties}
        />
      </div>

      {/* XP numbers */}
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
 * DashboardClient — main exported component
 * Fetches snapshot, wallet, and level data in parallel.
 * ───────────────────────────────────────────── */
export default function DashboardClient() {
  const router = useRouter();

  const [snapshot,     setSnapshot]     = useState<DashboardSnapshot | null>(null);
  const [wallet,       setWallet]       = useState<WalletData | null>(null);
  const [currentLevel, setCurrentLevel] = useState<LevelData | null>(null);
  const [nextLevel,    setNextLevel]    = useState<LevelData | null>(null);
  const [error,        setError]        = useState("");
  const [isLoading,    setIsLoading]    = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      setIsLoading(true);
      setError("");

      try {
        /*
         * Fetch the dashboard snapshot first so we know the user's level.
         * Then fetch wallet and level data in parallel for speed.
         */
        const dashRes = await fetch("/api/dashboard", { cache: "no-store" });
        const dashPayload = (await dashRes.json()) as DashboardApiResponse;

        if (!isMounted) return;

        if (dashRes.status === 401) {
          router.push("/sign-in");
          return;
        }

        if (!dashRes.ok || !dashPayload.ok || !dashPayload.data) {
          setError(dashPayload.error?.message ?? "Unable to load dashboard.");
          return;
        }

        const snap = dashPayload.data;
        setSnapshot(snap);

        /* Now fetch wallet + level data in parallel */
        const [walletRes, levelRes] = await Promise.all([
          fetch("/api/wallet", { cache: "no-store" }),
          fetch(`/api/levels?user_level=${snap.user.level}`, {
            cache: "force-cache",
            next: { revalidate: 86400 },
          }),
        ]);

        const [walletPayload, levelPayload] = await Promise.all([
          walletRes.json() as Promise<WalletApiResponse>,
          levelRes.json() as Promise<LevelApiResponse>,
        ]);

        if (isMounted) {
          if (walletPayload.ok && walletPayload.data?.wallet) {
            setWallet(walletPayload.data.wallet);
          }
          if (levelPayload.ok && levelPayload.data) {
            setCurrentLevel(levelPayload.data.current ?? null);
            setNextLevel(levelPayload.data.next ?? null);
          }
        }
      } catch {
        if (isMounted) {
          setError("Network error while loading your dashboard.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [router]);

  /* ── Loading state ─────────────────────────────────────────── */
  if (isLoading) {
    return <DashboardSkeleton />;
  }

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

        {/* ── Stats grid (streak / XP / battles / rank) ──────── */}
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

          {/* LEFT COLUMN: Level progress + Quick actions + Wallet */}
          <div className={styles.columnStack}>

            {/* Level progress bar with real XP thresholds */}
            <LevelProgressCard
              snapshot={snapshot}
              currentLevel={currentLevel}
              nextLevel={nextLevel}
            />

            {/* Quick actions */}
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

          {/* RIGHT COLUMN: Streak calendar + Recent activity */}
          <div className={styles.columnStack}>

            {/* Streak calendar — last 7 days */}
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
                      className={`${styles.streakDay} ${day.status === "active" ? styles.streakDayActive : ""} ${day.status === "today" ? styles.streakDayToday : ""} ${day.status === "missed" ? styles.streakDayMissed : ""}`}
                      title={day.status}
                    />
                    <span className={styles.streakDayLabel}>
                      {new Date(day.isoDate).toLocaleDateString("en-US", { weekday: "narrow" })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent activity list */}
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
