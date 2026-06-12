/**
 * FILE: reflection/loading.tsx
 * PURPOSE: Skeleton loading screen for the Reflection of Light page.
 *          Next.js App Router shows this automatically while the 'use client'
 *          page bundle hydrates — prevents the blank white flash users see.
 */

import React from 'react';

const shimmer: React.CSSProperties = {
  background: 'linear-gradient(90deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.09) 40%,rgba(255,255,255,0.04) 80%)',
  backgroundSize: '1200px 100%',
  animation: 'shimmer 1.6s infinite linear',
  borderRadius: '8px',
};

function S({ h, w = '100%', r = '8px', mb = '0' }: { h: number | string; w?: string; r?: string; mb?: string }) {
  return <div style={{ ...shimmer, height: h, width: w, borderRadius: r, marginBottom: mb, flexShrink: 0 }} />;
}

export default function ReflectionLoading() {
  return (
    <>
      <style>{`
        @keyframes shimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
      `}</style>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh', background: '#09090b' }}>

        {/* Sidebar skeleton */}
        <div style={{ background: '#0f0f11', borderRight: '1px solid rgba(255,255,255,0.07)', padding: '2rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <S h={20} w="120px" mb="0.5rem" />
          <S h={16} w="100%" />
          {[1,2,3,4,5,6,7].map(i => <S key={i} h={36} w="100%" r="6px" />)}
          <div style={{ marginTop: 'auto' }}>
            <S h={44} w="100%" r="8px" />
          </div>
        </div>

        {/* Main content skeleton */}
        <div style={{ padding: '2.5rem', maxWidth: '900px' }}>
          {/* Hero image */}
          <div style={{ ...shimmer, height: 280, borderRadius: '16px', marginBottom: '2rem' }} />

          {/* Chapter title */}
          <S h={44} w="70%" mb="0.75rem" />
          <S h={20} w="50%" mb="2rem" />

          {/* Progress stats */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            {[1,2,3].map(i => <S key={i} h={64} w="160px" r="12px" />)}
          </div>

          {/* Content sections */}
          {[1,2,3].map(i => (
            <div key={i} style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '2rem', marginBottom: '2rem' }}>
              <S h={28} w="55%" mb="1.25rem" />
              <S h={16} w="100%" mb="0.5rem" />
              <S h={16} w="95%" mb="0.5rem" />
              <S h={16} w="85%" mb="1.5rem" />
              {/* Image grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
                {[1,2,3].map(j => <S key={j} h={180} r="10px" />)}
              </div>
            </div>
          ))}

          {/* Simulation skeleton */}
          <div style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '2rem', marginBottom: '2rem' }}>
            <S h={24} w="260px" mb="1rem" />
            <S h={300} r="12px" />
          </div>
        </div>
      </div>
    </>
  );
}
