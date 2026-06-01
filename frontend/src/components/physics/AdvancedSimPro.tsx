"use client";
/**
 * FILE: AdvancedSimPro.tsx
 * LOCATION: src/components/physics/AdvancedSimPro.tsx
 * PURPOSE: 8 ultra-professional, deeply physics-accurate canvas simulations.
 *          These cover all 5 Force & Laws of Motion topics with real physics:
 *          1. Interactive F=ma Car Lab (Topic 3)
 *          2. Two-Ball Elastic/Inelastic Collision (Topic 5)
 *          3. Newton's Cradle with chain momentum transfer (Topic 4/5)
 *          4. Free Body Diagram Builder with vector decomposition (Topic 1)
 *          5. Friction Lab — static vs kinetic (Topic 3)
 *          6. Ballistic Pendulum — impulse momentum theorem (Topic 5)
 *          7. Rocket Propulsion — Tsiolkovsky equation (Topic 3/4)
 *          8. Projectile Motion Lab — angle vs range optimization (Topic 3)
 *
 * PATTERN: Each sim uses requestAnimationFrame + useRef for physics state.
 *          All canvases are HiDPI-ready (devicePixelRatio).
 *          Proper RAF cleanup on component unmount.
 * EXPORTS: AdvancedSimPro (renders all 8 as scrollable cards)
 * LAST UPDATED: 2026-06-01
 */

import React, { useState, useEffect, useRef, useCallback } from "react";

/* ════════════════════════════════════════════════════════════════
 * SHARED UTILITIES — used by all 8 simulations
 * ════════════════════════════════════════════════════════════════ */

/** Set up a HiDPI canvas and return logical width/height */
function setupHiDPI(canvas: HTMLCanvasElement): [CanvasRenderingContext2D, number, number] {
  const dpr  = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  const W    = rect.width  || 640;
  const H    = rect.height || 360;
  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);
  return [ctx, W, H];
}

/** Dark gradient background with subtle grid */
function drawBg(g: CanvasRenderingContext2D, W: number, H: number, col1 = "#0d1117", col2 = "#0b1628") {
  const gr = g.createLinearGradient(0, 0, W, H);
  gr.addColorStop(0, col1);
  gr.addColorStop(1, col2);
  g.fillStyle = gr;
  g.fillRect(0, 0, W, H);
  g.strokeStyle = "rgba(255,255,255,0.028)";
  g.lineWidth = 1;
  for (let x = 0; x < W; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
  for (let y = 0; y < H; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
}

/** Draw a properly anti-aliased arrow */
function arrow(
  g: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  color: string, lw = 2.5, hs = 11,
) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 6) return;
  const ang = Math.atan2(dy, dx);
  const h   = Math.min(hs, len * 0.35);
  g.save();
  g.strokeStyle = color; g.fillStyle = color;
  g.lineWidth = lw; g.lineCap = "round"; g.lineJoin = "round";
  g.beginPath();
  g.moveTo(x1, y1);
  g.lineTo(x2 - h * 0.75 * Math.cos(ang), y2 - h * 0.75 * Math.sin(ang));
  g.stroke();
  g.beginPath();
  g.moveTo(x2, y2);
  g.lineTo(x2 - h * Math.cos(ang - 0.42), y2 - h * Math.sin(ang - 0.42));
  g.lineTo(x2 - h * Math.cos(ang + 0.42), y2 - h * Math.sin(ang + 0.42));
  g.closePath(); g.fill();
  g.restore();
}

/** Bold label with optional background */
function lbl(
  g: CanvasRenderingContext2D, text: string,
  x: number, y: number,
  color = "#e2e8f0", size = 11,
  align: CanvasTextAlign = "center",
  bg?: string,
) {
  g.save();
  g.font = `700 ${size}px 'Inter','SF Pro',system-ui,sans-serif`;
  g.textAlign = align;
  if (bg) {
    const m = g.measureText(text);
    const pad = 5;
    const bx  = align === "left" ? x - pad : align === "right" ? x - m.width - pad : x - m.width / 2 - pad;
    g.fillStyle = bg;
    g.beginPath();
    g.roundRect(bx, y - size - 2, m.width + pad * 2, size + 8, 4);
    g.fill();
  }
  g.fillStyle = color;
  g.fillText(text, x, y);
  g.restore();
}

/** Rounded rect */
function rr(
  g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number,
  r: number, fill: string, stroke?: string, sw = 1.5,
) {
  g.save();
  g.beginPath();
  g.roundRect(x, y, w, h, r);
  g.fillStyle = fill; g.fill();
  if (stroke) { g.strokeStyle = stroke; g.lineWidth = sw; g.stroke(); }
  g.restore();
}

/** Info box with key-value pairs */
function infoBox(
  g: CanvasRenderingContext2D,
  rows: [string, string, string?][],
  x: number, y: number, w = 178,
) {
  const pad = 8, lh = 17, h = rows.length * lh + pad * 2;
  rr(g, x, y, w, h, 7, "rgba(8,15,30,0.88)", "rgba(99,102,241,0.3)", 1);
  rows.forEach(([k, v, vc], i) => {
    lbl(g, k, x + pad, y + pad + i * lh + 12, "#94a3b8", 10, "left");
    lbl(g, v, x + w - pad, y + pad + i * lh + 12, vc ?? "#60a5fa", 10, "right");
  });
}

