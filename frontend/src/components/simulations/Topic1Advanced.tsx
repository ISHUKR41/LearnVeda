"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

/* ══════════════════════════════════════════════════════════════════
 * SHARED SIMULATION WRAPPER
 * Premium card with dark theme matching ForceEngine aesthetic
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
  const colors = { primary: { bg: "#10b981", text: "#0f172a", hover: "#34d399" }, secondary: { bg: "#1e293b", text: "#cbd5e1", hover: "#334155" }, danger: { bg: "#ef4444", text: "#fff", hover: "#f87171" } };
  const c = colors[variant];
  return <button onClick={onClick} style={{ padding: "10px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", background: c.bg, color: c.text, transition: "all 0.2s" }}>{label}</button>;
}

/* ══════════════════════════════════════════════════════════════════
 * 1. FREE BODY DIAGRAM BUILDER
 * Drag force arrows onto a block, see net force calculate live
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_fbd_builder() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [forces, setForces] = useState({ up: 0, down: 50, left: 0, right: 0 });
  const [showNet, setShowNet] = useState(true);
  const animRef = useRef<number>(0);

  const netX = forces.right - forces.left;
  const netY = forces.down - forces.up;
  const netMag = Math.sqrt(netX * netX + netY * netY);
  const isBalanced = netMag < 0.5;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;

    ctx.clearRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Block
    const bw = 80, bh = 80;
    const grad = ctx.createLinearGradient(cx - bw / 2, cy - bh / 2, cx + bw / 2, cy + bh / 2);
    grad.addColorStop(0, "#6366f1"); grad.addColorStop(1, "#8b5cf6");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(cx - bw / 2, cy - bh / 2, bw, bh, 12);
    ctx.fill();
    ctx.strokeStyle = "#a5b4fc"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(cx - bw / 2, cy - bh / 2, bw, bh, 12); ctx.stroke();

    // Block label
    ctx.fillStyle = "#fff"; ctx.font = "bold 16px Inter, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("5 kg", cx, cy);

    // Draw force arrows
    const drawArrow = (fx: number, fy: number, mag: number, color: string, label: string) => {
      if (mag < 1) return;
      const scale = 1.5;
      const ex = cx + fx * scale, ey = cy + fy * scale;
      const angle = Math.atan2(fy, fx);
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * 45, cy + Math.sin(angle) * 45);
      ctx.lineTo(ex, ey);
      ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.stroke();
      // Arrowhead
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex - 10 * Math.cos(angle - 0.4), ey - 10 * Math.sin(angle - 0.4));
      ctx.lineTo(ex - 10 * Math.cos(angle + 0.4), ey - 10 * Math.sin(angle + 0.4));
      ctx.closePath(); ctx.fillStyle = color; ctx.fill();
      // Label
      ctx.fillStyle = color; ctx.font = "bold 13px JetBrains Mono, monospace"; ctx.textAlign = "center";
      ctx.fillText(`${label}: ${mag}N`, ex + Math.cos(angle) * 20, ey + Math.sin(angle) * 20);
    };

    drawArrow(forces.right, 0, forces.right, "#10b981", "→");
    drawArrow(-forces.left, 0, forces.left, "#ef4444", "←");
    drawArrow(0, -forces.up, forces.up, "#3b82f6", "↑");
    drawArrow(0, forces.down, forces.down, "#f59e0b", "↓");

    // Net force vector
    if (showNet && !isBalanced) {
      ctx.beginPath();
      ctx.setLineDash([6, 4]);
      const nex = cx + netX * 1.5, ney = cy + netY * 1.5;
      ctx.moveTo(cx, cy); ctx.lineTo(nex, ney);
      ctx.strokeStyle = "#e879f9"; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#e879f9"; ctx.font = "bold 14px JetBrains Mono, monospace";
      ctx.fillText(`Net: ${netMag.toFixed(1)}N`, nex, ney - 10);
    }

    // Balanced indicator
    if (isBalanced) {
      ctx.fillStyle = "#10b98130"; ctx.beginPath(); ctx.arc(cx, cy - 60, 20, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#10b981"; ctx.font = "bold 18px Inter"; ctx.textAlign = "center";
      ctx.fillText("✓", cx, cy - 55);
      ctx.font = "bold 12px Inter"; ctx.fillText("BALANCED", cx, cy - 38);
    }

    animRef.current = requestAnimationFrame(draw);
  }, [forces, showNet, isBalanced, netMag, netX, netY]);

  useEffect(() => { animRef.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(animRef.current); }, [draw]);

  const SliderRow = ({ label, value, color, dir }: { label: string; value: number; color: string; dir: "up" | "down" | "left" | "right" }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ color, fontWeight: 700, fontSize: 13, width: 80 }}>{label}</span>
      <input type="range" min={0} max={200} value={value} onChange={(e) => setForces(p => ({ ...p, [dir]: +e.target.value }))} style={{ flex: 1, accentColor: color }} />
      <span style={{ color, fontFamily: "JetBrains Mono", fontSize: 13, width: 50 }}>{value}N</span>
    </div>
  );

  return (
    <SimCard title="🎯 Interactive Free Body Diagram Builder" description="Add forces to the block and watch the net force calculate in real-time. Can you make it balanced?">
      <canvas ref={canvasRef} width={600} height={350} style={{ width: "100%", height: 350, borderRadius: 12, background: "#020617" }} />
      <div style={{ display: "grid", gap: 8, marginTop: 16, background: "#0f172a", padding: 16, borderRadius: 12, border: "1px solid #1e293b" }}>
        <SliderRow label="↑ Up" value={forces.up} color="#3b82f6" dir="up" />
        <SliderRow label="↓ Down" value={forces.down} color="#f59e0b" dir="down" />
        <SliderRow label="← Left" value={forces.left} color="#ef4444" dir="left" />
        <SliderRow label="→ Right" value={forces.right} color="#10b981" dir="right" />
      </div>
      <Telemetry items={[
        { label: "Net Horizontal", value: `${netX.toFixed(1)} N`, color: netX === 0 ? "#10b981" : "#e879f9" },
        { label: "Net Vertical", value: `${netY.toFixed(1)} N`, color: netY === 0 ? "#10b981" : "#e879f9" },
        { label: "Net Magnitude", value: `${netMag.toFixed(1)} N`, color: isBalanced ? "#10b981" : "#f59e0b" },
        { label: "Status", value: isBalanced ? "BALANCED" : "UNBALANCED", color: isBalanced ? "#10b981" : "#ef4444" },
      ]} />
      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
        <ControlButton onClick={() => setForces({ up: 50, down: 50, left: 0, right: 0 })} label="BALANCE VERTICAL" variant="primary" />
        <ControlButton onClick={() => setForces({ up: 0, down: 50, left: 0, right: 0 })} label="RESET" variant="secondary" />
        <ControlButton onClick={() => setShowNet(!showNet)} label={showNet ? "HIDE NET" : "SHOW NET"} variant="secondary" />
      </div>
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 2. ELEVATOR WEIGHING SCALE
 * Shows apparent weight changing in accelerating elevator
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_elevator_scale() {
  const [mass] = useState(60);
  const [mode, setMode] = useState<"rest" | "up-accel" | "up-decel" | "down-accel" | "down-decel" | "freefall">("rest");
  const [time, setTime] = useState(0);
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef(0);

  const g = 9.8;
  const accelMap = { rest: 0, "up-accel": 3, "up-decel": -3, "down-accel": -3, "down-decel": 3, freefall: -g };
  const a = accelMap[mode];
  const apparentWeight = mass * (g + a);
  const realWeight = mass * g;
  const ratio = apparentWeight / realWeight;

  useEffect(() => {
    const step = (t: number) => {
      if (lastTimeRef.current) {
        const dt = (t - lastTimeRef.current) / 1000;
        setTime(prev => prev + dt);
      }
      lastTimeRef.current = t;
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [mode]);

  const floorY = mode === "rest" ? 0 : Math.sin(time * 2) * (mode === "freefall" ? 15 : 5);

  return (
    <SimCard title="⚖️ Elevator Weighing Scale" description="Stand on a scale inside an elevator. Watch your apparent weight change as the elevator accelerates!">
      <div style={{ display: "flex", gap: 24, alignItems: "stretch" }}>
        <div style={{ flex: 1, background: "#020617", borderRadius: 12, padding: 20, position: "relative", minHeight: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          {/* Elevator walls */}
          <div style={{ position: "absolute", left: 20, top: 10, bottom: 10, width: 3, background: "#334155", borderRadius: 2 }} />
          <div style={{ position: "absolute", right: 20, top: 10, bottom: 10, width: 3, background: "#334155", borderRadius: 2 }} />
          <div style={{ position: "absolute", top: 10, left: 20, right: 20, height: 3, background: "#334155" }} />

          {/* Floor indicator */}
          <div style={{ position: "absolute", bottom: 30, left: 40, right: 40, textAlign: "center", transform: `translateY(${floorY}px)`, transition: "transform 0.1s" }}>
            {/* Scale */}
            <div style={{ width: 120, height: 30, margin: "0 auto", background: `linear-gradient(135deg, ${ratio > 1.05 ? "#ef4444" : ratio < 0.95 ? "#3b82f6" : "#10b981"}, ${ratio > 1.05 ? "#dc2626" : ratio < 0.95 ? "#2563eb" : "#059669"})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 20px ${ratio > 1.05 ? "#ef444440" : ratio < 0.95 ? "#3b82f640" : "#10b98140"}` }}>
              <span style={{ color: "#fff", fontWeight: 700, fontFamily: "JetBrains Mono", fontSize: 16 }}>{apparentWeight.toFixed(1)} N</span>
            </div>
            {/* Person */}
            <div style={{ fontSize: 48, marginBottom: 4 }}>🧍</div>
          </div>

          {/* Direction arrow */}
          {mode !== "rest" && (
            <div style={{ position: "absolute", top: 30, right: 40, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: 24, color: "#f59e0b" }}>{a > 0 ? "⬆" : "⬇"}</span>
              <span style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700 }}>a = {Math.abs(a).toFixed(1)} m/s²</span>
            </div>
          )}
        </div>

        <div style={{ width: 200, display: "flex", flexDirection: "column", gap: 8 }}>
          {(["rest", "up-accel", "up-decel", "down-accel", "down-decel", "freefall"] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setTime(0); lastTimeRef.current = 0; }} style={{
              padding: "8px 12px", borderRadius: 8, border: mode === m ? "2px solid #6366f1" : "1px solid #1e293b",
              background: mode === m ? "#6366f120" : "#0f172a", color: mode === m ? "#a5b4fc" : "#94a3b8",
              cursor: "pointer", fontWeight: 600, fontSize: 12, textAlign: "left",
            }}>
              {m === "rest" && "🛑 At Rest"}
              {m === "up-accel" && "⬆️ Going Up (Accel)"}
              {m === "up-decel" && "⬆️ Going Up (Decel)"}
              {m === "down-accel" && "⬇️ Going Down (Accel)"}
              {m === "down-decel" && "⬇️ Going Down (Decel)"}
              {m === "freefall" && "💀 FREE FALL!"}
            </button>
          ))}
        </div>
      </div>
      <Telemetry items={[
        { label: "Real Weight", value: `${realWeight.toFixed(1)} N`, color: "#94a3b8" },
        { label: "Apparent Weight", value: `${apparentWeight.toFixed(1)} N`, color: ratio > 1.05 ? "#ef4444" : ratio < 0.95 ? "#3b82f6" : "#10b981" },
        { label: "Acceleration", value: `${a.toFixed(1)} m/s²`, color: "#f59e0b" },
        { label: "Feel", value: ratio > 1.05 ? "HEAVIER" : ratio < 0.95 ? "LIGHTER" : ratio < 0.01 ? "WEIGHTLESS" : "NORMAL", color: ratio > 1.05 ? "#ef4444" : ratio < 0.95 ? "#3b82f6" : "#10b981" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 3. PARACHUTE TERMINAL VELOCITY
 * Skydiver falling — air resistance increases until terminal velocity
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_parachute_terminal() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [parachuteOpen, setParachuteOpen] = useState(false);
  const stateRef = useRef({ v: 0, y: 0, t: 0, drag: 0 });
  const [display, setDisplay] = useState({ v: 0, y: 0, drag: 0, weight: 700 });
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);

  const mass = 70, g = 9.8, weight = mass * g;
  const dragCoeff = parachuteOpen ? 1.2 : 0.15;

  const step = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    const s = stateRef.current;
    const dragForce = dragCoeff * s.v * s.v;
    const netForce = weight - dragForce;
    const a = netForce / mass;
    s.v = Math.max(0, s.v + a * dt);
    s.y += s.v * dt;
    s.t += dt;
    s.drag = dragForce;
    setDisplay({ v: s.v, y: s.y, drag: dragForce, weight });
    animRef.current = requestAnimationFrame(step);
  }, [dragCoeff, weight, mass]);

  useEffect(() => {
    if (isPlaying) { lastRef.current = 0; animRef.current = requestAnimationFrame(step); }
    else cancelAnimationFrame(animRef.current);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, step]);

  const reset = () => { setIsPlaying(false); stateRef.current = { v: 0, y: 0, t: 0, drag: 0 }; setDisplay({ v: 0, y: 0, drag: 0, weight }); setParachuteOpen(false); };
  const isTerminal = Math.abs(display.v * display.v * dragCoeff - weight) < 5 && display.v > 1;
  const barH = Math.min((display.v / 60) * 100, 100);
  const dragBarH = Math.min((display.drag / weight) * 100, 100);

  return (
    <SimCard title="🪂 Parachute & Terminal Velocity" description="Watch how air resistance grows with speed until it equals gravity — creating terminal velocity!">
      <div style={{ display: "flex", gap: 20, alignItems: "stretch" }}>
        <div style={{ flex: 1, background: "linear-gradient(180deg, #1e3a5f 0%, #0f172a 40%, #064e3b 100%)", borderRadius: 12, padding: 20, minHeight: 300, position: "relative", overflow: "hidden" }}>
          {/* Clouds */}
          <div style={{ position: "absolute", top: 20 + (display.y % 200), left: 30, fontSize: 30, opacity: 0.3 }}>☁️</div>
          <div style={{ position: "absolute", top: 80 + (display.y % 200), right: 40, fontSize: 24, opacity: 0.2 }}>☁️</div>
          {/* Skydiver */}
          <div style={{ position: "absolute", left: "50%", top: "40%", transform: "translateX(-50%)", textAlign: "center" }}>
            {parachuteOpen && <div style={{ fontSize: 50, marginBottom: -10 }}>🪂</div>}
            <div style={{ fontSize: 40 }}>🧑‍🦯</div>
            {/* Force arrows */}
            <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: -30 }}>
              <div style={{ width: 4, height: Math.min(display.drag / 10, 60), background: "#3b82f6", margin: "0 auto", borderRadius: 2 }} />
              <span style={{ fontSize: 10, color: "#3b82f6", fontWeight: 700 }}>Drag: {display.drag.toFixed(0)}N</span>
            </div>
          </div>
          {isTerminal && (
            <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", background: "#10b98130", padding: "6px 16px", borderRadius: 20, border: "1px solid #10b981", color: "#10b981", fontWeight: 700, fontSize: 13 }}>
              TERMINAL VELOCITY REACHED ✓
            </div>
          )}
        </div>
        {/* Velocity & Drag bars */}
        <div style={{ width: 80, display: "flex", gap: 12 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "#f59e0b", fontWeight: 700, marginBottom: 4 }}>Speed</span>
            <div style={{ flex: 1, width: 24, background: "#1e293b", borderRadius: 12, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", bottom: 0, width: "100%", height: `${barH}%`, background: "linear-gradient(0deg, #f59e0b, #ef4444)", borderRadius: 12, transition: "height 0.1s" }} />
            </div>
            <span style={{ fontSize: 11, color: "#f59e0b", fontFamily: "JetBrains Mono", marginTop: 4 }}>{display.v.toFixed(0)}</span>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "#3b82f6", fontWeight: 700, marginBottom: 4 }}>Drag</span>
            <div style={{ flex: 1, width: 24, background: "#1e293b", borderRadius: 12, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", bottom: 0, width: "100%", height: `${dragBarH}%`, background: "linear-gradient(0deg, #3b82f6, #06b6d4)", borderRadius: 12, transition: "height 0.1s" }} />
            </div>
            <span style={{ fontSize: 11, color: "#3b82f6", fontFamily: "JetBrains Mono", marginTop: 4 }}>{display.drag.toFixed(0)}</span>
          </div>
        </div>
      </div>
      <Telemetry items={[
        { label: "Speed", value: `${display.v.toFixed(1)} m/s`, color: "#f59e0b" },
        { label: "Distance", value: `${display.y.toFixed(0)} m`, color: "#94a3b8" },
        { label: "Air Drag", value: `${display.drag.toFixed(0)} N`, color: "#3b82f6" },
        { label: "Weight", value: `${weight.toFixed(0)} N`, color: "#ef4444" },
      ]} />
      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
        <ControlButton onClick={() => setIsPlaying(!isPlaying)} label={isPlaying ? "PAUSE" : "JUMP!"} variant={isPlaying ? "danger" : "primary"} />
        <ControlButton onClick={() => setParachuteOpen(true)} label="OPEN PARACHUTE" variant="secondary" />
        <ControlButton onClick={reset} label="RESET" variant="secondary" />
      </div>
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 4. SPRING BALANCE VISUALIZATION
 * Hang weights from a spring — see extension proportional to force
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_spring_balance() {
  const [weight, setWeight] = useState(20);
  const k = 5; // spring constant N/cm
  const extension = weight / k;
  const naturalLength = 100;
  const currentLength = naturalLength + extension * 8;

  return (
    <SimCard title="🔩 Spring Balance — Hooke's Law" description="Hang different weights from a spring. The extension is directly proportional to the applied force (F = kx).">
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ flex: 1, background: "#020617", borderRadius: 12, padding: 20, display: "flex", justifyContent: "center", minHeight: 350 }}>
          <svg width="200" height="340" viewBox="0 0 200 340">
            {/* Support bar */}
            <rect x="50" y="10" width="100" height="10" rx="4" fill="#475569" />
            {/* Spring coils */}
            {Array.from({ length: 12 }).map((_, i) => {
              const yStart = 20 + (i * (currentLength / 12));
              const xOff = i % 2 === 0 ? 30 : -30;
              return <line key={i} x1={100 + (i > 0 ? (i % 2 === 0 ? -30 : 30) : 0)} y1={yStart} x2={100 + xOff} y2={yStart + currentLength / 12} stroke="#6366f1" strokeWidth="3" />;
            })}
            {/* Weight block */}
            <rect x="70" y={20 + currentLength} width="60" height="50" rx="8" fill="url(#weightGrad)" stroke="#f59e0b" strokeWidth="2" />
            <defs><linearGradient id="weightGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#d97706" /></linearGradient></defs>
            <text x="100" y={50 + currentLength} textAnchor="middle" fill="#fff" fontWeight="700" fontSize="14" fontFamily="JetBrains Mono">{weight}N</text>
            {/* Force arrow down */}
            <line x1="100" y1={75 + currentLength} x2="100" y2={75 + currentLength + Math.min(weight, 60)} stroke="#ef4444" strokeWidth="3" />
            <polygon points={`100,${80 + currentLength + Math.min(weight, 60)} 94,${72 + currentLength + Math.min(weight, 60)} 106,${72 + currentLength + Math.min(weight, 60)}`} fill="#ef4444" />
            {/* Extension marker */}
            <line x1="170" y1={20 + naturalLength} x2="170" y2={20 + currentLength} stroke="#10b981" strokeWidth="2" strokeDasharray="4,3" />
            <text x="180" y={20 + naturalLength + (currentLength - naturalLength) / 2} fill="#10b981" fontSize="11" fontWeight="700" fontFamily="JetBrains Mono">x={extension.toFixed(1)}cm</text>
          </svg>
        </div>
        <div style={{ width: 200, display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ color: "#f59e0b", fontWeight: 700, fontSize: 13, display: "flex", justifyContent: "space-between" }}>
              <span>Weight (N)</span><span>{weight} N</span>
            </label>
            <input type="range" min={0} max={100} value={weight} onChange={e => setWeight(+e.target.value)} style={{ width: "100%", accentColor: "#f59e0b" }} />
          </div>
          <div style={{ background: "#0f172a", padding: 14, borderRadius: 10, border: "1px solid #1e293b" }}>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>HOOKE'S LAW</div>
            <div style={{ color: "#6366f1", fontFamily: "JetBrains Mono", fontSize: 16, fontWeight: 700 }}>F = k × x</div>
            <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 6 }}>{weight}N = {k} × {extension.toFixed(1)}cm</div>
          </div>
          <div style={{ background: "#0f172a", padding: 14, borderRadius: 10, border: "1px solid #1e293b" }}>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>SPRING CONSTANT</div>
            <div style={{ color: "#10b981", fontFamily: "JetBrains Mono", fontSize: 16, fontWeight: 700 }}>k = {k} N/cm</div>
          </div>
        </div>
      </div>
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 5. FRICTION SURFACES COMPARISON
 * Same force applied on different surfaces — compare accelerations
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_friction_surfaces() {
  const [force, setForce] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const mass = 10;
  const g = 9.8;

  const surfaces = [
    { name: "Ice", mu: 0.03, color: "#06b6d4", emoji: "🧊" },
    { name: "Wood", mu: 0.3, color: "#f59e0b", emoji: "🪵" },
    { name: "Rubber", mu: 0.7, color: "#ef4444", emoji: "🔴" },
    { name: "Sand", mu: 1.0, color: "#a3703c", emoji: "🏖️" },
  ];

  const [positions, setPositions] = useState(surfaces.map(() => 0));
  const posRef = useRef(surfaces.map(() => ({ x: 0, v: 0 })));
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);

  const step = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(step); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    const newPos = posRef.current.map((s, i) => {
      const friction = surfaces[i].mu * mass * g;
      const net = Math.max(0, force - friction);
      const a = net / mass;
      const v = s.v + a * dt;
      const x = Math.min(s.x + v * dt * 5, 400);
      return { x, v };
    });
    posRef.current = newPos;
    setPositions(newPos.map(p => p.x));
    animRef.current = requestAnimationFrame(step);
  }, [force, surfaces, mass, g]);

  useEffect(() => {
    if (isPlaying) { lastRef.current = 0; animRef.current = requestAnimationFrame(step); }
    else cancelAnimationFrame(animRef.current);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, step]);

  const reset = () => {
    setIsPlaying(false);
    posRef.current = surfaces.map(() => ({ x: 0, v: 0 }));
    setPositions(surfaces.map(() => 0));
  };

  return (
    <SimCard title="🏁 Friction Surface Race" description="Apply the same force to identical blocks on different surfaces. See how friction changes acceleration!">
      <div style={{ background: "#020617", borderRadius: 12, padding: 20 }}>
        {surfaces.map((s, i) => {
          const friction = s.mu * mass * g;
          const net = Math.max(0, force - friction);
          const accel = net / mass;
          const moves = force > friction;
          return (
            <div key={s.name} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 18 }}>{s.emoji}</span>
                <span style={{ color: s.color, fontWeight: 700, fontSize: 13, width: 60 }}>{s.name}</span>
                <span style={{ color: "#64748b", fontSize: 11, fontFamily: "JetBrains Mono" }}>μ={s.mu} | f={friction.toFixed(0)}N | a={accel.toFixed(1)}m/s²</span>
              </div>
              <div style={{ height: 36, background: `${s.color}15`, borderRadius: 8, position: "relative", overflow: "hidden", border: `1px solid ${s.color}30` }}>
                {/* Surface texture */}
                <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(90deg, transparent, transparent 8px, ${s.color}08 8px, ${s.color}08 9px)` }} />
                {/* Block */}
                <div style={{ position: "absolute", left: positions[i], top: 3, width: 30, height: 30, background: `linear-gradient(135deg, #6366f1, #8b5cf6)`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", transition: isPlaying ? "none" : "left 0.3s", boxShadow: `0 0 10px ${moves ? "#6366f180" : "#6366f130"}` }}>
                  <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{mass}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 16, background: "#0f172a", padding: 16, borderRadius: 12, border: "1px solid #1e293b" }}>
        <label style={{ color: "#10b981", fontWeight: 700, fontSize: 13, display: "flex", justifyContent: "space-between" }}>
          <span>Applied Force</span><span>{force} N</span>
        </label>
        <input type="range" min={0} max={200} value={force} onChange={e => { setForce(+e.target.value); if (!isPlaying) reset(); }} style={{ width: "100%", accentColor: "#10b981" }} />
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
        <ControlButton onClick={() => setIsPlaying(!isPlaying)} label={isPlaying ? "PAUSE" : "RACE!"} variant={isPlaying ? "danger" : "primary"} />
        <ControlButton onClick={reset} label="RESET" variant="secondary" />
      </div>
    </SimCard>
  );
}
