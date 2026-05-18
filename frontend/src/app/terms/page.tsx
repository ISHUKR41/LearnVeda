/**
 * FILE: page.tsx
 * LOCATION: src/app/terms/page.tsx
 * PURPOSE: Terms page for safe learning, account use, community behavior, and
 *          battle participation rules.
 * USED BY: Footer legal links and sign-up consent copy
 * DEPENDENCIES: Terms.module.css
 * LAST UPDATED: 2026-05-11
 */

import styles from "./Terms.module.css";

export const metadata = {
  title: "Terms of Service",
  description: "EduQuest terms for safe learning, respectful community participation, and account use.",
};

/** Public terms page for students and guardians. */
export default function TermsPage() {
  return (
    <article className={styles.page}>
      <span className={styles.kicker}>Terms</span>
      <h1>Terms of Service</h1>
      <p>EduQuest is a learning platform. Battles are skill practice, not wagering, gambling, or financial competition.</p>
      <h2>Student Conduct</h2>
      <p>Use respectful language, do your own work, and avoid cheating or disrupting other learners.</p>
      <h2>Accounts</h2>
      <p>Keep your account details private and sign out on shared devices.</p>
      <h2>Platform Changes</h2>
      <p>Features may evolve as the platform moves from MVP to production infrastructure.</p>
    </article>
  );
}
