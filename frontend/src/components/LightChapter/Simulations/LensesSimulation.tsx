'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/LightChapter.module.css';

export default function LensesSimulation() {
  const [lensType, setLensType] = useState<'convex' | 'concave'>('convex');
  const [objectDist, setObjectDist] = useState(250); // Distance from lens
  const [objectHeight, setObjectHeight] = useState(50);
  
  // Lens properties
  const f = 100; // focal length
  const lensX = 400; // Centered
  
  const u = -objectDist;
  let focalLength = lensType === 'convex' ? f : -f;

  // Lens Formula: 1/v - 1/u = 1/f => 1/v = 1/f + 1/u
  // v = (f * u) / (u + f)
  let v = (focalLength * u) / (u + focalLength);
  
  // Magnification: m = v / u
  let mag = v / u;

  // Rays logic (SVG coordinates)
  const objX = lensX - objectDist;
  const axisY = 250; // principal axis
  const objY = axisY - objectHeight; // top of object

  const imgX = lensX + v;
  const imgY = axisY - (objectHeight * mag);

  // Add a nice grid background
  const gridLines = [];
  for (let i = 0; i <= 800; i += 40) {
    gridLines.push(
      <g key={`v${i}`}>
        <line x1={i} y1="0" x2={i} y2="500" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        {i % 80 === 0 && <text x={i+2} y="12" fill="rgba(255,255,255,0.2)" fontSize="9">{i - lensX}</text>}
      </g>
    );
  }
  for (let i = 0; i <= 500; i += 40) {
    gridLines.push(
      <g key={`h${i}`}>
        <line x1="0" y1={i} x2="800" y2={i} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        {i % 80 === 0 && <text x="2" y={i-2} fill="rgba(255,255,255,0.2)" fontSize="9">{axisY - i}</text>}
      </g>
    );
  }

  return (
    <div className={styles.simulationContainer} style={{ background: '#050505', border: '1px solid #333', borderRadius: '12px', overflow: 'hidden', position: 'relative', boxShadow: '0 10px 40px rgba(0,255,204,0.1)' }}>
      
      {/* Simulation Dashboard overlay */}
      <div style={{ position: 'absolute', top: 20, left: 20, background: 'rgba(5, 5, 5, 0.85)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(0, 255, 204, 0.4)', zIndex: 10, backdropFilter: 'blur(12px)', color: '#fff', width: '320px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#00ffcc', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', textShadow: '0 0 10px rgba(0,255,204,0.5)' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#00ffcc', borderRadius: '50%', boxShadow: '0 0 8px #00ffcc' }}></span>
          Spherical Lenses Lab
        </h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '0.75rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>Lens Type</label>
          <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
            {['convex', 'concave'].map(type => (
              <button 
                key={type}
                onClick={() => setLensType(type as any)}
                style={{
                  flex: 1, padding: '6px 0', fontSize: '0.8rem', cursor: 'pointer',
                  background: lensType === type ? 'rgba(0, 255, 204, 0.15)' : 'transparent',
                  border: `1px solid ${lensType === type ? '#00ffcc' : '#333'}`,
                  color: lensType === type ? '#00ffcc' : '#888',
                  borderRadius: '4px', textTransform: 'capitalize', transition: 'all 0.3s',
                  boxShadow: lensType === type ? '0 0 8px rgba(0,255,204,0.2)' : 'none'
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '0.8rem', color: '#aaa', display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>Object Distance (u)</span>
            <span style={{ color: '#00ffcc', fontFamily: 'monospace', fontSize: '0.9rem' }}>{-u} cm</span>
          </label>
          <input type="range" min="30" max="380" value={objectDist} onChange={(e) => setObjectDist(Number(e.target.value))} style={{ width: '100%', accentColor: '#00ffcc' }}/>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '0.8rem', color: '#aaa', display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>Object Height (h)</span>
            <span style={{ color: '#00ffcc', fontFamily: 'monospace', fontSize: '0.9rem' }}>{objectHeight} cm</span>
          </label>
          <input type="range" min="10" max="150" value={objectHeight} onChange={(e) => setObjectHeight(Number(e.target.value))} style={{ width: '100%', accentColor: '#00ffcc' }}/>
        </div>

        <div style={{ background: 'rgba(0,255,204,0.05)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #00ffcc', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
            <span style={{ color: '#aaa' }}>Image Distance (v):</span>
            <span style={{ fontWeight: 'bold', fontFamily: 'monospace', color: '#fff' }}>{v.toFixed(1)} cm</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
            <span style={{ color: '#aaa' }}>Magnification (m):</span>
            <span style={{ fontWeight: 'bold', fontFamily: 'monospace', color: '#fff' }}>{mag.toFixed(2)}x</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#aaa' }}>Nature:</span>
            <span style={{ fontWeight: 'bold', color: v > 0 ? '#00ffcc' : '#ffcc00', textShadow: `0 0 5px ${v > 0 ? '#00ffcc' : '#ffcc00'}` }}>
              {v > 0 ? 'REAL & INVERTED' : 'VIRTUAL & ERECT'}
            </span>
          </div>
        </div>
      </div>

      <svg width="100%" height="500" viewBox="0 0 800 500" style={{ background: '#050505', display: 'block' }}>
        <defs>
          <linearGradient id="incidentRay" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00ffcc" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#00ffcc" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="refractedRay" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff00aa" stopOpacity="1" />
            <stop offset="100%" stopColor="#ff00aa" stopOpacity="0.1" />
          </linearGradient>
          <marker id="arrowHead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#00ffcc" />
          </marker>
          <marker id="arrowHeadRefract" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#ff00aa" />
          </marker>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background Grid */}
        {gridLines}

        {/* Dimensional/Measurement Annotations for Focal Lengths */}
        <g opacity="0.6">
          <line x1={lensX} y1={axisY + 40} x2={lensX - f} y2={axisY + 40} stroke="#00ffcc" strokeWidth="1" strokeDasharray="2,2" />
          <line x1={lensX} y1={axisY + 35} x2={lensX} y2={axisY + 45} stroke="#00ffcc" strokeWidth="1" />
          <line x1={lensX - f} y1={axisY + 35} x2={lensX - f} y2={axisY + 45} stroke="#00ffcc" strokeWidth="1" />
          <text x={lensX - f/2} y={axisY + 52} fill="#00ffcc" fontSize="10" textAnchor="middle">f₁ = -{f}cm</text>
          
          <line x1={lensX} y1={axisY + 40} x2={lensX + f} y2={axisY + 40} stroke="#ff00aa" strokeWidth="1" strokeDasharray="2,2" />
          <line x1={lensX + f} y1={axisY + 35} x2={lensX + f} y2={axisY + 45} stroke="#ff00aa" strokeWidth="1" />
          <text x={lensX + f/2} y={axisY + 52} fill="#ff00aa" fontSize="10" textAnchor="middle">f₂ = +{f}cm</text>
        </g>

        {/* Principal Axis */}
        <line x1="0" y1={axisY} x2="800" y2={axisY} stroke="#555" strokeWidth="2" strokeDasharray="10,5" />
        <text x="780" y={axisY - 8} fill="#888" fontSize="11" textAnchor="end" letterSpacing="1">PRINCIPAL AXIS</text>
        
        {/* Optical Centre */}
        <circle cx={lensX} cy={axisY} r="4" fill="#fff" filter="url(#glow)" />
        <text x={lensX + 10} y={axisY - 15} fill="#fff" fontSize="12" fontWeight="bold">O (0,0)</text>

        {/* Focal points (F1, F2, 2F1, 2F2) */}
        <circle cx={lensX - f} cy={axisY} r="5" fill="#00ffcc" filter="url(#glow)" />
        <text x={lensX - f} y={axisY - 10} fill="#00ffcc" fontSize="12" fontWeight="bold" textAnchor="middle">F₁</text>
        <circle cx={lensX - 2 * f} cy={axisY} r="5" fill="#ff00aa" filter="url(#glow)" />
        <text x={lensX - 2 * f} y={axisY - 10} fill="#ff00aa" fontSize="12" fontWeight="bold" textAnchor="middle">2F₁</text>

        <circle cx={lensX + f} cy={axisY} r="5" fill="#00ffcc" filter="url(#glow)" />
        <text x={lensX + f} y={axisY - 10} fill="#00ffcc" fontSize="12" fontWeight="bold" textAnchor="middle">F₂</text>
        <circle cx={lensX + 2 * f} cy={axisY} r="5" fill="#ff00aa" filter="url(#glow)" />
        <text x={lensX + 2 * f} y={axisY - 10} fill="#ff00aa" fontSize="12" fontWeight="bold" textAnchor="middle">2F₂</text>

        {/* Lens */}
        {lensType === 'convex' && (
          <path d={`M ${lensX} 50 Q ${lensX + 30} 250 ${lensX} 450 Q ${lensX - 30} 250 ${lensX} 50`} fill="rgba(0,255,204,0.15)" stroke="#00ffcc" strokeWidth="3" filter="url(#glow)" />
        )}
        {lensType === 'concave' && (
          <path d={`M ${lensX - 15} 50 Q ${lensX + 10} 250 ${lensX - 15} 450 L ${lensX + 15} 450 Q ${lensX - 10} 250 ${lensX + 15} 50 Z`} fill="rgba(0,255,204,0.15)" stroke="#00ffcc" strokeWidth="3" filter="url(#glow)" />
        )}

        {/* Real Object */}
        <g filter="url(#glow)">
          <line x1={objX} y1={axisY} x2={objX} y2={objY} stroke="#00ffcc" strokeWidth="4" />
          <polygon points={`${objX},${objY-8} ${objX-8},${objY+8} ${objX+8},${objY+8}`} fill="#00ffcc" />
          <text x={objX} y={objY - 15} fill="#00ffcc" fontSize="12" fontWeight="bold" textAnchor="middle">A</text>
          <text x={objX} y={axisY + 18} fill="#00ffcc" fontSize="12" fontWeight="bold" textAnchor="middle">B</text>
          <text x={objX - 15} y={axisY - objectHeight/2} fill="#00ffcc" fontSize="10" transform={`rotate(-90 ${objX - 15} ${axisY - objectHeight/2})`} textAnchor="middle">h = {objectHeight}</text>
        </g>

        {/* Image */}
        {v < 0 ? ( // Virtual Image (dashed)
          <g style={{ opacity: 0.9 }}>
            <line x1={imgX} y1={axisY} x2={imgX} y2={imgY} stroke="#ffcc00" strokeWidth="4" strokeDasharray="8,6" />
            <polygon points={`${imgX},${imgY-8} ${imgX-8},${imgY+8} ${imgX+8},${imgY+8}`} fill="#ffcc00" filter="url(#glow)" />
            <text x={imgX} y={imgY - 15} fill="#ffcc00" fontSize="12" fontWeight="bold" textAnchor="middle">A' (Virtual)</text>
          </g>
        ) : ( // Real Image
          <g filter="url(#glow)">
            <line x1={imgX} y1={axisY} x2={imgX} y2={imgY} stroke="#ffcc00" strokeWidth="4" />
            <polygon points={`${imgX},${imgY+8} ${imgX-8},${imgY-8} ${imgX+8},${imgY-8}`} fill="#ffcc00" />
            <text x={imgX} y={imgY + 20} fill="#ffcc00" fontSize="12" fontWeight="bold" textAnchor="middle">A' (Real)</text>
            <text x={imgX} y={axisY - 10} fill="#ffcc00" fontSize="12" fontWeight="bold" textAnchor="middle">B'</text>
            <text x={imgX + 15} y={axisY - (imgY - axisY)/2} fill="#ffcc00" fontSize="10" transform={`rotate(90 ${imgX + 15} ${axisY - (imgY - axisY)/2})`} textAnchor="middle">h' = {Math.abs(Math.round(objectHeight * mag))}</text>
          </g>
        )}

        {/* Ray 1: Parallel to principal axis */}
        <motion.line 
          x1={objX} y1={objY} x2={lensX} y2={objY} 
          stroke="url(#incidentRay)" strokeWidth="2.5" markerEnd="url(#arrowHead)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Ray 1 Refraction & Extension */}
        {lensType === 'convex' && (
           <>
             {/* Refracts through F2 */}
             <motion.line 
               x1={lensX} y1={objY} 
               x2={lensX + 400} 
               y2={objY + ((axisY - objY)/f) * 400} 
               stroke="#ff00aa" strokeWidth="2.5" markerEnd="url(#arrowHeadRefract)"
               initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1.5, repeat: Infinity, ease: "linear" }}
             />
             {v < 0 && <line x1={lensX} y1={objY} x2={lensX - 400} y2={objY - ((axisY - objY)/f) * 400} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="5,5" />}
           </>
        )}
        {lensType === 'concave' && (
           <>
             {/* Diverges from F1 */}
             <motion.line 
               x1={lensX} y1={objY} 
               x2={lensX + 400} 
               y2={objY - ((axisY - objY)/f) * 400} 
               stroke="#ff00aa" strokeWidth="2.5" markerEnd="url(#arrowHeadRefract)"
               initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1.5, repeat: Infinity, ease: "linear" }}
             />
             <line x1={lensX} y1={objY} x2={lensX - 400} y2={objY + ((axisY - objY)/f) * 400} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="5,5" />
           </>
        )}

        {/* Ray 2: Passing through Optical Centre (O) */}
        <motion.line 
          x1={objX} y1={objY} x2={lensX} y2={axisY} 
          stroke="url(#incidentRay)" strokeWidth="2.5" markerEnd="url(#arrowHead)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.line 
          x1={lensX} y1={axisY} x2={lensX + 400} y2={axisY + (axisY - objY) * (400 / objectDist)} 
          stroke="#ff00aa" strokeWidth="2.5" markerEnd="url(#arrowHeadRefract)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1.5, repeat: Infinity, ease: "linear" }}
        />
        {v < 0 && <line x1={lensX} y1={axisY} x2={lensX - 400} y2={axisY - (axisY - objY) * (400 / objectDist)} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="5,5" />}
        
      </svg>
    </div>
  );
}
