"use client";
/**
 * FILE: TopicBonus.tsx
 * PURPOSE: 15 ultra-professional bonus simulations for Class 9 Force & Laws of Motion.
 *          2 for Topic 1 (Balanced/Unbalanced Forces)
 *          3 for Topic 2 (Newton's 1st Law / Inertia)
 *          3 for Topic 3 (Newton's 2nd Law / F=ma)
 *          4 for Topic 4 (Newton's 3rd Law)
 *          3 for Topic 5 (Conservation of Momentum)
 *
 * All simulations use HTML5 Canvas 2D with requestAnimationFrame.
 * Physics state stored in refs — zero stale closure issues.
 */
import React, { useState, useEffect, useRef, useCallback } from "react";

/* ── Shared UI primitives ───────────────────────────────────────── */
function Card({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div style={{ width: "100%", background: "#0b1120", borderRadius: 18, padding: 28, margin: "32px 0", border: "1px solid #1e293b", boxShadow: "0 12px 40px rgba(0,0,0,0.5)", fontFamily: "Inter, system-ui, sans-serif", overflow: "hidden" }}>
      <div style={{ borderBottom: "1px solid #1e293b", paddingBottom: 14, marginBottom: 22 }}>
        <h3 style={{ color: "#f1f5f9", fontSize: 20, fontWeight: 800, margin: 0 }}>{title}</h3>
        <p style={{ color: "#64748b", fontSize: 13, margin: "6px 0 0", lineHeight: 1.6 }}>{desc}</p>
      </div>
      {children}
    </div>
  );
}
function Row({ items }: { items: { label: string; value: string; color: string }[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(items.length, 4)}, 1fr)`, gap: 10, marginTop: 16 }}>
      {items.map(it => (
        <div key={it.label} style={{ background: "#0f172a", borderRadius: 10, padding: "10px 14px", border: "1px solid #1e293b" }}>
          <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 }}>{it.label}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: it.color, fontFamily: "JetBrains Mono, monospace" }}>{it.value}</div>
        </div>
      ))}
    </div>
  );
}
function Ctrl({ label, min, max, value, color, onChange }: { label: string; min: number; max: number; value: number; color: string; onChange: (v: number) => void }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color, marginBottom: 5 }}>
        <span>{label}</span><span style={{ fontFamily: "monospace" }}>{value}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={e => onChange(+e.target.value)} style={{ width: "100%", accentColor: color }} />
    </div>
  );
}
function Btn({ onClick, label, active, color = "#10b981" }: { onClick: () => void; label: string; active?: boolean; color?: string }) {
  return (
    <button onClick={onClick} style={{ padding: "10px 22px", borderRadius: 10, fontWeight: 800, fontSize: 13, border: active ? `1px solid ${color}` : "1px solid #334155", cursor: "pointer", background: active ? `${color}22` : "#1e293b", color: active ? color : "#94a3b8", transition: "all .15s" }}>{label}</button>
  );
}

/* ══════════════════════════════════════════════════
 * T1-BONUS-1: FORCE TABLE — 3-FORCE EQUILIBRIUM
 * Three force vectors on a ring. Student rotates F3 until net = 0.
 * ══════════════════════════════════════════════════ */
export function Sim_force_table() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [f1, setF1]     = useState(80);
  const [f2, setF2]     = useState(60);
  const [f3, setF3]     = useState(100);
  const [a3, setA3]     = useState(210); /* angle of F3 in degrees */

  /* Fixed angles for F1 and F2 */
  const a1 = 30;
  const a2 = 150;

  const toRad = (d: number) => d * Math.PI / 180;

  const netX = f1 * Math.cos(toRad(a1)) + f2 * Math.cos(toRad(a2)) + f3 * Math.cos(toRad(a3));
  const netY = f1 * Math.sin(toRad(a1)) + f2 * Math.sin(toRad(a2)) + f3 * Math.sin(toRad(a3));
  const netMag = Math.sqrt(netX * netX + netY * netY);
  const balanced = netMag < 3;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;

    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, W, H);

    /* Grid */
    ctx.strokeStyle = "#0f172a"; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    /* Angle reference circle */
    ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, 100, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, 2, 0, Math.PI * 2); ctx.fill();

    /* Angle markers */
    ctx.fillStyle = "#334155"; ctx.font = "10px JetBrains Mono"; ctx.textAlign = "center";
    for (let deg = 0; deg < 360; deg += 30) {
      const r = toRad(deg);
      const lx = cx + 110 * Math.cos(r), ly = cy - 110 * Math.sin(r);
      ctx.fillText(`${deg}°`, lx, ly + 4);
    }

    /* Force vectors */
    const forces = [
      { mag: f1, angle: a1, color: "#ef4444", label: "F₁" },
      { mag: f2, angle: a2, color: "#3b82f6", label: "F₂" },
      { mag: f3, angle: a3, color: "#10b981", label: "F₃ (you)" },
    ];

    forces.forEach(({ mag, angle, color, label }) => {
      const r  = toRad(angle);
      const scale = 0.8;
      const ex = cx + mag * scale * Math.cos(r);
      const ey = cy - mag * scale * Math.sin(r);

      ctx.strokeStyle = color; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex, ey); ctx.stroke();

      /* Arrowhead */
      const headAngle = Math.atan2(cy - ey, ex - cx);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex - 12 * Math.cos(headAngle - 0.4), ey + 12 * Math.sin(headAngle - 0.4));
      ctx.lineTo(ex - 12 * Math.cos(headAngle + 0.4), ey + 12 * Math.sin(headAngle + 0.4));
      ctx.closePath(); ctx.fill();

      ctx.fillStyle = color; ctx.font = "bold 13px Inter"; ctx.textAlign = "center";
      ctx.fillText(`${label} = ${mag}N`, cx + (mag * scale + 28) * Math.cos(r), cy - (mag * scale + 28) * Math.sin(r) + 4);
    });

    /* Net force vector */
    if (!balanced) {
      const nx = cx + netX * 0.8;
      const ny = cy - netY * 0.8;
      ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(nx, ny); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#f59e0b"; ctx.font = "bold 12px JetBrains Mono"; ctx.textAlign = "center";
      ctx.fillText(`Net = ${netMag.toFixed(1)} N`, cx + netX * 0.4, cy - netY * 0.4 - 10);
    }

    /* Centre ring */
    ctx.strokeStyle = balanced ? "#10b981" : "#ef4444";
    ctx.lineWidth = balanced ? 3 : 2;
    ctx.beginPath(); ctx.arc(cx, cy, 16, 0, Math.PI * 2);
    ctx.stroke();
    if (balanced) {
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 14px Inter"; ctx.textAlign = "center";
      ctx.fillText("✓ BALANCED!", cx, H - 16);
    }
  }, [f1, f2, f3, a3, netX, netY, netMag, balanced]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <Card title="⭕ Force Table — 3-Force Equilibrium" desc="Three ropes pull on a ring. F₁ and F₂ are fixed. Adjust F₃ magnitude and angle to balance the ring (net force = 0). This is how engineers check if structures are in equilibrium.">
      <canvas ref={canvasRef} width={560} height={280} style={{ width: "100%", borderRadius: 12, border: "1px solid #1e293b" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 18 }}>
        <div>
          <Ctrl label="F₃ Magnitude (N)" min={10} max={200} value={f3} color="#10b981" onChange={setF3} />
          <Ctrl label="F₃ Angle (°)" min={0} max={359} value={a3} color="#10b981" onChange={setA3} />
          <Ctrl label="F₁ Magnitude (N)" min={10} max={150} value={f1} color="#ef4444" onChange={setF1} />
          <Ctrl label="F₂ Magnitude (N)" min={10} max={150} value={f2} color="#3b82f6" onChange={setF2} />
        </div>
        <Row items={[
          { label: "Net Force X", value: `${netX.toFixed(1)} N`, color: "#f59e0b" },
          { label: "Net Force Y", value: `${netY.toFixed(1)} N`, color: "#f59e0b" },
          { label: "|Net Force|", value: `${netMag.toFixed(1)} N`, color: balanced ? "#10b981" : "#ef4444" },
          { label: "Status", value: balanced ? "BALANCED" : "UNBALANCED", color: balanced ? "#10b981" : "#ef4444" },
        ]} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════
 * T1-BONUS-2: BEAM BRIDGE — SUPPORT REACTIONS
 * Load placed on a beam. Shows how reaction forces at supports respond.
 * ══════════════════════════════════════════════════ */
export function Sim_bridge_load() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [load, setLoad]   = useState(1000); /* N */
  const [pos, setPos]     = useState(50);   /* % from left */

  const L = 1;     /* beam length = 1 (normalized) */
  const x = pos / 100;
  const Ra = load * (1 - x); /* reaction at A (left) */
  const Rb = load * x;       /* reaction at B (right) */

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;

    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, W, H);

    const beamY  = H / 2 - 10;
    const beamX0 = 80, beamX1 = W - 80;
    const beamLen = beamX1 - beamX0;

    /* Beam */
    ctx.fillStyle = "#334155";
    ctx.fillRect(beamX0, beamY - 12, beamLen, 24);
    ctx.strokeStyle = "#64748b"; ctx.lineWidth = 2;
    ctx.strokeRect(beamX0, beamY - 12, beamLen, 24);

    /* Support triangles */
    const drawSupport = (sx: number, label: string, reaction: number) => {
      ctx.fillStyle = "#1e40af";
      ctx.beginPath();
      ctx.moveTo(sx, beamY + 12);
      ctx.lineTo(sx - 20, beamY + 48);
      ctx.lineTo(sx + 20, beamY + 48);
      ctx.closePath(); ctx.fill();

      /* Reaction arrow */
      const arrowH = Math.min(reaction / load * 70, 90);
      ctx.strokeStyle = "#22d3ee"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(sx, beamY + 48 + 10); ctx.lineTo(sx, beamY + 48 + 10 + arrowH); ctx.stroke();
      ctx.fillStyle = "#22d3ee";
      ctx.beginPath();
      ctx.moveTo(sx, beamY + 48 + 10);
      ctx.lineTo(sx - 8, beamY + 48 + 22);
      ctx.lineTo(sx + 8, beamY + 48 + 22);
      ctx.closePath(); ctx.fill();

      ctx.fillStyle = "#22d3ee"; ctx.font = "bold 12px JetBrains Mono"; ctx.textAlign = "center";
      ctx.fillText(`${label} = ${reaction.toFixed(0)} N`, sx, beamY + 48 + arrowH + 26);
      ctx.fillStyle = "#94a3b8"; ctx.font = "11px Inter";
      ctx.fillText(label, sx, beamY + 62);
    };
    drawSupport(beamX0, "Ra", Ra);
    drawSupport(beamX1, "Rb", Rb);

    /* Load position & downward arrow */
    const loadX = beamX0 + (pos / 100) * beamLen;
    const loadArrowH = Math.min(load / 500 * 50, 80) + 20;

    ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(loadX, beamY - 12 - loadArrowH); ctx.lineTo(loadX, beamY - 12); ctx.stroke();
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.moveTo(loadX, beamY - 12);
    ctx.lineTo(loadX - 8, beamY - 12 - 14);
    ctx.lineTo(loadX + 8, beamY - 12 - 14);
    ctx.closePath(); ctx.fill();

    /* Load label */
    ctx.fillStyle = "#ef4444"; ctx.font = "bold 13px JetBrains Mono"; ctx.textAlign = "center";
    ctx.fillText(`W = ${load} N`, loadX, beamY - 12 - loadArrowH - 8);

    /* Distance labels */
    ctx.strokeStyle = "#475569"; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(beamX0, beamY - 50); ctx.lineTo(loadX, beamY - 50); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(loadX, beamY - 50); ctx.lineTo(beamX1, beamY - 50); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#64748b"; ctx.font = "11px Inter";
    ctx.fillText(`${pos}%`, (beamX0 + loadX) / 2, beamY - 56);
    ctx.fillText(`${100 - pos}%`, (loadX + beamX1) / 2, beamY - 56);

    /* Principle label */
    ctx.fillStyle = "#334155"; ctx.font = "12px Inter"; ctx.textAlign = "center";
    ctx.fillText("Ra × L = W × (L−x)   |   Rb × L = W × x", W / 2, H - 12);
  }, [load, pos, Ra, Rb]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <Card title="🌉 Bridge Beam — Support Reaction Forces" desc="A load W acts on a simply-supported beam. The two supports (Ra and Rb) push UP with reaction forces whose magnitudes depend on WHERE the load is placed — this is the principle of moments!">
      <canvas ref={canvasRef} width={560} height={260} style={{ width: "100%", borderRadius: 12, border: "1px solid #1e293b" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 18 }}>
        <div>
          <Ctrl label="Load W (N)" min={100} max={5000} value={load} color="#ef4444" onChange={setLoad} />
          <Ctrl label="Load Position (% from left)" min={1} max={99} value={pos} color="#f59e0b" onChange={setPos} />
        </div>
        <Row items={[
          { label: "Reaction Ra (left)", value: `${Ra.toFixed(0)} N`, color: "#22d3ee" },
          { label: "Reaction Rb (right)", value: `${Rb.toFixed(0)} N`, color: "#22d3ee" },
          { label: "Ra + Rb", value: `${(Ra + Rb).toFixed(0)} N`, color: "#10b981" },
          { label: "Total Load", value: `${load} N`, color: "#ef4444" },
        ]} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════
 * T2-BONUS-1: COIN TRICK — INERTIA OF REST
 * Classic demo: card flicked out, coin drops into glass (inertia of rest)
 * ══════════════════════════════════════════════════ */
export function Sim_coin_trick() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const stateRef = useRef({ phase: "ready" as "ready" | "flick" | "fall" | "done", cardX: 0, coinY: 0, coinVy: 0, t: 0 });
  const [phase, setPhase] = useState<"ready" | "flick" | "fall" | "done">("ready");
  const [speed, setSpeed] = useState(5); /* flick speed 1-10 */

  const draw = useCallback((ts: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const s = stateRef.current;

    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, W, H);

    /* Glass */
    const glassX = W / 2 - 25, glassY = H - 80, glassW = 50, glassH = 80;
    ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(glassX, glassY);
    ctx.lineTo(glassX - 6, glassY + glassH);
    ctx.lineTo(glassX + glassW + 6, glassY + glassH);
    ctx.lineTo(glassX + glassW, glassY);
    ctx.stroke();

    /* Table */
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(60, H - 120, W - 120, 12);

    /* Card */
    const cardBaseX = W / 2 - 40;
    const cardY = H - 120 - 8;
    const cardDisplayX = cardBaseX - s.cardX;
    if (s.phase !== "done" || s.cardX < W) {
      ctx.fillStyle = "#fbbf24";
      ctx.fillRect(cardDisplayX, cardY, 80, 8);
      ctx.fillStyle = "#f59e0b"; ctx.font = "bold 10px JetBrains Mono"; ctx.textAlign = "center";
      if (s.phase === "ready") ctx.fillText("CARD", cardDisplayX + 40, cardY + 6);
    }

    /* Coin */
    const coinBaseY = cardY - 14;
    const coinDisplayY = s.phase === "flick" ? coinBaseY : coinBaseY + s.coinY;
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath(); ctx.arc(W / 2, coinDisplayY, 12, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#d97706"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(W / 2, coinDisplayY, 12, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "#92400e"; ctx.font = "bold 9px JetBrains Mono"; ctx.textAlign = "center";
    ctx.fillText("₹", W / 2, coinDisplayY + 4);

    /* Labels */
    ctx.fillStyle = "#64748b"; ctx.font = "12px Inter"; ctx.textAlign = "center";
    if (s.phase === "ready") {
      ctx.fillText("Coin sits on card (at REST — inertia keeps it there!)", W / 2, 30);
    } else if (s.phase === "flick") {
      ctx.fillStyle = "#f59e0b";
      ctx.fillText("Card flicked away rapidly! Coin has INERTIA OF REST →", W / 2, 30);
    } else if (s.phase === "fall") {
      ctx.fillStyle = "#22d3ee";
      ctx.fillText("Coin falls vertically (gravity only) → lands in glass!", W / 2, 30);
    } else {
      ctx.fillStyle = "#10b981"; ctx.font = "bold 14px Inter";
      ctx.fillText("✓ COIN IS IN THE GLASS! Inertia of rest demonstrated!", W / 2, 30);
    }

    /* Physics annotation */
    if (s.phase === "fall") {
      ctx.fillStyle = "#ef4444"; ctx.font = "11px JetBrains Mono"; ctx.textAlign = "left";
      ctx.fillText(`Vy = ${s.coinVy.toFixed(1)} m/s`, W / 2 + 20, coinDisplayY);
    }

    /* Animation step */
    if (s.phase === "flick") {
      s.cardX += speed * 5;
      if (s.cardX > 200) {
        s.phase = "fall";
        setPhase("fall");
      }
      rafRef.current = requestAnimationFrame(draw);
    } else if (s.phase === "fall") {
      const dt = 0.016;
      s.coinVy += 9.8 * dt * 30; /* pixels */
      s.coinY += s.coinVy * dt;
      if (coinDisplayY > glassY + 20) {
        s.phase = "done";
        setPhase("done");
        cancelAnimationFrame(rafRef.current);
        return;
      }
      rafRef.current = requestAnimationFrame(draw);
    }
  }, [speed]);

  const start = () => {
    cancelAnimationFrame(rafRef.current);
    stateRef.current = { phase: "flick", cardX: 0, coinY: 0, coinVy: 0, t: 0 };
    setPhase("flick");
    rafRef.current = requestAnimationFrame(draw);
  };
  const reset = () => {
    cancelAnimationFrame(rafRef.current);
    stateRef.current = { phase: "ready", cardX: 0, coinY: 0, coinVy: 0, t: 0 };
    setPhase("ready");
    requestAnimationFrame(draw);
  };

  useEffect(() => { requestAnimationFrame(draw); return () => cancelAnimationFrame(rafRef.current); }, [draw]);

  return (
    <Card title="🪙 Coin Trick — Inertia of Rest" desc="A coin rests on a card over a glass. When the card is flicked away quickly, the coin stays in place (inertia of rest) and falls straight down into the glass. If the card is pulled slowly, friction would drag the coin.">
      <canvas ref={canvasRef} width={500} height={200} style={{ width: "100%", borderRadius: 12, border: "1px solid #1e293b" }} />
      <div style={{ display: "flex", gap: 14, marginTop: 16, alignItems: "center", flexWrap: "wrap" }}>
        <Ctrl label="Flick Speed" min={1} max={10} value={speed} color="#f59e0b" onChange={setSpeed} />
        <Btn onClick={start} label="▶ FLICK!" active={phase !== "ready"} color="#10b981" />
        <Btn onClick={reset} label="↺ Reset" color="#64748b" />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════
 * T2-BONUS-2: SPACE PUCK — INERTIA OF MOTION
 * Zero friction space environment: puck moves forever in a straight line.
 * ══════════════════════════════════════════════════ */
export function Sim_space_drift() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const state     = useRef({ x: 100, y: 150, vx: 2, vy: 0.5, running: false });
  const [running, setRunning]  = useState(false);
  const [vx, setVx]            = useState(3);
  const [vy, setVy]            = useState(1);
  const [distance, setDistance] = useState(0);
  const distRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const s = state.current;

    /* Space background */
    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, W, H);

    /* Stars */
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    [[50, 40], [120, 80], [200, 30], [300, 120], [400, 60], [480, 100], [150, 200], [350, 180], [450, 220], [80, 180]].forEach(([sx, sy]) => {
      ctx.beginPath(); ctx.arc(sx, sy, 1.5, 0, Math.PI * 2); ctx.fill();
    });

    /* Trail */
    ctx.strokeStyle = "rgba(99,102,241,0.3)"; ctx.lineWidth = 2;
    const trailX = s.x - s.vx * 40, trailY = s.y - s.vy * 40;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(trailX, trailY); ctx.lineTo(s.x, s.y); ctx.stroke();
    ctx.setLineDash([]);

    /* Velocity vector */
    const vMag = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
    if (vMag > 0.1) {
      const nx = s.vx / vMag, ny = s.vy / vMag;
      const arrowLen = vMag * 14;
      ctx.strokeStyle = "#22d3ee"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x + nx * arrowLen, s.y + ny * arrowLen); ctx.stroke();
      ctx.fillStyle = "#22d3ee";
      const ax = s.x + nx * arrowLen, ay = s.y + ny * arrowLen;
      const angle = Math.atan2(ny, nx);
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(ax - 10 * Math.cos(angle - 0.4), ay - 10 * Math.sin(angle - 0.4));
      ctx.lineTo(ax - 10 * Math.cos(angle + 0.4), ay - 10 * Math.sin(angle + 0.4));
      ctx.closePath(); ctx.fill();
    }

    /* Puck */
    const grad = ctx.createRadialGradient(s.x - 4, s.y - 4, 2, s.x, s.y, 18);
    grad.addColorStop(0, "#818cf8");
    grad.addColorStop(1, "#4338ca");
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(s.x, s.y, 18, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#6366f1"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(s.x, s.y, 18, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "#e0e7ff"; ctx.font = "bold 11px Inter"; ctx.textAlign = "center";
    ctx.fillText("PUCK", s.x, s.y + 4);

    /* Labels */
    ctx.fillStyle = "#64748b"; ctx.font = "12px Inter"; ctx.textAlign = "center";
    ctx.fillText("⚡ No friction in space — Newton's 1st Law: object moves FOREVER", W / 2, H - 10);

    /* Physics step */
    if (s.running) {
      s.x += s.vx;
      s.y += s.vy;
      distRef.current += vMag;
      setDistance(Math.round(distRef.current));

      /* Wrap */
      if (s.x > W + 20) s.x = -20;
      if (s.x < -20) s.x = W + 20;
      if (s.y > H + 20) s.y = -20;
      if (s.y < -20) s.y = H + 20;

      rafRef.current = requestAnimationFrame(draw);
    }
  }, []);

  const start = () => {
    state.current = { x: 100, y: 150, vx, vy, running: true };
    distRef.current = 0;
    setDistance(0);
    setRunning(true);
    rafRef.current = requestAnimationFrame(draw);
  };
  const stop = () => {
    state.current.running = false;
    setRunning(false);
    cancelAnimationFrame(rafRef.current);
  };

  useEffect(() => { requestAnimationFrame(draw); return () => cancelAnimationFrame(rafRef.current); }, [draw]);

  return (
    <Card title="🚀 Space Puck — Newton's First Law in Action" desc="In space there is NO friction, NO air resistance. Once a puck is pushed, it continues moving in a straight line FOREVER at constant speed. This is Newton's 1st Law: An object in uniform motion stays in uniform motion unless acted on by an external force.">
      <canvas ref={canvasRef} width={540} height={240} style={{ width: "100%", borderRadius: 12, border: "1px solid #1e293b" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 16 }}>
        <div>
          <Ctrl label="Vx (horizontal speed)" min={1} max={8} value={vx} color="#22d3ee" onChange={v => { setVx(v); state.current.vx = v; }} />
          <Ctrl label="Vy (vertical speed)" min={0} max={6} value={vy} color="#818cf8" onChange={v => { setVy(v); state.current.vy = v; }} />
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <Btn onClick={running ? stop : start} label={running ? "⏸ Stop" : "▶ Launch"} active={running} color="#10b981" />
          </div>
        </div>
        <Row items={[
          { label: "Speed", value: `${Math.sqrt(vx * vx + vy * vy).toFixed(1)} px/frame`, color: "#22d3ee" },
          { label: "Acceleration", value: "0.00 m/s²", color: "#10b981" },
          { label: "Net Force", value: "0 N", color: "#10b981" },
          { label: "Distance", value: `${distance} px`, color: "#a78bfa" },
        ]} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════
 * T2-BONUS-3: BUS BRAKING — PASSENGER INERTIA
 * Bus decelerates. Passengers lurch forward (inertia of motion).
 * ══════════════════════════════════════════════════ */
export function Sim_bus_inertia() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const state     = useRef({ speed: 0, braking: false, lurch: 0, lurchV: 0 });
  const [speed, setSpeed]     = useState(0);
  const [braking, setBraking] = useState(false);
  const [decel, setDecel]     = useState(5);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const s = state.current;

    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, W, H);

    /* Road */
    ctx.fillStyle = "#1e293b"; ctx.fillRect(0, H - 60, W, 60);
    ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 3; ctx.setLineDash([30, 20]);
    ctx.beginPath(); ctx.moveTo(0, H - 30); ctx.lineTo(W, H - 30); ctx.stroke();
    ctx.setLineDash([]);

    /* Bus body */
    const busX = 60, busY = H - 60 - 90;
    ctx.fillStyle = "#1d4ed8";
    ctx.beginPath(); ctx.roundRect(busX, busY, 320, 85, 12); ctx.fill();
    ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(busX, busY, 320, 85, 12); ctx.stroke();

    /* Windows */
    [busX + 20, busX + 80, busX + 140, busX + 200, busX + 260].forEach(wx => {
      ctx.fillStyle = "#bfdbfe"; ctx.fillRect(wx, busY + 10, 40, 30);
    });

    /* Wheels */
    [busX + 50, busX + 260].forEach(wx => {
      ctx.fillStyle = "#0f172a"; ctx.beginPath(); ctx.arc(wx, H - 60, 22, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#475569"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(wx, H - 60, 22, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(wx, H - 60, 12, 0, Math.PI * 2); ctx.stroke();
    });

    /* Bus label */
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 16px Inter"; ctx.textAlign = "center";
    ctx.fillText("🚌  SCHOOL BUS", busX + 160, busY + 72);

    /* Passengers (simplified stick figures) */
    const lurchX = s.lurch * 15;
    [[busX + 50, busY + 50], [busX + 110, busY + 50], [busX + 170, busY + 50]].forEach(([px, py], i) => {
      const lean = i === 1 ? lurchX * 0.8 : lurchX; /* middle person has more inertia */
      ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 3;
      /* Head */
      ctx.beginPath(); ctx.arc(px + lean, py - 18, 8, 0, Math.PI * 2); ctx.stroke();
      /* Body */
      ctx.beginPath(); ctx.moveTo(px + lean, py - 10); ctx.lineTo(px + lean, py + 10); ctx.stroke();
      /* Arms forward when lurching */
      if (lurchX > 2) {
        ctx.beginPath(); ctx.moveTo(px + lean, py); ctx.lineTo(px + lean + 12, py - 6); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px + lean, py); ctx.lineTo(px + lean + 10, py + 6); ctx.stroke();
      }
    });

    /* Speed arrow */
    if (s.speed > 0) {
      const arrowLen = s.speed * 4;
      ctx.strokeStyle = s.braking ? "#ef4444" : "#10b981"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(busX + 320 + 10, busY + 42); ctx.lineTo(busX + 320 + 10 + arrowLen, busY + 42); ctx.stroke();
      ctx.fillStyle = s.braking ? "#ef4444" : "#10b981";
      ctx.font = "bold 12px JetBrains Mono"; ctx.textAlign = "left";
      ctx.fillText(`v = ${s.speed.toFixed(1)} m/s`, busX + 320 + 10, busY + 32);
    }

    /* Brake label */
    if (s.braking && s.speed > 0) {
      ctx.fillStyle = "#ef4444"; ctx.font = "bold 14px Inter"; ctx.textAlign = "center";
      ctx.fillText(`BRAKING! Deceleration = ${decel} m/s²`, W / 2, 25);
    } else if (s.speed === 0 && !s.braking) {
      ctx.fillStyle = "#10b981"; ctx.font = "bold 13px Inter"; ctx.textAlign = "center";
      ctx.fillText("Bus at rest — passengers upright. Press START to set speed.", W / 2, 25);
    }

    /* Physics */
    if (s.braking && s.speed > 0) {
      s.speed = Math.max(0, s.speed - decel * 0.05);
      /* Passengers lurch forward due to inertia */
      s.lurchV += decel * 0.05;
      s.lurch = Math.min(s.lurch + s.lurchV * 0.06, 1);
      setSpeed(s.speed);
      if (s.speed === 0) {
        state.current.braking = false;
        setBraking(false);
        setTimeout(() => { s.lurch = 0; s.lurchV = 0; }, 800);
      }
      rafRef.current = requestAnimationFrame(draw);
    } else if (!s.braking && s.lurch > 0) {
      /* Recover */
      s.lurch = Math.max(0, s.lurch - 0.05);
      rafRef.current = requestAnimationFrame(draw);
    }
  }, [decel]);

  const startBus = () => {
    state.current.speed = 20;
    state.current.lurch = 0; state.current.lurchV = 0;
    state.current.braking = false;
    setSpeed(20); setBraking(false);
    requestAnimationFrame(draw);
  };
  const brake = () => {
    if (state.current.speed > 0) {
      state.current.braking = true;
      setBraking(true);
      rafRef.current = requestAnimationFrame(draw);
    }
  };

  useEffect(() => { requestAnimationFrame(draw); return () => cancelAnimationFrame(rafRef.current); }, [draw]);

  return (
    <Card title="🚌 Bus Braking — Inertia of Motion" desc="When a moving bus brakes suddenly, passengers lurch FORWARD. They were in motion with the bus, and their inertia keeps them moving forward even though the bus has stopped. This is Newton's 1st Law applied to people!">
      <canvas ref={canvasRef} width={540} height={220} style={{ width: "100%", borderRadius: 12, border: "1px solid #1e293b" }} />
      <div style={{ display: "flex", gap: 14, marginTop: 14, alignItems: "center", flexWrap: "wrap" }}>
        <Ctrl label="Braking Deceleration (m/s²)" min={1} max={15} value={decel} color="#ef4444" onChange={setDecel} />
        <Btn onClick={startBus} label="🚌 Set Speed = 20 m/s" color="#10b981" />
        <Btn onClick={brake} label="⛔ BRAKE!" active={braking} color="#ef4444" />
      </div>
      <Row items={[
        { label: "Bus Speed", value: `${speed.toFixed(1)} m/s`, color: "#22d3ee" },
        { label: "Deceleration", value: braking ? `${decel} m/s²` : "0 m/s²", color: "#ef4444" },
        { label: "Passenger Inertia", value: "Forward lurch", color: "#f59e0b" },
        { label: "Net force on bus", value: braking ? `${(70000 * decel).toLocaleString()} N` : "0 N", color: "#a78bfa" },
      ]} />
    </Card>
  );
}

/* ══════════════════════════════════════════════════
 * T3-BONUS-1: F=ma SIDE-BY-SIDE COMPARISON
 * Two scenarios: same F with different masses → different accelerations
 * ══════════════════════════════════════════════════ */
export function Sim_fma_compare() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const state     = useRef({ x1: 40, x2: 40, running: false });
  const [force, setForce] = useState(100);
  const [m1, setM1] = useState(5);
  const [m2, setM2] = useState(20);
  const [running, setRunning] = useState(false);

  const a1 = force / m1;
  const a2 = force / m2;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const s = state.current;

    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, W, H);

    /* Track lines */
    ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(20, H / 4 + 20); ctx.lineTo(W - 20, H / 4 + 20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(20, 3 * H / 4 + 20); ctx.lineTo(W - 20, 3 * H / 4 + 20); ctx.stroke();

    /* Finish line */
    ctx.strokeStyle = "#10b981"; ctx.lineWidth = 2; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(W - 40, 20); ctx.lineTo(W - 40, H - 20); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#10b981"; ctx.font = "bold 11px Inter"; ctx.textAlign = "center";
    ctx.fillText("FINISH", W - 40, 14);

    /* Object 1 (lighter — faster) */
    const s1 = Math.min(s.x1, W - 60);
    ctx.fillStyle = "#6366f1";
    ctx.beginPath(); ctx.roundRect(s1 - 20, H / 4 - 18, 40, 36, 6); ctx.fill();
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 11px JetBrains Mono"; ctx.textAlign = "center";
    ctx.fillText(`${m1}kg`, s1, H / 4 + 6);

    /* Object 2 (heavier — slower) */
    const s2 = Math.min(s.x2, W - 60);
    ctx.fillStyle = "#dc2626";
    ctx.beginPath(); ctx.roundRect(s2 - 20, 3 * H / 4 - 18, 40, 36, 6); ctx.fill();
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 11px JetBrains Mono"; ctx.textAlign = "center";
    ctx.fillText(`${m2}kg`, s2, 3 * H / 4 + 6);

    /* Force arrows */
    ctx.strokeStyle = "#10b981"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(s1 + 24, H / 4); ctx.lineTo(s1 + 50, H / 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s2 + 24, 3 * H / 4); ctx.lineTo(s2 + 50, 3 * H / 4); ctx.stroke();
    ctx.fillStyle = "#10b981"; ctx.font = "bold 10px JetBrains Mono"; ctx.textAlign = "left";
    ctx.fillText(`F=${force}N`, s1 + 52, H / 4 + 4);
    ctx.fillText(`F=${force}N`, s2 + 52, 3 * H / 4 + 4);

    /* Labels */
    ctx.fillStyle = "#6366f1"; ctx.font = "bold 13px Inter"; ctx.textAlign = "left";
    ctx.fillText(`a₁ = ${force}/${m1} = ${a1.toFixed(1)} m/s²  (FASTER)`, 25, H / 4 - 28);
    ctx.fillStyle = "#dc2626";
    ctx.fillText(`a₂ = ${force}/${m2} = ${a2.toFixed(1)} m/s²  (SLOWER)`, 25, 3 * H / 4 - 28);

    /* Winner announcement */
    if (s.x1 >= W - 60 && s.running) {
      ctx.fillStyle = "#fbbf24"; ctx.font = "bold 18px Inter"; ctx.textAlign = "center";
      ctx.fillText("🏆 Lighter object wins! Same F → Less mass = More acceleration!", W / 2, H - 14);
    }

    /* Physics */
    if (s.running) {
      s.x1 += a1 * 0.04;
      s.x2 += a2 * 0.04;
      if (s.x1 < W - 40) rafRef.current = requestAnimationFrame(draw);
      else { s.running = false; setRunning(false); rafRef.current = requestAnimationFrame(draw); }
    }
  }, [force, m1, m2, a1, a2]);

  const start = () => {
    state.current = { x1: 40, x2: 40, running: true };
    setRunning(true);
    rafRef.current = requestAnimationFrame(draw);
  };
  const reset = () => {
    cancelAnimationFrame(rafRef.current);
    state.current = { x1: 40, x2: 40, running: false };
    setRunning(false);
    requestAnimationFrame(draw);
  };

  useEffect(() => { requestAnimationFrame(draw); return () => cancelAnimationFrame(rafRef.current); }, [draw]);

  return (
    <Card title="⚖️ F=ma Race — Same Force, Different Mass" desc="Two objects get EXACTLY the same force applied. Watch which one accelerates faster! Newton's 2nd Law: F = ma → a = F/m. Less mass = more acceleration with the same force.">
      <canvas ref={canvasRef} width={540} height={200} style={{ width: "100%", borderRadius: 12, border: "1px solid #1e293b" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
        <div>
          <Ctrl label="Applied Force F (N)" min={10} max={300} value={force} color="#10b981" onChange={setForce} />
          <Ctrl label="Mass 1 — Blue (kg)" min={1} max={30} value={m1} color="#6366f1" onChange={setM1} />
          <Ctrl label="Mass 2 — Red (kg)" min={5} max={80} value={m2} color="#dc2626" onChange={setM2} />
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <Btn onClick={start} label="▶ RACE!" active={running} color="#10b981" />
            <Btn onClick={reset} label="↺ Reset" color="#64748b" />
          </div>
        </div>
        <Row items={[
          { label: "F (same)", value: `${force} N`, color: "#10b981" },
          { label: "a₁ (light)", value: `${a1.toFixed(2)} m/s²`, color: "#6366f1" },
          { label: "a₂ (heavy)", value: `${a2.toFixed(2)} m/s²`, color: "#dc2626" },
          { label: "Ratio a₁/a₂", value: `${(a1 / a2).toFixed(1)}×`, color: "#f59e0b" },
        ]} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════
 * T3-BONUS-2: ELEVATOR SCALE — APPARENT WEIGHT
 * Scale reading changes with elevator acceleration (F=ma consequence).
 * ══════════════════════════════════════════════════ */
export function Sim_elevator_weight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const state     = useRef({ y: 400, v: 0, a: 0, phase: "idle" as string });
  const [mass, setMass]   = useState(60);
  const [accel, setAccel] = useState(3);
  const [dir, setDir]     = useState<"up" | "down" | "idle">("idle");
  const [reading, setReading] = useState(mass * 9.8);

  const g = 9.8;
  const trueWeight = mass * g;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const s = state.current;

    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, W, H);

    /* Building shaft */
    ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 2;
    ctx.strokeRect(W / 2 - 70, 20, 140, H - 40);

    /* Floor markers */
    for (let floor = 0; floor < 5; floor++) {
      const fy = H - 40 - floor * ((H - 60) / 4);
      ctx.strokeStyle = "#0f172a"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(W / 2 - 70, fy); ctx.lineTo(W / 2 - 68, fy); ctx.stroke();
      ctx.fillStyle = "#334155"; ctx.font = "10px Inter"; ctx.textAlign = "right";
      ctx.fillText(`F${floor + 1}`, W / 2 - 76, fy + 4);
    }

    /* Elevator cabin */
    const cabinH = 80, cabinW = 110;
    const cabinY = s.y - cabinH;
    ctx.fillStyle = "#1e3a5f";
    ctx.fillRect(W / 2 - cabinW / 2, cabinY, cabinW, cabinH);
    ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 2;
    ctx.strokeRect(W / 2 - cabinW / 2, cabinY, cabinW, cabinH);

    /* Person on scale */
    ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 3;
    const px = W / 2, py = cabinY + 25;
    ctx.beginPath(); ctx.arc(px, py - 14, 10, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px, py - 4); ctx.lineTo(px, py + 20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px, py + 5); ctx.lineTo(px - 10, py + 15); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px, py + 5); ctx.lineTo(px + 10, py + 15); ctx.stroke();

    /* Scale */
    ctx.fillStyle = "#334155";
    ctx.fillRect(px - 18, cabinY + cabinH - 14, 36, 12);
    const scaleReading = mass * (g + (s.a > 0 && s.phase === "up" ? s.a : s.phase === "down" ? -Math.min(s.a, g * 0.9) : 0));
    setReading(Math.max(0, scaleReading));
    ctx.fillStyle = "#22d3ee"; ctx.font = "bold 10px JetBrains Mono"; ctx.textAlign = "center";
    ctx.fillText(`${scaleReading.toFixed(0)}N`, px, cabinY + cabinH - 4);

    /* Cable */
    ctx.strokeStyle = "#64748b"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(W / 2, cabinY); ctx.lineTo(W / 2, 20); ctx.stroke();

    /* Acceleration arrow */
    if (Math.abs(s.a) > 0.1 && s.phase !== "idle") {
      const dir2 = s.phase === "up" ? -1 : 1;
      const arrowY = cabinY + cabinH / 2;
      ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(W / 2 + 70, arrowY); ctx.lineTo(W / 2 + 70, arrowY + dir2 * 40); ctx.stroke();
      ctx.fillStyle = "#f59e0b"; ctx.font = "bold 11px JetBrains Mono"; ctx.textAlign = "left";
      ctx.fillText(`a=${s.a.toFixed(1)}`, W / 2 + 76, arrowY + dir2 * 20);
    }

    /* Status label */
    const statusText = s.phase === "up" ? `🔺 Going UP — a = +${accel} m/s² — Scale reads MORE (apparent weight ↑)` :
                       s.phase === "down" ? `🔻 Going DOWN — a = −${accel} m/s² — Scale reads LESS (apparent weight ↓)` :
                       "Press ▲ or ▼ to move the elevator";
    ctx.fillStyle = s.phase === "up" ? "#10b981" : s.phase === "down" ? "#ef4444" : "#64748b";
    ctx.font = "12px Inter"; ctx.textAlign = "center";
    ctx.fillText(statusText, W / 2 + 80, H - 12);

    /* Physics step */
    if (s.phase === "up") {
      s.a = accel;
      s.v -= 0.5;
      s.y = Math.max(cabinH + 20, s.y + s.v);
      if (s.y <= cabinH + 20) { s.phase = "idle"; s.v = 0; s.a = 0; }
      rafRef.current = requestAnimationFrame(draw);
    } else if (s.phase === "down") {
      s.a = accel;
      s.v += 0.5;
      s.y = Math.min(H - 40, s.y + s.v);
      if (s.y >= H - 40) { s.phase = "idle"; s.v = 0; s.a = 0; }
      rafRef.current = requestAnimationFrame(draw);
    }
  }, [mass, accel]);

  const moveUp   = () => { if (state.current.y > 100) { state.current.phase = "up"; state.current.v = 0; setDir("up"); rafRef.current = requestAnimationFrame(draw); } };
  const moveDown = () => { if (state.current.y < 400) { state.current.phase = "down"; state.current.v = 0; setDir("down"); rafRef.current = requestAnimationFrame(draw); } };

  useEffect(() => { state.current = { y: 350, v: 0, a: 0, phase: "idle" }; requestAnimationFrame(draw); return () => cancelAnimationFrame(rafRef.current); }, [draw]);

  return (
    <Card title="🛗 Elevator Scale — Apparent Weight" desc="Your scale reading CHANGES when an elevator accelerates. Going UP: scale reads more (heavier!). Going DOWN: scale reads less (lighter!). This is F=ma: N − mg = ma, so N = m(g+a) going up, N = m(g−a) going down.">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <canvas ref={canvasRef} width={400} height={320} style={{ width: "100%", borderRadius: 12, border: "1px solid #1e293b" }} />
        <div>
          <Ctrl label="Person Mass (kg)" min={30} max={120} value={mass} color="#fbbf24" onChange={setMass} />
          <Ctrl label="Elevator Acceleration (m/s²)" min={1} max={8} value={accel} color="#f59e0b" onChange={setAccel} />
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <Btn onClick={moveUp} label="▲ GO UP" active={dir === "up"} color="#10b981" />
            <Btn onClick={moveDown} label="▼ GO DOWN" active={dir === "down"} color="#ef4444" />
          </div>
          <Row items={[
            { label: "True Weight", value: `${trueWeight.toFixed(0)} N`, color: "#94a3b8" },
            { label: "Scale Reading", value: `${reading.toFixed(0)} N`, color: "#22d3ee" },
            { label: "True Mass", value: `${mass} kg`, color: "#94a3b8" },
            { label: "Apparent Wt", value: `${(reading / g).toFixed(1)} kg`, color: "#f59e0b" },
          ]} />
        </div>
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════
 * T3-BONUS-3: DRAG RACE — MASS AFFECTS ACCELERATION
 * Two cars with same engine force but different mass → different performance
 * ══════════════════════════════════════════════════ */
export function Sim_drag_race() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const state     = useRef({ x1: 60, x2: 60, v1: 0, v2: 0, running: false });
  const [engineF, setEngineF] = useState(5000);
  const [mass1, setMass1]     = useState(800);
  const [mass2, setMass2]     = useState(2500);
  const [running, setRunning] = useState(false);
  const [winner, setWinner]   = useState("");

  const a1 = engineF / mass1;
  const a2 = engineF / mass2;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const s = state.current;

    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, W, H);

    /* Track */
    ctx.fillStyle = "#0f172a"; ctx.fillRect(0, H / 2 - 45, W, 90);
    ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 2; ctx.setLineDash([20, 15]);
    ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();
    ctx.setLineDash([]);

    /* Finish */
    ctx.strokeStyle = "#10b981"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(W - 50, 20); ctx.lineTo(W - 50, H - 20); ctx.stroke();
    ctx.fillStyle = "#10b981"; ctx.font = "bold 11px Inter"; ctx.textAlign = "center";
    ctx.fillText("FINISH", W - 50, 14);

    /* Cars */
    const drawCar = (x: number, y: number, color1: string, color2: string, label: string) => {
      const cx = Math.min(x, W - 55);
      ctx.fillStyle = color1;
      ctx.beginPath(); ctx.roundRect(cx - 30, y - 16, 60, 30, 5); ctx.fill();
      ctx.fillStyle = color2;
      ctx.beginPath(); ctx.roundRect(cx - 20, y - 28, 36, 16, 5); ctx.fill();
      /* Wheels */
      [cx - 16, cx + 16].forEach(wx => {
        ctx.fillStyle = "#0f172a"; ctx.beginPath(); ctx.arc(wx, y + 14, 10, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#64748b"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(wx, y + 14, 10, 0, Math.PI * 2); ctx.stroke();
      });
      ctx.fillStyle = "#ffffff"; ctx.font = "bold 10px Inter"; ctx.textAlign = "center";
      ctx.fillText(label, cx, y + 2);
    };

    drawCar(s.x1, H / 2 - 22, "#4f46e5", "#818cf8", `${mass1}kg`);
    drawCar(s.x2, H / 2 + 22, "#b91c1c", "#ef4444", `${mass2}kg`);

    /* Acceleration labels */
    ctx.fillStyle = "#818cf8"; ctx.font = "bold 12px JetBrains Mono"; ctx.textAlign = "left";
    ctx.fillText(`a = ${a1.toFixed(2)} m/s²`, 20, 28);
    ctx.fillStyle = "#ef4444";
    ctx.fillText(`a = ${a2.toFixed(2)} m/s²`, 20, H - 28);

    /* Speed readouts */
    ctx.fillStyle = "#818cf8"; ctx.font = "11px JetBrains Mono"; ctx.textAlign = "left";
    ctx.fillText(`v = ${s.v1.toFixed(1)} m/s`, Math.min(s.x1 + 35, W - 100), H / 2 - 22);
    ctx.fillStyle = "#ef4444";
    ctx.fillText(`v = ${s.v2.toFixed(1)} m/s`, Math.min(s.x2 + 35, W - 100), H / 2 + 22);

    /* Winner */
    if (winner) {
      ctx.fillStyle = "#fbbf24"; ctx.font = "bold 16px Inter"; ctx.textAlign = "center";
      ctx.fillText(`🏆 ${winner}`, W / 2, H - 14);
    }

    /* Physics */
    if (s.running) {
      s.v1 += a1 * 0.015;
      s.v2 += a2 * 0.015;
      s.x1 += s.v1 * 0.15;
      s.x2 += s.v2 * 0.15;
      if (s.x1 >= W - 55 || s.x2 >= W - 55) {
        s.running = false;
        setRunning(false);
        if (s.x1 >= W - 55) setWinner(`Light car (${mass1}kg) wins! F=ma: less mass = more acceleration!`);
        else setWinner(`Heavy car (${mass2}kg) surprisingly won — check your values!`);
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      rafRef.current = requestAnimationFrame(draw);
    }
  }, [engineF, mass1, mass2, a1, a2, winner]);

  const start = () => {
    state.current = { x1: 60, x2: 60, v1: 0, v2: 0, running: true };
    setRunning(true); setWinner("");
    rafRef.current = requestAnimationFrame(draw);
  };
  const reset = () => {
    cancelAnimationFrame(rafRef.current);
    state.current = { x1: 60, x2: 60, v1: 0, v2: 0, running: false };
    setRunning(false); setWinner("");
    requestAnimationFrame(draw);
  };

  useEffect(() => { requestAnimationFrame(draw); return () => cancelAnimationFrame(rafRef.current); }, [draw]);

  return (
    <Card title="🏎️ Drag Race — Mass vs Acceleration (F=ma)" desc="Both cars have the SAME engine force but DIFFERENT masses. F = ma means a = F/m. Lighter car → less m → more a → wins the race! This proves Newton's 2nd Law visually.">
      <canvas ref={canvasRef} width={540} height={200} style={{ width: "100%", borderRadius: 12, border: "1px solid #1e293b" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
        <div>
          <Ctrl label="Engine Force (N) — same for both" min={1000} max={20000} value={engineF} color="#10b981" onChange={setEngineF} />
          <Ctrl label="Car 1 Mass — Blue (kg)" min={400} max={2000} value={mass1} color="#818cf8" onChange={setMass1} />
          <Ctrl label="Car 2 Mass — Red (kg)" min={1000} max={8000} value={mass2} color="#ef4444" onChange={setMass2} />
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <Btn onClick={start} label="▶ RACE!" active={running} color="#10b981" />
            <Btn onClick={reset} label="↺ Reset" color="#64748b" />
          </div>
        </div>
        <Row items={[
          { label: "Engine Force", value: `${engineF.toLocaleString()} N`, color: "#10b981" },
          { label: "a₁ (blue)", value: `${a1.toFixed(2)} m/s²`, color: "#818cf8" },
          { label: "a₂ (red)", value: `${a2.toFixed(2)} m/s²`, color: "#ef4444" },
          { label: "Ratio a₁/a₂", value: `${(a1/a2).toFixed(1)}×`, color: "#f59e0b" },
        ]} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════
 * T4-BONUS-1: WATER ROCKET — ACTION/REACTION JET
 * Water expelled backward → balloon/bottle moves forward
 * ══════════════════════════════════════════════════ */
export function Sim_water_rocket() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const state     = useRef({ x: 60, vx: 0, waterLeft: 100, running: false, droplets: [] as {x:number,y:number,vx:number,vy:number,life:number}[] });
  const [exhaust, setExhaust] = useState(30);
  const [running, setRunning] = useState(false);
  const [waterLeft, setWaterLeft] = useState(100);

  const rocketMass = 0.5; /* kg, fixed */

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const s = state.current;

    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, W, H);

    /* Ground */
    ctx.fillStyle = "#1e293b"; ctx.fillRect(0, H - 30, W, 30);

    /* Water droplets */
    s.droplets.forEach(d => {
      ctx.fillStyle = `rgba(56,189,248,${d.life / 30})`;
      ctx.beginPath(); ctx.arc(d.x, d.y, 3, 0, Math.PI * 2); ctx.fill();
    });

    /* Rocket body (bottle) */
    const rx = Math.min(s.x, W - 80);
    const ry = H - 30 - 60;
    ctx.fillStyle = "#bfdbfe";
    ctx.beginPath(); ctx.roundRect(rx, ry, 60, 50, 8); ctx.fill();
    ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(rx, ry, 60, 50, 8); ctx.stroke();

    /* Nozzle */
    ctx.fillStyle = "#475569";
    ctx.fillRect(rx - 10, ry + 20, 12, 10);

    /* Water level in bottle */
    const waterH = (s.waterLeft / 100) * 36;
    ctx.fillStyle = "rgba(56,189,248,0.5)";
    ctx.fillRect(rx + 4, ry + 50 - waterH, 52, waterH);

    /* Fins */
    ctx.fillStyle = "#334155";
    ctx.beginPath(); ctx.moveTo(rx, ry + 40); ctx.lineTo(rx - 20, ry + 60); ctx.lineTo(rx, ry + 60); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(rx + 60, ry + 40); ctx.lineTo(rx + 80, ry + 60); ctx.lineTo(rx + 60, ry + 60); ctx.closePath(); ctx.fill();

    /* Labels */
    ctx.fillStyle = "#64748b"; ctx.font = "12px Inter"; ctx.textAlign = "center";
    if (!s.running && s.waterLeft > 0) {
      ctx.fillText("Water rockets: action = water expelled backward → reaction = rocket moves forward!", W / 2, 22);
    } else if (s.running) {
      ctx.fillStyle = "#22d3ee";
      ctx.fillText(`Thrust = ${(exhaust * 0.1).toFixed(0)} N →→  Newton's 3rd Law!`, W / 2, 22);
    } else {
      ctx.fillStyle = "#ef4444";
      ctx.fillText("Water exhausted! Rocket stops. To fly further → more water or faster exhaust!", W / 2, 22);
    }

    /* Speed readout */
    ctx.fillStyle = "#22d3ee"; ctx.font = "bold 13px JetBrains Mono"; ctx.textAlign = "left";
    ctx.fillText(`Speed: ${s.vx.toFixed(1)} m/s`, 16, H - 36);
    ctx.fillStyle = "#f59e0b";
    ctx.fillText(`Water: ${s.waterLeft.toFixed(0)}%`, 16, H - 52);

    /* Physics */
    if (s.running && s.waterLeft > 0) {
      const thrust = exhaust * 0.1;
      const a = thrust / rocketMass;
      s.vx += a * 0.016;
      s.x  += s.vx;
      s.waterLeft = Math.max(0, s.waterLeft - 0.4);
      setWaterLeft(s.waterLeft);

      /* Add droplets */
      for (let i = 0; i < 3; i++) {
        s.droplets.push({ x: rx - 5, y: ry + 24, vx: -(4 + Math.random() * 3), vy: (Math.random() - 0.5) * 3, life: 30 });
      }

      /* Update droplets */
      s.droplets = s.droplets
        .map(d => ({ ...d, x: d.x + d.vx, y: d.y + d.vy, vy: d.vy + 0.2, life: d.life - 1 }))
        .filter(d => d.life > 0);

      if (s.x > W - 80) {
        s.running = false; setRunning(false);
      }
      rafRef.current = requestAnimationFrame(draw);
    } else if (s.waterLeft === 0) {
      s.running = false; setRunning(false);
    }
  }, [exhaust]);

  const launch = () => {
    state.current = { x: 60, vx: 0, waterLeft: 100, running: true, droplets: [] };
    setWaterLeft(100); setRunning(true);
    rafRef.current = requestAnimationFrame(draw);
  };
  const reset = () => {
    cancelAnimationFrame(rafRef.current);
    state.current = { x: 60, vx: 0, waterLeft: 100, running: false, droplets: [] };
    setWaterLeft(100); setRunning(false);
    requestAnimationFrame(draw);
  };

  useEffect(() => { requestAnimationFrame(draw); return () => cancelAnimationFrame(rafRef.current); }, [draw]);

  return (
    <Card title="💧 Water Rocket — Action/Reaction Jet" desc="Water is expelled BACKWARD (action force on water). By Newton's 3rd Law, the water pushes the rocket FORWARD with equal force (reaction). The faster/more water expelled → the greater the thrust!">
      <canvas ref={canvasRef} width={540} height={200} style={{ width: "100%", borderRadius: 12, border: "1px solid #1e293b" }} />
      <div style={{ display: "flex", gap: 14, marginTop: 14, alignItems: "flex-end", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 180 }}>
          <Ctrl label="Exhaust Speed" min={5} max={80} value={exhaust} color="#38bdf8" onChange={setExhaust} />
        </div>
        <Btn onClick={launch} label="🚀 LAUNCH!" active={running} color="#10b981" />
        <Btn onClick={reset} label="↺ Refill" color="#64748b" />
      </div>
      <Row items={[
        { label: "Exhaust Speed", value: `${exhaust} units`, color: "#38bdf8" },
        { label: "Thrust", value: `${(exhaust * 0.1).toFixed(0)} N`, color: "#10b981" },
        { label: "Water Left", value: `${waterLeft.toFixed(0)}%`, color: "#60a5fa" },
        { label: "Principle", value: "3rd Law", color: "#f59e0b" },
      ]} />
    </Card>
  );
}

