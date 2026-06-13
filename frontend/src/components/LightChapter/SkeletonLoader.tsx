/**
 * FILE: SkeletonLoader.tsx
 * PURPOSE: Reusable skeleton loading components for the Light chapter pages.
 *          Shows animated shimmer placeholders while images, cards, or sections load.
 *          Improves perceived performance and prevents layout shift (CLS).
 *
 * CRITICAL FIX: ImageWithSkeleton now uses loading="eager" (not lazy) because:
 *   — The skeleton shimmer IS the lazy loading mechanism (shows while img loads).
 *   — Using loading="lazy" on an opacity:0 / position:absolute img prevents
 *     the browser's IntersectionObserver from ever triggering the load, so
 *     the image stays invisible permanently.
 *   — Eager loading here is safe because the skeleton shows immediately anyway.
 *
 * USAGE:
 *   <SkeletonImage height={200} />          — for image cards
 *   <SkeletonText lines={3} />              — for text blocks
 *   <SkeletonCard />                        — for whole content cards
 *   <ImageWithSkeleton src="..." alt="..." /> — auto-reveals after load
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
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
   IMAGE WITH SKELETON — real <img> that fades in after loading.

   HOW IT WORKS:
   1. Container has explicit height so layout doesn't shift.
   2. Skeleton shimmer fills the container while img loads.
   3. Img uses loading="eager" so it starts fetching immediately.
   4. Once onLoad fires, skeleton hides and img fades in (opacity 0→1).
   5. On error, shows a styled fallback placeholder.
───────────────────────────────────────────────────── */
export function ImageWithSkeleton({
  src,
  alt,
  height = 200,
  objectFit = 'contain',
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
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = useCallback(() => setLoaded(true), []);
  const handleError = useCallback(() => setError(true), []);

  /*
   * Safety net: if the browser already has the image in cache,
   * the onLoad event fires before React attaches the handler.
   * Check .complete flag after mount to handle cached images.
   */
  useEffect(() => {
    if (imgRef.current?.complete) {
      if (imgRef.current.naturalWidth > 0) {
        setLoaded(true);
      } else {
        setError(true);
      }
    }
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height, background: '#0d0d11', borderRadius: caption ? '8px 8px 0 0' : '8px', overflow: 'hidden' }}>

      {/* Shimmer placeholder — shown while loading */}
      {!loaded && !error && (
        <div
          className={styles.skeletonBase}
          style={{ position: 'absolute', inset: 0, borderRadius: 0 }}
        />
      )}

      {/* Error fallback — shows when image 404s or fails */}
      {error && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.02)',
          color: '#52525b', fontSize: '0.78rem', flexDirection: 'column', gap: '0.5rem',
          textAlign: 'center', padding: '1rem',
        }}>
          <span style={{ fontSize: '2rem', opacity: 0.5 }}>🖼️</span>
          <span style={{ fontWeight: 500 }}>Diagram loading…</span>
          <span style={{ fontSize: '0.7rem', opacity: 0.6, wordBreak: 'break-all' }}>{src.split('/').pop()}</span>
        </div>
      )}

      {/* Actual image — loading="eager" is critical here */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="eager"
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit,
          display: 'block',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.45s ease',
        }}
      />

      {caption && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '0.4rem 0.6rem',
          fontSize: '0.7rem',
          color: '#a1a1aa',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
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

/* ─────────────────────────────────────────────────────
   PAGE SECTION SKELETON — full-width loading shimmer for a section
───────────────────────────────────────────────────── */
export function SkeletonSection({ lines = 4 }: { lines?: number }) {
  return (
    <div style={{ padding: '1.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', marginBottom: '1.5rem' }}>
      <div className={styles.skeletonBase} style={{ height: '1.4rem', width: '45%', borderRadius: '6px', marginBottom: '1rem' }} />
      <SkeletonText lines={lines} />
    </div>
  );
}
