/**
 * FILE: TopicDiagrams.tsx
 * LOCATION: src/components/chapter/light/TopicDiagrams.tsx
 *
 * PURPOSE: Professional, animated SVG diagram illustrations for all 9 topics
 *          in the "Light – Reflection and Refraction" chapter (Class 10 Science).
 *
 *          Each diagram is a self-contained React component with:
 *            • Inline SVG (no external image dependencies)
 *            • CSS keyframe animations (rays, arrows, glows, prism colors)
 *            • Labeled parts with mathematical notation
 *            • Responsive viewBox (scales with container)
 *
 * TOPICS COVERED:
 *   1. topic1  — Laws of Reflection (plane mirror, incident/reflected ray, ∠i = ∠r)
 *   2. topic2  — Spherical Mirrors (concave + convex, P C F labels, ray diagram)
 *   3. topic3  — Mirror Formula & Magnification (sign convention, formula)
 *   4. topic4  — Refraction & Snell's Law (light bending at interface)
 *   5. topic5  — Image Formation by Lenses (convex lens ray diagram)
 *   6. topic6  — Lens Formula & Power (formula notation, diopter)
 *   7. topic7  — Total Internal Reflection (critical angle, optical fiber)
 *   8. topic8  — Dispersion & Human Eye (prism rainbow, eye anatomy)
 *   9. topic9  — Advanced Numericals (formula table visual)
 *
 * USED BY:
 *   • DeepResearchChapterClient.tsx  — Learn tab, inserted after content
 *   • TopicStudyClient.tsx           — hero section / learn tab
 *
 * DEPENDENCIES: None (all SVGs are inline, no external libs)
 * COMMENTS: Detailed English comments on every section
 * LAST UPDATED: 2026-06-09
 */

"use client";

import React from "react";
import styles from "./TopicDiagrams.module.css";

/* ──────────────────────────────────────────────────────────────
 * DIAGRAM COMPONENT MAP
 * Maps topic ID strings to their diagram React component.
 * Used by getDiagramForTopic() exported at bottom.
 * ────────────────────────────────────────────────────────────── */

/* ═══════════════════════════════════════════════════════════════
 * DIAGRAM 1: Introduction to Light & Laws of Reflection
 * Shows: Plane mirror, incident ray, normal, reflected ray,
 *        angles ∠i and ∠r with animated light beam.
 * ═══════════════════════════════════════════════════════════════ */
