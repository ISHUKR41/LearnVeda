/*
 * FILE: TrustBar.tsx
 * LOCATION: src/components/Home/TrustBar/TrustBar.tsx
 * PURPOSE: A minimalist bar displaying the core offerings/features as trust signals right below the hero.
 * AUTHOR: LearnVeda Team
 * LAST UPDATED: 2026-05-18
 */

"use client";

import React from "react";
import { BookOpen, Code2, Swords } from "lucide-react";
import styles from "./TrustBar.module.css";

const TRUST_PILLS = [
  { label: "Class 9", icon: BookOpen },
  { label: "Class 10", icon: BookOpen },
  { label: "Class 11", icon: BookOpen },
  { label: "Class 12", icon: BookOpen },
  { label: "Engineering", icon: Code2 },
  { label: "Live Battles", icon: Swords },
];

/**
 * TrustBar Component
 * Renders small "pills" denoting supported classes and features.
 * Designed with a clean, professional aesthetic to build immediate trust.
 */
export default function TrustBar() {
  return (
    <section className={styles.trustSection}>
      <div className={styles.trustInner}>
        <div className={styles.trustPills}>
          {TRUST_PILLS.map((pill, idx) => (
            <div key={idx} className={styles.trustPill} aria-label={`Support for ${pill.label}`}>
              <pill.icon size={16} className={styles.pillIcon} aria-hidden="true" />
              <span>{pill.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
