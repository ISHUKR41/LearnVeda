/**
 * FILE: page.tsx
 * LOCATION: src/app/about/page.tsx
 * PURPOSE: About page — explains EduQuest's learning mission, core platform
 *          pillars, key statistics, and value propositions for students,
 *          parents, and institutional partners.
 * USED BY: Footer platform links, navbar "About" link
 * DEPENDENCIES: next/link, lucide-react, About.module.css
 * LAST UPDATED: 2026-05-11
 */

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Code2,
  Shield,
  Sparkles,
  Swords,
  Target,
  Trophy,
} from "lucide-react";
import styles from "./About.module.css";

/* ISR: About page content rarely changes — revalidate every 24 hours */
export const revalidate = 86400;

/** SEO metadata — ensures search engines index this page with proper title and description. */
export const metadata = {
  title: "About EduQuest — Our Mission & Vision",
  description:
    "Learn why EduQuest combines structured academics, coding tracks, and safe learning battles to create the most effective gamified education platform for Class 9-12 and Engineering students.",
};

/**
 * Platform statistics — displayed in the hero section stats bar.
 * These numbers represent the overall scale of the EduQuest ecosystem.
 */
const PLATFORM_STATS = [
  { number: "50K+", label: "Students" },
  { number: "500+", label: "Chapters" },
  { number: "12+", label: "Languages" },
  { number: "10K+", label: "Questions" },
];

/**
 * Value propositions — key reasons why students choose EduQuest.
 * Each item includes an icon, a gradient for the icon background,
 * a heading, and a brief description.
 */
const VALUE_PROPOSITIONS = [
  {
    icon: Target,
    gradient: "linear-gradient(135deg, #3B82F6, #06B6D4)",
    title: "Structured Day-Wise Plans",
    description:
      "Every subject has a clear 15 to 60 day learning path so students never feel lost about what to study next.",
  },
  {
    icon: Swords,
    gradient: "linear-gradient(135deg, #8B5CF6, #A855F7)",
    title: "Skill-Based Competitions",
    description:
      "Battle Arena matches students by skill level for fair, growth-focused competitions — not pressure traps.",
  },
  {
    icon: BarChart3,
    gradient: "linear-gradient(135deg, #10B981, #14B8A6)",
    title: "Progress Analytics",
    description:
      "Dashboard metrics show XP, streaks, rank, and subject-wise performance so learners always see their growth.",
  },
  {
    icon: Shield,
    gradient: "linear-gradient(135deg, #F59E0B, #F97316)",
    title: "Safe Learning Environment",
    description:
      "Rate limiting, anti-cheat planning, and respectful community guidelines keep the platform healthy.",
  },
];

/**
 * Core platform pillars — the three foundational aspects of EduQuest.
 * Each pillar has: icon, gradient, title, description, and feature tags.
 */
const PLATFORM_PILLARS = [
  {
    icon: BookOpen,
    gradient: "linear-gradient(135deg, #3B82F6, #06B6D4)",
    title: "Structured Academics",
    description:
      "Class 9 through 12 with NCERT-aligned chapters, board-level preparation, and stream-specific tracks for Science, Commerce, and Arts.",
    tags: ["NCERT Aligned", "Board Prep", "Stream Tracks"],
  },
  {
    icon: Code2,
    gradient: "linear-gradient(135deg, #8B5CF6, #A855F7)",
    title: "Engineering & Coding",
    description:
      "Comprehensive programming tracks covering 12+ languages — from C and Python fundamentals to advanced Data Structures and Web Development.",
    tags: ["12+ Languages", "DSA", "Web Dev"],
  },
  {
    icon: Trophy,
    gradient: "linear-gradient(135deg, #10B981, #14B8A6)",
    title: "Gamified Competition",
    description:
      "XP leveling system, daily streaks, real-time quiz battles, and seasonal leaderboards that make consistent study genuinely rewarding.",
    tags: ["XP System", "Battles", "Leaderboards"],
  },
];

/**
 * AboutPage Component
 *
 * A comprehensive page explaining EduQuest's mission, values, and platform
 * capabilities. Designed to convert visitors (students, parents, partners)
 * by presenting a clear value proposition with professional visual design.
 *
 * Sections:
 * 1. Hero — headline, subtitle, and stats bar
 * 2. Mission — value propositions in a two-column layout
 * 3. Pillars — three core platform capabilities as interactive cards
 * 4. CTA — call to action prompting account creation
 */
