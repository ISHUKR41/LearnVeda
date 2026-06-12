/**
 * FILE: page.tsx
 * LOCATION: src/app/interviews/[slug]/page.tsx
 * PURPOSE: Dynamic programmatic SEO page serving placement technical interview questions.
 *          Generates comprehensive Course, FAQ page, and Breadcrumb structured microdata blocks,
 *          resolves internal linking sidebars, and serves the accordion toggler Client Component.
 *
 * LAYOUT FRAMEWORK:
 *  - High-CTR header card detailing target computer science concepts.
 *  - Responsive split layout separating the QnA sheet and structural side links.
 *  - Gamified and promotional sidebar triggers driving student placement retention.
 *
 * DEPENDENCIES: InterviewClient.tsx, schema-generators.ts, programmatic-data.ts, InterviewPage.module.css
 * LAST UPDATED: 2026-05-26
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./InterviewPage.module.css";
import InterviewClient from "./InterviewClient";
import { programmaticInterviewsCatalog } from "@/lib/server/seo/programmatic-data";
import { getRelatedLinksList } from "@/lib/server/seo/internal-linker";
import { generateCourseSchema, generateFAQSchema, generateBreadcrumbSchema } from "@/lib/server/seo/schema-generators";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return Object.keys(programmaticInterviewsCatalog).map((slug) => ({
    slug,
  }));
}

/** Dynamic metadata generator for premium Educational Interview SEO optimization */
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const interview = programmaticInterviewsCatalog[slug];
  if (!interview) return {};

  return {
    title: interview.seoTitle,
    description: interview.metaDescription,
    openGraph: {
      title: interview.seoTitle,
      description: interview.metaDescription,
      type: "website",
      url: `https://learnova.in/interviews/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: interview.seoTitle,
      description: interview.metaDescription,
    },
  };
}

export default async function InterviewSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const interview = programmaticInterviewsCatalog[slug];

  if (!interview) {
    notFound();
  }

  // Retrieve related sidebar navigation clusters (guarantees minimum 10 internal links per page)
  const sidebarLinks = getRelatedLinksList(slug.split("-")[0]); // e.g. "cpp-oop..." -> "cpp"

  // Generate Google Course & FAQ schemas
  const courseSchema = generateCourseSchema({
    name: interview.title,
    description: interview.metaDescription,
    providerName: "Learnova CS Faculty Board",
  });

  const faqItems = interview.questions.map((q) => ({
    question: q.question,
    answer: q.answer,
  }));
  const faqSchema = generateFAQSchema(faqItems);

  const breadcrumbList = [
    { name: "Home", url: "/" },
    { name: "Curriculum Hub", url: "/engineering" },
    { name: "Interview prep", url: `/interviews/${slug}` },
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbList);

  return (
    <>
      {/* Dynamic structured data scripts to dominate People Also Ask grids */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: courseSchema }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqSchema }}
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
        {/* Top heading summary */}
        <header className={styles.headerBlock}>
          <span className={styles.eyebrow}>{interview.eyebrow}</span>
          <h1 className={styles.title}>{interview.title}</h1>
          <p className={styles.description}>{interview.description}</p>
        </header>

        <div className={styles.layout}>
          {/* Left Column: collapsable accordions client engine */}
          <section>
            <InterviewClient questions={interview.questions} />
          </section>

          {/* Right Column: related topical sidebar clusters */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Related Placements Guides</h3>
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

            <div className={`${styles.sidebarCard} bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100`}>
              <h3 className="text-lg font-bold text-slate-800 mb-3 font-heading">Interactive Sandbox</h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">Put your concept knowledge to the test! Try interactive coding exercises and gain XP points on the fly.</p>
              <Link
                href={`/mcqs/${slug.split("-")[0]}-mcq-for-semester-1`} // auto-map to standard MCQ pattern
                className="block text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-2.5 px-4 rounded-md transition-colors shadow-md"
              >
                Launch Live MCQ Quiz
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
