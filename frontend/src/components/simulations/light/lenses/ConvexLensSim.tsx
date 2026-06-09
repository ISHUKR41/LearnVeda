/**
 * FILE: ConvexLensSim.tsx
 * LOCATION: frontend/src/components/simulations/light/lenses/ConvexLensSim.tsx
 * PURPOSE: Interactive convex/concave lens ray diagram with full principal-ray tracing.
 *
 * FEATURES:
 *   - Toggle between Convex (converging) and Concave (diverging) lens
 *   - Slider to move object through all 6 standard positions
 *   - Three colored principal rays:
 *       Ray 1 (yellow) : Parallel to axis → bends through F₂ (converging) / appears from F₁ (diverging)
 *       Ray 2 (cyan)   : Through optical centre O → passes straight
 *       Ray 3 (magenta): Aimed at F₁ → exits parallel to axis (converging)
 *   - Image calculated via 1/v − 1/u = 1/f (lens formula)
 *   - Live readout: u, v, magnification m, image type
 *   - Lens drawn as proper biconvex / biconcave shape
 *   - Animated photon pulse on ray 1
 *
 * PHYSICS: Lens formula, New Cartesian Sign Convention for lenses
 * LAST UPDATED: 2026-06-09
 */

"use client";

import React, { useRef, useState, useEffect } from "react";
import styles from "../SimulationEngine.module.css";

interface Point { x: number; y: number; }

/* ─── Lens formula: 1/v − 1/u = 1/f → v = uf / (u + f) ─── */
function lensFormula(u: number, f: number): { v: number; m: number } | null {
  /* u is negative for real object on left, f is positive for convex */
  const denom = u + f;
  if (Math.abs(denom) < 0.5) return null;
  const v = (u * f) / denom;
  const m = v / u;
  return { v, m };
}

/* ─── Helpers ─── */
function ln(ctx: CanvasRenderingContext2D, a: Point, b: Point, col: string, w = 2, dash = false) {
  ctx.save();
  ctx.strokeStyle = col; ctx.lineWidth = w;
  ctx.shadowColor = col; ctx.shadowBlur = dash ? 0 : 8;
  if (dash) ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  ctx.setLineDash([]); ctx.restore();
}

function arrowAt(ctx: CanvasRenderingContext2D, from: Point, to: Point, col: string) {
  const ang = Math.atan2(to.y - from.y, to.x - from.x);
  const s = 9;
  ctx.save(); ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(to.x - s * Math.cos(ang - 0.4), to.y - s * Math.sin(ang - 0.4));
  ctx.lineTo(to.x - s * Math.cos(ang + 0.4), to.y - s * Math.sin(ang + 0.4));
  ctx.closePath(); ctx.fill(); ctx.restore();
}

function lbl(ctx: CanvasRenderingContext2D, t: string, x: number, y: number, col = "#e2e8f0", sz = 12) {
  ctx.save(); ctx.font = `bold ${sz}px Inter, sans-serif`;
  ctx.fillStyle = col; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(t, x, y); ctx.restore();
}

function dot(ctx: CanvasRenderingContext2D, p: Point, col: string, r = 4) {
  ctx.save(); ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
  ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 10; ctx.fill(); ctx.restore();
}

