'use client';

/**
 * FILE: reflection/page.tsx
 * PURPOSE: Comprehensive Class 10 Reflection of Light page.
 *          Includes: 5 topic images, 5 solved numericals, 2 interactive simulations,
 *          real-life examples, MCQ quiz, summary flashcards, and full content.
 *          All images use /images/light/ correct path with Unsplash fallback.
 *          Examples are placed ABOVE simulations as per curriculum design.
 * LAST UPDATED: 2026-06-11
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '@/styles/LightChapter.module.css';
import ReflectionSimulation from '@/components/LightChapter/Simulations/ReflectionSimulation';
import FlashCard from '@/components/LightChapter/FlashCard';
import SolvedExamples from '@/components/LightChapter/SolvedExamples';

/* ────────────────────────────────────────────────────────────────────
   HELPER: Robust image component with onError fallback to Unsplash
──────────────────────────────────────────────────────────────────── */
function TopicImage({ src, alt, fallback, caption, height = 240 }: {
  src: string;
  alt: string;
  fallback: string;
  caption: string;
  height?: number;
}) {
  return (
    <div className={styles.imageCard}>
      <img
        src={src} alt={alt}
        style={{ height, width: '100%', objectFit: 'cover' }}
        onError={(e) => { e.currentTarget.src = fallback; }}
      />
      <div className={styles.imageCardCaption}>{caption}</div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   INLINE SIM: Laws of Reflection interactive demo (∠i = ∠r)
──────────────────────────────────────────────────────────────────── */
function LawsOfReflectionSim() {
  const [angle, setAngle] = useState(40);
  const rad = (angle * Math.PI) / 180;
  const cx = 400; const cy = 300; const len = 200;

  // Incident ray comes from top-left
  const ix = cx - len * Math.sin(rad);
  const iy = cy - len * Math.cos(rad);
  // Reflected ray goes to top-right (same angle, opposite side)
  const rx = cx + len * Math.sin(rad);
  const ry = cy - len * Math.cos(rad);
  // Normal: vertical line
  const nx1 = cx; const ny1 = cy - 180;
  const nx2 = cx; const ny2 = cy + 80;

  return (
    <div className={styles.simulationContainer} style={{ background: '#050508', minHeight: 420 }}>
      <div className={styles.simulationLabel}>LIVE SIMULATION — Laws of Reflection (∠i = ∠r)</div>
      <svg width="100%" viewBox="0 0 800 420" style={{ display: 'block' }}>
        {/* Mirror surface */}
        <line x1="100" y1="300" x2="700" y2="300" stroke="#00ffcc" strokeWidth="3" strokeLinecap="round"/>
        <text x="720" y="305" fill="#00ffcc" fontSize="13" fontWeight="700">Mirror</text>

        {/* Normal (dashed) */}
        <line x1={nx1} y1={ny1} x2={nx2} y2={ny2}
          stroke="#4b5563" strokeWidth="1.5" strokeDasharray="8 5"/>
        <text x={cx + 6} y={ny1 + 14} fill="#6b7280" fontSize="11">Normal</text>

        {/* Incident ray — yellow */}
        <defs>
          <marker id="arr-i" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill="#f59e0b"/>
          </marker>
          <marker id="arr-r" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill="#3b82f6"/>
          </marker>
        </defs>
        <line x1={ix} y1={iy} x2={cx} y2={cy}
          stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#arr-i)"/>
        {/* Reflected ray — blue */}
        <line x1={cx} y1={cy} x2={rx} y2={ry}
          stroke="#3b82f6" strokeWidth="2.5" markerEnd="url(#arr-r)"/>

        {/* Angle arcs */}
        <path
          d={`M ${cx} ${cy - 50} A 50 50 0 0 0 ${cx - 50 * Math.sin(rad)} ${cy - 50 * Math.cos(rad)}`}
          fill="none" stroke="#f59e0b" strokeWidth="1.5"/>
        <path
          d={`M ${cx} ${cy - 50} A 50 50 0 0 1 ${cx + 50 * Math.sin(rad)} ${cy - 50 * Math.cos(rad)}`}
          fill="none" stroke="#3b82f6" strokeWidth="1.5"/>

        {/* Angle labels */}
        <text x={cx - 75 * Math.sin(rad / 2) - 22} y={cy - 65 * Math.cos(rad / 2)}
          fill="#f59e0b" fontSize="14" fontWeight="700">∠i = {angle}°</text>
        <text x={cx + 75 * Math.sin(rad / 2) + 6} y={cy - 65 * Math.cos(rad / 2)}
          fill="#3b82f6" fontSize="14" fontWeight="700">∠r = {angle}°</text>

        {/* Labels */}
        <text x={ix - 30} y={iy - 10} fill="#f59e0b" fontSize="12" fontWeight="600">Incident Ray</text>
        <text x={rx + 6} y={ry - 10} fill="#3b82f6" fontSize="12" fontWeight="600">Reflected Ray</text>
      </svg>
      <div style={{ padding: '0.75rem 0.5rem 0' }}>
        <label style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
          Angle of Incidence: <strong style={{ color: '#00ffcc' }}>{angle}°</strong>
        </label>
        <input type="range" min="5" max="80" value={angle}
          onChange={e => setAngle(Number(e.target.value))}
          className={styles.simSlider}/>
        <p style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: '#6b7280' }}>
          ✦ Drag the slider — notice how ∠i always equals ∠r, no matter the angle!
        </p>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   INLINE SIM: Plane mirror lateral inversion demo
──────────────────────────────────────────────────────────────────── */
function PlaneMirrorSim() {
  const [word, setWord] = useState('AMBULANCE');
  return (
    <div className={styles.simulationContainer} style={{ background: '#050508', minHeight: 280 }}>
      <div className={styles.simulationLabel}>Plane Mirror — Lateral Inversion</div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0' }}>
        <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>
          Text on an ambulance is written mirror-reversed so drivers can read it correctly in their rear-view mirrors.
        </p>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: '#e63946', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '8px', fontSize: '1.8rem', fontWeight: '900', letterSpacing: '0.15em', marginBottom: '0.4rem' }}>
              {word}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#71717a' }}>Actual text on ambulance</span>
          </div>
          <div style={{ fontSize: '2rem', color: '#00ffcc' }}>⟺</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: '#1d3557', color: '#00ffcc', padding: '0.75rem 1.5rem', borderRadius: '8px', fontSize: '1.8rem', fontWeight: '900', letterSpacing: '0.15em', marginBottom: '0.4rem', transform: 'scaleX(-1)', display: 'inline-block' }}>
              {word}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#71717a' }}>Seen in rear-view mirror (corrected)</span>
          </div>
        </div>
        <div style={{ marginTop: '1.5rem', width: '100%', maxWidth: 360 }}>
          <label style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>Try your own word:</label>
          <input
            value={word} maxLength={12}
            onChange={e => setWord(e.target.value.toUpperCase())}
            style={{ width: '100%', marginTop: '0.4rem', background: '#111', border: '1px solid #333', color: '#f4f4f5', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '1rem', fontFamily: 'monospace' }}
          />
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   MCQ QUIZ COMPONENT
──────────────────────────────────────────────────────────────────── */
const quizData = [
  { q: 'The angle of incidence is always __________ the angle of reflection.', options: ['greater than', 'less than', 'equal to', 'half of'], ans: 2, explanation: 'First Law of Reflection: ∠i = ∠r always.' },
  { q: 'Which type of image is formed by a convex mirror?', options: ['Real and inverted', 'Virtual and inverted', 'Virtual and erect', 'Real and erect'], ans: 2, explanation: 'Convex mirrors always form virtual, erect, and diminished images — this is why they are used as rear-view mirrors.' },
  { q: 'The focal length of a concave mirror is 20 cm. Its radius of curvature is:', options: ['10 cm', '20 cm', '40 cm', '5 cm'], ans: 2, explanation: 'R = 2f = 2 × 20 = 40 cm.' },
  { q: 'An object placed at the centre of curvature of a concave mirror forms an image that is:', options: ['At infinity', 'At focus', 'At C, real and inverted', 'Virtual and erect'], ans: 2, explanation: 'When u = R = 2f, using the mirror formula, v = –2f also. The image is real, inverted and same size at C.' },
  { q: 'Lateral inversion is best explained by which of these daily examples?', options: ['Shadow formation', 'Ambulance writing', 'Rainbow formation', 'Mirage'], ans: 1, explanation: 'AMBULANCE is written in mirror-reversed letters on the vehicle so that drivers reading it in their rear-view mirror see it correctly.' },
  { q: 'A concave mirror with focal length 15 cm forms a real image. The minimum object distance is:', options: ['< 15 cm', '= 15 cm', '> 15 cm', '= 30 cm'], ans: 2, explanation: 'A concave mirror forms a real image only when the object is placed beyond the focal point (u > f).' },
];

