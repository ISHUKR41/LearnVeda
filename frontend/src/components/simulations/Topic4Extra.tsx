/**
 * FILE: Topic4Extra.tsx
 * PURPOSE: 6 ultra-professional simulations for Topic 4 — Third Law of Motion
 * Each shows action-reaction pairs in distinct, visually rich real-world contexts.
 */
"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

function SimCard({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div style={{ width: "100%", background: "#0b1120", borderRadius: 18, padding: 28, margin: "32px 0", border: "1px solid #1e293b", boxShadow: "0 12px 40px rgba(0,0,0,0.5)", fontFamily: "Inter, system-ui, sans-serif", overflow: "hidden" }}>
      <div style={{ borderBottom: "1px solid #1e293b", paddingBottom: 16, marginBottom: 24 }}>
        <h3 style={{ color: "#f1f5f9", fontSize: 21, fontWeight: 800, margin: 0 }}>{title}</h3>
        <p style={{ color: "#64748b", fontSize: 14, margin: "8px 0 0", lineHeight: 1.6 }}>{desc}</p>
      </div>
      {children}
    </div>
  );
}
function TPanel({ items }: { items: { label: string; value: string; color: string }[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(items.length, 4)}, 1fr)`, gap: 10, marginTop: 18 }}>
      {items.map(it => (
        <div key={it.label} style={{ background: "#0f172a", borderRadius: 10, padding: "10px 14px", border: "1px solid #1e293b" }}>
          <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 5 }}>{it.label}</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: it.color, fontFamily: "JetBrains Mono, monospace" }}>{it.value}</div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 1. JET ENGINE — Action-Reaction Propulsion
 * Air is pushed backward (action) → plane moves forward (reaction)
 * Interactive: adjust thrust vectoring and see how the plane maneuvers
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_jet_engine() {
  const [thrust, setThrust] = useState(50);
  const [running, setRunning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ x: 100, v: 0, exhaustParticles: [] as { x: number; y: number; vx: number; vy: number; life: number }[] });
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);
  const [display, setDisplay] = useState({ v: 0, x: 100 });

  const mass = 50000; // kg (jet mass)
  const exhaustSpeed = 300; // m/s
  const fuelRate = thrust * 0.5; // kg/s
  const thrustForce = fuelRate * exhaustSpeed; // F = dm/dt × v_exhaust
  const accel = thrustForce / mass;

  const draw = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(draw); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const s = stateRef.current;

    if (running) {
      s.v += accel * dt * 0.001; // scaled for visual
      s.x += s.v * dt;
      if (s.x > W + 100) s.x = -100;
    }

    // Add exhaust particles
    if (running) {
      for (let i = 0; i < 3; i++) {
        s.exhaustParticles.push({
          x: s.x - 30,
          y: H / 2 + (Math.random() - 0.5) * 12,
          vx: -exhaustSpeed * 0.005 - Math.random() * 2,
          vy: (Math.random() - 0.5) * 1.5,
          life: 1,
        });
      }
    }

    // Update particles
    s.exhaustParticles = s.exhaustParticles
      .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, life: p.life - dt * 1.5 }))
      .filter(p => p.life > 0 && p.x > 0);

    ctx.clearRect(0, 0, W, H);

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#0c1445");
    sky.addColorStop(1, "#1e293b");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Clouds
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = "#ffffff08";
      ctx.beginPath();
      ctx.ellipse(100 + i * 150, H * 0.3, 60, 20, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw exhaust particles
    s.exhaustParticles.forEach(p => {
      ctx.fillStyle = `rgba(${p.life > 0.7 ? "255,255,200" : p.life > 0.4 ? "255,150,50" : "150,50,50"}, ${p.life * 0.6})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3 * p.life + 1, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw jet (simplified body)
    const jx = s.x, jy = H / 2;
    ctx.save();
    ctx.translate(jx, jy);

    // Fuselage
    ctx.fillStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.moveTo(60, 0);
    ctx.lineTo(-20, -10);
    ctx.lineTo(-30, 0);
    ctx.lineTo(-20, 10);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 1; ctx.stroke();

    // Wing
    ctx.fillStyle = "#cbd5e1";
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(-5, -35);
    ctx.lineTo(-20, -35);
    ctx.lineTo(-15, 0);
    ctx.closePath();
    ctx.fill();

    // Tail
    ctx.fillStyle = "#94a3b8";
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.lineTo(-28, -18);
    ctx.lineTo(-30, 0);
    ctx.closePath();
    ctx.fill();

    // Engine pod
    ctx.fillStyle = "#475569";
    ctx.beginPath();
    ctx.roundRect(-5, 5, 25, 10, 4);
    ctx.fill();

    // Speed display on plane
    ctx.fillStyle = "#60a5fa";
    ctx.font = "bold 10px JetBrains Mono";
    ctx.textAlign = "center";
    ctx.fillText(`${(s.v * 1000).toFixed(0)} km/h`, 15, -18);

    ctx.restore();

    // Thrust & reaction labels
    if (running) {
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 11px Inter";
      ctx.textAlign = "left";
      ctx.fillText(`→ REACTION: Plane moves forward (${(thrustForce / 1000).toFixed(0)} kN)`, 20, 24);
      ctx.fillStyle = "#ef4444";
      ctx.fillText(`← ACTION: Exhaust gases pushed backward`, 20, 40);
    }

    // Speed-o-meter
    ctx.fillStyle = "#0f172a";
    ctx.beginPath(); ctx.roundRect(W - 140, H - 50, 130, 40, 8); ctx.fill();
    ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = "#60a5fa";
    ctx.font = "bold 11px JetBrains Mono";
    ctx.textAlign = "center";
    ctx.fillText(`${(s.v * 1000).toFixed(0)} km/h`, W - 75, H - 24);
    ctx.fillStyle = "#64748b"; ctx.font = "10px Inter";
    ctx.fillText("Speed", W - 75, H - 10);

    setDisplay({ v: s.v, x: s.x });
    animRef.current = requestAnimationFrame(draw);
  }, [running, accel, thrustForce]);

  useEffect(() => { animRef.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(animRef.current); }, [draw]);

  return (
    <SimCard title="✈️ Jet Engine — Action-Reaction Propulsion" desc="The engine pushes hot gases backward with enormous force (ACTION). By Newton's 3rd Law, gases push the plane forward with equal force (REACTION). Thrust = mass flow rate × exhaust speed: F = (dm/dt) × v_e.">
      <canvas ref={canvasRef} width={600} height={200} style={{ width: "100%", borderRadius: 12 }} />
      <div style={{ display: "flex", gap: 12, marginTop: 14, alignItems: "center", background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #1e293b" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: "#f59e0b", fontWeight: 700, marginBottom: 4 }}>Thrust: {thrust}% power</div>
          <input type="range" min={10} max={100} value={thrust} onChange={e => setThrust(+e.target.value)} style={{ width: "100%", accentColor: "#f59e0b" }} />
        </div>
        <button onClick={() => setRunning(!running)} style={{ padding: "10px 24px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", background: running ? "#ef4444" : "#10b981", color: "#0f172a" }}>
          {running ? "CUT ENGINES" : "IGNITE ENGINES"}
        </button>
      </div>
      <TPanel items={[
        { label: "Action", value: "Gases ← backward", color: "#ef4444" },
        { label: "Reaction", value: "Plane → forward", color: "#10b981" },
        { label: "Thrust Force", value: `${(thrustForce / 1000).toFixed(0)} kN`, color: "#f59e0b" },
        { label: "Acceleration", value: `${accel.toFixed(3)} m/s²`, color: "#6366f1" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 2. TWO ASTRONAUTS PUSH OFF IN SPACE — Pure 3rd Law
 * Two astronauts push each other. Equal & opposite forces.
 * Heavier one moves slower: F = ma → a = F/m (smaller for larger m)
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_astronaut_push() {
  const [m1, setM1] = useState(60);
  const [m2, setM2] = useState(90);
  const [phase, setPhase] = useState<"ready" | "pushed">("ready");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ x1: 0, x2: 0, v1: 0, v2: 0 });
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);

  // Newton's 3rd + momentum conservation: m1*v1 + m2*v2 = 0
  // Impulse same for both: F × Δt same
  // → v1/v2 = -m2/m1
  const pushForce = 200; // N (same on both)
  const dt_push = 0.1; // s
  const v1Final = (pushForce * dt_push) / m1;
  const v2Final = -(pushForce * dt_push) / m2;

  const step = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(draw); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    const s = stateRef.current;
    s.x1 += s.v1 * dt * 40;
    s.x2 += s.v2 * dt * 40;
    animRef.current = requestAnimationFrame(step);
  }, []);

  function draw(t: number) {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(draw); return; }
    const dt2 = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    const s = stateRef.current;
    if (phase === "pushed") {
      s.x1 += s.v1 * dt2 * 40;
      s.x2 += s.v2 * dt2 * 40;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const cx = W / 2;
    ctx.clearRect(0, 0, W, H);

    // Space background
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 60; i++) {
      const sx = (Math.sin(i * 137.5) * 0.5 + 0.5) * W;
      const sy = (Math.cos(i * 137.5 + 0.5) * 0.5 + 0.5) * H;
      ctx.fillStyle = `rgba(255,255,255,${0.2 + (i % 5) * 0.08})`;
      ctx.beginPath(); ctx.arc(sx, sy, 0.8, 0, Math.PI * 2); ctx.fill();
    }

    const a1x = cx - 50 + s.x1, a2x = cx + 50 + s.x2;
    const aY = H / 2;

    // Astronaut 1 (left, lighter)
    ctx.save();
    ctx.translate(a1x, aY);
    // Body
    ctx.fillStyle = "#e2e8f0";
    ctx.beginPath(); ctx.ellipse(0, 5, 14, 18, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 1; ctx.stroke();
    // Helmet
    ctx.fillStyle = "#bfdbfe";
    ctx.beginPath(); ctx.arc(0, -15, 14, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 1.5; ctx.stroke();
    // Visor
    ctx.fillStyle = "#1e40af60";
    ctx.beginPath(); ctx.arc(2, -14, 8, -0.8, 0.8); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#ef4444"; ctx.font = "bold 9px Inter"; ctx.textAlign = "center";
    ctx.fillText(`${m1}kg`, 0, 30);
    ctx.restore();

    // Astronaut 2 (right, heavier)
    ctx.save();
    ctx.translate(a2x, aY);
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath(); ctx.ellipse(0, 5, 16, 20, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#d97706"; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = "#fed7aa";
    ctx.beginPath(); ctx.arc(0, -16, 16, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#f97316"; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = "#78350f60";
    ctx.beginPath(); ctx.arc(2, -15, 9, -0.8, 0.8); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#3b82f6"; ctx.font = "bold 9px Inter"; ctx.textAlign = "center";
    ctx.fillText(`${m2}kg`, 0, 33);
    ctx.restore();

    // Force/velocity labels
    if (phase === "pushed") {
      ctx.fillStyle = "#10b981"; ctx.font = "bold 12px JetBrains Mono"; ctx.textAlign = "center";
      ctx.fillText(`← v₁=${v1Final.toFixed(2)}m/s`, a1x, aY - 50);
      ctx.fillText(`v₂=${Math.abs(v2Final).toFixed(2)}m/s →`, a2x, aY - 50);

      // Show force equality
      ctx.fillStyle = "#ef4444"; ctx.font = "12px Inter"; ctx.textAlign = "center";
      ctx.fillText("← Push Force: 200N →", cx, aY + 55);
      ctx.fillStyle = "#64748b"; ctx.font = "11px Inter";
      ctx.fillText("Equal & opposite forces, but different accelerations due to mass", cx, H - 10);
    } else {
      ctx.fillStyle = "#94a3b8"; ctx.font = "bold 13px Inter"; ctx.textAlign = "center";
      ctx.fillText("← Push off →", cx, aY + 55);
    }

    // Momentum check
    if (phase === "pushed") {
      const p_total = m1 * s.v1 * 40 / 40 + m2 * s.v2 * 40 / 40;
      ctx.fillStyle = "#10b98120";
      ctx.beginPath(); ctx.roundRect(cx - 110, 8, 220, 26, 8); ctx.fill();
      ctx.fillStyle = "#10b981"; ctx.font = "bold 11px JetBrains Mono"; ctx.textAlign = "center";
      ctx.fillText(`Total momentum = ${(m1 * v1Final + m2 * v2Final).toFixed(2)} ≈ 0 ✓`, cx, 26);
    }

    animRef.current = requestAnimationFrame(draw);
  }

  useEffect(() => { animRef.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(animRef.current); }, [phase, draw, v1Final, v2Final]);

  const push = () => {
    stateRef.current = { x1: 0, x2: 0, v1: -v1Final, v2: Math.abs(v2Final) };
    setPhase("pushed");
  };
  const reset = () => {
    setPhase("ready");
    stateRef.current = { x1: 0, x2: 0, v1: 0, v2: 0 };
  };

  return (
    <SimCard title="🧑‍🚀 Astronauts Push Off in Space — Newton's 3rd in Zero-G" desc="Two astronauts float in space. When they push off each other, the force each exerts on the other is EQUAL and OPPOSITE. But since their masses differ, they accelerate differently: a = F/m. Heavier astronaut moves slower!">
      <canvas ref={canvasRef} width={580} height={220} style={{ width: "100%", borderRadius: 12 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14, background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #1e293b" }}>
        <div>
          <div style={{ fontSize: 12, color: "#ef4444", fontWeight: 700, marginBottom: 4 }}>Astronaut A: {m1} kg</div>
          <input type="range" min={40} max={120} value={m1} onChange={e => { setM1(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#ef4444" }} disabled={phase === "pushed"} />
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#3b82f6", fontWeight: 700, marginBottom: 4 }}>Astronaut B: {m2} kg</div>
          <input type="range" min={40} max={120} value={m2} onChange={e => { setM2(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#3b82f6" }} disabled={phase === "pushed"} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 12, justifyContent: "center" }}>
        <button onClick={phase === "ready" ? push : reset} style={{ padding: "10px 24px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", background: phase === "ready" ? "#10b981" : "#1e293b", color: phase === "ready" ? "#0f172a" : "#cbd5e1" }}>
          {phase === "ready" ? "PUSH OFF!" : "RESET"}
        </button>
      </div>
      <TPanel items={[
        { label: "Push Force", value: "200 N (both!)", color: "#ef4444" },
        { label: "A velocity", value: `${v1Final.toFixed(2)} m/s`, color: "#10b981" },
        { label: "B velocity", value: `${Math.abs(v2Final).toFixed(2)} m/s`, color: "#3b82f6" },
        { label: "Total Momentum", value: `${(m1 * v1Final + m2 * v2Final).toFixed(2)} kg·m/s`, color: "#10b981" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 3. SWIMMING — Pushing Water Backward = Moving Forward
 * Arms push water backward (action) → water pushes swimmer forward (reaction)
 * Shows stroke mechanics and drag force opposing motion
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_swimming_propulsion() {
  const [strokeForce, setStrokeForce] = useState(150);
  const [running, setRunning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ x: 60, v: 0, strokePhase: 0 });
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);
  const [display, setDisplay] = useState({ v: 0, drag: 0 });

  const mass = 70;
  const dragCoeff = 20;

  const step = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    const s = stateRef.current;

    if (running) {
      s.strokePhase += dt * 3;
      const strokeActive = Math.sin(s.strokePhase) > 0;
      const appliedForce = strokeActive ? strokeForce : 0;
      const drag = dragCoeff * s.v * s.v;
      const netForce = appliedForce - drag;
      const a = netForce / mass;
      s.v = Math.max(0, s.v + a * dt);
      s.x += s.v * dt * 30;
      if (s.x > 550) s.x = 60;
      setDisplay({ v: s.v, drag });
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Water background
    const waterGrad = ctx.createLinearGradient(0, 0, 0, H);
    waterGrad.addColorStop(0, "#0c4a6e");
    waterGrad.addColorStop(1, "#075985");
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, 0, W, H);

    // Water ripples
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = "#38bdf830";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(stateRef.current.x - 50 + i * 15, H / 2 + 10, 15 + i * 8, 5, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Swimmer
    const s = stateRef.current;
    const armAngle = Math.sin(s.strokePhase) * 0.8;
    ctx.save();
    ctx.translate(s.x, H / 2);

    // Body (streamlined)
    ctx.fillStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.ellipse(0, 0, 25, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath(); ctx.arc(22, -2, 8, 0, Math.PI * 2); ctx.fill();
    // Cap
    ctx.fillStyle = "#ef4444";
    ctx.beginPath(); ctx.ellipse(22, -5, 8, 5, 0, 0, Math.PI); ctx.fill();

    // Arm stroke (action: pushes water backward)
    ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 4; ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-5, -2);
    ctx.lineTo(-5 - 28 * Math.cos(armAngle + 0.5), -2 + 16 * Math.sin(armAngle));
    ctx.stroke();

    // Water push particles (action force backward)
    if (Math.sin(s.strokePhase) > 0.2 && running) {
      ctx.fillStyle = "#38bdf850";
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(-35 - i * 8, 0 + (Math.random() - 0.5) * 10, 4 - i, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "#38bdf8"; ctx.font = "bold 10px Inter"; ctx.textAlign = "right";
      ctx.fillText("← Water pushed back (ACTION)", -45, 16);
    }

    ctx.restore();

    // Force arrows
    const s2 = stateRef.current;
    const strokeActive = Math.sin(s2.strokePhase) > 0;
    if (running && strokeActive) {
      ctx.fillStyle = "#10b981"; ctx.font = "bold 11px Inter"; ctx.textAlign = "left";
      ctx.fillText(`→ Propulsion (REACTION): ${strokeForce}N`, s2.x + 30, H / 2 - 30);
    }
    const drag = display.drag;
    if (drag > 1) {
      ctx.fillStyle = "#ef4444"; ctx.font = "bold 11px Inter"; ctx.textAlign = "left";
      ctx.fillText(`← Drag: ${drag.toFixed(0)}N`, s2.x - 80, H / 2 + 30);
    }

    // Speed display
    ctx.fillStyle = "#0f172a";
    ctx.beginPath(); ctx.roundRect(10, 10, 150, 36, 8); ctx.fill();
    ctx.fillStyle = "#38bdf8"; ctx.font = "bold 14px JetBrains Mono"; ctx.textAlign = "center";
    ctx.fillText(`${(display.v * 3.6).toFixed(1)} km/h`, 85, 30);
    ctx.fillStyle = "#64748b"; ctx.font = "10px Inter";
    ctx.fillText("Swimmer Speed", 85, 42);

    animRef.current = requestAnimationFrame(step);
  }, [running, strokeForce, mass, dragCoeff]);

  useEffect(() => { animRef.current = requestAnimationFrame(step); return () => cancelAnimationFrame(animRef.current); }, [step]);

  return (
    <SimCard title="🏊 Swimming — Action-Reaction in Water" desc="A swimmer pushes water backward with each arm stroke (ACTION). Water pushes the swimmer forward with equal force (REACTION). The terminal speed is reached when propulsion = drag force. F = ma determines acceleration between strokes.">
      <canvas ref={canvasRef} width={600} height={200} style={{ width: "100%", borderRadius: 12 }} />
      <div style={{ display: "flex", gap: 12, marginTop: 14, alignItems: "center", background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #1e293b" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: "#38bdf8", fontWeight: 700, marginBottom: 4 }}>Stroke Force: {strokeForce} N</div>
          <input type="range" min={50} max={300} value={strokeForce} onChange={e => setStrokeForce(+e.target.value)} style={{ width: "100%", accentColor: "#38bdf8" }} />
        </div>
        <button onClick={() => setRunning(!running)} style={{ padding: "10px 24px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", background: running ? "#ef4444" : "#10b981", color: "#0f172a" }}>
          {running ? "STOP" : "SWIM!"}
        </button>
      </div>
      <TPanel items={[
        { label: "Action", value: `${strokeForce}N ← (Water)`, color: "#38bdf8" },
        { label: "Reaction", value: `${strokeForce}N → (Swimmer)`, color: "#10b981" },
        { label: "Speed", value: `${(display.v * 3.6).toFixed(1)} km/h`, color: "#f59e0b" },
        { label: "Drag Force", value: `${display.drag.toFixed(0)} N`, color: "#ef4444" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 4. SPRING COMPRESSED BETWEEN TWO CARTS
 * A compressed spring is released between two carts at rest.
 * Spring exerts equal & opposite forces → carts fly apart.
 * Classic demonstration of Newton's 3rd Law + momentum conservation.
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_spring_release() {
  const [m1, setM1] = useState(2);
  const [m2, setM2] = useState(5);
  const [springEnergy, setSpringEnergy] = useState(50); // joules
  const [phase, setPhase] = useState<"ready" | "released">("ready");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ x1: 0, x2: 0 });
  const velRef = useRef({ v1: 0, v2: 0 });
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);

  // Conservation of energy + momentum:
  // ½m₁v₁² + ½m₂v₂² = E_spring
  // m₁v₁ + m₂v₂ = 0 (momentum conservation, started at rest)
  // → v₁ = √(2E·m₂ / (m₁(m₁+m₂))), v₂ = -m₁v₁/m₂
  const v1 = Math.sqrt((2 * springEnergy * m2) / (m1 * (m1 + m2)));
  const v2 = -(m1 * v1) / m2;

  const step = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    stateRef.current.x1 += velRef.current.v1 * dt * 40;
    stateRef.current.x2 += velRef.current.v2 * dt * 40;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const cx = W / 2;
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, W, H);
    // Track
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, H - 30, W, 30);
    ctx.strokeStyle = "#334155"; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 20) {
      ctx.beginPath(); ctx.moveTo(x, H - 15); ctx.lineTo(x + 10, H - 15); ctx.stroke();
    }

    const x1 = cx - 60 + stateRef.current.x1;
    const x2 = cx + 60 + stateRef.current.x2;
    const cartH = 44, cartY = H - 30 - cartH;
    const w1 = 30 + m1 * 8, w2 = 30 + m2 * 8;

    // Spring (compressed or released)
    if (phase === "ready") {
      const springX = cx - 18;
      for (let i = 0; i < 8; i++) {
        const sx = springX + i * 5;
        const yOff = i % 2 === 0 ? -5 : 5;
        ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sx, cartY + cartH / 2 + (i % 2 === 0 ? 5 : -5));
        ctx.lineTo(sx + 4, cartY + cartH / 2 - (i % 2 === 0 ? 5 : -5));
        ctx.stroke();
      }
      ctx.fillStyle = "#f59e0b"; ctx.font = "10px Inter"; ctx.textAlign = "center";
      ctx.fillText("🌀 Compressed Spring", cx, cartY - 8);
    }

    // Cart 1 (left, lighter)
    ctx.fillStyle = "#6366f1";
    ctx.beginPath(); ctx.roundRect(x1 - w1, cartY, w1, cartH, 4); ctx.fill();
    ctx.strokeStyle = "#a5b4fc"; ctx.lineWidth = 1.5; ctx.stroke();
    // Wheels
    [x1 - w1 * 0.25, x1 - w1 * 0.75].forEach(wx => {
      ctx.fillStyle = "#1e293b";
      ctx.beginPath(); ctx.arc(wx, H - 30, 8, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#64748b"; ctx.lineWidth = 1; ctx.stroke();
    });
    ctx.fillStyle = "#fff"; ctx.font = `bold ${Math.max(10, 13 - m1)}px JetBrains Mono`; ctx.textAlign = "center";
    ctx.fillText(`${m1}kg`, x1 - w1 / 2, cartY + cartH / 2 + 5);

    // Cart 2 (right, heavier)
    ctx.fillStyle = "#ef4444";
    ctx.beginPath(); ctx.roundRect(x2, cartY, w2, cartH, 4); ctx.fill();
    ctx.strokeStyle = "#f87171"; ctx.lineWidth = 1.5; ctx.stroke();
    [x2 + w2 * 0.25, x2 + w2 * 0.75].forEach(wx => {
      ctx.fillStyle = "#1e293b";
      ctx.beginPath(); ctx.arc(wx, H - 30, 8, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#64748b"; ctx.lineWidth = 1; ctx.stroke();
    });
    ctx.fillStyle = "#fff"; ctx.font = `bold ${Math.max(10, 13 - m2)}px JetBrains Mono`; ctx.textAlign = "center";
    ctx.fillText(`${m2}kg`, x2 + w2 / 2, cartY + cartH / 2 + 5);

    // Velocity arrows
    if (phase === "released") {
      // Cart 1 velocity arrow
      const v1Arrow = Math.min(Math.abs(v1) * 20, 80);
      ctx.strokeStyle = "#10b981"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(x1 - w1, cartY + 10); ctx.lineTo(x1 - w1 - v1Arrow, cartY + 10); ctx.stroke();
      ctx.fillStyle = "#10b981"; ctx.font = "bold 10px JetBrains Mono"; ctx.textAlign = "right";
      ctx.fillText(`← ${v1.toFixed(2)}m/s`, x1 - w1 - v1Arrow - 2, cartY + 14);

      ctx.strokeStyle = "#f87171"; ctx.lineWidth = 2.5;
      const v2Arrow = Math.min(Math.abs(v2) * 20, 80);
      ctx.beginPath(); ctx.moveTo(x2 + w2, cartY + 10); ctx.lineTo(x2 + w2 + v2Arrow, cartY + 10); ctx.stroke();
      ctx.fillStyle = "#f87171"; ctx.font = "bold 10px JetBrains Mono"; ctx.textAlign = "left";
      ctx.fillText(`${Math.abs(v2).toFixed(2)}m/s →`, x2 + w2 + v2Arrow + 2, cartY + 14);

      // Momentum conservation check
      ctx.fillStyle = "#10b98120";
      ctx.beginPath(); ctx.roundRect(cx - 130, 10, 260, 26, 8); ctx.fill();
      ctx.fillStyle = "#10b981"; ctx.font = "bold 11px JetBrains Mono"; ctx.textAlign = "center";
      ctx.fillText(`p_total = ${(m1 * v1 + m2 * v2).toFixed(2)} ≈ 0 ✓ Conserved!`, cx, 28);
    }

    animRef.current = requestAnimationFrame(step);
  }, [phase, v1, v2, m1, m2]);

  useEffect(() => { animRef.current = requestAnimationFrame(step); return () => cancelAnimationFrame(animRef.current); }, [step]);

  const release = () => {
    stateRef.current = { x1: 0, x2: 0 };
    velRef.current = { v1: -v1, v2: Math.abs(v2) };
    setPhase("released");
  };
  const reset = () => { setPhase("ready"); stateRef.current = { x1: 0, x2: 0 }; velRef.current = { v1: 0, v2: 0 }; };

  return (
    <SimCard title="🎯 Spring Release Between Carts — 3rd Law + Momentum" desc="A compressed spring between two carts is released. Spring exerts EQUAL & OPPOSITE forces on each cart (Newton's 3rd). Lighter cart moves faster (Newton's 2nd). Total momentum stays zero!">
      <canvas ref={canvasRef} width={580} height={180} style={{ width: "100%", borderRadius: 12 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 14, background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #1e293b" }}>
        <div>
          <div style={{ fontSize: 12, color: "#6366f1", fontWeight: 700, marginBottom: 4 }}>Cart 1: {m1} kg</div>
          <input type="range" min={1} max={10} value={m1} onChange={e => { setM1(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#6366f1" }} disabled={phase === "released"} />
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#ef4444", fontWeight: 700, marginBottom: 4 }}>Cart 2: {m2} kg</div>
          <input type="range" min={1} max={10} value={m2} onChange={e => { setM2(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#ef4444" }} disabled={phase === "released"} />
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#f59e0b", fontWeight: 700, marginBottom: 4 }}>Spring Energy: {springEnergy} J</div>
          <input type="range" min={10} max={200} value={springEnergy} onChange={e => { setSpringEnergy(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#f59e0b" }} disabled={phase === "released"} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 12, justifyContent: "center" }}>
        <button onClick={phase === "ready" ? release : reset} style={{ padding: "10px 24px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", background: phase === "ready" ? "#f59e0b" : "#1e293b", color: "#0f172a" }}>
          {phase === "ready" ? "🌀 RELEASE SPRING!" : "RESET"}
        </button>
      </div>
      <TPanel items={[
        { label: "Spring Force", value: "Equal & Opposite", color: "#f59e0b" },
        { label: "Cart 1 Speed", value: `${v1.toFixed(2)} m/s`, color: "#6366f1" },
        { label: "Cart 2 Speed", value: `${Math.abs(v2).toFixed(2)} m/s`, color: "#ef4444" },
        { label: "Total Momentum", value: `${(m1 * v1 + m2 * v2).toFixed(2)} kg·m/s`, color: "#10b981" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 5. HORSE-CART PARADOX RESOLVED
 * "If horse pulls cart with equal force, how does anything move?"
 * Answer: The system accelerates based on NET external forces.
 * Forces are on DIFFERENT OBJECTS — they don't cancel each other!
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_horse_cart_resolved() {
  const [roadFriction, setRoadFriction] = useState(0.05);
  const [horseForce, setHorseForce] = useState(800);
  const [running, setRunning] = useState(false);
  const [x, setX] = useState(0);
  const velRef = useRef(0);
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);

  const totalMass = 500; // horse + cart kg
  const friction = roadFriction * totalMass * 9.8;
  const netForce = horseForce - friction;
  const accel = netForce / totalMass;

  useEffect(() => {
    if (!running) return;
    const step = (t: number) => {
      if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
      const dt = Math.min((t - lastRef.current) / 1000, 0.05);
      lastRef.current = t;
      velRef.current = Math.max(0, velRef.current + accel * dt);
      setX(prev => { const nx = prev + velRef.current * dt * 20; return nx > 600 ? 0 : nx; });
      animRef.current = requestAnimationFrame(step);
    };
    lastRef.current = 0;
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [running, accel]);

  return (
    <SimCard title="🐴 Horse-Cart Paradox — Why the 3rd Law Doesn't Cancel" desc="The horse pulls the cart forward (reaction). The cart pulls the horse backward (action) — Newton's 3rd Law. BUT these forces act on DIFFERENT objects! For the SYSTEM: the only external force is ground friction. Net system force = Horse thrust − Friction = ma.">
      <div style={{ background: "#020617", borderRadius: 12, padding: 20, minHeight: 220, position: "relative", overflow: "hidden" }}>
        {/* Ground */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, background: "#1e293b" }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: i * 30, top: 0, width: 15, height: 40, background: "#334155", opacity: 0.5 }} />
          ))}
        </div>

        {/* Moving group */}
        <div style={{ position: "absolute", left: x % 600, bottom: 40, display: "flex", alignItems: "flex-end', gap: 4" as any }}>
          {/* Horse */}
          <div style={{ fontSize: 48, marginBottom: -4 }}>🐴</div>
          {/* Rope */}
          <div style={{ width: 30, height: 4, background: "#8b5cf6", alignSelf: "center", marginBottom: 24 }} />
          {/* Cart */}
          <div style={{ width: 80, height: 50, background: "#78350f", borderRadius: 4, border: "2px solid #92400e", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 20 }}>📦</span>
          </div>
        </div>

        {/* Force labels */}
        <div style={{ position: "absolute", top: 12, left: 16, right: 16 }}>
          <div style={{ color: "#10b981", fontSize: 12, fontWeight: 700 }}>
            → Horse thrust: {horseForce}N (ground pushes horse via friction)
          </div>
          <div style={{ color: "#ef4444", fontSize: 12, fontWeight: 700, marginTop: 2 }}>
            ← Road friction: {friction.toFixed(0)}N (total resistance)
          </div>
          <div style={{ color: "#f59e0b", fontSize: 12, fontWeight: 700, marginTop: 2 }}>
            ⇒ Net Force = {netForce.toFixed(0)}N → a = {accel.toFixed(2)} m/s²
          </div>
        </div>

        {/* Explanation box */}
        <div style={{ position: "absolute", bottom: 48, right: 16, background: "#0f172a", padding: "8px 12px", borderRadius: 8, border: "1px solid #8b5cf6", maxWidth: 220 }}>
          <div style={{ color: "#a78bfa", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>KEY INSIGHT:</div>
          <div style={{ color: "#94a3b8", fontSize: 10, lineHeight: 1.5 }}>
            Horse-Cart 3rd Law pair forces are on DIFFERENT objects. They CANNOT cancel! System moves if net EXTERNAL force ≠ 0.
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14, background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #1e293b" }}>
        <div>
          <div style={{ fontSize: 12, color: "#10b981", fontWeight: 700, marginBottom: 4 }}>Horse Thrust: {horseForce} N</div>
          <input type="range" min={100} max={2000} step={50} value={horseForce} onChange={e => setHorseForce(+e.target.value)} style={{ width: "100%", accentColor: "#10b981" }} />
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#ef4444", fontWeight: 700, marginBottom: 4 }}>Road Friction: μ = {roadFriction}</div>
          <input type="range" min={0.01} max={0.4} step={0.01} value={roadFriction} onChange={e => setRoadFriction(+e.target.value)} style={{ width: "100%", accentColor: "#ef4444" }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 12, justifyContent: "center" }}>
        <button onClick={() => setRunning(!running)} style={{ padding: "10px 24px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", background: running ? "#ef4444" : "#10b981", color: "#0f172a" }}>
          {running ? "STOP" : "MOVE!"}
        </button>
      </div>
      <TPanel items={[
        { label: "Horse Thrust", value: `${horseForce} N`, color: "#10b981" },
        { label: "Friction", value: `${friction.toFixed(0)} N`, color: "#ef4444" },
        { label: "Net Force", value: `${netForce.toFixed(0)} N`, color: netForce > 0 ? "#f59e0b" : "#94a3b8" },
        { label: "Acceleration", value: `${accel.toFixed(2)} m/s²`, color: accel > 0 ? "#6366f1" : "#ef4444" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 6. TRAMPOLINE — Action-Reaction with Elastic Deformation
 * Person jumps on trampoline. Person pushes trampoline down (action).
 * Trampoline pushes person up with greater-than-weight force (reaction).
 * Shows how elastic stored energy returns as force.
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_trampoline_bounce() {
  const [mass, setMass] = useState(60);
  const [jumpHeight, setJumpHeight] = useState(2); // meters
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ y: 0, v: 0, onTrampoline: false, contactTime: 0 });
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);
  const [running, setRunning] = useState(false);
  const [display, setDisplay] = useState({ y: 0, v: 0, force: 0 });

  const g = 9.8;
  const weight = mass * g;
  const v_impact = Math.sqrt(2 * g * jumpHeight); // speed when hitting trampoline
  const bounceTime = 0.5; // seconds on trampoline
  const avgBounceForce = (mass * 2 * v_impact / bounceTime) + weight;
  const k_trampoline = avgBounceForce / 0.3; // spring constant estimation

  const step = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    const s = stateRef.current;

    const trampolineY = 0; // pixels from bottom of scene
    const sceneH = 300;
    const displayY = sceneH - 100 - s.y * 30;

    if (s.y <= 0 && s.v <= 0 && s.onTrampoline) {
      // On trampoline: spring restores
      s.contactTime += dt;
      const compression = -s.y; // how much trampoline is pressed
      const springForce = k_trampoline * compression / 100 - weight;
      const a = springForce / mass;
      s.v += a * dt;
      s.y += s.v * dt;
      if (s.y > 0) { s.y = 0; s.onTrampoline = false; }
      setDisplay({ y: s.y, v: s.v, force: springForce + weight });
    } else {
      s.onTrampoline = false;
      s.v -= g * dt;
      s.y += s.v * dt;
      if (s.y <= 0) { s.onTrampoline = true; s.contactTime = 0; }
      setDisplay({ y: s.y, v: s.v, force: 0 });
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, W, H);

    // Frame legs
    ctx.strokeStyle = "#475569"; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(100, H - 20); ctx.lineTo(120, H - 80); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W - 100, H - 20); ctx.lineTo(W - 120, H - 80); ctx.stroke();

    // Trampoline bed (deforms when person is on it)
    const deform = Math.max(0, -s.y * 8);
    ctx.strokeStyle = "#10b981"; ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(120, H - 80);
    ctx.quadraticCurveTo(W / 2, H - 80 + deform, W - 120, H - 80);
    ctx.stroke();
    ctx.strokeStyle = "#065f46"; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(120, H - 80);
    ctx.quadraticCurveTo(W / 2, H - 80 + deform + 5, W - 120, H - 80);
    ctx.stroke();

    // Person
    const personY = H - 80 - (s.y * 30) - deform;
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath(); ctx.arc(W / 2, personY - 24, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ef4444";
    ctx.beginPath(); ctx.ellipse(W / 2, personY - 4, 12, 18, 0, 0, Math.PI * 2); ctx.fill();

    // Arms up when jumping
    if (s.v > 1) {
      ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(W / 2 - 5, personY - 10); ctx.lineTo(W / 2 - 20, personY - 26); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W / 2 + 5, personY - 10); ctx.lineTo(W / 2 + 20, personY - 26); ctx.stroke();
    }

    // Force arrows (when on trampoline)
    if (s.onTrampoline && display.force > weight) {
      const extraForce = display.force - weight;
      const arrowH = Math.min(extraForce * 0.15, 80);
      ctx.strokeStyle = "#10b981"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(W / 2 + 30, personY); ctx.lineTo(W / 2 + 30, personY - arrowH); ctx.stroke();
      ctx.fillStyle = "#10b981"; ctx.font = "bold 10px JetBrains Mono"; ctx.textAlign = "left";
      ctx.fillText(`↑ ${display.force.toFixed(0)}N (REACTION)`, W / 2 + 35, personY - arrowH / 2);
      ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(W / 2 - 30, personY); ctx.lineTo(W / 2 - 30, personY + 40); ctx.stroke();
      ctx.fillStyle = "#ef4444"; ctx.font = "bold 10px JetBrains Mono"; ctx.textAlign = "right";
      ctx.fillText(`${weight.toFixed(0)}N + impulse ↓ (ACTION)`, W / 2 - 35, personY + 25);
    }

    // Height indicator
    ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(80, H - 80); ctx.lineTo(80, personY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#f59e0b"; ctx.font = "bold 11px JetBrains Mono"; ctx.textAlign = "right";
    ctx.fillText(`${Math.max(0, s.y).toFixed(1)}m`, 78, (H - 80 + personY) / 2);

    animRef.current = requestAnimationFrame(step);
  }, [display.force, s, weight, mass, g, k_trampoline]);

  useEffect(() => {
    if (running) { stateRef.current = { y: jumpHeight, v: 0, onTrampoline: false, contactTime: 0 }; lastRef.current = 0; animRef.current = requestAnimationFrame(step); }
    else cancelAnimationFrame(animRef.current);
    return () => cancelAnimationFrame(animRef.current);
  }, [running, step, jumpHeight]);

  return (
    <SimCard title="🤸 Trampoline — Action-Reaction with Elastic Force" desc="Person pushes trampoline DOWN (action force = weight + impact). Trampoline stretches and stores elastic energy, then pushes person UP with greater force (reaction). The reaction force exceeds weight → person accelerates upward! This is Newton's 3rd Law with stored energy.">
      <canvas ref={canvasRef} width={560} height={300} style={{ width: "100%", borderRadius: 12 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14, background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #1e293b" }}>
        <div>
          <div style={{ fontSize: 12, color: "#fbbf24", fontWeight: 700, marginBottom: 4 }}>Person mass: {mass} kg</div>
          <input type="range" min={30} max={120} value={mass} onChange={e => { setMass(+e.target.value); setRunning(false); }} style={{ width: "100%", accentColor: "#fbbf24" }} />
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#10b981", fontWeight: 700, marginBottom: 4 }}>Initial Jump Height: {jumpHeight} m</div>
          <input type="range" min={0.5} max={5} step={0.5} value={jumpHeight} onChange={e => { setJumpHeight(+e.target.value); setRunning(false); }} style={{ width: "100%", accentColor: "#10b981" }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 12, justifyContent: "center" }}>
        <button onClick={() => { setRunning(false); setTimeout(() => setRunning(true), 100); }} style={{ padding: "10px 24px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", background: "#10b981", color: "#0f172a" }}>🤸 JUMP!</button>
        <button onClick={() => setRunning(false)} style={{ padding: "10px 24px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", background: "#1e293b", color: "#cbd5e1" }}>STOP</button>
      </div>
      <TPanel items={[
        { label: "Weight (Action)", value: `${weight.toFixed(0)} N`, color: "#ef4444" },
        { label: "Bounce Force", value: `${avgBounceForce.toFixed(0)} N`, color: "#10b981" },
        { label: "Impact Speed", value: `${v_impact.toFixed(1)} m/s`, color: "#f59e0b" },
        { label: "Force Ratio", value: `${(avgBounceForce / weight).toFixed(1)}× weight`, color: "#6366f1" },
      ]} />
    </SimCard>
  );
}
