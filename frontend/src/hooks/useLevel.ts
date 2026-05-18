/**
 * FILE: useLevel.ts
 * LOCATION: src/hooks/useLevel.ts
 * PURPOSE: Custom React hook for accessing the gamification level and XP system.
 *          Provides a clean interface to the levelStore Zustand state, plus
 *          convenience helpers for displaying XP progress in UI components.
 *          Components use this hook to render XP bars, level badges, and
 *          trigger the level-up celebration modal when a threshold is crossed.
 * USED BY: Dashboard, Profile page, XPBar component, LevelBadge component
 * DEPENDENCIES: levelStore (Zustand)
 * LAST UPDATED: 2026-05-16
 */

import { useLevelStore, XP_PER_LEVEL_TABLE } from "@/store/levelStore";

/**
 * useLevel — provides XP, level, and progress data for the current user.
 *
 * Returns:
 *   - xp               → total XP accumulated
 *   - level            → current level (1–100)
 *   - progressPercent  → % toward the next level (0–100)
 *   - xpToNextLevel    → XP gap from current level to next level
 *   - xpForNextLevel   → absolute XP total needed to reach next level
 *   - showLevelUpModal → whether to show the level-up celebration
 *   - newLevel         → the level that was just reached (for the modal)
 *   - addXp            → action to award XP points
 *   - setXp            → action to sync XP from the server
 *   - dismissLevelUpModal → action to close the level-up modal
 *
 * Usage:
 *   const { xp, level, progressPercent } = useLevel();
 */
export function useLevel() {
  const xp               = useLevelStore((state) => state.xp);
  const level            = useLevelStore((state) => state.level);
  const progressPercent  = useLevelStore((state) => state.progressPercent);
  const xpToNextLevel    = useLevelStore((state) => state.xpToNextLevel);
  const showLevelUpModal = useLevelStore((state) => state.showLevelUpModal);
  const newLevel         = useLevelStore((state) => state.newLevel);
  const addXp            = useLevelStore((state) => state.addXp);
  const setXp            = useLevelStore((state) => state.setXp);
  const dismissLevelUpModal = useLevelStore((state) => state.dismissLevelUpModal);

  /* Absolute XP target for the next level — used to display "X / 5000 XP" */
  const xpForNextLevel = level <= 99 ? XP_PER_LEVEL_TABLE[level] : Infinity;

  /* XP earned within the current level (for "200 / 300 XP this level" style displays) */
  const xpWithinCurrentLevel = xp - (XP_PER_LEVEL_TABLE[level - 1] ?? 0);

  return {
    xp,
    level,
    progressPercent,
    xpToNextLevel,
    xpForNextLevel,
    xpWithinCurrentLevel,
    showLevelUpModal,
    newLevel,
    addXp,
    setXp,
    dismissLevelUpModal,
  };
}
