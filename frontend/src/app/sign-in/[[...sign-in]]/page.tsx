/**
 * FILE: page.tsx
 * LOCATION: src/app/sign-in/[[...sign-in]]/page.tsx
 * PURPOSE: Sign-in page using Clerk's hosted UI component.
 *          The left panel provides EduQuest branding context;
 *          the right panel mounts Clerk's <SignIn /> widget.
 * DEPENDENCIES: @clerk/nextjs, SignIn.module.css
 */

import { SignIn } from "@clerk/nextjs";
import styles from "../SignIn.module.css";

export const metadata = {
  title: "Sign In – EduQuest",
  description: "Sign in to your EduQuest account and continue your learning journey.",
};

export default function SignInPage() {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        {/* Left branding panel */}
        <div className={styles.panel}>
          <div className={styles.panelBadge}>🎓 EduQuest</div>
          <div className={styles.panelBody}>
            <h2 className={styles.panelHeading}>
              India&apos;s #1 Gamified Learning Platform
            </h2>
            <p className={styles.panelSubtext}>
              Study smarter with day-wise plans, battle peers in real-time quizzes,
              earn XP, and climb the leaderboard.
            </p>
          </div>
          <div className={styles.panelStats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>50K+</span>
              <span className={styles.statLabel}>Students</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>1200+</span>
              <span className={styles.statLabel}>Questions</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>Class 9–12</span>
              <span className={styles.statLabel}>Coverage</span>
            </div>
          </div>
        </div>

        {/* Clerk sign-in widget */}
        <div className={styles.formPanel}>
          <SignIn
            appearance={{
              elements: {
                rootBox: { width: "100%" },
                card: {
                  background: "transparent",
                  boxShadow: "none",
                  border: "none",
                  padding: 0,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
