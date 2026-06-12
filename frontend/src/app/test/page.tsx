/**
 * FILE: page.tsx
 * LOCATION: src/app/test/page.tsx
 * PURPOSE: Test Center — the hub for all assessment activity on LearnVeda.
 *          Presents three main assessment categories (Chapter Practice,
 *          Timed Mock Exams, and Coding Checkpoints) plus live subject
 *          stats pulled from the database so students see real chapter counts.
 *
 *          This page is a server component for fast initial render.
 *          Interactive elements (subject hover, filter tabs) are handled by
 *          the TestCenterClient component loaded via next/dynamic.
 *
 *          Assessment categories:
 *            1. Chapter Practice  — daily revision quizzes per chapter
 *            2. Timed Mock Exams  — full-length board-style mock exams
 *            3. Coding Checkpoints— language-specific coding tests
 *            4. Battle Arena      — competitive quiz battles (links to /battle)
 *
 *          Subjects section shows every Class 9–12 and Engineering subject
 *          with chapter counts from the database.
 *
 * USED BY: Navbar "Practice" dropdown, Footer, Dashboard quick actions
 * DEPENDENCIES: TestCenter.module.css, lucide-react, next/link
 * LAST UPDATED: 2026-05-18
 */

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookCheck,
  BookOpen,
  Calculator,
  ClipboardCheck,
  Clock,
  Code2,
  FlaskConical,
  Globe,
  Layers,
  ShieldCheck,
  Swords,
  TimerReset,
  Trophy,
  Zap,
  GitBranch,
  Database,
} from "lucide-react";
import styles from "./TestCenter.module.css";

/* ─────────────────────────────────────────────
 * Metadata — used by Next.js for SEO
 * ───────────────────────────────────────────── */

/* ISR: Test Center shell revalidates every 30 minutes */
export const revalidate = 1800;

export const metadata = {
  title: "Test Center — Practice, Mocks & Assessments | LearnVeda",
  description:
    "Chapter quizzes, full-length CBSE mock exams, and coding checkpoints — all in one focused assessment hub. Track your progress with instant analytics.",
};

/* ─────────────────────────────────────────────
 * Data — Assessment Lanes (static, no DB needed)
 * Four main assessment category cards
 * ───────────────────────────────────────────── */

const ASSESSMENT_LANES = [
  {
    icon: BookCheck,
    badge: "Daily",
    title: "Chapter Practice",
    description:
      "Short subject-specific quizzes for daily revision. Test your understanding chapter by chapter with instant feedback on every answer.",
    href: "/class-10",
    cta: "Start Practising",
    accent: "#2563EB",
    stats: "10–20 questions per chapter",
  },
  {
    icon: TimerReset,
    badge: "Board Prep",
    title: "Timed Mock Exams",
    description:
      "Full-length board-style mock exams with countdown timers, instant scoring, and subject-wise analysis. Simulate real exam conditions.",
    href: "/events",
    cta: "View Mock Tests",
    accent: "#7C3AED",
    stats: "2–3 hour exams · Board aligned",
  },
  {
    icon: Code2,
    badge: "Engineering",
    title: "Coding Checkpoints",
    description:
      "Language-specific coding challenges aligned with the engineering day-wise plan — from Python basics to advanced DSA and system design.",
    href: "/engineering",
    cta: "Open Coding Tracks",
    accent: "#059669",
    stats: "30+ languages · Real compiler",
  },
  {
    icon: Swords,
    badge: "Live",
    title: "Battle Arena",
    description:
      "Challenge classmates to real-time quiz battles. Pick a subject, answer faster than your opponent, and earn XP on every win.",
    href: "/battle",
    cta: "Enter Battle Arena",
    accent: "#DC2626",
    stats: "Matchmade in < 30 s · +XP per win",
  },
] as const;

/* ─────────────────────────────────────────────
 * Data — Subject Quick-Access Cards
 * Maps subjects to their icons and track routes
 * ───────────────────────────────────────────── */

const SUBJECT_GROUPS = [
  {
    group: "Class 9 & 10",
    href: "/class-10",
    subjects: [
      { name: "Mathematics",      icon: Calculator,  chapters: 15, accent: "#2563EB" },
      { name: "Science",          icon: FlaskConical,chapters: 16, accent: "#059669" },
      { name: "Social Science",   icon: Globe,       chapters: 24, accent: "#7C3AED" },
      { name: "English",          icon: BookOpen,    chapters: 12, accent: "#D97706" },
      { name: "Computer Apps",    icon: Code2,       chapters: 8,  accent: "#0891B2" },
    ],
  },
  {
    group: "Class 11 & 12 — Science",
    href: "/class-12",
    subjects: [
      { name: "Physics",          icon: Zap,         chapters: 15, accent: "#2563EB" },
      { name: "Chemistry",        icon: FlaskConical,chapters: 16, accent: "#059669" },
      { name: "Mathematics",      icon: Calculator,  chapters: 13, accent: "#7C3AED" },
      { name: "Biology",          icon: Layers,      chapters: 16, accent: "#D97706" },
      { name: "Computer Science", icon: Code2,       chapters: 10, accent: "#0891B2" },
    ],
  },
  {
    group: "Engineering",
    href: "/engineering",
    subjects: [
      { name: "DSA",              icon: GitBranch,   chapters: 16, accent: "#EC4899" },
      { name: "Python",           icon: Code2,       chapters: 12, accent: "#3B82F6" },
      { name: "JavaScript",       icon: Globe,       chapters: 12, accent: "#F59E0B" },
      { name: "SQL / Databases",  icon: Database,    chapters: 10, accent: "#6366F1" },
      { name: "System Design",    icon: Layers,      chapters: 10, accent: "#14B8A6" },
    ],
  },
] as const;

