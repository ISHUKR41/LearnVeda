'use client';

/**
 * FILE: ChapterVisualGallery.tsx
 * PURPOSE: Lazy-loaded visual board for the Light chapter landing and summary pages.
 *          Uses the chapter's actual diagram assets so students see real visuals
 *          immediately, with skeletons while the images load.
 */

import React from 'react';
import { ImageWithSkeleton } from './SkeletonLoader';

type VisualCard = {
  src: string;
  alt: string;
  title: string;
  caption: string;
  tone: string;
};

const visualCards: VisualCard[] = [
  {
    src: '/images/light/laws-reflection-angles-diagram.png',
    alt: 'Laws of reflection — angle of incidence equals angle of reflection',
    title: 'Laws of Reflection',
    caption: '∠i = ∠r — incident ray, normal, and reflected ray all in one plane. Foundation of all mirror physics.',
    tone: '#3b82f6',
  },
  {
    src: '/images/light/concave-convex-mirror-comparison.png',
    alt: 'Concave vs convex mirror comparison',
    title: 'Concave vs Convex Mirror',
    caption: 'Side-by-side: concave mirror converges light to focal point F; convex mirror diverges rays, virtual focus behind.',
    tone: '#00ffcc',
  },
  {
    src: '/images/light/refraction-two-media-snell.png',
    alt: "Snell's law refraction at air-glass interface",
    title: "Refraction & Snell's Law",
    caption: 'Light bends toward normal when entering glass (denser medium). n₁ sin θ₁ = n₂ sin θ₂.',
    tone: '#f59e0b',
  },
  {
    src: '/images/light/tir-three-stages-diagram.png',
    alt: 'Total internal reflection three stages',
    title: 'TIR: 3 Stages',
    caption: 'Stage 1: normal refraction. Stage 2: critical angle (grazing). Stage 3: total internal reflection (100%).',
    tone: '#f43f5e',
  },
  {
    src: '/images/light/convex-lens-all-cases-diagram.png',
    alt: 'Convex lens image formation all cases',
    title: 'Lens Image Formation',
    caption: 'All 6 cases for convex lens: object at ∞, beyond 2F, at 2F, between F–2F, at F, between F–O.',
    tone: '#10b981',
  },
  {
    src: '/images/light/myopia-hypermetropia-correction.png',
    alt: 'Myopia and hypermetropia correction with lenses',
    title: 'Eye Defect Correction',
    caption: 'Myopia → concave lens (−D). Hypermetropia → convex lens (+D). Power in dioptres.',
    tone: '#a78bfa',
  },
  {
    src: '/images/light/mirror-formula-proof-diagram.png',
    alt: 'Mirror formula derivation diagram',
    title: 'Mirror Formula Proof',
    caption: '1/v + 1/u = 1/f — geometric derivation using similar triangles. Object, image, focal length labeled.',
    tone: '#06b6d4',
  },
  {
    src: '/images/light/optical-fibre-tir-diagram.png',
    alt: 'Optical fibre total internal reflection',
    title: 'Optical Fibre (TIR)',
    caption: 'Core (n=1.5) surrounded by cladding (n=1.48). Light bounces via TIR — used for internet and endoscopy.',
    tone: '#f472b6',
  },
];

export default function ChapterVisualGallery() {
  return (
    <section
      style={{
        marginTop: '2rem',
        padding: '1.25rem',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.015) 100%)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.78rem', letterSpacing: '0.18em', color: '#94a3b8', textTransform: 'uppercase' }}>
          Visual learning board
        </div>
        <h2 style={{ fontSize: '1.4rem', lineHeight: 1.2, color: '#f8fafc', margin: 0 }}>
          Real diagrams, lazy loaded with skeletons
        </h2>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '70ch' }}>
          These are the same chapter assets used in the topic pages. They are loaded only when needed, so the page stays responsive while the pictures remain visible and readable.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {visualCards.map((card) => (
          <article
            key={card.title}
            style={{
              overflow: 'hidden',
              borderRadius: '16px',
              border: `1px solid ${card.tone}22`,
              background: 'rgba(9, 9, 11, 0.72)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.24)',
            }}
          >
            <ImageWithSkeleton
              src={card.src}
              alt={card.alt}
              height={220}
              caption={card.caption}
            />
            <div style={{ padding: '0.9rem 1rem 1rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  borderRadius: '999px',
                  padding: '0.25rem 0.65rem',
                  color: card.tone,
                  border: `1px solid ${card.tone}33`,
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}
              >
                • {card.title}
              </div>
              <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6 }}>
                {card.caption}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}