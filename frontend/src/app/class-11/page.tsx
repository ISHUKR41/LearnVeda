/**
 * FILE: page.tsx
 * LOCATION: src/app/class-11/page.tsx
 * PURPOSE: Server route shell for the Class 11 landing page.
 * USED BY: Next.js App Router — renders at "/class-11"
 * DEPENDENCIES: Class11StreamSelector, lucide-react, Class11.module.css
 * LAST UPDATED: 2026-05-17
 */

import { GraduationCap } from "lucide-react";
import Class11StreamSelector from "./Class11StreamSelector";
import styles from "./Class11.module.css";

export const metadata = {
  title: "Class 11 — Choose Your Stream",
  description: "Choose a Class 11 stream and open subject-wise learning plans.",
};

export default function Class11Page() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.hero}>
          <div className={styles.eyebrow}>
            <GraduationCap size={14} /> Class 11
          </div>
          <h1 className={styles.heroTitle}>Choose Your Stream</h1>
          <p className={styles.heroSubtitle}>
            Deep learning in your chosen stream — Science, Commerce, or Arts. Specialized plans tailored for your academic path.
          </p>
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>3</span>
              <span className={styles.statLabel}>Streams</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>5-6</span>
              <span className={styles.statLabel}>Subjects per stream</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>18</span>
              <span className={styles.statLabel}>Total Subjects</span>
            </div>
          </div>
        </div>

        <Class11StreamSelector />
      </div>
    </div>
  );
}
