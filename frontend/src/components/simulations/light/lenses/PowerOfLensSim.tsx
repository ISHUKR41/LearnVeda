/**
 * FILE: PowerOfLensSim.tsx
 * LOCATION: frontend/src/components/simulations/light/lenses/PowerOfLensSim.tsx
 *
 * PURPOSE: Interactive simulation of Power of a Lens (P = 1/f in dioptres).
 *          Shows how focal length determines power, and lets students build
 *          combinations of lenses (P_total = P1 + P2 + ...) like in spectacles.
 *
 * FEATURES:
 *   - Dual sliders: f₁ and f₂ focal lengths (−200 cm to +200 cm)
 *   - Live convex/concave lens drawn with gradient fill as f changes
 *   - Animated parallel rays converging (convex) or diverging (concave)
 *   - Combination power: P_total = P₁ + P₂ shown in real time
 *   - Colour-coded readout: positive P = blue (converging), negative = red (diverging)
 *   - Real-life analogies: reading glasses (+2D), myopia glasses (−3D)
 *   - Photon animation along rays
 *   - Responsive canvas via ResizeObserver + devicePixelRatio
 *
 * PHYSICS: P = 1/f (f in metres), P_combined = P₁ + P₂ (thin lenses in contact)
 * LAST UPDATED: 2026-06-11
 */

"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import styles from "../SimulationEngine.module.css";

/* ─── Helpers ─── */
function glowLine(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  color: string, w = 2, dashed = false
) {
  [
    { w: w * 6, a: 0.06 },
    { w: w * 3, a: 0.14 },
    { w: w * 1.5, a: 0.5 },
    { w, a: 1 },
  ].forEach(layer => {
    ctx.save();
    ctx.strokeStyle = color; ctx.lineWidth = layer.w; ctx.globalAlpha = layer.a;
    ctx.shadowColor = color; ctx.shadowBlur = layer.w * 1.5; ctx.lineCap = "round";
    if (dashed) ctx.setLineDash([8, 5]);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.setLineDash([]); ctx.restore();
  });
}

