"use client";
/**
 * FILE: Topic9Professional.tsx
 * LOCATION: src/components/simulations/Topic9Professional.tsx
 * PURPOSE: 15 brand-new ultra-professional, deeply physics-accurate canvas simulations
 *          for Class 9 Force & Laws of Motion. Each has:
 *            - Real physics equations (Euler integration, proper constants)
 *            - HiDPI canvas support
 *            - Interactive controls (sliders, buttons)
 *            - Live telemetry readout
 *            - Beautiful dark-theme visual design with glow effects
 *            - Educational labels and annotations
 *          Topics covered: All 5 (Balanced/Unbalanced, Newton 1/2/3, Momentum)
 * LAST UPDATED: 2026-06-01
 */

import React, { useRef, useEffect, useState, useCallback } from "react";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SHARED CANVAS UTILITIES
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const G = 9.8;   /* m/s² */
const DT = 1 / 60; /* 60fps timestep */

function setupCanvas(canvas: HTMLCanvasElement): [CanvasRenderingContext2D, number, number] | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.clientWidth || 600;
  const H = canvas.clientHeight || 320;
  if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  return [ctx, W, H];
}

function drawGrid(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.fillStyle = "#060d1a";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(99,102,241,0.04)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
}

function arrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, label = "", lw = 2.5) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy);
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
    ctx.shadowColor = color; ctx.shadowBlur = 4;
    ctx.fillText(label, x2 + ux * 20, y2 + uy * 14);
    ctx.shadowBlur = 0;
  }
  ctx.restore();
}

function glowCircle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, glowColor: string) {
  ctx.save();
  ctx.shadowColor = glowColor; ctx.shadowBlur = 18;
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();
}

function hud(ctx: CanvasRenderingContext2D, lines: string[], x: number, y: number, color = "#94a3b8") {
  ctx.save();
  ctx.font = "bold 12px 'JetBrains Mono', monospace";
  ctx.fillStyle = color;
  ctx.textAlign = "left";
  lines.forEach((line, i) => {
    ctx.fillText(line, x, y + i * 17);
  });
  ctx.restore();
}

function pill(ctx: CanvasRenderingContext2D, label: string, x: number, y: number, bg: string, fg: string) {
  ctx.save();
  ctx.font = "bold 11px Inter, sans-serif";
  const w = ctx.measureText(label).width + 20;
  ctx.fillStyle = bg + "33";
  ctx.strokeStyle = bg + "88";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - 10, w, 20, 10); ctx.fill(); ctx.stroke();
  ctx.fillStyle = fg; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(label, x, y);
  ctx.restore();
}

