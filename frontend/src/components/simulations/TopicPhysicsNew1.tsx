/**
 * FILE: TopicPhysicsNew1.tsx
 * LOCATION: src/components/simulations/TopicPhysicsNew1.tsx
 * PURPOSE: 6 professional canvas-based physics simulations for
 *          Topic 1 — Balanced & Unbalanced Forces (CBSE Class 9, Chapter 9)
 *
 * ALL simulations use pure HTML5 Canvas API + requestAnimationFrame.
 * No external physics library — correct Newtonian mechanics implemented directly.
 *
 * Simulations:
 *   Pro1_NetForceBlock    — Block with L/R adjustable forces, shows net force, a, v
 *   Pro1_FrictionSurfaces — Same applied force on ice/wood/concrete simultaneously
 *   Pro1_WeightNormal     — Gravity vs Normal force on horizontal surface
 *   Pro1_TugOfWar         — Two teams pulling rope, real physics, net force display
 *   Pro1_EquilBreaker     — Break equilibrium by increasing one force
 *   Pro1_ForceVectors2D   — 2D parallelogram of forces with resultant
 *
 * CBSE Syllabus coverage: Contact force, non-contact force, balanced/unbalanced
 *   forces, resultant force, friction, gravity, normal force.
 *
 * LAST UPDATED: 2026-06-01
 */

"use client";
import { useRef, useEffect, useState } from "react";

/* ══════════════════════════════════════════════════════════════════
 * SHARED CONSTANTS & DRAWING UTILITIES
 * ══════════════════════════════════════════════════════════════════ */

/** Color palette — consistent across all simulations in this file */
const C = {
  bg:       "#07101f",
  panel:    "#0f1c2e",
  surface:  "#162032",
  border:   "#1e3050",
  block:    "#2563EB",
  blockHi:  "#3b82f6",
  right:    "#22c55e",   // positive/right force
  left:     "#ef4444",   // negative/left/opposing force
  net:      "#f59e0b",   // net/resultant force
  gravity:  "#f97316",   // weight/gravity
  normal:   "#a78bfa",   // normal force
  text:     "#e2e8f0",
  textDim:  "#94a3b8",
  textFaint:"#334155",
  grid:     "rgba(99,102,241,0.05)",
  ice:      "#7dd3fc",
  wood:     "#b45309",
  rubber:   "#6b7280",
};

/** Draw a filled rounded rectangle */
function rRect(ctx: CanvasRenderingContext2D, x: number, y: number,
               w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y,     x + w, y + r,     r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h); ctx.arcTo(x,     y + h, x,     y + h - r, r);
  ctx.lineTo(x, y + r); ctx.arcTo(x,     y,     x + r, y,             r);
  ctx.closePath();
}

/** Draw an arrow with optional label */
function arrow(ctx: CanvasRenderingContext2D,
               x1: number, y1: number, x2: number, y2: number,
               color: string, lw = 2.5, lbl = ""): void {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
  if (len < 3) return;
  const angle = Math.atan2(dy, dx);
  const hw = Math.min(14, len * 0.38);
  ctx.save();
  ctx.strokeStyle = color; ctx.fillStyle = color;
  ctx.lineWidth = lw; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - hw * Math.cos(angle - 0.42), y2 - hw * Math.sin(angle - 0.42));
  ctx.lineTo(x2 - hw * Math.cos(angle + 0.42), y2 - hw * Math.sin(angle + 0.42));
  ctx.closePath(); ctx.fill();
  if (lbl) {
    ctx.font = "bold 11px Inter,system-ui,sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - 13;
    ctx.fillStyle = "rgba(7,16,31,0.85)";
    const tw = ctx.measureText(lbl).width;
    ctx.fillRect(mx - tw / 2 - 4, my - 8, tw + 8, 16);
    ctx.fillStyle = color; ctx.fillText(lbl, mx, my);
  }
  ctx.restore();
}

