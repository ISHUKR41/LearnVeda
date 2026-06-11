'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/LightChapter.module.css';

export default function RefractionSimulation() {
  const [n1, setN1] = useState(1.0); // Medium 1 Refractive Index (Air)
  const [n2, setN2] = useState(1.5); // Medium 2 Refractive Index (Glass)
  const [angle1, setAngle1] = useState(45); // Angle of incidence (degrees)

  const getMediumColor = (n: number) => {
    if (n === 1.0) return '#050505'; // Air
    if (n === 1.33) return '#001a33'; // Water
    if (n === 1.5) return '#003322'; // Glass
    if (n === 2.42) return '#1a0033'; // Diamond
    return '#111';
  };

  const getMediumName = (n: number) => {
    if (n === 1.0) return 'Air/Vacuum';
    if (n === 1.33) return 'Water';
    if (n === 1.5) return 'Glass';
    if (n === 2.42) return 'Diamond';
    return 'Custom';
  };

  // Snell's Law: n1 * sin(θ1) = n2 * sin(θ2)
  const angle1Rad = (angle1 * Math.PI) / 180;
  const sinTheta2 = (n1 * Math.sin(angle1Rad)) / n2;
  
  let angle2Rad = 0;
  let angle2 = 0;
  let isTIR = false; // Total Internal Reflection

  if (sinTheta2 > 1) {
    isTIR = true;
    angle2 = angle1; // Reflection angle equals incidence angle
    angle2Rad = (angle2 * Math.PI) / 180;
  } else {
    angle2Rad = Math.asin(sinTheta2);
    angle2 = (angle2Rad * 180) / Math.PI;
  }

  // SVG dimensions
  const cx = 400; // Center X
  const cy = 250; // Center Y (Boundary)

  // Incident Ray
  const rayLength = 300;
  const inX = cx - rayLength * Math.sin(angle1Rad);
  const inY = cy - rayLength * Math.cos(angle1Rad);

  // Refracted/Reflected Ray
  let outX = 0;
  let outY = 0;

  if (isTIR) {
    // Reflect back into medium 1
    outX = cx + rayLength * Math.sin(angle2Rad);
    outY = cy - rayLength * Math.cos(angle2Rad);
  } else {
    // Refract into medium 2
    outX = cx + rayLength * Math.sin(angle2Rad);
    outY = cy + rayLength * Math.cos(angle2Rad);
  }

  // Add grid with coordinates
  const gridLines = [];
  for (let i = 0; i <= 800; i += 40) {
    gridLines.push(
      <g key={`v${i}`}>
        <line x1={i} y1="0" x2={i} y2="500" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        {i % 80 === 0 && <text x={i+2} y="12" fill="rgba(255,255,255,0.2)" fontSize="9">{i}</text>}
      </g>
    );
  }
  for (let i = 0; i <= 500; i += 40) {
    gridLines.push(
      <g key={`h${i}`}>
        <line x1="0" y1={i} x2="800" y2={i} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        {i % 80 === 0 && <text x="2" y={i-2} fill="rgba(255,255,255,0.2)" fontSize="9">{i}</text>}
      </g>
    );
  }

  // Calculate speed of light in both mediums (c = 3x10^8 m/s)
  const c = 3.0; // x10^8 m/s
  const v1 = (c / n1).toFixed(2);
  const v2 = (c / n2).toFixed(2);

  return (
    <div className={styles.simulationContainer} style={{ background: '#050505', border: '1px solid #333', borderRadius: '12px', overflow: 'hidden', position: 'relative', boxShadow: '0 10px 40px rgba(0,255,204,0.1)' }}>
      
      {/* Interactive Overlay */}
      <div style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(5,5,5,0.85)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(0,255,204,0.4)', zIndex: 10, backdropFilter: 'blur(12px)', color: '#fff', width: '320px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#00ffcc', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', textShadow: '0 0 10px rgba(0,255,204,0.5)' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#00ffcc', borderRadius: '50%', boxShadow: '0 0 8px #00ffcc' }}></span>
          Advanced Snell's Law Lab
        </h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '0.8rem', color: '#aaa', display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>Angle of Incidence (∠i)</span>
            <span style={{ color: '#00ffcc', fontFamily: 'monospace', fontSize: '0.9rem' }}>{angle1.toFixed(1)}°</span>
          </label>
          <input type="range" min="0" max="89" value={angle1} onChange={(e) => setAngle1(Number(e.target.value))} style={{ width: '100%', accentColor: '#00ffcc' }}/>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '0.8rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>Medium 1 (Incident)</label>
          <select 
            value={n1} 
            onChange={(e) => setN1(Number(e.target.value))}
            style={{ width: '100%', padding: '8px', marginTop: '5px', background: '#111', color: '#00ffcc', border: '1px solid #333', borderRadius: '4px', fontFamily: 'monospace' }}
          >
            <option value={1.0}>Air/Vacuum (n=1.00)</option>
            <option value={1.33}>Water (n=1.33)</option>
            <option value={1.5}>Glass (n=1.50)</option>
            <option value={2.42}>Diamond (n=2.42)</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '0.8rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>Medium 2 (Refracted)</label>
          <select 
            value={n2} 
            onChange={(e) => setN2(Number(e.target.value))}
            style={{ width: '100%', padding: '8px', marginTop: '5px', background: '#111', color: '#00ffcc', border: '1px solid #333', borderRadius: '4px', fontFamily: 'monospace' }}
          >
            <option value={1.0}>Air/Vacuum (n=1.00)</option>
            <option value={1.33}>Water (n=1.33)</option>
            <option value={1.5}>Glass (n=1.50)</option>
            <option value={2.42}>Diamond (n=2.42)</option>
          </select>
        </div>

        <div style={{ background: isTIR ? 'rgba(255,0,85,0.05)' : 'rgba(0,255,204,0.05)', padding: '12px', borderRadius: '6px', borderLeft: `3px solid ${isTIR ? '#ff0055' : '#00ffcc'}`, fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
            <span style={{ color: '#aaa' }}>{isTIR ? 'Angle of Reflection (∠r):' : 'Angle of Refraction (∠r):'}</span>
            <span style={{ fontWeight: 'bold', fontFamily: 'monospace', color: '#fff' }}>{angle2.toFixed(1)}°</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
            <span style={{ color: '#aaa' }}>Relative Index (n₂₁):</span>
            <span style={{ fontWeight: 'bold', fontFamily: 'monospace', color: '#fff' }}>{(n2/n1).toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#aaa' }}>Phenomenon:</span>
            <span style={{ fontWeight: 'bold', color: isTIR ? '#ff0055' : '#00ffcc', textShadow: `0 0 5px ${isTIR ? 'rgba(255,0,85,0.5)' : 'rgba(0,255,204,0.5)'}` }}>
              {isTIR ? 'TIR DETECTED' : (n1 < n2 ? 'BENDS TOWARDS N' : 'BENDS AWAY FROM N')}
            </span>
          </div>
        </div>
      </div>

      <svg width="100%" height="500" viewBox="0 0 800 500" style={{ background: '#000', display: 'block' }}>
        <defs>
          <linearGradient id="incidentGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffcc00" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffcc00" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="refractedGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00ffcc" stopOpacity="1" />
            <stop offset="100%" stopColor="#00ffcc" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="tirGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff0055" stopOpacity="1" />
            <stop offset="100%" stopColor="#ff0055" stopOpacity="0.1" />
          </linearGradient>
          <marker id="arrowIncident" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#ffcc00" />
          </marker>
          <marker id="arrowRefract" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#00ffcc" />
          </marker>
          <marker id="arrowTIR" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#ff0055" />
          </marker>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Mediums */}
        <rect x="0" y="0" width="800" height="250" fill={getMediumColor(n1)} />
        <rect x="0" y="250" width="800" height="250" fill={getMediumColor(n2)} />
        
        {/* Grid lines for precision look */}
        {gridLines}

        {/* Medium Labels & Speeds */}
        <text x="20" y="30" fill="rgba(255,255,255,0.7)" fontSize="18" fontWeight="bold" letterSpacing="1">{getMediumName(n1).toUpperCase()}</text>
        <text x="20" y="50" fill="#ffcc00" fontSize="12" fontFamily="monospace">Refractive Index (n₁) = {n1.toFixed(2)}</text>
        <text x="20" y="65" fill="#ffcc00" fontSize="12" fontFamily="monospace">Speed (v₁) ≈ {v1} × 10⁸ m/s</text>

        <text x="20" y="450" fill="rgba(255,255,255,0.7)" fontSize="18" fontWeight="bold" letterSpacing="1">{getMediumName(n2).toUpperCase()}</text>
        <text x="20" y="470" fill={isTIR ? '#ff0055' : '#00ffcc'} fontSize="12" fontFamily="monospace">Refractive Index (n₂) = {n2.toFixed(2)}</text>
        <text x="20" y="485" fill={isTIR ? '#ff0055' : '#00ffcc'} fontSize="12" fontFamily="monospace">Speed (v₂) ≈ {v2} × 10⁸ m/s</text>

        {/* Normal Line */}
        <line x1={cx} y1="30" x2={cx} y2="470" stroke="#fff" strokeDasharray="6,4" strokeWidth="2" opacity="0.4"/>
        <text x={cx + 10} y="40" fill="#fff" opacity="0.6" fontSize="12" fontWeight="bold" letterSpacing="1">NORMAL (N)</text>

        {/* Boundary Line */}
        <line x1="0" y1={cy} x2="800" y2={cy} stroke="#00ffcc" strokeWidth="4" opacity="0.6" filter="url(#glow)" />
        <text x="10" y={cy - 10} fill="#00ffcc" fontSize="12" letterSpacing="2" fontWeight="bold">INTERFACE BOUNDARY</text>

        {/* Origin / Point of Incidence */}
        <circle cx={cx} cy={cy} r="5" fill="#fff" filter="url(#glow)" />

        {/* Angles Arc */}
        {/* Angle 1 (Incidence) */}
        <path 
          d={`M ${cx} ${cy - 50} A 50 50 0 0 0 ${cx - 50 * Math.sin(angle1Rad)} ${cy - 50 * Math.cos(angle1Rad)}`} 
          fill="none" stroke="#ffcc00" strokeWidth="2" filter="url(#glow)"
        />
        <text x={cx - 35} y={cy - 60} fill="#ffcc00" fontSize="14" fontWeight="bold">i = {angle1.toFixed(1)}°</text>

        {/* Angle 2 (Refraction or TIR) */}
        {isTIR ? (
          <>
            <path 
              d={`M ${cx} ${cy - 50} A 50 50 0 0 1 ${cx + 50 * Math.sin(angle2Rad)} ${cy - 50 * Math.cos(angle2Rad)}`} 
              fill="none" stroke="#ff0055" strokeWidth="2" filter="url(#glow)"
            />
            <text x={cx + 15} y={cy - 60} fill="#ff0055" fontSize="14" fontWeight="bold">r = {angle2.toFixed(1)}°</text>
          </>
        ) : (
          <>
            <path 
              d={`M ${cx} ${cy + 50} A 50 50 0 0 1 ${cx + 50 * Math.sin(angle2Rad)} ${cy + 50 * Math.cos(angle2Rad)}`} 
              fill="none" stroke="#00ffcc" strokeWidth="2" filter="url(#glow)"
            />
            <text x={cx + 15} y={cy + 75} fill="#00ffcc" fontSize="14" fontWeight="bold">r = {angle2.toFixed(1)}°</text>
            
            {/* Extended un-refracted path to show bending amount */}
            <line x1={cx} y1={cy} x2={cx + rayLength * Math.sin(angle1Rad)} y2={cy + rayLength * Math.cos(angle1Rad)} stroke="rgba(255,255,255,0.3)" strokeDasharray="5,5" strokeWidth="2" />
          </>
        )}

        {/* Incident Ray */}
        <motion.line 
          x1={inX} y1={inY} x2={cx} y2={cy} 
          stroke="url(#incidentGradient)" strokeWidth="5" 
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        {/* Arrow for Incident Ray */}
        <line x1={inX} y1={inY} x2={inX + (cx - inX) / 2} y2={inY + (cy - inY) / 2} stroke="transparent" strokeWidth="4" markerEnd="url(#arrowIncident)" />

        {/* Refracted/Reflected Ray */}
        <motion.line 
          x1={cx} y1={cy} x2={outX} y2={outY} 
          stroke={isTIR ? "url(#tirGradient)" : "url(#refractedGradient)"} strokeWidth="5" 
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1.5, repeat: Infinity, ease: "linear" }}
        />
        {/* Arrow for Refracted/Reflected Ray */}
        <line x1={cx} y1={cy} x2={cx + (outX - cx) / 2} y2={cy + (outY - cy) / 2} stroke="transparent" strokeWidth="4" markerEnd={isTIR ? "url(#arrowTIR)" : "url(#arrowRefract)"} />
        
      </svg>
    </div>
  );
}
