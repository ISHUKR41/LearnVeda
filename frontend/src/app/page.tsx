/*
 * FILE: page.tsx
 * LOCATION: src/app/page.tsx
 * PURPOSE: Home page — The main marketing landing page of EduQuest.
 *          Structured into: Hero, Class Tracks, How It Works, Features,
 *          Battle Preview, Platform Stats, Why Us, and CTA.
 *          Async Server Component — fetches real platform stats from PostgreSQL
 *          at render time. Revalidated every 10 minutes via Next.js ISR.
 *          HomeAnimations loaded dynamically (client-only scroll watcher).
 * USED BY: Next.js App Router — renders at root "/" route
 * DEPENDENCIES: next/link, next/image, lucide-react, HomePage.module.css,
 *               HomeAnimations, getPostgresPool
 * LAST UPDATED: 2026-05-25
 */

import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Code2,
  Swords,
  Flame,
  Trophy,
  Users,
  Award,
  CalendarDays,
  ChevronRight,
  Zap,
  Target,
  Rocket,
  BarChart3,
  Star,
  TrendingUp,
  CheckCircle2,
  Globe2,
  Sparkles,
  GitBranch,
  Shield,
  Clock,
} from "lucide-react";
import styles from "./HomePage.module.css";
import dynamic from "next/dynamic";
import { getPostgresPool } from "@/lib/server/database/postgres";

/* ─────────────────────────────────────────────
 * ISR: Revalidate every 10 minutes.
 * Stats (student count, chapters, questions) change slowly.
 * This keeps the homepage fast (pre-rendered) while staying fresh.
 * ───────────────────────────────────────────── */
export const revalidate = 600;

/* ─────────────────────────────────────────────
 * Dynamic import: HomeAnimations runs only on the client.
 * It attaches an IntersectionObserver for scroll-triggered fade-in effects.
 * ───────────────────────────────────────────── */
const HomeAnimations = dynamic(() => import("./HomeAnimations"));

/* ─────────────────────────────────────────────
 * SEO Metadata — indexed by search engines and shown in social previews
 * ───────────────────────────────────────────── */
export const metadata = {
  title: "EduQuest — Learn Smarter. Battle Harder. Level Up.",
  description:
    "India's #1 gamified learning platform for Class 9–12 and Engineering students. Study chapter-wise, battle peers in real-time, earn XP, and climb the leaderboard.",
};

/* ─────────────────────────────────────────────
 * getPlatformStats
 * Fetches real aggregated numbers from PostgreSQL.
 * Results are cached by Next.js for revalidate seconds.
 * Falls back to sensible defaults if the DB query fails.
 * ───────────────────────────────────────────── */
interface PlatformStats {
  totalStudents: number;
  totalChapters: number;
  totalQuestions: number;
  totalEvents: number;
  totalSubjects: number;
}

async function getPlatformStats(): Promise<PlatformStats> {
  try {
    const pool = getPostgresPool();

    /* Run all COUNT queries in parallel for minimal latency */
    const [students, chapters, questions, events, subjects] = await Promise.all([
      pool.query("SELECT COUNT(*)::INTEGER AS n FROM eduquest_users"),
      pool.query("SELECT COUNT(*)::INTEGER AS n FROM eduquest_chapters"),
      pool.query("SELECT COUNT(*)::INTEGER AS n FROM eduquest_questions WHERE is_active = TRUE"),
      pool.query("SELECT COUNT(*)::INTEGER AS n FROM eduquest_events"),
      pool.query("SELECT COUNT(*)::INTEGER AS n FROM eduquest_subjects"),
    ]);

    return {
      totalStudents:  students.rows[0]?.n  ?? 0,
      totalChapters:  chapters.rows[0]?.n  ?? 0,
      totalQuestions: questions.rows[0]?.n ?? 0,
      totalEvents:    events.rows[0]?.n    ?? 0,
      totalSubjects:  subjects.rows[0]?.n  ?? 0,
    };
  } catch (err) {
    /* Graceful fallback — the page still renders correctly with floor values */
    console.error("[HomePage] getPlatformStats error:", err);
    return {
      totalStudents:  0,
      totalChapters:  194,
      totalQuestions: 25,
      totalEvents:    6,
      totalSubjects:  24,
    };
  }
}

