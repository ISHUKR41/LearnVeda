import { SignIn } from "@clerk/nextjs";
import styles from "../SignIn.module.css";

export default function SignInPage() {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        {/* Left branding panel */}
        <div className={styles.panel}>
          <div className={styles.panelBadge}>🎓 EduQuest</div>
          <div className={styles.panelBody}>
            <h2 className={styles.panelTitle}>
              India&apos;s #1 Gamified Learning Platform
            </h2>
            <p className={styles.panelText}>
              Study smarter with day-wise plans, battle peers in real-time quizzes,
              earn XP, and climb the leaderboard.
            </p>
          </div>
          <div className={styles.panelStats}>
            <span>50K+ Students</span>
            <span>1200+ Questions</span>
            <span>Class 9–12</span>
          </div>
        </div>

        {/* Clerk sign-in widget */}
        <div className={styles.card}>
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            forceRedirectUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  );
}
