/**
 * FILE: page.tsx
 * LOCATION: src/app/profile/page.tsx
 * PURPOSE: User profile page — shows the logged-in student's complete progress.
 *          Displays:
 *            - Avatar with level badge
 *            - XP progress bar toward next level
 *            - Current streak and longest streak
 *            - 4 stat cards (Total XP, Battles Won, Questions Solved, Chapters Done)
 *            - Subject-wise progress bars
 *            - Recent activity feed
 *          If the user is NOT logged in, shows a friendly prompt to sign in.
 *          This page uses TanStack Query to fetch live data from /api/dashboard
 *          and /api/auth/me, with skeleton loading states while data loads.
 * USED BY: Navbar "Dashboard" link, post-battle redirect
 * DEPENDENCIES: Profile.module.css, Zustand stores (authStore, levelStore, streakStore),
 *               TanStack Query, lucide-react
 * LAST UPDATED: 2026-05-16
 */

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Flame, Star, Sword, BookOpen, CheckCircle2,
  TrendingUp, ArrowRight, Pencil, Zap, Trophy, Lock,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useLevelStore } from "@/store/levelStore";
import { useStreakStore } from "@/store/streakStore";
import styles from "./Profile.module.css";

/* ─────────────────────────────────────────────
 * Types for API Responses
 * ───────────────────────────────────────────── */

interface DashboardData {
  stats: {
    xp: number;
    level: number;
    streak: number;
    longestStreak: number;
    battlesWon: number;
    totalBattles: number;
    questionsSolved: number;
    chaptersCompleted: number;
  };
  recentActivity: Array<{
    id: string;
    type: "question" | "battle" | "chapter" | "level_up" | "streak";
    title: string;
    xpEarned: number;
    timestamp: string;
  }>;
  subjectProgress: Array<{
    subject: string;
    color: string;
    completedChapters: number;
    totalChapters: number;
    percentComplete: number;
  }>;
}

/* ─────────────────────────────────────────────
 * Skeleton Loader
 * Shown while the API call is in progress
 * ───────────────────────────────────────────── */

