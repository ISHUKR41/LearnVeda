/**
 * FILE: page.tsx
 * LOCATION: src/app/class-10/page.tsx
 * PURPOSE: Class 10 landing page — board exam focused, CBSE NCERT-aligned syllabus.
 *          Displays database-backed subjects, a stats bar, a "Why Class 10?"
 *          section, and a CTA.
 * USED BY: Next.js App Router — renders at "/class-10"
 * DEPENDENCIES: next/link, next/image, lucide-react, subject-plans,
 *               lucide-icon-map, Class10.module.css
 * LAST UPDATED: 2026-05-19
 */

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Target,
  Clock,
  TrendingUp,
  Shield,
  ChevronRight,
  Lightbulb,
} from "lucide-react";
import { getTrackSubjects } from "@/lib/server/data/subject-plans";
import { resolveCurriculumIcon } from "@/lib/ui/lucide-icon-map";
import styles from "./Class10.module.css";

/* ISR: Revalidate every hour — subject list rarely changes */
export const revalidate = 3600;

export const metadata = {
  title: "CBSE Class 10 Board Exam Prep — LearnVeda by Ishu | Free Online",
  description:
    "LearnVeda by Ishu — Best free CBSE Class 10 board exam preparation platform. Maths Standard & Basic, Science, Social Science, English, Hindi. Chapter-wise day plans, mock tests, XP, quiz battles. India's #1 Class 10 gamified study platform.",
  keywords: [
    "CBSE Class 10", "class 10 board exam preparation", "class 10 online study India",
    "class 10 maths", "class 10 science", "class 10 social science",
    "class 10 English", "class 10 Hindi", "class 10 NCERT solutions",
    "class 10 light reflection refraction", "class 10 electricity",
    "LearnVeda class 10", "ishu class 10", "best class 10 website India",
    "free class 10 board prep India", "class 10 mock tests free",
    "class 10 gamified learning", "class 10 chapter wise study",
    "CBSE 10th board exam 2025", "10th class study app India",
    "class 10 science notes India", "class 10 maths solutions India",
  ],
  icons: { icon: "/favicons/school.svg" },
  openGraph: {
    title: "CBSE Class 10 Board Prep — LearnVeda by Ishu | Free Gamified",
    description: "Best free CBSE Class 10 board prep by Ishu. Mock tests, XP, quiz battles, chapter-wise plans. India's #1.",
    type: "website",
  },
};

/* ─────────────────────────────────────────────
 * Icon color mapping — stable subject IDs get route-local visual accents.
 * Subjects not listed here still render with the default board-prep amber.
 * ───────────────────────────────────────────── */
const ICON_STYLE_BY_SUBJECT: Record<string, string> = {
  "mathematics-standard": "iconBlue",
  "mathematics-basic": "iconIndigo",
  science: "iconGreen",
  "social-science": "iconViolet",
  english: "iconAmber",
  hindi: "iconRed",
  "computer-applications": "iconCyan",
};

/* ─────────────────────────────────────────────
 * WHY_CARDS Array
 * Four reasons why a Class 10 student should use LearnVeda.
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
export default async function Class10Page() {
  /*
   * Fetches Class 10 subjects from the same database-backed curriculum
   * repository used by the subject detail pages. Local development may still
   * use fallback data when PostgreSQL is not connected, but strict production
   * never silently swaps real DB data for static values.
   */
  const subjects = await getTrackSubjects("class-10");

  /* Derive hero stats from the repository payload instead of hardcoded cards. */
  const totalChapters = subjects.reduce((sum, subject) => sum + subject.chapterCount, 0);
  const totalQuestions = subjects.reduce((sum, subject) => sum + subject.chapterCount * 20, 0);

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        {/* ==================== HERO ==================== */}
        <div className={styles.hero}>
          {/* Route-owned bitmap hero image — optimized through Next.js Image. */}
          <Image
            src="/images/class-10-hero.png"
            alt="Class 10 board preparation background"
            fill
            priority
            className={styles.heroMedia}
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          <div className={styles.heroOverlay} aria-hidden="true" />

          {/* Decorative amber radial orb — amber = board exam urgency */}
          <div className={styles.heroOrb} aria-hidden="true" />

          <div className={styles.heroContent}>
            {/* Eyebrow chip */}
            <div className={styles.eyebrow}>
              <Target size={14} aria-hidden="true" /> Class 10 · Board Exam
            </div>

            <h1 className={styles.heroTitle}>Board Exam Preparation</h1>

            <p className={styles.heroSubtitle}>
              Structured CBSE Class 10 revision. Master every available subject
              chapter-by-chapter and walk into board exams fully prepared.
            </p>

            {/* Stats bar with dividers between items */}
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
                <span className={styles.statLabel}>Board Questions</span>
              </div>

              <div className={styles.statDivider} aria-hidden="true" />

              <div className={styles.statItem}>
                <span className={styles.statValue}>60 Days</span>
                <span className={styles.statLabel}>Revision Plan</span>
              </div>

              {/* Light: Reflection and Refraction */}
              <Link 
                href="/class-10/light-reflection-and-refraction"
                className={styles.chapterCard}
                style={{ textDecoration: 'none' }}
              >
                <div className={styles.chapterContent}>
                  <div className={styles.chapterHeader}>
                    <div className={styles.chapterIconWrapper} style={{ backgroundColor: 'rgba(0, 255, 204, 0.1)', color: '#00ffcc' }}>
                      <Lightbulb size={24} />
                    </div>
                    <div className={styles.chapterMeta}>
                      <span className={styles.chapterLabel}>Chapter 10</span>
                      <span className={styles.chapterTime}>Estimated: 4h</span>
                    </div>
                  </div>
                  <h3 className={styles.chapterTitle}>Light - Reflection and Refraction</h3>
                  <p className={styles.chapterDesc}>
                    Master spherical mirrors, lenses, Snell's law, and interactive ray tracing.
                  </p>
                  
                  <div className={styles.progressSection}>
                    <div className={styles.progressHeader}>
                      <span className={styles.progressText}>Mastery Level</span>
                      <span className={styles.progressPercent}>0%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill} 
                        style={{ width: '0%', backgroundColor: '#00ffcc' }}
                      />
                    </div>
                  </div>
                </div>
                <div 
                  className={styles.chapterHoverEffect} 
                  style={{ background: 'linear-gradient(45deg, transparent, rgba(0, 255, 204, 0.1), transparent)' }}
                />
              </Link>
            </div>
          </div>
        </div>

        {/* ==================== SUBJECT GRID ==================== */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Your Subjects</h2>
          <p className={styles.sectionSubtitle}>
            Board-focused plans for every active subject. Each chapter builds on the last,
            with timed practice questions after every session.
          </p>
        </div>

        <div className={styles.subjectGrid}>
          {subjects.map((subject) => {
            const SubjectIcon = resolveCurriculumIcon(subject.iconName);
            const iconClass = ICON_STYLE_BY_SUBJECT[subject.id] ?? "iconAmber";

            return (
              <Link
                key={subject.id}
                href={`/class-10/${subject.id}`}
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
            <h2 className={styles.sectionTitle}>Why LearnVeda for Class 10?</h2>
            <p className={styles.sectionSubtitle}>
              Board exams reward consistency and strategy. LearnVeda provides both.
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
