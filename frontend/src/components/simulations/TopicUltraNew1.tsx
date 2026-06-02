/**
 * FILE: TopicUltraNew1.tsx
 * PURPOSE: 6 ultra-professional canvas-based physics simulations for
 *          Topic 1 — Balanced & Unbalanced Forces (CBSE Class 9, Chapter 9)
 *
 * SIMULATIONS:
 *   Ultra1_ForceBalanceLab   — Dual-force lab with live net-force bar
 *   Ultra1_VectorAddition2D  — 2D vector addition with parallelogram rule
 *   Ultra1_StaticKinetic     — Static vs kinetic friction transition
 *   Ultra1_ElevatorForces    — Elevator with scale reading (N2L applied)
 *   Ultra1_InclinedBlock     — Block on inclined plane with angle slider
 *   Ultra1_ForcePairsTable   — Table pushing book — FBD with all forces
 *
 * All: pure HTML5 Canvas + requestAnimationFrame, no external libraries.
 * Real Newtonian mechanics, interactive sliders, live formula readouts.
 * LAST UPDATED: 2026-06-02
 */

"use client";
import { useRef, useEffect, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════
 * SHARED PALETTE & UTILITIES
 * ═══════════════════════════════════════════════════ */
const P = {
  bg:      "#06101e",
  panel:   "#0c1929",
  border:  "#1a3050",
  blue:    "#2563eb",
  blueHi:  "#3b82f6",
  green:   "#22c55e",
  red:     "#ef4444",
  amber:   "#f59e0b",
  purple:  "#a78bfa",
  cyan:    "#06b6d4",
  text:    "#e2e8f0",
  dim:     "#94a3b8",
  faint:   "#334155",
  grid:    "rgba(99,102,241,0.06)",
};

const W = "100%";
const H = 340;

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function arrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number,
               col: string, lw = 2.5, label = "") {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
  if (len < 4) return;
  const ang = Math.atan2(dy, dx), hw = Math.min(13, len * 0.35);
  ctx.save();
  ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - hw * Math.cos(ang - 0.45), y2 - hw * Math.sin(ang - 0.45));
  ctx.lineTo(x2 - hw * Math.cos(ang + 0.45), y2 - hw * Math.sin(ang + 0.45));
  ctx.closePath(); ctx.fill();
  if (label) {
    ctx.font = "bold 11px Inter,system-ui,sans-serif";
    ctx.fillStyle = col; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const off = 14;
    const nx = -Math.sin(ang), ny = Math.cos(ang);
    ctx.fillText(label, mx + nx * off, my + ny * off);
  }
  ctx.restore();
}

function txt(ctx: CanvasRenderingContext2D, s: string, x: number, y: number,
             col = P.text, size = 12, align: CanvasTextAlign = "left", bold = false) {
  ctx.save();
  ctx.font = `${bold ? "bold " : ""}${size}px Inter,system-ui,sans-serif`;
  ctx.fillStyle = col; ctx.textAlign = align; ctx.textBaseline = "middle";
  ctx.fillText(s, x, y); ctx.restore();
}

