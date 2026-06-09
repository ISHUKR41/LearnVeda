/**
 * FILE: RainbowFormationSim.tsx
 * LOCATION: frontend/src/components/simulations/light/dispersion/RainbowFormationSim.tsx
 *
 * PURPOSE: Animated simulation showing how a rainbow forms in a water droplet.
 *          Demonstrates the complete optical path: refraction at entry,
 *          total internal reflection at back, refraction at exit, VIBGYOR dispersion.
 *
 * FEATURES:
 *   - "Droplet View": single water droplet showing all 7 VIBGYOR ray paths
 *   - "Rainbow View": full arc from observer's perspective with sky + ground
 *   - Animated photon traversal (60fps RAF loop with mutable refs)
 *   - Adjustable angle of incidence on droplet
 *   - Toggle ray paths on/off
 *   - VIBGYOR exit angles displayed: Red 42.5° — Violet 40.6°
 *   - Real-life explanation: why rainbow is always at 40°–42° from anti-solar point
 *   - Responsive canvas via ResizeObserver + devicePixelRatio
 *
 * PHYSICS:
 *   White light enters water droplet (n ≈ 1.33 average).
 *   Refraction at entry disperses colours (Cauchy's law: shorter λ → higher n).
 *   TIR at back of droplet reflects light inward.
 *   Second refraction at exit further separates colours.
 *   Minimum deviation angle for primary rainbow:
 *     Red: ~42.5°   Violet: ~40.6°  (from anti-solar axis)
 *
 * PATTERN: All drawing inside RAF loop using mutable refs.
 *
 * LAST UPDATED: 2026-06-09
 */

"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import styles from "../SimulationEngine.module.css";

/* ── VIBGYOR data (wavelength colours, refractive indices, exit angles) ── */
const VIBGYOR = [
  { name: "Violet", hex: "#8b5cf6", n: 1.3435, angle: 40.6 },
  { name: "Indigo", hex: "#6366f1", n: 1.341,  angle: 40.8 },
  { name: "Blue",   hex: "#60a5fa", n: 1.338,  angle: 41.2 },
  { name: "Green",  hex: "#34d399", n: 1.336,  angle: 41.6 },
  { name: "Yellow", hex: "#fbbf24", n: 1.334,  angle: 42.0 },
  { name: "Orange", hex: "#fb923c", n: 1.333,  angle: 42.3 },
  { name: "Red",    hex: "#f87171", n: 1.331,  angle: 42.5 },
];

const toRad = (d: number) => d * Math.PI / 180;

function drawLabel(
  ctx: CanvasRenderingContext2D, t: string,
  x: number, y: number, col = "#e2e8f0", sz = 12, align: CanvasTextAlign = "center"
) {
  ctx.save();
  ctx.font = `600 ${sz}px Inter, system-ui, sans-serif`;
  ctx.fillStyle = col; ctx.textAlign = align; ctx.textBaseline = "middle";
  ctx.fillText(t, x, y); ctx.restore();
}

/* ═══════════════════════════════════════════════
 * COMPONENT: RainbowFormationSim
 * ═══════════════════════════════════════════════ */
