/**
 * FILE: XPBar.tsx
 * LOCATION: src/components/gamification/XPBar.tsx
 * PURPOSE: Animated horizontal XP progress bar that shows the student's current
 *          XP level and progress toward the next level. The bar fills from 0% to
 *          progressPercent using a CSS transition, making leveling-up feel
 *          satisfying and immediate.
 *          The component is "dumb" — it receives all data as props and calls
 *          the useLevel hook internally for live Zustand state. It can also
 *          accept overrideXp/overrideLevel props when rendering server-fetched data.
 * USED BY: Dashboard, Profile page, post-battle result screen
 * DEPENDENCIES: lucide-react, useLevel hook, XPBar.module.css
 * LAST UPDATED: 2026-05-16
 */

"use client";

import { Zap } from "lucide-react";
import { useLevel } from "@/hooks/useLevel";
import styles from "./XPBar.module.css";

/* ─────────────────────────────────────────────
 * Props
 * ───────────────────────────────────────────── */

interface XPBarProps {
  /**
   * Optional override values — used when the parent component has server-fetched
   * user data and wants to skip the Zustand store (e.g. profile page server render).
   * When not provided, the component reads from the Zustand levelStore via useLevel().
   */
  overrideXp?: number;
  overrideLevel?: number;
  overridePercent?: number;

  /** Show the numerical XP counts below the bar (default: true) */
  showLabels?: boolean;

  /** Compact variant — smaller height, no labels (default: false) */
  compact?: boolean;
}

/* ─────────────────────────────────────────────
 * Component
 * ───────────────────────────────────────────── */

/**
 * XPBar — shows XP progress toward next level.
 *
 * Layout:
 *   [⚡ Level 7] ████████░░░░░░░░ [650 / 1200 XP]
 */
export default function XPBar({
  overrideXp,
  overrideLevel,
  overridePercent,
  showLabels = true,
  compact = false,
}: XPBarProps) {
  /* Read from the Zustand level store */
  const { xp, level, progressPercent, xpForNextLevel, xpWithinCurrentLevel } = useLevel();

  /* Use override values if provided, otherwise fall back to Zustand state */
  const displayLevel   = overrideLevel   ?? level;
  const displayXp      = overrideXp      ?? xp;
  const displayPercent = overridePercent ?? progressPercent;
  const displayXpWithin = overrideXp != null
    ? overrideXp - (displayXp - xpWithinCurrentLevel)
    : xpWithinCurrentLevel;
  const displayXpForNext = xpForNextLevel;

  /* Clamp percentage to 0–100 to avoid visual overflow */
  const clampedPercent = Math.min(100, Math.max(0, displayPercent));

  /* Choose colour tier: gold at max level, green near-complete, blue default */
  const barColor =
    displayLevel >= 100
      ? "var(--color-accent)"
      : clampedPercent >= 80
      ? "var(--color-success)"
      : "var(--color-primary)";

  return (
    <div className={`${styles.wrapper} ${compact ? styles.compact : ""}`}>
      {/* Level badge + XP label row */}
      {showLabels && (
        <div className={styles.labelRow}>
          <span className={styles.levelBadge} style={{ background: barColor }}>
            <Zap size={compact ? 10 : 12} />
            Lv {displayLevel}
          </span>
          {!compact && (
            <span className={styles.xpLabel}>
              {displayXpWithin.toLocaleString()} / {displayXpForNext === Infinity ? "MAX" : displayXpForNext.toLocaleString()} XP
            </span>
          )}
        </div>
      )}

      {/* Progress bar track */}
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={clampedPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Level ${displayLevel} — ${clampedPercent}% to next level`}
      >
        {/* Filled portion */}
        <div
          className={styles.fill}
          style={{
            width: `${clampedPercent}%`,
            background: barColor,
          }}
        />

        {/* Glowing highlight stripe — cosmetic detail inside the fill */}
        {clampedPercent > 5 && (
          <div
            className={styles.fillGlow}
            style={{ width: `${clampedPercent}%` }}
          />
        )}
      </div>

      {/* Total XP display below bar (non-compact only) */}
      {showLabels && !compact && (
        <p className={styles.totalXp}>
          {displayXp.toLocaleString()} total XP earned
        </p>
      )}
    </div>
  );
}
