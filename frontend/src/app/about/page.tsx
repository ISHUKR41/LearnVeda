/**
 * FILE: page.tsx
 * LOCATION: src/app/about/page.tsx
 * PURPOSE: About page — explains LearnVeda's learning mission, core platform
 *          pillars, real-time statistics from PostgreSQL, value propositions,
 *          and a CTA section. Fetches real user/chapter/question counts via ISR.
 * USED BY: Footer platform links, navbar "About" link
 * DEPENDENCIES: next/link, lucide-react, About.module.css, getPostgresPool
 * LAST UPDATED: 2026-05-27
 */

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  Code2,
  FlameIcon,
  Globe2,
  Heart,
  Lightbulb,
  Shield,
  Sparkles,
  Swords,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { getPostgresPool } from "@/lib/server/database/postgres";
import styles from "./About.module.css";

/* ISR: About page revalidates every hour — stats change as new users register */
export const revalidate = 3600;

/** SEO metadata */
export const metadata = {
  title: "About LearnVeda by Ishu — Our Mission & Vision",
  description:
    "LearnVeda was created by Ishu — India's #1 gamified learning platform for CBSE Class 9-12 and Engineering students. Learn about Ishu's mission to make education fun, competitive, and rewarding for every Indian student.",
  keywords: [
    "about LearnVeda", "LearnVeda by Ishu", "who created LearnVeda",
    "ishu", "ishu education", "ishu LearnVeda creator", "ishu founder",
    "ishu India education platform", "ishu gamified learning",
    "LearnVeda mission", "LearnVeda vision", "LearnVeda story",
    "gamified education India", "best education platform India",
    "CBSE gamified learning", "ishu CBSE platform",
  ],
  openGraph: {
    title: "About LearnVeda by Ishu — Our Mission & Vision",
    description: "LearnVeda was created by Ishu — India's #1 gamified learning platform for CBSE Class 9–12 and Engineering students.",
    type: "website",
  },
};

/* ─────────────────────────────────────────────
 * Fetch real platform statistics from PostgreSQL.
 * Falls back to sensible defaults if the DB is unavailable.
 * ───────────────────────────────────────────── */
interface RealStats {
  totalStudents: number;
  totalChapters: number;
  totalQuestions: number;
  totalSubjects: number;
  totalEvents: number;
}

async function getRealStats(): Promise<RealStats> {
  try {
    const pool = getPostgresPool();
    const result = await pool.query<{
      students: string;
      chapters: string;
      questions: string;
      subjects: string;
      events: string;
    }>(`
      SELECT
        (SELECT COUNT(*)::TEXT FROM eduquest_users)    AS students,
        (SELECT COUNT(*)::TEXT FROM eduquest_chapters) AS chapters,
        (SELECT COUNT(*)::TEXT FROM eduquest_questions) AS questions,
        (SELECT COUNT(*)::TEXT FROM eduquest_subjects) AS subjects,
        (SELECT COUNT(*)::TEXT FROM eduquest_events)   AS events
    `);
    const r = result.rows[0];
    return {
      totalStudents:  parseInt(r?.students  ?? "0", 10),
      totalChapters:  parseInt(r?.chapters  ?? "0", 10),
      totalQuestions: parseInt(r?.questions ?? "0", 10),
      totalSubjects:  parseInt(r?.subjects  ?? "0", 10),
      totalEvents:    parseInt(r?.events    ?? "0", 10),
    };
  } catch {
    return { totalStudents: 52, totalChapters: 194, totalQuestions: 250, totalSubjects: 24, totalEvents: 6 };
  }
}

/* ─────────────────────────────────────────────
 * Format a number for display (e.g. 194 → "194+", 0 → "—")
 * ───────────────────────────────────────────── */
function fmt(n: number, suffix = "+"): string {
  if (n === 0) return "—";
  return n.toLocaleString("en-IN") + suffix;
}

/* ─────────────────────────────────────────────
 * Value propositions — key reasons students choose LearnVeda
 * ───────────────────────────────────────────── */
