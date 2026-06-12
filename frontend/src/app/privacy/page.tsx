/**
 * FILE: page.tsx
 * LOCATION: src/app/privacy/page.tsx
 * PURPOSE: Comprehensive, professional privacy policy for Learnova.
 *          Covers data collection, third-party services, DPDP Act 2023,
 *          user rights, cookies, retention, security, and contact.
 * LAST UPDATED: 2026-06-01
 */

import Link from "next/link";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Clock,
  Cookie,
  Database,
  FileCheck2,
  Globe2,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
  Users,
  Zap,
} from "lucide-react";
import styles from "./Privacy.module.css";

export const metadata = {
  title: "Privacy Policy | Learnova",
  description:
    "How Learnova collects, uses, stores, and protects student data — including accounts, learning progress, authentication sessions, analytics, and contact requests. Updated June 2026.",
};

const DATA_GROUPS = [
  {
    icon: UserRound,
    title: "Account Identity",
    body: "Your name, email address, profile image, and Clerk authentication identifiers are collected when you create an account or sign in with Google. These are required to personalise your dashboard, keep you signed in, and protect your learning records from unauthorised access.",
  },
  {
    icon: BarChart3,
    title: "Learning Progress",
    body: "Answers submitted, correct counts, chapter scores, XP earned, level milestones, streaks, stars collected, ranks, and battle outcomes are stored permanently. This data powers your dashboard, activity graph, achievements, and leaderboard standing.",
  },
  {
    icon: Activity,
    title: "Platform Activity",
    body: "Study sessions, daily active dates, community posts, event registrations, and quick-action clicks are logged to improve your experience and prevent abuse of the gamification system.",
  },
  {
    icon: Mail,
    title: "Support & Contact",
    body: "Name, email, subject, and message from the Contact form are stored only to allow us to respond to student, parent, school, and partnership enquiries. Support records are retained for up to 24 months.",
  },
];

const THIRD_PARTY_SERVICES = [
  {
    name: "Clerk",
    role: "Authentication & session management",
    data: "Email, display name, OAuth tokens, signed session JWTs",
    policy: "https://clerk.com/privacy",
  },
  {
    name: "Neon (PostgreSQL)",
    role: "Managed database hosting",
    data: "All user, progress, wallet, activity, and contact records",
    policy: "https://neon.tech/privacy",
  },
  {
    name: "Replit / Vercel",
    role: "Application hosting & edge delivery",
    data: "Request logs, IP addresses (anonymised after 30 days), edge cache hits",
    policy: "https://replit.com/privacy",
  },
];

const POLICY_SECTIONS = [
  {
    icon: KeyRound,
    title: "Authentication & Sessions",
    body: "Learnova uses Clerk for all sign-in, sign-up, session validation, and social login flows. Passwords and OAuth credentials are handled entirely by Clerk — they are never stored in our database. Clerk sessions are validated server-side before any protected API endpoint returns data. If a session expires, Clerk will prompt re-authentication.",
  },
  {
    icon: Cookie,
    title: "Cookies & Local Storage",
    body: "Clerk places a secure, HttpOnly session cookie to keep you signed in between visits. Learnova may store non-sensitive UI preferences (theme, sidebar state) in localStorage. No advertising cookies, cross-site tracking cookies, or fingerprinting scripts are used. Clearing cookies will sign you out and may reset interface preferences.",
  },
  {
    icon: Database,
    title: "Data Storage & Security",
    body: "All records are stored in a managed PostgreSQL database with restricted access. Tables include: eduquest_users, eduquest_user_progress_slug, eduquest_daily_streaks, eduquest_wallet, eduquest_wallet_transactions, and eduquest_achievements. Database credentials are stored as encrypted environment secrets and are never exposed to client-side code.",
  },
  {
    icon: LockKeyhole,
    title: "Security Controls",
    body: "Every protected API route validates a Clerk session before returning any user-specific data. Wallet writes, progress updates, and achievement unlocks are bound exclusively to the authenticated user's ID. HTTPS is enforced on all connections. Rate limiting and server-side validation prevent abuse of the scoring system.",
  },
  {
    icon: Globe2,
    title: "International Data Transfers",
    body: "Learnova is headquartered in India and primarily serves Indian students. Data may be stored on servers in the United States or Europe via hosting and database providers. By using Learnova, you acknowledge this transfer. We require our providers to maintain adequate data protection standards equivalent to those required under Indian law.",
  },
  {
    icon: Users,
    title: "Students Under 18 & Children",
    body: "Learnova serves students aged 14 and above (Class 9 and higher). Students under 18 should have parental or guardian consent before registering. We do not knowingly collect personal data from children under 13. If you believe a child under 13 has created an account, contact us immediately at privacy@learnova.in for removal.",
  },
  {
    icon: Clock,
    title: "Data Retention",
    body: "Learning records, XP, levels, streaks, and wallet balances are retained for the lifetime of your active account so your progress is never lost. Support messages are kept for up to 24 months. Activity logs are retained for 12 months for fraud prevention. Upon account deletion, associated personal data is purged within 30 days, except where legally required.",
  },
  {
    icon: FileCheck2,
    title: "Your Rights Under DPDP Act 2023",
    body: "Under India's Digital Personal Data Protection Act 2023, you have the right to: access the personal data we hold, correct inaccurate information, request erasure of your data (subject to legal retention obligations), withdraw consent for optional data processing, nominate a representative, and file complaints with the Data Protection Board. Submit all requests through our Contact page.",
  },
  {
    icon: Zap,
    title: "How We Use Your Data",
    body: "Your data is used exclusively to: (1) provide and improve the Learnova learning platform, (2) personalise your dashboard and study recommendations, (3) maintain fair competition in battles and leaderboards, (4) send account-related notifications — never unsolicited marketing without consent, and (5) detect and prevent fraud, cheating, or abuse.",
  },
  {
    icon: CheckCircle2,
    title: "Data Sharing Policy",
    body: "We do not sell, rent, or trade your personal data to any third party. Data is shared only with the service providers listed above, strictly to operate the platform. Aggregated, fully anonymised statistics (e.g. total registered students) may appear in public reports without identifying any individual. Law enforcement requests are handled only when legally compelled.",
  },
];

