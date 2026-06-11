'use client';

/**
 * FILE: FlashCard.tsx
 * PURPOSE: Interactive 3-D flip flashcard component for the Light chapter.
 *          Front: dark navy with neon-cyan border (high contrast on dark bg).
 *          Back:  dark purple gradient with violet border + light text (fully readable).
 * LAST UPDATED: 2026-06-11
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/LightChapter.module.css';

interface FlashCardProps {
  front: string;
  back: string;
  /** Optional accent colour override for the front border */
  accentColor?: string;
}

export default function FlashCard({ front, back, accentColor = '#00ffcc' }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className={`${styles.flashcard} ${isFlipped ? styles.flipped : ''}`}
      onClick={() => setIsFlipped(prev => !prev)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.flashcardInner}>

        {/* ── FRONT: dark navy, neon-cyan border ── */}
        <div
          className={styles.flashcardFront}
          style={{ borderColor: accentColor, boxShadow: `0 0 20px ${accentColor}22, 0 8px 32px rgba(0,0,0,0.5)` }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
            {/* Category dot */}
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: accentColor,
              boxShadow: `0 0 8px ${accentColor}`,
              marginBottom: '0.25rem',
            }} />
            <span style={{
              fontSize: 'clamp(0.95rem, 2.5vw, 1.25rem)',
              fontWeight: 700,
              color: '#f0fffe',
              textAlign: 'center',
              lineHeight: 1.35,
            }}>
              {front}
            </span>
            <span style={{ fontSize: '0.65rem', color: accentColor + '88', marginTop: '0.5rem', letterSpacing: '0.08em' }}>
              ↺ tap to reveal answer
            </span>
          </div>
        </div>

        {/* ── BACK: dark purple, light-violet text ── */}
        <div className={styles.flashcardBack}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
            <span style={{
              fontSize: '0.68rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#a78bfa',
              marginBottom: '0.35rem',
              fontWeight: 700,
            }}>
              Answer
            </span>
            <span style={{
              fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
              fontWeight: 500,
              color: '#ede9fe',
              textAlign: 'center',
              lineHeight: 1.75,
              whiteSpace: 'pre-line',
            }}>
              {back}
            </span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
