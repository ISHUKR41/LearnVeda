/**
 * FILE: TopicUltraNew3.tsx
 * PURPOSE: 6 ultra-professional canvas-based physics simulations for
 *          Topic 3 — Newton's Second Law F=ma (CBSE Class 9, Chapter 9)
 *
 * SIMULATIONS:
 *   Ultra3_FmaLiveLab       — Interactive F=ma with live animated block + graph
 *   Ultra3_MassComparison   — Side-by-side: same force, different masses
 *   Ultra3_ImpulseDemo      — Force × Time = change in momentum (cricket bat)
 *   Ultra3_BrakingDistance  — Car braking: F, m, a → stopping distance
 *   Ultra3_RocketFma        — Rocket thrust vs mass → acceleration
 *   Ultra3_FmaForceGraph    — Live F vs a graph as user changes force/mass
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
    ctx.fillText(label, (x1 + x2) / 2, (y1 + y2) / 2 - 12);
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
 * SIMULATION 1 — F=ma Live Lab with Position Graph
 * ═══════════════════════════════════════════════════ */
export function Ultra3_FmaLiveLab() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [force, setForce] = useState(30);
  const [mass, setMass] = useState(5);
  const posRef = useRef(60);
  const velRef = useRef(0);
  const history = useRef<number[]>([]);
  const raf = useRef(0);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CW = c.width, CH = c.height;
    posRef.current = 60; velRef.current = 0; history.current = [];

    function draw() {
      const a = force / mass;
      velRef.current += a * 0.016;
      posRef.current += velRef.current * 0.2;
      if (posRef.current > CW - 50) { posRef.current = 60; velRef.current = 0; history.current = []; }
      history.current.push(posRef.current);
      if (history.current.length > 200) history.current.shift();

      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, CW, CH);
      grid(ctx, CW, CH);

      /* Track */
      ctx.fillStyle = "#1e3050"; ctx.fillRect(40, CH * 0.52, CW - 60, 6);

      /* Block */
      const bx = posRef.current, by = CH * 0.4;
      const bsize = Math.min(60, Math.max(28, mass * 4));
      ctx.fillStyle = P.blue; rr(ctx, bx - bsize / 2, by - bsize / 2, bsize, bsize, 8); ctx.fill();
      ctx.strokeStyle = P.blueHi; ctx.lineWidth = 1.5;
      rr(ctx, bx - bsize / 2, by - bsize / 2, bsize, bsize, 8); ctx.stroke();
      txt(ctx, `${mass}kg`, bx, by, "#fff", 11, "center", true);

      /* Force arrow */
      arrow(ctx, bx + bsize / 2, by, bx + bsize / 2 + force * 1.8, by, P.green, 2.5, `F=${force}N`);

      /* Acceleration arrow (smaller) */
      arrow(ctx, bx, by + bsize / 2 + 10, bx + a * 20, by + bsize / 2 + 10, P.amber, 2, `a=${a.toFixed(1)}`);

      /* Velocity bar */
      const vBarY = CH * 0.72;
      ctx.fillStyle = P.panel; rr(ctx, 40, vBarY - 12, CW - 80, 24, 5); ctx.fill();
      ctx.strokeStyle = P.border; ctx.lineWidth = 1; rr(ctx, 40, vBarY - 12, CW - 80, 24, 5); ctx.stroke();
      const vBarW = Math.min(CW - 84, velRef.current * 6);
      if (vBarW > 0) {
        ctx.fillStyle = P.green + "aa"; rr(ctx, 42, vBarY - 10, vBarW, 20, 4); ctx.fill();
      }
      txt(ctx, `v = ${velRef.current.toFixed(2)} m/s`, CW / 2, vBarY, "#fff", 11, "center", true);

      /* Trail dots */
      history.current.forEach((px, i) => {
        const alpha = i / history.current.length;
        ctx.fillStyle = `rgba(59,130,246,${alpha * 0.5})`;
        ctx.beginPath(); ctx.arc(px, CH * 0.52, 2, 0, Math.PI * 2); ctx.fill();
      });

      /* Formula box */
      ctx.fillStyle = P.panel + "ee"; rr(ctx, CW - 160, CH - 70, 145, 50, 8); ctx.fill();
      ctx.strokeStyle = P.border; ctx.lineWidth = 1; rr(ctx, CW - 160, CH - 70, 145, 50, 8); ctx.stroke();
      txt(ctx, `F = ${force} N`, CW - 88, CH - 56, P.green, 12, "center", true);
      txt(ctx, `m = ${mass} kg`, CW - 88, CH - 40, P.blueHi, 12, "center");
      txt(ctx, `a = ${a.toFixed(2)} m/s²`, CW - 88, CH - 26, P.amber, 12, "center", true);

      txt(ctx, "F = ma — Live Lab", 16, 22, P.blueHi, 13, "left", true);
      txt(ctx, "Newton's Second Law: acceleration is proportional to force, inversely proportional to mass", CW / 2, CH - 18, P.dim, 9, "center");

      raf.current = requestAnimationFrame(draw);
    }
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [force, mass]);

  return (
    <div style={{ background: P.bg, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden", fontFamily: "Inter,system-ui,sans-serif" }}>
      <canvas ref={ref} width={640} height={H} style={{ width: W, height: "auto", display: "block" }} />
      <div style={{ padding: "14px 20px", display: "flex", gap: 32, flexWrap: "wrap", background: P.panel, borderTop: `1px solid ${P.border}` }}>
        {[{ label: "Applied Force F (N)", val: force, set: setForce, col: P.green, min: 5, max: 100 },
          { label: "Object Mass m (kg)", val: mass, set: setMass, col: P.blueHi, min: 1, max: 25 }]
          .map(({ label, val, set, col, min, max }) => (
            <label key={label} style={{ flex: 1, minWidth: 180 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: P.dim }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: col }}>{val}</span>
              </div>
              <input type="range" min={min} max={max} value={val}
                onChange={e => { set(+e.target.value); posRef.current = 60; velRef.current = 0; }}
                style={{ width: "100%", accentColor: col }} />
            </label>
          ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
 * SIMULATION 2 — Same Force, Different Mass Comparison
 * ═══════════════════════════════════════════════════ */
export function Ultra3_MassComparison() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [force, setForce] = useState(50);
  const raf = useRef(0);
  const positions = useRef([80, 80, 80, 80]);
  const velocities = useRef([0, 0, 0, 0]);
  const masses = [1, 5, 10, 20];

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CW = c.width, CH = c.height;
    positions.current = Array(4).fill(80);
    velocities.current = Array(4).fill(0);

    const colors = [P.green, P.blueHi, P.amber, P.red];

    function draw() {
      masses.forEach((m, i) => {
        velocities.current[i] += (force / m) * 0.012;
        positions.current[i] += velocities.current[i] * 0.2;
        if (positions.current[i] > CW - 40) { positions.current[i] = 80; velocities.current[i] = 0; }
      });

      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, CW, CH);
      grid(ctx, CW, CH);

      const rowH = CH / 5;
      masses.forEach((m, i) => {
        const row = rowH * (i + 0.8);
        const col = colors[i];
        const px = positions.current[i];
        const bsize = Math.min(44, Math.sqrt(m) * 10 + 14);

        /* Track */
        ctx.fillStyle = "#1e3050"; ctx.fillRect(60, row - 4, CW - 80, 8);

        /* Block */
        ctx.fillStyle = col + "cc";
        rr(ctx, px - bsize / 2, row - bsize / 2, bsize, bsize, 5); ctx.fill();
        ctx.strokeStyle = col; ctx.lineWidth = 1.5;
        rr(ctx, px - bsize / 2, row - bsize / 2, bsize, bsize, 5); ctx.stroke();
        txt(ctx, `${m}kg`, px, row, "#fff", 10, "center", true);

        /* Force arrow */
        const arLen = force * 0.8;
        arrow(ctx, px + bsize / 2, row, px + bsize / 2 + arLen, row, col, 2);

        /* Acceleration label */
        const acc = (force / m).toFixed(1);
        txt(ctx, `a = ${acc} m/s²`, CW - 16, row, col, 11, "right", true);
        txt(ctx, `v = ${velocities.current[i].toFixed(1)}`, CW - 16, row + 13, P.dim, 9, "right");
      });

      txt(ctx, `Same Force F=${force}N on Different Masses`, 16, 22, P.blueHi, 13, "left", true);
      txt(ctx, "a = F/m → heavier mass → lower acceleration", CW / 2, CH - 18, P.amber, 11, "center");

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
            <span style={{ fontSize: 11, color: P.dim }}>Force F (N) — applied to all blocks</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: P.green }}>{force} N</span>
          </div>
          <input type="range" min={5} max={100} value={force}
            onChange={e => { setForce(+e.target.value); positions.current = Array(4).fill(80); velocities.current = Array(4).fill(0); }}
            style={{ width: "100%", accentColor: P.green }} />
        </label>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
 * SIMULATION 3 — Impulse Demo (Cricket Bat)
 * F × t = Δp — longer contact = same impulse but gentler force
 * ═══════════════════════════════════════════════════ */
export function Ultra3_ImpulseDemo() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [contactTime, setContactTime] = useState(0.05);
  const raf = useRef(0);
  const t = useRef(0);
  const phase = useRef<"idle" | "hit" | "flying">("idle");
  const ballX = useRef(560);
  const ballVel = useRef(0);

  const momentum = 5;

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CW = c.width, CH = c.height;
    const mass = 0.16;

    function draw() {
      t.current += 0.016;

      if (phase.current === "idle" && t.current > 1.5) { phase.current = "hit"; t.current = 0; }
      if (phase.current === "hit") {
        ballVel.current = -momentum / mass * (t.current / contactTime);
        if (t.current >= contactTime) { ballVel.current = -momentum / mass; phase.current = "flying"; }
      }
      if (phase.current === "flying") {
        ballX.current += ballVel.current * 0.04;
        if (ballX.current < -30) { phase.current = "idle"; t.current = 0; ballX.current = 560; ballVel.current = 0; }
      }

      const F_impact = momentum / contactTime;

      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, CW, CH);
      grid(ctx, CW, CH);

      /* Pitch */
      ctx.fillStyle = "#0f3020"; ctx.fillRect(0, CH * 0.6, CW, CH * 0.4);
      ctx.fillStyle = "#166534"; ctx.fillRect(0, CH * 0.6, CW, 8);

      /* Bat */
      const batX = 120;
      const swing = phase.current === "hit" ? Math.sin(t.current / contactTime * Math.PI) * 20 : 0;
      ctx.save();
      ctx.translate(batX, CH * 0.45 + swing);
      ctx.rotate(0.3);
      ctx.fillStyle = "#b45309"; ctx.fillRect(-8, -70, 16, 100); /* handle */
      ctx.fillStyle = "#854d0e"; ctx.fillRect(-18, 30, 36, 70); /* blade */
      ctx.restore();

      /* Ball */
      const bx = ballX.current, by = CH * 0.55;
      const spin = t.current * 8;
      ctx.fillStyle = "#dc2626";
      ctx.beginPath(); ctx.arc(bx, by, 14, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#fca5a5"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(bx, by, 14, 0, Math.PI * 2); ctx.stroke();
      /* Seam */
      ctx.save(); ctx.translate(bx, by); ctx.rotate(spin);
      ctx.strokeStyle = "#fff9"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI); ctx.stroke();
      ctx.restore();

      /* Velocity arrow */
      if (Math.abs(ballVel.current) > 1) {
        const vLen = Math.min(100, Math.abs(ballVel.current) * 0.15);
        arrow(ctx, bx - 14, by, bx - 14 - vLen, by, P.amber, 2.5);
        txt(ctx, `${Math.abs(ballVel.current).toFixed(0)} m/s`, bx - 14 - vLen - 4, by - 12, P.amber, 10, "right");
      }

      /* Info panel */
      ctx.fillStyle = P.panel + "dd"; rr(ctx, CW - 200, 40, 185, 90, 8); ctx.fill();
      ctx.strokeStyle = P.border; ctx.lineWidth = 1; rr(ctx, CW - 200, 40, 185, 90, 8); ctx.stroke();
      txt(ctx, "Impulse = F × t = Δp", CW - 110, 57, P.amber, 11, "center", true);
      txt(ctx, `Δp = ${momentum.toFixed(2)} kg⋅m/s`, CW - 110, 75, P.text, 11, "center");
      txt(ctx, `t = ${contactTime.toFixed(3)} s`, CW - 110, 92, P.blueHi, 11, "center");
      txt(ctx, `F = ${F_impact.toFixed(0)} N`, CW - 110, 109, P.green, 12, "center", true);

      txt(ctx, "Impulse & Cricket Bat — F × t = Δp", 16, 22, P.blueHi, 13, "left", true);
      const msg = contactTime < 0.03 ? "Very short contact → HUGE force on ball!" : contactTime > 0.08 ? "Long contact (follow-through) → gentler force" : "Moderate contact time";
      txt(ctx, msg, CW / 2, CH - 18, P.amber, 11, "center");

      raf.current = requestAnimationFrame(draw);
    }
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [contactTime]);

  return (
    <div style={{ background: P.bg, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden", fontFamily: "Inter,system-ui,sans-serif" }}>
      <canvas ref={ref} width={640} height={H} style={{ width: W, height: "auto", display: "block" }} />
      <div style={{ padding: "14px 20px", background: P.panel, borderTop: `1px solid ${P.border}` }}>
        <label>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: P.dim }}>Contact Time t (seconds) — Impulse = 5 N⋅s constant</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: P.amber }}>{contactTime.toFixed(3)} s → F = {(momentum / contactTime).toFixed(0)} N</span>
          </div>
          <input type="range" min={0.01} max={0.15} step={0.01} value={contactTime}
            onChange={e => { setContactTime(+e.target.value); ballX.current = 560; ballVel.current = 0; phase.current = "idle"; t.current = 0; }}
            style={{ width: "100%", accentColor: P.amber }} />
        </label>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
 * SIMULATION 4 — Car Braking Distance
 * F, m, μ → deceleration → stopping distance
 * ═══════════════════════════════════════════════════ */
