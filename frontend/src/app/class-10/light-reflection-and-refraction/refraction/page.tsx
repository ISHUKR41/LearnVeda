'use client';

/**
 * FILE: refraction/page.tsx
 * PURPOSE: Comprehensive Class 10 Refraction of Light page.
 *          5 topic images (fixed paths /images/light/), 5 solved numericals,
 *          2 interactive simulations (Snell's Law lab + glass slab),
 *          real-life examples, MCQ quiz, summary flashcards.
 *          Examples are placed ABOVE simulations.
 * LAST UPDATED: 2026-06-11
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from '@/styles/LightChapter.module.css';
import RefractionSimulation from '@/components/LightChapter/Simulations/RefractionSimulation';
import FlashCard from '@/components/LightChapter/FlashCard';
import SolvedExamples from '@/components/LightChapter/SolvedExamples';

/* ─── Robust image component ─── */
function TopicImage({ src, alt, fallback, caption, height = 220 }: {
  src: string; alt: string; fallback: string; caption: string; height?: number;
}) {
  return (
    <div className={styles.imageCard}>
      <img src={src} alt={alt} style={{ height, width: '100%', objectFit: 'cover' }}
        onError={e => { e.currentTarget.src = fallback; }} />
      <div className={styles.imageCardCaption}>{caption}</div>
    </div>
  );
}

/* ─── Glass Slab Inline Simulation ─── */
function GlassSlabSim() {
  const [angle, setAngle] = useState(45);
  const n = 1.5;
  const rad1 = (angle * Math.PI) / 180;
  const sinR = Math.sin(rad1) / n;
  const rad2 = Math.asin(sinR);
  const angle2 = Math.round((rad2 * 180) / Math.PI);

  const cx = 400; const topY = 140; const botY = 320;
  const incLen = 180; const refLen = 100; const emLen = 120;

  // Incident ray enters top-left
  const ix = cx - incLen * Math.sin(rad1);
  const iy = topY - incLen * Math.cos(rad1);
  // Refracted segment inside glass
  const rx2 = cx + refLen * Math.sin(rad2);
  const ry2 = topY + refLen * Math.cos(rad2);
  // But re-clamp to slab bottom
  const segLen = (botY - topY) / Math.cos(rad2);
  const ex = cx + segLen * Math.sin(rad2);
  const ey = botY;
  // Emergent ray (parallel to incident)
  const emx = ex + emLen * Math.sin(rad1);
  const emy = botY + emLen * Math.cos(rad1);
  // Lateral shift label
  const shift = ((botY - topY) * Math.sin(rad1 - rad2) / Math.cos(rad2)).toFixed(1);

  return (
    <div className={styles.simulationContainer} style={{ background: '#050508', minHeight: 460 }}>
      <div className={styles.simulationLabel}>SIMULATION — Refraction through a Glass Slab</div>
      <svg width="100%" viewBox="0 0 800 460" style={{ display: 'block' }}>
        {/* Air label */}
        <text x="30" y="100" fill="#6b7280" fontSize="12" fontWeight="600">AIR (n=1.0)</text>
        {/* Glass slab */}
        <rect x="60" y="140" width="680" height="180" fill="rgba(16,185,129,0.08)"
          stroke="rgba(16,185,129,0.4)" strokeWidth="1.5"/>
        <text x="30" y="235" fill="#10b981" fontSize="12" fontWeight="700">GLASS</text>
        <text x="30" y="252" fill="#10b981" fontSize="11">(n=1.5)</text>
        {/* Air below */}
        <text x="30" y="380" fill="#6b7280" fontSize="12" fontWeight="600">AIR (n=1.0)</text>

        {/* Normals at both surfaces */}
        <line x1={cx} y1={topY - 60} x2={cx} y2={topY + 60}
          stroke="#4b5563" strokeWidth="1.2" strokeDasharray="7 4"/>
        <line x1={ex} y1={botY - 60} x2={ex} y2={botY + 70}
          stroke="#4b5563" strokeWidth="1.2" strokeDasharray="7 4"/>

        {/* Arrows */}
        <defs>
          <marker id="inc" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#f59e0b"/>
          </marker>
          <marker id="ref" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#10b981"/>
          </marker>
          <marker id="em" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#f59e0b"/>
          </marker>
        </defs>

        {/* Incident ray */}
        <line x1={ix} y1={iy} x2={cx} y2={topY}
          stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#inc)"/>
        {/* Refracted ray inside glass */}
        <line x1={cx} y1={topY} x2={ex} y2={botY}
          stroke="#10b981" strokeWidth="2.5" markerEnd="url(#ref)"/>
        {/* Emergent ray */}
        <line x1={ex} y1={botY} x2={emx} y2={emy}
          stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#em)"/>

        {/* Dashed extension of incident ray (to show lateral shift) */}
        <line x1={cx} y1={topY} x2={cx + (botY - topY) * Math.tan(rad1)} y2={botY}
          stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="6 4" opacity="0.4"/>

        {/* Angle labels */}
        <text x={cx - 80 * Math.sin(rad1 / 2) - 30} y={topY - 40 * Math.cos(rad1 / 2)}
          fill="#f59e0b" fontSize="13" fontWeight="700">∠i = {angle}°</text>
        <text x={cx + 12} y={topY + 40}
          fill="#10b981" fontSize="13" fontWeight="700">∠r = {angle2}°</text>
        <text x={ex + 12} y={botY + 40}
          fill="#f59e0b" fontSize="13" fontWeight="700">∠e = {angle}°</text>

        {/* Lateral shift indicator */}
        <text x="600" y="240" fill="#a78bfa" fontSize="12" fontWeight="600">
          Lateral shift ≈ {shift} px
        </text>

        {/* Labels */}
        <text x={ix - 55} y={iy - 8} fill="#f59e0b" fontSize="11">Incident Ray</text>
        <text x={cx + 8} y={(topY + botY) / 2} fill="#10b981" fontSize="11">Inside glass</text>
        <text x={emx + 6} y={emy + 6} fill="#f59e0b" fontSize="11">Emergent Ray</text>
      </svg>
      <div style={{ padding: '0.75rem 0.5rem 0' }}>
        <label style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
          Angle of Incidence: <strong style={{ color: '#00ffcc' }}>{angle}°</strong>
          {' '}→ Angle of Refraction: <strong style={{ color: '#10b981' }}>{angle2}°</strong>
          {' '}→ Emergent angle: <strong style={{ color: '#f59e0b' }}>{angle}°</strong>
        </label>
        <input type="range" min="5" max="75" value={angle}
          onChange={e => setAngle(Number(e.target.value))}
          className={styles.simSlider}/>
        <p style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: '#6b7280' }}>
          ✦ Notice: Emergent ray is parallel to incident ray. The ray shifts laterally but does not change direction overall.
        </p>
      </div>
    </div>
  );
}