function grid(ctx: CanvasRenderingContext2D, w: number, h: number, step = 40) {
  ctx.save(); ctx.strokeStyle = P.grid; ctx.lineWidth = 1;
  for (let x = step; x < w; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = step; y < h; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  ctx.restore();
}

/* ═══════════════════════════════════════════════════
 * SIMULATION 1 — Force Balance Lab
 * Interactive left/right forces, live net-force bar + FBD
 * ═══════════════════════════════════════════════════ */
export function Ultra1_ForceBalanceLab() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [fl, setFl] = useState(30);
  const [fr, setFr] = useState(50);
  const posRef = useRef(0);
  const velRef = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const mass = 5;

    function draw(t: number) {
      const net = fr - fl;
      const a = net / mass;
      velRef.current += a * 0.016;
      velRef.current *= 0.98;
      posRef.current += velRef.current * 0.5;
      posRef.current = Math.max(-120, Math.min(120, posRef.current));

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, W, H);
      grid(ctx, W, H);

      /* Surface */
      ctx.fillStyle = "#1e3050"; ctx.fillRect(0, H * 0.62, W, 4);

      /* Block */
      const bx = W / 2 + posRef.current - 28, by = H * 0.62 - 56;
      ctx.fillStyle = P.blue;
      rr(ctx, bx, by, 56, 56, 8); ctx.fill();
      ctx.strokeStyle = P.blueHi; ctx.lineWidth = 1.5;
      rr(ctx, bx, by, 56, 56, 8); ctx.stroke();
      txt(ctx, "5 kg", bx + 28, by + 28, "#fff", 12, "center", true);

      /* Force arrows */
      const mid = bx + 28, my = by + 28;
      arrow(ctx, mid, my, mid - fl * 1.8, my, P.red, 2.5, `FL=${fl}N`);
      arrow(ctx, mid, my, mid + fr * 1.8, my, P.green, 2.5, `FR=${fr}N`);

      /* Net force bar */
      const bary = H * 0.82;
      ctx.fillStyle = P.panel; rr(ctx, W / 2 - 150, bary - 12, 300, 24, 6); ctx.fill();
      ctx.strokeStyle = P.border; ctx.lineWidth = 1; rr(ctx, W / 2 - 150, bary - 12, 300, 24, 6); ctx.stroke();

      const barLen = Math.min(Math.abs(net) * 3, 145);
      const barCol = net > 0 ? P.green : net < 0 ? P.red : P.amber;
      if (Math.abs(net) > 0.1) {
        ctx.fillStyle = barCol + "99";
        rr(ctx, net > 0 ? W / 2 : W / 2 - barLen, bary - 10, barLen, 20, 4);
        ctx.fill();
        ctx.fillStyle = barCol; ctx.fillRect(W / 2 - 1, bary - 12, 2, 24);
      } else {
        ctx.fillStyle = P.amber + "99"; ctx.fillRect(W / 2 - 30, bary - 10, 60, 20);
      }

      txt(ctx, `Fnet = ${net > 0 ? "+" : ""}${net.toFixed(1)} N`, W / 2, bary, "#fff", 11, "center", true);

      /* Readouts */
      txt(ctx, "Force Balance Lab", 16, 22, P.blueHi, 13, "left", true);
      txt(ctx, `a = ${(a).toFixed(2)} m/s²  |  v = ${velRef.current.toFixed(1)} m/s`, W / 2, 22, P.dim, 11, "center");
      const bal = Math.abs(net) < 0.1 ? "⚖ BALANCED" : `⚡ ${net > 0 ? "→" : "←"} Net force`;
      txt(ctx, bal, W - 16, 22, Math.abs(net) < 0.1 ? P.amber : barCol, 11, "right", true);

      raf.current = requestAnimationFrame(draw);
    }
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [fl, fr]);

  return (
    <div style={{ background: P.bg, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden", fontFamily: "Inter,system-ui,sans-serif" }}>
      <canvas ref={ref} width={640} height={H} style={{ width: W, height: "auto", display: "block" }} />
      <div style={{ padding: "14px 20px", display: "flex", gap: 32, flexWrap: "wrap", background: P.panel, borderTop: `1px solid ${P.border}` }}>
        {[{ label: "Left Force (N)", val: fl, set: setFl, col: P.red },
          { label: "Right Force (N)", val: fr, set: setFr, col: P.green }]
          .map(({ label, val, set, col }) => (
            <label key={label} style={{ flex: 1, minWidth: 180 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: P.dim }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: col }}>{val} N</span>
              </div>
              <input type="range" min={0} max={80} value={val}
                onChange={e => { set(+e.target.value); posRef.current = 0; velRef.current = 0; }}
                style={{ width: "100%", accentColor: col }} />
            </label>
          ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
 * SIMULATION 2 — 2D Vector Addition (Parallelogram Law)
 * ═══════════════════════════════════════════════════ */
export function Ultra1_VectorAddition2D() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [f1, setF1] = useState(60);
  const [f2, setF2] = useState(45);
  const [ang1, setAng1] = useState(30);
  const [ang2, setAng2] = useState(150);
  const raf = useRef(0);
  const t = useRef(0);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CW = c.width, CH = c.height;

    function draw() {
      t.current += 0.02;
      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, CW, CH);
      grid(ctx, CW, CH);

      const cx = CW / 2, cy = CH / 2 + 20;
      const scale = 1.4;
      const a1 = (ang1 * Math.PI) / 180, a2 = (ang2 * Math.PI) / 180;
      const v1x = f1 * Math.cos(a1) * scale, v1y = -f1 * Math.sin(a1) * scale;
      const v2x = f2 * Math.cos(a2) * scale, v2y = -f2 * Math.sin(a2) * scale;
      const rx = v1x + v2x, ry = v1y + v2y;
      const rmag = Math.hypot(rx, ry);

      /* Parallelogram */
      ctx.save();
      ctx.strokeStyle = P.faint; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(cx + v1x, cy + v1y);
      ctx.lineTo(cx + rx, cy + ry);
      ctx.moveTo(cx + v2x, cy + v2y);
      ctx.lineTo(cx + rx, cy + ry);
      ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();

      /* Shaded parallelogram area */
      ctx.save();
      ctx.fillStyle = "rgba(37,99,235,0.08)";
      ctx.beginPath();
      ctx.moveTo(cx, cy); ctx.lineTo(cx + v1x, cy + v1y);
      ctx.lineTo(cx + rx, cy + ry); ctx.lineTo(cx + v2x, cy + v2y);
      ctx.closePath(); ctx.fill(); ctx.restore();

      /* Force vectors */
      arrow(ctx, cx, cy, cx + v1x, cy + v1y, P.green, 3, `F₁=${f1}N`);
      arrow(ctx, cx, cy, cx + v2x, cy + v2y, P.red, 3, `F₂=${f2}N`);

      /* Resultant with pulsing glow */
      const pulse = 1 + 0.07 * Math.sin(t.current * 3);
      ctx.save();
      ctx.shadowColor = P.amber; ctx.shadowBlur = 10 * pulse;
      arrow(ctx, cx, cy, cx + rx, cy + ry, P.amber, 3.5, `R=${rmag.toFixed(1)}N`);
      ctx.restore();

      /* Origin dot */
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill();

      /* Angle labels */
      txt(ctx, `θ₁=${ang1}°`, 16, 22, P.green, 12, "left", true);
      txt(ctx, `θ₂=${ang2}°`, CW / 2, 22, P.red, 12, "center", true);
      txt(ctx, `|R| = ${rmag.toFixed(1)} N`, CW - 16, 22, P.amber, 12, "right", true);
      txt(ctx, "Parallelogram Law of Vector Addition", CW / 2, CH - 18, P.dim, 11, "center");

      raf.current = requestAnimationFrame(draw);
    }
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [f1, f2, ang1, ang2]);

  return (
    <div style={{ background: P.bg, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden", fontFamily: "Inter,system-ui,sans-serif" }}>
      <canvas ref={ref} width={640} height={H} style={{ width: W, height: "auto", display: "block" }} />
      <div style={{ padding: "14px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 32px", background: P.panel, borderTop: `1px solid ${P.border}` }}>
        {[{ label: "F₁ magnitude (N)", val: f1, set: setF1, col: P.green, min: 10, max: 100 },
          { label: "F₂ magnitude (N)", val: f2, set: setF2, col: P.red, min: 10, max: 100 },
          { label: "F₁ angle (°)", val: ang1, set: setAng1, col: P.green, min: 0, max: 180 },
          { label: "F₂ angle (°)", val: ang2, set: setAng2, col: P.red, min: 0, max: 360 }]
          .map(({ label, val, set, col, min, max }) => (
            <label key={label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: P.dim }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: col }}>{val}</span>
              </div>
              <input type="range" min={min} max={max} value={val}
                onChange={e => set(+e.target.value)} style={{ width: "100%", accentColor: col }} />
            </label>
          ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
 * SIMULATION 3 — Static vs Kinetic Friction
 * Increasing push force overcomes static friction threshold
 * ═══════════════════════════════════════════════════ */
export function Ultra1_StaticKinetic() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [push, setPush] = useState(20);
  const [mass, setMass] = useState(10);
  const posRef = useRef(200);
  const velRef = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CW = c.width, CH = c.height;
    const g = 9.8, mus = 0.5, muk = 0.35;

    function draw() {
      const Fn = mass * g;
      const fs_max = mus * Fn;
      const fk = muk * Fn;
      const moving = push > fs_max || velRef.current > 0.01;

      if (moving) {
        const fnet = push - fk;
        velRef.current += (fnet / mass) * 0.025;
        velRef.current = Math.max(0, velRef.current);
        posRef.current += velRef.current;
        if (posRef.current > CW - 60) posRef.current = 60;
      } else {
        velRef.current = 0;
      }

      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, CW, CH);
      grid(ctx, CW, CH);

      /* Ground */
      const gy = CH * 0.65;
      ctx.fillStyle = "#1e3050"; ctx.fillRect(0, gy, CW, 4);
      /* Ground texture */
      ctx.save(); ctx.strokeStyle = "#2a4060"; ctx.lineWidth = 1;
      for (let x = 0; x < CW; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, gy + 4); ctx.lineTo(x - 8, gy + 18); ctx.stroke();
      }
      ctx.restore();

      /* Block */
      const bw = 60, bh = 60;
      const bx = posRef.current - bw / 2, by = gy - bh;
      const bc = moving ? P.blue : "#4b5563";
      ctx.fillStyle = bc; rr(ctx, bx, by, bw, bh, 8); ctx.fill();
      ctx.strokeStyle = moving ? P.blueHi : "#6b7280"; ctx.lineWidth = 1.5;
      rr(ctx, bx, by, bw, bh, 8); ctx.stroke();
      txt(ctx, `${mass}kg`, posRef.current, by + 30, "#fff", 12, "center", true);

      /* Forces on block */
      const mid = posRef.current, my = by + 30;
      arrow(ctx, mid, my, mid + push * 2, my, P.green, 2.5, `Push=${push}N`);
      const fric = moving ? fk : Math.min(push, fs_max);
      if (fric > 0.5) arrow(ctx, mid, my, mid - fric * 2, my, P.red, 2.5, `f=${fric.toFixed(0)}N`);

      /* Status panel */
      const py = CH * 0.82;
      const status = moving ? "KINETIC FRICTION (moving)" : push >= fs_max ? "BREAKAWAY!" : "STATIC FRICTION (at rest)";
      const sc = moving ? P.blueHi : push > fs_max * 0.9 ? P.amber : P.dim;
      ctx.fillStyle = P.panel + "cc";
      rr(ctx, CW / 2 - 160, py - 14, 320, 28, 6); ctx.fill();
      txt(ctx, status, CW / 2, py, sc, 12, "center", true);

      /* Threshold line on slider */
      txt(ctx, "Static vs Kinetic Friction Demo", 16, 22, P.blueHi, 13, "left", true);
      txt(ctx, `μₛ=0.50  μₖ=0.35  Fₛmax=${fs_max.toFixed(0)}N  Fₖ=${fk.toFixed(0)}N`, CW / 2, 22, P.dim, 10, "center");
      txt(ctx, `v = ${velRef.current.toFixed(2)} m/s`, CW - 16, 22, moving ? P.green : P.faint, 11, "right");

      raf.current = requestAnimationFrame(draw);
    }
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [push, mass]);

  return (
    <div style={{ background: P.bg, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden", fontFamily: "Inter,system-ui,sans-serif" }}>
      <canvas ref={ref} width={640} height={H} style={{ width: W, height: "auto", display: "block" }} />
      <div style={{ padding: "14px 20px", display: "flex", gap: 32, flexWrap: "wrap", background: P.panel, borderTop: `1px solid ${P.border}` }}>
        {[{ label: "Applied Force (N)", val: push, set: setPush, col: P.green, min: 0, max: 100 },
          { label: "Block Mass (kg)", val: mass, set: setMass, col: P.amber, min: 2, max: 25 }]
          .map(({ label, val, set, col, min, max }) => (
            <label key={label} style={{ flex: 1, minWidth: 180 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: P.dim }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: col }}>{val}</span>
              </div>
              <input type="range" min={min} max={max} value={val}
                onChange={e => { set(+e.target.value); posRef.current = 200; velRef.current = 0; }}
                style={{ width: "100%", accentColor: col }} />
            </label>
          ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
 * SIMULATION 4 — Elevator Forces & Scale Reading
 * Real apparent weight changes during ascent/descent/free-fall
 * ═══════════════════════════════════════════════════ */
export function Ultra1_ElevatorForces() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"rest" | "up" | "down" | "freefall">("rest");
  const posRef = useRef(0);
  const velRef = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CW = c.width, CH = c.height;
    const mass = 60, g = 9.8;
    const accelMap = { rest: 0, up: 3, down: -3, freefall: -g };

    function draw() {
      const a = accelMap[mode];
      velRef.current += a * 0.012;
      velRef.current *= 0.97;
      posRef.current += velRef.current;
      posRef.current = Math.max(-100, Math.min(100, posRef.current));

      const W = mass * g;
      const N = mass * (g + a);
      const apparent = Math.max(0, N);

      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, CW, CH);
      grid(ctx, CW, CH);

      /* Elevator shaft */
      const sx = CW / 2 - 60;
      ctx.fillStyle = "#0d1e30";
      ctx.fillRect(sx - 15, 20, 130, CH - 40);
      ctx.strokeStyle = P.border; ctx.lineWidth = 1;
      ctx.strokeRect(sx - 15, 20, 130, CH - 40);

      /* Rope */
      const ey = CH / 2 - 60 + posRef.current;
      ctx.strokeStyle = "#6b7280"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(CW / 2, 20); ctx.lineTo(CW / 2, ey); ctx.stroke();

      /* Elevator box */
      ctx.fillStyle = P.blue + "cc";
      rr(ctx, sx, ey, 100, 90, 8); ctx.fill();
      ctx.strokeStyle = P.blueHi; ctx.lineWidth = 2;
      rr(ctx, sx, ey, 100, 90, 8); ctx.stroke();

      /* Person inside */
      const px = sx + 50, py = ey + 50;
      ctx.fillStyle = P.amber;
      ctx.beginPath(); ctx.arc(px, py - 24, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = P.amber + "cc"; ctx.fillRect(px - 8, py - 12, 16, 28);

      /* Force arrows */
      arrow(ctx, px, py - 8, px, py - 8 - N * 0.4, P.purple, 2.5, `N=${apparent.toFixed(0)}N`);
      arrow(ctx, px, py - 8, px, py - 8 + W * 0.4, P.red, 2.5, `W=${W.toFixed(0)}N`);

      /* Scale dial */
      const dr = 32, dc = {x: sx - 60, y: ey + 55};
      ctx.fillStyle = P.panel;
      ctx.beginPath(); ctx.arc(dc.x, dc.y, dr, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = P.border; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(dc.x, dc.y, dr, 0, Math.PI * 2); ctx.stroke();
      const maxKg = 120, reading = apparent / g;
      const angle = -Math.PI / 2 + (reading / maxKg) * Math.PI * 1.5;
      ctx.strokeStyle = apparent < W * 0.5 ? P.red : apparent > W * 1.1 ? P.green : P.amber;
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(dc.x, dc.y);
      ctx.lineTo(dc.x + dr * 0.8 * Math.cos(angle), dc.y + dr * 0.8 * Math.sin(angle));
      ctx.stroke();
      txt(ctx, `${reading.toFixed(0)}`, dc.x, dc.y + 10, "#fff", 10, "center", true);
      txt(ctx, "kg", dc.x, dc.y + 20, P.dim, 8, "center");

      /* Status */
      const labels = { rest: "At Rest", up: "Accelerating UP ↑", down: "Decelerating / Going Down ↓", freefall: "Free Fall!" };
      const cols = { rest: P.dim, up: P.green, down: P.amber, freefall: P.red };
      txt(ctx, "Elevator Forces", 16, 22, P.blueHi, 13, "left", true);
      txt(ctx, labels[mode], CW / 2, 22, cols[mode], 12, "center", true);
      txt(ctx, `a=${a.toFixed(1)}m/s²  N=${apparent.toFixed(0)}N  W=${W.toFixed(0)}N`, CW - 16, 22, P.dim, 10, "right");

      raf.current = requestAnimationFrame(draw);
    }
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [mode]);

  return (
    <div style={{ background: P.bg, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden", fontFamily: "Inter,system-ui,sans-serif" }}>
      <canvas ref={ref} width={640} height={H} style={{ width: W, height: "auto", display: "block" }} />
      <div style={{ padding: "14px 20px", display: "flex", gap: 10, background: P.panel, borderTop: `1px solid ${P.border}` }}>
        {(["rest", "up", "down", "freefall"] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); posRef.current = 0; velRef.current = 0; }}
            style={{
              flex: 1, padding: "8px 0", borderRadius: 8, border: `1px solid ${mode === m ? P.blueHi : P.border}`,
              background: mode === m ? P.blue + "44" : "transparent", color: mode === m ? P.blueHi : P.dim,
              fontSize: 12, fontWeight: mode === m ? 700 : 400, cursor: "pointer"
            }}>
            {m === "rest" ? "At Rest" : m === "up" ? "Accel. Up ↑" : m === "down" ? "Decel. Down ↓" : "Free Fall!"}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
 * SIMULATION 5 — Inclined Plane Block
 * Angle slider, all forces shown: weight, normal, friction
 * ═══════════════════════════════════════════════════ */
export function Ultra1_InclinedBlock() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(25);
  const [mu, setMu] = useState(0.3);
  const posRef = useRef(0.5);
  const velRef = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CW = c.width, CH = c.height;
    const mass = 5, g = 9.8;

    function draw() {
      const th = (angle * Math.PI) / 180;
      const Wt = mass * g;
      const Wx = Wt * Math.sin(th);
      const Wy = Wt * Math.cos(th);
      const N = Wy;
      const fric = mu * N;
      const Fnet = Wx - fric;

      if (Fnet > 0) {
        velRef.current += (Fnet / mass) * 0.016;
      } else {
        velRef.current *= 0.94;
      }
      posRef.current += velRef.current * 0.01;
      if (posRef.current > 0.95) posRef.current = 0.05;

      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, CW, CH);
      grid(ctx, CW, CH);

      /* Inclined plane */
      const bx1 = 60, by1 = CH - 40, bx2 = CW - 100, by2 = CH - 40;
      const topX = bx2, topY = by1 - (bx2 - bx1) * Math.tan(th);

      ctx.save();
      ctx.fillStyle = "#1e3050";
      ctx.beginPath();
      ctx.moveTo(bx1, by1); ctx.lineTo(bx2, topY); ctx.lineTo(bx2, by1);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = P.border; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(bx1, by1); ctx.lineTo(bx2, topY); ctx.stroke();
      ctx.restore();

      /* Angle arc */
      ctx.save(); ctx.strokeStyle = P.amber; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(bx1, by1, 40, -th, 0); ctx.stroke();
      txt(ctx, `${angle}°`, bx1 + 50, by1 - 12, P.amber, 12, "center", true);
      ctx.restore();

      /* Block position along incline */
      const len = Math.hypot(bx2 - bx1, topY - by1);
      const t = Math.max(0.05, Math.min(0.9, posRef.current));
      const bx = bx1 + (bx2 - bx1) * t - 15 * Math.cos(th) + 15 * Math.sin(th);
      const by = by1 + (topY - by1) * t - 15 * Math.sin(th) - 15 * Math.cos(th);

      ctx.save();
      ctx.translate(bx + 15, by + 15);
      ctx.rotate(-th);
      ctx.fillStyle = P.blue;
      rr(ctx, -18, -18, 36, 36, 6); ctx.fill();
      ctx.strokeStyle = P.blueHi; ctx.lineWidth = 1.5;
      rr(ctx, -18, -18, 36, 36, 6); ctx.stroke();
      ctx.restore();

      /* Forces from block center */
      const fcx = bx + 15, fcy = by + 15;
      const sc = 2.8;
      /* Weight straight down */
      arrow(ctx, fcx, fcy, fcx, fcy + Wt * sc * 0.3, P.red, 2, `W=${Wt.toFixed(0)}N`);
      /* Normal perpendicular to surface */
      arrow(ctx, fcx, fcy, fcx - N * sc * 0.3 * Math.sin(th), fcy - N * sc * 0.3 * Math.cos(th), P.purple, 2, `N=${N.toFixed(0)}N`);
      /* Friction up the incline */
      if (fric > 0.5)
        arrow(ctx, fcx, fcy, fcx - fric * sc * 0.3 * Math.cos(th), fcy + fric * sc * 0.3 * Math.sin(th), P.amber, 2, `f=${fric.toFixed(0)}N`);

      /* Readouts */
      txt(ctx, "Inclined Plane Forces", 16, 22, P.blueHi, 13, "left", true);
      txt(ctx, `Fdown=${Wx.toFixed(1)}N  Ffriction=${fric.toFixed(1)}N  Fnet=${Fnet.toFixed(1)}N`, CW / 2, 22, P.dim, 10, "center");
      const stat = Fnet > 0.5 ? "Sliding ↓" : "Stationary";
      txt(ctx, stat, CW - 16, 22, Fnet > 0.5 ? P.green : P.amber, 11, "right", true);

      raf.current = requestAnimationFrame(draw);
    }
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [angle, mu]);

  return (
    <div style={{ background: P.bg, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden", fontFamily: "Inter,system-ui,sans-serif" }}>
      <canvas ref={ref} width={640} height={H} style={{ width: W, height: "auto", display: "block" }} />
      <div style={{ padding: "14px 20px", display: "flex", gap: 32, flexWrap: "wrap", background: P.panel, borderTop: `1px solid ${P.border}` }}>
        {[{ label: "Incline Angle (°)", val: angle, set: setAngle, col: P.amber, min: 5, max: 60, step: 1 },
          { label: "Friction Coefficient μ", val: mu, set: setMu, col: P.purple, min: 0, max: 0.8, step: 0.05 }]
          .map(({ label, val, set, col, min, max, step }) => (
            <label key={label} style={{ flex: 1, minWidth: 180 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: P.dim }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: col }}>{typeof val === "number" ? val.toFixed(step < 1 ? 2 : 0) : val}</span>
              </div>
              <input type="range" min={min} max={max} step={step} value={val}
                onChange={e => { set(+e.target.value); posRef.current = 0.5; velRef.current = 0; }}
                style={{ width: "100%", accentColor: col }} />
            </label>
          ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
 * SIMULATION 6 — FBD: Book on Table (Force Pairs)
 * Shows all four forces with Newton's 3rd law pairs labeled
 * ═══════════════════════════════════════════════════ */
export function Ultra1_ForcePairsTable() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [mass, setMass] = useState(2);
  const raf = useRef(0);
  const t = useRef(0);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CW = c.width, CH = c.height;
    const g = 9.8;

    function draw() {
      t.current += 0.025;
      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, CW, CH);
      grid(ctx, CW, CH);

      const W = mass * g;
      const scale = Math.max(1.5, Math.min(4, 40 / W));

      /* Table */
      ctx.fillStyle = "#6b4226";
      rr(ctx, CW / 2 - 140, CH / 2, 280, 16, 4); ctx.fill();
      ctx.strokeStyle = "#8b5e3c"; ctx.lineWidth = 1;
      rr(ctx, CW / 2 - 140, CH / 2, 280, 16, 4); ctx.stroke();
      /* Table legs */
      ctx.fillStyle = "#6b4226";
      ctx.fillRect(CW / 2 - 130, CH / 2 + 16, 16, 80);
      ctx.fillRect(CW / 2 + 114, CH / 2 + 16, 16, 80);

      /* Book */
      const bx = CW / 2 - 35, by = CH / 2 - 44;
      ctx.fillStyle = "#e11d48";
      rr(ctx, bx, by, 70, 44, 5); ctx.fill();
      ctx.strokeStyle = "#fb7185"; ctx.lineWidth = 1.5;
      rr(ctx, bx, by, 70, 44, 5); ctx.stroke();
      txt(ctx, "Book", bx + 35, by + 22, "#fff", 11, "center", true);

      /* Book center */
      const bcx = bx + 35, bcy = by + 22;
      const arLen = W * scale;

      /* Weight (Earth pulls book down) */
      arrow(ctx, bcx, bcy, bcx, bcy + arLen, P.red, 2.5);
      txt(ctx, `W = ${W.toFixed(1)} N`, bcx + 8, bcy + arLen * 0.6, P.red, 10);
      txt(ctx, "(Earth→Book)", bcx + 8, bcy + arLen * 0.6 + 13, P.red, 9);

      /* Normal from table on book (upward) */
      arrow(ctx, bcx, bcy, bcx, bcy - arLen, P.purple, 2.5);
      txt(ctx, `N = ${W.toFixed(1)} N`, bcx + 8, bcy - arLen * 0.6, P.purple, 10);
      txt(ctx, "(Table→Book)", bcx + 8, bcy - arLen * 0.6 + 13, P.purple, 9);

      /* Pulsing "balanced" indicator */
      const pulse = 0.7 + 0.3 * Math.sin(t.current * 2);
      ctx.save();
      ctx.globalAlpha = pulse;
      ctx.fillStyle = P.amber + "22";
      ctx.beginPath(); ctx.arc(bcx, bcy, 26, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      /* Reaction pair: book pushes table down */
      const tcx = CW / 2 - 80, tcy = CH / 2 + 8;
      arrow(ctx, tcx, tcy, tcx, tcy + arLen * 0.7, P.amber, 2);
      txt(ctx, `R = ${W.toFixed(1)} N`, tcx - 4, tcy + arLen * 0.4, P.amber, 9, "right");
      txt(ctx, "(Book→Table)", tcx - 4, tcy + arLen * 0.4 + 13, P.amber, 8, "right");

      /* Earth pull label */
      arrow(ctx, CW / 2 + 80, CH - 30, CW / 2 + 80, CH - 30 - arLen * 0.5, P.cyan, 2);
      txt(ctx, `Book→Earth = ${W.toFixed(1)} N`, CW / 2 + 88, CH - 30 - arLen * 0.25, P.cyan, 9);

      /* Legend */
      txt(ctx, "FBD — Book on Table (Newton's Action-Reaction)", 16, 22, P.blueHi, 13, "left", true);
      txt(ctx, `Mass = ${mass} kg  |  Weight = ${W.toFixed(1)} N  |  Balanced forces: Fnet = 0`, CW / 2, 22, P.dim, 10, "center");

      raf.current = requestAnimationFrame(draw);
    }
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [mass]);

  return (
    <div style={{ background: P.bg, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden", fontFamily: "Inter,system-ui,sans-serif" }}>
      <canvas ref={ref} width={640} height={H} style={{ width: W, height: "auto", display: "block" }} />
      <div style={{ padding: "14px 20px", background: P.panel, borderTop: `1px solid ${P.border}` }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, color: P.dim }}>Book Mass (kg)</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: P.amber }}>{mass} kg</span>
          </div>
          <input type="range" min={0.5} max={10} step={0.5} value={mass}
            onChange={e => setMass(+e.target.value)} style={{ width: "100%", accentColor: P.amber }} />
        </label>
      </div>
    </div>
  );
}
