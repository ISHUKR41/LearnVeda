/**
 * FILE: ConvexLensSim.tsx
 * LOCATION: frontend/src/components/simulations/light/lenses/ConvexLensSim.tsx
 * PURPOSE: Ultra-professional interactive convex/concave lens simulation with
 *          full principal-ray tracing, particle photon animations, and glow effects.
 *
 * FEATURES:
 *   ─ Toggle between Convex (converging) and Concave (diverging) lens
 *   ─ Slider moves object through all 6 standard positions
 *   ─ Three colored principal rays with layered glow beams:
 *       Ray 1 (amber)  — parallel to axis → bends through F₂ / appears from F₁
 *       Ray 2 (green)  — through optical centre O → passes straight
 *       Ray 3 (red)    — aimed at F₁ → exits parallel (converging) / from F₂ (diverging)
 *   ─ Multiple photon particles (3 per ray) with comet trails
 *   ─ Sparkle burst at real image convergence point
 *   ─ Wave rings from object tip
 *   ─ Glassy biconvex / biconcave lens drawn with gradient fill
 *   ─ Dot-grid dark background with radial ambient glow
 *   ─ Live readout: u, v, m, image type
 *   ─ Fully responsive (ResizeObserver), HiDPI / Retina canvas
 *
 * PHYSICS: Lens formula 1/v − 1/u = 1/f, New Cartesian Sign Convention
 * LAST UPDATED: 2026-06-09
 */

"use client";

import React, { useRef, useState, useEffect } from "react";
import styles from "../SimulationEngine.module.css";

interface Point { x: number; y: number; }

/* ─────────────────────────────────────────
 * PHYSICS
 * ───────────────────────────────────────── */
function lensFormula(u: number, f: number): { v: number; m: number } | null {
  const denom = u + f;
  if (Math.abs(denom) < 0.5) return null;
  const v = (u * f) / denom;
  return { v, m: v / u };
}

function lensPositionLabel(u: number, f: number, type: "convex" | "concave"): string {
  if (type === "concave") return "Virtual · Erect · Diminished (same side as object)";
  const uAbs = Math.abs(u), fAbs = Math.abs(f), tF = 2 * fAbs;
  if (uAbs > tF + 2)           return "Diminished · Real · Inverted (between F₂ and 2F₂)";
  if (Math.abs(uAbs - tF) < 3) return "Same size · Real · Inverted (at 2F₂)";
  if (uAbs > fAbs && uAbs < tF) return "Magnified · Real · Inverted (beyond 2F₂)";
  if (Math.abs(uAbs - fAbs) < 3) return "Image at ∞ (object at F₁)";
  if (uAbs < fAbs)               return "Magnified · Virtual · Erect (same side)";
  return "";
}

/* ─────────────────────────────────────────
 * DRAWING HELPERS
 * ───────────────────────────────────────── */

/** Layered glow beam (4 alpha/width layers) */
function glowBeam(ctx: CanvasRenderingContext2D, a: Point, b: Point, color: string, alpha = 1, baseW = 2) {
  [{ w: baseW * 7, a: 0.05 }, { w: baseW * 3.5, a: 0.13 }, { w: baseW * 1.8, a: 0.4 }, { w: baseW, a: 1.0 }]
    .forEach(layer => {
      ctx.save();
      ctx.strokeStyle = color; ctx.lineWidth = layer.w;
      ctx.globalAlpha = layer.a * alpha;
      ctx.shadowColor = color; ctx.shadowBlur = layer.w * 2; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.restore();
    });
}

/** Dashed beam for virtual rays */
function dashedBeam(ctx: CanvasRenderingContext2D, a: Point, b: Point, color: string, w = 1.5) {
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.setLineDash([6, 5]); ctx.globalAlpha = 0.6;
  ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.restore();
}

/** Arrow head at 'to' */
function arrowHead(ctx: CanvasRenderingContext2D, from: Point, to: Point, color: string, size = 9) {
  const ang = Math.atan2(to.y - from.y, to.x - from.x);
  ctx.save();
  ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 8; ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(to.x - size * Math.cos(ang - 0.42), to.y - size * Math.sin(ang - 0.42));
  ctx.lineTo(to.x - size * Math.cos(ang + 0.42), to.y - size * Math.sin(ang + 0.42));
  ctx.closePath(); ctx.fill(); ctx.restore();
}

