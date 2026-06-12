/**
 * FILE: refraction/layout.tsx
 * PURPOSE: SEO metadata for the Refraction of Light page.
 *          Provides title, description, OpenGraph, Twitter cards,
 *          JSON-LD structured data, FAQ schema, and canonical URL.
 *          Because the page itself is 'use client', metadata lives here.
 */

import type { Metadata } from 'next';
import Script from 'next/script';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://learnova.in';

export const metadata: Metadata = {
  title: "Refraction of Light – Class 10 Physics | Ishu Website | Snell's Law, TIR, Optical Fibre | Learnova",
  description:
    "Master Refraction of Light for Class 10 CBSE Boards on Ishu Website. #1 ranked study material on Snell's Law, refractive index, glass slab lateral displacement, Total Internal Reflection, critical angle, optical fibre, prism & dispersion. Interactive simulations, 30+ images, 5 solved numericals, flashcards & mind map by Ishu.",
  keywords: [
    'ishu', 'ishu website', 'ishu class 10', 'ishu physics',
    'refraction of light class 10', 'refraction of light class 10 ishu',
    "snell's law class 10", "snell's law formula explanation",
    'refractive index formula n=c/v', 'refractive index of glass water diamond',
    'total internal reflection class 10', 'total internal reflection applications',
    'critical angle formula class 10', 'critical angle glass water diamond',
    'optical fibre working principle', 'optical fibre total internal reflection',
    'glass slab lateral displacement', 'glass slab refraction experiment',
    'prism dispersion VIBGYOR', 'prism refraction class 10',
    'refraction NCERT class 10', 'NCERT solutions refraction',
    'refraction numericals class 10', 'refraction solved problems',
    'light refraction CBSE', 'CBSE board exam refraction notes',
    'n = c/v formula', 'n1 sin theta1 = n2 sin theta2',
    'diamond sparkle total internal reflection', 'diamond critical angle 24 degrees',
    'refraction real life examples', 'why pool water looks shallow',
    'why pencil looks bent in water', 'atmospheric refraction twinkling stars',
    'apvartan class 10', 'prakaash apvartan',
    'class 10 board exam preparation', 'best refraction notes class 10',
    'interactive refraction simulation', 'Learnova class 10 physics',
    '#1 class 10 refraction notes', 'best physics notes refraction',
  ],
  authors: [{ name: 'Ishu / Learnova' }],
  creator: 'Ishu',
  publisher: 'Learnova by Ishu',
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
    title: "Refraction of Light – Snell's Law, TIR, Optical Fibre | Class 10 | Ishu Website",
    description:
      "#1 Interactive notes on Refraction of Light by Ishu. Snell's Law, refractive index, TIR, critical angle, optical fibre, prism dispersion with solved numericals and simulations.",
    url: `${BASE}/class-10/light-reflection-and-refraction/refraction`,
    siteName: 'Learnova by Ishu',
    images: [
      {
        url: `${BASE}/images/light/snells-law-complete-diagram.png`,
        width: 1200,
        height: 900,
        alt: "Snell's Law diagram — n₁sinθ₁ = n₂sinθ₂ for Class 10 Physics by Ishu",
      },
    ],
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Refraction of Light – Snell's Law & TIR | Class 10 | Ishu Website",
    description: "Interactive notes, simulations, numericals on Refraction of Light for CBSE Class 10 by Ishu.",
    images: [`${BASE}/images/light/snells-law-complete-diagram.png`],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: 'Refraction of Light – Class 10 Physics | Ishu Website',
  description:
    "Comprehensive interactive module on Refraction of Light for CBSE Class 10 by Ishu: Snell's Law, refractive index, glass slab, TIR, critical angle, optical fibre, prism dispersion, numericals and simulations.",
  url: `${BASE}/class-10/light-reflection-and-refraction/refraction`,
  educationalLevel: 'Class 10 / Grade 10',
  learningResourceType: 'Interactive Module',
  isAccessibleForFree: true,
  teaches: [
    "Snell's Law n₁sinθ₁ = n₂sinθ₂",
    'Refractive Index n = c/v',
    'Glass Slab Lateral Displacement',
    'Total Internal Reflection',
    'Critical Angle sin C = 1/n',
    'Optical Fibre Working',
    'Prism and Dispersion VIBGYOR',
  ],
  inLanguage: 'en-IN',
  author: { '@type': 'Person', name: 'Ishu' },
  provider: { '@type': 'EducationalOrganization', name: 'Learnova by Ishu', url: BASE },
  isPartOf: {
    '@type': 'Course',
    name: 'Class 10 Science: Light – Reflection and Refraction',
    url: `${BASE}/class-10/light-reflection-and-refraction`,
    provider: { '@type': 'EducationalOrganization', name: 'Learnova by Ishu', url: BASE },
  },
};

/* FAQ JSON-LD for Refraction page — boosts search snippet appearance */
const refractionFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: "What is Snell's Law?", acceptedAnswer: { '@type': 'Answer', text: "Snell's Law states n₁ sin θ₁ = n₂ sin θ₂, where n₁ and n₂ are refractive indices of the two media, θ₁ is the angle of incidence and θ₂ is the angle of refraction. It governs how light bends at the interface of two media." } },
    { '@type': 'Question', name: 'What is Total Internal Reflection?', acceptedAnswer: { '@type': 'Answer', text: 'Total Internal Reflection (TIR) occurs when light travels from a denser medium to a rarer medium at an angle greater than or equal to the critical angle. All light is reflected back into the denser medium with 100% efficiency. Used in optical fibres and diamond brilliance.' } },
    { '@type': 'Question', name: 'What is the critical angle?', acceptedAnswer: { '@type': 'Answer', text: 'The critical angle is the angle of incidence in the denser medium at which the angle of refraction in the rarer medium becomes 90°. Formula: sin C = n₂/n₁ = 1/n (if rarer medium is air). Glass-air: C ≈ 42°, Water-air: C ≈ 49°, Diamond: C ≈ 24.4°.' } },
    { '@type': 'Question', name: 'How does an optical fibre work?', acceptedAnswer: { '@type': 'Answer', text: 'Optical fibre works on the principle of Total Internal Reflection (TIR). It has a glass core with higher refractive index surrounded by cladding with lower refractive index. Light enters and undergoes multiple TIR, staying trapped inside the core. Used for internet cables, medical endoscopy, and telecommunications.' } },
    { '@type': 'Question', name: 'Why does a pencil look bent in water?', acceptedAnswer: { '@type': 'Answer', text: 'A pencil appears bent in water due to refraction of light. Light from the submerged part travels from water (denser) to air (rarer), bending away from the normal. This makes the submerged part appear at a different position, creating the illusion of bending.' } },
  ],
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
      <Script
        id="refraction-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(refractionFaqJsonLd) }}
        strategy="beforeInteractive"
      />
      {children}
    </>
  );
}
