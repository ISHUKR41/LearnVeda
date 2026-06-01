/**
 * FILE: page.tsx
 * LOCATION: src/app/privacy/page.tsx
 * PURPOSE: Professional privacy policy page for account, learning progress,
 *          analytics, security, and student safety data handling.
 * USED BY: Footer legal links and sign-up consent copy
 * DEPENDENCIES: lucide-react, Privacy.module.css
 * LAST UPDATED: 2026-06-01
 */

import {
  Activity,
  BarChart3,
  Clock,
  Cookie,
  Database,
  FileCheck2,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import styles from "./Privacy.module.css";

export const metadata = {
  title: "Privacy Policy | EduQuest",
  description:
    "How EduQuest protects student accounts, Clerk authentication sessions, learning progress, dashboard metrics, and support requests.",
};

const DATA_GROUPS = [
  {
    icon: UserRound,
    title: "Account identity",
    body: "Name, email, profile image, and authentication identifiers are used to keep each learner signed in, synced, and protected.",
  },
  {
    icon: BarChart3,
    title: "Learning progress",
    body: "Correct answers, XP, level milestones, streaks, stars, ranks, and chapter completion are stored so the dashboard can stay accurate for every user.",
  },
  {
    icon: Activity,
    title: "Platform activity",
    body: "Study sessions, battle participation, quick actions, and recent activity help personalize the product and prevent abuse.",
  },
  {
    icon: Mail,
    title: "Support messages",
    body: "Contact form details are used only to respond to student, parent, school, or partnership requests.",
  },
];

const POLICY_SECTIONS = [
  {
    icon: KeyRound,
    title: "Authentication",
    body: "EduQuest uses Clerk for sign-in, sign-up, session checks, and social login support. Passwords and OAuth credentials are handled by the authentication provider, not exposed in the browser.",
  },
  {
    icon: Cookie,
    title: "Cookies and sessions",
    body: "Session cookies keep learners signed in and help route protected study pages correctly. Removing cookies may sign the user out or require a fresh login.",
  },
  {
    icon: Database,
    title: "Storage and database records",
    body: "Production records are stored in managed database tables for users, progress, answers, streaks, wallet activity, and contact requests. Access should be limited to trusted administrators.",
  },
  {
    icon: LockKeyhole,
    title: "Security controls",
    body: "Protected APIs require an authenticated user, sensitive writes are tied to the current account, and dashboard totals are calculated from server-side records.",
  },
  {
    icon: Clock,
    title: "Retention",
    body: "Learning records are kept while an account is active so progress, levels, and streaks are not lost. Support messages are retained only as long as needed for service and safety.",
  },
  {
    icon: FileCheck2,
    title: "Student and parent choices",
    body: "Users can sign out, avoid optional community features, and request account or support-data review through the contact page.",
  },
];

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <ShieldCheck size={16} aria-hidden="true" />
          Privacy first learning
        </div>
        <h1>Privacy Policy</h1>
        <p>
          EduQuest collects only the account, learning, security, and support
          information needed to run a safe gamified education platform.
        </p>
      </section>

      <section className={styles.summaryBand} aria-label="Privacy summary">
        <div>
          <span>Last updated</span>
          <strong>June 1, 2026</strong>
        </div>
        <div>
          <span>Authentication</span>
          <strong>Clerk sessions</strong>
        </div>
        <div>
          <span>Primary use</span>
          <strong>Learning progress</strong>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span>Data We Use</span>
          <h2>Only what the product needs to work</h2>
        </div>
        <div className={styles.grid}>
          {DATA_GROUPS.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className={styles.card}>
                <Icon size={20} aria-hidden="true" />
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span>Controls</span>
          <h2>How privacy is handled across EduQuest</h2>
        </div>
        <div className={styles.policyList}>
          {POLICY_SECTIONS.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className={styles.policyItem}>
                <div className={styles.policyIcon}>
                  <Icon size={18} aria-hidden="true" />
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.note}>
        <h2>Contact and requests</h2>
        <p>
          For privacy questions, account review, or data correction requests,
          use the Contact page and include the email address connected to the
          EduQuest account.
        </p>
      </section>
    </main>
  );
}
