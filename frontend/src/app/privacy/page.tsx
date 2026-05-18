/**
 * FILE: page.tsx
 * LOCATION: src/app/privacy/page.tsx
 * PURPOSE: Privacy policy page covering student data, session cookies, and MVP
 *          data handling expectations.
 * USED BY: Footer legal links
 * DEPENDENCIES: Privacy.module.css
 * LAST UPDATED: 2026-05-11
 */

import styles from "./Privacy.module.css";

export const metadata = {
  title: "Privacy Policy",
  description: "EduQuest privacy policy for student accounts, sessions, learning progress, and safety data.",
};

/** Public privacy policy page. */
export default function PrivacyPage() {
  return (
    <article className={styles.page}>
      <span className={styles.kicker}>Privacy</span>
      <h1>Privacy Policy</h1>
      <p>EduQuest collects only the account and learning information needed to run the platform responsibly.</p>
      <h2>Account Data</h2>
      <p>Email, name, selected learning track, session state, and progress metrics are used to personalize learning.</p>
      <h2>Security</h2>
      <p>Passwords are hashed on the server, sessions use httpOnly cookies, and sensitive APIs are rate-limited.</p>
      <h2>Future Production Storage</h2>
      <p>The MVP uses a development adapter. Production should move user data into a managed database with backups and access controls.</p>
    </article>
  );
}