export default function RainbowFormationSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const tRef      = useRef<number>(0);

  /* Mutable refs for RAF loop */
  const viewRef      = useRef<"droplet" | "rainbow">("droplet");
  const incAngleRef  = useRef<number>(55);
  const showPathsRef = useRef<boolean>(true);
  const dimsRef      = useRef<{ w: number; h: number }>({ w: 640, h: 400 });

  const [view,      setViewState]      = useState<"droplet" | "rainbow">("droplet");
  const [incAngle,  setIncAngleState]  = useState(55);
  const [showPaths, setShowPathsState] = useState(true);
  const [dims,      setDims]           = useState({ w: 640, h: 400 });

  const setView = useCallback((v: "droplet" | "rainbow") => { viewRef.current = v; setViewState(v); }, []);
  const setIncAngle  = useCallback((v: number)  => { incAngleRef.current = v;  setIncAngleState(v);  }, []);
  const setShowPaths = useCallback((v: boolean) => { showPathsRef.current = v; setShowPathsState(v); }, []);

  /* ── Resize ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      const h = Math.max(280, Math.min(440, width * 0.62));
      const next = { w: Math.round(width), h: Math.round(h) };
      dimsRef.current = next; setDims(next);
    });
    ro.observe(canvas.parentElement!);
    return () => ro.disconnect();
  }, []);

  /* ── Canvas pixel setup on resize ── */
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
      tRef.current = (tRef.current + 0.005) % 1;

      const ctx = canvas!.getContext("2d")!;
      const { w: W, h: H } = dimsRef.current;
      const currentView  = viewRef.current;
      const iAngle       = incAngleRef.current;
      const showRayPaths = showPathsRef.current;

      /* Background */
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#050d1a"); bg.addColorStop(1, "#0a1628");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      if (currentView === "droplet") {
        /* ─── SINGLE DROPLET VIEW ─── */
        const cx = W * 0.52, cy = H * 0.47;
        const R  = Math.min(W, H) * 0.21;

        /* Droplet fill */
        const dropGrad = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.25, R * 0.1, cx, cy, R);
        dropGrad.addColorStop(0, "rgba(147, 197, 253, 0.32)");
        dropGrad.addColorStop(0.7, "rgba(96, 165, 250, 0.15)");
        dropGrad.addColorStop(1, "rgba(59, 130, 246, 0.06)");
        ctx.fillStyle = dropGrad; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
        ctx.save(); ctx.strokeStyle = "rgba(147, 197, 253, 0.45)"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
        drawLabel(ctx, "Water Droplet  (n̄ ≈ 1.33)", cx, cy + R + 18, "#93c5fd", 11);

        if (showRayPaths) {
          /* Draw incident + internal path + exit for each colour */
          VIBGYOR.forEach((col, idx) => {
            const iRad = toRad(iAngle);
            const rRad = Math.asin(Math.min(1, Math.sin(iRad) / col.n));

            /* Entry point on left side (staggered vertically per colour) */
            const entAng = Math.PI + 0.28 + idx * 0.015;
            const ex = cx + R * Math.cos(entAng);
            const ey = cy + R * Math.sin(entAng) - idx * 2.5 + VIBGYOR.length * 1.2;

            /* Internal "bounce" (TIR) approximation */
            const tirX = cx + R * 0.95 * Math.cos(0.4 + idx * 0.035);
            const tirY = cy - R * 0.88 * Math.sin(0.2 + idx * 0.02);

            /* Exit point (lower-right, angle increases toward red) */
            const exitAng = toRad(-(col.angle - 38));
            const exitX = cx + R * Math.cos(exitAng);
            const exitY = cy + R * Math.sin(-exitAng);

            /* Internal path (dashed) */
            ctx.save(); ctx.globalAlpha = 0.45; ctx.strokeStyle = col.hex; ctx.lineWidth = 1.2;
            ctx.setLineDash([3, 3]);
            ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(tirX, tirY); ctx.lineTo(exitX, exitY);
            ctx.stroke(); ctx.setLineDash([]); ctx.restore();

            /* Incident ray (from left) */
            ctx.save(); ctx.globalAlpha = 0.65; ctx.strokeStyle = col.hex; ctx.lineWidth = 1.5;
            ctx.shadowColor = col.hex; ctx.shadowBlur = 5;
            ctx.beginPath(); ctx.moveTo(Math.max(0, ex - 120), ey); ctx.lineTo(ex, ey); ctx.stroke(); ctx.restore();

            /* Exit ray (dispersed outward) */
            const exitDirX = Math.cos(exitAng + 0.2 + idx * 0.04);
            const exitDirY = Math.sin(exitAng - 0.1 - idx * 0.03);
            const exitEndX = exitX + exitDirX * W * 0.36;
            const exitEndY = exitY + exitDirY * H * 0.32;
            ctx.save(); ctx.globalAlpha = 0.82; ctx.strokeStyle = col.hex; ctx.lineWidth = 1.8;
            ctx.shadowColor = col.hex; ctx.shadowBlur = 7;
            ctx.beginPath(); ctx.moveTo(exitX, exitY); ctx.lineTo(exitEndX, exitEndY); ctx.stroke(); ctx.restore();
          });
        }

        /* Animated photon along incident path */
        const t = tRef.current;
        const phX = -20 + (cx - R * 0.72 + 20) * t;
        const phY = cy + R * Math.sin(Math.PI + 0.28);
        ctx.save(); ctx.shadowColor = "#fef3c7"; ctx.shadowBlur = 18;
        ctx.fillStyle = "#fffde7"; ctx.beginPath(); ctx.arc(phX, phY, 4.5, 0, Math.PI * 2); ctx.fill(); ctx.restore();

        /* Annotations */
        drawLabel(ctx, "Sunlight →", 40, H * 0.22, "#fde68a", 11);
        drawLabel(ctx, "① Refraction", cx - R - 28, H * 0.32, "#94a3b8", 9);
        drawLabel(ctx, "② TIR", cx + R * 0.6, cy - R * 0.85, "#94a3b8", 9);
        drawLabel(ctx, "③ Refraction", cx + R * 0.85, cy + R * 0.45, "#94a3b8", 9);
        drawLabel(ctx, "Red ≈ 42.5°  |  Violet ≈ 40.6°  (from anti-solar axis)",
          W * 0.5, H * 0.94, "#64748b", 10);

      } else {
        /* ─── FULL RAINBOW ARC VIEW ─── */

        /* Sky */
        const sky = ctx.createLinearGradient(0, 0, 0, H * 0.73);
        sky.addColorStop(0, "#0a1628"); sky.addColorStop(1, "#152642");
        ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H * 0.73);

        /* Ground */
        const grd = ctx.createLinearGradient(0, H * 0.73, 0, H);
        grd.addColorStop(0, "#14532d"); grd.addColorStop(1, "#052e16");
        ctx.fillStyle = grd; ctx.fillRect(0, H * 0.73, W, H * 0.27);

        /* Sun (top-right) */
        ctx.save(); ctx.fillStyle = "#fef3c7"; ctx.shadowColor = "#fbbf24"; ctx.shadowBlur = 28;
        ctx.beginPath(); ctx.arc(W * 0.88, H * 0.82, 18, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        drawLabel(ctx, "☀ Sun", W * 0.88, H * 0.82 - 30, "#fde68a", 10);

        /* Observer (left at horizon) */
        ctx.save(); ctx.fillStyle = "#94a3b8"; ctx.shadowColor = "#e2e8f0"; ctx.shadowBlur = 4;
        ctx.beginPath(); ctx.arc(W * 0.08, H * 0.7, 8, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        drawLabel(ctx, "Observer", W * 0.08, H * 0.7 - 22, "#94a3b8", 10);

        /* Anti-solar axis (dashed) */
        ctx.save(); ctx.strokeStyle = "rgba(251,191,36,0.28)"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(W * 0.08, H * 0.7); ctx.lineTo(W * 0.88, H * 0.82);
        ctx.stroke(); ctx.setLineDash([]); ctx.restore();

        /* Rainbow arcs (VIBGYOR — violet inner, red outer) */
        const obX = W * 0.08, obY = H * 0.7;
        VIBGYOR.forEach((col, i) => {
          const arcR = (H * 0.38) + i * 8;
          ctx.save(); ctx.globalAlpha = 0.72; ctx.strokeStyle = col.hex; ctx.lineWidth = 5;
          ctx.shadowColor = col.hex; ctx.shadowBlur = 7;
          ctx.beginPath(); ctx.arc(obX, obY, arcR, -Math.PI * 0.88, -Math.PI * 0.12); ctx.stroke();
          ctx.restore();
        });

        /* Labels */
        drawLabel(ctx, "Primary Rainbow  (40° – 42.5°)", W * 0.5, H * 0.08, "#e2e8f0", 13);
        drawLabel(ctx, "Violet (inner) ≈ 40.6°   Red (outer) ≈ 42.5°", W * 0.5, H * 0.145, "#94a3b8", 10);
        drawLabel(ctx, "Anti-solar axis", W * 0.46, H * 0.78, "rgba(251,191,36,0.45)", 9);

        /* Animated photon coming from sun side */
        const t2 = tRef.current;
        const phSX = W * 0.88, phSY = H * 0.75;
        const phEX = W * 0.52, phEY = H * 0.32;
        ctx.save(); ctx.shadowColor = "#fef3c7"; ctx.shadowBlur = 18;
        ctx.fillStyle = "#fffde7"; ctx.beginPath();
        ctx.arc(phSX + (phEX - phSX) * t2, phSY + (phEY - phSY) * t2, 4, 0, Math.PI * 2);
        ctx.fill(); ctx.restore();
      }

      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, []); /* ← empty: reads all values via refs */

  return (
    <div className={styles.simCard}>
      {/* ── Header ── */}
      <div className={styles.simHeader}>
        <div className={styles.simIcon}>🌦️</div>
        <span className={styles.simTitle}>Rainbow Formation — Refraction + TIR + Dispersion</span>
        <span className={styles.simBadge}>INTERACTIVE</span>
      </div>

      {/* ── Canvas ── */}
      <div className={styles.canvasWrap}>
        <canvas ref={canvasRef} style={{ display: "block", width: "100%", touchAction: "none" }} />
      </div>

      {/* ── Controls ── */}
      <div className={styles.controls}>
        <div className={styles.btnGroup}>
          <button className={`${styles.toggleBtn} ${view === "droplet" ? styles.active : ""}`}
            onClick={() => setView("droplet")}>💧 Droplet</button>
          <button className={`${styles.toggleBtn} ${view === "rainbow" ? styles.active : ""}`}
            onClick={() => setView("rainbow")}>🌈 Rainbow</button>
          <button className={`${styles.toggleBtn} ${showPaths ? styles.active : ""}`}
            onClick={() => setShowPaths(!showPaths)}>🔦 Ray Paths</button>
        </div>
        {view === "droplet" && (
          <div className={styles.sliderRow}>
            <label className={styles.sliderLabel}>
              ∠ Incidence: <strong style={{ color: "#fbbf24" }}>{incAngle}°</strong>
            </label>
            <input type="range" min={30} max={75} step={1} value={incAngle}
              onChange={(e) => setIncAngle(Number(e.target.value))} className={styles.slider} />
          </div>
        )}
      </div>

      {/* ── Info Row ── */}
      <div className={styles.infoRow}>
        {VIBGYOR.slice(0, 4).map((c) => (
          <div key={c.name} className={styles.infoItem}>
            <span className={styles.infoLabel} style={{ color: c.hex }}>{c.name}</span>
            <span className={styles.infoValue} style={{ color: c.hex }}>{c.angle}°</span>
          </div>
        ))}
      </div>

      {/* ── Formula ── */}
      <div className={styles.formula}>
        <span className={styles.formulaLabel}>Minimum Deviation (Primary Rainbow)</span>
        <span className={styles.formulaExpr}>D = 180° + 2i − 4r  (at minimum deviation)</span>
        <span className={styles.formulaValues}>
          Red ≈ 42.5° · Orange ≈ 42.3° · Yellow ≈ 42.0° · Green ≈ 41.6° · Blue ≈ 41.2° · Violet ≈ 40.6°
        </span>
      </div>
    </div>
  );
}
