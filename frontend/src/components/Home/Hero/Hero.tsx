/*
 * FILE: Hero.tsx
 * LOCATION: src/components/Home/Hero/Hero.tsx
 * PURPOSE: The Hero component represents the very first section of the Home Page.
 * It contains the main hook, call-to-action buttons, and key platform statistics.
 * The design is modern, minimalistic, and built for high-performance (lazy loaded images).
 * AUTHOR: EduQuest Team
 * LAST UPDATED: 2026-05-18
 */

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Zap, ChevronRight } from "lucide-react";
import styles from "./Hero.module.css";

/**
 * Hero Component
 * Displays the main banner, headline, and call-to-action buttons.
 * Designed with a highly professional look, using subtle gradients and glassmorphism.
 */
export default function Hero() {
  return (
    <section className={styles.heroSection}>
      {/* 
        Background image loaded with high priority since it's above the fold.
        Using Next.js Image component for automatic optimization and WebP conversion.
      */}
      <Image
        src="/images/eduquest-home-hero.png" // Placeholder for a professional image
        alt="Students learning and coding in a futuristic environment"
        fill
        priority
        sizes="100vw"
        className={styles.heroBackgroundImage}
        quality={90}
      />
      {/* Overlay to ensure text readability over the image */}
      <div className={styles.heroImageOverlay} aria-hidden="true" />

      <div className={styles.heroInner}>
        <div className={`${styles.heroContent} animate-on-scroll`}>
          {/* Top Badge for social proof or platform status */}
          <span className={styles.heroBadge}>
            <Zap size={14} aria-hidden="true" className={styles.iconPulse} /> 
            India&apos;s #1 Gamified Learning Platform
          </span>
          
          {/* Main Headline - Using modern typography scale */}
          <h1 className={styles.heroTitle}>
            Learn Smarter. <span className={styles.highlightText}>Battle Harder.</span> Level Up.
          </h1>
          
          {/* Subtitle - Explaining the value proposition clearly */}
          <p className={styles.heroSubtitle}>
            India&apos;s most engaging CBSE + Engineering learning platform. 
            Study chapter-wise, battle peers in real-time, earn XP, and climb the leaderboard.
          </p>
          
          {/* Action Buttons */}
          <div className={styles.heroActions}>
            <Link href="/sign-up" className={styles.btnPrimary} aria-label="Start Learning for Free">
              Start Learning Free <ChevronRight size={18} className={styles.arrowIcon} />
            </Link>
            <Link href="/class-9" className={styles.btnSecondary} aria-label="Browse Available Classes">
              Browse Classes
            </Link>
          </div>

          {/* Key Statistics for Trust Building */}
          <div className={styles.heroStatsRow}>
            <span className={styles.heroStatItem}><strong>50,000+</strong> Students</span>
            <span className={styles.heroStatDivider}>|</span>
            <span className={styles.heroStatItem}><strong>500+</strong> CBSE Chapters</span>
            <span className={styles.heroStatDivider}>|</span>
            <span className={styles.heroStatItem}><strong>12</strong> Languages</span>
            <span className={styles.heroStatDivider}>|</span>
            <span className={styles.heroStatItem}><strong>10,000+</strong> Questions</span>
          </div>
        </div>
      </div>
    </section>
  );
}
