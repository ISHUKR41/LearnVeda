/**
 * FILE: SnellsLawSim.tsx
 * LOCATION: frontend/src/components/simulations/light/refraction/SnellsLawSim.tsx
 * PURPOSE: Ultra-professional Snell's Law and Total Internal Reflection simulation.
 *
 * FEATURES:
 *   ─ Two media regions with animated wave textures
 *   ─ Incident ray bending at the boundary (Snell's Law)
 *   ─ Layered glow beam rendering (4-alpha-layer realistic light)
 *   ─ Multiple photon particles (3 per ray) with comet trails on incident + refracted rays
 *   ─ Sparkle star burst at the hit point
 *   ─ Angle slider (θ₁ = 1° – 89°) with real-time θ₂ display
 *   ─ Six media pairs: Air→Glass, Air→Water, Air→Diamond, and TIR pairs
 *   ─ Total Internal Reflection (TIR) with pulsing red glow flash
 *   ─ Normal line, angle arcs, reflected ray shown during TIR
 *   ─ Critical angle indicator and dashed line
 *   ─ Live formula: n₁ sinθ₁ = n₂ sinθ₂ with computed values
 *   ─ Fully responsive (ResizeObserver), HiDPI / Retina canvas
 *
 * PHYSICS: Snell's Law, Critical Angle = arcsin(n₂/n₁), Total Internal Reflection
 * LAST UPDATED: 2026-06-09
 */

"use client";

import React, { useRef, useState, useEffect } from "react";
import styles from "../SimulationEngine.module.css";

interface Point { x: number; y: number; }

/* ─────────────────────────────────────────
 * PHYSICS HELPERS
 * ───────────────────────────────────────── */
function snell(theta1: number, n1: number, n2: number): number | null {
  const s = (n1 * Math.sin(theta1)) / n2;
  if (Math.abs(s) > 1) return null;
  return Math.asin(s);
}

function critAngle(n1: number, n2: number): number | null {
  if (n1 <= n2) return null;
  return Math.asin(n2 / n1);
}

/* ─────────────────────────────────────────
 * MEDIA PAIRS
 * ───────────────────────────────────────── */
const MEDIA = [
  { name: "Air → Glass",          n1: 1.00, n2: 1.50, c1: "#1a2a4a", c2: "#1e3a8a" },
  { name: "Air → Water",          n1: 1.00, n2: 1.33, c1: "#1a2a4a", c2: "#164e63" },
  { name: "Air → Diamond",        n1: 1.00, n2: 2.42, c1: "#1a2a4a", c2: "#4a1d96" },
  { name: "Glass → Air (TIR!)",   n1: 1.50, n2: 1.00, c1: "#1e3a8a", c2: "#1a2a4a" },
  { name: "Water → Air (TIR!)",   n1: 1.33, n2: 1.00, c1: "#164e63", c2: "#1a2a4a" },
  { name: "Diamond → Air (TIR!)", n1: 2.42, n2: 1.00, c1: "#4a1d96", c2: "#1a2a4a" },
];

/* ─────────────────────────────────────────
 * DRAWING HELPERS
 * ───────────────────────────────────────── */

/** Layered glow beam (4 alpha/width layers) */
function glowBeam(ctx: CanvasRenderingContext2D, a: Point, b: Point, color: string, alpha = 1, baseW = 2.5) {
  [{ w: baseW * 7, a: 0.05 }, { w: baseW * 3.5, a: 0.13 }, { w: baseW * 1.8, a: 0.4 }, { w: baseW, a: 1.0 }]
    .forEach(layer => {
      ctx.save();
      ctx.strokeStyle = color; ctx.lineWidth = layer.w;
      ctx.globalAlpha = layer.a * alpha;
      ctx.shadowColor = color; ctx.shadowBlur = layer.w * 2; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.restore();
    });
}

/** Dashed line (for normal, virtual extensions) */
function dashedLine(ctx: CanvasRenderingContext2D, a: Point, b: Point, color: string, w = 1.5, dash = [6, 5]) {
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.setLineDash(dash); ctx.globalAlpha = 0.6;
  ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.restore();
}

/** Arrow head at 'to' */
function arrowHead(ctx: CanvasRenderingContext2D, from: Point, to: Point, color: string, size = 10) {
  const ang = Math.atan2(to.y - from.y, to.x - from.x);
  ctx.save();
  ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 8; ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(to.x - size * Math.cos(ang - 0.38), to.y - size * Math.sin(ang - 0.38));
  ctx.lineTo(to.x - size * Math.cos(ang + 0.38), to.y - size * Math.sin(ang + 0.38));
  ctx.closePath(); ctx.fill(); ctx.restore();
}

