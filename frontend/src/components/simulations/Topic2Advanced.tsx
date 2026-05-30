"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

/* ── Shared helpers (same style as Topic1Advanced) ────────────── */
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
 * 1. TABLECLOTH PULL — Inertia of Rest
 * Classic demo: yank tablecloth, plates stay due to inertia
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_tablecloth_pull() {
  const [phase, setPhase] = useState<"ready" | "pulling" | "done" | "failed">("ready");
  const [speed, setSpeed] = useState<"slow" | "fast">("fast");
  const [clothX, setClothX] = useState(0);
  const [plateShake, setPlateShake] = useState(0);
  const animRef = useRef<number>(0);

  const pull = () => {
    setPhase("pulling");
    let x = 0;
    const isFast = speed === "fast";
    const pullSpeed = isFast ? 25 : 3;
    let shake = 0;

    const animate = () => {
      x += pullSpeed;
      setClothX(x);
      if (!isFast) {
        shake = Math.sin(x * 0.1) * (x / 20);
        setPlateShake(shake);
      }
      if (x < 400) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setPhase(isFast ? "done" : "failed");
        if (!isFast) setPlateShake(200); // plates fall off
      }
    };
    animRef.current = requestAnimationFrame(animate);
  };

  const reset = () => {
    cancelAnimationFrame(animRef.current);
    setPhase("ready"); setClothX(0); setPlateShake(0);
  };

  return (
    <SimCard title="🎩 Tablecloth Pull — Inertia of Rest" description="Pull the tablecloth fast → plates stay (inertia). Pull slowly → friction drags plates off!">
      <div style={{ background: "#020617", borderRadius: 12, padding: 20, minHeight: 280, position: "relative", overflow: "hidden" }}>
        {/* Table */}
        <div style={{ position: "absolute", bottom: 40, left: 40, right: 40, height: 12, background: "#78350f", borderRadius: 4 }} />
        <div style={{ position: "absolute", bottom: 0, left: 60, width: 8, height: 40, background: "#92400e" }} />
        <div style={{ position: "absolute", bottom: 0, right: 60, width: 8, height: 40, background: "#92400e" }} />

        {/* Tablecloth */}
        <div style={{
          position: "absolute", bottom: 52, left: 40 - clothX, right: 40, height: 8,
          background: "linear-gradient(90deg, #ef4444, #dc2626, #b91c1c)",
          borderRadius: 3, transition: phase === "ready" ? "none" : undefined,
          display: clothX > 380 ? "none" : "block",
        }}>
          <div style={{ position: "absolute", right: -12, top: -4, bottom: -4, width: 12, background: "#991b1b", borderRadius: "0 4px 4px 0" }} />
        </div>

        {/* Plates & Glasses */}
        {phase !== "failed" ? (
          <div style={{ position: "absolute", bottom: 60, left: "50%", transform: `translateX(-50%) translateX(${speed === "slow" && phase !== "ready" ? plateShake : 0}px)`, display: "flex", gap: 30, alignItems: "flex-end" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36 }}>🍽️</div>
              <div style={{ fontSize: 10, color: "#94a3b8" }}>Plate</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32 }}>🥃</div>
              <div style={{ fontSize: 10, color: "#94a3b8" }}>Glass</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28 }}>🏺</div>
              <div style={{ fontSize: 10, color: "#94a3b8" }}>Vase</div>
            </div>
          </div>
        ) : (
          <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", fontSize: 14, color: "#ef4444", fontWeight: 700 }}>
            💥 Everything fell off! Friction dragged them.
          </div>
        )}

        {/* Result */}
        {phase === "done" && (
          <div style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", background: "#10b98130", padding: "8px 20px", borderRadius: 20, border: "1px solid #10b981", color: "#10b981", fontWeight: 700, fontSize: 14 }}>
            ✓ INERTIA! Plates stayed still!
          </div>
        )}
        {phase === "failed" && (
          <div style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", background: "#ef444430", padding: "8px 20px", borderRadius: 20, border: "1px solid #ef4444", color: "#ef4444", fontWeight: 700, fontSize: 14 }}>
            ✗ Too slow! Friction overcame inertia.
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 4, background: "#0f172a", borderRadius: 10, padding: 4, border: "1px solid #1e293b" }}>
          {(["fast", "slow"] as const).map(s => (
            <button key={s} onClick={() => { setSpeed(s); reset(); }} style={{
              padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
              background: speed === s ? "#6366f130" : "transparent", color: speed === s ? "#a5b4fc" : "#64748b",
              fontWeight: 700, fontSize: 13,
            }}>{s === "fast" ? "⚡ Fast Pull" : "🐢 Slow Pull"}</button>
          ))}
        </div>
        <button onClick={phase === "ready" ? pull : reset} style={{
          padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700,
          background: phase === "ready" ? "#10b981" : "#1e293b", color: phase === "ready" ? "#0f172a" : "#cbd5e1",
        }}>{phase === "ready" ? "PULL!" : "RESET"}</button>
      </div>

      <Telemetry items={[
        { label: "Pull Speed", value: speed === "fast" ? "Very Fast" : "Very Slow", color: speed === "fast" ? "#10b981" : "#ef4444" },
        { label: "Friction Time", value: speed === "fast" ? "< 0.1s" : "2-3 seconds", color: "#94a3b8" },
        { label: "Inertia Effect", value: speed === "fast" ? "Objects stay" : "Objects dragged", color: speed === "fast" ? "#10b981" : "#ef4444" },
        { label: "Physics", value: "Newton's 1st Law", color: "#6366f1" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 2. BUS PASSENGERS — Inertia in everyday life
 * Passengers lean forward/backward when bus accelerates/brakes
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_bus_passengers() {
  const [action, setAction] = useState<"rest" | "accelerate" | "brake" | "turn-left" | "turn-right">("rest");
  const leanMap = { rest: 0, accelerate: 15, brake: -15, "turn-left": 12, "turn-right": -12 };
  const lean = leanMap[action];

  return (
    <SimCard title="🚌 Bus Passengers — Inertia in Daily Life" description="When a bus accelerates, brakes, or turns — passengers lean due to inertia. Their body wants to keep its original state!">
      <div style={{ background: "#020617", borderRadius: 12, padding: 20, minHeight: 260, position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {/* Bus body */}
        <div style={{ width: 340, height: 160, background: "linear-gradient(135deg, #1e3a5f, #0f172a)", borderRadius: 16, border: "2px solid #334155", position: "relative", overflow: "hidden" }}>
          {/* Windows */}
          <div style={{ position: "absolute", top: 12, left: 20, right: 60, height: 50, display: "flex", gap: 8 }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ flex: 1, background: "#172554", borderRadius: 6, border: "1px solid #1e3a5f" }} />
            ))}
          </div>
          {/* Passengers */}
          <div style={{ position: "absolute", bottom: 20, left: 30, right: 70, display: "flex", justifyContent: "space-around" }}>
            {["🧑", "👩", "🧓", "👦"].map((p, i) => (
              <div key={i} style={{
                fontSize: 32, transform: `rotate(${lean}deg)`,
                transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transformOrigin: "bottom center",
              }}>{p}</div>
            ))}
          </div>
          {/* Direction arrow */}
          {action !== "rest" && (
            <div style={{ position: "absolute", top: "50%", right: 10, transform: "translateY(-50%)", color: "#f59e0b", fontWeight: 700, fontSize: 20 }}>
              {action === "accelerate" ? "→" : action === "brake" ? "🛑" : action === "turn-left" ? "↰" : "↱"}
            </div>
          )}
          {/* Wheels */}
          <div style={{ position: "absolute", bottom: -6, left: 40, width: 24, height: 24, borderRadius: "50%", background: "#1e293b", border: "3px solid #475569" }} />
          <div style={{ position: "absolute", bottom: -6, right: 70, width: 24, height: 24, borderRadius: "50%", background: "#1e293b", border: "3px solid #475569" }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "center", flexWrap: "wrap" }}>
        {([
          { key: "rest", label: "🛑 At Rest", color: "#64748b" },
          { key: "accelerate", label: "⚡ Accelerate →", color: "#10b981" },
          { key: "brake", label: "🔴 Brake!", color: "#ef4444" },
          { key: "turn-left", label: "↰ Turn Left", color: "#3b82f6" },
          { key: "turn-right", label: "↱ Turn Right", color: "#f59e0b" },
        ] as const).map(b => (
          <button key={b.key} onClick={() => setAction(b.key)} style={{
            padding: "8px 16px", borderRadius: 8, border: action === b.key ? `2px solid ${b.color}` : "1px solid #1e293b",
            background: action === b.key ? `${b.color}20` : "#0f172a", color: action === b.key ? b.color : "#94a3b8",
            fontWeight: 700, fontSize: 12, cursor: "pointer",
          }}>{b.label}</button>
        ))}
      </div>

      <Telemetry items={[
        { label: "Bus Action", value: action.replace("-", " ").toUpperCase(), color: "#f59e0b" },
        { label: "Passenger Lean", value: `${Math.abs(lean)}°`, color: lean === 0 ? "#10b981" : "#ef4444" },
        { label: "Direction", value: lean > 0 ? "BACKWARD" : lean < 0 ? "FORWARD" : "NONE", color: "#94a3b8" },
        { label: "Cause", value: "INERTIA", color: "#6366f1" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 3. COIN STACK FLICK — Inertia Demonstration
 * Flick the bottom coin — stack stays due to inertia
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_coin_stack_flick() {
  const [phase, setPhase] = useState<"ready" | "flicking" | "done">("ready");
  const [bottomX, setBottomX] = useState(0);
  const animRef = useRef<number>(0);

  const flick = () => {
    setPhase("flicking");
    let x = 0;
    const animate = () => {
      x += 20;
      setBottomX(x);
      if (x < 300) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setPhase("done");
      }
    };
    animRef.current = requestAnimationFrame(animate);
  };

  const reset = () => { cancelAnimationFrame(animRef.current); setPhase("ready"); setBottomX(0); };

  const coins = [
    { color: "#f59e0b", label: "5₹" },
    { color: "#d97706", label: "2₹" },
    { color: "#b45309", label: "1₹" },
    { color: "#92400e", label: "50p" },
  ];

  return (
    <SimCard title="🪙 Coin Stack Flick — Inertia" description="Flick the bottom coin with a striker — the stack stays because of inertia of rest!">
      <div style={{ background: "#020617", borderRadius: 12, padding: 20, minHeight: 280, position: "relative", display: "flex", justifyContent: "center", alignItems: "flex-end", paddingBottom: 60 }}>
        {/* Table surface */}
        <div style={{ position: "absolute", bottom: 40, left: 20, right: 20, height: 4, background: "#475569", borderRadius: 2 }} />

        {/* Coin stack */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column-reverse", alignItems: "center" }}>
          {coins.map((c, i) => (
            <div key={i} style={{
              width: 70, height: 16, borderRadius: 8,
              background: `linear-gradient(135deg, ${c.color}, ${c.color}cc)`,
              border: `1px solid ${c.color}88`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 700, color: "#fff",
              marginBottom: i < coins.length - 1 ? -2 : 0,
              transform: i === 0 ? `translateX(${bottomX}px)` : phase === "done" ? "translateY(4px)" : "none",
              transition: i === 0 ? "none" : "transform 0.3s ease-out",
              boxShadow: `0 2px 8px ${c.color}30`,
            }}>{c.label}</div>
          ))}
        </div>

        {/* Striker */}
        {phase === "ready" && (
          <div style={{ position: "absolute", bottom: 44, left: 80, fontSize: 20, color: "#94a3b8" }}>
            👆 →
          </div>
        )}

        {/* Result label */}
        {phase === "done" && (
          <div style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", background: "#10b98130", padding: "8px 20px", borderRadius: 20, border: "1px solid #10b981", color: "#10b981", fontWeight: 700, fontSize: 14 }}>
            ✓ Stack stayed! Bottom coin flew out due to sudden force.
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
        <button onClick={phase === "ready" ? flick : reset} style={{
          padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700,
          background: phase === "ready" ? "#10b981" : "#1e293b", color: phase === "ready" ? "#0f172a" : "#cbd5e1",
        }}>{phase === "ready" ? "FLICK!" : "RESET"}</button>
      </div>

      <Telemetry items={[
        { label: "Force", value: "Sudden impact", color: "#f59e0b" },
        { label: "Bottom Coin", value: phase === "done" ? "Flew away →" : "Stationary", color: "#ef4444" },
        { label: "Stack Above", value: phase === "done" ? "Stayed still" : "Stationary", color: "#10b981" },
        { label: "Principle", value: "Inertia of Rest", color: "#6366f1" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 4. BALL ON MOVING TRAIN — Inertia of Motion
 * Ball on train floor — see what happens when train starts/stops
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_ball_on_train() {
  const [trainAction, setTrainAction] = useState<"rest" | "starting" | "moving" | "stopping">("rest");
  const [trainX, setTrainX] = useState(0);
  const [ballRelX, setBallRelX] = useState(0);
  const animRef = useRef<number>(0);
  const stateRef = useRef({ trainV: 0, ballRelV: 0, time: 0 });

  const runSim = useCallback((action: "starting" | "moving" | "stopping") => {
    setTrainAction(action);
    stateRef.current = { trainV: action === "stopping" ? 5 : 0, ballRelV: 0, time: 0 };
    setTrainX(action === "stopping" ? 100 : 0);
    setBallRelX(0);

    let lastT = 0;
    const step = (t: number) => {
      if (!lastT) { lastT = t; animRef.current = requestAnimationFrame(step); return; }
      const dt = Math.min((t - lastT) / 1000, 0.05);
      lastT = t;
      const s = stateRef.current;
      s.time += dt;

      if (action === "starting") {
        s.trainV = Math.min(s.trainV + 4 * dt, 5);
        s.ballRelV -= 4 * dt * 0.6; // ball slides backward relative to train
        s.ballRelV *= 0.98; // damping
      } else if (action === "stopping") {
        s.trainV = Math.max(s.trainV - 6 * dt, 0);
        s.ballRelV += 6 * dt * 0.6; // ball slides forward relative to train
        s.ballRelV *= 0.98;
      } else {
        s.trainV = 5;
      }

      setTrainX(prev => prev + s.trainV * dt * 20);
      setBallRelX(prev => Math.max(-80, Math.min(80, prev + s.ballRelV * dt * 20)));

      if (s.time < 3) animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
  }, []);

  const reset = () => { cancelAnimationFrame(animRef.current); setTrainAction("rest"); setTrainX(0); setBallRelX(0); };

  return (
    <SimCard title="🚂 Ball on a Moving Train" description="A ball is on the floor of a train. When the train starts or stops suddenly, the ball rolls — this is inertia of motion!">
      <div style={{ background: "#020617", borderRadius: 12, padding: 20, minHeight: 200, position: "relative", overflow: "hidden" }}>
        {/* Track */}
        <div style={{ position: "absolute", bottom: 30, left: 0, right: 0, height: 4, background: "#475569" }} />
        <div style={{ position: "absolute", bottom: 26, left: 0, right: 0, display: "flex", gap: 20 }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} style={{ width: 16, height: 3, background: "#1e293b", flexShrink: 0, transform: `translateX(${-(trainX % 36)}px)` }} />
          ))}
        </div>

        {/* Train car */}
        <div style={{ position: "absolute", bottom: 34, left: "30%", width: 200, height: 80, background: "linear-gradient(135deg, #1e40af, #1e3a8a)", borderRadius: "12px 12px 4px 4px", border: "2px solid #3b82f6", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 6 }}>
          {/* Windows */}
          <div style={{ position: "absolute", top: 10, left: 15, right: 15, display: "flex", gap: 6 }}>
            {[0, 1, 2].map(i => <div key={i} style={{ flex: 1, height: 24, background: "#0c1427", borderRadius: 4, border: "1px solid #1e3a5f" }} />)}
          </div>
          {/* Ball */}
          <div style={{
            width: 24, height: 24, borderRadius: "50%",
            background: "radial-gradient(circle at 30% 30%, #fbbf24, #d97706)",
            boxShadow: "0 0 12px #f59e0b60",
            transform: `translateX(${ballRelX}px)`,
            transition: trainAction === "rest" ? "none" : undefined,
          }} />
        </div>

        {/* Info badge */}
        {trainAction !== "rest" && (
          <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", background: "#6366f130", padding: "6px 14px", borderRadius: 20, border: "1px solid #6366f1", color: "#a5b4fc", fontWeight: 700, fontSize: 12 }}>
            {trainAction === "starting" && "Train accelerating → Ball rolls BACKWARD (inertia of rest)"}
            {trainAction === "stopping" && "Train braking → Ball rolls FORWARD (inertia of motion)"}
            {trainAction === "moving" && "Constant speed → Ball stays still (no net force)"}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={() => runSim("starting")} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #10b981", background: "#10b98120", color: "#10b981", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>⚡ Train Starts</button>
        <button onClick={() => runSim("moving")} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #3b82f6", background: "#3b82f620", color: "#3b82f6", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>→ Constant Speed</button>
        <button onClick={() => runSim("stopping")} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #ef4444", background: "#ef444420", color: "#ef4444", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>🛑 Train Stops</button>
        <button onClick={reset} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #1e293b", background: "#0f172a", color: "#94a3b8", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>↺ Reset</button>
      </div>

      <Telemetry items={[
        { label: "Train", value: trainAction.toUpperCase(), color: "#3b82f6" },
        { label: "Ball Rolls", value: trainAction === "starting" ? "← Backward" : trainAction === "stopping" ? "→ Forward" : "Stationary", color: "#f59e0b" },
        { label: "Inertia Type", value: trainAction === "starting" ? "Rest" : trainAction === "stopping" ? "Motion" : "—", color: "#6366f1" },
        { label: "Net Force on Ball", value: trainAction === "moving" || trainAction === "rest" ? "0 N" : "Pseudo-force", color: "#ef4444" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 5. HAMMER HEAD TIGHTENING — Inertia Application
 * Hit handle on table → heavy head slides down due to inertia
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_hammer_head() {
  const [phase, setPhase] = useState<"loose" | "hitting" | "tight">("loose");
  const [headOffset, setHeadOffset] = useState(20);
  const [handleY, setHandleY] = useState(0);
  const [hits, setHits] = useState(0);
  const animRef = useRef<number>(0);

  const hit = () => {
    if (headOffset <= 0) return;
    setPhase("hitting");
    let t = 0;

    const animate = () => {
      t += 1;
      // Handle bounces up then back
      setHandleY(t < 5 ? -t * 3 : Math.max(0, (10 - t) * 3));

      if (t === 5) {
        // Head slides down at impact
        setHeadOffset(prev => Math.max(0, prev - 5));
        setHits(prev => prev + 1);
      }

      if (t < 15) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setHandleY(0);
        setPhase(headOffset <= 5 ? "tight" : "loose");
      }
    };
    animRef.current = requestAnimationFrame(animate);
  };

  const reset = () => { cancelAnimationFrame(animRef.current); setPhase("loose"); setHeadOffset(20); setHandleY(0); setHits(0); };

  return (
    <SimCard title="🔨 Hammer Head Tightening — Inertia Application" description="When you bang the handle on a table, the handle stops but the heavy head keeps moving down — tightening onto the handle!">
      <div style={{ background: "#020617", borderRadius: 12, padding: 30, minHeight: 280, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "relative", transform: `translateY(${handleY}px)` }}>
          {/* Handle */}
          <div style={{ width: 16, height: 180, background: "linear-gradient(180deg, #92400e, #78350f)", borderRadius: 4, margin: "0 auto" }} />
          {/* Head */}
          <div style={{
            position: "absolute", top: headOffset, left: "50%", transform: "translateX(-50%)",
            width: 70, height: 35, borderRadius: 6,
            background: "linear-gradient(135deg, #6b7280, #4b5563)",
            border: "2px solid #9ca3af",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#d1d5db", fontSize: 10, fontWeight: 700 }}>STEEL HEAD</span>
          </div>
          {/* Gap indicator */}
          {headOffset > 0 && (
            <div style={{ position: "absolute", top: headOffset + 35, left: "50%", transform: "translateX(-50%)", width: 2, height: headOffset, background: "#ef4444", borderRadius: 1 }}>
              <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#ef4444", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>gap: {headOffset}mm</span>
            </div>
          )}
        </div>

        {/* Table surface */}
        <div style={{ position: "absolute", bottom: 30, left: 60, right: 60, height: 8, background: "#78350f", borderRadius: 3 }} />

        {phase === "tight" && (
          <div style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", background: "#10b98130", padding: "8px 20px", borderRadius: 20, border: "1px solid #10b981", color: "#10b981", fontWeight: 700 }}>
            ✓ Head is tight! Inertia won!
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
        <button onClick={hit} disabled={phase === "tight"} style={{
          padding: "10px 24px", borderRadius: 10, border: "none", cursor: phase === "tight" ? "not-allowed" : "pointer",
          fontWeight: 700, background: phase === "tight" ? "#1e293b" : "#f59e0b", color: "#0f172a", opacity: phase === "tight" ? 0.5 : 1,
        }}>BANG ON TABLE!</button>
        <button onClick={reset} style={{ padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, background: "#1e293b", color: "#cbd5e1" }}>RESET</button>
      </div>

      <Telemetry items={[
        { label: "Hits", value: `${hits}`, color: "#f59e0b" },
        { label: "Gap", value: `${headOffset}mm`, color: headOffset > 0 ? "#ef4444" : "#10b981" },
        { label: "Head Status", value: headOffset > 10 ? "LOOSE" : headOffset > 0 ? "ALMOST TIGHT" : "TIGHT ✓", color: headOffset > 0 ? "#f59e0b" : "#10b981" },
        { label: "Principle", value: "Inertia of Motion", color: "#6366f1" },
      ]} />
    </SimCard>
  );
}
