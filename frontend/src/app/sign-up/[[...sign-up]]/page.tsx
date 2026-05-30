/**
 * FILE: page.tsx
 * LOCATION: src/app/sign-up/[[...sign-up]]/page.tsx
 * PURPOSE: Registration page using Clerk's hosted SignUp component.
 * DEPENDENCIES: @clerk/nextjs, SignUp.module.css
 */

import { SignUp } from "@clerk/nextjs";
import styles from "../SignUp.module.css";

export const metadata = {
  title: "Create Account – EduQuest",
  description: "Join EduQuest free and start your gamified learning journey today.",
};

export default function SignUpPage() {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        {/* Left branding panel */}
        <div className={styles.panel}>
          <div className={styles.panelBadge}>⚡ Start Free</div>
          <div className={styles.panelBody}>
            <h2 className={styles.panelHeading}>
              Join 50,000+ Students on EduQuest
            </h2>
            <p className={styles.panelSubtext}>
              Create your free account in seconds. Get access to CBSE Class 9–12
              study plans, live battle quizzes, and a global leaderboard.
            </p>
            <ul className={styles.featureList}>
              <li>✓ Day-wise structured study plans</li>
              <li>✓ Real-time quiz battles</li>
              <li>✓ XP, streaks &amp; achievements</li>
              <li>✓ 1200+ practice questions</li>
            </ul>
          </div>
        </div>

        {/* Clerk sign-up widget */}
        <div className={styles.formPanel}>
          <SignUp
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