export function Ultra3_BrakingDistance() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [speed, setSpeed] = useState(60);
  const [mass, setMass] = useState(1000);
  const [mu, setMu] = useState(0.6);
  const carX = useRef(80);
  const carVel = useRef(0);
  const raf = useRef(0);
  const stopped = useRef(false);
  const brakeDist = useRef(0);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CW = c.width, CH = c.height;
    const g = 9.8;
    const v0 = speed / 3.6;
    carX.current = 80; carVel.current = v0; stopped.current = false;
    brakeDist.current = (v0 * v0) / (2 * mu * g);

    function draw() {
      if (!stopped.current) {
        const decel = mu * g;
        carVel.current = Math.max(0, carVel.current - decel * 0.02);
        carX.current += carVel.current * 0.18;
        if (carVel.current < 0.1) stopped.current = true;
      }

      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, CW, CH);
      grid(ctx, CW, CH);

      /* Road */
      ctx.fillStyle = "#1e2d40"; ctx.fillRect(0, CH * 0.55, CW, 80);
      ctx.strokeStyle = "#fbbf2433"; ctx.lineWidth = 3; ctx.setLineDash([25, 15]);
      ctx.beginPath(); ctx.moveTo(0, CH * 0.55 + 40); ctx.lineTo(CW, CH * 0.55 + 40); ctx.stroke();
      ctx.setLineDash([]);

      /* Start marker */
      ctx.strokeStyle = P.green + "66"; ctx.lineWidth = 2; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(80, CH * 0.42); ctx.lineTo(80, CH * 0.7); ctx.stroke();
      ctx.setLineDash([]);
      txt(ctx, "start", 80, CH * 0.4, P.green + "99", 9, "center");

      /* Brake marks */
      if (stopped.current) {
        ctx.strokeStyle = P.red + "88"; ctx.lineWidth = 8;
        [CH * 0.57, CH * 0.67].forEach(y => {
          ctx.beginPath(); ctx.moveTo(80, y); ctx.lineTo(Math.min(CW - 20, carX.current + 60), y); ctx.stroke();
        });
      }

      /* Car */
      const cx = carX.current, cy = CH * 0.5;
      ctx.fillStyle = stopped.current ? P.amber : P.blue;
      rr(ctx, cx, cy + 14, 100, 34, 7); ctx.fill();
      ctx.fillStyle = stopped.current ? "#b45309" : "#1d4ed8";
      rr(ctx, cx + 15, cy, 68, 26, 5); ctx.fill();
      /* Wheels */
      [cx + 20, cx + 78].forEach(wx => {
        ctx.fillStyle = "#111827"; ctx.beginPath(); ctx.arc(wx, cy + 50, 12, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#4b5563"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(wx, cy + 50, 7, 0, Math.PI * 2); ctx.stroke();
      });

      /* Speed display */
      const kmh = (carVel.current * 3.6).toFixed(0);
      txt(ctx, `${kmh} km/h`, cx + 50, cy + 20, "#fff", 11, "center", true);

      /* Deceleration & distance info */
      const decel = (mu * g).toFixed(2);
      const actualDist = Math.max(0, carX.current - 80).toFixed(0);

      ctx.fillStyle = P.panel + "ee"; rr(ctx, 16, CH - 80, 250, 62, 8); ctx.fill();
      ctx.strokeStyle = P.border; ctx.lineWidth = 1; rr(ctx, 16, CH - 80, 250, 62, 8); ctx.stroke();
      txt(ctx, `Initial: ${speed} km/h = ${v0.toFixed(1)} m/s`, 28, CH - 65, P.text, 10);
      txt(ctx, `Decel: a = μg = ${decel} m/s²`, 28, CH - 50, P.amber, 10);
      txt(ctx, `Theoretical stop: ${brakeDist.current.toFixed(1)} m`, 28, CH - 35, P.blueHi, 10);
      txt(ctx, `Actual so far: ${actualDist} m`, 28, CH - 20, stopped.current ? P.green : P.red, 10);

      txt(ctx, "Car Braking Distance — F=ma", 16, 22, P.blueHi, 13, "left", true);
      txt(ctx, `μ=${mu}  m=${mass}kg  v₀=${v0.toFixed(1)}m/s  s = v₀²/2μg = ${brakeDist.current.toFixed(1)}m`, CW / 2, 22, P.dim, 9, "center");

      raf.current = requestAnimationFrame(draw);
    }
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [speed, mass, mu]);

  return (
    <div style={{ background: P.bg, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden", fontFamily: "Inter,system-ui,sans-serif" }}>
      <canvas ref={ref} width={640} height={H} style={{ width: W, height: "auto", display: "block" }} />
      <div style={{ padding: "14px 20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px 20px", background: P.panel, borderTop: `1px solid ${P.border}` }}>
        {[{ label: "Initial Speed (km/h)", val: speed, set: setSpeed, col: P.green, min: 20, max: 120, step: 5 },
          { label: "Car Mass (kg)", val: mass, set: setMass, col: P.blueHi, min: 500, max: 3000, step: 100 },
          { label: "Friction μ", val: mu, set: setMu, col: P.amber, min: 0.2, max: 1.0, step: 0.05 }]
          .map(({ label, val, set, col, min, max, step }) => (
            <label key={label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: P.dim }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: col }}>{typeof val === "number" ? (step < 1 ? val.toFixed(2) : val) : val}</span>
              </div>
              <input type="range" min={min} max={max} step={step} value={val}
                onChange={e => { set(+e.target.value); carX.current = 80; stopped.current = false; }}
                style={{ width: "100%", accentColor: col }} />
            </label>
          ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
 * SIMULATION 5 — Rocket: F=ma with Thrust & Mass
 * ═══════════════════════════════════════════════════ */
export function Ultra3_RocketFma() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [thrust, setThrust] = useState(800);
  const [rocketMass, setRocketMass] = useState(200);
  const posY = useRef(280);
  const velY = useRef(0);
  const raf = useRef(0);
  const exhaustParts = useRef<Array<{x: number, y: number, vy: number, life: number}>>([]);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CW = c.width, CH = c.height;
    posY.current = CH - 60; velY.current = 0; exhaustParts.current = [];

    function draw() {
      const g = 9.8;
      const Fnet = thrust - rocketMass * g;
      const a = Fnet / rocketMass;
      velY.current -= a * 0.02;
      posY.current += velY.current;
      if (posY.current < 30) { posY.current = CH - 60; velY.current = 0; exhaustParts.current = []; }

      /* Exhaust particles */
      if (thrust > rocketMass * g) {
        for (let i = 0; i < 3; i++) {
          exhaustParts.current.push({
            x: CW / 2 + (Math.random() - 0.5) * 16,
            y: posY.current + 40,
            vy: 2 + Math.random() * 4,
            life: 1,
          });
        }
      }
      exhaustParts.current = exhaustParts.current
        .map(p => ({ ...p, y: p.y + p.vy, life: p.life - 0.04 }))
        .filter(p => p.life > 0);

      ctx.clearRect(0, 0, CW, CH);
      /* Sky gradient */
      const skyGrad = ctx.createLinearGradient(0, 0, 0, CH);
      skyGrad.addColorStop(0, "#020818");
      skyGrad.addColorStop(1, "#0c1929");
      ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, CW, CH);
      grid(ctx, CW, CH);

      /* Launch pad */
      ctx.fillStyle = "#374151"; ctx.fillRect(CW / 2 - 50, CH - 20, 100, 20);
      ctx.fillStyle = "#1f2937"; ctx.fillRect(CW / 2 - 60, CH - 8, 120, 8);

      /* Exhaust */
      exhaustParts.current.forEach(p => {
        const gc = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 8);
        gc.addColorStop(0, `rgba(251,146,60,${p.life})`);
        gc.addColorStop(1, "rgba(251,146,60,0)");
        ctx.fillStyle = gc; ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI * 2); ctx.fill();
      });

      /* Rocket body */
      const rx = CW / 2, ry = posY.current;
      ctx.fillStyle = P.blue;
      rr(ctx, rx - 14, ry, 28, 55, 6); ctx.fill();
      ctx.strokeStyle = P.blueHi; ctx.lineWidth = 1.5;
      rr(ctx, rx - 14, ry, 28, 55, 6); ctx.stroke();
      /* Nose */
      ctx.fillStyle = P.red;
      ctx.beginPath(); ctx.moveTo(rx - 14, ry); ctx.lineTo(rx, ry - 22); ctx.lineTo(rx + 14, ry); ctx.closePath(); ctx.fill();
      /* Fins */
      ctx.fillStyle = "#1d4ed8";
      ctx.beginPath(); ctx.moveTo(rx - 14, ry + 40); ctx.lineTo(rx - 30, ry + 60); ctx.lineTo(rx - 14, ry + 55); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(rx + 14, ry + 40); ctx.lineTo(rx + 30, ry + 60); ctx.lineTo(rx + 14, ry + 55); ctx.closePath(); ctx.fill();

      /* Force arrows */
      const arScale = 0.06;
      const weightH = rocketMass * g * arScale;
      const thrustH = thrust * arScale;
      arrow(ctx, rx, ry + 28, rx, ry + 28 + weightH, P.red, 2.5, `W=${(rocketMass * g).toFixed(0)}N`);
      arrow(ctx, rx, ry + 28, rx, ry + 28 - thrustH, P.green, 2.5, `T=${thrust}N`);

      /* Info box */
      ctx.fillStyle = P.panel + "ee"; rr(ctx, CW - 180, 40, 165, 80, 8); ctx.fill();
      ctx.strokeStyle = P.border; ctx.lineWidth = 1; rr(ctx, CW - 180, 40, 165, 80, 8); ctx.stroke();
      txt(ctx, `Thrust = ${thrust} N`, CW - 100, 57, P.green, 11, "center", true);
      txt(ctx, `Weight = ${(rocketMass * g).toFixed(0)} N`, CW - 100, 74, P.red, 11, "center");
      txt(ctx, `Fnet = ${Fnet.toFixed(0)} N`, CW - 100, 91, P.amber, 11, "center");
      txt(ctx, `a = ${a.toFixed(2)} m/s²`, CW - 100, 108, Fnet > 0 ? P.green : P.red, 12, "center", true);

      txt(ctx, "Rocket Launch — F=ma", 16, 22, P.blueHi, 13, "left", true);
      const status = Fnet > 0 ? `Liftoff! a = ${a.toFixed(2)} m/s²` : `On pad. Need T > ${(rocketMass * g).toFixed(0)}N to launch!`;
      txt(ctx, status, CW / 2, CH - 18, Fnet > 0 ? P.green : P.amber, 11, "center");

      raf.current = requestAnimationFrame(draw);
    }
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [thrust, rocketMass]);

  return (
    <div style={{ background: P.bg, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden", fontFamily: "Inter,system-ui,sans-serif" }}>
      <canvas ref={ref} width={640} height={H} style={{ width: W, height: "auto", display: "block" }} />
      <div style={{ padding: "14px 20px", display: "flex", gap: 32, flexWrap: "wrap", background: P.panel, borderTop: `1px solid ${P.border}` }}>
        {[{ label: "Engine Thrust (N)", val: thrust, set: setThrust, col: P.green, min: 200, max: 2000, step: 50 },
          { label: "Rocket Mass (kg)", val: rocketMass, set: setRocketMass, col: P.amber, min: 50, max: 500, step: 10 }]
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
 * SIMULATION 6 — Live F vs a Graph
 * Plot acceleration as user changes force/mass in real time
 * ═══════════════════════════════════════════════════ */
export function Ultra3_FmaForceGraph() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [mass, setMass] = useState(5);
  const graphData = useRef<Array<{ f: number, a: number }>>([]);
  const raf = useRef(0);
  const t = useRef(0);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CW = c.width, CH = c.height;

    /* Build F vs a data for this mass */
    graphData.current = Array.from({ length: 20 }, (_, i) => ({
      f: (i + 1) * 5,
      a: ((i + 1) * 5) / mass,
    }));

    function draw() {
      t.current += 0.04;

      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, CW, CH);
      grid(ctx, CW, CH);

      /* Graph area */
      const gx = 70, gy = 40, gw = CW - 120, gh = CH - 100;

      /* Axes */
      ctx.strokeStyle = P.border; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx, gy + gh); ctx.lineTo(gx + gw, gy + gh); ctx.stroke();

      /* Axis labels */
      txt(ctx, "Force F (N)", gx + gw / 2, gy + gh + 22, P.dim, 11, "center");
      ctx.save(); ctx.translate(gx - 40, gy + gh / 2); ctx.rotate(-Math.PI / 2);
      txt(ctx, "Acceleration a (m/s²)", 0, 0, P.dim, 11, "center");
      ctx.restore();

      const maxF = 100, maxA = 100 / mass;

      /* Grid lines */
      [20, 40, 60, 80, 100].forEach(f => {
        const px = gx + (f / maxF) * gw;
        ctx.strokeStyle = P.faint; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(px, gy); ctx.lineTo(px, gy + gh); ctx.stroke();
        txt(ctx, `${f}`, px, gy + gh + 12, P.dim, 9, "center");
      });
      ctx.setLineDash([]);

      const step = Math.ceil(maxA / 5);
      for (let a = step; a <= maxA; a += step) {
        const py = gy + gh - (a / maxA) * gh;
        ctx.strokeStyle = P.faint; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(gx, py); ctx.lineTo(gx + gw, py); ctx.stroke();
        txt(ctx, a.toFixed(1), gx - 8, py, P.dim, 9, "right");
      }
      ctx.setLineDash([]);

      /* Line gradient */
      const lg = ctx.createLinearGradient(gx, gy + gh, gx + gw, gy);
      lg.addColorStop(0, P.blueHi); lg.addColorStop(1, P.green);
      ctx.strokeStyle = lg; ctx.lineWidth = 2.5; ctx.lineJoin = "round";
      ctx.beginPath();
      graphData.current.forEach((pt, i) => {
        const px = gx + (pt.f / maxF) * gw;
        const py = gy + gh - (pt.a / maxA) * gh;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      });
      ctx.stroke();

      /* Data points */
      const pulseIdx = Math.floor(t.current) % graphData.current.length;
      graphData.current.forEach((pt, i) => {
        const px = gx + (pt.f / maxF) * gw;
        const py = gy + gh - (pt.a / maxA) * gh;
        const isPulse = i === pulseIdx;
        ctx.fillStyle = isPulse ? P.amber : P.blueHi;
        const r = isPulse ? 5 : 3;
        ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();
        if (isPulse) {
          ctx.strokeStyle = P.amber + "55"; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2); ctx.stroke();
          txt(ctx, `(${pt.f}N, ${pt.a.toFixed(1)}m/s²)`, px, py - 16, P.amber, 9, "center");
        }
      });

      txt(ctx, `F vs a Graph — m = ${mass} kg (slope = 1/m = ${(1 / mass).toFixed(2)})`, 16, 22, P.blueHi, 13, "left", true);
      txt(ctx, "Straight line through origin proves a ∝ F (for constant mass)", CW / 2, CH - 18, P.amber, 10, "center");

      raf.current = requestAnimationFrame(draw);
    }
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [mass]);

  return (
    <div style={{ background: P.bg, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden", fontFamily: "Inter,system-ui,sans-serif" }}>
      <canvas ref={ref} width={640} height={H} style={{ width: W, height: "auto", display: "block" }} />
      <div style={{ padding: "14px 20px", background: P.panel, borderTop: `1px solid ${P.border}` }}>
        <label>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: P.dim }}>Mass m (kg) — changes slope of F vs a graph</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: P.blueHi }}>{mass} kg</span>
          </div>
          <input type="range" min={1} max={20} value={mass}
            onChange={e => setMass(+e.target.value)} style={{ width: "100%", accentColor: P.blueHi }} />
        </label>
      </div>
    </div>
  );
}
