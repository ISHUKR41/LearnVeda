"use client";
/**
 * FILE: Topic6Professional.tsx
 * LOCATION: src/components/simulations/Topic6Professional.tsx
 * PURPOSE: 15 brand-new professional physics simulations using HTML5 Canvas.
 *          Every simulation has real physics, auto-starts on mount, has interactive
 *          controls, and shows real-time telemetry. No dependencies on SimCanvas engine.
 * TOPICS: Force & Laws of Motion — projectile, pendulum, spring, atwood, friction,
 *         circular motion, impulse, Newton's cradle, explosion, braking, vectors & more.
 * LAST UPDATED: 2026-05-31
 */

import React, { useRef, useEffect, useState, useCallback } from "react";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * PHYSICS CONSTANTS
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const G  = 9.8;    /* gravitational acceleration m/s² */
const DT = 1 / 60; /* simulation time-step (60 fps target) */

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CANVAS UTILITIES
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/** Sets up a HiDPI canvas. Returns [ctx, W, H] or null if not ready. */
function setupCanvas(
  canvas: HTMLCanvasElement,
): [CanvasRenderingContext2D, number, number] | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const dpr = window.devicePixelRatio || 1;
  const W   = canvas.clientWidth  || 560;
  const H   = canvas.clientHeight || 300;
  if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return [ctx, W, H];
}

/** Dark background with subtle grid. */
function drawBg(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.fillStyle = "#050c18";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(99,102,241,0.05)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y <= H; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
}

/** Draw an arrow from (x1,y1) to (x2,y2) with optional text label. */
function arw(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number,
  x2: number, y2: number,
  color: string,
  label = "",
  lw    = 2.5,
) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 5) return;
  const ux = dx / len, uy = dy / len;
  const ah = Math.min(14, len * 0.38);
  ctx.save();
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = lw;
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - ah * (ux - 0.42 * uy), y2 - ah * (uy + 0.42 * ux));
  ctx.lineTo(x2 - ah * (ux + 0.42 * uy), y2 - ah * (uy - 0.42 * ux));
  ctx.closePath(); ctx.fill();
  if (label) {
    ctx.font = "bold 11px JetBrains Mono, monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(label, x2 + ux * 18, y2 + uy * 14);
  }
  ctx.restore();
}

