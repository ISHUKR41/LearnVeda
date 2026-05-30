"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

/* ── Shared helpers ────────────────────────────────────────────── */
function SimCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div style={{ width: "100%", background: "#0b1120", borderRadius: 16, padding: 24, marginTop: 32, marginBottom: 32, border: "1px solid #1e293b", boxShadow: "0 8px 32px rgba(0,0,0,0.4)", fontFamily: "Inter, system-ui, sans-serif", overflow: "hidden" }}>
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
      {items.map(it => (
        <div key={it.label} style={{ background: "#0f172a", borderRadius: 10, padding: "10px 14px", border: "1px solid #1e293b" }}>
          <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{it.label}</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: it.color, fontFamily: "JetBrains Mono, monospace" }}>{it.value}</div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 1. F=ma INTERACTIVE CALCULATOR
 * Drag sliders for Force & Mass → see acceleration + live graph
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_fma_calculator() {
  const [force, setForce] = useState(100);
  const [mass, setMass] = useState(10);
  const acceleration = mass > 0 ? force / mass : 0;
  const [history, setHistory] = useState<{ f: number; m: number; a: number }[]>([]);

  const addPoint = () => {
    setHistory(prev => [...prev.slice(-15), { f: force, m: mass, a: acceleration }]);
  };

  useEffect(() => { addPoint(); }, [force, mass]); // eslint-disable-line react-hooks/exhaustive-deps

  const maxA = Math.max(20, ...history.map(h => h.a));

  return (
    <SimCard title="📐 F = ma Interactive Calculator" description="Adjust Force and Mass to see acceleration change in real-time. The graph plots each data point!">
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {/* Triangle visualization */}
        <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <svg width="280" height="200" viewBox="0 0 280 200">
            <polygon points="140,20 30,180 250,180" fill="none" stroke="#6366f1" strokeWidth="3" />
            {/* F at top */}
            <text x="140" y="60" textAnchor="middle" fill="#ef4444" fontWeight="700" fontSize="22" fontFamily="JetBrains Mono">F = {force}N</text>
            {/* m at bottom left */}
            <text x="80" y="170" textAnchor="middle" fill="#3b82f6" fontWeight="700" fontSize="18" fontFamily="JetBrains Mono">m = {mass}kg</text>
            {/* a at bottom right */}
            <text x="200" y="170" textAnchor="middle" fill="#10b981" fontWeight="700" fontSize="18" fontFamily="JetBrains Mono">a = {acceleration.toFixed(2)}</text>
            {/* Lines */}
            <line x1="100" y1="100" x2="140" y2="80" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,3" />
            <line x1="180" y1="100" x2="140" y2="80" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,3" />
            <text x="140" y="120" textAnchor="middle" fill="#94a3b8" fontSize="14" fontFamily="Inter">F = m × a</text>
          </svg>

          {/* Sliders */}
          <div style={{ width: "100%", maxWidth: 300 }}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "flex", justifyContent: "space-between", color: "#ef4444", fontWeight: 700, fontSize: 13 }}>
                <span>Force (N)</span><span>{force} N</span>
              </label>
              <input type="range" min={0} max={500} value={force} onChange={e => setForce(+e.target.value)} style={{ width: "100%", accentColor: "#ef4444" }} />
            </div>
            <div>
              <label style={{ display: "flex", justifyContent: "space-between", color: "#3b82f6", fontWeight: 700, fontSize: 13 }}>
                <span>Mass (kg)</span><span>{mass} kg</span>
              </label>
              <input type="range" min={1} max={100} value={mass} onChange={e => setMass(+e.target.value)} style={{ width: "100%", accentColor: "#3b82f6" }} />
            </div>
          </div>
        </div>

        {/* Graph */}
        <div style={{ flex: 1, minWidth: 280, background: "#020617", borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8, fontWeight: 600 }}>ACCELERATION HISTORY</div>
          <svg width="100%" height="160" viewBox="0 0 300 160">
            {/* Grid */}
            {[0, 1, 2, 3, 4].map(i => (
              <g key={i}>
                <line x1="30" y1={30 + i * 30} x2="290" y2={30 + i * 30} stroke="#1e293b" strokeWidth="0.5" />
                <text x="25" y={34 + i * 30} textAnchor="end" fill="#475569" fontSize="9" fontFamily="JetBrains Mono">{(maxA - (maxA / 4) * i).toFixed(0)}</text>
              </g>
            ))}
            {/* Data points and line */}
            {history.map((h, i) => {
              const x = 30 + (i / Math.max(history.length - 1, 1)) * 260;
              const y = 150 - (h.a / maxA) * 120;
              const prevH = history[i - 1];
              return (
                <g key={i}>
                  {prevH && (
                    <line x1={30 + ((i - 1) / Math.max(history.length - 1, 1)) * 260} y1={150 - (prevH.a / maxA) * 120} x2={x} y2={y} stroke="#10b981" strokeWidth="2" />
                  )}
                  <circle cx={x} cy={y} r="4" fill="#10b981" stroke="#020617" strokeWidth="2" />
                </g>
              );
            })}
            <text x="160" y="155" textAnchor="middle" fill="#475569" fontSize="10">Data Points →</text>
          </svg>
        </div>
      </div>

      <Telemetry items={[
        { label: "Force (F)", value: `${force} N`, color: "#ef4444" },
        { label: "Mass (m)", value: `${mass} kg`, color: "#3b82f6" },
        { label: "Acceleration (a)", value: `${acceleration.toFixed(2)} m/s²`, color: "#10b981" },
        { label: "Formula", value: "F = m × a", color: "#6366f1" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 2. RAMP RACE — Same force, different masses
 * Two blocks race down a ramp — lighter one accelerates faster
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_ramp_race() {
  const [mass1, setMass1] = useState(5);
  const [mass2, setMass2] = useState(20);
  const [isRacing, setIsRacing] = useState(false);
  const [positions, setPositions] = useState([0, 0]);
  const stateRef = useRef([{ x: 0, v: 0 }, { x: 0, v: 0 }]);
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);
  const angle = 30;
  const g = 9.8;
  const sin30 = Math.sin((angle * Math.PI) / 180);

  const step = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;

    const newStates = stateRef.current.map((s) => {
      const a = g * sin30; // acceleration is independent of mass on frictionless ramp!
      const v = s.v + a * dt;
      const x = Math.min(s.x + v * dt * 15, 350);
      return { x, v };
    });
    stateRef.current = newStates;
    setPositions(newStates.map(s => s.x));

    if (newStates.some(s => s.x < 350)) {
      animRef.current = requestAnimationFrame(step);
    }
  }, [g, sin30]);

  useEffect(() => {
    if (isRacing) { lastRef.current = 0; animRef.current = requestAnimationFrame(step); }
    else cancelAnimationFrame(animRef.current);
    return () => cancelAnimationFrame(animRef.current);
  }, [isRacing, step]);

  const reset = () => { setIsRacing(false); stateRef.current = [{ x: 0, v: 0 }, { x: 0, v: 0 }]; setPositions([0, 0]); };

  return (
    <SimCard title="🏁 Ramp Race — Mass vs Acceleration" description="Two blocks with different masses slide down a frictionless ramp. Newton's surprise: they arrive together! (F=ma, but a=g⋅sinθ for all masses)">
      <div style={{ background: "#020617", borderRadius: 12, padding: 20, minHeight: 250 }}>
        <svg width="100%" height="220" viewBox="0 0 500 220">
          {/* Ramp */}
          <polygon points="50,200 450,200 50,60" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          <text x="40" y="130" fill="#475569" fontSize="14" fontWeight="700" transform="rotate(-20, 40, 130)">θ = {angle}°</text>

          {/* Block 1 */}
          <g transform={`translate(${60 + positions[0] * 0.8}, ${185 - positions[0] * 0.35})`}>
            <rect x="-15" y="-20" width="30" height="20" rx="4" fill="#ef4444" stroke="#f87171" strokeWidth="2" transform={`rotate(-20)`} />
            <text x="0" y="-24" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="700">{mass1}kg</text>
          </g>

          {/* Block 2 */}
          <g transform={`translate(${60 + positions[1] * 0.8}, ${165 - positions[1] * 0.35})`}>
            <rect x="-18" y="-24" width="36" height="24" rx="4" fill="#3b82f6" stroke="#60a5fa" strokeWidth="2" transform={`rotate(-20)`} />
            <text x="0" y="-28" textAnchor="middle" fill="#3b82f6" fontSize="11" fontWeight="700">{mass2}kg</text>
          </g>

          {/* Finish line */}
          <line x1="420" y1="50" x2="420" y2="200" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,4" />
          <text x="430" y="125" fill="#f59e0b" fontSize="12" fontWeight="700">FINISH</text>
        </svg>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <div style={{ background: "#0f172a", padding: 14, borderRadius: 10, border: "1px solid #1e293b" }}>
          <label style={{ display: "flex", justifyContent: "space-between", color: "#ef4444", fontWeight: 700, fontSize: 13 }}>
            <span>Block A Mass</span><span>{mass1} kg</span>
          </label>
          <input type="range" min={1} max={50} value={mass1} onChange={e => { setMass1(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#ef4444" }} />
        </div>
        <div style={{ background: "#0f172a", padding: 14, borderRadius: 10, border: "1px solid #1e293b" }}>
          <label style={{ display: "flex", justifyContent: "space-between", color: "#3b82f6", fontWeight: 700, fontSize: 13 }}>
            <span>Block B Mass</span><span>{mass2} kg</span>
          </label>
          <input type="range" min={1} max={50} value={mass2} onChange={e => { setMass2(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#3b82f6" }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
        <button onClick={() => { reset(); setTimeout(() => setIsRacing(true), 50); }} style={{ padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, background: "#10b981", color: "#0f172a" }}>START RACE!</button>
        <button onClick={reset} style={{ padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, background: "#1e293b", color: "#cbd5e1" }}>RESET</button>
      </div>

      <Telemetry items={[
        { label: "Block A", value: `${mass1}kg → a=${(g * sin30).toFixed(1)}m/s²`, color: "#ef4444" },
        { label: "Block B", value: `${mass2}kg → a=${(g * sin30).toFixed(1)}m/s²`, color: "#3b82f6" },
        { label: "Key Insight", value: "Same accel!", color: "#10b981" },
        { label: "Why?", value: "a = g⋅sinθ", color: "#6366f1" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 3. BRAKING DISTANCE — F=ma in real life
 * Cars at different speeds — shows how stopping distance varies
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_braking_distance() {
  const [speed, setSpeed] = useState(60);
  const brakeForce = 8000; // N
  const carMass = 1000; // kg
  const a = brakeForce / carMass; // deceleration m/s²
  const speedMs = speed / 3.6;
  const brakingDist = (speedMs * speedMs) / (2 * a);
  const brakeTime = speedMs / a;

  const speeds = [30, 60, 90, 120];
  const maxDist = (120 / 3.6) ** 2 / (2 * a);

  return (
    <SimCard title="🚗 Braking Distance — F=ma Applied" description="How does speed affect stopping distance? Doubling speed quadruples the distance! (d = v²/2a)">
      <div style={{ background: "#020617", borderRadius: 12, padding: 20 }}>
        {speeds.map(s => {
          const vMs = s / 3.6;
          const d = (vMs * vMs) / (2 * a);
          const pct = (d / maxDist) * 100;
          const isCurrent = s === speed;
          return (
            <div key={s} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ color: isCurrent ? "#f59e0b" : "#94a3b8", fontWeight: 700, fontSize: 14, width: 80 }}>{s} km/h</span>
                <span style={{ color: "#64748b", fontSize: 11, fontFamily: "JetBrains Mono" }}>d = {d.toFixed(1)}m | t = {(vMs / a).toFixed(1)}s</span>
              </div>
              <div style={{ height: 28, background: "#1e293b", borderRadius: 8, position: "relative", overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${pct}%`, borderRadius: 8, transition: "width 0.5s",
                  background: s <= 30 ? "linear-gradient(90deg, #10b981, #34d399)" : s <= 60 ? "linear-gradient(90deg, #f59e0b, #fbbf24)" : s <= 90 ? "linear-gradient(90deg, #f97316, #fb923c)" : "linear-gradient(90deg, #ef4444, #f87171)",
                  display: "flex", alignItems: "center", paddingLeft: 8,
                }}>
                  <span style={{ fontSize: 20 }}>🚗</span>
                  <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, marginLeft: 8 }}>{d.toFixed(1)}m</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 16, background: "#0f172a", padding: 16, borderRadius: 12, border: "1px solid #1e293b" }}>
        <label style={{ color: "#f59e0b", fontWeight: 700, fontSize: 13, display: "flex", justifyContent: "space-between" }}>
          <span>Select Speed</span><span>{speed} km/h</span>
        </label>
        <input type="range" min={10} max={120} step={10} value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: "100%", accentColor: "#f59e0b" }} />
      </div>

      <Telemetry items={[
        { label: "Speed", value: `${speed} km/h`, color: "#f59e0b" },
        { label: "Braking Dist", value: `${brakingDist.toFixed(1)} m`, color: speed > 60 ? "#ef4444" : "#10b981" },
        { label: "Brake Time", value: `${brakeTime.toFixed(1)} s`, color: "#3b82f6" },
        { label: "Formula", value: "d = v²/2a", color: "#6366f1" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 4. FORCE vs ACCELERATION GRAPH — Real-time plotting
 * Keep mass constant, vary force → see linear relationship
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_force_acceleration_graph() {
  const [mass, setMass] = useState(10);
  const [dataPoints, setDataPoints] = useState<{ f: number; a: number }[]>([]);

  const addPoint = (f: number) => {
    const a = f / mass;
    setDataPoints(prev => [...prev, { f, a }]);
  };

  const clearPoints = () => setDataPoints([]);
  const maxF = Math.max(100, ...dataPoints.map(d => d.f));
  const maxA = Math.max(10, ...dataPoints.map(d => d.a));

  return (
    <SimCard title="📊 Force vs Acceleration — Live Graph" description="Click to add data points at different forces. See the straight line emerge — proving F is directly proportional to a!">
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {/* Graph */}
        <div style={{ flex: 2, minWidth: 300, background: "#020617", borderRadius: 12, padding: 16 }}>
          <svg width="100%" height="260" viewBox="0 0 400 260">
            {/* Axes */}
            <line x1="50" y1="230" x2="380" y2="230" stroke="#475569" strokeWidth="2" />
            <line x1="50" y1="230" x2="50" y2="20" stroke="#475569" strokeWidth="2" />
            <text x="215" y="255" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="600">Force (N) →</text>
            <text x="15" y="125" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="600" transform="rotate(-90, 15, 125)">Accel (m/s²) →</text>

            {/* Grid */}
            {[0, 1, 2, 3, 4, 5].map(i => {
              const y = 230 - (i / 5) * 200;
              return <g key={i}><line x1="50" y1={y} x2="380" y2={y} stroke="#1e293b" strokeWidth="0.5" /><text x="45" y={y + 4} textAnchor="end" fill="#475569" fontSize="9">{(maxA * i / 5).toFixed(0)}</text></g>;
            })}
            {[0, 1, 2, 3, 4, 5].map(i => {
              const x = 50 + (i / 5) * 330;
              return <g key={i}><line x1={x} y1="230" x2={x} y2="20" stroke="#1e293b" strokeWidth="0.5" /><text x={x} y="245" textAnchor="middle" fill="#475569" fontSize="9">{(maxF * i / 5).toFixed(0)}</text></g>;
            })}

            {/* Theoretical line */}
            <line x1="50" y1="230" x2={50 + 330} y2={230 - 200} stroke="#6366f130" strokeWidth="2" strokeDasharray="6,4" />

            {/* Data points */}
            {dataPoints.map((d, i) => {
              const x = 50 + (d.f / maxF) * 330;
              const y = 230 - (d.a / maxA) * 200;
              const prev = dataPoints[i - 1];
              return (
                <g key={i}>
                  {prev && <line x1={50 + (prev.f / maxF) * 330} y1={230 - (prev.a / maxA) * 200} x2={x} y2={y} stroke="#10b981" strokeWidth="2" />}
                  <circle cx={x} cy={y} r="5" fill="#10b981" stroke="#020617" strokeWidth="2" />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Controls */}
        <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "#0f172a", padding: 14, borderRadius: 10, border: "1px solid #1e293b" }}>
            <label style={{ display: "flex", justifyContent: "space-between", color: "#3b82f6", fontWeight: 700, fontSize: 13 }}>
              <span>Mass (constant)</span><span>{mass} kg</span>
            </label>
            <input type="range" min={1} max={50} value={mass} onChange={e => { setMass(+e.target.value); clearPoints(); }} style={{ width: "100%", accentColor: "#3b82f6" }} />
          </div>

          <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginBottom: 4 }}>TAP TO ADD POINTS:</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {[10, 20, 40, 60, 80, 100, 150, 200].map(f => (
              <button key={f} onClick={() => addPoint(f)} style={{
                padding: "8px", borderRadius: 8, border: "1px solid #1e293b", background: "#0f172a",
                color: "#10b981", fontWeight: 700, fontSize: 12, cursor: "pointer",
              }}>{f} N</button>
            ))}
          </div>

          <button onClick={clearPoints} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #ef4444", background: "transparent", color: "#ef4444", fontWeight: 700, fontSize: 12, cursor: "pointer", marginTop: 8 }}>Clear Points</button>
        </div>
      </div>

      <Telemetry items={[
        { label: "Data Points", value: `${dataPoints.length}`, color: "#10b981" },
        { label: "Mass", value: `${mass} kg`, color: "#3b82f6" },
        { label: "Relationship", value: "a = F/m", color: "#6366f1" },
        { label: "Graph Type", value: "Linear ↗", color: "#f59e0b" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 5. MASS COMPARISON — Same force on different masses
 * Feather vs Brick under same force — shows inverse relationship
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_mass_comparison() {
  const [force, setForce] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const objects = [
    { name: "Feather", mass: 0.01, emoji: "🪶", color: "#e2e8f0" },
    { name: "Ball", mass: 0.5, emoji: "⚽", color: "#10b981" },
    { name: "Brick", mass: 5, emoji: "🧱", color: "#f59e0b" },
    { name: "Car", mass: 1000, emoji: "🚗", color: "#ef4444" },
  ];

  const [positions, setPositions] = useState(objects.map(() => 0));
  const posRef = useRef(objects.map(() => ({ x: 0, v: 0 })));
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);

  const step = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    const newPos = posRef.current.map((s, i) => {
      const a = force / objects[i].mass;
      const cappedA = Math.min(a, 500); // cap for visual sanity
      const v = s.v + cappedA * dt;
      const x = Math.min(s.x + v * dt * 2, 500);
      return { x, v };
    });
    posRef.current = newPos;
    setPositions(newPos.map(p => p.x));
    if (newPos.some(p => p.x < 500)) animRef.current = requestAnimationFrame(step);
  }, [force, objects]);

  useEffect(() => {
    if (isPlaying) { lastRef.current = 0; animRef.current = requestAnimationFrame(step); }
    else cancelAnimationFrame(animRef.current);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, step]);

  const reset = () => { setIsPlaying(false); posRef.current = objects.map(() => ({ x: 0, v: 0 })); setPositions(objects.map(() => 0)); };

  return (
    <SimCard title="🪶 vs 🧱 Mass Comparison — Same Force" description="Apply the SAME force to objects of different mass. Lighter objects accelerate dramatically faster!">
      <div style={{ background: "#020617", borderRadius: 12, padding: 20 }}>
        {objects.map((obj, i) => {
          const a = Math.min(force / obj.mass, 10000);
          return (
            <div key={obj.name} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 18 }}>{obj.emoji}</span>
                <span style={{ color: obj.color, fontWeight: 700, fontSize: 13, width: 60 }}>{obj.name}</span>
                <span style={{ color: "#64748b", fontSize: 11, fontFamily: "JetBrains Mono" }}>m={obj.mass}kg | a={a > 100 ? a.toExponential(1) : a.toFixed(1)}m/s²</span>
              </div>
              <div style={{ height: 32, background: "#1e293b", borderRadius: 8, position: "relative", overflow: "hidden" }}>
                <div style={{
                  position: "absolute", left: Math.min(positions[i], 460), top: 2, width: 28, height: 28,
                  background: `linear-gradient(135deg, ${obj.color}, ${obj.color}88)`, borderRadius: 6,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                  boxShadow: `0 0 12px ${obj.color}40`, transition: isPlaying ? "none" : "left 0.3s",
                }}>{obj.emoji}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 16, background: "#0f172a", padding: 16, borderRadius: 12, border: "1px solid #1e293b" }}>
        <label style={{ color: "#6366f1", fontWeight: 700, fontSize: 13, display: "flex", justifyContent: "space-between" }}>
          <span>Applied Force (same for all)</span><span>{force} N</span>
        </label>
        <input type="range" min={1} max={100} value={force} onChange={e => { setForce(+e.target.value); if (!isPlaying) reset(); }} style={{ width: "100%", accentColor: "#6366f1" }} />
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
        <button onClick={() => { reset(); setTimeout(() => setIsPlaying(true), 50); }} style={{ padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, background: "#10b981", color: "#0f172a" }}>APPLY FORCE!</button>
        <button onClick={reset} style={{ padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, background: "#1e293b", color: "#cbd5e1" }}>RESET</button>
      </div>

      <Telemetry items={[
        { label: "Force", value: `${force} N`, color: "#6366f1" },
        { label: "Feather a", value: `${(force / 0.01).toFixed(0)} m/s²`, color: "#e2e8f0" },
        { label: "Brick a", value: `${(force / 5).toFixed(1)} m/s²`, color: "#f59e0b" },
        { label: "Ratio", value: `${(5 / 0.01).toFixed(0)}x`, color: "#ef4444" },
      ]} />
    </SimCard>
  );
}
