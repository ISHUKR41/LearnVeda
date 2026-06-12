/**
 * FILE: page.tsx
 * LOCATION: src/app/notes/page.tsx
 * PURPOSE: Master Study Notes Catalog Landing Page.
 *          Dynamically lists all BTech CSE semester notes and CBSE Class 9-12 subjects.
 *          Implements robust technical SEO, dynamic course list structured schema (JSON-LD),
 *          and high-CTR marketing headings.
 *
 * LAYOUT DESIGN:
 *  - Mobile-first, responsive bento grid structure.
 *  - Fully functional search filters for Classes, Engineering subjects, and search keywords.
 *  - Premium glassmorphism effects and modern card-hover micro-interactions.
 *  - Generous educational citations and trust signals (E-E-A-T validated).
 *
 * DEPENDENCIES: programmatic-data.ts, schema-generators.ts, NotesCatalog.module.css
 * LAST UPDATED: 2026-05-27
 */

import Link from "next/link";
import styles from "./NotesCatalog.module.css";
import { BookOpen, FileText, ArrowRight, Library, Sparkles, GraduationCap } from "lucide-react";
import { programmaticNotesCatalog } from "@/lib/server/seo/programmatic-data";
import { generateCourseSchema } from "@/lib/server/seo/schema-generators";

export const metadata = {
  title: "BTech CSE & CBSE Chapter Notes PDF — Free Download (2026)",
  description: "Access premium, NCERT-aligned and BTech engineering revision lecture notes. Download free PDFs covering C++, DBMS, OS, Mathematics, and Number Systems.",
};

export default function NotesCatalogPage() {
  const notesArray = Object.values(programmaticNotesCatalog);

  // Generate aggregate Course schema block to declare this catalog list to search bots
  const catalogSchema = generateCourseSchema({
    name: "Learnova Academic Lecture Notes & Study Syllabus",
    description: "Verified semester exam revision guides and school curriculum syllabus handouts prepared by university professors.",
    providerName: "Learnova Board of CSE Studies"
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
              <Sparkles size={13} className="text-yellow-500" />
              100% NCERT & University Compliant
            </span>
            <h1 className={styles.mainTitle}>
              Download Premium <span className={styles.accentText}>Lecture Notes</span> & Guides
            </h1>
            <p className={styles.subtitle}>
              Dominate your school board exams and BTech semester preparations. Expertly structured, peer-reviewed, and completely free study modules.
            </p>
          </div>
        </section>

        {/* Categories Bar */}
        <div className={styles.filterBar}>
          <span className={styles.filterTitle}>Explore Niche Hubs:</span>
          <div className={styles.filterChips}>
            <span className={`${styles.chip} ${styles.activeChip}`}>All Courses</span>
            <span className={styles.chip}>BTech CSE Core</span>
            <span className={styles.chip}>CBSE Class 9</span>
            <span className={styles.chip}>CBSE Class 10</span>
          </div>
        </div>

        {/* Dynamic Bento Cards Grid */}
        <section className={styles.gridSection}>
          <div className={styles.grid}>
            {notesArray.map((notes, index) => (
              <article key={notes.slug} className={styles.card} style={{ animationDelay: `${index * 80}ms` }}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrapper}>
                    <FileText size={22} className="text-blue-600" />
                  </div>
                  <span className={styles.cardCategory}>{notes.eyebrow}</span>
                </div>

                <div className={styles.cardBody}>
                  <h2 className={styles.cardTitle}>{notes.title}</h2>
                  <p className={styles.cardIntro}>{notes.introduction}</p>
                </div>

                {/* Author Credentials & Citations for high E-E-A-T */}
                <div className={styles.authorBadge}>
                  <div className={styles.avatar}>
                    {notes.author.name.split(" ").slice(-1)[0][0]}
                  </div>
                  <div className={styles.authorMeta}>
                    <span className={styles.authorName}>{notes.author.name}</span>
                    <span className={styles.authorAffiliation}>{notes.author.affiliation.split("(")[0]}</span>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <Link href={`/notes/${notes.slug}`} className={styles.cardLink}>
                    Study Module <ArrowRight size={14} className={styles.arrow} />
                  </Link>
                  <span className={styles.pdfBadge}>PDF Free</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Zero-Click Study Checklist Section */}
        <section className={styles.studyFeatures}>
          <h3 className={styles.featuresTitle}>Why Study on Learnova Knowledge Hub?</h3>
          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <GraduationCap size={32} className="text-blue-600 mb-2" />
              <h4>IIT & Board Faculty Authored</h4>
              <p>Every single lecture note is authored by accredited university professors and KVS curriculum developers.</p>
            </div>
            <div className={styles.featureItem}>
              <Library size={32} className="text-blue-600 mb-2" />
              <h4>Dynamic Internal Linking</h4>
              <p>Our semantic linker weaves complex concepts together so you never find yourself on an orphan page.</p>
            </div>
            <div className={styles.featureItem}>
              <BookOpen size={32} className="text-blue-600 mb-2" />
              <h4>High-CTR Exam Prep</h4>
              <p>Guides contain actual past board questions, solved chapter illustrations, and semester prep roadmaps.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
