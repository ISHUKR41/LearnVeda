'use client';

/**
 * FILE: MindMap.tsx
 * PURPOSE: Interactive SVG mind-map for the Light chapter.
 *          All edges are always fully visible with bright neon colors.
 *          Nodes glow when clicked/active.
 *          Covers all subtopics: Reflection, Refraction, TIR, Mirrors, Lenses.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

/* ─────────── Color palette — all vivid and readable on dark bg ─────────── */
const COLORS = {
  root:       { fill: '#00ffcc', text: '#09090b', stroke: '#00ffcc' },
  reflection: { fill: '#3b82f6', text: '#fff',    stroke: '#3b82f6' },
  refraction: { fill: '#f59e0b', text: '#09090b', stroke: '#f59e0b' },
  mirrors:    { fill: '#6366f1', text: '#fff',    stroke: '#6366f1' },
  lenses:     { fill: '#10b981', text: '#fff',    stroke: '#10b981' },
  leaf:       { fill: '#1c1c2e', text: '#e4e4e7', stroke: '#4b5563' },
};

interface NodeDef {
  id: string;
  label: string;
  x: number;
  y: number;
  color: typeof COLORS[keyof typeof COLORS];
  w?: number;
  h?: number;
  emoji?: string;
}

interface EdgeDef {
  from: string;
  to: string;
  /** Full-opacity color — always visible */
  color: string;
}

/* ─────────── Node layout — arranged left (reflection) | center | right (refraction) ─────────── */
const nodes: NodeDef[] = [
  /* ── Root ── */
  { id: 'light',       label: 'LIGHT',              emoji: '☀️',  x: 520,  y: 290, color: COLORS.root,       w: 130, h: 48 },

  /* ── Reflection branch (left) ── */
  { id: 'refl',        label: 'Reflection',          emoji: '🪞',  x: 240,  y: 150, color: COLORS.reflection, w: 150, h: 42 },
  { id: 'laws_refl',   label: '∠i = ∠r',                          x: 55,   y: 60,  color: COLORS.leaf,       w: 110, h: 38 },
  { id: 'plane_m',     label: 'Plane Mirror',                       x: 55,   y: 140, color: COLORS.leaf,       w: 120, h: 38 },
  { id: 'concave',     label: 'Concave Mirror',                     x: 55,   y: 220, color: COLORS.leaf,       w: 135, h: 38 },
  { id: 'convex',      label: 'Convex Mirror',                      x: 55,   y: 298, color: COLORS.leaf,       w: 132, h: 38 },
  { id: 'mirror_f',    label: '1/v + 1/u = 1/f',                    x: 55,   y: 378, color: COLORS.mirrors,   w: 155, h: 38 },
  { id: 'magnif',      label: 'm = −v/u',                           x: 55,   y: 450, color: COLORS.leaf,       w: 120, h: 38 },

  /* ── Refraction branch (right) ── */
  { id: 'refr',        label: 'Refraction',          emoji: '🔬',  x: 800,  y: 150, color: COLORS.refraction, w: 148, h: 42 },
  { id: 'snell',       label: "Snell's Law",                        x: 990,  y: 60,  color: COLORS.leaf,       w: 122, h: 38 },
  { id: 'ri',          label: 'Refractive Index n',                  x: 990,  y: 140, color: COLORS.leaf,       w: 154, h: 38 },
  { id: 'glass_slab',  label: 'Glass Slab',                         x: 990,  y: 220, color: COLORS.leaf,       w: 118, h: 38 },
  { id: 'lens_convex', label: 'Convex Lens',                        x: 990,  y: 298, color: COLORS.lenses,     w: 122, h: 38 },
  { id: 'lens_concave',label: 'Concave Lens',                       x: 990,  y: 375, color: COLORS.lenses,     w: 128, h: 38 },
  { id: 'lens_f',      label: '1/v − 1/u = 1/f',                    x: 990,  y: 450, color: COLORS.lenses,     w: 156, h: 38 },

  /* ── TIR branch (center-bottom) ── */
  { id: 'tir',         label: 'Total Internal\nReflection', emoji: '💎', x: 520, y: 430, color: COLORS.refraction, w: 155, h: 48 },
  { id: 'critical',    label: 'Critical Angle',                      x: 390,  y: 530, color: COLORS.leaf,       w: 132, h: 38 },
  { id: 'opt_fibre',   label: 'Optical Fibre',                       x: 650,  y: 530, color: COLORS.leaf,       w: 128, h: 38 },
];

