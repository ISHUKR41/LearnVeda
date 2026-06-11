'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/LightChapter.module.css';

export default function ReflectionSimulation() {
  const [mirrorType, setMirrorType] = useState<'plane' | 'concave' | 'convex'>('concave');
  const [objectDist, setObjectDist] = useState(250); // Distance from mirror
  const [objectHeight, setObjectHeight] = useState(50);
  
  // Mirror properties
  const f = 100; // focal length
  const mirrorX = 600;
  
  const u = -objectDist;
  let focalLength = f;
  if (mirrorType === 'plane') focalLength = 999999;
  if (mirrorType === 'convex') focalLength = -f;

  let v = (focalLength * u) / (u - focalLength);
  let mag = -v / u;

  // Rays logic (SVG coordinates)
  const objX = mirrorX - objectDist;
  const axisY = 250; // principal axis
  const objY = axisY - objectHeight; // top of object

  const imgX = mirrorX + v;
  const imgY = axisY - (objectHeight * mag);

  // Add a nice grid background
  const gridLines = [];
  for (let i = 0; i <= 800; i += 40) {
    gridLines.push(
      <g key={`v${i}`}>
        <line x1={i} y1="0" x2={i} y2="500" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        {i % 80 === 0 && <text x={i+2} y="12" fill="rgba(255,255,255,0.2)" fontSize="9">{i - mirrorX}</text>}
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

  // Calculate incident angle at pole for Ray 2 (Concave)
  const angleAtPole = Math.abs(Math.atan((axisY - objY) / objectDist) * (180 / Math.PI)).toFixed(1);

  return (
    <div className={styles.simulationContainer} style={{ background: '#050505', border: '1px solid #333', borderRadius: '12px', overflow: 'hidden', position: 'relative', boxShadow: '0 10px 40px rgba(0,255,204,0.1)' }}>
      
      {/* Simulation Dashboard overlay */}
      <div style={{ position: 'absolute', top: 20, left: 20, background: 'rgba(5, 5, 5, 0.85)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(0, 255, 204, 0.4)', zIndex: 10, backdropFilter: 'blur(12px)', color: '#fff', width: '320px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#00ffcc', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', textShadow: '0 0 10px rgba(0,255,204,0.5)' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#00ffcc', borderRadius: '50%', boxShadow: '0 0 8px #00ffcc' }}></span>
          Advanced Ray Tracing Lab
        </h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '0.75rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>Mirror Type</label>
          <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
            {['plane', 'concave', 'convex'].map(type => (
              <button 
                key={type}
                onClick={() => setMirrorType(type as any)}
                style={{
                  flex: 1, padding: '6px 0', fontSize: '0.8rem', cursor: 'pointer',
                  background: mirrorType === type ? 'rgba(0, 255, 204, 0.15)' : 'transparent',
                  border: `1px solid ${mirrorType === type ? '#00ffcc' : '#333'}`,
                  color: mirrorType === type ? '#00ffcc' : '#888',
                  borderRadius: '4px', textTransform: 'capitalize', transition: 'all 0.3s',
                  boxShadow: mirrorType === type ? '0 0 8px rgba(0,255,204,0.2)' : 'none'
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
          <input type="range" min="30" max="500" value={objectDist} onChange={(e) => setObjectDist(Number(e.target.value))} style={{ width: '100%', accentColor: '#00ffcc' }}/>
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
            <span style={{ fontWeight: 'bold', fontFamily: 'monospace', color: '#fff' }}>{mirrorType === 'plane' ? -u : v.toFixed(1)} cm</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
            <span style={{ color: '#aaa' }}>Magnification (m):</span>
            <span style={{ fontWeight: 'bold', fontFamily: 'monospace', color: '#fff' }}>{mirrorType === 'plane' ? '1.00' : mag.toFixed(2)}x</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#aaa' }}>Nature:</span>
            <span style={{ fontWeight: 'bold', color: v > 0 || mirrorType === 'plane' ? '#ffcc00' : '#00ffcc', textShadow: `0 0 5px ${v > 0 || mirrorType === 'plane' ? '#ffcc00' : '#00ffcc'}` }}>
              {v > 0 || mirrorType === 'plane' ? 'VIRTUAL & ERECT' : 'REAL & INVERTED'}
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
          <linearGradient id="reflectedRay" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff00aa" stopOpacity="1" />
            <stop offset="100%" stopColor="#ff00aa" stopOpacity="0.1" />
          </linearGradient>
          <marker id="arrowHead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#00ffcc" />
          </marker>
          <marker id="arrowHeadReflect" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#ff00aa" />
          </marker>
          <pattern id="hatch" patternUnits="userSpaceOnUse" width="4" height="4">
            <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="#444" strokeWidth="1" />
          </pattern>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background Grid */}
        {gridLines}

        {/* Dimensional/Measurement Annotations */}
        {mirrorType !== 'plane' && (
          <g opacity="0.6">
            {/* Focal Length Dimension */}
            <line x1={mirrorX} y1={axisY + 40} x2={mirrorX - focalLength} y2={axisY + 40} stroke="#00ffcc" strokeWidth="1" strokeDasharray="2,2" />
            <line x1={mirrorX} y1={axisY + 35} x2={mirrorX} y2={axisY + 45} stroke="#00ffcc" strokeWidth="1" />
            <line x1={mirrorX - focalLength} y1={axisY + 35} x2={mirrorX - focalLength} y2={axisY + 45} stroke="#00ffcc" strokeWidth="1" />
            <text x={mirrorX - focalLength/2} y={axisY + 52} fill="#00ffcc" fontSize="10" textAnchor="middle">f = {focalLength}cm</text>
          </g>
        )}

        {/* Principal Axis */}
        <line x1="0" y1={axisY} x2="800" y2={axisY} stroke="#555" strokeWidth="2" strokeDasharray="10,5" />
        <text x="780" y={axisY - 8} fill="#888" fontSize="11" textAnchor="end" letterSpacing="1">PRINCIPAL AXIS</text>
        
        {/* Pole Point */}
        <circle cx={mirrorX} cy={axisY} r="4" fill="#fff" filter="url(#glow)" />
        <text x={mirrorX + 10} y={axisY + 15} fill="#fff" fontSize="12" fontWeight="bold">P (0,0)</text>

        {/* Focal point & Center of curvature */}
        {mirrorType !== 'plane' && (
          <>
            <circle cx={mirrorX - focalLength} cy={axisY} r="5" fill="#00ffcc" filter="url(#glow)" />
            <text x={mirrorX - focalLength} y={axisY - 10} fill="#00ffcc" fontSize="12" fontWeight="bold" textAnchor="middle">F</text>
            
            <circle cx={mirrorX - 2 * focalLength} cy={axisY} r="5" fill="#ff00aa" filter="url(#glow)" />
            <text x={mirrorX - 2 * focalLength} y={axisY - 10} fill="#ff00aa" fontSize="12" fontWeight="bold" textAnchor="middle">C</text>
          </>
        )}

        {/* Mirror */}
        {mirrorType === 'plane' && (
          <>
            <line x1={mirrorX} y1="50" x2={mirrorX} y2="450" stroke="#fff" strokeWidth="4" filter="url(#glow)" />
            <rect x={mirrorX} y="50" width="12" height="400" fill="url(#hatch)" />
          </>
        )}
        {mirrorType === 'concave' && (
          <>
            <path d={`M ${mirrorX + 30} 50 Q ${mirrorX - 50} 250 ${mirrorX + 30} 450`} fill="none" stroke="#fff" strokeWidth="4" filter="url(#glow)" />
            <path d={`M ${mirrorX + 30} 50 Q ${mirrorX - 50} 250 ${mirrorX + 30} 450`} fill="none" stroke="url(#hatch)" strokeWidth="12" transform="translate(4,0)" />
          </>
        )}
        {mirrorType === 'convex' && (
          <>
            <path d={`M ${mirrorX - 30} 50 Q ${mirrorX + 50} 250 ${mirrorX - 30} 450`} fill="none" stroke="#fff" strokeWidth="4" filter="url(#glow)" />
            <path d={`M ${mirrorX - 30} 50 Q ${mirrorX + 50} 250 ${mirrorX - 30} 450`} fill="none" stroke="url(#hatch)" strokeWidth="12" transform="translate(4,0)" />
          </>
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
        {(v > 0 || mirrorType === 'plane') ? ( // Virtual Image (dashed)
          <g style={{ opacity: 0.9 }}>
            <line x1={mirrorType === 'plane' ? mirrorX + objectDist : imgX} y1={axisY} x2={mirrorType === 'plane' ? mirrorX + objectDist : imgX} y2={mirrorType === 'plane' ? objY : imgY} stroke="#ffcc00" strokeWidth="4" strokeDasharray="8,6" />
            {mirrorType !== 'plane' ? (
               <polygon points={`${imgX},${imgY-8} ${imgX-8},${imgY+8} ${imgX+8},${imgY+8}`} fill="#ffcc00" filter="url(#glow)" />
            ) : (
               <polygon points={`${mirrorX + objectDist},${objY-8} ${mirrorX + objectDist - 8},${objY+8} ${mirrorX + objectDist + 8},${objY+8}`} fill="#ffcc00" filter="url(#glow)" />
            )}
            <text x={mirrorType === 'plane' ? mirrorX + objectDist : imgX} y={mirrorType === 'plane' ? objY - 15 : imgY - 15} fill="#ffcc00" fontSize="12" fontWeight="bold" textAnchor="middle">A' (Virtual)</text>
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

        {/* Dynamic Angle text for Pole Ray */}
        {mirrorType === 'concave' && (
          <>
            <path d={`M ${mirrorX - 30} ${axisY} A 30 30 0 0 0 ${mirrorX - 25} ${axisY - 10}`} fill="none" stroke="#00ffcc" strokeWidth="1" />
            <text x={mirrorX - 45} y={axisY - 15} fill="#00ffcc" fontSize="10">i={angleAtPole}°</text>
            
            <path d={`M ${mirrorX - 30} ${axisY} A 30 30 0 0 1 ${mirrorX - 25} ${axisY + 10}`} fill="none" stroke="#ff00aa" strokeWidth="1" />
            <text x={mirrorX - 45} y={axisY + 22} fill="#ff00aa" fontSize="10">r={angleAtPole}°</text>
          </>
        )}

        {/* Ray 1: Parallel to principal axis */}
        <motion.line 
          x1={objX} y1={objY} x2={mirrorType === 'plane' ? mirrorX : mirrorType === 'concave' ? mirrorX - 12 : mirrorX + 12} y2={objY} 
          stroke="url(#incidentRay)" strokeWidth="2.5" markerEnd="url(#arrowHead)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Ray 1 Reflection & Extension */}
        {mirrorType === 'plane' && (
           <>
             <motion.line x1={mirrorX} y1={objY} x2={mirrorX - 800} y2={objY - 800} stroke="#ff00aa" strokeWidth="2.5" markerEnd="url(#arrowHeadReflect)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1.5, repeat: Infinity, ease: "linear" }}/>
             <line x1={mirrorX} y1={objY} x2={mirrorX + 800} y2={objY} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="5,5" />
           </>
        )}
        {mirrorType === 'concave' && (
           <>
             <motion.line 
               x1={mirrorX - 12} y1={objY} 
               x2={mirrorX - 12 - 800} 
               y2={objY + ((axisY - objY)/(mirrorX - 12 - (mirrorX - f))) * 800} 
               stroke="#ff00aa" strokeWidth="2.5" markerEnd="url(#arrowHeadReflect)"
               initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1.5, repeat: Infinity, ease: "linear" }}
             />
             {v > 0 && <line x1={mirrorX - 12} y1={objY} x2={mirrorX + 800} y2={objY - ((axisY - objY)/(mirrorX - 12 - (mirrorX - f))) * 800} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="5,5" />}
           </>
        )}
        {mirrorType === 'convex' && (
           <>
             <motion.line 
               x1={mirrorX + 12} y1={objY} 
               x2={mirrorX + 12 - 800} 
               y2={objY - ((axisY - objY)/(mirrorX + 12 - (mirrorX - f))) * 800} 
               stroke="#ff00aa" strokeWidth="2.5" markerEnd="url(#arrowHeadReflect)"
               initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1.5, repeat: Infinity, ease: "linear" }}
             />
             <line x1={mirrorX + 12} y1={objY} x2={mirrorX + 12 + 800} y2={objY + ((axisY - objY)/(mirrorX + 12 - (mirrorX - f))) * 800} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="5,5" />
           </>
        )}

        {/* Ray 2: Passing through Pole or Center of Curvature */}
        {mirrorType === 'concave' && (
          <>
            <motion.line 
              x1={objX} y1={objY} x2={mirrorX} y2={axisY} 
              stroke="url(#incidentRay)" strokeWidth="2.5" markerEnd="url(#arrowHead)"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <motion.line 
              x1={mirrorX} y1={axisY} x2={mirrorX - 800} y2={axisY + (axisY - objY) * (800 / objectDist)} 
              stroke="#ff00aa" strokeWidth="2.5" markerEnd="url(#arrowHeadReflect)"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1.5, repeat: Infinity, ease: "linear" }}
            />
            {v > 0 && <line x1={mirrorX} y1={axisY} x2={mirrorX + 800} y2={axisY - (axisY - objY) * (800 / objectDist)} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="5,5" />}
          </>
        )}
        
      </svg>
    </div>
  );
}