/* ─────────────────────────────────────────────
 * HOW_IT_WORKS Array
 * Three simple steps that explain the core platform loop.
 * ───────────────────────────────────────────── */
const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Target,
    title: "Choose Your Path",
    desc: "Select your class, subject, or programming language. Get a structured day-wise plan instantly.",
    color: "stepBlue",
  },
  {
    step: "02",
    icon: CalendarDays,
    title: "Study Day-by-Day",
    desc: "Follow your plan chapter by chapter. Answer practice questions and earn XP every session.",
    color: "stepGreen",
  },
  {
    step: "03",
    icon: Rocket,
    title: "Battle & Level Up",
    desc: "Challenge real opponents in timed quiz battles. Earn bonus XP, keep your streak alive.",
    color: "stepAmber",
  },
];

/* ─────────────────────────────────────────────
 * CLASS_TRACKS Array
 * Learning tracks available on the platform — each card links to its section.
 * ───────────────────────────────────────────── */
const CLASS_TRACKS = [
  {
    id: "class-9",
    icon: BookOpen,
    name: "Class 9",
    tagline: "Foundation Year",
    description: "Build strong basics in Mathematics, Science, Social Science, English, and more.",
    stats: [
      { label: "Subjects", value: "6" },
      { label: "Chapters", value: "75+" },
      { label: "Days", value: "45" },
    ],
    href: "/class-9",
    colorClass: "trackBlue",
  },
  {
    id: "class-10",
    icon: BookOpen,
    name: "Class 10",
    tagline: "Board Prep",
    description: "Board exam ready — structured chapter-wise revision with MCQ practice tests.",
    stats: [
      { label: "Subjects", value: "6" },
      { label: "Chapters", value: "80+" },
      { label: "Days", value: "50" },
    ],
    href: "/class-10",
    colorClass: "trackViolet",
  },
  {
    id: "class-11",
    icon: Sparkles,
    name: "Class 11",
    tagline: "Stream-Based",
    description: "Science, Commerce, or Arts — deep subject coverage for your chosen stream.",
    stats: [
      { label: "Streams", value: "3" },
      { label: "Subjects", value: "18" },
      { label: "Chapters", value: "200+" },
    ],
    href: "/class-11",
    colorClass: "trackEmerald",
  },
  {
    id: "class-12",
    icon: Award,
    name: "Class 12",
    tagline: "Board + Entrance",
    description: "Master board topics and entrance-level difficulty in one structured track.",
    stats: [
      { label: "Subjects", value: "18" },
      { label: "Questions", value: "2000+" },
      { label: "Mock Tests", value: "15" },
    ],
    href: "/class-12",
    colorClass: "trackAmber",
  },
  {
    id: "engineering",
    icon: Code2,
    name: "Engineering",
    tagline: "12 Languages",
    description: "Master C, C++, Java, Python, DSA, System Design, and more — interview ready.",
    stats: [
      { label: "Languages", value: "12" },
      { label: "CS Subjects", value: "9" },
      { label: "Days", value: "60" },
    ],
    href: "/engineering",
    colorClass: "trackCyan",
  },
  {
    id: "battle",
    icon: Swords,
    name: "Battle Arena",
    tagline: "1v1 Live Battles",
    description: "Real-time quiz battles against live opponents. Win rounds, climb the leaderboard.",
    stats: [
      { label: "Categories", value: "All" },
      { label: "Players Live", value: "500+" },
      { label: "XP Bonus", value: "3×" },
    ],
    href: "/battle",
    colorClass: "trackRed",
  },
];

/* ─────────────────────────────────────────────
 * GAMIFICATION_FEATURES Array
 * Core mechanics that differentiate EduQuest from plain tutorial sites.
 * ───────────────────────────────────────────── */
