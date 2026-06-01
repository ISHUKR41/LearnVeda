/**
 * FILE: Topic2Mega.tsx
 * PURPOSE: 15 professional animated physics simulations for Topic 2 —
 *          Newton's First Law of Motion / Inertia (Class 9 CBSE syllabus).
 *          All simulations demonstrate inertia and Newton's first law with
 *          real physics and smooth canvas animation.
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

function arrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, lbl = "", w = 2.5) {
  if (Math.abs(x2 - x1) < 0.5 && Math.abs(y2 - y1) < 0.5) return;
  ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = w;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  const a = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath(); ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 10 * Math.cos(a - 0.4), y2 - 10 * Math.sin(a - 0.4));
  ctx.lineTo(x2 - 10 * Math.cos(a + 0.4), y2 - 10 * Math.sin(a + 0.4));
  ctx.closePath(); ctx.fill();
  if (lbl) { ctx.font = "bold 11px Inter,sans-serif"; ctx.fillText(lbl, x2 + 5, y2 + 4); }
  ctx.restore();
}

function txt(ctx: CanvasRenderingContext2D, t: string, x: number, y: number, c = WHITE, s = 12) {
  ctx.save(); ctx.font = `${s}px Inter,sans-serif`; ctx.fillStyle = c; ctx.fillText(t, x, y); ctx.restore();
}

/* ─── 1. Tablecloth Trick ─────────────────────────── */
export function Sim_tablecloth_trick() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const phaseRef = useRef<"idle" | "pulling" | "done">("idle");
  const clothXRef = useRef(0); const itemsRef = useRef([{ x: 200, vx: 0 }, { x: 290, vx: 0 }, { x: 380, vx: 0 }]);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    if (!running) {
      phaseRef.current = "idle"; clothXRef.current = 0;
      itemsRef.current = [{ x: 200, vx: 0 }, { x: 290, vx: 0 }, { x: 380, vx: 0 }];
    }
    function draw() {
      const ph = phaseRef.current;
      if (ph === "pulling") {
        clothXRef.current += 18;
        /* items have tiny friction, barely move */
        itemsRef.current = itemsRef.current.map(it => {
          const friction = 0.3;
          return { x: it.x + friction * 0.3, vx: 0 };
        });
        if (clothXRef.current > c.width + 100) phaseRef.current = "done";
      }
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      const tableY = 220;
      /* table */
      ctx.fillStyle = "#78350F"; ctx.strokeStyle = "#D97706"; ctx.lineWidth = 2;
      ctx.fillRect(80, tableY, 420, 18); ctx.strokeRect(80, tableY, 420, 18);
      ctx.fillRect(90, tableY + 18, 12, 70); ctx.fillRect(478, tableY + 18, 12, 70);
      /* tablecloth */
      if (ph !== "done") {
        const cx = clothXRef.current;
        ctx.fillStyle = "#E11D48"; ctx.strokeStyle = "#FB7185"; ctx.lineWidth = 1.5;
        ctx.fillRect(80 + cx, tableY - 30, 420, 32); ctx.strokeRect(80 + cx, tableY - 30, 420, 32);
        /* pull arrow */
        if (ph === "pulling") arrow(ctx, 80 + cx + 420, tableY - 14, 80 + cx + 480, tableY - 14, AMBER, "PULL!", 3);
      }
      /* items */
      const labels = ["Cup", "Plate", "Vase"];
      const colors = [BLUE, GREEN, PURPLE];
      itemsRef.current.forEach((it, i) => {
        ctx.fillStyle = colors[i]; ctx.strokeStyle = WHITE; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(it.x, tableY - 22, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        txt(ctx, labels[i], it.x - 12, tableY + 10, colors[i], 10);
      });
      /* labels */
      if (ph === "done") {
        txt(ctx, "✓ Items BARELY MOVED — Inertia kept them in place!", 80, 30, GREEN, 14);
        txt(ctx, "Cloth pulled quickly → friction too brief to move items", 80, 52, WHITE, 12);
      } else if (ph === "pulling") {
        txt(ctx, "Cloth being pulled rapidly...", 80, 30, AMBER, 13);
        txt(ctx, "Items have INERTIA — they resist change in motion", 80, 52, WHITE, 12);
      } else {
        txt(ctx, "Press PULL to see the tablecloth trick!", 100, 50, WHITE, 13);
        txt(ctx, "Newton's 1st Law: Objects at rest STAY at rest", 100, 72, GRAY, 12);
      }
      rafRef.current = requestAnimationFrame(draw);
    }
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={310} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <button onClick={() => { phaseRef.current = "pulling"; clothXRef.current = 0; itemsRef.current = [{ x: 200, vx: 0 }, { x: 290, vx: 0 }, { x: 380, vx: 0 }]; setRunning(true); }}>Pull Tablecloth!</button>
        <button onClick={() => { setRunning(false); }}>Reset</button>
      </div>
    </div>
  );
}

