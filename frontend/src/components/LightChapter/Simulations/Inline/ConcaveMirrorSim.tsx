'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '@/styles/LightChapter.module.css';

export default function ConcaveMirrorSim() {
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
