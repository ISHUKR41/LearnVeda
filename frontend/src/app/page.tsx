/*
 * FILE: page.tsx
 * LOCATION: src/app/page.tsx
 * PURPOSE: Home page — The main landing page of EduQuest.
 *          Structured into Hero, Trust Bar, How It Works, Class Tracks, Features, Platform Stats, and CTA.
 * USED BY: Next.js App Router — renders at root "/" route
 * DEPENDENCIES: next/link, lucide-react, HomePage.module.css, HomeAnimations (dynamic)
 * LAST UPDATED: 2026-05-17
 */

import Link from "next/link";
import Image from "next/image";
import {
  BookOpen, Code2, Swords, Flame, Trophy, Users, Award,
  CalendarDays, ChevronRight, Zap, Target, Rocket
} from "lucide-react";
import styles from "./HomePage.module.css";
import dynamic from "next/dynamic";

// Dynamic import for the client-side scroll animation watcher (no SSR needed)
const HomeAnimations = dynamic(() => import("./HomeAnimations"));

/** SEO metadata for search engines and social sharing */
export const metadata = {
  title: "EduQuest — Learn Smarter. Battle Harder. Level Up.",
  description: "India's #1 gamified learning platform for Class 9-12 and Engineering students. Study chapter-wise, battle peers in real-time, earn XP, and climb the leaderboard.",
};

/**
 * TRUST_PILLS Array
 * Simple pills shown directly under the hero section.
 */
const TRUST_PILLS = [
  { label: "Class 9", icon: BookOpen },
  { label: "Class 10", icon: BookOpen },
  { label: "Class 11", icon: BookOpen },
  { label: "Class 12", icon: BookOpen },
  { label: "Engineering", icon: Code2 },
  { label: "Live Battles", icon: Swords },
];

/**
 * HOW_IT_WORKS Array
 * Three simple steps to explain the platform.
 */
const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Target,
    title: "Choose Your Path",
    desc: "Pick any class, subject or programming language to begin your journey.",
  },
  {
    step: "02",
    icon: CalendarDays,
    title: "Study Day-by-Day",
    desc: "Follow structured plans with practice questions to master concepts.",
  },
  {
    step: "03",
    icon: Rocket,
    title: "Battle & Level Up",
    desc: "Challenge real opponents, earn XP, and climb the global ranks.",
  },
];

/**
 * CLASS_TRACKS Array
 * Six cards for the main sections.
 */
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
 * FEATURES Array
 * Core gamification and platform features.
 */
const FEATURES = [
  {
    icon: CalendarDays,
    title: "Day-wise Plans",
    desc: "Structured daily goals so you never feel lost. Know exactly what to study.",
  },
  {
    icon: Swords,
    title: "Live Battles",
    desc: "1v1 real-time quiz battles. Fastest correct answers win the round.",
  },
  {
    icon: Flame,
    title: "Streak Tracker",
    desc: "Build consistency. Don't break your streak — learn a little every day.",
  },
  {
    icon: Trophy,
    title: "Leaderboards",
    desc: "Compete globally or within your class. See where you stand among peers.",
  },
  {
    icon: Users,
    title: "Community",
    desc: "Ask doubts, share notes, and learn together with thousands of students.",
  },
  {
    icon: Award,
    title: "College Events",
    desc: "Participate in institutional competitions hosted safely on our platform.",
  },
];

/**
 * HomePage Component
 * 
 * The main landing page for EduQuest.
 */
