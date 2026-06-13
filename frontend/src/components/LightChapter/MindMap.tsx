'use client';

/**
 * FILE: MindMap.tsx
 * PURPOSE: Interactive SVG mind-map for the Class 10 Light chapter.
 *          MAXIMUM VISIBILITY — every node uses VIVID SOLID BRIGHT colors.
 *          Leaf nodes have rich saturated fills — NOT dark. Instantly visible on dark bg.
 *          Click a node to see its detailed explanation below the map.
 * DESIGN: Inspired by skills.sh dark terminal aesthetic — neon on dark canvas.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Color palette — MAXIMUM VISIBILITY on dark background ─── */
const COLORS = {
  root:        { fill: '#00ffcc', text: '#001a12', stroke: '#00ffcc', edge: '#00ffcc' },
  reflection:  { fill: '#4f94ff', text: '#ffffff', stroke: '#93c5fd', edge: '#93c5fd' },
  refraction:  { fill: '#ffb800', text: '#1a0e00', stroke: '#fcd34d', edge: '#fcd34d' },
  tir:         { fill: '#ff4d4d', text: '#ffffff', stroke: '#fca5a5', edge: '#fca5a5' },
  /* Leaf nodes — BRIGHT fills, white text, vivid strokes */
  leaf_blue:   { fill: '#3b82f6', text: '#ffffff', stroke: '#93c5fd', edge: '#93c5fd' },
  leaf_amber:  { fill: '#f59e0b', text: '#1a0e00', stroke: '#fde68a', edge: '#fde68a' },
  leaf_green:  { fill: '#10b981', text: '#001a0e', stroke: '#6ee7b7', edge: '#6ee7b7' },
  leaf_red:    { fill: '#ef4444', text: '#ffffff', stroke: '#fca5a5', edge: '#fca5a5' },
  leaf_indigo: { fill: '#818cf8', text: '#ffffff', stroke: '#c4b5fd', edge: '#c4b5fd' },
  leaf_teal:   { fill: '#22d3ee', text: '#001a1d', stroke: '#a5f3fc', edge: '#a5f3fc' },
  leaf_rose:   { fill: '#f43f5e', text: '#ffffff', stroke: '#fda4af', edge: '#fda4af' },
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

/* ─── Node layout (expanded with more concepts) ─── */
const nodes: NodeDef[] = [
  /* Root */
  { id: 'light',        label: 'LIGHT',              emoji: '☀️',  x: 560,  y: 300, color: COLORS.root,       w: 148, h: 54 },

  /* Reflection branch — LEFT */
  { id: 'refl',         label: 'Reflection',          emoji: '🪞',  x: 250,  y: 155, color: COLORS.reflection, w: 158, h: 46 },
  { id: 'laws_refl',    label: '∠i = ∠r',                           x: 55,   y: 52,  color: COLORS.leaf_blue,  w: 120, h: 42 },
  { id: 'plane_m',      label: 'Plane Mirror',                       x: 55,   y: 132, color: COLORS.leaf_blue,  w: 130, h: 42 },
  { id: 'concave',      label: 'Concave Mirror',                     x: 55,   y: 212, color: COLORS.leaf_blue,  w: 148, h: 42 },
  { id: 'convex',       label: 'Convex Mirror',                      x: 55,   y: 292, color: COLORS.leaf_blue,  w: 145, h: 42 },
  { id: 'mirror_f',     label: '1/v + 1/u = 1/f',                   x: 55,   y: 372, color: COLORS.leaf_indigo,w: 162, h: 42 },
  { id: 'magnif',       label: 'm = −v/u',                           x: 55,   y: 448, color: COLORS.leaf_indigo,w: 128, h: 42 },
  { id: 'sign_conv',    label: 'Sign Convention',                    x: 55,   y: 524, color: COLORS.leaf_teal,  w: 152, h: 42 },

  /* Refraction branch — RIGHT */
  { id: 'refr',         label: 'Refraction',          emoji: '🌊',  x: 870,  y: 155, color: COLORS.refraction, w: 155, h: 46 },
  { id: 'snell',        label: "Snell's Law",                        x: 1068, y: 52,  color: COLORS.leaf_amber, w: 130, h: 42 },
  { id: 'ri',           label: 'Refractive Index n',                 x: 1068, y: 132, color: COLORS.leaf_amber, w: 162, h: 42 },
  { id: 'glass_slab',   label: 'Glass Slab',                        x: 1068, y: 212, color: COLORS.leaf_amber, w: 126, h: 42 },
  { id: 'lens_convex',  label: 'Convex Lens (+f)',                  x: 1068, y: 292, color: COLORS.leaf_green, w: 145, h: 42 },
  { id: 'lens_concave', label: 'Concave Lens (−f)',                 x: 1068, y: 370, color: COLORS.leaf_green, w: 150, h: 42 },
  { id: 'lens_f',       label: '1/v − 1/u = 1/f',                  x: 1068, y: 448, color: COLORS.leaf_green, w: 158, h: 42 },
  { id: 'power',        label: 'Power P = 1/f (D)',                 x: 1068, y: 524, color: COLORS.leaf_teal,  w: 162, h: 42 },

  /* TIR branch — BOTTOM CENTER */
  { id: 'tir',          label: 'Total Internal\nReflection', emoji: '💎', x: 560, y: 448, color: COLORS.tir, w: 168, h: 54 },
  { id: 'critical',     label: 'Critical Angle θc',                  x: 355,  y: 560, color: COLORS.leaf_red,   w: 158, h: 42 },
  { id: 'opt_fibre',    label: 'Optical Fibre',                      x: 765,  y: 560, color: COLORS.leaf_red,   w: 138, h: 42 },
  { id: 'diamond',      label: 'Diamond (n=2.42)',                   x: 560,  y: 560, color: COLORS.leaf_rose,  w: 155, h: 42 },

  /* Eye branch — CENTER TOP */
  { id: 'eye',          label: 'Human Eye',           emoji: '👁️',  x: 560,  y: 135, color: COLORS.leaf_teal,  w: 148, h: 44 },
  { id: 'myopia',       label: 'Myopia (−lens)',                     x: 450,  y: 48,  color: COLORS.leaf_rose,  w: 148, h: 42 },
  { id: 'hypermet',     label: 'Hypermetropia (+lens)',              x: 670,  y: 48,  color: COLORS.leaf_rose,  w: 175, h: 42 },
];

/* ─── Edges ─── */
const edges: EdgeDef[] = [
  { from: 'light', to: 'refl',        color: '#60a5fa' },
  { from: 'light', to: 'refr',        color: '#fbbf24' },
  { from: 'light', to: 'tir',         color: '#f87171' },
  { from: 'light', to: 'eye',         color: '#22d3ee' },
  { from: 'refl',  to: 'laws_refl',   color: '#93c5fd' },
  { from: 'refl',  to: 'plane_m',     color: '#93c5fd' },
  { from: 'refl',  to: 'concave',     color: '#93c5fd' },
  { from: 'refl',  to: 'convex',      color: '#93c5fd' },
  { from: 'refl',  to: 'mirror_f',    color: '#c4b5fd' },
  { from: 'refl',  to: 'magnif',      color: '#c4b5fd' },
  { from: 'refl',  to: 'sign_conv',   color: '#67e8f9' },
  { from: 'refr',  to: 'snell',       color: '#fcd34d' },
  { from: 'refr',  to: 'ri',          color: '#fcd34d' },
  { from: 'refr',  to: 'glass_slab',  color: '#fcd34d' },
  { from: 'refr',  to: 'lens_convex', color: '#6ee7b7' },
  { from: 'refr',  to: 'lens_concave',color: '#6ee7b7' },
  { from: 'refr',  to: 'lens_f',      color: '#6ee7b7' },
  { from: 'refr',  to: 'power',       color: '#67e8f9' },
  { from: 'tir',   to: 'critical',    color: '#fca5a5' },
  { from: 'tir',   to: 'opt_fibre',   color: '#fca5a5' },
  { from: 'tir',   to: 'diamond',     color: '#fbcfe8' },
  { from: 'eye',   to: 'myopia',      color: '#fbcfe8' },
  { from: 'eye',   to: 'hypermet',    color: '#fbcfe8' },
];

/* ─── Tooltip data ─── */
const TOOLTIPS: Record<string, string> = {
  light:       '⚡ Electromagnetic radiation. Speed c = 3×10⁸ m/s in vacuum. Wavelength 400–700 nm. Travels in straight lines (rectilinear propagation).',
  refl:        '🪞 Bouncing of light off a surface. 1st Law: ∠i = ∠r | 2nd Law: Incident ray, normal, reflected ray — all in one plane.',
  laws_refl:   '∠i = ∠r — Angle of incidence = Angle of reflection. Both measured from NORMAL to surface. Applies to all mirrors.',
  plane_m:     'Virtual + Erect + Same-size image. Distance of image = Distance of object (from mirror). Lateral inversion. Used: dressing mirrors.',
  concave:     'Converging mirror (f < 0). Forms Real+Inverted beyond F; Virtual+Erect between F and P. Uses: torch, dentist, solar cooker, telescope.',
  convex:      'Diverging mirror (f > 0). Always Virtual + Erect + Diminished. Wide field of view. Uses: rear-view mirrors, ATMs, security.',
  mirror_f:    '1/f = 1/v + 1/u ← Mirror Formula. All distances from Pole P. Concave: f negative. Convex: f positive. Real object: u negative.',
  magnif:      'm = −v/u = h′/h. m < 0 → Real & Inverted. m > 0 → Virtual & Erect. |m| > 1 → Magnified. |m| < 1 → Diminished.',
  sign_conv:   'New Cartesian: All from Pole P. Along incident light direction → Positive. Opposite → Negative. Heights above axis → Positive.',
  refr:        '🌊 Bending of light at interface due to change in speed. Dense→Rare: bends AWAY from normal. Rare→Dense: bends TOWARD normal.',
  snell:       "Snell's Law: n₁ sin θ₁ = n₂ sin θ₂. Also: sin i / sin r = n₂₁ = constant for a given medium pair at given wavelength.",
  ri:          'n = c/v = sin i / sin r. Air: 1.00 | Water: 1.33 | Glass: 1.52 | Diamond: 2.42 (highest natural). Higher n → slower light → more bending.',
  glass_slab:  'Emergent ray PARALLEL to incident ray — net deviation = 0. Only lateral shift occurs. Shift ∝ thickness and angle.',
  lens_convex: 'Converging lens (f > 0). Can form Real (inverted) or Virtual (erect) images based on object position relative to F and 2F.',
  lens_concave:'Diverging lens (f < 0). ALWAYS: Virtual + Erect + Diminished. No real image possible. Used for myopia correction.',
  lens_f:      '1/f = 1/v − 1/u ← Lens Formula (note: minus sign, unlike mirror!). m = v/u (no negative sign either). P = 1/f dioptre.',
  power:       'P = 1/f (f in metres). Unit: Dioptre (D). Convex: +P. Concave: −P. Combined lenses: P = P₁ + P₂ + ... Spectacle power in D.',
  tir:         '💎 Total Internal Reflection: Dense→Rare, angle ≥ Critical angle → 100% reflection back. Used: fibre optics, diamond brilliance, periscopes.',
  critical:    'sin C = n₂/n₁ = 1/n (if n₁=1). Glass-air: C ≈ 42°. Water-air: C ≈ 49°. Diamond: only 24° → extreme internal reflections → sparkle!',
  opt_fibre:   'TIR traps light inside glass core (n_core > n_cladding). Used: internet cables, endoscopy, decorative lights, sensors. Bandwidth: TBit/s.',
  diamond:     'Diamond n = 2.42 (highest natural). Critical angle only 24.4°! Light bounces many times inside → maximum brilliance and sparkle.',
  eye:         '👁️ Lens + cornea focus light on retina. Ciliary muscles adjust focal length (accommodation). Range: ~25 cm to infinity.',
  myopia:      'Near-sightedness. Image forms in FRONT of retina. Correction: Concave (diverging) lens of suitable negative power (−D).',
  hypermet:    'Far-sightedness. Image forms BEHIND retina. Correction: Convex (converging) lens of suitable positive power (+D).',
};

/* ─── Single node rendering ─── */
function NodeBox({ node, active, onClick }: { node: NodeDef; active: boolean; onClick: () => void }) {
  const w = node.w ?? 130;
  const h = node.h ?? 42;

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 18 }}
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Active glow ring */}
      {active && (
        <rect
          x={node.x - w / 2 - 8}
          y={node.y - h / 2 - 8}
          width={w + 16}
          height={h + 16}
          rx="14"
          fill="none"
          stroke={node.color.stroke}
          strokeWidth="4"
          opacity="0.6"
          style={{ filter: `blur(5px)` }}
        />
      )}

      {/* Node body — BRIGHT VIVID solid fill */}
      <rect
        x={node.x - w / 2}
        y={node.y - h / 2}
        width={w}
        height={h}
        rx="10"
        fill={node.color.fill}
        stroke={node.color.stroke}
        strokeWidth={active ? 3 : 2}
        style={{
          filter: active
            ? `drop-shadow(0 0 14px ${node.color.stroke}) drop-shadow(0 0 6px ${node.color.stroke})`
            : `drop-shadow(0 0 6px ${node.color.stroke}80)`,
        }}
      />

      {/* Text label — bold, large, maximum readability */}
      {node.label.split('\n').map((line, li, arr) => (
        <text
          key={li}
          x={node.x}
          y={node.y + (arr.length > 1 ? (li - (arr.length - 1) / 2) * 17 : 0)}
          fill={node.color.text}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="13"
          fontWeight="900"
          fontFamily="'Inter','Plus Jakarta Sans',system-ui,sans-serif"
          letterSpacing="0.01em"
          style={{
            filter: active ? `drop-shadow(0 0 6px ${node.color.stroke})` : `drop-shadow(0 1px 2px rgba(0,0,0,0.8))`,
            userSelect: 'none',
          }}
        >
          {node.emoji && li === 0 ? `${node.emoji} ${line}` : line}
        </text>
      ))}
    </motion.g>
  );
}