/** Centered label */
function lbl(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color = "#e2e8f0", size = 12, box = false) {
  ctx.save();
  ctx.font = `600 ${size}px Inter, system-ui, sans-serif`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  if (box) {
    const w = ctx.measureText(text).width + 10;
    ctx.fillStyle = "rgba(8,15,31,0.75)";
    ctx.beginPath(); ctx.roundRect(x - w/2, y - size/2 - 3, w, size + 6, 4); ctx.fill();
  }
  ctx.fillStyle = color; ctx.fillText(text, x, y); ctx.restore();
}

/** Sparkle at hit point */
function sparkle(ctx: CanvasRenderingContext2D, cx: number, cy: number, time: number, color: string) {
  const rot = time * 0.001, pulse = 0.75 + 0.25 * Math.sin(time * 0.004);
  const outer = 10 * pulse, inner = 3.5;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
  ctx.fillStyle = "#fef3c7"; ctx.shadowColor = color; ctx.shadowBlur = 22;
  ctx.beginPath();
  for (let i = 0; i < 12; i++) {
    const ang = (i * Math.PI) / 6;
    const r = i % 2 === 0 ? outer : inner;
    if (i === 0) ctx.moveTo(r * Math.cos(ang), r * Math.sin(ang));
    else ctx.lineTo(r * Math.cos(ang), r * Math.sin(ang));
  }
  ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff"; ctx.shadowBlur = 30; ctx.fill();
  ctx.restore();
}

/** Photon stream with comet trails */
function photonStream(ctx: CanvasRenderingContext2D, from: Point, to: Point, time: number, color: string, n = 3, speed = 0.00016) {
  for (let i = 0; i < n; i++) {
    const base = ((time * speed) + i / n) % 1;
    for (let t = 4; t >= 1; t--) {
      const tp = Math.max(0, base - t * 0.035);
      ctx.save();
      ctx.beginPath();
      ctx.arc(from.x + (to.x - from.x) * tp, from.y + (to.y - from.y) * tp, Math.max(1, 4 - t), 0, Math.PI * 2);
      ctx.fillStyle = color; ctx.globalAlpha = 0.45 - t * 0.1; ctx.fill(); ctx.restore();
    }
    const px = from.x + (to.x - from.x) * base, py = from.y + (to.y - from.y) * base;
    ctx.save();
    ctx.beginPath(); ctx.arc(px, py, 4.5, 0, Math.PI * 2);
    const g = ctx.createRadialGradient(px, py, 0, px, py, 6);
    g.addColorStop(0, "#ffffff"); g.addColorStop(0.4, color); g.addColorStop(1, "transparent");
    ctx.fillStyle = g; ctx.shadowColor = color; ctx.shadowBlur = 16; ctx.fill(); ctx.restore();
  }
}

/* ═══════════════════════════════════════════════════
 * COMPONENT: SnellsLawSim
 * ═══════════════════════════════════════════════════ */