export default function HomePage() {
  return (
    <div className={styles.pageWrapper}>
      <HomeAnimations />

      {/* ==================== SECTION 1: HERO ==================== */}
      <section className={styles.heroSection}>
        {/* Real product-style hero image keeps the first viewport professional and visual. */}
        <Image
          src="/images/eduquest-home-hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.heroBackgroundImage}
        />
        <div className={styles.heroImageOverlay} aria-hidden="true" />

        <div className={styles.heroInner}>
          <div className={`${styles.heroContent} animate-on-scroll`}>
            <span className={styles.heroBadge}>
              <Zap size={14} aria-hidden="true" /> India&apos;s #1 Gamified Learning Platform
            </span>
            <h1 className={styles.heroTitle}>
              Learn Smarter. Battle Harder. Level Up.
            </h1>
            <p className={styles.heroSubtitle}>
              India&apos;s most engaging CBSE + Engineering learning platform. Study chapter-wise, battle peers in real-time, earn XP, and climb the leaderboard.
            </p>

            <div className={styles.heroActions}>
              <Link href="/sign-up" className={styles.btnPrimary}>
                Start Learning Free <ChevronRight size={18} />
              </Link>
              <Link href="/class-9" className={styles.btnSecondary}>
                Browse Classes
              </Link>
            </div>

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

      {/* ==================== SECTION 2: TRUST BAR ==================== */}
      <section className={styles.trustSection}>
        <div className={styles.trustInner}>
          <div className={styles.trustPills}>
            {TRUST_PILLS.map((pill, idx) => (
              <div key={idx} className={styles.trustPill}>
                <pill.icon size={16} /> {pill.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SECTION 3: HOW IT WORKS ==================== */}
      <section className={styles.howSection}>
        <div className={styles.sectionInner}>
          <div className={`${styles.sectionHeader} animate-on-scroll`}>
            <h2 className={styles.sectionTitle}>Your Path to Mastery</h2>
            <p className={styles.sectionSubtitle}>Simple, structured, and rewarding. Here is how you learn on EduQuest.</p>
          </div>

          <div className={styles.howGrid}>
            {HOW_IT_WORKS.map((step, idx) => (
              <div key={idx} className={`${styles.howCard} animate-on-scroll delay-${idx + 1}`}>
                <div className={styles.howCardHeader}>
                  <div className={styles.howIconBox}>
                    <step.icon size={24} />
                  </div>
                  <span className={styles.howStepNumber}>{step.step}</span>
                </div>
                <h3 className={styles.howCardTitle}>{step.title}</h3>
                <p className={styles.howCardDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SECTION 4: CLASS TRACKS ==================== */}
      <section className={styles.tracksSection}>
        <div className={styles.sectionInner}>
          <div className={`${styles.sectionHeader} animate-on-scroll`}>
            <h2 className={styles.sectionTitle}>Explore Learning Tracks</h2>
            <p className={styles.sectionSubtitle}>From school foundations to advanced engineering. Find your perfect plan.</p>
          </div>

          <div className={styles.tracksGrid}>
            {CLASS_TRACKS.map((track, idx) => (
              <Link href={track.href} key={track.id} className={`${styles.trackCard} ${track.colorClass} animate-on-scroll delay-${idx % 3}`}>
                <div className={styles.trackCardContent}>
                  <h3 className={styles.trackName}>{track.name}</h3>
                  <p className={styles.trackDesc}>{track.description}</p>

                  <div className={styles.trackStats}>
                    <span className={styles.trackStatBadge}>{track.subjects} Subjects</span>
                    <span className={styles.trackStatBadge}>{track.chapters} Chapters</span>
                  </div>
                </div>

                <div className={styles.trackFooter}>
                  <span className={styles.trackLinkText}>Explore</span>
                  <ChevronRight size={16} className={styles.trackLinkIcon} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SECTION 5: FEATURES ==================== */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionInner}>
          <div className={`${styles.sectionHeader} animate-on-scroll`}>
            <h2 className={styles.sectionTitle}>Not Just Another Tutorial Site</h2>
            <p className={styles.sectionSubtitle}>We built gamification into the core of learning. Keep your streaks, win battles, and level up.</p>
          </div>

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

      {/* ==================== SECTION 6: PLATFORM STATS ==================== */}
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

      {/* ==================== SECTION 7: CTA ==================== */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <div className={`${styles.ctaContent} animate-on-scroll`}>
            <h2 className={styles.ctaTitle}>Ready to Start Your Journey?</h2>
            <p className={styles.ctaSubtitle}>Join thousands of students leveling up their skills today. 100% free to get started.</p>
            <Link href="/sign-up" className={styles.ctaButton}>
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
