/**
 * FILE: page.tsx
 * LOCATION: src/app/class-12/page.tsx
 * PURPOSE: Class 12 landing page — board exam + entrance exam preparation.
 *          Combines board subject coverage with entrance-level depth for JEE/NEET/CUET.
 *          Stream selector is a dynamic client component; hero is server-rendered.
 * USED BY: Next.js App Router — renders at "/class-12"
 * DEPENDENCIES: next/dynamic, lucide-react, Class12.module.css
 * LAST UPDATED: 2026-05-18
 */

import dynamic from "next/dynamic";
import Image from "next/image";
import { GraduationCap, Award, Target, Shield, ChevronRight } from "lucide-react";
import Link from "next/link";
import styles from "./Class12.module.css";

/* ISR: Revalidate every hour — stream/subject list rarely changes */
export const revalidate = 3600;

export const metadata = {
  title: "Class 12 — Board & Entrance Exam Prep | EduQuest",
  description:
    "Complete Class 12 preparation: CBSE board exams + JEE/NEET/CUET entrance. Structured plans for all streams — Science, Commerce, and Arts.",
};

/*
 * Dynamic import: Class12StreamSelector is a "use client" component.
 * Loading it dynamically prevents server-side hydration mismatches.
 */
/*
 * Class12StreamSelector uses useState — it is a Client Component.
 * We omit `ssr: false` because this page is a Server Component (no "use client").
 * The loading fallback renders on the server; the real component hydrates on the client.
 */
const Class12StreamSelector = dynamic(() => import("./Class12StreamSelector"), {
  loading: () => (
    <div className={styles.selectorSkeleton} aria-label="Loading stream selector…" />
  ),
});

/* ─────────────────────────────────────────────
 * WHY_CARDS — Class 12 specific differentiators
 * ───────────────────────────────────────────── */
const WHY_CARDS = [
  {
    icon: Target,
    title: "JEE & NEET Ready",
    desc: "Science subjects go beyond NCERT into entrance-exam difficulty — the right step up for competitive exams.",
  },
  {
    icon: Award,
    title: "15 Mock Tests",
    desc: "Full-length board-pattern mock tests with answer keys and performance analysis built in.",
  },
  {
    icon: Shield,
    title: "2000+ Questions",
    desc: "Curated practice banks for every subject — PYQs, concept questions, and entrance-level MCQs.",
  },
  {
    icon: GraduationCap,
    title: "Dual Focus",
    desc: "Don't choose between board prep and entrance prep — our plans cover both simultaneously.",
  },
];

export default function Class12Page() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        {/* ==================== HERO ==================== */}
        <div className={styles.hero}>
          <Image
            src="/images/class-12-hero.png"
            alt="Class 12 board and entrance preparation background"
            fill
            priority
            className={styles.heroMedia}
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          <div className={styles.heroOverlay} aria-hidden="true" />

          {/* Decorative orb — gold/amber for Class 12 high-stakes identity */}
          <div className={styles.heroOrb} aria-hidden="true" />

          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>
              <GraduationCap size={14} aria-hidden="true" /> Class 12 · Board + Entrance
            </div>

            <h1 className={styles.heroTitle}>Board & Entrance Exam Prep</h1>

            <p className={styles.heroSubtitle}>
              Master board exams and ace entrance tests with structured revision and mock tests.
              Specialized plans for JEE, NEET, CUET, and board excellence.
            </p>

            {/* Stats bar with dividers */}
            <div className={styles.statsBar}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>3</span>
                <span className={styles.statLabel}>Streams</span>
              </div>

              <div className={styles.statDivider} aria-hidden="true" />

              <div className={styles.statItem}>
                <span className={styles.statValue}>100+</span>
                <span className={styles.statLabel}>Mock Tests</span>
              </div>

              <div className={styles.statDivider} aria-hidden="true" />

              <div className={styles.statItem}>
                <span className={styles.statValue}>18</span>
                <span className={styles.statLabel}>Total Subjects</span>
              </div>

              <div className={styles.statDivider} aria-hidden="true" />

              <div className={styles.statItem}>
                <span className={styles.statValue}>2000+</span>
                <span className={styles.statLabel}>Questions</span>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== STREAM SELECTOR ==================== */}
        {/*
         * Client component — handles tab switching between Science / Commerce / Arts.
         * Shows subjects and chapter counts for the selected stream.
         */}
        <Class12StreamSelector />

        {/* ==================== WHY CLASS 12 ==================== */}
        <div className={styles.whySection}>
          <div className={styles.whySectionHeader}>
            <h2 className={styles.sectionTitle}>Built for Class 12&apos;s Dual Challenge</h2>
          </div>

          <div className={styles.whyGrid}>
            {WHY_CARDS.map((card, idx) => {
              const WhyIcon = card.icon;
              return (
                <div key={idx} className={styles.whyCard}>
                  <div className={styles.whyIcon}>
                    <WhyIcon size={20} aria-hidden="true" />
                  </div>
                  <h4 className={styles.whyTitle}>{card.title}</h4>
                  <p className={styles.whyDesc}>{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==================== CTA BANNER ==================== */}
        <div className={styles.ctaBanner}>
          <div className={styles.ctaText}>
            <h3 className={styles.ctaTitle}>Make Class 12 count — start today</h3>
            <p className={styles.ctaSubtext}>
              Structured plans for board + entrance. Free forever, no credit card.
            </p>
          </div>
          <Link href="/sign-up" className={styles.ctaButton}>
            Start Preparing <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>

      </div>
    </div>
  );
}
