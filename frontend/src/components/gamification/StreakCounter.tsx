/**
 * FILE: StreakCounter.tsx
 * LOCATION: src/components/gamification/StreakCounter.tsx
 * PURPOSE: Displays the student's current daily study streak count with an
 *          animated flame icon. Changes colour based on streak health:
 *            - 0 days → greyed out (no streak)
 *            - 1–6 days → blue (getting started)
 *            - 7–29 days → orange (on fire)
 *            - 30+ days → gold + pulsing glow (elite)
 *          If the streak is at risk (last active = yesterday and today not done),
 *          shows a gentle amber warning banner.
 * USED BY: Dashboard, Navbar (compact), Profile page sidebar
 * DEPENDENCIES: useStreak hook, StreakCounter.module.css, lucide-react
 * LAST UPDATED: 2026-05-16
 */

"use client";

import { Flame } from "lucide-react";
import { useStreak } from "@/hooks/useStreak";
import styles from "./StreakCounter.module.css";

/* ─────────────────────────────────────────────
 * Types
 * ───────────────────────────────────────────── */

interface StreakCounterProps {
  /** Override streak values from server-fetched data instead of Zustand store */
  overrideStreak?: number;
  overrideLongest?: number;

  /** Show the "longest streak" stat below the counter (default: false) */
  showLongest?: boolean;

  /** Show the "at risk" warning banner (default: true) */
  showAtRisk?: boolean;

  /** Use a compact horizontal layout without the longest-streak label */
  compact?: boolean;
}

/* ─────────────────────────────────────────────
 * Helpers
 * ───────────────────────────────────────────── */

/**
 * Returns the theme colour and label for the current streak tier.
 * Tiers: none → starting → active → on fire → elite
 */
function getStreakTheme(streak: number): {
  color: string;
  glow: boolean;
  label: string;
} {
  if (streak === 0)  return { color: "var(--color-text-tertiary)",  glow: false, label: "No streak yet" };
  if (streak < 7)   return { color: "var(--color-primary)",         glow: false, label: `${streak}-day streak` };
  if (streak < 30)  return { color: "#F97316",                      glow: false, label: `🔥 ${streak}-day streak` };
  return              { color: "#FBBF24",                            glow: true,  label: `⚡ ${streak}-day streak` };
}

/* ─────────────────────────────────────────────
 * Component
 * ───────────────────────────────────────────── */

/**
 * StreakCounter — animated daily streak display.
 *
 * Standard layout:
 *   [🔥 14]
 *   14-day streak
 *   Longest: 21 days
 *
 * Compact layout:
 *   🔥 14
 */
export default function StreakCounter({
  overrideStreak,
  overrideLongest,
  showLongest = false,
  showAtRisk = true,
  compact = false,
}: StreakCounterProps) {
  /* Read from Zustand streak store */
  const { currentStreak, longestStreak, isAtRisk } = useStreak();

  /* Use override values when provided (e.g. from the dashboard API) */
  const displayStreak  = overrideStreak  ?? currentStreak;
  const displayLongest = overrideLongest ?? longestStreak;

  /* Determine visual style for this streak tier */
  const { color, glow, label } = getStreakTheme(displayStreak);

  if (compact) {
    /* Compact: just a flame icon + number, single row */
    return (
      <span
        className={`${styles.compact} ${glow ? styles.glowing : ""}`}
        title={label}
        style={{ color }}
      >
        <Flame size={16} />
        {displayStreak}
      </span>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Main streak number + flame icon */}
      <div
        className={`${styles.counter} ${glow ? styles.glowing : ""}`}
        style={{ color }}
      >
        <Flame
          size={40}
          className={styles.flameIcon}
          style={{ color }}
        />
        <span className={styles.count}>{displayStreak}</span>
      </div>

      {/* Label: e.g. "🔥 14-day streak" */}
      <p className={styles.label} style={{ color }}>{label}</p>

      {/* Longest streak stat */}
      {showLongest && (
        <p className={styles.longestStreak}>
          Longest: <strong>{displayLongest} days</strong>
        </p>
      )}

      {/* At-risk warning banner */}
      {showAtRisk && isAtRisk && displayStreak > 0 && (
        <div className={styles.atRiskBanner}>
          ⚠️ Complete a question today to keep your streak!
        </div>
      )}
    </div>
  );
}
