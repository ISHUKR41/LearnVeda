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
 * 1. ROCKET PROPULSION — Action-Reaction with particles
 * Gas goes down → rocket goes up
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_rocket_propulsion() {
  const [isLaunched, setIsLaunched] = useState(false);
  const [rocketY, setRocketY] = useState(0);
  const [thrust, setThrust] = useState(50000);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; vx: number; vy: number; life: number }[]>([]);
  const animRef = useRef<number>(0);
  const stateRef = useRef({ v: 0, y: 0, t: 0 });
  const lastRef = useRef(0);
  const nextId = useRef(0);

  const mass = 2000;
  const weight = mass * 9.8;
  const netForce = thrust - weight;
  const acceleration = netForce / mass;

  const step = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    const s = stateRef.current;

    if (netForce > 0) {
      s.v += acceleration * dt;
      s.y += s.v * dt * 3;
    }
    s.t += dt;

    setRocketY(s.y);

    // Add exhaust particles
    if (s.t > 0.3) {
      const newParticles: typeof particles = [];
      for (let i = 0; i < 3; i++) {
        newParticles.push({
          id: nextId.current++,
          x: (Math.random() - 0.5) * 20,
          y: 0,
          vx: (Math.random() - 0.5) * 80,
          vy: Math.random() * 150 + 80,
          life: 1,
        });
      }
      setParticles(prev => {
        const updated = prev.map(p => ({
          ...p, x: p.x + p.vx * dt, y: p.y + p.vy * dt, life: p.life - dt * 1.5,
        })).filter(p => p.life > 0);
        return [...updated, ...newParticles].slice(-60);
      });
    }

    if (s.y < 600) animRef.current = requestAnimationFrame(step);
  }, [netForce, acceleration]);

  useEffect(() => {
    if (isLaunched) { lastRef.current = 0; stateRef.current = { v: 0, y: 0, t: 0 }; animRef.current = requestAnimationFrame(step); }
    else cancelAnimationFrame(animRef.current);
    return () => cancelAnimationFrame(animRef.current);
  }, [isLaunched, step]);

  const reset = () => { setIsLaunched(false); setRocketY(0); setParticles([]); stateRef.current = { v: 0, y: 0, t: 0 }; };

  return (
    <SimCard title="🚀 Rocket Propulsion — Action & Reaction" description="Hot gas pushed DOWN (action) → Rocket pushed UP (reaction). Newton's Third Law makes space travel possible!">
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ flex: 1, background: "linear-gradient(180deg, #020617 0%, #0c1427 60%, #1e293b 100%)", borderRadius: 12, padding: 20, minHeight: 350, position: "relative", overflow: "hidden" }}>
          {/* Stars */}
          {[...Array(20)].map((_, i) => (
            <div key={i} style={{ position: "absolute", left: `${(i * 37) % 100}%`, top: `${(i * 53) % 80}%`, width: 2, height: 2, borderRadius: "50%", background: "#fff", opacity: 0.3 + Math.random() * 0.5 }} />
          ))}

          {/* Ground */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, background: "linear-gradient(0deg, #1e293b, transparent)" }} />

          {/* Rocket */}
          <div style={{ position: "absolute", bottom: 40 + rocketY, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
            {/* Exhaust particles */}
            {isLaunched && particles.map(p => (
              <div key={p.id} style={{
                position: "absolute", left: `calc(50% + ${p.x}px)`, top: 60 + p.y,
                width: 6 + p.life * 4, height: 6 + p.life * 4, borderRadius: "50%",
                background: p.life > 0.6 ? "#fbbf24" : p.life > 0.3 ? "#f97316" : "#ef4444",
                opacity: p.life * 0.8, transform: "translate(-50%, -50%)",
              }} />
            ))}
            <div style={{ fontSize: 50 }}>🚀</div>
            {/* Force arrows */}
            {isLaunched && (
              <>
                <div style={{ position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)", color: "#10b981", fontSize: 11, fontWeight: 700 }}>
                  ↑ Thrust: {thrust}N
                </div>
                <div style={{ position: "absolute", bottom: -30, left: "50%", transform: "translateX(-50%)", color: "#ef4444", fontSize: 11, fontWeight: 700 }}>
                  ↓ Action: Gas expelled
                </div>
              </>
            )}
          </div>
        </div>

        <div style={{ width: 200, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "#0f172a", padding: 14, borderRadius: 10, border: "1px solid #1e293b" }}>
            <label style={{ display: "flex", justifyContent: "space-between", color: "#f59e0b", fontWeight: 700, fontSize: 12 }}>
              <span>Thrust</span><span>{thrust}N</span>
            </label>
            <input type="range" min={5000} max={80000} step={1000} value={thrust} onChange={e => { setThrust(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#f59e0b" }} />
          </div>
          <div style={{ background: "#0f172a", padding: 14, borderRadius: 10, border: "1px solid #1e293b" }}>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>FORCES</div>
            <div style={{ color: "#10b981", fontSize: 13, fontWeight: 700 }}>↑ Thrust: {thrust}N</div>
            <div style={{ color: "#ef4444", fontSize: 13, fontWeight: 700 }}>↓ Weight: {weight.toFixed(0)}N</div>
            <div style={{ color: netForce > 0 ? "#10b981" : "#ef4444", fontSize: 15, fontWeight: 700, marginTop: 6, borderTop: "1px solid #1e293b", paddingTop: 6 }}>
              Net: {netForce.toFixed(0)}N {netForce > 0 ? "↑" : "↓"}
            </div>
          </div>
          <div style={{ background: "#0f172a", padding: 14, borderRadius: 10, border: `1px solid ${netForce > 0 ? "#10b981" : "#ef4444"}` }}>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>WILL IT LAUNCH?</div>
            <div style={{ color: netForce > 0 ? "#10b981" : "#ef4444", fontSize: 16, fontWeight: 700 }}>
              {netForce > 0 ? "YES ✓" : "NO ✗"}
            </div>
            <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 4 }}>
              {netForce > 0 ? "Thrust > Weight" : "Thrust < Weight"}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
        <button onClick={() => { reset(); setTimeout(() => setIsLaunched(true), 50); }} style={{ padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, background: netForce > 0 ? "#10b981" : "#475569", color: "#0f172a" }}>
          {netForce > 0 ? "🚀 LAUNCH!" : "⚠️ Can't Launch"}
        </button>
        <button onClick={reset} style={{ padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, background: "#1e293b", color: "#cbd5e1" }}>RESET</button>
      </div>

      <Telemetry items={[
        { label: "Action", value: "Gas ↓", color: "#ef4444" },
        { label: "Reaction", value: "Rocket ↑", color: "#10b981" },
        { label: "Acceleration", value: `${acceleration.toFixed(1)} m/s²`, color: "#f59e0b" },
        { label: "Third Law", value: "F₁₂ = -F₂₁", color: "#6366f1" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 2. BALLOON JET — Air out = Balloon moves opposite
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_balloon_jet() {
  const [isReleased, setIsReleased] = useState(false);
  const [balloonX, setBalloonX] = useState(50);
  const [balloonSize, setBalloonSize] = useState(60);
  const [airTrails, setAirTrails] = useState<{ id: number; x: number; opacity: number }[]>([]);
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);
  const nextId = useRef(0);

  const step = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;

    setBalloonSize(prev => {
      const newSize = prev - dt * 15;
      if (newSize <= 20) { setIsReleased(false); return 20; }
      return newSize;
    });
    setBalloonX(prev => Math.min(prev + dt * 120, 500));

    // Air trails
    setAirTrails(prev => {
      const updated = prev.map(a => ({ ...a, x: a.x - dt * 100, opacity: a.opacity - dt * 2 })).filter(a => a.opacity > 0);
      return [...updated, { id: nextId.current++, x: balloonX - 30, opacity: 1 }].slice(-20);
    });

    animRef.current = requestAnimationFrame(step);
  }, [balloonX]);

  useEffect(() => {
    if (isReleased) { lastRef.current = 0; animRef.current = requestAnimationFrame(step); }
    else cancelAnimationFrame(animRef.current);
    return () => cancelAnimationFrame(animRef.current);
  }, [isReleased, step]);

  const reset = () => { setIsReleased(false); setBalloonX(50); setBalloonSize(60); setAirTrails([]); };

  return (
    <SimCard title="🎈 Balloon Jet — Third Law in Action" description="Release the balloon — air escapes LEFT (action), balloon flies RIGHT (reaction)!">
      <div style={{ background: "#020617", borderRadius: 12, padding: 20, minHeight: 200, position: "relative", overflow: "hidden" }}>
        {/* Air trails */}
        {airTrails.map(a => (
          <div key={a.id} style={{
            position: "absolute", left: a.x, top: "45%", width: 12, height: 12,
            borderRadius: "50%", background: "#94a3b8", opacity: a.opacity * 0.4,
            transform: "translateY(-50%)",
          }} />
        ))}

        {/* Balloon */}
        <div style={{
          position: "absolute", left: balloonX, top: "50%", transform: "translateY(-50%)",
          transition: isReleased ? "none" : "left 0.3s",
        }}>
          <div style={{
            width: balloonSize, height: balloonSize * 1.3, borderRadius: "50%",
            background: "radial-gradient(circle at 30% 30%, #ef4444, #b91c1c)",
            boxShadow: "0 0 20px #ef444440",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {!isReleased && <span style={{ fontSize: 10, color: "#fff", fontWeight: 700 }}>TIED</span>}
          </div>
          {/* Nozzle */}
          <div style={{ width: 8, height: 12, background: "#991b1b", margin: "-2px auto 0", borderRadius: "0 0 4px 4px" }} />
        </div>

        {/* Labels */}
        {isReleased && (
          <>
            <div style={{ position: "absolute", top: 16, left: 20, color: "#94a3b8", fontSize: 12, fontWeight: 700 }}>← Air (Action)</div>
            <div style={{ position: "absolute", top: 16, right: 20, color: "#ef4444", fontSize: 12, fontWeight: 700 }}>Balloon (Reaction) →</div>
          </>
        )}
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
        <button onClick={() => { reset(); setTimeout(() => setIsReleased(true), 100); }} style={{ padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, background: "#ef4444", color: "#fff" }}>RELEASE BALLOON!</button>
        <button onClick={reset} style={{ padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, background: "#1e293b", color: "#cbd5e1" }}>RESET</button>
      </div>

      <Telemetry items={[
        { label: "Action", value: "Air ←", color: "#94a3b8" },
        { label: "Reaction", value: "Balloon →", color: "#ef4444" },
        { label: "Balloon Size", value: `${balloonSize.toFixed(0)}%`, color: "#f59e0b" },
        { label: "Law", value: "3rd Law", color: "#6366f1" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 3. BOOK ON TABLE — Normal Force Reaction
 * Weight pushes down → Table pushes up (always equal & opposite)
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_book_on_table_reaction() {
  const [mass, setMass] = useState(2);
  const g = 9.8;
  const weight = mass * g;
  const normalForce = weight;
  const arrowScale = Math.min(weight / 5, 80);

  return (
    <SimCard title="📚 Book on Table — Action & Reaction Pair" description="The book pushes the table DOWN with its weight (action). The table pushes the book UP with Normal Force (reaction)!">
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ flex: 1, background: "#020617", borderRadius: 12, padding: 20, minHeight: 300, position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
          {/* Table */}
          <div style={{ position: "absolute", bottom: 60, left: 60, right: 60, height: 12, background: "linear-gradient(90deg, #78350f, #92400e, #78350f)", borderRadius: 3 }} />
          <div style={{ position: "absolute", bottom: 10, left: 80, width: 8, height: 50, background: "#78350f" }} />
          <div style={{ position: "absolute", bottom: 10, right: 80, width: 8, height: 50, background: "#78350f" }} />

          {/* Book */}
          <div style={{ position: "absolute", bottom: 72, left: "50%", transform: "translateX(-50%)" }}>
            <div style={{
              width: 100, height: 30 + mass * 3, borderRadius: 4,
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              border: "2px solid #60a5fa", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px #3b82f630",
            }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{mass} kg</span>
            </div>

            {/* Weight arrow (down) */}
            <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 4, height: arrowScale, background: "#ef4444", borderRadius: 2 }} />
              <div style={{ width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "10px solid #ef4444" }} />
              <span style={{ color: "#ef4444", fontSize: 11, fontWeight: 700, marginTop: 4 }}>W = {weight.toFixed(1)}N ↓</span>
              <span style={{ color: "#ef444488", fontSize: 9 }}>(Action)</span>
            </div>

            {/* Normal force arrow (up) */}
            <div style={{ position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column-reverse", alignItems: "center" }}>
              <div style={{ width: 4, height: arrowScale, background: "#10b981", borderRadius: 2 }} />
              <div style={{ width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderBottom: "10px solid #10b981" }} />
              <span style={{ color: "#10b981", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>N = {normalForce.toFixed(1)}N ↑</span>
              <span style={{ color: "#10b98188", fontSize: 9 }}>(Reaction)</span>
            </div>
          </div>
        </div>

        <div style={{ width: 200, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "#0f172a", padding: 14, borderRadius: 10, border: "1px solid #1e293b" }}>
            <label style={{ display: "flex", justifyContent: "space-between", color: "#3b82f6", fontWeight: 700, fontSize: 13 }}>
              <span>Book Mass</span><span>{mass} kg</span>
            </label>
            <input type="range" min={1} max={20} value={mass} onChange={e => setMass(+e.target.value)} style={{ width: "100%", accentColor: "#3b82f6" }} />
          </div>
          <div style={{ background: "#0f172a", padding: 14, borderRadius: 10, border: "1px solid #ef4444" }}>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>ACTION</div>
            <div style={{ color: "#ef4444", fontSize: 14, fontWeight: 700 }}>Book pushes table ↓</div>
            <div style={{ color: "#ef4444", fontFamily: "JetBrains Mono", fontSize: 13 }}>F = {weight.toFixed(1)} N</div>
          </div>
          <div style={{ background: "#0f172a", padding: 14, borderRadius: 10, border: "1px solid #10b981" }}>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>REACTION</div>
            <div style={{ color: "#10b981", fontSize: 14, fontWeight: 700 }}>Table pushes book ↑</div>
            <div style={{ color: "#10b981", fontFamily: "JetBrains Mono", fontSize: 13 }}>N = {normalForce.toFixed(1)} N</div>
          </div>
          <div style={{ background: "#6366f110", padding: 14, borderRadius: 10, border: "1px solid #6366f1" }}>
            <div style={{ color: "#a5b4fc", fontSize: 13, fontWeight: 700 }}>F_action = −F_reaction</div>
            <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 4 }}>Equal magnitude, opposite direction. Always!</div>
          </div>
        </div>
      </div>
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 4. WALL PUSH SKATER — Push wall, slide backward
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_wall_push_skater() {
  const [isPushing, setIsPushing] = useState(false);
  const [skaterX, setSkaterX] = useState(80);
  const [pushForce, setPushForce] = useState(100);
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);
  const vRef = useRef(0);

  const step = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;

    vRef.current += (pushForce / 60) * dt;
    vRef.current *= 0.995; // ice friction

    setSkaterX(prev => {
      const newX = prev + vRef.current * dt * 80;
      if (newX > 500) { setIsPushing(false); return 500; }
      return newX;
    });

    animRef.current = requestAnimationFrame(step);
  }, [pushForce]);

  useEffect(() => {
    if (isPushing) { lastRef.current = 0; vRef.current = 0; animRef.current = requestAnimationFrame(step); }
    else cancelAnimationFrame(animRef.current);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPushing, step]);

  const reset = () => { setIsPushing(false); setSkaterX(80); vRef.current = 0; };

  return (
    <SimCard title="⛸️ Wall Push Skater — Third Law" description="The skater pushes the WALL (action). The wall pushes the SKATER backward (reaction). On ice, she slides away!">
      <div style={{ background: "linear-gradient(180deg, #0f172a, #1e3a5f)", borderRadius: 12, padding: 20, minHeight: 200, position: "relative", overflow: "hidden" }}>
        {/* Ice surface */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, background: "linear-gradient(0deg, #bae6fd20, transparent)" }} />

        {/* Wall */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 30, background: "linear-gradient(90deg, #475569, #334155)", borderRight: "3px solid #64748b" }} />

        {/* Skater */}
        <div style={{ position: "absolute", bottom: 40, left: skaterX, transition: isPushing ? "none" : "left 0.3s" }}>
          <div style={{ fontSize: 42, transform: "scaleX(-1)" }}>⛸️</div>
        </div>

        {/* Force arrows */}
        {isPushing && skaterX < 200 && (
          <>
            <div style={{ position: "absolute", bottom: 80, left: 35, color: "#ef4444", fontSize: 11, fontWeight: 700 }}>
              → Action: Skater pushes wall ({pushForce}N)
            </div>
            <div style={{ position: "absolute", bottom: 60, left: 35, color: "#10b981", fontSize: 11, fontWeight: 700 }}>
              ← Reaction: Wall pushes skater ({pushForce}N)
            </div>
          </>
        )}
      </div>

      <div style={{ marginTop: 16, background: "#0f172a", padding: 16, borderRadius: 12, border: "1px solid #1e293b" }}>
        <label style={{ display: "flex", justifyContent: "space-between", color: "#6366f1", fontWeight: 700, fontSize: 13 }}>
          <span>Push Force</span><span>{pushForce} N</span>
        </label>
        <input type="range" min={20} max={300} value={pushForce} onChange={e => { setPushForce(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#6366f1" }} />
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
        <button onClick={() => { reset(); setTimeout(() => setIsPushing(true), 50); }} style={{ padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, background: "#10b981", color: "#0f172a" }}>PUSH WALL!</button>
        <button onClick={reset} style={{ padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, background: "#1e293b", color: "#cbd5e1" }}>RESET</button>
      </div>

      <Telemetry items={[
        { label: "Action", value: `Skater → Wall`, color: "#ef4444" },
        { label: "Reaction", value: `Wall → Skater`, color: "#10b981" },
        { label: "Push Force", value: `${pushForce} N`, color: "#6366f1" },
        { label: "Surface", value: "Frictionless Ice", color: "#06b6d4" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 5. HORSE-CART PARADOX — If forces are equal, why does it move?
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_horse_cart_paradox() {
  const [showAnswer, setShowAnswer] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [posX, setPosX] = useState(0);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (isMoving) {
      const step = () => {
        setPosX(prev => {
          if (prev > 300) { setIsMoving(false); return prev; }
          return prev + 2;
        });
        animRef.current = requestAnimationFrame(step);
      };
      animRef.current = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [isMoving]);

  const reset = () => { setIsMoving(false); setPosX(0); setShowAnswer(false); };

  return (
    <SimCard title="🐴 Horse-Cart Paradox — Why Does It Move?" description="If horse pulls cart with F, and cart pulls horse with -F (Third Law), net = 0. So why does the system move? Think carefully!">
      <div style={{ background: "#020617", borderRadius: 12, padding: 20, minHeight: 250, position: "relative", overflow: "hidden" }}>
        {/* Ground */}
        <div style={{ position: "absolute", bottom: 30, left: 0, right: 0, height: 4, background: "#475569" }} />

        {/* Horse + Cart system */}
        <div style={{ position: "absolute", bottom: 34, left: 40 + posX, display: "flex", alignItems: "flex-end", gap: 4, transition: isMoving ? "none" : "left 0.3s" }}>
          {/* Horse */}
          <div style={{ fontSize: 44 }}>🐴</div>
          {/* Rope */}
          <div style={{ width: 20, height: 3, background: "#f59e0b", alignSelf: "center", marginBottom: 20 }} />
          {/* Cart */}
          <div style={{ width: 60, height: 35, background: "#78350f", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#d4d4d8", fontWeight: 700 }}>CART</div>
        </div>

        {/* Force labels */}
        {showAnswer && (
          <div style={{ position: "absolute", top: 20, left: 20, right: 20 }}>
            <div style={{ color: "#ef4444", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
              ❌ WRONG thinking: Horse force on cart = Cart force on horse → Net = 0
            </div>
            <div style={{ color: "#10b981", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
              ✓ RIGHT thinking: These forces act on DIFFERENT objects!
            </div>
            <div style={{ color: "#a5b4fc", fontSize: 11, marginTop: 8 }}>
              • Horse pushes ground backward → Ground pushes horse FORWARD (friction)
              <br />• If horse&apos;s forward friction &gt; cart&apos;s backward friction → System accelerates!
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={() => setShowAnswer(!showAnswer)} style={{ padding: "10px 24px", borderRadius: 10, border: "1px solid #6366f1", background: "#6366f120", color: "#a5b4fc", fontWeight: 700, cursor: "pointer" }}>
          {showAnswer ? "HIDE ANSWER" : "WHY DOES IT MOVE?"}
        </button>
        <button onClick={() => { reset(); setShowAnswer(true); setTimeout(() => setIsMoving(true), 100); }} style={{ padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, background: "#10b981", color: "#0f172a" }}>WATCH IT MOVE!</button>
        <button onClick={reset} style={{ padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, background: "#1e293b", color: "#cbd5e1" }}>RESET</button>
      </div>

      <Telemetry items={[
        { label: "Key Insight", value: "Different bodies", color: "#10b981" },
        { label: "Horse on Cart", value: "F forward", color: "#f59e0b" },
        { label: "Cart on Horse", value: "-F backward", color: "#ef4444" },
        { label: "Ground Friction", value: "Breaks tie!", color: "#6366f1" },
      ]} />
    </SimCard>
  );
}
