/**
 * FILE: page.tsx
 * LOCATION: src/app/class-11/page.tsx
 * PURPOSE: Class 11 landing page — stream selection hero + interactive subject selector.
 *          Students pick their stream (Science / Commerce / Arts) and see relevant subjects.
 *          The hero is a server-rendered shell; the stream selector is a dynamic client component.
 * USED BY: Next.js App Router — renders at "/class-11"
 * DEPENDENCIES: next/dynamic, lucide-react, Class11.module.css
 * LAST UPDATED: 2026-05-18
 */

import dynamic from "next/dynamic";
import Image from "next/image";
import { GraduationCap, BookOpen, TrendingUp, ChevronRight } from "lucide-react";
import Link from "next/link";
import styles from "./Class11.module.css";

export const metadata = {
  title: "Class 11 — Choose Your Stream | EduQuest",
  description:
    "Class 11 learning tracks for Science, Commerce, and Arts streams. Deep subject coverage with structured day-wise plans for every subject.",
};

/*
 * Dynamic import: Class11StreamSelector is a "use client" component with useState.
 * Loading it dynamically prevents server-side hydration mismatches.
 */
/*
 * Class11StreamSelector uses useState — it is a Client Component.
 * We omit `ssr: false` because this page is a Server Component (no "use client").
 * The loading fallback renders on the server; the real component hydrates on the client.
 */
const Class11StreamSelector = dynamic(() => import("./Class11StreamSelector"), {
  loading: () => (
    <div className={styles.selectorSkeleton} aria-label="Loading stream selector…" />
  ),
});

/* ─────────────────────────────────────────────
 * WHY_CARDS — reasons to choose EduQuest for Class 11
 * ───────────────────────────────────────────── */
const WHY_CARDS = [
  {
    icon: BookOpen,
    title: "All 3 Streams",
    desc: "Science, Commerce, and Arts — every subject in every stream is covered with structured plans.",
  },
  {
    icon: TrendingUp,
    title: "Foundation for Entrance",
    desc: "Class 11 is where JEE and NEET preparation begins. Build the right foundation now.",
  },
  {
    icon: GraduationCap,
    title: "Depth over Breadth",
    desc: "Fewer subjects, deeper focus. Long-form study plans that go beyond surface-level revision.",
  },
];

export default function Class11Page() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        {/* ==================== HERO ==================== */}
        <div className={styles.hero}>
          <Image
            src="/images/class-11-hero.png"
            alt="Class 11 stream learning background"
            fill
            priority
            className={styles.heroMedia}
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          <div className={styles.heroOverlay} aria-hidden="true" />

          {/* Decorative orb — green/emerald for Class 11 identity */}
          <div className={styles.heroOrb} aria-hidden="true" />

          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>
              <GraduationCap size={14} aria-hidden="true" /> Class 11
            </div>

            <h1 className={styles.heroTitle}>Choose Your Stream</h1>

            <p className={styles.heroSubtitle}>
              Deep learning in your chosen stream — Science, Commerce, or Arts.
              Specialized plans tailored for your academic path and future goals.
            </p>

            {/* Stats bar with dividers */}
            <div className={styles.statsBar}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>3</span>
                <span className={styles.statLabel}>Streams</span>
              </div>

              <div className={styles.statDivider} aria-hidden="true" />

              <div className={styles.statItem}>
                <span className={styles.statValue}>5–6</span>
                <span className={styles.statLabel}>Subjects per stream</span>
              </div>

              <div className={styles.statDivider} aria-hidden="true" />

              <div className={styles.statItem}>
                <span className={styles.statValue}>18</span>
                <span className={styles.statLabel}>Total Subjects</span>
              </div>

              <div className={styles.statDivider} aria-hidden="true" />

              <div className={styles.statItem}>
                <span className={styles.statValue}>200+</span>
                <span className={styles.statLabel}>Chapters</span>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== STREAM SELECTOR ==================== */}
        {/*
         * Client component — handles the tab switching between Science / Commerce / Arts.
         * Loaded dynamically (ssr: false) so it only runs on the client.
         */}
        <Class11StreamSelector />

        {/* ==================== WHY CLASS 11 ==================== */}
        <div className={styles.whySection}>
          <div className={styles.whySectionHeader}>
            <h2 className={styles.sectionTitle}>Why EduQuest for Class 11?</h2>
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

        {/* ==================== CTA ==================== */}
        <div className={styles.ctaBanner}>
          <div className={styles.ctaText}>
            <h3 className={styles.ctaTitle}>Start your Class 11 journey today</h3>
            <p className={styles.ctaSubtext}>Pick a stream, pick a subject, follow the plan.</p>
          </div>
          <Link href="/sign-up" className={styles.ctaButton}>
            Get Started Free <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>

      </div>
    </div>
  );
}
