/**
 * FILE: reflection/layout.tsx
 * PURPOSE: SEO metadata for the Reflection of Light page.
 *          'use client' pages cannot export metadata directly, so we use a parent
 *          layout.tsx to inject title, description, OpenGraph, Twitter cards,
 *          structured data (JSON-LD), and canonical URL for Google/AI ranking.
 */

import type { Metadata } from 'next';
import Script from 'next/script';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://eduquest.replit.app';

export const metadata: Metadata = {
  title: 'Reflection of Light – Class 10 Physics | Mirror Formula, Ray Diagrams | EduQuest',
  description:
    'Master Reflection of Light for Class 10 CBSE Boards. Laws of reflection, plane mirrors, concave & convex spherical mirrors, mirror formula (1/v + 1/u = 1/f), magnification, image formation cases, real-life applications. Interactive simulations, 20+ images, 5 solved numericals, flashcards & mind map.',
  keywords: [
    'reflection of light class 10',
    'laws of reflection',
    'mirror formula class 10',
    'concave mirror image formation',
    'convex mirror uses',
    'spherical mirrors CBSE',
    'plane mirror image',
    'lateral inversion',
    'mirror magnification formula',
    'concave mirror numericals',
    'class 10 science chapter 10',
    'light reflection refraction NCERT',
    'EduQuest class 10 physics',
    'mirror formula derivation',
    'real virtual image mirrors',
  ],
  authors: [{ name: 'EduQuest' }],
  creator: 'EduQuest',
  publisher: 'EduQuest',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: {
    canonical: `${BASE}/class-10/light-reflection-and-refraction/reflection`,
  },
  openGraph: {
    type: 'article',
    title: 'Reflection of Light – Class 10 Physics Interactive Notes | EduQuest',
    description:
      'Complete interactive notes on Reflection of Light for Class 10. Mirror formula, all image cases, 5 numericals, simulations, flashcards & mind map.',
    url: `${BASE}/class-10/light-reflection-and-refraction/reflection`,
    siteName: 'EduQuest',
    images: [
      {
        url: `${BASE}/images/light/concave-mirror-5-cases.png`,
        width: 1200,
        height: 900,
        alt: 'Reflection of Light – Concave Mirror all 5 image cases for Class 10',
      },
    ],
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reflection of Light – Class 10 Physics | EduQuest',
    description: 'Interactive notes, simulations, numericals & flashcards on Reflection of Light for CBSE Class 10.',
    images: [`${BASE}/images/light/concave-mirror-5-cases.png`],
  },
};

// Structured data (JSON-LD) for Google rich results
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: 'Reflection of Light – Class 10 Physics',
  description:
    'Comprehensive interactive study module on Reflection of Light for CBSE Class 10 including laws of reflection, spherical mirrors, mirror formula, numericals, simulations and flashcards.',
  url: `${BASE}/class-10/light-reflection-and-refraction/reflection`,
  educationalLevel: 'Class 10 / Grade 10',
  learningResourceType: 'Interactive Module',
  teaches: [
    'Laws of Reflection',
    'Plane Mirror Image Formation',
    'Concave Mirror Applications',
    'Mirror Formula',
    'Magnification',
    'New Cartesian Sign Convention',
  ],
  inLanguage: 'en-IN',
  provider: {
    '@type': 'EducationalOrganization',
    name: 'EduQuest',
    url: BASE,
  },
  isPartOf: {
    '@type': 'Course',
    name: 'Class 10 Science: Light – Reflection and Refraction',
    url: `${BASE}/class-10/light-reflection-and-refraction`,
    provider: { '@type': 'EducationalOrganization', name: 'EduQuest', url: BASE },
  },
};

export default function ReflectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* JSON-LD structured data for Google and AI crawlers */}
      <Script
        id="reflection-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        strategy="beforeInteractive"
      />
      {children}
    </>
  );
}
