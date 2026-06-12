'use client';

/**
 * FILE: lenses/page.tsx
 * PURPOSE: Class 10 — Light: Spherical Lenses
 *   Topics: Types of Lenses, Image Formation, Lens Formula, Power, Human Eye,
 *           Defects of Vision (Myopia, Hypermetropia), Optical Instruments
 *   Features: 6 AI images, 3 animated SVG simulations, 6 numericals, 8 MCQ, 8 flashcards
 */

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Zap, Eye, BookOpen, RotateCcw, Lightbulb, Award, Target, Focus } from 'lucide-react';
import styles from '@/styles/LightChapter.module.css';

/* ─────────────────────────────────────────────────────────
   LAZY MOUNT — Renders children only when near the viewport.
   Uses IntersectionObserver with 300px rootMargin.
───────────────────────────────────────────────────────── */
function SimSkeleton() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '14px',
      padding: '2rem',
      marginBottom: '2rem',
      animation: 'pulse 2s ease-in-out infinite',
    }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      <div style={{ height: '22px', width: '260px', background: 'rgba(255,255,255,0.07)', borderRadius: '6px', marginBottom: '1rem' }} />
      <div style={{ height: '320px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }} />
    </div>
  );
}

function LazyMount({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setMounted(true); observer.disconnect(); } },
      { rootMargin: '300px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref}>{mounted ? children : <SimSkeleton />}</div>;
}

