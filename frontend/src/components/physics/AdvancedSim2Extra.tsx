"use client";
/**
 * FILE: AdvancedSim2Extra.tsx
 * LOCATION: src/components/physics/AdvancedSim2Extra.tsx
 * PURPOSE: 9 additional professional canvas-based physics simulations for
 *          Topic 2 — Newton's First Law / Inertia (Class 9 Science).
 *          Demonstrates that objects resist changes to their state of motion.
 * EXPORTS: AdvancedTopic2ExtraSims
 * LAST UPDATED: 2026-05-31
 */

import React, { useState, useEffect, useRef, useCallback } from "react";

/* ── Shared helpers ──────────────────────────────────────────────────── */
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
  g.beginPath(); g.moveTo(x2, y2);
  g.lineTo(x2 - h * Math.cos(ang - 0.42), y2 - h * Math.sin(ang - 0.42));
  g.lineTo(x2 - h * Math.cos(ang + 0.42), y2 - h * Math.sin(ang + 0.42));
  g.closePath(); g.fill();
  g.restore();
}
function lbl(g: CanvasRenderingContext2D, s: string, x: number, y: number,
  color = "#e2e8f0", size = 11, align: CanvasTextAlign = "center") {
  g.save(); g.font = `bold ${size}px 'Inter',sans-serif`;
  g.fillStyle = color; g.textAlign = align; g.fillText(s, x, y); g.restore();
}
function sceneBg(g: CanvasRenderingContext2D, w: number, h: number) {
  const gr = g.createLinearGradient(0, 0, 0, h);
  gr.addColorStop(0, "#0d1117"); gr.addColorStop(1, "#0b1120");
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.strokeStyle = "rgba(255,255,255,0.022)"; g.lineWidth = 1;
  for (let x = 50; x < w; x += 50) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
  for (let y = 50; y < h; y += 50) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
}
function Card({ title, tag, desc, children }: {
  title: string; tag: string; desc: string; children: React.ReactNode;
}) {
  return (
    <div style={{ background: "linear-gradient(135deg,#0f172a,#0d1b2a)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 16, padding: "22px 24px", marginBottom: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{ background: "rgba(16,185,129,0.18)", color: "#6ee7b7", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", padding: "3px 9px", borderRadius: 6 }}>{tag}</span>
        <h3 style={{ color: "#f1f5f9", fontSize: 17, fontWeight: 800, margin: 0 }}>{title}</h3>
      </div>
      <p style={{ color: "#64748b", fontSize: 12, margin: "0 0 14px", lineHeight: 1.6 }}>{desc}</p>
      {children}
    </div>
  );
}
function Sld({ label: l, value, min, max, step = 1, color = "#10b981", onChange }: {
  label: string; value: number; min: number; max: number; step?: number; color?: string; onChange: (v: number) => void;
}) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
        <span style={{ color: "#94a3b8" }}>{l}</span>
        <span style={{ color, fontFamily: "monospace" }}>{value.toFixed(step < 1 ? 2 : 0)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))} style={{ width: "100%", accentColor: color }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E2-1 — Satellite Orbit: Inertia + Gravity = Circular Orbit
 * Object's tangential inertia balances gravitational pull → orbit
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_SatelliteOrbit() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [orbitSpeed, setOrbitSpeed] = useState(3.5);
  const [showInertia, setShowInertia] = useState(true);
  const t = useRef(0);
  const trail = useRef<{ x: number; y: number }[]>([]);

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    t.current += 0.016;
    const cx = W / 2, cy = H / 2;
    const r = 120;
    const θ = (orbitSpeed / r) * t.current * 60;
    const sx = cx + r * Math.cos(θ), sy = cy + r * Math.sin(θ);

    trail.current.push({ x: sx, y: sy });
    if (trail.current.length > 120) trail.current.shift();

    sceneBg(g, W, H);

    /* Earth */
    const earthGr = g.createRadialGradient(cx - 8, cy - 8, 4, cx, cy, 32);
    earthGr.addColorStop(0, "#2563eb"); earthGr.addColorStop(0.6, "#1d4ed8");
    earthGr.addColorStop(1, "#1e3a8a");
    g.fillStyle = earthGr; g.beginPath(); g.arc(cx, cy, 32, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#3b82f6"; g.lineWidth = 1.5;
    g.beginPath(); g.arc(cx, cy, 32, 0, Math.PI * 2); g.stroke();
    lbl(g, "Earth", cx, cy + 4, "#93c5fd", 10);

    /* Orbit path */
    g.strokeStyle = "rgba(99,102,241,0.2)"; g.lineWidth = 1;
    g.setLineDash([4, 4]);
    g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.stroke();
    g.setLineDash([]);

    /* Trail */
    if (trail.current.length > 1) {
      g.strokeStyle = "rgba(34,211,238,0.4)"; g.lineWidth = 1.5;
      g.beginPath();
      trail.current.forEach((p, i) => i === 0 ? g.moveTo(p.x, p.y) : g.lineTo(p.x, p.y));
      g.stroke();
    }

    /* Satellite */
    const satGr = g.createRadialGradient(sx - 3, sy - 3, 1, sx, sy, 12);
    satGr.addColorStop(0, "#fbbf24"); satGr.addColorStop(1, "#d97706");
    g.fillStyle = satGr; g.beginPath(); g.arc(sx, sy, 12, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#fcd34d"; g.lineWidth = 1;
    g.beginPath(); g.arc(sx, sy, 12, 0, Math.PI * 2); g.stroke();
    /* Solar panels */
    g.fillStyle = "#1d4ed8"; g.fillRect(sx - 22, sy - 4, 10, 8); g.fillRect(sx + 12, sy - 4, 10, 8);

    if (showInertia) {
      /* Gravity (toward Earth) */
      const dX = cx - sx, dY = cy - sy;
      const d  = Math.sqrt(dX * dX + dY * dY);
      arrow(g, sx, sy, sx + dX / d * 50, sy + dY / d * 50, "#ef4444", 2.5, 10);
      lbl(g, "Gravity →", sx + dX / d * 70, sy + dY / d * 60, "#ef4444", 9);

      /* Inertia (tangential) */
      const tx = -Math.sin(θ) * 55, ty = Math.cos(θ) * 55;
      arrow(g, sx, sy, sx + tx, sy + ty, "#22d3ee", 2.5, 10);
      lbl(g, "← Inertia", sx + tx + 8, sy + ty + 5, "#22d3ee", 9, "left");
    }

    lbl(g, `Newton's 1st Law: satellite WOULD fly off in straight line without gravity`, W / 2, H - 30, "#94a3b8", 11);
    lbl(g, `Orbital speed = ${orbitSpeed.toFixed(1)} km/s  |  Gravity provides centripetal force`, W / 2, H - 12, "#64748b", 10);

    raf.current = requestAnimationFrame(draw);
  }, [orbitSpeed, showInertia]);

  useEffect(() => {
    trail.current = [];
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card tag="E2-01" title="Satellite Orbit — Inertia in Space" desc="Without gravity, inertia would keep the satellite moving in a straight line forever. Gravity curves its path into an orbit. Newton's 1st Law in action.">
      <canvas ref={cvs} width={700} height={340} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <Sld label="Orbital Speed (km/s)" value={orbitSpeed} min={1} max={8} step={0.1} color="#22d3ee" onChange={setOrbitSpeed} />
        <button onClick={() => setShowInertia(v => !v)} style={{ padding: "0 18px", borderRadius: 8, border: "1px solid #334155", background: showInertia ? "rgba(34,211,238,0.12)" : "#1e293b", color: "#94a3b8", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
          {showInertia ? "Hide" : "Show"} Forces
        </button>
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E2-2 — Bus Passenger Jerk (Sudden start & stop)
 * When bus accelerates, standing passenger tends to stay at rest → leans back
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_BusJerk() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [mode, setMode] = useState<"start" | "stop" | "idle">("idle");
  const ph = useRef({ busV: 0, passLean: 0, leanV: 0 });

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;
    const busAcc = mode === "start" ? 4 : mode === "stop" ? -6 : 0;

    /* Bus accelerates/decelerates */
    s.busV += busAcc * dt;
    s.busV = Math.max(0, Math.min(s.busV, 20));

    /* Passenger lean due to inertia */
    const targetLean = mode === "start" ? -0.3 : mode === "stop" ? 0.3 : 0;
    s.leanV += (targetLean - s.passLean) * 5 * dt;
    s.leanV *= 0.85;
    s.passLean += s.leanV;

    sceneBg(g, W, H);

    /* Road */
    g.fillStyle = "#1e293b"; g.fillRect(0, H * 0.68, W, H);
    /* Road markings */
    for (let x = ((Date.now() / 30) * (s.busV > 0 ? 1 : 0)) % 80; x < W; x += 80) {
      g.fillStyle = "#f59e0b"; g.fillRect(x, H * 0.68 + 8, 40, 5);
    }

    /* Bus body */
    const busX = W * 0.25, busY = H * 0.4;
    const busW = W * 0.5, busH = 90;
    g.fillStyle = "#fbbf24"; g.beginPath(); g.roundRect(busX, busY, busW, busH, 10); g.fill();
    /* Windows */
    for (let i = 0; i < 4; i++) {
      g.fillStyle = "#bfdbfe"; g.beginPath(); g.roundRect(busX + 20 + i * 68, busY + 12, 50, 30, 6); g.fill();
    }
    /* Wheels */
    g.fillStyle = "#1f2937";
    g.beginPath(); g.arc(busX + 50, busY + busH, 24, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.arc(busX + busW - 50, busY + busH, 24, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#374151"; g.beginPath(); g.arc(busX + 50, busY + busH, 12, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#374151"; g.beginPath(); g.arc(busX + busW - 50, busY + busH, 12, 0, Math.PI * 2); g.fill();
    lbl(g, `BUS   v = ${s.busV.toFixed(1)} m/s`, busX + busW / 2, busY + busH / 2 + 6, "#1f2937", 13);

    /* Passenger (simplified stick figure with lean) */
    const px = busX + busW / 2;
    const footY = busY + busH - 5;
    const lean = s.passLean;
    g.save(); g.translate(px, footY); g.rotate(lean);
    /* Body */
    g.strokeStyle = "#f87171"; g.lineWidth = 3;
    g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -50); g.stroke();
    /* Head */
    g.fillStyle = "#fca5a5"; g.beginPath(); g.arc(0, -60, 12, 0, Math.PI * 2); g.fill();
    /* Arms */
    g.beginPath(); g.moveTo(0, -35); g.lineTo(-18, -20); g.stroke();
    g.beginPath(); g.moveTo(0, -35); g.lineTo(18, -20); g.stroke();
    g.restore();

    /* Inertia label */
    const inertiaX = px + Math.sign(lean) * 70;
    if (Math.abs(lean) > 0.05) {
      lbl(g, lean < 0 ? "← Inertia\n(stays put)" : "Inertia →\n(keeps going)", inertiaX, busY + 30, "#22d3ee", 11);
    }

    /* Acceleration arrow on bus */
    if (mode !== "idle") {
      const dir = busAcc > 0 ? 1 : -1;
      arrow(g, busX + busW / 2, busY - 20, busX + busW / 2 + dir * 80, busY - 20, busAcc > 0 ? "#10b981" : "#ef4444", 3, 12);
      lbl(g, busAcc > 0 ? "Bus Accelerates →" : "Bus Brakes ←", busX + busW / 2 + dir * 50, busY - 34, busAcc > 0 ? "#10b981" : "#ef4444", 11);
    }

    lbl(g, mode === "start" ? "Bus starts suddenly — passenger's inertia keeps them stationary momentarily → leans backward"
      : mode === "stop" ? "Bus brakes suddenly — passenger's inertia carries them forward → leans forward"
      : "Bus moving at constant velocity — no force on passenger, upright (Newton's 1st Law)", W / 2, H - 14, "#94a3b8", 10);

    raf.current = requestAnimationFrame(draw);
  }, [mode]);

  useEffect(() => { raf.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(raf.current); }, [draw]);

  return (
    <Card tag="E2-02" title="Bus Passenger — Inertia Effect" desc="When the bus accelerates or brakes suddenly, the passenger's body resists the change in motion (Newton's 1st Law), causing a lean in the opposite direction.">
      <canvas ref={cvs} width={700} height={320} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "flex", gap: 12, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        {(["idle", "start", "stop"] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid",
            borderColor: mode === m ? "#10b981" : "#334155",
            background: mode === m ? "rgba(16,185,129,0.15)" : "#1e293b",
            color: mode === m ? "#10b981" : "#64748b",
            fontWeight: 700, fontSize: 13, cursor: "pointer",
          }}>
            {m === "idle" ? "🚌 Constant Speed" : m === "start" ? "▶ Sudden Start" : "⏸ Sudden Stop"}
          </button>
        ))}
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E2-3 — Hockey Puck on Frictionless Ice
 * Zero friction → object moves forever in a straight line (Newton's 1st Law)
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_HockeyPuck() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [mu, setMu] = useState(0);
  const [speed, setSpeed] = useState(4);
  const ph = useRef({ x: 60, y: 0, vx: 4, vy: 1.5 });

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;
    const v  = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
    if (v > 0.01) {
      const decel = mu * 9.8 * dt;
      const frac  = Math.max(0, 1 - decel / v);
      s.vx *= frac; s.vy *= frac;
    }
    s.x += s.vx * dt * 60;
    s.y += s.vy * dt * 60;
    /* Wall bounces */
    if (s.x < 20)    { s.x = 20;    s.vx *= -0.9; }
    if (s.x > W - 20){ s.x = W - 20; s.vx *= -0.9; }
    if (s.y < 20)    { s.y = 20;    s.vy *= -0.9; }
    if (s.y > H - 50){ s.y = H - 50; s.vy *= -0.9; }

    const curV = Math.sqrt(s.vx * s.vx + s.vy * s.vy);

    sceneBg(g, W, H);

    /* Ice rink */
    const iceGr = g.createLinearGradient(0, 0, W, H);
    iceGr.addColorStop(0, "rgba(186,230,253,0.07)"); iceGr.addColorStop(1, "rgba(147,197,253,0.05)");
    g.fillStyle = iceGr; g.fillRect(10, 10, W - 20, H - 60);
    g.strokeStyle = "rgba(147,197,253,0.25)"; g.lineWidth = 2;
    g.strokeRect(10, 10, W - 20, H - 60);
    /* Center line */
    g.strokeStyle = "rgba(239,68,68,0.3)"; g.lineWidth = 1;
    g.beginPath(); g.moveTo(W / 2, 10); g.lineTo(W / 2, H - 50); g.stroke();
    g.beginPath(); g.arc(W / 2, (H - 40) / 2, 60, 0, Math.PI * 2); g.stroke();

    /* Puck */
    const pGr = g.createRadialGradient(s.x - 4, s.y - 4, 2, s.x, s.y, 16);
    pGr.addColorStop(0, "#6b7280"); pGr.addColorStop(1, "#111827");
    g.fillStyle = pGr; g.beginPath(); g.arc(s.x, s.y, 16, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#4b5563"; g.lineWidth = 1.5;
    g.beginPath(); g.arc(s.x, s.y, 16, 0, Math.PI * 2); g.stroke();

    /* Velocity arrow */
    if (curV > 0.1) {
      arrow(g, s.x, s.y, s.x + s.vx * 18, s.y + s.vy * 18, "#22d3ee", 2.5, 10);
      lbl(g, `${curV.toFixed(2)} m/s`, s.x + s.vx * 26, s.y + s.vy * 26, "#22d3ee", 10);
    }

    /* Friction annotation */
    if (mu > 0 && curV > 0.1) {
      const fx = -s.vx / curV, fy = -s.vy / curV;
      arrow(g, s.x, s.y, s.x + fx * mu * 200, s.y + fy * mu * 200, "#ef4444", 2, 8);
    }

    lbl(g, `μ = ${mu.toFixed(2)}   |   v = ${curV.toFixed(2)} m/s   |   ${mu === 0 ? "FRICTIONLESS — puck never stops" : "Friction decelerates puck"}`, W / 2, H - 18, "#94a3b8", 11);

    raf.current = requestAnimationFrame(draw);
  }, [mu, speed]);

  useEffect(() => {
    const norm = Math.sqrt(1 + (1.5 / 4) ** 2);
    ph.current = { x: 60, y: (1 / norm) * 2, vx: speed * (4 / (Math.sqrt(16 + 2.25))), vy: speed * (1.5 / (Math.sqrt(16 + 2.25))) };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw, speed]);

  return (
    <Card tag="E2-03" title="Hockey Puck — Frictionless vs Friction" desc="With μ=0 (perfect ice) the puck glides forever at constant velocity — Newton's 1st Law. Increase friction to see how it decelerates. Real ice has μ ≈ 0.01–0.03.">
      <canvas ref={cvs} width={700} height={300} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <Sld label="Friction μ (0 = perfect ice)" value={mu} min={0} max={0.3} step={0.01} color="#ef4444" onChange={setMu} />
        <Sld label="Initial Speed (m/s)" value={speed} min={1} max={12} color="#22d3ee" onChange={setSpeed} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E2-4 — Pendulum (Inertia vs Gravity Restoring Force)
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_Pendulum() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [length, setLength] = useState(150);
  const [damp, setDamp]     = useState(0.002);
  const [mass, setMass]     = useState(5);
  const ph = useRef({ θ: 0.6, ω: 0 });

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;
    const α = -(9.8 / length) * Math.sin(s.θ) - damp * s.ω;
    s.ω += α * dt * 60;
    s.θ += s.ω * dt;

    const px = W / 2, py = 60;
    const bx = px + length * Math.sin(s.θ);
    const by = py + length * Math.cos(s.θ);

    sceneBg(g, W, H);

    /* Pivot */
    g.fillStyle = "#475569"; g.beginPath(); g.arc(px, py, 10, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#6366f1"; g.lineWidth = 2;
    g.beginPath(); g.arc(px, py, 10, 0, Math.PI * 2); g.stroke();

    /* Arc trace */
    g.strokeStyle = "rgba(99,102,241,0.15)"; g.lineWidth = 1;
    g.beginPath(); g.arc(px, py, length, -Math.PI / 2, Math.PI / 2); g.stroke();

    /* String */
    g.strokeStyle = "#94a3b8"; g.lineWidth = 2;
    g.beginPath(); g.moveTo(px, py); g.lineTo(bx, by - 18); g.stroke();

    /* Bob */
    const bR = 8 + mass * 1.5;
    const bGr = g.createRadialGradient(bx - 5, by - 5, 2, bx, by, bR);
    bGr.addColorStop(0, "#7c3aed"); bGr.addColorStop(1, "#4c1d95");
    g.fillStyle = bGr; g.beginPath(); g.arc(bx, by, bR, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#a78bfa"; g.lineWidth = 1.5;
    g.beginPath(); g.arc(bx, by, bR, 0, Math.PI * 2); g.stroke();
    lbl(g, `${mass}kg`, bx, by + 4, "#fff", 10);

    /* Velocity arrow (tangential) */
    const vLen = Math.abs(s.ω) * length;
    const tanX = Math.cos(s.θ) * Math.sign(s.ω);
    const tanY = -Math.sin(s.θ) * Math.sign(s.ω);
    if (vLen > 2) {
      arrow(g, bx, by, bx + tanX * Math.min(vLen * 1.5, 80), by + tanY * Math.min(vLen * 1.5, 80), "#22d3ee", 2.5, 10);
      lbl(g, `v=${(vLen).toFixed(1)}m/s`, bx + tanX * 45, by + tanY * 45 - 12, "#22d3ee", 9);
    }
    /* Gravity */
    arrow(g, bx, by, bx, by + Math.min(mass * 9.8 * 0.2, 60), "#ef4444", 2.5, 10);
    /* Tension */
    const tLen = Math.min(mass * 9.8 * Math.cos(s.θ) * 0.2, 60);
    const dirX = px - bx, dirY = py - by;
    const d = Math.sqrt(dirX ** 2 + dirY ** 2);
    arrow(g, bx, by, bx + dirX / d * tLen, by + dirY / d * tLen, "#10b981", 2.5, 10);

    /* Period */
    const T = 2 * Math.PI * Math.sqrt(length / 9.8);
    lbl(g, `Period T = 2π√(L/g) = ${T.toFixed(2)} s    θ = ${(s.θ * 180 / Math.PI).toFixed(1)}°    ω = ${s.ω.toFixed(3)} rad/s`, W / 2, H - 20, "#94a3b8", 11);
    lbl(g, "Inertia carries bob past equilibrium; gravity provides restoring force → SHM", W / 2, H - 4, "#64748b", 9);

    raf.current = requestAnimationFrame(draw);
  }, [length, damp, mass]);

  useEffect(() => {
    ph.current = { θ: 0.6, ω: 0 };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card tag="E2-04" title="Pendulum — Inertia vs Restoring Force" desc="The bob's inertia carries it past equilibrium; gravity pulls it back. The period depends only on length, not mass — T = 2π√(L/g).">
      <canvas ref={cvs} width={700} height={360} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <Sld label="String Length (px)" value={length} min={60} max={220} color="#a78bfa" onChange={(v) => { setLength(v); ph.current = { θ: 0.6, ω: 0 }; }} />
        <Sld label="Air Damping" value={damp} min={0} max={0.02} step={0.001} color="#f59e0b" onChange={setDamp} />
        <Sld label="Bob Mass (kg)" value={mass} min={1} max={15} color="#22d3ee" onChange={setMass} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E2-5 — Space Coasting: Zero Force, Constant Motion
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_SpaceCoasting() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [speed, setSpeed] = useState(3);
  const [angle, setAngle] = useState(25);
  const ph = useRef({ x: 80, y: 160, trail: [] as { x: number; y: number }[] });

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const θ = (angle * Math.PI) / 180;
    const vx = speed * Math.cos(θ), vy = speed * Math.sin(θ) * -1;
    s.x += vx * 0.6; s.y += vy * 0.6;
    /* Wrap */
    if (s.x > W + 30) s.x = -30;
    if (s.x < -30)    s.x = W + 30;
    if (s.y > H + 30) s.y = -30;
    if (s.y < -30)    s.y = H + 30;

    s.trail.push({ x: s.x, y: s.y });
    if (s.trail.length > 150) s.trail.shift();

    sceneBg(g, W, H);

    /* Stars */
    for (let i = 0; i < 60; i++) {
      const sx = (i * 173 + 23) % W, sy = (i * 97 + 47) % H;
      const brightness = 0.3 + 0.7 * Math.sin(i + Date.now() * 0.001 * (i % 5));
      g.fillStyle = `rgba(255,255,255,${brightness * 0.6})`;
      g.beginPath(); g.arc(sx, sy, 1 + (i % 3) * 0.5, 0, Math.PI * 2); g.fill();
    }

    /* Trail */
    if (s.trail.length > 1) {
      s.trail.forEach((p, i) => {
        if (i === 0) return;
        const alpha = (i / s.trail.length) * 0.5;
        g.strokeStyle = `rgba(34,211,238,${alpha})`; g.lineWidth = 2;
        g.beginPath(); g.moveTo(s.trail[i - 1].x, s.trail[i - 1].y); g.lineTo(p.x, p.y); g.stroke();
      });
    }

    /* Spacecraft */
    const x = s.x, y = s.y;
    g.save(); g.translate(x, y); g.rotate(Math.atan2(-vy, vx));
    /* Body */
    g.fillStyle = "#94a3b8"; g.beginPath(); g.roundRect(-20, -8, 40, 16, 5); g.fill();
    /* Nose */
    g.fillStyle = "#dc2626"; g.beginPath(); g.moveTo(20, 0); g.lineTo(30, -5); g.lineTo(30, 5); g.closePath(); g.fill();
    /* Wings */
    g.fillStyle = "#1d4ed8";
    g.beginPath(); g.moveTo(-5, -8); g.lineTo(-15, -24); g.lineTo(5, -8); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(-5, 8); g.lineTo(-15, 24); g.lineTo(5, 8); g.closePath(); g.fill();
    /* Exhaust */
    g.fillStyle = "rgba(251,146,60,0.6)"; g.beginPath(); g.ellipse(-22, 0, 6, 3, 0, 0, Math.PI * 2); g.fill();
    g.restore();

    /* Velocity arrow (no forces in space) */
    arrow(g, x, y, x + vx * 20, y + vy * 20, "#22d3ee", 2, 8);
    lbl(g, `v = ${speed.toFixed(1)} m/s  (constant, no friction in space)`, W / 2, H - 20, "#94a3b8", 11);
    lbl(g, "Newton's 1st Law: no force → spacecraft moves in straight line forever at constant speed", W / 2, H - 4, "#64748b", 9);

    raf.current = requestAnimationFrame(draw);
  }, [speed, angle]);

  useEffect(() => {
    ph.current = { x: 80, y: 160, trail: [] };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card tag="E2-05" title="Space Coasting — Newton's 1st Law in Space" desc="In deep space with no friction and no net force, the spacecraft continues at the same speed in the same direction indefinitely — perfectly demonstrating Newton's 1st Law.">
      <canvas ref={cvs} width={700} height={300} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <Sld label="Speed (m/s)" value={speed} min={0.5} max={10} step={0.5} color="#22d3ee" onChange={setSpeed} />
        <Sld label="Direction (°)" value={angle} min={-45} max={45} color="#a78bfa" onChange={setAngle} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E2-6 — Rolling vs Sliding Race Down a Slope
 * Rolling object (moment of inertia) accelerates slower than sliding one
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_RollVsSlide() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [angle, setAngle] = useState(25);
  const ph = useRef({ xSlide: 0, xRoll: 0, vSlide: 0, vRoll: 0, done: false });

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;
    const θ = (angle * Math.PI) / 180;
    /* Sliding: a = g·sinθ (no friction assumed) */
    const aSlide = 9.8 * Math.sin(θ);
    /* Solid cylinder: a = (2/3)·g·sinθ  — rotational inertia slows it */
    const aRoll  = (2 / 3) * 9.8 * Math.sin(θ);

    if (!s.done) {
      s.vSlide += aSlide * dt; s.xSlide += s.vSlide * dt;
      s.vRoll  += aRoll  * dt; s.xRoll  += s.vRoll  * dt;
      if (s.xSlide > 3.5) { s.done = true; s.xSlide = 3.5; s.xRoll = Math.min(s.xRoll, 3.5); }
    }

    sceneBg(g, W, H);

    /* Two parallel slopes */
    const draw_slope = (offsetY: number, color: string) => {
      const lx = 80, rx = W - 80, sy = offsetY + 80;
      const ey = offsetY + 80 + (rx - lx) * Math.tan(θ);
      g.fillStyle = color;
      g.beginPath(); g.moveTo(lx, sy); g.lineTo(rx, ey); g.lineTo(rx, ey + 16); g.lineTo(lx, sy + 16); g.closePath(); g.fill();
    };
    draw_slope(40, "#1e293b");
    draw_slope(190, "#1e293b");

    /* Angle labels */
    const θlbl = `${angle}°`;
    lbl(g, θlbl, 115, 170, "#f59e0b", 11);
    lbl(g, θlbl, 115, 318, "#f59e0b", 11);

    const slope_len = W - 160;
    const θ_rad = (angle * Math.PI) / 180;

    /* Sliding block */
    const s_frac = s.xSlide / 3.5;
    const sBX = 80 + s_frac * slope_len * Math.cos(θ_rad);
    const sBY = 40 + 80 + s_frac * slope_len * Math.sin(θ_rad);
    g.save(); g.translate(sBX, sBY - 16); g.rotate(θ_rad);
    g.fillStyle = "#dc2626"; g.beginPath(); g.roundRect(-18, -16, 36, 32, 6); g.fill();
    lbl(g, "SLIDE", 0, 4, "#fff", 9);
    g.restore();
    lbl(g, `a=${aSlide.toFixed(2)} m/s²`, sBX + 30, sBY - 24, "#ef4444", 10, "left");

    /* Rolling cylinder */
    const r_frac = s.xRoll / 3.5;
    const rBX = 80 + r_frac * slope_len * Math.cos(θ_rad);
    const rBY = 190 + 80 + r_frac * slope_len * Math.sin(θ_rad);
    g.save(); g.translate(rBX, rBY - 16);
    const cGr = g.createRadialGradient(-4, -4, 2, 0, 0, 16);
    cGr.addColorStop(0, "#2563eb"); cGr.addColorStop(1, "#1e3a8a");
    g.fillStyle = cGr; g.beginPath(); g.arc(0, 0, 16, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#3b82f6"; g.lineWidth = 1.5;
    g.beginPath(); g.arc(0, 0, 16, 0, Math.PI * 2); g.stroke();
    /* Spokes */
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3 + r_frac * 15;
      g.beginPath(); g.moveTo(0, 0); g.lineTo(14 * Math.cos(a), 14 * Math.sin(a)); g.stroke();
    }
    g.restore();
    lbl(g, `a=${aRoll.toFixed(2)} m/s²`, rBX + 30, rBY - 28, "#3b82f6", 10, "left");

    if (s.done) {
      lbl(g, "🏆 SLIDER WINS! (no rotational KE needed)", W / 2, H / 2, "#10b981", 15);
    }
    lbl(g, "Sliding: a = g·sinθ   |   Rolling cylinder: a = (2/3)·g·sinθ  (rotational inertia slows it!)", W / 2, H - 20, "#94a3b8", 11);
    lbl(g, "Hollow cylinder: a = (1/2)·g·sinθ — even slower! Rotational inertia depends on mass distribution.", W / 2, H - 4, "#64748b", 9);

    raf.current = requestAnimationFrame(draw);
  }, [angle]);

  useEffect(() => {
    ph.current = { xSlide: 0, xRoll: 0, vSlide: 0, vRoll: 0, done: false };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card tag="E2-06" title="Rolling vs Sliding — Rotational Inertia" desc="A sliding block converts ALL potential energy to linear KE. A rolling cylinder must also spin, so some energy becomes rotational KE — it accelerates slower despite the same slope angle.">
      <canvas ref={cvs} width={700} height={360} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <Sld label="Slope Angle (°)" value={angle} min={10} max={60} color="#f59e0b"
          onChange={(v) => { setAngle(v); ph.current = { xSlide: 0, xRoll: 0, vSlide: 0, vRoll: 0, done: false }; }} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E2-7 — Car Braking Distance (Inertia vs Friction)
 * d = v² / (2μg) — more speed → much more braking distance!
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_BrakingDistance() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [speed, setSpeed] = useState(15);
  const [mu, setMu]       = useState(0.7);
  const ph = useRef({ x: 60, v: 15, braking: false });

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;

    if (s.braking && s.v > 0) {
      s.v -= mu * 9.8 * dt;
      if (s.v < 0) { s.v = 0; }
      s.x += s.v * dt * 5;
    }

    const stopX  = speed * speed / (2 * mu * 9.8); /* metres */
    const pixPM  = (W - 160) / Math.max(stopX * 1.2, 10);
    const stopPx = 60 + stopX * pixPM;

    sceneBg(g, W, H);

    /* Road */
    g.fillStyle = "#1f2937"; g.fillRect(0, H * 0.55, W, H);
    g.fillStyle = "#374151"; g.fillRect(0, H * 0.55, W, 8);
    /* Dashes */
    for (let x = 0; x < W; x += 80) {
      g.fillStyle = "#fbbf24"; g.fillRect(x, H * 0.55 + 25, 40, 5);
    }

    /* Stop marker */
    g.setLineDash([5, 5]); g.strokeStyle = "#ef4444"; g.lineWidth = 2;
    g.beginPath(); g.moveTo(Math.min(stopPx, W - 30), H * 0.3); g.lineTo(Math.min(stopPx, W - 30), H * 0.55 + 40); g.stroke();
    g.setLineDash([]);
    lbl(g, `Stop\n${stopX.toFixed(1)}m`, Math.min(stopPx, W - 30), H * 0.27, "#ef4444", 10);

    /* Car */
    const carX = s.x;
    const carY = H * 0.55 - 36;
    g.fillStyle = "#2563eb"; g.beginPath(); g.roundRect(carX, carY, 80, 32, 6); g.fill();
    g.fillStyle = "#bfdbfe"; g.beginPath(); g.roundRect(carX + 8, carY + 4, 28, 18, 4); g.fill();
    g.beginPath(); g.roundRect(carX + 44, carY + 4, 28, 18, 4); g.fill();
    g.fillStyle = "#1f2937";
    g.beginPath(); g.arc(carX + 16, carY + 32, 12, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.arc(carX + 64, carY + 32, 12, 0, Math.PI * 2); g.fill();

    /* Skid marks */
    if (s.braking && s.v < speed * 0.98) {
      g.strokeStyle = "rgba(100,116,139,0.4)"; g.lineWidth = 5;
      g.beginPath(); g.moveTo(carX + 16, H * 0.55 + 5); g.lineTo(Math.max(60, carX - 10), H * 0.55 + 5); g.stroke();
      g.beginPath(); g.moveTo(carX + 64, H * 0.55 + 5); g.lineTo(Math.max(60, carX - 10), H * 0.55 + 5); g.stroke();
    }

    /* Speed arrow */
    if (s.v > 0.5) {
      arrow(g, carX + 80, carY + 16, carX + 80 + Math.min(s.v * 3, 80), carY + 16, "#22d3ee", 2.5, 10);
      lbl(g, `${s.v.toFixed(1)} m/s`, carX + 80 + Math.min(s.v * 3, 80) + 5, carY + 20, "#22d3ee", 10, "left");
    }

    if (!s.braking) {
      lbl(g, "Press BRAKE to start", W / 2, H * 0.35, "#6366f1", 13);
    } else if (s.v < 0.1) {
      lbl(g, `Stopped after ${((s.x - 60) / pixPM).toFixed(1)} m`, W / 2, H * 0.35, "#10b981", 14);
    }

    lbl(g, `d = v² / (2μg) = ${speed}² / (2×${mu.toFixed(1)}×9.8) = ${stopX.toFixed(1)} m`, W / 2, H - 22, "#94a3b8", 11);
    lbl(g, "Doubling speed → 4× braking distance! Inertia resists stopping.", W / 2, H - 6, "#64748b", 9);

    raf.current = requestAnimationFrame(draw);
  }, [speed, mu]);

  useEffect(() => {
    ph.current = { x: 60, v: speed, braking: false };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw, speed]);

  return (
    <Card tag="E2-07" title="Car Braking Distance — Inertia vs Friction" desc="d = v²/(2μg). Inertia keeps the car moving; only friction can stop it. Doubling speed quadruples stopping distance — why speed limits matter!">
      <canvas ref={cvs} width={700} height={300} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 14, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <Sld label="Initial Speed (m/s)" value={speed} min={5} max={40} color="#22d3ee"
          onChange={(v) => { setSpeed(v); ph.current = { x: 60, v: v, braking: false }; }} />
        <Sld label="Road Friction μ" value={mu} min={0.1} max={1} step={0.05} color="#f59e0b" onChange={setMu} />
        <button onClick={() => { ph.current.braking = true; }} style={{ padding: "0 20px", borderRadius: 8, background: "#dc2626", color: "#fff", border: "none", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>BRAKE</button>
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E2-8 — Gyroscope Stability (Rotational Inertia)
 * Spinning top resists changing its axis of rotation → stability
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_Gyroscope() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [spin, setSpin]   = useState(8);
  const t = useRef(0);

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    t.current += 0.016;

    /* Precession rate ∝ 1/spin (more spin → slower precession) */
    const precRate = 0.5 / spin;
    const precAngle = precRate * t.current * 60;
    const tiltAngle = 0.35; /* radians */

    sceneBg(g, W, H);

    /* Pedestal */
    const bx = W / 2, by = H - 50;
    g.fillStyle = "#334155"; g.fillRect(bx - 8, by - 60, 16, 60);
    g.fillStyle = "#475569"; g.fillRect(bx - 24, by - 8, 48, 8);

    /* Gyroscope ring + disk */
    const topX = bx + Math.sin(precAngle) * 30;
    const topY = by - 60;
    const diskCX = bx + Math.sin(precAngle) * 15;
    const diskCY = by - 140;

    /* Spinning disk (ellipse to simulate 3D) */
    const diskRX = 50;
    const diskRY = 50 * Math.abs(Math.cos(precAngle * 2 + tiltAngle)) + 8;
    const spinGr = g.createRadialGradient(diskCX - 10, diskCY - 10, 5, diskCX, diskCY, 50);
    spinGr.addColorStop(0, "#6366f1"); spinGr.addColorStop(0.7, "#3730a3"); spinGr.addColorStop(1, "#1e1b4b");
    g.fillStyle = spinGr;
    g.beginPath(); g.ellipse(diskCX, diskCY, diskRX, diskRY, precAngle * 0.3, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#818cf8"; g.lineWidth = 2;
    g.beginPath(); g.ellipse(diskCX, diskCY, diskRX, diskRY, precAngle * 0.3, 0, Math.PI * 2); g.stroke();

    /* Axis rod */
    g.strokeStyle = "#e2e8f0"; g.lineWidth = 3;
    g.beginPath(); g.moveTo(bx, by - 60);
    g.lineTo(diskCX + Math.cos(precAngle * 0.3) * 60, diskCY - Math.sin(tiltAngle) * 60);
    g.stroke();
    g.beginPath(); g.moveTo(bx, by - 60);
    g.lineTo(diskCX - Math.cos(precAngle * 0.3) * 60, diskCY + Math.sin(tiltAngle) * 60);
    g.stroke();

    /* Precession circle */
    g.strokeStyle = "rgba(99,102,241,0.2)"; g.lineWidth = 1; g.setLineDash([3, 3]);
    g.beginPath(); g.ellipse(bx, by - 120, 32, 10, 0, 0, Math.PI * 2); g.stroke();
    g.setLineDash([]);

    /* Gravity arrow */
    arrow(g, diskCX, diskCY, diskCX, diskCY + 45, "#ef4444", 2.5, 10);
    lbl(g, "Gravity", diskCX + 8, diskCY + 30, "#ef4444", 10, "left");

    /* Precession annotation */
    lbl(g, `Ω_precession = ${precRate.toFixed(3)} rad/s`, W * 0.75, H * 0.35, "#a78bfa", 10);
    lbl(g, `Spin ω = ${spin} rad/s`, W * 0.75, H * 0.35 + 16, "#6366f1", 10);
    lbl(g, `More spin → less precession`, W * 0.75, H * 0.35 + 32, "#64748b", 9);

    /* Visual spin lines on disk */
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4 + t.current * spin;
      const r = 40;
      g.strokeStyle = "rgba(167,139,250,0.3)"; g.lineWidth = 1;
      g.beginPath(); g.moveTo(diskCX, diskCY);
      g.lineTo(diskCX + Math.cos(a) * r * 0.9, diskCY + Math.sin(a) * diskRY / diskRX * r * 0.9);
      g.stroke();
    }

    lbl(g, "Spinning gyroscope resists changing its axis (rotational inertia) → GYROSCOPIC STABILITY", W / 2, H - 20, "#94a3b8", 11);
    lbl(g, "Gyrocompasses, bike wheels, spinning tops all use this principle!", W / 2, H - 5, "#64748b", 9);

    raf.current = requestAnimationFrame(draw);
  }, [spin]);

  useEffect(() => { raf.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(raf.current); }, [draw]);

  return (
    <Card tag="E2-08" title="Gyroscope — Rotational Inertia Stability" desc="A spinning gyroscope strongly resists changing its axis of rotation. The faster it spins, the more stable it is. This is why a spinning bicycle wheel is harder to tilt than a stationary one.">
      <canvas ref={cvs} width={700} height={340} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <Sld label="Spin Rate ω (rad/s)" value={spin} min={1} max={20} color="#6366f1" onChange={setSpin} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E2-9 — Coin Stack Flick (Inertia of Rest)
 * Bottom coin flicked out; stack stays due to inertia
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_CoinFlick() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [flicking, setFlicking] = useState(false);
  const ph = useRef({
    coinX:    0,     /* bottom coin X offset */
    coinV:    0,
    stackY:   0,     /* stack drop */
    stackV:   0,
    flicked:  false,
    done:     false,
  });

  const flick = () => {
    if (ph.current.flicked) {
      ph.current = { coinX: 0, coinV: 0, stackY: 0, stackV: 0, flicked: false, done: false };
      setFlicking(false);
    } else {
      ph.current.coinV = 28;
      ph.current.flicked = true;
      setFlicking(true);
    }
  };

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;
    const stackN = 6;

    if (s.flicked && !s.done) {
      s.coinX += s.coinV * dt * 60;
      s.coinV *= 0.98; /* friction */
      s.stackV += 9.8 * dt;
      s.stackY += s.stackV * dt * 30;
      if (s.stackY > 40) { s.done = true; }
    }

    sceneBg(g, W, H);

    /* Table */
    const tableY = H * 0.62;
    g.fillStyle = "#1e293b"; g.fillRect(0, tableY, W, H - tableY);
    g.strokeStyle = "#334155"; g.lineWidth = 2; g.beginPath(); g.moveTo(0, tableY); g.lineTo(W, tableY); g.stroke();
    lbl(g, "Table Surface", W / 2, tableY + 16, "#475569", 10);

    /* Stack of coins (5 on top) */
    const bx = W / 2, by = tableY;
    const cW = 70, cH = 12, gap = 13;
    for (let i = 1; i <= stackN - 1; i++) {
      const cy2 = by - i * gap - s.stackY * (s.flicked ? 1 : 0);
      const hue = 40 + i * 5;
      g.fillStyle = `hsl(${hue},70%,45%)`;
      g.beginPath(); g.ellipse(bx, cy2, cW / 2, cH / 2, 0, 0, Math.PI * 2); g.fill();
      g.strokeStyle = `hsl(${hue},70%,60%)`; g.lineWidth = 1;
      g.beginPath(); g.ellipse(bx, cy2, cW / 2, cH / 2, 0, 0, Math.PI * 2); g.stroke();
    }

    /* Bottom (flicked) coin */
    const fcX = bx + s.coinX * 4;
    const bottomY = by - cH / 2;
    g.fillStyle = "#d97706";
    g.beginPath(); g.ellipse(fcX, bottomY, cW / 2, cH / 2, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#fbbf24"; g.lineWidth = 1.5;
    g.beginPath(); g.ellipse(fcX, bottomY, cW / 2, cH / 2, 0, 0, Math.PI * 2); g.stroke();

    /* Flick arrow */
    if (!s.flicked) {
      arrow(g, bx - 120, bottomY, bx - cW / 2 - 5, bottomY, "#10b981", 3, 12);
      lbl(g, "Flick →", bx - 100, bottomY - 14, "#10b981", 11);
    }

    if (s.flicked) {
      arrow(g, fcX - 30, bottomY, fcX - 30 + Math.min(s.coinV * 3, 80), bottomY, "#22d3ee", 2.5, 10);
      lbl(g, `v=${s.coinV.toFixed(1)}`, fcX + 20, bottomY - 12, "#22d3ee", 9, "left");
    }

    if (s.done) {
      lbl(g, "Stack falls vertically — Inertia of rest kept it in place!", W / 2, H * 0.3, "#10b981", 13);
    }

    lbl(g, "The stack's inertia keeps it at rest while the bottom coin is quickly flicked away.", W / 2, H - 22, "#94a3b8", 11);
    lbl(g, "Short contact time → minimal force transmitted to the rest of the stack.", W / 2, H - 6, "#64748b", 9);

    raf.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => { raf.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(raf.current); }, [draw]);

  return (
    <Card tag="E2-09" title="Coin Stack Flick — Inertia of Rest" desc="The bottom coin is flicked out rapidly. The rest of the stack, due to inertia, stays at rest momentarily — then falls straight down. The key is the short contact time (small impulse).">
      <canvas ref={cvs} width={700} height={280} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b", display: "flex", justifyContent: "center" }}>
        <button onClick={flick} style={{ padding: "12px 40px", borderRadius: 10, background: flicking ? "#334155" : "#2563eb", color: "#fff", border: "none", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
          {ph.current.flicked ? "↺ Reset" : "⚡ FLICK COIN"}
        </button>
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * MAIN EXPORT
 * ══════════════════════════════════════════════════════════════════════ */
export function AdvancedTopic2ExtraSims() {
  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, padding: "14px 20px", background: "linear-gradient(90deg,rgba(16,185,129,0.12),rgba(99,102,241,0.08))", borderRadius: 12, border: "1px solid rgba(16,185,129,0.2)" }}>
        <div style={{ background: "rgba(16,185,129,0.2)", color: "#6ee7b7", fontSize: 11, fontWeight: 800, padding: "5px 12px", borderRadius: 8, whiteSpace: "nowrap" }}>EXTRA SIMS 1–9</div>
        <div>
          <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 15 }}>Topic 2 — Newton&apos;s 1st Law Extended Lab</div>
          <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>Satellite Orbit · Bus Passenger · Hockey Puck · Pendulum · Space Coasting · Rolling vs Sliding · Braking Distance · Gyroscope · Coin Flick</div>
        </div>
      </div>
      <Sim_SatelliteOrbit />
      <Sim_BusJerk />
      <Sim_HockeyPuck />
      <Sim_Pendulum />
      <Sim_SpaceCoasting />
      <Sim_RollVsSlide />
      <Sim_BrakingDistance />
      <Sim_Gyroscope />
      <Sim_CoinFlick />
    </div>
  );
}