/** Clip-path rounded rectangle. */
function rr(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SHARED UI COMPONENTS
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function SimCard({
  title, badge, desc, children,
}: { title: string; badge: string; desc: string; children: React.ReactNode }) {
  return (
    <div style={{
      width: "100%", background: "#080e1a", borderRadius: 20,
      padding: "24px 24px 20px", border: "1px solid #0f1e35",
      boxShadow: "0 16px 60px rgba(0,0,0,0.7)",
      fontFamily: "Inter, system-ui, sans-serif", overflow: "hidden",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
        <span style={{
          background: "rgba(99,102,241,0.12)", color: "#818cf8",
          border: "1px solid rgba(99,102,241,0.25)", borderRadius: 7,
          padding: "2px 9px", fontSize: 9.5, fontWeight: 800, letterSpacing: 1.5,
          textTransform: "uppercase" as const, whiteSpace: "nowrap" as const, marginTop: 2,
        }}>{badge}</span>
        <div>
          <h3 style={{ color: "#f1f5f9", fontSize: 16, fontWeight: 700, margin: 0 }}>{title}</h3>
          <p style={{ color: "#334155", fontSize: 12.5, margin: "4px 0 0", lineHeight: 1.5 }}>{desc}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Telem({ items }: { items: { label: string; value: string; color?: string }[] }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${Math.min(items.length, 4)}, 1fr)`,
      gap: 8, marginTop: 12,
    }}>
      {items.map(it => (
        <div key={it.label} style={{
          background: "#0a1220", border: "1px solid #0f1e35", borderRadius: 10, padding: "10px 12px",
        }}>
          <div style={{ fontSize: 9, color: "#1e3a5f", textTransform: "uppercase" as const, letterSpacing: 1.2, marginBottom: 3 }}>
            {it.label}
          </div>
          <div style={{
            fontSize: 14, fontWeight: 700, color: it.color ?? "#a78bfa",
            fontFamily: "JetBrains Mono, monospace",
          }}>{it.value}</div>
        </div>
      ))}
    </div>
  );
}

function Ctrl({
  label, min, max, step = 1, value, onChange, unit = "", color = "#6366f1",
}: {
  label: string; min: number; max: number; step?: number;
  value: number; onChange: (v: number) => void; unit?: string; color?: string;
}) {
  return (
    <div style={{ flex: 1, minWidth: 110 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: "#475569" }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color, fontFamily: "JetBrains Mono, monospace" }}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: color, cursor: "pointer" }}
      />
    </div>
  );
}

function Btn({
  label, onClick, bg = "#1e293b", fg = "#94a3b8",
}: { label: string; onClick: () => void; bg?: string; fg?: string }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 18px", borderRadius: 9, fontWeight: 700, fontSize: 12,
      border: "none", cursor: "pointer", background: bg, color: fg,
    }}>{label}</button>
  );
}

/* ════════════════════════════════════════════════════════════════
 * 1. PROJECTILE MOTION
 *    y = v₀sin(θ)t − ½gt²   x = v₀cos(θ)t
 * ════════════════════════════════════════════════════════════════ */
export function Sim_projectile_motion_pro() {
  const [angle, setAngle] = useState(45);
  const [speed, setSpeed] = useState(20);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const aRef      = useRef(angle);
  const sRef      = useRef(speed);
  useEffect(() => { aRef.current = angle; }, [angle]);
  useEffect(() => { sRef.current = speed; }, [speed]);

  const phys = useRef({ t: 0, x: 0, y: 0, vx: 0, vy: 0, maxY: 0, done: false,
    trail: [] as { x: number; y: number }[] });
  const [tel, setTel] = useState({ range: "—", maxH: "—", time: "—" });

  const reset = useCallback(() => {
    const θ = aRef.current * Math.PI / 180;
    const v = sRef.current;
    Object.assign(phys.current, {
      t: 0, x: 0, y: 0, vx: v * Math.cos(θ), vy: v * Math.sin(θ), maxY: 0, done: false, trail: [],
    });
  }, []);

  useEffect(() => {
    reset();
    const canvas = canvasRef.current; if (!canvas) return;
    let alive = true;
    const tick = () => {
      if (!alive) return;
      const res = setupCanvas(canvas); if (!res) { rafRef.current = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const p = phys.current;
      const SCALE = Math.min(7, W / 75);
      const ox = 55, oy = H - 44;

      if (!p.done) {
        for (let i = 0; i < 2; i++) {
          p.t  += DT / 2; p.vy -= G * DT / 2;
          p.x  += p.vx * DT / 2; p.y  += p.vy * DT / 2;
          if (p.y > p.maxY) p.maxY = p.y;
          p.trail.push({ x: ox + p.x * SCALE, y: oy - p.y * SCALE });
          if (p.y < 0 && p.t > 0.05) { p.y = 0; p.done = true; break; }
        }
        if (p.trail.length > 800) p.trail.splice(0, p.trail.length - 800);
        setTel({ range: `${p.x.toFixed(1)} m`, maxH: `${p.maxY.toFixed(1)} m`, time: `${p.t.toFixed(2)} s` });
        if (p.done) setTimeout(() => { if (alive) reset(); }, 2500);
      }

      drawBg(ctx, W, H);
      ctx.fillStyle = "rgba(15,30,60,0.6)"; ctx.fillRect(0, oy, W, H - oy);
      ctx.strokeStyle = "#1e3a5f"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(W, oy); ctx.stroke();

      /* Dashed range line */
      const θ = aRef.current * Math.PI / 180;
      const v = sRef.current;
      const rx = ox + v * v * Math.sin(2 * θ) / G * SCALE;
      if (rx < W - 10) {
        ctx.setLineDash([5, 7]); ctx.strokeStyle = "rgba(99,102,241,0.3)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(rx, oy); ctx.stroke(); ctx.setLineDash([]);
      }

      /* Trail */
      if (p.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(p.trail[0].x, p.trail[0].y);
        for (const pt of p.trail) ctx.lineTo(pt.x, pt.y);
        ctx.strokeStyle = "#6366f1"; ctx.lineWidth = 2.5; ctx.stroke();
      }

      /* Launch angle arrow */
      arw(ctx, ox, oy, ox + 50 * Math.cos(θ), oy - 50 * Math.sin(θ), "#10b981", `${aRef.current}°`);

      /* Ball */
      const bx = ox + p.x * SCALE, by = oy - p.y * SCALE;
      const g2 = ctx.createRadialGradient(bx - 3, by - 3, 1, bx, by, 12);
      g2.addColorStop(0, "#c4b5fd"); g2.addColorStop(1, "#6366f1");
      ctx.beginPath(); ctx.arc(bx, by, 12, 0, Math.PI * 2);
      ctx.fillStyle = g2; ctx.fill();
      ctx.strokeStyle = "#818cf8"; ctx.lineWidth = 2; ctx.stroke();

      if (p.done) {
        ctx.fillStyle = "#10b981"; ctx.font = "bold 12px JetBrains Mono, monospace";
        ctx.textAlign = "center"; ctx.textBaseline = "bottom";
        ctx.fillText(`${p.x.toFixed(1)} m`, Math.min(bx, W - 60), oy - 8);
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(rafRef.current); };
  }, [reset]);

  const θ = angle * Math.PI / 180;
  const theorRange = speed * speed * Math.sin(2 * θ) / G;
  const maxH       = speed * speed * Math.sin(θ) ** 2 / (2 * G);
  const tFly       = 2 * speed * Math.sin(θ) / G;

  return (
    <SimCard title="🚀 Projectile Motion" badge="Kinematics" desc="Adjustable launch angle & speed. Parabolic trajectory: x = v₀cos(θ)t, y = v₀sin(θ)t − ½gt². Max range at 45°.">
      <canvas ref={canvasRef} style={{ width: "100%", height: 300, borderRadius: 12, display: "block" }} />
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 12 }}>
        <Ctrl label="Launch Angle" min={5} max={85} value={angle} unit="°" color="#6366f1"
          onChange={v => { setAngle(v); reset(); }} />
        <Ctrl label="Speed" min={5} max={40} value={speed} unit=" m/s" color="#10b981"
          onChange={v => { setSpeed(v); reset(); }} />
      </div>
      <Telem items={[
        { label: "Range",      value: `${theorRange.toFixed(1)} m`, color: "#6366f1" },
        { label: "Max Height", value: `${maxH.toFixed(1)} m`,       color: "#10b981" },
        { label: "Flight Time",value: `${tFly.toFixed(2)} s`,       color: "#f59e0b" },
        { label: "Angle",      value: `${angle}°`,                  color: "#a78bfa" },
      ]} />
      <div style={{ marginTop: 10 }}><Btn label="↺ Reset" onClick={reset} /></div>
    </SimCard>
  );
}

/* ════════════════════════════════════════════════════════════════
 * 2. SIMPLE PENDULUM — θ'' = −(g/L)sinθ
 * ════════════════════════════════════════════════════════════════ */
export function Sim_simple_pendulum_pro() {
  const [L,       setL]       = useState(1.5); /* string length m */
  const [initDeg, setInitDeg] = useState(40);  /* initial angle ° */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const LR = useRef(L); const iR = useRef(initDeg);
  useEffect(() => { LR.current = L; }, [L]);
  useEffect(() => { iR.current = initDeg; }, [initDeg]);

  const phys = useRef({ theta: 0, omega: 0 });
  const [tel, setTel] = useState({ angle: "—", period: "—", ke: "—", pe: "—" });

  const reset = useCallback(() => {
    phys.current.theta = iR.current * Math.PI / 180;
    phys.current.omega = 0;
  }, []);

  useEffect(() => {
    reset();
    const canvas = canvasRef.current; if (!canvas) return;
    let alive = true;
    const tick = () => {
      if (!alive) return;
      const res = setupCanvas(canvas); if (!res) { rafRef.current = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const p  = phys.current;
      const Lv = LR.current;
      const pxL = Math.min(H * 0.68, 200); /* pixel length */
      const pivX = W / 2, pivY = 36;

      /* Euler-Cromer integration (stable for oscillations) */
      p.omega += -(G / Lv) * Math.sin(p.theta) * DT;
      p.theta += p.omega * DT;

      /* Energy (m=1 kg reference) */
      const ke  = 0.5 * (Lv * p.omega) ** 2;
      const pe  = G * Lv * (1 - Math.cos(p.theta));
      const tot = ke + pe;
      const period = 2 * Math.PI * Math.sqrt(Lv / G);

      setTel({
        angle:  `${(p.theta * 180 / Math.PI).toFixed(1)}°`,
        period: `${period.toFixed(2)} s`,
        ke:     `${ke.toFixed(3)} J`,
        pe:     `${pe.toFixed(3)} J`,
      });

      const bx = pivX + pxL * Math.sin(p.theta);
      const by = pivY + pxL * Math.cos(p.theta);

      drawBg(ctx, W, H);

      /* Ceiling */
      ctx.fillStyle = "#0f1e35"; ctx.fillRect(0, 0, W, 24);

      /* Arc guide */
      ctx.save(); ctx.translate(pivX, pivY);
      ctx.strokeStyle = "rgba(99,102,241,0.15)"; ctx.lineWidth = 1; ctx.setLineDash([4, 7]);
      const maxA = iR.current * Math.PI / 180;
      ctx.beginPath(); ctx.arc(0, 0, pxL, Math.PI / 2 - maxA, Math.PI / 2 + maxA);
      ctx.stroke(); ctx.setLineDash([]); ctx.restore();

      /* String */
      ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 2.5; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(pivX, pivY); ctx.lineTo(bx, by); ctx.stroke();

      /* Pivot */
      ctx.fillStyle = "#475569"; ctx.beginPath(); ctx.arc(pivX, pivY, 6, 0, Math.PI * 2); ctx.fill();

      /* Energy bar */
      const bW = 16, bH = H * 0.45, bX = W - 46, bY = (H - bH) / 2;
      const keH = tot > 0 ? (ke / tot) * bH : bH / 2;
      const peH = bH - keH;
      rr(ctx, bX, bY, bW, bH, 5); ctx.fillStyle = "#0a1220"; ctx.fill();
      rr(ctx, bX, bY, bW, peH, 5); ctx.fillStyle = "#6366f1"; ctx.fill();
      rr(ctx, bX, bY + peH, bW, keH, 5); ctx.fillStyle = "#f59e0b"; ctx.fill();
      ctx.font = "9px Inter, sans-serif"; ctx.textAlign = "center";
      ctx.fillStyle = "#6366f1"; ctx.fillText("PE", bX + bW / 2, bY - 5);
      ctx.fillStyle = "#f59e0b"; ctx.fillText("KE", bX + bW / 2, bY + bH + 12);

      /* Bob */
      const gr = ctx.createRadialGradient(bx - 4, by - 4, 2, bx, by, 18);
      gr.addColorStop(0, "#fde68a"); gr.addColorStop(1, "#d97706");
      ctx.beginPath(); ctx.arc(bx, by, 18, 0, Math.PI * 2);
      ctx.fillStyle = gr; ctx.fill(); ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 2; ctx.stroke();

      /* Angle label */
      ctx.fillStyle = "#64748b"; ctx.font = "bold 11px JetBrains Mono, monospace";
      ctx.textAlign = "left"; ctx.textBaseline = "top";
      ctx.fillText(`θ = ${(p.theta * 180 / Math.PI).toFixed(1)}°`, 10, 30);

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(rafRef.current); };
  }, [reset]);

  return (
    <SimCard title="🕰️ Simple Pendulum" badge="Oscillation" desc="θ'' = −(g/L)sinθ. Energy oscillates between KE and PE. Period T = 2π√(L/g).">
      <canvas ref={canvasRef} style={{ width: "100%", height: 330, borderRadius: 12, display: "block" }} />
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 12 }}>
        <Ctrl label="String Length" min={0.5} max={3} step={0.1} value={L} unit=" m" color="#f59e0b"
          onChange={v => { setL(v); reset(); }} />
        <Ctrl label="Initial Angle" min={5} max={75} value={initDeg} unit="°" color="#6366f1"
          onChange={v => { setInitDeg(v); reset(); }} />
      </div>
      <Telem items={[
        { label: "Angle",  value: tel.angle,  color: "#a78bfa" },
        { label: "Period", value: tel.period, color: "#f59e0b" },
        { label: "KE",     value: tel.ke,     color: "#f59e0b" },
        { label: "PE",     value: tel.pe,     color: "#6366f1" },
      ]} />
      <div style={{ marginTop: 10 }}><Btn label="↺ Reset" onClick={reset} /></div>
    </SimCard>
  );
}

/* ════════════════════════════════════════════════════════════════
 * 3. SPRING-MASS OSCILLATOR — Hooke's Law F = −kx
 * ════════════════════════════════════════════════════════════════ */
export function Sim_spring_oscillator_pro() {
  const [mass, setMass]   = useState(2);
  const [kk,   setKK]     = useState(20); /* spring constant N/m */
  const [disp, setDisp]   = useState(1);  /* initial displacement m */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const mR = useRef(mass); const kR = useRef(kk); const dR = useRef(disp);
  useEffect(() => { mR.current = mass; }, [mass]);
  useEffect(() => { kR.current = kk; }, [kk]);
  useEffect(() => { dR.current = disp; }, [disp]);

  const phys = useRef({ x: 1, v: 0 });
  const [tel, setTel] = useState({ disp: "—", vel: "—", force: "—", period: "—" });

  const reset = useCallback(() => { phys.current = { x: dR.current, v: 0 }; }, []);

  useEffect(() => {
    reset();
    const canvas = canvasRef.current; if (!canvas) return;
    let alive = true;
    const tick = () => {
      if (!alive) return;
      const res = setupCanvas(canvas); if (!res) { rafRef.current = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const p  = phys.current;
      const m  = mR.current, k = kR.current;

      /* Euler-Cromer */
      p.v += (-k * p.x / m) * DT;
      p.x += p.v * DT;

      const F  = -k * p.x;
      const T  = 2 * Math.PI * Math.sqrt(m / k);
      setTel({ disp: `${p.x.toFixed(2)} m`, vel: `${p.v.toFixed(2)} m/s`, force: `${F.toFixed(1)} N`, period: `${T.toFixed(2)} s` });

      drawBg(ctx, W, H);
      const SCALE  = 60;
      const wallX  = 45;
      const eqX    = W / 2;
      const blockH = 50, blockW = 50;
      const cy     = H / 2;
      const blockX = eqX + p.x * SCALE;

      /* Wall */
      ctx.fillStyle = "#1e3a5f"; ctx.fillRect(0, cy - 80, wallX, 160);

      /* Floor */
      ctx.fillStyle = "#0c1a2e"; ctx.fillRect(0, cy + blockH / 2, W, 5);

      /* Equilibrium dashed */
      ctx.setLineDash([6, 8]); ctx.strokeStyle = "rgba(99,102,241,0.25)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(eqX, 35); ctx.lineTo(eqX, H - 20); ctx.stroke();
      ctx.setLineDash([]);

      /* Spring coils */
      const coils = 12, coilH = 12;
      const springLen = blockX - wallX;
      ctx.strokeStyle = p.x > 0.05 ? "#ef4444" : p.x < -0.05 ? "#3b82f6" : "#6366f1";
      ctx.lineWidth = 2.5; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(wallX, cy);
      for (let i = 0; i <= coils; i++) {
        const sx = wallX + (springLen / (coils + 1)) * (i + 0.5);
        const sy = cy + (i % 2 === 0 ? -coilH : coilH);
        ctx.lineTo(sx, sy);
      }
      ctx.lineTo(blockX, cy); ctx.stroke();

      /* Force arrow */
      const arLen = Math.min(Math.abs(F) * SCALE / (k || 1) * 2.5, 90);
      if (arLen > 4) arw(ctx, blockX + blockW / 2, cy, blockX + blockW / 2 - Math.sign(F) * arLen, cy, "#ef4444", "F");

      /* Block */
      const gr = ctx.createLinearGradient(blockX, cy - blockH / 2, blockX, cy + blockH / 2);
      gr.addColorStop(0, "#374151"); gr.addColorStop(1, "#1f2937");
      rr(ctx, blockX, cy - blockH / 2, blockW, blockH, 6);
      ctx.fillStyle = gr; ctx.fill(); ctx.strokeStyle = "#4b5563"; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = "#9ca3af"; ctx.font = "bold 12px Inter, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(`${m}kg`, blockX + blockW / 2, cy);

      /* Energy bar */
      const ke = 0.5 * m * p.v * p.v, pe = 0.5 * k * p.x * p.x, tot = ke + pe;
      const bW2 = W * 0.55, bH2 = 8, bX2 = (W - bW2) / 2, bY2 = H - 30;
      rr(ctx, bX2, bY2, bW2, bH2, 4); ctx.fillStyle = "#0a1220"; ctx.fill();
      if (tot > 0) {
        rr(ctx, bX2, bY2, bW2 * (ke / tot), bH2, 4); ctx.fillStyle = "#f59e0b"; ctx.fill();
        rr(ctx, bX2 + bW2 * (ke / tot), bY2, bW2 * (pe / tot), bH2, 4); ctx.fillStyle = "#6366f1"; ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(rafRef.current); };
  }, [reset]);

  return (
    <SimCard title="🌀 Spring-Mass Oscillator" badge="Hooke's Law" desc="F = −kx. Euler-Cromer integration gives stable SHM. Period T = 2π√(m/k). Energy swings between KE (amber) and PE (blue).">
      <canvas ref={canvasRef} style={{ width: "100%", height: 300, borderRadius: 12, display: "block" }} />
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
        <Ctrl label="Mass" min={0.5} max={5} step={0.5} value={mass} unit=" kg" color="#f59e0b"
          onChange={v => { setMass(v); reset(); }} />
        <Ctrl label="Spring Constant k" min={5} max={60} step={5} value={kk} unit=" N/m" color="#6366f1"
          onChange={v => { setKK(v); reset(); }} />
        <Ctrl label="Initial Displacement" min={0.2} max={2} step={0.1} value={disp} unit=" m" color="#10b981"
          onChange={v => { setDisp(v); reset(); }} />
      </div>
      <Telem items={[
        { label: "Displacement", value: tel.disp,   color: "#10b981" },
        { label: "Velocity",     value: tel.vel,    color: "#f59e0b" },
        { label: "Spring Force", value: tel.force,  color: "#ef4444" },
        { label: "Period T",     value: tel.period, color: "#6366f1" },
      ]} />
      <div style={{ marginTop: 10 }}><Btn label="↺ Reset" onClick={reset} /></div>
    </SimCard>
  );
}

/* ════════════════════════════════════════════════════════════════
 * 4. FREE FALL vs TERMINAL VELOCITY
 * ════════════════════════════════════════════════════════════════ */
export function Sim_free_fall_drag_pro() {
  const [dragB, setDragB] = useState(2); /* drag coefficient b */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const bRef = useRef(dragB);
  useEffect(() => { bRef.current = dragB; }, [dragB]);

  const phys = useRef({ v1: 0, y1: 0, v2: 0, y2: 0, t: 0, vh1: [] as number[], vh2: [] as number[] });
  const [tel, setTel] = useState({ v1: "—", v2: "—", vt: "—", t: "—" });
  const M = 1; /* kg */

  const reset = useCallback(() => {
    Object.assign(phys.current, { v1: 0, y1: 0, v2: 0, y2: 0, t: 0, vh1: [], vh2: [] });
  }, []);

  useEffect(() => {
    reset();
    const canvas = canvasRef.current; if (!canvas) return;
    let alive = true;
    const tick = () => {
      if (!alive) return;
      const res = setupCanvas(canvas); if (!res) { rafRef.current = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const p  = phys.current;
      const b  = bRef.current;
      const groundY = H - 40;

      if (p.y1 < groundY - 60 || p.y2 < groundY - 60) {
        p.t += DT;
        if (p.y1 < groundY - 60) { p.v1 += G * DT; p.y1 += p.v1 * DT * 55; }
        if (p.y2 < groundY - 60) {
          p.v2 += (G - (b / M) * p.v2) * DT;
          p.y2 += p.v2 * DT * 55;
        }
        p.vh1.push(p.v1); p.vh2.push(p.v2);
        if (p.vh1.length > 350) { p.vh1.shift(); p.vh2.shift(); }
      } else {
        setTimeout(() => { if (alive) reset(); }, 1200);
      }

      const vt = (M * G) / b;
      setTel({ v1: `${p.v1.toFixed(1)} m/s`, v2: `${p.v2.toFixed(1)} m/s`, vt: `${vt.toFixed(1)} m/s`, t: `${p.t.toFixed(2)} s` });

      drawBg(ctx, W, H);
      ctx.fillStyle = "#0f1e35"; ctx.fillRect(0, groundY, W, H - groundY);
      ctx.fillStyle = "#1e3a5f"; ctx.fillRect(0, groundY, W, 3);

      const col1 = W * 0.22, col2 = W * 0.58;
      ctx.fillStyle = "#ef4444"; ctx.font = "bold 11px Inter, sans-serif"; ctx.textAlign = "center";
      ctx.fillText("No Air Drag", col1, 18);
      ctx.fillStyle = "#10b981"; ctx.fillText("Air Drag", col2, 18);

      /* Ball 1 (red) */
      const g1 = ctx.createRadialGradient(col1 - 4, p.y1 + 26, 2, col1, p.y1 + 30, 16);
      g1.addColorStop(0, "#fca5a5"); g1.addColorStop(1, "#ef4444");
      ctx.beginPath(); ctx.arc(col1, p.y1 + 30, 16, 0, Math.PI * 2);
      ctx.fillStyle = g1; ctx.fill();

      /* Ball 2 (green) */
      const g2 = ctx.createRadialGradient(col2 - 4, p.y2 + 26, 2, col2, p.y2 + 30, 16);
      g2.addColorStop(0, "#6ee7b7"); g2.addColorStop(1, "#10b981");
      ctx.beginPath(); ctx.arc(col2, p.y2 + 30, 16, 0, Math.PI * 2);
      ctx.fillStyle = g2; ctx.fill();

      /* Mini velocity graph */
      const gX = W * 0.75, gY = 30, gW = W * 0.22, gH = H * 0.5;
      rr(ctx, gX, gY, gW, gH, 8); ctx.fillStyle = "#0a1220"; ctx.fill();
      ctx.strokeStyle = "#0f1e35"; ctx.lineWidth = 1; ctx.stroke();
      const maxV = Math.max(...p.vh1, 1);
      if (p.vh1.length > 1) {
        const plotLine = (hist: number[], color: string) => {
          ctx.beginPath();
          for (let i = 0; i < hist.length; i++) {
            const px2 = gX + (i / hist.length) * gW;
            const py2 = gY + gH - 6 - (hist[i] / maxV) * (gH - 12);
            i === 0 ? ctx.moveTo(px2, py2) : ctx.lineTo(px2, py2);
          }
          ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
        };
        plotLine(p.vh1, "#ef4444"); plotLine(p.vh2, "#10b981");
      }
      /* Terminal velocity dashed line */
      const vtY = gY + gH - 6 - (vt / maxV) * (gH - 12);
      ctx.setLineDash([3, 4]); ctx.strokeStyle = "rgba(16,185,129,0.5)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(gX, Math.max(vtY, gY + 2)); ctx.lineTo(gX + gW, Math.max(vtY, gY + 2)); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#334155"; ctx.font = "9px Inter, sans-serif"; ctx.textAlign = "center";
      ctx.fillText("v(t)", gX + gW / 2, gY + 10);

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(rafRef.current); };
  }, [reset]);

  return (
    <SimCard title="🪂 Free Fall & Terminal Velocity" badge="Drag Force" desc="Red ball (no drag) accelerates indefinitely. Green ball reaches terminal velocity v_t = mg/b where drag = weight.">
      <canvas ref={canvasRef} style={{ width: "100%", height: 330, borderRadius: 12, display: "block" }} />
      <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
        <Ctrl label="Drag Coefficient (b)" min={0.5} max={8} step={0.5} value={dragB} unit="" color="#10b981"
          onChange={v => { setDragB(v); reset(); }} />
      </div>
      <Telem items={[
        { label: "v₁ (no drag)",  value: tel.v1, color: "#ef4444" },
        { label: "v₂ (drag)",     value: tel.v2, color: "#10b981" },
        { label: "Terminal v_t",  value: tel.vt, color: "#f59e0b" },
        { label: "Time Elapsed",  value: tel.t,  color: "#a78bfa" },
      ]} />
      <div style={{ marginTop: 10 }}><Btn label="↺ Reset" onClick={reset} /></div>
    </SimCard>
  );
}

/* ════════════════════════════════════════════════════════════════
 * 5. ATWOOD MACHINE — a = (m₁−m₂)g/(m₁+m₂)
 * ════════════════════════════════════════════════════════════════ */
export function Sim_atwood_machine_pro() {
  const [m1, setM1] = useState(3);
  const [m2, setM2] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const m1R = useRef(m1); const m2R = useRef(m2);
  useEffect(() => { m1R.current = m1; }, [m1]);
  useEffect(() => { m2R.current = m2; }, [m2]);

  const phys = useRef({ y: 0, v: 0, t: 0 });
  const [tel, setTel] = useState({ accel: "—", tension: "—", v: "—", t: "—" });

  const reset = useCallback(() => { phys.current = { y: 0, v: 0, t: 0 }; }, []);

  useEffect(() => {
    reset();
    const canvas = canvasRef.current; if (!canvas) return;
    let alive = true;
    const tick = () => {
      if (!alive) return;
      const res = setupCanvas(canvas); if (!res) { rafRef.current = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const p   = phys.current;
      const mv1 = m1R.current, mv2 = m2R.current;
      const a   = (mv1 - mv2) * G / (mv1 + mv2);
      const T   = 2 * mv1 * mv2 * G / (mv1 + mv2);
      const LIMIT = 110;

      if (Math.abs(p.y) < LIMIT) {
        p.v += a * DT * 75;
        p.y += p.v * DT;
        p.t += DT;
      } else {
        setTimeout(() => { if (alive) reset(); }, 800);
      }

      setTel({
        accel: `${a.toFixed(2)} m/s²`, tension: `${T.toFixed(1)} N`,
        v: `${(Math.abs(p.v) / 75).toFixed(2)} m/s`, t: `${p.t.toFixed(2)} s`,
      });

      drawBg(ctx, W, H);
      const px = W / 2, py = 55;
      const cx1 = px - 85, cx2 = px + 85;
      const restY = py + 110;
      const y1 = restY + p.y, y2 = restY - p.y;

      /* Support */
      ctx.fillStyle = "#1e3a5f"; ctx.fillRect(cx1 - 4, 0, 8, py); ctx.fillRect(cx2 - 4, 0, 8, py);

      /* Pulley */
      ctx.beginPath(); ctx.arc(px, py, 22, 0, Math.PI * 2);
      ctx.fillStyle = "#1e3a5f"; ctx.fill(); ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 4; ctx.stroke();
      ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#0f1e35"; ctx.fill(); ctx.strokeStyle = "#1d4ed8"; ctx.lineWidth = 2; ctx.stroke();

      /* Ropes */
      ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(cx1, y1 - 30); ctx.lineTo(cx1, py + 22); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx2, y2 - 30); ctx.lineTo(cx2, py + 22); ctx.stroke();
      /* Rope across top of pulley */
      ctx.beginPath(); ctx.moveTo(cx1, py + 22); ctx.arcTo(px, py - 5, cx2, py + 22, 22); ctx.lineTo(cx2, py + 22); ctx.stroke();

      /* Mass 1 */
      const mh1 = 30 + mv1 * 6;
      rr(ctx, cx1 - 30, y1 - mh1 / 2, 60, mh1, 6);
      ctx.fillStyle = "#ef4444"; ctx.fill(); ctx.strokeStyle = "#fca5a5"; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.font = `bold 13px Inter, sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(`${mv1} kg`, cx1, y1);

      /* Mass 2 */
      const mh2 = 30 + mv2 * 6;
      rr(ctx, cx2 - 30, y2 - mh2 / 2, 60, mh2, 6);
      ctx.fillStyle = "#3b82f6"; ctx.fill(); ctx.strokeStyle = "#93c5fd"; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.font = "bold 13px Inter, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(`${mv2} kg`, cx2, y2);

      /* Acceleration arrows */
      if (Math.abs(a) > 0.05) {
        const dir = a > 0 ? 1 : -1;
        arw(ctx, cx1, y1 + mh1 / 2 + 5, cx1, y1 + mh1 / 2 + 38 * dir, "#f59e0b", "a");
        arw(ctx, cx2, y2 - mh2 / 2 - 5, cx2, y2 - mh2 / 2 - 38 * dir, "#f59e0b");
      } else {
        ctx.fillStyle = "#10b981"; ctx.font = "bold 12px Inter, sans-serif"; ctx.textAlign = "center";
        ctx.fillText("BALANCED", px, py + 52);
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(rafRef.current); };
  }, [reset]);

  return (
    <SimCard title="⚖️ Atwood Machine" badge="Newton's 2nd Law" desc="Two masses over a frictionless pulley. a = (m₁−m₂)g/(m₁+m₂). Tension T = 2m₁m₂g/(m₁+m₂).">
      <canvas ref={canvasRef} style={{ width: "100%", height: 340, borderRadius: 12, display: "block" }} />
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 12 }}>
        <Ctrl label="Mass 1 (red, left)" min={1} max={8} step={0.5} value={m1} unit=" kg" color="#ef4444"
          onChange={v => { setM1(v); reset(); }} />
        <Ctrl label="Mass 2 (blue, right)" min={1} max={8} step={0.5} value={m2} unit=" kg" color="#3b82f6"
          onChange={v => { setM2(v); reset(); }} />
      </div>
      <Telem items={[
        { label: "Acceleration", value: tel.accel,   color: "#f59e0b" },
        { label: "Tension",      value: tel.tension, color: "#a78bfa" },
        { label: "Speed",        value: tel.v,       color: "#10b981" },
        { label: "Time",         value: tel.t,       color: "#6366f1" },
      ]} />
      <div style={{ marginTop: 10 }}><Btn label="↺ Reset" onClick={reset} /></div>
    </SimCard>
  );
}

