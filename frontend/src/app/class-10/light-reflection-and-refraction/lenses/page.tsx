'use client';

/**
 * FILE: lenses/page.tsx
 * PURPOSE: Comprehensive Class 10 Spherical Lenses page.
 *          5 topic images (fixed paths /images/light/), 5 solved numericals,
 *          3 interactive simulations (lens ray tracer, power calc, human eye),
 *          MCQ quiz, summary flashcards.
 *          Examples placed ABOVE simulations.
 * LAST UPDATED: 2026-06-11
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from '@/styles/LightChapter.module.css';
import LensesSimulation from '@/components/LightChapter/Simulations/LensesSimulation';
import FlashCard from '@/components/LightChapter/FlashCard';
import SolvedExamples from '@/components/LightChapter/SolvedExamples';

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

/* ─── Power of Lens Calculator Sim ─── */
function PowerCalcSim() {
  const [f, setF] = useState(25);
  const [unit, setUnit] = useState<'cm'|'m'>('cm');
  const fMeters = unit === 'cm' ? f / 100 : f;
  const P = (1 / fMeters).toFixed(2);
  const isConverging = f > 0;
  return (
    <div className={styles.simulationContainer} style={{ background:'#050508', minHeight:300 }}>
      <div className={styles.simulationLabel}>SIMULATOR — Power of a Lens Calculator</div>
      <div style={{ padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1.5rem' }}>
        <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', alignItems:'center' }}>
          <div style={{ flex:1, minWidth:220 }}>
            <label style={{ fontSize:'0.85rem', color:'#a1a1aa', display:'block', marginBottom:'0.4rem' }}>
              Focal Length: <strong style={{ color:'#00ffcc' }}>{f} {unit}</strong>
            </label>
            <input type="range" min="-100" max="100" value={f} step="1"
              onChange={e => setF(Number(e.target.value))}
              className={styles.simSlider}/>
            <div style={{ display:'flex', gap:'0.5rem', marginTop:'0.5rem' }}>
              <button className={`${styles.simButton} ${unit==='cm'?styles.active:''}`} onClick={()=>setUnit('cm')}>cm</button>
              <button className={`${styles.simButton} ${unit==='m'?styles.active:''}`} onClick={()=>setUnit('m')}>m</button>
              <button className={styles.simButton} onClick={()=>setF(f>0?-f:Math.abs(f))}>
                Toggle {isConverging?'Concave':'Convex'}
              </button>
            </div>
          </div>
          <div style={{ textAlign:'center', background:'rgba(0,255,204,0.06)', border:`2px solid ${isConverging?'#00ffcc':'#f43f5e'}`, borderRadius:12, padding:'1.5rem 2.5rem', minWidth:180 }}>
            <div style={{ fontSize:'0.75rem', color:'#71717a', letterSpacing:'0.1em', marginBottom:'0.5rem' }}>POWER</div>
            <div style={{ fontSize:'3rem', fontWeight:900, color: isConverging?'#00ffcc':'#f43f5e', fontFamily:'monospace', lineHeight:1 }}>
              {f === 0 ? '∞' : P}
            </div>
            <div style={{ fontSize:'0.9rem', color:'#71717a', marginTop:'0.25rem' }}>Diopters (D)</div>
            <div style={{ fontSize:'0.85rem', marginTop:'0.75rem', color: isConverging?'#00ffcc':'#f43f5e', fontWeight:600 }}>
              {f === 0 ? '—' : isConverging ? '🔵 Converging (Convex)' : '🔴 Diverging (Concave)'}
            </div>
          </div>
        </div>
        <div className={styles.glassPanel} style={{ margin:0 }}>
          <strong>Reading the Display:</strong>
          <ul style={{ marginTop:'0.5rem', fontSize:'0.88rem' }}>
            <li>Positive P (e.g. +4D) → <strong style={{ color:'#00ffcc' }}>Convex lens</strong> (converging, corrects hypermetropia)</li>
            <li>Negative P (e.g. −2D) → <strong style={{ color:'#f43f5e' }}>Concave lens</strong> (diverging, corrects myopia)</li>
            <li>|P| increases as focal length decreases (more curved = more powerful)</li>
            <li>Lenses in series: <strong>P_total = P₁ + P₂ + P₃ + ...</strong></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ─── Human Eye Defects Sim ─── */
function EyeDefectsSim() {
  const [defect, setDefect] = useState<'normal'|'myopia'|'hypermetropia'>('normal');
  const info = {
    normal: { label:'Normal Vision', color:'#10b981', desc:'Light from distant and near objects focuses exactly on the retina. Perfect vision.' },
    myopia: { label:'Myopia (Short-sightedness)', color:'#f43f5e', desc:'Image of distant object forms in front of retina. Corrected by concave lens (−ve power).' },
    hypermetropia: { label:'Hypermetropia (Long-sightedness)', color:'#f59e0b', desc:'Image of near object forms behind retina. Corrected by convex lens (+ve power).' },
  };
  const current = info[defect];
  return (
    <div className={styles.simulationContainer} style={{ background:'#050508', minHeight:320 }}>
      <div className={styles.simulationLabel}>SIMULATION — Eye Defects & Correction</div>
      <div style={{ padding:'1rem 1.5rem' }}>
        <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
          {(Object.entries(info) as [typeof defect, typeof info[typeof defect]][]).map(([key, val]) => (
            <button key={key} className={`${styles.simButton} ${defect===key?styles.active:''}`}
              style={{ borderColor: defect===key ? val.color : undefined, color: defect===key ? val.color : undefined }}
              onClick={() => setDefect(key)}>
              {val.label}
            </button>
          ))}
        </div>
        <svg width="100%" viewBox="0 0 700 220" style={{ display:'block', background:'#09090b', borderRadius:10 }}>
          {/* Eye outline */}
          <ellipse cx="350" cy="110" rx="250" ry="90" fill="none" stroke="#374151" strokeWidth="2"/>
          {/* Cornea */}
          <path d="M 100 110 Q 130 50 100 110" fill="none" stroke="#60a5fa" strokeWidth="3"/>
          {/* Lens */}
          <ellipse cx="200" cy="110" rx="20" ry="30" fill="none" stroke="#a78bfa" strokeWidth="2"/>
          {/* Retina */}
          <path d="M 580 40 Q 630 110 580 180" fill="none" stroke="#10b981" strokeWidth="3"/>
          <text x="620" y="116" fill="#10b981" fontSize="11" fontWeight="600">Retina</text>

          {/* Light rays */}
          {defect === 'normal' && (
            <>
              <line x1="50" y1="80" x2="200" y2="100" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 3"/>
              <line x1="50" y1="140" x2="200" y2="120" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 3"/>
              <line x1="200" y1="100" x2="590" y2="112" stroke="#10b981" strokeWidth="1.8"/>
              <line x1="200" y1="120" x2="590" y2="108" stroke="#10b981" strokeWidth="1.8"/>
              <circle cx="590" cy="110" r="5" fill="#10b981" opacity="0.8"/>
              <text x="340" y="60" fill="#10b981" fontSize="12" fontWeight="600" textAnchor="middle">✓ Image on retina</text>
            </>
          )}
          {defect === 'myopia' && (
            <>
              <line x1="50" y1="70" x2="200" y2="105" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 3"/>
              <line x1="50" y1="150" x2="200" y2="115" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 3"/>
              <line x1="200" y1="105" x2="430" y2="110" stroke="#f43f5e" strokeWidth="1.8"/>
              <line x1="200" y1="115" x2="430" y2="110" stroke="#f43f5e" strokeWidth="1.8"/>
              <circle cx="430" cy="110" r="5" fill="#f43f5e"/>
              {/* Dashed continuation to retina */}
              <line x1="430" y1="110" x2="590" y2="120" stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.5"/>
              <line x1="430" y1="110" x2="590" y2="100" stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.5"/>
              <text x="340" y="60" fill="#f43f5e" fontSize="12" fontWeight="600" textAnchor="middle">✗ Image forms IN FRONT of retina</text>
              <text x="340" y="175" fill="#a78bfa" fontSize="11" textAnchor="middle">Fix: Concave lens (−ve focal length)</text>
            </>
          )}
          {defect === 'hypermetropia' && (
            <>
              <line x1="50" y1="80" x2="200" y2="107" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 3"/>
              <line x1="50" y1="140" x2="200" y2="113" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 3"/>
              <line x1="200" y1="107" x2="590" y2="95" stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="5 3" opacity="0.7"/>
              <line x1="200" y1="113" x2="590" y2="125" stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="5 3" opacity="0.7"/>
              {/* Image behind retina */}
              <circle cx="700" cy="110" r="5" fill="#f59e0b" opacity="0.5"/>
              <text x="340" y="60" fill="#f59e0b" fontSize="12" fontWeight="600" textAnchor="middle">✗ Image forms BEHIND retina</text>
              <text x="340" y="175" fill="#a78bfa" fontSize="11" textAnchor="middle">Fix: Convex lens (+ve focal length)</text>
            </>
          )}
        </svg>
        <div className={styles.glassPanel} style={{ marginTop:'1rem' }}>
          <strong style={{ color: current.color }}>{current.label}</strong>
          <p style={{ margin:'0.5rem 0 0', color:'#d4d4d8', fontSize:'0.93rem' }}>{current.desc}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── MCQ Quiz ─── */
const quizData = [
  { q:'Lens formula is:', options:['1/v + 1/u = 1/f','1/v - 1/u = 1/f','v/u = f','1/f = 1/v'], ans:1, explanation:'Lens formula: 1/v − 1/u = 1/f. Note: it is minus unlike mirror formula which is plus.' },
  { q:'A convex lens has focal length 20 cm. Its power is:', options:['+2 D','−2 D','+5 D','−5 D'], ans:2, explanation:'P = 1/f(m) = 1/0.20 = +5 D. Convex lens → positive power.' },
  { q:'SI unit of power of a lens is:', options:['cm','metre','Diopter','Watt'], ans:2, explanation:'Power is measured in Diopters (D). 1 D = 1 m⁻¹.' },
  { q:'A concave lens always forms:', options:['Real, inverted image','Virtual, erect, diminished image','Real, erect image','Virtual, inverted image'], ans:1, explanation:'Concave (diverging) lens always forms virtual, erect, and diminished images regardless of object position.' },
  { q:'A person can see clearly only up to 1 metre. Which lens corrects this?', options:['Convex','Concave','Bifocal','Cylindrical'], ans:1, explanation:'Cannot see far → Myopia → Corrected by concave lens (diverging, −ve focal length).' },
  { q:'Two lenses of power +3D and −1D are placed in contact. Net power is:', options:['+4 D','+2 D','−4 D','0 D'], ans:1, explanation:'P_total = P₁ + P₂ = 3 + (−1) = +2 D. Focal length = 1/P = 0.5 m = 50 cm.' },
];

function LensQuiz() {
  const [selected, setSelected] = useState<(number|null)[]>(new Array(quizData.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const score = submitted ? selected.filter((s, i) => s === quizData[i].ans).length : 0;
  return (
    <div className={styles.mcqContainer}>
      <h3 style={{ color:'#f4f4f5', marginBottom:'0.5rem' }}>📝 Practice MCQs — Spherical Lenses (6 Questions)</h3>
      <p style={{ color:'#71717a', fontSize:'0.9rem', marginBottom:'1.5rem' }}>Answer all questions, then submit.</p>
      {submitted && (
        <div className={styles.scoreBoard}>
          🏆 Score: {score}/{quizData.length}
          <button onClick={()=>{ setSelected(new Array(quizData.length).fill(null)); setSubmitted(false); }}
            style={{ marginLeft:'1rem', fontSize:'0.8rem', background:'transparent', border:'1px solid #00ffcc', color:'#00ffcc', padding:'0.3rem 0.7rem', borderRadius:'6px', cursor:'pointer' }}>Reset</button>
        </div>
      )}
      {quizData.map((item, qi) => (
        <div key={qi} style={{ marginBottom:'2rem' }}>
          <p style={{ color:'#f4f4f5', marginBottom:'0.75rem', fontWeight:600 }}>Q{qi+1}. {item.q}</p>
          {item.options.map((opt, oi) => {
            let cls = styles.mcqOption;
            if (submitted) { if (oi===item.ans) cls+=' '+styles.correct; else if (oi===selected[qi] && oi!==item.ans) cls+=' '+styles.incorrect; }
            else if (selected[qi]===oi) cls+=' '+styles.selected;
            return (
              <button key={oi} className={cls} disabled={submitted}
                onClick={()=>{ const ns=[...selected]; ns[qi]=oi; setSelected(ns); }}>
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
        <button onClick={()=>setSubmitted(true)}
          style={{ background:'rgba(0,255,204,0.1)', border:'2px solid #00ffcc', color:'#00ffcc', padding:'0.7rem 2rem', borderRadius:'8px', cursor:'pointer', fontSize:'1rem', fontWeight:700, fontFamily:'inherit' }}>
          Submit Answers
        </button>
      )}
    </div>
  );
}

/* ════════════════ MAIN PAGE ════════════════ */
export default function SphericalLensesPage() {
  const [focusMode, setFocusMode] = useState(false);

  return (
    <div className={`${styles.chapterLayout} ${focusMode ? styles.focusModeActive : ''}`}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/class-10/light-reflection-and-refraction" className={styles.backButton}>← Chapter Home</Link>
          <h2>Spherical Lenses</h2>
        </div>
        <nav className={styles.sidebarNav}>
          <a href="#intro"       className={styles.navLink}>1. Introduction</a>
          <a href="#types"       className={styles.navLink}>2. Types of Lenses</a>
          <a href="#terms"       className={styles.navLink}>3. Key Terms</a>
          <a href="#images"      className={styles.navLink}>4. Image Formation</a>
          <a href="#formula"     className={styles.navLink}>5. Lens Formula</a>
          <a href="#power"       className={styles.navLink}>6. Power of a Lens</a>
          <a href="#eye"         className={styles.navLink}>7. Human Eye</a>
          <a href="#numericals"  className={styles.navLink}>8. Solved Examples</a>
          <a href="#sim-lens"    className={styles.navLink}>9. Lens Ray Tracer</a>
          <a href="#sim-power"   className={styles.navLink}>10. Power Calculator</a>
          <a href="#sim-eye"     className={styles.navLink}>11. Eye Defects Lab</a>
          <a href="#quiz"        className={styles.navLink}>12. Practice MCQs</a>
          <a href="#summary"     className={styles.navLink}>13. Summary</a>
        </nav>
        <button className={styles.focusModeToggle} onClick={()=>setFocusMode(f=>!f)}>
          {focusMode?'✕ Exit Focus Mode':'⊞ Focus Mode'}
        </button>
      </aside>

      <main className={styles.mainContent}>
        {/* Hero */}
        <section className={styles.heroSection} style={{ height:320, marginBottom:'3rem' }}>
          <img
            src="/images/light/topic5-spherical-lenses.png" alt="Spherical Lenses"
            style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.5) saturate(1.3)' }}
            onError={e=>{ e.currentTarget.src='https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop'; }}
          />
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'linear-gradient(0deg,rgba(9,9,11,0.7) 0%,transparent 100%)' }}>
            <motion.h1 className={styles.chapterTitle} initial={{y:20,opacity:0}} animate={{y:0,opacity:1}}>
              Spherical Lenses
            </motion.h1>
            <p style={{ color:'#10b981', fontSize:'1.15rem', textShadow:'0 0 12px rgba(16,185,129,0.5)', marginTop:'0.5rem' }}>
              Convex · Concave · Lens Formula · Power · Human Eye
            </p>
            <div style={{ display:'flex', gap:'0.75rem', marginTop:'1rem', flexWrap:'wrap', justifyContent:'center' }}>
              <span className={styles.infoTag}>⏱ ~60 min</span>
              <span className={styles.infoTag}>📐 5 Solved Examples</span>
              <span className={styles.infoTag}>🧪 3 Simulations</span>
              <span className={styles.infoTag}>📝 6 MCQs</span>
            </div>
          </div>
        </section>

        {/* ══ 1. INTRO ══ */}
        <section id="intro" className={styles.contentSection}>
          <h2>1. Introduction to Spherical Lenses</h2>
          <p>
            Lenses are all around you — in your eyes, in cameras, telescopes, microscopes, spectacles, and projectors. A <strong>lens</strong> is a transparent object (usually glass or plastic) bound by two curved surfaces (at least one of which is spherical). It works by <em>refracting</em> (bending) light rays.
          </p>
          <div className={styles.imageGrid}>
            <TopicImage
              src="/images/light/light_lenses_nano_banana_1781202878730.png" alt="Types of lenses"
              fallback="https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=800"
              caption="Convex and concave lens cross-sections compared"
            />
            <TopicImage
              src="/images/light/light_convex_concave_1781203107265.png" alt="Convex and concave lenses"
              fallback="https://images.unsplash.com/photo-1614282741395-2b8db05a4e4f?q=80&w=800"
              caption="Convex lens: thicker in middle · Concave: thinner in middle"
            />
          </div>
          <div className={styles.glassPanel}>
            <strong>🌟 Engaging Fact:</strong> The lenses in your eyes automatically adjust their curvature (a process called <em>accommodation</em>) to focus on objects at different distances. A healthy eye can focus from infinity down to about 25 cm. This is essentially your eye doing live lens-formula calculations at 60 fps!
          </div>
        </section>

        {/* ══ 2. TYPES ══ */}
        <section id="types" className={styles.contentSection}>
          <h2>2. Types of Spherical Lenses</h2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
            <div className={styles.glassPanel} style={{ borderColor:'rgba(0,255,204,0.3)' }}>
              <strong style={{ display:'block', fontSize:'1.05rem', marginBottom:'0.6rem' }}>🔵 Convex Lens (Converging)</strong>
              <ul style={{ margin:0, paddingLeft:'1.2rem', color:'#d4d4d8', lineHeight:1.8, fontSize:'0.93rem' }}>
                <li>Thicker at the <strong>middle</strong>, thinner at edges</li>
                <li>Converges (brings together) parallel light rays to a <strong>real focus</strong></li>
                <li>Also called <strong>converging lens</strong></li>
                <li>Positive focal length (+f)</li>
                <li>Can form both real and virtual images</li>
              </ul>
              <div style={{ marginTop:'0.75rem', fontSize:'0.82rem', color:'#10b981' }}>
                Uses: Camera, magnifying glass, human eye, projector, telescope objective
              </div>
            </div>
            <div className={styles.glassPanel} style={{ borderColor:'rgba(244,63,94,0.3)' }}>
              <strong style={{ display:'block', fontSize:'1.05rem', marginBottom:'0.6rem', color:'#f43f5e' }}>🔴 Concave Lens (Diverging)</strong>
              <ul style={{ margin:0, paddingLeft:'1.2rem', color:'#d4d4d8', lineHeight:1.8, fontSize:'0.93rem' }}>
                <li>Thinner at the <strong>middle</strong>, thicker at edges</li>
                <li>Diverges (spreads out) parallel light rays — <strong>virtual focus</strong></li>
                <li>Also called <strong>diverging lens</strong></li>
                <li>Negative focal length (−f)</li>
                <li>Always forms virtual, erect, diminished images</li>
              </ul>
              <div style={{ marginTop:'0.75rem', fontSize:'0.82rem', color:'#f43f5e' }}>
                Uses: Spectacles for short-sighted people (myopia), telescope eyepiece
              </div>
            </div>
          </div>
          <div className={styles.imageGrid} style={{ marginTop:'1.25rem' }}>
            <TopicImage
              src="/images/light/topic5-lens-image-formation.png" alt="Lens image formation"
              fallback="https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800"
              caption="Convex lens converging rays to form real image"
            />
            <TopicImage
              src="/images/light/light_lens_power_1781203118675.png" alt="Lens power"
              fallback="https://images.unsplash.com/photo-1581092160607-ee67df3e3cfc?q=80&w=800"
              caption="More curved lens = shorter focal length = higher power"
            />
          </div>
        </section>

        {/* ══ 3. TERMS ══ */}
        <section id="terms" className={styles.contentSection}>
          <h2>3. Key Terminology</h2>
          <ul className={styles.terminologyList}>
            <li><strong>Optical Centre (O):</strong> The central point of a lens. A ray passing through it passes without deviation.</li>
            <li><strong>Principal Axis:</strong> The horizontal line passing through the optical centre and both centres of curvature.</li>
            <li><strong>Principal Focus (F):</strong> Convex: where parallel rays converge. Concave: where parallel rays appear to diverge from (virtual).</li>
            <li><strong>Focal Length (f):</strong> Distance from optical centre to principal focus. +ve for convex, −ve for concave.</li>
            <li><strong>Focal Plane:</strong> A plane perpendicular to the principal axis passing through the focus.</li>
            <li><strong>Aperture:</strong> The effective diameter of the lens. Larger aperture → more light collected.</li>
          </ul>
          <div className={styles.formulaBox}>
            <h3>Sign Convention for Lenses</h3>
            <p>All distances measured from <strong>Optical Centre</strong>.</p>
            <ul style={{ color:'#a1a1aa', paddingLeft:'1.5rem', lineHeight:1.9, marginTop:'0.5rem' }}>
              <li>Object always placed on left → u is always <strong style={{color:'#f43f5e'}}>negative (−)</strong></li>
              <li>Distances to the right of lens: <strong style={{color:'#10b981'}}>positive (+)</strong></li>
              <li>Distances to the left of lens: <strong style={{color:'#f43f5e'}}>negative (−)</strong></li>
              <li>Heights above axis: <strong style={{color:'#10b981'}}>positive (+)</strong>; below: <strong style={{color:'#f43f5e'}}>negative (−)</strong></li>
            </ul>
          </div>
        </section>

        {/* ══ 4. IMAGE FORMATION ══ */}
        <section id="images" className={styles.contentSection}>
          <h2>4. Image Formation by Convex Lens (All Cases)</h2>
          <div style={{ overflowX:'auto', marginTop:'0.75rem' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.88rem' }}>
              <thead>
                <tr style={{ background:'rgba(16,185,129,0.08)', color:'#10b981' }}>
                  {['Object Position','Image Position','Image Size','Nature','Real-life Example'].map(h=>(
                    <th key={h} style={{ padding:'0.65rem 0.8rem', textAlign:'left', borderBottom:'1px solid rgba(16,185,129,0.2)', fontWeight:700, fontSize:'0.8rem' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['At infinity','At F (on other side)','Highly diminished','Real, Inverted','Lens camera, human eye'],
                  ['Beyond 2F','Between F and 2F','Diminished','Real, Inverted','Camera film/sensor'],
                  ['At 2F','At 2F (other side)','Same size','Real, Inverted','Photocopier 1:1'],
                  ['Between F and 2F','Beyond 2F','Magnified','Real, Inverted','Slide/Movie projector'],
                  ['At F','At infinity','Infinitely large','Real, Inverted','Searchlight, Lighthouse'],
                  ['Between O and F','Same side as object','Magnified','Virtual, Erect','Magnifying glass, eye loupe'],
                ].map((row,ri)=>(
                  <tr key={ri} style={{ borderBottom:'1px solid rgba(255,255,255,0.05)', background:ri%2===0?'rgba(255,255,255,0.02)':'transparent' }}>
                    {row.map((cell,ci)=>(
                      <td key={ci} style={{ padding:'0.6rem 0.8rem', color:ci===4?'#f59e0b':ci===3?'#10b981':'#d4d4d8' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ══ 5. LENS FORMULA ══ */}
        <section id="formula" className={styles.contentSection}>
          <h2>5. Lens Formula & Magnification</h2>
          <div className={styles.formulaBox}>
            <h3>Lens Formula</h3>
            <span className={styles.mathEquation}>1/v − 1/u = 1/f</span>
            <p>v = image distance, u = object distance, f = focal length (all measured from optical centre)</p>
          </div>
          <div className={styles.formulaBox} style={{ marginTop:'1rem', borderColor:'rgba(59,130,246,0.3)' }}>
            <h3>Magnification (m)</h3>
            <span className={styles.mathEquation} style={{ color:'#3b82f6' }}>m = v / u = h′ / h</span>
            <ul style={{ color:'#a1a1aa', paddingLeft:'1.5rem', lineHeight:1.8, marginTop:'0.5rem' }}>
              <li>m = +ve → Virtual, Erect image (same side as object)</li>
              <li>m = −ve → Real, Inverted image (other side)</li>
              <li>|m| &gt; 1 → Magnified; |m| &lt; 1 → Diminished</li>
            </ul>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginTop:'1rem' }}>
            <TopicImage
              src="/images/light/light_lens_magnification_nano_banana_1781204503146.png" alt="Lens magnification formula"
              fallback="https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?q=80&w=800"
              caption="Magnification m = v/u for lenses"
            />
            <TopicImage
              src="/images/light/topic6-lens-formula.png" alt="Lens formula diagram"
              fallback="https://images.unsplash.com/photo-1607988795691-3d0147b43231?q=80&w=800"
              caption="Lens formula: 1/v − 1/u = 1/f (note the minus sign!)"
            />
          </div>
        </section>

        {/* ══ 6. POWER ══ */}
        <section id="power" className={styles.contentSection}>
          <h2>6. Power of a Lens</h2>
          <p>
            The <strong>power of a lens</strong> is its ability to converge or diverge light rays. A lens with a shorter focal length bends light more sharply and is more powerful.
          </p>
          <div className={styles.formulaBox}>
            <h3>Power Formula</h3>
            <span className={styles.mathEquation}>P = 1/f &nbsp; (f must be in metres)</span>
            <p>SI Unit: <strong>Diopter (D)</strong>. 1 D = 1 m⁻¹.</p>
            <ul style={{ color:'#a1a1aa', paddingLeft:'1.5rem', lineHeight:1.8, marginTop:'0.5rem' }}>
              <li>Convex lens → positive power (+D)</li>
              <li>Concave lens → negative power (−D)</li>
              <li>Combined lenses: <strong>P = P₁ + P₂ + P₃ ...</strong></li>
            </ul>
          </div>
          <div className={styles.imageCard} style={{ marginTop:'1rem' }}>
            <img src="/images/light/topic6-lens-formula-power.png"
              alt="Power of lens and focal length relationship"
              style={{ width:'100%', height:240, objectFit:'cover' }}
              onError={e=>{ e.currentTarget.src='https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=1200'; }}/>
            <div className={styles.imageCardCaption}>Power (D) = 1/focal length (m). Shorter f → Higher P</div>
          </div>
          <div className={styles.glassPanel} style={{ marginTop:'1rem', borderColor:'rgba(245,158,11,0.3)' }}>
            <strong>🌟 Real Life:</strong> Your optometrist's prescription shows numbers like −2.5D or +1.75D. These are the powers of the lenses in your spectacles. Negative power = concave lens for myopia; positive = convex lens for hypermetropia.
          </div>
        </section>

        {/* ══ 7. HUMAN EYE ══ */}
        <section id="eye" className={styles.contentSection}>
          <h2>7. Human Eye & Vision Defects (Bonus Topic)</h2>
          <p>
            The human eye works like a convex lens system. The <strong>cornea + lens</strong> combination focuses light onto the <strong>retina</strong>. When this focusing is imperfect, we get vision defects corrected by spectacle lenses.
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div className={styles.glassPanel} style={{ borderColor:'rgba(244,63,94,0.3)' }}>
              <strong style={{ color:'#f43f5e', display:'block', marginBottom:'0.5rem' }}>Myopia (Short-sightedness)</strong>
              <p style={{ margin:0, fontSize:'0.9rem', color:'#d4d4d8' }}>
                Eyeball too long or lens too curved. Image forms in <em>front of</em> retina. Cannot see distant objects clearly.<br/>
                <strong>Fix: Concave lens (−ve power)</strong>
              </p>
            </div>
            <div className={styles.glassPanel} style={{ borderColor:'rgba(245,158,11,0.3)' }}>
              <strong style={{ color:'#f59e0b', display:'block', marginBottom:'0.5rem' }}>Hypermetropia (Far-sightedness)</strong>
              <p style={{ margin:0, fontSize:'0.9rem', color:'#d4d4d8' }}>
                Eyeball too short or lens not curved enough. Image forms <em>behind</em> retina. Cannot see near objects clearly.<br/>
                <strong>Fix: Convex lens (+ve power)</strong>
              </p>
            </div>
          </div>
        </section>

        {/* ══ 8. SOLVED EXAMPLES (ABOVE simulations) ══ */}
        <section id="numericals" className={styles.contentSection}>
          <h2>8. Solved Numericals (Step-by-Step)</h2>
          <div className={styles.formulaBox}>
            <h3>Formulas Quick Reference</h3>
            <span className={styles.mathEquation}>Lens Formula: &nbsp; 1/v − 1/u = 1/f</span>
            <span className={styles.mathEquation} style={{ fontSize:'1.3rem', marginTop:'-0.5rem' }}>Magnification: &nbsp; m = v/u</span>
            <span className={styles.mathEquation} style={{ fontSize:'1.2rem', marginTop:'-0.5rem' }}>Power: &nbsp; P = 1/f(m) &nbsp;(in Diopters D)</span>
          </div>

          <SolvedExamples
            title="5 Board-Level Solved Examples — Spherical Lenses"
            examples={[
              {
                id:1,
                question:"A convex lens of focal length 20 cm forms an image of an object placed 30 cm from it. Find the image distance and magnification.",
                given:["Focal length f = +20 cm (convex lens)","Object distance u = −30 cm"],
                formula:"1/v − 1/u = 1/f",
                solutionSteps:[
                  "1/v = 1/f + 1/u = 1/20 + 1/(−30)",
                  "1/v = 1/20 − 1/30 = (3−2)/60 = 1/60",
                  "v = +60 cm",
                  "m = v/u = 60/(−30) = −2",
                ],
                answer:"Image at 60 cm on the other side of lens. Real, Inverted, Magnified (m = −2, double size).",
                realLife:"This is how a movie projector works: object placed between F and 2F creates a magnified real image on a screen far away.",
                visualizerImage:"/images/light/topic5-lens-image-formation.png",
              },
              {
                id:2,
                question:"An object is placed 15 cm from a convex lens of focal length 10 cm. Find image position, nature and magnification.",
                given:["f = +10 cm","u = −15 cm"],
                formula:"1/v − 1/u = 1/f",
                solutionSteps:[
                  "1/v = 1/10 + 1/(−15)",
                  "1/v = 1/10 − 1/15 = (3−2)/30 = 1/30",
                  "v = +30 cm",
                  "m = v/u = 30/(−15) = −2",
                ],
                answer:"Image at 30 cm, other side of lens. Real, Inverted, Magnified (m = −2).",
                realLife:"When u is between F and 2F (as here: 15 cm between 10 and 20), image forms beyond 2F — principle of slide projectors.",
                visualizerImage:"/images/light/light_lens_magnification_nano_banana_1781204503146.png",
              },
              {
                id:3,
                question:"A concave lens of focal length 30 cm forms an image of an object placed 20 cm from it. Find image position and nature.",
                given:["f = −30 cm (concave lens)","u = −20 cm"],
                formula:"1/v − 1/u = 1/f",
                solutionSteps:[
                  "1/v = 1/(−30) + 1/(−20)",
                  "1/v = −1/30 + 1/u... wait, 1/v = 1/f + 1/u",
                  "1/v = 1/(−30) + 1/(−20) = −1/30 − 1/20",
                  "1/v = (−2−3)/60 = −5/60 = −1/12",
                  "v = −12 cm",
                  "m = v/u = (−12)/(−20) = +0.6",
                ],
                answer:"Image at 12 cm on the same side as the object. Virtual, Erect, Diminished (m = +0.6).",
                realLife:"Concave lenses always give this result — virtual, erect, smaller. Used in spectacles for myopia and Galilean telescope eyepiece.",
                visualizerImage:"/images/light/light_convex_concave_1781203107265.png",
              },
              {
                id:4,
                question:"A lens has power −4 diopters. (a) What type of lens? (b) Find focal length. (c) At what distance should you place an object to get an image 20 cm from the lens?",
                given:["P = −4 D"],
                formula:"P = 1/f(m) ; Lens formula",
                solutionSteps:[
                  "(a) P is negative → Concave (diverging) lens",
                  "(b) f = 1/P = 1/(−4) = −0.25 m = −25 cm",
                  "(c) 1/v − 1/u = 1/f",
                  "Image is virtual (concave lens) → v = −20 cm",
                  "1/u = 1/v − 1/f = 1/(−20) − 1/(−25) = −1/20 + 1/25",
                  "1/u = (−5+4)/100 = −1/100",
                  "u = −100 cm",
                ],
                answer:"Concave lens. f = −25 cm. Object must be at 100 cm to get virtual image at 20 cm.",
                realLife:"Optometrists prescribe −4D lenses for someone with moderate myopia — equivalent to a 25 cm focal length concave lens.",
                visualizerImage:"/images/light/light_lens_power_1781203118675.png",
              },
              {
                id:5,
                question:"Two thin lenses of focal lengths +10 cm and +15 cm are placed in contact. Find the net focal length and power.",
                given:["f₁ = +10 cm = +0.10 m (convex)","f₂ = +15 cm = +0.15 m (convex)"],
                formula:"1/f_net = 1/f₁ + 1/f₂ ; P = P₁ + P₂",
                solutionSteps:[
                  "1/f_net = 1/10 + 1/15 = (3+2)/30 = 5/30 = 1/6",
                  "f_net = 6 cm = 0.06 m",
                  "P = P₁ + P₂ = 1/0.10 + 1/0.15",
                  "P = 10 + 6.67 = 16.67 D",
                ],
                answer:"Net focal length = 6 cm. Total Power = 16.67 D.",
                realLife:"Camera lens systems combine multiple lens elements in contact to reduce aberrations while controlling focal length and power.",
                visualizerImage:"/images/light/topic6-lens-formula-power.png",
              },
            ]}
          />
        </section>

        {/* ══ 9. LENS SIMULATION ══ */}
        <section id="sim-lens" className={styles.contentSection}>
          <h2>9. Interactive Lens Ray Tracer</h2>
          <p>Adjust the object distance and switch between convex and concave lenses. Watch the rays trace and image position update live.</p>
          <div className={styles.simulationLabel} style={{ marginBottom:'0.75rem' }}>SIMULATION — Lens Formula Ray Tracer</div>
          <LensesSimulation />
        </section>

        {/* ══ 10. POWER SIMULATION ══ */}
        <section id="sim-power" className={styles.contentSection}>
          <h2>10. Power of a Lens Calculator</h2>
          <p>Interactively explore how focal length determines the power of a lens.</p>
          <PowerCalcSim />
        </section>

        {/* ══ 11. EYE DEFECTS SIMULATION ══ */}
        <section id="sim-eye" className={styles.contentSection}>
          <h2>11. Eye Defects & Correction Lab</h2>
          <p>Visualize how myopia and hypermetropia affect image formation in the eye, and how lenses correct these defects.</p>
          <EyeDefectsSim />
        </section>

        {/* ══ 12. MCQ ══ */}
        <section id="quiz" className={styles.contentSection}>
          <h2>12. Practice MCQs</h2>
          <LensQuiz />
        </section>

        {/* ══ 13. SUMMARY ══ */}
        <section id="summary" className={styles.contentSection}>
          <h2>13. Chapter Summary</h2>
          <div className={styles.glassPanel} style={{ borderLeft:'4px solid #10b981' }}>
            <ul style={{ lineHeight:2, color:'#d4d4d8' }}>
              <li>Convex lens: converging, +f, forms real images (magnified/diminished) and virtual (magnified).</li>
              <li>Concave lens: diverging, −f, always virtual + erect + diminished.</li>
              <li><strong>Lens formula:</strong> 1/v − 1/u = 1/f</li>
              <li><strong>Magnification:</strong> m = v/u (note: no negative sign, unlike mirrors)</li>
              <li><strong>Power:</strong> P = 1/f(m) in Diopters (D)</li>
              <li>Combined lenses: P_total = P₁ + P₂</li>
              <li>Myopia (short-sight) → Concave lens (−ve power)</li>
              <li>Hypermetropia (long-sight) → Convex lens (+ve power)</li>
            </ul>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem', marginTop:'1.5rem' }}>
            <FlashCard front="Lens Formula" back={"1/v − 1/u = 1/f\n\nNote: MINUS sign between 1/v and 1/u\n(Mirror formula has plus: 1/v + 1/u = 1/f)"} accentColor="#10b981"/>
            <FlashCard front="Power of Lens" back={"P = 1/f (f in metres)\nUnit: Diopter (D)\n\n+D → Convex (converging)\n−D → Concave (diverging)\nCombined: P = P₁ + P₂"} accentColor="#3b82f6"/>
            <FlashCard front="Convex Lens Uses" back={"• Camera (real inverted image)\n• Magnifying glass (virtual erect)\n• Movie projector\n• Human eye\n• Telescope objective\n• Corrects Hypermetropia"} accentColor="#f59e0b"/>
            <FlashCard front="Concave Lens Uses" back={"• Spectacles for Myopia (−ve P)\n• Diverging beam in lasers\n• Galilean telescope eyepiece\nAlways: Virtual + Erect + Diminished"} accentColor="#f43f5e"/>
          </div>
          <div style={{ display:'flex', gap:'1rem', marginTop:'2rem', flexWrap:'wrap' }}>
            <Link href="/class-10/light-reflection-and-refraction/refraction"
              style={{ flex:1, padding:'1rem', background:'rgba(245,158,11,0.06)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:'10px', textDecoration:'none', textAlign:'center', color:'#f59e0b', fontWeight:700, minWidth:160 }}>
              ← Prev: Refraction
            </Link>
            <Link href="/class-10/light-reflection-and-refraction/summary"
              style={{ flex:1, padding:'1rem', background:'rgba(124,58,237,0.06)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:'10px', textDecoration:'none', textAlign:'center', color:'#a78bfa', fontWeight:700, minWidth:160 }}>
              Exam Summary & Mind Map →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