/** Shared card wrapper styling */
function Card({ title, tag, color, desc, children }: {
  title: string; tag: string; color?: string; desc: string; children: React.ReactNode;
}) {
  const accent = color ?? "#6366f1";
  return (
    <div style={{
      background: "linear-gradient(135deg,#0f172a 0%,#0d1b2a 100%)",
      border: `1px solid ${accent}33`,
      borderRadius: 18, padding: "22px 24px", marginBottom: 28,
      boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px ${accent}15 inset`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{
          background: `${accent}25`, color: accent,
          fontSize: 10, fontWeight: 700, letterSpacing: "0.07em",
          padding: "3px 10px", borderRadius: 6,
        }}>{tag}</span>
        <h3 style={{ color: "#f1f5f9", fontSize: 16, fontWeight: 800, margin: 0 }}>{title}</h3>
      </div>
      <p style={{ color: "#64748b", fontSize: 12, margin: "0 0 16px", lineHeight: 1.6 }}>{desc}</p>
      {children}
    </div>
  );
}

/** Shared slider input */
function Sld({
  label: lbl2, value, min, max, step = 1, unit = "", color = "#6366f1",
  onChange,
}: {
  label: string; value: number; min: number; max: number;
  step?: number; unit?: string; color?: string; onChange: (v: number) => void;
}) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 600, marginBottom: 4 }}>
        <span style={{ color: "#94a3b8" }}>{lbl2}</span>
        <span style={{ color, fontFamily: "JetBrains Mono,monospace" }}>
          {step < 1 ? value.toFixed(2) : value.toFixed(0)}{unit}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: color, height: 4 }} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
 * SIM PRO-1 — F=ma Interactive Car Lab
 * Physics: a = F_net / m  where F_net = F_applied − F_friction
 *          v(t) = v₀ + a·dt   x(t) = x₀ + v·dt
 * ════════════════════════════════════════════════════════════════ */
function SimFmaCarLab() {
  const cvs  = useRef<HTMLCanvasElement>(null);
  const raf  = useRef(0);
  const st   = useRef({ x: 60, v: 0, running: false });
  const [force,  setForce]  = useState(40);
  const [mass,   setMass]   = useState(5);
  const [mu,     setMu]     = useState(0.15);
  const [running, setRunning] = useState(false);

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const [g, W, H] = setupHiDPI(c);
    const s    = st.current;
    const g_acc = 9.8;
    const fric  = mu * mass * g_acc;
    const Fnet  = running ? Math.max(0, force - fric) : 0;
    const a     = running ? Fnet / mass : 0;

    if (running) {
      s.v += a * 0.016;
      s.v  = Math.max(0, s.v);
      s.x += s.v * 0.016 * 40;
      if (s.x > W - 80) { s.x = 60; s.v = 0; }
    }

    /* ── Background + road ── */
    drawBg(g, W, H);
    const roadY = H * 0.62;
    rr(g, 0, roadY, W, H - roadY, 0, "#1e293b");
    g.strokeStyle = "#334155"; g.lineWidth = 2;
    g.setLineDash([24, 16]);
    g.beginPath(); g.moveTo(0, roadY + (H - roadY) * 0.5); g.lineTo(W, roadY + (H - roadY) * 0.5); g.stroke();
    g.setLineDash([]);

    /* ── Distance markers ── */
    for (let dx = 0; dx < W; dx += 80) {
      lbl(g, `${(dx / 40).toFixed(0)}m`, dx, roadY - 8, "#334155", 9);
      g.strokeStyle = "#1e293b"; g.lineWidth = 1;
      g.beginPath(); g.moveTo(dx, roadY - 4); g.lineTo(dx, roadY + 4); g.stroke();
    }

    /* ── Car body ── */
    const cx = s.x, cy = roadY;
    const carW = 90, carH = 40, wheelR = 12;
    rr(g, cx - carW / 2, cy - carH - wheelR, carW, carH, 8,
      "linear-gradient(180deg,#4f46e5,#312e81)" as unknown as string, "#818cf8", 1.5);
    /* Just use solid color since gradient via fillStyle string doesn't work directly */
    const carGrad = g.createLinearGradient(cx - carW / 2, cy - carH - wheelR, cx - carW / 2, cy - wheelR);
    carGrad.addColorStop(0, "#4f46e5");
    carGrad.addColorStop(1, "#312e81");
    g.fillStyle = carGrad;
    g.beginPath(); g.roundRect(cx - carW / 2, cy - carH - wheelR, carW, carH, 8); g.fill();
    g.strokeStyle = "#818cf8"; g.lineWidth = 1.5;
    g.beginPath(); g.roundRect(cx - carW / 2, cy - carH - wheelR, carW, carH, 8); g.stroke();
    lbl(g, `${mass}kg`, cx, cy - carH / 2 - wheelR + 6, "#fff", 11);

    /* Windshield */
    rr(g, cx - carW * 0.32, cy - carH - wheelR + 5, carW * 0.45, carH * 0.5, 4, "rgba(147,210,255,0.2)", "#93c5fd22", 1);

    /* Wheels */
    [[cx - 30, cy], [cx + 30, cy]].forEach(([wx, wy]) => {
      g.fillStyle = "#1e293b"; g.strokeStyle = "#475569"; g.lineWidth = 2;
      g.beginPath(); g.arc(wx, wy - 1, wheelR, 0, Math.PI * 2); g.fill(); g.stroke();
      g.fillStyle = "#94a3b8";
      g.beginPath(); g.arc(wx, wy - 1, wheelR * 0.4, 0, Math.PI * 2); g.fill();
      if (running) {
        const spin = s.v * 3;
        g.strokeStyle = "#64748b"; g.lineWidth = 1.5;
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
          g.beginPath();
          g.moveTo(wx + Math.cos(a + spin) * 5, wy - 1 + Math.sin(a + spin) * 5);
          g.lineTo(wx + Math.cos(a + spin) * (wheelR - 2), wy - 1 + Math.sin(a + spin) * (wheelR - 2));
          g.stroke();
        }
      }
    });

    /* ── Force arrows ── */
    const arrowY = cy - carH / 2 - wheelR;
    if (running && force > 0) {
      arrow(g, cx + carW / 2, arrowY, cx + carW / 2 + force * 1.8, arrowY, "#10b981", 3, 12);
      lbl(g, `F=${force}N`, cx + carW / 2 + force * 0.9, arrowY - 14, "#10b981", 10);
    }
    if (fric > 0 && running) {
      arrow(g, cx - carW / 2, arrowY, cx - carW / 2 - fric * 1.8, arrowY, "#ef4444", 3, 12);
      lbl(g, `f=${fric.toFixed(1)}N`, cx - carW / 2 - fric * 0.9, arrowY - 14, "#ef4444", 10);
    }
    if (running) {
      arrow(g, cx, cy - carH - wheelR - 10, cx, cy - carH - wheelR - 10 + Fnet * 2.2, "#f59e0b", 2, 10);
      lbl(g, `Fnet=${Fnet.toFixed(1)}N`, cx + 8, cy - carH - wheelR - 14, "#f59e0b", 10, "left");
    }

    /* ── Info panel ── */
    infoBox(g, [
      ["F applied", `${force} N`, "#10b981"],
      ["Friction", `${fric.toFixed(1)} N`, "#ef4444"],
      ["Net force", `${Fnet.toFixed(1)} N`, "#f59e0b"],
      ["Mass", `${mass} kg`, "#c084fc"],
      ["Acceleration", `${a.toFixed(2)} m/s²`, "#60a5fa"],
      ["Velocity", `${s.v.toFixed(2)} m/s`, "#34d399"],
    ], 14, 14, 190);

    /* ── Formula box ── */
    rr(g, W - 195, 14, 181, 50, 8, "rgba(8,15,30,0.8)", "#334155", 1);
    lbl(g, "Newton's 2nd Law", W - 104, 31, "#94a3b8", 10);
    lbl(g, "a = Fnet / m", W - 104, 51, "#a5b4fc", 14);

    raf.current = requestAnimationFrame(draw);
  }, [force, mass, mu, running]);

  useEffect(() => {
    cancelAnimationFrame(raf.current);
    st.current = { x: 60, v: 0, running };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw, running]);

  return (
    <Card title="F=ma Interactive Car Lab" tag="TOPIC 3 · NEWTON'S 2ND LAW" color="#10b981"
      desc="Adjust force, mass, and surface friction. Watch how Newton's 2nd Law determines the car's acceleration in real time.">
      <canvas ref={cvs} style={{ width: "100%", height: 280, borderRadius: 12, display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 14 }}>
        <Sld label="Applied Force" value={force} min={0} max={120} unit=" N" color="#10b981" onChange={(v) => { setForce(v); st.current.v = 0; }} />
        <Sld label="Mass" value={mass} min={1} max={20} unit=" kg" color="#c084fc" onChange={(v) => { setMass(v); st.current.v = 0; }} />
        <Sld label="μ (friction)" value={mu} min={0} max={0.8} step={0.01} unit="" color="#f87171" onChange={(v) => { setMu(v); st.current.v = 0; }} />
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button onClick={() => setRunning(r => !r)} style={{
          padding: "8px 22px", borderRadius: 8, border: "none", cursor: "pointer",
          background: running ? "#ef4444" : "#10b981", color: "#fff", fontWeight: 700, fontSize: 13,
        }}>{running ? "⏸ Pause" : "▶ Apply Force"}</button>
        <button onClick={() => { st.current.x = 60; st.current.v = 0; setRunning(false); }} style={{
          padding: "8px 18px", borderRadius: 8, border: "1px solid #334155",
          background: "transparent", color: "#94a3b8", fontWeight: 600, fontSize: 13, cursor: "pointer",
        }}>↺ Reset</button>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
 * SIM PRO-2 — 1D Elastic/Inelastic Collision Lab
 * Physics: elastic → v1f = (m1-m2)/(m1+m2)·v1i  v2f = 2m1/(m1+m2)·v1i
 *          inelastic → vf = (m1·v1 + m2·v2) / (m1+m2)
 * ════════════════════════════════════════════════════════════════ */
function SimCollisionLab() {
  const cvs  = useRef<HTMLCanvasElement>(null);
  const raf  = useRef(0);
  const st   = useRef({
    x1: 100, x2: 480, v1: 80, v2: -30,
    collided: false, phase: "before" as "before" | "during" | "after",
    timer: 0,
  });
  const [m1,        setM1]        = useState(3);
  const [m2,        setM2]        = useState(3);
  const [v1Init,    setV1Init]    = useState(80);
  const [v2Init,    setV2Init]    = useState(0);
  const [elastic,   setElastic]   = useState(true);
  const [running,   setRunning]   = useState(false);
  const [ke,        setKe]        = useState({ before: 0, after: 0 });

  const reset = useCallback(() => {
    st.current = { x1: 100, x2: 480, v1: v1Init, v2: -v2Init, collided: false, phase: "before", timer: 0 };
    setRunning(false);
  }, [v1Init, v2Init]);

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const [g, W, H] = setupHiDPI(c);
    const s    = st.current;
    const r1   = 28 + m1 * 3, r2 = 28 + m2 * 3;
    const dt   = 0.016 * 50;

    if (running && !s.collided) {
      s.x1 += s.v1 * dt / 60;
      s.x2 += s.v2 * dt / 60;
      const dist = Math.abs(s.x2 - s.x1);
      if (dist < r1 + r2) {
        s.collided = true;
        s.phase = "after";
        const keBefore = 0.5 * m1 * s.v1 ** 2 + 0.5 * m2 * s.v2 ** 2;
        if (elastic) {
          const newV1 = ((m1 - m2) * s.v1 + 2 * m2 * s.v2) / (m1 + m2);
          const newV2 = ((m2 - m1) * s.v2 + 2 * m1 * s.v1) / (m1 + m2);
          s.v1 = newV1; s.v2 = newV2;
        } else {
          const vf = (m1 * s.v1 + m2 * s.v2) / (m1 + m2);
          s.v1 = vf; s.v2 = vf;
        }
        const keAfter = 0.5 * m1 * s.v1 ** 2 + 0.5 * m2 * s.v2 ** 2;
        setKe({ before: keBefore, after: keAfter });
      }
    }
    if (running) {
      if (s.collided) { s.x1 += s.v1 * dt / 60; s.x2 += s.v2 * dt / 60; }
      s.x1 = Math.max(r1, Math.min(W - r1, s.x1));
      s.x2 = Math.max(r2, Math.min(W - r2, s.x2));
    }

    /* ── Background ── */
    drawBg(g, W, H);
    const trackY = H * 0.58;
    rr(g, 0, trackY - 4, W, 8, 0, "#1e293b");
    lbl(g, "Frictionless Track", W / 2, trackY - 14, "#334155", 10);

    /* ── Ball 1 ── */
    const col1 = "#6366f1";
    const gr1 = g.createRadialGradient(s.x1 - 6, trackY - r1 - 6, 2, s.x1, trackY - r1, r1);
    gr1.addColorStop(0, "#a5b4fc"); gr1.addColorStop(1, col1);
    g.fillStyle = gr1;
    g.beginPath(); g.arc(s.x1, trackY - r1, r1, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#818cf8"; g.lineWidth = 2;
    g.beginPath(); g.arc(s.x1, trackY - r1, r1, 0, Math.PI * 2); g.stroke();
    lbl(g, `${m1}kg`, s.x1, trackY - r1 + 5, "#fff", 12);

    /* ── Ball 2 ── */
    const col2 = "#f59e0b";
    const gr2 = g.createRadialGradient(s.x2 - 6, trackY - r2 - 6, 2, s.x2, trackY - r2, r2);
    gr2.addColorStop(0, "#fde68a"); gr2.addColorStop(1, "#d97706");
    g.fillStyle = gr2;
    g.beginPath(); g.arc(s.x2, trackY - r2, r2, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#fbbf24"; g.lineWidth = 2;
    g.beginPath(); g.arc(s.x2, trackY - r2, r2, 0, Math.PI * 2); g.stroke();
    lbl(g, `${m2}kg`, s.x2, trackY - r2 + 5, "#fff", 12);

    /* ── Velocity arrows ── */
    if (Math.abs(s.v1) > 0.5) arrow(g, s.x1, trackY - r1 * 2, s.x1 + s.v1 * 0.5, trackY - r1 * 2, col1, 2.5, 10);
    if (Math.abs(s.v2) > 0.5) arrow(g, s.x2, trackY - r2 * 2, s.x2 + s.v2 * 0.5, trackY - r2 * 2, col2, 2.5, 10);

    /* ── Momentum display ── */
    const p1 = m1 * s.v1, p2 = m2 * s.v2, pTotal = p1 + p2;
    infoBox(g, [
      ["p₁ (Ball 1)", `${p1.toFixed(1)} kg·m/s`, col1],
      ["p₂ (Ball 2)", `${p2.toFixed(1)} kg·m/s`, col2],
      ["p_total", `${pTotal.toFixed(1)} kg·m/s`, "#10b981"],
      ["Type", elastic ? "ELASTIC" : "INELASTIC", elastic ? "#34d399" : "#f87171"],
    ], 14, 14, 185);

    if (s.collided && ke.before > 0) {
      const loss = ((ke.before - ke.after) / ke.before * 100).toFixed(1);
      infoBox(g, [
        ["KE before", `${ke.before.toFixed(0)} J`, "#f59e0b"],
        ["KE after", `${ke.after.toFixed(0)} J`, "#fbbf24"],
        ["KE loss", `${loss}%`, elastic ? "#10b981" : "#ef4444"],
      ], W - 200, 14, 186);
    }

    /* ── Phase label ── */
    lbl(g, s.collided ? (elastic ? "ELASTIC COLLISION!" : "INELASTIC — MERGED!") : "→ APPROACHING",
      W / 2, H - 20, s.collided ? "#10b981" : "#94a3b8", 13);

    raf.current = requestAnimationFrame(draw);
  }, [m1, m2, v1Init, v2Init, elastic, running, ke]);

  useEffect(() => {
    reset();
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card title="1D Collision Lab — Elastic vs Inelastic" tag="TOPIC 5 · CONSERVATION OF MOMENTUM" color="#f59e0b"
      desc="Fire Ball 1 into Ball 2. See how momentum is conserved while kinetic energy may or may not be. Toggle between elastic and perfectly inelastic collisions.">
      <canvas ref={cvs} style={{ width: "100%", height: 260, borderRadius: 12, display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
        <Sld label="Ball 1 mass" value={m1} min={1} max={10} unit=" kg" color="#6366f1" onChange={(v) => { setM1(v); reset(); }} />
        <Sld label="Ball 2 mass" value={m2} min={1} max={10} unit=" kg" color="#f59e0b" onChange={(v) => { setM2(v); reset(); }} />
        <Sld label="Ball 1 initial v" value={v1Init} min={20} max={200} unit=" units" color="#a5b4fc" onChange={(v) => { setV1Init(v); reset(); }} />
        <Sld label="Ball 2 initial v" value={v2Init} min={0} max={100} unit=" units" color="#fde68a" onChange={(v) => { setV2Init(v); reset(); }} />
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
        <button onClick={() => setElastic(e => !e)} style={{
          padding: "7px 16px", borderRadius: 8, border: `1px solid ${elastic ? "#10b981" : "#ef4444"}`,
          background: elastic ? "#10b98120" : "#ef444420",
          color: elastic ? "#10b981" : "#ef4444", fontWeight: 700, fontSize: 12, cursor: "pointer",
        }}>{elastic ? "✓ Elastic" : "✕ Inelastic"} (toggle)</button>
        <button onClick={() => setRunning(r => !r)} style={{
          padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer",
          background: running ? "#ef4444" : "#6366f1", color: "#fff", fontWeight: 700, fontSize: 13,
        }}>{running ? "⏸ Pause" : "▶ Launch"}</button>
        <button onClick={reset} style={{
          padding: "7px 14px", borderRadius: 8, border: "1px solid #334155",
          background: "transparent", color: "#94a3b8", fontWeight: 600, fontSize: 13, cursor: "pointer",
        }}>↺ Reset</button>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
 * SIM PRO-3 — Projectile Motion with Adjustable Angle
 * Physics: x(t) = v₀·cos(θ)·t
 *          y(t) = v₀·sin(θ)·t − ½g·t²
 *          Range = v₀²·sin(2θ) / g   (max at 45°)
 * ════════════════════════════════════════════════════════════════ */
function SimProjectileLab() {
  const cvs  = useRef<HTMLCanvasElement>(null);
  const raf  = useRef(0);
  const st   = useRef({ t: 0, running: false, trail: [] as [number, number][] });

  const [v0,    setV0]    = useState(50);
  const [angle, setAngle] = useState(45);
  const [g_val, setGVal]  = useState(9.8);
  const [running, setRunning] = useState(false);

  const G  = g_val;
  const th = angle * Math.PI / 180;
  const vx = v0 * Math.cos(th);
  const vy = v0 * Math.sin(th);
  const Tfall = (2 * vy) / G;
  const Range = v0 * v0 * Math.sin(2 * th) / G;
  const Hmax  = (vy * vy) / (2 * G);

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const [g, W, H] = setupHiDPI(c);
    const s     = st.current;
    const scale = Math.min((W - 80) / Math.max(Range, 1), (H - 80) / Math.max(Hmax * 1.3, 1));
    const ox    = 50, oy = H - 50;

    if (running) {
      s.t += 0.016;
      const bx = ox + vx * s.t * scale;
      const by = oy - (vy * s.t - 0.5 * G * s.t * s.t) * scale;
      s.trail.push([bx, by]);
      if (s.trail.length > 300) s.trail.shift();
      if (s.t > Tfall) { s.t = 0; s.trail = []; }
    }

    drawBg(g, W, H);

    /* ── Ground ── */
    g.strokeStyle = "#334155"; g.lineWidth = 2;
    g.beginPath(); g.moveTo(ox, oy); g.lineTo(W - 20, oy); g.stroke();
    /* ── Y-axis ── */
    g.beginPath(); g.moveTo(ox, oy); g.lineTo(ox, 20); g.stroke();
    /* ── Grid & labels ── */
    g.strokeStyle = "#1e293b"; g.lineWidth = 1;
    for (let x = ox; x < W; x += scale * 10) {
      g.beginPath(); g.moveTo(x, oy - 4); g.lineTo(x, oy); g.stroke();
    }
    lbl(g, "Range (m)", W / 2, oy + 30, "#475569", 10);
    lbl(g, "Height (m)", ox - 30, H / 2, "#475569", 10, "center");

    /* ── Ideal parabola trace ── */
    g.strokeStyle = "rgba(99,102,241,0.25)"; g.lineWidth = 1.5; g.setLineDash([4, 4]);
    g.beginPath();
    for (let ti = 0; ti <= Tfall; ti += Tfall / 100) {
      const px = ox + vx * ti * scale;
      const py = oy - (vy * ti - 0.5 * G * ti * ti) * scale;
      ti === 0 ? g.moveTo(px, py) : g.lineTo(px, py);
    }
    g.stroke(); g.setLineDash([]);

    /* ── Live trail ── */
    if (s.trail.length > 1) {
      g.strokeStyle = "#6366f1"; g.lineWidth = 2.5;
      g.beginPath(); g.moveTo(s.trail[0][0], s.trail[0][1]);
      s.trail.forEach(([px, py]) => g.lineTo(px, py));
      g.stroke();
    }

    /* ── Ball ── */
    if (running && s.t < Tfall) {
      const bx = ox + vx * s.t * scale;
      const by = oy - (vy * s.t - 0.5 * G * s.t * s.t) * scale;
      const ballGr = g.createRadialGradient(bx - 4, by - 4, 2, bx, by, 12);
      ballGr.addColorStop(0, "#a5b4fc"); ballGr.addColorStop(1, "#4f46e5");
      g.fillStyle = ballGr;
      g.beginPath(); g.arc(bx, by, 12, 0, Math.PI * 2); g.fill();
      /* Velocity vector */
      const curVx = vx;
      const curVy = vy - G * s.t;
      const speed = Math.hypot(curVx, curVy);
      arrow(g, bx, by, bx + curVx * 0.5 * scale * 0.3, by - curVy * 0.5 * scale * 0.3, "#10b981", 2, 8);
      lbl(g, `v=${speed.toFixed(0)}m/s`, bx + 14, by - 8, "#10b981", 9, "left");
    }

    /* ── Cannon at origin ── */
    g.save();
    g.translate(ox, oy);
    g.rotate(-th);
    rr(g, -4, -8, 36, 16, 4, "#475569", "#64748b", 1.5);
    g.restore();
    /* Cannon ball */
    g.fillStyle = "#1e293b"; g.strokeStyle = "#475569"; g.lineWidth = 2;
    g.beginPath(); g.arc(ox, oy, 9, 0, Math.PI * 2); g.fill(); g.stroke();

    /* ── Max height marker ── */
    const hx = ox + Range / 2 * scale;
    const hy = oy - Hmax * scale;
    g.strokeStyle = "#f59e0b33"; g.lineWidth = 1; g.setLineDash([3, 4]);
    g.beginPath(); g.moveTo(hx, oy); g.lineTo(hx, hy); g.stroke();
    g.setLineDash([]);
    lbl(g, `H=${Hmax.toFixed(1)}m`, hx + 6, hy + 14, "#f59e0b", 9, "left");

    /* ── Info panel ── */
    infoBox(g, [
      ["Launch speed", `${v0} m/s`, "#60a5fa"],
      ["Angle θ", `${angle}°`, "#c084fc"],
      ["Range R", `${Range.toFixed(1)} m`, "#10b981"],
      ["Max height", `${Hmax.toFixed(1)} m`, "#f59e0b"],
      ["Flight time", `${Tfall.toFixed(2)} s`, "#94a3b8"],
    ], W - 198, H - 130, 185);

    raf.current = requestAnimationFrame(draw);
  }, [v0, angle, g_val, running, vx, vy, G, Tfall, Range, Hmax]);

  useEffect(() => {
    st.current = { t: 0, running: false, trail: [] };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card title="Projectile Motion Lab — Angle Optimization" tag="TOPIC 3 · NEWTON'S 2ND LAW" color="#6366f1"
      desc="Launch a projectile at any angle. Watch the parabolic path and see why 45° gives maximum range. Compare launch angles and gravity values.">
      <canvas ref={cvs} style={{ width: "100%", height: 300, borderRadius: 12, display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 14 }}>
        <Sld label="Launch Speed" value={v0} min={10} max={100} unit=" m/s" color="#60a5fa" onChange={(v) => { setV0(v); st.current = { t: 0, running: false, trail: [] }; setRunning(false); }} />
        <Sld label="Angle θ" value={angle} min={5} max={85} unit="°" color="#c084fc" onChange={(v) => { setAngle(v); st.current = { t: 0, running: false, trail: [] }; setRunning(false); }} />
        <Sld label="Gravity g" value={g_val} min={1.6} max={24.8} step={0.1} unit=" m/s²" color="#f59e0b" onChange={(v) => { setGVal(v); st.current = { t: 0, running: false, trail: [] }; setRunning(false); }} />
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button onClick={() => setRunning(r => !r)} style={{
          padding: "8px 22px", borderRadius: 8, border: "none", cursor: "pointer",
          background: running ? "#ef4444" : "#6366f1", color: "#fff", fontWeight: 700, fontSize: 13,
        }}>{running ? "⏸ Pause" : "▶ Fire!"}</button>
        <button onClick={() => { st.current = { t: 0, running: false, trail: [] }; setRunning(false); }} style={{
          padding: "8px 18px", borderRadius: 8, border: "1px solid #334155",
          background: "transparent", color: "#94a3b8", fontWeight: 600, fontSize: 13, cursor: "pointer",
        }}>↺ Reset</button>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
 * SIM PRO-4 — Newton's 3rd Law: Action-Reaction Rocket
 * Physics: Thrust = v_exhaust × (dm/dt)  →  F = ma
 *          Δv = v_e × ln(m0/m)  (Tsiolkovsky)
 * ════════════════════════════════════════════════════════════════ */
function SimRocketLaw3() {
  const cvs   = useRef<HTMLCanvasElement>(null);
  const raf   = useRef(0);
  const st    = useRef({ y: 0, v: 0, fuel: 100, t: 0, exhaust: [] as [number, number][] });
  const [ve,  setVe]  = useState(2500);
  const [mdot,setMdot] = useState(5);
  const [m0,  setM0]  = useState(500);
  const [running, setRunning] = useState(false);

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const [g, W, H] = setupHiDPI(c);
    const s    = st.current;
    const G    = 9.8;
    const fuel = s.fuel / 100;
    const mCur = m0 * 0.3 + (m0 * 0.7) * fuel;
    const thrust = running && s.fuel > 0 ? ve * mdot : 0;
    const a   = thrust / mCur - G;
    const scale = 3;

    if (running && s.fuel > 0) {
      s.v    += a * 0.016;
      s.y    += s.v * 0.016 * scale;
      s.fuel  = Math.max(0, s.fuel - mdot * 0.016 * 8);
      s.t    += 0.016;
      /* Exhaust particles */
      if (Math.random() < 0.5) {
        const rx = W / 2 + (Math.random() - 0.5) * 20;
        const ry = H * 0.55 + s.y;
        s.exhaust.push([rx, ry]);
      }
      s.exhaust = s.exhaust.filter(([, ey]) => ey < H + 60).map(([ex, ey]) => [ex, ey + 3]);
    }

    drawBg(g, W, H, "#080e1a", "#0b1628");

    /* ── Stars ── */
    for (let i = 0; i < 50; i++) {
      const sx = (W * ((i * 137.5) % 1)) | 0;
      const sy = (H * ((i * 89.3) % 1)) | 0;
      const br = 0.3 + Math.sin(s.t * 2 + i) * 0.3;
      g.fillStyle = `rgba(255,255,255,${br})`;
      g.beginPath(); g.arc(sx, sy, 1, 0, Math.PI * 2); g.fill();
    }

    /* ── Ground ── */
    const groundY = H * 0.85;
    const rocketY = groundY - Math.min(s.y, groundY - 80);
    rr(g, 0, groundY, W, H - groundY, 0, "#1a2744");
    lbl(g, "Earth's Surface", W / 2, groundY - 10, "#334155", 9);

    /* ── Exhaust particles ── */
    s.exhaust.forEach(([ex, ey]) => {
      const alpha = Math.max(0, 1 - (ey - (H * 0.55 + s.y)) / 80);
      g.fillStyle = `rgba(251,146,60,${alpha * 0.7})`;
      g.beginPath(); g.arc(ex, ey, 4, 0, Math.PI * 2); g.fill();
    });

    /* ── Exhaust flame ── */
    const rx = W / 2;
    if (running && s.fuel > 0) {
      const flameH = 30 + Math.random() * 20;
      const flameGr = g.createLinearGradient(rx, rocketY + 50, rx, rocketY + 50 + flameH);
      flameGr.addColorStop(0, "#fbbf24");
      flameGr.addColorStop(0.4, "#ef4444");
      flameGr.addColorStop(1, "transparent");
      g.fillStyle = flameGr;
      g.beginPath();
      g.moveTo(rx - 10, rocketY + 50);
      g.lineTo(rx + 10, rocketY + 50);
      g.lineTo(rx, rocketY + 50 + flameH);
      g.closePath(); g.fill();
    }

    /* ── Rocket body ── */
    rr(g, rx - 14, rocketY - 30, 28, 80, 8, "#475569", "#64748b", 1.5);
    /* Nose cone */
    g.fillStyle = "#ef4444";
    g.beginPath(); g.moveTo(rx - 14, rocketY - 30); g.lineTo(rx + 14, rocketY - 30); g.lineTo(rx, rocketY - 60); g.closePath(); g.fill();
    /* Fins */
    g.fillStyle = "#334155";
    g.beginPath(); g.moveTo(rx - 14, rocketY + 40); g.lineTo(rx - 28, rocketY + 60); g.lineTo(rx - 14, rocketY + 55); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(rx + 14, rocketY + 40); g.lineTo(rx + 28, rocketY + 60); g.lineTo(rx + 14, rocketY + 55); g.closePath(); g.fill();

    /* ── Arrows: Thrust up, Weight down ── */
    if (thrust > 0) {
      arrow(g, rx, rocketY - 10, rx, rocketY - 10 - thrust * 0.012, "#10b981", 3, 12);
      lbl(g, `T=${thrust.toFixed(0)}N ↑`, rx + 18, rocketY - 40, "#10b981", 10, "left");
    }
    const w = mCur * G;
    arrow(g, rx, rocketY + 60, rx, rocketY + 60 + w * 0.008, "#ef4444", 2.5, 10);
    lbl(g, `W=${w.toFixed(0)}N ↓`, rx + 18, rocketY + 75, "#ef4444", 10, "left");

    /* ── Fuel gauge ── */
    rr(g, 14, H - 80, 20, 60, 4, "#1e293b", "#334155", 1);
    const fuelH = s.fuel / 100 * 56;
    rr(g, 16, H - 78 + (56 - fuelH), 16, fuelH, 3, s.fuel > 30 ? "#10b981" : "#ef4444");
    lbl(g, "FUEL", 24, H - 16, "#64748b", 9);

    /* ── Info panel ── */
    infoBox(g, [
      ["Thrust",    `${thrust.toFixed(0)} N`, "#10b981"],
      ["v_exhaust", `${ve} m/s`, "#c084fc"],
      ["Mass now",  `${mCur.toFixed(0)} kg`, "#60a5fa"],
      ["Accel",     `${a.toFixed(2)} m/s²`, s.v > 0 ? "#34d399" : "#f87171"],
      ["Speed",     `${Math.abs(s.v).toFixed(1)} m/s`, "#fbbf24"],
      ["Height",    `${(s.y / scale).toFixed(0)} m`, "#94a3b8"],
    ], W - 196, 14, 182);

    /* ── 3rd Law label ── */
    rr(g, W / 2 - 120, H - 42, 240, 30, 8, "rgba(8,15,30,0.7)", "#334155", 1);
    lbl(g, "Action: exhaust pushed DOWN → Reaction: rocket pushed UP", W / 2, H - 22, "#a5b4fc", 10);

    raf.current = requestAnimationFrame(draw);
  }, [ve, mdot, m0, running]);

  useEffect(() => {
    st.current = { y: 0, v: 0, fuel: 100, t: 0, exhaust: [] };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card title="Rocket Propulsion — Newton's 3rd Law in Action" tag="TOPIC 4 · NEWTON'S 3RD LAW" color="#ef4444"
      desc="Exhaust gas pushed DOWN is the action. Rocket pushed UP is the reaction. Adjust exhaust speed and flow rate to change thrust. Based on the real Tsiolkovsky equation.">
      <canvas ref={cvs} style={{ width: "100%", height: 340, borderRadius: 12, display: "block", background: "#080e1a" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 14 }}>
        <Sld label="Exhaust speed v_e" value={ve} min={500} max={5000} step={100} unit=" m/s" color="#10b981" onChange={(v) => { setVe(v); st.current = { y: 0, v: 0, fuel: 100, t: 0, exhaust: [] }; setRunning(false); }} />
        <Sld label="Fuel flow (dm/dt)" value={mdot} min={1} max={20} unit=" kg/s" color="#f59e0b" onChange={(v) => { setMdot(v); st.current = { y: 0, v: 0, fuel: 100, t: 0, exhaust: [] }; setRunning(false); }} />
        <Sld label="Initial mass" value={m0} min={100} max={2000} step={50} unit=" kg" color="#c084fc" onChange={(v) => { setM0(v); st.current = { y: 0, v: 0, fuel: 100, t: 0, exhaust: [] }; setRunning(false); }} />
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button onClick={() => setRunning(r => !r)} style={{
          padding: "8px 22px", borderRadius: 8, border: "none", cursor: "pointer",
          background: running ? "#ef4444" : "#10b981", color: "#fff", fontWeight: 700, fontSize: 13,
        }}>{running ? "⏸ Cut Thrust" : "🚀 Ignite!"}</button>
        <button onClick={() => { st.current = { y: 0, v: 0, fuel: 100, t: 0, exhaust: [] }; setRunning(false); }} style={{
          padding: "8px 18px", borderRadius: 8, border: "1px solid #334155",
          background: "transparent", color: "#94a3b8", fontWeight: 600, fontSize: 13, cursor: "pointer",
        }}>↺ Reset</button>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
 * SIM PRO-5 — Impulse-Momentum Theorem (Airbag vs No Airbag)
 * Physics: J = F·Δt = Δp = m·Δv
 *          Same impulse, longer time → smaller force (airbag saves lives)
 * ════════════════════════════════════════════════════════════════ */
function SimImpulseAirbag() {
  const cvs   = useRef<HTMLCanvasElement>(null);
  const raf   = useRef(0);
  const st    = useRef({ t: 0, phase: "moving" as "moving" | "impact" | "done", v: 0 });
  const [mass, setMass]   = useState(70);
  const [speed, setSpeed] = useState(15);
  const [airbag, setAirbag] = useState(true);
  const [running, setRunning] = useState(false);

  const tStop  = airbag ? 0.12 : 0.005;
  const dp     = mass * speed;
  const avgF   = dp / tStop;

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const [g, W, H] = setupHiDPI(c);
    const s = st.current;

    if (running) {
      s.t  += 0.016;
      s.v   = Math.max(0, speed - speed * (s.t / 3) * 8);
      if (s.t > 0.6) s.phase = "impact";
      if (s.t > 0.6 + tStop * 5 + 0.3) { s.phase = "done"; setRunning(false); }
    }

    drawBg(g, W, H);

    /* ── Road ── */
    rr(g, 0, H * 0.68, W, H - H * 0.68, 0, "#1e293b");
    for (let x = 0; x < W; x += 60) {
      rr(g, x + 5, H * 0.68 + 10, 35, 6, 2, "#334155");
    }

    /* ── Wall ── */
    rr(g, W * 0.65, H * 0.28, 30, H * 0.5, 4, "#374151", "#4b5563", 2);
    lbl(g, "WALL", W * 0.65 + 15, H * 0.28 + 12, "#94a3b8", 10);

    /* ── Car position ── */
    const progress = running ? Math.min(s.t / 0.6, 1) : 0;
    const carX     = 80 + (W * 0.53 - 80) * progress;
    const carY     = H * 0.54;
    const carW = 100, carH = 44;

    /* Car body */
    const carGr = g.createLinearGradient(carX, carY - carH, carX, carY);
    carGr.addColorStop(0, "#dc2626"); carGr.addColorStop(1, "#991b1b");
    g.fillStyle = carGr;
    g.beginPath(); g.roundRect(carX, carY - carH, carW, carH, 8); g.fill();
    g.strokeStyle = "#f87171"; g.lineWidth = 1.5;
    g.beginPath(); g.roundRect(carX, carY - carH, carW, carH, 8); g.stroke();

    /* Windows */
    rr(g, carX + 18, carY - carH + 6, 30, 20, 4, "rgba(147,210,255,0.25)", "#93c5fd22", 1);
    rr(g, carX + 55, carY - carH + 6, 26, 20, 4, "rgba(147,210,255,0.25)", "#93c5fd22", 1);

    /* Wheels */
    [[carX + 20, carY], [carX + 78, carY]].forEach(([wx, wy]) => {
      g.fillStyle = "#1e293b"; g.strokeStyle = "#475569"; g.lineWidth = 2;
      g.beginPath(); g.arc(wx, wy, 14, 0, Math.PI * 2); g.fill(); g.stroke();
      g.fillStyle = "#94a3b8";
      g.beginPath(); g.arc(wx, wy, 5, 0, Math.PI * 2); g.fill();
    });

    /* ── Airbag ── */
    if (s.phase === "impact" && airbag) {
      const bagR   = 28 + (s.t - 0.6) / (tStop * 5) * 10;
      const bagAlpha = Math.max(0, 1 - (s.t - 0.6 - tStop * 2) / (tStop * 3));
      g.fillStyle = `rgba(255,255,255,${bagAlpha * 0.85})`;
      g.strokeStyle = `rgba(200,220,255,${bagAlpha})`;
      g.lineWidth = 2;
      g.beginPath(); g.arc(carX + carW - 4, carY - carH * 0.6, bagR, 0, Math.PI * 2); g.fill(); g.stroke();
      lbl(g, "Airbag!", carX + carW + bagR - 12, carY - carH * 0.6 - bagR - 8, "#fff", 11);
    }

    /* ── Impact effect (no airbag) ── */
    if (s.phase === "impact" && !airbag) {
      const shards = [[-12, -18], [8, -22], [-20, 5], [14, 2], [-8, 12]];
      shards.forEach(([dx, dy]) => {
        g.fillStyle = "#f87171";
        g.beginPath(); g.arc(carX + carW + dx, carY - carH * 0.5 + dy, 4, 0, Math.PI * 2); g.fill();
      });
      lbl(g, "No airbag!", carX + carW + 12, carY - carH * 0.8, "#ef4444", 11, "left");
    }

    /* ── F-t graph ── */
    const gx = 16, gy = H - 130, gW = W * 0.42, gH = 90;
    rr(g, gx, gy, gW, gH, 8, "rgba(8,15,30,0.7)", "#334155", 1);
    lbl(g, "Force vs Time (same impulse!)", gx + gW / 2, gy + 12, "#94a3b8", 9);

    const drawFtCurve = (col: string, thick: boolean) => {
      const tS  = thick ? 0.005 : 0.12;
      const Fpk = dp / tS;
      const maxF = 500000;
      g.strokeStyle = col; g.lineWidth = thick ? 2.5 : 2;
      g.beginPath();
      for (let ti = 0; ti <= 0.15; ti += 0.001) {
        const F = ti < tS ? (Fpk * Math.sin(ti / tS * Math.PI)) : 0;
        const px = gx + 14 + (ti / 0.15) * (gW - 28);
        const py = gy + gH - 12 - Math.min(F, maxF) / maxF * (gH - 22);
        ti === 0 ? g.moveTo(px, py) : g.lineTo(px, py);
      }
      g.stroke();
    };
    drawFtCurve("#ef4444", true);
    drawFtCurve("#10b981", false);
    lbl(g, "No airbag (huge force, short time)", gx + 10, gy + gH - 18, "#ef4444", 9, "left");
    lbl(g, "Airbag (small force, long time)", gx + 10, gy + gH - 6, "#10b981", 9, "left");

    /* ── Info ── */
    infoBox(g, [
      ["Mass", `${mass} kg`, "#c084fc"],
      ["Speed", `${speed} m/s`, "#60a5fa"],
      ["Impulse J=Δp", `${dp.toFixed(0)} N·s`, "#f59e0b"],
      ["Stop time Δt", `${(tStop * 1000).toFixed(0)} ms`, airbag ? "#10b981" : "#ef4444"],
      ["Avg force F", `${(avgF / 1000).toFixed(1)} kN`, avgF > 50000 ? "#ef4444" : "#10b981"],
    ], W - 196, 14, 182);

    /* ── Verdict ── */
    if (s.phase !== "moving") {
      const verdict = airbag
        ? `Airbag: ${(avgF / 1000).toFixed(0)} kN — survivable!`
        : `No airbag: ${(avgF / 1000).toFixed(0)} kN — fatal!`;
      rr(g, W / 2 - 130, H * 0.25, 260, 34, 8, airbag ? "#10b98125" : "#ef444425", airbag ? "#10b981" : "#ef4444", 1.5);
      lbl(g, verdict, W / 2, H * 0.25 + 22, airbag ? "#10b981" : "#ef4444", 12);
    }

    raf.current = requestAnimationFrame(draw);
  }, [mass, speed, airbag, running, tStop, dp, avgF]);

  useEffect(() => {
    st.current = { t: 0, phase: "moving", v: 0 };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card title="Impulse Theorem — Why Airbags Save Lives" tag="TOPIC 5 · IMPULSE & MOMENTUM" color="#10b981"
      desc="Same impulse J = F·Δt = Δp. Airbag increases Δt → decreases average force dramatically. This is Newton's 2nd Law applied to collisions.">
      <canvas ref={cvs} style={{ width: "100%", height: 280, borderRadius: 12, display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
        <Sld label="Passenger mass" value={mass} min={40} max={120} unit=" kg" color="#c084fc" onChange={(v) => { setMass(v); st.current = { t: 0, phase: "moving", v: 0 }; setRunning(false); }} />
        <Sld label="Car speed" value={speed} min={5} max={40} unit=" m/s" color="#60a5fa" onChange={(v) => { setSpeed(v); st.current = { t: 0, phase: "moving", v: 0 }; setRunning(false); }} />
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
        <button onClick={() => setAirbag(a => !a)} style={{
          padding: "7px 16px", borderRadius: 8, border: `1px solid ${airbag ? "#10b981" : "#ef4444"}`,
          background: airbag ? "#10b98118" : "#ef444418",
          color: airbag ? "#10b981" : "#ef4444", fontWeight: 700, fontSize: 12, cursor: "pointer",
        }}>{airbag ? "🛡 Airbag ON" : "⚠ No Airbag"}</button>
        <button onClick={() => { st.current = { t: 0, phase: "moving", v: 0 }; setRunning(true); }} style={{
          padding: "7px 20px", borderRadius: 8, border: "none", cursor: "pointer",
          background: "#6366f1", color: "#fff", fontWeight: 700, fontSize: 13,
        }}>💥 Crash Test</button>
        <button onClick={() => { st.current = { t: 0, phase: "moving", v: 0 }; setRunning(false); }} style={{
          padding: "7px 14px", borderRadius: 8, border: "1px solid #334155",
          background: "transparent", color: "#94a3b8", fontWeight: 600, fontSize: 13, cursor: "pointer",
        }}>↺ Reset</button>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
 * SIM PRO-6 — Inclined Plane Full Analysis
 * Physics: Normal N = mg·cos(θ)  Parallel = mg·sin(θ)
 *          Friction f = μ·N  Net F = mg·sin(θ) − μ·mg·cos(θ)
 *          a = g·(sin(θ) − μ·cos(θ))
 * ════════════════════════════════════════════════════════════════ */
function SimInclinedPlane() {
  const cvs  = useRef<HTMLCanvasElement>(null);
  const raf  = useRef(0);
  const st   = useRef({ d: 0, v: 0, moving: false });
  const [angle, setAngle] = useState(30);
  const [mu,    setMu]    = useState(0.2);
  const [mass,  setMass]  = useState(5);
  const [running, setRunning] = useState(false);

  const G   = 9.8;
  const th  = angle * Math.PI / 180;
  const N   = mass * G * Math.cos(th);
  const Wp  = mass * G * Math.sin(th);
  const Wn  = mass * G * Math.cos(th);
  const f   = mu * N;
  const Fnet = Math.max(0, Wp - f);
  const a   = Fnet / mass;

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const [g, W, H] = setupHiDPI(c);
    const s  = st.current;

    if (running && Fnet > 0) {
      s.v += a * 0.016;
      s.d += s.v * 0.016;
      if (s.d > 100) { s.d = 0; s.v = 0; }
    }

    drawBg(g, W, H);

    /* ── Inclined plane triangle ── */
    const ox = 70, oy = H - 60;
    const L  = Math.min(W - 120, 380);
    const ht = L * Math.tan(th);
    const ex = ox + L, ey = oy;
    const tx = ox, ty = oy - ht;

    g.save();
    g.fillStyle = "#1e3a5f";
    g.strokeStyle = "#334155";
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(ox, oy); g.lineTo(ex, ey); g.lineTo(tx, ty); g.closePath();
    g.fill(); g.stroke();
    g.restore();

    /* Surface line */
    g.strokeStyle = "#475569"; g.lineWidth = 3;
    g.beginPath(); g.moveTo(tx, ty); g.lineTo(ex, ey); g.stroke();

    /* Angle arc + label */
    g.strokeStyle = "#f59e0b"; g.lineWidth = 2;
    g.beginPath(); g.arc(ex, ey, 40, -Math.PI - th, -Math.PI); g.stroke();
    lbl(g, `${angle}°`, ex - 55, ey - 15, "#f59e0b", 11);

    /* ── Block on slope ── */
    const blockPos = s.d * 2;
    const bCenterX = ex - (40 + blockPos) * Math.cos(th);
    const bCenterY = ey - (40 + blockPos) * Math.sin(th);
    const bW = 40, bH = 30;

    g.save();
    g.translate(bCenterX, bCenterY);
    g.rotate(-th);
    const blockGr = g.createLinearGradient(-bW / 2, -bH, bW / 2, 0);
    blockGr.addColorStop(0, "#4f46e5"); blockGr.addColorStop(1, "#312e81");
    g.fillStyle = blockGr;
    g.beginPath(); g.roundRect(-bW / 2, -bH, bW, bH, 5); g.fill();
    g.strokeStyle = "#818cf8"; g.lineWidth = 1.5;
    g.beginPath(); g.roundRect(-bW / 2, -bH, bW, bH, 5); g.stroke();
    lbl(g, `${mass}kg`, 0, -bH / 2 + 4, "#fff", 10);
    g.restore();

    /* ── Force arrows ── */
    const cx = bCenterX, cy = bCenterY - bH / 2;
    const scale = 1.2;
    /* Weight (straight down) */
    arrow(g, cx, cy, cx, cy + mass * G * scale, "#ef4444", 2.5, 10);
    lbl(g, `W=${(mass * G).toFixed(0)}N`, cx + 8, cy + mass * G * scale * 0.5, "#ef4444", 9, "left");
    /* Normal (perpendicular to slope) */
    arrow(g, cx, cy, cx - N * scale * Math.sin(th), cy - N * scale * Math.cos(th), "#60a5fa", 2.5, 10);
    lbl(g, `N=${N.toFixed(0)}N`, cx - N * scale * Math.sin(th) - 6, cy - N * scale * Math.cos(th) - 8, "#60a5fa", 9, "right");
    /* Parallel (along slope, down) */
    arrow(g, cx, cy, cx + Wp * scale * Math.cos(th), cy + Wp * scale * Math.sin(th), "#f59e0b", 2.5, 10);
    lbl(g, `W∥=${Wp.toFixed(0)}N`, cx + Wp * scale * Math.cos(th) * 0.6, cy + Wp * scale * Math.sin(th) * 0.6 + 14, "#f59e0b", 9);
    /* Friction (up slope) */
    if (f > 0.5) {
      arrow(g, cx, cy, cx - f * scale * Math.cos(th), cy - f * scale * Math.sin(th), "#10b981", 2.5, 10);
      lbl(g, `f=${f.toFixed(0)}N`, cx - f * scale * Math.cos(th) * 0.7 - 6, cy - f * scale * Math.sin(th) * 0.7 - 8, "#10b981", 9, "right");
    }

    /* ── Info panel ── */
    infoBox(g, [
      ["mg sin θ (down slope)", `${Wp.toFixed(1)} N`, "#f59e0b"],
      ["mg cos θ (normal)", `${Wn.toFixed(1)} N`, "#60a5fa"],
      ["Friction force f=μN", `${f.toFixed(1)} N`, "#10b981"],
      ["Net force Fnet", `${Fnet.toFixed(1)} N`, Fnet > 0 ? "#ef4444" : "#10b981"],
      ["Acceleration a", `${a.toFixed(2)} m/s²`, "#c084fc"],
    ], W - 220, 14, 206);

    /* ── Status ── */
    const status = Fnet < 0.5 ? "⚖ In Equilibrium — No Motion" : `▼ Sliding at ${s.v.toFixed(1)} m/s`;
    lbl(g, status, W / 2, H - 20, Fnet < 0.5 ? "#10b981" : "#f59e0b", 12);

    raf.current = requestAnimationFrame(draw);
  }, [angle, mu, mass, running, a, N, Wp, Wn, f, Fnet, th]);

  useEffect(() => {
    st.current = { d: 0, v: 0, moving: false };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card title="Inclined Plane — Complete Force Analysis" tag="TOPIC 1 & 3 · FORCES ON SLOPE" color="#f59e0b"
      desc="See all four forces: Weight, Normal, Parallel component, and Friction. Change angle and friction coefficient to understand when objects slide or stay still.">
      <canvas ref={cvs} style={{ width: "100%", height: 300, borderRadius: 12, display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 14 }}>
        <Sld label="Slope angle θ" value={angle} min={5} max={80} unit="°" color="#f59e0b" onChange={(v) => { setAngle(v); st.current = { d: 0, v: 0, moving: false }; }} />
        <Sld label="μ (friction coeff)" value={mu} min={0} max={0.9} step={0.01} unit="" color="#10b981" onChange={(v) => { setMu(v); st.current = { d: 0, v: 0, moving: false }; }} />
        <Sld label="Block mass" value={mass} min={1} max={20} unit=" kg" color="#c084fc" onChange={(v) => { setMass(v); st.current = { d: 0, v: 0, moving: false }; }} />
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button onClick={() => setRunning(r => !r)} style={{
          padding: "8px 22px", borderRadius: 8, border: "none", cursor: "pointer",
          background: running ? "#ef4444" : "#f59e0b", color: "#fff", fontWeight: 700, fontSize: 13,
        }}>{running ? "⏸ Pause" : "▶ Release Block"}</button>
        <button onClick={() => { st.current = { d: 0, v: 0, moving: false }; setRunning(false); }} style={{
          padding: "8px 18px", borderRadius: 8, border: "1px solid #334155",
          background: "transparent", color: "#94a3b8", fontWeight: 600, fontSize: 13, cursor: "pointer",
        }}>↺ Reset</button>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
 * SIM PRO-7 — Pendulum Inertia & Newton's 1st Law
 * Physics: θ''(t) = −(g/L)·sin(θ) − b·θ'  (damped pendulum)
 *          Period T ≈ 2π√(L/g) for small angles
 * ════════════════════════════════════════════════════════════════ */
function SimPendulumInertia() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const st  = useRef({ theta: Math.PI / 4, omega: 0, t: 0 });
  const [L,       setL]       = useState(1.5);
  const [damping, setDamping] = useState(0.05);
  const [g_val,   setGVal]    = useState(9.8);
  const [paused,  setPaused]  = useState(false);

  const T = 2 * Math.PI * Math.sqrt(L / g_val);

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const [g, W, H] = setupHiDPI(c);
    const s  = st.current;
    const px = W / 2, py = 50;
    const scale = Math.min(W, H - 80) * 0.4;

    if (!paused) {
      const dt  = 0.016;
      const alpha = -(g_val / L) * Math.sin(s.theta) - damping * s.omega;
      s.omega += alpha * dt;
      s.theta += s.omega * dt;
      s.t     += dt;
    }

    const bx = px + Math.sin(s.theta) * scale;
    const by = py + Math.cos(s.theta) * scale;

    drawBg(g, W, H, "#080e1a", "#0b1220");

    /* ── Pivot ── */
    rr(g, 0, 0, W, py, 0, "#1e293b");
    g.fillStyle = "#475569"; g.strokeStyle = "#64748b"; g.lineWidth = 2;
    g.beginPath(); g.arc(px, py, 8, 0, Math.PI * 2); g.fill(); g.stroke();
    lbl(g, "Pivot Point", px, py - 16, "#64748b", 10);

    /* ── String ── */
    g.strokeStyle = "#94a3b8"; g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(px, py); g.lineTo(bx, by); g.stroke();
    lbl(g, `L = ${L}m`, (px + bx) / 2 + 14, (py + by) / 2, "#64748b", 9, "left");

    /* ── Angle arc ── */
    if (Math.abs(s.theta) > 0.02) {
      g.strokeStyle = "#f59e0b55"; g.lineWidth = 1.5;
      g.beginPath(); g.arc(px, py, 45, Math.PI / 2 - s.theta, Math.PI / 2, s.theta > 0); g.stroke();
      lbl(g, `${(s.theta * 180 / Math.PI).toFixed(0)}°`, px + (s.theta > 0 ? 52 : -52), py + 40, "#f59e0b", 10);
    }

    /* ── Velocity arrow ── */
    const vx = s.omega * Math.cos(s.theta) * scale;
    const vy = -s.omega * Math.sin(s.theta) * scale;
    if (Math.abs(s.omega) > 0.01) {
      arrow(g, bx, by, bx + vx * 0.15, by + vy * 0.15, "#10b981", 2.5, 9);
      lbl(g, `v=${(Math.abs(s.omega) * scale / scale * L).toFixed(2)}m/s`, bx + 14, by + 6, "#10b981", 9, "left");
    }

    /* ── Bob ── */
    const bobGr = g.createRadialGradient(bx - 6, by - 6, 3, bx, by, 18);
    bobGr.addColorStop(0, "#818cf8"); bobGr.addColorStop(1, "#4f46e5");
    g.fillStyle = bobGr;
    g.beginPath(); g.arc(bx, by, 18, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#6366f1"; g.lineWidth = 2;
    g.beginPath(); g.arc(bx, by, 18, 0, Math.PI * 2); g.stroke();

    /* ── Energy bars ── */
    const KE = 0.5 * L * L * s.omega * s.omega;
    const PE = g_val * L * (1 - Math.cos(s.theta));
    const TE = KE + PE;
    const maxE = g_val * L * (1 - Math.cos(Math.PI / 4));
    const barsX = W - 100, barsY = H * 0.2;
    const barsH = H * 0.4;

    lbl(g, "Energy", barsX + 22, barsY - 12, "#94a3b8", 9);
    [[KE, "#6366f1", "KE"], [PE, "#f59e0b", "PE"]].forEach(([E, col, k], i) => {
      const barX = barsX + i * 38;
      const barH = Math.min(barsH, (E as number) / maxE * barsH);
      rr(g, barX, barsY, 28, barsH, 4, "#1e293b", "#334155", 1);
      if (barH > 0) rr(g, barX, barsY + barsH - barH, 28, barH, 4, col as string);
      lbl(g, k as string, barX + 14, barsY + barsH + 14, col as string, 9);
    });

    /* ── Info panel ── */
    infoBox(g, [
      ["Period T", `${T.toFixed(2)} s`, "#c084fc"],
      ["Length L", `${L} m`, "#60a5fa"],
      ["Gravity g", `${g_val} m/s²`, "#f59e0b"],
      ["Damping b", `${damping}`, "#ef4444"],
      ["Angle", `${(s.theta * 180 / Math.PI).toFixed(1)}°`, "#94a3b8"],
      ["ω", `${s.omega.toFixed(2)} rad/s`, "#a5b4fc"],
    ], 14, 14, 182);

    /* ── 1st Law note ── */
    rr(g, W / 2 - 160, H - 48, 320, 36, 8, "rgba(8,15,30,0.75)", "#1e293b", 1);
    lbl(g, "Without gravity (in space): inertia would keep it moving forever", W / 2, H - 30, "#64748b", 10);
    lbl(g, "Gravity is the unbalanced force that keeps it swinging!", W / 2, H - 14, "#a5b4fc", 10);

    raf.current = requestAnimationFrame(draw);
  }, [L, damping, g_val, paused, T]);

  useEffect(() => {
    st.current = { theta: Math.PI / 4, omega: 0, t: 0 };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  return (
    <Card title="Pendulum — Inertia & Newton's 1st Law" tag="TOPIC 2 · FIRST LAW OF MOTION" color="#c084fc"
      desc="A pendulum swings because inertia keeps it moving and gravity pulls it back. Watch how period depends on length, not mass. Reduce gravity to see Newton's 1st Law!">
      <canvas ref={cvs} style={{ width: "100%", height: 330, borderRadius: 12, display: "block", background: "#080e1a" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 14 }}>
        <Sld label="Length L" value={L} min={0.3} max={3} step={0.1} unit=" m" color="#c084fc" onChange={setL} />
        <Sld label="Gravity g" value={g_val} min={0} max={24.8} step={0.1} unit=" m/s²" color="#f59e0b" onChange={setGVal} />
        <Sld label="Damping" value={damping} min={0} max={0.5} step={0.01} unit="" color="#ef4444" onChange={setDamping} />
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button onClick={() => setPaused(p => !p)} style={{
          padding: "8px 22px", borderRadius: 8, border: "none", cursor: "pointer",
          background: paused ? "#10b981" : "#6366f1", color: "#fff", fontWeight: 700, fontSize: 13,
        }}>{paused ? "▶ Resume" : "⏸ Freeze"}</button>
        <button onClick={() => { st.current = { theta: Math.PI / 3, omega: 0, t: 0 }; }} style={{
          padding: "8px 18px", borderRadius: 8, border: "1px solid #334155",
          background: "transparent", color: "#94a3b8", fontWeight: 600, fontSize: 13, cursor: "pointer",
        }}>↺ Reset</button>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
 * SIM PRO-8 — Momentum Conservation Explosion
 * Physics: initial p_total = 0  →  m1·v1 + m2·v2 = 0
 *          v1 = −(m2/m1)·v2  (Recoil)
 * ════════════════════════════════════════════════════════════════ */
function SimExplosionRecoil() {
  const cvs  = useRef<HTMLCanvasElement>(null);
  const raf  = useRef(0);
  const st   = useRef({ x1: 0, x2: 0, phase: "ready" as "ready" | "exploding" | "done", t: 0, particles: [] as {x:number;y:number;vx:number;vy:number;life:number;col:string}[] });
  const [m1, setM1] = useState(4);
  const [m2, setM2] = useState(2);
  const [exploded, setExploded] = useState(false);

  const v2After = 8;
  const v1After = -(m2 / m1) * v2After;

  const draw = useCallback(() => {
    const c = cvs.current; if (!c) return;
    const [g, W, H] = setupHiDPI(c);
    const s   = st.current;
    const cx  = W / 2;
    const dt  = 0.016;

    if (s.phase === "exploding") {
      s.t += dt;
      s.x1 += v1After * dt * 25;
      s.x2 += v2After * dt * 25;
      s.particles = s.particles
        .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.08, life: p.life - 0.018 }))
        .filter(p => p.life > 0);
      if (s.t > 3) s.phase = "done";
    }

    drawBg(g, W, H);

    /* ── Track ── */
    rr(g, 0, H * 0.62, W, 8, 0, "#1e293b");

    /* ── Particles ── */
    s.particles.forEach(p => {
      g.globalAlpha = p.life;
      g.fillStyle = p.col;
      g.beginPath(); g.arc(p.x, p.y, 3, 0, Math.PI * 2); g.fill();
    });
    g.globalAlpha = 1;

    /* ── Mass 1 (left, heavier) ── */
    const trackY = H * 0.62;
    const r1 = 25 + m1 * 3, r2 = 20 + m2 * 3;
    const b1x = s.phase === "ready" ? cx - r1 - 2 : cx + s.x1 - r1;
    const b2x = s.phase === "ready" ? cx + r2 + 2 : cx + s.x2 + r2;

    const gr1 = g.createRadialGradient(b1x - 8, trackY - r1 - 8, 4, b1x, trackY - r1, r1);
    gr1.addColorStop(0, "#818cf8"); gr1.addColorStop(1, "#4338ca");
    g.fillStyle = gr1;
    g.beginPath(); g.arc(b1x, trackY - r1, r1, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#6366f1"; g.lineWidth = 2;
    g.beginPath(); g.arc(b1x, trackY - r1, r1, 0, Math.PI * 2); g.stroke();
    lbl(g, `${m1}kg`, b1x, trackY - r1 + 5, "#fff", 12);

    const gr2 = g.createRadialGradient(b2x - 6, trackY - r2 - 6, 3, b2x, trackY - r2, r2);
    gr2.addColorStop(0, "#fde68a"); gr2.addColorStop(1, "#d97706");
    g.fillStyle = gr2;
    g.beginPath(); g.arc(b2x, trackY - r2, r2, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#f59e0b"; g.lineWidth = 2;
    g.beginPath(); g.arc(b2x, trackY - r2, r2, 0, Math.PI * 2); g.stroke();
    lbl(g, `${m2}kg`, b2x, trackY - r2 + 5, "#fff", 12);

    /* ── Velocity arrows after explosion ── */
    if (s.phase !== "ready") {
      arrow(g, b1x, trackY - r1, b1x + v1After * 6, trackY - r1, "#818cf8", 2.5, 10);
      lbl(g, `v=${v1After.toFixed(1)}m/s`, b1x + v1After * 3, trackY - r1 - 14, "#818cf8", 9);
      arrow(g, b2x, trackY - r2, b2x + v2After * 6, trackY - r2, "#fbbf24", 2.5, 10);
      lbl(g, `v=${v2After.toFixed(1)}m/s`, b2x + v2After * 3, trackY - r2 - 14, "#fbbf24", 9);
    }

    /* ── Momentum bars ── */
    if (s.phase !== "ready") {
      const p1 = m1 * v1After, p2 = m2 * v2After;
      const scale = 4;
      const barY = H * 0.82;
      /* p1 bar (left, negative) */
      rr(g, cx + p1 * scale, barY, -p1 * scale, 18, 3, "#6366f180");
      lbl(g, `p₁=${p1.toFixed(1)}`, cx + p1 * scale * 0.5, barY + 13, "#818cf8", 10);
      /* p2 bar (right, positive) */
      rr(g, cx, barY, p2 * scale, 18, 3, "#f59e0b80");
      lbl(g, `p₂=${p2.toFixed(1)}`, cx + p2 * scale * 0.5, barY + 13, "#fbbf24", 10);
      /* Total */
      lbl(g, `p₁+p₂ = ${(p1+p2).toFixed(2)} ≈ 0 ✓`, cx, barY + 32, "#10b981", 11);
    }

    /* ── Info panel ── */
    infoBox(g, [
      ["Before explosion", "p = 0", "#94a3b8"],
      ["m1 velocity", `${s.phase === "ready" ? "0" : v1After.toFixed(2)} m/s`, "#818cf8"],
      ["m2 velocity", `${s.phase === "ready" ? "0" : v2After.toFixed(2)} m/s`, "#fbbf24"],
      ["Ratio v1/v2", `−m2/m1 = ${(-m2/m1).toFixed(2)}`, "#10b981"],
      ["Total p", "0 (conserved!)", "#10b981"],
    ], 14, 14, 186);

    /* ── Ready state: spring coil ── */
    if (s.phase === "ready") {
      g.strokeStyle = "#4f46e5"; g.lineWidth = 2;
      g.beginPath();
      for (let i = 0; i <= 8; i++) {
        const fy = trackY - r1 * 0.8 + (i % 2 === 0 ? 6 : -6);
        g.lineTo(cx - 8 + i * 4, fy);
      }
      g.stroke();
      lbl(g, "Compressed Spring", cx, trackY - r1 * 0.8 - 14, "#64748b", 9);
    }

    raf.current = requestAnimationFrame(draw);
  }, [m1, m2, v1After, v2After]);

  useEffect(() => {
    st.current = { x1: 0, x2: 0, phase: "ready", t: 0, particles: [] };
    setExploded(false);
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [draw]);

  const handleExplode = () => {
    if (exploded) return;
    const s   = st.current;
    const cx  = cvs.current!.getBoundingClientRect().width / 2;
    const cy  = cvs.current!.getBoundingClientRect().height * 0.62;
    s.phase   = "exploding";
    s.particles = Array.from({ length: 30 }, () => ({
      x: cx, y: cy - 40,
      vx: (Math.random() - 0.5) * 8,
      vy: -Math.random() * 6 - 2,
      life: 0.8 + Math.random() * 0.4,
      col: ["#f59e0b", "#ef4444", "#fbbf24", "#6366f1"][Math.floor(Math.random() * 4)],
    }));
    setExploded(true);
  };

  return (
    <Card title="Explosion — Momentum Conservation from Rest" tag="TOPIC 5 · CONSERVATION OF MOMENTUM" color="#f59e0b"
      desc="Both masses start at rest (total p=0). After explosion: p₁+p₂ = 0 always. Heavier mass moves slower. This is how guns recoil and rockets work!">
      <canvas ref={cvs} style={{ width: "100%", height: 280, borderRadius: 12, display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
        <Sld label="Left mass m₁" value={m1} min={1} max={10} unit=" kg" color="#818cf8" onChange={(v) => { setM1(v); st.current = { x1: 0, x2: 0, phase: "ready", t: 0, particles: [] }; setExploded(false); }} />
        <Sld label="Right mass m₂" value={m2} min={1} max={10} unit=" kg" color="#fbbf24" onChange={(v) => { setM2(v); st.current = { x1: 0, x2: 0, phase: "ready", t: 0, particles: [] }; setExploded(false); }} />
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button onClick={handleExplode} disabled={exploded} style={{
          padding: "8px 22px", borderRadius: 8, border: "none", cursor: exploded ? "default" : "pointer",
          background: exploded ? "#334155" : "#f59e0b", color: "#fff", fontWeight: 700, fontSize: 13,
          opacity: exploded ? 0.5 : 1,
        }}>💥 Release Spring!</button>
        <button onClick={() => { st.current = { x1: 0, x2: 0, phase: "ready", t: 0, particles: [] }; setExploded(false); }} style={{
          padding: "8px 18px", borderRadius: 8, border: "1px solid #334155",
          background: "transparent", color: "#94a3b8", fontWeight: 600, fontSize: 13, cursor: "pointer",
        }}>↺ Reset</button>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
 * MAIN EXPORT — renders all 8 professional simulations
 * ════════════════════════════════════════════════════════════════ */
export function AdvancedSimPro() {
  return (
    <div style={{ marginTop: 32 }}>
      <div style={{
        background: "linear-gradient(90deg,rgba(99,102,241,0.15),rgba(16,185,129,0.1))",
        border: "1px solid rgba(99,102,241,0.3)",
        borderRadius: 12, padding: "12px 20px", marginBottom: 28,
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <span style={{ fontSize: 20 }}>🔬</span>
        <div>
          <div style={{ color: "#a5b4fc", fontWeight: 800, fontSize: 14 }}>Pro Physics Lab</div>
          <div style={{ color: "#64748b", fontSize: 12 }}>8 ultra-realistic simulations — full physics logic, real equations, interactive controls</div>
        </div>
      </div>

      <SimFmaCarLab />
      <SimCollisionLab />
      <SimProjectileLab />
      <SimRocketLaw3 />
      <SimImpulseAirbag />
      <SimInclinedPlane />
      <SimPendulumInertia />
      <SimExplosionRecoil />
    </div>
  );
}
