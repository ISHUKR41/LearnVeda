/**
 * FILE: page.tsx
 * LOCATION: src/app/mcqs/[slug]/page.tsx
 * PURPOSE: Dynamic programmatic SEO page serving curriculum assessments and MCQs.
 *          Implements Google Course and FAQ rich schema blocks (JSON-LD),
 *          dynamically resolves internal related sidebar lists, and hooks up the interactive
 *          quiz practice Client Component.
 *
 * LAYOUT ARCHITECTURE:
 *  - Visually compelling header block describing target CBSE / CSE concepts.
 *  - Responsive grid structure with real-time scoring quiz box.
 *  - Sidebar clusters listing related subjects and career progression paths.
 *
 * DEPENDENCIES: MCQClient.tsx, schema-generators.ts, programmatic-data.ts, MCQPage.module.css
 * LAST UPDATED: 2026-05-26
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./MCQPage.module.css";
import MCQClient from "./MCQClient";
import { programmaticMCQsCatalog } from "@/lib/server/seo/programmatic-data";
import { getRelatedLinksList } from "@/lib/server/seo/internal-linker";
import { generateCourseSchema, generateFAQSchema, generateBreadcrumbSchema } from "@/lib/server/seo/schema-generators";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return Object.keys(programmaticMCQsCatalog).map((slug) => ({
    slug,
  }));
}

/** Dynamic metadata generator for premium Educational MCQ SEO optimization */
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const mcq = programmaticMCQsCatalog[slug];
  if (!mcq) return {};

  return {
    title: mcq.seoTitle,
    description: mcq.metaDescription,
    openGraph: {
      title: mcq.seoTitle,
      description: mcq.metaDescription,
      type: "website",
      url: `https://zingpath.in/mcqs/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: mcq.seoTitle,
      description: mcq.metaDescription,
    },
  };
}

export default async function MCQSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const mcq = programmaticMCQsCatalog[slug];

  if (!mcq) {
    notFound();
  }

  // Retrieve related sidebar navigation clusters (guarantees minimum 10 internal links per page)
  const sidebarLinks = getRelatedLinksList(slug.split("-")[0]); // e.g. "cpp-mcq..." -> "cpp"

  // Generate Google Course & FAQ Microdata blocks
  const courseSchema = generateCourseSchema({
    name: mcq.title,
    description: mcq.metaDescription,
    providerName: "Zingpath Curriculum Board",
  });

  const faqItems = mcq.questions.map((q) => ({
    question: q.questionText,
    answer: q.explanation,
  }));
  const faqSchema = generateFAQSchema(faqItems);

  const breadcrumbList = [
    { name: "Home", url: "/" },
    { name: "Curriculum Hub", url: "/engineering" },
    { name: "Interactive MCQs", url: `/mcqs/${slug}` },
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbList);

  return (
    <>
      {/* Google-compliant microdata blocks for Course and People Also Ask indexes */}
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
        {/* Dynamic header cards block */}
        <header className={styles.headerBlock}>
          <span className={styles.eyebrow}>{mcq.eyebrow}</span>
          <h1 className={styles.title}>{mcq.title}</h1>
          <p className={styles.description}>{mcq.description}</p>
        </header>

        <div className={styles.layout}>
          {/* Left Column: Client-Side Interactive Assessment */}
          <section>
            <MCQClient questions={mcq.questions} />
          </section>

          {/* Right Column: Topical Authority Sidebar Related Clusters */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Related Quizzes & Syllabus</h3>
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

            <div className={`${styles.sidebarCard} bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100`}>
              <h3 className="text-lg font-bold text-slate-800 mb-3 font-heading">Need Study Notes?</h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">Stuck on questions? Get complete syllabus study guidelines and theoretical concepts validation beforehand.</p>
              <Link
                href={`/notes/${slug.split("-")[0]}-notes-for-beginners`} // auto-map to standard notes pattern
                className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-2.5 px-4 rounded-md transition-colors shadow-md"
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
