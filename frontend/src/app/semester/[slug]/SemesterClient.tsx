/**
 * FILE: SemesterClient.tsx
 * LOCATION: src/app/semester/[slug]/SemesterClient.tsx
 * PURPOSE: Scoped interactive checklist manager for dynamic Semester survival guides.
 *          Handles item cross-offs, completed status toggles, and priority indicator updates.
 *
 * LAYOUT INTERACTIVE TRIGGERS:
 *  - Reactive item styling based on completion map keys.
 *  - Checkbox selection updates.
 *
 * DEPENDENCIES: programmatic-data.ts, SemesterPage.module.css, React
 * LAST UPDATED: 2026-05-26
 */

"use client";

import { useState } from "react";
import styles from "./SemesterPage.module.css";
import { SemesterChecklistItem } from "@/lib/server/seo/programmatic-data";

interface SemesterClientProps {
  checklist: SemesterChecklistItem[];
}

export default function SemesterClient({ checklist }: SemesterClientProps) {
  // Store ticked checklist items by index in a map
  const [completedItems, setCompletedItems] = useState<Record<number, boolean>>({});

  const handleToggleItem = (index: number) => {
    setCompletedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getPriorityClass = (importance: string) => {
    switch (importance) {
      case "High":
        return styles.highPriority;
      case "Medium":
        return styles.medPriority;
      default:
        return styles.lowPriority;
    }
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.sectionTitle}>Syllabus Core Checklist</h2>
      <div className={styles.checklistsList}>
        {checklist.map((item, index) => {
          const isDone = !!completedItems[index];

          return (
            <div
              key={index}
              className={styles.checklistItem}
              onClick={() => handleToggleItem(index)}
            >
              <input
                type="checkbox"
                className={styles.checkboxInput}
                checked={isDone}
                onChange={() => {}} // Swapped dynamically via container click
              />
              <div className={styles.itemDetails}>
                <span className={`${styles.itemLabel} ${isDone ? styles.completedText : ""}`}>
                  {item.label}
                </span>
                <span className={styles.itemDesc}>{item.description}</span>
              </div>
              <span className={`${styles.priorityTag} ${getPriorityClass(item.importance)}`}>
                {item.importance}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