export default function PrivacyPage() {
  return (
    <main className={styles.page}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <ShieldCheck size={16} aria-hidden="true" />
          Privacy-first learning platform
        </div>
        <h1>Privacy Policy</h1>
        <p>
          Learnova is built for students. We collect only what is necessary to run
          a safe, gamified education platform — and we never sell your data.
          This policy explains exactly what we collect, why, and how it is protected.
        </p>
      </section>

      {/* ── SUMMARY BAND ── */}
      <section className={styles.summaryBand} aria-label="Privacy summary">
        <div>
          <span>Last updated</span>
          <strong>June 1, 2026</strong>
        </div>
        <div>
          <span>Authentication</span>
          <strong>Clerk sessions (JWT)</strong>
        </div>
        <div>
          <span>Governing law</span>
          <strong>DPDP Act, India 2023</strong>
        </div>
      </section>

      {/* ── DATA WE COLLECT ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span>Data We Collect</span>
          <h2>Only what the product needs to function</h2>
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

      {/* ── THIRD-PARTY SERVICES ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span>Third-Party Services</span>
          <h2>Partners that help run Learnova</h2>
        </div>
        <div className={styles.policyList}>
          {THIRD_PARTY_SERVICES.map((svc) => (
            <article key={svc.name} className={styles.policyItem}>
              <div className={styles.policyIcon}>
                <Database size={18} aria-hidden="true" />
              </div>
              <div>
                <h3>
                  {svc.name}
                  {" "}
                  <span style={{ color: "var(--color-text-tertiary)", fontWeight: 400, fontSize: "0.85em" }}>
                    — {svc.role}
                  </span>
                </h3>
                <p>
                  <strong>Data shared:</strong> {svc.data}
                  {" · "}
                  <a
                    href={svc.policy}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--color-primary)" }}
                  >
                    View their privacy policy ↗
                  </a>
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── FULL POLICY SECTIONS ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span>Full Policy</span>
          <h2>How your privacy is protected across Learnova</h2>
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

      {/* ── CONTACT NOTE ── */}
      <section className={styles.note}>
        <h2>Privacy requests & contact</h2>
        <p>
          For data access, correction, deletion requests, or any privacy concern,
          email{" "}
          <a href="mailto:privacy@learnova.in" style={{ color: "var(--color-primary)" }}>
            privacy@learnova.in
          </a>{" "}
          or use the{" "}
          <Link href="/contact" style={{ color: "var(--color-primary)" }}>
            Contact page
          </Link>
          . Include the email address associated with your Learnova account.
          We respond to all privacy requests within 7 business days.
          You may also contact us at:{" "}
          <strong>Learnova Academic Pvt Ltd, New Delhi, India 110001.</strong>
        </p>
      </section>

    </main>
  );
}
