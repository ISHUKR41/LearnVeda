/**
 * FILE: LevelBadge.tsx
 * LOCATION: src/components/gamification/LevelBadge.tsx
 * PURPOSE: A compact pill badge that displays the student's current level number.
 *          The badge colour changes based on level tier:
 *            Level 1–9   → grey (novice)
 *            Level 10–24 → blue (apprentice)
 *            Level 25–49 → green (skilled)
 *            Level 50–74 → purple (expert)
 *            Level 75–99 → orange (master)
 *            Level 100   → gold + sparkle (legend)
 *          Can be used inline (small) or as a large avatar overlay (big).
 * USED BY: Leaderboard rows, community post headers, profile avatar
 * DEPENDENCIES: lucide-react, LevelBadge.module.css, useLevel hook
 * LAST UPDATED: 2026-05-16
 */

"use client";

import { Zap, Star } from "lucide-react";
import { useLevel } from "@/hooks/useLevel";
import styles from "./LevelBadge.module.css";

/* ─────────────────────────────────────────────
 * Types
 * ───────────────────────────────────────────── */

interface LevelBadgeProps {
  /** Override the level number from outside (e.g. from server data) */
  overrideLevel?: number;

  /** Size variant: "sm" | "md" | "lg" (default: "md") */
  size?: "sm" | "md" | "lg";
}

/* ─────────────────────────────────────────────
 * Helpers
 * ───────────────────────────────────────────── */

/**
 * Returns the badge background gradient based on the level tier.
 * Each tier has a distinct colour identity to make progression visible.
 */
function getLevelGradient(level: number): string {
  if (level >= 100) return "linear-gradient(135deg, #FBBF24, #F59E0B)";  /* Gold — Legend */
  if (level >= 75)  return "linear-gradient(135deg, #EA580C, #F97316)";  /* Orange — Master */
  if (level >= 50)  return "linear-gradient(135deg, #7C3AED, #A78BFA)";  /* Purple — Expert */
  if (level >= 25)  return "linear-gradient(135deg, #059669, #34D399)";  /* Green — Skilled */
  if (level >= 10)  return "linear-gradient(135deg, #2563EB, #0EA5E9)";  /* Blue — Apprentice */
  return "linear-gradient(135deg, #6B7280, #9CA3AF)";                    /* Grey — Novice */
}

/** Returns a short tier label for the tooltip/aria-label. */
function getTierName(level: number): string {
  if (level >= 100) return "Legend";
  if (level >= 75)  return "Master";
  if (level >= 50)  return "Expert";
  if (level >= 25)  return "Skilled";
  if (level >= 10)  return "Apprentice";
  return "Novice";
}

/* ─────────────────────────────────────────────
 * Component
 * ───────────────────────────────────────────── */

/**
 * LevelBadge — coloured level pill badge with tier-based gradient.
 *
 * Usage:
 *   <LevelBadge />               — reads level from Zustand store
 *   <LevelBadge overrideLevel={42} size="sm" />  — external level, small
 */
export default function LevelBadge({ overrideLevel, size = "md" }: LevelBadgeProps) {
  /* Read level from Zustand store (used if no override is provided) */
  const { level } = useLevel();

  const displayLevel = overrideLevel ?? level;
  const gradient     = getLevelGradient(displayLevel);
  const tierName     = getTierName(displayLevel);
  const isLegend     = displayLevel >= 100;

  return (
    <span
      className={`${styles.badge} ${styles[size]}`}
      style={{ background: gradient }}
      title={`Level ${displayLevel} — ${tierName}`}
      aria-label={`Level ${displayLevel}`}
    >
      {/* Icon: Star for legend, Zap for everyone else */}
      {isLegend ? <Star size={size === "sm" ? 9 : size === "lg" ? 14 : 11} /> : <Zap size={size === "sm" ? 9 : size === "lg" ? 14 : 11} />}
      {displayLevel}
    </span>
  );
}
