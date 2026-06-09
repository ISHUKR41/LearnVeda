/**
 * FILE: SnellsLawSim.tsx
 * LOCATION: frontend/src/components/simulations/light/refraction/SnellsLawSim.tsx
 * PURPOSE: Interactive Snell's Law and Total Internal Reflection simulation.
 *
 * FEATURES:
 *   - Two media regions with animated wave textures
 *   - Incident ray bending at the boundary (Snell's Law)
 *   - Angle slider with real-time θ₁ and θ₂ display
 *   - Six media pairs: Air→Glass, Air→Water, Air→Diamond, etc.
 *   - Total Internal Reflection (TIR) with visual flash when angle exceeds critical angle
 *   - Normal line, angle arcs, reflection ray shown during TIR
 *   - Live equation n₁ sin θ₁ = n₂ sin θ₂ with values
 *   - Critical angle indicator and calculation
 *
 * PHYSICS: Snell's Law, Critical Angle, Total Internal Reflection
 * LAST UPDATED: 2026-06-09
 */

"use client";

import React, { useRef, useState, useEffect } from "react";
import styles from "../SimulationEngine.module.css";

interface Point { x: number; y: number; }

/* ── Snell's Law ── */
function snell(theta1: number, n1: number, n2: number): number | null {
  const s = (n1 * Math.sin(theta1)) / n2;
  if (Math.abs(s) > 1) return null;
  return Math.asin(s);
}

function critAngle(n1: number, n2: number): number | null {
  if (n1 <= n2) return null;
  return Math.asin(n2 / n1);
}

