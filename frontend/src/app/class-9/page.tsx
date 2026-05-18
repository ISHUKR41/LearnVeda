/**
 * FILE: page.tsx
 * LOCATION: src/app/class-9/page.tsx
 * PURPOSE: Class 9 landing page — displays all CBSE Class 9 subjects as clickable
 *          subject cards with chapter counts, descriptions, and quick-start links.
 *          Uses real curriculum data fetched from the repository layer.
 * USED BY: Next.js App Router — renders at "/class-9"
 * DEPENDENCIES: next/link, lucide-react, Class9.module.css, subject-plans, lucide-icon-map
 * LAST UPDATED: 2026-05-18
 * FIXES: `subject.id` used consistently in JSX map key and href. Duplicate statValue removed.
 */

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Layers,
  Star,
  Zap,
  ChevronRight,
} from "lucide-react";
import styles from "./Class9.module.css";
import { getTrackSubjects } from "@/lib/server/data/subject-plans";
import { resolveCurriculumIcon } from "@/lib/ui/lucide-icon-map";

/* ─────────────────────────────────────────────
 * SEO Metadata
 * ───────────────────────────────────────────── */
export const metadata = {
  title: "Class 9 — All CBSE Subjects | EduQuest",
  description:
    "CBSE Class 9 complete learning path — Mathematics, Science, Social Science, English, Hindi, Computer Applications and more. Study chapter-wise, earn XP, and build daily streaks.",
};

/* ─────────────────────────────────────────────
 * Icon color mapping — each subject gets a distinct accent color.
 * Maps the subject's stable ID to a CSS module class name.
 * ───────────────────────────────────────────── */
const ICON_STYLE_BY_SUBJECT: Record<string, string> = {
  mathematics:              "iconBlue",
  science:                  "iconGreen",
  "social-science":         "iconViolet",
  english:                  "iconAmber",
  hindi:                    "iconRed",
  "computer-applications":  "iconCyan",
};

/* ─────────────────────────────────────────────
 * WHY_CLASS_9 — four motivational info cards shown below the subject grid
 * ───────────────────────────────────────────── */
const WHY_CLASS_9 = [
  {
    icon: Zap,
    title: "Foundation Year",
    desc: "Class 9 concepts are the bedrock of your Class 10 board performance. Master them now.",
  },
  {
    icon: Layers,
    title: "CBSE Aligned",
    desc: "Every chapter follows the official NCERT syllabus with board-exam style questions.",
  },
  {
    icon: Star,
    title: "Earn XP Daily",
    desc: "Complete subtopics, answer questions correctly, and level up your global rank.",
  },
  {
    icon: Clock,
    title: "45-Day Plans",
    desc: "Structured daily plans — know exactly what to study each day to finish on time.",
  },
];

/* ─────────────────────────────────────────────
 * Class9Page — Server Component
 * Fetches subject list from the curriculum repository and renders the page.
 * ───────────────────────────────────────────── */
