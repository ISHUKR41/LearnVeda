/**
 * FILE: ConcaveMirrorSim.tsx
 * LOCATION: frontend/src/components/simulations/light/mirrors/ConcaveMirrorSim.tsx
 * PURPOSE: Ultra-professional, highly animated concave/convex mirror simulation
 *          with full ray tracing, multi-photon animations, and particle effects.
 *
 * FEATURES:
 *   ─ Toggle between Concave (converging) and Convex (diverging) mirror
 *   ─ Slider moves object through all 6 standard positions
 *   ─ Three colored principal rays (yellow / green / red) with glowing layered beams
 *   ─ Individual ray toggle buttons (Ray 1 / Ray 2 / Ray 3)
 *   ─ Multiple photon particles (3 per ray) with comet trails
 *   ─ Sparkle burst at image convergence point
 *   ─ Wave rings from object tip
 *   ─ Dot-grid professional dark background with radial ambient glow
 *   ─ Mirror formula live readout: u, v, m, image type
 *   ─ Fully responsive (ResizeObserver), HiDPI / Retina canvas
 *
 * PHYSICS: Mirror formula 1/v + 1/u = 1/f, New Cartesian Sign Convention
 * LAST UPDATED: 2026-06-09
 */

"use client";

import React, { useRef, useState, useEffect } from "react";
import styles from "../SimulationEngine.module.css";

interface Point { x: number; y: number; }

/* ─────────────────────────────────────────
 * PHYSICS
 * ───────────────────────────────────────── */
function calcImage(u_px: number, f_px: number): { v: number; m: number } | null {
  const denom = u_px - f_px;
  if (Math.abs(denom) < 0.001) return null;
  const v = (u_px * f_px) / denom;
  return { v, m: -v / u_px };
}

function positionLabel(u: number, f: number, type: "concave" | "convex"): string {
  if (type === "convex") return "Virtual · Erect · Diminished (behind mirror)";
  const uAbs = Math.abs(u), fAbs = Math.abs(f), cAbs = 2 * fAbs;
  if (uAbs > cAbs + 2)          return "Diminished · Real · Inverted (between F and C)";
  if (Math.abs(uAbs - cAbs) < 3) return "Same size · Real · Inverted (at C)";
  if (uAbs > fAbs && uAbs < cAbs) return "Magnified · Real · Inverted (beyond C)";
  if (Math.abs(uAbs - fAbs) < 3)  return "Image at ∞ (object at F)";
  if (uAbs < fAbs)                 return "Magnified · Virtual · Erect (behind mirror)";
  return "";
}

/* ─────────────────────────────────────────
 * DRAWING HELPERS
 * ───────────────────────────────────────── */

/** Layered glow beam — 4 alpha layers for realistic light appearance */
function glowBeam(
  ctx: CanvasRenderingContext2D,
  a: Point, b: Point,
  color: string,
  alpha = 1.0,
  baseW = 2
) {
  [{ w: baseW * 7, a: 0.05 }, { w: baseW * 3.5, a: 0.13 }, { w: baseW * 1.8, a: 0.4 }, { w: baseW, a: 1.0 }]
    .forEach(layer => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = layer.w;
      ctx.globalAlpha = layer.a * alpha;
      ctx.shadowColor = color;
      ctx.shadowBlur = layer.w * 2;
      ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      ctx.restore();
    });
}

/** Dashed line for virtual rays */
function dashedBeam(ctx: CanvasRenderingContext2D, a: Point, b: Point, color: string, w = 1.5) {
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = w;
  ctx.setLineDash([6, 5]); ctx.globalAlpha = 0.6;
  ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  ctx.restore();
}

/** Solid arrow head at 'to' point */
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

/** Centered text label with optional background */
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

/** Draw dot-pattern grid */
function dotGrid(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const step = 36;
  ctx.save(); ctx.fillStyle = "rgba(148,163,184,0.055)";
  for (let x = step; x < W; x += step)
    for (let y = step; y < H; y += step) {
      ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI * 2); ctx.fill();
    }
  ctx.restore();
}

