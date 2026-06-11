import React from 'react';
import Link from 'next/link';
import styles from '@/styles/LightChapter.module.css';

export const metadata = {
  title: 'Class 10 Science: Light Reflection and Refraction',
  description: 'Master Light Reflection and Refraction for Class 10 Boards. Complete notes, MCQs, realistic simulations, and numerical examples.',
};

export default function LightChapterLanding() {
  return (
    <div className={styles.chapterContainer}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Light: Reflection & Refraction</h1>
        <p className={styles.headerSubtitle}>Class 10 Physics • Interactive Module</p>
      </header>

      <main className={styles.contentWrapper}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Chapter Overview</h2>
          <p className={styles.textBlock}>
            Light is a form of energy that enables us to see the world around us. In this chapter, we dive deep into the fascinating phenomena of <span className={styles.highlight}>reflection</span> by mirrors and <span className={styles.highlight}>refraction</span> by lenses.
          </p>
          
          <div className={styles.grid2}>
            <Link href="/class-10/light-reflection-and-refraction/reflection">
              <div className={styles.section} style={{ cursor: 'pointer', marginBottom: 0 }}>
                <h3 className={styles.numericalTitle}>1. Reflection of Light</h3>
                <p className={styles.textBlock} style={{ fontSize: '0.9rem', marginBottom: 0 }}>
                  Explore plane mirrors, spherical mirrors (concave/convex), mirror formula, and interactive ray tracing.
                </p>
              </div>
            </Link>

            <Link href="/class-10/light-reflection-and-refraction/refraction">
              <div className={styles.section} style={{ cursor: 'pointer', marginBottom: 0 }}>
                <h3 className={styles.numericalTitle}>2. Refraction of Light</h3>
                <p className={styles.textBlock} style={{ fontSize: '0.9rem', marginBottom: 0 }}>
                  Master Snell's law, refractive index, lenses, and the lens formula with detailed interactive simulations.
                </p>
              </div>
            </Link>
            <Link href="/class-10/light-reflection-and-refraction/lenses">
              <div className={styles.section} style={{ cursor: 'pointer', marginBottom: 0 }}>
                <h3 className={styles.numericalTitle}>3. Spherical Lenses</h3>
                <p className={styles.textBlock} style={{ fontSize: '0.9rem', marginBottom: 0 }}>
                  Convex and concave lenses, image formation, lens formula, magnification, and power of a lens.
                </p>
              </div>
            </Link>
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            <Link href="/class-10/light-reflection-and-refraction/summary">
              <div className={styles.section} style={{ cursor: 'pointer', borderColor: '#ff0055' }}>
                <h3 className={styles.numericalTitle} style={{ color: '#ff0055' }}>4. Exam Summary & Flashcards</h3>
                <p className={styles.textBlock} style={{ fontSize: '0.9rem', marginBottom: 0 }}>
                  Quick revision mind maps and flashcards to memorize sign conventions and formulas.
                </p>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