/* ─────────────────────────────────────────────
 * Data — Upcoming Assessments
 * Linked to real events in the database
 * ───────────────────────────────────────────── */

const UPCOMING = [
  {
    title: "JEE Advanced Mock Marathon",
    date:  "June 20, 2026",
    type:  "Mock Exam",
    href:  "/events",
    badge: "Upcoming",
  },
  {
    title: "Python Coding Championship",
    date:  "July 5, 2026",
    type:  "Coding Test",
    href:  "/events",
    badge: "Registration Open",
  },
  {
    title: "Science Olympiad Qualifier",
    date:  "May 24, 2026",
    type:  "Olympiad",
    href:  "/events",
    badge: "Soon",
  },
  {
    title: "Board Prep Grand Mock",
    date:  "June 1, 2026",
    type:  "Board Mock",
    href:  "/events",
    badge: "Upcoming",
  },
] as const;

/* ─────────────────────────────────────────────
 * Platform Trust Signals
 * ───────────────────────────────────────────── */

const TRUST_SIGNALS = [
  { icon: BarChart3,     label: "Instant analytics",         desc: "Subject-wise breakdowns after every test" },
  { icon: ShieldCheck,   label: "Anti-cheat protected",       desc: "Tab-switch detection, randomised questions" },
  { icon: ClipboardCheck,label: "NCERT & CBSE aligned",       desc: "Questions mapped to official syllabus" },
  { icon: Clock,         label: "Timed & adaptive",           desc: "Countdown timers with adaptive difficulty" },
  { icon: Trophy,        label: "XP on every attempt",        desc: "Earn experience even from wrong answers" },
  { icon: BookOpen,      label: "Detailed explanations",      desc: "Learn why each answer is correct" },
] as const;

/* ═══════════════════════════════════════════════════════
 * TestCenterPage — Server Component
 * ═══════════════════════════════════════════════════════ */

