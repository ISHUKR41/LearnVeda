'use client';

/**
 * FILE: summary/page.tsx
 * PURPOSE: Exam revision summary for Class 10 Light chapter.
 *          Includes: comprehensive interactive mind map, 16 flashcards,
 *          all formulas quick-reference, and links to all sub-topics.
 * LAST UPDATED: 2026-06-11
 */

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SkeletonCard } from '@/components/LightChapter/SkeletonLoader';
import styles from '@/styles/LightChapter.module.css';

const FlashCard = dynamic(() => import('@/components/LightChapter/FlashCard'), {
  ssr: false,
  loading: () => <SkeletonCard height={190} />,
});

const MindMap = dynamic(() => import('@/components/LightChapter/MindMap'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} height={220} />
      ))}
    </div>
  ),
});

const ChapterVisualGallery = dynamic(() => import('@/components/LightChapter/ChapterVisualGallery'), {
  ssr: false,
  loading: () => <SkeletonCard height={280} />,
});

/* ─── Formula Quick Reference Card ─── */
function FormulaCard({ title, formula, desc, color = '#00ffcc' }: {
  title: string; formula: string; desc: string; color?: string;
}) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1424 100%)',
      border: `1px solid ${color}33`,
      borderLeft: `4px solid ${color}`,
      borderRadius: 12,
      padding: '1.25rem 1.5rem',
      transition: 'all 0.2s',
    }}>
      <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: color, fontWeight: 700, marginBottom: '0.5rem' }}>{title}</div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.4rem', color: '#f4f4f5', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '0.03em' }}>{formula}</div>
      <div style={{ fontSize: '0.85rem', color: '#71717a', lineHeight: 1.6 }}>{desc}</div>
    </div>
  );
}