/* ─── Lens shape ─── */
function drawLens(ctx: CanvasRenderingContext2D, cx: number, cy: number, halfH: number, type: "convex" | "concave") {
  ctx.save();
  ctx.strokeStyle = "#a5b4fc";
  ctx.lineWidth = 3;
  ctx.shadowColor = "#818cf8";
  ctx.shadowBlur = 16;

  const lw = halfH * 0.18; /* lens half-width at center */

  if (type === "convex") {
    /* Biconvex: two arcs bulging outward */
    const rx = halfH * 0.7; /* curve radius */
    /* Left arc */
    ctx.beginPath();
    ctx.arc(cx - rx + lw, cy, rx, -Math.asin(halfH / rx), Math.asin(halfH / rx), false);
    ctx.stroke();
    /* Right arc */
    ctx.beginPath();
    ctx.arc(cx + rx - lw, cy, rx, Math.PI - Math.asin(halfH / rx), Math.PI + Math.asin(halfH / rx), false);
    ctx.stroke();
    /* Fill with glassy gradient */
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = "#a5b4fc";
    ctx.beginPath();
    ctx.arc(cx - rx + lw, cy, rx, -Math.asin(halfH / rx), Math.asin(halfH / rx), false);
    ctx.arc(cx + rx - lw, cy, rx, Math.PI + Math.asin(halfH / rx), Math.PI - Math.asin(halfH / rx), false);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
    /* Arrows on ends */
    ctx.fillStyle = "#a5b4fc"; ctx.strokeStyle = "#a5b4fc"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, cy - halfH - 10); ctx.lineTo(cx - 5, cy - halfH); ctx.lineTo(cx + 5, cy - halfH); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx, cy + halfH + 10); ctx.lineTo(cx - 5, cy + halfH); ctx.lineTo(cx + 5, cy + halfH); ctx.closePath(); ctx.fill();
  } else {
    /* Biconcave: two arcs curving inward */
    const rx = halfH * 0.6;
    ctx.beginPath();
    ctx.arc(cx + rx - lw * 0.5, cy, rx, Math.PI - Math.asin(halfH / rx), Math.PI + Math.asin(halfH / rx), false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx - rx + lw * 0.5, cy, rx, -Math.asin(halfH / rx), Math.asin(halfH / rx), false);
    ctx.stroke();
    ctx.fillStyle = "#a5b4fc"; ctx.strokeStyle = "#a5b4fc"; ctx.lineWidth = 2;
    /* Arrows pointing inward */
    ctx.beginPath(); ctx.moveTo(cx, cy - halfH + 10); ctx.lineTo(cx - 5, cy - halfH); ctx.lineTo(cx + 5, cy - halfH); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx, cy + halfH - 10); ctx.lineTo(cx - 5, cy + halfH); ctx.lineTo(cx + 5, cy + halfH); ctx.closePath(); ctx.fill();
  }

  ctx.restore();
}

/* ─── Position label ─── */
function posLabel(u: number, f: number, type: "convex" | "concave"): string {
  if (type === "concave") return "Virtual, Erect, Diminished (same side as object)";
  const uA = Math.abs(u);
  const fA = Math.abs(f);
  if (uA > 2 * fA + 2) return "Diminished, Real, Inverted (between F₂ and 2F₂)";
  if (Math.abs(uA - 2 * fA) < 4) return "Same size, Real, Inverted (at 2F₂)";
  if (uA > fA && uA < 2 * fA) return "Magnified, Real, Inverted (beyond 2F₂)";
  if (Math.abs(uA - fA) < 4) return "Image at infinity (object at F₁)";
  if (uA < fA) return "Magnified, Virtual, Erect (same side as object)";
  return "";
}

/* ═══════════════════════════════════════════════════
 * COMPONENT
 * ═══════════════════════════════════════════════════ */
