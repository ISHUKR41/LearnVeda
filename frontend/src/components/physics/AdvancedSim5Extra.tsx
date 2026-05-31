"use client";
/**
 * FILE: AdvancedSim5Extra.tsx
 * LOCATION: src/components/physics/AdvancedSim5Extra.tsx
 * PURPOSE: 9 additional professional canvas-based physics simulations for
 *          Topic 5 — Conservation of Momentum (Class 9 Science).
 *          Total momentum of an isolated system is always conserved.
 * EXPORTS: AdvancedTopic5ExtraSims
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
    <div style={{ background: "linear-gradient(135deg,#0f172a,#0d1b2a)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 16, padding: "22px 24px", marginBottom: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{ background: "rgba(167,139,250,0.18)", color: "#c4b5fd", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", padding: "3px 9px", borderRadius: 6 }}>{tag}</span>
        <h3 style={{ color: "#f1f5f9", fontSize: 17, fontWeight: 800, margin: 0 }}>{title}</h3>
      </div>
      <p style={{ color: "#64748b", fontSize: 12, margin: "0 0 14px", lineHeight: 1.6 }}>{desc}</p>
      {children}
    </div>
  );
}
function Sld({ label: l, value, min, max, step = 1, color = "#a78bfa", onChange }: { label: string; value: number; min: number; max: number; step?: number; color?: string; onChange: (v: number) => void }) {
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
 * SIM E5-1 — 1D Elastic Collision
 * Both momentum AND kinetic energy conserved
 * v1' = (m1−m2)/(m1+m2) v1     v2' = 2m1/(m1+m2) v1
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_ElasticCollision() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [m1, setM1] = useState(5);
  const [m2, setM2] = useState(3);
  const [v1i, setV1i] = useState(4);
  const ph = useRef({ x1: 120, x2: 480, v1: 4, v2: 0, collided: false });

  const reset = () => ph.current = { x1: 120, x2: 480, v1: v1i, v2: 0, collided: false };

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;
    const r1 = 18 + m1 * 2, r2 = 18 + m2 * 2;

    /* Check collision */
    if (!s.collided && s.x1 + r1 >= s.x2 - r2) {
      s.collided = true;
      const v1f = ((m1 - m2) * s.v1 + 2 * m2 * s.v2) / (m1 + m2);
      const v2f = ((m2 - m1) * s.v2 + 2 * m1 * s.v1) / (m1 + m2);
      s.v1 = v1f; s.v2 = v2f;
    }
    s.x1 += s.v1 * dt * 30;
    s.x2 += s.v2 * dt * 30;
    /* Reset */
    if (s.x1 < r1 || s.x1 > W - r1) s.v1 *= -1;
    if (s.x2 > W - r2) { s.v2 *= -1; s.collided = false; }
    if (s.x2 < r2)     { s.v2 *= -1; s.collided = false; }

    bg(g, W, H);

    /* Track */
    const trackY = H * 0.52;
    g.fillStyle = "#1e293b"; g.fillRect(0, trackY, W, 10);
    lbl(g, "Frictionless Surface", W / 2, trackY + 24, "#475569", 10);

    /* Ball 1 */
    const b1G = g.createRadialGradient(s.x1 - r1 * 0.4, trackY - r1 * 0.4, 2, s.x1, trackY, r1);
    b1G.addColorStop(0, "#22d3ee"); b1G.addColorStop(1, "#0284c7");
    g.fillStyle = b1G; g.beginPath(); g.arc(s.x1, trackY, r1, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#7dd3fc"; g.lineWidth = 1.5; g.beginPath(); g.arc(s.x1, trackY, r1, 0, Math.PI * 2); g.stroke();
    lbl(g, `m₁=${m1}`, s.x1, trackY + 4, "#fff", 10);
    /* Velocity arrow */
    const v1scale = Math.abs(s.v1) * 8;
    if (v1scale > 3) arrow(g, s.x1, trackY - r1 - 18, s.x1 + s.v1 / Math.abs(s.v1 || 1) * v1scale, trackY - r1 - 18, "#22d3ee", 2.5, 10);
    lbl(g, `v₁=${s.v1.toFixed(2)}m/s`, s.x1, trackY - r1 - 32, "#22d3ee", 9);

    /* Ball 2 */
    const b2G = g.createRadialGradient(s.x2 - r2 * 0.4, trackY - r2 * 0.4, 2, s.x2, trackY, r2);
    b2G.addColorStop(0, "#f59e0b"); b2G.addColorStop(1, "#d97706");
    g.fillStyle = b2G; g.beginPath(); g.arc(s.x2, trackY, r2, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#fcd34d"; g.lineWidth = 1.5; g.beginPath(); g.arc(s.x2, trackY, r2, 0, Math.PI * 2); g.stroke();
    lbl(g, `m₂=${m2}`, s.x2, trackY + 4, "#fff", 10);
    const v2scale = Math.abs(s.v2) * 8;
    if (v2scale > 3) arrow(g, s.x2, trackY - r2 - 18, s.x2 + s.v2 / Math.abs(s.v2 || 1) * v2scale, trackY - r2 - 18, "#f59e0b", 2.5, 10);
    lbl(g, `v₂=${s.v2.toFixed(2)}m/s`, s.x2, trackY - r2 - 32, "#f59e0b", 9);

    /* Momentum indicators */
    const p_before = m1 * v1i;
    const p_after  = m1 * s.v1 + m2 * s.v2;
    const ke_before = 0.5 * m1 * v1i * v1i;
    const ke_after  = 0.5 * m1 * s.v1 * s.v1 + 0.5 * m2 * s.v2 * s.v2;

    /* Telemetry panel */
    const items = [
      { l: "p_total before", v: `${p_before.toFixed(2)} kg·m/s`, c: "#22d3ee" },
      { l: "p_total after",  v: `${p_after.toFixed(2)} kg·m/s`,  c: "#10b981" },
      { l: "KE before",      v: `${ke_before.toFixed(2)} J`,       c: "#f59e0b" },
      { l: "KE after",       v: `${ke_after.toFixed(2)} J`,        c: "#fbbf24" },
    ];
    items.forEach(({ l: ll, v, c }, i) => {
      const px = 16;
      g.fillStyle = "rgba(15,23,42,0.8)"; g.beginPath(); g.roundRect(px, H - 90 + i * 20, 310, 17, 3); g.fill();
      lbl(g, ll, px + 4, H - 90 + i * 20 + 12, "#64748b", 10, "left");
      lbl(g, v, px + 306, H - 90 + i * 20 + 12, c, 10, "right");
    });

    const v1f_theory = ((m1 - m2) * v1i) / (m1 + m2);
    const v2f_theory = (2 * m1 * v1i) / (m1 + m2);
    lbl(g, `After: v₁'=${v1f_theory.toFixed(2)}m/s  v₂'=${v2f_theory.toFixed(2)}m/s  (elastic: both p and KE conserved)`, W / 2 + 50, H - 14, "#94a3b8", 10);

    raf.current = requestAnimationFrame(draw);
  }, [m1, m2, v1i]);

  useEffect(() => {
    ph.current = { x1: 120, x2: 480, v1: v1i, v2: 0, collided: false };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw, v1i]);

  return (
    <Card tag="E5-01" title="Elastic Collision — p and KE Both Conserved" desc="In a perfectly elastic collision: momentum AND kinetic energy are both conserved. Use the formulas v₁' = (m₁−m₂)v₁/(m₁+m₂) and v₂' = 2m₁v₁/(m₁+m₂).">
      <canvas ref={cvs} width={700} height={280} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b", alignItems: "end" }}>
        <Sld label="Mass m₁ (kg)" value={m1} min={1} max={15} color="#22d3ee" onChange={setM1} />
        <Sld label="Mass m₂ (kg)" value={m2} min={1} max={15} color="#f59e0b" onChange={setM2} />
        <Sld label="Initial v₁ (m/s)" value={v1i} min={1} max={10} color="#a78bfa" onChange={setV1i} />
        <button onClick={reset} style={{ padding: "12px 16px", borderRadius: 8, background: "#334155", color: "#94a3b8", border: "1px solid #475569", fontWeight: 700, cursor: "pointer" }}>↺ Reset</button>
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E5-2 — Perfectly Inelastic Collision (Objects Stick Together)
 * v_final = (m1·v1 + m2·v2) / (m1 + m2)    KE is NOT conserved
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_InelasticCollision() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [m1, setM1] = useState(6);
  const [m2, setM2] = useState(4);
  const [v1i, setV1i] = useState(5);
  const [v2i, setV2i] = useState(-2);
  const ph = useRef({ x1: 150, x2: 520, v: [5, -2] as [number, number], stuck: false, xStuck: 0 });

  const reset = () => { ph.current = { x1: 150, x2: 520, v: [v1i, v2i], stuck: false, xStuck: 0 }; };

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;
    const r1 = 22, r2 = 20;

    /* Collision detection */
    if (!s.stuck && s.x1 + r1 >= s.x2 - r2) {
      s.stuck = true;
      const vf = (m1 * s.v[0] + m2 * s.v[1]) / (m1 + m2);
      s.v = [vf, vf];
      s.xStuck = (s.x1 + s.x2) / 2;
    }

    if (!s.stuck) {
      s.x1 += s.v[0] * dt * 28;
      s.x2 += s.v[1] * dt * 28;
    } else {
      s.xStuck += s.v[0] * dt * 28;
    }
    /* Bounce walls */
    if (!s.stuck) {
      if (s.x1 < r1) { s.x1 = r1; s.v[0] *= -1; }
      if (s.x2 > W - r2) { s.x2 = W - r2; s.v[1] *= -1; }
    } else {
      if (s.xStuck < r1 + r2 || s.xStuck > W - r1 - r2) s.v[0] *= -1;
    }

    bg(g, W, H);

    const trackY = H * 0.52;
    g.fillStyle = "#1e293b"; g.fillRect(0, trackY, W, 10);

    if (!s.stuck) {
      /* Ball 1 */
      const b1G = g.createRadialGradient(s.x1 - 8, trackY - 8, 2, s.x1, trackY, r1);
      b1G.addColorStop(0, "#dc2626"); b1G.addColorStop(1, "#7f1d1d");
      g.fillStyle = b1G; g.beginPath(); g.arc(s.x1, trackY, r1, 0, Math.PI * 2); g.fill();
      g.strokeStyle = "#f87171"; g.lineWidth = 1.5; g.beginPath(); g.arc(s.x1, trackY, r1, 0, Math.PI * 2); g.stroke();
      lbl(g, `m₁=${m1}`, s.x1, trackY + 4, "#fff", 10);
      if (Math.abs(s.v[0]) > 0.1) arrow(g, s.x1, trackY - r1 - 16, s.x1 + s.v[0] * 9, trackY - r1 - 16, "#ef4444", 2.5, 10);
      lbl(g, `${s.v[0].toFixed(1)}m/s`, s.x1, trackY - r1 - 30, "#ef4444", 9);

      /* Ball 2 */
      const b2G = g.createRadialGradient(s.x2 - 8, trackY - 8, 2, s.x2, trackY, r2);
      b2G.addColorStop(0, "#2563eb"); b2G.addColorStop(1, "#1e3a8a");
      g.fillStyle = b2G; g.beginPath(); g.arc(s.x2, trackY, r2, 0, Math.PI * 2); g.fill();
      g.strokeStyle = "#93c5fd"; g.lineWidth = 1.5; g.beginPath(); g.arc(s.x2, trackY, r2, 0, Math.PI * 2); g.stroke();
      lbl(g, `m₂=${m2}`, s.x2, trackY + 4, "#fff", 10);
      if (Math.abs(s.v[1]) > 0.1) arrow(g, s.x2, trackY - r2 - 16, s.x2 + s.v[1] * 9, trackY - r2 - 16, "#3b82f6", 2.5, 10);
      lbl(g, `${s.v[1].toFixed(1)}m/s`, s.x2, trackY - r2 - 30, "#3b82f6", 9);
    } else {
      /* Stuck combined mass */
      const rx = s.xStuck;
      const combinedGr = g.createLinearGradient(rx - 40, trackY - 22, rx + 40, trackY + 22);
      combinedGr.addColorStop(0, "#7c3aed"); combinedGr.addColorStop(1, "#4c1d95");
      g.fillStyle = combinedGr; g.beginPath(); g.roundRect(rx - 42, trackY - 22, 84, 44, 10); g.fill();
      g.strokeStyle = "#a78bfa"; g.lineWidth = 2; g.beginPath(); g.roundRect(rx - 42, trackY - 22, 84, 44, 10); g.stroke();
      lbl(g, `(m₁+m₂)=${m1 + m2}kg`, rx, trackY + 4, "#fff", 10);
      if (Math.abs(s.v[0]) > 0.05) arrow(g, rx, trackY - 38, rx + s.v[0] * 9, trackY - 38, "#a78bfa", 2.5, 10);
      lbl(g, `v_f=${s.v[0].toFixed(2)}m/s`, rx, trackY - 52, "#a78bfa", 10);
      lbl(g, "STUCK TOGETHER", rx, H * 0.25, "#10b981", 14);
    }

    /* Calculations */
    const vf_theory = (m1 * v1i + m2 * v2i) / (m1 + m2);
    const ke_before = 0.5 * m1 * v1i * v1i + 0.5 * m2 * v2i * v2i;
    const ke_after  = 0.5 * (m1 + m2) * vf_theory * vf_theory;
    const ke_loss   = ke_before - ke_after;

    lbl(g, `v_f = (m₁v₁ + m₂v₂)/(m₁+m₂) = (${m1}×${v1i}+${m2}×${v2i})/${m1 + m2} = ${vf_theory.toFixed(2)} m/s`, W / 2, H - 30, "#94a3b8", 10);
    lbl(g, `KE before=${ke_before.toFixed(1)}J  KE after=${ke_after.toFixed(1)}J  KE lost=${ke_loss.toFixed(1)}J (heat/sound)  |  p CONSERVED!`, W / 2, H - 12, "#64748b", 10);

    raf.current = requestAnimationFrame(draw);
  }, [m1, m2, v1i, v2i]);

  useEffect(() => {
    ph.current = { x1: 150, x2: 520, v: [v1i, v2i], stuck: false, xStuck: 0 };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw, v1i, v2i]);

  return (
    <Card tag="E5-02" title="Perfectly Inelastic Collision — Stick Together" desc="Objects stick together after collision. Momentum conserved: v_f = (m₁v₁+m₂v₂)/(m₁+m₂). Kinetic energy is NOT conserved — it converts to heat, sound, and deformation.">
      <canvas ref={cvs} width={700} height={280} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 10, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b", alignItems: "end" }}>
        <Sld label="m₁ (kg)" value={m1} min={1} max={15} color="#ef4444" onChange={setM1} />
        <Sld label="m₂ (kg)" value={m2} min={1} max={15} color="#3b82f6" onChange={setM2} />
        <Sld label="v₁ (m/s)" value={v1i} min={0} max={10} color="#ef4444" onChange={setV1i} />
        <Sld label="v₂ (m/s)" value={v2i} min={-8} max={0} color="#3b82f6" onChange={setV2i} />
        <button onClick={reset} style={{ padding: "12px 14px", borderRadius: 8, background: "#334155", color: "#94a3b8", border: "1px solid #475569", fontWeight: 700, cursor: "pointer" }}>↺</button>
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E5-3 — Explosion (Reverse Collision)
 * Two objects start at rest → explode apart with equal & opposite momenta
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_Explosion() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [m1, setM1] = useState(3);
  const [m2, setM2] = useState(7);
  const ph = useRef({ x1: 0, x2: 0, v1: 0, v2: 0, exploded: false, particles: [] as { x: number; y: number; vx: number; vy: number; r: number; color: string; alpha: number }[] });

  const explode = () => {
    const impulse = 80; /* arbitrary explosion impulse */
    const v1 = -impulse / m1, v2 = impulse / m2;
    ph.current = {
      x1: 0, x2: 0, v1, v2, exploded: true,
      particles: Array.from({ length: 30 }, (_, i) => ({
        x: 0, y: 0,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15,
        r: 1.5 + Math.random() * 3,
        color: ["#f59e0b", "#ef4444", "#fbbf24", "#dc2626"][Math.floor(Math.random() * 4)],
        alpha: 1,
      })),
    };
  };

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;
    if (s.exploded) {
      s.x1 += s.v1 * dt * 30;
      s.x2 += s.v2 * dt * 30;
      s.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.2; p.alpha -= 0.018; });
      s.particles = s.particles.filter(p => p.alpha > 0);
    }

    bg(g, W, H);

    /* Ground */
    g.fillStyle = "#1e293b"; g.fillRect(0, H * 0.65, W, H * 0.35);

    const cx = W / 2, cy = H * 0.5;

    /* Particles */
    s.particles.forEach(p => {
      g.fillStyle = `${p.color}${Math.round(p.alpha * 255).toString(16).padStart(2, "0")}`;
      g.beginPath(); g.arc(cx + p.x, cy + p.y, p.r, 0, Math.PI * 2); g.fill();
    });

    if (!s.exploded) {
      /* Combined block at rest */
      const gr = g.createLinearGradient(cx - 50, cy - 25, cx + 50, cy + 25);
      gr.addColorStop(0, "#ef4444"); gr.addColorStop(0.5, "#7c3aed"); gr.addColorStop(1, "#3b82f6");
      g.fillStyle = gr; g.beginPath(); g.roundRect(cx - 50, cy - 25, 100, 50, 10); g.fill();
      g.strokeStyle = "#818cf8"; g.lineWidth = 2; g.beginPath(); g.roundRect(cx - 50, cy - 25, 100, 50, 10); g.stroke();
      lbl(g, `${m1}kg + ${m2}kg`, cx, cy + 6, "#fff", 11);
      lbl(g, "v = 0  (at rest)", cx, cy - 38, "#64748b", 11);
      lbl(g, "Press EXPLODE", cx, H * 0.3, "#6366f1", 13);
    } else {
      /* Left fragment (m1) */
      const b1x = cx + s.x1;
      const b1G = g.createRadialGradient(b1x - 8, cy - 8, 2, b1x, cy, 20);
      b1G.addColorStop(0, "#ef4444"); b1G.addColorStop(1, "#7f1d1d");
      g.fillStyle = b1G; g.beginPath(); g.arc(b1x, cy, 20, 0, Math.PI * 2); g.fill();
      g.strokeStyle = "#f87171"; g.lineWidth = 1.5; g.beginPath(); g.arc(b1x, cy, 20, 0, Math.PI * 2); g.stroke();
      lbl(g, `${m1}kg`, b1x, cy + 4, "#fff", 10);
      lbl(g, `v=${s.v1.toFixed(2)}m/s`, b1x, cy - 34, "#ef4444", 9);
      if (Math.abs(s.v1) > 0.1) arrow(g, b1x, cy - 30, b1x + s.v1 * 5, cy - 30, "#ef4444", 2.5, 10);

      /* Right fragment (m2) */
      const b2x = cx + s.x2;
      const b2G = g.createRadialGradient(b2x - 8, cy - 8, 2, b2x, cy, 25);
      b2G.addColorStop(0, "#3b82f6"); b2G.addColorStop(1, "#1e3a8a");
      g.fillStyle = b2G; g.beginPath(); g.arc(b2x, cy, 25, 0, Math.PI * 2); g.fill();
      g.strokeStyle = "#93c5fd"; g.lineWidth = 1.5; g.beginPath(); g.arc(b2x, cy, 25, 0, Math.PI * 2); g.stroke();
      lbl(g, `${m2}kg`, b2x, cy + 4, "#fff", 10);
      lbl(g, `v=${s.v2.toFixed(2)}m/s`, b2x, cy - 38, "#3b82f6", 9);
      if (Math.abs(s.v2) > 0.1) arrow(g, b2x, cy - 30, b2x + s.v2 * 5, cy - 30, "#3b82f6", 2.5, 10);
    }

    const v1f = -80 / m1, v2f = 80 / m2;
    lbl(g, `p₁=${(m1 * v1f).toFixed(1)} kg·m/s  +  p₂=${(m2 * v2f).toFixed(1)} kg·m/s  =  ${(m1 * v1f + m2 * v2f).toFixed(2)} kg·m/s  (= 0 ✓)`, W / 2, H - 14, "#94a3b8", 10);

    raf.current = requestAnimationFrame(draw);
  }, [m1, m2]);

  useEffect(() => {
    ph.current = { x1: 0, x2: 0, v1: 0, v2: 0, exploded: false, particles: [] };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card tag="E5-03" title="Explosion — Conservation in Reverse" desc="An explosion is momentum conservation in reverse. Total initial momentum = 0. After: m₁v₁ + m₂v₂ = 0 always. Lighter fragment flies faster!">
      <canvas ref={cvs} width={700} height={260} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 14, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b", alignItems: "end" }}>
        <Sld label="Fragment m₁ (kg)" value={m1} min={1} max={15} color="#ef4444" onChange={setM1} />
        <Sld label="Fragment m₂ (kg)" value={m2} min={1} max={15} color="#3b82f6" onChange={setM2} />
        <button onClick={explode} style={{ padding: "12px 18px", borderRadius: 8, background: "#dc2626", color: "#fff", border: "none", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>💥 EXPLODE</button>
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E5-4 — Ballistic Pendulum (Bullet Embeds in Block)
 * p_before = m_b·v_b   →   (m_b+m_block)·v_after = m_b·v_b
 * h = v_after²/(2g)   — used to measure bullet speed!
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_BallisticPendulumAdvanced() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [bulletM, setBulletM]   = useState(0.02);
  const [bulletV, setBulletV]   = useState(300);
  const [blockM, setBlockM]     = useState(5);
  const ph = useRef({ bulletX: 50, fired: false, bv: 0, pendθ: 0, pendω: 0, done: false });

  const L = 150; /* string length */

  const fire = () => {
    ph.current = { bulletX: 50, fired: true, bv: bulletV, pendθ: 0, pendω: 0, done: false };
  };

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;
    const pivotX = W / 2, pivotY = 80;

    if (s.fired && !s.done) {
      s.bulletX += s.bv * dt * 0.3;
      /* Bullet hits pendulum */
      if (s.bulletX >= pivotX - 22) {
        const vAfter = (bulletM * bulletV) / (bulletM + blockM);
        s.pendω = vAfter / L;
        s.bv = 0;
        s.done = true;
      }
    }
    if (s.done) {
      s.pendω += -(9.8 / L) * Math.sin(s.pendθ) * dt * 60;
      s.pendω *= 0.995;
      s.pendθ += s.pendω * dt;
    }

    const blockX = pivotX + L * Math.sin(s.pendθ);
    const blockY = pivotY + L * Math.cos(s.pendθ);

    bg(g, W, H);

    /* Ceiling */
    g.fillStyle = "#334155"; g.fillRect(0, 0, W, 16);

    /* Pendulum string */
    g.strokeStyle = "#94a3b8"; g.lineWidth = 2;
    g.beginPath(); g.moveTo(pivotX, pivotY); g.lineTo(blockX, blockY - 22); g.stroke();

    /* Pivot */
    g.fillStyle = "#475569"; g.beginPath(); g.arc(pivotX, pivotY, 8, 0, Math.PI * 2); g.fill();

    /* Block (pendulum) */
    const bGr = g.createLinearGradient(blockX - 30, blockY - 22, blockX + 30, blockY + 22);
    bGr.addColorStop(0, "#854d0e"); bGr.addColorStop(1, "#713f12");
    g.fillStyle = bGr; g.beginPath(); g.roundRect(blockX - 30, blockY - 22, 60, 44, 8); g.fill();
    g.strokeStyle = "#d97706"; g.lineWidth = 1.5; g.beginPath(); g.roundRect(blockX - 30, blockY - 22, 60, 44, 8); g.stroke();
    lbl(g, `${blockM}kg`, blockX, blockY + 5, "#fff", 11);

    /* Bullet */
    if (!s.done) {
      const bGr2 = g.createLinearGradient(s.bulletX, pivotY + L - 5, s.bulletX + 18, pivotY + L + 5);
      bGr2.addColorStop(0, "#fbbf24"); bGr2.addColorStop(1, "#d97706");
      g.fillStyle = bGr2; g.beginPath(); g.roundRect(s.bulletX, pivotY + L - 5, 18, 10, 4); g.fill();
    }

    /* Height annotation */
    const h = L * (1 - Math.cos(s.pendθ));
    if (h > 5) {
      g.strokeStyle = "#22d3ee"; g.lineWidth = 1; g.setLineDash([4, 4]);
      g.beginPath(); g.moveTo(pivotX, pivotY + L); g.lineTo(blockX, pivotY + L); g.stroke();
      g.beginPath(); g.moveTo(blockX, blockY); g.lineTo(blockX, pivotY + L); g.stroke();
      g.setLineDash([]);
      lbl(g, `h=${h.toFixed(1)}px`, blockX + 40, pivotY + L - h / 2, "#22d3ee", 10, "left");
    }

    /* Physics */
    const vAfter = (bulletM * bulletV) / (bulletM + blockM);
    const hMax   = (vAfter * vAfter) / (2 * 9.8);
    lbl(g, `v_after = m_b·v_b/(m_b+M) = ${vAfter.toFixed(3)} m/s`, W / 2, H - 32, "#94a3b8", 10);
    lbl(g, `Height h = v²/(2g) = ${hMax.toFixed(4)} m  |  Bullet speed = ${bulletV} m/s measured via pendulum!`, W / 2, H - 14, "#64748b", 10);

    if (!s.fired) lbl(g, "Press FIRE to launch bullet", W / 2, H * 0.5, "#6366f1", 13);

    raf.current = requestAnimationFrame(draw);
  }, [bulletM, bulletV, blockM]);

  useEffect(() => {
    ph.current = { bulletX: 50, fired: false, bv: 0, pendθ: 0, pendω: 0, done: false };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card tag="E5-04" title="Ballistic Pendulum — Measuring Bullet Speed" desc="Bullet embeds in block → transfers momentum → pendulum swings up height h. Measuring h lets us calculate v_bullet = (m_b+M)/m_b × √(2gh). Classic physics experiment!">
      <canvas ref={cvs} width={700} height={320} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b", alignItems: "end" }}>
        <Sld label="Bullet Mass (g)" value={bulletM * 1000} min={5} max={100} color="#fbbf24" onChange={(v) => setBulletM(v / 1000)} />
        <Sld label="Bullet Speed (m/s)" value={bulletV} min={50} max={600} step={10} color="#ef4444" onChange={setBulletV} />
        <Sld label="Block Mass (kg)" value={blockM} min={1} max={20} color="#f59e0b" onChange={setBlockM} />
        <button onClick={fire} style={{ padding: "12px 16px", borderRadius: 8, background: "#dc2626", color: "#fff", border: "none", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>🔫 FIRE</button>
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E5-5 — Rocket Propulsion Equation (Tsiolkovsky)
 * Δv = v_e · ln(m_0 / m_f)   (continuous mass ejection)
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_RocketEquation() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [ve, setVe]       = useState(3000);
  const [burnRate, setBurn] = useState(5);
  const [m0, setM0]       = useState(1000);
  const ph = useRef({ m: 1000, v: 0, x: 60, trail: [] as number[] });

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;
    const mPropellant = m0 * 0.8; /* 80% propellant */

    if (s.m > m0 - mPropellant) {
      const thrust = ve * burnRate;
      const a      = thrust / s.m - 9.8;
      s.v  = Math.max(0, s.v + a * dt);
      s.m -= burnRate * dt;
    }
    s.x += s.v * dt * 0.015;
    if (s.x > W - 60) s.x = 60;
    s.trail.push(s.v);
    if (s.trail.length > 100) s.trail.shift();

    bg(g, W, H);

    /* Sky */
    const skyGr = g.createLinearGradient(0, 0, 0, H);
    skyGr.addColorStop(0, "rgba(0,0,0,0.9)"); skyGr.addColorStop(1, "rgba(15,23,42,0.5)");
    g.fillStyle = skyGr; g.fillRect(0, 0, W, H);
    /* Stars */
    for (let i = 0; i < 50; i++) {
      g.fillStyle = `rgba(255,255,255,${0.2 + 0.8 * Math.abs(Math.sin(i * 37))})`;
      g.beginPath(); g.arc((i * 137) % W, (i * 97) % H, 1, 0, Math.PI * 2); g.fill();
    }

    /* Velocity graph */
    const gx = W - 190, gy = 40, gw = 175, gh = 100;
    g.fillStyle = "rgba(15,23,42,0.8)"; g.beginPath(); g.roundRect(gx, gy, gw, gh, 8); g.fill();
    g.strokeStyle = "#1e293b"; g.lineWidth = 1; g.strokeRect(gx, gy, gw, gh);
    lbl(g, "v(t)", gx + gw / 2, gy + 12, "#64748b", 9);
    if (s.trail.length > 1) {
      const maxV = Math.max(...s.trail, 100);
      g.strokeStyle = "#22d3ee"; g.lineWidth = 2;
      g.beginPath();
      s.trail.forEach((v, i) => {
        const tx = gx + (i / s.trail.length) * gw;
        const ty = gy + gh - (v / maxV) * (gh - 20) - 5;
        if (i === 0) g.moveTo(tx, ty); else g.lineTo(tx, ty);
      });
      g.stroke();
    }

    /* Rocket */
    const ry = H / 2 + 20;
    const rx = s.x;
    const mFrac = (s.m - (m0 * 0.2)) / (m0 * 0.8);
    g.fillStyle = "#dc2626"; g.beginPath(); g.moveTo(rx + 60, ry); g.lineTo(rx + 75, ry - 8); g.lineTo(rx + 75, ry + 8); g.closePath(); g.fill();
    const bodyGr = g.createLinearGradient(rx, ry - 14, rx + 60, ry + 14);
    bodyGr.addColorStop(0, "#94a3b8"); bodyGr.addColorStop(1, "#475569");
    g.fillStyle = bodyGr; g.fillRect(rx, ry - 14, 60, 28);
    /* Fuel level indicator */
    g.fillStyle = "#0ea5e9"; g.fillRect(rx + 4, ry - 10, Math.max(0, 52 * mFrac), 20);
    g.strokeStyle = "#e2e8f0"; g.lineWidth = 1; g.strokeRect(rx, ry - 14, 60, 28);
    /* Exhaust */
    if (s.m > m0 * 0.2) {
      g.fillStyle = "rgba(251,146,60,0.7)"; g.beginPath(); g.ellipse(rx - 10, ry, 6, 14, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = "rgba(253,224,71,0.5)"; g.beginPath(); g.ellipse(rx - 14, ry, 3, 8, 0, 0, Math.PI * 2); g.fill();
    }
    lbl(g, `${s.m.toFixed(0)}kg`, rx + 30, ry + 3, "#fff", 9);

    /* Tsiolkovsky Δv */
    const mf = Math.max(m0 * 0.2, s.m);
    const deltaV = ve * Math.log(m0 / mf);
    lbl(g, `Δv = ve·ln(m₀/mf) = ${ve}·ln(${m0}/${mf.toFixed(0)}) = ${deltaV.toFixed(0)} m/s`, W / 2, H - 28, "#94a3b8", 10);
    lbl(g, `Current v=${s.v.toFixed(1)} m/s  |  Mass remaining: ${s.m.toFixed(0)}/${m0}kg  |  Tsiolkovsky Rocket Equation`, W / 2, H - 10, "#64748b", 10);

    raf.current = requestAnimationFrame(draw);
  }, [ve, burnRate, m0]);

  useEffect(() => {
    ph.current = { m: m0, v: 0, x: 60, trail: [] };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw, m0]);

  return (
    <Card tag="E5-05" title="Rocket Equation — Continuous Momentum Transfer" desc="Tsiolkovsky's equation: Δv = ve·ln(m₀/mf). Each kilogram of exhaust carries away momentum, accelerating the rocket. More exhaust speed AND more propellant ratio → higher Δv.">
      <canvas ref={cvs} width={700} height={300} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <Sld label="Exhaust Speed ve (m/s)" value={ve} min={500} max={6000} step={100} color="#22d3ee" onChange={(v) => { setVe(v); ph.current.m = m0; ph.current.v = 0; ph.current.trail = []; }} />
        <Sld label="Burn Rate (kg/s)" value={burnRate} min={1} max={20} color="#f59e0b" onChange={setBurn} />
        <Sld label="Initial Mass m₀ (kg)" value={m0} min={200} max={3000} step={100} color="#a78bfa" onChange={(v) => { setM0(v); ph.current = { m: v, v: 0, x: 60, trail: [] }; }} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E5-6 — Pool Table: 2D Glancing Collision
 * Components of momentum conserved independently in x and y directions
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_PoolCollision() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [impactAngle, setAngle] = useState(30);
  const ph = useRef({ x1: 120, y1: 0, vx1: 4, vy1: 0, x2: 0, y2: 0, vx2: 0, vy2: 0, collided: false });

  const reset = () => {
    const cy = 0;
    ph.current = { x1: 120, y1: cy, vx1: 4, vy1: 0, x2: 0, y2: 0, vx2: 0, vy2: 0, collided: false };
  };

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;
    const R  = 18;
    const cx = W / 2, cy = H / 2;
    const θ  = (impactAngle * Math.PI) / 180;

    /* Target ball offset by angle */
    const target = { x: cx + Math.cos(θ) * 0, y: cy + Math.sin(θ) * 0 };

    /* Move cue ball */
    if (!s.collided) {
      s.x1 += s.vx1 * dt * 30;
      s.y1 += s.vy1 * dt * 30;
      /* Collision: when cue reaches center */
      const dist = Math.sqrt((s.x1 - cx) ** 2 + (s.y1 - cy) ** 2);
      if (dist < R * 2) {
        s.collided = true;
        /* Elastic collision with stationary ball, mass equal */
        /* Cue transfers all velocity along impact direction, retains perpendicular */
        const nx = Math.cos(θ), ny = Math.sin(θ);
        const vParallel = s.vx1 * nx + s.vy1 * ny;
        s.vx2 = vParallel * nx;
        s.vy2 = vParallel * ny;
        s.vx1 -= s.vx2;
        s.vy1 -= s.vy2;
        s.x2 = cx; s.y2 = cy;
      }
    } else {
      s.x1 += s.vx1 * dt * 30;
      s.y1 += s.vy1 * dt * 30;
      s.x2 += s.vx2 * dt * 30;
      s.y2 += s.vy2 * dt * 30;
    }

    bg(g, W, H);

    /* Pool table */
    const feltGr = g.createLinearGradient(0, 0, W, H);
    feltGr.addColorStop(0, "rgba(22,101,52,0.3)"); feltGr.addColorStop(1, "rgba(15,74,38,0.4)");
    g.fillStyle = feltGr; g.fillRect(40, 40, W - 80, H - 80);
    g.strokeStyle = "#166534"; g.lineWidth = 3; g.strokeRect(40, 40, W - 80, H - 80);

    /* Target ball static or moving */
    const tx = s.collided ? s.x2 : cx;
    const ty = s.collided ? s.y2 : cy;
    const b2G = g.createRadialGradient(tx - 5, ty - 5, 2, tx, ty, R);
    b2G.addColorStop(0, "#f59e0b"); b2G.addColorStop(1, "#b45309");
    g.fillStyle = b2G; g.beginPath(); g.arc(tx, ty, R, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#fcd34d"; g.lineWidth = 1.5; g.beginPath(); g.arc(tx, ty, R, 0, Math.PI * 2); g.stroke();
    if (s.collided && (Math.abs(s.vx2) + Math.abs(s.vy2)) > 0.1) {
      arrow(g, tx, ty, tx + s.vx2 * 12, ty + s.vy2 * 12, "#f59e0b", 2.5, 10);
    }

    /* Cue ball */
    const b1G = g.createRadialGradient(s.x1 + cx - 5, s.y1 + cy - 5, 2, s.x1 + cx, s.y1 + cy, R);
    b1G.addColorStop(0, "#f8fafc"); b1G.addColorStop(1, "#94a3b8");
    g.fillStyle = b1G; g.beginPath(); g.arc(s.x1 + cx, s.y1 + cy, R, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#cbd5e1"; g.lineWidth = 1.5; g.beginPath(); g.arc(s.x1 + cx, s.y1 + cy, R, 0, Math.PI * 2); g.stroke();
    if ((Math.abs(s.vx1) + Math.abs(s.vy1)) > 0.1) {
      arrow(g, s.x1 + cx, s.y1 + cy, s.x1 + cx + s.vx1 * 12, s.y1 + cy + s.vy1 * 12, "#f8fafc", 2, 8);
    }

    /* Impact line */
    if (!s.collided) {
      g.strokeStyle = "rgba(99,102,241,0.3)"; g.lineWidth = 1; g.setLineDash([4, 4]);
      g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(θ) * 100, cy + Math.sin(θ) * 100); g.stroke();
      g.setLineDash([]);
      lbl(g, `θ=${impactAngle}°`, cx + Math.cos(θ) * 60, cy + Math.sin(θ) * 60 - 10, "#818cf8", 10);
    }

    lbl(g, "p_x and p_y conserved independently in 2D elastic collision", W / 2, H - 28, "#94a3b8", 11);
    lbl(g, `Impact angle θ = ${impactAngle}° → cue deflects ${90 - impactAngle}° from original path (equal mass elastic)`, W / 2, H - 10, "#64748b", 10);

    raf.current = requestAnimationFrame(draw);
  }, [impactAngle]);

  useEffect(() => {
    reset();
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card tag="E5-06" title="2D Pool Collision — Momentum Conserved in Both Axes" desc="In 2D collisions, momentum is conserved independently in x AND y. Equal mass elastic: after collision, balls always separate at 90° from each other.">
      <canvas ref={cvs} width={700} height={320} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <Sld label="Impact Angle θ (°)" value={impactAngle} min={0} max={80} color="#818cf8" onChange={setAngle} />
        <button onClick={reset} style={{ padding: "0 20px", borderRadius: 8, background: "#166534", color: "#fff", border: "none", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>↺ Reset</button>
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E5-7 — Momentum Comparison: Elastic vs Inelastic vs Explosion
 * Side-by-side comparison of all three types
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_MomentumComparison() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [m1, setM1] = useState(4);
  const [m2, setM2] = useState(6);
  const [v, setV]   = useState(5);
  const t = useRef(0);

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    t.current += 0.016;

    /* Elastic collision results */
    const v1_el = ((m1 - m2) * v) / (m1 + m2);
    const v2_el = (2 * m1 * v) / (m1 + m2);
    /* Inelastic */
    const vf_in = (m1 * v) / (m1 + m2);
    /* Explosion from rest */
    const v2_ex = (m1 * 5) / m2; /* assume impulse gives m1 v=5 */

    const scenarios = [
      { label: "Elastic", col: "#22d3ee", v1: v1_el, v2: v2_el, p: m1 * v1_el + m2 * v2_el },
      { label: "Inelastic", col: "#f59e0b", v1: vf_in, v2: vf_in, p: (m1 + m2) * vf_in },
      { label: "Explosion", col: "#ef4444", v1: -5, v2: v2_ex, p: m1 * -5 + m2 * v2_ex },
    ];

    bg(g, W, H);

    const rowH = (H - 80) / 3;

    scenarios.forEach(({ label, col, v1, v2, p }, i) => {
      const ry = 50 + i * rowH + rowH / 2;
      /* Row background */
      g.fillStyle = "rgba(15,23,42,0.6)"; g.beginPath(); g.roundRect(16, ry - 36, W - 32, 72, 8); g.fill();
      g.strokeStyle = col + "40"; g.lineWidth = 1; g.strokeRect(16, ry - 36, W - 32, 72);
      /* Label */
      lbl(g, label, 60, ry, col, 12);
      /* Balls */
      /* Before: m1 moving right */
      const bx1 = 160; g.fillStyle = col; g.beginPath(); g.arc(bx1, ry, 14, 0, Math.PI * 2); g.fill();
      lbl(g, `${m1}kg`, bx1, ry + 3, "#fff", 9);
      arrow(g, bx1 + 14, ry, bx1 + 50, ry, col, 2, 8);
      lbl(g, `${v}m/s`, bx1 + 38, ry - 12, col, 8);
      /* m2 at rest */
      const bx2 = 260; g.fillStyle = "#334155"; g.beginPath(); g.arc(bx2, ry, 16, 0, Math.PI * 2); g.fill();
      g.strokeStyle = col + "80"; g.lineWidth = 1; g.beginPath(); g.arc(bx2, ry, 16, 0, Math.PI * 2); g.stroke();
      lbl(g, `${m2}kg`, bx2, ry + 3, "#fff", 9);
      /* Arrow divider */
      lbl(g, "→", 320, ry + 4, "#475569", 18);
      /* After */
      if (label === "Inelastic") {
        const ax = 400;
        const gr2 = g.createLinearGradient(ax - 22, ry - 14, ax + 22, ry + 14);
        gr2.addColorStop(0, col + "dd"); gr2.addColorStop(1, col + "77");
        g.fillStyle = gr2; g.beginPath(); g.roundRect(ax - 22, ry - 14, 44, 28, 6); g.fill();
        lbl(g, `${m1 + m2}kg`, ax, ry + 3, "#fff", 9);
        arrow(g, ax + 22, ry, ax + 22 + Math.min(vf_in * 10, 60), ry, col, 2, 8);
        lbl(g, `${vf_in.toFixed(2)}m/s`, ax + 44, ry - 12, col, 8, "left");
      } else {
        const ax1 = 390, ax2 = 500;
        g.fillStyle = col; g.beginPath(); g.arc(ax1, ry, 14, 0, Math.PI * 2); g.fill();
        g.fillStyle = col + "aa"; g.beginPath(); g.arc(ax2, ry, 16, 0, Math.PI * 2); g.fill();
        lbl(g, `${m1}kg`, ax1, ry + 3, "#fff", 9);
        lbl(g, `${m2}kg`, ax2, ry + 3, "#fff", 9);
        if (v1 < 0) { arrow(g, ax1 - 14, ry, ax1 - 14 + v1 * 8, ry, col, 2, 8); lbl(g, `${v1.toFixed(1)}m/s`, ax1 - 50, ry - 12, col, 8); }
        else if (v1 > 0.1) { arrow(g, ax1 + 14, ry, ax1 + 14 + v1 * 8, ry, col, 2, 8); lbl(g, `${v1.toFixed(1)}m/s`, ax1 + 40, ry - 12, col, 8, "left"); }
        arrow(g, ax2 + 16, ry, ax2 + 16 + Math.min(v2 * 7, 80), ry, col, 2, 8);
        lbl(g, `${v2.toFixed(1)}m/s`, ax2 + 55, ry - 12, col, 8, "left");
      }
      /* Momentum */
      lbl(g, `Δp=${(p - m1 * (label === "Explosion" ? 0 : v)).toFixed(2)}  Total=${p.toFixed(2)} kg·m/s`, W - 16, ry + 3, col, 9, "right");
    });

    lbl(g, `In ALL cases: total momentum is CONSERVED. KE may be lost (inelastic) or gained (explosion).`, W / 2, H - 14, "#94a3b8", 11);

    raf.current = requestAnimationFrame(draw);
  }, [m1, m2, v]);

  useEffect(() => { raf.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(raf.current); }, [draw]);

  return (
    <Card tag="E5-07" title="Comparison: Elastic / Inelastic / Explosion" desc="All three types conserve momentum. Elastic: KE also conserved. Inelastic: KE lost. Explosion: KE increases (from chemical/stored energy). Momentum is ALWAYS conserved in an isolated system.">
      <canvas ref={cvs} width={700} height={310} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
        <Sld label="Mass m₁ (kg)" value={m1} min={1} max={15} color="#22d3ee" onChange={setM1} />
        <Sld label="Mass m₂ (kg)" value={m2} min={1} max={15} color="#f59e0b" onChange={setM2} />
        <Sld label="Initial v₁ (m/s)" value={v} min={1} max={12} color="#a78bfa" onChange={setV} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E5-8 — Astronaut Pushes Off a Spacecraft
 * Action-reaction = momentum conservation in zero gravity
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_AstronautPush() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [astronautM, setAM] = useState(90);
  const [spacecraftM, setSM] = useState(500);
  const [pushForce, setForce] = useState(200);
  const ph = useRef({ ax: 0, sx: 0, av: 0, sv: 0, pushing: false, pushTimer: 0, t: 0 });

  const doPush = () => {
    ph.current = { ax: 0, sx: 0, av: 0, sv: 0, pushing: true, pushTimer: 0, t: 0 };
  };

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;
    s.t += dt;

    if (s.pushing) {
      s.pushTimer += dt;
      if (s.pushTimer < 0.3) { /* 300ms push */
        s.av += (pushForce / astronautM) * dt;
        s.sv -= (pushForce / spacecraftM) * dt;
      }
    }
    s.ax += s.av * dt * 20;
    s.sx += s.sv * dt * 20;

    bg(g, W, H);

    /* Space */
    for (let i = 0; i < 80; i++) {
      g.fillStyle = `rgba(255,255,255,${0.1 + 0.9 * Math.abs(Math.sin(i * 37))})`;
      g.beginPath(); g.arc((i * 137) % W, (i * 97) % H, 0.8 + (i % 2) * 0.5, 0, Math.PI * 2); g.fill();
    }

    const cx = W / 2, cy = H / 2;

    /* Spacecraft */
    const sx2 = cx - 120 + s.sx;
    g.fillStyle = "#374151"; g.beginPath(); g.roundRect(sx2 - 60, cy - 30, 120, 60, 10); g.fill();
    g.strokeStyle = "#6b7280"; g.lineWidth = 2; g.beginPath(); g.roundRect(sx2 - 60, cy - 30, 120, 60, 10); g.stroke();
    /* Solar panels */
    g.fillStyle = "#1d4ed8"; g.fillRect(sx2 - 110, cy - 14, 50, 28); g.fillRect(sx2 + 60, cy - 14, 50, 28);
    /* Windows */
    g.fillStyle = "#0ea5e9"; g.beginPath(); g.arc(sx2 - 20, cy, 10, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.arc(sx2 + 20, cy, 10, 0, Math.PI * 2); g.fill();
    lbl(g, `${spacecraftM}kg`, sx2, cy + 4, "#fff", 10);
    if (Math.abs(s.sv) > 0.01) {
      arrow(g, sx2, cy - 46, sx2 + s.sv * 8, cy - 46, "#ef4444", 2.5, 10);
      lbl(g, `${s.sv.toFixed(3)}m/s`, sx2 + s.sv * 8 + 5, cy - 50, "#ef4444", 9, "left");
    }

    /* Astronaut */
    const ax2 = cx + 80 + s.ax;
    g.fillStyle = "#e2e8f0"; g.beginPath(); g.arc(ax2, cy - 15, 13, 0, Math.PI * 2); g.fill(); /* helmet */
    g.fillStyle = "#1d4ed8"; g.beginPath(); g.roundRect(ax2 - 12, cy - 2, 24, 32, 4); g.fill(); /* suit */
    g.fillStyle = "#e2e8f0"; g.beginPath(); g.arc(ax2, cy - 12, 8, 0, Math.PI * 2); g.fill(); /* visor */
    g.fillStyle = "#0ea5e9"; g.beginPath(); g.arc(ax2, cy - 12, 5, 0, Math.PI * 2); g.fill();
    if (s.pushing && s.pushTimer < 0.3) {
      g.strokeStyle = "#fca5a5"; g.lineWidth = 2.5; g.lineCap = "round";
      g.beginPath(); g.moveTo(ax2 - 12, cy + 8); g.lineTo(ax2 - 30, cy + 14); g.stroke();
    }
    lbl(g, `${astronautM}kg`, ax2, cy + 44, "#94a3b8", 10);
    if (Math.abs(s.av) > 0.01) {
      arrow(g, ax2, cy - 38, ax2 + s.av * 8, cy - 38, "#10b981", 2.5, 10);
      lbl(g, `${s.av.toFixed(3)}m/s`, ax2 + s.av * 8 + 5, cy - 42, "#10b981", 9, "left");
    }

    if (!s.pushing) lbl(g, "Press PUSH to separate", W / 2, H * 0.2, "#6366f1", 13);

    const v_a = (pushForce * 0.3) / astronautM;
    const v_s = -(pushForce * 0.3) / spacecraftM;
    lbl(g, `p_astronaut + p_spacecraft = ${(astronautM * v_a + spacecraftM * v_s).toFixed(3)} kg·m/s ≈ 0`, W / 2, H - 14, "#94a3b8", 11);

    raf.current = requestAnimationFrame(draw);
  }, [astronautM, spacecraftM, pushForce]);

  useEffect(() => {
    ph.current = { ax: 0, sx: 0, av: 0, sv: 0, pushing: false, pushTimer: 0, t: 0 };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card tag="E5-08" title="Astronaut Pushes Off Spacecraft in Space" desc="In zero gravity: push force creates equal reactions. Total momentum = 0 before = 0 after. Lighter astronaut moves faster than heavy spacecraft. Newton's 3rd Law = momentum conservation!">
      <canvas ref={cvs} width={700} height={300} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b", alignItems: "end" }}>
        <Sld label="Astronaut Mass (kg)" value={astronautM} min={50} max={150} color="#10b981" onChange={setAM} />
        <Sld label="Spacecraft Mass (kg)" value={spacecraftM} min={200} max={2000} step={50} color="#22d3ee" onChange={setSM} />
        <Sld label="Push Force (N)" value={pushForce} min={50} max={500} step={25} color="#a78bfa" onChange={setForce} />
        <button onClick={doPush} style={{ padding: "12px 16px", borderRadius: 8, background: "#2563eb", color: "#fff", border: "none", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>🚀 PUSH</button>
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * SIM E5-9 — Car Crash Analysis (Real-World Momentum)
 * Before: m1v1 + m2v2  After: (m1+m2)vf  — crumple zones
 * ══════════════════════════════════════════════════════════════════════ */
function Sim_CarCrash() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [m1, setM1]   = useState(1200);
  const [m2, setM2]   = useState(1500);
  const [v1, setV1]   = useState(15);
  const [v2, setV2]   = useState(-10);
  const ph = useRef({ c1x: 0, c2x: 0, cv1: 15, cv2: -10, crashed: false, deformTimer: 0 });

  const reset = () => { ph.current = { c1x: 0, c2x: 0, cv1: v1, cv2: v2, crashed: false, deformTimer: 0 }; };

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const g = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const s = ph.current;
    const dt = 0.016;

    if (!s.crashed) {
      s.c1x += s.cv1 * dt * 2.5;
      s.c2x += s.cv2 * dt * 2.5;
      /* Collision at x offset ~= 200 */
      if (s.c1x - s.c2x > 240) {
        s.crashed = true;
        const vf = (m1 * v1 + m2 * v2) / (m1 + m2);
        s.cv1 = vf; s.cv2 = vf;
      }
    } else {
      s.deformTimer += dt;
      s.c1x += s.cv1 * dt * 2.5;
      s.c2x += s.cv1 * dt * 2.5;
    }

    bg(g, W, H);

    /* Road */
    g.fillStyle = "#1f2937"; g.fillRect(0, H * 0.6, W, H * 0.4);
    g.fillStyle = "#374151"; g.fillRect(0, H * 0.6, W, 8);
    for (let x = 0; x < W; x += 80) {
      g.fillStyle = "#fbbf24"; g.fillRect(x + ((s.c1x + s.c2x) * 0.2) % 80, H * 0.6 + 30, 40, 5);
    }

    const cx = W / 2, cy = H * 0.6 - 30;

    /* Car 1 (red, from left) */
    const c1x2 = cx - 160 + s.c1x;
    const deform1 = s.crashed ? Math.min(s.deformTimer * 30, 20) : 0;
    g.fillStyle = "#dc2626"; g.beginPath(); g.roundRect(c1x2 - 50, cy - 28, 100 - deform1, 34, 6); g.fill();
    g.fillStyle = "#bfdbfe"; g.beginPath(); g.roundRect(c1x2 - 38, cy - 24, 32, 18, 4); g.fill();
    g.beginPath(); g.roundRect(c1x2, cy - 24, 32, 18, 4); g.fill();
    g.fillStyle = "#1f2937";
    g.beginPath(); g.arc(c1x2 - 30, cy + 6, 10, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.arc(c1x2 + 30, cy + 6, 10, 0, Math.PI * 2); g.fill();
    lbl(g, `${(m1 / 1000).toFixed(1)}t`, c1x2, cy - 6, "#fff", 10);
    if (!s.crashed) arrow(g, c1x2 + 50, cy - 40, c1x2 + 50 + s.cv1 * 3, cy - 40, "#22d3ee", 2.5, 10);
    lbl(g, `${s.cv1.toFixed(1)}m/s`, c1x2 + 50, cy - 52, "#22d3ee", 9, s.cv1 > 0 ? "left" : "right");

    /* Car 2 (blue, from right) */
    const c2x2 = cx + 160 + s.c2x;
    const deform2 = s.crashed ? Math.min(s.deformTimer * 30, 20) : 0;
    g.fillStyle = "#2563eb"; g.beginPath(); g.roundRect(c2x2 - 50 + deform2, cy - 28, 100 - deform2, 34, 6); g.fill();
    g.fillStyle = "#bfdbfe"; g.beginPath(); g.roundRect(c2x2 - 38, cy - 24, 32, 18, 4); g.fill();
    g.beginPath(); g.roundRect(c2x2, cy - 24, 32, 18, 4); g.fill();
    g.fillStyle = "#1f2937";
    g.beginPath(); g.arc(c2x2 - 30, cy + 6, 10, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.arc(c2x2 + 30, cy + 6, 10, 0, Math.PI * 2); g.fill();
    lbl(g, `${(m2 / 1000).toFixed(1)}t`, c2x2, cy - 6, "#fff", 10);
    if (!s.crashed) arrow(g, c2x2 - 50, cy - 40, c2x2 - 50 + s.cv2 * 3, cy - 40, "#22d3ee", 2.5, 10);

    if (s.crashed) {
      lbl(g, "CRASH!", cx, H * 0.25, "#ef4444", 18);
      const vf = (m1 * v1 + m2 * v2) / (m1 + m2);
      lbl(g, `Both move at vf = ${vf.toFixed(2)} m/s`, cx, H * 0.35, "#10b981", 13);
      /* Crumple zone */
      g.strokeStyle = "rgba(239,68,68,0.5)"; g.lineWidth = 3;
      for (let i = 0; i < 5; i++) {
        g.beginPath(); g.moveTo(c1x2 + 50 - deform1 / 2, cy - 28 + i * 7);
        g.lineTo(c1x2 + 50 - deform1 / 2 + (Math.random() - 0.5) * 12, cy - 28 + i * 7 + 5); g.stroke();
      }
    }

    const vf_theory = (m1 * v1 + m2 * v2) / (m1 + m2);
    const ke_before = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;
    const ke_after  = 0.5 * (m1 + m2) * vf_theory * vf_theory;
    lbl(g, `p = ${(m1 * v1 + m2 * v2).toFixed(0)} kg·m/s → vf = ${vf_theory.toFixed(2)} m/s  |  ΔKE = ${(ke_before - ke_after).toFixed(0)} J (deformation energy)`, W / 2, H - 14, "#94a3b8", 10);

    raf.current = requestAnimationFrame(draw);
  }, [m1, m2, v1, v2]);

  useEffect(() => {
    ph.current = { c1x: 0, c2x: 0, cv1: v1, cv2: v2, crashed: false, deformTimer: 0 };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw, v1, v2]);

  return (
    <Card tag="E5-09" title="Car Crash Analysis — Real-World Momentum" desc="Head-on collision: total momentum conserved. KE lost goes into crumpling, heat, and sound. Crumple zones extend impact time, reducing the peak deceleration force on occupants.">
      <canvas ref={cvs} width={700} height={300} style={{ width: "100%", borderRadius: 10, border: "1px solid #1e293b", display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 10, marginTop: 12, padding: "12px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b", alignItems: "end" }}>
        <Sld label="Car 1 (kg)" value={m1} min={800} max={3000} step={100} color="#ef4444" onChange={setM1} />
        <Sld label="Car 2 (kg)" value={m2} min={800} max={3000} step={100} color="#3b82f6" onChange={setM2} />
        <Sld label="v₁ (m/s)" value={v1} min={5} max={30} color="#ef4444" onChange={setV1} />
        <Sld label="v₂ (m/s)" value={v2} min={-30} max={-5} color="#3b82f6" onChange={setV2} />
        <button onClick={reset} style={{ padding: "12px 14px", borderRadius: 8, background: "#334155", color: "#94a3b8", border: "1px solid #475569", fontWeight: 700, cursor: "pointer" }}>↺</button>
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * MAIN EXPORT
 * ══════════════════════════════════════════════════════════════════════ */
export function AdvancedTopic5ExtraSims() {
  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, padding: "14px 20px", background: "linear-gradient(90deg,rgba(167,139,250,0.12),rgba(99,102,241,0.08))", borderRadius: 12, border: "1px solid rgba(167,139,250,0.2)" }}>
        <div style={{ background: "rgba(167,139,250,0.2)", color: "#c4b5fd", fontSize: 11, fontWeight: 800, padding: "5px 12px", borderRadius: 8, whiteSpace: "nowrap" }}>EXTRA SIMS 1–9</div>
        <div>
          <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 15 }}>Topic 5 — Conservation of Momentum Extended Lab</div>
          <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>Elastic · Inelastic · Explosion · Ballistic Pendulum · Rocket Eq · 2D Pool · Comparison · Astronaut · Car Crash</div>
        </div>
      </div>
      <Sim_ElasticCollision />
      <Sim_InelasticCollision />
      <Sim_Explosion />
      <Sim_BallisticPendulumAdvanced />
      <Sim_RocketEquation />
      <Sim_PoolCollision />
      <Sim_MomentumComparison />
      <Sim_AstronautPush />
      <Sim_CarCrash />
    </div>
  );
}