export default function SummaryPage() {

  const [activeSection, setActiveSection] = useState<'all' | 'reflection' | 'refraction' | 'lenses'>('all');

  /* ────── Flashcard data ────── */
  const allCards = [
    /* Reflection */
    { cat: 'reflection', front: 'First Law of Reflection', back: '∠i = ∠r\nThe angle of incidence equals angle of reflection.', color: '#3b82f6' },
    { cat: 'reflection', front: 'Second Law of Reflection', back: 'The incident ray, normal, and reflected ray all lie in the same plane.', color: '#3b82f6' },
    { cat: 'reflection', front: 'Mirror Formula', back: '1/v + 1/u = 1/f\nv = image dist, u = object dist, f = focal length\nAll measured from Pole (P).', color: '#00ffcc' },
    { cat: 'reflection', front: 'Magnification (Mirrors)', back: 'm = −v/u = h′/h\nm < 0 → Real + Inverted\nm > 0 → Virtual + Erect\n|m| > 1 → Magnified', color: '#00ffcc' },
    { cat: 'reflection', front: 'Radius vs Focal Length', back: 'R = 2f  →  f = R/2\nFocal length is always half the radius of curvature.', color: '#6366f1' },
    { cat: 'reflection', front: 'Concave Mirror Uses', back: '• Solar cooker (at focus)\n• Torch/flashlight (at focus)\n• Dentist/makeup mirror (virtual, magnified)\n• Reflecting telescope', color: '#6366f1' },
    { cat: 'reflection', front: 'Convex Mirror Properties', back: 'Always forms Virtual + Erect + Diminished image.\nField of view is wide.\nUsed in: rear-view mirrors, security cameras, shop mirrors.', color: '#f59e0b' },
    /* Refraction */
    { cat: 'refraction', front: "Snell's Law", back: 'n₁ sin θ₁ = n₂ sin θ₂\nOr: sin i / sin r = n₂₁ = constant\nRare→Dense: bends toward normal', color: '#f59e0b' },
    { cat: 'refraction', front: 'Refractive Index (n)', back: 'n = c/v = sin i / sin r\nc = 3×10⁸ m/s (vacuum)\nAir: 1.00 · Water: 1.33 · Glass: 1.52 · Diamond: 2.42', color: '#f59e0b' },
    { cat: 'refraction', front: 'Total Internal Reflection', back: 'Occurs when: Dense → Rare + angle ≥ θ_c\nsin θ_c = 1/n\nGlass-air: θ_c ≈ 42°\nUsed in: optical fibres, diamonds, periscope prisms', color: '#f43f5e' },
    { cat: 'refraction', front: 'Glass Slab Refraction', back: 'Emergent ray is PARALLEL to incident ray.\nLateral displacement depends on slab thickness and angle.\nNo net change in direction — only lateral shift.', color: '#10b981' },
    /* Lenses */
    { cat: 'lenses', front: 'Lens Formula', back: '1/v − 1/u = 1/f\nNOTE: Minus sign (not plus like mirror formula!)\nv = image dist, u = object dist, f = focal length', color: '#10b981' },
    { cat: 'lenses', front: 'Magnification (Lenses)', back: 'm = v/u = h′/h\n(No minus sign — unlike mirror magnification!)\nm > 0 → Virtual+Erect  |  m < 0 → Real+Inverted', color: '#10b981' },
    { cat: 'lenses', front: 'Power of a Lens', back: 'P = 1/f (f must be in metres)\nUnit: Diopter (D) = m⁻¹\n+ve P → Convex lens\n−ve P → Concave lens\nCombined: P = P₁ + P₂', color: '#3b82f6' },
    { cat: 'lenses', front: 'Myopia vs Hypermetropia', back: 'Myopia (near-sighted): image in front of retina → Concave lens (−D)\nHypermetropia (far-sighted): image behind retina → Convex lens (+D)', color: '#a78bfa' },
    { cat: 'lenses', front: 'Concave vs Convex Lens', back: 'Convex: converging, +f, can form real+virtual\nConcave: diverging, −f, always virtual+erect+diminished\nConvex uses: camera, eye, magnifier, projector\nConcave uses: specs for myopia', color: '#a78bfa' },
  ];

  const filtered = activeSection === 'all' ? allCards
    : allCards.filter(c => c.cat === activeSection);

  return (
    <div className={styles.chapterContainer}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Exam Summary</h1>
        <p className={styles.headerSubtitle}>Light — Reflection & Refraction · Class 10 Physics · Quick Revision</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
          <Link href="/class-10/light-reflection-and-refraction/reflection"
            style={{ padding: '0.5rem 1.25rem', background: 'rgba(0,255,204,0.08)', border: '1px solid rgba(0,255,204,0.25)', borderRadius: '8px', textDecoration: 'none', color: '#00ffcc', fontSize: '0.85rem', fontWeight: 600 }}>
            ← Reflection
          </Link>
          <Link href="/class-10/light-reflection-and-refraction/refraction"
            style={{ padding: '0.5rem 1.25rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '8px', textDecoration: 'none', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 600 }}>
            ← Refraction
          </Link>
          <Link href="/class-10/light-reflection-and-refraction/lenses"
            style={{ padding: '0.5rem 1.25rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '8px', textDecoration: 'none', color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>
            ← Lenses
          </Link>
        </div>
      </header>

      <main className={styles.contentWrapper}>

        {/* ══ VISUAL ATLAS ══ */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🖼️ Visual Atlas</h2>
          <p className={styles.textBlock}>
            Chapter diagrams and study boards are lazy loaded here so the revision page stays fast while still showing the core visuals.
          </p>
          <ChapterVisualGallery />
        </section>

        {/* ══ CONCEPT MAP ══ */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>📊 Concept Mind Map</h2>
          <p className={styles.textBlock}>
            Click any node to highlight its connections. Use this to quickly see how all topics relate.
          </p>
          <MindMap />
        </section>

        {/* ══ FORMULA QUICK REFERENCE ══ */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>⚡ Formula Quick Reference</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            <FormulaCard
              title="Mirror Formula"
              formula="1/v + 1/u = 1/f"
              desc="v = image dist, u = object dist, f = focal length. All from Pole. Concave: f < 0. Convex: f > 0."
              color="#00ffcc"
            />
            <FormulaCard
              title="Mirror Magnification"
              formula="m = −v/u"
              desc="Negative m → Real + Inverted. Positive m → Virtual + Erect. |m| > 1 → Magnified."
              color="#3b82f6"
            />
            <FormulaCard
              title="R = 2f (Mirrors)"
              formula="f = R / 2"
              desc="Focal length is half the radius of curvature. Always true for spherical mirrors."
              color="#6366f1"
            />
            <FormulaCard
              title="Snell's Law"
              formula="n₁ sin θ₁ = n₂ sin θ₂"
              desc="Rare → Dense: bends toward normal. Dense → Rare: bends away. Used in all refraction problems."
              color="#f59e0b"
            />
            <FormulaCard
              title="Refractive Index"
              formula="n = c / v"
              desc="c = 3×10⁸ m/s (vacuum). n always ≥ 1. Higher n = slower light = denser medium."
              color="#f59e0b"
            />
            <FormulaCard
              title="Critical Angle"
              formula="sin θ_c = 1/n"
              desc="For dense-rare interface. When θ ≥ θ_c: Total Internal Reflection. Glass-air: θ_c ≈ 42°."
              color="#f43f5e"
            />
            <FormulaCard
              title="Lens Formula"
              formula="1/v − 1/u = 1/f"
              desc="NOTE: Minus sign (unlike mirror formula!). Convex: f > 0. Concave: f < 0."
              color="#10b981"
            />
            <FormulaCard
              title="Lens Magnification"
              formula="m = v / u"
              desc="NOTE: No minus sign (unlike mirror magnification!). +m → Virtual+Erect. −m → Real+Inverted."
              color="#10b981"
            />
            <FormulaCard
              title="Power of Lens"
              formula="P = 1/f (metres)"
              desc="Unit: Diopter (D). +D → Convex. −D → Concave. Combined lenses: P = P₁ + P₂."
              color="#a78bfa"
            />
          </div>

          {/* Sign convention summary table */}
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ color: '#f4f4f5', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 700 }}>Sign Convention Quick Table</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(0,255,204,0.07)' }}>
                    {['Quantity', 'Concave Mirror', 'Convex Mirror', 'Convex Lens', 'Concave Lens'].map(h => (
                      <th key={h} style={{ padding: '0.65rem 0.9rem', textAlign: 'left', borderBottom: '1px solid rgba(0,255,204,0.15)', color: '#00ffcc', fontWeight: 700, fontSize: '0.82rem' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Focal length (f)', '−ve', '+ve', '+ve', '−ve'],
                    ['Object distance (u)', '−ve (always)', '−ve (always)', '−ve (always)', '−ve (always)'],
                    ['Real image (v)', '−ve', 'N/A (no real)', '+ve', 'N/A (no real)'],
                    ['Virtual image (v)', '+ve', '+ve', '−ve', '−ve'],
                    ['Magnification real', '−ve', 'N/A', '−ve', 'N/A'],
                    ['Magnification virtual', '+ve', '+ve', '+ve', '+ve'],
                  ].map((row, ri) => (
                    <tr key={ri} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: ri % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                      {row.map((cell, ci) => (
                        <td key={ci} style={{
                          padding: '0.6rem 0.9rem',
                          color: ci === 0 ? '#f4f4f5' : cell.includes('+ve') ? '#10b981' : cell.includes('−ve') ? '#f43f5e' : '#71717a',
                          fontWeight: ci === 0 ? 600 : 400,
                          fontFamily: ci > 0 ? 'monospace' : 'inherit',
                        }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ══ FLASHCARDS ══ */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🃏 Interactive Flashcards (16 Cards)</h2>
          <p className={styles.textBlock}>
            Click any card to flip it and reveal the answer. Filter by topic using the buttons below.
          </p>

          {/* Filter buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
            {[
              { key: 'all', label: 'All Topics', count: allCards.length, color: '#00ffcc' },
              { key: 'reflection', label: 'Reflection', count: allCards.filter(c => c.cat === 'reflection').length, color: '#3b82f6' },
              { key: 'refraction', label: 'Refraction', count: allCards.filter(c => c.cat === 'refraction').length, color: '#f59e0b' },
              { key: 'lenses', label: 'Lenses', count: allCards.filter(c => c.cat === 'lenses').length, color: '#10b981' },
            ].map(btn => (
              <button
                key={btn.key}
                onClick={() => setActiveSection(btn.key as any)}
                style={{
                  padding: '0.55rem 1.1rem',
                  borderRadius: '8px',
                  border: `1px solid ${activeSection === btn.key ? btn.color : 'rgba(255,255,255,0.1)'}`,
                  background: activeSection === btn.key ? `${btn.color}15` : 'transparent',
                  color: activeSection === btn.key ? btn.color : '#71717a',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                {btn.label} ({btn.count})
              </button>
            ))}
          </div>

          <div className={styles.flashcardGrid}>
            {filtered.map((card, i) => (
              <FlashCard key={`${activeSection}-${i}`} front={card.front} back={card.back} accentColor={card.color} />
            ))}
          </div>
        </section>

        {/* ══ LAST-MINUTE TIPS ══ */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🎯 Last-Minute Board Exam Tips</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {[
              { emoji: '📝', tip: 'Mirror formula has +: 1/v + 1/u = 1/f. Lens formula has −: 1/v − 1/u = 1/f. Easy to confuse under pressure!', color: '#00ffcc' },
              { emoji: '🔢', tip: 'Mirror magnification has − sign: m = −v/u. Lens magnification has no − sign: m = v/u. Remember this difference.', color: '#3b82f6' },
              { emoji: '🪞', tip: 'Concave mirror f is −ve. Convex mirror f is +ve. Concave lens f is −ve. Convex lens f is +ve.', color: '#6366f1' },
              { emoji: '🔍', tip: 'Real image always on same side as reflected rays (mirrors) or opposite side from object (lenses). Virtual image is always erect.', color: '#10b981' },
              { emoji: '🌈', tip: "TIR needs dense→rare + angle ≥ critical. Critical angle formula: sin θ_c = 1/n or n₂/n₁. Don't forget it applies only to dense→rare.", color: '#f59e0b' },
              { emoji: '💡', tip: 'For combined lenses: P_total = P₁ + P₂ (simpler). Alternatively: 1/f_net = 1/f₁ + 1/f₂.', color: '#a78bfa' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                viewport={{ once: true }}
                style={{
                  background: `${item.color}08`,
                  border: `1px solid ${item.color}25`,
                  borderLeft: `3px solid ${item.color}`,
                  borderRadius: 10,
                  padding: '1.1rem 1.25rem',
                  fontSize: '0.9rem',
                  color: '#d4d4d8',
                  lineHeight: 1.7,
                }}
              >
                <span style={{ fontSize: '1.3rem', display: 'block', marginBottom: '0.4rem' }}>{item.emoji}</span>
                {item.tip}
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══ CHAPTER NAVIGATION ══ */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>📚 Chapter Navigation</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
            {[
              { href: '/class-10/light-reflection-and-refraction/reflection', title: '1. Reflection of Light', desc: 'Laws, spherical mirrors, mirror formula, magnification', color: '#00ffcc' },
              { href: '/class-10/light-reflection-and-refraction/refraction', title: '2. Refraction of Light', desc: "Snell's law, refractive index, TIR, optical fibres", color: '#f59e0b' },
              { href: '/class-10/light-reflection-and-refraction/lenses', title: '3. Spherical Lenses', desc: 'Convex/concave, lens formula, power, human eye', color: '#10b981' },
              { href: '/class-10', title: '← Back to Class 10', desc: 'All subjects and chapters', color: '#a78bfa' },
            ].map(nav => (
              <Link key={nav.href} href={nav.href}
                style={{
                  display: 'block',
                  padding: '1.1rem 1.25rem',
                  background: `${nav.color}06`,
                  border: `1px solid ${nav.color}22`,
                  borderRadius: 12,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}>
                <div style={{ color: nav.color, fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>{nav.title}</div>
                <div style={{ color: '#71717a', fontSize: '0.83rem', lineHeight: 1.5 }}>{nav.desc}</div>
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
