/**
 * FILE: TopicUltraNew2.tsx
 * PURPOSE: 6 ultra-professional canvas-based physics simulations for
 *          Topic 2 — Newton's First Law / Inertia (CBSE Class 9, Chapter 9)
 *
 * SIMULATIONS:
 *   Ultra2_CoinGlassInertia  — Classic coin-on-card experiment with inertia
 *   Ultra2_SeatbeltCrash     — Crash with/without seatbelt comparison
 *   Ultra2_SpaceCoasting     — Spacecraft coasting with zero friction forever
 *   Ultra2_BusBrake          — Passengers lurch when bus brakes / accelerates
 *   Ultra2_MassInertia       — Mass comparison: heavier = harder to start/stop
 *   Ultra2_GalileoRamp       — Galileo's inclined plane extrapolation to frictionless
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
const W = "100%";
const H = 340;

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r); ctx.closePath();
}
function arrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, col: string, lw = 2.5) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
  if (len < 4) return;
  const ang = Math.atan2(dy, dx), hw = Math.min(12, len * 0.35);
  ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - hw * Math.cos(ang - 0.45), y2 - hw * Math.sin(ang - 0.45));
  ctx.lineTo(x2 - hw * Math.cos(ang + 0.45), y2 - hw * Math.sin(ang + 0.45));
  ctx.closePath(); ctx.fill(); ctx.restore();
}
function txt(ctx: CanvasRenderingContext2D, s: string, x: number, y: number,
             col = P.text, size = 12, align: CanvasTextAlign = "left", bold = false) {
  ctx.save(); ctx.font = `${bold ? "bold " : ""}${size}px Inter,system-ui,sans-serif`;
  ctx.fillStyle = col; ctx.textAlign = align; ctx.textBaseline = "middle";
  ctx.fillText(s, x, y); ctx.restore();
}
function grid(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save(); ctx.strokeStyle = "rgba(99,102,241,0.06)"; ctx.lineWidth = 1;
  for (let x = 40; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 40; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  ctx.restore();
}

/* ═══════════════════════════════════════════════════
 * SIMULATION 1 — Coin on Card (Glass) Inertia Demo
 * ═══════════════════════════════════════════════════ */