function ReflectionQuiz() {
  const [selected, setSelected] = useState<(number | null)[]>(new Array(quizData.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const score = submitted ? selected.filter((s, i) => s === quizData[i].ans).length : 0;

  return (
    <div className={styles.mcqContainer}>
      <h3 style={{ color: '#f4f4f5', marginBottom: '0.5rem' }}>📝 Practice MCQs — Reflection (6 Questions)</h3>
      <p style={{ color: '#71717a', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Answer all questions, then click Submit to see your score.</p>

      {submitted && (
        <div className={styles.scoreBoard}>
          🏆 Score: {score} / {quizData.length}
          <button onClick={() => { setSelected(new Array(quizData.length).fill(null)); setSubmitted(false); }}
            style={{ marginLeft: '1rem', fontSize: '0.8rem', background: 'transparent', border: '1px solid #00ffcc', color: '#00ffcc', padding: '0.3rem 0.7rem', borderRadius: '6px', cursor: 'pointer' }}>
            Reset
          </button>
        </div>
      )}

      {quizData.map((item, qi) => (
        <div key={qi} style={{ marginBottom: '2rem' }}>
          <p style={{ color: '#f4f4f5', marginBottom: '0.75rem', fontWeight: 600 }}>
            Q{qi + 1}. {item.q}
          </p>
          {item.options.map((opt, oi) => {
            let cls = styles.mcqOption;
            if (submitted) {
              if (oi === item.ans) cls += ' ' + styles.correct;
              else if (oi === selected[qi] && oi !== item.ans) cls += ' ' + styles.incorrect;
            } else if (selected[qi] === oi) {
              cls += ' ' + styles.selected;
            }
            return (
              <button key={oi} className={cls}
                disabled={submitted}
                onClick={() => {
                  const ns = [...selected]; ns[qi] = oi; setSelected(ns);
                }}>
                {String.fromCharCode(65 + oi)}. {opt}
              </button>
            );
          })}
          {submitted && (
            <div style={{ marginTop: '0.5rem', padding: '0.65rem 1rem', background: 'rgba(0,255,204,0.04)', border: '1px solid rgba(0,255,204,0.15)', borderRadius: '8px', fontSize: '0.85rem', color: '#a1a1aa' }}>
              💡 {item.explanation}
            </div>
          )}
        </div>
      ))}

      {!submitted && (
        <button
          onClick={() => setSubmitted(true)}
          style={{ background: 'rgba(0,255,204,0.1)', border: '2px solid #00ffcc', color: '#00ffcc', padding: '0.7rem 2rem', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 700, fontFamily: 'inherit' }}>
          Submit Answers
        </button>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════════════════ */
export default function ReflectionPage() {
  const [focusMode, setFocusMode] = useState(false);

  return (
    <div className={`${styles.chapterLayout} ${focusMode ? styles.focusModeActive : ''}`}>

      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/class-10/light-reflection-and-refraction" className={styles.backButton}>← Chapter Home</Link>
          <h2>Reflection of Light</h2>
        </div>
        <nav className={styles.sidebarNav}>
          <a href="#what-is-light"     className={styles.navLink}>1. What is Light?</a>
          <a href="#reflection"        className={styles.navLink}>2. Reflection</a>
          <a href="#laws"              className={styles.navLink}>3. Laws of Reflection</a>
          <a href="#plane-mirror"      className={styles.navLink}>4. Plane Mirror</a>
          <a href="#spherical-mirrors" className={styles.navLink}>5. Spherical Mirrors</a>
          <a href="#terminology"       className={styles.navLink}>6. Key Terms</a>
          <a href="#image-formation"   className={styles.navLink}>7. Image Formation</a>
          <a href="#numericals"        className={styles.navLink}>8. Solved Examples</a>
          <a href="#simulation"        className={styles.navLink}>9. Ray Tracing Lab</a>
          <a href="#quiz"              className={styles.navLink}>10. Practice MCQs</a>
          <a href="#summary"           className={styles.navLink}>11. Summary</a>
        </nav>
        <button className={styles.focusModeToggle} onClick={() => setFocusMode(f => !f)}>
          {focusMode ? '✕ Exit Focus Mode' : '⊞ Focus Mode'}
        </button>
      </aside>

      {/* ── Main Content ── */}
      <main className={styles.mainContent}>

        {/* Hero */}
        <section className={styles.heroSection} style={{ height: 320, marginBottom: '3rem' }}>
          <img
            src="/images/light/topic1-reflection-laws.png"
            alt="Reflection of Light"
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55) saturate(1.2)' }}
            onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=2000&auto=format&fit=crop'; }}
          />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(0deg, rgba(9,9,11,0.7) 0%, transparent 100%)' }}>
            <motion.h1 className={styles.chapterTitle} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              Reflection of Light
            </motion.h1>
            <p style={{ color: '#00ffcc', fontSize: '1.15rem', textShadow: '0 0 12px rgba(0,255,204,0.5)', marginTop: '0.5rem' }}>
              Mirrors · Ray Optics · Mirror Formula · Magnification
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span className={styles.infoTag}>⏱ ~50 min</span>
              <span className={styles.infoTag}>📐 5 Solved Examples</span>
              <span className={styles.infoTag}>🧪 2 Simulations</span>
              <span className={styles.infoTag}>📝 6 MCQs</span>
            </div>
          </div>
        </section>

        {/* ══════════ 1. WHAT IS LIGHT ══════════ */}
        <section id="what-is-light" className={styles.contentSection}>
          <h2>1. What is Light?</h2>
          <p>
            Light is a form of electromagnetic energy that makes objects visible to our eyes. It is a transverse wave with both electric and magnetic field components that oscillate perpendicular to the direction of travel.
          </p>
          <div className={styles.imageGrid}>
            <TopicImage
              src="/images/light/media__1781201710451.png"
              alt="Electromagnetic nature of light"
              fallback="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800"
              caption="EM wave: E and B fields oscillate perpendicularly"
            />
            <TopicImage
              src="/images/light/topic1-reflection-laws.png"
              alt="Light propagation and properties"
              fallback="https://images.unsplash.com/photo-1514503776001-35f78d5e93ce?q=80&w=800"
              caption="Light travels in straight lines (rectilinear propagation)"
            />
          </div>
          <div className={styles.glassPanel}>
            <strong>Key Properties of Light:</strong>
            <ul style={{ marginTop: '0.5rem' }}>
              <li>Speed in vacuum: <strong>c = 3 × 10⁸ m/s</strong></li>
              <li>Travels in straight lines (hence shadows form)</li>
              <li>Does not need any medium to travel (travels through vacuum)</li>
              <li>Exhibits dual nature: wave (interference, diffraction) + particle (photoelectric effect)</li>
              <li>For Class 10: treat light as a <strong>ray</strong> that travels in straight lines</li>
            </ul>
          </div>
          <div className={styles.formulaBox}>
            <h3>Speed of Light</h3>
            <span className={styles.mathEquation}>c = 3 × 10⁸ m/s</span>
            <p>Speed of light in air ≈ speed in vacuum. It slows down in denser media.</p>
          </div>
        </section>

        {/* ══════════ 2. REFLECTION ══════════ */}
        <section id="reflection" className={styles.contentSection}>
          <h2>2. What is Reflection of Light?</h2>
          <p>
            When light traveling through one medium strikes a surface and bounces back into the <em>same medium</em>, this is called <strong>Reflection of Light</strong>. The surface is called the <strong>reflector</strong>.
          </p>
          <div className={styles.imageGrid}>
            <TopicImage
              src="/images/light/light_reflection_nano_banana_1781202845384.png"
              alt="Reflection of light from mirror"
              fallback="https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=800"
              caption="Light bouncing off a polished mirror surface"
            />
            <TopicImage
              src="/images/light/media__1781206235525.png"
              alt="Regular vs diffuse reflection"
              fallback="https://images.unsplash.com/photo-1603380353725-f8a4d39cc41e?q=80&w=800"
              caption="Left: Regular (specular) · Right: Diffuse (irregular)"
            />
          </div>
          <h3>Types of Reflection</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div className={styles.glassPanel} style={{ borderColor: 'rgba(0,255,204,0.3)' }}>
              <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Regular (Specular) Reflection</strong>
              <p style={{ margin: 0, fontSize: '0.93rem', color: '#d4d4d8' }}>
                Parallel rays reflect as parallel rays from a <em>smooth surface</em>. Forms clear, sharp images. Example: plane mirror, calm water.
              </p>
            </div>
            <div className={styles.glassPanel} style={{ borderColor: 'rgba(245,158,11,0.3)' }}>
              <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#f59e0b' }}>Irregular (Diffuse) Reflection</strong>
              <p style={{ margin: 0, fontSize: '0.93rem', color: '#d4d4d8' }}>
                Parallel rays scatter in all directions from a <em>rough surface</em>. No image formed, but you can see the object from any angle. Example: white wall, paper.
              </p>
            </div>
          </div>
          <div className={styles.glassPanel} style={{ marginTop: '1rem', borderColor: 'rgba(251,191,36,0.25)' }}>
            <strong>🌟 Real-Life Fact:</strong> You can read a book from any angle because the paper causes diffuse reflection. But a flat mirror shows your image only when you stand in front of it (specular reflection). Both are equally important!
          </div>
        </section>

        {/* ══════════ 3. LAWS ══════════ */}
        <section id="laws" className={styles.contentSection}>
          <h2>3. Laws of Reflection</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
            <div>
              <p>Every reflection — whether from a plane mirror or a curved mirror — obeys exactly two laws:</p>
              <div className={styles.glassPanel}>
                <strong style={{ display: 'block', marginBottom: '0.75rem' }}>First Law:</strong>
                <p style={{ margin: '0 0 1rem', color: '#d4d4d8' }}>
                  The angle of incidence (<em>∠i</em>) is always equal to the angle of reflection (<em>∠r</em>).
                </p>
                <span className={styles.mathEquation} style={{ fontSize: '1.5rem' }}>∠i = ∠r</span>
                <strong style={{ display: 'block', margin: '1rem 0 0.5rem' }}>Second Law:</strong>
                <p style={{ margin: 0, color: '#d4d4d8' }}>
                  The incident ray, the normal at the point of incidence, and the reflected ray all lie in the <em>same plane</em>.
                </p>
              </div>
            </div>
            <div className={styles.imageCard} style={{ overflow: 'hidden', borderRadius: 12 }}>
              <img
                src="/images/light/light_laws_reflection_1781203058464.png"
                alt="Laws of Reflection diagram"
                style={{ width: '100%', height: 240, objectFit: 'cover' }}
                onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1614644147798-f8c0fc9da7f6?q=80&w=800'; }}
              />
              <div className={styles.imageCardCaption}>Incident ray → Normal → Reflected ray</div>
            </div>
          </div>

          {/* Live simulation — Laws of reflection */}
          <LawsOfReflectionSim />

          <div className={styles.imageGrid} style={{ marginTop: '1.5rem' }}>
            <TopicImage
              src="/images/light/media__1781206240893.png"
              alt="3D diagram of reflection showing all angles"
              fallback="https://images.unsplash.com/photo-1632571401005-458e9d244591?q=80&w=800"
              caption="3D view: incident ray, normal and reflected ray in same plane"
            />
            <TopicImage
              src="/images/light/light_refraction_nano_banana_1781202861976.png"
              alt="Light interaction with surface"
              fallback="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=800"
              caption="Surface interaction: some light reflects, some absorbs"
            />
          </div>
        </section>

        {/* ══════════ 4. PLANE MIRROR ══════════ */}
        <section id="plane-mirror" className={styles.contentSection}>
          <h2>4. Plane Mirror & Lateral Inversion</h2>
          <p>
            A <strong>plane mirror</strong> is a flat, polished reflecting surface. It forms a virtual, erect, and same-sized image of an object placed in front of it. The image distance equals the object distance.
          </p>
          <div className={styles.glassPanel}>
            <strong>Properties of Image in a Plane Mirror:</strong>
            <ul style={{ marginTop: '0.5rem' }}>
              <li><strong>Virtual:</strong> Cannot be captured on a screen</li>
              <li><strong>Erect:</strong> Upright (not inverted)</li>
              <li><strong>Same size:</strong> Magnification m = +1</li>
              <li><strong>Laterally inverted:</strong> Left and right are swapped</li>
              <li><strong>Image distance = Object distance</strong> (image is as far behind mirror as object is in front)</li>
            </ul>
          </div>
          <PlaneMirrorSim />
          <div className={styles.glassPanel} style={{ marginTop: '1.5rem', borderColor: 'rgba(59,130,246,0.3)' }}>
            <strong>How many images does a pair of parallel mirrors form?</strong> Theoretically <em>infinite</em> images are formed, because each mirror acts as an object for the other. You can see this at barber shops!
          </div>
        </section>

        {/* ══════════ 5. SPHERICAL MIRRORS ══════════ */}
        <section id="spherical-mirrors" className={styles.contentSection}>
          <h2>5. Spherical Mirrors</h2>
          <p>
            Spherical mirrors are parts of a hollow glass sphere. Unlike plane mirrors, they have a curved reflecting surface. They are used in telescopes, solar cookers, headlights, and security systems.
          </p>
          <div className={styles.imageGrid}>
            <TopicImage
              src="/images/light/light_spherical_mirrors_1781203071616.png"
              alt="Concave and convex spherical mirrors"
              fallback="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800"
              caption="Concave mirror (cave-like inward curve) vs Convex mirror"
            />
            <TopicImage
              src="/images/light/topic2-spherical-mirrors.png"
              alt="Rays reflecting from spherical mirror"
              fallback="https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800"
              caption="Ray diagram for concave mirror — rays converge at focus"
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.25rem' }}>
            <div className={styles.glassPanel} style={{ borderColor: 'rgba(0,255,204,0.3)' }}>
              <strong style={{ display: 'block', marginBottom: '0.5rem' }}>🪞 Concave Mirror</strong>
              <p style={{ margin: 0, fontSize: '0.93rem', color: '#d4d4d8' }}>
                Reflecting surface curves <em>inward</em> (like a cave). It is a <strong>converging</strong> mirror — parallel rays converge to the focal point. Used in: torches, solar cookers, dentist mirrors, makeup mirrors.
              </p>
            </div>
            <div className={styles.glassPanel} style={{ borderColor: 'rgba(245,158,11,0.3)' }}>
              <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#f59e0b' }}>🥄 Convex Mirror</strong>
              <p style={{ margin: 0, fontSize: '0.93rem', color: '#d4d4d8' }}>
                Reflecting surface curves <em>outward</em>. It is a <strong>diverging</strong> mirror — parallel rays appear to diverge from the focal point. Used in: rear-view mirrors, shop security mirrors (wide field of view).
              </p>
            </div>
          </div>
        </section>

        {/* ══════════ 6. TERMINOLOGY ══════════ */}
        <section id="terminology" className={styles.contentSection}>
          <h2>6. Key Terminology (Must Know for Exams)</h2>
          <ul className={styles.terminologyList}>
            <li><strong>Pole (P):</strong> The centre point of the curved reflecting surface of a spherical mirror.</li>
            <li><strong>Centre of Curvature (C):</strong> The centre of the sphere from which the mirror is a part. Radius of sphere = R.</li>
            <li><strong>Radius of Curvature (R):</strong> Distance from the pole to the centre of curvature.</li>
            <li><strong>Principal Axis:</strong> The straight line passing through the pole (P) and centre of curvature (C).</li>
            <li><strong>Principal Focus (F):</strong> For concave mirror: the point where parallel rays converge after reflection. For convex mirror: the point from which reflected rays appear to diverge.</li>
            <li><strong>Focal Length (f):</strong> Distance from pole to focus. R = 2f (very important!).</li>
            <li><strong>Aperture:</strong> The effective diameter of the reflecting surface. Determines how much light the mirror collects.</li>
          </ul>
          <div className={styles.formulaBox}>
            <h3>Critical Relationship</h3>
            <span className={styles.mathEquation}>R = 2f &nbsp;⟹&nbsp; f = R/2</span>
            <p>The focal length of a spherical mirror is always half its radius of curvature.</p>
          </div>
        </section>

        {/* ══════════ 7. IMAGE FORMATION ══════════ */}
        <section id="image-formation" className={styles.contentSection}>
          <h2>7. Image Formation by Concave Mirror (Cases)</h2>
          <p>The position and nature of image depends on where you place the object. Here are all cases for a concave mirror:</p>

          <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'rgba(0,255,204,0.08)', color: '#00ffcc' }}>
                  {['Object Position', 'Image Position', 'Image Size', 'Image Nature', 'Real-Life Use'].map(h => (
                    <th key={h} style={{ padding: '0.7rem 0.9rem', textAlign: 'left', borderBottom: '1px solid rgba(0,255,204,0.2)', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.03em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['At infinity', 'At F', 'Point-sized', 'Real, Inverted', 'Solar cooker'],
                  ['Beyond C', 'Between F and C', 'Diminished', 'Real, Inverted', 'Cameras'],
                  ['At C (= 2f)', 'At C (= 2f)', 'Same size', 'Real, Inverted', 'Measurement devices'],
                  ['Between F and C', 'Beyond C', 'Magnified', 'Real, Inverted', 'Cinema projector'],
                  ['At F', 'At infinity', 'Highly enlarged', 'Real, Inverted', 'Searchlight / torch'],
                  ['Between P and F', 'Behind mirror', 'Magnified', 'Virtual, Erect', 'Dentist mirror, makeup mirror'],
                ].map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: ri % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                    {row.map((cell, ci) => (
                      <td key={ci} style={{ padding: '0.65rem 0.9rem', color: ci === 4 ? '#f59e0b' : '#d4d4d8' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.imageGrid} style={{ marginTop: '1.5rem' }}>
            <TopicImage
              src="/images/light/light_magnification_formula_nano_banana_1781204215500.png"
              alt="Mirror magnification formula"
              fallback="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800"
              caption="Magnification m = −v/u tells size and orientation"
            />
            <TopicImage
              src="/images/light/light_mirror_formula_nano_banana_1781204199040.png"
              alt="Mirror formula 1/v + 1/u = 1/f"
              fallback="https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?q=80&w=800"
              caption="Mirror formula: 1/v + 1/u = 1/f"
            />
          </div>
          <div className={styles.formulaBox}>
            <h3>New Cartesian Sign Convention</h3>
            <p>All distances are measured from the <strong>Pole</strong>.</p>
            <ul style={{ color: '#a1a1aa', marginTop: '0.5rem', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
              <li>Distances in direction of incident light = <strong style={{ color: '#10b981' }}>positive (+)</strong></li>
              <li>Distances against incident light (object side) = <strong style={{ color: '#f43f5e' }}>negative (−)</strong></li>
              <li>Heights above principal axis = <strong style={{ color: '#10b981' }}>positive (+)</strong></li>
              <li>Heights below principal axis = <strong style={{ color: '#f43f5e' }}>negative (−)</strong></li>
            </ul>
            <p style={{ marginTop: '0.75rem', color: '#a1a1aa', fontSize: '0.9rem' }}>
              For a <em>concave</em> mirror, u is −ve, f is −ve. For a <em>convex</em> mirror, f is +ve.
            </p>
          </div>
        </section>

        {/* ══════════ 8. SOLVED NUMERICALS (ABOVE simulation) ══════════ */}
        <section id="numericals" className={styles.contentSection}>
          <h2>8. Solved Numericals (Step-by-Step)</h2>
          <p>
            Master these 5 exam-style numericals. Each one demonstrates a different case of the mirror formula. Pay attention to the sign convention.
          </p>
          <div className={styles.formulaBox}>
            <h3>Formulas to Use</h3>
            <span className={styles.mathEquation}>Mirror Formula: &nbsp; 1/v + 1/u = 1/f</span>
            <span className={styles.mathEquation} style={{ fontSize: '1.4rem', marginTop: '-0.5rem' }}>Magnification: &nbsp; m = −v/u = h′/h</span>
            <span className={styles.mathEquation} style={{ fontSize: '1.2rem', marginTop: '-0.5rem' }}>Relationship: &nbsp; R = 2f</span>
          </div>

          <SolvedExamples
            title="5 Board-Level Solved Examples — Reflection"
            examples={[
              {
                id: 1,
                question: "An object is placed at a distance of 30 cm in front of a concave mirror of focal length 20 cm. Find the position, nature, and magnification of the image.",
                given: ["Object distance: u = −30 cm (in front of mirror)", "Focal length: f = −20 cm (concave mirror)"],
                formula: "1/v + 1/u = 1/f",
                solutionSteps: [
                  "1/v = 1/f − 1/u = 1/(−20) − 1/(−30)",
                  "1/v = −1/20 + 1/30 = (−3 + 2)/60 = −1/60",
                  "v = −60 cm",
                  "Magnification: m = −v/u = −(−60)/(−30) = −2",
                ],
                answer: "Image is at 60 cm in front of the mirror (v = −60 cm). It is Real, Inverted, and Magnified (m = −2, twice the object size).",
                realLife: "This is how a cinema projector works — object placed between F and C, creating a magnified real image on a screen.",
                visualizerImage: "/images/light/light_mirror_formula_nano_banana_1781204199040.png",
              },
              {
                id: 2,
                question: "A convex mirror used as a rear-view mirror has a focal length of 25 cm. If a bus is 2.4 m away from the mirror, find the position and magnification of the image.",
                given: ["Object distance: u = −240 cm (bus in front)", "Focal length: f = +25 cm (convex mirror, positive f)"],
                formula: "1/v + 1/u = 1/f",
                solutionSteps: [
                  "1/v = 1/f − 1/u = 1/25 − 1/(−240)",
                  "1/v = 1/25 + 1/240 = (240 + 25) / (25 × 240)",
                  "1/v = 265/6000",
                  "v = 6000/265 ≈ +22.6 cm (behind mirror)",
                  "m = −v/u = −(22.6)/(−240) = +0.094",
                ],
                answer: "Image at ≈ 22.6 cm behind mirror. Virtual, Erect, and highly diminished (m ≈ +0.094). This gives a wide field of view.",
                realLife: "Rear-view mirrors on vehicles are convex. Smaller image gives wider field of view, which is why they say 'Objects in mirror are closer than they appear'.",
                visualizerImage: "/images/light/light_magnification_formula_nano_banana_1781204215500.png",
              },
              {
                id: 3,
                question: "The radius of curvature of a concave mirror is 36 cm. An object 5 cm tall is placed 30 cm from the mirror. Find image distance and image height.",
                given: ["Radius R = 36 cm → f = R/2 = 18 cm → f = −18 cm (concave)", "Object distance: u = −30 cm", "Object height: h = +5 cm"],
                formula: "1/v + 1/u = 1/f ; h′ = m × h",
                solutionSteps: [
                  "1/v = 1/f − 1/u = 1/(−18) − 1/(−30)",
                  "1/v = −1/18 + 1/30 = (−5 + 3)/90 = −2/90 = −1/45",
                  "v = −45 cm",
                  "m = −v/u = −(−45)/(−30) = −1.5",
                  "h′ = m × h = −1.5 × 5 = −7.5 cm",
                ],
                answer: "Image is at 45 cm in front of mirror. It is Real, Inverted, and 7.5 cm tall (magnified by 1.5×).",
                realLife: "Concave mirrors in headlamps are positioned so the bulb is at the focus, making parallel reflected beams for maximum road illumination.",
                visualizerImage: "/images/light/light_sign_convention_nano_banana_1781204233503.png",
              },
              {
                id: 4,
                question: "An object 5.0 cm tall is placed 20 cm in front of a convex mirror of radius of curvature 30 cm. Find the position, nature, and size of the image.",
                given: ["h = 5 cm", "u = −20 cm", "R = +30 cm → f = +15 cm"],
                formula: "1/v + 1/u = 1/f ; m = −v/u",
                solutionSteps: [
                  "1/v = 1/15 + 1/(−20)... wait, 1/v = 1/f − 1/u",
                  "1/v = 1/15 − 1/(−20) = 1/15 + 1/20 = (4 + 3)/60 = 7/60",
                  "v = 60/7 ≈ +8.57 cm (behind the mirror)",
                  "m = −v/u = −(8.57)/(−20) = +0.43",
                  "h′ = 0.43 × 5 = +2.15 cm",
                ],
                answer: "Image at 8.57 cm behind the mirror. Virtual, Erect, Diminished (h′ = 2.15 cm). m = +0.43.",
                realLife: "Security mirrors in shops are convex — they show the entire store in one diminished, wide-angle view.",
                visualizerImage: "/images/light/light_spherical_mirrors_1781203071616.png",
              },
              {
                id: 5,
                question: "An object is placed at 40 cm from a concave mirror of focal length 20 cm. If the object height is 3 cm, find the image position, nature and height. Draw a conclusion about its use.",
                given: ["u = −40 cm (equals 2f)", "f = −20 cm (concave)", "h = 3 cm"],
                formula: "1/v + 1/u = 1/f ; m = −v/u",
                solutionSteps: [
                  "1/v = 1/(−20) − 1/(−40) = −1/20 + 1/40 = (−2+1)/40 = −1/40",
                  "v = −40 cm",
                  "m = −(−40)/(−40) = −1",
                  "h′ = m × h = −1 × 3 = −3 cm",
                ],
                answer: "Image at C itself (40 cm in front). Real, Inverted, Same size as object (m = −1). This is used in medical imaging to get same-size real images.",
                realLife: "When u = 2f, image also forms at 2f with exact same size. This property is used in optical instruments for 1:1 image reproduction.",
                visualizerImage: "/images/light/light_laws_reflection_1781203058464.png",
              },
            ]}
          />
        </section>

        {/* ══════════ 9. SIMULATION (after examples) ══════════ */}
        <section id="simulation" className={styles.contentSection}>
          <h2>9. Advanced Ray Tracing Lab (Interactive)</h2>
          <p>
            Drag the sliders below to change the object distance and type of mirror. Watch how the rays change and how the formula values update in real time. This simulation works in both Normal and Focus Mode.
          </p>
          <div className={styles.simulationLabel} style={{ marginBottom: '0.75rem' }}>SIMULATION — Mirror Formula Ray Tracer</div>
          <ReflectionSimulation />
        </section>

        {/* ══════════ 10. MCQ QUIZ ══════════ */}
        <section id="quiz" className={styles.contentSection}>
          <h2>10. Practice MCQs</h2>
          <ReflectionQuiz />
        </section>

        {/* ══════════ 11. SUMMARY ══════════ */}
        <section id="summary" className={styles.contentSection}>
          <h2>11. Chapter Summary</h2>
          <div className={styles.glassPanel} style={{ borderLeft: '4px solid #00ffcc' }}>
            <ul style={{ lineHeight: 2, color: '#d4d4d8' }}>
              <li>Reflection: light bounces back into the same medium from a surface.</li>
              <li>Two laws: <strong>∠i = ∠r</strong>, and incident ray + normal + reflected ray are coplanar.</li>
              <li>Regular reflection (smooth surface) → image formed. Diffuse reflection (rough surface) → no image.</li>
              <li>Concave mirror: converging, used in torches, solar cookers, dentist mirrors.</li>
              <li>Convex mirror: diverging, always virtual+erect+diminished, used in rear-view mirrors.</li>
              <li><strong>Mirror Formula:</strong> 1/v + 1/u = 1/f</li>
              <li><strong>Magnification:</strong> m = −v/u &nbsp;(negative m → real+inverted; positive m → virtual+erect)</li>
              <li><strong>R = 2f</strong> for spherical mirrors.</li>
            </ul>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '2rem' }}>
            <FlashCard
              front="Mirror Formula"
              back={"1/v + 1/u = 1/f\n\nv = image distance, u = object distance, f = focal length"}
              accentColor="#00ffcc"
            />
            <FlashCard
              front="Magnification (m)"
              back={"m = −v/u = h′/h\n\nm < 0 → Real, Inverted\nm > 0 → Virtual, Erect\n|m| > 1 → Magnified"}
              accentColor="#3b82f6"
            />
            <FlashCard
              front="Concave Mirror Uses"
              back={"• Torch/flashlight\n• Solar cooker\n• Dentist mirror (magnified view)\n• Makeup mirror\n• Telescope reflectors"}
              accentColor="#f59e0b"
            />
            <FlashCard
              front="Convex Mirror Uses"
              back={"• Rear-view mirrors (cars)\n• Shop security mirrors\n• Street lamps (spread light)\n• ATM security cameras\nAlways gives: virtual + erect + diminished image"}
              accentColor="#10b981"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            <Link href="/class-10/light-reflection-and-refraction/refraction"
              style={{ flex: 1, padding: '1rem', background: 'rgba(0,255,204,0.06)', border: '1px solid rgba(0,255,204,0.2)', borderRadius: '10px', textDecoration: 'none', textAlign: 'center', color: '#00ffcc', fontWeight: 700, minWidth: 160 }}>
              Next: Refraction of Light →
            </Link>
            <Link href="/class-10/light-reflection-and-refraction/summary"
              style={{ flex: 1, padding: '1rem', background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '10px', textDecoration: 'none', textAlign: 'center', color: '#a78bfa', fontWeight: 700, minWidth: 160 }}>
              Exam Summary & Mind Map →
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
