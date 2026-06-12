/*
 * FILE: CTA.tsx
 * LOCATION: src/components/Home/CTA/CTA.tsx
 * PURPOSE: A call-to-action component for the Home page.
 * AUTHOR: Learnova Team
 * LAST UPDATED: 2026-05-18
 */

"use client";

import React from "react";
import Link from "next/link";
import styles from "./CTA.module.css";

/**
 * CTA Component
 * The final call-to-action section asking the user to sign up or join.
 */
export default function CTA() {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaInner}>
        <div className={`${styles.ctaContent} animate-on-scroll`}>
          <h2 className={styles.ctaTitle}>Ready to Start Your Journey?</h2>
          <p className={styles.ctaSubtitle}>
            Join thousands of students leveling up their skills today. 100% free to get started.
          </p>
          <Link href="/sign-up" className={styles.ctaButton} aria-label="Create a Free Account">
            Create Free Account
          </Link>
        </div>
      </div>
    </section>
  );
}
