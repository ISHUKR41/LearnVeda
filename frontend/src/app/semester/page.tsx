/**
 * FILE: page.tsx
 * LOCATION: src/app/semester/page.tsx
 * PURPOSE: Interactive BTech CSE Semester Survival Guide Catalog Page.
 *          Lists last-minute revision checkers, numeric schedulers, and solved questions.
 *          Implements robust technical SEO, dynamic course structured schema (JSON-LD),
 *          and high-CTR placement prep headings.
 *
 * LAYOUT DESIGN:
 *  - Mobile-first, responsive bento grid structure.
 *  - Gamified checklists to track topics prepared.
 *  - Scoped CSS modules for clean isolated style rendering.
 *
 * DEPENDENCIES: programmatic-data.ts, schema-generators.ts, SemesterCatalog.module.css
 * LAST UPDATED: 2026-05-27
 */

import Link from "next/link";
import styles from "./SemesterCatalog.module.css";
import { GraduationCap, CheckSquare, Award, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { programmaticSemesterCatalog } from "@/lib/server/seo/programmatic-data";
import { generateCourseSchema } from "@/lib/server/seo/schema-generators";

export const metadata = {
  title: "BTech CSE Semester Survival Guides & Checklists (2026)",
  description: "Get last-minute engineering semester exam checklists. Solved important questions, CPU scheduling calculation sheets, and 3NF normalization guides.",
};

export default function SemesterCatalogPage() {
  const semesterArray = Object.values(programmaticSemesterCatalog);

  // Generate aggregate Course schema for crawl visibility
  const catalogSchema = generateCourseSchema({
    name: "Learnova BTech CSE Semester Exam Blueprints & Survival Guides",
    description: "Verified computer science curriculum blueprints and numerical revision safety sheets prepared by university department heads.",
    providerName: "Learnova Academic Affairs Office"
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
              <GraduationCap size={13} className="text-emerald-400" />
              University Revision Blueprints
            </span>
            <h1 className={styles.mainTitle}>
              Semester <span className={styles.accentText}>Survival Guides</span> & Checklists
            </h1>
            <p className={styles.subtitle}>
              University syllabus got you stressed? Take control with our last-minute exam prep checkers, numerical calculation roadmaps, and solved syllabus blueprints.
            </p>
          </div>
        </section>

        {/* Categories Bar */}
        <div className={styles.filterBar}>
          <span className={styles.filterTitle}>Select Year / Sem:</span>
          <div className={styles.filterChips}>
            <span className={`${styles.chip} ${styles.activeChip}`}>All Semester Guides</span>
            <span className={styles.chip}>CSE Year 1 (Sem 1-2)</span>
            <span className={styles.chip}>CSE Year 2 (Sem 3-4)</span>
          </div>
        </div>

        {/* Dynamic Bento Cards Grid */}
        <section className={styles.gridSection}>
          <div className={styles.grid}>
            {semesterArray.map((guide, index) => (
              <article key={guide.slug} className={styles.card} style={{ animationDelay: `${index * 80}ms` }}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrapper}>
                    <CheckSquare size={22} className="text-emerald-600" />
                  </div>
                  <span className={styles.cardCategory}>{guide.eyebrow}</span>
                </div>

                <div className={styles.cardBody}>
                  <h2 className={styles.cardTitle}>{guide.title}</h2>
                  <p className={styles.cardIntro}>{guide.description}</p>
                </div>

                {/* Checklist count points for high E-E-A-T */}
                <div className={styles.checklistBadge}>
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span>
                    Includes **{guide.checklist.length} core subject areas** with important lists.
                  </span>
                </div>

                <div className={styles.cardFooter}>
                  <Link href={`/semester/${guide.slug}`} className={styles.cardLink}>
                    Enter Survival Mode <ArrowRight size={14} className={styles.arrow} />
                  </Link>
                  <span className={styles.semBadge}>Exam Ready</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Structured trust signals */}
        <section className={styles.featuresSection}>
          <h3 className={styles.featuresTitle}>Why Trust Learnova Blueprints?</h3>
          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <ShieldCheck size={32} className="text-emerald-600 mb-2" />
              <h4>100% University Aligned</h4>
              <p>Tailored directly to the syllabus patterns of major technical universities in India, including AKTU, Anna University, VTU, and SPPU.</p>
            </div>
            <div className={styles.featureItem}>
              <HelpCircle size={32} className="text-emerald-600 mb-2" />
              <h4>Solved Numericals & Proofs</h4>
              <p>We solve the hardest mathematical proofs, deadlock safety banker computations, and relation normalizations step-by-step.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
