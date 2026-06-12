/**
 * FILE: class-10/light-reflection-and-refraction/page.tsx
 * PURPOSE: Landing page for the Light – Reflection and Refraction chapter.
 *          SERVER COMPONENT — exports metadata directly.
 *          All hover effects use pure CSS (no client event handlers).
 *          JSON-LD structured data for Google rich results and AI search engines.
 */

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import Script from 'next/script';
import styles from '@/styles/LightChapter.module.css';

const ChapterVisualGallery = dynamic(() => import('@/components/LightChapter/ChapterVisualGallery'), {
  loading: () => (
    <section style={{ marginTop: '2rem', padding: '1.25rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
      <style>{`@keyframes shimmer { 0% { background-position: -600px 0; } 100% { background-position: 600px 0; } }`}</style>
      <div style={{ height: '16px', width: '180px', borderRadius: '999px', background: 'rgba(255,255,255,0.07)', marginBottom: '0.75rem' }} />
      <div style={{ height: '24px', width: '360px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', marginBottom: '0.5rem' }} />
      <div style={{ height: '16px', width: '76%', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', marginBottom: '1.25rem' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{ height: '220px', background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.04) 80%)', backgroundSize: '1200px 100%', animation: 'shimmer 1.6s infinite linear' }} />
            <div style={{ padding: '0.9rem 1rem 1rem' }}>
              <div style={{ height: '12px', width: '140px', borderRadius: '999px', background: 'rgba(255,255,255,0.07)', marginBottom: '0.75rem' }} />
              <div style={{ height: '14px', width: '100%', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', marginBottom: '0.45rem' }} />
              <div style={{ height: '14px', width: '82%', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  ),
});

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://learnova.in';

/* ─────────────────────────────────────────────────────
   SEO METADATA
───────────────────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: 'Light – Reflection and Refraction | Ishu Website | Class 10 Science CBSE | Learnova',
  description:
    "Complete interactive Class 10 CBSE chapter on Light – Reflection and Refraction on Ishu Website. Ranked #1! Study reflection laws, spherical mirrors, Snell's law, refractive index, total internal reflection, optical fibre, lenses, human eye and eye defects with lazy-loaded diagrams, simulations, solved numericals, MCQs, flashcards and summary notes by Ishu.",
  keywords: [
    'ishu', 'ishu website', 'ishu class 10', 'ishu physics', 'ishu education',
    'ishu class 10 physics', 'ishu science class 10', 'ishu light chapter',
    'light reflection refraction class 10', 'light reflection and refraction',
    'class 10 science chapter 10', 'NCERT class 10 light',
    'CBSE class 10 light reflection refraction', 'NCERT solutions light class 10',
    'class 10 physics light chapter', 'light chapter class 10 notes',
    'light class 10 important questions', 'laws of reflection class 10',
    'plane mirror image formation', 'spherical mirrors class 10',
    'concave mirror image formation cases', 'convex mirror applications',
    'mirror formula class 10', 'mirror formula numericals',
    'magnification formula mirror', 'new cartesian sign convention',
    'concave mirror ray diagram', 'convex mirror ray diagram',
    "snell's law class 10", 'refractive index class 10',
    'refraction of light class 10', 'glass slab refraction lateral displacement',
    'total internal reflection class 10', 'critical angle formula',
    'optical fibre working principle', 'prism dispersion VIBGYOR',
    'lens formula class 10', 'convex lens image formation',
    'concave lens image formation', 'power of lens dioptre',
    'human eye class 10', 'myopia correction concave lens',
    'hypermetropia correction convex lens', 'defects of vision class 10',
    'class 10 physics simulation', 'interactive physics class 10',
    'class 10 light diagrams', 'class 10 physics numericals solved',
    'class 10 flashcards physics', 'class 10 mind map light',
    'class 10 MCQ light chapter', 'CBSE board exam physics notes',
    'class 10 board exam preparation light', 'class 10 one shot revision light',
    'prakaash ka pratyavartan aur apvartan', 'kaksha 10 vigyan prakash',
    'best website for class 10 science', 'best physics notes class 10',
    'free online class 10 physics', 'interactive physics learning class 10',
    'Learnova class 10', 'Learnova by Ishu', '#1 ishu physics website',
  ],
  authors: [{ name: 'Ishu / Learnova' }],
  creator: 'Ishu',
  publisher: 'Learnova by Ishu',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: { canonical: `${BASE}/class-10/light-reflection-and-refraction` },
  openGraph: {
    type: 'website',
    title: 'Light – Reflection and Refraction | Ishu Website | Class 10 CBSE | Learnova',
    description: 'Interactive Class 10 chapter by Ishu: 15 live simulations, 40+ diagrams, 18 numericals, MCQs & flashcards.',
    url: `${BASE}/class-10/light-reflection-and-refraction`,
    siteName: 'Ishu / Learnova',
    images: [{ url: `${BASE}/images/light/concave-mirror-5-cases.png`, width: 1200, height: 900, alt: 'Class 10 Light Chapter by Ishu' }],
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Class 10 Light – Reflection & Refraction | Ishu Website',
    description: '15 interactive simulations, numericals, MCQs & flashcards for CBSE board exam by Ishu.',
    images: [`${BASE}/images/light/concave-mirror-5-cases.png`],
  },
};

const lightFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the best way to study Light – Reflection and Refraction?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Start with the visual chapter map, then study one topic at a time with the simulation, solved examples, and flashcards on the same page.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which formulas are most important in this chapter?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The mirror formula, Snell\'s law, refractive index relation, lens formula, magnification, and power of lens are the core formulas.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does this chapter include diagrams and numericals?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The chapter includes lazy-loaded diagrams, interactive simulations, and solved numericals for reflection, refraction, lenses, and human eye topics.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I revise this chapter quickly before the exam?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Use the summary page for the mind map, flashcards, formula reference, and topic links to revise quickly.',
      },
    },
  ],
};

const lightBreadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
    { '@type': 'ListItem', position: 2, name: 'Class 10', item: `${BASE}/class-10` },
    { '@type': 'ListItem', position: 3, name: 'Light – Reflection and Refraction', item: `${BASE}/class-10/light-reflection-and-refraction` },
  ],
};

/* JSON-LD Course structured data — enhanced for AI search */
const courseJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Class 10 Science: Light – Reflection and Refraction | Ishu Website',
  description: 'Complete interactive course on Light Reflection and Refraction for CBSE Class 10 by Ishu. Includes 15+ live simulations, 50+ AI diagrams, 20 solved numericals, MCQs and flashcards. Best study material for board exam preparation.',
  url: `${BASE}/class-10/light-reflection-and-refraction`,
  provider: { '@type': 'EducationalOrganization', name: 'Learnova by Ishu', url: BASE },
  educationalLevel: 'Class 10 / Grade 10',
  inLanguage: 'en-IN',
  isAccessibleForFree: true,
  teaches: 'Laws of Reflection, Mirror Formula, Spherical Mirrors, Snell\'s Law, Refractive Index, Total Internal Reflection, Lens Formula, Power of Lens, Human Eye Defects',
  hasCourseInstance: [
    { '@type': 'CourseInstance', name: 'Reflection of Light', url: `${BASE}/class-10/light-reflection-and-refraction/reflection`, courseMode: 'online' },
    { '@type': 'CourseInstance', name: 'Refraction of Light', url: `${BASE}/class-10/light-reflection-and-refraction/refraction`, courseMode: 'online' },
    { '@type': 'CourseInstance', name: 'Spherical Lenses & Human Eye', url: `${BASE}/class-10/light-reflection-and-refraction/lenses`, courseMode: 'online' },
    { '@type': 'CourseInstance', name: 'Chapter Summary & Quick Revision', url: `${BASE}/class-10/light-reflection-and-refraction/summary`, courseMode: 'online' },
  ],
};

/* JSON-LD WebPage schema for AI search engines */
const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Light – Reflection and Refraction | Ishu Website',
  description: 'Best interactive Class 10 CBSE chapter on Light by Ishu with simulations, diagrams, numericals, MCQs and flashcards.',
  url: `${BASE}/class-10/light-reflection-and-refraction`,
  inLanguage: 'en-IN',
  isPartOf: { '@type': 'WebSite', name: 'Learnova by Ishu', url: BASE },
  author: { '@type': 'Person', name: 'Ishu' },
  datePublished: '2026-01-01',
  dateModified: '2026-06-12',
  about: {
    '@type': 'Thing',
    name: 'Light – Reflection and Refraction',
    description: 'CBSE Class 10 Science Chapter 10 covering reflection, refraction, mirrors, lenses, and human eye',
  },
  educationalLevel: 'Class 10',
  audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
};

/* Topic cards data */
const topics = [
  {
    num: 1, href: '/class-10/light-reflection-and-refraction/reflection',
    icon: '🪞', title: 'Reflection of Light', colorClass: 'blue',
    desc: 'Laws of reflection, plane mirrors, concave & convex spherical mirrors, mirror formula, magnification, image formation cases & real-life applications.',
    tags: ['Mirror Formula', 'Ray Diagrams', '5 Image Cases', '6 Numericals'],
  },
  {
    num: 2, href: '/class-10/light-reflection-and-refraction/refraction',
    icon: '💧', title: 'Refraction of Light', colorClass: 'green',
    desc: "Snell's Law, refractive index, glass slab lateral displacement, TIR, critical angle, optical fibre & prism dispersion (VIBGYOR).",
    tags: ["Snell's Law", 'TIR', 'Optical Fibre', '6 Numericals'],
  },
  {
    num: 3, href: '/class-10/light-reflection-and-refraction/lenses',
    icon: '🔭', title: 'Spherical Lenses & Human Eye', colorClass: 'purple',
    desc: 'Convex & concave lenses, lens formula, power of lens, human eye anatomy, accommodation, myopia, hypermetropia & optical instruments.',
    tags: ['Lens Formula', 'Power (Dioptre)', 'Eye Defects', '6 Numericals'],
  },
  {
    num: 4, href: '/class-10/light-reflection-and-refraction/summary',
    icon: '📋', title: 'Exam Summary & Flashcards', colorClass: 'red',
    desc: 'All formulas in one place, interactive mind map, flip flashcards, MCQ practice quiz — perfect for last-minute board exam revision.',
    tags: ['All Formulas', 'Mind Map', 'Flashcards', 'MCQ Quiz'],
  },
];

const formulaPreviews = [
  { label: 'Mirror Formula', formula: '1/v + 1/u = 1/f', color: '#60a5fa' },
  { label: 'Mirror Magnification', formula: 'm = −v/u', color: '#60a5fa' },
  { label: "Snell's Law", formula: 'n₁ sin θ₁ = n₂ sin θ₂', color: '#34d399' },
  { label: 'Refractive Index', formula: 'n = c/v', color: '#34d399' },
  { label: 'Critical Angle', formula: 'sin C = 1/n', color: '#fbbf24' },
  { label: 'Lens Formula', formula: '1/v − 1/u = 1/f', color: '#a78bfa' },
  { label: 'Lens Magnification', formula: 'm = v/u', color: '#a78bfa' },
  { label: 'Power of Lens', formula: 'P = 1/f (Dioptre)', color: '#f43f5e' },
];

/* ─────────────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────────────── */
export default function LightChapterLanding() {
  return (
    <>
      <Script
        id="light-course-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
        strategy="beforeInteractive"
      />
      <Script
        id="light-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lightFaqJsonLd) }}
        strategy="beforeInteractive"
      />
      <Script
        id="light-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lightBreadcrumbJsonLd) }}
        strategy="beforeInteractive"
      />
      <Script
        id="light-webpage-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
        strategy="beforeInteractive"
      />

      <div className={styles.chapterContainer}>
        {/* ── HEADER ── */}
        <header className={styles.header}>
          <h1 className={styles.headerTitle}>Light: Reflection &amp; Refraction</h1>
          <p className={styles.headerSubtitle}>
            Class 10 Science (Physics) · Chapter 10 · CBSE / NCERT
          </p>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', marginTop: '0.5rem' }}>
            15 interactive simulations · 40+ AI-generated diagrams · 18 solved numericals · MCQs · Flashcards
          </p>
        </header>

        <main className={styles.contentWrapper}>

          {/* ── TOPIC CARDS ── */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Chapter Topics</h2>
            <p className={styles.textBlock}>
              Light enables us to see the world. This chapter covers two fundamental phenomena:
              {' '}<strong style={{ color: '#60a5fa' }}>Reflection</strong> — light bouncing off mirrors — and
              {' '}<strong style={{ color: '#34d399' }}>Refraction</strong> — light bending through lenses, water & glass.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
              {topics.map((topic) => (
                <Link
                  key={topic.num}
                  href={topic.href}
                  className={`${styles.topicCard} ${styles[topic.colorClass]}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                    <span className={styles.topicCardIcon}>{topic.icon}</span>
                    <span className={styles.topicCardBadge}>TOPIC {topic.num}</span>
                  </div>
                  <div className={styles.topicCardTitle}>{topic.title}</div>
                  <p className={styles.topicCardDesc}>{topic.desc}</p>
                  <div className={styles.topicCardTags}>
                    {topic.tags.map(tag => (
                      <span key={tag} className={styles.topicCardTag}>{tag}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── VISUAL LEARNING BOARD ── */}
          <ChapterVisualGallery />

          {/* ── WHAT YOU WILL LEARN ── */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>What You Will Learn</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
              {[
                '⚡ Laws of Reflection', '🪞 Plane Mirror Images', '🔵 Concave Mirror Cases',
                '⚪ Convex Mirror Uses', '📐 Mirror Formula', '💧 What is Refraction?',
                "📏 Snell's Law", '🔢 Refractive Index', '📦 Glass Slab Displacement',
                '💎 Total Internal Reflection', '🌐 Optical Fibre', '🌈 Prism & VIBGYOR',
                '🔭 Convex Lens (5 Cases)', '🔴 Concave Lens', '📐 Lens Formula',
                '⚡ Power of Lens', '👁️ Human Eye Anatomy', '🔴 Myopia Correction',
                '🟡 Hypermetropia', '🔬 Optical Instruments',
              ].map(item => (
                <div key={item} style={{
                  padding: '0.45rem 0.7rem', borderRadius: '6px',
                  background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)',
                  color: '#a1a1aa', fontSize: '0.82rem',
                }}>
                  {item}
                </div>
              ))}
            </div>
          </section>

          {/* ── KEY FORMULAS ── */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Key Formulas at a Glance</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
              {formulaPreviews.map(item => (
                <div key={item.label} className={styles.formulaPreviewCard}>
                  <div className={styles.formulaPreviewLabel}>{item.label}</div>
                  <div className={styles.formulaPreviewValue} style={{ color: item.color }}>{item.formula}</div>
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>
    </>
  );
}
