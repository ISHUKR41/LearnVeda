'use client';

/**
 * FILE: MindMap.tsx
 * PURPOSE: Interactive SVG mind-map for the Class 10 Light chapter.
 *          MAXIMUM VISIBILITY — all nodes and edges clearly readable on dark background.
 *          Nodes have solid colored fills (not transparent) for crisp visibility.
 *          Inspired by skills.sh dark terminal aesthetic.
 * DESIGN: Bright neon fills, thick edges, glow effects, animated connections.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────── Color palette — MAXIMUM contrast on #09090b dark background ─────────── */
const COLORS = {
  root:       { fill: '#00ffcc', text: '#0a0a0a', stroke: '#00ffcc', edge: '#00ffcc' },
  reflection: { fill: '#2563eb', text: '#ffffff', stroke: '#60a5fa', edge: '#60a5fa' },
  refraction: { fill: '#d97706', text: '#ffffff', stroke: '#fbbf24', edge: '#fbbf24' },
  mirrors:    { fill: '#7c3aed', text: '#ffffff', stroke: '#a78bfa', edge: '#a78bfa' },
  lenses:     { fill: '#059669', text: '#ffffff', stroke: '#34d399', edge: '#34d399' },
  tir:        { fill: '#dc2626', text: '#ffffff', stroke: '#f87171', edge: '#f87171' },
  /* Leaf nodes: dark-but-visible bg with bright border */
  leaf_blue:  { fill: '#0f172a', text: '#93c5fd', stroke: '#3b82f6', edge: '#60a5fa' },
  leaf_amber: { fill: '#1c1107', text: '#fcd34d', stroke: '#f59e0b', edge: '#fbbf24' },
  leaf_green: { fill: '#022c22', text: '#6ee7b7', stroke: '#10b981', edge: '#34d399' },
  leaf_red:   { fill: '#1a0505', text: '#fca5a5', stroke: '#ef4444', edge: '#f87171' },
  leaf_indigo:{ fill: '#13111c', text: '#c4b5fd', stroke: '#8b5cf6', edge: '#a78bfa' },
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
  color: string;
}

/* ─────────── Node layout ─────────── */
const nodes: NodeDef[] = [
  /* ── Root ── */
  { id: 'light',       label: 'LIGHT',              emoji: '☀️',  x: 540,  y: 295, color: COLORS.root,       w: 140, h: 52 },

  /* ── Reflection branch (left) ── */
  { id: 'refl',        label: 'Reflection',          emoji: '🪞',  x: 240,  y: 155, color: COLORS.reflection, w: 155, h: 44 },
  { id: 'laws_refl',   label: '∠i = ∠r',                          x: 52,   y: 58,  color: COLORS.leaf_blue,  w: 115, h: 40 },
  { id: 'plane_m',     label: 'Plane Mirror',                       x: 52,   y: 138, color: COLORS.leaf_blue,  w: 125, h: 40 },
  { id: 'concave',     label: 'Concave Mirror',                     x: 52,   y: 218, color: COLORS.leaf_blue,  w: 140, h: 40 },
  { id: 'convex',      label: 'Convex Mirror',                      x: 52,   y: 298, color: COLORS.leaf_blue,  w: 138, h: 40 },
  { id: 'mirror_f',    label: '1/v + 1/u = 1/f',                    x: 52,   y: 378, color: COLORS.leaf_indigo,w: 158, h: 40 },
  { id: 'magnif',      label: 'm = −v/u',                           x: 52,   y: 452, color: COLORS.leaf_indigo,w: 125, h: 40 },

  /* ── Refraction branch (right) ── */
  { id: 'refr',        label: 'Refraction',          emoji: '🌊',  x: 840,  y: 155, color: COLORS.refraction, w: 152, h: 44 },
  { id: 'snell',       label: "Snell's Law",                        x: 1025, y: 58,  color: COLORS.leaf_amber, w: 128, h: 40 },
  { id: 'ri',          label: 'Refractive Index n',                  x: 1025, y: 138, color: COLORS.leaf_amber, w: 158, h: 40 },
  { id: 'glass_slab',  label: 'Glass Slab',                         x: 1025, y: 218, color: COLORS.leaf_amber, w: 122, h: 40 },
  { id: 'lens_convex', label: 'Convex Lens',                        x: 1025, y: 298, color: COLORS.leaf_green, w: 128, h: 40 },
  { id: 'lens_concave',label: 'Concave Lens',                       x: 1025, y: 375, color: COLORS.leaf_green, w: 132, h: 40 },
  { id: 'lens_f',      label: '1/v − 1/u = 1/f',                    x: 1025, y: 452, color: COLORS.leaf_green, w: 160, h: 40 },

  /* ── TIR branch (center-bottom) ── */
  { id: 'tir',         label: 'Total Internal\nReflection', emoji: '💎', x: 540, y: 438, color: COLORS.tir, w: 162, h: 52 },
  { id: 'critical',    label: 'Critical Angle',                      x: 390,  y: 545, color: COLORS.leaf_red,   w: 138, h: 40 },
  { id: 'opt_fibre',   label: 'Optical Fibre',                       x: 690,  y: 545, color: COLORS.leaf_red,   w: 132, h: 40 },
];