const ConvexLensSim: React.FC<{ id?: string; title?: string }> = ({
  id = "convex-lens-sim",
  title = "Convex Lens — Image Formation",
}) => {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);

  const [objSlider, setObjSlider]   = useState(62);
  const [lensType, setLensType]     = useState<"convex" | "concave">("convex");
  const [showRay1, setShowRay1]     = useState(true);
  const [showRay2, setShowRay2]     = useState(true);
  const [showRay3, setShowRay3]     = useState(true);
  const [dims, setDims]             = useState({ w: 640, h: 400 });
  const [imageInfo, setImageInfo]   = useState({ u: 0, v: 0, m: 0, label: "" });

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

      /* Background */
      ctx.fillStyle = "#080f1f";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(148,163,184,0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      const axisY = H * 0.52;
      const lensX = W * 0.52;
      const f     = W * 0.14; /* focal length */
      const halfH = H * 0.30; /* half-height of lens */

      /* Principal axis */
      ln(ctx, { x: 10, y: axisY }, { x: W - 10, y: axisY }, "rgba(148,163,184,0.3)", 1);

      /* Key points */
      const f1: Point  = { x: lensX - f,      y: axisY };
      const f2: Point  = { x: lensX + f,      y: axisY };
      const f1_2: Point = { x: lensX - 2 * f, y: axisY };
      const f2_2: Point = { x: lensX + 2 * f, y: axisY };
      const O: Point   = { x: lensX,           y: axisY };

      dot(ctx, O,    "#94a3b8", 4); lbl(ctx, "O",    O.x, axisY + 16, "#94a3b8", 12);
      dot(ctx, f1,   "#fbbf24", 5); lbl(ctx, "F₁", f1.x, axisY + 16, "#fde68a", 12);
      dot(ctx, f2,   "#fbbf24", 5); lbl(ctx, "F₂", f2.x, axisY + 16, "#fde68a", 12);
      dot(ctx, f1_2, "#f87171", 4); lbl(ctx, "2F₁", f1_2.x, axisY + 16, "#fca5a5", 11);
      dot(ctx, f2_2, "#f87171", 4); lbl(ctx, "2F₂", f2_2.x, axisY + 16, "#fca5a5", 11);

      /* Lens */
      drawLens(ctx, lensX, axisY, halfH, lensType);

      /* Object */
      const objX = lensX - (objSlider / 100) * (lensX - 30);
      const arrowH = H * 0.22;
      const objTip: Point  = { x: objX, y: axisY - arrowH };
      const objBase: Point = { x: objX, y: axisY };
      ln(ctx, objBase, objTip, "#60a5fa", 3);
      arrowAt(ctx, objBase, objTip, "#60a5fa");
      dot(ctx, objBase, "#60a5fa", 4);
      lbl(ctx, "Object", objX, objTip.y - 14, "#93c5fd", 12);

      /* Sign convention: u = objX - lensX (negative) */
      const u_px = objX - lensX;
      const f_signed = lensType === "convex" ? f : -f;
      const img = lensFormula(u_px, f_signed);

      let v_px = 0, m_val = 0;
      if (img) { v_px = img.v; m_val = img.m; }

      const showImg = img !== null && Math.abs(v_px) < W * 1.4;
      const imgX = lensX + v_px;
      const imgH = arrowH * Math.abs(m_val);
      const imgSign = m_val < 0 ? -1 : 1;
      const imgTip: Point  = { x: imgX, y: axisY - imgSign * Math.min(imgH, H * 0.42) };
      const imgBase: Point = { x: imgX, y: axisY };
      const isVirt = v_px < 0 || lensType === "concave";

      setImageInfo({
        u: Math.round(u_px),
        v: Math.round(v_px),
        m: Math.round(m_val * 100) / 100,
        label: posLabel(u_px, f_signed, lensType),
      });

      /* ── Principal Rays ── */
      if (showImg && img) {
        /* Ray 1: Parallel → through F₂ (convex) or away from F₁ (concave) */
        if (showRay1) {
          const r1Hit: Point = { x: lensX, y: objTip.y };
          ln(ctx, objTip, r1Hit, "rgba(251,191,36,0.9)", 2);
          arrowAt(ctx, objTip, r1Hit, "rgba(251,191,36,0.9)");
          if (lensType === "convex" && showImg) {
            ln(ctx, r1Hit, imgTip, "rgba(251,191,36,0.75)", 2, isVirt);
            arrowAt(ctx, r1Hit, imgTip, "rgba(251,191,36,0.75)");
          } else if (lensType === "concave") {
            /* Diverges away: extends toward left as if coming from F₁ */
            const slope = (r1Hit.y - axisY) / (r1Hit.x - f1.x);
            const ext: Point = { x: 0, y: r1Hit.y + (0 - r1Hit.x) * slope };
            /* Virtual back-extension to F₁ */
            ln(ctx, r1Hit, { x: f1.x + 20, y: r1Hit.y - (r1Hit.y - axisY) * (lensX - f1.x - 20) / (f1.x - lensX + 0.01) }, "rgba(251,191,36,0.6)", 2, true);
            ln(ctx, r1Hit, { x: W, y: r1Hit.y + (W - r1Hit.x) * (r1Hit.y - axisY) / (r1Hit.x - f1.x + 0.01) }, "rgba(251,191,36,0.75)", 2, false);
          }
        }

        /* Ray 2: Through optical center O → straight through */
        if (showRay2) {
          const slope = (axisY - objTip.y) / (lensX - objX);
          const extEnd: Point = { x: W, y: objTip.y + slope * (W - objX) };
          const r2Hit: Point = O;
          ln(ctx, objTip, r2Hit, "rgba(34,211,153,0.9)", 2);
          arrowAt(ctx, objTip, r2Hit, "rgba(34,211,153,0.9)");
          ln(ctx, r2Hit, showImg ? imgTip : extEnd, "rgba(34,211,153,0.75)", 2, isVirt);
          if (showImg) arrowAt(ctx, r2Hit, imgTip, "rgba(34,211,153,0.75)");
        }

        /* Ray 3: Through F₁ → exits parallel (convex only) */
        if (showRay3 && lensType === "convex" && objX < f1.x) {
          /* Ray from objTip aimed through F₁ → exits parallel */
          const slope3 = (axisY - objTip.y) / (f1.x - objX);
          const r3Hit: Point = { x: lensX, y: objTip.y + slope3 * (lensX - objX) };
          const r3End: Point = { x: W, y: r3Hit.y };
          ln(ctx, objTip, r3Hit, "rgba(248,113,113,0.9)", 2);
          arrowAt(ctx, objTip, r3Hit, "rgba(248,113,113,0.9)");
          ln(ctx, r3Hit, r3End, "rgba(248,113,113,0.75)", 2, isVirt);
        }

        /* Image arrow */
        if (showImg) {
          ln(ctx, imgBase, imgTip, isVirt ? "rgba(167,139,250,0.85)" : "rgba(74,222,128,0.9)", 3, isVirt);
          arrowAt(ctx, imgBase, imgTip, isVirt ? "rgba(167,139,250,0.85)" : "rgba(74,222,128,0.9)");
          lbl(ctx, isVirt ? "Image (virtual)" : "Image (real)", imgX, imgTip.y - 16,
            isVirt ? "#c4b5fd" : "#86efac", 11);
        }
      }

      /* Animated photon on Ray 1 */
      if (showRay1) {
        const tAnim = ((time * 0.0004) % 1);
        const phX = objTip.x + (lensX - objTip.x) * tAnim;
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

      lbl(ctx, lensType === "convex" ? "Convex Lens" : "Concave Lens",
        lensX, H * 0.1, "#a5b4fc", 13);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, [dims, objSlider, lensType, showRay1, showRay2, showRay3]);

  return (
    <div className={styles.simCard}>
      <div className={styles.simHeader}>
        <div className={styles.simIcon}>🔬</div>
        <span className={styles.simTitle}>{title}</span>
        <span className={styles.simBadge}>INTERACTIVE</span>
      </div>

      <div ref={containerRef} className={styles.canvasWrap}>
        <canvas ref={canvasRef} style={{ width: "100%", height: "auto", display: "block" }} />
      </div>

      <div className={styles.controls}>
        <div className={styles.btnGroup}>
          <button className={`${styles.toggleBtn} ${lensType === "convex" ? styles.active : ""}`} onClick={() => setLensType("convex")}>Convex</button>
          <button className={`${styles.toggleBtn} ${lensType === "concave" ? styles.active : ""}`} onClick={() => setLensType("concave")}>Concave</button>
        </div>
        <div className={styles.sliderRow}>
          <span className={styles.sliderLabel}>Object position</span>
          <input type="range" min={5} max={95} value={objSlider}
            onChange={e => setObjSlider(Number(e.target.value))} className={styles.slider} />
        </div>
        <div className={styles.rayToggles}>
          <button className={`${styles.rayBtn} ${showRay1 ? styles.rayActive1 : ""}`} onClick={() => setShowRay1(r => !r)}>Ray 1</button>
          <button className={`${styles.rayBtn} ${showRay2 ? styles.rayActive2 : ""}`} onClick={() => setShowRay2(r => !r)}>Ray 2</button>
          <button className={`${styles.rayBtn} ${showRay3 ? styles.rayActive3 : ""}`} onClick={() => setShowRay3(r => !r)}>Ray 3</button>
        </div>
      </div>

      <div className={styles.infoPanel}>
        <div className={styles.infoRow}><span className={styles.infoLabel}>Object dist. (u):</span><span className={styles.infoValue}>{imageInfo.u} px</span></div>
        <div className={styles.infoRow}><span className={styles.infoLabel}>Image dist. (v):</span><span className={styles.infoValue}>{imageInfo.v} px</span></div>
        <div className={styles.infoRow}><span className={styles.infoLabel}>Magnification (m):</span><span className={styles.infoValue}>{imageInfo.m}</span></div>
        <div className={styles.infoRow}><span className={styles.infoLabel}>Image type:</span><span className={styles.infoValue}>{imageInfo.label || "—"}</span></div>
        <div className={styles.formula}>1/v − 1/u = 1/f</div>
      </div>
    </div>
  );
};

export default ConvexLensSim;