/* ════════════════════════════════════════════════════════════════
 * 6. INCLINED PLANE FORCE ANALYSIS
 * ════════════════════════════════════════════════════════════════ */
export function Sim_inclined_plane_pro() {
  const [ang,  setAng]  = useState(30);
  const [mu,   setMu]   = useState(0.3);
  const [mass, setMass] = useState(5);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const aR = useRef(ang); const mR = useRef(mu); const msR = useRef(mass);
  useEffect(() => { aR.current = ang; }, [ang]);
  useEffect(() => { mR.current = mu; }, [mu]);
  useEffect(() => { msR.current = mass; }, [mass]);

  const phys = useRef({ x: 0, v: 0 });
  const [tel, setTel] = useState({ N: "—", Fp: "—", Ff: "—", a: "—" });

  const reset = useCallback(() => { phys.current = { x: 0, v: 0 }; }, []);

  useEffect(() => {
    reset();
    const canvas = canvasRef.current; if (!canvas) return;
    let alive = true;
    const tick = () => {
      if (!alive) return;
      const res = setupCanvas(canvas); if (!res) { rafRef.current = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const p  = phys.current;
      const θ  = aR.current * Math.PI / 180;
      const m  = msR.current, μ = mR.current;
      const Wt = m * G, N = Wt * Math.cos(θ), Fp = Wt * Math.sin(θ), Ff = μ * N;
      const Fnet = Fp - Ff, a = Fnet / m;
      const slides = Fnet > 0.01;

      if (slides) { p.v += a * DT * 55; p.x += p.v * DT; }
      if (p.x > 190) { p.x = 0; p.v = 0; }

      setTel({ N: `${N.toFixed(1)} N`, Fp: `${Fp.toFixed(1)} N`, Ff: `${Ff.toFixed(1)} N`, a: slides ? `${a.toFixed(2)} m/s²` : "0 m/s²" });

      drawBg(ctx, W, H);
      const bX = W * 0.12, bY = H - 42;
      const tipX = bX + (H - 80) / Math.tan(θ), tipY = 42;
      const sLen = Math.sqrt((tipX - bX) ** 2 + (tipY - bY) ** 2);

      /* Slope */
      ctx.fillStyle = "#0f1e35";
      ctx.beginPath(); ctx.moveTo(bX, bY); ctx.lineTo(tipX, tipY); ctx.lineTo(tipX, bY); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#1e3a5f"; ctx.lineWidth = 2; ctx.stroke();

      /* Angle arc */
      ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 1.5; ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.arc(tipX, bY, 36, -Math.PI / 2, -Math.PI / 2 + θ); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#f59e0b"; ctx.font = "bold 11px JetBrains Mono, monospace";
      ctx.textAlign = "center"; ctx.fillText(`${ang}°`, tipX - 46, bY - 16);

      /* Block on slope */
      const su = { x: (bX - tipX) / sLen, y: (bY - tipY) / sLen };
      const nu = { x: -su.y, y: su.x };
      const bpos = { x: tipX + su.x * p.x + nu.x * 22, y: tipY + su.y * p.x + nu.y * 22 };

      ctx.save();
      ctx.translate(bpos.x, bpos.y); ctx.rotate(-θ);
      rr(ctx, -23, -23, 46, 46, 6);
      ctx.fillStyle = slides ? "#ef4444" : "#374151"; ctx.fill();
      ctx.strokeStyle = slides ? "#fca5a5" : "#4b5563"; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.font = "bold 11px Inter, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(`${m}kg`, 0, 0); ctx.restore();

      /* Force arrows */
      const S = 2.2;
      arw(ctx, bpos.x, bpos.y, bpos.x, bpos.y + Wt * S * 0.45, "#ef4444", "W");
      arw(ctx, bpos.x, bpos.y, bpos.x + nu.x * N * S * 0.45, bpos.y + nu.y * N * S * 0.45, "#10b981", "N");
      arw(ctx, bpos.x, bpos.y, bpos.x - su.x * Ff * S * 0.45, bpos.y - su.y * Ff * S * 0.45, "#f59e0b", "f");

      ctx.fillStyle = slides ? "#ef4444" : "#10b981"; ctx.font = "bold 13px Inter, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText(slides ? "▼ SLIDING" : "✓ STATIC", W / 2, 10);

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(rafRef.current); };
  }, [reset]);

  return (
    <SimCard title="📐 Inclined Plane Forces" badge="Force Components" desc="Forces decomposed along & perpendicular to slope. Block slides if mg·sinθ > μmg·cosθ, i.e., tanθ > μ.">
      <canvas ref={canvasRef} style={{ width: "100%", height: 320, borderRadius: 12, display: "block" }} />
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
        <Ctrl label="Angle" min={5} max={75} value={ang} unit="°" color="#f59e0b" onChange={v => { setAng(v); reset(); }} />
        <Ctrl label="Friction μ" min={0.05} max={0.9} step={0.05} value={mu} unit="" color="#6366f1" onChange={v => { setMu(v); reset(); }} />
        <Ctrl label="Mass" min={1} max={10} value={mass} unit=" kg" color="#10b981" onChange={v => { setMass(v); reset(); }} />
      </div>
      <Telem items={[
        { label: "Normal N",   value: tel.N,  color: "#10b981" },
        { label: "Parallel F", value: tel.Fp, color: "#ef4444" },
        { label: "Friction f", value: tel.Ff, color: "#f59e0b" },
        { label: "Accel a",    value: tel.a,  color: "#a78bfa" },
      ]} />
      <div style={{ marginTop: 10 }}><Btn label="↺ Reset" onClick={reset} /></div>
    </SimCard>
  );
}

/* ════════════════════════════════════════════════════════════════
 * 7. CIRCULAR MOTION — F_c = mv²/r
 * ════════════════════════════════════════════════════════════════ */
export function Sim_circular_motion_pro() {
  const [spd, setSpd]    = useState(4);
  const [rad, setRad]    = useState(100);
  const [mass, setMass]  = useState(1);
  const [cut, setCut]    = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const sR = useRef(spd); const rR = useRef(rad); const mR = useRef(mass);
  useEffect(() => { sR.current = spd; }, [spd]);
  useEffect(() => { rR.current = rad; }, [rad]);
  useEffect(() => { mR.current = mass; }, [mass]);

  const phys = useRef({ theta: 0, tx: 0, ty: 0, tvx: 0, tvy: 0,
    trail: [] as { x: number; y: number }[] });
  const cutR = useRef(cut);
  useEffect(() => { cutR.current = cut; }, [cut]);

  const [tel, setTel] = useState({ Fc: "—", T: "—", omega: "—" });

  const reset = useCallback(() => {
    const p = phys.current;
    p.theta = 0; p.tx = 0; p.ty = 0; p.tvx = 0; p.tvy = 0; p.trail = [];
    setCut(false);
  }, []);

  useEffect(() => {
    reset();
    const canvas = canvasRef.current; if (!canvas) return;
    let alive = true;
    const tick = () => {
      if (!alive) return;
      const res = setupCanvas(canvas); if (!res) { rafRef.current = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const p   = phys.current;
      const v   = sR.current, r = rR.current, m = mR.current;
      const cx  = W / 2, cy = H / 2;
      const omega = v / r * 0.8; /* adjusted for visual */

      if (!cutR.current) {
        p.theta += omega * DT;
        const bx = cx + r * Math.cos(p.theta);
        const by = cy + r * Math.sin(p.theta);
        p.trail.push({ x: bx, y: by });
        if (p.trail.length > 280) p.trail.shift();
        const Fc = m * v * v / (r / 80 + 0.01);
        const T  = 2 * Math.PI * r / v;
        setTel({ Fc: `${Fc.toFixed(1)} N`, T: `${T.toFixed(2)} s`, omega: `${omega.toFixed(2)} rad/s` });
      } else {
        p.tx += p.tvx * DT * 60;
        p.ty += p.tvy * DT * 60;
        if (Math.abs(p.tx) > W || Math.abs(p.ty) > H) reset();
      }

      drawBg(ctx, W, H);

      /* Orbit guide */
      ctx.strokeStyle = "rgba(99,102,241,0.12)"; ctx.lineWidth = 1; ctx.setLineDash([5, 8]);
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);

      const bx = cutR.current
        ? cx + r * Math.cos(p.theta) + p.tx
        : cx + r * Math.cos(p.theta);
      const by = cutR.current
        ? cy + r * Math.sin(p.theta) + p.ty
        : cy + r * Math.sin(p.theta);

      /* Trail (only when orbiting) */
      if (!cutR.current && p.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(p.trail[0].x, p.trail[0].y);
        for (const pt of p.trail) ctx.lineTo(pt.x, pt.y);
        ctx.strokeStyle = "rgba(99,102,241,0.4)"; ctx.lineWidth = 2; ctx.stroke();
      }

      /* String */
      if (!cutR.current) {
        ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(bx, by); ctx.stroke();
      }

      /* Pivot */
      ctx.fillStyle = "#475569"; ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2); ctx.fill();

      /* Centripetal force arrow & velocity arrow */
      if (!cutR.current) {
        const dx = cx - bx, dy = cy - by, len = Math.sqrt(dx * dx + dy * dy);
        if (len > 5) arw(ctx, bx, by, bx + dx / len * 50, by + dy / len * 50, "#ef4444", "Fc");
        const tx_ = -Math.sin(p.theta), ty_ = Math.cos(p.theta);
        arw(ctx, bx, by, bx + tx_ * 45, by + ty_ * 45, "#10b981", "v");
      }

      /* Ball */
      const bg = ctx.createRadialGradient(bx - 4, by - 4, 2, bx, by, 14);
      bg.addColorStop(0, "#c4b5fd"); bg.addColorStop(1, "#7c3aed");
      ctx.beginPath(); ctx.arc(bx, by, 14, 0, Math.PI * 2);
      ctx.fillStyle = bg; ctx.fill(); ctx.strokeStyle = "#a78bfa"; ctx.lineWidth = 2; ctx.stroke();

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(rafRef.current); };
  }, [reset]);

  const cutString = () => {
    const p = phys.current;
    p.tvx = -Math.sin(p.theta) * sR.current;
    p.tvy =  Math.cos(p.theta) * sR.current;
    p.tx  = 0; p.ty = 0;
    setCut(true);
  };

  return (
    <SimCard title="⭕ Circular Motion" badge="Centripetal Force" desc="Ball on string. F_c = mv²/r always points to center. Cut the string — ball flies off tangentially (Newton's 1st Law)!">
      <canvas ref={canvasRef} style={{ width: "100%", height: 330, borderRadius: 12, display: "block" }} />
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
        <Ctrl label="Speed" min={1} max={10} value={spd} unit=" m/s" color="#10b981" onChange={setSpd} />
        <Ctrl label="Radius" min={40} max={140} step={10} value={rad} unit=" px" color="#6366f1" onChange={setRad} />
        <Ctrl label="Mass" min={0.5} max={5} step={0.5} value={mass} unit=" kg" color="#f59e0b" onChange={setMass} />
      </div>
      <Telem items={[
        { label: "F_centripetal", value: tel.Fc,    color: "#ef4444" },
        { label: "Period T",      value: tel.T,     color: "#6366f1" },
        { label: "ω (rad/s)",     value: tel.omega, color: "#f59e0b" },
        { label: "Direction",     value: "Tangential", color: "#10b981" },
      ]} />
      <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
        <Btn label="✂️ Cut String" onClick={cutString} bg="#ef4444" fg="#fff" />
        <Btn label="↺ Reset" onClick={reset} />
      </div>
    </SimCard>
  );
}

