/**
 * FILE: Topic3Mega.tsx
 * PURPOSE: 15 professional physics simulations for Topic 3 —
 *          Newton's Second Law (F = ma) — Class 9 CBSE.
 */
"use client";
import { useEffect, useRef, useState } from "react";

const BG = "#0a1628";
const BLUE = "#3B82F6";
const RED = "#EF4444";
const GREEN = "#10B981";
const AMBER = "#F59E0B";
const PURPLE = "#8B5CF6";
const WHITE = "#E2E8F0";
const GRAY = "#475569";

function arr(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, col: string, lbl = "", w = 2.5) {
  if (Math.abs(x2 - x1) < 0.5 && Math.abs(y2 - y1) < 0.5) return;
  ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  const a = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath(); ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 10 * Math.cos(a - 0.4), y2 - 10 * Math.sin(a - 0.4));
  ctx.lineTo(x2 - 10 * Math.cos(a + 0.4), y2 - 10 * Math.sin(a + 0.4));
  ctx.closePath(); ctx.fill();
  if (lbl) { ctx.font = "bold 11px Inter,sans-serif"; ctx.fillText(lbl, x2 + 5, y2 + 4); }
  ctx.restore();
}
function txt(ctx: CanvasRenderingContext2D, t: string, x: number, y: number, c = WHITE, s = 12) {
  ctx.save(); ctx.font = `${s}px Inter,sans-serif`; ctx.fillStyle = c; ctx.fillText(t, x, y); ctx.restore();
}

