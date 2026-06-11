import React from 'react';
import FlashCard from '@/components/LightChapter/FlashCard';
import MindMap from '@/components/LightChapter/MindMap';
import styles from '@/styles/LightChapter.module.css';

export const metadata = {
  title: 'Class 10 Light: Exam Summary & Mind Maps',
  description: 'Quick revision for Light Reflection and Refraction using interactive flashcards and mind maps.',
};

export default function SummaryPage() {
  const flashcardsData = [
    { front: 'Laws of Reflection', back: '1. Angle of incidence = Angle of reflection (∠i = ∠r)\n2. Incident ray, reflected ray, and normal lie in the same plane.' },
    { front: 'Mirror Formula', back: '1/v + 1/u = 1/f' },
    { front: 'Lens Formula', back: '1/v - 1/u = 1/f' },
    { front: 'Snell\'s Law', back: 'Ratio of sine of angle of incidence to sine of angle of refraction is constant (sin i / sin r = constant).' },
    { front: 'Power of a Lens (P)', back: 'Reciprocal of focal length in meters. P = 1/f(m). SI Unit is Diopter (D).' },
    { front: 'Magnification (m)', back: 'Mirrors: m = -v/u\nLenses: m = v/u' },
  ];

  return (
    <div className={styles.chapterContainer}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Exam Summary</h1>
        <p className={styles.headerSubtitle}>Quick Revision: Flashcards & Mind Maps</p>
      </header>

      <main className={styles.contentWrapper}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Chapter Mind Map</h2>
          <p className={styles.textBlock}>Visual representation of how all concepts connect.</p>
          <MindMap />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Interactive Flashcards</h2>
          <p className={styles.textBlock}>Click on a card to flip it and reveal the answer. Great for memorizing formulas before the board exam!</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
            {flashcardsData.map((data, index) => (
              <FlashCard key={index} front={data.front} back={data.back} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