/* ══════════════════════════════════════════════════
 * T4-BONUS-2: ROWING BOAT — ACTION/REACTION IN WATER
 * Oar pushes water BACKWARD → water pushes boat FORWARD
 * ══════════════════════════════════════════════════ */
export function Sim_rowing_boat() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const state     = useRef({ x: 80, phase: 0, running: false });
  const [running, setRunning] = useState(false);
  const [strokes, setStrokes] = useState(0);
  const strokeRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const s = state.current;

    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, W, H);

    /* Water */
    ctx.fillStyle = "#0c4a6e";
    ctx.fillRect(0, H / 2, W, H / 2);

    /* Water ripples */
    ctx.strokeStyle = "rgba(56,189,248,0.2)"; ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.ellipse(W / 2, H / 2, 60 + i * 30, 8 + i * 4, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    /* Boat */
    const bx = Math.min(s.x, W - 50);
    const by = H / 2 - 20;

    /* Hull */
    ctx.fillStyle = "#92400e";
    ctx.beginPath();
    ctx.moveTo(bx - 60, by);
    ctx.quadraticCurveTo(bx, by + 20, bx + 60, by);
    ctx.lineTo(bx + 50, by - 24);
    ctx.lineTo(bx - 50, by - 24);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#78350f"; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bx - 60, by);
    ctx.quadraticCurveTo(bx, by + 20, bx + 60, by);
    ctx.stroke();

    /* Rower (stick figure) */
    ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 3;
    const rx = bx, ry = by - 30;
    ctx.beginPath(); ctx.arc(rx, ry - 14, 10, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(rx, ry - 4); ctx.lineTo(rx, ry + 18); ctx.stroke();

    /* Oar animation */
    const oarAngle = Math.sin(s.phase) * 0.6;
    const oarLen = 70;
    const oarStartX = rx, oarStartY = ry;
    const oarEndX = oarStartX + oarLen * Math.sin(oarAngle + 1.2);
    const oarEndY = oarStartY + oarLen * Math.cos(oarAngle + 0.2);

    ctx.strokeStyle = "#a16207"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(oarStartX, oarStartY); ctx.lineTo(oarEndX, oarEndY); ctx.stroke();

    /* Blade */
    ctx.fillStyle = "#ca8a04";
    ctx.beginPath(); ctx.ellipse(oarEndX, oarEndY, 14, 5, oarAngle + 1.2, 0, Math.PI * 2); ctx.fill();

    /* Force arrows */
    if (s.running) {
      /* Action: oar pushes water backward */
      ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(oarEndX, oarEndY + 10); ctx.lineTo(oarEndX - 30, oarEndY + 10); ctx.stroke();
      ctx.fillStyle = "#ef4444"; ctx.font = "bold 10px Inter"; ctx.textAlign = "right";
      ctx.fillText("← Action (pushes water back)", oarEndX - 34, oarEndY + 14);

      /* Reaction: water pushes boat forward */
      ctx.strokeStyle = "#10b981"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(bx + 65, by - 12); ctx.lineTo(bx + 95, by - 12); ctx.stroke();
      ctx.fillStyle = "#10b981"; ctx.font = "bold 10px Inter"; ctx.textAlign = "left";
      ctx.fillText("→ Reaction (boat moves forward!)", bx + 99, by - 8);
    }

    ctx.fillStyle = "#64748b"; ctx.font = "12px Inter"; ctx.textAlign = "center";
    ctx.fillText("Action: oar pushes water backward   |   Reaction: water pushes boat forward (3rd Law)", W / 2, H - 10);
    ctx.fillStyle = "#f59e0b"; ctx.font = "bold 12px JetBrains Mono"; ctx.textAlign = "left";
    ctx.fillText(`Strokes: ${strokeRef.current}`, 12, 24);

    /* Physics */
    if (s.running) {
      s.phase += 0.08;
      if (Math.sin(s.phase) > 0) s.x += 0.8;
      if (s.phase > Math.PI * 2) {
        s.phase = 0;
        strokeRef.current++;
        setStrokes(strokeRef.current);
      }
      rafRef.current = requestAnimationFrame(draw);
    }
  }, []);

  const start = () => {
    state.current = { x: 80, phase: 0, running: true };
    strokeRef.current = 0; setStrokes(0); setRunning(true);
    rafRef.current = requestAnimationFrame(draw);
  };
  const stop  = () => { state.current.running = false; setRunning(false); cancelAnimationFrame(rafRef.current); };
  const reset = () => {
    stop();
    state.current = { x: 80, phase: 0, running: false };
    strokeRef.current = 0; setStrokes(0);
    requestAnimationFrame(draw);
  };

  useEffect(() => { requestAnimationFrame(draw); return () => cancelAnimationFrame(rafRef.current); }, [draw]);

  return (
    <Card title="🚣 Rowing Boat — Newton's 3rd Law in Water" desc="The rower pushes the water BACKWARD with the oar (action force). Water pushes the boat FORWARD with equal and opposite force (reaction). No water to push → no motion! This is why boats can't row on land.">
      <canvas ref={canvasRef} width={540} height={220} style={{ width: "100%", borderRadius: 12, border: "1px solid #1e293b" }} />
      <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
        <Btn onClick={running ? stop : start} label={running ? "⏸ Stop" : "🚣 ROW!"} active={running} color="#10b981" />
        <Btn onClick={reset} label="↺ Reset" color="#64748b" />
        <span style={{ color: "#f59e0b", fontSize: 13, fontWeight: 700, alignSelf: "center", fontFamily: "monospace" }}>Strokes: {strokes}</span>
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════
 * T4-BONUS-3: MAGNET REPULSION — FORCE PAIRS
 * Two magnets on frictionless track — equal & opposite forces
 * ══════════════════════════════════════════════════ */
export function Sim_magnet_forces() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const state     = useRef({ x1: 160, x2: 340, v1: 0, v2: 0, running: false });
  const [m1, setM1]   = useState(1);
  const [m2, setM2]   = useState(3);
  const [running, setRunning] = useState(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const s = state.current;

    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, W, H);

    /* Track (frictionless ice) */
    ctx.fillStyle = "#0c4a6e";
    ctx.fillRect(20, H / 2 + 20, W - 40, 8);
    ctx.fillStyle = "#7dd3fc";
    ctx.fillRect(20, H / 2 + 20, W - 40, 4);
    ctx.fillStyle = "#bfdbfe"; ctx.font = "10px Inter"; ctx.textAlign = "center";
    ctx.fillText("Frictionless track (μ = 0)", W / 2, H - 10);

    /* Magnetic field lines between magnets */
    const cx = (s.x1 + s.x2) / 2;
    const gap = s.x2 - s.x1;
    for (let i = 0; i < 5; i++) {
      const alpha = (1 - i / 5) * 0.4;
      ctx.strokeStyle = `rgba(239,68,68,${alpha})`;
      ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.ellipse(cx, H / 2, gap / 2 - 20, 20 + i * 8, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    /* Magnet 1 */
    const drawMagnet = (x: number, mass: number, flipped: boolean, label: string) => {
      const mW = 50 + mass * 4, mH = 36;
      const mx = x - mW / 2;
      const my = H / 2 - mH / 2;

      ctx.fillStyle = flipped ? "#dc2626" : "#1d4ed8";
      ctx.fillRect(mx, my, mW / 2, mH);
      ctx.fillStyle = flipped ? "#1d4ed8" : "#dc2626";
      ctx.fillRect(mx + mW / 2, my, mW / 2, mH);

      ctx.strokeStyle = "#334155"; ctx.lineWidth = 2;
      ctx.strokeRect(mx, my, mW, mH);

      /* N/S labels */
      ctx.fillStyle = "#ffffff"; ctx.font = "bold 12px Inter"; ctx.textAlign = "center";
      ctx.fillText(flipped ? "S" : "N", mx + mW * 0.25, my + 24);
      ctx.fillText(flipped ? "N" : "S", mx + mW * 0.75, my + 24);

      ctx.fillStyle = "#94a3b8"; ctx.font = "11px JetBrains Mono"; ctx.textAlign = "center";
      ctx.fillText(label, x, my - 10);
    };

    drawMagnet(s.x1, m1, false, `${m1} kg  v=${s.v1.toFixed(1)}m/s`);
    drawMagnet(s.x2, m2, true, `${m2} kg  v=${s.v2.toFixed(1)}m/s`);

    /* Repulsion force arrows */
    if (gap < 250) {
      const force = 2000 / (gap * gap) * 100;
      const arrowLen = Math.min(force * 0.4, 80);
      ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(s.x1 + 30, H / 2); ctx.lineTo(s.x1 + 30 - arrowLen, H / 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s.x2 - 30, H / 2); ctx.lineTo(s.x2 - 30 + arrowLen, H / 2); ctx.stroke();
      ctx.fillStyle = "#f59e0b"; ctx.font = "10px JetBrains Mono"; ctx.textAlign = "center";
      ctx.fillText(`F = ${force.toFixed(0)} N (equal!)`, (s.x1 + s.x2) / 2, H / 2 + 44);
    }

    /* Physics */
    if (s.running) {
      const dist = Math.max(s.x2 - s.x1, 10);
      const force = 2000 / (dist * dist) * 100;
      const a1Mag = force / m1;
      const a2Mag = force / m2;
      s.v1 -= a1Mag * 0.016; /* pushed left */
      s.v2 += a2Mag * 0.016; /* pushed right */
      s.x1 = Math.max(20, s.x1 + s.v1);
      s.x2 = Math.min(W - 20, s.x2 + s.v2);
      if (s.x1 <= 22 || s.x2 >= W - 22) { s.running = false; setRunning(false); }
      rafRef.current = requestAnimationFrame(draw);
    }
  }, [m1, m2]);

  const start = () => {
    state.current = { x1: 180, x2: 360, v1: 0, v2: 0, running: true };
    setRunning(true);
    rafRef.current = requestAnimationFrame(draw);
  };
  const reset = () => {
    cancelAnimationFrame(rafRef.current);
    state.current = { x1: 180, x2: 360, v1: 0, v2: 0, running: false };
    setRunning(false);
    requestAnimationFrame(draw);
  };

  useEffect(() => { requestAnimationFrame(draw); return () => cancelAnimationFrame(rafRef.current); }, [draw]);

  return (
    <Card title="🧲 Magnet Repulsion — Equal & Opposite Force Pairs" desc="Two N-poles facing each other repel. The force on Magnet 1 (left) equals the force on Magnet 2 (right) — Newton's 3rd Law! But notice: lighter magnet accelerates MORE (Newton's 2nd Law at the same time!).">
      <canvas ref={canvasRef} width={540} height={200} style={{ width: "100%", borderRadius: 12, border: "1px solid #1e293b" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
        <div>
          <Ctrl label="Mass of Magnet 1 — Left (kg)" min={1} max={10} value={m1} color="#3b82f6" onChange={setM1} />
          <Ctrl label="Mass of Magnet 2 — Right (kg)" min={1} max={10} value={m2} color="#dc2626" onChange={setM2} />
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <Btn onClick={start} label="▶ Release!" active={running} color="#10b981" />
            <Btn onClick={reset} label="↺ Reset" color="#64748b" />
          </div>
        </div>
        <Row items={[
          { label: "Forces Equal?", value: "YES (3rd Law)", color: "#10b981" },
          { label: "a₁ (light)", value: m1 < m2 ? "Greater" : "Equal/Less", color: "#3b82f6" },
          { label: "a₂ (heavy)", value: m2 > m1 ? "Smaller" : "Equal/More", color: "#dc2626" },
          { label: "Key Law", value: "F₁₂ = −F₂₁", color: "#f59e0b" },
        ]} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════
 * T4-BONUS-4: JUMP PHYSICS — FLOOR REACTION FORCE
 * Person pushes DOWN on floor (action) → floor pushes UP (reaction) → person jumps
 * ══════════════════════════════════════════════════ */
export function Sim_jump_floor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef    = useRef<number>(0);
  const state     = useRef({ y: 0, vy: 0, phase: "ready" as "ready"|"jump"|"fall"|"land" });
  const [mass, setMass]       = useState(60);
  const [jumpF, setJumpF]     = useState(900);
  const [phase, setPhase]     = useState("ready");

  const g = 9.8;
  const weight = mass * g;
  const netUpF = jumpF - weight;
  const canJump = netUpF > 0;

  const draw = useCallback(() => {
    const canvas = canvasRef.current as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const s = state.current;

    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, W, H);

    /* Ground */
    const groundY = H - 40;
    ctx.fillStyle = "#1e293b"; ctx.fillRect(0, groundY, W, 40);
    ctx.fillStyle = "#334155"; ctx.font = "11px Inter"; ctx.textAlign = "center";
    ctx.fillText("Ground", W / 2, H - 14);

    /* Person */
    const personBaseY = groundY - s.y * 80;
    ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 4;
    const px = W / 2;
    const py = personBaseY - 50;
    ctx.beginPath(); ctx.arc(px, py - 18, 14, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px, py - 4); ctx.lineTo(px, py + 20); ctx.stroke();

    /* Arms and legs based on phase */
    if (s.phase === "jump") {
      /* Arms up */
      ctx.beginPath(); ctx.moveTo(px, py + 4); ctx.lineTo(px - 18, py - 14); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, py + 4); ctx.lineTo(px + 18, py - 14); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, py + 20); ctx.lineTo(px - 12, py + 38); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, py + 20); ctx.lineTo(px + 12, py + 38); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.moveTo(px, py + 4); ctx.lineTo(px - 16, py + 14); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, py + 4); ctx.lineTo(px + 16, py + 14); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, py + 20); ctx.lineTo(px - 10, py + 40); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, py + 20); ctx.lineTo(px + 10, py + 40); ctx.stroke();
    }

    /* Force arrows when on ground */
    if (s.phase === "ready" || s.phase === "land") {
      /* Weight arrow (down) */
      ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(px + 50, py); ctx.lineTo(px + 50, py + 50); ctx.stroke();
      ctx.fillStyle = "#ef4444";
      ctx.beginPath(); ctx.moveTo(px + 50, py + 50); ctx.lineTo(px + 44, py + 36); ctx.lineTo(px + 56, py + 36); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#ef4444"; ctx.font = "bold 11px JetBrains Mono"; ctx.textAlign = "left";
      ctx.fillText(`W = ${weight.toFixed(0)}N ↓`, px + 56, py + 25);

      /* Normal reaction arrow (up) */
      ctx.strokeStyle = "#10b981"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(px - 50, personBaseY); ctx.lineTo(px - 50, personBaseY - 50); ctx.stroke();
      ctx.fillStyle = "#10b981";
      ctx.beginPath(); ctx.moveTo(px - 50, personBaseY - 50); ctx.lineTo(px - 56, personBaseY - 36); ctx.lineTo(px - 44, personBaseY - 36); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#10b981"; ctx.font = "bold 11px JetBrains Mono"; ctx.textAlign = "right";
      ctx.fillText(`N = ${weight.toFixed(0)}N ↑`, px - 56, personBaseY - 25);
    }

    if (s.phase === "jump") {
      /* Jump force arrows */
      ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(px + 50, personBaseY); ctx.lineTo(px + 50, personBaseY - 80); ctx.stroke();
      ctx.fillStyle = "#f59e0b"; ctx.font = "bold 11px JetBrains Mono"; ctx.textAlign = "left";
      ctx.fillText(`Jump F = ${jumpF}N ↑`, px + 56, personBaseY - 40);
      ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(px - 50, personBaseY); ctx.lineTo(px - 50, personBaseY + 50); ctx.stroke();
      ctx.fillStyle = "#ef4444"; ctx.font = "10px JetBrains Mono"; ctx.textAlign = "right";
      ctx.fillText(`Action on ground: ${jumpF}N↓`, px - 56, personBaseY + 30);
    }

    /* Height indicator */
    if (s.y > 0.1) {
      ctx.strokeStyle = "#a78bfa"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(px + 80, groundY); ctx.lineTo(px + 80, personBaseY); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#a78bfa"; ctx.font = "bold 11px JetBrains Mono"; ctx.textAlign = "left";
      ctx.fillText(`h = ${(s.y).toFixed(2)} m`, px + 84, (groundY + personBaseY) / 2 + 4);
    }

    /* Status */
    const statusMap = {
      ready: "Press JUMP to see action-reaction forces between person and ground!",
      jump: `🚀 Jumping! Net upward force = ${(netUpF).toFixed(0)} N (Jump force ${jumpF}N - Weight ${weight.toFixed(0)}N)`,
      fall: `🌙 Falling! Gravity: ${weight.toFixed(0)} N ↓`,
      land: `✅ Landed! Ground pushes UP with normal force = ${weight.toFixed(0)} N`,
    };
    ctx.fillStyle = "#64748b"; ctx.font = "12px Inter"; ctx.textAlign = "center";
    ctx.fillText(statusMap[s.phase as keyof typeof statusMap] || "", W / 2, 22);

    /* Physics */
    const dt = 0.016;
    if (s.phase === "jump") {
      s.vy += (netUpF / mass) * dt;
      s.y  += s.vy * dt;
      if (s.y > 0.5) { s.phase = "fall"; setPhase("fall"); }
      rafRef.current = requestAnimationFrame(draw);
    } else if (s.phase === "fall") {
      s.vy -= g * dt;
      s.y  += s.vy * dt;
      if (s.y <= 0) { s.y = 0; s.vy = 0; s.phase = "land"; setPhase("land"); cancelAnimationFrame(rafRef.current); requestAnimationFrame(draw); return; }
      rafRef.current = requestAnimationFrame(draw);
    }
  }, [mass, jumpF, weight, netUpF, g]);

  const jump = () => {
    if (!canJump) return;
    state.current = { y: 0, vy: 0, phase: "jump" };
    setPhase("jump");
    rafRef.current = requestAnimationFrame(draw);
  };
  const reset = () => {
    cancelAnimationFrame(rafRef.current);
    state.current = { y: 0, vy: 0, phase: "ready" };
    setPhase("ready");
    requestAnimationFrame(draw);
  };

  useEffect(() => { requestAnimationFrame(draw); return () => cancelAnimationFrame(rafRef.current); }, [draw]);

  return (
    <Card title="🏃 Jump Physics — Floor Reaction Force" desc="When you push DOWN on the ground (action), the ground pushes UP on you with equal force (reaction) — Newton's 3rd Law! Net upward force = Jump force − Weight. This accelerates you upward.">
      <canvas ref={canvasRef as React.RefObject<HTMLCanvasElement>} width={540} height={240} style={{ width: "100%", borderRadius: 12, border: "1px solid #1e293b" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
        <div>
          <Ctrl label="Body Mass (kg)" min={30} max={120} value={mass} color="#fbbf24" onChange={setMass} />
          <Ctrl label="Jump Force (N)" min={200} max={2000} value={jumpF} color="#10b981" onChange={setJumpF} />
          {!canJump && <p style={{ color: "#ef4444", fontSize: 12, margin: "4px 0" }}>⚠️ Jump force must exceed weight ({weight.toFixed(0)} N) to jump!</p>}
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <Btn onClick={jump} label="🦘 JUMP!" active={phase === "jump"} color={canJump ? "#10b981" : "#64748b"} />
            <Btn onClick={reset} label="↺ Reset" color="#64748b" />
          </div>
        </div>
        <Row items={[
          { label: "Weight (W=mg)", value: `${weight.toFixed(0)} N`, color: "#ef4444" },
          { label: "Jump Force", value: `${jumpF} N`, color: "#10b981" },
          { label: "Net Force Up", value: `${netUpF.toFixed(0)} N`, color: netUpF > 0 ? "#22d3ee" : "#ef4444" },
          { label: "Acceleration", value: canJump ? `${(netUpF/mass).toFixed(1)} m/s²` : "0", color: "#f59e0b" },
        ]} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════
 * T5-BONUS-1: EXPLOSION — MOMENTUM CONSERVATION
 * Object at rest explodes: total momentum before = 0 = total momentum after
 * ══════════════════════════════════════════════════ */
export function Sim_explosion_demo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const state     = useRef({ x1: 270, x2: 270, v1: 0, v2: 0, phase: "ready" as "ready"|"boom"|"moving" });
  const [m1, setM1] = useState(2);
  const [m2, setM2] = useState(5);
  const [phase, setPhase] = useState("ready");

  /* Conservation: m1*v1 + m2*v2 = 0 → v1 = -m2/m1 * v2 */
  const blastImpulse = 200; /* arbitrary units */
  const v2_after = blastImpulse / m2;
  const v1_after = -blastImpulse / m1;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const s = state.current;

    ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, W, H);

    /* Track */
    ctx.fillStyle = "#1e293b"; ctx.fillRect(20, H / 2 + 24, W - 40, 8);

    /* Explosion flash */
    if (s.phase === "boom") {
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = `rgba(251,191,36,${0.8 - i * 0.25})`;
        ctx.beginPath(); ctx.arc(W / 2, H / 2, 20 + i * 16, 0, Math.PI * 2); ctx.fill();
      }
    }

    /* Fragment 1 (left) */
    const f1x = Math.max(30, s.x1);
    ctx.fillStyle = "#4f46e5";
    ctx.beginPath(); ctx.roundRect(f1x - 20, H / 2 - 20, 40, 40, 6); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.font = "bold 11px JetBrains Mono"; ctx.textAlign = "center";
    ctx.fillText(`${m1}kg`, f1x, H / 2 + 5);

    /* Fragment 2 (right) */
    const f2x = Math.min(W - 30, s.x2);
    ctx.fillStyle = "#dc2626";
    ctx.beginPath(); ctx.roundRect(f2x - 20, H / 2 - 20, 40, 40, 6); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.font = "bold 11px JetBrains Mono"; ctx.textAlign = "center";
    ctx.fillText(`${m2}kg`, f2x, H / 2 + 5);

    /* Velocity labels */
    if (s.phase === "moving") {
      ctx.fillStyle = "#4f46e5"; ctx.font = "11px JetBrains Mono"; ctx.textAlign = "center";
      ctx.fillText(`v₁ = ${s.v1.toFixed(1)} m/s`, f1x, H / 2 - 32);
      ctx.fillStyle = "#dc2626";
      ctx.fillText(`v₂ = ${s.v2.toFixed(1)} m/s`, f2x, H / 2 - 32);

      /* Momentum labels */
      ctx.fillStyle = "#818cf8"; ctx.font = "10px JetBrains Mono"; ctx.textAlign = "center";
      ctx.fillText(`p₁=${(m1 * s.v1).toFixed(0)}`, f1x, H / 2 + 42);
      ctx.fillStyle = "#f87171";
      ctx.fillText(`p₂=${(m2 * s.v2).toFixed(0)}`, f2x, H / 2 + 42);

      ctx.fillStyle = "#10b981"; ctx.font = "bold 12px Inter"; ctx.textAlign = "center";
      ctx.fillText(`p₁+p₂ = ${(m1 * s.v1 + m2 * s.v2).toFixed(0)} ≈ 0 ✓ (conserved!)`, W / 2, H - 12);
    } else if (s.phase === "ready") {
      ctx.fillStyle = "#64748b"; ctx.font = "bold 12px Inter"; ctx.textAlign = "center";
      ctx.fillText("Object at REST → total momentum = 0. After explosion: p₁ + p₂ must still = 0!", W / 2, H - 12);
    }

    /* Physics */
    if (s.phase === "moving") {
      s.x1 += s.v1 * 0.4;
      s.x2 += s.v2 * 0.4;
      rafRef.current = requestAnimationFrame(draw);
    }
  }, [m1, m2]);

  const explode = () => {
    state.current = { x1: 270, x2: 270, v1: v1_after, v2: v2_after, phase: "boom" };
    setPhase("boom");
    requestAnimationFrame(draw);
    setTimeout(() => { state.current.phase = "moving"; setPhase("moving"); rafRef.current = requestAnimationFrame(draw); }, 300);
  };
  const reset = () => {
    cancelAnimationFrame(rafRef.current);
    state.current = { x1: 270, x2: 270, v1: 0, v2: 0, phase: "ready" };
    setPhase("ready");
    requestAnimationFrame(draw);
  };

  useEffect(() => { requestAnimationFrame(draw); return () => cancelAnimationFrame(rafRef.current); }, [draw]);

  return (
    <Card title="💥 Explosion — Conservation of Momentum" desc="Two objects are joined at rest (total momentum = 0). An internal explosion pushes them apart. By conservation of momentum, m₁v₁ + m₂v₂ = 0. Lighter fragment flies faster in the opposite direction!">
      <canvas ref={canvasRef} width={540} height={180} style={{ width: "100%", borderRadius: 12, border: "1px solid #1e293b" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
        <div>
          <Ctrl label="Mass of Fragment 1 — Blue (kg)" min={1} max={20} value={m1} color="#4f46e5" onChange={setM1} />
          <Ctrl label="Mass of Fragment 2 — Red (kg)" min={1} max={20} value={m2} color="#dc2626" onChange={setM2} />
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <Btn onClick={explode} label="💥 EXPLODE!" active={phase === "moving"} color="#f59e0b" />
            <Btn onClick={reset} label="↺ Reset" color="#64748b" />
          </div>
        </div>
        <Row items={[
          { label: "v₁ after", value: `${Math.abs(v1_after).toFixed(1)} m/s ←`, color: "#818cf8" },
          { label: "v₂ after", value: `${v2_after.toFixed(1)} m/s →`, color: "#f87171" },
          { label: "p₁ + p₂", value: "0 kg·m/s", color: "#10b981" },
          { label: "Ratio v₁/v₂", value: `${(Math.abs(v1_after)/v2_after).toFixed(1)}×`, color: "#f59e0b" },
        ]} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════
 * T5-BONUS-2: CUE BALL MOMENTUM TRANSFER
 * Moving cue ball hits stationary target → momentum transferred
 * ══════════════════════════════════════════════════ */
export function Sim_cue_ball() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const state     = useRef({ xCue: 80, xTarget: 320, vCue: 0, vTarget: 0, phase: "ready" as string });
  const [mass, setMass]     = useState(0.17); /* kg, billiard ball */
  const [targetM, setTargetM] = useState(0.17);
  const [cuSpeed, setCuSpeed] = useState(5);
  const [phase, setPhase]   = useState("ready");

  /* Elastic collision: v1' = (m1-m2)/(m1+m2)*v1, v2' = 2m1/(m1+m2)*v1 */
  const v1p = ((mass - targetM) / (mass + targetM)) * cuSpeed;
  const v2p = (2 * mass / (mass + targetM)) * cuSpeed;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const s = state.current;

    ctx.fillStyle = "#064e3b"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#065f46"; ctx.fillRect(16, 16, W - 32, H - 32);

    /* Pool table border */
    ctx.strokeStyle = "#92400e"; ctx.lineWidth = 16;
    ctx.strokeRect(8, 8, W - 16, H - 16);

    /* Pockets */
    [[8, 8], [W / 2, 8], [W - 8, 8], [8, H - 8], [W / 2, H - 8], [W - 8, H - 8]].forEach(([px, py]) => {
      ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(px, py, 14, 0, Math.PI * 2); ctx.fill();
    });

    /* Cue ball */
    const cx = Math.min(Math.max(s.xCue, 30), W - 30);
    const grad = ctx.createRadialGradient(cx - 5, H / 2 - 6, 2, cx, H / 2, 18);
    grad.addColorStop(0, "#ffffff"); grad.addColorStop(1, "#d1d5db");
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(cx, H / 2, 18, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#6b7280"; ctx.font = "bold 9px Inter"; ctx.textAlign = "center";
    ctx.fillText("CUE", cx, H / 2 + 4);

    /* Target ball */
    const tx = Math.min(Math.max(s.xTarget, 30), W - 30);
    const tgrad = ctx.createRadialGradient(tx - 5, H / 2 - 6, 2, tx, H / 2, 18);
    tgrad.addColorStop(0, "#fbbf24"); tgrad.addColorStop(1, "#d97706");
    ctx.fillStyle = tgrad;
    ctx.beginPath(); ctx.arc(tx, H / 2, 18, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#451a03"; ctx.font = "bold 9px Inter"; ctx.textAlign = "center";
    ctx.fillText("1", tx, H / 2 + 4);

    /* Velocity labels */
    ctx.fillStyle = "#f1f5f9"; ctx.font = "bold 11px JetBrains Mono"; ctx.textAlign = "center";
    ctx.fillText(`v_cue = ${s.vCue.toFixed(1)} m/s`, cx, H / 2 - 30);
    ctx.fillText(`v_ball = ${s.vTarget.toFixed(1)} m/s`, tx, H / 2 - 30);

    /* Momentum conservation check */
    if (s.phase === "after") {
      const pBefore = (mass * cuSpeed).toFixed(3);
      const pAfter  = (mass * s.vCue + targetM * s.vTarget).toFixed(3);
      ctx.fillStyle = "#10b981"; ctx.font = "bold 11px JetBrains Mono"; ctx.textAlign = "center";
      ctx.fillText(`p_before = ${pBefore}  |  p_after = ${pAfter}  ✓ CONSERVED!`, W / 2, H - 22);
    }

    /* Physics */
    if (s.phase === "rolling") {
      s.xCue += s.vCue * 0.6;
      if (s.xCue >= s.xTarget - 36) {
        /* Collision! */
        s.vCue = v1p;
        s.vTarget = v2p;
        s.phase = "after";
        setPhase("after");
      }
      rafRef.current = requestAnimationFrame(draw);
    } else if (s.phase === "after") {
      s.xCue    += s.vCue    * 0.5;
      s.xTarget += s.vTarget * 0.5;
      if (s.xTarget > W - 30 || s.xCue < 30) { cancelAnimationFrame(rafRef.current); return; }
      rafRef.current = requestAnimationFrame(draw);
    }
  }, [mass, targetM, cuSpeed, v1p, v2p]);

  const shoot = () => {
    state.current = { xCue: 80, xTarget: 300, vCue: cuSpeed, vTarget: 0, phase: "rolling" };
    setPhase("rolling");
    rafRef.current = requestAnimationFrame(draw);
  };
  const reset = () => {
    cancelAnimationFrame(rafRef.current);
    state.current = { xCue: 80, xTarget: 300, vCue: 0, vTarget: 0, phase: "ready" };
    setPhase("ready");
    requestAnimationFrame(draw);
  };

  useEffect(() => { requestAnimationFrame(draw); return () => cancelAnimationFrame(rafRef.current); }, [draw]);

  return (
    <Card title="🎱 Cue Ball — Momentum Transfer in Elastic Collision" desc="A moving cue ball hits a stationary ball. By conservation of momentum: p_before = m₁u. p_after = m₁v₁ + m₂v₂. For equal masses: cue ball STOPS, target takes all the velocity! Change masses to see different results.">
      <canvas ref={canvasRef} width={540} height={160} style={{ width: "100%", borderRadius: 12 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
        <div>
          <Ctrl label="Cue Ball Speed (m/s)" min={1} max={10} value={cuSpeed} color="#f1f5f9" onChange={setCuSpeed} />
          <Ctrl label="Cue Mass (×0.01 kg)" min={5} max={50} value={Math.round(mass * 100)} color="#94a3b8" onChange={v => setMass(v / 100)} />
          <Ctrl label="Target Mass (×0.01 kg)" min={5} max={50} value={Math.round(targetM * 100)} color="#f59e0b" onChange={v => setTargetM(v / 100)} />
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <Btn onClick={shoot} label="🎱 SHOOT!" active={phase === "rolling"} color="#10b981" />
            <Btn onClick={reset} label="↺ Reset" color="#64748b" />
          </div>
        </div>
        <Row items={[
          { label: "p before", value: `${(mass * cuSpeed).toFixed(2)} kg·m/s`, color: "#94a3b8" },
          { label: "v_cue after", value: `${v1p.toFixed(2)} m/s`, color: "#f1f5f9" },
          { label: "v_ball after", value: `${v2p.toFixed(2)} m/s`, color: "#f59e0b" },
          { label: "Conserved?", value: "YES ✓", color: "#10b981" },
        ]} />
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════
 * T5-BONUS-3: ROCKET ENGINE — CONTINUOUS MOMENTUM
 * Rocket burns fuel → increasing acceleration as mass decreases
 * ══════════════════════════════════════════════════ */
export function Sim_fuel_burn() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const state     = useRef({ y: 380, vy: 0, mass: 1000, fuel: 500, running: false, t: 0 });
  const [exhaustV, setExhaustV] = useState(300);
  const [burnRate, setBurnRate] = useState(5);
  const [running, setRunning]   = useState(false);
  const [display, setDisplay]   = useState({ h: 0, v: 0, a: 0, fuel: 500, mass: 1000 });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const s = state.current;

    /* Space background gradient */
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#020617");
    bg.addColorStop(1, "#0c4a6e");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    /* Stars */
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    [[30,20],[80,50],[150,30],[220,70],[300,20],[380,45],[450,25],[510,60]].forEach(([sx, sy]) => {
      ctx.beginPath(); ctx.arc(sx, sy, 1.5, 0, Math.PI * 2); ctx.fill();
    });

    /* Earth (partial) */
    const earthR = 80;
    ctx.fillStyle = "#1d4ed8";
    ctx.beginPath(); ctx.arc(W / 2, H + 40, earthR, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#065f46";
    ctx.beginPath(); ctx.arc(W / 2 - 15, H + 25, 28, 0, Math.PI * 2); ctx.fill();

    /* Rocket */
    const ry = s.y;
    const rx = W / 2;

    /* Exhaust flame */
    if (s.running && s.fuel > 0) {
      const flameH = 30 + Math.random() * 20;
      const flameGrad = ctx.createLinearGradient(rx, ry + 30, rx, ry + 30 + flameH);
      flameGrad.addColorStop(0, "#f59e0b");
      flameGrad.addColorStop(0.5, "#ef4444");
      flameGrad.addColorStop(1, "transparent");
      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.moveTo(rx - 10, ry + 28);
      ctx.lineTo(rx, ry + 28 + flameH);
      ctx.lineTo(rx + 10, ry + 28);
      ctx.closePath(); ctx.fill();
    }

    /* Rocket body */
    ctx.fillStyle = "#c0c0c0";
    ctx.beginPath();
    ctx.moveTo(rx, ry - 40);
    ctx.lineTo(rx - 16, ry + 20);
    ctx.lineTo(rx + 16, ry + 20);
    ctx.closePath(); ctx.fill();

    /* Windows */
    ctx.fillStyle = "#60a5fa"; ctx.beginPath(); ctx.arc(rx, ry - 10, 7, 0, Math.PI * 2); ctx.fill();

    /* Fins */
    ctx.fillStyle = "#334155";
    ctx.beginPath(); ctx.moveTo(rx - 16, ry + 10); ctx.lineTo(rx - 32, ry + 30); ctx.lineTo(rx - 16, ry + 28); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(rx + 16, ry + 10); ctx.lineTo(rx + 32, ry + 30); ctx.lineTo(rx + 16, ry + 28); ctx.closePath(); ctx.fill();

    /* Fuel tank visual */
    const fuelPct = s.fuel / 500;
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(rx + 45, ry - 20, 12, 50);
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(rx + 45, ry - 20 + (1 - fuelPct) * 50, 12, fuelPct * 50);
    ctx.fillStyle = "#64748b"; ctx.font = "9px Inter"; ctx.textAlign = "center";
    ctx.fillText("FUEL", rx + 51, ry + 40);

    /* Height bar */
    const maxH = 380;
    const hPct = Math.min(1 - s.y / maxH, 1);
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(16, 20, 8, H - 60);
    ctx.fillStyle = "#10b981";
    ctx.fillRect(16, 20 + (1 - hPct) * (H - 60), 8, hPct * (H - 60));
    ctx.fillStyle = "#10b981"; ctx.font = "10px JetBrains Mono"; ctx.textAlign = "left";
    ctx.fillText(`h=${(380 - s.y).toFixed(0)}`, 28, ry);

    /* Physics */
    if (s.running && s.fuel > 0) {
      const dt = 0.016;
      const thrust = exhaustV * burnRate;
      const a = thrust / s.mass - 9.8;
      s.vy -= a * dt * 30;
      s.y  += s.vy;
      s.fuel = Math.max(0, s.fuel - burnRate * dt * 5);
      s.mass = 500 + s.fuel;
      s.t   += dt;

      setDisplay({ h: 380 - s.y, v: -s.vy / 30, a, fuel: s.fuel, mass: s.mass });

      if (s.y < 20 || s.fuel <= 0) {
        s.running = false; setRunning(false);
        cancelAnimationFrame(rafRef.current);
        return;
      }
      rafRef.current = requestAnimationFrame(draw);
    }
  }, [exhaustV, burnRate]);

  const launch = () => {
    state.current = { y: 380, vy: 0, mass: 1000, fuel: 500, running: true, t: 0 };
    setDisplay({ h: 0, v: 0, a: 0, fuel: 500, mass: 1000 });
    setRunning(true);
    rafRef.current = requestAnimationFrame(draw);
  };
  const reset  = () => {
    cancelAnimationFrame(rafRef.current);
    state.current = { y: 380, vy: 0, mass: 1000, fuel: 500, running: false, t: 0 };
    setDisplay({ h: 0, v: 0, a: 0, fuel: 500, mass: 1000 });
    setRunning(false);
    requestAnimationFrame(draw);
  };

  useEffect(() => { requestAnimationFrame(draw); return () => cancelAnimationFrame(rafRef.current); }, [draw]);

  return (
    <Card title="🚀 Rocket Engine — Tsiolkovsky Rocket Equation" desc="A rocket burns fuel: expelled gas carries momentum BACKWARD. By conservation of momentum, rocket gains momentum FORWARD. As fuel burns → rocket mass DECREASES → same thrust → GREATER acceleration! This is why rockets accelerate faster as they go.">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <canvas ref={canvasRef} width={300} height={400} style={{ width: "100%", borderRadius: 12, border: "1px solid #1e293b" }} />
        <div>
          <Ctrl label="Exhaust Velocity (m/s)" min={50} max={500} value={exhaustV} color="#f59e0b" onChange={setExhaustV} />
          <Ctrl label="Burn Rate (kg/s)" min={1} max={20} value={burnRate} color="#ef4444" onChange={setBurnRate} />
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <Btn onClick={launch} label="🚀 LAUNCH!" active={running} color="#10b981" />
            <Btn onClick={reset} label="↺ Reset" color="#64748b" />
          </div>
          <div style={{ marginTop: 14 }}>
            <Row items={[
              { label: "Altitude", value: `${display.h.toFixed(0)} m`, color: "#10b981" },
              { label: "Speed", value: `${Math.abs(display.v).toFixed(1)} m/s`, color: "#22d3ee" },
              { label: "Acceleration", value: `${display.a.toFixed(1)} m/s²`, color: "#f59e0b" },
              { label: "Fuel Left", value: `${display.fuel.toFixed(0)} kg`, color: "#f87171" },
            ]} />
          </div>
          <div style={{ marginTop: 10, padding: "10px 14px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" }}>
            <div style={{ fontSize: 11, color: "#475569", marginBottom: 6, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Tsiolkovsky Equation</div>
            <div style={{ color: "#22d3ee", fontFamily: "JetBrains Mono, monospace", fontSize: 13 }}>Δv = v_e × ln(m₀/m_f)</div>
            <div style={{ color: "#475569", fontSize: 11, marginTop: 4 }}>More exhaust speed & fuel → Higher Δv</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
