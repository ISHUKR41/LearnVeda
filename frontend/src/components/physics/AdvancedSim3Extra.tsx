"use client";
/**
 * FILE: AdvancedSim3Extra.tsx
 * LOCATION: src/components/physics/AdvancedSim3Extra.tsx
 * PURPOSE: 9 additional professional canvas-based physics simulations for
 *          Topic 3 — Newton's Second Law (F = ma) (Class 9 Science).
 *          Demonstrates that force = mass × acceleration in varied real-world scenarios.
 * EXPORTS: AdvancedTopic3ExtraSims
 * LAST UPDATED: 2026-05-31
 */

import React, { useState, useEffect, useRef, useCallback } from "react";

/* ── Shared helpers ──────────────────────────────────────────────────── */
function arrow(g: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, lw = 2.5, hs = 10) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy);
  if (len < 4) return;
  const ang = Math.atan2(dy, dx), h = Math.min(hs, len * 0.35);
  g.save(); g.strokeStyle = color; g.fillStyle = color; g.lineWidth = lw; g.lineCap = "round";
  g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2 - h * 0.8 * Math.cos(ang), y2 - h * 0.8 * Math.sin(ang)); g.stroke();
  g.beginPath(); g.moveTo(x2, y2);
  g.lineTo(x2 - h * Math.cos(ang - 0.42), y2 - h * Math.sin(ang - 0.42));
  g.lineTo(x2 - h * Math.cos(ang + 0.42), y2 - h * Math.sin(ang + 0.42));
  g.closePath(); g.fill(); g.restore();
}
function lbl(g: CanvasRenderingContext2D, s: string, x: number, y: number, color = "#e2e8f0", size = 11, align: CanvasTextAlign = "center") {
  g.save(); g.font = `bold ${size}px 'Inter',sans-serif`; g.fillStyle = color; g.textAlign = align; g.fillText(s, x, y); g.restore();
}
function bg(g: CanvasRenderingContext2D, w: number, h: number) {
  const gr = g.createLinearGradient(0, 0, 0, h);
  gr.addColorStop(0, "#0d1117"); gr.addColorStop(1, "#0b1120");
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.strokeStyle = "rgba(255,255,255,0.022)"; g.lineWidth = 1;
  for (let x = 50; x < w; x += 50) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
  for (let y = 50; y < h; y += 50) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
}
function Card({ title, tag, desc, children }: { title: string; tag: string; desc: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "linear-gradient(135deg,#0f172a,#0d1b2a)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 16, padding: "22px 24px", marginBottom: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{ background: "rgba(245,158,11,0.18)", color: "#fcd34d", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", padding: "3px 9px", borderRadius: 6 }}>{tag}</span>
        <h3 style={{ color: "#f1f5f9", fontSize: 17, fontWeight: 800, margin: 0 }}>{title}</h3>
      </div>
      <p style={{ color: "#64748b", fontSize: 12, margin: "0 0 14px", lineHeight: 1.6 }}>{desc}</p>
      {children}
    </div>
  );
}
function Sld({ label: l, value, min, max, step = 1, color = "#f59e0b", onChange }: { label: string; value: number; min: number; max: number; step?: number; color?: string; onChange: (v: number) => void }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
        <span style={{ color: "#94a3b8" }}>{l}</span>
        <span style={{ color, fontFamily: "monospace" }}>{value.toFixed(step < 1 ? 2 : 0)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ width: "100%", accentColor: color }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E3-1 — Variable Force Rocket Launch (F = ma)
 * Thrust changes with slider; acceleration = (Thrust − Weight)/mass
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_RocketFma() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [thrust, setThrust] = useState(4000);
  const [mass, setMass]     = useState(200);
  const ph = useRef({ y: 0, v: 0, trail: [] as number[] });

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;
    const W_gravity = mass * 9.8;
    const Fnet = thrust - W_gravity;
    const a    = Fnet / mass;
    s.v += a * dt; if (s.v < 0) s.v = 0;
    s.y -= s.v * dt * 0.6;
    if (s.y < -H * 0.2) s.y = H * 0.85;
    s.trail.push(s.y);
    if (s.trail.length > 80) s.trail.shift();

    bg(g, W, H);

    /* Sky gradient */
    const sky = g.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "rgba(2,6,23,0.9)"); sky.addColorStop(1, "rgba(12,74,110,0.3)");
    g.fillStyle = sky; g.fillRect(0, 0, W, H);

    /* Ground */
    g.fillStyle = "#1e293b"; g.fillRect(0, H * 0.88, W, H * 0.12);
    lbl(g, "Launch Pad", W / 2, H * 0.88 + 14, "#475569", 10);

    /* Trail */
    const rx = W * 0.45;
    s.trail.forEach((ty, i) => {
      const alpha = (i / s.trail.length) * 0.6;
      g.fillStyle = `rgba(251,146,60,${alpha})`;
      g.beginPath(); g.ellipse(rx, ty + H * 0.88, 5 - i * 0.05, 8 - i * 0.08, 0, 0, Math.PI * 2); g.fill();
    });

    /* Rocket */
    const ry = H * 0.88 + s.y;
    const rx2 = rx;
    g.fillStyle = "#dc2626"; g.beginPath(); g.moveTo(rx2, ry - 36); g.lineTo(rx2 - 14, ry); g.lineTo(rx2 + 14, ry); g.closePath(); g.fill();
    const bodyGr = g.createLinearGradient(rx2 - 14, ry, rx2 + 14, ry + 48);
    bodyGr.addColorStop(0, "#94a3b8"); bodyGr.addColorStop(1, "#475569");
    g.fillStyle = bodyGr; g.fillRect(rx2 - 14, ry, 28, 48);
    g.fillStyle = "#0ea5e9"; g.fillRect(rx2 - 10, ry + 8, 20, 22);
    g.fillStyle = "#475569";
    g.beginPath(); g.moveTo(rx2 - 14, ry + 38); g.lineTo(rx2 - 28, ry + 60); g.lineTo(rx2 - 14, ry + 50); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(rx2 + 14, ry + 38); g.lineTo(rx2 + 28, ry + 60); g.lineTo(rx2 + 14, ry + 50); g.closePath(); g.fill();
    /* Exhaust */
    if (Fnet > 0) {
      g.fillStyle = "rgba(251,146,60,0.7)"; g.beginPath(); g.ellipse(rx2, ry + 58, 10, 22 + s.v * 0.8, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = "rgba(253,224,71,0.5)"; g.beginPath(); g.ellipse(rx2, ry + 62, 5, 12, 0, 0, Math.PI * 2); g.fill();
    }

    /* Force arrows */
    const sc = 0.012;
    arrow(g, rx2 + 35, ry + 24, rx2 + 35, ry + 24 - Math.min(thrust * sc, 120), "#10b981", 3, 12);
    lbl(g, `T=${thrust}N↑`, rx2 + 44, ry + 24 - Math.min(thrust * sc, 120) * 0.5, "#10b981", 10, "left");
    arrow(g, rx2 + 35, ry + 24, rx2 + 35, ry + 24 + Math.min(W_gravity * sc, 100), "#ef4444", 3, 12);
    lbl(g, `W=${W_gravity.toFixed(0)}N↓`, rx2 + 44, ry + 24 + Math.min(W_gravity * sc, 100) * 0.5, "#ef4444", 10, "left");
    if (Math.abs(Fnet) > 10) {
      arrow(g, rx2 - 44, ry + 24, rx2 - 44, ry + 24 - Fnet * sc * 0.8, Fnet > 0 ? "#22d3ee" : "#f97316", 2.5, 10);
      lbl(g, `Fnet=${Fnet.toFixed(0)}N`, rx2 - 52, ry, Fnet > 0 ? "#22d3ee" : "#f97316", 9, "right");
    }

    lbl(g, `F = ma:  a = (T−W)/m = (${thrust}−${W_gravity.toFixed(0)})/${mass} = ${a.toFixed(2)} m/s²`, W / 2, H - 22, "#94a3b8", 11);
    lbl(g, `Current velocity: ${s.v.toFixed(1)} m/s   |   ${a > 0 ? "ASCENDING" : a < 0 ? "DECELERATING" : "HOVERING"}`, W / 2, H - 6, "#64748b", 10);

    raf.current = requestAnimationFrame(draw);
  }, [thrust, mass]);

  useEffect(() => {
    ph.current = { y: 0, v: 0, trail: [] };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card tag="E3-01" title="Rocket Launch — F = ma in Action" desc="a = (Thrust − Weight) / mass. Increasing thrust or decreasing mass both increase acceleration. Below 1g thrust, the rocket can't even lift off!">
      <canvas ref={cvs} width={700} height={380} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <Sld label="Rocket Thrust (N)" value={thrust} min={500} max={10000} step={100} color="#10b981" onChange={setThrust} />
        <Sld label="Rocket Mass (kg)" value={mass} min={50} max={500} step={10} color="#ef4444" onChange={(v) => { setMass(v); ph.current = { y: 0, v: 0, trail: [] }; }} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E3-2 — Mass vs Acceleration (Same Force, Different Masses)
 * F=ma → a = F/m: Double mass, half acceleration
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_MassVsAcceleration() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [force, setForce] = useState(100);
  const masses = [2, 5, 10, 20];
  const ph = useRef(masses.map(() => ({ x: 0, v: 0 })));

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const dt = 0.016;
    const rows = ph.current;
    rows.forEach((r, i) => {
      const a = force / masses[i];
      r.v += a * dt;
      r.x += r.v * dt * 3;
      if (r.x > W - 100) r.x = 0;
    });

    bg(g, W, H);

    const rowH = (H - 60) / 4;
    const colors = ["#ef4444", "#f59e0b", "#10b981", "#6366f1"];

    rows.forEach((r, i) => {
      const y = 30 + i * rowH + rowH / 2;
      const a = force / masses[i];
      /* Track */
      g.fillStyle = "#0f172a"; g.fillRect(60, y - 22, W - 120, 44);
      g.strokeStyle = colors[i] + "33"; g.lineWidth = 1; g.strokeRect(60, y - 22, W - 120, 44);
      /* Block */
      const bx = 60 + r.x * 0.9;
      const bW = 50 + masses[i] * 2, bH = 34;
      const bGr = g.createLinearGradient(bx, y - bH / 2, bx + bW, y + bH / 2);
      bGr.addColorStop(0, colors[i] + "dd"); bGr.addColorStop(1, colors[i] + "66");
      g.fillStyle = bGr; g.beginPath(); g.roundRect(bx, y - bH / 2, bW, bH, 7); g.fill();
      lbl(g, `${masses[i]}kg`, bx + bW / 2, y + 5, "#fff", 12);
      /* Force arrow */
      arrow(g, 40, y, bx - 4, y, colors[i], 2.5, 10);
      lbl(g, `F=${force}N`, 20, y - 14, colors[i], 9);
      /* Velocity */
      arrow(g, bx + bW, y, bx + bW + Math.min(r.v * 2.5, 100), y, "#22d3ee", 2, 8);
      /* Stats on right */
      lbl(g, `a=${a.toFixed(2)}m/s²  v=${r.v.toFixed(1)}m/s`, W - 8, y - 5, colors[i], 10, "right");
    });

    lbl(g, `F=${force} N applied to 4 blocks. Same force, different masses → different accelerations (a = F/m)`, W / 2, H - 12, "#94a3b8", 11);

    raf.current = requestAnimationFrame(draw);
  }, [force]);

  useEffect(() => {
    ph.current = masses.map(() => ({ x: 0, v: 0 }));
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card tag="E3-02" title="Mass vs Acceleration — Same Force" desc="F = ma → a = F/m. Applying the same force to heavier masses produces smaller accelerations. The lightest mass accelerates fastest!">
      <canvas ref={cvs} width={700} height={280} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <Sld label="Applied Force F (N)" value={force} min={10} max={400} color="#f59e0b" onChange={(v) => { setForce(v); ph.current = masses.map(() => ({ x: 0, v: 0 })); }} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E3-3 — Free Fall with and without Air Resistance
 * Without drag: a=g=9.8 m/s².  With drag: a=g−(½ρCdAv²)/m
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_FreeFall() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [mass, setMass]   = useState(1);
  const [Cd, setCd]       = useState(0.5);
  const ph = useRef({ yVac: 0, vVac: 0, yDrag: 0, vDrag: 0 });

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;
    const rho = 1.225, A = 0.05;
    const scale = 22;
    const groundPx = H - 50;

    /* Vacuum */
    if (s.yVac < groundPx - 28) {
      s.vVac += 9.8 * dt;
      s.yVac += s.vVac * dt * scale;
    }
    /* With drag */
    if (s.yDrag < groundPx - 28) {
      const drag = 0.5 * rho * Cd * A * s.vDrag * s.vDrag;
      s.vDrag += (9.8 - drag / mass) * dt;
      s.yDrag += s.vDrag * dt * scale;
    }

    bg(g, W, H);

    /* Ground */
    g.fillStyle = "#1e293b"; g.fillRect(0, groundPx, W, H - groundPx);
    lbl(g, "Ground", W / 2, groundPx + 14, "#475569", 10);

    /* Column dividers */
    lbl(g, "VACUUM", W * 0.25, 26, "#22d3ee", 12);
    lbl(g, "(no air resistance)", W * 0.25, 42, "#475569", 9);
    lbl(g, "WITH AIR DRAG", W * 0.75, 26, "#f59e0b", 12);
    lbl(g, `Cd=${Cd.toFixed(1)}  A=0.05m²`, W * 0.75, 42, "#475569", 9);
    g.strokeStyle = "#1e293b"; g.lineWidth = 1; g.setLineDash([4, 4]);
    g.beginPath(); g.moveTo(W / 2, 0); g.lineTo(W / 2, groundPx); g.stroke();
    g.setLineDash([]);

    /* Balls */
    const vR = 18, dR = 18;
    const vx = W * 0.25, dx = W * 0.75;
    const vyc = 60 + s.yVac, dyc = 60 + s.yDrag;

    /* Vacuum ball */
    const vGr = g.createRadialGradient(vx - 5, vyc - 5, 2, vx, vyc, vR);
    vGr.addColorStop(0, "#22d3ee"); vGr.addColorStop(1, "#0369a1");
    g.fillStyle = vGr; g.beginPath(); g.arc(vx, vyc, vR, 0, Math.PI * 2); g.fill();
    lbl(g, `${mass}kg`, vx, vyc + 4, "#fff", 10);
    arrow(g, vx, vyc + vR, vx, vyc + vR + Math.min(s.vVac * 3, 80), "#22d3ee", 2.5, 8);
    lbl(g, `${s.vVac.toFixed(1)}m/s`, vx + 24, vyc + vR + 20, "#22d3ee", 9, "left");

    /* Drag ball */
    const dGr = g.createRadialGradient(dx - 5, dyc - 5, 2, dx, dyc, dR);
    dGr.addColorStop(0, "#f59e0b"); dGr.addColorStop(1, "#b45309");
    g.fillStyle = dGr; g.beginPath(); g.arc(dx, dyc, dR, 0, Math.PI * 2); g.fill();
    lbl(g, `${mass}kg`, dx, dyc + 4, "#fff", 10);
    arrow(g, dx, dyc + dR, dx, dyc + dR + Math.min(s.vDrag * 3, 80), "#f59e0b", 2.5, 8);
    lbl(g, `${s.vDrag.toFixed(1)}m/s`, dx + 24, dyc + dR + 20, "#f59e0b", 9, "left");

    /* Drag force annotation */
    const dragN = 0.5 * rho * Cd * A * s.vDrag * s.vDrag;
    arrow(g, dx, dyc - dR, dx, dyc - dR - Math.min(dragN * 4, 60), "#ef4444", 2, 8);
    lbl(g, `Fd=${dragN.toFixed(2)}N`, dx + 24, dyc - dR - 20, "#ef4444", 9, "left");

    /* Terminal velocity line */
    const vTerm = Math.sqrt((mass * 9.8) / (0.5 * rho * Cd * A));
    lbl(g, `Terminal v = ${vTerm.toFixed(1)} m/s`, dx, groundPx - 60, "#10b981", 10);

    /* Reset when both hit ground */
    if (s.yVac >= groundPx - 28 && s.yDrag >= groundPx - 28) {
      setTimeout(() => { ph.current = { yVac: 0, vVac: 0, yDrag: 0, vDrag: 0 }; }, 1500);
    }

    lbl(g, "Vacuum: a=g=9.8m/s² (constant)    |    With Drag: a decreases as v increases → terminal velocity", W / 2, H - 14, "#94a3b8", 10);

    raf.current = requestAnimationFrame(draw);
  }, [mass, Cd]);

  useEffect(() => {
    ph.current = { yVac: 0, vVac: 0, yDrag: 0, vDrag: 0 };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card tag="E3-03" title="Free Fall — Vacuum vs Air Resistance" desc="In vacuum all objects fall identically at g=9.8 m/s². Air resistance creates a drag force F=½ρCdAv², giving terminal velocity when drag = weight.">
      <canvas ref={cvs} width={700} height={360} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <Sld label="Object Mass (kg)" value={mass} min={0.1} max={20} step={0.1} color="#22d3ee" onChange={(v) => { setMass(v); ph.current = { yVac: 0, vVac: 0, yDrag: 0, vDrag: 0 }; }} />
        <Sld label="Drag Coefficient Cd" value={Cd} min={0.05} max={2} step={0.05} color="#f59e0b" onChange={(v) => { setCd(v); ph.current = { yVac: 0, vVac: 0, yDrag: 0, vDrag: 0 }; }} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E3-4 — Elevator Acceleration (Apparent Weight Changes)
 * F = ma: In accelerating elevator, apparent weight ≠ real weight
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_Elevator() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [mode, setMode] = useState<"up" | "down" | "const">("const");
  const [mass, setMass] = useState(60);
  const ph = useRef({ y: 240, v: 0, scaleReading: 60 * 9.8 });

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;
    const elevAcc = mode === "up" ? 3 : mode === "down" ? -3 : 0;
    s.v += elevAcc * dt; s.v = Math.max(-8, Math.min(8, s.v));
    s.y -= s.v * dt * 12;
    if (s.y < 60)  s.y = 60;
    if (s.y > 300) s.y = 300;

    const realW = mass * 9.8;
    const N     = mass * (9.8 + elevAcc); /* normal force = apparent weight */
    s.scaleReading = N;

    bg(g, W, H);

    /* Building floors */
    for (let fl = 0; fl < 7; fl++) {
      const fy = H - fl * 60;
      g.strokeStyle = "#1e293b"; g.lineWidth = 1;
      g.beginPath(); g.moveTo(W * 0.1, fy); g.lineTo(W * 0.9, fy); g.stroke();
      lbl(g, `Floor ${fl}`, W * 0.08, fy - 4, "#334155", 9, "right");
    }

    /* Elevator shaft */
    g.fillStyle = "#0f172a"; g.fillRect(W * 0.35, 30, W * 0.3, H - 50);
    g.strokeStyle = "#1e293b"; g.lineWidth = 2;
    g.strokeRect(W * 0.35, 30, W * 0.3, H - 50);

    /* Guide rails */
    g.strokeStyle = "#334155"; g.lineWidth = 3;
    g.beginPath(); g.moveTo(W * 0.36, 30); g.lineTo(W * 0.36, H - 30); g.stroke();
    g.beginPath(); g.moveTo(W * 0.64, 30); g.lineTo(W * 0.64, H - 30); g.stroke();

    /* Elevator car */
    const eX = W * 0.38, eW = W * 0.24, eH = 80;
    const eY = s.y;
    g.fillStyle = "#1e40af";
    g.beginPath(); g.roundRect(eX, eY - eH, eW, eH, 8); g.fill();
    g.strokeStyle = "#3b82f6"; g.lineWidth = 2;
    g.beginPath(); g.roundRect(eX, eY - eH, eW, eH, 8); g.stroke();
    /* Door */
    g.strokeStyle = "#93c5fd"; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(eX + eW / 2, eY - eH + 10); g.lineTo(eX + eW / 2, eY - 5); g.stroke();

    /* Person on scale */
    const px = eX + eW / 2, py = eY - 40;
    g.fillStyle = "#fca5a5"; g.beginPath(); g.arc(px, py - 20, 10, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#f87171"; g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(px, py - 10); g.lineTo(px, py + 10); g.stroke();
    g.beginPath(); g.moveTo(px - 10, py); g.lineTo(px + 10, py); g.stroke();
    g.beginPath(); g.moveTo(px, py + 10); g.lineTo(px - 8, py + 22); g.stroke();
    g.beginPath(); g.moveTo(px, py + 10); g.lineTo(px + 8, py + 22); g.stroke();

    /* Scale */
    g.fillStyle = "#0f172a"; g.beginPath(); g.roundRect(px - 18, eY - 14, 36, 12, 4); g.fill();
    g.strokeStyle = "#10b981"; g.lineWidth = 1; g.strokeRect(px - 18, eY - 14, 36, 12);
    lbl(g, `${(s.scaleReading / 9.8).toFixed(1)}kg`, px, eY - 5, "#10b981", 8);

    /* Force arrows on person */
    arrow(g, px + 30, py, px + 30, py + Math.min(realW * 0.06, 50), "#ef4444", 2.5, 10);
    lbl(g, `W=${realW.toFixed(0)}N`, px + 38, py + 28, "#ef4444", 9, "left");
    arrow(g, px + 30, py, px + 30, py - Math.min(N * 0.06, 70), "#10b981", 2.5, 10);
    lbl(g, `N=${N.toFixed(0)}N`, px + 38, py - 30, "#10b981", 9, "left");

    /* Status */
    const statusText = mode === "up" ? "Accelerating UP → feels heavier!" : mode === "down" ? "Accelerating DOWN → feels lighter!" : "Constant speed → feels normal";
    const statusColor = mode === "up" ? "#10b981" : mode === "down" ? "#f59e0b" : "#94a3b8";
    lbl(g, statusText, W / 2, 18, statusColor, 12);

    lbl(g, `N = m(g + a) = ${mass}(9.8 + ${elevAcc}) = ${N.toFixed(0)} N   |   Scale reads: ${(N / 9.8).toFixed(1)} kg`, W / 2, H - 14, "#94a3b8", 11);

    raf.current = requestAnimationFrame(draw);
  }, [mode, mass]);

  useEffect(() => {
    ph.current = { y: 240, v: 0, scaleReading: mass * 9.8 };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw, mass]);

  return (
    <Card tag="E3-04" title="Elevator — Apparent Weight (N = m(g+a))" desc="When the elevator accelerates upward, the floor pushes harder → you feel heavier. When accelerating downward, normal force decreases → feel lighter. F = ma governs the change.">
      <canvas ref={cvs} width={700} height={380} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 12, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b", alignItems: "end" }}>
        <Sld label="Person Mass (kg)" value={mass} min={30} max={150} color="#fcd34d" onChange={setMass} />
        {(["up", "const", "down"] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid", borderColor: mode === m ? "#f59e0b" : "#334155", background: mode === m ? "rgba(245,158,11,0.15)" : "#1e293b", color: mode === m ? "#fcd34d" : "#64748b", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
            {m === "up" ? "▲ Accel Up" : m === "down" ? "▼ Accel Down" : "= Constant"}
          </button>
        ))}
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E3-5 — Two-Mass Pulley System (Connected via String)
 * a = (m1·g − m2·g − friction) / (m1 + m2)
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_TwoMassPulley() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [m1, setM1] = useState(8);
  const [m2, setM2] = useState(4);
  const [mu, setMu] = useState(0.2);
  const ph = useRef({ y: 0, v: 0 });

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;
    /* m1 on horizontal surface, m2 hanging */
    const a = (m2 * 9.8 - mu * m1 * 9.8) / (m1 + m2);
    const T = m2 * (9.8 - a);
    s.v += a * dt; if (s.v < 0) s.v = 0;
    s.y += s.v * dt;
    if (s.y > 2) { s.y = 0; s.v = 0; }

    bg(g, W, H);

    /* Table */
    const tableY = H * 0.45;
    g.fillStyle = "#1e293b"; g.fillRect(40, tableY, W * 0.6, 14);

    /* Pulley */
    const px = W * 0.6, py = tableY - 4;
    g.fillStyle = "#475569"; g.beginPath(); g.arc(px, py, 18, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#6366f1"; g.lineWidth = 2; g.beginPath(); g.arc(px, py, 18, 0, Math.PI * 2); g.stroke();
    g.fillStyle = "#334155"; g.beginPath(); g.arc(px, py, 6, 0, Math.PI * 2); g.fill();

    /* m1 block (horizontal) */
    const bxOffset = s.y * 80;
    const m1x = 80 + bxOffset;
    const m1y = tableY - 40;
    const m1W = 60 + m1 * 2;
    const m1Gr = g.createLinearGradient(m1x, m1y, m1x + m1W, m1y + 36);
    m1Gr.addColorStop(0, "#1d4ed8"); m1Gr.addColorStop(1, "#1e3a8a");
    g.fillStyle = m1Gr; g.beginPath(); g.roundRect(m1x, m1y, m1W, 36, 7); g.fill();
    g.strokeStyle = "#3b82f6"; g.lineWidth = 1.5; g.beginPath(); g.roundRect(m1x, m1y, m1W, 36, 7); g.stroke();
    lbl(g, `m₁=${m1}kg`, m1x + m1W / 2, m1y + 20, "#fff", 12);

    /* String */
    g.strokeStyle = "#94a3b8"; g.lineWidth = 2;
    g.beginPath(); g.moveTo(m1x + m1W, tableY - 22); g.lineTo(px, py); g.stroke();
    g.beginPath(); g.moveTo(px + 1, py + 18); g.lineTo(px + 1, tableY + 30 + s.y * 80); g.stroke();

    /* m2 block (hanging) */
    const m2y = tableY + 30 + s.y * 80;
    const m2H = 30 + m2 * 2;
    const m2Gr = g.createLinearGradient(px - 25, m2y, px + 25, m2y + m2H);
    m2Gr.addColorStop(0, "#d97706"); m2Gr.addColorStop(1, "#92400e");
    g.fillStyle = m2Gr; g.beginPath(); g.roundRect(px - 25, m2y, 50, m2H, 7); g.fill();
    g.strokeStyle = "#fbbf24"; g.lineWidth = 1.5; g.beginPath(); g.roundRect(px - 25, m2y, 50, m2H, 7); g.stroke();
    lbl(g, `m₂=${m2}kg`, px, m2y + m2H / 2 + 5, "#fff", 12);

    /* Tension arrows */
    arrow(g, m1x + m1W, tableY - 22, m1x + m1W + 35, tableY - 22, "#10b981", 2.5, 10);
    lbl(g, `T=${T.toFixed(1)}N`, m1x + m1W + 24, tableY - 34, "#10b981", 9);
    arrow(g, px, m2y, px, m2y - 30, "#10b981", 2.5, 10);
    /* Weight */
    arrow(g, px, m2y + m2H, px, m2y + m2H + Math.min(m2 * 9.8 * 0.4, 60), "#ef4444", 2.5, 10);
    /* Friction */
    if (mu > 0) {
      arrow(g, m1x, tableY - 22, m1x - Math.min(mu * m1 * 9.8 * 0.35, 50), tableY - 22, "#f59e0b", 2.5, 10);
      lbl(g, `f=${(mu * m1 * 9.8).toFixed(1)}N`, m1x - 30, tableY - 36, "#f59e0b", 9);
    }

    lbl(g, `a = (m₂g − μm₁g)/(m₁+m₂) = ${a.toFixed(2)} m/s²   T = ${T.toFixed(1)} N   v = ${s.v.toFixed(2)} m/s`, W / 2, H - 14, "#94a3b8", 11);

    raf.current = requestAnimationFrame(draw);
  }, [m1, m2, mu]);

  useEffect(() => {
    ph.current = { y: 0, v: 0 };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card tag="E3-05" title="Two-Mass Pulley — F = ma with Constraints" desc="m₂ hanging pulls m₁ along the surface. a = (m₂g − μm₁g)/(m₁+m₂). Friction opposes motion; the net force drives both masses.">
      <canvas ref={cvs} width={700} height={320} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <Sld label="m₁ (surface, kg)" value={m1} min={1} max={20} color="#3b82f6" onChange={(v) => { setM1(v); ph.current = { y: 0, v: 0 }; }} />
        <Sld label="m₂ (hanging, kg)" value={m2} min={1} max={20} color="#f59e0b" onChange={(v) => { setM2(v); ph.current = { y: 0, v: 0 }; }} />
        <Sld label="Friction μ" value={mu} min={0} max={0.8} step={0.02} color="#a78bfa" onChange={setMu} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E3-6 — Net Force Vector Addition (Multiple Forces)
 * Find resultant of up to 4 forces; a = F_net/m
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_NetForce() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [f1, setF1] = useState(80), [a1, setA1] = useState(0);
  const [f2, setF2] = useState(60), [a2, setA2] = useState(90);
  const [f3, setF3] = useState(40), [a3, setA3] = useState(200);
  const [mass, setMass] = useState(10);
  const ph = useRef({ x: 0, y: 0, vx: 0, vy: 0 });

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;
    const toRad = (d: number) => d * Math.PI / 180;
    const fx = f1 * Math.cos(toRad(a1)) + f2 * Math.cos(toRad(a2)) + f3 * Math.cos(toRad(a3));
    const fy = -(f1 * Math.sin(toRad(a1)) + f2 * Math.sin(toRad(a2)) + f3 * Math.sin(toRad(a3)));
    const ax = fx / mass, ay = fy / mass;
    s.vx += ax * dt; s.vy += ay * dt;
    s.vx *= 0.992; s.vy *= 0.992;
    s.x += s.vx * dt * 30; s.y += s.vy * dt * 30;
    /* Boundary */
    if (Math.abs(s.x) > W * 0.35) s.x = 0;
    if (Math.abs(s.y) > H * 0.35) s.y = 0;

    bg(g, W, H);

    const cx = W / 2, cy = H / 2;

    /* Grid lines */
    g.strokeStyle = "rgba(255,255,255,0.04)"; g.lineWidth = 1;
    for (let x = 0; x < W; x += 60) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
    for (let y = 0; y < H; y += 60) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }

    /* Object position */
    const ox = cx + s.x, oy = cy + s.y;

    /* Individual force arrows */
    const colors = ["#ef4444", "#10b981", "#f59e0b"];
    [[f1, a1], [f2, a2], [f3, a3]].forEach(([f, a], i) => {
      const sc = 0.6;
      const dx = (f as number) * Math.cos(toRad(a as number)) * sc;
      const dy = -(f as number) * Math.sin(toRad(a as number)) * sc;
      arrow(g, ox, oy, ox + dx, oy + dy, colors[i], 2.5, 10);
      lbl(g, `F${i + 1}=${f}N`, ox + dx + 6, oy + dy, colors[i], 9, "left");
    });

    /* Net force (resultant) */
    const nsc = 0.6;
    arrow(g, ox, oy, ox + fx * nsc, oy + fy * nsc, "#a78bfa", 3.5, 14);
    lbl(g, `Fnet=${Math.sqrt(fx * fx + fy * fy).toFixed(1)}N`, ox + fx * nsc + 6, oy + fy * nsc - 6, "#a78bfa", 11, "left");

    /* Object */
    const gr2 = g.createRadialGradient(ox - 6, oy - 6, 3, ox, oy, 22);
    gr2.addColorStop(0, "#6366f1"); gr2.addColorStop(1, "#3730a3");
    g.fillStyle = gr2; g.beginPath(); g.arc(ox, oy, 22, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#818cf8"; g.lineWidth = 2; g.beginPath(); g.arc(ox, oy, 22, 0, Math.PI * 2); g.stroke();
    lbl(g, `${mass}kg`, ox, oy + 4, "#fff", 10);

    lbl(g, `Fx=${fx.toFixed(1)}N  Fy=${-fy.toFixed(1)}N  |Fnet|=${Math.sqrt(fx * fx + fy * fy).toFixed(1)}N  a=${(Math.sqrt(ax * ax + ay * ay)).toFixed(2)}m/s²`, W / 2, H - 14, "#94a3b8", 10);

    raf.current = requestAnimationFrame(draw);
  }, [f1, a1, f2, a2, f3, a3, mass]);

  useEffect(() => { raf.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(raf.current); }, [draw]);

  return (
    <Card tag="E3-06" title="Net Force Vector Addition" desc="Multiple forces acting on an object combine (vector addition) to give a net force. a = F_net/m. The object accelerates in the direction of the resultant.">
      <canvas ref={cvs} width={700} height={320} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <div><Sld label="F₁ (N)" value={f1} min={0} max={150} color="#ef4444" onChange={setF1} /><Sld label="F₁ dir (°)" value={a1} min={0} max={359} color="#ef4444" onChange={setA1} /></div>
        <div><Sld label="F₂ (N)" value={f2} min={0} max={150} color="#10b981" onChange={setF2} /><Sld label="F₂ dir (°)" value={a2} min={0} max={359} color="#10b981" onChange={setA2} /></div>
        <div><Sld label="F₃ (N)" value={f3} min={0} max={150} color="#f59e0b" onChange={setF3} /><Sld label="F₃ dir (°)" value={a3} min={0} max={359} color="#f59e0b" onChange={setA3} /></div>
        <div><Sld label="Mass (kg)" value={mass} min={1} max={50} color="#a78bfa" onChange={setMass} /></div>
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E3-7 — Impulse & Force-Time Relationship (J = F·Δt = Δp)
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_Impulse() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [F, setF]      = useState(200);
  const [dt_ms, setDt] = useState(100); /* contact time in ms */
  const [mass, setMass] = useState(5);
  const ph = useRef({ x: 60, v: 0, hit: false, hitTimer: 0 });

  const doHit = () => { ph.current.hit = true; ph.current.hitTimer = 0; ph.current.x = 60; ph.current.v = 0; };

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;
    const J = F * (dt_ms / 1000);
    const Δv = J / mass;

    if (s.hit) {
      s.hitTimer += dt;
      if (s.hitTimer < dt_ms / 1000) {
        s.v += (F / mass) * dt;
      }
      s.x += s.v * dt * 40;
      if (s.x > W - 40) { s.x = 60; s.v = 0; s.hit = false; }
    }

    bg(g, W, H);

    /* Floor */
    g.fillStyle = "#1e293b"; g.fillRect(0, H * 0.62, W, H);

    /* Ball */
    const bR = 20;
    const ballGr = g.createRadialGradient(s.x - 5, H * 0.62 - bR - 5, 3, s.x, H * 0.62 - bR, bR);
    ballGr.addColorStop(0, "#22d3ee"); ballGr.addColorStop(1, "#0369a1");
    g.fillStyle = ballGr; g.beginPath(); g.arc(s.x, H * 0.62 - bR, bR, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#7dd3fc"; g.lineWidth = 1.5; g.beginPath(); g.arc(s.x, H * 0.62 - bR, bR, 0, Math.PI * 2); g.stroke();
    lbl(g, `${mass}kg`, s.x, H * 0.62 - bR + 4, "#fff", 9);

    /* Force during contact */
    if (s.hit && s.hitTimer < dt_ms / 1000) {
      arrow(g, s.x - bR - 60, H * 0.62 - bR, s.x - bR, H * 0.62 - bR, "#10b981", 4, 14);
      lbl(g, `${F}N`, s.x - bR - 50, H * 0.62 - bR - 16, "#10b981", 12);
      /* Contact flash */
      g.fillStyle = "rgba(16,185,129,0.2)"; g.beginPath(); g.arc(s.x, H * 0.62 - bR, bR + 8, 0, Math.PI * 2); g.fill();
    }

    /* Velocity arrow */
    if (s.v > 0.5) {
      arrow(g, s.x + bR, H * 0.62 - bR, s.x + bR + Math.min(s.v * 3, 100), H * 0.62 - bR, "#f59e0b", 2.5, 10);
      lbl(g, `${s.v.toFixed(1)}m/s`, s.x + bR + 20, H * 0.62 - bR - 14, "#f59e0b", 10);
    }

    /* Info panel */
    const lines = [
      { l: "Impulse J = F·Δt", v: `${J.toFixed(2)} N·s`, c: "#10b981" },
      { l: "Δv = J/m", v: `${Δv.toFixed(2)} m/s`, c: "#22d3ee" },
      { l: "Contact time", v: `${dt_ms} ms`, c: "#f59e0b" },
      { l: "Peak v", v: `${Δv.toFixed(2)} m/s`, c: "#a78bfa" },
    ];
    lines.forEach(({ l: ll, v, c }, i) => {
      const px = W - 200;
      g.fillStyle = "rgba(15,23,42,0.75)"; g.beginPath(); g.roundRect(px - 4, 30 + i * 22 - 12, 185, 18, 4); g.fill();
      lbl(g, ll, px + 2, 30 + i * 22, "#64748b", 10, "left");
      lbl(g, v, px + 180, 30 + i * 22, c, 10, "right");
    });

    lbl(g, "J = F·Δt = Δp = m·Δv    Short contact time → high peak force for same impulse (like karate chop!)", W / 2, H - 14, "#94a3b8", 10);

    raf.current = requestAnimationFrame(draw);
  }, [F, dt_ms, mass]);

  useEffect(() => {
    ph.current = { x: 60, v: 0, hit: false, hitTimer: 0 };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card tag="E3-07" title="Impulse — J = F·Δt = m·Δv" desc="Impulse = change in momentum. Same impulse can be achieved with large force for short time OR small force for long time. This is why air bags work!">
      <canvas ref={cvs} width={700} height={280} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b", alignItems: "end" }}>
        <Sld label="Force F (N)" value={F} min={50} max={1000} color="#10b981" onChange={setF} />
        <Sld label="Contact Time (ms)" value={dt_ms} min={10} max={500} step={10} color="#f59e0b" onChange={setDt} />
        <Sld label="Mass (kg)" value={mass} min={1} max={20} color="#22d3ee" onChange={setMass} />
        <button onClick={doHit} style={{ padding: "12px 20px", borderRadius: 8, background: "#2563eb", color: "#fff", border: "none", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>⚡ HIT!</button>
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E3-8 — Drag Racing: Same Engine, Different Masses
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_DragRace() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [engineForce, setForce] = useState(8000);
  const cars = [
    { mass: 800, color: "#ef4444", label: "800kg" },
    { mass: 1200, color: "#f59e0b", label: "1200kg" },
    { mass: 1800, color: "#10b981", label: "1800kg" },
  ];
  const ph = useRef(cars.map(() => ({ x: 60, v: 0 })));

  const reset = () => { ph.current = cars.map(() => ({ x: 60, v: 0 })); };

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const dt = 0.016;
    const finishX = W - 80;
    ph.current.forEach((car, i) => {
      if (car.x < finishX) {
        const drag = 0.5 * 1.225 * 0.35 * 2.2 * car.v * car.v;
        const a = (engineForce - drag) / cars[i].mass;
        car.v += a * dt;
        car.x += car.v * dt * 0.5;
      }
    });

    bg(g, W, H);

    /* Track */
    g.fillStyle = "#111827"; g.fillRect(0, 0, W, H);
    /* Lanes */
    for (let i = 0; i < 3; i++) {
      const laneY = 50 + i * 90;
      g.fillStyle = "#1f2937"; g.fillRect(0, laneY + 10, W, 72);
      g.strokeStyle = "#374151"; g.lineWidth = 1;
      g.beginPath(); g.moveTo(0, laneY + 10); g.lineTo(W, laneY + 10); g.stroke();
      g.beginPath(); g.moveTo(0, laneY + 82); g.lineTo(W, laneY + 82); g.stroke();
      /* Lane markings */
      for (let x = 80; x < W; x += 80) {
        g.fillStyle = "#fbbf24"; g.fillRect(x, laneY + 44, 40, 4);
      }
    }

    /* Finish line */
    for (let i = 0; i < 20; i++) {
      g.fillStyle = i % 2 === 0 ? "#fff" : "#000";
      g.fillRect(finishX, 60 + i * 13, 16, 13);
    }
    lbl(g, "FINISH", finishX + 8, 40, "#fff", 10);

    /* Cars */
    ph.current.forEach((car, i) => {
      const carY = 60 + i * 90 + 22;
      const cW = 80, cH = 36;
      /* Body */
      g.fillStyle = cars[i].color;
      g.beginPath(); g.roundRect(car.x - cW / 2, carY, cW, cH, 8); g.fill();
      /* Roof */
      g.fillStyle = cars[i].color + "88";
      g.beginPath(); g.roundRect(car.x - cW / 4, carY - 14, cW / 2, 18, 6); g.fill();
      /* Windows */
      g.fillStyle = "#bfdbfe88";
      g.beginPath(); g.roundRect(car.x - cW / 4 + 4, carY - 11, 18, 14, 4); g.fill();
      g.beginPath(); g.roundRect(car.x + 4, carY - 11, 18, 14, 4); g.fill();
      /* Wheels */
      g.fillStyle = "#111827";
      g.beginPath(); g.arc(car.x - cW / 3, carY + cH, 10, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(car.x + cW / 3, carY + cH, 10, 0, Math.PI * 2); g.fill();
      /* Stats */
      const a = (engineForce - 0.5 * 1.225 * 0.35 * 2.2 * car.v * car.v) / cars[i].mass;
      lbl(g, `${cars[i].label}  a=${a.toFixed(1)}m/s²  v=${car.v.toFixed(1)}m/s`, car.x + cW / 2 + 8, carY + cH / 2 + 4, cars[i].color, 10, "left");
    });

    /* Finish announcer */
    for (let i = 0; i < ph.current.length; i++) {
      if (ph.current[i].x >= finishX) {
        lbl(g, `${cars[i].label} car finished!`, finishX - 20, 60 + i * 90 + 40, "#fff", 11, "right");
      }
    }

    lbl(g, `Engine force = ${engineForce}N (same for all cars).  a = F/m → lighter car wins!`, W / 2, H - 14, "#94a3b8", 11);

    raf.current = requestAnimationFrame(draw);
  }, [engineForce]);

  useEffect(() => {
    ph.current = cars.map(() => ({ x: 60, v: 0 }));
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card tag="E3-08" title="Drag Race — Same Force, Different Masses" desc="All three cars have the same engine force. F=ma → a=F/m: the lightest car (800 kg) wins because the same force produces greater acceleration with less mass.">
      <canvas ref={cvs} width={700} height={340} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <Sld label="Engine Force (N)" value={engineForce} min={2000} max={20000} step={500} color="#f59e0b" onChange={(v) => { setForce(v); reset(); }} />
        <button onClick={reset} style={{ padding: "0 20px", borderRadius: 8, background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>↺ Reset</button>
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E3-9 — Circular Motion & Centripetal Acceleration (a = v²/r)
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_CircularFma() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [speed, setSpeed] = useState(4);
  const [mass, setMass]   = useState(3);
  const [radius, setRadius] = useState(110);
  const t = useRef(0);
  const trail = useRef<{ x: number; y: number }[]>([]);

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    t.current += 0.016;
    const ω = speed / radius;
    const θ = ω * t.current * 60;
    const cx = W / 2, cy = H / 2 - 10;
    const bx = cx + radius * Math.cos(θ);
    const by = cy + radius * Math.sin(θ);
    trail.current.push({ x: bx, y: by });
    if (trail.current.length > 100) trail.current.shift();

    const ac = speed * speed / radius;
    const Fc = mass * ac;

    bg(g, W, H);

    /* Orbit */
    g.strokeStyle = "rgba(99,102,241,0.15)"; g.lineWidth = 1; g.setLineDash([4, 4]);
    g.beginPath(); g.arc(cx, cy, radius, 0, Math.PI * 2); g.stroke();
    g.setLineDash([]);

    /* Trail */
    if (trail.current.length > 1) {
      trail.current.forEach((p, i) => {
        if (i === 0) return;
        const a2 = (i / trail.current.length) * 0.5;
        g.strokeStyle = `rgba(99,102,241,${a2})`; g.lineWidth = 2;
        g.beginPath(); g.moveTo(trail.current[i - 1].x, trail.current[i - 1].y); g.lineTo(p.x, p.y); g.stroke();
      });
    }

    /* Center pivot */
    g.fillStyle = "#475569"; g.beginPath(); g.arc(cx, cy, 8, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#94a3b8"; g.lineWidth = 2; g.beginPath(); g.moveTo(cx, cy); g.lineTo(bx, by); g.stroke();

    /* Ball */
    const bGr = g.createRadialGradient(bx - 5, by - 5, 2, bx, by, 18);
    bGr.addColorStop(0, "#fbbf24"); bGr.addColorStop(1, "#d97706");
    g.fillStyle = bGr; g.beginPath(); g.arc(bx, by, 18, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#fcd34d"; g.lineWidth = 1.5; g.beginPath(); g.arc(bx, by, 18, 0, Math.PI * 2); g.stroke();
    lbl(g, `${mass}kg`, bx, by + 4, "#fff", 9);

    /* Centripetal force (inward) */
    const ix = cx - bx, iy = cy - by;
    const il = Math.sqrt(ix * ix + iy * iy);
    const fcLen = Math.min(Fc * 3, 90);
    arrow(g, bx, by, bx + ix / il * fcLen, by + iy / il * fcLen, "#ef4444", 3, 12);
    lbl(g, `Fc=${Fc.toFixed(1)}N`, bx + ix / il * fcLen * 1.4, by + iy / il * fcLen * 1.4, "#ef4444", 10);

    /* Velocity arrow (tangential) */
    const tx = -Math.sin(θ) * speed * 7;
    const ty =  Math.cos(θ) * speed * 7;
    arrow(g, bx, by, bx + tx, by + ty, "#22d3ee", 2.5, 10);
    lbl(g, `v=${speed}m/s`, bx + tx + 8, by + ty, "#22d3ee", 9, "left");

    lbl(g, `a_c = v²/r = ${speed}²/${radius} = ${ac.toFixed(2)} m/s²    Fc = m·a_c = ${mass}×${ac.toFixed(2)} = ${Fc.toFixed(1)} N`, W / 2, H - 22, "#94a3b8", 11);
    lbl(g, `Centripetal force continuously changes direction — that IS the net force (F=ma)!`, W / 2, H - 5, "#64748b", 9);

    raf.current = requestAnimationFrame(draw);
  }, [speed, mass, radius]);

  useEffect(() => {
    trail.current = [];
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card tag="E3-09" title="Circular Motion — Centripetal Acceleration (a = v²/r)" desc="For circular motion, the net inward force F=ma_c=mv²/r continuously changes direction. This IS Newton's 2nd Law applied to circular paths.">
      <canvas ref={cvs} width={700} height={340} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <Sld label="Speed (m/s)" value={speed} min={1} max={12} color="#22d3ee" onChange={setSpeed} />
        <Sld label="Mass (kg)" value={mass} min={0.5} max={15} step={0.5} color="#f59e0b" onChange={setMass} />
        <Sld label="Radius (px)" value={radius} min={50} max={160} color="#818cf8" onChange={setRadius} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * MAIN EXPORT
 * ══════════════════════════════════════════════════════════════════════ */
export function AdvancedTopic3ExtraSims() {
  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, padding: "14px 20px", background: "linear-gradient(90deg,rgba(245,158,11,0.12),rgba(239,68,68,0.08))", borderRadius: 12, border: "1px solid rgba(245,158,11,0.2)" }}>
        <div style={{ background: "rgba(245,158,11,0.2)", color: "#fcd34d", fontSize: 11, fontWeight: 800, padding: "5px 12px", borderRadius: 8, whiteSpace: "nowrap" }}>EXTRA SIMS 1–9</div>
        <div>
          <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 15 }}>Topic 3 — F = ma Extended Lab</div>
          <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>Rocket · Mass vs Acc · Free Fall · Elevator · Pulley · Net Force · Impulse · Drag Race · Circular Motion</div>
        </div>
      </div>
      <Sim_RocketFma />
      <Sim_MassVsAcceleration />
      <Sim_FreeFall />
      <Sim_Elevator />
      <Sim_TwoMassPulley />
      <Sim_NetForce />
      <Sim_Impulse />
      <Sim_DragRace />
      <Sim_CircularFma />
    </div>
  );
}