/** Glowing dot */
function glowDot(ctx: CanvasRenderingContext2D, p: Point, color: string, r = 5) {
  ctx.save();
  ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
  ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 16; ctx.fill(); ctx.restore();
}

/** Centered label with optional background box */
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

/** Dot grid background */
function dotGrid(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const step = 36;
  ctx.save(); ctx.fillStyle = "rgba(148,163,184,0.055)";
  for (let x = step; x < W; x += step)
    for (let y = step; y < H; y += step) {
      ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI * 2); ctx.fill();
    }
  ctx.restore();
}

/** Pulsing wave rings */
function waveRings(ctx: CanvasRenderingContext2D, cx: number, cy: number, time: number, color: string) {
  for (let i = 0; i < 4; i++) {
    const phase = ((time / 1800) + i / 4) % 1;
    ctx.save();
    ctx.strokeStyle = color; ctx.lineWidth = 1.5;
    ctx.globalAlpha = (1 - phase) * 0.45;
    ctx.beginPath(); ctx.arc(cx, cy, phase * 52, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }
}

/** Sparkle star burst */
function sparkle(ctx: CanvasRenderingContext2D, cx: number, cy: number, time: number) {
  const rot = time * 0.0008, pulse = 0.75 + 0.25 * Math.sin(time * 0.004);
  const outer = 11 * pulse, inner = 4;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
  ctx.fillStyle = "#fef3c7"; ctx.shadowColor = "#10b981"; ctx.shadowBlur = 22;
  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const ang = (i * Math.PI) / 8;
    const r = i % 2 === 0 ? outer : inner;
    if (i === 0) ctx.moveTo(r * Math.cos(ang), r * Math.sin(ang));
    else ctx.lineTo(r * Math.cos(ang), r * Math.sin(ang));
  }
  ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff"; ctx.shadowBlur = 30; ctx.fill();
  ctx.restore();
}

/** Animated photon stream with comet trails */
function photonStream(ctx: CanvasRenderingContext2D, from: Point, to: Point, time: number, color: string, n = 3, speed = 0.00017) {
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

/** Draw biconvex or biconcave lens shape */
function drawLens(ctx: CanvasRenderingContext2D, cx: number, cy: number, halfH: number, type: "convex" | "concave") {
  ctx.save();
  ctx.shadowColor = "#818cf8"; ctx.shadowBlur = 16;
  ctx.strokeStyle = "#a5b4fc"; ctx.lineWidth = 3;

  const lw = halfH * 0.18;
  const rx = halfH * 0.7;
  const ang = Math.asin(Math.min(1, halfH / rx));

  if (type === "convex") {
    /* Left arc — bulges left */
    ctx.beginPath(); ctx.arc(cx - rx + lw, cy, rx, -ang, ang, false); ctx.stroke();
    /* Right arc — bulges right */
    ctx.beginPath(); ctx.arc(cx + rx - lw, cy, rx, Math.PI - ang, Math.PI + ang, false); ctx.stroke();
    /* Glassy fill */
    const clip = new Path2D();
    clip.arc(cx - rx + lw, cy, rx, -ang, ang, false);
    clip.arc(cx + rx - lw, cy, rx, Math.PI + ang, Math.PI - ang, false);
    clip.closePath();
    ctx.save(); ctx.globalAlpha = 0.12;
    const fillGrad = ctx.createLinearGradient(cx - lw, cy - halfH, cx + lw, cy + halfH);
    fillGrad.addColorStop(0, "#818cf8"); fillGrad.addColorStop(1, "#c4b5fd");
    ctx.fillStyle = fillGrad; ctx.fill(clip); ctx.restore();
  } else {
    /* Concave: arcs curve inward */
    ctx.beginPath(); ctx.arc(cx + rx - lw, cy, rx, Math.PI - ang, Math.PI + ang, false); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx - rx + lw, cy, rx, -ang, ang, false); ctx.stroke();
    /* Edge lines */
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx - lw * 0.5, cy - halfH);
    ctx.lineTo(cx + lw * 0.5, cy - halfH);
    ctx.moveTo(cx - lw * 0.5, cy + halfH);
    ctx.lineTo(cx + lw * 0.5, cy + halfH);
    ctx.stroke();
  }

  /* Optical axis arrows on lens */
  ctx.strokeStyle = "#a5b4fc"; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.moveTo(cx, cy - halfH - 10); ctx.lineTo(cx, cy + halfH + 10); ctx.stroke();
  ctx.restore();
}

