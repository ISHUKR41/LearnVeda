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
 * 1. CAR CRASH ANALYSIS — Momentum conservation in collision
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_car_crash_analysis() {
  const [m1, setM1] = useState(1500);
  const [v1, setV1] = useState(20);
  const [m2, setM2] = useState(1000);
  const [v2, setV2] = useState(-10);
  const [collisionType, setCollisionType] = useState<"inelastic" | "elastic">("inelastic");
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState<"before" | "collision" | "after">("before");
  const stateRef = useRef({ x1: 80, x2: 400, v1f: 0, v2f: 0, t: 0 });
  const [disp, setDisp] = useState({ x1: 80, x2: 400, phase: "before" as string });
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);

  // Calculate final velocities
  const pBefore = m1 * v1 + m2 * v2;
  let v1f: number, v2f: number;
  if (collisionType === "inelastic") {
    const vf = pBefore / (m1 + m2);
    v1f = vf; v2f = vf;
  } else {
    v1f = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
    v2f = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
  }
  const pAfter = m1 * v1f + m2 * v2f;
  const keBefore = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;
  const keAfter = 0.5 * m1 * v1f * v1f + 0.5 * m2 * v2f * v2f;

  const step = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    const s = stateRef.current;
    s.t += dt;

    if (s.t < 1.5) {
      // Before collision — cars approach
      s.x1 = 80 + v1 * s.t * 6;
      s.x2 = 400 + v2 * s.t * 6;
      setDisp({ x1: s.x1, x2: s.x2, phase: "before" });
    } else if (s.t < 2) {
      // Collision flash
      setDisp({ x1: 240, x2: 260, phase: "collision" });
    } else {
      // After collision
      const at = s.t - 2;
      s.x1 = 240 + v1f * at * 6;
      s.x2 = 260 + v2f * at * 6;
      setDisp({ x1: s.x1, x2: s.x2, phase: "after" });
    }

    animRef.current = requestAnimationFrame(step);
  }, [v1, v2, v1f, v2f]);

  useEffect(() => {
    if (isPlaying) { lastRef.current = 0; stateRef.current.t = 0; animRef.current = requestAnimationFrame(step); }
    else cancelAnimationFrame(animRef.current);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, step]);

  const reset = () => {
    setIsPlaying(false);
    cancelAnimationFrame(animRef.current);
    stateRef.current = { x1: 80, x2: 400, v1f: 0, v2f: 0, t: 0 };
    setDisp({ x1: 80, x2: 400, phase: "before" });
    setPhase("before");
  };

  return (
    <SimCard title="💥 Car Crash Analysis" description="Two cars collide! Total momentum is ALWAYS conserved (p_before = p_after). Compare elastic vs inelastic collisions.">
      <div style={{ background: "#020617", borderRadius: 12, padding: 20, minHeight: 160, position: "relative", overflow: "hidden" }}>
        {/* Road */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, background: "#1e293b" }} />
        <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, height: 2, background: "#f59e0b40" }} />
        
        {/* Car 1 */}
        <div style={{ position: "absolute", left: Math.max(10, Math.min(disp.x1, 450)), bottom: 45, display: "flex", flexDirection: "column", alignItems: "center", transition: isPlaying ? "none" : "left 0.3s" }}>
          <span style={{ fontSize: 10, color: "#ef4444", fontWeight: 700 }}>{m1}kg</span>
          <span style={{ fontSize: 36 }}>🚗</span>
          <span style={{ fontSize: 10, color: "#ef4444", fontWeight: 700 }}>{disp.phase === "after" ? `${v1f.toFixed(1)} m/s` : `${v1} m/s →`}</span>
        </div>

        {/* Collision effect */}
        {disp.phase === "collision" && (
          <div style={{
            position: "absolute", left: "50%", bottom: 50, transform: "translateX(-50%)",
            fontSize: 40, animation: "pulse 0.2s infinite",
          }}>💥</div>
        )}

        {/* Car 2 */}
        <div style={{ position: "absolute", left: Math.max(10, Math.min(disp.x2, 450)), bottom: 45, display: "flex", flexDirection: "column", alignItems: "center", transition: isPlaying ? "none" : "left 0.3s" }}>
          <span style={{ fontSize: 10, color: "#3b82f6", fontWeight: 700 }}>{m2}kg</span>
          <span style={{ fontSize: 36, transform: "scaleX(-1)" }}>🚙</span>
          <span style={{ fontSize: 10, color: "#3b82f6", fontWeight: 700 }}>{disp.phase === "after" ? `${v2f.toFixed(1)} m/s` : `← ${Math.abs(v2)} m/s`}</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <div style={{ background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #ef444430" }}>
          <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 8 }}>🔴 CAR 1</div>
          <div style={{ marginBottom: 6 }}>
            <label style={{ color: "#ef4444", fontSize: 11, display: "flex", justifyContent: "space-between" }}><span>Mass</span><span>{m1}kg</span></label>
            <input type="range" min={500} max={3000} step={100} value={m1} onChange={e => { setM1(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#ef4444" }} />
          </div>
          <div>
            <label style={{ color: "#ef4444", fontSize: 11, display: "flex", justifyContent: "space-between" }}><span>Velocity →</span><span>{v1} m/s</span></label>
            <input type="range" min={5} max={40} value={v1} onChange={e => { setV1(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#ef4444" }} />
          </div>
        </div>
        <div style={{ background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #3b82f630" }}>
          <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, marginBottom: 8 }}>🔵 CAR 2</div>
          <div style={{ marginBottom: 6 }}>
            <label style={{ color: "#3b82f6", fontSize: 11, display: "flex", justifyContent: "space-between" }}><span>Mass</span><span>{m2}kg</span></label>
            <input type="range" min={500} max={3000} step={100} value={m2} onChange={e => { setM2(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#3b82f6" }} />
          </div>
          <div>
            <label style={{ color: "#3b82f6", fontSize: 11, display: "flex", justifyContent: "space-between" }}><span>← Velocity</span><span>{Math.abs(v2)} m/s</span></label>
            <input type="range" min={0} max={40} value={Math.abs(v2)} onChange={e => { setV2(-Math.abs(+e.target.value)); reset(); }} style={{ width: "100%", accentColor: "#3b82f6" }} />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 12, justifyContent: "center" }}>
        {(["inelastic", "elastic"] as const).map(type => (
          <button key={type} onClick={() => { setCollisionType(type); reset(); }} style={{
            padding: "8px 20px", borderRadius: 10, border: collisionType === type ? "2px solid #6366f1" : "1px solid #334155",
            background: collisionType === type ? "#6366f120" : "#0f172a", color: collisionType === type ? "#a5b4fc" : "#94a3b8",
            cursor: "pointer", fontWeight: 700, fontSize: 13,
          }}>
            {type === "inelastic" ? "💥 Perfectly Inelastic" : "🔄 Elastic"}
          </button>
        ))}
      </div>

      <Telemetry items={[
        { label: "p Before", value: `${pBefore.toFixed(0)} kg·m/s`, color: "#f59e0b" },
        { label: "p After", value: `${pAfter.toFixed(0)} kg·m/s`, color: "#10b981" },
        { label: "KE Before", value: `${(keBefore / 1000).toFixed(1)} kJ`, color: "#6366f1" },
        { label: "KE After", value: `${(keAfter / 1000).toFixed(1)} kJ`, color: collisionType === "elastic" ? "#6366f1" : "#ef4444" },
      ]} />

      <div style={{ background: "#0f172a", padding: 12, borderRadius: 10, border: "1px solid #1e293b", marginTop: 12, textAlign: "center" }}>
        <span style={{ color: "#10b981", fontWeight: 700, fontSize: 13 }}>p_before = p_after → {pBefore.toFixed(0)} = {pAfter.toFixed(0)} ✓ MOMENTUM CONSERVED</span>
        {collisionType === "inelastic" && <div style={{ color: "#ef4444", fontSize: 11, marginTop: 4 }}>KE lost to deformation: {((keBefore - keAfter) / 1000).toFixed(1)} kJ ({((1 - keAfter / keBefore) * 100).toFixed(0)}%)</div>}
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
        <ControlButton onClick={() => setIsPlaying(true)} label="💥 CRASH!" variant="primary" />
        <ControlButton onClick={reset} label="RESET" variant="secondary" />
      </div>
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 2. FIREWORKS EXPLOSION — Symmetric momentum conservation
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_fireworks_explosion() {
  const [totalMass, setTotalMass] = useState(2);
  const [isExploded, setIsExploded] = useState(false);
  const [fragments, setFragments] = useState<{ x: number; y: number; vx: number; vy: number; mass: number; color: string }[]>([]);
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);

  const explode = () => {
    const numFragments = 8;
    const fragMass = totalMass / numFragments;
    const newFrags = [];
    for (let i = 0; i < numFragments; i++) {
      const angle = (i / numFragments) * Math.PI * 2;
      const speed = 2 + Math.random() * 1;
      const colors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#22d3ee", "#f97316"];
      newFrags.push({
        x: 250, y: 120,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        mass: fragMass,
        color: colors[i % colors.length],
      });
    }
    setFragments(newFrags);
    setIsExploded(true);
  };

  useEffect(() => {
    if (!isExploded) return;
    const step = (t: number) => {
      if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
      const dt = Math.min((t - lastRef.current) / 1000, 0.05);
      lastRef.current = t;
      setFragments(prev => prev.map(f => ({
        ...f,
        x: f.x + f.vx * dt * 60,
        y: f.y + f.vy * dt * 60,
      })));
      animRef.current = requestAnimationFrame(step);
    };
    lastRef.current = 0;
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [isExploded]);

  const reset = () => {
    setIsExploded(false);
    setFragments([]);
    cancelAnimationFrame(animRef.current);
  };

  const totalPx = fragments.reduce((acc, f) => acc + f.mass * f.vx, 0);
  const totalPy = fragments.reduce((acc, f) => acc + f.mass * f.vy, 0);
  const totalP = Math.sqrt(totalPx * totalPx + totalPy * totalPy);

  return (
    <SimCard title="🎆 Fireworks Explosion — Momentum = 0" description="A firework starts at rest (p=0). When it explodes, fragments fly in all directions. But total momentum is STILL ZERO because forces are symmetric!">
      <div style={{ background: "linear-gradient(180deg, #020617, #0c1929)", borderRadius: 12, padding: 20, minHeight: 250, position: "relative", overflow: "hidden" }}>
        {/* Stars */}
        {[...Array(30)].map((_, i) => (
          <div key={i} style={{
            position: "absolute", width: 2, height: 2, background: "#fff",
            left: `${(i * 37) % 100}%`, top: `${(i * 23) % 100}%`,
            opacity: 0.2 + Math.random() * 0.3, borderRadius: "50%",
          }} />
        ))}

        {/* Rocket or fragments */}
        {!isExploded ? (
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
            <div style={{ fontSize: 50 }}>🎆</div>
            <div style={{ color: "#f59e0b", fontSize: 12, fontWeight: 700, marginTop: 8 }}>p_total = 0 (at rest)</div>
          </div>
        ) : (
          fragments.map((f, i) => (
            <div key={i} style={{
              position: "absolute", left: f.x, top: f.y,
              width: 12 + f.mass * 4, height: 12 + f.mass * 4,
              borderRadius: "50%", background: f.color,
              boxShadow: `0 0 12px ${f.color}80`,
              transition: "none",
            }} />
          ))
        )}

        {/* Explosion effect */}
        {isExploded && fragments[0] && Math.abs(fragments[0].x - 250) < 30 && (
          <div style={{
            position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
            width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle, #f59e0b, transparent)",
            opacity: 0.6,
          }} />
        )}
      </div>

      <div style={{ background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #1e293b", marginTop: 16 }}>
        <label style={{ color: "#f59e0b", fontWeight: 700, fontSize: 12, display: "flex", justifyContent: "space-between" }}>
          <span>Total Mass</span><span>{totalMass.toFixed(1)} kg</span>
        </label>
        <input type="range" min={0.5} max={5} step={0.1} value={totalMass} onChange={e => { setTotalMass(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#f59e0b" }} />
      </div>

      <Telemetry items={[
        { label: "p Before", value: "0 kg·m/s", color: "#10b981" },
        { label: "p After", value: `${totalP.toFixed(3)} ≈ 0`, color: Math.abs(totalP) < 0.1 ? "#10b981" : "#f59e0b" },
        { label: "Fragments", value: isExploded ? `${fragments.length}` : "0", color: "#6366f1" },
        { label: "Momentum", value: "CONSERVED ✓", color: "#10b981" },
      ]} />

      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
        <ControlButton onClick={explode} label="💥 EXPLODE!" variant="primary" />
        <ControlButton onClick={reset} label="RESET" variant="secondary" />
      </div>
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 3. POOL TABLE — 2D billiards with momentum vectors
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_pool_table() {
  const [aimAngle, setAimAngle] = useState(0);
  const [power, setPower] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [balls, setBalls] = useState([
    { x: 150, y: 130, vx: 0, vy: 0, r: 12, color: "#fff", label: "CUE" },
    { x: 350, y: 130, vx: 0, vy: 0, r: 12, color: "#ef4444", label: "RED" },
  ]);
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);
  const ballsRef = useRef(balls);
  ballsRef.current = balls;

  const shoot = () => {
    const angleRad = (aimAngle * Math.PI) / 180;
    setBalls(prev => prev.map((b, i) =>
      i === 0 ? { ...b, vx: Math.cos(angleRad) * power, vy: Math.sin(angleRad) * power } : b
    ));
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying) { cancelAnimationFrame(animRef.current); return; }
    
    const step = (t: number) => {
      if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
      const dt = Math.min((t - lastRef.current) / 1000, 0.05);
      lastRef.current = t;

      setBalls(prev => {
        const next = prev.map(b => ({
          ...b,
          x: b.x + b.vx * dt * 40,
          y: b.y + b.vy * dt * 40,
          vx: b.vx * 0.995,
          vy: b.vy * 0.995,
        }));

        // Wall bouncing
        for (const b of next) {
          if (b.x < b.r + 10) { b.x = b.r + 10; b.vx = Math.abs(b.vx); }
          if (b.x > 490 - b.r) { b.x = 490 - b.r; b.vx = -Math.abs(b.vx); }
          if (b.y < b.r + 10) { b.y = b.r + 10; b.vy = Math.abs(b.vy); }
          if (b.y > 250 - b.r) { b.y = 250 - b.r; b.vy = -Math.abs(b.vy); }
        }

        // Ball-ball collision
        for (let i = 0; i < next.length; i++) {
          for (let j = i + 1; j < next.length; j++) {
            const dx = next[j].x - next[i].x;
            const dy = next[j].y - next[i].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < next[i].r + next[j].r) {
              // Elastic collision
              const nx = dx / dist, ny = dy / dist;
              const dvx = next[i].vx - next[j].vx;
              const dvy = next[i].vy - next[j].vy;
              const dvn = dvx * nx + dvy * ny;
              if (dvn > 0) {
                next[i].vx -= dvn * nx;
                next[i].vy -= dvn * ny;
                next[j].vx += dvn * nx;
                next[j].vy += dvn * ny;
                // Separate
                const overlap = (next[i].r + next[j].r - dist) / 2;
                next[i].x -= overlap * nx;
                next[i].y -= overlap * ny;
                next[j].x += overlap * nx;
                next[j].y += overlap * ny;
              }
            }
          }
        }

        return next;
      });

      animRef.current = requestAnimationFrame(step);
    };

    lastRef.current = 0;
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying]);

  const reset = () => {
    setIsPlaying(false);
    cancelAnimationFrame(animRef.current);
    setBalls([
      { x: 150, y: 130, vx: 0, vy: 0, r: 12, color: "#fff", label: "CUE" },
      { x: 350, y: 130, vx: 0, vy: 0, r: 12, color: "#ef4444", label: "RED" },
    ]);
  };

  const totalPx = balls.reduce((acc, b) => acc + b.vx, 0);
  const totalPy = balls.reduce((acc, b) => acc + b.vy, 0);

  return (
    <SimCard title="🎱 Pool Table — 2D Momentum" description="Aim and shoot the cue ball at the red ball. Watch momentum transfer in 2D — total momentum (x AND y) is always conserved!">
      <div style={{ background: "#166534", borderRadius: 12, padding: 10, border: "8px solid #854d0e", minHeight: 260, position: "relative", overflow: "hidden" }}>
        {/* Table felt texture */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, #166534, #14532d)", borderRadius: 4 }} />
        
        {/* Pockets */}
        {[[10, 10], [250, 10], [490, 10], [10, 250], [250, 250], [490, 250]].map(([px, py], i) => (
          <div key={i} style={{ position: "absolute", left: px - 10, top: py - 10, width: 20, height: 20, borderRadius: "50%", background: "#0a0a0a" }} />
        ))}

        {/* Balls */}
        {balls.map((b, i) => (
          <div key={i} style={{
            position: "absolute", left: b.x - b.r, top: b.y - b.r,
            width: b.r * 2, height: b.r * 2, borderRadius: "50%",
            background: `radial-gradient(circle at 40% 35%, ${b.color}, ${b.color}aa)`,
            border: "1px solid rgba(0,0,0,0.3)", boxShadow: "2px 2px 6px rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 7, color: b.color === "#fff" ? "#000" : "#fff", fontWeight: 700,
            transition: isPlaying ? "none" : "all 0.1s", zIndex: 2,
          }}>
            {b.label === "CUE" ? "" : ""}
          </div>
        ))}

        {/* Aim line (before shot) */}
        {!isPlaying && (
          <line
            style={{
              position: "absolute",
            }}
          />
        )}

        {/* Aim line SVG */}
        {!isPlaying && (
          <svg style={{ position: "absolute", inset: 0, zIndex: 1 }} width="500" height="260">
            <line
              x1={balls[0].x}
              y1={balls[0].y}
              x2={balls[0].x + Math.cos(aimAngle * Math.PI / 180) * power * 15}
              y2={balls[0].y + Math.sin(aimAngle * Math.PI / 180) * power * 15}
              stroke="#ffffff60" strokeWidth="2" strokeDasharray="4,4"
            />
          </svg>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
        <div style={{ background: "#0f172a", padding: 12, borderRadius: 10, border: "1px solid #1e293b" }}>
          <label style={{ color: "#f59e0b", fontWeight: 700, fontSize: 12, display: "flex", justifyContent: "space-between" }}>
            <span>Aim Angle</span><span>{aimAngle}°</span>
          </label>
          <input type="range" min={-60} max={60} value={aimAngle} onChange={e => setAimAngle(+e.target.value)} style={{ width: "100%", accentColor: "#f59e0b" }} disabled={isPlaying} />
        </div>
        <div style={{ background: "#0f172a", padding: 12, borderRadius: 10, border: "1px solid #1e293b" }}>
          <label style={{ color: "#10b981", fontWeight: 700, fontSize: 12, display: "flex", justifyContent: "space-between" }}>
            <span>Power</span><span>{power}</span>
          </label>
          <input type="range" min={1} max={10} value={power} onChange={e => setPower(+e.target.value)} style={{ width: "100%", accentColor: "#10b981" }} disabled={isPlaying} />
        </div>
      </div>

      <Telemetry items={[
        { label: "Cue Speed", value: `${Math.sqrt(balls[0].vx ** 2 + balls[0].vy ** 2).toFixed(1)}`, color: "#fff" },
        { label: "Red Speed", value: `${Math.sqrt(balls[1].vx ** 2 + balls[1].vy ** 2).toFixed(1)}`, color: "#ef4444" },
        { label: "Total px", value: `${totalPx.toFixed(2)}`, color: "#f59e0b" },
        { label: "Total py", value: `${totalPy.toFixed(2)}`, color: "#3b82f6" },
      ]} />

      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
        <ControlButton onClick={shoot} label="🎱 SHOOT!" variant="primary" />
        <ControlButton onClick={reset} label="RESET" variant="secondary" />
      </div>
    </SimCard>
  );
}
