/**
 * FILE: Topic2Extra.tsx
 * PURPOSE: 7 ultra-professional simulations for Topic 2 — First Law of Motion (Inertia)
 * Each simulation demonstrates a unique facet of inertia with real physics and animation.
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
 * 1. CAR CRASH — Seatbelt vs No Seatbelt (Inertia of motion)
 * A car hits a wall. Passengers continue moving forward due to inertia.
 * Seatbelt applies backward force to stop them. No seatbelt = hits dashboard.
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_crash_test() {
  const [speed, setSpeed] = useState(60); // km/h
  const [hasSeatbelt, setHasSeatbelt] = useState(true);
  const [phase, setPhase] = useState<"ready" | "driving" | "crashed">("ready");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ carX: 50, personX: 120, carV: 0, personV: 0, crashed: false, t: 0 });
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);

  const speedMs = speed / 3.6;
  const stoppingDistance = hasSeatbelt ? 40 : 5; // px (seatbelt gives more room)
  const decceleration = (speedMs * speedMs) / (2 * stoppingDistance / 100);

  const draw = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(draw); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    const s = stateRef.current;

    if (phase === "driving") {
      s.carX += s.carV * dt * 60;
      s.personX = s.carX + 70;

      if (s.carX >= 340) {
        s.carX = 340;
        s.crashed = true;
        s.carV = 0;
        setPhase("crashed");
      }
    }

    if (phase === "crashed") {
      s.t += dt;
      if (hasSeatbelt) {
        // Person decelerates with car gradually
        s.personX = s.carX + 70 + Math.max(0, 20 * Math.sin(s.t * 8) * Math.exp(-s.t * 3));
      } else {
        // Person flies forward
        s.personX = Math.min(s.carX + 130, s.personX + speedMs * dt * 60);
      }
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Road
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, H - 60, W, 60);
    // Lane markings
    ctx.strokeStyle = "#f59e0b";
    ctx.setLineDash([20, 15]);
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, H - 32); ctx.lineTo(W, H - 32); ctx.stroke();
    ctx.setLineDash([]);

    // Wall
    ctx.fillStyle = "#374151";
    ctx.fillRect(W - 80, 0, 80, H - 60);
    ctx.fillStyle = "#dc2626";
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(W - 80, i * 30, 80, 14);
    }
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "bold 12px Inter";
    ctx.textAlign = "center";
    ctx.fillText("WALL", W - 40, H / 2);

    // Car body (simplified box)
    const carY = H - 100;
    ctx.fillStyle = "#2563eb";
    ctx.beginPath();
    ctx.roundRect(s.carX, carY + 10, 110, 30, 6);
    ctx.fill();
    ctx.fillStyle = "#1d4ed8";
    ctx.fillRect(s.carX, carY + 30, 110, 12);
    // Windows
    ctx.fillStyle = "#bfdbfe";
    ctx.fillRect(s.carX + 15, carY + 12, 35, 14);
    ctx.fillRect(s.carX + 58, carY + 12, 35, 14);
    // Wheels
    ctx.fillStyle = "#1e293b";
    ctx.beginPath(); ctx.arc(s.carX + 20, carY + 42, 8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s.carX + 90, carY + 42, 8, 0, Math.PI * 2); ctx.fill();

    // Speed indicator
    ctx.fillStyle = "#1e293b";
    ctx.fillStyle = "#f97316";
    ctx.font = "bold 11px JetBrains Mono";
    ctx.textAlign = "left";
    ctx.fillText(`${speed} km/h`, s.carX + 5, carY + 5);

    // Person (stick figure in car)
    const pX = s.personX;
    const pY = carY + 20;
    ctx.fillStyle = phase === "crashed" && !hasSeatbelt && s.personX > s.carX + 100 ? "#ef4444" : "#fbbf24";
    ctx.beginPath(); ctx.arc(pX, pY - 6, 7, 0, Math.PI * 2); ctx.fill(); // head
    ctx.beginPath(); ctx.roundRect(pX - 4, pY, 8, 14, 2); ctx.fill(); // body

    // Seatbelt indicator
    if (hasSeatbelt) {
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(pX, pY - 6); ctx.lineTo(pX - 12, pY + 14); ctx.stroke();
    }

    // Crash effects
    if (phase === "crashed") {
      // Impact sparks
      for (let i = 0; i < 5; i++) {
        const sparkAngle = (i / 5) * Math.PI - Math.PI / 2;
        const sparkLen = 15 + Math.random() * 10;
        ctx.strokeStyle = "#f97316";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(s.carX + 110, carY + 25);
        ctx.lineTo(s.carX + 110 + Math.cos(sparkAngle) * sparkLen, carY + 25 + Math.sin(sparkAngle) * sparkLen);
        ctx.stroke();
      }

      // Status badge
      const msg = hasSeatbelt ? "✓ Seatbelt saved them!" : "⚠ Head hit dashboard!";
      const msgColor = hasSeatbelt ? "#10b981" : "#ef4444";
      ctx.fillStyle = msgColor + "20";
      ctx.beginPath(); ctx.roundRect(W / 2 - 100, 12, 200, 30, 8); ctx.fill();
      ctx.fillStyle = msgColor;
      ctx.font = "bold 13px Inter";
      ctx.textAlign = "center";
      ctx.fillText(msg, W / 2, 33);
    }

    animRef.current = requestAnimationFrame(draw);
  }, [phase, hasSeatbelt, speed, speedMs]);

  useEffect(() => { animRef.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(animRef.current); }, [draw]);

  const start = () => {
    stateRef.current = { carX: 50, personX: 120, carV: speedMs / 10, personV: speedMs / 10, crashed: false, t: 0 };
    setPhase("driving");
  };
  const reset = () => { setPhase("ready"); stateRef.current = { carX: 50, personX: 120, carV: 0, personV: 0, crashed: false, t: 0 }; };

  return (
    <SimCard title="🚗 Car Crash — Inertia of Motion" desc="When a car hits a wall, passengers continue moving forward at the car's speed (inertia). A seatbelt applies a backward force to stop them safely. Without it — dashboard impact!">
      <canvas ref={canvasRef} width={600} height={200} style={{ width: "100%", borderRadius: 12 }} />
      <div style={{ display: "flex", gap: 12, marginTop: 16, alignItems: "center", flexWrap: "wrap", background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #1e293b" }}>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ fontSize: 12, color: "#f97316", fontWeight: 700, marginBottom: 4 }}>Speed: {speed} km/h</div>
          <input type="range" min={20} max={120} value={speed} onChange={e => { setSpeed(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#f97316" }} disabled={phase !== "ready"} />
        </div>
        <button onClick={() => { setHasSeatbelt(!hasSeatbelt); reset(); }} style={{ padding: "10px 18px", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", background: hasSeatbelt ? "#10b98120" : "#ef444420", color: hasSeatbelt ? "#10b981" : "#ef4444", border: `1px solid ${hasSeatbelt ? "#10b981" : "#ef4444"}` }}>
          {hasSeatbelt ? "✓ Seatbelt ON" : "✗ Seatbelt OFF"}
        </button>
        <button onClick={phase === "ready" ? start : reset} style={{ padding: "10px 20px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", background: phase === "ready" ? "#10b981" : "#1e293b", color: phase === "ready" ? "#0f172a" : "#cbd5e1" }}>
          {phase === "ready" ? "DRIVE!" : "RESET"}
        </button>
      </div>
      <TPanel items={[
        { label: "Car Speed", value: `${speed} km/h`, color: "#f97316" },
        { label: "Passenger Speed", value: `${speed} km/h`, color: "#fbbf24" },
        { label: "Inertia Principle", value: "1st Law", color: "#6366f1" },
        { label: "Seatbelt", value: hasSeatbelt ? "ON ✓" : "OFF ✗", color: hasSeatbelt ? "#10b981" : "#ef4444" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 2. MARBLE IN A CURVED TUBE — Tangential Release
 * Marble follows circular path due to tube's normal force.
 * When released, it flies off in a STRAIGHT LINE (tangent) — Newton's 1st Law!
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_marble_tube() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [released, setReleased] = useState(false);
  const [speed, setSpeed] = useState(60);
  const stateRef = useRef({ angle: 0, released: false, mx: 0, my: 0, vx: 0, vy: 0 });
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);
  const orbitR = 100;

  const draw = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(draw); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    const s = stateRef.current;
    const omega = speed / 100 * 3;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const cx = W / 2 - 40, cy = H / 2;

    if (!s.released) {
      s.angle += omega * dt;
      s.mx = cx + orbitR * Math.cos(s.angle);
      s.my = cy + orbitR * Math.sin(s.angle);
      // Tangent velocity
      s.vx = -orbitR * omega * Math.sin(s.angle);
      s.vy = orbitR * omega * Math.cos(s.angle);
    } else {
      // No force → straight line
      s.mx += s.vx * dt * 1.2;
      s.my += s.vy * dt * 1.2;
    }

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, W, H);

    // Circular tube
    ctx.beginPath();
    ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 12;
    ctx.stroke();
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 8;
    ctx.stroke();

    // Inner tube edge
    ctx.beginPath();
    ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 10;
    ctx.stroke();

    // Center
    ctx.fillStyle = "#64748b";
    ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill();

    // Centripetal force arrow (toward center) if not released
    if (!s.released) {
      const fcx = cx - s.mx, fcy = cy - s.my;
      const fMag = Math.sqrt(fcx * fcx + fcy * fcy);
      const scale = 0.35;
      ctx.beginPath();
      ctx.moveTo(s.mx, s.my);
      ctx.lineTo(s.mx + fcx * scale, s.my + fcy * scale);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 10px Inter";
      ctx.textAlign = "center";
      ctx.fillText("Centripetal", s.mx + fcx * scale * 0.5 + 20, s.my + fcy * scale * 0.5);

      // Velocity arrow (tangent)
      const vScale = 0.4;
      ctx.beginPath();
      ctx.moveTo(s.mx, s.my);
      ctx.lineTo(s.mx + s.vx * vScale, s.my + s.vy * vScale);
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Marble path after release
    if (s.released) {
      // Draw straight path
      ctx.strokeStyle = "#6366f130";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(s.mx - s.vx * 0.5, s.my - s.vy * 0.5);
      ctx.lineTo(s.mx + s.vx * 2, s.my + s.vy * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Marble
    const mg = ctx.createRadialGradient(s.mx - 3, s.my - 3, 1, s.mx, s.my, 10);
    mg.addColorStop(0, "#e2e8f0");
    mg.addColorStop(1, "#6366f1");
    ctx.fillStyle = mg;
    ctx.beginPath(); ctx.arc(s.mx, s.my, 10, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#a5b4fc"; ctx.lineWidth = 1; ctx.stroke();

    // Label
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "bold 13px Inter";
    ctx.textAlign = "left";
    ctx.fillText(s.released ? "→ Flying STRAIGHT (Newton's 1st Law!)" : "↻ Circular motion (tube pushes inward)", cx + orbitR + 16, cy - 10);
    ctx.fillStyle = "#64748b";
    ctx.font = "12px Inter";
    ctx.fillText(s.released ? "No force = constant velocity" : "Remove tube → straight line", cx + orbitR + 16, cy + 8);

    if (s.mx < 0 || s.mx > W || s.my < 0 || s.my > H) {
      setReleased(false);
      stateRef.current = { ...stateRef.current, released: false, angle: s.angle };
    }

    animRef.current = requestAnimationFrame(draw);
  }, [speed]);

  useEffect(() => { animRef.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(animRef.current); }, [draw]);

  const handleRelease = () => {
    stateRef.current.released = true;
    setReleased(true);
  };

  const reset = () => {
    stateRef.current = { angle: 0, released: false, mx: 0, my: 0, vx: 0, vy: 0 };
    setReleased(false);
  };

  return (
    <SimCard title="🎯 Marble in Tube — Tangent Release (Newton's 1st Law)" desc="The tube's walls constantly push the marble inward (centripetal force), forcing circular motion. Remove the force → marble flies off in a STRAIGHT LINE at the release angle. This is Newton's 1st Law!">
      <canvas ref={canvasRef} width={560} height={280} style={{ width: "100%", borderRadius: 12 }} />
      <div style={{ display: "flex", gap: 12, marginTop: 16, alignItems: "center", flexWrap: "wrap", background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #1e293b" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: "#6366f1", fontWeight: 700, marginBottom: 4 }}>Rotation Speed: {speed}%</div>
          <input type="range" min={20} max={100} value={speed} onChange={e => { setSpeed(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#6366f1" }} disabled={released} />
        </div>
        <button onClick={released ? reset : handleRelease} style={{ padding: "10px 22px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", background: released ? "#1e293b" : "#6366f1", color: released ? "#cbd5e1" : "#fff" }}>
          {released ? "RESET" : "RELEASE MARBLE!"}
        </button>
      </div>
      <TPanel items={[
        { label: "Centripetal Force", value: released ? "REMOVED" : "Present (Red)", color: released ? "#64748b" : "#ef4444" },
        { label: "Motion After", value: released ? "STRAIGHT LINE" : "CIRCULAR", color: released ? "#6366f1" : "#10b981" },
        { label: "Principle", value: "Newton's 1st", color: "#f59e0b" },
        { label: "Net Force", value: released ? "Zero" : "Centripetal", color: released ? "#10b981" : "#ef4444" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 3. SPINNING SKATER — Rotational Inertia
 * Skater spins with arms out → slow. Pull arms in → faster (angular momentum conserved).
 * Shows how distribution of mass affects inertia — and why spinning gets faster.
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_spinning_skater() {
  const [armsIn, setArmsIn] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ angle: 0 });
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);

  // Angular momentum conservation: I₁ω₁ = I₂ω₂
  // Arms out: I_out = 1 (normalized), ω_out = 1 rad/s
  // Arms in: I_in = 0.3 (mass concentrated), ω_in = 1/0.3 ≈ 3.33 rad/s
  const I_out = 1, I_in = 0.3;
  const omega_out = 2;
  const omega_in = (I_out * omega_out) / I_in;
  const currentOmega = armsIn ? omega_in : omega_out;
  const armLength = armsIn ? 15 : 50;

  const draw = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(draw); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    if (spinning) stateRef.current.angle += currentOmega * dt;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2 + 10;
    ctx.clearRect(0, 0, W, H);

    // Ice rink
    const rinkGrad = ctx.createLinearGradient(0, 0, 0, H);
    rinkGrad.addColorStop(0, "#020617");
    rinkGrad.addColorStop(1, "#0c1a2e");
    ctx.fillStyle = rinkGrad;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#1e3a5f";
    ctx.lineWidth = 1;
    for (let i = 0; i < H; i += 30) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i);
      ctx.globalAlpha = 0.3; ctx.stroke(); ctx.globalAlpha = 1;
    }

    const a = stateRef.current.angle;
    const aL = armLength;

    ctx.save();
    ctx.translate(cx, cy);

    // Body
    ctx.fillStyle = "#6366f1";
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 28, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath(); ctx.arc(0, -38, 14, 0, Math.PI * 2); ctx.fill();

    // Arms
    const armAngle = a;
    const armX = Math.cos(armAngle) * aL;
    const armY = Math.sin(armAngle) * aL;
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-5, -10); ctx.lineTo(-5 - armX, -10 + armY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(5, -10); ctx.lineTo(5 + armX, -10 + armY); ctx.stroke();

    // Skirt / skates
    ctx.fillStyle = "#4f46e5";
    ctx.beginPath(); ctx.ellipse(0, 22, 18, 8, 0, 0, Math.PI); ctx.fill();
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-8, 30); ctx.lineTo(-8, 36); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(8, 30); ctx.lineTo(8, 36); ctx.stroke();

    ctx.restore();

    // Rotation speed indicator
    const rpmVal = (currentOmega * 60 / (2 * Math.PI)).toFixed(0);
    ctx.fillStyle = armsIn ? "#f59e0b20" : "#6366f120";
    ctx.beginPath();
    ctx.roundRect(W / 2 - 90, 12, 180, 30, 8);
    ctx.fill();
    ctx.fillStyle = armsIn ? "#f59e0b" : "#6366f1";
    ctx.font = "bold 14px JetBrains Mono";
    ctx.textAlign = "center";
    ctx.fillText(`⟳ ${rpmVal} RPM — ${armsIn ? "ARMS IN (FAST!)" : "ARMS OUT (SLOW)"}`, W / 2, 33);

    // Angular momentum label
    ctx.fillStyle = "#64748b";
    ctx.font = "12px Inter";
    ctx.textAlign = "center";
    ctx.fillText(`L = Iω = ${armsIn ? "0.3" : "1.0"} × ${currentOmega.toFixed(1)} = ${((armsIn ? I_in : I_out) * currentOmega).toFixed(2)} (conserved!)`, W / 2, H - 12);

    animRef.current = requestAnimationFrame(draw);
  }, [spinning, currentOmega, armsIn, armLength]);

  useEffect(() => { animRef.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(animRef.current); }, [draw]);

  return (
    <SimCard title="⛸️ Spinning Skater — Rotational Inertia" desc="A skater spinning with arms out has HIGH moment of inertia (I) and SLOW spin. Pulling arms in reduces I → angular momentum L = Iω is conserved → ω INCREASES! This is why figure skaters spin faster by pulling in.">
      <canvas ref={canvasRef} width={500} height={320} style={{ width: "100%", borderRadius: 12 }} />
      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={() => setSpinning(!spinning)} style={{ padding: "10px 24px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", background: spinning ? "#ef4444" : "#10b981", color: "#0f172a" }}>
          {spinning ? "STOP" : "START SPINNING"}
        </button>
        <button onClick={() => setArmsIn(!armsIn)} disabled={!spinning} style={{ padding: "10px 24px", borderRadius: 10, fontWeight: 700, border: "none", cursor: spinning ? "pointer" : "not-allowed", background: armsIn ? "#f59e0b" : "#1e293b", color: armsIn ? "#0f172a" : "#cbd5e1", opacity: spinning ? 1 : 0.5 }}>
          {armsIn ? "PUT ARMS OUT ↔" : "PULL ARMS IN ↕"}
        </button>
      </div>
      <TPanel items={[
        { label: "Moment of Inertia", value: armsIn ? "0.3 (LOW)" : "1.0 (HIGH)", color: armsIn ? "#f59e0b" : "#6366f1" },
        { label: "Angular Velocity", value: `${currentOmega.toFixed(1)} rad/s`, color: "#10b981" },
        { label: "RPM", value: `${(currentOmega * 60 / (2 * Math.PI)).toFixed(0)} rpm`, color: armsIn ? "#f59e0b" : "#94a3b8" },
        { label: "Ang. Momentum", value: "CONSERVED", color: "#10b981" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 4. PENDULUM — Inertia keeps it swinging
 * A pendulum swings because inertia carries it past equilibrium.
 * At the bottom: max kinetic energy, max inertia keeps it going.
 * Shows energy conversion: PE ↔ KE, and how friction slowly stops it.
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_pendulum_inertia() {
  const [length, setLength] = useState(120);
  const [damping, setDamping] = useState(0.02);
  const [running, setRunning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ theta: 0.8, omega: 0, t: 0 });
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);
  const g = 9.8;
  const [display, setDisplay] = useState({ theta: 0.8, omega: 0, KE: 0, PE: 0 });

  const step = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    const s = stateRef.current;

    // Equation of motion: d²θ/dt² = -(g/L)sinθ - damping*dθ/dt
    const alpha = -(g / length * 0.1) * Math.sin(s.theta) - damping * s.omega;
    s.omega += alpha * dt;
    s.theta += s.omega * dt;

    const mass = 0.5; // kg
    const L = length * 0.01; // m
    const KE = 0.5 * mass * (s.omega * L) ** 2;
    const PE = mass * g * L * (1 - Math.cos(s.theta));

    setDisplay({ theta: s.theta, omega: s.omega, KE, PE });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const pivX = W / 2, pivY = 40;
    const bobX = pivX + length * Math.sin(s.theta);
    const bobY = pivY + length * Math.cos(s.theta);

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, W, H);

    // Equilibrium line
    ctx.strokeStyle = "#1e293b";
    ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(pivX, pivY); ctx.lineTo(pivX, pivY + length + 20); ctx.stroke();
    ctx.setLineDash([]);

    // String
    ctx.beginPath();
    ctx.moveTo(pivX, pivY);
    ctx.lineTo(bobX, bobY);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Pivot
    ctx.fillStyle = "#64748b";
    ctx.beginPath(); ctx.arc(pivX, pivY, 8, 0, Math.PI * 2); ctx.fill();

    // Bob
    const bobGrad = ctx.createRadialGradient(bobX - 5, bobY - 5, 2, bobX, bobY, 18);
    bobGrad.addColorStop(0, "#e879f9");
    bobGrad.addColorStop(1, "#7c3aed");
    ctx.fillStyle = bobGrad;
    ctx.beginPath(); ctx.arc(bobX, bobY, 18, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#a855f7"; ctx.lineWidth = 2; ctx.stroke();

    // KE/PE bar at bottom
    const maxE = (0.5 * 0.5 * (g * length * 0.01) ** 2 / (g * length * 0.01) * g * length * 0.01);
    const totalE = KE + PE;
    const barW = 200;
    const barX = W / 2 - barW / 2;
    const barY = H - 50;

    ctx.fillStyle = "#1e293b";
    ctx.beginPath(); ctx.roundRect(barX, barY, barW, 14, 4); ctx.fill();

    // KE bar (green)
    const keW = Math.min((KE / (totalE + 0.001)) * barW, barW);
    if (keW > 0) {
      ctx.fillStyle = "#10b981";
      ctx.beginPath(); ctx.roundRect(barX, barY, keW, 14, 4); ctx.fill();
    }

    // PE bar (amber) stacked on top
    const peW = Math.min((PE / (totalE + 0.001)) * barW, barW);
    if (peW > 0) {
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath(); ctx.roundRect(barX + barW - peW, barY, peW, 14, 4); ctx.fill();
    }

    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px Inter";
    ctx.textAlign = "left"; ctx.fillText("KE", barX, barY - 4);
    ctx.textAlign = "right"; ctx.fillText("PE", barX + barW, barY - 4);
    ctx.textAlign = "center"; ctx.fillText("Energy: KE ↔ PE (Inertia keeps it going!)", W / 2, barY + 30);

    animRef.current = requestAnimationFrame(step);
  }, [length, damping, g]);

  useEffect(() => {
    if (running) { lastRef.current = 0; animRef.current = requestAnimationFrame(step); }
    else cancelAnimationFrame(animRef.current);
    return () => cancelAnimationFrame(animRef.current);
  }, [running, step]);

  return (
    <SimCard title="🌀 Pendulum — Inertia Keeps It Swinging" desc="At the lowest point, the pendulum has maximum KE (kinetic energy) and maximum velocity. Its inertia carries it PAST the equilibrium, converting KE back to PE. Friction gradually removes energy — that's why it slows.">
      <canvas ref={canvasRef} width={500} height={340} style={{ width: "100%", borderRadius: 12 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16, background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #1e293b" }}>
        <div>
          <div style={{ fontSize: 12, color: "#6366f1", fontWeight: 700, marginBottom: 4 }}>Length: {length} px</div>
          <input type="range" min={50} max={160} value={length} onChange={e => { setLength(+e.target.value); setRunning(false); stateRef.current = { theta: 0.8, omega: 0, t: 0 }; }} style={{ width: "100%", accentColor: "#6366f1" }} />
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#f59e0b", fontWeight: 700, marginBottom: 4 }}>Air Resistance: {(damping * 100).toFixed(0)}%</div>
          <input type="range" min={0.001} max={0.15} step={0.001} value={damping} onChange={e => setDamping(+e.target.value)} style={{ width: "100%", accentColor: "#f59e0b" }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 12, justifyContent: "center" }}>
        <button onClick={() => { stateRef.current = { theta: 0.8, omega: 0, t: 0 }; setRunning(true); }} style={{ padding: "10px 24px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", background: "#10b981", color: "#0f172a" }}>START</button>
        <button onClick={() => setRunning(!running)} style={{ padding: "10px 24px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", background: "#1e293b", color: "#cbd5e1" }}>{running ? "PAUSE" : "RESUME"}</button>
      </div>
      <TPanel items={[
        { label: "KE", value: `${display.KE.toFixed(3)} J`, color: "#10b981" },
        { label: "PE", value: `${display.PE.toFixed(3)} J`, color: "#f59e0b" },
        { label: "Angle", value: `${(display.theta * 180 / Math.PI).toFixed(1)}°`, color: "#6366f1" },
        { label: "Angular V", value: `${display.omega.toFixed(2)} rad/s`, color: "#94a3b8" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 5. COIN STACK FLICK — Inertia of Rest (Detailed)
 * Bottom coin is flicked away rapidly. Stack stays due to inertia of rest.
 * Shows: brief contact time means tiny impulse on upper coins.
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_detailed_coin_flick() {
  const [phase, setPhase] = useState<"ready" | "flicking" | "done">("ready");
  const [speed, setSpeed] = useState(80);
  const [success, setSuccess] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ bottomX: 260, bottomV: 0, stackY: 0, stackV: 0, t: 0 });
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);
  const N = 6; // number of coins in stack

  const draw = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(draw); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    const s = stateRef.current;

    if (phase === "flicking") {
      s.t += dt;
      s.bottomX += s.bottomV * dt * 80;
      // Gravity on stack if flick succeeded
      if (success) {
        s.stackV += 9.8 * dt * 8;
        s.stackY += s.stackV * dt;
        if (s.stackY > 10) { s.stackY = 10; setPhase("done"); }
      } else {
        // Failed flick — stack tilts
        s.stackY += s.stackV * dt * 0.5;
      }
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, W, H);
    // Table surface
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, H - 50, W, 50);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, H - 50); ctx.lineTo(W, H - 50); ctx.stroke();

    const coinW = 70, coinH = 14;
    const stackBaseX = 220, stackBaseY = H - 64 - s.stackY;

    // Stack of coins (all except bottom)
    const colors = ["#f59e0b", "#eab308", "#ca8a04", "#b45309", "#92400e", "#78350f"];
    for (let i = 1; i < N; i++) {
      const coinY = stackBaseY - (i - 1) * (coinH + 2);
      const coinX = stackBaseX + (success ? 0 : Math.sin(s.t * 3) * i * 2);
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.ellipse(coinX + coinW / 2, coinY, coinW / 2, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = colors[(i + 1) % colors.length];
      ctx.beginPath();
      ctx.roundRect(coinX, coinY - coinH, coinW, coinH, 2);
      ctx.fill();
      ctx.strokeStyle = colors[(i + 2) % colors.length];
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Bottom coin (being flicked)
    const bx = phase === "ready" ? stackBaseX : s.bottomX;
    ctx.fillStyle = "#c0c0c0";
    ctx.beginPath();
    ctx.ellipse(bx + coinW / 2, stackBaseY, coinW / 2, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#a0a0a0";
    ctx.beginPath();
    ctx.roundRect(bx, stackBaseY - coinH, coinW, coinH, 2);
    ctx.fill();
    ctx.strokeStyle = "#808080";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "#606060";
    ctx.font = "bold 10px Inter";
    ctx.textAlign = "center";
    ctx.fillText("FLICK ME", bx + coinW / 2, stackBaseY - 4);

    // Flick arrow
    if (phase === "ready") {
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 13px Inter";
      ctx.fillText("→ FLICK!", stackBaseX - 70, stackBaseY - 4);
    }

    // Force label
    if (phase === "flicking") {
      ctx.fillStyle = "#64748b";
      ctx.font = "11px Inter";
      ctx.textAlign = "center";
      ctx.fillText("Very short contact time → Tiny impulse on stack → Stack stays!", W / 2, 24);
    }

    // Done message
    if (phase === "done") {
      ctx.fillStyle = "#10b98120";
      ctx.beginPath(); ctx.roundRect(W / 2 - 120, 8, 240, 32, 8); ctx.fill();
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 14px Inter";
      ctx.textAlign = "center";
      ctx.fillText("✓ Stack stayed! Inertia of rest in action!", W / 2, 29);
    }

    if (phase !== "ready") animRef.current = requestAnimationFrame(draw);
  }, [phase, success]);

  useEffect(() => { if (phase !== "ready") animRef.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(animRef.current); }, [draw, phase]);

  const flick = () => {
    stateRef.current = { bottomX: 220, bottomV: speed / 40, stackY: 0, stackV: 0.1, t: 0 };
    lastRef.current = 0;
    setPhase("flicking");
  };

  const reset = () => { setPhase("ready"); stateRef.current = { bottomX: 220, bottomV: 0, stackY: 0, stackV: 0, t: 0 }; };

  return (
    <SimCard title="🪙 Coin Stack Flick — Inertia of Rest" desc="The bottom silver coin is flicked away FAST. The stack above barely receives any force (very short contact time → tiny impulse). The upper coins STAY PUT due to inertia of rest — they resist any change to their state.">
      <canvas ref={canvasRef} width={580} height={260} style={{ width: "100%", borderRadius: 12 }} />
      <div style={{ display: "flex", gap: 12, marginTop: 16, alignItems: "center", background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #1e293b" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: "#f59e0b", fontWeight: 700, marginBottom: 4 }}>Flick Speed: {speed}%</div>
          <input type="range" min={30} max={100} value={speed} onChange={e => { setSpeed(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#f59e0b" }} disabled={phase !== "ready"} />
          <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>Higher speed = less time = more inertia wins!</div>
        </div>
        <button onClick={phase === "ready" ? flick : reset} style={{ padding: "10px 24px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", background: phase === "ready" ? "#6366f1" : "#1e293b", color: phase === "ready" ? "#fff" : "#cbd5e1" }}>
          {phase === "ready" ? "FLICK!" : "RESET"}
        </button>
      </div>
      <TPanel items={[
        { label: "Contact Time", value: "< 0.01 s", color: "#f59e0b" },
        { label: "Impulse on Stack", value: "≈ 0", color: "#10b981" },
        { label: "Stack State", value: phase === "done" ? "STAYED PUT" : "AT REST", color: "#10b981" },
        { label: "Law Applied", value: "Newton's 1st", color: "#6366f1" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 6. HOVERCRAFT vs ROAD — Friction Removal = Inertia Takes Over
 * Compare a ball on a rough floor vs frictionless air table.
 * Without friction, inertia keeps the ball moving forever.
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_friction_removal() {
  const [mode, setMode] = useState<"rough" | "smooth" | "frictionless">("rough");
  const [running, setRunning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ x1: 60, v1: 0, x2: 60, v2: 0 });
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);
  const friction = { rough: 0.8, smooth: 0.1, frictionless: 0 };
  const [displays, setDisplays] = useState({ x1: 60, v1: 0, x2: 60, v2: 0 });

  const step = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    const s = stateRef.current;
    const mu = friction[mode];

    // All three balls start with same initial velocity
    const decel = mu * 9.8;
    if (s.v1 > 0) { s.v1 = Math.max(0, s.v1 - decel * dt); s.x1 += s.v1 * dt * 80; }
    if (s.v2 > 0) { s.v2 = Math.max(0, s.v2 - friction.rough * dt * 9.8); s.x2 += s.v2 * dt * 80; }

    setDisplays({ x1: s.x1, v1: s.v1, x2: s.x2, v2: s.v2 });

    if (s.x1 < 600 && s.v1 > 0) animRef.current = requestAnimationFrame(step);
    else if (mode === "frictionless") { s.x1 += s.v1 * dt * 80; animRef.current = requestAnimationFrame(step); }
  }, [mode]);

  useEffect(() => {
    if (running) { lastRef.current = 0; animRef.current = requestAnimationFrame(step); }
    else cancelAnimationFrame(animRef.current);
    return () => cancelAnimationFrame(animRef.current);
  }, [running, step]);

  const launch = () => {
    const spd = mode === "frictionless" ? 5 : mode === "smooth" ? 5 : 5;
    stateRef.current = { x1: 60, v1: spd, x2: 60, v2: spd };
    setRunning(true);
  };
  const reset = () => { setRunning(false); stateRef.current = { x1: 60, v1: 0, x2: 60, v2: 0 }; setDisplays({ x1: 60, v1: 0, x2: 60, v2: 0 }); };

  const mu = friction[mode];
  const surfaceColors = { rough: "#78350f", smooth: "#1e3a5f", frictionless: "#064e3b" };

  return (
    <SimCard title="🌬️ Friction Removal — Pure Inertia" desc="Same initial push, different surfaces. Rough surface: friction stops the ball quickly. Smooth: slows gradually. Frictionless (Galileo's ideal): ball moves FOREVER at constant speed — Newton's 1st Law perfectly realized!">
      <div style={{ background: "#020617", borderRadius: 12, padding: 20, minHeight: 200, position: "relative" }}>
        {/* Surface */}
        <div style={{ position: "absolute", bottom: 20, left: 20, right: 20, height: 12, borderRadius: 4, background: surfaceColors[mode] }} />
        <div style={{ position: "absolute", bottom: 36, left: 20, color: "#94a3b8", fontSize: 11, fontWeight: 700 }}>
          μ = {mu} ({mode === "rough" ? "Rough surface" : mode === "smooth" ? "Smooth surface" : "Frictionless (ideal)"})
        </div>

        {/* Ball */}
        <div style={{
          position: "absolute", bottom: 32, left: Math.min(displays.x1, 540),
          width: 32, height: 32, borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%, #60a5fa, #1d4ed8)",
          boxShadow: "0 4px 12px rgba(37,99,235,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.3s",
        }}>
          <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{displays.v1.toFixed(1)}</span>
        </div>

        {/* Velocity label */}
        <div style={{ position: "absolute", top: 12, left: Math.min(displays.x1 + 36, 480), color: "#60a5fa", fontSize: 11, fontWeight: 700 }}>
          v = {displays.v1.toFixed(2)} m/s
        </div>

        {/* Stopped indicator */}
        {running && displays.v1 < 0.05 && mode !== "frictionless" && (
          <div style={{ position: "absolute", bottom: 60, left: displays.x1 - 10, background: "#ef444420", padding: "4px 10px", borderRadius: 8, color: "#ef4444", fontSize: 12, fontWeight: 700, border: "1px solid #ef4444" }}>
            STOPPED (friction won)
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "center", flexWrap: "wrap" }}>
        {(["rough", "smooth", "frictionless"] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); reset(); }} style={{
            padding: "8px 16px", borderRadius: 10, fontWeight: 700, fontSize: 12,
            border: `2px solid ${mode === m ? "#6366f1" : "#1e293b"}`,
            background: mode === m ? "#6366f120" : "#0f172a",
            color: mode === m ? "#a5b4fc" : "#64748b", cursor: "pointer",
          }}>
            {m === "rough" ? "🪨 Rough (μ=0.8)" : m === "smooth" ? "🪟 Smooth (μ=0.1)" : "✨ Frictionless (μ=0)"}
          </button>
        ))}
        <button onClick={running ? reset : launch} style={{ padding: "8px 20px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", background: running ? "#ef4444" : "#10b981", color: "#0f172a" }}>
          {running ? "RESET" : "LAUNCH!"}
        </button>
      </div>
      <TPanel items={[
        { label: "Friction Coeff", value: `μ = ${mu}`, color: mu > 0.5 ? "#ef4444" : mu > 0 ? "#f59e0b" : "#10b981" },
        { label: "Deceleration", value: `${(mu * 9.8).toFixed(1)} m/s²`, color: "#f59e0b" },
        { label: "Speed Now", value: `${displays.v1.toFixed(2)} m/s`, color: "#3b82f6" },
        { label: "Will Stop?", value: mu === 0 ? "NEVER!" : "Yes", color: mu === 0 ? "#10b981" : "#ef4444" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 7. BUS JERK — Passengers lean due to inertia (Forward/Backward)
 * When bus suddenly starts → passengers lean back (inertia of rest)
 * When bus suddenly stops → passengers lean forward (inertia of motion)
 * Real-time animation with physics explanation
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_bus_jerk() {
  const [busState, setBusState] = useState<"stationary" | "starting" | "moving" | "braking" | "stopped">("stationary");
  const [personLean, setPersonLean] = useState(0);
  const animRef = useRef<number>(0);

  useEffect(() => {
    let targetLean = 0;
    if (busState === "starting") targetLean = -20; // lean backward
    else if (busState === "braking") targetLean = 20;  // lean forward
    else targetLean = 0;

    let current = personLean;
    const interval = setInterval(() => {
      current += (targetLean - current) * 0.15;
      setPersonLean(current);
    }, 16);
    return () => clearInterval(interval);
  }, [busState]);

  const busColors: Record<string, string> = {
    stationary: "#334155", starting: "#16a34a", moving: "#2563eb", braking: "#dc2626", stopped: "#334155"
  };

  const explanations: Record<string, { title: string; body: string; color: string }> = {
    stationary: { title: "Bus at rest, Passenger at rest", body: "Everything is still. Balanced forces everywhere.", color: "#94a3b8" },
    starting: { title: "Bus accelerates forward!", body: "Passenger's inertia keeps them at rest briefly → they lean BACKWARD relative to bus", color: "#10b981" },
    moving: { title: "Constant velocity", body: "No acceleration → no net force → passenger stands straight. Newton's 1st Law!", color: "#3b82f6" },
    braking: { title: "Bus decelerates (brakes)!", body: "Passenger's inertia keeps them moving forward → they lean FORWARD relative to bus", color: "#ef4444" },
    stopped: { title: "Bus stopped", body: "Both bus and passenger at rest again. Friction balanced everything.", color: "#94a3b8" },
  };

  const exp = explanations[busState];

  return (
    <SimCard title="🚌 Bus Jerk — Inertia of Passengers" desc="Passengers lean backward when bus starts (inertia of rest resists acceleration). Passengers lean forward when bus brakes (inertia of motion resists deceleration). This is Newton's 1st Law experienced every day!">
      <div style={{ background: "linear-gradient(180deg, #1e293b, #0f172a)", borderRadius: 12, padding: 24, minHeight: 280, display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
        {/* Road */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, background: "#374151", borderRadius: "0 0 12px 12px" }}>
          <div style={{ position: "absolute", top: 14, left: 0, right: 0, height: 4, background: "#f59e0b", opacity: 0.5 }} />
        </div>

        {/* Bus body */}
        <div style={{ width: 280, height: 140, background: busColors[busState], borderRadius: 16, border: "3px solid #64748b", position: "relative", overflow: "hidden", transition: "background 0.5s" }}>
          {/* Windows */}
          {[0, 1, 2].map(i => (
            <div key={i} style={{ position: "absolute", top: 16, left: 24 + i * 80, width: 56, height: 44, background: "#bfdbfe40", borderRadius: 6, border: "2px solid #64748b" }}>
              {/* Person */}
              <div style={{ position: "absolute", bottom: 0, left: "50%", transform: `translateX(-50%) rotate(${i === 1 ? personLean : personLean * 0.7}deg)`, transformOrigin: "bottom center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fbbf24", marginBottom: 1 }} />
                <div style={{ width: 6, height: 16, background: "#6366f1", borderRadius: 2 }} />
              </div>
            </div>
          ))}
          {/* Wheels */}
          <div style={{ position: "absolute", bottom: -12, left: 30, width: 28, height: 28, borderRadius: "50%", background: "#1e293b", border: "3px solid #64748b" }} />
          <div style={{ position: "absolute", bottom: -12, right: 30, width: 28, height: 28, borderRadius: "50%", background: "#1e293b", border: "3px solid #64748b" }} />
          {/* Status indicator */}
          <div style={{ position: "absolute", top: 70, left: "50%", transform: "translateX(-50%)", color: "#fff", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
            {busState.toUpperCase()}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12, background: `${exp.color}10`, padding: 14, borderRadius: 12, border: `1px solid ${exp.color}30` }}>
        <div style={{ color: exp.color, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{exp.title}</div>
        <div style={{ color: "#94a3b8", fontSize: 13 }}>{exp.body}</div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "center", flexWrap: "wrap" }}>
        {(["stationary", "starting", "moving", "braking", "stopped"] as const).map(s => (
          <button key={s} onClick={() => setBusState(s)} style={{
            padding: "8px 14px", borderRadius: 8, fontWeight: 700, fontSize: 11,
            border: `2px solid ${busState === s ? exp.color : "#1e293b"}`,
            background: busState === s ? `${exp.color}20` : "#0f172a",
            color: busState === s ? exp.color : "#64748b", cursor: "pointer",
          }}>
            {s === "stationary" ? "🛑 Stationary" : s === "starting" ? "▶ Starts" : s === "moving" ? "⏩ Moving" : s === "braking" ? "🔴 Brakes" : "🟡 Stopped"}
          </button>
        ))}
      </div>
      <TPanel items={[
        { label: "Bus State", value: busState.toUpperCase(), color: busColors[busState] },
        { label: "Person Leans", value: personLean < -3 ? "BACKWARD" : personLean > 3 ? "FORWARD" : "UPRIGHT", color: Math.abs(personLean) > 3 ? "#f59e0b" : "#10b981" },
        { label: "Cause", value: Math.abs(personLean) > 3 ? "Inertia" : "Balanced", color: "#6366f1" },
        { label: "Law", value: "Newton's 1st", color: "#94a3b8" },
      ]} />
    </SimCard>
  );
}