/* ═══════════════════════════════════════════════════
 * COMPONENT: ConvexLensSim
 * ═══════════════════════════════════════════════════ */
const ConvexLensSim: React.FC<{ id?: string; title?: string }> = ({
  id = "convex-lens-sim",
  title = "Lens — Image Formation",
}) => {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);

  const [objSlider, setObjSlider]   = useState(65);
  const [lensType,  setLensType]    = useState<"convex" | "concave">("convex");
  const [showRay1,  setShowRay1]    = useState(true);
  const [showRay2,  setShowRay2]    = useState(true);
  const [showRay3,  setShowRay3]    = useState(true);
  const [dims,      setDims]        = useState({ w: 640, h: 380 });
  const [imgInfo,   setImgInfo]     = useState({ u: 0, v: 0, m: 0, label: "" });

  /* ── Responsive sizing ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = Math.max(280, el.clientWidth || 640);
      setDims({ w, h: Math.round(w * 0.58) });
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

      /* ── Background ── */
      const bg = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, W * 0.8);
      bg.addColorStop(0, "#0d1829"); bg.addColorStop(1, "#060d18");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      dotGrid(ctx, W, H);

      /* ── Layout ── */
      const axisY  = H * 0.52;
      const lensX  = W * 0.5;
      const fLen   = W * 0.18;
      const f1: Point = { x: lensX - fLen, y: axisY };  /* F₁ — near side */
      const f2: Point = { x: lensX + fLen, y: axisY };  /* F₂ — far side  */
      const tF1: Point = { x: lensX - 2 * fLen, y: axisY };
      const tF2: Point = { x: lensX + 2 * fLen, y: axisY };
      const halfH = H * 0.4;

      /* ── Principal axis ── */
      ctx.save();
      ctx.strokeStyle = "rgba(148,163,184,0.25)"; ctx.lineWidth = 1; ctx.setLineDash([6, 6]);
      ctx.beginPath(); ctx.moveTo(0, axisY); ctx.lineTo(W, axisY); ctx.stroke(); ctx.restore();

      /* ── Lens ── */
      drawLens(ctx, lensX, axisY, halfH, lensType);

      /* ── Focal & 2F points ── */
      glowDot(ctx, f1,  "#fbbf24", 5);
      glowDot(ctx, f2,  "#fbbf24", 5);
      glowDot(ctx, tF1, "#f87171", 4);
      glowDot(ctx, tF2, "#f87171", 4);
      lbl(ctx, "F₁", f1.x,  axisY + 16, "#fde68a", 12, true);
      lbl(ctx, "F₂", f2.x,  axisY + 16, "#fde68a", 12, true);
      lbl(ctx, "2F₁", tF1.x, axisY + 16, "#fca5a5", 11);
      lbl(ctx, "2F₂", tF2.x, axisY + 16, "#fca5a5", 11);
      lbl(ctx, "O",   lensX, axisY + 16, "#94a3b8", 12);

      /* ── Object ── */
      const objX   = lensX - (objSlider / 100) * (lensX - 22);
      const u_px   = objX - lensX; /* negative */
      const f_sign = lensType === "convex" ? fLen : -fLen;
      const arrowH = H * 0.28;
      const objTip:  Point = { x: objX, y: axisY - arrowH };
      const objBase: Point = { x: objX, y: axisY };

      glowBeam(ctx, objBase, objTip, "#60a5fa", 1, 2.5);
      arrowHead(ctx, objBase, objTip, "#60a5fa");
      glowDot(ctx, objBase, "#60a5fa", 4);
      lbl(ctx, "Object", objX, objTip.y - 16, "#93c5fd", 12, true);
      waveRings(ctx, objTip.x, objTip.y, time, "#60a5fa");

      /* ── Image calculation ── */
      const result = lensFormula(u_px, f_sign);
      let showImg = false, v_px = 0, m_val = 0;
      if (result) {
        v_px = result.v; m_val = result.m;
        showImg = Math.abs(v_px) < W * 1.5;
      }

      const newU = Math.round(u_px), newV = Math.round(v_px), newM = Math.round(m_val * 100) / 100;
      setImgInfo(prev => {
        if (prev.u === newU && prev.v === newV && prev.m === newM) return prev;
        return { u: newU, v: newV, m: newM, label: lensPositionLabel(u_px, f_sign, lensType) };
      });

      if (showImg) {
        const imgX = lensX + v_px;
        const imgHt = arrowH * Math.abs(m_val);
        const imgSign = m_val < 0 ? -1 : 1;
        const imgTip:  Point = { x: imgX, y: axisY - imgSign * Math.min(imgHt, H * 0.44) };
        const imgBase: Point = { x: imgX, y: axisY };
        const isVirtual = v_px < 0;

        /* ── Ray 1: Parallel to axis → bends through F₂ ── */
        if (showRay1) {
          const r1Hit: Point = { x: lensX, y: objTip.y };
          glowBeam(ctx, objTip, r1Hit, "#fbbf24", 0.85);
          arrowHead(ctx, objTip, r1Hit, "#fbbf24");
          if (lensType === "convex") {
            if (isVirtual) dashedBeam(ctx, r1Hit, imgTip, "#fbbf24");
            else { glowBeam(ctx, r1Hit, imgTip, "#fbbf24", 0.7); arrowHead(ctx, r1Hit, imgTip, "#fbbf24"); }
          } else {
            /* Diverging: appears to come from F₁ */
            const ext: Point = { x: 0, y: r1Hit.y + (r1Hit.y - f1.y) * r1Hit.x / (lensX - f1.x + 0.01) };
            glowBeam(ctx, r1Hit, { x: W, y: r1Hit.y + (r1Hit.y - axisY) * (W - lensX) / (lensX - f1.x + 0.01) }, "#fbbf24", 0.6);
            dashedBeam(ctx, r1Hit, f1, "#fbbf24");
          }
          photonStream(ctx, objTip, r1Hit, time, "#fbbf24");
          if (!isVirtual) photonStream(ctx, r1Hit, imgTip, time + 500, "#fbbf24");
        }

        /* ── Ray 2: Through optical centre O → straight ── */
        if (showRay2) {
          const centreHit: Point = { x: lensX, y: axisY + (objTip.y - axisY) * (lensX - objX) / (lensX - objX) };
          /* Line from objTip through lens centre, extrapolated */
          const slope = (axisY - objTip.y) / (lensX - objX);
          const extY  = objTip.y + slope * (W * 1.2 - objX);
          if (isVirtual) {
            glowBeam(ctx, objTip, centreHit, "#10b981", 0.85);
            dashedBeam(ctx, centreHit, imgTip, "#10b981");
          } else {
            glowBeam(ctx, objTip, imgTip, "#10b981", 0.85);
          }
          arrowHead(ctx, objTip, centreHit, "#10b981");
          photonStream(ctx, objTip, isVirtual ? centreHit : imgTip, time + 333, "#10b981");
        }

        /* ── Ray 3: Aimed at F₁ → exits parallel (convex) ── */
        if (showRay3 && lensType === "convex") {
          /* Ray from objTip aimed at F₁ hits lens at some y, then exits parallel */
          const slope3 = (f1.y - objTip.y) / (f1.x - objX);
          const r3HitY = objTip.y + slope3 * (lensX - objX);
          const r3Hit: Point = { x: lensX, y: r3HitY };
          glowBeam(ctx, objTip, r3Hit, "#f87171", 0.85);
          arrowHead(ctx, objTip, r3Hit, "#f87171");
          if (isVirtual) dashedBeam(ctx, r3Hit, imgTip, "#f87171");
          else { glowBeam(ctx, r3Hit, imgTip, "#f87171", 0.7); arrowHead(ctx, r3Hit, imgTip, "#f87171"); }
          photonStream(ctx, objTip, r3Hit, time + 666, "#f87171");
          if (!isVirtual) photonStream(ctx, r3Hit, imgTip, time + 900, "#f87171");
        }

        /* ── Image arrow ── */
        const imgColor = isVirtual ? "#c4b5fd" : "#4ade80";
        if (isVirtual) dashedBeam(ctx, imgBase, imgTip, imgColor, 2.5);
        else { glowBeam(ctx, imgBase, imgTip, imgColor); arrowHead(ctx, imgBase, imgTip, imgColor); }
        glowDot(ctx, imgBase, imgColor, 3);
        lbl(ctx, isVirtual ? "Image (virtual)" : "Image (real)",
          imgX, imgTip.y - 18, isVirtual ? "#c4b5fd" : "#86efac", 11, true);

        /* ── Sparkle at real image ── */
        if (!isVirtual && Math.abs(v_px) < W * 0.85) sparkle(ctx, imgTip.x, imgTip.y, time);
      }

      /* ── Lens type label ── */
      lbl(ctx, lensType === "convex" ? "Convex (Converging)" : "Concave (Diverging)",
        lensX, H * 0.08, "#a5b4fc", 12, true);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, [dims, objSlider, lensType, showRay1, showRay2, showRay3]);

  /* ═══════════════════════════════════════════════════
   * RENDER
   * ═══════════════════════════════════════════════════ */
  return (
    <div className={styles.simCard}>
      {/* ── Header ── */}
      <div className={styles.simHeader}>
        <div className={styles.simIcon}>🔬</div>
        <span className={styles.simTitle}>{title}</span>
        <span className={styles.simBadge}>INTERACTIVE</span>
      </div>

      {/* ── Canvas ── */}
      <div ref={containerRef} className={styles.canvasWrap}>
        <canvas ref={canvasRef} style={{ width: "100%", height: "auto", display: "block" }} />
      </div>

      {/* ── Controls ── */}
      <div className={styles.controls}>
        {/* Lens type */}
        <div className={styles.btnGroup}>
          <button className={`${styles.toggleBtn} ${lensType === "convex"  ? styles.active : ""}`}
            onClick={() => setLensType("convex")}>Convex</button>
          <button className={`${styles.toggleBtn} ${lensType === "concave" ? styles.active : ""}`}
            onClick={() => setLensType("concave")}>Concave</button>
        </div>

        {/* Object distance slider */}
        <div className={styles.sliderRow} style={{ flex: 1, minWidth: 140 }}>
          <span className={styles.sliderLabel}>Object u</span>
          <input type="range" min={5} max={95} value={objSlider}
            onChange={e => setObjSlider(Number(e.target.value))}
            className={styles.slider} />
        </div>

        {/* Ray toggles */}
        <div className={styles.rayToggles}>
          <button className={`${styles.rayBtn} ${showRay1 ? styles.rayActive1 : ""}`}
            onClick={() => setShowRay1(r => !r)}>R1</button>
          <button className={`${styles.rayBtn} ${showRay2 ? styles.rayActive2 : ""}`}
            onClick={() => setShowRay2(r => !r)}>R2</button>
          {lensType === "convex" && (
            <button className={`${styles.rayBtn} ${showRay3 ? styles.rayActive3 : ""}`}
              onClick={() => setShowRay3(r => !r)}>R3</button>
          )}
        </div>
      </div>

      {/* ── Live values ── */}
      <div className={styles.infoRow}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Object (u)</span>
          <span className={styles.infoValue} style={{ color: "#60a5fa" }}>{imgInfo.u} px</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Image (v)</span>
          <span className={styles.infoValue} style={{ color: "#fbbf24" }}>{imgInfo.v} px</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Magnification</span>
          <span className={styles.infoValue} style={{ color: "#a78bfa" }}>m = {imgInfo.m}</span>
        </div>
        <div className={styles.infoItem} style={{ minWidth: "100%", flex: "1 1 100%" }}>
          <span className={styles.infoLabel}>Image Type</span>
          <span className={styles.infoValue} style={{ color: "#86efac", fontSize: "11px" }}>
            {imgInfo.label || "—"}
          </span>
        </div>
      </div>

      {/* ── Formula bar ── */}
      <div className={styles.formula}>
        <span className={styles.formulaLabel}>Lens Formula</span>
        <span className={styles.formulaExpr}>1/v − 1/u = 1/f</span>
        {imgInfo.v !== 0 && (
          <span className={styles.formulaValues}>
            1/{imgInfo.v} − 1/{imgInfo.u} = 1/f
          </span>
        )}
      </div>
    </div>
  );
};

export default ConvexLensSim;