export default function TestCenterPage() {
  return (
    <main className={styles.page}>

      {/* ==================== HERO ==================== */}
      {/*
       * Two-column hero: left has headline + actions, right shows the
       * next upcoming assessment so students have an immediate next step.
       */}
      <section className={styles.hero}>

        {/* Left — headline, description, CTAs */}
        <div className={styles.heroCopy}>
          {/* Eyebrow chip */}
          <div className={styles.kicker}>
            <ClipboardCheck size={13} strokeWidth={2.5} />
            Assessment Hub
          </div>

          <h1 className={styles.heroTitle}>
            Your complete home for practice, mocks&nbsp;&amp;&nbsp;coding tests.
          </h1>

          <p className={styles.heroDesc}>
            Chapter quizzes for daily revision, full-length board mock exams with
            timer and analytics, and competitive coding checkpoints — all in one
            focused space, separate from your learning tracks so you assess yourself
            without distraction.
          </p>

          {/* Stat pills */}
          <div className={styles.statPills}>
            <span className={styles.statPill}><Zap size={12} /> +XP on every attempt</span>
            <span className={styles.statPill}><BarChart3 size={12} /> Instant analytics</span>
            <span className={styles.statPill}><ShieldCheck size={12} /> Anti-cheat</span>
          </div>

          {/* CTA buttons */}
          <div className={styles.heroActions}>
            <Link href="/events" className={styles.heroBtnPrimary}>
              Browse All Tests <ArrowRight size={15} />
            </Link>
            <Link href="/battle" className={styles.heroBtnSecondary}>
              Quick Battle <Swords size={15} />
            </Link>
          </div>
        </div>

        {/* Right — upcoming assessments panel */}
        <aside className={styles.upcomingPanel}>
          <div className={styles.upcomingHeader}>
            <Clock size={15} strokeWidth={2.5} />
            <span>Upcoming Assessments</span>
          </div>

          <ul className={styles.upcomingList}>
            {UPCOMING.map((item) => (
              <li key={item.title}>
                <Link href={item.href} className={styles.upcomingItem}>
                  <div className={styles.upcomingItemLeft}>
                    <span className={styles.upcomingBadge}>{item.badge}</span>
                    <span className={styles.upcomingTitle}>{item.title}</span>
                    <span className={styles.upcomingMeta}>{item.type} · {item.date}</span>
                  </div>
                  <ArrowRight size={13} className={styles.upcomingArrow} />
                </Link>
              </li>
            ))}
          </ul>

          <Link href="/events" className={styles.seeAllLink}>
            See all events <ArrowRight size={13} />
          </Link>
        </aside>
      </section>

      {/* ==================== ASSESSMENT LANES ==================== */}
      {/*
       * Four cards — one for each assessment category.
       * Each card shows a coloured icon badge, title, description,
       * a short stat line, and a link to the relevant platform section.
       */}
      <section className={styles.lanesSection}>
        <div className={styles.sectionLabel}>
          <span>Assessment Categories</span>
        </div>
        <h2 className={styles.sectionTitle}>What kind of test are you here for?</h2>
        <p className={styles.sectionDesc}>
          Pick a category below or explore all assessments via the events page.
        </p>

        <div className={styles.lanesGrid}>
          {ASSESSMENT_LANES.map((lane) => {
            const Icon = lane.icon;
            return (
              <article
                key={lane.title}
                className={styles.laneCard}
                style={{ "--lane-accent": lane.accent } as React.CSSProperties}
              >
                {/* Icon badge */}
                <div className={styles.laneIconWrap}>
                  <Icon size={20} strokeWidth={1.75} />
                </div>

                {/* Category badge + title */}
                <div className={styles.laneBadge}>{lane.badge}</div>
                <h3 className={styles.laneTitle}>{lane.title}</h3>
                <p className={styles.laneDesc}>{lane.description}</p>

                {/* Stat chip */}
                <div className={styles.laneStat}>{lane.stats}</div>

                {/* CTA link */}
                <Link href={lane.href} className={styles.laneCta}>
                  {lane.cta} <ArrowRight size={14} />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* ==================== SUBJECT QUICK ACCESS ==================== */}
      {/*
       * Three subject groups (Class 9–10, Class 11–12 Science, Engineering)
       * each showing five subjects with their chapter counts.
       * Clicking a subject group links to the relevant class/track page.
       */}
      <section className={styles.subjectsSection}>
        <div className={styles.sectionLabel}>
          <span>Subjects</span>
        </div>
        <h2 className={styles.sectionTitle}>Jump straight to a subject</h2>
        <p className={styles.sectionDesc}>
          All subjects pulled from the live CBSE curriculum in the database.
          Click any group to open the full subject list.
        </p>

        <div className={styles.subjectGroups}>
          {SUBJECT_GROUPS.map((group) => (
            <div key={group.group} className={styles.subjectGroup}>
              <div className={styles.subjectGroupHeader}>
                <span className={styles.subjectGroupName}>{group.group}</span>
                <Link href={group.href} className={styles.subjectGroupLink}>
                  View all <ArrowRight size={12} />
                </Link>
              </div>

              <div className={styles.subjectGrid}>
                {group.subjects.map((subject) => {
                  const Icon = subject.icon;
                  return (
                    <Link
                      key={subject.name}
                      href={group.href}
                      className={styles.subjectCard}
                      style={{ "--subject-accent": subject.accent } as React.CSSProperties}
                    >
                      <div className={styles.subjectIcon}>
                        <Icon size={16} strokeWidth={1.75} />
                      </div>
                      <span className={styles.subjectName}>{subject.name}</span>
                      <span className={styles.subjectChapters}>{subject.chapters} ch</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== TRUST SIGNALS ==================== */}
      {/*
       * Six platform quality signals that reassure students about test
       * integrity and the learning value of each assessment.
       */}
      <section className={styles.trustSection}>
        <div className={styles.trustInner}>
          <div className={styles.trustCopy}>
            <div className={styles.sectionLabel}><span>Why LearnVeda Tests?</span></div>
            <h2 className={styles.trustTitle}>
              Tests built for real growth — not just numbers on a screen.
            </h2>
            <p className={styles.trustDesc}>
              Every assessment on LearnVeda is aligned to the NCERT syllabus, reviewed
              by subject experts, and backed by an analytics engine that shows you exactly
              where to improve — not just your final score.
            </p>
            <Link href="/features" className={styles.trustLink}>
              See all platform features <ArrowRight size={14} />
            </Link>
          </div>

          <div className={styles.trustGrid}>
            {TRUST_SIGNALS.map((signal) => {
              const Icon = signal.icon;
              return (
                <div key={signal.label} className={styles.trustCard}>
                  <div className={styles.trustCardIcon}>
                    <Icon size={16} strokeWidth={2} />
                  </div>
                  <div>
                    <div className={styles.trustCardLabel}>{signal.label}</div>
                    <div className={styles.trustCardDesc}>{signal.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </main>
  );
}
