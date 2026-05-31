"use client";
/**
 * FILE: Topic8Professional.tsx
 * LOCATION: src/components/simulations/Topic8Professional.tsx
 * PURPOSE: 15 ultra-professional, fully animated, interactive physics simulations.
 *          Each simulation uses real physics equations, HTML5 Canvas, HiDPI support,
 *          interactive controls (sliders/buttons), and real-time telemetry readouts.
 *          Topics: orbital slingshot, double pendulum, 2D collision lab, friction lab,
 *          projectile range, spring SHM, elevator weight, compound pulley, circular
 *          motion, terminal velocity, airbag impulse, buoyancy, rolling incline,
 *          force decomposition, and resonance.
 * PHYSICS: Newtonian mechanics with real equations — F=ma, conservation of energy,
 *          conservation of momentum, SHM, circular motion, gravity, drag models.
 * LAST UPDATED: 2026-05-31
 */

import React, { useRef, useEffect, useState, useCallback } from "react";

/* ── Physics constants ── */
const G   = 9.81;
const DT  = 1 / 60;
const TAU = Math.PI * 2;

/* ── Canvas setup — HiDPI aware ── */
function setupCanvas(canvas: HTMLCanvasElement): [CanvasRenderingContext2D, number, number] | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const dpr = window.devicePixelRatio || 1;
  const W   = canvas.clientWidth  || 580;
  const H   = canvas.clientHeight || 320;
  if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return [ctx, W, H];
}

/* ── Dark background with grid ── */
function drawBg(ctx: CanvasRenderingContext2D, W: number, H: number, gridColor = "rgba(99,102,241,0.05)") {
  ctx.fillStyle = "#050c18";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  const gs = 40;
  for (let x = 0; x <= W; x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
}

/* ── Arrow with label ── */
function arw(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number,
  color: string, label = "", lw = 2.5) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy);
  if (len < 5) return;
  const ux = dx / len, uy = dy / len, ah = Math.min(14, len * 0.38);
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

/* ── Rounded rect path ── */
function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

