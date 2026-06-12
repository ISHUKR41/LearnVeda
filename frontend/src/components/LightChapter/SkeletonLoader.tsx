/**
 * FILE: SkeletonLoader.tsx
 * PURPOSE: Reusable skeleton loading components for the Light chapter pages.
 *          Shows animated shimmer placeholders while images, cards, or sections load.
 *          Improves perceived performance and prevents layout shift (CLS).
 *
 * USAGE:
 *   <SkeletonImage height={200} />          — for image cards
 *   <SkeletonText lines={3} />              — for text blocks
 *   <SkeletonCard />                        — for whole content cards
 *   <ImageWithSkeleton src="..." alt="..." /> — auto-reveals after load
 */

'use client';

import { useState, useCallback } from 'react';
import styles from './SkeletonLoader.module.css';

/* ─────────────────────────────────────────────────────
   SKELETON IMAGE — shimmer rect of any height
───────────────────────────────────────────────────── */
export function SkeletonImage({ height = 200, width = '100%' }: { height?: number; width?: string | number }) {
  return (
    <div
      className={styles.skeletonBase}
      style={{ height, width, borderRadius: '8px' }}
      aria-label="Loading image..."
      role="progressbar"
    />
  );
}

/* ─────────────────────────────────────────────────────
   SKELETON TEXT — multiple lines
───────────────────────────────────────────────────── */
export function SkeletonText({ lines = 3, lastLineWidth = '70%' }: { lines?: number; lastLineWidth?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={styles.skeletonBase}
          style={{
            height: '0.9rem',
            width: i === lines - 1 ? lastLineWidth : '100%',
            borderRadius: '4px',
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   SKELETON CARD — full content card placeholder
───────────────────────────────────────────────────── */
export function SkeletonCard({ height = 280 }: { height?: number }) {
  return (
    <div className={styles.skeletonCard} style={{ height }}>
      <div className={styles.skeletonBase} style={{ height: 160, borderRadius: '6px', marginBottom: '0.75rem' }} />
      <div className={styles.skeletonBase} style={{ height: '0.85rem', width: '90%', borderRadius: '4px', marginBottom: '0.4rem' }} />
      <div className={styles.skeletonBase} style={{ height: '0.85rem', width: '70%', borderRadius: '4px' }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   IMAGE WITH SKELETON — real <img> that fades in after loading
   Replaces the placeholder shimmer with the actual image once loaded.
───────────────────────────────────────────────────── */
export function ImageWithSkeleton({
  src,
  alt,
  height = 200,
  objectFit = 'cover',
  caption,
}: {
  src: string;
  alt: string;
  height?: number;
  objectFit?: 'cover' | 'contain' | 'fill';
  caption?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = useCallback(() => setLoaded(true), []);
  const handleError = useCallback(() => setError(true), []);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Shimmer shown until image loads */}
      {!loaded && !error && (
        <div className={styles.skeletonBase} style={{ height, borderRadius: '6px 6px 0 0' }} />
      )}

      {/* Error fallback */}
      {error && (
        <div style={{
          height, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.03)', borderRadius: '6px 6px 0 0',
          color: '#52525b', fontSize: '0.8rem', flexDirection: 'column', gap: '0.4rem',
        }}>
          <span style={{ fontSize: '1.5rem' }}>🖼️</span>
          <span>Image unavailable</span>
        </div>
      )}

      {/* Actual image — invisible until loaded, then fades in */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: '100%',
          height,
          objectFit,
          display: 'block',
          borderRadius: caption ? '6px 6px 0 0' : '6px',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.4s ease',
          position: loaded ? 'relative' : 'absolute',
          top: 0,
          left: 0,
        }}
      />

      {caption && (
        <div style={{
          padding: '0.5rem 0.75rem',
          fontSize: '0.78rem',
          color: '#71717a',
          textAlign: 'center',
          lineHeight: 1.4,
        }}>
          {caption}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   IMAGE GRID SKELETON — placeholder for an image grid
───────────────────────────────────────────────────── */
export function SkeletonImageGrid({ count = 3, height = 200 }: { count?: number; height?: number }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: '1rem',
      margin: '1.5rem 0',
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} height={height + 50} />
      ))}
    </div>
  );
}