export function Ultra2_CoinGlassInertia() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"ready" | "slow" | "fast">("ready");
  const raf = useRef(0);
  const t = useRef(0);
  const coinX = useRef(300);
  const coinFall = useRef(0);
  const cardX = useRef(230);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CW = c.width, CH = c.height;

    coinX.current = CW / 2;
    coinFall.current = 0;
    cardX.current = CW / 2 - 70;

    function draw() {
      t.current += 0.03;
      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, CW, CH);
      grid(ctx, CW, CH);

      /* Glass */
      const gx = CW / 2 - 18, gy = CH * 0.55;
      ctx.strokeStyle = P.cyan + "99"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(gx - 4, gy - 60); ctx.lineTo(gx, gy + 0); ctx.lineTo(gx + 36 + 4, gy + 0); ctx.lineTo(gx + 36, gy - 60); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(gx - 4, gy - 3); ctx.lineTo(gx + 40, gy - 3); ctx.stroke();

      /* Table surface */
      ctx.fillStyle = "#1a3050"; ctx.fillRect(40, gy + 2, CW - 80, 5);

      /* Card */
      if (phase === "ready" || phase === "slow") {
        ctx.fillStyle = "#fef3c7";
        ctx.fillRect(cardX.current, gy - 4, 140, 6);
        ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 1;
        ctx.strokeRect(cardX.current, gy - 4, 140, 6);
      } else {
        /* Card flicked away */
        const cx = cardX.current + t.current * 80;
        if (cx < CW + 80) {
          ctx.fillStyle = "#fef3c7";
          ctx.fillRect(cx, gy - 4, 140, 6);
        }
      }

      /* Coin */
      const coinY = gy - 24 + coinFall.current;
      if (phase === "fast") {
        coinFall.current += 6;
        if (coinFall.current > 30) coinFall.current = 30;
      } else if (phase === "slow") {
        coinX.current += 1.5;
        if (coinX.current > CW - 40) coinX.current = 40;
      }
      ctx.fillStyle = P.amber;
      ctx.beginPath(); ctx.arc(coinX.current, coinY, 14, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(coinX.current, coinY, 14, 0, Math.PI * 2); ctx.stroke();
      txt(ctx, "₹", coinX.current, coinY, "#fff", 13, "center", true);

      /* Label */
      const labels = { ready: "Coin sits on card over glass", slow: "Slow pull → coin moves WITH card", fast: "Fast flick → coin falls INTO glass (Inertia!)" };
      const cols = { ready: P.dim, slow: P.amber, fast: P.green };
      txt(ctx, "Coin-Card-Glass Inertia Experiment", 16, 22, P.blueHi, 13, "left", true);
      txt(ctx, labels[phase], CW / 2, CH - 18, cols[phase], 12, "center", true);

      /* Newton's 1st Law note */
      if (phase === "fast") {
        ctx.fillStyle = P.green + "22"; rr(ctx, CW / 2 - 160, 50, 320, 32, 8); ctx.fill();
        txt(ctx, "Inertia of rest — coin stays while card moves!", CW / 2, 66, P.green, 11, "center", true);
      }
      raf.current = requestAnimationFrame(draw);
    }
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [phase]);

  return (
    <div style={{ background: P.bg, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden", fontFamily: "Inter,system-ui,sans-serif" }}>
      <canvas ref={ref} width={640} height={H} style={{ width: W, height: "auto", display: "block" }} />
      <div style={{ padding: "14px 20px", display: "flex", gap: 10, background: P.panel, borderTop: `1px solid ${P.border}` }}>
        {(["ready", "slow", "fast"] as const).map(m => (
          <button key={m} onClick={() => { setPhase(m); t.current = 0; coinFall.current = 0; coinX.current = 300; cardX.current = 230; }}
            style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: `1px solid ${phase === m ? P.blueHi : P.border}`, background: phase === m ? P.blue + "44" : "transparent", color: phase === m ? P.blueHi : P.dim, fontSize: 12, fontWeight: phase === m ? 700 : 400, cursor: "pointer" }}>
            {m === "ready" ? "Setup" : m === "slow" ? "Slow Pull" : "⚡ Fast Flick"}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
 * SIMULATION 2 — Seatbelt Crash Comparison
 * ═══════════════════════════════════════════════════ */
export function Ultra2_SeatbeltCrash() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(false);
  const raf = useRef(0);
  const t = useRef(0);
  const carVel = useRef(60);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CW = c.width, CH = c.height;
    let carX = 80;
    let crashed = false;
    let wallHit = false;

    function reset() { carX = 80; crashed = false; wallHit = false; carVel.current = 60; t.current = 0; }

    function drawCar(x: number, y: number, crashed: boolean) {
      /* Body */
      ctx.fillStyle = crashed ? "#7f1d1d" : P.blue;
      rr(ctx, x, y + 14, 120, 40, 8); ctx.fill();
      ctx.fillStyle = crashed ? "#991b1b" : "#1d4ed8";
      rr(ctx, x + 20, y, 80, 30, 6); ctx.fill();
      /* Wheels */
      [x + 22, x + 88].forEach(wx => {
        ctx.fillStyle = "#1f2937"; ctx.beginPath(); ctx.arc(wx, y + 56, 14, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#4b5563"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(wx, y + 56, 8, 0, Math.PI * 2); ctx.stroke();
      });
    }

    function draw() {
      t.current++;
      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, CW, CH);
      grid(ctx, CW, CH);

      /* Road */
      ctx.fillStyle = "#1e3050"; ctx.fillRect(0, CH / 2 - 10, CW, 90);
      ctx.strokeStyle = "#fbbf2444"; ctx.lineWidth = 3; ctx.setLineDash([20, 15]);
      ctx.beginPath(); ctx.moveTo(0, CH / 2 + 35); ctx.lineTo(CW, CH / 2 + 35); ctx.stroke();
      ctx.setLineDash([]);

      /* Wall */
      ctx.fillStyle = "#374151";
      ctx.fillRect(CW - 60, CH / 2 - 20, 40, 110);
      ctx.strokeStyle = P.red; ctx.lineWidth = 2;
      ctx.strokeRect(CW - 60, CH / 2 - 20, 40, 110);
      txt(ctx, "WALL", CW - 40, CH / 2 + 35, P.red, 11, "center", true);

      if (running) {
        if (!wallHit) {
          carX += carVel.current * 0.04;
          if (carX + 130 >= CW - 60) { wallHit = true; crashed = true; }
        } else {
          carVel.current *= 0.88;
          if (t.current > 60) { running && setRunning(false); }
        }
      }

      drawCar(carX, CH / 2 - 20, crashed);

      /* Velocity gauge */
      const speed = Math.abs(carVel.current);
      const barW = Math.min(200, speed * 3.2);
      ctx.fillStyle = P.panel; rr(ctx, 20, CH - 50, 220, 22, 5); ctx.fill();
      ctx.strokeStyle = P.border; ctx.lineWidth = 1; rr(ctx, 20, CH - 50, 220, 22, 5); ctx.stroke();
      if (barW > 0) {
        ctx.fillStyle = speed > 30 ? P.red : P.green; rr(ctx, 21, CH - 49, barW, 20, 4); ctx.fill();
      }
      txt(ctx, `Speed: ${speed.toFixed(0)} km/h`, 30, CH - 39, "#fff", 11, "left", true);

      /* Passengers */
      const py = CH / 2 - 4;
      const pOffset = crashed && wallHit ? Math.min(20, (t.current - 20) * 0.5) : 0;

      /* Without seatbelt (top) */
      const p1x = carX + 50 + pOffset, p1y = py - 10;
      ctx.fillStyle = "#f97316";
      ctx.beginPath(); ctx.arc(p1x, p1y - 10, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(p1x - 5, p1y - 2, 10, 16);
      if (pOffset > 10) {
        ctx.fillStyle = P.red + "88"; ctx.beginPath(); ctx.arc(p1x + 5, p1y - 10, 4, 0, Math.PI * 2); ctx.fill();
      }

      /* With seatbelt (bottom) */
      const p2x = carX + 80, p2y = py - 10;
      ctx.fillStyle = "#22c55e";
      ctx.beginPath(); ctx.arc(p2x, p2y - 10, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(p2x - 5, p2y - 2, 10, 16);
      ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(p2x + 5, p2y - 16); ctx.quadraticCurveTo(p2x + 20, p2y + 5, p2x + 5, p2y + 12); ctx.stroke();

      /* Labels */
      if (crashed) {
        txt(ctx, "❌ No seatbelt → continues forward!", CW / 2, 30, P.red, 11, "center", true);
        txt(ctx, "✅ Seatbelt → stays in place safely", CW / 2, 48, P.green, 11, "center", true);
      } else {
        txt(ctx, "Seatbelt Crash Demo — Newton's 1st Law", 16, 22, P.blueHi, 13, "left", true);
        txt(ctx, "Orange=no belt  Green=with belt", CW / 2, 22, P.dim, 11, "center");
      }

      if (running) raf.current = requestAnimationFrame(draw);
    }

    if (running) { reset(); raf.current = requestAnimationFrame(draw); }
    else { /* Draw static initial */ draw(); cancelAnimationFrame(raf.current); }
    return () => cancelAnimationFrame(raf.current);
  }, [running]);

  return (
    <div style={{ background: P.bg, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden", fontFamily: "Inter,system-ui,sans-serif" }}>
      <canvas ref={ref} width={640} height={H} style={{ width: W, height: "auto", display: "block" }} />
      <div style={{ padding: "14px 20px", display: "flex", gap: 16, alignItems: "center", background: P.panel, borderTop: `1px solid ${P.border}` }}>
        <button onClick={() => setRunning(!running)} style={{ padding: "8px 24px", borderRadius: 8, border: `1px solid ${P.blueHi}`, background: running ? P.red + "33" : P.blue + "44", color: running ? P.red : P.blueHi, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          {running ? "⏹ Stop" : "▶ Start Crash"}
        </button>
        <span style={{ fontSize: 11, color: P.dim }}>Objects in motion stay in motion until a force acts — seatbelt provides that force.</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
 * SIMULATION 3 — Spacecraft Coasting (Zero Friction)
 * ═══════════════════════════════════════════════════ */
export function Ultra2_SpaceCoasting() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [vel, setVel] = useState(40);
  const [friction, setFriction] = useState(0);
  const posX = useRef(80);
  const raf = useRef(0);
  const stars = useRef<Array<{x: number, y: number, r: number}>>([]);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CW = c.width, CH = c.height;
    posX.current = 80;
    stars.current = Array.from({ length: 60 }, () => ({ x: Math.random() * CW, y: Math.random() * CH, r: Math.random() * 1.5 + 0.5 }));

    let speedNow = vel;

    function draw() {
      speedNow = Math.max(0, speedNow - friction * 0.12);
      posX.current += speedNow * 0.04;
      if (posX.current > CW + 60) posX.current = -60;

      ctx.clearRect(0, 0, CW, CH);
      /* Space background gradient */
      const grad = ctx.createLinearGradient(0, 0, 0, CH);
      grad.addColorStop(0, "#020818"); grad.addColorStop(1, "#06101e");
      ctx.fillStyle = grad; ctx.fillRect(0, 0, CW, CH);

      /* Stars */
      stars.current.forEach(s => {
        ctx.fillStyle = `rgba(255,255,255,${0.3 + s.r * 0.2})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      });

      /* Spacecraft */
      const sx = posX.current, sy = CH / 2 - 18;
      /* Body */
      ctx.fillStyle = P.blue;
      rr(ctx, sx, sy + 6, 70, 26, 6); ctx.fill();
      /* Nose cone */
      ctx.fillStyle = P.blueHi;
      ctx.beginPath(); ctx.moveTo(sx + 70, sy + 10); ctx.lineTo(sx + 90, sy + 19); ctx.lineTo(sx + 70, sy + 28); ctx.closePath(); ctx.fill();
      /* Wings */
      ctx.fillStyle = "#1e40af";
      ctx.beginPath(); ctx.moveTo(sx + 20, sy + 32); ctx.lineTo(sx + 50, sy + 32); ctx.lineTo(sx + 45, sy + 50); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(sx + 20, sy + 6); ctx.lineTo(sx + 50, sy + 6); ctx.lineTo(sx + 45, sy - 12); ctx.closePath(); ctx.fill();
      /* Engine glow */
      if (speedNow > 1) {
        const glowLen = Math.min(50, speedNow * 0.8);
        const grad2 = ctx.createLinearGradient(sx - glowLen, sy + 19, sx, sy + 19);
        grad2.addColorStop(0, "rgba(251,146,60,0)"); grad2.addColorStop(1, "rgba(251,146,60,0.9)");
        ctx.fillStyle = grad2;
        ctx.beginPath(); ctx.ellipse(sx - glowLen / 2, sy + 19, glowLen / 2, 8, 0, 0, Math.PI * 2); ctx.fill();
      }

      /* Velocity arrow */
      if (speedNow > 0.5) {
        const arLen = Math.min(120, speedNow * 1.5);
        arrow(ctx, sx + 90, sy + 19, sx + 90 + arLen, sy + 19, P.green, 2.5);
        txt(ctx, `v = ${speedNow.toFixed(1)} m/s`, sx + 90 + arLen / 2, sy + 7, P.green, 10, "center");
      } else {
        txt(ctx, "STOPPED", sx + 40, sy + 19, P.red, 12, "center", true);
      }

      /* Friction force arrow */
      if (friction > 0.5 && speedNow > 0) {
        const fLen = Math.min(80, friction * 2);
        arrow(ctx, sx, sy + 19, sx - fLen, sy + 19, P.red, 2);
        txt(ctx, `f = ${friction.toFixed(0)}N`, sx - fLen / 2, sy + 32, P.red, 9, "center");
      }

      /* Label */
      txt(ctx, "Newton's 1st Law — Space Coasting", 16, 22, P.blueHi, 13, "left", true);
      const msg = friction === 0 ? "No friction → moves forever at constant velocity" : `Friction present → decelerates and stops`;
      txt(ctx, msg, CW / 2, CH - 18, friction === 0 ? P.green : P.amber, 11, "center", true);

      raf.current = requestAnimationFrame(draw);
    }
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [vel, friction]);

  return (
    <div style={{ background: P.bg, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden", fontFamily: "Inter,system-ui,sans-serif" }}>
      <canvas ref={ref} width={640} height={H} style={{ width: W, height: "auto", display: "block" }} />
      <div style={{ padding: "14px 20px", display: "flex", gap: 32, flexWrap: "wrap", background: P.panel, borderTop: `1px solid ${P.border}` }}>
        {[{ label: "Initial Speed (m/s)", val: vel, set: setVel, col: P.green, min: 10, max: 100 },
          { label: "Friction Force (N)", val: friction, set: setFriction, col: P.red, min: 0, max: 40 }]
          .map(({ label, val, set, col, min, max }) => (
            <label key={label} style={{ flex: 1, minWidth: 180 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: P.dim }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: col }}>{val}</span>
              </div>
              <input type="range" min={min} max={max} value={val}
                onChange={e => { set(+e.target.value); posX.current = 80; }}
                style={{ width: "100%", accentColor: col }} />
            </label>
          ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
 * SIMULATION 4 — Bus Brake: Passengers Lurch
 * ═══════════════════════════════════════════════════ */
export function Ultra2_BusBrake() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"coast" | "brake" | "accelerate">("coast");
  const raf = useRef(0);
  const busVel = useRef(50);
  const lurch = useRef(0);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CW = c.width, CH = c.height;
    busVel.current = 50; lurch.current = 0;

    function draw() {
      const target = mode === "brake" ? -15 : mode === "accelerate" ? 15 : 0;
      lurch.current += (target - lurch.current) * 0.08;
      busVel.current += (mode === "brake" ? -0.5 : mode === "accelerate" ? 0.5 : 0);
      busVel.current = Math.max(10, Math.min(80, busVel.current));

      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, CW, CH);
      grid(ctx, CW, CH);

      /* Road */
      ctx.fillStyle = "#1e2d40"; ctx.fillRect(0, CH * 0.6, CW, CH);
      /* Road markings */
      ctx.strokeStyle = "#fbbf2433"; ctx.lineWidth = 3; ctx.setLineDash([30, 20]);
      ctx.beginPath(); ctx.moveTo(0, CH * 0.6 + 40); ctx.lineTo(CW, CH * 0.6 + 40); ctx.stroke();
      ctx.setLineDash([]);

      /* Bus body */
      const bx = 80, by = CH * 0.35;
      ctx.fillStyle = "#f59e0b";
      rr(ctx, bx, by, CW - 160, 80, 10); ctx.fill();
      ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 2;
      rr(ctx, bx, by, CW - 160, 80, 10); ctx.stroke();

      /* Bus windows */
      [1, 2, 3, 4, 5].forEach(i => {
        const wx = bx + 20 + i * 70;
        ctx.fillStyle = "#bfdbfe44"; rr(ctx, wx, by + 10, 45, 30, 4); ctx.fill();
        ctx.strokeStyle = "#93c5fd55"; ctx.lineWidth = 1; rr(ctx, wx, by + 10, 45, 30, 4); ctx.stroke();
      });

      /* Bus wheels */
      [bx + 40, CW - 100 - bx + 40].forEach(wx => {
        ctx.fillStyle = "#111827"; ctx.beginPath(); ctx.arc(wx, CH * 0.6 + 5, 20, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#374151"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(wx, CH * 0.6 + 5, 12, 0, Math.PI * 2); ctx.stroke();
      });

      /* Passengers */
      const passengerPositions = [{ x: bx + 90, seat: 1 }, { x: bx + 200, seat: 2 }, { x: bx + 310, seat: 3 }];
      passengerPositions.forEach(({ x }) => {
        const lean = -lurch.current * 0.8;
        const py = by + 22;
        ctx.save();
        ctx.translate(x, py + 28);
        ctx.rotate(lean * 0.025);
        ctx.fillStyle = P.purple;
        ctx.beginPath(); ctx.arc(0, -28, 10, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = P.purple + "cc"; ctx.fillRect(-6, -18, 12, 22);
        ctx.restore();

        /* Lurch arrow */
        if (Math.abs(lurch.current) > 2) {
          const dir = lurch.current;
          arrow(ctx, x, py - 12, x + dir * 1.2, py - 12, P.amber, 2);
        }
      });

      /* Velocity display */
      const bary = CH - 50;
      ctx.fillStyle = P.panel; rr(ctx, 20, bary, 180, 22, 5); ctx.fill();
      ctx.strokeStyle = P.border; ctx.lineWidth = 1; rr(ctx, 20, bary, 180, 22, 5); ctx.stroke();
      const barLen = (busVel.current / 80) * 176;
      ctx.fillStyle = mode === "brake" ? P.red : P.green;
      rr(ctx, 22, bary + 2, barLen, 18, 4); ctx.fill();
      txt(ctx, `Bus: ${busVel.current.toFixed(0)} km/h`, 110, bary + 11, "#fff", 11, "center", true);

      /* Labels */
      const msgs = { coast: "Constant velocity — passengers at rest relative to bus", brake: "Bus decelerates — passengers lurch FORWARD (inertia of motion)", accelerate: "Bus accelerates — passengers lurch BACKWARD (inertia of rest)" };
      const msgCols = { coast: P.dim, brake: P.red, accelerate: P.green };
      txt(ctx, "Bus Brake — Newton's 1st Law", 16, 22, P.blueHi, 13, "left", true);
      txt(ctx, msgs[mode], CW / 2, CH - 18, msgCols[mode], 11, "center", true);

      raf.current = requestAnimationFrame(draw);
    }
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [mode]);

  return (
    <div style={{ background: P.bg, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden", fontFamily: "Inter,system-ui,sans-serif" }}>
      <canvas ref={ref} width={640} height={H} style={{ width: W, height: "auto", display: "block" }} />
      <div style={{ padding: "14px 20px", display: "flex", gap: 10, background: P.panel, borderTop: `1px solid ${P.border}` }}>
        {(["coast", "brake", "accelerate"] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: `1px solid ${mode === m ? P.blueHi : P.border}`, background: mode === m ? P.blue + "44" : "transparent", color: mode === m ? P.blueHi : P.dim, fontSize: 12, fontWeight: mode === m ? 700 : 400, cursor: "pointer" }}>
            {m === "coast" ? "Constant Speed" : m === "brake" ? "⬛ Brake!" : "▶ Accelerate"}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
 * SIMULATION 5 — Mass & Inertia Comparison
 * Same force applied to different masses — heavier = less a
 * ═══════════════════════════════════════════════════ */
export function Ultra2_MassInertia() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [force, setForce] = useState(40);
  const raf = useRef(0);
  const positions = useRef([80, 80, 80]);
  const velocities = useRef([0, 0, 0]);
  const masses = [2, 10, 25];

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CW = c.width, CH = c.height;
    positions.current = [80, 80, 80];
    velocities.current = [0, 0, 0];

    const colors = [P.green, P.blueHi, P.amber];
    const rows = [0.25, 0.5, 0.75];

    function draw() {
      masses.forEach((m, i) => {
        const a = force / m;
        velocities.current[i] += a * 0.012;
        positions.current[i] += velocities.current[i] * 0.25;
        if (positions.current[i] > CW - 60) { positions.current[i] = 80; velocities.current[i] = 0; }
      });

      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, CW, CH);
      grid(ctx, CW, CH);

      masses.forEach((m, i) => {
        const row = rows[i] * CH;
        const col = colors[i];
        const px = positions.current[i];
        const bsize = Math.sqrt(m) * 10 + 20;

        /* Track */
        ctx.fillStyle = "#1e3050"; ctx.fillRect(60, row - 3, CW - 80, 6);

        /* Block */
        ctx.fillStyle = col + "cc";
        rr(ctx, px - bsize / 2, row - bsize / 2, bsize, bsize, 6); ctx.fill();
        ctx.strokeStyle = col; ctx.lineWidth = 1.5;
        rr(ctx, px - bsize / 2, row - bsize / 2, bsize, bsize, 6); ctx.stroke();
        txt(ctx, `${m}kg`, px, row, "#fff", 11, "center", true);

        /* Force arrow */
        const arLen = force * 1.5;
        arrow(ctx, px - bsize / 2, row, px - bsize / 2 - arLen, row, col, 2.5);

        /* Velocity arrow */
        const vLen = velocities.current[i] * 4;
        if (vLen > 1) arrow(ctx, px + bsize / 2, row, px + bsize / 2 + vLen, row, col + "99", 2);

        /* Acceleration label */
        const acc = force / m;
        txt(ctx, `a = ${acc.toFixed(2)} m/s²`, CW - 16, row, col, 11, "right", true);
      });

      txt(ctx, "Mass & Inertia — Same Force, Different Masses", 16, 22, P.blueHi, 13, "left", true);
      txt(ctx, `F = ${force} N applied to all three blocks`, CW / 2, 22, P.dim, 11, "center");
      txt(ctx, "Heavier = more inertia = less acceleration (F=ma)", CW / 2, CH - 18, P.amber, 11, "center");

      raf.current = requestAnimationFrame(draw);
    }
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [force]);

  return (
    <div style={{ background: P.bg, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden", fontFamily: "Inter,system-ui,sans-serif" }}>
      <canvas ref={ref} width={640} height={H} style={{ width: W, height: "auto", display: "block" }} />
      <div style={{ padding: "14px 20px", background: P.panel, borderTop: `1px solid ${P.border}` }}>
        <label>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: P.dim }}>Applied Force (N) — same for all blocks</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: P.amber }}>{force} N</span>
          </div>
          <input type="range" min={5} max={100} value={force}
            onChange={e => { setForce(+e.target.value); positions.current = [80, 80, 80]; velocities.current = [0, 0, 0]; }}
            style={{ width: "100%", accentColor: P.amber }} />
        </label>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
 * SIMULATION 6 — Galileo's Ramp Extrapolation
 * Reduce friction → block goes farther; zero friction → forever
 * ═══════════════════════════════════════════════════ */
export function Ultra2_GalileoRamp() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [mu, setMu] = useState(0.3);
  const posX = useRef(120);
  const velX = useRef(60);
  const raf = useRef(0);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CW = c.width, CH = c.height;
    posX.current = 120; velX.current = 60;

    function draw() {
      const g = 9.8, friction = mu * g;
      velX.current = Math.max(0, velX.current - friction * 0.016);
      posX.current += velX.current * 0.04;

      if (posX.current > CW + 50 || velX.current < 0.1) {
        if (mu === 0) { posX.current = posX.current > CW + 50 ? -50 : posX.current; }
        else { setTimeout(() => { posX.current = 120; velX.current = 60; }, 1500); }
      }

      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, CW, CH);
      grid(ctx, CW, CH);

      /* Ramp */
      const ry = CH * 0.6;
      const rampH = 120;
      ctx.fillStyle = "#1e3050";
      ctx.beginPath(); ctx.moveTo(20, ry); ctx.lineTo(160, ry - rampH); ctx.lineTo(160, ry); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = P.border; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(20, ry); ctx.lineTo(160, ry - rampH); ctx.stroke();

      /* Floor */
      ctx.fillStyle = mu === 0 ? "#0d2040" : "#1e3050";
      ctx.fillRect(160, ry, CW - 180, 6);
      /* Friction texture if any */
      if (mu > 0.05) {
        ctx.strokeStyle = "#2a4060"; ctx.lineWidth = 1;
        for (let x = 165; x < CW - 20; x += 15) {
          ctx.beginPath(); ctx.moveTo(x, ry + 6); ctx.lineTo(x - 8, ry + 18); ctx.stroke();
        }
      } else {
        ctx.strokeStyle = P.cyan + "44"; ctx.lineWidth = 1.5; ctx.setLineDash([8, 8]);
        ctx.beginPath(); ctx.moveTo(165, ry + 3); ctx.lineTo(CW - 20, ry + 3); ctx.stroke();
        ctx.setLineDash([]);
      }

      /* Block */
      const bx = posX.current;
      if (bx > 160) {
        ctx.fillStyle = P.blue;
        rr(ctx, bx - 20, ry - 32, 40, 32, 6); ctx.fill();
        ctx.strokeStyle = P.blueHi; ctx.lineWidth = 1.5;
        rr(ctx, bx - 20, ry - 32, 40, 32, 6); ctx.stroke();
        txt(ctx, "5kg", bx, ry - 16, "#fff", 10, "center", true);

        /* Velocity arrow */
        if (velX.current > 0.5) {
          const vLen = velX.current * 1.5;
          arrow(ctx, bx + 20, ry - 16, bx + 20 + vLen, ry - 16, P.green, 2.5);
        }
        /* Friction arrow */
        if (mu > 0.05 && velX.current > 0.5) {
          arrow(ctx, bx - 20, ry - 16, bx - 20 - 30, ry - 16, P.red, 2);
          txt(ctx, "f", bx - 35, ry - 26, P.red, 10, "center");
        }
      } else {
        /* Block on ramp */
        ctx.save();
        const angle = Math.atan(rampH / 140);
        ctx.translate(120, ry - 50);
        ctx.rotate(-angle);
        ctx.fillStyle = P.blue; rr(ctx, -20, -18, 40, 36, 6); ctx.fill();
        ctx.restore();
      }

      /* Readout */
      txt(ctx, "Galileo's Ramp — Extrapolation to Zero Friction", 16, 22, P.blueHi, 13, "left", true);
      const msg = mu === 0 ? "μ = 0 → No friction → moves forever! (Newton's 1st Law)" : `μ = ${mu.toFixed(2)} → friction decelerates block  v=${velX.current.toFixed(1)}m/s`;
      txt(ctx, msg, CW / 2, CH - 18, mu === 0 ? P.green : P.amber, 11, "center", true);
      txt(ctx, `v = ${velX.current.toFixed(1)} m/s`, CW - 16, 22, P.green, 11, "right", true);

      raf.current = requestAnimationFrame(draw);
    }
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [mu]);

  return (
    <div style={{ background: P.bg, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden", fontFamily: "Inter,system-ui,sans-serif" }}>
      <canvas ref={ref} width={640} height={H} style={{ width: W, height: "auto", display: "block" }} />
      <div style={{ padding: "14px 20px", background: P.panel, borderTop: `1px solid ${P.border}` }}>
        <label>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: P.dim }}>Floor Friction (μ) — 0 = perfectly smooth</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: mu === 0 ? P.green : P.amber }}>{mu.toFixed(2)}</span>
          </div>
          <input type="range" min={0} max={0.8} step={0.05} value={mu}
            onChange={e => { setMu(+e.target.value); posX.current = 120; velX.current = 60; }}
            style={{ width: "100%", accentColor: P.amber }} />
        </label>
      </div>
    </div>
  );
}