export default function AboutPage() {
  return (
    <div className={styles.page}>
      {/* ==================== HERO SECTION ==================== */}
      {/* Full-width hero with gradient background, headline, subtitle,
          and platform stats bar showing key numbers. */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          {/* Kicker badge — provides quick context above the heading */}
          <div className={styles.kicker}>
            <Sparkles size={14} />
            About EduQuest
          </div>

          {/* Main heading — uses gradient highlight for the key phrase */}
          <h1 className={styles.heroTitle}>
            Learning that feels{" "}
            <span className={styles.heroHighlight}>focused, fair, and worth returning to.</span>
          </h1>

          {/* Subtitle — explains the target audience and platform purpose */}
          <p className={styles.heroSubtitle}>
            EduQuest is built for Class 9-12 and Engineering learners who need clear
            study paths, healthy competition, and progress they can understand at a glance.
            We combine structured academics with gaming mechanics to make daily study
            genuinely rewarding.
          </p>

          {/* Stats bar — 4 key metrics showing platform scale */}
          <div className={styles.statsBar}>
            {PLATFORM_STATS.map((stat) => (
              <div key={stat.label} className={styles.statItem}>
                <span className={styles.statNumber}>{stat.number}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== MISSION SECTION ==================== */}
      {/* Two-column layout: mission statement on left, value propositions on right. */}
      <section className={styles.missionSection}>
        <span className={styles.sectionLabel}>Our Mission</span>
        <h2 className={styles.sectionTitle}>Why We Built EduQuest</h2>

        <div className={styles.missionGrid}>
          {/* Left column — mission statement */}
          <div className={styles.missionText}>
            <p>
              Education platforms often overwhelm students with content dumps and
              generic video playlists. EduQuest takes a different approach:{" "}
              <strong>every student gets a clear, day-wise learning path</strong> that
              breaks complex syllabi into manageable daily tasks.
            </p>
            <br />
            <p>
              We believe that <strong>consistency beats intensity</strong>. Our streak
              system, XP progression, and battle mechanics are designed to make daily
              study feel like progress — not punishment. Whether you are preparing for
              Class 10 boards or learning your first programming language, EduQuest
              gives you structure, motivation, and community support.
            </p>
            <br />
            <p>
              Built by a team that understands the Indian education landscape, EduQuest
              combines <strong>NCERT-aligned academic content</strong> with practical
              coding skills and fair competitive gaming to prepare students for both
              exams and real-world problem solving.
            </p>
          </div>

          {/* Right column — value proposition cards */}
          <div className={styles.valueList}>
            {VALUE_PROPOSITIONS.map((prop) => (
              <div key={prop.title} className={styles.valueItem}>
                <div className={styles.valueIcon} style={{ "--icon-gradient": prop.gradient } as React.CSSProperties}>
                  <prop.icon size={18} />
                </div>
                <div className={styles.valueContent}>
                  <h3>{prop.title}</h3>
                  <p>{prop.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PILLARS SECTION ==================== */}
      {/* Three-card grid showing the core platform capabilities.
          Each card has a colored accent bar, icon, description, and tags. */}
      <section className={styles.pillarsSection}>
        <div className={styles.pillarsInner}>
          <div className={styles.pillarsHeader}>
            <span className={styles.sectionLabel}>Platform Pillars</span>
            <h2 className={styles.sectionTitle}>Three Pillars of Learning</h2>
            <p className={styles.heroSubtitle}>
              EduQuest is built on three core capabilities that work together to create
              a complete learning ecosystem.
            </p>
          </div>

          <div className={styles.pillarsGrid}>
            {PLATFORM_PILLARS.map((pillar) => (
              <article
                key={pillar.title}
                className={styles.pillarCard}
                style={{ "--pillar-color": pillar.gradient } as React.CSSProperties}
              >
                {/* Pillar icon — circular badge with gradient background */}
                <div className={styles.pillarIcon} style={{ "--icon-gradient": pillar.gradient } as React.CSSProperties}>
                  <pillar.icon size={22} />
                </div>

                {/* Pillar content */}
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>

                {/* Feature tags — small pill badges listing key capabilities */}
                <div className={styles.pillarTags}>
                  {pillar.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      {/* Final call-to-action prompting the visitor to create an account. */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>Ready to Start Your Journey?</h2>
          <p className={styles.ctaSubtitle}>
            Join thousands of students who are already mastering their subjects,
            building streaks, and climbing the leaderboard.
          </p>
          <Link href="/sign-up" className={styles.ctaBtn}>
            Create Free Account <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
