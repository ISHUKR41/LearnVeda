'use client';

/**
 * FILE: refraction/page.tsx
 * PURPOSE: Class 10 — Light: Refraction of Light
 *   Topics: Refraction phenomenon, Snell's Law, Refractive Index, Glass Slab,
 *           Total Internal Reflection (TIR), Optical Fibre, Applications
 *   Features: 7 AI images, 6 animated SVG simulations, 6 numericals, 8 MCQ, 8 flashcards
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Zap, Eye, BookOpen, RotateCcw, Lightbulb, Award, Target, Waves } from 'lucide-react';
import styles from '@/styles/LightChapter.module.css';

/* ═══════════════════════════════════════════════════════════
   SIMULATION 1 — Snell's Law Interactive Lab
   Adjust n₂ and angle of incidence; see refracted ray.
   Shows TIR when going denser→rarer and angle > critical.
═══════════════════════════════════════════════════════════ */
function SnellsLawSim() {
  const [angleI, setAngleI] = useState(35);
  const [n2, setN2] = useState(1.5);
  const [fromDense, setFromDense] = useState(false); /* false: air→glass, true: glass→air */

  const n1 = fromDense ? n2 : 1.0;
  const n2eff = fromDense ? 1.0 : n2;

  /* Calculate refracted angle using Snell's Law: n1 sin(i) = n2 sin(r) */
  const sinR = (n1 * Math.sin((angleI * Math.PI) / 180)) / n2eff;
  const tir = sinR > 1; /* Total Internal Reflection */
  const angleR = tir ? null : (Math.asin(sinR) * 180) / Math.PI;

  /* Critical angle */
  const criticalAngle = fromDense
    ? (Math.asin(1.0 / n2) * 180) / Math.PI
    : null;

  /* SVG geometry */
  const cx = 300; const interfaceY = 180;
  const rayLen = 155;
  const radI = (angleI * Math.PI) / 180;
  const radR = angleR !== null ? (angleR * Math.PI) / 180 : 0;

  /* Incident ray: comes from top (if air→glass) or from bottom (glass→air) */
  const incStartX = fromDense ? cx + rayLen * Math.sin(radI) : cx - rayLen * Math.sin(radI);
  const incStartY = fromDense ? interfaceY + rayLen * Math.cos(radI) : interfaceY - rayLen * Math.cos(radI);

  /* Refracted ray: goes to bottom (air→glass) or top (glass→air) */
  const refEndX = tir ? 0 : (fromDense
    ? cx - rayLen * Math.sin(radR)
    : cx + rayLen * Math.sin(radR));
  const refEndY = tir ? 0 : (fromDense
    ? interfaceY - rayLen * Math.cos(radR)
    : interfaceY + rayLen * Math.cos(radR));

  /* TIR reflected ray (same side as incoming) */
  const tirEndX = fromDense
    ? cx - rayLen * Math.sin(radI)
    : cx + rayLen * Math.sin(radI);
  const tirEndY = fromDense
    ? interfaceY + rayLen * Math.cos(radI)
    : interfaceY - rayLen * Math.cos(radI);

  /* Arc radius */
  const ar = 48;

  return (
    <div className={styles.simulationContainer}>
      <div className={styles.simulationLabel}>🔬 Snell&apos;s Law — Interactive Refraction Lab</div>

      <div className={styles.simControls} style={{ marginBottom: '0.75rem', marginTop: 0 }}>
        <button className={`${styles.simButton} ${!fromDense ? styles.active : ''}`}
          onClick={() => { setFromDense(false); setAngleI(35); }}>
          💨 Air → Glass
        </button>
        <button className={`${styles.simButton} ${fromDense ? styles.active : ''}`}
          onClick={() => { setFromDense(true); setAngleI(25); }}>
          🔵 Glass → Air (TIR possible)
        </button>
      </div>

      <svg width="100%" viewBox="0 0 600 360" style={{ display: 'block', maxWidth: '600px', margin: '0 auto' }}>
        {/* Upper medium label */}
        <rect width="600" height={interfaceY} fill={fromDense ? 'rgba(59,130,246,0.08)' : 'rgba(200,230,255,0.04)'} />
        <text x="20" y="22" fill="#60a5fa" fontSize="11" fontFamily="Inter" fontWeight="600">
          {fromDense ? `Glass (n₁ = ${n2.toFixed(2)})` : 'Air (n₁ = 1.00)'}
        </text>

        {/* Lower medium label */}
        <rect y={interfaceY} width="600" height={360 - interfaceY}
          fill={fromDense ? 'rgba(200,230,255,0.04)' : 'rgba(59,130,246,0.08)'} />
        <text x="20" y={interfaceY + 18} fill={fromDense ? '#60a5fa99' : '#60a5fa'}
          fontSize="11" fontFamily="Inter" fontWeight="600">
          {fromDense ? 'Air (n₂ = 1.00)' : `Glass (n₂ = ${n2.toFixed(2)})`}
        </text>

        {/* Interface line */}
        <line x1="0" y1={interfaceY} x2="600" y2={interfaceY} stroke="#64748b" strokeWidth="2" />

        {/* Normal (dashed) */}
        <line x1={cx} y1="20" x2={cx} y2="340" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="7 5" />
        <text x={cx + 8} y="30" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="Inter" letterSpacing="1">NORMAL</text>

        {/* Incident ray */}
        <line x1={incStartX} y1={incStartY} x2={cx} y2={interfaceY} stroke="#fbbf24" strokeWidth="3"
          style={{ filter: 'drop-shadow(0 0 6px #fbbf2480)' }} />
        <text x={incStartX + (incStartX < cx ? 8 : -88)} y={incStartY + 15}
          fill="#fbbf2488" fontSize="11" fontFamily="Inter">Incident ray</text>

        {/* Refracted ray OR TIR */}
        {!tir ? (
          <>
            <line x1={cx} y1={interfaceY} x2={refEndX} y2={refEndY} stroke="#00ffcc" strokeWidth="3"
              style={{ filter: 'drop-shadow(0 0 6px #00ffcc80)' }} />
            <text x={refEndX - 90} y={refEndY + 15} fill="#00ffcc88" fontSize="11" fontFamily="Inter">
              Refracted ray
            </text>
          </>
        ) : (
          <>
            <line x1={cx} y1={interfaceY} x2={tirEndX} y2={tirEndY} stroke="#f43f5e" strokeWidth="3"
              style={{ filter: 'drop-shadow(0 0 8px #f43f5e)' }} />
            <text x={cx + 15} y={interfaceY - 70} fill="#f43f5e" fontSize="12" fontFamily="Inter" fontWeight="700">
              ⚡ TOTAL INTERNAL REFLECTION
            </text>
          </>
        )}

        {/* Angle of incidence arc */}
        <path d={`M ${cx} ${interfaceY - ar} A ${ar} ${ar} 0 0 ${fromDense ? 1 : 0} ${cx - ar * Math.sin(radI) * (fromDense ? -1 : 1)} ${interfaceY - ar * Math.cos(radI)}`}
          fill="none" stroke="#fbbf24" strokeWidth="1.8" opacity="0.7" />
        <text x={cx - ar * Math.sin(radI / 2) * (fromDense ? -1.7 : 1.7)}
          y={interfaceY - ar * Math.cos(radI / 2) * 1.6}
          fill="#fbbf24" fontSize="12" fontFamily="'JetBrains Mono',monospace" textAnchor="middle" fontWeight="700">
          ∠i={angleI}°
        </text>

        {/* Angle of refraction arc */}
        {!tir && angleR !== null && (
          <>
            <path d={`M ${cx} ${interfaceY + ar} A ${ar} ${ar} 0 0 ${fromDense ? 0 : 1} ${cx + ar * Math.sin(radR) * (fromDense ? -1 : 1)} ${interfaceY + ar * Math.cos(radR)}`}
              fill="none" stroke="#00ffcc" strokeWidth="1.8" opacity="0.7" />
            <text x={cx + ar * Math.sin(radR / 2) * (fromDense ? -1.7 : 1.7)}
              y={interfaceY + ar * Math.cos(radR / 2) * 1.6}
              fill="#00ffcc" fontSize="12" fontFamily="'JetBrains Mono',monospace" textAnchor="middle" fontWeight="700">
              ∠r={angleR.toFixed(1)}°
            </text>
          </>
        )}

        {/* Critical angle marker */}
        {criticalAngle && (
          <text x="420" y="35" fill="#f59e0b" fontSize="10.5" fontFamily="'JetBrains Mono',monospace">
            Critical angle = {criticalAngle.toFixed(1)}°
          </text>
        )}

        {/* Snell's law */}
        <text x="300" y="348" fill="rgba(255,255,255,0.28)" fontSize="10.5"
          textAnchor="middle" fontFamily="'JetBrains Mono',monospace">
          {tir ? `TIR: ${angleI}° > critical angle ${criticalAngle?.toFixed(1)}°`
            : `n₁ sin(${angleI}°) = n₂ sin(${angleR?.toFixed(1)}°)  →  ${(n1 * Math.sin(radI)).toFixed(3)} = ${(n2eff * Math.sin(radR)).toFixed(3)}`}
        </text>
      </svg>

      <div className={styles.simControls}>
        <label style={{ color: '#a1a1aa', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, flexWrap: 'wrap' }}>
          Angle of incidence: <strong style={{ color: '#fbbf24', fontFamily: 'JetBrains Mono', minWidth: '40px' }}>{angleI}°</strong>
          <input type="range" min="5" max={fromDense ? 85 : 80} value={angleI}
            onChange={e => setAngleI(+e.target.value)} className={styles.simSlider} style={{ flex: 1 }} />
        </label>
        {!fromDense && (
          <label style={{ color: '#a1a1aa', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '180px' }}>
            n₂: <strong style={{ color: '#00ffcc', fontFamily: 'JetBrains Mono', minWidth: '36px' }}>{n2.toFixed(2)}</strong>
            <input type="range" min="1.0" max="2.5" step="0.05" value={n2}
              onChange={e => setN2(+e.target.value)} className={styles.simSlider} style={{ flex: 1 }} />
          </label>
        )}
      </div>

      {tir && (
        <div className={styles.glassPanel} style={{ borderColor: 'rgba(244,63,94,0.4)', background: 'rgba(244,63,94,0.06)', marginTop: '0.75rem' }}>
          <strong>⚡ Total Internal Reflection is occurring!</strong><br />
          Angle of incidence ({angleI}°) exceeds the critical angle ({criticalAngle?.toFixed(1)}°).
          Light cannot pass through — it reflects entirely back into the denser medium.
          This is the principle behind optical fibres and diamond sparkle!
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SIMULATION 2 — Glass Slab: Lateral Displacement
═══════════════════════════════════════════════════════════ */
function GlassSlabSim() {
  const [angleI, setAngleI] = useState(40);
  const [slabThick, setSlabThick] = useState(80);

  const n = 1.5;
  const radI = (angleI * Math.PI) / 180;
  const sinR = Math.sin(radI) / n;
  const radR = Math.asin(sinR);
  const angleR = (radR * 180) / Math.PI;

  /* Lateral displacement: d = t × sin(i - r) / cos(r) */
  const lateralDisp = (slabThick * Math.sin(radI - radR)) / Math.cos(radR);

  /* SVG: slab from y=140 to y=140+slabThick */
  const slabTop = 140;
  const slabBot = slabTop + slabThick;
  const cx = 200; /* entry point x */

  /* Path through slab */
  const insideLen = slabThick / Math.cos(radR);
  const exitX = cx + insideLen * Math.sin(radR);
  const exitY = slabBot;

  /* Emergent ray (parallel to incident, displaced) */
  const emergentEndX = exitX + 130 * Math.sin(radI);
  const emergentEndY = slabBot + 130 * Math.cos(radI);

  return (
    <div className={styles.simulationContainer}>
      <div className={styles.simulationLabel}>📦 Glass Slab — Lateral Displacement Demo</div>

      <svg width="100%" viewBox="0 0 540 380" style={{ display: 'block', maxWidth: '540px', margin: '0 auto' }}>
        {/* Incident ray (above slab) */}
        <line x1={cx - 140 * Math.sin(radI)} y1={slabTop - 140 * Math.cos(radI)} x2={cx} y2={slabTop}
          stroke="#fbbf24" strokeWidth="3" style={{ filter: 'drop-shadow(0 0 5px #fbbf2480)' }} />

        {/* Slab */}
        <rect x="30" y={slabTop} width="480" height={slabThick}
          fill="rgba(59,130,246,0.12)" stroke="#3b82f6" strokeWidth="1.5" rx="4" />
        <text x="45" y={slabTop + slabThick / 2 + 5} fill="#60a5fa88" fontSize="11" fontFamily="Inter" fontWeight="600">
          Glass (n = 1.50)
        </text>

        {/* Ray inside slab */}
        <line x1={cx} y1={slabTop} x2={exitX} y2={exitY}
          stroke="#00ffcc" strokeWidth="2.8" style={{ filter: 'drop-shadow(0 0 5px #00ffcc60)' }} />

        {/* Emergent ray */}
        <line x1={exitX} y1={exitY} x2={emergentEndX} y2={emergentEndY}
          stroke="#fbbf24" strokeWidth="3" style={{ filter: 'drop-shadow(0 0 5px #fbbf2480)' }} />

        {/* Extended incident ray (dashed — to show parallel) */}
        <line x1={cx} y1={slabTop} x2={cx + 130 * Math.sin(radI) + (exitX - cx)} y2={slabBot + 130 * Math.cos(radI)}
          stroke="#fbbf24" strokeWidth="1" strokeDasharray="5 4" opacity="0.3" />

        {/* Lateral displacement arrow */}
        <line x1={exitX} y1={emergentEndY} x2={cx + (exitX - cx) + 130 * Math.sin(radI)} y2={emergentEndY}
          stroke="#f43f5e" strokeWidth="1.5" markerEnd="url(#arrowRed)" />
        <text x={exitX + 8} y={emergentEndY - 6} fill="#f43f5e" fontSize="11" fontFamily="'JetBrains Mono',monospace" fontWeight="700">
          d ≈ {lateralDisp.toFixed(1)} px
        </text>

        {/* Normals */}
        <line x1={cx} y1={slabTop - 40} x2={cx} y2={slabTop + 40} stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="5 4" />
        <line x1={exitX} y1={slabBot - 40} x2={exitX} y2={slabBot + 40} stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="5 4" />

        {/* Angle labels */}
        <text x={cx - 50} y={slabTop - 18} fill="#fbbf24" fontSize="11.5"
          fontFamily="'JetBrains Mono',monospace" fontWeight="700">∠i={angleI}°</text>
        <text x={cx + 12} y={slabTop + 26} fill="#00ffcc" fontSize="11.5"
          fontFamily="'JetBrains Mono',monospace" fontWeight="700">∠r={angleR.toFixed(1)}°</text>
        <text x={exitX + 10} y={slabBot + 22} fill="#fbbf24" fontSize="11.5"
          fontFamily="'JetBrains Mono',monospace" fontWeight="700">∠e={angleI}° (= ∠i)</text>

        {/* Bottom note */}
        <text x="270" y="365" fill="rgba(255,255,255,0.28)" fontSize="10.5"
          textAnchor="middle" fontFamily="'JetBrains Mono',monospace">
          Emergent ray ∥ Incident ray but displaced by d = t·sin(i−r)/cos(r)
        </text>

        <defs>
          <marker id="arrowRed" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 Z" fill="#f43f5e" />
          </marker>
        </defs>
      </svg>

      <div className={styles.simControls}>
        <label style={{ color: '#a1a1aa', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
          Angle: <strong style={{ color: '#fbbf24', fontFamily: 'JetBrains Mono' }}>{angleI}°</strong>
          <input type="range" min="10" max="70" value={angleI}
            onChange={e => setAngleI(+e.target.value)} className={styles.simSlider} style={{ flex: 1 }} />
        </label>
        <label style={{ color: '#a1a1aa', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
          Thickness: <strong style={{ color: '#00ffcc', fontFamily: 'JetBrains Mono' }}>{slabThick}px</strong>
          <input type="range" min="40" max="140" step="10" value={slabThick}
            onChange={e => setSlabThick(+e.target.value)} className={styles.simSlider} style={{ flex: 1 }} />
        </label>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SIMULATION 3 — Total Internal Reflection: Critical Angle
   Shows three stages: normal refraction → grazing → TIR
═══════════════════════════════════════════════════════════ */
function TIRSim() {
  const [angle, setAngle] = useState(30);
  const n_glass = 1.5;
  const critDeg = (Math.asin(1 / n_glass) * 180) / Math.PI; /* ~41.8° */
  const radI = (angle * Math.PI) / 180;
  const sinR = n_glass * Math.sin(radI);
  const tir = sinR > 1;
  const grazing = !tir && sinR > 0.98;
  const radR = tir ? null : Math.asin(sinR);
  const angleR = radR !== null ? (radR * 180) / Math.PI : null;

  const interfaceY = 200; const cx = 300; const len = 150;

  /* Incident from bottom (inside glass) */
  const incX = cx - len * Math.sin(radI);
  const incY = interfaceY + len * Math.cos(radI);

  /* Refracted goes upward */
  const refX = radR !== null ? cx + len * Math.sin(radR) : cx;
  const refY = radR !== null ? interfaceY - len * Math.cos(radR) : 0;

  /* TIR reflected ray */
  const tirX = cx + len * Math.sin(radI);
  const tirY = interfaceY + len * Math.cos(radI);

  const statusColor = tir ? '#f43f5e' : grazing ? '#f59e0b' : '#00ffcc';
  const statusLabel = tir ? '⚡ TOTAL INTERNAL REFLECTION'
    : grazing ? '⚠ GRAZING REFRACTION (≈ Critical Angle)'
    : '✓ Normal Refraction';

  return (
    <div className={styles.simulationContainer}>
      <div className={styles.simulationLabel}>💎 Total Internal Reflection — Critical Angle Demo</div>

      <svg width="100%" viewBox="0 0 600 380" style={{ display: 'block', maxWidth: '600px', margin: '0 auto' }}>
        {/* Upper: Air */}
        <rect width="600" height={interfaceY} fill="rgba(200,230,255,0.03)" />
        <text x="18" y="22" fill="#60a5fa88" fontSize="11" fontFamily="Inter" fontWeight="600">Air (n = 1.00)</text>

        {/* Lower: Glass */}
        <rect y={interfaceY} width="600" height={380 - interfaceY} fill="rgba(59,130,246,0.1)" />
        <text x="18" y={interfaceY + 20} fill="#60a5fa" fontSize="11" fontFamily="Inter" fontWeight="600">
          Glass (n = {n_glass.toFixed(2)})
        </text>

        {/* Interface */}
        <line x1="0" y1={interfaceY} x2="600" y2={interfaceY} stroke="#64748b" strokeWidth="2" />

        {/* Normal */}
        <line x1={cx} y1="20" x2={cx} y2="370" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="7 5" />

        {/* Incident ray (in glass, going up) */}
        <line x1={incX} y1={incY} x2={cx} y2={interfaceY}
          stroke="#3b82f6" strokeWidth="3"
          style={{ filter: `drop-shadow(0 0 6px ${statusColor}80)` }} />

        {/* Refracted ray (in air) or TIR reflected ray */}
        {!tir ? (
          <>
            <line x1={cx} y1={interfaceY} x2={grazing ? cx + len * 0.999 : refX} y2={grazing ? interfaceY : refY}
              stroke={grazing ? '#f59e0b' : '#00ffcc'} strokeWidth={grazing ? 2 : 3}
              style={{ filter: `drop-shadow(0 0 6px ${grazing ? '#f59e0b' : '#00ffcc'}80)` }} />
            {grazing && <text x={cx + 20} y={interfaceY - 14} fill="#f59e0b" fontSize="11" fontFamily="Inter" fontWeight="700">Grazes surface (90°)</text>}
          </>
        ) : (
          <line x1={cx} y1={interfaceY} x2={tirX} y2={tirY}
            stroke="#f43f5e" strokeWidth="3"
            style={{ filter: 'drop-shadow(0 0 8px #f43f5e)' }} />
        )}

        {/* Angle labels */}
        <text x={cx - 60} y={interfaceY + 35} fill="#60a5fa" fontSize="12"
          fontFamily="'JetBrains Mono',monospace" fontWeight="700">∠i={angle}°</text>

        {!tir && angleR !== null && (
          <text x={cx + 15} y={interfaceY - 25} fill={grazing ? '#f59e0b' : '#00ffcc'} fontSize="12"
            fontFamily="'JetBrains Mono',monospace" fontWeight="700">∠r={angleR.toFixed(1)}°</text>
        )}

        {/* Critical angle marker */}
        <text x="400" y="35" fill="#f59e0b" fontSize="10.5" fontFamily="'JetBrains Mono',monospace">
          Critical angle C = {critDeg.toFixed(1)}°
        </text>

        {/* Status label */}
        <text x="300" y="368" fill={statusColor} fontSize="11.5"
          textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontWeight="700">
          {statusLabel}
        </text>
      </svg>

      <div className={styles.simControls}>
        <label style={{ color: '#a1a1aa', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
          Angle inside glass:
          <strong style={{ color: statusColor, fontFamily: 'JetBrains Mono', minWidth: '42px' }}>{angle}°</strong>
          <input type="range" min="5" max="85" value={angle}
            onChange={e => setAngle(+e.target.value)} className={styles.simSlider} style={{ flex: 1 }} />
        </label>
      </div>

      <div className={styles.glassPanel} style={{ marginTop: '0.75rem', borderColor: `${statusColor}30`, background: `${statusColor}08` }}>
        <strong>Stage: {statusLabel}</strong><br />
        {tir
          ? `Angle (${angle}°) > Critical angle (${critDeg.toFixed(1)}°) → Light cannot escape glass → 100% reflected back!`
          : grazing
            ? `Angle (${angle}°) ≈ Critical angle (${critDeg.toFixed(1)}°) → Refracted ray just grazes the surface (∠r = 90°)`
            : `Normal refraction: n₁ sin(${angle}°) = n₂ sin(${angleR?.toFixed(1)}°) → ∠r ${'>'}  ∠i (bends away from normal)`}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SIMULATION 4 — Prism Dispersion (White Light → VIBGYOR)
   Animates white light splitting into 7 colours through a prism.
   User can adjust glass refractive index and input angle.
═══════════════════════════════════════════════════════════ */
function PrismDispersionSim() {
  const [n, setN] = useState(1.52); /* refractive index of prism glass */
  const [animate, setAnimate] = useState(true);
  const [tick, setTick] = useState(0);

  /* Animate a slow pulsing white beam */
  useEffect(() => {
    if (!animate) return;
    const id = setInterval(() => setTick(t => t + 1), 80);
    return () => clearInterval(id);
  }, [animate]);

  /* 7 colours with approximate refractive indices for flint glass */
  const colours = [
    { name: 'Violet',  hex: '#8B5CF6', dn: 0.018, wl: '380nm' },
    { name: 'Indigo',  hex: '#6366f1', dn: 0.014, wl: '420nm' },
    { name: 'Blue',    hex: '#3b82f6', dn: 0.010, wl: '450nm' },
    { name: 'Green',   hex: '#10b981', dn: 0.005, wl: '520nm' },
    { name: 'Yellow',  hex: '#fbbf24', dn: 0.002, wl: '580nm' },
    { name: 'Orange',  hex: '#f97316', dn: 0.000, wl: '600nm' },
    { name: 'Red',     hex: '#ef4444', dn: -0.004, wl: '700nm' },
  ];

  /* Prism geometry (equilateral, apex at top) */
  const apex = { x: 300, y: 40 };
  const baseL = { x: 160, y: 290 };
  const baseR = { x: 440, y: 290 };

  /* Incident white beam comes from left at 60° to left face */
  const incidentAngle = 55; /* degrees from normal to left face */

  /* Compute exit rays using Snell's law through equilateral prism (A=60°) */
  const prismAngle = 60; /* degrees */
  const rays = colours.map((col) => {
    const nc = n + col.dn;
    const r1Rad = Math.asin(Math.sin((incidentAngle * Math.PI) / 180) / nc);
    const r2Rad = (prismAngle * Math.PI) / 180 - r1Rad;
    const sinOut = nc * Math.sin(r2Rad);
    const outAngle = Math.asin(Math.min(sinOut, 1)) * 180 / Math.PI;
    return { ...col, nc, outAngle, r1Rad, r2Rad };
  });

  /* Entry point on left face */
  const entryX = 215; const entryY = 175;
  /* Exit point on right face */
  const exitX = 318; const exitY = 200;

  /* Pulse for animation */
  const pulse = animate ? 0.7 + 0.3 * Math.sin(tick * 0.2) : 1;

  return (
    <div className={styles.simulationContainer}>
      <div className={styles.simulationLabel}>🌈 Prism Dispersion — White Light Splits into VIBGYOR</div>

      <svg width="100%" viewBox="0 0 600 350" style={{ display: 'block', maxWidth: '640px', margin: '0 auto' }}>
        {/* Prism */}
        <polygon
          points={`${apex.x},${apex.y} ${baseL.x},${baseL.y} ${baseR.x},${baseR.y}`}
          fill="rgba(96,165,250,0.08)" stroke="#60a5fa" strokeWidth="2"
          style={{ filter: 'drop-shadow(0 0 8px rgba(96,165,250,0.3))' }}
        />
        <text x={apex.x} y={apex.y - 10} fill="#60a5fa88" textAnchor="middle" fontSize="11">A = 60°</text>

        {/* Incident white beam */}
        <line x1="60" y1={entryY - 40} x2={entryX} y2={entryY}
          stroke="white" strokeWidth={4 * pulse}
          style={{ filter: `drop-shadow(0 0 ${8 * pulse}px white)` }} />
        <text x="38" y={entryY - 46} fill="#f4f4f5" fontSize="11" fontWeight="700">White</text>
        <text x="35" y={entryY - 33} fill="#f4f4f5" fontSize="11" fontWeight="700">Light</text>

        {/* Dispersed exit rays */}
        {rays.map((ray, i) => {
          const spread = (i - 3) * 22; /* vertical spread for VIBGYOR */
          const exitAngleRad = ((35 + ray.outAngle * 0.3) * Math.PI) / 180;
          const ex2 = exitX + 200 * Math.cos(exitAngleRad);
          const ey2 = exitY + spread + 200 * Math.sin(exitAngleRad - 0.15);
          const glow = animate ? 8 * pulse : 4;
          return (
            <g key={ray.name}>
              <line x1={exitX} y1={exitY} x2={ex2} y2={ey2}
                stroke={ray.hex} strokeWidth="2.5"
                style={{ filter: `drop-shadow(0 0 ${glow}px ${ray.hex})`, opacity: pulse }} />
              <text x={ex2 + 6} y={ey2 + 4} fill={ray.hex} fontSize="10.5" fontWeight="700">
                {ray.name} ({ray.wl})
              </text>
            </g>
          );
        })}

        {/* Internal refracted ray (inside prism) */}
        <line x1={entryX} y1={entryY} x2={exitX} y2={exitY}
          stroke="rgba(255,255,200,0.6)" strokeWidth="2" strokeDasharray="4 3" />

        {/* Labels */}
        <text x={baseL.x + 20} y={baseL.y + 18} fill="#71717a" fontSize="11">Left Face</text>
        <text x={baseR.x - 60} y={baseR.y + 18} fill="#71717a" fontSize="11">Right Face</text>

        {/* n value */}
        <text x="295" y="175" fill="#60a5fa" fontSize="10.5" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">
          n = {n.toFixed(2)}
        </text>
      </svg>

      {/* Controls */}
      <div className={styles.simControls} style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
        <label style={{ color: '#a1a1aa', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
          Glass n:
          <strong style={{ color: '#60a5fa', fontFamily: 'JetBrains Mono', minWidth: '36px' }}>{n.toFixed(2)}</strong>
          <input type="range" min="1.45" max="1.75" step="0.01" value={n}
            onChange={e => setN(+e.target.value)} className={styles.simSlider} style={{ flex: 1 }} />
        </label>
        <button className={`${styles.simButton} ${animate ? styles.active : ''}`}
          onClick={() => setAnimate(a => !a)}>
          {animate ? '⏸ Pause' : '▶ Animate'}
        </button>
      </div>

      <div className={styles.glassPanel} style={{ marginTop: '0.75rem' }}>
        <strong>💡 Why does dispersion occur?</strong> Different colours have slightly different refractive indices.
        Violet light bends MORE (higher n), Red light bends LESS (lower n).
        The angular spread of VIBGYOR is called <strong>angular dispersion</strong>
        = δ_violet − δ_red. Higher n → more dispersion!
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SIMULATION 5 — Optical Fibre TIR Animator
   Animates light bouncing inside an optical fibre via TIR.
   User can adjust the refractive index difference.
═══════════════════════════════════════════════════════════ */
function OpticalFibreSim() {
  const [nCore, setNCore] = useState(1.52);
  const nClad = 1.46; /* cladding index fixed */
  const [animate, setAnimate] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!animate) return;
    const id = setInterval(() => setTick(t => t + 1), 60);
    return () => clearInterval(id);
  }, [animate]);

  const critAngle = (Math.asin(nClad / nCore) * 180) / Math.PI;
  const fibreY1 = 100; /* top boundary */
  const fibreY2 = 220; /* bottom boundary */
  const fibreLen = 560;
  const fibreMid = (fibreY1 + fibreY2) / 2;

  /* Animated photon position along the zig-zag */
  const period = 80; /* ticks per bounce cycle */
  const phase = (tick % period) / period;
  const segLen = 100;
  const totalSegs = Math.floor(fibreLen / segLen);

  /* Build zig-zag bounce path */
  const zigPoints: Array<{ x: number; y: number }> = [{ x: 20, y: fibreMid }];
  for (let i = 0; i <= totalSegs; i++) {
    zigPoints.push({ x: 20 + (i + 1) * segLen, y: i % 2 === 0 ? fibreY1 + 12 : fibreY2 - 12 });
  }

  /* Photon position */
  const segIdx = Math.floor(phase * totalSegs);
  const segPhase = (phase * totalSegs) % 1;
  const p1 = zigPoints[Math.min(segIdx, zigPoints.length - 2)];
  const p2 = zigPoints[Math.min(segIdx + 1, zigPoints.length - 1)];
  const photonX = p1.x + (p2.x - p1.x) * segPhase;
  const photonY = p1.y + (p2.y - p1.y) * segPhase;

  return (
    <div className={styles.simulationContainer}>
      <div className={styles.simulationLabel}>🌐 Optical Fibre — Total Internal Reflection in Action</div>

      <svg width="100%" viewBox="0 0 580 320" style={{ display: 'block', maxWidth: '640px', margin: '0 auto' }}>
        {/* Cladding background */}
        <rect x="15" y="70" width={fibreLen} height={fibreY2 - fibreY1 + 60}
          rx="8" fill="rgba(59,130,246,0.08)" stroke="#334155" strokeWidth="1.5" />
        <text x="20" y="88" fill="#475569" fontSize="10">Cladding (n = {nClad})</text>

        {/* Core */}
        <rect x="15" y={fibreY1} width={fibreLen} height={fibreY2 - fibreY1}
          rx="6" fill="rgba(96,165,250,0.12)" stroke="#3b82f6" strokeWidth="2"
          style={{ filter: 'drop-shadow(0 0 6px rgba(96,165,250,0.3))' }} />
        <text x="20" y={fibreY1 + 16} fill="#60a5fa" fontSize="10" fontWeight="600">
          Core (n = {nCore.toFixed(2)})  |  Crit. angle = {critAngle.toFixed(1)}°
        </text>

        {/* TIR zig-zag path */}
        {zigPoints.slice(0, -1).map((pt, i) => {
          const next = zigPoints[i + 1];
          return (
            <line key={i} x1={pt.x} y1={pt.y} x2={next.x} y2={next.y}
              stroke="rgba(0,255,204,0.35)" strokeWidth="1.8"
              strokeDasharray="none" />
          );
        })}

        {/* Animated photon (glowing dot) */}
        {animate && (
          <circle cx={photonX} cy={photonY} r="6" fill="#00ffcc"
            style={{ filter: 'drop-shadow(0 0 12px #00ffcc) drop-shadow(0 0 4px white)' }} />
        )}

        {/* TIR reflection annotations at bounce points */}
        {zigPoints.slice(1, -1).map((pt, i) => (
          <g key={i}>
            <text x={pt.x - 10} y={pt.y + (i % 2 === 0 ? -8 : 14)}
              fill="#00ffcc88" fontSize="9.5" textAnchor="middle" fontFamily="'JetBrains Mono',monospace">
              TIR
            </text>
          </g>
        ))}

        {/* Input / Output labels */}
        <text x="8" y={fibreMid + 4} fill="#f4f4f5" fontSize="11" fontWeight="700" textAnchor="end">IN</text>
        <text x={fibreLen + 22} y={fibreMid + 4} fill="#00ffcc" fontSize="11" fontWeight="700">OUT</text>

        {/* Data label */}
        <text x="295" y="300" fill="#71717a" fontSize="10.5" textAnchor="middle">
          Light travels {fibreLen} units — data transmitted at speed of light!
        </text>
      </svg>

      {/* Controls */}
      <div className={styles.simControls} style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
        <label style={{ color: '#a1a1aa', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
          Core n:
          <strong style={{ color: '#00ffcc', fontFamily: 'JetBrains Mono', minWidth: '36px' }}>{nCore.toFixed(2)}</strong>
          <input type="range" min="1.47" max="1.65" step="0.01" value={nCore}
            onChange={e => setNCore(+e.target.value)} className={styles.simSlider} style={{ flex: 1 }} />
        </label>
        <button className={`${styles.simButton} ${animate ? styles.active : ''}`}
          onClick={() => setAnimate(a => !a)}>
          {animate ? '⏸ Pause' : '▶ Animate'}
        </button>
      </div>

      <div className={styles.glassPanel} style={{ marginTop: '0.75rem', borderColor: 'rgba(0,255,204,0.25)' }}>
        <strong>🌐 How Optical Fibre Works:</strong><br />
        Core (n = {nCore.toFixed(2)}) surrounded by cladding (n = {nClad}).
        Critical angle = {critAngle.toFixed(1)}°. Any light ray inside the core hitting the boundary
        at angle {'>'} {critAngle.toFixed(1)}° undergoes TIR — bounces back perfectly,
        zero energy lost! This is how the internet works — your data as light pulses, bouncing
        thousands of times through glass thinner than a hair, over thousands of kilometres.
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SIMULATION 6 — Refractive Index & Critical Angle Calculator
   Dual sliders for n₁, n₂ and incident angle; shows:
   - Angle of refraction (Snell's Law)
   - Critical angle for TIR
   - Interactive ray diagram
═══════════════════════════════════════════════════════════ */
function RefractiveIndexCalcSim() {
  const [n1, setN1] = useState(1.0);
  const [n2, setN2] = useState(1.52);
  const [theta_i, setThetaI] = useState(30);

  /* Snell's Law: n1·sin(θ1) = n2·sin(θ2) */
  const sinR = (n1 * Math.sin((theta_i * Math.PI) / 180)) / n2;
  const tir = sinR > 1; /* Total internal reflection */
  const theta_r = tir ? null : Math.asin(sinR) * (180 / Math.PI);

  /* Critical angle (only if n1 > n2) */
  const hasCritical = n1 > n2;
  const criticalAngle = hasCritical ? Math.asin(n2 / n1) * (180 / Math.PI) : null;

  /* Speed of light in each medium */
  const v1 = (3e8 / n1 / 1e8).toFixed(3);
  const v2 = (3e8 / n2 / 1e8).toFixed(3);

  /* SVG layout */
  const cx = 240; const cy = 200; /* interface midpoint */
  const rayLen = 130;
  /* incident ray from top-left */
  const iRad = (theta_i * Math.PI) / 180;
  const ix1 = cx - rayLen * Math.sin(iRad);
  const iy1 = cy - rayLen * Math.cos(iRad);
  /* reflected ray */
  const rx2 = cx + rayLen * Math.sin(iRad);
  const ry2 = cy - rayLen * Math.cos(iRad);
  /* refracted ray */
  const rRad = theta_r !== null ? (theta_r * Math.PI) / 180 : null;
  const rfx2 = rRad !== null ? cx + rayLen * Math.sin(rRad) : null;
  const rfy2 = rRad !== null ? cy + rayLen * Math.cos(rRad) : null;

  return (
    <div className={styles.simulationContainer}>
      <div className={styles.simulationLabel}>🔬 Refractive Index & Critical Angle Calculator</div>

      {/* Sliders */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.85rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'n₁ (Medium 1)', val: n1, set: setN1, min: 1.0, max: 3.0, step: 0.01, col: '#60a5fa', presets: [['Air', 1.0], ['Water', 1.33], ['Glass', 1.52]] },
          { label: 'n₂ (Medium 2)', val: n2, set: setN2, min: 1.0, max: 3.0, step: 0.01, col: '#f59e0b', presets: [['Water', 1.33], ['Glass', 1.52], ['Diamond', 2.42]] },
          { label: 'Angle of Incidence', val: theta_i, set: setThetaI, min: 0, max: 89, step: 1, col: '#00ffcc', presets: [] },
        ].map(s => (
          <div key={s.label}>
            <label style={{ fontSize: '0.78rem', color: '#a1a1aa', display: 'block', marginBottom: '0.3rem' }}>
              {s.label} = <strong style={{ color: s.col, fontFamily: 'JetBrains Mono, monospace' }}>{s.val.toFixed(s.step < 1 ? 2 : 0)}{s.label.includes('Angle') ? '°' : ''}</strong>
            </label>
            <input type="range" min={s.min} max={s.max} value={s.val} step={s.step}
              onChange={e => s.set(+e.target.value)}
              style={{ width: '100%', accentColor: s.col }} />
            {s.presets.length > 0 && (
              <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.3rem', flexWrap: 'wrap' }}>
                {s.presets.map(([name, val]) => (
                  <button key={String(name)} onClick={() => s.set(+val)}
                    style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', background: `${s.col}15`, border: `1px solid ${s.col}40`, borderRadius: '4px', color: s.col, cursor: 'pointer' }}>
                    {String(name)}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Results row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.6rem', marginBottom: '1.1rem' }}>
        {[
          { label: 'Angle of Refraction', val: tir ? 'TIR ∞' : `${theta_r!.toFixed(1)}°`, col: tir ? '#f43f5e' : '#00ffcc' },
          { label: 'Critical Angle', val: criticalAngle !== null ? `${criticalAngle.toFixed(1)}°` : 'N/A (n₁ < n₂)', col: hasCritical ? '#f59e0b' : '#52525b' },
          { label: 'Speed in n₁', val: `${v1} ×10⁸ m/s`, col: '#60a5fa' },
          { label: 'Speed in n₂', val: `${v2} ×10⁸ m/s`, col: '#f59e0b' },
        ].map(r => (
          <div key={r.label} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', padding: '0.6rem 0.4rem', border: `1px solid ${r.col}25` }}>
            <div style={{ fontSize: '0.65rem', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.2rem' }}>{r.label}</div>
            <div style={{ fontSize: '1.0rem', fontWeight: 800, color: r.col, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.2 }}>{r.val}</div>
          </div>
        ))}
      </div>

      {/* TIR banner */}
      {tir && (
        <div style={{ textAlign: 'center', marginBottom: '0.9rem' }}>
          <span style={{ background: '#f43f5e20', border: '1px solid #f43f5e50', borderRadius: '20px', padding: '0.4rem 1.2rem', color: '#f43f5e', fontWeight: 700, fontSize: '0.9rem' }}>
            ⚡ Total Internal Reflection! θᵢ ({theta_i}°) {'>'} θ_c ({criticalAngle?.toFixed(1) ?? '—'}°)
          </span>
        </div>
      )}

      {/* SVG Ray Diagram */}
      <svg width="100%" viewBox="0 0 480 380" style={{ display: 'block', maxWidth: '480px', margin: '0 auto', borderRadius: '10px', background: 'rgba(0,0,0,0.3)' }}>
        <defs>
          <pattern id="refgrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0L0 0 0 20" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />
          </pattern>
          <marker id="arrowBlue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#60a5fa" />
          </marker>
          <marker id="arrowGreen" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#00ffcc" />
          </marker>
          <marker id="arrowRed" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#f43f5e" />
          </marker>
        </defs>
        <rect width="480" height="380" fill="url(#refgrid)" />

        {/* Media labels */}
        <rect x="0" y="0" width="480" height={cy} fill={`rgba(96,165,250,${Math.min(0.04 + n1*0.015, 0.15)})`} />
        <rect x="0" y={cy} width="480" height={380-cy} fill={`rgba(245,158,11,${Math.min(0.04 + n2*0.015, 0.15)})`} />
        <text x="8" y="22" fill="#60a5fa" fontSize="11" fontFamily="Inter" fontWeight="700">Medium 1 (n₁ = {n1.toFixed(2)})</text>
        <text x="8" y={cy + 20} fill="#f59e0b" fontSize="11" fontFamily="Inter" fontWeight="700">Medium 2 (n₂ = {n2.toFixed(2)})</text>

        {/* Interface line */}
        <line x1="0" y1={cy} x2="480" y2={cy} stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeDasharray="8 4" />

        {/* Normal (vertical dashed) */}
        <line x1={cx} y1={cy-150} x2={cx} y2={cy+150} stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 4" />
        <text x={cx+5} y={cy-140} fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="Inter">Normal</text>

        {/* Incident ray */}
        <line x1={ix1} y1={iy1} x2={cx} y2={cy} stroke="#60a5fa" strokeWidth="2.5" markerEnd="url(#arrowBlue)" style={{ filter: 'drop-shadow(0 0 4px #60a5fa60)' }} />
        <text x={ix1-5} y={iy1-6} fill="#60a5fa99" fontSize="10" textAnchor="middle" fontFamily="Inter">Incident Ray</text>

        {/* Angle of incidence arc */}
        <path d={`M ${cx} ${cy-40} A 40 40 0 0 0 ${cx - 40*Math.sin(iRad)} ${cy - 40*Math.cos(iRad)}`}
          fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.5" />
        <text x={cx - 55*Math.sin(iRad/2)} y={cy - 50*Math.cos(iRad/2)} fill="#60a5fa" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono">{theta_i}°</text>

        {/* Reflected ray */}
        <line x1={cx} y1={cy} x2={rx2} y2={ry2} stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="6 3" markerEnd="url(#arrowRed)" opacity="0.6" />
        <text x={rx2+4} y={ry2-6} fill="#a78bfa80" fontSize="9" textAnchor="start" fontFamily="Inter">Reflected</text>

        {/* Refracted ray (or TIR label) */}
        {!tir && rRad !== null && rfx2 !== null && rfy2 !== null && (
          <>
            <line x1={cx} y1={cy} x2={rfx2} y2={rfy2} stroke="#00ffcc" strokeWidth="2.5" markerEnd="url(#arrowGreen)" style={{ filter: 'drop-shadow(0 0 4px #00ffcc60)' }} />
            <text x={rfx2+4} y={rfy2+4} fill="#00ffcc99" fontSize="10" textAnchor="start" fontFamily="Inter">Refracted ({theta_r!.toFixed(1)}°)</text>
            {/* Angle of refraction arc */}
            <path d={`M ${cx} ${cy+40} A 40 40 0 0 1 ${cx + 40*Math.sin(rRad)} ${cy + 40*Math.cos(rRad)}`}
              fill="none" stroke="#00ffcc" strokeWidth="1.5" opacity="0.5" />
          </>
        )}
        {tir && (
          <>
            <text x={cx} y={cy+60} fill="#f43f5e" fontSize="14" textAnchor="middle" fontFamily="Inter" fontWeight="700">
              ⚡ Total Internal Reflection
            </text>
            <text x={cx} y={cy+82} fill="#f43f5e80" fontSize="10" textAnchor="middle" fontFamily="Inter">No refracted ray — all light reflects back</text>
          </>
        )}

        {/* Critical angle indicator */}
        {criticalAngle !== null && (
          <text x={cx+5} y={cy-6} fill="#f59e0b80" fontSize="9" fontFamily="JetBrains Mono">θ_c = {criticalAngle.toFixed(1)}°</text>
        )}

        <text x="8" y="375" fill="#333" fontSize="9" fontFamily="Inter">Snell&apos;s Law: n₁ sin θ₁ = n₂ sin θ₂</text>
      </svg>

      {/* Working */}
      <div style={{ marginTop: '0.65rem', padding: '0.6rem 0.9rem', background: 'rgba(0,255,204,0.04)', borderRadius: '8px', border: '1px solid rgba(0,255,204,0.1)', fontSize: '0.82rem', color: '#71717a' }}>
        💡 <strong>Snell&apos;s Law:</strong> n₁ sin θᵢ = n₂ sin θᵣ → {n1.toFixed(2)} × sin({theta_i}°) = {n2.toFixed(2)} × sin θᵣ
        → sin θᵣ = {sinR.toFixed(4)} {tir ? '> 1 → TIR!' : `→ θᵣ = ${theta_r!.toFixed(1)}°`}
        {hasCritical && <> | <strong style={{ color: '#f59e0b' }}>Critical: sin θ_c = n₂/n₁ = {(n2/n1).toFixed(3)} → θ_c = {criticalAngle!.toFixed(1)}°</strong></>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function RefractionPage() {
  const [focusMode, setFocusMode] = useState(false);
  const [mcqAns, setMcqAns] = useState<Record<number, number>>({});
  const [mcqDone, setMcqDone] = useState<Record<number, boolean>>({});
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const mcqs = [
    { q: 'Refraction of light is due to:',
      opts: ['Change in speed of light at interface', 'Change in amplitude', 'Change in frequency', 'Change in colour'],
      ans: 0, exp: 'Refraction occurs because light changes speed when passing from one medium to another. The change in speed causes the ray to bend at the interface.' },
    { q: 'Refractive index of glass is 1.5. Speed of light in glass is approximately:',
      opts: ['3 × 10⁸ m/s', '2 × 10⁸ m/s', '1.5 × 10⁸ m/s', '4.5 × 10⁸ m/s'],
      ans: 1, exp: 'v = c/n = 3×10⁸ / 1.5 = 2×10⁸ m/s. The refractive index n = c/v, so v = c/n.' },
    { q: 'A light ray going from air (n=1) to water (n=1.33) will:',
      opts: ['Bend away from normal', 'Bend toward normal', 'Go straight through', 'Undergo TIR'],
      ans: 1, exp: 'Going from less dense (air) to more dense (water) medium, light bends TOWARD the normal (angle of refraction < angle of incidence).' },
    { q: 'Total Internal Reflection occurs when:',
      opts: ['Light goes from rarer to denser medium', 'Angle of incidence < critical angle', 'Light goes from denser to rarer medium at angle > critical angle', 'Both media have same refractive index'],
      ans: 2, exp: 'TIR requires TWO conditions: (1) Light must travel from denser to rarer medium, AND (2) angle of incidence must exceed the critical angle.' },
    { q: 'Critical angle for glass-air interface (n=1.5) is approximately:',
      opts: ['30°', '41.8°', '48.6°', '60°'],
      ans: 1, exp: 'sin C = 1/n = 1/1.5 = 0.667 → C = sin⁻¹(0.667) ≈ 41.8°' },
    { q: 'A glass slab causes:',
      opts: ['No change in ray direction', 'Convergence of rays', 'Lateral displacement of ray', 'Divergence of rays'],
      ans: 2, exp: 'A glass slab causes lateral displacement — the emergent ray is parallel to the incident ray but shifted sideways. The amount depends on thickness and angle.' },
    { q: 'Optical fibre works on the principle of:',
      opts: ['Refraction', 'Regular reflection', 'Total Internal Reflection', 'Diffraction'],
      ans: 2, exp: 'Optical fibres transmit light over long distances using TIR. Light keeps reflecting internally and never escapes the core.' },
    { q: 'A coin at bottom of a pool appears closer to surface than it actually is. This is due to:',
      opts: ['Reflection from coin surface', 'Refraction at water-air interface', 'Dispersion of light', 'TIR inside water'],
      ans: 1, exp: 'Refraction at the water-air interface causes the apparent depth to be less than real depth. n = real depth / apparent depth.' },
  ];

  const flashcards = [
    { q: 'State Snell\'s Law of Refraction', a: 'n₁ sin θ₁ = n₂ sin θ₂\nwhere n₁, n₂ are refractive indices of media 1 and 2,\nand θ₁, θ₂ are angles of incidence and refraction with the normal.\nAlso: n = sin i / sin r (for light from vacuum/air)' },
    { q: 'What is Refractive Index? Give its formula.', a: 'n = c/v = speed of light in vacuum / speed in medium\nAlso: n = sin i / sin r (Snell\'s law)\nValues: Air ≈ 1.0, Water = 1.33, Glass = 1.52, Diamond = 2.42\nDenser medium → higher n → slower light → more bending' },
    { q: 'What is Total Internal Reflection (TIR)? Conditions?', a: 'TIR: Complete reflection of light at an interface, no refraction.\nTwo conditions:\n1. Light must travel from DENSER to RARER medium (higher n to lower n)\n2. Angle of incidence must EXCEED the critical angle C' },
    { q: 'What is Critical Angle? Give its formula.', a: 'Critical angle C: the angle of incidence in denser medium at which refracted ray just grazes the surface (∠r = 90°)\nFormula: sin C = n₂/n₁ = 1/n (for glass-air)\nFor glass (n=1.5): sin C = 2/3 → C ≈ 41.8°' },
    { q: 'What happens to a ray through a glass slab?', a: 'The emergent ray is:\n1. Parallel to the incident ray (same direction)\n2. Laterally displaced by distance d\nd = t × sin(i − r) / cos(r)\nwhere t = thickness of slab\nHigher angle or thicker slab → more lateral displacement' },
    { q: 'Applications of Total Internal Reflection', a: '1. Optical Fibres: transmit light/data over long distances\n2. Diamond sparkle: high n (2.42) → small critical angle → TIR\n3. Mirage: TIR in layers of hot air near ground\n4. Periscopes using prisms\n5. Endoscopes in medical imaging' },
    { q: 'Why do diamonds sparkle so brilliantly?', a: 'Diamond has very high refractive index (n = 2.42)\n→ Very small critical angle ≈ 24.4°\n→ Most light entering the diamond undergoes multiple TIR inside\n→ Light bounces around and exits from top creating brilliant sparkle\nThat is why diamonds are cut at specific angles to maximize TIR' },
    { q: 'Real depth vs Apparent depth (refraction at flat surface)', a: 'When looking from air into water/glass:\nApparent depth < Real depth\nFormula: n = Real depth / Apparent depth\nOr: Apparent depth = Real depth / n\nExample: Coin in water appears closer than it is\nReal depth 30cm in water (n=1.33) → Apparent depth = 30/1.33 ≈ 22.6 cm' },
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
            <h2>🌊 Refraction</h2>
          </div>
          <nav className={styles.sidebarNav}>
            {[
              { href: '#intro', icon: <Waves size={13} />, label: 'Refraction Intro' },
              { href: '#snell', icon: <Zap size={13} />, label: "Snell's Law" },
              { href: '#ri', icon: <Eye size={13} />, label: 'Refractive Index' },
              { href: '#glass-slab', icon: <BookOpen size={13} />, label: 'Glass Slab' },
              { href: '#tir', icon: <Target size={13} />, label: 'TIR & Critical Angle' },
              { href: '#fibre', icon: <Lightbulb size={13} />, label: 'Optical Fibre' },
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

        {/* MAIN CONTENT */}
        <main className={styles.mainContent}>

          {/* HERO */}
          <section className={styles.heroSection} id="intro">
            <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', height: '260px' }}>
              <Image src="/images/light/light_refraction_nano_banana_1781202861976.png"
                alt="Light Refraction through Prism" fill style={{ objectFit: 'cover' }} priority />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(9,9,11,0.88) 0%, rgba(9,9,11,0.35) 100%)' }} />
              <div style={{ position: 'absolute', inset: 0, padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  {['Class 10', 'Physics', 'Chapter 10', 'Refraction'].map(t => (
                    <span key={t} className={styles.infoTag}>{t}</span>
                  ))}
                </div>
                <h1 className={styles.chapterTitle}>Light — Refraction</h1>
                <p style={{ color: 'rgba(255,255,255,0.65)', marginTop: '0.5rem', fontSize: '1rem' }}>
                  Snell&apos;s Law, refractive index, glass slabs, TIR, optical fibres — with interactive labs
                </p>
              </div>
            </div>
          </section>

          {/* REFRACTION INTRO */}
          <section className={styles.contentSection}>
            <h2>🌊 What is Refraction?</h2>
            <p>
              <strong style={{ color: '#00ffcc' }}>Refraction</strong> is the bending of light as it passes from one
              transparent medium to another. It occurs because light travels at different speeds in different media.
            </p>

            <div className={styles.glassPanel} style={{ borderColor: 'rgba(251,191,36,0.3)', background: 'rgba(251,191,36,0.04)' }}>
              <strong>🏊 Real-Life Example:</strong> Have you noticed a straw or pencil in a glass of water looks bent at the surface?
              That is refraction! The light from the submerged part bends when exiting the water, making the object appear displaced.
            </div>

            <div className={styles.imageGrid}>
              {[
                { src: '/images/light/refraction-real-life-examples.png', caption: 'Real-life refraction — pencil bent in water, pool depth illusion, mirage, star twinkling' },
                { src: '/images/light/light_snells_law_1781203083554.png', caption: 'Light bending at air-glass interface — angle changes because speed changes' },
                { src: '/images/light/media__1781206235525.png', caption: 'Pencil in water appears bent — classic example of refraction' },
              ].map((img, i) => (
                <motion.div key={i} className={styles.imageCard} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                  <img src={img.src} alt={img.caption} loading="lazy" style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
                  <div className={styles.imageCardCaption}>{img.caption}</div>
                </motion.div>
              ))}
            </div>

            <ul className={styles.terminologyList}>
              <li><strong>Cause of Refraction:</strong> Change in speed of light when entering a new medium</li>
              <li><strong>Towards Normal:</strong> When going from rare (air) to dense (glass) medium — speed decreases, bends toward normal</li>
              <li><strong>Away from Normal:</strong> When going from dense (glass) to rare (air) medium — speed increases, bends away from normal</li>
              <li><strong>No Bending:</strong> If light falls normally (at 90° to surface, i.e., ∠i = 0°), it goes straight through</li>
            </ul>
          </section>

          {/* SNELL'S LAW */}
          <section className={styles.contentSection} id="snell">
            <h2>⚡ Snell&apos;s Law of Refraction</h2>
            <p>
              The mathematical relationship between angles of incidence and refraction is given by Snell&apos;s Law.
              It was formulated by Dutch astronomer Willebrord Snell in 1621.
            </p>

            <div className={styles.imageGrid}>
              {[
                { src: '/images/light/snells-law-complete-diagram.png', caption: "Snell's Law — n₁sinθ₁=n₂sinθ₂: light bends toward normal entering denser medium, wavefronts compress" },
                { src: '/images/light/snells-law-vector-diagram.png', caption: "Snell's Law vector diagram — angle i vs angle r with Cartesian sign convention labeled" },
                { src: '/images/light/light_snells_law_1781203083554.png', caption: "Snell's Law: incident ray bends toward normal when entering denser medium" },
                { src: '/images/light/light_refractive_index_1781203095581.png', caption: 'Refractive indices: denser medium → higher n, slower light, more bending' },
              ].map((img, i) => (
                <div key={i} className={styles.imageCard}>
                  <img src={img.src} alt={img.caption} loading="lazy" style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
                  <div className={styles.imageCardCaption}>{img.caption}</div>
                </div>
              ))}
            </div>

            <div className={styles.formulaBox}>
              <h3>📐 Snell&apos;s Law</h3>
              <span className={styles.mathEquation}>n₁ sin θ₁ = n₂ sin θ₂</span>
              <p>
                n₁, n₂ = refractive indices | θ₁ = angle of incidence | θ₂ = angle of refraction<br />
                Also: <strong>n = sin i / sin r</strong> (when coming from vacuum/air into the medium)
              </p>
            </div>

            {/* ★ SIMULATION 1 — Snell's Law Lab */}
            <SnellsLawSim />

            {/* ★ SIMULATION 6 — Refractive Index & Critical Angle Calculator */}
            <RefractiveIndexCalcSim />
          </section>

          {/* REFRACTIVE INDEX */}
          <section className={styles.contentSection} id="ri">
            <h2>🔢 Refractive Index</h2>
            <p>
              The <strong style={{ color: '#00ffcc' }}>refractive index (n)</strong> of a medium tells us how much it bends light,
              or equivalently, how much it slows down light compared to vacuum.
            </p>

            <div className={styles.imageGrid}>
              {[
                { src: '/images/light/refractive-index-comparison.png', caption: 'Refractive index visual: Air(1.00), Water(1.33), Glass(1.52), Diamond(2.42) — bending increases with n' },
                { src: '/images/light/light_refractive_index_1781203095581.png', caption: 'Refractive index comparison: diamond(2.42) > glass(1.52) > water(1.33) > air(1.00)' },
                { src: '/images/light/light_absolute_refractive_nano_banana_1781204408083.png', caption: 'Absolute refractive index: n = c/v (speed in vacuum ÷ speed in medium)' },
              ].map((img, i) => (
                <div key={i} className={styles.imageCard}>
                  <img src={img.src} alt={img.caption} loading="lazy" style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
                  <div className={styles.imageCardCaption}>{img.caption}</div>
                </div>
              ))}
            </div>

            <div className={styles.formulaBox}>
              <h3>🔢 Refractive Index Formulas</h3>
              <span className={styles.mathEquation}>n = c/v = sin i / sin r</span>
              <p>c = speed of light in vacuum (3×10⁸ m/s) | v = speed in the medium</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem', margin: '1rem 0' }}>
              {[
                { medium: 'Vacuum', n: '1.00', col: '#71717a' },
                { medium: 'Air', n: '≈ 1.00', col: '#60a5fa' },
                { medium: 'Water', n: '1.33', col: '#3b82f6' },
                { medium: 'Crown Glass', n: '1.52', col: '#8b5cf6' },
                { medium: 'Flint Glass', n: '1.62', col: '#7c3aed' },
                { medium: 'Diamond', n: '2.42', col: '#00ffcc' },
              ].map(item => (
                <div key={item.medium} style={{
                  padding: '0.75rem', borderRadius: '8px', textAlign: 'center',
                  background: `${item.col}10`, border: `1px solid ${item.col}25`,
                }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: item.col, fontFamily: 'JetBrains Mono' }}>{item.n}</div>
                  <div style={{ fontSize: '0.72rem', color: '#71717a', marginTop: '0.25rem' }}>{item.medium}</div>
                </div>
              ))}
            </div>
          </section>

          {/* GLASS SLAB */}
          <section className={styles.contentSection} id="glass-slab">
            <h2>📦 Refraction through a Glass Slab</h2>
            <p>
              When light passes through a glass slab (two parallel surfaces), it undergoes refraction twice.
              The emergent ray is parallel to the incident ray, but shifted sideways — called <strong style={{ color: '#00ffcc' }}>lateral displacement</strong>.
            </p>

            <div className={styles.imageGrid}>
              {[
                { src: '/images/light/glass-slab-lateral-displacement.png', caption: 'Glass slab lateral displacement — formula d=t·sin(i−r)/cos(r); emergent ray parallel but shifted sideways' },
                { src: '/images/light/light_glass_slab_nano_banana_1781204391585.png', caption: 'Glass slab refraction — emergent ray is parallel to incident ray but laterally displaced' },
                { src: '/images/light/snells-law-vector-diagram.png', caption: 'Snell\'s Law at both surfaces: n₁ sin i = n₂ sin r → net deviation = zero, lateral shift only' },
              ].map((img, i) => (
                <div key={i} className={styles.imageCard}>
                  <img src={img.src} alt={img.caption} loading="lazy" style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
                  <div className={styles.imageCardCaption}>{img.caption}</div>
                </div>
              ))}
            </div>

            <div className={styles.formulaBox}>
              <h3>📏 Lateral Displacement Formula</h3>
              <span className={styles.mathEquation}>d = t · sin(i − r) / cos(r)</span>
              <p>
                d = lateral displacement | t = thickness of slab | i = angle of incidence | r = angle of refraction<br />
                Increases with: larger angle of incidence, greater slab thickness, higher refractive index
              </p>
            </div>

            {/* ★ SIMULATION 2 — Glass Slab */}
            <GlassSlabSim />
          </section>

          {/* TOTAL INTERNAL REFLECTION */}
          <section className={styles.contentSection} id="tir">
            <h2>💎 Total Internal Reflection (TIR)</h2>
            <p>
              <strong style={{ color: '#f43f5e' }}>Total Internal Reflection</strong> is the complete reflection of a
              light ray at an interface, with NO refraction. It is the most spectacular optical phenomenon
              and the basis of optical fibres and diamond brilliance!
            </p>

            <div className={styles.glassPanel} style={{ borderColor: 'rgba(251,191,36,0.3)', background: 'rgba(251,191,36,0.04)' }}>
              <strong>💎 Why do diamonds sparkle so brilliantly?</strong><br />
              Diamond has an extremely high refractive index (n = 2.42), giving a very small critical angle of just 24.4°.
              Light entering through the top face undergoes multiple total internal reflections before exiting.
              Diamonds are cut (faceted) at precise angles to maximise this internal bouncing and sparkle!
            </div>

            <div className={styles.imageGrid}>
              {[
                { src: '/images/light/tir-three-stages.png', caption: 'TIR stages — angle<C: refraction, angle=C: grazing ray, angle>C: total internal reflection (no refraction)' },
                { src: '/images/light/diamond-tir-sparkle.png', caption: 'Diamond brilliance via TIR — n=2.42, critical angle only 24°; multiple internal reflections create sparkle' },
                { src: '/images/light/optical-fibre-cross-section.png', caption: 'Optical fibre — core(n=1.52) + cladding(n=1.46); TIR traps light for internet, endoscopy, sensors' },
                { src: '/images/light/tir-optical-fibre-detail.png', caption: 'Optical fibre TIR detail — light bounces at >critical angle throughout entire length with 0% loss' },
                { src: '/images/light/rainbow-formation-tir.png', caption: 'Rainbow — water droplets: refract on entry, internally reflect, refract on exit → spectrum arc' },
                { src: '/images/light/media__1781206240893.png', caption: 'TIR stages: normal refraction → critical angle grazing → total internal reflection' },
              ].map((img, i) => (
                <div key={i} className={styles.imageCard}>
                  <img src={img.src} alt={img.caption} loading="lazy" style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
                  <div className={styles.imageCardCaption}>{img.caption}</div>
                </div>
              ))}
            </div>

            <div className={styles.formulaBox}>
              <h3>📐 Critical Angle Formula</h3>
              <span className={styles.mathEquation}>sin C = n₂/n₁ = 1/n</span>
              <p>
                C = critical angle (for glass-air interface)<br />
                n = refractive index of denser medium<br />
                Glass (n=1.5): sin C = 2/3 → C ≈ 41.8° | Diamond (n=2.42): C ≈ 24.4°
              </p>
            </div>

            <div className={styles.glassPanel}>
              <strong>Two Necessary Conditions for TIR:</strong>
              <ol>
                <li>Light must travel from a <strong>denser medium</strong> (higher n) to a <strong>rarer medium</strong> (lower n)</li>
                <li>Angle of incidence must be <strong>greater than the critical angle</strong></li>
              </ol>
            </div>

            {/* ★ SIMULATION 3 — TIR */}
            <TIRSim />
          </section>

          {/* OPTICAL FIBRE */}
          <section className={styles.contentSection} id="fibre">
            <h2>🌐 Optical Fibre</h2>
            <p>
              Optical fibres use TIR to transmit light (and thus information) over thousands of kilometres with minimal loss.
              They are the backbone of modern internet and communication networks!
            </p>

            <div className={styles.glassPanel} style={{ borderColor: 'rgba(0,255,204,0.25)' }}>
              <strong>Structure of an Optical Fibre:</strong>
              <ul>
                <li><strong>Core:</strong> Very thin glass (diameter ~8-50 μm) with high refractive index</li>
                <li><strong>Cladding:</strong> Surrounding glass layer with slightly lower refractive index</li>
                <li>Light enters from one end; hits the core-cladding boundary at angle {'>'} critical angle → TIR</li>
                <li>Light bounces back and forth along the entire length and exits at the other end!</li>
                <li>Even if the fibre is bent or curved, TIR keeps the light inside</li>
              </ul>
            </div>

            {/* ★ SIMULATION 5 — Optical Fibre TIR */}
            <OpticalFibreSim />

            <div className={styles.grid2}>
              <div className={styles.glassPanel} style={{ borderColor: 'rgba(0,255,204,0.2)' }}>
                <strong>🌐 Internet & Telecommunications:</strong><br />
                Data encoded as light pulses travels through submarine cables across oceans.
                A single fibre can carry thousands of phone calls simultaneously.
              </div>
              <div className={styles.glassPanel} style={{ borderColor: 'rgba(251,191,36,0.2)' }}>
                <strong>🏥 Medical Endoscopes:</strong><br />
                Doctors use bundles of optical fibres (endoscopes) to see inside the human body without surgery.
              </div>
            </div>
          </section>

          {/* PRISM & DISPERSION */}
          <section className={styles.contentSection} id="dispersion">
            <h2>🌈 Prism and Dispersion of Light</h2>
            <p>
              When white light passes through a glass prism, it splits into its component colours (VIBGYOR).
              This splitting is called <strong style={{ color: '#00ffcc' }}>dispersion</strong>.
              It happens because different colours (wavelengths) have slightly different refractive indices in glass,
              so they bend by different amounts at each surface.
            </p>

            <div className={styles.glassPanel} style={{ borderColor: 'rgba(251,191,36,0.3)', background: 'rgba(251,191,36,0.04)' }}>
              <strong>🌈 Why does a rainbow form?</strong><br />
              Raindrops act like tiny glass prisms! Sunlight enters a raindrop, undergoes refraction,
              then total internal reflection at the back, then refraction again on the way out.
              Different colours emerge at different angles (red at 42°, violet at 40°) — forming the rainbow arc!
            </div>

            <div className={styles.imageGrid}>
              {[
                { src: '/images/light/prism-dispersion-vibgyor.png', caption: 'White light dispersion through prism — VIBGYOR: violet bends most (highest n), red bends least (lowest n)' },
                { src: '/images/light/rainbow-formation-tir.png', caption: 'Rainbow formation — refraction + TIR inside water droplets separates sunlight into VIBGYOR arc' },
              ].map((img, i) => (
                <div key={i} className={styles.imageCard}>
                  <img src={img.src} alt={img.caption} loading="lazy" style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
                  <div className={styles.imageCardCaption}>{img.caption}</div>
                </div>
              ))}
            </div>

            <div className={styles.glassPanel}>
              <strong>📋 VIBGYOR — Order of Colours in Spectrum:</strong>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                {[
                  { c: 'Violet', hex: '#8B5CF6', wl: '380–450 nm' },
                  { c: 'Indigo', hex: '#6366f1', wl: '450–420 nm' },
                  { c: 'Blue', hex: '#3b82f6', wl: '450–495 nm' },
                  { c: 'Green', hex: '#10b981', wl: '495–570 nm' },
                  { c: 'Yellow', hex: '#fbbf24', wl: '570–590 nm' },
                  { c: 'Orange', hex: '#f97316', wl: '590–620 nm' },
                  { c: 'Red', hex: '#ef4444', wl: '620–750 nm' },
                ].map(col => (
                  <div key={col.c} style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', background: `${col.hex}20`, border: `1px solid ${col.hex}50`, textAlign: 'center', minWidth: '80px' }}>
                    <div style={{ color: col.hex, fontWeight: 700, fontSize: '0.88rem' }}>{col.c}</div>
                    <div style={{ color: '#71717a', fontSize: '0.7rem' }}>{col.wl}</div>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: '0.75rem', color: '#a1a1aa', fontSize: '0.88rem' }}>
                <strong>Violet bends most</strong> (highest refractive index, shortest wavelength) |{' '}
                <strong>Red bends least</strong> (lowest refractive index, longest wavelength)
              </p>
            </div>

            {/* ★ SIMULATION 4 — Prism Dispersion */}
            <PrismDispersionSim />

            <div className={styles.formulaBox}>
              <h3>📐 Angle of Deviation</h3>
              <span className={styles.mathEquation}>δ = (n − 1) × A</span>
              <p>
                δ = angle of deviation | n = refractive index | A = angle of prism<br />
                Higher refractive index → larger angle of deviation → violet deviates more than red
              </p>
            </div>
          </section>

          {/* NUMERICALS */}
          <section className={styles.contentSection} id="numericals">
            <h2>🔢 Solved Numericals</h2>
            {[
              { title: 'Numerical 1 — Snell\'s Law Calculation',
                prob: 'A ray of light passes from air into glass. Angle of incidence = 30°, refractive index of glass = √3. Find angle of refraction.',
                steps: ['n₁ sin i = n₂ sin r → 1 × sin 30° = √3 × sin r', 'sin r = sin 30° / √3 = 0.5 / 1.732 = 0.2887', 'r = sin⁻¹(0.2887) ≈ 16.8°', 'Angle of refraction ≈ 16.8° (bends toward normal, as expected going denser)'] },
              { title: 'Numerical 2 — Refractive Index from Speed',
                prob: 'Speed of light in a medium is 2.25 × 10⁸ m/s. Find its refractive index.',
                steps: ['n = c/v = 3×10⁸ / 2.25×10⁸', 'n = 3/2.25 = 4/3 ≈ 1.33', 'This is the refractive index of water!'] },
              { title: 'Numerical 3 — Critical Angle',
                prob: 'Find the critical angle for a glass-air interface where n(glass) = 1.6.',
                steps: ['sin C = n_rarer / n_denser = 1.0 / 1.6 = 0.625', 'C = sin⁻¹(0.625) ≈ 38.7°', 'Any angle > 38.7° in glass hitting air boundary will cause TIR'] },
              { title: 'Numerical 4 — Apparent Depth',
                prob: 'A fish is 60 cm below the surface of water (n = 4/3). How deep does it appear to an observer in air?',
                steps: ['Apparent depth = Real depth / n', 'Apparent depth = 60 / (4/3) = 60 × (3/4) = 45 cm', 'The fish appears only 45 cm below the surface, even though it is 60 cm deep', 'This is why pools appear shallower than they are!'] },
              { title: 'Numerical 5 — Lateral Displacement',
                prob: 'A glass slab of thickness 10 cm and n = 1.5 is placed in path of light. Angle of incidence = 45°. Find lateral displacement.',
                steps: ['n₁ sin i = n₂ sin r → sin 45° = 1.5 × sin r', 'sin r = 0.7071/1.5 = 0.4714 → r = sin⁻¹(0.4714) ≈ 28.1°', 'd = t × sin(i − r) / cos(r)', 'd = 10 × sin(45° − 28.1°) / cos(28.1°)', 'd = 10 × sin(16.9°) / cos(28.1°) = 10 × 0.2907 / 0.8829 ≈ 3.29 cm'] },
              { title: 'Numerical 6 — Speed of Light in Diamond',
                prob: 'Refractive index of diamond is 2.42. Find the speed of light in diamond.',
                steps: ['n = c/v → v = c/n', 'v = 3×10⁸ / 2.42', 'v = 1.24 × 10⁸ m/s', 'Light is over 2 times slower in diamond than in vacuum — this causes extreme bending!'] },
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
              { href: '/class-10/light-reflection-and-refraction/lenses', label: '→ Lenses', col: '#10b981' },
              { href: '/class-10/light-reflection-and-refraction/summary', label: '→ Summary', col: '#7c3aed' },
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