/* ─────────── All edges use FULL opacity — always visible ─────────── */
const edges: EdgeDef[] = [
  /* root → branches */
  { from: 'light',    to: 'refl',        color: '#3b82f6' },
  { from: 'light',    to: 'refr',        color: '#f59e0b' },
  { from: 'light',    to: 'tir',         color: '#f59e0b' },
  /* reflection → leaves */
  { from: 'refl',     to: 'laws_refl',   color: '#60a5fa' },
  { from: 'refl',     to: 'plane_m',     color: '#60a5fa' },
  { from: 'refl',     to: 'concave',     color: '#60a5fa' },
  { from: 'refl',     to: 'convex',      color: '#60a5fa' },
  { from: 'refl',     to: 'mirror_f',    color: '#818cf8' },
  { from: 'refl',     to: 'magnif',      color: '#60a5fa' },
  /* refraction → leaves */
  { from: 'refr',     to: 'snell',       color: '#fbbf24' },
  { from: 'refr',     to: 'ri',          color: '#fbbf24' },
  { from: 'refr',     to: 'glass_slab',  color: '#fbbf24' },
  { from: 'refr',     to: 'lens_convex', color: '#34d399' },
  { from: 'refr',     to: 'lens_concave',color: '#34d399' },
  { from: 'refr',     to: 'lens_f',      color: '#34d399' },
  /* TIR → leaves */
  { from: 'tir',      to: 'critical',    color: '#fbbf24' },
  { from: 'tir',      to: 'opt_fibre',   color: '#fbbf24' },
];

/* ─────────── Tooltip data for each node ─────────── */
const TOOLTIPS: Record<string, string> = {
  light:       'Electromagnetic wave; λ = 400–700 nm; speed = 3×10⁸ m/s in vacuum',
  refl:        'Bouncing of light off a surface back into the same medium',
  laws_refl:   'Angle of incidence = Angle of reflection; all in same plane',
  plane_m:     'Virtual, erect, same-size image; d(object) = d(image) from mirror',
  concave:     'Converging mirror; used in torches, solar cookers, dentist mirrors',
  convex:      'Diverging mirror; always virtual, erect, diminished — used in rear-view mirrors',
  mirror_f:    'Mirror formula: 1/f = 1/v + 1/u (sign convention applies)',
  magnif:      'Magnification m = h′/h = −v/u; m < 0 → real & inverted',
  refr:        'Bending of light as it moves between media of different optical densities',
  snell:       'n₁ sin θ₁ = n₂ sin θ₂',
  ri:          'n = c/v = sin i / sin r; n(water)=1.33, n(glass)=1.52, n(diamond)=2.42',
  glass_slab:  'Emergent ray is parallel to incident ray but laterally displaced',
  lens_convex: 'Converging lens; can form real & virtual images depending on object distance',
  lens_concave:'Diverging lens; always forms virtual, erect, diminished images',
  lens_f:      'Lens formula: 1/f = 1/v − 1/u; P = 1/f (dioptre)',
  tir:         'Occurs when light in denser medium hits boundary at angle > critical angle',
  critical:    'sin C = n₂/n₁; at C, refracted ray grazes the surface (90°)',
  opt_fibre:   'Uses TIR to transmit light over long distances; basis of internet cables',
};

/* ─────────── Single node rendering ─────────── */
function NodeBox({ node, active, onClick }: { node: NodeDef; active: boolean; onClick: () => void }) {
  const w = node.w ?? 130;
  const h = node.h ?? 40;
  return (
    <motion.g
      key={node.id}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 180, damping: 18 }}
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Glow effect when active */}
      {active && (
        <rect
          x={node.x - w / 2 - 4}
          y={node.y - h / 2 - 4}
          width={w + 8}
          height={h + 8}
          rx="12"
          fill="none"
          stroke={node.color.stroke}
          strokeWidth="1"
          opacity="0.25"
          style={{ filter: `blur(6px)` }}
        />
      )}
      {/* Node box */}
      <rect
        x={node.x - w / 2}
        y={node.y - h / 2}
        width={w}
        height={h}
        rx="8"
        fill={active ? node.color.fill : node.color.fill + '28'}
        stroke={node.color.stroke}
        strokeWidth={active ? 2.5 : 1.5}
        style={{ filter: active ? `drop-shadow(0 0 10px ${node.color.stroke})` : 'none' }}
      />
      {/* Label text */}
      {node.label.split('\n').map((line, li, arr) => (
        <text
          key={li}
          x={node.x}
          y={node.y + (arr.length > 1 ? (li - 0.5) * 14 : 0)}
          fill={active ? node.color.text : (node.color.text === '#09090b' ? '#e4e4e7' : node.color.text)}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="11.5"
          fontWeight="700"
          fontFamily="'Inter', system-ui, sans-serif"
        >
          {node.emoji && li === 0 ? `${node.emoji} ${line}` : line}
        </text>
      ))}
    </motion.g>
  );
}

