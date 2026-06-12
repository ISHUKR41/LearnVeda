/**
 * FILE: page.tsx
 * LOCATION: src/app/notes/[slug]/page.tsx
 * PURPOSE: Dynamic programmatic SEO page serving curriculum-compliant study notes.
 *          Injects dynamic internal links using a regex semantic anchor engine,
 *          embeds Article/Breadcrumb microdata (JSON-LD), and enforces strict E-E-A-T trust signals.
 *
 * LAYOUT DESIGN:
 *  - Responsive grid splitting study text and navigation nodes.
 *  - Premium glassmorphic main cards with readable font leading.
 *  - E-E-A-T verify block displaying academic professors and board authors.
 *  - Sidebar sidebar clusters serving related MCQs, roadmaps, and career panels.
 *
 * DEPENDENCIES: programmatic-data.ts, internal-linker.ts, schema-generators.ts, NotesPage.module.css
 * LAST UPDATED: 2026-05-26
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./NotesPage.module.css";
import { programmaticNotesCatalog } from "@/lib/server/seo/programmatic-data";
import { injectInternalLinks, getRelatedLinksList } from "@/lib/server/seo/internal-linker";
import { generateArticleSchema, generateBreadcrumbSchema } from "@/lib/server/seo/schema-generators";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return Object.keys(programmaticNotesCatalog).map((slug) => ({
    slug,
  }));
}

/** Dynamic metadata generator for premium Educational SEO optimization */
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const notes = programmaticNotesCatalog[slug];
  if (!notes) return {};

  return {
    title: notes.seoTitle,
    description: notes.metaDescription,
    openGraph: {
      title: notes.seoTitle,
      description: notes.metaDescription,
      type: "article",
      publishedTime: "2026-01-15T08:00:00.000Z",
      modifiedTime: new Date().toISOString(),
      authors: [notes.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: notes.seoTitle,
      description: notes.metaDescription,
    },
  };
}

export default async function NotesSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const notes = programmaticNotesCatalog[slug];

  if (!notes) {
    notFound();
  }

  // Inject semantic internal links dynamically into our HTML content
  const fullyLinkedContent = injectInternalLinks(notes.contentHtml);

  // Retrieve related sidebar navigation clusters (guarantees minimum 10 internal links per page)
  const sidebarLinks = getRelatedLinksList(slug.split("-")[0]); // e.g. "cpp-notes..." -> "cpp"

  // Generate Google-compliant structured JSON-LD schemas
  const breadcrumbList = [
    { name: "Home", url: "/" },
    { name: "Curriculum Hub", url: "/engineering" },
    { name: "Study Notes", url: `/notes/${slug}` },
  ];

  const articleSchema = generateArticleSchema({
    title: notes.title,
    description: notes.metaDescription,
    url: `https://learnveda.in/notes/${slug}`,
    datePublished: "2026-01-15T08:00:00.000Z",
    dateModified: new Date().toISOString(),
    authorName: notes.author.name,
    authorTitle: notes.author.title,
    citations: notes.citations.map((c) => c.url),
  });

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbList);

  return (
    <>
      {/* Dynamic JSON-LD Structured Microdata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: articleSchema }}
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
        <div className={styles.layout}>
          {/* Left Column: Comprehensive Study notes */}
          <article className={styles.mainCard}>
            <header>
              <span className={styles.eyebrow}>{notes.eyebrow}</span>
              <h1 className={styles.title}>{notes.title}</h1>
              <p className={styles.introduction}>{notes.introduction}</p>
            </header>

            {/* Injected Content Body */}
            <div
              className={styles.contentBody}
              dangerouslySetInnerHTML={{ __html: fullyLinkedContent }}
            />

            {/* Interactive PDF Download Trigger */}
            <div className={styles.pdfCard}>
              <div className={styles.pdfInfo}>
                <h3 className={styles.pdfTitle}>Download PDF Revision Notes</h3>
                <p className={styles.pdfSubtitle}>Get the complete high-resolution study guide with solved board diagrams.</p>
              </div>
              <a
                href={notes.downloadPdfUrl}
                download
                className="no-underline"
              >
                <button className={styles.pdfButton}>
                  Download Free PDF
                </button>
              </a>
            </div>

            {/* Core E-E-A-T Academic Verification Section */}
            <section className={styles.eeatSection}>
              <h2 className="text-xl font-bold text-slate-800 mb-4 font-heading border-b pb-2">Academic Validation Board</h2>
              
              <div className={styles.authorCard}>
                <div className={styles.avatarContainer}>
                  {notes.author.name.split(" ").slice(-1)[0][0]}
                </div>
                <div className={styles.authorDetails}>
                  <span className={styles.authorName}>{notes.author.name}</span>
                  <span className={styles.authorTitle}>{notes.author.title}</span>
                  <span className={styles.authorAffiliation}>{notes.author.affiliation}</span>
                  <p className={styles.authorBio}>{notes.author.bio}</p>
                </div>
              </div>

              {/* Citations & Peer Reviewed Literatures */}
              <div className={styles.citationsCard}>
                <h3 className={styles.citationsTitle}>
                  <svg className="w-5 h-5 text-blue-600 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Academic References & Syllabus Citations
                </h3>
                <div className="flex flex-col gap-2">
                  {notes.citations.map((citation, idx) => (
                    <div key={idx} className={styles.citationItem}>
                      <strong>{citation.title}</strong> — {citation.author}. ({citation.publisher}, {citation.year}).{" "}
                      <a href={citation.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        Reference Source
                      </a>
                    </div>
                  ))}
                  <div className={styles.citationItem}>
                    <strong>NCERT Class IX Mathematics Guidelines</strong> — National Council of Educational Research and Training.{" "}
                    <a href="https://ncert.nic.in/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      ncert.nic.in
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </article>

          {/* Right Column: Topical Authority Sidebar Navigation */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Related Study Modules</h3>
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

            <div className={`${styles.sidebarCard} bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100`}>
              <h3 className="text-lg font-bold text-slate-800 mb-3 font-heading">Gamified Prep</h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">Boost your learning streak! Solve interactive chapter quizzes, secure XP milestones, and climb the public leaderboards.</p>
              <Link href="/leaderboard" className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 px-4 rounded-md transition-colors shadow-md">
                View Global Leaderboard
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
