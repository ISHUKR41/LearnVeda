/**
 * FILE: page.tsx
 * LOCATION: src/app/terms/page.tsx
 * PURPOSE: Comprehensive, professional Terms of Service for VidyaBolt.
 *          Covers eligibility, account security, learning integrity, battle rules,
 *          community conduct, IP, disclaimers, liability limits, governing law.
 * LAST UPDATED: 2026-06-01
 */

import Link from "next/link";
import {
  BadgeCheck,
  BookOpenCheck,
  CircleAlert,
  FileText,
  GraduationCap,
  LockKeyhole,
  Medal,
  Scale,
  Shield,
  Sparkles,
  Swords,
  UserCheck,
} from "lucide-react";
import styles from "./Terms.module.css";

export const metadata = {
  title: "Terms of Service | VidyaBolt",
  description:
    "VidyaBolt Terms of Service — covering eligibility, account security, learning integrity, battle rules, community conduct, intellectual property, disclaimers, and governing law (India).",
};

const TERM_CARDS = [
  {
    icon: UserCheck,
    title: "Account Responsibility",
    body: "You are responsible for keeping your account credentials private. Do not share login details or allow others to use your account. Sign out from shared or public devices after every session. Suspicious activity should be reported immediately to support@vidyabolt.in.",
  },
  {
    icon: BookOpenCheck,
    title: "Learning Integrity",
    body: "Answer all questions honestly using your own knowledge. XP, levels, ranks, streaks, and stars are designed to reflect genuine learning progress. Automated answer tools, scripts, or any mechanism that bypasses honest engagement is strictly prohibited.",
  },
  {
    icon: Swords,
    title: "Battle Arena Rules",
    body: "Battles are skill-based academic competitions. They are not gambling, wagering, or financial contests of any kind. No real money is staked, won, or lost. Anti-cheat systems monitor for tab switching, automated inputs, and pattern abuse during matches.",
  },
  {
    icon: Shield,
    title: "Respectful Conduct",
    body: "Treat every learner with respect. Harassment, bullying, hate speech, or discriminatory language directed at any user — in community posts, battle chat, or any other feature — will result in immediate account suspension.",
  },
];

const DETAIL_SECTIONS = [
  {
    icon: GraduationCap,
    title: "Eligibility & Age Requirements",
    body: "VidyaBolt is designed for students aged 14 and above (Class 9 and higher). Users under 18 must have parental or guardian consent. By creating an account, you represent that you meet the age requirement or that a parent/guardian has approved your use. VidyaBolt reserves the right to request verification and to suspend accounts that do not comply.",
  },
  {
    icon: LockKeyhole,
    title: "Authentication & Protected Access",
    body: "Certain features — dashboards, wallets, battle arenas, achievements, and community posting — require a valid Clerk authentication session. If your session expires, VidyaBolt will prompt you to sign in again. Attempting to access protected API routes without authentication or to forge session tokens is a violation of these Terms and applicable law.",
  },
  {
    icon: Medal,
    title: "XP, Levels, Streaks & Rewards",
    body: "Gamification values (XP, levels, streaks, stars, ranks, battle records) are learning progress indicators — they hold no real-world monetary value, are non-transferable, and cannot be exchanged for cash. VidyaBolt may correct, adjust, or reset these values if errors, duplicate submissions, bugs, or policy violations result in inaccurate data.",
  },
  {
    icon: CircleAlert,
    title: "Acceptable Use Policy",
    body: "You agree not to: scrape or harvest content from VidyaBolt without written permission, send spam through the Contact or Community features, attack authentication flows or attempt SQL injection, reverse-engineer the platform, automate answers to artificially inflate scores, or use VidyaBolt in any manner that harms other users or disrupts platform operations.",
  },
  {
    icon: FileText,
    title: "Intellectual Property",
    body: "All VidyaBolt content — including chapter notes, practice questions, simulation code, UI designs, brand assets, and platform software — is owned by VidyaBolt or its licensors. Students retain ownership of their answers and community posts. You may use VidyaBolt content solely for personal, non-commercial learning purposes. Reproducing or redistributing VidyaBolt content without permission is prohibited.",
  },
  {
    icon: Sparkles,
    title: "Community & User Content",
    body: "When you post in community forums, you grant VidyaBolt a non-exclusive, royalty-free licence to display that content on the platform. You are responsible for ensuring your posts do not infringe third-party intellectual property, contain false information, or violate these Terms. VidyaBolt may remove content that violates community standards without prior notice.",
  },
  {
    icon: Scale,
    title: "Disclaimers of Warranties",
    body: "VidyaBolt is provided 'as is' and 'as available' without warranties of any kind, express or implied. We do not warrant that the platform will be error-free, uninterrupted, or free of viruses. Educational content is aligned to CBSE/NCERT syllabi to the best of our knowledge but should be verified against official textbooks for board examinations.",
  },
  {
    icon: CircleAlert,
    title: "Limitation of Liability",
    body: "To the maximum extent permitted by Indian law, VidyaBolt's aggregate liability for any claim arising from your use of the platform is limited to INR 1,000 or the amount you paid VidyaBolt in the 12 months preceding the claim, whichever is lower. VidyaBolt is not liable for indirect, consequential, or punitive damages of any kind.",
  },
  {
    icon: Scale,
    title: "Platform Changes & Availability",
    body: "Features, simulations, practice questions, dashboards, and reward structures may evolve as VidyaBolt improves. We aim to preserve genuine learning progress when systems are updated. Planned maintenance will be communicated in advance where possible. VidyaBolt does not guarantee uninterrupted availability and is not liable for temporary outages.",
  },
  {
    icon: FileText,
    title: "Governing Law & Dispute Resolution",
    body: "These Terms are governed by the laws of India. Any disputes arising from your use of VidyaBolt shall first be attempted to be resolved amicably through our support team. If unresolved within 30 days, disputes shall be subject to the exclusive jurisdiction of the courts in New Delhi, India. For consumer disputes, you may also approach the Consumer Disputes Redressal Commission.",
  },
];

