/**
 * FILE: page.tsx
 * LOCATION: src/app/mcqs/page.tsx
 * PURPOSE: Interactive MCQ Practice Assessment Catalog page.
 *          Lists all dynamic CBSE Class 9-12 chapter quiz pools and BTech placement tests.
 *          Implements robust technical SEO, dynamic course structured schema (JSON-LD),
 *          and high-CTR Indian academic headings.
 *
 * LAYOUT DESIGN:
 *  - Responsive grid splitting available subjects, points rewards, and details.
 *  - Premium modern bento card layout with glassmorphic cards.
 *  - Integrated XP points indicator to drive gamified student engagement.
 *
 * DEPENDENCIES: programmatic-data.ts, schema-generators.ts, MCQCatalog.module.css
 * LAST UPDATED: 2026-05-27
 */

import Link from "next/link";
import styles from "./MCQCatalog.module.css";
import { Swords, Trophy, HelpCircle, ArrowRight, Sparkles, Award } from "lucide-react";
import { programmaticMCQsCatalog } from "@/lib/server/seo/programmatic-data";
import { generateCourseSchema } from "@/lib/server/seo/schema-generators";

export const metadata = {
  title: "BTech CSE Placement & CBSE Board Online MCQ Tests (2026)",
  description: "Test your skills with interactive chapter multiple-choice questions. Free practice tests covering C++, Relational DBMS, CPU Scheduling, and NCERT Math.",
};

export default function MCQCatalogPage() {
  const mcqArray = Object.values(programmaticMCQsCatalog);

  // Generate aggregate Course schema for crawl bots representation
  const catalogSchema = generateCourseSchema({
    name: "EduQuest Curriculum MCQ Assessments & Online Quizzes",
    description: "Verified academic CBSE chapter tests and SDE screening practice mock assessments.",
    providerName: "EduQuest Board of Assessments"
  });

  return (
    <>
      {/* Structural Course Schema block injected dynamically */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: catalogSchema }}
      />

      <main className={styles.container}>
        {/* Glassmorphic Hero Banner */}
        <section className={styles.heroSection}>
          <div className={styles.heroOrb} aria-hidden="true" />
          <div className={styles.heroContent}>
            <span className={styles.badge}>
              <Swords size={13} className="text-red-500 animate-pulse" />
              Real-time Academic Quiz Arena
            </span>
            <h1 className={styles.mainTitle}>
              Interactive Online <span className={styles.accentText}>Practice MCQs</span>
            </h1>
            <p className={styles.subtitle}>
              Test your knowledge, secure XP milestones, and master complex engineering concepts. Aligned end-to-end with university exams and board syllabi.
            </p>
          </div>
        </section>

        {/* Categories Bar */}
        <div className={styles.filterBar}>
          <span className={styles.filterTitle}>Select Quiz Stream:</span>
          <div className={styles.filterChips}>
            <span className={`${styles.chip} ${styles.activeChip}`}>All Assessments</span>
            <span className={styles.chip}>Class 9 Boards</span>
            <span className={styles.chip}>Engineering SDE Preps</span>
          </div>
        </div>

        {/* Dynamic Bento Cards Grid */}
        <section className={styles.gridSection}>
          <div className={styles.grid}>
            {mcqArray.map((mcq, index) => (
              <article key={mcq.slug} className={styles.card} style={{ animationDelay: `${index * 80}ms` }}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrapper}>
                    <HelpCircle size={22} className="text-violet-600" />
                  </div>
                  <span className={styles.cardCategory}>{mcq.eyebrow}</span>
                </div>

                <div className={styles.cardBody}>
                  <h2 className={styles.cardTitle}>{mcq.title}</h2>
                  <p className={styles.cardIntro}>{mcq.description}</p>
                </div>

                {/* Scoreboard Indicator for Gamified XP */}
                <div className={styles.pointsBadge}>
                  <Award size={16} className="text-amber-500" />
                  <span>
                    <strong>{mcq.questions.length * 10} XP</strong> Total Points Available
                  </span>
                  <span className="text-slate-400 font-normal">({mcq.questions.length} Solved Questions)</span>
                </div>

                <div className={styles.cardFooter}>
                  <Link href={`/mcqs/${mcq.slug}`} className={styles.cardLink}>
                    Enter Test Arena <ArrowRight size={14} className={styles.arrow} />
                  </Link>
                  <span className={styles.statusBadge}>Live Practice</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Leaderboard Call to Action */}
        <section className={styles.leaderboardCta}>
          <div className={styles.ctaContent}>
            <Trophy size={48} className="text-amber-500 mb-4" />
            <h3>Secure Your Position on the Leaderboard</h3>
            <p>Every MCQ module you complete correctly earns you XP multipliers. Outperform thousands of peers across school networks and university branches.</p>
            <Link href="/leaderboard" className={styles.ctaButton}>
              View Global Standings
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
