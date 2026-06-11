'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/LightChapter.module.css';

interface FlashCardProps {
  front: string;
  back: string;
}

export default function FlashCard({ front, back }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div 
      className={`${styles.flashcard} ${isFlipped ? styles.flipped : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
    >
      <div className={styles.flashcardInner}>
        <div className={styles.flashcardFront}>
          <span>{front}</span>
        </div>
        <div className={styles.flashcardBack}>
          <span>{back}</span>
        </div>
      </div>
    </motion.div>
  );
}