export function Diagram1LawsOfReflection() {
  return (
    <div className={styles.diagramWrapper} aria-label="Laws of Reflection diagram">
      <div className={styles.diagramTitle}>Laws of Reflection — Ray Diagram</div>
      <svg
        viewBox="0 0 600 360"
        className={styles.svg}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Incident ray hitting a plane mirror, reflecting at equal angle"
      >
        {/* ── Definitions: gradients and glow filters ── */}
        <defs>
          {/* Mirror gradient — silver look */}
          <linearGradient id="mirrorGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="50%" stopColor="#4fc3f7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1e3a5f" />
          </linearGradient>
          {/* Ray glow filter */}
          <filter id="rayGlow1">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Angle arc fill */}
          <radialGradient id="arcGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Background: dark physics lab feel ── */}
        <rect width="600" height="360" fill="#070d1a" rx="16" />

        {/* ── Grid lines (faint, like graph paper) ── */}
        {[60, 120, 180, 240, 300, 360, 420, 480, 540].map(x => (
          <line key={`gx${x}`} x1={x} y1="0" x2={x} y2="360" stroke="#0f2040" strokeWidth="1" />
        ))}
        {[60, 120, 180, 240, 300].map(y => (
          <line key={`gy${y}`} x1="0" y1={y} x2="600" y2={y} stroke="#0f2040" strokeWidth="1" />
        ))}

        {/* ── PLANE MIRROR — horizontal bar at y=240 ── */}
        <rect x="80" y="238" width="440" height="10" fill="url(#mirrorGrad1)" rx="3" />
        {/* Mirror hatching (traditional physics style) */}
        {Array.from({ length: 22 }).map((_, i) => (
          <line
            key={`hatch${i}`}
            x1={90 + i * 20} y1="248"
            x2={82 + i * 20} y2="268"
            stroke="#1e3a5f" strokeWidth="2"
          />
        ))}
        <text x="300" y="282" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="Inter, sans-serif">
          Plane Mirror (Reflecting Surface)
        </text>

        {/* ── NORMAL LINE — dashed vertical at x=300, y=140 to y=240 ── */}
        <line
          x1="300" y1="110" x2="300" y2="238"
          stroke="#38bdf8" strokeWidth="1.5"
          strokeDasharray="6,4"
          opacity="0.9"
        />
        {/* Normal label */}
        <text x="312" y="130" fill="#38bdf8" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="600">
          Normal
        </text>

        {/* ── INCIDENT RAY — animated light beam from top-left ── */}
        {/* Static ray path */}
        <line
          x1="110" y1="110"
          x2="300" y2="238"
          stroke="#fbbf24"
          strokeWidth="2.5"
          filter="url(#rayGlow1)"
          className={styles.animatedRay}
          strokeLinecap="round"
        />
        {/* Arrow at end (point of incidence) */}
        <polygon
          points="296,232 304,244 292,246"
          fill="#fbbf24"
          opacity="0.9"
        />
        <text x="140" y="135" fill="#fbbf24" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="600">
          Incident Ray
        </text>
        {/* Arrowhead along incident ray */}
        <text x="185" y="168" fill="#fbbf24" fontSize="16">→</text>

        {/* ── REFLECTED RAY — animated, from mirror to top-right ── */}
        <line
          x1="300" y1="238"
          x2="490" y2="110"
          stroke="#4ade80"
          strokeWidth="2.5"
          filter="url(#rayGlow1)"
          className={styles.animatedRayDelayed}
          strokeLinecap="round"
        />
        <text x="410" y="135" fill="#4ade80" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="600">
          Reflected Ray
        </text>
        <text x="390" y="168" fill="#4ade80" fontSize="16">→</text>

        {/* ── ANGLE OF INCIDENCE arc ── */}
        <path
          d="M 270,215 A 35,35 0 0,1 300,200"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="2"
          strokeDasharray="4,2"
          opacity="0.8"
        />
        <text x="242" y="210" fill="#fbbf24" fontSize="13" fontFamily="Inter, sans-serif" fontStyle="italic">
          ∠i
        </text>

        {/* ── ANGLE OF REFLECTION arc ── */}
        <path
          d="M 300,200 A 35,35 0 0,1 330,215"
          fill="none"
          stroke="#4ade80"
          strokeWidth="2"
          strokeDasharray="4,2"
          opacity="0.8"
        />
        <text x="334" y="210" fill="#4ade80" fontSize="13" fontFamily="Inter, sans-serif" fontStyle="italic">
          ∠r
        </text>

        {/* ── POINT OF INCIDENCE dot ── */}
        <circle cx="300" cy="238" r="5" fill="#f8fafc" className={styles.pulseDot} />
        <text x="308" y="236" fill="#f8fafc" fontSize="12" fontFamily="Inter, sans-serif">
          Point of Incidence
        </text>

        {/* ── KEY LAW: ∠i = ∠r banner ── */}
        <rect x="195" y="305" width="210" height="36" fill="rgba(251,191,36,0.1)" rx="8"
          stroke="rgba(251,191,36,0.3)" strokeWidth="1" />
        <text x="300" y="328" textAnchor="middle" fill="#fbbf24" fontSize="16" fontFamily="Inter, sans-serif" fontWeight="700">
          ∠i = ∠r  (First Law of Reflection)
        </text>

        {/* ── Glowing light source dot (top-left) ── */}
        <circle cx="110" cy="110" r="8" fill="#fbbf24" className={styles.glowDot} />
        <text x="122" y="106" fill="#fbbf24" fontSize="11" fontFamily="Inter, sans-serif">Light Source</text>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * DIAGRAM 2: Spherical Mirrors — Concave & Convex
 * Shows: Both mirror types side by side with P, C, F labels
 *        and principal axis. Animated converging/diverging rays.
 * ═══════════════════════════════════════════════════════════════ */
export function Diagram2SphericalMirrors() {
  return (
    <div className={styles.diagramWrapper} aria-label="Spherical Mirrors diagram">
      <div className={styles.diagramTitle}>Concave vs Convex Mirror — Key Parts</div>
      <svg viewBox="0 0 600 380" className={styles.svg} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow2">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="concaveMirrorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="convexMirrorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7e22ce" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width="600" height="380" fill="#070d1a" rx="16" />

        {/* ── DIVIDER LINE ── */}
        <line x1="300" y1="20" x2="300" y2="360" stroke="#1e2d4a" strokeWidth="1.5" strokeDasharray="6,4" />

        {/* ──────────── LEFT SIDE: CONCAVE MIRROR ──────────── */}
        <text x="150" y="35" textAnchor="middle" fill="#60a5fa" fontSize="14" fontFamily="Inter, sans-serif" fontWeight="700">
          CONCAVE MIRROR
        </text>
        <text x="150" y="52" textAnchor="middle" fill="#60a5fa" fontSize="11" fontFamily="Inter, sans-serif">
          (Converging Mirror)
        </text>

        {/* Concave mirror curve — arc curving inward toward right */}
        <path
          d="M 60,100 Q 130,190 60,280"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Mirror backing hatching */}
        {[110, 130, 150, 170, 190, 210, 230, 250, 270].map((y, i) => (
          <line key={`ch${i}`} x1="60" y1={y} x2="45" y2={y + 15} stroke="#1e3a8a" strokeWidth="2" />
        ))}

        {/* Principal axis — horizontal line */}
        <line x1="60" y1="190" x2="290" y2="190" stroke="#64748b" strokeWidth="1" strokeDasharray="5,3" />
        <text x="292" y="194" fill="#64748b" fontSize="10" fontFamily="Inter, sans-serif">axis</text>

        {/* P — Pole */}
        <circle cx="60" cy="190" r="4" fill="#f8fafc" />
        <text x="55" y="210" fill="#f8fafc" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="700">P</text>

        {/* F — Focal point at ~130 */}
        <circle cx="130" cy="190" r="5" fill="#fbbf24" className={styles.pulseDot} />
        <text x="127" y="210" fill="#fbbf24" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="700">F</text>
        <line x1="130" y1="190" x2="130" y2="180" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" />

        {/* C — Centre of curvature at ~200 */}
        <circle cx="200" cy="190" r="5" fill="#a855f7" className={styles.pulseDot} />
        <text x="197" y="210" fill="#a855f7" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="700">C</text>
        <line x1="200" y1="190" x2="200" y2="180" stroke="#a855f7" strokeWidth="1" strokeDasharray="3,2" />

        {/* Converging rays — 3 parallel rays hitting concave mirror */}
        {[130, 150, 170].map((yStart, i) => {
          const yHit = 110 + i * 40; // where ray hits the mirror curve
          const xHit = 62 + (yHit - 100) * (yHit - 280 < 0 ? 0.3 : -0.3); // approximate curve
          return (
            <g key={`cr${i}`}>
              <line x1="240" y1={yStart} x2="70" y2={yStart} stroke="#60a5fa" strokeWidth="1.5"
                strokeDasharray={i === 1 ? "none" : "none"}
                className={styles.animatedRay} />
              <line x1="70" y1={yStart} x2="130" y2="190" stroke="#60a5fa" strokeWidth="1.5"
                className={styles.animatedRayDelayed} opacity="0.8" />
            </g>
          );
        })}

        {/* f and R labels */}
        <line x1="60" y1="230" x2="130" y2="230" stroke="#fbbf24" strokeWidth="1.5" markerEnd="url(#arr)" />
        <text x="90" y="245" textAnchor="middle" fill="#fbbf24" fontSize="11" fontFamily="Inter, sans-serif">f</text>
        <line x1="60" y1="250" x2="200" y2="250" stroke="#a855f7" strokeWidth="1.5" />
        <text x="130" y="265" textAnchor="middle" fill="#a855f7" fontSize="11" fontFamily="Inter, sans-serif">R = 2f</text>

        {/* Uses label */}
        <rect x="65" y="290" width="200" height="48" fill="rgba(59,130,246,0.08)" rx="6" stroke="rgba(59,130,246,0.2)" strokeWidth="1" />
        <text x="165" y="308" textAnchor="middle" fill="#93c5fd" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="600">Uses: Torch, Shaving mirror,</text>
        <text x="165" y="324" textAnchor="middle" fill="#93c5fd" fontSize="11" fontFamily="Inter, sans-serif">Headlights, Solar cooker</text>
        <text x="165" y="340" textAnchor="middle" fill="#60a5fa" fontSize="10" fontFamily="Inter, sans-serif" fontStyle="italic">⚡ Converging (Real focus)</text>

        {/* ──────────── RIGHT SIDE: CONVEX MIRROR ──────────── */}
        <text x="450" y="35" textAnchor="middle" fill="#c084fc" fontSize="14" fontFamily="Inter, sans-serif" fontWeight="700">
          CONVEX MIRROR
        </text>
        <text x="450" y="52" textAnchor="middle" fill="#c084fc" fontSize="11" fontFamily="Inter, sans-serif">
          (Diverging Mirror)
        </text>

        {/* Convex mirror curve — arc curving outward toward left */}
        <path
          d="M 540,100 Q 470,190 540,280"
          fill="none"
          stroke="#a855f7"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Mirror backing */}
        {[110, 130, 150, 170, 190, 210, 230, 250, 270].map((y, i) => (
          <line key={`vh${i}`} x1="540" y1={y} x2="555" y2={y + 15} stroke="#5b21b6" strokeWidth="2" />
        ))}

        {/* Principal axis */}
        <line x1="310" y1="190" x2="540" y2="190" stroke="#64748b" strokeWidth="1" strokeDasharray="5,3" />

        {/* P — Pole */}
        <circle cx="540" cy="190" r="4" fill="#f8fafc" />
        <text x="545" y="210" fill="#f8fafc" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="700">P</text>

        {/* F — Virtual focal point BEHIND mirror at ~470 */}
        <circle cx="470" cy="190" r="5" fill="#fbbf24" className={styles.pulseDot} />
        <text x="467" y="210" fill="#fbbf24" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="700">F</text>
        <line x1="470" y1="190" x2="470" y2="180" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" />

        {/* C — Behind mirror */}
        <circle cx="400" cy="190" r="5" fill="#a855f7" className={styles.pulseDot} />
        <text x="397" y="210" fill="#a855f7" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="700">C</text>

        {/* Diverging reflected rays */}
        {[130, 150, 170].map((yStart, i) => (
          <g key={`vr${i}`}>
            <line x1="360" y1={yStart} x2="536" y2={yStart} stroke="#c084fc" strokeWidth="1.5"
              className={styles.animatedRay} />
            {/* Diverging after reflection */}
            <line x1="536" y1={yStart} x2="380" y2={yStart + (yStart === 150 ? 0 : yStart < 150 ? -35 : 35)}
              stroke="#c084fc" strokeWidth="1.5" className={styles.animatedRayDelayed} opacity="0.6" />
          </g>
        ))}
        {/* Virtual dashed rays meeting at F */}
        {[130, 150, 170].map((yStart, i) => (
          <line key={`vd${i}`} x1="536" y1={yStart} x2="470" y2="190"
            stroke="#fbbf24" strokeWidth="1" strokeDasharray="4,3" opacity="0.5"
            className={styles.animatedRayDelayed} />
        ))}

        {/* Uses label */}
        <rect x="335" y="290" width="200" height="48" fill="rgba(168,85,247,0.08)" rx="6" stroke="rgba(168,85,247,0.2)" strokeWidth="1" />
        <text x="435" y="308" textAnchor="middle" fill="#d8b4fe" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="600">Uses: Rear-view mirrors,</text>
        <text x="435" y="324" textAnchor="middle" fill="#d8b4fe" fontSize="11" fontFamily="Inter, sans-serif">security mirrors, street lights</text>
        <text x="435" y="340" textAnchor="middle" fill="#c084fc" fontSize="10" fontFamily="Inter, sans-serif" fontStyle="italic">⚡ Diverging (Virtual focus)</text>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * DIAGRAM 3: Mirror Formula & Sign Convention
 * Shows: Object, mirror, image positions with u, v, f distances.
 *        Sign convention: all distances from pole P.
 *        Formula: 1/f = 1/v + 1/u
 * ═══════════════════════════════════════════════════════════════ */
export function Diagram3MirrorFormula() {
  return (
    <div className={styles.diagramWrapper} aria-label="Mirror Formula diagram">
      <div className={styles.diagramTitle}>Mirror Formula & New Cartesian Sign Convention</div>
      <svg viewBox="0 0 600 360" className={styles.svg} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="arrowBlue" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#60a5fa" />
          </marker>
          <marker id="arrowAmber" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#fbbf24" />
          </marker>
          <marker id="arrowGreen" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#4ade80" />
          </marker>
          <filter id="glow3">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width="600" height="360" fill="#070d1a" rx="16" />

        {/* ── CONCAVE MIRROR (center-right) ── */}
        <path d="M 420,80 Q 350,190 420,300" fill="none" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />
        {[90, 110, 130, 150, 170, 190, 210, 230, 250, 270, 290].map((y, i) => (
          <line key={`mh${i}`} x1="420" y1={y} x2="435" y2={y + 15} stroke="#1e3a8a" strokeWidth="2" />
        ))}

        {/* ── PRINCIPAL AXIS ── */}
        <line x1="30" y1="190" x2="560" y2="190" stroke="#475569" strokeWidth="1.5" />
        <text x="555" y="186" fill="#475569" fontSize="11" fontFamily="Inter, sans-serif">→</text>
        <text x="548" y="204" fill="#475569" fontSize="10" fontFamily="Inter, sans-serif">axis</text>

        {/* ── POLE P ── */}
        <circle cx="385" cy="190" r="4" fill="#e2e8f0" />
        <text x="383" y="208" fill="#e2e8f0" fontSize="14" fontFamily="Inter, sans-serif" fontWeight="700">P</text>

        {/* ── FOCAL POINT F ── */}
        <circle cx="295" cy="190" r="5" fill="#fbbf24" className={styles.pulseDot} />
        <text x="291" y="208" fill="#fbbf24" fontSize="14" fontFamily="Inter, sans-serif" fontWeight="700">F</text>

        {/* ── CENTRE C ── */}
        <circle cx="210" cy="190" r="5" fill="#a855f7" className={styles.pulseDot} />
        <text x="207" y="208" fill="#a855f7" fontSize="14" fontFamily="Inter, sans-serif" fontWeight="700">C</text>

        {/* ── OBJECT (arrow at x=120, y=190) ── */}
        <line x1="120" y1="140" x2="120" y2="190" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
        <polygon points="113,145 120,125 127,145" fill="#4ade80" />
        <text x="80" y="170" fill="#4ade80" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="600">Object</text>
        <text x="88" y="185" fill="#4ade80" fontSize="11" fontFamily="Inter, sans-serif">(O)</text>

        {/* ── IMAGE (arrow at x=260, inverted — below axis, real image) ── */}
        <line x1="265" y1="190" x2="265" y2="235" stroke="#f87171" strokeWidth="3" strokeLinecap="round" />
        <polygon points="258,230 265,250 272,230" fill="#f87171" />
        <text x="225" y="258" fill="#f87171" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="600">Image</text>
        <text x="236" y="272" fill="#f87171" fontSize="11" fontFamily="Inter, sans-serif">(Real, Inverted)</text>

        {/* ── DISTANCE u: Object to Pole (negative in sign convention) ── */}
        <line x1="120" y1="300" x2="385" y2="300" stroke="#4ade80" strokeWidth="1.5"
          markerEnd="url(#arrowGreen)" markerStart="url(#arrowGreen)" />
        <text x="252" y="320" textAnchor="middle" fill="#4ade80" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="600">
          u (object distance) — negative
        </text>

        {/* ── DISTANCE v: Image to Pole (negative, in front of mirror) ── */}
        <line x1="265" y1="325" x2="385" y2="325" stroke="#f87171" strokeWidth="1.5"
          markerEnd="url(#arrowAmber)" markerStart="url(#arrowAmber)" />
        <text x="325" y="342" textAnchor="middle" fill="#f87171" fontSize="12" fontFamily="Inter, sans-serif">
          v (image dist.) — negative
        </text>

        {/* ── FORMULA BOX ── */}
        <rect x="28" y="60" width="240" height="110" fill="rgba(99,102,241,0.08)" rx="10"
          stroke="rgba(99,102,241,0.25)" strokeWidth="1.5" />
        <text x="148" y="85" textAnchor="middle" fill="#818cf8" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="700">
          Mirror Formula
        </text>
        <text x="148" y="115" textAnchor="middle" fill="#e2e8f0" fontSize="20" fontFamily="Georgia, serif" fontWeight="700">
          1/v + 1/u = 1/f
        </text>
        <text x="148" y="138" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Inter, sans-serif">
          v = image distance, u = object distance
        </text>
        <text x="148" y="155" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Inter, sans-serif">
          f = focal length = R/2
        </text>

        {/* ── MAGNIFICATION BOX ── */}
        <rect x="28" y="192" width="190" height="70" fill="rgba(251,191,36,0.08)" rx="10"
          stroke="rgba(251,191,36,0.25)" strokeWidth="1.5" />
        <text x="123" y="215" textAnchor="middle" fill="#fbbf24" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="700">
          Magnification (m)
        </text>
        <text x="123" y="240" textAnchor="middle" fill="#e2e8f0" fontSize="18" fontFamily="Georgia, serif" fontWeight="700">
          m = -v/u = h&#39;/h
        </text>
        <text x="123" y="256" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="Inter, sans-serif">
          m &lt; 0 → inverted; m &gt; 0 → erect
        </text>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * DIAGRAM 4: Refraction of Light & Snell's Law
 * Shows: Light ray bending at interface between two media,
 *        angles, refractive index formula n = sin(i)/sin(r)
 * ═══════════════════════════════════════════════════════════════ */
export function Diagram4RefractionSnellsLaw() {
  return (
    <div className={styles.diagramWrapper} aria-label="Refraction and Snell's Law diagram">
      <div className={styles.diagramTitle}>Refraction of Light — Snell&apos;s Law</div>
      <svg viewBox="0 0 600 380" className={styles.svg} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow4">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="medium1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f1a2e" />
            <stop offset="100%" stopColor="#0f1a2e" />
          </linearGradient>
          <linearGradient id="medium2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0a1628" />
            <stop offset="100%" stopColor="#0d2040" />
          </linearGradient>
        </defs>

        {/* Two media backgrounds */}
        <rect width="600" height="380" fill="#070d1a" rx="16" />
        {/* Medium 1 (top — rarer, e.g. air) */}
        <rect x="0" y="0" width="600" height="190" fill="rgba(30,58,138,0.08)" rx="16" />
        {/* Medium 2 (bottom — denser, e.g. water/glass) */}
        <rect x="0" y="190" width="600" height="190" fill="rgba(20,83,45,0.12)" rx="0" />

        {/* Interface line */}
        <line x1="0" y1="190" x2="600" y2="190" stroke="#38bdf8" strokeWidth="2.5" />
        <text x="480" y="184" fill="#38bdf8" fontSize="12" fontFamily="Inter, sans-serif">Interface</text>

        {/* Medium labels */}
        <rect x="10" y="12" width="170" height="36" fill="rgba(30,58,138,0.3)" rx="6" />
        <text x="95" y="27" textAnchor="middle" fill="#93c5fd" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="600">Medium 1 (Rarer)</text>
        <text x="95" y="42" textAnchor="middle" fill="#93c5fd" fontSize="11" fontFamily="Inter, sans-serif">e.g. Air (n₁ ≈ 1.0)</text>

        <rect x="10" y="200" width="170" height="36" fill="rgba(20,83,45,0.3)" rx="6" />
        <text x="95" y="215" textAnchor="middle" fill="#86efac" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="600">Medium 2 (Denser)</text>
        <text x="95" y="230" textAnchor="middle" fill="#86efac" fontSize="11" fontFamily="Inter, sans-serif">e.g. Water (n₂ ≈ 1.33)</text>

        {/* Normal (vertical dashed line at x=300) */}
        <line x1="300" y1="50" x2="300" y2="340" stroke="#64748b" strokeWidth="1.5" strokeDasharray="6,4" />
        <text x="308" y="68" fill="#64748b" fontSize="12" fontFamily="Inter, sans-serif">Normal</text>

        {/* INCIDENT RAY — from top-left to interface at (300,190) */}
        <line x1="140" y1="60" x2="300" y2="190"
          stroke="#fbbf24" strokeWidth="3"
          strokeLinecap="round"
          filter="url(#glow4)"
          className={styles.animatedRay}
        />
        {/* Arrow on incident ray */}
        <polygon points="292,183 302,192 288,195" fill="#fbbf24" />
        <text x="170" y="100" fill="#fbbf24" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="600">
          Incident Ray
        </text>

        {/* REFRACTED RAY — bends toward normal (denser medium) */}
        <line x1="300" y1="190" x2="420" y2="340"
          stroke="#4ade80" strokeWidth="3"
          strokeLinecap="round"
          filter="url(#glow4)"
          className={styles.animatedRayDelayed}
        />
        {/* Arrow on refracted ray */}
        <polygon points="413,332 422,342 408,340" fill="#4ade80" />
        <text x="390" y="300" fill="#4ade80" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="600">
          Refracted Ray
        </text>

        {/* ANGLE OF INCIDENCE arc */}
        <path d="M 280,170 A 28,28 0 0,1 300,160" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4,2" />
        <text x="248" y="170" fill="#fbbf24" fontSize="14" fontFamily="Inter, sans-serif" fontStyle="italic">∠i</text>

        {/* ANGLE OF REFRACTION arc (below interface) */}
        <path d="M 300,210 A 28,28 0 0,1 318,222" fill="none" stroke="#4ade80" strokeWidth="2" strokeDasharray="4,2" />
        <text x="318" y="222" fill="#4ade80" fontSize="14" fontFamily="Inter, sans-serif" fontStyle="italic">∠r</text>

        {/* Note: r < i because denser medium — ray bends toward normal */}
        <text x="300" y="270" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Inter, sans-serif">
          Denser medium → ray bends toward Normal → ∠r &lt; ∠i
        </text>

        {/* Point of refraction */}
        <circle cx="300" cy="190" r="6" fill="#38bdf8" className={styles.pulseDot} />

        {/* ── SNELL'S LAW formula box ── */}
        <rect x="320" y="55" width="260" height="115" fill="rgba(99,102,241,0.1)" rx="10"
          stroke="rgba(99,102,241,0.3)" strokeWidth="1.5" />
        <text x="450" y="78" textAnchor="middle" fill="#818cf8" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="700">
          Snell&apos;s Law of Refraction
        </text>
        <text x="450" y="108" textAnchor="middle" fill="#e2e8f0" fontSize="19" fontFamily="Georgia, serif" fontWeight="700">
          n₁ sin(i) = n₂ sin(r)
        </text>
        <line x1="340" y1="116" x2="560" y2="116" stroke="rgba(99,102,241,0.3)" strokeWidth="1" />
        <text x="450" y="132" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Inter, sans-serif">
          n = speed of light in vacuum / speed in medium
        </text>
        <text x="450" y="150" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Inter, sans-serif">
          n = c / v (refractive index)
        </text>
        <text x="450" y="162" textAnchor="middle" fill="#fbbf24" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="600">
          Higher n → denser medium → slower light
        </text>

        {/* ── TOTAL INTERNAL REFLECTION hint ── */}
        <rect x="10" y="300" width="270" height="60" fill="rgba(248,113,113,0.07)" rx="8"
          stroke="rgba(248,113,113,0.2)" strokeWidth="1" />
        <text x="145" y="318" textAnchor="middle" fill="#fca5a5" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="600">
          Critical Angle (C)
        </text>
        <text x="145" y="335" textAnchor="middle" fill="#f8fafc" fontSize="14" fontFamily="Georgia, serif">
          sin(C) = 1/n  (when n₂ &gt; n₁)
        </text>
        <text x="145" y="352" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Inter, sans-serif">
          If ∠i &gt; C → Total Internal Reflection occurs
        </text>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * DIAGRAM 5: Image Formation by Lenses (Convex + Concave)
 * Shows: Convex lens with F1, F2, optical center O,
 *        ray diagrams showing image positions.
 * ═══════════════════════════════════════════════════════════════ */
export function Diagram5ImageFormationByLenses() {
  return (
    <div className={styles.diagramWrapper} aria-label="Image Formation by Lenses diagram">
      <div className={styles.diagramTitle}>Convex Lens — Image Formation Ray Diagram</div>
      <svg viewBox="0 0 600 360" className={styles.svg} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="lensGlow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="lensBodyGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.05" />
          </radialGradient>
        </defs>

        <rect width="600" height="360" fill="#070d1a" rx="16" />

        {/* ── PRINCIPAL AXIS ── */}
        <line x1="20" y1="180" x2="580" y2="180" stroke="#334155" strokeWidth="1.5" />

        {/* ── CONVEX LENS (double convex) at x=300 ── */}
        {/* Lens body — ellipse shape */}
        <ellipse cx="300" cy="180" rx="18" ry="110" fill="url(#lensBodyGrad)" />
        <path d="M 282,70 Q 318,180 282,290" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
        <path d="M 318,70 Q 282,180 318,290" fill="none" stroke="#38bdf8" strokeWidth="2.5" />

        {/* ── OPTICAL CENTER O ── */}
        <circle cx="300" cy="180" r="4" fill="#f8fafc" />
        <text x="306" y="196" fill="#f8fafc" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="700">O</text>

        {/* ── F1 (left focal point) at x=200 ── */}
        <circle cx="200" cy="180" r="5" fill="#fbbf24" className={styles.pulseDot} />
        <text x="196" y="198" fill="#fbbf24" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="700">F₁</text>
        <line x1="200" y1="160" x2="200" y2="180" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" />

        {/* ── F2 (right focal point) at x=400 ── */}
        <circle cx="400" cy="180" r="5" fill="#fbbf24" className={styles.pulseDot} />
        <text x="396" y="198" fill="#fbbf24" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="700">F₂</text>
        <line x1="400" y1="160" x2="400" y2="180" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" />

        {/* ── 2F1 at x=100 ── */}
        <circle cx="100" cy="180" r="3" fill="#a855f7" />
        <text x="90" y="198" fill="#a855f7" fontSize="11" fontFamily="Inter, sans-serif">2F₁</text>

        {/* ── 2F2 at x=500 ── */}
        <circle cx="500" cy="180" r="3" fill="#a855f7" />
        <text x="496" y="198" fill="#a855f7" fontSize="11" fontFamily="Inter, sans-serif">2F₂</text>

        {/* ── OBJECT at x=100 ── */}
        <line x1="100" y1="130" x2="100" y2="180" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
        <polygon points="93,135 100,115 107,135" fill="#4ade80" />
        <text x="60" y="112" fill="#4ade80" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="600">Object</text>

        {/* ── IMAGE at x=500 (inverted, beyond 2F2) ── */}
        <line x1="500" y1="180" x2="500" y2="228" stroke="#f87171" strokeWidth="3" strokeLinecap="round" />
        <polygon points="493,224 500,244 507,224" fill="#f87171" />
        <text x="506" y="258" fill="#f87171" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="600">Image</text>
        <text x="506" y="272" fill="#f87171" fontSize="11" fontFamily="Inter, sans-serif">(Real, Inverted)</text>

        {/* ── RAY 1: Parallel to axis → passes through F2 after refraction ── */}
        <line x1="100" y1="130" x2="282" y2="130" stroke="#60a5fa" strokeWidth="1.5"
          className={styles.animatedRay} />
        <line x1="282" y1="130" x2="500" y2="228" stroke="#60a5fa" strokeWidth="1.5"
          className={styles.animatedRayDelayed} />
        <text x="155" y="122" fill="#60a5fa" fontSize="10" fontFamily="Inter, sans-serif">① Parallel to axis</text>

        {/* ── RAY 2: Through optical center — passes undeviated ── */}
        <line x1="100" y1="130" x2="500" y2="228" stroke="#a78bfa" strokeWidth="1.5"
          strokeDasharray="6,3"
          className={styles.animatedRay}
        />
        <text x="140" y="155" fill="#a78bfa" fontSize="10" fontFamily="Inter, sans-serif">② Through center (O)</text>

        {/* ── RAY 3: Through F1 → parallel after refraction ── */}
        <line x1="100" y1="130" x2="282" y2="180" stroke="#f9a8d4" strokeWidth="1.5"
          className={styles.animatedRay} />
        <line x1="282" y1="180" x2="500" y2="228" stroke="#f9a8d4" strokeWidth="1.5"
          strokeDasharray="4,2"
          className={styles.animatedRayDelayed} opacity="0.7"
        />

        {/* ── FORMULA BOX ── */}
        <rect x="120" y="295" width="360" height="52" fill="rgba(99,102,241,0.1)" rx="10"
          stroke="rgba(99,102,241,0.3)" strokeWidth="1.5" />
        <text x="300" y="316" textAnchor="middle" fill="#818cf8" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="700">
          Lens Formula: 1/v − 1/u = 1/f
        </text>
        <text x="300" y="336" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Inter, sans-serif">
          f &gt; 0 for convex (converging) | f &lt; 0 for concave (diverging)
        </text>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * DIAGRAM 6: Lens Formula & Power of a Lens
 * Shows: Key formulas, power in diopters, sign conventions.
 * ═══════════════════════════════════════════════════════════════ */
export function Diagram6LensFormulaPower() {
  return (
    <div className={styles.diagramWrapper} aria-label="Lens Formula and Power diagram">
      <div className={styles.diagramTitle}>Lens Formula, Magnification & Power</div>
      <svg viewBox="0 0 600 360" className={styles.svg} xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="360" fill="#070d1a" rx="16" />

        {/* ── LENS FORMULA CARD ── */}
        <rect x="20" y="20" width="260" height="100" fill="rgba(56,189,248,0.08)" rx="12"
          stroke="rgba(56,189,248,0.3)" strokeWidth="1.5" className={styles.glowCard} />
        <text x="150" y="45" textAnchor="middle" fill="#38bdf8" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="700">
          Lens Formula
        </text>
        <text x="150" y="80" textAnchor="middle" fill="#f8fafc" fontSize="22" fontFamily="Georgia, serif" fontWeight="700">
          1/v − 1/u = 1/f
        </text>
        <text x="150" y="102" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Inter, sans-serif">
          v = image dist. | u = object dist. | f = focal length
        </text>
        <text x="150" y="116" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Inter, sans-serif">
          All distances measured from optical centre
        </text>

        {/* ── MAGNIFICATION CARD ── */}
        <rect x="20" y="140" width="260" height="90" fill="rgba(251,191,36,0.08)" rx="12"
          stroke="rgba(251,191,36,0.3)" strokeWidth="1.5" className={styles.glowCard} />
        <text x="150" y="163" textAnchor="middle" fill="#fbbf24" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="700">
          Magnification (m)
        </text>
        <text x="150" y="193" textAnchor="middle" fill="#f8fafc" fontSize="22" fontFamily="Georgia, serif" fontWeight="700">
          m = v/u = h&#39;/h
        </text>
        <text x="150" y="216" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Inter, sans-serif">
          m &gt; 0 → virtual, erect | m &lt; 0 → real, inverted
        </text>

        {/* ── POWER CARD ── */}
        <rect x="20" y="250" width="260" height="90" fill="rgba(74,222,128,0.08)" rx="12"
          stroke="rgba(74,222,128,0.3)" strokeWidth="1.5" className={styles.glowCard} />
        <text x="150" y="273" textAnchor="middle" fill="#4ade80" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="700">
          Power of a Lens
        </text>
        <text x="150" y="303" textAnchor="middle" fill="#f8fafc" fontSize="22" fontFamily="Georgia, serif" fontWeight="700">
          P = 1/f (in metres)
        </text>
        <text x="150" y="325" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Inter, sans-serif">
          Unit: Dioptre (D) | P &gt; 0 → convex | P &lt; 0 → concave
        </text>
        <text x="150" y="338" textAnchor="middle" fill="#fbbf24" fontSize="11" fontFamily="Inter, sans-serif">
          Combined: P = P₁ + P₂ + P₃ + …
        </text>

        {/* ── VISUAL: Convex vs Concave power arrows ── */}
        <rect x="300" y="20" width="280" height="320" fill="rgba(15,23,42,0.5)" rx="12"
          stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

        {/* Convex lens symbol */}
        <ellipse cx="390" cy="100" rx="14" ry="65" fill="rgba(56,189,248,0.12)" />
        <path d="M 376,35 Q 404,100 376,165" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
        <path d="M 404,35 Q 376,100 404,165" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
        {/* Converging rays */}
        {[-30, -15, 0, 15, 30].map((dy, i) => (
          <g key={`pr${i}`}>
            <line x1="310" y1={100 + dy} x2="376" y2={100 + dy} stroke="#60a5fa" strokeWidth="1.5" opacity="0.7" className={styles.animatedRay} />
            <line x1="404" y1={100 + dy} x2="460" y2="100" stroke="#60a5fa" strokeWidth="1.5" opacity="0.7" className={styles.animatedRayDelayed} />
          </g>
        ))}
        <text x="390" y="192" textAnchor="middle" fill="#38bdf8" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="700">
          Convex Lens
        </text>
        <text x="390" y="208" textAnchor="middle" fill="#4ade80" fontSize="13" fontFamily="Inter, sans-serif">
          P = +ve (Converging)
        </text>

        {/* Divider */}
        <line x1="305" y1="240" x2="575" y2="240" stroke="#1e2d4a" strokeWidth="1" />

        {/* Concave lens symbol */}
        <ellipse cx="390" cy="300" rx="14" ry="55" fill="rgba(248,113,113,0.08)" />
        <path d="M 376,245 Q 360,300 376,355" fill="none" stroke="#f87171" strokeWidth="2.5" />
        <path d="M 404,245 Q 420,300 404,355" fill="none" stroke="#f87171" strokeWidth="2.5" />
        {/* Diverging rays */}
        {[-20, 0, 20].map((dy, i) => (
          <g key={`pr2${i}`}>
            <line x1="310" y1={300 + dy} x2="376" y2={300 + dy} stroke="#f87171" strokeWidth="1.5" opacity="0.7" className={styles.animatedRay} />
            <line x1="404" y1={300 + dy} x2="465" y2={300 + dy * 2.5} stroke="#f87171" strokeWidth="1.5" opacity="0.7" className={styles.animatedRayDelayed} />
          </g>
        ))}
        <text x="390" y="372" textAnchor="middle" fill="#f87171" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="700">
          Concave Lens
        </text>

        {/* Power label on right side */}
        <rect x="465" y="70" width="100" height="50" fill="rgba(56,189,248,0.1)" rx="8" />
        <text x="515" y="90" textAnchor="middle" fill="#38bdf8" fontSize="11" fontFamily="Inter, sans-serif">P = +2 D</text>
        <text x="515" y="106" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="Inter, sans-serif">f = +50 cm</text>

        <rect x="465" y="270" width="100" height="50" fill="rgba(248,113,113,0.1)" rx="8" />
        <text x="515" y="290" textAnchor="middle" fill="#f87171" fontSize="11" fontFamily="Inter, sans-serif">P = −2 D</text>
        <text x="515" y="306" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="Inter, sans-serif">f = −50 cm</text>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * DIAGRAM 7: Total Internal Reflection (TIR) & Optical Fibres
 * Shows: Ray at critical angle and beyond; optical fiber cross-section
 * ═══════════════════════════════════════════════════════════════ */
export function Diagram7TotalInternalReflection() {
  return (
    <div className={styles.diagramWrapper} aria-label="Total Internal Reflection diagram">
      <div className={styles.diagramTitle}>Total Internal Reflection — Critical Angle & Optical Fibre</div>
      <svg viewBox="0 0 600 380" className={styles.svg} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow7">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="fiberGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="50%" stopColor="#312e81" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
        </defs>

        <rect width="600" height="380" fill="#070d1a" rx="16" />

        {/* ── TOP SECTION: TIR Diagram ── */}

        {/* Dense medium (bottom half — glass/water) */}
        <rect x="0" y="170" width="600" height="210" fill="rgba(14,165,233,0.07)" rx="0" />
        <line x1="0" y1="170" x2="600" y2="170" stroke="#38bdf8" strokeWidth="2" />
        <text x="540" y="164" fill="#38bdf8" fontSize="11" fontFamily="Inter, sans-serif">Interface</text>
        <text x="480" y="230" fill="#7dd3fc" fontSize="11" fontFamily="Inter, sans-serif">Dense medium (glass/water)</text>
        <text x="480" y="100" fill="#94a3b8" fontSize="11" fontFamily="Inter, sans-serif">Rarer medium (air)</text>

        {/* Normal line at x=300 */}
        <line x1="300" y1="60" x2="300" y2="290" stroke="#475569" strokeWidth="1.5" strokeDasharray="6,4" />

        {/* ── CASE 1: ∠i < C → refracted ray exits ── */}
        {/* Source in glass */}
        <circle cx="220" cy="250" r="5" fill="#fbbf24" className={styles.pulseDot} />
        {/* Incident ray going up-left */}
        <line x1="220" y1="250" x2="260" y2="170" stroke="#fbbf24" strokeWidth="2.5"
          filter="url(#glow7)" className={styles.animatedRay} />
        {/* Refracted ray into air (bends away from normal) */}
        <line x1="260" y1="170" x2="210" y2="80" stroke="#4ade80" strokeWidth="2"
          filter="url(#glow7)" className={styles.animatedRayDelayed} opacity="0.8" />
        <text x="162" y="88" fill="#4ade80" fontSize="11" fontFamily="Inter, sans-serif">Refracted (∠i &lt; C)</text>
        {/* Small reflected ray (partial) */}
        <line x1="260" y1="170" x2="295" y2="230" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4,3" opacity="0.4" />

        {/* ── CASE 2: ∠i = C → grazes along interface ── */}
        <circle cx="300" cy="250" r="5" fill="#f97316" className={styles.pulseDot} />
        <line x1="300" y1="250" x2="300" y2="170" stroke="#f97316" strokeWidth="2.5"
          filter="url(#glow7)" className={styles.animatedRay} />
        {/* At critical angle → refracted ray at 90° (grazes surface) */}
        <line x1="300" y1="170" x2="560" y2="170" stroke="#f97316" strokeWidth="2"
          strokeDasharray="8,4"
          filter="url(#glow7)" className={styles.animatedRayDelayed} opacity="0.7" />
        <text x="370" y="158" fill="#f97316" fontSize="11" fontFamily="Inter, sans-serif">At C → grazes surface</text>
        {/* Critical angle arc */}
        <path d="M 300,210 A 40,40 0 0,1 328,185" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="3,2" />
        <text x="332" y="210" fill="#f97316" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="700">C</text>

        {/* ── CASE 3: ∠i > C → TIR (stays in glass) ── */}
        <circle cx="380" cy="250" r="5" fill="#f87171" className={styles.pulseDot} />
        <line x1="380" y1="250" x2="340" y2="170" stroke="#f87171" strokeWidth="2.5"
          filter="url(#glow7)" className={styles.animatedRay} />
        {/* TIR — reflected back into glass */}
        <line x1="340" y1="170" x2="380" y2="250" stroke="#f87171" strokeWidth="2.5"
          filter="url(#glow7)" className={styles.animatedRayDelayed} />
        <text x="240" y="145" fill="#f87171" fontSize="11" fontFamily="Inter, sans-serif">TIR (∠i &gt; C)</text>
        <text x="240" y="160" fill="#f87171" fontSize="11" fontFamily="Inter, sans-serif">No refraction!</text>

        {/* ── TIR Formula ── */}
        <rect x="20" y="180" width="165" height="46" fill="rgba(248,113,113,0.1)" rx="8"
          stroke="rgba(248,113,113,0.3)" strokeWidth="1" />
        <text x="103" y="198" textAnchor="middle" fill="#fca5a5" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="700">
          Critical Angle:
        </text>
        <text x="103" y="218" textAnchor="middle" fill="#f8fafc" fontSize="16" fontFamily="Georgia, serif">
          sin(C) = 1/n
        </text>

        {/* ── BOTTOM SECTION: Optical Fibre ── */}
        <rect x="10" y="305" width="580" height="65" fill="url(#fiberGrad)" rx="10" />
        {/* Core */}
        <rect x="10" y="320" width="580" height="32" fill="rgba(99,102,241,0.25)" rx="4" />
        {/* Cladding lines */}
        <line x1="10" y1="320" x2="590" y2="320" stroke="#818cf8" strokeWidth="1.5" />
        <line x1="10" y1="352" x2="590" y2="352" stroke="#818cf8" strokeWidth="1.5" />

        {/* Light bouncing inside fiber */}
        {[30, 80, 130, 180, 230, 280, 330, 380, 430, 480, 530].map((x, i) => (
          <line key={`fl${i}`}
            x1={x} y1={i % 2 === 0 ? 320 : 352}
            x2={x + 50} y2={i % 2 === 0 ? 352 : 320}
            stroke="#fbbf24" strokeWidth="2"
            filter="url(#glow7)"
            className={styles.fiberRay}
          />
        ))}

        <text x="300" y="378" textAnchor="middle" fill="#a5b4fc" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="600">
          Optical Fibre — Light travels by successive Total Internal Reflections
        </text>
        <text x="20" y="318" fill="#818cf8" fontSize="10" fontFamily="Inter, sans-serif">Cladding (low n)</text>
        <text x="20" y="340" fill="#c7d2fe" fontSize="10" fontFamily="Inter, sans-serif">Core (high n)</text>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * DIAGRAM 8: Dispersion & Human Eye
 * Shows: Prism dispersing white light into VIBGYOR spectrum,
 *        brief human eye anatomy labels.
 * ═══════════════════════════════════════════════════════════════ */
export function Diagram8DispersionHumanEye() {
  return (
    <div className={styles.diagramWrapper} aria-label="Dispersion of Light diagram">
      <div className={styles.diagramTitle}>Dispersion of White Light by a Prism — VIBGYOR Spectrum</div>
      <svg viewBox="0 0 600 380" className={styles.svg} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="prismGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="whiteRay" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f0f0f0" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        <rect width="600" height="380" fill="#070d1a" rx="16" />

        {/* ── PRISM (equilateral triangle) ── */}
        <polygon points="240,60 340,240 140,240" fill="rgba(56,189,248,0.06)"
          stroke="#38bdf8" strokeWidth="2.5" />
        {/* Prism label */}
        <text x="240" y="268" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="Inter, sans-serif">Glass Prism</text>
        <text x="240" y="284" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="Inter, sans-serif">(refracting angle A)</text>

        {/* ── INCIDENT WHITE LIGHT ── */}
        <line x1="60" y1="140" x2="182" y2="140"
          stroke="url(#whiteRay)" strokeWidth="5"
          strokeLinecap="round"
          className={styles.animatedRay}
          filter="url(#prismGlow)"
        />
        <text x="30" y="135" fill="#f0f0f0" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="600">White</text>
        <text x="30" y="150" fill="#f0f0f0" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="600">Light</text>

        {/* ── DISPERSED SPECTRUM ── VIBGYOR rays emerging right side ── */}
        {/* The prism disperses: Violet bends most, Red bends least */}
        {[
          { color: "#8b5cf6", label: "V", y2: 95, name: "Violet" },
          { color: "#6366f1", label: "I", y2: 115, name: "Indigo" },
          { color: "#3b82f6", label: "B", y2: 135, name: "Blue" },
          { color: "#22c55e", label: "G", y2: 155, name: "Green" },
          { color: "#eab308", label: "Y", y2: 178, name: "Yellow" },
          { color: "#f97316", label: "O", y2: 200, name: "Orange" },
          { color: "#ef4444", label: "R", y2: 222, name: "Red" },
        ].map(({ color, label, y2, name }, i) => (
          <g key={`spec${i}`}>
            {/* Ray inside prism and exiting */}
            <line x1="182" y1="140" x2="298" y2={130 + i * 16}
              stroke={color} strokeWidth="2" opacity="0.7"
              className={styles.animatedRay}
            />
            <line x1="298" y1={130 + i * 16} x2="540" y2={y2}
              stroke={color} strokeWidth="2.5"
              filter="url(#prismGlow)"
              className={styles.animatedRayDelayed}
            />
            {/* Color label */}
            <circle cx="548" cy={y2} r="3" fill={color} />
            <text x="555" y={y2 + 4} fill={color} fontSize="12" fontFamily="Inter, sans-serif" fontWeight="600">
              {label} — {name}
            </text>
          </g>
        ))}

        {/* ── MNEMONIC ── */}
        <rect x="20" y="300" width="165" height="68" fill="rgba(99,102,241,0.1)" rx="8"
          stroke="rgba(99,102,241,0.3)" strokeWidth="1" />
        <text x="103" y="320" textAnchor="middle" fill="#818cf8" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="700">
          VIBGYOR Colors
        </text>
        <text x="103" y="338" textAnchor="middle" fill="#f8fafc" fontSize="13" fontFamily="Inter, sans-serif">
          Violet Indigo Blue
        </text>
        <text x="103" y="354" textAnchor="middle" fill="#f8fafc" fontSize="13" fontFamily="Inter, sans-serif">
          Green Yellow Orange Red
        </text>
        <text x="103" y="368" textAnchor="middle" fill="#fbbf24" fontSize="10" fontFamily="Inter, sans-serif">
          Violet bends most, Red bends least
        </text>

        {/* ── DISPERSION EXPLANATION ── */}
        <rect x="200" y="300" width="380" height="68" fill="rgba(20,83,45,0.12)" rx="8"
          stroke="rgba(74,222,128,0.2)" strokeWidth="1" />
        <text x="390" y="318" textAnchor="middle" fill="#4ade80" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="700">
          Why dispersion occurs?
        </text>
        <text x="390" y="336" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Inter, sans-serif">
          Different colors have different wavelengths →
        </text>
        <text x="390" y="352" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Inter, sans-serif">
          different refractive indices → different bending
        </text>
        <text x="390" y="368" textAnchor="middle" fill="#fbbf24" fontSize="11" fontFamily="Inter, sans-serif">
          Violet (400nm) &lt; ... &lt; Red (700nm) wavelength
        </text>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * DIAGRAM 9: Advanced Numericals — Formula Quick Reference
 * Shows: A beautifully laid out formula reference sheet
 *        with all key equations for the chapter.
 * ═══════════════════════════════════════════════════════════════ */
export function Diagram9NumericalFormulas() {
  return (
    <div className={styles.diagramWrapper} aria-label="Numericals Formula Sheet">
      <div className={styles.diagramTitle}>Chapter Formula Quick Reference — For Numericals</div>
      <svg viewBox="0 0 600 420" className={styles.svg} xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="420" fill="#070d1a" rx="16" />

        {/* Grid of formula cards */}
        {[
          { x: 20, y: 20, w: 180, h: 70, color: "#60a5fa", title: "Mirror Formula", formula: "1/v + 1/u = 1/f", note: "All sign convention" },
          { x: 210, y: 20, w: 180, h: 70, color: "#4ade80", title: "Magnification (Mirror)", formula: "m = −v/u = h′/h", note: "m<0 → inverted" },
          { x: 400, y: 20, w: 180, h: 70, color: "#fbbf24", title: "Focal Length", formula: "f = R/2", note: "R = radius of curvature" },
          { x: 20, y: 105, w: 180, h: 70, color: "#a78bfa", title: "Lens Formula", formula: "1/v − 1/u = 1/f", note: "Different from mirror!" },
          { x: 210, y: 105, w: 180, h: 70, color: "#f9a8d4", title: "Magnification (Lens)", formula: "m = v/u = h′/h", note: "m>0 → erect, virtual" },
          { x: 400, y: 105, w: 180, h: 70, color: "#34d399", title: "Power of Lens", formula: "P = 1/f(m)", note: "Unit: Dioptre (D)" },
          { x: 20, y: 190, w: 180, h: 70, color: "#f87171", title: "Snell's Law", formula: "n₁sinᵢ = n₂sinᵣ", note: "Applies at interface" },
          { x: 210, y: 190, w: 180, h: 70, color: "#fb923c", title: "Refractive Index", formula: "n = c/v = sinᵢ/sinᵣ", note: "n always > 1" },
          { x: 400, y: 190, w: 180, h: 70, color: "#e879f9", title: "Critical Angle", formula: "sinC = 1/n", note: "For TIR to occur" },
          { x: 20, y: 275, w: 180, h: 70, color: "#38bdf8", title: "Combined Power", formula: "P = P₁+P₂+P₃", note: "Lens combination" },
          { x: 210, y: 275, w: 180, h: 70, color: "#818cf8", title: "Speed of Light", formula: "c = 3×10⁸ m/s", note: "In vacuum" },
          { x: 400, y: 275, w: 180, h: 70, color: "#facc15", title: "Image Distance Rules", formula: "v<0 → real image", note: "For concave mirror" },
        ].map(({ x, y, w, h, color, title, formula, note }, i) => (
          <g key={`fc${i}`}>
            <rect cx={x} cy={y} x={x} y={y} width={w} height={h}
              fill={`rgba(${hexToRgb(color)},0.08)`}
              rx="10"
              stroke={`rgba(${hexToRgb(color)},0.3)`}
              strokeWidth="1.5"
            />
            <text x={x + w / 2} y={y + 18} textAnchor="middle"
              fill={color} fontSize="10" fontFamily="Inter, sans-serif" fontWeight="700">
              {title}
            </text>
            <text x={x + w / 2} y={y + 42} textAnchor="middle"
              fill="#f8fafc" fontSize="14" fontFamily="Georgia, serif" fontWeight="700">
              {formula}
            </text>
            <text x={x + w / 2} y={y + 62} textAnchor="middle"
              fill="#64748b" fontSize="9" fontFamily="Inter, sans-serif">
              {note}
            </text>
          </g>
        ))}

        {/* Sign Convention reminder */}
        <rect x="20" y="360" width="560" height="50" fill="rgba(251,191,36,0.06)" rx="8"
          stroke="rgba(251,191,36,0.2)" strokeWidth="1" />
        <text x="300" y="380" textAnchor="middle" fill="#fbbf24" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="700">
          🔑 New Cartesian Sign Convention: Distances measured from Pole/Optical Centre
        </text>
        <text x="300" y="398" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Inter, sans-serif">
          • Incident light direction: positive (usually left to right)  •  Distances opposite to light: negative
        </text>
      </svg>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
 * UTILITY: hex color → "R,G,B" string for rgba() usage in SVG
 * ────────────────────────────────────────────────────────────── */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "255,255,255";
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}

/* ══════════════════════════════════════════════════════════════
 * EXPORT: getDiagramForTopic
 * Given a topic ID string, returns the matching diagram component.
 * Used by DeepResearchChapterClient and TopicStudyClient.
 * ══════════════════════════════════════════════════════════════ */
const TOPIC_DIAGRAM_MAP: Record<string, React.FC> = {
  "intro-and-laws-of-reflection": Diagram1LawsOfReflection,
  "concave-convex-mirrors": Diagram2SphericalMirrors,
  "mirror-formula-magnification": Diagram3MirrorFormula,
  "laws-of-refraction-and-index": Diagram4RefractionSnellsLaw,
  "image-formation-by-lenses": Diagram5ImageFormationByLenses,
  "lens-formula-and-power": Diagram6LensFormulaPower,
  "total-internal-reflection": Diagram7TotalInternalReflection,
  "dispersion-and-human-eye": Diagram8DispersionHumanEye,
  "topic-9-numericals-advanced": Diagram9NumericalFormulas,
};

/**
 * getDiagramForTopic
 * Returns the React component for the given topic ID, or null if not found.
 * Usage: const Diagram = getDiagramForTopic("concave-convex-mirrors");
 */
export function getDiagramForTopic(topicId: string): React.FC | null {
  return TOPIC_DIAGRAM_MAP[topicId] || null;
}