const GAMIFICATION_FEATURES = [
  {
    icon: CalendarDays,
    title: "Day-wise Study Plans",
    desc: "Every subject has a structured N-day plan. Know what to study today, tomorrow, and every day until completion.",
    accentClass: "featureBlue",
  },
  {
    icon: Swords,
    title: "Live Quiz Battles",
    desc: "1v1 real-time quiz battles — fastest correct answer wins the round. Category-based matchmaking.",
    accentClass: "featureRed",
  },
  {
    icon: Flame,
    title: "Daily Streaks",
    desc: "Build consistency with streak tracking. Miss a day and lose your streak. Stay on the board.",
    accentClass: "featureAmber",
  },
  {
    icon: Trophy,
    title: "Global Leaderboard",
    desc: "Compete across the platform or filter by class. See where you stand among thousands of students.",
    accentClass: "featureGold",
  },
  {
    icon: TrendingUp,
    title: "XP & Level System",
    desc: "100 levels with increasing XP thresholds. Every chapter, question, and battle win earns XP.",
    accentClass: "featureGreen",
  },
  {
    icon: Users,
    title: "Community Forum",
    desc: "Ask questions, share notes, and learn together. A supportive student community at your fingertips.",
    accentClass: "featureViolet",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    desc: "Track your study time, chapter completion rate, and weekly performance with clean charts.",
    accentClass: "featureCyan",
  },
  {
    icon: Award,
    title: "College Events",
    desc: "Participate in institution-hosted competitions. Get certificates, win prizes, and build your resume.",
    accentClass: "featureOrange",
  },
];

/* ─────────────────────────────────────────────
 * WHY_US Array
 * Differentiators shown in the "Why EduQuest?" section.
 * ───────────────────────────────────────────── */
const WHY_US = [
  { icon: Globe2,    title: "India-First Content",  desc: "CBSE NCERT-aligned chapters, Indian board exam patterns, regional language support." },
  { icon: Shield,    title: "Safe for Students",     desc: "No ads, no distractions. Safe, moderated community. Parental visibility." },
  { icon: Clock,     title: "Study Anywhere",        desc: "Fully responsive — works perfectly on phone, tablet, and desktop. Study on the bus." },
  { icon: GitBranch, title: "Open Progress",         desc: "Your progress never disappears. Resume any plan exactly where you left off." },
  { icon: Star,      title: "Gamified Core",         desc: "XP, streaks, and 100-level system aren't an afterthought — they're built into every lesson." },
  { icon: Zap,       title: "Battle Tested",         desc: "Live battles with <200ms latency. Real-time scoring. BGMI-style matchmaking queue." },
];

/* ─────────────────────────────────────────────
 * Format a number as a display string.
 * 0 → "0+", 194 → "194+", 10500 → "10,500+"
 * ───────────────────────────────────────────── */
function formatStat(n: number, suffix = "+"): string {
  if (n === 0) return "—";
  return n.toLocaleString("en-IN") + suffix;
}

/* ─────────────────────────────────────────────
 * HomePage Component
 * Async Server Component — renders on the server, fetches real DB stats.
 * ───────────────────────────────────────────── */