/* ─── TIR simulation ─── */
function TIRSim() {
  const [angle, setAngle] = useState(30);
  const n1 = 1.5; const n2 = 1.0;
  const criticalAngle = Math.round((Math.asin(n2 / n1) * 180) / Math.PI);
  const isTIR = angle >= criticalAngle;
  const sinR = (n1 * Math.sin(angle * Math.PI / 180)) / n2;
  const refAngle = isTIR ? 0 : Math.round(Math.asin(sinR) * 180 / Math.PI);
  const cx = 400; const boundary = 240;

  return (
    <div className={styles.simulationContainer} style={{ background: '#050508', minHeight: 400 }}>
      <div className={styles.simulationLabel}>SIMULATION — Total Internal Reflection (TIR)</div>
      <svg width="100%" viewBox="0 0 800 400" style={{ display: 'block' }}>
        {/* Denser medium below boundary */}
        <rect x="0" y={boundary} width="800" height="160"
          fill={isTIR ? 'rgba(244,63,94,0.07)' : 'rgba(16,185,129,0.06)'}
          stroke={isTIR ? 'rgba(244,63,94,0.4)' : 'rgba(16,185,129,0.3)'} strokeWidth="1.5"/>
        <text x="20" y={boundary + 30} fontSize="13" fontWeight="700"
          fill={isTIR ? '#f43f5e' : '#10b981'}>
          Glass (n=1.5)
        </text>
        <text x="20" y={boundary - 20} fill="#6b7280" fontSize="12">Air (n=1.0)</text>

        {/* Normal */}
        <line x1={cx} y1={boundary - 100} x2={cx} y2={boundary + 100}
          stroke="#4b5563" strokeWidth="1.5" strokeDasharray="7 4"/>

        {/* Incident ray */}
        <defs>
          <marker id="arr-tir-i" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#f59e0b"/>
          </marker>
          <marker id="arr-tir-r" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#f59e0b"/>
          </marker>
          <marker id="arr-tir-t" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#3b82f6"/>
          </marker>
        </defs>

        {(() => {
          const rad = angle * Math.PI / 180;
          const incX = cx - 160 * Math.sin(rad);
          const incY = boundary + 160 * Math.cos(rad);
          // Reflected ray
          const refX = cx + 160 * Math.sin(rad);
          const refY = boundary + 160 * Math.cos(rad);

          return (
            <>
              <line x1={incX} y1={incY} x2={cx} y2={boundary}
                stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#arr-tir-i)"/>
              {isTIR ? (
                <line x1={cx} y1={boundary} x2={refX} y2={refY}
                  stroke="#f43f5e" strokeWidth="2.5" markerEnd="url(#arr-tir-r)"/>
              ) : (
                <>
                  <line x1={cx} y1={boundary} x2={refX} y2={refY}
                    stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" markerEnd="url(#arr-tir-r)"/>
                  <line x1={cx} y1={boundary}
                    x2={cx + 140 * Math.sin((refAngle * Math.PI) / 180)}
                    y2={boundary - 140 * Math.cos((refAngle * Math.PI) / 180)}
                    stroke="#3b82f6" strokeWidth="2.5" markerEnd="url(#arr-tir-t)"/>
                </>
              )}
            </>
          );
        })()}

        {isTIR ? (
          <text x="50" y="60" fill="#f43f5e" fontSize="15" fontWeight="700">
            ⚠ TOTAL INTERNAL REFLECTION!
          </text>
        ) : (
          <text x="50" y="60" fill="#3b82f6" fontSize="14" fontWeight="700">
            Refracted ray escapes into air (∠r = {refAngle}°)
          </text>
        )}

        <text x="50" y="85" fill="#a1a1aa" fontSize="12">
          Critical angle = {criticalAngle}° | Current: {angle}° {angle >= criticalAngle ? '≥ critical angle → TIR' : '< critical angle → Refraction'}
        </text>
      </svg>
      <div style={{ padding: '0.75rem 0.5rem 0' }}>
        <label style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
          Angle of Incidence (from inside glass): <strong style={{ color: '#00ffcc' }}>{angle}°</strong>
          {' '}{isTIR ? <span style={{ color: '#f43f5e' }}>— TIR! (≥ critical {criticalAngle}°)</span>
            : <span style={{ color: '#10b981' }}>— Normal refraction (critical = {criticalAngle}°)</span>}
        </label>
        <input type="range" min="5" max="85" value={angle}
          onChange={e => setAngle(Number(e.target.value))}
          className={styles.simSlider}/>
        <p style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: '#6b7280' }}>
          ✦ Increase angle past {criticalAngle}° to see Total Internal Reflection — the physics behind optical fibres!
        </p>
      </div>
    </div>
  );
}

