"use client";
/**
 * FILE: Topic10Professional.tsx
 * LOCATION: src/components/simulations/Topic10Professional.tsx
 * PURPOSE: 28 brand-new professional physics simulations using HTML5 Canvas.
 *          All simulations have real physics equations, auto-start on mount,
 *          interactive controls, and real-time telemetry.
 *          CBSE Class 9 — Force & Laws of Motion — advanced real-world scenarios.
 * LAST UPDATED: 2026-06-01
 */

import React, { useRef, useEffect, useState, useCallback } from "react";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * PHYSICS CONSTANTS
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const G  = 9.8;     /* Earth gravity m/s² */
const DT = 1 / 60; /* simulation time-step (60 fps) */

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SHARED STYLE CONSTANTS (avoid repetition)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const WRP:  React.CSSProperties = { background: "#080f1c", borderRadius: 18, border: "1px solid #1e2d3d", overflow: "hidden", fontFamily: "Inter, system-ui, sans-serif" };
const HDR:  React.CSSProperties = { padding: "16px 20px 12px", background: "#060d18", borderBottom: "1px solid #0f1e30" };
const H3:   React.CSSProperties = { margin: 0, fontSize: 15, fontWeight: 700, color: "#E2E8F0", letterSpacing: -0.3 };
const DESC: React.CSSProperties = { margin: "6px 0 0", fontSize: 12, color: "#64748B", lineHeight: 1.55 };
const CVS:  React.CSSProperties = { display: "block", width: "100%", height: 300 };
const CTRLS:React.CSSProperties = { padding: "12px 20px", background: "#07111e", borderTop: "1px solid #0f1e30", display: "flex", flexWrap: "wrap" as const, gap: 16, alignItems: "center" };
const TELE: React.CSSProperties = { padding: "10px 20px", background: "#050d18", borderTop: "1px solid #0f1e30", display: "flex", flexWrap: "wrap" as const, gap: 20 };
const TV:   React.CSSProperties = { display: "flex", flexDirection: "column" as const, gap: 1 };
const TK:   React.CSSProperties = { fontSize: 10, color: "#475569", textTransform: "uppercase" as const, letterSpacing: 0.6 };
const TP:   React.CSSProperties = { fontSize: 13, fontWeight: 700, color: "#60A5FA", fontVariantNumeric: "tabular-nums" };
const SLD:  React.CSSProperties = { accentColor: "#2563EB", cursor: "pointer", width: 120 };
const SLV:  React.CSSProperties = { fontSize: 11, color: "#94A3B8", minWidth: 44, textAlign: "right" as const };
const SLW:  React.CSSProperties = { display: "flex", alignItems: "center", gap: 6 };
const SLL:  React.CSSProperties = { fontSize: 11, color: "#64748B" };

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CANVAS UTILITIES (re-declared per file convention)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function setupCanvas(c: HTMLCanvasElement): [CanvasRenderingContext2D, number, number] | null {
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  const dpr = window.devicePixelRatio || 1;
  const W = c.clientWidth  || 560;
  const H = c.clientHeight || 300;
  if (c.width !== W * dpr || c.height !== H * dpr) {
    c.width  = W * dpr;
    c.height = H * dpr;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return [ctx, W, H];
}

function drawBg(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.fillStyle = "#050c18";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(99,102,241,0.04)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
}

function arw(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, col: string, lbl = "", lw = 2.5) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 5) return;
  const ux = dx / len, uy = dy / len;
  const ah = Math.min(14, len * 0.38);
  ctx.save();
  ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw;
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - ah * (ux - 0.42 * uy), y2 - ah * (uy + 0.42 * ux));
  ctx.lineTo(x2 - ah * (ux + 0.42 * uy), y2 - ah * (uy - 0.42 * ux));
  ctx.closePath(); ctx.fill();
  if (lbl) {
    ctx.font = "bold 10px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    const mx = (x1 + x2) / 2 - uy * 14;
    const my = (y1 + y2) / 2 + ux * 14;
    ctx.fillText(lbl, mx, my);
  }
  ctx.restore();
}

