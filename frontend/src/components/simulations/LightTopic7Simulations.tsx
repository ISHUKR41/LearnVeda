"use client";
/**
 * FILE: LightTopic7Simulations.tsx
 * LOCATION: src/components/simulations/LightTopic7Simulations.tsx
 * PURPOSE: 5 fully interactive, animated Canvas-based physics simulations for
 *          Class 10 Light — Topic 7: Total Internal Reflection (TIR) & Optical Fibres.
 *
 * SIMULATIONS (each is a named export):
 *   1. Sim_light_tir_critical_angle   — Drag protractor to watch TIR snap on/off
 *   2. Sim_light_fiber_optic_path     — Animated photon bouncing through bent fibre
 *   3. Sim_light_mirage_formation     — Hot road → curved ray paths → virtual image
 *   4. Sim_light_diamond_sparkle      — Ray tracing through gem facets
 *   5. Sim_light_snell_tir_calc       — n₁/n₂ sliders → live critical angle formula
 *
 * DESIGN SYSTEM:
 *   - Background: #0B1120 → #0a1628 gradient (EduQuest dark navy)
 *   - Light rays: glowing cyan/yellow with shadowBlur
 *   - Labels: amber (#fbbf24), axis: #334155
 *   - All simulations are touch-friendly (mouse + pointer events)
 *
 * PHYSICS NOTES:
 *   - Critical angle: θc = arcsin(n2 / n1) where n1 > n2 (denser → rarer)
 *   - TIR occurs when θi > θc
 *   - Snell's law: n1·sin(θ1) = n2·sin(θ2)
 *
 * LAST UPDATED: 2026-06-08
 */

import React, { useRef, useEffect, useState, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────
 * Shared canvas utility helpers — set up HiDPI canvas, draw rays,
 * draw labels, and fill the dark background.
 * ───────────────────────────────────────────────────────────────── */

/** Initialise a HiDPI canvas and return [ctx, logicalWidth, logicalHeight] */
function setupCanvas(
  canvas: HTMLCanvasElement,
): [CanvasRenderingContext2D, number, number] | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.clientWidth || 560;
  const H = canvas.clientHeight || 340;
  if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
    canvas.width = W * dpr;
    canvas.height = H * dpr;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return [ctx, W, H];
}

/** Fill a dark navy gradient background with subtle dot grid */
function drawBg(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#050c18");
  g.addColorStop(1, "#0a1628");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  /* subtle dot grid */
  ctx.fillStyle = "rgba(99,102,241,0.035)";
  for (let x = 0; x <= W; x += 36)
    for (let y = 0; y <= H; y += 36) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
}

