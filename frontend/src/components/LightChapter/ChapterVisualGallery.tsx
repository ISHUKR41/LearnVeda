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
    src: '/images/light/concave-mirror-5-cases.png',
    alt: 'Concave mirror image formation cases',
    title: 'Reflection: 5 Image Cases',
    caption: 'A clear reference board for object positions, image positions, and nature of image in a concave mirror.',
    tone: '#3b82f6',
  },
  {
    src: '/images/light/topic4-refraction-snell.png',
    alt: "Snell's law and ray bending diagram",
    title: "Refraction: Snell's Law",
    caption: 'Shows how light bends when it enters a different medium, with angles and refractive index called out.',
    tone: '#f59e0b',
  },
  {
    src: '/images/light/topic7-tir-optical-fibre.png',
    alt: 'Total internal reflection in optical fibre',
    title: 'TIR and Optical Fibre',
    caption: 'A modern real-life application board linking critical angle, reflection inside fibre, and data transmission.',
    tone: '#f43f5e',
  },
  {
    src: '/images/light/topic5-lens-image-formation.png',
    alt: 'Lens image formation table',
    title: 'Lenses: Image Formation',
    caption: 'A study sheet for convex and concave lens cases, helping students connect object position with image outcome.',
    tone: '#10b981',
  },
  {
    src: '/images/light/topic6-lens-formula-power.png',
    alt: 'Lens formula and power reference sheet',
    title: 'Formula & Power',
    caption: 'The compact numerical toolkit for the chapter: lens formula, magnification, and power of lens.',
    tone: '#a78bfa',
  },
  {
    src: '/images/light/topic10-optical-phenomena.png',
    alt: 'Optical phenomena summary visual',
    title: 'Optical Phenomena',
    caption: 'A broad summary visual connecting mirrors, refraction, dispersion, and the human eye in one study flow.',
    tone: '#06b6d4',
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