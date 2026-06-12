/**
 * FILE: refraction/layout.tsx
 * PURPOSE: SEO metadata for the Refraction of Light page.
 *          Provides title, description, OpenGraph, Twitter cards,
 *          JSON-LD structured data, and canonical URL.
 *          Because the page itself is 'use client', metadata lives here.
 */

import type { Metadata } from 'next';
import Script from 'next/script';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://eduquest.replit.app';

export const metadata: Metadata = {
  title: "Refraction of Light – Class 10 Physics | Snell's Law, TIR, Optical Fibre | EduQuest",
  description:
    "Master Refraction of Light for Class 10 CBSE Boards. Snell's Law, refractive index, glass slab lateral displacement, Total Internal Reflection, critical angle, optical fibre, prism & dispersion. Interactive simulations, 30+ images, 5 solved numericals, flashcards & mind map.",
  keywords: [
    'refraction of light class 10',
    "snell's law class 10",
    'refractive index formula',
    'total internal reflection',
    'critical angle formula',
    'optical fibre working',
    'glass slab lateral displacement',
    'prism dispersion VIBGYOR',
    'refraction NCERT class 10',
    'refraction numericals class 10',
    'light refraction CBSE',
    'n = c/v formula',
    'diamond sparkle total internal reflection',
    'EduQuest class 10 physics',
    'refraction real life examples',
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
    canonical: `${BASE}/class-10/light-reflection-and-refraction/refraction`,
  },
  openGraph: {
    type: 'article',
    title: "Refraction of Light – Snell's Law, TIR, Optical Fibre | Class 10 | EduQuest",
    description:
      "Interactive notes on Refraction of Light. Snell's Law, refractive index, TIR, critical angle, optical fibre, prism dispersion with solved numericals and simulations.",
    url: `${BASE}/class-10/light-reflection-and-refraction/refraction`,
    siteName: 'EduQuest',
    images: [
      {
        url: `${BASE}/images/light/snells-law-complete-diagram.png`,
        width: 1200,
        height: 900,
        alt: "Snell's Law diagram — n₁sinθ₁ = n₂sinθ₂ for Class 10 Physics",
      },
    ],
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Refraction of Light – Snell's Law & TIR | Class 10 | EduQuest",
    description: "Interactive notes, simulations, numericals on Refraction of Light for CBSE Class 10.",
    images: [`${BASE}/images/light/snells-law-complete-diagram.png`],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: 'Refraction of Light – Class 10 Physics',
  description:
    "Comprehensive interactive module on Refraction of Light for CBSE Class 10: Snell's Law, refractive index, glass slab, TIR, critical angle, optical fibre, prism dispersion, numericals and simulations.",
  url: `${BASE}/class-10/light-reflection-and-refraction/refraction`,
  educationalLevel: 'Class 10 / Grade 10',
  learningResourceType: 'Interactive Module',
  teaches: [
    "Snell's Law",
    'Refractive Index',
    'Glass Slab Lateral Displacement',
    'Total Internal Reflection',
    'Critical Angle',
    'Optical Fibre',
    'Prism and Dispersion',
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

export default function RefractionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="refraction-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        strategy="beforeInteractive"
      />
      {children}
    </>
  );
}
