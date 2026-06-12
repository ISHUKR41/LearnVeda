'use client';

import React, { useState } from 'react';
import styles from '@/styles/LightChapter.module.css';

export default function MirrorFormulaCalcSim() {
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
