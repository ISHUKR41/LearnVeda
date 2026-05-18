/*
 * FILE: ActivityHeatmap.tsx
 * LOCATION: src/components/dashboard/ActivityHeatmap.tsx
 * PURPOSE: GitHub-style contribution heatmap showing 52 weeks of learning activity.
 *          Each cell represents one day; colour intensity reflects questions answered.
 *          Renders as a pure CSS grid — no canvas, no SVG, no external chart lib.
 *          Matches the design described in MCP Section 18.3.
 *
 * COLOUR LEVELS (dark-navy palette, matches globals.css success tokens):
 *   Level 0 (0 questions) : #21262D  — empty, barely visible
 *   Level 1 (1–3)         : #0e4c1e  — faint green
 *   Level 2 (4–10)        : #2ea043  — medium green
 *   Level 3 (11–25)       : #3fb950  — bright green
 *   Level 4 (26+)         : #7ee787  — max intensity
 *
 * USED BY: src/app/dashboard/DashboardClient.tsx
 * DEPENDENCIES: None (pure React + CSS module)
 * LAST UPDATED: 2026-05-17
 */

"use client";

import { useMemo, useState } from "react";
import styles from "./ActivityHeatmap.module.css";

/* ─────────────────────────────────────────────
 * Type Definitions
 * ───────────────────────────────────────────── */

/** One day's worth of activity data */
export interface ActivityDay {
  /** ISO date string e.g. "2026-01-15" */
  isoDate: string;
  /** Number of questions answered on this day */
  count: number;
}

interface ActivityHeatmapProps {
  /** Array of ActivityDay objects (need not be complete — missing dates = 0 activity) */
  data: ActivityDay[];
  /** Total streak currently active (shown above the grid) */
  currentStreak?: number;
}

/* ─────────────────────────────────────────────
 * Helper Functions
 * ───────────────────────────────────────────── */

/**
 * Maps a question count to one of 5 visual intensity levels (0–4).
 * These levels correspond to CSS classes that change the cell background.
 */
function getLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 10) return 2;
  if (count <= 25) return 3;
  return 4;
}

/**
 * Formats an ISO date string into a human-readable tooltip string.
 * e.g. "2026-01-15" → "15 Jan 2026 · 5 questions"
 */
function formatTooltip(isoDate: string, count: number): string {
  const d = new Date(isoDate + "T00:00:00");
  const formatted = d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  if (count === 0) return `${formatted} · No activity`;
  return `${formatted} · ${count} question${count !== 1 ? "s" : ""}`;
}

/**
 * Builds an ordered array of 364 days (52 weeks × 7 days), ending with today.
 * Returns each day with its ISO date and the activity count from the supplied data.
 */
function buildGrid(data: ActivityDay[]): Array<{ isoDate: string; count: number }> {
  /* Index the supplied data by ISO date for O(1) lookup */
  const byDate: Record<string, number> = {};
  for (const d of data) {
    byDate[d.isoDate] = d.count;
  }

  /* Build the 364-day window ending today */
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const grid: Array<{ isoDate: string; count: number }> = [];

  /* Start from 363 days ago (day 0) and walk forward to today (day 363) */
  for (let i = 363; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().slice(0, 10); /* "YYYY-MM-DD" */
    grid.push({ isoDate: iso, count: byDate[iso] ?? 0 });
  }

  return grid;
}

/**
 * Derives month label positions for the 52-column grid.
 * Returns objects with the month short name and the column index it should appear above.
 */
function buildMonthLabels(grid: Array<{ isoDate: string }>): Array<{ label: string; col: number }> {
  const labels: Array<{ label: string; col: number }> = [];
  let lastMonth = -1;

  for (let col = 0; col < 52; col++) {
    /* The first cell in each column corresponds to the Sunday of that week */
    const dayIndex = col * 7;
    if (dayIndex >= grid.length) break;

    const month = new Date(grid[dayIndex].isoDate + "T00:00:00").getMonth();
    if (month !== lastMonth) {
      labels.push({
        label: new Date(grid[dayIndex].isoDate + "T00:00:00").toLocaleString("en-IN", { month: "short" }),
        col,
      });
      lastMonth = month;
    }
  }

  return labels;
}