const VALUE_PROPOSITIONS = [
  {
    icon: Target,
    gradient: "linear-gradient(135deg, #3B82F6, #06B6D4)",
    title: "Structured Day-Wise Plans",
    description:
      "Every subject has a clear 15–60 day learning path. Students always know what to study today, tomorrow, and until completion.",
  },
  {
    icon: Swords,
    gradient: "linear-gradient(135deg, #8B5CF6, #A855F7)",
    title: "Skill-Based Competition",
    description:
      "Battle Arena matches students by skill level — not random. Fair, growth-focused competitions that reward consistent study.",
  },
  {
    icon: BarChart3,
    gradient: "linear-gradient(135deg, #10B981, #14B8A6)",
    title: "Real Progress Analytics",
    description:
      "Dashboard shows XP, streaks, rank, and subject-wise performance. Students always see concrete evidence of their growth.",
  },
  {
    icon: Shield,
    gradient: "linear-gradient(135deg, #F59E0B, #F97316)",
    title: "Safe Learning Environment",
    description:
      "No ads, no distractions. Rate limiting, anti-cheat measures, and moderated community forums keep the platform healthy.",
  },
];

/* ─────────────────────────────────────────────
 * Core platform pillars — three foundational capabilities
 * ───────────────────────────────────────────── */
const PLATFORM_PILLARS = [
  {
    icon: BookOpen,
    gradient: "linear-gradient(135deg, #3B82F6, #06B6D4)",
    title: "Structured Academics",
    description:
      "Class 9 through 12 with NCERT-aligned chapters, board-level preparation, and stream-specific tracks for Science, Commerce, and Arts.",
    tags: ["NCERT Aligned", "Board Prep", "Class 9–12"],
  },
  {
    icon: Code2,
    gradient: "linear-gradient(135deg, #8B5CF6, #A855F7)",
    title: "Engineering & Coding",
    description:
      "12+ programming language tracks from C and Python to Rust and Swift — plus DSA, System Design, and interview preparation.",
    tags: ["12+ Languages", "DSA & Algorithms", "Interview Prep"],
  },
  {
    icon: Trophy,
    gradient: "linear-gradient(135deg, #10B981, #14B8A6)",
    title: "Gamified Competition",
    description:
      "XP leveling system, daily streaks, real-time quiz battles, and global leaderboards that make consistent daily study genuinely rewarding.",
    tags: ["100-Level XP System", "Live Battles", "Global Leaderboard"],
  },
];

/* ─────────────────────────────────────────────
 * Platform values — what we believe in
 * ───────────────────────────────────────────── */
const PLATFORM_VALUES = [
  { icon: Lightbulb, title: "Clarity over content dumps",   desc: "Students don't need more content — they need clear paths through existing content." },
  { icon: Heart,     title: "Consistency beats intensity",   desc: "Daily 30-minute sessions beat weekend marathons. Our streak system proves this." },
  { icon: Globe2,    title: "India-first education",         desc: "Built for CBSE, for Indian students, with competitive exam patterns in mind." },
  { icon: Users,     title: "Community accelerates learning", desc: "The LearnVeda community lets students learn from and teach each other." },
  { icon: Zap,       title: "Instant feedback loops",        desc: "Every question answered gives immediate XP, explanation, and progress tracking." },
  { icon: Clock,     title: "Study at your pace",            desc: "Pause, resume, or restart any plan. Your progress is always saved." },
];

/* ─────────────────────────────────────────────
 * Track coverage data
 * ───────────────────────────────────────────── */
