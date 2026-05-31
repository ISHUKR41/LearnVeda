/**
 * FILE: page.tsx
 * LOCATION: src/app/sign-up/[[...sign-up]]/page.tsx
 * PURPOSE: Sign-up page using Clerk's hosted SignUp widget.
 *          Uses fallbackRedirectUrl (NOT forceRedirectUrl) so Clerk can respect
 *          any redirect_url parameter set by the middleware.
 *          This prevents the sign-up → dashboard → sign-in loop.
 * LAST UPDATED: 2026-05-31
 */

import { SignUp } from "@clerk/nextjs";
import styles from "../SignUp.module.css";

export default function SignUpPage() {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>

        {/* ── Left panel: Feature highlights ── */}
        <div className={styles.promisePanel}>
          <div className={styles.promiseBadge}>⚡ Start Free</div>
          <div className={styles.promiseMid}>
            <div className={styles.promiseCard}>
              <div className={`${styles.promiseIcon} ${styles.blue}`}>⚡</div>
              <div>
                <p className={styles.promiseCardTitle}>Day-wise Study Plans</p>
                <p className={styles.promiseCardDesc}>Structured CBSE curriculum, topic by topic</p>
              </div>
            </div>
            <div className={styles.promiseCard}>
              <div className={`${styles.promiseIcon} ${styles.amber}`}>🏆</div>
              <div>
                <p className={styles.promiseCardTitle}>Live Quiz Battles</p>
                <p className={styles.promiseCardDesc}>Compete with peers in real-time MCQ battles</p>
              </div>
            </div>
            <div className={styles.promiseCard}>
              <div className={`${styles.promiseIcon} ${styles.green}`}>📚</div>
              <div>
                <p className={styles.promiseCardTitle}>1200+ Practice Questions</p>
                <p className={styles.promiseCardDesc}>MCQ, short, long, and HOTS coverage</p>
              </div>
            </div>
          </div>
          <div className={styles.promiseBottom}>
            <h2 className={styles.promiseTitle}>Join 50,000+ students on EduQuest</h2>
            <div className={styles.promiseList}>
              <span>✓ Free to start, no credit card needed</span>
              <span>✓ Class 9–12 CBSE + Engineering tracks</span>
              <span>✓ Global leaderboard ranking</span>
            </div>
          </div>
        </div>

        {/* ── Right panel: Clerk sign-up widget ── */}
        <div className={styles.card}>
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            fallbackRedirectUrl="/dashboard"
          />
        </div>

      </div>
    </div>
  );
}
