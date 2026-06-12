/**
 * FILE: ImageWithFallback.tsx
 * PURPOSE: Drop-in replacement for <img> in the Light chapter pages.
 *          Shows a shimmer skeleton while the image loads,
 *          and a styled "image unavailable" placeholder if loading fails.
 *          Supports lazy loading via IntersectionObserver.
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  height?: number | string;
  style?: React.CSSProperties;
  className?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  height = 200,
  style,
  className,
}: ImageWithFallbackProps) {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* ── IntersectionObserver for true lazy loading ── */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { rootMargin: '200px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const baseStyle: React.CSSProperties = {
    width: '100%',
    height: typeof height === 'number' ? `${height}px` : height,
    display: 'block',
    overflow: 'hidden',
    position: 'relative',
    background: '#0d0d0f',
    ...style,
  };

  return (
    <div ref={ref} style={baseStyle} className={className}>
      {/* Shimmer while loading */}
      {state === 'loading' && inView && (
        <>
          <style>{`
            @keyframes imgShimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
          `}</style>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg,rgba(255,255,255,0.03) 0%,rgba(255,255,255,0.07) 40%,rgba(255,255,255,0.03) 80%)',
            backgroundSize: '1200px 100%',
            animation: 'imgShimmer 1.6s infinite linear',
          }} />
        </>
      )}

      {/* Actual image — only rendered when in view */}
      {inView && state !== 'error' && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setState('loaded')}
          onError={() => setState('error')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            opacity: state === 'loaded' ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}

      {/* Fallback placeholder when image fails */}
      {state === 'error' && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '0.5rem',
          background: 'linear-gradient(135deg, #111115 0%, #0d0d0f 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <span style={{ fontSize: '1.75rem', opacity: 0.3 }}>🖼️</span>
          <span style={{ fontSize: '0.75rem', color: '#52525b', textAlign: 'center', padding: '0 1rem', lineHeight: 1.5 }}>
            {alt}
          </span>
        </div>
      )}
    </div>
  );
}
