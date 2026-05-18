/**
 * FILE: streakStore.ts
 * LOCATION: src/store/streakStore.ts
 * PURPOSE: Global Zustand store for the daily streak tracking system.
 *          Inspired by GitHub contribution graphs and LeetCode daily streaks.
 *          Tracks current streak, longest streak, last active date, and whether
 *          today's activity requirement has been fulfilled.
 * USED BY: Dashboard, Navbar streak badge, StreakCounter component
 * DEPENDENCIES: zustand
 * LAST UPDATED: 2026-05-16
 * AUTHOR NOTE: A streak breaks if the user does NOT complete at least one
 *              question or chapter check on a given calendar day (IST timezone).
 */

import { create } from "zustand";

/* ─────────────────────────────────────────────
 * Types
 * ───────────────────────────────────────────── */

interface StreakState {
  /** Number of consecutive days the student has been active */
  currentStreak: number;

  /** The longest streak the student has ever maintained */
  longestStreak: number;

  /** ISO date string of the last day the student was active */
  lastActiveDate: string | null;

  /** Whether the student has already earned their streak credit for today */
  completedToday: boolean;

  /**
   * Whether the streak is "at risk" — last activity was yesterday,
   * but today's goal has not yet been completed.
   * When true, the UI should show a warning (fire icon with clock).
   */
  isAtRisk: boolean;

  /* ── Actions ── */

  /** Sync streak data from the server after login or page load */
  setStreak: (data: {
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string | null;
  }) => void;

  /** Mark today as complete (called when user solves their first question of the day) */
  markTodayComplete: () => void;
}

/* ─────────────────────────────────────────────
 * Utility: Calculate "at risk" and "completed today"
 * ───────────────────────────────────────────── */

/**
 * Returns today's date as a YYYY-MM-DD string in IST (Indian Standard Time).
 * Using IST ensures that streaks reset at midnight India time, not UTC.
 */
function getTodayIST(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/**
 * Returns yesterday's date as a YYYY-MM-DD string in IST.
 */
function getYesterdayIST(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/* ─────────────────────────────────────────────
 * Store Definition
 * ───────────────────────────────────────────── */

/**
 * useStreakStore — global streak state for the gamification system.
 *
 * Usage example:
 *   const { currentStreak, isAtRisk } = useStreakStore();
 */
export const useStreakStore = create<StreakState>((set) => ({
  /* ── Initial State ── */
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  completedToday: false,
  isAtRisk: false,

  /* ── Actions ── */

  /**
   * Syncs streak data received from the server.
   * Also computes whether the streak is at risk (last active was yesterday,
   * but today hasn't been completed yet).
   */
  setStreak: (data) => {
    const today = getTodayIST();
    const yesterday = getYesterdayIST();
    const completedToday = data.lastActiveDate === today;
    const isAtRisk =
      !completedToday &&
      data.currentStreak > 0 &&
      data.lastActiveDate === yesterday;

    set({
      currentStreak: data.currentStreak,
      longestStreak: data.longestStreak,
      lastActiveDate: data.lastActiveDate,
      completedToday,
      isAtRisk,
    });
  },

  /**
   * Called when the user earns their streak credit for the day.
   * Updates the UI immediately without waiting for a server round trip.
   */
  markTodayComplete: () =>
    set((state) => ({
      completedToday: true,
      isAtRisk: false,
      currentStreak: state.completedToday ? state.currentStreak : state.currentStreak + 1,
      longestStreak: Math.max(
        state.longestStreak,
        state.completedToday ? state.currentStreak : state.currentStreak + 1
      ),
      lastActiveDate: getTodayIST(),
    })),
}));
