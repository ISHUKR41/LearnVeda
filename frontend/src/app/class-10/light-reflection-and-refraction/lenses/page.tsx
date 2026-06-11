'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from '@/styles/LightChapter.module.css';
import LensesSimulation from '@/components/LightChapter/Simulations/LensesSimulation';
import FlashCard from '@/components/LightChapter/FlashCard';
import SolvedExamples from '@/components/LightChapter/SolvedExamples';

export default function SphericalLensesPage() {
  const [focusMode, setFocusMode] = useState(false);

  return (
    <div className={`${styles.chapterLayout} ${focusMode ? styles.focusModeActive : ''}`}>
      
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/class-10" className={styles.backButton}>
            ← Back to Chapters
          </Link>
          <h2>Spherical Lenses</h2>
        </div>
        
        <nav className={styles.sidebarNav}>
          <a href="#introduction" className={styles.navLink}>1. Introduction</a>
          <a href="#types" className={styles.navLink}>2. Types of Lenses</a>
          <a href="#power" className={styles.navLink}>3. Power of a Lens</a>
          <a href="#numericals" className={styles.navLink}>4. Solved Numericals</a>
          <a href="#simulation" className={styles.navLink}>5. Lenses Lab</a>
          <a href="#summary" className={styles.navLink}>6. Chapter Summary</a>
        </nav>

        <button 
          className={styles.focusModeToggle}
          onClick={() => setFocusMode(!focusMode)}
        >
          {focusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}
        </button>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        
        {/* Header Hero Image */}
        <section className={styles.heroSection} style={{ marginBottom: '3rem', position: 'relative', height: '300px', borderRadius: '16px', overflow: 'hidden' }}>
          <img 
            src="/images/light_lenses.png" 
            alt="Advanced Lenses Physics" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }}
            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop' }}
          />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '100%' }}>
            <motion.h1 
              className={styles.chapterTitle}
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            >
              Spherical Lenses
            </motion.h1>
            <p style={{ color: '#00ffcc', fontSize: '1.2rem', textShadow: '0 0 10px rgba(0,255,204,0.5)' }}>Shaping Light Through Glass</p>
          </div>
        </section>

        {/* 1. Introduction */}
        <section id="introduction" className={styles.contentSection}>
          <h2>1. Introduction to Spherical Lenses</h2>
          <p>
            You’ve seen people wearing spectacles, or maybe you use a magnifying glass to read small text. Both of these rely on lenses! 
            A <strong>lens</strong> is a transparent material bound by two surfaces, of which one or both surfaces are spherical.
          </p>
          <div className={styles.glassPanel}>
            <p><strong>Engaging Fact:</strong> The lenses in your eyes work exactly like the convex lenses in physics, constantly adjusting their focal length to project a crisp image onto your retina!</p>
          </div>
        </section>

        {/* 2. Types of Lenses */}
        <section id="types" className={styles.contentSection}>
          <h2>2. Types of Spherical Lenses</h2>
          <p>There are two primary types of lenses you need to know for Class 10:</p>

          <div style={{ marginBottom: '2rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333' }}>
            <img src="/images/light_convex_concave.png" alt="Convex and Concave Lenses" style={{ width: '100%', height: '250px', objectFit: 'cover', display: 'block' }} />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
            <FlashCard 
              front="Convex Lens (Converging)" 
              back="Thicker at the middle and thinner at the edges. It converges light rays to a point (focus). Real focus." 
            />
            <FlashCard 
              front="Concave Lens (Diverging)" 
              back="Thinner at the middle and thicker at the edges. It diverges light rays outwards. Virtual focus." 
            />
          </div>
        </section>

        {/* 3. Power of a Lens */}
        <section id="power" className={styles.contentSection}>
          <h2>3. Power of a Lens (P)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
            <div>
              <p>
                The ability of a lens to converge or diverge light rays is expressed as its <strong>Power</strong>. A lens with a short focal length bends light more sharply, giving it higher power.
              </p>
              <div className={styles.glassPanel}>
                <ul style={{ lineHeight: '1.8' }}>
                  <li><strong>Formula:</strong> <code>P = 1 / f (in meters)</code></li>
                  <li><strong>Unit:</strong> Dioptre (D)</li>
                  <li><strong>Sign Convention:</strong> Power of a convex lens is positive (+). Power of a concave lens is negative (-).</li>
                </ul>
              </div>
            </div>
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #333' }}>
              <img src="/images/light_lens_power.png" alt="Power of a Lens" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </div>
        </section>

        {/* 4. Solved Numericals */}
        <section id="numericals" className={styles.contentSection}>
          <h2>4. Master Numericals (Step-by-Step)</h2>
          <p>Lenses use a slightly different formula from mirrors. Here's how you master them:</p>

          <div className={styles.formulaBox}>
            <h3>Lens Formula:</h3>
            <p className={styles.mathEquation}>1/v - 1/u = 1/f</p>
            <p>Where: <strong>v</strong> = image distance, <strong>u</strong> = object distance, <strong>f</strong> = focal length</p>
            <hr style={{ borderColor: '#333', margin: '15px 0' }}/>
            <h3>Magnification (m):</h3>
            <p className={styles.mathEquation}>m = v / u</p>
          </div>

          <SolvedExamples 
            title="Deep Dive: Solved Numericals for Lenses"
            examples={[
              {
                id: 1,
                question: "A concave lens has focal length of 15 cm. At what distance should the object from the lens be placed so that it forms an image at 10 cm from the lens?",
                given: ["Focal length (f) = -15 cm (concave lens)", "Image distance (v) = -10 cm (virtual image is formed on the same side)"],
                formula: "1/v - 1/u = 1/f",
                solutionSteps: [
                  "1/(-10) - 1/u = 1/(-15)",
                  "-1/10 + 1/15 = 1/u",
                  "1/u = (-3 + 2) / 30",
                  "1/u = -1/30",
                  "u = -30 cm"
                ],
                answer: "The object distance is 30 cm in front of the lens.",
                realLife: "Peepholes in doors use concave lenses. They provide a wide field of view, showing a smaller, upright image of the person outside.",
                visualizerImage: "/assets/concave_lens_numerical.png"
              },
              {
                id: 2,
                question: "A 2.0 cm tall object is placed perpendicular to the principal axis of a convex lens of focal length 10 cm. The distance of the object from the lens is 15 cm. Find the nature, position and size of the image.",
                given: ["Object height (h) = +2.0 cm", "Focal length (f) = +10 cm (convex lens)", "Object distance (u) = -15 cm"],
                formula: "1/v - 1/u = 1/f  and  m = h'/h = v/u",
                solutionSteps: [
                  "1/v - 1/(-15) = 1/10",
                  "1/v + 1/15 = 1/10",
                  "1/v = 1/10 - 1/15 = (3 - 2)/30 = 1/30",
                  "v = +30 cm (Real image)",
                  "m = v/u = 30 / (-15) = -2",
                  "h' = m * h = -2 * 2.0 = -4.0 cm (Inverted)"
                ],
                answer: "The image is real, inverted, 30 cm behind the lens, and 4.0 cm tall.",
                realLife: "Movie projectors use convex lenses to project a highly magnified, real image onto the cinema screen.",
                visualizerImage: "/assets/convex_lens_numerical.png"
              },
              {
                id: 3,
                question: "Find the magnification produced by the convex lens in Example 2.",
                given: ["Image distance (v) = +30 cm", "Object distance (u) = -15 cm"],
                formula: "m = v / u",
                solutionSteps: [
                  "m = 30 / (-15)",
                  "m = -2"
                ],
                answer: "The magnification is -2, meaning the image is twice the size of the object and inverted.",
                realLife: "Microscopes stack multiple convex lenses to multiply their magnification, allowing us to see cells and bacteria.",
                visualizerImage: "/assets/lens_magnification.png"
              },
              {
                id: 4,
                question: "Find the power of a concave lens of focal length 2 m.",
                given: ["Focal length (f) = -2 m (concave lens)"],
                formula: "Power (P) = 1 / f(in meters)",
                solutionSteps: [
                  "P = 1 / (-2)",
                  "P = -0.5 D"
                ],
                answer: "The power of the lens is -0.5 Dioptre.",
                realLife: "Optometrists prescribe lenses in Dioptres. A prescription of -0.5 D means the person has mild myopia (nearsightedness) and needs a concave lens.",
                visualizerImage: "/assets/lens_power.png"
              }
            ]}
          />
        </section>

        {/* 5. Simulation */}
        <section id="simulation" className={styles.contentSection}>
          <h2>5. Spherical Lenses Lab (Simulation)</h2>
          <p>
            Experiment with Convex and Concave lenses! Move the object to instantly see the real-time ray tracing, and watch the values for `v` and `m` update dynamically.
          </p>
          <div style={{ marginTop: '2rem' }}>
            <LensesSimulation />
          </div>
        </section>

        {/* 6. Summary */}
        <section id="summary" className={styles.contentSection}>
          <h2>6. Exam Summary</h2>
          <div className={styles.glassPanel} style={{ borderLeft: '4px solid #ff00aa' }}>
            <ul>
              <li><strong>Convex Lenses</strong> converge light and can form both real and virtual images.</li>
              <li><strong>Concave Lenses</strong> diverge light and always form virtual, erect, and diminished images.</li>
              <li><strong>Lens Formula:</strong> 1/v - 1/u = 1/f</li>
              <li><strong>Magnification:</strong> m = v/u</li>
              <li><strong>Power:</strong> P = 1/f (in meters). Convex is positive, Concave is negative.</li>
            </ul>
          </div>
        </section>

      </main>
    </div>
  );
}
