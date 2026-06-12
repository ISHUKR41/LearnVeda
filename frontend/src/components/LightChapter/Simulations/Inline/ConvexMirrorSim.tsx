'use client';

import React, { useState } from 'react';
import styles from '@/styles/LightChapter.module.css';

export default function ConvexMirrorSim() {
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
