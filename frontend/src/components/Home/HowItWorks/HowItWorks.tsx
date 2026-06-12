/*
 * FILE: HowItWorks.tsx
 * LOCATION: src/components/Home/HowItWorks/HowItWorks.tsx
 * PURPOSE: A clean, 3-step grid explaining how the platform works.
 * AUTHOR: Zingpath Team
 * LAST UPDATED: 2026-05-18
 */

"use client";

import React from "react";
import { Target, CalendarDays, Rocket } from "lucide-react";
import styles from "./HowItWorks.module.css";

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Target,
    title: "Choose Your Path",
    desc: "Pick any class, subject or programming language to begin your personalized journey.",
  },
  {
    step: "02",
    icon: CalendarDays,
    title: "Study Day-by-Day",
    desc: "Follow structured, expertly-curated plans with practice questions to master concepts.",
  },
  {
    step: "03",
    icon: Rocket,
    title: "Battle & Level Up",
    desc: "Challenge real opponents, earn experience points (XP), and climb the global ranks.",
  },
];

/**
 * HowItWorks Component
 * Explains the core loop of the platform visually.
 */
export default function HowItWorks() {
  return (
    <section className={styles.howSection}>
      <div className={styles.sectionInner}>
        {/* Section Header */}
        <div className={`${styles.sectionHeader} animate-on-scroll`}>
          <h2 className={styles.sectionTitle}>Your Path to Mastery</h2>
          <p className={styles.sectionSubtitle}>
            Simple, structured, and highly rewarding. Here is how you learn on Zingpath.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className={styles.howGrid}>
          {HOW_IT_WORKS.map((item, idx) => (
            <div key={idx} className={`${styles.howCard} animate-on-scroll delay-${idx + 1}`}>
              <div className={styles.howCardHeader}>
                <div className={styles.howIconBox}>
                  <item.icon size={28} />
                </div>
                <span className={styles.howStepNumber}>{item.step}</span>
              </div>
              <h3 className={styles.howCardTitle}>{item.title}</h3>
              <p className={styles.howCardDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
