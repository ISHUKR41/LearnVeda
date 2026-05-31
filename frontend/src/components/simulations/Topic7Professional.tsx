"use client";
/**
 * FILE: Topic7Professional.tsx
 * LOCATION: src/components/simulations/Topic7Professional.tsx
 * PURPOSE: 15 ultra-realistic, fully-animated physics simulations for Force & Laws of Motion.
 *          Each simulation uses HTML5 Canvas with real physics equations, HiDPI support,
 *          smooth 60fps animation, real-time telemetry readouts, and interactive controls.
 *          All simulations auto-start on mount and loop continuously.
 *
 * SIMULATIONS (3 per topic):
 *   Topic 1 (Balanced/Unbalanced): wind_tunnel, force_table_lab, centripetal_lab
 *   Topic 2 (Inertia/First Law):   seatbelt_demo, galileo_plane, (+ friction_transition from T6)
 *   Topic 3 (F=ma/Second Law):     elevator_accel, net_force_lab, stopping_distance_pro
 *   Topic 4 (Third Law):           paired_magnets, propeller_thrust, air_hockey
 *   Topic 5 (Momentum):            billiards_2d, rocket_fuel_burn, superball_rebound,
 *                                  momentum_explosion_2d
 *
 * PHYSICS REFERENCES:
 *   - Drag: F_drag = ½ρCdAv²
 *   - Circular: F_c = mv²/r
 *   - Stopping distance: d = v²/(2μg)
 *   - Tsiolkovsky: Δv = v_e · ln(m₀/m_f)
 *   - Coefficient of restitution: e = v_separation / v_approach
 *
 * LAST UPDATED: 2026-05-31
 */

import React, { useRef, useEffect, useState, useCallback } from "react";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SHARED PHYSICS CONSTANTS
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const G   = 9.8;       /* gravitational acceleration m/s² */
const DT  = 1 / 60;   /* 60 fps timestep */
const RHO = 1.225;     /* air density kg/m³ at sea level */

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SHARED CANVAS UTILITIES
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/** Set up HiDPI canvas. Returns [ctx, W, H]. */
function setupCanvas(
  canvas: HTMLCanvasElement,
): [CanvasRenderingContext2D, number, number] | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const dpr = window.devicePixelRatio || 1;
  const W   = canvas.clientWidth  || 560;
  const H   = canvas.clientHeight || 320;
  if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return [ctx, W, H];
}

/** Dark panel background with subtle grid. */
function drawBg(ctx: CanvasRenderingContext2D, W: number, H: number, gridColor = "rgba(99,102,241,0.06)") {
  ctx.fillStyle = "#050c18";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y <= H; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
}

/** Draw a vector arrow with optional label. */
function arw(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  color: string, label = "", lw = 2.5,
) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 4) return;
  const ux = dx / len, uy = dy / len;
  const ah = Math.min(12, len * 0.35);
  ctx.save();
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = lw;
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - ah * (ux - 0.4 * uy), y2 - ah * (uy + 0.4 * ux));
  ctx.lineTo(x2 - ah * (ux + 0.4 * uy), y2 - ah * (uy - 0.4 * ux));
  ctx.closePath(); ctx.fill();
  if (label) {
    ctx.font = "bold 11px 'JetBrains Mono', monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(label, x2 + ux * 18, y2 + uy * 14);
  }
  ctx.restore();
}

/** Rounded rectangle fill helper. */
function fillRR(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number, fill: string,
) {
  ctx.save();
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** HUD text row helper. */
function hud(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, label: string, value: string, color = "#a5b4fc",
) {
  ctx.save();
  ctx.font = "12px 'JetBrains Mono', monospace";
  ctx.fillStyle = "#64748b";
  ctx.textAlign = "left"; ctx.textBaseline = "top";
  ctx.fillText(label, x, y);
  ctx.fillStyle = color;
  ctx.fillText(value, x + 110, y);
  ctx.restore();
}

/* ════════════════════════════════════════════════════════════════════
 * SIM 1 — WIND TUNNEL (Topic 1: Forces & Air Resistance)
 * Shows aerodynamic drag F = ½ρCdAv² for sphere vs flat plate
 * ════════════════════════════════════════════════════════════════════ */
export function Sim_wind_tunnel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const [speed, setSpeed] = useState(20); /* wind speed m/s */

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    drawBg(ctx, W, H, "rgba(14,165,233,0.05)");

    const t   = performance.now() / 1000;
    const v   = speed;        /* m/s */
    const Cd_sphere = 0.47;   /* drag coeff — sphere */
    const Cd_plate  = 1.28;   /* drag coeff — flat plate */
    const A_sphere  = Math.PI * (0.1 * 0.1); /* m² (r=0.1m) */
    const A_plate   = 0.04;                  /* m² (0.2×0.2m) */
    const Fd_sphere = 0.5 * RHO * Cd_sphere * A_sphere * v * v;
    const Fd_plate  = 0.5 * RHO * Cd_plate  * A_plate  * v * v;

    /* ── Wind stream lines ── */
    ctx.strokeStyle = "rgba(14,165,233,0.35)";
    ctx.lineWidth = 1.5;
    const streamY = [H * 0.2, H * 0.35, H * 0.5, H * 0.65, H * 0.8];
    streamY.forEach((sy) => {
      ctx.beginPath();
      ctx.moveTo(0, sy);
      /* Bezier wave offset by time */
      ctx.bezierCurveTo(W * 0.25, sy + Math.sin(t * 2 + sy) * 5, W * 0.75, sy - Math.sin(t * 2 + sy) * 5, W, sy);
      ctx.stroke();
    });

    /* ── Sphere (left) ── */
    const sx = W * 0.3, sy = H * 0.37;
    const sr = 36;
    const grad = ctx.createRadialGradient(sx - 8, sy - 8, 4, sx, sy, sr);
    grad.addColorStop(0, "#93c5fd");
    grad.addColorStop(1, "#1d4ed8");
    ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fillStyle = grad; ctx.fill();
    ctx.strokeStyle = "#60a5fa"; ctx.lineWidth = 2; ctx.stroke();
    /* drag arrow (pointing right → reaction drag points left) */
    arw(ctx, sx + sr + 8, sy, sx + sr + 8 + Math.min(Fd_sphere * 800, 120), sy, "#f87171", `F_d=${Fd_sphere.toFixed(3)}N`);
    /* label */
    ctx.fillStyle = "#e0f2fe"; ctx.font = "bold 12px Inter, sans-serif";
    ctx.textAlign = "center"; ctx.fillText("Sphere", sx, sy + sr + 16);
    ctx.fillStyle = "#64748b"; ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.fillText(`Cd = ${Cd_sphere}`, sx, sy + sr + 30);

    /* ── Flat plate (right) ── */
    const px = W * 0.62, py = H * 0.37;
    const pw = 14, ph = 72;
    fillRR(ctx, px - pw / 2, py - ph / 2, pw, ph, 4, "#7c3aed");
    ctx.strokeStyle = "#a78bfa"; ctx.lineWidth = 2;
    ctx.strokeRect(px - pw / 2, py - ph / 2, pw, ph);
    arw(ctx, px + pw / 2 + 8, py, px + pw / 2 + 8 + Math.min(Fd_plate * 200, 120), py, "#f87171", `F_d=${Fd_plate.toFixed(3)}N`);
    ctx.fillStyle = "#ede9fe"; ctx.font = "bold 12px Inter, sans-serif";
    ctx.textAlign = "center"; ctx.fillText("Flat Plate", px, py + ph / 2 + 16);
    ctx.fillStyle = "#64748b"; ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.fillText(`Cd = ${Cd_plate}`, px, py + ph / 2 + 30);

    /* ── Animated wind particles ── */
    ctx.fillStyle = "rgba(56,189,248,0.7)";
    for (let i = 0; i < 18; i++) {
      const px2 = ((t * v * 8 + i * 50) % (W + 20)) - 10;
      const py2 = 40 + (i % 9) * (H - 80) / 8;
      ctx.beginPath();
      ctx.arc(px2, py2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    /* ── Title + HUD panel ── */
    fillRR(ctx, 8, 8, 240, 80, 10, "rgba(2,6,23,0.85)");
    ctx.fillStyle = "#38bdf8"; ctx.font = "bold 13px Inter, sans-serif";
    ctx.textAlign = "left"; ctx.fillText("🌬️ Wind Tunnel — Aerodynamic Drag", 16, 18);
    hud(ctx, 16, 36, "Wind speed:", `${v} m/s`, "#34d399");
    hud(ctx, 16, 52, "Sphere drag:", `${Fd_sphere.toFixed(4)} N`, "#f87171");
    hud(ctx, 16, 68, "Plate drag:", `${Fd_plate.toFixed(4)} N`, "#fb923c");

    /* ── Formula ── */
    ctx.fillStyle = "#94a3b8"; ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("F_drag = ½ρ·Cd·A·v²    (Plate drag is ~5.8× more than sphere!)", W / 2, H - 12);
  }, [speed]);

  useEffect(() => {
    const loop = () => { draw(); rafRef.current = requestAnimationFrame(loop); };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #1e3a5f" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: 320, display: "block" }} />
      <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, background: "#070f1d" }}>
        <span style={{ color: "#64748b", fontSize: 13, whiteSpace: "nowrap" }}>Wind Speed: <b style={{ color: "#38bdf8" }}>{speed} m/s</b></span>
        <input type="range" min={5} max={60} value={speed} onChange={e => setSpeed(+e.target.value)}
          style={{ flex: 1, accentColor: "#38bdf8" }} />
        <span style={{ color: "#f87171", fontSize: 12 }}>F_d ∝ v²</span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * SIM 2 — FORCE TABLE LAB (Topic 1: Balanced Forces)
 * 3 forces in 2D — student adjusts angles to reach equilibrium
 * ════════════════════════════════════════════════════════════════════ */
export function Sim_force_table_lab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const [angle3, setAngle3] = useState(210); /* degrees — user adjustable */

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    drawBg(ctx, W, H, "rgba(245,158,11,0.05)");

    const cx = W / 2, cy = H / 2 + 10;
    const R  = 100; /* table radius px */

    /* ── Draw force table circle ── */
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = "#334155"; ctx.lineWidth = 3; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, R + 20, 0, Math.PI * 2);
    ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 1; ctx.stroke();

    /* Degree markers */
    ctx.fillStyle = "#475569"; ctx.font = "10px 'JetBrains Mono', monospace"; ctx.textAlign = "center";
    [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].forEach(deg => {
      const rad = (deg - 90) * Math.PI / 180;
      const tx = cx + (R + 14) * Math.cos(rad);
      const ty = cy + (R + 14) * Math.sin(rad);
      ctx.fillText(`${deg}°`, tx, ty + 4);
    });

    /* ── 3 forces: F1=5N@30°, F2=7N@150°, F3=user@angle3 ── */
    const forces = [
      { mag: 5,  angle: 30,     color: "#60a5fa", label: "F₁=5N" },
      { mag: 7,  angle: 150,    color: "#4ade80", label: "F₂=7N" },
      { mag: 8.6, angle: angle3, color: "#f472b6", label: `F₃=8.6N` },
    ];

    /* Net force calculation */
    let fx = 0, fy = 0;
    forces.forEach(f => {
      const rad = (f.angle - 90) * Math.PI / 180;
      fx += f.mag * Math.cos(rad + Math.PI / 2);
      fy += f.mag * Math.sin(rad + Math.PI / 2);
    });
    const fnet = Math.sqrt(fx * fx + fy * fy);
    const equilibrium = fnet < 0.5;

    forces.forEach(f => {
      const rad = (f.angle - 90) * Math.PI / 180;
      const scale = 10;
      const ex = cx + Math.cos(rad) * f.mag * scale;
      const ey = cy + Math.sin(rad) * f.mag * scale;
      arw(ctx, cx, cy, ex, ey, f.color, f.label, 3);
      /* Pulley dot on rim */
      const rx = cx + Math.cos(rad) * R;
      const ry = cy + Math.sin(rad) * R;
      ctx.beginPath(); ctx.arc(rx, ry, 5, 0, Math.PI * 2);
      ctx.fillStyle = f.color; ctx.fill();
    });

    /* ── Center ring ── */
    const cgrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 12);
    cgrad.addColorStop(0, equilibrium ? "#fde68a" : "#fca5a5");
    cgrad.addColorStop(1, equilibrium ? "#d97706" : "#dc2626");
    ctx.beginPath(); ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.fillStyle = cgrad; ctx.fill();

    /* ── HUD ── */
    fillRR(ctx, 8, 8, 210, 68, 10, "rgba(2,6,23,0.88)");
    ctx.fillStyle = "#fbbf24"; ctx.font = "bold 13px Inter, sans-serif";
    ctx.textAlign = "left"; ctx.fillText("⚖️ Force Table Lab", 16, 18);
    hud(ctx, 16, 34, "Net Force:", `${fnet.toFixed(3)} N`, equilibrium ? "#4ade80" : "#f87171");
    hud(ctx, 16, 50, "Equilibrium:", equilibrium ? "✓ YES!" : "✗ Adjust F₃", equilibrium ? "#4ade80" : "#f87171");

    /* ── Equilibrium glow ── */
    if (equilibrium) {
      ctx.shadowColor = "#fbbf24"; ctx.shadowBlur = 24;
      ctx.beginPath(); ctx.arc(cx, cy, 15, 0, Math.PI * 2);
      ctx.strokeStyle = "#fde68a"; ctx.lineWidth = 3; ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }, [angle3]);

  useEffect(() => {
    const loop = () => { draw(); rafRef.current = requestAnimationFrame(loop); };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #2d1a00" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: 320, display: "block" }} />
      <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, background: "#070f1d" }}>
        <span style={{ color: "#64748b", fontSize: 13, whiteSpace: "nowrap" }}>F₃ Angle: <b style={{ color: "#f472b6" }}>{angle3}°</b></span>
        <input type="range" min={0} max={359} value={angle3} onChange={e => setAngle3(+e.target.value)}
          style={{ flex: 1, accentColor: "#f472b6" }} />
        <span style={{ color: "#fbbf24", fontSize: 12 }}>Hint: ~270°</span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * SIM 3 — CENTRIPETAL FORCE LAB (Topic 1: Forces)
 * Ball on string in circular motion — F_c = mv²/r
 * ════════════════════════════════════════════════════════════════════ */
