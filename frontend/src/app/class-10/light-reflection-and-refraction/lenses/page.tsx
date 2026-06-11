'use client';

/**
 * FILE: lenses/page.tsx
 * PURPOSE: Class 10 — Light: Spherical Lenses
 *   Topics: Types of Lenses, Image Formation, Lens Formula, Power, Human Eye,
 *           Defects of Vision (Myopia, Hypermetropia), Optical Instruments
 *   Features: 6 AI images, 3 animated SVG simulations, 6 numericals, 8 MCQ, 8 flashcards
 */

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Zap, Eye, BookOpen, RotateCcw, Lightbulb, Award, Target, Focus } from 'lucide-react';
import styles from '@/styles/LightChapter.module.css';

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
              <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontSize: '10px', color: '#71717a', lineHeight: 1.5, fontFamily: 'Inter' }}>
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
                  <Image src={img.src} alt={img.caption} width={400} height={200}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
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
                { src: '/images/light/light_convex_lens_numerical_nano_banana_1781204470042.png', caption: 'Convex lens image formation — rays refract through lens and converge' },
                { src: '/images/light/light_concave_lens_numerical_nano_banana_1781204487446.png', caption: 'Concave lens — always virtual, erect, diminished regardless of object position' },
              ].map((img, i) => (
                <div key={i} className={styles.imageCard}>
                  <Image src={img.src} alt={img.caption} width={400} height={200}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
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

            {/* ★ SIMULATION 1 — Lens Ray Tracer */}
            <LensRayTracerSim />
          </section>

          {/* LENS FORMULA */}
          <section className={styles.contentSection} id="formula">
            <h2>📐 Lens Formula & Magnification</h2>

            <div className={styles.imageGrid}>
              {[
                { src: '/images/light/light_lens_magnification_nano_banana_1781204503146.png', caption: 'Magnification by lens: m = v/u = h′/h' },
                { src: '/images/light/light_lens_power_1781203118675.png', caption: 'Power of lens: P = 1/f — unit Dioptre (D)' },
              ].map((img, i) => (
                <div key={i} className={styles.imageCard}>
                  <Image src={img.src} alt={img.caption} width={400} height={200}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
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

            {/* ★ SIMULATION 2 — Power Calculator */}
            <PowerOfLensSim />
          </section>

          {/* HUMAN EYE */}
          <section className={styles.contentSection} id="human-eye">
            <h2>👁️ The Human Eye</h2>
            <p>
              The human eye is a remarkable optical instrument that uses a convex lens (the crystalline lens) to form images
              on the retina. It can automatically adjust its focal length — a property called <strong style={{ color: '#00ffcc' }}>accommodation</strong>.
            </p>

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

            <div className={styles.grid2}>
              <div className={styles.glassPanel} style={{ borderColor: 'rgba(244,63,94,0.3)' }}>
                <strong>🔴 Myopia (Short-sightedness):</strong><br />
                Cannot see <em>distant</em> objects clearly.
                Image forms IN FRONT of retina.<br />
                <strong>Cause:</strong> Eyeball too long OR cornea too curved<br />
                <strong>Correction:</strong> Concave lens (negative power, e.g., −2.5 D)
              </div>
              <div className={styles.glassPanel} style={{ borderColor: 'rgba(245,158,11,0.3)' }}>
                <strong>🟡 Hypermetropia (Long-sightedness):</strong><br />
                Cannot see <em>near</em> objects clearly.
                Image forms BEHIND retina.<br />
                <strong>Cause:</strong> Eyeball too short OR cornea too flat<br />
                <strong>Correction:</strong> Convex lens (positive power, e.g., +1.5 D)
              </div>
            </div>

            <div className={styles.glassPanel} style={{ marginTop: '1rem' }}>
              <strong>🟤 Presbyopia:</strong> Age-related loss of accommodation. The ciliary muscles weaken with age.
              Cannot see clearly at near OR far distance. Corrected using <strong>bifocal lenses</strong>
              (upper half = concave for far; lower half = convex for near).
              Most people develop this after age 40–45.
            </div>

            {/* ★ SIMULATION 3 — Eye Defects */}
            <EyeDefectsSim />
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
