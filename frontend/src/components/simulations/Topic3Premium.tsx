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
 * 1. MULTI-BODY PULLEY SYSTEM — Connected masses showing F=ma
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_pulley_system() {
  const [m1, setM1] = useState(10);
  const [m2, setM2] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const stateRef = useRef({ y: 0, v: 0 });
  const [display, setDisplay] = useState({ y: 0, v: 0, a: 0, tension: 0 });
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);
  const g = 9.8;

  const acceleration = ((m1 - m2) * g) / (m1 + m2);
  const tension = (2 * m1 * m2 * g) / (m1 + m2);

  const step = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    const s = stateRef.current;
    const a = ((m1 - m2) * g) / (m1 + m2);
    s.v += a * dt;
    s.y += s.v * dt * 20;
    if (s.y > 120) { s.y = 120; s.v = 0; }
    if (s.y < -120) { s.y = -120; s.v = 0; }
    const T = (2 * m1 * m2 * g) / (m1 + m2);
    setDisplay({ y: s.y, v: s.v, a, tension: T });
    animRef.current = requestAnimationFrame(step);
  }, [m1, m2, g]);

  useEffect(() => {
    if (isPlaying) { lastRef.current = 0; animRef.current = requestAnimationFrame(step); }
    else cancelAnimationFrame(animRef.current);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, step]);

  const reset = () => {
    setIsPlaying(false);
    cancelAnimationFrame(animRef.current);
    stateRef.current = { y: 0, v: 0 };
    setDisplay({ y: 0, v: 0, a: 0, tension: 0 });
  };

  return (
    <SimCard title="⚙️ Atwood Machine — Multi-Body F=ma" description="Two masses connected by a rope over a pulley. The heavier side accelerates down. Shows F=ma applied to a system!">
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 1, background: "#020617", borderRadius: 12, padding: 20, minHeight: 320, position: "relative" }}>
          <svg width="100%" height="300" viewBox="0 0 400 300">
            {/* Pulley */}
            <circle cx="200" cy="40" r="25" fill="none" stroke="#6366f1" strokeWidth="3" />
            <circle cx="200" cy="40" r="5" fill="#6366f1" />
            {/* Support */}
            <rect x="180" y="5" width="40" height="12" rx="4" fill="#475569" />
            
            {/* Left rope */}
            <line x1="175" y1="40" x2="175" y2={140 - display.y} stroke="#94a3b8" strokeWidth="2" />
            {/* Right rope */}
            <line x1="225" y1="40" x2="225" y2={140 + display.y} stroke="#94a3b8" strokeWidth="2" />
            
            {/* Left mass (m1 - heavier) */}
            <rect x="150" y={140 - display.y} width="50" height={30 + m1} rx="8" fill="url(#m1Grad)" stroke="#ef4444" strokeWidth="2" />
            <text x="175" y={160 - display.y + m1 / 2} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700" fontFamily="JetBrains Mono">{m1}kg</text>
            
            {/* Right mass (m2 - lighter) */}
            <rect x="200" y={140 + display.y} width="50" height={30 + m2} rx="8" fill="url(#m2Grad)" stroke="#3b82f6" strokeWidth="2" />
            <text x="225" y={160 + display.y + m2 / 2} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700" fontFamily="JetBrains Mono">{m2}kg</text>
            
            {/* Force arrows on m1 */}
            <line x1="145" y1={155 - display.y} x2="145" y2={155 - display.y + Math.min(m1 * 2, 40)} stroke="#ef4444" strokeWidth="2" />
            <text x="120" y={170 - display.y + Math.min(m1 * 2, 40)} fill="#ef4444" fontSize="10" fontWeight="700">{(m1 * g).toFixed(0)}N ↓</text>
            
            {/* Tension label */}
            <text x="200" y="80" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="700">T = {tension.toFixed(1)}N</text>
            
            <defs>
              <linearGradient id="m1Grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#ef4444" /><stop offset="100%" stopColor="#dc2626" /></linearGradient>
              <linearGradient id="m2Grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#2563eb" /></linearGradient>
            </defs>
          </svg>
        </div>
        <div style={{ width: 200, display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ color: "#ef4444", fontWeight: 700, fontSize: 12, display: "flex", justifyContent: "space-between" }}><span>Mass 1 (Left)</span><span>{m1} kg</span></label>
            <input type="range" min={1} max={30} value={m1} onChange={e => { setM1(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#ef4444" }} />
          </div>
          <div>
            <label style={{ color: "#3b82f6", fontWeight: 700, fontSize: 12, display: "flex", justifyContent: "space-between" }}><span>Mass 2 (Right)</span><span>{m2} kg</span></label>
            <input type="range" min={1} max={30} value={m2} onChange={e => { setM2(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#3b82f6" }} />
          </div>
          <div style={{ background: "#0f172a", padding: 12, borderRadius: 10, border: "1px solid #1e293b" }}>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>FORMULA</div>
            <div style={{ color: "#6366f1", fontFamily: "JetBrains Mono", fontSize: 13, fontWeight: 700 }}>a = (m₁-m₂)g / (m₁+m₂)</div>
            <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 4 }}>a = ({m1}-{m2})×9.8 / ({m1}+{m2})</div>
            <div style={{ color: "#f59e0b", fontSize: 14, fontWeight: 700, marginTop: 4 }}>a = {acceleration.toFixed(2)} m/s²</div>
          </div>
        </div>
      </div>
      <Telemetry items={[
        { label: "Acceleration", value: `${display.a.toFixed(2)} m/s²`, color: "#f59e0b" },
        { label: "Velocity", value: `${display.v.toFixed(2)} m/s`, color: "#22d3ee" },
        { label: "Tension", value: `${display.tension.toFixed(1)} N`, color: "#a78bfa" },
        { label: "System", value: m1 === m2 ? "BALANCED" : m1 > m2 ? "LEFT FALLS" : "RIGHT FALLS", color: m1 === m2 ? "#10b981" : "#f59e0b" },
      ]} />
      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
        <ControlButton onClick={() => setIsPlaying(!isPlaying)} label={isPlaying ? "PAUSE" : "RELEASE"} variant={isPlaying ? "danger" : "primary"} />
        <ControlButton onClick={reset} label="RESET" variant="secondary" />
      </div>
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 2. ELEVATOR SCALE — Person on scale in accelerating elevator
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_elevator_fma() {
  const [mass] = useState(60);
  const [accel, setAccel] = useState(0);
  const g = 9.8;
  const realWeight = mass * g;
  const apparentWeight = mass * (g + accel);
  const ratio = apparentWeight / realWeight;

  const scaleColor = ratio > 1.1 ? "#ef4444" : ratio < 0.9 ? "#3b82f6" : "#10b981";
  const feeling = ratio > 1.1 ? "HEAVIER" : ratio < 0.1 ? "WEIGHTLESS!" : ratio < 0.9 ? "LIGHTER" : "NORMAL";

  return (
    <SimCard title="⚖️ Elevator F=ma Scale" description="A person stands on a scale inside an elevator. As the elevator accelerates up or down, the apparent weight changes because F = m(g + a)!">
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 1, background: "#020617", borderRadius: 12, padding: 20, minHeight: 300, position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          {/* Elevator walls */}
          <div style={{ position: "absolute", left: 30, top: 10, bottom: 10, width: 3, background: "#334155" }} />
          <div style={{ position: "absolute", right: 30, top: 10, bottom: 10, width: 3, background: "#334155" }} />
          <div style={{ position: "absolute", top: 10, left: 30, right: 30, height: 3, background: "#334155" }} />
          
          {/* Person */}
          <div style={{ fontSize: 64, marginBottom: -10, filter: `brightness(${ratio > 1.1 ? 0.7 : ratio < 0.5 ? 1.3 : 1})`, transition: "filter 0.3s" }}>🧍</div>
          
          {/* Scale */}
          <div style={{
            width: 140, height: 50, background: `linear-gradient(135deg, ${scaleColor}, ${scaleColor}cc)`,
            borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 20px ${scaleColor}30`, transition: "all 0.3s", border: `2px solid ${scaleColor}`,
          }}>
            <span style={{ color: "#fff", fontWeight: 700, fontFamily: "JetBrains Mono", fontSize: 20 }}>{apparentWeight.toFixed(1)}</span>
            <span style={{ color: "#ffffffaa", fontSize: 10, fontWeight: 600 }}>Newtons</span>
          </div>
          
          {/* Direction indicator */}
          {accel !== 0 && (
            <div style={{ position: "absolute", top: 30, right: 50, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 30, color: "#f59e0b" }}>{accel > 0 ? "⬆" : "⬇"}</span>
              <span style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700, fontFamily: "JetBrains Mono" }}>a = {accel.toFixed(1)} m/s²</span>
            </div>
          )}
          
          {/* Free body diagram mini */}
          <div style={{ position: "absolute", bottom: 20, left: 50, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <div style={{ width: 3, height: Math.min(ratio * 30, 60), background: "#3b82f6", borderRadius: 2 }} />
            <span style={{ fontSize: 9, color: "#3b82f6", fontWeight: 700 }}>N = {apparentWeight.toFixed(0)}N</span>
            <div style={{ width: 20, height: 20, background: "#6366f1", borderRadius: 4 }} />
            <div style={{ width: 3, height: 30, background: "#ef4444", borderRadius: 2 }} />
            <span style={{ fontSize: 9, color: "#ef4444", fontWeight: 700 }}>W = {realWeight.toFixed(0)}N</span>
          </div>
        </div>

        <div style={{ width: 200, display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ color: "#f59e0b", fontWeight: 700, fontSize: 12, display: "flex", justifyContent: "space-between" }}>
              <span>Elevator Accel</span><span>{accel.toFixed(1)} m/s²</span>
            </label>
            <input type="range" min={-9.8} max={10} step={0.1} value={accel} onChange={e => setAccel(+e.target.value)} style={{ width: "100%", accentColor: "#f59e0b" }} />
          </div>
          
          {/* Preset buttons */}
          {[
            { label: "🛑 At Rest", a: 0 },
            { label: "⬆ Going Up", a: 3 },
            { label: "⬇ Going Down", a: -3 },
            { label: "💀 Free Fall!", a: -9.8 },
          ].map(p => (
            <button key={p.label} onClick={() => setAccel(p.a)} style={{
              padding: "8px 12px", borderRadius: 8, border: accel === p.a ? "2px solid #6366f1" : "1px solid #1e293b",
              background: accel === p.a ? "#6366f120" : "#0f172a", color: accel === p.a ? "#a5b4fc" : "#94a3b8",
              cursor: "pointer", fontWeight: 600, fontSize: 12, textAlign: "left",
            }}>
              {p.label}
            </button>
          ))}

          <div style={{ background: "#0f172a", padding: 12, borderRadius: 10, border: "1px solid #1e293b" }}>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>APPARENT WEIGHT FORMULA</div>
            <div style={{ color: "#6366f1", fontFamily: "JetBrains Mono", fontSize: 12, fontWeight: 700 }}>W_app = m × (g + a)</div>
            <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 4 }}>{mass} × ({g} + {accel.toFixed(1)}) = {apparentWeight.toFixed(1)}N</div>
          </div>
        </div>
      </div>

      <Telemetry items={[
        { label: "Real Weight", value: `${realWeight.toFixed(0)} N`, color: "#94a3b8" },
        { label: "Apparent Weight", value: `${apparentWeight.toFixed(1)} N`, color: scaleColor },
        { label: "Feeling", value: feeling, color: scaleColor },
        { label: "Scale Ratio", value: `${(ratio * 100).toFixed(0)}%`, color: ratio === 1 ? "#10b981" : "#f59e0b" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 3. DRAG RACING — Two cars with different mass/force 
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_drag_race() {
  const [car1Force, setCar1Force] = useState(5000);
  const [car1Mass, setCar1Mass] = useState(1000);
  const [car2Force, setCar2Force] = useState(4000);
  const [car2Mass, setCar2Mass] = useState(800);
  const [isPlaying, setIsPlaying] = useState(false);
  const stateRef = useRef({ x1: 0, v1: 0, x2: 0, v2: 0, t: 0 });
  const [disp, setDisp] = useState({ x1: 0, v1: 0, x2: 0, v2: 0, t: 0 });
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);

  const a1 = car1Force / car1Mass;
  const a2 = car2Force / car2Mass;
  const trackLength = 400;

  const step = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    const s = stateRef.current;
    
    const acc1 = car1Force / car1Mass;
    const acc2 = car2Force / car2Mass;
    
    if (s.x1 < trackLength) { s.v1 += acc1 * dt; s.x1 = Math.min(s.x1 + s.v1 * dt * 0.3, trackLength); }
    if (s.x2 < trackLength) { s.v2 += acc2 * dt; s.x2 = Math.min(s.x2 + s.v2 * dt * 0.3, trackLength); }
    s.t += dt;
    
    setDisp({ x1: s.x1, v1: s.v1, x2: s.x2, v2: s.v2, t: s.t });
    
    if (s.x1 < trackLength || s.x2 < trackLength) animRef.current = requestAnimationFrame(step);
  }, [car1Force, car1Mass, car2Force, car2Mass]);

  useEffect(() => {
    if (isPlaying) { lastRef.current = 0; animRef.current = requestAnimationFrame(step); }
    else cancelAnimationFrame(animRef.current);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, step]);

  const reset = () => {
    setIsPlaying(false);
    cancelAnimationFrame(animRef.current);
    stateRef.current = { x1: 0, v1: 0, x2: 0, v2: 0, t: 0 };
    setDisp({ x1: 0, v1: 0, x2: 0, v2: 0, t: 0 });
  };

  const winner = disp.x1 >= trackLength && disp.x2 >= trackLength
    ? (disp.x1 >= trackLength ? "CAR 1 🏆" : "CAR 2 🏆")
    : disp.x1 >= trackLength ? "CAR 1 WINS! 🏆" : disp.x2 >= trackLength ? "CAR 2 WINS! 🏆" : "RACING...";

  return (
    <SimCard title="🏁 Drag Race — F=ma in Action" description="Two cars with different force and mass race head-to-head. Higher F/m ratio = higher acceleration = WINS the race!">
      <div style={{ background: "#020617", borderRadius: 12, padding: 20, minHeight: 150 }}>
        {/* Track 1 */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ color: "#ef4444", fontWeight: 700, fontSize: 12 }}>🔴 Car 1</span>
            <span style={{ color: "#64748b", fontSize: 11, fontFamily: "JetBrains Mono" }}>F={car1Force}N m={car1Mass}kg a={a1.toFixed(1)}m/s²</span>
          </div>
          <div style={{ height: 40, background: "#1e293b20", borderRadius: 8, position: "relative", overflow: "hidden", border: "1px solid #1e293b" }}>
            <div style={{ position: "absolute", right: 5, top: 0, bottom: 0, width: 3, background: "#f59e0b" }} />
            <div style={{ position: "absolute", left: disp.x1, top: 5, fontSize: 28, transition: isPlaying ? "none" : "left 0.3s" }}>🏎️</div>
          </div>
        </div>
        {/* Track 2 */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ color: "#3b82f6", fontWeight: 700, fontSize: 12 }}>🔵 Car 2</span>
            <span style={{ color: "#64748b", fontSize: 11, fontFamily: "JetBrains Mono" }}>F={car2Force}N m={car2Mass}kg a={a2.toFixed(1)}m/s²</span>
          </div>
          <div style={{ height: 40, background: "#1e293b20", borderRadius: 8, position: "relative", overflow: "hidden", border: "1px solid #1e293b" }}>
            <div style={{ position: "absolute", right: 5, top: 0, bottom: 0, width: 3, background: "#f59e0b" }} />
            <div style={{ position: "absolute", left: disp.x2, top: 5, fontSize: 28, transition: isPlaying ? "none" : "left 0.3s" }}>🏎️</div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <div style={{ background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #ef444430" }}>
          <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 8 }}>🔴 CAR 1</div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ color: "#ef4444", fontSize: 11, display: "flex", justifyContent: "space-between" }}><span>Force</span><span>{car1Force}N</span></label>
            <input type="range" min={1000} max={10000} step={100} value={car1Force} onChange={e => { setCar1Force(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#ef4444" }} />
          </div>
          <div>
            <label style={{ color: "#ef4444", fontSize: 11, display: "flex", justifyContent: "space-between" }}><span>Mass</span><span>{car1Mass}kg</span></label>
            <input type="range" min={500} max={3000} step={50} value={car1Mass} onChange={e => { setCar1Mass(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#ef4444" }} />
          </div>
        </div>
        <div style={{ background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #3b82f630" }}>
          <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, marginBottom: 8 }}>🔵 CAR 2</div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ color: "#3b82f6", fontSize: 11, display: "flex", justifyContent: "space-between" }}><span>Force</span><span>{car2Force}N</span></label>
            <input type="range" min={1000} max={10000} step={100} value={car2Force} onChange={e => { setCar2Force(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#3b82f6" }} />
          </div>
          <div>
            <label style={{ color: "#3b82f6", fontSize: 11, display: "flex", justifyContent: "space-between" }}><span>Mass</span><span>{car2Mass}kg</span></label>
            <input type="range" min={500} max={3000} step={50} value={car2Mass} onChange={e => { setCar2Mass(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#3b82f6" }} />
          </div>
        </div>
      </div>

      <Telemetry items={[
        { label: "Car 1 Speed", value: `${disp.v1.toFixed(1)} m/s`, color: "#ef4444" },
        { label: "Car 2 Speed", value: `${disp.v2.toFixed(1)} m/s`, color: "#3b82f6" },
        { label: "Time", value: `${disp.t.toFixed(1)} s`, color: "#f59e0b" },
        { label: "Leader", value: winner, color: "#10b981" },
      ]} />

      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
        <ControlButton onClick={() => setIsPlaying(true)} label="🏁 GO!" variant="primary" />
        <ControlButton onClick={() => setIsPlaying(false)} label="PAUSE" variant="danger" />
        <ControlButton onClick={reset} label="RESET" variant="secondary" />
      </div>
    </SimCard>
  );
}
