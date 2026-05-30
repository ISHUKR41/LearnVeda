/**
 * FILE: Topic1Extra.tsx
 * PURPOSE: 8 ultra-professional simulations for Topic 1 — Balanced & Unbalanced Forces
 * These go beyond the ForceEngine and render full physics with Canvas 2D / SVG / DOM animations.
 * Each simulation teaches a distinct real-world concept with deep physics logic.
 */
"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

/* ── Shared UI helpers (self-contained, no external deps) ──────── */
function SimCard({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div style={{ width: "100%", background: "#0b1120", borderRadius: 18, padding: 28, margin: "32px 0", border: "1px solid #1e293b", boxShadow: "0 12px 40px rgba(0,0,0,0.5)", fontFamily: "Inter, system-ui, sans-serif", overflow: "hidden" }}>
      <div style={{ borderBottom: "1px solid #1e293b", paddingBottom: 16, marginBottom: 24 }}>
        <h3 style={{ color: "#f1f5f9", fontSize: 21, fontWeight: 800, margin: 0, letterSpacing: -0.3 }}>{title}</h3>
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
function Btn({ onClick, label, color = "#10b981" }: { onClick: () => void; label: string; color?: string }) {
  return <button onClick={onClick} style={{ padding: "10px 22px", borderRadius: 10, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", background: color, color: color === "#1e293b" ? "#cbd5e1" : "#0f172a", transition: "all .15s" }}>{label}</button>;
}

/* ══════════════════════════════════════════════════════════════════
 * 1. INCLINED PLANE — Force Decomposition
 * A block rests on a slope. Gravity decomposes into parallel (along slope)
 * and perpendicular (into slope) components. Friction can prevent sliding.
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_inclined_plane() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(30);
  const [mass, setMass] = useState(5);
  const [mu, setMu] = useState(0.4);
  const animRef = useRef<number>(0);

  const g = 9.8;
  const theta = angle * Math.PI / 180;
  const weight = mass * g;
  const Wpar = weight * Math.sin(theta);   // component along slope
  const Wperp = weight * Math.cos(theta);  // component into slope
  const maxFriction = mu * Wperp;
  const netForce = Wpar - maxFriction;
  const isSliding = netForce > 0;
  const accel = isSliding ? netForce / mass : 0;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, W, H);

    // Draw inclined plane as a triangle
    const baseX = 40, baseY = H - 40;
    const tipX = baseX + (H - 80) / Math.tan(theta);
    const topX = tipX;
    const topY = baseY - (tipX - baseX) * Math.tan(theta);

    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.lineTo(tipX, baseY);
    ctx.lineTo(topX, topY);
    ctx.closePath();
    ctx.fillStyle = "#1e3a5f";
    ctx.fill();
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Angle arc
    ctx.beginPath();
    ctx.arc(tipX, baseY, 40, Math.PI, Math.PI + theta);
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 13px JetBrains Mono";
    ctx.fillText(`${angle}°`, tipX - 55, baseY - 12);

    // Block position (midway on slope)
    const t = 0.5;
    const bx = tipX + (baseX - tipX) * t + Math.sin(theta) * 22;
    const by = baseY + (topY - baseY) * t - Math.cos(theta) * 22;

    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(-theta);
    const grad = ctx.createLinearGradient(-22, -22, 22, 22);
    grad.addColorStop(0, "#6366f1");
    grad.addColorStop(1, "#8b5cf6");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(-22, -22, 44, 44, 6);
    ctx.fill();
    ctx.strokeStyle = "#a5b4fc";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 11px Inter";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${mass}kg`, 0, 0);
    ctx.restore();

    // Draw force vectors
    const arrowScale = 2.5;
    // Weight (straight down)
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx, by + weight * arrowScale);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.moveTo(bx, by + weight * arrowScale);
    ctx.lineTo(bx - 6, by + weight * arrowScale - 12);
    ctx.lineTo(bx + 6, by + weight * arrowScale - 12);
    ctx.fill();
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 12px JetBrains Mono";
    ctx.textAlign = "left";
    ctx.fillText(`W=${weight.toFixed(0)}N`, bx + 8, by + weight * arrowScale / 2);

    // W-parallel (along slope, downward)
    const pLen = Wpar * arrowScale;
    const pEndX = bx - pLen * Math.cos(theta);
    const pEndY = by + pLen * Math.sin(theta);
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(pEndX, pEndY);
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 11px JetBrains Mono";
    ctx.textAlign = "center";
    ctx.fillText(`W∥=${Wpar.toFixed(1)}N`, pEndX - 20, pEndY + 16);

    // Normal force (perpendicular to slope, outward)
    const nLen = Wperp * arrowScale;
    const nEndX = bx - nLen * Math.sin(theta);
    const nEndY = by - nLen * Math.cos(theta);
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(nEndX, nEndY);
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 11px JetBrains Mono";
    ctx.textAlign = "center";
    ctx.fillText(`N=${Wperp.toFixed(1)}N`, nEndX - 20, nEndY - 8);

    // Friction (up the slope if sliding, resisting motion)
    if (!isSliding) {
      const fLen = Wpar * arrowScale;
      const fEndX = bx + fLen * Math.cos(theta);
      const fEndY = by - fLen * Math.sin(theta);
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(fEndX, fEndY);
      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#06b6d4";
      ctx.font = "bold 11px JetBrains Mono";
      ctx.fillText(`f=${Wpar.toFixed(1)}N`, fEndX + 4, fEndY - 6);
    }

    // Status badge
    ctx.fillStyle = isSliding ? "#ef444420" : "#10b98120";
    ctx.beginPath();
    ctx.roundRect(W / 2 - 80, 12, 160, 32, 8);
    ctx.fill();
    ctx.fillStyle = isSliding ? "#ef4444" : "#10b981";
    ctx.font = "bold 13px Inter";
    ctx.textAlign = "center";
    ctx.fillText(isSliding ? "⚠ BLOCK SLIDING!" : "✓ BLOCK STATIONARY", W / 2, 33);

    animRef.current = requestAnimationFrame(draw);
  }, [angle, mass, mu, theta, weight, Wpar, Wperp, maxFriction, isSliding]);

  useEffect(() => { animRef.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(animRef.current); }, [draw]);

  return (
    <SimCard title="⛰️ Inclined Plane — Force Decomposition" desc="Gravity splits into two components on a slope: parallel (causes sliding) and perpendicular (causes normal force). Friction fights the parallel component.">
      <canvas ref={canvasRef} width={600} height={320} style={{ width: "100%", borderRadius: 12 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 18, background: "#0f172a", padding: 16, borderRadius: 12, border: "1px solid #1e293b" }}>
        {[
          { label: `Angle: ${angle}°`, min: 5, max: 75, value: angle, set: setAngle, color: "#f59e0b" },
          { label: `Mass: ${mass} kg`, min: 1, max: 20, value: mass, set: setMass, color: "#8b5cf6" },
          { label: `μ (friction): ${mu}`, min: 0, max: 0.9, step: 0.05, value: mu, set: setMu, color: "#06b6d4" },
        ].map(({ label, min, max, step = 1, value, set, color }) => (
          <div key={label}>
            <div style={{ fontSize: 12, color, fontWeight: 700, marginBottom: 4 }}>{label}</div>
            <input type="range" min={min} max={max} step={step} value={value} onChange={e => set(+e.target.value as never)} style={{ width: "100%", accentColor: color }} />
          </div>
        ))}
      </div>
      <TPanel items={[
        { label: "W-parallel", value: `${Wpar.toFixed(1)} N`, color: "#f59e0b" },
        { label: "Normal Force", value: `${Wperp.toFixed(1)} N`, color: "#10b981" },
        { label: "Max Friction", value: `${maxFriction.toFixed(1)} N`, color: "#06b6d4" },
        { label: "Acceleration", value: isSliding ? `${accel.toFixed(2)} m/s²` : "0 m/s²", color: isSliding ? "#ef4444" : "#10b981" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 2. ATWOOD MACHINE — Two masses over pulley
 * Two masses hang from a frictionless pulley. Net force = difference in weights.
 * Classic demonstration of Newton's Laws + balanced vs unbalanced forces.
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_atwood_machine() {
  const [m1, setM1] = useState(4);
  const [m2, setM2] = useState(6);
  const [running, setRunning] = useState(false);
  const stateRef = useRef({ y1: 0, y2: 0, v: 0 });
  const [display, setDisplay] = useState({ y1: 0, y2: 0, v: 0 });
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);
  const g = 9.8;
  const totalMass = m1 + m2;
  const netForce = (m2 - m1) * g;
  const accel = netForce / totalMass;
  const tension = m1 * (g + accel);

  const step = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    const s = stateRef.current;
    s.v += accel * dt;
    s.y1 += s.v * dt * 30;
    s.y2 -= s.v * dt * 30;
    // Clamp
    if (s.y1 > 120) { s.y1 = 120; s.y2 = -120; s.v = 0; }
    if (s.y2 > 120) { s.y2 = 120; s.y1 = -120; s.v = 0; }
    setDisplay({ y1: s.y1, y2: s.y2, v: s.v });
    animRef.current = requestAnimationFrame(step);
  }, [accel]);

  useEffect(() => {
    if (running) { lastRef.current = 0; animRef.current = requestAnimationFrame(step); }
    else cancelAnimationFrame(animRef.current);
    return () => cancelAnimationFrame(animRef.current);
  }, [running, step]);

  const reset = () => { setRunning(false); stateRef.current = { y1: 0, y2: 0, v: 0 }; setDisplay({ y1: 0, y2: 0, v: 0 }); };

  return (
    <SimCard title="⚙️ Atwood Machine — Pulley & Net Force" desc="Two masses hang over a pulley. If equal, forces are balanced — no motion. Heavier side falls, lighter rises. Net Force = (m₂−m₁)g. Acceleration = Net Force / Total Mass.">
      <div style={{ background: "#020617", borderRadius: 12, padding: 20, minHeight: 350, position: "relative", display: "flex", justifyContent: "center" }}>
        <svg width="300" height="320" viewBox="0 0 300 320">
          {/* Ceiling */}
          <rect x="80" y="10" width="140" height="8" rx="3" fill="#475569" />
          {/* Pulley */}
          <circle cx="150" cy="40" r="22" fill="none" stroke="#94a3b8" strokeWidth="4" />
          <circle cx="150" cy="40" r="8" fill="#64748b" />
          {/* Strings */}
          <line x1="132" y1="40" x2="100" y2={100 + display.y1} stroke="#94a3b8" strokeWidth="2" />
          <line x1="168" y1="40" x2="200" y2={100 + display.y2} stroke="#94a3b8" strokeWidth="2" />
          {/* Mass 1 */}
          <rect x="72" y={100 + display.y1} width="56" height="56" rx="8" fill={m1 >= m2 ? "#6366f1" : "#334155"} stroke="#818cf8" strokeWidth="2" />
          <text x="100" y={132 + display.y1} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700" fontFamily="JetBrains Mono">{m1} kg</text>
          {/* Weight label 1 */}
          <text x="60" y={165 + display.y1} textAnchor="middle" fill="#ef4444" fontSize="11" fontFamily="JetBrains Mono">{(m1 * g).toFixed(0)}N↓</text>
          {/* Mass 2 */}
          <rect x="172" y={100 + display.y2} width="56" height="56" rx="8" fill={m2 >= m1 ? "#6366f1" : "#334155"} stroke="#818cf8" strokeWidth="2" />
          <text x="200" y={132 + display.y2} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700" fontFamily="JetBrains Mono">{m2} kg</text>
          <text x="210" y={165 + display.y2} textAnchor="start" fill="#ef4444" fontSize="11" fontFamily="JetBrains Mono">{(m2 * g).toFixed(0)}N↓</text>
          {/* Acceleration arrow */}
          {running && Math.abs(display.v) > 0.1 && (
            <text x="150" y="280" textAnchor="middle" fill="#10b981" fontSize="13" fontWeight="700" fontFamily="JetBrains Mono">a = {Math.abs(accel).toFixed(2)} m/s²</text>
          )}
        </svg>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16, background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #1e293b" }}>
        <div>
          <div style={{ color: "#6366f1", fontWeight: 700, fontSize: 12, marginBottom: 4 }}>Mass 1: {m1} kg</div>
          <input type="range" min={1} max={15} value={m1} onChange={e => { setM1(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#6366f1" }} />
        </div>
        <div>
          <div style={{ color: "#a78bfa", fontWeight: 700, fontSize: 12, marginBottom: 4 }}>Mass 2: {m2} kg</div>
          <input type="range" min={1} max={15} value={m2} onChange={e => { setM2(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#a78bfa" }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
        <Btn onClick={() => setRunning(!running)} label={running ? "PAUSE" : "RELEASE"} color={running ? "#ef4444" : "#10b981"} />
        <Btn onClick={reset} label="RESET" color="#1e293b" />
      </div>
      <TPanel items={[
        { label: "Net Force", value: `${Math.abs(netForce).toFixed(1)} N`, color: Math.abs(netForce) < 0.5 ? "#10b981" : "#f59e0b" },
        { label: "Acceleration", value: `${Math.abs(accel).toFixed(2)} m/s²`, color: "#3b82f6" },
        { label: "Tension", value: `${tension.toFixed(1)} N`, color: "#8b5cf6" },
        { label: "Status", value: Math.abs(netForce) < 0.5 ? "BALANCED" : "UNBALANCED", color: Math.abs(netForce) < 0.5 ? "#10b981" : "#ef4444" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 3. BUOYANCY — Weight vs Upthrust
 * Object submerged in fluid: buoyancy force = ρ_fluid × V_submerged × g
 * Shows Archimedes' principle with real-time force comparison
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_buoyancy_forces() {
  const [objectDensity, setObjectDensity] = useState(800); // kg/m³ (wood ~600, steel ~7800, water=1000)
  const [fluidDensity, setFluidDensity] = useState(1000); // kg/m³ (water)
  const [volume, setVolume] = useState(0.001); // m³ (1 litre)
  const objectMass = objectDensity * volume;
  const weight = objectMass * 9.8;
  const buoyancy = fluidDensity * volume * 9.8;
  const netForce = weight - buoyancy;
  const floats = objectDensity <= fluidDensity;
  const submergedFraction = floats ? objectDensity / fluidDensity : 1;
  const apparentWeight = Math.max(0, weight - buoyancy);
  const [anim, setAnim] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAnim(a => a + 1), 50);
    return () => clearInterval(id);
  }, []);

  const fluidY = 180;
  const objH = 60;
  const objSubmergedH = objH * submergedFraction;
  const objY = fluidY - (objH - objSubmergedH);

  return (
    <SimCard title="🌊 Buoyancy — Archimedes' Principle" desc="Any object submerged in a fluid experiences an upward buoyant force equal to the weight of fluid displaced. If buoyancy ≥ weight → floats!">
      <div style={{ background: "linear-gradient(180deg, #020617 0%, #020617 55%, #0c4a6e 55%, #075985 100%)", borderRadius: 12, padding: 20, minHeight: 300, position: "relative", overflow: "hidden" }}>
        {/* Water surface label */}
        <div style={{ position: "absolute", top: fluidY - 8, left: 16, color: "#38bdf8", fontSize: 11, fontWeight: 700 }}>FLUID SURFACE ρ={fluidDensity} kg/m³</div>
        <div style={{ position: "absolute", top: fluidY, left: 0, right: 0, height: 2, background: "#38bdf8", opacity: 0.5 }} />

        {/* Object */}
        <div style={{
          position: "absolute", left: "50%", top: objY, transform: "translateX(-50%)",
          width: 70, height: objH, borderRadius: 8,
          background: `linear-gradient(135deg, ${objectDensity < 1000 ? "#f59e0b" : objectDensity < 5000 ? "#6366f1" : "#64748b"}, ${objectDensity < 1000 ? "#d97706" : objectDensity < 5000 ? "#4f46e5" : "#475569"})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "2px solid #94a3b8", transition: "top 0.3s",
        }}>
          <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{objectDensity < 500 ? "Wood" : objectDensity < 1100 ? "Plastic" : objectDensity < 4000 ? "Aluminium" : "Steel"}</span>
        </div>

        {/* Weight arrow (down) */}
        <div style={{ position: "absolute", left: "50%", top: objY + objH, transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 3, height: Math.min(weight * 8, 60), background: "#ef4444" }} />
          <span style={{ color: "#ef4444", fontSize: 11, fontWeight: 700 }}>W={weight.toFixed(1)}N↓</span>
        </div>

        {/* Buoyancy arrow (up) */}
        <div style={{ position: "absolute", left: "55%", top: objY - Math.min(buoyancy * 8, 60), transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ color: "#10b981", fontSize: 11, fontWeight: 700 }}>Fb={buoyancy.toFixed(1)}N↑</span>
          <div style={{ width: 3, height: Math.min(buoyancy * 8, 60), background: "#10b981" }} />
        </div>

        {/* Status */}
        <div style={{ position: "absolute", top: 12, right: 16, background: floats ? "#10b98120" : "#ef444420", padding: "6px 14px", borderRadius: 20, border: `1px solid ${floats ? "#10b981" : "#ef4444"}`, color: floats ? "#10b981" : "#ef4444", fontWeight: 700, fontSize: 12 }}>
          {floats ? "✓ FLOATS" : "⬇ SINKS"}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 16, background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #1e293b" }}>
        <div>
          <div style={{ fontSize: 12, color: "#f59e0b", fontWeight: 700, marginBottom: 4 }}>Object Density: {objectDensity} kg/m³</div>
          <input type="range" min={100} max={9000} step={100} value={objectDensity} onChange={e => setObjectDensity(+e.target.value)} style={{ width: "100%", accentColor: "#f59e0b" }} />
          <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>Wood=600, Water=1000, Steel=7800</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#38bdf8", fontWeight: 700, marginBottom: 4 }}>Fluid Density: {fluidDensity} kg/m³</div>
          <input type="range" min={700} max={13600} step={100} value={fluidDensity} onChange={e => setFluidDensity(+e.target.value)} style={{ width: "100%", accentColor: "#38bdf8" }} />
          <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>Oil=800, Water=1000, Mercury=13600</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#8b5cf6", fontWeight: 700, marginBottom: 4 }}>Volume: {(volume * 1000).toFixed(1)} L</div>
          <input type="range" min={0.0005} max={0.01} step={0.0005} value={volume} onChange={e => setVolume(+e.target.value)} style={{ width: "100%", accentColor: "#8b5cf6" }} />
        </div>
      </div>
      <TPanel items={[
        { label: "Weight", value: `${weight.toFixed(1)} N`, color: "#ef4444" },
        { label: "Buoyancy", value: `${buoyancy.toFixed(1)} N`, color: "#10b981" },
        { label: "Net Force", value: `${Math.abs(netForce).toFixed(1)} N ${netForce > 0 ? "↓" : "↑"}`, color: floats ? "#10b981" : "#f59e0b" },
        { label: "App. Weight", value: `${apparentWeight.toFixed(1)} N`, color: "#94a3b8" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 4. 2D VECTOR ADDITION SANDBOX
 * Add up to 4 force vectors in 2D, see the resultant visually
 * Real-time trigonometry: Rx = ΣFcosθ, Ry = ΣFsinθ
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_vector_2d() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [vectors, setVectors] = useState([
    { mag: 50, angle: 30, color: "#ef4444" },
    { mag: 40, angle: 120, color: "#3b82f6" },
    { mag: 30, angle: 240, color: "#10b981" },
  ]);
  const animRef = useRef<number>(0);

  const Rx = vectors.reduce((s, v) => s + v.mag * Math.cos(v.angle * Math.PI / 180), 0);
  const Ry = vectors.reduce((s, v) => s + v.mag * Math.sin(v.angle * Math.PI / 180), 0);
  const Rmag = Math.sqrt(Rx * Rx + Ry * Ry);
  const Rangle = Math.atan2(Ry, Rx) * 180 / Math.PI;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Axes
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.setLineDash([]);

    // Draw each force vector (tip-to-tail)
    const drawVec = (fx: number, fy: number, color: string, label: string, fromX: number, fromY: number) => {
      const scale = 1.5;
      const tx = fromX + fx * scale, ty = fromY - fy * scale;
      const angle = Math.atan2(ty - fromY, tx - fromX);
      ctx.beginPath(); ctx.moveTo(fromX, fromY); ctx.lineTo(tx, ty);
      ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.stroke();
      // Arrowhead
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(tx - 10 * Math.cos(angle - 0.4), ty - 10 * Math.sin(angle - 0.4));
      ctx.lineTo(tx - 10 * Math.cos(angle + 0.4), ty - 10 * Math.sin(angle + 0.4));
      ctx.closePath(); ctx.fillStyle = color; ctx.fill();
      ctx.fillStyle = color; ctx.font = "bold 12px JetBrains Mono"; ctx.textAlign = "center";
      ctx.fillText(label, tx + 12 * Math.cos(angle), ty + 12 * Math.sin(angle) - 5);
      return { tx, ty };
    };

    // Individual vectors from origin
    vectors.forEach(v => {
      const fx = v.mag * Math.cos(v.angle * Math.PI / 180);
      const fy = v.mag * Math.sin(v.angle * Math.PI / 180);
      drawVec(fx, fy, v.color + "88", `${v.mag}N@${v.angle}°`, cx, cy);
    });

    // Resultant (thick, dashed)
    ctx.setLineDash([8, 4]);
    ctx.strokeStyle = "#e879f9";
    ctx.lineWidth = 3;
    const scale = 1.5;
    const rx = cx + Rx * scale, ry = cy - Ry * scale;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(rx, ry); ctx.stroke();
    ctx.setLineDash([]);
    // Arrowhead for resultant
    const rangle = Math.atan2(ry - cy, rx - cx);
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx - 14 * Math.cos(rangle - 0.4), ry - 14 * Math.sin(rangle - 0.4));
    ctx.lineTo(rx - 14 * Math.cos(rangle + 0.4), ry - 14 * Math.sin(rangle + 0.4));
    ctx.closePath(); ctx.fillStyle = "#e879f9"; ctx.fill();
    ctx.fillStyle = "#e879f9"; ctx.font = "bold 13px JetBrains Mono"; ctx.textAlign = "center";
    if (Rmag > 2) ctx.fillText(`R=${Rmag.toFixed(1)}N`, rx + 20 * Math.cos(rangle + 0.3), ry + 20 * Math.sin(rangle + 0.3) - 5);

    animRef.current = requestAnimationFrame(draw);
  }, [vectors, Rx, Ry, Rmag]);

  useEffect(() => { animRef.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(animRef.current); }, [draw]);

  const updateVec = (i: number, key: "mag" | "angle", val: number) => {
    setVectors(prev => prev.map((v, idx) => idx === i ? { ...v, [key]: val } : v));
  };

  return (
    <SimCard title="🎯 2D Force Vector Addition" desc="Add multiple forces at different angles. The resultant is the purple arrow — Rx = ΣF·cos(θ), Ry = ΣF·sin(θ), R = √(Rx²+Ry²). This is how engineers find net forces!">
      <canvas ref={canvasRef} width={600} height={300} style={{ width: "100%", borderRadius: 12 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 14, background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #1e293b" }}>
        {vectors.map((v, i) => (
          <div key={i} style={{ border: `1px solid ${v.color}40`, borderRadius: 10, padding: 10 }}>
            <div style={{ fontSize: 12, color: v.color, fontWeight: 700, marginBottom: 6 }}>Force {i + 1}</div>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 2 }}>Magnitude: {v.mag} N</div>
            <input type="range" min={0} max={100} value={v.mag} onChange={e => updateVec(i, "mag", +e.target.value)} style={{ width: "100%", accentColor: v.color, marginBottom: 4 }} />
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 2 }}>Angle: {v.angle}°</div>
            <input type="range" min={0} max={359} value={v.angle} onChange={e => updateVec(i, "angle", +e.target.value)} style={{ width: "100%", accentColor: v.color }} />
          </div>
        ))}
      </div>
      <TPanel items={[
        { label: "Resultant Rx", value: `${Rx.toFixed(1)} N`, color: "#e879f9" },
        { label: "Resultant Ry", value: `${Ry.toFixed(1)} N`, color: "#e879f9" },
        { label: "Magnitude", value: `${Rmag.toFixed(1)} N`, color: Rmag < 2 ? "#10b981" : "#f59e0b" },
        { label: "Direction", value: `${Rangle.toFixed(1)}°`, color: "#94a3b8" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 5. GRAVITY ON DIFFERENT PLANETS
 * Same mass, different gravitational acceleration → different weight
 * Teaches: Weight = mg is NOT constant; mass IS constant.
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_gravity_planets() {
  const [mass, setMass] = useState(60);
  const planets = [
    { name: "Moon", g: 1.62, color: "#94a3b8", emoji: "🌕" },
    { name: "Mars", g: 3.72, color: "#f97316", emoji: "🔴" },
    { name: "Earth", g: 9.81, color: "#22c55e", emoji: "🌍" },
    { name: "Saturn", g: 10.44, color: "#f59e0b", emoji: "🪐" },
    { name: "Jupiter", g: 24.79, color: "#a78bfa", emoji: "🟣" },
    { name: "Sun", g: 274, color: "#fbbf24", emoji: "☀️" },
  ];

  return (
    <SimCard title="🪐 Weight on Different Planets — W = mg" desc="Your mass never changes (always the same number of atoms). But weight (the gravitational force) changes drastically depending on which planet you're on. Weight = mass × g.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {planets.map(p => {
          const w = mass * p.g;
          const barW = Math.min((p.g / 274) * 100, 100);
          return (
            <div key={p.name} style={{ background: "#0f172a", borderRadius: 12, padding: 14, border: `1px solid ${p.color}30` }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>{p.emoji}</div>
              <div style={{ color: p.color, fontWeight: 800, fontSize: 14, marginBottom: 2 }}>{p.name}</div>
              <div style={{ color: "#64748b", fontSize: 11, marginBottom: 6 }}>g = {p.g} m/s²</div>
              <div style={{ height: 8, background: "#1e293b", borderRadius: 4, overflow: "hidden", marginBottom: 6 }}>
                <div style={{ width: `${barW}%`, height: "100%", background: `linear-gradient(90deg, ${p.color}88, ${p.color})`, borderRadius: 4 }} />
              </div>
              <div style={{ color: "#f1f5f9", fontWeight: 700, fontFamily: "JetBrains Mono", fontSize: 15 }}>{w.toFixed(0)} N</div>
              <div style={{ color: "#475569", fontSize: 10 }}>Weight</div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 16, background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #1e293b" }}>
        <div style={{ fontSize: 13, color: "#f59e0b", fontWeight: 700, marginBottom: 4 }}>Your Mass: {mass} kg (constant everywhere!)</div>
        <input type="range" min={1} max={200} value={mass} onChange={e => setMass(+e.target.value)} style={{ width: "100%", accentColor: "#f59e0b" }} />
      </div>
      <TPanel items={[
        { label: "Mass", value: `${mass} kg`, color: "#94a3b8" },
        { label: "Weight on Earth", value: `${(mass * 9.81).toFixed(0)} N`, color: "#22c55e" },
        { label: "Weight on Moon", value: `${(mass * 1.62).toFixed(0)} N`, color: "#94a3b8" },
        { label: "Weight on Jupiter", value: `${(mass * 24.79).toFixed(0)} N`, color: "#a78bfa" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 6. BRIDGE TENSION — Forces in a suspension bridge
 * The cable of a bridge carries tension equal to the load supported.
 * Shows how angle of cable affects tension (T = W / 2sinθ)
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_bridge_tension() {
  const [load, setLoad] = useState(100);  // Weight hanging in Newtons
  const [cableAngle, setCableAngle] = useState(30); // Angle of cable with horizontal
  const theta = cableAngle * Math.PI / 180;
  const tension = load / (2 * Math.sin(theta));  // Each cable carries half the load
  const horizontalComp = tension * Math.cos(theta);
  const verticalComp = tension * Math.sin(theta);

  const W = 300, H = 220;
  const midX = W / 2, supportY = 30;
  const loadY = H - 50;
  const leftX = 30, rightX = W - 30;
  const leftAnchorY = supportY + (midX - leftX) * Math.tan(theta);
  const rightAnchorY = supportY + (rightX - midX) * Math.tan(theta);

  return (
    <SimCard title="🌉 Bridge Cable Tension — T = W / 2sinθ" desc="A load suspended from cables at angle θ. Each cable pulls upward with T·sinθ = W/2. Shallow angles create HUGE tension! Engineers must account for this.">
      <div style={{ background: "#020617", borderRadius: 12, overflow: "hidden" }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          {/* Sky */}
          <rect x="0" y="0" width={W} height={H} fill="#020617" />
          {/* Towers */}
          <rect x={leftX - 8} y={supportY - 20} width="16" height={leftAnchorY - supportY + 20} rx="3" fill="#475569" />
          <rect x={rightX - 8} y={supportY - 20} width="16" height={rightAnchorY - supportY + 20} rx="3" fill="#475569" />
          {/* Cables (main) */}
          <line x1={leftX} y1={leftAnchorY} x2={midX} y2={loadY} stroke="#f59e0b" strokeWidth="3" />
          <line x1={rightX} y1={rightAnchorY} x2={midX} y2={loadY} stroke="#f59e0b" strokeWidth="3" />
          {/* Tension labels */}
          <text x={(leftX + midX) / 2 - 20} y={(leftAnchorY + loadY) / 2} fill="#f59e0b" fontSize="11" fontWeight="700" fontFamily="JetBrains Mono">{tension.toFixed(0)}N</text>
          <text x={(rightX + midX) / 2 + 4} y={(rightAnchorY + loadY) / 2} fill="#f59e0b" fontSize="11" fontWeight="700" fontFamily="JetBrains Mono">{tension.toFixed(0)}N</text>
          {/* Load block */}
          <rect x={midX - 30} y={loadY} width="60" height="40" rx="6" fill="#6366f1" stroke="#818cf8" strokeWidth="1.5" />
          <text x={midX} y={loadY + 25} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700" fontFamily="JetBrains Mono">{load}N</text>
          {/* Weight arrow */}
          <line x1={midX} y1={loadY + 40} x2={midX} y2={loadY + 70} stroke="#ef4444" strokeWidth="2" />
          <text x={midX} y={loadY + 82} textAnchor="middle" fill="#ef4444" fontSize="10" fontFamily="JetBrains Mono">W={load}N</text>
          {/* Angle arc */}
          <path d={`M ${midX + 40} ${loadY} A 40 40 0 0 0 ${midX + 40 * Math.cos(Math.PI - theta)} ${loadY - 40 * Math.sin(theta)}`} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,3" />
          <text x={midX + 50} y={loadY - 14} fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono">{cableAngle}°</text>
        </svg>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16, background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #1e293b" }}>
        <div>
          <div style={{ fontSize: 12, color: "#6366f1", fontWeight: 700, marginBottom: 4 }}>Load: {load} N</div>
          <input type="range" min={10} max={500} value={load} onChange={e => setLoad(+e.target.value)} style={{ width: "100%", accentColor: "#6366f1" }} />
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#f59e0b", fontWeight: 700, marginBottom: 4 }}>Cable Angle: {cableAngle}°</div>
          <input type="range" min={5} max={80} value={cableAngle} onChange={e => setCableAngle(+e.target.value)} style={{ width: "100%", accentColor: "#f59e0b" }} />
          <div style={{ fontSize: 10, color: "#475569" }}>Smaller angle = more tension!</div>
        </div>
      </div>
      <TPanel items={[
        { label: "Cable Tension", value: `${tension.toFixed(1)} N`, color: "#f59e0b" },
        { label: "Horizontal Pull", value: `${horizontalComp.toFixed(1)} N`, color: "#3b82f6" },
        { label: "Vertical Support", value: `${verticalComp.toFixed(1)} N`, color: "#10b981" },
        { label: "Load", value: `${load} N`, color: "#6366f1" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 7. STATICS: BALANCING A SEESAW (TORQUE)
 * For a balanced seesaw: F₁×d₁ = F₂×d₂ (Torque balance)
 * Balanced forces alone don't prevent rotation — torque matters!
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_seesaw_torque() {
  const [m1, setM1] = useState(40);
  const [d1, setD1] = useState(2);
  const [m2, setM2] = useState(20);
  const [d2, setD2] = useState(4);
  const g = 9.8;
  const torque1 = m1 * g * d1;
  const torque2 = m2 * g * d2;
  const netTorque = torque1 - torque2;
  const isBalanced = Math.abs(netTorque) < 10;
  const tiltAngle = Math.max(-20, Math.min(20, netTorque / 50));

  const W = 500, H = 220;
  const cx = W / 2, cy = 140;
  const beamLen = 400;
  const rad = tiltAngle * Math.PI / 180;

  const x1 = cx - d1 * 40;
  const x2 = cx + d2 * 40;
  const y1 = cy + (cx - x1) * Math.sin(rad);
  const y2 = cy - (x2 - cx) * Math.sin(rad);

  return (
    <SimCard title="⚖️ Seesaw & Torque — Balanced Forces Aren't Enough!" desc="Two equal forces can still cause rotation if applied at different distances. Torque = Force × Distance. For balance: F₁×d₁ = F₂×d₂. This is the Principle of Moments.">
      <div style={{ background: "#020617", borderRadius: 12, overflow: "hidden" }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          {/* Ground */}
          <rect x="0" y={H - 20} width={W} height="20" fill="#1e293b" />
          {/* Pivot triangle */}
          <polygon points={`${cx},${cy + 5} ${cx - 20},${H - 20} ${cx + 20},${H - 20}`} fill="#475569" />
          {/* Beam (rotated) */}
          <g transform={`rotate(${tiltAngle}, ${cx}, ${cy})`}>
            <rect x={cx - beamLen / 2} y={cy - 6} width={beamLen} height="12" rx="4" fill="#64748b" />
            {/* Distance markers */}
            <line x1={cx} y1={cy - 6} x2={cx - d1 * 40} y2={cy - 6} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,3" />
            <text x={cx - d1 * 20} y={cy - 14} textAnchor="middle" fill="#ef4444" fontSize="11" fontFamily="JetBrains Mono">{d1}m</text>
            <line x1={cx} y1={cy - 6} x2={cx + d2 * 40} y2={cy - 6} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,3" />
            <text x={cx + d2 * 20} y={cy - 14} textAnchor="middle" fill="#3b82f6" fontSize="11" fontFamily="JetBrains Mono">{d2}m</text>
          </g>
          {/* Mass 1 (left) */}
          <rect x={x1 - 24} y={y1 - 56} width="48" height="48" rx="6" fill="#ef4444" stroke="#f87171" strokeWidth="1.5" />
          <text x={x1} y={y1 - 26} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700" fontFamily="JetBrains Mono">{m1}kg</text>
          {/* Mass 2 (right) */}
          <rect x={x2 - 24} y={y2 - 56} width="48" height="48" rx="6" fill="#3b82f6" stroke="#60a5fa" strokeWidth="1.5" />
          <text x={x2} y={y2 - 26} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700" fontFamily="JetBrains Mono">{m2}kg</text>
          {/* Balanced indicator */}
          {isBalanced && (
            <text x={cx} y="20" textAnchor="middle" fill="#10b981" fontSize="14" fontWeight="700" fontFamily="Inter">✓ PERFECTLY BALANCED</text>
          )}
        </svg>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginTop: 16, background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #1e293b" }}>
        {[
          { label: `M1: ${m1}kg`, min: 5, max: 100, value: m1, set: setM1, color: "#ef4444" },
          { label: `d1: ${d1}m`, min: 0.5, max: 5, step: 0.5, value: d1, set: setD1, color: "#ef4444" },
          { label: `M2: ${m2}kg`, min: 5, max: 100, value: m2, set: setM2, color: "#3b82f6" },
          { label: `d2: ${d2}m`, min: 0.5, max: 5, step: 0.5, value: d2, set: setD2, color: "#3b82f6" },
        ].map(({ label, min, max, step = 1, value, set, color }) => (
          <div key={label}>
            <div style={{ fontSize: 11, color, fontWeight: 700, marginBottom: 4 }}>{label}</div>
            <input type="range" min={min} max={max} step={step} value={value} onChange={e => set(+e.target.value as never)} style={{ width: "100%", accentColor: color }} />
          </div>
        ))}
      </div>
      <TPanel items={[
        { label: "Torque Left", value: `${torque1.toFixed(0)} N·m`, color: "#ef4444" },
        { label: "Torque Right", value: `${torque2.toFixed(0)} N·m`, color: "#3b82f6" },
        { label: "Net Torque", value: `${Math.abs(netTorque).toFixed(0)} N·m`, color: isBalanced ? "#10b981" : "#f59e0b" },
        { label: "Status", value: isBalanced ? "BALANCED" : netTorque > 0 ? "TILTS LEFT" : "TILTS RIGHT", color: isBalanced ? "#10b981" : "#ef4444" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 8. SATELLITE IN ORBIT — Gravity as Centripetal Force
 * A satellite doesn't "fall" to Earth because its horizontal speed carries
 * it forward as fast as Earth curves away beneath it.
 * Gravity IS the centripetal force: mg = mv²/r → v = √(gr)
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_satellite_orbit() {
  const [orbitRadius, setOrbitRadius] = useState(100); // pixels (visual)
  const [speed, setSpeed] = useState(100); // percentage of perfect orbital speed
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ angle: 0, r: orbitRadius, spiralR: orbitRadius });
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);

  // Perfect orbital speed for visual: ω such that centripetal = gravity (scaled)
  const omega = Math.sqrt(500 / (orbitRadius * orbitRadius * orbitRadius)) * (speed / 100);
  const isTooFast = speed > 115;
  const isTooSlow = speed < 85;
  const isPerfect = !isTooFast && !isTooSlow;

  const draw = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(draw); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    const s = stateRef.current;
    s.angle += omega * dt * 60;

    // If too slow, spiral inward slowly; if too fast, spiral outward
    if (isTooSlow && s.spiralR > 40) s.spiralR -= 0.3;
    else if (isTooFast && s.spiralR < 200) s.spiralR += 0.3;
    else s.spiralR = orbitRadius;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    ctx.clearRect(0, 0, W, H);

    // Space background
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, W, H);
    // Stars
    for (let i = 0; i < 80; i++) {
      const sx = (Math.sin(i * 137.5) * 0.5 + 0.5) * W;
      const sy = (Math.cos(i * 137.5) * 0.5 + 0.5) * H;
      ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.sin(t / 500 + i) * 0.2})`;
      ctx.beginPath();
      ctx.arc(sx, sy, 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Orbit path
    ctx.beginPath();
    ctx.arc(cx, cy, orbitRadius, 0, Math.PI * 2);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Earth
    const earthGrad = ctx.createRadialGradient(cx - 8, cy - 8, 2, cx, cy, 34);
    earthGrad.addColorStop(0, "#60a5fa");
    earthGrad.addColorStop(0.5, "#2563eb");
    earthGrad.addColorStop(1, "#1d4ed8");
    ctx.fillStyle = earthGrad;
    ctx.beginPath(); ctx.arc(cx, cy, 34, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#22c55e";
    ctx.beginPath(); ctx.ellipse(cx - 10, cy, 10, 6, 0.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + 8, cy - 5, 8, 5, -0.3, 0, Math.PI * 2); ctx.fill();

    // Satellite position
    const r = s.spiralR;
    const sx = cx + r * Math.cos(s.angle);
    const sy = cy + r * Math.sin(s.angle);

    // Gravity arrow (toward Earth)
    const gLen = 28;
    const dx = cx - sx, dy = cy - sy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + (dx / dist) * gLen, sy + (dy / dist) * gLen);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Velocity arrow (tangent)
    const vx = -Math.sin(s.angle) * 28, vy = Math.cos(s.angle) * 28;
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + vx, sy + vy);
    ctx.strokeStyle = "#10b981"; ctx.lineWidth = 2; ctx.stroke();

    // Satellite body
    ctx.fillStyle = "#e2e8f0";
    ctx.beginPath(); ctx.arc(sx, sy, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#f59e0b";
    // Solar panels
    ctx.fillRect(sx - 20, sy - 3, 10, 6);
    ctx.fillRect(sx + 10, sy - 3, 10, 6);

    // Status text
    ctx.fillStyle = isPerfect ? "#10b981" : isTooFast ? "#f59e0b" : "#ef4444";
    ctx.font = "bold 13px Inter";
    ctx.textAlign = "center";
    ctx.fillText(isPerfect ? "✓ STABLE ORBIT" : isTooFast ? "⬆ ESCAPING ORBIT" : "⬇ FALLING INWARD", cx, 20);

    animRef.current = requestAnimationFrame(draw);
  }, [omega, orbitRadius, isTooFast, isTooSlow, isPerfect]);

  useEffect(() => {
    stateRef.current.spiralR = orbitRadius;
    stateRef.current.angle = 0;
    lastRef.current = 0;
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw, orbitRadius]);

  return (
    <SimCard title="🛰️ Satellite Orbit — Gravity as Centripetal Force" desc="A satellite doesn't fall because its forward speed is just right! Gravity (centripetal force) curves the path into a circle. Too fast → escapes. Too slow → falls. Just right → perfect orbit!">
      <canvas ref={canvasRef} width={500} height={400} style={{ width: "100%", borderRadius: 12 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16, background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #1e293b" }}>
        <div>
          <div style={{ fontSize: 12, color: "#3b82f6", fontWeight: 700, marginBottom: 4 }}>Orbit Altitude: {orbitRadius - 34} (visual units)</div>
          <input type="range" min={50} max={160} value={orbitRadius} onChange={e => setOrbitRadius(+e.target.value)} style={{ width: "100%", accentColor: "#3b82f6" }} />
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#10b981", fontWeight: 700, marginBottom: 4 }}>Orbital Speed: {speed}% of perfect</div>
          <input type="range" min={50} max={150} value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: "100%", accentColor: "#10b981" }} />
          <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>100% = stable orbit</div>
        </div>
      </div>
      <TPanel items={[
        { label: "Gravity Arrow", value: "→ Earth (Red)", color: "#ef4444" },
        { label: "Velocity Arrow", value: "Tangent (Green)", color: "#10b981" },
        { label: "Speed", value: `${speed}% orbital`, color: "#f59e0b" },
        { label: "Orbit Status", value: isPerfect ? "STABLE" : isTooFast ? "ESCAPING" : "FALLING", color: isPerfect ? "#10b981" : "#ef4444" },
      ]} />
    </SimCard>
  );
}
