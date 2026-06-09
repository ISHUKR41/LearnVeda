/**
 * FILE: GlassSlabSim.tsx
 * LOCATION: frontend/src/components/simulations/light/refraction/GlassSlabSim.tsx
 *
 * PURPOSE: Interactive simulation of light passing through a parallel-sided glass slab.
 *          Demonstrates lateral displacement and that the emergent ray is parallel to the incident ray.
 *
 * FEATURES:
 *   - Adjustable angle of incidence (0°–75°) — slider
 *   - Adjustable slab thickness (40–200 px) — slider
 *   - Adjustable refractive index n (1.3–2.5) — slider
 *   - Live ray diagram: incident (yellow), refracted inside (cyan), emergent (green)
 *   - Normal lines at both surfaces (dashed)
 *   - Angle arcs: ∠i, ∠r, ∠e = ∠i
 *   - Lateral displacement d = t × sin(i−r) / cos(r) computed and shown
 *   - Animated photon traversing full path (60fps RAF loop with mutable refs)
 *   - Responsive canvas via ResizeObserver + devicePixelRatio
 *
 * PHYSICS:
 *   Snell's Law at entry: sin(i) = n × sin(r)
 *   At exit:              n × sin(r) = sin(e)  →  e = i  (emergent || incident)
 *   Lateral displacement: d = t × sin(i − r) / cos(r)
 *
 * PATTERN: All drawing inside RAF loop using mutable refs.
 *
 * LAST UPDATED: 2026-06-09
 */

"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import styles from "../SimulationEngine.module.css";

/* ─── Helpers ─── */
const toRad = (d: number) => d * Math.PI / 180;

function drawLine(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  color: string, width = 2.5, dashed = false, glow = true
) {
  ctx.save();
  if (glow) { ctx.shadowColor = color; ctx.shadowBlur = 10; }
  ctx.strokeStyle = color; ctx.lineWidth = width;
  if (dashed) ctx.setLineDash([6, 5]);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.setLineDash([]); ctx.restore();
}

function drawArrow(ctx: CanvasRenderingContext2D, fx: number, fy: number, tx: number, ty: number, color: string) {
  const angle = Math.atan2(ty - fy, tx - fx), sz = 9;
  ctx.save(); ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(tx, ty);
  ctx.lineTo(tx - sz * Math.cos(angle - 0.38), ty - sz * Math.sin(angle - 0.38));
  ctx.lineTo(tx - sz * Math.cos(angle + 0.38), ty - sz * Math.sin(angle + 0.38));
  ctx.closePath(); ctx.fill(); ctx.restore();
}

function drawLabel(
  ctx: CanvasRenderingContext2D, t: string,
  x: number, y: number, col = "#e2e8f0", sz = 12
) {
  ctx.save();
  ctx.font = `600 ${sz}px Inter, system-ui, sans-serif`;
  ctx.fillStyle = col; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(t, x, y); ctx.restore();
}

/* ═══════════════════════════════════════════════
 * COMPONENT: GlassSlabSim
 * ═══════════════════════════════════════════════ */
