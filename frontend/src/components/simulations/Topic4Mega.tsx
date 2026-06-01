/**
 * FILE: Topic4Mega.tsx
 * PURPOSE: 15 professional physics simulations for Topic 4 —
 *          Newton's Third Law of Motion (Action-Reaction Pairs) — Class 9 CBSE.
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

function arr(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, c: string, l = "", w = 2.5) {
  if (Math.hypot(x2 - x1, y2 - y1) < 1) return;
  ctx.save(); ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = w;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  const a = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath(); ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 10 * Math.cos(a - 0.4), y2 - 10 * Math.sin(a - 0.4));
  ctx.lineTo(x2 - 10 * Math.cos(a + 0.4), y2 - 10 * Math.sin(a + 0.4));
  ctx.closePath(); ctx.fill();
  if (l) { ctx.font = "bold 11px Inter,sans-serif"; ctx.fillText(l, x2 + 5, y2 + 4); }
  ctx.restore();
}
function txt(ctx: CanvasRenderingContext2D, t: string, x: number, y: number, c = WHITE, s = 12) {
  ctx.save(); ctx.font = `${s}px Inter,sans-serif`; ctx.fillStyle = c; ctx.fillText(t, x, y); ctx.restore();
}

/* ─── 1. Balloon Jet Propulsion ───────────────── */
export function Sim_balloon_jet() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [size, setSize] = useState(50);
  const ballRef = useRef({ x: 80, v: 0, inflated: size });
  const [flying, setFlying] = useState(false);
  useEffect(() => {
    ballRef.current = { x: 80, v: 0, inflated: size };
    const c = ref.current!; const ctx = c.getContext("2d")!;
    function loop() {
      const b = ballRef.current;
      if (flying && b.inflated > 0) {
        const thrust = size * 0.15; b.inflated = Math.max(0, b.inflated - 0.5);
        b.v += thrust * 0.015; b.x += b.v * 0.6;
      }
      if (b.x > c.width + 50) { b.x = 80; b.v = 0; b.inflated = size; setFlying(false); }
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      /* string to ceiling */
      if (!flying) { ctx.strokeStyle = GRAY; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(80, 0); ctx.lineTo(80, 130); ctx.stroke(); }
      const rw = 8 + b.inflated * 0.8; const rh = 5 + b.inflated * 0.5;
      /* balloon */
      ctx.fillStyle = "#DC2626"; ctx.strokeStyle = "#FCA5A5"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(b.x, 120, rw, rh, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      /* air exhaust */
      if (flying && b.inflated > 0) {
        const airScale = b.inflated / size;
        ctx.fillStyle = "rgba(147,197,253,0.4)";
        [0, 5, -5].forEach(dy => {
          ctx.beginPath(); ctx.arc(b.x - rw - 10 - Math.random() * 20, 120 + dy, 4 + Math.random() * 3, 0, Math.PI * 2); ctx.fill();
        });
        arr(ctx, b.x - rw, 120, b.x - rw - 40, 120, BLUE, "air out→", 2);
        arr(ctx, b.x, 120, b.x + 40, 120, RED, "←thrust", 2);
      }
      /* size indicator */
      ctx.fillStyle = GREEN + "20"; ctx.strokeStyle = GREEN; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(b.x, 120, rw, rh, 0, 0, Math.PI * 2); ctx.stroke();
      txt(ctx, `Balloon size: ${b.inflated.toFixed(0)}% full`, 10, 30, WHITE, 13);
      txt(ctx, `Thrust ∝ air expelled | Reaction → balloon goes forward`, 10, 52, GREEN, 12);
      txt(ctx, "Action: air goes LEFT | Reaction: balloon goes RIGHT", 10, c.height - 10, GRAY, 11);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [flying, size]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={220} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Balloon size: {size}%<input type="range" min={20} max={100} value={size} onChange={e => setSize(+e.target.value)} /></label>
        <button onClick={() => setFlying(true)}>Release!</button>
        <button onClick={() => { ballRef.current = { x: 80, v: 0, inflated: size }; setFlying(false); }}>Reset</button>
      </div>
    </div>
  );
}

/* ─── 2. Jumping Off a Boat ───────────────────── */
export function Sim_jump_off_boat() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [mass, setMass] = useState(60);
  const [jumped, setJumped] = useState(false);
  const persRef = useRef({ x: 290, v: 0 }); const boatRef = useRef({ x: 290, v: 0 });
  useEffect(() => {
    persRef.current = { x: 290, v: 0 }; boatRef.current = { x: 290, v: 0 };
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const boatMass = 200;
    function loop() {
      if (jumped) {
        const jumpV = 3; /* person jumps right at this speed */
        const boatV = -(mass * jumpV) / boatMass; /* conservation */
        persRef.current.v = jumpV; boatRef.current.v = boatV;
        persRef.current.x += persRef.current.v * 0.5;
        boatRef.current.x += boatRef.current.v * 0.5;
      }
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      /* water */
      ctx.fillStyle = "rgba(59,130,246,0.2)"; ctx.fillRect(0, 200, c.width, 100);
      ctx.strokeStyle = "rgba(147,197,253,0.4)"; ctx.lineWidth = 1.5;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath(); ctx.moveTo(20 + i * 110, 210); ctx.bezierCurveTo(50 + i * 110, 204, 70 + i * 110, 216, 100 + i * 110, 210); ctx.stroke();
      }
      /* boat */
      const bx = boatRef.current.x;
      ctx.fillStyle = "#78350F"; ctx.strokeStyle = "#D97706"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(bx - 80, 200); ctx.lineTo(bx + 80, 200); ctx.lineTo(bx + 60, 230); ctx.lineTo(bx - 60, 230); ctx.closePath(); ctx.fill(); ctx.stroke();
      /* person on shore/air */
      const px = persRef.current.x;
      ctx.strokeStyle = WHITE; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(px, 165, 12, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, 177); ctx.lineTo(px, 200); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, 185); ctx.lineTo(px - 12, 200); ctx.moveTo(px, 185); ctx.lineTo(px + 12, 200); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, 200); ctx.lineTo(px - 8, 218); ctx.moveTo(px, 200); ctx.lineTo(px + 8, 218); ctx.stroke();
      /* arrows */
      if (jumped) {
        arr(ctx, px, 177, px + 50, 177, GREEN, `Person: +${(persRef.current.v).toFixed(1)}m/s`, 3);
        arr(ctx, bx, 195, bx - 50, 195, RED, `Boat: ${boatRef.current.v.toFixed(2)}m/s`, 3);
        txt(ctx, `m₁v₁ + m₂v₂ = ${(mass * persRef.current.v + boatMass * boatRef.current.v).toFixed(1)} kg·m/s (≈0)`, 10, 30, GREEN, 12);
      }
      txt(ctx, jumped ? `Person (${mass}kg) pushes right → Boat (${boatMass}kg) goes left!` : "Press JUMP to see Newton's 3rd Law", 10, jumped ? 12 : 40, jumped ? WHITE : GRAY, 13);
      txt(ctx, "Action: person pushes boat back | Reaction: boat pushes person forward", 10, c.height - 10, GRAY, 11);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [jumped, mass]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={290} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <button onClick={() => { setJumped(true); persRef.current = { x: 290, v: 0 }; boatRef.current = { x: 290, v: 0 }; }}>Jump!</button>
        <button onClick={() => { setJumped(false); persRef.current = { x: 290, v: 0 }; boatRef.current = { x: 290, v: 0 }; }}>Reset</button>
        <label>Person mass: {mass}kg<input type="range" min={30} max={120} value={mass} onChange={e => setMass(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 3. Bat Ball Force Pairs ─────────────────── */
export function Sim_bat_ball_force_pairs() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [F, setF] = useState(500);
  const phaseRef = useRef<"pre" | "contact" | "post">("pre");
  const timeRef = useRef(0);
  useEffect(() => {
    phaseRef.current = "pre"; timeRef.current = 0;
    const c = ref.current!; const ctx = c.getContext("2d")!;
    function loop() {
      timeRef.current++;
      const t = timeRef.current;
      if (t > 180) { phaseRef.current = "pre"; timeRef.current = 0; }
      else if (t > 60) { phaseRef.current = "post"; }
      else if (t > 30) { phaseRef.current = "contact"; }
      const ph = phaseRef.current;
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      /* bat */
      const batX = ph === "contact" ? 280 : ph === "post" ? 310 : 200;
      ctx.fillStyle = "#78350F"; ctx.strokeStyle = "#D97706"; ctx.lineWidth = 2;
      ctx.fillRect(batX, 150, 15, 90); ctx.strokeRect(batX, 150, 15, 90);
      ctx.fillRect(batX + 2, 240, 6, 40);
      /* ball */
      const ballX = ph === "pre" ? 380 : ph === "contact" ? 295 : 295 + (t - 60) * 3;
      ctx.fillStyle = "#DC2626"; ctx.strokeStyle = "#FCA5A5"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(ballX, 195, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      /* force arrows on contact */
      if (ph === "contact") {
        arr(ctx, batX + 15, 195, batX + 15 + Math.min(F / 8, 80), 195, RED, `${F}N→ (on ball)`, 3);
        arr(ctx, batX, 195, batX - Math.min(F / 8, 80), 195, BLUE, `←${F}N (on bat)`, 3);
        txt(ctx, "CONTACT! Equal and opposite forces", 80, 50, WHITE, 14);
      } else if (ph === "post") {
        const ballV = F * 0.05 / 0.16;
        arr(ctx, ballX, 195, ballX + 60, 195, GREEN, `v≈${ballV.toFixed(0)}m/s`);
        txt(ctx, `Ball hit at ~${ballV.toFixed(0)} m/s away`, 80, 50, GREEN, 13);
      } else {
        arr(ctx, ballX, 195, ballX - 40, 195, AMBER, "incoming");
      }
      txt(ctx, `F_bat_on_ball = F_ball_on_bat = ${F} N (Newton's 3rd)`, 10, 30, PURPLE, 12);
      txt(ctx, ph === "contact" ? "Forces are equal in magnitude, opposite in direction" : "Both forces exist ONLY during contact", 10, c.height - 10, GRAY, 11);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [F]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={260} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Bat force: {F}N<input type="range" min={100} max={1500} step={100} value={F} onChange={e => setF(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 4. Earth–Apple Action-Reaction ─────────── */
export function Sim_earth_apple_pair() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [appleM, setAppleM] = useState(0.2);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    let appleY = 60;
    function loop() {
      appleY += 1.5; if (appleY > 220) appleY = 60;
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      const earthR = 60; const earthCX = 290; const earthCY = 300;
      /* Earth */
      const eg = ctx.createRadialGradient(earthCX, earthCY, 0, earthCX, earthCY, earthR);
      eg.addColorStop(0, "#166534"); eg.addColorStop(0.6, "#1D4ED8"); eg.addColorStop(1, "#1e3a5f");
      ctx.fillStyle = eg; ctx.beginPath(); ctx.arc(earthCX, earthCY, earthR, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = BLUE; ctx.lineWidth = 2; ctx.stroke();
      txt(ctx, "Earth", earthCX - 18, earthCY + 8, WHITE, 12);
      /* Apple */
      ctx.fillStyle = "#16A34A"; ctx.strokeStyle = GREEN; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(earthCX, appleY, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      /* Apple to leaf */
      ctx.fillStyle = "#15803D"; ctx.beginPath(); ctx.moveTo(earthCX, appleY - 18); ctx.bezierCurveTo(earthCX + 20, appleY - 40, earthCX + 30, appleY - 30, earthCX + 15, appleY - 20); ctx.fill();
      const F = appleM * 9.8;
      const earthA = F / (6e24); /* Earth's acceleration is TINY */
      /* Force on apple (gravity DOWN) */
      arr(ctx, earthCX, appleY + 18, earthCX, appleY + 18 + F * 30, AMBER, `W=${F.toFixed(2)}N ↓`);
      /* Force on Earth from apple (UP) */
      arr(ctx, earthCX, earthCY - earthR, earthCX, earthCY - earthR - F * 30, RED, `${F.toFixed(2)}N ↑`, 2);
      txt(ctx, `Apple mass = ${appleM}kg | g = 9.8 m/s²`, 10, 30, WHITE, 13);
      txt(ctx, `Earth pulls apple: ${F.toFixed(2)} N ↓`, 10, 52, AMBER, 12);
      txt(ctx, `Apple pulls Earth: ${F.toFixed(2)} N ↑ (same magnitude!)`, 10, 74, RED, 12);
      txt(ctx, `Earth acceleration = ${(F / 6e24).toExponential(2)} m/s² (immeasurably tiny)`, 10, 96, GREEN, 11);
      txt(ctx, "Newton's 3rd: Every force has an equal and opposite reaction", 10, c.height - 10, GRAY, 11);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [appleM]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={320} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Apple mass: {appleM}kg<input type="range" min={0.05} max={2} step={0.05} value={appleM} onChange={e => setAppleM(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 5. Walking Action-Reaction ──────────────── */
export function Sim_walking_action_reaction() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [walking, setWalking] = useState(true);
  const posRef = useRef({ x: 100, step: 0 });
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    function loop() {
      if (walking) { posRef.current.step += 0.08; posRef.current.x += 1.2; }
      if (posRef.current.x > c.width + 20) posRef.current.x = -20;
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      /* ground */
      ctx.fillStyle = "#1F2937"; ctx.fillRect(0, 230, c.width, 50);
      ctx.strokeStyle = "#374151"; ctx.lineWidth = 1;
      for (let i = 0; i < 15; i++) { ctx.beginPath(); ctx.moveTo(i * 40 - posRef.current.x % 40, 230); ctx.lineTo(i * 40 - posRef.current.x % 40, 240); ctx.stroke(); }
      const px = posRef.current.x; const st = posRef.current.step;
      const lLegAngle = Math.sin(st) * 0.5; const rLegAngle = -Math.sin(st) * 0.5;
      /* person */
      ctx.strokeStyle = WHITE; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(px, 155, 18, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, 173); ctx.lineTo(px, 205); ctx.stroke();
      /* arms */
      ctx.beginPath(); ctx.moveTo(px, 185); ctx.lineTo(px - 18 * Math.cos(lLegAngle), 205); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, 185); ctx.lineTo(px + 18 * Math.cos(lLegAngle), 205); ctx.stroke();
      /* legs */
      const lFootX = px - 15 * Math.sin(lLegAngle); const lKneeX = px - 8 * Math.sin(lLegAngle);
      const rFootX = px - 15 * Math.sin(rLegAngle); const rKneeX = px - 8 * Math.sin(rLegAngle);
      ctx.beginPath(); ctx.moveTo(px, 205); ctx.lineTo(lKneeX, 218); ctx.lineTo(lFootX, 230); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, 205); ctx.lineTo(rKneeX, 218); ctx.lineTo(rFootX, 230); ctx.stroke();
      /* force arrows at foot */
      const footY = 228;
      if (walking) {
        arr(ctx, lFootX, footY, lFootX - 25, footY - 15, RED, "Push back");
        arr(ctx, lFootX, footY, lFootX + 30, footY, GREEN, "Ground reaction →");
      }
      /* ground pushes person */
      txt(ctx, "Action: Foot pushes ground BACKWARD and DOWN", 10, 30, RED, 12);
      txt(ctx, "Reaction: Ground pushes foot FORWARD and UP → person walks!", 10, 52, GREEN, 12);
      txt(ctx, "Without Newton's 3rd Law, you could not walk!", 10, 74, AMBER, 12);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [walking]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={280} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <button onClick={() => setWalking(w => !w)}>{walking ? "Stop" : "Walk"}</button>
      </div>
    </div>
  );
}

/* ─── 6. Spring Between Wall and Block ─────────── */
export function Sim_spring_wall_block() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [compress, setCompress] = useState(0.3);
  const blockRef = useRef({ x: 300, v: 0, released: false });
  useEffect(() => {
    blockRef.current = { x: 300, v: 0, released: false };
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const k = 200; const wallX = 50; const naturalL = 150;
    function loop() {
      const b = blockRef.current;
      if (b.released) {
        const ext = b.x - (wallX + naturalL);
        const Fs = -k * ext;
        b.v += (Fs / 5) * 0.016; b.x += b.v * 0.5; b.v *= 0.998;
        if (b.x < wallX + naturalL - 60) { b.v *= -0.9; b.x = wallX + naturalL - 60; }
        if (b.x > wallX + naturalL + 80) { b.v *= -0.8; }
      } else {
        b.x = wallX + naturalL - compress * 100;
      }
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      /* wall */
      ctx.fillStyle = "#374151"; ctx.strokeStyle = GRAY; ctx.lineWidth = 2;
      ctx.fillRect(0, 100, wallX, 160); ctx.strokeRect(0, 100, wallX, 160);
      /* hash marks */
      ctx.strokeStyle = "#6B7280"; ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) ctx.beginPath(), ctx.moveTo(wallX, 115 + i * 18), ctx.lineTo(wallX - 20, 130 + i * 18), ctx.stroke();
      /* spring coils */
      const coilCount = 10; const springL = b.x - wallX - 40;
      ctx.strokeStyle = "#60A5FA"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(wallX, 180);
      for (let i = 0; i <= coilCount; i++) { ctx.lineTo(wallX + i * springL / coilCount + (i % 2 === 0 ? 0 : 14), 180 + (i % 2 === 0 ? 0 : 14)); }
      ctx.stroke();
      /* block */
      ctx.fillStyle = "#1E40AF"; ctx.strokeStyle = BLUE; ctx.lineWidth = 2;
      ctx.fillRect(b.x, 150, 50, 60); ctx.strokeRect(b.x, 150, 50, 60);
      txt(ctx, "5kg", b.x + 8, 185, WHITE, 12);
      const ext = (b.x - (wallX + naturalL)) / 100;
      const F = Math.abs(k * ext).toFixed(1);
      if (!b.released) {
        arr(ctx, b.x + 25, 150, b.x + 25, 100, RED, `F=${F}N (wall←)`, 2);
        arr(ctx, wallX, 160, wallX + 40, 160, BLUE, `F=${F}N (→block)`, 2);
      } else if (Math.abs(b.v) > 0.5) {
        arr(ctx, b.x + 25, 150, b.x + 25 + Math.sign(b.v) * 40, 150, GREEN, `v=${b.v.toFixed(1)}m/s`);
      }
      txt(ctx, !b.released ? `Spring compressed ${(compress * 100).toFixed(0)}mm — stores ${(0.5 * k * ext * ext).toFixed(2)}J` : `Released! Spring pushes block with ${F}N`, 10, 30, WHITE, 13);
      txt(ctx, "Action: block pushes spring | Reaction: spring pushes block back", 10, c.height - 10, GRAY, 11);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [compress]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={270} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Compression: {(compress * 100).toFixed(0)}mm<input type="range" min={0.1} max={0.8} step={0.05} value={compress} onChange={e => { setCompress(+e.target.value); blockRef.current.released = false; blockRef.current.v = 0; }} /></label>
        <button onClick={() => { blockRef.current.released = true; }}>Release!</button>
        <button onClick={() => { blockRef.current = { x: 300, v: 0, released: false }; }}>Reset</button>
      </div>
    </div>
  );
}

/* ─── 7. Rowing Boat — Water Reaction ──────────── */
export function Sim_rowing_water_reaction() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [rowing, setRowing] = useState(false);
  const boatRef = useRef({ x: 290, v: 0 }); const oarAngleRef = useRef(Math.PI / 4);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    function loop() {
      oarAngleRef.current += rowing ? 0.04 : 0.01;
      const stroke = Math.sin(oarAngleRef.current);
      if (rowing && stroke < 0 && boatRef.current.v < 5) { boatRef.current.v += 0.08; }
      boatRef.current.v *= 0.99; boatRef.current.x += boatRef.current.v * 0.4;
      if (boatRef.current.x > c.width + 50) boatRef.current.x = -50;
      if (boatRef.current.x < -50) boatRef.current.x = c.width + 50;
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      /* water */
      ctx.fillStyle = "rgba(59,130,246,0.15)"; ctx.fillRect(0, 190, c.width, 100);
      ctx.strokeStyle = "rgba(147,197,253,0.3)"; ctx.lineWidth = 1.5;
      for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(20 + i * 100 + (Date.now() / 2000) % 100, 200); ctx.bezierCurveTo(50 + i * 100, 194, 70 + i * 100, 206, 100 + i * 100, 200); ctx.stroke(); }
      const bx = boatRef.current.x;
      /* boat hull */
      ctx.fillStyle = "#78350F"; ctx.strokeStyle = "#D97706"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(bx - 90, 195); ctx.lineTo(bx + 90, 195); ctx.lineTo(bx + 70, 220); ctx.lineTo(bx - 70, 220); ctx.closePath(); ctx.fill(); ctx.stroke();
      /* rower */
      ctx.strokeStyle = WHITE; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(bx, 165, 12, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(bx, 177); ctx.lineTo(bx, 195); ctx.stroke();
      /* oar */
      const oa = oarAngleRef.current;
      const oarLen = 70; const oarPivotX = bx - 10;
      const oarEndX = oarPivotX + oarLen * Math.cos(oa);
      const oarEndY = 185 + oarLen * 0.5 * Math.sin(oa);
      ctx.strokeStyle = "#D97706"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(oarPivotX, 185); ctx.lineTo(oarEndX, oarEndY); ctx.stroke();
      /* water splash at blade */
      if (rowing && Math.sin(oa) < 0) {
        ctx.fillStyle = "rgba(147,197,253,0.5)";
        ctx.beginPath(); ctx.arc(oarEndX, oarEndY, 10, 0, Math.PI * 2); ctx.fill();
        arr(ctx, oarEndX, oarEndY, oarEndX - 30, oarEndY, BLUE, "water ←");
        arr(ctx, bx - 90, 207, bx - 90 + Math.min(boatRef.current.v * 25, 60), 207, GREEN, "boat →");
      }
      txt(ctx, "Action: Oar pushes water BACKWARD", 10, 30, RED, 12);
      txt(ctx, "Reaction: Water pushes oar (and boat) FORWARD", 10, 52, GREEN, 12);
      txt(ctx, `v = ${boatRef.current.v.toFixed(2)} m/s`, 10, 74, AMBER, 12);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [rowing]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={280} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <button onClick={() => setRowing(r => !r)}>{rowing ? "Stop Rowing" : "Row!"}</button>
      </div>
    </div>
  );
}

/* ─── 8. Bird Flight — Wing Action ───────────── */
export function Sim_bird_flight() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [flapping, setFlapping] = useState(true);
  const birdRef = useRef({ x: 80, y: 160, vy: 0, wingAngle: 0 });
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    function loop() {
      const b = birdRef.current;
      b.wingAngle += flapping ? 0.15 : 0;
      const lift = flapping ? Math.max(0, -Math.sin(b.wingAngle)) * 15 : 0;
      const g = 4;
      b.vy += g * 0.016 - lift * 0.08; b.y += b.vy * 0.3; b.x += 1.5;
      if (b.y < 20) b.vy = 0.5; if (b.y > c.height - 30) b.vy = -1;
      if (b.x > c.width + 20) b.x = -20;
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      /* sky clouds */
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      [{ x: 100, y: 50 }, { x: 350, y: 80 }, { x: 500, y: 40 }].forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, 30, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(p.x + 25, p.y, 20, 0, Math.PI * 2); ctx.fill();
      });
      const bx = b.x; const by = b.y;
      const wa = b.wingAngle;
      /* wings */
      const wFlap = Math.sin(wa) * 30;
      ctx.fillStyle = "#374151"; ctx.strokeStyle = GRAY; ctx.lineWidth = 1.5;
      /* left wing */
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.bezierCurveTo(bx - 30, by + wFlap - 20, bx - 60, by + wFlap - 10, bx - 55, by + wFlap); ctx.lineTo(bx, by + 5); ctx.closePath(); ctx.fill(); ctx.stroke();
      /* right wing (opposite phase) */
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.bezierCurveTo(bx + 30, by + wFlap - 20, bx + 60, by + wFlap - 10, bx + 55, by + wFlap); ctx.lineTo(bx, by + 5); ctx.closePath(); ctx.fill(); ctx.stroke();
      /* body */
      ctx.fillStyle = "#94A3B8"; ctx.strokeStyle = WHITE; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.ellipse(bx, by, 18, 10, 0.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      /* head */
      ctx.fillStyle = "#94A3B8"; ctx.beginPath(); ctx.arc(bx + 18, by - 4, 8, 0, Math.PI * 2); ctx.fill();
      /* beak */
      ctx.fillStyle = AMBER; ctx.beginPath(); ctx.moveTo(bx + 26, by - 4); ctx.lineTo(bx + 35, by - 6); ctx.lineTo(bx + 26, by - 1); ctx.closePath(); ctx.fill();
      /* force arrows */
      if (flapping && Math.sin(wa) < 0) {
        arr(ctx, bx, by, bx, by + 25, RED, "push air↓");
        arr(ctx, bx, by, bx, by - 30, GREEN, "lift↑");
      }
      arr(ctx, bx, by, bx, by + 18, AMBER, "W", 1.5);
      txt(ctx, flapping ? "Wings push air DOWN → air lifts bird UP (Newton's 3rd!)" : "Not flapping → falls (gravity wins)", 10, 30, flapping ? GREEN : RED, 13);
      txt(ctx, `y=${by.toFixed(0)} | vy=${b.vy.toFixed(2)} m/s`, 10, 52, WHITE, 11);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [flapping]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={280} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <button onClick={() => setFlapping(f => !f)}>{flapping ? "Stop Flapping" : "Flap Wings!"}</button>
      </div>
    </div>
  );
}

/* ─── 9. Jet Engine Thrust ────────────────────── */
export function Sim_jet_engine_thrust() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [throttle, setThrottle] = useState(50);
  const planeRef = useRef({ x: 50, v: 0 });
  useEffect(() => {
    planeRef.current = { x: 50, v: 0 };
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const F = throttle * 2;
    function loop() {
      planeRef.current.v += (F / 500) * 0.03;
      planeRef.current.v = Math.min(planeRef.current.v, 8);
      planeRef.current.x += planeRef.current.v;
      if (planeRef.current.x > c.width + 100) { planeRef.current.x = 50; planeRef.current.v = 0; }
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      /* sky */
      const grad = ctx.createLinearGradient(0, 0, 0, c.height);
      grad.addColorStop(0, "#0c1a3a"); grad.addColorStop(1, "#1e3a5f");
      ctx.fillStyle = grad; ctx.fillRect(0, 0, c.width, c.height);
      /* clouds */
      ctx.fillStyle = "rgba(255,255,255,0.07)";
      [80, 300, 500].forEach(cx => { ctx.beginPath(); ctx.arc(cx, 60, 35, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(cx + 28, 55, 22, 0, Math.PI * 2); ctx.fill(); });
      const px = planeRef.current.x; const py = 160;
      /* exhaust (action) */
      for (let i = 0; i < 5; i++) {
        const exhaust = throttle / 100;
        ctx.fillStyle = `rgba(251,191,36,${exhaust * (0.5 - i * 0.08)})`;
        ctx.beginPath(); ctx.arc(px - 10 - i * 15, py, 5 + exhaust * 4 - i * 0.5, 0, Math.PI * 2); ctx.fill();
      }
      /* plane fuselage */
      ctx.fillStyle = "#94A3B8"; ctx.strokeStyle = GRAY; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(px + 90, py); ctx.lineTo(px + 20, py - 12); ctx.lineTo(px, py - 8); ctx.lineTo(px, py + 8); ctx.lineTo(px + 20, py + 12); ctx.closePath(); ctx.fill(); ctx.stroke();
      /* wings */
      ctx.fillStyle = "#64748B";
      ctx.beginPath(); ctx.moveTo(px + 40, py); ctx.lineTo(px + 20, py - 35); ctx.lineTo(px + 10, py - 35); ctx.lineTo(px + 25, py); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(px + 40, py); ctx.lineTo(px + 20, py + 35); ctx.lineTo(px + 10, py + 35); ctx.lineTo(px + 25, py); ctx.closePath(); ctx.fill();
      /* engine nacelles */
      ctx.fillStyle = "#374151"; ctx.strokeStyle = GRAY; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(px + 18, py - 20, 18, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(px + 18, py + 20, 18, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      /* thrust arrow */
      arr(ctx, px + 90, py, px + 90 + Math.min(F, 100), py, GREEN, `Thrust=${F}N →`, 3);
      /* exhaust arrow */
      arr(ctx, px, py, px - Math.min(F, 80), py, RED, `← exhaust`, 2);
      txt(ctx, `Throttle: ${throttle}% | Thrust: ${F}N`, 10, 30, WHITE, 13);
      txt(ctx, `Action: hot gas expelled backward at high speed`, 10, 52, RED, 12);
      txt(ctx, `Reaction: equal force pushes plane FORWARD`, 10, 74, GREEN, 12);
      txt(ctx, `v = ${planeRef.current.v.toFixed(1)} m/s`, 10, 96, AMBER, 12);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [throttle]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={300} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Throttle: {throttle}%<input type="range" min={0} max={100} value={throttle} onChange={e => setThrottle(+e.target.value)} /></label>
        <button onClick={() => { planeRef.current = { x: 50, v: 0 }; }}>Reset</button>
      </div>
    </div>
  );
}

/* ─── 10. Horse-Cart Force Pairs ────────────────── */
export function Sim_horse_cart_pairs() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [pulling, setPulling] = useState(false);
  const posRef = useRef(0);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    let v = 0;
    function loop() {
      if (pulling) { v = Math.min(v + 0.03, 3); posRef.current += v * 0.4; }
      else { v *= 0.96; posRef.current += v * 0.4; }
      if (posRef.current > c.width + 100) posRef.current = -100;
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      /* ground */
      ctx.fillStyle = "#1F2937"; ctx.fillRect(0, 230, c.width, 50);
      ctx.strokeStyle = "#374151"; ctx.lineWidth = 1;
      for (let i = 0; i < 20; i++) { ctx.beginPath(); ctx.moveTo((i * 35 - posRef.current) % c.width, 230); ctx.lineTo((i * 35 - posRef.current + 15) % c.width, 230); ctx.stroke(); }
      const ox = 160 - posRef.current % c.width + (posRef.current > c.width ? c.width : 0);
      /* cart */
      ctx.fillStyle = "#78350F"; ctx.strokeStyle = "#D97706"; ctx.lineWidth = 2;
      ctx.fillRect(ox + 120, 170, 120, 60); ctx.strokeRect(ox + 120, 170, 120, 60);
      [ox + 145, ox + 215].forEach(wx => {
        ctx.fillStyle = "#0F172A"; ctx.strokeStyle = GRAY; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(wx, 230, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      });
      /* harness rope */
      ctx.strokeStyle = "#D97706"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(ox + 120, 200); ctx.lineTo(ox + 95, 200); ctx.stroke();
      /* horse body */
      ctx.fillStyle = "#92400E"; ctx.strokeStyle = "#D97706"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(ox + 60, 200, 40, 25, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      /* horse head */
      ctx.fillStyle = "#92400E"; ctx.strokeStyle = "#D97706"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.ellipse(ox + 100, 188, 18, 12, 0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      /* legs */
      ctx.strokeStyle = "#78350F"; ctx.lineWidth = 3;
      const legO = Math.sin(posRef.current / 15) * 8;
      [ox + 30, ox + 50, ox + 70, ox + 90].forEach((lx, i) => {
        const lo = i % 2 === 0 ? legO : -legO;
        ctx.beginPath(); ctx.moveTo(lx, 220); ctx.lineTo(lx + lo, 230); ctx.stroke();
      });
      /* force arrows */
      if (pulling) {
        arr(ctx, ox + 95, 195, ox + 130, 195, GREEN, `→ H pulls C`, 2);
        arr(ctx, ox + 120, 205, ox + 90, 205, RED, `C pulls H ←`, 2);
      }
      txt(ctx, pulling ? "Action: Horse pulls cart FORWARD | Reaction: cart pulls horse BACKWARD" : "Press PULL to see force pairs", 10, 30, pulling ? WHITE : GRAY, 12);
      txt(ctx, pulling ? "Both forces are equal & opposite — but different objects!" : "Newton's 3rd Law applies to DIFFERENT objects", 10, 52, pulling ? GREEN : GRAY, 12);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pulling]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={285} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <button onClick={() => setPulling(p => !p)}>{pulling ? "Stop" : "Pull!"}</button>
      </div>
    </div>
  );
}

/* ─── 11. Magnetic Force Pairs ─────────────────── */
export function Sim_magnetic_force_pairs() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [config, setConfig] = useState<"attract" | "repel">("attract");
  const m1Ref = useRef({ x: 180, v: 0 }); const m2Ref = useRef({ x: 400, v: 0 });
  useEffect(() => {
    m1Ref.current = { x: 180, v: 0 }; m2Ref.current = { x: 400, v: 0 };
    const c = ref.current!; const ctx = c.getContext("2d")!;
    function loop() {
      const dist = m2Ref.current.x - m1Ref.current.x;
      const F = 2000 / (dist * dist);
      const dir = config === "attract" ? 1 : -1;
      m1Ref.current.v += dir * F * 0.008; m1Ref.current.x += m1Ref.current.v;
      m2Ref.current.v -= dir * F * 0.008; m2Ref.current.x += m2Ref.current.v;
      /* boundary */
      if (Math.abs(m2Ref.current.x - m1Ref.current.x) < 60 || m1Ref.current.x < 30 || m2Ref.current.x > c.width - 30) {
        m1Ref.current = { x: 180, v: 0 }; m2Ref.current = { x: 400, v: 0 };
      }
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      const colors1 = config === "attract" ? [RED, BLUE] : [RED, RED];
      const labels1 = config === "attract" ? ["N", "S"] : ["N", "N"];
      [[m1Ref.current.x, 155, colors1[0]], [m2Ref.current.x, 155, colors1[1]]].forEach(([x, y, col], i) => {
        ctx.fillStyle = col as string; ctx.strokeStyle = WHITE; ctx.lineWidth = 2;
        ctx.fillRect((x as number) - 25, (y as number), 50, 60); ctx.strokeRect((x as number) - 25, (y as number), 50, 60);
        ctx.fillStyle = WHITE; ctx.font = "bold 16px Inter,sans-serif"; ctx.textAlign = "center";
        ctx.fillText(labels1[i] as string, x as number, (y as number) + 36); ctx.textAlign = "left";
      });
      /* field lines */
      const d = m2Ref.current.x - m1Ref.current.x;
      ctx.strokeStyle = config === "attract" ? "rgba(99,102,241,0.3)" : "rgba(239,68,68,0.2)"; ctx.lineWidth = 1;
      for (let j = 0; j < 3; j++) {
        const yy = 170 + j * 15;
        ctx.beginPath();
        if (config === "attract") {
          ctx.moveTo(m1Ref.current.x + 25, yy); ctx.bezierCurveTo((m1Ref.current.x + m2Ref.current.x) / 2, yy - 20, (m1Ref.current.x + m2Ref.current.x) / 2, yy - 20, m2Ref.current.x - 25, yy);
        } else {
          ctx.moveTo(m1Ref.current.x + 25, yy); ctx.bezierCurveTo(m1Ref.current.x + 60, yy - 30, m1Ref.current.x + 90, yy - 40, m1Ref.current.x + 120, yy);
        }
        ctx.stroke();
      }
      const Fmag = F.toFixed(2);
      arr(ctx, m1Ref.current.x + 25, 185, m1Ref.current.x + 25 + (config === "attract" ? 40 : -30), 185, config === "attract" ? GREEN : RED, `${Fmag}N`, 2);
      arr(ctx, m2Ref.current.x - 25, 185, m2Ref.current.x - 25 + (config === "attract" ? -40 : 30), 185, config === "attract" ? GREEN : RED, `${Fmag}N`, 2);
      txt(ctx, config === "attract" ? "N→S Attraction: equal forces pull BOTH magnets together" : "N→N Repulsion: equal forces push BOTH magnets apart", 10, 30, WHITE, 13);
      txt(ctx, `F₁₂ = F₂₁ = ${Fmag}N (Newton's 3rd Law — always!)`, 10, 52, GREEN, 12);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [config]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={260} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <button onClick={() => { setConfig("attract"); m1Ref.current = { x: 180, v: 0 }; m2Ref.current = { x: 400, v: 0 }; }}>N→S Attract</button>
        <button onClick={() => { setConfig("repel"); m1Ref.current = { x: 180, v: 0 }; m2Ref.current = { x: 400, v: 0 }; }}>N→N Repel</button>
      </div>
    </div>
  );
}

/* ─── 12. Diving Board Reaction ────────────────── */
export function Sim_diving_board_reaction() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const phaseRef = useRef<"stand" | "dive" | "fall">("stand");
  const diverRef = useRef({ y: 100, vy: 0, boardBend: 0 });
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    function loop() {
      const d = diverRef.current; const ph = phaseRef.current;
      if (ph === "dive") {
        d.boardBend = Math.min(d.boardBend + 2, 40);
        if (d.boardBend >= 40) { phaseRef.current = "fall"; d.vy = -8; }
      } else if (ph === "fall") {
        d.boardBend = Math.max(d.boardBend - 3, 0);
        d.vy += 0.4; d.y += d.vy;
        if (d.y > 320) { phaseRef.current = "stand"; d.y = 100; d.vy = 0; d.boardBend = 0; }
      }
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      /* water */
      ctx.fillStyle = "rgba(59,130,246,0.2)"; ctx.fillRect(100, 250, c.width - 100, 80);
      ctx.strokeStyle = "#93C5FD"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(100, 250); ctx.lineTo(c.width, 250); ctx.stroke();
      /* pool wall */
      ctx.fillStyle = "#374151"; ctx.fillRect(0, 150, 100, 180);
      /* board */
      const boardY = 150;
      ctx.strokeStyle = "#D97706"; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(60, boardY); ctx.bezierCurveTo(200, boardY, 300, boardY + d.boardBend, 400, boardY + d.boardBend * 0.3); ctx.stroke();
      /* diver */
      const diverX = 370; const diverY = d.y;
      ctx.strokeStyle = WHITE; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(diverX, diverY - 30, 12, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(diverX, diverY - 18); ctx.lineTo(diverX, diverY); ctx.stroke();
      if (ph === "fall") {
        ctx.beginPath(); ctx.moveTo(diverX, diverY - 10); ctx.lineTo(diverX - 25, diverY - 20); ctx.moveTo(diverX, diverY - 10); ctx.lineTo(diverX + 25, diverY - 20); ctx.stroke();
      }
      /* force arrows */
      if (ph === "dive") {
        arr(ctx, diverX, diverY, diverX, diverY + 30, AMBER, `push down`);
        arr(ctx, diverX, diverY, diverX, diverY - 40, GREEN, `board pushes up`);
      } else if (ph === "fall") {
        arr(ctx, diverX, diverY - 30, diverX, diverY - 30 + 40, RED, `launched!`);
      }
      txt(ctx, ph === "stand" ? "Diver stands on board. Press JUMP to dive!" :
        ph === "dive" ? "Diver pushes DOWN on board → board pushes UP (3rd law!)" :
        "Board reaction launches diver UP and forward!", 10, 30, WHITE, 12);
      txt(ctx, "Action: diver pushes board down | Reaction: board launches diver up", 10, c.height - 10, GRAY, 11);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={320} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <button onClick={() => { phaseRef.current = "dive"; }}>Jump!</button>
        <button onClick={() => { phaseRef.current = "stand"; diverRef.current = { y: 100, vy: 0, boardBend: 0 }; }}>Reset</button>
      </div>
    </div>
  );
}

/* ─── 13. Propeller Aircraft ──────────────────── */
export function Sim_propeller_thrust() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [speed, setSpeed] = useState(3);
  const planeRef = useRef({ x: 80 });
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    function loop() {
      planeRef.current.x += speed * 0.5;
      if (planeRef.current.x > c.width + 100) planeRef.current.x = -100;
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      const px = planeRef.current.x; const py = 160;
      /* propeller */
      const propAngle = (Date.now() / (1000 / (speed * 5))) % (Math.PI * 2);
      ctx.strokeStyle = "#94A3B8"; ctx.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        const a = propAngle + i * Math.PI * 2 / 3;
        ctx.beginPath(); ctx.moveTo(px + 2, py); ctx.lineTo(px + 2 + 28 * Math.cos(a), py + 28 * Math.sin(a)); ctx.stroke();
      }
      /* fuselage */
      ctx.fillStyle = "#64748B"; ctx.strokeStyle = GRAY; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(px + 80, py); ctx.lineTo(px + 15, py - 10); ctx.lineTo(px + 2, py - 8); ctx.lineTo(px + 2, py + 8); ctx.lineTo(px + 15, py + 10); ctx.closePath(); ctx.fill(); ctx.stroke();
      /* wings */
      ctx.fillStyle = "#475569";
      ctx.beginPath(); ctx.moveTo(px + 35, py - 8); ctx.lineTo(px + 20, py - 38); ctx.lineTo(px + 12, py - 38); ctx.lineTo(px + 22, py - 8); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(px + 35, py + 8); ctx.lineTo(px + 20, py + 38); ctx.lineTo(px + 12, py + 38); ctx.lineTo(px + 22, py + 8); ctx.closePath(); ctx.fill();
      /* air slipstream (action) */
      if (speed > 0) {
        ctx.strokeStyle = "rgba(147,197,253,0.3)"; ctx.lineWidth = 2;
        [-15, 0, 15].forEach(dy => {
          ctx.beginPath(); ctx.moveTo(px - 10, py + dy); ctx.lineTo(px - 60 - speed * 5, py + dy); ctx.stroke();
        });
        arr(ctx, px, py, px - 50 - speed * 5, py, BLUE, `air backward`);
        arr(ctx, px + 80, py, px + 80 + speed * 15, py, GREEN, `thrust forward`);
      }
      txt(ctx, `Propeller speed: ${speed} | Thrust: ${speed * 50}N`, 10, 30, WHITE, 13);
      txt(ctx, "Action: Propeller pushes air BACKWARD", 10, 52, RED, 12);
      txt(ctx, "Reaction: Air pushes plane FORWARD (Newton's 3rd)", 10, 74, GREEN, 12);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speed]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={260} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Propeller speed: {speed}<input type="range" min={0} max={8} value={speed} onChange={e => setSpeed(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 14. Two-Block Spring Release ──────────────── */
export function Sim_two_block_spring() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [m1, setM1] = useState(3); const [m2, setM2] = useState(5);
  const [released, setReleased] = useState(false);
  const stRef = useRef({ x1: 230, x2: 350, v1: 0, v2: 0 });
  useEffect(() => {
    stRef.current = { x1: 230, x2: 350, v1: 0, v2: 0 };
    const c = ref.current!; const ctx = c.getContext("2d")!;
    function loop() {
      if (released) {
        const impulsePerFrame = 0.5;
        stRef.current.v1 -= impulsePerFrame / m1;
        stRef.current.v2 += impulsePerFrame / m2;
        stRef.current.v1 *= 0.995; stRef.current.v2 *= 0.995;
        stRef.current.x1 += stRef.current.v1;
        stRef.current.x2 += stRef.current.v2;
      }
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      /* surface */
      ctx.fillStyle = "#1F2937"; ctx.fillRect(0, 210, c.width, 20);
      /* spring between blocks */
      if (!released) {
        const springCX = (stRef.current.x1 + 50 + stRef.current.x2) / 2;
        ctx.strokeStyle = "#60A5FA"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(stRef.current.x1 + 50, 185);
        for (let i = 0; i <= 8; i++) {
          ctx.lineTo(stRef.current.x1 + 50 + i * (stRef.current.x2 - stRef.current.x1 - 50) / 8, 185 + (i % 2 === 0 ? 0 : 14));
        }
        ctx.stroke();
      }
      /* block 1 */
      ctx.fillStyle = "#1E40AF"; ctx.strokeStyle = BLUE; ctx.lineWidth = 2;
      ctx.fillRect(stRef.current.x1, 165, 50, 45); ctx.strokeRect(stRef.current.x1, 165, 50, 45);
      txt(ctx, `${m1}kg`, stRef.current.x1 + 8, 192, WHITE, 12);
      /* block 2 */
      ctx.fillStyle = "#7F1D1D"; ctx.strokeStyle = RED; ctx.lineWidth = 2;
      ctx.fillRect(stRef.current.x2, 165, 50, 45); ctx.strokeRect(stRef.current.x2, 165, 50, 45);
      txt(ctx, `${m2}kg`, stRef.current.x2 + 8, 192, WHITE, 12);
      if (released) {
        arr(ctx, stRef.current.x1 + 25, 155, stRef.current.x1 + 25 + stRef.current.v1 * 15, 155, BLUE, `v₁=${stRef.current.v1.toFixed(1)}`);
        arr(ctx, stRef.current.x2 + 25, 155, stRef.current.x2 + 25 + stRef.current.v2 * 15, 155, RED, `v₂=${stRef.current.v2.toFixed(1)}`);
      }
      txt(ctx, released ? `m₁v₁+m₂v₂ = ${(m1 * stRef.current.v1 + m2 * stRef.current.v2).toFixed(2)} kg·m/s (≈0)` : "Spring compressed between blocks — press Release!", 10, 30, WHITE, 13);
      txt(ctx, "Action = Reaction → equal impulses, opposite directions", 10, 52, GREEN, 12);
      txt(ctx, `v₁/v₂ = m₂/m₁ = ${m2}/${m1} = ${(m2 / m1).toFixed(2)} (lighter moves faster!)`, 10, 74, AMBER, 12);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [m1, m2, released]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={260} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <button onClick={() => setReleased(true)}>Release Spring!</button>
        <button onClick={() => { stRef.current = { x1: 230, x2: 350, v1: 0, v2: 0 }; setReleased(false); }}>Reset</button>
        <label>m₁: {m1}kg<input type="range" min={1} max={10} value={m1} onChange={e => setM1(+e.target.value)} /></label>
        <label>m₂: {m2}kg<input type="range" min={1} max={10} value={m2} onChange={e => setM2(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 15. Air Cannon Recoil ──────────────────── */
export function Sim_air_cannon_recoil() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [m_ball, setMball] = useState(1); const [v_shot, setVshot] = useState(30);
  const [fired, setFired] = useState(false);
  const stRef = useRef({ ballX: 310, cannonX: 290, ballV: 0, cannonV: 0 });
  useEffect(() => {
    stRef.current = { ballX: 310, cannonX: 290, ballV: 0, cannonV: 0 };
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const m_cannon = 20;
    function loop() {
      if (fired) {
        stRef.current.ballV = Math.min(stRef.current.ballV + 0.5, v_shot);
        stRef.current.cannonV = Math.max(stRef.current.cannonV - (m_ball * v_shot) / (m_cannon * 30), -(m_ball * v_shot) / m_cannon);
      }
      stRef.current.ballX += stRef.current.ballV * 0.3;
      stRef.current.cannonX += stRef.current.cannonV * 0.3;
      if (stRef.current.ballX > c.width + 20 || stRef.current.cannonX < -100) {
        stRef.current = { ballX: 310, cannonX: 290, ballV: 0, cannonV: 0 }; setFired(false);
      }
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      /* surface */
      ctx.fillStyle = "#1F2937"; ctx.fillRect(0, 210, c.width, 30);
      /* cannon */
      const cx = stRef.current.cannonX;
      ctx.fillStyle = "#374151"; ctx.strokeStyle = GRAY; ctx.lineWidth = 2;
      ctx.fillRect(cx, 165, 80, 45); ctx.strokeRect(cx, 165, 80, 45);
      ctx.fillRect(cx + 80, 178, 40, 22); ctx.strokeRect(cx + 80, 178, 40, 22);
      /* wheels */
      [cx + 15, cx + 65].forEach(wx => {
        ctx.fillStyle = "#0F172A"; ctx.strokeStyle = GRAY; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(wx, 210, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      });
      /* ball */
      const bx = stRef.current.ballX;
      ctx.fillStyle = "#1E40AF"; ctx.strokeStyle = BLUE; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(bx, 185, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      if (fired) {
        arr(ctx, bx + 14, 185, bx + 14 + Math.min(stRef.current.ballV * 3, 80), 185, GREEN, `v_ball=${stRef.current.ballV.toFixed(0)}`);
        arr(ctx, cx, 187, cx + stRef.current.cannonV * 8, 187, RED, `v_cannon=${stRef.current.cannonV.toFixed(1)}`);
      }
      const p_ball = m_ball * stRef.current.ballV;
      const p_cannon = m_cannon * stRef.current.cannonV;
      txt(ctx, fired ? `p_ball + p_cannon = ${(p_ball + p_cannon).toFixed(1)} kg·m/s (≈ 0)` : "Press FIRE to launch!", 10, 30, WHITE, 13);
      txt(ctx, `Ball (${m_ball}kg) goes RIGHT | Cannon (${m_cannon}kg) recoils LEFT`, 10, 52, GREEN, 12);
      txt(ctx, `By Newton's 3rd: equal and opposite forces during firing`, 10, 74, AMBER, 12);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [m_ball, v_shot, fired]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={265} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <button onClick={() => setFired(true)}>FIRE!</button>
        <button onClick={() => { stRef.current = { ballX: 310, cannonX: 290, ballV: 0, cannonV: 0 }; setFired(false); }}>Reset</button>
        <label>Ball mass: {m_ball}kg<input type="range" min={0.5} max={5} step={0.5} value={m_ball} onChange={e => setMball(+e.target.value)} /></label>
        <label>Launch speed: {v_shot}m/s<input type="range" min={10} max={80} step={5} value={v_shot} onChange={e => setVshot(+e.target.value)} /></label>
      </div>
    </div>
  );
}