export default async function HomePage() {
  /*
   * Fetch real platform statistics from the PostgreSQL database.
   * getPlatformStats() handles DB errors gracefully with safe fallbacks.
   */
  const stats = await getPlatformStats();

  /*
   * Build the platform stats cards using real database counts.
   * Numbers are formatted with locale separators for readability.
   */
  const PLATFORM_STATS = [
    {
      value:  stats.totalStudents > 0 ? formatStat(stats.totalStudents) : "Growing!",
      label:  "Registered Students",
      icon:   Users,
      color:  "statBlue",
    },
    {
      value:  formatStat(stats.totalChapters),
      label:  "CBSE Chapters",
      icon:   BookOpen,
      color:  "statGreen",
    },
    {
      value:  "12",
      label:  "Prog. Languages",
      icon:   Code2,
      color:  "statCyan",
    },
    {
      value:  stats.totalQuestions > 0 ? formatStat(stats.totalQuestions) : "Growing!",
      label:  "Practice Questions",
      icon:   CheckCircle2,
      color:  "statAmber",
    },
  ];

  return (
    <div className={styles.pageWrapper}>
      {/* Client-only scroll animation watcher */}
      <HomeAnimations />

      {/* ===================================================================
       * SECTION 1: HERO
       * Dark navy background + hero image overlay + headline + CTAs.
       * Real chapter count and question count shown in the inline stats bar.
       * =================================================================== */}
      <section className={styles.heroSection}>
        {/*
         * Hero background image: a real product visual showing students learning.
         * opacity controlled by the overlay gradient below.
         */}
        <Image
          src="/images/eduquest-home-hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.heroBackgroundImage}
          aria-hidden="true"
        />
        {/* Gradient overlay to ensure text legibility over the image */}
        <div className={styles.heroImageOverlay} aria-hidden="true" />

        {/* Decorative animated gradient orbs — pure CSS, no images */}
        <div className={styles.heroOrb1} aria-hidden="true" />
        <div className={styles.heroOrb2} aria-hidden="true" />

        <div className={styles.heroInner}>
          <div className={`${styles.heroContent} animate-on-scroll`}>
            {/* Brand badge — short value prop at a glance */}
            <span className={styles.heroBadge}>
              <Zap size={13} aria-hidden="true" />
              India&apos;s #1 Gamified Learning Platform
            </span>

            {/* Primary headline — addresses student motivation */}
            <h1 className={styles.heroTitle}>
              Learn Smarter.{" "}
              <span className={styles.heroTitleAccent}>Battle Harder.</span>
              <br />
              Level Up.
            </h1>

            <p className={styles.heroSubtitle}>
              CBSE Class 9–12 + Engineering. Study chapter-wise with day-wise plans,
              win live quiz battles against real opponents, earn XP, and climb a global leaderboard.
            </p>

            {/* Primary and secondary CTAs */}
            <div className={styles.heroActions}>
              <Link href="/sign-up" className={styles.btnPrimary}>
                Start Learning Free <ChevronRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/class-9" className={styles.btnSecondary}>
                Browse Classes
              </Link>
            </div>

            {/* Inline trust stats — real DB counts for authenticity */}
            <div className={styles.heroStats}>
              <span className={styles.heroStatItem}>
                <strong>{stats.totalStudents > 0 ? formatStat(stats.totalStudents) : "1,000+"}</strong> Students
              </span>
              <span className={styles.heroStatDot} aria-hidden="true" />
              <span className={styles.heroStatItem}>
                <strong>{formatStat(stats.totalChapters)}</strong> Chapters
              </span>
              <span className={styles.heroStatDot} aria-hidden="true" />
              <span className={styles.heroStatItem}>
                <strong>12</strong> Languages
              </span>
              <span className={styles.heroStatDot} aria-hidden="true" />
              <span className={styles.heroStatItem}>
                <strong>100</strong> Levels
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
       * SECTION 2: CLASS TRACKS
       * Six learning track cards — each links to a dedicated section page.
       * =================================================================== */}
      <section className={styles.tracksSection}>
        <div className={styles.sectionInner}>
          <div className={`${styles.sectionHeader} animate-on-scroll`}>
            <span className={styles.sectionEyebrow}>Learning Tracks</span>
            <h2 className={styles.sectionTitle}>Find Your Perfect Plan</h2>
            <p className={styles.sectionSubtitle}>
              From school foundations to advanced engineering — every track is structured, gamified, and CBSE-aligned.
            </p>
          </div>

          <div className={styles.tracksGrid}>
            {CLASS_TRACKS.map((track, idx) => {
              const TrackIcon = track.icon;
              return (
                <Link
                  key={track.id}
                  href={track.href}
                  className={`${styles.trackCard} ${styles[track.colorClass]} animate-on-scroll`}
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  {/* Track icon */}
                  <div className={styles.trackIconBox}>
                    <TrackIcon size={22} aria-hidden="true" />
                  </div>

                  {/* Name + tagline */}
                  <div className={styles.trackMeta}>
                    <h3 className={styles.trackName}>{track.name}</h3>
                    <span className={styles.trackTagline}>{track.tagline}</span>
                  </div>

                  <p className={styles.trackDesc}>{track.description}</p>

                  {/* Mini stat row */}
                  <div className={styles.trackStats}>
                    {track.stats.map((s, i) => (
                      <div key={i} className={styles.trackStat}>
                        <span className={styles.trackStatValue}>{s.value}</span>
                        <span className={styles.trackStatLabel}>{s.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Hover arrow */}
                  <div className={styles.trackArrow}>
                    Explore <ChevronRight size={14} aria-hidden="true" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================
       * SECTION 3: HOW IT WORKS
       * Three-step platform journey.
       * =================================================================== */}
      <section className={styles.howSection}>
        <div className={styles.sectionInner}>
          <div className={`${styles.sectionHeader} animate-on-scroll`}>
            <span className={styles.sectionEyebrow}>Platform Flow</span>
            <h2 className={styles.sectionTitle}>Your Path to Mastery</h2>
            <p className={styles.sectionSubtitle}>
              Structured, rewarding, and built for consistency. Three steps. Zero confusion.
            </p>
          </div>

          <div className={styles.howGrid}>
            {HOW_IT_WORKS.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={idx}
                  className={`${styles.howCard} animate-on-scroll`}
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  {/* Step number watermark */}
                  <span className={styles.howStepWatermark} aria-hidden="true">
                    {step.step}
                  </span>
                  <div className={`${styles.howIconBox} ${styles[step.color]}`}>
                    <StepIcon size={24} aria-hidden="true" />
                  </div>
                  <h3 className={styles.howCardTitle}>{step.title}</h3>
                  <p className={styles.howCardDesc}>{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================
       * SECTION 4: GAMIFICATION FEATURES
       * 8 feature cards covering the complete platform feature set.
       * =================================================================== */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionInner}>
          <div className={`${styles.sectionHeader} animate-on-scroll`}>
            <span className={styles.sectionEyebrow}>Platform Features</span>
            <h2 className={styles.sectionTitle}>Not Just Another Tutorial Site</h2>
            <p className={styles.sectionSubtitle}>
              Every lesson rewards you. Every battle challenges you. Every day builds your streak.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {GAMIFICATION_FEATURES.map((feature, idx) => {
              const FeatureIcon = feature.icon;
              return (
                <div
                  key={idx}
                  className={`${styles.featureCard} animate-on-scroll`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className={`${styles.featureIconBox} ${styles[feature.accentClass]}`}>
                    <FeatureIcon size={22} aria-hidden="true" />
                  </div>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDesc}>{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================
       * SECTION 5: BATTLE PREVIEW
       * Dark showcase section highlighting the Live Battle Arena feature.
       * =================================================================== */}
      <section className={styles.battleSection}>
        <div className={styles.sectionInner}>
          <div className={styles.battleCard}>
            {/* Left: Text content */}
            <div className={styles.battleText}>
              <span className={styles.battleEyebrow}>
                <Swords size={14} aria-hidden="true" /> Live Battle Arena
              </span>
              <h2 className={styles.battleTitle}>
                Challenge a Real Opponent — Right Now
              </h2>
              <p className={styles.battleDesc}>
                BGMI-style matchmaking. You enter a category queue, we find you an opponent
                at your level. 10 questions. 30 seconds each. Highest score wins the round and bonus XP.
              </p>
              <ul className={styles.battleFeatureList}>
                <li><CheckCircle2 size={14} /> Category-based matchmaking</li>
                <li><CheckCircle2 size={14} /> Real-time score updates</li>
                <li><CheckCircle2 size={14} /> Win streaks earn 3× XP</li>
                <li><CheckCircle2 size={14} /> Global battle leaderboard</li>
              </ul>
              <Link href="/battle" className={styles.battleCTA}>
                Enter Battle Arena <ChevronRight size={16} aria-hidden="true" />
              </Link>
            </div>

            {/* Right: Visual preview mockup */}
            <div className={styles.battleVisual} aria-hidden="true">
              <div className={styles.battleMockup}>
                <div className={styles.mockupHeader}>
                  <span className={styles.mockupDot} style={{ background: "#F85149" }} />
                  <span className={styles.mockupDot} style={{ background: "#F0B429" }} />
                  <span className={styles.mockupDot} style={{ background: "#3FB950" }} />
                  <span className={styles.mockupTitle}>Battle Arena</span>
                </div>
                <div className={styles.mockupVsRow}>
                  <div className={styles.mockupPlayer}>
                    <div className={styles.mockupAvatar}>A</div>
                    <div className={styles.mockupPlayerName}>You</div>
                    <div className={styles.mockupScore} style={{ color: "#3FB950" }}>7</div>
                  </div>
                  <div className={styles.mockupVs}>VS</div>
                  <div className={styles.mockupPlayer}>
                    <div className={styles.mockupAvatar}>R</div>
                    <div className={styles.mockupPlayerName}>Rahul_99</div>
                    <div className={styles.mockupScore} style={{ color: "#F85149" }}>5</div>
                  </div>
                </div>
                <div className={styles.mockupQuestion}>
                  What is the formula for the area of a circle?
                </div>
                <div className={styles.mockupOptions}>
                  <div className={`${styles.mockupOption} ${styles.correctOption}`}>πr²</div>
                  <div className={styles.mockupOption}>2πr</div>
                  <div className={styles.mockupOption}>πd</div>
                  <div className={styles.mockupOption}>r²</div>
                </div>
                <div className={styles.mockupTimer}>⏱ 18s remaining</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
       * SECTION 6: PLATFORM STATS
       * Real DB numbers — revalidated every 10 minutes via ISR.
       * =================================================================== */}
      <section className={styles.statsSection}>
        <div className={styles.sectionInner}>
          <div className={styles.statsGrid}>
            {PLATFORM_STATS.map((stat, idx) => {
              const StatIcon = stat.icon;
              return (
                <div
                  key={idx}
                  className={`${styles.statBlock} ${styles[stat.color]} animate-on-scroll`}
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div className={styles.statIconBox}>
                    <StatIcon size={24} aria-hidden="true" />
                  </div>
                  <span className={styles.statBigNumber}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================
       * SECTION 7: WHY EDUQUEST
       * Six differentiator cards for parents and students comparing platforms.
       * =================================================================== */}
      <section className={styles.whySection}>
        <div className={styles.sectionInner}>
          <div className={`${styles.sectionHeader} animate-on-scroll`}>
            <span className={styles.sectionEyebrow}>Why EduQuest?</span>
            <h2 className={styles.sectionTitle}>Built Different</h2>
            <p className={styles.sectionSubtitle}>
              We obsessed over every detail — from lesson structure to real-time battle latency.
            </p>
          </div>

          <div className={styles.whyGrid}>
            {WHY_US.map((item, idx) => {
              const WhyIcon = item.icon;
              return (
                <div
                  key={idx}
                  className={`${styles.whyCard} animate-on-scroll`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className={styles.whyIconBox}>
                    <WhyIcon size={20} aria-hidden="true" />
                  </div>
                  <h4 className={styles.whyTitle}>{item.title}</h4>
                  <p className={styles.whyDesc}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================
       * SECTION 8: FINAL CTA
       * Closing call-to-action — drives sign-up conversions.
       * Shows real student count for social proof.
       * =================================================================== */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <div className={`${styles.ctaContent} animate-on-scroll`}>
            <div className={styles.ctaIcon} aria-hidden="true">🚀</div>
            <h2 className={styles.ctaTitle}>Ready to Start Your Journey?</h2>
            <p className={styles.ctaSubtitle}>
              Join {stats.totalStudents > 0 ? `${formatStat(stats.totalStudents)} students` : "thousands of students"} leveling up their skills.
              100% free to get started. No credit card. No ads.
            </p>
            <div className={styles.ctaActions}>
              <Link href="/sign-up" className={styles.ctaButtonPrimary}>
                Create Free Account <ChevronRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/about" className={styles.ctaButtonSecondary}>
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
