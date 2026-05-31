/**
 * FILE: page.tsx
 * LOCATION: src/app/sign-in/[[...sign-in]]/page.tsx
 * PURPOSE: Sign-in page using Clerk's hosted SignIn widget.
 *          Uses fallbackRedirectUrl (NOT forceRedirectUrl) so that when the
 *          middleware redirects unauthenticated users from a protected page
 *          (e.g. /class-9/science/force-and-laws-of-motion) with a redirect_url
 *          query param, Clerk respects it and sends the user BACK to that page
 *          after sign-in. Falls back to /dashboard if no redirect_url present.
 *          This is the fix for the sign-in → dashboard → sign-in redirect loop.
 * LAST UPDATED: 2026-05-31
 */

import { SignIn } from "@clerk/nextjs";
import styles from "../SignIn.module.css";

export default function SignInPage() {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>

        {/* ── Left panel: EduQuest branding ── */}
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

        {/* ── Right panel: Clerk sign-in widget ── */}
        <div className={styles.card}>
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            fallbackRedirectUrl="/dashboard"
          />
        </div>

      </div>
    </div>
  );
}
