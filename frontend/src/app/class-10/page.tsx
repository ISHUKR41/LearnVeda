/**
 * FILE: page.tsx
 * LOCATION: src/app/class-10/page.tsx
 * PURPOSE: Class 10 landing page — board exam focused, all subjects.
 * USED BY: Next.js App Router — renders at "/class-10"
 * DEPENDENCIES: next/link, lucide-react, Class10.module.css
 * LAST UPDATED: 2026-05-17
 */

import Link from "next/link";
import { BookOpen, Calculator, FlaskConical, Globe, Languages, ArrowRight, Target } from "lucide-react";
import styles from "./Class10.module.css";

export const metadata = {
  title: "Class 10 — Board Exam Preparation",
  description: "CBSE Class 10 complete board exam preparation — Maths, Science, Social Science, English.",
};

/* Subject definitions — iconClass maps to a color variant in Class10.module.css */
const SUBJECTS = [
  { id: "mathematics-standard", name: "Maths Standard", icon: Calculator, chapters: 15, desc: "Board-focused standard mathematics practice with timed revision.", iconClass: "iconBlue" },
  { id: "mathematics-basic", name: "Maths Basic", icon: Calculator, chapters: 15, desc: "Concept-first mathematics plan for confident board exam performance.", iconClass: "iconIndigo" },
  { id: "science", name: "Science", icon: FlaskConical, chapters: 16, desc: "Chemistry, physics, and biology revision mapped to board-style practice.", iconClass: "iconGreen" },
  { id: "social-science", name: "Social Science", icon: Globe, chapters: 20, desc: "High-retention history, civics, geography, and economics revision.", iconClass: "iconViolet" },
  { id: "english", name: "English", icon: BookOpen, chapters: 12, desc: "Literature, writing, and grammar preparation with scoring practice.", iconClass: "iconAmber" },
  { id: "hindi", name: "Hindi", icon: Languages, chapters: 12, desc: "Chapter-wise Hindi literature and grammar support for board preparation.", iconClass: "iconRed" },
];

export default function Class10Page() {
  const totalChapters = SUBJECTS.reduce((a, b) => a + b.chapters, 0);

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.hero}>
          <div className={styles.eyebrow}>
            <Target size={14} /> Class 10
          </div>
          <h1 className={styles.heroTitle}>Board Exam Preparation</h1>
          <p className={styles.heroSubtitle}>
            Structured revision for Class 10 CBSE Board Exams. Master your syllabus and ace your tests.
          </p>
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>6</span>
              <span className={styles.statLabel}>Subjects</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{totalChapters}+</span>
              <span className={styles.statLabel}>Chapters</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>1000+</span>
              <span className={styles.statLabel}>Board Questions</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>60 Days</span>
              <span className={styles.statLabel}>Revision Plan</span>
            </div>
          </div>
        </div>

        <h2 className={styles.sectionTitle}>Your Subjects</h2>
        
        <div className={styles.subjectGrid}>
          {SUBJECTS.map((s) => (
            <Link key={s.id} href={`/class-10/${s.id}`} className={styles.subjectCard}>
              <div className={styles.cardHeader}>
                <div className={`${styles.subjectIcon} ${styles[s.iconClass]}`}>
                  <s.icon size={22} />
                </div>
                <h3 className={styles.subjectName}>{s.name}</h3>
              </div>
              <p className={styles.subjectDesc}>{s.desc}</p>
              <div className={styles.cardFooter}>
                <span className={styles.chapterCount}>{s.chapters} Chapters</span>
                <span className={styles.startBtn}>Start Revision <ArrowRight size={14} /></span>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.calloutSection}>
          <h2 className={styles.sectionTitle}>Board Exam Tips</h2>
          <p className={styles.calloutText}>
            Board exams require strategy. Focus on previous year questions (PYQs), time management, and presentation of answers. Follow the 60-day revision plan provided in each subject to ensure complete coverage.
          </p>
        </div>
      </div>
    </div>
  );
}
