/**
 * FILE: TwoMirrorsSim.tsx
 * LOCATION: frontend/src/components/simulations/light/reflection/TwoMirrorsSim.tsx
 *
 * PURPOSE: Interactive simulation of two plane mirrors placed at angle θ.
 *          Demonstrates n = (360°/θ) − 1 image formula with live animation.
 *
 * FEATURES:
 *   - Adjust angle θ (30°–180°) with a slider
 *   - Live ray diagram: 2 mirrors, object, all virtual images
 *   - Animated photon bouncing along ray path (continuous 60fps RAF loop)
 *   - n = (360°/θ) − 1 formula displayed live
 *   - Preset angle buttons: 30°, 45°, 60°, 72°, 90°, 120°
 *   - Color-coded images (1st, 2nd, … reflections)
 *   - Real-life context: kaleidoscope (60°=5 imgs), corner reflector (90°=3 imgs)
 *   - Responsive canvas via ResizeObserver + devicePixelRatio
 *
 * PHYSICS:
 *   n = (360°/θ) − 1  [valid when 360°/θ is an even integer]
 *   Special case: θ=90° → 3 images (corner reflector / road reflectors)
 *
 * PATTERN: All drawing inside RAF loop using mutable refs to avoid stale closures.
 *
 * LAST UPDATED: 2026-06-09
 */

"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import styles from "../SimulationEngine.module.css";

/* ─── Helpers ─── */
function reflectAcrossLine(
  px: number, py: number,
  ox: number, oy: number,
  a: number
): [number, number] {
  const rx = px - ox, ry = py - oy;
  const c2 = Math.cos(2 * a), s2 = Math.sin(2 * a);
  return [rx * c2 + ry * s2 + ox, rx * s2 - ry * c2 + oy];
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  color: string, width = 2, dashed = false, glow = false
) {
  ctx.save();
  if (glow) { ctx.shadowColor = color; ctx.shadowBlur = 10; }
  ctx.strokeStyle = color; ctx.lineWidth = width;
  if (dashed) ctx.setLineDash([6, 4]);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.setLineDash([]); ctx.restore();
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  text: string, x: number, y: number,
  color = "#e2e8f0", size = 12,
  align: CanvasTextAlign = "center"
) {
  ctx.save();
  ctx.font = `600 ${size}px Inter, system-ui, sans-serif`;
  ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = "middle";
  ctx.fillText(text, x, y); ctx.restore();
}

/* ═══════════════════════════════════════════════
 * COMPONENT: TwoMirrorsSim
 * ═══════════════════════════════════════════════ */
