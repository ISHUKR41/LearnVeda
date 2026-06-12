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

        {/* ── FRONT: vivid deep blue, ultra bright text ── */}
        <div
          className={styles.flashcardFront}
          style={{
            borderColor: accentColor,
            boxShadow: `0 0 30px ${accentColor}33, 0 0 60px ${accentColor}10, 0 8px 32px rgba(0,0,0,0.6)`,
            background: `linear-gradient(135deg, #0f3460 0%, #16213e 50%, #0d2137 100%)`,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
            <span style={{
              width: 10, height: 10, borderRadius: '50%',
              background: accentColor,
              boxShadow: `0 0 12px ${accentColor}, 0 0 24px ${accentColor}60`,
              marginBottom: '0.25rem',
              flexShrink: 0,
            }} />
            <span style={{
              fontSize: 'clamp(0.92rem, 2.5vw, 1.15rem)',
              fontWeight: 700,
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: 1.4,
              textShadow: '0 1px 3px rgba(0,0,0,0.4)',
            }}>
              {front}
            </span>
            <span style={{ fontSize: '0.62rem', color: accentColor, marginTop: '0.5rem', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase' }}>
              ↺ tap to reveal answer
            </span>
          </div>
        </div>

        {/* ── BACK: vivid emerald green, bright white text ── */}
        <div className={styles.flashcardBack}
          style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
            borderColor: '#34d399',
            boxShadow: '0 0 30px rgba(52,211,153,0.22), 0 0 60px rgba(52,211,153,0.08), 0 8px 32px rgba(0,0,0,0.6)',
          }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
            <span style={{
              fontSize: '0.65rem',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#6ee7b7',
              marginBottom: '0.35rem',
              fontWeight: 700,
            }}>
              ✓ Answer
            </span>
            <span style={{
              fontSize: 'clamp(0.82rem, 2vw, 1rem)',
              fontWeight: 500,
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: 1.8,
              whiteSpace: 'pre-line',
              textShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }}>
              {back}
            </span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
