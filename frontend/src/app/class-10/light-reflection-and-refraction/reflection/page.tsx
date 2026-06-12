'use client';

/**
 * FILE: reflection/page.tsx
 * PURPOSE: Class 10 — Light: Reflection
 *   Topics: Nature of Light, Laws of Reflection, Plane Mirror, Spherical Mirrors,
 *           Mirror Formula, Magnification, Real-Life Applications
 *   Features: 10 AI images, 4 animated SVG simulations, 6 numericals, 8 MCQ, 8 flashcards
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Zap, Eye, BookOpen, RotateCcw, Lightbulb, Award, Target, Sun, Camera } from 'lucide-react';
import styles from '@/styles/LightChapter.module.css';

/* ═══════════════════════════════════════════════════════════
   SIMULATION 1 — Laws of Reflection Interactive Ray Tracer
   Drag the angle slider; animated photon travels along rays
═══════════════════════════════════════════════════════════ */
function LawsOfReflectionSim() {
  const [angle, setAngle] = useState(45);
  const [photonT, setPhotonT] = useState(0);
  const [running, setRunning] = useState(false);
  const [reflType, setReflType] = useState<'regular' | 'diffuse'>('regular');

  const rad = (angle * Math.PI) / 180;
  const cx = 300; const cy = 248;
  const len = 172;

  /* Ray endpoints */
  const iX = cx - len * Math.sin(rad);
  const iY = cy - len * Math.cos(rad);
  const rX = cx + len * Math.sin(rad);
  const rY = cy - len * Math.cos(rad);

  /* Arc radius and endpoints */
  const ar = 54;
  const aiX = cx - ar * Math.sin(rad);
  const aiY = cy - ar * Math.cos(rad);
  const arXp = cx + ar * Math.sin(rad);
  const arYp = cy - ar * Math.cos(rad);

  /* Photon travels: incident ray → reflected ray */
  const pX = photonT <= 0.5
    ? iX + (cx - iX) * (photonT * 2)
    : cx + (rX - cx) * ((photonT - 0.5) * 2);
  const pY = photonT <= 0.5
    ? iY + (cy - iY) * (photonT * 2)
    : cy + (rY - cy) * ((photonT - 0.5) * 2);

  useEffect(() => {
    if (!running) return;
    let startTs = 0;
    const dur = 1900;
    const tick = (ts: number) => {
      if (!startTs) startTs = ts;
      const t = Math.min((ts - startTs) / dur, 1);
      setPhotonT(t);
      if (t < 1) requestAnimationFrame(tick);
      else { setRunning(false); setPhotonT(0); }
    };
    requestAnimationFrame(tick);
  }, [running]);

  return (
    <div className={styles.simulationContainer}>
      <div className={styles.simulationLabel}>⚡ Laws of Reflection — Animated Ray Tracer</div>

      {/* Toggle regular vs diffuse */}
      <div className={styles.simControls} style={{ marginBottom: '0.75rem', marginTop: 0 }}>
        {(['regular', 'diffuse'] as const).map(t => (
          <button key={t} className={`${styles.simButton} ${reflType === t ? styles.active : ''}`}
            onClick={() => setReflType(t)}>
            {t === 'regular' ? '🪞 Regular (Specular)' : '🧱 Diffuse (Irregular)'}
          </button>
        ))}
      </div>

      <svg width="100%" viewBox="0 0 600 300" style={{ display: 'block', maxWidth: '600px', margin: '0 auto' }}>
        <defs>
          <pattern id="refgrid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M28 0L0 0 0 28" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.7" />
          </pattern>
        </defs>
        <rect width="600" height="300" fill="url(#refgrid)" />

        {/* Mirror surface */}
        {reflType === 'regular' ? (
          <>
            <line x1="30" y1="255" x2="570" y2="255" stroke="#94a3b8" strokeWidth="3" />
            {Array.from({ length: 19 }).map((_, i) => (
              <line key={i} x1={30 + i * 28} y1="255" x2={20 + i * 28} y2="272" stroke="#475569" strokeWidth="1.5" />
            ))}
          </>
        ) : (
          <>
            <polyline stroke="#94a3b8" strokeWidth="2" fill="none"
              points={Array.from({ length: 25 }).map((_, i) =>
                `${24 + i * 22},${252 + Math.round(Math.sin(i * 1.9) * 7)}`).join(' ')} />
            {[-60, -30, 0, 30, 60].map((d, i) => (
              <line key={i} x1={cx} y1={cy} x2={cx + d * 2.5} y2={80 + i * 8}
                stroke="#00ffcc" strokeWidth="1.8" opacity="0.45"
                style={{ filter: 'drop-shadow(0 0 3px #00ffcc)' }} />
            ))}
          </>
        )}

        {reflType === 'regular' && (
          <>
            {/* Normal (dashed vertical) */}
            <line x1={cx} y1="22" x2={cx} y2="255" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeDasharray="7 5" />
            <text x={cx + 9} y="31" fill="rgba(255,255,255,0.4)" fontSize="10.5" fontFamily="Inter" letterSpacing="1">NORMAL</text>

            {/* Incident ray */}
            <line x1={iX} y1={iY} x2={cx} y2={cy} stroke="#fbbf24" strokeWidth="2.8"
              style={{ filter: 'drop-shadow(0 0 6px #fbbf2480)' }} />
            {/* Arrowhead toward mirror */}
            <polygon fill="#fbbf24"
              points={`${cx - 10 * Math.sin(rad)},${cy - 10 * Math.cos(rad)} ${cx - 18 * Math.sin(rad) + 7 * Math.cos(rad)},${cy - 18 * Math.cos(rad) - 7 * Math.sin(rad)} ${cx - 18 * Math.sin(rad) - 7 * Math.cos(rad)},${cy - 18 * Math.cos(rad) + 7 * Math.sin(rad)}`} />

            {/* Reflected ray */}
            <line x1={cx} y1={cy} x2={rX} y2={rY} stroke="#00ffcc" strokeWidth="2.8"
              style={{ filter: 'drop-shadow(0 0 6px #00ffcc80)' }} />
            {/* Arrowhead away from mirror */}
            <polygon fill="#00ffcc"
              points={`${rX},${rY} ${rX - 18 * Math.sin(rad) - 7 * Math.cos(rad)},${rY + 18 * Math.cos(rad) - 7 * Math.sin(rad)} ${rX - 18 * Math.sin(rad) + 7 * Math.cos(rad)},${rY + 18 * Math.cos(rad) + 7 * Math.sin(rad)}`} />

            {/* Angle i arc */}
            <path d={`M ${cx} ${cy - ar} A ${ar} ${ar} 0 0 0 ${aiX} ${aiY}`}
              fill="none" stroke="#fbbf24" strokeWidth="1.8" opacity="0.8" />
            <text x={cx - ar * Math.sin(rad / 2) * 1.7} y={cy - ar * Math.cos(rad / 2) * 1.6}
              fill="#fbbf24" fontSize="13" fontFamily="'JetBrains Mono',monospace" textAnchor="middle" fontWeight="700">
              ∠i={angle}°
            </text>

            {/* Angle r arc */}
            <path d={`M ${arXp} ${arYp} A ${ar} ${ar} 0 0 0 ${cx} ${cy - ar}`}
              fill="none" stroke="#00ffcc" strokeWidth="1.8" opacity="0.8" />
            <text x={cx + ar * Math.sin(rad / 2) * 1.7} y={cy - ar * Math.cos(rad / 2) * 1.6}
              fill="#00ffcc" fontSize="13" fontFamily="'JetBrains Mono',monospace" textAnchor="middle" fontWeight="700">
              ∠r={angle}°
            </text>

            {/* Labels */}
            <text x={iX + 10} y={iY + 16} fill="#fbbf2488" fontSize="11" fontFamily="Inter">Incident ray</text>
            <text x={rX - 90} y={rY + 16} fill="#00ffcc88" fontSize="11" fontFamily="Inter">Reflected ray</text>

            {/* Animated photon */}
            {running && (
              <circle cx={pX} cy={pY} r="6" fill="#fff"
                style={{ filter: 'drop-shadow(0 0 12px #fff) drop-shadow(0 0 6px #fbbf24)' }} />
            )}

            {/* Incidence point */}
            <circle cx={cx} cy={cy} r="4.5" fill="#fff" opacity="0.9" />

            {/* Formula footer */}
            <text x="300" y="291" fill="rgba(255,255,255,0.3)" fontSize="10.5"
              textAnchor="middle" fontFamily="'JetBrains Mono',monospace">
              Law 1: ∠i = ∠r = {angle}°  |  Law 2: Coplanar (same plane)
            </text>
          </>
        )}

        {reflType === 'diffuse' && (
          <>
            <line x1="240" y1="80" x2={cx} y2={cy} stroke="#fbbf24" strokeWidth="2.5"
              style={{ filter: 'drop-shadow(0 0 5px #fbbf24)' }} />
            <text x="218" y="73" fill="#fbbf24" fontSize="11" fontFamily="Inter">Incident ray</text>
            <text x="300" y="40" fill="#a1a1aa" fontSize="13" textAnchor="middle" fontFamily="Inter" fontWeight="600">
              Diffuse Reflection — scattered in all directions
            </text>
            <text x="300" y="58" fill="#71717a" fontSize="10.5" textAnchor="middle" fontFamily="Inter">
              Each point on rough surface has different normal → rays scatter
            </text>
            <text x="300" y="291" fill="rgba(255,255,255,0.3)" fontSize="10.5"
              textAnchor="middle" fontFamily="'JetBrains Mono',monospace">
              Example: paper, walls, chalk — we can see them from any angle!
            </text>
          </>
        )}
      </svg>

      {reflType === 'regular' && (
        <div className={styles.simControls}>
          <label style={{ color: '#a1a1aa', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, flexWrap: 'wrap' }}>
            Angle of incidence:
            <strong style={{ color: '#fbbf24', fontFamily: 'JetBrains Mono', minWidth: '40px' }}>{angle}°</strong>
            <input type="range" min="10" max="80" value={angle}
              onChange={e => { setAngle(+e.target.value); setRunning(false); setPhotonT(0); }}
              className={styles.simSlider} style={{ flex: 1, minWidth: '100px' }} />
          </label>
          <button className={styles.simButton} onClick={() => { setPhotonT(0); setRunning(true); }}>▶ Shoot Photon</button>
          <button className={styles.simButton} onClick={() => { setAngle(45); setRunning(false); setPhotonT(0); }}>↺ Reset</button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SIMULATION 2 — Concave Mirror Image Formation (All 5 Cases)
═══════════════════════════════════════════════════════════ */
function ConcaveMirrorSim() {
  const [caseIdx, setCaseIdx] = useState(0);

  /* Pre-computed cases — coordinates for 570×360 SVG */
  /* P=(476,195), F=(346,195), C=(216,195), axis y=195 */
  const AY = 195; /* axis Y */
  const cases = [
    {
      label: 'Beyond C', objX: 85, objY: AY - 75,
      imgX: 282, imgY: AY + 40, imgReal: true, imgErect: false, imgSize: 'Diminished',
      desc: 'Image: Real, Inverted, Diminished — between F and C',
      r1: { x1: 85, y1: AY - 75, xm: 476, ym: AY - 75, xe: 346, ye: AY, xf: 230, yf: AY + 55 } as Record<string,number>,
      r2: { x1: 85, y1: AY - 75, xm: 476, ym: AY + 65, xe: 216, ye: AY, xf: 100, yf: AY - 60 } as Record<string,number>,
    },
    {
      label: 'At C', objX: 216, objY: AY - 75,
      imgX: 216, imgY: AY + 75, imgReal: true, imgErect: false, imgSize: 'Same size',
      desc: 'Image: Real, Inverted, Same size — at C',
      r1: { x1: 216, y1: AY - 75, xm: 476, ym: AY - 75, xe: 346, ye: AY, xf: 216, yf: AY + 75 } as Record<string,number>,
      r2: { x1: 216, y1: AY - 75, xm: 476, ym: AY + 75, xe: 216, ye: AY, xf: 60, yf: AY - 75 } as Record<string,number>,
    },
    {
      label: 'Between C & F', objX: 290, objY: AY - 75,
      imgX: 80, imgY: AY + 125, imgReal: true, imgErect: false, imgSize: 'Magnified',
      desc: 'Image: Real, Inverted, Magnified — beyond C',
      r1: { x1: 290, y1: AY - 75, xm: 476, ym: AY - 75, xe: 346, ye: AY, xf: 80, yf: AY + 355 } as Record<string,number>,
      r2: { x1: 290, y1: AY - 75, xm: 476, ym: AY + 85, xe: 216, ye: AY, xf: 70, yf: AY - 130 } as Record<string,number>,
    },
    {
      label: 'At F', objX: 346, objY: AY - 75,
      imgX: -1, imgY: 0, imgReal: false, imgErect: false, imgSize: 'At infinity',
      desc: 'Image: At Infinity — reflected rays are parallel',
      r1: { x1: 346, y1: AY - 75, xm: 476, ym: AY - 75, xe: 60, ye: AY - 75, xf: 60, yf: AY - 75 } as Record<string,number>,
      r2: { x1: 346, y1: AY - 75, xm: 476, ym: AY + 55, xe: 216, ye: AY, xf: 60, yf: AY - 75 } as Record<string,number>,
    },
    {
      label: 'Between F & P', objX: 420, objY: AY - 75,
      imgX: 555, imgY: AY - 145, imgReal: false, imgErect: true, imgSize: 'Magnified',
      desc: 'Image: Virtual, Erect, Magnified — behind mirror',
      r1: { x1: 420, y1: AY - 75, xm: 476, ym: AY - 75, xe: 346, ye: AY, xf: 220, yf: AY + 350 } as Record<string,number>,
      r2: { x1: 420, y1: AY - 75, xm: 476, ym: AY + 40, xe: 216, ye: AY, xf: 100, yf: AY - 90 } as Record<string,number>,
    },
  ];

  const c = cases[caseIdx];

  return (
    <div className={styles.simulationContainer}>
      <div className={styles.simulationLabel}>🪞 Concave Mirror — All 5 Image Formation Cases</div>

      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {cases.map((cs, i) => (
          <button key={i} onClick={() => setCaseIdx(i)} style={{
            padding: '0.35rem 0.7rem', fontSize: '0.78rem', borderRadius: '6px', cursor: 'pointer',
            background: i === caseIdx ? 'rgba(0,255,204,0.14)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${i === caseIdx ? '#00ffcc' : 'rgba(255,255,255,0.1)'}`,
            color: i === caseIdx ? '#00ffcc' : '#71717a', fontWeight: i === caseIdx ? 700 : 400, transition: 'all 0.2s',
          }}>{cs.label}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.svg key={caseIdx} width="100%" viewBox="0 0 570 360"
          style={{ display: 'block', maxWidth: '570px', margin: '0 auto' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>

          {/* Principal axis */}
          <line x1="20" y1={AY} x2="545" y2={AY} stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="4 3" />

          {/* Concave mirror arc */}
          <path d="M 476 100 Q 536 195 476 290" fill="none" stroke="#64748b" strokeWidth="4" strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 4px #475569)' }} />
          {[115, 143, 171, 199, 227, 255].map((y, i) => (
            <line key={i} x1="476" y1={y} x2="496" y2={y + 14} stroke="#374151" strokeWidth="1.5" />
          ))}

          {/* Key points: P, F, C */}
          {[
            { x: 476, y: AY, label: 'P', col: '#94a3b8' },
            { x: 346, y: AY, label: 'F', col: '#f59e0b' },
            { x: 216, y: AY, label: 'C', col: '#a78bfa' },
          ].map(({ x, y, label, col }) => (
            <g key={label}>
              <circle cx={x} cy={y} r="5" fill={col} style={{ filter: `drop-shadow(0 0 5px ${col})` }} />
              <text x={x} y={y - 12} fill={col} fontSize="12" textAnchor="middle" fontWeight="700" fontFamily="Inter">{label}</text>
            </g>
          ))}

          {/* Ray 1 */}
          <line x1={c.r1.x1} y1={c.r1.y1} x2={c.r1.xm} y2={c.r1.ym} stroke="#fbbf2488" strokeWidth="1.5" strokeDasharray="5 3" />
          <line x1={c.r1.xm} y1={c.r1.ym} x2={c.r1.xe} y2={c.r1.ye} stroke="#fbbf24" strokeWidth="2"
            style={{ filter: 'drop-shadow(0 0 4px #fbbf2466)' }} />
          <line x1={c.r1.xe} y1={c.r1.ye} x2={c.r1.xf} y2={c.r1.yf} stroke="#fbbf24" strokeWidth="1.8" opacity="0.75" />

          {/* Ray 2 */}
          <line x1={c.r2.x1} y1={c.r2.y1} x2={c.r2.xm} y2={c.r2.ym} stroke="#3b82f688" strokeWidth="1.5" strokeDasharray="5 3" />
          <line x1={c.r2.xm} y1={c.r2.ym} x2={c.r2.xe} y2={c.r2.ye} stroke="#3b82f6" strokeWidth="2"
            style={{ filter: 'drop-shadow(0 0 4px #3b82f666)' }} />
          <line x1={c.r2.xe} y1={c.r2.ye} x2={c.r2.xf} y2={c.r2.yf} stroke="#3b82f6" strokeWidth="1.8" opacity="0.75" />

          {/* Object arrow */}
          <line x1={c.objX} y1={AY} x2={c.objX} y2={c.objY} stroke="#ef4444" strokeWidth="2.5"
            style={{ filter: 'drop-shadow(0 0 5px #ef444460)' }} />
          <polygon fill="#ef4444"
            points={`${c.objX},${c.objY} ${c.objX - 7},${c.objY + 13} ${c.objX + 7},${c.objY + 13}`} />
          <text x={c.objX} y={c.objY - 9} fill="#ef444499" fontSize="11" textAnchor="middle" fontFamily="Inter">Object</text>

          {/* Image arrow (if not at infinity) */}
          {c.imgX > 0 && (
            <g opacity={c.imgReal ? 1 : 0.65}>
              <line x1={c.imgX} y1={AY} x2={c.imgX} y2={c.imgY} stroke={c.imgReal ? '#00ffcc' : '#a78bfa'} strokeWidth="2.5"
                strokeDasharray={c.imgReal ? 'none' : '5 3'}
                style={{ filter: `drop-shadow(0 0 5px ${c.imgReal ? '#00ffcc60' : '#a78bfa60'})` }} />
              <polygon fill={c.imgReal ? '#00ffcc' : '#a78bfa'}
                points={c.imgY > AY
                  ? `${c.imgX},${c.imgY} ${c.imgX - 7},${c.imgY - 13} ${c.imgX + 7},${c.imgY - 13}`
                  : `${c.imgX},${c.imgY} ${c.imgX - 7},${c.imgY + 13} ${c.imgX + 7},${c.imgY + 13}`} />
              <text x={c.imgX} y={c.imgY > AY ? c.imgY + 16 : c.imgY - 10} fill={c.imgReal ? '#00ffcc99' : '#a78bfa99'}
                fontSize="11" textAnchor="middle" fontFamily="Inter">Image</text>
            </g>
          )}

          {/* Infinity for case 4 */}
          {c.imgX <= 0 && (
            <text x="260" y="105" fill="#f59e0b" fontSize="30" textAnchor="middle" fontFamily="JetBrains Mono" fontWeight="700" opacity="0.7">∞</text>
          )}

          {/* Info panel */}
          <rect x="10" y="310" width="350" height="44" rx="8" fill="rgba(0,0,0,0.65)" />
          <text x="20" y="327" fill="#71717a" fontSize="10" fontFamily="Inter">{c.desc}</text>
          <text x="20" y="345" fill={c.imgReal ? '#00ffcc' : '#a78bfa'} fontSize="10.5" fontFamily="'JetBrains Mono',monospace" fontWeight="700">
            {c.imgX > 0
              ? `${c.imgErect ? 'Erect' : 'Inverted'} | ${c.imgReal ? 'Real' : 'Virtual'} | ${c.imgSize}`
              : 'Image at Infinity — rays emerge parallel'}
          </text>
        </motion.svg>
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SIMULATION 3 — Convex Mirror: Wide Field of View
═══════════════════════════════════════════════════════════ */
function ConvexMirrorSim() {
  const [numRays, setNumRays] = useState(5);
  const [showVirtual, setShowVirtual] = useState(true);
  const fX = 580; const fY = 195; /* virtual focal point behind mirror */
  const rays = Array.from({ length: numRays }).map((_, i) => {
    const y = 140 + i * (110 / Math.max(numRays - 1, 1));
    const dx = 468 - fX; const dy = y - fY;
    const l = Math.sqrt(dx * dx + dy * dy);
    return { y, ex: 468 + (dx / l) * 195, ey: y + (dy / l) * 195 };
  });

  return (
    <div className={styles.simulationContainer}>
      <div className={styles.simulationLabel}>🚗 Convex Mirror — Virtual, Erect, Diminished (Always)</div>
      <svg width="100%" viewBox="0 0 560 360" style={{ display: 'block', maxWidth: '560px', margin: '0 auto' }}>
        {/* Axis */}
        <line x1="10" y1={fY} x2="545" y2={fY} stroke="rgba(255,255,255,0.13)" strokeWidth="1" strokeDasharray="4 3" />
        {/* Convex mirror */}
        <path d="M 468 120 Q 420 195 468 270" fill="none" stroke="#64748b" strokeWidth="4" strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 5px #64748b)' }} />
        {[135, 160, 185, 210, 235, 258].map((y, i) => (
          <line key={i} x1="468" y1={y} x2="488" y2={y + 14} stroke="#374151" strokeWidth="1.5" />
        ))}
        {/* Virtual focus */}
        <circle cx={fX} cy={fY} r="6" fill="#f59e0b" opacity="0.6" />
        <text x={fX - 6} y={fY - 13} fill="#f59e0b" fontSize="10.5" textAnchor="middle" fontFamily="Inter" fontWeight="700">F (virtual)</text>
        {/* Incoming parallel rays */}
        {rays.map((r, i) => (
          <line key={`i${i}`} x1="40" y1={r.y} x2="468" y2={r.y} stroke="#fbbf24" strokeWidth="2"
            style={{ filter: 'drop-shadow(0 0 3px #fbbf2455)' }} />
        ))}
        {/* Diverged reflected rays */}
        {rays.map((r, i) => (
          <g key={`r${i}`}>
            <line x1="468" y1={r.y} x2={r.ex} y2={r.ey} stroke="#00ffcc" strokeWidth="2.2"
              style={{ filter: 'drop-shadow(0 0 3px #00ffcc55)' }} />
            {showVirtual && (
              <line x1="468" y1={r.y} x2={fX} y2={fY} stroke="#f59e0b" strokeWidth="1" strokeDasharray="5 4" opacity="0.45" />
            )}
          </g>
        ))}
        {/* Labels */}
        <text x="45" y="120" fill="#fbbf2499" fontSize="11.5" fontFamily="Inter" fontWeight="600">Parallel incident rays</text>
        <text x="45" y="290" fill="#00ffcc99" fontSize="11.5" fontFamily="Inter" fontWeight="600">Diverging reflected rays</text>
        {/* Info */}
        <rect x="10" y="310" width="300" height="44" rx="8" fill="rgba(0,0,0,0.65)" />
        <text x="20" y="327" fill="#a1a1aa" fontSize="10" fontFamily="Inter">All images: Virtual, Erect, Diminished</text>
        <text x="20" y="345" fill="#a78bfa" fontSize="10" fontFamily="Inter">Wide field of view → used in rear-view mirrors</text>
      </svg>
      <div className={styles.simControls}>
        <label style={{ color: '#a1a1aa', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Rays: <strong style={{ color: '#fbbf24' }}>{numRays}</strong>
          <input type="range" min="3" max="9" step="2" value={numRays}
            onChange={e => setNumRays(+e.target.value)} className={styles.simSlider} />
        </label>
        <button className={`${styles.simButton} ${showVirtual ? styles.active : ''}`}
          onClick={() => setShowVirtual(v => !v)}>
          {showVirtual ? '👁 Hide Virtual Rays' : '👁 Show Virtual Rays'}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SIMULATION 4 — Mirror Formula Live Calculator
   User inputs u and f; real-time v + m calculation with
   a mini animated ray diagram.
═══════════════════════════════════════════════════════════ */
function MirrorFormulaCalcSim() {
  const [u, setU] = useState(-30);
  const [f, setF] = useState(-15);

  /* Mirror formula: 1/v = 1/f - 1/u  (all negative for concave real) */
  const v = (u * f) / (u - f);
  const m = isFinite(v / u) ? -(v / u) : Infinity;
  const isReal = v < 0;
  const isErect = m > 0;
  const isInfinity = !isFinite(v) || Math.abs(v) > 9999;

  const nature = isInfinity
    ? 'Image at Infinity'
    : `${isReal ? 'Real' : 'Virtual'}, ${isErect ? 'Erect' : 'Inverted'}, ${
        Math.abs(m) > 1.05 ? 'Magnified' : Math.abs(m) < 0.95 ? 'Diminished' : 'Same Size'
      }`;

  const natColor = isInfinity ? '#f59e0b' : isReal ? '#00ffcc' : '#a78bfa';
  const isConcave = f < 0;

  /* SVG layout: pole at px=320, axis at ay=130, scale 2px/cm */
  const px = 320; const ay = 130; const sc = 2.2;
  const objH = 45;
  const objX = px + u * sc;   /* u negative → left of mirror */
  const fX   = px + f * sc;
  const c2X  = px + 2 * f * sc;
  const imgX = isInfinity ? px - 350 : px + v * sc;
  const imgH = isInfinity ? 0 : m * objH;

  return (
    <div className={styles.simulationContainer}>
      <div className={styles.simulationLabel}>🪞 Mirror Formula Live Calculator — 1/v + 1/u = 1/f</div>

      {/* Sliders */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <label style={{ fontSize: '0.82rem', color: '#a1a1aa', display: 'block', marginBottom: '0.35rem' }}>
            Object distance u = <strong style={{ color: '#ef4444' }}>{u} cm</strong>
          </label>
          <input type="range" min={-120} max={-1} value={u} step={1}
            onChange={e => setU(+e.target.value)}
            style={{ width: '100%', accentColor: '#ef4444' }} />
        </div>
        <div>
          <label style={{ fontSize: '0.82rem', color: '#a1a1aa', display: 'block', marginBottom: '0.35rem' }}>
            Focal length f = <strong style={{ color: '#00ffcc' }}>{f} cm</strong>
            &nbsp;<span style={{ color: '#555', fontSize: '0.72rem' }}>(−ve = concave, +ve = convex)</span>
          </label>
          <input type="range" min={-60} max={60} value={f} step={1}
            onChange={e => setF(+e.target.value === 0 ? -1 : +e.target.value)}
            style={{ width: '100%', accentColor: '#00ffcc' }} />
        </div>
      </div>

      {/* Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Image distance v', val: isInfinity ? '∞' : `${v.toFixed(1)} cm`, col: isReal ? '#00ffcc' : '#a78bfa' },
          { label: 'Magnification m', val: isInfinity ? '∞' : m.toFixed(2), col: Math.abs(m) > 1 ? '#f59e0b' : '#60a5fa' },
          { label: 'Image Nature', val: isInfinity ? 'At ∞' : (isReal ? 'Real' : 'Virtual'), col: natColor },
        ].map(r => (
          <div key={r.label} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '0.75rem', border: `1px solid ${r.col}30` }}>
            <div style={{ fontSize: '0.72rem', color: '#71717a', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{r.label}</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: r.col, fontFamily: 'JetBrains Mono, monospace' }}>{r.val}</div>
          </div>
        ))}
      </div>

      {/* Nature badge */}
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: natColor, background: `${natColor}15`, padding: '0.4rem 1rem', borderRadius: '20px', border: `1px solid ${natColor}40` }}>
          🪞 Image: {nature}
        </span>
      </div>

      {/* Mini ray diagram */}
      <svg width="100%" viewBox="0 0 560 260" style={{ display: 'block', maxWidth: '560px', margin: '0 auto', borderRadius: '10px', background: 'rgba(0,0,0,0.3)' }}>
        <defs>
          <pattern id="mirrorgrid" width="22" height="22" patternUnits="userSpaceOnUse">
            <path d="M22 0L0 0 0 22" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="560" height="260" fill="url(#mirrorgrid)" />

        {/* Principal axis */}
        <line x1="10" y1={ay} x2="550" y2={ay} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="5 3" />

        {/* Mirror surface (right side) */}
        <path
          d={isConcave
            ? `M ${px} ${ay-90} Q ${px+30} ${ay} ${px} ${ay+90}`
            : `M ${px} ${ay-90} Q ${px-30} ${ay} ${px} ${ay+90}`}
          fill="none" stroke={isConcave ? '#60a5fa' : '#f87171'} strokeWidth="4" strokeLinecap="round" />

        {/* Mirror fill */}
        <path
          d={isConcave
            ? `M ${px} ${ay-90} Q ${px+30} ${ay} ${px} ${ay+90} L ${px+8} ${ay+90} Q ${px+40} ${ay} ${px+8} ${ay-90} Z`
            : `M ${px} ${ay-90} Q ${px-30} ${ay} ${px} ${ay+90} L ${px-8} ${ay+90} Q ${px-40} ${ay} ${px-8} ${ay-90} Z`}
          fill={isConcave ? 'rgba(96,165,250,0.07)' : 'rgba(248,113,113,0.07)'} />

        {/* Pole P */}
        <circle cx={px} cy={ay} r="3.5" fill="#ffffff60" />
        <text x={px} y={ay+15} fill="#ffffff60" fontSize="10" textAnchor="middle" fontFamily="Inter">P</text>

        {/* Focal point F and 2F */}
        {fX > 10 && fX < 555 && (
          <>
            <circle cx={fX} cy={ay} r="4.5" fill="#f59e0b" style={{ filter: 'drop-shadow(0 0 4px #f59e0b)' }} />
            <text x={fX} y={ay-11} fill="#f59e0b" fontSize="10" textAnchor="middle" fontFamily="Inter" fontWeight="700">F</text>
          </>
        )}
        {c2X > 10 && c2X < 555 && (
          <>
            <circle cx={c2X} cy={ay} r="3.5" fill="#a78bfa80" />
            <text x={c2X} y={ay-11} fill="#a78bfa80" fontSize="10" textAnchor="middle" fontFamily="Inter">C</text>
          </>
        )}

        {/* Object arrow */}
        {objX > 10 && objX < px - 5 && (
          <g>
            <line x1={objX} y1={ay} x2={objX} y2={ay - objH} stroke="#ef4444" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 0 4px #ef444460)' }} />
            <polygon fill="#ef4444" points={`${objX},${ay-objH} ${objX-6},${ay-objH+11} ${objX+6},${ay-objH+11}`} />
            <text x={objX} y={ay-objH-8} fill="#ef444499" fontSize="10" textAnchor="middle" fontFamily="Inter">Object</text>
          </g>
        )}

        {/* Image (if real: left of mirror, if virtual: behind mirror = right) */}
        {!isInfinity && imgX > 10 && imgX < 555 && (
          <g opacity={isReal ? 1 : 0.75}>
            <line x1={imgX} y1={ay} x2={imgX} y2={ay + imgH}
              stroke={isReal ? '#00ffcc' : '#a78bfa'} strokeWidth="2.5"
              strokeDasharray={isReal ? 'none' : '6 3'}
              style={{ filter: `drop-shadow(0 0 4px ${isReal ? '#00ffcc60' : '#a78bfa60'})` }} />
            <polygon fill={isReal ? '#00ffcc' : '#a78bfa'}
              points={imgH > 0
                ? `${imgX},${ay+imgH} ${imgX-6},${ay+imgH-11} ${imgX+6},${ay+imgH-11}`
                : `${imgX},${ay+imgH} ${imgX-6},${ay+imgH+11} ${imgX+6},${ay+imgH+11}`} />
            <text x={imgX} y={imgH > 0 ? ay+imgH+14 : ay+imgH-9}
              fill={isReal ? '#00ffcc99' : '#a78bfa99'} fontSize="10" textAnchor="middle" fontFamily="Inter">
              {isReal ? 'Image (Real)' : 'Image (Virtual)'}
            </text>
          </g>
        )}
        {isInfinity && (
          <text x="50" y={ay - 30} fill="#f59e0b" fontSize="28" fontFamily="JetBrains Mono" fontWeight="700" opacity="0.6">∞</text>
        )}
        <text x="10" y="250" fill="#444" fontSize="9" fontFamily="Inter">Scale ≈ {(1/sc).toFixed(1)} cm/px | {isConcave ? 'Concave mirror' : 'Convex mirror'}</text>
      </svg>

      {/* Step-by-step working */}
      <div style={{ marginTop: '0.75rem', padding: '0.65rem 1rem', background: 'rgba(0,255,204,0.04)', borderRadius: '8px', border: '1px solid rgba(0,255,204,0.1)', fontSize: '0.83rem', color: '#71717a' }}>
        💡 <strong>Working:</strong> 1/v = 1/f − 1/u = 1/{f} − 1/{u} = {(1/f).toFixed(3)} − ({(1/u).toFixed(3)}) = {(1/f - 1/u).toFixed(3)}
        → v = <strong style={{ color: natColor }}>{isInfinity ? '∞' : v.toFixed(1)} cm</strong>
        &nbsp;|&nbsp; m = −v/u = <strong style={{ color: natColor }}>{isInfinity ? '∞' : m.toFixed(2)}</strong>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function ReflectionPage() {
  const [focusMode, setFocusMode] = useState(false);
  const [mcqAns, setMcqAns] = useState<Record<number, number>>({});
  const [mcqDone, setMcqDone] = useState<Record<number, boolean>>({});
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const mcqs = [
    { q: 'The angle of reflection is measured from the ___.',
      opts: ['Reflecting surface', 'Normal to the surface', 'Incident ray', 'Horizontal line'],
      ans: 1, exp: 'Both ∠i and ∠r are always measured from the NORMAL (perpendicular) to the reflecting surface — not from the surface itself.' },
    { q: 'A plane mirror produces which type of image?',
      opts: ['Real, inverted, same size', 'Virtual, erect, same size', 'Real, erect, magnified', 'Virtual, inverted, diminished'],
      ans: 1, exp: 'Plane mirror: image is Virtual (can\'t be projected), Erect (upright), Same size (m=1), and at same distance behind mirror.' },
    { q: 'Which mirror is used by dentists to see an enlarged image of teeth?',
      opts: ['Plane mirror', 'Convex mirror', 'Concave mirror', 'Parabolic mirror'],
      ans: 2, exp: 'Concave mirror with object between F and P gives virtual, erect, magnified image — exactly what a dentist needs!' },
    { q: 'If radius of curvature = 30 cm, the focal length is:',
      opts: ['60 cm', '15 cm', '30 cm', '10 cm'],
      ans: 1, exp: 'f = R/2 = 30/2 = 15 cm. The focal length is always half the radius of curvature.' },
    { q: 'An object is 30 cm from a concave mirror of f = 10 cm. Image distance = ?',
      opts: ['−15 cm', '−20 cm', '+15 cm', '−30 cm'],
      ans: 0, exp: '1/v + 1/u = 1/f → 1/v = 1/(−10) − 1/(−30) = −1/10 + 1/30 = −2/30 → v = −15 cm (real, in front).' },
    { q: 'Magnification by convex mirror is always:',
      opts: ['Greater than 1', 'Less than 1, positive', 'Equal to 1', 'Negative'],
      ans: 1, exp: 'Convex: m = −v/u. v is always positive (virtual); u is negative; so m is positive and less than 1 (diminished).' },
    { q: 'Object at infinity before a concave mirror → image forms at:',
      opts: ['Pole P', 'Centre C', 'Focus F', 'Between F and P'],
      ans: 2, exp: 'Parallel rays from infinity converge at F (focal point) after reflection from a concave mirror.' },
    { q: 'Which is NOT an application of concave mirrors?',
      opts: ['Solar cooker', 'Vehicle headlights', 'Rear-view mirror', 'Shaving mirror'],
      ans: 2, exp: 'Rear-view mirrors use CONVEX mirrors (wide field of view). Solar cooker, headlights, and shaving mirrors all use CONCAVE.' },
  ];

  const flashcards = [
    { q: 'State the Two Laws of Reflection', a: '1. ∠i = ∠r (angle of incidence = angle of reflection)\n2. Incident ray, normal, and reflected ray are coplanar (lie in the same plane)' },
    { q: 'What is lateral inversion? Give a real-life example.', a: 'Left-right reversal of image in a plane mirror.\nExample: AMBULANCE is written in mirror-reversed letters on the front of ambulances so drivers can read it correctly in their rear-view mirrors.' },
    { q: 'Write the Mirror Formula and define all terms', a: '1/f = 1/v + 1/u\n• f = focal length (P to F)\n• v = image distance (from P)\n• u = object distance (from P)\nAll distances follow New Cartesian Sign Convention' },
    { q: 'Magnification formula — what do signs tell us?', a: 'm = h′/h = −v/u\n• m > 0 → Virtual, Erect image\n• m < 0 → Real, Inverted image\n• |m| > 1 → Magnified; |m| < 1 → Diminished\n• |m| = 1 → Same size' },
    { q: 'Image formed when object is at Centre of Curvature (concave)?', a: 'Real, Inverted, Same size as object\nFormed at Centre of Curvature C\n(u = 2f → v = 2f)' },
    { q: 'Why are convex mirrors used as rear-view mirrors?', a: '3 reasons:\n1. Always gives virtual, erect, diminished image\n2. Much wider field of view than plane/concave mirror\n3. Driver sees more of road behind\n(Disadvantage: objects appear farther than they actually are)' },
    { q: 'New Cartesian Sign Convention for mirrors', a: '• All distances from Pole P\n• Along incident light direction → Positive (+)\n• Opposite to incident light → Negative (−)\n• Above principal axis → Positive\n• Below principal axis → Negative\n∴ Real object: u < 0; Concave: f < 0; Convex: f > 0' },
    { q: 'Difference: Regular vs Diffuse Reflection', a: 'Regular (Specular): Smooth surface. Parallel → parallel rays. Forms clear image. Example: mirror, calm water.\nDiffuse: Rough surface. Parallel rays scatter randomly. No clear image. Example: wall, paper, cloth. This is why we can see objects from any angle!' },
  ];

  return (
    <div className={styles.chapterContainer}>
      <div className={`${styles.chapterLayout} ${focusMode ? styles.focusModeActive : ''}`}>

        {/* ─────────── SIDEBAR ─────────── */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <Link href="/class-10/light-reflection-and-refraction" className={styles.backButton}>
              <ChevronLeft size={14} /> Light Chapter
            </Link>
            <h2>⚡ Reflection</h2>
          </div>
          <nav className={styles.sidebarNav}>
            {[
              { href: '#nature', icon: <Sun size={13} />, label: 'Nature of Light' },
              { href: '#laws', icon: <Zap size={13} />, label: 'Laws of Reflection' },
              { href: '#types', icon: <Eye size={13} />, label: 'Types of Reflection' },
              { href: '#plane', icon: <Camera size={13} />, label: 'Plane Mirror' },
              { href: '#spherical', icon: <Target size={13} />, label: 'Spherical Mirrors' },
              { href: '#formula', icon: <BookOpen size={13} />, label: 'Mirror Formula' },
              { href: '#applications', icon: <Lightbulb size={13} />, label: 'Applications' },
              { href: '#numericals', icon: <Award size={13} />, label: 'Solved Numericals' },
              { href: '#quiz', icon: <Target size={13} />, label: 'MCQ Quiz' },
              { href: '#flashcards', icon: <RotateCcw size={13} />, label: 'Flashcards' },
            ].map(item => (
              <a key={item.href} href={item.href} className={styles.navLink}>{item.icon} {item.label}</a>
            ))}
          </nav>
          <div style={{ marginTop: 'auto' }}>
            {[
              { href: '/class-10/light-reflection-and-refraction/refraction', label: '→ Refraction', col: '#f59e0b' },
              { href: '/class-10/light-reflection-and-refraction/lenses', label: '→ Lenses', col: '#10b981' },
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

        {/* ─────────── MAIN CONTENT ─────────── */}
        <main className={styles.mainContent}>

          {/* HERO */}
          <section className={styles.heroSection} id="nature">
            <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', height: '260px' }}>
              <Image src="/images/light/hero-reflection.png" alt="Light Reflecting off a Mirror"
                fill style={{ objectFit: 'cover' }} priority />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(9,9,11,0.88) 0%, rgba(9,9,11,0.35) 100%)' }} />
              <div style={{ position: 'absolute', inset: 0, padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  {['Class 10', 'Physics', 'Chapter 10', 'Reflection'].map(t => (
                    <span key={t} className={styles.infoTag}>{t}</span>
                  ))}
                </div>
                <h1 className={styles.chapterTitle}>Light — Reflection</h1>
                <p style={{ color: 'rgba(255,255,255,0.65)', marginTop: '0.5rem', fontSize: '1rem' }}>
                  Laws of reflection, plane mirrors, spherical mirrors, mirror formula — with live simulations
                </p>
              </div>
            </div>
          </section>

          {/* NATURE OF LIGHT */}
          <section className={styles.contentSection}>
            <h2>☀️ What is Light?</h2>
            <p>
              Light is a form of <strong style={{ color: '#00ffcc' }}>electromagnetic radiation</strong> visible to the human eye.
              It travels in straight lines (called <strong style={{ color: '#00ffcc' }}>rectilinear propagation</strong>) — this is why shadows have sharp edges.
              Its speed in vacuum is <strong style={{ color: '#fbbf24' }}>c = 3 × 10⁸ m/s</strong> — fast enough to travel around Earth
              7.5 times in just one second!
            </p>
            <div className={styles.imageGrid}>
              {[
                { src: '/images/light/light_reflection_nano_banana_1781202845384.png', caption: 'Light travels in straight lines — proven by formation of sharp shadows' },
                { src: '/images/light/media__1781201710451.png', caption: 'Visible light is a tiny part of the electromagnetic spectrum (400–700 nm)' },
              ].map((img, i) => (
                <motion.div key={i} className={styles.imageCard} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                  <img src={img.src} alt={img.caption} loading="lazy" style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
                  <div className={styles.imageCardCaption}>{img.caption}</div>
                </motion.div>
              ))}
            </div>
            <div className={styles.glassPanel}>
              <strong>Key Properties of Light:</strong>
              <ul>
                <li>Travels in straight lines in a uniform medium</li>
                <li>Speed in vacuum: <strong>c = 3 × 10⁸ m/s</strong> (approx. 3 lakh km/s)</li>
                <li>Does NOT need a medium — travels through vacuum (unlike sound)</li>
                <li>Wavelength of visible light: 400 nm (violet) to 700 nm (red)</li>
                <li>Can undergo reflection, refraction, and total internal reflection</li>
              </ul>
            </div>
          </section>

          {/* LAWS OF REFLECTION */}
          <section className={styles.contentSection} id="laws">
            <h2>⚡ Laws of Reflection</h2>
            <p>
              When light hits a surface and bounces back into the same medium, it is called <strong style={{ color: '#00ffcc' }}>reflection</strong>.
              The behaviour of the reflected ray is governed by two fundamental laws.
            </p>
            <div className={styles.glassPanel} style={{ borderColor: 'rgba(251,191,36,0.3)', background: 'rgba(251,191,36,0.04)' }}>
              <strong>🏀 Real-Life Analogy:</strong> A ball bounced off a flat wall at 30° bounces back at 30°.
              Light does exactly the same — it reflects at the same angle it hits the surface!
            </div>
            <div className={styles.imageGrid}>
              {[
                { src: '/images/light/reflection-laws-angles-labeled.png', caption: 'Laws of Reflection — full ray diagram: incident ray, normal, reflected ray, ∠i = ∠r labeled' },
                { src: '/images/light/reflection-laws-diagram.png', caption: 'Laws of Reflection — ∠i = ∠r, measured from normal to mirror surface' },
                { src: '/images/light/light_laws_reflection_1781203058464.png', caption: 'Coplanar property: incident ray, normal, reflected ray all lie in the same plane' },
              ].map((img, i) => (
                <div key={i} className={styles.imageCard}>
                  <img src={img.src} alt={img.caption} loading="lazy" style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
                  <div className={styles.imageCardCaption}>{img.caption}</div>
                </div>
              ))}
            </div>
            <div className={styles.formulaBox}>
              <h3>📐 Laws of Reflection</h3>
              <span className={styles.mathEquation}>∠i = ∠r</span>
              <p>
                <strong>Law 1:</strong> Angle of incidence (∠i) = Angle of reflection (∠r) — both measured from the normal.<br />
                <strong>Law 2:</strong> Incident ray, normal, and reflected ray all lie in the same plane (coplanar).
              </p>
            </div>
            <div className={styles.glassPanel}>
              <strong>Important Terms:</strong>
              <ul>
                <li><strong>Incident Ray:</strong> The incoming ray of light that strikes the surface</li>
                <li><strong>Normal:</strong> A line perpendicular (90°) to the reflecting surface at the point of incidence</li>
                <li><strong>Reflected Ray:</strong> The ray that bounces back after hitting the surface</li>
                <li><strong>∠i (Angle of Incidence):</strong> Angle between incident ray and normal</li>
                <li><strong>∠r (Angle of Reflection):</strong> Angle between reflected ray and normal</li>
              </ul>
            </div>
            {/* ★ SIMULATION 1 — after examples */}
            <LawsOfReflectionSim />
          </section>

          {/* TYPES OF REFLECTION */}
          <section className={styles.contentSection} id="types">
            <h2>🪟 Types of Reflection</h2>
            <div className={styles.imageGrid}>
              {[
                { src: '/images/light/regular-diffuse-reflection-detail.png', caption: 'Regular vs Diffuse reflection — smooth mirror → parallel beam; rough surface → scattered rays', wide: true },
                { src: '/images/light/regular-vs-diffuse.png', caption: 'Surface texture determines type: polished = regular, rough = diffuse', wide: false },
              ].map((img, i) => (
                <div key={i} className={styles.imageCard} style={{ gridColumn: img.wide ? '1 / -1' : 'auto' }}>
                  <img src={img.src} alt={img.caption} loading="lazy"
                    style={{ width: '100%', height: img.wide ? '220px' : '200px', objectFit: 'cover', display: 'block' }} />
                  <div className={styles.imageCardCaption}>{img.caption}</div>
                </div>
              ))}
            </div>
            <div className={styles.grid2}>
              <div className={styles.glassPanel} style={{ borderColor: 'rgba(0,255,204,0.25)' }}>
                <strong>🪞 Regular (Specular) Reflection:</strong><br />
                Smooth surface. Parallel rays reflect as parallel rays. Creates a clear, sharp image.
                <br /><br /><strong>Examples:</strong> Mirror, calm water, polished metal
              </div>
              <div className={styles.glassPanel} style={{ borderColor: 'rgba(251,191,36,0.25)' }}>
                <strong>🧱 Diffuse (Irregular) Reflection:</strong><br />
                Rough surface. Parallel rays scatter in all random directions (different normal at each point).
                <br /><br /><strong>Examples:</strong> Paper, wall, chalk, wood, cloth
              </div>
            </div>
            <div className={styles.glassPanel} style={{ borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.04)' }}>
              <strong>💡 Key Insight:</strong> Diffuse reflection is MORE useful in daily life!
              Because of diffuse reflection, you can read this page from any angle.
              If every surface were a perfect mirror, you'd only see objects from exact angles like a laser.
            </div>
          </section>

          {/* PLANE MIRROR */}
          <section className={styles.contentSection} id="plane">
            <h2>🪞 Plane Mirror</h2>
            <p>
              A plane mirror has a flat, smooth reflecting surface. Your bathroom mirror is a plane mirror!
              The image formed has very specific, predictable properties.
            </p>
            <div className={styles.imageGrid}>
              {[
                { src: '/images/light/plane-mirror-image-formation.png', caption: 'Plane mirror image formation — virtual, erect, same size; image behind mirror = object distance in front' },
                { src: '/images/light/plane-mirror-image.png', caption: 'Plane mirror — image appears as far behind mirror as object is in front' },
                { src: '/images/light/lateral-inversion-demo.png', caption: 'Lateral inversion — left-right swap: AMBULANCE written reversed for driver clarity' },
                { src: '/images/light/lateral-inversion.png', caption: 'Lateral inversion: your right hand appears as left hand in mirror — NOT top-bottom flip!' },
                { src: '/images/light/angled-mirrors-multiple-images.png', caption: 'Two mirrors at θ° angle form n = (360°/θ)−1 images: at 60°→ 5 images, 90°→ 3 images' },
              ].map((img, i) => (
                <div key={i} className={styles.imageCard}>
                  <img src={img.src} alt={img.caption} loading="lazy" style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
                  <div className={styles.imageCardCaption}>{img.caption}</div>
                </div>
              ))}
            </div>
            <ul className={styles.terminologyList}>
              <li><strong>Virtual:</strong> Image cannot be projected on a screen — reflected rays appear to diverge from a point BEHIND the mirror</li>
              <li><strong>Erect:</strong> Image is upright (same vertical orientation as the object)</li>
              <li><strong>Same size:</strong> Magnification m = 1 always</li>
              <li><strong>Same distance:</strong> Image distance behind mirror = Object distance in front</li>
              <li><strong>Laterally inverted:</strong> Left and right are swapped (left hand → appears as right hand in mirror)</li>
            </ul>
            <div className={styles.formulaBox}>
              <h3>📏 Plane Mirror — Key Formula</h3>
              <span className={styles.mathEquation}>|u| = |v|</span>
              <p>Object distance = Image distance (both measured from mirror). Magnification m = +1 always.</p>
            </div>
            <div className={styles.glassPanel} style={{ borderColor: 'rgba(251,191,36,0.3)', background: 'rgba(251,191,36,0.04)' }}>
              <strong>💡 Fun Fact — Two Mirrors at an Angle:</strong><br />
              If two mirrors face each other at angle θ, number of images = (360°/θ) − 1<br />
              At 90°: 3 images | At 60°: 5 images | At 45°: 7 images<br />
              <strong>Kaleidoscope uses mirrors at 60°</strong> to create stunning patterns!
            </div>
          </section>

          {/* SPHERICAL MIRRORS */}
          <section className={styles.contentSection} id="spherical">
            <h2>🔮 Spherical Mirrors</h2>
            <p>
              Spherical mirrors are mirrors whose reflecting surface is a part of a sphere.
              They are either <strong style={{ color: '#00ffcc' }}>Concave</strong> (hollow/converging) or
              <strong style={{ color: '#f59e0b' }}> Convex</strong> (bulging/diverging).
            </p>
            <div className={styles.imageGrid}>
              {[
                { src: '/images/light/concave-mirror-5-cases.png', caption: 'Concave Mirror — all 5 image formation cases (beyond C, at C, between C&F, at F, between F&P)' },
                { src: '/images/light/spherical-mirror-parts-labeled.png', caption: 'Spherical mirror anatomy — Pole P, Centre of Curvature C, Focus F, Radius R, Aperture labeled' },
                { src: '/images/light/concave-mirror-diagram.png', caption: 'Concave Mirror — parallel rays converge at focal point F (converging mirror)' },
                { src: '/images/light/convex-mirror-ray-diagram.png', caption: 'Convex Mirror — rays diverge after reflection; virtual focus behind mirror (diverging mirror)' },
                { src: '/images/light/convex-mirror-diagram.png', caption: 'Convex Mirror — always forms virtual, erect, diminished image' },
                { src: '/images/light/light_spherical_mirrors_1781203071616.png', caption: 'Mirror terminology: Pole P, Centre C, Focus F and all key definitions' },
              ].map((img, i) => (
                <div key={i} className={styles.imageCard}>
                  <img src={img.src} alt={img.caption} loading="lazy" style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
                  <div className={styles.imageCardCaption}>{img.caption}</div>
                </div>
              ))}
            </div>
            <div className={styles.grid2}>
              <div className={styles.glassPanel} style={{ borderColor: 'rgba(0,255,204,0.25)' }}>
                <strong>🌑 Concave Mirror:</strong> Reflecting surface faces inward (cave-like). Converges light.
                Can form Real (inverted) or Virtual (erect) images depending on object position.
                <br /><br /><strong>Applications:</strong> Torches, solar cookers, dentist mirrors, shaving mirrors, telescopes
              </div>
              <div className={styles.glassPanel} style={{ borderColor: 'rgba(251,191,36,0.25)' }}>
                <strong>🌕 Convex Mirror:</strong> Reflecting surface faces outward (bulging). Diverges light.
                ALWAYS gives virtual, erect, diminished image regardless of object distance.
                <br /><br /><strong>Applications:</strong> Rear-view mirrors, ATM mirrors, road safety mirrors, shop surveillance
              </div>
            </div>
            <h3 style={{ color: '#00ffcc', marginTop: '1.5rem', marginBottom: '0.75rem' }}>🔑 Key Terms for Spherical Mirrors</h3>
            <ul className={styles.terminologyList}>
              <li><strong>Pole (P):</strong> Centre of the mirror surface — origin for all distance measurements</li>
              <li><strong>Centre of Curvature (C):</strong> Centre of the sphere; distance from P = Radius R</li>
              <li><strong>Radius of Curvature (R):</strong> Radius of the parent sphere; R = 2f</li>
              <li><strong>Principal Focus (F):</strong> Where parallel rays converge (concave) or appear to diverge from (convex); PF = focal length f</li>
              <li><strong>Focal Length (f):</strong> f = R/2</li>
              <li><strong>Principal Axis:</strong> Straight line passing through P and C</li>
              <li><strong>Aperture:</strong> Diameter of the reflecting surface (determines light-collecting ability)</li>
            </ul>
            {/* ★ SIMULATION 2 — Concave Mirror image formation */}
            <ConcaveMirrorSim />
            {/* ★ SIMULATION 3 — Convex Mirror */}
            <ConvexMirrorSim />
          </section>

          {/* MIRROR FORMULA */}
          <section className={styles.contentSection} id="formula">
            <h2>📐 Mirror Formula & Magnification</h2>
            <div className={styles.imageGrid}>
              {[
                { src: '/images/light/mirror-formula-derivation.png', caption: 'Mirror formula derivation — geometric proof of 1/f = 1/v + 1/u using similar triangles' },
                { src: '/images/light/mirror-formula-diagram.png', caption: '1/v + 1/u = 1/f — Mirror formula with labeled ray diagram' },
                { src: '/images/light/light_sign_convention_nano_banana_1781204233503.png', caption: 'New Cartesian Sign Convention — all distances from Pole P' },
                { src: '/images/light/light_magnification_formula_nano_banana_1781204215500.png', caption: 'Magnification: m = h′/h = −v/u (negative → real, inverted)' },
              ].map((img, i) => (
                <div key={i} className={styles.imageCard}>
                  <img src={img.src} alt={img.caption} loading="lazy" style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
                  <div className={styles.imageCardCaption}>{img.caption}</div>
                </div>
              ))}
            </div>
            <div className={styles.formulaBox}>
              <h3>🔢 Mirror Formula</h3>
              <span className={styles.mathEquation}>1/f = 1/v + 1/u</span>
              <p><strong>f</strong> = focal length | <strong>v</strong> = image distance | <strong>u</strong> = object distance (all from Pole P)</p>
            </div>
            <div className={styles.formulaBox}>
              <h3>📏 Linear Magnification</h3>
              <span className={styles.mathEquation}>m = h′/h = −v/u</span>
              <p>
                m {'>'} 0 → Virtual, Erect &nbsp;|&nbsp; m {'<'} 0 → Real, Inverted<br />
                |m| {'>'} 1 → Magnified &nbsp;|&nbsp; |m| {'<'} 1 → Diminished &nbsp;|&nbsp; |m| = 1 → Same size
              </p>
            </div>
            <div className={styles.glassPanel}>
              <strong>📏 New Cartesian Sign Convention (board exam essential!):</strong>
              <ul>
                <li>All distances measured from Pole P</li>
                <li>In direction of incident light (left to right) → <strong style={{ color: '#00ffcc' }}>Positive (+)</strong></li>
                <li>Opposite to incident light → <strong style={{ color: '#f43f5e' }}>Negative (−)</strong></li>
                <li>Heights above principal axis → Positive | Below axis → Negative</li>
                <li><strong>Result:</strong> Real object always has u {'<'} 0. Concave: f {'<'} 0. Convex: f {'>'} 0.</li>
              </ul>
            </div>

            {/* ★ SIMULATION 4 — Mirror Formula Live Calculator */}
            <MirrorFormulaCalcSim />
          </section>

          {/* APPLICATIONS */}
          <section className={styles.contentSection} id="applications">
            <h2>🌟 Real-Life Applications</h2>
            <div className={styles.imageGrid}>
              {[
                { src: '/images/light/concave-mirror-applications.png', caption: '🌟 Concave mirror applications — solar cooker, headlight, satellite dish (all use converging property)' },
                { src: '/images/light/solar-cooker.png', caption: '☀️ Solar Cooker — parabolic concave mirror focuses sunlight; reaches 150–200°C without fuel' },
                { src: '/images/light/rearview-mirror.png', caption: '🚗 Rear-View Mirror — convex mirror; wide 120° field of view vs 30° for plane mirror' },
                { src: '/images/light/light_mirror_formula_nano_banana_1781204199040.png', caption: '🔭 Reflecting Telescope — large concave primary mirror gathers faint starlight' },
              ].map((img, i) => (
                <div key={i} className={styles.imageCard}>
                  <img src={img.src} alt={img.caption} loading="lazy" style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
                  <div className={styles.imageCardCaption}>{img.caption}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gap: '0.85rem', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}>
              {[
                { title: '🔦 Torches & Headlights', desc: 'Concave mirror behind bulb placed at F → parallel beam of light', type: 'Concave' },
                { title: '☀️ Solar Cooker', desc: 'Parabolic concave mirror → focuses sunlight → very high temperature', type: 'Concave' },
                { title: '🦷 Dentist Mirror', desc: 'Object (tooth) between F and P → virtual, erect, magnified image', type: 'Concave' },
                { title: '🚗 Rear-View Mirror', desc: 'Convex mirror → wide field of view, always safe (virtual diminished)', type: 'Convex' },
                { title: '🏪 Shop Surveillance', desc: 'Convex mirrors in corners → monitor large area with single mirror', type: 'Convex' },
                { title: '🔭 Reflecting Telescopes', desc: 'Large concave primary mirror → collects faint light from distant stars', type: 'Concave' },
              ].map((app, i) => (
                <div key={i} style={{
                  padding: '1rem', borderRadius: '10px',
                  background: app.type === 'Concave' ? 'rgba(0,255,204,0.04)' : 'rgba(251,191,36,0.04)',
                  border: `1px solid ${app.type === 'Concave' ? 'rgba(0,255,204,0.15)' : 'rgba(251,191,36,0.15)'}`,
                }}>
                  <div style={{ fontWeight: 700, color: app.type === 'Concave' ? '#00ffcc' : '#f59e0b', marginBottom: '0.3rem', fontSize: '0.9rem' }}>{app.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#a1a1aa', lineHeight: 1.6 }}>{app.desc}</div>
                  <div style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: '#52525b', fontWeight: 600, textTransform: 'uppercase' }}>{app.type}</div>
                </div>
              ))}
            </div>
          </section>

          {/* SOLVED NUMERICALS */}
          <section className={styles.contentSection} id="numericals">
            <h2>🔢 Solved Numericals</h2>
            {[
              { title: 'Numerical 1 — Image Position & Nature',
                prob: 'An object is placed 15 cm in front of a concave mirror of focal length 10 cm. Find image position and nature.',
                steps: ['Given: u = −15 cm (object in front), f = −10 cm (concave mirror)', '1/v = 1/f − 1/u = 1/(−10) − 1/(−15) = −1/10 + 1/15', '1/v = (−3 + 2)/30 = −1/30 → v = −30 cm', 'v is negative → image is REAL (in front of mirror)', 'm = −v/u = −(−30)/(−15) = −2', 'Magnification = −2 → Image is Inverted and Magnified (twice the size)'] },
              { title: 'Numerical 2 — Focal Length from R',
                prob: 'A concave mirror has radius of curvature R = 24 cm. Find its focal length.',
                steps: ['Relationship: f = R/2', 'f = 24/2 = 12 cm', 'For concave mirror (by sign convention): f = −12 cm', 'Note: Focal length is always half the radius of curvature'] },
              { title: 'Numerical 3 — Object Position for Given Magnification',
                prob: 'A concave mirror of focal length 15 cm produces a virtual image with magnification +3. Where is the object?',
                steps: ['Given: f = −15 cm, m = +3 (virtual, erect)', 'm = −v/u → 3 = −v/u → v = −3u', 'Substituting in 1/f = 1/v + 1/u:', '1/(−15) = 1/(−3u) + 1/u = (−1 + 3)/(3u) = 2/(3u)', '−1/15 = 2/(3u) → u = 2 × 15/(−3) = −10 cm', 'Object is placed 10 cm in front (between F and P)'] },
              { title: 'Numerical 4 — Convex Mirror Image',
                prob: 'An object 6 cm tall is 24 cm in front of a convex mirror of focal length 16 cm. Find image distance and size.',
                steps: ['u = −24 cm, f = +16 cm (convex), h = 6 cm', '1/v + 1/(−24) = 1/16 → 1/v = 1/16 + 1/24 = (3+2)/48 = 5/48', 'v = +48/5 = +9.6 cm (positive → virtual, behind mirror)', 'm = −v/u = −9.6/(−24) = +0.4', 'h′ = m × h = 0.4 × 6 = 2.4 cm (erect, diminished)'] },
              { title: 'Numerical 5 — Sun-Earth Distance',
                prob: 'Sunlight takes 8 minutes 20 seconds to reach Earth. Calculate the Sun-Earth distance.',
                steps: ['Time = 8 min 20 sec = (8 × 60 + 20) = 500 seconds', 'Speed of light c = 3 × 10⁸ m/s', 'Distance = Speed × Time = 3 × 10⁸ × 500', 'd = 1500 × 10⁸ m = 1.5 × 10¹¹ m', 'This distance is called 1 Astronomical Unit (1 AU)'] },
              { title: 'Numerical 6 — Images in Angled Mirrors',
                prob: 'Two plane mirrors are placed at 60° to each other. How many images are formed of an object between them?',
                steps: ['Formula: n = (360°/θ) − 1', 'n = (360°/60°) − 1 = 6 − 1 = 5 images', 'This is the principle behind kaleidoscopes!', 'Verification: 360/60 = 6 (even), so n = 6 − 1 = 5'] },
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
                      onClick={() => setMcqDone(d => ({ ...d, [qi]: true }))}>
                      Submit Answer
                    </button>
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
                        <div style={{ fontSize: '0.88rem', color: '#ede9fe', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{card.a}</div>
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
              { href: '/class-10/light-reflection-and-refraction/refraction', label: '→ Refraction of Light', col: '#f59e0b' },
              { href: '/class-10/light-reflection-and-refraction/lenses', label: '→ Lenses', col: '#10b981' },
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
