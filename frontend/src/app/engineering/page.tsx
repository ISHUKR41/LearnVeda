/**
 * FILE: page.tsx
 * LOCATION: src/app/engineering/page.tsx
 * PURPOSE: Engineering track landing page — displays all programming languages and
 *          CS technical skills available for engineering students. Each language card
 *          links to a structured day-wise learning plan (/engineering/[slug]).
 * USED BY: Next.js App Router — renders at "/engineering"
 * DEPENDENCIES: next/link, next/image, lucide-react, Engineering.module.css, constants.ts
 * LAST UPDATED: 2026-05-19
 * NOTE: Language cards use stable Lucide-backed badges and keep the page local
 *       to the repo's icon system instead of adding another icon dependency.
 */

import Link from "next/link";
import Image from "next/image";
import {
  Code2,
  Database,
  GitBranch,
  Globe,
  HardDrive,
  Network,
  Trophy,
  UserCheck,
  Workflow,
  ArrowRight,
  Zap,
  Star,
  Clock,
  ChevronRight,
} from "lucide-react";
import { ENGINEERING_LANGUAGES, ENGINEERING_SKILLS } from "@/lib/constants";
import styles from "./Engineering.module.css";

/* ─────────────────────────────────────────────
 * SEO Metadata
 * ───────────────────────────────────────────── */
/* ISR: Revalidate every hour — engineering track content rarely changes */
export const revalidate = 3600;

export const metadata = {
  title: "Engineering Track — 12+ Languages & CS Subjects | EduQuest",
  description:
    "Master programming languages and core CS subjects with structured day-wise plans. From C to Rust, DSA to System Design — become interview-ready.",
  icons: {
    icon: "/favicons/engineering.svg",
  },
};

/* ─────────────────────────────────────────────
 * SKILL_ICONS
 * Maps engineering skill IDs to Lucide icon components.
 * ───────────────────────────────────────────── */
const SKILL_ICONS: Record<string, React.ComponentType<{ size?: number; "aria-hidden"?: "true" }>> = {
  dsa:                     GitBranch,
  "web-dev":               Globe,
  "system-design":         Workflow,
  dbms:                    Database,
  os:                      HardDrive,
  cn:                      Network,
  "git-github":            GitBranch,
  "competitive-programming": Trophy,
  "interview-prep":        UserCheck,
};

/* ─────────────────────────────────────────────
 * SKILL_ACCENTS
 * Background + foreground colors for each skill card icon.
 * ───────────────────────────────────────────── */
const SKILL_ACCENTS: Record<string, string> = {
  dsa:                     "skillAccentBlue",
  "web-dev":               "skillAccentCyan",
  "system-design":         "skillAccentViolet",
  dbms:                    "skillAccentGreen",
  os:                      "skillAccentAmber",
  cn:                      "skillAccentRed",
  "git-github":            "skillAccentOrange",
  "competitive-programming": "skillAccentGold",
  "interview-prep":        "skillAccentTeal",
};

/**
 * LANGUAGE_BADGES maps language IDs to the Lucide icon component that best
 * represents the language family. This keeps the cards more professional than
 * plain monogram tiles without introducing a new icon library.
 */
const LANGUAGE_BADGES: Record<string, React.ComponentType<{ size?: number; "aria-hidden"?: "true" }>> = {
  "c-language": Code2,
  cpp: Code2,
  java: Code2,
  python: Database,
  javascript: Globe,
  typescript: Code2,
  rust: Workflow,
  kotlin: Workflow,
  swift: Zap,
  sql: Database,
  dart: Globe,
  ruby: Star,
};

/* ─────────────────────────────────────────────
 * WHY_ENGINEERING items — shown in the footer info strip
 * ───────────────────────────────────────────── */
const WHY_ENG = [
  { icon: Zap,   title: "Day-wise Plans",  desc: "30–60 day structured plans for each language and CS subject." },
  { icon: Star,  title: "FAANG Ready",     desc: "Curated for SDE interviews — DSA, OS, DBMS, and more." },
  { icon: Clock, title: "Self-paced",       desc: "Resume any plan where you left off. Learn on your schedule." },
];

/* ─────────────────────────────────────────────
 * EngineeringPage Component
 * Server Component — no hooks, all data is static constants.
 * ───────────────────────────────────────────── */