/* ─── MCQ Quiz ─── */
const quizData = [
  { q: "A ray of light passes from air into glass. Which happens?", options: ["Speed increases, bends away from normal", "Speed decreases, bends toward normal", "Speed stays same", "Speed increases, bends toward normal"], ans: 1, explanation: "Glass is denser; light slows down and bends toward the normal per Snell's law." },
  { q: "Snell's Law states: n₁ sin θ₁ = n₂ sin θ₂. If n₂ > n₁, then θ₂ is:", options: ["Greater than θ₁", "Equal to θ₁", "Less than θ₁", "90°"], ans: 2, explanation: "When entering denser medium (n₂ > n₁), sin θ₂ = (n₁/n₂) sin θ₁ < sin θ₁, so θ₂ < θ₁." },
  { q: "The refractive index of water is 1.33. This means light travels in water at:", options: ["1.33 × speed in vacuum", "Speed in vacuum / 1.33", "Same speed as vacuum", "Zero"], ans: 1, explanation: "n = c/v → v = c/n = (3×10⁸)/1.33 ≈ 2.26×10⁸ m/s" },
  { q: "Total Internal Reflection occurs when:", options: ["Light goes from rare to dense medium", "Light goes from dense to rare, angle ≥ critical angle", "Angle of incidence = 0°", "Refractive indices are equal"], ans: 1, explanation: "TIR needs: dense → rare medium AND angle of incidence ≥ critical angle." },
  { q: "A pencil dipped in water appears bent because:", options: ["Water bends the pencil", "Refraction at air-water boundary", "Reflection in water", "Diffraction"], ans: 1, explanation: "Light from the submerged part refracts at the air-water surface, causing the apparent bend." },
  { q: "Optical fibres work on the principle of:", options: ["Regular reflection", "Refraction", "Total Internal Reflection", "Diffraction"], ans: 2, explanation: "Optical fibres use repeated TIR at the glass-air boundary to transmit light without loss over long distances." },
];

