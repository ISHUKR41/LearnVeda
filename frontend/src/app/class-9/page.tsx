/**
 * FILE: page.tsx
 * LOCATION: src/app/class-9/page.tsx
 * PURPOSE: Class 9 landing page — displays subjects available for Class 9 students.
 * USED BY: Next.js App Router — renders at "/class-9"
 * DEPENDENCIES: next/link, lucide-react, Class9.module.css
 * LAST UPDATED: 2026-05-17
 */

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
} from "lucide-react";
import styles from "./Class9.module.css";
import { getTrackSubjects } from "@/lib/server/data/subject-plans";
import { resolveCurriculumIcon } from "@/lib/ui/lucide-icon-map";

export const metadata = {
  title: "Class 9 — All Subjects",
  description: "CBSE Class 9 complete learning path — Mathematics, Science, Social Science, English, Hindi, and more.",
};

const ICON_STYLE_BY_SUBJECT: Record<string, string> = {
  mathematics: "iconBlue",
  science: "iconGreen",
  "social-science": "iconViolet",
  english: "iconAmber",
  hindi: "iconRed",
  "computer-applications": "iconCyan",
};

export default async function Class9Page() {
  const subjects = await getTrackSubjects("class-9");
  const totalChapters = subjects.reduce((total, subject) => total + subject.chapterCount, 0);
  const totalQuestions = subjects.reduce((total, subject) => total + subject.chapterCount * 20, 0);

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.hero}>
          <div className={styles.eyebrow}>
            <BookOpen size={14} /> Class 9
          </div>
          <h1 className={styles.heroTitle}>Master the Fundamentals</h1>
          <p className={styles.heroSubtitle}>
            Build a rock-solid foundation across all subjects. Master the basics that everything else builds upon.
          </p>
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{SUBJECTS.length}</span>
              <span className={styles.statValue}>{subjects.length}</span>
              <span className={styles.statLabel}>Subjects</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{totalChapters}+</span>
              <span className={styles.statLabel}>Chapters</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{totalQuestions.toLocaleString()}+</span>
              <span className={styles.statLabel}>Practice Questions</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>45 Days</span>
              <span className={styles.statLabel}>To Complete</span>
            </div>
          </div>
        </div>

        <h2 className={styles.sectionTitle}>Your Curriculum</h2>
        
        <div className={styles.subjectGrid}>
          {subjects.map((subject) => {
            const SubjectIcon = resolveCurriculumIcon(subject.iconName);
            const iconClass = ICON_STYLE_BY_SUBJECT[subject.id] ?? "iconBlue";

            return (
            <Link key={s.id} href={`/class-9/${s.id}`} className={styles.subjectCard}>
              <div className={styles.cardHeader}>
                <div className={`${styles.subjectIcon} ${styles[iconClass]}`}>
                  <SubjectIcon size={22} />
                </div>
                <h3 className={styles.subjectName}>{subject.name}</h3>
              </div>
              <p className={styles.subjectDesc}>{subject.description}</p>
              <div className={styles.cardFooter}>
                <span className={styles.chapterCount}>{subject.chapterCount} Chapters</span>
                <span className={styles.startBtn}>Start Learning <ArrowRight size={14} /></span>
              </div>
            </Link>
          );
          })}
        </div>

        <div className={styles.infoSection}>
          <h2 className={styles.sectionTitle}>Why Class 9?</h2>
          <p className={styles.infoText}>
            Class 9 is the foundation year for your board exams. The concepts you learn here will directly impact your performance in Class 10. Stay consistent, practice daily, and focus on understanding rather than memorizing.
          </p>
        </div>
      </div>
    </div>
  );
}