/* ─────────────────────────────────────────────
 * Component
 * ───────────────────────────────────────────── */

/**
 * ActivityHeatmap renders a GitHub-style contribution graph showing 52 weeks
 * (364 days) of learning activity. Each cell is a 10×10 square that changes
 * colour based on how many questions the student answered that day.
 *
 * Hovering a cell shows a tooltip with the date and exact question count.
 */
export default function ActivityHeatmap({ data, currentStreak = 0 }: ActivityHeatmapProps) {
  /* Build the 52×7 grid once per render — memoised for performance */
  const grid = useMemo(() => buildGrid(data), [data]);
  const monthLabels = useMemo(() => buildMonthLabels(grid), [grid]);

  /* Controlled tooltip — shown when the user hovers a cell */
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  /* Count total questions across the entire period for the summary line */
  const totalQuestions = useMemo(() => grid.reduce((s, d) => s + d.count, 0), [grid]);
  const activeDays = useMemo(() => grid.filter(d => d.count > 0).length, [grid]);

  /* Chunk the flat 364-item array into 52 columns of 7 days each */
  const columns: Array<typeof grid> = [];
  for (let col = 0; col < 52; col++) {
    columns.push(grid.slice(col * 7, col * 7 + 7));
  }

  return (
    <div className={styles.wrapper}>

      {/* Summary line above the grid */}
      <div className={styles.summary}>
        <span className={styles.summaryText}>
          <strong>{totalQuestions.toLocaleString("en-IN")}</strong> questions in the last year
        </span>
        <span className={styles.summaryMeta}>
          {activeDays} active days · {currentStreak} day streak 🔥
        </span>
      </div>

      {/* Month labels row */}
      <div className={styles.monthRow} aria-hidden="true">
        {monthLabels.map((m) => (
          <span
            key={`${m.label}-${m.col}`}
            className={styles.monthLabel}
            /* position the label above its column using inline custom property */
            style={{ "--col": m.col } as React.CSSProperties}
          >
            {m.label}
          </span>
        ))}
      </div>

      {/* Heatmap grid — 52 columns, each with 7 rows (Sun→Sat) */}
      <div
        className={styles.grid}
        role="grid"
        aria-label="Activity heatmap — hover any square for details"
      >
        {columns.map((week, colIdx) =>
          week.map((day, rowIdx) => {
            const level = getLevel(day.count);
            return (
              <div
                key={day.isoDate}
                role="gridcell"
                className={`${styles.cell} ${styles[`level${level}`]}`}
                /* Column + row position set via CSS custom properties for the grid layout */
                style={{ "--col": colIdx, "--row": rowIdx } as React.CSSProperties}
                aria-label={formatTooltip(day.isoDate, day.count)}
                onMouseEnter={(e) => {
                  const rect = (e.target as HTMLElement).getBoundingClientRect();
                  const container = (e.currentTarget.closest(`.${styles.grid}`) as HTMLElement).getBoundingClientRect();
                  setTooltip({
                    text: formatTooltip(day.isoDate, day.count),
                    x: rect.left - container.left + rect.width / 2,
                    y: rect.top - container.top - 8,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            );
          })
        )}

        {/* Floating tooltip — appears above the hovered cell */}
        {tooltip && (
          <div
            className={styles.tooltip}
            style={{
              "--tip-x": `${tooltip.x}px`,
              "--tip-y": `${tooltip.y}px`,
            } as React.CSSProperties}
            aria-hidden="true"
          >
            {tooltip.text}
          </div>
        )}
      </div>

      {/* Legend row */}
      <div className={styles.legend} aria-hidden="true">
        <span className={styles.legendLabel}>Less</span>
        {([0, 1, 2, 3, 4] as const).map((lvl) => (
          <div key={lvl} className={`${styles.cell} ${styles[`level${lvl}`]} ${styles.legendCell}`} />
        ))}
        <span className={styles.legendLabel}>More</span>
      </div>
    </div>
  );
}