/* ════════════════════════════════════════════════════════════════
 * 8. IMPULSE-MOMENTUM THEOREM — J = Δp = F·Δt
 * ════════════════════════════════════════════════════════════════ */
export function Sim_impulse_momentum_pro() {
  const [mass,  setMass]  = useState(2);
  const [v0,    setV0]    = useState(10);
  const [e_,    setE]     = useState(0.8);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const mR = useRef(mass); const vR = useRef(v0); const eR = useRef(e_);
  useEffect(() => { mR.current = mass; }, [mass]);
  useEffect(() => { vR.current = v0; }, [v0]);
  useEffect(() => { eR.current = e_; }, [e_]);

  const phys = useRef({ x: 60, vx: 0, phase: "approach" as "approach" | "rebound", ct: 0, fH: [] as number[] });
  const [tel, setTel] = useState({ pb: "—", pa: "—", J: "—", Fp: "—" });

  const reset = useCallback(() => {
    Object.assign(phys.current, { x: 60, vx: vR.current * 3, phase: "approach", ct: 0, fH: [] });
  }, []);

  useEffect(() => {
    reset();
    const canvas = canvasRef.current; if (!canvas) return;
    let alive = true;
    const COLL_DUR = 0.10;

    const tick = () => {
      if (!alive) return;
      const res = setupCanvas(canvas); if (!res) { rafRef.current = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const p  = phys.current;
      const m  = mR.current, v = vR.current, e = eR.current;
      const wX = W - 65;

      let force = 0;
      if (p.phase === "approach") {
        p.x += p.vx * DT * 60;
        if (p.x >= wX - 22) { p.phase = "rebound" as "approach" | "rebound"; p.ct = 0; }
      } else {
        p.ct += DT;
        const cr = p.ct / COLL_DUR;
        if (cr < 1) {
          const pk = m * v * (1 + e) / COLL_DUR;
          force = pk * (cr < 0.5 ? cr / 0.5 : (1 - cr) / 0.5);
        } else {
          p.vx = -e * Math.abs(p.vx);
          p.phase = "approach";
          p.x += p.vx * DT * 60;
          if (p.x < 50) setTimeout(() => { if (alive) reset(); }, 600);
        }
      }

      p.fH.push(force);
      if (p.fH.length > 300) p.fH.shift();

      const pb = m * v, pa = m * v * e;
      const J  = m * v * (1 + e);
      const Fp = J / COLL_DUR;
      setTel({ pb: `${pb.toFixed(1)} kg·m/s`, pa: `${pa.toFixed(1)} kg·m/s`, J: `${J.toFixed(1)} N·s`, Fp: `${Fp.toFixed(0)} N` });

      drawBg(ctx, W, H);
      const mainY = H * 0.35;

      /* Wall */
      ctx.fillStyle = "#1e3a5f"; ctx.fillRect(wX, mainY - 65, W - wX, 130);
      ctx.fillStyle = "#0f2040"; ctx.fillRect(wX, mainY - 65, 4, 130);

      /* Floor */
      ctx.fillStyle = "#0c1a2e"; ctx.fillRect(0, mainY + 24, wX, 4);

      /* Ball */
      const bg2 = ctx.createRadialGradient(p.x - 5, mainY - 5, 2, p.x, mainY, 22);
      bg2.addColorStop(0, "#6ee7b7"); bg2.addColorStop(1, "#059669");
      ctx.beginPath(); ctx.arc(p.x, mainY, 22, 0, Math.PI * 2);
      ctx.fillStyle = bg2; ctx.fill();
      ctx.strokeStyle = "#6ee7b7"; ctx.lineWidth = 2; ctx.stroke();

      /* Velocity arrow */
      const aLen = Math.min(Math.abs(p.vx) * 1.5, 60);
      const aDir = p.vx > 0 ? 1 : -1;
      arw(ctx, p.x, mainY, p.x + aDir * aLen, mainY, "#f59e0b");

      /* F-t graph */
      const gX = 20, gY = mainY + 45, gW = W - 40, gH = H - gY - 18;
      rr(ctx, gX, gY, gW, gH, 8); ctx.fillStyle = "#0a1220"; ctx.fill();
      const mxF = Math.max(...p.fH, 1);
      if (p.fH.length > 1) {
        ctx.beginPath();
        for (let i = 0; i < p.fH.length; i++) {
          const px2 = gX + (i / p.fH.length) * gW;
          const py2 = gY + gH - 5 - (p.fH[i] / mxF) * (gH - 10);
          i === 0 ? ctx.moveTo(px2, py2) : ctx.lineTo(px2, py2);
        }
        ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 2; ctx.stroke();
      }
      ctx.fillStyle = "#334155"; ctx.font = "9px Inter, sans-serif"; ctx.textAlign = "left";
      ctx.fillText("Force F(t) — area = impulse J", gX + 5, gY + 12);

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(rafRef.current); };
  }, [reset]);

  return (
    <SimCard title="💥 Impulse-Momentum Theorem" badge="J = Δp" desc="Ball hits wall. Impulse J = F·Δt = m·Δv. The F-t graph area equals the change in momentum.">
      <canvas ref={canvasRef} style={{ width: "100%", height: 310, borderRadius: 12, display: "block" }} />
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
        <Ctrl label="Mass" min={0.5} max={5} step={0.5} value={mass} unit=" kg" color="#f59e0b" onChange={v => { setMass(v); reset(); }} />
        <Ctrl label="Speed" min={2} max={20} value={v0} unit=" m/s" color="#10b981" onChange={v => { setV0(v); reset(); }} />
        <Ctrl label="Restitution e" min={0.2} max={1} step={0.05} value={e_} unit="" color="#6366f1" onChange={v => { setE(v); reset(); }} />
      </div>
      <Telem items={[
        { label: "p before",  value: tel.pb, color: "#ef4444" },
        { label: "p after",   value: tel.pa, color: "#10b981" },
        { label: "Impulse J", value: tel.J,  color: "#f59e0b" },
        { label: "Peak Force",value: tel.Fp, color: "#a78bfa" },
      ]} />
      <div style={{ marginTop: 10 }}><Btn label="↺ Reset" onClick={reset} /></div>
    </SimCard>
  );
}

/* ════════════════════════════════════════════════════════════════
 * 9. CAR BRAKING DISTANCE — s = v₀²/(2μg)
 * ════════════════════════════════════════════════════════════════ */
export function Sim_car_braking_pro() {
  const [v0,  setV0]  = useState(20);
  const [mu,  setMu]  = useState(0.5);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const v0R = useRef(v0); const muR = useRef(mu);
  useEffect(() => { v0R.current = v0; }, [v0]);
  useEffect(() => { muR.current = mu; }, [mu]);

  const phys = useRef({ x: 0, v: 0, dist: 0, stopped: false });
  const [tel, setTel] = useState({ spd: "—", dist: "—", sD: "—", a: "—" });

  const reset = useCallback(() => {
    phys.current = { x: 0, v: v0R.current, dist: 0, stopped: false };
  }, []);

  useEffect(() => {
    reset();
    const canvas = canvasRef.current; if (!canvas) return;
    let alive = true;
    const tick = () => {
      if (!alive) return;
      const res = setupCanvas(canvas); if (!res) { rafRef.current = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const p  = phys.current;
      const mu = muR.current;
      const a  = -mu * G;
      const sD = v0R.current * v0R.current / (2 * mu * G);

      if (!p.stopped) {
        p.v = Math.max(0, p.v + a * DT);
        p.x += p.v * DT * 5;
        p.dist += p.v * DT;
        if (p.v <= 0) { p.stopped = true; setTimeout(() => { if (alive) reset(); }, 2000); }
      }

      setTel({
        spd:  `${p.v.toFixed(1)} m/s`, dist: `${p.dist.toFixed(1)} m`,
        sD:   `${sD.toFixed(1)} m`,    a:    `${Math.abs(a).toFixed(2)} m/s²`,
      });

      drawBg(ctx, W, H);
      const roadY = H * 0.55;

      /* Road */
      ctx.fillStyle = "#0f1e35"; ctx.fillRect(0, roadY, W, H - roadY);
      ctx.fillStyle = "#1a2f50"; ctx.fillRect(0, roadY, W, 5);
      ctx.strokeStyle = "#1e3a5f"; ctx.lineWidth = 3; ctx.setLineDash([22, 14]);
      ctx.beginPath(); ctx.moveTo(0, roadY + 28); ctx.lineTo(W, roadY + 28); ctx.stroke();
      ctx.setLineDash([]);

      /* Skid marks */
      if (p.x > 0) {
        const alpha = Math.min(0.6, p.dist / sD * 0.7);
        ctx.strokeStyle = `rgba(0,0,0,${alpha})`; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(62, roadY + 4); ctx.lineTo(62 + p.x, roadY + 4); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(62, roadY + 12); ctx.lineTo(62 + p.x, roadY + 12); ctx.stroke();
      }

      /* Car */
      const carX = 62 + p.x, cY = roadY - 38;
      rr(ctx, carX, cY, 84, 38, 8); ctx.fillStyle = "#2563eb"; ctx.fill();
      rr(ctx, carX + 12, cY - 22, 60, 24, 6); ctx.fillStyle = "#1d4ed8"; ctx.fill();
      ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 2; ctx.stroke();
      for (const wx of [carX + 18, carX + 66]) {
        ctx.fillStyle = "#1f2937"; ctx.beginPath(); ctx.arc(wx, roadY + 2, 11, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#6b7280"; ctx.beginPath(); ctx.arc(wx, roadY + 2, 4, 0, Math.PI * 2); ctx.fill();
      }
      if (!p.stopped && p.v > 0) arw(ctx, carX, cY + 19, carX - 52, cY + 19, "#ef4444", "F_brake");

      /* Stopping distance marker */
      const stopX = Math.min(62 + sD * 5, W - 28);
      ctx.setLineDash([3, 5]); ctx.strokeStyle = "#10b981"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(stopX, roadY - 55); ctx.lineTo(stopX, roadY + 14); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#10b981"; ctx.font = "10px JetBrains Mono, monospace"; ctx.textAlign = "center";
      ctx.fillText(`s=${sD.toFixed(0)}m`, stopX, roadY - 58);

      ctx.fillStyle = p.stopped ? "#10b981" : "#f59e0b";
      ctx.font = "bold 13px JetBrains Mono, monospace"; ctx.textAlign = "center";
      ctx.fillText(p.stopped ? "STOPPED ✓" : `${p.v.toFixed(1)} m/s`, carX + 42, cY - 30);

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(rafRef.current); };
  }, [reset]);

  return (
    <SimCard title="🚗 Car Braking Distance" badge="Newton's 2nd Law" desc="F = μmg, deceleration a = μg, stopping distance s = v₀²/(2μg). Faster speed or lower friction = longer stop.">
      <canvas ref={canvasRef} style={{ width: "100%", height: 300, borderRadius: 12, display: "block" }} />
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 12 }}>
        <Ctrl label="Initial Speed" min={5} max={40} value={v0} unit=" m/s" color="#f59e0b" onChange={v => { setV0(v); reset(); }} />
        <Ctrl label="Road Friction μ" min={0.1} max={0.9} step={0.05} value={mu} unit="" color="#6366f1" onChange={v => { setMu(v); reset(); }} />
      </div>
      <Telem items={[
        { label: "Current Speed",   value: tel.spd, color: "#f59e0b" },
        { label: "Distance Gone",   value: tel.dist, color: "#6366f1" },
        { label: "Stop Distance",   value: tel.sD,  color: "#10b981" },
        { label: "Deceleration",    value: tel.a,   color: "#ef4444" },
      ]} />
      <div style={{ marginTop: 10 }}><Btn label="↺ Reset" onClick={reset} /></div>
    </SimCard>
  );
}

/* ════════════════════════════════════════════════════════════════
 * 10. 2D VECTOR FORCE ADDITION — R = F₁ + F₂
 * ════════════════════════════════════════════════════════════════ */
export function Sim_vector_addition_pro() {
  const [f1m, setF1m] = useState(60); const [f1a, setF1a] = useState(30);
  const [f2m, setF2m] = useState(40); const [f2a, setF2a] = useState(130);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const f1mR = useRef(f1m); const f1aR = useRef(f1a);
  const f2mR = useRef(f2m); const f2aR = useRef(f2a);
  useEffect(() => { f1mR.current = f1m; }, [f1m]);
  useEffect(() => { f1aR.current = f1a; }, [f1a]);
  useEffect(() => { f2mR.current = f2m; }, [f2m]);
  useEffect(() => { f2aR.current = f2a; }, [f2a]);

  const [tel, setTel] = useState({ Rx: "—", Ry: "—", mag: "—", angle: "—" });

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    let alive = true;
    const tick = () => {
      if (!alive) return;
      const res = setupCanvas(canvas); if (!res) { rafRef.current = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const ox = W / 2, oy = H / 2, SC = 2.0;
      const a1 = f1aR.current * Math.PI / 180, a2 = f2aR.current * Math.PI / 180;
      const f1x = f1mR.current * Math.cos(a1), f1y = -f1mR.current * Math.sin(a1);
      const f2x = f2mR.current * Math.cos(a2), f2y = -f2mR.current * Math.sin(a2);
      const Rx  = f1x + f2x, Ry = f1y + f2y;
      const Rmag = Math.sqrt(Rx * Rx + Ry * Ry);
      const Rang = Math.atan2(-Ry, Rx) * 180 / Math.PI;

      setTel({
        Rx: `${Rx.toFixed(1)} N`, Ry: `${(-Ry).toFixed(1)} N`,
        mag: `${Rmag.toFixed(1)} N`, angle: `${Rang.toFixed(1)}°`,
      });

      drawBg(ctx, W, H);
      ctx.strokeStyle = "rgba(255,255,255,0.04)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(W, oy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, H); ctx.stroke();

      /* Parallelogram */
      ctx.strokeStyle = "rgba(16,185,129,0.2)"; ctx.lineWidth = 1.5; ctx.setLineDash([5, 7]);
      ctx.beginPath();
      ctx.moveTo(ox + f1x * SC, oy + f1y * SC);
      ctx.lineTo(ox + Rx * SC, oy + Ry * SC);
      ctx.lineTo(ox + f2x * SC, oy + f2y * SC);
      ctx.stroke(); ctx.setLineDash([]);

      arw(ctx, ox, oy, ox + f1x * SC, oy + f1y * SC, "#6366f1", `F₁=${f1mR.current}N`, 3);
      arw(ctx, ox, oy, ox + f2x * SC, oy + f2y * SC, "#f59e0b", `F₂=${f2mR.current}N`, 3);
      arw(ctx, ox, oy, ox + Rx  * SC, oy + Ry  * SC, "#10b981", `R=${Rmag.toFixed(0)}N`, 3.5);

      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(ox, oy, 5, 0, Math.PI * 2); ctx.fill();

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(rafRef.current); };
  }, [f1m, f1a, f2m, f2a]);

  return (
    <SimCard title="➕ 2D Vector Force Addition" badge="Resultant Force" desc="Parallelogram law: R = F₁ + F₂. Adjust magnitudes and angles to see how the resultant changes.">
      <canvas ref={canvasRef} style={{ width: "100%", height: 310, borderRadius: 12, display: "block" }} />
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
        <Ctrl label="F₁ Magnitude" min={10} max={120} value={f1m} unit=" N" color="#6366f1" onChange={setF1m} />
        <Ctrl label="F₁ Angle" min={0} max={360} value={f1a} unit="°" color="#6366f1" onChange={setF1a} />
        <Ctrl label="F₂ Magnitude" min={10} max={120} value={f2m} unit=" N" color="#f59e0b" onChange={setF2m} />
        <Ctrl label="F₂ Angle" min={0} max={360} value={f2a} unit="°" color="#f59e0b" onChange={setF2a} />
      </div>
      <Telem items={[
        { label: "Rx (East)",  value: tel.Rx,    color: "#6366f1" },
        { label: "Ry (North)", value: tel.Ry,    color: "#f59e0b" },
        { label: "|R| Total",  value: tel.mag,   color: "#10b981" },
        { label: "Angle",      value: tel.angle, color: "#a78bfa" },
      ]} />
    </SimCard>
  );
}

