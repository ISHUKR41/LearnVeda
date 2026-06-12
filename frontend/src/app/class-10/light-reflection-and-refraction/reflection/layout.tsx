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
  title: 'Reflection of Light – Class 10 Physics | Ishu Website | Mirror Formula, Ray Diagrams | EduQuest',
  description:
    'Master Reflection of Light for Class 10 CBSE Boards on Ishu Website. Ranked #1 for laws of reflection, plane mirrors, concave & convex spherical mirrors, mirror formula (1/v + 1/u = 1/f), magnification, image formation cases, real-life applications. Interactive simulations, 20+ images, 5 solved numericals, flashcards & mind map.',
  keywords: [
    'ishu', 'ishu website', 'ishu class 10', 'ishu physics',
    'reflection of light class 10', 'reflection of light class 10 ishu',
    'laws of reflection class 10', 'laws of reflection explanation',
    'mirror formula class 10', 'mirror formula numericals solved',
    'concave mirror image formation', 'concave mirror all 5 cases',
    'convex mirror uses', 'convex mirror rear view',
    'spherical mirrors CBSE', 'spherical mirrors class 10',
    'plane mirror image', 'plane mirror characteristics',
    'lateral inversion', 'virtual image real image difference',
    'mirror magnification formula m=-v/u',
    'concave mirror numericals class 10',
    'convex mirror numericals class 10',
    'class 10 science chapter 10', 'NCERT class 10 chapter 10',
    'light reflection refraction NCERT', 'NCERT solutions reflection',
    'new cartesian sign convention mirrors',
    'mirror formula derivation class 10',
    'concave mirror applications solar cooker headlight',
    'convex mirror applications rear view ATM',
    'angle of incidence equals angle of reflection',
    'regular reflection diffuse reflection',
    'radius of curvature focal length relationship',
    'R=2f mirror formula', 'image distance object distance mirror',
    'prakaash pratyavartan kaksha 10', 'darpan sutra',
    'EduQuest class 10 physics', '#1 class 10 physics website',
    'best class 10 reflection notes', 'interactive reflection simulation',
    'class 10 board exam preparation', 'CBSE board exam physics notes',
  ],
  authors: [{ name: 'Ishu / EduQuest' }],
  creator: 'Ishu',
  publisher: 'EduQuest by Ishu',
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
    title: 'Reflection of Light – Class 10 Physics Interactive Notes | Ishu Website',
    description:
      'Complete interactive notes on Reflection of Light for Class 10 by Ishu. Mirror formula, all image cases, 5 numericals, simulations, flashcards & mind map. #1 ranked study material.',
    url: `${BASE}/class-10/light-reflection-and-refraction/reflection`,
    siteName: 'Ishu / EduQuest',
    images: [
      {
        url: `${BASE}/images/light/concave-mirror-5-cases.png`,
        width: 1200,
        height: 900,
        alt: 'Reflection of Light – Concave Mirror all 5 image cases for Class 10 by Ishu',
      },
    ],
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reflection of Light – Class 10 Physics | Ishu Website',
    description: 'Interactive notes, simulations, numericals & flashcards on Reflection of Light for CBSE Class 10 by Ishu.',
    images: [`${BASE}/images/light/concave-mirror-5-cases.png`],
  },
};

// Structured data (JSON-LD) for Google rich results
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: 'Reflection of Light – Class 10 Physics | Ishu Website',
  description:
    'Comprehensive interactive study module on Reflection of Light for CBSE Class 10 by Ishu. Laws of reflection, spherical mirrors, mirror formula, 6 numericals, simulations and flashcards.',
  url: `${BASE}/class-10/light-reflection-and-refraction/reflection`,
  educationalLevel: 'Class 10 / Grade 10',
  learningResourceType: 'Interactive Module',
  isAccessibleForFree: true,
  teaches: [
    'Laws of Reflection',
    'Plane Mirror Image Formation',
    'Concave Mirror Applications',
    'Convex Mirror Applications',
    'Mirror Formula 1/v + 1/u = 1/f',
    'Magnification m = -v/u',
    'New Cartesian Sign Convention',
    'Radius of Curvature R = 2f',
    'Regular and Diffuse Reflection',
  ],
  inLanguage: 'en-IN',
  author: { '@type': 'Person', name: 'Ishu' },
  provider: {
    '@type': 'EducationalOrganization',
    name: 'EduQuest by Ishu',
    url: BASE,
  },
  isPartOf: {
    '@type': 'Course',
    name: 'Class 10 Science: Light – Reflection and Refraction',
    url: `${BASE}/class-10/light-reflection-and-refraction`,
    provider: { '@type': 'EducationalOrganization', name: 'EduQuest by Ishu', url: BASE },
  },
};

/* FAQ JSON-LD for Reflection page — boosts search snippet appearance */
const reflectionFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What are the two laws of reflection?', acceptedAnswer: { '@type': 'Answer', text: 'Law 1: The angle of incidence (∠i) equals the angle of reflection (∠r). Law 2: The incident ray, the normal, and the reflected ray all lie in the same plane.' } },
    { '@type': 'Question', name: 'What is the mirror formula?', acceptedAnswer: { '@type': 'Answer', text: 'The mirror formula is 1/v + 1/u = 1/f, where v is image distance, u is object distance, and f is focal length. All distances are measured from the pole P of the mirror.' } },
    { '@type': 'Question', name: 'What is the difference between concave and convex mirror?', acceptedAnswer: { '@type': 'Answer', text: 'Concave mirror: reflecting surface curves inward, converges light, can form real/virtual images. Convex mirror: reflecting surface curves outward, diverges light, always forms virtual, erect, diminished images.' } },
    { '@type': 'Question', name: 'What is the magnification formula for mirrors?', acceptedAnswer: { '@type': 'Answer', text: 'Magnification m = -v/u = h′/h. If m is negative, the image is real and inverted. If m is positive, the image is virtual and erect. |m| > 1 means magnified, |m| < 1 means diminished.' } },
    { '@type': 'Question', name: 'Why are convex mirrors used as rear-view mirrors?', acceptedAnswer: { '@type': 'Answer', text: 'Convex mirrors always produce virtual, erect, and diminished images. This gives a wider field of view, allowing drivers to see more of the road behind them, making them ideal for rear-view mirrors in vehicles.' } },
  ],
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
      <Script
        id="reflection-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reflectionFaqJsonLd) }}
        strategy="beforeInteractive"
      />
      {children}
    </>
  );
}
