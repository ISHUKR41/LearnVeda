"use client";
/**
 * FILE: AdvancedSim1Extra.tsx
 * LOCATION: src/components/physics/AdvancedSim1Extra.tsx
 * PURPOSE: 9 additional professional canvas-based physics simulations for
 *          Topic 1 — Balanced & Unbalanced Forces (Class 9 Science).
 *          Each sim uses requestAnimationFrame at ~60 fps, real physics
 *          equations, interactive sliders, and educational annotations.
 * EXPORTS: AdvancedTopic1ExtraSims  (renders all 9 as scrollable cards)
 * LAST UPDATED: 2026-05-31
 */

import React, { useState, useEffect, useRef, useCallback } from "react";

/* ── Shared canvas helpers ─────────────────────────────────────────── */
function arrow(
  g: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  color: string, lw = 2.5, hs = 10,
) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 4) return;
  const ang = Math.atan2(dy, dx);
  g.save();
  g.strokeStyle = color; g.fillStyle = color; g.lineWidth = lw; g.lineCap = "round";
  const h = Math.min(hs, len * 0.35);
  g.beginPath(); g.moveTo(x1, y1);
  g.lineTo(x2 - h * 0.8 * Math.cos(ang), y2 - h * 0.8 * Math.sin(ang));
  g.stroke();
  g.beginPath();
  g.moveTo(x2, y2);
  g.lineTo(x2 - h * Math.cos(ang - 0.42), y2 - h * Math.sin(ang - 0.42));
  g.lineTo(x2 - h * Math.cos(ang + 0.42), y2 - h * Math.sin(ang + 0.42));
  g.closePath(); g.fill();
  g.restore();
}

function label(
  g: CanvasRenderingContext2D, s: string, x: number, y: number,
  color = "#e2e8f0", size = 11, align: CanvasTextAlign = "center",
) {
  g.save();
  g.font = `bold ${size}px 'Inter',sans-serif`;
  g.fillStyle = color; g.textAlign = align;
  g.fillText(s, x, y);
  g.restore();
}

function sceneBg(g: CanvasRenderingContext2D, w: number, h: number) {
  const gr = g.createLinearGradient(0, 0, 0, h);
  gr.addColorStop(0, "#0d1117"); gr.addColorStop(1, "#0b1120");
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.strokeStyle = "rgba(255,255,255,0.025)"; g.lineWidth = 1;
  for (let x = 50; x < w; x += 50) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
  for (let y = 50; y < h; y += 50) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
}