export default function PowerOfLensSim() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);
  const timeRef      = useRef<number>(0);

  /* f in cm — can be negative for diverging */
  const [f1cm, setF1cm] = useState<number>(20);
  const [f2cm, setF2cm] = useState<number>(50);
  const [showCombined, setShowCombined] = useState<boolean>(false);

  const stateRef = useRef({ f1cm: 20, f2cm: 50, showCombined: false });
  stateRef.current = { f1cm, f2cm, showCombined };

  /* Power in dioptres */
  const P1 = f1cm !== 0 ? (100 / f1cm) : Infinity;
  const P2 = f2cm !== 0 ? (100 / f2cm) : Infinity;
  const Ptotal = (isFinite(P1) && isFinite(P2)) ? P1 + P2 : Infinity;

  /* f in metres */
  const f1m = f1cm / 100;
  const f2m = f2cm / 100;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width / dpr, H = canvas.height / dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    timeRef.current += 0.016;
    const t = timeRef.current;

    const { f1cm: f1, showCombined: showC } = stateRef.current;

    /* Background */
    ctx.fillStyle = "#080e1a";
    ctx.fillRect(0, 0, W, H);

    /* Dot grid */
    ctx.fillStyle = "rgba(148,163,184,0.05)";
    for (let gx = 0; gx < W; gx += 20) {
      for (let gy = 0; gy < H; gy += 20) {
        ctx.beginPath(); ctx.arc(gx, gy, 0.8, 0, Math.PI * 2); ctx.fill();
      }
    }

    const cx = W * 0.5, cy = H * 0.5;
    const fPx = Math.min(Math.abs(f1) * (W / 120), W * 0.38); /* focal length in pixels */
    const isCvx = f1 > 0;
    const fcolor = isCvx ? "#60a5fa" : "#f87171";

    /* ── Principal axis ── */
    ctx.save();
    ctx.strokeStyle = "rgba(148,163,184,0.25)"; ctx.lineWidth = 1;
    ctx.setLineDash([8, 5]);
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.setLineDash([]); ctx.restore();

    /* ── Lens shape ── */
    const lh = H * 0.55, lw = isCvx ? 18 : 10;
    const curveX = isCvx ? lw * 1.2 : -lw * 0.8;
    ctx.save();
    ctx.shadowColor = fcolor; ctx.shadowBlur = 20;
    const grad = ctx.createLinearGradient(cx - lw, cy, cx + lw, cy);
    grad.addColorStop(0, (isCvx ? "rgba(59,130,246," : "rgba(248,113,113,") + "0.35)");
    grad.addColorStop(0.5, (isCvx ? "rgba(96,165,250," : "rgba(239,68,68,") + "0.15)");
    grad.addColorStop(1, (isCvx ? "rgba(59,130,246," : "rgba(248,113,113,") + "0.35)");
    ctx.fillStyle = grad;
    ctx.strokeStyle = fcolor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    if (isCvx) {
      ctx.moveTo(cx, cy - lh / 2);
      ctx.bezierCurveTo(cx + curveX * 2, cy - lh / 3, cx + curveX * 2, cy + lh / 3, cx, cy + lh / 2);
      ctx.bezierCurveTo(cx - curveX * 2, cy + lh / 3, cx - curveX * 2, cy - lh / 3, cx, cy - lh / 2);
    } else {
      ctx.moveTo(cx + curveX, cy - lh / 2);
      ctx.bezierCurveTo(cx, cy - lh / 3, cx, cy + lh / 3, cx + curveX, cy + lh / 2);
      ctx.bezierCurveTo(cx + curveX * 2, cy + lh / 3, cx + curveX * 2, cy - lh / 3, cx + curveX, cy - lh / 2);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    /* lens arrows */
    if (isCvx) {
      const ah = 12;
      ctx.fillStyle = fcolor;
      /* top arrow */
      ctx.beginPath();
      ctx.moveTo(cx, cy - lh/2 - ah); ctx.lineTo(cx - 5, cy - lh/2); ctx.lineTo(cx + 5, cy - lh/2); ctx.closePath(); ctx.fill();
      /* bottom arrow */
      ctx.beginPath();
      ctx.moveTo(cx, cy + lh/2 + ah); ctx.lineTo(cx - 5, cy + lh/2); ctx.lineTo(cx + 5, cy + lh/2); ctx.closePath(); ctx.fill();
    } else {
      const ah = 10;
      ctx.fillStyle = fcolor;
      ctx.beginPath();
      ctx.moveTo(cx, cy - lh/2 + ah); ctx.lineTo(cx - 5, cy - lh/2); ctx.lineTo(cx + 5, cy - lh/2); ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx, cy + lh/2 - ah); ctx.lineTo(cx - 5, cy + lh/2); ctx.lineTo(cx + 5, cy + lh/2); ctx.closePath(); ctx.fill();
    }
    ctx.restore();

    /* ── Focus marker ── */
    const FxR = cx + (isCvx ? fPx : -fPx); /* real focus (convex: right) */
    const FxV = cx - (isCvx ? fPx : -fPx); /* virtual focus */

    [FxR, FxV].forEach((fx, i) => {
      const pulse = 1 + 0.2 * Math.sin(t * 3 + i * Math.PI);
      ctx.save();
      ctx.fillStyle   = "#fbbf24";
      ctx.shadowColor = "#fbbf24";
      ctx.shadowBlur  = 14;
      ctx.beginPath();
      ctx.arc(fx, cy, 5 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.font      = "bold 12px Inter, system-ui, sans-serif";
      ctx.fillStyle = "#fbbf24cc";
      ctx.textAlign = "center";
      ctx.fillText(i === 0 ? "F₂" : "F₁", fx, cy - 14);
      ctx.restore();
    });

    /* ── Animated incoming rays → lens → converge/diverge ── */
    const NUM_RAYS = 5;
    for (let ri = 0; ri < NUM_RAYS; ri++) {
      const yOff = (ri - (NUM_RAYS - 1) / 2) * (lh / (NUM_RAYS + 1));
      const rayY = cy + yOff;
      if (Math.abs(yOff) > lh / 2 - 4) continue;

      /* animated photon position */
      const phase = (t * 0.6 + ri * 0.22) % 1;
      const leftX = 0, midX = cx;
      const phX1 = leftX + phase * (midX - leftX);
      const phY1 = rayY;

      /* incoming segment */
      glowLine(ctx, leftX, rayY, midX, rayY, "#fde04788", 1.5);

      /* photon on incoming */
      if (phase < 1) {
        ctx.save();
        ctx.fillStyle = "#fde047"; ctx.shadowColor = "#fde047"; ctx.shadowBlur = 14;
        ctx.beginPath(); ctx.arc(phX1, phY1, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      /* outgoing segment */
      if (isCvx) {
        /* converge at F₂ */
        glowLine(ctx, midX, rayY, FxR, cy, fcolor + "88", 1.5);
        /* photon on outgoing */
        const phase2 = (t * 0.6 + ri * 0.22 + 0.5) % 1;
        const phX2 = midX + phase2 * (FxR - midX);
        const phY2 = rayY + phase2 * (cy - rayY);
        ctx.save();
        ctx.fillStyle = fcolor; ctx.shadowColor = fcolor; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(phX2, phY2, 3, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      } else {
        /* diverge as if coming from F₁ */
        const slope = (rayY - cy) / (cx - FxV);
        const endX  = W;
        const endY  = rayY + slope * (W - cx);
        glowLine(ctx, midX, rayY, endX, endY, fcolor + "88", 1.5);
        /* dashed extension back to F₁ */
        glowLine(ctx, midX, rayY, FxV, cy, "#f8717155", 1, true);
      }
    }

    /* ── Labels ── */
    ctx.save();
    ctx.font = "bold 12px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = fcolor + "cc";
    ctx.fillText(isCvx ? "Convex (Converging)" : "Concave (Diverging)", cx, cy - lh / 2 - 30);
    ctx.restore();

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = el.clientWidth  * dpr;
      canvas.height = el.clientHeight * dpr;
    });
    obs.observe(el);
    rafRef.current = requestAnimationFrame(draw);
    return () => { obs.disconnect(); cancelAnimationFrame(rafRef.current); };
  }, [draw]);

  const fmtP = (p: number) => {
    if (!isFinite(p)) return "∞";
    return `${p >= 0 ? "+" : ""}${p.toFixed(2)} D`;
  };
  const pColor = (p: number) => (!isFinite(p) ? "#94a3b8" : p > 0 ? "#60a5fa" : "#f87171");

  return (
    <div className={styles.simWrapper}>
      <div className={styles.simHeader}>
        <span className={styles.simIcon}>💪</span>
        <div>
          <div className={styles.simTitle}>Power of a Lens — P = 1/f (Dioptres)</div>
          <div className={styles.simDesc}>Adjust focal lengths · P₁ + P₂ = combined power of lenses in contact</div>
        </div>
      </div>

      {/* ── Readout cards ── */}
      <div style={{ display: "flex", gap: "12px", padding: "0 20px 16px", flexWrap: "wrap" }}>
        {[
          { label: "Lens 1", f: f1cm, P: P1 },
          { label: "Lens 2", f: f2cm, P: P2 },
          { label: "Combined", f: null, P: Ptotal },
        ].map(({ label, f, P }) => (
          <div key={label} style={{
            flex: "1 1 100px",
            background: "rgba(15,23,42,0.7)",
            border: `1px solid ${pColor(P)}30`,
            borderRadius: "10px", padding: "12px 16px",
          }}>
            <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, marginBottom: "6px" }}>{label}</div>
            {f !== null && (
              <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>
                f = {f > 0 ? "+" : ""}{f} cm = {(f / 100).toFixed(2)} m
              </div>
            )}
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: pColor(P), letterSpacing: "-0.02em" }}>
              {fmtP(P)}
            </div>
            <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
              {!isFinite(P) ? "plane glass" : P > 0 ? "converging" : "diverging"}
            </div>
          </div>
        ))}
      </div>

      {/* ── Controls ── */}
      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>
            Lens 1 focal length (f₁) = {f1cm > 0 ? "+" : ""}{f1cm} cm
          </label>
          <input
            type="range" min={-200} max={200} step={5}
            value={f1cm}
            onChange={(e) => { const v = Number(e.target.value); setF1cm(v === 0 ? 5 : v); }}
            className={styles.slider}
          />
        </div>
        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>
            Lens 2 focal length (f₂) = {f2cm > 0 ? "+" : ""}{f2cm} cm
          </label>
          <input
            type="range" min={-200} max={200} step={5}
            value={f2cm}
            onChange={(e) => { const v = Number(e.target.value); setF2cm(v === 0 ? 5 : v); }}
            className={styles.slider}
          />
        </div>
      </div>

      {/* ── Canvas (shows Lens 1) ── */}
      <div ref={containerRef} className={styles.canvasWrap}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>

      {/* ── Real-life examples ── */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, marginBottom: "8px", letterSpacing: "0.05em" }}>
          REAL-LIFE EXAMPLES
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {[
            { label: "Reading glasses",     f1: 50,   f2: 200, note: "+2 D" },
            { label: "Myopia glasses",      f1: -33,  f2: -33, note: "−3 D" },
            { label: "Camera lens",         f1: 5,    f2: 100, note: "+22 D" },
            { label: "Strong magnifier",    f1: 10,   f2: 10,  note: "+20 D" },
            { label: "Flat glass (no lens)",f1: 200, f2: 200,  note: "≈ 0 D" },
          ].map(ex => (
            <button
              key={ex.label}
              className={styles.presetBtn}
              onClick={() => { setF1cm(ex.f1); setF2cm(ex.f2); }}
            >
              {ex.label} ({ex.note})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
