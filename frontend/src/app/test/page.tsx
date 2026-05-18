/**
 * FILE: page.tsx
 * LOCATION: src/app/test/page.tsx
 * PURPOSE: Test Center — the hub for all assessment activity on EduQuest.
 *          Consolidates chapter practice, board mock exams, coding checkpoints,
 *          and future proctored assessment flows in one dedicated route.
 *          Keeps test workflows cleanly separate from marketing and community pages.
 * USED BY: Main navigation (Practice dropdown), Footer links, Dashboard shortcuts
 * DEPENDENCIES: next/link, lucide-react, TestCenter.module.css
 * LAST UPDATED: 2026-05-16
 */

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookCheck,
  ClipboardCheck,
  Code2,
  ShieldCheck,
  TimerReset,
  Zap,
} from "lucide-react";
import styles from "./TestCenter.module.css";

export const metadata = {
  title: "Test Center — Practice, Mocks & Assessments",
  description:
    "Take chapter practice tests, board mock exams, and coding checkpoints. EduQuest Test Center — your one place for all assessments.",
};

/**
 * TEST_LANES — the three assessment categories available to students.
 * Each lane links to its respective section of the platform.
 */
const TEST_LANES = [
  {
    icon: BookCheck,
    title: "Chapter Practice",
    description:
      "Short subject-specific checkpoints for daily revision. Test your understanding chapter by chapter across all class tracks.",
    href: "/class-10",
    label: "Open Class Routes",
  },
  {
    icon: TimerReset,
    title: "Timed Mock Exams",
    description:
      "Full-length board-style mock exams with countdown timers, instant scoring, and subject-wise analysis after submission.",
    href: "/events",
    label: "View Event Tests",
  },
  {
    icon: Code2,
    title: "Coding Checkpoints",
    description:
      "Language-specific coding tests aligned with engineering day-wise plans. From basic syntax to algorithm challenges.",
    href: "/engineering",
    label: "Open Coding Tracks",
  },
] as const;

/**
 * UPCOMING_TESTS — scheduled assessments students can look forward to.
 * Linked to real events in the database via the events page.
 */
const UPCOMING_TESTS = [
  { label: "JEE Advanced Mock Marathon", date: "June 20, 2026", type: "Mock Exam" },
  { label: "Python Coding Championship", date: "July 5, 2026", type: "Coding Test" },
  { label: "Science Olympiad Qualifier", date: "May 24, 2026", type: "Olympiad" },
];

/**
 * TestCenterPage Component
 *
 * The dedicated assessment hub for EduQuest. Structured into:
 * 1. Hero panel — headline, description, and quick-action buttons
 * 2. Upcoming tests sidebar — shows nearest scheduled assessments
 * 3. Assessment lanes — three cards for different test categories
 * 4. Foundation band — platform trust signals for assessments
 */
export default function TestCenterPage() {
  return (
    <div className={styles.page}>

      {/* ==================== HERO SECTION ==================== */}
      {/* Two-column layout: left copy panel, right upcoming tests panel. */}
      <section className={styles.hero}>

        {/* Left — headline, description, action buttons */}
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>
            <ClipboardCheck size={15} />
            Test Center
          </span>

          <h1>
            Your complete home for practice tests, mocks, and assessments.
          </h1>

          <p>
            Chapter quizzes for daily revision, full-length board mock exams,
            and coding checkpoints — all in one focused space, separate from
            your regular learning tracks so you can assess yourself clearly.
          </p>

          <div className={styles.heroActions}>
            <Link href="/events" className={styles.primaryAction}>
              Browse All Tests <ArrowRight size={16} />
            </Link>
            <Link href="/battle" className={styles.secondaryAction}>
              Quick Battle
            </Link>
          </div>
        </div>

        {/* Right — upcoming tests panel */}
        <aside className={styles.statusPanel}>
          <div className={styles.statusHeader}>
            <Zap size={16} />
            <span>Upcoming Assessments</span>
          </div>
          <ul>
            {UPCOMING_TESTS.map((test) => (
              <li key={test.label}>
                <strong>{test.label}</strong>
                <br />
                <small>{test.type} &bull; {test.date}</small>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      {/* ==================== ASSESSMENT LANES ==================== */}
      {/* Three cards — each represents a different test category.
          Clicking the link navigates to the relevant platform section. */}
      <section className={styles.lanes}>
        {TEST_LANES.map((lane) => {
          const LaneIcon = lane.icon;
          return (
            <article key={lane.title} className={styles.laneCard}>
              {/* Lane icon badge */}
              <div className={styles.laneIcon}>
                <LaneIcon size={20} />
              </div>

              {/* Lane title and description */}
              <h2>{lane.title}</h2>
              <p>{lane.description}</p>

              {/* Link to the section */}
              <Link href={lane.href} className={styles.inlineLink}>
                {lane.label} <ArrowRight size={15} />
              </Link>
            </article>
          );
        })}
      </section>

      {/* ==================== FOUNDATION BAND ==================== */}
      {/* Platform trust signals — reassures students about test integrity. */}
      <section className={styles.foundationBand}>
        <div>
          <span>Assessment Quality</span>
          <h2>Tests built for real growth — not just numbers on a screen.</h2>
        </div>
        <div className={styles.foundationList}>
          <span><BarChart3 size={16} /> Instant analytics</span>
          <span><ShieldCheck size={16} /> Anti-cheat protected</span>
          <span><ClipboardCheck size={16} /> NCERT & Board aligned</span>
        </div>
      </section>
    </div>
  );
}
