/**
 * FILE: page.tsx
 * LOCATION: src/app/semester/[slug]/page.tsx
 * PURPOSE: Dynamic programmatic SEO page serving semester survival preparation guides.
 *          Generates comprehensive HowTo step-by-step guidelines, Course listings,
 *          and Breadcrumb microdata (JSON-LD) to dominate zeroclick results,
 *          resolves internal linking sidebars, and mounts the interactive checklist.
 *
 * LAYOUT INTERACTIVE SCHEME:
 *  - Responsive grid splitting checklist board and related study clusters.
 *  - Solved important numerical question lists highlighting exam shortcuts.
 *  - Promotion sidebars leading back to interactive quiz battles and leaderboards.
 *
 * DEPENDENCIES: SemesterClient.tsx, schema-generators.ts, programmatic-data.ts, SemesterPage.module.css
 * LAST UPDATED: 2026-05-26
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./SemesterPage.module.css";
import SemesterClient from "./SemesterClient";
import { programmaticSemesterCatalog } from "@/lib/server/seo/programmatic-data";
import { getRelatedLinksList } from "@/lib/server/seo/internal-linker";
import { generateCourseSchema, generateHowToSchema, generateBreadcrumbSchema } from "@/lib/server/seo/schema-generators";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return Object.keys(programmaticSemesterCatalog).map((slug) => ({
    slug,
  }));
}

/** Dynamic metadata generator for premium Educational Semester Prep SEO optimization */
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const semester = programmaticSemesterCatalog[slug];
  if (!semester) return {};

  return {
    title: semester.seoTitle,
    description: semester.metaDescription,
    openGraph: {
      title: semester.seoTitle,
      description: semester.metaDescription,
      type: "website",
      url: `https://learnveda.in/semester/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: semester.seoTitle,
      description: semester.metaDescription,
    },
  };
}

export default async function SemesterSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const semester = programmaticSemesterCatalog[slug];

  if (!semester) {
    notFound();
  }

  // Retrieve related sidebar navigation clusters (guarantees minimum 10 internal links per page)
  const sidebarLinks = getRelatedLinksList(slug.split("-")[0]); // e.g. "cpp-semester..." -> "cpp"

  // Generate Google Course & HowTo schemas
  const courseSchema = generateCourseSchema({
    name: semester.title,
    description: semester.metaDescription,
    providerName: "LearnVeda Academic Board",
  });

  const howToSteps = semester.checklist.map((item) => ({
    name: item.label,
    text: item.description,
  }));
  const howToSchema = generateHowToSchema({
    name: `How to pass ${semester.title}`,
    description: semester.metaDescription,
    steps: howToSteps,
  });

  const breadcrumbList = [
    { name: "Home", url: "/" },
    { name: "Curriculum Hub", url: "/engineering" },
    { name: "Semester prep", url: `/semester/${slug}` },
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbList);

  return (
    <>
      {/* Dynamic structured microdata scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: courseSchema }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: howToSchema }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbSchema }}
      />

      <main className={styles.container}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          {breadcrumbList.map((crumb, index) => (
            <span key={crumb.url} className={styles.breadcrumbItem}>
              {index < breadcrumbList.length - 1 ? (
                <Link href={crumb.url} className={styles.breadcrumbLink}>
                  {crumb.name}
                </Link>
              ) : (
                <span className={styles.breadcrumbCurrent}>{crumb.name}</span>
              )}
              {index < breadcrumbList.length - 1 && (
                <span className={styles.breadcrumbSeparator}>/</span>
              )}
            </span>
          ))}
        </nav>
        {/* Dynamic header summary card */}
        <header className={styles.headerBlock}>
          <span className={styles.eyebrow}>{semester.eyebrow}</span>
          <h1 className={styles.title}>{semester.title}</h1>
          <p className={styles.description}>{semester.description}</p>
        </header>

        <div className={styles.layout}>
          {/* Left Column: checklist client dashboard & Solved Questions */}
          <section>
            <SemesterClient checklist={semester.checklist} />

            {/* Solved Important Questions Panel */}
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>Solved Important Exam Questions</h2>
              <div className={styles.questionsList}>
                {semester.importantQuestions.map((qText, index) => (
                  <div key={index} className={styles.solvedQCard}>
                    <div className="flex gap-2">
                      <span className="text-red-500 font-extrabold text-sm uppercase">Q{index + 1}.</span>
                      <p className={styles.solvedQText}>{qText}</p>
                    </div>
                    <div className="mt-3 text-sm text-slate-500 leading-relaxed font-sans bg-gray-50/50 p-3 rounded-md border border-gray-100">
                      <strong>Answer Key Strategy:</strong> Divide this question into 3 logical parts: clean structural definitions, real code syntax block / proofs diagram, and performance complexity analysis (Time & Space complexity maps). This guarantees full marks under standard university grading schemes.
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Right Column: related topical sidebar clusters */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Related Semester Revision</h3>
              <nav className={styles.linksList}>
                {sidebarLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className={styles.sidebarLink}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className={`${styles.sidebarCard} bg-gradient-to-br from-rose-50 to-pink-50 border-rose-100`}>
              <h3 className="text-lg font-bold text-slate-800 mb-3 font-heading">Need Quick Notes?</h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">Download optimized study guides, formulas blueprints, and full textbooks NCERT summaries to ace your syllabus preparation.</p>
              <Link
                href={`/notes/${slug.split("-")[0]}-notes-for-beginners`} // auto-map to standard notes pattern
                className="block text-center bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm py-2.5 px-4 rounded-md transition-colors shadow-md"
              >
                Download Study Notes PDF
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
