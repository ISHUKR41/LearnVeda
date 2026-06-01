/**
 * FILE: page.tsx
 * LOCATION: src/app/terms/page.tsx
 * PURPOSE: Professional terms page for safe learning, account use, battles,
 *          XP rewards, community conduct, and platform availability.
 * USED BY: Footer legal links and sign-up consent copy
 * DEPENDENCIES: lucide-react, Terms.module.css
 * LAST UPDATED: 2026-06-01
 */

import {
  BadgeCheck,
  BookOpenCheck,
  CircleAlert,
  GraduationCap,
  LockKeyhole,
  Medal,
  Scale,
  Shield,
  Swords,
  UserCheck,
} from "lucide-react";
import styles from "./Terms.module.css";

export const metadata = {
  title: "Terms of Service | EduQuest",
  description:
    "EduQuest terms for safe learning, Clerk-authenticated accounts, XP progression, battles, and respectful community participation.",
};

const TERM_CARDS = [
  {
    icon: UserCheck,
    title: "Account responsibility",
    body: "Use your own account, keep sessions private on shared devices, and sign out when you are finished.",
  },
  {
    icon: BookOpenCheck,
    title: "Learning integrity",
    body: "Answer questions honestly. XP, levels, rank, streaks, and stars are meant to reflect real learning progress.",
  },
  {
    icon: Swords,
    title: "Battle arena rules",
    body: "Battles are skill practice and healthy competition. They are not wagering, gambling, financial contests, or paid betting.",
  },
  {
    icon: Shield,
    title: "Safe conduct",
    body: "Respect other learners, avoid harassment, and do not attempt to disrupt lessons, dashboards, leaderboards, or APIs.",
  },
];

const DETAIL_SECTIONS = [
  {
    icon: LockKeyhole,
    title: "Authentication and access",
    body: "Some study pages, dashboards, wallets, battles, and community features require a valid Clerk session. If the session expires, EduQuest may ask the user to sign in again before continuing.",
  },
  {
    icon: Medal,
    title: "XP, levels, streaks, and rewards",
    body: "Gamification values are learning indicators. EduQuest may correct totals if duplicate submissions, abuse, or technical errors create inaccurate dashboard data.",
  },
  {
    icon: CircleAlert,
    title: "Fair-use restrictions",
    body: "Do not scrape content, spam contact forms, attack authentication flows, bypass protected routes, or automate answers in a way that damages the product for other users.",
  },
  {
    icon: Scale,
    title: "Platform changes",
    body: "Features, simulations, questions, dashboards, and rewards may evolve as the platform improves. EduQuest aims to preserve genuine learning progress when systems are updated.",
  },
];

export default function TermsPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <GraduationCap size={16} aria-hidden="true" />
          Student-first rules
        </div>
        <h1>Terms of Service</h1>
        <p>
          EduQuest is a learning platform for structured study, simulations,
          practice questions, dashboards, and fair competition. These terms keep
          the product safe, useful, and honest for every learner.
        </p>
      </section>

      <section className={styles.statusBand} aria-label="Terms summary">
        <BadgeCheck size={22} aria-hidden="true" />
        <div>
          <strong>Effective June 1, 2026</strong>
          <span>Use EduQuest for genuine study, respectful practice, and account-safe progress tracking.</span>
        </div>
      </section>

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

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span>Details</span>
          <h2>How the platform should be used</h2>
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

      <section className={styles.notice}>
        <h2>Questions or concerns</h2>
        <p>
          For account, safety, school, or policy questions, contact EduQuest
          through the Contact page with the email address linked to the account.
        </p>
      </section>
    </main>
  );
}