/* ─────────── Edges — all thick and bright ─────────── */
const edges: EdgeDef[] = [
  { from: 'light',    to: 'refl',        color: '#60a5fa' },
  { from: 'light',    to: 'refr',        color: '#fbbf24' },
  { from: 'light',    to: 'tir',         color: '#f87171' },
  { from: 'refl',     to: 'laws_refl',   color: '#93c5fd' },
  { from: 'refl',     to: 'plane_m',     color: '#93c5fd' },
  { from: 'refl',     to: 'concave',     color: '#93c5fd' },
  { from: 'refl',     to: 'convex',      color: '#93c5fd' },
  { from: 'refl',     to: 'mirror_f',    color: '#c4b5fd' },
  { from: 'refl',     to: 'magnif',      color: '#c4b5fd' },
  { from: 'refr',     to: 'snell',       color: '#fcd34d' },
  { from: 'refr',     to: 'ri',          color: '#fcd34d' },
  { from: 'refr',     to: 'glass_slab',  color: '#fcd34d' },
  { from: 'refr',     to: 'lens_convex', color: '#6ee7b7' },
  { from: 'refr',     to: 'lens_concave',color: '#6ee7b7' },
  { from: 'refr',     to: 'lens_f',      color: '#6ee7b7' },
  { from: 'tir',      to: 'critical',    color: '#fca5a5' },
  { from: 'tir',      to: 'opt_fibre',   color: '#fca5a5' },
];

/* ─────────── Tooltip data ─────────── */
const TOOLTIPS: Record<string, string> = {
  light:       'Electromagnetic radiation visible to human eye. Speed = 3×10⁸ m/s in vacuum. Wavelength λ = 400–700 nm.',
  refl:        'Bouncing of light off a surface. Follows two laws: ∠i = ∠r, and all rays lie in same plane.',
  laws_refl:   '1st Law: ∠i = ∠r | 2nd Law: incident ray, normal, reflected ray all in same plane.',
  plane_m:     'Virtual + Erect + Same-size image. Image distance = Object distance. Lateral inversion occurs.',
  concave:     'Converging mirror. Forms Real/Inverted (beyond F) or Virtual/Erect (between F and P). Used: torch, solar cooker, dentist mirror.',
  convex:      'Diverging mirror. Always Virtual + Erect + Diminished. Wide field of view. Used: rear-view mirrors.',
  mirror_f:    '1/f = 1/v + 1/u. Sign convention: distances from Pole P. Concave f = −ve, Convex f = +ve.',
  magnif:      'm = −v/u = h′/h. m < 0 → Real & Inverted. m > 0 → Virtual & Erect. |m| > 1 → Magnified.',
  refr:        'Bending of light at interface of two media due to change in speed. Dense→Rare: bends away from normal.',
  snell:       'n₁ sin θ₁ = n₂ sin θ₂. Also: sin i / sin r = n₂₁ = constant for given pair of media.',
  ri:          'n = c/v = sin i / sin r. Air: 1.00 | Water: 1.33 | Glass: 1.52 | Diamond: 2.42 (highest known natural).',
  glass_slab:  'Emergent ray parallel to incident ray but shifted sideways (lateral displacement). No change in direction.',
  lens_convex: 'Converging lens. Can form Real (inverted) or Virtual (erect) images depending on object position.',
  lens_concave:'Diverging lens. Always forms Virtual + Erect + Diminished image regardless of object position.',
  lens_f:      '1/f = 1/v − 1/u. Power P = 1/f (dioptre D). Convex: +ve power. Concave: −ve power.',
  tir:         'Light in denser medium hits boundary at angle ≥ critical angle → 100% reflected back. Used in fibre optics.',
  critical:    'sin C = n₂/n₁ = 1/n. For glass-air: C ≈ 42°. For water-air: C ≈ 49°. Diamond: only 24° → extreme sparkle!',
  opt_fibre:   'TIR keeps light trapped in glass core. Used for: internet data cables, endoscopy, telephone, sensors.',
};

