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
 * 1. SKATEBOARD PUSH-OFF — Two skaters push apart
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_skateboard_push() {
  const [m1, setM1] = useState(60);
  const [m2, setM2] = useState(40);
  const [pushForce, setPushForce] = useState(200);
  const [isPlaying, setIsPlaying] = useState(false);
  const stateRef = useRef({ x1: 0, v1: 0, x2: 0, v2: 0, pushed: false });
  const [disp, setDisp] = useState({ x1: 0, v1: 0, x2: 0, v2: 0, pushed: false });
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);

  const step = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    const s = stateRef.current;

    if (!s.pushed) {
      // Apply impulse
      s.v1 = -pushForce / m1 * 0.1; // left
      s.v2 = pushForce / m2 * 0.1;  // right
      s.pushed = true;
    }

    s.x1 += s.v1 * dt * 60;
    s.x2 += s.v2 * dt * 60;

    // Slow down due to friction
    s.v1 *= 0.998;
    s.v2 *= 0.998;

    setDisp({ x1: s.x1, v1: s.v1, x2: s.x2, v2: s.v2, pushed: s.pushed });
    animRef.current = requestAnimationFrame(step);
  }, [m1, m2, pushForce]);

  useEffect(() => {
    if (isPlaying) { lastRef.current = 0; animRef.current = requestAnimationFrame(step); }
    else cancelAnimationFrame(animRef.current);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, step]);

  const reset = () => {
    setIsPlaying(false);
    cancelAnimationFrame(animRef.current);
    stateRef.current = { x1: 0, v1: 0, x2: 0, v2: 0, pushed: false };
    setDisp({ x1: 0, v1: 0, x2: 0, v2: 0, pushed: false });
  };

  const p1 = m1 * disp.v1;
  const p2 = m2 * disp.v2;
  const totalP = p1 + p2;

  return (
    <SimCard title="🛹 Skateboard Push-Off" description="Two skaters push apart from each other. The lighter skater moves FASTER — but both experience EQUAL and OPPOSITE forces (Newton's Third Law)!">
      <div style={{ background: "#020617", borderRadius: 12, padding: 20, minHeight: 180, position: "relative", overflow: "hidden" }}>
        {/* Ground */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, background: "#1e293b" }} />
        
        {/* Skater 1 (left, heavier) */}
        <div style={{
          position: "absolute", left: `calc(40% + ${disp.x1}px)`, bottom: 45,
          display: "flex", flexDirection: "column", alignItems: "center", transition: isPlaying ? "none" : "left 0.3s",
        }}>
          <div style={{ fontSize: 10, color: "#ef4444", fontWeight: 700, marginBottom: 4 }}>{m1}kg</div>
          <div style={{ fontSize: 40 }}>🧑‍🦰</div>
          <div style={{ fontSize: 20 }}>🛹</div>
          {disp.pushed && <div style={{ fontSize: 10, color: "#ef4444", fontWeight: 700, marginTop: 4 }}>← {Math.abs(disp.v1 * 10).toFixed(1)} m/s</div>}
        </div>

        {/* Push indicator */}
        {!disp.pushed && (
          <div style={{ position: "absolute", left: "50%", bottom: 80, transform: "translateX(-50%)", display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ color: "#ef4444", fontSize: 16 }}>←</span>
            <span style={{ color: "#f59e0b", fontWeight: 700, fontSize: 14 }}>PUSH {pushForce}N</span>
            <span style={{ color: "#10b981", fontSize: 16 }}>→</span>
          </div>
        )}

        {/* Skater 2 (right, lighter) */}
        <div style={{
          position: "absolute", left: `calc(55% + ${disp.x2}px)`, bottom: 45,
          display: "flex", flexDirection: "column", alignItems: "center", transition: isPlaying ? "none" : "left 0.3s",
        }}>
          <div style={{ fontSize: 10, color: "#10b981", fontWeight: 700, marginBottom: 4 }}>{m2}kg</div>
          <div style={{ fontSize: 40 }}>👩</div>
          <div style={{ fontSize: 20 }}>🛹</div>
          {disp.pushed && <div style={{ fontSize: 10, color: "#10b981", fontWeight: 700, marginTop: 4 }}>{Math.abs(disp.v2 * 10).toFixed(1)} m/s →</div>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 16 }}>
        <div style={{ background: "#0f172a", padding: 12, borderRadius: 10, border: "1px solid #1e293b" }}>
          <label style={{ color: "#ef4444", fontWeight: 700, fontSize: 11, display: "flex", justifyContent: "space-between" }}><span>Skater 1 Mass</span><span>{m1}kg</span></label>
          <input type="range" min={30} max={100} value={m1} onChange={e => { setM1(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#ef4444" }} />
        </div>
        <div style={{ background: "#0f172a", padding: 12, borderRadius: 10, border: "1px solid #1e293b" }}>
          <label style={{ color: "#10b981", fontWeight: 700, fontSize: 11, display: "flex", justifyContent: "space-between" }}><span>Skater 2 Mass</span><span>{m2}kg</span></label>
          <input type="range" min={30} max={100} value={m2} onChange={e => { setM2(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#10b981" }} />
        </div>
        <div style={{ background: "#0f172a", padding: 12, borderRadius: 10, border: "1px solid #1e293b" }}>
          <label style={{ color: "#f59e0b", fontWeight: 700, fontSize: 11, display: "flex", justifyContent: "space-between" }}><span>Push Force</span><span>{pushForce}N</span></label>
          <input type="range" min={50} max={500} value={pushForce} onChange={e => { setPushForce(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#f59e0b" }} />
        </div>
      </div>

      <Telemetry items={[
        { label: "Force on S1", value: `${pushForce} N ←`, color: "#ef4444" },
        { label: "Force on S2", value: `${pushForce} N →`, color: "#10b981" },
        { label: "p₁ + p₂", value: `${totalP.toFixed(1)} kg·m/s`, color: Math.abs(totalP) < 1 ? "#10b981" : "#f59e0b" },
        { label: "3rd Law", value: "F₁ = -F₂ ✓", color: "#6366f1" },
      ]} />

      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
        <ControlButton onClick={() => setIsPlaying(true)} label="PUSH!" variant="primary" />
        <ControlButton onClick={reset} label="RESET" variant="secondary" />
      </div>
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 2. ROWING A BOAT — Oar pushes water, boat moves forward
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_rowing_boat() {
  const [isRowing, setIsRowing] = useState(false);
  const [boatX, setBoatX] = useState(50);
  const [strokeCount, setStrokeCount] = useState(0);
  const [oarAngle, setOarAngle] = useState(0);
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);
  const boatRef = useRef({ x: 50, v: 0 });

  const step = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    const b = boatRef.current;

    if (isRowing) {
      setOarAngle(prev => {
        const next = prev + dt * 200;
        if (next > 60) {
          // Stroke complete — push boat forward
          b.v += 0.5;
          setStrokeCount(p => p + 1);
          setIsRowing(false);
          return 0;
        }
        return next;
      });
    }

    // Water drag
    b.v *= (1 - 0.3 * dt);
    b.x += b.v * dt * 20;
    if (b.x > 380) b.x = 380;
    setBoatX(b.x);

    animRef.current = requestAnimationFrame(step);
  }, [isRowing]);

  useEffect(() => {
    lastRef.current = 0;
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [step]);

  const doStroke = () => {
    if (!isRowing) {
      setIsRowing(true);
      setOarAngle(0);
    }
  };

  const reset = () => {
    cancelAnimationFrame(animRef.current);
    boatRef.current = { x: 50, v: 0 };
    setBoatX(50);
    setStrokeCount(0);
    setIsRowing(false);
    setOarAngle(0);
  };

  return (
    <SimCard title="🚣 Rowing — Third Law in Water" description="The oar pushes WATER BACKWARD → water pushes the BOAT FORWARD. Equal and opposite forces!">
      <div style={{ background: "linear-gradient(180deg, #0c4a6e 0%, #164e63 40%, #0e7490 100%)", borderRadius: 12, padding: 20, minHeight: 200, position: "relative", overflow: "hidden" }}>
        {/* Water waves */}
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{
            position: "absolute", bottom: 20 + i * 15, left: -50, right: -50, height: 2,
            background: `rgba(34,211,238,${0.1 + i * 0.02})`,
            transform: `translateX(${Math.sin(Date.now() / 1000 + i) * 10}px)`,
          }} />
        ))}

        {/* Boat */}
        <div style={{ position: "absolute", left: boatX, bottom: 60, transition: isRowing ? "none" : "left 0.1s" }}>
          <div style={{ fontSize: 50 }}>🚣</div>
          {/* Oar force arrow */}
          {isRowing && (
            <>
              <div style={{
                position: "absolute", right: -30, top: 10, color: "#ef4444", fontSize: 11, fontWeight: 700,
                transform: `rotate(${oarAngle / 3}deg)`,
              }}>
                ← Water pushed back
              </div>
              <div style={{
                position: "absolute", left: -20, top: 10, color: "#10b981", fontSize: 11, fontWeight: 700,
              }}>
                Boat pushed forward →
              </div>
            </>
          )}
        </div>

        {/* Water splash particles when rowing */}
        {isRowing && [...Array(5)].map((_, i) => (
          <div key={i} style={{
            position: "absolute", left: boatX + 60 + i * 8, bottom: 70 + Math.random() * 20,
            width: 4, height: 4, borderRadius: "50%", background: "#22d3ee",
            opacity: 0.6, transform: `translateX(${oarAngle * i * 0.5}px)`,
          }} />
        ))}

        {/* Force diagram */}
        <div style={{ position: "absolute", top: 15, right: 15, background: "#0f172a90", padding: 12, borderRadius: 10, border: "1px solid #1e293b60" }}>
          <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 6 }}>THIRD LAW PAIR</div>
          <div style={{ color: "#ef4444", fontSize: 11, fontWeight: 700 }}>F_oar→water = −F_water→boat</div>
          <div style={{ color: "#10b981", fontSize: 11, fontWeight: 700, marginTop: 2 }}>Action = −Reaction ✓</div>
        </div>
      </div>

      <Telemetry items={[
        { label: "Boat Speed", value: `${(boatRef.current.v * 2).toFixed(1)} m/s`, color: "#22d3ee" },
        { label: "Strokes", value: `${strokeCount}`, color: "#f59e0b" },
        { label: "Oar Force", value: isRowing ? "PUSHING" : "IDLE", color: isRowing ? "#10b981" : "#64748b" },
        { label: "Reaction", value: "EQUAL ↔", color: "#6366f1" },
      ]} />

      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
        <ControlButton onClick={doStroke} label="🚣 ROW!" variant="primary" />
        <ControlButton onClick={reset} label="RESET" variant="secondary" />
      </div>
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 3. FIRE EXTINGUISHER CART — Jet propulsion
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_fire_extinguisher_cart() {
  const [isActive, setIsActive] = useState(false);
  const [fuel, setFuel] = useState(100);
  const stateRef = useRef({ x: 50, v: 0 });
  const [disp, setDisp] = useState({ x: 50, v: 0 });
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);

  const step = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    const s = stateRef.current;

    if (isActive && fuel > 0) {
      s.v += 2 * dt; // thrust acceleration
      setFuel(prev => Math.max(0, prev - dt * 15));
    }

    // Friction
    s.v *= (1 - 0.1 * dt);
    s.x += s.v * dt * 40;
    if (s.x > 450) { s.x = 450; s.v = 0; }

    setDisp({ x: s.x, v: s.v });
    animRef.current = requestAnimationFrame(step);
  }, [isActive, fuel]);

  useEffect(() => {
    lastRef.current = 0;
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [step]);

  const reset = () => {
    stateRef.current = { x: 50, v: 0 };
    setDisp({ x: 50, v: 0 });
    setFuel(100);
    setIsActive(false);
  };

  return (
    <SimCard title="🧯 Fire Extinguisher Cart" description="A person on a cart sprays a fire extinguisher backward. The gas goes LEFT → the cart goes RIGHT. Newton's Third Law propulsion!">
      <div style={{ background: "#020617", borderRadius: 12, padding: 20, minHeight: 160, position: "relative", overflow: "hidden" }}>
        {/* Floor */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 30, background: "#1e293b" }} />
        
        {/* Cart + Person */}
        <div style={{ position: "absolute", left: disp.x, bottom: 35, display: "flex", alignItems: "flex-end", gap: 4 }}>
          {/* Gas spray (backward) */}
          {isActive && fuel > 0 && (
            <div style={{ display: "flex", gap: 2, marginRight: 4 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{
                  width: 6 + i * 2, height: 6 + i * 2, borderRadius: "50%",
                  background: `rgba(168,85,247,${0.5 - i * 0.07})`,
                  transform: `translateX(${-i * 12}px) translateY(${(Math.random() - 0.5) * 10}px)`,
                }} />
              ))}
            </div>
          )}
          <span style={{ fontSize: 12, position: "absolute", left: -20, top: 0, color: isActive ? "#a855f7" : "transparent", fontWeight: 700 }}>← gas</span>
          <div style={{ fontSize: 36 }}>🧑‍🔬</div>
          <div style={{ fontSize: 28, transform: "scaleX(-1)" }}>🧯</div>
          {isActive && fuel > 0 && <span style={{ fontSize: 12, position: "absolute", right: -40, top: 0, color: "#10b981", fontWeight: 700 }}>cart →</span>}
        </div>

        {/* Fuel bar */}
        <div style={{ position: "absolute", top: 15, right: 15, width: 120, background: "#1e293b", borderRadius: 8, padding: 6 }}>
          <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 4, fontWeight: 700 }}>FUEL: {fuel.toFixed(0)}%</div>
          <div style={{ height: 8, background: "#0f172a", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${fuel}%`, background: fuel > 30 ? "#10b981" : "#ef4444", borderRadius: 4, transition: "width 0.1s" }} />
          </div>
        </div>
      </div>

      <Telemetry items={[
        { label: "Cart Speed", value: `${(disp.v * 5).toFixed(1)} m/s`, color: "#22d3ee" },
        { label: "Thrust", value: isActive && fuel > 0 ? "ON" : "OFF", color: isActive && fuel > 0 ? "#10b981" : "#ef4444" },
        { label: "Gas Direction", value: "← BACKWARD", color: "#a855f7" },
        { label: "Cart Direction", value: "→ FORWARD", color: "#10b981" },
      ]} />

      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
        <ControlButton onClick={() => setIsActive(!isActive)} label={isActive ? "STOP SPRAY" : "SPRAY! 🧯"} variant={isActive ? "danger" : "primary"} />
        <ControlButton onClick={reset} label="RESET" variant="secondary" />
      </div>
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 4. NEWTON'S CRADLE ADVANCED — N-body collision
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_newtons_cradle_advanced() {
  const [pulled, setPulled] = useState(1); // how many balls pulled
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState<"pulled" | "swinging" | "hit">("pulled");
  const [swingAngle, setSwingAngle] = useState(30);
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);

  const balls = 5;

  useEffect(() => {
    if (!isPlaying) { cancelAnimationFrame(animRef.current); return; }
    
    let angle = 30;
    let omega = 0;
    let direction = -1; // -1 = swinging down, 1 = swinging up on other side
    let side = "left" as "left" | "right";
    
    const step = (t: number) => {
      if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
      const dt = Math.min((t - lastRef.current) / 1000, 0.05);
      lastRef.current = t;

      // Simple pendulum physics
      const g = 9.8;
      const L = 1;
      const alpha = -(g / L) * Math.sin(angle * Math.PI / 180);
      omega += alpha * dt * 50;
      angle += omega * dt * 50;
      omega *= 0.999; // damping

      if (side === "left" && angle < 0.5 && omega < 0) {
        side = "right";
        angle = 0;
        omega = -omega * 0.95;
      }
      if (side === "right" && angle < 0.5 && omega < 0) {
        side = "left";
        angle = 0;
        omega = -omega * 0.95;
      }

      setSwingAngle(side === "left" ? -Math.abs(angle) : Math.abs(angle));
      animRef.current = requestAnimationFrame(step);
    };

    lastRef.current = 0;
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying]);

  const reset = () => {
    setIsPlaying(false);
    setSwingAngle(30);
  };

  return (
    <SimCard title="🔮 Newton's Cradle — Momentum Transfer" description="Pull back ball(s) and release. Momentum and energy transfer through the chain — the SAME number of balls swing out on the other side!">
      <div style={{ background: "#020617", borderRadius: 12, padding: 20, minHeight: 250, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <svg width="360" height="220" viewBox="0 0 360 220">
          {/* Frame */}
          <rect x="40" y="10" width="280" height="8" rx="4" fill="#475569" />
          <rect x="50" y="10" width="4" height="30" fill="#475569" />
          <rect x="306" y="10" width="4" height="30" fill="#475569" />
          
          {/* Balls */}
          {Array.from({ length: balls }).map((_, i) => {
            const centerX = 120 + i * 30;
            const stringLength = 130;
            let angle = 0;
            
            if (isPlaying) {
              if (i < pulled && swingAngle < 0) angle = swingAngle;
              if (i >= balls - pulled && swingAngle > 0) angle = swingAngle;
            } else {
              if (i < pulled) angle = -30;
            }
            
            const angleRad = (angle * Math.PI) / 180;
            const ballX = centerX + Math.sin(angleRad) * stringLength;
            const ballY = 18 + Math.cos(angleRad) * stringLength;
            
            return (
              <g key={i}>
                <line x1={centerX} y1="18" x2={ballX} y2={ballY} stroke="#64748b" strokeWidth="1.5" />
                <circle cx={ballX} cy={ballY} r="14" fill="url(#cradleGrad)" stroke="#94a3b8" strokeWidth="1.5" />
                <circle cx={ballX - 4} cy={ballY - 4} r="3" fill="rgba(255,255,255,0.2)" />
              </g>
            );
          })}
          
          <defs>
            <radialGradient id="cradleGrad">
              <stop offset="20%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#94a3b8" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 16, background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #1e293b", justifyContent: "center", alignItems: "center" }}>
        <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 700 }}>Balls to pull:</span>
        {[1, 2, 3].map(n => (
          <button key={n} onClick={() => { setPulled(n); setIsPlaying(false); setSwingAngle(30); }} style={{
            width: 36, height: 36, borderRadius: "50%", border: pulled === n ? "2px solid #6366f1" : "1px solid #334155",
            background: pulled === n ? "#6366f120" : "#0f172a", color: pulled === n ? "#a5b4fc" : "#94a3b8",
            cursor: "pointer", fontWeight: 700, fontSize: 16,
          }}>{n}</button>
        ))}
      </div>

      <Telemetry items={[
        { label: "Balls Pulled", value: `${pulled}`, color: "#6366f1" },
        { label: "Balls Swing", value: `${pulled}`, color: "#10b981" },
        { label: "Energy", value: "CONSERVED ✓", color: "#f59e0b" },
        { label: "Momentum", value: "CONSERVED ✓", color: "#22d3ee" },
      ]} />

      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
        <ControlButton onClick={() => setIsPlaying(true)} label="RELEASE!" variant="primary" />
        <ControlButton onClick={reset} label="RESET" variant="secondary" />
      </div>
    </SimCard>
  );
}