/** Pulsing placeholder shown during loading — prevents layout shift */
function ProfileSkeleton() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Hero card skeleton */}
        <div className={`${styles.heroCard} ${styles.skeletonHeroCard}`}>
          <div className={`skeleton ${styles.skeletonAvatar}`} />
          <div className={`skeleton ${styles.skeletonName}`} />
          <div className={`skeleton ${styles.skeletonEmail}`} />
          <div className={`skeleton ${styles.skeletonXpBar}`} />
        </div>
        {/* Stats skeleton */}
        <div className={styles.statsGrid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.statCard}>
              <div className={`skeleton ${styles.skeletonStatIcon}`} />
              <div className={`skeleton ${styles.skeletonStatValue}`} />
              <div className={`skeleton ${styles.skeletonStatLabel}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
 * Activity Icon Helper
 * Returns the right icon and color for each activity type
 * ───────────────────────────────────────────── */

function getActivityStyle(type: string): { icon: React.ReactNode; bg: string; color: string } {
  switch (type) {
    case "question":
      return { icon: <CheckCircle2 size={16} />, bg: "#ECFDF5", color: "#10B981" };
    case "battle":
      return { icon: <Sword size={16} />, bg: "#EEF2FF", color: "#6366F1" };
    case "chapter":
      return { icon: <BookOpen size={16} />, bg: "#EFF6FF", color: "#2563EB" };
    case "level_up":
      return { icon: <Trophy size={16} />, bg: "#FFFBEB", color: "#D97706" };
    case "streak":
      return { icon: <Flame size={16} />, bg: "#FFF7ED", color: "#F97316" };
    default:
      return { icon: <Star size={16} />, bg: "#F8FAFC", color: "#64748B" };
  }
}

/* ─────────────────────────────────────────────
 * Format relative timestamps
 * e.g. "2 hours ago", "yesterday", "3 days ago"
 * ───────────────────────────────────────────── */
function formatRelativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

/* ─────────────────────────────────────────────
 * Main Profile Page Component
 * ───────────────────────────────────────────── */

/**
 * ProfilePage — displays the student's complete progress and statistics.
 *
 * Data flow:
 * 1. Check auth state from Zustand authStore
 * 2. If logged in, fetch dashboard data via TanStack Query
 * 3. Sync XP and streak data into their respective Zustand stores
 * 4. Render the profile UI with live data
 */
export default function ProfilePage() {
  /* Read auth state from the global Zustand store */
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { setXp, xp, level, progressPercent, xpToNextLevel } = useLevelStore();
  const { setStreak, currentStreak } = useStreakStore();

  /* Fetch profile-specific data from /api/profile — only runs when authenticated */
  const {
    data,
    isLoading: dataLoading,
  } = useQuery<DashboardData>({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const res = await fetch("/api/profile");
      if (!res.ok) throw new Error("Failed to load profile data");
      const body = await res.json();
      /* The API wraps data in { ok: true, data: {...} } */
      return body.data ?? body;
    },
    enabled: isAuthenticated, // only fetch when logged in
    staleTime: 30 * 1000,     // cache for 30 seconds
  });

  /**
   * Sync the fetched stats into Zustand stores.
   * This keeps the Navbar and other components in sync without prop drilling.
   */
  useEffect(() => {
    if (data?.stats) {
      setXp(data.stats.xp);
      setStreak({
        currentStreak: data.stats.streak,
        longestStreak: data.stats.longestStreak,
        lastActiveDate: null,
      });
    }
  }, [data, setXp, setStreak]);

  /* ── Loading State ── */
  /*
   * Show skeleton while EITHER:
   *   1. Clerk hasn't loaded yet (clerkLoaded is false)
   *   2. Clerk says user is signed in but our custom store is still hydrating
   *
   * This prevents the "Sign In" prompt from flashing for authenticated users
   * during the ~200ms window between mount and /api/auth/me response.
   */
  if (authLoading || dataLoading) {
    return <ProfileSkeleton />;
  }

  /* ── Not Logged In State ── */
  if (!isAuthenticated || !user) {
    return (
      <div className={styles.notLoggedIn}>
        <div className={styles.notLoggedInCard}>
          <div className={styles.notLoggedInIconWrap}>
            <Lock size={28} />
          </div>
          <h1 className={styles.notLoggedInTitle}>Sign in to view your profile</h1>
          <p className={styles.notLoggedInText}>
            Track your XP, levels, streaks, battles, and subject progress
            all in one place. Create your free account to get started.
          </p>
          <Link href="/sign-in?next=/profile" className={styles.ctaLink}>
            Sign In to Continue
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  /* Extract data or use safe fallbacks */
  const stats = data?.stats;
  const recentActivity = data?.recentActivity ?? [];
  const subjectProgress = data?.subjectProgress ?? [];

  /* First letter of the name for the avatar fallback */
  const avatarInitial = user.name.charAt(0).toUpperCase();

  /* Format the track for display e.g. "class-9" → "Class 9" */
  const trackDisplay = user.track
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  /* XP numbers shown next to the bar */
  const progressXp = stats?.xp ?? xp;
  const nextLevelXp = progressXp + xpToNextLevel;

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* ── Profile Hero Card ── */}
        <div className={styles.heroCard}>
          <div className={styles.heroInner}>
            {/* Avatar with level badge */}
            <div className={styles.avatar}>
              {avatarInitial}
              <span className={styles.avatarLevelBadge}>Lv.{user.level}</span>
            </div>

            {/* Name, email, track, streak */}
            <div className={styles.heroInfo}>
              <h1 className={styles.heroName}>{user.name}</h1>
              <p className={styles.heroEmail}>{user.email}</p>
              <div className={styles.heroMeta}>
                <span className={styles.trackBadge}>
                  <BookOpen size={12} />
                  {trackDisplay}
                </span>
                <span className={styles.streakBadge}>
                  <Flame size={12} />
                  {currentStreak} day streak
                </span>
              </div>
            </div>

            {/* Edit profile button */}
            <Link href="/settings" className={styles.editBtn}>
              <Pencil size={14} />
              Edit Profile
            </Link>
          </div>

          {/* XP Progress Bar */}
          <div className={styles.xpSection}>
            <div className={styles.xpHeader}>
              <span className={styles.xpLabel}>
                Level {level} → Level {level + 1}
              </span>
              <span className={styles.xpNumbers}>
                {(stats?.xp ?? xp).toLocaleString()} XP / {nextLevelXp.toLocaleString()} XP
              </span>
            </div>
            <div className={styles.xpBarTrack}>
              <div
                className={styles.xpBarFill}
                style={{ "--xp-w": `${progressPercent}%` } as React.CSSProperties}
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`XP progress: ${progressPercent}% toward Level ${level + 1}`}
              />
            </div>
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={`${styles.statIconWrap} ${styles.statIconXp}`}>
              <Zap size={20} />
            </div>
            <div className={styles.statValue}>{(stats?.xp ?? 0).toLocaleString()}</div>
            <div className={styles.statLabel}>Total XP</div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIconWrap} ${styles.statIconBattle}`}>
              <Sword size={20} />
            </div>
            <div className={styles.statValue}>{stats?.battlesWon ?? 0}</div>
            <div className={styles.statLabel}>Battles Won</div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIconWrap} ${styles.statIconQuestions}`}>
              <CheckCircle2 size={20} />
            </div>
            <div className={styles.statValue}>{(stats?.questionsSolved ?? 0).toLocaleString()}</div>
            <div className={styles.statLabel}>Questions Solved</div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIconWrap} ${styles.statIconChapters}`}>
              <Trophy size={20} />
            </div>
            <div className={styles.statValue}>{stats?.chaptersCompleted ?? 0}</div>
            <div className={styles.statLabel}>Chapters Done</div>
          </div>
        </div>

        {/* ── Two-Column Section ── */}
        <div className={styles.twoCol}>

          {/* Left: Subject Progress */}
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>
              <TrendingUp size={18} color="var(--color-primary)" />
              Subject Progress
            </h2>

            {subjectProgress.length === 0 ? (
              /* Empty state — user hasn't started any subjects yet */
              <div className={styles.emptyState}>
                <BookOpen size={32} className={styles.emptyStateIcon} />
                <p className={styles.emptyStateText}>
                  No subjects started yet.{" "}
                  <Link href={`/${user.track}`} className={styles.emptyStateLink}>
                    Start learning
                  </Link>
                </p>
              </div>
            ) : (
              <div className={styles.subjectList}>
                {subjectProgress.map((subject) => (
                  <div key={subject.subject} className={styles.subjectItem}>
                    <div className={styles.subjectHeader}>
                      <span className={styles.subjectName}>{subject.subject}</span>
                      <span className={styles.subjectPercent}>
                        {subject.completedChapters}/{subject.totalChapters} chapters
                      </span>
                    </div>
                    <div className={styles.progressTrack}>
                      <div
                        className={styles.progressFill}
                        style={{
                          "--progress-w": `${subject.percentComplete}%`,
                          "--progress-color": subject.color,
                        } as React.CSSProperties}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Recent Activity */}
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>
              <Star size={18} color="var(--color-accent)" />
              Recent Activity
            </h2>

            {recentActivity.length === 0 ? (
              <div className={styles.emptyState}>
                <Star size={32} className={styles.emptyStateIcon} />
                <p className={styles.emptyStateText}>No activity yet — start solving questions!</p>
              </div>
            ) : (
              <div className={styles.activityList}>
                {recentActivity.slice(0, 6).map((activity) => {
                  const { icon, bg, color } = getActivityStyle(activity.type);
                  return (
                    <div key={activity.id} className={styles.activityItem}>
                      <div className={styles.activityIcon} style={{ "--activity-bg": bg, "--activity-color": color } as React.CSSProperties}>
                        {icon}
                      </div>
                      <div className={styles.activityText}>
                        <div className={styles.activityTitle}>{activity.title}</div>
                        <div className={styles.activityTime}>{formatRelativeTime(activity.timestamp)}</div>
                      </div>
                      <span className={styles.activityXp}>+{activity.xpEarned} XP</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
