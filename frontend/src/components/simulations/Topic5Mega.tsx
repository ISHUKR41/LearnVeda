/**
 * FILE: Topic5Mega.tsx
 * PURPOSE: 15 professional physics simulations for Topic 5 —
 *          Law of Conservation of Momentum — Class 9 CBSE.
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

/* ─── 1. Two Carts Spring Release ─────────────── */
export function Sim_two_carts_spring() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [m1, setM1] = useState(2); const [m2, setM2] = useState(4);
  const [released, setReleased] = useState(false);
  const stRef = useRef({ x1: 200, x2: 370, v1: 0, v2: 0 });
  useEffect(() => {
    stRef.current = { x1: 200, x2: 370, v1: 0, v2: 0 };
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const totalP = 0; /* system starts at rest */
    const v1_final = -m2 * 3 / m1; /* by conservation, if v2=3 then v1= -m2*3/m1 */
    const v2_final = 3;
    function loop() {
      if (released) {
        stRef.current.v1 += (v1_final - stRef.current.v1) * 0.02;
        stRef.current.v2 += (v2_final - stRef.current.v2) * 0.02;
      }
      stRef.current.x1 += stRef.current.v1 * 0.4;
      stRef.current.x2 += stRef.current.v2 * 0.4;
      if (stRef.current.x1 < -50 || stRef.current.x2 > c.width + 50) {
        stRef.current = { x1: 200, x2: 370, v1: 0, v2: 0 }; setReleased(false);
      }
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#1F2937"; ctx.fillRect(0, 210, c.width, 20);
      if (!released) {
        /* spring */
        ctx.strokeStyle = "#60A5FA"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(stRef.current.x1 + 50, 185);
        for (let i = 0; i <= 6; i++) ctx.lineTo(stRef.current.x1 + 50 + i * 20, 185 + (i % 2 === 0 ? 0 : 12));
        ctx.stroke();
      }
      /* carts */
      [{ s: stRef.current.x1, m: m1, c: BLUE }, { s: stRef.current.x2, m: m2, c: RED }].forEach(({ s, m, c: col }, i) => {
        ctx.fillStyle = col + "33"; ctx.strokeStyle = col; ctx.lineWidth = 2;
        ctx.fillRect(s, 172, 50, 38); ctx.strokeRect(s, 172, 50, 38);
        [s + 12, s + 38].forEach(wx => {
          ctx.fillStyle = "#0F172A"; ctx.strokeStyle = col; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(wx, 210, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        });
        txt(ctx, `${m}kg`, s + 10, 196, WHITE, 12);
        const v = i === 0 ? stRef.current.v1 : stRef.current.v2;
        if (Math.abs(v) > 0.2) arr(ctx, s + 25, 162, s + 25 + v * 12, 162, col, `${v.toFixed(1)}m/s`);
      });
      const pTotal = m1 * stRef.current.v1 + m2 * stRef.current.v2;
      txt(ctx, released ? `p_total = m₁v₁ + m₂v₂ = ${pTotal.toFixed(2)} kg·m/s (conserved at 0)` : "Spring compressed — both carts at rest. Press Release!", 10, 30, GREEN, 13);
      txt(ctx, `m₁v₁_final = ${m1}×${(stRef.current.v1).toFixed(1)} = ${(m1 * stRef.current.v1).toFixed(1)}`, 10, 52, BLUE, 12);
      txt(ctx, `m₂v₂_final = ${m2}×${(stRef.current.v2).toFixed(1)} = ${(m2 * stRef.current.v2).toFixed(1)}`, 10, 72, RED, 12);
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
        <button onClick={() => { stRef.current = { x1: 200, x2: 370, v1: 0, v2: 0 }; setReleased(false); }}>Reset</button>
        <label>m₁: {m1}kg<input type="range" min={1} max={8} value={m1} onChange={e => setM1(+e.target.value)} /></label>
        <label>m₂: {m2}kg<input type="range" min={1} max={8} value={m2} onChange={e => setM2(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 2. Sand Falling on Moving Cart ──────────── */
export function Sim_sand_cart() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [sandRate, setSandRate] = useState(3);
  const stRef = useRef({ x: 80, v: 5, m: 5, sand: [] as { x: number, y: number, vy: number }[] });
  useEffect(() => {
    stRef.current = { x: 80, v: 5, m: 5, sand: [] };
    const c = ref.current!; const ctx = c.getContext("2d")!;
    let frame = 0;
    function loop() {
      frame++;
      const s = stRef.current;
      /* add sand grain */
      if (frame % Math.max(1, 10 - sandRate) === 0) {
        s.sand.push({ x: 290 + (Math.random() - 0.5) * 30, y: 10, vy: 2 });
      }
      /* update sand grains */
      s.sand = s.sand.filter(g => g.y < 230);
      s.sand.forEach(g => { g.y += g.vy; });
      /* sand hitting cart */
      s.sand = s.sand.filter(g => {
        if (g.y >= 165 && g.x >= s.x && g.x <= s.x + 100) {
          /* momentum conservation: (m*v) = (m + dm)*v_new */
          const dm = 0.1;
          s.v = (s.m * s.v) / (s.m + dm);
          s.m += dm;
          return false;
        }
        return true;
      });
      s.x += s.v * 0.3; s.v *= 0.999;
      if (s.x > c.width - 110) { s.x = 80; s.v = 5; s.m = 5; s.sand = []; }
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#1F2937"; ctx.fillRect(0, 210, c.width, 30);
      /* sand grain source */
      ctx.fillStyle = "#D97706"; ctx.strokeStyle = AMBER; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect(260, 0, 60, 20, 4); ctx.fill(); ctx.stroke();
      txt(ctx, "sand", 268, 14, WHITE, 10);
      /* falling grains */
      s.sand.forEach(g => { ctx.fillStyle = AMBER; ctx.fillRect(g.x - 2, g.y - 2, 4, 4); });
      /* cart */
      ctx.fillStyle = "#1E3A5F"; ctx.strokeStyle = BLUE; ctx.lineWidth = 2;
      ctx.fillRect(s.x, 160, 100, 50); ctx.strokeRect(s.x, 160, 100, 50);
      [s.x + 18, s.x + 82].forEach(wx => {
        ctx.fillStyle = "#0F172A"; ctx.strokeStyle = GRAY; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(wx, 210, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      });
      txt(ctx, `${s.m.toFixed(1)}kg`, s.x + 25, 190, WHITE, 12);
      arr(ctx, s.x + 50, 155, s.x + 50 + s.v * 10, 155, GREEN, `v=${s.v.toFixed(2)}m/s`);
      txt(ctx, `p = m×v = ${s.m.toFixed(1)}×${s.v.toFixed(2)} = ${(s.m * s.v).toFixed(2)} kg·m/s`, 10, 30, WHITE, 13);
      txt(ctx, "Sand has v=0 horizontally → adding it SLOWS the cart (p conserved)!", 10, 52, AMBER, 12);
      txt(ctx, "Total momentum of (cart + sand) system is CONSERVED", 10, 74, GREEN, 12);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [sandRate]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={260} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Sand rate: {sandRate}<input type="range" min={1} max={8} value={sandRate} onChange={e => setSandRate(+e.target.value)} /></label>
        <button onClick={() => { stRef.current = { x: 80, v: 5, m: 5, sand: [] }; }}>Reset</button>
      </div>
    </div>
  );
}

/* ─── 3. Bomb Explosion (3 Fragments) ──────────── */
export function Sim_bomb_3fragments() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [m1, setM1] = useState(2); const [m2, setM2] = useState(3);
  const [exploded, setExploded] = useState(false);
  const fragsRef = useRef<{ x: number; y: number; vx: number; vy: number; m: number; c: string }[]>([]);
  const flashRef = useRef(0);
  useEffect(() => {
    fragsRef.current = []; flashRef.current = 0;
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const cx = 290; const cy = 180;
    function loop() {
      if (exploded && fragsRef.current.length === 0) {
        const m3 = 5 - m1 - m2 > 0.5 ? 5 - m1 - m2 : 1;
        /* Conservation: sum of all momenta = 0 (bomb was at rest) */
        const v1x = 4, v1y = 0;
        const v2x = -2, v2y = 3;
        const v3x = -(m1 * v1x + m2 * v2x) / m3;
        const v3y = -(m1 * v1y + m2 * v2y) / m3;
        fragsRef.current = [
          { x: cx, y: cy, vx: v1x, vy: v1y, m: m1, c: RED },
          { x: cx, y: cy, vx: v2x, vy: v2y, m: m2, c: BLUE },
          { x: cx, y: cy, vx: v3x, vy: v3y, m: m3, c: GREEN },
        ];
        flashRef.current = 15;
      }
      fragsRef.current = fragsRef.current.map(f => ({ ...f, x: f.x + f.vx * 0.5, y: f.y + f.vy * 0.5 }));
      if (flashRef.current > 0) flashRef.current--;
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      if (flashRef.current > 0) {
        ctx.fillStyle = `rgba(251,191,36,${flashRef.current / 15})`;
        ctx.beginPath(); ctx.arc(cx, cy, flashRef.current * 4, 0, Math.PI * 2); ctx.fill();
      }
      if (!exploded || fragsRef.current.length === 0) {
        /* bomb */
        ctx.fillStyle = "#374151"; ctx.strokeStyle = GRAY; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(cx, cy, 25, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = "#D97706"; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(cx + 15, cy - 22); ctx.bezierCurveTo(cx + 35, cy - 60, cx + 45, cy - 50, cx + 40, cy - 30); ctx.stroke();
        txt(ctx, "BOMB", cx - 18, cy + 6, WHITE, 11);
        txt(ctx, "Bomb at rest. Total momentum = 0", 10, 30, WHITE, 13);
      } else {
        fragsRef.current.forEach(f => {
          ctx.fillStyle = f.c + "33"; ctx.strokeStyle = f.c; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(f.x, f.y, 8 + f.m * 3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          arr(ctx, f.x, f.y, f.x + f.vx * 8, f.y + f.vy * 8, f.c, `${f.m}kg`);
        });
        const px = fragsRef.current.reduce((s, f) => s + f.m * f.vx, 0);
        const py = fragsRef.current.reduce((s, f) => s + f.m * f.vy, 0);
        txt(ctx, `Σp_x = ${px.toFixed(2)} | Σp_y = ${py.toFixed(2)} (should be ≈0)`, 10, 30, GREEN, 13);
        txt(ctx, "Explosion → fragments fly, but total momentum stays 0!", 10, 52, WHITE, 12);
      }
      txt(ctx, "Explosion from rest: Σp_before = 0 = Σp_after (always)", 10, c.height - 10, GRAY, 11);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [m1, m2, exploded]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={310} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <button onClick={() => { fragsRef.current = []; setExploded(true); }}>EXPLODE!</button>
        <button onClick={() => { fragsRef.current = []; setExploded(false); }}>Reset</button>
        <label>Fragment 1 mass: {m1}kg<input type="range" min={0.5} max={2} step={0.5} value={m1} onChange={e => setM1(+e.target.value)} /></label>
        <label>Fragment 2 mass: {m2}kg<input type="range" min={0.5} max={2} step={0.5} value={m2} onChange={e => setM2(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 4. Astronaut Catches Ball in Space ────────── */
export function Sim_astronaut_catch_space() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [ballV, setBallV] = useState(-4);
  const stRef = useRef({ astX: 400, astV: 0, ballX: 100, caught: false });
  useEffect(() => {
    stRef.current = { astX: 400, astV: 0, ballX: 100, caught: false };
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const astMass = 80; const ballMass = 0.5;
    function loop() {
      const s = stRef.current;
      if (!s.caught) { s.ballX += ballV * 0.4; }
      if (Math.abs(s.ballX - s.astX) < 30 && !s.caught) {
        s.caught = true;
        s.astV = (ballMass * ballV * 0.4 * 2.5) / (astMass + ballMass);
      }
      if (s.caught) { s.astX += s.astV; s.ballX = s.astX - 20; }
      if (s.astX < -50 || s.astX > c.width + 50) { stRef.current = { astX: 400, astV: 0, ballX: 100, caught: false }; }
      ctx.clearRect(0, 0, c.width, c.height);
      const grad = ctx.createLinearGradient(0, 0, 0, c.height);
      grad.addColorStop(0, "#000510"); grad.addColorStop(1, "#0c1a3a");
      ctx.fillStyle = grad; ctx.fillRect(0, 0, c.width, c.height);
      /* stars */
      [{ x: 60, y: 30 }, { x: 200, y: 60 }, { x: 450, y: 40 }, { x: 520, y: 100 }].forEach(p => {
        ctx.fillStyle = "rgba(255,255,255,0.8)"; ctx.fillRect(p.x, p.y, 2, 2);
      });
      /* ball */
      if (!s.caught) {
        ctx.fillStyle = "#DC2626"; ctx.strokeStyle = RED; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(s.ballX, 160, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        arr(ctx, s.ballX, 160, s.ballX + ballV * 10, 160, RED, `${Math.abs(ballV).toFixed(0)} m/s →`);
      }
      /* astronaut */
      const ax = s.astX;
      ctx.strokeStyle = WHITE; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(ax, 145, 16, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "#1E3A5F"; ctx.beginPath(); ctx.arc(ax, 145, 16, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = WHITE;
      ctx.beginPath(); ctx.moveTo(ax, 161); ctx.lineTo(ax, 185); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ax, 168); ctx.lineTo(ax - 18, 180); ctx.moveTo(ax, 168); ctx.lineTo(ax + 18, 180); ctx.stroke();
      if (s.caught) {
        /* holding ball */
        ctx.fillStyle = "#DC2626"; ctx.strokeStyle = RED; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(ax - 30, 168, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        arr(ctx, ax, 145, ax + s.astV * 30, 145, GREEN, `v=${s.astV.toFixed(3)} m/s`);
      }
      const p_before = ballMass * ballV; const p_after = (astMass + ballMass) * s.astV;
      txt(ctx, s.caught ? `p_after = (${astMass}+${ballMass})×${s.astV.toFixed(3)} = ${p_after.toFixed(2)} N·s` : `Ball p = ${ballMass}×${ballV} = ${(ballMass * ballV).toFixed(1)} N·s | Astronaut p = 0`, 10, 30, WHITE, 12);
      txt(ctx, s.caught ? `Momentum conserved! Astronaut+ball drift slowly` : "Ball flying towards stationary astronaut in space", 10, 52, s.caught ? GREEN : GRAY, 12);
      txt(ctx, "After catch: total p = ball's p before catch (conserved!)", 10, c.height - 10, GRAY, 11);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [ballV]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={270} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Ball speed: {Math.abs(ballV)} m/s<input type="range" min={1} max={10} value={Math.abs(ballV)} onChange={e => { setBallV(-e.target.valueAsNumber); stRef.current = { astX: 400, astV: 0, ballX: 100, caught: false }; }} /></label>
        <button onClick={() => { stRef.current = { astX: 400, astV: 0, ballX: 100, caught: false }; }}>Reset</button>
      </div>
    </div>
  );
}

/* ─── 5. Elastic vs Inelastic Comparison ────────── */
export function Sim_elastic_inelastic_compare() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [m1, setM1] = useState(3); const [v1, setV1] = useState(4);
  const [running, setRunning] = useState(false);
  const stRef = useRef({
    elastic: { x1: 60, x2: 300, v1: 4, v2: 0 },
    inelastic: { x1: 60, x2: 300, v1: 4, v2: 0, stuck: false }
  });
  useEffect(() => {
    stRef.current = {
      elastic: { x1: 60, x2: 300, v1, v2: 0 },
      inelastic: { x1: 60, x2: 300, v1, v2: 0, stuck: false }
    };
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const m2 = 2;
    /* Elastic: v1_f = (m1-m2)v1/(m1+m2), v2_f = 2m1*v1/(m1+m2) */
    const v1f_el = ((m1 - m2) * v1) / (m1 + m2);
    const v2f_el = (2 * m1 * v1) / (m1 + m2);
    /* Inelastic: v_f = m1*v1/(m1+m2) */
    const vf_in = (m1 * v1) / (m1 + m2);
    function loop() {
      if (running) {
        const el = stRef.current.elastic;
        const ine = stRef.current.inelastic;
        /* elastic */
        el.x1 += el.v1 * 0.4; el.x2 += el.v2 * 0.4;
        if (el.x1 >= el.x2 - 25 && el.v1 > 0) { el.v1 = v1f_el; el.v2 = v2f_el; }
        /* inelastic */
        if (!ine.stuck) {
          ine.x1 += ine.v1 * 0.4;
          if (ine.x1 >= ine.x2 - 25) { ine.stuck = true; ine.v1 = vf_in; }
        } else { ine.x1 += ine.v1 * 0.4; ine.x2 = ine.x1 + 25; }
        if (el.x2 > c.width + 20 || ine.x1 > c.width + 20) { stRef.current = { elastic: { x1: 60, x2: 300, v1, v2: 0 }, inelastic: { x1: 60, x2: 300, v1, v2: 0, stuck: false } }; setRunning(false); }
      }
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      /* tracks */
      ["ELASTIC (bounces)", "INELASTIC (sticks)"].forEach((lab, row) => {
        const y = 90 + row * 130;
        ctx.fillStyle = "#0F172A"; ctx.fillRect(0, y - 15, c.width, 80);
        txt(ctx, lab, 10, y - 3, row === 0 ? GREEN : AMBER, 11);
      });
      /* elastic balls */
      const el = stRef.current.elastic;
      [{ x: el.x1, v: el.v1 }, { x: el.x2, v: el.v2 }].forEach(({ x, v }, i) => {
        ctx.fillStyle = i === 0 ? BLUE + "33" : RED + "33"; ctx.strokeStyle = i === 0 ? BLUE : RED; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x, 120, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        txt(ctx, `${i === 0 ? m1 : m2}kg`, x - 12, 124, WHITE, 10);
        if (Math.abs(v) > 0.1) arr(ctx, x + (v > 0 ? 18 : -18), 120, x + (v > 0 ? 48 : -48), 120, i === 0 ? BLUE : RED, `${v.toFixed(1)}`);
      });
      const p_el = m1 * el.v1 + m2 * el.v2;
      txt(ctx, `p = ${p_el.toFixed(1)} kg·m/s`, c.width - 120, 125, GREEN, 10);
      /* inelastic */
      const ine = stRef.current.inelastic;
      ctx.fillStyle = PURPLE + "33"; ctx.strokeStyle = PURPLE; ctx.lineWidth = 2;
      if (!ine.stuck) {
        ctx.beginPath(); ctx.arc(ine.x1, 250, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        txt(ctx, `${m1}kg`, ine.x1 - 12, 254, WHITE, 10);
        ctx.fillStyle = AMBER + "33"; ctx.strokeStyle = AMBER;
        ctx.beginPath(); ctx.arc(ine.x2, 250, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        txt(ctx, `${m2}kg`, ine.x2 - 12, 254, WHITE, 10);
        if (ine.v1 > 0.1) arr(ctx, ine.x1 + 18, 250, ine.x1 + 48, 250, PURPLE, `${ine.v1.toFixed(1)}`);
      } else {
        ctx.beginPath(); ctx.arc(ine.x1 + 20, 250, 28, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        txt(ctx, `${m1 + m2}kg`, ine.x1 + 5, 254, WHITE, 10);
        if (Math.abs(ine.v1) > 0.05) arr(ctx, ine.x1 + 48, 250, ine.x1 + 80, 250, PURPLE, `${ine.v1.toFixed(2)}`);
      }
      const p_in = m1 * ine.v1 + m2 * (ine.stuck ? 0 : 0);
      txt(ctx, `p = ${(m1 * v1).toFixed(1)} kg·m/s`, c.width - 120, 255, GREEN, 10);
      txt(ctx, `Before: p = m₁v₁ = ${m1}×${v1} = ${m1 * v1} kg·m/s (both)`, 10, 30, WHITE, 13);
      txt(ctx, `Elastic: KE conserved | Inelastic: KE lost (but p conserved!)`, 10, c.height - 10, GRAY, 11);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [m1, v1, running]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={300} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <button onClick={() => { stRef.current = { elastic: { x1: 60, x2: 300, v1, v2: 0 }, inelastic: { x1: 60, x2: 300, v1, v2: 0, stuck: false } }; setRunning(true); }}>Launch!</button>
        <label>m₁: {m1}kg<input type="range" min={1} max={8} value={m1} onChange={e => setM1(+e.target.value)} /></label>
        <label>v₁: {v1}m/s<input type="range" min={1} max={8} value={v1} onChange={e => setV1(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 6. Head-on Car Collision ───────────────────── */
export function Sim_head_on_collision() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [m1, setM1] = useState(1000); const [v1, setV1] = useState(15); const [m2, setM2] = useState(800); const [v2, setV2] = useState(10);
  const [running, setRunning] = useState(false);
  const stRef = useRef({ x1: 60, x2: 480, v1: 15, v2: -10, collided: false });
  useEffect(() => {
    stRef.current = { x1: 60, x2: 480, v1, v2: -v2, collided: false };
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const vf = (m1 * v1 + m2 * (-v2)) / (m1 + m2);
    function loop() {
      if (running) {
        const s = stRef.current;
        if (!s.collided) {
          s.x1 += s.v1 * 0.3; s.x2 += s.v2 * 0.3;
          if (s.x1 >= s.x2 - 100) { s.collided = true; s.v1 = vf * 0.6; s.v2 = vf * 0.6; }
        } else { s.x1 += s.v1 * 0.3; s.x2 = s.x1 + 100; }
      }
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#1F2937"; ctx.fillRect(0, 195, c.width, 40);
      ctx.strokeStyle = "#FCD34D"; ctx.lineWidth = 2; ctx.setLineDash([15, 10]);
      ctx.beginPath(); ctx.moveTo(0, 215); ctx.lineTo(c.width, 215); ctx.stroke(); ctx.setLineDash([]);
      const s = stRef.current;
      /* car 1 */
      ctx.fillStyle = "#1E3A5F"; ctx.strokeStyle = BLUE; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(s.x1, 155, 100, 40, [6, 6, 0, 0]); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "rgba(147,197,253,0.3)"; ctx.strokeStyle = "#60A5FA"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(s.x1 + 58, 160, 30, 22, 3); ctx.fill(); ctx.stroke();
      [s.x1 + 15, s.x1 + 80].forEach(wx => {
        ctx.fillStyle = "#0F172A"; ctx.strokeStyle = GRAY; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(wx, 195, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      });
      /* car 2 */
      ctx.fillStyle = "#7F1D1D"; ctx.strokeStyle = RED; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(s.x2, 155, 100, 40, [6, 6, 0, 0]); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "rgba(252,165,165,0.3)"; ctx.strokeStyle = "#FCA5A5"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(s.x2 + 12, 160, 30, 22, 3); ctx.fill(); ctx.stroke();
      [s.x2 + 15, s.x2 + 80].forEach(wx => {
        ctx.fillStyle = "#0F172A"; ctx.strokeStyle = GRAY; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(wx, 195, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      });
      /* crash effect */
      if (s.collided && Math.abs(s.v1) < 2) {
        ctx.fillStyle = "rgba(251,191,36,0.3)"; ctx.beginPath(); ctx.arc(s.x1 + 50, 175, 30, 0, Math.PI * 2); ctx.fill();
      }
      /* velocity arrows */
      if (!s.collided) {
        arr(ctx, s.x1 + 50, 148, s.x1 + 50 + v1 * 4, 148, BLUE, `+${v1}m/s`);
        arr(ctx, s.x2 + 50, 148, s.x2 + 50 - v2 * 4, 148, RED, `-${v2}m/s`);
      } else {
        arr(ctx, s.x1 + 50, 148, s.x1 + 50 + s.v1 * 30, 148, PURPLE, `v_f=${vf.toFixed(1)}`);
      }
      const p_before = m1 * v1 + m2 * (-v2);
      const p_after = (m1 + m2) * vf;
      txt(ctx, `p_before = ${m1}×${v1} + ${m2}×(−${v2}) = ${p_before.toFixed(0)} kg·m/s`, 10, 30, WHITE, 12);
      txt(ctx, s.collided ? `p_after = ${(m1 + m2)}×${vf.toFixed(1)} = ${p_after.toFixed(0)} kg·m/s ✓` : `v_f = (${m1}×${v1}+${m2}×(−${v2}))/(${m1}+${m2}) = ${vf.toFixed(2)} m/s`, 10, 52, GREEN, 12);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [m1, v1, m2, v2, running]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={250} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <button onClick={() => { stRef.current = { x1: 60, x2: 480, v1, v2: -v2, collided: false }; setRunning(true); }}>Collide!</button>
        <label>m₁: {m1}kg<input type="range" min={500} max={2000} step={100} value={m1} onChange={e => setM1(+e.target.value)} /></label>
        <label>v₁: {v1}m/s<input type="range" min={5} max={30} value={v1} onChange={e => setV1(+e.target.value)} /></label>
        <label>m₂: {m2}kg<input type="range" min={500} max={2000} step={100} value={m2} onChange={e => setM2(+e.target.value)} /></label>
        <label>v₂: {v2}m/s<input type="range" min={5} max={30} value={v2} onChange={e => setV2(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 7. Pendulum Momentum Transfer ─────────────── */
export function Sim_pendulum_momentum_transfer() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [n, setN] = useState(3);
  const stateRef = useRef({ angle: 0.7, omega: 0, rightBalls: 0 });
  useEffect(() => {
    stateRef.current = { angle: 0.7, omega: 0, rightBalls: 0 };
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const L = 100; const pivX = 290; const pivY = 60; const ballR = 18; const ballSpacing = 38;
    function loop() {
      const s = stateRef.current;
      s.omega += (-9.8 / L) * Math.sin(s.angle) * 0.02;
      s.omega *= 0.999;
      s.angle += s.omega;
      /* detect swing hitting stationary balls */
      if (s.angle < -0.05 && s.omega < 0) s.rightBalls = n;
      if (s.angle > 0.05 && s.omega > 0) s.rightBalls = 0;
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#1F2937"; ctx.fillRect(0, 0, c.width, 25);
      /* stationary hanging balls */
      const centerX = pivX;
      for (let i = 0; i < n; i++) {
        const bx = centerX - Math.floor(n / 2) * ballSpacing + i * ballSpacing;
        ctx.strokeStyle = "#D4D4D8"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(bx, 25); ctx.lineTo(bx, pivY + L); ctx.stroke();
        ctx.fillStyle = "#94A3B8"; ctx.strokeStyle = GRAY; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(bx, pivY + L, ballR, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
      /* swinging ball (left) */
      const swingX = pivX - 120 + Math.sin(s.angle) * 110;
      const swingY = pivY + 25 + Math.cos(s.angle) * L;
      ctx.strokeStyle = "#D4D4D8"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(pivX - 120, 25); ctx.lineTo(swingX, swingY); ctx.stroke();
      ctx.fillStyle = BLUE; ctx.strokeStyle = "#60A5FA"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(swingX, swingY, ballR, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      /* right swinging ball (after collision) */
      if (s.rightBalls > 0) {
        const rxBase = centerX + Math.floor(n / 2) * ballSpacing + ballSpacing;
        const ra = -s.angle;
        const rx = rxBase + Math.sin(ra) * 100; const ry = pivY + 25 + Math.cos(ra) * L;
        ctx.strokeStyle = "#D4D4D8"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(rxBase, 25); ctx.lineTo(rx, ry); ctx.stroke();
        ctx.fillStyle = RED; ctx.strokeStyle = "#FCA5A5"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(rx, ry, ballR, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
      txt(ctx, `Newton's Cradle — ${n} balls | Momentum transfers perfectly!`, 10, 40, WHITE, 13);
      txt(ctx, "1 ball in → 1 ball out | 2 balls in → 2 balls out", 10, 60, GREEN, 12);
      txt(ctx, "Both momentum AND kinetic energy are conserved (elastic collision)", 10, c.height - 10, GRAY, 11);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [n]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={300} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Number of balls: {n}<input type="range" min={2} max={5} value={n} onChange={e => { setN(+e.target.value); stateRef.current = { angle: 0.7, omega: 0, rightBalls: 0 }; }} /></label>
        <button onClick={() => { stateRef.current = { angle: 0.7, omega: 0, rightBalls: 0 }; }}>Release</button>
      </div>
    </div>
  );
}

/* ─── 8. Recoil Cannon (p conserved) ─────────────── */
export function Sim_recoil_momentum_calc() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [m_cannon, setMcannon] = useState(500); const [m_ball2, setMball2] = useState(5); const [v_ball, setVball] = useState(200);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
    const v_cannon = -(m_ball2 * v_ball) / m_cannon;
    /* diagram */
    const cy = 160;
    /* cannon */
    ctx.fillStyle = "#374151"; ctx.strokeStyle = GRAY; ctx.lineWidth = 2;
    ctx.fillRect(200, cy - 30, 120, 60); ctx.strokeRect(200, cy - 30, 120, 60);
    ctx.fillRect(320, cy - 10, 60, 20); ctx.strokeRect(320, cy - 10, 60, 20);
    [220, 300].forEach(wx => {
      ctx.fillStyle = "#0F172A"; ctx.strokeStyle = GRAY; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(wx, cy + 30, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    });
    /* ball flying */
    ctx.fillStyle = "#1E40AF"; ctx.strokeStyle = BLUE; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(430, cy, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    arr(ctx, 380, cy, 520, cy, GREEN, `v_ball=${v_ball} m/s →`);
    arr(ctx, 200, cy, 120, cy, RED, `← v_cannon=${Math.abs(v_cannon).toFixed(2)} m/s`);
    /* calculation box */
    ctx.fillStyle = "rgba(15,23,42,0.9)"; ctx.strokeStyle = GRAY; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(10, 10, 380, 130, 8); ctx.fill(); ctx.stroke();
    txt(ctx, "Conservation of Momentum:", 20, 30, WHITE, 12);
    txt(ctx, "p_before firing = 0 (both at rest)", 20, 50, GRAY, 11);
    txt(ctx, "p_after = m_cannon × v_cannon + m_ball × v_ball", 20, 68, WHITE, 11);
    txt(ctx, `0 = ${m_cannon} × v_c + ${m_ball2} × ${v_ball}`, 20, 86, AMBER, 12);
    txt(ctx, `v_cannon = −(${m_ball2} × ${v_ball}) / ${m_cannon} = ${v_cannon.toFixed(3)} m/s`, 20, 106, GREEN, 12);
    txt(ctx, `Cannon recoils at ${Math.abs(v_cannon).toFixed(3)} m/s (opposite direction)`, 20, 126, GREEN, 11);
    txt(ctx, "Momentum Recoil — Law of Conservation", 10, c.height - 10, GRAY, 11);
  }, [m_cannon, m_ball2, v_ball]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={260} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Cannon: {m_cannon}kg<input type="range" min={100} max={2000} step={100} value={m_cannon} onChange={e => setMcannon(+e.target.value)} /></label>
        <label>Ball: {m_ball2}kg<input type="range" min={1} max={20} value={m_ball2} onChange={e => setMball2(+e.target.value)} /></label>
        <label>Ball speed: {v_ball}m/s<input type="range" min={50} max={400} step={50} value={v_ball} onChange={e => setVball(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 9. Kayak Push-Off Dock ─────────────────────── */
export function Sim_kayak_pushoff() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [m_person, setMperson] = useState(70); const [push, setPush] = useState(false);
  const stRef = useRef({ kayakX: 200, kayakV: 0, personX: 200, personV: 0 });
  useEffect(() => {
    stRef.current = { kayakX: 200, kayakV: 0, personX: 200, personV: 0 };
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const kayakM = 15; const pushForce = m_person * 0.5;
    function loop() {
      if (push) {
        stRef.current.kayakV -= (pushForce / kayakM) * 0.01;
        stRef.current.personV += (pushForce / m_person) * 0.01;
        stRef.current.personV *= 0.99;
      }
      stRef.current.kayakX += stRef.current.kayakV * 0.4;
      stRef.current.personX += stRef.current.personV * 0.4;
      const p = kayakM * stRef.current.kayakV + m_person * stRef.current.personV;
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "rgba(59,130,246,0.2)"; ctx.fillRect(0, 200, c.width, 80);
      ctx.strokeStyle = "#93C5FD"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(0, 200); ctx.lineTo(c.width, 200); ctx.stroke();
      /* dock */
      ctx.fillStyle = "#78350F"; ctx.strokeStyle = "#D97706"; ctx.lineWidth = 2;
      ctx.fillRect(c.width - 80, 160, 80, 60); ctx.strokeRect(c.width - 80, 160, 80, 60);
      txt(ctx, "DOCK", c.width - 62, 195, WHITE, 11);
      /* kayak */
      ctx.fillStyle = "#D97706"; ctx.strokeStyle = AMBER; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(stRef.current.kayakX, 200); ctx.ellipse(stRef.current.kayakX, 200, 60, 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      /* person */
      ctx.strokeStyle = WHITE; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(stRef.current.personX + 70, 183, 10, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(stRef.current.personX + 70, 193); ctx.lineTo(stRef.current.personX + 70, 200); ctx.stroke();
      if (push) {
        arr(ctx, stRef.current.kayakX, 192, stRef.current.kayakX - 50, 192, BLUE, `v_k=${stRef.current.kayakV.toFixed(2)}`);
        arr(ctx, stRef.current.personX + 70, 183, stRef.current.personX + 110, 183, GREEN, `v_p=${stRef.current.personV.toFixed(2)}`);
      }
      txt(ctx, `Person pushes dock → kayak+person system: p = ${p.toFixed(2)} kg·m/s`, 10, 30, WHITE, 12);
      txt(ctx, push ? "Kayak goes LEFT, person stays (dock is fixed)" : "Press PUSH to push off dock", 10, 52, push ? AMBER : GRAY, 12);
      txt(ctx, "Conservation: kayak_p + person_p = 0 (if dock free)", 10, c.height - 10, GRAY, 11);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [m_person, push]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={280} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <button onClick={() => setPush(p => !p)}>{push ? "Stop" : "Push Off Dock!"}</button>
        <button onClick={() => { stRef.current = { kayakX: 200, kayakV: 0, personX: 200, personV: 0 }; setPush(false); }}>Reset</button>
        <label>Person: {m_person}kg<input type="range" min={40} max={120} value={m_person} onChange={e => setMperson(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 10. Bullet Through Block ───────────────────── */
export function Sim_bullet_through_block_2() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [bulletV, setBulletV] = useState(300); const [blockM, setBlockM] = useState(2);
  const [fired, setFired] = useState(false);
  const stRef = useRef({ bx: 50, bv: 300, blx: 300, blv: 0, passed: false });
  useEffect(() => {
    stRef.current = { bx: 50, bv: bulletV, blx: 300, blv: 0, passed: false };
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const bulletM = 0.05;
    function loop() {
      if (fired) {
        const s = stRef.current;
        s.bx += s.bv * 0.2;
        s.blx += s.blv * 0.3;
        if (!s.passed && s.bx >= s.blx && s.bx <= s.blx + 60) {
          /* partial penetration — transfer momentum */
          const fraction = 0.3; /* bullet loses 30% of velocity each frame in block */
          const dp = bulletM * s.bv * fraction * 0.01;
          s.bv -= dp / bulletM; s.blv += dp / blockM;
        }
        if (s.bx > s.blx + 60) s.passed = true;
      }
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#1F2937"; ctx.fillRect(0, 210, c.width, 30);
      /* block */
      const s = stRef.current;
      ctx.fillStyle = "#78350F"; ctx.strokeStyle = "#D97706"; ctx.lineWidth = 2;
      ctx.fillRect(s.blx, 165, 60, 45); ctx.strokeRect(s.blx, 165, 60, 45);
      txt(ctx, `${blockM}kg`, s.blx + 8, 192, WHITE, 11);
      if (Math.abs(s.blv) > 0.1) arr(ctx, s.blx + 30, 157, s.blx + 30 + s.blv * 20, 157, AMBER, `${s.blv.toFixed(1)}`);
      /* bullet */
      ctx.fillStyle = "#D97706"; ctx.strokeStyle = AMBER; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(s.bx, 188, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      if (fired) arr(ctx, s.bx + 7, 188, s.bx + 7 + s.bv * 0.15, 188, GREEN, `${s.bv.toFixed(0)} m/s`);
      /* trail */
      ctx.strokeStyle = "rgba(245,158,11,0.3)"; ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(50, 188); ctx.lineTo(Math.max(50, s.bx - 7), 188); ctx.stroke(); ctx.setLineDash([]);
      const pBefore = bulletM * bulletV;
      const pAfter = bulletM * s.bv + blockM * s.blv;
      txt(ctx, `p_before = ${bulletM}×${bulletV} = ${pBefore.toFixed(1)} kg·m/s`, 10, 30, WHITE, 13);
      txt(ctx, fired ? `p_after = ${(bulletM * s.bv).toFixed(2)} + ${(blockM * s.blv).toFixed(2)} = ${pAfter.toFixed(1)} kg·m/s` : "Press FIRE to see momentum transfer", 10, 52, fired ? GREEN : GRAY, 12);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [bulletV, blockM, fired]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={260} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <button onClick={() => { stRef.current = { bx: 50, bv: bulletV, blx: 300, blv: 0, passed: false }; setFired(true); }}>FIRE!</button>
        <button onClick={() => { stRef.current = { bx: 50, bv: bulletV, blx: 300, blv: 0, passed: false }; setFired(false); }}>Reset</button>
        <label>Bullet speed: {bulletV}m/s<input type="range" min={100} max={600} step={50} value={bulletV} onChange={e => setBulletV(+e.target.value)} /></label>
        <label>Block mass: {blockM}kg<input type="range" min={0.5} max={5} step={0.5} value={blockM} onChange={e => setBlockM(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 11. Rocket Exhaust Momentum ───────────────── */
export function Sim_rocket_momentum_exhaust() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [exhaust, setExhaust] = useState(50);
  const stRef = useRef({ ry: 280, rv: 0, particles: [] as { x: number; y: number; vy: number; alpha: number }[] });
  useEffect(() => {
    stRef.current = { ry: 280, rv: 0, particles: [] };
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const rocketM = 100;
    function loop() {
      const s = stRef.current;
      const exhaust_v = exhaust; const exhaust_rate = 0.5;
      s.rv += (exhaust_v * exhaust_rate / rocketM) * 0.04;
      s.ry -= s.rv;
      if (s.ry < 20) { s.ry = 280; s.rv = 0; s.particles = []; }
      /* add exhaust particles */
      for (let i = 0; i < 2; i++) {
        s.particles.push({ x: 290 + (Math.random() - 0.5) * 20, y: s.ry + 30, vy: exhaust * 0.05 + Math.random() * 2, alpha: 1 });
      }
      s.particles = s.particles.filter(p => p.alpha > 0.05).map(p => ({ ...p, y: p.y + p.vy, alpha: p.alpha * 0.97 }));
      ctx.clearRect(0, 0, c.width, c.height);
      const grad = ctx.createLinearGradient(0, 0, 0, c.height);
      grad.addColorStop(0, "#000510"); grad.addColorStop(1, "#0c1a3a");
      ctx.fillStyle = grad; ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#166534"; ctx.fillRect(0, c.height - 20, c.width, 20);
      /* particles */
      s.particles.forEach(p => {
        ctx.fillStyle = `rgba(251,191,36,${p.alpha})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill();
      });
      /* rocket */
      const rx = 290; const ry = s.ry;
      ctx.fillStyle = "#94A3B8"; ctx.strokeStyle = GRAY; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(rx, ry - 35); ctx.lineTo(rx + 15, ry); ctx.lineTo(rx - 15, ry); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#1E40AF"; ctx.beginPath(); ctx.arc(rx, ry - 18, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#475569";
      ctx.beginPath(); ctx.moveTo(rx - 15, ry); ctx.lineTo(rx - 28, ry + 15); ctx.lineTo(rx - 15, ry + 8); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(rx + 15, ry); ctx.lineTo(rx + 28, ry + 15); ctx.lineTo(rx + 15, ry + 8); ctx.closePath(); ctx.fill();
      /* momentum arrows */
      arr(ctx, rx, ry, rx, ry - 40, GREEN, `p_rocket ↑`);
      arr(ctx, rx, ry + 30, rx, ry + 70, RED, `p_exhaust ↓`);
      txt(ctx, `Exhaust speed: ${exhaust} m/s | Rocket speed: ${s.rv.toFixed(2)} m/s`, 10, 30, WHITE, 13);
      txt(ctx, `p_rocket_change = -p_exhaust_change (momentum conserved!)`, 10, 52, GREEN, 12);
      txt(ctx, "Rocket propulsion: reaction to exhaust momentum", 10, c.height - 25, GRAY, 11);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [exhaust]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={320} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Exhaust speed: {exhaust}m/s<input type="range" min={20} max={150} step={10} value={exhaust} onChange={e => setExhaust(+e.target.value)} /></label>
        <button onClick={() => { stRef.current = { ry: 280, rv: 0, particles: [] }; }}>Relaunch</button>
      </div>
    </div>
  );
}

/* ─── 12. Pool Break Shot ────────────────────────── */
export function Sim_pool_break() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [speed, setSpeed] = useState(8);
  const [breaking, setBreaking] = useState(false);
  const ballsRef = useRef<{ x: number; y: number; vx: number; vy: number; c: string }[]>([]);
  useEffect(() => {
    ballsRef.current = [];
    const c = ref.current!; const ctx = c.getContext("2d")!;
    function setup() {
      const colors = [RED, BLUE, GREEN, AMBER, PURPLE, "#EC4899", "#F97316", "#14B8A6", "#A78BFA", "#06B6D4", "#EF4444", "#22C55E", "#F59E0B", "#6366F1", "#84CC16"];
      /* cue ball */
      ballsRef.current = [{ x: 150, y: 180, vx: speed, vy: 0, c: WHITE }];
      /* triangle formation */
      let bi = 1;
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col <= row; col++) {
          ballsRef.current.push({ x: 360 + row * 28, y: 180 - row * 14 + col * 28, vx: 0, vy: 0, c: colors[bi++ % colors.length] });
        }
      }
    }
    if (breaking) setup();
    function loop() {
      if (breaking) {
        ballsRef.current = ballsRef.current.map(b => {
          /* wall bounce */
          let { x, y, vx, vy } = b;
          x += vx * 0.5; y += vy * 0.5;
          vx *= 0.995; vy *= 0.995;
          if (x < 20 || x > c.width - 20) { vx = -vx; x = Math.max(20, Math.min(c.width - 20, x)); }
          if (y < 20 || y > c.height - 20) { vy = -vy; y = Math.max(20, Math.min(c.height - 20, y)); }
          return { ...b, x, y, vx, vy };
        });
        /* simple collision detection */
        for (let i = 0; i < ballsRef.current.length; i++) {
          for (let j = i + 1; j < ballsRef.current.length; j++) {
            const a = ballsRef.current[i]; const b = ballsRef.current[j];
            const dx = b.x - a.x; const dy = b.y - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 20) {
              const nx = dx / dist; const ny = dy / dist;
              const relV = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
              if (relV > 0) {
                const dv = relV;
                ballsRef.current[i].vx -= dv * nx; ballsRef.current[i].vy -= dv * ny;
                ballsRef.current[j].vx += dv * nx; ballsRef.current[j].vy += dv * ny;
              }
            }
          }
        }
      }
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = "#064E3B"; ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "#065F46"; ctx.lineWidth = 2; ctx.strokeRect(5, 5, c.width - 10, c.height - 10);
      ballsRef.current.forEach(b => {
        ctx.fillStyle = b.c; ctx.strokeStyle = "rgba(0,0,0,0.3)"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(b.x, b.y, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      });
      const totalP = ballsRef.current.reduce((s, b) => ({ x: s.x + b.vx, y: s.y + b.vy }), { x: 0, y: 0 });
      txt(ctx, `Total p_x = ${totalP.x.toFixed(1)} | Total p_y = ${totalP.y.toFixed(1)}`, 10, 25, WHITE, 11);
      txt(ctx, "Pool break: cue ball transfers momentum to triangle (conserved!)", 10, c.height - 8, "rgba(255,255,255,0.7)", 10);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speed, breaking]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={280} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <button onClick={() => { ballsRef.current = []; setBreaking(b => !b); }}>Break!</button>
        <button onClick={() => { ballsRef.current = []; setBreaking(false); }}>Reset</button>
        <label>Cue speed: {speed}<input type="range" min={3} max={15} value={speed} onChange={e => setSpeed(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* ─── 13. Verify Conservation — Data Table ──────── */
export function Sim_verify_momentum_table() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [scenario, setScenario] = useState(0);
  const scenarios = [
    { name: "Cart collision (elastic)", m1: 3, v1i: 4, m2: 2, v2i: 0, v1f: (3 - 2) * 4 / (3 + 2), v2f: 2 * 3 * 4 / (3 + 2) },
    { name: "Carts stick (inelastic)", m1: 5, v1i: 6, m2: 3, v2i: 0, v1f: (5 * 6) / (5 + 3), v2f: (5 * 6) / (5 + 3) },
    { name: "Explosion from rest", m1: 4, v1i: 0, m2: 4, v2i: 0, v1f: -5, v2f: 5 },
    { name: "Head-on (opposite)", m1: 2, v1i: 5, m2: 2, v2i: -5, v1f: -5, v2f: 5 },
  ];
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
    const sc = scenarios[scenario];
    const p_before = sc.m1 * sc.v1i + sc.m2 * sc.v2i;
    const p_after = sc.m1 * sc.v1f + sc.m2 * sc.v2f;
    /* table */
    const tx = 30; const ty = 60; const tw = 520; const rh = 40;
    const cols = [130, 80, 80, 80, 80, 70];
    const headers = ["Quantity", "m₁ (kg)", "m₂ (kg)", "v₁ (m/s)", "v₂ (m/s)", "p (kg·m/s)"];
    /* header */
    ctx.fillStyle = "#1E3A5F"; ctx.strokeStyle = BLUE; ctx.lineWidth = 1.5;
    ctx.fillRect(tx, ty, tw, rh); ctx.strokeRect(tx, ty, tw, rh);
    let cx2 = tx;
    headers.forEach((h, i) => { txt(ctx, h, cx2 + 8, ty + 25, "#60A5FA", 12); cx2 += cols[i]; });
    /* before row */
    ctx.fillStyle = "#0F172A"; ctx.strokeStyle = GRAY; ctx.lineWidth = 1;
    ctx.fillRect(tx, ty + rh, tw, rh); ctx.strokeRect(tx, ty + rh, tw, rh);
    cx2 = tx;
    [`Before`, `${sc.m1}`, `${sc.m2}`, `${sc.v1i}`, `${sc.v2i}`, `${p_before.toFixed(2)}`].forEach((v, i) => {
      txt(ctx, v, cx2 + 8, ty + rh + 25, WHITE, 12); cx2 += cols[i];
    });
    /* after row */
    ctx.fillStyle = "#052E16"; ctx.strokeStyle = GREEN; ctx.lineWidth = 1;
    ctx.fillRect(tx, ty + rh * 2, tw, rh); ctx.strokeRect(tx, ty + rh * 2, tw, rh);
    cx2 = tx;
    [`After`, `${sc.m1}`, `${sc.m2}`, `${sc.v1f.toFixed(2)}`, `${sc.v2f.toFixed(2)}`, `${p_after.toFixed(2)}`].forEach((v, i) => {
      txt(ctx, v, cx2 + 8, ty + rh * 2 + 25, GREEN, 12); cx2 += cols[i];
    });
    /* result */
    const conserved = Math.abs(p_before - p_after) < 0.01;
    ctx.fillStyle = conserved ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)"; ctx.strokeStyle = conserved ? GREEN : RED; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(tx, ty + rh * 3 + 10, tw, 50, 6); ctx.fill(); ctx.stroke();
    txt(ctx, `p_before = ${p_before.toFixed(2)} kg·m/s  |  p_after = ${p_after.toFixed(2)} kg·m/s`, tx + 20, ty + rh * 3 + 32, WHITE, 12);
    txt(ctx, conserved ? "✓ Momentum is CONSERVED!" : "× Check the calculation!", tx + 20, ty + rh * 3 + 52, conserved ? GREEN : RED, 13);
    txt(ctx, `Scenario: ${sc.name}`, tx, 35, AMBER, 13);
  }, [scenario]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={290} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        {scenarios.map((sc, i) => (
          <button key={i} onClick={() => setScenario(i)} style={{ background: i === scenario ? BLUE + "44" : undefined }}>{sc.name}</button>
        ))}
      </div>
    </div>
  );
}

/* ─── 14. Baseball Bat Momentum Exchange ─────────── */
export function Sim_baseball_momentum() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [batSpeed, setBatSpeed] = useState(20);
  const stRef = useRef({ ballX: 480, ballV: -15, batX: 300, batV: 20, hit: false });
  useEffect(() => {
    stRef.current = { ballX: 480, ballV: -15, batX: 300, batV: batSpeed, hit: false };
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const ballM = 0.14; const batM = 1.0;
    function loop() {
      const s = stRef.current;
      s.ballX += s.ballV * 0.4;
      s.batX += s.batV * 0.3;
      s.batV *= 0.998;
      if (!s.hit && Math.abs(s.ballX - s.batX) < 25) {
        s.hit = true;
        /* elastic-ish collision */
        const e = 0.6;
        const newBallV = ((ballM - e * batM) * s.ballV + (1 + e) * batM * s.batV) / (ballM + batM);
        const newBatV = ((batM - e * ballM) * s.batV + (1 + e) * ballM * s.ballV) / (ballM + batM);
        s.ballV = newBallV; s.batV = newBatV;
      }
      if (s.ballX < -20 || s.ballX > c.width + 20) { stRef.current = { ballX: 480, ballV: -15, batX: 300, batV: batSpeed, hit: false }; }
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#1F2937"; ctx.fillRect(0, 210, c.width, 30);
      /* bat */
      ctx.fillStyle = "#78350F"; ctx.strokeStyle = "#D97706"; ctx.lineWidth = 2;
      ctx.fillRect(s.batX - 8, 150, 16, 65); ctx.strokeRect(s.batX - 8, 150, 16, 65);
      ctx.fillRect(s.batX - 4, 215, 8, 30);
      /* ball */
      ctx.fillStyle = "#E2E8F0"; ctx.strokeStyle = GRAY; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(s.ballX, 183, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = RED; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(s.ballX, 183, 14, -0.5, 0.5); ctx.stroke();
      /* velocity arrows */
      if (Math.abs(s.batV) > 0.5) arr(ctx, s.batX, 160, s.batX + s.batV * 4, 160, AMBER, `bat: ${s.batV.toFixed(1)}`);
      if (Math.abs(s.ballV) > 0.5) arr(ctx, s.ballX, 183, s.ballX + s.ballV * 2, 183, BLUE, `ball: ${s.ballV.toFixed(1)}`);
      const p_before = ballM * (-15) + batM * batSpeed;
      const p_after = ballM * s.ballV + batM * s.batV;
      txt(ctx, `p_before = ${p_before.toFixed(2)} kg·m/s  |  p_after = ${p_after.toFixed(2)} kg·m/s`, 10, 30, WHITE, 12);
      txt(ctx, s.hit ? `Ball now at ${s.ballV.toFixed(1)} m/s | ${s.ballV > 0 ? "HIT! Ball flies away →" : "Missed"}` : "Pitch coming in...", 10, 52, s.hit && s.ballV > 0 ? GREEN : WHITE, 12);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [batSpeed]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={255} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <label>Bat speed: {batSpeed}m/s<input type="range" min={5} max={40} value={batSpeed} onChange={e => setBatSpeed(+e.target.value)} /></label>
        <button onClick={() => { stRef.current = { ballX: 480, ballV: -15, batX: 300, batV: batSpeed, hit: false }; }}>Pitch Again</button>
      </div>
    </div>
  );
}

/* ─── 15. Fire Hose Reaction ─────────────────────── */
export function Sim_fire_hose_reaction() {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0); const [pressure, setPressure] = useState(50);
  const [on, setOn] = useState(false);
  const hosRef = useRef({ personX: 300, personV: 0, waterParts: [] as { x: number; y: number; vx: number; vy: number; a: number }[] });
  useEffect(() => {
    hosRef.current = { personX: 300, personV: 0, waterParts: [] };
    const c = ref.current!; const ctx = c.getContext("2d")!;
    function loop() {
      const h = hosRef.current;
      if (on) {
        /* add water particles */
        for (let i = 0; i < 2; i++) {
          h.waterParts.push({ x: h.personX - 10, y: 175 + (Math.random() - 0.5) * 10, vx: -pressure * 0.08, vy: (Math.random() - 0.5) * 1, a: 1 });
        }
        /* recoil */
        const F = pressure * 0.5;
        h.personV += F * 0.001; h.personX += h.personV * 0.4; h.personV *= 0.97;
      }
      h.waterParts = h.waterParts.filter(p => p.a > 0.05 && p.x > -20).map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.05, a: p.a * 0.98 }));
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = BG; ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#1F2937"; ctx.fillRect(0, 215, c.width, 30);
      /* water particles */
      h.waterParts.forEach(p => {
        ctx.fillStyle = `rgba(59,130,246,${p.a})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fill();
      });
      /* hose */
      ctx.strokeStyle = "#92400E"; ctx.lineWidth = 8; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(h.personX + 10, 178); ctx.lineTo(h.personX - 10, 175); ctx.stroke();
      /* person */
      ctx.strokeStyle = WHITE; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(h.personX + 20, 160, 12, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(h.personX + 20, 172); ctx.lineTo(h.personX + 20, 195); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(h.personX + 20, 180); ctx.lineTo(h.personX + 5, 188); ctx.moveTo(h.personX + 20, 180); ctx.lineTo(h.personX + 35, 185); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(h.personX + 20, 195); ctx.lineTo(h.personX + 12, 215); ctx.moveTo(h.personX + 20, 195); ctx.lineTo(h.personX + 28, 215); ctx.stroke();
      if (on) {
        arr(ctx, h.personX - 10, 175, h.personX - 10 - pressure * 0.5, 175, BLUE, "water →");
        arr(ctx, h.personX + 20, 170, h.personX + 20 + pressure * 0.3, 170, RED, "recoil →");
      }
      txt(ctx, `Pressure: ${pressure} | Water flow: high speed to the left`, 10, 30, WHITE, 13);
      txt(ctx, on ? "Person pushed RIGHT (reaction to water going left — Newton's 3rd!)" : "Turn on hose to see reaction force", 10, 52, on ? RED : GRAY, 12);
      txt(ctx, `Momentum of water (left) = Momentum of firefighter (right)`, 10, c.height - 10, GRAY, 11);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [on, pressure]);
  return (
    <div className="sim-wrap">
      <canvas ref={ref} width={580} height={280} style={{ width: "100%", borderRadius: 8 }} />
      <div className="sim-controls">
        <button onClick={() => { setOn(o => !o); hosRef.current = { personX: 300, personV: 0, waterParts: [] }; }}>{on ? "Turn Off" : "Open Hose!"}</button>
        <label>Water pressure: {pressure}<input type="range" min={10} max={100} value={pressure} onChange={e => setPressure(+e.target.value)} /></label>
      </div>
    </div>
  );
}