export default function TermsPage() {
  return (
    <main className={styles.page}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <GraduationCap size={16} aria-hidden="true" />
          Student-first platform rules
        </div>
        <h1>Terms of Service</h1>
        <p>
          VidyaBolt is a learning platform built for structured study, physics simulations,
          practice questions, dashboards, and fair academic competition. These terms keep
          the platform safe, honest, and genuinely useful for every learner. By using
          VidyaBolt, you agree to these terms.
        </p>
      </section>

      {/* ── STATUS BAND ── */}
      <section className={styles.statusBand} aria-label="Terms summary">
        <BadgeCheck size={22} aria-hidden="true" />
        <div>
          <strong>Effective June 1, 2026</strong>
          <span>
            Use VidyaBolt for genuine academic study, respectful peer competition,
            and honest progress tracking. Governed by the laws of India.
          </span>
        </div>
      </section>

      {/* ── CORE TERMS ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span>Core Terms</span>
          <h2>What every learner agrees to</h2>
        </div>
        <div className={styles.grid}>
          {TERM_CARDS.map((item) => {
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

      {/* ── DETAILED SECTIONS ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span>Full Terms</span>
          <h2>Detailed platform usage terms</h2>
        </div>
        <div className={styles.detailList}>
          {DETAIL_SECTIONS.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className={styles.detailItem}>
                <div className={styles.detailIcon}>
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

      {/* ── AMENDMENTS NOTE ── */}
      <section className={styles.notice}>
        <h2>Amendments & questions</h2>
        <p>
          VidyaBolt may update these Terms as the platform evolves. Material changes
          will be communicated via dashboard notification or email at least 7 days before
          taking effect. Continued use of VidyaBolt after the effective date constitutes
          acceptance of the updated Terms.
          <br /><br />
          For questions about these Terms, contact us at{" "}
          <a href="mailto:legal@vidyabolt.in" style={{ color: "var(--color-primary)" }}>
            legal@vidyabolt.in
          </a>{" "}
          or visit the{" "}
          <Link href="/contact" style={{ color: "var(--color-primary)" }}>
            Contact page
          </Link>
          . Our{" "}
          <Link href="/privacy" style={{ color: "var(--color-primary)" }}>
            Privacy Policy
          </Link>{" "}
          explains how your data is collected and protected.
        </p>
      </section>

    </main>
  );
}
