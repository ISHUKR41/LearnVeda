/*
 * FILE: Features.tsx
 * LOCATION: src/components/Home/Features/Features.tsx
 * PURPOSE: Highlights the core benefits and features of the platform.
 * AUTHOR: Zingpath Team
 * LAST UPDATED: 2026-05-18
 */

"use client";

import React from "react";
import { Brain, Users, TrendingUp, Shield, Zap, Medal } from "lucide-react";
import styles from "./Features.module.css";

const FEATURES = [
  {
    icon: Brain,
    title: "AI-Powered Learning",
    desc: "Personalized study plans that adapt to your speed and understanding of topics.",
  },
  {
    icon: Users,
    title: "Peer-to-Peer Battles",
    desc: "Challenge your friends or random opponents in real-time subject battles.",
  },
  {
    icon: TrendingUp,
    title: "In-Depth Analytics",
    desc: "Track your progress with detailed charts, weak-point analysis, and improvement metrics.",
  },
  {
    icon: Medal,
    title: "Gamified Experience",
    desc: "Earn badges, level up your profile, and rank on the national leaderboard.",
  },
  {
    icon: Shield,
    title: "Verified Content",
    desc: "All questions and study materials are verified by top educators and subject experts.",
  },
  {
    icon: Zap,
    title: "Instant Doubt Resolution",
    desc: "Stuck on a problem? Get instant solutions and step-by-step explanations.",
  },
];

/**
 * Features Component
 * A grid displaying 6 key platform features with modern iconography.
 */
export default function Features() {
  return (
    <section className={styles.featuresSection}>
      <div className={styles.sectionInner}>
        {/* Section Header */}
        <div className={`${styles.sectionHeader} animate-on-scroll`}>
          <h2 className={styles.sectionTitle}>Why Choose Zingpath?</h2>
          <p className={styles.sectionSubtitle}>
            We combine proven pedagogical methods with addictive game mechanics to make learning irresistible.
          </p>
        </div>

        {/* Features Grid */}
        <div className={styles.featuresGrid}>
          {FEATURES.map((feature, idx) => (
            <div key={idx} className={`${styles.featureCard} animate-on-scroll delay-${idx % 3}`}>
              <div className={styles.featureIconWrapper}>
                <feature.icon size={24} />
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
