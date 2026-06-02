/**
 * FILE: TopicUltraNew5.tsx
 * PURPOSE: 6 ultra-professional canvas-based physics simulations for
 *          Topic 5 — Conservation of Momentum (CBSE Class 9, Chapter 9)
 *
 * SIMULATIONS:
 *   Ultra5_ElasticCollision1D  — 1D elastic collision with adjustable masses/velocities
 *   Ultra5_InelasticCollision  — 1D perfectly inelastic (stick together)
 *   Ultra5_ExplosionRest       — Object at rest explodes into two pieces
 *   Ultra5_NewtonsCradle       — Newton's cradle with real momentum chain
 *   Ultra5_RocketMomentum      — Rocket + exhaust: total momentum = 0
 *   Ultra5_MomentumGraphLive   — Live momentum conservation graph (before/after)
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
  ctx.save(); ctx.strokeStyle = "rgba(99,102,241,0.05)"; ctx.lineWidth = 1;
  for (let x = 40; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 40; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  ctx.restore();
}

/* ═══════════════════════════════════════════════════
 * SIMULATION 1 — 1D Elastic Collision
 * ═══════════════════════════════════════════════════ */
export function Ultra5_ElasticCollision1D() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [m1, setM1] = useState(3);
  const [m2, setM2] = useState(5);
  const [v1init, setV1init] = useState(50);
  const raf = useRef(0);
  const b1x = useRef(80);
  const b2x = useRef(500);
  const v1r = useRef(50);
  const v2r = useRef(0);
  const collided = useRef(false);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CW = c.width, CH = c.height;
    b1x.current = 80; b2x.current = CW - 100;
    v1r.current = v1init; v2r.current = 0; collided.current = false;

    const r1 = Math.sqrt(m1) * 10 + 8, r2 = Math.sqrt(m2) * 10 + 8;

    function draw() {
      if (!collided.current) {
        b1x.current += v1r.current * 0.04;
        if (b1x.current + r1 >= b2x.current - r2) {
          collided.current = true;
          const iv1 = v1r.current;
          v1r.current = ((m1 - m2) * iv1) / (m1 + m2);
          v2r.current = (2 * m1 * iv1) / (m1 + m2);
        }
      } else {
        b1x.current += v1r.current * 0.04;
        b2x.current += v2r.current * 0.04;
        if (b2x.current > CW + 100 || (b1x.current < -100 && b2x.current > CW + 100)) {
          b1x.current = 80; b2x.current = CW - 100; v1r.current = v1init; v2r.current = 0; collided.current = false;
        }
      }

      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, CW, CH);
      grid(ctx, CW, CH);

      const gy = CH * 0.62;
      ctx.fillStyle = "#1e3050"; ctx.fillRect(30, gy - 3, CW - 60, 6);

      const b1y = gy - r1, b2y = gy - r2;

      /* Ball 1 */
      const g1 = ctx.createRadialGradient(b1x.current - r1 * 0.3, b1y - r1 * 0.3, 0, b1x.current, b1y, r1);
      g1.addColorStop(0, "#60a5fa"); g1.addColorStop(1, "#1d4ed8");
      ctx.fillStyle = g1; ctx.beginPath(); ctx.arc(b1x.current, b1y, r1, 0, Math.PI * 2); ctx.fill();
      txt(ctx, `${m1}`, b1x.current, b1y, "#fff", 11, "center", true);

      /* Ball 2 */
      const g2 = ctx.createRadialGradient(b2x.current - r2 * 0.3, b2y - r2 * 0.3, 0, b2x.current, b2y, r2);
      g2.addColorStop(0, "#f87171"); g2.addColorStop(1, "#b91c1c");
      ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(b2x.current, b2y, r2, 0, Math.PI * 2); ctx.fill();
      txt(ctx, `${m2}`, b2x.current, b2y, "#fff", 11, "center", true);

      /* Velocity arrows */
      const arScale = 0.8;
      if (Math.abs(v1r.current) > 0.3) {
        const dir = v1r.current > 0 ? 1 : -1;
        arrow(ctx, b1x.current, b1y - r1 - 8, b1x.current + dir * Math.min(80, Math.abs(v1r.current) * arScale), b1y - r1 - 8, P.blueHi, 2.5);
        txt(ctx, `${v1r.current.toFixed(1)}m/s`, b1x.current + dir * 40, b1y - r1 - 20, P.blueHi, 9, "center");
      }
      if (Math.abs(v2r.current) > 0.3) {
        const dir = v2r.current > 0 ? 1 : -1;
        arrow(ctx, b2x.current, b2y - r2 - 8, b2x.current + dir * Math.min(80, Math.abs(v2r.current) * arScale), b2y - r2 - 8, P.red, 2.5);
        txt(ctx, `${v2r.current.toFixed(1)}m/s`, b2x.current + dir * 40, b2y - r2 - 20, P.red, 9, "center");
      }

      /* Momentum bars */
      const p1 = m1 * v1r.current, p2 = m2 * v2r.current;
      const pBefore = m1 * v1init;
      const pAfter = p1 + p2;

      const barY = CH - 55;
      ctx.fillStyle = P.panel; rr(ctx, 30, barY, CW - 60, 30, 5); ctx.fill();
      ctx.strokeStyle = P.border; ctx.lineWidth = 1; rr(ctx, 30, barY, CW - 60, 30, 5); ctx.stroke();
      const maxP = Math.abs(pBefore) * 1.2 || 100;
      const midX = CW / 2;
      /* p1 bar */
      if (Math.abs(p1) > 0.1) {
        const w1 = Math.min((CW - 70) / 2, Math.abs(p1 / maxP) * (CW - 70) / 2);
        ctx.fillStyle = P.blueHi + "99";
        ctx.fillRect(p1 > 0 ? midX : midX - w1, barY + 3, w1, 24);
      }
      /* p2 bar */
      if (Math.abs(p2) > 0.1) {
        const w2 = Math.min((CW - 70) / 2, Math.abs(p2 / maxP) * (CW - 70) / 2);
        ctx.fillStyle = P.red + "99";
        ctx.fillRect(p2 > 0 ? midX : midX - w2, barY + 3, w2, 24);
      }
      txt(ctx, `p₁=${p1.toFixed(1)}`, 40, barY + 15, P.blueHi, 10);
      txt(ctx, `p₂=${p2.toFixed(1)}`, CW - 90, barY + 15, P.red, 10);
      txt(ctx, `p_total = ${pAfter.toFixed(1)} (before: ${pBefore.toFixed(1)})`, CW / 2, barY + 15, P.amber, 10, "center", true);

      txt(ctx, "1D Elastic Collision — Conservation of Momentum", 16, 22, P.blueHi, 13, "left", true);
      txt(ctx, `m₁=${m1}kg  m₂=${m2}kg  v₁=${v1init}m/s  →  v₁'=${v1r.current.toFixed(1)}  v₂'=${v2r.current.toFixed(1)} m/s`, CW / 2, 22, P.dim, 9, "center");

      raf.current = requestAnimationFrame(draw);
    }
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [m1, m2, v1init]);

  return (
    <div style={{ background: P.bg, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden", fontFamily: "Inter,system-ui,sans-serif" }}>
      <canvas ref={ref} width={640} height={H} style={{ width: W, height: "auto", display: "block" }} />
      <div style={{ padding: "14px 20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px 20px", background: P.panel, borderTop: `1px solid ${P.border}` }}>
        {[{ label: "Mass 1 (kg)", val: m1, set: setM1, col: P.blueHi, min: 1, max: 15 },
          { label: "Mass 2 (kg)", val: m2, set: setM2, col: P.red, min: 1, max: 15 },
          { label: "Initial v₁ (m/s)", val: v1init, set: setV1init, col: P.amber, min: 10, max: 80 }]
          .map(({ label, val, set, col, min, max }) => (
            <label key={label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: P.dim }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: col }}>{val}</span>
              </div>
              <input type="range" min={min} max={max} value={val}
                onChange={e => { set(+e.target.value); b1x.current = 80; b2x.current = 500; collided.current = false; }}
                style={{ width: "100%", accentColor: col }} />
            </label>
          ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
 * SIMULATION 2 — Perfectly Inelastic Collision
 * ═══════════════════════════════════════════════════ */
export function Ultra5_InelasticCollision() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [m1, setM1] = useState(4);
  const [m2, setM2] = useState(6);
  const [v1i, setV1i] = useState(40);
  const raf = useRef(0);
  const b1x = useRef(80);
  const v1r = useRef(40);
  const collided = useRef(false);
  const combinedVel = useRef(0);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CW = c.width, CH = c.height;
    b1x.current = 80; v1r.current = v1i; collided.current = false;

    const r1 = Math.sqrt(m1) * 10 + 8, r2 = Math.sqrt(m2) * 10 + 8;
    const b2x = CW - 100;

    function draw() {
      if (!collided.current) {
        b1x.current += v1r.current * 0.04;
        if (b1x.current + r1 >= b2x - r2) {
          collided.current = true;
          combinedVel.current = (m1 * v1r.current) / (m1 + m2);
        }
      } else {
        b1x.current += combinedVel.current * 0.04;
        if (b1x.current > CW + 100) { b1x.current = 80; v1r.current = v1i; collided.current = false; }
      }

      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, CW, CH);
      grid(ctx, CW, CH);

      const gy = CH * 0.62;
      ctx.fillStyle = "#1e3050"; ctx.fillRect(30, gy - 3, CW - 60, 6);

      if (!collided.current) {
        /* Ball 1 moving */
        ctx.fillStyle = "#1d4ed8"; ctx.beginPath(); ctx.arc(b1x.current, gy - r1, r1, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = P.blueHi; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(b1x.current, gy - r1, r1, 0, Math.PI * 2); ctx.stroke();
        txt(ctx, `${m1}kg`, b1x.current, gy - r1, "#fff", 11, "center", true);
        arrow(ctx, b1x.current, gy - r1 - r1 - 8, b1x.current + v1r.current, gy - r1 - r1 - 8, P.blueHi, 2.5);
        txt(ctx, `${v1r.current}m/s`, b1x.current + v1r.current / 2, gy - r1 - r1 - 20, P.blueHi, 9, "center");

        /* Ball 2 stationary */
        ctx.fillStyle = "#b91c1c"; ctx.beginPath(); ctx.arc(b2x, gy - r2, r2, 0, Math.PI * 2); ctx.fill();
        txt(ctx, `${m2}kg`, b2x, gy - r2, "#fff", 11, "center", true);
        txt(ctx, "0 m/s", b2x, gy - r2 - r2 - 10, P.dim, 9, "center");
      } else {
        /* Combined mass */
        const cr = Math.sqrt(m1 + m2) * 8 + 10;
        const cx = b1x.current + (r2 - r1) / 2;
        const g2 = ctx.createRadialGradient(cx - cr * 0.3, gy - cr * 0.3, 0, cx, gy, cr);
        g2.addColorStop(0, "#818cf8"); g2.addColorStop(1, "#3730a3");
        ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(cx, gy - cr, cr, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = P.purple; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, gy - cr, cr, 0, Math.PI * 2); ctx.stroke();
        txt(ctx, `${m1 + m2}kg`, cx, gy - cr, "#fff", 11, "center", true);
        const vComb = combinedVel.current;
        if (Math.abs(vComb) > 0.1) {
          arrow(ctx, cx, gy - cr - cr - 8, cx + vComb * 2, gy - cr - cr - 8, P.purple, 2.5);
          txt(ctx, `v=${vComb.toFixed(2)}m/s`, cx + vComb, gy - cr - cr - 20, P.purple, 9, "center");
        }
      }

      /* Formula */
      const vf = (m1 * v1i / (m1 + m2)).toFixed(2);
      ctx.fillStyle = P.panel + "ee"; rr(ctx, CW - 210, 40, 195, 70, 8); ctx.fill();
      ctx.strokeStyle = P.border; ctx.lineWidth = 1; rr(ctx, CW - 210, 40, 195, 70, 8); ctx.stroke();
      txt(ctx, "m₁v₁ = (m₁+m₂)v'", CW - 115, 58, P.amber, 10, "center", true);
      txt(ctx, `v' = ${m1}×${v1i}/(${m1}+${m2})`, CW - 115, 76, P.dim, 10, "center");
      txt(ctx, `v' = ${vf} m/s`, CW - 115, 94, P.green, 12, "center", true);

      txt(ctx, "Perfectly Inelastic Collision — Momentum Conserved", 16, 22, P.blueHi, 13, "left", true);
      txt(ctx, "Balls stick together — kinetic energy NOT conserved, momentum IS!", CW / 2, CH - 18, P.amber, 10, "center");

      raf.current = requestAnimationFrame(draw);
    }
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [m1, m2, v1i]);

  return (
    <div style={{ background: P.bg, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden", fontFamily: "Inter,system-ui,sans-serif" }}>
      <canvas ref={ref} width={640} height={H} style={{ width: W, height: "auto", display: "block" }} />
      <div style={{ padding: "14px 20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px 20px", background: P.panel, borderTop: `1px solid ${P.border}` }}>
        {[{ label: "Mass 1 (kg)", val: m1, set: setM1, col: P.blueHi, min: 1, max: 15 },
          { label: "Mass 2 (kg)", val: m2, set: setM2, col: P.red, min: 1, max: 15 },
          { label: "Initial speed v₁", val: v1i, set: setV1i, col: P.amber, min: 10, max: 80 }]
          .map(({ label, val, set, col, min, max }) => (
            <label key={label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: P.dim }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: col }}>{val}</span>
              </div>
              <input type="range" min={min} max={max} value={val}
                onChange={e => { set(+e.target.value); b1x.current = 80; collided.current = false; }}
                style={{ width: "100%", accentColor: col }} />
            </label>
          ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
 * SIMULATION 3 — Explosion from Rest
 * p_before = 0 → two pieces fly apart with equal & opposite momentum
 * ═══════════════════════════════════════════════════ */
export function Ultra5_ExplosionRest() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [m1, setM1] = useState(3);
  const [m2, setM2] = useState(7);
  const [exploded, setExploded] = useState(false);
  const raf = useRef(0);
  const b1x = useRef(320);
  const b2x = useRef(320);
  const v1r = useRef(0);
  const v2r = useRef(0);
  const particles = useRef<Array<{x: number, y: number, vx: number, vy: number, life: number, col: string}>>([]);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CW = c.width, CH = c.height;

    if (!exploded) {
      b1x.current = CW / 2; b2x.current = CW / 2; v1r.current = 0; v2r.current = 0; particles.current = [];
    } else {
      const impulseMag = 60;
      v1r.current = -impulseMag / m1;
      v2r.current = impulseMag / m2;
      /* Explosion particles */
      for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 5;
        const cols = [P.red, P.amber, "#f97316", "#fde68a", "#fff"];
        particles.current.push({ x: CW / 2, y: CH * 0.5, vx: speed * Math.cos(angle), vy: speed * Math.sin(angle), life: 1, col: cols[Math.floor(Math.random() * cols.length)] });
      }
    }

    function draw() {
      if (exploded) {
        b1x.current += v1r.current * 0.6;
        b2x.current += v2r.current * 0.6;
        particles.current = particles.current.map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, life: p.life - 0.025, vy: p.vy + 0.1 })).filter(p => p.life > 0);
        if (b1x.current < -40 && b2x.current > CW + 40) {
          setTimeout(() => { b1x.current = CW / 2; b2x.current = CW / 2; v1r.current = 0; v2r.current = 0; setExploded(false); }, 2000);
        }
      }

      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, CW, CH);
      grid(ctx, CW, CH);

      const gy = CH * 0.62;
      ctx.fillStyle = "#1e3050"; ctx.fillRect(30, gy - 3, CW - 60, 6);

      /* Particles */
      particles.current.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.col;
        ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;

      const r1 = Math.sqrt(m1) * 9 + 10, r2 = Math.sqrt(m2) * 9 + 10;

      if (!exploded) {
        /* Combined at rest */
        const gr = ctx.createRadialGradient(CW / 2 - 8, gy - 25, 0, CW / 2, gy, 30);
        gr.addColorStop(0, "#818cf8"); gr.addColorStop(1, "#3730a3");
        ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(CW / 2, gy, 30, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = P.purple; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(CW / 2, gy, 30, 0, Math.PI * 2); ctx.stroke();
        txt(ctx, `${m1 + m2}kg`, CW / 2, gy, "#fff", 12, "center", true);
        txt(ctx, "v = 0", CW / 2, gy - 40, P.dim, 11, "center");
      } else {
        /* Piece 1 (left) */
        ctx.fillStyle = P.blueHi; ctx.beginPath(); ctx.arc(b1x.current, gy - r1, r1, 0, Math.PI * 2); ctx.fill();
        txt(ctx, `${m1}kg`, b1x.current, gy - r1, "#fff", 10, "center", true);
        if (b1x.current > 20) {
          arrow(ctx, b1x.current, gy - r1 - r1 - 8, b1x.current + v1r.current * 2, gy - r1 - r1 - 8, P.blueHi, 2.5);
          txt(ctx, `${v1r.current.toFixed(1)}m/s`, b1x.current + v1r.current, gy - r1 - r1 - 20, P.blueHi, 9, "center");
        }

        /* Piece 2 (right) */
        ctx.fillStyle = P.red; ctx.beginPath(); ctx.arc(b2x.current, gy - r2, r2, 0, Math.PI * 2); ctx.fill();
        txt(ctx, `${m2}kg`, b2x.current, gy - r2, "#fff", 10, "center", true);
        if (b2x.current < CW - 20) {
          arrow(ctx, b2x.current, gy - r2 - r2 - 8, b2x.current + v2r.current * 2, gy - r2 - r2 - 8, P.red, 2.5);
          txt(ctx, `${v2r.current.toFixed(1)}m/s`, b2x.current + v2r.current, gy - r2 - r2 - 20, P.red, 9, "center");
        }

        /* p check */
        const p_total = (m1 * v1r.current + m2 * v2r.current).toFixed(2);
        txt(ctx, `p₁+p₂ = ${m1}×(${v1r.current.toFixed(1)}) + ${m2}×${v2r.current.toFixed(1)} = ${p_total}`, CW / 2, CH - 18, P.amber, 10, "center");
      }

      txt(ctx, "Explosion from Rest — Total Momentum = 0", 16, 22, P.blueHi, 13, "left", true);
      txt(ctx, `m₁=${m1}kg  m₂=${m2}kg  |  Before explosion: p = 0`, CW / 2, 22, P.dim, 10, "center");
      if (!exploded) txt(ctx, "Press EXPLODE →", CW / 2, CH * 0.45, P.amber + "88", 13, "center");

      raf.current = requestAnimationFrame(draw);
    }
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [exploded, m1, m2]);

  return (
    <div style={{ background: P.bg, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden", fontFamily: "Inter,system-ui,sans-serif" }}>
      <canvas ref={ref} width={640} height={H} style={{ width: W, height: "auto", display: "block" }} />
      <div style={{ padding: "14px 20px", display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap", background: P.panel, borderTop: `1px solid ${P.border}` }}>
        <button onClick={() => setExploded(e => !e)} style={{ padding: "8px 20px", borderRadius: 8, border: `1px solid ${P.red}`, background: exploded ? P.red + "22" : P.blue + "33", color: P.red, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          💥 EXPLODE!
        </button>
        {[{ label: "Fragment 1 mass (kg)", val: m1, set: setM1, col: P.blueHi, min: 1, max: 10 },
          { label: "Fragment 2 mass (kg)", val: m2, set: setM2, col: P.red, min: 1, max: 10 }]
          .map(({ label, val, set, col, min, max }) => (
            <label key={label} style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: P.dim }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: col }}>{val}</span>
              </div>
              <input type="range" min={min} max={max} value={val}
                onChange={e => { set(+e.target.value); setExploded(false); }}
                style={{ width: "100%", accentColor: col }} />
            </label>
          ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
 * SIMULATION 4 — Newton's Cradle
 * ═══════════════════════════════════════════════════ */
export function Ultra5_NewtonsCradle() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [lifted, setLifted] = useState(1);
  const raf = useRef(0);
  const angles = useRef([0, 0, 0, 0, 0]);
  const angVels = useRef([0, 0, 0, 0, 0]);
  const t = useRef(0);

  const N = 5;
  const R = 18;
  const L = 100;

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CW = c.width, CH = c.height;

    /* Initialize: lift 'lifted' balls on the left */
    angles.current = Array(N).fill(0);
    angVels.current = Array(N).fill(0);
    for (let i = 0; i < lifted; i++) angles.current[i] = -Math.PI / 4;

    function draw() {
      t.current += 0.016;
      /* Simple pendulum physics */
      const g = 9.8;
      for (let i = 0; i < N; i++) {
        angVels.current[i] += (-g / L) * angles.current[i] * 0.5;
        angVels.current[i] *= 0.998;
        angles.current[i] += angVels.current[i] * 0.5;
      }

      /* Collision transfer: left balls hit right, right hit left */
      /* Detect collision at center (angle ≈ 0 with velocity) */
      for (let i = 0; i < N - 1; i++) {
        const xi = Math.sin(angles.current[i]) * L;
        const xi1 = Math.sin(angles.current[i + 1]) * L;
        if (xi >= xi1 && angVels.current[i] > 0.01 && Math.abs(angles.current[i + 1]) < 0.05) {
          /* Transfer velocity */
          const v = angVels.current[i];
          angVels.current[i] = 0; angles.current[i] = 0;
          angVels.current[i + 1] = v;
          if (i + 1 === N - 1) angVels.current[i + 1] = v;
        }
      }
      for (let i = N - 1; i > 0; i--) {
        const xi = Math.sin(angles.current[i]) * L;
        const xi1 = Math.sin(angles.current[i - 1]) * L;
        if (xi <= xi1 && angVels.current[i] < -0.01 && Math.abs(angles.current[i - 1]) < 0.05) {
          const v = angVels.current[i];
          angVels.current[i] = 0; angles.current[i] = 0;
          angVels.current[i - 1] = v;
        }
      }

      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, CW, CH);
      grid(ctx, CW, CH);

      /* Frame */
      const frameX = CW / 2 - N * 22, frameY = 40, frameW = N * 44, frameH = 10;
      ctx.fillStyle = "#374151"; rr(ctx, frameX - 10, frameY, frameW + 20, frameH, 4); ctx.fill();
      ctx.fillStyle = "#4b5563"; ctx.fillRect(frameX, frameY, 4, 20); ctx.fillRect(frameX + frameW, frameY, 4, 20);

      /* Balls */
      for (let i = 0; i < N; i++) {
        const pivX = frameX + i * 44 + 22;
        const ang = angles.current[i];
        const bx = pivX + Math.sin(ang) * L;
        const by = frameY + frameH + Math.cos(ang) * L;

        /* String */
        ctx.strokeStyle = "#6b7280"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(pivX, frameY + frameH); ctx.lineTo(bx, by); ctx.stroke();

        /* Ball with gradient */
        const gl = ctx.createRadialGradient(bx - 5, by - 5, 0, bx, by, R);
        gl.addColorStop(0, "#60a5fa"); gl.addColorStop(1, "#1d4ed8");
        ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(bx, by, R, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = P.blueHi; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(bx, by, R, 0, Math.PI * 2); ctx.stroke();

        /* Speed indicator */
        if (Math.abs(angVels.current[i]) > 0.05) {
          const spd = Math.abs(angVels.current[i] * L).toFixed(0);
          txt(ctx, `${spd}`, bx, by + R + 12, P.amber, 8, "center");
        }
      }

      /* Momentum label */
      const totalP = angles.current.reduce((sum, a, i) => sum + angVels.current[i] * L, 0);
      txt(ctx, "Newton's Cradle — Momentum & Energy Transfer", 16, 22, P.blueHi, 13, "left", true);
      txt(ctx, `${lifted} ball(s) lifted  |  Momentum transfers through chain!`, CW / 2, CH - 18, P.amber, 10, "center");

      raf.current = requestAnimationFrame(draw);
    }
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [lifted]);

  return (
    <div style={{ background: P.bg, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden", fontFamily: "Inter,system-ui,sans-serif" }}>
      <canvas ref={ref} width={640} height={H} style={{ width: W, height: "auto", display: "block" }} />
      <div style={{ padding: "14px 20px", display: "flex", gap: 10, background: P.panel, borderTop: `1px solid ${P.border}` }}>
        <span style={{ fontSize: 11, color: P.dim, display: "flex", alignItems: "center" }}>Balls to lift:</span>
        {[1, 2, 3].map(n => (
          <button key={n} onClick={() => setLifted(n)}
            style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: `1px solid ${lifted === n ? P.blueHi : P.border}`, background: lifted === n ? P.blue + "44" : "transparent", color: lifted === n ? P.blueHi : P.dim, fontSize: 13, fontWeight: lifted === n ? 700 : 400, cursor: "pointer" }}>
            {n} Ball{n > 1 ? "s" : ""}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
 * SIMULATION 5 — Rocket Momentum Conservation
 * ═══════════════════════════════════════════════════ */
export function Ultra5_RocketMomentum() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [exMass, setExMass] = useState(5);
  const [exVel, setExVel] = useState(100);
  const raf = useRef(0);
  const rocketX = useRef(320);
  const rocketVel = useRef(0);
  const gasX = useRef(320);
  const gasVel = useRef(0);
  const fired = useRef(false);
  const t = useRef(0);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CW = c.width, CH = c.height;
    rocketX.current = CW / 2; rocketVel.current = 0; gasX.current = CW / 2; gasVel.current = 0; fired.current = false; t.current = 0;

    const rocketMass = 50;

    function draw() {
      t.current += 0.016;
      if (fired.current) {
        rocketX.current += rocketVel.current * 0.3;
        gasX.current += gasVel.current * 0.3;
        if (rocketX.current > CW + 80 || gasX.current < -80) {
          rocketX.current = CW / 2; gasX.current = CW / 2; rocketVel.current = 0; gasVel.current = 0; fired.current = false; t.current = 0;
        }
      }

      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, CW, CH);
      grid(ctx, CW, CH);

      const gy = CH * 0.55;

      if (!fired.current) {
        /* Rocket + fuel at rest */
        ctx.fillStyle = P.purple + "cc";
        rr(ctx, rocketX.current - 40, gy - 28, 80, 56, 8); ctx.fill();
        ctx.strokeStyle = P.purple; ctx.lineWidth = 2;
        rr(ctx, rocketX.current - 40, gy - 28, 80, 56, 8); ctx.stroke();
        txt(ctx, `${rocketMass + exMass}kg`, rocketX.current, gy, "#fff", 12, "center", true);
        txt(ctx, "v = 0 (at rest)", rocketX.current, gy - 45, P.dim, 11, "center");
        txt(ctx, "p_total = 0", CW / 2, gy + 50, P.dim, 11, "center");
        txt(ctx, "Press FIRE →", CW / 2, CH - 18, P.amber + "99", 12, "center");
      } else {
        /* Rocket */
        ctx.fillStyle = P.blue;
        rr(ctx, rocketX.current - 20, gy - 22, 40, 44, 6); ctx.fill();
        ctx.strokeStyle = P.blueHi; ctx.lineWidth = 1.5;
        rr(ctx, rocketX.current - 20, gy - 22, 40, 44, 6); ctx.stroke();
        /* Nose */
        ctx.fillStyle = P.red;
        ctx.beginPath(); ctx.moveTo(rocketX.current - 14, gy - 22); ctx.lineTo(rocketX.current, gy - 40); ctx.lineTo(rocketX.current + 14, gy - 22); ctx.closePath(); ctx.fill();
        txt(ctx, `${rocketMass}kg`, rocketX.current, gy, "#fff", 9, "center", true);

        if (rocketX.current < CW) {
          arrow(ctx, rocketX.current + 22, gy, rocketX.current + 22 + rocketVel.current * 3, gy, P.green, 2.5);
          txt(ctx, `v=${rocketVel.current.toFixed(1)}m/s`, rocketX.current + 50, gy - 14, P.green, 10, "center");
        }

        /* Gas cloud */
        if (gasX.current > -60) {
          ctx.fillStyle = P.amber + "44";
          ctx.beginPath(); ctx.arc(gasX.current, gy, 22, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = P.amber; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(gasX.current, gy, 22, 0, Math.PI * 2); ctx.stroke();
          txt(ctx, `${exMass}kg`, gasX.current, gy, P.amber, 9, "center");
          arrow(ctx, gasX.current - 24, gy, gasX.current - 24 + gasVel.current * 3, gy, P.amber, 2);
          txt(ctx, `v=${gasVel.current.toFixed(1)}`, gasX.current - 60, gy - 14, P.amber, 9, "center");
        }

        /* Momentum check */
        const pRocket = rocketMass * rocketVel.current;
        const pGas = exMass * gasVel.current;
        txt(ctx, `p_rocket=${pRocket.toFixed(1)}  p_gas=${pGas.toFixed(1)}  total=${(pRocket + pGas).toFixed(1)} ≈ 0`, CW / 2, CH - 18, P.amber, 10, "center");
      }

      txt(ctx, "Rocket & Gas — Momentum Conservation", 16, 22, P.blueHi, 13, "left", true);
      txt(ctx, `Gas ejected: ${exMass}kg at ${exVel}m/s  |  Rocket: ${50}kg gets ${(exMass * exVel / 50).toFixed(2)} m/s forward`, CW / 2, 22, P.dim, 9, "center");

      raf.current = requestAnimationFrame(draw);
    }
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [exMass, exVel, fired.current]);

  return (
    <div style={{ background: P.bg, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden", fontFamily: "Inter,system-ui,sans-serif" }}>
      <canvas ref={ref} width={640} height={H} style={{ width: W, height: "auto", display: "block" }} />
      <div style={{ padding: "14px 20px", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", background: P.panel, borderTop: `1px solid ${P.border}` }}>
        <button onClick={() => { fired.current = true; const rocketMass = 50; const rv = (exMass * exVel) / rocketMass; rocketX.current = 320; gasX.current = 320; rocketX.current = 320; rocketVel.current = rv; gasVel.current = -exVel; }}
          style={{ padding: "8px 20px", borderRadius: 8, border: `1px solid ${P.blueHi}`, background: P.blue + "33", color: P.blueHi, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          🚀 FIRE!
        </button>
        {[{ label: "Gas mass ejected (kg)", val: exMass, set: setExMass, col: P.amber, min: 1, max: 20 },
          { label: "Gas exhaust velocity (m/s)", val: exVel, set: setExVel, col: P.green, min: 20, max: 300, step: 10 }]
          .map(({ label, val, set, col, min, max, step = 1 }) => (
            <label key={label} style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: P.dim }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: col }}>{val}</span>
              </div>
              <input type="range" min={min} max={max} step={step} value={val}
                onChange={e => { set(+e.target.value); fired.current = false; }}
                style={{ width: "100%", accentColor: col }} />
            </label>
          ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
 * SIMULATION 6 — Live Momentum Conservation Graph
 * Compare before/after momentum as mass/velocity changes
 * ═══════════════════════════════════════════════════ */
export function Ultra5_MomentumGraphLive() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [m1, setM1] = useState(4);
  const [m2, setM2] = useState(6);
  const [v1i, setV1i] = useState(30);
  const [v2i, setV2i] = useState(-10);
  const raf = useRef(0);
  const t = useRef(0);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const CW = c.width, CH = c.height;

    /* Elastic collision final velocities */
    const v1f = ((m1 - m2) * v1i + 2 * m2 * v2i) / (m1 + m2);
    const v2f = (2 * m1 * v1i + (m2 - m1) * v2i) / (m1 + m2);
    const pBefore1 = m1 * v1i, pBefore2 = m2 * v2i;
    const pAfter1 = m1 * v1f, pAfter2 = m2 * v2f;
    const pTotalBefore = pBefore1 + pBefore2;
    const pTotalAfter = pAfter1 + pAfter2;

    function draw() {
      t.current += 0.025;

      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, CW, CH);
      grid(ctx, CW, CH);

      const gx = 60, gy = 30, gw = (CW - 80) / 2 - 20, gh = CH - 80;

      /* Left chart: BEFORE */
      ctx.fillStyle = P.panel; rr(ctx, gx, gy, gw, gh, 8); ctx.fill();
      ctx.strokeStyle = P.border; ctx.lineWidth = 1; rr(ctx, gx, gy, gw, gh, 8); ctx.stroke();
      txt(ctx, "BEFORE Collision", gx + gw / 2, gy + 18, P.dim, 11, "center", true);

      const maxP = Math.max(20, Math.abs(pBefore1), Math.abs(pBefore2), Math.abs(pTotalBefore)) * 1.2;
      const barArea = gh - 50; const barW = gw / 3 - 12;

      const bars = [
        { label: `p₁=${pBefore1.toFixed(1)}`, val: pBefore1, col: P.blueHi, x: gx + 18 },
        { label: `p₂=${pBefore2.toFixed(1)}`, val: pBefore2, col: P.red, x: gx + 18 + barW + 12 },
        { label: `Total=${pTotalBefore.toFixed(1)}`, val: pTotalBefore, col: P.amber, x: gx + 18 + (barW + 12) * 2 },
      ];
      const zeroY = gy + gh - 25 - barArea / 2;
      ctx.strokeStyle = P.faint; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(gx, zeroY); ctx.lineTo(gx + gw, zeroY); ctx.stroke(); ctx.setLineDash([]);
      txt(ctx, "0", gx - 4, zeroY, P.dim, 9, "right");

      bars.forEach(b => {
        const h = Math.abs(b.val / maxP) * (barArea / 2);
        const anim = Math.sin(t.current * 2) * 0.03 + 1;
        const by = b.val >= 0 ? zeroY - h * anim : zeroY;
        ctx.fillStyle = b.col + "aa";
        rr(ctx, b.x, Math.min(by, zeroY), barW, h * anim, 4); ctx.fill();
        ctx.strokeStyle = b.col; ctx.lineWidth = 1.5;
        rr(ctx, b.x, Math.min(by, zeroY), barW, h * anim, 4); ctx.stroke();
        txt(ctx, b.label, b.x + barW / 2, gy + gh - 12, b.col, 8, "center");
      });

      /* Right chart: AFTER */
      const gx2 = gx + gw + 40;
      ctx.fillStyle = P.panel; rr(ctx, gx2, gy, gw, gh, 8); ctx.fill();
      ctx.strokeStyle = P.border; ctx.lineWidth = 1; rr(ctx, gx2, gy, gw, gh, 8); ctx.stroke();
      txt(ctx, "AFTER Collision", gx2 + gw / 2, gy + 18, P.dim, 11, "center", true);

      const barsAfter = [
        { label: `p₁'=${pAfter1.toFixed(1)}`, val: pAfter1, col: P.blueHi, x: gx2 + 18 },
        { label: `p₂'=${pAfter2.toFixed(1)}`, val: pAfter2, col: P.red, x: gx2 + 18 + barW + 12 },
        { label: `Total=${pTotalAfter.toFixed(1)}`, val: pTotalAfter, col: P.amber, x: gx2 + 18 + (barW + 12) * 2 },
      ];
      const zeroY2 = gy + gh - 25 - barArea / 2;
      ctx.strokeStyle = P.faint; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(gx2, zeroY2); ctx.lineTo(gx2 + gw, zeroY2); ctx.stroke(); ctx.setLineDash([]);

      barsAfter.forEach(b => {
        const h = Math.abs(b.val / maxP) * (barArea / 2);
        const by = b.val >= 0 ? zeroY2 - h : zeroY2;
        ctx.fillStyle = b.col + "aa";
        rr(ctx, b.x, Math.min(by, zeroY2), barW, h, 4); ctx.fill();
        ctx.strokeStyle = b.col; ctx.lineWidth = 1.5;
        rr(ctx, b.x, Math.min(by, zeroY2), barW, h, 4); ctx.stroke();
        txt(ctx, b.label, b.x + barW / 2, gy + gh - 12, b.col, 8, "center");
      });

      /* Conservation check */
      const match = Math.abs(pTotalBefore - pTotalAfter) < 0.1;
      const checkCol = match ? P.green : P.red;
      ctx.fillStyle = checkCol + "22"; rr(ctx, CW / 2 - 100, gy + gh / 2 - 12, 200, 24, 6); ctx.fill();
      txt(ctx, match ? "✓ Momentum Conserved!" : `Δp = ${(pTotalBefore - pTotalAfter).toFixed(1)}`, CW / 2, gy + gh / 2, checkCol, 11, "center", true);

      txt(ctx, "Momentum Conservation — Before vs After", 16, 22, P.blueHi, 13, "left", true);
      txt(ctx, `m₁=${m1}  m₂=${m2}  v₁=${v1i}  v₂=${v2i} m/s  |  Elastic collision`, CW / 2, CH - 18, P.dim, 9, "center");

      raf.current = requestAnimationFrame(draw);
    }
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [m1, m2, v1i, v2i]);

  return (
    <div style={{ background: P.bg, borderRadius: 16, border: `1px solid ${P.border}`, overflow: "hidden", fontFamily: "Inter,system-ui,sans-serif" }}>
      <canvas ref={ref} width={640} height={H} style={{ width: W, height: "auto", display: "block" }} />
      <div style={{ padding: "14px 20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px 16px", background: P.panel, borderTop: `1px solid ${P.border}` }}>
        {[{ label: "m₁ (kg)", val: m1, set: setM1, col: P.blueHi, min: 1, max: 15 },
          { label: "m₂ (kg)", val: m2, set: setM2, col: P.red, min: 1, max: 15 },
          { label: "v₁ (m/s)", val: v1i, set: setV1i, col: P.green, min: -50, max: 80 },
          { label: "v₂ (m/s)", val: v2i, set: setV2i, col: P.amber, min: -50, max: 80 }]
          .map(({ label, val, set, col, min, max }) => (
            <label key={label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: P.dim }}>{label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: col }}>{val}</span>
              </div>
              <input type="range" min={min} max={max} value={val}
                onChange={e => set(+e.target.value)} style={{ width: "100%", accentColor: col }} />
            </label>
          ))}
      </div>
    </div>
  );
}