export default function GlassSlabSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const tRef      = useRef<number>(0);   /* 0–1 animation clock */

  /* Mutable refs mirror state for RAF loop */
  const angleRef    = useRef<number>(45);
  const thickRef    = useRef<number>(120);
  const nRef        = useRef<number>(1.5);
  const dimsRef     = useRef<{ w: number; h: number }>({ w: 640, h: 420 });

  const [angleDeg,  setAngleDegState]  = useState(45);
  const [thickness, setThicknessState] = useState(120);
  const [nIndex,    setNIndexState]    = useState(1.5);
  const [dims,      setDims]           = useState({ w: 640, h: 420 });

  const setAngleDeg  = useCallback((v: number) => { angleRef.current = v;  setAngleDegState(v);  }, []);
  const setThickness = useCallback((v: number) => { thickRef.current = v;  setThicknessState(v); }, []);
  const setNIndex    = useCallback((v: number) => { nRef.current = v;      setNIndexState(v);    }, []);

  /* ── Canvas resize ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      const h = Math.max(300, Math.min(460, width * 0.65));
      const next = { w: Math.round(width), h: Math.round(h) };
      dimsRef.current = next; setDims(next);
    });
    ro.observe(canvas.parentElement!);
    return () => ro.disconnect();
  }, []);

  /* ── Set canvas pixel dimensions on resize ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = dims.w * dpr;
    canvas.height = dims.h * dpr;
    canvas.style.width  = `${dims.w}px`;
    canvas.style.height = `${dims.h}px`;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
  }, [dims]);

  /* ── Main RAF loop ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function render() {
      tRef.current = (tRef.current + 0.006) % 1;

      const ctx = canvas!.getContext("2d")!;
      const { w: W, h: H } = dimsRef.current;
      const iDeg = angleRef.current;
      const t    = thickRef.current;
      const n    = nRef.current;

      /* Physics */
      const iRad = toRad(iDeg);
      const rRad = Math.asin(Math.clamp ? Math.sin(iRad) / n : Math.min(1, Math.sin(iRad) / n));

      /* Layout */
      const slabTop  = H * 0.27;
      const slabThpx = Math.min(Math.max(40, t), H * 0.42);
      const slabBot  = slabTop + slabThpx;
      const slabL    = W * 0.15, slabR = W * 0.85;
      const entX = W * 0.38, entY = slabTop;
      const exitX = entX + Math.tan(rRad) * slabThpx, exitY = slabBot;

      /* Incident ray start */
      const incLen = slabTop * 0.92;
      const incSX = entX - incLen * Math.sin(iRad), incSY = entY - incLen * Math.cos(iRad);

      /* Emergent ray end */
      const emeLen = (H - slabBot) * 0.88;
      const emeEX = exitX + emeLen * Math.sin(iRad), emeEY = exitY + emeLen * Math.cos(iRad);

      /* Lateral displacement (px) */
      const dPx = slabThpx * Math.sin(iRad - rRad) / Math.cos(rRad);

      /* Animated photon position */
      const ph = tRef.current;
      const segInc  = incLen;
      const segGlass = slabThpx / Math.cos(rRad);
      const segEme  = emeLen;
      const total   = segInc + segGlass + segEme;
      let phX: number, phY: number;
      if (ph < segInc / total) {
        const f = ph / (segInc / total);
        phX = incSX + (entX - incSX) * f; phY = incSY + (entY - incSY) * f;
      } else if (ph < (segInc + segGlass) / total) {
        const f = (ph - segInc / total) / (segGlass / total);
        phX = entX + (exitX - entX) * f; phY = entY + (exitY - entY) * f;
      } else {
        const f = (ph - (segInc + segGlass) / total) / (segEme / total);
        phX = exitX + (emeEX - exitX) * f; phY = exitY + (emeEY - exitY) * f;
      }

      /* ── DRAW ── */

      /* Background */
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#050d1a"); bg.addColorStop(1, "#0a1628");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      /* Air labels */
      drawLabel(ctx, "Air  (n = 1.0)", W * 0.07, slabTop * 0.5, "#475569", 10);
      drawLabel(ctx, "Air  (n = 1.0)", W * 0.07, slabBot + (H - slabBot) * 0.45, "#475569", 10);

      /* Glass slab fill */
      const gGrad = ctx.createLinearGradient(0, slabTop, 0, slabBot);
      gGrad.addColorStop(0, "rgba(96, 165, 250, 0.16)"); gGrad.addColorStop(1, "rgba(99, 102, 241, 0.10)");
      ctx.fillStyle = gGrad; ctx.fillRect(slabL, slabTop, slabR - slabL, slabThpx);
      ctx.save(); ctx.strokeStyle = "#60a5fa"; ctx.lineWidth = 2;
      ctx.strokeRect(slabL, slabTop, slabR - slabL, slabThpx); ctx.restore();
      drawLabel(ctx, `Glass  (n = ${n.toFixed(1)})`, W / 2, slabTop + slabThpx / 2, "#93c5fd", 13);

      /* Normals */
      const normH = 28;
      drawLine(ctx, entX, entY - normH, entX, entY + normH, "rgba(148,163,184,0.40)", 1.2, true, false);
      drawLine(ctx, exitX, exitY - normH, exitX, exitY + normH, "rgba(148,163,184,0.40)", 1.2, true, false);

      /* Rays */
      drawLine(ctx, incSX, incSY, entX, entY, "#fbbf24", 2.5); drawArrow(ctx, incSX, incSY, entX, entY, "#fbbf24");
      drawLine(ctx, entX, entY, exitX, exitY, "#38bdf8", 2.5); drawArrow(ctx, entX, entY, exitX, exitY, "#38bdf8");
      drawLine(ctx, exitX, exitY, emeEX, emeEY, "#34d399", 2.5); drawArrow(ctx, exitX, exitY, emeEX, emeEY, "#34d399");

      /* Labels */
      drawLabel(ctx, "Incident ray", incSX - 10, incSY - 16, "#fde68a", 11);
      drawLabel(ctx, "Emergent ray", emeEX + 14, emeEY - 16, "#6ee7b7", 11);

      /* Angle arcs */
      const arcR = 26;
      ctx.save(); ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(entX, entY, arcR, -Math.PI / 2, -Math.PI / 2 + iRad, false); ctx.stroke(); ctx.restore();
      drawLabel(ctx, `∠i=${iDeg}°`, entX - arcR - 16, entY - arcR * 0.6, "#fbbf24", 10);

      ctx.save(); ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(entX, entY, arcR + 6, Math.PI / 2, Math.PI / 2 + rRad, false); ctx.stroke(); ctx.restore();
      drawLabel(ctx, `∠r=${(rRad * 180 / Math.PI).toFixed(1)}°`, entX + arcR + 22, entY + arcR * 0.5, "#38bdf8", 10);

      ctx.save(); ctx.strokeStyle = "#34d399"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(exitX, exitY, arcR, Math.PI / 2, Math.PI / 2 + iRad, false); ctx.stroke(); ctx.restore();
      drawLabel(ctx, `∠e=${iDeg}°`, exitX + arcR + 22, exitY + arcR * 0.5, "#34d399", 10);

      /* Lateral displacement indicator */
      if (dPx > 4) {
        const midY = (exitY + emeEY) / 2;
        drawLine(ctx, exitX, midY, exitX + dPx, midY, "#f87171", 1.5, true, false);
        ctx.save();
        ctx.fillStyle = "#f87171";
        ctx.font = "600 10px Inter, system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(`d = ${(t / 10 * Math.sin(iRad - rRad) / Math.cos(rRad)).toFixed(1)} mm`, exitX + dPx * 0.5, midY - 12);
        ctx.restore();
      }

      /* Animated photon */
      const phColor = phY < slabTop ? "#fde68a" : phY < slabBot ? "#7dd3fc" : "#6ee7b7";
      ctx.save(); ctx.shadowColor = phColor; ctx.shadowBlur = 16;
      ctx.fillStyle = phColor; ctx.beginPath(); ctx.arc(phX, phY, 5, 0, Math.PI * 2); ctx.fill(); ctx.restore();

      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, []); /* ← empty: RAF reads latest values via refs */

  /* UI display values */
  const rRad = Math.asin(Math.min(1, Math.sin(toRad(angleDeg)) / nIndex));
  const dVal = (thickness / 10 * Math.sin(toRad(angleDeg) - rRad) / Math.cos(rRad)).toFixed(2);
  const rDeg = (rRad * 180 / Math.PI).toFixed(1);

  return (
    <div className={styles.simCard}>
      {/* ── Header ── */}
      <div className={styles.simHeader}>
        <div className={styles.simIcon}>🔲</div>
        <span className={styles.simTitle}>Glass Slab — Lateral Displacement</span>
        <span className={styles.simBadge}>INTERACTIVE</span>
      </div>

      {/* ── Canvas ── */}
      <div className={styles.canvasWrap}>
        <canvas ref={canvasRef} style={{ display: "block", width: "100%", touchAction: "none" }} />
      </div>

      {/* ── Controls ── */}
      <div className={styles.controls}>
        <div className={styles.sliderRow}>
          <label className={styles.sliderLabel}>
            ∠ Incidence: <strong style={{ color: "#fbbf24" }}>{angleDeg}°</strong>
          </label>
          <input type="range" min={0} max={75} step={1} value={angleDeg}
            onChange={(e) => setAngleDeg(Number(e.target.value))} className={styles.slider} />
        </div>
        <div className={styles.sliderRow}>
          <label className={styles.sliderLabel}>
            Thickness: <strong style={{ color: "#60a5fa" }}>{thickness} mm</strong>
          </label>
          <input type="range" min={40} max={200} step={5} value={thickness}
            onChange={(e) => setThickness(Number(e.target.value))} className={styles.slider} />
        </div>
        <div className={styles.sliderRow}>
          <label className={styles.sliderLabel}>
            Index n: <strong style={{ color: "#a78bfa" }}>{nIndex.toFixed(1)}</strong>
          </label>
          <input type="range" min={1.3} max={2.5} step={0.1} value={nIndex}
            onChange={(e) => setNIndex(Number(e.target.value))} className={styles.slider} />
        </div>
      </div>

      {/* ── Info Row ── */}
      <div className={styles.infoRow}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>∠ Incidence</span>
          <span className={styles.infoValue} style={{ color: "#fbbf24" }}>{angleDeg}°</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>∠ Refraction</span>
          <span className={styles.infoValue} style={{ color: "#38bdf8" }}>{rDeg}°</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>∠ Emergent</span>
          <span className={styles.infoValue} style={{ color: "#34d399" }}>{angleDeg}°</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Lateral d</span>
          <span className={styles.infoValue} style={{ color: "#f87171" }}>{dVal} mm</span>
        </div>
      </div>

      {/* ── Formula ── */}
      <div className={styles.formula}>
        <span className={styles.formulaLabel}>Lateral Displacement</span>
        <span className={styles.formulaExpr}>d = t × sin(i − r) / cos(r)</span>
        <span className={styles.formulaValues}>
          = {thickness} × sin({angleDeg}° − {rDeg}°) / cos({rDeg}°) = <strong style={{ color: "#f87171" }}>{dVal} mm</strong>
        </span>
      </div>
    </div>
  );
}