/* ════════════════════════════════════════════════════════════════
 * 11. EXPLOSION & MOMENTUM CONSERVATION
 * ════════════════════════════════════════════════════════════════ */
export function Sim_explosion_recoil_pro() {
  const [m1, setM1] = useState(3);
  const [m2, setM2] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const m1R = useRef(m1); const m2R = useRef(m2);
  useEffect(() => { m1R.current = m1; }, [m1]);
  useEffect(() => { m2R.current = m2; }, [m2]);

  const phys = useRef({ x1: 0, x2: 0, v1: 0, v2: 0, exploded: false });
  const [tel, setTel] = useState({ p1: "—", p2: "—", total: "—", ratio: "—" });

  const reset = useCallback(() => {
    phys.current = { x1: 0, x2: 0, v1: 0, v2: 0, exploded: false };
  }, []);

  const explode = useCallback(() => {
    const mv1 = m1R.current, mv2 = m2R.current;
    const v2 = 4; /* m2 gets v2 right, m1 gets v1 left by momentum conservation */
    const v1 = -(mv2 / mv1) * v2;
    phys.current.v1 = v1 * 55; phys.current.v2 = v2 * 55;
    phys.current.exploded = true;
  }, []);

  useEffect(() => {
    reset();
    const canvas = canvasRef.current; if (!canvas) return;
    let alive = true;
    const tick = () => {
      if (!alive) return;
      const res = setupCanvas(canvas); if (!res) { rafRef.current = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const p  = phys.current;
      const mv1 = m1R.current, mv2 = m2R.current;
      const cx  = W / 2, cY = H * 0.45;

      if (p.exploded) {
        p.x1 += p.v1 * DT; p.x2 += p.v2 * DT;
        if (Math.abs(p.x1) > W * 0.45 || Math.abs(p.x2) > W * 0.45) {
          setTimeout(() => { if (alive) reset(); }, 400);
        }
      }

      const p1 = mv1 * (p.v1 / 55), p2 = mv2 * (p.v2 / 55);
      setTel({ p1: `${p1.toFixed(1)}`, p2: `${p2.toFixed(1)}`, total: `${(p1 + p2).toFixed(2)}`, ratio: `${(mv1 / mv2).toFixed(1)}x` });

      drawBg(ctx, W, H);

      /* Rail */
      ctx.fillStyle = "#0f1e35"; ctx.fillRect(30, cY + 32, W - 60, 7);

      /* Spring (when not exploded) */
      if (!p.exploded) {
        const sW = 56;
        for (let i = 0; i < 9; i++) {
          const sx = cx - sW / 2 + (sW / 9) * i;
          ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.moveTo(sx, cY + 8); ctx.lineTo(sx + sW / 18, cY + (i % 2 === 0 ? -7 : 7) + 8); ctx.stroke();
        }
        ctx.fillStyle = "#f59e0b"; ctx.font = "bold 11px Inter, sans-serif"; ctx.textAlign = "center";
        ctx.fillText("↓ EXPLODE", cx, cY - 24);
      }

      /* Carts */
      const drawCart = (x: number, mass: number, color: string, label: string) => {
        const cw = 44 + mass * 9, ch = 32;
        rr(ctx, cx + x - cw / 2, cY - ch, cw, ch, 7);
        ctx.fillStyle = color; ctx.fill(); ctx.strokeStyle = "#475569"; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = "#fff"; ctx.font = `bold ${Math.min(13, 9 + mass)}px Inter, sans-serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(`${mass}kg`, cx + x, cY - ch / 2);
        for (const wx of [cx + x - cw / 3, cx + x + cw / 3]) {
          ctx.fillStyle = "#1f2937"; ctx.beginPath(); ctx.arc(wx, cY + 2, 7, 0, Math.PI * 2); ctx.fill();
        }
        if (p.exploded) {
          const vel = label === "m1" ? p.v1 : p.v2;
          const d = vel > 0 ? 1 : -1;
          arw(ctx, cx + x, cY - ch - 5, cx + x + d * 44, cY - ch - 5, "#f59e0b");
        }
      };

      drawCart(-60, mv1, "#3b82f6", "m1");
      drawCart(60,  mv2, "#ef4444", "m2");

      /* Total momentum label */
      ctx.fillStyle = p.exploded ? "#10b981" : "#334155";
      ctx.font = "bold 12px Inter, sans-serif"; ctx.textAlign = "center";
      ctx.fillText(p.exploded ? `Total p = ${(p1 + p2).toFixed(2)} ≈ 0 ✓` : "Total momentum = 0 (at rest)", cx, H - 20);

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(rafRef.current); };
  }, [reset]);

  return (
    <SimCard title="💣 Explosion & Momentum Conservation" badge="Conservation" desc="System at rest → spring releases → carts fly apart. m₁v₁ + m₂v₂ = 0 always. Heavier cart moves slower.">
      <canvas ref={canvasRef} style={{ width: "100%", height: 310, borderRadius: 12, display: "block" }} />
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 12 }}>
        <Ctrl label="Mass 1 (blue)" min={1} max={8} step={0.5} value={m1} unit=" kg" color="#3b82f6" onChange={v => { setM1(v); reset(); }} />
        <Ctrl label="Mass 2 (red)"  min={1} max={8} step={0.5} value={m2} unit=" kg" color="#ef4444" onChange={v => { setM2(v); reset(); }} />
      </div>
      <Telem items={[
        { label: "p₁ (kg·m/s)", value: tel.p1,    color: "#3b82f6" },
        { label: "p₂ (kg·m/s)", value: tel.p2,    color: "#ef4444" },
        { label: "Total p",     value: tel.total,  color: "#10b981" },
        { label: "Mass Ratio",  value: tel.ratio,  color: "#f59e0b" },
      ]} />
      <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
        <Btn label="💥 Explode!" onClick={explode} bg="#ef4444" fg="#fff" />
        <Btn label="↺ Reset" onClick={reset} />
      </div>
    </SimCard>
  );
}

/* ════════════════════════════════════════════════════════════════
 * 12. FRICTION — STATIC → KINETIC TRANSITION
 * ════════════════════════════════════════════════════════════════ */
export function Sim_friction_transition() {
  const [mus,  setMus]  = useState(0.5);
  const [muk,  setMuk]  = useState(0.35);
  const [mass, setMass] = useState(5);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const musR = useRef(mus); const mukR = useRef(muk); const massR = useRef(mass);
  useEffect(() => { musR.current = mus; }, [mus]);
  useEffect(() => { mukR.current = muk; }, [muk]);
  useEffect(() => { massR.current = mass; }, [mass]);

  const phys = useRef({ t: 0, x: 0, v: 0, sliding: false, Fa: 0, fH: [] as { fa: number; ff: number }[] });
  const [tel, setTel] = useState({ Fa: "—", ff: "—", status: "STATIC", a: "—" });

  const reset = useCallback(() => {
    phys.current = { t: 0, x: 0, v: 0, sliding: false, Fa: 0, fH: [] };
  }, []);

  useEffect(() => {
    reset();
    const canvas = canvasRef.current; if (!canvas) return;
    let alive = true;
    const tick = () => {
      if (!alive) return;
      const res = setupCanvas(canvas); if (!res) { rafRef.current = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const p  = phys.current;
      const m  = massR.current, mus_ = musR.current, muk_ = mukR.current;
      const fsMax = mus_ * m * G, fk = muk_ * m * G;
      const ramp = 5; /* seconds to ramp force */

      p.t += DT;
      if (p.t > ramp + 3) { p.t = 0; p.x = 0; p.v = 0; p.sliding = false; p.fH = []; }

      p.Fa = Math.min((p.t / ramp) * fsMax * 2.2, fsMax * 2.2);

      let ff = 0, a = 0;
      if (!p.sliding) {
        if (p.Fa > fsMax) p.sliding = true;
        else ff = p.Fa;
      }
      if (p.sliding) {
        ff = fk; a = (p.Fa - fk) / m;
        p.v += a * DT; p.x += p.v * DT * 38;
        if (p.x > W * 0.55) p.x = 0;
      }

      p.fH.push({ fa: p.Fa, ff });
      if (p.fH.length > 380) p.fH.shift();

      setTel({ Fa: `${p.Fa.toFixed(1)} N`, ff: `${ff.toFixed(1)} N`, status: p.sliding ? "SLIDING" : "STATIC", a: `${a.toFixed(2)} m/s²` });

      drawBg(ctx, W, H);
      const floorY = H * 0.44;
      ctx.fillStyle = "#0f1e35"; ctx.fillRect(0, floorY, W, H - floorY);
      ctx.fillStyle = "#1e3a5f"; ctx.fillRect(0, floorY, W, 4);

      /* Block */
      const bX = 56 + p.x, bH = 48, bW = 62;
      rr(ctx, bX, floorY - bH, bW, bH, 6);
      ctx.fillStyle = p.sliding ? "#ef4444" : "#374151"; ctx.fill();
      ctx.strokeStyle = p.sliding ? "#fca5a5" : "#4b5563"; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.font = "bold 12px Inter, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(`${m}kg`, bX + bW / 2, floorY - bH / 2);

      arw(ctx, bX + bW, floorY - bH / 2, bX + bW + 48, floorY - bH / 2, "#f59e0b", `${p.Fa.toFixed(0)}N`);

      /* F-t graph */
      const gX = 12, gY = floorY + 18, gW = W - 24, gH = H - gY - 14;
      rr(ctx, gX, gY, gW, gH, 8); ctx.fillStyle = "#0a1220"; ctx.fill();
      const maxF = fsMax * 1.15;
      if (p.fH.length > 1) {
        const plotFH = (key: "fa" | "ff", color: string, lw: number) => {
          ctx.beginPath();
          for (let i = 0; i < p.fH.length; i++) {
            const px2 = gX + (i / p.fH.length) * gW;
            const py2 = gY + gH - 5 - (p.fH[i][key] / maxF) * (gH - 10);
            i === 0 ? ctx.moveTo(px2, py2) : ctx.lineTo(px2, py2);
          }
          ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.stroke();
        };
        plotFH("fa", "#f59e0b", 1.5);
        plotFH("ff", "#ef4444", 2);
      }
      ctx.fillStyle = "#f59e0b"; ctx.font = "9px Inter, sans-serif"; ctx.textAlign = "left";
      ctx.fillText("F_applied", gX + 4, gY + 12);
      ctx.fillStyle = "#ef4444"; ctx.fillText("friction", gX + 4, gY + 23);

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(rafRef.current); };
  }, [reset]);

  return (
    <SimCard title="🧱 Static → Kinetic Friction" badge="Friction" desc="Applied force ramps up. Static friction matches it until F > μₛmg, then drops to kinetic μₖmg. Watch the graph!">
      <canvas ref={canvasRef} style={{ width: "100%", height: 340, borderRadius: 12, display: "block" }} />
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
        <Ctrl label="μₛ (static)" min={0.2} max={0.9} step={0.05} value={mus} unit="" color="#f59e0b" onChange={v => { setMus(v); reset(); }} />
        <Ctrl label="μₖ (kinetic)" min={0.1} max={0.7} step={0.05} value={muk} unit="" color="#ef4444" onChange={v => { setMuk(v); reset(); }} />
        <Ctrl label="Mass" min={1} max={10} value={mass} unit=" kg" color="#6366f1" onChange={v => { setMass(v); reset(); }} />
      </div>
      <Telem items={[
        { label: "Applied F",  value: tel.Fa,    color: "#f59e0b" },
        { label: "Friction",   value: tel.ff,    color: "#ef4444" },
        { label: "Status",     value: tel.status, color: tel.status === "SLIDING" ? "#ef4444" : "#10b981" },
        { label: "Accel",      value: tel.a,     color: "#a78bfa" },
      ]} />
      <div style={{ marginTop: 10 }}><Btn label="↺ Reset" onClick={reset} /></div>
    </SimCard>
  );
}

/* ════════════════════════════════════════════════════════════════
 * 13. HORIZONTAL THROW vs FREE DROP (Galileo's Law)
 * ════════════════════════════════════════════════════════════════ */
export function Sim_horizontal_throw_pro() {
  const [vH,  setVH]  = useState(8);
  const [hgt, setHgt] = useState(3);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const vR = useRef(vH); const hR = useRef(hgt);
  useEffect(() => { vR.current = vH; }, [vH]);
  useEffect(() => { hR.current = hgt; }, [hgt]);

  const phys = useRef({ t: 0, done: false,
    t1: [] as { x: number; y: number }[], t2: [] as { x: number; y: number }[] });
  const [tel, setTel] = useState({ tL: "—", xR: "—", vy: "—", same: "—" });

  const reset = useCallback(() => {
    phys.current = { t: 0, done: false, t1: [], t2: [] };
  }, []);

  useEffect(() => {
    reset();
    const canvas = canvasRef.current; if (!canvas) return;
    let alive = true;
    const tick = () => {
      if (!alive) return;
      const res = setupCanvas(canvas); if (!res) { rafRef.current = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const p  = phys.current;
      const v  = vR.current, H_ = hR.current;
      const SC = (H - 60) / H_;
      const gY = H - 38;
      const ox1 = W * 0.12, ox2 = W * 0.62;

      if (!p.done) {
        p.t += DT;
        const yP = H_ - 0.5 * G * p.t * p.t;
        if (yP > 0) {
          p.t1.push({ x: ox1 + v * p.t * SC * 0.45, y: gY - yP * SC });
          p.t2.push({ x: ox2, y: gY - yP * SC });
          const tL = Math.sqrt(2 * H_ / G);
          const vy = G * tL;
          setTel({ tL: `${tL.toFixed(2)} s`, xR: `${(v * tL).toFixed(1)} m`, vy: `${vy.toFixed(1)} m/s`, same: "Yes! ✓" });
        } else {
          p.done = true; setTimeout(() => { if (alive) reset(); }, 2200);
        }
      }

      drawBg(ctx, W, H);
      ctx.fillStyle = "#0f1e35"; ctx.fillRect(0, gY, W, H - gY);
      ctx.fillStyle = "#1e3a5f"; ctx.fillRect(0, gY, W, 3);

      /* Height label */
      ctx.strokeStyle = "rgba(99,102,241,0.25)"; ctx.lineWidth = 1; ctx.setLineDash([4, 6]);
      ctx.beginPath(); ctx.moveTo(ox1 - 22, gY - hgt * SC); ctx.lineTo(ox1 + 5, gY - hgt * SC); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#6366f1"; ctx.font = "10px JetBrains Mono, monospace"; ctx.textAlign = "right";
      ctx.fillText(`H=${hgt}m`, ox1 - 4, gY - hgt * SC - 3);

      ctx.fillStyle = "#3b82f6"; ctx.font = "bold 11px Inter, sans-serif"; ctx.textAlign = "center";
      ctx.fillText(`Thrown ${vH} m/s →`, ox1 + 55, 18);
      ctx.fillStyle = "#ef4444"; ctx.fillText("Dropped 0 m/s", ox2, 18);

      /* Trails */
      const drawTr = (tr: { x: number; y: number }[], color: string) => {
        if (tr.length < 2) return;
        ctx.beginPath(); ctx.moveTo(tr[0].x, tr[0].y);
        for (const pt of tr) ctx.lineTo(pt.x, pt.y);
        ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
      };
      drawTr(p.t1, "rgba(59,130,246,0.55)");
      drawTr(p.t2, "rgba(239,68,68,0.55)");

      /* Compute current positions */
      const yP = Math.max(0, hgt - 0.5 * G * p.t * p.t);
      const b1x = ox1 + vR.current * p.t * SC * 0.45, b1y = gY - yP * SC;
      const b2y = gY - yP * SC;

      /* Ball 1 (blue) */
      const bg1 = ctx.createRadialGradient(b1x - 3, b1y - 3, 2, b1x, b1y, 14);
      bg1.addColorStop(0, "#93c5fd"); bg1.addColorStop(1, "#2563eb");
      ctx.beginPath(); ctx.arc(b1x, b1y, 14, 0, Math.PI * 2); ctx.fillStyle = bg1; ctx.fill();

      /* Ball 2 (red) */
      const bg2 = ctx.createRadialGradient(ox2 - 3, b2y - 3, 2, ox2, b2y, 14);
      bg2.addColorStop(0, "#fca5a5"); bg2.addColorStop(1, "#dc2626");
      ctx.beginPath(); ctx.arc(ox2, b2y, 14, 0, Math.PI * 2); ctx.fillStyle = bg2; ctx.fill();

      if (p.done) {
        ctx.fillStyle = "#10b981"; ctx.font = "bold 13px Inter, sans-serif"; ctx.textAlign = "center";
        ctx.fillText("Both hit the ground at the SAME TIME!", W / 2, gY - 10);
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(rafRef.current); };
  }, [reset, vH, hgt]);

  return (
    <SimCard title="🎯 Horizontal Throw vs Free Drop" badge="Galileo's Law" desc="Both balls released from same height. Horizontal speed does NOT affect vertical fall time — they land simultaneously!">
      <canvas ref={canvasRef} style={{ width: "100%", height: 310, borderRadius: 12, display: "block" }} />
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 12 }}>
        <Ctrl label="Horizontal Speed" min={2} max={15} value={vH} unit=" m/s" color="#3b82f6" onChange={v => { setVH(v); reset(); }} />
        <Ctrl label="Drop Height" min={1} max={6} step={0.5} value={hgt} unit=" m" color="#6366f1" onChange={v => { setHgt(v); reset(); }} />
      </div>
      <Telem items={[
        { label: "Time to Land",  value: tel.tL,   color: "#10b981" },
        { label: "Horiz Range",   value: tel.xR,   color: "#3b82f6" },
        { label: "Final v_y",     value: tel.vy,   color: "#ef4444" },
        { label: "Same Landing?", value: tel.same, color: "#10b981" },
      ]} />
      <div style={{ marginTop: 10 }}><Btn label="↺ Reset" onClick={reset} /></div>
    </SimCard>
  );
}

/* ════════════════════════════════════════════════════════════════
 * 14. NEWTON'S CRADLE — 5 balls, elastic collisions
 * ════════════════════════════════════════════════════════════════ */
export function Sim_newtons_cradle_pro() {
  const [release, setRelease] = useState(1); /* balls to lift */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const relR      = useRef(release);
  useEffect(() => { relR.current = release; }, [release]);

  const N   = 5;
  const PXL = 95; /* pendulum pixel length */
  const BR  = 14; /* ball radius */

  const phys = useRef<{ theta: number; omega: number }[]>(
    Array.from({ length: N }, () => ({ theta: 0, omega: 0 }))
  );

  const reset = useCallback(() => {
    const n = relR.current;
    for (let i = 0; i < N; i++) { phys.current[i].theta = 0; phys.current[i].omega = 0; }
    /* Lift left-side balls */
    for (let i = 0; i < n; i++) phys.current[i].theta = -0.88; /* ≈50° */
  }, []);

  useEffect(() => {
    reset();
    const canvas = canvasRef.current; if (!canvas) return;
    let alive = true;
    const tick = () => {
      if (!alive) return;
      const res = setupCanvas(canvas); if (!res) { rafRef.current = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const p   = phys.current;
      const pivY = 44;
      const sp  = BR * 2.2; /* spacing */
      const pivX0 = W / 2 - (N - 1) * sp / 2;

      /* Physics — pendulums */
      for (let i = 0; i < N; i++) {
        const alpha = -(G / (PXL / 60)) * Math.sin(p[i].theta);
        p[i].omega += alpha * DT;
        p[i].theta += p[i].omega * DT;
      }

      /* Ball positions */
      const bx = (i: number) => pivX0 + i * sp + PXL * Math.sin(p[i].theta);
      const by = (i: number) => pivY + PXL * Math.cos(p[i].theta);

      /* Collision between adjacent balls (simplified elastic for equal masses) */
      for (let i = 0; i < N - 1; i++) {
        const dx = bx(i + 1) - bx(i), dy = by(i + 1) - by(i);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < BR * 2.05) {
          const tmp = p[i].omega; p[i].omega = p[i + 1].omega; p[i + 1].omega = tmp;
          const push = (BR * 2.05 - dist) * 0.007;
          p[i].theta -= push; p[i + 1].theta += push;
        }
      }

      /* Draw */
      drawBg(ctx, W, H);

      /* Frame bar */
      ctx.fillStyle = "#1e3a5f"; ctx.fillRect(pivX0 - 20, pivY - 12, (N - 1) * sp + 40, 12);
      ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 1; ctx.stroke();

      for (let i = 0; i < N; i++) {
        const x = bx(i), y = by(i);
        const px = pivX0 + i * sp;

        /* String */
        ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(px, pivY); ctx.lineTo(x, y); ctx.stroke();

        /* Ball */
        const c = p[i].theta < -0.15 ? "#f59e0b" : "#6366f1";
        const bg = ctx.createRadialGradient(x - 4, y - 4, 2, x, y, BR);
        bg.addColorStop(0, c === "#f59e0b" ? "#fde68a" : "#c4b5fd"); bg.addColorStop(1, c);
        ctx.beginPath(); ctx.arc(x, y, BR, 0, Math.PI * 2);
        ctx.fillStyle = bg; ctx.fill(); ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.stroke();
      }

      ctx.fillStyle = "#1e3a5f"; ctx.font = "bold 11px Inter, sans-serif"; ctx.textAlign = "center";
      ctx.fillText("Lift 1 ball → 1 swings out. Lift 2 → 2 swing out. Momentum conserved!", W / 2, H - 14);

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(rafRef.current); };
  }, [reset]);

  return (
    <SimCard title="⚙️ Newton's Cradle (5 Balls)" badge="Momentum Transfer" desc="Lift N balls — exactly N swing out the other side. Elastic collisions preserve both momentum AND kinetic energy.">
      <canvas ref={canvasRef} style={{ width: "100%", height: 300, borderRadius: 12, display: "block" }} />
      <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
        <Ctrl label="Balls to Lift" min={1} max={4} step={1} value={release} unit="" color="#6366f1"
          onChange={v => { setRelease(v); reset(); }} />
      </div>
      <Telem items={[
        { label: "Lifted",     value: `${release} ball${release > 1 ? "s" : ""}`, color: "#f59e0b" },
        { label: "Collision",  value: "Elastic",     color: "#10b981" },
        { label: "Momentum",   value: "Conserved ✓", color: "#6366f1" },
        { label: "KE",         value: "Conserved ✓", color: "#a78bfa" },
      ]} />
      <div style={{ marginTop: 10 }}><Btn label="↺ Reset" onClick={reset} /></div>
    </SimCard>
  );
}

/* ════════════════════════════════════════════════════════════════
 * 15. F = ma INTERACTIVE GRAPH PLOTTER
 * ════════════════════════════════════════════════════════════════ */
export function Sim_fma_graph_pro() {
  const [mass, setMass] = useState(2);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const massR     = useRef(mass);
  useEffect(() => { massR.current = mass; }, [mass]);

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#a78bfa"];
  const lines  = useRef<{ m: number; color: string; pts: { f: number; a: number }[] }[]>([]);
  const sweep  = useRef({ f: 0, dir: 1 });
  const [tel, setTel] = useState({ F: "—", a: "—", m: "—", slope: "—" });

  const addLine = useCallback(() => {
    const m = massR.current;
    lines.current = lines.current.filter(l => l.m !== m);
    lines.current.push({ m, color: COLORS[lines.current.length % COLORS.length], pts: [] });
    if (lines.current.length > 5) lines.current.shift();
  }, []);

  useEffect(() => {
    addLine();
    const canvas = canvasRef.current; if (!canvas) return;
    let alive = true;
    const tick = () => {
      if (!alive) return;
      const res = setupCanvas(canvas); if (!res) { rafRef.current = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const m  = massR.current;
      const sw = sweep.current;
      sw.f += sw.dir * DT * 11;
      if (sw.f > 60 || sw.f < 0) sw.dir *= -1;
      const a = sw.f / m;

      const cur = lines.current.find(l => l.m === m);
      if (cur) { cur.pts.push({ f: sw.f, a }); if (cur.pts.length > 450) cur.pts.shift(); }

      setTel({ F: `${sw.f.toFixed(1)} N`, a: `${a.toFixed(2)} m/s²`, m: `${m} kg`, slope: `${(1 / m).toFixed(3)}` });

      drawBg(ctx, W, H);
      const gX = 56, gY = 20, gW = W - 76, gH = H - 75;

      rr(ctx, gX, gY, gW, gH, 8); ctx.fillStyle = "#0a1220"; ctx.fill();

      /* Axes */
      ctx.strokeStyle = "#1e3a5f"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(gX, gY + gH); ctx.lineTo(gX + gW, gY + gH); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(gX, gY); ctx.lineTo(gX, gY + gH); ctx.stroke();

      /* Grid + tick labels */
      const maxF = 60, maxA = 35;
      for (let fi = 0; fi <= 60; fi += 15) {
        const x = gX + (fi / maxF) * gW;
        ctx.strokeStyle = "rgba(255,255,255,0.03)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, gY); ctx.lineTo(x, gY + gH); ctx.stroke();
        ctx.fillStyle = "#1e3a5f"; ctx.font = "9px JetBrains Mono, monospace";
        ctx.textAlign = "center"; ctx.fillText(`${fi}`, x, gY + gH + 10);
      }
      for (let ai = 0; ai <= 30; ai += 10) {
        const y = gY + gH - (ai / maxA) * gH;
        ctx.strokeStyle = "rgba(255,255,255,0.03)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(gX, y); ctx.lineTo(gX + gW, y); ctx.stroke();
        ctx.fillStyle = "#1e3a5f"; ctx.font = "9px JetBrains Mono, monospace";
        ctx.textAlign = "right"; ctx.fillText(`${ai}`, gX - 4, y + 3);
      }

      /* Axis labels */
      ctx.fillStyle = "#334155"; ctx.font = "10px Inter, sans-serif"; ctx.textAlign = "center";
      ctx.fillText("Force F (N)", gX + gW / 2, gY + gH + 22);
      ctx.save(); ctx.translate(14, gY + gH / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText("Accel a (m/s²)", 0, 0); ctx.restore();

      /* Plot all lines */
      for (const ln of lines.current) {
        if (ln.pts.length < 2) continue;
        ctx.beginPath();
        for (let i = 0; i < ln.pts.length; i++) {
          const px2 = gX + (ln.pts[i].f / maxF) * gW;
          const py2 = gY + gH - (ln.pts[i].a / maxA) * gH;
          i === 0 ? ctx.moveTo(px2, py2) : ctx.lineTo(px2, py2);
        }
        ctx.strokeStyle = ln.color; ctx.lineWidth = 2; ctx.stroke();
        const last = ln.pts[ln.pts.length - 1];
        const lx = gX + (last.f / maxF) * gW;
        const ly = gY + gH - (last.a / maxA) * gH;
        ctx.fillStyle = ln.color; ctx.font = "bold 10px Inter, sans-serif"; ctx.textAlign = "left";
        ctx.fillText(`m=${ln.m}kg`, lx + 4, ly - 4);
      }

      /* Current point */
      const cpx = gX + (sw.f / maxF) * gW;
      const cpy = gY + gH - (a / maxA) * gH;
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(cpx, cpy, 5, 0, Math.PI * 2); ctx.fill();

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(rafRef.current); };
  }, [addLine]);

  return (
    <SimCard title="📊 F = ma Graph Plotter" badge="Newton's 2nd Law" desc="Slope of the F-vs-a line = mass m. Steeper = heavier. Add different masses to compare lines on the same graph.">
      <canvas ref={canvasRef} style={{ width: "100%", height: 320, borderRadius: 12, display: "block" }} />
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 12, flexWrap: "wrap" }}>
        <Ctrl label="Mass" min={0.5} max={10} step={0.5} value={mass} unit=" kg" color="#6366f1"
          onChange={v => { setMass(v); addLine(); }} />
        <Btn label="+ Add Line" onClick={addLine} bg="#6366f1" fg="#fff" />
      </div>
      <Telem items={[
        { label: "Force F",     value: tel.F,     color: "#f59e0b" },
        { label: "Accel a",     value: tel.a,     color: "#10b981" },
        { label: "Mass m",      value: tel.m,     color: "#6366f1" },
        { label: "Slope 1/m",   value: tel.slope, color: "#a78bfa" },
      ]} />
    </SimCard>
  );
}