/* ── Shared UI wrapper ── */
function SimCard({ title, badge, desc, children }: { title: string; badge: string; desc: string; children: React.ReactNode }) {
  return (
    <div style={{
      width: "100%", background: "#080e1a", borderRadius: 20, padding: "24px 24px 20px",
      border: "1px solid #0f1e35", boxShadow: "0 16px 60px rgba(0,0,0,0.7)",
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

/* ── Telemetry grid ── */
function Telem({ items }: { items: { label: string; value: string; color?: string }[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(items.length, 4)}, 1fr)`, gap: 8, marginTop: 12 }}>
      {items.map(it => (
        <div key={it.label} style={{ background: "#0a1220", border: "1px solid #0f1e35", borderRadius: 10, padding: "10px 12px" }}>
          <div style={{ fontSize: 9, color: "#1e3a5f", textTransform: "uppercase" as const, letterSpacing: 1.2, marginBottom: 3 }}>{it.label}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: it.color ?? "#a78bfa", fontFamily: "JetBrains Mono, monospace" }}>{it.value}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Slider control ── */
function Ctrl({ label, min, max, step = 1, value, onChange, unit = "", color = "#6366f1" }: {
  label: string; min: number; max: number; step?: number;
  value: number; onChange: (v: number) => void; unit?: string; color?: string;
}) {
  return (
    <div style={{ flex: 1, minWidth: 110 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: "#475569" }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color, fontFamily: "JetBrains Mono, monospace" }}>{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: color, cursor: "pointer" }} />
    </div>
  );
}

/* ── Button ── */
function Btn({ label, onClick, bg = "#1e293b", fg = "#94a3b8" }: { label: string; onClick: () => void; bg?: string; fg?: string }) {
  return (
    <button onClick={onClick} style={{ padding: "8px 18px", borderRadius: 9, fontWeight: 700, fontSize: 12, border: "none", cursor: "pointer", background: bg, color: fg }}>
      {label}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 * 1. ORBITAL SLINGSHOT — Gravitational slingshot / flyby
 *    Spacecraft gains speed by flying near a massive planet.
 *    Real Newtonian gravity: F = GMm/r²
 * ═══════════════════════════════════════════════════════════════════ */
export function Sim_orbital_slingshot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const [mass, setMass] = useState(4000);
  const [speed, setSpeed] = useState(60);
  const massRef  = useRef(mass);
  const speedRef = useRef(speed);
  const [telem, setTelem] = useState({ v: "0", r: "0", KE: "0" });

  useEffect(() => { massRef.current = mass; speedRef.current = speed; }, [mass, speed]);

  const launch = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const canvas = canvasRef.current; if (!canvas) return;

    let px = 40, py = 0;
    let vx = speedRef.current * 0.3, vy = 0;

    function frame() {
      const res = setupCanvas(canvas!); if (!res) { rafRef.current = requestAnimationFrame(frame); return; }
      const [ctx, W, H] = res;
      const CX = W / 2, CY = H / 2;
      py = py === 0 ? H * 0.68 : py;

      /* Planet position */
      const planetX = CX, planetY = CY;
      const GM = massRef.current * 80;

      /* Physics: gravitational acceleration */
      const dx = planetX - px, dy = planetY - py;
      const r2 = dx * dx + dy * dy, r = Math.sqrt(r2);
      const a  = GM / r2;
      vx += (dx / r) * a * DT * 8;
      vy += (dy / r) * a * DT * 8;

      px += vx * DT * 8;
      py += vy * DT * 8;

      /* Draw */
      drawBg(ctx, W, H);

      /* Planet glow */
      const grad = ctx.createRadialGradient(planetX, planetY, 0, planetX, planetY, 70);
      grad.addColorStop(0, "rgba(245,158,11,0.6)");
      grad.addColorStop(0.4, "rgba(245,158,11,0.15)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(planetX, planetY, 70, 0, TAU); ctx.fill();
      ctx.fillStyle = "#f59e0b"; ctx.beginPath(); ctx.arc(planetX, planetY, 28, 0, TAU); ctx.fill();
      ctx.fillStyle = "#fcd34d"; ctx.font = "bold 10px Inter"; ctx.textAlign = "center"; ctx.fillText("PLANET", planetX, planetY + 42);

      /* Spacecraft */
      ctx.save(); ctx.translate(px, py); ctx.rotate(Math.atan2(vy, vx));
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(-6, -5); ctx.lineTo(-6, 5); ctx.closePath(); ctx.fill();
      ctx.restore();

      /* Velocity arrow */
      arw(ctx, px, py, px + vx * 2.5, py + vy * 2.5, "#38bdf8", "v");

      /* Gravitational force arrow toward planet */
      const mag = Math.min(60, 1200 / r);
      arw(ctx, px, py, px + (dx / r) * mag, py + (dy / r) * mag, "#f59e0b", "Fg");

      /* Labels */
      ctx.fillStyle = "#1e3a5f"; ctx.font = "11px Inter"; ctx.textAlign = "left";
      ctx.fillText("F = GMm/r²", 14, 20);

      const v = Math.sqrt(vx * vx + vy * vy);
      setTelem({ v: v.toFixed(1), r: (r / 10).toFixed(0), KE: (0.5 * 1 * v * v).toFixed(0) });

      /* Reset if offscreen */
      if (px > W + 60 || px < -60 || py > H + 60 || py < -60) {
        px = 40; py = H * 0.68; vx = speedRef.current * 0.3; vy = 0;
      }

      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
  }, []);

  useEffect(() => { launch(); return () => cancelAnimationFrame(rafRef.current); }, [launch]);
  useEffect(launch, [mass, speed, launch]);

  return (
    <SimCard title="Orbital Slingshot" badge="Gravity" desc="Spacecraft gains kinetic energy via gravitational assist — F = GMm/r²">
      <canvas ref={canvasRef} style={{ width: "100%", height: 320, borderRadius: 12, display: "block" }} />
      <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" as const }}>
        <Ctrl label="Planet Mass" min={1000} max={8000} step={100} value={mass} onChange={setMass} unit="" color="#f59e0b" />
        <Ctrl label="Entry Speed" min={20} max={120} step={5} value={speed} onChange={setSpeed} unit="" color="#38bdf8" />
      </div>
      <Telem items={[
        { label: "Speed", value: `${telem.v} u/s`, color: "#38bdf8" },
        { label: "Distance", value: `${telem.r} au`, color: "#f59e0b" },
        { label: "KE", value: `${telem.KE} J`, color: "#10b981" },
      ]} />
    </SimCard>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 * 2. DOUBLE PENDULUM CHAOS — θ₁, θ₂ via Lagrangian equations
 *    Demonstrates sensitivity to initial conditions (chaos)
 * ═══════════════════════════════════════════════════════════════════ */
export function Sim_double_pendulum() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const [L1, setL1] = useState(80);
  const [L2, setL2] = useState(80);
  const trailRef = useRef<{ x: number; y: number }[]>([]);
  const stateRef = useRef({ th1: Math.PI * 0.7, th2: Math.PI * 0.4, w1: 0, w2: 0 });
  const L1ref    = useRef(L1);
  const L2ref    = useRef(L2);
  const [telem, setTelem] = useState({ th1: "0", th2: "0", omega: "0" });

  useEffect(() => { L1ref.current = L1; L2ref.current = L2; }, [L1, L2]);

  const reset = () => {
    stateRef.current = { th1: Math.PI * 0.7, th2: Math.PI * 0.4, w1: 0, w2: 0 };
    trailRef.current = [];
  };

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;

    function frame() {
      const res = setupCanvas(canvas!); if (!res) { rafRef.current = requestAnimationFrame(frame); return; }
      const [ctx, W, H] = res;
      const OX = W / 2, OY = 90;

      /* Lagrangian double pendulum equations — 4th order Runge-Kutta simplified */
      const { th1, th2, w1, w2 } = stateRef.current;
      const l1 = L1ref.current, l2 = L2ref.current;
      const m1 = 1, m2 = 1;
      const dth = th2 - th1;
      const denom1 = (m1 + m2) * l1 - m2 * l1 * Math.cos(dth) ** 2;
      const denom2 = (l2 / l1) * denom1;

      const a1 = (m2 * l1 * w1 * w1 * Math.sin(dth) * Math.cos(dth) +
                  m2 * G * Math.sin(th2) * Math.cos(dth) +
                  m2 * l2 * w2 * w2 * Math.sin(dth) -
                  (m1 + m2) * G * Math.sin(th1)) / denom1;

      const a2 = (-m2 * l2 * w2 * w2 * Math.sin(dth) * Math.cos(dth) +
                  (m1 + m2) * G * Math.sin(th1) * Math.cos(dth) -
                  (m1 + m2) * l1 * w1 * w1 * Math.sin(dth) -
                  (m1 + m2) * G * Math.sin(th2)) / denom2;

      const dt4 = DT * 2.5;
      stateRef.current = {
        th1: th1 + w1 * dt4,
        th2: th2 + w2 * dt4,
        w1:  w1  + a1 * dt4,
        w2:  w2  + a2 * dt4,
      };

      /* End positions */
      const x1 = OX + l1 * Math.sin(th1), y1 = OY + l1 * Math.cos(th1);
      const x2 = x1  + l2 * Math.sin(th2), y2 = y1  + l2 * Math.cos(th2);

      trailRef.current.push({ x: x2, y: y2 });
      if (trailRef.current.length > 300) trailRef.current.shift();

      drawBg(ctx, W, H);

      /* Trail */
      if (trailRef.current.length > 2) {
        ctx.beginPath();
        ctx.moveTo(trailRef.current[0].x, trailRef.current[0].y);
        for (let i = 1; i < trailRef.current.length; i++) {
          const t  = i / trailRef.current.length;
          ctx.strokeStyle = `hsla(${260 + t * 80}, 80%, ${40 + t * 30}%, ${t * 0.8})`;
          ctx.lineWidth   = t * 2.5;
          ctx.lineTo(trailRef.current[i].x, trailRef.current[i].y);
          ctx.stroke(); ctx.beginPath(); ctx.moveTo(trailRef.current[i].x, trailRef.current[i].y);
        }
      }

      /* Rods */
      ctx.strokeStyle = "#334155"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(OX, OY); ctx.lineTo(x1, y1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x1, y1);  ctx.lineTo(x2, y2); ctx.stroke();

      /* Bobs */
      ctx.shadowBlur = 20; ctx.shadowColor = "#6366f1";
      ctx.fillStyle = "#6366f1"; ctx.beginPath(); ctx.arc(x1, y1, 12, 0, TAU); ctx.fill();
      ctx.shadowColor = "#a78bfa";
      ctx.fillStyle = "#a78bfa"; ctx.beginPath(); ctx.arc(x2, y2, 10, 0, TAU); ctx.fill();
      ctx.shadowBlur = 0;

      /* Pivot */
      ctx.fillStyle = "#1e293b"; ctx.beginPath(); ctx.arc(OX, OY, 7, 0, TAU); ctx.fill();
      ctx.strokeStyle = "#475569"; ctx.lineWidth = 2; ctx.stroke();

      /* Info */
      ctx.fillStyle = "#1e3a5f"; ctx.font = "11px Inter"; ctx.textAlign = "left";
      ctx.fillText("Lagrangian mechanics — sensitive to initial conditions", 12, 18);

      setTelem({
        th1: (stateRef.current.th1 * 180 / Math.PI).toFixed(1),
        th2: (stateRef.current.th2 * 180 / Math.PI).toFixed(1),
        omega: Math.abs(stateRef.current.w2).toFixed(2),
      });

      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <SimCard title="Double Pendulum Chaos" badge="Chaos Theory" desc="Lagrangian double pendulum — small changes → wildly different trajectories">
      <canvas ref={canvasRef} style={{ width: "100%", height: 320, borderRadius: 12, display: "block" }} />
      <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" as const }}>
        <Ctrl label="L₁ Length" min={40} max={120} step={5} value={L1} onChange={v => { setL1(v); reset(); }} unit="px" color="#6366f1" />
        <Ctrl label="L₂ Length" min={40} max={120} step={5} value={L2} onChange={v => { setL2(v); reset(); }} unit="px" color="#a78bfa" />
        <Btn label="Reset" onClick={reset} bg="#1e293b" fg="#94a3b8" />
      </div>
      <Telem items={[
        { label: "θ₁", value: `${telem.th1}°`, color: "#6366f1" },
        { label: "θ₂", value: `${telem.th2}°`, color: "#a78bfa" },
        { label: "ω₂", value: `${telem.omega} rad/s`, color: "#10b981" },
      ]} />
    </SimCard>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 * 3. 2D ELASTIC COLLISION LAB — Billiard-style 2-body collisions
 *    Conservation of momentum AND kinetic energy
 * ═══════════════════════════════════════════════════════════════════ */
export function Sim_collision_lab_2d() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const [m1, setM1] = useState(3);
  const [m2, setM2] = useState(1);
  const [e, setE]   = useState(10); /* restitution × 10 so slider goes 1–10 */
  const stateRef = useRef({ x1: 120, y1: 0, vx1: 90, vy1: 10, x2: 0, y2: 0, vx2: -30, vy2: -8 });
  const m1Ref = useRef(m1), m2Ref = useRef(m2), eRef = useRef(e);
  const [telem, setTelem] = useState({ p1: "0", p2: "0", pt: "0", KE: "0" });

  useEffect(() => { m1Ref.current = m1; m2Ref.current = m2; eRef.current = e; }, [m1, m2, e]);

  const resetSim = () => {
    stateRef.current = { x1: 120, y1: 0, vx1: 90, vy1: 10, x2: 0, y2: 0, vx2: -30, vy2: -8 };
  };

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    resetSim();

    function frame() {
      const res = setupCanvas(canvas!); if (!res) { rafRef.current = requestAnimationFrame(frame); return; }
      const [ctx, W, H] = res;
      if (stateRef.current.y1 === 0) { stateRef.current.y1 = H / 2; stateRef.current.y2 = H / 2; }
      const s = stateRef.current;
      const MA = m1Ref.current, MB = m2Ref.current;
      const rest = eRef.current / 10;
      const R = 18;

      /* Move */
      s.x1 += s.vx1 * DT * 3; s.y1 += s.vy1 * DT * 3;
      s.x2 += s.vx2 * DT * 3; s.y2 += s.vy2 * DT * 3;

      /* Wall bounces */
      if (s.x1 < R || s.x1 > W - R) { s.vx1 *= -rest; s.x1 = s.x1 < R ? R : W - R; }
      if (s.y1 < R || s.y1 > H - R) { s.vy1 *= -rest; s.y1 = s.y1 < R ? R : H - R; }
      if (s.x2 < R || s.x2 > W - R) { s.vx2 *= -rest; s.x2 = s.x2 < R ? R : W - R; }
      if (s.y2 < R || s.y2 > H - R) { s.vy2 *= -rest; s.y2 = s.y2 < R ? R : H - R; }

      /* Ball-ball collision */
      const ddx = s.x2 - s.x1, ddy = s.y2 - s.y1;
      const dist = Math.sqrt(ddx * ddx + ddy * ddy);
      if (dist < 2 * R && dist > 0.01) {
        const nx = ddx / dist, ny = ddy / dist;
        const dvx = s.vx1 - s.vx2, dvy = s.vy1 - s.vy2;
        const dvn = dvx * nx + dvy * ny;
        if (dvn > 0) {
          const j = (1 + rest) * dvn / (1 / MA + 1 / MB);
          s.vx1 -= j / MA * nx; s.vy1 -= j / MA * ny;
          s.vx2 += j / MB * nx; s.vy2 += j / MB * ny;
          /* Separate */
          const overlap = 2 * R - dist;
          s.x1 -= nx * overlap * (MB / (MA + MB));
          s.y1 -= ny * overlap * (MB / (MA + MB));
          s.x2 += nx * overlap * (MA / (MA + MB));
          s.y2 += ny * overlap * (MA / (MA + MB));
        }
      }

      drawBg(ctx, W, H);

      /* Trail ghost */
      ctx.strokeStyle = "rgba(99,102,241,0.05)"; ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, W, H);

      /* Balls */
      const r1 = R * Math.sqrt(MA), r2 = R * Math.sqrt(MB);
      ctx.shadowBlur = 22; ctx.shadowColor = "#6366f1";
      ctx.fillStyle = "#6366f1"; ctx.beginPath(); ctx.arc(s.x1, s.y1, r1, 0, TAU); ctx.fill();
      ctx.shadowColor = "#f59e0b";
      ctx.fillStyle = "#f59e0b"; ctx.beginPath(); ctx.arc(s.x2, s.y2, r2, 0, TAU); ctx.fill();
      ctx.shadowBlur = 0;

      /* Mass labels */
      ctx.fillStyle = "#f1f5f9"; ctx.font = `bold ${r1 * 0.7}px Inter`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(`${MA}`, s.x1, s.y1);
      ctx.fillText(`${MB}`, s.x2, s.y2);

      /* Velocity arrows */
      arw(ctx, s.x1, s.y1, s.x1 + s.vx1, s.y1 + s.vy1, "#6366f1", "v₁");
      arw(ctx, s.x2, s.y2, s.x2 + s.vx2, s.y2 + s.vy2, "#f59e0b", "v₂");

      const p1 = MA * Math.sqrt(s.vx1 ** 2 + s.vy1 ** 2);
      const p2 = MB * Math.sqrt(s.vx2 ** 2 + s.vy2 ** 2);
      const KE = 0.5 * MA * (s.vx1 ** 2 + s.vy1 ** 2) + 0.5 * MB * (s.vx2 ** 2 + s.vy2 ** 2);
      setTelem({ p1: p1.toFixed(1), p2: p2.toFixed(1), pt: (p1 + p2).toFixed(1), KE: KE.toFixed(0) });

      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <SimCard title="2D Collision Lab" badge="Momentum" desc="2-body elastic/inelastic collisions — conservation of momentum p = mv">
      <canvas ref={canvasRef} style={{ width: "100%", height: 300, borderRadius: 12, display: "block" }} />
      <div style={{ display: "flex", gap: 14, marginTop: 12, flexWrap: "wrap" as const }}>
        <Ctrl label="Mass A" min={1} max={8} value={m1} onChange={setM1} unit=" kg" color="#6366f1" />
        <Ctrl label="Mass B" min={1} max={8} value={m2} onChange={setM2} unit=" kg" color="#f59e0b" />
        <Ctrl label="Elasticity" min={1} max={10} value={e} onChange={setE} unit={`/10`} color="#10b981" />
        <Btn label="Reset" onClick={resetSim} />
      </div>
      <Telem items={[
        { label: "|p₁|", value: telem.p1, color: "#6366f1" },
        { label: "|p₂|", value: telem.p2, color: "#f59e0b" },
        { label: "|p_total|", value: telem.pt, color: "#10b981" },
        { label: "KE (J)", value: telem.KE, color: "#a78bfa" },
      ]} />
    </SimCard>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 * 4. FRICTION COEFFICIENT LAB — Measure μ by observing motion onset
 *    Static friction: f_s ≤ μ_s × N; Kinetic: f_k = μ_k × N
 * ═══════════════════════════════════════════════════════════════════ */
export function Sim_friction_lab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const [mu, setMu]       = useState(35);   /* × 0.01 */
  const [force, setForce] = useState(40);
  const muRef = useRef(mu), forceRef = useRef(force);
  const posRef = useRef(120);
  const velRef = useRef(0);
  const [telem, setTelem] = useState({ mu: "0.35", ff: "0.0", fa: "0.0", a: "0.0", v: "0.0", state: "STATIC" });

  useEffect(() => { muRef.current = mu; forceRef.current = force; posRef.current = 120; velRef.current = 0; }, [mu, force]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    posRef.current = 120; velRef.current = 0;

    function frame() {
      const res = setupCanvas(canvas!); if (!res) { rafRef.current = requestAnimationFrame(frame); return; }
      const [ctx, W, H] = res;
      const m = 5, g = G;
      const N = m * g;
      const muK = muRef.current / 100;
      const muS = muK * 1.3;
      const F   = forceRef.current;
      const fMax = muS * N;
      const fK   = muK * N;

      let moving = Math.abs(velRef.current) > 0.01 || F > fMax;
      const frictionF = moving ? fK * Math.sign(velRef.current || 1) : Math.min(F, fMax);
      const netF = moving ? F - frictionF : 0;
      const a = moving ? netF / m : 0;
      velRef.current += a * DT * 4;
      posRef.current += velRef.current * DT * 40;

      if (posRef.current > W - 60) { posRef.current = W - 60; velRef.current = 0; }
      if (posRef.current < 60)     { posRef.current = 60; velRef.current = 0; }

      const groundY = H - 80, boxW = 60, boxH = 40;
      drawBg(ctx, W, H);

      /* Ground */
      ctx.fillStyle = "#1e293b"; ctx.fillRect(0, groundY, W, H - groundY);
      ctx.strokeStyle = "#334155"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(W, groundY); ctx.stroke();

      /* Surface texture lines */
      ctx.strokeStyle = "#0f1e35"; ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 20) { ctx.beginPath(); ctx.moveTo(x, groundY); ctx.lineTo(x + 10, groundY + 20); ctx.stroke(); }

      /* Box */
      const bx = posRef.current, by = groundY - boxH;
      const boxGrad = ctx.createLinearGradient(bx - boxW / 2, by, bx + boxW / 2, by + boxH);
      boxGrad.addColorStop(0, "#3b82f6"); boxGrad.addColorStop(1, "#1d4ed8");
      ctx.shadowBlur = 16; ctx.shadowColor = "#3b82f6";
      rr(ctx, bx - boxW / 2, by, boxW, boxH, 6); ctx.fillStyle = boxGrad; ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#fff"; ctx.font = "bold 11px Inter"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("5 kg", bx, by + boxH / 2);

      /* Applied force arrow */
      arw(ctx, bx - boxW / 2 - 10, by + boxH / 2, bx - boxW / 2 - 10 - F * 0.9, by + boxH / 2, "#10b981", "F");

      /* Friction arrow */
      const dir = velRef.current > 0 || F > fMax ? 1 : -1;
      arw(ctx, bx + boxW / 2, by + boxH / 2, bx + boxW / 2 + frictionF * 0.9 * dir, by + boxH / 2, "#ef4444", "f");

      /* Normal force arrow */
      arw(ctx, bx, by, bx, by - 50, "#f59e0b", "N");

      /* Weight arrow */
      arw(ctx, bx, by + boxH, bx, by + boxH + 50, "#94a3b8", "mg");

      /* State label */
      const stateStr = velRef.current > 0.5 ? "SLIDING" : F > fMax ? "MOVING" : "STATIC";
      ctx.fillStyle = stateStr === "STATIC" ? "#10b981" : "#ef4444";
      ctx.font = "bold 13px Inter"; ctx.textAlign = "left";
      ctx.fillText(`State: ${stateStr}`, 14, 20);

      setTelem({
        mu: muK.toFixed(2),
        ff: frictionF.toFixed(1),
        fa: F.toFixed(0),
        a: a.toFixed(2),
        v: Math.abs(velRef.current).toFixed(2),
        state: stateStr,
      });

      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <SimCard title="Friction Coefficient Lab" badge="Friction" desc="Static vs kinetic friction: f_s ≤ μ_s·N, f_k = μ_k·N">
      <canvas ref={canvasRef} style={{ width: "100%", height: 280, borderRadius: 12, display: "block" }} />
      <div style={{ display: "flex", gap: 14, marginTop: 12, flexWrap: "wrap" as const }}>
        <Ctrl label="μ (friction × 100)" min={5} max={80} value={mu} onChange={setMu} unit="" color="#ef4444" />
        <Ctrl label="Applied Force (N)" min={0} max={100} value={force} onChange={setForce} unit=" N" color="#10b981" />
      </div>
      <Telem items={[
        { label: "μ_k", value: telem.mu, color: "#ef4444" },
        { label: "Friction", value: `${telem.ff} N`, color: "#f59e0b" },
        { label: "Accel", value: `${telem.a} m/s²`, color: "#10b981" },
        { label: "Speed", value: `${telem.v} m/s`, color: "#38bdf8" },
      ]} />
    </SimCard>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 * 5. PROJECTILE RANGE vs ANGLE — Full parabolic trajectory graph
 *    R = v₀²sin(2θ)/g, shows maximum range at θ = 45°
 * ═══════════════════════════════════════════════════════════════════ */
export function Sim_projectile_range() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const [angle, setAngle] = useState(45);
  const [v0, setV0]       = useState(30);
  const [t, setT]         = useState(0);
  const tRef = useRef(0);
  const angleRef = useRef(angle), v0Ref = useRef(v0);
  const [telem, setTelem] = useState({ R: "0", H: "0", T: "0", x: "0", y: "0" });

  useEffect(() => { angleRef.current = angle; v0Ref.current = v0; tRef.current = 0; }, [angle, v0]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;

    function frame() {
      const res = setupCanvas(canvas!); if (!res) { rafRef.current = requestAnimationFrame(frame); return; }
      const [ctx, W, H] = res;
      const groundY = H - 50;
      const th  = angleRef.current * Math.PI / 180;
      const spd = v0Ref.current;
      const vx  = spd * Math.cos(th), vy = spd * Math.sin(th);
      const Tf  = 2 * vy / G;
      const R   = vx * Tf;
      const Hmax = vy * vy / (2 * G);

      /* Scale to fit canvas */
      const scaleX = Math.min((W - 80) / Math.max(R, 1), 8);
      const scaleY = Math.min((groundY - 40) / Math.max(Hmax, 1), 8);
      const ox = 50, oy = groundY;

      /* Advance time */
      tRef.current = (tRef.current + DT * 1.2) % Tf;
      const ct = tRef.current;
      const cx = vx * ct, cy = vy * ct - 0.5 * G * ct * ct;

      drawBg(ctx, W, H);

      /* Ground */
      ctx.fillStyle = "#1e293b"; ctx.fillRect(0, groundY, W, H - groundY);
      ctx.strokeStyle = "#334155"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(W, groundY); ctx.stroke();

      /* Trajectory path */
      ctx.strokeStyle = "rgba(99,102,241,0.3)"; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]);
      ctx.beginPath();
      for (let ti = 0; ti <= 60; ti++) {
        const frac = ti / 60, tt = frac * Tf;
        const px = ox + vx * tt * scaleX;
        const py = oy - (vy * tt - 0.5 * G * tt * tt) * scaleY;
        ti === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke(); ctx.setLineDash([]);

      /* Angle arc */
      ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(ox, oy, 30, -Math.PI, -th - Math.PI); ctx.stroke();
      ctx.fillStyle = "#f59e0b"; ctx.font = "12px Inter"; ctx.textAlign = "left";
      ctx.fillText(`θ=${angleRef.current}°`, ox + 35, oy - 12);

      /* Range line */
      ctx.strokeStyle = "#10b981"; ctx.lineWidth = 1.5; ctx.setLineDash([5, 3]);
      ctx.beginPath(); ctx.moveTo(ox, oy - 4); ctx.lineTo(ox + R * scaleX, oy - 4); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#10b981"; ctx.textAlign = "center";
      ctx.fillText(`R = ${R.toFixed(1)} m`, ox + R * scaleX / 2, oy - 14);

      /* Projectile ball */
      const bx = ox + cx * scaleX, by = oy - cy * scaleY;
      ctx.shadowBlur = 18; ctx.shadowColor = "#6366f1";
      ctx.fillStyle = "#6366f1"; ctx.beginPath(); ctx.arc(bx, Math.max(by, 10), 9, 0, TAU); ctx.fill();
      ctx.shadowBlur = 0;

      /* Velocity components */
      const pvx = vx * scaleX * 0.6, pvy = -(vy - G * ct) * scaleY * 0.6;
      arw(ctx, bx, by, bx + pvx, by, "#38bdf8", "vx");
      arw(ctx, bx, by, bx, by + pvy, "#ef4444", "vy");

      /* Max height line */
      ctx.strokeStyle = "rgba(239,68,68,0.3)"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(ox, oy - Hmax * scaleY); ctx.lineTo(ox + R * scaleX / 2, oy - Hmax * scaleY); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#ef4444"; ctx.font = "11px Inter"; ctx.textAlign = "left";
      ctx.fillText(`H = ${Hmax.toFixed(1)} m`, ox + 8, oy - Hmax * scaleY - 8);

      setTelem({ R: R.toFixed(1), H: Hmax.toFixed(1), T: Tf.toFixed(2), x: cx.toFixed(1), y: cy.toFixed(1) });

      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    setT(0);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <SimCard title="Projectile Range Finder" badge="Kinematics" desc="R = v₀²sin(2θ)/g — maximum range at θ = 45°">
      <canvas ref={canvasRef} style={{ width: "100%", height: 300, borderRadius: 12, display: "block" }} />
      <div style={{ display: "flex", gap: 14, marginTop: 12, flexWrap: "wrap" as const }}>
        <Ctrl label="Launch Angle θ" min={5} max={85} value={angle} onChange={setAngle} unit="°" color="#f59e0b" />
        <Ctrl label="Initial Speed v₀" min={10} max={60} step={5} value={v0} onChange={setV0} unit=" m/s" color="#6366f1" />
      </div>
      <Telem items={[
        { label: "Range R", value: `${telem.R} m`, color: "#10b981" },
        { label: "Max Height", value: `${telem.H} m`, color: "#ef4444" },
        { label: "Time T", value: `${telem.T} s`, color: "#f59e0b" },
        { label: "x / y", value: `${telem.x}/${telem.y} m`, color: "#a78bfa" },
      ]} />
    </SimCard>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 * 6. SPRING SIMPLE HARMONIC MOTION — x = A·cos(ωt), ω = √(k/m)
 *    Shows kinetic and potential energy bars in real time
 * ═══════════════════════════════════════════════════════════════════ */
export function Sim_spring_shm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const [k, setK] = useState(50);
  const [A, setA] = useState(80);
  const [m, setM] = useState(2);
  const kRef = useRef(k), ARef = useRef(A), mRef = useRef(m);
  const tRef = useRef(0);
  const [telem, setTelem] = useState({ x: "0", v: "0", KE: "0", PE: "0", E: "0" });

  useEffect(() => { kRef.current = k; ARef.current = A; mRef.current = m; tRef.current = 0; }, [k, A, m]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;

    function frame() {
      const res = setupCanvas(canvas!); if (!res) { rafRef.current = requestAnimationFrame(frame); return; }
      const [ctx, W, H] = res;
      tRef.current += DT;

      const omega = Math.sqrt(kRef.current / mRef.current);
      const x     = ARef.current * Math.cos(omega * tRef.current);
      const v     = -ARef.current * omega * Math.sin(omega * tRef.current);
      const KE    = 0.5 * mRef.current * v * v;
      const PE    = 0.5 * kRef.current * x * x;
      const E     = 0.5 * kRef.current * ARef.current * ARef.current;

      const CX = W / 2 + 20, CY = H * 0.42;
      const wallX = 40;

      drawBg(ctx, W, H);

      /* Spring drawing (coil) */
      const springEnd = CX - 30 + x;
      const nCoils = 16;
      const coilH  = 10;
      ctx.strokeStyle = "#475569"; ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= nCoils * 8; i++) {
        const frac = i / (nCoils * 8);
        const sx = wallX + frac * (springEnd - wallX);
        const sy = CY + coilH * Math.sin(frac * nCoils * TAU);
        i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      /* Wall */
      ctx.fillStyle = "#1e293b"; ctx.fillRect(0, CY - 40, wallX, 80);
      ctx.strokeStyle = "#334155"; ctx.lineWidth = 2;
      for (let yy = CY - 40; yy < CY + 40; yy += 12) {
        ctx.beginPath(); ctx.moveTo(wallX, yy); ctx.lineTo(wallX - 12, yy + 12); ctx.stroke();
      }

      /* Block */
      const bW = 50, bH = 50;
      const bx = springEnd;
      const boxGrad = ctx.createLinearGradient(bx, CY - bH / 2, bx + bW, CY + bH / 2);
      boxGrad.addColorStop(0, "#6366f1"); boxGrad.addColorStop(1, "#4f46e5");
      ctx.shadowBlur = 20; ctx.shadowColor = "#6366f1";
      rr(ctx, bx, CY - bH / 2, bW, bH, 8); ctx.fillStyle = boxGrad; ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#f1f5f9"; ctx.font = `bold 11px Inter`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(`${mRef.current}kg`, bx + bW / 2, CY);

      /* Equilibrium line */
      ctx.strokeStyle = "rgba(16,185,129,0.3)"; ctx.lineWidth = 1; ctx.setLineDash([5, 5]);
      ctx.beginPath(); ctx.moveTo(CX, 20); ctx.lineTo(CX, H - 20); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "#10b981"; ctx.font = "10px Inter"; ctx.textAlign = "center";
      ctx.fillText("equilibrium", CX, H - 30);

      /* Force arrow */
      const fx = -kRef.current * x * 0.4;
      arw(ctx, bx + bW / 2, CY, bx + bW / 2 + fx, CY, "#ef4444", "F");

      /* Energy bars at right */
      const barX = W - 120, barW = 25, maxH = 120;
      const keH = (KE / E) * maxH, peH = (PE / E) * maxH;
      const barY = CY + 60;

      ctx.fillStyle = "#0a1220"; rr(ctx, barX, barY - maxH, barW, maxH, 4); ctx.fill();
      ctx.fillStyle = "#38bdf8"; rr(ctx, barX, barY - keH, barW, keH, 4); ctx.fill();
      ctx.fillStyle = "#f1f5f9"; ctx.font = "9px Inter"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText("KE", barX + barW / 2, barY + 4);

      ctx.fillStyle = "#0a1220"; rr(ctx, barX + barW + 8, barY - maxH, barW, maxH, 4); ctx.fill();
      ctx.fillStyle = "#f59e0b"; rr(ctx, barX + barW + 8, barY - peH, barW, peH, 4); ctx.fill();
      ctx.fillText("PE", barX + barW + 8 + barW / 2, barY + 4);

      setTelem({
        x: x.toFixed(1),
        v: v.toFixed(2),
        KE: KE.toFixed(1),
        PE: PE.toFixed(1),
        E: E.toFixed(1),
      });

      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <SimCard title="Spring SHM — Simple Harmonic Motion" badge="SHM" desc="x = A·cos(ωt), ω = √(k/m) — energy oscillates between KE and PE">
      <canvas ref={canvasRef} style={{ width: "100%", height: 300, borderRadius: 12, display: "block" }} />
      <div style={{ display: "flex", gap: 14, marginTop: 12, flexWrap: "wrap" as const }}>
        <Ctrl label="Spring k (N/m)" min={10} max={200} step={10} value={k} onChange={setK} unit="" color="#38bdf8" />
        <Ctrl label="Amplitude A (px)" min={20} max={120} value={A} onChange={setA} unit="" color="#a78bfa" />
        <Ctrl label="Mass m (kg)" min={1} max={10} value={m} onChange={setM} unit=" kg" color="#f59e0b" />
      </div>
      <Telem items={[
        { label: "Position x", value: `${telem.x} px`, color: "#a78bfa" },
        { label: "Velocity v", value: `${telem.v}`, color: "#38bdf8" },
        { label: "KE", value: `${telem.KE} J`, color: "#38bdf8" },
        { label: "PE", value: `${telem.PE} J`, color: "#f59e0b" },
      ]} />
    </SimCard>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 * 7. ELEVATOR APPARENT WEIGHT — Normal force changes with acceleration
 *    N = m(g + a) going up,  N = m(g − a) going down
 * ═══════════════════════════════════════════════════════════════════ */
export function Sim_elevator_weight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const [accel, setAccel] = useState(0);
  const [m, setM]         = useState(60);
  const aRef = useRef(accel), mRef = useRef(m);
  const posRef = useRef(0.5);
  const [telem, setTelem] = useState({ N: "588", W: "588", ratio: "1.00", a: "0.0" });

  useEffect(() => { aRef.current = accel; mRef.current = m; }, [accel, m]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;

    function frame() {
      const res = setupCanvas(canvas!); if (!res) { rafRef.current = requestAnimationFrame(frame); return; }
      const [ctx, W, H] = res;

      const acc = aRef.current;
      const mass = mRef.current;
      const N    = mass * (G + acc);
      const Wt   = mass * G;

      /* Move elevator */
      posRef.current += acc * 0.0002;
      posRef.current = Math.max(0.05, Math.min(0.85, posRef.current));

      drawBg(ctx, W, H);

      /* Building shaft */
      const shaftX = W / 2 - 70, shaftW = 140;
      ctx.fillStyle = "#0d1a2e"; ctx.fillRect(shaftX, 0, shaftW, H);
      ctx.strokeStyle = "#1e3a5f"; ctx.lineWidth = 2; ctx.strokeRect(shaftX, 0, shaftW, H);

      /* Floor markers */
      for (let fl = 1; fl <= 5; fl++) {
        const fy = (fl / 6) * H;
        ctx.strokeStyle = "#0f1e35"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(shaftX, fy); ctx.lineTo(shaftX + shaftW, fy); ctx.stroke();
        ctx.fillStyle = "#1e3a5f"; ctx.font = "10px Inter"; ctx.textAlign = "right";
        ctx.fillText(`F${6 - fl}`, shaftX - 8, fy + 4);
      }

      /* Elevator cab */
      const elH = 80, elW = shaftW - 20;
      const elY = posRef.current * (H - elH);
      const elX = shaftX + 10;
      const elevGrad = ctx.createLinearGradient(elX, elY, elX, elY + elH);
      elevGrad.addColorStop(0, "#1e293b"); elevGrad.addColorStop(1, "#0f172a");
      ctx.shadowBlur = 12; ctx.shadowColor = "#334155";
      rr(ctx, elX, elY, elW, elH, 6); ctx.fillStyle = elevGrad; ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#475569"; ctx.lineWidth = 2; rr(ctx, elX, elY, elW, elH, 6); ctx.stroke();

      /* Cable */
      ctx.strokeStyle = "#64748b"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, elY); ctx.stroke();

      /* Person icon */
      const px = elX + elW / 2, py = elY + 20;
      ctx.fillStyle = "#94a3b8";
      ctx.beginPath(); ctx.arc(px, py + 8, 10, 0, TAU); ctx.fill();
      ctx.fillRect(px - 8, py + 18, 16, 28);

      /* Scale platform */
      ctx.fillStyle = "#1e3a5f"; ctx.fillRect(px - 25, elY + elH - 15, 50, 8);

      /* Normal force arrow */
      arw(ctx, px, elY + elH - 15, px, elY + elH - 15 - Math.min(100, N * 0.15), "#10b981", "N");

      /* Weight arrow */
      arw(ctx, px, elY + 35, px, elY + 35 + Wt * 0.08, "#ef4444", "mg");

      /* Acceleration indicator */
      if (Math.abs(acc) > 0.2) {
        const aDir = acc > 0 ? 1 : -1;
        arw(ctx, W - 60, H / 2, W - 60, H / 2 - aDir * 60, "#f59e0b", "a");
      }

      /* Scale display */
      const scale_reading = Math.max(0, N / G);
      ctx.fillStyle = "#0d1a2e"; rr(ctx, W - 130, H - 60, 110, 40, 8); ctx.fill();
      ctx.strokeStyle = "#1e3a5f"; ctx.lineWidth = 1; rr(ctx, W - 130, H - 60, 110, 40, 8); ctx.stroke();
      ctx.fillStyle = "#10b981"; ctx.font = "bold 16px JetBrains Mono"; ctx.textAlign = "center";
      ctx.fillText(`${scale_reading.toFixed(1)} kg`, W - 75, H - 35);
      ctx.fillStyle = "#334155"; ctx.font = "9px Inter"; ctx.fillText("SCALE READING", W - 75, H - 20);

      setTelem({
        N: N.toFixed(1),
        W: Wt.toFixed(1),
        ratio: (N / Wt).toFixed(2),
        a: acc.toFixed(1),
      });

      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <SimCard title="Elevator Apparent Weight" badge="Newton's 2nd" desc="N = m(g + a) when accelerating up, N = m(g - a) when accelerating down">
      <canvas ref={canvasRef} style={{ width: "100%", height: 320, borderRadius: 12, display: "block" }} />
      <div style={{ display: "flex", gap: 14, marginTop: 12, flexWrap: "wrap" as const }}>
        <Ctrl label="Acceleration a (m/s²)" min={-8} max={8} value={accel} onChange={setAccel} unit=" m/s²" color="#f59e0b" />
        <Ctrl label="Person mass m (kg)" min={30} max={120} step={5} value={m} onChange={setM} unit=" kg" color="#10b981" />
      </div>
      <Telem items={[
        { label: "Normal N", value: `${telem.N} N`, color: "#10b981" },
        { label: "Weight mg", value: `${telem.W} N`, color: "#ef4444" },
        { label: "N/mg ratio", value: telem.ratio, color: "#a78bfa" },
        { label: "Accel a", value: `${telem.a} m/s²`, color: "#f59e0b" },
      ]} />
    </SimCard>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 * 8. CIRCULAR CENTRIPETAL FORCE — Ball on string, v²/r toward center
 *    F_c = mv²/r = mω²r
 * ═══════════════════════════════════════════════════════════════════ */
export function Sim_circular_centripetal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const [omega, setOmega] = useState(3);
  const [r, setR]         = useState(80);
  const [m, setM]         = useState(1);
  const tRef = useRef(0);
  const oRef = useRef(omega), rRef = useRef(r), mRef = useRef(m);
  const [telem, setTelem] = useState({ v: "0", Fc: "0", omega: "0", T: "0" });

  useEffect(() => { oRef.current = omega; rRef.current = r; mRef.current = m; }, [omega, r, m]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;

    function frame() {
      const res = setupCanvas(canvas!); if (!res) { rafRef.current = requestAnimationFrame(frame); return; }
      const [ctx, W, H] = res;
      tRef.current += DT;
      const CX = W / 2, CY = H / 2;
      const angle = oRef.current * tRef.current;
      const rad = rRef.current;
      const bx = CX + rad * Math.cos(angle);
      const by = CY + rad * Math.sin(angle);
      const v  = oRef.current * rad * 0.1;
      const Fc = mRef.current * oRef.current * oRef.current * rad * 0.01;

      drawBg(ctx, W, H);

      /* Orbit circle */
      ctx.strokeStyle = "rgba(99,102,241,0.15)"; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]);
      ctx.beginPath(); ctx.arc(CX, CY, rad, 0, TAU); ctx.stroke(); ctx.setLineDash([]);

      /* Radius sectors (angle marks) */
      for (let i = 0; i < 8; i++) {
        const a = i * Math.PI / 4;
        ctx.strokeStyle = "rgba(71,85,105,0.3)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(CX, CY); ctx.lineTo(CX + rad * 1.1 * Math.cos(a), CY + rad * 1.1 * Math.sin(a)); ctx.stroke();
      }

      /* String */
      ctx.strokeStyle = "#64748b"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(CX, CY); ctx.lineTo(bx, by); ctx.stroke();

      /* Center pivot */
      ctx.shadowBlur = 14; ctx.shadowColor = "#f59e0b";
      ctx.fillStyle = "#f59e0b"; ctx.beginPath(); ctx.arc(CX, CY, 8, 0, TAU); ctx.fill();
      ctx.shadowBlur = 0;

      /* Ball */
      ctx.shadowBlur = 20; ctx.shadowColor = "#6366f1";
      ctx.fillStyle = "#6366f1"; ctx.beginPath(); ctx.arc(bx, by, 16, 0, TAU); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#fff"; ctx.font = "bold 9px Inter"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(`${mRef.current}`, bx, by);

      /* Centripetal force arrow (toward center) */
      const fcMag = Math.min(80, Fc * 20);
      arw(ctx, bx, by, bx + (CX - bx) / rad * fcMag, by + (CY - by) / rad * fcMag, "#ef4444", "Fc");

      /* Velocity arrow (tangential) */
      const tvx = -Math.sin(angle) * 50, tvy = Math.cos(angle) * 50;
      arw(ctx, bx, by, bx + tvx, by + tvy, "#38bdf8", "v");

      /* Labels */
      ctx.fillStyle = "#1e3a5f"; ctx.font = "11px Inter"; ctx.textAlign = "left";
      ctx.fillText(`F_c = mv²/r = mω²r`, 14, 20);
      ctx.fillText(`ω = ${oRef.current.toFixed(1)} rad/s   r = ${rRef.current}px`, 14, 36);

      setTelem({
        v: (oRef.current * rad * 0.05).toFixed(2),
        Fc: Fc.toFixed(2),
        omega: oRef.current.toFixed(1),
        T: (TAU / oRef.current).toFixed(2),
      });

      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <SimCard title="Circular Motion & Centripetal Force" badge="Circular Motion" desc="F_c = mv²/r = mω²r — force always directed toward center">
      <canvas ref={canvasRef} style={{ width: "100%", height: 300, borderRadius: 12, display: "block" }} />
      <div style={{ display: "flex", gap: 14, marginTop: 12, flexWrap: "wrap" as const }}>
        <Ctrl label="ω (rad/s)" min={1} max={10} value={omega} onChange={setOmega} unit=" rad/s" color="#6366f1" />
        <Ctrl label="Radius r (px)" min={40} max={120} step={5} value={r} onChange={setR} unit=" px" color="#38bdf8" />
        <Ctrl label="Mass m (kg)" min={1} max={5} value={m} onChange={setM} unit=" kg" color="#f59e0b" />
      </div>
      <Telem items={[
        { label: "Speed v", value: `${telem.v}`, color: "#38bdf8" },
        { label: "F_c", value: `${telem.Fc} N`, color: "#ef4444" },
        { label: "ω", value: `${telem.omega} rad/s`, color: "#6366f1" },
        { label: "Period T", value: `${telem.T} s`, color: "#f59e0b" },
      ]} />
    </SimCard>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 * 9. TERMINAL VELOCITY — Skydiver with drag force
 *    F_drag = ½ρCdAv²; terminal when F_drag = mg
 * ═══════════════════════════════════════════════════════════════════ */
export function Sim_terminal_velocity() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const [Cd, setCd] = useState(12);   /* × 0.1 */
  const [m, setM]   = useState(80);
  const CdRef = useRef(Cd), mRef = useRef(m);
  const vyRef = useRef(0), posRef = useRef(0);
  const [telem, setTelem] = useState({ v: "0.0", Fd: "0.0", a: "9.81", vt: "0.0" });

  useEffect(() => { CdRef.current = Cd; mRef.current = m; vyRef.current = 0; posRef.current = 0; }, [Cd, m]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;

    function frame() {
      const res = setupCanvas(canvas!); if (!res) { rafRef.current = requestAnimationFrame(frame); return; }
      const [ctx, W, H] = res;

      const mass = mRef.current;
      const cd   = CdRef.current / 10;
      const rho  = 1.225;
      const A    = 0.7;
      const Fdrag = 0.5 * rho * cd * A * vyRef.current * vyRef.current;
      const Fg   = mass * G;
      const Fnet = Fg - Fdrag;
      const a    = Fnet / mass;

      vyRef.current += a * DT * 3;
      posRef.current  = (posRef.current + vyRef.current * DT * 0.5) % 1.0;

      const vt = Math.sqrt(2 * Fg / (rho * cd * A));
      const skyY = posRef.current * H;

      drawBg(ctx, W, H, "rgba(99,102,241,0.03)");

      /* Sky gradient */
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#040810"); sky.addColorStop(1, "#0d1a2e");
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

      /* Cloud/altitude lines */
      for (let i = 0; i < 5; i++) {
        const lineY = ((i / 5 + posRef.current * 0.3) % 1) * H;
        ctx.strokeStyle = "rgba(148,163,184,0.08)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, lineY); ctx.lineTo(W, lineY); ctx.stroke();
        ctx.fillStyle = "rgba(148,163,184,0.05)"; ctx.font = "11px Inter"; ctx.textAlign = "right";
        ctx.fillText(`${Math.round(4000 - i * 800)} m`, W - 10, lineY - 4);
      }

      /* Skydiver */
      const cx = W / 2;
      ctx.shadowBlur = 20; ctx.shadowColor = "#6366f1";
      ctx.fillStyle = "#6366f1"; ctx.beginPath(); ctx.arc(cx, skyY, 18, 0, TAU); ctx.fill();
      ctx.shadowBlur = 0;
      /* Limbs */
      ctx.strokeStyle = "#818cf8"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx - 22, skyY); ctx.lineTo(cx + 22, skyY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, skyY + 10); ctx.lineTo(cx - 16, skyY + 30); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, skyY + 10); ctx.lineTo(cx + 16, skyY + 30); ctx.stroke();

      /* Gravity force arrow */
      arw(ctx, cx, skyY + 22, cx, skyY + 22 + Math.min(70, Fg * 0.4), "#ef4444", "mg");

      /* Drag force arrow (upward) */
      arw(ctx, cx, skyY - 22, cx, skyY - 22 - Math.min(70, Fdrag * 0.4), "#10b981", "F_d");

      /* Terminal velocity bar */
      const vRatio = Math.min(1, vyRef.current / (vt + 1));
      const barX = W - 40, barH = H * 0.7, barY = (H - barH) / 2;
      ctx.fillStyle = "#0a1220"; rr(ctx, barX - 18, barY, 18, barH, 4); ctx.fill();
      ctx.fillStyle = `rgb(${Math.round(239 * vRatio)},${Math.round(68 + 117 * (1 - vRatio))},68)`;
      rr(ctx, barX - 18, barY + barH * (1 - vRatio), 18, barH * vRatio, 4); ctx.fill();
      /* Terminal velocity line */
      ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(barX - 25, barY); ctx.lineTo(barX + 5, barY); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#f59e0b"; ctx.font = "9px Inter"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText("vₜ", barX + 6, barY);
      ctx.fillStyle = "#334155"; ctx.font = "9px Inter"; ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText("v", barX - 9, barY + barH + 6);

      setTelem({
        v:  vyRef.current.toFixed(1),
        Fd: Fdrag.toFixed(1),
        a:  a.toFixed(2),
        vt: vt.toFixed(1),
      });

      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <SimCard title="Terminal Velocity — Skydiver" badge="Drag Force" desc="F_drag = ½ρCdAv² — reaches terminal when drag = weight">
      <canvas ref={canvasRef} style={{ width: "100%", height: 320, borderRadius: 12, display: "block" }} />
      <div style={{ display: "flex", gap: 14, marginTop: 12, flexWrap: "wrap" as const }}>
        <Ctrl label="Drag Coeff Cd × 10" min={3} max={30} value={Cd} onChange={setCd} unit="" color="#10b981" />
        <Ctrl label="Mass m (kg)" min={40} max={150} step={5} value={m} onChange={setM} unit=" kg" color="#ef4444" />
      </div>
      <Telem items={[
        { label: "Speed v", value: `${telem.v} m/s`, color: "#38bdf8" },
        { label: "Drag F_d", value: `${telem.Fd} N`, color: "#10b981" },
        { label: "Accel a", value: `${telem.a} m/s²`, color: "#f59e0b" },
        { label: "Terminal vₜ", value: `${telem.vt} m/s`, color: "#ef4444" },
      ]} />
    </SimCard>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 * 10. IMPULSE & AIRBAG — Same Δp, different Δt → different F
 *     J = F·Δt = Δp; airbag increases Δt, reduces F_avg
 * ═══════════════════════════════════════════════════════════════════ */
export function Sim_impulse_airbag() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const [v0, setV0]     = useState(60);
  const [mode, setMode] = useState<"rigid" | "airbag">("rigid");
  const stateRef = useRef({ x: -60, vx: 60, phase: "approaching" as string, timer: 0 });
  const modeRef  = useRef(mode), v0Ref = useRef(v0);
  const [telem, setTelem] = useState({ F: "0", t: "0", J: "0", a: "0" });

  useEffect(() => { modeRef.current = mode; v0Ref.current = v0; stateRef.current = { x: -60, vx: v0, phase: "approaching", timer: 0 }; }, [mode, v0]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    stateRef.current = { x: -60, vx: v0Ref.current, phase: "approaching", timer: 0 };

    function frame() {
      const res = setupCanvas(canvas!); if (!res) { rafRef.current = requestAnimationFrame(frame); return; }
      const [ctx, W, H] = res;
      const s = stateRef.current;
      const isAirbag = modeRef.current === "airbag";
      const crashTime = isAirbag ? 0.15 : 0.03;
      const wallX = W * 0.6;
      const mass  = 70;

      /* Physics state machine */
      if (s.phase === "approaching") {
        s.x += s.vx * DT * 3;
        if (s.x >= wallX - 50) { s.phase = "crashing"; s.timer = 0; }
      } else if (s.phase === "crashing") {
        s.timer += DT;
        s.vx = v0Ref.current * (1 - s.timer / crashTime);
        if (s.timer >= crashTime) { s.phase = "done"; s.vx = 0; }
      } else if (s.phase === "done") {
        s.timer += DT;
        if (s.timer > 1.5) { s.x = -60; s.vx = v0Ref.current; s.phase = "approaching"; s.timer = 0; }
      }

      const Favg = s.phase === "crashing" ? (mass * v0Ref.current) / crashTime : 0;
      const Jval = mass * v0Ref.current;

      drawBg(ctx, W, H);

      /* Ground */
      ctx.fillStyle = "#1e293b"; ctx.fillRect(0, H - 60, W, 60);

      /* Wall */
      ctx.fillStyle = "#1e3a5f"; ctx.fillRect(wallX, 40, 30, H - 100);
      ctx.fillStyle = "#334155"; ctx.font = "10px Inter"; ctx.textAlign = "center";
      ctx.fillText("WALL", wallX + 15, H - 75);

      /* Airbag */
      if (isAirbag && s.phase !== "approaching") {
        const bagSize = 60 * (1 - s.timer / crashTime * 0.3);
        const bagX = wallX - 10;
        ctx.shadowBlur = 30; ctx.shadowColor = "#f59e0b";
        const bagGrad = ctx.createRadialGradient(bagX - bagSize / 2, H - 90, 0, bagX - bagSize / 2, H - 90, bagSize);
        bagGrad.addColorStop(0, "rgba(245,158,11,0.8)");
        bagGrad.addColorStop(1, "rgba(245,158,11,0.1)");
        ctx.fillStyle = bagGrad;
        ctx.beginPath(); ctx.ellipse(bagX - bagSize / 2, H - 95, bagSize, bagSize * 0.7, 0, 0, TAU); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#f59e0b"; ctx.font = "bold 10px Inter"; ctx.textAlign = "center";
        ctx.fillText("AIRBAG", bagX - bagSize / 2, H - 95);
      }

      /* Car */
      const carX = s.x + W * 0.2;
      const carY = H - 80;
      rr(ctx, carX, carY - 35, 80, 35, 6); ctx.fillStyle = "#3b82f6"; ctx.fill();
      rr(ctx, carX + 10, carY - 55, 55, 22, 5); ctx.fillStyle = "#2563eb"; ctx.fill();
      ctx.fillStyle = "#1e293b";
      ctx.beginPath(); ctx.arc(carX + 15, carY + 5, 12, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(carX + 62, carY + 5, 12, 0, TAU); ctx.fill();
      ctx.strokeStyle = "#475569"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(carX + 15, carY + 5, 12, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.arc(carX + 62, carY + 5, 12, 0, TAU); ctx.stroke();

      /* Force bar */
      if (s.phase === "crashing") {
        const barH = Math.min(120, Favg * 0.005);
        ctx.fillStyle = isAirbag ? "#10b981" : "#ef4444";
        ctx.shadowBlur = isAirbag ? 12 : 20; ctx.shadowColor = ctx.fillStyle;
        rr(ctx, W - 80, H - 60 - barH, 40, barH, 4); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#f1f5f9"; ctx.font = "bold 11px Inter"; ctx.textAlign = "center";
        ctx.fillText(`${(Favg / 1000).toFixed(0)} kN`, W - 60, H - 70 - barH);
      }

      /* Labels */
      ctx.fillStyle = "#334155"; ctx.font = "bold 12px Inter"; ctx.textAlign = "left";
      ctx.fillText(isAirbag ? "WITH AIRBAG — longer Δt → smaller F" : "WITHOUT AIRBAG — short Δt → huge F", 14, 22);
      ctx.fillStyle = "#1e3a5f"; ctx.font = "11px Inter";
      ctx.fillText("J = F·Δt = Δp = m·Δv (constant)", 14, 40);

      setTelem({
        F:  s.phase === "crashing" ? (Favg / 1000).toFixed(1) : "0.0",
        t:  crashTime.toFixed(3),
        J:  Jval.toFixed(0),
        a:  s.phase === "crashing" ? (Favg / mass).toFixed(0) : "0",
      });

      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <SimCard title="Impulse & Airbag Safety" badge="Impulse J = FΔt" desc="Same momentum change Δp — airbag increases Δt, dramatically reducing F">
      <canvas ref={canvasRef} style={{ width: "100%", height: 280, borderRadius: 12, display: "block" }} />
      <div style={{ display: "flex", gap: 14, marginTop: 12, flexWrap: "wrap" as const, alignItems: "center" }}>
        <Ctrl label="Initial Speed" min={20} max={100} step={5} value={v0} onChange={setV0} unit=" km/h" color="#3b82f6" />
        <Btn label="No Airbag" onClick={() => setMode("rigid")} bg={mode === "rigid" ? "#ef4444" : "#1e293b"} fg={mode === "rigid" ? "#fff" : "#94a3b8"} />
        <Btn label="With Airbag" onClick={() => setMode("airbag")} bg={mode === "airbag" ? "#10b981" : "#1e293b"} fg={mode === "airbag" ? "#fff" : "#94a3b8"} />
      </div>
      <Telem items={[
        { label: "Force F_avg", value: `${telem.F} kN`, color: mode === "rigid" ? "#ef4444" : "#10b981" },
        { label: "Δt crash", value: `${telem.t} s`, color: "#f59e0b" },
        { label: "Impulse J", value: `${telem.J} N·s`, color: "#a78bfa" },
        { label: "Decel a", value: `${telem.a} m/s²`, color: "#38bdf8" },
      ]} />
    </SimCard>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 * 11. ROLLING ON INCLINE — Rolling vs sliding, moment of inertia
 *     a_rolling = g·sinθ/(1 + I/mr²); solid sphere I = 2mr²/5
 * ═══════════════════════════════════════════════════════════════════ */
export function Sim_rolling_incline() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const [theta, setTheta] = useState(30);
  const [shape, setShape] = useState<"sphere" | "cylinder" | "ring">("sphere");
  const thetaRef = useRef(theta), shapeRef = useRef(shape);
  const posRef = useRef(0);
  const [telem, setTelem] = useState({ a: "0", v: "0", I: "0" });

  useEffect(() => { thetaRef.current = theta; shapeRef.current = shape; posRef.current = 0; }, [theta, shape]);

  /* Moment of inertia factor β = I/mr² */
  const getBeta = (s: string) => ({ sphere: 2 / 5, cylinder: 1 / 2, ring: 1 })[s] ?? 0.4;

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    posRef.current = 0;
    let vel = 0;

    function frame() {
      const res = setupCanvas(canvas!); if (!res) { rafRef.current = requestAnimationFrame(frame); return; }
      const [ctx, W, H] = res;
      const th  = thetaRef.current * Math.PI / 180;
      const beta = getBeta(shapeRef.current);
      const a   = G * Math.sin(th) / (1 + beta);

      vel += a * DT * 0.8;
      posRef.current += vel * DT * 30;

      const L = W * 0.75;
      if (posRef.current > L) { posRef.current = 0; vel = 0; }

      drawBg(ctx, W, H);

      /* Incline */
      const ix = 60, iy = 60, bx2 = ix + L * Math.cos(th), by2 = iy + L * Math.sin(th);
      ctx.strokeStyle = "#334155"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(ix, iy); ctx.lineTo(bx2, by2); ctx.lineTo(bx2, iy); ctx.closePath(); ctx.stroke();
      ctx.fillStyle = "#0f172a"; ctx.fill();
      /* Surface texture */
      ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const f = i / 8;
        const px = ix + f * L * Math.cos(th);
        const py = iy + f * L * Math.sin(th);
        const nx = -Math.sin(th) * 8, ny = Math.cos(th) * 8;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + nx, py + ny); ctx.stroke();
      }

      /* Angle label */
      ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(bx2, iy, 35, Math.PI, Math.PI + th); ctx.stroke();
      ctx.fillStyle = "#f59e0b"; ctx.font = "12px Inter"; ctx.textAlign = "center";
      ctx.fillText(`${thetaRef.current}°`, bx2 - 50, iy + 20);

      /* Rolling object position */
      const px = ix + posRef.current * Math.cos(th);
      const py = iy + posRef.current * Math.sin(th);
      const R  = 18;

      /* Draw based on shape */
      ctx.shadowBlur = 20; ctx.shadowColor = "#a78bfa";
      if (shapeRef.current === "ring") {
        ctx.strokeStyle = "#a78bfa"; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.arc(px, py, R, 0, TAU); ctx.stroke();
      } else {
        const grad = ctx.createRadialGradient(px - 4, py - 4, 2, px, py, R);
        grad.addColorStop(0, "#c4b5fd"); grad.addColorStop(1, "#6d28d9");
        ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(px, py, R, 0, TAU); ctx.fill();
        /* Rotation indicator */
        const rotAngle = (posRef.current / R);
        ctx.strokeStyle = "#f1f5f9"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(px, py);
        ctx.lineTo(px + R * Math.cos(rotAngle), py + R * Math.sin(rotAngle)); ctx.stroke();
      }
      ctx.shadowBlur = 0;

      /* Force decomposition */
      arw(ctx, px, py, px + Math.cos(th) * 40, py + Math.sin(th) * 40, "#10b981", "mg·sinθ");
      arw(ctx, px, py, px - Math.sin(th) * 30, py + Math.cos(th) * 30, "#f59e0b", "N");

      /* Labels */
      ctx.fillStyle = "#334155"; ctx.font = "bold 11px Inter"; ctx.textAlign = "left";
      const shapes = { sphere: "Solid Sphere β = 2/5", cylinder: "Cylinder β = 1/2", ring: "Ring β = 1" };
      ctx.fillText(shapes[shapeRef.current as keyof typeof shapes], 12, 20);
      ctx.fillStyle = "#1e3a5f"; ctx.font = "10px Inter";
      ctx.fillText(`a = g·sinθ/(1 + β)`, 12, 36);

      setTelem({ a: a.toFixed(2), v: vel.toFixed(1), I: beta.toFixed(2) });

      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <SimCard title="Rolling Motion on Incline" badge="Rolling" desc="a = g·sinθ/(1+β) — β = I/mr² depends on mass distribution">
      <canvas ref={canvasRef} style={{ width: "100%", height: 280, borderRadius: 12, display: "block" }} />
      <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" as const, alignItems: "center" }}>
        <Ctrl label="Angle θ" min={5} max={60} value={theta} onChange={setTheta} unit="°" color="#f59e0b" />
        <Btn label="Sphere" onClick={() => setShape("sphere")} bg={shape === "sphere" ? "#6d28d9" : "#1e293b"} fg="#f1f5f9" />
        <Btn label="Cylinder" onClick={() => setShape("cylinder")} bg={shape === "cylinder" ? "#0e7490" : "#1e293b"} fg="#f1f5f9" />
        <Btn label="Ring" onClick={() => setShape("ring")} bg={shape === "ring" ? "#b45309" : "#1e293b"} fg="#f1f5f9" />
      </div>
      <Telem items={[
        { label: "Accel a", value: `${telem.a} m/s²`, color: "#a78bfa" },
        { label: "Speed v", value: `${telem.v}`, color: "#38bdf8" },
        { label: "β = I/mr²", value: telem.I, color: "#f59e0b" },
      ]} />
    </SimCard>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 * 12. FORCE DECOMPOSITION — Resolve F into components
 *     Fx = F·cosθ, Fy = F·sinθ — vector addition
 * ═══════════════════════════════════════════════════════════════════ */
export function Sim_force_decomposition() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const [F, setF]     = useState(80);
  const [angle, setAngle] = useState(35);
  const tRef = useRef(0);
  const FRef = useRef(F), angRef = useRef(angle);
  const [telem, setTelem] = useState({ Fx: "0", Fy: "0", F: "0" });

  useEffect(() => { FRef.current = F; angRef.current = angle; }, [F, angle]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;

    function frame() {
      tRef.current += DT;
      const res = setupCanvas(canvas!); if (!res) { rafRef.current = requestAnimationFrame(frame); return; }
      const [ctx, W, H] = res;
      const CX = W / 2, CY = H * 0.62;
      const th  = angRef.current * Math.PI / 180;
      const mag = FRef.current;
      const Fx  = mag * Math.cos(th), Fy = mag * Math.sin(th);
      const scale = 2.2;

      drawBg(ctx, W, H);

      /* Origin dot */
      ctx.fillStyle = "#1e293b"; ctx.beginPath(); ctx.arc(CX, CY, 7, 0, TAU); ctx.fill();
      ctx.strokeStyle = "#475569"; ctx.lineWidth = 2; ctx.stroke();

      /* x-axis */
      arw(ctx, CX - 120, CY, CX + 140, CY, "#334155", "x", 1.5);
      /* y-axis */
      arw(ctx, CX, CY + 100, CX, CY - 140, "#334155", "y", 1.5);

      /* Fx component */
      arw(ctx, CX, CY, CX + Fx * scale, CY, "#38bdf8", `Fx=${Fx.toFixed(0)}N`);
      /* Fy component */
      arw(ctx, CX, CY, CX, CY - Fy * scale, "#ef4444", `Fy=${Fy.toFixed(0)}N`);

      /* Dashed construction lines */
      ctx.strokeStyle = "rgba(56,189,248,0.25)"; ctx.lineWidth = 1; ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(CX + Fx * scale, CY); ctx.lineTo(CX + Fx * scale, CY - Fy * scale); ctx.stroke();
      ctx.strokeStyle = "rgba(239,68,68,0.25)";
      ctx.beginPath(); ctx.moveTo(CX, CY - Fy * scale); ctx.lineTo(CX + Fx * scale, CY - Fy * scale); ctx.stroke();
      ctx.setLineDash([]);

      /* Resultant F vector */
      ctx.shadowBlur = 18; ctx.shadowColor = "#10b981";
      arw(ctx, CX, CY, CX + Fx * scale, CY - Fy * scale, "#10b981", `F=${mag}N`, 3);
      ctx.shadowBlur = 0;

      /* Angle arc */
      ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(CX, CY, 40, -th, 0, true); ctx.stroke();
      ctx.fillStyle = "#f59e0b"; ctx.font = "12px Inter"; ctx.textAlign = "center";
      ctx.fillText(`θ=${angRef.current}°`, CX + 55, CY - 14);

      /* Pythagoras label */
      ctx.fillStyle = "#1e3a5f"; ctx.font = "11px Inter"; ctx.textAlign = "left";
      ctx.fillText(`F² = Fx² + Fy² = ${Math.round(Fx*Fx)} + ${Math.round(Fy*Fy)} = ${Math.round(mag*mag)}`, 14, H - 20);

      setTelem({ Fx: Fx.toFixed(1), Fy: Fy.toFixed(1), F: mag.toFixed(0) });
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <SimCard title="Force Decomposition — Vector Components" badge="Vectors" desc="F = (Fx, Fy) — Fx = F·cosθ, Fy = F·sinθ, Pythagorean triangle">
      <canvas ref={canvasRef} style={{ width: "100%", height: 320, borderRadius: 12, display: "block" }} />
      <div style={{ display: "flex", gap: 14, marginTop: 12, flexWrap: "wrap" as const }}>
        <Ctrl label="Force F (N)" min={20} max={120} value={F} onChange={setF} unit=" N" color="#10b981" />
        <Ctrl label="Angle θ" min={0} max={85} value={angle} onChange={setAngle} unit="°" color="#f59e0b" />
      </div>
      <Telem items={[
        { label: "Fx = F·cosθ", value: `${telem.Fx} N`, color: "#38bdf8" },
        { label: "Fy = F·sinθ", value: `${telem.Fy} N`, color: "#ef4444" },
        { label: "|F|", value: `${telem.F} N`, color: "#10b981" },
      ]} />
    </SimCard>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 * 13. FLUID BUOYANCY — Archimedes' principle
 *     F_b = ρ_fluid × V_submerged × g
 * ═══════════════════════════════════════════════════════════════════ */
export function Sim_fluid_buoyancy() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const [rho, setRho]     = useState(1000);
  const [density, setDensity] = useState(800);  /* object density */
  const rhoRef = useRef(rho), densRef = useRef(density);
  const subRef = useRef(0.5);   /* fraction submerged, 0=floating, 1=sunk */
  const [telem, setTelem] = useState({ Fb: "0", Wt: "0", net: "0", sub: "0" });

  useEffect(() => { rhoRef.current = rho; densRef.current = density; }, [rho, density]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    let vel = 0;

    function frame() {
      const res = setupCanvas(canvas!); if (!res) { rafRef.current = requestAnimationFrame(frame); return; }
      const [ctx, W, H] = res;
      const fluidRho = rhoRef.current, objRho = densRef.current;
      const V = 1.0;
      const m = objRho * V * 0.001;
      const subFrac = Math.min(1, fluidRho / objRho);
      const Fb = fluidRho * subFrac * V * G * 0.001;
      const Wt = m * G;
      const Fnet = Wt - Fb;

      /* Animate position toward equilibrium */
      subRef.current += Fnet * 0.00008;
      subRef.current = Math.max(0.01, Math.min(1.0, subRef.current));

      drawBg(ctx, W, H);

      const tankX = W * 0.2, tankW = W * 0.6, tankH = H * 0.6, tankY = H * 0.25;
      const waterH = tankH * 0.75;
      const waterY = tankY + (tankH - waterH);

      /* Tank */
      ctx.fillStyle = "#0a1220"; rr(ctx, tankX, tankY, tankW, tankH, 8); ctx.fill();
      ctx.strokeStyle = "#1e3a5f"; ctx.lineWidth = 2; rr(ctx, tankX, tankY, tankW, tankH, 8); ctx.stroke();

      /* Water */
      const waterGrad = ctx.createLinearGradient(tankX, waterY, tankX, waterY + waterH);
      waterGrad.addColorStop(0, "rgba(56,189,248,0.3)");
      waterGrad.addColorStop(1, "rgba(14,165,233,0.12)");
      ctx.fillStyle = waterGrad;
      ctx.beginPath();
      ctx.rect(tankX + 2, waterY, tankW - 4, waterH - 2);
      ctx.clip(); ctx.fill(); ctx.restore?.();

      ctx.save(); ctx.beginPath(); ctx.rect(tankX + 2, waterY, tankW - 4, waterH - 2); ctx.clip();
      ctx.fillStyle = waterGrad; ctx.fillRect(tankX + 2, waterY, tankW - 4, waterH - 2); ctx.restore();

      /* Water ripple line */
      ctx.strokeStyle = "rgba(56,189,248,0.5)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(tankX, waterY); ctx.lineTo(tankX + tankW, waterY); ctx.stroke();

      /* Floating/sinking object */
      const objW = 60, objH = 40;
      const subPx = subRef.current * objH;
      const objY  = waterY - (objH - subPx);
      const objX  = tankX + (tankW - objW) / 2;

      const objGrad = ctx.createLinearGradient(objX, objY, objX, objY + objH);
      objGrad.addColorStop(0, "#f59e0b"); objGrad.addColorStop(1, "#b45309");
      ctx.shadowBlur = 16; ctx.shadowColor = "#f59e0b";
      rr(ctx, objX, objY, objW, objH, 6); ctx.fillStyle = objGrad; ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#fff"; ctx.font = "bold 10px Inter"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(`ρ=${objRho}`, objX + objW / 2, objY + objH / 2);

      /* Force arrows */
      const Fscale = 0.03;
      arw(ctx, objX + objW / 2, objY, objX + objW / 2, objY - Fb * Fscale * 50, "#38bdf8", "F_b");
      arw(ctx, objX + objW / 2, objY + objH, objX + objW / 2, objY + objH + Wt * Fscale * 50, "#ef4444", "mg");

      /* Fluid density label */
      ctx.fillStyle = "rgba(56,189,248,0.6)"; ctx.font = "11px Inter"; ctx.textAlign = "left";
      ctx.fillText(`Fluid ρ = ${fluidRho} kg/m³`, tankX + 8, waterY + 16);

      setTelem({
        Fb:  Fb.toFixed(2),
        Wt:  Wt.toFixed(2),
        net: Math.abs(Fnet).toFixed(2),
        sub: (subFrac * 100).toFixed(0),
      });

      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <SimCard title="Archimedes' Principle — Buoyancy" badge="Fluids" desc="F_b = ρ_fluid · V_sub · g — object floats when F_b ≥ mg">
      <canvas ref={canvasRef} style={{ width: "100%", height: 300, borderRadius: 12, display: "block" }} />
      <div style={{ display: "flex", gap: 14, marginTop: 12, flexWrap: "wrap" as const }}>
        <Ctrl label="Fluid Density (kg/m³)" min={700} max={13600} step={100} value={rho} onChange={setRho} unit="" color="#38bdf8" />
        <Ctrl label="Object Density (kg/m³)" min={200} max={8000} step={100} value={density} onChange={setDensity} unit="" color="#f59e0b" />
      </div>
      <Telem items={[
        { label: "Buoyancy F_b", value: `${telem.Fb} N`, color: "#38bdf8" },
        { label: "Weight mg", value: `${telem.Wt} N`, color: "#ef4444" },
        { label: "Net Force", value: `${telem.net} N`, color: "#f59e0b" },
        { label: "% Submerged", value: `${telem.sub}%`, color: "#a78bfa" },
      ]} />
    </SimCard>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 * 14. MOMENTUM BEFORE vs AFTER — Split-screen momentum conservation
 *     Shows total momentum p = Σmᵢvᵢ is constant in isolated system
 * ═══════════════════════════════════════════════════════════════════ */
export function Sim_momentum_split() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const [m1, setM1] = useState(4);
  const [m2, setM2] = useState(2);
  const [v1, setV1] = useState(6);
  const [v2, setV2] = useState(-2);
  const sRef = useRef({ x1: 80, x2: 0, vx1: 0, vx2: 0, phase: 0, timer: 0 });
  const m1r = useRef(m1), m2r = useRef(m2), v1r = useRef(v1), v2r = useRef(v2);

  useEffect(() => { m1r.current = m1; m2r.current = m2; v1r.current = v1; v2r.current = v2; sRef.current = { x1: 80, x2: 0, vx1: v1, vx2: v2, phase: 0, timer: 0 }; }, [m1, m2, v1, v2]);

  const [telem, setTelem] = useState({ pi: "0", pf: "0", KE_i: "0", KE_f: "0" });

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;

    function frame() {
      const res = setupCanvas(canvas!); if (!res) { rafRef.current = requestAnimationFrame(frame); return; }
      const [ctx, W, H] = res;
      const s = sRef.current;
      if (s.x2 === 0) s.x2 = W - 100;
      const MA = m1r.current, MB = m2r.current;
      const R1 = 12 + MA * 3, R2 = 12 + MB * 3;
      const HH = H / 2;

      /* Move */
      s.x1 += s.vx1 * DT * 40;
      s.x2 += s.vx2 * DT * 40;

      /* Collision */
      const sep = s.x2 - s.x1;
      if (sep <= R1 + R2 && s.phase === 0) {
        /* Elastic collision */
        const u1 = s.vx1, u2 = s.vx2;
        s.vx1 = (u1 * (MA - MB) + 2 * MB * u2) / (MA + MB);
        s.vx2 = (u2 * (MB - MA) + 2 * MA * u1) / (MA + MB);
        s.phase = 1;
      }

      /* Wall bounces */
      if (s.x1 < R1) { s.x1 = R1; s.vx1 = Math.abs(s.vx1); }
      if (s.x1 > W - R1) { s.x1 = W - R1; s.vx1 = -Math.abs(s.vx1); }
      if (s.x2 < R2) { s.x2 = R2; s.vx2 = Math.abs(s.vx2); }
      if (s.x2 > W - R2) { s.x2 = W - R2; s.vx2 = -Math.abs(s.vx2); }

      const pi = MA * v1r.current + MB * v2r.current;
      const pf = MA * s.vx1 + MB * s.vx2;
      const KE_i = 0.5 * MA * v1r.current ** 2 + 0.5 * MB * v2r.current ** 2;
      const KE_f = 0.5 * MA * s.vx1 ** 2 + 0.5 * MB * s.vx2 ** 2;

      drawBg(ctx, W, H);

      /* Midline */
      ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 1; ctx.setLineDash([8, 6]);
      ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "#1e3a5f"; ctx.font = "10px Inter"; ctx.textAlign = "center";
      ctx.fillText("Σp = constant", W / 2, H - 20);

      /* Ball 1 */
      ctx.shadowBlur = 20; ctx.shadowColor = "#6366f1";
      ctx.fillStyle = "#6366f1"; ctx.beginPath(); ctx.arc(s.x1, HH, R1, 0, TAU); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#f1f5f9"; ctx.font = `bold ${R1 * 0.7}px Inter`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(`${MA}`, s.x1, HH);
      arw(ctx, s.x1, HH, s.x1 + s.vx1 * 15, HH, "#6366f1", "p₁");

      /* Ball 2 */
      ctx.shadowBlur = 20; ctx.shadowColor = "#f59e0b";
      ctx.fillStyle = "#f59e0b"; ctx.beginPath(); ctx.arc(s.x2, HH, R2, 0, TAU); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#1e293b"; ctx.fillText(`${MB}`, s.x2, HH);
      arw(ctx, s.x2, HH, s.x2 + s.vx2 * 15, HH, "#f59e0b", "p₂");

      /* Total momentum bar */
      const pTot = pf, pScale = 3;
      const barCX = W / 2, barY = 24;
      ctx.fillStyle = "#0a1220"; rr(ctx, barCX - 80, barY, 160, 14, 4); ctx.fill();
      ctx.fillStyle = "#10b981";
      const bw = Math.min(160, Math.abs(pTot * pScale));
      rr(ctx, pTot >= 0 ? barCX : barCX - bw, barY, bw, 14, 4); ctx.fill();
      ctx.fillStyle = "#10b981"; ctx.font = "10px Inter"; ctx.textAlign = "center";
      ctx.fillText(`Total p = ${pf.toFixed(1)} kg·m/s`, barCX, barY - 8);

      setTelem({ pi: pi.toFixed(2), pf: pf.toFixed(2), KE_i: KE_i.toFixed(1), KE_f: KE_f.toFixed(1) });

      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <SimCard title="Momentum Conservation — Live" badge="p = const" desc="Total momentum p = Σmv stays constant in an isolated system">
      <canvas ref={canvasRef} style={{ width: "100%", height: 240, borderRadius: 12, display: "block" }} />
      <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" as const }}>
        <Ctrl label="m₁ (kg)" min={1} max={8} value={m1} onChange={setM1} color="#6366f1" />
        <Ctrl label="m₂ (kg)" min={1} max={8} value={m2} onChange={setM2} color="#f59e0b" />
        <Ctrl label="v₁ (m/s)" min={-10} max={15} value={v1} onChange={setV1} color="#a78bfa" />
        <Ctrl label="v₂ (m/s)" min={-10} max={10} value={v2} onChange={setV2} color="#fbbf24" />
      </div>
      <Telem items={[
        { label: "p_initial", value: `${telem.pi} kg·m/s`, color: "#6366f1" },
        { label: "p_final", value: `${telem.pf} kg·m/s`, color: "#10b981" },
        { label: "KE before", value: `${telem.KE_i} J`, color: "#f59e0b" },
        { label: "KE after", value: `${telem.KE_f} J`, color: "#38bdf8" },
      ]} />
    </SimCard>
  );
}

/* ═══════════════════════════════════════════════════════════════════
 * 15. RESONANCE & FORCED OSCILLATION
 *     Amplitude peaks when ω_drive ≈ ω₀ = √(k/m)
 * ═══════════════════════════════════════════════════════════════════ */
export function Sim_resonance_demo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const [wDrive, setWDrive] = useState(30);   /* × 0.1 */
  const [k, setK]           = useState(50);
  const [m, setM]           = useState(2);
  const wRef = useRef(wDrive), kRef = useRef(k), mRef = useRef(m);
  const tRef   = useRef(0);
  const xRef   = useRef(0), vRef = useRef(0);
  const histRef = useRef<number[]>([]);
  const [telem, setTelem] = useState({ w0: "0", wd: "0", A: "0", ratio: "0" });

  useEffect(() => { wRef.current = wDrive; kRef.current = k; mRef.current = m; xRef.current = 0; vRef.current = 0; histRef.current = []; }, [wDrive, k, m]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;

    function frame() {
      const res = setupCanvas(canvas!); if (!res) { rafRef.current = requestAnimationFrame(frame); return; }
      const [ctx, W, H] = res;
      tRef.current += DT * 2;
      const kv = kRef.current, mv = mRef.current;
      const w0 = Math.sqrt(kv / mv);
      const wd = wRef.current / 10;
      const Fd = 20;  /* driving force amplitude */
      const c  = 0.8; /* damping */

      /* Driven oscillator: m·ẍ + c·ẋ + k·x = F₀·cos(ω_d·t) */
      const x = xRef.current, v = vRef.current;
      const aForce = (Fd * Math.cos(wd * tRef.current) - c * v - kv * x) / mv;
      vRef.current = v + aForce * DT * 2;
      xRef.current = x + vRef.current * DT * 2;

      histRef.current.push(xRef.current);
      if (histRef.current.length > W - 20) histRef.current.shift();

      drawBg(ctx, W, H);

      /* Spring + mass visualization */
      const wallX = 30, springY = H * 0.28;
      const massX = W / 2 + xRef.current * 2.5;

      /* Spring coil */
      const nCoils = 14;
      ctx.strokeStyle = "#475569"; ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= nCoils * 8; i++) {
        const frac = i / (nCoils * 8);
        const sx = wallX + frac * (massX - 30 - wallX);
        const sy = springY + 10 * Math.sin(frac * nCoils * TAU);
        i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      /* Wall */
      ctx.fillStyle = "#1e293b"; ctx.fillRect(0, springY - 30, wallX, 60);

      /* Driving force piston at right */
      const pistonX = W - 30;
      const pistonY = springY + 20 * Math.cos(wd * tRef.current);
      ctx.strokeStyle = "#334155"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(pistonX - 20, springY); ctx.lineTo(massX + 30, springY); ctx.stroke();
      ctx.fillStyle = "#0f172a"; rr(ctx, pistonX - 12, pistonY - 20, 24, 40, 4); ctx.fill();
      ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 1.5; rr(ctx, pistonX - 12, pistonY - 20, 24, 40, 4); ctx.stroke();
      ctx.fillStyle = "#f59e0b"; ctx.font = "9px Inter"; ctx.textAlign = "center";
      ctx.fillText("F₀", pistonX, pistonY + 28);

      /* String to piston */
      ctx.strokeStyle = "#64748b"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(massX + 25, springY); ctx.lineTo(pistonX - 12, pistonY); ctx.stroke();

      /* Mass block */
      const mSize = 40;
      const grad = ctx.createLinearGradient(massX - mSize/2, 0, massX + mSize/2, mSize);
      grad.addColorStop(0, "#6366f1"); grad.addColorStop(1, "#4f46e5");
      ctx.shadowBlur = 20; ctx.shadowColor = "#6366f1";
      rr(ctx, massX - mSize/2, springY - mSize/2, mSize, mSize, 6); ctx.fillStyle = grad; ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#f1f5f9"; ctx.font = "bold 10px Inter"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(`${mv}kg`, massX, springY);

      /* Time-series graph */
      const graphY = H * 0.56, graphH = H * 0.36;
      ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(10, graphY); ctx.lineTo(W - 10, graphY); ctx.stroke();
      ctx.fillStyle = "#1e3a5f"; ctx.font = "9px Inter"; ctx.textAlign = "right";
      ctx.fillText("x(t)", W - 12, graphY - 4);

      if (histRef.current.length > 2) {
        ctx.strokeStyle = "#6366f1"; ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < histRef.current.length; i++) {
          const px = 10 + i, py = graphY - histRef.current[i] * 1.5;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      /* Resonance indicator */
      const ratio = wd / w0;
      const resonating = Math.abs(ratio - 1) < 0.12;
      if (resonating) {
        ctx.fillStyle = "rgba(239,68,68,0.12)";
        ctx.fillRect(10, graphY - 80, W - 20, 160);
        ctx.fillStyle = "#ef4444"; ctx.font = "bold 13px Inter"; ctx.textAlign = "center";
        ctx.fillText("⚠ RESONANCE — ω_drive ≈ ω₀", W / 2, graphY - 85);
      }

      const amp = Math.max(...histRef.current.map(Math.abs).slice(-60), 0.01);
      setTelem({
        w0: w0.toFixed(2),
        wd: wd.toFixed(2),
        A: amp.toFixed(1),
        ratio: ratio.toFixed(2),
      });

      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <SimCard title="Resonance & Forced Oscillation" badge="Resonance" desc="Amplitude peaks when ω_drive ≈ ω₀ = √(k/m) — dangerous in real structures!">
      <canvas ref={canvasRef} style={{ width: "100%", height: 340, borderRadius: 12, display: "block" }} />
      <div style={{ display: "flex", gap: 14, marginTop: 12, flexWrap: "wrap" as const }}>
        <Ctrl label="Drive ω × 10" min={5} max={60} value={wDrive} onChange={setWDrive} unit="" color="#f59e0b" />
        <Ctrl label="Spring k (N/m)" min={10} max={200} step={10} value={k} onChange={setK} unit="" color="#6366f1" />
        <Ctrl label="Mass m (kg)" min={1} max={10} value={m} onChange={setM} unit=" kg" color="#10b981" />
      </div>
      <Telem items={[
        { label: "ω₀ = √(k/m)", value: `${telem.w0} rad/s`, color: "#6366f1" },
        { label: "ω_drive", value: `${telem.wd} rad/s`, color: "#f59e0b" },
        { label: "Amplitude", value: `${telem.A} px`, color: "#10b981" },
        { label: "ω_d/ω₀", value: telem.ratio, color: Math.abs(Number(telem.ratio) - 1) < 0.12 ? "#ef4444" : "#a78bfa" },
      ]} />
    </SimCard>
  );
}