/** Draw text with optional background */
function txt(ctx: CanvasRenderingContext2D, t: string,
             x: number, y: number, color: string,
             size = 12, align: CanvasTextAlign = "center"): void {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${size}px Inter,system-ui,sans-serif`;
  ctx.textAlign = align; ctx.textBaseline = "middle";
  ctx.fillText(t, x, y);
  ctx.restore();
}

/** Draw subtle dot-grid background */
function drawGrid(ctx: CanvasRenderingContext2D, W: number, H: number): void {
  ctx.save();
  ctx.fillStyle = "rgba(99,102,241,0.12)";
  for (let x = 20; x < W; x += 30) {
    for (let y = 20; y < H; y += 30) {
      ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.restore();
}

/** Shared outer wrapper style */
const WRAP: React.CSSProperties = {
  background: C.bg,
  border: `1px solid ${C.border}`,
  borderRadius: 18,
  overflow: "hidden",
  fontFamily: "Inter,system-ui,sans-serif",
};
const HEAD: React.CSSProperties = {
  padding: "16px 22px 12px",
  borderBottom: `1px solid ${C.border}`,
};
const TITLE: React.CSSProperties = {
  margin: 0, fontSize: 15, fontWeight: 700,
  color: C.text, letterSpacing: "-0.01em",
};
const DESC: React.CSSProperties = {
  margin: "3px 0 0", fontSize: 12, color: C.textDim, lineHeight: 1.5,
};
const CONCEPT: React.CSSProperties = {
  padding: "10px 22px",
  background: "rgba(37,99,235,0.06)",
  borderTop: `1px solid ${C.border}`,
  fontSize: 11.5, color: C.textDim, lineHeight: 1.6,
};
const CTRLS: React.CSSProperties = {
  padding: "12px 22px",
  display: "flex", flexWrap: "wrap" as const, gap: 14,
  borderTop: `1px solid ${C.border}`,
};
const SLIDER_WRAP: React.CSSProperties = {
  display: "flex", flexDirection: "column" as const, gap: 3, flex: 1, minWidth: 150,
};

/* ══════════════════════════════════════════════════════════════════
 * SIMULATION 1 — Net Force Block Lab
 * Physics: F_net = F_R - F_L, a = F_net / m, kinetic friction = μmg
 * Learning: When F_net=0 → equilibrium; F_net≠0 → acceleration in net direction
 * ══════════════════════════════════════════════════════════════════ */
export function Pro1_NetForceBlock() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const st  = useRef({ x: 250, v: 0 });
  const [fr, setFr] = useState(60);
  const [fl, setFl] = useState(20);
  const frRef = useRef(fr); const flRef = useRef(fl);
  useEffect(() => { frRef.current = fr; flRef.current = fl; }, [fr, fl]);

  useEffect(() => {
    const cv = cvs.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const W = cv.width, H = cv.height;
    const MASS = 8, MU = 0.10, G = 9.8;
    const BW = 60, BH = 40, BY = H - 85;
    const SCALE = 1.2;   // px per N for arrow display
    const VIS = 70;      // px per m/s for block movement
    st.current = { x: W / 2 - BW / 2, v: 0 };
    let last = performance.now();

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 1 / 30); last = now;
      const s = st.current;
      const fR = frRef.current, fL = flRef.current;
      const fNet = fR - fL;
      const fStatic = MU * MASS * G;          // maximum static friction
      const fKinetic = MU * MASS * G;         // kinetic friction magnitude

      let a = 0;
      if (Math.abs(s.v) < 0.02 && Math.abs(fNet) <= fStatic) {
        // Static equilibrium — block doesn't move
        s.v = 0; a = 0;
      } else {
        // Block is moving or about to move
        const fricDir = s.v !== 0 ? -Math.sign(s.v) : -Math.sign(fNet);
        a = (fNet + fricDir * fKinetic) / MASS;
      }
      s.v += a * dt;
      s.x += s.v * dt * VIS;
      // Wrap at canvas edges
      if (s.x > W + 10)   s.x = -BW - 10;
      if (s.x < -BW - 10) s.x = W + 10;

      // ─── Draw ────────────────────────────────────────────────
      ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
      drawGrid(ctx, W, H);

      // Ground surface
      ctx.fillStyle = C.surface; ctx.fillRect(0, BY + BH, W, H - BY - BH);
      ctx.fillStyle = C.border;  ctx.fillRect(0, BY + BH, W, 2);
      // Surface hatching (ground texture)
      ctx.save(); ctx.strokeStyle = C.textFaint; ctx.lineWidth = 1; ctx.globalAlpha = 0.4;
      for (let x = 0; x < W; x += 14) {
        ctx.beginPath(); ctx.moveTo(x, BY + BH + 2);
        ctx.lineTo(x - 8, BY + BH + 10); ctx.stroke();
      }
      ctx.restore();

      // Block with gradient
      const bx = s.x;
      const grad = ctx.createLinearGradient(bx, BY, bx, BY + BH);
      grad.addColorStop(0, "#3b82f6"); grad.addColorStop(1, "#1e40af");
      ctx.fillStyle = grad;
      rRect(ctx, bx, BY, BW, BH, 7); ctx.fill();
      // Block shine
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      rRect(ctx, bx + 4, BY + 4, BW - 8, BH / 3, 4); ctx.fill();
      txt(ctx, `${MASS} kg`, bx + BW / 2, BY + BH / 2, "#fff", 11);

      // Force arrows (from center of block)
      const cx = bx + BW / 2, cy = BY + BH / 2;
      if (fR > 0) arrow(ctx, cx, cy, cx + fR * SCALE, cy, C.right, 3, `FR=${fR}N`);
      if (fL > 0) arrow(ctx, cx, cy, cx - fL * SCALE, cy, C.left,  3, `FL=${fL}N`);
      // Net force arrow (shown above block)
      if (Math.abs(fNet) > 1)
        arrow(ctx, cx, BY - 22, cx + fNet * SCALE * 0.85, BY - 22, C.net, 3, `Fnet=${fNet>0?"+":""}${fNet}N`);

      // Info panel
      const balanced = Math.abs(fNet) <= fStatic && Math.abs(s.v) < 0.05;
      ctx.fillStyle = "rgba(7,16,31,0.88)";
      rRect(ctx, W - 158, 8, 150, 96, 8); ctx.fill();
      ctx.strokeStyle = C.border; ctx.lineWidth = 1;
      rRect(ctx, W - 158, 8, 150, 96, 8); ctx.stroke();
      txt(ctx, "📊 Live Physics", W - 83, 24, C.textDim, 10);
      txt(ctx, `Fnet = ${fNet>0?"+":""}${fNet} N`,   W - 83, 42, C.net,  11);
      txt(ctx, `a  =  ${a.toFixed(2)} m/s²`,          W - 83, 58, C.text, 11);
      txt(ctx, `v  =  ${s.v.toFixed(2)} m/s`,         W - 83, 74, C.text, 11);
      txt(ctx, balanced ? "⚖️  BALANCED" : "⚡ ACCELERATING",
          W - 83, 91, balanced ? "#22c55e" : "#f59e0b", 10);

      raf.current = requestAnimationFrame(frame);
    }
    raf.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <div style={WRAP}>
      <div style={HEAD}>
        <h3 style={TITLE}>⚖️ Net Force — Balanced vs Unbalanced Forces</h3>
        <p style={DESC}>Apply left and right forces. The block accelerates when forces are unequal (unbalanced).</p>
      </div>
      <canvas ref={cvs} width={580} height={260} style={{ width: "100%", display: "block" }} />
      <div style={CONCEPT}>
        <strong style={{ color: "#93c5fd" }}>Key Concept:</strong>{" "}
        F<sub>net</sub> = F<sub>R</sub> − F<sub>L</sub>. When F<sub>net</sub> = 0, forces are
        <strong> balanced</strong> → no acceleration. When F<sub>net</sub> ≠ 0, they are
        <strong> unbalanced</strong> → acceleration = F<sub>net</sub> / m (Newton's 2nd Law).
      </div>
      <div style={CTRLS}>
        <div style={SLIDER_WRAP}>
          <span style={{ fontSize: 11, color: C.right }}>Force Right (F<sub>R</sub>): {fr} N</span>
          <input type="range" min={0} max={120} value={fr}
                 onChange={e => setFr(+e.target.value)} style={{ accentColor: C.right }} />
        </div>
        <div style={SLIDER_WRAP}>
          <span style={{ fontSize: 11, color: C.left }}>Force Left (F<sub>L</sub>): {fl} N</span>
          <input type="range" min={0} max={120} value={fl}
                 onChange={e => setFl(+e.target.value)} style={{ accentColor: C.left }} />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * SIMULATION 2 — Friction Surfaces Comparison
 * Physics: f = μN = μmg; a = (F_applied - μmg) / m
 * Learning: Same force → different accelerations on different surfaces
 * ══════════════════════════════════════════════════════════════════ */
export function Pro1_FrictionSurfaces() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  // Three blocks — ice (μ=0.03), wood (μ=0.35), rubber (μ=0.70)
  const st = useRef([
    { x: 90, v: 0, mu: 0.03, label: "Ice",     color: "#7dd3fc", mu_: "μ = 0.03" },
    { x: 90, v: 0, mu: 0.35, label: "Wood",    color: "#d97706", mu_: "μ = 0.35" },
    { x: 90, v: 0, mu: 0.70, label: "Concrete",color: "#6b7280", mu_: "μ = 0.70" },
  ]);
  const [fApp, setFApp] = useState(40);
  const fRef = useRef(fApp);
  useEffect(() => { fRef.current = fApp; }, [fApp]);

  useEffect(() => {
    const cv = cvs.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const W = cv.width, H = cv.height;
    const MASS = 5, G = 9.8;
    const BW = 48, BH = 32;
    const rowH = H / 3;
    let last = performance.now();

    // Reset positions when force changes (handled via ref — no reset needed,
    // the physics naturally changes response)

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 1 / 30); last = now;
      const fa = fRef.current;

      ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
      drawGrid(ctx, W, H);

      st.current.forEach((blk, i) => {
        const rowY = i * rowH;
        const surfY = rowY + rowH - 30;

        // Row background
        ctx.fillStyle = i % 2 === 0 ? C.panel : C.bg;
        ctx.fillRect(0, rowY, W, rowH);

        // Surface strip
        ctx.fillStyle = blk.color + "33";
        ctx.fillRect(0, surfY, W, 30);
        ctx.fillStyle = blk.color + "66";
        ctx.fillRect(0, surfY, W, 2);

        // Physics update
        const fN  = MASS * G;                    // normal force
        const fFr = blk.mu * fN;                 // max friction
        let a = 0;
        if (Math.abs(blk.v) < 0.01 && fa <= fFr) {
          blk.v = 0; a = 0;                      // static — block doesn't move
        } else {
          a = (fa - fFr * Math.sign(blk.v || 1)) / MASS;
          if (a < 0 && blk.v >= 0) { a = Math.max(a, -blk.v / dt); }
        }
        blk.v += a * dt;
        blk.x += blk.v * dt * 65;
        if (blk.x > W - BW - 10) { blk.x = W - BW - 10; blk.v = 0; }
        if (blk.x < 85)            blk.x = 85;

        // Block
        const BY = surfY - BH;
        const g2 = ctx.createLinearGradient(blk.x, BY, blk.x, BY + BH);
        g2.addColorStop(0, "#3b82f6"); g2.addColorStop(1, "#1e40af");
        ctx.fillStyle = g2;
        rRect(ctx, blk.x, BY, BW, BH, 5); ctx.fill();
        txt(ctx, `${MASS}kg`, blk.x + BW / 2, BY + BH / 2, "#fff", 10);

        // Applied force arrow
        if (fa > 0)
          arrow(ctx, blk.x + BW, BY + BH / 2,
                     blk.x + BW + Math.min(fa * 0.8, 80), BY + BH / 2, C.right, 2.5);

        // Friction arrow
        if (blk.v > 0.05 || (blk.v < 0.05 && fa > fFr))
          arrow(ctx, blk.x, BY + BH / 2, blk.x - fFr * 0.6, BY + BH / 2, C.left, 2);

        // Labels
        txt(ctx, blk.label, 10, surfY - BH / 2, blk.color, 12, "left");
        txt(ctx, blk.mu_,   10, surfY - BH / 2 + 14, C.textDim, 10, "left");
        txt(ctx, `a = ${a.toFixed(2)} m/s²`, W - 10, rowY + rowH / 2 - 8, C.net, 11, "right");
        txt(ctx, `v = ${blk.v.toFixed(2)} m/s`, W - 10, rowY + rowH / 2 + 8, C.text, 10, "right");
        txt(ctx, a < 0.01 && blk.v < 0.05 ? "STATIC" : "SLIDING",
            W - 10, rowY + rowH / 2 + 22,
            a < 0.01 && blk.v < 0.05 ? "#f59e0b" : "#22c55e", 10, "right");

        // Divider
        if (i < 2) {
          ctx.strokeStyle = C.border; ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.beginPath(); ctx.moveTo(0, rowY + rowH); ctx.lineTo(W, rowY + rowH); ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      raf.current = requestAnimationFrame(frame);
    }
    raf.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <div style={WRAP}>
      <div style={HEAD}>
        <h3 style={TITLE}>🧊 Friction Surfaces — Ice vs Wood vs Concrete</h3>
        <p style={DESC}>Same applied force on three surfaces. Different friction → different accelerations.</p>
      </div>
      <canvas ref={cvs} width={580} height={270} style={{ width: "100%", display: "block" }} />
      <div style={CONCEPT}>
        <strong style={{ color: "#93c5fd" }}>Key Concept:</strong>{" "}
        Friction force f = μN = μmg. A rough surface (high μ) creates more friction, so the same
        applied force gives <em>less</em> acceleration. Ice barely resists, concrete strongly resists.
      </div>
      <div style={CTRLS}>
        <div style={SLIDER_WRAP}>
          <span style={{ fontSize: 11, color: C.right }}>Applied Force: {fApp} N</span>
          <input type="range" min={0} max={100} value={fApp}
                 onChange={e => setFApp(+e.target.value)} style={{ accentColor: C.right }} />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * SIMULATION 3 — Weight vs Normal Force on Horizontal Surface
 * Physics: W = mg (down), N = mg (up), Net vertical = 0
 * Learning: On flat surface forces are balanced vertically — no vertical acceleration
 * ══════════════════════════════════════════════════════════════════ */
export function Pro1_WeightNormal() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [mass, setMass] = useState(10);
  const massRef = useRef(mass);
  useEffect(() => { massRef.current = mass; }, [mass]);

  useEffect(() => {
    const cv = cvs.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const W = cv.width, H = cv.height;
    const G = 9.8;
    let t = 0;
    let last = performance.now();

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 1 / 30); last = now;
      t += dt;
      const m = massRef.current;
      const W_force = m * G;
      const N_force = W_force; // balanced on flat surface
      // Pulsing scale for arrows (subtle breathing animation)
      const pulse = 1 + 0.04 * Math.sin(t * 2.5);

      ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
      drawGrid(ctx, W, H);

      // Table surface
      const tableY = H - 80;
      const tableGrad = ctx.createLinearGradient(0, tableY, 0, tableY + 20);
      tableGrad.addColorStop(0, "#1e3050"); tableGrad.addColorStop(1, "#0f1c2e");
      ctx.fillStyle = tableGrad; ctx.fillRect(60, tableY, W - 120, 20);
      ctx.fillStyle = C.border; ctx.fillRect(60, tableY, W - 120, 2);
      // Table legs
      ctx.fillStyle = C.surface;
      ctx.fillRect(100, tableY + 20, 12, 60);
      ctx.fillRect(W - 112, tableY + 20, 12, 60);

      // Block (object resting on table)
      const BW = 80, BH = 60;
      const bx = W / 2 - BW / 2, by = tableY - BH;
      const bGrad = ctx.createLinearGradient(bx, by, bx, by + BH);
      bGrad.addColorStop(0, "#3b82f6"); bGrad.addColorStop(1, "#1e40af");
      ctx.fillStyle = bGrad; rRect(ctx, bx, by, BW, BH, 8); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.1)"; rRect(ctx, bx+5,by+5,BW-10,20,4); ctx.fill();
      txt(ctx, `${m} kg`, bx + BW / 2, by + BH / 2, "#fff", 13);

      // Arrow lengths proportional to force
      const arrowLen = Math.min(W_force * 2.2 * pulse, 95);
      const cx = bx + BW / 2;

      // Weight arrow (downward) — red/orange
      const wy1 = by + BH, wy2 = by + BH + arrowLen;
      arrow(ctx, cx, wy1, cx, wy2, C.gravity, 3.5);
      txt(ctx, `W = mg`, cx + 55, (wy1 + wy2) / 2 - 8, C.gravity, 11);
      txt(ctx, `= ${m}×${G} = ${W_force.toFixed(1)} N`, cx + 55, (wy1 + wy2) / 2 + 8, C.gravity, 11);

      // Normal force arrow (upward) — purple
      const ny1 = by, ny2 = by - arrowLen;
      arrow(ctx, cx, ny1, cx, ny2, C.normal, 3.5);
      txt(ctx, `N = ${N_force.toFixed(1)} N`, cx - 70, (ny1 + ny2) / 2, C.normal, 11);
      txt(ctx, "(Normal Force)", cx - 70, (ny1 + ny2) / 2 + 14, C.textDim, 10);

      // Equilibrium label
      ctx.fillStyle = "rgba(34,197,94,0.12)"; ctx.strokeStyle = "#22c55e"; ctx.lineWidth = 1;
      rRect(ctx, W/2 - 80, 12, 160, 26, 6); ctx.fill(); ctx.stroke();
      txt(ctx, "⚖️  VERTICAL EQUILIBRIUM", W/2, 25, "#22c55e", 10);

      // Info
      txt(ctx, `Net Force = N − W = ${(N_force - W_force).toFixed(1)} N`,
          W / 2, H - 12, C.textDim, 11);

      raf.current = requestAnimationFrame(frame);
    }
    raf.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <div style={WRAP}>
      <div style={HEAD}>
        <h3 style={TITLE}>🏋️ Weight vs Normal Force — Perfect Balance</h3>
        <p style={DESC}>An object on a flat surface is in vertical equilibrium: gravity pulls down, surface pushes up equally.</p>
      </div>
      <canvas ref={cvs} width={580} height={310} style={{ width: "100%", display: "block" }} />
      <div style={CONCEPT}>
        <strong style={{ color: "#93c5fd" }}>Key Concept:</strong>{" "}
        Weight W = mg acts downward. Normal force N acts perpendicular to the surface (upward).
        On a horizontal surface N = W, so Net vertical force = 0 → no vertical acceleration → object stays at rest.
      </div>
      <div style={CTRLS}>
        <div style={SLIDER_WRAP}>
          <span style={{ fontSize: 11, color: C.gravity }}>Mass: {mass} kg (W = {(mass * 9.8).toFixed(1)} N)</span>
          <input type="range" min={2} max={30} value={mass}
                 onChange={e => setMass(+e.target.value)} style={{ accentColor: C.gravity }} />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * SIMULATION 4 — Tug of War (Real Physics)
 * Physics: F_net = F_A - F_B, a = F_net / total_mass, rope has center
 * Learning: Larger force wins — unbalanced forces cause motion
 * ══════════════════════════════════════════════════════════════════ */
export function Pro1_TugOfWar() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const st  = useRef({ cx: 290, v: 0 }); // rope center x, velocity
  const [fa, setFa] = useState(350);  // Team A (left)
  const [fb, setFb] = useState(250);  // Team B (right)
  const faR = useRef(fa); const fbR = useRef(fb);
  useEffect(() => { faR.current = fa; fbR.current = fb; }, [fa, fb]);

  useEffect(() => {
    const cv = cvs.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const W = cv.width, H = cv.height;
    const TOTAL_MASS = 160; // kg (two teams)
    let last = performance.now();
    st.current = { cx: W / 2, v: 0 };

    function drawPerson(px: number, py: number, dir: 1 | -1, color: string, lean: number) {
      ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineCap = "round";
      const lx = lean * dir;
      // Head
      ctx.fillStyle = color; ctx.beginPath(); ctx.arc(px, py - 28, 9, 0, Math.PI * 2); ctx.fill();
      // Body
      ctx.beginPath(); ctx.moveTo(px, py - 19); ctx.lineTo(px + lx, py); ctx.stroke();
      // Arms
      ctx.beginPath(); ctx.moveTo(px, py - 14); ctx.lineTo(px + dir * 16 + lx, py - 8); ctx.stroke();
      // Legs
      ctx.beginPath(); ctx.moveTo(px + lx, py); ctx.lineTo(px + lx - dir * 8, py + 20); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px + lx, py); ctx.lineTo(px + lx + dir * 4, py + 20); ctx.stroke();
      ctx.restore();
    }

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 1 / 30); last = now;
      const fA = faR.current, fB = fbR.current;
      const fNet = fA - fB; // positive = left team wins (moves right)
      const a = -fNet / TOTAL_MASS; // negative: left team pulls center left
      st.current.v += a * dt;
      st.current.cx += st.current.v * dt * 50;
      // Clamp
      st.current.cx = Math.max(120, Math.min(W - 120, st.current.cx));
      if (st.current.cx <= 120 || st.current.cx >= W - 120) st.current.v = 0;

      ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
      drawGrid(ctx, W, H);

      // Ground
      ctx.fillStyle = C.surface; ctx.fillRect(0, H - 50, W, 50);
      ctx.fillStyle = C.border;  ctx.fillRect(0, H - 52, W, 2);

      // Center line (mud pit / line marker)
      ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
      ctx.beginPath(); ctx.moveTo(W / 2, 20); ctx.lineTo(W / 2, H - 50); ctx.stroke();
      ctx.setLineDash([]);
      txt(ctx, "CENTER", W / 2, 14, "#f59e0b", 9);

      // Rope
      const ropeY = H - 100;
      const cx = st.current.cx;
      ctx.strokeStyle = "#d97706"; ctx.lineWidth = 6; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(80, ropeY); ctx.lineTo(W - 80, ropeY); ctx.stroke();
      // Rope knot
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath(); ctx.arc(cx, ropeY, 9, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#d97706"; ctx.lineWidth = 2; ctx.stroke();

      // Team A figures (left side, facing right)
      const lean = Math.min(8, Math.abs(st.current.v) * 2);
      for (let i = 0; i < 3; i++) {
        drawPerson(60 - i * 28, ropeY - 10, 1, "#ef4444", lean);
      }
      // Team B figures (right side, facing left)
      for (let i = 0; i < 3; i++) {
        drawPerson(W - 60 + i * 28, ropeY - 10, -1, "#3b82f6", lean);
      }

      // Force labels
      txt(ctx, `Team A`, 80, ropeY - 55, C.left, 12);
      txt(ctx, `${fA} N →`, 80, ropeY - 40, C.left, 11);
      txt(ctx, `← ${fB} N`, W - 80, ropeY - 40, C.right, 11);
      txt(ctx, `Team B`, W - 80, ropeY - 55, C.right, 12);

      // Winner / net force
      const balanced = Math.abs(fNet) < 10;
      const winner   = fA > fB ? "Team A" : fB > fA ? "Team B" : "TIE";
      ctx.fillStyle = "rgba(7,16,31,0.9)";
      rRect(ctx, W/2-95, ropeY - 85, 190, 38, 8); ctx.fill();
      txt(ctx, balanced ? "⚖️  BALANCED (Tie!)" : `⚡ F_net = ${Math.abs(fNet)} N → ${winner} wins!`,
          W / 2, ropeY - 74, balanced ? "#22c55e" : "#f59e0b", 11);
      txt(ctx, `Knot displacement: ${(cx - W/2).toFixed(0)} px`,
          W / 2, ropeY - 58, C.textDim, 10);

      raf.current = requestAnimationFrame(frame);
    }
    raf.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <div style={WRAP}>
      <div style={HEAD}>
        <h3 style={TITLE}>🪢 Tug of War — Unbalanced Forces Win</h3>
        <p style={DESC}>Adjust each team's pulling force. The rope center moves toward the stronger team.</p>
      </div>
      <canvas ref={cvs} width={580} height={280} style={{ width: "100%", display: "block" }} />
      <div style={CONCEPT}>
        <strong style={{ color: "#93c5fd" }}>Key Concept:</strong>{" "}
        F<sub>net</sub> = F<sub>A</sub> − F<sub>B</sub>. Equal forces → rope stays put (balanced).
        Unequal forces → rope accelerates toward the stronger team (unbalanced). This is Newton's 1st and 2nd Law combined.
      </div>
      <div style={CTRLS}>
        <div style={SLIDER_WRAP}>
          <span style={{ fontSize: 11, color: C.left }}>Team A Pull: {fa} N</span>
          <input type="range" min={100} max={600} value={fa}
                 onChange={e => setFa(+e.target.value)} style={{ accentColor: C.left }} />
        </div>
        <div style={SLIDER_WRAP}>
          <span style={{ fontSize: 11, color: C.right }}>Team B Pull: {fb} N</span>
          <input type="range" min={100} max={600} value={fb}
                 onChange={e => setFb(+e.target.value)} style={{ accentColor: C.right }} />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * SIMULATION 5 — Breaking Equilibrium
 * Physics: Block at rest with balanced push forces; increase one to break balance
 * Learning: Equilibrium is fragile — even small imbalance creates acceleration
 * ══════════════════════════════════════════════════════════════════ */
export function Pro1_EquilBreaker() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const st  = useRef({ x: 250, v: 0 });
  const [extra, setExtra] = useState(0); // extra force on right (breaks equilibrium)
  const eRef = useRef(extra);
  useEffect(() => { eRef.current = extra; }, [extra]);

  useEffect(() => {
    const cv = cvs.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const W = cv.width, H = cv.height;
    const BASE = 40, MASS = 6, MU = 0.08, G = 9.8;
    const BW = 60, BH = 40, BY = H - 80;
    st.current = { x: W / 2 - BW / 2, v: 0 };
    let last = performance.now();

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 1 / 30); last = now;
      const s = st.current;
      const extra = eRef.current;
      const fR = BASE + extra, fL = BASE;
      const fNet = fR - fL; // = extra
      const fFr = MU * MASS * G;
      let a = 0;
      if (Math.abs(s.v) < 0.01 && fNet <= fFr) { s.v = 0; }
      else { a = (fNet - fFr * Math.sign(s.v || 1)) / MASS; }
      s.v += a * dt;
      s.x += s.v * dt * 80;
      if (s.x > W - BW - 10) { s.x = W - BW - 10; s.v = 0; }
      if (s.x < 10)           { s.x = 10;           s.v = 0; }

      ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
      drawGrid(ctx, W, H);

      // Ground
      ctx.fillStyle = C.surface; ctx.fillRect(0, BY + BH, W, H - BY - BH);
      ctx.fillStyle = C.border;  ctx.fillRect(0, BY + BH, W, 2);

      // Block
      const bx = s.x;
      const balanced = extra <= fFr && Math.abs(s.v) < 0.05;
      const bColor = balanced ? "#1d4ed8" : "#7c3aed";
      const bGrad = ctx.createLinearGradient(bx, BY, bx, BY+BH);
      bGrad.addColorStop(0, balanced ? "#3b82f6" : "#8b5cf6");
      bGrad.addColorStop(1, bColor);
      ctx.fillStyle = bGrad; rRect(ctx, bx, BY, BW, BH, 7); ctx.fill();
      txt(ctx, `${MASS}kg`, bx + BW / 2, BY + BH / 2, "#fff", 11);

      // Force arrows
      const cx = bx + BW / 2, cy = BY + BH / 2;
      arrow(ctx, cx, cy, cx - BASE * 1.2, cy, "#94a3b8", 2.5, `${BASE}N`);
      arrow(ctx, cx, cy, cx + fR * 1.2, cy, extra > 0 ? C.right : "#94a3b8", 2.5,
            extra > 0 ? `${BASE}+${extra}N` : `${BASE}N`);
      if (fNet > 0)
        arrow(ctx, cx, BY - 20, cx + fNet * 1.5, BY - 20, C.net, 3, `Fnet=${fNet}N`);

      // Status banner
      ctx.fillStyle = balanced ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)";
      ctx.strokeStyle = balanced ? "#22c55e" : "#f59e0b";
      ctx.lineWidth = 1.5;
      rRect(ctx, W/2 - 100, 12, 200, 30, 8); ctx.fill();
      rRect(ctx, W/2 - 100, 12, 200, 30, 8); ctx.stroke();
      txt(ctx, balanced ? "⚖️  EQUILIBRIUM — No Acceleration" : `⚡ UNBALANCED! a = ${a.toFixed(2)} m/s²`,
          W / 2, 27, balanced ? "#22c55e" : "#f59e0b", 11);

      txt(ctx, `v = ${s.v.toFixed(2)} m/s`, W - 10, H - 15, C.textDim, 10, "right");

      raf.current = requestAnimationFrame(frame);
    }
    raf.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <div style={WRAP}>
      <div style={HEAD}>
        <h3 style={TITLE}>💥 Breaking Equilibrium — The Tipping Point</h3>
        <p style={DESC}>Both sides start with equal 40N force. Add extra force to the right side to break equilibrium.</p>
      </div>
      <canvas ref={cvs} width={580} height={250} style={{ width: "100%", display: "block" }} />
      <div style={CONCEPT}>
        <strong style={{ color: "#93c5fd" }}>Key Concept:</strong>{" "}
        When an extra force tips the balance, the block starts accelerating.
        Even a tiny net force causes acceleration — equilibrium requires <em>exactly</em> zero net force.
      </div>
      <div style={CTRLS}>
        <div style={SLIDER_WRAP}>
          <span style={{ fontSize: 11, color: C.net }}>Extra Force (right side): +{extra} N (base = 40 N each side)</span>
          <input type="range" min={0} max={80} value={extra}
                 onChange={e => { setExtra(+e.target.value); st.current = { x: 250, v: 0 }; }}
                 style={{ accentColor: C.net }} />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * SIMULATION 6 — 2D Force Vectors & Parallelogram Law
 * Physics: R = √(F1² + F2² + 2F1·F2·cosθ), direction = atan2
 * Learning: Forces add as vectors — the resultant is the actual net force
 * ══════════════════════════════════════════════════════════════════ */
export function Pro1_ForceVectors2D() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const [f1, setF1] = useState(80);
  const [f2, setF2] = useState(60);
  const [ang, setAng] = useState(60); // angle between forces in degrees
  const rr = useRef({ f1, f2, ang });
  useEffect(() => { rr.current = { f1, f2, ang }; }, [f1, f2, ang]);

  useEffect(() => {
    const cv = cvs.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const W = cv.width, H = cv.height;
    let t = 0, last = performance.now();

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 1/30); last = now; t += dt;
      const { f1, f2, ang } = rr.current;
      const θ = (ang * Math.PI) / 180;

      // Resultant via parallelogram law
      const R = Math.sqrt(f1*f1 + f2*f2 + 2*f1*f2*Math.cos(θ));
      // Direction of resultant (angle from F1)
      const α = Math.atan2(f2*Math.sin(θ), f1 + f2*Math.cos(θ));

      ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
      drawGrid(ctx, W, H);

      const ox = W / 2 - 60, oy = H / 2 + 30; // origin
      const SCALE = 1.4;

      // Draw origin dot
      ctx.fillStyle = "#e2e8f0";
      ctx.beginPath(); ctx.arc(ox, oy, 5, 0, Math.PI*2); ctx.fill();
      txt(ctx, "O", ox - 14, oy, C.textDim, 11);

      // F1 vector (0° — horizontal right)
      const f1x = ox + f1 * SCALE, f1y = oy;
      arrow(ctx, ox, oy, f1x, f1y, C.right, 3);
      txt(ctx, `F₁ = ${f1} N`, (ox + f1x)/2, f1y - 18, C.right, 11);

      // F2 vector (at angle θ from F1)
      const f2x = ox + f2 * SCALE * Math.cos(θ);
      const f2y = oy - f2 * SCALE * Math.sin(θ);
      arrow(ctx, ox, oy, f2x, f2y, C.normal, 3);
      txt(ctx, `F₂ = ${f2} N`, (ox+f2x)/2 - 20, (oy+f2y)/2 - 12, C.normal, 11);

      // Parallelogram dashed sides
      const Rx = ox + R * SCALE * Math.cos(α);
      const Ry = oy - R * SCALE * Math.sin(α);
      ctx.save();
      ctx.setLineDash([5, 4]); ctx.strokeStyle = C.textFaint; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(f1x, f1y); ctx.lineTo(Rx, Ry); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(f2x, f2y); ctx.lineTo(Rx, Ry); ctx.stroke();
      ctx.restore();

      // Resultant arrow
      arrow(ctx, ox, oy, Rx, Ry, C.net, 3.5);
      txt(ctx, `R = ${R.toFixed(1)} N`, (ox+Rx)/2 + 8, (oy+Ry)/2 + 14, C.net, 12);

      // Angle arc
      ctx.save(); ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(ox, oy, 28, 0, -θ, true); ctx.stroke();
      txt(ctx, `${ang}°`, ox + 34, oy - 14, C.textDim, 10);
      ctx.restore();

      // Info panel
      ctx.fillStyle = "rgba(7,16,31,0.88)";
      rRect(ctx, 10, 10, 175, 80, 8); ctx.fill();
      ctx.strokeStyle = C.border; ctx.lineWidth = 1;
      rRect(ctx, 10, 10, 175, 80, 8); ctx.stroke();
      txt(ctx, "Parallelogram Law", 97, 26, C.textDim, 10);
      txt(ctx, `F₁ = ${f1} N  |  F₂ = ${f2} N`, 97, 42, C.text, 11);
      txt(ctx, `θ  = ${ang}° between forces`, 97, 57, C.text, 11);
      txt(ctx, `R  = ${R.toFixed(1)} N at ${(α*180/Math.PI).toFixed(1)}° from F₁`, 97, 72, C.net, 11);

      raf.current = requestAnimationFrame(frame);
    }
    raf.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <div style={WRAP}>
      <div style={HEAD}>
        <h3 style={TITLE}>📐 2D Force Vectors — Parallelogram Law</h3>
        <p style={DESC}>Forces are vectors. The resultant (net force) is found by the parallelogram law of vector addition.</p>
      </div>
      <canvas ref={cvs} width={580} height={280} style={{ width: "100%", display: "block" }} />
      <div style={CONCEPT}>
        <strong style={{ color: "#93c5fd" }}>Key Concept:</strong>{" "}
        When two forces act at an angle θ, resultant R = √(F₁² + F₂² + 2F₁F₂cosθ).
        When θ = 0° (same direction) R = F₁+F₂ (maximum). When θ = 180° (opposite) R = |F₁−F₂| (minimum).
      </div>
      <div style={CTRLS}>
        <div style={SLIDER_WRAP}>
          <span style={{ fontSize: 11, color: C.right }}>Force F₁: {f1} N</span>
          <input type="range" min={10} max={120} value={f1} onChange={e => setF1(+e.target.value)} style={{ accentColor: C.right }} />
        </div>
        <div style={SLIDER_WRAP}>
          <span style={{ fontSize: 11, color: C.normal }}>Force F₂: {f2} N</span>
          <input type="range" min={10} max={120} value={f2} onChange={e => setF2(+e.target.value)} style={{ accentColor: C.normal }} />
        </div>
        <div style={SLIDER_WRAP}>
          <span style={{ fontSize: 11, color: C.net }}>Angle θ: {ang}°</span>
          <input type="range" min={0} max={180} value={ang} onChange={e => setAng(+e.target.value)} style={{ accentColor: C.net }} />
        </div>
      </div>
    </div>
  );
}
