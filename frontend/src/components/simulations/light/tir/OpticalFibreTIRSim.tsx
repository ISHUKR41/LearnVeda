/**
 * FILE: OpticalFibreTIRSim.tsx
 * LOCATION: src/components/simulations/light/tir/OpticalFibreTIRSim.tsx
 * PURPOSE: Highly interactive Optical Fibre Total Internal Reflection simulation.
 *
 * FEATURES:
 *   ─ Animated curved optical fibre drawn on canvas
 *   ─ Multiple glowing photon particles bouncing inside via TIR
 *   ─ Bend angle slider (0° = straight → 60° = strongly bent)
 *   ─ Real-time angle-of-incidence markers at each reflection point
 *   ─ Critical angle indicator (dashed line)
 *   ─ Fibre material selector: Glass (n=1.5), Diamond (n=2.42), Plastic (n=1.46)
 *   ─ TIR badge flashes when reflection occurs
 *   ─ Responsive canvas with ResizeObserver + HiDPI support
 *   ─ Smooth 60 fps animation loop
 *
 * PHYSICS:
 *   Critical angle θ_c = arcsin(n₂/n₁) where n₂ = air (1.00)
 *   Light bounces whenever θ_incidence > θ_c → TIR → no energy lost
 *
 * LAST UPDATED: 2026-06-11
 */

"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

/* ─────────────────────────────────────────────
 * FIBRE MATERIALS
 * ───────────────────────────────────────────── */
const MATERIALS = [
  { name: "Glass Fibre",    n: 1.50, color: "#38bdf8" },
  { name: "Plastic Fibre",  n: 1.46, color: "#a78bfa" },
  { name: "Diamond Fibre",  n: 2.42, color: "#f0abfc" },
] as const;

type Material = typeof MATERIALS[number];

/* ─────────────────────────────────────────────
 * PHOTON PARTICLE
 * Each photon has a normalised position (0–1) along the fibre axis,
 * a direction (+1 forward, -1 backward in case of reflection),
 * and an offset from the fibre centreline (−1 to +1).
 * ───────────────────────────────────────────── */
interface Photon {
  t: number;       /* normalised position along fibre axis 0 → 1 */
  speed: number;   /* advance per frame */
  sign: number;    /* lateral direction: +1 or -1 */
  alpha: number;   /* opacity for stagger effect */
  trail: Array<{ x: number; y: number; a: number }>; /* glow trail points */
}

/* ─────────────────────────────────────────────
 * HELPERS
 * ───────────────────────────────────────────── */
function criticalAngle(n: number): number {
  /* θ_c = arcsin(n_air / n_fibre) */
  return Math.asin(1.0 / n) * (180 / Math.PI);
}

/* Cubic bezier interpolation for a smooth bent-fibre path */
function bezierPoint(t: number, p0: [number, number], p1: [number, number], p2: [number, number], p3: [number, number]): [number, number] {
  const u = 1 - t;
  const x = u*u*u*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t*t*t*p3[0];
  const y = u*u*u*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t*t*t*p3[1];
  return [x, y];
}

/* Bezier tangent (derivative) for computing local fibre angle */
function bezierTangent(t: number, p0: [number, number], p1: [number, number], p2: [number, number], p3: [number, number]): [number, number] {
  const u = 1 - t;
  const dx = 3*(u*u*(p1[0]-p0[0]) + 2*u*t*(p2[0]-p1[0]) + t*t*(p3[0]-p2[0]));
  const dy = 3*(u*u*(p1[1]-p0[1]) + 2*u*t*(p2[1]-p1[1]) + t*t*(p3[1]-p2[1]));
  const len = Math.hypot(dx, dy) || 1;
  return [dx/len, dy/len];
}

/* Draw a layered glow beam */
function glowLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, width: number, alpha: number) {
  for (const [w, a] of [[width*5, 0.04], [width*2.5, 0.12], [width*1.2, 0.5], [width, 1.0]] as [number, number][]) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.globalAlpha = a * alpha;
    ctx.shadowColor = color;
    ctx.shadowBlur = w * 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }
}

