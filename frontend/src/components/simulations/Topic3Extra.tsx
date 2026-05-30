/**
 * FILE: Topic3Extra.tsx
 * PURPOSE: 7 ultra-professional simulations for Topic 3 — Second Law of Motion (F = ma)
 * Deep physics logic: variable mass, impulse, real-world scenarios.
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
 * 1. INTERACTIVE F = ma SOLVER WITH LIVE GRAPH
 * Adjust F and m with sliders, watch acceleration change AND
 * see the live acceleration graph plot over time.
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_fma_live_graph() {
  const [force, setForce] = useState(50);
  const [mass, setMass] = useState(10);
  const [running, setRunning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const historyRef = useRef<{ v: number; t: number }[]>([]);
  const stateRef = useRef({ v: 0, x: 0, t: 0 });
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);

  const accel = force / mass;

  const draw = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(draw); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;

    if (running) {
      const s = stateRef.current;
      s.v += accel * dt;
      s.x += s.v * dt;
      s.t += dt;
      historyRef.current.push({ v: s.v, t: s.t });
      if (historyRef.current.length > 200) historyRef.current.shift();
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, W, H);

    // Split canvas: left = physics, right = velocity graph
    const splitX = W * 0.5;

    // === LEFT: Physics scene ===
    const sceneW = splitX - 10;
    // Ground
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, H - 40, sceneW, 40);

    // Object (slides right)
    const objX = 20 + Math.min(stateRef.current.x * 15, sceneW - 80);
    ctx.fillStyle = "#6366f1";
    ctx.beginPath(); ctx.roundRect(objX, H - 100, 60, 60, 8); ctx.fill();
    ctx.strokeStyle = "#a5b4fc"; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = "#fff"; ctx.font = "bold 12px JetBrains Mono"; ctx.textAlign = "center";
    ctx.fillText(`${mass}kg`, objX + 30, H - 63);

    // Force arrow
    const arrowLen = Math.min(force * 1.5, 120);
    ctx.strokeStyle = "#10b981"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(objX + 60, H - 70); ctx.lineTo(objX + 60 + arrowLen, H - 70); ctx.stroke();
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.moveTo(objX + 60 + arrowLen, H - 70);
    ctx.lineTo(objX + 55 + arrowLen, H - 76);
    ctx.lineTo(objX + 55 + arrowLen, H - 64);
    ctx.fill();
    ctx.font = "bold 11px JetBrains Mono"; ctx.textAlign = "left";
    ctx.fillText(`F=${force}N`, objX + 60 + arrowLen / 2, H - 78);

    // F=ma equation display
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "bold 16px JetBrains Mono";
    ctx.textAlign = "center";
    ctx.fillText(`a = F/m = ${force}/${mass} = ${accel.toFixed(2)} m/s²`, sceneW / 2, 28);

    // Acceleration vector on object
    const aLen = Math.min(accel * 8, 80);
    ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 2; ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(objX + 30, H - 70 - 30); ctx.lineTo(objX + 30 + aLen, H - 70 - 30); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#f59e0b"; ctx.font = "10px JetBrains Mono"; ctx.textAlign = "center";
    ctx.fillText(`a=${accel.toFixed(1)}m/s²`, objX + 30 + aLen / 2, H - 112);

    // === RIGHT: Velocity-time graph ===
    const gX = splitX + 10, gY = 20, gW = W - splitX - 20, gH = H - 50;
    ctx.fillStyle = "#0f172a";
    ctx.beginPath(); ctx.roundRect(gX, gY, gW, gH, 8); ctx.fill();
    ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 1; ctx.stroke();

    ctx.fillStyle = "#64748b"; ctx.font = "11px Inter"; ctx.textAlign = "center";
    ctx.fillText("v-t Graph (steeper slope = more acceleration)", gX + gW / 2, gY + gH + 15);

    // Axes
    ctx.strokeStyle = "#334155"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(gX + 10, gY + 10); ctx.lineTo(gX + 10, gY + gH - 10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(gX + 10, gY + gH - 10); ctx.lineTo(gX + gW - 5, gY + gH - 10); ctx.stroke();

    ctx.fillStyle = "#64748b"; ctx.font = "10px Inter"; ctx.textAlign = "left";
    ctx.fillText("v↑", gX + 2, gY + 18);
    ctx.textAlign = "right";
    ctx.fillText("t→", gX + gW - 2, gY + gH - 14);

    // Plot velocity history
    if (historyRef.current.length > 1) {
      const maxV = Math.max(...historyRef.current.map(p => p.v), 1);
      const maxT = Math.max(...historyRef.current.map(p => p.t), 1);
      ctx.beginPath();
      ctx.moveTo(gX + 10, gY + gH - 10 - (historyRef.current[0].v / maxV) * (gH - 30));
      for (const p of historyRef.current) {
        const px = gX + 10 + (p.t / maxT) * (gW - 20);
        const py = gY + gH - 10 - (p.v / maxV) * (gH - 30);
        ctx.lineTo(px, py);
      }
      ctx.strokeStyle = "#10b981"; ctx.lineWidth = 2.5; ctx.stroke();

      // Slope label
      ctx.fillStyle = "#10b981"; ctx.font = "bold 11px JetBrains Mono"; ctx.textAlign = "left";
      ctx.fillText(`slope = a = ${accel.toFixed(2)} m/s²`, gX + 14, gY + 20);
    }

    animRef.current = requestAnimationFrame(draw);
  }, [running, accel, force, mass]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  const reset = () => {
    setRunning(false);
    stateRef.current = { v: 0, x: 0, t: 0 };
    historyRef.current = [];
  };

  return (
    <SimCard title="📈 F = ma Live Graph — See Acceleration in Real Time" desc="Set force and mass. Start the simulation. Watch the velocity-time graph draw itself — the SLOPE of the v-t line IS the acceleration! Higher F or lower m = steeper slope = more acceleration.">
      <canvas ref={canvasRef} width={600} height={280} style={{ width: "100%", borderRadius: 12 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16, background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #1e293b" }}>
        <div>
          <div style={{ fontSize: 12, color: "#10b981", fontWeight: 700, marginBottom: 4 }}>Force: {force} N</div>
          <input type="range" min={1} max={200} value={force} onChange={e => { setForce(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#10b981" }} />
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#6366f1", fontWeight: 700, marginBottom: 4 }}>Mass: {mass} kg</div>
          <input type="range" min={1} max={50} value={mass} onChange={e => { setMass(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#6366f1" }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 12, justifyContent: "center" }}>
        <button onClick={() => { reset(); setTimeout(() => setRunning(true), 50); }} style={{ padding: "10px 24px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", background: "#10b981", color: "#0f172a" }}>START</button>
        <button onClick={() => setRunning(!running)} style={{ padding: "10px 24px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", background: "#1e293b", color: "#cbd5e1" }}>{running ? "PAUSE" : "RESUME"}</button>
        <button onClick={reset} style={{ padding: "10px 24px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", background: "#334155", color: "#cbd5e1" }}>RESET</button>
      </div>
      <TPanel items={[
        { label: "Force", value: `${force} N`, color: "#10b981" },
        { label: "Mass", value: `${mass} kg`, color: "#6366f1" },
        { label: "Acceleration", value: `${accel.toFixed(2)} m/s²`, color: "#f59e0b" },
        { label: "Graph Slope", value: `${accel.toFixed(2)}`, color: "#10b981" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 2. IMPULSE — Force × Time = Change in Momentum
 * Same final momentum can be achieved by: large force × short time OR
 * small force × long time. Shows why airbags/crumple zones save lives.
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_impulse_demo() {
  const [scenario, setScenario] = useState<"hard-stop" | "airbag" | "crumple">("hard-stop");
  const [running, setRunning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ x: 80, v: 0, deforming: false, t: 0, impulseT: 0, peakF: 0 });
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);

  const configs = {
    "hard-stop": { color: "#ef4444", label: "Hard Stop (Wall)", dt: 0.01, peakF: 50000, description: "Sudden stop → enormous force for tiny time → injuries!" },
    "airbag": { color: "#f59e0b", label: "Airbag", dt: 0.08, peakF: 6250, description: "Airbag extends contact time → much smaller force!" },
    "crumple": { color: "#10b981", label: "Crumple Zone", dt: 0.15, peakF: 3333, description: "Crumple zone gives maximum time → minimum force → safest!" },
  };

  const cfg = configs[scenario];
  const mass = 70; // person kg
  const v0 = 15; // m/s initial speed
  const momentum = mass * v0; // kg⋅m/s
  const avgForce = momentum / cfg.dt; // Impulse = Δp → F = Δp/Δt

  const draw = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(draw); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;

    if (running) {
      const s = stateRef.current;
      s.t += dt;
      if (!s.deforming) {
        s.v -= 0; // constant speed toward wall
        s.x += 5; // move right
        if (s.x >= W * 0.6) { s.deforming = true; s.impulseT = 0; s.peakF = 0; }
      } else {
        s.impulseT += dt;
        // Simulate impact pulse
        const impulseFraction = s.impulseT / cfg.dt;
        s.peakF = avgForce * 4 * impulseFraction * (1 - impulseFraction); // parabolic pulse
        if (s.impulseT >= cfg.dt) { setRunning(false); }
      }
    }

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, W, H);

    const s = stateRef.current;

    // Wall
    ctx.fillStyle = "#374151";
    ctx.fillRect(W * 0.72, 30, 30, H - 50);
    ctx.fillStyle = "#4b5563";
    for (let i = 0; i < 6; i++) ctx.fillRect(W * 0.72, 30 + i * 30, 30, 14);

    // Crumple / airbag zone visualization
    if (scenario === "crumple") {
      const crumpleW = Math.min(s.impulseT * 80, 40);
      ctx.fillStyle = "#10b98130";
      ctx.fillRect(W * 0.72 - crumpleW, H / 2 - 30, crumpleW, 60);
      ctx.strokeStyle = "#10b981";
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(W * 0.72 - crumpleW + i * 8, H / 2 - 30);
        ctx.lineTo(W * 0.72 - crumpleW + i * 8, H / 2 + 30);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }
    if (scenario === "airbag" && s.deforming) {
      const radius = Math.min(s.impulseT * 200, 35);
      ctx.fillStyle = "#f59e0b20";
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(W * 0.6 + radius, H / 2, radius, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#f59e0b";
      ctx.font = "10px Inter"; ctx.textAlign = "center";
      ctx.fillText("AIRBAG", W * 0.6 + radius, H / 2 + 3);
    }

    // Car/person
    const carColor = cfg.color;
    ctx.fillStyle = carColor + "80";
    ctx.beginPath(); ctx.roundRect(s.x - 50, H / 2 - 28, 60, 56, 8); ctx.fill();
    ctx.strokeStyle = carColor; ctx.lineWidth = 2; ctx.stroke();
    // Person in car
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath(); ctx.arc(s.x + 4, H / 2 - 8, 8, 0, Math.PI * 2); ctx.fill();

    // Force bar (during impact)
    if (s.deforming && s.peakF > 0) {
      const barH = Math.min((s.peakF / 50000) * 100, 100);
      ctx.fillStyle = carColor + "30";
      ctx.fillRect(30, H - 20 - 110, 40, 110);
      ctx.fillStyle = carColor;
      ctx.fillRect(30, H - 20 - barH, 40, barH);
      ctx.fillStyle = "#f1f5f9"; ctx.font = "11px JetBrains Mono"; ctx.textAlign = "center";
      ctx.fillText(`F=${(s.peakF / 1000).toFixed(0)}kN`, 50, H - 25 - barH);
      ctx.fillStyle = "#64748b"; ctx.font = "10px Inter";
      ctx.fillText("Force", 50, H - 8);
    }

    // Momentum/impulse summary at top
    ctx.fillStyle = "#f1f5f9"; ctx.font = "bold 14px JetBrains Mono"; ctx.textAlign = "center";
    ctx.fillText(`Impulse = Δp = ${momentum.toFixed(0)} kg·m/s (SAME for all!)`, W / 2, 22);
    ctx.fillStyle = cfg.color; ctx.font = "bold 13px Inter";
    ctx.fillText(`${cfg.label}: Avg Force = ${(avgForce / 1000).toFixed(0)} kN over ${(cfg.dt * 1000).toFixed(0)} ms`, W / 2, 42);

    if (running || s.deforming) animRef.current = requestAnimationFrame(draw);
  }, [running, scenario, cfg, avgForce, momentum]);

  useEffect(() => { animRef.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(animRef.current); }, [draw]);

  const start = () => { stateRef.current = { x: 80, v: v0, deforming: false, t: 0, impulseT: 0, peakF: 0 }; lastRef.current = 0; setRunning(true); };
  const reset = () => { setRunning(false); stateRef.current = { x: 80, v: 0, deforming: false, t: 0, impulseT: 0, peakF: 0 }; };

  return (
    <SimCard title="💥 Impulse = F × Δt = Δp — Why Airbags Save Lives" desc="Impulse (change in momentum) is fixed by the crash speed. But you can spread it over a longer time → SMALLER force! Airbags and crumple zones extend contact time from milliseconds to 100ms → force drops 15x!">
      <canvas ref={canvasRef} width={600} height={220} style={{ width: "100%", borderRadius: 12 }} />
      <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "center", flexWrap: "wrap" }}>
        {(["hard-stop", "airbag", "crumple"] as const).map(s => (
          <button key={s} onClick={() => { setScenario(s); reset(); }} style={{
            padding: "9px 18px", borderRadius: 10, fontWeight: 700, fontSize: 12,
            border: `2px solid ${scenario === s ? configs[s].color : "#1e293b"}`,
            background: scenario === s ? configs[s].color + "20" : "#0f172a",
            color: scenario === s ? configs[s].color : "#64748b", cursor: "pointer",
          }}>{configs[s].label}</button>
        ))}
        <button onClick={running ? reset : start} style={{ padding: "9px 22px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", background: running ? "#ef4444" : "#10b981", color: "#0f172a" }}>
          {running ? "RESET" : "CRASH!"}
        </button>
      </div>
      <div style={{ marginTop: 12, padding: 12, background: "#0f172a", borderRadius: 10, border: `1px solid ${cfg.color}40` }}>
        <span style={{ color: cfg.color, fontWeight: 700, fontSize: 13 }}>{cfg.description}</span>
      </div>
      <TPanel items={[
        { label: "Momentum (Δp)", value: `${momentum.toFixed(0)} kg·m/s`, color: "#6366f1" },
        { label: "Contact Time", value: `${(cfg.dt * 1000).toFixed(0)} ms`, color: "#f59e0b" },
        { label: "Avg Force", value: `${(avgForce / 1000).toFixed(1)} kN`, color: cfg.color },
        { label: "Peak Force", value: `${(cfg.peakF / 1000).toFixed(0)} kN`, color: "#ef4444" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 3. VARIABLE MASS ROCKET — F=ma with changing mass
 * As fuel burns, the rocket gets lighter → same thrust → more acceleration!
 * Real Tsiolkovsky rocket equation: Δv = v_e × ln(m₀/m_f)
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_variable_mass_rocket() {
  const [thrust, setThrust] = useState(5000); // N
  const [burnRate, setBurnRate] = useState(10); // kg/s
  const [running, setRunning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ mass: 500, v: 0, altitude: 0, t: 0, fuelMass: 400 });
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);
  const [display, setDisplay] = useState({ mass: 500, v: 0, altitude: 0, accel: 0 });

  const g = 9.8;

  const step = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    const s = stateRef.current;

    if (s.fuelMass <= 0) { setRunning(false); return; }

    // Burn fuel
    const massLost = Math.min(burnRate * dt, s.fuelMass);
    s.fuelMass -= massLost;
    s.mass -= massLost;

    // F = ma → a = (Thrust - Weight) / mass
    const weight = s.mass * g;
    const netForce = thrust - weight;
    const accel = netForce / s.mass;

    s.v += accel * dt;
    s.altitude += Math.max(0, s.v) * dt;
    s.t += dt;

    setDisplay({ mass: s.mass, v: s.v, altitude: s.altitude, accel });
    animRef.current = requestAnimationFrame(step);
  }, [thrust, burnRate, g]);

  useEffect(() => {
    if (running) { lastRef.current = 0; animRef.current = requestAnimationFrame(step); }
    else cancelAnimationFrame(animRef.current);
    return () => cancelAnimationFrame(animRef.current);
  }, [running, step]);

  const reset = () => {
    setRunning(false);
    stateRef.current = { mass: 500, v: 0, altitude: 0, t: 0, fuelMass: 400 };
    setDisplay({ mass: 500, v: 0, altitude: 0, accel: 0 });
  };

  const canLaunch = thrust > 500 * g; // must exceed initial weight
  const fuelPct = (stateRef.current.fuelMass / 400) * 100;

  return (
    <SimCard title="🚀 Variable Mass Rocket — F = ma as Mass Decreases" desc="As fuel burns, mass decreases. With constant thrust, acceleration INCREASES because a = F/m and m is falling. Watch the rocket speed up even though thrust stays the same!">
      <div style={{ background: "#020617", borderRadius: 12, padding: 20, minHeight: 300, position: "relative", overflow: "hidden" }}>
        {/* Stars */}
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", width: 2, height: 2, borderRadius: "50%", background: "#fff", opacity: 0.4 + (i % 3) * 0.2, left: `${(i * 137.5) % 100}%`, top: `${(i * 97.3) % 100}%` }} />
        ))}

        {/* Altitude bar */}
        <div style={{ position: "absolute", right: 16, top: 12, bottom: 12, width: 20, background: "#1e293b", borderRadius: 10 }}>
          <div style={{ position: "absolute", bottom: 0, width: "100%", height: `${Math.min((display.altitude / 5000) * 100, 100)}%`, background: "linear-gradient(0deg, #10b981, #6366f1)", borderRadius: 10, transition: "height 0.2s" }} />
          <div style={{ position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)", color: "#10b981", fontSize: 9, fontWeight: 700, whiteSpace: "nowrap" }}>{display.altitude.toFixed(0)}m</div>
        </div>

        {/* Rocket */}
        <div style={{ position: "absolute", left: "40%", bottom: `${Math.min((display.altitude / 5000) * 80, 80)}%`, transform: "translateX(-50%)", transition: "bottom 0.1s", textAlign: "center" }}>
          {/* Rocket body */}
          <div style={{ fontSize: 48, lineHeight: 1 }}>🚀</div>

          {/* Exhaust plume */}
          {running && (
            <div style={{ marginTop: -4 }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{
                  width: 10 + i * 5, height: 8 + i * 6, margin: "0 auto",
                  background: `radial-gradient(circle, ${i === 0 ? "#fff" : i === 1 ? "#f59e0b" : "#ef4444"}, transparent)`,
                  borderRadius: "50% 50% 60% 60%",
                  opacity: 0.8 - i * 0.2,
                }} />
              ))}
            </div>
          )}

          {/* Telemetry bubble */}
          <div style={{ background: "#0f172a90", padding: "4px 10px", borderRadius: 8, border: "1px solid #1e293b", marginTop: 4 }}>
            <div style={{ color: "#10b981", fontSize: 11, fontFamily: "JetBrains Mono", fontWeight: 700 }}>v = {display.v.toFixed(1)} m/s</div>
            <div style={{ color: "#f59e0b", fontSize: 10, fontFamily: "JetBrains Mono" }}>a = {display.accel.toFixed(2)} m/s²</div>
          </div>
        </div>

        {/* Fuel gauge */}
        <div style={{ position: "absolute", left: 16, bottom: 12, width: 100 }}>
          <div style={{ fontSize: 10, color: "#f59e0b", fontWeight: 700, marginBottom: 4 }}>FUEL: {fuelPct.toFixed(0)}%</div>
          <div style={{ height: 8, background: "#1e293b", borderRadius: 4 }}>
            <div style={{ height: "100%", width: `${fuelPct}%`, background: `linear-gradient(90deg, #ef4444, #f59e0b)`, borderRadius: 4, transition: "width 0.2s" }} />
          </div>
          <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>Mass: {display.mass.toFixed(0)} kg</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16, background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #1e293b" }}>
        <div>
          <div style={{ fontSize: 12, color: "#f59e0b", fontWeight: 700, marginBottom: 4 }}>Thrust: {(thrust / 1000).toFixed(1)} kN</div>
          <input type="range" min={1000} max={15000} step={500} value={thrust} onChange={e => { setThrust(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#f59e0b" }} />
          {!canLaunch && <div style={{ fontSize: 10, color: "#ef4444", marginTop: 2 }}>⚠ Must exceed weight: {(500 * g / 1000).toFixed(1)} kN</div>}
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#ef4444", fontWeight: 700, marginBottom: 4 }}>Burn Rate: {burnRate} kg/s</div>
          <input type="range" min={1} max={50} value={burnRate} onChange={e => { setBurnRate(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#ef4444" }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 12, justifyContent: "center" }}>
        <button onClick={() => { reset(); setTimeout(() => setRunning(true), 50); }} disabled={!canLaunch} style={{ padding: "10px 24px", borderRadius: 10, fontWeight: 700, border: "none", cursor: canLaunch ? "pointer" : "not-allowed", background: canLaunch ? "#10b981" : "#374151", color: "#0f172a", opacity: canLaunch ? 1 : 0.5 }}>🚀 LAUNCH!</button>
        <button onClick={() => setRunning(!running)} style={{ padding: "10px 24px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", background: "#1e293b", color: "#cbd5e1" }}>{running ? "PAUSE" : "RESUME"}</button>
        <button onClick={reset} style={{ padding: "10px 24px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", background: "#334155", color: "#cbd5e1" }}>RESET</button>
      </div>
      <TPanel items={[
        { label: "Thrust", value: `${(thrust / 1000).toFixed(1)} kN`, color: "#f59e0b" },
        { label: "Current Mass", value: `${display.mass.toFixed(0)} kg`, color: "#6366f1" },
        { label: "Acceleration", value: `${display.accel.toFixed(2)} m/s²`, color: display.accel > 0 ? "#10b981" : "#ef4444" },
        { label: "Speed", value: `${display.v.toFixed(1)} m/s`, color: "#3b82f6" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 4. SPORTS IMPACT COMPARE — Different forces for same effect
 * Compares F = ma across different sports: cricket, football, tennis
 * Shows how mass and velocity determine impact force
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_sports_fma() {
  const [selected, setSelected] = useState(0);
  const [showCalc, setShowCalc] = useState(false);
  const sports = [
    { name: "Cricket Ball", emoji: "🏏", mass: 0.156, launchV: 40, contactTime: 0.003, color: "#ef4444" },
    { name: "Football", emoji: "⚽", mass: 0.43, launchV: 30, contactTime: 0.008, color: "#10b981" },
    { name: "Tennis Ball", emoji: "🎾", mass: 0.057, launchV: 60, contactTime: 0.004, color: "#f59e0b" },
    { name: "Badminton", emoji: "🏸", mass: 0.005, launchV: 90, contactTime: 0.001, color: "#6366f1" },
    { name: "Golf Ball", emoji: "⛳", mass: 0.045, launchV: 70, contactTime: 0.0005, color: "#3b82f6" },
  ];

  const [anim, setAnim] = useState(0);
  useEffect(() => { const id = setInterval(() => setAnim(a => a + 1), 16); return () => clearInterval(id); }, []);

  return (
    <SimCard title="🏆 Sports Impact — F = ma in Action" desc="Different sports balls have wildly different masses and speeds. Impact force = m × a = m × Δv/Δt (impulse equation). Small contact time → huge force! See how Newton's 2nd Law explains sports physics.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
        {sports.map((s, i) => {
          const momentum = s.mass * s.launchV;
          const avgForce = momentum / s.contactTime;
          const isSelected = selected === i;
          return (
            <button key={i} onClick={() => { setSelected(i); setShowCalc(false); }} style={{
              background: isSelected ? `${s.color}20` : "#0f172a",
              border: `2px solid ${isSelected ? s.color : "#1e293b"}`,
              borderRadius: 12, padding: "12px 6px", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              transition: "all 0.2s",
            }}>
              <span style={{ fontSize: 28 }}>{s.emoji}</span>
              <span style={{ color: isSelected ? s.color : "#94a3b8", fontSize: 11, fontWeight: 700 }}>{s.name}</span>
              <span style={{ color: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono" }}>{s.mass * 1000}g</span>
              <span style={{ color: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono" }}>{s.launchV}m/s</span>
            </button>
          );
        })}
      </div>

      {/* Selected sport breakdown */}
      {(() => {
        const s = sports[selected];
        const momentum = s.mass * s.launchV;
        const avgForce = momentum / s.contactTime;
        const accel = s.launchV / s.contactTime;
        return (
          <div style={{ marginTop: 16, background: `${s.color}10`, borderRadius: 12, padding: 16, border: `1px solid ${s.color}30` }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{s.emoji}</div>
            <div style={{ color: s.color, fontWeight: 800, fontSize: 16, marginBottom: 8 }}>{s.name} — Physics Breakdown</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13, color: "#94a3b8" }}>
              <div>Mass: <span style={{ color: "#f1f5f9", fontWeight: 700 }}>{s.mass * 1000}g = {s.mass}kg</span></div>
              <div>Launch Speed: <span style={{ color: "#f1f5f9", fontWeight: 700 }}>{s.launchV} m/s</span></div>
              <div>Contact Time: <span style={{ color: "#f1f5f9", fontWeight: 700 }}>{(s.contactTime * 1000).toFixed(1)} ms</span></div>
              <div>Momentum: <span style={{ color: "#f1f5f9", fontWeight: 700 }}>{momentum.toFixed(3)} kg⋅m/s</span></div>
            </div>
            <div style={{ marginTop: 10, background: "#0f172a", borderRadius: 8, padding: 10, fontFamily: "JetBrains Mono", fontSize: 12, color: "#a5b4fc" }}>
              F = Δp/Δt = {momentum.toFixed(3)} / {s.contactTime} = <span style={{ color: s.color, fontWeight: 700 }}>{(avgForce).toFixed(0)} N = {(avgForce / 9.8 / s.mass).toFixed(0)}× ball weight!</span>
            </div>
          </div>
        );
      })()}

      <TPanel items={sports.map(s => ({
        label: s.name,
        value: `${((s.mass * s.launchV / s.contactTime) / 1000).toFixed(1)} kN`,
        color: s.color,
      }))} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 5. MASS ON SPRING — Hooke's Law + Newton's 2nd Law
 * Spring force = -kx. Newton's 2nd: ma = -kx → SHM!
 * Shows how F=ma governs oscillatory motion.
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_spring_mass_oscillator() {
  const [springK, setSpringK] = useState(20);
  const [mass, setMass] = useState(2);
  const [amplitude, setAmplitude] = useState(80);
  const [damping, setDamping] = useState(0.1);
  const [running, setRunning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ x: 0, v: 0, t: 0 });
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);
  const [display, setDisplay] = useState({ x: 0, v: 0, F: 0 });

  const omega = Math.sqrt(springK / mass); // natural frequency
  const period = 2 * Math.PI / omega;

  const step = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    const s = stateRef.current;

    const F_spring = -springK * s.x;
    const F_damp = -damping * s.v;
    const a = (F_spring + F_damp) / mass;
    s.v += a * dt;
    s.x += s.v * dt;
    s.t += dt;

    setDisplay({ x: s.x, v: s.v, F: F_spring });
    animRef.current = requestAnimationFrame(step);
  }, [springK, mass, damping]);

  useEffect(() => {
    if (running) { lastRef.current = 0; animRef.current = requestAnimationFrame(step); }
    else cancelAnimationFrame(animRef.current);
    return () => cancelAnimationFrame(animRef.current);
  }, [running, step]);

  const launch = () => {
    stateRef.current = { x: amplitude, v: 0, t: 0 };
    setRunning(true);
  };
  const reset = () => { setRunning(false); stateRef.current = { x: 0, v: 0, t: 0 }; setDisplay({ x: 0, v: 0, F: 0 }); };

  const W = 600, H = 250;
  const cx = W / 2, equilibriumY = 80;
  const massX = cx + display.x;

  return (
    <SimCard title="🌀 Spring-Mass — F = ma Gives Oscillation!" desc="Spring force = -kx (Hooke's Law). Newton's 2nd: ma = -kx → the solution is SHM: x(t) = A·cos(ωt) where ω = √(k/m). Larger k = stiffer spring = faster oscillation. Larger m = slower.">
      <div style={{ background: "#020617", borderRadius: 12, overflow: "hidden" }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          {/* Ceiling */}
          <rect x="0" y="10" width={W} height="10" fill="#1e293b" />

          {/* Spring (coil visualization) */}
          {Array.from({ length: 14 }).map((_, i) => {
            const segLen = (massX - 80) / 14;
            const x1 = 80 + i * segLen;
            const x2 = 80 + (i + 1) * segLen;
            const yOff = i % 2 === 0 ? -10 : 10;
            return <line key={i} x1={x1} y1={equilibriumY + yOff} x2={x2} y2={equilibriumY - yOff} stroke="#f59e0b" strokeWidth="2" />;
          })}

          {/* Wall anchor */}
          <rect x="64" y={equilibriumY - 20} width="16" height="40" rx="4" fill="#475569" />

          {/* Equilibrium marker */}
          <line x1={cx} y1={equilibriumY - 40} x2={cx} y2={equilibriumY + 40} stroke="#1e3a5f" strokeWidth="1.5" strokeDasharray="4,4" />
          <text x={cx} y={equilibriumY + 55} textAnchor="middle" fill="#334155" fontSize="11" fontFamily="Inter">equilibrium</text>

          {/* Mass block */}
          <rect x={massX - 28} y={equilibriumY - 28} width="56" height="56" rx="8" fill="url(#massGrad)" stroke="#a5b4fc" strokeWidth="2" />
          <defs>
            <linearGradient id="massGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
          <text x={massX} y={equilibriumY + 5} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700" fontFamily="JetBrains Mono">{mass}kg</text>

          {/* Spring force arrow */}
          {Math.abs(display.F) > 1 && (
            <line
              x1={massX + (display.F > 0 ? 28 : -28)}
              y1={equilibriumY}
              x2={massX + (display.F > 0 ? 28 : -28) + Math.max(-80, Math.min(80, display.F * 1.5))}
              y2={equilibriumY}
              stroke="#ef4444" strokeWidth="2.5"
            />
          )}

          {/* Velocity label */}
          <text x={massX} y={equilibriumY - 40} textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="700" fontFamily="JetBrains Mono">
            v={display.v.toFixed(1)}m/s
          </text>
          <text x={massX} y={equilibriumY - 52} textAnchor="middle" fill="#ef4444" fontSize="11" fontFamily="JetBrains Mono">
            F={display.F.toFixed(1)}N
          </text>

          {/* Displacement marker */}
          <line x1={cx} y1={equilibriumY + 35} x2={massX} y2={equilibriumY + 35} stroke="#94a3b8" strokeWidth="1.5" />
          <text x={(cx + massX) / 2} y={equilibriumY + 50} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono">
            x={display.x.toFixed(1)}px
          </text>

          {/* Frequency display */}
          <text x={W / 2} y={H - 15} textAnchor="middle" fill="#64748b" fontSize="12" fontFamily="JetBrains Mono">
            ω = √(k/m) = √({springK}/{mass}) = {omega.toFixed(2)} rad/s | T = {period.toFixed(2)}s
          </text>
        </svg>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginTop: 14, background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #1e293b" }}>
        {[
          { label: `k: ${springK} N/m`, min: 1, max: 100, value: springK, set: setSpringK, color: "#f59e0b" },
          { label: `m: ${mass} kg`, min: 0.1, max: 20, step: 0.1, value: mass, set: setMass, color: "#6366f1" },
          { label: `A: ${amplitude}`, min: 20, max: 130, value: amplitude, set: setAmplitude, color: "#10b981" },
          { label: `Damp: ${damping}`, min: 0, max: 2, step: 0.05, value: damping, set: setDamping, color: "#94a3b8" },
        ].map(({ label, min, max, step = 1, value, set, color }) => (
          <div key={label}>
            <div style={{ fontSize: 11, color, fontWeight: 700, marginBottom: 4 }}>{label}</div>
            <input type="range" min={min} max={max} step={step} value={value} onChange={e => { set(+e.target.value as never); reset(); }} style={{ width: "100%", accentColor: color }} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 12, justifyContent: "center" }}>
        <button onClick={launch} style={{ padding: "10px 24px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", background: "#10b981", color: "#0f172a" }}>RELEASE!</button>
        <button onClick={() => setRunning(!running)} style={{ padding: "10px 24px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", background: "#1e293b", color: "#cbd5e1" }}>{running ? "PAUSE" : "RESUME"}</button>
        <button onClick={reset} style={{ padding: "10px 24px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", background: "#334155", color: "#cbd5e1" }}>RESET</button>
      </div>
      <TPanel items={[
        { label: "Spring Force", value: `${Math.abs(display.F).toFixed(1)} N`, color: "#ef4444" },
        { label: "Displacement", value: `${display.x.toFixed(1)} units`, color: "#6366f1" },
        { label: "Frequency", value: `${(omega / (2 * Math.PI)).toFixed(2)} Hz`, color: "#f59e0b" },
        { label: "Period", value: `${period.toFixed(2)} s`, color: "#10b981" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 6. BRAKING DISTANCE CALCULATOR — F = ma applied to safety
 * Braking distance = v² / (2μg). Shows how speed affects stopping distance.
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_braking_calc() {
  const [speed, setSpeed] = useState(60); // km/h
  const [mass, setMass] = useState(1200); // kg
  const [mu, setMu] = useState(0.7); // friction coefficient
  const g = 9.8;
  const v = speed / 3.6; // m/s
  const deccel = mu * g; // deceleration = friction force / mass = mu*m*g / m = mu*g
  const stoppingDist = v * v / (2 * deccel);
  const brakeForce = mass * deccel;
  const stoppingTime = v / deccel;

  // Reference: walking speed stopping distance
  const walkingDist = (5 / 3.6) ** 2 / (2 * deccel);

  const surfaceColors: Record<string, string> = {};

  return (
    <SimCard title="🛑 Braking Distance — F = ma in Road Safety" desc="F = ma → deceleration = F/m = μmg/m = μg (independent of mass!). But stopping distance = v²/2μg — it grows with the SQUARE of speed! Doubling speed means 4× stopping distance!">
      <div style={{ background: "#020617", borderRadius: 12, padding: 20, position: "relative", overflow: "hidden", minHeight: 200 }}>
        {/* Road */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 50, background: "#1e293b", borderRadius: "0 0 12px 12px" }}>
          <div style={{ position: "absolute", top: 20, left: 0, right: 0, height: 3, background: "#f59e0b40" }} />
        </div>

        {/* Car */}
        <div style={{ position: "absolute", left: 20, bottom: 50, fontSize: 36 }}>🚗</div>

        {/* Stopping distance bar */}
        <div style={{ position: "absolute", left: 80, bottom: 55, height: 24, background: "#ef444430", borderRadius: 4, transition: "width 0.3s", border: "1px solid #ef444460", width: Math.min(stoppingDist * 3, 500) }}>
          <div style={{ position: "absolute", top: "50%", left: 8, transform: "translateY(-50%)", color: "#ef4444", fontSize: 11, fontWeight: 700, fontFamily: "JetBrains Mono", whiteSpace: "nowrap" }}>
            Stopping: {stoppingDist.toFixed(1)}m
          </div>
        </div>

        {/* Comparison bars */}
        {[30, 60, 100, 120].map(spd => {
          const d = (spd / 3.6) ** 2 / (2 * deccel);
          const isActive = Math.abs(spd - speed) < 5;
          return (
            <div key={spd} style={{ position: "absolute", left: 80, bottom: 85 + (120 - spd) / 30 * 28, height: 18, width: Math.min(d * 3, 500), background: isActive ? "#ef444430" : "#33415560", borderRadius: 3, border: `1px solid ${isActive ? "#ef4444" : "#334155"}40` }}>
              <span style={{ position: "absolute", left: 4, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: isActive ? "#ef4444" : "#64748b", fontFamily: "JetBrains Mono", whiteSpace: "nowrap" }}>{spd}km/h → {d.toFixed(0)}m</span>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 16, background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #1e293b" }}>
        <div>
          <div style={{ fontSize: 12, color: "#ef4444", fontWeight: 700, marginBottom: 4 }}>Speed: {speed} km/h</div>
          <input type="range" min={10} max={140} value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: "100%", accentColor: "#ef4444" }} />
          <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>2× speed = 4× stopping distance!</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#6366f1", fontWeight: 700, marginBottom: 4 }}>Mass: {mass} kg</div>
          <input type="range" min={500} max={5000} step={100} value={mass} onChange={e => setMass(+e.target.value)} style={{ width: "100%", accentColor: "#6366f1" }} />
          <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>Mass doesn't affect stopping distance!</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#f59e0b", fontWeight: 700, marginBottom: 4 }}>Road μ: {mu}</div>
          <input type="range" min={0.1} max={1.2} step={0.05} value={mu} onChange={e => setMu(+e.target.value)} style={{ width: "100%", accentColor: "#f59e0b" }} />
          <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>Wet road=0.4, Dry=0.7, Racing=1.1</div>
        </div>
      </div>
      <TPanel items={[
        { label: "Deceleration", value: `${deccel.toFixed(2)} m/s²`, color: "#ef4444" },
        { label: "Braking Force", value: `${(brakeForce / 1000).toFixed(1)} kN`, color: "#f59e0b" },
        { label: "Stopping Dist", value: `${stoppingDist.toFixed(1)} m`, color: "#10b981" },
        { label: "Stopping Time", value: `${stoppingTime.toFixed(2)} s`, color: "#6366f1" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 7. COMPARATIVE F=ma — Three objects, same force, different masses
 * Visual race showing: same F, m₁ < m₂ < m₃ → a₁ > a₂ > a₃
 * Proves F = ma by showing inverse relationship of mass and acceleration
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_fma_race() {
  const [force, setForce] = useState(100);
  const [running, setRunning] = useState(false);
  const stateRef = useRef([{ x: 40 }, { x: 40 }, { x: 40 }]);
  const velRef = useRef([0, 0, 0]);
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);
  const [positions, setPositions] = useState([40, 40, 40]);

  const masses = [5, 15, 40];
  const colors = ["#ef4444", "#f59e0b", "#3b82f6"];
  const labels = ["Light\n5 kg", "Medium\n15 kg", "Heavy\n40 kg"];
  const accels = masses.map(m => force / m);

  const step = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;

    masses.forEach((m, i) => {
      if (stateRef.current[i].x < 520) {
        velRef.current[i] += accels[i] * dt * 0.5;
        stateRef.current[i].x += velRef.current[i] * dt;
      }
    });

    setPositions([...stateRef.current.map(s => s.x)]);

    if (stateRef.current.some(s => s.x < 520)) animRef.current = requestAnimationFrame(step);
    else setRunning(false);
  }, [accels, masses]);

  useEffect(() => {
    if (running) { lastRef.current = 0; animRef.current = requestAnimationFrame(step); }
    else cancelAnimationFrame(animRef.current);
    return () => cancelAnimationFrame(animRef.current);
  }, [running, step]);

  const reset = () => {
    setRunning(false);
    stateRef.current = [{ x: 40 }, { x: 40 }, { x: 40 }];
    velRef.current = [0, 0, 0];
    setPositions([40, 40, 40]);
  };

  return (
    <SimCard title="🏁 F = ma Race — Same Force, Different Masses" desc="Three objects receive identical force but have different masses. The lightest accelerates most. Watch them race to see a = F/m in action! The gap between them grows over time (acceleration, not constant speed).">
      <div style={{ background: "#020617", borderRadius: 12, padding: 20, minHeight: 250 }}>
        {/* Finish line */}
        <div style={{ position: "relative" }}>
          {masses.map((m, i) => {
            const accel = force / m;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: 16, position: "relative", height: 52 }}>
                {/* Lane */}
                <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "#1e293b", top: "50%" }} />
                {/* Finish */}
                <div style={{ position: "absolute", right: 0, height: "100%", width: 3, background: "#f59e0b" }} />

                {/* Object */}
                <div style={{
                  position: "absolute", left: positions[i] - 10, top: "50%", transform: "translateY(-50%)",
                  width: 20 + m * 0.8, height: 20 + m * 0.8, borderRadius: 4,
                  background: `linear-gradient(135deg, ${colors[i]}, ${colors[i]}88)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "none", boxShadow: `0 0 12px ${colors[i]}40`,
                }}>
                  <span style={{ color: "#fff", fontSize: 9, fontWeight: 700 }}>{m}kg</span>
                </div>

                {/* Info on right */}
                <div style={{ position: "absolute", right: 20, top: 0, color: colors[i], fontSize: 11, fontWeight: 700, fontFamily: "JetBrains Mono" }}>
                  a = {force}/{m} = {accel.toFixed(1)} m/s²
                </div>
              </div>
            );
          })}
        </div>

        {/* Force label */}
        <div style={{ textAlign: "center", marginTop: 8 }}>
          <span style={{ color: "#10b981", fontWeight: 700, fontSize: 13, fontFamily: "JetBrains Mono" }}>Applied Force: {force} N (same for all!)</span>
        </div>
      </div>

      <div style={{ marginTop: 14, background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #1e293b" }}>
        <div style={{ fontSize: 12, color: "#10b981", fontWeight: 700, marginBottom: 4 }}>Force: {force} N (applied equally to all)</div>
        <input type="range" min={10} max={300} value={force} onChange={e => { setForce(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#10b981" }} />
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 12, justifyContent: "center" }}>
        <button onClick={() => { reset(); setTimeout(() => setRunning(true), 50); }} style={{ padding: "10px 24px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", background: "#10b981", color: "#0f172a" }}>🏁 START RACE!</button>
        <button onClick={reset} style={{ padding: "10px 24px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", background: "#1e293b", color: "#cbd5e1" }}>RESET</button>
      </div>
      <TPanel items={masses.map((m, i) => ({ label: `${m}kg Block`, value: `${(force / m).toFixed(1)} m/s²`, color: colors[i] }))} />
    </SimCard>
  );
}