/* ═══════════════════════════════════════════════════════════
   SIMULATION 1 — Convex Lens Ray Tracer (All Image Formation Cases)
═══════════════════════════════════════════════════════════ */
function LensRayTracerSim() {
  const [lensType, setLensType] = useState<'convex' | 'concave'>('convex');
  const [caseIdx, setCaseIdx] = useState(0);

  /* Axis Y=195, Lens at x=290, F=130px focal length */
  const AY = 195; const LX = 290; const FL = 130;
  const F1 = LX - FL; /* left focus: x=160 */
  const F2 = LX + FL; /* right focus: x=420 */
  const twiceF1 = LX - 2 * FL; /* 2F on left: x=30 */
  const twiceF2 = LX + 2 * FL; /* 2F on right: x=550 */

  const convexCases = [
    { label: 'Beyond 2F', objX: 60, objY: AY - 70,
      imgX: 368, imgY: AY + 40, imgReal: true, imgErect: false, imgSize: 'Diminished',
      info: 'Real, Inverted, Diminished — between F₂ and 2F₂' },
    { label: 'At 2F', objX: LX - 2*FL, objY: AY - 70,
      imgX: LX + 2*FL, imgY: AY + 70, imgReal: true, imgErect: false, imgSize: 'Same size',
      info: 'Real, Inverted, Same size — at 2F₂' },
    { label: 'Between F & 2F', objX: 200, objY: AY - 70,
      imgX: 480, imgY: AY + 115, imgReal: true, imgErect: false, imgSize: 'Magnified',
      info: 'Real, Inverted, Magnified — beyond 2F₂' },
    { label: 'At F', objX: F1, objY: AY - 70,
      imgX: -1, imgY: 0, imgReal: false, imgErect: false, imgSize: 'At Infinity',
      info: 'Image at Infinity — rays emerge parallel' },
    { label: 'Between F & O', objX: 220, objY: AY - 70,
      imgX: 130, imgY: AY - 140, imgReal: false, imgErect: true, imgSize: 'Magnified',
      info: 'Virtual, Erect, Magnified — same side as object (magnifying glass!)' },
  ];

  const concaveInfo = [
    { label: 'Any Position', objX: 120, objY: AY - 70,
      imgX: 238, imgY: AY - 42, imgReal: false, imgErect: true, imgSize: 'Diminished',
      info: 'Always: Virtual, Erect, Diminished — between F₁ and O (regardless of object position)' },
  ];

  const cases = lensType === 'convex' ? convexCases : concaveInfo;
  const c = cases[Math.min(caseIdx, cases.length - 1)];

  return (
    <div className={styles.simulationContainer}>
      <div className={styles.simulationLabel}>🔭 Lens Ray Tracer — Image Formation</div>

      <div className={styles.simControls} style={{ marginBottom: '0.75rem', marginTop: 0 }}>
        <button className={`${styles.simButton} ${lensType === 'convex' ? styles.active : ''}`}
          onClick={() => { setLensType('convex'); setCaseIdx(0); }}>🔵 Convex Lens</button>
        <button className={`${styles.simButton} ${lensType === 'concave' ? styles.active : ''}`}
          onClick={() => { setLensType('concave'); setCaseIdx(0); }}>🔴 Concave Lens</button>
      </div>

      {lensType === 'convex' && (
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {convexCases.map((cs, i) => (
            <button key={i} onClick={() => setCaseIdx(i)} style={{
              padding: '0.3rem 0.65rem', fontSize: '0.76rem', borderRadius: '6px', cursor: 'pointer',
              background: i === caseIdx ? 'rgba(0,255,204,0.14)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${i === caseIdx ? '#00ffcc' : 'rgba(255,255,255,0.1)'}`,
              color: i === caseIdx ? '#00ffcc' : '#71717a', fontWeight: i === caseIdx ? 700 : 400, transition: 'all 0.2s',
            }}>{cs.label}</button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.svg key={`${lensType}-${caseIdx}`} width="100%" viewBox="0 0 580 370"
          style={{ display: 'block', maxWidth: '580px', margin: '0 auto' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>

          {/* Principal axis */}
          <line x1="10" y1={AY} x2="565" y2={AY} stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="4 3" />

          {/* Lens shape */}
          {lensType === 'convex' ? (
            /* Convex lens: two arcs facing inward */
            <>
              <path d={`M ${LX} ${AY - 80} Q ${LX + 30} ${AY} ${LX} ${AY + 80}`} fill="none" stroke="#60a5fa" strokeWidth="3.5" strokeLinecap="round" />
              <path d={`M ${LX} ${AY - 80} Q ${LX - 30} ${AY} ${LX} ${AY + 80}`} fill="none" stroke="#60a5fa" strokeWidth="3.5" strokeLinecap="round" />
              <path d={`M ${LX} ${AY - 80} Q ${LX + 30} ${AY} ${LX} ${AY + 80} Q ${LX - 30} ${AY} ${LX} ${AY - 80}`}
                fill="rgba(96,165,250,0.07)" />
            </>
          ) : (
            /* Concave lens: two arcs facing outward */
            <>
              <path d={`M ${LX} ${AY - 80} Q ${LX - 28} ${AY} ${LX} ${AY + 80}`} fill="none" stroke="#f43f5e" strokeWidth="3.5" strokeLinecap="round" />
              <path d={`M ${LX} ${AY - 80} Q ${LX + 28} ${AY} ${LX} ${AY + 80}`} fill="none" stroke="#f43f5e" strokeWidth="3.5" strokeLinecap="round" />
              <path d={`M ${LX} ${AY - 80} Q ${LX - 28} ${AY} ${LX} ${AY + 80} Q ${LX + 28} ${AY} ${LX} ${AY - 80}`}
                fill="rgba(244,63,94,0.04)" />
            </>
          )}

          {/* Focal points and 2F */}
          {[
            { x: F1, label: 'F₁', col: '#f59e0b' },
            { x: F2, label: 'F₂', col: '#f59e0b' },
            { x: twiceF1, label: '2F₁', col: '#a78bfa' },
            { x: twiceF2, label: '2F₂', col: '#a78bfa' },
          ].filter(p => p.x > 5 && p.x < 575).map(({ x, label, col }) => (
            <g key={label}>
              <circle cx={x} cy={AY} r="4" fill={col} style={{ filter: `drop-shadow(0 0 4px ${col})` }} />
              <text x={x} y={AY - 11} fill={col} fontSize="11" textAnchor="middle" fontWeight="700" fontFamily="Inter">{label}</text>
            </g>
          ))}

          {/* Object arrow */}
          <line x1={c.objX} y1={AY} x2={c.objX} y2={c.objY} stroke="#ef4444" strokeWidth="2.5"
            style={{ filter: 'drop-shadow(0 0 5px #ef444460)' }} />
          <polygon fill="#ef4444"
            points={`${c.objX},${c.objY} ${c.objX - 7},${c.objY + 12} ${c.objX + 7},${c.objY + 12}`} />
          <text x={c.objX} y={c.objY - 9} fill="#ef444499" fontSize="11" textAnchor="middle" fontFamily="Inter">Object</text>

          {/* Image (if not at infinity) */}
          {c.imgX > 0 && (
            <g opacity={c.imgReal ? 1 : 0.7}>
              <line x1={c.imgX} y1={AY} x2={c.imgX} y2={c.imgY} stroke={c.imgReal ? '#00ffcc' : '#a78bfa'} strokeWidth="2.5"
                strokeDasharray={c.imgReal ? 'none' : '5 3'}
                style={{ filter: `drop-shadow(0 0 5px ${c.imgReal ? '#00ffcc60' : '#a78bfa60'})` }} />
              <polygon fill={c.imgReal ? '#00ffcc' : '#a78bfa'}
                points={c.imgY > AY
                  ? `${c.imgX},${c.imgY} ${c.imgX - 7},${c.imgY - 12} ${c.imgX + 7},${c.imgY - 12}`
                  : `${c.imgX},${c.imgY} ${c.imgX - 7},${c.imgY + 12} ${c.imgX + 7},${c.imgY + 12}`} />
              <text x={c.imgX} y={c.imgY > AY ? c.imgY + 15 : c.imgY - 9}
                fill={c.imgReal ? '#00ffcc99' : '#a78bfa99'} fontSize="11" textAnchor="middle" fontFamily="Inter">Image</text>
            </g>
          )}

          {/* Infinity for case 4 */}
          {c.imgX <= 0 && (
            <text x="490" y="80" fill="#f59e0b" fontSize="28" textAnchor="middle" fontFamily="JetBrains Mono" fontWeight="700" opacity="0.7">∞</text>
          )}

          {/* Info box */}
          <rect x="8" y="318" width="380" height="44" rx="8" fill="rgba(0,0,0,0.65)" />
          <text x="18" y="335" fill="#71717a" fontSize="10" fontFamily="Inter">
            {lensType === 'convex' ? `Case: ${convexCases[caseIdx]?.label}` : 'Concave lens: always virtual, erect, diminished'}
          </text>
          <text x="18" y="353" fill={c.imgReal ? '#00ffcc' : '#a78bfa'} fontSize="10.5" fontFamily="'JetBrains Mono',monospace" fontWeight="700">
            {c.info}
          </text>
        </motion.svg>
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SIMULATION 2 — Power of Lens Calculator
═══════════════════════════════════════════════════════════ */
function PowerOfLensSim() {
  const [focalCm, setFocalCm] = useState(20);
  const [lensType, setLensType] = useState<'convex' | 'concave'>('convex');
  const f = lensType === 'convex' ? focalCm / 100 : -focalCm / 100; /* metres, with sign */
  const power = 1 / f; /* dioptre */

  /* SVG: show convergence/divergence based on f */
  const LX = 280; const AY = 160;
  const fPx = focalCm * 4; /* pixels per cm (scaled) */
  const numRays = 5;

  return (
    <div className={styles.simulationContainer}>
      <div className={styles.simulationLabel}>⚡ Power of Lens — Live Calculator</div>

      <div className={styles.simControls} style={{ marginBottom: '0.75rem', marginTop: 0 }}>
        <button className={`${styles.simButton} ${lensType === 'convex' ? styles.active : ''}`}
          onClick={() => setLensType('convex')}>+ Convex (Converging)</button>
        <button className={`${styles.simButton} ${lensType === 'concave' ? styles.active : ''}`}
          onClick={() => setLensType('concave')}>− Concave (Diverging)</button>
      </div>

      <svg width="100%" viewBox="0 0 560 320" style={{ display: 'block', maxWidth: '560px', margin: '0 auto' }}>
        {/* Axis */}
        <line x1="10" y1={AY} x2="545" y2={AY} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 3" />

        {/* Lens */}
        {lensType === 'convex' ? (
          <>
            <path d={`M ${LX} ${AY - 75} Q ${LX + 28} ${AY} ${LX} ${AY + 75}`} fill="none" stroke="#60a5fa" strokeWidth="3.5" strokeLinecap="round" />
            <path d={`M ${LX} ${AY - 75} Q ${LX - 28} ${AY} ${LX} ${AY + 75}`} fill="none" stroke="#60a5fa" strokeWidth="3.5" strokeLinecap="round" />
            <path d={`M ${LX} ${AY - 75} Q ${LX + 28} ${AY} ${LX} ${AY + 75} Q ${LX - 28} ${AY} ${LX} ${AY - 75}`} fill="rgba(96,165,250,0.07)" />
          </>
        ) : (
          <>
            <path d={`M ${LX} ${AY - 75} Q ${LX - 26} ${AY} ${LX} ${AY + 75}`} fill="none" stroke="#f43f5e" strokeWidth="3.5" strokeLinecap="round" />
            <path d={`M ${LX} ${AY - 75} Q ${LX + 26} ${AY} ${LX} ${AY + 75}`} fill="none" stroke="#f43f5e" strokeWidth="3.5" strokeLinecap="round" />
            <path d={`M ${LX} ${AY - 75} Q ${LX - 26} ${AY} ${LX} ${AY + 75} Q ${LX + 26} ${AY} ${LX} ${AY - 75}`} fill="rgba(244,63,94,0.04)" />
          </>
        )}

        {/* Focal point */}
        <circle cx={LX + (lensType === 'convex' ? fPx : -fPx)} cy={AY} r="6" fill="#f59e0b"
          style={{ filter: 'drop-shadow(0 0 6px #f59e0b)' }} />
        <text x={LX + (lensType === 'convex' ? fPx : -fPx)} y={AY - 14} fill="#f59e0b"
          fontSize="11" textAnchor="middle" fontFamily="Inter" fontWeight="700">
          F (f = {focalCm} cm)
        </text>

        {/* Parallel incoming rays */}
        {Array.from({ length: numRays }).map((_, i) => {
          const y = AY - 60 + i * 30;
          const fX = LX + (lensType === 'convex' ? fPx : -fPx);
          const fY = AY;
          return (
            <g key={i}>
              {/* Before lens */}
              <line x1="30" y1={y} x2={LX} y2={y} stroke="#fbbf24" strokeWidth="2"
                style={{ filter: 'drop-shadow(0 0 3px #fbbf2455)' }} />
              {/* After lens — converge to F (convex) or diverge from virtual F (concave) */}
              <line x1={LX} y1={y} x2={lensType === 'convex' ? fX + 50 : fX - 50}
                y2={lensType === 'convex' ? fY + (fY - y) * 50 / (fX - LX) : fY + (fY - y) * 50 / (LX - fX)}
                stroke="#00ffcc" strokeWidth="2"
                style={{ filter: 'drop-shadow(0 0 3px #00ffcc55)' }} />
            </g>
          );
        })}

        {/* Power display */}
        <rect x="10" y="265" width="540" height="45" rx="10" fill="rgba(0,0,0,0.6)" />
        <text x="280" y="283" fill="#a1a1aa" fontSize="11" textAnchor="middle" fontFamily="Inter">
          P = 1/f(in metres) = 1/{f.toFixed(2)} m
        </text>
        <text x="280" y="302" fill={power > 0 ? '#00ffcc' : '#f43f5e'} fontSize="15"
          textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontWeight="700">
          Power = {power > 0 ? '+' : ''}{power.toFixed(1)} D (dioptres)
        </text>
      </svg>

      <div className={styles.simControls}>
        <label style={{ color: '#a1a1aa', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
          Focal length: <strong style={{ color: '#f59e0b', fontFamily: 'JetBrains Mono' }}>{focalCm} cm</strong>
          <input type="range" min="10" max="50" step="5" value={focalCm}
            onChange={e => setFocalCm(+e.target.value)} className={styles.simSlider} style={{ flex: 1 }} />
        </label>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SIMULATION 3 — Eye Defects Simulator
═══════════════════════════════════════════════════════════ */
function EyeDefectsSim() {
  const [condition, setCondition] = useState<'normal' | 'myopia' | 'hypermetropia'>('normal');

  /* Eye SVG: cornea at left, retina at right */
  const eyeData = {
    normal: {
      title: 'Normal Eye (Emmetropia)',
      focalX: 320, /* light focuses exactly on retina */
      correction: null,
      desc: 'Light from a distant object focuses exactly on the retina. Clear vision at all distances.',
      col: '#00ffcc',
    },
    myopia: {
      title: 'Myopia (Short-sightedness / Nearsightedness)',
      focalX: 270, /* focuses in front of retina */
      correction: 'concave',
      desc: 'Eyeball too long or cornea too curved → light focuses IN FRONT of retina. Far objects blur. Corrected with CONCAVE (diverging) lens.',
      col: '#f43f5e',
    },
    hypermetropia: {
      title: 'Hypermetropia (Long-sightedness / Farsightedness)',
      focalX: 370, /* focuses behind retina */
      correction: 'convex',
      desc: 'Eyeball too short or cornea too flat → light focuses BEHIND retina. Near objects blur. Corrected with CONVEX (converging) lens.',
      col: '#f59e0b',
    },
  };

  const ed = eyeData[condition];

  return (
    <div className={styles.simulationContainer}>
      <div className={styles.simulationLabel}>👁 Eye Defects — Myopia vs Hypermetropia</div>

      <div className={styles.simControls} style={{ marginBottom: '0.75rem', marginTop: 0 }}>
        {(['normal', 'myopia', 'hypermetropia'] as const).map(c => (
          <button key={c} className={`${styles.simButton} ${condition === c ? styles.active : ''}`}
            onClick={() => setCondition(c)}
            style={{ borderColor: condition === c ? eyeData[c].col : undefined, color: condition === c ? eyeData[c].col : undefined }}>
            {c === 'normal' ? '✅ Normal' : c === 'myopia' ? '🔴 Myopia' : '🟡 Hypermetropia'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={condition} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <svg width="100%" viewBox="0 0 560 280" style={{ display: 'block', maxWidth: '560px', margin: '0 auto' }}>
            {/* Eye outline */}
            <ellipse cx="290" cy="140" rx="100" ry="80" fill="rgba(255,255,255,0.04)" stroke="#94a3b8" strokeWidth="2" />
            {/* Cornea (curved front) */}
            <path d="M 192 118 Q 175 140 192 162" fill="none" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" />
            {/* Lens (crystalline lens shape) */}
            <ellipse cx="230" cy="140" rx="18" ry="30" fill="rgba(96,165,250,0.2)" stroke="#60a5fa" strokeWidth="1.5" />
            {/* Retina (right side) */}
            <path d="M 380 108 Q 395 140 380 172" fill="none" stroke="#00ffcc" strokeWidth="3.5"
              style={{ filter: 'drop-shadow(0 0 4px #00ffcc60)' }} />
            <text x="400" y="135" fill="#00ffcc88" fontSize="10" fontFamily="Inter">Retina</text>
            {/* Pupil */}
            <circle cx="205" cy="140" r="12" fill="#0a0a0f" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="175" y="173" fill="#60a5fa88" fontSize="10" fontFamily="Inter">Cornea</text>
            <text x="218" y="175" fill="#60a5fa88" fontSize="10" fontFamily="Inter">Lens</text>

            {/* Incoming parallel rays (from distant object) */}
            {[-30, 0, 30].map((offset, i) => (
              <line key={i} x1="40" y1={140 + offset} x2={180} y2={140 + offset * 0.8}
                stroke="#fbbf24" strokeWidth="1.8"
                style={{ filter: 'drop-shadow(0 0 3px #fbbf2455)' }} />
            ))}

            {/* Converging rays after cornea/lens */}
            {[-30, 0, 30].map((offset, i) => (
              <line key={i} x1={200} y1={140 + offset * 0.6} x2={ed.focalX} y2={140}
                stroke="#fbbf24" strokeWidth="1.8" opacity="0.8" />
            ))}

            {/* Focal point */}
            <circle cx={ed.focalX} cy={140} r={6}
              fill={ed.focalX === 320 ? '#00ffcc' : ed.focalX < 320 ? '#f43f5e' : '#f59e0b'}
              style={{ filter: `drop-shadow(0 0 8px ${ed.focalX === 320 ? '#00ffcc' : ed.focalX < 320 ? '#f43f5e' : '#f59e0b'})` }} />

            {/* Correction lens (if applicable) */}
            {ed.correction === 'concave' && (
              <>
                <path d="M 100 115 Q 88 140 100 165" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 100 115 Q 112 140 100 165" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
                <text x="80" y="198" fill="#f43f5e" fontSize="10" textAnchor="middle" fontFamily="Inter">Concave</text>
                <text x="80" y="210" fill="#f43f5e" fontSize="10" textAnchor="middle" fontFamily="Inter">lens (−)</text>
              </>
            )}
            {ed.correction === 'convex' && (
              <>
                <path d="M 100 115 Q 112 140 100 165" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 100 115 Q 88 140 100 165" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                <text x="80" y="198" fill="#f59e0b" fontSize="10" textAnchor="middle" fontFamily="Inter">Convex</text>
                <text x="80" y="210" fill="#f59e0b" fontSize="10" textAnchor="middle" fontFamily="Inter">lens (+)</text>
              </>
            )}

            {/* Title */}
            <text x="280" y="25" fill={ed.col} fontSize="12" textAnchor="middle" fontFamily="Inter" fontWeight="700">
              {ed.title}
            </text>

            {/* Focus indicator */}
            <text x={ed.focalX} y={125} fill={ed.col} fontSize="10" textAnchor="middle" fontFamily="Inter">
              {ed.focalX === 320 ? '✓ On retina' : ed.focalX < 320 ? '✗ In front' : '✗ Behind'}
            </text>

            {/* Description */}
            <foreignObject x="10" y="235" width="540" height="40">
              <div style={{ fontSize: '10px', color: '#71717a', lineHeight: 1.5, fontFamily: 'Inter' }}>
                {ed.desc}
              </div>
            </foreignObject>
          </svg>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SIMULATION 4 — Lens Formula Live Calculator
   User inputs u (object distance) and f (focal length).
   Real-time calculation of v, m, and image nature.
═══════════════════════════════════════════════════════════ */
function LensFormulaCalcSim() {
  const [u, setU] = useState(-30);
  const [f, setF] = useState(20);

  /* Apply lens formula: 1/v - 1/u = 1/f  →  v = uf/(u+f) */
  const v = (u * f) / (u + f);
  const m = isFinite(v / u) ? v / u : Infinity;
  const isReal = v > 0;
  const isErect = m > 0;
  const isInfinity = !isFinite(v) || Math.abs(v) > 9999;

  const nature = isInfinity
    ? 'Image at Infinity'
    : `${isReal ? 'Real' : 'Virtual'}, ${isErect ? 'Erect' : 'Inverted'}, ${
        Math.abs(m) > 1.05 ? 'Magnified' : Math.abs(m) < 0.95 ? 'Diminished' : 'Same Size'
      }`;

  const natColor = isInfinity ? '#f59e0b' : isReal ? '#00ffcc' : '#a78bfa';

  /* Mini ray diagram: lens at cx=240, axis at ay=110 */
  const cx = 240; const ay = 110;
  const scale = 2.5;
  const objH = 40;
  const objX = cx + u * scale;       /* u is negative → left of lens */
  const imgX = isInfinity ? cx + 340 : cx + v * scale;
  const imgH = isInfinity ? 0 : m * (-objH);  /* inverted when m < 0 */

  return (
    <div className={styles.simulationContainer}>
      <div className={styles.simulationLabel}>🧮 Lens Formula Live Calculator — 1/v − 1/u = 1/f</div>

      {/* Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <label style={{ fontSize: '0.82rem', color: '#a1a1aa', display: 'block', marginBottom: '0.35rem' }}>
            Object distance u = <strong style={{ color: '#ef4444' }}>{u} cm</strong> (negative = in front of lens)
          </label>
          <input type="range" min={-120} max={-5} value={u} step={1}
            onChange={e => setU(+e.target.value)}
            style={{ width: '100%', accentColor: '#ef4444' }} />
        </div>
        <div>
          <label style={{ fontSize: '0.82rem', color: '#a1a1aa', display: 'block', marginBottom: '0.35rem' }}>
            Focal length f = <strong style={{ color: '#00ffcc' }}>{f} cm</strong>
            &nbsp;<span style={{ color: '#555', fontSize: '0.72rem' }}>(+ convex, − concave)</span>
          </label>
          <input type="range" min={-60} max={60} value={f} step={1}
            onChange={e => setF(+e.target.value === 0 ? 1 : +e.target.value)}
            style={{ width: '100%', accentColor: '#00ffcc' }} />
        </div>
      </div>

      {/* Computed results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Image distance v', val: isInfinity ? '∞' : `${v.toFixed(1)} cm`, col: isReal ? '#00ffcc' : '#a78bfa' },
          { label: 'Magnification m', val: isInfinity ? '∞' : m.toFixed(2), col: Math.abs(m) > 1 ? '#f59e0b' : '#60a5fa' },
          { label: 'Power P', val: `${(100 / f).toFixed(2)} D`, col: f > 0 ? '#34d399' : '#f43f5e' },
        ].map(r => (
          <div key={r.label} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '0.75rem', border: `1px solid ${r.col}30` }}>
            <div style={{ fontSize: '0.72rem', color: '#71717a', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{r.label}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: r.col, fontFamily: 'JetBrains Mono, monospace' }}>{r.val}</div>
          </div>
        ))}
      </div>

      {/* Image nature badge */}
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: natColor, background: `${natColor}15`, padding: '0.4rem 1rem', borderRadius: '20px', border: `1px solid ${natColor}40` }}>
          📸 Image: {nature}
        </span>
      </div>

      {/* Mini ray diagram */}
      <svg width="100%" viewBox="0 0 480 220" style={{ display: 'block', maxWidth: '480px', margin: '0 auto', borderRadius: '10px', background: 'rgba(0,0,0,0.3)' }}>
        {/* Grid */}
        <defs>
          <pattern id="calcgrid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0L0 0 0 24" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="480" height="220" fill="url(#calcgrid)" />

        {/* Principal axis */}
        <line x1="10" y1={ay} x2="470" y2={ay} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="5 3" />

        {/* Lens */}
        {f > 0 ? (
          /* Convex */
          <>
            <path d={`M ${cx} ${ay-70} Q ${cx+22} ${ay} ${cx} ${ay+70}`} fill="none" stroke="#60a5fa" strokeWidth="3" />
            <path d={`M ${cx} ${ay-70} Q ${cx-22} ${ay} ${cx} ${ay+70}`} fill="none" stroke="#60a5fa" strokeWidth="3" />
            <path d={`M ${cx} ${ay-70} Q ${cx+22} ${ay} ${cx} ${ay+70} Q ${cx-22} ${ay} ${cx} ${ay-70}`} fill="rgba(96,165,250,0.07)" />
            {/* Focal points */}
            <circle cx={cx + f*scale} cy={ay} r="5" fill="#f59e0b" />
            <text x={cx + f*scale} y={ay-10} fill="#f59e0b" fontSize="10" textAnchor="middle" fontFamily="Inter" fontWeight="700">F₂</text>
            <circle cx={cx - f*scale} cy={ay} r="5" fill="#f59e0b" />
            <text x={cx - f*scale} y={ay-10} fill="#f59e0b" fontSize="10" textAnchor="middle" fontFamily="Inter" fontWeight="700">F₁</text>
          </>
        ) : (
          /* Concave */
          <>
            <path d={`M ${cx} ${ay-70} Q ${cx-22} ${ay} ${cx} ${ay+70}`} fill="none" stroke="#f43f5e" strokeWidth="3" />
            <path d={`M ${cx} ${ay-70} Q ${cx+22} ${ay} ${cx} ${ay+70}`} fill="none" stroke="#f43f5e" strokeWidth="3" />
            <circle cx={cx + f*scale} cy={ay} r="4" fill="#f59e0b60" strokeDasharray="3 2" />
            <circle cx={cx - f*scale} cy={ay} r="4" fill="#f59e0b60" />
            <text x={cx - f*scale} y={ay-10} fill="#f59e0b99" fontSize="10" textAnchor="middle" fontFamily="Inter">F</text>
          </>
        )}

        {/* Optical centre */}
        <circle cx={cx} cy={ay} r="3" fill="#ffffff60" />
        <text x={cx} y={ay+14} fill="#ffffff60" fontSize="10" textAnchor="middle" fontFamily="Inter">O</text>

        {/* Object arrow — only if it fits in viewbox */}
        {objX > 10 && objX < cx - 5 && (
          <g>
            <line x1={objX} y1={ay} x2={objX} y2={ay - objH} stroke="#ef4444" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 0 4px #ef444460)' }} />
            <polygon fill="#ef4444" points={`${objX},${ay-objH} ${objX-6},${ay-objH+10} ${objX+6},${ay-objH+10}`} />
            <text x={objX} y={ay-objH-8} fill="#ef444499" fontSize="10" textAnchor="middle" fontFamily="Inter">Object</text>
          </g>
        )}

        {/* Image — if within viewbox and not at infinity */}
        {!isInfinity && imgX > 10 && imgX < 470 && (
          <g opacity={isReal ? 1 : 0.75}>
            <line x1={imgX} y1={ay} x2={imgX} y2={ay + imgH}
              stroke={isReal ? '#00ffcc' : '#a78bfa'} strokeWidth="2.5"
              strokeDasharray={isReal ? 'none' : '5 3'}
              style={{ filter: `drop-shadow(0 0 4px ${isReal ? '#00ffcc60' : '#a78bfa60'})` }} />
            <polygon fill={isReal ? '#00ffcc' : '#a78bfa'}
              points={imgH > 0
                ? `${imgX},${ay+imgH} ${imgX-6},${ay+imgH-10} ${imgX+6},${ay+imgH-10}`
                : `${imgX},${ay+imgH} ${imgX-6},${ay+imgH+10} ${imgX+6},${ay+imgH+10}`} />
            <text x={imgX} y={imgH > 0 ? ay+imgH+15 : ay+imgH-8}
              fill={isReal ? '#00ffcc99' : '#a78bfa99'} fontSize="10" textAnchor="middle" fontFamily="Inter">Image</text>
          </g>
        )}

        {isInfinity && (
          <text x="420" y={ay-20} fill="#f59e0b" fontSize="28" fontFamily="JetBrains Mono" fontWeight="700" opacity="0.6">∞</text>
        )}

        <text x="10" y="210" fill="#555" fontSize="9.5" fontFamily="Inter">Scale: 1px = {(1/scale).toFixed(1)} cm</text>
      </svg>

      <div style={{ marginTop: '0.75rem', padding: '0.65rem 1rem', background: 'rgba(0,255,204,0.04)', borderRadius: '8px', border: '1px solid rgba(0,255,204,0.12)', fontSize: '0.84rem', color: '#71717a' }}>
        💡 <strong>Step-by-step:</strong> 1/v = 1/f + 1/u = 1/{f} + 1/{u} = {(1/f).toFixed(3)} + {(1/u).toFixed(3)} = {(1/f + 1/u).toFixed(3)} → v = {isInfinity ? '∞' : v.toFixed(1)} cm &nbsp;|&nbsp; m = v/u = {isInfinity ? '∞' : m.toFixed(2)}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SIMULATION 5 — Human Eye Accommodation Animation
   Shows the lens of the eye getting fatter (near object) or
   thinner (far object) as ciliary muscles contract/relax.
═══════════════════════════════════════════════════════════ */
function EyeAccommodationSim() {
  const [mode, setMode] = useState<'far' | 'near'>('far');
  const [animating, setAnimating] = useState(false);

  /* Lens bulge amount: far = thin, near = fat */
  const bulge = mode === 'near' ? 38 : 16;
  const focalLength = mode === 'near' ? 'Short f (high power)' : 'Long f (low power)';
  const ciliary = mode === 'near' ? 'Contracted (tense)' : 'Relaxed (stretched lens)';

  const EX = 300; const EY = 130; /* eye centre */

  const handleSwitch = (m: 'far' | 'near') => {
    if (m === mode) return;
    setAnimating(true);
    setTimeout(() => { setMode(m); setAnimating(false); }, 300);
  };

  return (
    <div className={styles.simulationContainer}>
      <div className={styles.simulationLabel}>👁 Human Eye Accommodation — Lens Shape Changes</div>

      <div className={styles.simControls} style={{ marginBottom: '1rem' }}>
        <button className={`${styles.simButton} ${mode === 'far' ? styles.active : ''}`} onClick={() => handleSwitch('far')}>
          🌅 Far Object (Relaxed Eye)
        </button>
        <button className={`${styles.simButton} ${mode === 'near' ? styles.active : ''}`} onClick={() => handleSwitch('near')}>
          📖 Near Object (Accommodated)
        </button>
      </div>

      <svg width="100%" viewBox="0 0 600 260" style={{ display: 'block', maxWidth: '600px', margin: '0 auto', overflow: 'visible', transition: 'all 0.3s' }}>
        <defs>
          <radialGradient id="eyeGrad" cx="42%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#1a3a4a" />
            <stop offset="100%" stopColor="#0a1520" />
          </radialGradient>
          <radialGradient id="irisGrad" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#1e4060" />
            <stop offset="100%" stopColor="#0d2030" />
          </radialGradient>
        </defs>

        {/* ── Eyeball ── */}
        <ellipse cx={EX} cy={EY} rx="155" ry="130" fill="url(#eyeGrad)" stroke="#2a4a5a" strokeWidth="2.5" />

        {/* Cornea (front curved surface) */}
        <path d={`M ${EX-100} ${EY} Q ${EX-155} ${EY-55} ${EX-100} ${EY-90} M ${EX-100} ${EY} Q ${EX-155} ${EY+55} ${EX-100} ${EY+90}`}
          fill="none" stroke="#60a5fa" strokeWidth="2" opacity="0.6" />

        {/* Retina (back curved surface) */}
        <path d={`M ${EX+130} ${EY-60} Q ${EX+170} ${EY} ${EX+130} ${EY+60}`}
          fill="none" stroke="#ef4444" strokeWidth="2.5" opacity="0.7" />
        <text x={EX+165} y={EY+5} fill="#ef444490" fontSize="10" fontFamily="Inter" textAnchor="middle">Retina</text>

        {/* Fovea (dot on retina) */}
        <circle cx={EX+148} cy={EY} r="5" fill="#ef444480" style={{ filter: 'drop-shadow(0 0 5px #ef4444)' }} />
        <text x={EX+148} y={EY+16} fill="#ef444499" fontSize="8.5" fontFamily="Inter" textAnchor="middle">Fovea</text>

        {/* Iris */}
        <ellipse cx={EX-82} cy={EY} rx="28" ry="42" fill="url(#irisGrad)" stroke="#2563eb" strokeWidth="1.5" />
        {/* Pupil */}
        <ellipse cx={EX-82} cy={EY} rx="14" ry="22" fill="#000000" />
        <text x={EX-82} y={EY+58} fill="#3b82f699" fontSize="9" fontFamily="Inter" textAnchor="middle">Iris / Pupil</text>

        {/* Aqueous humor label */}
        <text x={EX-30} y={EY-95} fill="#71717a" fontSize="9" fontFamily="Inter" textAnchor="middle">Aqueous humor</text>

        {/* ── Crystalline Lens (changes shape based on mode) ── */}
        <ellipse
          cx={EX - 20} cy={EY}
          rx={bulge} ry={50}
          fill="rgba(250,204,21,0.22)"
          stroke="#fbbf24" strokeWidth="2.5"
          style={{ transition: 'all 0.45s cubic-bezier(0.4,0,0.2,1)', filter: 'drop-shadow(0 0 8px rgba(251,191,36,0.4))' }}
        />
        <text x={EX-20} y={EY+64} fill="#fbbf24aa" fontSize="9" fontFamily="Inter" textAnchor="middle">Crystalline Lens</text>

        {/* Ciliary muscle indicator */}
        {mode === 'near' ? (
          <>
            <ellipse cx={EX-20} cy={EY} rx="60" ry="68" fill="none" stroke="rgba(16,185,129,0.5)" strokeWidth="2" strokeDasharray="5 3" />
            <text x={EX-20} y={EY-74} fill="#10b981aa" fontSize="9" fontFamily="Inter" textAnchor="middle">Ciliary muscles CONTRACTED</text>
          </>
        ) : (
          <>
            <ellipse cx={EX-20} cy={EY} rx="72" ry="65" fill="none" stroke="rgba(161,161,170,0.3)" strokeWidth="1.5" strokeDasharray="4 3" />
            <text x={EX-20} y={EY-71} fill="#71717a" fontSize="9" fontFamily="Inter" textAnchor="middle">Ciliary muscles relaxed</text>
          </>
        )}

        {/* ── Light rays ── */}
        {mode === 'far' ? (
          /* Parallel rays (from far object) → converge on retina */
          <>
            <line x1="10" y1={EY-45} x2={EX-100} y2={EY-45} stroke="#fbbf24" strokeWidth="1.5" opacity="0.7" />
            <line x1="10" y1={EY} x2={EX-100} y2={EY} stroke="#fbbf24" strokeWidth="2" opacity="0.9" />
            <line x1="10" y1={EY+45} x2={EX-100} y2={EY+45} stroke="#fbbf24" strokeWidth="1.5" opacity="0.7" />
            {/* Rays refracted through cornea+lens → converge on fovea */}
            <line x1={EX-100} y1={EY-45} x2={EX+148} y2={EY} stroke="#fbbf24" strokeWidth="1.5" opacity="0.5" strokeDasharray="4 2" />
            <line x1={EX-100} y1={EY} x2={EX+148} y2={EY} stroke="#fbbf24" strokeWidth="1.5" opacity="0.5" strokeDasharray="4 2" />
            <line x1={EX-100} y1={EY+45} x2={EX+148} y2={EY} stroke="#fbbf24" strokeWidth="1.5" opacity="0.5" strokeDasharray="4 2" />
          </>
        ) : (
          /* Diverging rays (from near object) → eye must converge harder */
          <>
            <line x1="55" y1={EY-55} x2={EX-100} y2={EY-25} stroke="#f97316" strokeWidth="1.5" opacity="0.7" />
            <line x1="55" y1={EY} x2={EX-100} y2={EY} stroke="#f97316" strokeWidth="2" opacity="0.9" />
            <line x1="55" y1={EY+55} x2={EX-100} y2={EY+25} stroke="#f97316" strokeWidth="1.5" opacity="0.7" />
            <line x1={EX-100} y1={EY-25} x2={EX+148} y2={EY} stroke="#f97316" strokeWidth="1.5" opacity="0.5" strokeDasharray="4 2" />
            <line x1={EX-100} y1={EY} x2={EX+148} y2={EY} stroke="#f97316" strokeWidth="1.5" opacity="0.5" strokeDasharray="4 2" />
            <line x1={EX-100} y1={EY+25} x2={EX+148} y2={EY} stroke="#f97316" strokeWidth="1.5" opacity="0.5" strokeDasharray="4 2" />
            {/* Near object */}
            <line x1="55" y1={EY} x2="55" y2={EY-60} stroke="#ef4444" strokeWidth="2" />
            <polygon fill="#ef4444" points={`55,${EY-60} 49,${EY-50} 61,${EY-50}`} />
            <text x="55" y={EY-68} fill="#ef444490" fontSize="9" fontFamily="Inter" textAnchor="middle">Near</text>
            <text x="55" y={EY-68+11} fill="#ef444090" fontSize="9" fontFamily="Inter" textAnchor="middle">object</text>
          </>
        )}

        {/* Optic nerve */}
        <line x1={EX+150} y1={EY} x2={EX+170} y2={EY} stroke="#6366f1" strokeWidth="3" />
        <text x={EX+172} y={EY+4} fill="#6366f190" fontSize="9" fontFamily="Inter">→ Brain</text>

        {/* Cornea label */}
        <text x={EX-142} y={EY-55} fill="#60a5fa80" fontSize="9" fontFamily="Inter">Cornea</text>

        {/* Vitreous humor */}
        <text x={EX+40} y={EY-80} fill="#71717a" fontSize="9" fontFamily="Inter" textAnchor="middle">Vitreous humor</text>
      </svg>

      {/* Info panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
        <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(251,191,36,0.2)' }}>
          <div style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 700, marginBottom: '0.25rem', textTransform: 'uppercase' }}>Crystalline Lens</div>
          <div style={{ fontSize: '0.88rem', color: '#f4f4f5' }}>{mode === 'near' ? 'Fat & bulging — shorter focal length' : 'Thin & flat — longer focal length'}</div>
        </div>
        <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)' }}>
          <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, marginBottom: '0.25rem', textTransform: 'uppercase' }}>Ciliary Muscles</div>
          <div style={{ fontSize: '0.88rem', color: '#f4f4f5' }}>{ciliary}</div>
        </div>
        <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(96,165,250,0.2)' }}>
          <div style={{ fontSize: '0.72rem', color: '#60a5fa', fontWeight: 700, marginBottom: '0.25rem', textTransform: 'uppercase' }}>Focal Length</div>
          <div style={{ fontSize: '0.88rem', color: '#f4f4f5' }}>{focalLength}</div>
        </div>
        <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(161,161,170,0.2)' }}>
          <div style={{ fontSize: '0.72rem', color: '#a1a1aa', fontWeight: 700, marginBottom: '0.25rem', textTransform: 'uppercase' }}>Light Rays</div>
          <div style={{ fontSize: '0.88rem', color: '#f4f4f5' }}>{mode === 'near' ? 'Diverging from close object' : 'Parallel (from infinity)'}</div>
        </div>
      </div>

      <div style={{ marginTop: '0.75rem', padding: '0.65rem 1rem', background: 'rgba(0,255,204,0.04)', borderRadius: '8px', border: '1px solid rgba(0,255,204,0.1)', fontSize: '0.83rem', color: '#71717a' }}>
        💡 <strong>Accommodation</strong> is the ability of the eye to change its focal length by changing the shape of the crystalline lens.
        Maximum accommodation (shortest f) occurs when looking at the <em>near point</em> (25 cm for a normal eye).
        Minimum accommodation (longest f) occurs when looking at the <em>far point</em> (∞ for a normal eye).
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function LensesPage() {
  const [focusMode, setFocusMode] = useState(false);
  const [mcqAns, setMcqAns] = useState<Record<number, number>>({});
  const [mcqDone, setMcqDone] = useState<Record<number, boolean>>({});
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const mcqs = [
    { q: 'A convex lens is also known as:',
      opts: ['Diverging lens', 'Converging lens', 'Plane lens', 'Biconcave lens'],
      ans: 1, exp: 'Convex lens (thicker in the middle) converges parallel rays to a focal point — hence it is called a CONVERGING lens.' },
    { q: 'The power of a lens with focal length 25 cm is:',
      opts: ['+4 D', '−4 D', '+25 D', '−25 D'],
      ans: 0, exp: 'P = 1/f(m) = 1/0.25 = +4 D. Positive sign because it is a convex (converging) lens. f = 25 cm = 0.25 m.' },
    { q: 'A magnifying glass uses:',
      opts: ['Concave lens with object beyond F', 'Convex lens with object between F and O', 'Concave mirror', 'Convex mirror'],
      ans: 1, exp: 'A magnifying glass is a convex lens with the object placed between the focal point F and the optical centre O. This gives virtual, erect, magnified image.' },
    { q: 'Which lens always forms a virtual, erect, diminished image?',
      opts: ['Convex lens (object beyond F)', 'Concave lens (any position)', 'Convex lens (object between F and O)', 'Concave mirror'],
      ans: 1, exp: 'A concave (diverging) lens ALWAYS forms a virtual, erect, diminished image regardless of where the object is placed.' },
    { q: 'The lens formula is:',
      opts: ['1/v + 1/u = 1/f', '1/v − 1/u = 1/f', '1/f = 1/v + 1/u', 'v + u = f'],
      ans: 1, exp: 'Lens formula: 1/v − 1/u = 1/f (note the MINUS sign, unlike mirror formula which has PLUS). Remember: New Cartesian sign convention applies.' },
    { q: 'A person with myopia (short-sightedness) should use:',
      opts: ['Convex lens', 'Concave lens', 'Plane glass', 'Bifocal lens'],
      ans: 1, exp: 'Myopia: eyeball too long → image forms in front of retina. Concave (diverging) lens shifts the image back onto the retina. Prescription has negative (-) power.' },
    { q: 'If two lenses of power +3 D and −1 D are in contact, the combined power is:',
      opts: ['+4 D', '+2 D', '−2 D', '+3 D'],
      ans: 1, exp: 'Combined power P = P₁ + P₂ = (+3) + (−1) = +2 D. Lenses in contact — powers are simply added algebraically.' },
    { q: 'A convex lens of f = 20 cm has an object at 30 cm. The magnification is:',
      opts: ['+2', '−2', '+0.5', '−0.5'],
      ans: 1, exp: '1/v − 1/u = 1/f → 1/v = 1/20 + 1/(−30) = 3/60 − 2/60 = 1/60 → v = 60. m = v/u = 60/(−30) = −2. Real, inverted, magnified (×2).' },
  ];

  const flashcards = [
    { q: 'Lens Formula — write and explain', a: '1/v − 1/u = 1/f\n• v = image distance (from optical centre O)\n• u = object distance (from O)\n• f = focal length of lens\nSign convention same as mirrors (incident light direction = positive)' },
    { q: 'Power of a Lens — define and formula', a: 'Power P = ability of lens to converge (or diverge) light.\nP = 1/f (f must be in METRES)\nUnit: Dioptre (D) = m⁻¹\nConvex lens: P > 0 (converging)\nConcave lens: P < 0 (diverging)\nLenses in contact: P_total = P₁ + P₂ + ...' },
    { q: 'Image by concave lens: always what?', a: 'ALWAYS: Virtual, Erect, Diminished\n(Regardless of object position)\nMagnification m is always between 0 and 1 (positive, less than 1)\nNo case of real image for concave lens' },
    { q: 'Convex lens as Magnifying Glass — how?', a: 'Object placed BETWEEN F and O (between focus and optical centre)\n→ Image: Virtual, Erect, Magnified (on same side as object)\nThis is why magnifying glasses make things look bigger!\nm > 1, positive (same side as object)\nUsed in: reading glass, jeweller\'s loupe, simple microscope' },
    { q: 'What is Myopia? Cause and Correction?', a: 'Myopia = Short-sightedness\nCause: Eyeball too long OR cornea too curved → image forms IN FRONT of retina\nEffect: Cannot see distant objects clearly\nCorrection: CONCAVE lens (negative power)\nThe concave lens diverges rays first, so they focus exactly on retina' },
    { q: 'What is Hypermetropia? Cause and Correction?', a: 'Hypermetropia = Long-sightedness (Farsightedness)\nCause: Eyeball too short OR cornea too flat → image forms BEHIND retina\nEffect: Cannot see near objects clearly\nCorrection: CONVEX lens (positive power)\nThe convex lens converges rays, pulling the focus forward onto retina' },
    { q: 'Combined Power of Lenses in Contact', a: 'P_total = P₁ + P₂ + P₃ + ...\nOR equivalently: 1/f_total = 1/f₁ + 1/f₂ + 1/f₃ + ...\nExample: +3D and −1D in contact → P = +3 + (−1) = +2D\nThis is used in optometry to combine lenses to get exact prescriptions' },
    { q: 'What is Presbyopia? How is it different from myopia/hypermetropia?', a: 'Presbyopia = age-related loss of focusing ability\nCause: Gradual weakening of ciliary muscles (eye muscles that control lens shape)\nEffect: Can\'t see clearly at near OR far distance\nCorrection: Bifocal lenses (upper part = concave for far; lower = convex for near)\nUnlike myopia/hypermetropia which are structural, presbyopia is age-related' },
  ];

  return (
    <div className={styles.chapterContainer}>
      <div className={`${styles.chapterLayout} ${focusMode ? styles.focusModeActive : ''}`}>

        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <Link href="/class-10/light-reflection-and-refraction" className={styles.backButton}>
              <ChevronLeft size={14} /> Light Chapter
            </Link>
            <h2>🔭 Lenses</h2>
          </div>
          <nav className={styles.sidebarNav}>
            {[
              { href: '#intro', icon: <Focus size={13} />, label: 'Lens Types' },
              { href: '#image', icon: <Eye size={13} />, label: 'Image Formation' },
              { href: '#formula', icon: <BookOpen size={13} />, label: 'Lens Formula' },
              { href: '#power', icon: <Zap size={13} />, label: 'Power of Lens' },
              { href: '#human-eye', icon: <Eye size={13} />, label: 'Human Eye' },
              { href: '#defects', icon: <Target size={13} />, label: 'Eye Defects' },
              { href: '#instruments', icon: <Lightbulb size={13} />, label: 'Optical Instruments' },
              { href: '#numericals', icon: <Award size={13} />, label: 'Solved Numericals' },
              { href: '#quiz', icon: <Target size={13} />, label: 'MCQ Quiz' },
              { href: '#flashcards', icon: <RotateCcw size={13} />, label: 'Flashcards' },
            ].map(item => (
              <a key={item.href} href={item.href} className={styles.navLink}>{item.icon} {item.label}</a>
            ))}
          </nav>
          <div style={{ marginTop: 'auto' }}>
            {[
              { href: '/class-10/light-reflection-and-refraction/reflection', label: '← Reflection', col: '#3b82f6' },
              { href: '/class-10/light-reflection-and-refraction/refraction', label: '← Refraction', col: '#f59e0b' },
              { href: '/class-10/light-reflection-and-refraction/summary', label: '→ Summary', col: '#7c3aed' },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{
                display: 'block', padding: '0.5rem 0.75rem', marginBottom: '0.35rem',
                background: 'rgba(255,255,255,0.03)', borderRadius: '7px', color: l.col,
                fontSize: '0.83rem', textDecoration: 'none', fontWeight: 600,
                border: `1px solid ${l.col}22`, transition: 'all 0.2s',
              }}>{l.label}</Link>
            ))}
            <button onClick={() => setFocusMode(f => !f)} className={styles.focusModeToggle}
              style={{ width: '100%', marginTop: '0.75rem' }}>
              {focusMode ? '↩ Exit Focus Mode' : '🎯 Focus Mode'}
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className={styles.mainContent}>

          {/* HERO */}
          <section className={styles.heroSection} id="intro">
            <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', height: '260px' }}>
              <Image src="/images/light/light_lenses_nano_banana_1781202878730.png"
                alt="Spherical Lenses — Convex and Concave" fill style={{ objectFit: 'cover' }} priority />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(9,9,11,0.88) 0%, rgba(9,9,11,0.35) 100%)' }} />
              <div style={{ position: 'absolute', inset: 0, padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  {['Class 10', 'Physics', 'Chapter 10', 'Lenses'].map(t => (
                    <span key={t} className={styles.infoTag}>{t}</span>
                  ))}
                </div>
                <h1 className={styles.chapterTitle}>Spherical Lenses</h1>
                <p style={{ color: 'rgba(255,255,255,0.65)', marginTop: '0.5rem', fontSize: '1rem' }}>
                  Lens formula, power, image formation, human eye and vision defects — with interactive simulations
                </p>
              </div>
            </div>
          </section>

          {/* LENS TYPES */}
          <section className={styles.contentSection}>
            <h2>🔭 Types of Lenses</h2>
            <p>
              A <strong style={{ color: '#00ffcc' }}>lens</strong> is a transparent optical device that refracts light.
              There are two main types, and they behave in opposite ways with respect to light rays.
            </p>

            <div className={styles.imageGrid}>
              {[
                { src: '/images/light/light_convex_concave_1781203107265.png', caption: 'Convex (converging) lens vs Concave (diverging) lens — opposite effect on light' },
                { src: '/images/light/light_lenses_nano_banana_1781202878730.png', caption: 'Real-life lens applications: camera, spectacles, microscope, telescope' },
              ].map((img, i) => (
                <motion.div key={i} className={styles.imageCard} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                  <img src={img.src} alt={img.caption} loading="lazy" style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
                  <div className={styles.imageCardCaption}>{img.caption}</div>
                </motion.div>
              ))}
            </div>

            <div className={styles.grid2}>
              <div className={styles.glassPanel} style={{ borderColor: 'rgba(96,165,250,0.3)' }}>
                <strong>🔵 Convex Lens (Converging):</strong><br />
                Thicker at the centre than at edges. Converges parallel rays to focal point F.
                Can form both REAL and VIRTUAL images.
                <br /><br /><strong>Examples:</strong> Camera lens, projector lens, magnifying glass, eye lens, spectacles for hypermetropia
              </div>
              <div className={styles.glassPanel} style={{ borderColor: 'rgba(244,63,94,0.3)' }}>
                <strong>🔴 Concave Lens (Diverging):</strong><br />
                Thinner at the centre than at edges. Diverges parallel rays away from a virtual focal point.
                ALWAYS forms virtual, erect, diminished image.
                <br /><br /><strong>Examples:</strong> Spectacles for myopia (near-sightedness), peephole in doors
              </div>
            </div>

            <h3 style={{ color: '#00ffcc', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Key Terms for Lenses</h3>
            <ul className={styles.terminologyList}>
              <li><strong>Optical Centre (O):</strong> The central point of the lens — all distances measured from here</li>
              <li><strong>Principal Axis:</strong> Line through optical centre perpendicular to the lens</li>
              <li><strong>Principal Focus (F):</strong> Where parallel rays converge (convex) or appear to diverge from (concave)</li>
              <li><strong>Focal Length (f):</strong> Distance from O to F</li>
              <li><strong>Aperture:</strong> Effective diameter of the lens</li>
            </ul>
          </section>

          {/* IMAGE FORMATION */}
          <section className={styles.contentSection} id="image">
            <h2>🖼️ Image Formation by Lenses</h2>
            <p>
              The image formed by a lens depends on the object&apos;s position relative to the focal point F and the optical centre O.
              Convex lenses can form 5 different types of images depending on where the object is placed!
            </p>

            <div className={styles.imageGrid}>
              {[
                { src: '/images/light/convex-lens-all-cases.png', caption: 'Convex lens — all 5 image cases: beyond 2F, at 2F, between F and 2F, at F, between F and O' },
                { src: '/images/light/light_convex_lens_numerical_nano_banana_1781204470042.png', caption: 'Convex lens image formation — 3 principal rays: parallel ray, ray through optical centre, ray through F₁' },
                { src: '/images/light/light_concave_lens_numerical_nano_banana_1781204487446.png', caption: 'Concave lens — always virtual, erect, diminished regardless of object position' },
              ].map((img, i) => (
                <div key={i} className={styles.imageCard}>
                  <img src={img.src} alt={img.caption} loading="lazy" style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
                  <div className={styles.imageCardCaption}>{img.caption}</div>
                </div>
              ))}
            </div>

            {/* Convex Lens image formation table */}
            <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(0,255,204,0.06)', borderBottom: '1px solid rgba(0,255,204,0.2)' }}>
                    {['Object Position', 'Image Position', 'Nature', 'Orientation', 'Size', 'Application'].map(h => (
                      <th key={h} style={{ padding: '0.65rem 0.75rem', textAlign: 'left', color: '#00ffcc', fontWeight: 700, fontSize: '0.82rem' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['At infinity', 'At F₂', 'Real', 'Inverted', 'Diminished (point)', 'Camera, telescope'],
                    ['Beyond 2F₁', 'Between F₂ and 2F₂', 'Real', 'Inverted', 'Diminished', 'Camera, human eye'],
                    ['At 2F₁', 'At 2F₂', 'Real', 'Inverted', 'Same size', 'Photocopier (1:1)'],
                    ['Between F₁ and 2F₁', 'Beyond 2F₂', 'Real', 'Inverted', 'Magnified', 'Projector, microscope'],
                    ['At F₁', 'At infinity', '—', '—', '—', 'Searchlight, spotlight'],
                    ['Between F₁ and O', 'Same side (virtual)', 'Virtual', 'Erect', 'Magnified', 'Magnifying glass'],
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
                      {row.map((cell, j) => (
                        <td key={j} style={{ padding: '0.6rem 0.75rem', color: j === 2 ? (cell === 'Real' ? '#00ffcc' : '#a78bfa') : j === 3 ? (cell === 'Inverted' ? '#f43f5e' : '#10b981') : '#a1a1aa' }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ★ SOLVED EXAMPLES — Lenses (before simulation) */}
            <div className={styles.solvedExamples}>
              <h3 className={styles.solvedExamplesTitle}>📝 Solved Examples — Convex & Concave Lenses</h3>

              <div className={styles.exampleCard}>
                <div className={styles.exampleBadge}>Example 1 — Convex Lens, Real Image</div>
                <p className={styles.exampleQ}>An object 4 cm tall is placed 30 cm from a convex lens of focal length 20 cm. Find the position, size and nature of the image.</p>
                <div className={styles.exampleSol}>{`Given: u = −30 cm, f = +20 cm (convex), h = 4 cm

Lens Formula: 1/v − 1/u = 1/f
1/v = 1/f + 1/u = 1/20 + 1/(−30) = 1/20 − 1/30 = (3 − 2)/60 = 1/60

v = `}<span className={styles.highlight}>+60 cm</span>{`   (positive → Real, on other side of lens)

m = v/u = 60/(−30) = `}<span className={styles.highlight}>−2</span>{`   (negative → Real, Inverted, 2× magnified)

h' = m × h = −2 × 4 = `}<span className={styles.highlight}>−8 cm</span>{`   (8 cm tall, inverted)`}
                  <span className={styles.answer}>∴ Image at 60 cm (opposite side) | Real | Inverted | Magnified 2× | 8 cm tall</span>
                </div>
              </div>

              <div className={styles.exampleCard}>
                <div className={styles.exampleBadge}>Example 2 — Convex Lens, Virtual Image</div>
                <p className={styles.exampleQ}>An object is placed 10 cm from a convex lens of focal length 15 cm. Find the image position and nature.</p>
                <div className={styles.exampleSol}>{`Given: u = −10 cm, f = +15 cm (object between F and lens)

Lens Formula: 1/v = 1/f + 1/u
1/v = 1/15 + 1/(−10) = 1/15 − 1/10 = (2 − 3)/30 = −1/30

v = `}<span className={styles.highlight}>−30 cm</span>{`   (negative → Virtual, on SAME side as object)

m = v/u = (−30)/(−10) = `}<span className={styles.highlight}>+3</span>{`   (positive → Virtual, Erect, 3× magnified)`}
                  <span className={styles.answer}>∴ Virtual image 30 cm on same side as object | Erect | Magnified 3× — acts as magnifying glass!</span>
                </div>
              </div>

              <div className={styles.exampleCard}>
                <div className={styles.exampleBadge}>Example 3 — Concave Lens</div>
                <p className={styles.exampleQ}>An object is placed 20 cm from a concave lens of focal length 15 cm. Find the image position, magnification and nature.</p>
                <div className={styles.exampleSol}>{`Given: u = −20 cm, f = −15 cm (concave → f negative)

Lens Formula: 1/v = 1/f + 1/u
1/v = 1/(−15) + 1/(−20) = −1/15 − 1/20 = (−4 − 3)/60 = −7/60

v = `}<span className={styles.highlight}>−60/7 ≈ −8.57 cm</span>{`   (Virtual, same side as object)

m = v/u = (−8.57)/(−20) = `}<span className={styles.highlight}>+0.43</span>{`   (Erect, Diminished)`}
                  <span className={styles.answer}>∴ Virtual image 8.57 cm, same side as object | Erect | Diminished — Concave lens ALWAYS this!</span>
                </div>
              </div>

              <div className={styles.exampleCard}>
                <div className={styles.exampleBadge}>Example 4 — Combined Lens Power</div>
                <p className={styles.exampleQ}>Two lenses of focal lengths +25 cm and −50 cm are placed in contact. Find (a) combined focal length, (b) combined power, (c) nature of combined lens.</p>
                <div className={styles.exampleSol}>{`Given: f₁ = +25 cm = +0.25 m, f₂ = −50 cm = −0.50 m

P₁ = 1/f₁ = 1/0.25 = `}<span className={styles.highlight}>+4 D</span>{`
P₂ = 1/f₂ = 1/(−0.50) = `}<span className={styles.highlight}>−2 D</span>{`

Combined power: P = P₁ + P₂ = 4 + (−2) = `}<span className={styles.highlight}>+2 D</span>{`

Combined focal length: f = 1/P = 1/2 m = `}<span className={styles.highlight}>50 cm</span>
                  <span className={styles.answer}>∴ P = +2 D | f = 50 cm | Convex (positive power → converging)</span>
                </div>
              </div>

              <div className={styles.exampleCard}>
                <div className={styles.exampleBadge}>Example 5 — Object at 2F</div>
                <p className={styles.exampleQ}>An object is placed at 2F from a convex lens (f = 12 cm). Without calculation, describe the image. Verify using the lens formula.</p>
                <div className={styles.exampleSol}>{`Object at 2F means: u = −2f = −24 cm, f = +12 cm

Verification: 1/v = 1/f + 1/u = 1/12 + 1/(−24) = (2 − 1)/24 = 1/24

v = `}<span className={styles.highlight}>+24 cm = 2f</span>{`   (Image also at 2F on other side)

m = v/u = 24/(−24) = `}<span className={styles.highlight}>−1</span>{`   (Same size)`}
                  <span className={styles.answer}>∴ When object at 2F: Image at 2F | Real | Inverted | Same size | This is the rule for object at 2F!</span>
                </div>
              </div>
            </div>

            {/* ★ SIMULATION 1 — Lens Ray Tracer (lazy-loaded) */}
            <LazyMount><LensRayTracerSim /></LazyMount>
          </section>

          {/* LENS FORMULA */}
          <section className={styles.contentSection} id="formula">
            <h2>📐 Lens Formula & Magnification</h2>

            <div className={styles.imageGrid}>
              {[
                { src: '/images/light/convex-lens-magnifying-glass.png', caption: 'Convex lens as magnifying glass — object between F and O gives virtual, erect, magnified image' },
                { src: '/images/light/lens-power-dioptre.png', caption: 'Power of lens (Dioptre) — shorter focal length = higher power; P_total = P₁ + P₂' },
                { src: '/images/light/light_lens_magnification_nano_banana_1781204503146.png', caption: 'Magnification by lens: m = v/u = h′/h (note: no minus sign, unlike mirrors)' },
                { src: '/images/light/light_lens_power_1781203118675.png', caption: 'Lens power applications: reading glasses (+D), myopia glasses (−D)' },
              ].map((img, i) => (
                <div key={i} className={styles.imageCard}>
                  <img src={img.src} alt={img.caption} loading="lazy" style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
                  <div className={styles.imageCardCaption}>{img.caption}</div>
                </div>
              ))}
            </div>

            <div className={styles.formulaBox}>
              <h3>🔢 Lens Formula</h3>
              <span className={styles.mathEquation}>1/v − 1/u = 1/f</span>
              <p>Note: MINUS sign (unlike mirror formula which has plus). All distances from Optical Centre O using New Cartesian Sign Convention.</p>
            </div>

            <div className={styles.formulaBox}>
              <h3>📏 Magnification (Lens)</h3>
              <span className={styles.mathEquation}>m = v/u = h′/h</span>
              <p>
                m {'>'} 0 → Virtual, Erect | m {'<'} 0 → Real, Inverted<br />
                Note: Unlike mirrors, m = v/u (NOT −v/u) for lenses
              </p>
            </div>
          </section>

          {/* POWER */}
          <section className={styles.contentSection} id="power">
            <h2>⚡ Power of a Lens</h2>
            <p>
              The <strong style={{ color: '#00ffcc' }}>power</strong> of a lens measures its ability to converge or diverge light rays.
              A lens with shorter focal length bends light more strongly and has higher power.
            </p>

            <div className={styles.formulaBox}>
              <h3>⚡ Power Formula</h3>
              <span className={styles.mathEquation}>P = 1/f</span>
              <p>
                f must be in METRES. Unit of power = <strong>Dioptre (D)</strong><br />
                Convex lens: P {'>'} 0 (positive) | Concave lens: P {'<'} 0 (negative)<br />
                Combined lenses (in contact): P_total = P₁ + P₂ + P₃ + ...
              </p>
            </div>

            {/* ★ SOLVED EXAMPLES — Lens Formula & Power (before calculators) */}
            <div className={styles.solvedExamples}>
              <h3 className={styles.solvedExamplesTitle}>📝 Solved Examples — Lens Formula & Power of Lens</h3>

              <div className={styles.exampleCard}>
                <div className={styles.exampleBadge}>Example 1 — Power of Spectacle Lens</div>
                <p className={styles.exampleQ}>A person with myopia needs a concave lens of focal length 50 cm to correct their vision. Find the power of this lens. Also find the far point of this person.</p>
                <div className={styles.exampleSol}>{`Given: f = −50 cm = −0.50 m (concave for myopia)

Power P = 1/f = 1/(−0.50) = `}<span className={styles.highlight}>−2.0 Dioptre</span>{`

Far point = 50 cm (the myopic person cannot see beyond 50 cm clearly)
The concave lens makes distant objects appear to be at 50 cm.`}
                  <span className={styles.answer}>∴ P = −2.0 D | Far point = 50 cm | Prescription: −2.0 D concave lens</span>
                </div>
              </div>

              <div className={styles.exampleCard}>
                <div className={styles.exampleBadge}>Example 2 — Find Focal Length from Power</div>
                <p className={styles.exampleQ}>A doctor prescribes +2.5 D lenses for a patient. Find the focal length and type of lens. What eye defect is being corrected?</p>
                <div className={styles.exampleSol}>{`Given: P = +2.5 D (positive → Convex lens)

f = 1/P = 1/2.5 = `}<span className={styles.highlight}>0.4 m = 40 cm</span>{`

Positive power → Convex (converging) lens
Used for Hypermetropia (far-sightedness) — near objects appear blurred`}
                  <span className={styles.answer}>∴ f = 40 cm | Convex lens | Corrects Hypermetropia (near-sightedness — cannot see near objects)</span>
                </div>
              </div>

              <div className={styles.exampleCard}>
                <div className={styles.exampleBadge}>Example 3 — Object at Infinity</div>
                <p className={styles.exampleQ}>A convex lens of focal length 20 cm. An object is placed: (a) at infinity, (b) at 60 cm. Find image positions.</p>
                <div className={styles.exampleSol}>{`(a) Object at infinity: u = ∞ → 1/u = 0

1/v = 1/f + 1/u = 1/20 + 0 = 1/20 → v = `}<span className={styles.highlight}>+20 cm</span>{`   (at Focus F, Real, Point-sized)

(b) Object at 60 cm: u = −60 cm

1/v = 1/20 + 1/(−60) = 3/60 − 1/60 = 2/60 = 1/30
v = `}<span className={styles.highlight}>+30 cm</span>{`   (beyond F, Real, Inverted, Diminished)`}
                  <span className={styles.answer}>∴ (a) Image at f = 20 cm [at F, real, point] | (b) Image at 30 cm [real, inverted, diminished]</span>
                </div>
              </div>

              <div className={styles.exampleCard}>
                <div className={styles.exampleBadge}>Example 4 — Magnification Problem</div>
                <p className={styles.exampleQ}>A convex lens forms a real, inverted image 3× the size of the object. If the image is at 45 cm from the lens, find the focal length.</p>
                <div className={styles.exampleSol}>{`Given: m = −3 (real, inverted), v = +45 cm (real image)

From m = v/u:  −3 = 45/u → u = `}<span className={styles.highlight}>−15 cm</span>{`

Lens Formula: 1/f = 1/v − 1/u = 1/45 − 1/(−15) = 1/45 + 1/15
= 1/45 + 3/45 = 4/45

f = `}<span className={styles.highlight}>45/4 = 11.25 cm</span>
                  <span className={styles.answer}>∴ f = 11.25 cm | Object at 15 cm | Image at 45 cm (3× magnified, real, inverted)</span>
                </div>
              </div>
            </div>

            {/* ★ SIMULATION 4 — Lens Formula Live Calculator (lazy-loaded) */}
            <LazyMount><LensFormulaCalcSim /></LazyMount>

            {/* ★ SIMULATION 2 — Power Calculator (lazy-loaded) */}
            <LazyMount><PowerOfLensSim /></LazyMount>
          </section>

          {/* HUMAN EYE */}
          <section className={styles.contentSection} id="human-eye">
            <h2>👁️ The Human Eye</h2>
            <p>
              The human eye is a remarkable optical instrument that uses a convex lens (the crystalline lens) to form images
              on the retina. It can automatically adjust its focal length — a property called <strong style={{ color: '#00ffcc' }}>accommodation</strong>.
            </p>

            <div className={styles.imageGrid}>
              {[
                { src: '/images/light/human-eye-full-anatomy.png', caption: 'Human eye full anatomy — all labeled: cornea, aqueous humor, iris, crystalline lens, ciliary muscles, retina, fovea, optic nerve', wide: true },
                { src: '/images/light/human-eye-anatomy-detail.png', caption: 'Human eye — crystalline lens changes shape (accommodation) to focus near and far objects', wide: false },
              ].map((img, i) => (
                <motion.div key={i} className={styles.imageCard} style={{ gridColumn: img.wide ? '1 / -1' : 'auto' }} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                  <img src={img.src} alt={img.caption} loading="lazy" style={{ width: '100%', height: img.wide ? '260px' : '220px', objectFit: 'cover', display: 'block' }} />
                  <div className={styles.imageCardCaption}>{img.caption}</div>
                </motion.div>
              ))}
            </div>

            <div className={styles.glassPanel} style={{ borderColor: 'rgba(0,255,204,0.25)' }}>
              <strong>Parts of the Eye and their functions:</strong>
              <ul>
                <li><strong>Cornea:</strong> Transparent front surface — does most of the focusing (~70% of eye&apos;s refractive power)</li>
                <li><strong>Iris:</strong> Coloured ring that controls pupil size (more light → smaller pupil)</li>
                <li><strong>Pupil:</strong> Opening through which light enters</li>
                <li><strong>Crystalline Lens:</strong> Biconvex lens that fine-tunes focus. Ciliary muscles change its curvature (accommodation)</li>
                <li><strong>Retina:</strong> Light-sensitive screen at back of eye. Contains rods (dim light) and cones (colour/bright)</li>
                <li><strong>Optic Nerve:</strong> Transmits electrical signals from retina to brain</li>
                <li><strong>Vitreous Humour:</strong> Jelly-like fluid filling the eyeball</li>
              </ul>
            </div>

            {/* ★ SOLVED EXAMPLES — Human Eye (before accommodation sim) */}
            <div className={styles.solvedExamples}>
              <h3 className={styles.solvedExamplesTitle}>📝 Solved Examples — Human Eye & Vision</h3>

              <div className={styles.exampleCard}>
                <div className={styles.exampleBadge}>Example 1 — Near & Far Point</div>
                <p className={styles.exampleQ}>A normal human eye has a near point of 25 cm and far point at infinity. Explain what this means in terms of accommodation.</p>
                <div className={styles.exampleSol}>{`Near Point (D = 25 cm): `}<span className={styles.highlight}>Closest distance for clear vision</span>{`
→ Ciliary muscles contract maximally → lens becomes most curved (shortest f)
→ Also called "Least Distance of Distinct Vision"

Far Point (∞ = infinity): `}<span className={styles.highlight}>Farthest distance for clear vision</span>{`
→ Ciliary muscles fully relaxed → lens becomes flattest (longest f)

Power of accommodation = Power(near) − Power(far)
At near: f_min → P_max | At far: f_max → P_min

A young person can accommodate: roughly +4 to +6 D range`}
                  <span className={styles.answer}>∴ Normal eye: near point 25 cm, far point ∞ | Accommodates by changing lens curvature using ciliary muscles</span>
                </div>
              </div>

              <div className={styles.exampleCard}>
                <div className={styles.exampleBadge}>Example 2 — Myopia Correction Calculation</div>
                <p className={styles.exampleQ}>A myopic person's far point is 80 cm. What power lens is required to correct this defect? (The corrected lens should make distant objects appear at 80 cm)</p>
                <div className={styles.exampleSol}>{`Given: Far point of person = 80 cm
The corrective lens must form virtual image of distant object (u = ∞) at far point (v = −80 cm)

Using Lens Formula: 1/f = 1/v − 1/u = 1/(−80) − 1/(∞) = −1/80 − 0

f = `}<span className={styles.highlight}>−80 cm = −0.80 m</span>{`

P = 1/f = 1/(−0.80) = `}<span className={styles.highlight}>−1.25 D</span>
                  <span className={styles.answer}>∴ Concave lens of power −1.25 D needed | This makes ∞ → appear at 80 cm (the far point)</span>
                </div>
              </div>

              <div className={styles.exampleCard}>
                <div className={styles.exampleBadge}>Example 3 — Hypermetropia Correction</div>
                <p className={styles.exampleQ}>A hypermetropic person's near point is 100 cm. What power convex lens corrects this to normal near point of 25 cm?</p>
                <div className={styles.exampleSol}>{`The corrective lens must form virtual image of object at 25 cm → at the person's near point (100 cm)

Given: u = −25 cm, v = −100 cm (both virtual image and object on same side)

1/f = 1/v − 1/u = 1/(−100) − 1/(−25) = −1/100 + 1/25 = (−1 + 4)/100 = 3/100

f = `}<span className={styles.highlight}>100/3 ≈ +33.3 cm</span>{`

P = 1/f = 3/100 × 100 = `}<span className={styles.highlight}>+3.0 D</span>
                  <span className={styles.answer}>∴ Convex lens of P = +3.0 D | Makes objects at 25 cm appear to be at 100 cm (near point) ✓</span>
                </div>
              </div>
            </div>

            {/* ★ SIMULATION 5 — Eye Accommodation (lazy-loaded) */}
            <LazyMount><EyeAccommodationSim /></LazyMount>

            <div className={styles.formulaBox}>
              <h3>👁 Power of Accommodation</h3>
              <span className={styles.mathEquation}>Near Point = 25 cm</span>
              <p>
                The <strong>near point</strong> (closest distance for clear vision) for a normal eye = 25 cm (also called Least Distance of Distinct Vision D).<br />
                The <strong>far point</strong> for a normal eye = infinity (can see very distant objects).
              </p>
            </div>
          </section>

          {/* EYE DEFECTS */}
          <section className={styles.contentSection} id="defects">
            <h2>🔴 Defects of Vision</h2>
            <p>
              When the eye cannot correctly focus light on the retina, defects of vision occur.
              The three common defects are Myopia, Hypermetropia, and Presbyopia.
            </p>

            {/* Defect comparison table */}
            <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(244,63,94,0.08)', borderBottom: '1px solid rgba(244,63,94,0.2)' }}>
                    {['Defect', 'Also Called', 'Cannot See', 'Image Position', 'Cause', 'Correction (Lens)', 'Power'].map(h => (
                      <th key={h} style={{ padding: '0.65rem 0.75rem', textAlign: 'left', color: '#f43f5e', fontWeight: 700, fontSize: '0.78rem' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Myopia', 'Short-sight', 'Distant objects', 'In front of retina', 'Long eyeball / curved cornea', 'Concave (Diverging)', '−ve (e.g. −2.5 D)'],
                    ['Hypermetropia', 'Long-sight', 'Near objects', 'Behind retina', 'Short eyeball / flat cornea', 'Convex (Converging)', '+ve (e.g. +1.5 D)'],
                    ['Presbyopia', 'Old-age sight', 'Near + Far', 'Varies', 'Ciliary muscles weaken with age', 'Bifocal lens', '+ and −'],
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
                      {row.map((cell, j) => (
                        <td key={j} style={{ padding: '0.6rem 0.75rem', color: j === 0 ? '#f4f4f5' : j === 5 ? (cell.includes('Concave') ? '#60a5fa' : cell.includes('Convex') ? '#34d399' : '#fbbf24') : '#a1a1aa', fontWeight: j === 0 ? 700 : 400 }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.grid2}>
              <div className={styles.glassPanel} style={{ borderColor: 'rgba(244,63,94,0.3)' }}>
                <strong style={{ color: '#f43f5e' }}>🔴 Myopia (Short-sightedness)</strong><br /><br />
                Cannot see <em>distant</em> objects clearly. Distant objects look blurred.<br />
                <strong>Cause:</strong> Eyeball too long OR cornea too curved → focal length too short<br />
                <strong>Result:</strong> Image forms IN FRONT of retina instead of ON it<br />
                <strong>Correction:</strong> Concave lens (power = −ve, e.g., −2.5 D)<br />
                <strong>Why concave?</strong> It diverges parallel rays, pushing the focal point back to the retina<br /><br />
                <strong style={{ color: '#71717a', fontSize: '0.82rem' }}>
                  Formula: P = 1/f where f = −(far point distance in metres)
                </strong>
              </div>
              <div className={styles.glassPanel} style={{ borderColor: 'rgba(245,158,11,0.3)' }}>
                <strong style={{ color: '#f59e0b' }}>🟡 Hypermetropia (Long-sightedness)</strong><br /><br />
                Cannot see <em>near</em> objects clearly. Near objects look blurred.<br />
                <strong>Cause:</strong> Eyeball too short OR cornea too flat → focal length too long<br />
                <strong>Result:</strong> Image forms BEHIND retina instead of ON it<br />
                <strong>Correction:</strong> Convex lens (power = +ve, e.g., +1.5 D)<br />
                <strong>Why convex?</strong> It converges light before it reaches the eye, bringing focal point forward<br /><br />
                <strong style={{ color: '#71717a', fontSize: '0.82rem' }}>
                  Formula: P = 1/f where object should form image at near point (−25 cm)
                </strong>
              </div>
            </div>

            <div className={styles.glassPanel} style={{ marginTop: '1rem', borderColor: 'rgba(161,161,170,0.25)' }}>
              <strong style={{ color: '#a1a1aa' }}>🟤 Presbyopia (Age-related)</strong><br />
              The ciliary muscles weaken with age (usually after 40–45 years). The crystalline lens becomes rigid
              and loses its power of accommodation. Cannot see clearly at BOTH near and far distances.<br />
              <strong>Correction:</strong> Bifocal lenses — upper half = concave (for far vision), lower half = convex (for near reading).
              Today, progressive lenses (variable focal length) are preferred over bifocal.
            </div>

            {/* ★ SOLVED EXAMPLES — Eye Defects (before simulation) */}
            <div className={styles.solvedExamples}>
              <h3 className={styles.solvedExamplesTitle}>📝 Solved Examples — Eye Defects & Corrections</h3>

              <div className={styles.exampleCard}>
                <div className={styles.exampleBadge}>Example 1 — Identify Defect from Power</div>
                <p className={styles.exampleQ}>A student wears spectacles of power −3.5 D. (a) What defect does the student have? (b) What is the far point? (c) What type of lens corrects it?</p>
                <div className={styles.exampleSol}>{`Given: P = −3.5 D (negative power)

(a) Negative power → `}<span className={styles.highlight}>Concave lens → Myopia (near-sightedness)</span>{`

(b) Far point: f = 1/P = 1/(−3.5) = −0.286 m = `}<span className={styles.highlight}>−28.6 cm</span>{`
   Far point = 28.6 cm (the lens creates virtual image at 28.6 cm from eye for distant objects)

(c) Correction: `}<span className={styles.highlight}>Concave (diverging) lens of −3.5 D</span>
                  <span className={styles.answer}>∴ Myopia | Far point = 28.6 cm | Correction = −3.5 D concave lens</span>
                </div>
              </div>

              <div className={styles.exampleCard}>
                <div className={styles.exampleBadge}>Example 2 — Presbyopia vs Myopia</div>
                <p className={styles.exampleQ}>An elderly person can see clearly between 50 cm and 2 m only. What combination of lenses is needed for full correction?</p>
                <div className={styles.exampleSol}>{`Analysis: Person cannot see beyond 2 m (Myopia) AND cannot see closer than 50 cm (Hypermetropia)
This is `}<span className={styles.highlight}>Presbyopia</span>{` (age-related both defects)

For distance vision (myopia correction, far point = 2 m = 200 cm):
P_dist = −100/200 = `}<span className={styles.highlight}>−0.5 D</span>{`  (top half of bifocal)

For near vision (hypermetropia, near point = 50 cm, need 25 cm):
1/f = 1/(−50) − 1/(−25) = −1/50 + 1/25 = 1/50
P_near = `}<span className={styles.highlight}>+2.0 D</span>{`  (bottom half of bifocal)`}
                  <span className={styles.answer}>∴ Bifocal: Top = −0.5 D (myopia), Bottom = +2.0 D (hypermetropia) | Or progressive lenses today</span>
                </div>
              </div>

              <div className={styles.exampleCard}>
                <div className={styles.exampleBadge}>Example 3 — Visual Angle & Magnification</div>
                <p className={styles.exampleQ}>A simple microscope (magnifying glass) has f = 5 cm. A person with normal near point (25 cm) uses it. Find the maximum magnification.</p>
                <div className={styles.exampleSol}>{`Maximum magnification of simple microscope:
M = 1 + D/f   (when image at near point, D = near point distance)

M = 1 + 25/5 = 1 + 5 = `}<span className={styles.highlight}>6×</span>{`

Minimum magnification (image at infinity):
M = D/f = 25/5 = `}<span className={styles.highlight}>5×</span>
                  <span className={styles.answer}>∴ Magnifying power ranges from 5× to 6× | Object must be placed between F and lens</span>
                </div>
              </div>
            </div>

            {/* ★ SIMULATION 3 — Eye Defects (lazy-loaded) */}
            <LazyMount><EyeDefectsSim /></LazyMount>
          </section>

          {/* OPTICAL INSTRUMENTS */}
          <section className={styles.contentSection} id="instruments">
            <h2>🔬 Optical Instruments</h2>
            <div style={{ display: 'grid', gap: '0.85rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              {[
                { title: '🔍 Magnifying Glass', desc: 'Convex lens; object between F and O → virtual, erect, magnified. M ≈ D/f where D = 25 cm', power: '+' },
                { title: '🔬 Compound Microscope', desc: 'Two convex lenses: objective (short f) + eyepiece. Object just beyond F of objective → real, magnified intermediate image → further magnified by eyepiece', power: '+' },
                { title: '🔭 Astronomical Telescope', desc: 'Two convex lenses: objective (long f, large aperture) + eyepiece (short f). Collects faint light from stars', power: '+' },
                { title: '📸 Camera', desc: 'Convex lens forms real, inverted, diminished image on film/sensor. Object beyond 2F of lens', power: '+' },
                { title: '📽 Projector', desc: 'Convex lens; object between F and 2F → real, inverted, magnified image on screen. Object and screen on opposite sides', power: '+' },
                { title: '👓 Spectacles', desc: 'Concave lens for myopia (−D), convex for hypermetropia (+D), bifocal for presbyopia', power: '±' },
              ].map((inst, i) => (
                <div key={i} style={{
                  padding: '1rem', borderRadius: '10px',
                  background: 'rgba(0,255,204,0.03)', border: '1px solid rgba(0,255,204,0.12)',
                }}>
                  <div style={{ fontWeight: 700, color: '#00ffcc', marginBottom: '0.3rem', fontSize: '0.9rem' }}>{inst.title}</div>
                  <div style={{ fontSize: '0.84rem', color: '#a1a1aa', lineHeight: 1.55 }}>{inst.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* NUMERICALS */}
          <section className={styles.contentSection} id="numericals">
            <h2>🔢 Solved Numericals</h2>
            {[
              { title: 'Numerical 1 — Lens Image Position',
                prob: 'An object is placed 30 cm in front of a convex lens of focal length 20 cm. Find image distance and magnification.',
                steps: ['u = −30 cm, f = +20 cm (convex)', '1/v − 1/u = 1/f → 1/v = 1/f + 1/u = 1/20 + 1/(−30)', '1/v = 3/60 − 2/60 = 1/60 → v = +60 cm', 'Image is real (positive v), on other side of lens', 'm = v/u = 60/(−30) = −2 (real, inverted, magnified ×2)'] },
              { title: 'Numerical 2 — Power of Lens',
                prob: 'A spectacle lens has power −2.5 D. Find its focal length. What kind of lens is this and which defect does it correct?',
                steps: ['P = −2.5 D', 'f = 1/P = 1/(−2.5) = −0.4 m = −40 cm', 'Negative focal length → Concave (diverging) lens', 'Used to correct Myopia (short-sightedness)', 'Person cannot see objects farther than 40 cm clearly without this lens'] },
              { title: 'Numerical 3 — Combined Power',
                prob: 'Two thin lenses of focal length +30 cm and −10 cm are placed in contact. Find the combined power and focal length.',
                steps: ['P₁ = 1/f₁ = 1/0.30 = +3.33 D', 'P₂ = 1/f₂ = 1/(−0.10) = −10 D', 'P_total = P₁ + P₂ = 3.33 + (−10) = −6.67 D', 'f_total = 1/P_total = 1/(−6.67) = −0.15 m = −15 cm', 'Combined system acts as a concave lens of focal length −15 cm'] },
              { title: 'Numerical 4 — Magnifying Power',
                prob: 'A magnifying glass has focal length 5 cm. Calculate its magnifying power when image is at near point (D = 25 cm).',
                steps: ['Magnifying power = D/f + 1 = 25/5 + 1 = 5 + 1 = 6', 'The magnifying glass gives 6× magnification at near point', 'For image at infinity: M = D/f = 25/5 = 5×', 'Shorter focal length → higher magnifying power'] },
              { title: 'Numerical 5 — Defect of Vision',
                prob: 'A myopic person can see objects clearly only up to 2 m. What power lens is needed for normal vision?',
                steps: ['Near-sighted person: far point = 2 m', 'Need: objects at ∞ should appear to come from 2 m', 'Using lens formula: u = −∞, v = −2 m (virtual image)', '1/f = 1/v − 1/u = 1/(−2) − 1/(−∞) = −0.5 − 0 = −0.5', 'f = −2 m, P = 1/f = 1/(−2) = −0.5 D (concave lens)'] },
              { title: 'Numerical 6 — Virtual Object (Lens Formula)',
                prob: 'A concave lens of focal length 15 cm forms a virtual image at 10 cm from the lens on the same side as the object. Find object distance.',
                steps: ['f = −15 cm (concave), v = −10 cm (virtual image, same side)', 'Using 1/v − 1/u = 1/f:', '1/(−10) − 1/u = 1/(−15)', '−1/u = −1/15 + 1/10 = (−2 + 3)/30 = 1/30', 'u = −30 cm', 'Object is 30 cm in front of the lens'] },
            ].map((num, i) => (
              <div key={i} className={styles.numericalBox}>
                <div className={styles.numericalTitle}>📝 {num.title}</div>
                <p style={{ color: '#a1a1aa', marginBottom: '0.75rem', fontSize: '0.94rem' }}>
                  <strong>Problem:</strong> {num.prob}
                </p>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.65rem' }}>
                  <strong style={{ color: '#00ffcc', fontSize: '0.82rem', letterSpacing: '0.04em' }}>SOLUTION:</strong>
                  {num.steps.map((s, j) => (
                    <p key={j} className={styles.numericalStep}>{j + 1}. {s}</p>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* MCQ QUIZ */}
          <section className={styles.contentSection} id="quiz">
            <h2>🎯 MCQ Practice Quiz</h2>
            <div className={styles.mcqContainer}>
              <div className={styles.scoreBoard}>
                Score: {Object.keys(mcqDone).filter(k => mcqAns[+k] === mcqs[+k].ans).length} / {Object.keys(mcqDone).length} answered
              </div>
              {mcqs.map((mcq, qi) => (
                <div key={qi} style={{ marginBottom: '2rem' }}>
                  <p style={{ color: '#f4f4f5', fontWeight: 600, marginBottom: '0.7rem', fontSize: '0.97rem' }}>
                    Q{qi + 1}. {mcq.q}
                  </p>
                  {mcq.opts.map((opt, oi) => {
                    const sel = mcqAns[qi] === oi;
                    const done = !!mcqDone[qi];
                    const correct = oi === mcq.ans;
                    let cls = styles.mcqOption;
                    if (done) cls += correct ? ` ${styles.correct}` : sel ? ` ${styles.incorrect}` : '';
                    else if (sel) cls += ` ${styles.selected}`;
                    return (
                      <button key={oi} className={cls} disabled={done}
                        onClick={() => setMcqAns(a => ({ ...a, [qi]: oi }))}>
                        {['A', 'B', 'C', 'D'][oi]}. {opt}
                      </button>
                    );
                  })}
                  {mcqAns[qi] !== undefined && !mcqDone[qi] && (
                    <button className={styles.simButton} style={{ marginTop: '0.5rem' }}
                      onClick={() => setMcqDone(d => ({ ...d, [qi]: true }))}>Submit Answer</button>
                  )}
                  {mcqDone[qi] && (
                    <div className={styles.glassPanel} style={{ marginTop: '0.5rem', padding: '0.75rem 1rem', borderColor: mcqAns[qi] === mcq.ans ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)' }}>
                      {mcqAns[qi] === mcq.ans ? '✅ Correct!' : '❌ Incorrect!'} {mcq.exp}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* FLASHCARDS */}
          <section className={styles.contentSection} id="flashcards">
            <h2>🃏 Quick Revision Flashcards</h2>
            <p style={{ color: '#71717a', fontSize: '0.88rem', marginBottom: '1.25rem' }}>Tap any card to reveal the answer</p>
            <div className={styles.flashcardGrid}>
              {flashcards.map((card, i) => (
                <div key={i}
                  className={`${styles.flashcard} ${flipped[i] ? styles.flipped : ''}`}
                  onClick={() => setFlipped(f => ({ ...f, [i]: !f[i] }))}>
                  <div className={styles.flashcardInner}>
                    <div className={styles.flashcardFront}>
                      <div style={{ textAlign: 'center', width: '100%' }}>
                        <div style={{ fontSize: '0.6rem', color: '#00ffcc66', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>QUESTION</div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f0fffe', lineHeight: 1.4 }}>{card.q}</div>
                        <div style={{ fontSize: '0.6rem', color: '#00ffcc33', marginTop: '0.7rem' }}>↺ tap to reveal</div>
                      </div>
                    </div>
                    <div className={styles.flashcardBack}>
                      <div style={{ textAlign: 'center', width: '100%' }}>
                        <div style={{ fontSize: '0.6rem', color: '#a78bfa', marginBottom: '0.4rem', letterSpacing: '0.1em', fontWeight: 700 }}>ANSWER</div>
                        <div style={{ fontSize: '0.84rem', color: '#ede9fe', lineHeight: 1.65, whiteSpace: 'pre-line' }}>{card.a}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* NAV */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
            {[
              { href: '/class-10/light-reflection-and-refraction/reflection', label: '← Reflection', col: '#3b82f6' },
              { href: '/class-10/light-reflection-and-refraction/refraction', label: '← Refraction', col: '#f59e0b' },
              { href: '/class-10/light-reflection-and-refraction/summary', label: '→ Chapter Summary', col: '#7c3aed' },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{
                padding: '0.75rem 1.5rem', borderRadius: '10px', textDecoration: 'none',
                background: `${l.col}12`, border: `1px solid ${l.col}30`,
                color: l.col, fontWeight: 700, fontSize: '0.9rem',
              }}>{l.label}</Link>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
