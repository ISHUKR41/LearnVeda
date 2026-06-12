/**
 * FILE: lenses/layout.tsx
 * PURPOSE: SEO metadata for the Lenses & Human Eye page.
 *          JSON-LD structured data, FAQ schema, OpenGraph, Twitter cards, canonical URL.
 *          Page is 'use client', so metadata lives in this server layout.
 */

import type { Metadata } from 'next';
import Script from 'next/script';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://zingpath.in';

export const metadata: Metadata = {
  title: 'Lenses & Human Eye – Class 10 Physics | Ishu Website | Lens Formula, Power, Eye Defects | Zingpath',
  description:
    'Master Lenses and Human Eye for Class 10 CBSE Boards on Ishu Website. #1 study material: Convex & concave lenses, lens formula (1/v − 1/u = 1/f), magnification, power of lens (Dioptre), human eye anatomy, accommodation, myopia, hypermetropia corrections. Interactive simulations, 30+ images, 5 solved numericals by Ishu.',
  keywords: [
    'ishu', 'ishu website', 'ishu class 10', 'ishu physics',
    'lenses class 10', 'lenses class 10 ishu',
    'lens formula class 10', 'lens formula 1/v - 1/u = 1/f',
    'power of lens dioptre', 'power of lens formula P=1/f',
    'convex lens image formation', 'convex lens all cases',
    'concave lens image formation', 'concave lens uses myopia',
    'human eye class 10', 'human eye anatomy class 10',
    'myopia correction concave lens', 'myopia near sightedness',
    'hypermetropia correction convex lens', 'hypermetropia far sightedness',
    'accommodation of eye', 'power of accommodation',
    'near point far point eye', 'least distance of distinct vision 25cm',
    'NCERT lenses class 10', 'NCERT solutions lenses chapter',
    'magnification lens formula m=v/u', 'lens magnification class 10',
    'eye defects class 10', 'defects of vision and correction',
    'presbyopia astigmatism class 10', 'spectacle power dioptre',
    'lens numericals class 10', 'lens numericals solved',
    'convex lens ray diagram', 'concave lens ray diagram',
    'lens maker formula', 'combination of lenses power',
    'netra ka lens kaksha 10', 'drishti dosh',
    'class 10 board exam preparation lenses',
    'best lens notes class 10', 'interactive lens simulation',
    'Zingpath class 10 physics', '#1 class 10 lenses notes',
  ],
  authors: [{ name: 'Ishu / Zingpath' }],
  creator: 'Ishu',
  publisher: 'Zingpath by Ishu',
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
    title: 'Lenses & Human Eye – Class 10 Physics | Ishu Website | Zingpath',
    description:
      '#1 Interactive notes on Lenses & Human Eye by Ishu. Lens formula, power, image formation for 5 positions, myopia, hypermetropia corrections with simulations and numericals.',
    url: `${BASE}/class-10/light-reflection-and-refraction/lenses`,
    siteName: 'Zingpath by Ishu',
    images: [
      {
        url: `${BASE}/images/light/human-eye-full-anatomy.png`,
        width: 1200,
        height: 900,
        alt: 'Human Eye Anatomy – Class 10 Physics by Ishu',
      },
    ],
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lenses & Human Eye – Class 10 | Ishu Website | Zingpath',
    description: 'Interactive notes on lenses, lens formula, power & eye defects for CBSE Class 10 by Ishu.',
    images: [`${BASE}/images/light/human-eye-full-anatomy.png`],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: 'Lenses and the Human Eye – Class 10 Physics | Ishu Website',
  description:
    'Comprehensive interactive module on Lenses and Human Eye for CBSE Class 10 by Ishu covering convex/concave lenses, lens formula, power, human eye anatomy, accommodation, myopia, hypermetropia, and optical instruments.',
  url: `${BASE}/class-10/light-reflection-and-refraction/lenses`,
  educationalLevel: 'Class 10 / Grade 10',
  learningResourceType: 'Interactive Module',
  isAccessibleForFree: true,
  teaches: [
    'Convex Lens Image Formation (All 6 Cases)',
    'Concave Lens Image Formation',
    'Lens Formula 1/v − 1/u = 1/f',
    'Magnification m = v/u',
    'Power of Lens P = 1/f (Dioptre)',
    'Combination of Lenses',
    'Human Eye Anatomy',
    'Power of Accommodation',
    'Myopia (Near-sightedness) – Correction with Concave Lens',
    'Hypermetropia (Far-sightedness) – Correction with Convex Lens',
    'Presbyopia and Astigmatism',
  ],
  inLanguage: 'en-IN',
  author: { '@type': 'Person', name: 'Ishu' },
  provider: { '@type': 'EducationalOrganization', name: 'Zingpath by Ishu', url: BASE },
  isPartOf: {
    '@type': 'Course',
    name: 'Class 10 Science: Light – Reflection and Refraction',
    url: `${BASE}/class-10/light-reflection-and-refraction`,
    provider: { '@type': 'EducationalOrganization', name: 'Zingpath by Ishu', url: BASE },
  },
};

/* FAQ JSON-LD for Lenses page — boosts search snippet appearance */
const lensesFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is the lens formula?', acceptedAnswer: { '@type': 'Answer', text: 'The lens formula is 1/v − 1/u = 1/f, where v is image distance, u is object distance, and f is focal length. Note the minus sign (unlike mirror formula which has plus). For convex lens f is positive, for concave lens f is negative.' } },
    { '@type': 'Question', name: 'What is power of a lens?', acceptedAnswer: { '@type': 'Answer', text: 'Power of a lens P = 1/f, where f is focal length in metres. Unit is Dioptre (D). Convex lens has positive power (+D), concave lens has negative power (−D). Spectacle prescriptions are given in dioptres.' } },
    { '@type': 'Question', name: 'What is myopia and how is it corrected?', acceptedAnswer: { '@type': 'Answer', text: 'Myopia (near-sightedness) is a defect where distant objects appear blurry because the image forms in front of the retina. It is corrected using a concave (diverging) lens of appropriate negative power, which diverges the light rays before they enter the eye.' } },
    { '@type': 'Question', name: 'What is hypermetropia and how is it corrected?', acceptedAnswer: { '@type': 'Answer', text: 'Hypermetropia (far-sightedness) is a defect where nearby objects appear blurry because the image forms behind the retina. It is corrected using a convex (converging) lens of appropriate positive power, which converges the light rays before they enter the eye.' } },
    { '@type': 'Question', name: 'What is the difference between convex and concave lens?', acceptedAnswer: { '@type': 'Answer', text: 'Convex lens: thicker at centre, converges light, positive focal length, can form real or virtual images. Concave lens: thinner at centre, diverges light, negative focal length, always forms virtual, erect, diminished images. Convex lens used for hypermetropia, concave for myopia.' } },
  ],
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
      <Script
        id="lenses-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lensesFaqJsonLd) }}
        strategy="beforeInteractive"
      />
      {children}
    </>
  );
}
