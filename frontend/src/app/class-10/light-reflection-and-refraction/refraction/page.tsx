'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from '@/styles/LightChapter.module.css';
import RefractionSimulation from '@/components/LightChapter/Simulations/RefractionSimulation';
import SolvedExamples from '@/components/LightChapter/SolvedExamples';
import FlashCard from '@/components/LightChapter/FlashCard';

export default function RefractionPage() {
  const [focusMode, setFocusMode] = useState(false);

  return (
    <div className={`${styles.chapterLayout} ${focusMode ? styles.focusModeActive : ''}`}>
      
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/class-10" className={styles.backButton}>
            ← Back to Chapters
          </Link>
          <h2>Refraction</h2>
        </div>
        
        <nav className={styles.sidebarNav}>
          <a href="#introduction" className={styles.navLink}>1. Introduction</a>
          <a href="#laws" className={styles.navLink}>2. Laws & Snell's Law</a>
          <a href="#refractive-index" className={styles.navLink}>3. Refractive Index</a>
          <a href="#numericals" className={styles.navLink}>4. Solved Numericals</a>
          <a href="#simulation" className={styles.navLink}>5. Snell's Law Lab</a>
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
            src="/images/light_refraction.png" 
            alt="Advanced Refraction Physics" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }}
            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop' }}
          />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '100%' }}>
            <motion.h1 
              className={styles.chapterTitle}
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            >
              Refraction of Light
            </motion.h1>
            <p style={{ color: '#ff00aa', fontSize: '1.2rem', textShadow: '0 0 10px rgba(255,0,170,0.5)' }}>Mastering Bending of Light & Snell's Law</p>
          </div>
        </section>

        {/* 1. Introduction */}
        <section id="introduction" className={styles.contentSection}>
          <h2>1. Introduction to Refraction</h2>
          <p>
            Why does a pencil look bent when dipped in water? Why do pools look shallower than they actually are? 
            The answer is <strong>Refraction</strong>. Refraction is the bending of light when it passes from one transparent medium into another.
          </p>
          <div className={styles.glassPanel}>
            <p><strong>The cause of Refraction:</strong> The speed of light is different in different media. Light travels fastest in a vacuum (or air) at <code>3 × 10⁸ m/s</code>. When it enters a denser medium like glass, it slows down, causing the ray of light to bend.</p>
          </div>
        </section>

        {/* 2. Laws of Refraction */}
        <section id="laws" className={styles.contentSection}>
          <h2>2. Laws of Refraction & Snell's Law</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
            <div>
              <p>Just like reflection, refraction obeys specific laws:</p>
              <div className={styles.glassPanel}>
                <ol style={{ lineHeight: '1.8' }}>
                  <li>The incident ray, the refracted ray and the normal to the interface of two transparent media at the point of incidence, all lie in the same plane.</li>
                  <li><strong>Snell's Law:</strong> The ratio of sine of angle of incidence to the sine of angle of refraction is a constant, for the light of a given colour and for the given pair of media.</li>
                </ol>
                <p className={styles.mathEquation} style={{ marginTop: '1rem', fontSize: '1.5rem', color: '#ff00aa' }}>sin i / sin r = constant</p>
              </div>
            </div>
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #333' }}>
              <img src="/images/light_snells_law.png" alt="Snell's Law of Refraction" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </div>
        </section>

        {/* 3. Refractive Index */}
        <section id="refractive-index" className={styles.contentSection}>
          <h2>3. Refractive Index (n)</h2>
          <p>
            The extent of the change in direction that takes place in a given pair of media is expressed in terms of the refractive index. 
            It is essentially a measure of how much light slows down in a material.
          </p>

          <div style={{ marginBottom: '2rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333' }}>
            <img src="/images/light_refractive_index.png" alt="Refractive Index of Diamond" style={{ width: '100%', height: '250px', objectFit: 'cover', display: 'block' }} />
          </div>

          <div className={styles.formulaBox}>
            <h3>Absolute Refractive Index:</h3>
            <p className={styles.mathEquation}>nₘ = c / v</p>
            <p style={{ fontSize: '0.9rem', color: '#888' }}>
              Where <strong>c</strong> is the speed of light in vacuum (3 × 10⁸ m/s) and <strong>v</strong> is the speed of light in the medium.
            </p>
          </div>
          <div className={styles.glassPanel} style={{ marginTop: '1rem' }}>
            <p><strong>Did you know?</strong> Diamond has the highest refractive index of 2.42. This means light travels 2.42 times slower in a diamond than in a vacuum, which causes its brilliant sparkle!</p>
          </div>
          
          <div className={styles.glassPanel} style={{ borderLeft: '4px solid #ffcc00', marginTop: '1rem' }}>
            <h3>Bending Rules:</h3>
            <p>1. When light travels from a <strong>Rarer to Denser</strong> medium (e.g., Air to Glass), it slows down and bends <strong>TOWARDS</strong> the normal.</p>
            <p>2. When light travels from a <strong>Denser to Rarer</strong> medium (e.g., Water to Air), it speeds up and bends <strong>AWAY</strong> from the normal.</p>
          </div>
        </section>

        {/* 4. Solved Numericals */}
        <section id="numericals" className={styles.contentSection}>
          <h2>4. Master Numericals (Step-by-Step)</h2>
          <p>Refractive Index and Snell's Law numericals are very common in Class 10 board exams. Let's master them.</p>
          <div className={styles.formulaBox}>
            <h3>Key Formulas:</h3>
            <p className={styles.mathEquation}>n = c / v</p>
            <p>Where: <strong>c</strong> = 3 × 10⁸ m/s, <strong>v</strong> = speed in medium</p>
            <hr style={{ borderColor: '#333', margin: '15px 0' }}/>
            <p className={styles.mathEquation}>n₂₁ = n₂ / n₁ = v₁ / v₂ = sin(i) / sin(r)</p>
          </div>

          <SolvedExamples 
            title="Deep Dive: Solved Numericals for Refraction"
            examples={[
              {
                id: 1,
                question: "Light enters from air to glass having a refractive index of 1.50. What is the speed of light in the glass? (The speed of light in vacuum is 3 × 10⁸ m/s).",
                given: ["Refractive index of glass (n) = 1.50", "Speed of light in vacuum (c) = 3 × 10⁸ m/s"],
                formula: "n = c / v",
                solutionSteps: [
                  "1.50 = (3 × 10⁸) / v",
                  "v = (3 × 10⁸) / 1.50",
                  "v = 2 × 10⁸ m/s"
                ],
                answer: "The speed of light in glass is 2 × 10⁸ m/s.",
                realLife: "This explains why thick glass lenses bend light so effectively—they literally slow the light down significantly compared to air.",
                visualizerImage: "/assets/absolute_refractive.png"
              },
              {
                id: 2,
                question: "The refractive index of water is 1.33 and that of glass is 1.52. If the speed of light in water is 2.25 × 10⁸ m/s, find the speed of light in glass.",
                given: ["n_water = 1.33", "n_glass = 1.52", "v_water = 2.25 × 10⁸ m/s"],
                formula: "n_water * v_water = n_glass * v_glass (since n = c/v, c is constant)",
                solutionSteps: [
                  "1.33 * 2.25 × 10⁸ = 1.52 * v_glass",
                  "2.9925 × 10⁸ = 1.52 * v_glass",
                  "v_glass = (2.9925 × 10⁸) / 1.52",
                  "v_glass = 1.97 × 10⁸ m/s"
                ],
                answer: "The speed of light in glass is approximately 1.97 × 10⁸ m/s.",
                realLife: "Optical fibers use two different types of glass (core and cladding) with different refractive indices to trap light inside via total internal reflection.",
                visualizerImage: "/assets/refractive_index.png"
              },
              {
                id: 3,
                question: "A ray of light traveling in air enters obliquely into water. Does the light ray bend towards the normal or away from the normal? Why?",
                given: ["Light travels from Air (Rarer) to Water (Denser)"],
                formula: "Snell's Law: sin(i) / sin(r) = n2 / n1",
                solutionSteps: [
                  "Since water is optically denser than air (n_water > n_air).",
                  "The speed of light decreases when entering water.",
                  "To maintain the ratio, the angle of refraction (r) must be less than the angle of incidence (i)."
                ],
                answer: "The light ray bends TOWARDS the normal.",
                realLife: "This is why a pencil dipped in a glass of water looks broken or bent at the surface.",
                visualizerImage: "/assets/snells_law.png"
              },
              {
                id: 4,
                question: "Explain the lateral displacement of a light ray passing through a rectangular glass slab.",
                given: ["Incident ray angle (i)", "Refracted ray angle (r)", "Emergent ray angle (e)"],
                formula: "∠i = ∠e (in a parallel sided slab)",
                solutionSteps: [
                  "Light enters the slab (Air to Glass) and bends towards the normal.",
                  "Light exits the slab (Glass to Air) and bends away from the normal by the exact same amount.",
                  "The emergent ray is parallel to the incident ray but shifted sideways."
                ],
                answer: "The perpendicular distance between the original path of the incident ray and the emergent ray is the lateral displacement.",
                realLife: "Looking through a thick window pane at an angle slightly shifts the position of objects outside, though they don't look distorted.",
                visualizerImage: "/assets/glass_slab.png"
              }
            ]}
          />
        </section>

        {/* 5. Simulation */}
        <section id="simulation" className={styles.contentSection}>
          <h2>5. Snell's Law Lab (Simulation)</h2>
          <p>
            Experiment with different media and incidence angles. Notice what happens when light travels from a denser medium (like Glass) to a rarer medium (like Air) at a high angle—you might discover <strong>Total Internal Reflection</strong>!
          </p>
          <div style={{ marginTop: '2rem' }}>
            <RefractionSimulation />
          </div>
        </section>

        {/* 6. Summary */}
        <section id="summary" className={styles.contentSection}>
          <h2>6. Exam Summary</h2>
          <div className={styles.glassPanel} style={{ borderLeft: '4px solid #ff00aa' }}>
            <ul>
              <li><strong>Refraction</strong> is the bending of light caused by a change in its speed when it crosses from one medium to another.</li>
              <li>Light bends <strong>towards</strong> the normal when moving into a denser medium.</li>
              <li>Light bends <strong>away from</strong> the normal when moving into a rarer medium.</li>
              <li><strong>Snell's Law:</strong> The ratio of sin(i) to sin(r) is constant (Refractive Index).</li>
              <li>Higher refractive index means the medium is more "optically dense" and light travels slower in it.</li>
            </ul>
          </div>
        </section>

      </main>
    </div>
  );
}
