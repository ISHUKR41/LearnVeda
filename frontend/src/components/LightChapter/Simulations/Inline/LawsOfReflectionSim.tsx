'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/LightChapter.module.css';

export default function LawsOfReflectionSim() {
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