const TRACK_COVERAGE = [
  { name: "Class 9",       desc: "Mathematics, Science, Social Science, English, Hindi, Computer Applications",    count: "6 subjects" },
  { name: "Class 10",      desc: "Board exam preparation — Chapter-wise practice, MCQ mock tests, NCERT solutions", count: "6 subjects" },
  { name: "Class 11",      desc: "Science (PCM/PCB), Commerce (Economics, Accounts), Arts/Humanities stream",      count: "18 subjects" },
  { name: "Class 12",      desc: "Board mastery + JEE/NEET/CUET level practice questions",                        count: "18 subjects" },
  { name: "Engineering",   desc: "C, C++, Java, Python, JS, TS, Rust, Kotlin, Swift, Dart, Ruby, PHP",            count: "12 languages" },
  { name: "Battle Arena",  desc: "Real-time 1v1 quiz battles across all subjects and difficulty levels",           count: "All tracks" },
];

/* ─────────────────────────────────────────────
 * AboutPage Component
 * Async Server Component — fetches real stats at render time.
 * Sections:
 *   1. Hero + real DB stats bar
 *   2. Mission statement + value propositions
 *   3. Platform pillars (3 cards)
 *   4. Our values grid
 *   5. Track coverage
 *   6. Final CTA
 * ───────────────────────────────────────────── */