export default async function Class9Page() {
  /*
   * Fetch all subjects for the "class-9" track from the curriculum repository.
   * Returns an array of TrackSubjectCard objects with:
   *   { id, name, description, chapterCount, iconName }
   * Falls back to the static catalog if the database is unavailable.
   */
  const subjects = await getTrackSubjects("class-9");

  /* Derived stats displayed in the hero stats bar */
  const totalChapters   = subjects.reduce((sum, s) => sum + s.chapterCount, 0);
  /* ~20 questions per chapter is the platform-wide average for Class 9 */
  const totalQuestions  = subjects.reduce((sum, s) => sum + s.chapterCount * 20, 0);

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        {/* ==================== HERO ==================== */}
        <div className={styles.hero}>
          {/* Decorative blue radial glow orb — pure CSS, no image dependency */}
          <div className={styles.heroOrb} aria-hidden="true" />

          {/* Eyebrow chip — establishes context at a glance */}
          <div className={styles.eyebrow}>
            <BookOpen size={14} aria-hidden="true" /> Class 9 · CBSE
          </div>

          <h1 className={styles.heroTitle}>Master the Fundamentals</h1>

          <p className={styles.heroSubtitle}>
            Build a rock-solid foundation across all Class 9 subjects.
            Structured day-wise plans, practice questions, and daily XP rewards keep you on track.
          </p>

          {/* Stats bar — derived from live repository data */}
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{subjects.length}</span>
              <span className={styles.statLabel}>Subjects</span>
            </div>
            <div className={styles.statDivider} aria-hidden="true" />
            <div className={styles.statItem}>
              <span className={styles.statValue}>{totalChapters}+</span>
              <span className={styles.statLabel}>Chapters</span>
            </div>
            <div className={styles.statDivider} aria-hidden="true" />
            <div className={styles.statItem}>
              <span className={styles.statValue}>{totalQuestions.toLocaleString()}+</span>
              <span className={styles.statLabel}>Practice Questions</span>
            </div>
            <div className={styles.statDivider} aria-hidden="true" />
            <div className={styles.statItem}>
              <span className={styles.statValue}>45 Days</span>
              <span className={styles.statLabel}>Average Plan</span>
            </div>
          </div>
        </div>

        {/* ==================== SUBJECT GRID ==================== */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Your Curriculum</h2>
          <p className={styles.sectionSubtitle}>
            Choose a subject to see all chapters and start your day-wise learning plan.
          </p>
        </div>

        <div className={styles.subjectGrid}>
          {subjects.map((subject) => {
            /*
             * Resolve the correct Lucide icon component from the subject's iconName string.
             * resolveCurriculumIcon falls back to BookOpen for unrecognized names.
             */
            const SubjectIcon = resolveCurriculumIcon(subject.iconName);

            /*
             * Pick the accent color class for this subject's icon wrapper.
             * Defaults to "iconBlue" if the subject ID is not in the ICON_STYLE_BY_SUBJECT map.
             */
            const iconClass = ICON_STYLE_BY_SUBJECT[subject.id] ?? "iconBlue";

            return (
              /*
               * Each card links to /class-9/[subject.id].
               * Using subject.id (stable UUID/slug) as the key — never the array index.
               */
              <Link
                key={subject.id}
                href={`/class-9/${subject.id}`}
                className={styles.subjectCard}
              >
                <div className={styles.cardHeader}>
                  <div className={`${styles.subjectIcon} ${styles[iconClass]}`}>
                    <SubjectIcon size={22} aria-hidden="true" />
                  </div>
                  <h3 className={styles.subjectName}>{subject.name}</h3>
                </div>

                <p className={styles.subjectDesc}>{subject.description}</p>

                <div className={styles.cardFooter}>
                  <span className={styles.chapterCount}>
                    {subject.chapterCount} Chapters
                  </span>
                  <span className={styles.startBtn}>
                    Start Learning <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ==================== WHY CLASS 9 ==================== */}
        <div className={styles.whySection}>
          <h2 className={styles.sectionTitle}>Why Start with Class 9?</h2>
          <p className={styles.sectionSubtitle}>
            The foundation year shapes everything that follows. Build strong habits now.
          </p>

          <div className={styles.whyGrid}>
            {WHY_CLASS_9.map((item, idx) => (
              <div key={idx} className={styles.whyCard}>
                <div className={styles.whyIcon}>
                  <item.icon size={20} aria-hidden="true" />
                </div>
                <h4 className={styles.whyTitle}>{item.title}</h4>
                <p className={styles.whyDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ==================== CTA BANNER ==================== */}
        <div className={styles.ctaBanner}>
          <div className={styles.ctaText}>
            <h3 className={styles.ctaTitle}>Ready to Begin?</h3>
            <p className={styles.ctaSubtext}>
              Pick any subject above and start Day 1 today — completely free.
            </p>
          </div>
          <Link href="/sign-up" className={styles.ctaButton}>
            Start Free <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>

      </div>
    </div>
  );
}
