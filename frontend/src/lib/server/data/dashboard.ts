/**
 * FILE: dashboard.ts
 * LOCATION: src/lib/server/data/dashboard.ts
 * PURPOSE: Builds the dashboard API response from the authenticated user plus
 *          repository-backed metrics. It keeps UI formatting in one backend
 *          place while using real persisted counts and rankings where available.
 * USED BY: /api/dashboard route handler
 * DEPENDENCIES: shared auth types
 * LAST UPDATED: 2026-05-11
 */

import type { PublicUser } from "@/types/auth";
import type { DashboardMetrics } from "@/lib/server/repositories/platform-repository";

export interface DashboardSnapshot {
  user: PublicUser;
  stats: Array<{
    label: string;
    value: string;
    tone: "streak" | "xp" | "battle" | "rank";
  }>;
  metrics: DashboardMetrics;
  xpToNextLevel: number;
  streakDays: Array<{
    isoDate: string;
    status: "active" | "missed" | "today";
  }>;
  quickActions: Array<{
    title: string;
    description: string;
    href: string;
    tone: "learn" | "battle" | "code" | "community";
  }>;
  recentActivity: Array<{
    text: string;
    time: string;
    tone: "success" | "battle" | "streak" | "learn";
  }>;
}

/** Creates a 28-day streak grid without using random values during rendering. */
function buildStreakDays(streak: number): DashboardSnapshot["streakDays"] {
  const today = new Date();

  return Array.from({ length: 28 }, (_, index) => {
    const daysAgo = 27 - index;
    const date = new Date(today);
    date.setDate(today.getDate() - daysAgo);

    if (daysAgo === 0) {
      return { isoDate: date.toISOString(), status: "today" };
    }

    return {
      isoDate: date.toISOString(),
      status: daysAgo <= streak ? "active" : "missed",
    };
  });
}

/** Builds a short activity list from real user-owned backend events. */
function buildRecentActivity(metrics: DashboardMetrics): DashboardSnapshot["recentActivity"] {
  const activity: DashboardSnapshot["recentActivity"] = [
    { text: "Account profile is connected to the backend", time: "Today", tone: "success" },
  ];

  if (metrics.queuedBattleTickets > 0) {
    activity.push({
      text: `${metrics.queuedBattleTickets} battle queue ticket${metrics.queuedBattleTickets === 1 ? "" : "s"} waiting`,
      time: "Live",
      tone: "battle",
    });
  }

  if (metrics.communityPosts > 0) {
    activity.push({
      text: `${metrics.communityPosts} community post${metrics.communityPosts === 1 ? "" : "s"} created`,
      time: "Saved",
      tone: "learn",
    });
  }

  if (metrics.eventRegistrations > 0) {
    activity.push({
      text: `${metrics.eventRegistrations} event registration${metrics.eventRegistrations === 1 ? "" : "s"} saved`,
      time: "Saved",
      tone: "success",
    });
  }

  activity.push({ text: "Daily streak tracker is ready", time: "Today", tone: "streak" });
  return activity.slice(0, 4);
}

/** Builds the student dashboard payload used by the frontend client. */
export function buildDashboardSnapshot(
  user: PublicUser,
  metrics: DashboardMetrics,
): DashboardSnapshot {
  const xpToNextLevel = Math.max(1200, (user.level + 1) * 300);

  return {
    user,
    metrics,
    xpToNextLevel,
    streakDays: buildStreakDays(user.streak),
    stats: [
      { label: "Current Streak", value: `${user.streak}d`, tone: "streak" },
      { label: "Total XP", value: user.xp.toLocaleString(), tone: "xp" },
      { label: "Battle Tickets", value: metrics.battleTickets.toString(), tone: "battle" },
      { label: "Global Rank", value: metrics.globalRank ? `#${metrics.globalRank}` : "Unranked", tone: "rank" },
    ],
    quickActions: [
      { title: "Continue Learning", description: "Resume your selected track", href: `/${user.track}`, tone: "learn" },
      { title: "Start a Battle", description: "Find a fair skill match", href: "/battle", tone: "battle" },
      { title: "Practice Coding", description: "Engineering plans and DSA", href: "/engineering", tone: "code" },
      { title: "Community", description: "Ask and answer doubts", href: "/community", tone: "community" },
    ],
    recentActivity: buildRecentActivity(metrics),
  };
}
