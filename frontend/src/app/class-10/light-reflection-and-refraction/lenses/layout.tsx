/**
 * FILE: lenses/layout.tsx
 * PURPOSE: SEO metadata for the Lenses & Human Eye page.
 *          JSON-LD structured data, OpenGraph, Twitter cards, canonical URL.
 *          Page is 'use client', so metadata lives in this server layout.
 */

import type { Metadata } from 'next';
import Script from 'next/script';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://eduquest.replit.app';

export const metadata: Metadata = {
  title: 'Lenses & Human Eye – Class 10 Physics | Lens Formula, Power, Eye Defects | EduQuest',
  description:
    'Master Lenses and the Human Eye for Class 10 CBSE Boards. Convex & concave lenses, lens formula (1/v − 1/u = 1/f), magnification, power of lens (Dioptre), human eye anatomy, accommodation, myopia, hypermetropia & their corrections. Interactive simulations, 25+ images, 5 solved numericals.',
  keywords: [
    'lenses class 10',
    'lens formula class 10',
    'power of lens dioptre',
    'convex lens image formation',
    'concave lens uses',
    'human eye class 10',
    'myopia correction concave lens',
    'hypermetropia correction convex lens',
    'accommodation of eye',
    'near point far point eye',
    'NCERT lenses class 10',
    'magnification lens formula',
    'eye defects class 10',
    'EduQuest class 10 physics',
    'lens numericals class 10',
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
    canonical: `${BASE}/class-10/light-reflection-and-refraction/lenses`,
  },
  openGraph: {
    type: 'article',
    title: 'Lenses & Human Eye – Class 10 Physics | Lens Formula, Power, Eye Defects | EduQuest',
    description:
      'Interactive notes on Lenses & Human Eye. Lens formula, power, image formation for 5 positions, myopia, hypermetropia corrections with simulations and numericals.',
    url: `${BASE}/class-10/light-reflection-and-refraction/lenses`,
    siteName: 'EduQuest',
    images: [
      {
        url: `${BASE}/images/light/human-eye-full-anatomy.png`,
        width: 1200,
        height: 900,
        alt: 'Human Eye Anatomy – Class 10 Physics for CBSE',
      },
    ],
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lenses & Human Eye – Class 10 | EduQuest',
    description: 'Interactive notes on lenses, lens formula, power & eye defects for CBSE Class 10.',
    images: [`${BASE}/images/light/human-eye-full-anatomy.png`],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: 'Lenses and the Human Eye – Class 10 Physics',
  description:
    'Comprehensive interactive module on Lenses and Human Eye for CBSE Class 10 covering convex/concave lenses, lens formula, power, human eye anatomy, accommodation, myopia, hypermetropia, and optical instruments.',
  url: `${BASE}/class-10/light-reflection-and-refraction/lenses`,
  educationalLevel: 'Class 10 / Grade 10',
  learningResourceType: 'Interactive Module',
  teaches: [
    'Convex and Concave Lenses',
    'Lens Formula',
    'Power of Lens',
    'Human Eye Anatomy',
    'Accommodation',
    'Myopia and Hypermetropia',
    'Eye Defect Corrections',
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

export default function LensesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="lenses-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        strategy="beforeInteractive"
      />
      {children}
    </>
  );
}
