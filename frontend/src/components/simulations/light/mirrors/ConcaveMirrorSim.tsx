/**
 * FILE: ConcaveMirrorSim.tsx
 * LOCATION: frontend/src/components/simulations/light/mirrors/ConcaveMirrorSim.tsx
 * PURPOSE: Interactive concave/convex mirror simulation with full ray tracing.
 *
 * FEATURES:
 *   - Slider to move object through all 6 standard positions
 *   - Toggle between Concave and Convex mirror
 *   - Three colored principal rays drawn correctly:
 *       Ray 1 (yellow) : Parallel to axis → reflects through F (concave) / appears to come from F (convex)
 *       Ray 2 (cyan)   : Through F → reflects parallel (concave) / aimed at F → reflects parallel (convex)
 *       Ray 3 (magenta): Through C → reflects back on itself (concave) / aimed at C → reflects back (convex)
 *   - Image calculated via mirror formula: 1/v + 1/u = 1/f
 *   - Live readout: u, v, magnification m, image type
 *   - Animated photon pulses on rays
 *   - Responsive, high-DPI canvas
 *
 * PHYSICS: Mirror formula, New Cartesian Sign Convention
 * LAST UPDATED: 2026-06-09
 */

"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import styles from "../SimulationEngine.module.css";

interface Point { x: number; y: number; }

