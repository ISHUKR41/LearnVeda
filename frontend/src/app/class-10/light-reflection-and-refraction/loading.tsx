/**
 * FILE: loading.tsx
 * LOCATION: src/app/class-10/light-reflection-and-refraction/loading.tsx
 * PURPOSE: Next.js App Router loading skeleton for the Light chapter index page.
 *          Shown automatically while the page data loads — eliminates blank flash.
 *          Uses shimmer animation matching the dark design system.
 */

import React from 'react';

/* Shimmer animation styles — embedded to avoid CSS module import at segment level */
const shimmerStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.09) 40%, rgba(255,255,255,0.04) 80%)',
  backgroundSize: '1200px 100%',
  animation: 'shimmer 1.6s infinite linear',
  borderRadius: '8px',
};

function SkeletonBlock({ h, w = '100%', mb = '0.75rem' }: { h: number; w?: string; mb?: string }) {
  return (
    <div style={{ ...shimmerStyle, height: h, width: w, marginBottom: mb, borderRadius: '8px' }} />
  );
}

export default function LightChapterLoading() {
  return (
    <>
      {/* Inline keyframe since this renders outside of any layout */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #09090b 0%, #0d0d0f 100%)',
        padding: '3rem 2rem',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        {/* Breadcrumb */}
        <SkeletonBlock h={16} w="200px" mb="2rem" />

        {/* Hero section */}
        <div style={{ marginBottom: '3rem' }}>
          <SkeletonBlock h={48} w="70%" mb="1rem" />
          <SkeletonBlock h={24} w="50%" mb="0.5rem" />
          <SkeletonBlock h={18} w="40%" mb="2rem" />

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                ...shimmerStyle,
                height: 60,
                width: 150,
                borderRadius: '12px',
              }} />
            ))}
          </div>
        </div>

        {/* Topic cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px',
              padding: '1.75rem',
            }}>
              <SkeletonBlock h={40} w="40px" mb="1rem" />
              <SkeletonBlock h={24} w="80%" mb="0.75rem" />
              <SkeletonBlock h={16} w="60%" mb="0.5rem" />
              <SkeletonBlock h={16} w="90%" mb="0.5rem" />
              <SkeletonBlock h={16} w="75%" mb="1.25rem" />
              <SkeletonBlock h={36} w="140px" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
