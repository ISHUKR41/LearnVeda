/*
 * FILE: ClassTracks.tsx
 * LOCATION: src/components/Home/ClassTracks/ClassTracks.tsx
 * PURPOSE: Displays the primary learning tracks available (Class 9-12, Engineering, Battle Arena).
 * AUTHOR: LearnVeda Team
 * LAST UPDATED: 2026-05-18
 */

"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import styles from "./ClassTracks.module.css";

const CLASS_TRACKS = [
  {
    id: "class-9",
    name: "Class 9",
    description: "Build a rock-solid foundation across all core subjects.",
    subjects: 6,
    chapters: 70,
    href: "/class-9",
    colorClass: styles.cardBlue,
  },
  {
    id: "class-10",
    name: "Class 10",
    description: "Board exam ready — structured revision and tests.",
    subjects: 6,
    chapters: 75,
    href: "/class-10",
    colorClass: styles.cardViolet,
  },
  {
    id: "class-11",
    name: "Class 11",
    description: "Stream-based deep learning for Science, Commerce & Arts.",
    subjects: 18,
    chapters: 200,
    href: "/class-11",
    colorClass: styles.cardEmerald,
  },
  {
    id: "class-12",
    name: "Class 12",
    description: "Board + entrance exam mastery with competitive mock tests.",
    subjects: 18,
    chapters: 220,
    href: "/class-12",
    colorClass: styles.cardAmber,
  },
  {
    id: "engineering",
    name: "Engineering",
    description: "Master 12+ programming languages from zero to interview-ready.",
    subjects: 12,
    chapters: 150,
    href: "/engineering",
    colorClass: styles.cardCyan,
  },
  {
    id: "battle",
    name: "Battle Arena",
    description: "Challenge peers in real-time quiz battles and earn bonus XP.",
    subjects: "All",
    chapters: "Any",
    href: "/battle",
    colorClass: styles.cardRed,
  },
];

/**
 * ClassTracks Component
 * Shows available curriculum tracks. High visual impact with distinct colors per track.
 */
export default function ClassTracks() {
  return (
    <section className={styles.tracksSection}>
      <div className={styles.sectionInner}>
        {/* Section Header */}
        <div className={`${styles.sectionHeader} animate-on-scroll`}>
          <h2 className={styles.sectionTitle}>Explore Learning Tracks</h2>
          <p className={styles.sectionSubtitle}>
            From school foundations to advanced engineering. Find your perfect plan and start leveling up.
          </p>
        </div>

        {/* Tracks Grid */}
        <div className={styles.tracksGrid}>
          {CLASS_TRACKS.map((track, idx) => (
            <Link 
              href={track.href} 
              key={track.id} 
              className={`${styles.trackCard} ${track.colorClass} animate-on-scroll delay-${idx % 3}`}
              aria-label={`Explore ${track.name} curriculum`}
            >
              <div className={styles.trackCardContent}>
                <h3 className={styles.trackName}>{track.name}</h3>
                <p className={styles.trackDesc}>{track.description}</p>
                
                <div className={styles.trackStats}>
                  <span className={styles.trackStatBadge}>{track.subjects} Subjects</span>
                  <span className={styles.trackStatBadge}>{track.chapters} Chapters</span>
                </div>
              </div>
              
              <div className={styles.trackFooter}>
                <span className={styles.trackLinkText}>Explore Track</span>
                <ChevronRight size={18} className={styles.trackLinkIcon} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