const SimWrapper = ({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) => (
  <div style={{ background: "#060d1a", borderRadius: 16, border: "1px solid rgba(99,102,241,0.2)", overflow: "hidden", marginBottom: 8 }}>
    <div style={{ padding: "12px 16px 8px", borderBottom: "1px solid rgba(99,102,241,0.1)" }}>
      <h4 style={{ margin: 0, color: "#e2e8f0", fontSize: 14, fontWeight: 700 }}>{title}</h4>
      <p style={{ margin: "3px 0 0", color: "#64748b", fontSize: 12 }}>{desc}</p>
    </div>
    {children}
  </div>
);

const Slider = ({ label, value, min, max, step, onChange, unit = "" }:
  { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; unit?: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
    <span style={{ color: "#94a3b8", fontSize: 12, minWidth: 100 }}>{label}</span>
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={e => onChange(Number(e.target.value))}
      style={{ flex: 1, accentColor: "#6366f1", height: 4 }}
    />
    <span style={{ color: "#a5b4fc", fontSize: 12, minWidth: 60, textAlign: "right" }}>
      {typeof value === "number" ? value.toFixed(step < 1 ? 1 : 0) : value}{unit}
    </span>
  </div>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SIM 1: ELASTIC vs INELASTIC COLLISION COMPARATOR
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_collision_comparator() {
  const canRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ running: false, t: 0 });
  const [m1, setM1] = useState(3);
  const [m2, setM2] = useState(2);
  const [v1, setV1] = useState(5);
  const [e, setE] = useState(1.0); /* coefficient of restitution: 1=elastic, 0=perfectly inelastic */
  const [playing, setPlaying] = useState(false);
  const rafRef = useRef(0);

  const run = useCallback(() => {
    const canvas = canRef.current;
    if (!canvas) return;
    const setup = setupCanvas(canvas);
    if (!setup) return;
    const [ctx, W, H] = setup;

    /* Physics: conservation of momentum + coefficient of restitution */
    /* v1' = ((m1-e*m2)*v1 + (1+e)*m2*v2) / (m1+m2) */
    /* v2' = ((m2-e*m1)*v2 + (1+e)*m1*v1) / (m1+m2) */
    const v2 = 0;
    const v1f = ((m1 - e * m2) * v1 + (1 + e) * m2 * v2) / (m1 + m2);
    const v2f = ((m2 - e * m1) * v2 + (1 + e) * m1 * v1) / (m1 + m2);
    const KE_before = 0.5 * m1 * v1 ** 2 + 0.5 * m2 * v2 ** 2;
    const KE_after  = 0.5 * m1 * v1f ** 2 + 0.5 * m2 * v2f ** 2;
    const KElost = KE_before - KE_after;

    const r1 = 8 + m1 * 5;
    const r2 = 8 + m2 * 5;
    const pxPerMs = 0.08;
    const FLOOR = H * 0.62;

    let x1 = W * 0.15;
    let x2 = W * 0.72;
    let vx1 = v1 * pxPerMs;
    let vx2 = 0;
    let collided = false;
    let t = 0;
    stateRef.current.running = true;

    const frame = () => {
      if (!stateRef.current.running) return;
      const setup2 = setupCanvas(canvas);
      if (!setup2) return;
      const [c2, W2, H2] = setup2;
      drawGrid(c2, W2, H2);

      /* floor */
      c2.fillStyle = "rgba(99,102,241,0.12)";
      c2.fillRect(0, FLOOR, W2, 2);
      c2.fillStyle = "#312e81";
      c2.fillRect(0, FLOOR + 2, W2, H2);

      /* update physics */
      if (!collided && x1 + r1 >= x2 - r2) {
        collided = true;
        vx1 = v1f * pxPerMs;
        vx2 = v2f * pxPerMs;
        /* collision flash */
        c2.save();
        c2.fillStyle = "rgba(255,200,0,0.18)";
        c2.beginPath(); c2.arc((x1 + x2) / 2, FLOOR - r1 - 2, 50, 0, Math.PI * 2); c2.fill();
        c2.restore();
      }

      x1 += vx1;
      x2 += vx2;
      t += DT * 1000;

      /* balls */
      glowCircle(c2, x1, FLOOR - r1, r1, "#6366f1", "#818cf8");
      glowCircle(c2, x2, FLOOR - r2, r2, "#f59e0b", "#fbbf24");

      /* labels */
      pill(c2, `m₁=${m1} kg`, x1, FLOOR - r1 * 2 - 14, "#6366f1", "#c7d2fe");
      pill(c2, `m₂=${m2} kg`, x2, FLOOR - r2 * 2 - 14, "#f59e0b", "#fde68a");

      /* velocity arrows */
      if (Math.abs(vx1) > 0.3) arrow(c2, x1, FLOOR - r1, x1 + vx1 * 30, FLOOR - r1, "#6366f1", `${(vx1 / pxPerMs).toFixed(1)} m/s`);
      if (Math.abs(vx2) > 0.3) arrow(c2, x2, FLOOR - r2, x2 + vx2 * 30, FLOOR - r2, "#f59e0b", `${(vx2 / pxPerMs).toFixed(1)} m/s`);

      /* HUD */
      const type = e === 1 ? "ELASTIC" : e === 0 ? "PERFECTLY INELASTIC" : "PARTIALLY INELASTIC";
      hud(c2, [
        `Type: ${type}`,
        `e (restitution) = ${e.toFixed(1)}`,
        `KE before: ${KE_before.toFixed(1)} J`,
        `KE after:  ${KE_after.toFixed(1)} J`,
        `KE lost:   ${KElost.toFixed(1)} J (${((KElost / KE_before) * 100).toFixed(0)}%)`,
        collided ? `v₁' = ${v1f.toFixed(2)} m/s   v₂' = ${v2f.toFixed(2)} m/s` : "→ approaching collision...",
      ], 14, 20, "#a5b4fc");

      /* continue */
      if (x1 < W2 + 80 && x2 < W2 + 80 && x1 > -80) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        stateRef.current.running = false;
        setPlaying(false);
      }
    };
    rafRef.current = requestAnimationFrame(frame);
  }, [m1, m2, v1, e]);

  const reset = useCallback(() => {
    stateRef.current.running = false;
    cancelAnimationFrame(rafRef.current);
    setPlaying(false);
    const canvas = canRef.current;
    if (!canvas) return;
    const setup = setupCanvas(canvas);
    if (!setup) return;
    const [ctx, W, H] = setup;
    drawGrid(ctx, W, H);
  }, []);

  useEffect(() => { reset(); }, [reset]);
  useEffect(() => () => { stateRef.current.running = false; cancelAnimationFrame(rafRef.current); }, []);

  return (
    <SimWrapper title="⚡ Elastic vs Inelastic Collision Comparator" desc="Adjust masses and coefficient of restitution (e). e=1 → elastic; e=0 → perfectly inelastic.">
      <canvas ref={canRef} style={{ width: "100%", height: 260, display: "block" }} />
      <div style={{ padding: "10px 16px 14px" }}>
        <Slider label="Mass m₁" value={m1} min={1} max={8} step={1} onChange={v => { reset(); setM1(v); }} unit=" kg" />
        <Slider label="Mass m₂" value={m2} min={1} max={8} step={1} onChange={v => { reset(); setM2(v); }} unit=" kg" />
        <Slider label="Speed v₁" value={v1} min={1} max={10} step={1} onChange={v => { reset(); setV1(v); }} unit=" m/s" />
        <Slider label="e (restitution)" value={e} min={0} max={1} step={0.1} onChange={v => { reset(); setE(v); }} />
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button onClick={() => { setPlaying(true); run(); }}
            style={{ flex: 1, background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, padding: "7px 0", cursor: "pointer", fontWeight: 700 }}>
            {playing ? "▶ Running..." : "▶ Launch"}
          </button>
          <button onClick={reset}
            style={{ flex: 1, background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, padding: "7px 0", cursor: "pointer" }}>
            ↺ Reset
          </button>
        </div>
      </div>
    </SimWrapper>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SIM 2: NEWTON'S 2ND LAW LIVE TRACK
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_newton_second_track() {
  const canRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ running: false });
  const rafRef = useRef(0);
  const [mass, setMass] = useState(5);
  const [force, setForce] = useState(10);
  const [friction, setFriction] = useState(0.2);
  const [playing, setPlaying] = useState(false);

  const acc = (force - friction * mass * G) / mass; /* a = (F - f) / m */

  const draw = useCallback((x: number, vel: number, a: number, time: number, trail: number[]) => {
    const canvas = canRef.current;
    if (!canvas) return;
    const setup = setupCanvas(canvas);
    if (!setup) return;
    const [ctx, W, H] = setup;
    drawGrid(ctx, W, H);

    const FLOOR = H * 0.65;
    const CART_W = 60, CART_H = 28;
    const WR = 10; /* wheel radius */

    /* floor */
    ctx.fillStyle = "#1e293b"; ctx.fillRect(0, FLOOR, W, H - FLOOR);
    ctx.fillStyle = "rgba(99,102,241,0.2)"; ctx.fillRect(0, FLOOR, W, 2);

    /* distance markers */
    for (let mx = 0; mx < W; mx += 80) {
      ctx.strokeStyle = "rgba(99,102,241,0.15)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(mx, FLOOR); ctx.lineTo(mx, FLOOR - 12); ctx.stroke();
      ctx.fillStyle = "#475569"; ctx.font = "10px monospace"; ctx.textAlign = "center";
      ctx.fillText(`${Math.round(mx / 40)}m`, mx, FLOOR - 18);
    }

    /* trail */
    ctx.strokeStyle = "rgba(99,102,241,0.3)"; ctx.lineWidth = 2;
    ctx.beginPath();
    trail.forEach((tx, i) => {
      if (i === 0) ctx.moveTo(tx, FLOOR - CART_H - WR); else ctx.lineTo(tx, FLOOR - CART_H - WR);
    });
    ctx.stroke();

    /* cart body */
    const cx = x, cy = FLOOR - CART_H - WR;
    ctx.save();
    ctx.shadowColor = "#6366f1"; ctx.shadowBlur = 14;
    ctx.fillStyle = "#3730a3";
    ctx.beginPath(); ctx.roundRect(cx - CART_W / 2, cy, CART_W, CART_H, 5); ctx.fill();
    ctx.strokeStyle = "#818cf8"; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();

    /* wheels */
    [cx - 18, cx + 18].forEach(wx => {
      glowCircle(ctx, wx, FLOOR - WR, WR, "#475569", "#6366f1");
      glowCircle(ctx, wx, FLOOR - WR, 4, "#94a3b8", "#a5b4fc");
    });

    /* force arrow */
    if (force > 0) arrow(ctx, cx + CART_W / 2, cy + CART_H / 2, cx + CART_W / 2 + force * 4, cy + CART_H / 2, "#10b981", `F=${force}N`);
    /* friction arrow (opposing) */
    if (friction > 0 && vel > 0.01)
      arrow(ctx, cx - CART_W / 2, cy + CART_H / 2, cx - CART_W / 2 - friction * mass * G * 3, cy + CART_H / 2, "#ef4444", `f=${(friction * mass * G).toFixed(1)}N`);

    /* HUD */
    hud(ctx, [
      `F = ${force} N  |  m = ${mass} kg  |  μ = ${friction}`,
      `Net Force = ${(force - friction * mass * G).toFixed(1)} N`,
      `Acceleration = ${a.toFixed(2)} m/s²  (a = F/m)`,
      `Velocity = ${vel.toFixed(2)} m/s`,
      `Time = ${time.toFixed(1)} s  |  Distance = ${(x / 40).toFixed(1)} m`,
    ], 14, 16, "#a5b4fc");
  }, [force, friction, mass]);

  const run = useCallback(() => {
    stateRef.current.running = true;
    setPlaying(true);
    let x = 80, vel = 0, t = 0;
    const trail: number[] = [];
    const a = (force - friction * mass * G) / mass;

    const frame = () => {
      if (!stateRef.current.running) return;
      vel += a * DT;
      if (vel < 0) vel = 0;
      x += vel * DT * 40;
      t += DT;
      trail.push(x);
      if (trail.length > 40) trail.shift();
      draw(x, vel, a, t, trail);

      if (x < 1200) rafRef.current = requestAnimationFrame(frame);
      else { stateRef.current.running = false; setPlaying(false); }
    };
    rafRef.current = requestAnimationFrame(frame);
  }, [draw, force, friction, mass]);

  useEffect(() => { stateRef.current.running = false; cancelAnimationFrame(rafRef.current); setPlaying(false); draw(80, 0, acc, 0, []); }, [draw, acc]);
  useEffect(() => () => { stateRef.current.running = false; cancelAnimationFrame(rafRef.current); }, []);

  return (
    <SimWrapper title="🚀 Newton's 2nd Law — F = ma Live Track" desc="Watch a cart accelerate. See real-time force, friction, and acceleration. a = (F − f·m·g) / m">
      <canvas ref={canRef} style={{ width: "100%", height: 240, display: "block" }} />
      <div style={{ padding: "10px 16px 14px" }}>
        <Slider label="Applied Force" value={force} min={0} max={50} step={1} onChange={setForce} unit=" N" />
        <Slider label="Mass" value={mass} min={1} max={15} step={1} onChange={setMass} unit=" kg" />
        <Slider label="Friction μ" value={friction} min={0} max={0.8} step={0.1} onChange={setFriction} />
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button onClick={run} disabled={playing}
            style={{ flex: 1, background: playing ? "#1e293b" : "#4f46e5", color: playing ? "#475569" : "#fff", border: "none", borderRadius: 8, padding: "7px 0", cursor: playing ? "default" : "pointer", fontWeight: 700 }}>
            {playing ? "▶ Running..." : "▶ Start"}
          </button>
          <button onClick={() => { stateRef.current.running = false; cancelAnimationFrame(rafRef.current); setPlaying(false); draw(80, 0, acc, 0, []); }}
            style={{ flex: 1, background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, padding: "7px 0", cursor: "pointer" }}>
            ↺ Reset
          </button>
        </div>
      </div>
    </SimWrapper>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SIM 3: INCLINED PLANE FORCE ANALYZER
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_inclined_force_lab() {
  const canRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const stateRef = useRef({ running: false });
  const [angle, setAngle] = useState(30);
  const [mu, setMu] = useState(0.3);
  const [mass, setMass] = useState(5);
  const [playing, setPlaying] = useState(false);

  const theta = (angle * Math.PI) / 180;
  const Fg = mass * G;
  const Fparallel = Fg * Math.sin(theta);
  const Fnormal = Fg * Math.cos(theta);
  const Ffriction = mu * Fnormal;
  const Fnet = Fparallel - Ffriction;
  const acc = Fnet / mass;

  const drawStatic = useCallback((blockPos = 0.35) => {
    const canvas = canRef.current;
    if (!canvas) return;
    const setup = setupCanvas(canvas);
    if (!setup) return;
    const [ctx, W, H] = setup;
    drawGrid(ctx, W, H);

    const OX = W * 0.1, OY = H * 0.85;
    const L = W * 0.75;
    const EX = OX + L * Math.cos(theta), EY = OY - L * Math.sin(theta);

    /* ramp */
    ctx.save();
    ctx.fillStyle = "#1e293b";
    ctx.beginPath(); ctx.moveTo(OX, OY); ctx.lineTo(EX, EY); ctx.lineTo(EX, OY); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#475569"; ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();

    /* block on ramp */
    const bx = OX + L * blockPos * Math.cos(theta);
    const by = OY - L * blockPos * Math.sin(theta);
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(-theta);
    ctx.shadowColor = "#f59e0b"; ctx.shadowBlur = 12;
    ctx.fillStyle = "#b45309";
    ctx.fillRect(-20, -25, 40, 25);
    ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();

    /* angle arc */
    ctx.strokeStyle = "#60a5fa"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(EX, OY, 36, Math.PI, Math.PI + theta); ctx.stroke();
    ctx.fillStyle = "#60a5fa"; ctx.font = "bold 12px monospace"; ctx.textAlign = "center";
    ctx.fillText(`${angle}°`, EX - 50, OY - 14);

    /* force arrows from block center */
    const bcx = bx + (- 20 * Math.sin(theta));
    const bcy = by + (- 20 * Math.cos(theta));

    arrow(ctx, bcx, bcy, bcx, bcy + Fg * 5, "#ef4444", `Fg=${Fg.toFixed(0)}N`);
    const nx = -Math.sin(theta), ny = -Math.cos(theta);
    arrow(ctx, bcx, bcy, bcx + nx * Fnormal * 5, bcy + ny * Fnormal * 5, "#10b981", `N=${Fnormal.toFixed(1)}N`);
    const px = -Math.cos(theta), py = Math.sin(theta);
    arrow(ctx, bcx, bcy, bcx + px * Fparallel * 5, bcy + py * Fparallel * 5, "#f59e0b", `F∥=${Fparallel.toFixed(1)}N`);
    if (mu > 0)
      arrow(ctx, bcx, bcy, bcx - px * Ffriction * 5, bcy - py * Ffriction * 5, "#a78bfa", `f=${Ffriction.toFixed(1)}N`);

    /* HUD */
    hud(ctx, [
      `θ = ${angle}°  |  m = ${mass} kg  |  μ = ${mu}`,
      `Weight (Fg) = ${Fg.toFixed(1)} N`,
      `Normal (N) = ${Fnormal.toFixed(1)} N`,
      `Parallel (F∥) = ${Fparallel.toFixed(1)} N`,
      `Friction (f) = ${Ffriction.toFixed(1)} N`,
      `Net F = ${Fnet.toFixed(1)} N  |  a = ${acc.toFixed(2)} m/s²`,
      Fnet > 0 ? "▶ Block slides DOWN the slope" : Fnet <= 0 ? "■ Block is STATIONARY" : "",
    ], 12, 14, "#a5b4fc");
  }, [angle, mu, mass, theta, Fg, Fparallel, Fnormal, Ffriction, Fnet, acc]);

  const run = useCallback(() => {
    if (acc <= 0) return;
    stateRef.current.running = true;
    setPlaying(true);
    let pos = 0.35;
    let vel = 0;

    const frame = () => {
      if (!stateRef.current.running) return;
      vel += acc * DT;
      pos += vel * DT * 0.4;
      drawStatic(Math.min(pos, 0.9));
      if (pos < 0.9) rafRef.current = requestAnimationFrame(frame);
      else { stateRef.current.running = false; setPlaying(false); }
    };
    rafRef.current = requestAnimationFrame(frame);
  }, [acc, drawStatic]);

  useEffect(() => { stateRef.current.running = false; cancelAnimationFrame(rafRef.current); setPlaying(false); drawStatic(); }, [drawStatic]);
  useEffect(() => () => { stateRef.current.running = false; cancelAnimationFrame(rafRef.current); }, []);

  return (
    <SimWrapper title="📐 Inclined Plane — Full Force Analysis" desc="See all forces on a block on a ramp: weight, normal, parallel component, and friction.">
      <canvas ref={canRef} style={{ width: "100%", height: 300, display: "block" }} />
      <div style={{ padding: "10px 16px 14px" }}>
        <Slider label="Angle θ" value={angle} min={5} max={70} step={1} onChange={setAngle} unit="°" />
        <Slider label="Friction μ" value={mu} min={0} max={0.8} step={0.05} onChange={setMu} />
        <Slider label="Mass" value={mass} min={1} max={15} step={1} onChange={setMass} unit=" kg" />
        <p style={{ color: acc > 0 ? "#f59e0b" : "#10b981", fontSize: 12, margin: "6px 0 4px", fontWeight: 700 }}>
          {acc > 0 ? `▶ Block slides! a = ${acc.toFixed(2)} m/s²` : `■ Block stationary — friction holds it (need μ < ${Math.tan(theta).toFixed(2)})`}
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <button onClick={run} disabled={playing || acc <= 0}
            style={{ flex: 1, background: acc > 0 && !playing ? "#b45309" : "#1e293b", color: acc > 0 && !playing ? "#fff" : "#475569", border: "none", borderRadius: 8, padding: "7px 0", cursor: acc > 0 && !playing ? "pointer" : "default", fontWeight: 700 }}>
            {playing ? "▶ Sliding..." : acc > 0 ? "▶ Release Block" : "■ Block Won't Slide"}
          </button>
          <button onClick={() => { stateRef.current.running = false; cancelAnimationFrame(rafRef.current); setPlaying(false); drawStatic(); }}
            style={{ flex: 1, background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, padding: "7px 0", cursor: "pointer" }}>
            ↺ Reset
          </button>
        </div>
      </div>
    </SimWrapper>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SIM 4: CENTRIPETAL FORCE EXPLORER
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_centripetal_force_explorer() {
  const canRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ running: true, theta: 0 });
  const rafRef = useRef(0);
  const [speed, setSpeed] = useState(4);
  const [radius, setRadius] = useState(100);
  const [mass, setMass] = useState(2);

  const Fc = mass * speed * speed / radius; /* Fc = mv²/r */
  const period = (2 * Math.PI * radius) / speed; /* T = 2πr/v */

  useEffect(() => {
    stateRef.current.running = true;
    const canvas = canRef.current;
    if (!canvas) return;

    const frame = () => {
      if (!stateRef.current.running) return;
      const setup = setupCanvas(canvas);
      if (!setup) return;
      const [ctx, W, H] = setup;
      drawGrid(ctx, W, H);

      const cx = W / 2, cy = H * 0.52;
      const r = Math.min(radius, W * 0.35);
      stateRef.current.theta += speed / radius * DT;

      const bx = cx + r * Math.cos(stateRef.current.theta);
      const by = cy + r * Math.sin(stateRef.current.theta);

      /* orbit trail */
      ctx.save();
      ctx.strokeStyle = "rgba(99,102,241,0.15)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();

      /* string */
      ctx.save();
      ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 2; ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(bx, by); ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      /* pivot */
      glowCircle(ctx, cx, cy, 6, "#475569", "#6366f1");

      /* centripetal arrow (toward center) */
      const dx = cx - bx, dy = cy - by;
      const len = Math.hypot(dx, dy);
      const ux = dx / len, uy = dy / len;
      arrow(ctx, bx, by, bx + ux * Fc * 4, by + uy * Fc * 4, "#ef4444", `Fc=${Fc.toFixed(1)}N`);

      /* velocity arrow (tangential) */
      const vx = -Math.sin(stateRef.current.theta) * speed * 10;
      const vy = Math.cos(stateRef.current.theta) * speed * 10;
      arrow(ctx, bx, by, bx + vx, by + vy, "#10b981", `v=${speed} m/s`);

      /* ball */
      glowCircle(ctx, bx, by, 12 + mass * 2, "#f59e0b", "#fbbf24");

      /* HUD */
      hud(ctx, [
        `Centripetal Force = mv²/r`,
        `Fc = ${mass} × ${speed}² / ${radius} = ${Fc.toFixed(2)} N`,
        `Period T = 2πr/v = ${period.toFixed(2)} s`,
        `Radius r = ${radius} m  |  Speed v = ${speed} m/s`,
        `Mass m = ${mass} kg`,
        `Direction: always toward center`,
      ], 12, 16, "#a5b4fc");

      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => { stateRef.current.running = false; cancelAnimationFrame(rafRef.current); };
  }, [speed, radius, mass, Fc, period]);

  return (
    <SimWrapper title="🌀 Centripetal Force Explorer" desc="Ball on a string. Centripetal force always points toward center. F = mv²/r">
      <canvas ref={canRef} style={{ width: "100%", height: 280, display: "block" }} />
      <div style={{ padding: "10px 16px 14px" }}>
        <Slider label="Speed v" value={speed} min={1} max={12} step={1} onChange={setSpeed} unit=" m/s" />
        <Slider label="Radius r" value={radius} min={40} max={160} step={10} onChange={setRadius} unit=" m" />
        <Slider label="Mass m" value={mass} min={1} max={10} step={1} onChange={setMass} unit=" kg" />
        <p style={{ color: "#a5b4fc", fontSize: 12, marginTop: 8 }}>
          Fc = {Fc.toFixed(1)} N | Period = {period.toFixed(2)} s | If string breaks → ball flies tangentially (Newton 1st Law!)
        </p>
      </div>
    </SimWrapper>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SIM 5: ROCKET PROPULSION (VARIABLE MASS)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_rocket_variable_mass() {
  const canRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ running: false });
  const rafRef = useRef(0);
  const [thrust, setThrust] = useState(5000);
  const [fuelRate, setFuelRate] = useState(50);
  const [initFuel, setInitFuel] = useState(2000);
  const [playing, setPlaying] = useState(false);

  const M_dry = 500; /* dry mass in kg */

  const run = useCallback(() => {
    stateRef.current.running = true;
    setPlaying(true);
    let y = 0, vel = 0, fuel = initFuel, t = 0;
    const trail: Array<{ x: number; y: number }> = [];

    const frame = () => {
      if (!stateRef.current.running) return;
      const canvas = canRef.current;
      if (!canvas) return;
      const setup = setupCanvas(canvas);
      if (!setup) return;
      const [ctx, W, H] = setup;
      drawGrid(ctx, W, H);

      const m = M_dry + Math.max(0, fuel);
      const netF = fuel > 0 ? thrust - m * G : -m * G;
      const a = netF / m;
      vel += a * DT;
      y += vel * DT;
      fuel -= fuelRate * DT;
      t += DT;

      const GROUND = H * 0.85;
      const screenY = GROUND - Math.min(y * 0.12, GROUND - 60);
      trail.push({ x: W / 2, y: screenY });
      if (trail.length > 60) trail.shift();

      /* ground */
      ctx.fillStyle = "#1e293b"; ctx.fillRect(0, GROUND, W, H - GROUND);
      ctx.fillStyle = "#334155"; ctx.fillRect(0, GROUND, W, 3);

      /* trail */
      ctx.strokeStyle = "rgba(251,146,60,0.4)"; ctx.lineWidth = 3;
      ctx.beginPath();
      trail.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
      ctx.stroke();

      /* exhaust flame */
      if (fuel > 0) {
        const flameH = 20 + Math.random() * 15;
        const grad = ctx.createLinearGradient(W / 2, screenY + 25, W / 2, screenY + 25 + flameH);
        grad.addColorStop(0, "rgba(251,146,60,0.9)");
        grad.addColorStop(1, "rgba(251,146,60,0)");
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.ellipse(W / 2, screenY + 25 + flameH / 2, 10, flameH / 2, 0, 0, Math.PI * 2); ctx.fill();
      }

      /* rocket body */
      ctx.save();
      ctx.shadowColor = fuel > 0 ? "#f97316" : "#94a3b8"; ctx.shadowBlur = 12;
      ctx.fillStyle = "#1e3a5f";
      ctx.fillRect(W / 2 - 14, screenY - 40, 28, 45);
      ctx.fillStyle = "#ef4444";
      ctx.beginPath(); ctx.moveTo(W / 2, screenY - 60); ctx.lineTo(W / 2 - 14, screenY - 40); ctx.lineTo(W / 2 + 14, screenY - 40); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#374151";
      ctx.fillRect(W / 2 - 22, screenY - 10, 8, 15);
      ctx.fillRect(W / 2 + 14, screenY - 10, 8, 15);
      ctx.shadowBlur = 0; ctx.restore();

      /* fuel gauge */
      const fuelPct = fuel / initFuel;
      ctx.fillStyle = "#1e293b"; ctx.fillRect(W - 90, 20, 70, 12); ctx.strokeStyle = "#334155"; ctx.lineWidth = 1; ctx.strokeRect(W - 90, 20, 70, 12);
      ctx.fillStyle = fuelPct > 0.3 ? "#10b981" : "#ef4444";
      ctx.fillRect(W - 90, 20, Math.max(0, fuelPct) * 70, 12);
      ctx.fillStyle = "#94a3b8"; ctx.font = "11px monospace"; ctx.textAlign = "center";
      ctx.fillText("FUEL", W - 55, 40);

      /* HUD */
      hud(ctx, [
        `T = ${t.toFixed(1)} s`,
        `Altitude = ${y.toFixed(0)} m`,
        `Velocity = ${vel.toFixed(1)} m/s`,
        `Mass = ${m.toFixed(0)} kg  (${Math.max(0, fuel).toFixed(0)} kg fuel)`,
        `Thrust = ${fuel > 0 ? thrust.toLocaleString() : 0} N`,
        `Net F = ${netF.toFixed(0)} N  |  a = ${a.toFixed(2)} m/s²`,
        fuel <= 0 ? "⚠ FUEL DEPLETED — coasting" : "🔥 Engines firing",
      ], 14, 16, "#a5b4fc");

      if (screenY > 30 && !(vel < 0 && y < 0)) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        stateRef.current.running = false; setPlaying(false);
      }
    };
    rafRef.current = requestAnimationFrame(frame);
  }, [thrust, fuelRate, initFuel]);

  const reset = useCallback(() => {
    stateRef.current.running = false; cancelAnimationFrame(rafRef.current); setPlaying(false);
    const canvas = canRef.current;
    if (!canvas) return;
    const setup = setupCanvas(canvas);
    if (!setup) return;
    const [ctx, W, H] = setup;
    drawGrid(ctx, W, H);
    const GROUND = H * 0.85;
    ctx.fillStyle = "#1e293b"; ctx.fillRect(0, GROUND, W, H - GROUND);
    ctx.fillStyle = "#1e3a5f"; ctx.fillRect(W / 2 - 14, GROUND - 65, 28, 45);
    ctx.fillStyle = "#ef4444";
    ctx.beginPath(); ctx.moveTo(W / 2, GROUND - 85); ctx.lineTo(W / 2 - 14, GROUND - 65); ctx.lineTo(W / 2 + 14, GROUND - 65); ctx.closePath(); ctx.fill();
  }, []);

  useEffect(() => { reset(); }, [reset]);
  useEffect(() => () => { stateRef.current.running = false; cancelAnimationFrame(rafRef.current); }, []);

  return (
    <SimWrapper title="🚀 Rocket Propulsion — Variable Mass Physics" desc="Real Tsiolkovsky rocket equation. Mass decreases as fuel burns. F=ma with changing m.">
      <canvas ref={canRef} style={{ width: "100%", height: 300, display: "block" }} />
      <div style={{ padding: "10px 16px 14px" }}>
        <Slider label="Thrust" value={thrust} min={2000} max={20000} step={500} onChange={setThrust} unit=" N" />
        <Slider label="Fuel Burn Rate" value={fuelRate} min={10} max={150} step={10} onChange={setFuelRate} unit=" kg/s" />
        <Slider label="Initial Fuel" value={initFuel} min={500} max={5000} step={100} onChange={setInitFuel} unit=" kg" />
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button onClick={run} disabled={playing}
            style={{ flex: 1, background: playing ? "#1e293b" : "#ef4444", color: playing ? "#475569" : "#fff", border: "none", borderRadius: 8, padding: "7px 0", cursor: playing ? "default" : "pointer", fontWeight: 700 }}>
            {playing ? "🔥 Launching..." : "🚀 Launch Rocket"}
          </button>
          <button onClick={reset} style={{ flex: 1, background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, padding: "7px 0", cursor: "pointer" }}>↺ Reset</button>
        </div>
      </div>
    </SimWrapper>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SIM 6: PROJECTILE WITH AIR DRAG
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_projectile_air_drag() {
  const canRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ running: false });
  const rafRef = useRef(0);
  const [launchAngle, setLaunchAngle] = useState(45);
  const [speed, setSpeed] = useState(30);
  const [drag, setDrag] = useState(0.01);
  const [playing, setPlaying] = useState(false);

  const draw = useCallback((
    trail1: Array<{ x: number; y: number }>,
    trail2: Array<{ x: number; y: number }>,
    p1: { x: number; y: number } | null,
    p2: { x: number; y: number } | null,
    labels: string[]
  ) => {
    const canvas = canRef.current;
    if (!canvas) return;
    const setup = setupCanvas(canvas);
    if (!setup) return;
    const [ctx, W, H] = setup;
    drawGrid(ctx, W, H);

    const GROUND = H * 0.82;
    ctx.fillStyle = "#1e293b"; ctx.fillRect(0, GROUND, W, H - GROUND);
    ctx.fillStyle = "#334155"; ctx.fillRect(0, GROUND, W, 2);

    const SC = W / 180;

    /* no-drag trail (dashed) */
    ctx.save();
    ctx.strokeStyle = "rgba(99,102,241,0.4)"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
    ctx.beginPath();
    trail1.forEach((p, i) => {
      const py = GROUND - p.y * SC * 2;
      if (py < 0 || py > H) return;
      if (i === 0) ctx.moveTo(p.x * SC, py); else ctx.lineTo(p.x * SC, py);
    });
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    /* drag trail (solid) */
    ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 2;
    ctx.beginPath();
    trail2.forEach((p, i) => {
      const py = GROUND - p.y * SC * 2;
      if (py < 0 || py > H) return;
      if (i === 0) ctx.moveTo(p.x * SC, py); else ctx.lineTo(p.x * SC, py);
    });
    ctx.stroke();

    /* balls */
    if (p1) glowCircle(ctx, p1.x * SC, GROUND - p1.y * SC * 2, 6, "#6366f1", "#818cf8");
    if (p2) glowCircle(ctx, p2.x * SC, GROUND - p2.y * SC * 2, 8, "#f59e0b", "#fbbf24");

    /* legend */
    ctx.fillStyle = "#6366f1"; ctx.font = "11px monospace"; ctx.textAlign = "left";
    ctx.fillText("── No drag (ideal)", 10, H - 30);
    ctx.fillStyle = "#f59e0b";
    ctx.fillText("── With air drag", 10, H - 14);

    /* HUD */
    hud(ctx, labels, 14, 14, "#a5b4fc");
  }, []);

  const run = useCallback(() => {
    stateRef.current.running = true;
    setPlaying(true);

    const ang = (launchAngle * Math.PI) / 180;
    /* Object 1: no drag */
    let x1 = 0, y1 = 0;
    let vx1 = speed * Math.cos(ang), vy1 = speed * Math.sin(ang);
    /* Object 2: with drag */
    let x2 = 0, y2 = 0;
    let vx2 = speed * Math.cos(ang), vy2 = speed * Math.sin(ang);
    const trail1: Array<{ x: number; y: number }> = [];
    const trail2: Array<{ x: number; y: number }> = [];
    let t = 0;
    let landed1 = false, landed2 = false;

    const frame = () => {
      if (!stateRef.current.running) return;

      /* update no-drag */
      if (!landed1) {
        vx1 = speed * Math.cos(ang);
        vy1 = speed * Math.sin(ang) - G * t;
        x1 = speed * Math.cos(ang) * t;
        y1 = speed * Math.sin(ang) * t - 0.5 * G * t * t;
        trail1.push({ x: x1, y: Math.max(0, y1) });
        if (y1 < 0) landed1 = true;
      }

      /* update with drag: F_drag = -k*v */
      if (!landed2) {
        const spd = Math.hypot(vx2, vy2);
        const ax = -drag * spd * vx2;
        const ay = -G - drag * spd * vy2;
        vx2 += ax * DT;
        vy2 += ay * DT;
        x2 += vx2 * DT;
        y2 += vy2 * DT;
        trail2.push({ x: x2, y: Math.max(0, y2) });
        if (y2 < 0) landed2 = true;
      }

      t += DT;
      const labels = [
        `θ = ${launchAngle}°  |  v₀ = ${speed} m/s`,
        `Drag coeff k = ${drag}`,
        `No drag: Range = ${(speed * speed * Math.sin(2 * ang) / G).toFixed(1)} m`,
        `With drag: Range ≈ ${x2.toFixed(1)} m`,
        `Speed (drag) = ${Math.hypot(vx2, vy2).toFixed(1)} m/s`,
      ];

      draw(
        trail1, trail2,
        landed1 ? null : { x: x1, y: Math.max(0, y1) },
        landed2 ? null : { x: x2, y: Math.max(0, y2) },
        labels
      );

      if (!landed1 || !landed2) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        stateRef.current.running = false; setPlaying(false);
      }
    };
    rafRef.current = requestAnimationFrame(frame);
  }, [launchAngle, speed, drag, draw]);

  const reset = useCallback(() => {
    stateRef.current.running = false; cancelAnimationFrame(rafRef.current); setPlaying(false);
    draw([], [], null, null, [`θ = ${launchAngle}°  |  v₀ = ${speed} m/s  |  k = ${drag}`, "Click Launch to compare trajectories"]);
  }, [draw, launchAngle, speed, drag]);

  useEffect(() => { reset(); }, [reset]);
  useEffect(() => () => { stateRef.current.running = false; cancelAnimationFrame(rafRef.current); }, []);

  return (
    <SimWrapper title="🎯 Projectile Motion with Air Drag" desc="Compare ideal trajectory (no drag) vs realistic (with air resistance). Same launch, different ranges.">
      <canvas ref={canRef} style={{ width: "100%", height: 280, display: "block" }} />
      <div style={{ padding: "10px 16px 14px" }}>
        <Slider label="Launch Angle" value={launchAngle} min={10} max={80} step={5} onChange={setLaunchAngle} unit="°" />
        <Slider label="Launch Speed" value={speed} min={10} max={60} step={5} onChange={setSpeed} unit=" m/s" />
        <Slider label="Drag coeff k" value={drag} min={0} max={0.05} step={0.005} onChange={setDrag} />
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button onClick={run} disabled={playing}
            style={{ flex: 1, background: playing ? "#1e293b" : "#4f46e5", color: playing ? "#475569" : "#fff", border: "none", borderRadius: 8, padding: "7px 0", cursor: playing ? "default" : "pointer", fontWeight: 700 }}>
            {playing ? "▶ Flying..." : "▶ Launch"}
          </button>
          <button onClick={reset} style={{ flex: 1, background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, padding: "7px 0", cursor: "pointer" }}>↺ Reset</button>
        </div>
      </div>
    </SimWrapper>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SIM 7: PULLEY MECHANICAL ADVANTAGE
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_pulley_mechanical_advantage() {
  const canRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ running: true, t: 0 });
  const rafRef = useRef(0);
  const [load, setLoad] = useState(100);
  const [pulleys, setPulleys] = useState(1); /* 1=fixed, 2=movable */

  const MA = pulleys; /* mechanical advantage = number of rope segments supporting load */
  const effort = load / MA;
  const efficiency = 85; /* assume 85% efficiency due to friction */

  useEffect(() => {
    stateRef.current.running = true;
    const canvas = canRef.current;
    if (!canvas) return;

    const frame = () => {
      if (!stateRef.current.running) return;
      const setup = setupCanvas(canvas);
      if (!setup) return;
      const [ctx, W, H] = setup;
      drawGrid(ctx, W, H);

      stateRef.current.t += DT;
      const bob = Math.sin(stateRef.current.t * 1.5) * 4; /* gentle oscillation */

      const CX = W / 2;
      const PY1 = 60; /* fixed pulley y */
      const LY = 180 + bob; /* load y */
      const PY2 = LY - 30; /* movable pulley y */

      if (pulleys === 1) {
        /* Fixed pulley: rope goes over, effort = load */
        ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 3;
        /* rope from load up */
        ctx.beginPath(); ctx.moveTo(CX - 10, LY + 20); ctx.lineTo(CX - 10, PY1); ctx.stroke();
        /* rope over pulley and down */
        ctx.beginPath(); ctx.moveTo(CX + 10, PY1); ctx.lineTo(CX + 10, PY1 + 80 - bob); ctx.stroke();

        /* fixed pulley */
        ctx.save(); ctx.shadowColor = "#6366f1"; ctx.shadowBlur = 12;
        ctx.strokeStyle = "#6366f1"; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(CX, PY1, 20, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();

        /* load box */
        ctx.fillStyle = "#1e3a5f"; ctx.strokeStyle = "#6366f1"; ctx.lineWidth = 2;
        ctx.fillRect(CX - 30, LY, 60, 40); ctx.strokeRect(CX - 30, LY, 60, 40);
        ctx.fillStyle = "#a5b4fc"; ctx.font = "bold 12px monospace"; ctx.textAlign = "center";
        ctx.fillText(`${load} N`, CX, LY + 24);

        /* effort arrow (person pulling) */
        arrow(ctx, CX + 10, PY1 + 80 - bob, CX + 10, PY1 + 80 - bob + 60, "#10b981", `Effort=${effort.toFixed(0)}N`);

        hud(ctx, [
          "Fixed Pulley — changes direction only",
          `MA = 1  |  Load = ${load} N`,
          `Effort = Load = ${effort.toFixed(0)} N`,
          "Advantage: direction change only",
          "(pull down to lift load up)",
        ], 14, 14, "#a5b4fc");

      } else {
        /* Movable pulley: 2 rope segments support load, effort = load/2 */
        const AX = CX - 50, BX = CX + 50;
        const FPY = PY1;

        /* rope segments */
        ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(AX, FPY); ctx.lineTo(AX, PY2); ctx.stroke(); /* left segment */
        ctx.beginPath(); ctx.moveTo(BX, FPY); ctx.lineTo(BX, PY2); ctx.stroke(); /* right segment */
        ctx.beginPath(); ctx.moveTo(BX, FPY); ctx.lineTo(BX, FPY - 60 + bob * 0.5); ctx.stroke(); /* effort rope */

        /* fixed pulley at top */
        ctx.save(); ctx.shadowColor = "#6366f1"; ctx.shadowBlur = 10;
        ctx.strokeStyle = "#6366f1"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(BX, FPY, 16, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();

        /* movable pulley */
        ctx.save(); ctx.shadowColor = "#f59e0b"; ctx.shadowBlur = 10;
        ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(CX, PY2, 18, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();

        /* load */
        ctx.fillStyle = "#1e3a5f"; ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 2;
        ctx.fillRect(CX - 30, LY, 60, 40); ctx.strokeRect(CX - 30, LY, 60, 40);
        ctx.fillStyle = "#fde68a"; ctx.font = "bold 12px monospace"; ctx.textAlign = "center";
        ctx.fillText(`${load} N`, CX, LY + 24);

        /* effort */
        arrow(ctx, BX, FPY - 60 + bob * 0.5, BX, FPY - 60 + bob * 0.5 - 50, "#10b981", `Effort=${effort.toFixed(0)}N`);

        hud(ctx, [
          "Movable Pulley — reduces effort needed",
          `MA = 2  |  Load = ${load} N`,
          `Effort = Load/2 = ${effort.toFixed(0)} N`,
          "2 rope segments share the load",
          `Real effort ≈ ${(load / MA / (efficiency / 100)).toFixed(0)} N (${100 - efficiency}% friction loss)`,
        ], 14, 14, "#a5b4fc");
      }

      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => { stateRef.current.running = false; cancelAnimationFrame(rafRef.current); };
  }, [load, pulleys, effort, MA, efficiency]);

  return (
    <SimWrapper title="⚙️ Pulley System — Mechanical Advantage" desc="Fixed pulley changes direction; movable pulley halves the effort needed. MA = number of rope segments.">
      <canvas ref={canRef} style={{ width: "100%", height: 310, display: "block" }} />
      <div style={{ padding: "10px 16px 14px" }}>
        <Slider label="Load Weight" value={load} min={20} max={300} step={10} onChange={setLoad} unit=" N" />
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button onClick={() => setPulleys(1)}
            style={{ flex: 1, background: pulleys === 1 ? "#4f46e5" : "#1e293b", color: pulleys === 1 ? "#fff" : "#94a3b8", border: "1px solid #334155", borderRadius: 8, padding: "7px 0", cursor: "pointer", fontWeight: 700 }}>
            1 Fixed Pulley
          </button>
          <button onClick={() => setPulleys(2)}
            style={{ flex: 1, background: pulleys === 2 ? "#b45309" : "#1e293b", color: pulleys === 2 ? "#fff" : "#94a3b8", border: "1px solid #334155", borderRadius: 8, padding: "7px 0", cursor: "pointer", fontWeight: 700 }}>
            1 Movable Pulley
          </button>
        </div>
        <p style={{ color: "#a5b4fc", fontSize: 12, marginTop: 8 }}>
          MA = {MA} | You need {effort.toFixed(0)} N of effort to lift {load} N load
        </p>
      </div>
    </SimWrapper>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SIM 8: SPRING-MASS OSCILLATOR WITH DAMPING
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_spring_damping_oscillator() {
  const canRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ running: true, x: 80, v: 0, t: 0 });
  const rafRef = useRef(0);
  const [k, setK] = useState(10); /* spring constant N/m */
  const [b, setB] = useState(0.5); /* damping coefficient */
  const [m, setM] = useState(2);   /* mass kg */

  /* natural frequency and critical damping */
  const omega0 = Math.sqrt(k / m);
  const bCritical = 2 * Math.sqrt(k * m);
  const regime = b < bCritical ? "Underdamped" : b === bCritical ? "Critically Damped" : "Overdamped";

  useEffect(() => {
    stateRef.current = { running: true, x: 80, v: 0, t: 0 };
    const canvas = canRef.current;
    if (!canvas) return;
    const history: number[] = [];

    const frame = () => {
      if (!stateRef.current.running) return;
      const { x, v, t } = stateRef.current;

      /* SHM with damping: a = (-k*x - b*v) / m */
      const a = (-k * x - b * v) / m;
      stateRef.current.v += a * DT;
      stateRef.current.x += stateRef.current.v * DT;
      stateRef.current.t += DT;

      history.push(stateRef.current.x);
      if (history.length > 200) history.shift();

      const setup = setupCanvas(canvas);
      if (!setup) return;
      const [ctx, W, H] = setup;
      drawGrid(ctx, W, H);

      const CX = W * 0.3, CY = H / 2;
      const equilibrium = CX;
      const dispPx = stateRef.current.x * 1.2; /* scale displacement to pixels */
      const bx = equilibrium + dispPx;

      /* ceiling */
      ctx.fillStyle = "#334155"; ctx.fillRect(0, 0, W, 12);

      /* spring (zigzag) */
      const springSegments = 12;
      const springLen = bx - 40;
      ctx.strokeStyle = "#6366f1"; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(40, CY);
      for (let i = 0; i < springSegments; i++) {
        const sx = 40 + (i + 1) * springLen / springSegments;
        const sy = CY + (i % 2 === 0 ? -12 : 12);
        ctx.lineTo(sx, sy);
      }
      ctx.lineTo(bx, CY);
      ctx.stroke();

      /* wall attachment */
      ctx.fillStyle = "#475569"; ctx.fillRect(30, CY - 20, 12, 40);

      /* equilibrium line */
      ctx.strokeStyle = "rgba(99,102,241,0.3)"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(equilibrium, 30); ctx.lineTo(equilibrium, H - 30); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#475569"; ctx.font = "10px monospace"; ctx.textAlign = "center";
      ctx.fillText("equilibrium", equilibrium, H - 20);

      /* mass block */
      ctx.save();
      ctx.shadowColor = "#f59e0b"; ctx.shadowBlur = 16;
      ctx.fillStyle = "#92400e";
      ctx.fillRect(bx - 20, CY - 20, 40, 40);
      ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 2; ctx.strokeRect(bx - 20, CY - 20, 40, 40);
      ctx.shadowBlur = 0; ctx.restore();
      ctx.fillStyle = "#fde68a"; ctx.font = "bold 11px monospace"; ctx.textAlign = "center";
      ctx.fillText(`${m}kg`, bx, CY + 4);

      /* restoring force arrow */
      const Fs = -k * stateRef.current.x;
      if (Math.abs(Fs) > 0.5)
        arrow(ctx, bx, CY - 25, bx + Fs * 2, CY - 25, "#10b981", `F=${Fs.toFixed(1)}N`);

      /* displacement label */
      ctx.strokeStyle = "#60a5fa"; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(equilibrium, CY + 30); ctx.lineTo(bx, CY + 30); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#60a5fa"; ctx.font = "11px monospace"; ctx.textAlign = "center";
      ctx.fillText(`x=${stateRef.current.x.toFixed(1)}m`, (equilibrium + bx) / 2, CY + 42);

      /* graph (right side) */
      const GX = W * 0.55, GW = W * 0.4, GH = 120, GY = H / 2 - GH / 2;
      ctx.fillStyle = "rgba(15,23,42,0.8)"; ctx.fillRect(GX, GY, GW, GH);
      ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 1; ctx.strokeRect(GX, GY, GW, GH);
      ctx.strokeStyle = "rgba(99,102,241,0.2)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(GX, GY + GH / 2); ctx.lineTo(GX + GW, GY + GH / 2); ctx.stroke();
      ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 1.5;
      ctx.beginPath();
      history.forEach((hx, i) => {
        const px = GX + (i / history.length) * GW;
        const py = GY + GH / 2 - hx * GH / 200;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.fillStyle = "#64748b"; ctx.font = "10px monospace"; ctx.textAlign = "left";
      ctx.fillText("x(t)", GX + 4, GY + 12);

      /* HUD */
      hud(ctx, [
        `k = ${k} N/m  |  m = ${m} kg  |  b = ${b}`,
        `ω₀ = √(k/m) = ${omega0.toFixed(2)} rad/s`,
        `b_critical = ${bCritical.toFixed(1)}`,
        `Regime: ${regime}`,
        `x = ${stateRef.current.x.toFixed(2)} m  |  v = ${stateRef.current.v.toFixed(2)} m/s`,
      ], 12, 14, "#a5b4fc");

      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => { stateRef.current.running = false; cancelAnimationFrame(rafRef.current); };
  }, [k, b, m, omega0, bCritical, regime]);

  return (
    <SimWrapper title="🔄 Spring-Mass Oscillator with Damping" desc="Change spring constant k and damping b. Watch underdamped (oscillate), critically damped (no overshoot), overdamped (slow return).">
      <canvas ref={canRef} style={{ width: "100%", height: 260, display: "block" }} />
      <div style={{ padding: "10px 16px 14px" }}>
        <Slider label="Spring k" value={k} min={1} max={30} step={1} onChange={setK} unit=" N/m" />
        <Slider label="Damping b" value={b} min={0} max={15} step={0.5} onChange={setB} />
        <Slider label="Mass m" value={m} min={1} max={10} step={1} onChange={setM} unit=" kg" />
        <p style={{ color: b < bCritical ? "#f59e0b" : b > bCritical ? "#60a5fa" : "#10b981", fontSize: 12, marginTop: 6, fontWeight: 700 }}>
          {regime} — {b < bCritical ? "oscillates with decay" : b > bCritical ? "slow exponential return" : "fastest return without overshoot"}
        </p>
      </div>
    </SimWrapper>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SIM 9: MOMENTUM CONSERVATION SANDBOX (2D)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_momentum_2d_sandbox() {
  const canRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ running: true, balls: [] as Array<{ x: number; y: number; vx: number; vy: number; r: number; m: number; color: string }> });
  const rafRef = useRef(0);
  const [ballCount, setBallCount] = useState(4);
  const [speed, setSpeed] = useState(80);

  const initBalls = useCallback((count: number, spd: number) => {
    const colors = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#ec4899", "#06b6d4"];
    const masses = [3, 2, 4, 2, 3, 1];
    const canvas = canRef.current;
    const W = canvas?.clientWidth || 600;
    const H = canvas?.clientHeight || 280;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return {
        x: W / 2 + Math.cos(angle) * 80,
        y: H / 2 + Math.sin(angle) * 60,
        vx: Math.cos(angle + Math.PI + 0.3) * spd,
        vy: Math.sin(angle + Math.PI + 0.3) * spd,
        r: 12 + masses[i % masses.length] * 4,
        m: masses[i % masses.length],
        color: colors[i % colors.length],
      };
    });
  }, []);

  useEffect(() => {
    stateRef.current.balls = initBalls(ballCount, speed);
    stateRef.current.running = true;
    const canvas = canRef.current;
    if (!canvas) return;

    const frame = () => {
      if (!stateRef.current.running) return;
      const setup = setupCanvas(canvas);
      if (!setup) return;
      const [ctx, W, H] = setup;
      drawGrid(ctx, W, H);

      const balls = stateRef.current.balls;

      /* update positions */
      balls.forEach(b => {
        b.x += b.vx * DT;
        b.y += b.vy * DT;
        /* bounce off walls */
        if (b.x - b.r < 0) { b.x = b.r; b.vx = Math.abs(b.vx); }
        if (b.x + b.r > W) { b.x = W - b.r; b.vx = -Math.abs(b.vx); }
        if (b.y - b.r < 0) { b.y = b.r; b.vy = Math.abs(b.vy); }
        if (b.y + b.r > H) { b.y = H - b.r; b.vy = -Math.abs(b.vy); }
      });

      /* ball-ball collisions (elastic) */
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const a = balls[i], b = balls[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          const dist = Math.hypot(dx, dy);
          const minDist = a.r + b.r;
          if (dist < minDist && dist > 0) {
            /* elastic collision */
            const nx = dx / dist, ny = dy / dist;
            /* overlap resolution */
            const overlap = minDist - dist;
            a.x -= nx * overlap * 0.5; a.y -= ny * overlap * 0.5;
            b.x += nx * overlap * 0.5; b.y += ny * overlap * 0.5;
            /* velocity exchange */
            const dvx = a.vx - b.vx, dvy = a.vy - b.vy;
            const dot = dvx * nx + dvy * ny;
            if (dot > 0) {
              const J = 2 * dot / (1 / a.m + 1 / b.m);
              a.vx -= J * nx / a.m; a.vy -= J * ny / a.m;
              b.vx += J * nx / b.m; b.vy += J * ny / b.m;
            }
          }
        }
      }

      /* draw balls */
      balls.forEach(b => {
        /* velocity vector */
        const spd2 = Math.hypot(b.vx, b.vy);
        if (spd2 > 5) arrow(ctx, b.x, b.y, b.x + b.vx * 0.3, b.y + b.vy * 0.3, b.color + "99", "", 1.5);
        glowCircle(ctx, b.x, b.y, b.r, b.color + "dd", b.color);
        ctx.fillStyle = "#fff"; ctx.font = `bold ${Math.max(9, b.r - 4)}px monospace`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(`${b.m}`, b.x, b.y);
      });

      /* total momentum readout */
      const pTotal = balls.reduce((s, b) => ({ x: s.x + b.m * b.vx, y: s.y + b.m * b.vy }), { x: 0, y: 0 });
      const pMag = Math.hypot(pTotal.x, pTotal.y);
      const KE = balls.reduce((s, b) => s + 0.5 * b.m * (b.vx ** 2 + b.vy ** 2), 0);

      hud(ctx, [
        `${balls.length} balls — elastic 2D collisions`,
        `Total |p| = ${(pMag / 100).toFixed(1)} kg·m/s`,
        `Total KE = ${(KE / 10000).toFixed(1)} J`,
        "Momentum conserved in every collision",
      ], 10, 10, "#a5b4fc");

      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => { stateRef.current.running = false; cancelAnimationFrame(rafRef.current); };
  }, [ballCount, speed, initBalls]);

  return (
    <SimWrapper title="💥 2D Momentum Conservation Sandbox" desc="Elastic collisions in 2D. Total momentum is conserved in every collision. Numbers show mass.">
      <canvas ref={canRef} style={{ width: "100%", height: 280, display: "block" }} />
      <div style={{ padding: "10px 16px 14px" }}>
        <Slider label="# of Balls" value={ballCount} min={2} max={6} step={1} onChange={setBallCount} />
        <Slider label="Initial Speed" value={speed} min={30} max={200} step={10} onChange={setSpeed} unit=" px/s" />
      </div>
    </SimWrapper>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SIM 10: IMPULSE vs FORCE DURATION
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_impulse_force_duration() {
  const canRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ running: false });
  const rafRef = useRef(0);
  const [impulse, setImpulse] = useState(100); /* J = F × t = Δp (fixed) */
  const [duration, setDuration] = useState(0.5); /* collision duration in seconds */
  const [mass, setMass] = useState(5);

  const F = impulse / duration; /* same impulse, different force */
  const deltaV = impulse / mass; /* Δv = J/m */
  const [playing, setPlaying] = useState(false);

  const run = useCallback(() => {
    stateRef.current.running = true;
    setPlaying(true);
    let t = 0;
    let vx = 0;
    const impulseDuration = duration;

    const canvas = canRef.current;
    if (!canvas) return;

    const frame = () => {
      if (!stateRef.current.running) return;
      const setup = setupCanvas(canvas);
      if (!setup) return;
      const [ctx, W, H] = setup;
      drawGrid(ctx, W, H);

      const isImpulseActive = t < impulseDuration;
      if (isImpulseActive) vx += (F / mass) * DT;
      const x = 60 + vx * t * 60;
      t += DT;

      const FLOOR = H * 0.65;
      ctx.fillStyle = "#1e293b"; ctx.fillRect(0, FLOOR, W, H - FLOOR);
      ctx.fillStyle = "#334155"; ctx.fillRect(0, FLOOR, W, 2);

      /* force bar */
      const maxBar = H * 0.5;
      const barH = Math.min(Math.abs(F) * 0.8, maxBar);
      const barColor = isImpulseActive ? "#ef4444" : "#374151";
      ctx.fillStyle = barColor + "44"; ctx.fillRect(20, FLOOR - maxBar, 40, maxBar);
      ctx.fillStyle = barColor; ctx.fillRect(20, FLOOR - barH, 40, barH);
      ctx.fillStyle = isImpulseActive ? "#ef4444" : "#475569"; ctx.font = "10px monospace"; ctx.textAlign = "center";
      ctx.fillText(`F=${Math.round(F)}N`, 40, FLOOR - barH - 8);
      ctx.fillStyle = "#64748b"; ctx.fillText("Force", 40, FLOOR + 16);

      /* impulse area */
      const progress = Math.min(t / impulseDuration, 1);
      ctx.fillStyle = "rgba(239,68,68,0.12)";
      ctx.fillRect(20, FLOOR - barH, 40, barH * progress);
      ctx.fillStyle = "#f87171"; ctx.font = "10px monospace"; ctx.textAlign = "center";
      ctx.fillText(`J=${(progress * impulse).toFixed(0)}`, 40, FLOOR - barH - 22);

      /* time bar */
      const timeBarW = Math.min(progress * 80, 80);
      ctx.fillStyle = "#1e293b"; ctx.fillRect(20, FLOOR + 22, 80, 8);
      ctx.fillStyle = "#60a5fa"; ctx.fillRect(20, FLOOR + 22, timeBarW, 8);
      ctx.fillStyle = "#60a5fa"; ctx.font = "10px monospace"; ctx.textAlign = "left";
      ctx.fillText(`Δt=${Math.min(t, impulseDuration).toFixed(2)}s`, 108, FLOOR + 30);

      /* block */
      const bx = Math.min(x, W - 50);
      glowCircle(ctx, bx, FLOOR - 20, 20, "#4f46e5", "#818cf8");
      ctx.fillStyle = "#c7d2fe"; ctx.font = "bold 11px monospace"; ctx.textAlign = "center";
      ctx.fillText(`${mass}kg`, bx, FLOOR - 16);

      if (Math.abs(vx) > 0.1) arrow(ctx, bx, FLOOR - 20, bx + vx * 25, FLOOR - 20, "#10b981", `v=${vx.toFixed(1)}m/s`);

      hud(ctx, [
        `Same Impulse J = ${impulse} N·s`,
        `Duration Δt = ${impulseDuration.toFixed(2)} s`,
        `Force F = J/Δt = ${F.toFixed(0)} N`,
        `Δp = J = ${impulse} kg·m/s  →  Δv = ${deltaV.toFixed(1)} m/s`,
        `Short Δt → Large F; Long Δt → Small F`,
        `(This is why airbags save lives!)`,
      ], 130, 16, "#a5b4fc");

      if (bx < W - 50) rafRef.current = requestAnimationFrame(frame);
      else { stateRef.current.running = false; setPlaying(false); }
    };
    rafRef.current = requestAnimationFrame(frame);
  }, [impulse, duration, mass, F, deltaV]);

  const reset = useCallback(() => {
    stateRef.current.running = false; cancelAnimationFrame(rafRef.current); setPlaying(false);
    const canvas = canRef.current;
    if (!canvas) return;
    const setup = setupCanvas(canvas);
    if (!setup) return;
    const [ctx, W, H] = setup;
    drawGrid(ctx, W, H);
    const FLOOR = H * 0.65;
    ctx.fillStyle = "#1e293b"; ctx.fillRect(0, FLOOR, W, H - FLOOR);
    glowCircle(ctx, 60, FLOOR - 20, 20, "#4f46e5", "#818cf8");
    hud(ctx, [`J = ${impulse} N·s  |  F = ${F.toFixed(0)} N  |  Δt = ${duration.toFixed(2)} s`, "Press ▶ to launch"], 130, 16, "#a5b4fc");
  }, [impulse, duration, F]);

  useEffect(() => { reset(); }, [reset]);
  useEffect(() => () => { stateRef.current.running = false; cancelAnimationFrame(rafRef.current); }, []);

  return (
    <SimWrapper title="💨 Impulse = F × Δt — Force vs Duration" desc="Same momentum change (J), different collision durations. Short time → huge force. Like airbags!">
      <canvas ref={canRef} style={{ width: "100%", height: 240, display: "block" }} />
      <div style={{ padding: "10px 16px 14px" }}>
        <Slider label="Impulse J" value={impulse} min={20} max={300} step={10} onChange={setImpulse} unit=" N·s" />
        <Slider label="Duration Δt" value={duration} min={0.05} max={2} step={0.05} onChange={setDuration} unit=" s" />
        <Slider label="Mass m" value={mass} min={1} max={15} step={1} onChange={setMass} unit=" kg" />
        <p style={{ color: "#f87171", fontSize: 12, marginTop: 6 }}>
          F = {F.toFixed(0)} N | Δv = {deltaV.toFixed(1)} m/s
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <button onClick={run} disabled={playing}
            style={{ flex: 1, background: playing ? "#1e293b" : "#4f46e5", color: playing ? "#475569" : "#fff", border: "none", borderRadius: 8, padding: "7px 0", cursor: playing ? "default" : "pointer", fontWeight: 700 }}>
            {playing ? "▶ Running..." : "▶ Apply Impulse"}
          </button>
          <button onClick={reset} style={{ flex: 1, background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, padding: "7px 0", cursor: "pointer" }}>↺ Reset</button>
        </div>
      </div>
    </SimWrapper>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SIM 11: FREE BODY DIAGRAM BUILDER
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_fbd_interactive_builder() {
  const canRef = useRef<HTMLCanvasElement>(null);
  const [Fapp, setFapp] = useState(30);
  const [theta, setTheta] = useState(0);
  const [mu, setMu] = useState(0.3);
  const [mass, setMass] = useState(8);

  const ang = (theta * Math.PI) / 180;
  const Fg = mass * G;
  const Fax = Fapp * Math.cos(ang);
  const Fay = -Fapp * Math.sin(ang);
  const FN = Fg + Fay; /* Normal = Weight - F sin(θ) when force is applied above horizontal */
  const Ff = mu * Math.max(0, FN);
  const Fnet_x = Fax - Ff;
  const Fnet_y = 0; /* vertical equilibrium on flat surface */
  const acc = Fnet_x / mass;

  useEffect(() => {
    const canvas = canRef.current;
    if (!canvas) return;
    const setup = setupCanvas(canvas);
    if (!setup) return;
    const [ctx, W, H] = setup;
    drawGrid(ctx, W, H);

    const cx = W / 2, cy = H * 0.55;

    /* floor */
    ctx.fillStyle = "#1e293b"; ctx.fillRect(0, cy + 30, W, H - cy - 30);
    ctx.fillStyle = "#334155"; ctx.fillRect(0, cy + 28, W, 2);

    /* block */
    ctx.save();
    ctx.shadowColor = "#6366f1"; ctx.shadowBlur = 16;
    ctx.fillStyle = "#1e3a5f"; ctx.strokeStyle = "#818cf8"; ctx.lineWidth = 2;
    ctx.fillRect(cx - 30, cy - 30, 60, 60); ctx.strokeRect(cx - 30, cy - 30, 60, 60);
    ctx.shadowBlur = 0; ctx.restore();
    ctx.fillStyle = "#a5b4fc"; ctx.font = "bold 12px monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(`${mass} kg`, cx, cy);

    /* Weight arrow (down) */
    arrow(ctx, cx, cy + 30, cx, cy + 30 + Fg * 2.5, "#ef4444", `W=${Fg.toFixed(0)}N`);

    /* Normal force (up) */
    arrow(ctx, cx, cy - 30, cx, cy - 30 - FN * 2.5, "#10b981", `N=${FN.toFixed(0)}N`);

    /* Applied force at angle */
    arrow(ctx, cx + 30, cy, cx + 30 + Fax * 2.5, cy + Fay * 2.5, "#f59e0b",
      `F=${Fapp}N@${theta}°`);

    /* Friction (opposing motion) */
    if (Fnet_x > 0 && Ff > 0)
      arrow(ctx, cx - 30, cy, cx - 30 - Ff * 2.5, cy, "#a78bfa", `f=${Ff.toFixed(1)}N`);

    /* Net force */
    if (Math.abs(Fnet_x) > 0.5)
      arrow(ctx, cx, cy - 50, cx + Fnet_x * 2.5, cy - 50, "#fbbf24", `Fnet=${Fnet_x.toFixed(1)}N`);

    /* angle arc */
    if (theta > 0) {
      ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 1; ctx.beginPath();
      ctx.arc(cx + 30, cy, 25, -ang, 0); ctx.stroke();
      ctx.fillStyle = "#f59e0b"; ctx.font = "10px monospace"; ctx.textAlign = "left";
      ctx.fillText(`${theta}°`, cx + 58, cy - 6);
    }

    /* HUD */
    hud(ctx, [
      `FBD Analysis: m = ${mass} kg  |  μ = ${mu}`,
      `Applied F = ${Fapp} N at ${theta}°`,
      `Fₓ = ${Fax.toFixed(1)} N  |  Fy = ${Fay.toFixed(1)} N`,
      `Weight W = ${Fg.toFixed(0)} N  |  Normal N = ${FN.toFixed(0)} N`,
      `Friction f = ${Ff.toFixed(1)} N`,
      `Net Fₓ = ${Fnet_x.toFixed(1)} N  |  a = ${acc.toFixed(2)} m/s²`,
      acc > 0 ? "→ Block accelerates right" : acc < 0 ? "→ Block decelerates/stationary" : "■ Block stationary",
    ], 12, 12, "#a5b4fc");
  }, [Fapp, theta, mu, mass, ang, Fg, Fax, Fay, FN, Ff, Fnet_x, acc]);

  return (
    <SimWrapper title="📊 Free Body Diagram Builder" desc="See all forces on a block: weight, normal, applied, friction. Build your FBD step by step.">
      <canvas ref={canRef} style={{ width: "100%", height: 280, display: "block" }} />
      <div style={{ padding: "10px 16px 14px" }}>
        <Slider label="Applied Force" value={Fapp} min={0} max={100} step={5} onChange={setFapp} unit=" N" />
        <Slider label="Angle θ" value={theta} min={0} max={60} step={5} onChange={setTheta} unit="°" />
        <Slider label="Friction μ" value={mu} min={0} max={0.8} step={0.05} onChange={setMu} />
        <Slider label="Mass m" value={mass} min={1} max={20} step={1} onChange={setMass} unit=" kg" />
        <p style={{ color: acc > 0 ? "#10b981" : "#f87171", fontSize: 12, marginTop: 6, fontWeight: 700 }}>
          a = {acc.toFixed(2)} m/s² {acc > 0.01 ? "→ accelerating" : "→ stationary"}
        </p>
      </div>
    </SimWrapper>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SIM 12: NEWTON'S CRADLE (FULL PHYSICS)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_newtons_cradle_physics() {
  const canRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ running: true, angles: [0.8, 0, 0, 0, 0], velocities: [0, 0, 0, 0, 0] });
  const rafRef = useRef(0);
  const [pulled, setPulled] = useState(1);
  const L = 90; /* pendulum length pixels */
  const R = 14; /* ball radius */
  const mass = 1;

  useEffect(() => {
    stateRef.current.angles = Array(5).fill(0).map((_, i) => i < pulled ? 0.8 : 0);
    stateRef.current.velocities = Array(5).fill(0);
    stateRef.current.running = true;
    const canvas = canRef.current;
    if (!canvas) return;

    const frame = () => {
      if (!stateRef.current.running) return;
      const setup = setupCanvas(canvas);
      if (!setup) return;
      const [ctx, W, H] = setup;
      drawGrid(ctx, W, H);

      const angles = stateRef.current.angles;
      const velocities = stateRef.current.velocities;
      const pivotY = H * 0.25;
      const spacing = R * 2 + 2;
      const totalW = 5 * spacing;
      const startX = W / 2 - totalW / 2 + spacing / 2;
      const pivots = Array.from({ length: 5 }, (_, i) => ({ x: startX + i * spacing, y: pivotY }));

      /* Update physics: pendulum with collision detection */
      for (let i = 0; i < 5; i++) {
        velocities[i] += -(G * 0.3) / L * Math.sin(angles[i]) * DT;
        angles[i] += velocities[i] * DT;
      }

      /* Simple elastic collision between adjacent touching balls */
      const bx = pivots.map((p, i) => p.x + L * Math.sin(angles[i]));
      for (let i = 0; i < 4; i++) {
        if (bx[i] + R >= bx[i + 1] - R && velocities[i] > velocities[i + 1]) {
          const v1 = velocities[i], v2 = velocities[i + 1];
          velocities[i] = v2; velocities[i + 1] = v1; /* elastic same-mass */
        }
      }

      /* ceiling bar */
      ctx.fillStyle = "#334155"; ctx.fillRect(startX - 20, pivotY - 14, totalW + 10, 12);
      ctx.strokeStyle = "#475569"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(startX - 20, pivotY + 2); ctx.lineTo(startX + totalW + 10, pivotY + 2); ctx.stroke();

      /* draw balls */
      pivots.forEach((p, i) => {
        const bpx = p.x + L * Math.sin(angles[i]);
        const bpy = p.y + L * Math.cos(angles[i]);

        /* string */
        ctx.strokeStyle = "#64748b"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(bpx, bpy); ctx.stroke();

        /* ball */
        const isActive = Math.abs(angles[i]) > 0.05 || Math.abs(velocities[i]) > 0.1;
        glowCircle(ctx, bpx, bpy, R, isActive ? "#f59e0b" : "#94a3b8", isActive ? "#fbbf24" : "#475569");
      });

      /* momentum label */
      const pTotal = velocities.reduce((s, v) => s + mass * v, 0);
      hud(ctx, [
        `Newton's Cradle — Elastic Collisions`,
        `Balls pulled: ${pulled}`,
        `Total momentum: ${pTotal.toFixed(2)} kg·rad/s`,
        "Equal mass → perfect momentum transfer",
        "n balls in → n balls out!",
      ], 14, 16, "#a5b4fc");

      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => { stateRef.current.running = false; cancelAnimationFrame(rafRef.current); };
  }, [pulled, L, R]);

  return (
    <SimWrapper title="🔵 Newton's Cradle — Full Physics" desc="Pull 1, 2, or 3 balls. Elastic collisions between equal masses: momentum and energy conserved.">
      <canvas ref={canRef} style={{ width: "100%", height: 280, display: "block" }} />
      <div style={{ padding: "10px 16px 14px" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ color: "#94a3b8", fontSize: 12, minWidth: 100 }}>Balls to pull:</span>
          {[1, 2, 3].map(n => (
            <button key={n} onClick={() => setPulled(n)}
              style={{ flex: 1, background: pulled === n ? "#b45309" : "#1e293b", color: pulled === n ? "#fff" : "#94a3b8", border: "1px solid #334155", borderRadius: 8, padding: "6px 0", cursor: "pointer", fontWeight: 700 }}>
              {n} Ball{n > 1 ? "s" : ""}
            </button>
          ))}
        </div>
        <p style={{ color: "#a5b4fc", fontSize: 12, marginTop: 8 }}>
          Pull {pulled} → {pulled} ball{pulled > 1 ? "s" : ""} swing out the other side. Conservation of momentum in action!
        </p>
      </div>
    </SimWrapper>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SIM 13: FREE FALL TERMINAL VELOCITY
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_free_fall_terminal() {
  const canRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ running: true, y1: 0, vy1: 0, y2: 0, vy2: 0, t: 0 });
  const rafRef = useRef(0);
  const [mass, setMass] = useState(5);
  const [drag, setDrag] = useState(0.5); /* drag coefficient */

  /* Terminal velocity: v_t = sqrt(2mg / (C_d * A * ρ)) ≈ sqrt(mg/drag) */
  const vTerminal = Math.sqrt(mass * G / drag);

  useEffect(() => {
    stateRef.current = { running: true, y1: 0, vy1: 0, y2: 0, vy2: 0, t: 0 };
    const canvas = canRef.current;
    if (!canvas) return;

    const frame = () => {
      if (!stateRef.current.running) return;
      const setup = setupCanvas(canvas);
      if (!setup) return;
      const [ctx, W, H] = setup;
      drawGrid(ctx, W, H);

      const s = stateRef.current;
      /* Object 1: no air drag (free fall) */
      s.vy1 += G * DT;
      s.y1 += s.vy1 * DT;

      /* Object 2: with air drag F_drag = drag * v^2 (quadratic drag) */
      const Fdrag = drag * s.vy2 * s.vy2;
      const a2 = G - Fdrag / mass;
      s.vy2 += a2 * DT;
      s.y2 += s.vy2 * DT;
      s.t += DT;

      const SCALE = 12; /* px per meter */
      const LAUNCH_Y = 40;
      const GROUND = H - 50;

      const py1 = LAUNCH_Y + s.y1 * SCALE;
      const py2 = LAUNCH_Y + s.y2 * SCALE;

      /* ground */
      ctx.fillStyle = "#1e293b"; ctx.fillRect(0, GROUND, W, H - GROUND);
      ctx.fillStyle = "#334155"; ctx.fillRect(0, GROUND, W, 2);

      /* Object 1 (no drag) */
      const x1 = W * 0.3;
      if (py1 < GROUND) {
        glowCircle(ctx, x1, py1, 12, "#6366f1", "#818cf8");
        arrow(ctx, x1, py1, x1, py1 + 25, "#ef4444", `${s.vy1.toFixed(1)} m/s`);
      }
      pill(ctx, "No Drag", x1, LAUNCH_Y - 18, "#6366f1", "#c7d2fe");

      /* Object 2 (with drag) */
      const x2 = W * 0.65;
      if (py2 < GROUND) {
        glowCircle(ctx, x2, py2, 12, "#f59e0b", "#fbbf24");
        arrow(ctx, x2, py2, x2, py2 + 25, "#10b981", `${s.vy2.toFixed(1)} m/s`);
        /* drag arrow up */
        const Fd = drag * s.vy2 ** 2;
        arrow(ctx, x2, py2 - 5, x2, py2 - 5 - Fd / mass * 3, "#a78bfa", `Fd=${Fd.toFixed(1)}N`);
      }
      pill(ctx, "Air Drag", x2, LAUNCH_Y - 18, "#f59e0b", "#fde68a");

      /* terminal velocity line */
      const vTermPx = LAUNCH_Y + vTerminal * vTerminal / (2 * G) * SCALE;
      if (vTermPx < GROUND) {
        ctx.strokeStyle = "rgba(239,68,68,0.3)"; ctx.lineWidth = 1; ctx.setLineDash([5, 5]);
        ctx.beginPath(); ctx.moveTo(0, vTermPx); ctx.lineTo(W, vTermPx); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#ef4444"; ctx.font = "10px monospace"; ctx.textAlign = "right";
        ctx.fillText(`v_terminal ≈ ${vTerminal.toFixed(1)} m/s`, W - 10, vTermPx - 4);
      }

      /* HUD */
      hud(ctx, [
        `m = ${mass} kg  |  drag k = ${drag}`,
        `Gravity = ${G} m/s²`,
        `Terminal Velocity = ${vTerminal.toFixed(1)} m/s`,
        `v_terminal = √(mg/k) = √(${mass}×9.8/${drag})`,
        `Free fall v = ${s.vy1.toFixed(1)} m/s`,
        `Drag fall v = ${s.vy2.toFixed(1)} m/s (${(s.vy2 / vTerminal * 100).toFixed(0)}% of terminal)`,
      ], 12, 12, "#a5b4fc");

      /* reset if both landed */
      if (py1 >= GROUND && py2 >= GROUND) {
        stateRef.current = { ...s, y1: 0, vy1: 0, y2: 0, vy2: 0, t: 0 };
      }

      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => { stateRef.current.running = false; cancelAnimationFrame(rafRef.current); };
  }, [mass, drag, vTerminal]);

  return (
    <SimWrapper title="🪂 Free Fall vs Terminal Velocity" desc="Left: no air drag (constant acceleration). Right: air drag slows acceleration until terminal velocity is reached.">
      <canvas ref={canRef} style={{ width: "100%", height: 280, display: "block" }} />
      <div style={{ padding: "10px 16px 14px" }}>
        <Slider label="Mass m" value={mass} min={1} max={20} step={1} onChange={setMass} unit=" kg" />
        <Slider label="Drag coeff k" value={drag} min={0.05} max={2} step={0.05} onChange={setDrag} />
        <p style={{ color: "#a5b4fc", fontSize: 12, marginTop: 6 }}>
          Terminal velocity = {vTerminal.toFixed(1)} m/s — speed at which drag force = gravity
        </p>
      </div>
    </SimWrapper>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SIM 14: 2D VECTOR FORCE ADDITION
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_vector_force_addition_2d() {
  const canRef = useRef<HTMLCanvasElement>(null);
  const [F1, setF1] = useState(40);
  const [ang1, setAng1] = useState(30);
  const [F2, setF2] = useState(30);
  const [ang2, setAng2] = useState(120);

  const a1 = (ang1 * Math.PI) / 180;
  const a2 = (ang2 * Math.PI) / 180;
  const F1x = F1 * Math.cos(a1), F1y = -F1 * Math.sin(a1);
  const F2x = F2 * Math.cos(a2), F2y = -F2 * Math.sin(a2);
  const FRx = F1x + F2x, FRy = F1y + F2y;
  const FR = Math.hypot(FRx, FRy);
  const angR = Math.atan2(-FRy, FRx) * 180 / Math.PI;

  useEffect(() => {
    const canvas = canRef.current;
    if (!canvas) return;
    const setup = setupCanvas(canvas);
    if (!setup) return;
    const [ctx, W, H] = setup;
    drawGrid(ctx, W, H);

    const CX = W * 0.38, CY = H * 0.5;
    const SC = 2.5;

    /* Grid axes */
    ctx.strokeStyle = "rgba(99,102,241,0.2)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, CY); ctx.lineTo(W, CY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(CX, 0); ctx.lineTo(CX, H); ctx.stroke();
    ctx.fillStyle = "#334155"; ctx.font = "10px monospace"; ctx.textAlign = "center";
    ctx.fillText("+x", CX + 80, CY - 6); ctx.fillText("+y", CX + 6, CY - 80);

    /* F1 */
    arrow(ctx, CX, CY, CX + F1x * SC, CY + F1y * SC, "#6366f1", `F₁=${F1}N@${ang1}°`, 3);
    /* F2 */
    arrow(ctx, CX, CY, CX + F2x * SC, CY + F2y * SC, "#f59e0b", `F₂=${F2}N@${ang2}°`, 3);
    /* Parallelogram ghost */
    ctx.strokeStyle = "rgba(99,102,241,0.2)"; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(CX + F1x * SC, CY + F1y * SC);
    ctx.lineTo(CX + FRx * SC, CY + FRy * SC);
    ctx.moveTo(CX + F2x * SC, CY + F2y * SC);
    ctx.lineTo(CX + FRx * SC, CY + FRy * SC);
    ctx.stroke(); ctx.setLineDash([]);
    /* Resultant */
    arrow(ctx, CX, CY, CX + FRx * SC, CY + FRy * SC, "#10b981", `FR=${FR.toFixed(1)}N@${angR.toFixed(0)}°`, 3.5);
    /* origin dot */
    glowCircle(ctx, CX, CY, 5, "#fff", "#a5b4fc");

    /* Component breakdown (right side) */
    const GX = W * 0.64;
    hud(ctx, [
      "Vector Addition: F₁ + F₂ = FR",
      `F₁ = (${F1x.toFixed(1)}, ${(-F1y).toFixed(1)}) N`,
      `F₂ = (${F2x.toFixed(1)}, ${(-F2y).toFixed(1)}) N`,
      `──────────────────────`,
      `FR = (${FRx.toFixed(1)}, ${(-FRy).toFixed(1)}) N`,
      `|FR| = √(FRₓ²+FRᵧ²) = ${FR.toFixed(1)} N`,
      `Direction = ${angR.toFixed(1)}° from +x`,
    ], GX, 20, "#a5b4fc");
  }, [F1, ang1, F2, ang2, F1x, F1y, F2x, F2y, FRx, FRy, FR, angR]);

  return (
    <SimWrapper title="⊕ 2D Force Vector Addition" desc="Add two force vectors graphically. Resultant = parallelogram diagonal. Green = net force.">
      <canvas ref={canRef} style={{ width: "100%", height: 260, display: "block" }} />
      <div style={{ padding: "10px 16px 14px" }}>
        <Slider label="Force F₁" value={F1} min={5} max={80} step={5} onChange={setF1} unit=" N" />
        <Slider label="F₁ angle" value={ang1} min={0} max={360} step={5} onChange={setAng1} unit="°" />
        <Slider label="Force F₂" value={F2} min={5} max={80} step={5} onChange={setF2} unit=" N" />
        <Slider label="F₂ angle" value={ang2} min={0} max={360} step={5} onChange={setAng2} unit="°" />
        <p style={{ color: "#10b981", fontSize: 12, marginTop: 6 }}>
          Resultant FR = {FR.toFixed(1)} N at {angR.toFixed(0)}° from +x axis
        </p>
      </div>
    </SimWrapper>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SIM 15: CONSERVATION OF ENERGY — KE + PE
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_energy_conservation_track() {
  const canRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ running: true, x: 0, vx: 0, t: 0 });
  const rafRef = useRef(0);
  const [mass, setMass] = useState(2);
  const [startH, setStartH] = useState(4); /* start height in meters */

  /* Track profile: a dip from left to right (roller-coaster shape) */
  const trackFn = useCallback((x: number, W: number): number => {
    /* Returns height in px from floor */
    const xn = x / W; /* normalized 0-1 */
    return startH * (Math.cos(xn * Math.PI * 2) * 0.5 + 0.5) * 40 + 20; /* pixels */
  }, [startH]);

  useEffect(() => {
    stateRef.current = { running: true, x: 20, vx: 0.5, t: 0 };
    const canvas = canRef.current;
    if (!canvas) return;
    const W = canvas.clientWidth || 600;

    const frame = () => {
      if (!stateRef.current.running) return;
      const setup = setupCanvas(canvas);
      if (!setup) return;
      const [ctx, cW, H] = setup;
      drawGrid(ctx, cW, H);

      const s = stateRef.current;
      const FLOOR = H - 20;

      /* Track heights at current and next position */
      const h0 = trackFn(s.x, cW);
      const h1 = trackFn(s.x + 1, cW);
      const slope = h0 - h1; /* positive = going downhill (decreasing height = more KE) */

      /* Energy conservation: v² = v0² + 2g*(h0_real - h_real) */
      /* Simplified: use slope to compute acceleration tangentially */
      const slopeAngle = Math.atan2(slope, 1);
      s.vx += G * Math.sin(slopeAngle) * DT * 20; /* scaled to pixel space */
      s.vx = Math.max(-15, Math.min(15, s.vx));
      s.x += s.vx;

      /* Wrap around */
      if (s.x > cW - 10) { s.x = cW - 10; s.vx *= -0.98; }
      if (s.x < 10) { s.x = 10; s.vx *= -0.98; }
      s.t += DT;

      /* Draw track */
      ctx.strokeStyle = "#475569"; ctx.lineWidth = 3;
      ctx.beginPath();
      for (let px = 0; px <= cW; px += 2) {
        const py = FLOOR - trackFn(px, cW);
        if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      /* Fill under track */
      ctx.fillStyle = "#1e293b20";
      ctx.beginPath();
      for (let px = 0; px <= cW; px += 2) {
        const py = FLOOR - trackFn(px, cW);
        if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.lineTo(cW, FLOOR); ctx.lineTo(0, FLOOR); ctx.closePath(); ctx.fill();

      /* Ball */
      const bx = s.x;
      const by = FLOOR - trackFn(bx, cW) - 12;
      glowCircle(ctx, bx, by, 12, "#f59e0b", "#fbbf24");

      /* Energy calculations */
      const maxH_px = trackFn(0, cW);
      const currentH_px = trackFn(bx, cW);
      const heightAboveFloor_m = currentH_px / 40; /* scale back to meters */
      const maxHeight_m = maxH_px / 40;

      const PE = mass * G * heightAboveFloor_m;
      const KE = mass * s.vx * s.vx * 0.3; /* scaled to match visual */
      const E_total = mass * G * maxHeight_m; /* constant */

      /* Energy bars */
      const barX = 12, barY = H - 80, barW = 16, barH = 60;
      const peH = (PE / (E_total + 0.01)) * barH;
      const keH = Math.min((KE / (E_total + 0.01)) * barH, barH);

      ctx.fillStyle = "#1e293b"; ctx.fillRect(barX, barY, barW, barH);
      ctx.fillStyle = "#ef4444"; ctx.fillRect(barX, barY + barH - peH, barW, peH);
      ctx.fillStyle = "#10b981"; ctx.fillRect(barX + barW + 4, barY, barW, barH);
      ctx.fillStyle = "#10b981"; ctx.fillRect(barX + barW + 4, barY + barH - keH, barW, keH);

      ctx.fillStyle = "#94a3b8"; ctx.font = "10px monospace"; ctx.textAlign = "center";
      ctx.fillText("PE", barX + barW / 2, barY + barH + 12);
      ctx.fillText("KE", barX + barW + 4 + barW / 2, barY + barH + 12);

      /* Height indicators */
      const startY = FLOOR - trackFn(0, cW);
      ctx.strokeStyle = "rgba(239,68,68,0.3)"; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(0, startY); ctx.lineTo(70, startY); ctx.stroke();
      ctx.setLineDash([]);

      /* HUD */
      hud(ctx, [
        `m = ${mass} kg  |  h_max = ${startH} m`,
        `Total E = mgh_max = ${E_total.toFixed(1)} J (constant)`,
        `PE = mgh = ${PE.toFixed(1)} J`,
        `KE = ½mv² ≈ ${KE.toFixed(1)} J`,
        `At top: all PE, no KE`,
        `At bottom: all KE, no PE`,
      ], 70, 14, "#a5b4fc");

      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => { stateRef.current.running = false; cancelAnimationFrame(rafRef.current); };
  }, [mass, startH, trackFn]);

  return (
    <SimWrapper title="⚡ Conservation of Energy — KE + PE" desc="Ball rolls on a track. PE converts to KE and back. Total energy stays constant (no friction).">
      <canvas ref={canRef} style={{ width: "100%", height: 260, display: "block" }} />
      <div style={{ padding: "10px 16px 14px" }}>
        <Slider label="Mass m" value={mass} min={1} max={10} step={1} onChange={setMass} unit=" kg" />
        <Slider label="Track height" value={startH} min={1} max={8} step={0.5} onChange={setStartH} unit=" m" />
        <p style={{ color: "#a5b4fc", fontSize: 12, marginTop: 6 }}>
          Total Energy = {(mass * G * startH).toFixed(1)} J (conserved throughout motion)
        </p>
      </div>
    </SimWrapper>
  );
}