/* ─────────── Main MindMap component ─────────── */
export default function MindMap() {
  const [activeNode, setActiveNode] = useState<string>('light');

  const tooltip = TOOLTIPS[activeNode] ?? '';

  return (
    <div style={{ background: '#09090b', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', padding: '1rem', overflowX: 'auto' }}>
      <p style={{ fontSize: '0.72rem', color: '#52525b', textAlign: 'center', marginBottom: '0.5rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        ↓ Click any node to see its detail
      </p>

      <svg
        width="100%"
        viewBox="0 0 1100 590"
        style={{ minWidth: '720px', display: 'block' }}
      >
        {/* Grid background */}
        <defs>
          <pattern id="mmgrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
          </pattern>
          <marker id="arrowBlue"  markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 Z" fill="#60a5fa" />
          </marker>
          <marker id="arrowAmber" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 Z" fill="#fbbf24" />
          </marker>
          <marker id="arrowGreen" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 Z" fill="#34d399" />
          </marker>
          <marker id="arrowCyan"  markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 Z" fill="#00ffcc" />
          </marker>
          <marker id="arrowIndigo" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 Z" fill="#818cf8" />
          </marker>
        </defs>
        <rect width="1100" height="590" fill="url(#mmgrid)" />

        {/* ── Edges (drawn first, under nodes) ── */}
        {edges.map((edge, i) => {
          const A = nodes.find(n => n.id === edge.from)!;
          const B = nodes.find(n => n.id === edge.to)!;
          const isHot = activeNode === edge.from || activeNode === edge.to;
          /* Pick arrowhead marker matching edge color */
          const marker = edge.color.startsWith('#60') || edge.color === '#3b82f6' ? 'arrowBlue'
                       : edge.color.startsWith('#fb') || edge.color === '#f59e0b' ? 'arrowAmber'
                       : edge.color.startsWith('#34') ? 'arrowGreen'
                       : edge.color.startsWith('#81') ? 'arrowIndigo'
                       : 'arrowCyan';
          return (
            <motion.line
              key={`e-${i}`}
              x1={A.x} y1={A.y}
              x2={B.x} y2={B.y}
              stroke={edge.color}
              strokeWidth={isHot ? 2.8 : 1.6}
              strokeOpacity={isHot ? 1 : 0.55}
              strokeDasharray={isHot ? undefined : '7 4'}
              markerEnd={isHot ? `url(#${marker})` : undefined}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: i * 0.04 }}
              style={{ filter: isHot ? `drop-shadow(0 0 5px ${edge.color})` : 'none' }}
            />
          );
        })}

        {/* ── Nodes ── */}
        {nodes.map(node => (
          <NodeBox
            key={node.id}
            node={node}
            active={activeNode === node.id}
            onClick={() => setActiveNode(activeNode === node.id ? '' : node.id)}
          />
        ))}
      </svg>

      {/* ── Tooltip panel ── */}
      {tooltip && (
        <motion.div
          key={activeNode}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: '0.75rem',
            padding: '0.75rem 1.25rem',
            background: 'rgba(0,255,204,0.05)',
            border: '1px solid rgba(0,255,204,0.2)',
            borderRadius: '10px',
            color: '#a1a1aa',
            fontSize: '0.88rem',
            lineHeight: 1.6,
          }}
        >
          <span style={{ color: '#00ffcc', fontWeight: 700 }}>
            {nodes.find(n => n.id === activeNode)?.label.replace('\n', ' ')}:
          </span>{' '}
          {tooltip}
        </motion.div>
      )}

      {/* ── Color legend ── */}
      <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '0.85rem' }}>
        {[
          { color: '#00ffcc', label: 'Root' },
          { color: '#3b82f6', label: 'Reflection' },
          { color: '#f59e0b', label: 'Refraction / TIR' },
          { color: '#6366f1', label: 'Formulas' },
          { color: '#10b981', label: 'Lenses' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: item.color, boxShadow: `0 0 5px ${item.color}`, display: 'inline-block' }} />
            <span style={{ fontSize: '0.72rem', color: '#71717a' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
