/*
 * FILE: Stats.tsx
 * LOCATION: src/components/Home/Stats/Stats.tsx
 * PURPOSE: A component to show platform statistics in a visually appealing grid.
 * AUTHOR: LearnVeda Team
 * LAST UPDATED: 2026-05-18
 */

"use client";

import React from "react";
import styles from "./Stats.module.css";

/**
 * Stats Component
 * Displays the key statistics about the platform to build trust.
 */
export default function Stats() {
  return (
    <section className={styles.statsSection}>
      <div className={styles.sectionInner}>
        <div className={styles.statsGrid}>
          <div className={`${styles.statBlock} animate-on-scroll`}>
            <span className={styles.statBigNumber}>50,000+</span>
            <span className={styles.statLabel}>Active Students</span>
          </div>
          <div className={`${styles.statBlock} animate-on-scroll delay-1`}>
            <span className={styles.statBigNumber}>500+</span>
            <span className={styles.statLabel}>CBSE Chapters</span>
          </div>
          <div className={`${styles.statBlock} animate-on-scroll delay-2`}>
            <span className={styles.statBigNumber}>12</span>
            <span className={styles.statLabel}>Programming Languages</span>
          </div>
          <div className={`${styles.statBlock} animate-on-scroll delay-3`}>
            <span className={styles.statBigNumber}>10,000+</span>
            <span className={styles.statLabel}>Practice Questions</span>
          </div>
        </div>
      </div>
    </section>
  );
}
