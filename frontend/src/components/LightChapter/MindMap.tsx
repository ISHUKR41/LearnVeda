'use client';

/**
 * FILE: MindMap.tsx
 * PURPOSE: Fully interactive, animated mind map for Class 10 Light chapter.
 *          Uses bright, high-contrast colors visible on dark backgrounds.
 *          Covers all topics: Reflection, Refraction, Mirrors, Lenses, Snell's Law, TIR.
 * LAST UPDATED: 2026-06-11
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

/* ─────── Node colour palette — all high-contrast on dark bg ─────── */
const COLORS = {
  root:       { fill: '#00ffcc', text: '#09090b', stroke: '#00ffcc' },
  reflection: { fill: '#3b82f6', text: '#fff',    stroke: '#3b82f6' },
  refraction: { fill: '#f59e0b', text: '#09090b', stroke: '#f59e0b' },
  mirrors:    { fill: '#6366f1', text: '#fff',    stroke: '#6366f1' },
  lenses:     { fill: '#10b981', text: '#fff',    stroke: '#10b981' },
  leaf:       { fill: '#1c1c28', text: '#e4e4e7', stroke: '#4b5563' },
};

interface NodeDef {
  id: string;
  label: string;
  x: number; y: number;
  color: typeof COLORS[keyof typeof COLORS];
  w?: number; h?: number;
}

interface EdgeDef { from: string; to: string; color: string; }

const nodes: NodeDef[] = [
  /* Root */
  { id: 'light',       label: 'LIGHT',                  x: 520,  y: 300, color: COLORS.root,       w: 130, h: 46 },
  /* Level 1 */
  { id: 'refl',        label: 'Reflection',              x: 240,  y: 160, color: COLORS.reflection, w: 140, h: 40 },
  { id: 'refr',        label: 'Refraction',              x: 800,  y: 160, color: COLORS.refraction, w: 140, h: 40 },
  { id: 'tir',         label: 'Total Internal\nReflection', x: 800, y: 440, color: COLORS.refraction, w: 150, h: 44 },
  /* Level 2 — Reflection */
  { id: 'laws_refl',   label: '∠i = ∠r',               x: 60,   y: 80,  color: COLORS.leaf,       w: 110, h: 38 },
  { id: 'plane_m',     label: 'Plane Mirror',            x: 60,   y: 160, color: COLORS.leaf,       w: 120, h: 38 },
  { id: 'concave',     label: 'Concave Mirror',          x: 60,   y: 240, color: COLORS.leaf,       w: 130, h: 38 },
  { id: 'convex',      label: 'Convex Mirror',           x: 60,   y: 310, color: COLORS.leaf,       w: 130, h: 38 },
  { id: 'mirror_f',    label: '1/v + 1/u = 1/f',        x: 60,   y: 390, color: COLORS.mirrors,    w: 150, h: 38 },
  { id: 'magnif',      label: 'm = −v/u',               x: 60,   y: 460, color: COLORS.leaf,       w: 120, h: 38 },
  /* Level 2 — Refraction */
  { id: 'snell',       label: "Snell's Law",             x: 980,  y: 80,  color: COLORS.leaf,       w: 120, h: 38 },
  { id: 'ri',          label: 'Refractive Index n',     x: 980,  y: 160, color: COLORS.leaf,       w: 150, h: 38 },
  { id: 'glass_slab',  label: 'Glass Slab',             x: 980,  y: 240, color: COLORS.leaf,       w: 120, h: 38 },
  { id: 'lens_convex', label: 'Convex Lens',            x: 980,  y: 320, color: COLORS.lenses,     w: 120, h: 38 },
  { id: 'lens_concave',label: 'Concave Lens',           x: 980,  y: 390, color: COLORS.lenses,     w: 120, h: 38 },
  { id: 'lens_f',      label: '1/v − 1/u = 1/f',       x: 980,  y: 465, color: COLORS.lenses,     w: 155, h: 38 },
  /* TIR children */
  { id: 'critical',    label: 'Critical Angle',         x: 680,  y: 530, color: COLORS.leaf,       w: 130, h: 38 },
  { id: 'opt_fibre',   label: 'Optical Fibre',          x: 920,  y: 530, color: COLORS.leaf,       w: 120, h: 38 },
];

