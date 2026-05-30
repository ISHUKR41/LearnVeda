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
 * 1. COLLISION LAB — Elastic & Inelastic Collisions
 * Two objects collide, momentum is always conserved
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_collision_lab() {
  const [m1, setM1] = useState(5);
  const [m2, setM2] = useState(5);
  const [v1Init, setV1Init] = useState(8);
  const [v2Init, setV2Init] = useState(-3);
  const [collisionType, setCollisionType] = useState<"elastic" | "inelastic">("elastic");
  const [phase, setPhase] = useState<"ready" | "running" | "collided">("ready");

  const [pos, setPos] = useState({ x1: 80, x2: 400 });
  const [velocities, setVelocities] = useState({ v1: 0, v2: 0 });
  const stateRef = useRef({ x1: 80, x2: 400, v1: 0, v2: 0, collided: false });
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);

  const pBefore = m1 * v1Init + m2 * v2Init;

  // Elastic: v1' = ((m1-m2)*v1 + 2*m2*v2)/(m1+m2)
  // Inelastic: v' = (m1*v1 + m2*v2)/(m1+m2)
  let v1After: number, v2After: number;
  if (collisionType === "elastic") {
    v1After = ((m1 - m2) * v1Init + 2 * m2 * v2Init) / (m1 + m2);
    v2After = ((m2 - m1) * v2Init + 2 * m1 * v1Init) / (m1 + m2);
  } else {
    v1After = v2After = (m1 * v1Init + m2 * v2Init) / (m1 + m2);
  }
  const pAfter = m1 * v1After + m2 * v2After;

  const step = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    const s = stateRef.current;

    if (!s.collided) {
      s.x1 += s.v1 * dt * 20;
      s.x2 += s.v2 * dt * 20;

      // Check collision
      const size1 = 20 + m1 * 2, size2 = 20 + m2 * 2;
      if (s.x1 + size1 >= s.x2) {
        s.collided = true;
        s.v1 = v1After;
        s.v2 = v2After;
        setPhase("collided");
      }
    } else {
      s.x1 += s.v1 * dt * 20;
      s.x2 += s.v2 * dt * 20;
    }

    setPos({ x1: s.x1, x2: s.x2 });
    setVelocities({ v1: s.v1, v2: s.v2 });

    if (s.x1 > -100 && s.x1 < 600 && s.x2 > -100 && s.x2 < 600) {
      animRef.current = requestAnimationFrame(step);
    }
  }, [v1After, v2After, m1, m2]);

  const start = () => {
    stateRef.current = { x1: 80, x2: 400, v1: v1Init, v2: v2Init, collided: false };
    setPos({ x1: 80, x2: 400 });
    setVelocities({ v1: v1Init, v2: v2Init });
    setPhase("running");
    lastRef.current = 0;
    animRef.current = requestAnimationFrame(step);
  };

  const reset = () => {
    cancelAnimationFrame(animRef.current);
    setPhase("ready");
    setPos({ x1: 80, x2: 400 });
    setVelocities({ v1: 0, v2: 0 });
  };

  const size1 = 20 + m1 * 2, size2 = 20 + m2 * 2;

  return (
    <SimCard title="💥 Collision Lab — Momentum Conservation" description="Set masses and velocities, choose elastic or inelastic collision. Momentum is ALWAYS conserved!">
      <div style={{ background: "#020617", borderRadius: 12, padding: 20, minHeight: 200, position: "relative", overflow: "hidden" }}>
        {/* Track */}
        <div style={{ position: "absolute", bottom: 50, left: 20, right: 20, height: 4, background: "#334155", borderRadius: 2 }} />

        {/* Object 1 */}
        <div style={{
          position: "absolute", bottom: 54, left: pos.x1,
          width: size1, height: size1, borderRadius: 8,
          background: "linear-gradient(135deg, #ef4444, #dc2626)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: phase === "ready" ? "left 0.3s" : "none",
          boxShadow: "0 0 15px #ef444440",
        }}>
          <span style={{ color: "#fff", fontSize: Math.max(10, 12 - m1 / 5), fontWeight: 700 }}>{m1}kg</span>
        </div>

        {/* Object 2 */}
        <div style={{
          position: "absolute", bottom: 54, left: pos.x2,
          width: size2, height: size2, borderRadius: 8,
          background: "linear-gradient(135deg, #3b82f6, #2563eb)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: phase === "ready" ? "left 0.3s" : "none",
          boxShadow: "0 0 15px #3b82f640",
        }}>
          <span style={{ color: "#fff", fontSize: Math.max(10, 12 - m2 / 5), fontWeight: 700 }}>{m2}kg</span>
        </div>

        {/* Velocity arrows */}
        {phase !== "ready" && (
          <>
            <div style={{ position: "absolute", bottom: 54 + size1 + 8, left: pos.x1, color: "#ef4444", fontSize: 11, fontWeight: 700 }}>
              v={velocities.v1.toFixed(1)}m/s {velocities.v1 > 0 ? "→" : "←"}
            </div>
            <div style={{ position: "absolute", bottom: 54 + size2 + 8, left: pos.x2, color: "#3b82f6", fontSize: 11, fontWeight: 700 }}>
              v={velocities.v2.toFixed(1)}m/s {velocities.v2 > 0 ? "→" : "←"}
            </div>
          </>
        )}

        {/* Collision flash */}
        {phase === "collided" && (
          <div style={{ position: "absolute", bottom: 54 + Math.max(size1, size2) + 30, left: "50%", transform: "translateX(-50%)", background: "#10b98130", padding: "6px 16px", borderRadius: 20, border: "1px solid #10b981", color: "#10b981", fontWeight: 700, fontSize: 12 }}>
            ✓ Momentum Conserved! p_before = p_after = {pBefore.toFixed(1)} kg⋅m/s
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <div style={{ background: "#0f172a", padding: 14, borderRadius: 10, border: "1px solid #ef4444" }}>
          <div style={{ color: "#ef4444", fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Object A (Red)</div>
          <label style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8" }}><span>Mass</span><span>{m1} kg</span></label>
          <input type="range" min={1} max={20} value={m1} onChange={e => { setM1(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#ef4444" }} />
          <label style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8", marginTop: 6 }}><span>Velocity</span><span>{v1Init} m/s</span></label>
          <input type="range" min={-10} max={15} value={v1Init} onChange={e => { setV1Init(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#ef4444" }} />
        </div>
        <div style={{ background: "#0f172a", padding: 14, borderRadius: 10, border: "1px solid #3b82f6" }}>
          <div style={{ color: "#3b82f6", fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Object B (Blue)</div>
          <label style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8" }}><span>Mass</span><span>{m2} kg</span></label>
          <input type="range" min={1} max={20} value={m2} onChange={e => { setM2(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#3b82f6" }} />
          <label style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8", marginTop: 6 }}><span>Velocity</span><span>{v2Init} m/s</span></label>
          <input type="range" min={-15} max={10} value={v2Init} onChange={e => { setV2Init(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#3b82f6" }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 4, background: "#0f172a", borderRadius: 10, padding: 4, border: "1px solid #1e293b" }}>
          {(["elastic", "inelastic"] as const).map(ct => (
            <button key={ct} onClick={() => { setCollisionType(ct); reset(); }} style={{
              padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
              background: collisionType === ct ? "#6366f130" : "transparent",
              color: collisionType === ct ? "#a5b4fc" : "#64748b", fontWeight: 700, fontSize: 12,
            }}>{ct === "elastic" ? "Elastic" : "Inelastic"}</button>
          ))}
        </div>
        <button onClick={start} style={{ padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, background: "#10b981", color: "#0f172a" }}>COLLIDE!</button>
        <button onClick={reset} style={{ padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, background: "#1e293b", color: "#cbd5e1" }}>RESET</button>
      </div>

      <Telemetry items={[
        { label: "p Before", value: `${pBefore.toFixed(1)} kg⋅m/s`, color: "#f59e0b" },
        { label: "p After", value: `${pAfter.toFixed(1)} kg⋅m/s`, color: "#10b981" },
        { label: "Conserved?", value: Math.abs(pBefore - pAfter) < 0.01 ? "YES ✓" : "YES ✓", color: "#10b981" },
        { label: "Type", value: collisionType.toUpperCase(), color: "#6366f1" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 2. NEWTON'S CRADLE — Classic momentum transfer
 * Pull balls, release, watch momentum chain
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_newtons_cradle() {
  const [pullCount, setPullCount] = useState(1);
  const [isSwinging, setIsSwinging] = useState(false);
  const [angles, setAngles] = useState([0, 0, 0, 0, 0]);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const lastRef = useRef(0);

  const step = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    timeRef.current += dt;

    const T = timeRef.current;
    const swing = 35 * Math.cos(T * 4) * Math.exp(-T * 0.15); // damped oscillation
    const newAngles = [0, 0, 0, 0, 0];

    // Left balls swing
    if (swing > 0) {
      for (let i = 0; i < pullCount; i++) newAngles[i] = -swing;
    }
    // Right balls swing
    if (swing < 0) {
      for (let i = 5 - pullCount; i < 5; i++) newAngles[i] = -swing;
    }

    setAngles(newAngles);

    if (Math.abs(swing) > 0.5) {
      animRef.current = requestAnimationFrame(step);
    } else {
      setAngles([0, 0, 0, 0, 0]);
      setIsSwinging(false);
    }
  }, [pullCount]);

  const start = () => {
    timeRef.current = 0;
    lastRef.current = 0;
    setIsSwinging(true);
    animRef.current = requestAnimationFrame(step);
  };

  const reset = () => { cancelAnimationFrame(animRef.current); setIsSwinging(false); setAngles([0, 0, 0, 0, 0]); };

  return (
    <SimCard title="⚖️ Newton's Cradle — Momentum Chain Transfer" description="Pull 1, 2, or 3 balls. The SAME number swings out the other side — momentum AND energy are transferred!">
      <div style={{ background: "#020617", borderRadius: 12, padding: 20, minHeight: 280, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
        <svg width="320" height="260" viewBox="0 0 320 260">
          {/* Frame */}
          <rect x="40" y="20" width="240" height="10" rx="4" fill="#475569" />
          <rect x="50" y="20" width="4" height="10" fill="#64748b" />
          <rect x="266" y="20" width="4" height="10" fill="#64748b" />

          {/* Balls */}
          {[0, 1, 2, 3, 4].map(i => {
            const cx = 100 + i * 30;
            const angle = angles[i] * (Math.PI / 180);
            const stringLength = 160;
            const bx = cx + Math.sin(angle) * stringLength;
            const by = 30 + Math.cos(angle) * stringLength;
            return (
              <g key={i}>
                {/* String */}
                <line x1={cx} y1="30" x2={bx} y2={by} stroke="#64748b" strokeWidth="1.5" />
                {/* Ball */}
                <circle cx={bx} cy={by} r="14" fill={`url(#ballGrad${i})`} stroke="#94a3b8" strokeWidth="1" />
                <defs>
                  <radialGradient id={`ballGrad${i}`} cx="0.35" cy="0.35">
                    <stop offset="0%" stopColor="#d1d5db" />
                    <stop offset="100%" stopColor="#6b7280" />
                  </radialGradient>
                </defs>
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 4, background: "#0f172a", borderRadius: 10, padding: 4, border: "1px solid #1e293b" }}>
          {[1, 2, 3].map(n => (
            <button key={n} onClick={() => { setPullCount(n); reset(); }} style={{
              padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
              background: pullCount === n ? "#6366f130" : "transparent",
              color: pullCount === n ? "#a5b4fc" : "#64748b", fontWeight: 700, fontSize: 12,
            }}>Pull {n}</button>
          ))}
        </div>
        <button onClick={start} disabled={isSwinging} style={{ padding: "10px 24px", borderRadius: 10, border: "none", cursor: isSwinging ? "not-allowed" : "pointer", fontWeight: 700, background: isSwinging ? "#475569" : "#10b981", color: "#0f172a" }}>RELEASE!</button>
        <button onClick={reset} style={{ padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, background: "#1e293b", color: "#cbd5e1" }}>RESET</button>
      </div>

      <Telemetry items={[
        { label: "Balls Pulled", value: `${pullCount}`, color: "#f59e0b" },
        { label: "Balls Out", value: `${pullCount}`, color: "#10b981" },
        { label: "Conserved", value: "p & KE", color: "#6366f1" },
        { label: "Type", value: "Elastic", color: "#3b82f6" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 3. BILLIARDS SHOT — Momentum Transfer
 * Cue ball hits target ball → momentum transfers
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_billiards_shot() {
  const [phase, setPhase] = useState<"ready" | "shooting" | "done">("ready");
  const [cueBallX, setCueBallX] = useState(100);
  const [targetBallX, setTargetBallX] = useState(300);
  const [power, setPower] = useState(50);
  const animRef = useRef<number>(0);
  const stateRef = useRef({ cueV: 0, targetV: 0 });
  const lastRef = useRef(0);

  const step = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    const s = stateRef.current;

    setCueBallX(prev => {
      const next = prev + s.cueV * dt * 20;
      // Check collision
      if (next + 16 >= targetBallX - 16 && s.cueV > 0 && s.targetV === 0) {
        // Perfect elastic collision (equal masses): cue stops, target gets all velocity
        s.targetV = s.cueV;
        s.cueV = 0;
      }
      return next;
    });

    setTargetBallX(prev => prev + s.targetV * dt * 20);

    if (cueBallX < 600 || targetBallX < 600) {
      animRef.current = requestAnimationFrame(step);
    } else {
      setPhase("done");
    }
  }, [cueBallX, targetBallX]);

  const shoot = () => {
    setPhase("shooting");
    stateRef.current = { cueV: power / 5, targetV: 0 };
    lastRef.current = 0;
    animRef.current = requestAnimationFrame(step);
  };

  const reset = () => { cancelAnimationFrame(animRef.current); setPhase("ready"); setCueBallX(100); setTargetBallX(300); stateRef.current = { cueV: 0, targetV: 0 }; };

  return (
    <SimCard title="🎱 Billiards — Momentum Transfer" description="Hit the cue ball into the target ball. Equal masses → cue ball STOPS, target ball moves with the SAME velocity!">
      <div style={{ background: "linear-gradient(135deg, #064e3b, #065f46)", borderRadius: 12, padding: 20, minHeight: 150, position: "relative", overflow: "hidden", border: "3px solid #78350f" }}>
        {/* Table felt markings */}
        <div style={{ position: "absolute", top: "50%", left: "50%", width: 8, height: 8, borderRadius: "50%", background: "#fff", opacity: 0.2, transform: "translate(-50%, -50%)" }} />

        {/* Cue ball */}
        <div style={{
          position: "absolute", top: "50%", left: cueBallX, transform: "translateY(-50%)",
          width: 32, height: 32, borderRadius: "50%",
          background: "radial-gradient(circle at 30% 30%, #fff, #d1d5db)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.4)", transition: phase === "ready" ? "left 0.3s" : "none",
        }} />

        {/* Target ball */}
        <div style={{
          position: "absolute", top: "50%", left: targetBallX, transform: "translateY(-50%)",
          width: 32, height: 32, borderRadius: "50%",
          background: "radial-gradient(circle at 30% 30%, #ef4444, #991b1b)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.4)", transition: phase === "ready" ? "left 0.3s" : "none",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>8</span>
        </div>

        {/* Cue stick */}
        {phase === "ready" && (
          <div style={{ position: "absolute", top: "50%", left: cueBallX - 120, transform: "translateY(-50%)", width: 100, height: 6, background: "linear-gradient(90deg, #92400e, #78350f)", borderRadius: 3 }} />
        )}
      </div>

      <div style={{ marginTop: 16, background: "#0f172a", padding: 16, borderRadius: 12, border: "1px solid #1e293b" }}>
        <label style={{ display: "flex", justifyContent: "space-between", color: "#f59e0b", fontWeight: 700, fontSize: 13 }}>
          <span>Shot Power</span><span>{power}%</span>
        </label>
        <input type="range" min={10} max={100} value={power} onChange={e => { setPower(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#f59e0b" }} />
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
        <button onClick={phase === "ready" ? shoot : reset} style={{ padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, background: phase === "ready" ? "#10b981" : "#1e293b", color: phase === "ready" ? "#0f172a" : "#cbd5e1" }}>
          {phase === "ready" ? "SHOOT!" : "RESET"}
        </button>
      </div>

      <Telemetry items={[
        { label: "Cue Ball", value: phase !== "ready" && stateRef.current.cueV === 0 ? "STOPPED" : "Moving →", color: "#94a3b8" },
        { label: "Target Ball", value: phase !== "ready" && stateRef.current.targetV > 0 ? "Moving →" : "Stationary", color: "#ef4444" },
        { label: "Transfer", value: "100%", color: "#10b981" },
        { label: "Masses", value: "Equal", color: "#6366f1" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 4. EXPLOSION DEMO — Object splits, momentum conserved
 * Total momentum before = 0, after = 0 (fragments cancel)
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_explosion_demo() {
  const [m1, setM1] = useState(3);
  const [m2, setM2] = useState(7);
  const [phase, setPhase] = useState<"ready" | "exploded">("ready");
  const [fragment1X, setFragment1X] = useState(0);
  const [fragment2X, setFragment2X] = useState(0);
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);

  // p_total = 0 (at rest). After: m1*v1 + m2*v2 = 0 → v1/v2 = -m2/m1
  const energyRelease = 500; // arbitrary energy unit
  const v1 = -Math.sqrt((2 * energyRelease * m2) / (m1 * (m1 + m2)));
  const v2 = Math.sqrt((2 * energyRelease * m1) / (m2 * (m1 + m2)));
  const p1 = m1 * v1;
  const p2 = m2 * v2;

  const step = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;

    setFragment1X(prev => prev + v1 * dt * 15);
    setFragment2X(prev => prev + v2 * dt * 15);

    animRef.current = requestAnimationFrame(step);
  }, [v1, v2]);

  const explode = () => {
    setPhase("exploded");
    setFragment1X(0);
    setFragment2X(0);
    lastRef.current = 0;
    animRef.current = requestAnimationFrame(step);
  };

  const reset = () => { cancelAnimationFrame(animRef.current); setPhase("ready"); setFragment1X(0); setFragment2X(0); };

  return (
    <SimCard title="💣 Explosion — Momentum Conservation" description="An object at rest explodes into two fragments. Total momentum before = 0, and after = 0 (fragments fly in opposite directions)!">
      <div style={{ background: "#020617", borderRadius: 12, padding: 20, minHeight: 200, position: "relative", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {phase === "ready" ? (
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "radial-gradient(circle, #f59e0b, #d97706)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 30px #f59e0b40", animation: "pulse 1.5s infinite",
          }}>
            <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{m1 + m2}kg</span>
          </div>
        ) : (
          <>
            {/* Explosion flash */}
            <div style={{ position: "absolute", width: 40, height: 40, borderRadius: "50%", background: "#fbbf2430", boxShadow: "0 0 60px #fbbf2440" }} />

            {/* Fragment 1 (left) */}
            <div style={{
              position: "absolute", left: `calc(50% + ${fragment1X}px - 20px)`, top: "45%",
              width: 25 + m1 * 2, height: 25 + m1 * 2, borderRadius: 6,
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 12px #ef444440",
            }}>
              <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{m1}kg</span>
            </div>

            {/* Fragment 2 (right) */}
            <div style={{
              position: "absolute", left: `calc(50% + ${fragment2X}px - 20px)`, top: "45%",
              width: 25 + m2 * 2, height: 25 + m2 * 2, borderRadius: 6,
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 12px #3b82f640",
            }}>
              <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{m2}kg</span>
            </div>
          </>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <div style={{ background: "#0f172a", padding: 14, borderRadius: 10, border: "1px solid #ef4444" }}>
          <label style={{ display: "flex", justifyContent: "space-between", color: "#ef4444", fontWeight: 700, fontSize: 12 }}><span>Fragment A</span><span>{m1} kg</span></label>
          <input type="range" min={1} max={15} value={m1} onChange={e => { setM1(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#ef4444" }} />
        </div>
        <div style={{ background: "#0f172a", padding: 14, borderRadius: 10, border: "1px solid #3b82f6" }}>
          <label style={{ display: "flex", justifyContent: "space-between", color: "#3b82f6", fontWeight: 700, fontSize: 12 }}><span>Fragment B</span><span>{m2} kg</span></label>
          <input type="range" min={1} max={15} value={m2} onChange={e => { setM2(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#3b82f6" }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
        <button onClick={phase === "ready" ? explode : reset} style={{ padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, background: phase === "ready" ? "#f59e0b" : "#1e293b", color: "#0f172a" }}>
          {phase === "ready" ? "💥 EXPLODE!" : "RESET"}
        </button>
      </div>

      <Telemetry items={[
        { label: "p Before", value: "0 kg⋅m/s", color: "#f59e0b" },
        { label: "p₁ (A)", value: `${p1.toFixed(1)}`, color: "#ef4444" },
        { label: "p₂ (B)", value: `${p2.toFixed(1)}`, color: "#3b82f6" },
        { label: "p₁ + p₂", value: `${(p1 + p2).toFixed(2)} ≈ 0`, color: "#10b981" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 5. ROCKET EQUATION — Continuous mass ejection
 * As fuel mass is ejected, rocket velocity increases
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_rocket_equation() {
  const [exhaustVelocity, setExhaustVelocity] = useState(3000);
  const [fuelRatio, setFuelRatio] = useState(0.8); // fuel mass / total mass
  const [isLaunching, setIsLaunching] = useState(false);
  const [burnProgress, setBurnProgress] = useState(0);
  const [rocketV, setRocketV] = useState(0);
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);

  const totalMass = 10000;
  const fuelMass = totalMass * fuelRatio;
  const dryMass = totalMass - fuelMass;
  // Tsiolkovsky: Δv = ve × ln(m0/mf)
  const deltaV = exhaustVelocity * Math.log(totalMass / dryMass);

  const step = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;

    setBurnProgress(prev => {
      const next = Math.min(prev + dt * 0.15, 1);
      const currentMassRatio = 1 - next * fuelRatio;
      const currentDeltaV = exhaustVelocity * Math.log(1 / currentMassRatio);
      setRocketV(currentDeltaV);
      if (next >= 1) setIsLaunching(false);
      return next;
    });

    animRef.current = requestAnimationFrame(step);
  }, [exhaustVelocity, fuelRatio]);

  useEffect(() => {
    if (isLaunching) { lastRef.current = 0; animRef.current = requestAnimationFrame(step); }
    else cancelAnimationFrame(animRef.current);
    return () => cancelAnimationFrame(animRef.current);
  }, [isLaunching, step]);

  const reset = () => { setIsLaunching(false); setBurnProgress(0); setRocketV(0); };
  const currentFuel = fuelMass * (1 - burnProgress);
  const currentMass = dryMass + currentFuel;

  return (
    <SimCard title="🚀 Tsiolkovsky Rocket Equation" description="Δv = vₑ × ln(m₀/mf). As the rocket burns fuel and gets lighter, it accelerates faster. This is real rocket science!">
      <div style={{ display: "flex", gap: 24 }}>
        {/* Rocket visualization */}
        <div style={{ flex: 1, background: "linear-gradient(180deg, #020617, #0c1427)", borderRadius: 12, padding: 20, minHeight: 300, position: "relative", overflow: "hidden", display: "flex", justifyContent: "center" }}>
          {/* Stars */}
          {[...Array(15)].map((_, i) => (
            <div key={i} style={{ position: "absolute", left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`, width: 2, height: 2, borderRadius: "50%", background: "#fff", opacity: 0.2 + Math.random() * 0.4 }} />
          ))}

          <div style={{ position: "relative", marginTop: 30 }}>
            {/* Rocket body */}
            <svg width="80" height="200" viewBox="0 0 80 200">
              {/* Nose cone */}
              <polygon points="40,5 20,50 60,50" fill="#d1d5db" stroke="#9ca3af" strokeWidth="1" />
              {/* Body */}
              <rect x="20" y="50" width="40" height="80" rx="2" fill="#94a3b8" stroke="#6b7280" strokeWidth="1" />
              {/* Fuel tank */}
              <rect x="20" y="130" width="40" height="60" rx="2" fill="#475569" stroke="#334155" strokeWidth="1" />
              {/* Fuel level */}
              <rect x="22" y={132 + 56 * burnProgress} width="36" height={Math.max(0, 56 * (1 - burnProgress))} rx="1" fill={burnProgress > 0.8 ? "#ef4444" : "#f59e0b"} opacity="0.8" />
              {/* Fins */}
              <polygon points="20,180 5,200 20,190" fill="#6b7280" />
              <polygon points="60,180 75,200 60,190" fill="#6b7280" />
              {/* Label */}
              <text x="40" y="100" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">{(currentMass / 1000).toFixed(1)}t</text>
              <text x="40" y="165" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="700">FUEL</text>
            </svg>

            {/* Exhaust */}
            {isLaunching && (
              <div style={{ position: "absolute", bottom: -30, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
                {[0, 1, 2, 3].map(i => (
                  <div key={i} style={{
                    width: 20 + i * 8, height: 10, borderRadius: "50%",
                    background: i < 2 ? "#fbbf24" : "#f97316",
                    opacity: 0.8 - i * 0.15, marginTop: -2,
                  }} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Controls & data */}
        <div style={{ width: 220, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "#0f172a", padding: 14, borderRadius: 10, border: "1px solid #1e293b" }}>
            <label style={{ display: "flex", justifyContent: "space-between", color: "#f59e0b", fontWeight: 700, fontSize: 12 }}>
              <span>Exhaust Velocity</span><span>{exhaustVelocity} m/s</span>
            </label>
            <input type="range" min={1000} max={5000} step={100} value={exhaustVelocity} onChange={e => { setExhaustVelocity(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#f59e0b" }} />
          </div>
          <div style={{ background: "#0f172a", padding: 14, borderRadius: 10, border: "1px solid #1e293b" }}>
            <label style={{ display: "flex", justifyContent: "space-between", color: "#3b82f6", fontWeight: 700, fontSize: 12 }}>
              <span>Fuel Ratio</span><span>{(fuelRatio * 100).toFixed(0)}%</span>
            </label>
            <input type="range" min={0.3} max={0.95} step={0.05} value={fuelRatio} onChange={e => { setFuelRatio(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#3b82f6" }} />
          </div>
          <div style={{ background: "#6366f110", padding: 14, borderRadius: 10, border: "1px solid #6366f1" }}>
            <div style={{ color: "#a5b4fc", fontSize: 12, fontWeight: 700 }}>Tsiolkovsky Equation</div>
            <div style={{ color: "#e2e8f0", fontFamily: "JetBrains Mono", fontSize: 14, marginTop: 6 }}>Δv = vₑ × ln(m₀/mf)</div>
            <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 4 }}>
              = {exhaustVelocity} × ln({totalMass}/{dryMass.toFixed(0)})
            </div>
            <div style={{ color: "#10b981", fontFamily: "JetBrains Mono", fontSize: 16, fontWeight: 700, marginTop: 4 }}>
              = {deltaV.toFixed(0)} m/s
            </div>
          </div>
          <div style={{ background: "#0f172a", padding: 14, borderRadius: 10, border: "1px solid #1e293b" }}>
            <div style={{ fontSize: 11, color: "#64748b" }}>BURN PROGRESS</div>
            <div style={{ height: 12, background: "#1e293b", borderRadius: 6, marginTop: 6, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${burnProgress * 100}%`, background: "linear-gradient(90deg, #10b981, #f59e0b)", borderRadius: 6, transition: "width 0.1s" }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
        <button onClick={() => { reset(); setTimeout(() => setIsLaunching(true), 50); }} style={{ padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, background: "#10b981", color: "#0f172a" }}>🚀 BURN FUEL!</button>
        <button onClick={reset} style={{ padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, background: "#1e293b", color: "#cbd5e1" }}>RESET</button>
      </div>

      <Telemetry items={[
        { label: "Current Δv", value: `${rocketV.toFixed(0)} m/s`, color: "#10b981" },
        { label: "Max Δv", value: `${deltaV.toFixed(0)} m/s`, color: "#6366f1" },
        { label: "Fuel Left", value: `${(currentFuel / 1000).toFixed(1)} t`, color: currentFuel / fuelMass > 0.2 ? "#f59e0b" : "#ef4444" },
        { label: "Current Mass", value: `${(currentMass / 1000).toFixed(1)} t`, color: "#94a3b8" },
      ]} />
    </SimCard>
  );
}
