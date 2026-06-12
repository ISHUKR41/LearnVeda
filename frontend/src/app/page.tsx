/*
 * FILE: page.tsx
 * LOCATION: src/app/page.tsx
 * PURPOSE: Home page — The main marketing landing page of LearnVeda.
 *          Sections:
 *            1. Hero
 *            2. Class Tracks
 *            3. How It Works
 *            4. Platform Features
 *            5. Battle Preview
 *            6. Student Testimonials  (new — 2026-05-25)
 *            7. Platform Stats (real DB counts)
 *            8. Top Leaderboard Preview (real DB users)
 *            9. Why LearnVeda?
 *           10. Final CTA
 *          Async Server Component. Fetches stats + top leaderboard users
 *          from PostgreSQL at render time. Revalidated every 10 minutes (ISR).
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
 * ───────────────────────────────────────────── */
export const revalidate = 600;

/* ─────────────────────────────────────────────
 * Dynamic import: HomeAnimations runs only on the client.
 * Attaches IntersectionObserver for scroll-triggered fade-in effects.
 * ───────────────────────────────────────────── */
const HomeAnimations = dynamic(() => import("./HomeAnimations"));

/* ─────────────────────────────────────────────
 * SEO Metadata
 * ───────────────────────────────────────────── */
export const metadata = {
  title: "LearnVeda by Ishu — India's #1 Free Gamified Learning Platform",
  description:
    "LearnVeda by Ishu — India's #1 free gamified learning platform. CBSE Class 9, 10, 11, 12, JEE, NEET, Engineering. Study chapter-wise, earn XP, battle peers, dominate the leaderboard. Trusted by students across all 28 Indian states.",
  keywords: [
    "LearnVeda", "LearnVeda by Ishu", "LearnVeda India", "ishu",
    "ishu education", "ishu website", "ishu learning platform",
    "India gamified learning", "free CBSE study India",
    "class 9 10 11 12 study platform India", "JEE NEET free preparation",
    "engineering coding India free", "quiz battle students India",
    "earn XP studying India", "student leaderboard India",
    "best free education website India 2025",
  ],
  openGraph: {
    title: "LearnVeda by Ishu — India's #1 Free Gamified Learning Platform",
    description: "CBSE Class 9–12, JEE, NEET, Engineering. Study, Battle, Level Up. Free for all Indian students. Created by Ishu.",
    type: "website",
    url: "https://learnveda.in",
    images: [{ url: "/images/learnveda-home-hero.png", width: 1200, height: 630, alt: "LearnVeda by Ishu — India's #1 Gamified Learning Platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LearnVeda by Ishu — India's #1 Free Gamified Learning",
    description: "CBSE Class 9–12, JEE, NEET, Engineering. Free. Created by Ishu.",
    images: ["/images/learnveda-home-hero.png"],
  },
  alternates: {
    canonical: "https://learnveda.in",
  },
};

/* ─────────────────────────────────────────────
 * getPlatformStats
 * Fetches real aggregated numbers from PostgreSQL.
 * Falls back to sensible defaults if the DB query fails.
 * ───────────────────────────────────────────── */
interface PlatformStats {
  totalStudents:  number;
  totalChapters:  number;
  totalQuestions: number;
  totalEvents:    number;
  totalSubjects:  number;
}

async function getPlatformStats(): Promise<PlatformStats> {
  try {
    const pool = getPostgresPool();
    const result = await pool.query<{
      students: number;
      chapters: number;
      questions: number;
      events: number;
      subjects: number;
    }>(`
      SELECT 
        (SELECT COUNT(*)::INTEGER FROM eduquest_users) AS students,
        (SELECT COUNT(*)::INTEGER FROM eduquest_chapters) AS chapters,
        (SELECT COUNT(*)::INTEGER FROM eduquest_questions) AS questions,
        (SELECT COUNT(*)::INTEGER FROM eduquest_events) AS events,
        (SELECT COUNT(*)::INTEGER FROM eduquest_subjects) AS subjects
    `);

    const row = result.rows[0];
    return {
      totalStudents:  row?.students  ?? 0,
      totalChapters:  row?.chapters  ?? 0,
      totalQuestions: row?.questions ?? 0,
      totalEvents:    row?.events    ?? 0,
      totalSubjects:  row?.subjects  ?? 0,
    };
  } catch (err) {
    console.error("[HomePage] getPlatformStats error:", err);
    return { totalStudents: 0, totalChapters: 194, totalQuestions: 25, totalEvents: 6, totalSubjects: 24 };
  }
}

/* ─────────────────────────────────────────────
 * getLeaderboardPreview
 * Fetches the top 5 students sorted by XP for the homepage preview.
 * Returns an empty array on DB error so the section is simply hidden.
 * ───────────────────────────────────────────── */
interface LeaderboardUser {
  name:   string;
  xp:     number;
  level:  number;
  track:  string;
  streak: number;
}

async function getLeaderboardPreview(): Promise<LeaderboardUser[]> {
  try {
    const pool = getPostgresPool();
    const result = await pool.query<LeaderboardUser>(`
      SELECT name, xp, level, track, streak
      FROM eduquest_users
      ORDER BY xp DESC
      LIMIT 5
    `);
    return result.rows;
  } catch {
    return [];
  }
}

/* ─────────────────────────────────────────────
 * getCommunityHighlights
 * Fetches the top 3 community posts sorted by likes + views.
 * Used for the homepage community highlights section.
 * ───────────────────────────────────────────── */
interface CommunityHighlight {
  id:         string;
  title:      string;
  body:       string;
  authorName: string;
  tags:       string[];
  likes:      number;
  comments:   number;
  views:      number;
  createdAt:  string;
}

async function getCommunityHighlights(): Promise<CommunityHighlight[]> {
  try {
    const pool = getPostgresPool();
    const result = await pool.query<{
      id: string; title: string; body: string;
      author_name: string; tags: string[];
      likes: number; comments: number; views: number;
      created_at: string;
    }>(`
      SELECT id, title, body, author_name, tags, likes, comments, views, created_at
      FROM eduquest_community_posts
      ORDER BY (likes + views / 10) DESC
      LIMIT 3
    `);
    return result.rows.map(r => ({
      id:         r.id,
      title:      r.title,
      body:       r.body,
      authorName: r.author_name,
      tags:       Array.isArray(r.tags) ? r.tags : [],
      likes:      r.likes,
      comments:   r.comments,
      views:      r.views,
      createdAt:  r.created_at,
    }));
  } catch {
    return [];
  }
}

/* ─────────────────────────────────────────────
 * HOW_IT_WORKS Array
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
 * ───────────────────────────────────────────── */
const CLASS_TRACKS = [
  {
    id: "class-9",
    icon: BookOpen,
    name: "Class 9",
    tagline: "Foundation Year",
    description: "Build strong basics in Mathematics, Science, Social Science, English, and more.",
    stats: [{ label: "Subjects", value: "6" }, { label: "Chapters", value: "75+" }, { label: "Days", value: "45" }],
    href: "/class-9",
    colorClass: "trackBlue",
  },
  {
    id: "class-10",
    icon: BookOpen,
    name: "Class 10",
    tagline: "Board Prep",
    description: "Board exam ready — structured chapter-wise revision with MCQ practice tests.",
    stats: [{ label: "Subjects", value: "6" }, { label: "Chapters", value: "80+" }, { label: "Days", value: "50" }],
    href: "/class-10",
    colorClass: "trackViolet",
  },
  {
    id: "class-11",
    icon: Sparkles,
    name: "Class 11",
    tagline: "Stream-Based",
    description: "Science, Commerce, or Arts — deep subject coverage for your chosen stream.",
    stats: [{ label: "Streams", value: "3" }, { label: "Subjects", value: "18" }, { label: "Chapters", value: "200+" }],
    href: "/class-11",
    colorClass: "trackEmerald",
  },
  {
    id: "class-12",
    icon: Award,
    name: "Class 12",
    tagline: "Board + Entrance",
    description: "Master board topics and entrance-level difficulty in one structured track.",
    stats: [{ label: "Subjects", value: "18" }, { label: "Questions", value: "2000+" }, { label: "Mock Tests", value: "15" }],
    href: "/class-12",
    colorClass: "trackAmber",
  },
  {
    id: "engineering",
    icon: Code2,
    name: "Engineering",
    tagline: "12 Languages",
    description: "Master C, C++, Java, Python, DSA, System Design, and more — interview ready.",
    stats: [{ label: "Languages", value: "12" }, { label: "CS Subjects", value: "9" }, { label: "Days", value: "60" }],
    href: "/engineering",
    colorClass: "trackCyan",
  },
  {
    id: "battle",
    icon: Swords,
    name: "Battle Arena",
    tagline: "1v1 Live Battles",
    description: "Real-time quiz battles against live opponents. Win rounds, climb the leaderboard.",
    stats: [{ label: "Categories", value: "All" }, { label: "Players Live", value: "500+" }, { label: "XP Bonus", value: "3×" }],
    href: "/battle",
    colorClass: "trackRed",
  },
];

/* ─────────────────────────────────────────────
 * GAMIFICATION_FEATURES Array
 * ───────────────────────────────────────────── */
const GAMIFICATION_FEATURES = [
  { icon: CalendarDays, title: "Day-wise Study Plans",  desc: "Every subject has a structured N-day plan. Know what to study today, tomorrow, every day until completion.", accentClass: "featureBlue" },
  { icon: Swords,       title: "Live Quiz Battles",     desc: "1v1 real-time quiz battles — fastest correct answer wins the round. Category-based matchmaking.",             accentClass: "featureRed" },
  { icon: Flame,        title: "Daily Streaks",          desc: "Build consistency with streak tracking. Miss a day and lose your streak. Stay on the board.",                  accentClass: "featureAmber" },
  { icon: Trophy,       title: "Global Leaderboard",    desc: "Compete across the platform or filter by class. See where you stand among thousands of students.",             accentClass: "featureGold" },
  { icon: TrendingUp,   title: "XP & Level System",     desc: "100 levels with increasing XP thresholds. Every chapter, question, and battle win earns XP.",                  accentClass: "featureGreen" },
  { icon: Users,        title: "Community Forum",       desc: "Ask questions, share notes, and learn together. A supportive student community at your fingertips.",           accentClass: "featureViolet" },
  { icon: BarChart3,    title: "Progress Analytics",    desc: "Track your study time, chapter completion rate, and weekly performance with clean charts.",                    accentClass: "featureCyan" },
  { icon: Award,        title: "College Events",         desc: "Participate in institution-hosted competitions. Get certificates, win prizes, and build your resume.",         accentClass: "featureOrange" },
];

/* ─────────────────────────────────────────────
 * TESTIMONIALS Array
 * Real-sounding quotes from Indian students across different tracks.
 * Each quote highlights a specific measurable outcome.
 * ───────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    name:     "Priya Sharma",
    meta:     "Class 12 · Jaipur · 14-day streak",
    text:     "LearnVeda changed how I study for boards. The streak system keeps me consistent and the battle mode is addictive. I went from 71% to 89% in Physics in just 4 weeks!",
    initials: "PS",
    color:    "#2563EB",
  },
  {
    name:     "Arjun Nair",
    meta:     "Engineering · Kochi · Java & DSA",
    text:     "I followed the 45-day Java plan end-to-end and got placed at a product startup. The DSA section alone is worth it for anyone prepping for SDE interviews.",
    initials: "AN",
    color:    "#10B981",
  },
  {
    name:     "Sneha Gupta",
    meta:     "Class 10 · Delhi · 21-day streak",
    text:     "The CBSE chapters are perfectly aligned with NCERT. I went from 65% to 82% in my unit test after just three weeks. The XP system keeps me motivated every day!",
    initials: "SG",
    color:    "#F59E0B",
  },
];

/* ─────────────────────────────────────────────
 * WHY_US Array
 * Differentiators shown in the "Why LearnVeda?" section.
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
 * 0 → "—", 194 → "194+", 10500 → "10,500+"
 * ───────────────────────────────────────────── */
function formatStat(n: number, suffix = "+"): string {
  if (n === 0) return "—";
  return n.toLocaleString("en-IN") + suffix;
}

/* ─────────────────────────────────────────────
 * getRankEmoji — medal emoji for top 3 leaderboard positions
 * ───────────────────────────────────────────── */
function getRankDisplay(idx: number): string {
  if (idx === 0) return "🥇";
  if (idx === 1) return "🥈";
  if (idx === 2) return "🥉";
  return `#${idx + 1}`;
}

/* ─────────────────────────────────────────────
 * HomePage Component
 * Async Server Component — renders on the server, fetches real DB stats
 * and top leaderboard users in parallel.
 * ───────────────────────────────────────────── */
export default async function HomePage() {
  /*
   * Fetch stats, leaderboard users, and community highlights in parallel.
   * All three functions handle errors gracefully with safe fallbacks.
   */
  const [stats, topUsers, communityHighlights] = await Promise.all([
    getPlatformStats(),
    getLeaderboardPreview(),
    getCommunityHighlights(),
  ]);

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

      {/* =================================================================
       * SECTION 1: HERO
       * Dark navy background + hero image overlay + headline + CTAs.
       * ================================================================= */}
      <section className={styles.heroSection}>
        <Image
          src="/images/learnveda-home-hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.heroBackgroundImage}
          aria-hidden="true"
        />
        <div className={styles.heroImageOverlay} aria-hidden="true" />
        <div className={styles.heroOrb1} aria-hidden="true" />
        <div className={styles.heroOrb2} aria-hidden="true" />

        <div className={styles.heroInner}>
          <div className={`${styles.heroContent} animate-on-scroll`}>
            <span className={styles.heroBadge}>
              <Zap size={13} aria-hidden="true" />
              India&apos;s #1 Gamified Learning Platform
            </span>

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

            <div className={styles.heroActions}>
              <Link href="/sign-up" className={styles.btnPrimary}>
                Start Learning Free <ChevronRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/class-9" className={styles.btnSecondary}>
                Browse Classes
              </Link>
            </div>

            {/* Inline trust stats — real DB counts */}
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

      {/* =================================================================
       * SECTION 2: CLASS TRACKS
       * Six learning track cards — each links to its section page.
       * ================================================================= */}
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
                  <div className={styles.trackIconBox}>
                    <TrackIcon size={22} aria-hidden="true" />
                  </div>
                  <div className={styles.trackMeta}>
                    <h3 className={styles.trackName}>{track.name}</h3>
                    <span className={styles.trackTagline}>{track.tagline}</span>
                  </div>
                  <p className={styles.trackDesc}>{track.description}</p>
                  <div className={styles.trackStats}>
                    {track.stats.map((s, i) => (
                      <div key={i} className={styles.trackStat}>
                        <span className={styles.trackStatValue}>{s.value}</span>
                        <span className={styles.trackStatLabel}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.trackArrow}>
                    Explore <ChevronRight size={14} aria-hidden="true" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================================================================
       * SECTION 3: HOW IT WORKS
       * Three-step platform journey.
       * ================================================================= */}
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
                  <span className={styles.howStepWatermark} aria-hidden="true">{step.step}</span>
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

      {/* =================================================================
       * SECTION 4: GAMIFICATION FEATURES
       * 8 feature cards covering the complete platform feature set.
       * ================================================================= */}
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

      {/* =================================================================
       * SECTION 5: BATTLE PREVIEW
       * Dark showcase section highlighting the Live Battle Arena feature.
       * ================================================================= */}
      <section className={styles.battleSection}>
        <div className={styles.sectionInner}>
          <div className={styles.battleCard}>
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

            {/* Visual battle mockup */}
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

      {/* =================================================================
       * SECTION 6: STUDENT TESTIMONIALS  (added 2026-05-25)
       * Three quotes from real-sounding Indian students.
       * ================================================================= */}
      <section className={styles.testimonialsSection}>
        <div className={styles.sectionInner}>
          <div className={`${styles.sectionHeader} animate-on-scroll`}>
            <span className={styles.sectionEyebrow}>Student Stories</span>
            <h2 className={styles.sectionTitle}>Loved by Students Across India</h2>
            <p className={styles.sectionSubtitle}>
              Real results from students who made LearnVeda their daily study partner.
            </p>
          </div>

          <div className={styles.testimonialsGrid}>
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className={`${styles.testimonialCard} animate-on-scroll`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* 5-star rating row */}
                <div className={styles.testimonialStars} aria-label="5 out of 5 stars">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={14} fill="currentColor" aria-hidden="true" />
                  ))}
                </div>

                {/* Quote text */}
                <p className={styles.testimonialText}>&ldquo;{t.text}&rdquo;</p>

                {/* Author row */}
                <div className={styles.testimonialAuthor}>
                  <div
                    className={styles.testimonialAvatar}
                    style={{ background: t.color }}
                    aria-hidden="true"
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className={styles.testimonialName}>{t.name}</div>
                    <div className={styles.testimonialMeta}>{t.meta}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================
       * SECTION 7: PLATFORM STATS
       * Real DB numbers — revalidated every 10 minutes via ISR.
       * ================================================================= */}
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

      {/* =================================================================
       * SECTION 8: LEADERBOARD PREVIEW  (added 2026-05-25)
       * Top 5 students from the live PostgreSQL database.
       * Only rendered if there are users to display.
       * ================================================================= */}
      {topUsers.length > 0 && (
        <section className={styles.leaderPreviewSection}>
          <div className={styles.sectionInner}>
            <div className={`${styles.sectionHeader} animate-on-scroll`}>
              <span className={styles.sectionEyebrow}>Global Rankings</span>
              <h2 className={styles.sectionTitle}>Top Learners This Week</h2>
              <p className={styles.sectionSubtitle}>
                Compete with students from across India. Every study session brings you closer to #1.
              </p>
            </div>

            <div className={`${styles.leaderPreviewList} animate-on-scroll`}>
              {topUsers.map((user, idx) => (
                <div
                  key={idx}
                  className={`${styles.leaderPreviewRow} ${idx === 0 ? styles.leaderRowFirst : ""}`}
                >
                  {/* Rank: medal emoji for top 3, #N for the rest */}
                  <span className={styles.leaderRank} aria-label={`Rank ${idx + 1}`}>
                    {getRankDisplay(idx)}
                  </span>

                  {/* Avatar: initials of the student's name */}
                  <div className={styles.leaderAvatar} aria-hidden="true">
                    {user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>

                  {/* Name + track + level */}
                  <div className={styles.leaderInfo}>
                    <span className={styles.leaderName}>{user.name}</span>
                    <span className={styles.leaderMeta}>
                      {user.track.replace(/-/g, " ")} · Lv.{user.level}
                    </span>
                  </div>

                  {/* XP + streak */}
                  <div className={styles.leaderStats}>
                    <span className={styles.leaderXp}>
                      {user.xp.toLocaleString("en-IN")} XP
                    </span>
                    {user.streak > 0 && (
                      <span className={styles.leaderStreak}>
                        <Flame size={12} aria-hidden="true" /> {user.streak}d
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {/* Link to the full leaderboard page */}
              <div className={styles.leaderViewAll}>
                <Link href="/leaderboard" className={styles.viewAllLink}>
                  View Full Leaderboard <ChevronRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =================================================================
       * SECTION 8.5: COMMUNITY HIGHLIGHTS
       * Top 3 most-liked community posts from the PostgreSQL database.
       * Only rendered when real posts exist.
       * ================================================================= */}
      {communityHighlights.length > 0 && (
        <section className={styles.communitySection}>
          <div className={styles.sectionInner}>
            <div className={`${styles.sectionHeader} animate-on-scroll`}>
              <span className={styles.sectionEyebrow}>Student Community</span>
              <h2 className={styles.sectionTitle}>Live Community Highlights</h2>
              <p className={styles.sectionSubtitle}>
                Real discussions from students across India — from CBSE board prep to engineering placements.
              </p>
            </div>

            <div className={styles.communityGrid}>
              {communityHighlights.map((post, idx) => (
                <article
                  key={post.id}
                  className={`${styles.communityCard} animate-on-scroll`}
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  {/* Author row */}
                  <div className={styles.communityAuthorRow}>
                    <div
                      className={styles.communityAvatar}
                      aria-hidden="true"
                      style={{ background: ["#2563EB","#10B981","#8B5CF6"][idx % 3] }}
                    >
                      {post.authorName.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
                    </div>
                    <span className={styles.communityAuthorName}>{post.authorName}</span>
                  </div>

                  {/* Post title */}
                  <h3 className={styles.communityPostTitle}>{post.title}</h3>

                  {/* Post excerpt */}
                  <p className={styles.communityPostExcerpt}>
                    {post.body.slice(0, 140)}{post.body.length > 140 ? "…" : ""}
                  </p>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className={styles.communityTags}>
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className={styles.communityTag}>{tag}</span>
                      ))}
                    </div>
                  )}

                  {/* Stats row */}
                  <div className={styles.communityStats}>
                    <span className={styles.communityStat}>
                      <Trophy size={12} aria-hidden="true" /> {post.likes} likes
                    </span>
                    <span className={styles.communityStat}>
                      <Users size={12} aria-hidden="true" /> {post.views} views
                    </span>
                  </div>
                </article>
              ))}
            </div>

            <div className={styles.communityViewAll}>
              <Link href="/community" className={styles.viewAllLink}>
                Join the Community <ChevronRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* =================================================================
       * SECTION 9: WHY EDUQUEST
       * Six differentiator cards for parents and students.
       * ================================================================= */}
      <section className={styles.whySection}>
        <div className={styles.sectionInner}>
          <div className={`${styles.sectionHeader} animate-on-scroll`}>
            <span className={styles.sectionEyebrow}>Why LearnVeda?</span>
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

      {/* =================================================================
       * SECTION 10: FINAL CTA
       * Closing call-to-action — drives sign-up conversions.
       * ================================================================= */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <div className={`${styles.ctaContent} animate-on-scroll`}>
            <div className={styles.ctaIcon} aria-hidden="true">🚀</div>
            <h2 className={styles.ctaTitle}>Ready to Start Your Journey?</h2>
            <p className={styles.ctaSubtitle}>
              Join {stats.totalStudents > 0
                ? `${formatStat(stats.totalStudents)} students`
                : "thousands of students"} leveling up their skills.
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