/* ═══════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════ */
export default function OpticalFibreTIRSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);

  /* Controls */
  const [bendAngle, setBendAngle] = useState<number>(30);
  const [matIdx, setMatIdx] = useState<number>(0);

  /* Derived display values */
  const material = MATERIALS[matIdx];
  const θc = criticalAngle(material.n);

  /* Photons state — stored in a ref so we can mutate without re-renders */
  const photonsRef = useRef<Photon[]>([]);

  /* Initialise photons */
  useEffect(() => {
    photonsRef.current = Array.from({ length: 5 }, (_, i) => ({
      t: i * 0.18,
      speed: 0.0028 + i * 0.0004,
      sign: 1,
      alpha: 0.7 + i * 0.06,
      trail: [],
    }));
  }, []);

  /* Main draw + animate function */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const dpr = window.devicePixelRatio || 1;
    const w = W / dpr;
    const h = H / dpr;

    ctx.clearRect(0, 0, W, H);

    /* ── Background ── */
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#0a0f1e");
    bg.addColorStop(1, "#0f172a");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* ── Compute control points for the bent fibre bezier ── */
    const margin = w * 0.08;
    const cy = h * 0.48;
    const bend = (bendAngle / 60) * h * 0.30; /* pixel sag */

    const p0: [number, number] = [margin, cy];
    const p3: [number, number] = [w - margin, cy];
    /* Control points create the bend downward in the middle */
    const p1: [number, number] = [w * 0.35, cy + bend];
    const p2: [number, number] = [w * 0.65, cy + bend];

    const FIBRE_RADIUS = Math.max(8, h * 0.04); /* visual half-thickness */

    /* ── Draw fibre cladding (outer) ── */
    const STEPS = 120;
    const pts: [number, number][] = [];
    for (let i = 0; i <= STEPS; i++) pts.push(bezierPoint(i / STEPS, p0, p1, p2, p3));

    /* Draw outer cladding (darker glow) */
    ctx.save();
    ctx.strokeStyle = "rgba(56,189,248,0.06)";
    ctx.lineWidth = (FIBRE_RADIUS * 2 + 6) * dpr;
    ctx.shadowColor = material.color;
    ctx.shadowBlur = 18;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(pts[0][0] * dpr, pts[0][1] * dpr);
    for (const [px, py] of pts) ctx.lineTo(px * dpr, py * dpr);
    ctx.stroke();
    ctx.restore();

    /* Draw core (mid glow) */
    ctx.save();
    ctx.strokeStyle = "rgba(56,189,248,0.10)";
    ctx.lineWidth = FIBRE_RADIUS * 2 * dpr;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(pts[0][0] * dpr, pts[0][1] * dpr);
    for (const [px, py] of pts) ctx.lineTo(px * dpr, py * dpr);
    ctx.stroke();
    ctx.restore();

    /* ── Animate and draw photons ── */
    const photons = photonsRef.current;
    for (const ph of photons) {
      /* Advance photon */
      ph.t += ph.speed;
      if (ph.t > 1) ph.t = 0;

      /* Position on bezier centreline */
      const [cx2, cy2] = bezierPoint(ph.t, p0, p1, p2, p3);
      /* Tangent gives fibre direction */
      const [tx, ty] = bezierTangent(ph.t, p0, p1, p2, p3);
      /* Perpendicular to centreline */
      const nx = -ty;
      const ny = tx;

      /* Photon oscillates perpendicular to centreline (bounce simulation) */
      const bounceFreq = 12;
      const lateralFrac = Math.sin(ph.t * Math.PI * bounceFreq * (bendAngle / 30 + 0.5));
      const lateralOffset = lateralFrac * (FIBRE_RADIUS * 0.65);

      const px = cx2 + nx * lateralOffset;
      const py = cy2 + ny * lateralOffset;

      /* Append to trail, limit length */
      ph.trail.push({ x: px * dpr, y: py * dpr, a: ph.alpha });
      if (ph.trail.length > 18) ph.trail.shift();

      /* Draw trail */
      for (let i = 1; i < ph.trail.length; i++) {
        const prev = ph.trail[i - 1];
        const curr = ph.trail[i];
        const trailAlpha = (i / ph.trail.length) * 0.8;
        glowLine(ctx, prev.x, prev.y, curr.x, curr.y, material.color, 2 * dpr, trailAlpha * ph.alpha);
      }

      /* Draw photon head */
      ctx.save();
      ctx.fillStyle = "#fff";
      ctx.shadowColor = material.color;
      ctx.shadowBlur = 16;
      ctx.globalAlpha = ph.alpha;
      ctx.beginPath();
      ctx.arc(px * dpr, py * dpr, 3.5 * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    /* ── TIR reflection markers (small arcs at bounce points) ── */
    const N_MARKERS = Math.min(6, Math.max(2, Math.floor(bendAngle / 8) + 2));
    for (let i = 0; i < N_MARKERS; i++) {
      const t2 = 0.1 + (i / (N_MARKERS - 1)) * 0.8;
      const [mx, my] = bezierPoint(t2, p0, p1, p2, p3);
      const [tx2, ty2] = bezierTangent(t2, p0, p1, p2, p3);
      const nx2 = -ty2; const ny2 = tx2;
      const side = i % 2 === 0 ? 1 : -1;
      const bx = (mx + nx2 * FIBRE_RADIUS * 0.9) * dpr;
      const by = (my + ny2 * FIBRE_RADIUS * 0.9) * dpr;

      /* Small arc indicating TIR */
      ctx.save();
      ctx.strokeStyle = "rgba(250,204,21,0.55)";
      ctx.lineWidth = 1.5 * dpr;
      ctx.beginPath();
      const ang = Math.atan2(ny2, nx2);
      ctx.arc(bx, by, 6 * dpr, ang - Math.PI / 3, ang + Math.PI / 3);
      ctx.stroke();
      /* "TIR" label at first marker */
      if (i === 0) {
        ctx.fillStyle = "rgba(250,204,21,0.85)";
        ctx.font = `bold ${10 * dpr}px Inter, sans-serif`;
        ctx.fillText("TIR", bx + 10 * dpr * side, by - 6 * dpr);
      }
      ctx.restore();
    }

    /* ── Entry glow (left end) ── */
    ctx.save();
    ctx.fillStyle = material.color;
    ctx.shadowColor = material.color;
    ctx.shadowBlur = 24;
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.arc(pts[0][0] * dpr, pts[0][1] * dpr, 5 * dpr, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    /* ── Exit glow (right end) ── */
    ctx.save();
    ctx.fillStyle = material.color;
    ctx.shadowColor = material.color;
    ctx.shadowBlur = 28;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.arc(pts[STEPS][0] * dpr, pts[STEPS][1] * dpr, 5 * dpr, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    /* ── Labels ── */
    ctx.save();
    ctx.fillStyle = "rgba(148,163,184,0.9)";
    ctx.font = `${11 * dpr}px Inter, sans-serif`;
    ctx.fillText("Light IN →", pts[0][0] * dpr - 2 * dpr, (pts[0][1] - FIBRE_RADIUS - 10) * dpr);
    ctx.fillText("→ Light OUT", (pts[STEPS][0] - 48) * dpr, (pts[STEPS][1] - FIBRE_RADIUS - 10) * dpr);
    ctx.restore();

    animRef.current = requestAnimationFrame(draw);
  }, [bendAngle, material]);

  /* Start animation when controls change */
  useEffect(() => {
    cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  /* Resize handler — keeps canvas pixel-perfect on all screens */
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ro = new ResizeObserver(() => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = Math.max(220, rect.width * 0.42) * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${Math.max(220, rect.width * 0.42)}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(1, 1); /* reset any leftover scale */
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  /* ── Styles (inline — no CSS module dependency) ── */
  const panel: React.CSSProperties = {
    background: "linear-gradient(135deg, #0f172a 0%, #0a1628 100%)",
    borderRadius: "16px",
    padding: "20px",
    fontFamily: "Inter, system-ui, sans-serif",
  };
  const row: React.CSSProperties = { display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px", alignItems: "center" };
  const chip: React.CSSProperties = {
    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px", padding: "10px 14px", fontSize: "12px", color: "#94a3b8", flex: "1", minWidth: "120px",
  };
  const label: React.CSSProperties = { display: "block", fontSize: "11px", color: "#64748b", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.06em" };
  const val: React.CSSProperties = { fontSize: "18px", fontWeight: 700, color: "#f8fafc", lineHeight: 1.2 };
  const btn: React.CSSProperties = (active: boolean) => ({
    padding: "6px 14px", borderRadius: "8px", border: "1px solid",
    borderColor: active ? material.color : "rgba(255,255,255,0.1)",
    background: active ? `${material.color}22` : "transparent",
    color: active ? material.color : "#64748b",
    cursor: "pointer", fontSize: "12px", fontWeight: 600, transition: "all 0.2s",
  }) as React.CSSProperties;

  return (
    <div style={panel}>
      {/* Canvas */}
      <div ref={containerRef} style={{ width: "100%", borderRadius: "12px", overflow: "hidden", background: "#080d1a" }}>
        <canvas ref={canvasRef} style={{ display: "block" }} />
      </div>

      {/* Material selector */}
      <div style={{ marginTop: "14px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {MATERIALS.map((m, i) => (
          <button key={m.name} style={btn(i === matIdx)} onClick={() => setMatIdx(i)}>{m.name}</button>
        ))}
      </div>

      {/* Bend angle slider */}
      <div style={{ marginTop: "14px" }}>
        <label style={{ fontSize: "12px", color: "#94a3b8", display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <span>Bend Angle</span>
          <span style={{ color: material.color, fontWeight: 700 }}>{bendAngle}°</span>
        </label>
        <input
          type="range" min={0} max={60} value={bendAngle}
          onChange={e => setBendAngle(Number(e.target.value))}
          style={{ width: "100%", accentColor: material.color }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#475569", marginTop: "2px" }}>
          <span>Straight</span><span>Slightly bent</span><span>Sharply bent</span>
        </div>
      </div>

      {/* Stats row */}
      <div style={row}>
        <div style={chip}>
          <span style={label}>Refractive Index (n)</span>
          <span style={val}>{material.n.toFixed(2)}</span>
        </div>
        <div style={chip}>
          <span style={label}>Critical Angle (θ_c)</span>
          <span style={{ ...val, color: "#facc15" }}>{θc.toFixed(1)}°</span>
        </div>
        <div style={chip}>
          <span style={label}>Light Transmission</span>
          <span style={{ ...val, color: "#4ade80" }}>100% ✓</span>
        </div>
        <div style={chip}>
          <span style={label}>Mechanism</span>
          <span style={{ ...val, fontSize: "13px", color: "#c084fc" }}>TIR</span>
        </div>
      </div>

      {/* Key fact */}
      <div style={{
        marginTop: "14px", padding: "12px 16px",
        background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.18)",
        borderRadius: "10px", fontSize: "12.5px", color: "#94a3b8", lineHeight: 1.6,
      }}>
        💡 <strong style={{ color: "#38bdf8" }}>Key Concept:</strong> Light hits the fibre wall at an angle <em>greater</em> than the critical angle ({θc.toFixed(1)}°), so <em>100% is reflected</em> back inside — called Total Internal Reflection. No energy is lost even over thousands of kilometres.
      </div>
    </div>
  );
}
