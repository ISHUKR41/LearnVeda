/**
 * FILE: summary/loading.tsx
 * PURPOSE: Skeleton loading screen for the Light chapter Summary page.
 */

import React from 'react';

const shimmer: React.CSSProperties = {
  background: 'linear-gradient(90deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.09) 40%,rgba(255,255,255,0.04) 80%)',
  backgroundSize: '1200px 100%',
  animation: 'shimmer 1.6s infinite linear',
  borderRadius: '8px',
};

function S({ h, w = '100%', r = '8px', mb = '0' }: { h: number | string; w?: string; r?: string; mb?: string }) {
  return <div style={{ ...shimmer, height: h, width: w, borderRadius: r, marginBottom: mb }} />;
}

export default function SummaryLoading() {
  return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}`}</style>
      <div style={{ minHeight: '100vh', background: '#09090b', padding: '3rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
        <S h={20} w="200px" mb="2rem" />
        <S h={48} w="75%" mb="0.75rem" />
        <S h={20} w="55%" mb="2.5rem" />
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{ background:'#111115', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'14px', padding:'1.75rem', marginBottom:'1.5rem' }}>
            <S h={26} w="40%" mb="1rem" />
            <S h={14} w="100%" mb="0.4rem" />
            <S h={14} w="90%" mb="0.4rem" />
            <S h={14} w="80%" mb="0.4rem" />
            <S h={14} w="95%" mb="0" />
          </div>
        ))}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginTop: '2rem' }}>
          {[1,2,3].map(i => <S key={i} h={64} r="12px" />)}
        </div>
      </div>
    </>
  );
}