const SnellsLawSim: React.FC<{ id?: string; title?: string }> = ({
  id = "snells-law-sim",
  title = "Snell's Law — Refraction of Light",
}) => {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);

  const [angleDeg, setAngleDeg] = useState(35);
  const [mediaIdx,  setMediaIdx]  = useState(0);
  const [dims, setDims] = useState({ w: 580, h: 400 });
  const [isTIR, setIsTIR] = useState(false);

  /* ── Responsive sizing ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = Math.max(280, el.clientWidth || 580);
      setDims({ w, h: Math.round(w * 0.64) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ══════════════════════════════════════════
   * ANIMATION LOOP
   * ══════════════════════════════════════════ */
  useEffect(() => {
    let running = true;

    function draw(time: number) {
      if (!running) return;
      rafRef.current = requestAnimationFrame(draw);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const W = dims.w, H = dims.h;
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width  !== Math.round(W * dpr)) canvas.width  = Math.round(W * dpr);
      if (canvas.height !== Math.round(H * dpr)) canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const media = MEDIA[mediaIdx];
      const interfaceY = H * 0.47;
      const hitX = W * 0.5;

      /* ── Two media gradient backgrounds ── */
      const g1 = ctx.createLinearGradient(0, 0, 0, interfaceY);
      g1.addColorStop(0, "#060d18"); g1.addColorStop(1, media.c1 + "70");
      ctx.fillStyle = g1; ctx.fillRect(0, 0, W, interfaceY);

      const g2 = ctx.createLinearGradient(0, interfaceY, 0, H);
      g2.addColorStop(0, media.c2 + "90"); g2.addColorStop(1, media.c2 + "25");
      ctx.fillStyle = g2; ctx.fillRect(0, interfaceY, W, H - interfaceY);

      /* ── Animated wave textures inside each medium ── */
      const wAmp = 3, wFreq = 0.04, wSpd = 0.003;
      for (let k = 0; k < 2; k++) {
        const wColor = k === 0 ? media.c1 : media.c2;
        ctx.save(); ctx.strokeStyle = wColor + "90"; ctx.lineWidth = 1;
        for (let i = 1; i <= 3; i++) {
          const baseY = k === 0 ? interfaceY - i * 28 : interfaceY + i * 28;
          ctx.beginPath();
          for (let x = 0; x <= W; x += 4) {
            const y = baseY + wAmp * Math.sin(x * wFreq + (k === 0 ? 1 : -1) * time * wSpd + i);
            if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        ctx.restore();
      }

      /* ── Interface line ── */
      dashedLine(ctx, { x: 0, y: interfaceY }, { x: W, y: interfaceY }, "rgba(148,163,184,0.5)", 1.5, [10, 5]);

      /* Media labels with glow boxes */
      lbl(ctx, `n₁ = ${media.n1.toFixed(2)} · ${media.name.split("→")[0].trim()}`,
        W * 0.18, H * 0.1, "#94a3b8", 12, true);
      lbl(ctx, `n₂ = ${media.n2.toFixed(2)} · ${media.name.split("→")[1].trim()}`,
        W * 0.18, interfaceY + 26, "#94a3b8", 12, true);

      /* ── Normal line (dashed, vertical) ── */
      const normalLen = H * 0.42;
      dashedLine(ctx,
        { x: hitX, y: interfaceY - normalLen },
        { x: hitX, y: interfaceY + normalLen },
        "#94a3b8", 1.5, [5, 5]
      );
      lbl(ctx, "N", hitX + 14, interfaceY - normalLen + 14, "#64748b", 11);

      /* ── Physics ── */
      const theta1  = (angleDeg * Math.PI) / 180;
      const theta2  = snell(theta1, media.n1, media.n2);
      const tirNow  = theta2 === null;
      setIsTIR(tirNow);
      const rayLen  = H * 0.42;

      /* Incident ray */
      const incSrc: Point = {
        x: hitX - rayLen * Math.sin(theta1),
        y: interfaceY - rayLen * Math.cos(theta1),
      };
      const hitPt: Point = { x: hitX, y: interfaceY };

      glowBeam(ctx, incSrc, hitPt, "#fbbf24");
      arrowHead(ctx, incSrc, hitPt, "#fbbf24");
      photonStream(ctx, incSrc, hitPt, time, "#fbbf24");

      if (!tirNow && theta2 !== null) {
        /* ── Normal refraction ── */
        const refEnd: Point = {
          x: hitX + rayLen * Math.sin(theta2),
          y: interfaceY + rayLen * Math.cos(theta2),
        };

        glowBeam(ctx, hitPt, refEnd, "#10b981");
        arrowHead(ctx, hitPt, refEnd, "#10b981");
        photonStream(ctx, hitPt, refEnd, time + 700, "#10b981");

        /* Angle arcs */
        const arcR = 46;
        /* θ₁ */
        ctx.save();
        ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 2; ctx.globalAlpha = 0.8;
        ctx.shadowColor = "#fbbf24"; ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(hitX, interfaceY, arcR, -Math.PI/2 - theta1, -Math.PI/2, false);
        ctx.stroke(); ctx.restore();
        lbl(ctx, `θ₁ = ${angleDeg}°`, hitX - arcR - 32, interfaceY - arcR * 0.6, "#fde68a", 12, true);

        /* θ₂ */
        const t2Deg = Math.round((theta2 * 180) / Math.PI);
        ctx.save();
        ctx.strokeStyle = "#10b981"; ctx.lineWidth = 2; ctx.globalAlpha = 0.8;
        ctx.shadowColor = "#10b981"; ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(hitX, interfaceY, arcR + 8, Math.PI/2, Math.PI/2 + theta2, false);
        ctx.stroke(); ctx.restore();
        lbl(ctx, `θ₂ = ${t2Deg}°`, hitX + arcR + 32, interfaceY + arcR * 0.6, "#6ee7b7", 12, true);

        /* Sparkle at hit point */
        sparkle(ctx, hitX, interfaceY, time, "#10b981");

      } else {
        /* ── Total Internal Reflection ── */
        const reflEnd: Point = {
          x: hitX + rayLen * Math.sin(theta1),
          y: interfaceY - rayLen * Math.cos(theta1),
        };

        glowBeam(ctx, hitPt, reflEnd, "#f87171");
        arrowHead(ctx, hitPt, reflEnd, "#f87171");
        photonStream(ctx, hitPt, reflEnd, time + 700, "#f87171");

        /* Pulsing glow at hit point */
        const flash = 0.5 + 0.5 * Math.sin(time * 0.006);
        ctx.save();
        const fg = ctx.createRadialGradient(hitX, interfaceY, 0, hitX, interfaceY, 70);
        fg.addColorStop(0, `rgba(248,113,113,${0.55 * flash})`);
        fg.addColorStop(1, "rgba(248,113,113,0)");
        ctx.fillStyle = fg;
        ctx.beginPath(); ctx.arc(hitX, interfaceY, 70, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        /* Sparkle at hit point */
        sparkle(ctx, hitX, interfaceY, time, "#f87171");

        /* TIR warning label */
        ctx.save();
        ctx.font = `bold 14px Inter, sans-serif`;
        ctx.fillStyle = `rgba(248,113,113,${0.7 + 0.3 * flash})`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.shadowColor = "#f87171"; ctx.shadowBlur = 12;
        ctx.fillText("⚡ TOTAL INTERNAL REFLECTION", W / 2, interfaceY - 72);
        ctx.restore();
      }

      /* Critical angle indicator */
      const ca = critAngle(media.n1, media.n2);
      if (ca !== null) {
        const caDeg = Math.round((ca * 180) / Math.PI);
        lbl(ctx, `θc = ${caDeg}°`, W * 0.82, interfaceY - 28, "#fb923c", 12, true);
        dashedLine(ctx,
          hitPt,
          { x: hitX - rayLen * Math.sin(ca), y: interfaceY - rayLen * Math.cos(ca) },
          "rgba(251,146,60,0.45)", 1.5
        );
      }
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, [dims, angleDeg, mediaIdx]);

  /* Derived display values */
  const media = MEDIA[mediaIdx];
  const theta2 = snell((angleDeg * Math.PI) / 180, media.n1, media.n2);
  const t2Deg  = theta2 !== null ? Math.round((theta2 * 180) / Math.PI) : null;
  const ca     = critAngle(media.n1, media.n2);
  const caDeg  = ca !== null ? Math.round((ca * 180) / Math.PI) : null;

  /* ═══════════════════════════════════════════════════
   * RENDER
   * ═══════════════════════════════════════════════════ */
  return (
    <div className={styles.simCard}>
      {/* ── Header ── */}
      <div className={styles.simHeader}>
        <div className={styles.simIcon}>🌊</div>
        <span className={styles.simTitle}>{title}</span>
        <span className={styles.simBadge} style={{ color: isTIR ? "#f87171" : undefined }}>
          {isTIR ? "⚡ TIR!" : "INTERACTIVE"}
        </span>
      </div>

      {/* ── Canvas ── */}
      <div ref={containerRef} className={styles.canvasWrap}>
        <canvas ref={canvasRef} style={{ width: "100%", height: "auto", display: "block" }} />
      </div>

      {/* ── Controls ── */}
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
        <div className={styles.sliderRow} style={{ flex: 1, minWidth: 140 }}>
          <span className={styles.sliderLabel}>θ₁ = {angleDeg}°</span>
          <input
            type="range" min={1} max={89} value={angleDeg}
            onChange={e => setAngleDeg(Number(e.target.value))}
            className={styles.slider}
          />
        </div>
      </div>

      {/* ── Live values ── */}
      <div className={styles.infoRow}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>θ₁ (incidence)</span>
          <span className={styles.infoValue} style={{ color: "#fbbf24" }}>{angleDeg}°</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>θ₂ (refraction)</span>
          <span className={styles.infoValue} style={{ color: isTIR ? "#f87171" : "#10b981" }}>
            {isTIR ? "TIR!" : `${t2Deg}°`}
          </span>
        </div>
        {caDeg !== null && (
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Critical Angle</span>
            <span className={styles.infoValue} style={{ color: "#fb923c" }}>{caDeg}°</span>
          </div>
        )}
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>n₁ · sinθ₁</span>
          <span className={styles.infoValue}>
            {(media.n1 * Math.sin(angleDeg * Math.PI / 180)).toFixed(4)}
          </span>
        </div>
      </div>

      {/* ── Formula ── */}
      <div className={styles.formula}>
        <span className={styles.formulaLabel}>Snell's Law</span>
        <span className={styles.formulaExpr}>n₁ sin θ₁ = n₂ sin θ₂</span>
        <span className={styles.formulaValues}>
          {media.n1.toFixed(2)} × sin({angleDeg}°) = {media.n2.toFixed(2)} × sin({t2Deg ?? "—"}°)
        </span>
      </div>
    </div>
  );
};

export default SnellsLawSim;