/** Pulsing wave rings from a point */
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
function sparkle(ctx: CanvasRenderingContext2D, cx: number, cy: number, time: number, color = "#fbbf24") {
  const rot = time * 0.0008;
  const pulse = 0.75 + 0.25 * Math.sin(time * 0.004);
  const outer = 12 * pulse, inner = 4;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
  ctx.fillStyle = "#fef3c7"; ctx.shadowColor = color; ctx.shadowBlur = 20;
  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const ang = (i * Math.PI) / 8;
    const r = i % 2 === 0 ? outer : inner;
    if (i === 0) ctx.moveTo(r * Math.cos(ang), r * Math.sin(ang));
    else ctx.lineTo(r * Math.cos(ang), r * Math.sin(ang));
  }
  ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff"; ctx.shadowBlur = 28; ctx.fill();
  ctx.restore();
}

/** Animated photon stream with comet trails along a line segment */
function photonStream(
  ctx: CanvasRenderingContext2D,
  from: Point, to: Point,
  time: number, color: string,
  n = 3, speed = 0.00017
) {
  for (let i = 0; i < n; i++) {
    const base = ((time * speed) + i / n) % 1;
    for (let t = 4; t >= 1; t--) {
      const tp = Math.max(0, base - t * 0.035);
      ctx.save();
      ctx.beginPath();
      ctx.arc(from.x + (to.x - from.x) * tp, from.y + (to.y - from.y) * tp, Math.max(1, 4 - t), 0, Math.PI * 2);
      ctx.fillStyle = color; ctx.globalAlpha = (0.45 - t * 0.1); ctx.fill(); ctx.restore();
    }
    /* Head */
    ctx.save();
    ctx.beginPath();
    ctx.arc(from.x + (to.x - from.x) * base, from.y + (to.y - from.y) * base, 4.5, 0, Math.PI * 2);
    const g = ctx.createRadialGradient(
      from.x + (to.x - from.x) * base, from.y + (to.y - from.y) * base, 0,
      from.x + (to.x - from.x) * base, from.y + (to.y - from.y) * base, 6);
    g.addColorStop(0, "#ffffff"); g.addColorStop(0.4, color); g.addColorStop(1, "transparent");
    ctx.fillStyle = g; ctx.shadowColor = color; ctx.shadowBlur = 16; ctx.fill(); ctx.restore();
  }
}

/* ═══════════════════════════════════════════════════
 * COMPONENT: ConcaveMirrorSim
 * ═══════════════════════════════════════════════════ */
