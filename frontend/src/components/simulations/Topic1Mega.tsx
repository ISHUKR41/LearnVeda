/**
 * FILE: Topic1Mega.tsx
 * PURPOSE: 15 professional animated physics simulations for Topic 1 —
 *          Balanced & Unbalanced Forces (Class 9 CBSE syllabus).
 *          All simulations are canvas-based with real physics logic.
 */
"use client";
import { useEffect, useRef, useState } from "react";

const BG = "#0a1628";
const BLUE = "#3B82F6";
const RED = "#EF4444";
const GREEN = "#10B981";
const AMBER = "#F59E0B";
const PURPLE = "#8B5CF6";
const WHITE = "#E2E8F0";
const GRAY = "#475569";

function arrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, label = "", width = 2.5) {
  if (Math.abs(x2 - x1) < 1 && Math.abs(y2 - y1) < 1) return;
  ctx.save();
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  const a = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath(); ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 10 * Math.cos(a - 0.4), y2 - 10 * Math.sin(a - 0.4));
  ctx.lineTo(x2 - 10 * Math.cos(a + 0.4), y2 - 10 * Math.sin(a + 0.4));
  ctx.closePath(); ctx.fill();
  if (label) { ctx.font = "bold 12px Inter,sans-serif"; ctx.fillText(label, x2 + 6, y2 + 4); }
  ctx.restore();
}

function label(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color = WHITE, size = 12) {
  ctx.save(); ctx.font = `${size}px Inter,sans-serif`; ctx.fillStyle = color; ctx.fillText(text, x, y); ctx.restore();
}

/* ─── 1. Spring Scale Force Demo ──────────────────────── */
export function Sim_spring_scale_force() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [mass, setMass] = useState(3);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
    const g = 9.8; const F = mass * g;
    const cx = c.width / 2;
    /* spring hook */
    ctx.strokeStyle = GRAY; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, 20); ctx.lineTo(cx, 50); ctx.stroke();
    /* spring coils */
    const coilH = 12 + mass * 6; const coilY = 50;
    ctx.strokeStyle = "#60A5FA"; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(cx, coilY);
    for (let i = 0; i <= coilH; i++) {
      const y = coilY + i * 5;
      const x = cx + Math.sin(i * Math.PI) * 14;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    const springEnd = coilY + coilH * 5;
    /* scale housing */
    ctx.fillStyle = "#1E3A5F"; ctx.strokeStyle = "#3B82F6"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(cx - 28, 50, 56, coilH * 5 - 10, 6); ctx.fill(); ctx.stroke();
    /* scale markings */
    for (let i = 0; i <= 10; i++) {
      const yy = 55 + i * (coilH * 5 - 20) / 10;
      ctx.strokeStyle = i % 2 === 0 ? "#60A5FA" : GRAY; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx + 18, yy); ctx.lineTo(cx + 25, yy); ctx.stroke();
      if (i % 2 === 0) label(ctx, `${i * 5}N`, cx + 27, yy + 4, WHITE, 10);
    }
    /* needle */
    const needleY = 55 + (F / 50) * (coilH * 5 - 20);
    ctx.strokeStyle = RED; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx - 18, needleY); ctx.lineTo(cx + 17, needleY); ctx.stroke();
    /* weight block */
    ctx.fillStyle = "#1E40AF"; ctx.strokeStyle = BLUE; ctx.lineWidth = 2;
    ctx.fillRect(cx - 25, springEnd, 50, 40);
    ctx.strokeRect(cx - 25, springEnd, 50, 40);
    label(ctx, `${mass} kg`, cx - 18, springEnd + 26, WHITE, 13);
    /* force arrows */
    arrow(ctx, cx, springEnd + 40, cx, springEnd + 80, RED, `W=${F.toFixed(1)}N`);
    arrow(ctx, cx, springEnd, cx, springEnd - 30, GREEN, `T=${F.toFixed(1)}N`);
    label(ctx, "Spring Scale — Force = Weight", 10, c.height - 10, GRAY, 11);
  }, [mass]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={340} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Mass: {mass} kg<input type="range" min={1} max={10} value={mass} onChange={e => setMass(+e.target.value)} /></label>
        <span style={{ color: AMBER }}>Reading: {(mass * 9.8).toFixed(1)} N</span>
      </div>
    </div>
  );
}