/* ── Drawing helpers ── */
function line(ctx: CanvasRenderingContext2D, a: Point, b: Point, col: string, w = 2, dashed = false) {
  ctx.save();
  ctx.strokeStyle = col;
  ctx.lineWidth = w;
  ctx.shadowColor = col;
  ctx.shadowBlur = dashed ? 0 : 10;
  if (dashed) ctx.setLineDash([6, 5]);
  ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function arrowHead(ctx: CanvasRenderingContext2D, from: Point, to: Point, col: string) {
  const ang = Math.atan2(to.y - from.y, to.x - from.x);
  const s = 10;
  ctx.save();
  ctx.fillStyle = col;
  ctx.shadowColor = col;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(to.x - s * Math.cos(ang - 0.38), to.y - s * Math.sin(ang - 0.38));
  ctx.lineTo(to.x - s * Math.cos(ang + 0.38), to.y - s * Math.sin(ang + 0.38));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function label(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, col = "#e2e8f0", size = 12) {
  ctx.save();
  ctx.font = `bold ${size}px Inter, sans-serif`;
  ctx.fillStyle = col;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
  ctx.restore();
}

/* ── Media pairs ── */
const MEDIA = [
  { name: "Air → Glass",          n1: 1.00, n2: 1.50, c1: "#1e3a5f", c2: "#1e3a8a" },
  { name: "Air → Water",          n1: 1.00, n2: 1.33, c1: "#1e3a5f", c2: "#1e4a6e" },
  { name: "Air → Diamond",        n1: 1.00, n2: 2.42, c1: "#1e3a5f", c2: "#4a1d96" },
  { name: "Glass → Air (TIR!)",   n1: 1.50, n2: 1.00, c1: "#1e3a8a", c2: "#1e3a5f" },
  { name: "Water → Air (TIR!)",   n1: 1.33, n2: 1.00, c1: "#1e4a6e", c2: "#1e3a5f" },
  { name: "Diamond → Air (TIR!)", n1: 2.42, n2: 1.00, c1: "#4a1d96", c2: "#1e3a5f" },
];

/* ═══════════════════════════════════════════════════
 * COMPONENT
 * ═══════════════════════════════════════════════════ */
const SnellsLawSim: React.FC<{ id?: string; title?: string }> = ({
  id = "snells-law-sim",
  title = "Snell's Law — Refraction of Light",
}) => {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);
  const [angleDeg, setAngleDeg] = useState(35);
  const [mediaIdx, setMediaIdx] = useState(0);
  const [dims, setDims] = useState({ w: 580, h: 400 });
  const [isTIR, setIsTIR] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth || 580;
      setDims({ w, h: Math.round(w * 0.65) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let running = true;

    function draw(time: number) {
      if (!running) return;
      rafRef.current = requestAnimationFrame(draw);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const W = dims.w;
      const H = dims.h;
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width  !== Math.round(W * dpr)) canvas.width  = Math.round(W * dpr);
      if (canvas.height !== Math.round(H * dpr)) canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const media = MEDIA[mediaIdx];
      const interfaceY = H * 0.48;
      const hitX = W * 0.5;

      /* ── Two media background ── */
      /* Upper medium */
      const grad1 = ctx.createLinearGradient(0, 0, 0, interfaceY);
      grad1.addColorStop(0, "#080f1f");
      grad1.addColorStop(1, media.c1 + "60");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, W, interfaceY);

      /* Lower medium */
      const grad2 = ctx.createLinearGradient(0, interfaceY, 0, H);
      grad2.addColorStop(0, media.c2 + "80");
      grad2.addColorStop(1, media.c2 + "20");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, interfaceY, W, H - interfaceY);

      /* Animated waves in each medium */
      const waveAmp = 3;
      const waveFreq = 0.04;
      const waveSpeed = 0.003;

      ctx.save();
      ctx.strokeStyle = `${media.c1}a0`;
      ctx.lineWidth = 1;
      for (let i = 1; i <= 3; i++) {
        const waveY = interfaceY - i * 26;
        ctx.beginPath();
        for (let x = 0; x <= W; x += 3) {
          const y = waveY + waveAmp * Math.sin(x * waveFreq + time * waveSpeed + i);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = `${media.c2}a0`;
      ctx.lineWidth = 1;
      for (let i = 1; i <= 3; i++) {
        const waveY = interfaceY + i * 26;
        ctx.beginPath();
        for (let x = 0; x <= W; x += 3) {
          const y = waveY + waveAmp * Math.sin(x * waveFreq - time * waveSpeed + i);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();

      /* Interface line */
      ctx.save();
      ctx.strokeStyle = "rgba(148,163,184,0.4)";
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      ctx.moveTo(0, interfaceY);
      ctx.lineTo(W, interfaceY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      /* Media labels */
      label(ctx, `n₁ = ${media.n1.toFixed(2)} (${media.name.split("→")[0].trim()})`,
        W * 0.18, H * 0.08, "rgba(148,163,184,0.9)", 12);
      label(ctx, `n₂ = ${media.n2.toFixed(2)} (${media.name.split("→")[1].trim()})`,
        W * 0.18, interfaceY + 24, "rgba(148,163,184,0.9)", 12);

      /* ── Normal line ── */
      const normalLen = H * 0.42;
      line(ctx,
        { x: hitX, y: interfaceY - normalLen },
        { x: hitX, y: interfaceY + normalLen },
        "rgba(148,163,184,0.5)", 1.5, true
      );
      label(ctx, "N", hitX + 10, interfaceY - normalLen + 12, "#94a3b8", 11);

      /* ── Geometry ── */
      const theta1 = (angleDeg * Math.PI) / 180;
      const theta2 = snell(theta1, media.n1, media.n2);
      const tirNow = theta2 === null;
      setIsTIR(tirNow);

      const rayLen = H * 0.42;

      /* Incident ray (comes from upper-left to hitX, interfaceY) */
      const incSrc: Point = {
        x: hitX - rayLen * Math.sin(theta1),
        y: interfaceY - rayLen * Math.cos(theta1),
      };
      line(ctx, incSrc, { x: hitX, y: interfaceY }, "#fbbf24", 2.5);
      arrowHead(ctx, incSrc, { x: hitX, y: interfaceY }, "#fbbf24");

      if (!tirNow && theta2 !== null) {
        /* Refracted ray */
        const refEnd: Point = {
          x: hitX + rayLen * Math.sin(theta2),
          y: interfaceY + rayLen * Math.cos(theta2),
        };
        line(ctx, { x: hitX, y: interfaceY }, refEnd, "#34d399", 2.5);
        arrowHead(ctx, { x: hitX, y: interfaceY }, refEnd, "#34d399");

        /* Angle arcs */
        const arcR = 44;
        /* θ₁ */
        ctx.save();
        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(hitX, interfaceY, arcR, -Math.PI / 2 - theta1, -Math.PI / 2, false);
        ctx.stroke();
        ctx.restore();
        label(ctx, `θ₁=${angleDeg}°`, hitX - arcR - 24, interfaceY - arcR * 0.6, "#fde68a", 12);

        /* θ₂ */
        const theta2Deg = Math.round((theta2 * 180) / Math.PI);
        ctx.save();
        ctx.strokeStyle = "#34d399";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(hitX, interfaceY, arcR + 6, Math.PI / 2, Math.PI / 2 + theta2, false);
        ctx.stroke();
        ctx.restore();
        label(ctx, `θ₂=${theta2Deg}°`, hitX + arcR + 24, interfaceY + arcR * 0.6, "#6ee7b7", 12);

        /* Animated photon */
        const t = ((time * 0.0003) % 2);
        if (t < 1) {
          const phX = incSrc.x + (hitX - incSrc.x) * t;
          const phY = incSrc.y + (interfaceY - incSrc.y) * t;
          ctx.save();
          ctx.beginPath();
          ctx.arc(phX, phY, 5, 0, Math.PI * 2);
          ctx.fillStyle = "#fef3c7";
          ctx.shadowColor = "#fbbf24";
          ctx.shadowBlur = 14;
          ctx.fill();
          ctx.restore();
        } else {
          const tt = t - 1;
          const phX = hitX + (refEnd.x - hitX) * tt;
          const phY = interfaceY + (refEnd.y - interfaceY) * tt;
          ctx.save();
          ctx.beginPath();
          ctx.arc(phX, phY, 5, 0, Math.PI * 2);
          ctx.fillStyle = "#a7f3d0";
          ctx.shadowColor = "#34d399";
          ctx.shadowBlur = 14;
          ctx.fill();
          ctx.restore();
        }

      } else {
        /* ── TIR ── */
        /* Reflected ray (obeys ∠i = ∠r) */
        const reflEnd: Point = {
          x: hitX + rayLen * Math.sin(theta1),
          y: interfaceY - rayLen * Math.cos(theta1),
        };
        line(ctx, { x: hitX, y: interfaceY }, reflEnd, "#f87171", 2.5);
        arrowHead(ctx, { x: hitX, y: interfaceY }, reflEnd, "#f87171");

        /* TIR glow flash */
        const flash = 0.5 + 0.5 * Math.sin(time * 0.006);
        ctx.save();
        const g = ctx.createRadialGradient(hitX, interfaceY, 0, hitX, interfaceY, 60);
        g.addColorStop(0, `rgba(248,113,113,${0.5 * flash})`);
        g.addColorStop(1, "rgba(248,113,113,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(hitX, interfaceY, 60, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        /* TIR label */
        ctx.save();
        ctx.font = "bold 15px Inter, sans-serif";
        ctx.fillStyle = `rgba(248,113,113,${0.7 + 0.3 * flash})`;
        ctx.textAlign = "center";
        ctx.fillText("⚡ TOTAL INTERNAL REFLECTION", W / 2, interfaceY - 80);
        ctx.restore();
      }

      /* Critical angle indicator */
      const ca = critAngle(media.n1, media.n2);
      if (ca !== null) {
        const caDeg = Math.round((ca * 180) / Math.PI);
        label(ctx, `Critical angle: ${caDeg}°`, W * 0.8, interfaceY - 30, "#fb923c", 12);
        /* Dashed line showing critical angle */
        const caEnd: Point = { x: hitX - rayLen * Math.sin(ca), y: interfaceY - rayLen * Math.cos(ca) };
        line(ctx, { x: hitX, y: interfaceY }, caEnd, "rgba(251,146,60,0.4)", 1.5, true);
      }
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [dims, angleDeg, mediaIdx]);

  const media = MEDIA[mediaIdx];
  const theta2 = snell((angleDeg * Math.PI) / 180, media.n1, media.n2);
  const t2Deg  = theta2 !== null ? Math.round((theta2 * 180) / Math.PI) : null;
  const ca     = critAngle(media.n1, media.n2);
  const caDeg  = ca !== null ? Math.round((ca * 180) / Math.PI) : null;

  return (
    <div className={styles.simCard}>
      <div className={styles.simHeader}>
        <div className={styles.simIcon}>🌊</div>
        <span className={styles.simTitle}>{title}</span>
        <span className={styles.simBadge}>{isTIR ? "TIR!" : "INTERACTIVE"}</span>
      </div>

      <div ref={containerRef} className={styles.canvasWrap}>
        <canvas ref={canvasRef} style={{ width: "100%", height: "auto", display: "block" }} />
      </div>

      <div className={styles.controls}>
        {/* Media selector */}
        <select
          className={styles.select}
          value={mediaIdx}
          onChange={e => setMediaIdx(Number(e.target.value))}
        >
          {MEDIA.map((m, i) => (
            <option key={i} value={i}>{m.name}</option>
          ))}
        </select>

        {/* Angle slider */}
        <div className={styles.sliderRow}>
          <span className={styles.sliderLabel}>θ₁ = {angleDeg}°</span>
          <input
            type="range" min={1} max={89} value={angleDeg}
            onChange={e => setAngleDeg(Number(e.target.value))}
            className={styles.slider}
          />
        </div>
      </div>

      <div className={styles.infoPanel}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Angle of incidence (θ₁):</span>
          <span className={styles.infoValue}>{angleDeg}°</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Angle of refraction (θ₂):</span>
          <span className={styles.infoValue} style={{ color: isTIR ? "#f87171" : undefined }}>
            {isTIR ? "TIR — No refracted ray" : `${t2Deg}°`}
          </span>
        </div>
        {caDeg && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Critical angle:</span>
            <span className={styles.infoValue}>{caDeg}°</span>
          </div>
        )}
        <div className={styles.formula}>n₁ sin θ₁ = n₂ sin θ₂</div>
        <div className={styles.formulaValues}>
          {media.n1.toFixed(2)} × sin({angleDeg}°) = {media.n2.toFixed(2)} × sin({t2Deg ?? "—"}°)
        </div>
      </div>
    </div>
  );
};

export default SnellsLawSim;