const ConcaveMirrorSim: React.FC<{ id?: string; title?: string }> = ({
  id = "concave-mirror-sim",
  title = "Spherical Mirror — Image Formation",
}) => {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);

  const [objSlider, setObjSlider] = useState(60);
  const [mirrorType, setMirrorType] = useState<"concave" | "convex">("concave");
  const [showRay1, setShowRay1] = useState(true);
  const [showRay2, setShowRay2] = useState(true);
  const [showRay3, setShowRay3] = useState(true);
  const [dims, setDims] = useState({ w: 640, h: 380 });
  const [imageInfo, setImageInfo] = useState({ u: 0, v: 0, m: 0, label: "" });

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
      const bg = ctx.createRadialGradient(W * 0.4, H * 0.5, 0, W * 0.4, H * 0.5, W * 0.8);
      bg.addColorStop(0, "#0d1829"); bg.addColorStop(1, "#060d18");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      dotGrid(ctx, W, H);

      /* ── Layout ── */
      const axisY   = H * 0.52;
      const mirrorX = W * 0.78;
      const fLen    = W * 0.16;
      const R       = fLen * 2;
      const sign    = mirrorType === "concave" ? 1 : -1;
      const fXdraw  = mirrorX - sign * fLen;
      const cXdraw  = mirrorX - sign * R;

      /* ── Principal axis ── */
      ctx.save();
      ctx.strokeStyle = "rgba(148,163,184,0.28)"; ctx.lineWidth = 1;
      ctx.setLineDash([6, 6]);
      ctx.beginPath(); ctx.moveTo(0, axisY); ctx.lineTo(W, axisY); ctx.stroke();
      ctx.restore();

      /* ── Mirror arc with strong glow ── */
      const arcRadius = R;
      const arcSpan = Math.asin(Math.min(1, (H * 0.36) / arcRadius));
      const arcCenterX = mirrorType === "concave" ? mirrorX + arcRadius : mirrorX - arcRadius;
      const arcStart = Math.PI - arcSpan;
      const arcEnd   = Math.PI + arcSpan;

      ctx.save();
      ctx.shadowColor = "#818cf8"; ctx.shadowBlur = 18;
      ctx.strokeStyle = "#a5b4fc"; ctx.lineWidth = 4.5; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(arcCenterX, axisY,
        arcRadius,
        mirrorType === "concave" ? arcStart : -arcSpan,
        mirrorType === "concave" ? arcEnd   :  arcSpan,
        false
      );
      ctx.stroke();
      /* Hatching on back */
      ctx.strokeStyle = "rgba(129,140,248,0.2)"; ctx.lineWidth = 1; ctx.shadowBlur = 0;
      for (let i = 0; i <= 12; i++) {
        const a = arcStart + (arcEnd - arcStart) * (i / 12);
        const px = arcCenterX + arcRadius * Math.cos(a);
        const py = axisY + arcRadius * Math.sin(a);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + Math.cos(a) * 10, py + Math.sin(a) * 10);
        ctx.stroke();
      }
      ctx.restore();

      /* ── Key points ── */
      const pole:   Point = { x: mirrorX, y: axisY };
      const focus:  Point = { x: fXdraw,  y: axisY };
      const center: Point = { x: cXdraw,  y: axisY };

      glowDot(ctx, pole,   "#94a3b8", 4);
      glowDot(ctx, focus,  "#fbbf24", 6);
      glowDot(ctx, center, "#f87171", 6);
      lbl(ctx, "P", pole.x + 10,   axisY + 16, "#94a3b8", 12);
      lbl(ctx, "F", focus.x,        axisY + 16, "#fde68a", 13, true);
      lbl(ctx, "C", center.x,       axisY + 16, "#fca5a5", 13, true);

      /* ── Object arrow ── */
      const objX   = mirrorX - (objSlider / 100) * (mirrorX - 30);
      const u_px   = objX - mirrorX;
      const f_sign = mirrorType === "concave" ? -fLen : fLen;
      const arrowH = H * 0.28;
      const objTip:  Point = { x: objX, y: axisY - arrowH };
      const objBase: Point = { x: objX, y: axisY };

      glowBeam(ctx, objBase, objTip, "#60a5fa", 1, 2.5);
      arrowHead(ctx, objBase, objTip, "#60a5fa");
      glowDot(ctx, objBase, "#60a5fa", 4);
      lbl(ctx, "Object", objX, objTip.y - 16, "#93c5fd", 12, true);

      /* ── Wave rings from object tip ── */
      waveRings(ctx, objTip.x, objTip.y, time, "#60a5fa");

      /* ── Image calculation ── */
      const imgResult = calcImage(u_px, f_sign);
      let showImg = false, v_px = 0, m_val = 0;
      if (imgResult) {
        v_px = imgResult.v; m_val = imgResult.m;
        showImg = Math.abs(v_px) < W * 1.5;
      }

      /* Update info (throttled) */
      const newU = Math.round(u_px), newV = Math.round(v_px), newM = Math.round(m_val * 100) / 100;
      const newLabel = positionLabel(u_px, f_sign, mirrorType);
      setImageInfo(prev => {
        if (prev.u === newU && prev.v === newV && prev.m === newM) return prev;
        return { u: newU, v: newV, m: newM, label: newLabel };
      });

      /* ── Principal Rays ── */
      if (showImg && imgResult) {
        const imgX = mirrorX + v_px;
        const imgH = arrowH * Math.abs(m_val);
        const imgSign = m_val < 0 ? -1 : 1;
        const imgTip:  Point = { x: imgX, y: axisY - imgSign * Math.min(imgH, H * 0.44) };
        const imgBase: Point = { x: imgX, y: axisY };
        const isDash = v_px > 0 || mirrorType === "convex";

        /* ─ Ray 1: Parallel to axis → through F ─ */
        if (showRay1) {
          const r1Mid: Point = { x: mirrorX, y: objTip.y };
          glowBeam(ctx, objTip, r1Mid, "#fbbf24", 0.85);
          arrowHead(ctx, objTip, r1Mid, "#fbbf24");
          if (mirrorType === "concave" && Math.abs(v_px) < W) {
            if (isDash) dashedBeam(ctx, r1Mid, imgTip, "#fbbf24");
            else { glowBeam(ctx, r1Mid, imgTip, "#fbbf24", 0.7); arrowHead(ctx, r1Mid, imgTip, "#fbbf24"); }
          }
          photonStream(ctx, objTip, r1Mid, time, "#fbbf24");
          if (!isDash && Math.abs(v_px) < W) photonStream(ctx, r1Mid, imgTip, time + 500, "#fbbf24");
        }

        /* ─ Ray 2: Through F → reflects parallel ─ */
        if (showRay2 && mirrorType === "concave") {
          const r2Hit: Point = {
            x: mirrorX,
            y: axisY + (objTip.y - axisY) * (mirrorX - fXdraw) / (objX - fXdraw),
          };
          if (isFinite(r2Hit.y)) {
            glowBeam(ctx, objTip, r2Hit, "#10b981", 0.85);
            arrowHead(ctx, objTip, r2Hit, "#10b981");
            if (Math.abs(v_px) < W) {
              if (isDash) dashedBeam(ctx, r2Hit, imgTip, "#10b981");
              else { glowBeam(ctx, r2Hit, imgTip, "#10b981", 0.7); arrowHead(ctx, r2Hit, imgTip, "#10b981"); }
            }
            photonStream(ctx, objTip, r2Hit, time + 333, "#10b981");
          }
        }

        /* ─ Ray 3: Through C → reflects back ─ */
        if (showRay3 && mirrorType === "concave") {
          const r3Hit: Point = {
            x: mirrorX,
            y: axisY + (objTip.y - axisY) * (mirrorX - cXdraw) / (objX - cXdraw),
          };
          if (isFinite(r3Hit.y)) {
            glowBeam(ctx, objTip, r3Hit, "#f87171", 0.85);
            arrowHead(ctx, objTip, r3Hit, "#f87171");
            if (Math.abs(v_px) < W) {
              if (isDash) dashedBeam(ctx, r3Hit, imgTip, "#f87171");
              else { glowBeam(ctx, r3Hit, imgTip, "#f87171", 0.7); arrowHead(ctx, r3Hit, imgTip, "#f87171"); }
            }
            photonStream(ctx, objTip, r3Hit, time + 666, "#f87171");
          }
        }

        /* ── Image arrow ── */
        const imgColor = isDash ? "#c4b5fd" : "#4ade80";
        if (isDash) dashedBeam(ctx, imgBase, imgTip, imgColor, 2.5);
        else { glowBeam(ctx, imgBase, imgTip, imgColor); arrowHead(ctx, imgBase, imgTip, imgColor); }
        glowDot(ctx, imgBase, imgColor, 3);
        lbl(ctx, isDash ? "Image (virtual)" : "Image (real)", imgX, imgTip.y - 18, isDash ? "#c4b5fd" : "#86efac", 11, true);

        /* ── Sparkle at image point (only for real images) ── */
        if (!isDash && Math.abs(v_px) < W * 0.9) sparkle(ctx, imgTip.x, imgTip.y, time, imgColor);
      }

      /* ── Mirror type label ── */
      lbl(ctx, mirrorType === "concave" ? "Concave Mirror" : "Convex Mirror",
        mirrorX - 18, H * 0.09, "#a5b4fc", 13, true);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, [dims, objSlider, mirrorType, showRay1, showRay2, showRay3]);

  /* ═══════════════════════════════════════════════════
   * RENDER
   * ═══════════════════════════════════════════════════ */
  return (
    <div className={styles.simCard}>
      {/* ── Header ── */}
      <div className={styles.simHeader}>
        <div className={styles.simIcon}>🔍</div>
        <span className={styles.simTitle}>{title}</span>
        <span className={styles.simBadge}>INTERACTIVE</span>
      </div>

      {/* ── Canvas ── */}
      <div ref={containerRef} className={styles.canvasWrap}>
        <canvas ref={canvasRef} style={{ width: "100%", height: "auto", display: "block" }} />
      </div>

      {/* ── Controls ── */}
      <div className={styles.controls}>
        {/* Mirror type toggle */}
        <div className={styles.btnGroup}>
          <button className={`${styles.toggleBtn} ${mirrorType === "concave" ? styles.active : ""}`}
            onClick={() => setMirrorType("concave")}>Concave</button>
          <button className={`${styles.toggleBtn} ${mirrorType === "convex" ? styles.active : ""}`}
            onClick={() => setMirrorType("convex")}>Convex</button>
        </div>

        {/* Object distance slider */}
        <div className={styles.sliderRow} style={{ flex: 1, minWidth: 140 }}>
          <span className={styles.sliderLabel}>Object u</span>
          <input type="range" min={5} max={95} value={objSlider}
            onChange={e => setObjSlider(Number(e.target.value))}
            className={styles.slider} />
        </div>

        {/* Ray toggles */}
        {mirrorType === "concave" && (
          <div className={styles.rayToggles}>
            <button className={`${styles.rayBtn} ${showRay1 ? styles.rayActive1 : ""}`}
              onClick={() => setShowRay1(r => !r)}>R1</button>
            <button className={`${styles.rayBtn} ${showRay2 ? styles.rayActive2 : ""}`}
              onClick={() => setShowRay2(r => !r)}>R2</button>
            <button className={`${styles.rayBtn} ${showRay3 ? styles.rayActive3 : ""}`}
              onClick={() => setShowRay3(r => !r)}>R3</button>
          </div>
        )}
      </div>

      {/* ── Live calculation panel ── */}
      <div className={styles.infoRow}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Object (u)</span>
          <span className={styles.infoValue} style={{ color: "#60a5fa" }}>{imageInfo.u} px</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Image (v)</span>
          <span className={styles.infoValue} style={{ color: "#fbbf24" }}>{imageInfo.v} px</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Magnification</span>
          <span className={styles.infoValue} style={{ color: "#a78bfa" }}>m = {imageInfo.m}</span>
        </div>
        <div className={styles.infoItem} style={{ minWidth: "100%", flex: "1 1 100%" }}>
          <span className={styles.infoLabel}>Image Type</span>
          <span className={styles.infoValue} style={{ color: "#86efac", fontSize: "11px" }}>
            {imageInfo.label || "—"}
          </span>
        </div>
      </div>

      {/* ── Formula bar ── */}
      <div className={styles.formula}>
        <span className={styles.formulaLabel}>Mirror Formula</span>
        <span className={styles.formulaExpr}>1/v + 1/u = 1/f</span>
        {imageInfo.v !== 0 && (
          <span className={styles.formulaValues}>
            1/{imageInfo.v} + 1/{imageInfo.u} = 1/f
          </span>
        )}
      </div>
    </div>
  );
};

export default ConcaveMirrorSim;