/* ─── 2. Hockey Puck on Ice vs Rough Surface ────── */
export function Sim_hockey_puck_surfaces() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const [friction, setFriction] = useState(0.02);
  const puckRef = useRef({ x: 60, v: 8 });
  useEffect(() => {
    puckRef.current = { x: 60, v: 8 };
    const c = ref.current!; const ctx = c.getContext("2d")!;
    function loop() {
      puckRef.current.v = Math.max(0, puckRef.current.v - friction * 9.8 * 0.03);
      puckRef.current.x += puckRef.current.v * 0.8;
      if (puckRef.current.x > c.width - 30) { puckRef.current.x = 60; puckRef.current.v = 8; }
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      const surfY = 200;
      /* surface */
      const isIce = friction < 0.05;
      ctx.fillStyle = isIce ? "rgba(147,210,255,0.2)" : "rgba(180,140,90,0.2)";
      ctx.fillRect(0, surfY, c.width, 60);
      ctx.strokeStyle = isIce ? "#93C5FD" : "#D97706"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, surfY); ctx.lineTo(c.width, surfY); ctx.stroke();
      if (!isIce) {
        ctx.strokeStyle = "rgba(180,140,90,0.3)"; ctx.lineWidth = 1;
        for (let i = 0; i < 20; i++) {
          const rx = 10 + i * 28; const ry = surfY + 8 + Math.random() * 20;
          ctx.beginPath(); ctx.arc(rx, ry, 3, 0, Math.PI * 2); ctx.stroke();
        }
      }
      /* puck */
      ctx.fillStyle = "#1E1E1E"; ctx.strokeStyle = BLUE; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(puckRef.current.x, surfY - 12, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = WHITE; ctx.font = "bold 9px Inter,sans-serif"; ctx.textAlign = "center";
      ctx.fillText("puck", puckRef.current.x, surfY - 8); ctx.textAlign = "left";
      /* velocity trail */
      ctx.fillStyle = "rgba(59,130,246,0.15)";
      ctx.fillRect(60, surfY - 30, puckRef.current.x - 60, 36);
      /* arrows */
      if (puckRef.current.v > 0.1) {
        arrow(ctx, puckRef.current.x + 18, surfY - 12, puckRef.current.x + 18 + puckRef.current.v * 8, surfY - 12, BLUE, `v=${puckRef.current.v.toFixed(1)}m/s`);
      }
      if (friction > 0.01) {
        arrow(ctx, puckRef.current.x - 18, surfY - 12, puckRef.current.x - 18 - friction * 100, surfY - 12, RED, `f`);
      }
      txt(ctx, isIce ? "ICE — very low friction" : `ROUGH (μ=${friction})`, 10, 30, isIce ? "#93C5FD" : "#D97706", 13);
      txt(ctx, puckRef.current.v < 0.1 ? "Stopped! Friction overcame inertia." : `Inertia keeps puck moving | μ=${friction}`, 10, 52, WHITE, 12);
      txt(ctx, "Newton's 1st Law: No net force → constant velocity", 10, c.height - 10, GRAY, 11);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [friction]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={270} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Friction (μ): {friction.toFixed(2)}<input type="range" min={0.01} max={0.8} step={0.01} value={friction} onChange={e => setFriction(+e.target.value)} /></label>
        <span style={{ color: GREEN }}>Lower friction = puck slides farther (more inertia effect visible)</span>
      </div>
    </div>
  );
}

/* ─── 3. Satellite Orbit (Inertia + Gravity) ──────── */
export function Sim_satellite_orbit_inertia() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const [orbitV, setOrbitV] = useState(4);
  const satRef = useRef({ x: 290, y: 60, vx: 4, vy: 0, trail: [] as { x: number, y: number }[] });
  useEffect(() => {
    satRef.current = { x: 290, y: 60, vx: orbitV, vy: 0, trail: [] };
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const ex = 290; const ey = 190; const G = 800;
    function loop() {
      const s = satRef.current;
      const dx = ex - s.x; const dy = ey - s.y;
      const r2 = dx * dx + dy * dy; const r = Math.sqrt(r2);
      const F = G / r2;
      s.vx += F * dx / r * 0.016; s.vy += F * dy / r * 0.016;
      s.x += s.vx; s.y += s.vy;
      s.trail.push({ x: s.x, y: s.y });
      if (s.trail.length > 200) s.trail.shift();
      if (r < 30) { s.x = 290; s.y = 60; s.vx = orbitV; s.vy = 0; s.trail = []; }
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      /* stars */
      ctx.fillStyle = WHITE;
      [{ x: 50, y: 30 }, { x: 520, y: 50 }, { x: 100, y: 280 }, { x: 480, y: 290 }, { x: 30, y: 200 }].forEach(p => {
        ctx.fillRect(p.x, p.y, 2, 2);
      });
      /* trail */
      if (s.trail.length > 2) {
        ctx.strokeStyle = "rgba(139,92,246,0.4)"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(s.trail[0].x, s.trail[0].y);
        s.trail.forEach(p => ctx.lineTo(p.x, p.y)); ctx.stroke();
      }
      /* Earth */
      const earthGrad = ctx.createRadialGradient(ex, ey, 0, ex, ey, 28);
      earthGrad.addColorStop(0, "#166534"); earthGrad.addColorStop(1, "#1D4ED8");
      ctx.fillStyle = earthGrad;
      ctx.beginPath(); ctx.arc(ex, ey, 28, 0, Math.PI * 2); ctx.fill();
      /* gravity arrow */
      const dx2 = ex - s.x; const dy2 = ey - s.y; const r2v = Math.sqrt(dx2 * dx2 + dy2 * dy2);
      arrow(ctx, s.x, s.y, s.x + dx2 / r2v * 25, s.y + dy2 / r2v * 25, AMBER, "g");
      /* velocity arrow (inertia direction) */
      const vs = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
      arrow(ctx, s.x, s.y, s.x + s.vx / vs * 30, s.y + s.vy / vs * 30, GREEN, "v");
      /* satellite */
      ctx.fillStyle = "#94A3B8"; ctx.strokeStyle = GRAY; ctx.lineWidth = 1.5;
      ctx.fillRect(s.x - 8, s.y - 5, 16, 10); ctx.strokeRect(s.x - 8, s.y - 5, 16, 10);
      ctx.fillStyle = "#60A5FA"; ctx.fillRect(s.x - 18, s.y - 3, 10, 6); ctx.fillRect(s.x + 8, s.y - 3, 10, 6);
      txt(ctx, "Gravity curves path | Inertia wants straight line", 10, 30, WHITE, 12);
      txt(ctx, `Speed: ${Math.sqrt(s.vx * s.vx + s.vy * s.vy).toFixed(1)} → ${orbitV >= 4 ? "orbit" : "falls to Earth"}`, 10, 50, AMBER, 12);
      txt(ctx, "Newton's 1st Law: Satellite would fly straight without gravity!", 10, c.height - 10, GRAY, 11);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [orbitV]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={330} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Launch speed: {orbitV}<input type="range" min={2} max={7} step={0.5} value={orbitV} onChange={e => setOrbitV(+e.target.value)} /></label>
        <span style={{ color: GREEN }}>Speed 4-5 = stable orbit | Too slow = crash | Too fast = escape</span>
      </div>
    </div>
  );
}

/* ─── 4. Bus Sudden Stop — Passengers Lean Forward ── */
export function Sim_bus_sudden_stop_inertia() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const [phase, setPhase] = useState<"moving" | "braking" | "stopped">("moving");
  const leanRef = useRef(0);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    leanRef.current = 0;
    function loop() {
      if (phase === "braking") {
        leanRef.current = Math.min(leanRef.current + 1.5, 20);
      } else if (phase === "stopped") {
        leanRef.current = Math.max(leanRef.current - 0.5, 0);
      } else {
        leanRef.current = 0;
      }
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      /* road */
      ctx.fillStyle = "#1F2937"; ctx.fillRect(0, 270, c.width, 60);
      ctx.strokeStyle = AMBER; ctx.lineWidth = 2; ctx.setLineDash([20, 15]);
      ctx.beginPath(); ctx.moveTo(0, 300); ctx.lineTo(c.width, 300); ctx.stroke(); ctx.setLineDash([]);
      /* bus body */
      ctx.fillStyle = "#1D4ED8"; ctx.strokeStyle = BLUE; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(60, 170, 300, 100, [10, 10, 0, 0]); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#1E3A5F"; ctx.strokeStyle = "#60A5FA"; ctx.lineWidth = 1.5;
      [90, 150, 210, 280].forEach(x => ctx.strokeRect(x, 185, 40, 40));
      /* wheels */
      [100, 310].forEach(x => {
        ctx.fillStyle = "#1F2937"; ctx.strokeStyle = GRAY; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x, 272, 20, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = "#6B7280"; ctx.lineWidth = 1;
        [0, 60, 120, 180, 240, 300].forEach(a => {
          const r = a * Math.PI / 180;
          ctx.beginPath(); ctx.moveTo(x, 272); ctx.lineTo(x + 16 * Math.cos(r), 272 + 16 * Math.sin(r)); ctx.stroke();
        });
      });
      /* passengers (stick figures with lean) */
      const lean = leanRef.current;
      [120, 200, 280].forEach(bx => {
        const h = 175; ctx.strokeStyle = WHITE; ctx.lineWidth = 2;
        /* head */
        ctx.beginPath(); ctx.arc(bx + lean, h - 20, 10, 0, Math.PI * 2); ctx.stroke();
        /* body */
        ctx.beginPath(); ctx.moveTo(bx, h); ctx.lineTo(bx + lean, h - 10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx, h + 20); ctx.lineTo(bx, h); ctx.stroke();
        /* legs */
        ctx.beginPath(); ctx.moveTo(bx, h + 20); ctx.lineTo(bx - 8, h + 40); ctx.moveTo(bx, h + 20); ctx.lineTo(bx + 8, h + 40); ctx.stroke();
        /* inertia arrow on lean */
        if (lean > 5) arrow(ctx, bx + lean - 5, h - 20, bx + lean + 15, h - 20, RED, "", 2);
      });
      /* status */
      const statusColor = phase === "moving" ? GREEN : phase === "braking" ? RED : AMBER;
      txt(ctx, phase === "moving" ? "Bus moving at constant speed — passengers upright" :
        phase === "braking" ? `BRAKING! Passengers lean FORWARD (inertia, ${lean.toFixed(0)}°)` :
        "Bus stopped. Passengers return to upright.", 10, 30, statusColor, 13);
      txt(ctx, "Newton's 1st Law: Passengers' bodies want to KEEP moving forward!", 10, 160, GRAY, 11);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={310} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <button onClick={() => setPhase("moving")}>Bus Moving</button>
        <button onClick={() => setPhase("braking")}>Brake!</button>
        <button onClick={() => setPhase("stopped")}>Stopped</button>
      </div>
    </div>
  );
}

/* ─── 5. Rolling Ball on Different Surfaces ──────── */
export function Sim_rolling_ball_friction() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const ballRef = useRef({ x: 50, v: 6 });
  const [surface, setSurface] = useState<"ice" | "wood" | "carpet" | "sand">("ice");
  const muMap = { ice: 0.01, wood: 0.06, carpet: 0.2, sand: 0.5 };
  const colorMap = { ice: "#93C5FD", wood: "#D97706", carpet: "#DC2626", sand: "#D4A574" };
  useEffect(() => {
    ballRef.current = { x: 50, v: 6 };
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const mu = muMap[surface];
    function loop() {
      ballRef.current.v = Math.max(0, ballRef.current.v - mu * 9.8 * 0.025);
      ballRef.current.x += ballRef.current.v * 0.7;
      if (ballRef.current.x > c.width + 20) { ballRef.current.x = 50; ballRef.current.v = 6; }
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      /* surface */
      ctx.fillStyle = colorMap[surface] + "30";
      ctx.fillRect(0, 190, c.width, 60);
      ctx.strokeStyle = colorMap[surface]; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, 190); ctx.lineTo(c.width, 190); ctx.stroke();
      /* surface texture */
      if (surface === "carpet") {
        ctx.strokeStyle = colorMap[surface] + "40"; ctx.lineWidth = 1;
        for (let i = 0; i < 50; i++) { ctx.beginPath(); ctx.moveTo(i * 12, 195); ctx.lineTo(i * 12 + 5, 210); ctx.stroke(); }
      } else if (surface === "sand") {
        ctx.fillStyle = colorMap[surface] + "60";
        for (let i = 0; i < 20; i++) ctx.fillRect(15 + i * 28, 198, 6, 4);
      }
      txt(ctx, surface.toUpperCase() + ` (μ = ${mu})`, 10, 215, colorMap[surface], 12);
      /* distance markers */
      for (let i = 1; i <= 5; i++) {
        ctx.strokeStyle = GRAY; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(i * 100, 188); ctx.lineTo(i * 100, 200); ctx.stroke();
        txt(ctx, `${i}m`, i * 100 - 8, 185, GRAY, 10);
      }
      /* stopping distance estimate */
      const stopX = 50 + (6 * 6) / (2 * mu * 9.8) * 0.7;
      ctx.strokeStyle = "rgba(139,92,246,0.5)"; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(Math.min(stopX, c.width - 10), 170); ctx.lineTo(Math.min(stopX, c.width - 10), 200); ctx.stroke(); ctx.setLineDash([]);
      if (stopX < c.width) txt(ctx, "stops here", Math.min(stopX - 30, c.width - 60), 165, PURPLE, 10);
      /* ball */
      ctx.fillStyle = "#1E40AF"; ctx.strokeStyle = BLUE; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(ballRef.current.x, 172, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      if (ballRef.current.v > 0.1) {
        arrow(ctx, ballRef.current.x + 18, 172, ballRef.current.x + 18 + ballRef.current.v * 7, 172, GREEN, `${ballRef.current.v.toFixed(1)} m/s`);
        arrow(ctx, ballRef.current.x - 18, 172, ballRef.current.x - 18 - mu * 40, 172, RED, `f`);
      }
      txt(ctx, ballRef.current.v < 0.1 ? `Ball stopped! (more friction = less inertia visible)` : "Ball rolls due to INERTIA", 10, 30, WHITE, 13);
      txt(ctx, `Newton's 1st Law: Ball would roll FOREVER with no friction!`, 10, 52, GRAY, 12);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [surface]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={250} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        {(["ice", "wood", "carpet", "sand"] as const).map(s => (
          <button key={s} onClick={() => setSurface(s)} style={{ background: s === surface ? colorMap[s] + "40" : undefined }}>{s}</button>
        ))}
      </div>
    </div>
  );
}

/* ─── 6. Coin Stack Strike ─────────────────────────── */
export function Sim_coin_stack_strike() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const phaseRef = useRef<"idle" | "striking" | "done">("idle");
  const strikerRef = useRef({ x: 60, v: 0 });
  const coinRef = useRef(0);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    function loop() {
      const ph = phaseRef.current;
      if (ph === "striking") {
        strikerRef.current.v = 18;
        strikerRef.current.x += strikerRef.current.v;
        coinRef.current = Math.max(0, coinRef.current - 2);
        if (strikerRef.current.x > 280) phaseRef.current = "done";
      }
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      const baseY = 260; const cx = 290;
      /* table */
      ctx.fillStyle = "#78350F"; ctx.strokeStyle = "#D97706"; ctx.lineWidth = 1.5;
      ctx.fillRect(60, baseY, 460, 15);
      /* coin stack — all except bottom */
      const stayingCoins = 7;
      for (let i = stayingCoins; i > 0; i--) {
        ctx.fillStyle = i === 1 && ph !== "idle" ? "#D97706" : "#A67C52";
        ctx.strokeStyle = "#D4A574"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.ellipse(cx, baseY - i * 14, 28, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.rect(cx - 28, baseY - i * 14 - 6, 56, 12); ctx.fill(); ctx.stroke();
      }
      /* bottom coin that flies out */
      if (ph !== "idle") {
        const flyX = cx + coinRef.current * -2.5 + (ph === "done" ? (stayingCoins - coinRef.current) * 8 : 0);
        ctx.fillStyle = "#F59E0B"; ctx.strokeStyle = "#FCD34D"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(flyX, baseY - 6, 28, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        if (ph === "done") {
          const slideX = cx + 80 + (9 - coinRef.current) * 15;
          ctx.beginPath(); ctx.ellipse(slideX, baseY - 6, 28, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          arrow(ctx, cx + 28, baseY - 6, cx + 80, baseY - 6, AMBER, "slides out", 2);
        }
      }
      /* striker */
      ctx.fillStyle = "#374151"; ctx.strokeStyle = GRAY; ctx.lineWidth = 2;
      ctx.fillRect(strikerRef.current.x - 30, baseY - 14, 30, 14); ctx.strokeRect(strikerRef.current.x - 30, baseY - 14, 30, 14);
      if (ph === "striking") arrow(ctx, strikerRef.current.x, baseY - 7, strikerRef.current.x + 30, baseY - 7, RED, "→");
      txt(ctx, ph === "idle" ? "Press STRIKE to hit bottom coin only" :
        ph === "striking" ? "Bottom coin slides out! Other coins STAY (inertia)" :
        "✓ Stack above stays — only bottom coin moved!", 10, 30, ph === "done" ? GREEN : WHITE, 13);
      txt(ctx, "Newton's 1st Law: Top coins at rest → STAY at rest", 10, 52, GRAY, 12);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={310} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <button onClick={() => { phaseRef.current = "striking"; strikerRef.current = { x: 60, v: 0 }; coinRef.current = 9; }}>Strike!</button>
        <button onClick={() => { phaseRef.current = "idle"; strikerRef.current = { x: 60, v: 0 }; coinRef.current = 0; }}>Reset</button>
      </div>
    </div>
  );
}

/* ─── 7. Space Object Drifting ─────────────────────── */
export function Sim_space_drift_newton1() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const [boost, setBoost] = useState(false);
  const shipRef = useRef({ x: 50, y: 160, vx: 1.5, vy: 0.3 });
  const trailRef = useRef<{ x: number; y: number }[]>([]);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    function loop() {
      const s = shipRef.current;
      if (boost) { s.vx += 0.05; }
      s.x += s.vx; s.y += s.vy;
      if (s.x > c.width + 30) s.x = -30;
      if (s.y < 0) s.y = c.height;
      if (s.y > c.height) s.y = 0;
      trailRef.current.push({ x: s.x, y: s.y });
      if (trailRef.current.length > 120) trailRef.current.shift();
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      /* stars */
      [{ x: 100, y: 50 }, { x: 450, y: 80 }, { x: 200, y: 250 }, { x: 520, y: 200 }, { x: 60, y: 290 }, { x: 350, y: 30 }].forEach(p => {
        ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2); ctx.fill();
      });
      /* trail */
      if (trailRef.current.length > 2) {
        ctx.strokeStyle = "rgba(59,130,246,0.3)"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(trailRef.current[0].x, trailRef.current[0].y);
        trailRef.current.forEach(p => ctx.lineTo(p.x, p.y)); ctx.stroke();
      }
      /* ship */
      ctx.save(); ctx.translate(s.x, s.y);
      const angle = Math.atan2(s.vy, s.vx);
      ctx.rotate(angle);
      ctx.fillStyle = "#94A3B8"; ctx.strokeStyle = GRAY; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(20, 0); ctx.lineTo(-12, -10); ctx.lineTo(-8, 0); ctx.lineTo(-12, 10); ctx.closePath(); ctx.fill(); ctx.stroke();
      if (boost) {
        ctx.fillStyle = "#F59E0B";
        ctx.beginPath(); ctx.moveTo(-8, -5); ctx.lineTo(-25, 0); ctx.lineTo(-8, 5); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
      arrow(ctx, s.x, s.y, s.x + s.vx * 20, s.y + s.vy * 20, GREEN, `v=${Math.sqrt(s.vx * s.vx + s.vy * s.vy).toFixed(1)}`);
      txt(ctx, boost ? "Thruster ON — velocity increasing" : "No forces in space — constant velocity!", 10, 30, boost ? AMBER : GREEN, 13);
      txt(ctx, `vx=${s.vx.toFixed(2)} m/s  vy=${s.vy.toFixed(2)} m/s`, 10, 52, WHITE, 12);
      txt(ctx, "Newton's 1st Law: No net force → motion unchanged", 10, c.height - 10, GRAY, 11);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [boost]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={310} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <button onClick={() => setBoost(b => !b)}>{boost ? "Turn OFF Thruster" : "Turn ON Thruster"}</button>
        <button onClick={() => { shipRef.current = { x: 50, y: 160, vx: 1.5, vy: 0.3 }; trailRef.current = []; }}>Reset</button>
        <span style={{ color: GRAY }}>Without thruster: constant velocity (1st Law)</span>
      </div>
    </div>
  );
}

/* ─── 8. Marble in a Curved Track ─────────────────── */
export function Sim_marble_curved_track() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const marRef = useRef({ x: 50, vx: 4, on: true });
  const exitRef = useRef({ x: 0, y: 0, vx: 0, exited: false });
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    marRef.current = { x: 50, vx: 4, on: true };
    exitRef.current = { x: 0, y: 0, vx: 0, exited: false };
    const trackR = 140; const trackCX = 290; const trackCY = 300;
    function getTrackY(x: number) {
      /* semicircular track from x=80 to x=500 */
      if (x < 80 || x > 500) return null;
      const dx = x - trackCX;
      const inside = trackR * trackR - dx * dx;
      if (inside < 0) return null;
      return trackCY - Math.sqrt(inside);
    }
    function loop() {
      const m = marRef.current; const ex = exitRef.current;
      if (m.on) {
        m.x += m.vx;
        const ty = getTrackY(m.x);
        if (ty === null || m.x > 490) {
          /* left track */
          m.on = false;
          ex.exited = true;
          ex.x = m.x; ex.y = ty ?? 160;
          ex.vx = m.vx;
        }
      }
      if (ex.exited) {
        ex.x += ex.vx;
        /* goes straight — inertia! */
        if (ex.x > c.width + 20) { marRef.current = { x: 50, vx: 4, on: true }; exitRef.current = { x: 0, y: 0, vx: 0, exited: false }; }
      }
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      /* track */
      ctx.strokeStyle = "#475569"; ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(trackCX, trackCY, trackR, Math.PI, 0); ctx.stroke();
      /* exit guide */
      if (!ex.exited) {
        ctx.strokeStyle = "rgba(239,68,68,0.3)"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(490, trackCY - Math.sqrt(trackR * trackR - (490 - trackCX) ** 2));
        ctx.lineTo(c.width, trackCY - Math.sqrt(trackR * trackR - (490 - trackCX) ** 2)); ctx.stroke(); ctx.setLineDash([]);
      }
      /* marble on track */
      const ty = getTrackY(m.x);
      if (m.on && ty !== null) {
        ctx.fillStyle = "#3B82F6"; ctx.strokeStyle = WHITE; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(m.x, ty - 12, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        const dx = m.x - trackCX;
        arrow(ctx, m.x, ty - 12, m.x + m.vx * 8, ty - 12, GREEN, "v");
      }
      /* marble flying straight */
      if (ex.exited) {
        ctx.fillStyle = "#3B82F6"; ctx.strokeStyle = WHITE; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(ex.x, ex.y - 12, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        arrow(ctx, ex.x, ex.y - 12, ex.x + ex.vx * 8, ex.y - 12, RED, "INERTIA →");
        txt(ctx, "Marble exits track → goes STRAIGHT (Newton's 1st Law)", 30, 40, GREEN, 13);
      } else {
        txt(ctx, "Marble follows curved track...", 30, 40, WHITE, 13);
      }
      txt(ctx, "Track exerts centripetal force. Without track → straight line", 10, c.height - 10, GRAY, 11);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={310} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <span style={{ color: GREEN }}>Watch the marble fly straight when it leaves the curved track!</span>
      </div>
    </div>
  );
}

/* ─── 9. Crash Test Dummy ─────────────────────────── */
export function Sim_crash_test_dummy() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const [hasSeatbelt, setHasSeatbelt] = useState(false);
  const phaseRef = useRef<"moving" | "crash">("moving");
  const dummyRef = useRef({ x: 200, v: 8 });
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    phaseRef.current = "moving"; dummyRef.current = { x: 200, v: 8 };
    function loop() {
      const d = dummyRef.current;
      const ph = phaseRef.current;
      if (ph === "crash") {
        if (hasSeatbelt) {
          d.v = Math.max(0, d.v - 0.8);
        } else {
          d.x = Math.min(d.x + d.v * 0.5, 520);
          d.v = Math.max(0, d.v - 0.05);
        }
      }
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      /* road */
      ctx.fillStyle = "#1F2937"; ctx.fillRect(0, 230, c.width, 60);
      /* wall */
      ctx.fillStyle = "#374151"; ctx.strokeStyle = GRAY; ctx.lineWidth = 2;
      ctx.fillRect(480, 170, 30, 75); ctx.strokeRect(480, 170, 30, 75);
      txt(ctx, "WALL", 482, 215, WHITE, 10);
      /* car body */
      ctx.fillStyle = "#1E3A5F"; ctx.strokeStyle = BLUE; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(100, 175, 300, 60, [12, 12, 0, 0]); ctx.fill(); ctx.stroke();
      /* windshield */
      ctx.fillStyle = "rgba(147,197,253,0.3)"; ctx.strokeStyle = "#60A5FA"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect(340, 180, 50, 35, 4); ctx.fill(); ctx.stroke();
      /* wheels */
      [150, 360].forEach(x => {
        ctx.fillStyle = "#0F172A"; ctx.strokeStyle = GRAY; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x, 235, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      });
      /* dummy */
      const dx = Math.min(d.x, 460); const dy = 185;
      ctx.strokeStyle = RED; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(dx, dy + 10, 10, 0, Math.PI * 2); ctx.stroke(); /* head */
      ctx.beginPath(); ctx.moveTo(dx, dy + 20); ctx.lineTo(dx, dy + 45); ctx.stroke(); /* body */
      ctx.beginPath(); ctx.moveTo(dx, dy + 30); ctx.lineTo(dx - 12, dy + 40); ctx.moveTo(dx, dy + 30); ctx.lineTo(dx + 12, dy + 40); ctx.stroke(); /* arms */
      ctx.beginPath(); ctx.moveTo(dx, dy + 45); ctx.lineTo(dx - 8, dy + 60); ctx.moveTo(dx, dy + 45); ctx.lineTo(dx + 8, dy + 60); ctx.stroke(); /* legs */
      /* seatbelt */
      if (hasSeatbelt) {
        ctx.strokeStyle = AMBER; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(dx - 8, dy + 15); ctx.lineTo(dx + 8, dy + 40); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(dx - 12, dy + 40); ctx.lineTo(dx + 12, dy + 40); ctx.stroke();
      }
      /* inertia arrow */
      if (ph === "crash" && !hasSeatbelt && d.v > 1) {
        arrow(ctx, dx + 10, dy + 20, dx + 50, dy + 20, RED, "INERTIA!");
      }
      txt(ctx, ph === "moving" ? "Car moving at constant speed →" :
        hasSeatbelt ? "Crash! Seatbelt holds dummy in place ✓" : "Crash! Dummy flies FORWARD — inertia!", 10, 30, ph === "crash" && !hasSeatbelt ? RED : GREEN, 13);
      txt(ctx, hasSeatbelt ? "Seatbelt provides stopping force" : "No force to stop the dummy!", 10, 52, WHITE, 12);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [hasSeatbelt]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={295} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <button onClick={() => { phaseRef.current = "crash"; }}>Crash!</button>
        <button onClick={() => { phaseRef.current = "moving"; dummyRef.current = { x: 200, v: 8 }; }}>Reset</button>
        <label><input type="checkbox" checked={hasSeatbelt} onChange={e => setHasSeatbelt(e.target.checked)} /> Seatbelt</label>
      </div>
    </div>
  );
}

/* ─── 10. Spinning Top (Gyroscopic Inertia) ──────── */
export function Sim_spinning_top() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const angleRef = useRef(0); const speedRef = useRef(0.15);
  const [spin, setSpin] = useState(true);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    speedRef.current = spin ? 0.15 : 0;
    function loop() {
      if (spin) speedRef.current = Math.max(0.03, speedRef.current - 0.0002);
      angleRef.current += speedRef.current;
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      const cx = 290; const cy = 190;
      /* shadow */
      ctx.fillStyle = "rgba(0,0,0,0.4)"; ctx.beginPath(); ctx.ellipse(cx, 280, 50, 12, 0, 0, Math.PI * 2); ctx.fill();
      /* spinning top body */
      ctx.save(); ctx.translate(cx, cy);
      /* tip at bottom */
      ctx.strokeStyle = GRAY; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 90); ctx.stroke();
      /* disk — ellipse to show rotation */
      const tilt = 0.1;
      ctx.save();
      ctx.rotate(Math.sin(angleRef.current) * tilt);
      ctx.fillStyle = "#1E40AF"; ctx.strokeStyle = BLUE; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(0, -20, 60, 15 + Math.abs(Math.sin(angleRef.current * 2)) * 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      /* stripes */
      ctx.strokeStyle = "rgba(147,197,253,0.5)"; ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        const a = angleRef.current + i * Math.PI / 2;
        ctx.beginPath(); ctx.moveTo(Math.cos(a) * 5, -20 + Math.sin(a) * 3); ctx.lineTo(Math.cos(a) * 55, -20 + Math.sin(a) * 13); ctx.stroke();
      }
      ctx.restore();
      /* handle */
      ctx.fillStyle = "#4B5563"; ctx.strokeStyle = GRAY; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(0, -40, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.restore();
      txt(ctx, spin ? `Spinning! Speed: ${(speedRef.current * 60).toFixed(1)} rpm (inertia maintains rotation)` : "Not spinning — would fall over without inertia", cx - 180, 30, spin ? GREEN : RED, 13);
      txt(ctx, "Rotational Inertia: spinning top resists change in rotation axis", 10, c.height - 10, GRAY, 11);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [spin]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={320} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <button onClick={() => { setSpin(true); speedRef.current = 0.15; }}>Spin!</button>
        <button onClick={() => setSpin(false)}>Stop spin</button>
        <span style={{ color: GRAY }}>Spinning top's inertia keeps it upright — without spin, gravity makes it fall</span>
      </div>
    </div>
  );
}

/* ─── 11. Water in Swinging Bucket ─────────────────── */
export function Sim_water_swinging_bucket() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const angleRef = useRef(0);
  const [speed, setSpeed] = useState(3);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    function loop() {
      angleRef.current += 0.04 * speed;
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      const pivotX = 290; const pivotY = 60; const L = 130;
      const bx = pivotX + L * Math.sin(angleRef.current);
      const by = pivotY + L * Math.cos(angleRef.current);
      const isTop = by < pivotY;
      /* rope */
      ctx.strokeStyle = "#D4D4D8"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(pivotX, pivotY); ctx.lineTo(bx, by); ctx.stroke();
      /* pivot */
      ctx.fillStyle = GRAY; ctx.beginPath(); ctx.arc(pivotX, pivotY, 7, 0, Math.PI * 2); ctx.fill();
      /* bucket */
      const bucketAngle = angleRef.current;
      ctx.save(); ctx.translate(bx, by); ctx.rotate(bucketAngle + Math.PI);
      ctx.fillStyle = "#374151"; ctx.strokeStyle = GRAY; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(18, 0); ctx.lineTo(14, 35); ctx.lineTo(-14, 35); ctx.closePath(); ctx.fill(); ctx.stroke();
      /* water inside bucket */
      const centrifugal = speed * speed * 0.5;
      const waterH = Math.min(30, 10 + centrifugal);
      ctx.fillStyle = "rgba(59,130,246,0.6)";
      ctx.fillRect(-14, 35 - waterH, 28, waterH);
      /* water drops when slow and at top */
      if (isTop && speed < 2) {
        ctx.fillStyle = "#3B82F6";
        ctx.beginPath(); ctx.arc(0, -10, 5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
      /* centripetal arrow */
      arrow(ctx, bx, by, pivotX + (bx - pivotX) * 0.4 + (pivotX - bx) * 0.6, pivotY + (by - pivotY) * 0.4 + (pivotY - by) * 0.6, RED, "Fc");
      txt(ctx, speed >= 3 ? "Fast enough! Centripetal force > weight → water stays in!" : "Too slow! Water falls out at top!", 10, 30, speed >= 3 ? GREEN : RED, 13);
      txt(ctx, "Water's inertia wants to go straight → centripetal force keeps it in", 10, 52, WHITE, 12);
      txt(ctx, `v = ${speed} → ${isTop ? (speed >= 3 ? "stays" : "falls") : "not at top yet"}`, 10, c.height - 10, GRAY, 11);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speed]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={330} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Swing speed: {speed}<input type="range" min={1} max={6} step={0.5} value={speed} onChange={e => setSpeed(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 12. Inertia Mass Comparison ────────────────── */
export function Sim_inertia_mass_compare() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const [pushing, setPushing] = useState(false);
  const objsRef = useRef([{ x: 80, v: 0, m: 1 }, { x: 80, v: 0, m: 5 }, { x: 80, v: 0, m: 10 }]);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const F = 20;
    function loop() {
      if (pushing) {
        objsRef.current = objsRef.current.map(o => {
          const a = F / o.m;
          const nv = Math.min(o.v + a * 0.015, 20);
          return { ...o, v: nv, x: Math.min(o.x + nv * 0.5, c.width - 40) };
        });
      }
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      const colors = [GREEN, BLUE, RED]; const labels = ["1 kg", "5 kg", "10 kg"];
      const ys = [80, 160, 240];
      objsRef.current.forEach((o, i) => {
        /* track */
        ctx.fillStyle = "rgba(255,255,255,0.05)"; ctx.fillRect(0, ys[i] - 20, c.width, 40);
        /* object */
        const sz = 20 + o.m * 3;
        ctx.fillStyle = colors[i] + "33"; ctx.strokeStyle = colors[i]; ctx.lineWidth = 2;
        ctx.fillRect(o.x - sz / 2, ys[i] - sz / 2, sz, sz); ctx.strokeRect(o.x - sz / 2, ys[i] - sz / 2, sz, sz);
        ctx.fillStyle = colors[i]; ctx.font = "bold 12px Inter,sans-serif"; ctx.textAlign = "center";
        ctx.fillText(labels[i], o.x, ys[i] + 4); ctx.textAlign = "left";
        if (pushing) arrow(ctx, o.x + sz / 2, ys[i], o.x + sz / 2 + 30, ys[i], AMBER, `F=${F}N`);
        txt(ctx, `a = F/m = ${F}/${o.m} = ${(F / o.m).toFixed(1)} m/s²`, c.width - 200, ys[i] + 4, colors[i], 11);
        txt(ctx, `v = ${o.v.toFixed(1)} m/s`, o.x - 30, ys[i] - 28, WHITE, 10);
      });
      txt(ctx, pushing ? `Same force (${F}N) → Heavier objects accelerate LESS (more inertia)` : "Press PUSH to apply equal force to all three", 10, 30, WHITE, 13);
      txt(ctx, "F = ma → a = F/m: More mass = more inertia = less acceleration", 10, c.height - 10, GRAY, 11);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pushing]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={285} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <button onClick={() => setPushing(p => !p)}>{pushing ? "Stop" : "Apply Force!"}</button>
        <button onClick={() => { objsRef.current = [{ x: 80, v: 0, m: 1 }, { x: 80, v: 0, m: 5 }, { x: 80, v: 0, m: 10 }]; setPushing(false); }}>Reset</button>
      </div>
    </div>
  );
}

/* ─── 13. Train Stopping Distance ─────────────────── */
export function Sim_train_stopping_distance() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [mass, setMass] = useState(50);
  const trainRef = useRef({ x: 50, v: 8, braking: false });
  const stopXRef = useRef(0);
  useEffect(() => {
    trainRef.current = { x: 50, v: 8, braking: false }; stopXRef.current = 0;
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const mu = 0.05; const g = 9.8;
    function loop() {
      const t = trainRef.current;
      if (t.braking) {
        const a = mu * g;
        t.v = Math.max(0, t.v - a * 0.02);
        t.x += t.v * 0.5;
        if (t.v < 0.01 && stopXRef.current === 0) stopXRef.current = t.x;
      } else {
        t.x += t.v * 0.5;
      }
      if (t.x > c.width - 20) { t.x = 50; t.v = 8; t.braking = false; stopXRef.current = 0; }
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      /* tracks */
      [220, 240].forEach(y => {
        ctx.strokeStyle = "#4B5563"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(c.width, y); ctx.stroke();
      });
      /* sleepers */
      ctx.strokeStyle = "#374151"; ctx.lineWidth = 4;
      for (let i = 0; i < 20; i++) { ctx.beginPath(); ctx.moveTo(i * 32 - (t.x * 0.2 % 32), 215); ctx.lineTo(i * 32 - (t.x * 0.2 % 32), 245); ctx.stroke(); }
      /* train */
      ctx.fillStyle = "#1E3A5F"; ctx.strokeStyle = BLUE; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(t.x, 160, 120 + mass * 0.8, 55, [8, 8, 0, 0]); ctx.fill(); ctx.stroke();
      [t.x + 20, t.x + mass * 0.8 + 100].forEach(wx => {
        ctx.fillStyle = "#0F172A"; ctx.strokeStyle = GRAY; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(wx, 240, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      });
      /* chimneys */
      ctx.fillStyle = "#374151"; ctx.fillRect(t.x + 15, 145, 10, 18); ctx.fillRect(t.x + 35, 145, 10, 18);
      /* smoke */
      if (!t.braking) {
        [0, 1, 2].forEach(i => {
          const sa = (Date.now() / 500 + i * 0.5) % 3;
          ctx.fillStyle = `rgba(148,163,184,${0.4 - sa * 0.12})`;
          ctx.beginPath(); ctx.arc(t.x + 20 + i * 5, 145 - sa * 20, 4 + sa * 3, 0, Math.PI * 2); ctx.fill();
        });
      }
      txt(ctx, `${mass} tonne train | v=${t.v.toFixed(1)} m/s`, t.x, 175, WHITE, 11);
      if (t.braking) {
        arrow(ctx, t.x, 200, t.x - 40, 200, RED, "Brakes");
      }
      /* stopping distance marker */
      const estStop = t.x + (t.v * t.v) / (2 * mu * g) * 0.5;
      if (t.braking && estStop < c.width) {
        ctx.strokeStyle = AMBER; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
        ctx.beginPath(); ctx.moveTo(estStop, 155); ctx.lineTo(estStop, 255); ctx.stroke(); ctx.setLineDash([]);
        txt(ctx, "stop", estStop - 15, 150, AMBER, 10);
      }
      txt(ctx, `Stopping distance ≈ v²/(2μg) = ${t.v.toFixed(1)}²/(2×${mu}×${g}) = ${((t.v * t.v) / (2 * mu * g)).toFixed(0)}m`, 10, 30, WHITE, 12);
      txt(ctx, t.braking ? "Braking... Heavy trains take very long to stop (large inertia)!" : "Press BRAKE to stop. Heavy mass = huge inertia!", 10, 52, t.braking ? AMBER : GREEN, 12);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mass]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={285} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <button onClick={() => { trainRef.current.braking = true; }}>Apply Brakes!</button>
        <button onClick={() => { trainRef.current = { x: 50, v: 8, braking: false }; stopXRef.current = 0; }}>Reset</button>
        <label>Train mass: {mass}t<input type="range" min={10} max={200} step={10} value={mass} onChange={e => setMass(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 14. Pendulum Swing (Inertia) ───────────────── */
export function Sim_pendulum_inertia() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const stateRef = useRef({ angle: 0.8, omega: 0 });
  const [damping, setDamping] = useState(0.002);
  const trailRef = useRef<{ x: number; y: number }[]>([]);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    stateRef.current = { angle: 0.8, omega: 0 }; trailRef.current = [];
    const L = 140; const pivX = 290; const pivY = 50;
    function loop() {
      const s = stateRef.current;
      s.omega += (-9.8 / L) * Math.sin(s.angle) * 0.016;
      s.omega *= (1 - damping);
      s.angle += s.omega;
      const bx = pivX + L * Math.sin(s.angle);
      const by = pivY + L * Math.cos(s.angle);
      trailRef.current.push({ x: bx, y: by });
      if (trailRef.current.length > 80) trailRef.current.shift();
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#1F2937"; ctx.fillRect(0, 0, c.width, 20);
      /* trail */
      if (trailRef.current.length > 2) {
        ctx.strokeStyle = "rgba(59,130,246,0.25)"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(trailRef.current[0].x, trailRef.current[0].y);
        trailRef.current.forEach(p => ctx.lineTo(p.x, p.y)); ctx.stroke();
      }
      /* string */
      ctx.strokeStyle = "#D4D4D8"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(pivX, pivY); ctx.lineTo(bx, by); ctx.stroke();
      ctx.fillStyle = "#374151"; ctx.beginPath(); ctx.arc(pivX, pivY, 6, 0, Math.PI * 2); ctx.fill();
      /* bob */
      ctx.fillStyle = "#1E40AF"; ctx.strokeStyle = BLUE; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(bx, by, 20, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      /* forces */
      arrow(ctx, bx, by, bx, by + 40, AMBER, "W");
      const T = 9.8 * Math.cos(s.angle);
      arrow(ctx, bx, by, pivX + (bx - pivX) * (1 - T / 9.8) * 0.5, pivY + (by - pivY) * (1 - T / 9.8) * 0.5, GREEN, "T");
      txt(ctx, `Angle: ${(s.angle * 180 / Math.PI).toFixed(1)}° | ω: ${s.omega.toFixed(3)} rad/s`, 10, 35, WHITE, 12);
      txt(ctx, damping < 0.005 ? "Near-frictionless: inertia keeps pendulum swinging!" : "Damped: energy lost to air resistance", 10, 55, damping < 0.005 ? GREEN : AMBER, 12);
      txt(ctx, "Pendulum: inertia carries bob past equilibrium each swing", 10, c.height - 10, GRAY, 11);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [damping]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={310} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Air damping: {damping.toFixed(3)}<input type="range" min={0.001} max={0.05} step={0.001} value={damping} onChange={e => setDamping(+e.target.value)} /></label>
        <button onClick={() => { stateRef.current = { angle: 0.8, omega: 0 }; trailRef.current = []; }}>Reset</button>
      </div>
    </div>
  );
}

/* ─── 15. Galileo's Inclined Plane Experiment ────── */
export function Sim_galileo_incline_2() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [angle, setAngle] = useState(15);
  const ballRef = useRef({ s: 0, v: 0 });
  useEffect(() => {
    ballRef.current = { s: 0, v: 0 };
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const L = 480;
    function loop() {
      const a = 9.8 * Math.sin(angle * Math.PI / 180);
      ballRef.current.v += a * 0.008;
      ballRef.current.s += ballRef.current.v * 0.008;
      if (ballRef.current.s > L) { ballRef.current.s = 0; ballRef.current.v = 0; }
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      const rad = angle * Math.PI / 180;
      const startX = 60; const startY = 270;
      const endX = startX + L * Math.cos(rad); const endY = startY - L * Math.sin(rad);
      /* ramp */
      ctx.fillStyle = "#78350F"; ctx.strokeStyle = "#D97706"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(endX, endY); ctx.lineTo(endX, startY); ctx.closePath(); ctx.fill(); ctx.stroke();
      /* ball on ramp */
      const bx = startX + ballRef.current.s * Math.cos(rad);
      const by = startY - ballRef.current.s * Math.sin(rad);
      ctx.fillStyle = "#DC2626"; ctx.strokeStyle = "#FCA5A5"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(bx, by - 14, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      /* force components */
      const g = 9.8;
      arrow(ctx, bx, by - 14, bx, by - 14 + g * 3, AMBER, `W=${g * 1}N`);
      arrow(ctx, bx, by - 14, bx + g * Math.sin(rad) * 3 * Math.cos(rad), by - 14 - g * Math.sin(rad) * 3 * Math.sin(rad), RED, `F_∥`);
      /* angle label */
      ctx.strokeStyle = BLUE; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(startX, startY, 35, -rad, 0); ctx.stroke();
      txt(ctx, `${angle}°`, startX + 38, startY - 8, BLUE, 12);
      /* readouts */
      txt(ctx, `a = g·sin(${angle}°) = ${(9.8 * Math.sin(rad)).toFixed(2)} m/s²`, 10, 30, WHITE, 13);
      txt(ctx, `v = ${ballRef.current.v.toFixed(2)} m/s | s = ${ballRef.current.s.toFixed(1)} m`, 10, 52, AMBER, 12);
      txt(ctx, "Galileo proved: acceleration on ramp is constant (regardless of mass)", 10, c.height - 10, GRAY, 11);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [angle]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={300} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Incline angle: {angle}°<input type="range" min={5} max={60} value={angle} onChange={e => setAngle(+e.target.value)} /></label>
      </div>
    </div>
  );
}
