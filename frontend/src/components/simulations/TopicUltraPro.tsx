"use client";
/**
 * TopicUltraPro.tsx
 * 25 ultra-professional, animated, real-physics simulations for
 * CBSE Class 9 NCERT — Chapter: Force and Laws of Motion.
 * 5 simulations per topic × 5 topics = 25 total.
 * Pure HTML5 Canvas, 60 fps, fully interactive.
 */

import React, { useRef, useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════
 * PHYSICS CONSTANTS
 * ═══════════════════════════════════════════════════════ */
const G   = 9.8;
const DT  = 1 / 60;

/* ═══════════════════════════════════════════════════════
 * SHARED STYLES
 * ═══════════════════════════════════════════════════════ */
const WS: React.CSSProperties = {
  background: "#050d1a", borderRadius: 16, overflow: "hidden",
  border: "1px solid rgba(99,102,241,0.18)", fontFamily: "system-ui, sans-serif",
};
const HS: React.CSSProperties = { padding: "14px 18px 10px", borderBottom: "1px solid rgba(99,102,241,0.1)" };
const TS: React.CSSProperties = { margin: 0, fontSize: 14, fontWeight: 700, color: "#E2E8F0" };
const DS: React.CSSProperties = { margin: "4px 0 0", fontSize: 11.5, color: "#94A3B8", lineHeight: 1.55 };
const CS: React.CSSProperties = { width: "100%", height: 250, display: "block" };
const CRS: React.CSSProperties = {
  padding: "10px 18px", display: "flex", flexWrap: "wrap", gap: 14,
  borderTop: "1px solid rgba(99,102,241,0.1)", alignItems: "center",
  background: "rgba(0,0,0,0.2)",
};
const SGS: React.CSSProperties = { flex: "1 1 120px" };
const SLS: React.CSSProperties = { display: "block", fontSize: 10.5, color: "#94A3B8", marginBottom: 4 };
const SS:  React.CSSProperties = { width: "100%", accentColor: "#6366f1", cursor: "pointer" };
const BS:  React.CSSProperties = {
  padding: "5px 14px", borderRadius: 8,
  border: "1px solid rgba(99,102,241,0.35)", background: "rgba(99,102,241,0.12)",
  color: "#818cf8", fontSize: 11, cursor: "pointer", fontFamily: "monospace", flexShrink: 0,
};

/* ═══════════════════════════════════════════════════════
 * CANVAS UTILITIES
 * ═══════════════════════════════════════════════════════ */
type CTX = CanvasRenderingContext2D;

function SC(c: HTMLCanvasElement): [CTX, number, number] | null {
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  const d = window.devicePixelRatio || 1;
  const W = c.clientWidth  || 560;
  const H = c.clientHeight || 250;
  if (c.width !== W * d || c.height !== H * d) { c.width = W * d; c.height = H * d; }
  ctx.setTransform(d, 0, 0, d, 0, 0);
  return [ctx, W, H];
}

function BG(ctx: CTX, W: number, H: number) {
  ctx.fillStyle = "#050d1a"; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(99,102,241,0.05)"; ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
}

function ARW(ctx: CTX, x1: number, y1: number, x2: number, y2: number, col: string, lbl = "", lw = 2.5) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy);
  if (len < 4) return;
  const ux = dx / len, uy = dy / len, ah = Math.min(13, len * 0.38);
  ctx.save();
  ctx.strokeStyle = ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - ah * (ux - 0.38 * uy), y2 - ah * (uy + 0.38 * ux));
  ctx.lineTo(x2 - ah * (ux + 0.38 * uy), y2 - ah * (uy - 0.38 * ux));
  ctx.closePath(); ctx.fill();
  if (lbl) { ctx.font = "bold 10px monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(lbl, x2 + ux * 20, y2 + uy * 15); }
  ctx.restore();
}

function TXT(ctx: CTX, s: string, x: number, y: number, col = "#CBD5E1", sz = 11, al: CanvasTextAlign = "center") {
  ctx.save();
  ctx.font = `${sz}px monospace`; ctx.fillStyle = col; ctx.textAlign = al; ctx.textBaseline = "middle";
  ctx.fillText(s, x, y); ctx.restore();
}

function BOX(ctx: CTX, cx: number, cy: number, w: number, h: number, c1: string, c2: string, lbl = "") {
  const x = cx - w / 2, y = cy - h / 2, r = 7;
  const grd = ctx.createLinearGradient(x, y, x, y + h);
  grd.addColorStop(0, c1); grd.addColorStop(1, c2);
  ctx.save(); ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.18)"; ctx.lineWidth = 1; ctx.stroke();
  if (lbl) { ctx.font = "bold 11px monospace"; ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(lbl, cx, cy); }
  ctx.restore();
}

function GND(ctx: CTX, W: number, Y: number, col = "#1e293b") {
  const g = ctx.createLinearGradient(0, Y, 0, Y + 30);
  g.addColorStop(0, col); g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g; ctx.fillRect(0, Y, W, 30);
  ctx.strokeStyle = "rgba(148,163,184,0.35)"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(0, Y); ctx.lineTo(W, Y); ctx.stroke();
}

function CIR(ctx: CTX, cx: number, cy: number, r: number, col: string) {
  const g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
  const hi = col.replace(/[0-9a-f]{2}$/i, "ff");
  g.addColorStop(0, hi); g.addColorStop(1, col);
  ctx.save(); ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.restore();
}

function LABEL(ctx: CTX, s: string, x: number, y: number, col: string) {
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  const m = ctx.measureText(s);
  ctx.fillRect(x - m.width / 2 - 5, y - 9, m.width + 10, 18);
  TXT(ctx, s, x, y, col, 11);
  ctx.restore();
}

/* ════════════════════════════════════════════════════════════════════
 * TOPIC 1: BALANCED AND UNBALANCED FORCES
 * ════════════════════════════════════════════════════════════════════ */

/**
 * 1. Force Vector Lab — interactive net force demo
 *    ID: force-vector-lab-pro
 */