/** Draw a labelled text string */
function txt(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color = "#e2e8f0",
  size = 11,
  bold = false,
  align: CanvasTextAlign = "left",
) {
  ctx.save();
  ctx.font = `${bold ? "bold " : ""}${size}px Inter, system-ui, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
  ctx.restore();
}

/** Draw a glowing ray line from (x1,y1) to (x2,y2) */
function ray(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number,
  x2: number, y2: number,
  color = "#22d3ee",
  width = 2,
  glow = 12,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.shadowColor = color;
  ctx.shadowBlur = glow;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

/** Draw arrowhead at (x2, y2) pointing from (x1,y1) */
function arrowHead(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number,
  x2: number, y2: number,
  color = "#22d3ee",
  size = 8,
) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.save();
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - size * Math.cos(angle - Math.PI / 7), y2 - size * Math.sin(angle - Math.PI / 7));
  ctx.lineTo(x2 - size * Math.cos(angle + Math.PI / 7), y2 - size * Math.sin(angle + Math.PI / 7));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/* ═══════════════════════════════════════════════════════════════
 * SIMULATION 1 — Critical Angle & TIR Explorer
 * User drags an angle slider; below the critical angle the refracted
 * ray exists. At or above the critical angle TIR kicks in — the ray
 * reflects back into the denser medium (glass).
 * Physics: n1=1.5 (glass), n2=1.0 (air), θc = arcsin(1/1.5) ≈ 41.8°
 * ═══════════════════════════════════════════════════════════════ */
export function Sim_light_tir_critical_angle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(30); /* angle of incidence in degrees */

  const n1 = 1.5; /* glass */
  const n2 = 1.0; /* air */
  const criticalAngleDeg = (Math.asin(n2 / n1) * 180) / Math.PI; /* ≈ 41.8° */
  const isTIR = angle >= criticalAngleDeg;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const result = setupCanvas(canvas);
    if (!result) return;
    const [ctx, W, H] = result;

    drawBg(ctx, W, H);

    const cx = W / 2; /* centre x */
    const interfaceY = H / 2 + 20; /* glass–air boundary */
    const len = Math.min(W, H) * 0.38;

    /* ── Interface line (glass/air boundary) ── */
    ctx.save();
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(40, interfaceY);
    ctx.lineTo(W - 40, interfaceY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    /* ── Normal (dashed vertical) ── */
    ctx.save();
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, interfaceY - len - 10);
    ctx.lineTo(cx, interfaceY + len + 10);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    /* ── Medium labels ── */
    txt(ctx, "GLASS  n₁ = 1.5", cx - 60, interfaceY + 18, "#64748b", 11);
    txt(ctx, "AIR  n₂ = 1.0", cx - 50, interfaceY - 8, "#64748b", 11);

    const angleRad = (angle * Math.PI) / 180;

    /* ── Incident ray (from bottom-left, coming UP through glass) ── */
    const ix1 = cx - len * Math.sin(angleRad);
    const iy1 = interfaceY + len * Math.cos(angleRad);
    ray(ctx, ix1, iy1, cx, interfaceY, "#facc15", 2.5, 14);
    arrowHead(ctx, ix1, iy1, cx, interfaceY, "#facc15");
    txt(ctx, `θᵢ = ${Math.round(angle)}°`, cx - len * Math.sin(angleRad) * 0.45 - 36, interfaceY + len * Math.cos(angleRad) * 0.4, "#fbbf24", 12, true);

    if (isTIR) {
      /* ── TOTAL INTERNAL REFLECTION — reflect back into glass ── */
      const rx2 = cx + len * Math.sin(angleRad);
      const ry2 = interfaceY + len * Math.cos(angleRad);
      ray(ctx, cx, interfaceY, rx2, ry2, "#ef4444", 2.5, 16);
      arrowHead(ctx, cx, interfaceY, rx2, ry2, "#ef4444");

      /* TIR label */
      ctx.save();
      ctx.font = "bold 13px Inter, system-ui, sans-serif";
      ctx.fillStyle = "#ef4444";
      ctx.shadowColor = "#ef4444";
      ctx.shadowBlur = 18;
      ctx.fillText("⚡ TOTAL INTERNAL REFLECTION", cx - 130, interfaceY - 28);
      ctx.restore();

      /* No refracted ray goes through */
      ray(ctx, cx, interfaceY, cx, interfaceY - 30, "#ef444430", 1, 0);
    } else {
      /* ── Refracted ray (bends away from normal in air) ── */
      const sinRefract = (n1 * Math.sin(angleRad)) / n2;
      const refractAngle = Math.asin(Math.min(sinRefract, 1));
      const rx2 = cx + len * Math.sin(refractAngle);
      const ry2 = interfaceY - len * Math.cos(refractAngle);
      ray(ctx, cx, interfaceY, rx2, ry2, "#22d3ee", 2.5, 14);
      arrowHead(ctx, cx, interfaceY, rx2, ry2, "#22d3ee");
      txt(ctx, `θᵣ = ${((refractAngle * 180) / Math.PI).toFixed(1)}°`, cx + len * Math.sin(refractAngle) * 0.5 + 4, interfaceY - len * Math.cos(refractAngle) * 0.35, "#22d3ee", 12);

      /* Weak partial reflection */
      ray(ctx, cx, interfaceY, cx + len * 0.4 * Math.sin(angleRad), interfaceY + len * 0.4 * Math.cos(angleRad), "#facc1540", 1.5, 4);
    }

    /* ── Critical angle marker ── */
    ctx.save();
    ctx.setLineDash([4, 3]);
    ctx.strokeStyle = "#f59e0b55";
    ctx.lineWidth = 1;
    const cRad = (criticalAngleDeg * Math.PI) / 180;
    const cx2 = cx - len * 0.7 * Math.sin(cRad);
    const cy2 = interfaceY + len * 0.7 * Math.cos(cRad);
    ctx.beginPath();
    ctx.moveTo(cx2, cy2);
    ctx.lineTo(cx, interfaceY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
    txt(ctx, `θc ≈ ${criticalAngleDeg.toFixed(1)}°`, cx - len * 0.7 * Math.sin(cRad) - 8, cy2 - 4, "#f59e0b", 10);

    /* ── Title ── */
    txt(ctx, "Critical Angle & Total Internal Reflection", W / 2, 22, "#94a3b8", 12, false, "center");
  }, [angle, isTIR]);

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: 340, borderRadius: 14, display: "block", border: "1px solid #1e293b" }}
      />
      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8, padding: "0 4px" }}>
        <label style={{ color: "#94a3b8", fontSize: 13, display: "flex", justifyContent: "space-between" }}>
          <span>Angle of Incidence (θᵢ)</span>
          <span style={{ color: isTIR ? "#ef4444" : "#22d3ee", fontWeight: 700 }}>
            {Math.round(angle)}° {isTIR ? "— TIR!" : `(critical angle ≈ ${criticalAngleDeg.toFixed(1)}°)`}
          </span>
        </label>
        <input
          type="range" min={0} max={89} step={1} value={angle}
          onChange={(e) => setAngle(Number(e.target.value))}
          style={{ width: "100%", accentColor: isTIR ? "#ef4444" : "#22d3ee" }}
        />
        <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
          💡 Drag past <strong style={{ color: "#fbbf24" }}>{criticalAngleDeg.toFixed(1)}°</strong> to see Total Internal Reflection. Below that angle, light refracts into air (Snell's Law).
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * SIMULATION 2 — Optical Fibre Light Path
 * Animated photon bouncing through a bent optical fibre core,
 * demonstrating TIR keeps the light trapped inside.
 * ═══════════════════════════════════════════════════════════════ */
export function Sim_light_fiber_optic_path() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const tRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      const result = setupCanvas(canvas);
      if (!result) return;
      const [ctx, W, H] = result;
      tRef.current += 0.022;
      const t = tRef.current;

      drawBg(ctx, W, H);

      /* ── Define the bent fibre path (bezier-like series of points) ── */
      const cy = H / 2;
      /* Fibre core control points — an S-curve bend */
      const path: [number, number][] = [];
      const segments = 120;
      for (let i = 0; i <= segments; i++) {
        const px = 30 + (i / segments) * (W - 60);
        const bendY = cy + Math.sin((i / segments) * Math.PI * 1.8) * (H * 0.2);
        path.push([px, bendY]);
      }

      /* ── Draw fibre cladding (outer, dark) ── */
      ctx.save();
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 24;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(path[0][0], path[0][1]);
      for (let i = 1; i < path.length; i++) ctx.lineTo(path[i][0], path[i][1]);
      ctx.stroke();

      /* ── Draw fibre core (inner, semi-transparent blue) ── */
      ctx.strokeStyle = "#0f3460";
      ctx.lineWidth = 16;
      ctx.beginPath();
      ctx.moveTo(path[0][0], path[0][1]);
      for (let i = 1; i < path.length; i++) ctx.lineTo(path[i][0], path[i][1]);
      ctx.stroke();
      ctx.restore();

      /* ── Animate photon (glowing dot) along the path ── */
      const pathFrac = (t * 0.5) % 1.0; /* 0 → 1, loops */
      const pidx = Math.min(Math.floor(pathFrac * (path.length - 1)), path.length - 2);
      const [px, py] = path[pidx];

      /* Trailing glow */
      for (let trail = 1; trail <= 18; trail++) {
        const ti = Math.max(pidx - trail * 3, 0);
        const alpha = 1 - trail / 18;
        const [tx, ty] = path[ti];
        ctx.save();
        ctx.fillStyle = `rgba(34,211,238,${alpha * 0.35})`;
        ctx.beginPath();
        ctx.arc(tx, ty, 5 * alpha, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      /* Main photon dot */
      ctx.save();
      ctx.shadowColor = "#22d3ee";
      ctx.shadowBlur = 22;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      /* ── TIR bounce arrows at steep bends ── */
      for (let i = 10; i < path.length - 10; i += 20) {
        const [bx, by] = path[i];
        const prevY = path[i - 8][1];
        const nextY = path[i + 8][1];
        /* Only draw at points that are local extrema (bends) */
        const isTop = by < prevY && by < nextY;
        const isBot = by > prevY && by > nextY;
        if (isTop || isBot) {
          ctx.save();
          ctx.strokeStyle = "rgba(251,191,36,0.5)";
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(bx, by - (isTop ? 12 : -12));
          ctx.lineTo(bx, by + (isTop ? 12 : -12));
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
          txt(ctx, "TIR", bx + 4, by + (isTop ? -6 : 16), "#fbbf2460", 9);
        }
      }

      /* ── Labels ── */
      txt(ctx, "Optical Fibre — Light Trapped by Total Internal Reflection", W / 2, 20, "#94a3b8", 12, false, "center");
      txt(ctx, "Core  n₁ = 1.5 (glass)", 34, cy - H * 0.2 - 20, "#818cf8", 11);
      txt(ctx, "Cladding  n₂ = 1.42", 34, cy - H * 0.2 - 6, "#475569", 10);
      txt(ctx, "DATA SIGNAL →", W - 100, cy + H * 0.18 + 4, "#22d3ee", 10);

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: 320, borderRadius: 14, display: "block", border: "1px solid #1e293b" }}
      />
      <p style={{ fontSize: 12, color: "#64748b", marginTop: 12, fontFamily: "Inter, system-ui, sans-serif" }}>
        🌐 Optical fibres carry internet data as pulses of light. TIR keeps every photon bouncing inside the glass core — no signal loss through the walls.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * SIMULATION 3 — Mirage Formation
 * Hot air near the road surface has lower refractive index than
 * cool air above. Light from the sky bends upward → appears as
 * a "water puddle" below (virtual image of the sky).
 * ═══════════════════════════════════════════════════════════════ */
export function Sim_light_mirage_formation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const tRef = useRef<number>(0);
  const [temperature, setTemperature] = useState(60); /* road surface °C */

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const result = setupCanvas(canvas);
    if (!result) return;
    const [ctx, W, H] = result;
    tRef.current += 0.018;
    const t = tRef.current;

    drawBg(ctx, W, H);

    /* ── Layers of air — gradient from hot (bottom) to cool (top) ── */
    const layers = 8;
    const layerH = H * 0.6 / layers;
    for (let l = 0; l < layers; l++) {
      const y = H * 0.35 + l * layerH;
      const heat = l === 0 ? (temperature - 25) / 75 : (1 - l / layers) * 0.15;
      const alpha = Math.max(0, heat * 0.18);
      ctx.save();
      ctx.fillStyle = `rgba(251,191,36,${alpha})`;
      ctx.fillRect(0, y, W, layerH);
      ctx.restore();
      /* n label on right side */
      const nVal = (1.0 + (layers - l) * 0.003 - l * 0.001 * (temperature / 25)).toFixed(4);
      if (l < 3 || l === layers - 1) {
        txt(ctx, `n = ${nVal}`, W - 90, y + layerH / 2, "#334155", 9);
      }
    }

    /* ── Road surface ── */
    ctx.save();
    const roadGrad = ctx.createLinearGradient(0, H * 0.95, 0, H);
    roadGrad.addColorStop(0, "#1a0a00");
    roadGrad.addColorStop(1, "#0a0500");
    ctx.fillStyle = roadGrad;
    ctx.fillRect(0, H * 0.95, W, H);
    /* heat shimmer */
    for (let i = 0; i < 8; i++) {
      const shimX = 60 + i * (W - 120) / 7 + Math.sin(t * 1.5 + i) * 4;
      const shimAlpha = 0.1 + 0.08 * Math.sin(t * 2.3 + i * 0.7) * (temperature / 60);
      ctx.fillStyle = `rgba(251,191,36,${shimAlpha})`;
      ctx.beginPath();
      ctx.ellipse(shimX, H * 0.95, 30, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    /* ── Curved light rays from sky → bent toward viewer ── */
    const numRays = 3;
    for (let r = 0; r < numRays; r++) {
      const startX = 60 + r * (W * 0.38);
      const startY = H * 0.05;

      /* Parabolic curve simulating the bending through density gradient */
      const bend = (temperature - 25) / 60; /* 0 to 1 */
      ctx.save();
      ctx.strokeStyle = "#22d3ee";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#22d3ee";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(startX, startY);

      const ctrlX = startX + (W * 0.35 - startX) * 0.5;
      const ctrlY = H * (0.5 + bend * 0.35);
      const endX = W * 0.65 + r * 30;
      const endY = H * 0.3;

      ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
      ctx.stroke();
      ctx.restore();

      /* Arrow at end */
      arrowHead(ctx, ctrlX, ctrlY, endX, endY, "#22d3ee", 7);
    }

    /* ── Labels ── */
    txt(ctx, "COOL AIR  (higher n)", W / 2, H * 0.08, "#64748b", 11, false, "center");
    txt(ctx, "HOT AIR  (lower n)", W / 2, H * 0.87, "#f59e0b", 11, false, "center");
    txt(ctx, "Sky", 38, H * 0.08, "#60a5fa", 11, true);
    txt(ctx, "MIRAGE", W * 0.66, H * 0.92, "#22d3ee", 11, true);
    txt(ctx, "(virtual image of sky)", W * 0.64, H * 0.95, "#22d3ee", 10);

    txt(ctx, `Road Surface: ${temperature}°C`, W / 2, 22, "#94a3b8", 12, false, "center");

    frameRef.current = requestAnimationFrame(drawFrame);
  }, [temperature]);

  useEffect(() => {
    frameRef.current = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(frameRef.current);
  }, [drawFrame]);

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: 320, borderRadius: 14, display: "block", border: "1px solid #1e293b" }}
      />
      <div style={{ marginTop: 12, padding: "0 4px" }}>
        <label style={{ color: "#94a3b8", fontSize: 13, display: "flex", justifyContent: "space-between" }}>
          <span>Road Surface Temperature</span>
          <span style={{ color: "#f59e0b", fontWeight: 700 }}>{temperature}°C</span>
        </label>
        <input
          type="range" min={25} max={90} step={1} value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#f59e0b" }}
        />
        <p style={{ fontSize: 12, color: "#64748b", margin: "8px 0 0" }}>
          🌡️ On a hot day, air near the road has lower n than cool air above. Light from the sky bends progressively — TIR near the surface makes it look like water!
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * SIMULATION 4 — Diamond Sparkle (Ray Tracing through Facets)
 * A simplified gem cross-section with multiple TIR bounces, showing
 * why diamonds are cut to maximise internal reflections and brilliance.
 * ═══════════════════════════════════════════════════════════════ */
export function Sim_light_diamond_sparkle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const tRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      const result = setupCanvas(canvas);
      if (!result) return;
      const [ctx, W, H] = result;
      tRef.current += 0.015;
      const t = tRef.current;

      drawBg(ctx, W, H);

      const cx = W / 2;
      const cy = H / 2 + 10;
      const R = Math.min(W, H) * 0.28;

      /* ── Diamond shape (octagon) ── */
      const facets = 8;
      const verts: [number, number][] = [];
      for (let i = 0; i < facets; i++) {
        const a = (i / facets) * Math.PI * 2 - Math.PI / 2;
        verts.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]);
      }

      /* Diamond gradient fill */
      const gemGrad = ctx.createRadialGradient(cx - R * 0.2, cy - R * 0.2, 0, cx, cy, R);
      gemGrad.addColorStop(0, "rgba(147,197,253,0.15)");
      gemGrad.addColorStop(0.5, "rgba(99,102,241,0.08)");
      gemGrad.addColorStop(1, "rgba(15,23,42,0.3)");
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(verts[0][0], verts[0][1]);
      verts.forEach(([vx, vy]) => ctx.lineTo(vx, vy));
      ctx.closePath();
      ctx.fillStyle = gemGrad;
      ctx.fill();
      ctx.strokeStyle = "#60a5fa";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "#60a5fa";
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.restore();

      /* ── Facet lines ── */
      ctx.save();
      ctx.strokeStyle = "#1e40af40";
      ctx.lineWidth = 1;
      for (let i = 0; i < facets; i += 2) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(verts[i][0], verts[i][1]);
        ctx.stroke();
      }
      ctx.restore();

      /* ── Animated light rays bouncing through diamond ── */
      const n1diamond = 2.42; /* diamond's high refractive index */
      const critRad = Math.asin(1 / n1diamond);

      /* Spawn two rays at different entry angles, animate over time */
      const rays: { entry: number; color: string }[] = [
        { entry: t * 0.3, color: "#fbbf24" },
        { entry: t * 0.3 + Math.PI / 3, color: "#22d3ee" },
        { entry: t * 0.3 + (2 * Math.PI) / 3, color: "#f472b6" },
      ];

      rays.forEach(({ entry, color }) => {
        const ex = cx + R * Math.cos(entry);
        const ey = cy + R * Math.sin(entry);

        let rx = ex, ry = ey;
        let dx = cx - ex, dy = cy - ey;
        const dLen = Math.sqrt(dx * dx + dy * dy);
        dx /= dLen; dy /= dLen;

        /* Bounce inside gem up to 5 times */
        for (let b = 0; b < 5; b++) {
          /* Find next intersection with diamond boundary */
          let minT = Infinity;
          let nx = 0, ny = 0;
          let hitX = rx + dx * R * 2, hitY = ry + dy * R * 2;

          for (let v = 0; v < facets; v++) {
            const [x1, y1] = verts[v];
            const [x2, y2] = verts[(v + 1) % facets];
            const ex2 = x2 - x1, ey2 = y2 - y1;
            const det = -dx * ey2 + dy * ex2;
            if (Math.abs(det) < 1e-6) continue;
            const t2 = ((rx - x1) * ey2 - (ry - y1) * ex2) / det;
            const s = ((rx - x1) * (-dy) - (ry - y1) * (-dx)) / det;
            if (t2 > 0.01 && s >= 0 && s <= 1 && t2 < minT) {
              minT = t2;
              hitX = rx + dx * t2;
              hitY = ry + dy * t2;
              const len2 = Math.sqrt(ex2 * ex2 + ey2 * ey2);
              nx = -ey2 / len2; ny = ex2 / len2; /* outward normal */
            }
          }

          /* Draw this bounce segment */
          ray(ctx, rx, ry, hitX, hitY, color, 1.5, 12);

          /* Reflect: r = d - 2(d·n)n */
          const dot = dx * nx + dy * ny;
          const angle2 = Math.acos(Math.max(-1, Math.min(1, Math.abs(dot))));
          if (angle2 < critRad) break; /* refract out */
          dx = dx - 2 * dot * nx;
          dy = dy - 2 * dot * ny;
          rx = hitX; ry = hitY;
        }

        /* Sparkle at entry point */
        ctx.save();
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(ex, ey, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      txt(ctx, "Diamond  n = 2.42  — Multiple TIR Bounces → Brilliance", W / 2, 22, "#94a3b8", 11, false, "center");
      txt(ctx, `θc = ${((Math.asin(1 / n1diamond)) * 180 / Math.PI).toFixed(1)}°`, cx - R - 30, cy, "#fbbf24", 11, true);

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: 340, borderRadius: 14, display: "block", border: "1px solid #1e293b" }}
      />
      <p style={{ fontSize: 12, color: "#64748b", marginTop: 10, fontFamily: "Inter, system-ui, sans-serif" }}>
        💎 Diamond has n = 2.42 — the highest of any natural gem. Its critical angle is only 24.4°, so almost every internal ray undergoes TIR, making it brilliantly sparkly.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * SIMULATION 5 — Snell's Law + Critical Angle Calculator
 * Interactive n₁ and n₂ sliders. See Snell's law and critical angle
 * computed in real time. A ray diagram updates live.
 * ═══════════════════════════════════════════════════════════════ */
export function Sim_light_snell_tir_calc() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [n1, setN1] = useState(1.5);
  const [n2, setN2] = useState(1.0);
  const [thetaI, setThetaI] = useState(35);

  const tirPossible = n1 > n2;
  const criticalAngleDeg = tirPossible ? (Math.asin(n2 / n1) * 180) / Math.PI : null;
  const isTIR = tirPossible && thetaI >= (criticalAngleDeg ?? 90);

  const sinRefract = Math.min(1, (n1 * Math.sin((thetaI * Math.PI) / 180)) / n2);
  const refractAngleDeg = isTIR ? null : (Math.asin(sinRefract) * 180) / Math.PI;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const result = setupCanvas(canvas);
    if (!result) return;
    const [ctx, W, H] = result;
    drawBg(ctx, W, H);

    const cx = W / 2;
    const ifY = H / 2 + 20;
    const len = Math.min(W, H) * 0.36;

    /* Interface */
    ctx.save();
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(40, ifY); ctx.lineTo(W - 40, ifY); ctx.stroke();
    ctx.setLineDash([]);
    /* Normal */
    ctx.strokeStyle = "#2d3f55";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx, ifY - len - 10); ctx.lineTo(cx, ifY + len + 10); ctx.stroke();
    ctx.restore();

    txt(ctx, `Medium 1  n₁ = ${n1.toFixed(2)}`, cx - 80, ifY + 20, "#6366f1", 12);
    txt(ctx, `Medium 2  n₂ = ${n2.toFixed(2)}`, cx - 70, ifY - 12, "#22d3ee", 12);

    const aiRad = (thetaI * Math.PI) / 180;

    /* Incident ray */
    ray(ctx, cx - len * Math.sin(aiRad), ifY + len * Math.cos(aiRad), cx, ifY, "#facc15", 2.5, 14);
    arrowHead(ctx, cx - len * Math.sin(aiRad), ifY + len * Math.cos(aiRad), cx, ifY, "#facc15");
    txt(ctx, `θ₁ = ${thetaI}°`, cx - len * Math.sin(aiRad) * 0.5 - 42, ifY + len * Math.cos(aiRad) * 0.45, "#fbbf24", 12, true);

    if (isTIR) {
      /* TIR reflected ray */
      ray(ctx, cx, ifY, cx + len * Math.sin(aiRad), ifY + len * Math.cos(aiRad), "#ef4444", 2.5, 16);
      arrowHead(ctx, cx, ifY, cx + len * Math.sin(aiRad), ifY + len * Math.cos(aiRad), "#ef4444");
      ctx.save();
      ctx.font = "bold 14px Inter, system-ui";
      ctx.fillStyle = "#ef4444";
      ctx.shadowColor = "#ef4444";
      ctx.shadowBlur = 14;
      ctx.textAlign = "center";
      ctx.fillText("⚡ TIR", cx, ifY - 24);
      ctx.restore();
    } else if (refractAngleDeg !== null) {
      const arRad = (refractAngleDeg * Math.PI) / 180;
      ray(ctx, cx, ifY, cx + len * Math.sin(arRad), ifY - len * Math.cos(arRad), "#22d3ee", 2.5, 14);
      arrowHead(ctx, cx, ifY, cx + len * Math.sin(arRad), ifY - len * Math.cos(arRad), "#22d3ee");
      txt(ctx, `θ₂ = ${refractAngleDeg.toFixed(1)}°`, cx + len * Math.sin(arRad) * 0.55 + 4, ifY - len * Math.cos(arRad) * 0.4, "#22d3ee", 12);
    }

    /* Critical angle dashed ray */
    if (criticalAngleDeg) {
      const cRad = (criticalAngleDeg * Math.PI) / 180;
      ctx.save();
      ctx.setLineDash([4, 3]);
      ctx.strokeStyle = "#f59e0b55";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - len * 0.6 * Math.sin(cRad), ifY + len * 0.6 * Math.cos(cRad));
      ctx.lineTo(cx, ifY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
      txt(ctx, `θc = ${criticalAngleDeg.toFixed(1)}°`, cx - len * 0.6 * Math.sin(cRad) - 4, ifY + len * 0.6 * Math.cos(cRad) - 6, "#f59e0b", 10);
    }

    txt(ctx, "Snell's Law: n₁·sin θ₁ = n₂·sin θ₂", W / 2, 22, "#94a3b8", 12, false, "center");
  }, [n1, n2, thetaI, isTIR, refractAngleDeg, criticalAngleDeg]);

  const sliderStyle = (c: string) => ({ width: "100%", accentColor: c } as React.CSSProperties);
  const labelStyle: React.CSSProperties = { color: "#94a3b8", fontSize: 12, display: "flex", justifyContent: "space-between", marginBottom: 4 };

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: 320, borderRadius: 14, display: "block", border: "1px solid #1e293b" }}
      />
      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
        <div>
          <p style={labelStyle}><span>n₁ (denser medium)</span><strong style={{ color: "#818cf8" }}>{n1.toFixed(2)}</strong></p>
          <input type="range" min={1.0} max={2.5} step={0.05} value={n1} onChange={e => setN1(Number(e.target.value))} style={sliderStyle("#818cf8")} />
        </div>
        <div>
          <p style={labelStyle}><span>n₂ (rarer medium)</span><strong style={{ color: "#22d3ee" }}>{n2.toFixed(2)}</strong></p>
          <input type="range" min={1.0} max={2.5} step={0.05} value={n2} onChange={e => setN2(Number(e.target.value))} style={sliderStyle("#22d3ee")} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <p style={labelStyle}><span>Angle of Incidence θ₁</span><strong style={{ color: isTIR ? "#ef4444" : "#facc15" }}>{thetaI}°</strong></p>
          <input type="range" min={0} max={89} step={1} value={thetaI} onChange={e => setThetaI(Number(e.target.value))} style={sliderStyle(isTIR ? "#ef4444" : "#facc15")} />
        </div>
      </div>
      <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(15,23,42,0.8)", borderRadius: 10, border: "1px solid #1e293b" }}>
        <p style={{ margin: 0, fontSize: 12, color: "#64748b", lineHeight: 1.7 }}>
          {criticalAngleDeg
            ? <>Critical angle: <strong style={{ color: "#fbbf24" }}>{criticalAngleDeg.toFixed(2)}°</strong> &nbsp;|&nbsp; Formula: θc = sin⁻¹(n₂/n₁) = sin⁻¹({(n2 / n1).toFixed(3)}) {isTIR ? "— 🔴 TIR is occurring!" : "— refraction occurs"}</>
            : <span style={{ color: "#ef4444" }}>⚠ TIR only occurs when n₁ &gt; n₂ (denser → rarer). Increase n₁ or decrease n₂.</span>
          }
        </p>
      </div>
    </div>
  );
}