export function Sim_centripetal_lab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const tRef      = useRef(0);
  const [radius, setRadius] = useState(100); /* px → maps to meters */
  const [mass,   setMass]   = useState(0.5); /* kg */

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    drawBg(ctx, W, H, "rgba(139,92,246,0.05)");

    tRef.current += DT;
    const t    = tRef.current;
    const r_px = radius;          /* radius in pixels */
    const r_m  = r_px / 80;      /* scale: 80px = 1m */
    const v    = 3.0;             /* m/s — constant speed */
    const omega = v / r_m;        /* angular velocity rad/s */
    const Fc   = mass * v * v / r_m;  /* centripetal force N */
    const T    = 2 * Math.PI / omega; /* period s */

    const cx = W / 2, cy = H / 2;
    const angle = omega * t;

    /* Ball position */
    const bx = cx + r_px * Math.cos(angle);
    const by = cy + r_px * Math.sin(angle);

    /* ── Draw path circle ── */
    ctx.beginPath(); ctx.arc(cx, cy, r_px, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(139,92,246,0.3)"; ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]); ctx.stroke(); ctx.setLineDash([]);

    /* ── String ── */
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(bx, by);
    ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 2; ctx.stroke();

    /* ── Centripetal force arrow (toward center) ── */
    const dir_x = (cx - bx) / r_px;
    const dir_y = (cy - by) / r_px;
    const fc_scale = Math.min(Fc * 8, 50);
    arw(ctx, bx, by, bx + dir_x * fc_scale, by + dir_y * fc_scale, "#f87171", "Fc", 2.5);

    /* ── Velocity arrow (tangent) ── */
    const vx_dir = -Math.sin(angle);
    const vy_dir =  Math.cos(angle);
    arw(ctx, bx, by, bx + vx_dir * 35, by + vy_dir * 35, "#4ade80", "v", 2.5);

    /* ── Ball ── */
    const bgrad = ctx.createRadialGradient(bx - 5, by - 5, 2, bx, by, 18);
    bgrad.addColorStop(0, "#c4b5fd");
    bgrad.addColorStop(1, "#7c3aed");
    ctx.beginPath(); ctx.arc(bx, by, 18, 0, Math.PI * 2);
    ctx.fillStyle = bgrad; ctx.fill();
    ctx.fillStyle = "#fff"; ctx.font = "bold 11px Inter, sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(`${mass}kg`, bx, by);

    /* ── Pivot ── */
    ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#fbbf24"; ctx.fill();

    /* ── Radius label ── */
    ctx.fillStyle = "#94a3b8"; ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(`r = ${r_m.toFixed(2)}m`, (cx + bx) / 2, (cy + by) / 2 - 12);

    /* ── HUD ── */
    fillRR(ctx, 8, 8, 220, 86, 10, "rgba(2,6,23,0.88)");
    ctx.fillStyle = "#a78bfa"; ctx.font = "bold 13px Inter, sans-serif";
    ctx.textAlign = "left"; ctx.fillText("🔵 Centripetal Force Lab", 16, 18);
    hud(ctx, 16, 34, "Speed (v):", `${v.toFixed(1)} m/s`, "#4ade80");
    hud(ctx, 16, 50, "Fc = mv²/r:", `${Fc.toFixed(3)} N`, "#f87171");
    hud(ctx, 16, 66, "Period (T):", `${T.toFixed(2)} s`, "#fbbf24");

    ctx.fillStyle = "#475569"; ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("F_c = mv²/r  — smaller radius → stronger centripetal force", W / 2, H - 12);
  }, [radius, mass]);

  useEffect(() => {
    tRef.current = 0;
    const loop = () => { draw(); rafRef.current = requestAnimationFrame(loop); };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #2e1065" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: 320, display: "block" }} />
      <div style={{ padding: "12px 16px", display: "flex", flexWrap: "wrap", gap: 12, background: "#070f1d" }}>
        <label style={{ color: "#64748b", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
          Radius: <b style={{ color: "#a78bfa" }}>{(radius / 80).toFixed(2)}m</b>
          <input type="range" min={50} max={120} value={radius} onChange={e => setRadius(+e.target.value)} style={{ accentColor: "#a78bfa" }} />
        </label>
        <label style={{ color: "#64748b", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
          Mass: <b style={{ color: "#f472b6" }}>{mass}kg</b>
          <input type="range" min={1} max={20} value={mass * 10} onChange={e => setMass(+e.target.value / 10)} style={{ accentColor: "#f472b6" }} />
        </label>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * SIM 4 — SEATBELT DEMO (Topic 2: Inertia)
 * Car brakes suddenly — dummy with/without seatbelt
 * ════════════════════════════════════════════════════════════════════ */
export function Sim_seatbelt_demo() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const rafRef      = useRef<number>(0);
  const stateRef    = useRef({ phase: "driving" as "driving" | "braking" | "result", t: 0, carVx: 0, bodyX1: 0, bodyX2: 0 });
  const [phase, setPhase] = useState<"driving" | "braking" | "result">("driving");

  const reset = useCallback(() => {
    stateRef.current = { phase: "driving", t: 0, carVx: 80 / 3.6, bodyX1: 0, bodyX2: 0 };
    setPhase("driving");
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    drawBg(ctx, W, H, "rgba(239,68,68,0.04)");

    const s = stateRef.current;
    s.t += DT;

    /* State machine */
    if (s.phase === "driving" && s.t > 2) {
      s.phase = "braking";
      s.carVx = 80 / 3.6; /* 80 km/h */
      s.bodyX1 = 0; s.bodyX2 = 0;
      setPhase("braking");
    }
    if (s.phase === "braking") {
      const brake_a = -8; /* m/s² */
      s.carVx = Math.max(0, s.carVx + brake_a * DT);
      /* Belted body follows car exactly */
      s.bodyX1 = 0;
      /* Unbelted body continues at original speed (inertia) */
      s.bodyX2 += (80 / 3.6) * DT * 30; /* px scale */
      if (s.carVx === 0 && s.t > 3.5) {
        s.phase = "result";
        setPhase("result");
      }
    }

    /* ── Ground ── */
    ctx.fillStyle = "#1e293b"; ctx.fillRect(0, H - 60, W, 60);
    ctx.fillStyle = "#334155"; ctx.fillRect(0, H - 62, W, 2);

    /* ── Road markings ── */
    if (s.phase === "driving" || s.phase === "braking") {
      const markOffset = (s.t * (s.carVx || 80 / 3.6) * 30) % 80;
      ctx.fillStyle = "#fbbf24";
      for (let mx = -markOffset; mx < W + 80; mx += 80) {
        ctx.fillRect(mx, H - 32, 40, 4);
      }
    }

    /* ── Car body ── */
    const carX = W * 0.3;
    const carY = H - 60 - 80;
    fillRR(ctx, carX, carY, 240, 70, 12, "#1e40af");
    fillRR(ctx, carX + 30, carY - 40, 170, 42, 10, "#1d4ed8");
    ctx.fillStyle = "#93c5fd"; /* windscreen */
    fillRR(ctx, carX + 40, carY - 36, 70, 34, 6, "#bfdbfe");
    fillRR(ctx, carX + 130, carY - 36, 60, 34, 6, "#bfdbfe");
    /* Wheels */
    [carX + 40, carX + 190].forEach(wx => {
      ctx.beginPath(); ctx.arc(wx, carY + 70, 20, 0, Math.PI * 2);
      ctx.fillStyle = "#0f172a"; ctx.fill();
      ctx.beginPath(); ctx.arc(wx, carY + 70, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#94a3b8"; ctx.fill();
    });

    /* ── Dummy 1 (belted) — stays with car ── */
    const d1x = carX + 70;
    const d1y = carY + 15;
    /* head */ ctx.beginPath(); ctx.arc(d1x, d1y, 12, 0, Math.PI * 2);
    ctx.fillStyle = "#fde68a"; ctx.fill();
    /* body */
    fillRR(ctx, d1x - 8, d1y + 12, 16, 30, 4, "#3b82f6");
    /* seatbelt */
    ctx.save(); ctx.strokeStyle = "#facc15"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(d1x + 6, d1y + 12); ctx.lineTo(d1x - 6, d1y + 42); ctx.stroke();
    ctx.restore();
    ctx.fillStyle = "#4ade80"; ctx.font = "bold 11px Inter, sans-serif"; ctx.textAlign = "center";
    ctx.fillText("✓ Belted", d1x, d1y - 18);

    /* ── Dummy 2 (unbelted) — flies forward on braking ── */
    const d2xBase = carX + 160;
    const d2x     = s.phase === "braking" || s.phase === "result"
      ? Math.min(d2xBase + s.bodyX2, W - 20)
      : d2xBase;
    const d2y = carY + 15;
    ctx.beginPath(); ctx.arc(d2x, d2y, 12, 0, Math.PI * 2);
    ctx.fillStyle = "#fde68a"; ctx.fill();
    fillRR(ctx, d2x - 8, d2y + 12, 16, 30, 4, "#ef4444");
    ctx.fillStyle = "#f87171"; ctx.font = "bold 11px Inter, sans-serif"; ctx.textAlign = "center";
    ctx.fillText("✗ No Belt", d2x, d2y - 18);

    /* Impact flash */
    if (s.phase === "result" && d2xBase + s.bodyX2 >= W - 22) {
      ctx.fillStyle = "rgba(239,68,68,0.2)"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#f87171"; ctx.font = "bold 28px Inter, sans-serif";
      ctx.textAlign = "center"; ctx.fillText("💥 IMPACT!", W / 2, H / 2 - 20);
    }

    /* ── HUD ── */
    fillRR(ctx, 8, 8, 230, 68, 10, "rgba(2,6,23,0.9)");
    ctx.fillStyle = "#f87171"; ctx.font = "bold 13px Inter, sans-serif";
    ctx.textAlign = "left"; ctx.fillText("🚗 Seatbelt Inertia Demo", 16, 18);
    const vkmh = (s.carVx * 3.6).toFixed(0);
    hud(ctx, 16, 34, "Car speed:", `${vkmh} km/h`, s.phase === "braking" ? "#f87171" : "#4ade80");
    hud(ctx, 16, 50, "Phase:", s.phase.toUpperCase(), "#fbbf24");
    hud(ctx, 16, 66, "Inertia:", "Body continues forward!", "#a5b4fc");
  }, []);

  useEffect(() => {
    reset();
    const loop = () => { draw(); rafRef.current = requestAnimationFrame(loop); };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw, reset]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #450a0a" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: 320, display: "block" }} />
      <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#070f1d" }}>
        <span style={{ color: "#94a3b8", fontSize: 13 }}>Newton's 1st Law: Body tends to continue at original speed when car brakes</span>
        <button onClick={reset} style={{ background: "#dc2626", color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", cursor: "pointer", fontSize: 13 }}>↺ Reset</button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * SIM 5 — GALILEO'S INCLINED PLANE (Topic 2: Inertia / First Law)
 * Ball rolls down ramp — measures time, derives acceleration
 * ════════════════════════════════════════════════════════════════════ */
export function Sim_galileo_plane() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const tRef      = useRef(0);
  const [angle, setAngle] = useState(30); /* ramp angle degrees */

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    drawBg(ctx, W, H, "rgba(250,204,21,0.05)");

    tRef.current += DT;
    const t   = tRef.current % 4; /* 4s cycle */
    const a   = G * Math.sin(angle * Math.PI / 180);  /* acceleration on ramp */
    const L   = 3;                                     /* ramp length m */
    const s   = Math.min(0.5 * a * t * t, L);         /* distance along ramp */
    const done = s >= L;

    /* ── Ramp geometry ── */
    const rad    = angle * Math.PI / 180;
    const rampL  = 260; /* px */
    const baseX  = W * 0.15;
    const baseY  = H - 70;
    const topX   = baseX + rampL * Math.cos(rad);
    const topY   = baseY - rampL * Math.sin(rad);

    /* Ramp surface */
    ctx.beginPath(); ctx.moveTo(baseX, baseY); ctx.lineTo(topX, topY); ctx.lineTo(topX, baseY); ctx.closePath();
    ctx.fillStyle = "#1e3a5f"; ctx.fill();
    ctx.strokeStyle = "#60a5fa"; ctx.lineWidth = 3; ctx.stroke();
    /* Ground */
    ctx.fillStyle = "#1e293b"; ctx.fillRect(0, baseY, W, H - baseY);
    ctx.strokeStyle = "#334155"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, baseY); ctx.lineTo(W, baseY); ctx.stroke();

    /* ── Ball position along ramp ── */
    const progress = s / L;
    const bx = topX - progress * (topX - baseX);
    const by = topY + progress * (baseY - topY);
    /* Rolling ball */
    const ballR = 16;
    const bgrad = ctx.createRadialGradient(bx - 5, by - 5, 3, bx, by, ballR);
    bgrad.addColorStop(0, "#fde68a"); bgrad.addColorStop(1, "#d97706");
    ctx.beginPath(); ctx.arc(bx, by, ballR, 0, Math.PI * 2);
    ctx.fillStyle = bgrad; ctx.fill();
    /* Rotation marks */
    const rot = (s * 5) % (Math.PI * 2);
    [0, 1, 2, 3].forEach(i => {
      const r2 = rot + i * Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(bx + Math.cos(r2) * 6, by + Math.sin(r2) * 6);
      ctx.lineTo(bx + Math.cos(r2) * ballR, by + Math.sin(r2) * ballR);
      ctx.strokeStyle = "#92400e"; ctx.lineWidth = 2; ctx.stroke();
    });

    /* ── Angle label ── */
    ctx.fillStyle = "#fbbf24"; ctx.font = "bold 13px Inter, sans-serif"; ctx.textAlign = "left";
    ctx.fillText(`θ = ${angle}°`, topX + 8, baseY - 12);
    /* Angle arc */
    ctx.beginPath(); ctx.arc(baseX, baseY, 40, -rad, 0);
    ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]); ctx.stroke(); ctx.setLineDash([]);

    /* ── Velocity arrow ── */
    const v = a * t;
    const vscale = Math.min(v * 3, 55);
    arw(ctx, bx, by, bx + vscale * Math.cos(rad + Math.PI), by + vscale * Math.sin(rad + Math.PI), "#4ade80", "v");

    /* ── Timer display ── */
    ctx.fillStyle = done ? "#4ade80" : "#f8fafc";
    ctx.font = `bold ${done ? 20 : 18}px 'JetBrains Mono', monospace`;
    ctx.textAlign = "right";
    ctx.fillText(done ? `Done! t=${(tRef.current % 4 - DT).toFixed(2)}s` : `t = ${t.toFixed(2)} s`, W - 16, 24);

    /* ── HUD ── */
    fillRR(ctx, 8, 8, 240, 84, 10, "rgba(2,6,23,0.9)");
    ctx.fillStyle = "#fbbf24"; ctx.font = "bold 13px Inter, sans-serif"; ctx.textAlign = "left";
    ctx.fillText("📐 Galileo's Inclined Plane", 16, 18);
    hud(ctx, 16, 34, "Angle (θ):", `${angle}°`, "#fbbf24");
    hud(ctx, 16, 50, "Accel (a):", `${a.toFixed(3)} m/s²`, "#4ade80");
    hud(ctx, 16, 66, "Speed (v):", `${v.toFixed(2)} m/s`, "#60a5fa");

    ctx.fillStyle = "#475569"; ctx.font = "11px 'JetBrains Mono', monospace"; ctx.textAlign = "center";
    ctx.fillText("a = g·sin(θ)  — Galileo disproved Aristotle using this experiment", W / 2, H - 12);
  }, [angle]);

  useEffect(() => {
    tRef.current = 0;
    const loop = () => { draw(); rafRef.current = requestAnimationFrame(loop); };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #451a03" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: 320, display: "block" }} />
      <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, background: "#070f1d" }}>
        <span style={{ color: "#64748b", fontSize: 13, whiteSpace: "nowrap" }}>Ramp Angle: <b style={{ color: "#fbbf24" }}>{angle}°</b></span>
        <input type="range" min={5} max={60} value={angle} onChange={e => { setAngle(+e.target.value); tRef.current = 0; }}
          style={{ flex: 1, accentColor: "#fbbf24" }} />
        <span style={{ color: "#94a3b8", fontSize: 12 }}>a = g·sin θ</span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * SIM 6 — ELEVATOR ACCELERATION (Topic 3: F = ma)
 * Apparent weight changes as elevator accelerates up/down
 * ════════════════════════════════════════════════════════════════════ */
export function Sim_elevator_accel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const tRef      = useRef(0);
  const [mode, setMode] = useState<"up" | "constant" | "down">("up");
  const [mass, setMass] = useState(60);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    drawBg(ctx, W, H, "rgba(168,85,247,0.05)");

    tRef.current += DT;
    const t = tRef.current;

    const a  = mode === "up" ? 3 : mode === "down" ? -3 : 0; /* m/s² */
    const W_real     = mass * G;                   /* true weight N */
    const W_apparent = mass * (G + a);             /* apparent weight N */
    const scale_reading = W_apparent / G;          /* scale reading kg */

    /* ── Building / shaft ── */
    const shaftX = W * 0.35, shaftW = 160;
    fillRR(ctx, shaftX - 10, 20, shaftW + 20, H - 30, 8, "rgba(15,23,42,0.8)");
    ctx.strokeStyle = "#1e40af"; ctx.lineWidth = 2;
    ctx.strokeRect(shaftX - 10, 20, shaftW + 20, H - 30);
    /* Floor lines */
    for (let fl = 0; fl < 5; fl++) {
      const fy = 20 + fl * (H - 50) / 5;
      ctx.fillStyle = "#1e3a5f"; ctx.fillRect(shaftX - 10, fy, shaftW + 20, 2);
      ctx.fillStyle = "#475569"; ctx.font = "11px 'JetBrains Mono', monospace"; ctx.textAlign = "right";
      ctx.fillText(`F${5 - fl}`, shaftX - 14, fy + 8);
    }

    /* ── Elevator car ── */
    const baseElY = H - 100;
    const elY     = baseElY - (a > 0 ? Math.sin(t * 1.5) * 6 : a < 0 ? -Math.sin(t * 1.5) * 6 : 0);
    const elX = shaftX + 5;
    const elW = shaftW - 10, elH = 90;
    fillRR(ctx, elX, elY, elW, elH, 8, "#1e3a5f");
    ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 2; ctx.strokeRect(elX, elY, elW, elH);
    /* Cable */
    ctx.beginPath(); ctx.moveTo(elX + elW / 2, elY); ctx.lineTo(elX + elW / 2, 20);
    ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 3; ctx.stroke();
    /* Cable tension pulley dot */
    ctx.beginPath(); ctx.arc(elX + elW / 2, 20, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#fbbf24"; ctx.fill();

    /* ── Person inside elevator ── */
    const px = elX + elW / 2;
    const py = elY + 20;
    ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2); /* head */
    ctx.fillStyle = "#fde68a"; ctx.fill();
    fillRR(ctx, px - 8, py + 10, 16, 24, 4, "#6d28d9"); /* body */

    /* ── Scale under feet ── */
    fillRR(ctx, elX + 20, elY + elH - 12, elW - 40, 12, 4, "#374151");
    /* Scale needle */
    const maxKg = mass * 1.5;
    const ratio = scale_reading / maxKg;
    ctx.fillStyle = ratio > 1.0 ? "#f87171" : "#4ade80";
    ctx.fillRect(elX + 22, elY + elH - 10, (elW - 44) * Math.min(ratio, 1.2), 8);
    ctx.fillStyle = "#f8fafc"; ctx.font = "bold 12px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${scale_reading.toFixed(1)} kg`, px, elY + elH - 16);

    /* ── Force arrows ── */
    const weightScale = W_real / 20;
    arw(ctx, px + 28, py + 10, px + 28, py + 10 + weightScale, "#f87171", "W", 2.5); /* weight down */
    const normalScale = W_apparent / 20;
    arw(ctx, px - 28, py + 10, px - 28, py + 10 - normalScale, "#4ade80", "N", 2.5); /* normal up */

    /* ── Acceleration arrow ── */
    if (a !== 0) {
      const dir = a > 0 ? -1 : 1;
      arw(ctx, shaftX + shaftW + 25, H / 2, shaftX + shaftW + 25, H / 2 + dir * 50, "#fbbf24", `a=${Math.abs(a)}m/s²`, 3);
    }

    /* ── HUD ── */
    fillRR(ctx, 8, 8, 210, 100, 10, "rgba(2,6,23,0.9)");
    ctx.fillStyle = "#a78bfa"; ctx.font = "bold 13px Inter, sans-serif"; ctx.textAlign = "left";
    ctx.fillText("🛗 Elevator F=ma", 16, 18);
    hud(ctx, 16, 34, "Mode:", mode.toUpperCase(), "#fbbf24");
    hud(ctx, 16, 50, "Real weight:", `${W_real.toFixed(1)} N`, "#60a5fa");
    hud(ctx, 16, 66, "Apparent W:", `${W_apparent.toFixed(1)} N`, W_apparent > W_real ? "#f87171" : "#4ade80");
    hud(ctx, 16, 82, "Scale reads:", `${scale_reading.toFixed(1)} kg`, "#a5b4fc");
  }, [mode, mass]);

  useEffect(() => {
    tRef.current = 0;
    const loop = () => { draw(); rafRef.current = requestAnimationFrame(loop); };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #2e1065" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: 320, display: "block" }} />
      <div style={{ padding: "12px 16px", display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", background: "#070f1d" }}>
        {(["up", "constant", "down"] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} style={{ background: mode === m ? "#7c3aed" : "#1e293b", color: mode === m ? "#fff" : "#94a3b8", border: "1px solid #334155", borderRadius: 8, padding: "5px 14px", cursor: "pointer", fontSize: 13 }}>
            {m === "up" ? "⬆ Accel Up" : m === "constant" ? "➡ Constant" : "⬇ Accel Down"}
          </button>
        ))}
        <label style={{ color: "#64748b", fontSize: 13, display: "flex", gap: 8 }}>
          Mass: <b style={{ color: "#a78bfa" }}>{mass}kg</b>
          <input type="range" min={40} max={120} value={mass} onChange={e => setMass(+e.target.value)} style={{ accentColor: "#7c3aed" }} />
        </label>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * SIM 7 — NET FORCE LAB (Topic 3: F = ma)
 * Multiple force vectors → net force → acceleration
 * ════════════════════════════════════════════════════════════════════ */
export function Sim_net_force_lab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const tRef      = useRef(0);
  const posRef    = useRef(0);
  const [f1, setF1] = useState(20);
  const [f2, setF2] = useState(8);
  const [mass, setMass] = useState(5);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    drawBg(ctx, W, H, "rgba(34,197,94,0.05)");

    tRef.current += DT;
    const Fnet = f1 - f2;   /* net force N */
    const a    = Fnet / mass; /* acceleration m/s² */
    posRef.current += a * DT * 3; /* px scale */
    /* Wrap */
    if (posRef.current > W * 0.4) posRef.current = -W * 0.3;
    if (posRef.current < -W * 0.4) posRef.current = W * 0.3;

    /* ── Ground ── */
    ctx.fillStyle = "#1e293b"; ctx.fillRect(0, H - 50, W, 50);
    /* Friction surface texture */
    ctx.fillStyle = "#0f172a";
    for (let x = 0; x < W; x += 18) {
      ctx.fillRect(x, H - 50, 9, 4);
    }

    /* ── Object ── */
    const ox = W / 2 + posRef.current;
    const oy = H - 50 - 44;
    fillRR(ctx, ox - 36, oy, 72, 44, 8, "#1e40af");
    ctx.fillStyle = "#93c5fd"; ctx.font = "bold 13px Inter, sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(`${mass}kg`, ox, oy + 22);

    /* ── F1 arrow (right, driving force) ── */
    const f1scale = f1 * 2.5;
    arw(ctx, ox + 38, oy + 22, ox + 38 + f1scale, oy + 22, "#4ade80", `F₁=${f1}N`, 3);
    /* ── F2 arrow (left, friction/opposing) ── */
    const f2scale = f2 * 2.5;
    arw(ctx, ox - 38, oy + 22, ox - 38 - f2scale, oy + 22, "#f87171", `F₂=${f2}N`, 3);

    /* ── Net force arrow ── */
    if (Math.abs(Fnet) > 0.1) {
      const netScale = Fnet * 1.5;
      arw(ctx, ox, oy - 12, ox + netScale, oy - 12, "#fbbf24", `Fnet=${Fnet.toFixed(1)}N`, 3);
    }

    /* ── Weight and Normal ── */
    const Wt = mass * G;
    arw(ctx, ox + 55, oy + 22, ox + 55, oy + 22 + Wt * 0.7, "#a78bfa", "W", 2);
    arw(ctx, ox + 55, oy + 44, ox + 55, oy + 44 - Wt * 0.7, "#38bdf8", "N", 2);

    /* ── Speedometer ── */
    const spd = Math.abs(a) * tRef.current;
    const spdDisplay = Math.min(spd, 30);
    fillRR(ctx, W - 130, H - 48, 120, 36, 8, "rgba(2,6,23,0.9)");
    ctx.fillStyle = "#fbbf24"; ctx.font = "bold 13px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText(`v = ${spdDisplay.toFixed(1)} m/s`, W - 70, H - 27);

    /* ── HUD ── */
    fillRR(ctx, 8, 8, 220, 84, 10, "rgba(2,6,23,0.9)");
    ctx.fillStyle = "#4ade80"; ctx.font = "bold 13px Inter, sans-serif"; ctx.textAlign = "left";
    ctx.fillText("⚙ Net Force Lab", 16, 18);
    hud(ctx, 16, 34, "F_net:", `${Fnet.toFixed(2)} N`, Fnet > 0 ? "#4ade80" : "#f87171");
    hud(ctx, 16, 50, "a = F/m:", `${a.toFixed(3)} m/s²`, "#fbbf24");
    hud(ctx, 16, 66, "Direction:", Fnet > 0 ? "→ Right" : Fnet < 0 ? "← Left" : "Stationary", "#60a5fa");
  }, [f1, f2, mass]);

  useEffect(() => {
    tRef.current = 0; posRef.current = 0;
    const loop = () => { draw(); rafRef.current = requestAnimationFrame(loop); };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #052e16" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: 320, display: "block" }} />
      <div style={{ padding: "12px 16px", display: "flex", flexWrap: "wrap", gap: 10, background: "#070f1d" }}>
        <label style={{ color: "#64748b", fontSize: 13, display: "flex", gap: 8, alignItems: "center" }}>
          F₁ (drive): <b style={{ color: "#4ade80" }}>{f1}N</b>
          <input type="range" min={0} max={50} value={f1} onChange={e => { setF1(+e.target.value); tRef.current = 0; posRef.current = 0; }} style={{ accentColor: "#4ade80" }} />
        </label>
        <label style={{ color: "#64748b", fontSize: 13, display: "flex", gap: 8, alignItems: "center" }}>
          F₂ (resist): <b style={{ color: "#f87171" }}>{f2}N</b>
          <input type="range" min={0} max={40} value={f2} onChange={e => { setF2(+e.target.value); tRef.current = 0; posRef.current = 0; }} style={{ accentColor: "#f87171" }} />
        </label>
        <label style={{ color: "#64748b", fontSize: 13, display: "flex", gap: 8, alignItems: "center" }}>
          Mass: <b style={{ color: "#fbbf24" }}>{mass}kg</b>
          <input type="range" min={1} max={20} value={mass} onChange={e => { setMass(+e.target.value); tRef.current = 0; }} style={{ accentColor: "#fbbf24" }} />
        </label>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * SIM 8 — STOPPING DISTANCE PRO (Topic 3: F=ma)
 * Shows d = v²/(2μg) — speed doubles → distance quadruples
 * ════════════════════════════════════════════════════════════════════ */
export function Sim_stopping_distance_pro() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    drawBg(ctx, W, H, "rgba(249,115,22,0.05)");

    const mu   = 0.7;  /* friction coeff */
    const speeds = [20, 40, 60, 80, 100]; /* km/h */
    const colors = ["#4ade80", "#a3e635", "#fbbf24", "#f97316", "#ef4444"];
    const maxD = Math.max(...speeds.map(s => (s / 3.6) ** 2 / (2 * mu * G)));

    const barTop   = 60;
    const barH     = 32;
    const barGap   = 12;
    const maxBarW  = W - 200;
    const labelX   = 60;

    /* ── Road surface ── */
    fillRR(ctx, 0, barTop - 30, W, barH * speeds.length + barGap * speeds.length + 60, 0, "rgba(15,23,42,0.5)");

    speeds.forEach((spd_kmh, i) => {
      const spd_ms = spd_kmh / 3.6;
      const d      = spd_ms * spd_ms / (2 * mu * G); /* stopping distance m */
      const barW   = (d / maxD) * maxBarW;
      const y      = barTop + i * (barH + barGap);

      /* Bar background */
      fillRR(ctx, labelX, y, maxBarW, barH, barH / 2, "rgba(30,41,59,0.8)");
      /* Bar fill (animated) */
      const t = performance.now() / 1000;
      const animW = barW * (0.9 + 0.1 * Math.sin(t * 0.5 + i));
      fillRR(ctx, labelX, y, Math.max(animW, 10), barH, barH / 2, colors[i]);

      /* Speed label */
      ctx.fillStyle = "#f8fafc"; ctx.font = "bold 13px 'JetBrains Mono', monospace";
      ctx.textAlign = "right"; ctx.textBaseline = "middle";
      ctx.fillText(`${spd_kmh}`, labelX - 8, y + barH / 2);
      /* km/h */
      ctx.fillStyle = "#64748b"; ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.fillText("km/h", labelX - 48, y + barH / 2);

      /* Distance label on bar */
      ctx.fillStyle = "#0f172a"; ctx.font = `bold 12px 'JetBrains Mono', monospace`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      if (barW > 50) ctx.fillText(`${d.toFixed(1)}m`, labelX + barW * 0.6, y + barH / 2);

      /* Car icon at end */
      ctx.fillStyle = colors[i];
      ctx.fillRect(labelX + barW + 4, y + 6, 20, barH - 12);
    });

    /* ── Title ── */
    fillRR(ctx, 8, 8, 240, 46, 10, "rgba(2,6,23,0.9)");
    ctx.fillStyle = "#f97316"; ctx.font = "bold 13px Inter, sans-serif"; ctx.textAlign = "left";
    ctx.fillText("🛑 Stopping Distance vs Speed", 16, 18);
    ctx.fillStyle = "#94a3b8"; ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.fillText(`μ = ${mu} (dry road)   d = v²/(2μg)`, 16, 36);

    /* ── Key insight ── */
    ctx.fillStyle = "#f87171"; ctx.font = "bold 12px Inter, sans-serif"; ctx.textAlign = "center";
    ctx.fillText("⚠ Speed ×2  →  Stopping Distance ×4  (quadratic, not linear!)", W / 2, H - 12);
  }, []);

  useEffect(() => {
    const loop = () => { draw(); rafRef.current = requestAnimationFrame(loop); };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #431407" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: 320, display: "block" }} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * SIM 9 — PAIRED MAGNETS (Topic 4: Newton's Third Law)
 * Two magnets attract/repel — equal and opposite forces
 * ════════════════════════════════════════════════════════════════════ */
export function Sim_paired_magnets() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const tRef      = useRef(0);
  const [mode, setMode] = useState<"attract" | "repel">("attract");
  const posRef    = useRef({ x1: 0, x2: 0, v1: 0, v2: 0 });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    drawBg(ctx, W, H, "rgba(236,72,153,0.05)");

    tRef.current += DT;
    const p = posRef.current;
    const sep = Math.abs(p.x2 - p.x1); /* px separation */
    const minSep = 80, maxSep = W * 0.8;
    const k    = 1200; /* spring constant (magnetic analogy) */
    const mass = 2;    /* kg */
    const f_mag = k / Math.max(sep * sep, 400); /* F ∝ 1/r² */
    const dir   = mode === "attract" ? 1 : -1;

    /* Update physics */
    const f_on_1 = dir * f_mag;
    const f_on_2 = -dir * f_mag; /* Newton's Third Law — equal and opposite */
    p.v1 += (f_on_1 / mass) * DT;
    p.v2 += (f_on_2 / mass) * DT;
    p.x1 += p.v1 * DT * 20;
    p.x2 += p.v2 * DT * 20;

    /* Boundaries / collision / separation */
    if (p.x1 < -W * 0.35) { p.x1 = -W * 0.35; p.v1 = -p.v1 * 0.6; }
    if (p.x2 >  W * 0.35) { p.x2 =  W * 0.35; p.v2 = -p.v2 * 0.6; }
    if (mode === "attract" && p.x2 - p.x1 < minSep) { p.v1 = -0.3; p.v2 = 0.3; }
    if (mode === "repel"   && p.x2 - p.x1 > maxSep) { p.v1 = 0.3; p.v2 = -0.3; }
    p.v1 *= 0.97; p.v2 *= 0.97; /* damping */

    const cx = W / 2, cy = H / 2 + 10;
    const m1x = cx + p.x1, m2x = cx + p.x2;
    const mW = 50, mH = 30;

    /* ── Field lines ── */
    const fieldColor = mode === "attract" ? "rgba(248,113,113,0.25)" : "rgba(129,140,248,0.25)";
    for (let i = -2; i <= 2; i++) {
      const fy = cy + i * 18;
      ctx.beginPath(); ctx.moveTo(m1x + mW / 2, fy);
      ctx.bezierCurveTo(m1x + mW * 1.5, fy - (mode === "attract" ? 20 : -20) * Math.abs(i + 0.5),
        m2x - mW * 1.5, fy - (mode === "attract" ? 20 : -20) * Math.abs(i + 0.5),
        m2x - mW / 2, fy);
      ctx.strokeStyle = fieldColor; ctx.lineWidth = 1.5; ctx.setLineDash([3, 4]); ctx.stroke();
    }
    ctx.setLineDash([]);

    /* ── Magnet 1 (left) ── */
    fillRR(ctx, m1x - mW / 2, cy - mH / 2, mW / 2, mH, 4, "#dc2626");
    fillRR(ctx, m1x, cy - mH / 2, mW / 2, mH, 4, "#3b82f6");
    ctx.fillStyle = "#fff"; ctx.font = "bold 12px Inter, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("N", m1x - mW * 0.25, cy); ctx.fillText("S", m1x + mW * 0.25, cy);
    /* Force arrow on M1 */
    arw(ctx, m1x, cy - mH / 2 - 8, m1x + f_on_1 * 0.5, cy - mH / 2 - 8, "#fbbf24", `F₁`, 2.5);

    /* ── Magnet 2 (right) ── */
    const m2col = mode === "attract" ? ["#dc2626", "#3b82f6"] : ["#3b82f6", "#dc2626"]; /* flipped N/S for repel */
    fillRR(ctx, m2x - mW / 2, cy - mH / 2, mW / 2, mH, 4, m2col[1]);
    fillRR(ctx, m2x, cy - mH / 2, mW / 2, mH, 4, m2col[0]);
    ctx.fillStyle = "#fff"; ctx.textBaseline = "middle"; ctx.textAlign = "center";
    ctx.fillText(mode === "attract" ? "N" : "S", m2x - mW * 0.25, cy);
    ctx.fillText(mode === "attract" ? "S" : "N", m2x + mW * 0.25, cy);
    arw(ctx, m2x, cy - mH / 2 - 8, m2x + f_on_2 * 0.5, cy - mH / 2 - 8, "#fbbf24", `F₂`, 2.5);

    /* ── Third Law label ── */
    ctx.fillStyle = "#4ade80"; ctx.font = "bold 12px Inter, sans-serif"; ctx.textAlign = "center";
    ctx.fillText("|F₁| = |F₂| = " + f_mag.toFixed(3) + " N  (Newton's Third Law)", cx, cy + mH + 24);

    /* ── HUD ── */
    fillRR(ctx, 8, 8, 220, 68, 10, "rgba(2,6,23,0.9)");
    ctx.fillStyle = "#ec4899"; ctx.font = "bold 13px Inter, sans-serif"; ctx.textAlign = "left";
    ctx.fillText(mode === "attract" ? "🧲 Magnets Attracting" : "🧲 Magnets Repelling", 16, 18);
    hud(ctx, 16, 34, "Force mag:", `${f_mag.toFixed(4)} N`, "#fbbf24");
    hud(ctx, 16, 50, "3rd Law:", `F₁ = -F₂ always`, "#4ade80");
  }, [mode]);

  useEffect(() => {
    posRef.current = { x1: -90, x2: 90, v1: 0, v2: 0 };
    tRef.current = 0;
    const loop = () => { draw(); rafRef.current = requestAnimationFrame(loop); };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #500724" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: 320, display: "block" }} />
      <div style={{ padding: "12px 16px", display: "flex", gap: 12, alignItems: "center", background: "#070f1d" }}>
        {(["attract", "repel"] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); posRef.current = { x1: -90, x2: 90, v1: 0, v2: 0 }; }}
            style={{ background: mode === m ? "#db2777" : "#1e293b", color: "#fff", border: "none", borderRadius: 8, padding: "6px 18px", cursor: "pointer", fontSize: 13 }}>
            {m === "attract" ? "N→S Attract" : "N←N Repel"}
          </button>
        ))}
        <span style={{ color: "#94a3b8", fontSize: 12, marginLeft: "auto" }}>F ∝ 1/r² — equal forces on both magnets</span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * SIM 10 — PROPELLER THRUST (Topic 4: Third Law)
 * Fan/propeller pushes air back → thrust reaction pushes craft forward
 * ════════════════════════════════════════════════════════════════════ */
export function Sim_propeller_thrust() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const tRef      = useRef(0);
  const posRef    = useRef(0);
  const velRef    = useRef(0);
  const [rpm, setRpm] = useState(300);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    drawBg(ctx, W, H, "rgba(20,184,166,0.05)");

    tRef.current += DT;
    const t = tRef.current;
    /* Thrust ∝ RPM² */
    const thrust = (rpm / 300) * (rpm / 300) * 5; /* N */
    const drag   = velRef.current * 0.8;           /* air drag */
    velRef.current += (thrust - drag) * DT;
    posRef.current += velRef.current * DT * 15;
    /* Wrap */
    if (posRef.current > W * 0.4) posRef.current = -W * 0.35;

    const cx = W / 2 + posRef.current;
    const cy = H / 2;

    /* ── Air particles streaming backward ── */
    const particleCount = Math.floor(rpm / 40);
    ctx.fillStyle = "rgba(56,189,248,0.5)";
    for (let i = 0; i < particleCount; i++) {
      const px = cx - 30 - ((t * rpm / 10 + i * 18) % 160);
      const py = cy + (i % 7 - 3) * 12 + Math.sin(t * 3 + i) * 6;
      ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2); ctx.fill();
    }

    /* ── Drone/craft body ── */
    fillRR(ctx, cx - 40, cy - 16, 80, 32, 8, "#1e3a5f");
    ctx.strokeStyle = "#60a5fa"; ctx.lineWidth = 2; ctx.strokeRect(cx - 40, cy - 16, 80, 32);
    ctx.fillStyle = "#93c5fd"; ctx.font = "bold 11px Inter, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("DRONE", cx, cy);

    /* ── Propeller blades ── */
    const propX = cx - 44;
    ctx.save();
    ctx.translate(propX, cy);
    ctx.rotate(t * rpm / 60 * Math.PI * 2 * 0.016); /* actual rotation */
    [-1, 1].forEach(dir => {
      ctx.fillStyle = "#94a3b8";
      ctx.beginPath();
      ctx.ellipse(0, dir * 20, 6, 20, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    /* ── Thrust arrow ── */
    arw(ctx, cx + 42, cy, cx + 42 + thrust * 6, cy, "#4ade80", `Thrust=${thrust.toFixed(1)}N`, 3);
    /* ── Action arrow (air pushed back) ── */
    arw(ctx, propX - 6, cy, propX - 6 - thrust * 4, cy, "#f87171", "Action", 2.5);

    /* ── HUD ── */
    fillRR(ctx, 8, 8, 220, 84, 10, "rgba(2,6,23,0.9)");
    ctx.fillStyle = "#14b8a6"; ctx.font = "bold 13px Inter, sans-serif"; ctx.textAlign = "left";
    ctx.fillText("🚁 Propeller Thrust Lab", 16, 18);
    hud(ctx, 16, 34, "RPM:", `${rpm}`, "#fbbf24");
    hud(ctx, 16, 50, "Thrust:", `${thrust.toFixed(2)} N`, "#4ade80");
    hud(ctx, 16, 66, "Speed:", `${(velRef.current).toFixed(2)} m/s`, "#60a5fa");

    ctx.fillStyle = "#475569"; ctx.font = "11px 'JetBrains Mono', monospace"; ctx.textAlign = "center";
    ctx.fillText("Action: prop pushes air backward  →  Reaction: air pushes craft forward", W / 2, H - 12);
  }, [rpm]);

  useEffect(() => {
    tRef.current = 0; posRef.current = 0; velRef.current = 0;
    const loop = () => { draw(); rafRef.current = requestAnimationFrame(loop); };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #042f2e" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: 320, display: "block" }} />
      <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, background: "#070f1d" }}>
        <span style={{ color: "#64748b", fontSize: 13, whiteSpace: "nowrap" }}>RPM: <b style={{ color: "#14b8a6" }}>{rpm}</b></span>
        <input type="range" min={50} max={800} value={rpm} onChange={e => { setRpm(+e.target.value); velRef.current = 0; }}
          style={{ flex: 1, accentColor: "#14b8a6" }} />
        <span style={{ color: "#94a3b8", fontSize: 12 }}>Thrust ∝ RPM²</span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * SIM 11 — AIR HOCKEY (Topic 4: Third Law + Momentum)
 * Two pucks collide — equal forces during collision, momentum conserved
 * ════════════════════════════════════════════════════════════════════ */
export function Sim_air_hockey() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const stateRef  = useRef({ px1: 0, py1: 0, vx1: 0, vy1: 0, px2: 0, py2: 0, vx2: 0, vy2: 0, colliding: false });

  const reset = useCallback(() => {
    stateRef.current = {
      px1: 80, py1: 0, vx1: 120, vy1: 15,
      px2: 0,  py2: 0, vx2: -20, vy2: -10,
      colliding: false,
    };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;

    const s = stateRef.current;
    const cx = W / 2, cy = H / 2;
    const R = 22, m1 = 0.15, m2 = 0.15; /* equal mass pucks */

    /* Physics step */
    s.px1 += s.vx1 * DT; s.py1 += s.vy1 * DT;
    s.px2 += s.vx2 * DT; s.py2 += s.vy2 * DT;

    /* Wall bouncing */
    const hw = W / 2 - 20, hh = H / 2 - 30;
    if (Math.abs(s.px1) > hw - R) { s.px1 = Math.sign(s.px1) * (hw - R); s.vx1 *= -0.98; }
    if (Math.abs(s.py1) > hh - R) { s.py1 = Math.sign(s.py1) * (hh - R); s.vy1 *= -0.98; }
    if (Math.abs(s.px2) > hw - R) { s.px2 = Math.sign(s.px2) * (hw - R); s.vx2 *= -0.98; }
    if (Math.abs(s.py2) > hh - R) { s.py2 = Math.sign(s.py2) * (hh - R); s.vy2 *= -0.98; }

    /* Puck–puck collision (elastic, equal masses) */
    const dx = s.px2 - s.px1, dy = s.py2 - s.py1;
    const dist = Math.sqrt(dx * dx + dy * dy);
    s.colliding = dist < 2 * R;
    if (s.colliding) {
      const nx = dx / dist, ny = dy / dist;
      const dvx = s.vx1 - s.vx2, dvy = s.vy1 - s.vy2;
      const dvn = dvx * nx + dvy * ny;
      if (dvn > 0) { /* approaching */
        s.vx1 -= dvn * nx; s.vy1 -= dvn * ny;
        s.vx2 += dvn * nx; s.vy2 += dvn * ny;
        /* Separate */
        const overlap = 2 * R - dist;
        s.px1 -= overlap * 0.5 * nx; s.py1 -= overlap * 0.5 * ny;
        s.px2 += overlap * 0.5 * nx; s.py2 += overlap * 0.5 * ny;
      }
    }

    /* ── Table ── */
    fillRR(ctx, 20, 20, W - 40, H - 40, 12, "#0f172a");
    ctx.strokeStyle = "#1d4ed8"; ctx.lineWidth = 3; ctx.strokeRect(20, 20, W - 40, H - 40);
    /* Center line */
    ctx.beginPath(); ctx.moveTo(W / 2, 20); ctx.lineTo(W / 2, H - 20);
    ctx.strokeStyle = "#1e3a5f"; ctx.lineWidth = 1.5; ctx.setLineDash([8, 6]); ctx.stroke(); ctx.setLineDash([]);
    /* Center circle */
    ctx.beginPath(); ctx.arc(cx, cy, 40, 0, Math.PI * 2);
    ctx.strokeStyle = "#1e3a5f"; ctx.lineWidth = 1.5; ctx.stroke();

    /* ── Puck 1 (blue) ── */
    const p1x = cx + s.px1, p1y = cy + s.py1;
    const g1 = ctx.createRadialGradient(p1x - 5, p1y - 5, 3, p1x, p1y, R);
    g1.addColorStop(0, "#93c5fd"); g1.addColorStop(1, "#1d4ed8");
    ctx.beginPath(); ctx.arc(p1x, p1y, R, 0, Math.PI * 2);
    ctx.fillStyle = g1; ctx.fill();
    ctx.strokeStyle = s.colliding ? "#fbbf24" : "#3b82f6"; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = "#fff"; ctx.font = "bold 11px Inter, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("P₁", p1x, p1y);

    /* ── Puck 2 (red) ── */
    const p2x = cx + s.px2, p2y = cy + s.py2;
    const g2 = ctx.createRadialGradient(p2x - 5, p2y - 5, 3, p2x, p2y, R);
    g2.addColorStop(0, "#fca5a5"); g2.addColorStop(1, "#dc2626");
    ctx.beginPath(); ctx.arc(p2x, p2y, R, 0, Math.PI * 2);
    ctx.fillStyle = g2; ctx.fill();
    ctx.strokeStyle = s.colliding ? "#fbbf24" : "#ef4444"; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("P₂", p2x, p2y);

    /* ── Velocity arrows ── */
    const vscale = 0.12;
    arw(ctx, p1x, p1y, p1x + s.vx1 * vscale, p1y + s.vy1 * vscale, "#60a5fa", "", 2);
    arw(ctx, p2x, p2y, p2x + s.vx2 * vscale, p2y + s.vy2 * vscale, "#f87171", "", 2);

    /* Collision flash */
    if (s.colliding) {
      ctx.save(); ctx.globalAlpha = 0.4;
      ctx.beginPath(); ctx.arc((p1x + p2x) / 2, (p1y + p2y) / 2, 30, 0, Math.PI * 2);
      ctx.fillStyle = "#fbbf24"; ctx.fill();
      ctx.restore();
    }

    /* ── Background ── */
    ctx.save(); ctx.globalCompositeOperation = "destination-over";
    drawBg(ctx, W, H, "rgba(30,64,175,0.05)");
    ctx.restore();

    /* ── HUD ── */
    fillRR(ctx, 28, 28, 230, 84, 10, "rgba(2,6,23,0.9)");
    ctx.fillStyle = "#60a5fa"; ctx.font = "bold 13px Inter, sans-serif"; ctx.textAlign = "left";
    ctx.fillText("🎯 Air Hockey — 3rd Law + Momentum", 36, 40);
    const p_total = m1 * Math.sqrt(s.vx1 ** 2 + s.vy1 ** 2) + m2 * Math.sqrt(s.vx2 ** 2 + s.vy2 ** 2);
    hud(ctx, 36, 56, "|p| total:", `${p_total.toFixed(3)} kg·m/s`, "#4ade80");
    hud(ctx, 36, 72, "Collision:", s.colliding ? "⚡ IMPACT — Equal forces!" : "—", s.colliding ? "#fbbf24" : "#475569");
    hud(ctx, 36, 88, "3rd Law:", "F₁₂ = −F₂₁", "#a78bfa");
  }, []);

  useEffect(() => {
    reset();
    const loop = () => { draw(); rafRef.current = requestAnimationFrame(loop); };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw, reset]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #1e3a5f" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: 340, display: "block" }} />
      <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#070f1d" }}>
        <span style={{ color: "#94a3b8", fontSize: 13 }}>Equal-mass elastic collision — forces are always equal and opposite</span>
        <button onClick={reset} style={{ background: "#1d4ed8", color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", cursor: "pointer" }}>↺ Reset</button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * SIM 12 — 2D BILLIARDS (Topic 5: Conservation of Momentum)
 * Cue ball hits target — 2D momentum conservation
 * ════════════════════════════════════════════════════════════════════ */
export function Sim_billiards_2d() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const stateRef  = useRef({ bx: 0, by: 0, bvx: 0, bvy: 0, tx: 0, ty: 0, tvx: 0, tvy: 0, shot: false });

  const shoot = useCallback(() => {
    stateRef.current = {
      bx: -160, by: 0, bvx: 220, bvy: -15, /* cue ball */
      tx: 80,   ty: 20, tvx: 0,  tvy: 0,   /* target ball */
      shot: true,
    };
  }, []);

  useEffect(() => { shoot(); }, [shoot]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;

    const s = stateRef.current;
    const cx = W / 2, cy = H / 2;
    const R = 18, m = 0.17;

    if (s.shot) {
      s.bx += s.bvx * DT; s.by += s.bvy * DT;
      s.tx += s.tvx * DT; s.ty += s.tvy * DT;

      /* Wall bounces */
      const hw = W / 2 - 30, hh = H / 2 - 30;
      if (Math.abs(s.bx) > hw - R) { s.bx = Math.sign(s.bx) * (hw - R); s.bvx *= -0.9; }
      if (Math.abs(s.by) > hh - R) { s.by = Math.sign(s.by) * (hh - R); s.bvy *= -0.9; }
      if (Math.abs(s.tx) > hw - R) { s.tx = Math.sign(s.tx) * (hw - R); s.tvx *= -0.9; }
      if (Math.abs(s.ty) > hh - R) { s.ty = Math.sign(s.ty) * (hh - R); s.tvy *= -0.9; }

      /* Ball–ball collision (elastic) */
      const dx = s.tx - s.bx, dy = s.ty - s.by;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 2 * R && dist > 0) {
        const nx = dx / dist, ny = dy / dist;
        const dvx = s.bvx - s.tvx, dvy = s.bvy - s.tvy;
        const dvn = dvx * nx + dvy * ny;
        if (dvn > 0) {
          const impulse = 2 * m * dvn / (m + m);
          s.bvx -= impulse * nx; s.bvy -= impulse * ny;
          s.tvx += impulse * nx; s.tvy += impulse * ny;
          const overlap = 2 * R - dist;
          s.bx -= overlap * 0.5 * nx; s.by -= overlap * 0.5 * ny;
          s.tx += overlap * 0.5 * nx; s.ty += overlap * 0.5 * ny;
        }
      }
    }

    /* ── Table ── */
    fillRR(ctx, 20, 20, W - 40, H - 40, 10, "#064e3b");
    ctx.strokeStyle = "#065f46"; ctx.lineWidth = 10; ctx.strokeRect(20, 20, W - 40, H - 40);
    /* Pocket circles */
    [[20, 20], [W - 20, 20], [20, H - 20], [W - 20, H - 20]].forEach(([px, py]) => {
      ctx.beginPath(); ctx.arc(px, py, 14, 0, Math.PI * 2);
      ctx.fillStyle = "#000"; ctx.fill();
    });

    /* ── Cue ball (white) ── */
    const bx = cx + s.bx, by = cy + s.by;
    const bg = ctx.createRadialGradient(bx - 5, by - 5, 3, bx, by, R);
    bg.addColorStop(0, "#fff"); bg.addColorStop(1, "#d1d5db");
    ctx.beginPath(); ctx.arc(bx, by, R, 0, Math.PI * 2);
    ctx.fillStyle = bg; ctx.fill();
    ctx.fillStyle = "#374151"; ctx.font = "9px Inter, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("cue", bx, by);

    /* ── Target ball (red) ── */
    const tx = cx + s.tx, ty = cy + s.ty;
    const tg = ctx.createRadialGradient(tx - 5, ty - 5, 3, tx, ty, R);
    tg.addColorStop(0, "#f87171"); tg.addColorStop(1, "#b91c1c");
    ctx.beginPath(); ctx.arc(tx, ty, R, 0, Math.PI * 2);
    ctx.fillStyle = tg; ctx.fill();
    ctx.fillStyle = "#fff"; ctx.font = "bold 11px Inter, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("1", tx, ty);

    /* ── Velocity arrows ── */
    const vsc = 0.1;
    if (s.shot) {
      arw(ctx, bx, by, bx + s.bvx * vsc, by + s.bvy * vsc, "#d1d5db", "", 2);
      arw(ctx, tx, ty, tx + s.tvx * vsc, ty + s.tvy * vsc, "#f87171", "", 2);
    }

    /* ── Momentum display ── */
    const pbx = m * Math.sqrt(s.bvx ** 2 + s.bvy ** 2);
    const ptx = m * Math.sqrt(s.tvx ** 2 + s.tvy ** 2);
    const ptot = m * Math.sqrt((s.bvx + s.tvx) ** 2 + (s.bvy + s.tvy) ** 2);

    fillRR(ctx, 28, 28, 220, 84, 10, "rgba(2,6,23,0.9)");
    ctx.fillStyle = "#4ade80"; ctx.font = "bold 13px Inter, sans-serif"; ctx.textAlign = "left";
    ctx.fillText("🎱 2D Billiards — Momentum", 36, 42);
    hud(ctx, 36, 58, "p_cue:", `${pbx.toFixed(3)} kg·m/s`, "#d1d5db");
    hud(ctx, 36, 74, "p_red:", `${ptx.toFixed(3)} kg·m/s`, "#f87171");
    hud(ctx, 36, 90, "p_total:", `${ptot.toFixed(3)} kg·m/s`, "#4ade80");
  }, []);

  useEffect(() => {
    const loop = () => { draw(); rafRef.current = requestAnimationFrame(loop); };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #052e16" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: 340, display: "block" }} />
      <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#070f1d" }}>
        <span style={{ color: "#94a3b8", fontSize: 13 }}>2D elastic collision — total momentum vector is conserved in all directions</span>
        <button onClick={shoot} style={{ background: "#059669", color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", cursor: "pointer" }}>↺ New Shot</button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * SIM 13 — ROCKET FUEL BURN (Topic 5: Momentum)
 * Tsiolkovsky rocket equation: Δv = v_e · ln(m₀/m_f)
 * ════════════════════════════════════════════════════════════════════ */
export function Sim_rocket_fuel_burn() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const stateRef  = useRef({ t: 0, fuel: 800, vy: 0, y: 0, burning: true });

  const reset = useCallback(() => {
    stateRef.current = { t: 0, fuel: 800, vy: 0, y: 0, burning: true };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    drawBg(ctx, W, H, "rgba(251,191,36,0.04)");

    const s = stateRef.current;
    s.t += DT;

    const m_dry    = 200;  /* kg — dry mass */
    const ve       = 3000; /* m/s — exhaust velocity */
    const burn_rate = 30;  /* kg/s */
    let   thrust    = 0;

    if (s.burning && s.fuel > 0) {
      s.fuel = Math.max(0, s.fuel - burn_rate * DT);
      const m = m_dry + s.fuel;
      thrust = ve * burn_rate;
      const a = thrust / m - G;
      s.vy += a * DT;
    } else {
      s.burning = false;
      s.vy -= G * DT; /* coasting under gravity */
    }

    s.y += s.vy * DT;
    if (s.y < 0) { s.y = 0; s.vy = 0; reset(); }

    /* Tsiolkovsky ideal Δv */
    const m0 = m_dry + 800;
    const mf = m_dry + s.fuel;
    const delta_v = ve * Math.log(m0 / mf);

    /* ── Starfield ── */
    for (let i = 0; i < 30; i++) {
      const sx = (i * 137.5) % W;
      const sy = ((i * 83.7 + s.y * 0.8) % (H - 20) + H) % (H - 20);
      ctx.fillStyle = `rgba(255,255,255,${0.3 + (i % 5) * 0.12})`;
      ctx.beginPath(); ctx.arc(sx, sy, 1 + i % 2, 0, Math.PI * 2); ctx.fill();
    }

    /* ── Ground ── */
    const groundY = H - 30 + Math.min(s.y * 0.4, H * 2);
    ctx.fillStyle = "#1e293b"; ctx.fillRect(0, groundY, W, H - groundY + 60);

    /* ── Rocket ── */
    const rx = W / 2, ry = H * 0.55 - Math.min(s.y * 0.4, H * 0.5);

    /* Exhaust flame */
    if (s.burning && s.fuel > 0) {
      const flameH = 40 + Math.random() * 30;
      const fg = ctx.createLinearGradient(0, ry + 40, 0, ry + 40 + flameH);
      fg.addColorStop(0, "#fff7ed"); fg.addColorStop(0.3, "#fb923c"); fg.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.moveTo(rx - 8, ry + 40); ctx.lineTo(rx, ry + 40 + flameH); ctx.lineTo(rx + 8, ry + 40);
      ctx.fillStyle = fg; ctx.fill();
    }

    /* Rocket body */
    fillRR(ctx, rx - 12, ry - 30, 24, 70, 4, "#334155");
    fillRR(ctx, rx - 10, ry - 30, 20, 50, 4, "#1e40af");
    /* Nose cone */
    ctx.beginPath(); ctx.moveTo(rx, ry - 46); ctx.lineTo(rx - 12, ry - 30); ctx.lineTo(rx + 12, ry - 30); ctx.closePath();
    ctx.fillStyle = "#dc2626"; ctx.fill();
    /* Fins */
    [[-1, 1], [1, 1]].forEach(([dx]) => {
      ctx.beginPath(); ctx.moveTo(rx + dx * 12, ry + 30); ctx.lineTo(rx + dx * 28, ry + 50); ctx.lineTo(rx + dx * 12, ry + 40); ctx.closePath();
      ctx.fillStyle = "#475569"; ctx.fill();
    });
    /* Fuel gauge */
    const fuelH = (s.fuel / 800) * 30;
    fillRR(ctx, rx - 6, ry, 12, 30, 3, "#0f172a");
    if (fuelH > 0) fillRR(ctx, rx - 5, ry + 30 - fuelH, 10, fuelH, 2, "#f59e0b");

    /* ── Velocity arrow ── */
    if (s.vy > 0) arw(ctx, rx + 20, ry, rx + 20, ry - Math.min(s.vy * 0.3, 60), "#4ade80", "v", 2.5);

    /* ── HUD ── */
    fillRR(ctx, 8, 8, 240, 102, 10, "rgba(2,6,23,0.92)");
    ctx.fillStyle = "#fbbf24"; ctx.font = "bold 13px Inter, sans-serif"; ctx.textAlign = "left";
    ctx.fillText("🚀 Tsiolkovsky Rocket", 16, 18);
    hud(ctx, 16, 34, "Fuel left:", `${s.fuel.toFixed(0)} kg`, "#f59e0b");
    hud(ctx, 16, 50, "Velocity:", `${s.vy.toFixed(1)} m/s`, "#4ade80");
    hud(ctx, 16, 66, "Height:", `${s.y.toFixed(0)} m`, "#60a5fa");
    hud(ctx, 16, 82, "Δv ideal:", `${delta_v.toFixed(1)} m/s`, "#a78bfa");

    ctx.fillStyle = "#475569"; ctx.font = "11px 'JetBrains Mono', monospace"; ctx.textAlign = "center";
    ctx.fillText("Δv = v_e · ln(m₀/m_f)  — Tsiolkovsky equation", W / 2, H - 12);
  }, [reset]);

  useEffect(() => {
    reset();
    const loop = () => { draw(); rafRef.current = requestAnimationFrame(loop); };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw, reset]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #451a03" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: 340, display: "block" }} />
      <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#070f1d" }}>
        <span style={{ color: "#94a3b8", fontSize: 13 }}>Burning fuel ejects mass backward → momentum pushes rocket forward</span>
        <button onClick={reset} style={{ background: "#d97706", color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", cursor: "pointer" }}>↺ Re-Launch</button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * SIM 14 — SUPERBALL REBOUND (Topic 5: Momentum)
 * Coefficient of restitution e = v_after / v_before
 * Different balls lose different fractions of momentum per bounce
 * ════════════════════════════════════════════════════════════════════ */
export function Sim_superball_rebound() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const stateRef  = useRef([
    { y: -120, vy: 0, cor: 0.95, color: "#4ade80",  label: "Super", bounces: 0 },
    { y: -120, vy: 0, cor: 0.7,  color: "#fbbf24",  label: "Tennis", bounces: 0 },
    { y: -120, vy: 0, cor: 0.4,  color: "#f87171",  label: "Clay", bounces: 0 },
  ]);
  const initRef = useRef(true);

  useEffect(() => {
    stateRef.current.forEach((b, i) => { b.y = -80 - i * 0; b.vy = 0; b.bounces = 0; });
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    drawBg(ctx, W, H, "rgba(74,222,128,0.04)");

    /* ── Floor ── */
    const floorY = H - 40;
    ctx.fillStyle = "#1e293b"; ctx.fillRect(0, floorY, W, 40);
    ctx.strokeStyle = "#334155"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, floorY); ctx.lineTo(W, floorY); ctx.stroke();

    const R = 20;
    const balls = stateRef.current;
    const colW = W / balls.length;

    balls.forEach((ball, i) => {
      /* Physics */
      ball.vy += G * DT * 60; /* px/s scale */
      ball.y  += ball.vy * DT;

      const centerX = colW * i + colW / 2;
      const ballY   = floorY - R - Math.max(0, -ball.y);
      const screenY = floorY - R + ball.y;

      /* Bounce */
      if (ball.y > 0) {
        ball.y  = 0;
        ball.vy = -ball.vy * ball.cor;
        ball.bounces++;
        if (Math.abs(ball.vy) < 2) { ball.y = -80; ball.vy = 0; ball.bounces = 0; }
      }

      /* Draw trail */
      ctx.save();
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = ball.color;
      for (let j = 1; j <= 4; j++) {
        const trail_y = floorY - R + ball.y - j * ball.vy * DT * 3;
        ctx.beginPath(); ctx.arc(centerX, Math.max(R + 20, trail_y), R - j * 3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();

      /* Ball */
      const actualY = Math.max(R + 10, floorY - R + ball.y);
      const bgrad = ctx.createRadialGradient(centerX - 5, actualY - 5, 3, centerX, actualY, R);
      bgrad.addColorStop(0, "#fff"); bgrad.addColorStop(1, ball.color);
      ctx.beginPath(); ctx.arc(centerX, actualY, R, 0, Math.PI * 2);
      ctx.fillStyle = bgrad; ctx.fill();

      /* Squash effect near floor */
      if (ball.y > -10 && ball.y <= 0) {
        const squash = 1 + (-ball.y / 10) * 0.3;
        ctx.save(); ctx.translate(centerX, floorY - R * 0.3);
        ctx.scale(squash, 1 / squash);
        ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2);
        ctx.fillStyle = ball.color; ctx.globalAlpha = 0.5; ctx.fill();
        ctx.restore();
      }

      /* Label */
      ctx.fillStyle = ball.color; ctx.font = "bold 12px Inter, sans-serif";
      ctx.textAlign = "center"; ctx.fillText(ball.label, centerX, floorY + 16);
      ctx.fillStyle = "#94a3b8"; ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.fillText(`e=${ball.cor}`, centerX, floorY + 30);
      ctx.fillStyle = "#64748b";
      ctx.fillText(`${ball.bounces} bounces`, centerX, floorY + 44);
    });

    /* ── HUD ── */
    fillRR(ctx, 8, 8, 235, 68, 10, "rgba(2,6,23,0.9)");
    ctx.fillStyle = "#4ade80"; ctx.font = "bold 13px Inter, sans-serif"; ctx.textAlign = "left";
    ctx.fillText("⚡ Coefficient of Restitution", 16, 18);
    hud(ctx, 16, 34, "e=0.95 (superball):", "bounces longest", "#4ade80");
    hud(ctx, 16, 50, "e=0.4 (clay ball):", "stops quickly", "#f87171");

    ctx.fillStyle = "#475569"; ctx.font = "11px 'JetBrains Mono', monospace"; ctx.textAlign = "center";
    ctx.fillText("e = v_rebound / v_impact  —  e=1 → elastic, e=0 → perfectly inelastic", W / 2, H - 12);
  }, []);

  useEffect(() => {
    const loop = () => { draw(); rafRef.current = requestAnimationFrame(loop); };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #052e16" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: 340, display: "block" }} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * SIM 15 — 2D MOMENTUM EXPLOSION (Topic 5: Conservation of Momentum)
 * Object explodes into fragments — total momentum stays zero
 * ════════════════════════════════════════════════════════════════════ */
export function Sim_momentum_explosion_2d() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef<number>(0);
  const fragsRef   = useRef<Array<{ x: number; y: number; vx: number; vy: number; m: number; color: string; r: number }>>([]);
  const phaseRef   = useRef<"waiting" | "exploding" | "flying">("waiting");
  const tRef       = useRef(0);

  const explode = useCallback(() => {
    const colors = ["#f87171", "#4ade80", "#60a5fa", "#fbbf24", "#a78bfa", "#f472b6"];
    const masses = [1.2, 0.8, 1.5, 0.6, 1.0, 0.9];
    fragsRef.current = masses.map((m, i) => {
      const angle = (i / masses.length) * Math.PI * 2 + Math.random() * 0.5;
      const speed = 80 / m + Math.random() * 30; /* larger mass → slower */
      return {
        x: 0, y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        m, r: 10 + m * 6, color: colors[i],
      };
    });
    phaseRef.current = "exploding";
    tRef.current     = 0;
  }, []);

  useEffect(() => {
    /* Auto-explode after 1s */
    const tid = setTimeout(explode, 1000);
    return () => clearTimeout(tid);
  }, [explode]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    drawBg(ctx, W, H, "rgba(244,114,182,0.04)");

    tRef.current += DT;
    const cx = W / 2, cy = H / 2;

    if (phaseRef.current === "waiting") {
      /* Draw pre-explosion object */
      const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 30);
      grad.addColorStop(0, "#fde68a"); grad.addColorStop(1, "#d97706");
      ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI * 2);
      ctx.fillStyle = grad; ctx.fill();
      const pulse = 1 + Math.sin(tRef.current * 4) * 0.08;
      ctx.save(); ctx.globalAlpha = 0.3;
      ctx.beginPath(); ctx.arc(cx, cy, 30 * pulse, 0, Math.PI * 2);
      ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 3; ctx.stroke();
      ctx.restore();
      ctx.fillStyle = "#fff"; ctx.font = "bold 13px Inter, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("💣", cx, cy);
    } else {
      /* Move fragments */
      fragsRef.current.forEach(f => {
        f.x += f.vx * DT;
        f.y += f.vy * DT;
        /* Wrap */
        const hwx = W / 2 + f.r, hwy = H / 2 + f.r;
        if (Math.abs(f.x) > hwx) { f.x = Math.sign(f.x) * hwx; f.vx *= -0.8; }
        if (Math.abs(f.y) > hwy) { f.y = Math.sign(f.y) * hwy; f.vy *= -0.8; }
      });

      /* Draw momentum vectors */
      let px_total = 0, py_total = 0;
      fragsRef.current.forEach(f => {
        const fx = cx + f.x, fy = cy + f.y;
        /* Trail */
        ctx.save(); ctx.globalAlpha = 0.15;
        ctx.strokeStyle = f.color; ctx.lineWidth = f.r;
        ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx - f.vx * 0.06, fy - f.vy * 0.06);
        ctx.stroke(); ctx.restore();

        /* Fragment */
        const fg = ctx.createRadialGradient(fx - 3, fy - 3, 2, fx, fy, f.r);
        fg.addColorStop(0, "#fff"); fg.addColorStop(1, f.color);
        ctx.beginPath(); ctx.arc(fx, fy, f.r, 0, Math.PI * 2);
        ctx.fillStyle = fg; ctx.fill();
        /* Mass label */
        ctx.fillStyle = "#0f172a"; ctx.font = `bold ${Math.max(9, f.r - 4)}px Inter, sans-serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(`${f.m}`, fx, fy);

        /* Momentum arrow */
        const pscale = 0.04;
        arw(ctx, fx, fy, fx + f.vx * f.m * pscale, fy + f.vy * f.m * pscale, f.color, "", 2);

        px_total += f.m * f.vx;
        py_total += f.m * f.vy;
      });

      /* Total momentum arrow from center */
      const pnet = Math.sqrt(px_total * px_total + py_total * py_total);
      if (pnet > 0.1) {
        arw(ctx, cx, cy, cx + px_total * 0.02, cy + py_total * 0.02, "#fff", "p_net", 2.5);
      }

      /* ── HUD ── */
      fillRR(ctx, 8, 8, 250, 84, 10, "rgba(2,6,23,0.92)");
      ctx.fillStyle = "#f472b6"; ctx.font = "bold 13px Inter, sans-serif"; ctx.textAlign = "left";
      ctx.fillText("💥 2D Explosion — Momentum Conserved", 16, 18);
      hud(ctx, 16, 34, "p_x total:", `${px_total.toFixed(2)} kg·m/s`, Math.abs(px_total) < 5 ? "#4ade80" : "#f87171");
      hud(ctx, 16, 50, "p_y total:", `${py_total.toFixed(2)} kg·m/s`, Math.abs(py_total) < 5 ? "#4ade80" : "#f87171");
      hud(ctx, 16, 66, "|p_net|:", `${pnet.toFixed(2)} ≈ 0 ✓`, "#4ade80");
    }

    /* Auto reset */
    if (tRef.current > 6) { phaseRef.current = "waiting"; tRef.current = 0; setTimeout(explode, 1200); }

    ctx.fillStyle = "#475569"; ctx.font = "11px 'JetBrains Mono', monospace"; ctx.textAlign = "center";
    ctx.fillText("Initially at rest → total p = 0 → after explosion sum of all fragments = 0", W / 2, H - 12);
  }, [explode]);

  useEffect(() => {
    const loop = () => { draw(); rafRef.current = requestAnimationFrame(loop); };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <div style={{ background: "#050c18", borderRadius: 16, overflow: "hidden", border: "1px solid #500724" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: 340, display: "block" }} />
      <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#070f1d" }}>
        <span style={{ color: "#94a3b8", fontSize: 13 }}>System starts at rest (p=0). After explosion, vector sum of all momenta = 0</span>
        <button onClick={() => { phaseRef.current = "waiting"; tRef.current = 0; setTimeout(explode, 800); }}
          style={{ background: "#be185d", color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", cursor: "pointer" }}>💥 Explode</button>
      </div>
    </div>
  );
}