function pill(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function lbl(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, col = "#94A3B8", size = 11) {
  ctx.font = `${size}px Inter, system-ui, sans-serif`;
  ctx.fillStyle = col;
  ctx.textAlign = "center";
  ctx.fillText(text, x, y);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 1. LUNAR LANDER
 * Moon gravity = 1.6 m/s². Thrust slider. Real fuel depletion.
 * Tsiolkovsky: a = (F_thrust / mass) - g_moon
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_lunar_lander() {
  const cvs = useRef<HTMLCanvasElement>(null);
  type St = { y: number; vy: number; fuel: number; landed: boolean; crashed: boolean; trail: {x: number; y: number}[] };
  const st  = useRef<St>({ y: 0, vy: 0, fuel: 100, landed: false, crashed: false, trail: [] });
  const raf = useRef(0);
  const [p, setP] = useState({ thrust: 35000, mass: 2000 });
  const [t, setT] = useState({ alt: 0, spd: 0, fuel: 100, acc: 0 });

  useEffect(() => {
    const s = st.current;
    cancelAnimationFrame(raf.current);
    const canvas = cvs.current; if (!canvas) return;
    const r0 = setupCanvas(canvas); if (!r0) return;
    const [, W, H] = r0;
    const PX = (H - 60) / 200; /* px per metre */

    s.y = 180; s.vy = 5; s.fuel = 100; s.landed = false; s.crashed = false; s.trail = [];
    const moonY = H - 40;
    let fr = 0;

    function tick() {
      const canvas = cvs.current; if (!canvas) return;
      const r = setupCanvas(canvas); if (!r) return;
      const [ctx, W, H] = r;

      if (!s.landed && !s.crashed) {
        const g_moon = 1.62;
        const thrustN = s.fuel > 0 ? p.thrust : 0;
        const a = thrustN / p.mass - g_moon;
        s.vy += a * DT;
        s.y  -= a * DT * 20; /* px movement */
        s.fuel = Math.max(0, s.fuel - (thrustN > 0 ? 0.12 : 0));

        const altM = Math.max(0, (moonY - s.y - 20) / PX);
        if (altM <= 0) {
          if (Math.abs(s.vy) < 3) s.landed = true; else s.crashed = true;
          s.y = moonY - 20;
        }

        s.trail.push({ x: W / 2, y: s.y });
        if (s.trail.length > 60) s.trail.shift();
        if (fr % 3 === 0) setT({ alt: Math.round(altM), spd: Math.abs(s.vy).toFixed(1) as unknown as number, fuel: Math.round(s.fuel), acc: (a).toFixed(2) as unknown as number });
      }

      drawBg(ctx, W, H);

      /* Moon surface */
      ctx.fillStyle = "#1a2744"; ctx.fillRect(0, moonY, W, H - moonY);
      ctx.fillStyle = "#243256"; ctx.fillRect(0, moonY, W, 3);
      lbl(ctx, "Moon Surface", W / 2, H - 10, "#3B4F72", 11);

      /* Stars */
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 137 + 7) % W);
        const sy = ((i * 97 + 3) % (moonY - 20));
        ctx.fillRect(sx, sy, i % 3 === 0 ? 1.5 : 1, i % 3 === 0 ? 1.5 : 1);
      }

      /* Trail */
      if (s.trail.length > 1) {
        ctx.strokeStyle = "rgba(249,115,22,0.35)"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(s.trail[0].x, s.trail[0].y);
        s.trail.forEach(pt => ctx.lineTo(pt.x, pt.y)); ctx.stroke();
      }

      /* Rocket */
      const rx = W / 2;
      const ry = Math.min(s.y, moonY - 20);
      ctx.save();
      /* Body */
      pill(ctx, rx - 12, ry, 24, 30, 5, "#4F46E5");
      /* Nose */
      ctx.beginPath(); ctx.moveTo(rx - 10, ry); ctx.lineTo(rx + 10, ry); ctx.lineTo(rx, ry - 18); ctx.closePath();
      ctx.fillStyle = "#6366F1"; ctx.fill();
      /* Legs */
      ctx.strokeStyle = "#818CF8"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(rx - 8, ry + 28); ctx.lineTo(rx - 18, ry + 40); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rx + 8, ry + 28); ctx.lineTo(rx + 18, ry + 40); ctx.stroke();
      /* Flame */
      if (s.fuel > 0 && !s.landed && !s.crashed) {
        const flen = 30 * (p.thrust / 50000);
        ctx.beginPath();
        ctx.moveTo(rx - 5, ry + 30); ctx.lineTo(rx + 5, ry + 30); ctx.lineTo(rx, ry + 30 + flen); ctx.closePath();
        ctx.fillStyle = "#F97316"; ctx.fill();
        ctx.beginPath();
        ctx.moveTo(rx - 3, ry + 30); ctx.lineTo(rx + 3, ry + 30); ctx.lineTo(rx, ry + 30 + flen * 0.6); ctx.closePath();
        ctx.fillStyle = "#FEF08A"; ctx.fill();
      }
      ctx.restore();

      /* Status overlay */
      if (s.landed) {
        ctx.fillStyle = "rgba(16,185,129,0.9)"; ctx.fillRect(W / 2 - 80, 30, 160, 32);
        lbl(ctx, "✓ Safe Landing!", W / 2, 51, "#fff", 14);
      } else if (s.crashed) {
        ctx.fillStyle = "rgba(239,68,68,0.9)"; ctx.fillRect(W / 2 - 80, 30, 160, 32);
        lbl(ctx, "✗ Crash! Too fast", W / 2, 51, "#fff", 14);
      }

      /* Force labels */
      if (!s.landed && !s.crashed && s.fuel > 0) {
        arw(ctx, rx, ry + 15, rx, ry - 30, "#F59E0B", `T=${(p.thrust / 1000).toFixed(0)}kN`);
        arw(ctx, rx + 20, ry + 15, rx + 20, ry + 50, "#EF4444", `W=${(p.mass * 1.62 / 1000).toFixed(1)}kN`);
      }

      fr++;
      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [p]);

  return (
    <div style={WRP}>
      <div style={HDR}>
        <h3 style={H3}>🌙 Lunar Lander — Moon Gravity (g = 1.62 m/s²)</h3>
        <p style={DESC}>Moon's gravity is 1/6th of Earth's. Land safely by adjusting thrust to slow the descent. If landing speed &gt; 3 m/s → crash. <strong>a = (Thrust / mass) − 1.62</strong></p>
      </div>
      <canvas ref={cvs} style={CVS} />
      <div style={CTRLS}>
        <div style={SLW}><span style={SLL}>Thrust (N)</span>
          <input style={SLD} type="range" min={10000} max={60000} step={1000} value={p.thrust}
            onChange={e => { st.current.y = 0; st.current.vy = 5; st.current.fuel = 100; st.current.landed = false; st.current.crashed = false; st.current.trail = []; setP(x => ({ ...x, thrust: +e.target.value })); }} />
          <span style={SLV}>{(p.thrust / 1000).toFixed(0)}kN</span>
        </div>
        <div style={SLW}><span style={SLL}>Mass (kg)</span>
          <input style={SLD} type="range" min={1000} max={5000} step={100} value={p.mass}
            onChange={e => { st.current.y = 0; st.current.vy = 5; st.current.fuel = 100; st.current.landed = false; st.current.crashed = false; st.current.trail = []; setP(x => ({ ...x, mass: +e.target.value })); }} />
          <span style={SLV}>{p.mass}kg</span>
        </div>
      </div>
      <div style={TELE}>
        {[["Altitude", `${t.alt} m`], ["Speed", `${t.spd} m/s`], ["Fuel", `${t.fuel}%`], ["Acceleration", `${t.acc} m/s²`]].map(([k, v]) => (
          <div key={k} style={TV}><span style={TK}>{k}</span><span style={TP}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 2. MULTI-PLANET GRAVITY DROP
 * Same ball dropped from 80m on Earth, Moon, Mars, Jupiter.
 * t = √(2h/g). Compare fall times side by side.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_gravity_planets_drop() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const st  = useRef({ ys: [0, 0, 0, 0], landed: [false, false, false, false], times: [0, 0, 0, 0], t: 0 });
  const raf = useRef(0);
  const [running, setRunning] = useState(true);
  const [tele, setTele] = useState({ times: ["–", "–", "–", "–"] });

  const PLANETS = [
    { name: "Earth", g: 9.8,  col: "#3B82F6", surf: "#1a3a5c" },
    { name: "Moon",  g: 1.62, col: "#94A3B8", surf: "#2d3748" },
    { name: "Mars",  g: 3.72, col: "#EF4444", surf: "#5c2020" },
    { name: "Jupiter", g: 24.8, col: "#F59E0B", surf: "#5c4a1a" },
  ];
  const H_METRES = 80;

  useEffect(() => {
    const s = st.current;
    s.ys = [0, 0, 0, 0]; s.landed = [false, false, false, false]; s.times = [0, 0, 0, 0]; s.t = 0;
    cancelAnimationFrame(raf.current);

    function tick() {
      const canvas = cvs.current; if (!canvas) return;
      const r = setupCanvas(canvas); if (!r) return;
      const [ctx, W, H] = r;

      drawBg(ctx, W, H);
      const groundY = H - 40;
      const colW = W / 4;
      const PX = (groundY - 50) / H_METRES;

      if (running) s.t += DT;

      PLANETS.forEach((pl, i) => {
        const cx = colW * i + colW / 2;

        /* Physics: y = ½ g t² */
        if (!s.landed[i]) {
          const ypx = 0.5 * pl.g * s.t * s.t * PX;
          s.ys[i] = Math.min(ypx, (groundY - 50));
          if (s.ys[i] >= (groundY - 50)) {
            s.landed[i] = true;
            s.times[i] = s.t;
          }
        }

        /* Surface */
        ctx.fillStyle = pl.surf; ctx.fillRect(colW * i, groundY, colW, H - groundY);
        lbl(ctx, pl.name, cx, H - 20, pl.col, 11);
        lbl(ctx, `g=${pl.g} m/s²`, cx, H - 8, "#475569", 9);

        /* Drop height marker */
        ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(colW * i + 4, 50); ctx.lineTo(colW * (i + 1) - 4, 50); ctx.stroke();
        ctx.setLineDash([]);

        /* Ball */
        const ballY = 50 + s.ys[i];
        ctx.beginPath(); ctx.arc(cx, ballY, 10, 0, Math.PI * 2);
        ctx.fillStyle = pl.col; ctx.fill();

        /* Time badge */
        if (s.landed[i]) {
          pill(ctx, cx - 28, groundY - 24, 56, 18, 5, `${pl.col}44`);
          lbl(ctx, `${s.times[i].toFixed(2)}s`, cx, groundY - 11, pl.col, 11);
        }

        /* Column separator */
        if (i < 3) { ctx.strokeStyle = "#0f2030"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(colW * (i + 1), 0); ctx.lineTo(colW * (i + 1), H); ctx.stroke(); }
      });

      /* Reset when all landed */
      if (s.landed.every(Boolean)) {
        if (running) {
          const newTimes = [...s.times];
          setTele({ times: newTimes.map(t => `${t.toFixed(2)}s`) });
          setTimeout(() => {
            s.ys = [0, 0, 0, 0]; s.landed = [false, false, false, false]; s.times = [0, 0, 0, 0]; s.t = 0;
          }, 2500);
        }
      }

      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [running]);

  return (
    <div style={WRP}>
      <div style={HDR}>
        <h3 style={H3}>🌍 Multi-Planet Gravity Drop — t = √(2h/g)</h3>
        <p style={DESC}>Same ball, same height (80 m) dropped on four planets. Gravity determines fall time: Earth falls fastest of the four common planets. <strong>t = √(2h / g)</strong></p>
      </div>
      <canvas ref={cvs} style={CVS} />
      <div style={CTRLS}>
        <button onClick={() => { const s = st.current; s.ys = [0,0,0,0]; s.landed = [false,false,false,false]; s.times = [0,0,0,0]; s.t = 0; }} style={{ padding: "6px 14px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>↺ Reset</button>
        <span style={{ fontSize: 11, color: "#475569" }}>Ball auto-resets after all land</span>
      </div>
      <div style={TELE}>
        {["Earth", "Moon", "Mars", "Jupiter"].map((pl, i) => (
          <div key={pl} style={TV}><span style={TK}>{pl} time</span><span style={TP}>{tele.times[i]}</span></div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 3. CANNON ANGLE LABORATORY
 * 5 launch angles (15–75°). Same v₀. Show why 45° gives max range.
 * Range R = v₀² sin(2θ) / g  |  Max height H = v₀² sin²θ / (2g)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_cannon_angles() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [v0, setV0] = useState(40);
  const [tele, setTele] = useState({ maxRange: 0, maxHeight: 0, time: 0 });

  useEffect(() => {
    cancelAnimationFrame(raf.current);
    let fr = 0;
    const ANGLES  = [15, 30, 45, 60, 75];
    const COLORS  = ["#60A5FA", "#34D399", "#F59E0B", "#A78BFA", "#F87171"];

    function tick() {
      const canvas = cvs.current; if (!canvas) return;
      const r = setupCanvas(canvas); if (!r) return;
      const [ctx, W, H] = r;

      drawBg(ctx, W, H);

      const groundY = H - 35;
      const originX = 50;
      const originY = groundY;

      /* Scale: how many pixels per metre */
      const maxRange45 = v0 * v0 / G;
      const scale = Math.max(1, (W - 80) / maxRange45);

      /* Ground */
      ctx.fillStyle = "#0f2030"; ctx.fillRect(0, groundY, W, H - groundY);
      ctx.strokeStyle = "#1a3a5c"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(W, groundY); ctx.stroke();

      /* Cannon */
      ctx.beginPath(); ctx.arc(originX, originY, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#374151"; ctx.fill();

      let bestRange = 0;
      const t = (fr % 180) / 60; /* loops every 3 seconds */

      ANGLES.forEach((deg, i) => {
        const θ = (deg * Math.PI) / 180;
        const vx = v0 * Math.cos(θ);
        const vy = v0 * Math.sin(θ);
        const T  = (2 * vy) / G; /* total flight time */
        const R  = (v0 * v0 * Math.sin(2 * θ)) / G;
        const Hm = (vy * vy) / (2 * G);

        if (R > bestRange) bestRange = R;

        const steps = 80;
        ctx.strokeStyle = ANGLES[i] === 45 ? "#F59E0B" : COLORS[i];
        ctx.lineWidth   = ANGLES[i] === 45 ? 2.5 : 1.5;
        ctx.globalAlpha = 0.6 + (ANGLES[i] === 45 ? 0.4 : 0);
        ctx.setLineDash(ANGLES[i] === 45 ? [] : [4, 4]);
        ctx.beginPath();
        for (let j = 0; j <= steps; j++) {
          const tj = (j / steps) * T;
          const px = originX + vx * tj * scale;
          const py = originY - (vy * tj - 0.5 * G * tj * tj) * scale;
          if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;

        /* Range label at landing */
        const lx = originX + R * scale;
        if (lx < W - 4) {
          ctx.beginPath(); ctx.arc(lx, groundY, 3, 0, Math.PI * 2);
          ctx.fillStyle = COLORS[i]; ctx.fill();
          lbl(ctx, `${deg}°`, lx, groundY + 14, COLORS[i], 10);
        }

        /* Animated ball */
        const bt = Math.min(t, T);
        const bx = originX + vx * bt * scale;
        const by = originY - (vy * bt - 0.5 * G * bt * bt) * scale;
        if (bt < T && bx >= originX && bx < W) {
          ctx.beginPath(); ctx.arc(bx, by, 5, 0, Math.PI * 2);
          ctx.fillStyle = COLORS[i]; ctx.fill();
        }

        lbl(ctx, `${deg}°`, 18, groundY - 60 - i * 16, COLORS[i], 10);
        ctx.fillStyle = COLORS[i];
        ctx.fillRect(28, groundY - 68 - i * 16, 20, 2);
      });

      /* Labels */
      lbl(ctx, `45° = MAX RANGE (${(v0 * v0 / G).toFixed(0)} m)`, W / 2, 20, "#F59E0B", 12);
      lbl(ctx, `v₀ = ${v0} m/s`, W - 60, 20, "#64748B", 10);

      if (fr % 5 === 0) setTele({ maxRange: Math.round(v0 * v0 / G), maxHeight: Math.round(v0 * v0 / (2 * G)), time: +(2 * v0 / G).toFixed(2) });
      fr++;
      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [v0]);

  return (
    <div style={WRP}>
      <div style={HDR}>
        <h3 style={H3}>🎯 Cannon Angle Lab — Maximum Range at 45°</h3>
        <p style={DESC}>Same initial speed, five different launch angles. The <span style={{ color: "#F59E0B" }}>45° trajectory (gold)</span> always achieves maximum horizontal range. Complementary angles (30°/60°, 15°/75°) give equal ranges. <strong>R = v₀² sin(2θ) / g</strong></p>
      </div>
      <canvas ref={cvs} style={CVS} />
      <div style={CTRLS}>
        <div style={SLW}><span style={SLL}>Initial Speed (m/s)</span>
          <input style={SLD} type="range" min={20} max={60} value={v0} onChange={e => setV0(+e.target.value)} />
          <span style={SLV}>{v0} m/s</span>
        </div>
      </div>
      <div style={TELE}>
        {[["Max Range (45°)", `${tele.maxRange} m`], ["Max Height (90°)", `${tele.maxHeight} m`], ["Flight Time (45°)", `${tele.time} s`]].map(([k, v]) => (
          <div key={k} style={TV}><span style={TK}>{k}</span><span style={TP}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 4. CRUMPLE ZONE vs RIGID CAR
 * Same crash speed v=15 m/s, mass 1000 kg → same Δp = 15,000 kg·m/s
 * Rigid: Δt=0.05s → F=300,000 N   |   Crumple: Δt=0.5s → F=30,000 N
 * F = Δp / Δt  (impulse-momentum theorem)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_crumple_zone() {
  const cvs = useRef<HTMLCanvasElement>(null);
  type CarSt = { x: number; v: number; crashed: boolean; t: number; F: number; peakF: number };
  const st  = useRef<{ cars: CarSt[] }>({ cars: [
    { x: 0, v: 15, crashed: false, t: 0, F: 0, peakF: 0 },
    { x: 0, v: 15, crashed: false, t: 0, F: 0, peakF: 0 },
  ]});
  const raf = useRef(0);
  const [running, setRunning] = useState(true);
  const [tele, setTele] = useState({ f1: 0, f2: 0, dt1: "0.05 s", dt2: "0.5 s" });

  const MASS = 1000;
  const V0   = 15;
  const DP   = MASS * V0;

  useEffect(() => {
    const s = st.current;
    cancelAnimationFrame(raf.current);
    s.cars = [
      { x: 0, v: V0, crashed: false, t: 0, F: 0, peakF: 0 },
      { x: 0, v: V0, crashed: false, t: 0, F: 0, peakF: 0 },
    ];

    let fr = 0;
    function tick() {
      const canvas = cvs.current; if (!canvas) return;
      const r = setupCanvas(canvas); if (!r) return;
      const [ctx, W, H] = r;

      drawBg(ctx, W, H);

      const wallX = W * 0.7;
      const carW = 80, carH = 36;
      const row1Y = H * 0.3;
      const row2Y = H * 0.7;

      /* Physics update */
      if (running) {
        s.cars.forEach((c, i) => {
          if (!c.crashed) {
            c.x += c.v * DT * 60; /* px/frame */
            const dt_crash = i === 0 ? 0.05 : 0.5;
            if (c.x + carW >= wallX) {
              c.crashed = true; c.x = wallX - carW;
              c.t = dt_crash;
              c.peakF = DP / dt_crash;
              c.F = c.peakF;
            }
          } else {
            c.t = Math.max(0, c.t - DT);
            c.F = c.peakF * (c.t / (i === 0 ? 0.05 : 0.5));
          }
        });
      }

      /* Wall */
      ctx.fillStyle = "#1a3a5c"; ctx.fillRect(wallX, 20, 18, H - 40);
      lbl(ctx, "WALL", wallX + 9, H / 2, "#3B82F6", 10);

      /* Draw both cars */
      [[row1Y, "Rigid Car (no crumple zone)", "#EF4444"], [row2Y, "Crumple Zone Car", "#10B981"]].forEach(([ry, label, col], i) => {
        const c  = s.cars[i];
        const cx = 30 + c.x;
        const cy = (ry as number) - carH / 2;

        /* Car body */
        pill(ctx, cx, cy, carW, carH, 7, col as string);
        /* Windshield */
        ctx.fillStyle = "rgba(255,255,255,0.15)"; ctx.fillRect(cx + carW - 22, cy + 5, 16, carH - 10);
        /* Wheels */
        [cx + 12, cx + carW - 16].forEach(wx => {
          ctx.beginPath(); ctx.arc(wx, cy + carH, 8, 0, Math.PI * 2);
          ctx.fillStyle = "#1F2937"; ctx.fill();
          ctx.strokeStyle = "#6B7280"; ctx.lineWidth = 2; ctx.stroke();
        });

        /* Crumple deformation */
        if (c.crashed && i === 0) {
          ctx.fillStyle = "#7F1D1D"; ctx.fillRect(wallX - 14, cy, 14, carH);
        }

        /* Force bar */
        const maxPx = 120;
        const frac  = Math.min(1, c.F / 300000);
        const barW  = frac * maxPx;
        pill(ctx, cx + carW + 10, cy + 6, Math.max(2, barW), 10, 3, frac > 0.5 ? "#EF4444" : "#10B981");
        pill(ctx, cx + carW + 10, cy + 6, maxPx, 10, 3, "rgba(255,255,255,0.05)");
        lbl(ctx, `F = ${(c.F / 1000).toFixed(0)} kN`, cx + carW + 80, cy + 20, col as string, 11);

        lbl(ctx, label as string, cx + carW / 2, cy - 10, "#94A3B8", 10);
      });

      /* Labels */
      lbl(ctx, `Same Δp = ${(DP / 1000).toFixed(0)} kN·s`, 70, 20, "#64748B", 10);
      lbl(ctx, `Rigid: Δt=0.05s → F=300kN`, 90, H - 20, "#EF444499", 10);
      lbl(ctx, `Crumple: Δt=0.5s → F=30kN`, 90, H - 8, "#10B98199", 10);

      /* Reset after both crashed */
      if (s.cars.every(c => c.crashed && c.t <= 0)) {
        if (fr % 180 === 0) {
          s.cars = [{ x: 0, v: V0, crashed: false, t: 0, F: 0, peakF: 0 }, { x: 0, v: V0, crashed: false, t: 0, F: 0, peakF: 0 }];
        }
      }

      if (fr % 3 === 0) setTele({ f1: Math.round(s.cars[0].F / 1000), f2: Math.round(s.cars[1].F / 1000), dt1: "0.05 s", dt2: "0.5 s" });
      fr++;
      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [running]);

  return (
    <div style={WRP}>
      <div style={HDR}>
        <h3 style={H3}>🚗 Crumple Zone — F = Δp / Δt (Impulse-Momentum Theorem)</h3>
        <p style={DESC}>Both cars have the same speed and mass → same Δp = 15,000 kg·m/s. But the crumple zone extends collision time 10×, reducing the impact force 10×. Same impulse, 90% less force. <strong>F = Δp / Δt</strong></p>
      </div>
      <canvas ref={cvs} style={CVS} />
      <div style={CTRLS}>
        <button onClick={() => { const s = st.current; s.cars = [{ x: 0, v: V0, crashed: false, t: 0, F: 0, peakF: 0 }, { x: 0, v: V0, crashed: false, t: 0, F: 0, peakF: 0 }]; }} style={{ padding: "6px 14px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>↺ Reset</button>
        <span style={{ fontSize: 11, color: "#475569" }}>Δp = m × Δv = 1000 × 15 = 15,000 kg·m/s</span>
      </div>
      <div style={TELE}>
        {[["Rigid Car Force", `${tele.f1} kN`], ["Crumple Car Force", `${tele.f2} kN`], ["Rigid Δt", tele.dt1], ["Crumple Δt", tele.dt2]].map(([k, v]) => (
          <div key={k} style={TV}><span style={TK}>{k}</span><span style={{ ...TP, color: String(k).includes("Rigid") ? "#EF4444" : "#10B981" }}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 5. SPRING CATAPULT — Elastic PE to KE to Height
 * Spring compressed x → KE = ½kx² → v = √(kx²/m) → h = v²/(2g)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_spring_catapult() {
  const cvs = useRef<HTMLCanvasElement>(null);
  type St = { phase: "compress" | "launch" | "fly" | "fall"; y: number; vy: number; spring: number };
  const st  = useRef<St>({ phase: "compress", y: 0, vy: 0, spring: 0 });
  const raf = useRef(0);
  const [p, setP] = useState({ k: 8000, m: 0.5, x: 0.3 });
  const [t, setT] = useState({ v: 0, h: 0, pe: 0 });

  useEffect(() => {
    const s = st.current;
    s.phase = "compress"; s.y = 0; s.vy = 0; s.spring = 0;
    cancelAnimationFrame(raf.current);

    const v0 = Math.sqrt(p.k * p.x * p.x / p.m);
    const hMax = v0 * v0 / (2 * G);
    const pe = 0.5 * p.k * p.x * p.x;

    let fr = 0;
    function tick() {
      const canvas = cvs.current; if (!canvas) return;
      const r = setupCanvas(canvas); if (!r) return;
      const [ctx, W, H] = r;

      drawBg(ctx, W, H);

      const groundY = H - 40;
      const platformY = groundY - 20;
      const baseX = W * 0.4;

      /* Ground */
      ctx.fillStyle = "#0f2030"; ctx.fillRect(0, groundY, W, H - groundY);

      /* Spring */
      const springLen = 60 - s.spring * 80;
      const springX   = baseX;
      const springTopY = platformY - springLen;

      ctx.strokeStyle = "#F59E0B"; ctx.lineWidth = 2;
      const coils = 8;
      for (let i = 0; i < coils; i++) {
        const y0 = platformY - (i / coils) * springLen;
        const y1 = platformY - ((i + 0.5) / coils) * springLen;
        ctx.beginPath(); ctx.moveTo(springX, y0); ctx.lineTo(springX + (i % 2 === 0 ? 14 : -14), (y0 + y1) / 2); ctx.lineTo(springX, y1); ctx.stroke();
      }

      /* Ball */
      const ballY = s.phase === "compress" ? springTopY - 12 :
                    s.phase === "launch"   ? platformY - 12 - s.y :
                    platformY - 12 - s.y;

      ctx.beginPath(); ctx.arc(springX, ballY, 12, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(springX - 3, ballY - 3, 1, springX, ballY, 12);
      grad.addColorStop(0, "#60A5FA"); grad.addColorStop(1, "#1D4ED8");
      ctx.fillStyle = grad; ctx.fill();

      /* Phase state machine */
      if (s.phase === "compress") {
        s.spring = Math.min(s.spring + 0.015, p.x * 3);
        if (fr > 80) { s.phase = "launch"; s.vy = v0; s.spring = 0; }
      } else if (s.phase === "launch" || s.phase === "fly") {
        s.phase = "fly";
        s.vy -= G * DT;
        s.y += s.vy * DT * 60;
        if (s.y <= 0) { s.phase = "compress"; s.y = 0; s.vy = 0; s.spring = 0; fr = 0; }
      }

      /* Height scale */
      const hPx = hMax * (groundY - 60) / Math.max(hMax, 1);
      ctx.strokeStyle = "rgba(16,185,129,0.3)"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(springX + 20, platformY); ctx.lineTo(springX + 20, platformY - hPx); ctx.stroke();
      ctx.setLineDash([]);
      lbl(ctx, `h_max=${hMax.toFixed(1)}m`, springX + 60, platformY - hPx / 2, "#10B981", 11);

      /* Launch speed and info */
      lbl(ctx, `v₀ = √(kx²/m) = ${v0.toFixed(1)} m/s`, baseX, groundY + 16, "#60A5FA", 10);
      lbl(ctx, `PE = ½kx² = ${pe.toFixed(0)} J`, baseX - 80, groundY - 80, "#F59E0B", 10);

      if (fr % 4 === 0) setT({ v: +v0.toFixed(2), h: +hMax.toFixed(2), pe: +pe.toFixed(1) });
      fr++;
      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [p]);

  return (
    <div style={WRP}>
      <div style={HDR}>
        <h3 style={H3}>🌀 Spring Catapult — Elastic PE → KE → Height</h3>
        <p style={DESC}>Compressed spring (PE = ½kx²) releases and launches a ball. All elastic energy converts to kinetic energy at launch, then to gravitational PE at max height. <strong>v = √(kx²/m), h = v²/2g</strong></p>
      </div>
      <canvas ref={cvs} style={CVS} />
      <div style={CTRLS}>
        <div style={SLW}><span style={SLL}>Spring k (N/m)</span>
          <input style={SLD} type="range" min={2000} max={20000} step={500} value={p.k} onChange={e => setP(x => ({ ...x, k: +e.target.value }))} />
          <span style={SLV}>{p.k} N/m</span>
        </div>
        <div style={SLW}><span style={SLL}>Compression x (m)</span>
          <input style={SLD} type="range" min={0.1} max={0.6} step={0.05} value={p.x} onChange={e => setP(x => ({ ...x, x: +e.target.value }))} />
          <span style={SLV}>{p.x} m</span>
        </div>
        <div style={SLW}><span style={SLL}>Ball mass (kg)</span>
          <input style={SLD} type="range" min={0.1} max={2} step={0.1} value={p.m} onChange={e => setP(x => ({ ...x, m: +e.target.value }))} />
          <span style={SLV}>{p.m} kg</span>
        </div>
      </div>
      <div style={TELE}>
        {[["Launch speed", `${t.v} m/s`], ["Max height", `${t.h} m`], ["Spring PE", `${t.pe} J`]].map(([k, v]) => (
          <div key={k} style={TV}><span style={TK}>{k}</span><span style={TP}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 6. CENTRIPETAL MOTION → TANGENTIAL RELEASE
 * Ball on string: circular motion. Cut string → straight line (Newton's 1st Law)
 * v_c = ω × r  |  F_c = mv²/r (centripetal force)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_centripetal_cut() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const st  = useRef({ θ: 0, cut: false, bx: 0, by: 0, vx: 0, vy: 0, trail: [] as {x:number;y:number}[] });
  const raf = useRef(0);
  const [p, setP] = useState({ r: 80, ω: 2.5 }); /* radius px, angular velocity rad/s */
  const [t, setT] = useState({ v: 0, Fc: 0, phase: "Circular" });

  useEffect(() => {
    const s = st.current;
    s.θ = 0; s.cut = false; s.trail = [];
    cancelAnimationFrame(raf.current);
    let fr = 0;

    function tick() {
      const canvas = cvs.current; if (!canvas) return;
      const r = setupCanvas(canvas); if (!r) return;
      const [ctx, W, H] = r;

      drawBg(ctx, W, H);

      const cx = W / 2;
      const cy = H / 2;

      if (!s.cut) {
        /* Circular motion */
        s.θ += p.ω * DT;
        s.bx = cx + p.r * Math.cos(s.θ);
        s.by = cy + p.r * Math.sin(s.θ);
        const v = p.ω * p.r / 30; /* scale to m/s for display */
        const Fc = 0.1 * v * v / (p.r / 30);

        /* Orbit circle */
        ctx.strokeStyle = "rgba(99,102,241,0.2)"; ctx.lineWidth = 1; ctx.setLineDash([6, 6]);
        ctx.beginPath(); ctx.arc(cx, cy, p.r, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);

        /* String */
        ctx.strokeStyle = "#F59E0B"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(s.bx, s.by); ctx.stroke();

        /* Centripetal force arrow (toward center) */
        const dx = cx - s.bx, dy = cy - s.by;
        const dl = Math.sqrt(dx * dx + dy * dy);
        arw(ctx, s.bx, s.by, s.bx + dx * 0.4, s.by + dy * 0.4, "#EF4444", "Fc", 2);

        /* Velocity arrow (tangential) */
        const tx = -Math.sin(s.θ), ty = Math.cos(s.θ);
        arw(ctx, s.bx, s.by, s.bx + tx * 36, s.by + ty * 36, "#10B981", "v", 2);

        /* Auto-cut after 3 seconds */
        if (fr === 180) { s.cut = true; s.vx = -Math.sin(s.θ) * p.ω * p.r; s.vy = Math.cos(s.θ) * p.ω * p.r; }
        if (fr % 3 === 0) setT({ v: +(p.ω * p.r / 30).toFixed(2), Fc: +Fc.toFixed(2), phase: "Circular Motion" });
      } else {
        /* Straight-line motion after cut (Newton's 1st law) */
        s.bx += s.vx * DT;
        s.by += s.vy * DT;
        s.trail.push({ x: s.bx, y: s.by });
        if (s.trail.length > 80) s.trail.shift();

        /* Trail */
        ctx.strokeStyle = "#10B981"; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.7;
        ctx.beginPath(); s.trail.forEach((pt, i) => i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)); ctx.stroke();
        ctx.globalAlpha = 1;

        /* Tangential velocity arrow */
        const nv = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
        arw(ctx, s.bx, s.by, s.bx + s.vx / nv * 30, s.by + s.vy / nv * 30, "#10B981", "v", 2.5);

        /* Pivot point */
        ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fillStyle = "#475569"; ctx.fill();

        /* Reset when off screen */
        if (s.bx < -50 || s.bx > W + 50 || s.by < -50 || s.by > H + 50) {
          s.θ = 0; s.cut = false; s.trail = []; fr = 0;
        }
        if (fr % 3 === 0) setT({ v: +(p.ω * p.r / 30).toFixed(2), Fc: 0, phase: "Straight Line (Newton's 1st Law)" });
      }

      /* Pivot */
      ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fillStyle = "#475569"; ctx.fill();

      /* Ball */
      ctx.beginPath(); ctx.arc(s.bx, s.by, 10, 0, Math.PI * 2);
      ctx.fillStyle = s.cut ? "#10B981" : "#6366F1"; ctx.fill();

      /* Cut label */
      if (s.cut) lbl(ctx, "String cut → Ball travels in STRAIGHT LINE", W / 2, 20, "#10B981", 12);
      else lbl(ctx, "String provides centripetal force → Circular path", W / 2, 20, "#6366F1", 12);

      fr++;
      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [p]);

  return (
    <div style={WRP}>
      <div style={HDR}>
        <h3 style={H3}>⭕ Centripetal Force → Tangential Release (Newton's 1st Law)</h3>
        <p style={DESC}>String pulls ball toward center (centripetal force). When string cuts, no force acts → ball continues in a straight line tangent to the circle. This demonstrates Newton's First Law. <strong>F_c = mv²/r</strong></p>
      </div>
      <canvas ref={cvs} style={CVS} />
      <div style={CTRLS}>
        <div style={SLW}><span style={SLL}>Orbit radius</span>
          <input style={SLD} type="range" min={40} max={120} step={10} value={p.r} onChange={e => { st.current.θ = 0; st.current.cut = false; st.current.trail = []; setP(x => ({ ...x, r: +e.target.value })); }} />
          <span style={SLV}>{p.r} px</span>
        </div>
        <div style={SLW}><span style={SLL}>Angular speed ω</span>
          <input style={SLD} type="range" min={1} max={5} step={0.5} value={p.ω} onChange={e => { st.current.θ = 0; st.current.cut = false; st.current.trail = []; setP(x => ({ ...x, ω: +e.target.value })); }} />
          <span style={SLV}>{p.ω} rad/s</span>
        </div>
      </div>
      <div style={TELE}>
        {[["Phase", t.phase], ["Speed", `${t.v} m/s`], ["Centripetal F", t.Fc > 0 ? `${t.Fc} N` : "0 (cut!)"]].map(([k, v]) => (
          <div key={k} style={TV}><span style={TK}>{k}</span><span style={{ ...TP, fontSize: 12 }}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 7. REACTION TIME BRAKING — Total Stopping Distance
 * d_think = v × t_reaction  |  d_brake = v² / (2μg)
 * d_total = d_think + d_brake
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_reaction_braking() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const st  = useRef({ x: 0, v: 0, phase: "approach", reactionLeft: 0 });
  const raf = useRef(0);
  const [p, setP] = useState({ speed: 20, reaction: 0.75, mu: 0.5 });
  const [t, setT] = useState({ dThink: 0, dBrake: 0, dTotal: 0 });

  useEffect(() => {
    const s = st.current;
    s.x = 0; s.v = p.speed; s.phase = "approach"; s.reactionLeft = p.reaction;
    cancelAnimationFrame(raf.current);

    const dThink = p.speed * p.reaction;
    const dBrake = (p.speed * p.speed) / (2 * p.mu * G);
    const dTotal = dThink + dBrake;
    setT({ dThink: +dThink.toFixed(1), dBrake: +dBrake.toFixed(1), dTotal: +dTotal.toFixed(1) });

    let fr = 0;
    function tick() {
      const canvas = cvs.current; if (!canvas) return;
      const r = setupCanvas(canvas); if (!r) return;
      const [ctx, W, H] = r;

      drawBg(ctx, W, H);

      const scale = (W - 80) / Math.max(dTotal, 10); /* px per metre */
      const roadY = H * 0.55;

      /* Road */
      ctx.fillStyle = "#1a2535"; ctx.fillRect(20, roadY - 25, W - 40, 50);
      ctx.fillStyle = "#243044"; ctx.fillRect(20, roadY - 2, W - 40, 4);

      /* Hazard (wall) */
      const wallX = 40 + dTotal * scale;
      ctx.fillStyle = "#EF4444"; ctx.fillRect(wallX - 4, roadY - 36, 8, 72);
      lbl(ctx, "STOP", wallX, roadY + 44, "#EF4444", 11);

      /* Thinking zone */
      ctx.fillStyle = "rgba(245,158,11,0.1)";
      ctx.fillRect(40, roadY - 30, dThink * scale, 60);
      pill(ctx, 40, roadY - 50, Math.max(20, dThink * scale), 18, 5, "rgba(245,158,11,0.2)");
      lbl(ctx, `Think: ${dThink.toFixed(1)}m`, 40 + dThink * scale / 2, roadY - 38, "#F59E0B", 10);

      /* Braking zone */
      ctx.fillStyle = "rgba(16,185,129,0.08)";
      ctx.fillRect(40 + dThink * scale, roadY - 30, dBrake * scale, 60);
      pill(ctx, 40 + dThink * scale, roadY - 50, Math.max(20, dBrake * scale), 18, 5, "rgba(16,185,129,0.2)");
      lbl(ctx, `Brake: ${dBrake.toFixed(1)}m`, 40 + dThink * scale + dBrake * scale / 2, roadY - 38, "#10B981", 10);

      /* Phase update */
      if (s.phase === "approach") {
        s.x += s.v * DT * scale;
        if (s.x >= dThink * scale) { s.phase = "braking"; }
      } else if (s.phase === "braking") {
        const a = p.mu * G;
        s.v = Math.max(0, s.v - a * DT);
        s.x += s.v * DT * scale;
        if (s.v <= 0 || s.x >= dTotal * scale) {
          s.phase = "stopped";
        }
      } else if (s.phase === "stopped") {
        if (fr % 120 === 0) { s.x = 0; s.v = p.speed; s.phase = "approach"; }
      }

      /* Car */
      const carX = Math.min(40 + s.x, wallX - 60);
      pill(ctx, carX, roadY - 20, 52, 22, 6, s.phase === "approach" ? "#3B82F6" : s.phase === "braking" ? "#F59E0B" : "#10B981");
      lbl(ctx, `${s.v.toFixed(1)} m/s`, carX + 26, roadY + 20, "#94A3B8", 10);

      /* Phase label */
      lbl(ctx, s.phase === "approach" ? "Driver still reacting (not braking yet!)" : s.phase === "braking" ? "Braking: friction decelerates car" : "Stopped safely ✓", W / 2, 24, "#94A3B8", 11);

      fr++;
      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [p]);

  return (
    <div style={WRP}>
      <div style={HDR}>
        <h3 style={H3}>🛑 Reaction Time Braking — Total Stopping Distance</h3>
        <p style={DESC}>Before brakes engage, the car covers <em>thinking distance</em> (v × t_reaction). Then friction decelerates the car over <em>braking distance</em>. Both zones are dangerous at high speed. <strong>d_total = v×t_reaction + v²/(2μg)</strong></p>
      </div>
      <canvas ref={cvs} style={CVS} />
      <div style={CTRLS}>
        <div style={SLW}><span style={SLL}>Speed (m/s)</span>
          <input style={SLD} type="range" min={5} max={40} step={1} value={p.speed} onChange={e => setP(x => ({ ...x, speed: +e.target.value }))} />
          <span style={SLV}>{p.speed} m/s</span>
        </div>
        <div style={SLW}><span style={SLL}>Reaction time</span>
          <input style={SLD} type="range" min={0.2} max={2} step={0.05} value={p.reaction} onChange={e => setP(x => ({ ...x, reaction: +e.target.value }))} />
          <span style={SLV}>{p.reaction} s</span>
        </div>
        <div style={SLW}><span style={SLL}>Friction μ</span>
          <input style={SLD} type="range" min={0.2} max={0.9} step={0.05} value={p.mu} onChange={e => setP(x => ({ ...x, mu: +e.target.value }))} />
          <span style={SLV}>{p.mu}</span>
        </div>
      </div>
      <div style={TELE}>
        {[["Thinking dist.", `${t.dThink} m`], ["Braking dist.", `${t.dBrake} m`], ["Total stop dist.", `${t.dTotal} m`]].map(([k, v]) => (
          <div key={k} style={TV}><span style={TK}>{k}</span><span style={TP}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 8. PENDULUM ENERGY TRANSFER — KE ↔ PE
 * θ(t) = θ_max · cos(ωt)  |  ω = √(g/L)
 * KE = ½mv²  |  PE = mgh = mgL(1 - cosθ)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_pendulum_energy() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [p, setP] = useState({ L: 1.5, θmax: 30, m: 1.0 });
  const [t, setT] = useState({ ke: 0, pe: 0, total: 0 });

  useEffect(() => {
    cancelAnimationFrame(raf.current);
    let simT = 0;

    function tick() {
      const canvas = cvs.current; if (!canvas) return;
      const r = setupCanvas(canvas); if (!r) return;
      const [ctx, W, H] = r;

      drawBg(ctx, W, H);

      const pivotX = W * 0.4;
      const pivotY = 50;
      const pxPerM = Math.min(140, (H - 80) / p.L);
      const rodLen = p.L * pxPerM;

      /* Physics */
      const ω = Math.sqrt(G / p.L);
      simT += DT;
      const θ = (p.θmax * Math.PI / 180) * Math.cos(ω * simT);
      const bx = pivotX + rodLen * Math.sin(θ);
      const by = pivotY + rodLen * Math.cos(θ);

      const v  = p.L * ω * Math.abs(Math.sin(ω * simT)) * (p.θmax * Math.PI / 180);
      const h  = p.L * (1 - Math.cos(θ));
      const ke = 0.5 * p.m * v * v;
      const pe = p.m * G * h;
      const E  = 0.5 * p.m * p.L * p.L * ω * ω * (p.θmax * Math.PI / 180) ** 2;

      /* Rod */
      ctx.strokeStyle = "#94A3B8"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(pivotX, pivotY); ctx.lineTo(bx, by); ctx.stroke();

      /* Pivot */
      ctx.beginPath(); ctx.arc(pivotX, pivotY, 6, 0, Math.PI * 2); ctx.fillStyle = "#475569"; ctx.fill();

      /* Bob */
      ctx.beginPath(); ctx.arc(bx, by, 14, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(bx - 3, by - 3, 1, bx, by, 14);
      grad.addColorStop(0, "#F59E0B"); grad.addColorStop(1, "#D97706");
      ctx.fillStyle = grad; ctx.fill();

      /* Reference line */
      ctx.strokeStyle = "rgba(255,255,255,0.08)"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(pivotX, pivotY); ctx.lineTo(pivotX, pivotY + rodLen); ctx.stroke();
      ctx.setLineDash([]);

      /* Energy bars (right side) */
      const barX = W * 0.72;
      const barMaxH = H - 80;
      const keH = E > 0 ? (ke / E) * barMaxH : 0;
      const peH = E > 0 ? (pe / E) * barMaxH : 0;

      lbl(ctx, "Energy", barX + 50, 30, "#64748B", 11);

      /* KE bar */
      pill(ctx, barX, H - 40 - keH, 40, keH, 4, "#3B82F6");
      pill(ctx, barX, H - 40 - barMaxH, 40, barMaxH, 4, "rgba(59,130,246,0.1)");
      lbl(ctx, "KE", barX + 20, H - 18, "#60A5FA", 10);
      lbl(ctx, `${ke.toFixed(2)}J`, barX + 20, H - 40 - keH - 6, "#60A5FA", 10);

      /* PE bar */
      pill(ctx, barX + 52, H - 40 - peH, 40, peH, 4, "#F59E0B");
      pill(ctx, barX + 52, H - 40 - barMaxH, 40, barMaxH, 4, "rgba(245,158,11,0.1)");
      lbl(ctx, "PE", barX + 72, H - 18, "#F59E0B", 10);
      lbl(ctx, `${pe.toFixed(2)}J`, barX + 72, H - 40 - peH - 6, "#F59E0B", 10);

      /* Total E line */
      ctx.strokeStyle = "#10B98155"; ctx.lineWidth = 1; ctx.setLineDash([6, 4]);
      ctx.beginPath(); ctx.moveTo(barX - 8, H - 40 - barMaxH); ctx.lineTo(barX + 100, H - 40 - barMaxH); ctx.stroke();
      ctx.setLineDash([]);
      lbl(ctx, `E_total=${E.toFixed(2)}J`, barX + 44, H - 40 - barMaxH - 10, "#10B981", 10);

      if (simT % 0.1 < DT) setT({ ke: +ke.toFixed(3), pe: +pe.toFixed(3), total: +E.toFixed(3) });
      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [p]);

  return (
    <div style={WRP}>
      <div style={HDR}>
        <h3 style={H3}>🕰️ Pendulum Energy Exchange — KE ↔ PE</h3>
        <p style={DESC}>At the bottom: all energy is kinetic. At the extremes: all energy is potential. The total mechanical energy stays constant (no friction). Watch the bars transfer in real time. <strong>KE + PE = constant</strong></p>
      </div>
      <canvas ref={cvs} style={CVS} />
      <div style={CTRLS}>
        <div style={SLW}><span style={SLL}>Length L (m)</span>
          <input style={SLD} type="range" min={0.5} max={3} step={0.1} value={p.L} onChange={e => setP(x => ({ ...x, L: +e.target.value }))} />
          <span style={SLV}>{p.L} m</span>
        </div>
        <div style={SLW}><span style={SLL}>Amplitude θ (°)</span>
          <input style={SLD} type="range" min={5} max={60} step={5} value={p.θmax} onChange={e => setP(x => ({ ...x, θmax: +e.target.value }))} />
          <span style={SLV}>{p.θmax}°</span>
        </div>
        <div style={SLW}><span style={SLL}>Mass m (kg)</span>
          <input style={SLD} type="range" min={0.2} max={3} step={0.1} value={p.m} onChange={e => setP(x => ({ ...x, m: +e.target.value }))} />
          <span style={SLV}>{p.m} kg</span>
        </div>
      </div>
      <div style={TELE}>
        {[["Kinetic Energy", `${t.ke} J`], ["Potential Energy", `${t.pe} J`], ["Total Energy", `${t.total} J`]].map(([k, v]) => (
          <div key={k} style={TV}><span style={TK}>{k}</span><span style={TP}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 9. FEATHER & COIN DROP — Air vs Vacuum
 * In air: F_drag = ½ρCdAv². Light objects reach low terminal velocity fast.
 * In vacuum: F_drag = 0. ALL objects fall identically: a = g = 9.8 m/s²
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_feather_vacuum() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const st  = useRef({
    air:    { coin: { y: 0, v: 0 }, feather: { y: 0, v: 0 } },
    vacuum: { coin: { y: 0, v: 0 }, feather: { y: 0, v: 0 } },
    done: false,
  });
  const raf = useRef(0);
  const [running, setRunning] = useState(true);
  const [t, setT] = useState({ coinAir: "–", featherAir: "–", coinVac: "–", featherVac: "–" });

  useEffect(() => {
    const s = st.current;
    s.air = { coin: { y: 0, v: 0 }, feather: { y: 0, v: 0 } };
    s.vacuum = { coin: { y: 0, v: 0 }, feather: { y: 0, v: 0 } };
    s.done = false;
    cancelAnimationFrame(raf.current);
    let fr = 0;

    /* Object parameters */
    const COIN    = { m: 0.01, Cd: 0.47, A: 0.00028 }; /* 10g coin, flat disc */
    const FEATHER = { m: 0.0005, Cd: 1.3,  A: 0.001 };  /* 0.5g feather */
    const RHO     = 1.225; /* air density kg/m³ */
    const H_M     = 80;   /* drop height metres */
    const arrivals = { coinAir: 0, featherAir: 0, coinVac: 0, featherVac: 0 };
    let t_total = 0;

    function tick() {
      const canvas = cvs.current; if (!canvas) return;
      const r = setupCanvas(canvas); if (!r) return;
      const [ctx, W, H] = r;

      drawBg(ctx, W, H);

      const groundY = H - 40;
      const startY  = 40;
      const PX      = (groundY - startY) / H_M;

      if (running) t_total += DT;

      /* Physics: F_drag = ½ρCdAv²; a = g - F_drag/m (downward positive) */
      const update = (obj: { y: number; v: number }, params: typeof COIN, withAir: boolean) => {
        if (obj.y >= groundY - startY) return;
        const drag = withAir ? (0.5 * RHO * params.Cd * params.A * obj.v * obj.v) / params.m : 0;
        const a    = G - drag;
        obj.v += a * DT;
        obj.y += obj.v * DT * PX;
        if (obj.y >= groundY - startY) obj.y = groundY - startY;
      };

      update(s.air.coin,    COIN,    true);
      update(s.air.feather, FEATHER, true);
      update(s.vacuum.coin,    COIN,    false);
      update(s.vacuum.feather, FEATHER, false);

      /* Track arrivals */
      if (!arrivals.coinAir    && s.air.coin.y    >= groundY - startY - 2) arrivals.coinAir    = t_total;
      if (!arrivals.featherAir && s.air.feather.y >= groundY - startY - 2) arrivals.featherAir = t_total;
      if (!arrivals.coinVac    && s.vacuum.coin.y >= groundY - startY - 2) arrivals.coinVac    = t_total;
      if (!arrivals.featherVac && s.vacuum.feather.y >= groundY - startY - 2) arrivals.featherVac = t_total;

      /* Layout: 2 halves — left=air, right=vacuum */
      const cx1 = W * 0.27; /* air column center */
      const cx2 = W * 0.73; /* vacuum column center */

      /* Headers */
      pill(ctx, 20, 12, W / 2 - 30, 22, 6, "#1a2535");
      lbl(ctx, "IN AIR (with drag)", W * 0.27, 27, "#64748B", 11);
      pill(ctx, W / 2 + 10, 12, W / 2 - 30, 22, 6, "#0a1a2a");
      lbl(ctx, "IN VACUUM (no drag)", W * 0.73, 27, "#64748B", 11);

      /* Separator */
      ctx.strokeStyle = "#1e2d3d"; ctx.lineWidth = 1; ctx.setLineDash([6, 6]);
      ctx.beginPath(); ctx.moveTo(W / 2, 40); ctx.lineTo(W / 2, H - 20); ctx.stroke();
      ctx.setLineDash([]);

      /* Ground */
      ctx.fillStyle = "#0f2030";
      ctx.fillRect(10, groundY, W / 2 - 20, H - groundY);
      ctx.fillRect(W / 2 + 10, groundY, W / 2 - 20, H - groundY);

      /* Draw objects */
      const draw = (x: number, y: number, label: string, col: string, isFeather: boolean) => {
        const py = startY + y;
        if (isFeather) {
          /* Feather shape */
          ctx.strokeStyle = col; ctx.lineWidth = 1.5;
          for (let i = -3; i <= 3; i++) {
            ctx.beginPath(); ctx.moveTo(x, py); ctx.lineTo(x + i * 4, py + 12); ctx.stroke();
          }
          ctx.beginPath(); ctx.moveTo(x, py - 8); ctx.lineTo(x, py + 12); ctx.strokeStyle = col; ctx.stroke();
        } else {
          ctx.beginPath(); ctx.arc(x, py, 8, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill();
        }
        lbl(ctx, label, x, py - 14, col, 10);
      };

      draw(cx1 - 20, s.air.coin.y,    "Coin",    "#F59E0B", false);
      draw(cx1 + 20, s.air.feather.y, "Feather", "#94A3B8", true);
      draw(cx2 - 20, s.vacuum.coin.y, "Coin",    "#F59E0B", false);
      draw(cx2 + 20, s.vacuum.feather.y, "Feather", "#34D399", true);

      /* Result badges */
      if (arrivals.coinVac && arrivals.featherVac && Math.abs(arrivals.coinVac - arrivals.featherVac) < 0.05) {
        pill(ctx, cx2 - 60, groundY - 28, 120, 20, 6, "rgba(16,185,129,0.3)");
        lbl(ctx, "⟵ Same time! ⟶", cx2, groundY - 14, "#10B981", 11);
      }

      if (arrivals.featherAir) {
        lbl(ctx, `Feather: ${arrivals.featherAir.toFixed(1)}s`, cx1 + 20, groundY - 14, "#94A3B8", 10);
      }
      if (arrivals.coinAir) {
        lbl(ctx, `Coin: ${arrivals.coinAir.toFixed(1)}s`, cx1 - 20, groundY - 24, "#F59E0B", 10);
      }

      /* Auto-reset */
      if (arrivals.featherAir && fr % 200 === 199) {
        Object.assign(s, { air: { coin: { y: 0, v: 0 }, feather: { y: 0, v: 0 } }, vacuum: { coin: { y: 0, v: 0 }, feather: { y: 0, v: 0 } } });
        Object.assign(arrivals, { coinAir: 0, featherAir: 0, coinVac: 0, featherVac: 0 });
        t_total = 0;
      }

      fr++;
      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [running]);

  return (
    <div style={WRP}>
      <div style={HDR}>
        <h3 style={H3}>🪶 Feather & Coin Drop — Air Resistance vs Vacuum</h3>
        <p style={DESC}>In air, drag slows the feather much more than the coin (same gravity, very different drag force due to low mass). In a vacuum, <strong>both fall identically</strong>. This is how Galileo proved all objects fall at the same rate.</p>
      </div>
      <canvas ref={cvs} style={CVS} />
      <div style={CTRLS}>
        <span style={{ fontSize: 11, color: "#475569" }}>Drop height: 80 m | Air density: 1.225 kg/m³ | Coin mass: 10 g | Feather mass: 0.5 g</span>
      </div>
      <div style={TELE}>
        {[["Coin (air)", "Faster"], ["Feather (air)", "Slower"], ["Both (vacuum)", "Same time!"]].map(([k, v]) => (
          <div key={k} style={TV}><span style={TK}>{k}</span><span style={{ ...TP, color: v === "Same time!" ? "#10B981" : "#60A5FA" }}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 10. FLUID DRAG — SHAPE MATTERS
 * Terminal velocity: v_t = √(2mg / ρCdA)
 * Sphere: Cd=0.47 | Cube: Cd=1.05 | Flat disc: Cd=1.28
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_fluid_drag_shapes() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const st  = useRef({ objs: [
    { y: 0, v: 0 },  /* sphere */
    { y: 0, v: 0 },  /* cube */
    { y: 0, v: 0 },  /* disc */
  ]});
  const raf = useRef(0);
  const [p, setP] = useState({ m: 0.1, fluid: "water" });
  const [t, setT] = useState({ vt: ["–", "–", "–"] });

  const SHAPES = [
    { name: "Sphere", Cd: 0.47, A: 0.01, col: "#60A5FA" },
    { name: "Cube",   Cd: 1.05, A: 0.01, col: "#F59E0B" },
    { name: "Disc",   Cd: 1.28, A: 0.015, col: "#EF4444" },
  ];
  const RHO = { water: 1000, air: 1.225, oil: 870 };

  useEffect(() => {
    const s = st.current;
    s.objs = [{ y: 0, v: 0 }, { y: 0, v: 0 }, { y: 0, v: 0 }];
    cancelAnimationFrame(raf.current);
    let fr = 0;

    const rho = RHO[p.fluid as keyof typeof RHO];
    const vtArr = SHAPES.map(sh => +Math.sqrt(2 * p.m * G / (rho * sh.Cd * sh.A)).toFixed(2));

    function tick() {
      const canvas = cvs.current; if (!canvas) return;
      const r = setupCanvas(canvas); if (!r) return;
      const [ctx, W, H] = r;

      drawBg(ctx, W, H);

      const groundY = H - 40;
      const startY  = 50;
      const PX      = (groundY - startY) / 60; /* 60 px per m in visual */

      SHAPES.forEach((sh, i) => {
        const obj = s.objs[i];
        if (obj.y < groundY - startY) {
          const drag = 0.5 * rho * sh.Cd * sh.A * obj.v * obj.v;
          const a    = G - drag / p.m;
          obj.v += Math.max(0, a) * DT;
          obj.y += obj.v * DT * PX;
          if (obj.y >= groundY - startY) obj.y = groundY - startY;
        }

        const cx = (W / 3) * i + W / 6;
        const cy = startY + obj.y;

        /* Fluid fill */
        ctx.fillStyle = p.fluid === "water" ? "rgba(30,80,160,0.18)" : p.fluid === "oil" ? "rgba(100,60,10,0.18)" : "rgba(150,150,200,0.06)";
        ctx.fillRect((W / 3) * i, startY, W / 3, groundY - startY);

        /* Shape */
        ctx.fillStyle = sh.col;
        if (i === 0) { ctx.beginPath(); ctx.arc(cx, cy, 12, 0, Math.PI * 2); ctx.fill(); }
        else if (i === 1) { ctx.fillRect(cx - 10, cy - 10, 20, 20); }
        else { ctx.beginPath(); ctx.ellipse(cx, cy, 15, 5, 0, 0, Math.PI * 2); ctx.fill(); }

        /* Labels */
        lbl(ctx, sh.name, cx, groundY + 14, sh.col, 11);
        lbl(ctx, `Cd=${sh.Cd}`, cx, groundY + 26, "#475569", 10);
        lbl(ctx, `v_t≈${vtArr[i]} m/s`, cx, groundY - 8, sh.col, 10);
        lbl(ctx, `v=${Math.min(obj.v, vtArr[i]).toFixed(1)}`, cx, cy - 20, sh.col, 10);

        /* Column separators */
        if (i < 2) { ctx.strokeStyle = "#0f1e30"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo((W / 3) * (i + 1), startY - 10); ctx.lineTo((W / 3) * (i + 1), groundY); ctx.stroke(); }
      });

      /* Ground */
      ctx.fillStyle = "#0f2030"; ctx.fillRect(0, groundY, W, H - groundY);
      lbl(ctx, `Fluid: ${p.fluid} | mass: ${p.m} kg`, W / 2, groundY + 32, "#475569", 10);

      /* Auto-reset */
      if (s.objs.every(o => o.y >= (groundY - startY))) {
        if (fr % 100 === 0) s.objs = [{ y: 0, v: 0 }, { y: 0, v: 0 }, { y: 0, v: 0 }];
      }

      if (fr % 5 === 0) setT({ vt: vtArr.map(v => `${v} m/s`) });
      fr++;
      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [p]);

  return (
    <div style={WRP}>
      <div style={HDR}>
        <h3 style={H3}>🔵 Fluid Drag — Shape Determines Terminal Velocity</h3>
        <p style={DESC}>Same mass, same fluid, different shapes. Aerodynamic shapes have lower drag coefficient Cd → higher terminal velocity. Flat disc catches the most fluid → lowest terminal speed. <strong>v_t = √(2mg / ρCdA)</strong></p>
      </div>
      <canvas ref={cvs} style={CVS} />
      <div style={CTRLS}>
        <div style={SLW}><span style={SLL}>Mass (kg)</span>
          <input style={SLD} type="range" min={0.05} max={0.5} step={0.05} value={p.m} onChange={e => setP(x => ({ ...x, m: +e.target.value }))} />
          <span style={SLV}>{p.m} kg</span>
        </div>
        <div style={SLW}><span style={SLL}>Fluid</span>
          {["air", "water", "oil"].map(f => (
            <button key={f} onClick={() => setP(x => ({ ...x, fluid: f }))} style={{ padding: "4px 10px", background: p.fluid === f ? "#2563EB" : "#1e2d3d", color: "#fff", border: "1px solid #2d3f55", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>{f}</button>
          ))}
        </div>
      </div>
      <div style={TELE}>
        {SHAPES.map((sh, i) => (
          <div key={sh.name} style={TV}><span style={TK}>{sh.name} v_t</span><span style={{ ...TP, color: sh.col }}>{t.vt[i]}</span></div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 11. ELASTIC vs INELASTIC COLLISION LAB
 * e=1: elastic → KE conserved  |  e=0: perfectly inelastic → max KE loss
 * v1' = ((m1-e·m2)·v1 + (1+e)·m2·v2) / (m1+m2)
 * v2' = ((m2-e·m1)·v2 + (1+e)·m1·v1) / (m1+m2)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_collision_lab_pro() {
  const cvs = useRef<HTMLCanvasElement>(null);
  type St = { x1: number; x2: number; v1: number; v2: number; collided: boolean };
  const st  = useRef<St>({ x1: 0, x2: 0, v1: 0, v2: 0, collided: false });
  const raf = useRef(0);
  const [p, setP] = useState({ m1: 2, m2: 2, v1: 4, e: 1 });
  const [t, setT] = useState({ pBefore: 0, pAfter: 0, keBefore: 0, keAfter: 0 });

  useEffect(() => {
    const s = st.current;
    cancelAnimationFrame(raf.current);
    let fr = 0;

    const reset = () => {
      s.x1 = 0; s.x2 = 200; s.v1 = p.v1 * 2; s.v2 = 0; s.collided = false;
    };
    reset();

    function tick() {
      const canvas = cvs.current; if (!canvas) return;
      const r = setupCanvas(canvas); if (!r) return;
      const [ctx, W, H] = r;

      drawBg(ctx, W, H);

      const centerY = H / 2;
      const r1 = 20, r2 = p.m2 / p.m1 * 20;

      /* Physics */
      if (!s.collided) {
        s.x1 += s.v1 * DT * 30;
        s.x2 += s.v2 * DT * 30;
        if (s.x1 + r1 >= s.x2 - r2) {
          /* Collision */
          const e = p.e;
          const m1 = p.m1, m2 = p.m2;
          const u1 = p.v1, u2 = 0;
          const v1n = ((m1 - e * m2) * u1 + (1 + e) * m2 * u2) / (m1 + m2);
          const v2n = ((m2 - e * m1) * u2 + (1 + e) * m1 * u1) / (m1 + m2);
          s.v1 = v1n * 2; s.v2 = v2n * 2;
          s.collided = true;
          const pB = m1 * u1, pA = m1 * v1n + m2 * v2n;
          const kB = 0.5 * m1 * u1 * u1, kA = 0.5 * m1 * v1n * v1n + 0.5 * m2 * v2n * v2n;
          setT({ pBefore: +pB.toFixed(2), pAfter: +pA.toFixed(2), keBefore: +kB.toFixed(2), keAfter: +kA.toFixed(2) });
        }
      } else {
        s.x1 += s.v1 * DT * 30;
        s.x2 += s.v2 * DT * 30;
      }

      /* Ground */
      ctx.fillStyle = "#0f2030"; ctx.fillRect(0, centerY + 24, W, 2);

      /* Ball 1 */
      const bx1 = 60 + s.x1;
      ctx.beginPath(); ctx.arc(bx1, centerY, r1, 0, Math.PI * 2);
      ctx.fillStyle = "#3B82F6"; ctx.fill();
      lbl(ctx, `m₁=${p.m1}kg`, bx1, centerY - r1 - 8, "#60A5FA", 10);
      if (s.v1 !== 0) arw(ctx, bx1, centerY, bx1 + s.v1 * 6, centerY, "#60A5FA", `v=${(s.v1/2).toFixed(1)}`);

      /* Ball 2 */
      const bx2 = 60 + s.x2;
      ctx.beginPath(); ctx.arc(bx2, centerY, r2, 0, Math.PI * 2);
      ctx.fillStyle = "#F59E0B"; ctx.fill();
      lbl(ctx, `m₂=${p.m2}kg`, bx2, centerY - r2 - 8, "#F59E0B", 10);
      if (s.v2 !== 0) arw(ctx, bx2, centerY, bx2 + s.v2 * 6, centerY, "#F59E0B", `v=${(s.v2/2).toFixed(1)}`);

      /* Elasticity label */
      const eLabel = p.e >= 0.99 ? "Perfectly Elastic (KE conserved)" : p.e <= 0.01 ? "Perfectly Inelastic (stick together)" : `Partially Elastic (e=${p.e})`;
      lbl(ctx, eLabel, W / 2, 20, "#94A3B8", 11);

      /* Auto-reset */
      if ((bx1 > W + 30 || bx1 < -30 || bx2 > W + 30) && s.collided) {
        if (fr % 60 === 0) reset();
      }

      fr++;
      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [p]);

  return (
    <div style={WRP}>
      <div style={HDR}>
        <h3 style={H3}>⚽ Collision Lab — Elastic vs Inelastic (e = 0 to 1)</h3>
        <p style={DESC}>The coefficient of restitution e measures how elastic a collision is. e=1: kinetic energy fully conserved (billiard balls). e=0: objects stick (clay). Momentum is ALWAYS conserved. <strong>p_before = p_after always</strong></p>
      </div>
      <canvas ref={cvs} style={CVS} />
      <div style={CTRLS}>
        <div style={SLW}><span style={SLL}>Elasticity e</span>
          <input style={SLD} type="range" min={0} max={1} step={0.05} value={p.e} onChange={e => setP(x => ({ ...x, e: +e.target.value }))} />
          <span style={SLV}>{p.e.toFixed(2)}</span>
        </div>
        <div style={SLW}><span style={SLL}>m₁ (kg)</span>
          <input style={SLD} type="range" min={1} max={5} step={0.5} value={p.m1} onChange={e => setP(x => ({ ...x, m1: +e.target.value }))} />
          <span style={SLV}>{p.m1}</span>
        </div>
        <div style={SLW}><span style={SLL}>m₂ (kg)</span>
          <input style={SLD} type="range" min={1} max={5} step={0.5} value={p.m2} onChange={e => setP(x => ({ ...x, m2: +e.target.value }))} />
          <span style={SLV}>{p.m2}</span>
        </div>
      </div>
      <div style={TELE}>
        {[["p before", `${t.pBefore} kg·m/s`], ["p after", `${t.pAfter} kg·m/s`], ["KE before", `${t.keBefore} J`], ["KE after", `${t.keAfter} J`]].map(([k, v]) => (
          <div key={k} style={TV}><span style={TK}>{k}</span><span style={TP}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 12. FIREWORK EXPLOSION — MOMENTUM CONSERVATION
 * Before: firework at rest → p_total = 0
 * After: 4 pieces fly out. Sum of all momenta must still = 0
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_firework_momentum() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const st  = useRef({
    phase: "rising" as "rising" | "exploded",
    y: 0, vy: 0,
    pieces: [] as { x: number; y: number; vx: number; vy: number; col: string; trail: {x:number;y:number}[] }[]
  });
  const raf = useRef(0);
  const [t, setT] = useState({ px: "0.00", py: "0.00", ptotal: "0.00" });

  useEffect(() => {
    const s = st.current;
    cancelAnimationFrame(raf.current);
    let fr = 0;

    const COLORS = ["#EF4444", "#3B82F6", "#F59E0B", "#10B981"];
    const MASSES = [1, 2, 3, 4]; /* kg — total = 10 kg */
    const TOTAL_M = MASSES.reduce((a, b) => a + b, 0);

    const reset = () => {
      s.phase = "rising"; s.y = 0; s.vy = -8; s.pieces = [];
    };
    reset();

    function tick() {
      const canvas = cvs.current; if (!canvas) return;
      const r = setupCanvas(canvas); if (!r) return;
      const [ctx, W, H] = r;

      drawBg(ctx, W, H);

      const cx = W / 2;
      const launchY = H - 40;

      if (s.phase === "rising") {
        s.vy += G * DT * 3;
        s.y += s.vy * DT * 40;
        const fy = launchY + s.y;

        /* Rocket body */
        ctx.save(); ctx.translate(cx, fy);
        pill(ctx, -6, -16, 12, 22, 4, "#F59E0B");
        ctx.beginPath(); ctx.moveTo(-5, -16); ctx.lineTo(5, -16); ctx.lineTo(0, -26); ctx.closePath(); ctx.fillStyle = "#EF4444"; ctx.fill();
        /* Flame */
        ctx.beginPath(); ctx.moveTo(-4, 6); ctx.lineTo(4, 6); ctx.lineTo(0, 18 + Math.sin(fr * 0.4) * 4); ctx.closePath(); ctx.fillStyle = "#F97316"; ctx.fill();
        ctx.restore();

        /* Trigger explosion */
        if (fy < H * 0.3) {
          s.phase = "exploded";
          /* Distribute 4 pieces with momenta summing to zero */
          /* m1v1x + m2v2x + m3v3x + m4v4x = 0 (conservation in x and y) */
          const angles = [30, 120, 210, 300]; /* degrees */
          const speed = 60;
          s.pieces = MASSES.map((m, i) => {
            const θ = angles[i] * Math.PI / 180;
            return {
              x: cx, y: fy,
              vx: (speed * TOTAL_M / m) * Math.cos(θ) * 0.25,
              vy: (speed * TOTAL_M / m) * Math.sin(θ) * 0.25,
              col: COLORS[i],
              trail: [],
            };
          });
        }
      } else {
        let px = 0, py = 0;
        s.pieces.forEach((pc, i) => {
          pc.vy += G * DT * 2;
          pc.x += pc.vx * DT * 20;
          pc.y += pc.vy * DT * 20;
          pc.trail.push({ x: pc.x, y: pc.y });
          if (pc.trail.length > 40) pc.trail.shift();

          /* Trail */
          ctx.strokeStyle = pc.col + "77"; ctx.lineWidth = 1.5;
          ctx.beginPath(); pc.trail.forEach((pt, j) => j === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)); ctx.stroke();

          /* Piece */
          const radius = Math.max(4, MASSES[i] * 3);
          ctx.beginPath(); ctx.arc(pc.x, pc.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = pc.col; ctx.fill();
          lbl(ctx, `m=${MASSES[i]}kg`, pc.x, pc.y - radius - 6, pc.col, 9);

          /* Stars */
          if (fr % 3 === 0) {
            for (let s = 0; s < 2; s++) {
              ctx.beginPath();
              ctx.arc(pc.x + (Math.random() - 0.5) * 30, pc.y + (Math.random() - 0.5) * 30, 1.5, 0, Math.PI * 2);
              ctx.fillStyle = pc.col + "88"; ctx.fill();
            }
          }

          px += MASSES[i] * pc.vx / 20;
          py += MASSES[i] * pc.vy / 20;
        });

        const ptot = Math.sqrt(px * px + py * py);
        if (fr % 4 === 0) setT({ px: px.toFixed(2), py: py.toFixed(2), ptotal: ptot.toFixed(2) });

        /* Momentum label */
        pill(ctx, cx - 100, 12, 200, 22, 6, "rgba(16,185,129,0.15)");
        lbl(ctx, `Σp = ${ptot.toFixed(1)} ≈ 0  (momentum conserved ✓)`, cx, 27, "#10B981", 11);

        /* Reset when pieces off screen */
        if (s.pieces.every(pc => pc.x < -50 || pc.x > W + 50 || pc.y > H + 50)) {
          setTimeout(reset, 500);
        }
      }

      /* Launch pad */
      ctx.fillStyle = "#1a3a5c"; ctx.fillRect(cx - 10, launchY, 20, 8);

      fr++;
      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <div style={WRP}>
      <div style={HDR}>
        <h3 style={H3}>🎆 Firework Explosion — Σp = 0 (Conservation of Momentum)</h3>
        <p style={DESC}>The firework is at rest before explosion (p_total = 0). After exploding into 4 unequal pieces, the vector sum of all momenta is still zero. Each piece's momentum equals and opposes the others. <strong>m₁v₁ + m₂v₂ + m₃v₃ + m₄v₄ = 0</strong></p>
      </div>
      <canvas ref={cvs} style={CVS} />
      <div style={CTRLS}>
        <span style={{ fontSize: 11, color: "#475569" }}>Masses: 1 kg + 2 kg + 3 kg + 4 kg = 10 kg total. Momenta always sum to zero.</span>
      </div>
      <div style={TELE}>
        {[["Σp_x", `${t.px} kg·m/s`], ["Σp_y", `${t.py} kg·m/s`], ["Σ|p| total", `${t.ptotal} ≈ 0`]].map(([k, v]) => (
          <div key={k} style={TV}><span style={TK}>{k}</span><span style={{ ...TP, color: parseFloat(t.ptotal) < 2 ? "#10B981" : "#EF4444" }}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 13. NEWTON'S LAW INTERACTIVE SANDBOX
 * Demonstrates all 3 laws interactively. Change F and m → see a = F/m.
 * F_net = F_applied − F_friction  |  a = F_net / m  |  p = m × v
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_newton_sandbox() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const st  = useRef({ x: 80, v: 0 });
  const raf = useRef(0);
  const [p, setP] = useState({ F: 50, m: 5, mu: 0.2 });
  const [t, setT] = useState({ a: 0, v: 0, p: 0, Ff: 0 });

  useEffect(() => {
    const s = st.current;
    s.x = 80; s.v = 0;
    cancelAnimationFrame(raf.current);
    let fr = 0;

    const Ff   = p.mu * p.m * G;
    const Fnet = Math.max(0, p.F - Ff);
    const a    = Fnet / p.m;

    function tick() {
      const canvas = cvs.current; if (!canvas) return;
      const r = setupCanvas(canvas); if (!r) return;
      const [ctx, W, H] = r;

      drawBg(ctx, W, H);

      /* Physics */
      s.v = Math.min(s.v + a * DT, 8); /* cap speed for visual */
      s.x += s.v * DT * 30;
      if (s.x > W - 40) { s.x = 80; s.v = 0; }

      const groundY = H * 0.6;

      /* Ground */
      ctx.fillStyle = "#0f2030"; ctx.fillRect(0, groundY, W, H - groundY);

      /* Block */
      const blockW = 60, blockH = 40;
      const bx = s.x - blockW / 2;
      const by = groundY - blockH;
      pill(ctx, bx, by, blockW, blockH, 8, "#4F46E5");
      lbl(ctx, `${p.m} kg`, s.x, groundY - blockH / 2 + 5, "#fff", 12);

      /* Force arrows */
      arw(ctx, bx + blockW, groundY - blockH / 2, bx + blockW + p.F * 1.2, groundY - blockH / 2, "#10B981", `F=${p.F}N`, 2.5);
      if (Ff > 0) arw(ctx, bx, groundY - blockH / 2, bx - Ff * 1.2, groundY - blockH / 2, "#EF4444", `Ff=${Ff.toFixed(0)}N`, 2);
      arw(ctx, s.x, groundY - blockH, s.x, groundY - blockH - p.m * G * 0.4, "#F59E0B", `W=${(p.m*G).toFixed(0)}N`, 2);
      arw(ctx, s.x, groundY, s.x, groundY - p.m * G * 0.4, "#A78BFA", `N=${(p.m*G).toFixed(0)}N`, 2);

      /* Info box */
      pill(ctx, W - 170, 12, 158, 90, 8, "rgba(15,30,55,0.9)");
      lbl(ctx, `F_net = F - F_f = ${Fnet.toFixed(1)} N`, W - 91, 30, "#94A3B8", 10);
      lbl(ctx, `a = F_net / m = ${a.toFixed(2)} m/s²`, W - 91, 46, "#60A5FA", 11);
      lbl(ctx, `v = ${s.v.toFixed(2)} m/s`, W - 91, 62, "#F59E0B", 11);
      lbl(ctx, `p = ${(p.m * s.v).toFixed(2)} kg·m/s`, W - 91, 78, "#10B981", 11);
      lbl(ctx, `μ = ${p.mu}`, W - 91, 94, "#94A3B8", 10);

      /* Newton's law banner */
      if (Fnet === 0) lbl(ctx, "F_net = 0 → Zero acceleration (Newton's 1st Law)", W / 2 - 20, 22, "#F59E0B", 11);
      else lbl(ctx, `F_net = ${Fnet.toFixed(1)} N → a = ${a.toFixed(2)} m/s² (Newton's 2nd Law)`, W / 2 - 20, 22, "#60A5FA", 11);

      if (fr % 3 === 0) setT({ a: +a.toFixed(3), v: +s.v.toFixed(2), p: +(p.m * s.v).toFixed(2), Ff: +Ff.toFixed(1) });
      fr++;
      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [p]);

  return (
    <div style={WRP}>
      <div style={HDR}>
        <h3 style={H3}>🔬 Newton's Laws Sandbox — All 3 Laws Unified</h3>
        <p style={DESC}>Apply force and friction to a block. When F_net = 0, block doesn't accelerate (1st Law). F_net = ma (2nd Law). The block simultaneously exerts equal force back on the floor (3rd Law). <strong>a = (F − μmg) / m</strong></p>
      </div>
      <canvas ref={cvs} style={CVS} />
      <div style={CTRLS}>
        <div style={SLW}><span style={SLL}>Applied Force (N)</span>
          <input style={SLD} type="range" min={0} max={200} step={5} value={p.F} onChange={e => setP(x => ({ ...x, F: +e.target.value }))} />
          <span style={SLV}>{p.F} N</span>
        </div>
        <div style={SLW}><span style={SLL}>Mass (kg)</span>
          <input style={SLD} type="range" min={1} max={20} step={0.5} value={p.m} onChange={e => setP(x => ({ ...x, m: +e.target.value }))} />
          <span style={SLV}>{p.m} kg</span>
        </div>
        <div style={SLW}><span style={SLL}>Friction μ</span>
          <input style={SLD} type="range" min={0} max={0.8} step={0.05} value={p.mu} onChange={e => setP(x => ({ ...x, mu: +e.target.value }))} />
          <span style={SLV}>{p.mu}</span>
        </div>
      </div>
      <div style={TELE}>
        {[["Acceleration", `${t.a} m/s²`], ["Speed", `${t.v} m/s`], ["Momentum", `${t.p} kg·m/s`], ["Friction F", `${t.Ff} N`]].map(([k, v]) => (
          <div key={k} style={TV}><span style={TK}>{k}</span><span style={TP}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 14. ROLLING BALL ON INCLINE — SAME ACCELERATION REGARDLESS OF MASS
 * Both balls on same slope. a = g·sinθ (independent of mass!).
 * F = ma: heavier ball needs more force, but also has more mass → same a.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_rolling_slope_mass() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const st  = useRef({ s1: 0, s2: 0, v1: 0, v2: 0, done: false });
  const raf = useRef(0);
  const [p, setP] = useState({ θ: 30, m1: 1, m2: 5 });
  const [t, setT] = useState({ a: 0, F1: 0, F2: 0 });

  useEffect(() => {
    const s = st.current;
    s.s1 = 0; s.s2 = 0; s.v1 = 0; s.v2 = 0; s.done = false;
    cancelAnimationFrame(raf.current);
    let fr = 0;

    const θ_rad = p.θ * Math.PI / 180;
    const a = G * Math.sin(θ_rad);

    function tick() {
      const canvas = cvs.current; if (!canvas) return;
      const r = setupCanvas(canvas); if (!r) return;
      const [ctx, W, H] = r;

      drawBg(ctx, W, H);

      const slopeLen = Math.min(W - 60, 320);
      const ox = 40, oy = H - 50;
      const ex = ox + slopeLen * Math.cos(θ_rad);
      const ey = oy - slopeLen * Math.sin(θ_rad);

      /* Slope */
      ctx.strokeStyle = "#1a3a5c"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ex, oy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ex, oy); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.fillStyle = "#0f2030"; ctx.fillRect(0, oy, W, H - oy);

      /* Angle arc */
      ctx.strokeStyle = "#60A5FA44"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(ox, oy, 30, -θ_rad, 0); ctx.stroke();
      lbl(ctx, `${p.θ}°`, ox + 38, oy - 8, "#60A5FA", 10);

      /* Physics */
      if (!s.done) {
        s.v1 += a * DT; s.s1 += s.v1 * DT;
        s.v2 += a * DT; s.s2 += s.v2 * DT;
        if (s.s1 >= slopeLen / 60) { s.done = true; }
      } else {
        if (fr % 120 === 0) { s.s1 = 0; s.s2 = 0; s.v1 = 0; s.v2 = 0; s.done = false; }
      }

      /* Ball positions along slope */
      const t1 = Math.min(s.s1 / (slopeLen / 60), 1);
      const t2 = Math.min(s.s2 / (slopeLen / 60), 1);
      const b1x = ex + (ox - ex) * (1 - t1) - Math.cos(θ_rad) * 14;
      const b1y = ey + (oy - ey) * (1 - t1) + Math.sin(θ_rad) * 14;
      const b2x = b1x + Math.sin(θ_rad) * 32;
      const b2y = b1y + Math.cos(θ_rad) * 32;

      /* Ball 1 */
      ctx.beginPath(); ctx.arc(b1x, b1y, 12, 0, Math.PI * 2);
      ctx.fillStyle = "#3B82F6"; ctx.fill();
      lbl(ctx, `${p.m1}kg`, b1x, b1y - 18, "#60A5FA", 10);

      /* Ball 2 */
      ctx.beginPath(); ctx.arc(b2x, b2y, Math.sqrt(p.m2) * 6, 0, Math.PI * 2);
      ctx.fillStyle = "#F59E0B"; ctx.fill();
      lbl(ctx, `${p.m2}kg`, b2x, b2y - Math.sqrt(p.m2) * 6 - 6, "#F59E0B", 10);

      /* Info */
      const x1 = W - 200;
      pill(ctx, x1, 12, 188, 80, 8, "rgba(15,30,55,0.9)");
      lbl(ctx, `a = g·sinθ = ${a.toFixed(2)} m/s²`, x1 + 94, 30, "#10B981", 11);
      lbl(ctx, `F₁ = m₁a = ${(p.m1 * a).toFixed(1)} N`, x1 + 94, 48, "#60A5FA", 10);
      lbl(ctx, `F₂ = m₂a = ${(p.m2 * a).toFixed(1)} N`, x1 + 94, 64, "#F59E0B", 10);
      lbl(ctx, "Both balls reach bottom together!", x1 + 94, 82, "#10B98188", 10);

      if (s.done) {
        pill(ctx, W / 2 - 90, 20, 180, 22, 6, "rgba(16,185,129,0.2)");
        lbl(ctx, "⚖️ Same time! Acceleration is independent of mass", W / 2, 35, "#10B981", 11);
      }

      if (fr % 3 === 0) setT({ a: +a.toFixed(3), F1: +(p.m1 * a).toFixed(2), F2: +(p.m2 * a).toFixed(2) });
      fr++;
      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [p]);

  return (
    <div style={WRP}>
      <div style={HDR}>
        <h3 style={H3}>⚖️ Inclined Plane — Acceleration Doesn't Depend on Mass</h3>
        <p style={DESC}>A 1 kg and 5 kg ball released simultaneously from the same slope reach the bottom at the same time. More mass requires proportionally more force (F = ma), so acceleration stays constant. <strong>a = g·sin θ (mass-independent)</strong></p>
      </div>
      <canvas ref={cvs} style={CVS} />
      <div style={CTRLS}>
        <div style={SLW}><span style={SLL}>Slope angle θ</span>
          <input style={SLD} type="range" min={10} max={60} step={5} value={p.θ} onChange={e => setP(x => ({ ...x, θ: +e.target.value }))} />
          <span style={SLV}>{p.θ}°</span>
        </div>
        <div style={SLW}><span style={SLL}>Ball 2 mass (kg)</span>
          <input style={SLD} type="range" min={2} max={10} step={1} value={p.m2} onChange={e => setP(x => ({ ...x, m2: +e.target.value }))} />
          <span style={SLV}>{p.m2} kg</span>
        </div>
      </div>
      <div style={TELE}>
        {[["Acceleration", `${t.a} m/s²`], [`F on ${p.m1}kg ball`, `${t.F1} N`], [`F on ${p.m2}kg ball`, `${t.F2} N`]].map(([k, v]) => (
          <div key={k} style={TV}><span style={TK}>{k}</span><span style={TP}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 15. AIRBAG vs RIGID WALL — IMPULSE ANALYSIS
 * Same Δv → same Δp. Airbag extends Δt → reduces peak force dramatically.
 * F = Δp / Δt  ← Impulse-Momentum Theorem
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_airbag_impulse() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [p, setP] = useState({ v: 15, m: 70 }); /* head mass, initial speed */
  const [t, setT] = useState({ dp: 0, F_wall: 0, F_bag: 0 });

  useEffect(() => {
    cancelAnimationFrame(raf.current);
    let fr = 0;

    const dp = p.m * p.v;
    const dt_wall = 0.004; /* 4ms rigid wall */
    const dt_bag  = 0.06;  /* 60ms airbag */
    const F_wall  = dp / dt_wall;
    const F_bag   = dp / dt_bag;
    setT({ dp: +dp.toFixed(0), F_wall: +(F_wall / 1000).toFixed(1), F_bag: +(F_bag / 1000).toFixed(1) });

    function tick() {
      const canvas = cvs.current; if (!canvas) return;
      const r = setupCanvas(canvas); if (!r) return;
      const [ctx, W, H] = r;

      drawBg(ctx, W, H);

      const t_anim = (fr % 180) / 60; /* 3-second loop */

      /* === LEFT: Rigid Wall === */
      const lx = W * 0.25;
      const wallL = W * 0.42;

      /* Wall */
      ctx.fillStyle = "#374151"; ctx.fillRect(wallL - 8, 40, 16, H - 80);
      lbl(ctx, "RIGID WALL", wallL, H - 20, "#475569", 10);

      /* Head */
      const hxL = Math.max(lx, wallL - 40 * (1 - Math.min(t_anim / 1.5, 1)));
      ctx.beginPath(); ctx.arc(hxL - 20, H * 0.45, 22, 0, Math.PI * 2);
      ctx.fillStyle = t_anim > 1 && t_anim < 1.2 ? "#EF4444" : "#FBBF24"; ctx.fill();

      if (t_anim > 1 && t_anim < 1.3) {
        arw(ctx, wallL - 8, H * 0.45, wallL - 8 - F_wall / 100000, H * 0.45, "#EF4444", `${(F_wall/1000).toFixed(0)}kN`);
      }
      lbl(ctx, `Δt = ${(dt_wall * 1000).toFixed(0)} ms`, lx, H * 0.7, "#EF444488", 10);
      lbl(ctx, "Dangerous!", lx, H * 0.77, "#EF4444", 11);

      /* === RIGHT: Airbag === */
      const rx = W * 0.75;
      const wallR = W * 0.88;

      /* Airbag */
      if (t_anim > 0.5) {
        const inflate = Math.min(1, (t_anim - 0.5) / 0.3);
        ctx.beginPath(); ctx.ellipse(wallR - 30, H * 0.45, 28 * inflate, 22 * inflate, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59,130,246,${inflate * 0.5})`; ctx.fill();
        ctx.strokeStyle = "#60A5FA"; ctx.lineWidth = 2; ctx.stroke();
      }

      /* Wall */
      ctx.fillStyle = "#374151"; ctx.fillRect(wallR - 4, 40, 12, H - 80);

      /* Head */
      const hxR = Math.max(rx, wallR - 55 * (1 - Math.min((t_anim - 0.2) / 2, 1)));
      ctx.beginPath(); ctx.arc(hxR - 20, H * 0.45, 22, 0, Math.PI * 2);
      ctx.fillStyle = "#FBBF24"; ctx.fill();

      if (t_anim > 1) {
        arw(ctx, wallR - 8, H * 0.45, wallR - 8 - F_bag / 10000, H * 0.45, "#10B981", `${(F_bag/1000).toFixed(0)}kN`);
      }
      lbl(ctx, `Δt = ${(dt_bag * 1000).toFixed(0)} ms`, rx, H * 0.7, "#10B98188", 10);
      lbl(ctx, "Safe! ✓", rx, H * 0.77, "#10B981", 11);

      /* Separator */
      ctx.strokeStyle = "#1e2d3d"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(W / 2, 20); ctx.lineTo(W / 2, H - 20); ctx.stroke();

      /* Title */
      lbl(ctx, "Same Δp, same crash speed — Force reduced by 15× with airbag", W / 2, 22, "#94A3B8", 11);

      fr++;
      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [p]);

  return (
    <div style={WRP}>
      <div style={HDR}>
        <h3 style={H3}>💥 Airbag Safety — F = Δp / Δt (Extend Time, Reduce Force)</h3>
        <p style={DESC}>Same crash velocity and mass → same momentum change Δp. The airbag extends the collision time from 4ms (rigid wall) to 60ms, reducing peak force by 15×. This is why airbags save lives. <strong>F = Δp / Δt</strong></p>
      </div>
      <canvas ref={cvs} style={CVS} />
      <div style={CTRLS}>
        <div style={SLW}><span style={SLL}>Speed (m/s)</span>
          <input style={SLD} type="range" min={5} max={30} step={1} value={p.v} onChange={e => setP(x => ({ ...x, v: +e.target.value }))} />
          <span style={SLV}>{p.v} m/s</span>
        </div>
        <div style={SLW}><span style={SLL}>Mass (kg)</span>
          <input style={SLD} type="range" min={20} max={100} step={5} value={p.m} onChange={e => setP(x => ({ ...x, m: +e.target.value }))} />
          <span style={SLV}>{p.m} kg</span>
        </div>
      </div>
      <div style={TELE}>
        {[["Δp", `${t.dp} kg·m/s`], ["Force (rigid wall)", `${t.F_wall} kN`], ["Force (airbag)", `${t.F_bag} kN`], ["Reduction factor", `${t.F_wall && t.F_bag ? (t.F_wall / t.F_bag).toFixed(0) : "–"}×`]].map(([k, v]) => (
          <div key={k} style={TV}><span style={TK}>{k}</span><span style={{ ...TP, color: String(k).includes("airbag") ? "#10B981" : String(k).includes("rigid") ? "#EF4444" : "#60A5FA" }}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 16. EARTH vs MOON DROP — SIDE BY SIDE
 * Same height h = 50m. Time: t = √(2h/g)
 * Earth: g=9.8 → t=3.19s  |  Moon: g=1.62 → t=7.86s
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_earth_moon_drop() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const st  = useRef({ ye: 0, ym: 0, ve: 0, vm: 0, t: 0, te: 0, tm: 0 });
  const raf = useRef(0);
  const [tele, setTele] = useState({ te: "–", tm: "–", ve: "–", vm: "–" });

  const H_M = 50;

  useEffect(() => {
    const s = st.current;
    Object.assign(s, { ye: 0, ym: 0, ve: 0, vm: 0, t: 0, te: 0, tm: 0 });
    cancelAnimationFrame(raf.current);
    let fr = 0;

    function tick() {
      const canvas = cvs.current; if (!canvas) return;
      const r = setupCanvas(canvas); if (!r) return;
      const [ctx, W, H] = r;

      drawBg(ctx, W, H);

      const groundY = H - 40;
      const startY  = 40;
      const PX      = (groundY - startY) / H_M;

      /* Physics */
      s.t += DT;
      if (s.ye < H_M * PX) { s.ve += G * DT; s.ye += s.ve * DT; if (s.ye >= H_M * PX && !s.te) s.te = s.t; }
      if (s.ym < H_M * PX) { s.vm += 1.62 * DT; s.ym += s.vm * DT; if (s.ym >= H_M * PX && !s.tm) s.tm = s.t; }

      /* Columns */
      const cx1 = W * 0.3, cx2 = W * 0.7;
      const col1 = "#3B82F6", col2 = "#94A3B8";

      /* Backgrounds */
      ctx.fillStyle = "rgba(30,60,100,0.12)"; ctx.fillRect(0, 0, W / 2, H);
      ctx.fillStyle = "rgba(60,60,80,0.06)";  ctx.fillRect(W / 2, 0, W / 2, H);

      /* Ground surfaces */
      ctx.fillStyle = "#1a3a5c"; ctx.fillRect(0, groundY, W / 2, H - groundY);
      ctx.fillStyle = "#2a2a3a"; ctx.fillRect(W / 2, groundY, W / 2, H - groundY);

      /* Headers */
      lbl(ctx, "EARTH  g = 9.8 m/s²", cx1, 22, col1, 12);
      lbl(ctx, "MOON  g = 1.62 m/s²", cx2, 22, col2, 12);
      lbl(ctx, `t_Earth = √(2×${H_M}/9.8) = ${Math.sqrt(2 * H_M / G).toFixed(2)} s`, cx1, 36, "#3B82F655", 10);
      lbl(ctx, `t_Moon = √(2×${H_M}/1.62) = ${Math.sqrt(2 * H_M / 1.62).toFixed(2)} s`, cx2, 36, "#94A3B855", 10);

      /* Height line */
      ctx.strokeStyle = "rgba(255,255,255,0.08)"; ctx.lineWidth = 1; ctx.setLineDash([6, 6]);
      ctx.beginPath(); ctx.moveTo(0, startY); ctx.lineTo(W, startY); ctx.stroke();
      ctx.setLineDash([]);
      lbl(ctx, "h = 50 m", 10, startY + 12, "#475569", 9);

      /* Balls */
      const ey = Math.min(startY + s.ye, groundY - 12);
      const my = Math.min(startY + s.ym, groundY - 12);

      ctx.beginPath(); ctx.arc(cx1, ey, 12, 0, Math.PI * 2); ctx.fillStyle = col1; ctx.fill();
      ctx.beginPath(); ctx.arc(cx2, my, 12, 0, Math.PI * 2); ctx.fillStyle = col2; ctx.fill();

      /* Speed labels */
      lbl(ctx, `v = ${s.ve.toFixed(1)} m/s`, cx1, ey - 20, col1, 10);
      lbl(ctx, `v = ${s.vm.toFixed(1)} m/s`, cx2, my - 20, col2, 10);

      /* Landing times */
      if (s.te) {
        pill(ctx, cx1 - 45, groundY - 24, 90, 18, 5, "#3B82F633");
        lbl(ctx, `✓ ${s.te.toFixed(2)} s`, cx1, groundY - 12, col1, 12);
      }
      if (s.tm) {
        pill(ctx, cx2 - 45, groundY - 24, 90, 18, 5, "#94A3B833");
        lbl(ctx, `✓ ${s.tm.toFixed(2)} s`, cx2, groundY - 12, col2, 12);
      }

      /* Separator */
      ctx.strokeStyle = "#1e2d3d"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(W / 2, 50); ctx.lineTo(W / 2, H - 20); ctx.stroke();

      /* Auto-reset */
      if (s.te && s.tm) {
        if (fr % 240 === 0) Object.assign(s, { ye: 0, ym: 0, ve: 0, vm: 0, t: 0, te: 0, tm: 0 });
      }

      if (fr % 5 === 0) setTele({
        te: s.te ? `${s.te.toFixed(2)} s` : "–",
        tm: s.tm ? `${s.tm.toFixed(2)} s` : "–",
        ve: `${s.ve.toFixed(1)} m/s`,
        vm: `${s.vm.toFixed(1)} m/s`,
      });

      fr++;
      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <div style={WRP}>
      <div style={HDR}>
        <h3 style={H3}>🌍🌙 Earth vs Moon Drop — Same Height, Different Gravity</h3>
        <p style={DESC}>Dropping the same object from 50m. Moon's gravity (1.62 m/s²) is only 1/6 of Earth's (9.8 m/s²), so it takes 2.47× longer to fall. Watch them side by side. <strong>t = √(2h / g)</strong></p>
      </div>
      <canvas ref={cvs} style={CVS} />
      <div style={CTRLS}>
        <span style={{ fontSize: 11, color: "#475569" }}>h = 50 m | Earth: t = {Math.sqrt(2 * H_M / G).toFixed(2)} s | Moon: t = {Math.sqrt(2 * H_M / 1.62).toFixed(2)} s</span>
      </div>
      <div style={TELE}>
        {[["Earth landing", tele.te], ["Moon landing", tele.tm], ["Earth speed", tele.ve], ["Moon speed", tele.vm]].map(([k, v]) => (
          <div key={k} style={TV}><span style={TK}>{k}</span><span style={TP}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 17. SATELLITE CIRCULAR ORBIT
 * v_orbit = √(GM/r)  |  F_gravity = GMm/r² = centripetal force = mv²/r
 * ISS altitude ≈ 400km. Adjust altitude, see orbital speed and period.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_satellite_orbit_pro() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [p, setP] = useState({ alt: 400 }); /* altitude in km */
  const [t, setT] = useState({ v: 0, T: 0, Fg: 0 });

  const R_E = 6371e3; /* Earth radius m */
  const GM  = 3.986e14; /* Gravitational parameter m³/s² */
  const M_SAT = 420000; /* ISS mass kg */

  useEffect(() => {
    cancelAnimationFrame(raf.current);
    let θ = 0;

    const r = R_E + p.alt * 1e3;
    const v_orbit = Math.sqrt(GM / r);
    const T_orbit = 2 * Math.PI * r / v_orbit;
    const F_g = GM * M_SAT / (r * r);
    setT({ v: +(v_orbit / 1000).toFixed(2), T: +(T_orbit / 60).toFixed(1), Fg: +(F_g / 1000).toFixed(0) });

    function tick() {
      const canvas = cvs.current; if (!canvas) return;
      const r_cvs = setupCanvas(canvas); if (!r_cvs) return;
      const [ctx, W, H] = r_cvs;

      drawBg(ctx, W, H);

      const cx = W / 2, cy = H / 2;
      const earthR = Math.min(60, H * 0.22);
      const orbitR = earthR + (p.alt / 1000) * 25 + 20;

      /* Earth */
      const eg = ctx.createRadialGradient(cx - 8, cy - 8, 5, cx, cy, earthR);
      eg.addColorStop(0, "#1D4ED8"); eg.addColorStop(0.5, "#1a56b0"); eg.addColorStop(1, "#0c2d6b");
      ctx.beginPath(); ctx.arc(cx, cy, earthR, 0, Math.PI * 2); ctx.fillStyle = eg; ctx.fill();
      lbl(ctx, "Earth", cx, cy, "#60A5FA88", 10);

      /* Orbit path */
      ctx.strokeStyle = "rgba(99,102,241,0.2)"; ctx.lineWidth = 1; ctx.setLineDash([6, 6]);
      ctx.beginPath(); ctx.arc(cx, cy, orbitR, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);

      /* Angular speed: ω = v/r (scaled for animation) */
      const ω_anim = v_orbit / r * 30; /* × speed up so visible */
      θ += ω_anim * DT;

      const sx = cx + orbitR * Math.cos(θ);
      const sy = cy + orbitR * Math.sin(θ);

      /* Gravity force arrow (toward Earth) */
      const dx = cx - sx, dy = cy - sy;
      const dl = Math.sqrt(dx * dx + dy * dy);
      arw(ctx, sx, sy, sx + dx * 0.4, sy + dy * 0.4, "#EF4444", "Fg", 2);

      /* Velocity arrow (tangential) */
      const vx = -Math.sin(θ), vy = Math.cos(θ);
      arw(ctx, sx, sy, sx + vx * 30, sy + vy * 30, "#10B981", "v", 2);

      /* Satellite */
      ctx.save(); ctx.translate(sx, sy);
      /* Solar panels */
      ctx.fillStyle = "#1D4ED8"; ctx.fillRect(-22, -4, 16, 8); ctx.fillRect(6, -4, 16, 8);
      /* Body */
      pill(ctx, -5, -6, 10, 12, 2, "#94A3B8");
      ctx.restore();

      /* Info */
      const ix = 8, iy = 12;
      lbl(ctx, `Alt: ${p.alt} km`, ix + 60, iy + 12, "#64748B", 10);
      lbl(ctx, `v = ${(v_orbit/1000).toFixed(2)} km/s`, ix + 60, iy + 28, "#10B981", 11);
      lbl(ctx, `T = ${(T_orbit/60).toFixed(1)} min`, ix + 60, iy + 44, "#60A5FA", 11);
      lbl(ctx, `Fg = ${(F_g/1000).toFixed(0)} kN`, ix + 60, iy + 60, "#EF4444", 11);

      /* Key equation */
      lbl(ctx, "Gravity = Centripetal: GMm/r² = mv²/r", W / 2, H - 14, "#47556988", 10);

      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [p]);

  return (
    <div style={WRP}>
      <div style={HDR}>
        <h3 style={H3}>🛸 Satellite Orbit — Gravity Provides Centripetal Force</h3>
        <p style={DESC}>At orbital altitude, gravity pulls the satellite toward Earth. This is exactly the centripetal force needed for circular motion. Adjusting altitude changes both orbital speed and period. <strong>v = √(GM/r), F_g = mv²/r</strong></p>
      </div>
      <canvas ref={cvs} style={CVS} />
      <div style={CTRLS}>
        <div style={SLW}><span style={SLL}>Altitude (km)</span>
          <input style={SLD} type="range" min={200} max={35000} step={100} value={p.alt} onChange={e => setP(x => ({ ...x, alt: +e.target.value }))} />
          <span style={SLV}>{p.alt} km</span>
        </div>
        <span style={{ fontSize: 10, color: "#475569" }}>ISS=400km | GPS=20200km | GEO=35786km</span>
      </div>
      <div style={TELE}>
        {[["Orbital speed", `${t.v} km/s`], ["Period", `${t.T} min`], ["Gravity force", `${t.Fg} kN`]].map(([k, v]) => (
          <div key={k} style={TV}><span style={TK}>{k}</span><span style={TP}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 18. SWIMMING FORCE ANALYSIS — NEWTON'S 3RD LAW IN WATER
 * Swimmer kicks water backward → water pushes swimmer forward (Newton's 3rd)
 * Propulsion = kick force − water drag  |  a = F_net / m
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_swimming_propulsion_pro() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const st  = useRef({ x: 0, v: 0, kick: 0 });
  const raf = useRef(0);
  const [p, setP] = useState({ F_kick: 300, m: 75 });
  const [t, setT] = useState({ v: 0, a: 0, Fdrag: 0 });

  const RHO = 1000; const Cd = 0.65; const A = 0.07;

  useEffect(() => {
    const s = st.current;
    s.x = 0; s.v = 0; s.kick = 0;
    cancelAnimationFrame(raf.current);
    let fr = 0;

    function tick() {
      const canvas = cvs.current; if (!canvas) return;
      const r = setupCanvas(canvas); if (!r) return;
      const [ctx, W, H] = r;

      drawBg(ctx, W, H);

      /* Water background */
      ctx.fillStyle = "rgba(0,60,120,0.35)"; ctx.fillRect(0, 0, W, H);

      /* Kick cycle: 0.5s kick, 0.5s glide */
      s.kick = (fr % 60 < 30) ? 1 : 0;
      const F_prop = s.kick ? p.F_kick : 0;
      const F_drag = 0.5 * RHO * Cd * A * s.v * s.v;
      const F_net  = F_prop - F_drag;
      const a      = F_net / p.m;
      s.v = Math.max(0, s.v + a * DT);
      s.x += s.v * DT * 30;
      if (s.x > W * 0.8) s.x = 40;

      /* Pool lane markings */
      ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.lineWidth = 2;
      [H * 0.3, H * 0.7].forEach(y => {
        ctx.setLineDash([20, 10]); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      });
      ctx.setLineDash([]);

      /* Swimmer (simple stick figure facing right) */
      const sx = 60 + s.x, sy = H / 2;
      ctx.strokeStyle = "#FBBF24"; ctx.lineWidth = 3; ctx.lineCap = "round";
      /* Body */
      ctx.beginPath(); ctx.moveTo(sx - 20, sy); ctx.lineTo(sx + 20, sy); ctx.stroke();
      /* Head */
      ctx.beginPath(); ctx.arc(sx + 26, sy, 8, 0, Math.PI * 2); ctx.fillStyle = "#FBBF24"; ctx.fill();
      /* Arms */
      ctx.beginPath(); ctx.moveTo(sx - 10, sy - 5); ctx.lineTo(sx + 10, sy - 15 - (s.kick ? 5 : 0)); ctx.stroke();
      /* Legs / kick */
      const kickAngle = s.kick ? Math.sin(fr * 0.3) * 20 : 0;
      ctx.beginPath(); ctx.moveTo(sx - 20, sy); ctx.lineTo(sx - 40 - kickAngle, sy + 12); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(sx - 20, sy); ctx.lineTo(sx - 40 + kickAngle, sy - 12); ctx.stroke();

      /* Force arrows */
      if (s.kick) {
        /* Kick pushes water back */
        arw(ctx, sx - 30, sy, sx - 30 - F_prop / 20, sy, "#EF4444", "Kick→Water");
        /* Reaction: water pushes swimmer forward */
        arw(ctx, sx + 30, sy, sx + 30 + F_prop / 20, sy, "#10B981", "Reaction→Swimmer");
      }
      /* Drag arrow */
      if (s.v > 0.1) arw(ctx, sx + 26, sy + 16, sx + 26 - F_drag / 10, sy + 16, "#F59E0B", `Drag=${F_drag.toFixed(0)}N`);

      /* Info */
      pill(ctx, W - 175, 10, 165, 70, 8, "rgba(0,10,30,0.85)");
      lbl(ctx, `Phase: ${s.kick ? "KICKING" : "GLIDING"}`, W - 92, 26, s.kick ? "#10B981" : "#64748B", 11);
      lbl(ctx, `F_net = ${F_net.toFixed(0)} N`, W - 92, 42, "#60A5FA", 10);
      lbl(ctx, `a = ${a.toFixed(2)} m/s²`, W - 92, 56, "#A78BFA", 10);
      lbl(ctx, `v = ${s.v.toFixed(2)} m/s`, W - 92, 70, "#F59E0B", 10);

      /* Newton's 3rd law label */
      lbl(ctx, "Action: Swimmer kicks water backward → Reaction: Water propels swimmer forward", W / 2, H - 14, "#47556977", 10);

      if (fr % 3 === 0) setT({ v: +s.v.toFixed(2), a: +a.toFixed(3), Fdrag: +F_drag.toFixed(1) });
      fr++;
      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [p]);

  return (
    <div style={WRP}>
      <div style={HDR}>
        <h3 style={H3}>🏊 Swimming — Newton's 3rd Law in Water (Action-Reaction)</h3>
        <p style={DESC}>The swimmer kicks water backward (action). Water pushes the swimmer forward with equal and opposite force (reaction). As speed builds, drag force increases until terminal swimming speed is reached. <strong>F_action = F_reaction</strong></p>
      </div>
      <canvas ref={cvs} style={CVS} />
      <div style={CTRLS}>
        <div style={SLW}><span style={SLL}>Kick force (N)</span>
          <input style={SLD} type="range" min={100} max={600} step={50} value={p.F_kick} onChange={e => setP(x => ({ ...x, F_kick: +e.target.value }))} />
          <span style={SLV}>{p.F_kick} N</span>
        </div>
        <div style={SLW}><span style={SLL}>Swimmer mass (kg)</span>
          <input style={SLD} type="range" min={40} max={120} step={5} value={p.m} onChange={e => setP(x => ({ ...x, m: +e.target.value }))} />
          <span style={SLV}>{p.m} kg</span>
        </div>
      </div>
      <div style={TELE}>
        {[["Speed", `${t.v} m/s`], ["Acceleration", `${t.a} m/s²`], ["Water Drag", `${t.Fdrag} N`]].map(([k, v]) => (
          <div key={k} style={TV}><span style={TK}>{k}</span><span style={TP}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 19. TUG OF WAR — FULL FORCE ANALYSIS
 * Net force = T_A − T_B − friction. a = F_net / (m_A + m_B)
 * Includes rope tension, ground friction, and per-team weight.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_tug_of_war_analysis() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const st  = useRef({ x: 0, v: 0 });
  const raf = useRef(0);
  const [p, setP] = useState({ FA: 2000, FB: 1800, mu: 0.6, mA: 300, mB: 280 });
  const [t, setT] = useState({ Fnet: 0, a: 0, v: 0 });

  useEffect(() => {
    const s = st.current;
    s.x = 0; s.v = 0;
    cancelAnimationFrame(raf.current);
    let fr = 0;

    function tick() {
      const canvas = cvs.current; if (!canvas) return;
      const r = setupCanvas(canvas); if (!r) return;
      const [ctx, W, H] = r;

      drawBg(ctx, W, H);

      const totalM = p.mA + p.mB;
      const Ff     = p.mu * totalM * G;
      const Fnet   = p.FA - p.FB - (s.v > 0 ? Ff : s.v < 0 ? -Ff : Math.min(Math.abs(p.FA - p.FB), Ff) * Math.sign(p.FA - p.FB));
      const a      = Fnet / totalM;
      s.v += a * DT;
      s.x = Math.max(-W * 0.3, Math.min(W * 0.3, s.x + s.v * DT * 30));

      const groundY = H * 0.65;
      const mid     = W / 2 + s.x;

      /* Ground */
      ctx.fillStyle = "#0f2030"; ctx.fillRect(0, groundY, W, H - groundY);

      /* Center line */
      ctx.strokeStyle = "#EF4444"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(mid, groundY - 40); ctx.lineTo(mid, groundY + 10); ctx.stroke();
      lbl(ctx, "CENTER", mid, groundY + 20, "#EF4444", 10);

      /* Rope */
      const ropeY = groundY - 20;
      ctx.strokeStyle = "#D97706"; ctx.lineWidth = 6; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(60, ropeY); ctx.lineTo(W - 60, ropeY); ctx.stroke();

      /* Team A (left, blue) */
      const teamAx = 60;
      pill(ctx, teamAx - 30, groundY - 55, 80, 40, 8, "#1D4ED8");
      lbl(ctx, `Team A`, teamAx + 10, groundY - 30, "#93C5FD", 11);
      lbl(ctx, `${p.mA}kg`, teamAx + 10, groundY - 16, "#BFDBFE", 10);

      /* Team B (right, red) */
      const teamBx = W - 60;
      pill(ctx, teamBx - 50, groundY - 55, 80, 40, 8, "#991B1B");
      lbl(ctx, `Team B`, teamBx - 10, groundY - 30, "#FCA5A5", 11);
      lbl(ctx, `${p.mB}kg`, teamBx - 10, groundY - 16, "#FECACA", 10);

      /* Force arrows on rope */
      arw(ctx, 120, ropeY, 120 + p.FA / 30, ropeY, "#3B82F6", `F_A=${p.FA}N`, 2.5);
      arw(ctx, W - 120, ropeY, W - 120 - p.FB / 30, ropeY, "#EF4444", `F_B=${p.FB}N`, 2.5);
      arw(ctx, mid, ropeY - 20, mid + s.v * 15, ropeY - 20, "#10B981", `v=${s.v.toFixed(1)}`, 2);

      /* Winner label */
      if (Math.abs(s.x) > W * 0.25) {
        const winner = s.x > 0 ? "Team A WINS!" : "Team B WINS!";
        const wcol   = s.x > 0 ? "#3B82F6" : "#EF4444";
        pill(ctx, W / 2 - 70, 18, 140, 26, 8, `${wcol}33`);
        lbl(ctx, winner, W / 2, 35, wcol, 14);
        setTimeout(() => { s.x = 0; s.v = 0; }, 1500);
      }

      /* Net force info */
      pill(ctx, W - 180, H - 70, 170, 58, 8, "rgba(0,10,30,0.85)");
      lbl(ctx, `F_net = ${Fnet.toFixed(0)} N`, W - 95, H - 56, "#60A5FA", 11);
      lbl(ctx, `Friction = ±${Ff.toFixed(0)} N`, W - 95, H - 40, "#F59E0B", 10);
      lbl(ctx, `a = ${a.toFixed(3)} m/s²`, W - 95, H - 24, "#10B981", 11);

      if (fr % 3 === 0) setT({ Fnet: +Fnet.toFixed(1), a: +a.toFixed(4), v: +s.v.toFixed(2) });
      fr++;
      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [p]);

  return (
    <div style={WRP}>
      <div style={HDR}>
        <h3 style={H3}>🪢 Tug of War — Complete Force Analysis (All Forces Shown)</h3>
        <p style={DESC}>Net force = Team A pull − Team B pull − ground friction. Even a small difference in pulling force produces acceleration. When F_net = 0, the rope doesn't move (Newton's 1st Law). <strong>F_net = F_A − F_B − Ff</strong></p>
      </div>
      <canvas ref={cvs} style={CVS} />
      <div style={CTRLS}>
        <div style={SLW}><span style={SLL}>Team A force (N)</span>
          <input style={SLD} type="range" min={500} max={4000} step={100} value={p.FA} onChange={e => { st.current.x = 0; st.current.v = 0; setP(x => ({ ...x, FA: +e.target.value })); }} />
          <span style={SLV}>{p.FA} N</span>
        </div>
        <div style={SLW}><span style={SLL}>Team B force (N)</span>
          <input style={SLD} type="range" min={500} max={4000} step={100} value={p.FB} onChange={e => { st.current.x = 0; st.current.v = 0; setP(x => ({ ...x, FB: +e.target.value })); }} />
          <span style={SLV}>{p.FB} N</span>
        </div>
        <div style={SLW}><span style={SLL}>Friction μ</span>
          <input style={SLD} type="range" min={0.1} max={0.9} step={0.05} value={p.mu} onChange={e => { st.current.x = 0; st.current.v = 0; setP(x => ({ ...x, mu: +e.target.value })); }} />
          <span style={SLV}>{p.mu}</span>
        </div>
      </div>
      <div style={TELE}>
        {[["Net Force", `${t.Fnet} N`], ["Acceleration", `${t.a} m/s²`], ["Speed", `${t.v} m/s`]].map(([k, v]) => (
          <div key={k} style={TV}><span style={TK}>{k}</span><span style={{ ...TP, color: Math.abs(t.Fnet) < 10 ? "#10B981" : "#60A5FA" }}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 20. MOLECULAR GAS PRESSURE — KINETIC THEORY
 * Pressure = force / area. Force comes from molecules bouncing off walls.
 * P = nkT / V  (ideal gas). Number of wall hits per second → pressure.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_molecular_gas() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const st  = useRef<{ mols: { x: number; y: number; vx: number; vy: number }[]; hits: number; timer: number }>({ mols: [], hits: 0, timer: 0 });
  const raf = useRef(0);
  const [p, setP] = useState({ N: 30, T: 300 }); /* molecules, temperature K */
  const [t, setT] = useState({ P: 0, hits: 0, avgV: 0 });

  useEffect(() => {
    const s = st.current;
    cancelAnimationFrame(raf.current);
    let fr = 0;

    /* Initialize molecules */
    const init = () => {
      const avgV = Math.sqrt(3 * 1.38e-23 * p.T / (28 * 1.67e-27)) * 0.001; /* scale */
      s.mols = Array.from({ length: p.N }, () => ({
        x: 80 + Math.random() * 200, y: 40 + Math.random() * 220,
        vx: (Math.random() - 0.5) * avgV * 2,
        vy: (Math.random() - 0.5) * avgV * 2,
      }));
      s.hits = 0; s.timer = 0;
    };
    init();

    function tick() {
      const canvas = cvs.current; if (!canvas) return;
      const r = setupCanvas(canvas); if (!r) return;
      const [ctx, W, H] = r;

      drawBg(ctx, W, H);

      const bx1 = 70, by1 = 30, bx2 = 290, by2 = 270; /* box */
      const boxW = bx2 - bx1, boxH = by2 - by1;

      /* Box outline */
      ctx.strokeStyle = "#1D4ED8"; ctx.lineWidth = 2;
      ctx.strokeRect(bx1, by1, boxW, boxH);
      ctx.fillStyle = "rgba(15,30,70,0.3)";
      ctx.fillRect(bx1, by1, boxW, boxH);

      s.timer += DT;
      if (s.timer > 1) { s.hits = 0; s.timer = 0; }

      /* Update molecules */
      s.mols.forEach(m => {
        m.x += m.vx * 2; m.y += m.vy * 2;
        if (m.x <= bx1 + 4) { m.vx = Math.abs(m.vx); s.hits++; }
        if (m.x >= bx2 - 4) { m.vx = -Math.abs(m.vx); s.hits++; }
        if (m.y <= by1 + 4) { m.vy = Math.abs(m.vy); s.hits++; }
        if (m.y >= by2 - 4) { m.vy = -Math.abs(m.vy); s.hits++; }
        /* Molecule */
        ctx.beginPath(); ctx.arc(m.x, m.y, 4, 0, Math.PI * 2);
        const speed = Math.sqrt(m.vx * m.vx + m.vy * m.vy);
        const r255 = Math.min(255, speed * 3000); const b255 = Math.max(0, 255 - speed * 2000);
        ctx.fillStyle = `rgb(${Math.round(r255)},100,${Math.round(b255)})`;
        ctx.fill();
        /* Velocity trail */
        ctx.strokeStyle = `rgba(${Math.round(r255)},100,${Math.round(b255)},0.3)`; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - m.vx * 5, m.y - m.vy * 5); ctx.stroke();
      });

      /* Pressure gauge */
      const P = s.hits / (s.timer + 0.01);
      const gaugeX = bx2 + 30;
      pill(ctx, gaugeX, by1, 140, boxH, 8, "rgba(15,25,50,0.6)");
      lbl(ctx, "Pressure Gauge", gaugeX + 70, by1 + 16, "#64748B", 10);
      const pFrac = Math.min(1, P / 300);
      pill(ctx, gaugeX + 16, by2 - 16 - pFrac * (boxH - 32), 108, pFrac * (boxH - 32), 4, `rgba(37,99,235,${0.3 + pFrac * 0.5})`);
      lbl(ctx, `${P.toFixed(0)} hits/s`, gaugeX + 70, by1 + boxH / 2 + 6, "#60A5FA", 12);
      lbl(ctx, "= Pressure Force", gaugeX + 70, by1 + boxH / 2 + 20, "#94A3B855", 10);

      /* Info */
      lbl(ctx, `N = ${p.N} molecules`, bx1 + 110, by2 + 18, "#64748B", 10);
      lbl(ctx, `T = ${p.T} K (Temperature)`, bx1 + 110, by2 + 30, "#F59E0B", 10);
      lbl(ctx, "Each wall collision = tiny force pulse → total = GAS PRESSURE", W / 2, H - 10, "#47556966", 10);

      const avgV = Math.sqrt(s.mols.reduce((s, m) => s + m.vx * m.vx + m.vy * m.vy, 0) / p.N);
      if (fr % 5 === 0) setT({ P: +P.toFixed(0), hits: s.hits, avgV: +avgV.toFixed(3) });
      fr++;
      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [p]);

  return (
    <div style={WRP}>
      <div style={HDR}>
        <h3 style={H3}>⚛️ Gas Pressure — Molecular Collisions Create Force</h3>
        <p style={DESC}>Gas pressure is the sum of billions of molecular collisions with the container walls. Higher temperature = faster molecules = more collisions = higher pressure. This is the kinetic theory of gases. <strong>P = nkT/V</strong></p>
      </div>
      <canvas ref={cvs} style={CVS} />
      <div style={CTRLS}>
        <div style={SLW}><span style={SLL}>Molecules N</span>
          <input style={SLD} type="range" min={10} max={60} step={5} value={p.N} onChange={e => setP(x => ({ ...x, N: +e.target.value }))} />
          <span style={SLV}>{p.N}</span>
        </div>
        <div style={SLW}><span style={SLL}>Temperature (K)</span>
          <input style={SLD} type="range" min={100} max={1000} step={50} value={p.T} onChange={e => setP(x => ({ ...x, T: +e.target.value }))} />
          <span style={SLV}>{p.T} K</span>
        </div>
      </div>
      <div style={TELE}>
        {[["Wall hits/s", `${t.P}`], ["Total hits", `${t.hits}`], ["Avg speed", `${t.avgV} units`]].map(([k, v]) => (
          <div key={k} style={TV}><span style={TK}>{k}</span><span style={TP}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 21. CRICKET BAT IMPULSE — F × Δt = Δp
 * Bat speed and contact time determine ball speed after hit.
 * J = F × Δt = m × Δv  |  v_ball = v_bat × (1 + e) × m_bat / (m_bat + m_ball)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_cricket_impulse() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const st  = useRef({ phase: "approach" as "approach" | "impact" | "fly", ballX: 0, ballV: 0, batX: 0, batV: 0, impT: 0 });
  const raf = useRef(0);
  const [p, setP] = useState({ v_bat: 30, m_bat: 1.2, dt: 0.002 });
  const [t, setT] = useState({ J: 0, F_avg: 0, v_ball: 0 });

  const M_BALL = 0.16; /* kg, cricket ball */
  const E = 0.5; /* coefficient of restitution */

  useEffect(() => {
    const s = st.current;
    s.ballX = 0; s.ballV = -15; s.batX = 0; s.batV = p.v_bat; s.phase = "approach"; s.impT = 0;
    cancelAnimationFrame(raf.current);
    let fr = 0;

    const v_after = (p.v_bat * (1 + E) * p.m_bat) / (p.m_bat + M_BALL) - M_BALL * (-15) * (E - 1) / (p.m_bat + M_BALL);
    const J    = M_BALL * (v_after - (-15));
    const F_avg = J / p.dt;
    setT({ J: +J.toFixed(2), F_avg: +(F_avg).toFixed(0), v_ball: +v_after.toFixed(1) });

    function tick() {
      const canvas = cvs.current; if (!canvas) return;
      const r = setupCanvas(canvas); if (!r) return;
      const [ctx, W, H] = r;

      drawBg(ctx, W, H);

      const groundY = H * 0.7;
      const batHomeX = W * 0.55;
      const ballStartX = 30;

      /* Ground */
      ctx.fillStyle = "#0f2030"; ctx.fillRect(0, groundY, W, H - groundY);
      /* Pitch */
      ctx.fillStyle = "#1a3a2a"; ctx.fillRect(0, groundY - 2, W, 4);

      if (s.phase === "approach") {
        s.ballX += s.ballV * DT * 20;
        s.batX = 0;
        if (s.ballX >= (batHomeX - 20)) {
          s.phase = "impact";
          s.impT = 0;
          s.ballV = v_after;
          s.batV = p.v_bat * 0.8; /* bat slows a bit */
        }
      } else if (s.phase === "impact") {
        s.impT += DT;
        if (s.impT > p.dt * 50) {
          s.phase = "fly";
        }
        /* Deformation flash */
        ctx.fillStyle = "rgba(251,191,36,0.3)"; ctx.beginPath();
        ctx.arc(batHomeX, groundY - 40, 18 + Math.sin(s.impT * 200) * 4, 0, Math.PI * 2); ctx.fill();
        lbl(ctx, "IMPACT!", batHomeX, groundY - 70, "#F59E0B", 14);
      } else {
        s.ballX += s.ballV * DT * 20;
        if (s.ballX > W + 50) {
          s.ballX = ballStartX; s.ballV = -15; s.batX = 0; s.batV = p.v_bat; s.phase = "approach"; s.impT = 0;
        }
      }

      /* Ball */
      const ballY = groundY - 40;
      const bx = s.phase === "approach" ? ballStartX + s.ballX : batHomeX + (s.phase === "fly" ? (s.ballX - (batHomeX)) : 0);
      ctx.beginPath(); ctx.arc(Math.max(10, Math.min(W - 10, bx)), ballY, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#DC2626"; ctx.fill();
      ctx.strokeStyle = "#fff4"; ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(bx, ballY, 10, (i / 3) * Math.PI * 2, ((i + 0.5) / 3) * Math.PI * 2); ctx.stroke(); }

      /* Bat */
      ctx.save(); ctx.translate(batHomeX + 20, ballY);
      ctx.fillStyle = "#92400E"; ctx.fillRect(-6, -50, 12, 60);
      ctx.fillStyle = "#B45309"; ctx.fillRect(-5, -12, 10, 22);
      ctx.restore();

      /* Velocity arrow on ball */
      if (s.phase !== "impact") {
        const bv = s.ballV;
        arw(ctx, bx, ballY - 18, bx + bv * 2, ballY - 18, bv > 0 ? "#10B981" : "#EF4444", `${Math.abs(bv).toFixed(1)} m/s`);
      }

      /* Stats */
      pill(ctx, 10, 10, 180, 80, 8, "rgba(5,15,35,0.9)");
      lbl(ctx, `Bat speed: ${p.v_bat} m/s`, 100, 28, "#F59E0B", 10);
      lbl(ctx, `Ball exit: ${v_after.toFixed(1)} m/s`, 100, 44, "#10B981", 11);
      lbl(ctx, `Impulse J = ${J.toFixed(2)} N·s`, 100, 60, "#60A5FA", 10);
      lbl(ctx, `Avg Force = ${(F_avg/1000).toFixed(1)} kN`, 100, 76, "#EF4444", 10);

      lbl(ctx, `J = F×Δt = m×Δv → F = J/Δt = ${(F_avg/1000).toFixed(1)} kN`, W / 2, H - 12, "#47556977", 10);

      fr++;
      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [p]);

  return (
    <div style={WRP}>
      <div style={HDR}>
        <h3 style={H3}>🏏 Cricket Bat Impulse — J = F × Δt = m × Δv</h3>
        <p style={DESC}>The bat applies a large force over a very short contact time (≈2ms). The impulse (F × Δt) equals the change in ball's momentum. Shorter contact time with same impulse means larger peak force. <strong>J = F·Δt = Δp</strong></p>
      </div>
      <canvas ref={cvs} style={CVS} />
      <div style={CTRLS}>
        <div style={SLW}><span style={SLL}>Bat speed (m/s)</span>
          <input style={SLD} type="range" min={10} max={50} step={5} value={p.v_bat} onChange={e => setP(x => ({ ...x, v_bat: +e.target.value }))} />
          <span style={SLV}>{p.v_bat} m/s</span>
        </div>
        <div style={SLW}><span style={SLL}>Bat mass (kg)</span>
          <input style={SLD} type="range" min={0.5} max={2.5} step={0.1} value={p.m_bat} onChange={e => setP(x => ({ ...x, m_bat: +e.target.value }))} />
          <span style={SLV}>{p.m_bat} kg</span>
        </div>
      </div>
      <div style={TELE}>
        {[["Impulse J", `${t.J} N·s`], ["Avg Force", `${(t.F_avg/1000).toFixed(1)} kN`], ["Ball exit speed", `${t.v_ball} m/s`]].map(([k, v]) => (
          <div key={k} style={TV}><span style={TK}>{k}</span><span style={TP}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 22. MOMENTUM vs TIME GRAPH — LIVE DURING COLLISION
 * Tracks p₁ = m₁v₁, p₂ = m₂v₂, and p_total vs time.
 * p_total stays constant (conservation) even as individual momenta change.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_momentum_graph() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const st  = useRef({ x1: 0, x2: 0, v1: 6, v2: -2, collided: false, history: [] as {t:number; p1:number; p2:number; ptot:number}[], t: 0 });
  const raf = useRef(0);
  const [p, setP] = useState({ m1: 3, m2: 2 });
  const [t, setT] = useState({ p1: 0, p2: 0, ptot: 0 });

  useEffect(() => {
    const s = st.current;
    cancelAnimationFrame(raf.current);
    let fr = 0;
    const R1 = 18, R2 = 15;

    const reset = () => {
      s.x1 = 0; s.x2 = 160; s.v1 = 6; s.v2 = -2; s.collided = false; s.history = []; s.t = 0;
    };
    reset();

    function tick() {
      const canvas = cvs.current; if (!canvas) return;
      const r = setupCanvas(canvas); if (!r) return;
      const [ctx, W, H] = r;

      drawBg(ctx, W, H);

      /* Simulation area: top 40% */
      const simH = H * 0.38;
      /* Graph area: bottom 55% */
      const graphY = H * 0.45;
      const graphH = H - graphY - 10;

      /* Physics */
      s.t += DT;
      s.x1 += s.v1 * DT * 20;
      s.x2 += s.v2 * DT * 20;
      if (!s.collided && s.x1 + R1 >= s.x2 - R2) {
        const m1 = p.m1, m2 = p.m2;
        const u1 = s.v1, u2 = s.v2;
        s.v1 = ((m1 - m2) * u1 + 2 * m2 * u2) / (m1 + m2);
        s.v2 = ((m2 - m1) * u2 + 2 * m1 * u1) / (m1 + m2);
        s.collided = true;
      }

      const p1 = p.m1 * s.v1;
      const p2 = p.m2 * s.v2;
      const pt = p1 + p2;
      s.history.push({ t: s.t, p1, p2, ptot: pt });
      if (s.history.length > 300) s.history.shift();

      /* Draw simulation */
      ctx.fillStyle = "#0a1928"; ctx.fillRect(0, 0, W, simH);
      ctx.fillStyle = "#0f2030"; ctx.fillRect(0, simH - 4, W, 4);

      const cx1 = W * 0.2 + s.x1, cy = simH / 2;
      const cx2 = W * 0.2 + s.x2;
      ctx.beginPath(); ctx.arc(cx1, cy, R1, 0, Math.PI * 2); ctx.fillStyle = "#3B82F6"; ctx.fill();
      ctx.beginPath(); ctx.arc(cx2, cy, R2, 0, Math.PI * 2); ctx.fillStyle = "#F59E0B"; ctx.fill();
      lbl(ctx, `m₁=${p.m1} v=${s.v1.toFixed(1)}`, cx1, cy - R1 - 6, "#60A5FA", 9);
      lbl(ctx, `m₂=${p.m2} v=${s.v2.toFixed(1)}`, cx2, cy - R2 - 6, "#F59E0B", 9);
      if (s.v1 !== 0) arw(ctx, cx1, cy, cx1 + s.v1 * 8, cy, "#3B82F6", "", 2);
      if (s.v2 !== 0) arw(ctx, cx2, cy, cx2 + s.v2 * 8, cy, "#F59E0B", "", 2);

      /* Reset when off screen */
      if (cx1 > W + 40 || cx2 > W + 40 || cx1 < -40 || cx2 < -40) {
        if (fr % 40 === 0) reset();
      }

      /* Graph area */
      ctx.fillStyle = "#060d18"; ctx.fillRect(0, graphY, W, graphH);
      /* Axis */
      const ax = 36, ay = graphY + graphH - 20;
      ctx.strokeStyle = "#1e2d3d"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ax, graphY + 8); ctx.lineTo(ax, ay); ctx.lineTo(W - 8, ay); ctx.stroke();
      lbl(ctx, "t", W - 14, ay, "#475569", 9);
      lbl(ctx, "p", ax, graphY + 16, "#475569", 9);
      lbl(ctx, "Momentum vs Time", ax + (W - ax) / 2, graphY + 14, "#475569", 10);

      /* Zero line */
      const midY = (graphY + 8 + ay) / 2;
      ctx.strokeStyle = "#1e2d3d55"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(ax, midY); ctx.lineTo(W - 8, midY); ctx.stroke();
      ctx.setLineDash([]);
      lbl(ctx, "0", ax - 12, midY + 4, "#475569", 9);

      const pMax = Math.max(20, Math.abs(p.m1 * 6) + Math.abs(p.m2 * 6));
      const scaleP = (graphH - 30) / 2 / pMax;
      const scaleT = (W - ax - 10) / 5;

      /* Draw history lines */
      const drawLine = (col: string, getter: (h: typeof s.history[0]) => number) => {
        ctx.strokeStyle = col; ctx.lineWidth = 1.5;
        ctx.beginPath();
        s.history.forEach((h, i) => {
          const x = ax + h.t * scaleT;
          const y = midY - getter(h) * scaleP;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.stroke();
      };
      drawLine("#3B82F6", h => h.p1);
      drawLine("#F59E0B", h => h.p2);
      drawLine("#10B981", h => h.ptot);

      /* Legend */
      lbl(ctx, "p₁", W - 28, graphY + 30, "#60A5FA", 10);
      lbl(ctx, "p₂", W - 28, graphY + 44, "#F59E0B", 10);
      lbl(ctx, "p_total", W - 28, graphY + 58, "#10B981", 10);

      if (fr % 3 === 0) setT({ p1: +p1.toFixed(2), p2: +p2.toFixed(2), ptot: +pt.toFixed(2) });
      fr++;
      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [p]);

  return (
    <div style={WRP}>
      <div style={HDR}>
        <h3 style={H3}>📊 Momentum vs Time Graph — Live During Collision</h3>
        <p style={DESC}>Watch the real-time momentum graph as two balls collide. Individual momenta (p₁, p₂) change at collision, but their sum (p_total, green) remains perfectly constant. This is conservation of momentum. <strong>p₁ + p₂ = constant</strong></p>
      </div>
      <canvas ref={cvs} style={{ ...CVS, height: 360 }} />
      <div style={CTRLS}>
        <div style={SLW}><span style={SLL}>m₁ (kg)</span>
          <input style={SLD} type="range" min={1} max={6} step={0.5} value={p.m1} onChange={e => setP(x => ({ ...x, m1: +e.target.value }))} />
          <span style={SLV}>{p.m1}</span>
        </div>
        <div style={SLW}><span style={SLL}>m₂ (kg)</span>
          <input style={SLD} type="range" min={1} max={6} step={0.5} value={p.m2} onChange={e => setP(x => ({ ...x, m2: +e.target.value }))} />
          <span style={SLV}>{p.m2}</span>
        </div>
      </div>
      <div style={TELE}>
        {[["p₁ now", `${t.p1} kg·m/s`], ["p₂ now", `${t.p2} kg·m/s`], ["p_total", `${t.ptot} kg·m/s`]].map(([k, v]) => (
          <div key={k} style={TV}><span style={TK}>{k}</span><span style={{ ...TP, color: k === "p_total" ? "#10B981" : "#60A5FA" }}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 23. PARACHUTE DEPLOYMENT — 4 PHASES
 * Phase 1: Free fall (a ≈ g)
 * Phase 2: Drag slows (terminal velocity v_t1)
 * Phase 3: Parachute opens (sudden deceleration)
 * Phase 4: New lower terminal velocity (v_t2)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_parachute_phases() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const st  = useRef({ y: 0, v: 0, phase: 0, t: 0 });
  const raf = useRef(0);
  const [p, setP] = useState({ m: 90 });
  const [t, setT] = useState({ phase: "1 - Free fall", v: 0, a: 0 });

  useEffect(() => {
    const s = st.current;
    s.y = 0; s.v = 0; s.phase = 0; s.t = 0;
    cancelAnimationFrame(raf.current);
    let fr = 0;

    const RHO = 1.225;
    const Cd_suit = 0.7, A_suit = 0.4;   /* skydiver suit */
    const Cd_chute = 1.5, A_chute = 50;  /* parachute */

    function tick() {
      const canvas = cvs.current; if (!canvas) return;
      const r = setupCanvas(canvas); if (!r) return;
      const [ctx, W, H] = r;

      drawBg(ctx, W, H);

      const groundY = H - 40;
      const PX_PER_M = (groundY - 40) / 3000;

      /* Phase transitions */
      s.t += DT;
      if (s.phase === 0 && s.t > 3) s.phase = 1;       /* terminal v reached */
      if (s.phase === 1 && s.t > 12) s.phase = 2;      /* open parachute */
      if (s.phase === 2 && s.t > 14) s.phase = 3;      /* stable descent */

      /* Physics */
      const Cd = s.phase >= 2 ? Cd_chute : Cd_suit;
      const A  = s.phase >= 2 ? A_chute  : A_suit;
      const drag = 0.5 * RHO * Cd * A * s.v * s.v;
      const a = G - drag / p.m;
      s.v = Math.max(0, s.v + a * DT);
      s.y += s.v * DT * PX_PER_M;

      if (s.y > groundY - 40) {
        s.y = 0; s.v = 0; s.phase = 0; s.t = 0;
      }

      /* Background sky gradient */
      const grd = ctx.createLinearGradient(0, 0, 0, groundY);
      grd.addColorStop(0, "#030b1a"); grd.addColorStop(1, "#0a1e38");
      ctx.fillStyle = grd; ctx.fillRect(0, 0, W, groundY);

      /* Ground */
      ctx.fillStyle = "#0f2030"; ctx.fillRect(0, groundY, W, H - groundY);

      /* Clouds */
      [100, 200, 350].forEach(cy => {
        ctx.fillStyle = "rgba(100,120,150,0.1)";
        ctx.beginPath(); ctx.ellipse(W * 0.6, cy, 60, 18, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(W * 0.3, cy + 30, 40, 12, 0, 0, Math.PI * 2); ctx.fill();
      });

      /* Skydiver position */
      const sy = 40 + s.y;
      const sx = W / 2;

      /* Draw skydiver + chute */
      if (s.phase >= 2) {
        /* Parachute dome */
        const chuteR = 40 + (s.phase === 2 ? (s.t - 12) / 2 * 30 : 30);
        ctx.beginPath(); ctx.arc(sx, sy - chuteR * 0.5, chuteR, Math.PI, 0); ctx.closePath();
        ctx.fillStyle = "rgba(239,68,68,0.7)"; ctx.fill();
        ctx.strokeStyle = "#EF4444"; ctx.lineWidth = 1;
        /* Risers */
        [-chuteR * 0.7, -chuteR * 0.35, 0, chuteR * 0.35, chuteR * 0.7].forEach(dx => {
          ctx.beginPath(); ctx.moveTo(sx + dx, sy - chuteR * 0.5); ctx.lineTo(sx, sy + 12); ctx.stroke();
        });
      }

      /* Body */
      ctx.beginPath(); ctx.arc(sx, sy - 4, 7, 0, Math.PI * 2); ctx.fillStyle = "#FBBF24"; ctx.fill();
      pill(ctx, sx - 6, sy + 4, 12, 16, 4, s.phase >= 2 ? "#EF4444" : "#1D4ED8");
      ctx.strokeStyle = "#94A3B8"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(sx - 12, sy + 10); ctx.lineTo(sx + 12, sy + 10); ctx.stroke();

      /* Velocity indicator */
      if (s.v > 0.1) arw(ctx, sx + 24, sy, sx + 24, sy + Math.min(s.v * 2, 60), "#F59E0B", `${s.v.toFixed(1)}`, 2);

      /* Phase labels */
      const PHASES = ["1: Free Fall → accelerating", "2: Terminal Velocity (suit)", "3: Parachute Opening!", "4: New Terminal Velocity (chute)"];
      const PCOLS  = ["#EF4444", "#F59E0B", "#3B82F6", "#10B981"];
      pill(ctx, W - 230, 12, 218, 26, 6, PCOLS[s.phase] + "33");
      lbl(ctx, PHASES[s.phase], W - 121, 29, PCOLS[s.phase], 11);

      /* Speed gauge (right side) */
      const gaugeW = 16, gaugeH = groundY - 60;
      const gx = W - 25;
      pill(ctx, gx, 30, gaugeW, gaugeH, 4, "rgba(255,255,255,0.04)");
      const vFrac = Math.min(1, s.v / 60);
      pill(ctx, gx, 30 + gaugeH * (1 - vFrac), gaugeW, gaugeH * vFrac, 4, PCOLS[s.phase] + "99");
      lbl(ctx, "v", gx + 8, 22, "#475569", 9);

      /* Terminal v reference */
      const vt_suit  = Math.sqrt(2 * p.m * G / (RHO * Cd_suit * A_suit));
      const vt_chute = Math.sqrt(2 * p.m * G / (RHO * Cd_chute * A_chute));
      lbl(ctx, `v_t(suit) ≈ ${vt_suit.toFixed(0)} m/s`, 60, 24, "#F59E0B88", 10);
      lbl(ctx, `v_t(chute) ≈ ${vt_chute.toFixed(1)} m/s`, 60, 36, "#10B98188", 10);

      if (fr % 4 === 0) setT({ phase: PHASES[s.phase], v: +s.v.toFixed(1), a: +a.toFixed(2) });
      fr++;
      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [p]);

  return (
    <div style={WRP}>
      <div style={HDR}>
        <h3 style={H3}>🪂 Parachute Deployment — 4 Phases of Descent</h3>
        <p style={DESC}>Free fall → terminal velocity (Cd×A small) → parachute opens (Cd×A huge) → new lower terminal velocity. The parachute reduces terminal speed from ~55 m/s to ~6 m/s by enormously increasing drag. <strong>v_t = √(2mg / ρCdA)</strong></p>
      </div>
      <canvas ref={cvs} style={CVS} />
      <div style={CTRLS}>
        <div style={SLW}><span style={SLL}>Skydiver mass (kg)</span>
          <input style={SLD} type="range" min={50} max={130} step={5} value={p.m} onChange={e => setP(x => ({ ...x, m: +e.target.value }))} />
          <span style={SLV}>{p.m} kg</span>
        </div>
      </div>
      <div style={TELE}>
        {[["Phase", t.phase], ["Speed", `${t.v} m/s`], ["Acceleration", `${t.a} m/s²`]].map(([k, v]) => (
          <div key={k} style={TV}><span style={TK}>{k}</span><span style={{ ...TP, fontSize: 11 }}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 24. ARCHERY ARROW — BOWSTRING IMPULSE TO PROJECTILE
 * Draw length x → F = k·x (Hooke's Law) → J = F_avg × t_release
 * v_arrow = √(2E/m) where E = ½k·x² stored in bow
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_archery_launch() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const st  = useRef({ phase: "draw" as "draw" | "release" | "fly", drawProgress: 0, ax: 0, ay: 0, vx: 0, vy: 0, trail: [] as {x:number;y:number}[] });
  const raf = useRef(0);
  const [p, setP] = useState({ drawLen: 0.5, k: 500, m_arrow: 0.03 });
  const [t, setT] = useState({ v: 0, E: 0, range: 0 });

  useEffect(() => {
    const s = st.current;
    s.phase = "draw"; s.drawProgress = 0; s.trail = [];
    cancelAnimationFrame(raf.current);
    let fr = 0;

    const E = 0.5 * p.k * p.drawLen * p.drawLen;
    const v0 = Math.sqrt(2 * E / p.m_arrow);
    const range = v0 * v0 / G;

    function tick() {
      const canvas = cvs.current; if (!canvas) return;
      const r = setupCanvas(canvas); if (!r) return;
      const [ctx, W, H] = r;

      drawBg(ctx, W, H);

      const bowX = 80, bowY = H / 2;
      const groundY = H - 30;
      ctx.fillStyle = "#0f2030"; ctx.fillRect(0, groundY, W, H - groundY);

      /* Bow body */
      ctx.strokeStyle = "#92400E"; ctx.lineWidth = 4; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(bowX, bowY - 60);
      ctx.quadraticCurveTo(bowX - 20 * (s.drawProgress || 0.01), bowY, bowX, bowY + 60);
      ctx.stroke();

      /* Bowstring */
      const pullX = bowX + p.drawLen * 100 * (s.phase === "draw" ? s.drawProgress : s.phase === "fly" ? 0 : 1);
      ctx.strokeStyle = "#E5E7EB"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(bowX, bowY - 58); ctx.lineTo(pullX, bowY); ctx.lineTo(bowX, bowY + 58); ctx.stroke();

      /* Arrow */
      if (s.phase === "draw") {
        s.drawProgress = Math.min(1, s.drawProgress + 0.02);
        const arrowHead = pullX + 40;
        ctx.strokeStyle = "#94A3B8"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(pullX, bowY); ctx.lineTo(arrowHead, bowY); ctx.stroke();
        ctx.fillStyle = "#475569"; ctx.beginPath(); ctx.moveTo(arrowHead, bowY - 5); ctx.lineTo(arrowHead + 10, bowY); ctx.lineTo(arrowHead, bowY + 5); ctx.closePath(); ctx.fill();

        if (s.drawProgress >= 1) {
          s.phase = "release";
          const angle = -20 * Math.PI / 180; /* 20° upward launch */
          s.ax = bowX + 50; s.ay = bowY;
          s.vx = v0 * Math.cos(angle); s.vy = v0 * Math.sin(angle);
          s.trail = [];
        }
        lbl(ctx, `Drawing: ${(s.drawProgress * p.drawLen * 100).toFixed(0)} cm`, W / 2, 24, "#F59E0B", 11);
      } else if (s.phase === "release" || s.phase === "fly") {
        s.phase = "fly";
        s.vy += G * DT;
        s.ax += s.vx * DT * 40;
        s.ay += s.vy * DT * 40;
        s.trail.push({ x: s.ax, y: s.ay });
        if (s.trail.length > 80) s.trail.shift();

        ctx.strokeStyle = "#F59E0B77"; ctx.lineWidth = 1;
        ctx.beginPath(); s.trail.forEach((pt, i) => i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)); ctx.stroke();

        /* Arrow */
        const angle = Math.atan2(s.vy, s.vx);
        ctx.save(); ctx.translate(s.ax, s.ay); ctx.rotate(angle);
        ctx.strokeStyle = "#94A3B8"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(12, 0); ctx.stroke();
        ctx.fillStyle = "#60A5FA"; ctx.beginPath(); ctx.moveTo(12, -4); ctx.lineTo(22, 0); ctx.lineTo(12, 4); ctx.closePath(); ctx.fill();
        ctx.restore();

        if (s.ay > groundY || s.ax > W + 50) {
          s.phase = "draw"; s.drawProgress = 0; s.trail = [];
        }
      }

      /* Info box */
      pill(ctx, W - 185, 12, 173, 72, 8, "rgba(5,15,35,0.9)");
      lbl(ctx, `Draw: ${(p.drawLen * 100).toFixed(0)} cm`, W - 98, 30, "#F59E0B", 10);
      lbl(ctx, `E_stored = ${E.toFixed(1)} J`, W - 98, 46, "#60A5FA", 10);
      lbl(ctx, `v_launch = ${v0.toFixed(1)} m/s`, W - 98, 62, "#10B981", 11);
      lbl(ctx, `Range ≈ ${range.toFixed(0)} m`, W - 98, 78, "#A78BFA", 10);

      if (fr % 4 === 0) setT({ v: +v0.toFixed(1), E: +E.toFixed(1), range: +range.toFixed(0) });
      fr++;
      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [p]);

  return (
    <div style={WRP}>
      <div style={HDR}>
        <h3 style={H3}>🏹 Archery — Elastic PE to Kinetic Energy</h3>
        <p style={DESC}>Drawing the bow stores elastic potential energy (½kx²). On release, this energy converts entirely to kinetic energy of the arrow. Greater draw length → more energy stored → higher launch speed → longer range. <strong>E = ½kx² → v = √(2E/m)</strong></p>
      </div>
      <canvas ref={cvs} style={CVS} />
      <div style={CTRLS}>
        <div style={SLW}><span style={SLL}>Draw length (m)</span>
          <input style={SLD} type="range" min={0.2} max={0.8} step={0.05} value={p.drawLen} onChange={e => setP(x => ({ ...x, drawLen: +e.target.value }))} />
          <span style={SLV}>{(p.drawLen * 100).toFixed(0)} cm</span>
        </div>
        <div style={SLW}><span style={SLL}>Bow stiffness k (N/m)</span>
          <input style={SLD} type="range" min={200} max={1000} step={50} value={p.k} onChange={e => setP(x => ({ ...x, k: +e.target.value }))} />
          <span style={SLV}>{p.k} N/m</span>
        </div>
        <div style={SLW}><span style={SLL}>Arrow mass (g)</span>
          <input style={SLD} type="range" min={10} max={60} step={5} value={p.m_arrow * 1000} onChange={e => setP(x => ({ ...x, m_arrow: +e.target.value / 1000 }))} />
          <span style={SLV}>{(p.m_arrow * 1000).toFixed(0)} g</span>
        </div>
      </div>
      <div style={TELE}>
        {[["Launch speed", `${t.v} m/s`], ["Energy stored", `${t.E} J`], ["Max range (flat)", `${t.range} m`]].map(([k, v]) => (
          <div key={k} style={TV}><span style={TK}>{k}</span><span style={TP}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 25. BALLOON ROCKET CAR — NEWTON'S 3RD LAW PROPULSION
 * Air escapes backward → reaction force pushes car forward.
 * F_thrust = dm/dt × v_exit  |  a = F_thrust / m_car
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_balloon_rocket_car() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const st  = useRef({ x: 0, v: 0, air: 100 });
  const raf = useRef(0);
  const [p, setP] = useState({ v_exit: 20, dmdt: 0.01, m_car: 0.5 });
  const [t, setT] = useState({ F: 0, a: 0, v: 0, air: 100 });

  useEffect(() => {
    const s = st.current;
    s.x = 0; s.v = 0; s.air = 100;
    cancelAnimationFrame(raf.current);
    let fr = 0;

    function tick() {
      const canvas = cvs.current; if (!canvas) return;
      const r = setupCanvas(canvas); if (!r) return;
      const [ctx, W, H] = r;

      drawBg(ctx, W, H);

      /* Physics: thrust from Newton's 3rd law */
      const F_thrust = s.air > 0 ? p.dmdt * p.v_exit : 0;
      const F_drag   = 0.1 * s.v; /* simple rolling friction */
      const F_net    = F_thrust - F_drag;
      const a        = F_net / p.m_car;
      s.v = Math.max(0, s.v + a * DT);
      s.x += s.v * DT * 30;
      s.air = Math.max(0, s.air - (s.air > 0 ? p.dmdt * DT * 300 : 0));

      if (s.x > W - 60) { s.x = 0; s.v = 0; s.air = 100; }

      const groundY = H * 0.65;
      const carX = 60 + s.x;
      const carY = groundY - 28;

      /* Track */
      ctx.fillStyle = "#0f2030"; ctx.fillRect(0, groundY, W, H - groundY);
      ctx.fillStyle = "#1a3a5c"; ctx.fillRect(0, groundY - 2, W, 4);

      /* Car body */
      pill(ctx, carX - 30, carY - 16, 60, 28, 6, "#374151");
      pill(ctx, carX - 20, carY - 24, 40, 16, 5, "#4B5563");

      /* Wheels */
      [carX - 18, carX + 18].forEach(wx => {
        ctx.beginPath(); ctx.arc(wx, groundY - 12, 10, 0, Math.PI * 2);
        ctx.fillStyle = "#111827"; ctx.fill();
        ctx.strokeStyle = "#6B7280"; ctx.lineWidth = 2; ctx.stroke();
        ctx.beginPath(); ctx.arc(wx, groundY - 12, 4, 0, Math.PI * 2); ctx.fillStyle = "#374151"; ctx.fill();
      });

      /* Balloon */
      const balloonSize = 20 + (s.air / 100) * 25;
      const bx = carX, by = carY - 28 - balloonSize;
      const bg = ctx.createRadialGradient(bx - 4, by - 4, 2, bx, by, balloonSize);
      bg.addColorStop(0, "#EF4444"); bg.addColorStop(1, "#991B1B");
      ctx.beginPath(); ctx.arc(bx, by, balloonSize, 0, Math.PI * 2); ctx.fillStyle = bg; ctx.fill();
      lbl(ctx, `${s.air.toFixed(0)}%`, bx, by + 4, "#fff", 9);

      /* Air jet exhaust */
      if (s.air > 0) {
        for (let i = 0; i < 5; i++) {
          ctx.beginPath(); ctx.arc(
            carX - 32 - Math.random() * 30,
            carY - 8 + (Math.random() - 0.5) * 8, 2.5, 0, Math.PI * 2
          );
          ctx.fillStyle = `rgba(147,210,255,${0.3 + Math.random() * 0.4})`; ctx.fill();
        }
        /* Air escape arrow (action) */
        arw(ctx, carX - 30, carY - 8, carX - 30 - p.v_exit * 2, carY - 8, "#3B82F6", "Air out");
        /* Car thrust arrow (reaction) */
        arw(ctx, carX + 30, carY - 8, carX + 30 + F_thrust * 5, carY - 8, "#10B981", `F=${F_thrust.toFixed(2)}N`);
      }

      /* Speed indicator */
      lbl(ctx, `v = ${s.v.toFixed(2)} m/s`, carX, carY - 42, "#F59E0B", 11);
      lbl(ctx, "Action: Air pushed back  ←→  Reaction: Car pushed forward", W / 2, H - 12, "#47556977", 10);

      if (fr % 3 === 0) setT({ F: +F_thrust.toFixed(3), a: +a.toFixed(3), v: +s.v.toFixed(2), air: +s.air.toFixed(0) });
      fr++;
      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [p]);

  return (
    <div style={WRP}>
      <div style={HDR}>
        <h3 style={H3}>🎈 Balloon Rocket Car — Newton's 3rd Law Propulsion</h3>
        <p style={DESC}>Air escapes backward from the balloon (action). The equal and opposite reaction force pushes the car forward. Faster exit speed or higher mass flow rate means more thrust. <strong>F_thrust = (dm/dt) × v_exit</strong></p>
      </div>
      <canvas ref={cvs} style={CVS} />
      <div style={CTRLS}>
        <div style={SLW}><span style={SLL}>Air exit speed (m/s)</span>
          <input style={SLD} type="range" min={5} max={40} step={5} value={p.v_exit} onChange={e => setP(x => ({ ...x, v_exit: +e.target.value }))} />
          <span style={SLV}>{p.v_exit} m/s</span>
        </div>
        <div style={SLW}><span style={SLL}>Flow rate (kg/s)</span>
          <input style={SLD} type="range" min={0.005} max={0.05} step={0.005} value={p.dmdt} onChange={e => setP(x => ({ ...x, dmdt: +e.target.value }))} />
          <span style={SLV}>{p.dmdt.toFixed(3)}</span>
        </div>
        <div style={SLW}><span style={SLL}>Car mass (kg)</span>
          <input style={SLD} type="range" min={0.1} max={2} step={0.1} value={p.m_car} onChange={e => setP(x => ({ ...x, m_car: +e.target.value }))} />
          <span style={SLV}>{p.m_car} kg</span>
        </div>
      </div>
      <div style={TELE}>
        {[["Thrust F", `${t.F} N`], ["Acceleration", `${t.a} m/s²`], ["Car speed", `${t.v} m/s`], ["Air remaining", `${t.air}%`]].map(([k, v]) => (
          <div key={k} style={TV}><span style={TK}>{k}</span><span style={TP}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 26. TREBUCHET LAUNCH — HISTORICAL PHYSICS
 * Counterweight m1 falls → arm rotates → projectile m2 launched.
 * Energy conservation: m1·g·h1 = ½(m1+m2)·v_arm² → projectile launch
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_trebuchet() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const st  = useRef({ θ: -Math.PI * 0.4, ω: 0, released: false, px: 0, py: 0, pvx: 0, pvy: 0, trail: [] as {x:number;y:number}[] });
  const raf = useRef(0);
  const [p, setP] = useState({ m1: 100, m2: 10, L: 120 }); /* m1=counterweight, m2=projectile, L=arm px */
  const [t, setT] = useState({ v_launch: 0, range: 0 });

  useEffect(() => {
    const s = st.current;
    s.θ = -Math.PI * 0.4; s.ω = 0; s.released = false; s.trail = [];
    cancelAnimationFrame(raf.current);
    let fr = 0;

    function tick() {
      const canvas = cvs.current; if (!canvas) return;
      const r = setupCanvas(canvas); if (!r) return;
      const [ctx, W, H] = r;

      drawBg(ctx, W, H);

      const pivotX = W * 0.4, pivotY = H * 0.55;
      const groundY = H - 30;
      ctx.fillStyle = "#0f2030"; ctx.fillRect(0, groundY, W, H - groundY);

      /* Trebuchet arm physics (simplified rotational) */
      if (!s.released) {
        const L1 = p.L * 0.75; /* short arm (counterweight side) */
        const L2 = p.L * 1.25; /* long arm (projectile side) */
        const τ = p.m1 * G * L1 * Math.cos(s.θ) - p.m2 * G * L2 * Math.cos(s.θ + Math.PI);
        const I = p.m1 * L1 * L1 + p.m2 * L2 * L2;
        s.ω += (τ / I) * DT * 8;
        s.θ += s.ω * DT * 3;

        /* Release when arm passes vertical */
        if (s.θ > Math.PI * 0.1 && !s.released) {
          s.released = true;
          const L2px = p.L * 1.25;
          const vArm = s.ω * L2px;
          s.px = pivotX + L2px * Math.cos(s.θ + Math.PI);
          s.py = pivotY + L2px * Math.sin(s.θ + Math.PI);
          /* Launch direction: tangential to arm rotation */
          s.pvx = -vArm * Math.sin(s.θ + Math.PI) * 0.5;
          s.pvy = vArm * Math.cos(s.θ + Math.PI) * 0.5;
          setT({ v_launch: +(Math.sqrt(s.pvx * s.pvx + s.pvy * s.pvy)).toFixed(1), range: +(s.pvx * s.pvx * 2 / G / 0.25).toFixed(0) });
        }

        /* Draw arm */
        const L1px = p.L * 0.75;
        const L2px = p.L * 1.25;
        const ax1 = pivotX + L1px * Math.cos(s.θ);
        const ay1 = pivotY + L1px * Math.sin(s.θ);
        const ax2 = pivotX + L2px * Math.cos(s.θ + Math.PI);
        const ay2 = pivotY + L2px * Math.sin(s.θ + Math.PI);

        ctx.strokeStyle = "#92400E"; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(ax1, ay1); ctx.lineTo(ax2, ay2); ctx.stroke();

        /* Counterweight */
        ctx.beginPath(); ctx.arc(ax1, ay1, Math.sqrt(p.m1) * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "#374151"; ctx.fill();
        lbl(ctx, `${p.m1}kg`, ax1, ay1 + Math.sqrt(p.m1) * 1.5 + 10, "#6B7280", 9);

        /* Projectile on arm */
        ctx.beginPath(); ctx.arc(ax2, ay2, 8, 0, Math.PI * 2); ctx.fillStyle = "#60A5FA"; ctx.fill();

        /* Sling string */
        ctx.strokeStyle = "#E5E7EB"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(ax2, ay2); ctx.lineTo(ax2 + 15, ay2 + 20); ctx.stroke();
      } else {
        /* Projectile in flight */
        s.pvy += G * DT * 3;
        s.px += s.pvx * DT * 20;
        s.py += s.pvy * DT * 20;
        s.trail.push({ x: s.px, y: s.py });
        if (s.trail.length > 80) s.trail.shift();

        ctx.strokeStyle = "#60A5FA55"; ctx.lineWidth = 1.5;
        ctx.beginPath(); s.trail.forEach((pt, i) => i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)); ctx.stroke();

        ctx.beginPath(); ctx.arc(s.px, s.py, 8, 0, Math.PI * 2); ctx.fillStyle = "#60A5FA"; ctx.fill();

        if (s.py > groundY || s.px > W + 60) {
          s.θ = -Math.PI * 0.4; s.ω = 0; s.released = false; s.trail = [];
        }
      }

      /* Pivot */
      ctx.fillStyle = "#6B7280"; ctx.fillRect(pivotX - 6, pivotY, 12, groundY - pivotY);
      ctx.beginPath(); ctx.arc(pivotX, pivotY, 8, 0, Math.PI * 2); ctx.fillStyle = "#9CA3AF"; ctx.fill();

      lbl(ctx, "Trebuchet — Counterweight Drives Arm Rotation → Projectile Launch", W / 2, 20, "#64748B", 11);

      fr++;
      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [p]);

  return (
    <div style={WRP}>
      <div style={HDR}>
        <h3 style={H3}>⚔️ Trebuchet — Rotational Energy Converted to Projectile Launch</h3>
        <p style={DESC}>Heavy counterweight falls, rotating the arm. The long end whips the projectile upward at high speed. Energy stored in the counterweight's gravitational potential converts to kinetic energy of the projectile. <strong>m₁gh = ½(m₁+m₂)v²</strong></p>
      </div>
      <canvas ref={cvs} style={CVS} />
      <div style={CTRLS}>
        <div style={SLW}><span style={SLL}>Counterweight (kg)</span>
          <input style={SLD} type="range" min={50} max={200} step={10} value={p.m1} onChange={e => { const s = st.current; s.θ = -Math.PI*0.4; s.ω=0; s.released=false; s.trail=[]; setP(x => ({ ...x, m1: +e.target.value })); }} />
          <span style={SLV}>{p.m1} kg</span>
        </div>
        <div style={SLW}><span style={SLL}>Projectile (kg)</span>
          <input style={SLD} type="range" min={2} max={30} step={2} value={p.m2} onChange={e => { const s = st.current; s.θ = -Math.PI*0.4; s.ω=0; s.released=false; s.trail=[]; setP(x => ({ ...x, m2: +e.target.value })); }} />
          <span style={SLV}>{p.m2} kg</span>
        </div>
      </div>
      <div style={TELE}>
        {[["Launch speed", `${t.v_launch} m/s`], ["Est. range", `${t.range} m`]].map(([k, v]) => (
          <div key={k} style={TV}><span style={TK}>{k}</span><span style={TP}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 27. ROLLER COASTER — CENTRIPETAL FORCE AT LOOP
 * At top of loop: F_c = mg + N  |  N = m(v²/r) − mg
 * N = 0 when v_min = √(g·r)  (barely maintaining contact)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_roller_coaster() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [p, setP] = useState({ v_entry: 20, r: 60, m: 800 }); /* entry speed m/s, loop radius px, cart mass kg */
  const [t, setT] = useState({ N_top: 0, N_bot: 0, v_top: 0, safe: true });

  useEffect(() => {
    cancelAnimationFrame(raf.current);
    let angle = 0;

    function tick() {
      const canvas = cvs.current; if (!canvas) return;
      const r = setupCanvas(canvas); if (!r) return;
      const [ctx, W, H] = r;

      drawBg(ctx, W, H);

      const loopCX = W * 0.5, loopCY = H * 0.5;
      const rad = p.r;

      /* Track: flat approach + loop */
      ctx.strokeStyle = "#1D4ED8"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(loopCX, loopCY, rad, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, loopCY + rad); ctx.lineTo(loopCX - rad, loopCY + rad); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(loopCX + rad, loopCY + rad); ctx.lineTo(W, loopCY + rad); ctx.stroke();

      /* Ground */
      ctx.fillStyle = "#0f2030"; ctx.fillRect(0, loopCY + rad + 3, W, H - loopCY - rad);

      /* Physics: energy conservation around loop */
      /* At angle θ from bottom: h = r(1 - cosθ) above bottom of loop */
      angle += p.v_entry / (rad * 8);
      const θ = angle % (2 * Math.PI);
      const h = rad * (1 - Math.cos(θ)); /* height above bottom */
      const v2 = Math.max(0, p.v_entry * p.v_entry - 2 * G * h);
      const v = Math.sqrt(v2);

      /* Normal force at this point */
      const N = p.m * (v2 / rad - G * Math.cos(θ - Math.PI)); /* can be negative → lost contact */
      const N_top = p.m * (p.v_entry * p.v_entry / rad - G); /* simplified: at top of loop (approximate) */
      const v_min = Math.sqrt(G * rad);

      /* Cart position */
      const cx = loopCX + rad * Math.sin(θ);
      const cy = loopCY + rad * Math.cos(θ);

      /* Cart */
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(θ);
      pill(ctx, -14, -8, 28, 14, 4, N < 0 ? "#EF4444" : "#F59E0B");
      ctx.restore();

      /* Normal force arrow (toward center) */
      const fcol = N < 0 ? "#EF4444" : "#10B981";
      const fnorm = Math.min(Math.abs(N), 40000);
      const dx = loopCX - cx, dy = loopCY - cy;
      const dl = Math.sqrt(dx * dx + dy * dy);
      if (N > 0 && fnorm > 100) {
        arw(ctx, cx, cy, cx + (dx / dl) * 30, cy + (dy / dl) * 30, fcol, `N=${(N / 1000).toFixed(1)}kN`, 2);
      }

      /* Weight arrow */
      arw(ctx, cx, cy, cx, cy + 25, "#EF4444", `W`, 1.5);

      /* Safety info */
      const safe = N >= 0;
      pill(ctx, W / 2 - 110, 12, 220, 30, 8, safe ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.2)");
      lbl(ctx, safe ? `✓ Safe! N = ${Math.max(0, N / 1000).toFixed(1)} kN at top` : "✗ Lost contact! v_entry too slow", W / 2, 31, safe ? "#10B981" : "#EF4444", 12);

      pill(ctx, 8, H - 75, 200, 62, 8, "rgba(5,15,35,0.9)");
      lbl(ctx, `v_min at top = √(gr) = ${v_min.toFixed(1)} m/s`, 108, H - 58, "#F59E0B", 10);
      lbl(ctx, `Current v_entry = ${p.v_entry} m/s`, 108, H - 42, "#60A5FA", 10);
      lbl(ctx, `N_bottom = ${((p.m * p.v_entry * p.v_entry / rad + p.m * G) / 1000).toFixed(1)} kN`, 108, H - 26, "#10B981", 10);

      if (angle % (Math.PI * 2) < 0.1) setT({ N_top: +(N_top / 1000).toFixed(2), N_bot: +((p.m * p.v_entry * p.v_entry / rad + p.m * G) / 1000).toFixed(1), v_top: +v_min.toFixed(1), safe: N_top >= 0 });
      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [p]);

  return (
    <div style={WRP}>
      <div style={HDR}>
        <h3 style={H3}>🎢 Roller Coaster Loop — Centripetal Force & Normal Force</h3>
        <p style={DESC}>At the top of the loop, both gravity and normal force provide centripetal force. If speed is too low, N becomes zero (weightless) or negative (cart falls off track). <strong>N = m(v²/r) − mg at top</strong></p>
      </div>
      <canvas ref={cvs} style={CVS} />
      <div style={CTRLS}>
        <div style={SLW}><span style={SLL}>Entry speed (m/s)</span>
          <input style={SLD} type="range" min={10} max={40} step={1} value={p.v_entry} onChange={e => setP(x => ({ ...x, v_entry: +e.target.value }))} />
          <span style={SLV}>{p.v_entry} m/s</span>
        </div>
        <div style={SLW}><span style={SLL}>Loop radius (m)</span>
          <input style={SLD} type="range" min={30} max={100} step={5} value={p.r} onChange={e => setP(x => ({ ...x, r: +e.target.value }))} />
          <span style={SLV}>{p.r} px</span>
        </div>
        <div style={SLW}><span style={SLL}>Cart mass (kg)</span>
          <input style={SLD} type="range" min={200} max={2000} step={100} value={p.m} onChange={e => setP(x => ({ ...x, m: +e.target.value }))} />
          <span style={SLV}>{p.m} kg</span>
        </div>
      </div>
      <div style={TELE}>
        {[["N at top", `${t.N_top} kN`], ["N at bottom", `${t.N_bot} kN`], ["v_min safe", `${t.v_top} m/s`], ["Safe?", t.safe ? "✓ Yes" : "✗ No"]].map(([k, v]) => (
          <div key={k} style={TV}><span style={TK}>{k}</span><span style={{ ...TP, color: k === "Safe?" ? (t.safe ? "#10B981" : "#EF4444") : "#60A5FA" }}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 28. FORCE VECTOR SUPERPOSITION LAB
 * 3 forces on an object. Resultant = vector sum.
 * F_net = √(ΣFx² + ΣFy²)  |  θ_net = atan2(ΣFy, ΣFx)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function Sim_force_superposition() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [p, setP] = useState({
    F1: 40, θ1: 30,
    F2: 30, θ2: 150,
    F3: 20, θ3: 270,
  });
  const [t, setT] = useState({ Fx: 0, Fy: 0, Fnet: 0, θnet: 0 });

  useEffect(() => {
    cancelAnimationFrame(raf.current);

    const toRad = (d: number) => d * Math.PI / 180;
    const F1x = p.F1 * Math.cos(toRad(p.θ1)), F1y = -p.F1 * Math.sin(toRad(p.θ1));
    const F2x = p.F2 * Math.cos(toRad(p.θ2)), F2y = -p.F2 * Math.sin(toRad(p.θ2));
    const F3x = p.F3 * Math.cos(toRad(p.θ3)), F3y = -p.F3 * Math.sin(toRad(p.θ3));
    const Fx = F1x + F2x + F3x, Fy = F1y + F2y + F3y;
    const Fnet = Math.sqrt(Fx * Fx + Fy * Fy);
    const θnet = Math.atan2(-Fy, Fx) * 180 / Math.PI;
    setT({ Fx: +Fx.toFixed(1), Fy: +Fy.toFixed(1), Fnet: +Fnet.toFixed(1), θnet: +θnet.toFixed(1) });

    function tick() {
      const canvas = cvs.current; if (!canvas) return;
      const r = setupCanvas(canvas); if (!r) return;
      const [ctx, W, H] = r;

      drawBg(ctx, W, H);

      const cx = W / 2, cy = H / 2;
      const SCALE = 2.5;

      /* Axis */
      ctx.strokeStyle = "#1e2d3d"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx, 20); ctx.lineTo(cx, H - 20); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(20, cy); ctx.lineTo(W - 20, cy); ctx.stroke();
      lbl(ctx, "+x", W - 14, cy - 6, "#475569", 9); lbl(ctx, "-x", 14, cy - 6, "#475569", 9);
      lbl(ctx, "+y", cx + 6, 14, "#475569", 9); lbl(ctx, "-y", cx + 6, H - 14, "#475569", 9);

      /* Object */
      ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2); ctx.fillStyle = "#1e3a5f"; ctx.fill();
      ctx.strokeStyle = "#3B82F6"; ctx.lineWidth = 2; ctx.stroke();

      /* Draw 3 forces */
      [[F1x, F1y, "#60A5FA", `F₁=${p.F1}N @${p.θ1}°`], [F2x, F2y, "#A78BFA", `F₂=${p.F2}N @${p.θ2}°`], [F3x, F3y, "#34D399", `F₃=${p.F3}N @${p.θ3}°`]].forEach(([fx, fy, col, lab]) => {
        arw(ctx, cx, cy, cx + (fx as number) * SCALE, cy + (fy as number) * SCALE, col as string, lab as string, 2.5);
      });

      /* Resultant force */
      if (Fnet > 1) {
        arw(ctx, cx, cy, cx + Fx * SCALE, cy + Fy * SCALE, "#F59E0B", `F_net=${Fnet.toFixed(1)}N`, 3);
      } else {
        ctx.beginPath(); ctx.arc(cx, cy, 18, 0, Math.PI * 2); ctx.strokeStyle = "#10B981"; ctx.lineWidth = 3; ctx.stroke();
        lbl(ctx, "EQUILIBRIUM", cx, cy + 32, "#10B981", 12);
      }

      /* Component breakdown */
      pill(ctx, 8, 10, 185, 70, 8, "rgba(5,15,35,0.9)");
      lbl(ctx, `ΣFx = ${Fx.toFixed(1)} N`, 99, 28, "#60A5FA", 10);
      lbl(ctx, `ΣFy = ${Fy.toFixed(1)} N`, 99, 44, "#A78BFA", 10);
      lbl(ctx, `|F_net| = ${Fnet.toFixed(1)} N`, 99, 60, "#F59E0B", 11);
      lbl(ctx, `Direction: ${θnet.toFixed(1)}°`, 99, 76, "#94A3B8", 10);

      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [p]);

  return (
    <div style={WRP}>
      <div style={HDR}>
        <h3 style={H3}>➕ Force Superposition Lab — 3 Forces, Find the Resultant</h3>
        <p style={DESC}>Three forces act on an object simultaneously. The resultant force is the vector sum. When F_net = 0 (equilibrium), the object doesn't accelerate (Newton's 1st Law). Adjust magnitudes and angles to explore. <strong>F_net = √(ΣFx² + ΣFy²)</strong></p>
      </div>
      <canvas ref={cvs} style={CVS} />
      <div style={CTRLS}>
        {[
          ["F₁ (N)", p.F1, (v: number) => setP(x => ({ ...x, F1: v })), "#60A5FA"],
          ["θ₁ (°)", p.θ1, (v: number) => setP(x => ({ ...x, θ1: v })), "#60A5FA"],
          ["F₂ (N)", p.F2, (v: number) => setP(x => ({ ...x, F2: v })), "#A78BFA"],
          ["θ₂ (°)", p.θ2, (v: number) => setP(x => ({ ...x, θ2: v })), "#A78BFA"],
          ["F₃ (N)", p.F3, (v: number) => setP(x => ({ ...x, F3: v })), "#34D399"],
          ["θ₃ (°)", p.θ3, (v: number) => setP(x => ({ ...x, θ3: v })), "#34D399"],
        ].map(([label, val, setter, col]) => (
          <div key={label as string} style={SLW}>
            <span style={{ ...SLL, color: col as string }}>{label as string}</span>
            <input style={{ ...SLD, accentColor: col as string }} type="range"
              min={String(label).includes("θ") ? 0 : 5}
              max={String(label).includes("θ") ? 360 : 80}
              step={String(label).includes("θ") ? 5 : 5}
              value={val as number}
              onChange={e => (setter as (v: number) => void)(+e.target.value)} />
            <span style={SLV}>{val as number}</span>
          </div>
        ))}
      </div>
      <div style={TELE}>
        {[["ΣFx", `${t.Fx} N`], ["ΣFy", `${t.Fy} N`], ["|F_net|", `${t.Fnet} N`], ["Direction", `${t.θnet}°`]].map(([k, v]) => (
          <div key={k} style={TV}><span style={TK}>{k}</span><span style={{ ...TP, color: k === "|F_net|" ? "#F59E0B" : "#60A5FA" }}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}
