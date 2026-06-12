/**
 * FILE: class-10/light-reflection-and-refraction/page.tsx
 * PURPOSE: Landing page for the Light – Reflection and Refraction chapter.
 *          SERVER COMPONENT — exports metadata directly.
 *          All hover effects use pure CSS (no client event handlers).
 *          JSON-LD structured data for Google rich results and AI search engines.
 */

import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import Script from 'next/script';
import styles from '@/styles/LightChapter.module.css';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://eduquest.replit.app';

/* ─────────────────────────────────────────────────────
   SEO METADATA
───────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: 'Light – Reflection and Refraction | Class 10 Science CBSE | EduQuest',
  description:
    "Complete interactive Class 10 CBSE chapter on Light – Reflection and Refraction. Study reflection laws, spherical mirrors, Snell's Law, TIR, optical fibre, lenses, human eye and eye defects with 15 live simulations, 40+ AI diagrams, 18 solved numericals, MCQs and flashcards.",
  keywords: [
    'light reflection refraction class 10',
    'class 10 science chapter 10',
    'NCERT class 10 light',
    'CBSE class 10 light reflection refraction',
    'mirror formula class 10',
    'lens formula class 10',
    "snell's law class 10",
    'total internal reflection',
    'human eye class 10',
    'myopia hypermetropia class 10',
    'optical fibre class 10',
    'class 10 physics numericals',
    'EduQuest class 10',
  ],
  authors: [{ name: 'EduQuest' }],
  creator: 'EduQuest',
  publisher: 'EduQuest',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: { canonical: `${BASE}/class-10/light-reflection-and-refraction` },
  openGraph: {
    type: 'website',
    title: 'Light – Reflection and Refraction | Class 10 CBSE | EduQuest',
    description: 'Interactive Class 10 chapter: 15 live simulations, 40+ diagrams, 18 numericals, MCQs & flashcards.',
    url: `${BASE}/class-10/light-reflection-and-refraction`,
    siteName: 'EduQuest',
    images: [{ url: `${BASE}/images/light/concave-mirror-5-cases.png`, width: 1200, height: 900, alt: 'Class 10 Light Chapter' }],
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Class 10 Light – Reflection & Refraction | EduQuest',
    description: '15 interactive simulations, numericals, MCQs & flashcards for CBSE board exam.',
    images: [`${BASE}/images/light/concave-mirror-5-cases.png`],
  },
};

/* JSON-LD Course structured data */
const courseJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Class 10 Science: Light – Reflection and Refraction',
  description: 'Complete interactive course module on Light Reflection and Refraction for CBSE Class 10. Includes 15 live simulations, 40+ AI diagrams, 18 solved numericals, MCQs and flashcards.',
  url: `${BASE}/class-10/light-reflection-and-refraction`,
  provider: { '@type': 'EducationalOrganization', name: 'EduQuest', url: BASE },
  educationalLevel: 'Class 10 / Grade 10',
  inLanguage: 'en-IN',
  hasCourseInstance: [
    { '@type': 'CourseInstance', name: 'Reflection of Light', url: `${BASE}/class-10/light-reflection-and-refraction/reflection`, courseMode: 'online' },
    { '@type': 'CourseInstance', name: 'Refraction of Light', url: `${BASE}/class-10/light-reflection-and-refraction/refraction`, courseMode: 'online' },
    { '@type': 'CourseInstance', name: 'Spherical Lenses & Human Eye', url: `${BASE}/class-10/light-reflection-and-refraction/lenses`, courseMode: 'online' },
    { '@type': 'CourseInstance', name: 'Chapter Summary & Quick Revision', url: `${BASE}/class-10/light-reflection-and-refraction/summary`, courseMode: 'online' },
  ],
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