export default function EngineeringPage() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        {/* ==================== HERO BANNER ==================== */}
        <div className={styles.banner}>
          {/*
           * Real hero image showing an engineering learner at work.
           * The overlay gradient ensures headline text is always legible.
           */}
          <Image
            src="/images/engineering-hero.png"
            alt="Engineering learner working through programming and systems concepts"
            fill
            priority
            className={styles.bannerMedia}
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
          <div className={styles.bannerOverlay} aria-hidden="true" />

          <div className={styles.bannerContent}>
            <div className={styles.bannerLabel}>
              <Code2 size={14} aria-hidden="true" /> Engineering Track
            </div>

            <h1 className={styles.bannerTitle}>
              Code Your Future.
            </h1>

            <p className={styles.bannerSubtitle}>
              Master programming languages and core CS subjects with structured day-wise plans.
              From beginner to interview-ready in 30–60 days per language.
            </p>

            {/* Quick stat chips in the hero */}
            <div className={styles.bannerStats}>
              <span className={styles.bannerStatChip}>12+ Languages</span>
              <span className={styles.bannerStatChip}>9 CS Subjects</span>
              <span className={styles.bannerStatChip}>FAANG-Focused DSA</span>
              <span className={styles.bannerStatChip}>1000+ Questions</span>
            </div>
          </div>
        </div>

        {/* ==================== PROGRAMMING LANGUAGES ==================== */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Programming Languages</h2>
          <p className={styles.sectionSubtitle}>
            Each language has a structured N-day plan from first principles to project-level confidence.
          </p>
        </div>

        <div className={styles.langGrid}>
          {ENGINEERING_LANGUAGES.map((lang) => {
            /*
             * Determine difficulty label class for the colored badge.
             */
            const diffClass =
              lang.difficulty === "Beginner"     ? styles.diffBeginner     :
              lang.difficulty === "Intermediate"  ? styles.diffIntermediate  :
              styles.diffAdvanced;

            return (
              <Link
                key={lang.id}
                href={`/engineering/${lang.id}`}
                className={styles.langCard}
                style={{ "--lang-accent": lang.color } as React.CSSProperties}
              >
                {/* Language badge — uses a stable Lucide icon plus the route accent. */}
                <div className={styles.langBadge} aria-hidden="true">
                  {(() => {
                    const LanguageIcon = LANGUAGE_BADGES[lang.id] ?? Code2;
                    return <LanguageIcon size={24} aria-hidden="true" />;
                  })()}
                </div>

                {/* Language name */}
                <h3 className={styles.langName}>{lang.name}</h3>

                {/* Duration and difficulty row */}
                <div className={styles.langMeta}>
                  <span className={styles.langDays}>
                    <Clock size={12} aria-hidden="true" /> {lang.days}-Day Plan
                  </span>
                  <span className={`${styles.langDifficulty} ${diffClass}`}>
                    {lang.difficulty}
                  </span>
                </div>

                <div className={styles.langArrow}>
                  Start <ArrowRight size={12} aria-hidden="true" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* ==================== CORE CS SKILLS / TECHNICAL SUBJECTS ==================== */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Core CS Subjects</h2>
          <p className={styles.sectionSubtitle}>
            The technical fundamentals that every SDE interview tests. Structured, thorough, and practical.
          </p>
        </div>

        <div className={styles.skillGrid}>
          {ENGINEERING_SKILLS.map((skill) => {
            /*
             * Resolve the Lucide icon for this skill, fallback to Code2.
             */
            const SkillIcon = SKILL_ICONS[skill.id] ?? Code2;
            const accentClass = SKILL_ACCENTS[skill.id] ?? "skillAccentBlue";

            return (
              <Link
                key={skill.id}
                href={`/engineering/${skill.id}`}
                className={styles.skillCard}
              >
                <div className={`${styles.skillIconBox} ${styles[accentClass]}`}>
                  <SkillIcon size={22} aria-hidden="true" />
                </div>

                <div className={styles.skillInfo}>
                  <h4 className={styles.skillName}>{skill.name}</h4>
                  <span className={styles.skillDays}>{skill.days} days</span>
                </div>

                <ChevronRight
                  size={16}
                  className={styles.skillArrow}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </div>

        {/* ==================== WHY ENGINEERING STRIP ==================== */}
        <div className={styles.whyStrip}>
          {WHY_ENG.map((item, idx) => {
            const WhyIcon = item.icon;
            return (
              <div key={idx} className={styles.whyItem}>
                <div className={styles.whyItemIcon}>
                  <WhyIcon size={20} aria-hidden="true" />
                </div>
                <div className={styles.whyItemText}>
                  <span className={styles.whyItemTitle}>{item.title}</span>
                  <span className={styles.whyItemDesc}>{item.desc}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ==================== CTA ==================== */}
        <div className={styles.ctaBanner}>
          <div className={styles.ctaLeft}>
            <h3 className={styles.ctaTitle}>Ready to become interview-ready?</h3>
            <p className={styles.ctaSubtext}>
              Start with any language above and follow the day-wise plan.
            </p>
          </div>
          <Link href="/sign-up" className={styles.ctaButton}>
            Start Learning Free <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

      </div>
    </div>
  );
}