const edges: EdgeDef[] = [
  { from: 'light',    to: 'refl',        color: '#3b82f6' },
  { from: 'light',    to: 'refr',        color: '#f59e0b' },
  { from: 'light',    to: 'tir',         color: '#f59e0b' },
  { from: 'refl',     to: 'laws_refl',   color: '#3b82f680' },
  { from: 'refl',     to: 'plane_m',     color: '#3b82f680' },
  { from: 'refl',     to: 'concave',     color: '#3b82f680' },
  { from: 'refl',     to: 'convex',      color: '#3b82f680' },
  { from: 'refl',     to: 'mirror_f',    color: '#6366f1' },
  { from: 'refl',     to: 'magnif',      color: '#3b82f680' },
  { from: 'refr',     to: 'snell',       color: '#f59e0b80' },
  { from: 'refr',     to: 'ri',          color: '#f59e0b80' },
  { from: 'refr',     to: 'glass_slab',  color: '#f59e0b80' },
  { from: 'refr',     to: 'lens_convex', color: '#10b981' },
  { from: 'refr',     to: 'lens_concave',color: '#10b981' },
  { from: 'refr',     to: 'lens_f',      color: '#10b981' },
  { from: 'tir',      to: 'critical',    color: '#f59e0b80' },
  { from: 'tir',      to: 'opt_fibre',   color: '#f59e0b80' },
];

function NodeBox({ node, active, onClick }: { node: NodeDef; active: boolean; onClick: () => void }) {
  const w = node.w ?? 130;
  const h = node.h ?? 40;
  return (
    <motion.g
      key={node.id}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <rect
        x={node.x - w / 2} y={node.y - h / 2}
        width={w} height={h} rx="8"
        fill={active ? node.color.fill : node.color.fill + '22'}
        stroke={node.color.stroke}
        strokeWidth={active ? 2.5 : 1.5}
        style={{ filter: active ? `drop-shadow(0 0 8px ${node.color.stroke})` : 'none' }}
      />
      {node.label.split('\n').map((line, li) => (
        <text
          key={li}
          x={node.x}
          y={node.y - (node.label.includes('\n') ? 7 : 0) + li * 16}
          fill={active ? node.color.text : node.color.text === '#09090b' ? '#e4e4e7' : node.color.text}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="12"
          fontWeight="700"
          fontFamily="'Inter', system-ui, sans-serif"
        >{line}</text>
      ))}
    </motion.g>
  );
}

export default function MindMap() {
  const [activeNode, setActiveNode] = useState<string>('light');

  return (
    <div style={{
      background: '#09090b',
      borderRadius: '14px',
      border: '1px solid rgba(255,255,255,0.07)',
      padding: '1rem',
      overflowX: 'auto',
    }}>
      <p style={{ fontSize: '0.78rem', color: '#71717a', textAlign: 'center', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
        CLICK ON ANY NODE TO HIGHLIGHT IT
      </p>
      <svg
        width="100%"
        viewBox="0 0 1120 580"
        style={{ minWidth: '680px', display: 'block' }}
      >
        {/* Grid background */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="1120" height="580" fill="url(#grid)" />

        {/* Edges — bright visible colors */}
        {edges.map((edge, i) => {
          const fromNode = nodes.find(n => n.id === edge.from)!;
          const toNode   = nodes.find(n => n.id === edge.to)!;
          const isActive = activeNode === edge.from || activeNode === edge.to;
          return (
            <motion.line
              key={`e-${i}`}
              x1={fromNode.x} y1={fromNode.y}
              x2={toNode.x}   y2={toNode.y}
              stroke={isActive ? edge.color.replace('80', '') : edge.color}
              strokeWidth={isActive ? 2.5 : 1.5}
              strokeDasharray={isActive ? undefined : '6 4'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: i * 0.05 }}
              style={{ filter: isActive ? `drop-shadow(0 0 4px ${edge.color})` : 'none' }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map(node => (
          <NodeBox
            key={node.id}
            node={node}
            active={activeNode === node.id}
            onClick={() => setActiveNode(node.id)}
          />
        ))}
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
        {[
          { color: '#00ffcc', label: 'Root' },
          { color: '#3b82f6', label: 'Reflection' },
          { color: '#f59e0b', label: 'Refraction / TIR' },
          { color: '#6366f1', label: 'Formulas' },
          { color: '#10b981', label: 'Lenses' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
            <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