/* ─────────── Single node rendering ─────────── */
function NodeBox({ node, active, onClick }: { node: NodeDef; active: boolean; onClick: () => void }) {
  const w = node.w ?? 130;
  const h = node.h ?? 40;

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.08 }}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Outer glow ring when active */}
      {active && (
        <rect
          x={node.x - w / 2 - 6}
          y={node.y - h / 2 - 6}
          width={w + 12}
          height={h + 12}
          rx="13"
          fill="none"
          stroke={node.color.stroke}
          strokeWidth="3"
          opacity="0.5"
          style={{ filter: `blur(4px)` }}
        />
      )}

      {/* Node body — solid fill always */}
      <rect
        x={node.x - w / 2}
        y={node.y - h / 2}
        width={w}
        height={h}
        rx="9"
        fill={active ? node.color.fill : node.color.fill}
        stroke={node.color.stroke}
        strokeWidth={active ? 2.5 : 1.8}
        opacity={active ? 1 : 0.85}
        style={{
          filter: active
            ? `drop-shadow(0 0 12px ${node.color.stroke}) drop-shadow(0 0 4px ${node.color.stroke})`
            : `drop-shadow(0 0 4px ${node.color.stroke}60)`,
        }}
      />

      {/* Label */}
      {node.label.split('\n').map((line, li, arr) => (
        <text
          key={li}
          x={node.x}
          y={node.y + (arr.length > 1 ? (li - (arr.length - 1) / 2) * 15 : 0)}
          fill={node.color.text}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="11.5"
          fontWeight="800"
          fontFamily="'Inter', 'Sora', system-ui, sans-serif"
          style={{
            filter: active ? `drop-shadow(0 0 4px ${node.color.stroke})` : 'none',
          }}
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
    <div style={{
      background: 'linear-gradient(135deg, #0a0a12 0%, #0d1020 100%)',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.10)',
      padding: '1.25rem',
      overflowX: 'auto',
      boxShadow: '0 0 40px rgba(0,255,204,0.04)',
    }}>
      <p style={{
        fontSize: '0.72rem',
        color: '#52525b',
        textAlign: 'center',
        marginBottom: '0.75rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}>
        ↓ Click any node to see its detail · drag to scroll
      </p>

      <svg
        width="100%"
        viewBox="0 0 1100 615"
        style={{ minWidth: '740px', display: 'block' }}
      >
        <defs>
          {/* Subtle dot grid */}
          <pattern id="mmgrid2" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="16" cy="16" r="0.8" fill="rgba(255,255,255,0.04)" />
          </pattern>

          {/* Arrow markers for each color */}
          {[
            { id: 'arr-cyan',   fill: '#00ffcc' },
            { id: 'arr-blue',   fill: '#93c5fd' },
            { id: 'arr-amber',  fill: '#fcd34d' },
            { id: 'arr-green',  fill: '#6ee7b7' },
            { id: 'arr-red',    fill: '#fca5a5' },
            { id: 'arr-indigo', fill: '#c4b5fd' },
          ].map(({ id, fill }) => (
            <marker key={id} id={id} markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,1 L0,7 L7,4 Z" fill={fill} />
            </marker>
          ))}

          {/* Glow filter */}
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect width="1100" height="615" fill="url(#mmgrid2)" rx="12" />

        {/* ── Edges (drawn first, below nodes) ── */}
        {edges.map((edge, i) => {
          const A = nodes.find(n => n.id === edge.from)!;
          const B = nodes.find(n => n.id === edge.to)!;
          const isHot = activeNode === edge.from || activeNode === edge.to;

          /* Map color → arrow marker */
          const marker =
            edge.color.startsWith('#93') || edge.color === '#60a5fa' ? 'arr-blue'
            : edge.color.startsWith('#fc') || edge.color === '#fcd34d' ? 'arr-amber'
            : edge.color.startsWith('#6e') || edge.color === '#34d399' ? 'arr-green'
            : edge.color.startsWith('#fc') || edge.color === '#fca5a5' ? 'arr-red'
            : edge.color.startsWith('#c4') ? 'arr-indigo'
            : edge.color === '#00ffcc'     ? 'arr-cyan'
            : 'arr-blue';

          return (
            <motion.line
              key={`e${i}`}
              x1={A.x} y1={A.y}
              x2={B.x} y2={B.y}
              stroke={edge.color}
              strokeWidth={isHot ? 3.5 : 2.0}
              strokeOpacity={isHot ? 1 : 0.75}
              markerEnd={`url(#${marker})`}
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              transition={{ duration: 0.9, delay: i * 0.05, ease: 'easeOut' }}
              style={{
                filter: isHot
                  ? `drop-shadow(0 0 8px ${edge.color}) drop-shadow(0 0 2px ${edge.color})`
                  : `drop-shadow(0 0 3px ${edge.color}80)`,
              }}
            />
          );
        })}

        {/* ── Nodes ── */}
        {nodes.map(node => (
          <NodeBox
            key={node.id}
            node={node}
            active={activeNode === node.id}
            onClick={() => setActiveNode(activeNode === node.id ? 'light' : node.id)}
          />
        ))}
      </svg>

      {/* ── Tooltip panel ── */}
      <AnimatePresence mode="wait">
        {tooltip && (
          <motion.div
            key={activeNode}
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            style={{
              marginTop: '0.85rem',
              padding: '0.85rem 1.25rem',
              background: 'linear-gradient(135deg, rgba(0,255,204,0.06) 0%, rgba(0,0,0,0) 100%)',
              border: '1px solid rgba(0,255,204,0.22)',
              borderLeft: '3px solid #00ffcc',
              borderRadius: '10px',
              color: '#d4d4d8',
              fontSize: '0.88rem',
              lineHeight: 1.7,
            }}
          >
            <span style={{ color: '#00ffcc', fontWeight: 800, marginRight: '0.5rem' }}>
              {nodes.find(n => n.id === activeNode)?.emoji ?? '🔹'}
              {' '}
              {nodes.find(n => n.id === activeNode)?.label.replace('\n', ' ')}:
            </span>
            {tooltip}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Color legend ── */}
      <div style={{
        display: 'flex',
        gap: '1.25rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: '0.85rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        {[
          { color: '#00ffcc', label: 'Root (Light)' },
          { color: '#60a5fa', label: 'Reflection' },
          { color: '#fbbf24', label: 'Refraction' },
          { color: '#f87171', label: 'TIR' },
          { color: '#34d399', label: 'Lenses' },
          { color: '#a78bfa', label: 'Formulas' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: 10, height: 10, borderRadius: '50%',
              background: item.color,
              boxShadow: `0 0 6px ${item.color}, 0 0 12px ${item.color}40`,
              display: 'inline-block',
              flexShrink: 0,
            }} />
            <span style={{ fontSize: '0.72rem', color: '#a1a1aa', fontWeight: 500 }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