/* ─── Drawing helpers ─── */
function drawLine(ctx: CanvasRenderingContext2D, a: Point, b: Point, color: string, w = 2, dashed = false) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.shadowColor = color;
  ctx.shadowBlur = dashed ? 0 : 8;
  if (dashed) ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function arrow(ctx: CanvasRenderingContext2D, from: Point, to: Point, color: string) {
  const ang = Math.atan2(to.y - from.y, to.x - from.x);
  const s = 9;
  ctx.save();
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(to.x - s * Math.cos(ang - 0.4), to.y - s * Math.sin(ang - 0.4));
  ctx.lineTo(to.x - s * Math.cos(ang + 0.4), to.y - s * Math.sin(ang + 0.4));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function txt(ctx: CanvasRenderingContext2D, t: string, x: number, y: number, color = "#e2e8f0", size = 12, align: CanvasTextAlign = "center") {
  ctx.save();
  ctx.font = `bold ${size}px Inter, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(t, x, y);
  ctx.restore();
}

function dot(ctx: CanvasRenderingContext2D, p: Point, color: string, r = 4) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.restore();
}

/* ─── Mirror formula helper ─── */
function calcImage(u_px: number, f_px: number): { v: number; m: number } | null {
  /* u is negative (object on left), f is negative for concave */
  /* 1/v + 1/u = 1/f → v = uf / (u-f) */
  const denom = u_px - f_px;
  if (Math.abs(denom) < 0.001) return null; /* Object at focus → image at ∞ */
  const v = (u_px * f_px) / denom;
  const m = -v / u_px;
  return { v, m };
}

/* ─── Position label ─── */
function positionLabel(u: number, f: number, type: "concave" | "convex"): string {
  if (type === "convex") return "Virtual, Erect, Diminished (behind mirror)";
  const uAbs = Math.abs(u);
  const fAbs = Math.abs(f);
  const cAbs = 2 * fAbs;
  if (uAbs > cAbs + 2) return "Diminished, Real, Inverted (between F and C)";
  if (Math.abs(uAbs - cAbs) < 3) return "Same size, Real, Inverted (at C)";
  if (uAbs > fAbs && uAbs < cAbs) return "Magnified, Real, Inverted (beyond C)";
  if (Math.abs(uAbs - fAbs) < 3) return "Image at ∞ (object at F)";
  if (uAbs < fAbs) return "Magnified, Virtual, Erect (behind mirror)";
  return "";
}

/* ═══════════════════════════════════════════════════
 * COMPONENT
 * ═══════════════════════════════════════════════════ */
const ConcaveMirrorSim: React.FC<{ id?: string; title?: string }> = ({
  id = "concave-mirror-sim",
  title = "Concave Mirror — Image Formation",
}) => {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);

  const [objSlider, setObjSlider] = useState(60); /* 0 = at mirror, 100 = far left */
  const [mirrorType, setMirrorType] = useState<"concave" | "convex">("concave");
  const [showRay1, setShowRay1] = useState(true);
  const [showRay2, setShowRay2] = useState(true);
  const [showRay3, setShowRay3] = useState(true);
  const [dims, setDims] = useState({ w: 640, h: 400 });

  /* Responsive sizing */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth || 640;
      setDims({ w, h: Math.round(w * 0.58) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Derived state as string for display */
  const [imageInfo, setImageInfo] = useState({ u: 0, v: 0, m: 0, label: "" });

  /* Main animation loop */
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

      /* ── Background ── */
      ctx.fillStyle = "#080f1f";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(148,163,184,0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      /* ── Layout constants ── */
      const axisY  = H * 0.52;
      const mirrorX = W * 0.78;
      const fLen   = W * 0.16;  /* focal length in pixels */
      const R      = fLen * 2;  /* radius of curvature */
      const fX     = mirrorX - fLen;   /* Focus (F) */
      const cX     = mirrorX - R;      /* Centre of curvature (C) */

      /* For convex: F and C are behind mirror (to the right) */
      const sign = mirrorType === "concave" ? 1 : -1;
      const fXdraw = mirrorX - sign * fLen;
      const cXdraw = mirrorX - sign * R;

      /* ── Principal axis ── */
      drawLine(ctx, { x: 0, y: axisY }, { x: W, y: axisY }, "rgba(148,163,184,0.3)", 1, false);

      /* ── Curved mirror arc ── */
      ctx.save();
      ctx.strokeStyle = "#a5b4fc";
      ctx.lineWidth = 4;
      ctx.shadowColor = "#818cf8";
      ctx.shadowBlur = 12;
      const arcRadius = R * 1.0;
      const arcSpan = Math.asin((H * 0.38) / arcRadius);
      const arcCenterX = mirrorType === "concave"
        ? mirrorX + arcRadius
        : mirrorX - arcRadius;
      const arcStart = Math.PI - arcSpan;
      const arcEnd   = Math.PI + arcSpan;
      ctx.beginPath();
      ctx.arc(arcCenterX, axisY, arcRadius,
        mirrorType === "concave" ? arcStart : -arcSpan,
        mirrorType === "concave" ? arcEnd   :  arcSpan,
        false
      );
      ctx.stroke();

      /* Mirror hatching on back side */
      ctx.strokeStyle = "rgba(129,140,248,0.2)";
      ctx.lineWidth = 1;
      const hatchCount = 10;
      for (let i = 0; i <= hatchCount; i++) {
        const a = arcStart + (arcEnd - arcStart) * (i / hatchCount);
        const px = arcCenterX + arcRadius * Math.cos(a);
        const py = axisY + arcRadius * Math.sin(a);
        const nx = Math.cos(a);
        const ny = Math.sin(a);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + nx * 10, py + ny * 10);
        ctx.stroke();
      }
      ctx.restore();

      /* ── Key points ── */
      const pole: Point = { x: mirrorX, y: axisY };
      const focus: Point = { x: fXdraw, y: axisY };
      const center: Point = { x: cXdraw, y: axisY };

      dot(ctx, pole,   "#94a3b8", 4);
      dot(ctx, focus,  "#fbbf24", 5);
      dot(ctx, center, "#f87171", 5);
      txt(ctx, "P", pole.x + 8,   axisY + 16, "#94a3b8", 12);
      txt(ctx, "F", focus.x,  axisY + 16, "#fde68a", 12);
      txt(ctx, "C", center.x, axisY + 16, "#fca5a5", 12);

      /* ── Object arrow ── */
      /* objSlider 0→100 maps object from mirrorX to left edge */
      const objX = mirrorX - (objSlider / 100) * (mirrorX - 30);
      /* Sign convention: u is negative for real object */
      const u_px = objX - mirrorX; /* negative value */
      const f_px_signed = mirrorType === "concave" ? -fLen : fLen;

      const arrowH = H * 0.28;
      const objTip:  Point = { x: objX, y: axisY - arrowH };
      const objBase: Point = { x: objX, y: axisY };
      drawLine(ctx, objBase, objTip, "#60a5fa", 3);
      arrow(ctx, objBase, objTip, "#60a5fa");
      dot(ctx, objBase, "#60a5fa", 4);
      txt(ctx, "Object", objX, objTip.y - 14, "#93c5fd", 12);

      /* ── Image calculation ── */
      const imgResult = calcImage(u_px, f_px_signed);
      let v_px = 0;
      let m_val = 0;
      let showImage = false;

      if (imgResult) {
        v_px = imgResult.v;
        m_val = imgResult.m;
        showImage = Math.abs(v_px) < W * 1.5;
      }

      /* Update info state (throttled via rounding) */
      const newU = Math.round(u_px);
      const newV = Math.round(v_px);
      const newM = Math.round(m_val * 100) / 100;
      const lbl  = positionLabel(u_px, f_px_signed, mirrorType);
      setImageInfo(prev => {
        if (prev.u === newU && prev.v === newV && prev.m === newM) return prev;
        return { u: newU, v: newV, m: newM, label: lbl };
      });

      /* ── Principal Rays ── */
      if (showImage && imgResult) {
        const imgX = mirrorX + v_px;
        const imgH = arrowH * Math.abs(m_val);
        const imgSign = m_val < 0 ? -1 : 1; /* inverted if m < 0 */
        const imgTip: Point  = { x: imgX, y: axisY - imgSign * Math.min(imgH, H * 0.45) };
        const imgBase: Point = { x: imgX, y: axisY };

        /* ─ Ray 1: Parallel to axis → through F ─ */
        if (showRay1) {
          /* From object tip, travel parallel to axis to mirror, then reflect through F */
          const r1Mid: Point = { x: mirrorX, y: objTip.y };
          drawLine(ctx, objTip, r1Mid, "rgba(251,191,36,0.85)", 2);
          arrow(ctx, objTip, r1Mid, "rgba(251,191,36,0.85)");
          if (mirrorType === "concave") {
            if (Math.abs(v_px) < W) {
              drawLine(ctx, r1Mid, imgTip, "rgba(251,191,36,0.7)", 2, v_px > 0);
              arrow(ctx, r1Mid, imgTip, "rgba(251,191,36,0.7)");
            } else {
              /* parallel rays converge → extend toward F */
              const ext: Point = { x: fXdraw - 50, y: axisY };
              drawLine(ctx, r1Mid, ext, "rgba(251,191,36,0.5)", 2, false);
            }
          } else {
            /* Convex: appears to come from F behind mirror */
            const extEnd: Point = { x: 0, y: r1Mid.y + (r1Mid.y - focus.y) * (r1Mid.x / (focus.x - r1Mid.x + 0.01)) };
            drawLine(ctx, r1Mid, { x: 0, y: axisY - (fXdraw - mirrorX) * Math.tan(Math.atan2(r1Mid.y - axisY, mirrorX - fXdraw)) + axisY }, "rgba(251,191,36,0.6)", 2, false);
          }
        }

        /* ─ Ray 2: Through F → reflects parallel ─ */
        if (showRay2) {
          if (mirrorType === "concave") {
            drawLine(ctx, objTip, { x: mirrorX, y: objTip.y + (fXdraw - objX) * Math.tan(Math.atan2(objTip.y - axisY, objX - fXdraw)) }, "rgba(34,211,153,0.85)", 2);
            const r2Hit: Point = {
              x: mirrorX,
              y: axisY + (objTip.y - axisY) * (mirrorX - fXdraw) / (objX - fXdraw)
            };
            arrow(ctx, objTip, r2Hit, "rgba(34,211,153,0.85)");
            if (Math.abs(v_px) < W) {
              drawLine(ctx, r2Hit, imgTip, "rgba(34,211,153,0.7)", 2, v_px > 0);
              arrow(ctx, r2Hit, imgTip, "rgba(34,211,153,0.7)");
            }
          }
        }

        /* ─ Ray 3: Through C → reflects back ─ */
        if (showRay3) {
          if (mirrorType === "concave") {
            /* Ray through C → reflected back along same path */
            const r3Hit: Point = {
              x: mirrorX,
              y: axisY + (objTip.y - axisY) * (mirrorX - cXdraw) / (objX - cXdraw)
            };
            drawLine(ctx, objTip, r3Hit, "rgba(248,113,113,0.85)", 2);
            arrow(ctx, objTip, r3Hit, "rgba(248,113,113,0.85)");
            if (Math.abs(v_px) < W) {
              drawLine(ctx, r3Hit, imgTip, "rgba(248,113,113,0.7)", 2, v_px > 0);
              arrow(ctx, r3Hit, imgTip, "rgba(248,113,113,0.7)");
            }
          }
        }

        /* ── Image arrow ── */
        const isVirtual = v_px > 0 || mirrorType === "convex";
        drawLine(ctx, imgBase, imgTip, isVirtual ? "rgba(167,139,250,0.8)" : "rgba(74,222,128,0.9)", 3, isVirtual);
        arrow(ctx, imgBase, imgTip, isVirtual ? "rgba(167,139,250,0.8)" : "rgba(74,222,128,0.9)");
        txt(ctx, isVirtual ? "Image\n(virtual)" : "Image\n(real)", imgX, imgTip.y - 16,
          isVirtual ? "#c4b5fd" : "#86efac", 11);
      }

      /* ── Photon animation on ray 1 ── */
      if (showRay1) {
        const t = ((time * 0.0004) % 1);
        const phX = objTip.x + (mirrorX - objTip.x) * t;
        const phY = objTip.y;
        ctx.save();
        ctx.beginPath();
        ctx.arc(phX, phY, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#fef3c7";
        ctx.shadowColor = "#fbbf24";
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();
      }

      /* ── Mirror type label ── */
      txt(ctx, mirrorType === "concave" ? "Concave Mirror" : "Convex Mirror",
        mirrorX - 14, H * 0.1, "#a5b4fc", 13);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [dims, objSlider, mirrorType, showRay1, showRay2, showRay3]);

  return (
    <div className={styles.simCard}>
      <div className={styles.simHeader}>
        <div className={styles.simIcon}>🔍</div>
        <span className={styles.simTitle}>{title}</span>
        <span className={styles.simBadge}>INTERACTIVE</span>
      </div>

      <div ref={containerRef} className={styles.canvasWrap}>
        <canvas ref={canvasRef} style={{ width: "100%", height: "auto", display: "block" }} />
      </div>

      <div className={styles.controls}>
        {/* Mirror type toggle */}
        <div className={styles.btnGroup}>
          <button
            className={`${styles.toggleBtn} ${mirrorType === "concave" ? styles.active : ""}`}
            onClick={() => setMirrorType("concave")}
          >Concave</button>
          <button
            className={`${styles.toggleBtn} ${mirrorType === "convex" ? styles.active : ""}`}
            onClick={() => setMirrorType("convex")}
          >Convex</button>
        </div>

        {/* Object distance slider */}
        <div className={styles.sliderRow}>
          <span className={styles.sliderLabel}>Object distance</span>
          <input
            type="range" min={5} max={95} value={objSlider}
            onChange={e => setObjSlider(Number(e.target.value))}
            className={styles.slider}
          />
        </div>

        {/* Ray toggles */}
        <div className={styles.rayToggles}>
          <button className={`${styles.rayBtn} ${showRay1 ? styles.rayActive1 : ""}`} onClick={() => setShowRay1(r => !r)}>Ray 1</button>
          <button className={`${styles.rayBtn} ${showRay2 ? styles.rayActive2 : ""}`} onClick={() => setShowRay2(r => !r)}>Ray 2</button>
          <button className={`${styles.rayBtn} ${showRay3 ? styles.rayActive3 : ""}`} onClick={() => setShowRay3(r => !r)}>Ray 3</button>
        </div>
      </div>

      {/* Live calculation panel */}
      <div className={styles.infoPanel}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Object distance (u):</span>
          <span className={styles.infoValue}>{imageInfo.u} px</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Image distance (v):</span>
          <span className={styles.infoValue}>{imageInfo.v} px</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Magnification (m):</span>
          <span className={styles.infoValue}>{imageInfo.m}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Image type:</span>
          <span className={styles.infoValue}>{imageInfo.label || "—"}</span>
        </div>
        <div className={styles.formula}>1/v + 1/u = 1/f</div>
      </div>
    </div>
  );
};

export default ConcaveMirrorSim;
