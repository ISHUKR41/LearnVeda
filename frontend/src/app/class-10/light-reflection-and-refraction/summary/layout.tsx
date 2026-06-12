/**
 * FILE: summary/layout.tsx
 * PURPOSE: SEO metadata for the Light Chapter Summary & Quick Revision page.
 *          Structured data for Google Knowledge Panel and AI search engines.
 */

import type { Metadata } from 'next';
import Script from 'next/script';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://eduquest.replit.app';

export const metadata: Metadata = {
  title: 'Light Reflection & Refraction – Chapter Summary | Quick Revision Class 10 | EduQuest',
  description:
    'Quick revision summary of the complete Light – Reflection and Refraction chapter for Class 10 CBSE. All formulas, key terms, image formation tables, mind map, flashcards, and 30+ MCQs in one place. Perfect for last-minute board exam revision.',
  keywords: [
    'light reflection refraction summary class 10',
    'class 10 light chapter revision',
    'mirror formula lens formula summary',
    'light chapter all formulas class 10',
    'CBSE class 10 science revision',
    'light chapter MCQ class 10',
    'reflection refraction flashcards',
    'class 10 physics quick revision',
    'light chapter important questions',
    'EduQuest class 10 revision',
    'board exam light chapter',
    'class 10 optics summary',
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
    canonical: `${BASE}/class-10/light-reflection-and-refraction/summary`,
  },
  openGraph: {
    type: 'article',
    title: 'Light Reflection & Refraction – Complete Summary | Class 10 Revision | EduQuest',
    description:
      'All formulas, key points, MCQs and flashcards for Light chapter in one place. Best for last-minute Class 10 board exam revision.',
    url: `${BASE}/class-10/light-reflection-and-refraction/summary`,
    siteName: 'EduQuest',
    images: [
      {
        url: `${BASE}/images/light/concave-mirror-5-cases.png`,
        width: 1200,
        height: 900,
        alt: 'Light Chapter Summary for Class 10 CBSE',
      },
    ],
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Light Chapter Summary – Class 10 Quick Revision | EduQuest',
    description: 'All formulas, MCQs, flashcards for Light Reflection & Refraction. Best Class 10 revision resource.',
    images: [`${BASE}/images/light/concave-mirror-5-cases.png`],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: 'Light Reflection and Refraction – Chapter Summary (Class 10)',
  description:
    'Complete quick-revision summary of Light – Reflection and Refraction for CBSE Class 10 including all formulas, key concepts, mind map, flashcards, and MCQs.',
  url: `${BASE}/class-10/light-reflection-and-refraction/summary`,
  educationalLevel: 'Class 10 / Grade 10',
  learningResourceType: 'Summary / Revision Guide',
  teaches: [
    'Mirror Formula',
    'Lens Formula',
    'Laws of Reflection',
    "Snell's Law",
    'Total Internal Reflection',
    'Power of Lens',
    'Eye Defects',
  ],
  inLanguage: 'en-IN',
  provider: { '@type': 'EducationalOrganization', name: 'EduQuest', url: BASE },
  isPartOf: {
    '@type': 'Course',
    name: 'Class 10 Science: Light – Reflection and Refraction',
    url: `${BASE}/class-10/light-reflection-and-refraction`,
    provider: { '@type': 'EducationalOrganization', name: 'EduQuest', url: BASE },
  },
};

export default function SummaryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="summary-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        strategy="beforeInteractive"
      />
      {children}
    </>
  );
}
