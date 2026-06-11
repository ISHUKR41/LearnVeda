'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '@/styles/LightChapter.module.css';
import ReflectionSimulation from '@/components/LightChapter/Simulations/ReflectionSimulation';
import FlashCard from '@/components/LightChapter/FlashCard';
import SolvedExamples from '@/components/LightChapter/SolvedExamples';

export default function ReflectionPage() {
  const [focusMode, setFocusMode] = useState(false);

  return (
    <div className={`${styles.chapterLayout} ${focusMode ? styles.focusModeActive : ''}`}>
      
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/class-10" className={styles.backButton}>
            ← Back to Chapters
          </Link>
          <h2>Reflection</h2>
        </div>
        
        <nav className={styles.sidebarNav}>
          <a href="#introduction" className={styles.navLink}>1. Introduction</a>
          <a href="#laws" className={styles.navLink}>2. Laws of Reflection</a>
          <a href="#mirrors" className={styles.navLink}>3. Spherical Mirrors</a>
          <a href="#numericals" className={styles.navLink}>4. Solved Numericals</a>
          <a href="#simulation" className={styles.navLink}>5. Ray Tracing Lab</a>
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
            src="/images/light_reflection.png" 
            alt="Advanced Reflection Physics" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }}
            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=2000&auto=format&fit=crop' }}
          />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '100%' }}>
            <motion.h1 
              className={styles.chapterTitle}
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            >
              Reflection of Light
            </motion.h1>
            <p style={{ color: '#00ffcc', fontSize: '1.2rem', textShadow: '0 0 10px rgba(0,255,204,0.5)' }}>Mastering Mirrors & Ray Optics</p>
          </div>
        </section>

        {/* 1. Introduction */}
        <section id="introduction" className={styles.contentSection}>
          <h2>1. Introduction to Reflection</h2>
          <p>
            When light traveling in one medium strikes the surface of another medium and bounces back into the same medium, the phenomenon is called <strong>Reflection of Light</strong>.
          </p>
          <div className={styles.glassPanel}>
            <p><strong>Did you know?</strong> Highly polished surfaces, such as a mirror, reflect most of the light falling on them. This is why you can see your clear image in a mirror but not on a wooden wall!</p>
          </div>
        </section>

        {/* 2. Laws of Reflection */}
        <section id="laws" className={styles.contentSection}>
          <h2>2. Laws of Reflection</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
            <div>
              <p>Whenever light reflects off a smooth surface, it strictly obeys two laws:</p>
              <div className={styles.glassPanel}>
                <ol style={{ lineHeight: '1.8' }}>
                  <li>The angle of incidence is equal to the angle of reflection (<strong>∠i = ∠r</strong>).</li>
                  <li>The incident ray, the normal to the mirror at the point of incidence, and the reflected ray, all lie in the same plane.</li>
                </ol>
              </div>
            </div>
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #333' }}>
              <img src="/images/light_laws_reflection.png" alt="Laws of Reflection" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </div>
        </section>

        {/* 3. Spherical Mirrors */}
        <section id="mirrors" className={styles.contentSection}>
          <h2>3. Spherical Mirrors</h2>
          <p>Unlike flat mirrors, spherical mirrors are curved. They are derived from a hollow glass sphere.</p>
          
          <div style={{ marginBottom: '2rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333' }}>
            <img src="/images/light_spherical_mirrors.png" alt="Spherical Mirrors" style={{ width: '100%', height: '250px', objectFit: 'cover', display: 'block' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
          </div>
          <ul>
            <li><strong>Concave Mirror:</strong> A spherical mirror whose reflecting surface is curved inwards (faces towards the centre of the sphere).</li>
            <li><strong>Convex Mirror:</strong> A spherical mirror whose reflecting surface is curved outwards.</li>
          </ul>

          <h3>Key Terminology:</h3>
          <ul className={styles.terminologyList}>
            <li><strong>Pole (P):</strong> The centre of the reflecting surface of a spherical mirror.</li>
            <li><strong>Centre of Curvature (C):</strong> The centre of the hollow sphere of glass of which the mirror is a part.</li>
            <li><strong>Radius of Curvature (R):</strong> The radius of the hollow sphere of which the mirror is a part.</li>
            <li><strong>Principal Axis:</strong> The straight line passing through the pole and the centre of curvature.</li>
            <li><strong>Principal Focus (F):</strong> The point on the principal axis where all parallel light rays converge (concave) or appear to diverge from (convex) after reflection.</li>
            <li><strong>Focal Length (f):</strong> The distance between the pole and the principal focus. (R = 2f)</li>
          </ul>
        </section>

        {/* 4. Solved Numericals (Examples placed ABOVE the simulation as requested) */}
        <section id="numericals" className={styles.contentSection}>
          <h2>4. Master Numericals (Step-by-Step)</h2>
          <p>To master the physics of reflection, you must understand the <strong>Mirror Formula</strong> and <strong>Magnification</strong>.</p>
          
          <div className={styles.formulaBox}>
            <h3>Mirror Formula:</h3>
            <p className={styles.mathEquation}>1/v + 1/u = 1/f</p>
            <p>Where: <strong>v</strong> = image distance, <strong>u</strong> = object distance, <strong>f</strong> = focal length</p>
            <hr style={{ borderColor: '#333', margin: '15px 0' }}/>
            <h3>Magnification (m):</h3>
            <p className={styles.mathEquation}>m = h' / h = -v / u</p>
            <p>Where: <strong>h'</strong> = image height, <strong>h</strong> = object height</p>
          </div>

          <SolvedExamples 
            title="Deep Dive: Solved Numericals for Reflection"
            examples={[
              {
                id: 1,
                question: "An object is placed at a distance of 30 cm in front of a concave mirror of focal length 20 cm. Find the position and nature of the image.",
                given: ["Object distance (u) = -30 cm (by convention)", "Focal length (f) = -20 cm (concave mirror focus is in front)"],
                formula: "1/v + 1/u = 1/f",
                solutionSteps: [
                  "1/v + 1/(-30) = 1/(-20)",
                  "1/v = 1/30 - 1/20",
                  "1/v = (2 - 3) / 60",
                  "1/v = -1/60",
                  "v = -60 cm"
                ],
                answer: "The image is formed at a distance of 60 cm in front of the mirror. It is Real and Inverted.",
                realLife: "This concept is used in reflecting telescopes to capture real images of distant stars.",
                visualizerImage: "/assets/mirror_formula.png"
              },
              {
                id: 2,
                question: "Find the magnification produced by the mirror in Example 1. If the object height is 5 cm, what is the height of the image?",
                given: ["Object distance (u) = -30 cm", "Image distance (v) = -60 cm", "Object height (h) = 5 cm"],
                formula: "m = -v/u, m = h'/h",
                solutionSteps: [
                  "m = -(-60) / (-30)",
                  "m = 60 / -30 = -2",
                  "m = h' / h => -2 = h' / 5",
                  "h' = -10 cm"
                ],
                answer: "Magnification is -2. The image is 10 cm tall (inverted and twice the size).",
                realLife: "Dentists use concave mirrors closely to get a highly magnified reflection of your teeth.",
                visualizerImage: "/assets/magnification.png"
              },
              {
                id: 3,
                question: "An object is placed 10 cm from a convex mirror of focal length 15 cm. Find the position and nature of the image.",
                given: ["Object distance (u) = -10 cm", "Focal length (f) = +15 cm (convex mirror)"],
                formula: "1/v + 1/u = 1/f",
                solutionSteps: [
                  "1/v = 1/15 - 1/(-10)",
                  "1/v = 1/15 + 1/10",
                  "1/v = (2 + 3) / 30 = 5/30 = 1/6",
                  "v = +6 cm"
                ],
                answer: "Image is formed 6 cm behind the mirror. It is Virtual and Erect.",
                realLife: "This is exactly how a car's rear-view mirror works, forming a smaller, upright, and virtual image of vehicles.",
                visualizerImage: "/assets/sign_convention.png"
              },
              {
                id: 4,
                question: "An object 5.0 cm in length is placed at a distance of 20 cm in front of a convex mirror of radius of curvature 30 cm. Find the position, nature, and size of the image.",
                given: ["Height of object (h) = 5.0 cm", "Object distance (u) = -20 cm", "Radius (R) = +30 cm (convex mirror) -> f = +15 cm"],
                formula: "1/v + 1/u = 1/f, m = h'/h = -v/u",
                solutionSteps: [
                  "1/v = 1/15 - 1/(-20) = 1/15 + 1/20 = 7/60",
                  "v = 60/7 = 8.57 cm (virtual image behind mirror)",
                  "m = -(8.57) / (-20) = +0.428",
                  "h' = m * h = 0.428 * 5 = 2.14 cm"
                ],
                answer: "Image is 8.57 cm behind the mirror, virtual, erect, and 2.14 cm tall.",
                realLife: "Security mirrors in shops are convex. They form a diminished, virtual image allowing shop owners to see the entire store in one glance.",
                visualizerImage: "/assets/laws_reflection.png"
              }
            ]}
          />
        </section>

        {/* 5. Simulation */}
        <section id="simulation" className={styles.contentSection}>
          <h2>5. Advanced Ray Tracing Lab (Simulation)</h2>
          <p>
            Use this interactive, high-fidelity simulation to visualize how rays reflect off plane, concave, and convex mirrors. Adjust the object distance to instantly calculate `v` and `m` using the formulas you learned above!
          </p>
          {/* Note: The simulation renders identically in both Normal and Focus mode */}
          <div style={{ marginTop: '2rem' }}>
            <ReflectionSimulation />
          </div>
        </section>

        {/* 6. Summary */}
        <section id="summary" className={styles.contentSection}>
          <h2>6. Exam Summary</h2>
          <div className={styles.glassPanel} style={{ borderLeft: '4px solid #ff00aa' }}>
            <ul>
              <li>Light reflects according to two laws: Angle i = Angle r, and all rays lie in the same plane.</li>
              <li>Spherical mirrors can be Concave (converging) or Convex (diverging).</li>
              <li><strong>Mirror Formula:</strong> 1/v + 1/u = 1/f</li>
              <li><strong>Magnification:</strong> m = -v/u</li>
              <li>Real images have negative `v` and are inverted. Virtual images have positive `v` and are erect.</li>
            </ul>
          </div>
        </section>

      </main>
    </div>
  );
}