/* ─── Main MindMap component ─── */
export default function MindMap() {
  const [activeNode, setActiveNode] = useState<string>('light');

  const tooltip = TOOLTIPS[activeNode] ?? '';
  const activeNodeDef = nodes.find(n => n.id === activeNode);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #070710 0%, #0a0d1a 100%)',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.12)',
      padding: '1.5rem',
      overflowX: 'auto',
      boxShadow: '0 0 60px rgba(0,255,204,0.06), 0 20px 60px rgba(0,0,0,0.5)',
    }}>
      <p style={{
        fontSize: '0.72rem',
        color: '#71717a',
        textAlign: 'center',
        marginBottom: '0.85rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}>
        ↓ Click any node to see its detail · Drag to scroll
      </p>

      <svg
        width="100%"
        viewBox="0 0 1210 640"
        style={{ minWidth: '820px', display: 'block' }}
      >
        <defs>
          {/* Dot grid background */}
          <pattern id="mmDotGrid" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="15" cy="15" r="0.9" fill="rgba(255,255,255,0.05)" />
          </pattern>

          {/* Arrow markers for each branch color */}
          {[
            { id: 'arr-cyan',   fill: '#00ffcc' },
            { id: 'arr-blue',   fill: '#93c5fd' },
            { id: 'arr-amber',  fill: '#fcd34d' },
            { id: 'arr-green',  fill: '#6ee7b7' },
            { id: 'arr-red',    fill: '#fca5a5' },
            { id: 'arr-indigo', fill: '#c4b5fd' },
            { id: 'arr-teal',   fill: '#67e8f9' },
            { id: 'arr-rose',   fill: '#fbcfe8' },
          ].map(({ id, fill }) => (
            <marker key={id} id={id} markerWidth="9" markerHeight="9" refX="5" refY="4.5" orient="auto">
              <path d="M0,1 L0,8 L8,4.5 Z" fill={fill} />
            </marker>
          ))}

          {/* Glow filter */}
          <filter id="nodeGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect width="1210" height="640" fill="url(#mmDotGrid)" rx="12" />

        {/* Edges — drawn first, behind nodes */}
        {edges.map((edge, i) => {
          const A = nodes.find(n => n.id === edge.from)!;
          const B = nodes.find(n => n.id === edge.to)!;
          const isHot = activeNode === edge.from || activeNode === edge.to;

          const marker =
            edge.color === '#00ffcc' ? 'arr-cyan'
            : edge.color.startsWith('#93') || edge.color === '#60a5fa' ? 'arr-blue'
            : edge.color.startsWith('#fc') && edge.color.includes('d3') ? 'arr-amber'
            : edge.color.startsWith('#fcd') ? 'arr-amber'
            : edge.color.startsWith('#fbb') ? 'arr-amber'
            : edge.color.startsWith('#6e') ? 'arr-green'
            : edge.color.startsWith('#fc') ? 'arr-red'
            : edge.color.startsWith('#c4') ? 'arr-indigo'
            : edge.color.startsWith('#67') ? 'arr-teal'
            : edge.color.startsWith('#fb') ? 'arr-rose'
            : 'arr-blue';

          /* Midpoint for curved path */
          const mx = (A.x + B.x) / 2;
          const my = (A.y + B.y) / 2;

          return (
            <motion.path
              key={`e${i}`}
              d={`M ${A.x} ${A.y} Q ${mx} ${my} ${B.x} ${B.y}`}
              fill="none"
              stroke={edge.color}
              strokeWidth={isHot ? 4 : 2.6}
              strokeOpacity={isHot ? 1 : 0.7}
              markerEnd={`url(#${marker})`}
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              transition={{ duration: 0.8, delay: i * 0.04, ease: 'easeOut' }}
              style={{
                filter: isHot
                  ? `drop-shadow(0 0 8px ${edge.color}) drop-shadow(0 0 3px ${edge.color})`
                  : `drop-shadow(0 0 3px ${edge.color}70)`,
              }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map(node => (
          <NodeBox
            key={node.id}
            node={node}
            active={activeNode === node.id}
            onClick={() => setActiveNode(activeNode === node.id ? 'light' : node.id)}
          />
        ))}
      </svg>

      {/* Tooltip panel */}
      <AnimatePresence mode="wait">
        {tooltip && (
          <motion.div
            key={activeNode}
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            style={{
              marginTop: '1rem',
              padding: '1rem 1.4rem',
              background: `linear-gradient(135deg, ${activeNodeDef?.color.fill ?? '#0a0a1a'}18 0%, rgba(0,0,0,0) 100%)`,
              border: `1px solid ${activeNodeDef?.color.stroke ?? '#00ffcc'}40`,
              borderLeft: `4px solid ${activeNodeDef?.color.stroke ?? '#00ffcc'}`,
              borderRadius: '12px',
              color: '#e4e4e7',
              fontSize: '0.9rem',
              lineHeight: 1.75,
            }}
          >
            <span style={{
              color: activeNodeDef?.color.stroke ?? '#00ffcc',
              fontWeight: 800,
              marginRight: '0.5rem',
              fontSize: '1rem',
            }}>
              {activeNodeDef?.emoji ?? '🔹'}{' '}
              {activeNodeDef?.label.replace('\n', ' ')}:
            </span>
            {tooltip}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Color legend */}
      <div style={{
        display: 'flex', gap: '1rem', justifyContent: 'center',
        flexWrap: 'wrap', marginTop: '0.85rem',
        paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.07)',
      }}>
        {[
          { color: '#00ffcc', label: 'Light (Root)' },
          { color: '#60a5fa', label: 'Reflection' },
          { color: '#fbbf24', label: 'Refraction' },
          { color: '#f87171', label: 'TIR' },
          { color: '#34d399', label: 'Lenses' },
          { color: '#a78bfa', label: 'Formulas' },
          { color: '#22d3ee', label: 'Human Eye' },
          { color: '#f472b6', label: 'Eye Defects' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{
              width: 10, height: 10, borderRadius: '50%',
              background: item.color,
              boxShadow: `0 0 8px ${item.color}, 0 0 16px ${item.color}40`,
              display: 'inline-block', flexShrink: 0,
            }} />
            <span style={{ fontSize: '0.8rem', color: '#e5e7eb', fontWeight: 600 }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
