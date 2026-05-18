/**
 * FILE: useStreak.ts
 * LOCATION: src/hooks/useStreak.ts
 * PURPOSE: Custom React hook for accessing the daily streak system.
 *          Wraps the streakStore and provides a clean interface for components
 *          to display streak counts, at-risk warnings, and today's status.
 * USED BY: Dashboard, Profile page, Navbar streak indicator
 * DEPENDENCIES: streakStore (Zustand)
 * LAST UPDATED: 2026-05-16
 */

import { useStreakStore } from "@/store/streakStore";

/**
 * useStreak — provides streak state and actions.
 *
 * Returns:
 *   - currentStreak   → consecutive active days (e.g. 7)
 *   - longestStreak   → highest streak ever achieved
 *   - completedToday  → whether the user has already earned today's streak
 *   - isAtRisk        → true if last active was yesterday and today not done yet
 *   - setStreak       → sync streak from server data
 *   - markTodayComplete → call when user solves their first question of the day
 *
 * Usage:
 *   const { currentStreak, isAtRisk } = useStreak();
 */
export function useStreak() {
  const currentStreak  = useStreakStore((state) => state.currentStreak);
  const longestStreak  = useStreakStore((state) => state.longestStreak);
  const completedToday = useStreakStore((state) => state.completedToday);
  const isAtRisk       = useStreakStore((state) => state.isAtRisk);
  const setStreak      = useStreakStore((state) => state.setStreak);
  const markTodayComplete = useStreakStore((state) => state.markTodayComplete);

  return {
    currentStreak,
    longestStreak,
    completedToday,
    isAtRisk,
    setStreak,
    markTodayComplete,
  };
}