function RefractionQuiz() {
  const [selected, setSelected] = useState<(number|null)[]>(new Array(quizData.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const score = submitted ? selected.filter((s, i) => s === quizData[i].ans).length : 0;
  return (
    <div className={styles.mcqContainer}>
      <h3 style={{ color: '#f4f4f5', marginBottom: '0.5rem' }}>📝 Practice MCQs — Refraction (6 Questions)</h3>
      <p style={{ color: '#71717a', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Answer all, then submit.</p>
      {submitted && (
        <div className={styles.scoreBoard}>
          🏆 Score: {score}/{quizData.length}
          <button onClick={() => { setSelected(new Array(quizData.length).fill(null)); setSubmitted(false); }}
            style={{ marginLeft: '1rem', fontSize: '0.8rem', background: 'transparent', border: '1px solid #00ffcc', color: '#00ffcc', padding: '0.3rem 0.7rem', borderRadius: '6px', cursor: 'pointer' }}>Reset</button>
        </div>
      )}
      {quizData.map((item, qi) => (
        <div key={qi} style={{ marginBottom: '2rem' }}>
          <p style={{ color: '#f4f4f5', marginBottom: '0.75rem', fontWeight: 600 }}>Q{qi+1}. {item.q}</p>
          {item.options.map((opt, oi) => {
            let cls = styles.mcqOption;
            if (submitted) { if (oi === item.ans) cls += ' '+styles.correct; else if (oi === selected[qi] && oi !== item.ans) cls += ' '+styles.incorrect; }
            else if (selected[qi] === oi) cls += ' '+styles.selected;
            return (
              <button key={oi} className={cls} disabled={submitted}
                onClick={() => { const ns=[...selected]; ns[qi]=oi; setSelected(ns); }}>
                {String.fromCharCode(65+oi)}. {opt}
              </button>
            );
          })}
          {submitted && (
            <div style={{ marginTop:'0.5rem', padding:'0.65rem 1rem', background:'rgba(0,255,204,0.04)', border:'1px solid rgba(0,255,204,0.15)', borderRadius:'8px', fontSize:'0.85rem', color:'#a1a1aa' }}>
              💡 {item.explanation}
            </div>
          )}
        </div>
      ))}
      {!submitted && (
        <button onClick={() => setSubmitted(true)}
          style={{ background:'rgba(0,255,204,0.1)', border:'2px solid #00ffcc', color:'#00ffcc', padding:'0.7rem 2rem', borderRadius:'8px', cursor:'pointer', fontSize:'1rem', fontWeight:700, fontFamily:'inherit' }}>
          Submit Answers
        </button>
      )}
    </div>
  );
}

/* ════════════════════════════════════ MAIN PAGE ════════════════════════════════════ */
export default function RefractionPage() {
  const [focusMode, setFocusMode] = useState(false);

  return (
    <div className={`${styles.chapterLayout} ${focusMode ? styles.focusModeActive : ''}`}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/class-10/light-reflection-and-refraction" className={styles.backButton}>← Chapter Home</Link>
          <h2>Refraction of Light</h2>
        </div>
        <nav className={styles.sidebarNav}>
          <a href="#intro"       className={styles.navLink}>1. Introduction</a>
          <a href="#laws"        className={styles.navLink}>2. Laws & Snell's Law</a>
          <a href="#ri"          className={styles.navLink}>3. Refractive Index</a>
          <a href="#glass-slab"  className={styles.navLink}>4. Glass Slab</a>
          <a href="#tir"         className={styles.navLink}>5. TIR & Optical Fibre</a>
          <a href="#numericals"  className={styles.navLink}>6. Solved Examples</a>
          <a href="#sim-snell"   className={styles.navLink}>7. Snell's Law Lab</a>
          <a href="#sim-slab"    className={styles.navLink}>8. Glass Slab Lab</a>
          <a href="#sim-tir"     className={styles.navLink}>9. TIR Lab</a>
          <a href="#quiz"        className={styles.navLink}>10. Practice MCQs</a>
          <a href="#summary"     className={styles.navLink}>11. Summary</a>
        </nav>
        <button className={styles.focusModeToggle} onClick={() => setFocusMode(f => !f)}>
          {focusMode ? '✕ Exit Focus Mode' : '⊞ Focus Mode'}
        </button>
      </aside>

      <main className={styles.mainContent}>
        {/* Hero */}
        <section className={styles.heroSection} style={{ height: 320, marginBottom: '3rem' }}>
          <img
            src="/images/light/topic4-refraction.png" alt="Refraction of Light"
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5) saturate(1.3)' }}
            onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop'; }}
          />
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'linear-gradient(0deg,rgba(9,9,11,0.7) 0%,transparent 100%)' }}>
            <motion.h1 className={styles.chapterTitle} initial={{ y:20, opacity:0 }} animate={{ y:0, opacity:1 }}>
              Refraction of Light
            </motion.h1>
            <p style={{ color:'#f59e0b', fontSize:'1.15rem', textShadow:'0 0 12px rgba(245,158,11,0.5)', marginTop:'0.5rem' }}>
              Snell's Law · Refractive Index · TIR · Optical Fibres
            </p>
            <div style={{ display:'flex', gap:'0.75rem', marginTop:'1rem', flexWrap:'wrap', justifyContent:'center' }}>
              <span className={styles.infoTag}>⏱ ~55 min</span>
              <span className={styles.infoTag}>📐 5 Solved Examples</span>
              <span className={styles.infoTag}>🧪 3 Simulations</span>
              <span className={styles.infoTag}>📝 6 MCQs</span>
            </div>
          </div>
        </section>

        {/* ══ 1. INTRO ══ */}
        <section id="intro" className={styles.contentSection}>
          <h2>1. Introduction to Refraction</h2>
          <p>
            Have you noticed a pencil looks bent when placed in a glass of water? Or that a pool looks shallower than it actually is? These everyday mysteries are explained by <strong>Refraction</strong> — one of the most important phenomena in optics.
          </p>
          <div className={styles.imageGrid}>
            <TopicImage
              src="/images/light/light_refraction_nano_banana_1781202861976.png" alt="Refraction concept"
              fallback="https://images.unsplash.com/photo-1614282741395-2b8db05a4e4f?q=80&w=800"
              caption="Light bends when it crosses from air into a denser medium"
            />
            <TopicImage
              src="/images/light/topic4-refraction-snell.png" alt="Refraction angles"
              fallback="https://images.unsplash.com/photo-1559827291-72ee739d0d9a?q=80&w=800"
              caption="Incident and refracted rays with the normal at interface"
            />
          </div>
          <div className={styles.glassPanel}>
            <strong>Definition:</strong> Refraction is the <em>bending of light</em> when it passes obliquely from one transparent medium to another with a different optical density.
            <br/><br/>
            <strong>Cause:</strong> Light travels at different speeds in different media. In vacuum: c = 3×10⁸ m/s. In water: ~2.26×10⁸ m/s. In glass: ~2×10⁸ m/s.
            This speed change causes the wave fronts to turn, bending the ray.
          </div>
          <div className={styles.glassPanel} style={{ borderColor:'rgba(245,158,11,0.3)', marginTop:'0' }}>
            <strong>🌟 Real-Life Examples of Refraction:</strong>
            <ul style={{ marginTop:'0.5rem' }}>
              <li>Pencil appearing bent in water</li>
              <li>Swimming pools looking shallower than they are</li>
              <li>Stars twinkling (light refracts in atmospheric layers)</li>
              <li>Mirages in deserts (hot air has different refractive index)</li>
              <li>Lenses in spectacles, cameras, and your eye</li>
            </ul>
          </div>
        </section>

        {/* ══ 2. LAWS & SNELL'S LAW ══ */}
        <section id="laws" className={styles.contentSection}>
          <h2>2. Laws of Refraction & Snell's Law</h2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', alignItems:'start' }}>
            <div>
              <div className={styles.glassPanel}>
                <strong>First Law of Refraction:</strong>
                <p style={{ margin:'0.5rem 0 1rem', color:'#d4d4d8' }}>
                  The incident ray, the refracted ray, and the normal to the interface at the point of incidence all lie in the <em>same plane</em>.
                </p>
                <strong>Second Law (Snell's Law):</strong>
                <p style={{ margin:'0.5rem 0 0', color:'#d4d4d8' }}>
                  The ratio of sin of angle of incidence to sin of angle of refraction is a constant (for a given pair of media and given colour of light).
                </p>
              </div>
              <div className={styles.formulaBox} style={{ marginTop:'1rem' }}>
                <h3>Snell's Law</h3>
                <span className={styles.mathEquation}>n₁ sin θ₁ = n₂ sin θ₂</span>
                <p>Or equivalently: sin i / sin r = n₂₁ = constant</p>
              </div>
            </div>
            <div>
              <div className={styles.imageCard}>
                <img src="/images/light/light_snells_law_1781203083554.png" alt="Snell's Law diagram"
                  style={{ height:240, width:'100%', objectFit:'cover' }}
                  onError={e => { e.currentTarget.src='https://images.unsplash.com/photo-1614645174999-2a6ac90714e5?q=80&w=800'; }}/>
                <div className={styles.imageCardCaption}>Snell's Law: n₁sinθ₁ = n₂sinθ₂</div>
              </div>
            </div>
          </div>
          <div className={styles.glassPanel} style={{ marginTop:'1.25rem', borderColor:'rgba(59,130,246,0.3)' }}>
            <strong>Easy Rule to Remember Direction of Bending:</strong>
            <ul style={{ marginTop:'0.5rem' }}>
              <li><strong>Rare → Dense (e.g. air to glass):</strong> Light bends <em>toward</em> the normal (θ₂ &lt; θ₁)</li>
              <li><strong>Dense → Rare (e.g. glass to air):</strong> Light bends <em>away from</em> the normal (θ₂ &gt; θ₁)</li>
              <li>If light hits <em>normally</em> (θ₁ = 0°): it passes straight through without bending</li>
            </ul>
          </div>
        </section>

        {/* ══ 3. REFRACTIVE INDEX ══ */}
        <section id="ri" className={styles.contentSection}>
          <h2>3. Refractive Index (n)</h2>
          <p>
            The <strong>refractive index</strong> of a medium is a measure of how much it bends light, compared to vacuum. It tells us how much slower light travels in that medium.
          </p>
          <div className={styles.formulaBox}>
            <h3>Absolute Refractive Index</h3>
            <span className={styles.mathEquation}>n = c / v</span>
            <p>Where c = speed of light in vacuum = 3×10⁸ m/s, v = speed of light in medium. n is always ≥ 1.</p>
          </div>
          <div className={styles.imageGrid}>
            <TopicImage
              src="/images/light/light_refractive_index_1781203095581.png" alt="Refractive index values"
              fallback="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800"
              caption="Refractive index values for common media"
            />
            <TopicImage
              src="/images/light/light_absolute_refractive_nano_banana_1781204408083.png" alt="Absolute refractive index"
              fallback="https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=800"
              caption="n = c/v relationship (larger n → slower light)"
            />
          </div>

          <div style={{ overflowX:'auto', marginTop:'1rem' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.9rem' }}>
              <thead>
                <tr style={{ background:'rgba(245,158,11,0.08)', color:'#f59e0b' }}>
                  {['Medium','Refractive Index (n)','Speed of Light (approx.)','Relative Density'].map(h=>(
                    <th key={h} style={{ padding:'0.65rem 1rem', textAlign:'left', borderBottom:'1px solid rgba(245,158,11,0.2)', fontWeight:700, fontSize:'0.82rem' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Vacuum / Air','1.00','3.00 × 10⁸ m/s','Least dense (optically)'],
                  ['Water','1.33','2.26 × 10⁸ m/s','Rarer'],
                  ['Glass (Crown)','1.52','1.97 × 10⁸ m/s','Denser'],
                  ['Diamond','2.42','1.24 × 10⁸ m/s','Most dense (given here)'],
                ].map((row, ri)=>(
                  <tr key={ri} style={{ borderBottom:'1px solid rgba(255,255,255,0.05)', background: ri%2===0?'rgba(255,255,255,0.02)':'transparent' }}>
                    {row.map((cell,ci)=>(
                      <td key={ci} style={{ padding:'0.6rem 1rem', color: ci===0?'#f59e0b':ci===3?'#6b7280':'#d4d4d8' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ══ 4. GLASS SLAB ══ */}
        <section id="glass-slab" className={styles.contentSection}>
          <h2>4. Refraction through a Glass Slab</h2>
          <p>
            When a ray of light passes through a glass slab (a rectangular glass block with parallel faces), it undergoes refraction twice — once at each face. The emergent ray is parallel to the incident ray but displaced sideways. This sideways shift is called the <strong>lateral displacement</strong>.
          </p>
          <div className={styles.imageCard} style={{ marginBottom:'1rem' }}>
            <img src="/images/light/light_glass_slab_nano_banana_1781204391585.png"
              alt="Glass slab refraction with lateral displacement"
              style={{ width:'100%', height:260, objectFit:'cover' }}
              onError={e => { e.currentTarget.src='https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200'; }}/>
            <div className={styles.imageCardCaption}>Glass slab: lateral displacement — emergent ray is parallel to incident ray but shifted</div>
          </div>
          <div className={styles.glassPanel}>
            <strong>Key Points about Glass Slab Refraction:</strong>
            <ul style={{ marginTop:'0.5rem' }}>
              <li>Incident and emergent rays are <strong>parallel</strong> (same direction)</li>
              <li>There is a lateral shift (the emergent ray is displaced sideways)</li>
              <li>The lateral shift increases with thickness of the slab and angle of incidence</li>
              <li>At normal incidence (0°): no lateral shift, ray passes straight through</li>
            </ul>
          </div>
        </section>

        {/* ══ 5. TIR ══ */}
        <section id="tir" className={styles.contentSection}>
          <h2>5. Total Internal Reflection (TIR)</h2>
          <p>
            When light travels from a <em>denser</em> medium to a <em>rarer</em> medium, it bends away from the normal. As the angle of incidence increases, the refracted ray bends more. At a certain critical angle, the refracted ray travels along the surface (90°). Beyond this angle, <strong>Total Internal Reflection (TIR)</strong> occurs — all the light is reflected back into the denser medium.
          </p>
          <div className={styles.formulaBox}>
            <h3>Critical Angle (θ_c)</h3>
            <span className={styles.mathEquation}>sin θ_c = n₂ / n₁ = 1 / n</span>
            <p>For glass-air: θ_c = sin⁻¹(1/1.5) ≈ 42°. For water-air: θ_c ≈ 49°.</p>
          </div>
          <div className={styles.glassPanel} style={{ borderColor:'rgba(124,58,237,0.3)' }}>
            <strong>Applications of TIR:</strong>
            <ul style={{ marginTop:'0.5rem' }}>
              <li><strong>Optical fibres:</strong> Light undergoes repeated TIR inside the glass core, transmitting data over thousands of km with minimal loss. Used in internet cables, medical endoscopes.</li>
              <li><strong>Diamonds sparkle:</strong> Diamond has very high n (2.42) → very small critical angle (~24°). Most light hitting facets undergoes TIR and exits through the top, creating brilliance.</li>
              <li><strong>Mirages:</strong> Hot air near the ground has lower n; light bends in a curve, ultimately undergoing TIR to produce mirage images.</li>
              <li><strong>Periscope prisms:</strong> Right-angle prisms use TIR at 45° ({'>'}= critical angle 42° for glass) instead of silvered mirrors.</li>
            </ul>
          </div>
        </section>

        {/* ══ 6. SOLVED EXAMPLES (ABOVE simulations) ══ */}
        <section id="numericals" className={styles.contentSection}>
          <h2>6. Solved Numericals (Step-by-Step)</h2>
          <div className={styles.formulaBox}>
            <h3>Key Formulas</h3>
            <span className={styles.mathEquation}>Snell's Law: n₁ sin θ₁ = n₂ sin θ₂</span>
            <span className={styles.mathEquation} style={{ fontSize:'1.3rem', marginTop:'-0.5rem' }}>Refractive Index: n = c/v = sin i / sin r</span>
          </div>

          <SolvedExamples
            title="5 Board-Level Solved Examples — Refraction"
            examples={[
              {
                id: 1,
                question: "A ray of light passes from air into glass. The angle of incidence is 45° and the angle of refraction is 30°. Find the refractive index of glass.",
                given: ["Medium 1: Air, n₁ = 1.0", "Angle of incidence: θ₁ = 45°", "Angle of refraction: θ₂ = 30°"],
                formula: "n₁ sin θ₁ = n₂ sin θ₂  →  n₂ = (n₁ sin θ₁) / sin θ₂",
                solutionSteps: [
                  "n₂ = (1.0 × sin 45°) / sin 30°",
                  "n₂ = (1 × 0.7071) / 0.5",
                  "n₂ = 0.7071 / 0.5 = 1.414",
                  "n₂ ≈ √2 ≈ 1.41",
                ],
                answer: "Refractive index of glass n = 1.41 (this is close to real crown glass: 1.52).",
                realLife: "Different types of glass have different refractive indices — lens makers choose specific glass to achieve desired focal lengths.",
                visualizerImage: "/images/light/light_snells_law_1781203083554.png",
              },
              {
                id: 2,
                question: "The speed of light in glass is 2×10⁸ m/s. What is the refractive index of glass? Find the angle of refraction if light is incident at 60° from air.",
                given: ["Speed in vacuum: c = 3×10⁸ m/s", "Speed in glass: v = 2×10⁸ m/s", "Angle of incidence: θ₁ = 60°", "n₁ = 1.0 (air)"],
                formula: "n = c/v ; n₁ sin θ₁ = n₂ sin θ₂",
                solutionSteps: [
                  "n₂ = c/v = (3×10⁸)/(2×10⁸) = 1.5",
                  "sin θ₂ = (n₁ sin θ₁) / n₂ = (1 × sin 60°) / 1.5",
                  "sin θ₂ = (1 × 0.866) / 1.5 = 0.577",
                  "θ₂ = sin⁻¹(0.577) ≈ 35.3°",
                ],
                answer: "Refractive index n = 1.5. Angle of refraction ≈ 35°. Light bends toward normal on entering glass.",
                realLife: "Eyeglass lenses use glass or polycarbonate (n ≈ 1.5–1.9) to bend light to correct vision defects.",
                visualizerImage: "/images/light/light_refractive_index_1781203095581.png",
              },
              {
                id: 3,
                question: "Find the critical angle for glass-air interface if the refractive index of glass is 1.5.",
                given: ["n (glass) = 1.5", "n (air) = 1.0"],
                formula: "sin θ_c = n₂/n₁ = 1/n_glass",
                solutionSteps: [
                  "sin θ_c = 1/1.5 = 2/3 = 0.667",
                  "θ_c = sin⁻¹(0.667) ≈ 41.8°",
                  "So when light hits glass-air surface at angle ≥ 42°, TIR occurs",
                ],
                answer: "Critical angle for glass-air ≈ 42°. For angles > 42° from inside glass, TIR occurs.",
                realLife: "This 42° critical angle is why prisms can replace mirrors in binoculars and periscopes — they use TIR more efficiently.",
                visualizerImage: "/images/light/light_absolute_refractive_nano_banana_1781204408083.png",
              },
              {
                id: 4,
                question: "A ray of light in water (n = 1.33) strikes the water-air surface at 55°. Does TIR occur?",
                given: ["n₁ = 1.33 (water)", "n₂ = 1.0 (air)", "Angle of incidence = 55°"],
                formula: "sin θ_c = n₂/n₁ ; compare with given angle",
                solutionSteps: [
                  "sin θ_c = 1.0/1.33 = 0.752",
                  "θ_c = sin⁻¹(0.752) ≈ 48.8°",
                  "Given angle (55°) > θ_c (48.8°)",
                  "Therefore, TIR occurs — all light is reflected back into water",
                ],
                answer: "Yes, TIR occurs since 55° > 48.8° (critical angle for water-air interface).",
                realLife: "Fish in a pond can see the outside world only through a cone of ~98° at the surface — beyond this angle everything appears mirror-like due to TIR.",
                visualizerImage: "/images/light/light_glass_slab_nano_banana_1781204391585.png",
              },
              {
                id: 5,
                question: "Light travels from glass (n=1.5) to water (n=1.33). Find the critical angle. Will TIR occur at angle of incidence of 70°?",
                given: ["n₁ = 1.5 (glass)", "n₂ = 1.33 (water)", "Test angle: θ = 70°"],
                formula: "sin θ_c = n₂/n₁",
                solutionSteps: [
                  "sin θ_c = 1.33/1.5 = 0.887",
                  "θ_c = sin⁻¹(0.887) ≈ 62.5°",
                  "Given angle: 70° > θ_c: 62.5°",
                  "Yes, TIR occurs",
                ],
                answer: "Critical angle ≈ 62.5°. Since 70° > 62.5°, TIR occurs even at the glass-water interface.",
                realLife: "This principle is used in fibre optic sensors immersed in different fluids — the critical angle changes with the surrounding liquid, enabling detection.",
                visualizerImage: "/images/light/topic4-refraction.png",
              },
            ]}
          />
        </section>

        {/* ══ 7. SNELL'S LAW SIMULATION ══ */}
        <section id="sim-snell" className={styles.contentSection}>
          <h2>7. Snell's Law Interactive Lab</h2>
          <p>Adjust the angle of incidence and switch between media to see how Snell's Law determines the refracted angle in real time.</p>
          <div className={styles.simulationLabel} style={{ marginBottom:'0.75rem' }}>SIMULATION — Snell's Law Ray Tracer</div>
          <RefractionSimulation />
        </section>

        {/* ══ 8. GLASS SLAB SIMULATION ══ */}
        <section id="sim-slab" className={styles.contentSection}>
          <h2>8. Glass Slab Refraction Lab</h2>
          <p>Watch how light bends twice through a parallel-sided glass slab — and emerges parallel but shifted (laterally displaced).</p>
          <GlassSlabSim />
        </section>

        {/* ══ 9. TIR SIMULATION ══ */}
        <section id="sim-tir" className={styles.contentSection}>
          <h2>9. Total Internal Reflection Lab</h2>
          <p>Increase the angle of incidence past the critical angle to see TIR — the principle behind optical fibres.</p>
          <TIRSim />
        </section>

        {/* ══ 10. MCQ ══ */}
        <section id="quiz" className={styles.contentSection}>
          <h2>10. Practice MCQs</h2>
          <RefractionQuiz />
        </section>

        {/* ══ 11. SUMMARY ══ */}
        <section id="summary" className={styles.contentSection}>
          <h2>11. Chapter Summary</h2>
          <div className={styles.glassPanel} style={{ borderLeft:'4px solid #f59e0b' }}>
            <ul style={{ lineHeight:2, color:'#d4d4d8' }}>
              <li>Refraction: bending of light when it changes medium (different speeds).</li>
              <li>Snell's Law: <strong>n₁ sin θ₁ = n₂ sin θ₂</strong></li>
              <li>Dense medium → light slows + bends toward normal (θ smaller).</li>
              <li>Refractive index: <strong>n = c/v</strong>. Higher n = denser medium = slower light.</li>
              <li>Glass slab: emergent ray is parallel to incident ray (lateral shift only).</li>
              <li>TIR: dense→rare, angle ≥ critical. <strong>sin θ_c = 1/n</strong>.</li>
              <li>Optical fibres use repeated TIR to transmit light over long distances.</li>
            </ul>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem', marginTop:'1.5rem' }}>
            <FlashCard front="Snell's Law" back={"n₁ sin θ₁ = n₂ sin θ₂\n\nRare→Dense: bends toward normal\nDense→Rare: bends away from normal"} accentColor="#f59e0b"/>
            <FlashCard front="Critical Angle & TIR" back={"sin θ_c = n₂/n₁ = 1/n\n\nFor glass-air: θ_c ≈ 42°\nFor water-air: θ_c ≈ 49°\nTIR used in: optical fibres, diamonds, periscopes"} accentColor="#f43f5e"/>
            <FlashCard front="Refractive Index (n)" back={"n = c/v = sin i / sin r\n\nVacuum: 1.00\nWater: 1.33\nGlass: 1.52\nDiamond: 2.42"} accentColor="#3b82f6"/>
            <FlashCard front="Real-Life Refraction" back={"• Pencil bent in water\n• Pool looks shallow\n• Stars twinkle\n• Mirages in desert\n• Spectacles & camera lenses"} accentColor="#10b981"/>
          </div>
          <div style={{ display:'flex', gap:'1rem', marginTop:'2rem', flexWrap:'wrap' }}>
            <Link href="/class-10/light-reflection-and-refraction/reflection"
              style={{ flex:1, padding:'1rem', background:'rgba(0,255,204,0.06)', border:'1px solid rgba(0,255,204,0.2)', borderRadius:'10px', textDecoration:'none', textAlign:'center', color:'#00ffcc', fontWeight:700, minWidth:160 }}>
              ← Prev: Reflection
            </Link>
            <Link href="/class-10/light-reflection-and-refraction/lenses"
              style={{ flex:1, padding:'1rem', background:'rgba(245,158,11,0.06)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:'10px', textDecoration:'none', textAlign:'center', color:'#f59e0b', fontWeight:700, minWidth:160 }}>
              Next: Spherical Lenses →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