export function Sim_force_vector_lab_pro() {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = useRef({ x: 0, v: 0 });
  const [fl, setFl] = useState(15);
  const [fr, setFr] = useState(35);
  const flR = useRef(fl), frR = useRef(fr);
  useEffect(() => { flR.current = fl; }, [fl]);
  useEffect(() => { frR.current = fr; }, [fr]);
  const [rst, setRst] = useState(0);

  useEffect(() => {
    p.current = { x: 0, v: 0 };
    let id: number;
    const tick = () => {
      const c = ref.current; if (!c) { id = requestAnimationFrame(tick); return; }
      const res = SC(c); if (!res) { id = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const s = p.current;
      const m = 5, mu = 0.25, FL = flR.current, FR = frR.current;
      const fric = s.v !== 0 ? Math.sign(s.v) * mu * m * G : Math.min(Math.abs(FR - FL), mu * m * G) * Math.sign(FR - FL);
      const fnet = FR - FL - fric;
      const a = fnet / m;
      s.v += a * DT;
      s.x = Math.max(-(W / 2 - 55), Math.min(W / 2 - 55, s.x + s.v * DT * 55));

      BG(ctx, W, H);
      const gY = H - 45;
      GND(ctx, W, gY);
      const cx = W / 2 + s.x, cy = gY - 28;
      BOX(ctx, cx, cy, 52, 52, "#4f46e5", "#7c3aed", "5 kg");
      if (FL > 0.5) ARW(ctx, cx - 26, cy, cx - 26 - FL * 2.2, cy, "#f87171", `${FL.toFixed(0)}N`);
      if (FR > 0.5) ARW(ctx, cx + 26, cy, cx + 26 + FR * 2.2, cy, "#34d399", `${FR.toFixed(0)}N`);
      const net = FR - FL;
      if (Math.abs(net) > 0.5) ARW(ctx, W / 2, gY - 82, W / 2 + net * 2.2, gY - 82, "#fbbf24", `Net=${net.toFixed(0)}N`, 3);
      TXT(ctx, `v = ${s.v.toFixed(2)} m/s   a = ${a.toFixed(2)} m/s²`, W / 2, H - 14, "#64748B", 10);
      TXT(ctx, Math.abs(net) < 1 ? "⚖ BALANCED — no acceleration" : `⚡ UNBALANCED — a = F/m = ${(net / m).toFixed(1)} m/s²`, W / 2, gY - 105, Math.abs(net) < 1 ? "#34d399" : "#fbbf24", 11);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [rst]);

  return (
    <div style={WS}>
      <div style={HS}><p style={TS}>Force Vector Lab — Net Force &amp; Motion</p>
        <p style={DS}>Adjust left/right forces. When F<sub>net</sub> = 0 → balanced (no motion). When F<sub>net</sub> ≠ 0 → unbalanced (acceleration). Friction included.</p>
      </div>
      <canvas ref={ref} style={CS} />
      <div style={CRS}>
        <div style={SGS}><label style={SLS}>← Left Force: {fl} N</label><input type="range" min={0} max={80} value={fl} onChange={e => setFl(+e.target.value)} style={SS} /></div>
        <div style={SGS}><label style={SLS}>Right Force →: {fr} N</label><input type="range" min={0} max={80} value={fr} onChange={e => setFr(+e.target.value)} style={SS} /></div>
        <button style={BS} onClick={() => setRst(r => r + 1)}>Reset</button>
      </div>
    </div>
  );
}

/**
 * 2. Tug of War — live force competition
 *    ID: tug-war-live
 */
export function Sim_tug_war_live() {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = useRef({ knot: 0, knotV: 0 });
  const [ta, setTa] = useState(40);
  const [tb, setTb] = useState(40);
  const taR = useRef(ta), tbR = useRef(tb);
  useEffect(() => { taR.current = ta; }, [ta]);
  useEffect(() => { tbR.current = tb; }, [tb]);
  const [rst, setRst] = useState(0);

  useEffect(() => {
    p.current = { knot: 0, knotV: 0 };
    let id: number;
    const tick = () => {
      const c = ref.current; if (!c) { id = requestAnimationFrame(tick); return; }
      const res = SC(c); if (!res) { id = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const s = p.current;
      const mass = 8, TA = taR.current, TB = tbR.current;
      const fnet = TA - TB;
      s.knotV += (fnet / mass) * DT;
      s.knot = Math.max(-W / 2 + 80, Math.min(W / 2 - 80, s.knot + s.knotV * DT * 40));

      BG(ctx, W, H);
      const cy = H / 2 + 10;
      const kx = W / 2 + s.knot;

      // Rope
      ctx.save(); ctx.strokeStyle = "#ca8a04"; ctx.lineWidth = 6; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(70, cy); ctx.lineTo(kx, cy); ctx.stroke();
      ctx.strokeStyle = "#b45309";
      ctx.beginPath(); ctx.moveTo(kx, cy); ctx.lineTo(W - 70, cy); ctx.stroke();
      ctx.restore();

      // Knot
      CIR(ctx, kx, cy, 12, "#fbbf24");
      TXT(ctx, "🏁", kx, cy - 25, "#fbbf24", 14);

      // Team A (left, pulls right toward them)
      BOX(ctx, 55, cy, 70, 40, "#1d4ed8", "#3b82f6", "Team A");
      TXT(ctx, `${ta}N →`, 55, cy + 30, "#60a5fa", 10);

      // Team B (right, pulls left toward them)
      BOX(ctx, W - 55, cy, 70, 40, "#b91c1c", "#ef4444", "Team B");
      TXT(ctx, `← ${tb}N`, W - 55, cy + 30, "#f87171", 10);

      // Status
      const status = Math.abs(fnet) < 1 ? "⚖ BALANCED — tied!" : fnet > 0 ? "Team A winning!" : "Team B winning!";
      TXT(ctx, status, W / 2, cy - 55, Math.abs(fnet) < 1 ? "#34d399" : "#fbbf24", 13);
      TXT(ctx, `Net Force: ${fnet > 0 ? "+" : ""}${fnet.toFixed(0)} N`, W / 2, H - 14, "#64748B", 10);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [rst]);

  return (
    <div style={WS}>
      <div style={HS}><p style={TS}>Tug of War — Balanced vs Unbalanced Forces</p>
        <p style={DS}>When Team A force = Team B force → balanced, knot stays still. When unequal → unbalanced, knot moves. Classic Class 9 example!</p>
      </div>
      <canvas ref={ref} style={CS} />
      <div style={CRS}>
        <div style={SGS}><label style={SLS}>Team A Force: {ta} N</label><input type="range" min={10} max={100} value={ta} onChange={e => setTa(+e.target.value)} style={SS} /></div>
        <div style={SGS}><label style={SLS}>Team B Force: {tb} N</label><input type="range" min={10} max={100} value={tb} onChange={e => setTb(+e.target.value)} style={SS} /></div>
        <button style={BS} onClick={() => setRst(r => r + 1)}>Reset</button>
      </div>
    </div>
  );
}

/**
 * 3. Weight and Normal Force — the balancing pair
 *    ID: gravity-normal-pair
 */
export function Sim_gravity_normal_pair() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [mass, setMass] = useState(5);
  const massR = useRef(mass);
  useEffect(() => { massR.current = mass; }, [mass]);
  const [rst, setRst] = useState(0);

  useEffect(() => {
    let t = 0, id: number;
    const tick = () => {
      const c = ref.current; if (!c) { id = requestAnimationFrame(tick); return; }
      const res = SC(c); if (!res) { id = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      t += DT;
      const m = massR.current;
      const W_force = m * G;
      const scale = Math.min(120, W_force * 3);

      BG(ctx, W, H);
      const gY = H - 50, cx = W / 2, cy = gY - 30;
      GND(ctx, W, gY);
      BOX(ctx, cx, cy, 60, 60, "#0ea5e9", "#0284c7", `${m} kg`);

      // Weight arrow (down)
      ARW(ctx, cx, cy + 30, cx, cy + 30 + scale, "#f87171", `W=${W_force.toFixed(0)}N`, 3);
      TXT(ctx, "Weight = mg (Earth pulls block down)", cx, cy + 30 + scale + 20, "#f87171", 10);

      // Normal arrow (up)
      ARW(ctx, cx, cy - 30, cx, cy - 30 - scale, "#34d399", `N=${W_force.toFixed(0)}N`, 3);
      TXT(ctx, "Normal Force (surface pushes block up)", cx, cy - 30 - scale - 20, "#34d399", 10);

      // Equilibrium label
      const pulse = 0.85 + 0.15 * Math.sin(t * 3);
      ctx.globalAlpha = pulse;
      TXT(ctx, "⚖ W = N  →  Balanced Forces  →  Object at REST", cx, H - 14, "#fbbf24", 11);
      ctx.globalAlpha = 1;
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [rst]);

  return (
    <div style={WS}>
      <div style={HS}><p style={TS}>Weight &amp; Normal Force — Balanced Vertical Forces</p>
        <p style={DS}>Weight W = mg acts downward. Normal force N = mg acts upward. Since W = N, the net vertical force is zero — the block stays at rest.</p>
      </div>
      <canvas ref={ref} style={CS} />
      <div style={CRS}>
        <div style={SGS}><label style={SLS}>Mass: {mass} kg</label><input type="range" min={1} max={15} value={mass} onChange={e => setMass(+e.target.value)} style={SS} /></div>
        <button style={BS} onClick={() => setRst(r => r + 1)}>Reset</button>
      </div>
    </div>
  );
}

/**
 * 4. Static vs Kinetic Friction Threshold
 *    ID: friction-threshold
 */
export function Sim_friction_threshold() {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = useRef({ x: 0, v: 0, moving: false });
  const [applied, setApplied] = useState(10);
  const appR = useRef(applied);
  useEffect(() => { appR.current = applied; }, [applied]);
  const [rst, setRst] = useState(0);

  useEffect(() => {
    p.current = { x: 0, v: 0, moving: false };
    let id: number;
    const tick = () => {
      const c = ref.current; if (!c) { id = requestAnimationFrame(tick); return; }
      const res = SC(c); if (!res) { id = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const s = p.current;
      const m = 4, mus = 0.45, muk = 0.3;
      const FA = appR.current;
      const fs_max = mus * m * G;
      const fk = muk * m * G;

      if (!s.moving) {
        if (FA > fs_max) { s.moving = true; }
      }
      if (s.moving) {
        const fnet = FA - fk;
        s.v += (fnet / m) * DT;
        s.x = Math.min(W / 2 - 55, s.x + s.v * DT * 50);
        if (s.x >= W / 2 - 55) { s.x = -(W / 2 - 55); s.v = 0; s.moving = false; }
      }

      BG(ctx, W, H);
      const gY = H - 45; GND(ctx, W, gY);
      const cx = 80 + s.x, cy = gY - 28;
      BOX(ctx, cx, cy, 52, 52, "#7c3aed", "#6d28d9", "4 kg");

      // Applied force
      ARW(ctx, cx + 26, cy, cx + 26 + FA * 2.5, cy, "#34d399", `FA=${FA.toFixed(0)}N`);

      // Friction force
      const fric = s.moving ? fk : Math.min(FA, fs_max);
      if (fric > 0.5) ARW(ctx, cx - 26, cy, cx - 26 - fric * 2.5, cy, "#f87171", `f=${fric.toFixed(0)}N`);

      // Status
      const status = s.moving
        ? `⚡ Moving! Kinetic friction = ${fk.toFixed(1)} N`
        : FA > fs_max - 0.5
        ? `🔓 About to slip! Static friction max = ${fs_max.toFixed(1)} N`
        : `🔒 Static friction holds: f = ${FA.toFixed(0)} N (max ${fs_max.toFixed(1)} N)`;
      TXT(ctx, status, W / 2, gY - 75, s.moving ? "#fbbf24" : "#34d399", 11);

      // Threshold bar
      const bx = W - 110, by = 20, bh = H - 80;
      ctx.strokeStyle = "rgba(99,102,241,0.3)"; ctx.lineWidth = 1; ctx.strokeRect(bx, by, 18, bh);
      const fill = (FA / (mus * m * G * 1.5)) * bh;
      const fc = FA > fs_max ? "#f87171" : "#34d399";
      ctx.fillStyle = fc; ctx.fillRect(bx + 1, by + bh - fill, 16, fill);
      TXT(ctx, "FA", bx + 9, by + bh + 12, "#94A3B8", 10);
      const thY = by + bh - (fs_max / (mus * m * G * 1.5)) * bh;
      ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(bx - 5, thY); ctx.lineTo(bx + 23, thY); ctx.stroke();
      ctx.setLineDash([]);
      TXT(ctx, "max", bx + 9, thY - 8, "#fbbf24", 9);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [rst]);

  return (
    <div style={WS}>
      <div style={HS}><p style={TS}>Static vs Kinetic Friction — Friction Threshold</p>
        <p style={DS}>Increase the applied force slowly. Static friction holds the block until the applied force exceeds the maximum static friction (μₛ × N). Then kinetic friction takes over.</p>
      </div>
      <canvas ref={ref} style={CS} />
      <div style={CRS}>
        <div style={SGS}><label style={SLS}>Applied Force: {applied} N</label><input type="range" min={0} max={70} value={applied} onChange={e => setApplied(+e.target.value)} style={SS} /></div>
        <button style={BS} onClick={() => setRst(r => r + 1)}>Reset</button>
      </div>
    </div>
  );
}

/**
 * 5. Equilibrium Break — from balance to motion
 *    ID: balanced-break
 */
export function Sim_balanced_break() {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = useRef({ x: 0, v: 0, phase: 0 });
  const [extra, setExtra] = useState(0);
  const extR = useRef(extra);
  useEffect(() => { extR.current = extra; }, [extra]);
  const [rst, setRst] = useState(0);

  useEffect(() => {
    p.current = { x: 0, v: 0, phase: 0 };
    let id: number;
    const tick = () => {
      const c = ref.current; if (!c) { id = requestAnimationFrame(tick); return; }
      const res = SC(c); if (!res) { id = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const s = p.current;
      const m = 3, mu = 0.3, base = 30, ext = extR.current;
      const FL = base, FR = base + ext;
      const fnet = FR - FL - Math.sign(s.v || 1) * mu * m * G * (s.v !== 0 ? 1 : 0);
      const a = fnet / m;
      s.v += a * DT;
      s.x = Math.max(-W / 2 + 60, Math.min(W / 2 - 60, s.x + s.v * DT * 55));

      BG(ctx, W, H);
      const gY = H - 45; GND(ctx, W, gY);
      const cx = W / 2 + s.x, cy = gY - 28;
      BOX(ctx, cx, cy, 52, 52, "#0ea5e9", "#0284c7", "3 kg");

      ARW(ctx, cx - 26, cy, cx - 26 - FL * 1.8, cy, "#f87171", `${FL}N`);
      ARW(ctx, cx + 26, cy, cx + 26 + FR * 1.8, cy, "#34d399", `${FR}N`);

      if (ext === 0) {
        TXT(ctx, "⚖ BALANCED — Forces equal, object at rest", W / 2, gY - 75, "#34d399", 12);
      } else {
        TXT(ctx, `⚡ UNBALANCED — Extra ${ext}N breaks equilibrium!`, W / 2, gY - 75, "#fbbf24", 12);
      }
      TXT(ctx, `F_net = ${(FR - FL).toFixed(0)} N  |  a = ${((FR - FL) / m).toFixed(2)} m/s²`, W / 2, H - 14, "#64748B", 10);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [rst]);

  return (
    <div style={WS}>
      <div style={HS}><p style={TS}>Equilibrium Break — Balance to Unbalanced Forces</p>
        <p style={DS}>Object starts with equal forces (balanced). Add extra force on one side to break equilibrium and create acceleration. Shows the critical transition clearly.</p>
      </div>
      <canvas ref={ref} style={CS} />
      <div style={CRS}>
        <div style={SGS}><label style={SLS}>Extra Right Force: +{extra} N</label><input type="range" min={0} max={60} value={extra} onChange={e => setExtra(+e.target.value)} style={SS} /></div>
        <button style={BS} onClick={() => setRst(r => r + 1)}>Reset</button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * TOPIC 2: NEWTON'S FIRST LAW / INERTIA
 * ════════════════════════════════════════════════════════════════════ */

/**
 * 6. Space Drift — Newton's 1st Law in deep space
 *    ID: space-drift-pro
 */
export function Sim_space_drift_pro() {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = useRef({ x: 60, v: 0, pushed: false });
  const [speed, setSpeed] = useState(3);
  const speedR = useRef(speed);
  useEffect(() => { speedR.current = speed; }, [speed]);
  const [rst, setRst] = useState(0);
  const [stars] = useState(() => Array.from({ length: 80 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.5 + 0.3, br: Math.random() })));

  useEffect(() => {
    p.current = { x: 60, v: 0, pushed: false };
    let id: number;
    const tick = () => {
      const c = ref.current; if (!c) { id = requestAnimationFrame(tick); return; }
      const res = SC(c); if (!res) { id = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const s = p.current;

      // No force in space → v stays constant once pushed
      s.x += s.v * DT * 60;
      if (s.x > W + 40) s.x = -40;

      // Draw space background
      ctx.fillStyle = "#020615"; ctx.fillRect(0, 0, W, H);
      stars.forEach(st => {
        const t = Date.now() * 0.001;
        ctx.globalAlpha = 0.4 + 0.6 * st.br * Math.abs(Math.sin(t + st.x * 10));
        CIR(ctx, st.x * W, st.y * H, st.r, "#ffffff");
      });
      ctx.globalAlpha = 1;

      const cy = H / 2;
      BOX(ctx, s.x, cy, 52, 52, "#4f46e5", "#7c3aed", "5 kg");

      if (s.v !== 0) {
        ARW(ctx, s.x + 26, cy, s.x + 26 + s.v * 25, cy, "#34d399", `${speed} m/s`, 2.5);
        TXT(ctx, "No force → No friction → Constant velocity forever!", W / 2, H - 20, "#34d399", 11);
        TXT(ctx, "Newton's 1st Law: Object in motion stays in motion", W / 2, H - 4, "#64748B", 10);
      } else {
        TXT(ctx, "No net force → Object stays at REST (Newton's 1st Law)", W / 2, H - 12, "#94A3B8", 11);
        TXT(ctx, "→ Click 'Launch' to give it a push!", W / 2, 24, "#6366f1", 11);
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [rst, stars]);

  return (
    <div style={WS}>
      <div style={HS}><p style={TS}>Deep Space Drift — Newton's First Law</p>
        <p style={DS}>In space there is no friction and no air resistance. Once launched, the object moves at CONSTANT VELOCITY forever — no force needed to maintain motion.</p>
      </div>
      <canvas ref={ref} style={CS} />
      <div style={CRS}>
        <div style={SGS}><label style={SLS}>Launch Speed: {speed} m/s</label><input type="range" min={1} max={12} value={speed} onChange={e => setSpeed(+e.target.value)} style={SS} /></div>
        <button style={BS} onClick={() => { p.current.v = speedR.current; }}>Launch 🚀</button>
        <button style={BS} onClick={() => setRst(r => r + 1)}>Reset</button>
      </div>
    </div>
  );
}

/**
 * 7. Bus Brake Inertia — passengers lurch forward
 *    ID: bus-brake-inertia
 */
export function Sim_bus_brake_inertia() {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = useRef({ busV: 15, busX: 0, paxOff: 0, braking: false });
  const [rst, setRst] = useState(0);

  useEffect(() => {
    p.current = { busV: 15, busX: 50, paxOff: 0, braking: false };
    let id: number;
    const tick = () => {
      const c = ref.current; if (!c) { id = requestAnimationFrame(tick); return; }
      const res = SC(c); if (!res) { id = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const s = p.current;

      const prevBusV = s.busV;
      if (s.braking && s.busV > 0) {
        s.busV = Math.max(0, s.busV - 12 * DT);
      }
      // Passenger: inertia keeps them at previous bus speed momentarily
      if (s.braking) {
        s.paxOff += (prevBusV - s.busV) * DT * 40;
        s.paxOff = Math.min(60, s.paxOff);
      }
      s.busX += s.busV * DT * 4;
      if (s.busX > W - 40) s.busX = -120;

      BG(ctx, W, H);
      const gY = H - 40; GND(ctx, W, gY, "#374151");
      const bx = s.busX, by = gY - 70;

      // Bus body
      BOX(ctx, bx + 80, by + 35, 160, 70, "#1e3a5f", "#1e40af", "");
      TXT(ctx, "🚌 BUS", bx + 80, by + 35, "#60a5fa", 13);

      // Windows
      ctx.fillStyle = "rgba(147,197,253,0.3)";
      ctx.fillRect(bx + 20, by + 10, 30, 25);
      ctx.fillRect(bx + 60, by + 10, 30, 25);
      ctx.fillRect(bx + 100, by + 10, 30, 25);

      // Passenger (lurches forward when brakes applied)
      const paxX = bx + 45 + s.paxOff;
      BOX(ctx, paxX, by + 15, 20, 30, "#f59e0b", "#d97706", "");
      TXT(ctx, "🧍", paxX, by + 15, "#ffffff", 16);

      // Speed arrow on bus
      if (s.busV > 0.5) ARW(ctx, bx + 150, by, bx + 150 + s.busV * 4, by, "#34d399", `${s.busV.toFixed(0)} m/s`);

      if (s.braking && s.paxOff > 5) {
        TXT(ctx, "⚡ Bus slows → Passenger keeps moving forward (INERTIA!)", W / 2, 25, "#fbbf24", 12);
      } else if (!s.braking) {
        TXT(ctx, "Bus moving at 15 m/s → Click 'Brake!' to apply brakes", W / 2, 25, "#94A3B8", 11);
      }
      if (s.busV < 0.5 && s.braking) {
        TXT(ctx, "Bus stopped — Passenger lurched forward by inertia of motion", W / 2, H - 14, "#f87171", 11);
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [rst]);

  return (
    <div style={WS}>
      <div style={HS}><p style={TS}>Bus Braking — Inertia of Motion</p>
        <p style={DS}>A moving bus stops suddenly. The passenger tends to continue moving forward due to inertia of motion. This is why seatbelts are essential!</p>
      </div>
      <canvas ref={ref} style={CS} />
      <div style={CRS}>
        <button style={BS} onClick={() => { p.current.braking = true; }}>🛑 Apply Brakes!</button>
        <button style={BS} onClick={() => setRst(r => r + 1)}>Reset</button>
      </div>
    </div>
  );
}

/**
 * 8. Coin and Card Inertia Trick
 *    ID: coin-card-inertia
 */
export function Sim_coin_card_inertia() {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = useRef({ phase: 0, cardX: 0, coinY: 0, coinV: 0, done: false });
  const [rst, setRst] = useState(0);

  useEffect(() => {
    p.current = { phase: 0, cardX: 0, coinY: 0, coinV: 0, done: false };
    let t = 0, id: number;
    const tick = () => {
      const c = ref.current; if (!c) { id = requestAnimationFrame(tick); return; }
      const res = SC(c); if (!res) { id = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const s = p.current;
      t += DT;

      if (s.phase === 1) {
        s.cardX = Math.min(W + 50, s.cardX + 800 * DT);
        s.coinV += G * DT;
        s.coinY += s.coinV * DT * 60;
        if (s.coinY > 45) { s.phase = 2; s.done = true; }
      }

      BG(ctx, W, H);
      const cx = W / 2, glassY = H - 40, glassX = cx;
      const cardBaseY = H / 2 - 20;
      const coinBaseY = cardBaseY - 18;

      // Glass
      ctx.save(); ctx.strokeStyle = "#60a5fa"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(glassX - 22, glassY); ctx.lineTo(glassX - 26, glassY - 60); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(glassX + 22, glassY); ctx.lineTo(glassX + 26, glassY - 60); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(glassX - 22, glassY); ctx.lineTo(glassX + 22, glassY); ctx.stroke();
      TXT(ctx, "Glass", cx, glassY + 12, "#60a5fa", 10);
      ctx.restore();

      // Card
      if (!s.done) {
        ctx.save(); ctx.fillStyle = "#f59e0b";
        ctx.fillRect(cx - 40 + s.cardX, cardBaseY, 80, 10); ctx.restore();
        TXT(ctx, "Card", cx + s.cardX, cardBaseY - 10, "#f59e0b", 10);
      }

      // Coin
      CIR(ctx, cx, coinBaseY + s.coinY, 14, "#fbbf24");
      TXT(ctx, "₹", cx, coinBaseY + s.coinY, "#000", 12);

      if (s.phase === 0) {
        TXT(ctx, "Coin sits on card on glass. Card is quickly flicked.", cx, 24, "#94A3B8", 11);
        TXT(ctx, "→ Click 'Flick Card!' to see inertia in action", cx, 42, "#6366f1", 11);
      } else if (s.phase === 1) {
        TXT(ctx, "Card moves quickly → Coin has inertia → Stays!", cx, 24, "#fbbf24", 12);
        TXT(ctx, "Coin falls straight into the glass due to gravity", cx, 42, "#34d399", 11);
      } else {
        TXT(ctx, "✅ Coin dropped into glass! Inertia of rest demonstrated.", cx, 24, "#34d399", 12);
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [rst]);

  return (
    <div style={WS}>
      <div style={HS}><p style={TS}>Coin &amp; Card Trick — Inertia of Rest</p>
        <p style={DS}>The card is flicked away quickly. The coin, due to inertia of rest, stays in place momentarily and then falls straight into the glass under gravity.</p>
      </div>
      <canvas ref={ref} style={CS} />
      <div style={CRS}>
        <button style={BS} onClick={() => { if (p.current.phase === 0) p.current.phase = 1; }}>⚡ Flick Card!</button>
        <button style={BS} onClick={() => setRst(r => r + 1)}>Reset</button>
      </div>
    </div>
  );
}

/**
 * 9. Mass and Inertia Lab — same force, different masses
 *    ID: mass-inertia-lab
 */
export function Sim_mass_inertia_lab() {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = useRef([
    { x: 0, v: 0, m: 1,  c1: "#22c55e", c2: "#16a34a" },
    { x: 0, v: 0, m: 5,  c1: "#3b82f6", c2: "#2563eb" },
    { x: 0, v: 0, m: 12, c1: "#f59e0b", c2: "#d97706" },
  ]);
  const [force, setForce] = useState(30);
  const forceR = useRef(force);
  useEffect(() => { forceR.current = force; }, [force]);
  const [rst, setRst] = useState(0);

  useEffect(() => {
    p.current = [
      { x: 0, v: 0, m: 1,  c1: "#22c55e", c2: "#16a34a" },
      { x: 0, v: 0, m: 5,  c1: "#3b82f6", c2: "#2563eb" },
      { x: 0, v: 0, m: 12, c1: "#f59e0b", c2: "#d97706" },
    ];
    let id: number;
    const tick = () => {
      const c = ref.current; if (!c) { id = requestAnimationFrame(tick); return; }
      const res = SC(c); if (!res) { id = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const F = forceR.current;

      BG(ctx, W, H);
      const rows = p.current;
      const rowH = (H - 20) / 3;

      rows.forEach((s, i) => {
        const a = F / s.m;
        s.v += a * DT;
        s.x = Math.min(W - 100, s.x + s.v * DT * 45);

        const cy = 20 + rowH * i + rowH / 2;
        const cx = 55 + s.x;
        const sz = 30 + s.m * 2.2;

        // Row separator
        if (i > 0) { ctx.strokeStyle = "rgba(99,102,241,0.1)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, cy - rowH / 2); ctx.lineTo(W, cy - rowH / 2); ctx.stroke(); }

        BOX(ctx, cx, cy, sz, sz, s.c1, s.c2, `${s.m}kg`);
        ARW(ctx, cx + sz / 2, cy, cx + sz / 2 + F * 2, cy, "#34d399", `${F}N`);
        TXT(ctx, `a = F/m = ${F}/${s.m} = ${a.toFixed(2)} m/s²  |  v = ${s.v.toFixed(1)} m/s`, cx + sz / 2 + F * 2 + 30, cy, "#94A3B8", 10, "left");
      });

      TXT(ctx, `Same Force (${F}N) → Larger mass = LESS acceleration (more inertia)`, W / 2, H - 8, "#fbbf24", 11);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [rst]);

  return (
    <div style={WS}>
      <div style={HS}><p style={TS}>Mass &amp; Inertia Lab — Same Force, Different Masses</p>
        <p style={DS}>The same force is applied to 1 kg, 5 kg, and 12 kg blocks. Heavier blocks accelerate less — they have more inertia (resistance to change in motion).</p>
      </div>
      <canvas ref={ref} style={CS} />
      <div style={CRS}>
        <div style={SGS}><label style={SLS}>Applied Force: {force} N</label><input type="range" min={5} max={80} value={force} onChange={e => setForce(+e.target.value)} style={SS} /></div>
        <button style={BS} onClick={() => setRst(r => r + 1)}>Reset</button>
      </div>
    </div>
  );
}

/**
 * 10. Galileo's Ramp — ball reaches same height
 *     ID: galileo-ramp-pro
 */
export function Sim_galileo_ramp_pro() {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = useRef({ phase: "down" as "down"|"up", x: 0, y: 0, v: 0, dist: 0 });
  const [rst, setRst] = useState(0);
  const [angle, setAngle] = useState(30);
  const angleR = useRef(angle);
  useEffect(() => { angleR.current = angle; }, [angle]);

  useEffect(() => {
    const ang = angleR.current * Math.PI / 180;
    const rampLen = 160;
    const startX = 80, startY = 60;
    const endX = startX + rampLen * Math.cos(ang);
    const endY = startY + rampLen * Math.sin(ang);
    p.current = { phase: "down", x: startX, y: startY, v: 0, dist: 0 };

    let id: number;
    const tick = () => {
      const c = ref.current; if (!c) { id = requestAnimationFrame(tick); return; }
      const res = SC(c); if (!res) { id = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const s = p.current;
      const a_down = G * Math.sin(ang);
      const a_up2 = G * Math.sin(ang * 0.6); // gentler second ramp

      if (s.phase === "down") {
        s.v += a_down * DT;
        s.dist += s.v * DT;
        const t = s.dist / rampLen;
        s.x = startX + t * (endX - startX);
        s.y = startY + t * (endY - startY);
        if (s.dist >= rampLen) { s.phase = "up"; s.dist = 0; }
      } else {
        s.v -= a_up2 * DT;
        if (s.v < 0) { s.v = 0; setTimeout(() => { s.phase = "down"; s.dist = 0; s.v = 0; }, 800); }
        s.dist += s.v * DT;
        const cx2 = endX + 20, cy2 = endY;
        const ang2 = ang * 0.6;
        s.x = cx2 + s.dist * Math.cos(ang2);
        s.y = cy2 - s.dist * Math.sin(ang2);
      }

      BG(ctx, W, H);
      GND(ctx, W, H - 30);

      // First ramp (steep)
      ctx.save(); ctx.strokeStyle = "#475569"; ctx.lineWidth = 4; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(startX, H - 30); ctx.lineTo(endX, endY); ctx.stroke();

      // Second ramp (gentler)
      const r2ang = ang * 0.6;
      const r2len = 200;
      ctx.strokeStyle = "#4b5563";
      ctx.beginPath(); ctx.moveTo(endX + 20, H - 30); ctx.lineTo(endX + 20 + r2len * Math.cos(r2ang), H - 30 - r2len * Math.sin(r2ang)); ctx.stroke();
      ctx.restore();

      // Heights label
      const h1 = (H - 30) - endY;
      TXT(ctx, `h = ${(h1 / 30).toFixed(1)} m`, startX - 20, (startY + H - 30) / 2, "#94A3B8", 10);

      // Ball
      CIR(ctx, s.x, s.y - 10, 14, "#f59e0b");
      TXT(ctx, `v=${s.v.toFixed(1)}m/s`, s.x, s.y - 30, "#94A3B8", 10);

      TXT(ctx, "Galileo: Without friction, ball always reaches the SAME HEIGHT", W / 2, 20, "#6366f1", 11);
      TXT(ctx, "This thought experiment led to Newton's 1st Law", W / 2, 36, "#64748B", 10);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [rst, angle]);

  return (
    <div style={WS}>
      <div style={HS}><p style={TS}>Galileo's Ramp — Inertia Thought Experiment</p>
        <p style={DS}>Galileo showed: if a ball rolls down one incline and up another (no friction), it always reaches the same height. With a flat ramp, it would roll forever — Newton's 1st Law!</p>
      </div>
      <canvas ref={ref} style={CS} />
      <div style={CRS}>
        <div style={SGS}><label style={SLS}>Ramp Angle: {angle}°</label><input type="range" min={15} max={60} value={angle} onChange={e => setAngle(+e.target.value)} style={SS} /></div>
        <button style={BS} onClick={() => setRst(r => r + 1)}>Reset</button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * TOPIC 3: NEWTON'S SECOND LAW (F = ma)
 * ════════════════════════════════════════════════════════════════════ */

/**
 * 11. F = ma Interactive Lab
 *     ID: fma-lab-ultra
 */
export function Sim_fma_lab_ultra() {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = useRef({ x: 0, v: 0, t: 0, hist: [] as {t:number,v:number,a:number}[] });
  const [force, setForce] = useState(20);
  const [mass, setMass] = useState(4);
  const forceR = useRef(force), massR = useRef(mass);
  useEffect(() => { forceR.current = force; }, [force]);
  useEffect(() => { massR.current = mass; }, [mass]);
  const [rst, setRst] = useState(0);

  useEffect(() => {
    p.current = { x: 0, v: 0, t: 0, hist: [] };
    let id: number;
    const tick = () => {
      const c = ref.current; if (!c) { id = requestAnimationFrame(tick); return; }
      const res = SC(c); if (!res) { id = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const s = p.current;
      const F = forceR.current, m = massR.current;
      const a = F / m;
      s.v += a * DT;
      s.x = Math.min(W - 100, s.x + s.v * DT * 35);
      s.t += DT;
      if (s.hist.length < 120) s.hist.push({ t: s.t, v: s.v, a });

      BG(ctx, W, H);
      const gY = H - 80;
      GND(ctx, W, gY);
      const cx = 60 + s.x, cy = gY - 30;
      BOX(ctx, cx, cy, 55, 55, "#7c3aed", "#6d28d9", `${m} kg`);
      ARW(ctx, cx + 27, cy, cx + 27 + F * 2.5, cy, "#34d399", `${F}N`);

      // Mini velocity graph
      const gx = W - 120, gy = 20, gw = 110, gh = gY - 30;
      ctx.strokeStyle = "rgba(99,102,241,0.25)"; ctx.lineWidth = 1; ctx.strokeRect(gx, gy, gw, gh);
      TXT(ctx, "v (m/s)", gx + gw / 2, gy - 8, "#94A3B8", 9);
      if (s.hist.length > 1) {
        const maxV = Math.max(1, s.hist[s.hist.length - 1].v);
        ctx.save(); ctx.strokeStyle = "#22d3ee"; ctx.lineWidth = 1.5;
        ctx.beginPath();
        s.hist.forEach((h, i) => {
          const px = gx + (i / 120) * gw;
          const py = gy + gh - (h.v / (maxV * 1.1)) * gh;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        });
        ctx.stroke(); ctx.restore();
      }

      // Info panel
      const info = `F = ${F} N   m = ${m} kg   a = F/m = ${a.toFixed(2)} m/s²`;
      TXT(ctx, info, (W - 120) / 2, gY + 12, "#94A3B8", 11);
      TXT(ctx, `v = ${s.v.toFixed(2)} m/s   t = ${s.t.toFixed(1)} s   p = mv = ${(m * s.v).toFixed(1)} kg·m/s`, (W - 120) / 2, gY + 28, "#22d3ee", 11);
      TXT(ctx, "Newton's 2nd Law: F = ma  →  Larger force or smaller mass = more acceleration", (W - 120) / 2, gY + 48, "#fbbf24", 10);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [rst]);

  return (
    <div style={WS}>
      <div style={HS}><p style={TS}>F = ma Interactive Lab — Newton's Second Law</p>
        <p style={DS}>Adjust force (N) and mass (kg). Observe acceleration, velocity, and momentum in real time. The velocity graph shows constant acceleration (linear increase).</p>
      </div>
      <canvas ref={ref} style={CS} />
      <div style={CRS}>
        <div style={SGS}><label style={SLS}>Force F: {force} N</label><input type="range" min={1} max={80} value={force} onChange={e => setForce(+e.target.value)} style={SS} /></div>
        <div style={SGS}><label style={SLS}>Mass m: {mass} kg</label><input type="range" min={1} max={20} value={mass} onChange={e => setMass(+e.target.value)} style={SS} /></div>
        <button style={BS} onClick={() => setRst(r => r + 1)}>Reset</button>
      </div>
    </div>
  );
}

/**
 * 12. Same Force, Different Masses — a comparison
 *     ID: heavy-mass-accel
 */
export function Sim_heavy_mass_accel() {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = useRef([
    { x: 0, v: 0, m: 2,  c1: "#22c55e", c2: "#15803d" },
    { x: 0, v: 0, m: 6,  c1: "#3b82f6", c2: "#1d4ed8" },
    { x: 0, v: 0, m: 15, c1: "#ef4444", c2: "#b91c1c" },
  ]);
  const [f, setF] = useState(30);
  const fR = useRef(f);
  useEffect(() => { fR.current = f; }, [f]);
  const [rst, setRst] = useState(0);

  useEffect(() => {
    p.current = [
      { x: 0, v: 0, m: 2,  c1: "#22c55e", c2: "#15803d" },
      { x: 0, v: 0, m: 6,  c1: "#3b82f6", c2: "#1d4ed8" },
      { x: 0, v: 0, m: 15, c1: "#ef4444", c2: "#b91c1c" },
    ];
    let id: number;
    const tick = () => {
      const c = ref.current; if (!c) { id = requestAnimationFrame(tick); return; }
      const res = SC(c); if (!res) { id = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const F = fR.current;

      BG(ctx, W, H);
      const rowH = (H - 20) / 3;

      p.current.forEach((s, i) => {
        const a = F / s.m;
        s.v += a * DT;
        s.x = Math.min(W - 100, s.x + s.v * DT * 35);
        const cy = 20 + rowH * i + rowH / 2;
        if (i > 0) { ctx.strokeStyle = "rgba(99,102,241,0.08)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, cy - rowH / 2); ctx.lineTo(W, cy - rowH / 2); ctx.stroke(); }
        const sz = 28 + s.m * 1.8;
        const cx = 55 + s.x;
        BOX(ctx, cx, cy, sz, sz, s.c1, s.c2, `${s.m}kg`);
        ARW(ctx, cx + sz / 2, cy, cx + sz / 2 + F * 2.2, cy, "#34d399", `${F}N`);
        TXT(ctx, `a = ${a.toFixed(2)} m/s²  |  v = ${s.v.toFixed(1)} m/s`, cx + sz / 2 + F * 2.2 + 25, cy, "#94A3B8", 10, "left");
      });
      TXT(ctx, `F = ${F} N on all blocks → Heaviest (15kg) accelerates LEAST`, W / 2, H - 8, "#fbbf24", 11);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [rst]);

  return (
    <div style={WS}>
      <div style={HS}><p style={TS}>Mass vs Acceleration — Newton's 2nd Law (a = F/m)</p>
        <p style={DS}>The same force applied to 2 kg, 6 kg, and 15 kg blocks. a ∝ 1/m — double the mass means half the acceleration. Mass measures resistance to acceleration.</p>
      </div>
      <canvas ref={ref} style={CS} />
      <div style={CRS}>
        <div style={SGS}><label style={SLS}>Force on all: {f} N</label><input type="range" min={5} max={90} value={f} onChange={e => setF(+e.target.value)} style={SS} /></div>
        <button style={BS} onClick={() => setRst(r => r + 1)}>Reset</button>
      </div>
    </div>
  );
}

/**
 * 13. Car Braking — Deceleration and stopping distance
 *     ID: car-braking-pro
 */
export function Sim_car_braking_pro() {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = useRef({ x: 80, v: 0, braking: false, dist: 0 });
  const [initV, setInitV] = useState(20);
  const [brakef, setBrakef] = useState(8000);
  const initVR = useRef(initV), brakefR = useRef(brakef);
  useEffect(() => { initVR.current = initV; }, [initV]);
  useEffect(() => { brakefR.current = brakef; }, [brakef]);
  const [rst, setRst] = useState(0);

  useEffect(() => {
    p.current = { x: 80, v: initVR.current, braking: false, dist: 0 };
    let id: number;
    const tick = () => {
      const c = ref.current; if (!c) { id = requestAnimationFrame(tick); return; }
      const res = SC(c); if (!res) { id = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const s = p.current;
      const m = 1000, F = brakefR.current;
      if (s.braking && s.v > 0) {
        const a = -F / m;
        s.v = Math.max(0, s.v + a * DT);
        const dx = s.v * DT * 8;
        s.x += dx; s.dist += dx;
        if (s.x > W - 60) s.x = W - 60;
      }

      BG(ctx, W, H);
      GND(ctx, W, H - 40, "#1f2937");

      // Road markings
      ctx.save(); ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 2; ctx.setLineDash([20, 20]);
      ctx.beginPath(); ctx.moveTo(0, H - 40); ctx.lineTo(W, H - 40); ctx.stroke();
      ctx.setLineDash([]);

      // Car
      const cy = H - 60;
      BOX(ctx, s.x, cy, 80, 40, "#1e3a5f", "#1e40af", "🚗");
      TXT(ctx, `${s.v.toFixed(1)} m/s`, s.x, cy - 25, "#60a5fa", 10);

      // Braking force arrow
      if (s.braking && s.v > 0.1) {
        ARW(ctx, s.x + 40, cy, s.x + 40 - F / m * 30, cy, "#f87171", `−${(F/1000).toFixed(0)}kN`);
        TXT(ctx, `a = -${(F/m).toFixed(1)} m/s²`, s.x, cy + 30, "#f87171", 10);
      }

      TXT(ctx, s.braking && s.v < 0.1 ? `Stopped! Distance: ${(s.dist / 8).toFixed(1)} m` : s.braking ? `Braking...  d = ${(s.dist / 8).toFixed(1)} m` : "→ Click 'Brake!' to apply brakes", W / 2, 22, "#fbbf24", 12);
      TXT(ctx, `F = ma: Braking force ${(F/1000).toFixed(0)} kN on ${m} kg car = ${(F/m).toFixed(1)} m/s² deceleration`, W / 2, H - 10, "#64748B", 10);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [rst]);

  return (
    <div style={WS}>
      <div style={HS}><p style={TS}>Car Braking — Newton's 2nd Law: F = ma</p>
        <p style={DS}>A car of 1000 kg brakes with a braking force. Deceleration a = F/m. Higher initial speed → longer stopping distance. Greater braking force → shorter distance.</p>
      </div>
      <canvas ref={ref} style={CS} />
      <div style={CRS}>
        <div style={SGS}><label style={SLS}>Initial Speed: {initV} m/s</label><input type="range" min={5} max={40} value={initV} onChange={e => setInitV(+e.target.value)} style={SS} /></div>
        <div style={SGS}><label style={SLS}>Brake Force: {(brakef/1000).toFixed(0)} kN</label><input type="range" min={2000} max={20000} step={1000} value={brakef} onChange={e => setBrakef(+e.target.value)} style={SS} /></div>
        <button style={BS} onClick={() => { p.current.braking = true; }}>🛑 Brake!</button>
        <button style={BS} onClick={() => setRst(r => r + 1)}>Reset</button>
      </div>
    </div>
  );
}

/**
 * 14. Momentum and Force — F = Δp/Δt
 *     ID: momentum-rate-demo
 */
export function Sim_momentum_rate_demo() {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = useRef({ v: 0, x: 30, t: 0, hist: [] as {p:number,t:number}[] });
  const [F, setF] = useState(15);
  const [m, setM] = useState(3);
  const FR = useRef(F), mR = useRef(m);
  useEffect(() => { FR.current = F; }, [F]);
  useEffect(() => { mR.current = m; }, [m]);
  const [rst, setRst] = useState(0);

  useEffect(() => {
    p.current = { v: 0, x: 30, t: 0, hist: [] };
    let id: number;
    const tick = () => {
      const c = ref.current; if (!c) { id = requestAnimationFrame(tick); return; }
      const res = SC(c); if (!res) { id = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const s = p.current;
      const force = FR.current, mass = mR.current;
      const a = force / mass;
      s.v += a * DT; s.t += DT;
      s.x = Math.min(W - 80, s.x + s.v * DT * 30);
      if (s.t % 0.05 < DT) s.hist.push({ p: mass * s.v, t: s.t });
      if (s.hist.length > 80) s.hist.shift();

      BG(ctx, W, H);
      const gY = H - 55;
      GND(ctx, W, gY);
      const cy = gY - 28;
      BOX(ctx, s.x, cy, 50, 50, "#7c3aed", "#5b21b6", `${mass}kg`);
      ARW(ctx, s.x + 25, cy, s.x + 25 + force * 2, cy, "#34d399", `${force}N`);

      // Momentum bar
      const maxP = mass * 20, barH = 80, barX = W - 60, barY = 20;
      ctx.strokeStyle = "rgba(99,102,241,0.3)"; ctx.lineWidth = 1; ctx.strokeRect(barX, barY, 30, barH);
      const pH = Math.min(barH, (mass * s.v / maxP) * barH);
      const pg = ctx.createLinearGradient(0, barY + barH - pH, 0, barY + barH);
      pg.addColorStop(0, "#22d3ee"); pg.addColorStop(1, "#0891b2");
      ctx.fillStyle = pg; ctx.fillRect(barX + 1, barY + barH - pH, 28, pH);
      TXT(ctx, "p", barX + 15, barY - 8, "#22d3ee", 10);
      TXT(ctx, `${(mass * s.v).toFixed(1)}`, barX + 15, barY + barH + 10, "#22d3ee", 9);

      TXT(ctx, `p = mv = ${mass} × ${s.v.toFixed(2)} = ${(mass * s.v).toFixed(2)} kg·m/s`, W / 2 - 30, gY + 12, "#22d3ee", 11);
      TXT(ctx, `F = Δp/Δt = ${force} N  →  Rate of change of momentum`, W / 2 - 30, gY + 28, "#fbbf24", 10);
      TXT(ctx, `a = F/m = ${a.toFixed(2)} m/s²   t = ${s.t.toFixed(1)} s`, W / 2 - 30, gY + 44, "#94A3B8", 10);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [rst]);

  return (
    <div style={WS}>
      <div style={HS}><p style={TS}>Momentum &amp; Force — F = Δp/Δt (Rate of Change)</p>
        <p style={DS}>Force equals the rate of change of momentum. p = mv. As force is applied, momentum increases linearly. This is the deeper form of Newton's Second Law.</p>
      </div>
      <canvas ref={ref} style={CS} />
      <div style={CRS}>
        <div style={SGS}><label style={SLS}>Force F: {F} N</label><input type="range" min={1} max={60} value={F} onChange={e => setF(+e.target.value)} style={SS} /></div>
        <div style={SGS}><label style={SLS}>Mass m: {m} kg</label><input type="range" min={1} max={15} value={m} onChange={e => setM(+e.target.value)} style={SS} /></div>
        <button style={BS} onClick={() => setRst(r => r + 1)}>Reset</button>
      </div>
    </div>
  );
}

/**
 * 15. Impulse Demo — Cricket ball
 *     ID: cricket-impulse
 */
export function Sim_cricket_impulse() {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = useRef({ phase: 0, ballX: 100, ballV: 0, impX: 0, impW: 0, impF: 0, hitDone: false });
  const [rst, setRst] = useState(0);
  const [bf, setBf] = useState(500);
  const [bt, setBt] = useState(0.02);
  const bfR = useRef(bf), btR = useRef(bt);
  useEffect(() => { bfR.current = bf; }, [bf]);
  useEffect(() => { btR.current = bt; }, [bt]);

  useEffect(() => {
    p.current = { phase: 0, ballX: 100, ballV: 8, impX: 0, impW: 0, impF: 0, hitDone: false };
    let id: number;
    const tick = () => {
      const c = ref.current; if (!c) { id = requestAnimationFrame(tick); return; }
      const res = SC(c); if (!res) { id = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const s = p.current;
      const F = bfR.current, T = btR.current;
      const batX = W / 2;

      if (s.phase === 0) { // Ball moving toward bat
        s.ballX += s.ballV * DT * 55;
        if (s.ballX >= batX - 20) { s.phase = 1; s.impF = F; }
      } else if (s.phase === 1) { // Hit — impulse applied
        const dt_hit = Math.min(DT, T);
        const a = (F / 0.16); // cricket ball ~160g
        s.ballV = Math.min(s.ballV + a * dt_hit * DT / T * 60, 40);
        s.ballX += s.ballV * DT * 55;
        if (s.ballV > 20) { s.phase = 2; }
      } else { // Ball flying away
        s.ballX += s.ballV * DT * 40;
        if (s.ballX > W + 30) s.phase = 0, s.ballX = 100, s.ballV = 8;
      }

      BG(ctx, W, H);
      const cy = H / 2 + 20;
      GND(ctx, W, cy + 20);

      // Bat
      ctx.save(); ctx.fillStyle = "#78350f";
      ctx.fillRect(batX - 8, cy - 60, 16, 80); ctx.restore();
      TXT(ctx, "🏏", batX, cy - 65, "#ffffff", 18);

      // Ball
      CIR(ctx, s.ballX, cy, 18, s.phase > 0 ? "#ef4444" : "#dc2626");
      TXT(ctx, "🏏", s.ballX, cy, "#ffffff", 14);

      // Impulse = F × t
      const imp = F * T;
      TXT(ctx, `Impulse J = F × t = ${F} N × ${T.toFixed(3)} s = ${imp.toFixed(2)} N·s`, W / 2, 22, "#fbbf24", 11);
      TXT(ctx, `J = Δp = m × Δv = 0.16 × ${(imp/0.16).toFixed(1)} = ${imp.toFixed(2)} kg·m/s`, W / 2, 40, "#22d3ee", 11);
      TXT(ctx, `Ball speed: ${(s.ballV * (s.phase < 2 ? 1 : 1)).toFixed(1)} m/s → v = ${Math.abs(s.ballV).toFixed(1)} m/s`, W / 2, H - 14, "#94A3B8", 10);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [rst]);

  return (
    <div style={WS}>
      <div style={HS}><p style={TS}>Cricket Ball Impulse — J = F × Δt = Δp</p>
        <p style={DS}>Impulse = Force × time of contact = change in momentum. A large force over a short time can give the same impulse as a smaller force over longer time.</p>
      </div>
      <canvas ref={ref} style={CS} />
      <div style={CRS}>
        <div style={SGS}><label style={SLS}>Bat Force: {bf} N</label><input type="range" min={100} max={2000} step={50} value={bf} onChange={e => setBf(+e.target.value)} style={SS} /></div>
        <div style={SGS}><label style={SLS}>Contact Time: {bt.toFixed(3)} s</label><input type="range" min={0.005} max={0.1} step={0.005} value={bt} onChange={e => setBt(+e.target.value)} style={SS} /></div>
        <button style={BS} onClick={() => setRst(r => r + 1)}>Reset</button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * TOPIC 4: NEWTON'S THIRD LAW
 * ════════════════════════════════════════════════════════════════════ */

/**
 * 16. Ice Skaters — Action-Reaction on frictionless surface
 *     ID: ice-skaters-push
 */
export function Sim_ice_skaters_push() {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = useRef({ x1: 0, v1: 0, x2: 0, v2: 0, pushed: false });
  const [m1, setM1] = useState(60);
  const [m2, setM2] = useState(80);
  const m1R = useRef(m1), m2R = useRef(m2);
  useEffect(() => { m1R.current = m1; }, [m1]);
  useEffect(() => { m2R.current = m2; }, [m2]);
  const [rst, setRst] = useState(0);

  useEffect(() => {
    p.current = { x1: 0, v1: 0, x2: 0, v2: 0, pushed: false };
    let id: number;
    const tick = () => {
      const c = ref.current; if (!c) { id = requestAnimationFrame(tick); return; }
      const res = SC(c); if (!res) { id = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const s = p.current;
      const M1 = m1R.current, M2 = m2R.current;

      if (s.pushed) {
        const F = 400;
        s.v1 += (-F / M1) * DT;
        s.v2 += (F / M2) * DT;
        s.x1 = Math.max(-(W / 2 - 50), s.x1 + s.v1 * DT * 40);
        s.x2 = Math.min(W / 2 - 50, s.x2 + s.v2 * DT * 40);
      }

      BG(ctx, W, H);
      // Ice surface
      const iceY = H - 35;
      const iceg = ctx.createLinearGradient(0, iceY - 5, 0, iceY + 20);
      iceg.addColorStop(0, "#bfdbfe"); iceg.addColorStop(1, "#93c5fd");
      ctx.fillStyle = iceg; ctx.fillRect(0, iceY - 5, W, 30);
      ctx.strokeStyle = "rgba(147,197,253,0.5)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(0, iceY - 5); ctx.lineTo(W, iceY - 5); ctx.stroke();
      TXT(ctx, "Frictionless Ice ❄", W / 2, iceY + 10, "#1e3a5f", 10);

      const cx1 = W / 2 + s.x1 - 45, cx2 = W / 2 + s.x2 + 45;
      const cy = iceY - 35;
      BOX(ctx, cx1, cy, 50, 55, "#3b82f6", "#1d4ed8", `${M1}kg`);
      TXT(ctx, "🧑", cx1, cy, "#fff", 18);
      BOX(ctx, cx2, cy, 55, 55, "#ef4444", "#b91c1c", `${M2}kg`);
      TXT(ctx, "🧑", cx2, cy, "#fff", 18);

      if (s.pushed) {
        ARW(ctx, cx1 - 25, cy, cx1 - 25 - Math.abs(s.v1) * 8, cy, "#f87171", `${Math.abs(s.v1).toFixed(1)}m/s`);
        ARW(ctx, cx2 + 27, cy, cx2 + 27 + s.v2 * 8, cy, "#34d399", `${s.v2.toFixed(1)}m/s`);
        TXT(ctx, `Action: Person A pushes B →   Reaction: B pushes A ←`, W / 2, 22, "#fbbf24", 11);
        TXT(ctx, `p₁ = ${M1}×${s.v1.toFixed(2)}=${(M1*s.v1).toFixed(1)}   p₂ = ${M2}×${s.v2.toFixed(2)}=${(M2*s.v2).toFixed(1)}   Total p ≈ 0`, W / 2, 40, "#22d3ee", 10);
      } else {
        TXT(ctx, "Both skaters at rest. Click Push to see Newton's 3rd Law!", W / 2, 22, "#94A3B8", 11);
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [rst]);

  return (
    <div style={WS}>
      <div style={HS}><p style={TS}>Ice Skaters — Newton's Third Law Action-Reaction</p>
        <p style={DS}>Two skaters push each other on frictionless ice. Equal and opposite forces act on each — lighter skater moves faster. Total momentum stays zero!</p>
      </div>
      <canvas ref={ref} style={CS} />
      <div style={CRS}>
        <div style={SGS}><label style={SLS}>Skater A Mass: {m1} kg</label><input type="range" min={30} max={120} value={m1} onChange={e => setM1(+e.target.value)} style={SS} /></div>
        <div style={SGS}><label style={SLS}>Skater B Mass: {m2} kg</label><input type="range" min={30} max={120} value={m2} onChange={e => setM2(+e.target.value)} style={SS} /></div>
        <button style={BS} onClick={() => { p.current.pushed = true; }}>👐 Push!</button>
        <button style={BS} onClick={() => setRst(r => r + 1)}>Reset</button>
      </div>
    </div>
  );
}

/**
 * 17. Rocket Exhaust — action-reaction propulsion
 *     ID: rocket-exhaust-new
 */
export function Sim_rocket_exhaust_new() {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = useRef({ y: 0, v: 0, fuel: 100, particles: [] as {x:number,y:number,vy:number,life:number}[] });
  const [thrust, setThrust] = useState(30);
  const thrustR = useRef(thrust);
  useEffect(() => { thrustR.current = thrust; }, [thrust]);
  const [rst, setRst] = useState(0);
  const [firing, setFiring] = useState(false);
  const firingR = useRef(firing);
  useEffect(() => { firingR.current = firing; }, [firing]);

  useEffect(() => {
    p.current = { y: 0, v: 0, fuel: 100, particles: [] };
    let id: number;
    const tick = () => {
      const c = ref.current; if (!c) { id = requestAnimationFrame(tick); return; }
      const res = SC(c); if (!res) { id = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const s = p.current;
      const T = thrustR.current;
      const m = 5;

      if (firingR.current && s.fuel > 0) {
        const a = (T - m * G) / m;
        s.v += a * DT;
        s.y -= s.v * DT * 40;
        s.y = Math.max(-H / 2 + 80, s.y);
        s.fuel = Math.max(0, s.fuel - 0.5);
        // Exhaust particles
        for (let i = 0; i < 3; i++) {
          s.particles.push({ x: W / 2 + (Math.random() - 0.5) * 10, y: H / 2 + s.y + 40, vy: 2 + Math.random() * 3, life: 1 });
        }
      } else {
        if (s.v > 0) { s.v -= G * DT; s.y -= s.v * DT * 40; }
        else if (s.v < 0) { s.v = 0; }
      }

      s.particles = s.particles.map(p => ({ ...p, y: p.y + p.vy * 2, life: p.life - 0.04 })).filter(p => p.life > 0);

      BG(ctx, W, H);
      // Ground
      GND(ctx, W, H - 20);

      // Exhaust particles
      s.particles.forEach(pt => {
        const col = `rgba(251,191,36,${pt.life})`;
        CIR(ctx, pt.x, pt.y, 4 * pt.life, col);
      });

      // Rocket body
      const ry = H / 2 + s.y;
      BOX(ctx, W / 2, ry, 40, 70, "#4f46e5", "#3730a3", "");
      TXT(ctx, "🚀", W / 2, ry, "#fff", 24);

      if (firingR.current) {
        ARW(ctx, W / 2, ry + 35, W / 2, ry + 35 + T * 2, "#f87171", `${T}N ↓`);
        ARW(ctx, W / 2, ry - 35, W / 2, ry - 35 - T * 2, "#34d399", `${T}N ↑`);
        TXT(ctx, "Gas pushed DOWN (action) → Rocket pushed UP (reaction)", W / 2, 22, "#fbbf24", 11);
      } else {
        TXT(ctx, "→ Click 'Fire Engine!' to launch the rocket", W / 2, 22, "#94A3B8", 11);
      }
      TXT(ctx, `v = ${s.v.toFixed(1)} m/s ↑  |  Fuel: ${s.fuel.toFixed(0)}%  |  a = ${((T-m*G)/m).toFixed(1)} m/s²`, W / 2, H - 10, "#64748B", 10);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [rst]);

  return (
    <div style={WS}>
      <div style={HS}><p style={TS}>Rocket Propulsion — Newton's Third Law</p>
        <p style={DS}>Rocket expels hot gas downward (action force). By Newton's 3rd Law, the gas pushes the rocket upward with equal force (reaction). Net upward = Thrust − Weight.</p>
      </div>
      <canvas ref={ref} style={CS} />
      <div style={CRS}>
        <div style={SGS}><label style={SLS}>Thrust: {thrust} N (weight=49N)</label><input type="range" min={20} max={200} value={thrust} onChange={e => setThrust(+e.target.value)} style={SS} /></div>
        <button style={BS} onMouseDown={() => setFiring(true)} onMouseUp={() => setFiring(false)} onTouchStart={() => setFiring(true)} onTouchEnd={() => setFiring(false)}>🔥 Fire Engine!</button>
        <button style={BS} onClick={() => setRst(r => r + 1)}>Reset</button>
      </div>
    </div>
  );
}

/**
 * 18. Swimmer Wall Push — action-reaction pairs
 *     ID: swimmer-wall-push
 */
export function Sim_swimmer_wall_push() {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = useRef({ x: 0, v: 0, pushed: false });
  const [force, setForce] = useState(200);
  const forceR = useRef(force);
  useEffect(() => { forceR.current = force; }, [force]);
  const [rst, setRst] = useState(0);

  useEffect(() => {
    p.current = { x: 0, v: 0, pushed: false };
    let id: number;
    const tick = () => {
      const c = ref.current; if (!c) { id = requestAnimationFrame(tick); return; }
      const res = SC(c); if (!res) { id = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const s = p.current;
      const m = 65, F = forceR.current;

      if (s.pushed) {
        if (s.v === 0) { s.v = F / m * 0.15; }
        s.x = Math.min(W - 80, s.x + s.v * DT * 50);
        s.v *= 0.998; // slight drag
      }

      BG(ctx, W, H);
      const cy = H / 2 + 10;
      // Pool/water
      const waterg = ctx.createLinearGradient(0, cy - 30, 0, H);
      waterg.addColorStop(0, "#0c4a6e"); waterg.addColorStop(1, "#082f49");
      ctx.fillStyle = waterg; ctx.fillRect(50, cy - 30, W - 50, H - cy + 30);
      TXT(ctx, "🌊 Pool", W / 2, H - 15, "#38bdf8", 10);

      // Wall
      ctx.fillStyle = "#374151"; ctx.fillRect(0, 0, 50, H);
      ctx.strokeStyle = "#6b7280"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(50, 0); ctx.lineTo(50, H); ctx.stroke();
      TXT(ctx, "WALL", 25, cy, "#9ca3af", 10);

      // Swimmer
      const sx = 55 + s.x;
      BOX(ctx, sx, cy, 50, 40, "#0ea5e9", "#0369a1", "");
      TXT(ctx, "🏊", sx, cy, "#fff", 20);

      if (s.pushed) {
        ARW(ctx, sx + 25, cy, sx + 25 + s.v * 40, cy, "#34d399", "Reaction →");
        ARW(ctx, 50, cy, 50 - F / 3, cy, "#f87171", `← ${F}N`);
        TXT(ctx, `Swimmer pushes wall ← ${F}N  (Action)`, W / 2, 22, "#f87171", 11);
        TXT(ctx, `Wall pushes swimmer → ${F}N  (Reaction) — Newton's 3rd Law`, W / 2, 40, "#34d399", 11);
        TXT(ctx, `a = F/m = ${F}/${m} = ${(F/m).toFixed(1)} m/s²  |  v = ${s.v.toFixed(2)} m/s`, W / 2, H - 10, "#94A3B8", 10);
      } else {
        TXT(ctx, "Swimmer touches the wall. Click 'Push!' to see action-reaction.", W / 2, 22, "#94A3B8", 11);
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [rst]);

  return (
    <div style={WS}>
      <div style={HS}><p style={TS}>Swimmer Pushes Wall — Newton's Third Law</p>
        <p style={DS}>The swimmer pushes the wall backward (action). The wall exerts an equal force on the swimmer forward (reaction). Equal forces, opposite directions — always in pairs!</p>
      </div>
      <canvas ref={ref} style={CS} />
      <div style={CRS}>
        <div style={SGS}><label style={SLS}>Push Force: {force} N</label><input type="range" min={50} max={500} value={force} onChange={e => setForce(+e.target.value)} style={SS} /></div>
        <button style={BS} onClick={() => { p.current.pushed = true; }}>💪 Push!</button>
        <button style={BS} onClick={() => setRst(r => r + 1)}>Reset</button>
      </div>
    </div>
  );
}

/**
 * 19. Book on Table — All Force Pairs
 *     ID: book-force-pairs
 */
export function Sim_book_force_pairs() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [pair, setPair] = useState(0);
  const pairR = useRef(pair);
  useEffect(() => { pairR.current = pair; }, [pair]);
  const [rst, setRst] = useState(0);

  useEffect(() => {
    let t = 0, id: number;
    const tick = () => {
      const c = ref.current; if (!c) { id = requestAnimationFrame(tick); return; }
      const res = SC(c); if (!res) { id = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      t += DT;
      const P = pairR.current;
      const pulse = 0.7 + 0.3 * Math.abs(Math.sin(t * 2));

      BG(ctx, W, H);
      const tabY = H - 60, bookY = tabY - 45, bookX = W / 2;

      // Table
      ctx.fillStyle = "#78350f"; ctx.fillRect(W / 2 - 100, tabY, 200, 15);
      ctx.fillStyle = "#92400e"; ctx.fillRect(W / 2 - 80, tabY + 15, 10, 50);
      ctx.fillRect(W / 2 + 70, tabY + 15, 10, 50);

      // Book
      BOX(ctx, bookX, bookY, 70, 40, "#1e40af", "#1d4ed8", "📚 Book");
      TXT(ctx, "m = 1 kg", bookX, bookY + 25, "#93c5fd", 9);

      if (P === 0 || P === 1) {
        // Weight (Earth-Book gravity)
        ctx.globalAlpha = P === 0 || P === 1 ? 1 : 0.3;
        ARW(ctx, bookX - 20, bookY + 20, bookX - 20, bookY + 80, "#f87171", "W=mg↓", 3);
        ctx.globalAlpha = pulse;
        ARW(ctx, bookX - 20, bookY - 20, bookX - 20, H - 10, "#f87171", "Book→Earth↓", 1.5);
        ctx.globalAlpha = 1;
      }
      if (P === 0 || P === 2) {
        // Normal force (Table-Book contact)
        ctx.globalAlpha = P === 0 || P === 2 ? 1 : 0.3;
        ARW(ctx, bookX + 20, bookY - 20, bookX + 20, bookY - 80, "#34d399", "N↑", 3);
        ctx.globalAlpha = pulse;
        ARW(ctx, bookX + 20, tabY, bookX + 20, tabY + 70, "#34d399", "Book→Table↓", 1.5);
        ctx.globalAlpha = 1;
      }

      const labels = ["Both Force Pairs", "Pair 1: Gravity (Earth↔Book)", "Pair 2: Contact (Table↔Book)"];
      TXT(ctx, labels[P], W / 2, 22, "#fbbf24", 12);
      TXT(ctx, "Every force has an equal & opposite reaction force on the OTHER object", W / 2, H - 12, "#64748B", 10);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [rst]);

  return (
    <div style={WS}>
      <div style={HS}><p style={TS}>Book on Table — Newton's Third Law Force Pairs</p>
        <p style={DS}>A book on a table has TWO force pairs: (1) Earth pulls book down, book pulls Earth up. (2) Table pushes book up, book pushes table down. Action-reaction pairs always act on DIFFERENT objects.</p>
      </div>
      <canvas ref={ref} style={CS} />
      <div style={CRS}>
        <button style={BS} onClick={() => setPair(0)}>Both Pairs</button>
        <button style={BS} onClick={() => setPair(1)}>Pair 1: Gravity</button>
        <button style={BS} onClick={() => setPair(2)}>Pair 2: Contact</button>
        <button style={BS} onClick={() => setRst(r => r + 1)}>Reset</button>
      </div>
    </div>
  );
}

/**
 * 20. Gun and Bullet Recoil
 *     ID: gun-recoil-new
 */
export function Sim_gun_recoil_new() {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = useRef({ gunX: 0, gunV: 0, bulletX: 0, bulletV: 0, fired: false });
  const [mb, setMb] = useState(10);
  const mbR = useRef(mb);
  useEffect(() => { mbR.current = mb; }, [mb]);
  const [rst, setRst] = useState(0);

  useEffect(() => {
    p.current = { gunX: 0, gunV: 0, bulletX: 0, bulletV: 0, fired: false };
    let id: number;
    const tick = () => {
      const c = ref.current; if (!c) { id = requestAnimationFrame(tick); return; }
      const res = SC(c); if (!res) { id = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const s = p.current;
      const M_gun = 2000, M_bullet = mbR.current;

      if (s.fired) {
        s.gunX = Math.max(-W / 2 + 60, s.gunX + s.gunV * DT * 50);
        s.bulletX = Math.min(W + 50, s.bulletX + s.bulletV * DT * 50);
      }

      BG(ctx, W, H);
      const cy = H / 2;
      GND(ctx, W, cy + 40);

      // Gun
      const gx = W / 2 + s.gunX;
      BOX(ctx, gx - 30, cy, 100, 40, "#374151", "#1f2937", "🔫 Gun");
      TXT(ctx, `${(M_gun/1000).toFixed(0)}kg`, gx - 30, cy + 25, "#9ca3af", 9);

      // Bullet
      if (s.fired) {
        const bx = gx + 50 + s.bulletX;
        if (bx < W + 30) {
          CIR(ctx, bx, cy - 5, 8, "#fbbf24");
          TXT(ctx, `${M_bullet}g`, bx, cy - 20, "#fbbf24", 9);
        }
      }

      if (s.fired) {
        ARW(ctx, gx - 80, cy - 20, gx - 80 + s.gunV * 15, cy - 20, "#f87171", `${Math.abs(s.gunV).toFixed(1)}m/s`);
        ARW(ctx, gx + 90, cy - 20, gx + 90 + s.bulletV * 0.8, cy - 20, "#34d399", `${s.bulletV.toFixed(0)}m/s`);
        TXT(ctx, `Bullet (→): p = ${M_bullet}g × ${s.bulletV.toFixed(0)}m/s = ${(M_bullet*s.bulletV/1000).toFixed(1)} kg·m/s`, W / 2, 22, "#34d399", 11);
        TXT(ctx, `Gun (←): p = ${(M_gun/1000).toFixed(0)}kg × ${Math.abs(s.gunV).toFixed(2)}m/s = ${(M_gun*Math.abs(s.gunV)/1000).toFixed(1)} kg·m/s`, W / 2, 40, "#f87171", 11);
        TXT(ctx, "Equal & Opposite momenta — Total p = 0 (Conservation!)", W / 2, H - 12, "#fbbf24", 11);
      } else {
        TXT(ctx, "System at rest. Click 'Fire!' to see action-reaction.", W / 2, 22, "#94A3B8", 11);
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [rst]);

  return (
    <div style={WS}>
      <div style={HS}><p style={TS}>Gun Recoil — Newton's 3rd Law &amp; Momentum</p>
        <p style={DS}>When a gun fires a bullet, the bullet goes forward (action). The gun recoils backward with equal momentum (reaction). Light bullet goes fast, heavy gun moves slowly.</p>
      </div>
      <canvas ref={ref} style={CS} />
      <div style={CRS}>
        <div style={SGS}><label style={SLS}>Bullet Mass: {mb} g</label><input type="range" min={5} max={50} value={mb} onChange={e => setMb(+e.target.value)} style={SS} /></div>
        <button style={BS} onClick={() => { const M_gun=2000, M_b=mbR.current, v_b=400; p.current = { gunX:0, gunV: -(M_b*v_b/M_gun), bulletX:0, bulletV:v_b, fired:true }; }}>🔥 Fire!</button>
        <button style={BS} onClick={() => setRst(r => r + 1)}>Reset</button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * TOPIC 5: CONSERVATION OF MOMENTUM
 * ════════════════════════════════════════════════════════════════════ */

/**
 * 21. Elastic Collision — 1D with momentum bars
 *     ID: elastic-collision-1d
 */
export function Sim_elastic_collision_1d() {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = useRef({ x1: 0, v1: 0, x2: 0, v2: 0, collided: false });
  const [m1, setM1] = useState(3);
  const [m2, setM2] = useState(5);
  const [v1i, setV1i] = useState(8);
  const m1R = useRef(m1), m2R = useRef(m2), v1R = useRef(v1i);
  useEffect(() => { m1R.current = m1; }, [m1]);
  useEffect(() => { m2R.current = m2; }, [m2]);
  useEffect(() => { v1R.current = v1i; }, [v1i]);
  const [rst, setRst] = useState(0);

  useEffect(() => {
    const M1 = m1R.current, M2 = m2R.current, V1 = v1R.current;
    p.current = { x1: 60, v1: V1, x2: 0, v2: 0, collided: false };
    let id: number;
    const tick = () => {
      const c = ref.current; if (!c) { id = requestAnimationFrame(tick); return; }
      const res = SC(c); if (!res) { id = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const s = p.current;
      const b2x0 = W / 2 + 20;
      if (!s.collided) s.x2 = b2x0;

      s.x1 += s.v1 * DT * 35;
      s.x2 += s.v2 * DT * 35;
      const sep = 30 + 25;
      if (!s.collided && s.x1 + sep >= s.x2) {
        // Elastic collision
        const v1f = ((M1 - M2) * s.v1 + 2 * M2 * s.v2) / (M1 + M2);
        const v2f = ((M2 - M1) * s.v2 + 2 * M1 * s.v1) / (M1 + M2);
        s.v1 = v1f; s.v2 = v2f; s.collided = true;
      }

      BG(ctx, W, H);
      const trackY = H - 40; GND(ctx, W, trackY);
      // Track
      ctx.strokeStyle = "rgba(99,102,241,0.3)"; ctx.lineWidth = 1; ctx.setLineDash([5, 5]);
      ctx.beginPath(); ctx.moveTo(0, trackY - 28); ctx.lineTo(W, trackY - 28); ctx.stroke();
      ctx.setLineDash([]);

      const cy = trackY - 28;
      const r1 = 20 + M1 * 2, r2 = 20 + M2 * 2;
      CIR(ctx, s.x1, cy, r1, "#4f46e5");
      TXT(ctx, `${M1}kg`, s.x1, cy, "#fff", 10);
      CIR(ctx, s.x2, cy, r2, "#d97706");
      TXT(ctx, `${M2}kg`, s.x2, cy, "#fff", 10);

      if (s.v1 !== 0) ARW(ctx, s.x1 + Math.sign(s.v1)*r1, cy - 10, s.x1 + Math.sign(s.v1)*r1 + s.v1*8, cy - 10, "#4f46e5", `${s.v1.toFixed(1)}m/s`);
      if (Math.abs(s.v2) > 0.1) ARW(ctx, s.x2 + Math.sign(s.v2)*r2, cy - 10, s.x2 + Math.sign(s.v2)*r2 + s.v2*8, cy - 10, "#d97706", `${s.v2.toFixed(1)}m/s`);

      const p_before = M1 * v1i;
      const p_after = M1 * s.v1 + M2 * s.v2;
      TXT(ctx, s.collided ? `After: p₁=${(M1*s.v1).toFixed(1)}, p₂=${(M2*s.v2).toFixed(1)}, Total=${p_after.toFixed(1)} kg·m/s ✓ CONSERVED` : `Before: p₁ = ${M1}×${v1i} = ${p_before} kg·m/s`, W/2, 22, "#fbbf24", 11);
      TXT(ctx, "Elastic Collision: Both momentum AND kinetic energy are conserved", W/2, H-12, "#34d399", 10);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [rst, v1i]);

  return (
    <div style={WS}>
      <div style={HS}><p style={TS}>Elastic Collision — Momentum &amp; KE Both Conserved</p>
        <p style={DS}>Ball 1 (blue) hits stationary Ball 2 (orange). After collision, momenta are exchanged such that total momentum is conserved. Lighter ball bounces back if m₁ &lt; m₂.</p>
      </div>
      <canvas ref={ref} style={CS} />
      <div style={CRS}>
        <div style={SGS}><label style={SLS}>Ball 1 Mass: {m1} kg</label><input type="range" min={1} max={10} value={m1} onChange={e => setM1(+e.target.value)} style={SS} /></div>
        <div style={SGS}><label style={SLS}>Ball 2 Mass: {m2} kg</label><input type="range" min={1} max={10} value={m2} onChange={e => setM2(+e.target.value)} style={SS} /></div>
        <div style={SGS}><label style={SLS}>Initial Speed: {v1i} m/s</label><input type="range" min={2} max={15} value={v1i} onChange={e => setV1i(+e.target.value)} style={SS} /></div>
        <button style={BS} onClick={() => setRst(r => r + 1)}>Reset</button>
      </div>
    </div>
  );
}

/**
 * 22. Perfectly Inelastic Collision — they stick together
 *     ID: inelastic-stick-pro
 */
export function Sim_inelastic_stick_pro() {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = useRef({ x1: 0, v1: 0, x2: 0, v2: 0, stuck: false });
  const [m1, setM1] = useState(4);
  const [m2, setM2] = useState(6);
  const [u1, setU1] = useState(10);
  const m1R = useRef(m1), m2R = useRef(m2), u1R = useRef(u1);
  useEffect(() => { m1R.current = m1; }, [m1]);
  useEffect(() => { m2R.current = m2; }, [m2]);
  useEffect(() => { u1R.current = u1; }, [u1]);
  const [rst, setRst] = useState(0);

  useEffect(() => {
    const U1 = u1R.current;
    p.current = { x1: 60, v1: U1, x2: 0, v2: 0, stuck: false };
    let id: number;
    const tick = () => {
      const c = ref.current; if (!c) { id = requestAnimationFrame(tick); return; }
      const res = SC(c); if (!res) { id = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const s = p.current;
      const M1 = m1R.current, M2 = m2R.current;
      if (!s.stuck) s.x2 = W / 2 + 30;

      if (!s.stuck) {
        s.x1 += s.v1 * DT * 35;
        if (s.x1 + 25 >= s.x2 - 25) {
          // Perfectly inelastic
          s.v1 = s.v2 = (M1 * s.v1 + M2 * s.v2) / (M1 + M2);
          s.stuck = true;
        }
      } else {
        s.x1 += s.v1 * DT * 35;
        s.x2 = s.x1 + 50;
      }

      BG(ctx, W, H);
      GND(ctx, W, H - 40);
      const cy = H - 60;

      if (!s.stuck) {
        BOX(ctx, s.x1, cy, 50, 44, "#4f46e5", "#3730a3", `${M1}kg`);
        BOX(ctx, s.x2, cy, 50, 44, "#dc2626", "#991b1b", `${M2}kg`);
        if (s.v1 > 0) ARW(ctx, s.x1 + 25, cy - 15, s.x1 + 25 + s.v1*6, cy-15, "#4f46e5", `${u1}m/s`);
        TXT(ctx, `p_before = ${M1}×${u1} + ${M2}×0 = ${M1*u1} kg·m/s`, W/2, 22, "#fbbf24", 11);
      } else {
        // They're stuck together
        ctx.save();
        const grd = ctx.createLinearGradient(s.x1-25, 0, s.x1+75, 0);
        grd.addColorStop(0, "#4f46e5"); grd.addColorStop(1, "#dc2626");
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.roundRect ? ctx.roundRect(s.x1-25, cy-22, 100, 44, 7) : ctx.rect(s.x1-25, cy-22, 100, 44);
        ctx.fill(); ctx.restore();
        TXT(ctx, `${M1+M2}kg`, s.x1+25, cy, "#fff", 11);
        ARW(ctx, s.x1+75, cy-15, s.x1+75+s.v1*6, cy-15, "#fbbf24", `${s.v1.toFixed(2)}m/s`);
        const pafter = (M1+M2)*s.v1;
        TXT(ctx, `p_after = ${M1+M2}×${s.v1.toFixed(2)} = ${pafter.toFixed(1)} ≈ ${M1*u1} ✓ CONSERVED`, W/2, 22, "#34d399", 11);
      }
      TXT(ctx, "Perfectly Inelastic: v_final = (m₁u₁+m₂u₂)/(m₁+m₂) — momentum conserved, KE not", W/2, H-10, "#64748B", 10);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [rst, u1]);

  return (
    <div style={WS}>
      <div style={HS}><p style={TS}>Perfectly Inelastic Collision — Objects Stick Together</p>
        <p style={DS}>The two blocks stick together after collision. Final velocity = (m₁u₁)/(m₁+m₂). Momentum is conserved but kinetic energy is lost (converted to heat/sound).</p>
      </div>
      <canvas ref={ref} style={CS} />
      <div style={CRS}>
        <div style={SGS}><label style={SLS}>Block 1: {m1} kg</label><input type="range" min={1} max={12} value={m1} onChange={e => setM1(+e.target.value)} style={SS} /></div>
        <div style={SGS}><label style={SLS}>Block 2: {m2} kg</label><input type="range" min={1} max={12} value={m2} onChange={e => setM2(+e.target.value)} style={SS} /></div>
        <div style={SGS}><label style={SLS}>Initial Speed: {u1} m/s</label><input type="range" min={2} max={20} value={u1} onChange={e => setU1(+e.target.value)} style={SS} /></div>
        <button style={BS} onClick={() => setRst(r => r + 1)}>Reset</button>
      </div>
    </div>
  );
}

/**
 * 23. Explosion from Rest — momentum conservation
 *     ID: explosion-from-rest
 */
export function Sim_explosion_from_rest() {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = useRef({ x1: 0, v1: 0, x2: 0, v2: 0, exploded: false, particles: [] as {x:number,y:number,vx:number,vy:number,life:number,col:string}[] });
  const [m1, setM1] = useState(3);
  const [m2, setM2] = useState(5);
  const m1R = useRef(m1), m2R = useRef(m2);
  useEffect(() => { m1R.current = m1; }, [m1]);
  useEffect(() => { m2R.current = m2; }, [m2]);
  const [rst, setRst] = useState(0);

  useEffect(() => {
    p.current = { x1: 0, v1: 0, x2: 0, v2: 0, exploded: false, particles: [] };
    let id: number;
    const tick = () => {
      const c = ref.current; if (!c) { id = requestAnimationFrame(tick); return; }
      const res = SC(c); if (!res) { id = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const s = p.current;
      const M1 = m1R.current, M2 = m2R.current;

      if (s.exploded) {
        s.x1 = Math.max(-W / 2, s.x1 + s.v1 * DT * 50);
        s.x2 = Math.min(W / 2, s.x2 + s.v2 * DT * 50);
        s.particles = s.particles.map(pt => ({ ...pt, x: pt.x + pt.vx, y: pt.y + pt.vy, vy: pt.vy + 0.05, life: pt.life - 0.03 })).filter(pt => pt.life > 0);
      }

      BG(ctx, W, H);
      GND(ctx, W, H - 35);
      const cy = H - 55, cx = W / 2;

      s.particles.forEach(pt => {
        ctx.globalAlpha = pt.life;
        CIR(ctx, pt.x, pt.y, 4 * pt.life, pt.col);
      });
      ctx.globalAlpha = 1;

      if (!s.exploded) {
        // Combined object at rest
        BOX(ctx, cx, cy, 80, 44, "#4f46e5", "#dc2626", `${M1+M2}kg`);
        TXT(ctx, "At REST — p_total = 0", cx, 22, "#94A3B8", 11);
        TXT(ctx, "→ Click 'Explode!' to see momentum conservation", cx, 40, "#6366f1", 11);
      } else {
        const b1x = cx + s.x1, b2x = cx + s.x2;
        BOX(ctx, b1x, cy, 40 + M1*3, 44, "#4f46e5", "#3730a3", `${M1}kg`);
        BOX(ctx, b2x, cy, 40 + M2*3, 44, "#dc2626", "#991b1b", `${M2}kg`);
        ARW(ctx, b1x - 25, cy - 15, b1x - 25 + s.v1*7, cy-15, "#4f46e5", `${s.v1.toFixed(1)}m/s`);
        ARW(ctx, b2x + 25, cy - 15, b2x + 25 + s.v2*7, cy-15, "#dc2626", `${s.v2.toFixed(1)}m/s`);
        const ptot = M1*s.v1 + M2*s.v2;
        TXT(ctx, `p₁ = ${M1}×${s.v1.toFixed(1)} = ${(M1*s.v1).toFixed(1)}`, cx - 80, 22, "#60a5fa", 10, "center");
        TXT(ctx, `p₂ = ${M2}×${s.v2.toFixed(1)} = ${(M2*s.v2).toFixed(1)}`, cx + 80, 22, "#f87171", 10, "center");
        TXT(ctx, `Total p = ${ptot.toFixed(2)} ≈ 0 ✓ CONSERVED (equal & opposite)`, cx, 40, "#34d399", 11);
      }
      TXT(ctx, "Law of Conservation: Total p before = Total p after. Started from rest → total p = 0 always!", cx, H-10, "#64748B", 10);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [rst]);

  return (
    <div style={WS}>
      <div style={HS}><p style={TS}>Explosion from Rest — Conservation of Momentum</p>
        <p style={DS}>System starts at rest (p=0). After explosion, both pieces fly apart with equal and opposite momenta. Total momentum = 0 always. Lighter piece moves faster!</p>
      </div>
      <canvas ref={ref} style={CS} />
      <div style={CRS}>
        <div style={SGS}><label style={SLS}>Piece 1: {m1} kg</label><input type="range" min={1} max={10} value={m1} onChange={e => setM1(+e.target.value)} style={SS} /></div>
        <div style={SGS}><label style={SLS}>Piece 2: {m2} kg</label><input type="range" min={1} max={10} value={m2} onChange={e => setM2(+e.target.value)} style={SS} /></div>
        <button style={BS} onClick={() => {
          const M1=m1R.current, M2=m2R.current;
          const v_total = 15;
          const v2 = (M1 * v_total) / (M1 + M2);
          const v1 = -M2 * v2 / M1;
          p.current.v1 = v1; p.current.v2 = v2; p.current.exploded = true;
          p.current.particles = Array.from({length:30}, () => ({
            x: window.innerWidth/2, y: 180, vx:(Math.random()-0.5)*8, vy:-Math.random()*5,
            life:1, col:Math.random()>0.5?"#fbbf24":"#f87171"
          }));
        }}>💥 Explode!</button>
        <button style={BS} onClick={() => setRst(r => r + 1)}>Reset</button>
      </div>
    </div>
  );
}

/**
 * 24. Bullet Embeds in Clay Block — momentum transfer
 *     ID: bullet-clay-momentum
 */
export function Sim_bullet_clay_momentum() {
  const ref = useRef<HTMLCanvasElement>(null);
  const p = useRef({ bulletX: 0, bulletV: 0, blockX: 0, blockV: 0, embedded: false });
  const [vb, setVb] = useState(300);
  const [mb, setMb] = useState(20);
  const vbR = useRef(vb), mbR = useRef(mb);
  useEffect(() => { vbR.current = vb; }, [vb]);
  useEffect(() => { mbR.current = mb; }, [mb]);
  const [rst, setRst] = useState(0);

  useEffect(() => {
    p.current = { bulletX: 30, bulletV: vbR.current, blockX: 0, blockV: 0, embedded: false };
    let id: number;
    const tick = () => {
      const c = ref.current; if (!c) { id = requestAnimationFrame(tick); return; }
      const res = SC(c); if (!res) { id = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const s = p.current;
      const M_b = mbR.current / 1000, M_c = 2, V_b = vbR.current;
      const blockHome = W / 2 + 30;
      if (!s.embedded) s.blockX = blockHome;

      if (!s.embedded) {
        s.bulletX += s.bulletV * DT * (s.bulletV > 50 ? 0.3 : 0.6);
        if (s.bulletX >= s.blockX - 35) {
          const vf = (M_b * s.bulletV) / (M_b + M_c);
          s.blockV = vf; s.bulletV = vf; s.embedded = true;
        }
      } else {
        s.blockX = Math.min(W - 80, s.blockX + s.blockV * DT * 40);
        s.bulletX = s.blockX - 30;
        s.blockV *= 0.998;
      }

      BG(ctx, W, H);
      GND(ctx, W, H - 40);
      const cy = H - 60;

      // Bullet
      if (!s.embedded) {
        ctx.save(); ctx.fillStyle = "#fbbf24";
        ctx.beginPath(); ctx.ellipse(s.bulletX, cy - 5, 12, 5, 0, 0, Math.PI * 2);
        ctx.fill(); ctx.restore();
        ARW(ctx, s.bulletX + 12, cy - 5, s.bulletX + 12 + s.bulletV * 0.15, cy-5, "#fbbf24", `${s.bulletV.toFixed(0)}m/s`);
      }

      // Clay block
      BOX(ctx, s.blockX, cy, 70, 55, "#78350f", "#92400e", s.embedded ? "Clay+Bullet" : "Clay 2kg");
      if (s.embedded) {
        TXT(ctx, `v=${s.blockV.toFixed(2)}m/s`, s.blockX, cy+35, "#fbbf24", 9);
      }

      const p_before = M_b * V_b;
      const p_after = (M_b + M_c) * s.blockV;
      TXT(ctx, s.embedded
        ? `p_after = ${(M_b+M_c).toFixed(3)}×${s.blockV.toFixed(2)} = ${p_after.toFixed(3)} ≈ ${p_before.toFixed(3)} ✓`
        : `p_before = ${M_b.toFixed(3)}kg × ${V_b}m/s = ${p_before.toFixed(3)} kg·m/s`,
        W / 2, 22, "#fbbf24", 11);
      TXT(ctx, `v_final = m_bullet × v_bullet / (m_bullet + m_clay) = ${((M_b*V_b)/(M_b+M_c)).toFixed(2)} m/s`, W / 2, 40, "#22d3ee", 10);
      TXT(ctx, "Perfectly Inelastic: Bullet & Block move together. Momentum conserved!", W / 2, H - 10, "#94A3B8", 10);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [rst, vb, mb]);

  return (
    <div style={WS}>
      <div style={HS}><p style={TS}>Bullet in Clay — Momentum Transfer (Inelastic)</p>
        <p style={DS}>A light, fast bullet embeds in a heavy clay block. Final velocity = (m_bullet × v_bullet) / (m_bullet + m_clay). Classic Class 9 momentum conservation problem!</p>
      </div>
      <canvas ref={ref} style={CS} />
      <div style={CRS}>
        <div style={SGS}><label style={SLS}>Bullet Speed: {vb} m/s</label><input type="range" min={50} max={500} step={10} value={vb} onChange={e => setVb(+e.target.value)} style={SS} /></div>
        <div style={SGS}><label style={SLS}>Bullet Mass: {mb} g</label><input type="range" min={5} max={50} value={mb} onChange={e => setMb(+e.target.value)} style={SS} /></div>
        <button style={BS} onClick={() => setRst(r => r + 1)}>Reset</button>
      </div>
    </div>
  );
}

/**
 * 25. Newton's Cradle — 5 balls, momentum chain transfer
 *     ID: newton-cradle-pro
 */
export function Sim_newton_cradle_pro() {
  const ref = useRef<HTMLCanvasElement>(null);
  const N = 5;
  const L = 80;
  const p = useRef({
    angles: Array(N).fill(0) as number[],
    angVels: Array(N).fill(0) as number[],
  });
  const [rst, setRst] = useState(0);
  const [lifted, setLifted] = useState(1);
  const liftedR = useRef(lifted);
  useEffect(() => { liftedR.current = lifted; }, [lifted]);

  useEffect(() => {
    const n_lift = liftedR.current;
    const angles = Array(N).fill(0) as number[];
    const angVels = Array(N).fill(0) as number[];
    for (let i = 0; i < n_lift; i++) angles[i] = -0.7;
    p.current = { angles, angVels };

    let id: number;
    const tick = () => {
      const c = ref.current; if (!c) { id = requestAnimationFrame(tick); return; }
      const res = SC(c); if (!res) { id = requestAnimationFrame(tick); return; }
      const [ctx, W, H] = res;
      const s = p.current;

      // Pendulum physics for each ball
      const damping = 0.999;
      for (let i = 0; i < N; i++) {
        s.angVels[i] += -(G / L) * Math.sin(s.angles[i]) * DT * 60;
        s.angVels[i] *= damping;
      }

      // Collision detection — leftmost balls hitting right balls
      for (let i = 0; i < N - 1; i++) {
        const xi = Math.sin(s.angles[i]) * L;
        const xi1 = Math.sin(s.angles[i + 1]) * L;
        if (xi >= xi1 - 1 && s.angVels[i] > s.angVels[i + 1]) {
          // Transfer velocity (elastic, equal mass)
          const v = s.angVels[i];
          s.angVels[i] = s.angVels[i + 1];
          s.angVels[i + 1] = v;
        }
      }

      for (let i = 0; i < N; i++) {
        s.angles[i] += s.angVels[i] * DT * 60;
        s.angles[i] = Math.max(-0.8, Math.min(0.8, s.angles[i]));
      }

      BG(ctx, W, H);
      const pivotY = 50;
      const spacing = 24;
      const startX = W / 2 - ((N - 1) * spacing) / 2;
      const colors = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"];

      // Frame
      ctx.save();
      ctx.strokeStyle = "#334155"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(startX - 20, pivotY); ctx.lineTo(startX + (N-1)*spacing + 20, pivotY); ctx.stroke();
      ctx.restore();

      for (let i = 0; i < N; i++) {
        const px = startX + i * spacing;
        const bx = px + Math.sin(s.angles[i]) * L;
        const by = pivotY + Math.cos(s.angles[i]) * L;
        // String
        ctx.save(); ctx.strokeStyle = "#64748B"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(px, pivotY); ctx.lineTo(bx, by); ctx.stroke(); ctx.restore();
        // Ball
        CIR(ctx, bx, by, 11, colors[i]);
      }

      const n_lift = liftedR.current;
      TXT(ctx, `${n_lift} ball${n_lift>1?"s":""} lifted → ${n_lift} ball${n_lift>1?"s":""} swing${n_lift>1?"":"s"} out other side`, W / 2, H - 28, "#fbbf24", 12);
      TXT(ctx, "Momentum transfers through the chain — only equal mass balls transfer perfectly", W / 2, H - 12, "#64748B", 10);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [rst, lifted]);

  return (
    <div style={WS}>
      <div style={HS}><p style={TS}>Newton's Cradle — Momentum Chain Transfer</p>
        <p style={DS}>Lift n balls on one side — exactly n balls swing out the other side. Each collision transfers momentum through the chain. Equal mass = perfect momentum transfer.</p>
      </div>
      <canvas ref={ref} style={CS} />
      <div style={CRS}>
        <div style={SGS}><label style={SLS}>Balls to Lift: {lifted}</label><input type="range" min={1} max={3} value={lifted} onChange={e => setLifted(+e.target.value)} style={SS} /></div>
        <button style={BS} onClick={() => setRst(r => r + 1)}>Reset</button>
      </div>
    </div>
  );
}