/* ─── 1. Atwood Machine ──────────────────────────── */
export function Sim_atwood_machine() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const [m1, setM1] = useState(3); const [m2, setM2] = useState(5);
  const stRef = useRef({ y1: 80, y2: 80, v: 0 });
  useEffect(() => {
    stRef.current = { y1: 80, y2: 80, v: 0 };
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const g = 9.8;
    function loop() {
      const a = ((m2 - m1) * g) / (m1 + m2);
      stRef.current.v += a * 0.016; stRef.current.v *= 0.998;
      stRef.current.y2 += stRef.current.v * 0.5;
      stRef.current.y1 = 160 - (stRef.current.y2 - 80);
      if (stRef.current.y2 > 240 || stRef.current.y1 > 240) { stRef.current.y1 = 80; stRef.current.y2 = 80; stRef.current.v = 0; }
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      const cx = 290;
      /* pulley */
      ctx.fillStyle = "#4B5563"; ctx.strokeStyle = GRAY; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, 40, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#6B7280"; ctx.beginPath(); ctx.arc(cx, 40, 8, 0, Math.PI * 2); ctx.fill();
      /* ropes */
      ctx.strokeStyle = "#D4D4D8"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(cx - 10, 40); ctx.lineTo(200, stRef.current.y1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + 10, 40); ctx.lineTo(380, stRef.current.y2); ctx.stroke();
      /* m1 */
      const h1 = m1 * 12; ctx.fillStyle = "#1E40AF"; ctx.strokeStyle = BLUE; ctx.lineWidth = 2;
      ctx.fillRect(175, stRef.current.y1, 50, h1); ctx.strokeRect(175, stRef.current.y1, 50, h1);
      txt(ctx, `${m1}kg`, 188, stRef.current.y1 + h1 / 2 + 4, WHITE, 12);
      arr(ctx, 200, stRef.current.y1, 200, stRef.current.y1 - 28, GREEN, "T");
      arr(ctx, 200, stRef.current.y1 + h1, 200, stRef.current.y1 + h1 + 25, AMBER, `${(m1 * g).toFixed(0)}N`);
      /* m2 */
      const h2 = m2 * 12; ctx.fillStyle = "#7F1D1D"; ctx.strokeStyle = RED; ctx.lineWidth = 2;
      ctx.fillRect(355, stRef.current.y2, 50, h2); ctx.strokeRect(355, stRef.current.y2, 50, h2);
      txt(ctx, `${m2}kg`, 368, stRef.current.y2 + h2 / 2 + 4, WHITE, 12);
      arr(ctx, 380, stRef.current.y2, 380, stRef.current.y2 - 28, GREEN, "T");
      arr(ctx, 380, stRef.current.y2 + h2, 380, stRef.current.y2 + h2 + 25, AMBER, `${(m2 * g).toFixed(0)}N`);
      const T = (2 * m1 * m2 * g) / (m1 + m2);
      txt(ctx, `a = (m₂−m₁)g/(m₁+m₂) = ${((m2 - m1) * g / (m1 + m2)).toFixed(2)} m/s²`, 10, 30, WHITE, 12);
      txt(ctx, `Tension T = 2m₁m₂g/(m₁+m₂) = ${T.toFixed(1)} N`, 10, 50, GREEN, 12);
      txt(ctx, `v = ${stRef.current.v.toFixed(2)} m/s`, 10, 70, AMBER, 12);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [m1, m2]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={290} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>m₁: {m1}kg<input type="range" min={1} max={10} value={m1} onChange={e => setM1(+e.target.value)} /></label>
        <label>m₂: {m2}kg<input type="range" min={1} max={10} value={m2} onChange={e => setM2(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 2. Car F=ma Race ──────────────────────────── */
export function Sim_fma_car_race() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const [F, setF] = useState(500); const [mass, setMass] = useState(1000);
  const carRef = useRef({ x: 40, v: 0 });
  useEffect(() => {
    carRef.current = { x: 40, v: 0 };
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const a = F / mass;
    function loop() {
      carRef.current.v += a * 0.016; carRef.current.x += carRef.current.v * 0.4;
      if (carRef.current.x > c.width + 100) { carRef.current.x = 40; carRef.current.v = 0; }
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      /* road */
      ctx.fillStyle = "#1F2937"; ctx.fillRect(0, 200, c.width, 60);
      ctx.strokeStyle = "#FCD34D"; ctx.lineWidth = 2; ctx.setLineDash([20, 12]);
      ctx.beginPath(); ctx.moveTo(0, 230); ctx.lineTo(c.width, 230); ctx.stroke(); ctx.setLineDash([]);
      /* car */
      const cx = carRef.current.x;
      ctx.fillStyle = "#1E3A5F"; ctx.strokeStyle = BLUE; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(cx, 160, 100, 45, [8, 8, 0, 0]); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "rgba(147,197,253,0.3)"; ctx.strokeStyle = "#60A5FA"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect(cx + 60, 165, 32, 22, 3); ctx.fill(); ctx.stroke();
      [cx + 18, cx + 80].forEach(wx => {
        ctx.fillStyle = "#0F172A"; ctx.strokeStyle = GRAY; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(wx, 205, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      });
      arr(ctx, cx + 100, 182, cx + 100 + Math.min(F / 15, 100), 182, BLUE, `F=${F}N`, 3);
      /* exhaust flames */
      if (F > 300) {
        ctx.fillStyle = AMBER;
        ctx.beginPath(); ctx.moveTo(cx, 185); ctx.lineTo(cx - 20, 182); ctx.lineTo(cx, 195); ctx.closePath(); ctx.fill();
      }
      /* info panel */
      ctx.fillStyle = "rgba(15,23,42,0.85)"; ctx.strokeStyle = GRAY; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(10, 10, 300, 100, 8); ctx.fill(); ctx.stroke();
      txt(ctx, `F = ${F} N  |  m = ${mass} kg`, 20, 32, WHITE, 13);
      txt(ctx, `a = F/m = ${F}/${mass} = ${a.toFixed(3)} m/s²`, 20, 54, AMBER, 13);
      txt(ctx, `v = ${carRef.current.v.toFixed(2)} m/s`, 20, 76, GREEN, 13);
      txt(ctx, `s = ${(carRef.current.x / 40).toFixed(1)} m`, 20, 96, BLUE, 12);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [F, mass]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={275} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Force: {F}N<input type="range" min={100} max={2000} step={100} value={F} onChange={e => setF(+e.target.value)} /></label>
        <label>Mass: {mass}kg<input type="range" min={200} max={3000} step={100} value={mass} onChange={e => setMass(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 3. Ramp Acceleration a=g·sinθ ─────────────── */
export function Sim_ramp_acceleration() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [angle, setAngle] = useState(20);
  const ballRef = useRef({ s: 0, v: 0 });
  useEffect(() => {
    ballRef.current = { s: 0, v: 0 };
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const rad = angle * Math.PI / 180; const L = 450;
    function loop() {
      const a = 9.8 * Math.sin(rad);
      ballRef.current.v += a * 0.012; ballRef.current.s += ballRef.current.v * 0.012;
      if (ballRef.current.s > L) { ballRef.current.s = 0; ballRef.current.v = 0; }
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      const sx = 50; const sy = 260;
      const ex = sx + L * Math.cos(rad); const ey = sy - L * Math.sin(rad);
      ctx.fillStyle = "#78350F"; ctx.strokeStyle = "#D97706"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.lineTo(ex, sy); ctx.closePath(); ctx.fill(); ctx.stroke();
      const bx = sx + ballRef.current.s * Math.cos(rad);
      const by = sy - ballRef.current.s * Math.sin(rad);
      ctx.fillStyle = "#DC2626"; ctx.strokeStyle = "#FCA5A5"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(bx, by - 13, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      /* force components */
      const gScale = 20;
      arr(ctx, bx, by - 13, bx, by - 13 + 9.8 * gScale / 10, AMBER, "W=mg", 2);
      arr(ctx, bx, by - 13, bx + 9.8 * Math.sin(rad) * gScale * Math.cos(rad), by - 13 - 9.8 * Math.sin(rad) * gScale * Math.sin(rad), RED, `mg·sin${angle}°`, 2);
      arr(ctx, bx, by - 13, bx - 9.8 * Math.cos(rad) * gScale * Math.sin(rad), by - 13 - 9.8 * Math.cos(rad) * gScale * Math.cos(rad), GREEN, "N", 2);
      /* angle arc */
      ctx.strokeStyle = BLUE; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(sx, sy, 40, -rad, 0); ctx.stroke();
      txt(ctx, `${angle}°`, sx + 43, sy - 8, BLUE, 12);
      txt(ctx, `a = g·sin(${angle}°) = 9.8 × ${Math.sin(rad).toFixed(3)} = ${(9.8 * Math.sin(rad)).toFixed(2)} m/s²`, 10, 30, WHITE, 13);
      txt(ctx, `v = ${ballRef.current.v.toFixed(2)} m/s`, 10, 52, AMBER, 12);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [angle]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={290} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Angle: {angle}°<input type="range" min={5} max={75} value={angle} onChange={e => setAngle(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 4. Impulse = F × t ─────────────────────────── */
export function Sim_impulse_momentum_change() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [F, setF] = useState(20); const [t, setT] = useState(2);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
    const mass = 5; const v_before = 0; const impulse = F * t; const v_after = (impulse) / mass;
    /* before */
    ctx.fillStyle = "#1E3A5F"; ctx.strokeStyle = BLUE; ctx.lineWidth = 2;
    ctx.fillRect(60, 140, 70, 50); ctx.strokeRect(60, 140, 70, 50);
    txt(ctx, `${mass}kg`, 72, 170, WHITE, 12);
    txt(ctx, `v₀=${v_before}m/s`, 60, 135, BLUE, 11);
    txt(ctx, "p₀ = mv₀ = 0", 60, 205, BLUE, 11);
    /* force arrow phase */
    const fScale = Math.min(F * 3, 150);
    arr(ctx, 130, 165, 130 + fScale, 165, RED, `F=${F}N for ${t}s`, 3);
    /* after */
    ctx.fillStyle = "#164E63"; ctx.strokeStyle = GREEN; ctx.lineWidth = 2;
    ctx.fillRect(c.width - 150, 130, 70 + impulse / 3, 60); ctx.strokeRect(c.width - 150, 130, 70 + impulse / 3, 60);
    const vScale = Math.min(v_after * 10, 100);
    arr(ctx, c.width - 150 + 70 + impulse / 3, 160, c.width - 150 + 70 + impulse / 3 + vScale, 160, GREEN, `v=${v_after.toFixed(1)}m/s`);
    txt(ctx, `p = mv = ${mass}×${v_after.toFixed(1)} = ${(mass * v_after).toFixed(1)} kg·m/s`, c.width - 200, 210, GREEN, 11);
    /* impulse box */
    ctx.fillStyle = "rgba(139,92,246,0.15)"; ctx.strokeStyle = PURPLE; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(180, 110, 200, 110, 8); ctx.fill(); ctx.stroke();
    txt(ctx, "IMPULSE = F × t", 195, 133, PURPLE, 13);
    txt(ctx, `= ${F} × ${t} = ${impulse} N·s`, 195, 153, WHITE, 12);
    txt(ctx, "= Δp = m × Δv", 195, 173, AMBER, 12);
    txt(ctx, `= ${mass} × ${v_after.toFixed(1)} = ${(mass * v_after).toFixed(1)} kg·m/s`, 195, 193, GREEN, 12);
    txt(ctx, "Impulse-Momentum Theorem: F·t = m·Δv", 10, c.height - 10, GRAY, 11);
  }, [F, t]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={270} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Force: {F}N<input type="range" min={5} max={50} value={F} onChange={e => setF(+e.target.value)} /></label>
        <label>Time: {t}s<input type="range" min={1} max={10} value={t} onChange={e => setT(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 5. Projectile F=ma ─────────────────────────── */
export function Sim_projectile_fma() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [v0, setV0] = useState(12); const [ang, setAng] = useState(45);
  const pRef = useRef({ x: 60, y: 250, vx: 0, vy: 0, t: 0 });
  const trailRef = useRef<{ x: number; y: number }[]>([]);
  useEffect(() => {
    const rad = ang * Math.PI / 180;
    pRef.current = { x: 60, y: 250, vx: v0 * Math.cos(rad), vy: -v0 * Math.sin(rad), t: 0 };
    trailRef.current = [];
    const c = ref.current!; const ctx = c.getContext("2d")!;
    function loop() {
      const p = pRef.current; const dt = 0.025;
      p.vy += 9.8 * dt; p.x += p.vx * 10 * dt; p.y += p.vy * 10 * dt; p.t += dt;
      trailRef.current.push({ x: p.x, y: p.y });
      if (trailRef.current.length > 200) trailRef.current.shift();
      if (p.y > 260 || p.x > c.width - 20) {
        const r2 = ang * Math.PI / 180;
        pRef.current = { x: 60, y: 250, vx: v0 * Math.cos(r2), vy: -v0 * Math.sin(r2), t: 0 };
        trailRef.current = [];
      }
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#1F2937"; ctx.fillRect(0, 260, c.width, 40);
      /* trail */
      if (trailRef.current.length > 2) {
        ctx.strokeStyle = "rgba(59,130,246,0.3)"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(trailRef.current[0].x, trailRef.current[0].y);
        trailRef.current.forEach(pt => ctx.lineTo(pt.x, pt.y)); ctx.stroke();
      }
      /* ball */
      ctx.fillStyle = "#DC2626"; ctx.strokeStyle = "#FCA5A5"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(p.x, p.y, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      /* horizontal: constant velocity (no F) */
      arr(ctx, p.x, p.y, p.x + p.vx * 3, p.y, GREEN, `vₓ=${p.vx.toFixed(1)}`);
      /* vertical: gravity F=mg */
      arr(ctx, p.x, p.y, p.x, p.y + p.vy * 3, p.vy > 0 ? AMBER : BLUE, `vy=${p.vy.toFixed(1)}`);
      /* gravity annotation */
      arr(ctx, p.x - 30, p.y, p.x - 30, p.y + 30, RED, "g=9.8↓");
      ctx.fillStyle = "rgba(15,23,42,0.8)"; ctx.strokeStyle = GRAY; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(10, 10, 290, 95, 6); ctx.fill(); ctx.stroke();
      txt(ctx, `Horizontal: ax = 0  →  vₓ = const = ${(v0 * Math.cos(ang * Math.PI / 180)).toFixed(1)} m/s`, 18, 30, GREEN, 11);
      txt(ctx, `Vertical: ay = g = 9.8 m/s²  →  vy changes`, 18, 50, AMBER, 11);
      txt(ctx, `F = ma: Only gravity acts (downward)`, 18, 70, WHITE, 11);
      txt(ctx, `t = ${p.t.toFixed(2)}s  |  Range ≈ ${(v0 * v0 * Math.sin(2 * ang * Math.PI / 180) / 9.8).toFixed(1)}m`, 18, 90, GRAY, 11);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [v0, ang]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={310} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>v₀: {v0}m/s<input type="range" min={5} max={20} value={v0} onChange={e => setV0(+e.target.value)} /></label>
        <label>Angle: {ang}°<input type="range" min={10} max={80} value={ang} onChange={e => setAng(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 6. Terminal Velocity with Parachute ───────── */
export function Sim_skydiver_parachute() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [chute, setChute] = useState(false);
  const stRef = useRef({ y: 30, v: 0 });
  useEffect(() => {
    stRef.current = { y: 30, v: 0 };
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const m = 80; const g = 9.8;
    function loop() {
      const area = chute ? 30 : 0.5;
      const Cd = 0.8; const rho = 1.2;
      const drag = 0.5 * rho * Cd * area * stRef.current.v * stRef.current.v;
      const net = m * g - drag;
      stRef.current.v += (net / m) * 0.04;
      stRef.current.y += stRef.current.v * 0.05;
      if (stRef.current.y > c.height - 40) { stRef.current.y = 30; stRef.current.v = 0; }
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      /* sky gradient */
      const grad = ctx.createLinearGradient(0, 0, 0, c.height);
      grad.addColorStop(0, "#0c1a3a"); grad.addColorStop(1, "#1e3a5f");
      ctx.fillStyle = grad; ctx.fillRect(0, 0, c.width, c.height);
      /* ground */
      ctx.fillStyle = "#166534"; ctx.fillRect(0, c.height - 30, c.width, 30);
      const py = stRef.current.y; const px = 290;
      /* parachute */
      if (chute) {
        ctx.fillStyle = "#DC2626"; ctx.strokeStyle = "#FCA5A5"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(px, py - 60, 45, Math.PI, 0); ctx.fill(); ctx.stroke();
        /* strings */
        ctx.strokeStyle = "#D4D4D8"; ctx.lineWidth = 1.5;
        [-35, -20, 0, 20, 35].forEach(dx => {
          ctx.beginPath(); ctx.moveTo(px + dx, py - 60); ctx.lineTo(px, py - 10); ctx.stroke();
        });
      }
      /* body */
      ctx.strokeStyle = WHITE; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(px, py - 10, 10, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py + 20); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, py + 8); ctx.lineTo(px - 12, py + 20); ctx.moveTo(px, py + 8); ctx.lineTo(px + 12, py + 20); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, py + 20); ctx.lineTo(px - 8, py + 35); ctx.moveTo(px, py + 20); ctx.lineTo(px + 8, py + 35); ctx.stroke();
      /* force arrows */
      const W = m * g; const D = Math.min(drag, 2000);
      arr(ctx, px, py, px, py + Math.min(W / 20, 80), AMBER, `W=${W.toFixed(0)}N`, 2);
      arr(ctx, px, py, px, py - Math.min(D / 20, 80), RED, `Drag=${D.toFixed(0)}N`, 2);
      const vt = Math.sqrt((2 * m * g) / (rho * Cd * (chute ? 30 : 0.5)));
      txt(ctx, `Terminal v_t = ${vt.toFixed(1)} m/s`, 10, 30, GREEN, 13);
      txt(ctx, `Current v = ${stRef.current.v.toFixed(1)} m/s`, 10, 52, WHITE, 12);
      txt(ctx, `Net F = ${(m * g - drag).toFixed(1)} N ${drag > m * g - 1 ? "→ BALANCED" : ""}`, 10, 74, Math.abs(m * g - drag) < 5 ? GREEN : AMBER, 12);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [chute]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={340} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <button onClick={() => setChute(ch => !ch)}>{chute ? "Close Parachute" : "Open Parachute!"}</button>
        <span style={{ color: GREEN }}>Parachute = huge drag area → lower terminal velocity</span>
      </div>
    </div>
  );
}

/* ─── 7. Elevator Apparent Weight ────────────────── */
export function Sim_elevator_apparent_weight() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [a, setA] = useState(3);
  const [dir, setDir] = useState<"up" | "down" | "none">("none");
  const cabRef = useRef({ y: 150, v: 0 });
  useEffect(() => {
    cabRef.current = { y: 150, v: 0 };
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const m = 60; const g = 9.8;
    function loop() {
      const acc = dir === "up" ? -a : dir === "down" ? a : 0;
      cabRef.current.v += acc * 0.02; cabRef.current.v *= 0.97;
      cabRef.current.y += cabRef.current.v;
      cabRef.current.y = Math.max(30, Math.min(250, cabRef.current.y));
      const apparentW = m * (g + (dir === "none" ? 0 : dir === "up" ? a : -a));
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      /* shaft */
      ctx.fillStyle = "#0F172A"; ctx.strokeStyle = GRAY; ctx.lineWidth = 1.5;
      ctx.fillRect(180, 20, 220, 290); ctx.strokeRect(180, 20, 220, 290);
      /* guide rails */
      [195, 385].forEach(x => { ctx.strokeStyle = "#374151"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, 20); ctx.lineTo(x, 310); ctx.stroke(); });
      /* cab */
      ctx.fillStyle = "#1E3A5F"; ctx.strokeStyle = BLUE; ctx.lineWidth = 2;
      ctx.fillRect(200, cabRef.current.y, 180, 110); ctx.strokeRect(200, cabRef.current.y, 180, 110);
      /* person */
      const py = cabRef.current.y + 110;
      ctx.strokeStyle = WHITE; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(290, py - 65, 12, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(290, py - 53); ctx.lineTo(290, py - 28); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(290, py - 28); ctx.lineTo(275, py - 15); ctx.moveTo(290, py - 28); ctx.lineTo(305, py - 15); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(290, py - 28); ctx.lineTo(278, py); ctx.moveTo(290, py - 28); ctx.lineTo(302, py); ctx.stroke();
      /* scale under feet */
      ctx.fillStyle = "#374151"; ctx.strokeStyle = AMBER; ctx.lineWidth = 2;
      ctx.fillRect(270, py, 40, 8); ctx.strokeRect(270, py, 40, 8);
      txt(ctx, `${apparentW.toFixed(0)}N`, 272, py + 22, apparentW > m * g ? RED : apparentW < m * g ? BLUE : GREEN, 12);
      /* force arrows */
      arr(ctx, 380, cabRef.current.y + 55, 380, cabRef.current.y + 55 + 40, AMBER, `W=${(m * g).toFixed(0)}N`);
      arr(ctx, 380, cabRef.current.y + 55, 380, cabRef.current.y + 55 - apparentW / 4, GREEN, `N=${apparentW.toFixed(0)}N`);
      /* info */
      txt(ctx, `Acceleration: ${dir === "none" ? "0" : dir === "up" ? `+${a}` : `-${a}`} m/s²`, 10, 30, WHITE, 13);
      txt(ctx, `N = m(g${dir === "up" ? "+" : dir === "down" ? "-" : ""}a) = ${apparentW.toFixed(1)} N`, 10, 52, AMBER, 13);
      txt(ctx, dir === "up" ? "↑ Feels HEAVIER!" : dir === "down" ? "↓ Feels LIGHTER!" : "At rest — normal weight", 10, 74, dir === "up" ? RED : dir === "down" ? BLUE : GREEN, 12);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [a, dir]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={320} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <button onClick={() => setDir("up")}>↑ Accelerate Up</button>
        <button onClick={() => setDir("none")}>Constant speed</button>
        <button onClick={() => setDir("down")}>↓ Accelerate Down</button>
        <label>a = {a} m/s²<input type="range" min={1} max={9} value={a} onChange={e => setA(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 8. Feather and Coin in Vacuum ─────────────── */
export function Sim_feather_coin_vacuum() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [vacuum, setVacuum] = useState(false);
  const objsRef = useRef([{ y: 30, v: 0 }, { y: 30, v: 0 }]);
  useEffect(() => {
    objsRef.current = [{ y: 30, v: 0 }, { y: 30, v: 0 }];
    const c = ref.current!; const ctx = c.getContext("2d")!;
    function loop() {
      objsRef.current = objsRef.current.map((o, i) => {
        const m = i === 0 ? 0.001 : 0.05; /* feather vs coin */
        const area = i === 0 ? 0.008 : 0.0003;
        const drag = vacuum ? 0 : 0.5 * 1.2 * 0.8 * area * o.v * o.v;
        const a = 9.8 - drag / m;
        const nv = Math.max(0, o.v + a * 0.025);
        return { y: Math.min(o.y + nv * 0.4, c.height - 50), v: nv };
      });
      if (objsRef.current[0].y >= c.height - 50 && objsRef.current[1].y >= c.height - 50) {
        setTimeout(() => { objsRef.current = [{ y: 30, v: 0 }, { y: 30, v: 0 }]; }, 1000);
      }
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      /* chamber */
      ctx.fillStyle = vacuum ? "rgba(0,0,0,0.8)" : "rgba(147,197,253,0.05)";
      ctx.strokeStyle = BLUE; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(100, 10, 380, c.height - 30, 12); ctx.fill(); ctx.stroke();
      txt(ctx, vacuum ? "VACUUM CHAMBER" : "AIR", 240, 38, vacuum ? PURPLE : "#93C5FD", 13);
      if (!vacuum) {
        /* air particles */
        [{ x: 180, y: 80 }, { x: 350, y: 120 }, { x: 260, y: 200 }, { x: 430, y: 180 }, { x: 150, y: 260 }].forEach(p => {
          ctx.fillStyle = "rgba(147,197,253,0.3)"; ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fill();
        });
      }
      /* ground */
      ctx.fillStyle = "#374151"; ctx.fillRect(110, c.height - 28, 360, 10);
      /* feather */
      ctx.strokeStyle = "#E2E8F0"; ctx.lineWidth = 1.5;
      const fx = 200; const fy = objsRef.current[0].y;
      ctx.beginPath(); ctx.moveTo(fx, fy); ctx.bezierCurveTo(fx + 20, fy - 20, fx + 30, fy + 10, fx, fy + 40); ctx.stroke();
      for (let i = 0; i < 4; i++) {
        ctx.beginPath(); ctx.moveTo(fx, fy + i * 10); ctx.bezierCurveTo(fx + 15, fy + i * 10 - 8, fx + 18, fy + i * 10 + 5, fx, fy + i * 10 + 8); ctx.stroke();
      }
      txt(ctx, "Feather", fx - 30, fy - 15, WHITE, 10);
      /* coin */
      ctx.fillStyle = "#D97706"; ctx.strokeStyle = "#FCD34D"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(380, objsRef.current[1].y + 10, 20, 8, 0.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      txt(ctx, "Coin", 365, objsRef.current[1].y - 5, AMBER, 10);
      txt(ctx, vacuum ? "✓ Both fall at SAME rate! a = g = 9.8 m/s² for both" : "Air resistance slows feather more (less mass)", 120, c.height - 12, vacuum ? GREEN : AMBER, 11);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [vacuum]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={320} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <button onClick={() => { setVacuum(v => !v); objsRef.current = [{ y: 30, v: 0 }, { y: 30, v: 0 }]; }}>{vacuum ? "Add Air" : "Remove Air (Vacuum)"}</button>
        <button onClick={() => { objsRef.current = [{ y: 30, v: 0 }, { y: 30, v: 0 }]; }}>Drop Again</button>
      </div>
    </div>
  );
}

/* ─── 9. Force Changes Acceleration ─────────────── */
export function Sim_force_vs_acceleration() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [mass, setMass] = useState(5);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
    /* graph */
    const gx = 80; const gy = 30; const gw = 440; const gh = 200;
    ctx.fillStyle = "#0F172A"; ctx.strokeStyle = GRAY; ctx.lineWidth = 1.5;
    ctx.fillRect(gx, gy, gw, gh); ctx.strokeRect(gx, gy, gw, gh);
    /* grid */
    ctx.strokeStyle = "#1E293B"; ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath(); ctx.moveTo(gx, gy + gh - i * gh / 5); ctx.lineTo(gx + gw, gy + gh - i * gh / 5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(gx + i * gw / 5, gy); ctx.lineTo(gx + i * gw / 5, gy + gh); ctx.stroke();
    }
    /* F vs a line (a = F/m) */
    ctx.strokeStyle = BLUE; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(gx, gy + gh);
    for (let F = 0; F <= 50; F += 1) {
      const a = F / mass;
      const px = gx + (F / 50) * gw;
      const py = gy + gh - (a / 10) * gh;
      if (F === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    /* axis labels */
    txt(ctx, "Force F (N) →", gx + gw / 2 - 40, gy + gh + 25, WHITE, 12);
    ctx.save(); ctx.translate(gx - 40, gy + gh / 2); ctx.rotate(-Math.PI / 2);
    txt(ctx, "Acceleration a (m/s²) →", -50, 0, WHITE, 12); ctx.restore();
    for (let i = 0; i <= 5; i++) {
      txt(ctx, `${i * 10}`, gx + i * gw / 5 - 10, gy + gh + 15, GRAY, 10);
      txt(ctx, `${i * 2}`, gx - 28, gy + gh - i * gh / 5 + 4, GRAY, 10);
    }
    /* slope annotation */
    txt(ctx, `Slope = 1/m = 1/${mass} = ${(1 / mass).toFixed(3)}`, gx + gw / 2 - 20, gy + 20, AMBER, 11);
    /* example point */
    const exF = 30; const exA = exF / mass;
    const px = gx + (exF / 50) * gw; const py = gy + gh - (exA / 10) * gh;
    ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();
    txt(ctx, `F=${exF}N → a=${exA.toFixed(1)}m/s²`, px + 8, py - 8, RED, 11);
    txt(ctx, `F = ma: Straight line through origin | Slope = 1/m`, 10, c.height - 10, GRAY, 11);
  }, [mass]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={290} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Mass: {mass}kg<input type="range" min={1} max={20} value={mass} onChange={e => setMass(+e.target.value)} /></label>
        <span style={{ color: GREEN }}>Heavier mass = smaller slope = less acceleration for same force</span>
      </div>
    </div>
  );
}

/* ─── 10. Fan Cart (Newton's 2nd Law) ──────────── */
export function Sim_fan_cart() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [fanOn, setFanOn] = useState(false); const [mass, setMass] = useState(2);
  const cartRef = useRef({ x: 50, v: 0 });
  useEffect(() => {
    cartRef.current = { x: 50, v: 0 };
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const F = fanOn ? 4 : 0;
    function loop() {
      const a = F / mass;
      cartRef.current.v += a * 0.016; cartRef.current.x += cartRef.current.v * 0.6;
      if (cartRef.current.x > c.width - 80) { cartRef.current.x = 50; cartRef.current.v = 0; }
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      /* track */
      ctx.fillStyle = "#1F2937"; ctx.fillRect(30, 200, c.width - 60, 12);
      const cx = cartRef.current.x;
      /* cart body */
      ctx.fillStyle = "#1E3A5F"; ctx.strokeStyle = BLUE; ctx.lineWidth = 2;
      ctx.fillRect(cx, 160, 90, 40); ctx.strokeRect(cx, 160, 90, 40);
      txt(ctx, `${mass}kg`, cx + 30, 185, WHITE, 11);
      /* wheels */
      [cx + 15, cx + 75].forEach(wx => {
        ctx.fillStyle = "#0F172A"; ctx.strokeStyle = GRAY; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(wx, 200, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = "#4B5563"; ctx.lineWidth = 1;
        [0, 90, 180, 270].forEach(a => {
          const r = a * Math.PI / 180;
          ctx.beginPath(); ctx.moveTo(wx, 200); ctx.lineTo(wx + 10 * Math.cos(r), 200 + 10 * Math.sin(r)); ctx.stroke();
        });
      });
      /* fan */
      const fanCx = cx + 45; const fanCy = 148;
      ctx.fillStyle = "#374151"; ctx.strokeStyle = GRAY; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(fanCx, fanCy, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      if (fanOn) {
        const bladeAngle = (Date.now() / 50) % (Math.PI * 2);
        ctx.strokeStyle = "#60A5FA"; ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
          const ba = bladeAngle + i * (Math.PI * 2 / 3);
          ctx.beginPath(); ctx.moveTo(fanCx, fanCy);
          ctx.bezierCurveTo(fanCx + 14 * Math.cos(ba), fanCy + 14 * Math.sin(ba), fanCx + 16 * Math.cos(ba + 0.5), fanCy + 16 * Math.sin(ba + 0.5), fanCx + 12 * Math.cos(ba + 1), fanCy + 12 * Math.sin(ba + 1));
          ctx.stroke();
        }
        /* air blowing */
        ctx.strokeStyle = "rgba(147,197,253,0.4)"; ctx.lineWidth = 1;
        [3, 6, 9].forEach(d => {
          ctx.beginPath(); ctx.moveTo(cx, fanCy + 3 - d); ctx.lineTo(cx - 20, fanCy + 3 - d); ctx.stroke();
        });
        arr(ctx, cx, fanCy, cx - 35, fanCy, GREEN, "Fan thrust");
        arr(ctx, cx + 90, 180, cx + 90 + F * 8, 180, BLUE, `F=4N`, 3);
      }
      txt(ctx, `a = F/m = ${F}/${mass} = ${(F / mass).toFixed(2)} m/s²`, 10, 30, WHITE, 13);
      txt(ctx, `v = ${cartRef.current.v.toFixed(2)} m/s`, 10, 52, AMBER, 12);
      txt(ctx, fanOn ? "Fan ON → force applied → cart accelerates!" : "Fan OFF → no force → no acceleration (Newton 1st)", 10, 74, fanOn ? GREEN : GRAY, 12);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [fanOn, mass]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={250} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <button onClick={() => setFanOn(f => !f)}>{fanOn ? "Turn Fan OFF" : "Turn Fan ON"}</button>
        <button onClick={() => { cartRef.current = { x: 50, v: 0 }; }}>Reset</button>
        <label>Mass: {mass}kg<input type="range" min={1} max={8} value={mass} onChange={e => setMass(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 11. Braking Distance Calculator ─────────────── */
export function Sim_braking_distance() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [speed, setSpeed] = useState(20); const [mass, setMass] = useState(1000); const [friction, setFriction] = useState(0.5);
  const carRef = useRef({ x: 50, v: 0, braking: false });
  useEffect(() => {
    carRef.current = { x: 50, v: speed / 3.6, braking: false };
    const c = ref.current!; const ctx = c.getContext("2d")!;
    function loop() {
      const car = carRef.current;
      if (car.braking) {
        const a = friction * 9.8;
        car.v = Math.max(0, car.v - a * 0.015);
      }
      car.x += car.v * 0.4;
      if (car.x > c.width - 80 || car.v === 0) { car.x = 50; car.v = speed / 3.6; car.braking = false; }
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      /* road */
      ctx.fillStyle = "#1F2937"; ctx.fillRect(0, 200, c.width, 60);
      ctx.strokeStyle = "#FCD34D"; ctx.lineWidth = 2; ctx.setLineDash([20, 12]);
      ctx.beginPath(); ctx.moveTo(0, 230); ctx.lineTo(c.width, 230); ctx.stroke(); ctx.setLineDash([]);
      /* skid marks */
      if (car.braking && car.v > 0.1) {
        ctx.strokeStyle = "rgba(0,0,0,0.5)"; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(50, 215); ctx.lineTo(car.x + 20, 215); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(50, 218); ctx.lineTo(car.x + 60, 218); ctx.stroke();
      }
      /* car */
      ctx.fillStyle = "#1E3A5F"; ctx.strokeStyle = BLUE; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(car.x, 162, 100, 43, [8, 8, 0, 0]); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "rgba(147,197,253,0.3)"; ctx.beginPath(); ctx.roundRect(car.x + 60, 168, 32, 24, 4); ctx.fill();
      [car.x + 18, car.x + 80].forEach(wx => {
        ctx.fillStyle = "#0F172A"; ctx.strokeStyle = GRAY; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(wx, 205, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      });
      if (car.braking) arr(ctx, car.x, 183, car.x - 40, 183, RED, "Brakes");
      /* stopping distance */
      const sd = (speed / 3.6) * (speed / 3.6) / (2 * friction * 9.8);
      const sdX = Math.min(50 + sd * 0.4, c.width - 20);
      ctx.strokeStyle = AMBER; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(sdX, 155); ctx.lineTo(sdX, 210); ctx.stroke(); ctx.setLineDash([]);
      txt(ctx, `stop`, sdX - 12, 150, AMBER, 10);
      txt(ctx, `Stopping distance = v²/(2μg) = ${(speed / 3.6).toFixed(1)}²/(2×${friction}×9.8) = ${sd.toFixed(1)}m`, 10, 30, WHITE, 11);
      txt(ctx, `F_brake = μmg = ${friction}×${mass}×9.8 = ${(friction * mass * 9.8).toFixed(0)}N`, 10, 52, RED, 11);
      txt(ctx, `v = ${(car.v * 3.6).toFixed(1)} km/h`, 10, 74, car.braking ? AMBER : GREEN, 12);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speed, mass, friction]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={270} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <button onClick={() => { carRef.current.braking = true; }}>Brake!</button>
        <button onClick={() => { carRef.current = { x: 50, v: speed / 3.6, braking: false }; }}>Reset</button>
        <label>Speed: {speed}km/h<input type="range" min={20} max={120} step={10} value={speed} onChange={e => setSpeed(+e.target.value)} /></label>
        <label>μ: {friction.toFixed(1)}<input type="range" min={0.1} max={0.9} step={0.1} value={friction} onChange={e => setFriction(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 12. Rocket Acceleration (Decreasing Mass) ── */
export function Sim_rocket_variable_mass() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [thrust, setThrust] = useState(5000);
  const stRef = useRef({ y: 280, v: 0, mass: 1000, fuel: 500 });
  const trailRef = useRef<{ x: number; y: number }[]>([]);
  useEffect(() => {
    stRef.current = { y: 280, v: 0, mass: 1000, fuel: 500 }; trailRef.current = [];
    const c = ref.current!; const ctx = c.getContext("2d")!;
    function loop() {
      const s = stRef.current;
      if (s.fuel > 0) {
        s.fuel -= 1; s.mass = 500 + s.fuel;
        const a = thrust / s.mass - 9.8;
        s.v += a * 0.02; s.y -= s.v * 0.1;
      } else { s.v -= 9.8 * 0.02; s.y -= s.v * 0.1; }
      if (s.y < 10 || s.y > 320) { s.y = 280; s.v = 0; s.mass = 1000; s.fuel = 500; trailRef.current = []; }
      trailRef.current.push({ x: 290, y: s.y }); if (trailRef.current.length > 150) trailRef.current.shift();
      ctx.clearRect(0, 0, c.width, c.height);
      const grad = ctx.createLinearGradient(0, 0, 0, c.height);
      grad.addColorStop(0, "#000510"); grad.addColorStop(1, "#0c1a3a");
      ctx.fillStyle = grad; ctx.fillRect(0, 0, c.width, c.height);
      /* stars */
      [{ x: 80, y: 40 }, { x: 490, y: 60 }, { x: 150, y: 180 }, { x: 520, y: 200 }].forEach(p => { ctx.fillStyle = "rgba(255,255,255,0.8)"; ctx.fillRect(p.x, p.y, 2, 2); });
      /* ground */
      ctx.fillStyle = "#166534"; ctx.fillRect(0, 300, c.width, 30);
      /* trail */
      if (trailRef.current.length > 2) {
        ctx.strokeStyle = "rgba(251,191,36,0.3)"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(trailRef.current[0].x, trailRef.current[0].y);
        trailRef.current.forEach(p => ctx.lineTo(p.x, p.y)); ctx.stroke();
      }
      /* rocket */
      const rx = 290; const ry = stRef.current.y;
      ctx.fillStyle = "#94A3B8"; ctx.strokeStyle = GRAY; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(rx, ry - 40); ctx.lineTo(rx + 15, ry); ctx.lineTo(rx - 15, ry); ctx.closePath(); ctx.fill(); ctx.stroke();
      /* windows */
      ctx.fillStyle = "#60A5FA"; ctx.beginPath(); ctx.arc(rx, ry - 20, 5, 0, Math.PI * 2); ctx.fill();
      /* fins */
      ctx.fillStyle = "#475569";
      ctx.beginPath(); ctx.moveTo(rx - 15, ry); ctx.lineTo(rx - 28, ry + 15); ctx.lineTo(rx - 15, ry + 10); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(rx + 15, ry); ctx.lineTo(rx + 28, ry + 15); ctx.lineTo(rx + 15, ry + 10); ctx.closePath(); ctx.fill();
      /* exhaust */
      if (stRef.current.fuel > 0) {
        const fSize = 10 + Math.random() * 15;
        ctx.fillStyle = AMBER;
        ctx.beginPath(); ctx.moveTo(rx - 10, ry + 5); ctx.lineTo(rx, ry + fSize + 10); ctx.lineTo(rx + 10, ry + 5); ctx.closePath(); ctx.fill();
      }
      const a = stRef.current.fuel > 0 ? thrust / stRef.current.mass - 9.8 : -9.8;
      txt(ctx, `F_thrust = ${thrust}N | m = ${stRef.current.mass.toFixed(0)}kg`, 10, 30, WHITE, 12);
      txt(ctx, `a = F/m - g = ${(thrust / stRef.current.mass).toFixed(1)} - 9.8 = ${a.toFixed(2)} m/s²`, 10, 52, AMBER, 12);
      txt(ctx, `v = ${stRef.current.v.toFixed(1)} m/s | fuel = ${stRef.current.fuel}`, 10, 74, stRef.current.fuel > 0 ? GREEN : RED, 12);
      txt(ctx, "As fuel burns → mass ↓ → same thrust → a increases!", 10, 96, PURPLE, 11);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [thrust]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={330} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Thrust: {thrust}N<input type="range" min={5000} max={20000} step={1000} value={thrust} onChange={e => setThrust(+e.target.value)} /></label>
        <button onClick={() => { stRef.current = { y: 280, v: 0, mass: 1000, fuel: 500 }; trailRef.current = []; }}>Relaunch</button>
      </div>
    </div>
  );
}

/* ─── 13. Cricket Impulse (F × t = Δp) ─────────── */
export function Sim_cricket_impulse_2() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [F, setF] = useState(800); const [t, setT] = useState(0.05);
  const ballRef = useRef({ x: 200, vx: -20, phase: "incoming" as string });
  useEffect(() => {
    ballRef.current = { x: 200, vx: -20, phase: "incoming" };
    const c = ref.current!; const ctx = c.getContext("2d")!;
    function loop() {
      const b = ballRef.current;
      b.x += b.vx * 0.5;
      if (b.phase === "incoming" && b.x < 340) {
        b.phase = "hit"; b.vx = (F * t) / 0.16 - 20; /* impulse changes momentum */
      }
      if (b.x > c.width + 20 || b.x < -20) { b.x = 200; b.vx = -20; b.phase = "incoming"; }
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      /* crease */
      ctx.strokeStyle = "#D4D4D8"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(350, 130); ctx.lineTo(350, 250); ctx.stroke();
      /* bat */
      ctx.fillStyle = "#78350F"; ctx.strokeStyle = "#D97706"; ctx.lineWidth = 2;
      ctx.fillRect(340, 155, 12, 80); ctx.strokeRect(340, 155, 12, 80);
      ctx.fillRect(344, 150, 4, 20);
      /* ball */
      ctx.fillStyle = "#DC2626"; ctx.strokeStyle = "#FCA5A5"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(b.x, 195, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      /* seam */
      ctx.strokeStyle = "#FCA5A5"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(b.x, 195, 14, -0.5, 0.5); ctx.stroke();
      if (b.phase !== "incoming") arr(ctx, b.x + 14, 195, b.x + 14 + Math.min(b.vx * 2, 100), 195, GREEN, `v=${b.vx.toFixed(0)} m/s`);
      else arr(ctx, b.x - 14, 195, b.x - 14 - 30, 195, AMBER, `-20 m/s`);
      const impulse = F * t; const delta_p = impulse;
      txt(ctx, `F = ${F} N  |  t = ${t.toFixed(3)} s`, 10, 30, WHITE, 13);
      txt(ctx, `Impulse = F×t = ${F}×${t.toFixed(3)} = ${impulse.toFixed(1)} N·s`, 10, 52, PURPLE, 13);
      txt(ctx, `Δp = m×Δv = 0.16×(${(b.vx).toFixed(0)}-(-20)) = ${(0.16 * (b.vx + 20)).toFixed(1)} kg·m/s`, 10, 74, GREEN, 12);
      txt(ctx, "Larger force OR longer contact time = bigger velocity change", 10, c.height - 10, GRAY, 11);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [F, t]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={265} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Force: {F}N<input type="range" min={200} max={1500} step={100} value={F} onChange={e => setF(+e.target.value)} /></label>
        <label>Contact time: {t.toFixed(3)}s<input type="range" min={0.01} max={0.2} step={0.01} value={t} onChange={e => setT(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 14. Same Force Different Masses ─────────────── */
export function Sim_same_force_diff_mass() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [push, setPush] = useState(false);
  const objsRef = useRef([{ x: 60, v: 0, m: 1 }, { x: 60, v: 0, m: 5 }, { x: 60, v: 0, m: 20 }]);
  useEffect(() => {
    objsRef.current = [{ x: 60, v: 0, m: 1 }, { x: 60, v: 0, m: 5 }, { x: 60, v: 0, m: 20 }];
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const F = 10;
    function loop() {
      if (push) objsRef.current = objsRef.current.map(o => { const nv = o.v + (F / o.m) * 0.016; return { ...o, v: nv, x: Math.min(o.x + nv * 0.5, c.width - 30) }; });
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      const colors = [GREEN, BLUE, RED]; const labs = ["1 kg (feather)", "5 kg (book)", "20 kg (box)"];
      objsRef.current.forEach((o, i) => {
        const y = 70 + i * 80; const sz = 15 + o.m * 1.5;
        ctx.fillStyle = "#1F2937"; ctx.fillRect(0, y - 2, c.width, sz + 4);
        ctx.fillStyle = colors[i] + "22"; ctx.strokeStyle = colors[i]; ctx.lineWidth = 2;
        ctx.fillRect(o.x, y, sz, sz); ctx.strokeRect(o.x, y, sz, sz);
        if (push) arr(ctx, o.x + sz, y + sz / 2, o.x + sz + 30, y + sz / 2, colors[i], `F=${F}N`, 2.5);
        txt(ctx, labs[i], 5, y + sz / 2 + 4, colors[i], 11);
        txt(ctx, `a=${(F / o.m).toFixed(1)}m/s²  v=${o.v.toFixed(1)}m/s`, c.width - 170, y + sz / 2 + 4, WHITE, 11);
      });
      txt(ctx, push ? `Same force (${F}N) applied to all — heaviest accelerates LEAST` : "Press PUSH to apply same force to all three", 10, 25, WHITE, 13);
      txt(ctx, "F = ma → a = F/m: More mass = more resistance to acceleration", 10, c.height - 10, GRAY, 11);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [push]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={310} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <button onClick={() => setPush(p => !p)}>{push ? "Stop" : `Apply ${10}N to All`}</button>
        <button onClick={() => { objsRef.current = [{ x: 60, v: 0, m: 1 }, { x: 60, v: 0, m: 5 }, { x: 60, v: 0, m: 20 }]; setPush(false); }}>Reset</button>
      </div>
    </div>
  );
}

/* ─── 15. Gravity on Earth Moon Mars ─────────────── */
export function Sim_gravity_comparison() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const ballsRef = useRef([{ y: 30, v: 0 }, { y: 30, v: 0 }, { y: 30, v: 0 }]);
  const [mass, setMass] = useState(5);
  useEffect(() => {
    ballsRef.current = [{ y: 30, v: 0 }, { y: 30, v: 0 }, { y: 30, v: 0 }];
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const gs = [9.8, 1.62, 3.72]; const names = ["Earth", "Moon", "Mars"];
    const cols = [BLUE, GRAY, RED]; const xPos = [100, 290, 480];
    function loop() {
      ballsRef.current = ballsRef.current.map((b, i) => {
        const nv = b.v + gs[i] * 0.025;
        return { y: Math.min(b.y + nv * 0.04, c.height - 80), v: nv };
      });
      if (ballsRef.current.every(b => b.y >= c.height - 80)) {
        setTimeout(() => { ballsRef.current = [{ y: 30, v: 0 }, { y: 30, v: 0 }, { y: 30, v: 0 }]; }, 1500);
      }
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      xPos.forEach((x, i) => {
        /* planet ground */
        ctx.fillStyle = cols[i] + "22"; ctx.strokeStyle = cols[i]; ctx.lineWidth = 2;
        ctx.fillRect(x - 60, c.height - 70, 120, 30); ctx.strokeRect(x - 60, c.height - 70, 120, 30);
        txt(ctx, names[i], x - 22, c.height - 50, cols[i], 12);
        txt(ctx, `g=${gs[i]} m/s²`, x - 32, c.height - 33, WHITE, 10);
        /* ball */
        ctx.fillStyle = cols[i]; ctx.strokeStyle = WHITE; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(x, ballsRef.current[i].y, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        arr(ctx, x, ballsRef.current[i].y + 16, x, ballsRef.current[i].y + 16 + gs[i] * 4, AMBER, "");
        txt(ctx, `v=${ballsRef.current[i].v.toFixed(1)}`, x + 20, ballsRef.current[i].y, WHITE, 10);
        /* weight */
        txt(ctx, `W=${(mass * gs[i]).toFixed(0)}N`, x - 25, c.height - 15, cols[i], 11);
      });
      txt(ctx, `Mass = ${mass}kg everywhere | Weight = mass × g (changes with planet)`, 10, 25, WHITE, 13);
      txt(ctx, "Ball falls fastest on Earth (highest g), slowest on Moon", 10, 45, GREEN, 12);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mass]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={320} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Object mass: {mass}kg<input type="range" min={1} max={20} value={mass} onChange={e => setMass(+e.target.value)} /></label>
        <button onClick={() => { ballsRef.current = [{ y: 30, v: 0 }, { y: 30, v: 0 }, { y: 30, v: 0 }]; }}>Drop Again</button>
      </div>
    </div>
  );
}
