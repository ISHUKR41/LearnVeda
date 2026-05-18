/**
 * FILE: page.tsx
 * LOCATION: src/app/class-12/page.tsx
 * PURPOSE: Server route shell for the Class 12 landing page.
 * USED BY: Next.js App Router — renders at "/class-12"
 * DEPENDENCIES: Class12StreamSelector, lucide-react, Class12.module.css
 * LAST UPDATED: 2026-05-17
 */

import { GraduationCap } from "lucide-react";
import Class12StreamSelector from "./Class12StreamSelector";
import styles from "./Class12.module.css";

export const metadata = {
  title: "Class 12 — Board & Entrance Exam Prep",
  description: "Choose a Class 12 stream and open exam-focused learning plans.",
};

export default function Class12Page() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.hero}>
          <div className={styles.eyebrow}>
            <GraduationCap size={14} /> Class 12
          </div>
          <h1 className={styles.heroTitle}>Board & Entrance Prep</h1>
          <p className={styles.heroSubtitle}>
            Master board exams and ace entrance tests with structured revision and mock tests. Specialized plans for JEE, NEET, and board exams.
          </p>
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>3</span>
              <span className={styles.statLabel}>Streams</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>100+</span>
              <span className={styles.statLabel}>Mock Tests</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>18</span>
              <span className={styles.statLabel}>Total Subjects</span>
            </div>
          </div>
        </div>

        <Class12StreamSelector />
      </div>
    </div>
  );
}