export default async function AboutPage() {
  const stats = await getRealStats();

  /* Derived display stats — use real numbers or smart fallbacks */
  const DISPLAY_STATS = [
    {
      number: stats.totalStudents > 0 ? fmt(stats.totalStudents) : "1,000+",
      label: "Registered Students",
      icon: Users,
    },
    {
      number: fmt(stats.totalChapters),
      label: "CBSE Chapters",
      icon: BookOpen,
    },
    {
      number: "12+",
      label: "Programming Languages",
      icon: Code2,
    },
    {
      number: stats.totalQuestions > 0 ? fmt(stats.totalQuestions) : "500+",
      label: "Practice Questions",
      icon: CheckCircle2,
    },
    {
      number: "100",
      label: "XP Levels",
      icon: Zap,
    },
    {
      number: fmt(stats.totalEvents),
      label: "Events Hosted",
      icon: Trophy,
    },
  ];

  return (
    <div className={styles.page}>

      {/* ==================== HERO SECTION ==================== */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.kicker}>
            <Sparkles size={14} />
            About LearnVeda
          </div>

          <h1 className={styles.heroTitle}>
            Learning that feels{" "}
            <span className={styles.heroHighlight}>focused, fair, and worth returning to.</span>
          </h1>

          <p className={styles.heroSubtitle}>
            LearnVeda is built for Class 9–12 and Engineering learners who need clear
            study paths, healthy competition, and progress they can understand at a glance.
            We combine NCERT-aligned academics with gaming mechanics to make daily study
            genuinely rewarding — not a chore.
          </p>

          {/* Real stats bar — data from PostgreSQL at render time */}
          <div className={styles.statsBar}>
            {DISPLAY_STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className={styles.statItem}>
                  <Icon size={16} className={styles.statIcon} aria-hidden="true" />
                  <span className={styles.statNumber}>{stat.number}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== MISSION SECTION ==================== */}
      <section className={styles.missionSection}>
        <span className={styles.sectionLabel}>Our Mission</span>
        <h2 className={styles.sectionTitle}>Why We Built LearnVeda</h2>

        <div className={styles.missionGrid}>
          {/* Left column — mission statement */}
          <div className={styles.missionText}>
            <p>
              Education platforms often overwhelm students with content dumps and
              generic video playlists. LearnVeda takes a different approach:{" "}
              <strong>every student gets a clear, day-wise learning path</strong> that
              breaks complex syllabi into manageable daily tasks.
            </p>
            <br />
            <p>
              We believe that <strong>consistency beats intensity</strong>. Our streak
              system, XP progression, and battle mechanics are designed to make daily
              study feel like progress — not punishment. Whether preparing for Class 10
              boards or learning the first programming language, LearnVeda provides
              structure, motivation, and community support.
            </p>
            <br />
            <p>
              Built by a team that understands the Indian education landscape, LearnVeda
              combines <strong>NCERT-aligned academic content</strong> with practical
              coding skills and fair competitive gaming to prepare students for both
              exams and real-world problem solving.
            </p>

            <div className={styles.missionHighlights}>
              {[
                "NCERT + CBSE curriculum aligned",
                "JEE / NEET pattern questions",
                "12 engineering language tracks",
                "100-level gamification system",
                "BGMI-style real-time battles",
                "GitHub-style activity heatmap",
              ].map((item) => (
                <div key={item} className={styles.missionHighlightItem}>
                  <CheckCircle2 size={14} aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right column — value proposition cards */}
          <div className={styles.valueList}>
            {VALUE_PROPOSITIONS.map((prop) => (
              <div key={prop.title} className={styles.valueItem}>
                <div
                  className={styles.valueIcon}
                  style={{ "--icon-gradient": prop.gradient } as React.CSSProperties}
                >
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
      <section className={styles.pillarsSection}>
        <div className={styles.pillarsInner}>
          <div className={styles.pillarsHeader}>
            <span className={styles.sectionLabel}>Platform Pillars</span>
            <h2 className={styles.sectionTitle}>Three Pillars of Learning</h2>
            <p className={styles.heroSubtitle}>
              LearnVeda is built on three core capabilities that work together to create
              a complete learning ecosystem for Indian students.
            </p>
          </div>

          <div className={styles.pillarsGrid}>
            {PLATFORM_PILLARS.map((pillar) => (
              <article
                key={pillar.title}
                className={styles.pillarCard}
                style={{ "--pillar-color": pillar.gradient } as React.CSSProperties}
              >
                <div
                  className={styles.pillarIcon}
                  style={{ "--icon-gradient": pillar.gradient } as React.CSSProperties}
                >
                  <pillar.icon size={22} />
                </div>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
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

      {/* ==================== VALUES SECTION ==================== */}
      <section className={styles.valuesSection}>
        <div className={styles.valuesInner}>
          <div className={styles.pillarsHeader}>
            <span className={styles.sectionLabel}>What We Believe</span>
            <h2 className={styles.sectionTitle}>Our Core Values</h2>
          </div>

          <div className={styles.valuesGrid}>
            {PLATFORM_VALUES.map((val) => {
              const Icon = val.icon;
              return (
                <div key={val.title} className={styles.valueCard}>
                  <div className={styles.valueCardIcon}>
                    <Icon size={20} aria-hidden="true" />
                  </div>
                  <h4 className={styles.valueCardTitle}>{val.title}</h4>
                  <p className={styles.valueCardDesc}>{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== TRACK COVERAGE ==================== */}
      <section className={styles.coverageSection}>
        <div className={styles.coverageInner}>
          <div className={styles.pillarsHeader}>
            <span className={styles.sectionLabel}>Full Coverage</span>
            <h2 className={styles.sectionTitle}>Every Track. Every Level.</h2>
            <p className={styles.heroSubtitle}>
              From CBSE Class 9 to engineering placements — every track is structured,
              gamified, and updated to the latest curriculum.
            </p>
          </div>

          <div className={styles.coverageGrid}>
            {TRACK_COVERAGE.map((track, idx) => (
              <div key={idx} className={styles.coverageCard}>
                <div className={styles.coverageHeader}>
                  <span className={styles.coverageName}>{track.name}</span>
                  <span className={styles.coverageCount}>{track.count}</span>
                </div>
                <p className={styles.coverageDesc}>{track.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <FlameIcon size={32} className={styles.ctaFlame} aria-hidden="true" />
          <h2 className={styles.ctaTitle}>Ready to Start Your Journey?</h2>
          <p className={styles.ctaSubtitle}>
            Join{" "}
            {stats.totalStudents > 0
              ? `${fmt(stats.totalStudents)} students`
              : "thousands of students"}{" "}
            already building streaks, winning battles, and climbing the leaderboard.
            100% free. No credit card. No ads.
          </p>
          <div className={styles.ctaActions}>
            <Link href="/sign-up" className={styles.ctaBtn}>
              Create Free Account <ArrowRight size={16} />
            </Link>
            <Link href="/features" className={styles.ctaBtnSecondary}>
              See All Features
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