/* ─── 2. Rope Tug — Net Force Visualization ────────────── */
export function Sim_rope_tug_forces() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [leftF, setLeftF] = useState(30);
  const [rightF, setRightF] = useState(30);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
    const cx = c.width / 2; const cy = c.height / 2;
    const net = rightF - leftF;
    /* rope */
    ctx.strokeStyle = "#D97706"; ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(cx - 160, cy); ctx.lineTo(cx + 160, cy); ctx.stroke();
    /* center knot */
    ctx.fillStyle = net === 0 ? GREEN : RED;
    ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2); ctx.fill();
    /* force arrows */
    arrow(ctx, cx - 30, cy, cx - 30 - leftF * 2.5, cy, BLUE, `${leftF}N`, 3);
    arrow(ctx, cx + 30, cy, cx + 30 + rightF * 2.5, cy, RED, `${rightF}N`, 3);
    /* state label */
    const state = Math.abs(net) < 1 ? "BALANCED ✓" : `UNBALANCED — Net: ${Math.abs(net).toFixed(0)}N ${net > 0 ? "→" : "←"}`;
    label(ctx, state, cx - 100, cy - 30, net === 0 ? GREEN : RED, 15);
    /* net arrow */
    if (Math.abs(net) > 1) {
      arrow(ctx, cx, cy + 50, cx + net * 2, cy + 50, PURPLE, `Net ${Math.abs(net).toFixed(0)}N`, 3);
    }
    label(ctx, "Rope Tug — Balanced vs Unbalanced Forces", 10, c.height - 10, GRAY, 11);
  }, [leftF, rightF]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={220} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Left Force: {leftF}N<input type="range" min={5} max={60} value={leftF} onChange={e => setLeftF(+e.target.value)} /></label>
        <label>Right Force: {rightF}N<input type="range" min={5} max={60} value={rightF} onChange={e => setRightF(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 3. Boat Buoyancy Balance ──────────────────────── */
export function Sim_boat_buoyancy_balance() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [cargo, setCargo] = useState(3);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
    const cx = c.width / 2; const waterY = 190;
    const boatMass = 5; const totalMass = boatMass + cargo;
    const maxFloat = 8; const sinks = totalMass > maxFloat;
    /* water */
    ctx.fillStyle = "rgba(59,130,246,0.18)";
    ctx.fillRect(0, waterY, c.width, c.height - waterY);
    ctx.strokeStyle = "rgba(147,197,253,0.4)"; ctx.lineWidth = 1.5;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath(); ctx.moveTo(20 + i * 110, waterY + 8); ctx.bezierCurveTo(50 + i * 110, waterY + 2, 70 + i * 110, waterY + 14, 100 + i * 110, waterY + 8); ctx.stroke();
    }
    const sinkDepth = sinks ? 60 : (totalMass / maxFloat) * 30;
    const boatY = waterY - 40 + sinkDepth;
    /* boat hull */
    ctx.fillStyle = sinks ? "#7F1D1D" : "#1E40AF";
    ctx.strokeStyle = sinks ? RED : BLUE; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 70, boatY); ctx.lineTo(cx + 70, boatY);
    ctx.lineTo(cx + 55, boatY + 35); ctx.lineTo(cx - 55, boatY + 35);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    /* cargo blocks */
    for (let i = 0; i < Math.min(cargo, 8); i++) {
      ctx.fillStyle = "#D97706"; ctx.fillRect(cx - 50 + i * 14, boatY - 20, 12, 18);
    }
    /* force arrows */
    if (!sinks) {
      const F = totalMass * 9.8;
      arrow(ctx, cx, boatY - 5, cx, boatY - 5 - 40, GREEN, `Buoy=${F.toFixed(0)}N`);
      arrow(ctx, cx, boatY + 35, cx, boatY + 75, AMBER, `W=${F.toFixed(0)}N`);
    }
    const status = sinks ? "SINKS! — Weight > Buoyancy" : "FLOATING — Buoyancy = Weight";
    label(ctx, status, cx - 120, 30, sinks ? RED : GREEN, 14);
    label(ctx, `Boat: 5kg | Cargo: ${cargo}kg | Total: ${totalMass}kg`, cx - 120, 55, WHITE, 12);
    label(ctx, "Boat Buoyancy — Balanced Floating Force", 10, c.height - 10, GRAY, 11);
  }, [cargo]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={280} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Cargo: {cargo} units<input type="range" min={0} max={10} value={cargo} onChange={e => setCargo(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 4. Seesaw Balance ──────────────────────────── */
export function Sim_seesaw_balance_demo() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [m1, setM1] = useState(40);
  const [m2, setM2] = useState(40);
  const [d1, setD1] = useState(2);
  const rafRef = useRef(0);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    let angle = 0; let angVel = 0;
    const torqueL = m1 * d1; const torqueR = m2 * 2;
    const net = torqueR - torqueL;
    const target = Math.max(-0.35, Math.min(0.35, net * 0.004));
    function draw() {
      angle += (target - angle) * 0.06;
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      const cx = c.width / 2; const cy = 200;
      /* pivot */
      ctx.fillStyle = "#4B5563";
      ctx.beginPath(); ctx.moveTo(cx - 15, cy + 10); ctx.lineTo(cx + 15, cy + 10); ctx.lineTo(cx, cy); ctx.closePath(); ctx.fill();
      /* plank */
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(angle);
      ctx.fillStyle = "#92400E"; ctx.strokeStyle = "#D97706"; ctx.lineWidth = 2;
      ctx.fillRect(-200, -8, 400, 16); ctx.strokeRect(-200, -8, 400, 16);
      /* m1 (left) */
      const lx = -d1 * 60, rx = 120;
      ctx.fillStyle = "#1E40AF"; ctx.strokeStyle = BLUE; ctx.lineWidth = 1.5;
      const bh1 = Math.min(60, m1 * 0.8);
      ctx.fillRect(lx - 20, -8 - bh1, 40, bh1); ctx.strokeRect(lx - 20, -8 - bh1, 40, bh1);
      ctx.fillStyle = WHITE; ctx.font = "bold 11px Inter,sans-serif"; ctx.textAlign = "center";
      ctx.fillText(`${m1}kg`, lx, -8 - bh1 / 2 + 4);
      /* m2 (right) */
      ctx.fillStyle = "#7F1D1D"; ctx.strokeStyle = RED; ctx.lineWidth = 1.5;
      const bh2 = Math.min(60, m2 * 0.8);
      ctx.fillRect(rx - 20, -8 - bh2, 40, bh2); ctx.strokeRect(rx - 20, -8 - bh2, 40, bh2);
      ctx.fillStyle = WHITE;
      ctx.fillText(`${m2}kg`, rx, -8 - bh2 / 2 + 4);
      ctx.restore();
      ctx.textAlign = "left";
      const bal = Math.abs(net) < 2;
      label(ctx, bal ? "BALANCED ✓ (τL = τR)" : `UNBALANCED — τL=${torqueL}, τR=${torqueR}`, cx - 120, 30, bal ? GREEN : RED, 13);
      label(ctx, `Left torque: ${m1}×${d1}=${torqueL} N·m | Right torque: ${m2}×2=${torqueR} N·m`, cx - 170, 52, WHITE, 11);
    }
    function loop() { draw(); rafRef.current = requestAnimationFrame(loop); }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [m1, m2, d1]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={260} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Left mass: {m1}kg<input type="range" min={10} max={80} value={m1} onChange={e => setM1(+e.target.value)} /></label>
        <label>Left pos (d): {d1}m<input type="range" min={1} max={3} step={0.5} value={d1} onChange={e => setD1(+e.target.value)} /></label>
        <label>Right mass: {m2}kg<input type="range" min={10} max={80} value={m2} onChange={e => setM2(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 5. Kite Force Diagram ──────────────────────── */
export function Sim_kite_force_diagram() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [wind, setWind] = useState(25);
  const [string, setStringAngle] = useState(45);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
    const cx = 300; const cy = 140;
    const g = 20; /* gravity force */
    const tx = -wind * Math.cos((string * Math.PI) / 180);
    const ty = wind * Math.sin((string * Math.PI) / 180);
    const netX = wind + tx; const netY = -g + ty;
    /* sky gradient */
    const grad = ctx.createLinearGradient(0, 0, 0, c.height);
    grad.addColorStop(0, "#0c1a3a"); grad.addColorStop(1, "#1a3a5c");
    ctx.fillStyle = grad; ctx.fillRect(0, 0, c.width, c.height);
    /* kite body */
    ctx.save(); ctx.translate(cx, cy);
    ctx.fillStyle = "#EF4444"; ctx.strokeStyle = "#FCA5A5"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, -30); ctx.lineTo(22, 0); ctx.lineTo(0, 25); ctx.lineTo(-22, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = "#FCA5A5"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, -30); ctx.lineTo(0, 25); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-22, 0); ctx.lineTo(22, 0); ctx.stroke();
    ctx.restore();
    /* force arrows */
    arrow(ctx, cx, cy, cx, cy + g * 2.5, AMBER, `W=${g}N`);
    arrow(ctx, cx, cy, cx + wind * 2, cy, BLUE, `Wind=${wind}N`);
    const ta = (string * Math.PI) / 180;
    arrow(ctx, cx, cy, cx + tx * 2, cy - ty * 2, GREEN, `T`);
    const balanced = Math.abs(netX) < 3 && Math.abs(netY) < 3;
    if (!balanced) {
      arrow(ctx, cx, cy + 80, cx + netX * 2, cy + 80 - netY * 2, PURPLE, "Net", 2);
    }
    label(ctx, balanced ? "KITE IN EQUILIBRIUM ✓" : "Forces unbalanced — kite drifts", 10, 25, balanced ? GREEN : RED, 13);
    label(ctx, "Kite Forces: Wind (push) + String Tension + Gravity", 10, c.height - 10, GRAY, 11);
    /* string to ground */
    const sa = (string * Math.PI) / 180;
    ctx.strokeStyle = "#D4D4D8"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - 150 * Math.cos(sa), cy + 150 * Math.sin(sa)); ctx.stroke();
    ctx.setLineDash([]);
  }, [wind, string]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={280} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Wind force: {wind}N<input type="range" min={5} max={50} value={wind} onChange={e => setWind(+e.target.value)} /></label>
        <label>String angle: {string}°<input type="range" min={20} max={70} value={string} onChange={e => setStringAngle(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 6. Block on Frictionless Ice ──────────────────── */
export function Sim_block_ice_slide() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [force, setForce] = useState(20);
  const [friction, setFriction] = useState(0);
  const posRef = useRef(0); const velRef = useRef(0);
  const rafRef = useRef(0); const tRef = useRef(0);
  useEffect(() => {
    posRef.current = 0; velRef.current = 0; tRef.current = 0;
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const mass = 5; const maxX = c.width - 80;
    function loop() {
      const dt = 0.016;
      const net = force - friction * mass * 9.8;
      const a = net / mass;
      velRef.current += a * dt; posRef.current += velRef.current * dt * 30;
      if (posRef.current > maxX - 60) { posRef.current = 0; velRef.current = 0; }
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      /* surface */
      ctx.fillStyle = friction < 0.05 ? "rgba(147,210,255,0.25)" : "rgba(180,140,90,0.25)";
      ctx.fillRect(0, 220, c.width, 60);
      ctx.strokeStyle = friction < 0.05 ? "#93C5FD" : "#D97706"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, 220); ctx.lineTo(c.width, 220); ctx.stroke();
      const sx = label(ctx, friction < 0.05 ? "ICE (μ≈0)" : `ROUGH (μ=${friction.toFixed(1)})`, 10, 215, friction < 0.05 ? "#93C5FD" : "#D97706", 11);
      const bx = 30 + posRef.current;
      /* block */
      ctx.fillStyle = "#1E3A5F"; ctx.strokeStyle = BLUE; ctx.lineWidth = 2;
      ctx.fillRect(bx, 180, 60, 40); ctx.strokeRect(bx, 180, 60, 40);
      label(ctx, "5 kg", bx + 8, 205, WHITE, 12);
      /* arrows */
      arrow(ctx, bx + 30, 200, bx + 30, 165, GREEN, `N=${(mass * 9.8).toFixed(0)}N`);
      arrow(ctx, bx + 30, 220, bx + 30, 255, AMBER, `W=${(mass * 9.8).toFixed(0)}N`);
      if (force > 0) arrow(ctx, bx + 60, 200, bx + 60 + Math.min(force * 2, 80), 200, BLUE, `F=${force}N`);
      if (friction > 0.01) arrow(ctx, bx, 200, bx - friction * mass * 9.8 * 0.8, 200, RED, `f=${(friction * mass * 9.8).toFixed(1)}N`);
      const netF = force - friction * mass * 9.8;
      label(ctx, `a = F_net/m = ${netF.toFixed(1)}/${mass} = ${(netF / mass).toFixed(2)} m/s²`, 10, 40, WHITE, 13);
      label(ctx, `v = ${velRef.current.toFixed(2)} m/s`, 10, 60, AMBER, 13);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [force, friction]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={290} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Applied force: {force}N<input type="range" min={0} max={60} value={force} onChange={e => setForce(+e.target.value)} /></label>
        <label>Friction (μ): {friction.toFixed(1)}<input type="range" min={0} max={0.8} step={0.1} value={friction} onChange={e => setFriction(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 7. Magnetic Force Distance Demo ────────────── */
export function Sim_magnetic_force_distance() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [dist, setDist] = useState(80);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
    const F = 5000 / (dist * dist);
    const cx = c.width / 2; const cy = 160;
    const left = cx - dist / 2; const right = cx + dist / 2;
    /* field lines */
    ctx.strokeStyle = "rgba(99,102,241,0.3)"; ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const yy = cy - 40 + i * 20;
      ctx.beginPath(); ctx.moveTo(left + 25, yy); ctx.bezierCurveTo(cx, yy - 15, cx, yy - 15, right - 25, yy); ctx.stroke();
    }
    /* magnets */
    [left, right].forEach((x, i) => {
      ctx.fillStyle = i === 0 ? "#DC2626" : "#2563EB";
      ctx.strokeStyle = i === 0 ? "#FCA5A5" : "#93C5FD"; ctx.lineWidth = 2;
      ctx.fillRect(x - 25, cy - 30, 50, 60); ctx.strokeRect(x - 25, cy - 30, 50, 60);
      ctx.fillStyle = WHITE; ctx.font = "bold 16px Inter,sans-serif"; ctx.textAlign = "center";
      ctx.fillText(i === 0 ? "N" : "S", x, cy + 6);
    });
    ctx.textAlign = "left";
    /* force arrows */
    const arrowLen = Math.min(F * 12, 90);
    arrow(ctx, left, cy, left - arrowLen, cy, RED, `${F.toFixed(1)}N`, 3);
    arrow(ctx, right, cy, right + arrowLen, cy, BLUE, `${F.toFixed(1)}N`, 3);
    /* distance line */
    ctx.strokeStyle = GRAY; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(left + 25, cy + 50); ctx.lineTo(right - 25, cy + 50); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = WHITE; ctx.font = "12px Inter,sans-serif"; ctx.textAlign = "center";
    ctx.fillText(`${(dist / 50).toFixed(1)} m`, cx, cy + 65);
    label(ctx, `F = k/r² = ${F.toFixed(2)} N  (increases as magnets get closer)`, 20, 30, WHITE, 13);
    label(ctx, "Magnetic Force — Inverse Square Law", 10, c.height - 10, GRAY, 11);
  }, [dist]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={260} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Distance: {(dist / 50).toFixed(1)}m<input type="range" min={30} max={200} value={dist} onChange={e => setDist(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 8. Terminal Velocity Fall ───────────────────── */
export function Sim_terminal_velocity_fall() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [area, setArea] = useState(1);
  const posRef = useRef(20); const velRef = useRef(0);
  const rafRef = useRef(0);
  useEffect(() => {
    posRef.current = 20; velRef.current = 0;
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const mass = 5; const g = 9.8; const Cd = 0.8; const rho = 1.2;
    function loop() {
      const v = velRef.current;
      const drag = 0.5 * rho * Cd * area * v * v;
      const net = mass * g - drag;
      velRef.current += (net / mass) * 0.02;
      posRef.current += velRef.current * 0.5;
      if (posRef.current > c.height - 60) { posRef.current = 20; velRef.current = 0; }
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      const vt = Math.sqrt((2 * mass * g) / (rho * Cd * area));
      const progress = Math.min(velRef.current / vt, 1);
      /* velocity gauge */
      ctx.fillStyle = "#0F172A"; ctx.fillRect(500, 30, 60, 200);
      ctx.fillStyle = progress >= 0.95 ? GREEN : BLUE;
      ctx.fillRect(500, 30 + 200 * (1 - progress), 60, 200 * progress);
      ctx.strokeStyle = GRAY; ctx.lineWidth = 1; ctx.strokeRect(500, 30, 60, 200);
      label(ctx, "v", 520, 248, WHITE, 13);
      const cx = 200; const by = posRef.current;
      /* object */
      ctx.fillStyle = "#1E40AF"; ctx.strokeStyle = BLUE; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, by, 20, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      /* drag force arrows (opposing motion) */
      const dragVis = Math.min(drag * 2.5, 100);
      const gravVis = 50;
      arrow(ctx, cx, by, cx, by - dragVis, RED, `Drag=${drag.toFixed(1)}N`);
      arrow(ctx, cx, by, cx, by + gravVis, AMBER, `W=${(mass * g).toFixed(0)}N`);
      /* terminal velocity line */
      ctx.strokeStyle = GREEN; ctx.lineWidth = 1; ctx.setLineDash([5, 3]);
      ctx.beginPath(); ctx.moveTo(0, posRef.current); ctx.lineTo(c.width - 80, posRef.current); ctx.stroke();
      ctx.setLineDash([]);
      label(ctx, `v = ${velRef.current.toFixed(1)} m/s`, 10, 40, WHITE, 14);
      label(ctx, `Terminal v = ${vt.toFixed(1)} m/s`, 10, 60, GREEN, 12);
      label(ctx, `Net force = ${(mass * g - drag).toFixed(1)} N`, 10, 80, progress >= 0.95 ? GREEN : AMBER, 12);
      if (progress >= 0.95) label(ctx, "TERMINAL VELOCITY! ✓ Forces BALANCED", 10, 100, GREEN, 13);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [area]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={340} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Object area (m²): {area.toFixed(1)}<input type="range" min={0.2} max={4} step={0.2} value={area} onChange={e => setArea(+e.target.value)} /></label>
        <span style={{ color: GREEN }}>When drag = weight → terminal velocity (BALANCED)</span>
      </div>
    </div>
  );
}

/* ─── 9. Pulley Unequal Weights ───────────────────── */
export function Sim_pulley_unequal() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [m1, setM1] = useState(3);
  const [m2, setM2] = useState(5);
  const pos1Ref = useRef(80); const velRef = useRef(0);
  const rafRef = useRef(0);
  useEffect(() => {
    pos1Ref.current = 80; velRef.current = 0;
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const g = 9.8;
    function loop() {
      const a = ((m2 - m1) * g) / (m1 + m2);
      velRef.current += a * 0.012;
      velRef.current *= 0.995;
      pos1Ref.current += velRef.current * 0.5;
      if (pos1Ref.current < 30 || pos1Ref.current > 260) velRef.current *= -0.5;
      pos1Ref.current = Math.max(30, Math.min(260, pos1Ref.current));
      const pos2 = 310 - pos1Ref.current;
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      /* pulley */
      ctx.fillStyle = "#4B5563"; ctx.strokeStyle = GRAY; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(290, 40, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#6B7280"; ctx.beginPath(); ctx.arc(290, 40, 8, 0, Math.PI * 2); ctx.fill();
      /* ropes */
      ctx.strokeStyle = "#D4D4D8"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(270, 40); ctx.lineTo(200, pos1Ref.current); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(310, 40); ctx.lineTo(380, pos2); ctx.stroke();
      /* masses */
      const bh1 = m1 * 10, bh2 = m2 * 10;
      ctx.fillStyle = "#1E40AF"; ctx.strokeStyle = BLUE; ctx.lineWidth = 2;
      ctx.fillRect(175, pos1Ref.current, 50, bh1); ctx.strokeRect(175, pos1Ref.current, 50, bh1);
      label(ctx, `${m1}kg`, 183, pos1Ref.current + bh1 / 2 + 4, WHITE, 12);
      ctx.fillStyle = "#7F1D1D"; ctx.strokeStyle = RED; ctx.lineWidth = 2;
      ctx.fillRect(355, pos2, 50, bh2); ctx.strokeRect(355, pos2, 50, bh2);
      label(ctx, `${m2}kg`, 363, pos2 + bh2 / 2 + 4, WHITE, 12);
      /* arrows */
      arrow(ctx, 200, pos1Ref.current, 200, pos1Ref.current - 30, GREEN, `T`);
      arrow(ctx, 380, pos2, 380, pos2 - 30, GREEN, `T`);
      const acc = ((m2 - m1) * g) / (m1 + m2);
      const T = m1 * (g + acc);
      label(ctx, `a = (m₂−m₁)g/(m₁+m₂) = ${acc.toFixed(2)} m/s²`, 10, 25, acc > 0.1 ? AMBER : GREEN, 12);
      label(ctx, `Tension T = ${T.toFixed(1)} N`, 10, 45, WHITE, 12);
      label(ctx, acc < 0.1 ? "BALANCED ✓" : m2 > m1 ? "m₂ heavier → goes DOWN" : "m₁ heavier → goes DOWN", 10, 65, acc < 0.1 ? GREEN : AMBER, 12);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [m1, m2]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={310} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Left mass: {m1}kg<input type="range" min={1} max={10} value={m1} onChange={e => setM1(+e.target.value)} /></label>
        <label>Right mass: {m2}kg<input type="range" min={1} max={10} value={m2} onChange={e => setM2(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 10. Book on Table — Normal Force ───────────── */
export function Sim_book_table_normal() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [mass, setMass] = useState(2);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
    const cx = c.width / 2; const tableY = 210;
    const W = mass * 9.8;
    /* table */
    ctx.fillStyle = "#78350F"; ctx.strokeStyle = "#D97706"; ctx.lineWidth = 2;
    ctx.fillRect(cx - 120, tableY, 240, 20); ctx.strokeRect(cx - 120, tableY, 240, 20);
    ctx.fillRect(cx - 115, tableY + 20, 10, 80); ctx.fillRect(cx + 105, tableY + 20, 10, 80);
    /* books */
    const bh = 10 + mass * 8;
    ctx.fillStyle = "#1E40AF"; ctx.strokeStyle = BLUE; ctx.lineWidth = 2;
    ctx.fillRect(cx - 40, tableY - bh, 80, bh); ctx.strokeRect(cx - 40, tableY - bh, 80, bh);
    /* book pages */
    ctx.strokeStyle = "#93C5FD"; ctx.lineWidth = 0.5;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath(); ctx.moveTo(cx - 38, tableY - bh + 4 + i * (bh - 8) / 5); ctx.lineTo(cx + 38, tableY - bh + 4 + i * (bh - 8) / 5); ctx.stroke();
    }
    label(ctx, `${mass}kg`, cx - 18, tableY - bh / 2 + 5, WHITE, 12);
    /* force arrows */
    arrow(ctx, cx, tableY - bh, cx, tableY - bh - W * 3.5, GREEN, `N=${W.toFixed(1)}N`, 3);
    arrow(ctx, cx, tableY, cx, tableY + W * 3.5, AMBER, `W=${W.toFixed(1)}N`, 3);
    /* deformation exaggerated */
    ctx.strokeStyle = "rgba(59,130,246,0.3)"; ctx.lineWidth = 1.5;
    const sag = mass * 0.5;
    ctx.beginPath(); ctx.moveTo(cx - 120, tableY);
    ctx.bezierCurveTo(cx - 60, tableY + sag, cx + 60, tableY + sag, cx + 120, tableY); ctx.stroke();
    label(ctx, "Exaggerated table sag →", cx - 60, tableY + sag + 15, GRAY, 10);
    label(ctx, `Book presses table with W = ${W.toFixed(1)} N`, 10, 30, WHITE, 13);
    label(ctx, `Table pushes book UP with N = ${W.toFixed(1)} N (Newton's 3rd Law)`, 10, 50, GREEN, 12);
    label(ctx, `Forces BALANCED → no acceleration`, 10, 70, GREEN, 12);
  }, [mass]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={330} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Book mass: {mass}kg<input type="range" min={1} max={8} value={mass} onChange={e => setMass(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 11. Archimedes Float/Sink ──────────────────── */
export function Sim_archimedes_float_sink() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [density, setDensity] = useState(600);
  const rafRef = useRef(0); const posRef = useRef(100); const velRef = useRef(0);
  useEffect(() => {
    posRef.current = 100; velRef.current = 0;
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const waterDensity = 1000; const vol = 0.001; const g = 9.8;
    const mass = density * vol;
    const waterTop = 180;
    function loop() {
      const submergedFrac = Math.min(1, Math.max(0, (posRef.current - waterTop + 30) / 60));
      const buoy = waterDensity * vol * submergedFrac * g;
      const weight = mass * g;
      const net = buoy - weight;
      velRef.current += net * 0.4;
      velRef.current *= 0.92;
      posRef.current += velRef.current * 0.2;
      posRef.current = Math.max(40, Math.min(waterTop + 80, posRef.current));
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      /* water */
      ctx.fillStyle = "rgba(59,130,246,0.2)";
      ctx.fillRect(80, waterTop, 420, c.height - waterTop - 20);
      ctx.strokeStyle = "rgba(147,197,253,0.6)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(80, waterTop); ctx.lineTo(500, waterTop); ctx.stroke();
      label(ctx, "Water (ρ=1000 kg/m³)", 85, waterTop - 8, "#93C5FD", 11);
      /* object */
      ctx.fillStyle = density < 1000 ? "#1E40AF" : "#7F1D1D";
      ctx.strokeStyle = density < 1000 ? BLUE : RED; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(290, posRef.current, 30, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      label(ctx, `ρ=${density}`, 265, posRef.current + 5, WHITE, 11);
      /* forces */
      const subFrac = Math.min(1, Math.max(0, (posRef.current - waterTop + 30) / 60));
      const B = waterDensity * vol * subFrac * g;
      const W = mass * g;
      arrow(ctx, 290, posRef.current - 30, 290, posRef.current - 30 - B * 50, GREEN, `B=${B.toFixed(3)}N`);
      arrow(ctx, 290, posRef.current + 30, 290, posRef.current + 30 + W * 50, AMBER, `W=${W.toFixed(3)}N`);
      const state = density < 1000 ? "FLOATS ✓" : density === 1000 ? "NEUTRAL" : "SINKS";
      label(ctx, `ρ_object = ${density} kg/m³ → ${state}`, 10, 30, density < 1000 ? GREEN : density > 1000 ? RED : AMBER, 14);
      label(ctx, `B=${B.toFixed(4)}N  W=${W.toFixed(4)}N`, 10, 52, WHITE, 12);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [density]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={310} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Object density: {density} kg/m³<input type="range" min={200} max={2000} step={50} value={density} onChange={e => setDensity(+e.target.value)} /></label>
        <span style={{ color: GRAY }}>Water density = 1000 kg/m³. Object floats if ρ &lt; 1000</span>
      </div>
    </div>
  );
}

/* ─── 12. Concurrent Forces — Vector Sum ─────────── */
export function Sim_concurrent_forces() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [f1, setF1] = useState(30); const [a1, setA1] = useState(0);
  const [f2, setF2] = useState(25); const [a2, setA2] = useState(120);
  const [f3, setF3] = useState(20); const [a3, setA3] = useState(240);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
    const cx = c.width / 2; const cy = 170;
    const toRad = (d: number) => d * Math.PI / 180;
    const forces = [{ f: f1, a: a1 }, { f: f2, a: a2 }, { f: f3, a: a3 }];
    const colors = [BLUE, GREEN, AMBER];
    let netX = 0, netY = 0;
    forces.forEach(({ f, a }, i) => {
      const rad = toRad(a);
      const dx = f * Math.cos(rad) * 2, dy = -f * Math.sin(rad) * 2;
      netX += dx; netY += dy;
      arrow(ctx, cx, cy, cx + dx, cy + dy, colors[i], `F${i + 1}=${f}N`, 2.5);
    });
    /* net force */
    const netMag = Math.sqrt(netX * netX + netY * netY);
    if (netMag > 5) {
      arrow(ctx, cx, cy, cx + netX, cy + netY, PURPLE, `Net=${(netMag / 2).toFixed(1)}N`, 3);
      label(ctx, "UNBALANCED — Object accelerates", 10, 30, RED, 13);
    } else {
      ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI * 2); ctx.fill();
      label(ctx, "BALANCED ✓ — Object at rest (Net force ≈ 0)", 10, 30, GREEN, 13);
    }
    /* origin dot */
    ctx.fillStyle = WHITE; ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill();
    label(ctx, "Adjust forces to make net force = 0 (equilibrium)", 10, c.height - 10, GRAY, 11);
  }, [f1, a1, f2, a2, f3, a3]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={300} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>F₁: {f1}N<input type="range" min={5} max={50} value={f1} onChange={e => setF1(+e.target.value)} /></label>
        <label>Angle₁: {a1}°<input type="range" min={0} max={360} value={a1} onChange={e => setA1(+e.target.value)} /></label>
        <label>F₂: {f2}N<input type="range" min={5} max={50} value={f2} onChange={e => setF2(+e.target.value)} /></label>
        <label>Angle₂: {a2}°<input type="range" min={0} max={360} value={a2} onChange={e => setA2(+e.target.value)} /></label>
        <label>F₃: {f3}N<input type="range" min={5} max={50} value={f3} onChange={e => setF3(+e.target.value)} /></label>
        <label>Angle₃: {a3}°<input type="range" min={0} max={360} value={a3} onChange={e => setA3(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 13. Force Meter Spring Demo ─────────────────── */
export function Sim_force_meter_demo() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [weight, setWeight] = useState(3);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
    const cx = c.width / 2; const F = weight * 9.8;
    /* housing */
    ctx.fillStyle = "#0F2A4A"; ctx.strokeStyle = "#3B82F6"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(cx - 35, 30, 70, 200, 10); ctx.fill(); ctx.stroke();
    /* scale markings */
    for (let i = 0; i <= 10; i++) {
      const y = 45 + i * 17;
      ctx.strokeStyle = i % 2 === 0 ? BLUE : GRAY; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx + 15, y); ctx.lineTo(cx + 30, y); ctx.stroke();
      if (i % 2 === 0) label(ctx, `${(10 - i) * 10}N`, cx + 32, y + 4, WHITE, 10);
    }
    /* hook spring */
    const hookY = 30 + (F / 100) * 185;
    ctx.strokeStyle = "#60A5FA"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx - 5, 30);
    for (let i = 0; i <= 10; i++) {
      ctx.lineTo(cx - 5 + Math.sin(i * Math.PI) * 12, 30 + i * hookY / 10);
    }
    ctx.stroke();
    /* needle */
    ctx.strokeStyle = RED; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(cx - 30, hookY); ctx.lineTo(cx + 14, hookY); ctx.stroke();
    /* weight */
    ctx.fillStyle = "#1E40AF"; ctx.strokeStyle = BLUE; ctx.lineWidth = 2;
    ctx.fillRect(cx - 22, 235, 44, 35); ctx.strokeRect(cx - 22, 235, 44, 35);
    label(ctx, `${weight}kg`, cx - 14, 258, WHITE, 12);
    /* string */
    ctx.strokeStyle = GRAY; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, 230); ctx.lineTo(cx, 235); ctx.stroke();
    label(ctx, `Force = ${F.toFixed(1)} N`, cx - 100, 290, AMBER, 14);
    label(ctx, "Spring Force Meter — extends proportional to weight", 10, c.height - 10, GRAY, 11);
  }, [weight]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={320} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Weight: {weight}kg<input type="range" min={1} max={10} value={weight} onChange={e => setWeight(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 14. Hanging Sign — Two-String Tension ──────── */
export function Sim_hanging_sign_tension() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(30);
  const [mass, setMass] = useState(5);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
    const cx = c.width / 2; const W = mass * 9.8;
    const rad = angle * Math.PI / 180;
    const T = W / (2 * Math.sin(rad));
    const signY = 200;
    /* ceiling */
    ctx.fillStyle = "#1F2937"; ctx.fillRect(0, 0, c.width, 25);
    ctx.strokeStyle = GRAY; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, 25); ctx.lineTo(c.width, 25); ctx.stroke();
    /* attachment points */
    const attach1X = cx - 120 * Math.cos(rad);
    const attach2X = cx + 120 * Math.cos(rad);
    const attachY = signY - 120 * Math.sin(rad);
    /* strings */
    ctx.strokeStyle = "#D4D4D8"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx - 60, signY); ctx.lineTo(attach1X, Math.max(25, attachY)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + 60, signY); ctx.lineTo(attach2X, Math.max(25, attachY)); ctx.stroke();
    /* sign */
    ctx.fillStyle = "#1E3A5F"; ctx.strokeStyle = BLUE; ctx.lineWidth = 2;
    ctx.fillRect(cx - 80, signY, 160, 50); ctx.strokeRect(cx - 80, signY, 160, 50);
    label(ctx, `${mass} kg`, cx - 20, signY + 30, WHITE, 14);
    /* force arrows at junction points */
    arrow(ctx, cx - 60, signY, attach1X - (cx - 60), attachY, GREEN, `T=${T.toFixed(1)}N`, 2);
    arrow(ctx, cx + 60, signY, attach2X + (cx + 60), attachY, GREEN, `T=${T.toFixed(1)}N`, 2);
    arrow(ctx, cx, signY + 50, cx, signY + 50 + W * 2.5, AMBER, `W=${W.toFixed(1)}N`);
    label(ctx, `Each string tension = W/(2sinθ) = ${T.toFixed(1)} N`, 10, 40, WHITE, 13);
    label(ctx, `T increases as angle DECREASES! (flatter = more tension)`, 10, 60, angle < 20 ? RED : AMBER, 12);
  }, [angle, mass]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={310} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>String angle: {angle}°<input type="range" min={10} max={80} value={angle} onChange={e => setAngle(+e.target.value)} /></label>
        <label>Mass: {mass}kg<input type="range" min={1} max={15} value={mass} onChange={e => setMass(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 15. Resultant Force — 3 Forces ─────────────── */
export function Sim_resultant_force_3d() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [f1, setF1] = useState(40); const [f2, setF2] = useState(30); const [f3, setF3] = useState(25);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
    const cx = 180; const cy = 180;
    /* Force 1: right */
    arrow(ctx, cx, cy, cx + f1 * 2.5, cy, BLUE, `F₁=${f1}N`, 3);
    /* Force 2: up-right */
    arrow(ctx, cx, cy, cx + f2 * 1.5, cy - f2 * 2, GREEN, `F₂=${f2}N`, 3);
    /* Force 3: down */
    arrow(ctx, cx, cy, cx, cy + f3 * 2, AMBER, `F₃=${f3}N`, 3);
    /* Resultant */
    const rx = f1 * 2.5 + f2 * 1.5;
    const ry = cy + f3 * 2 - f2 * 2 - cy;
    const mag = Math.sqrt(rx * rx + ry * ry);
    arrow(ctx, cx, cy, cx + rx, cy + ry, PURPLE, `R=${(mag / 2).toFixed(1)}N`, 3.5);
    /* parallelogram construction */
    ctx.strokeStyle = "rgba(139,92,246,0.3)"; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(cx + f1 * 2.5, cy); ctx.lineTo(cx + rx, cy + ry); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + f2 * 1.5, cy - f2 * 2); ctx.lineTo(cx + rx, cy + ry); ctx.stroke();
    ctx.setLineDash([]);
    /* explanation box */
    ctx.fillStyle = "rgba(15,23,42,0.8)"; ctx.strokeStyle = GRAY; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(340, 30, 220, 130, 8); ctx.fill(); ctx.stroke();
    label(ctx, "Vector Addition:", 355, 50, WHITE, 12);
    label(ctx, `Rx = F₁x + F₂x = ${(f1 * 2.5 + f2 * 1.5).toFixed(0)}`, 355, 70, BLUE, 11);
    label(ctx, `Ry = F₃ - F₂y = ${ry.toFixed(0)}`, 355, 88, GREEN, 11);
    label(ctx, `|R| = √(Rx²+Ry²) = ${(mag / 2).toFixed(1)} N`, 355, 108, PURPLE, 11);
    label(ctx, `Direction: ${(Math.atan2(ry, rx) * 180 / Math.PI).toFixed(1)}°`, 355, 128, AMBER, 11);
    label(ctx, "Resultant of 3 Forces — Vector Addition", 10, c.height - 10, GRAY, 11);
  }, [f1, f2, f3]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={310} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>F₁ (→): {f1}N<input type="range" min={5} max={60} value={f1} onChange={e => setF1(+e.target.value)} /></label>
        <label>F₂ (↗): {f2}N<input type="range" min={5} max={60} value={f2} onChange={e => setF2(+e.target.value)} /></label>
        <label>F₃ (↓): {f3}N<input type="range" min={5} max={60} value={f3} onChange={e => setF3(+e.target.value)} /></label>
      </div>
    </div>
  );
}
