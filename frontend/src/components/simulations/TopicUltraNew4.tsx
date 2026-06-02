/**
 * FILE: TopicUltraNew4.tsx
 * PURPOSE: 6 ultra-professional canvas-based physics simulations for
 *          Topic 4 — Newton's Third Law (CBSE Class 9, Chapter 9)
 *
 * SIMULATIONS:
 *   Ultra4_CannonRecoil      — Cannon ball + cannon recoil with equal/opposite forces
 *   Ultra4_RocketThrust      — Rocket propulsion with exhaust & thrust gauge
 *   Ultra4_SkaterWallPush    — Skater pushes wall; wall pushes back
 *   Ultra4_CollisionPairs    — Two balls collide — action/reaction forces shown
 *   Ultra4_SwimmerWall       — Swimmer pushes wall, moves away
 *   Ultra4_BoatJump          — Person jumping from boat; boat recoils
 *
 * LAST UPDATED: 2026-06-02
 */
"use client";
import { useRef, useEffect, useState } from "react";

const P = {
  bg: "#06101e", panel: "#0c1929", border: "#1a3050",
  blue: "#2563eb", blueHi: "#3b82f6", green: "#22c55e", red: "#ef4444",
  amber: "#f59e0b", purple: "#a78bfa", cyan: "#06b6d4",
  text: "#e2e8f0", dim: "#94a3b8", faint: "#334155",
};
const W = "100%"; const H = 340;

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r); ctx.closePath();
}
function arrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, col: string, lw = 2.5, label = "") {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
  if (len < 4) return;
  const ang = Math.atan2(dy, dx), hw = Math.min(12, len * 0.35);
  ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - hw * Math.cos(ang - 0.45), y2 - hw * Math.sin(ang - 0.45));
  ctx.lineTo(x2 - hw * Math.cos(ang + 0.45), y2 - hw * Math.sin(ang + 0.45));
  ctx.closePath(); ctx.fill();
  if (label) {
    ctx.font = "bold 10px Inter,system-ui,sans-serif"; ctx.fillStyle = col;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const nx = -Math.sin(ang) * 13, ny = Math.cos(ang) * 13;
    ctx.fillText(label, mx + nx, my + ny);
  }
  ctx.restore();
}
function txt(ctx: CanvasRenderingContext2D, s: string, x: number, y: number,
             col = P.text, size = 12, align: CanvasTextAlign = "left", bold = false) {
  ctx.save(); ctx.font = `${bold ? "bold " : ""}${size}px Inter,system-ui,sans-serif`;
  ctx.fillStyle = col; ctx.textAlign = align; ctx.textBaseline = "middle";
  ctx.fillText(s, x, y); ctx.restore();
}
function grid(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save(); ctx.strokeStyle = "rgba(99,102,241,0.05)"; ctx.lineWidth = 1;
  for (let x = 40; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 40; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  ctx.restore();
}

/* ═══════════════════════════════════════════════════
 * SIMULATION 1 — Cannon Ball + Recoil
 * ═══════════════════════════════════════════════════ */
export function Ultra4_CannonRecoil() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [cannonMass, setCannonMass] = useState(200);
  const [ballMass, setBallMass] = useState(5);
  const [fired, setFired] = useState(false);
  const raf = useRef(0);
  const ballX = useRef(300);
  const cannonX = useRef(300);
  const ballVel = useRef(0);
  const cannonVel = useRef(0);
  const smoke = useRef<Array<{x: number, y: number, r: number, alpha: number}>>([]);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CW = c.width, CH = c.height;
    if (!fired) { ballX.current = CW / 2; cannonX.current = CW / 2; ballVel.current = 0; cannonVel.current = 0; smoke.current = []; }
    else {
      /* Momentum conservation: m1*v1 + m2*v2 = 0 */
      ballVel.current = 60;
      cannonVel.current = -(ballMass * 60) / cannonMass;
    }

    function draw() {
      if (fired) {
        ballX.current += ballVel.current * 0.05;
        cannonX.current += cannonVel.current * 0.05;
        smoke.current = smoke.current.map(s => ({ ...s, r: s.r + 0.4, alpha: s.alpha - 0.015, x: s.x + (Math.random() - 0.5) })).filter(s => s.alpha > 0);
        for (let i = 0; i < 2; i++) smoke.current.push({ x: ballX.current - 20, y: CH * 0.45, r: 4 + Math.random() * 4, alpha: 0.5 });
      }

      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, CW, CH);
      grid(ctx, CW, CH);

      /* Ground */
      ctx.fillStyle = "#1e3050"; ctx.fillRect(0, CH * 0.62, CW, CH);

      /* Smoke */
      smoke.current.forEach(s => {
        ctx.fillStyle = `rgba(200,200,200,${s.alpha})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      });

      /* Cannon */
      const cx = cannonX.current, cy = CH * 0.5;
      ctx.fillStyle = "#374151";
      rr(ctx, cx - 60, cy - 15, 80, 30, 8); ctx.fill();
      ctx.fillStyle = "#4b5563"; ctx.fillRect(cx + 10, cy - 8, 50, 16);
      /* Wheels */
      [-40, 40].forEach(dx => {
        ctx.fillStyle = "#1f2937"; ctx.beginPath(); ctx.arc(cx + dx - 20, cy + 18, 16, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#6b7280"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx + dx - 20, cy + 18, 10, 0, Math.PI * 2); ctx.stroke();
      });

      /* Cannon ball */
      const bx = ballX.current, by = CH * 0.45;
      ctx.fillStyle = "#1f2937";
      ctx.beginPath(); ctx.arc(bx, by, 10, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#4b5563"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(bx, by, 10, 0, Math.PI * 2); ctx.stroke();

      /* Force arrows when fired */
      if (fired) {
        const scale = 1.5;
        const ballF = ballMass * Math.abs(ballVel.current) * scale;
        const cannonF = cannonMass * Math.abs(cannonVel.current) * scale;
        arrow(ctx, bx - 14, by, bx - 14 - Math.min(120, ballF * 0.03), by, P.red, 2.5, `F on ball`);
        arrow(ctx, cx - 60, cy, cx - 60 + Math.min(120, cannonF * 0.008), cy, P.green, 2.5, `Recoil`);

        txt(ctx, `Ball: v = ${ballVel.current.toFixed(0)} m/s →`, CW - 16, CH - 60, P.red, 11, "right", true);
        txt(ctx, `Cannon: v = ${cannonVel.current.toFixed(2)} m/s ←`, CW - 16, CH - 44, P.green, 11, "right", true);
        txt(ctx, `m₁v₁ + m₂v₂ = ${(ballMass * ballVel.current + cannonMass * cannonVel.current).toFixed(1)} (≈0)`, CW - 16, CH - 28, P.amber, 10, "right");
      }

      txt(ctx, "Cannon Recoil — Newton's 3rd Law", 16, 22, P.blueHi, 13, "left", true);
      txt(ctx, `Ball: ${ballMass}kg  |  Cannon: ${cannonMass}kg  |  Momentum conserved!`, CW / 2, 22, P.dim, 10, "center");
      if (!fired) txt(ctx, "Press FIRE to see action-reaction!", CW / 2, CH / 2 + 60, P.amber, 12, "center");

      raf.current = requestAnimationFrame(draw);
    }
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [fired, ballMass, cannonMass]);

  return (
    <div style={{ background: P.bg, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden", fontFamily: "Inter,system-ui,sans-serif" }}>
      <canvas ref={ref} width={640} height={H} style={{ width: W, height: "auto", display: "block" }} />
      <div style={{ padding: "14px 20px", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", background: P.panel, borderTop: `1px solid ${P.border}` }}>
        <button onClick={() => setFired(f => !f)} style={{ padding: "8px 20px", borderRadius: 8, border: `1px solid ${P.red}`, background: fired ? P.red + "33" : "transparent", color: fired ? P.red : P.blueHi, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          {fired ? "↩ Reset" : "🔥 FIRE!"}
        </button>
        {[{ label: "Ball mass (kg)", val: ballMass, set: setBallMass, col: P.red, min: 1, max: 20 },
          { label: "Cannon mass (kg)", val: cannonMass, set: setCannonMass, col: P.green, min: 50, max: 500, step: 10 }]
          .map(({ label, val, set, col, min, max, step = 1 }) => (
            <label key={label} style={{ flex: 1, minWidth: 140 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: P.dim }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: col }}>{val}</span>
              </div>
              <input type="range" min={min} max={max} step={step} value={val}
                onChange={e => { set(+e.target.value); setFired(false); }}
                style={{ width: "100%", accentColor: col }} />
            </label>
          ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
 * SIMULATION 2 — Rocket Propulsion (3rd Law)
 * ═══════════════════════════════════════════════════ */
export function Ultra4_RocketThrust() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [exVel, setExVel] = useState(300);
  const [massRate, setMassRate] = useState(2);
  const posY = useRef(290);
  const velY = useRef(0);
  const raf = useRef(0);
  const parts = useRef<Array<{x: number, y: number, vy: number, vx: number, life: number, col: string}>>([]);
  const t = useRef(0);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CW = c.width, CH = c.height;
    posY.current = CH - 60; velY.current = 0; parts.current = []; t.current = 0;

    function draw() {
      t.current += 0.016;
      const thrust = exVel * massRate;
      const rocketMass = Math.max(50, 300 - massRate * t.current * 2);
      const a = thrust / rocketMass - 9.8;
      velY.current -= a * 0.016;
      posY.current += velY.current;
      if (posY.current < 20) { posY.current = CH - 60; velY.current = 0; t.current = 0; parts.current = []; }

      /* Exhaust particles */
      const rx = CW / 2;
      for (let i = 0; i < 4; i++) {
        const colors = ["#f97316", "#ef4444", "#fbbf24", "#fff7ed"];
        parts.current.push({
          x: rx + (Math.random() - 0.5) * 18,
          y: posY.current + 55,
          vy: 2 + Math.random() * 5,
          vx: (Math.random() - 0.5) * 2,
          life: 1,
          col: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      parts.current = parts.current.map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.2, life: p.life - 0.05 })).filter(p => p.life > 0);

      ctx.clearRect(0, 0, CW, CH);
      const skyGrad = ctx.createLinearGradient(0, 0, 0, CH);
      skyGrad.addColorStop(0, "#020818"); skyGrad.addColorStop(1, "#0c1929");
      ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, CW, CH);
      grid(ctx, CW, CH);

      /* Stars */
      for (let i = 0; i < 30; i++) {
        const sx = ((i * 127) % CW), sy = ((i * 73) % (CH * 0.7));
        const brightness = 0.3 + (Math.sin(t.current + i) + 1) * 0.2;
        ctx.fillStyle = `rgba(255,255,255,${brightness})`;
        ctx.beginPath(); ctx.arc(sx, sy, 1, 0, Math.PI * 2); ctx.fill();
      }

      /* Exhaust */
      parts.current.forEach(p => {
        ctx.globalAlpha = p.life * 0.7;
        ctx.fillStyle = p.col;
        ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;

      /* Rocket */
      const ry = posY.current;
      ctx.fillStyle = P.blue; rr(ctx, rx - 14, ry, 28, 55, 6); ctx.fill();
      ctx.strokeStyle = P.blueHi; ctx.lineWidth = 1.5; rr(ctx, rx - 14, ry, 28, 55, 6); ctx.stroke();
      ctx.fillStyle = P.red; ctx.beginPath(); ctx.moveTo(rx - 14, ry); ctx.lineTo(rx, ry - 22); ctx.lineTo(rx + 14, ry); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#1d4ed8";
      ctx.beginPath(); ctx.moveTo(rx - 14, ry + 38); ctx.lineTo(rx - 28, ry + 55); ctx.lineTo(rx - 14, ry + 50); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(rx + 14, ry + 38); ctx.lineTo(rx + 28, ry + 55); ctx.lineTo(rx + 14, ry + 50); ctx.closePath(); ctx.fill();

      /* Thrust arrow (action on gas) */
      arrow(ctx, rx + 35, ry + 55, rx + 35, ry + 55 + 60, P.red, 2, "Gas ↓");
      /* Reaction arrow (rocket goes up) */
      arrow(ctx, rx - 35, ry + 28, rx - 35, ry + 28 - 60, P.green, 2.5, "Rocket ↑");

      /* Thrust gauge */
      const gx = 30, gy = CH - 120;
      ctx.fillStyle = P.panel; rr(ctx, gx, gy, 140, 100, 8); ctx.fill();
      ctx.strokeStyle = P.border; ctx.lineWidth = 1; rr(ctx, gx, gy, 140, 100, 8); ctx.stroke();
      txt(ctx, "THRUST GAUGE", gx + 70, gy + 15, P.dim, 9, "center", true);
      const fillH = Math.min(70, thrust / 15);
      ctx.fillStyle = P.green + "33"; ctx.fillRect(gx + 20, gy + 25, 100, 60);
      ctx.fillStyle = a > 0 ? P.green : P.amber;
      ctx.fillRect(gx + 20, gy + 25 + 60 - fillH, 100, fillH);
      txt(ctx, `${thrust.toFixed(0)} N`, gx + 70, gy + 80, "#fff", 12, "center", true);

      txt(ctx, "Rocket Propulsion — Newton's 3rd Law", 16, 22, P.blueHi, 13, "left", true);
      txt(ctx, `T=${thrust}N  a=${a.toFixed(2)}m/s²  v=${Math.abs(velY.current * 60).toFixed(0)} km/h`, CW / 2, 22, P.dim, 10, "center");
      txt(ctx, `Thrust = ṁ × v_exhaust = ${massRate} × ${exVel} = ${thrust} N`, CW / 2, CH - 18, P.amber, 10, "center");

      raf.current = requestAnimationFrame(draw);
    }
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [exVel, massRate]);

  return (
    <div style={{ background: P.bg, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden", fontFamily: "Inter,system-ui,sans-serif" }}>
      <canvas ref={ref} width={640} height={H} style={{ width: W, height: "auto", display: "block" }} />
      <div style={{ padding: "14px 20px", display: "flex", gap: 32, flexWrap: "wrap", background: P.panel, borderTop: `1px solid ${P.border}` }}>
        {[{ label: "Exhaust velocity (m/s)", val: exVel, set: setExVel, col: P.green, min: 100, max: 600, step: 20 },
          { label: "Mass flow rate (kg/s)", val: massRate, set: setMassRate, col: P.amber, min: 0.5, max: 8, step: 0.5 }]
          .map(({ label, val, set, col, min, max, step }) => (
            <label key={label} style={{ flex: 1, minWidth: 180 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: P.dim }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: col }}>{val}</span>
              </div>
              <input type="range" min={min} max={max} step={step} value={val}
                onChange={e => { set(+e.target.value); posY.current = H - 60; velY.current = 0; }}
                style={{ width: "100%", accentColor: col }} />
            </label>
          ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
 * SIMULATION 3 — Skater Pushes Wall
 * ═══════════════════════════════════════════════════ */
export function Ultra4_SkaterWallPush() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [mass, setMass] = useState(60);
  const [pushed, setPushed] = useState(false);
  const raf = useRef(0);
  const skaterX = useRef(300);
  const skaterVel = useRef(0);
  const t = useRef(0);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CW = c.width, CH = c.height;
    if (!pushed) { skaterX.current = CW * 0.65; skaterVel.current = 0; t.current = 0; }
    else { skaterVel.current = -200 / mass; }

    function draw() {
      t.current += 0.016;
      if (pushed) {
        skaterX.current += skaterVel.current * 2.5;
        skaterVel.current *= 0.995;
        if (skaterX.current < 40) { skaterX.current = 40; skaterVel.current = 0; }
      }

      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, CW, CH);
      grid(ctx, CW, CH);

      /* Ice */
      ctx.fillStyle = "#0e2040";
      ctx.fillRect(0, CH * 0.65, CW, CH);
      ctx.strokeStyle = P.cyan + "33"; ctx.lineWidth = 1.5;
      for (let x = 0; x < CW; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, CH * 0.65 + 8); ctx.lineTo(x + 30, CH * 0.65 + 8); ctx.stroke();
      }

      /* Wall */
      const wx = CW * 0.82;
      ctx.fillStyle = "#374151";
      ctx.fillRect(wx, CH * 0.2, 40, CH * 0.5);
      /* Brick pattern */
      ctx.strokeStyle = "#4b5563"; ctx.lineWidth = 1;
      for (let y = CH * 0.2; y < CH * 0.7; y += 20) {
        const offset = Math.floor((y - CH * 0.2) / 20) % 2 === 0 ? 0 : 20;
        for (let bx2 = wx + offset; bx2 < wx + 40; bx2 += 40) {
          ctx.strokeRect(bx2, y, 40, 20);
        }
      }

      /* Skater */
      const sx = skaterX.current, sy = CH * 0.62;
      /* Body */
      ctx.fillStyle = P.blue; ctx.fillRect(sx - 8, sy - 40, 16, 30);
      /* Head */
      ctx.fillStyle = P.amber; ctx.beginPath(); ctx.arc(sx, sy - 44, 10, 0, Math.PI * 2); ctx.fill();
      /* Skates */
      ctx.fillStyle = "#1f2937"; ctx.fillRect(sx - 12, sy - 10, 24, 8);

      /* Force arrows */
      if (pushed) {
        const fMag = Math.abs(mass * skaterVel.current) * 8;
        const clampF = Math.min(100, fMag);
        /* Wall pushed skater left */
        arrow(ctx, sx + 8, sy - 30, sx + 8 - clampF, sy - 30, P.red, 2.5, `Wall→Skater`);
        /* Skater pushes wall right (reaction) — at wall */
        arrow(ctx, wx, CH * 0.45, wx + 60, CH * 0.45, P.green, 2, `Skater→Wall`);
      }

      /* Velocity */
      if (pushed && Math.abs(skaterVel.current) > 0.01) {
        txt(ctx, `v = ${Math.abs(skaterVel.current * 60).toFixed(1)} km/h ←`, sx, sy - 60, P.amber, 11, "center", true);
      }

      txt(ctx, "Skater Pushes Wall — Newton's 3rd Law", 16, 22, P.blueHi, 13, "left", true);
      txt(ctx, `Mass: ${mass} kg  |  Action: skater pushes wall → Reaction: wall pushes skater`, CW / 2, 22, P.dim, 10, "center");
      if (!pushed) txt(ctx, "Press PUSH to see action-reaction!", CW / 2, CH * 0.45, P.amber, 12, "center");

      raf.current = requestAnimationFrame(draw);
    }
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [pushed, mass]);

  return (
    <div style={{ background: P.bg, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden", fontFamily: "Inter,system-ui,sans-serif" }}>
      <canvas ref={ref} width={640} height={H} style={{ width: W, height: "auto", display: "block" }} />
      <div style={{ padding: "14px 20px", display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap", background: P.panel, borderTop: `1px solid ${P.border}` }}>
        <button onClick={() => setPushed(p => !p)} style={{ padding: "8px 20px", borderRadius: 8, border: `1px solid ${pushed ? P.red : P.blueHi}`, background: pushed ? P.red + "22" : P.blue + "33", color: pushed ? P.red : P.blueHi, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          {pushed ? "↩ Reset" : "👐 Push Wall"}
        </button>
        <label style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: P.dim }}>Skater Mass (kg)</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: P.amber }}>{mass} kg</span>
          </div>
          <input type="range" min={30} max={150} value={mass}
            onChange={e => { setMass(+e.target.value); setPushed(false); }}
            style={{ width: "100%", accentColor: P.amber }} />
        </label>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
 * SIMULATION 4 — Two Ball Collision (Action-Reaction)
 * ═══════════════════════════════════════════════════ */
export function Ultra4_CollisionPairs() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [m1, setM1] = useState(3);
  const [m2, setM2] = useState(3);
  const [v1, setV1] = useState(40);
  const raf = useRef(0);
  const b1x = useRef(80);
  const b2x = useRef(520);
  const v1r = useRef(0);
  const v2r = useRef(0);
  const collided = useRef(false);
  const forceTimer = useRef(0);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CW = c.width, CH = c.height;
    b1x.current = 80; b2x.current = CW - 80;
    v1r.current = v1; v2r.current = 0; collided.current = false; forceTimer.current = 0;

    const r1 = Math.sqrt(m1) * 10, r2 = Math.sqrt(m2) * 10;

    function draw() {
      if (!collided.current) {
        b1x.current += v1r.current * 0.04;
        if (b1x.current + r1 >= b2x.current - r2) {
          collided.current = true; forceTimer.current = 20;
          /* Elastic collision: v1' = (m1-m2)*v1/(m1+m2), v2' = 2*m1*v1/(m1+m2) */
          const iv1 = v1r.current, iv2 = v2r.current;
          v1r.current = ((m1 - m2) * iv1 + 2 * m2 * iv2) / (m1 + m2);
          v2r.current = (2 * m1 * iv1 + (m2 - m1) * iv2) / (m1 + m2);
        }
      } else {
        b1x.current += v1r.current * 0.04;
        b2x.current += v2r.current * 0.04;
        if (forceTimer.current > 0) forceTimer.current--;
        if (b2x.current > CW + 80 || b1x.current < -80) {
          b1x.current = 80; b2x.current = CW - 80;
          v1r.current = v1; v2r.current = 0; collided.current = false; forceTimer.current = 0;
        }
      }

      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, CW, CH);
      grid(ctx, CW, CH);

      const gy = CH * 0.6;
      ctx.fillStyle = "#1e3050"; ctx.fillRect(30, gy - 3, CW - 60, 6);

      /* Ball 1 */
      const b1y = gy - r1;
      ctx.fillStyle = P.red + "cc";
      ctx.beginPath(); ctx.arc(b1x.current, b1y, r1, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = P.red; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(b1x.current, b1y, r1, 0, Math.PI * 2); ctx.stroke();
      txt(ctx, `${m1}kg`, b1x.current, b1y, "#fff", 10, "center", true);

      /* Ball 2 */
      const b2y = gy - r2;
      ctx.fillStyle = P.blueHi + "cc";
      ctx.beginPath(); ctx.arc(b2x.current, b2y, r2, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = P.blueHi; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(b2x.current, b2y, r2, 0, Math.PI * 2); ctx.stroke();
      txt(ctx, `${m2}kg`, b2x.current, b2y, "#fff", 10, "center", true);

      /* Velocity arrows */
      if (Math.abs(v1r.current) > 0.5) {
        const l1 = v1r.current > 0 ? 1 : -1;
        arrow(ctx, b1x.current, b1y - r1 - 10, b1x.current + l1 * Math.min(60, Math.abs(v1r.current) * 0.8), b1y - r1 - 10, P.red, 2.5);
        txt(ctx, `${v1r.current.toFixed(1)}m/s`, b1x.current + l1 * 35, b1y - r1 - 22, P.red, 9, "center");
      }
      if (Math.abs(v2r.current) > 0.5) {
        const l2 = v2r.current > 0 ? 1 : -1;
        arrow(ctx, b2x.current, b2y - r2 - 10, b2x.current + l2 * Math.min(60, Math.abs(v2r.current) * 0.8), b2y - r2 - 10, P.blueHi, 2.5);
        txt(ctx, `${v2r.current.toFixed(1)}m/s`, b2x.current + l2 * 35, b2y - r2 - 22, P.blueHi, 9, "center");
      }

      /* Collision force burst */
      if (forceTimer.current > 0) {
        const midX = (b1x.current + b2x.current) / 2;
        const midY = gy - (r1 + r2) / 2;
        const alpha = forceTimer.current / 20;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = P.amber;
        ctx.beginPath(); ctx.arc(midX, midY, 20 - forceTimer.current * 0.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        arrow(ctx, midX, midY, midX - 50, midY, P.red, 2.5, "F on B1");
        arrow(ctx, midX, midY, midX + 50, midY, P.green, 2.5, "F on B2");
      }

      const p_before = (m1 * v1).toFixed(1);
      const p_after = (m1 * v1r.current + m2 * v2r.current).toFixed(1);
      txt(ctx, "Collision — Action-Reaction Forces", 16, 22, P.blueHi, 13, "left", true);
      txt(ctx, `p_before = ${p_before} kg⋅m/s  |  p_after = ${p_after} kg⋅m/s`, CW / 2, CH - 18, P.amber, 10, "center");

      raf.current = requestAnimationFrame(draw);
    }
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [m1, m2, v1]);

  return (
    <div style={{ background: P.bg, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden", fontFamily: "Inter,system-ui,sans-serif" }}>
      <canvas ref={ref} width={640} height={H} style={{ width: W, height: "auto", display: "block" }} />
      <div style={{ padding: "14px 20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px 20px", background: P.panel, borderTop: `1px solid ${P.border}` }}>
        {[{ label: "Ball 1 mass (kg)", val: m1, set: setM1, col: P.red, min: 1, max: 10 },
          { label: "Ball 2 mass (kg)", val: m2, set: setM2, col: P.blueHi, min: 1, max: 10 },
          { label: "Ball 1 speed (m/s)", val: v1, set: setV1, col: P.amber, min: 10, max: 80 }]
          .map(({ label, val, set, col, min, max }) => (
            <label key={label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: P.dim }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: col }}>{val}</span>
              </div>
              <input type="range" min={min} max={max} value={val}
                onChange={e => { set(+e.target.value); b1x.current = 80; b2x.current = 520; collided.current = false; }}
                style={{ width: "100%", accentColor: col }} />
            </label>
          ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
 * SIMULATION 5 — Swimmer Pushes Wall
 * ═══════════════════════════════════════════════════ */
export function Ultra4_SwimmerWall() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [swimMass, setSwimMass] = useState(65);
  const [pushForce, setPushForce] = useState(200);
  const raf = useRef(0);
  const swimX = useRef(500);
  const swimVel = useRef(0);
  const phase = useRef<"ready" | "pushing" | "gliding">("ready");
  const t = useRef(0);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CW = c.width, CH = c.height;
    swimX.current = CW - 80; swimVel.current = 0; phase.current = "ready"; t.current = 0;

    function draw() {
      t.current += 0.016;
      if (phase.current === "pushing" && t.current > 0.08) {
        const impulse = pushForce * 0.08;
        swimVel.current = -impulse / swimMass;
        phase.current = "gliding";
      }
      if (phase.current === "gliding") {
        swimX.current += swimVel.current * 3;
        swimVel.current *= 0.996;
        if (swimX.current < 40) { swimX.current = CW - 80; swimVel.current = 0; phase.current = "ready"; t.current = 0; }
      }

      ctx.clearRect(0, 0, CW, CH);
      /* Water */
      const waterGrad = ctx.createLinearGradient(0, CH * 0.3, 0, CH);
      waterGrad.addColorStop(0, "#0c3460"); waterGrad.addColorStop(1, "#061830");
      ctx.fillStyle = waterGrad; ctx.fillRect(0, CH * 0.3, CW, CH);
      /* Water ripples */
      ctx.strokeStyle = P.cyan + "22"; ctx.lineWidth = 1;
      for (let y = CH * 0.3; y < CH; y += 20) {
        for (let x = 0; x < CW; x += 60) {
          ctx.beginPath(); ctx.arc(x + (y * 7) % 40, y, 15, 0, Math.PI); ctx.stroke();
        }
      }

      /* Pool edge */
      ctx.fillStyle = "#e5e7eb"; ctx.fillRect(CW - 40, CH * 0.25, 40, CH * 0.5);
      ctx.strokeStyle = "#9ca3af"; ctx.lineWidth = 2; ctx.strokeRect(CW - 40, CH * 0.25, 40, CH * 0.5);

      /* Swimmer */
      const sx = swimX.current, sy = CH * 0.5;
      const isGliding = phase.current === "gliding";
      /* Body */
      ctx.fillStyle = P.blue;
      if (isGliding) {
        ctx.fillRect(sx - 30, sy - 8, 60, 16);
        /* Arms stretched */
        ctx.fillRect(sx - 50, sy - 4, 20, 8);
      } else {
        ctx.fillRect(sx - 20, sy - 10, 40, 20);
      }
      /* Head */
      ctx.fillStyle = P.amber;
      ctx.beginPath(); ctx.arc(isGliding ? sx - 36 : sx, sy - (isGliding ? 0 : 16), 10, 0, Math.PI * 2); ctx.fill();

      /* Force arrows */
      if (phase.current === "pushing") {
        arrow(ctx, sx, sy, sx + 60, sy, P.red, 2.5, `Swimmer→Wall ${pushForce}N`);
        arrow(ctx, CW - 40, sy, CW - 100, sy, P.green, 2.5, `Wall→Swimmer`);
      } else if (phase.current === "gliding") {
        const spd = Math.abs(swimVel.current * 100).toFixed(1);
        arrow(ctx, sx, sy, sx - 50, sy, P.green, 2.5, `v=${spd}cm/s`);
      }

      txt(ctx, "Swimmer Pushes Pool Wall — 3rd Law", 16, 22, P.blueHi, 13, "left", true);
      txt(ctx, `Push force: ${pushForce} N  |  Mass: ${swimMass} kg  |  v = F×t/m`, CW / 2, 22, P.dim, 10, "center");
      const vel_after = (pushForce * 0.08 / swimMass).toFixed(2);
      txt(ctx, `Expected v = ${vel_after} m/s  (using impulse-momentum theorem)`, CW / 2, CH - 18, P.amber, 10, "center");

      if (phase.current === "ready") txt(ctx, "Press PUSH OFF →", CW / 2, CH * 0.5, P.amber + "aa", 12, "center");

      raf.current = requestAnimationFrame(draw);
    }
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [swimMass, pushForce, phase.current]);

  return (
    <div style={{ background: P.bg, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden", fontFamily: "Inter,system-ui,sans-serif" }}>
      <canvas ref={ref} width={640} height={H} style={{ width: W, height: "auto", display: "block" }} />
      <div style={{ padding: "14px 20px", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", background: P.panel, borderTop: `1px solid ${P.border}` }}>
        <button onClick={() => { phase.current = "pushing"; t.current = 0; }}
          style={{ padding: "8px 20px", borderRadius: 8, border: `1px solid ${P.blueHi}`, background: P.blue + "33", color: P.blueHi, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          🏊 Push Off!
        </button>
        {[{ label: "Swimmer mass (kg)", val: swimMass, set: setSwimMass, col: P.amber, min: 40, max: 120 },
          { label: "Push force (N)", val: pushForce, set: setPushForce, col: P.green, min: 50, max: 500, step: 10 }]
          .map(({ label, val, set, col, min, max, step = 1 }) => (
            <label key={label} style={{ flex: 1, minWidth: 140 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: P.dim }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: col }}>{val}</span>
              </div>
              <input type="range" min={min} max={max} step={step} value={val}
                onChange={e => { set(+e.target.value); swimX.current = 500; swimVel.current = 0; phase.current = "ready"; }}
                style={{ width: "100%", accentColor: col }} />
            </label>
          ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
 * SIMULATION 6 — Boat Jump (3rd Law)
 * Person jumps forward; boat moves backward
 * ═══════════════════════════════════════════════════ */
export function Ultra4_BoatJump() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [personMass, setPersonMass] = useState(60);
  const [boatMass, setBoatMass] = useState(200);
  const [jumped, setJumped] = useState(false);
  const raf = useRef(0);
  const boatX = useRef(280);
  const personX = useRef(310);
  const personY = useRef(0);
  const boatVel = useRef(0);
  const personVelX = useRef(0);
  const personVelY = useRef(0);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CW = c.width, CH = c.height;

    if (!jumped) { boatX.current = CW / 2 - 30; personX.current = CW / 2; personY.current = CH * 0.55 - 40; boatVel.current = 0; personVelX.current = 0; personVelY.current = 0; }
    else {
      /* momentum conservation: 0 = m_person * v_p + m_boat * v_b */
      const jumpSpeed = 4;
      personVelX.current = jumpSpeed;
      boatVel.current = -(personMass * jumpSpeed) / boatMass;
      personVelY.current = -5;
    }

    function draw() {
      if (jumped) {
        boatX.current += boatVel.current * 0.5;
        personX.current += personVelX.current * 0.5;
        personVelY.current += 0.2;
        personY.current += personVelY.current * 0.5;
        boatVel.current *= 0.998;
        personVelX.current *= 0.998;
      }

      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, CW, CH);
      grid(ctx, CW, CH);

      /* Water */
      const waterY = CH * 0.65;
      const wGrad = ctx.createLinearGradient(0, waterY, 0, CH);
      wGrad.addColorStop(0, "#1e3050"); wGrad.addColorStop(1, "#0a1f35");
      ctx.fillStyle = wGrad; ctx.fillRect(0, waterY, CW, CH);
      ctx.strokeStyle = P.cyan + "33"; ctx.lineWidth = 1;
      for (let x = 0; x < CW; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, waterY + 5); ctx.quadraticCurveTo(x + 20, waterY + 2, x + 40, waterY + 5); ctx.stroke();
      }

      /* Boat */
      const bx = boatX.current, by = waterY - 26;
      ctx.fillStyle = "#854d0e";
      ctx.beginPath(); ctx.moveTo(bx - 60, by); ctx.lineTo(bx + 80, by); ctx.lineTo(bx + 70, by + 26); ctx.lineTo(bx - 50, by + 26); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#b45309"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(bx - 60, by); ctx.lineTo(bx + 80, by); ctx.lineTo(bx + 70, by + 26); ctx.lineTo(bx - 50, by + 26); ctx.closePath(); ctx.stroke();

      /* Person */
      const py2 = waterY - 40 + personY.current;
      ctx.fillStyle = P.blue; ctx.fillRect(personX.current - 7, py2 - 20, 14, 24);
      ctx.fillStyle = P.amber; ctx.beginPath(); ctx.arc(personX.current, py2 - 24, 10, 0, Math.PI * 2); ctx.fill();

      /* Velocity arrows */
      if (jumped) {
        if (Math.abs(boatVel.current) > 0.01)
          arrow(ctx, bx, by + 13, bx + boatVel.current * 20, by + 13, P.red, 2.5, `${(boatVel.current).toFixed(2)}m/s`);
        if (Math.abs(personVelX.current) > 0.01)
          arrow(ctx, personX.current, py2 - 14, personX.current + personVelX.current * 8, py2 - 14, P.green, 2.5, `${personVelX.current.toFixed(2)}m/s`);
      }

      /* Momentum display */
      const p_boat = (boatMass * boatVel.current).toFixed(1);
      const p_person = (personMass * personVelX.current).toFixed(1);
      const p_total = (boatMass * boatVel.current + personMass * personVelX.current).toFixed(1);

      ctx.fillStyle = P.panel + "ee"; rr(ctx, CW - 200, 40, 185, 80, 8); ctx.fill();
      ctx.strokeStyle = P.border; ctx.lineWidth = 1; rr(ctx, CW - 200, 40, 185, 80, 8); ctx.stroke();
      txt(ctx, `p_boat = ${p_boat} kg⋅m/s`, CW - 110, 57, P.red, 10, "center");
      txt(ctx, `p_person = ${p_person} kg⋅m/s`, CW - 110, 73, P.green, 10, "center");
      txt(ctx, `p_total = ${p_total} kg⋅m/s`, CW - 110, 89, P.amber, 11, "center", true);
      txt(ctx, "≈ 0 (conserved!)", CW - 110, 106, P.dim, 9, "center");

      txt(ctx, "Person Jumps from Boat — Newton's 3rd Law", 16, 22, P.blueHi, 13, "left", true);
      txt(ctx, `Person: ${personMass}kg  Boat: ${boatMass}kg  |  Total momentum = 0`, CW / 2, CH - 18, P.amber, 10, "center");
      if (!jumped) txt(ctx, "Press JUMP to see action-reaction!", CW / 2, waterY - 60, P.amber + "99", 12, "center");

      raf.current = requestAnimationFrame(draw);
    }
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [jumped, personMass, boatMass]);

  return (
    <div style={{ background: P.bg, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden", fontFamily: "Inter,system-ui,sans-serif" }}>
      <canvas ref={ref} width={640} height={H} style={{ width: W, height: "auto", display: "block" }} />
      <div style={{ padding: "14px 20px", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", background: P.panel, borderTop: `1px solid ${P.border}` }}>
        <button onClick={() => setJumped(j => !j)} style={{ padding: "8px 20px", borderRadius: 8, border: `1px solid ${jumped ? P.red : P.blueHi}`, background: jumped ? P.red + "22" : P.blue + "33", color: jumped ? P.red : P.blueHi, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          {jumped ? "↩ Reset" : "🚤 JUMP!"}
        </button>
        {[{ label: "Person mass (kg)", val: personMass, set: setPersonMass, col: P.green, min: 30, max: 100 },
          { label: "Boat mass (kg)", val: boatMass, set: setBoatMass, col: P.amber, min: 50, max: 500, step: 10 }]
          .map(({ label, val, set, col, min, max, step = 1 }) => (
            <label key={label} style={{ flex: 1, minWidth: 140 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: P.dim }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: col }}>{val}</span>
              </div>
              <input type="range" min={min} max={max} step={step} value={val}
                onChange={e => { set(+e.target.value); setJumped(false); }}
                style={{ width: "100%", accentColor: col }} />
            </label>
          ))}
      </div>
    </div>
  );
}