/* ── Shared card wrapper ────────────────────────────────────────────── */
function Card({ title, tag, desc, children }: {
  title: string; tag: string; desc: string; children: React.ReactNode;
}) {
  return (
    <div style={{
      background: "linear-gradient(135deg,#0f172a,#0d1b2a)",
      border: "1px solid rgba(99,102,241,0.2)",
      borderRadius: 16, padding: "22px 24px", marginBottom: 24,
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{
          background: "rgba(99,102,241,0.2)", color: "#a5b4fc", fontSize: 10,
          fontWeight: 700, letterSpacing: "0.08em", padding: "3px 9px", borderRadius: 6,
        }}>{tag}</span>
        <h3 style={{ color: "#f1f5f9", fontSize: 17, fontWeight: 800, margin: 0 }}>{title}</h3>
      </div>
      <p style={{ color: "#64748b", fontSize: 12, margin: "0 0 14px", lineHeight: 1.6 }}>{desc}</p>
      {children}
    </div>
  );
}

function Slider({
  label: lbl, value, min, max, step = 1, color = "#6366f1",
  onChange,
}: {
  label: string; value: number; min: number; max: number;
  step?: number; color?: string; onChange: (v: number) => void;
}) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
        <span style={{ color: "#94a3b8" }}>{lbl}</span>
        <span style={{ color, fontFamily: "monospace" }}>{value.toFixed(step < 1 ? 2 : 0)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: color }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E1-1 — Spring-Mass Harmonic Oscillator
 * Physics: F = −k·x  →  a = F/m  →  SHM
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_SpringMass() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [k, setK] = useState(40);
  const [mass, setMass] = useState(3);
  const ph = useRef({ x: 0.12, v: 0, t: 0 });

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;

    /* Physics — Euler integration at 60 fps */
    const dt = 0.016;
    const F = -k * s.x;
    s.v += (F / mass) * dt;
    s.x += s.v * dt;
    s.t += dt;

    /* Background */
    sceneBg(g, W, H);

    /* Ceiling */
    g.fillStyle = "#334155"; g.fillRect(0, 0, W, 18);
    label(g, "Fixed Wall", W / 2, 13, "#64748b", 10);

    /* Spring (zigzag) */
    const eq   = H * 0.28;
    const rest = 80;
    const ext  = s.x * 220;
    const x0   = W / 2, y0 = 18;
    const x1   = x0,    y1 = eq + ext;
    const coils = 10;
    const dx    = 18;
    g.strokeStyle = "#6366f1"; g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(x0, y0);
    for (let i = 0; i <= coils; i++) {
      const fy  = y0 + (y1 - y0) * (i / coils);
      const off = (i % 2 === 0 ? dx : -dx);
      g.lineTo(x0 + (i > 0 && i < coils ? off : 0), fy);
    }
    g.lineTo(x1, y1); g.stroke();

    /* Block */
    const bW = 70, bH = 50;
    const bX = x1 - bW / 2, bY = y1;
    const blockColor = "#4f46e5";
    const gr2 = g.createLinearGradient(bX, bY, bX + bW, bY + bH);
    gr2.addColorStop(0, blockColor); gr2.addColorStop(1, "#312e81");
    g.fillStyle = gr2;
    g.beginPath(); g.roundRect(bX, bY, bW, bH, 8); g.fill();
    g.strokeStyle = "#818cf8"; g.lineWidth = 1.5;
    g.beginPath(); g.roundRect(bX, bY, bW, bH, 8); g.stroke();
    label(g, `${mass} kg`, x1, bY + bH / 2 + 5, "#fff", 13);

    /* Force arrows */
    const springF = -(k * s.x);
    const grav    = mass * 9.8;
    const cx      = x1;
    const mid     = bY + bH / 2;

    /* Weight (down) */
    arrow(g, cx, bY + bH, cx, bY + bH + Math.min(grav * 1.2, 70), "#ef4444", 3, 12);
    label(g, `W=${grav.toFixed(0)}N`, cx + 50, bY + bH + 28, "#ef4444", 10, "left");

    /* Spring force */
    const sfLen = Math.min(Math.abs(springF) * 1.4, 70);
    if (Math.abs(springF) > 1) {
      const dir = springF > 0 ? -1 : 1;
      arrow(g, cx, bY, cx, bY - dir * sfLen, "#10b981", 3, 12);
      label(g, `F=${Math.abs(springF).toFixed(1)}N`, cx + 50, bY - dir * sfLen * 0.5, "#10b981", 10, "left");
    }

    /* Telemetry */
    const te = [
      { l: "Position x", v: `${(s.x * 100).toFixed(1)} cm`, c: "#818cf8" },
      { l: "Velocity v", v: `${(s.v).toFixed(3)} m/s`, c: "#22d3ee" },
      { l: "Spring F",   v: `${(springF).toFixed(2)} N`,  c: "#10b981" },
      { l: "KE",         v: `${(0.5 * mass * s.v * s.v).toFixed(2)} J`, c: "#f59e0b" },
    ];
    let ty = H - 80;
    te.forEach(({ l, v, c }) => {
      const px = W - 170;
      g.fillStyle = "rgba(15,23,42,0.75)";
      g.beginPath(); g.roundRect(px - 4, ty - 12, 165, 18, 4); g.fill();
      label(g, l, px + 2,  ty, "#64748b", 10, "left");
      label(g, v, px + 162, ty, c,        10, "right");
      ty += 20;
    });

    /* Equation */
    label(g, `F = −k·x    k=${k} N/m    T=${(2 * Math.PI * Math.sqrt(mass / k)).toFixed(2)} s`, W / 2, H - 10, "#475569", 10);

    raf.current = requestAnimationFrame(draw);
  }, [k, mass]);

  useEffect(() => { raf.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(raf.current); }, [draw]);

  return (
    <Card tag="E1-01" title="Spring-Mass Harmonic Oscillator" desc="Hooke's Law: F = −kx. The restoring force pulls the mass back toward equilibrium, creating Simple Harmonic Motion (SHM).">
      <canvas ref={cvs} width={700} height={360} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 14, padding: "14px 16px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <Slider label="Spring Constant k (N/m)" value={k} min={5} max={150} color="#818cf8" onChange={setK} />
        <Slider label="Mass (kg)" value={mass} min={0.5} max={20} step={0.5} color="#22d3ee" onChange={setMass} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E1-2 — Inclined Plane with Static / Kinetic Friction
 * Physics: N=mg·cosθ  Ff=μN  F_net=mg·sinθ−μmg·cosθ
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_Incline() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [angleDeg, setAngle] = useState(30);
  const [mu, setMu] = useState(0.35);
  const [mass, setMass] = useState(5);
  const ph = useRef({ x: 0, v: 0 });

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;
    const θ = (angleDeg * Math.PI) / 180;
    const mg = mass * 9.8;
    const N  = mg * Math.cos(θ);
    const Fg = mg * Math.sin(θ);   /* component along slope */
    const Ff = mu * N;             /* friction force */
    const Fnet = Fg - Ff;
    const a  = Fnet / mass;

    if (s.x < 2.5) {
      s.v += a * dt;
      if (s.v < 0) s.v = 0;
      s.x += s.v * dt;
    } else {
      s.x = 0; s.v = 0;
    }

    sceneBg(g, W, H);

    /* Slope */
    const base = W * 0.88, top_x = W * 0.12, ground_y = H - 50;
    const slope_y = ground_y - (base - top_x) * Math.tan(θ);
    g.fillStyle = "#1e293b";
    g.beginPath(); g.moveTo(top_x, slope_y); g.lineTo(base, ground_y); g.lineTo(top_x, ground_y); g.closePath(); g.fill();
    g.strokeStyle = "#334155"; g.lineWidth = 2;
    g.beginPath(); g.moveTo(top_x, slope_y); g.lineTo(base, ground_y); g.stroke();

    /* Angle arc */
    g.strokeStyle = "#f59e0b"; g.lineWidth = 1.5;
    g.beginPath(); g.arc(base, ground_y, 40, -Math.PI, -Math.PI + θ); g.stroke();
    label(g, `${angleDeg}°`, base - 52, ground_y - 14, "#f59e0b", 11);

    /* Block position on slope */
    const slopeLen = (base - top_x) / Math.cos(θ);
    const frac = s.x / 3;
    const bLen = 46;
    const bCX = base - Math.cos(θ) * (frac * slopeLen * 0.8 + bLen * 0.5);
    const bCY = ground_y - Math.sin(θ) * (frac * slopeLen * 0.8 + bLen * 0.5);

    g.save();
    g.translate(bCX, bCY); g.rotate(-θ);
    const gr = g.createLinearGradient(-23, -18, 23, 18);
    gr.addColorStop(0, "#7c3aed"); gr.addColorStop(1, "#4c1d95");
    g.fillStyle = gr; g.beginPath(); g.roundRect(-23, -18, 46, 36, 6); g.fill();
    g.strokeStyle = "#a78bfa"; g.lineWidth = 1.5;
    g.beginPath(); g.roundRect(-23, -18, 46, 36, 6); g.stroke();
    label(g, `${mass}kg`, 0, 6, "#fff", 12);
    g.restore();

    /* Force arrows at block center */
    const perpX = Math.sin(θ), perpY = -Math.cos(θ);
    const parX  = Math.cos(θ), parY  =  Math.sin(θ);
    const sc = 1.2;
    /* Weight */
    arrow(g, bCX, bCY, bCX, bCY + mg * sc * 0.35, "#ef4444", 2.5);
    label(g, `mg=${mg.toFixed(0)}N`, bCX + 20, bCY + mg * sc * 0.18, "#ef4444", 10, "left");
    /* Normal */
    arrow(g, bCX, bCY, bCX + perpX * N * sc * 0.35, bCY + perpY * N * sc * 0.35, "#22d3ee", 2.5);
    label(g, `N=${N.toFixed(0)}N`, bCX + perpX * N * sc * 0.35 + 5, bCY + perpY * N * sc * 0.35, "#22d3ee", 10, "left");
    /* Friction (up slope) */
    arrow(g, bCX, bCY, bCX - parX * Ff * sc * 0.35, bCY - parY * Ff * sc * 0.35, "#f59e0b", 2.5);
    label(g, `f=${Ff.toFixed(0)}N`, bCX - parX * Ff * sc * 0.35 - 40, bCY - parY * Ff * sc * 0.35 - 6, "#f59e0b", 10);
    /* Net (down slope) */
    if (Fnet > 1) {
      arrow(g, bCX, bCY, bCX + parX * Fnet * sc * 0.35, bCY + parY * Fnet * sc * 0.35, "#10b981", 3);
    }

    /* Info panel */
    const lines = [
      `Fnet = mg·sinθ − μmg·cosθ = ${Fnet.toFixed(1)} N`,
      `Acceleration = ${a.toFixed(2)} m/s²  |  v = ${s.v.toFixed(2)} m/s`,
      Fnet <= 0 ? "STATIC — block stays in place" : "SLIDING DOWN →",
    ];
    lines.forEach((ln, i) => {
      const col = i === 2 ? (Fnet <= 0 ? "#10b981" : "#ef4444") : "#94a3b8";
      label(g, ln, W / 2, H - 55 + i * 16, col, 11);
    });

    raf.current = requestAnimationFrame(draw);
  }, [angleDeg, mu, mass]);

  useEffect(() => {
    ph.current = { x: 0, v: 0 };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card tag="E1-02" title="Inclined Plane with Friction" desc="Vector decomposition on a slope. The block slides when mg·sinθ exceeds static friction μmg·cosθ.">
      <canvas ref={cvs} width={700} height={340} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <Slider label="Angle θ (°)" value={angleDeg} min={5} max={75} color="#f59e0b" onChange={setAngle} />
        <Slider label="Friction coeff μ" value={mu} min={0} max={0.9} step={0.01} color="#818cf8" onChange={setMu} />
        <Slider label="Mass (kg)" value={mass} min={1} max={30} color="#22d3ee" onChange={setMass} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E1-3 — Atwood Machine (Two masses over a pulley)
 * Physics: a = (m1−m2)g / (m1+m2),  T = 2m1m2g/(m1+m2)
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_Atwood() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [m1, setM1] = useState(6);
  const [m2, setM2] = useState(4);
  const ph = useRef({ y: 0, v: 0 });

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;
    const a = (m1 - m2) * 9.8 / (m1 + m2);
    const T = 2 * m1 * m2 * 9.8 / (m1 + m2);

    s.v += a * dt;
    s.y += s.v * dt;
    /* Clamp so masses don't fly off-screen */
    const maxDisp = 1.8;
    if (s.y > maxDisp) { s.y = maxDisp; s.v = 0; }
    if (s.y < -maxDisp) { s.y = -maxDisp; s.v = 0; }

    sceneBg(g, W, H);

    /* Pulley */
    const px = W / 2, py = 60, pr = 26;
    g.fillStyle = "#1e293b"; g.beginPath(); g.arc(px, py, pr, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#6366f1"; g.lineWidth = 3;
    g.beginPath(); g.arc(px, py, pr, 0, Math.PI * 2); g.stroke();
    g.fillStyle = "#475569"; g.beginPath(); g.arc(px, py, 8, 0, Math.PI * 2); g.fill();

    /* Rope */
    const r1x = px - pr, r2x = px + pr;
    const scale = 80;
    const y1base = py + pr + 40, y2base = py + pr + 40;
    const r1y = y1base + s.y * scale;
    const r2y = y2base - s.y * scale;
    g.strokeStyle = "#94a3b8"; g.lineWidth = 2;
    g.beginPath(); g.moveTo(r1x, py); g.lineTo(r1x, r1y); g.stroke();
    g.beginPath(); g.moveTo(r2x, py); g.lineTo(r2x, r2y); g.stroke();

    /* Masses */
    [[m1, r1x - 25, r1y, "#dc2626", "#7f1d1d", "m₁"],
     [m2, r2x - 25, r2y, "#2563eb", "#1e3a8a", "m₂"]].forEach(([m, bx, by, c1, c2, lbl]) => {
      const bH = Math.min(30 + (m as number) * 2, 70);
      const gr = g.createLinearGradient(bx as number, by as number, (bx as number) + 50, (by as number) + bH);
      gr.addColorStop(0, c1 as string); gr.addColorStop(1, c2 as string);
      g.fillStyle = gr;
      g.beginPath(); g.roundRect(bx as number, by as number, 50, bH, 6); g.fill();
      g.strokeStyle = "rgba(255,255,255,0.15)"; g.lineWidth = 1;
      g.beginPath(); g.roundRect(bx as number, by as number, 50, bH, 6); g.stroke();
      label(g, `${lbl}=${m}kg`, (bx as number) + 25, (by as number) + bH / 2 + 5, "#fff", 12);
    });

    /* Tension arrows on each mass */
    arrow(g, r1x, r1y, r1x, r1y - Math.min(T * 0.5, 80), "#10b981", 2.5);
    label(g, `T=${T.toFixed(1)}N`, r1x - 55, r1y - 20, "#10b981", 10, "right");
    arrow(g, r2x, r2y, r2x, r2y - Math.min(T * 0.5, 80), "#10b981", 2.5);

    /* Weight arrows */
    const w1len = Math.min(m1 * 9.8 * 0.5, 80);
    arrow(g, r1x, r1y + 40, r1x, r1y + 40 + w1len, "#ef4444", 2.5);
    label(g, `${(m1 * 9.8).toFixed(0)}N↓`, r1x - 55, r1y + 40 + w1len * 0.5, "#ef4444", 10, "right");
    const w2len = Math.min(m2 * 9.8 * 0.5, 80);
    arrow(g, r2x, r2y + 40, r2x, r2y + 40 + w2len, "#ef4444", 2.5);

    /* Equations */
    label(g, `a = (m₁−m₂)g / (m₁+m₂) = ${a.toFixed(2)} m/s²`, W / 2, H - 30, "#94a3b8", 11);
    label(g, `Tension T = 2m₁m₂g/(m₁+m₂) = ${T.toFixed(1)} N  |  v = ${Math.abs(s.v).toFixed(2)} m/s`, W / 2, H - 12, "#64748b", 10);

    raf.current = requestAnimationFrame(draw);
  }, [m1, m2]);

  useEffect(() => {
    ph.current = { y: 0, v: 0 };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card tag="E1-03" title="Atwood Machine" desc="Two unequal masses over a frictionless pulley. The heavier mass descends; the lighter one rises. Net force = (m₁−m₂)g.">
      <canvas ref={cvs} width={700} height={360} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <Slider label="Mass m₁ (kg)" value={m1} min={1} max={20} color="#ef4444" onChange={(v) => { setM1(v); ph.current = { y: 0, v: 0 }; }} />
        <Slider label="Mass m₂ (kg)" value={m2} min={1} max={20} color="#3b82f6" onChange={(v) => { setM2(v); ph.current = { y: 0, v: 0 }; }} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E1-4 — Centripetal Force (Ball on a String)
 * Physics: F_c = mv²/r = mω²r  (centripetal / net inward force)
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_Centripetal() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [speed, setSpeed] = useState(3);
  const [mass, setMass] = useState(2);
  const [radius, setRadius] = useState(100);
  const t = useRef(0);

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    t.current += 0.016;

    const Fc = (mass * speed * speed) / radius;
    const ω  = speed / radius;
    const θ  = ω * t.current * 60;

    sceneBg(g, W, H);

    const cx = W / 2, cy = H / 2 - 10;
    const bx = cx + radius * Math.cos(θ);
    const by = cy + radius * Math.sin(θ);

    /* Orbit path */
    g.strokeStyle = "rgba(99,102,241,0.2)"; g.lineWidth = 1;
    g.setLineDash([4, 4]);
    g.beginPath(); g.arc(cx, cy, radius, 0, Math.PI * 2); g.stroke();
    g.setLineDash([]);

    /* String */
    g.strokeStyle = "#e2e8f0"; g.lineWidth = 2;
    g.beginPath(); g.moveTo(cx, cy); g.lineTo(bx, by); g.stroke();

    /* Pivot */
    g.fillStyle = "#475569"; g.beginPath(); g.arc(cx, cy, 8, 0, Math.PI * 2); g.fill();

    /* Ball */
    const gr = g.createRadialGradient(bx - 5, by - 5, 2, bx, by, 18);
    gr.addColorStop(0, "#fbbf24"); gr.addColorStop(1, "#d97706");
    g.fillStyle = gr; g.beginPath(); g.arc(bx, by, 18, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#fcd34d"; g.lineWidth = 1.5;
    g.beginPath(); g.arc(bx, by, 18, 0, Math.PI * 2); g.stroke();
    label(g, `${mass}kg`, bx, by + 4, "#fff", 10);

    /* Centripetal force arrow (inward toward center) */
    const inX = cx - bx, inY = cy - by;
    const inLen = Math.sqrt(inX * inX + inY * inY);
    const scale = Math.min(Fc * 5, 80) / inLen;
    arrow(g, bx, by, bx + inX * scale, by + inY * scale, "#ef4444", 3, 12);
    label(g, `Fc=${Fc.toFixed(1)}N`, bx + inX * scale * 1.4, by + inY * scale * 1.4, "#ef4444", 10);

    /* Velocity arrow (tangential) */
    const vX = -Math.sin(θ) * speed * 8;
    const vY =  Math.cos(θ) * speed * 8;
    arrow(g, bx, by, bx + vX, by + vY, "#22d3ee", 2.5, 10);
    label(g, `v=${speed}m/s`, bx + vX + 8, by + vY, "#22d3ee", 10, "left");

    /* Info */
    label(g, `Fc = mv²/r = ${mass}×${speed}²/${radius}cm = ${Fc.toFixed(2)} N`, W / 2, H - 30, "#94a3b8", 11);
    label(g, `ω = ${ω.toFixed(2)} rad/s    T = ${(2 * Math.PI / ω).toFixed(2)} s`, W / 2, H - 12, "#64748b", 10);

    raf.current = requestAnimationFrame(draw);
  }, [speed, mass, radius]);

  useEffect(() => { raf.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(raf.current); }, [draw]);

  return (
    <Card tag="E1-04" title="Centripetal Force — Ball on a String" desc="The string provides centripetal force F = mv²/r, continuously changing the ball's direction. Velocity is always tangential; force is always inward.">
      <canvas ref={cvs} width={700} height={360} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <Slider label="Speed v (m/s)" value={speed} min={1} max={10} color="#22d3ee" onChange={setSpeed} />
        <Slider label="Mass (kg)" value={mass} min={0.5} max={10} step={0.5} color="#f59e0b" onChange={setMass} />
        <Slider label="Radius (px)" value={radius} min={50} max={150} color="#818cf8" onChange={setRadius} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E1-5 — Newton's Cradle (Elastic Collision Momentum Transfer)
 * Physics: Conservation of momentum + elastic collision
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_NewtonsCradle() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const N_BALLS = 5;
  const L = 120; /* string length */
  const ph = useRef(
    Array.from({ length: N_BALLS }, (_, i) => ({
      θ: i === 0 ? -0.65 : 0,
      ω: 0,
      at_rest: i !== 0,
    }))
  );

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const dt = 0.016;
    const balls = ph.current;
    const R = 16; /* ball radius */
    const gap = R * 2 + 1;
    const cx = W / 2 - (N_BALLS / 2 - 0.5) * gap;
    const topY = 80;

    /* Physics — simplified pendulum + collision detection */
    for (let i = 0; i < N_BALLS; i++) {
      const b = balls[i];
      if (!b.at_rest) {
        b.ω += (-9.8 / L) * Math.sin(b.θ) * dt * 60;
        b.ω *= 0.999; /* tiny damping */
        b.θ += b.ω * dt;
      }
    }

    /* Detect left ball reaching bottom (θ ≈ 0, moving right) */
    const lb = balls[0];
    if (lb.θ > -0.01 && lb.ω > 0.02) {
      lb.ω = 0; lb.θ = 0; lb.at_rest = true;
      /* Transfer to rightmost */
      balls[N_BALLS - 1].θ = 0; balls[N_BALLS - 1].ω = 0.65; balls[N_BALLS - 1].at_rest = false;
    }
    /* Detect right ball returning */
    const rb = balls[N_BALLS - 1];
    if (rb.θ < 0.01 && rb.ω < -0.02) {
      rb.ω = 0; rb.θ = 0; rb.at_rest = true;
      balls[0].θ = 0; balls[0].ω = -0.65; balls[0].at_rest = false;
    }

    sceneBg(g, W, H);

    /* Frame */
    g.fillStyle = "#334155"; g.fillRect(60, topY - 10, W - 120, 12);
    g.fillRect(70, topY, 8, 30);
    g.fillRect(W - 78, topY, 8, 30);

    /* Balls */
    for (let i = 0; i < N_BALLS; i++) {
      const bx = cx + i * gap;
      const by = topY + L * Math.cos(balls[i].θ);
      const tx = bx + L * Math.sin(balls[i].θ);
      const ty = topY + L * Math.cos(balls[i].θ);

      /* Strings */
      g.strokeStyle = "#94a3b8"; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(bx, topY + 2); g.lineTo(tx, ty - R); g.stroke();

      /* Ball */
      const gr = g.createRadialGradient(tx - 4, ty - 4, 2, tx, ty, R);
      gr.addColorStop(0, "#d1d5db"); gr.addColorStop(1, "#374151");
      g.fillStyle = gr; g.beginPath(); g.arc(tx, ty, R, 0, Math.PI * 2); g.fill();
      g.strokeStyle = "#9ca3af"; g.lineWidth = 1;
      g.beginPath(); g.arc(tx, ty, R, 0, Math.PI * 2); g.stroke();
    }

    /* Labels */
    label(g, "Newton's Cradle — p is conserved: p = mv", W / 2, H - 32, "#94a3b8", 11);
    label(g, "Elastic collision: momentum AND kinetic energy both conserved.", W / 2, H - 14, "#64748b", 10);

    raf.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => { raf.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(raf.current); }, [draw]);

  return (
    <Card tag="E1-05" title="Newton's Cradle — Impulse & Momentum Transfer" desc="When one ball swings down and hits the row, it stops and the last ball flies up with the same velocity. Demonstrates conservation of momentum AND kinetic energy (elastic collision).">
      <canvas ref={cvs} width={700} height={300} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E1-6 — Buoyancy & Archimedes' Principle
 * Physics: F_b = ρ_fluid · V_submerged · g
 *          Net F = Weight − Buoyancy
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_Buoyancy() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [density, setDensity] = useState(800); /* object density kg/m³ */
  const [volume, setVolume]   = useState(0.5);  /* m³ */
  const ph = useRef({ y: 0, v: 0 });

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;
    const rhoFluid = 1000; /* water kg/m³ */
    const mass = density * volume;
    const weight = mass * 9.8;

    /* Water surface level */
    const waterY = H * 0.35;
    const tankH  = H - waterY - 30;

    /* Geometry */
    const bSize = Math.cbrt(volume) * 120; /* visual size from volume */
    const bX    = W / 2 - bSize / 2;
    /* When fully submerged, buoyancy = full; when above water, = partial */
    const dispFrac = Math.min(Math.max((s.y + bSize * 0.5) / bSize, 0), 1);
    const Fb     = rhoFluid * volume * dispFrac * 9.8;
    const Fnet   = weight - Fb;
    s.v += (Fnet / mass) * dt;
    s.v *= 0.985;
    s.y += s.v * dt;
    /* Floor */
    const floorY = H - 55 - bSize;
    if (s.y > floorY) { s.y = floorY; s.v = 0; }
    /* Surface cap — don't allow leaving tank */
    const topCap = waterY - bSize - 60;
    if (s.y < topCap) { s.y = topCap; s.v = -s.v * 0.4; }

    sceneBg(g, W, H);

    /* Tank */
    g.strokeStyle = "#475569"; g.lineWidth = 2;
    g.beginPath(); g.moveTo(W * 0.2, waterY); g.lineTo(W * 0.2, H - 30); g.lineTo(W * 0.8, H - 30); g.lineTo(W * 0.8, waterY); g.stroke();

    /* Water fill */
    const waterGr = g.createLinearGradient(0, waterY, 0, H);
    waterGr.addColorStop(0, "rgba(59,130,246,0.35)"); waterGr.addColorStop(1, "rgba(29,78,216,0.55)");
    g.fillStyle = waterGr;
    g.fillRect(W * 0.2 + 2, waterY, W * 0.6 - 4, H - waterY - 30);

    /* Water surface shimmer */
    g.strokeStyle = "rgba(147,197,253,0.5)"; g.lineWidth = 2;
    g.beginPath(); g.moveTo(W * 0.2 + 2, waterY); g.lineTo(W * 0.8 - 2, waterY); g.stroke();
    label(g, "Water  ρ = 1000 kg/m³", W / 2, waterY + 18, "rgba(147,197,253,0.7)", 10);

    /* Object block */
    const by = waterY + s.y;
    const col = density < 1000 ? "#059669" : "#dc2626";
    const gr2 = g.createLinearGradient(bX, by, bX + bSize, by + bSize);
    gr2.addColorStop(0, col + "dd"); gr2.addColorStop(1, col + "88");
    g.fillStyle = gr2;
    g.beginPath(); g.roundRect(bX, by, bSize, bSize, 8); g.fill();
    g.strokeStyle = "rgba(255,255,255,0.2)"; g.lineWidth = 1.5;
    g.beginPath(); g.roundRect(bX, by, bSize, bSize, 8); g.stroke();
    label(g, `ρ=${density}`, W / 2, by + bSize / 2 - 8, "#fff", 11);
    label(g, `${mass.toFixed(1)}kg`, W / 2, by + bSize / 2 + 10, "#fff", 11);

    /* Arrows */
    const mid = by + bSize / 2;
    /* Buoyancy (up) */
    const fbLen = Math.min(Fb * 0.3, 100);
    arrow(g, W / 2, by, W / 2, by - fbLen, "#22d3ee", 3, 12);
    label(g, `Fb=${Fb.toFixed(0)}N`, W / 2 - 60, by - fbLen * 0.5, "#22d3ee", 10, "right");
    /* Weight (down) */
    const wLen = Math.min(weight * 0.3, 100);
    arrow(g, W / 2, by + bSize, W / 2, by + bSize + wLen, "#ef4444", 3, 12);
    label(g, `W=${weight.toFixed(0)}N`, W / 2 + 8, by + bSize + wLen * 0.5, "#ef4444", 10, "left");

    /* Result */
    const status = density < 1000 ? "FLOATS" : density === 1000 ? "NEUTRAL" : "SINKS";
    const statusCol = density < 1000 ? "#10b981" : density === 1000 ? "#f59e0b" : "#ef4444";
    label(g, status, W * 0.8 + 30, waterY + 60, statusCol, 16);
    label(g, `Fb=${Fb.toFixed(1)}N  W=${weight.toFixed(1)}N`, W / 2, H - 30, "#94a3b8", 11);
    label(g, `Archimedes: F_b = ρ·V·g  (${dispFrac < 1 ? (dispFrac * 100).toFixed(0) + "% submerged" : "fully submerged"})`, W / 2, H - 12, "#64748b", 10);

    raf.current = requestAnimationFrame(draw);
  }, [density, volume]);

  useEffect(() => {
    ph.current = { y: 0, v: 0 };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card tag="E1-06" title="Buoyancy — Archimedes' Principle" desc="Objects denser than water sink; less dense ones float. Buoyant force = weight of fluid displaced = ρ·V·g.">
      <canvas ref={cvs} width={700} height={380} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <Slider label="Object Density (kg/m³)" value={density} min={200} max={2000} color="#22d3ee"
          onChange={(v) => { setDensity(v); ph.current = { y: 0, v: 0 }; }} />
        <Slider label="Object Volume (m³×10)" value={volume} min={0.1} max={2} step={0.1} color="#818cf8"
          onChange={(v) => { setVolume(v); ph.current = { y: 0, v: 0 }; }} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E1-7 — Three-Block Contact Forces
 * Physics: F_net on whole system = F − (total friction)
 *          Contact forces propagate through touching objects
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_ContactForces() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [F, setF] = useState(90);
  const [mu, setMu] = useState(0.1);
  const ph = useRef({ x: 0, v: 0 });

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;
    const masses = [4, 8, 6]; /* kg */
    const totalM = masses.reduce((a, b) => a + b, 0);
    const Ff = mu * totalM * 9.8;
    const Fnet = F - Ff;
    const a = Fnet / totalM;
    /* Contact forces */
    const F_AB = (masses[1] + masses[2]) * a + mu * (masses[1] + masses[2]) * 9.8;
    const F_BC = masses[2] * a + mu * masses[2] * 9.8;

    s.v += a * dt;
    if (s.v < 0) s.v = 0;
    s.x += s.v * dt * 30;
    if (s.x > W - 50) { s.x = 0; s.v = 0; }

    sceneBg(g, W, H);

    /* Ground */
    g.fillStyle = "#1e293b"; g.fillRect(0, H * 0.58, W, 4);
    label(g, "μ = " + mu.toFixed(2) + "  (friction coefficient)", W / 2, H * 0.58 + 15, "#475569", 10);

    /* Blocks */
    const colors  = ["#2563eb", "#d97706", "#16a34a"];
    const bColors = ["#1d4ed8", "#92400e", "#14532d"];
    const labels  = ["A\n4kg", "B\n8kg", "C\n6kg"];
    const bH = 52, bW = 80;
    let bx = 60 + s.x;

    colors.forEach((col, i) => {
      const by = H * 0.58 - bH;
      const gr = g.createLinearGradient(bx, by, bx + bW, by + bH);
      gr.addColorStop(0, col); gr.addColorStop(1, bColors[i]);
      g.fillStyle = gr;
      g.beginPath(); g.roundRect(bx, by, bW, bH, 8); g.fill();
      g.strokeStyle = "rgba(255,255,255,0.15)"; g.lineWidth = 1.5;
      g.beginPath(); g.roundRect(bx, by, bW, bH, 8); g.stroke();
      label(g, `${["A","B","C"][i]}`, bx + bW / 2, by + 20, "#fff", 13);
      label(g, `${masses[i]}kg`, bx + bW / 2, by + 36, "#fff", 11);
      bx += bW + 4;
    });

    /* Applied force arrow */
    const ax = 60 + s.x - 5;
    const aY = H * 0.58 - bH / 2;
    arrow(g, ax - 80, aY, ax, aY, "#10b981", 3.5, 14);
    label(g, `F=${F}N`, ax - 80, aY - 12, "#10b981", 12);

    /* Contact force arrows (between blocks) */
    const c1x = 60 + s.x + bW;
    const c2x = 60 + s.x + bW * 2 + 4;
    const cy2 = H * 0.58 - bH / 2;
    arrow(g, c1x + 4, cy2, c1x + 4 + Math.min(F_AB * 0.3, 60), cy2, "#f59e0b", 2.5, 10);
    label(g, `F_AB=${F_AB.toFixed(0)}N`, c1x + 40, cy2 - 14, "#f59e0b", 10);
    arrow(g, c2x + 4, cy2, c2x + 4 + Math.min(F_BC * 0.3, 60), cy2, "#a78bfa", 2.5, 10);
    label(g, `F_BC=${F_BC.toFixed(0)}N`, c2x + 40, cy2 - 14, "#a78bfa", 10);

    /* Info */
    label(g, `System: F_net = F − μMg = ${Fnet.toFixed(1)} N   a = ${a.toFixed(2)} m/s²   v = ${s.v.toFixed(2)} m/s`, W / 2, H - 20, "#94a3b8", 11);

    raf.current = requestAnimationFrame(draw);
  }, [F, mu]);

  useEffect(() => {
    ph.current = { x: 0, v: 0 };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card tag="E1-07" title="Three-Block System — Contact Forces" desc="When a force pushes a chain of blocks, each contact point transmits a different force. The rearmost block 'feels' the most force; contact forces decrease toward the front.">
      <canvas ref={cvs} width={700} height={280} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <Slider label="Applied Force F (N)" value={F} min={0} max={300} color="#10b981" onChange={setF} />
        <Slider label="Friction coeff μ" value={mu} min={0} max={0.6} step={0.02} color="#f59e0b" onChange={setMu} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E1-8 — Bridge Cable Tension Analysis
 * Physics: Tension T = W / (2·sinθ)  where θ = cable angle from horizontal
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_BridgeTension() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [load, setLoad] = useState(5000);
  const [angle, setAngle] = useState(30);
  const ph = useRef({ bounce: 0, dir: 1 });

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    s.bounce += 0.04 * s.dir;
    if (Math.abs(s.bounce) > 1) s.dir *= -1;

    const θ = (angle * Math.PI) / 180;
    const T = load / (2 * Math.sin(θ));
    const grav = load * 9.8;

    sceneBg(g, W, H);

    /* Road deck */
    const roadY = H * 0.62 + s.bounce;
    const lx = W * 0.12, rx = W * 0.88;
    g.fillStyle = "#374151"; g.fillRect(lx, roadY, rx - lx, 14);
    g.fillStyle = "#4b5563"; g.fillRect(lx, roadY + 2, rx - lx, 4);

    /* Towers */
    const t1x = W * 0.3, t2x = W * 0.7;
    const tH  = 130;
    [[t1x], [t2x]].forEach(([tx]) => {
      g.fillStyle = "#374151"; g.fillRect(tx - 10, roadY - tH, 20, tH);
      g.fillStyle = "#334155"; g.fillRect(tx - 14, roadY - tH - 10, 28, 14);
    });

    /* Cables */
    const cTopY = roadY - tH;
    const midX  = W / 2, midY = roadY - 4;
    [[t1x, cTopY, lx, midY], [t2x, cTopY, rx, midY]].forEach(([ax, ay, bx, by]) => {
      g.strokeStyle = "#f59e0b"; g.lineWidth = 2.5;
      g.beginPath(); g.moveTo(ax as number, ay as number); g.lineTo(midX, midY); g.stroke();
      /* Catenary visual */
      g.strokeStyle = "#fbbf24"; g.lineWidth = 1.5; g.setLineDash([4, 3]);
      g.beginPath(); g.moveTo(ax as number, ay as number); g.quadraticCurveTo(midX, midY + 40, midX, midY); g.stroke();
      g.setLineDash([]);
    });

    /* Load (truck) */
    const trX = midX - 28, trY = roadY - 30;
    g.fillStyle = "#dc2626"; g.beginPath(); g.roundRect(trX, trY, 56, 26, 4); g.fill();
    g.fillStyle = "#991b1b"; g.fillRect(trX + 4, trY + 18, 48, 10);
    label(g, `${load.toFixed(0)} kg`, midX, roadY - 14, "#fff", 11);

    /* Weight arrow */
    arrow(g, midX, roadY + 14, midX, roadY + 14 + Math.min(grav * 0.003, 90), "#ef4444", 3, 12);
    label(g, `W=${(grav / 1000).toFixed(1)} kN`, midX + 8, roadY + 64, "#ef4444", 10, "left");

    /* Tension arrows along cables */
    const tLen = Math.min(T * 0.0015, 90);
    const dir1 = { x: t1x - midX, y: cTopY - midY };
    const d1   = Math.sqrt(dir1.x ** 2 + dir1.y ** 2);
    arrow(g, midX, midY, midX + dir1.x / d1 * tLen, midY + dir1.y / d1 * tLen, "#22d3ee", 2.5, 10);
    arrow(g, midX, midY, midX - dir1.x / d1 * tLen, midY + dir1.y / d1 * tLen, "#22d3ee", 2.5, 10);
    label(g, `T=${(T / 1000).toFixed(1)} kN`, midX - dir1.x / d1 * tLen - 10, midY + dir1.y / d1 * tLen + 12, "#22d3ee", 10);

    /* Angle arc */
    g.strokeStyle = "#a78bfa"; g.lineWidth = 1.5;
    g.beginPath(); g.arc(t1x, cTopY, 35, 0, Math.PI / 2 - θ + 0.05); g.stroke();
    label(g, `${angle}°`, t1x + 40, cTopY + 22, "#a78bfa", 10, "left");

    label(g, `T = W / (2·sinθ) = ${(grav / 1000).toFixed(1)} / (2·sin${angle}°) = ${(T / 1000).toFixed(2)} kN`, W / 2, H - 18, "#94a3b8", 11);

    raf.current = requestAnimationFrame(draw);
  }, [load, angle]);

  useEffect(() => { raf.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(raf.current); }, [draw]);

  return (
    <Card tag="E1-08" title="Bridge Cable Tension" desc="Suspension bridge cables must carry tension T = W/(2·sinθ). Shallower cables (small θ) → much higher tension. Engineering challenge: angle vs tension vs sag.">
      <canvas ref={cvs} width={700} height={340} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <Slider label="Load (kg)" value={load} min={1000} max={20000} step={500} color="#ef4444" onChange={setLoad} />
        <Slider label="Cable Angle θ (°)" value={angle} min={8} max={60} color="#a78bfa" onChange={setAngle} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E1-9 — Air Drag vs Applied Force (Terminal Velocity)
 * Physics: F_drag = ½·ρ·Cd·A·v²   Net F = F_applied − W − F_drag
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_AirDrag() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [thrust, setThrust] = useState(300);
  const [mass, setMass]     = useState(10);
  const [Cd, setCd]         = useState(0.4);
  const ph = useRef({ v: 0, y: 0.5, trail: [] as { y: number }[] });

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;
    const rho = 1.225; /* air density */
    const A   = 0.5;   /* cross-section m² */
    const drag = 0.5 * rho * Cd * A * s.v * s.v;
    const weight = mass * 9.8;
    const Fnet = thrust - weight - drag;
    s.v += (Fnet / mass) * dt;
    if (s.v < 0) s.v = 0;
    /* Move the rocket up */
    s.y -= s.v * dt * 0.03;
    if (s.y < 0.05) s.y = 0.95;

    s.trail.push({ y: s.y * H });
    if (s.trail.length > 60) s.trail.shift();

    sceneBg(g, W, H);

    /* Sky gradient */
    const sky = g.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "rgba(2,6,23,0)");
    sky.addColorStop(1, "rgba(12,74,110,0.25)");
    g.fillStyle = sky; g.fillRect(0, 0, W, H);

    /* Trail */
    if (s.trail.length > 2) {
      g.strokeStyle = "rgba(249,115,22,0.5)"; g.lineWidth = 2;
      g.beginPath();
      s.trail.forEach((p, i) => {
        if (i === 0) g.moveTo(W * 0.5, p.y); else g.lineTo(W * 0.5, p.y);
      });
      g.stroke();
    }

    /* Rocket body */
    const ry = s.y * H;
    const rx = W / 2;
    /* Nose cone */
    g.fillStyle = "#dc2626";
    g.beginPath(); g.moveTo(rx, ry - 28); g.lineTo(rx - 12, ry); g.lineTo(rx + 12, ry); g.closePath(); g.fill();
    /* Body */
    const gr2 = g.createLinearGradient(rx - 12, ry, rx + 12, ry + 40);
    gr2.addColorStop(0, "#6b7280"); gr2.addColorStop(1, "#374151");
    g.fillStyle = gr2; g.fillRect(rx - 12, ry, 24, 40);
    /* Fins */
    g.fillStyle = "#475569";
    g.beginPath(); g.moveTo(rx - 12, ry + 30); g.lineTo(rx - 26, ry + 50); g.lineTo(rx - 12, ry + 45); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(rx + 12, ry + 30); g.lineTo(rx + 26, ry + 50); g.lineTo(rx + 12, ry + 45); g.closePath(); g.fill();
    /* Exhaust */
    if (s.v > 1) {
      g.fillStyle = "rgba(251,146,60,0.7)";
      g.beginPath(); g.ellipse(rx, ry + 48, 8 + s.v * 0.3, 18 + s.v * 0.8, 0, 0, Math.PI * 2); g.fill();
    }

    /* Force arrows */
    const scale = 0.15;
    arrow(g, rx + 20, ry, rx + 20, ry - Math.min(thrust * scale, 100), "#10b981", 3, 12);
    label(g, `Thrust=${thrust}N`, rx + 28, ry - 40, "#10b981", 10, "left");
    arrow(g, rx + 20, ry + 40, rx + 20, ry + 40 + Math.min(weight * scale, 60), "#ef4444", 3, 12);
    label(g, `W=${weight.toFixed(0)}N`, rx + 28, ry + 55, "#ef4444", 10, "left");
    arrow(g, rx - 20, ry, rx - 20, ry + Math.min(drag * scale, 80), "#f59e0b", 3, 12);
    label(g, `Drag=${drag.toFixed(0)}N`, rx - 28, ry + 35, "#f59e0b", 10, "right");

    /* Telemetry */
    const termV = Math.sqrt((thrust - weight) / (0.5 * rho * Cd * A));
    label(g, `v = ${s.v.toFixed(2)} m/s   Fnet = ${Fnet.toFixed(1)} N`, W / 2, H - 30, "#94a3b8", 11);
    label(g, `Terminal velocity = ${termV > 0 ? termV.toFixed(1) : "N/A"} m/s  (when Fnet → 0)`, W / 2, H - 12, "#64748b", 10);

    raf.current = requestAnimationFrame(draw);
  }, [thrust, mass, Cd]);

  useEffect(() => { raf.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(raf.current); }, [draw]);

  return (
    <Card tag="E1-09" title="Air Drag & Terminal Velocity" desc="F_drag = ½ρCdAv². As speed increases, drag grows until it balances thrust. The rocket reaches terminal velocity when net force = 0.">
      <canvas ref={cvs} width={700} height={380} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <Slider label="Thrust (N)" value={thrust} min={50} max={1000} color="#10b981" onChange={setThrust} />
        <Slider label="Mass (kg)" value={mass} min={1} max={40} color="#22d3ee" onChange={setMass} />
        <Slider label="Drag Coeff Cd" value={Cd} min={0.05} max={2} step={0.05} color="#f59e0b" onChange={setCd} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * MAIN EXPORT — renders all 9 extra simulations
 * ══════════════════════════════════════════════════════════════════════ */
export function AdvancedTopic1ExtraSims() {
  return (
    <div style={{ marginTop: 32 }}>
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, padding: "14px 20px", background: "linear-gradient(90deg,rgba(99,102,241,0.12),rgba(16,185,129,0.08))", borderRadius: 12, border: "1px solid rgba(99,102,241,0.2)" }}>
        <div style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc", fontSize: 11, fontWeight: 800, padding: "5px 12px", borderRadius: 8, whiteSpace: "nowrap", letterSpacing: "0.06em" }}>
          EXTRA SIMS 1–9
        </div>
        <div>
          <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 15 }}>
            Topic 1 — Extended Simulation Lab
          </div>
          <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>
            Spring-Mass · Inclined Plane · Atwood Machine · Centripetal Force · Newton&apos;s Cradle · Buoyancy · Contact Forces · Bridge Tension · Air Drag
          </div>
        </div>
      </div>

      <Sim_SpringMass />
      <Sim_Incline />
      <Sim_Atwood />
      <Sim_Centripetal />
      <Sim_NewtonsCradle />
      <Sim_Buoyancy />
      <Sim_ContactForces />
      <Sim_BridgeTension />
      <Sim_AirDrag />
    </div>
  );
}
