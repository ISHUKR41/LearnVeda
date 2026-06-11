'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/LightChapter.module.css';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface Edge {
  from: string;
  to: string;
}

export default function MindMap() {
  const nodes: Node[] = [
    { id: '1', label: 'Light', x: 400, y: 50 },
    { id: '2', label: 'Reflection', x: 200, y: 150 },
    { id: '3', label: 'Refraction', x: 600, y: 150 },
    { id: '4', label: 'Plane Mirrors', x: 100, y: 250 },
    { id: '5', label: 'Spherical Mirrors', x: 300, y: 250 },
    { id: '6', label: 'Lenses', x: 500, y: 250 },
    { id: '7', label: 'Snell\'s Law', x: 700, y: 250 },
  ];

  const edges: Edge[] = [
    { from: '1', to: '2' },
    { from: '1', to: '3' },
    { from: '2', to: '4' },
    { from: '2', to: '5' },
    { from: '3', to: '6' },
    { from: '3', to: '7' },
  ];

  return (
    <div className={styles.simulationContainer} style={{ minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg width="800" height="350" viewBox="0 0 800 350">
        {edges.map((edge, i) => {
          const fromNode = nodes.find(n => n.id === edge.from)!;
          const toNode = nodes.find(n => n.id === edge.to)!;
          return (
            <motion.line
              key={`edge-${i}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="#333"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 1, delay: i * 0.2 }}
            />
          );
        })}
        {nodes.map((node, i) => (
          <motion.g 
            key={node.id}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ scale: 1.1 }}
          >
            <rect 
              x={node.x - 75} 
              y={node.y - 25} 
              width="150" 
              height="50" 
              rx="8" 
              fill="#111" 
              stroke="#00ffcc" 
              strokeWidth="2"
            />
            <text 
              x={node.x} 
              y={node.y} 
              fill="#fff" 
              textAnchor="middle" 
              dominantBaseline="middle"
              fontFamily="monospace"
              fontSize="14"
            >
              {node.label}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
