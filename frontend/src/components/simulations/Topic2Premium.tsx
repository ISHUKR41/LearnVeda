"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

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
 * 1. GALILEO'S THOUGHT EXPERIMENT — Ball rolling on ramps
 * Ball rolls down ramp A, across flat, up ramp B.
 * On frictionless surface it rises to the SAME height.
 * Demonstrates: without friction, objects keep moving forever.
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_galileo_ramp() {
  const [friction, setFriction] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const stateRef = useRef({ x: 0, v: 0, phase: "rampA" as "rampA" | "flat" | "rampB" | "done", h: 100 });
  const [display, setDisplay] = useState({ x: 0, v: 0, h: 100, phase: "rampA" });
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);

  const rampLength = 120;
  const rampAngle = 30;
  const g = 9.8;
  const initialH = 100; // pixels representing height
  const angleRad = (rampAngle * Math.PI) / 180;

  const step = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    const s = stateRef.current;

    if (s.phase === "rampA") {
      const accel = g * Math.sin(angleRad) - friction * g * Math.cos(angleRad);
      s.v += accel * dt;
      s.x += s.v * dt * 30;
      s.h = Math.max(0, initialH - s.x * Math.sin(angleRad));
      if (s.x >= rampLength) {
        s.phase = "flat";
        s.x = 0;
      }
    } else if (s.phase === "flat") {
      const decel = friction * g;
      s.v = Math.max(0, s.v - decel * dt);
      s.x += s.v * dt * 30;
      s.h = 0;
      if (s.x >= 200 || s.v <= 0) {
        if (s.v > 0) { s.phase = "rampB"; s.x = 0; }
        else { s.phase = "done"; }
      }
    } else if (s.phase === "rampB") {
      const decel = g * Math.sin(angleRad) + friction * g * Math.cos(angleRad);
      s.v = Math.max(0, s.v - decel * dt);
      s.x += s.v * dt * 30;
      s.h = s.x * Math.sin(angleRad);
      if (s.v <= 0) s.phase = "done";
    }

    setDisplay({ x: s.x, v: s.v, h: s.h, phase: s.phase });
    if (s.phase !== "done") animRef.current = requestAnimationFrame(step);
  }, [friction, g, angleRad, initialH, rampLength]);

  useEffect(() => {
    if (isPlaying) { lastRef.current = 0; animRef.current = requestAnimationFrame(step); }
    else cancelAnimationFrame(animRef.current);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, step]);

  const reset = () => {
    setIsPlaying(false);
    cancelAnimationFrame(animRef.current);
    stateRef.current = { x: 0, v: 0, phase: "rampA", h: 100 };
    setDisplay({ x: 0, v: 0, h: 100, phase: "rampA" });
  };

  // Calculate ball position for rendering
  const ballPos = (() => {
    const s = stateRef.current;
    const rampAStartX = 40, rampAStartY = 60;
    const rampAEndX = rampAStartX + rampLength * Math.cos(angleRad);
    const rampAEndY = rampAStartY + rampLength * Math.sin(angleRad) * 0.7;
    const flatEndX = rampAEndX + 200;
    const rampBEndX = flatEndX + rampLength * Math.cos(angleRad);
    const rampBEndY = rampAEndY - rampLength * Math.sin(angleRad) * 0.7;

    if (s.phase === "rampA") {
      const frac = Math.min(s.x / rampLength, 1);
      return { x: rampAStartX + frac * (rampAEndX - rampAStartX), y: rampAStartY + frac * (rampAEndY - rampAStartY) };
    }
    if (s.phase === "flat") {
      const frac = Math.min(s.x / 200, 1);
      return { x: rampAEndX + frac * 200, y: rampAEndY };
    }
    if (s.phase === "rampB" || s.phase === "done") {
      const frac = Math.min(s.x / rampLength, 1);
      return { x: flatEndX + frac * (rampBEndX - flatEndX), y: rampAEndY - frac * (rampAEndY - rampBEndY) };
    }
    return { x: rampAStartX, y: rampAStartY };
  })();

  const finalHeight = display.phase === "done" ? display.h : null;
  const reachesOriginal = finalHeight !== null && Math.abs(finalHeight - initialH * Math.sin(angleRad) * 0.7) < 5;

  return (
    <SimCard title="🔬 Galileo's Thought Experiment" description="A ball rolls down Ramp A and up Ramp B. With zero friction, it always reaches the SAME height — proving objects naturally resist changes to their motion (inertia)!">
      <div style={{ background: "#020617", borderRadius: 12, padding: 20, minHeight: 220, position: "relative", overflow: "hidden" }}>
        <svg width="100%" height="200" viewBox="0 0 550 200">
          {/* Ramp A (left, going down) */}
          <line x1="40" y1="60" x2={40 + rampLength * Math.cos(angleRad)} y2={60 + rampLength * Math.sin(angleRad) * 0.7} stroke="#6366f1" strokeWidth="4" strokeLinecap="round" />
          {/* Flat surface */}
          <line x1={40 + rampLength * Math.cos(angleRad)} y1={60 + rampLength * Math.sin(angleRad) * 0.7} x2={40 + rampLength * Math.cos(angleRad) + 200} y2={60 + rampLength * Math.sin(angleRad) * 0.7} stroke="#475569" strokeWidth="4" strokeLinecap="round" />
          {/* Ramp B (right, going up) */}
          <line x1={40 + rampLength * Math.cos(angleRad) + 200} y1={60 + rampLength * Math.sin(angleRad) * 0.7} x2={40 + rampLength * Math.cos(angleRad) + 200 + rampLength * Math.cos(angleRad)} y2={60} stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
          
          {/* Height markers */}
          <line x1="30" y1="60" x2="30" y2={60 + rampLength * Math.sin(angleRad) * 0.7} stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3" />
          <text x="10" y={60 + rampLength * Math.sin(angleRad) * 0.35} fill="#f59e0b" fontSize="10" fontWeight="700">h</text>
          
          {/* Ball */}
          <circle cx={ballPos.x} cy={ballPos.y - 10} r="10" fill="url(#ballGrad2)" stroke="#f59e0b" strokeWidth="2" />
          <defs>
            <radialGradient id="ballGrad2"><stop offset="30%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#d97706" /></radialGradient>
          </defs>
          
          {/* Labels */}
          <text x="60" y="50" fill="#6366f1" fontSize="12" fontWeight="700">Ramp A ↓</text>
          <text x={40 + rampLength * Math.cos(angleRad) + 80} y={60 + rampLength * Math.sin(angleRad) * 0.7 - 10} fill="#475569" fontSize="12" fontWeight="700">Flat Surface</text>
          <text x={40 + rampLength * Math.cos(angleRad) + 220} y="50" fill="#10b981" fontSize="12" fontWeight="700">↑ Ramp B</text>
          
          {/* Friction indicator */}
          {friction > 0 && (
            <text x={40 + rampLength * Math.cos(angleRad) + 80} y={60 + rampLength * Math.sin(angleRad) * 0.7 + 20} fill="#ef4444" fontSize="10" fontWeight="700">μ = {friction.toFixed(2)} (friction slows it down!)</text>
          )}
          {friction === 0 && (
            <text x={40 + rampLength * Math.cos(angleRad) + 80} y={60 + rampLength * Math.sin(angleRad) * 0.7 + 20} fill="#10b981" fontSize="10" fontWeight="700">μ = 0 (frictionless — reaches SAME height!)</text>
          )}
        </svg>
      </div>

      <div style={{ background: "#0f172a", padding: 16, borderRadius: 12, border: "1px solid #1e293b", marginTop: 16 }}>
        <label style={{ color: "#ef4444", fontWeight: 700, fontSize: 13, display: "flex", justifyContent: "space-between" }}>
          <span>Surface Friction (μ)</span><span>{friction.toFixed(2)}</span>
        </label>
        <input type="range" min={0} max={0.5} step={0.01} value={friction} onChange={e => { setFriction(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#ef4444" }} />
        <div style={{ color: "#64748b", fontSize: 11, marginTop: 6 }}>
          {friction === 0 ? "🟢 Frictionless — ball reaches original height (Galileo's ideal)" : `🔴 Friction μ=${friction.toFixed(2)} — ball loses energy, doesn't reach original height`}
        </div>
      </div>

      <Telemetry items={[
        { label: "Speed", value: `${display.v.toFixed(1)} m/s`, color: "#f59e0b" },
        { label: "Height", value: `${display.h.toFixed(0)} px`, color: "#3b82f6" },
        { label: "Phase", value: display.phase.toUpperCase(), color: "#6366f1" },
        { label: "Friction", value: friction === 0 ? "NONE" : `μ = ${friction.toFixed(2)}`, color: friction === 0 ? "#10b981" : "#ef4444" },
      ]} />

      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
        <ControlButton onClick={() => setIsPlaying(!isPlaying)} label={isPlaying ? "PAUSE" : "RELEASE BALL"} variant={isPlaying ? "danger" : "primary"} />
        <ControlButton onClick={reset} label="RESET" variant="secondary" />
      </div>
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 2. ISS MICROGRAVITY LAB — Objects in weightless environment
 * Show how objects move in straight lines with no external forces
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_iss_microgravity() {
  const [objects, setObjects] = useState([
    { id: 1, x: 200, y: 100, vx: 0, vy: 0, emoji: "🔧", name: "Wrench", mass: 0.5 },
    { id: 2, x: 350, y: 150, vx: 0, vy: 0, emoji: "📱", name: "Phone", mass: 0.2 },
    { id: 3, x: 150, y: 200, vx: 0, vy: 0, emoji: "🍎", name: "Apple", mass: 0.15 },
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pushed, setPushed] = useState<number | null>(null);
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);
  const objRef = useRef(objects);
  objRef.current = objects;

  const step = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;

    setObjects(prev => prev.map(obj => {
      let nx = obj.x + obj.vx * dt * 60;
      let ny = obj.y + obj.vy * dt * 60;
      // Bounce off walls of the ISS module
      if (nx < 20 || nx > 530) { obj.vx *= -0.9; nx = Math.max(20, Math.min(530, nx)); }
      if (ny < 20 || ny > 260) { obj.vy *= -0.9; ny = Math.max(20, Math.min(260, ny)); }
      return { ...obj, x: nx, y: ny };
    }));

    animRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    if (isPlaying) { lastRef.current = 0; animRef.current = requestAnimationFrame(step); }
    else cancelAnimationFrame(animRef.current);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, step]);

  const pushObject = (id: number) => {
    setPushed(id);
    setObjects(prev => prev.map(obj =>
      obj.id === id
        ? { ...obj, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4 }
        : obj
    ));
    setTimeout(() => setPushed(null), 300);
  };

  const pushAll = () => {
    setObjects(prev => prev.map(obj => ({
      ...obj,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
    })));
  };

  const reset = () => {
    setIsPlaying(false);
    cancelAnimationFrame(animRef.current);
    setObjects([
      { id: 1, x: 200, y: 100, vx: 0, vy: 0, emoji: "🔧", name: "Wrench", mass: 0.5 },
      { id: 2, x: 350, y: 150, vx: 0, vy: 0, emoji: "📱", name: "Phone", mass: 0.2 },
      { id: 3, x: 150, y: 200, vx: 0, vy: 0, emoji: "🍎", name: "Apple", mass: 0.15 },
    ]);
  };

  const totalMomentum = objects.reduce((acc, o) => ({
    px: acc.px + o.mass * o.vx,
    py: acc.py + o.mass * o.vy,
  }), { px: 0, py: 0 });

  return (
    <SimCard title="🛸 ISS Microgravity Lab" description="Objects in the International Space Station float freely. Push them and watch — with NO friction or gravity, they travel in straight lines forever (Newton's First Law)!">
      <div style={{ background: "linear-gradient(135deg, #0c1929, #1a1a2e)", borderRadius: 12, padding: 0, minHeight: 280, position: "relative", overflow: "hidden", border: "2px solid #334155" }}>
        {/* ISS module walls */}
        <div style={{ position: "absolute", inset: 8, border: "2px dashed #334155", borderRadius: 8 }} />
        
        {/* Stars outside */}
        {[...Array(20)].map((_, i) => (
          <div key={i} style={{
            position: "absolute", width: 2, height: 2, background: "#fff",
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: 0.3, borderRadius: "50%",
          }} />
        ))}

        {/* Objects */}
        {objects.map(obj => (
          <div key={obj.id} style={{
            position: "absolute", left: obj.x - 15, top: obj.y - 15,
            width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, cursor: "pointer", transition: pushed === obj.id ? "transform 0.1s" : "none",
            transform: pushed === obj.id ? "scale(1.3)" : "scale(1)",
            filter: `drop-shadow(0 0 8px rgba(99,102,241,${Math.abs(obj.vx) + Math.abs(obj.vy) > 0.5 ? 0.5 : 0}))`,
          }} onClick={() => pushObject(obj.id)}>
            {obj.emoji}
          </div>
        ))}

        {/* Velocity trails */}
        {objects.map(obj => {
          const speed = Math.sqrt(obj.vx ** 2 + obj.vy ** 2);
          if (speed < 0.3) return null;
          const angle = Math.atan2(obj.vy, obj.vx) * 180 / Math.PI;
          return (
            <div key={`trail-${obj.id}`} style={{
              position: "absolute", left: obj.x, top: obj.y - 1,
              width: Math.min(speed * 15, 60), height: 2,
              background: `linear-gradient(90deg, transparent, #6366f1)`,
              transform: `rotate(${angle + 180}deg)`, transformOrigin: "left center",
              opacity: 0.6,
            }} />
          );
        })}

        {/* Zero-G indicator */}
        <div style={{
          position: "absolute", top: 10, right: 10, background: "#10b98120", padding: "4px 12px",
          borderRadius: 12, border: "1px solid #10b981", color: "#10b981", fontSize: 11, fontWeight: 700,
        }}>
          ZERO-G ⭕
        </div>

        {/* Click hint */}
        <div style={{
          position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)",
          color: "#64748b", fontSize: 11, fontWeight: 600,
        }}>
          Click any object to push it!
        </div>
      </div>

      <Telemetry items={[
        { label: "Wrench v", value: `${Math.sqrt(objects[0].vx ** 2 + objects[0].vy ** 2).toFixed(1)} m/s`, color: "#f59e0b" },
        { label: "Phone v", value: `${Math.sqrt(objects[1].vx ** 2 + objects[1].vy ** 2).toFixed(1)} m/s`, color: "#3b82f6" },
        { label: "Apple v", value: `${Math.sqrt(objects[2].vx ** 2 + objects[2].vy ** 2).toFixed(1)} m/s`, color: "#10b981" },
        { label: "Net Force", value: "0 N", color: "#10b981" },
      ]} />

      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
        <ControlButton onClick={() => { setIsPlaying(true); pushAll(); }} label="PUSH ALL" variant="primary" />
        <ControlButton onClick={() => setIsPlaying(!isPlaying)} label={isPlaying ? "PAUSE" : "START"} variant={isPlaying ? "danger" : "secondary"} />
        <ControlButton onClick={reset} label="RESET" variant="secondary" />
      </div>
    </SimCard>
  );
}
