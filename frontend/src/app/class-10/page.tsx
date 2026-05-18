/**
 * FILE: page.tsx
 * LOCATION: src/app/class-10/page.tsx
 * PURPOSE: Class 10 landing page — board exam focused, CBSE NCERT-aligned syllabus.
 *          Displays all six subjects, a stats bar, a "Why Class 10?" section, and a CTA.
 * USED BY: Next.js App Router — renders at "/class-10"
 * DEPENDENCIES: next/link, lucide-react, Class10.module.css
 * LAST UPDATED: 2026-05-18
 */

import Link from "next/link";
import {
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  Languages,
  ArrowRight,
  Target,
  Clock,
  TrendingUp,
  Shield,
  ChevronRight,
} from "lucide-react";
import styles from "./Class10.module.css";

export const metadata = {
  title: "Class 10 — CBSE Board Exam Preparation | EduQuest",
  description:
    "Structured CBSE Class 10 board exam preparation — Maths, Science, Social Science, English, Hindi. Chapter-wise day plans, practice questions, and mock tests.",
};

/* ─────────────────────────────────────────────
 * SUBJECTS Array
 * Each subject maps to a subject detail page via its id slug.
 * iconClass drives the colored icon background in the CSS module.
 * ───────────────────────────────────────────── */
const SUBJECTS = [
  {
    id: "mathematics-standard",
    name: "Maths Standard",
    icon: Calculator,
    chapters: 15,
    desc: "Board-focused standard mathematics — algebra, geometry, statistics, and timed practice tests.",
    iconClass: "iconBlue",
  },
  {
    id: "mathematics-basic",
    name: "Maths Basic",
    icon: Calculator,
    chapters: 15,
    desc: "Concept-first mathematics plan for confident board exam performance with step-by-step guidance.",
    iconClass: "iconIndigo",
  },
  {
    id: "science",
    name: "Science",
    icon: FlaskConical,
    chapters: 16,
    desc: "Chemistry, Physics, and Biology in one track — all NCERT chapters mapped to board-pattern practice.",
    iconClass: "iconGreen",
  },
  {
    id: "social-science",
    name: "Social Science",
    icon: Globe,
    chapters: 20,
    desc: "High-retention History, Civics, Geography, and Economics revision with map practice.",
    iconClass: "iconViolet",
  },
  {
    id: "english",
    name: "English",
    icon: BookOpen,
    chapters: 12,
    desc: "Literature, writing, and grammar preparation with model answers and scoring practice.",
    iconClass: "iconAmber",
  },
  {
    id: "hindi",
    name: "Hindi",
    icon: Languages,
    chapters: 12,
    desc: "Chapter-wise Hindi literature and grammar with exam-pattern answers for board preparation.",
    iconClass: "iconRed",
  },
];

/* ─────────────────────────────────────────────
 * WHY_CARDS Array
 * Four reasons why a Class 10 student should use EduQuest.
 * ───────────────────────────────────────────── */
const WHY_CARDS = [
  {
    icon: Target,
    title: "PYQ-Aligned Plans",
    desc: "Every day-wise plan is built around previous year question patterns for maximum score impact.",
  },
  {
    icon: Clock,
    title: "60-Day Revision",
    desc: "Complete board syllabus covered in 60 structured days — no chapter left behind.",
  },
  {
    icon: TrendingUp,
    title: "Daily XP + Streaks",
    desc: "Every revision session earns XP and maintains your streak. Gamified consistency.",
  },
  {
    icon: Shield,
    title: "Board Strategy",
    desc: "Answer presentation tips, CBSE marking scheme guidance, and time management techniques.",
  },
];

/* ─────────────────────────────────────────────
 * Class10Page Component — Server Component
 * ───────────────────────────────────────────── */
export default function Class10Page() {
  /* Derive total chapter count from all subjects for the stats bar */
  const totalChapters = SUBJECTS.reduce((sum, s) => sum + s.chapters, 0);

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        {/* ==================== HERO ==================== */}
        <div className={styles.hero}>
          {/* Decorative amber radial orb — amber = board exam urgency */}
          <div className={styles.heroOrb} aria-hidden="true" />

          {/* Eyebrow chip */}
          <div className={styles.eyebrow}>
            <Target size={14} aria-hidden="true" /> Class 10 · Board Exam
          </div>

          <h1 className={styles.heroTitle}>Board Exam Preparation</h1>

          <p className={styles.heroSubtitle}>
            Structured CBSE Class 10 revision. Master all six subjects chapter-by-chapter
            and walk into board exams fully prepared.
          </p>

          {/* Stats bar with dividers between items */}
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>6</span>
              <span className={styles.statLabel}>Subjects</span>
            </div>

            <div className={styles.statDivider} aria-hidden="true" />

            <div className={styles.statItem}>
              <span className={styles.statValue}>{totalChapters}+</span>
              <span className={styles.statLabel}>Chapters</span>
            </div>

            <div className={styles.statDivider} aria-hidden="true" />

            <div className={styles.statItem}>
              <span className={styles.statValue}>1000+</span>
              <span className={styles.statLabel}>Board Questions</span>
            </div>

            <div className={styles.statDivider} aria-hidden="true" />

            <div className={styles.statItem}>
              <span className={styles.statValue}>60 Days</span>
              <span className={styles.statLabel}>Revision Plan</span>
            </div>
          </div>
        </div>

        {/* ==================== SUBJECT GRID ==================== */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Your Subjects</h2>
          <p className={styles.sectionSubtitle}>
            Six structured plans — one per subject. Each chapter builds on the last,
            with timed practice questions after every session.
          </p>
        </div>

        <div className={styles.subjectGrid}>
          {SUBJECTS.map((subject) => {
            const SubjectIcon = subject.icon;
            return (
              <Link
                key={subject.id}
                href={`/class-10/${subject.id}`}
                className={styles.subjectCard}
              >
                <div className={styles.cardHeader}>
                  <div className={`${styles.subjectIcon} ${styles[subject.iconClass]}`}>
                    <SubjectIcon size={22} aria-hidden="true" />
                  </div>
                  <h3 className={styles.subjectName}>{subject.name}</h3>
                </div>

                <p className={styles.subjectDesc}>{subject.desc}</p>

                <div className={styles.cardFooter}>
                  <span className={styles.chapterCount}>
                    {subject.chapters} Chapters
                  </span>
                  <span className={styles.startBtn}>
                    Start Revision <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ==================== WHY CLASS 10 ==================== */}
        <div className={styles.whySection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Why EduQuest for Class 10?</h2>
            <p className={styles.sectionSubtitle}>
              Board exams reward consistency and strategy. EduQuest provides both.
            </p>
          </div>

          <div className={styles.whyGrid}>
            {WHY_CARDS.map((card, idx) => {
              const WhyIcon = card.icon;
              return (
                <div key={idx} className={styles.whyCard}>
                  <div className={styles.whyIcon}>
                    <WhyIcon size={20} aria-hidden="true" />
                  </div>
                  <h4 className={styles.whyTitle}>{card.title}</h4>
                  <p className={styles.whyDesc}>{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==================== CTA BANNER ==================== */}
        <div className={styles.ctaBanner}>
          <div className={styles.ctaText}>
            <h3 className={styles.ctaTitle}>Start your 60-day board revision today</h3>
            <p className={styles.ctaSubtext}>
              Free, structured, and gamified. No signup fees. Just results.
            </p>
          </div>
          <Link href="/sign-up" className={styles.ctaButton}>
            Begin Revision <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>

      </div>
    </div>
  );
}