export default function TwoMirrorsSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const tRef      = useRef<number>(0);          /* animation time 0–1 */

  /* Refs mirror the state so the RAF loop always reads latest values */
  const angleRef  = useRef<number>(60);
  const dimsRef   = useRef<{ w: number; h: number }>({ w: 640, h: 400 });

  const [angleDeg, setAngleDegState] = useState(60);
  const [dims,     setDims]          = useState({ w: 640, h: 400 });

  /* Keep refs in sync */
  const setAngleDeg = useCallback((v: number) => {
    angleRef.current = v;
    setAngleDegState(v);
  }, []);

  /* ── Canvas resize ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      const h = Math.max(260, Math.min(440, width * 0.62));
      const next = { w: Math.round(width), h: Math.round(h) };
      dimsRef.current = next;
      setDims(next);
    });
    ro.observe(canvas.parentElement!);
    return () => ro.disconnect();
  }, []);

  /* ── Canvas pixel setup whenever dims change ── */
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

  /* ── Main animation RAF loop (runs once, reads refs) ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function render() {
      /* Advance animation clock */
      tRef.current = (tRef.current + 0.007) % 1;

      const ctx = canvas!.getContext("2d")!;
      const { w: W, h: H } = dimsRef.current;
      const theta   = angleRef.current;

      /* ── Background ── */
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#050d1a"); bg.addColorStop(1, "#0a1628");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      /* ── Geometry ── */
      const vx = W * 0.42, vy = H * 0.82;
      const mirrorLen = Math.max(W, H) * 0.72;
      const m1Angle   = -Math.PI / 2;
      const thetaRad  = theta * Math.PI / 180;
      const m2Angle   = m1Angle + thetaRad;
      const nImages   = Math.min(Math.round(360 / theta) - 1, 11);

      /* Object inside angle bisector */
      const objAngle = m1Angle + thetaRad / 2;
      const objDist  = mirrorLen * 0.32;
      const objX = vx + objDist * Math.cos(objAngle);
      const objY = vy + objDist * Math.sin(objAngle);

      /* Mirror endpoints */
      const m1EndX = vx + mirrorLen * Math.cos(m1Angle);
      const m1EndY = vy + mirrorLen * Math.sin(m1Angle);
      const m2EndX = vx + mirrorLen * Math.cos(m2Angle);
      const m2EndY = vy + mirrorLen * Math.sin(m2Angle);

      /* ── Mirror 1 ── */
      ctx.save();
      ctx.strokeStyle = "#93c5fd"; ctx.lineWidth = 4;
      ctx.shadowColor = "#60a5fa"; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(m1EndX, m1EndY); ctx.stroke();
      ctx.restore();
      /* Hatch marks */
      for (let i = 1; i <= 7; i++) {
        const t = i / 8;
        const mx = vx + (m1EndX - vx) * t, my = vy + (m1EndY - vy) * t;
        drawLine(ctx, mx, my, mx + Math.cos(m1Angle + Math.PI / 2) * 6,
          my + Math.sin(m1Angle + Math.PI / 2) * 6, "rgba(147,197,253,0.28)", 1.5);
      }

      /* ── Mirror 2 ── */
      ctx.save();
      ctx.strokeStyle = "#818cf8"; ctx.lineWidth = 4;
      ctx.shadowColor = "#818cf8"; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(m2EndX, m2EndY); ctx.stroke();
      ctx.restore();
      for (let i = 1; i <= 7; i++) {
        const t = i / 8;
        const mx = vx + (m2EndX - vx) * t, my = vy + (m2EndY - vy) * t;
        drawLine(ctx, mx, my, mx + Math.cos(m2Angle - Math.PI / 2) * 6,
          my + Math.sin(m2Angle - Math.PI / 2) * 6, "rgba(129,140,248,0.28)", 1.5);
      }

      /* ── Angle arc ── */
      ctx.save(); ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(vx, vy, 48, m1Angle, m2Angle, false); ctx.stroke(); ctx.restore();
      const arcMid = (m1Angle + m2Angle) / 2;
      drawLabel(ctx, `θ=${theta}°`, vx + 68 * Math.cos(arcMid), vy + 68 * Math.sin(arcMid), "#fbbf24", 12);

      /* ── Object dot ── */
      ctx.save(); ctx.shadowColor = "#fde68a"; ctx.shadowBlur = 20;
      ctx.fillStyle = "#fbbf24"; ctx.beginPath(); ctx.arc(objX, objY, 8, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      drawLabel(ctx, "Object", objX, objY - 18, "#fde68a", 11);

      /* ── Virtual images via sequential reflections ── */
      const IMG_COLORS = [
        "#34d399","#f87171","#a78bfa","#60a5fa","#fb923c",
        "#e879f9","#4ade80","#facc15","#38bdf8","#c084fc","#f472b6"
      ];
      let pos: [number, number] = [objX, objY];
      let useM1 = true;
      for (let i = 0; i < nImages; i++) {
        const ma = useM1 ? m1Angle : m2Angle;
        const [ix, iy] = reflectAcrossLine(pos[0], pos[1], vx, vy, ma);
        drawLine(ctx, pos[0], pos[1], ix, iy, `${IMG_COLORS[i]}44`, 1.2, true);
        ctx.save();
        ctx.globalAlpha = Math.max(0.2, 1 - i * 0.12);
        ctx.shadowColor = IMG_COLORS[i]; ctx.shadowBlur = 12;
        ctx.fillStyle = IMG_COLORS[i];
        ctx.beginPath(); ctx.arc(ix, iy, Math.max(4, 6.5 - i * 0.4), 0, Math.PI * 2); ctx.fill(); ctx.restore();
        drawLabel(ctx, `I${i + 1}`, ix, iy - 15, `${IMG_COLORS[i]}cc`, 10);
        pos = [ix, iy]; useM1 = !useM1;
      }

      /* ── Animated photon (travels from object toward m1 endpoint) ── */
      const t = tRef.current;
      const phX = objX + (m1EndX - objX) * (t * 0.45);
      const phY = objY + (m1EndY - objY) * (t * 0.45);
      ctx.save(); ctx.shadowColor = "#fef3c7"; ctx.shadowBlur = 18;
      ctx.fillStyle = "#fef9e7"; ctx.beginPath(); ctx.arc(phX, phY, 4.5, 0, Math.PI * 2); ctx.fill(); ctx.restore();

      /* ── Labels ── */
      drawLabel(ctx, "Mirror 1", m1EndX, m1EndY - 16, "#93c5fd", 11);
      drawLabel(ctx, "Mirror 2", m2EndX + 12, m2EndY - 12, "#818cf8", 11);
      drawLabel(ctx, "V", vx + 12, vy + 16, "#64748b", 11);

      /* ── Formula panel ── */
      const panW = Math.min(200, W * 0.32), panH = 58, panX = 14, panY = 12;
      ctx.save();
      ctx.fillStyle = "rgba(12, 20, 42, 0.75)"; ctx.strokeStyle = "rgba(251,191,36,0.2)"; ctx.lineWidth = 1;
      ctx.beginPath(); (ctx as any).roundRect(panX, panY, panW, panH, 10); ctx.fill(); ctx.stroke(); ctx.restore();
      drawLabel(ctx, `n = 360°/${theta}° − 1`, panX + panW / 2, panY + 19, "#fbbf24", 11);
      drawLabel(ctx, `Images: ${nImages}`, panX + panW / 2, panY + 40, "#34d399", 13);

      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, []); /* ← intentionally empty: RAF loop reads all values via refs */

  /* Computed for UI */
  const nImages = Math.min(Math.round(360 / angleDeg) - 1, 11);
  const example = angleDeg === 90 ? "Corner reflector (3 imgs)"
    : angleDeg === 60 ? "Kaleidoscope (5 imgs)"
    : angleDeg === 45 ? "Barber's mirror (7 imgs)"
    : angleDeg === 72 ? "Pentagon (4 imgs)"
    : `${nImages} images`;

  return (
    <div className={styles.simCard}>
      {/* ── Header ── */}
      <div className={styles.simHeader}>
        <div className={styles.simIcon}>🔱</div>
        <span className={styles.simTitle}>Two Mirrors at an Angle — n = (360°/θ) − 1</span>
        <span className={styles.simBadge}>INTERACTIVE</span>
      </div>

      {/* ── Canvas ── */}
      <div className={styles.canvasWrap}>
        <canvas ref={canvasRef} style={{ display: "block", width: "100%", touchAction: "none" }} />
      </div>

      {/* ── Controls ── */}
      <div className={styles.controls}>
        {/* Angle slider */}
        <div className={styles.sliderRow}>
          <label className={styles.sliderLabel}>
            Angle θ: <strong style={{ color: "#fbbf24" }}>{angleDeg}°</strong>
          </label>
          <input type="range" min={30} max={180} step={1} value={angleDeg}
            onChange={(e) => setAngleDeg(Number(e.target.value))}
            className={styles.slider} />
        </div>
        {/* Preset buttons */}
        <div className={styles.btnGroup}>
          {[30, 45, 60, 72, 90, 120].map((a) => (
            <button key={a} onClick={() => setAngleDeg(a)}
              className={`${styles.toggleBtn} ${angleDeg === a ? styles.active : ""}`}>
              {a}°
            </button>
          ))}
        </div>
      </div>

      {/* ── Info Row ── */}
      <div className={styles.infoRow}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Angle θ</span>
          <span className={styles.infoValue} style={{ color: "#fbbf24" }}>{angleDeg}°</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Images (n)</span>
          <span className={styles.infoValue} style={{ color: "#34d399" }}>{nImages}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Formula</span>
          <span className={styles.infoValue} style={{ color: "#818cf8", fontSize: "11px" }}>360/θ − 1</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Example</span>
          <span className={styles.infoValue} style={{ color: "#94a3b8", fontSize: "10px" }}>{example}</span>
        </div>
      </div>

      {/* ── Formula bar ── */}
      <div className={styles.formula}>
        <span className={styles.formulaLabel}>Two-Mirror Formula</span>
        <span className={styles.formulaExpr}>n = (360° / θ) − 1</span>
        <span className={styles.formulaValues}>
          = (360° / {angleDeg}°) − 1 = <strong style={{ color: "#34d399" }}>{nImages} image{nImages !== 1 ? "s" : ""}</strong>
        </span>
      </div>
    </div>
  );
}
