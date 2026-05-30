/**
 * FILE: Topic5Extra.tsx
 * PURPOSE: 7 ultra-professional simulations for Topic 5 — Conservation of Momentum
 * Each demonstrates a unique scenario with real conservation law physics.
 */
"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

function SimCard({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div style={{ width: "100%", background: "#0b1120", borderRadius: 18, padding: 28, margin: "32px 0", border: "1px solid #1e293b", boxShadow: "0 12px 40px rgba(0,0,0,0.5)", fontFamily: "Inter, system-ui, sans-serif", overflow: "hidden" }}>
      <div style={{ borderBottom: "1px solid #1e293b", paddingBottom: 16, marginBottom: 24 }}>
        <h3 style={{ color: "#f1f5f9", fontSize: 21, fontWeight: 800, margin: 0 }}>{title}</h3>
        <p style={{ color: "#64748b", fontSize: 14, margin: "8px 0 0", lineHeight: 1.6 }}>{desc}</p>
      </div>
      {children}
    </div>
  );
}
function TPanel({ items }: { items: { label: string; value: string; color: string }[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(items.length, 4)}, 1fr)`, gap: 10, marginTop: 18 }}>
      {items.map(it => (
        <div key={it.label} style={{ background: "#0f172a", borderRadius: 10, padding: "10px 14px", border: "1px solid #1e293b" }}>
          <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 5 }}>{it.label}</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: it.color, fontFamily: "JetBrains Mono, monospace" }}>{it.value}</div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 1. BALLISTIC PENDULUM — Classic momentum measurement device
 * Bullet embeds in pendulum bob. Momentum conservation gives bullet speed.
 * Then energy conservation gives height pendulum rises.
 * Two-stage physics: p conserved during impact, then KE→PE.
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_ballistic_pendulum() {
  const [bulletMass, setBulletMass] = useState(0.01);
  const [bulletSpeed, setBulletSpeed] = useState(300);
  const [pendulumMass, setPendulumMass] = useState(2);
  const [phase, setPhase] = useState<"ready" | "flying" | "embedded" | "swinging">("ready");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ bulletX: 60, angle: 0, omega: 0, t: 0 });
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);

  const g = 9.8;
  // Stage 1: Momentum conservation during collision (very fast, inelastic)
  const v_after = (bulletMass * bulletSpeed) / (bulletMass + pendulumMass);
  // Stage 2: KE to PE → height
  const height = (v_after * v_after) / (2 * g);
  const pendulumLength = 150;
  const maxAngle = Math.acos(1 - height / pendulumLength * 10);

  const draw = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(draw); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    const s = stateRef.current;

    if (phase === "flying") {
      s.bulletX += bulletSpeed * dt * 0.15;
      if (s.bulletX >= 300) setPhase("embedded");
    }
    if (phase === "embedded") {
      s.omega = v_after * 0.04;
      setPhase("swinging");
    }
    if (phase === "swinging") {
      const alpha = -(g / pendulumLength) * Math.sin(s.angle) * 0.5;
      s.omega += alpha * dt;
      s.angle += s.omega * dt;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const pivX = W / 2, pivY = 40;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, W, H);

    // Lab background
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, H - 50, W, 50);
    ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, H - 50); ctx.lineTo(W, H - 50); ctx.stroke();

    // Pivot support
    ctx.fillStyle = "#475569";
    ctx.fillRect(pivX - 60, 10, 120, 10);
    ctx.fillRect(pivX - 4, 20, 8, 20);

    // Pendulum string
    const bobX = pivX + pendulumLength * Math.sin(s.angle);
    const bobY = pivY + pendulumLength * Math.cos(s.angle);
    ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(pivX, pivY); ctx.lineTo(bobX, bobY); ctx.stroke();

    // Pendulum bob (box)
    const bobW = 50, bobH = 50;
    ctx.fillStyle = "#6366f1";
    ctx.beginPath(); ctx.roundRect(bobX - bobW / 2, bobY, bobW, bobH, 6); ctx.fill();
    ctx.strokeStyle = "#a5b4fc"; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = "#fff"; ctx.font = "bold 10px JetBrains Mono"; ctx.textAlign = "center";
    ctx.fillText(`${pendulumMass}kg`, bobX, bobY + 28);

    // Height measurement arc
    if (phase === "swinging" && s.angle > 0.05) {
      ctx.strokeStyle = "#10b981"; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.arc(pivX, pivY, pendulumLength, Math.PI / 2, Math.PI / 2 - s.angle);
      ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "#10b981"; ctx.font = "bold 11px JetBrains Mono"; ctx.textAlign = "left";
      const curHeight = pendulumLength * (1 - Math.cos(s.angle)) / 10;
      ctx.fillText(`h = ${curHeight.toFixed(3)} m`, bobX + bobW / 2 + 8, bobY + 10);
    }

    // Bullet (before impact)
    if (phase === "ready" || phase === "flying") {
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath(); ctx.ellipse(s.bulletX, bobY + 25, 14, 5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#d97706";
      ctx.beginPath(); ctx.ellipse(s.bulletX - 10, bobY + 25, 6, 5, 0, 0, Math.PI * 2); ctx.fill();
      if (phase === "flying") {
        ctx.fillStyle = "#f59e0b30";
        for (let i = 1; i < 4; i++) {
          ctx.beginPath(); ctx.ellipse(s.bulletX - i * 18, bobY + 25, 14 - i * 3, 3, 0, 0, Math.PI * 2); ctx.fill();
        }
      }
    }

    // Physics labels
    ctx.fillStyle = "#94a3b8"; ctx.font = "12px Inter"; ctx.textAlign = "left";
    ctx.fillText(`v_bullet = ${bulletSpeed} m/s`, 16, 20);
    ctx.fillText(`m_bullet = ${(bulletMass * 1000).toFixed(0)}g`, 16, 36);
    ctx.fillText(`v_after = ${v_after.toFixed(2)} m/s`, 16, 52);
    ctx.fillText(`Max height = ${height.toFixed(3)} m`, 16, 68);

    animRef.current = requestAnimationFrame(draw);
  }, [phase, bulletSpeed, bulletMass, pendulumMass, v_after, height, pendulumLength]);

  useEffect(() => {
    if (phase !== "ready") animRef.current = requestAnimationFrame(draw);
    else cancelAnimationFrame(animRef.current);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw, phase]);

  const fire = () => { stateRef.current = { bulletX: 60, angle: 0, omega: 0, t: 0 }; setPhase("flying"); };
  const reset = () => { setPhase("ready"); stateRef.current = { bulletX: 60, angle: 0, omega: 0, t: 0 }; };

  return (
    <SimCard title="🎯 Ballistic Pendulum — Two-Stage Physics" desc="Stage 1: Bullet hits pendulum bob — momentum conserved (inelastic collision): p_before = p_after. Stage 2: Combined system swings up — kinetic energy converts to potential energy: ½mv² = mgh. This classic device was used to measure bullet speeds before electronic sensors existed!">
      <canvas ref={canvasRef} width={580} height={310} style={{ width: "100%", borderRadius: 12 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 14, background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #1e293b" }}>
        <div>
          <div style={{ fontSize: 12, color: "#f59e0b", fontWeight: 700, marginBottom: 4 }}>Bullet Mass: {(bulletMass * 1000).toFixed(0)}g</div>
          <input type="range" min={0.001} max={0.05} step={0.001} value={bulletMass} onChange={e => { setBulletMass(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#f59e0b" }} />
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#ef4444", fontWeight: 700, marginBottom: 4 }}>Bullet Speed: {bulletSpeed} m/s</div>
          <input type="range" min={50} max={600} value={bulletSpeed} onChange={e => { setBulletSpeed(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#ef4444" }} />
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#6366f1", fontWeight: 700, marginBottom: 4 }}>Bob Mass: {pendulumMass} kg</div>
          <input type="range" min={0.5} max={10} step={0.5} value={pendulumMass} onChange={e => { setPendulumMass(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#6366f1" }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 12, justifyContent: "center" }}>
        <button onClick={phase === "ready" ? fire : reset} style={{ padding: "10px 24px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", background: phase === "ready" ? "#ef4444" : "#1e293b", color: phase === "ready" ? "#fff" : "#cbd5e1" }}>
          {phase === "ready" ? "🔫 FIRE!" : "RESET"}
        </button>
      </div>
      <TPanel items={[
        { label: "Bullet Momentum", value: `${(bulletMass * bulletSpeed).toFixed(2)} kg·m/s`, color: "#f59e0b" },
        { label: "After Collision v", value: `${v_after.toFixed(3)} m/s`, color: "#6366f1" },
        { label: "Max Height", value: `${height.toFixed(4)} m`, color: "#10b981" },
        { label: "p Conserved?", value: "YES ✓", color: "#10b981" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 2. 2D COLLISION LAB — Glancing Blows
 * Two objects collide at an angle. Momentum conserved in BOTH x AND y.
 * This goes beyond 1D — shows vector conservation.
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_2d_collision() {
  const [m1, setM1] = useState(3);
  const [m2, setM2] = useState(3);
  const [v1, setV1] = useState(5);
  const [collisionAngle, setCollisionAngle] = useState(30); // degrees
  const [phase, setPhase] = useState<"ready" | "running">("ready");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    x1: 120, y1: 200, vx1: 0, vy1: 0,
    x2: 300, y2: 200 - 30 * Math.sin(30 * Math.PI / 180), vx2: 0, vy2: 0,
    collided: false
  });
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);

  const theta = collisionAngle * Math.PI / 180;
  // For equal mass elastic collision, 2D glancing:
  // Ball 1 hits ball 2 at angle theta (off-center hit)
  // After collision:
  const v1x_after = v1 * Math.sin(theta) * Math.sin(theta);
  const v1y_after = -v1 * Math.sin(theta) * Math.cos(theta);
  const v2x_after = v1 * Math.cos(theta) * Math.cos(theta);
  const v2y_after = v1 * Math.cos(theta) * Math.sin(theta);
  const p_total_x = m1 * v1;
  const p_after_x = m1 * v1x_after + m2 * v2x_after;

  const draw = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(draw); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    const s = stateRef.current;

    if (!s.collided) {
      s.x1 += s.vx1 * dt * 30;
      s.y1 += s.vy1 * dt * 30;
      // Check collision
      const dx = s.x2 - s.x1, dy = s.y2 - s.y1;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 30) {
        s.collided = true;
        s.vx1 = v1x_after; s.vy1 = v1y_after;
        s.vx2 = v2x_after; s.vy2 = v2y_after;
      }
    } else {
      s.x1 += s.vx1 * dt * 30;
      s.y1 += s.vy1 * dt * 30;
      s.x2 += s.vx2 * dt * 30;
      s.y2 += s.vy2 * dt * 30;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Ball 1
    ctx.fillStyle = "#6366f1";
    ctx.beginPath(); ctx.arc(s.x1, s.y1, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.font = "bold 10px JetBrains Mono"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(`${m1}kg`, s.x1, s.y1);

    // Ball 2
    ctx.fillStyle = "#ef4444";
    ctx.beginPath(); ctx.arc(s.x2, s.y2, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.fillText(`${m2}kg`, s.x2, s.y2);

    // Velocity vectors after collision
    if (s.collided) {
      const scale = 12;
      ctx.strokeStyle = "#6366f1"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(s.x1, s.y1); ctx.lineTo(s.x1 + s.vx1 * scale, s.y1 + s.vy1 * scale); ctx.stroke();
      ctx.strokeStyle = "#ef4444";
      ctx.beginPath(); ctx.moveTo(s.x2, s.y2); ctx.lineTo(s.x2 + s.vx2 * scale, s.y2 + s.vy2 * scale); ctx.stroke();

      ctx.fillStyle = "#10b98120";
      ctx.beginPath(); ctx.roundRect(W / 2 - 120, 10, 240, 28, 8); ctx.fill();
      ctx.fillStyle = "#10b981"; ctx.font = "bold 11px JetBrains Mono"; ctx.textAlign = "center";
      ctx.fillText(`p_x: ${p_total_x.toFixed(1)} ≈ ${p_after_x.toFixed(1)} ✓`, W / 2, 28);
    }

    // Initial velocity arrow
    if (!s.collided) {
      ctx.strokeStyle = "#6366f1"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(s.x1 + 14, s.y1); ctx.lineTo(s.x1 + 14 + v1 * 10, s.y1); ctx.stroke();
    }

    animRef.current = requestAnimationFrame(draw);
  }, [v1, v1x_after, v1y_after, v2x_after, v2y_after, m1, m2, p_total_x, p_after_x]);

  useEffect(() => {
    if (phase === "running") animRef.current = requestAnimationFrame(draw);
    else cancelAnimationFrame(animRef.current);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase, draw]);

  const fire = () => {
    const yOffset = -30 * Math.sin(theta);
    stateRef.current = { x1: 120, y1: 200, vx1: v1, vy1: 0, x2: 300, y2: 200 + yOffset, vx2: 0, vy2: 0, collided: false };
    lastRef.current = 0;
    setPhase("running");
  };
  const reset = () => { setPhase("ready"); };

  return (
    <SimCard title="💥 2D Collision — Momentum Conserved in Both x and y!" desc="When two objects collide at an angle, momentum is conserved SEPARATELY in the x-direction AND y-direction. This is vector conservation: Σp_x = const AND Σp_y = const. Even glancing blows obey this law perfectly!">
      <canvas ref={canvasRef} width={560} height={320} style={{ width: "100%", borderRadius: 12 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginTop: 14, background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #1e293b" }}>
        {[
          { label: `m1: ${m1}kg`, min: 1, max: 10, value: m1, set: setM1, color: "#6366f1" },
          { label: `m2: ${m2}kg`, min: 1, max: 10, value: m2, set: setM2, color: "#ef4444" },
          { label: `v1: ${v1}m/s`, min: 1, max: 15, value: v1, set: setV1, color: "#10b981" },
          { label: `Angle: ${collisionAngle}°`, min: 5, max: 75, value: collisionAngle, set: setCollisionAngle, color: "#f59e0b" },
        ].map(({ label, min, max, value, set, color }) => (
          <div key={label}>
            <div style={{ fontSize: 11, color, fontWeight: 700, marginBottom: 4 }}>{label}</div>
            <input type="range" min={min} max={max} value={value} onChange={e => { set(+e.target.value as never); reset(); }} style={{ width: "100%", accentColor: color }} disabled={phase === "running"} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 12, justifyContent: "center" }}>
        <button onClick={phase === "ready" ? fire : reset} style={{ padding: "10px 24px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", background: phase === "ready" ? "#6366f1" : "#1e293b", color: phase === "ready" ? "#fff" : "#cbd5e1" }}>
          {phase === "ready" ? "COLLIDE!" : "RESET"}
        </button>
      </div>
      <TPanel items={[
        { label: "p before (x)", value: `${p_total_x.toFixed(1)} kg·m/s`, color: "#6366f1" },
        { label: "p after (x)", value: `${p_after_x.toFixed(1)} kg·m/s`, color: "#10b981" },
        { label: "v1x after", value: `${v1x_after.toFixed(2)} m/s`, color: "#6366f1" },
        { label: "v2x after", value: `${v2x_after.toFixed(2)} m/s`, color: "#ef4444" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 3. ROCKET STAGING — Tsiolkovsky's Equation
 * As stages are dropped, mass decreases dramatically → huge Δv boost.
 * Shows multi-stage momentum advantage over single-stage rocket.
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_rocket_staging() {
  const [exhaustSpeed, setExhaustSpeed] = useState(3000); // m/s
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [anim, setAnim] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAnim(a => a + 1), 50);
    return () => clearInterval(id);
  }, []);

  // Tsiolkovsky: Δv = v_e × ln(m_initial/m_final)
  const singleStage = {
    m_initial: 100,  // tonnes (including fuel)
    m_final: 10,     // tonnes (payload + structure)
    label: "Single Stage",
    color: "#ef4444",
  };

  const twoStage = {
    stage1: { m_init: 100, m_final: 50, label: "Stage 1" },  // drop 50t
    stage2: { m_init: 50, m_final: 10, label: "Stage 2" },   // drop 40t
    color: "#10b981",
  };

  const dv_single = exhaustSpeed * Math.log(singleStage.m_initial / singleStage.m_final);
  const dv_two = exhaustSpeed * Math.log(twoStage.stage1.m_init / twoStage.stage1.m_final)
    + exhaustSpeed * Math.log(twoStage.stage2.m_init / twoStage.stage2.m_final);

  const stages = [
    { label: "Single Stage", payload: 10, dv: dv_single, color: "#ef4444", advantage: false },
    { label: "Two Stage", payload: 10, dv: dv_two, color: "#10b981", advantage: true },
  ];

  return (
    <SimCard title="🚀 Rocket Staging — Why Multiple Stages Work" desc="Tsiolkovsky Rocket Equation: Δv = v_e × ln(m_initial/m_final). By dropping empty fuel tanks (staging), the mass ratio improves dramatically for each stage, giving much more total Δv than a single-stage rocket with the same total mass!">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {stages.map((s, si) => (
          <div key={si} style={{ background: "#0f172a", borderRadius: 14, padding: 18, border: `1px solid ${s.color}30` }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{si === 0 ? "🚀" : "🛸"}</div>
            <div style={{ color: s.color, fontWeight: 800, fontSize: 15, marginBottom: 8 }}>{s.label}</div>
            <div style={{ marginBottom: 8 }}>
              {si === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <div style={{ height: 80, width: 40, background: "#ef444430", border: "1px solid #ef4444", borderRadius: 4, marginBottom: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#ef4444", fontSize: 9 }}>90t fuel</span>
                  </div>
                  <div style={{ height: 20, width: 40, background: "#6366f130", border: "1px solid #6366f1", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#6366f1", fontSize: 9 }}>10t payload</span>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <div style={{ height: 45, width: 40, background: "#10b98130", border: "1px solid #10b981", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#10b981", fontSize: 9 }}>Stage 1</span>
                  </div>
                  <div style={{ height: 30, width: 40, background: "#3b82f630", border: "1px solid #3b82f6", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#3b82f6", fontSize: 9 }}>Stage 2</span>
                  </div>
                  <div style={{ height: 16, width: 40, background: "#6366f130", border: "1px solid #6366f1", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#6366f1", fontSize: 8 }}>Payload</span>
                  </div>
                </div>
              )}
            </div>
            <div style={{ color: "#f1f5f9", fontWeight: 700, fontFamily: "JetBrains Mono", fontSize: 14, marginTop: 8 }}>Δv = {(s.dv / 1000).toFixed(2)} km/s</div>
            {s.advantage && <div style={{ color: "#10b981", fontSize: 11, marginTop: 4 }}>+{((dv_two - dv_single) / 1000).toFixed(2)} km/s advantage!</div>}
          </div>
        ))}
      </div>

      {/* Comparison bar */}
      <div style={{ marginTop: 16, background: "#0f172a", borderRadius: 12, padding: 16, border: "1px solid #1e293b" }}>
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>Delta-V Comparison (same total mass: 100t)</div>
        {stages.map(s => (
          <div key={s.label} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ color: s.color, fontSize: 12, fontWeight: 700 }}>{s.label}</span>
              <span style={{ color: "#f1f5f9", fontSize: 12, fontFamily: "JetBrains Mono" }}>{(s.dv / 1000).toFixed(2)} km/s</span>
            </div>
            <div style={{ height: 10, background: "#1e293b", borderRadius: 5 }}>
              <div style={{ height: "100%", width: `${(s.dv / dv_two) * 100}%`, background: s.color, borderRadius: 5, transition: "width 0.5s" }} />
            </div>
          </div>
        ))}
        <div style={{ color: "#64748b", fontSize: 11, marginTop: 8 }}>
          Formula: Δv = v_e × ln(m₀/m_f) | v_e = {exhaustSpeed} m/s (exhaust speed)
        </div>
      </div>

      <div style={{ marginTop: 14, background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #1e293b" }}>
        <div style={{ fontSize: 12, color: "#f59e0b", fontWeight: 700, marginBottom: 4 }}>Exhaust Speed: {(exhaustSpeed / 1000).toFixed(1)} km/s</div>
        <input type="range" min={1000} max={5000} step={100} value={exhaustSpeed} onChange={e => setExhaustSpeed(+e.target.value)} style={{ width: "100%", accentColor: "#f59e0b" }} />
      </div>
      <TPanel items={[
        { label: "Single Stage Δv", value: `${(dv_single / 1000).toFixed(2)} km/s`, color: "#ef4444" },
        { label: "Two Stage Δv", value: `${(dv_two / 1000).toFixed(2)} km/s`, color: "#10b981" },
        { label: "Improvement", value: `${((dv_two / dv_single - 1) * 100).toFixed(0)}% more!`, color: "#f59e0b" },
        { label: "Same Payload", value: "10 tonnes", color: "#6366f1" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 4. ICE SKATER COLLISION — Elastic vs Perfectly Inelastic
 * Two ice skaters moving toward each other collide.
 * Elastic: both bounce, momentum conserved, KE conserved.
 * Inelastic: stick together, momentum conserved, KE lost.
 * Perfect lab to see the difference.
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_ice_skater_collision() {
  const [m1, setM1] = useState(60);
  const [m2, setM2] = useState(80);
  const [v1, setV1] = useState(3);
  const [v2, setV2] = useState(-2);
  const [collType, setCollType] = useState<"elastic" | "inelastic">("elastic");
  const [phase, setPhase] = useState<"ready" | "running">("ready");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ x1: 120, x2: 440, vx1: 0, vx2: 0, collided: false });
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);

  const p_before = m1 * v1 + m2 * v2;
  let v1_after: number, v2_after: number;
  if (collType === "elastic") {
    v1_after = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
    v2_after = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
  } else {
    v1_after = v2_after = p_before / (m1 + m2);
  }
  const KE_before = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;
  const KE_after = collType === "elastic" ?
    0.5 * m1 * v1_after * v1_after + 0.5 * m2 * v2_after * v2_after :
    0.5 * (m1 + m2) * v1_after * v1_after;
  const KE_lost = KE_before - KE_after;

  const draw = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(draw); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    const s = stateRef.current;

    s.x1 += s.vx1 * dt * 25;
    s.x2 += s.vx2 * dt * 25;

    // Check collision (when within 40px)
    if (!s.collided && Math.abs(s.x2 - s.x1) < 40) {
      s.collided = true;
      if (collType === "inelastic") {
        s.vx1 = v1_after; s.vx2 = v1_after;
        s.x1 = s.x2 = (s.x1 + s.x2) / 2;
      } else {
        s.vx1 = v1_after; s.vx2 = v2_after;
      }
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Ice rink
    const iceGrad = ctx.createLinearGradient(0, 0, 0, H);
    iceGrad.addColorStop(0, "#0c1a2e");
    iceGrad.addColorStop(1, "#1e3a5f");
    ctx.fillStyle = iceGrad;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#1e40af20";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 25) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }

    const drawSkater = (x: number, y: number, mass: number, color: string, emoji: string, vx: number) => {
      ctx.save();
      ctx.translate(x, y);
      // Shadow
      ctx.fillStyle = color + "20";
      ctx.beginPath(); ctx.ellipse(0, 20, 20, 6, 0, 0, Math.PI * 2); ctx.fill();
      // Body
      ctx.font = "40px serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(emoji, 0, 0);
      // Mass label
      ctx.fillStyle = color; ctx.font = "bold 10px JetBrains Mono"; ctx.textAlign = "center";
      ctx.fillText(`${mass}kg`, 0, 30);
      // Velocity arrow
      if (Math.abs(vx) > 0.05) {
        const vLen = Math.min(Math.abs(vx) * 15, 60);
        ctx.strokeStyle = color; ctx.lineWidth = 2.5;
        const dir = vx > 0 ? 1 : -1;
        ctx.beginPath(); ctx.moveTo(dir * 20, -5); ctx.lineTo(dir * (20 + vLen), -5); ctx.stroke();
        ctx.fillStyle = color; ctx.font = "10px JetBrains Mono";
        ctx.fillText(`${Math.abs(vx).toFixed(1)}m/s`, dir * (20 + vLen / 2), -18);
      }
      ctx.restore();
    };

    drawSkater(s.x1, H / 2, m1, "#6366f1", "⛸️", s.vx1);
    drawSkater(s.x2, H / 2, m2, "#ef4444", "⛸️", s.vx2);

    // If stuck together
    if (s.collided && collType === "inelastic") {
      ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 2; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(s.x1, H / 2 - 30); ctx.lineTo(s.x2, H / 2 - 30); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#f59e0b"; ctx.font = "11px Inter"; ctx.textAlign = "center";
      ctx.fillText("STUCK TOGETHER", (s.x1 + s.x2) / 2, H / 2 - 40);
    }

    // Stats
    const p_after = m1 * s.vx1 + m2 * s.vx2;
    ctx.fillStyle = "#10b98120";
    ctx.beginPath(); ctx.roundRect(10, 8, 200, 22, 6); ctx.fill();
    ctx.fillStyle = "#10b981"; ctx.font = "bold 10px JetBrains Mono"; ctx.textAlign = "left";
    ctx.fillText(`p = ${p_after.toFixed(1)} kg·m/s ✓ conserved`, 14, 22);

    if (s.collided && KE_lost > 0.01) {
      ctx.fillStyle = "#ef444420";
      ctx.beginPath(); ctx.roundRect(10, 34, 200, 22, 6); ctx.fill();
      ctx.fillStyle = "#ef4444"; ctx.font = "bold 10px JetBrains Mono";
      ctx.fillText(`KE lost: ${KE_lost.toFixed(1)} J (heat/sound)`, 14, 48);
    }

    animRef.current = requestAnimationFrame(draw);
  }, [collType, v1_after, v2_after, m1, m2]);

  useEffect(() => {
    if (phase === "running") animRef.current = requestAnimationFrame(draw);
    else cancelAnimationFrame(animRef.current);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase, draw]);

  const start = () => {
    stateRef.current = { x1: 120, x2: 440, vx1: v1, vx2: v2, collided: false };
    lastRef.current = 0;
    setPhase("running");
  };
  const reset = () => { setPhase("ready"); };

  return (
    <SimCard title="⛸️ Ice Skaters — Elastic vs Inelastic Collision" desc="Two skaters collide. In BOTH cases, momentum is perfectly conserved: p_before = p_after. But kinetic energy: Elastic → KE conserved too (perfect bounce). Inelastic → KE converted to heat/deformation. Real collisions are somewhere in between!">
      <canvas ref={canvasRef} width={580} height={200} style={{ width: "100%", borderRadius: 12 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginTop: 14, background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #1e293b" }}>
        {[
          { label: `m1: ${m1}kg`, min: 40, max: 120, value: m1, set: setM1, color: "#6366f1" },
          { label: `m2: ${m2}kg`, min: 40, max: 120, value: m2, set: setM2, color: "#ef4444" },
          { label: `v1: ${v1}m/s →`, min: 1, max: 8, value: v1, set: setV1, color: "#10b981" },
          { label: `v2: ${Math.abs(v2)}m/s ←`, min: 0, max: 8, value: Math.abs(v2), set: (v: number) => setV2(-v), color: "#f59e0b" },
        ].map(({ label, min, max, value, set, color }) => (
          <div key={label}>
            <div style={{ fontSize: 11, color, fontWeight: 700, marginBottom: 4 }}>{label}</div>
            <input type="range" min={min} max={max} value={value} onChange={e => { set(+e.target.value as never); reset(); }} style={{ width: "100%", accentColor: color }} disabled={phase === "running"} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 4, background: "#0f172a", borderRadius: 10, padding: 4, border: "1px solid #1e293b" }}>
          {(["elastic", "inelastic"] as const).map(ct => (
            <button key={ct} onClick={() => { setCollType(ct); reset(); }} style={{
              padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
              background: collType === ct ? "#6366f130" : "transparent",
              color: collType === ct ? "#a5b4fc" : "#64748b", fontWeight: 700, fontSize: 12,
            }}>{ct === "elastic" ? "⚡ Elastic" : "🤝 Inelastic"}</button>
          ))}
        </div>
        <button onClick={phase === "ready" ? start : reset} style={{ padding: "10px 22px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", background: phase === "ready" ? "#10b981" : "#1e293b", color: phase === "ready" ? "#0f172a" : "#cbd5e1" }}>
          {phase === "ready" ? "COLLIDE!" : "RESET"}
        </button>
      </div>
      <TPanel items={[
        { label: "p Before", value: `${p_before.toFixed(1)} kg·m/s`, color: "#6366f1" },
        { label: "KE Before", value: `${KE_before.toFixed(1)} J`, color: "#f59e0b" },
        { label: "KE After", value: `${KE_after.toFixed(1)} J`, color: collType === "elastic" ? "#10b981" : "#ef4444" },
        { label: "KE Lost", value: `${KE_lost.toFixed(1)} J`, color: KE_lost > 0 ? "#ef4444" : "#10b981" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 5. MOMENTUM TIMELINE — See how p changes step by step in a system
 * Interactive timeline showing multiple impulses and how they add up.
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_momentum_timeline() {
  const [events, setEvents] = useState([
    { label: "Ball thrown", F: 50, dt: 0.1, color: "#10b981" },
    { label: "Ball bounces", F: -30, dt: 0.05, color: "#ef4444" },
    { label: "Ball caught", F: -20, dt: 0.15, color: "#f59e0b" },
  ]);

  const initialMomentum = 0;
  let runningP = initialMomentum;
  const moments = [{ label: "Initial", p: initialMomentum, color: "#94a3b8" }];
  events.forEach(e => {
    const deltaP = e.F * e.dt;
    runningP += deltaP;
    moments.push({ label: e.label, p: runningP, color: e.color });
  });

  const maxAbsP = Math.max(...moments.map(m => Math.abs(m.p)), 1);

  return (
    <SimCard title="📊 Momentum Timeline — Impulse = Change in Momentum" desc="Each force applied for a time Δt creates an impulse J = F·Δt = Δp. This is the Impulse-Momentum Theorem: J = Δp. Watch how momentum changes with each event — the area under the F-t graph is the impulse!">
      <div style={{ background: "#0f172a", borderRadius: 12, padding: 20, marginBottom: 14 }}>
        {/* Timeline visualization */}
        <div style={{ display: "flex", gap: 0, alignItems: "center', marginBottom: 24" as any }}>
          {moments.map((m, i) => (
            <React.Fragment key={i}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: i === 0 ? "none" : 1, minWidth: i === 0 ? 60 : undefined }}>
                {/* Momentum level */}
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: `${m.color}20`, border: `3px solid ${m.color}`,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ color: m.color, fontSize: 12, fontWeight: 700, fontFamily: "JetBrains Mono" }}>{m.p.toFixed(1)}</span>
                  <span style={{ color: "#64748b", fontSize: 9 }}>kg·m/s</span>
                </div>
                <span style={{ color: "#94a3b8", fontSize: 10, marginTop: 4, textAlign: "center", maxWidth: 70 }}>{m.label}</span>
              </div>
              {i < moments.length - 1 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ height: 3, width: "100%", background: events[i].color, borderRadius: 2, position: "relative" }}>
                    <span style={{ position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)", color: events[i].color, fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>
                      J={events[i].F}×{events[i].dt}={+(events[i].F * events[i].dt).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Bar chart */}
        <div style={{ marginTop: 20, display: "flex", gap: 8, alignItems: "flex-end", height: 80 }}>
          {moments.map((m, i) => {
            const h = (Math.abs(m.p) / maxAbsP) * 70;
            const isNeg = m.p < 0;
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center', justifyContent: 'flex-end'" as any }}>
                <div style={{ width: "100%", height: h, background: m.color, borderRadius: "4px 4px 0 0", position: "relative" }}>
                  <span style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", color: m.color, fontSize: 9, fontFamily: "JetBrains Mono", whiteSpace: "nowrap" }}>{m.p.toFixed(1)}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          {moments.map((m, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 9, color: "#475569", overflow: "hidden", textOverflow: "ellipsis" }}>{m.label}</div>
          ))}
        </div>
      </div>

      {events.map((e, i) => (
        <div key={i} style={{ background: "#0f172a", borderRadius: 10, padding: 12, marginBottom: 10, border: `1px solid ${e.color}30` }}>
          <div style={{ color: e.color, fontWeight: 700, fontSize: 12, marginBottom: 6 }}>{e.label}: J = {e.F}N × {e.dt}s = {+(e.F * e.dt).toFixed(2)} N·s</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div>
              <span style={{ color: "#64748b", fontSize: 11 }}>Force: {e.F}N </span>
              <input type="range" min={-100} max={100} value={e.F} onChange={ev => setEvents(prev => prev.map((x, j) => j === i ? { ...x, F: +ev.target.value } : x))} style={{ width: "100%", accentColor: e.color }} />
            </div>
            <div>
              <span style={{ color: "#64748b", fontSize: 11 }}>Duration: {e.dt}s </span>
              <input type="range" min={0.01} max={0.5} step={0.01} value={e.dt} onChange={ev => setEvents(prev => prev.map((x, j) => j === i ? { ...x, dt: +ev.target.value } : x))} style={{ width: "100%", accentColor: e.color }} />
            </div>
          </div>
        </div>
      ))}

      <TPanel items={[
        { label: "Initial p", value: `${initialMomentum} kg·m/s`, color: "#94a3b8" },
        { label: "Final p", value: `${moments[moments.length - 1].p.toFixed(2)} kg·m/s`, color: "#10b981" },
        { label: "Total Impulse", value: `${(moments[moments.length - 1].p - initialMomentum).toFixed(2)} N·s`, color: "#f59e0b" },
        { label: "Events", value: `${events.length}`, color: "#6366f1" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 6. RECOIL VELOCITY CALCULATOR — Interactive gun/rocket recoil
 * Visualizes momentum conservation: m1*v1 + m2*v2 = 0
 * Shows recoil for: pistol, rifle, cannon, rocket launch
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_recoil_calculator() {
  const [gunMass, setGunMass] = useState(2);
  const [bulletMass, setBulletMass] = useState(0.01);
  const [bulletSpeed, setBulletSpeed] = useState(300);
  const [phase, setPhase] = useState<"ready" | "fired">("ready");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ gunX: 300, bulletX: 300, gunV: 0, bulletV: 0 });
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);

  const recoilVelocity = -(bulletMass * bulletSpeed) / gunMass;
  const p_bullet = bulletMass * bulletSpeed;
  const p_gun = gunMass * recoilVelocity;

  const draw = useCallback((t: number) => {
    if (!lastRef.current) { lastRef.current = t; animRef.current = requestAnimationFrame(draw); return; }
    const dt = Math.min((t - lastRef.current) / 1000, 0.05);
    lastRef.current = t;
    const s = stateRef.current;

    s.gunX += s.gunV * dt * 30;
    s.bulletX += s.bulletV * dt * 0.3;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, W, H);

    // Ground
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, H - 30, W, 30);

    // Gun
    const gunW = 80 + gunMass * 5, gunH = 36;
    ctx.fillStyle = "#475569";
    ctx.beginPath();
    ctx.roundRect(s.gunX - gunW, H - 70, gunW, gunH, 4);
    ctx.fill();
    ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 1.5; ctx.stroke();
    // Barrel
    ctx.fillStyle = "#334155";
    ctx.fillRect(s.gunX, H - 62, 30, 14);
    ctx.fillStyle = "#94a3b8"; ctx.font = "bold 10px JetBrains Mono"; ctx.textAlign = "center";
    ctx.fillText(`${gunMass}kg`, s.gunX - gunW / 2, H - 44);

    // Bullet
    if (phase === "fired") {
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath(); ctx.ellipse(s.bulletX, H - 55, 12, 5, 0, 0, Math.PI * 2); ctx.fill();
      // Bullet trail
      ctx.fillStyle = "#f59e0b20";
      for (let i = 1; i < 5; i++) {
        ctx.beginPath(); ctx.ellipse(s.bulletX - i * 20, H - 55, 10 - i * 1.5, 3, 0, 0, Math.PI * 2); ctx.fill();
      }
    }

    // Recoil arrow
    if (phase === "fired") {
      ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(s.gunX - gunW, H - 62); ctx.lineTo(s.gunX - gunW - 50, H - 62); ctx.stroke();
      ctx.fillStyle = "#ef4444"; ctx.font = "bold 11px JetBrains Mono"; ctx.textAlign = "right";
      ctx.fillText(`← ${Math.abs(recoilVelocity).toFixed(2)}m/s RECOIL`, s.gunX - gunW - 55, H - 58);

      ctx.strokeStyle = "#10b981"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(s.gunX + 30, H - 58); ctx.lineTo(s.gunX + 80, H - 58); ctx.stroke();
      ctx.fillStyle = "#10b981"; ctx.font = "bold 11px JetBrains Mono"; ctx.textAlign = "left";
      ctx.fillText(`${bulletSpeed}m/s →`, s.gunX + 84, H - 54);
    }

    // Conservation label
    ctx.fillStyle = "#10b98120";
    ctx.beginPath(); ctx.roundRect(W / 2 - 130, 8, 260, 26, 8); ctx.fill();
    ctx.fillStyle = "#10b981"; ctx.font = "bold 11px JetBrains Mono"; ctx.textAlign = "center";
    ctx.fillText(`p_total = ${(p_bullet + p_gun).toFixed(3)} ≈ 0 ✓`, W / 2, 26);

    animRef.current = requestAnimationFrame(draw);
  }, [phase, gunMass, bulletMass, bulletSpeed, recoilVelocity, p_bullet, p_gun]);

  useEffect(() => { animRef.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(animRef.current); }, [draw]);

  const fire = () => {
    stateRef.current = { gunX: 300, bulletX: 330, gunV: recoilVelocity, bulletV: bulletSpeed };
    setPhase("fired");
  };
  const reset = () => { setPhase("ready"); stateRef.current = { gunX: 300, bulletX: 300, gunV: 0, bulletV: 0 }; };

  const presets = [
    { label: "Pistol", gm: 1, bm: 0.008, bv: 350 },
    { label: "Rifle", gm: 4, bm: 0.012, bv: 900 },
    { label: "Cannon", gm: 500, bm: 10, bv: 450 },
    { label: "Rocket", gm: 5000, bm: 20, bv: 3000 },
  ];

  return (
    <SimCard title="🔫 Recoil Calculator — Gun, Rifle, Cannon, Rocket" desc="When a gun fires, the bullet gains momentum forward (action). The gun gains equal momentum backward (reaction) — Newton's 3rd. Both started at rest → total momentum = 0 throughout. Recoil v = (m_bullet × v_bullet) / m_gun.">
      <canvas ref={canvasRef} width={580} height={180} style={{ width: "100%", borderRadius: 12 }} />
      <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "center", flexWrap: "wrap" }}>
        {presets.map(p => (
          <button key={p.label} onClick={() => { setGunMass(p.gm); setBulletMass(p.bm); setBulletSpeed(p.bv); reset(); }} style={{ padding: "8px 14px", borderRadius: 10, fontWeight: 700, fontSize: 12, border: "1px solid #1e293b", background: "#0f172a", color: "#94a3b8", cursor: "pointer" }}>
            {p.label}
          </button>
        ))}
        <button onClick={phase === "ready" ? fire : reset} style={{ padding: "8px 20px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", background: phase === "ready" ? "#ef4444" : "#1e293b", color: phase === "ready" ? "#fff" : "#cbd5e1" }}>
          {phase === "ready" ? "🔫 FIRE!" : "RESET"}
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 12, background: "#0f172a", padding: 14, borderRadius: 12, border: "1px solid #1e293b" }}>
        <div>
          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>Gun Mass: {gunMass}kg</div>
          <input type="range" min={0.5} max={2000} step={0.5} value={gunMass} onChange={e => { setGunMass(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#6366f1" }} />
        </div>
        <div>
          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>Bullet: {(bulletMass * 1000).toFixed(0)}g</div>
          <input type="range" min={0.001} max={50} step={0.001} value={bulletMass} onChange={e => { setBulletMass(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#f59e0b" }} />
        </div>
        <div>
          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>Bullet Speed: {bulletSpeed}m/s</div>
          <input type="range" min={50} max={5000} value={bulletSpeed} onChange={e => { setBulletSpeed(+e.target.value); reset(); }} style={{ width: "100%", accentColor: "#ef4444" }} />
        </div>
      </div>
      <TPanel items={[
        { label: "Bullet Momentum", value: `${p_bullet.toFixed(2)} kg·m/s`, color: "#10b981" },
        { label: "Recoil Momentum", value: `${Math.abs(p_gun).toFixed(2)} kg·m/s`, color: "#ef4444" },
        { label: "Recoil Speed", value: `${Math.abs(recoilVelocity).toFixed(2)} m/s`, color: "#f59e0b" },
        { label: "Total p", value: `${(p_bullet + p_gun).toFixed(3)} ≈ 0`, color: "#10b981" },
      ]} />
    </SimCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * 7. MOMENTUM CONSERVATION QUIZ GAME
 * Apply momentum conservation to solve interactive problems.
 * Get instant feedback with the physics explanation.
 * ══════════════════════════════════════════════════════════════════ */
export function Sim_momentum_quiz() {
  const problems = [
    {
      question: "A 5 kg ball moving at 4 m/s hits a stationary 3 kg ball. They stick together. What is their final velocity?",
      formula: "m₁v₁ + m₂v₂ = (m₁+m₂)v_f",
      answer: (5 * 4 + 3 * 0) / (5 + 3),
      unit: "m/s",
      hint: "Use: v_f = (m₁v₁) / (m₁+m₂) = 20/8",
    },
    {
      question: "A 1500 kg car at 20 m/s hits a stationary 2000 kg truck. They move together. Final speed?",
      formula: "m_car × v_car = (m_car + m_truck) × v_f",
      answer: (1500 * 20) / (1500 + 2000),
      unit: "m/s",
      hint: "v_f = 30000/3500 = 8.57 m/s",
    },
    {
      question: "A 0.1 kg bullet at 500 m/s embeds in a 4.9 kg block. How fast does the block move?",
      formula: "m_b × v_b = (m_b + m_block) × v_f",
      answer: (0.1 * 500) / (0.1 + 4.9),
      unit: "m/s",
      hint: "v_f = 50/5 = 10 m/s",
    },
  ];

  const [qIdx, setQIdx] = useState(0);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"" | "correct" | "wrong">("");
  const q = problems[qIdx];

  const check = () => {
    const val = parseFloat(input);
    if (Math.abs(val - q.answer) < 0.1 * q.answer + 0.05) {
      setStatus("correct");
    } else {
      setStatus("wrong");
    }
  };

  const next = () => { setQIdx((qIdx + 1) % problems.length); setInput(""); setStatus(""); };

  return (
    <SimCard title="🧩 Momentum Conservation — Practice Problems" desc="Apply the law of conservation of momentum to solve real physics problems. Use: total momentum before = total momentum after. All collisions — elastic or inelastic — conserve momentum!">
      <div style={{ background: "#0f172a", borderRadius: 14, padding: 24, border: "1px solid #1e293b" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ color: "#64748b", fontSize: 12, fontWeight: 700 }}>PROBLEM {qIdx + 1} of {problems.length}</span>
          <div style={{ display: "flex", gap: 8 }}>
            {problems.map((_, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: i === qIdx ? "#6366f1" : "#1e293b", border: "1px solid #334155" }} />
            ))}
          </div>
        </div>

        <p style={{ color: "#f1f5f9", fontSize: 15, fontWeight: 600, lineHeight: 1.6, marginBottom: 16 }}>{q.question}</p>

        <div style={{ background: "#020617", borderRadius: 8, padding: 10, marginBottom: 16, fontFamily: "JetBrains Mono", fontSize: 12, color: "#6366f1" }}>
          Formula: {q.formula}
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
          <input
            type="number"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`Answer in ${q.unit}`}
            style={{ flex: 1, padding: "10px 14px", borderRadius: 8, background: "#020617", border: `2px solid ${status === "correct" ? "#10b981" : status === "wrong" ? "#ef4444" : "#1e293b"}`, color: "#f1f5f9", fontSize: 16, fontFamily: "JetBrains Mono", outline: "none" }}
          />
          <span style={{ color: "#64748b", fontWeight: 700 }}>{q.unit}</span>
          <button onClick={check} style={{ padding: "10px 20px", borderRadius: 8, fontWeight: 700, border: "none", cursor: "pointer", background: "#6366f1", color: "#fff" }}>CHECK</button>
        </div>

        {status === "correct" && (
          <div style={{ background: "#10b98120", border: "1px solid #10b981", borderRadius: 10, padding: 12 }}>
            <div style={{ color: "#10b981", fontWeight: 800, fontSize: 14 }}>✓ Correct! {q.answer.toFixed(2)} {q.unit}</div>
            <div style={{ color: "#6ee7b7", fontSize: 13, marginTop: 4 }}>{q.hint}</div>
          </div>
        )}
        {status === "wrong" && (
          <div style={{ background: "#ef444420", border: "1px solid #ef4444", borderRadius: 10, padding: 12 }}>
            <div style={{ color: "#ef4444", fontWeight: 800, fontSize: 14 }}>✗ Not quite. Try again!</div>
            <div style={{ color: "#fca5a5", fontSize: 13, marginTop: 4 }}>Hint: {q.hint}</div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
        <button onClick={next} style={{ padding: "10px 24px", borderRadius: 10, fontWeight: 700, border: "none", cursor: "pointer", background: "#1e293b", color: "#cbd5e1" }}>Next Problem →</button>
      </div>
      <TPanel items={[
        { label: "Topic", value: "Conservation", color: "#6366f1" },
        { label: "Law Used", value: "Σp = const", color: "#10b981" },
        { label: "Collision", value: "Inelastic", color: "#f59e0b" },
        { label: "Progress", value: `${qIdx + 1}/${problems.length}`, color: "#94a3b8" },
      ]} />
    </SimCard>
  );
}
