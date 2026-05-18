/**
 * FILE: levelStore.ts
 * LOCATION: src/store/levelStore.ts
 * PURPOSE: Global Zustand store for the gamification level and XP system.
 *          Tracks current XP, level, XP needed for next level, and whether
 *          a level-up animation should be shown. This store drives all the
 *          XP bars, level badges, and level-up celebrations across the UI.
 * USED BY: Dashboard, XPBar component, LevelBadge component, LevelUpModal
 * DEPENDENCIES: zustand
 * LAST UPDATED: 2026-05-16
 * AUTHOR NOTE: XP thresholds follow a quadratic curve — each level requires
 *              progressively more XP. See XP_PER_LEVEL_TABLE below.
 */

import { create } from "zustand";

/* ─────────────────────────────────────────────
 * XP Level Table
 * Defines how many total XP points are needed to reach each level.
 * Level 1 = 0 XP, Level 2 = 200 XP, Level 3 = 500 XP, etc.
 * ───────────────────────────────────────────── */

/**
 * XP required to reach each level number.
 * Index 0 = Level 1 (starts at 0 XP).
 * This follows a mild exponential curve — learning feels rewarding early
 * but requires consistent effort to reach higher levels.
 */
export const XP_PER_LEVEL_TABLE: number[] = [
  0,       // Level 1
  200,     // Level 2
  500,     // Level 3
  1000,    // Level 4
  1800,    // Level 5
  2800,    // Level 6
  4000,    // Level 7
  5500,    // Level 8
  7200,    // Level 9
  9000,    // Level 10  ← Monetization gate activates here
  11200,   // Level 11
  13800,   // Level 12
  16800,   // Level 13
  20200,   // Level 14
  24000,   // Level 15
  28500,   // Level 16
  33500,   // Level 17
  39000,   // Level 18
  45200,   // Level 19
  52000,   // Level 20
];

/* Fill levels 21–100 using a quadratic formula for completeness */
for (let lvl = 21; lvl <= 100; lvl++) {
  XP_PER_LEVEL_TABLE.push(Math.round(52000 + (lvl - 20) * (lvl - 20) * 120));
}

/* ─────────────────────────────────────────────
 * Utility Functions
 * ───────────────────────────────────────────── */

/**
 * Given total XP, returns the current level (1–100).
 * Scans the XP table from highest to lowest to find the right level.
 *
 * @param xp - Total accumulated XP
 * @returns Level number between 1 and 100
 */
export function xpToLevel(xp: number): number {
  for (let lvl = XP_PER_LEVEL_TABLE.length - 1; lvl >= 0; lvl--) {
    if (xp >= XP_PER_LEVEL_TABLE[lvl]) return lvl + 1;
  }
  return 1;
}

/**
 * Given total XP, returns progress percentage toward the next level (0–100).
 * Used to fill the XP progress bar on the UI.
 *
 * @param xp - Total accumulated XP
 * @returns Progress percentage (0 to 100)
 */
export function xpProgressPercent(xp: number): number {
  const level = xpToLevel(xp);
  if (level >= 100) return 100;

  const currentLevelXp = XP_PER_LEVEL_TABLE[level - 1];
  const nextLevelXp = XP_PER_LEVEL_TABLE[level];
  const progressXp = xp - currentLevelXp;
  const gapXp = nextLevelXp - currentLevelXp;

  return Math.min(100, Math.round((progressXp / gapXp) * 100));
}

/* ─────────────────────────────────────────────
 * Store Types
 * ───────────────────────────────────────────── */

interface LevelState {
  /** Current total XP accumulated by the user */
  xp: number;

  /** Derived level calculated from XP (1–100) */
  level: number;

  /** Percentage progress toward the next level (0–100) */
  progressPercent: number;

  /** XP needed to reach the next level from the current level */
  xpToNextLevel: number;

  /** Whether the level-up celebration modal should be shown */
  showLevelUpModal: boolean;

  /** The level the user just reached (for displaying in the modal) */
  newLevel: number;

  /* ── Actions ── */

  /** Initialize or refresh XP from the server */
  setXp: (xp: number) => void;

  /** Add XP after a correct answer or completed day */
  addXp: (amount: number) => void;

  /** Dismiss the level-up modal */
  dismissLevelUpModal: () => void;
}

/* ─────────────────────────────────────────────
 * Store Definition
 * ───────────────────────────────────────────── */

/**
 * useLevelStore — tracks XP progress and levels across the platform.
 *
 * Usage example:
 *   const { xp, level, progressPercent } = useLevelStore();
 */
export const useLevelStore = create<LevelState>((set, get) => ({
  /* ── Initial State ── */
  xp: 0,
  level: 1,
  progressPercent: 0,
  xpToNextLevel: XP_PER_LEVEL_TABLE[1] - XP_PER_LEVEL_TABLE[0],
  showLevelUpModal: false,
  newLevel: 1,

  /* ── Actions ── */

  /**
   * Directly sets XP (used on page load to sync with server data).
   * Recalculates level, progress, and XP gap automatically.
   */
  setXp: (xp: number) => {
    const level = xpToLevel(xp);
    const progressPercent = xpProgressPercent(xp);
    const currentLevelXp = XP_PER_LEVEL_TABLE[level - 1];
    const nextLevelXp = XP_PER_LEVEL_TABLE[Math.min(level, 99)];
    const xpToNextLevel = nextLevelXp - currentLevelXp;

    set({ xp, level, progressPercent, xpToNextLevel });
  },

  /**
   * Adds XP incrementally and detects level-ups.
   * Triggers the level-up modal if the user crossed a level threshold.
   */
  addXp: (amount: number) => {
    const prevLevel = get().level;
    const newXp = get().xp + amount;
    const newLevel = xpToLevel(newXp);
    const progressPercent = xpProgressPercent(newXp);
    const nextLevelXp = XP_PER_LEVEL_TABLE[Math.min(newLevel, 99)];
    const currentLevelXp = XP_PER_LEVEL_TABLE[newLevel - 1];
    const xpToNextLevel = nextLevelXp - currentLevelXp;

    set({
      xp: newXp,
      level: newLevel,
      progressPercent,
      xpToNextLevel,
      /* Show the level-up modal if the user just crossed into a new level */
      showLevelUpModal: newLevel > prevLevel,
      newLevel: newLevel > prevLevel ? newLevel : get().newLevel,
    });
  },

  /**
   * Closes the level-up celebration modal.
   * Called when the user clicks "Continue" on the modal.
   */
  dismissLevelUpModal: () =>
    set({ showLevelUpModal: false }),
}));
