'use client';

/**
 * FILE: FlashCard.tsx
 * PURPOSE: Interactive 3-D flip flashcard for the Light chapter.
 *          MAXIMUM VISIBILITY design:
 *          Front: Electric vivid blue gradient — ultra bright, pops on dark page
 *          Back:  Vivid amber/gold gradient — warm, easy to read, high contrast
 *          All text is bright white with text-shadow for extra punch.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/LightChapter.module.css';

interface FlashCardProps {
  front: string;
  back: string;
  /** Optional accent colour for the glow (defaults to electric blue) */
  accentColor?: string;
}

export default function FlashCard({ front, back, accentColor = '#60a5fa' }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className={`${styles.flashcard} ${isFlipped ? styles.flipped : ''}`}
      onClick={() => setIsFlipped(prev => !prev)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ duration: 0.3 }}
      style={{ cursor: 'pointer' }}
    >
      <div className={styles.flashcardInner}>

        {/* ── FRONT: Vivid electric blue — maximum visibility ── */}
        <div
          className={styles.flashcardFront}
          style={{
            background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 45%, #3b82f6 100%)',
            border: '3px solid #93c5fd',
            boxShadow: '0 0 40px rgba(59,130,246,0.45), 0 0 80px rgba(59,130,246,0.2), 0 12px 40px rgba(0,0,0,0.7)',
            color: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
            {/* Pulsing glow dot */}
            <span style={{
              width: 12, height: 12, borderRadius: '50%',
              background: '#ffffff',
              boxShadow: '0 0 16px #93c5fd, 0 0 32px #60a5fa80',
              flexShrink: 0,
            }} />
            {/* Front question text */}
            <span style={{
              fontSize: 'clamp(1rem, 2.8vw, 1.25rem)',
              fontWeight: 800,
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: 1.4,
              textShadow: '0 2px 8px rgba(0,0,0,0.5), 0 0 20px rgba(147,197,253,0.4)',
              letterSpacing: '0.01em',
            }}>
              {front}
            </span>
            {/* Category badge */}
            <span style={{
              fontSize: '0.65rem',
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '20px',
              padding: '0.25rem 0.75rem',
              color: '#e0f2fe',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              ↺ Tap to reveal
            </span>
          </div>
        </div>

        {/* ── BACK: Vivid amber/gold — warm, high contrast ── */}
        <div
          className={styles.flashcardBack}
          style={{
            background: 'linear-gradient(135deg, #92400e 0%, #b45309 45%, #d97706 100%)',
            border: '3px solid #fcd34d',
            boxShadow: '0 0 40px rgba(217,119,6,0.45), 0 0 80px rgba(217,119,6,0.2), 0 12px 40px rgba(0,0,0,0.7)',
            color: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', width: '100%' }}>
            {/* Answer badge */}
            <span style={{
              fontSize: '0.65rem',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.35)',
              borderRadius: '20px',
              padding: '0.2rem 0.75rem',
              color: '#fef3c7',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}>
              ✓ Answer
            </span>
            {/* Back answer text */}
            <span style={{
              fontSize: 'clamp(0.88rem, 2.2vw, 1.05rem)',
              fontWeight: 600,
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: 1.85,
              whiteSpace: 'pre-line',
              textShadow: '0 2px 8px rgba(0,0,0,0.5), 0 0 20px rgba(252,211,77,0.25)',
            }}>
              {back}
            </span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
