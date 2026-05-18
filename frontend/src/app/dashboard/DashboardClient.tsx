/*
 * FILE: DashboardClient.tsx
 * LOCATION: src/app/dashboard/DashboardClient.tsx
 * PURPOSE: Interactive dashboard UI that fetches protected dashboard data from
 *          the backend API, shows loading/error states, and redirects guests to
 *          sign in. Improved visual design with zap icons, progress bars, and activity lists.
 * USED BY: src/app/dashboard/page.tsx
 * DEPENDENCIES: next/navigation, lucide-react, Dashboard.module.css
 * LAST UPDATED: 2026-05-17
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
} from "lucide-react";
import type { DashboardSnapshot } from "@/lib/server/data/dashboard";
import styles from "./Dashboard.module.css";

const STAT_ICONS = {
  streak: Flame,
  xp: Zap,
  battle: Swords,
  rank: Trophy,
} as const;

const ACTION_ICONS = {
  learn: BookOpen,
  battle: Swords,
  code: Code2,
  community: Users,
} as const;

interface DashboardApiResponse {
  ok: boolean;
  data?: DashboardSnapshot;
  error?: { message: string };
}

/** 
 * Skeleton UI shown while the protected dashboard API responds. 
 */
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

/** 
 * Fetches personalized dashboard data and renders the student workspace. 
 */
export default function DashboardClient() {
  const router = useRouter();
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("/api/dashboard", { cache: "no-store" });
        const payload = (await response.json()) as DashboardApiResponse;

        if (!isMounted) return;

        if (response.status === 401) {
          router.push("/sign-in");
          return;
        }

        if (!response.ok || !payload.ok || !payload.data) {
          setError(payload.error?.message ?? "Unable to load dashboard.");
          return;
        }

        setSnapshot(payload.data);
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

  if (isLoading) {
    return <DashboardSkeleton />;
  }

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

  const xpProgress = Math.min(100, (snapshot.user.xp / snapshot.xpToNextLevel) * 100);
  const firstName = snapshot.user.name.split(" ")[0];
  const hours = new Date().getHours();
  const greeting = hours < 12 ? "Good morning" : hours < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.welcomeRow}>
          <div className={styles.greetingSection}>
            <h1 className={styles.welcomeTitle}>
              {greeting}, {firstName}! <Zap size={24} className={styles.welcomeZap} />
            </h1>
            <p className={styles.welcomeSub}>
              Your {snapshot.user.track.replace("-", " ")} workspace is ready for today.
            </p>
          </div>
          <div className={styles.levelBadge}>
            <Star size={14} /> Level {snapshot.user.level} — {snapshot.user.role}
          </div>
        </div>

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

        <div className={styles.mainGrid}>
          <div className={styles.columnStack}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <TrendingUp size={18} />
                Level Progress
              </h2>
              <div className={styles.xpProgressHeader}>
                <span>Level {snapshot.user.level}</span>
                <span>Level {snapshot.user.level + 1}</span>
              </div>
              <div className={styles.xpBar}>
                <div className={styles.xpBarFill} style={{ "--xp-w": `${xpProgress}%` } as React.CSSProperties} />
              </div>
              <div className={styles.xpInfo}>
                <span>{snapshot.user.xp} XP total</span>
                <span>{snapshot.xpToNextLevel - snapshot.user.xp} XP to go ({Math.round(xpProgress)}%)</span>
              </div>
            </div>

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
          </div>

          <div className={styles.columnStack}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <Flame size={18} className={styles.streakIcon} />
                Streak Calendar
              </h2>
              <p className={styles.streakCountText}>You are on a {snapshot.user.streak} day streak!</p>
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

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <Clock size={18} />
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
