"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

/* ══════════════════════════════════════════════════════════════════
 * SHARED SIMULATION WRAPPER (same as Topic1Advanced)
 * ══════════════════════════════════════════════════════════════════ */
function SimCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div style={{
      width: "100%", background: "#0b1120", borderRadius: 16, padding: 24, marginTop: 32, marginBottom: 32,
      border: "1px solid #1e293b", boxShadow: "0 8px 32px rgba(0,0,0,0.4)", fontFamily: "Inter, system-ui, sans-serif", overflow: "hidden",
    }}>
      <div style={{ borderBottom: "1px solid #1e293b", paddingBottom: 16, marginBottom: 20 }}>
        <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: 0 }}>{title}</h3>
        <p style={{ color: "#94a3b8", fontSize: 14, margin: "6px 0 0" }}>{description}</p>
      </div>
      {children}
    </div>
  );
}

function Telemetry({ items }: { items: { label: string; value: string; color: string }[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(items.length, 4)}, 1fr)`, gap: 12, marginTop: 16 }}>
      {items.map((it) => (
        <div key={it.label} style={{ background: "#0f172a", borderRadius: 10, padding: "10px 14px", border: "1px solid #1e293b" }}>
          <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{it.label}</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: it.color, fontFamily: "JetBrains Mono, monospace" }}>{it.value}</div>
        </div>
      ))}
    </div>
  );
}

function ControlButton({ onClick, label, variant = "primary" }: { onClick: () => void; label: string; variant?: "primary" | "secondary" | "danger" }) {
  const colors = { primary: { bg: "#10b981", text: "#0f172a" }, secondary: { bg: "#1e293b", text: "#cbd5e1" }, danger: { bg: "#ef4444", text: "#fff" } };
  const c = colors[variant];
  return <button onClick={onClick} style={{ padding: "10px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", background: c.bg, color: c.text, transition: "all 0.2s" }}>{label}</button>;
}

/* ══════════════════════════════════════════════════════════════════
 * 1. CRANE LOAD BALANCER — Torque equilibrium on a crane boom
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_crane_load_balancer() {
  const [loadWeight, setLoadWeight] = useState(500);
  const [loadDistance, setLoadDistance] = useState(8);
  const [counterWeight, setCounterWeight] = useState(1000);
  const [counterDistance, setCounterDistance] = useState(4);

  const torqueLoad = loadWeight * loadDistance;
  const torqueCounter = counterWeight * counterDistance;
  const netTorque = torqueLoad - torqueCounter;
  const isBalanced = Math.abs(netTorque) < 50;
  const tiltAngle = Math.max(-15, Math.min(15, netTorque / 200));

  return (
    <SimCard title="🏗️ Crane Load Balancer" description="Balance the crane boom by adjusting load weight, distance, and counterweight. Torque = Force × Distance must be equal on both sides!">
      <div style={{ background: "#020617", borderRadius: 12, padding: 20, minHeight: 300, position: "relative", overflow: "hidden" }}>
        {/* Sky gradient */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #0c1929 0%, #162033 60%, #1e293b 100%)" }} />
        
        {/* Crane tower */}
        <div style={{ position: "absolute", left: "50%", bottom: 40, width: 16, height: 180, background: "linear-gradient(90deg, #f59e0b, #d97706)", transform: "translateX(-50%)", borderRadius: "4px 4px 0 0", zIndex: 2 }} />
        
        {/* Boom (rotates) */}
        <div style={{
          position: "absolute", left: "50%", bottom: 210, width: 360, height: 12, background: "#475569",
          transform: `translateX(-50%) rotate(${tiltAngle}deg)`, transformOrigin: "center center",
          borderRadius: 6, zIndex: 3, transition: "transform 0.3s ease",
          border: `2px solid ${isBalanced ? "#10b981" : "#ef4444"}`,
        }}>
          {/* Load (right side) */}
          <div style={{
            position: "absolute", right: 20 + (8 - loadDistance) * 15, top: 12, width: 40, height: 40 + loadWeight / 40,
            background: "linear-gradient(135deg, #ef4444, #dc2626)", borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
            boxShadow: "0 4px 12px rgba(239,68,68,0.3)",
          }}>
            <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{loadWeight}N</span>
            <div style={{ width: 2, height: 20, background: "#94a3b8", position: "absolute", top: -20 }} />
          </div>
          
          {/* Counterweight (left side) */}
          <div style={{
            position: "absolute", left: 20 + (8 - counterDistance) * 15, top: 12, width: 50, height: 30 + counterWeight / 50,
            background: "linear-gradient(135deg, #3b82f6, #2563eb)", borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
            boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
          }}>
            <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{counterWeight}N</span>
            <div style={{ width: 2, height: 20, background: "#94a3b8", position: "absolute", top: -20 }} />
          </div>
          
          {/* Pivot point */}
          <div style={{ position: "absolute", left: "50%", top: -8, transform: "translateX(-50%)", width: 20, height: 20, background: "#f59e0b", borderRadius: "50%", border: "3px solid #d97706" }} />
        </div>

        {/* Ground */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, background: "#1e293b" }} />
        
        {/* Balance indicator */}
        <div style={{
          position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)",
          background: isBalanced ? "#10b98120" : "#ef444420", padding: "6px 20px", borderRadius: 20,
          border: `1px solid ${isBalanced ? "#10b981" : "#ef4444"}`,
          color: isBalanced ? "#10b981" : "#ef4444", fontWeight: 700, fontSize: 14, zIndex: 5,
        }}>
          {isBalanced ? "✓ BALANCED — Crane is stable!" : netTorque > 0 ? "⚠️ TIPPING RIGHT — Load too heavy!" : "⚠️ TIPPING LEFT — Counterweight too heavy!"}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <div style={{ background: "#0f172a", padding: 16, borderRadius: 12, border: "1px solid #1e293b" }}>
          <div style={{ fontSize: 11, color: "#ef4444", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, fontWeight: 700 }}>🔴 Load Side</div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ color: "#ef4444", fontWeight: 700, fontSize: 12, display: "flex", justifyContent: "space-between" }}><span>Weight</span><span>{loadWeight} N</span></label>
            <input type="range" min={100} max={2000} value={loadWeight} onChange={e => setLoadWeight(+e.target.value)} style={{ width: "100%", accentColor: "#ef4444" }} />
          </div>
          <div>
            <label style={{ color: "#ef4444", fontWeight: 700, fontSize: 12, display: "flex", justifyContent: "space-between" }}><span>Distance</span><span>{loadDistance} m</span></label>
            <input type="range" min={1} max={8} step={0.5} value={loadDistance} onChange={e => setLoadDistance(+e.target.value)} style={{ width: "100%", accentColor: "#ef4444" }} />
          </div>
        </div>
        <div style={{ background: "#0f172a", padding: 16, borderRadius: 12, border: "1px solid #1e293b" }}>
          <div style={{ fontSize: 11, color: "#3b82f6", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, fontWeight: 700 }}>🔵 Counterweight Side</div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ color: "#3b82f6", fontWeight: 700, fontSize: 12, display: "flex", justifyContent: "space-between" }}><span>Weight</span><span>{counterWeight} N</span></label>
            <input type="range" min={100} max={3000} value={counterWeight} onChange={e => setCounterWeight(+e.target.value)} style={{ width: "100%", accentColor: "#3b82f6" }} />
          </div>
          <div>
            <label style={{ color: "#3b82f6", fontWeight: 700, fontSize: 12, display: "flex", justifyContent: "space-between" }}><span>Distance</span><span>{counterDistance} m</span></label>
            <input type="range" min={1} max={8} step={0.5} value={counterDistance} onChange={e => setCounterDistance(+e.target.value)} style={{ width: "100%", accentColor: "#3b82f6" }} />
          </div>
        </div>
      </div>

      <Telemetry items={[
        { label: "Load Torque", value: `${torqueLoad.toFixed(0)} N·m`, color: "#ef4444" },
        { label: "Counter Torque", value: `${torqueCounter.toFixed(0)} N·m`, color: "#3b82f6" },
        { label: "Net Torque", value: `${Math.abs(netTorque).toFixed(0)} N·m`, color: isBalanced ? "#10b981" : "#f59e0b" },
        { label: "Status", value: isBalanced ? "STABLE" : "UNSTABLE", color: isBalanced ? "#10b981" : "#ef4444" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 2. CAR ON A BANKED CURVE — Centripetal force decomposition
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_banked_curve() {
  const [speed, setSpeed] = useState(20);
  const [angle, setAngle] = useState(30);
  const [radius, setRadius] = useState(50);
  const mass = 1200;
  const g = 9.8;

  const angleRad = (angle * Math.PI) / 180;
  const centripetalNeeded = (mass * speed * speed) / radius;
  const normalForce = (mass * g) / Math.cos(angleRad);
  const bankingForce = normalForce * Math.sin(angleRad);
  const frictionNeeded = Math.max(0, centripetalNeeded - bankingForce);
  const isSafe = frictionNeeded < 0.7 * normalForce * Math.cos(angleRad);
  const idealSpeed = Math.sqrt(radius * g * Math.tan(angleRad));

  return (
    <SimCard title="🏎️ Car on a Banked Curve" description="Explore how banking angle, speed, and radius determine whether a car can safely navigate a curve. Shows centripetal force decomposition.">
      <div style={{ display: "flex", gap: 20, alignItems: "stretch" }}>
        {/* Visual */}
        <div style={{ flex: 1, background: "#020617", borderRadius: 12, padding: 20, minHeight: 280, position: "relative", overflow: "hidden" }}>
          {/* Road surface (tilted) */}
          <div style={{
            position: "absolute", left: "50%", top: "55%",
            width: 280, height: 120, background: "linear-gradient(90deg, #334155 0%, #475569 50%, #334155 100%)",
            transform: `translateX(-50%) translateY(-50%) rotate(${-angle}deg)`,
            borderRadius: 8, border: "2px solid #64748b",
          }}>
            {/* Road markings */}
            <div style={{ position: "absolute", top: "50%", left: 10, right: 10, height: 2, background: "#f59e0b80", transform: "translateY(-50%)" }} />
            {/* Car */}
            <div style={{
              position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)",
              fontSize: 36,
            }}>
              🚗
            </div>
          </div>

          {/* Force arrows */}
          <svg width="100%" height="280" style={{ position: "absolute", top: 0, left: 0, zIndex: 2 }}>
            {/* Weight arrow (down) */}
            <line x1="50%" y1="55%" x2="50%" y2="85%" stroke="#ef4444" strokeWidth="3" markerEnd="url(#redArrow)" />
            <text x="52%" y="80%" fill="#ef4444" fontSize="11" fontWeight="700" fontFamily="JetBrains Mono">W = {(mass * g).toFixed(0)}N</text>
            
            {/* Normal force arrow (perpendicular to road) */}
            <line x1="50%" y1="55%" x2={`${50 + Math.sin(angleRad) * 15}%`} y2={`${55 - Math.cos(angleRad) * 25}%`} stroke="#3b82f6" strokeWidth="3" />
            <text x={`${50 + Math.sin(angleRad) * 15 + 1}%`} y={`${55 - Math.cos(angleRad) * 25}%`} fill="#3b82f6" fontSize="11" fontWeight="700">N</text>
            
            {/* Centripetal force arrow (towards center) */}
            <line x1="50%" y1="55%" x2="25%" y2="55%" stroke="#10b981" strokeWidth="3" strokeDasharray="6,3" />
            <text x="25%" y="52%" fill="#10b981" fontSize="11" fontWeight="700">Fc = {centripetalNeeded.toFixed(0)}N</text>
            
            <defs>
              <marker id="redArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#ef4444" /></marker>
            </defs>
          </svg>

          {/* Status */}
          <div style={{
            position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
            padding: "6px 16px", borderRadius: 20, fontWeight: 700, fontSize: 13, zIndex: 3,
            background: isSafe ? "#10b98120" : "#ef444420", border: `1px solid ${isSafe ? "#10b981" : "#ef4444"}`, color: isSafe ? "#10b981" : "#ef4444",
          }}>
            {isSafe ? "✓ SAFE — Car stays on road" : "⚠️ DANGER — Car will skid off!"}
          </div>
        </div>

        {/* Controls */}
        <div style={{ width: 200, display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ color: "#f59e0b", fontWeight: 700, fontSize: 12, display: "flex", justifyContent: "space-between" }}><span>Speed</span><span>{speed} m/s</span></label>
            <input type="range" min={5} max={50} value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: "100%", accentColor: "#f59e0b" }} />
          </div>
          <div>
            <label style={{ color: "#6366f1", fontWeight: 700, fontSize: 12, display: "flex", justifyContent: "space-between" }}><span>Bank Angle</span><span>{angle}°</span></label>
            <input type="range" min={0} max={60} value={angle} onChange={e => setAngle(+e.target.value)} style={{ width: "100%", accentColor: "#6366f1" }} />
          </div>
          <div>
            <label style={{ color: "#10b981", fontWeight: 700, fontSize: 12, display: "flex", justifyContent: "space-between" }}><span>Radius</span><span>{radius} m</span></label>
            <input type="range" min={20} max={200} value={radius} onChange={e => setRadius(+e.target.value)} style={{ width: "100%", accentColor: "#10b981" }} />
          </div>
          <div style={{ background: "#0f172a", padding: 12, borderRadius: 10, border: "1px solid #1e293b", marginTop: 8 }}>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>IDEAL SPEED</div>
            <div style={{ color: "#22d3ee", fontFamily: "JetBrains Mono", fontSize: 18, fontWeight: 700 }}>{idealSpeed.toFixed(1)} m/s</div>
            <div style={{ color: "#64748b", fontSize: 10, marginTop: 4 }}>v = √(r·g·tanθ)</div>
          </div>
        </div>
      </div>

      <Telemetry items={[
        { label: "Centripetal F", value: `${centripetalNeeded.toFixed(0)} N`, color: "#10b981" },
        { label: "Banking Force", value: `${bankingForce.toFixed(0)} N`, color: "#6366f1" },
        { label: "Friction Needed", value: `${frictionNeeded.toFixed(0)} N`, color: frictionNeeded > 0 ? "#f59e0b" : "#10b981" },
        { label: "Safety", value: isSafe ? "SAFE" : "DANGER", color: isSafe ? "#10b981" : "#ef4444" },
      ]} />
    </SimCard>
  );
}
