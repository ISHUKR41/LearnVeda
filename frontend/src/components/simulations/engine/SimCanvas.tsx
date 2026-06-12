"use client";
/**
 * FILE: SimCanvas.tsx
 * PURPOSE: Professional, animated physics simulation canvas for LearnVeda.
 *
 * Supports three rendering/physics modes:
 *   "force"     — A single block on a surface with configurable left/right forces + friction.
 *                 Demonstrates balanced/unbalanced forces, Newton's 1st and 2nd laws.
 *   "collision" — Two blocks that can collide (elastic or inelastic).
 *                 Demonstrates Newton's 3rd law and momentum conservation.
 *   "tugofwar"  — Two teams pulling a rope at its centre.
 *                 Demonstrates balanced vs unbalanced forces visually.
 *
 * Environments (each gets a unique visual look and its own friction coefficient):
 *   "ice" | "wood" | "space" | "concrete" | "sand" | "rubber" | "steel" | "water"
 *
 * Usage:
 *   <SimCanvas config={{ title, desc, concept, mode, env, mass, ... }} />
 */

import React, {
  useRef, useEffect, useCallback, useState,
} from "react";

/* ═══════════════════════════════════════════════════════════════════
 * TYPES
 * ═══════════════════════════════════════════════════════════════════ */

export type EnvType  = "ice" | "wood" | "space" | "concrete" | "sand" | "rubber" | "steel" | "water";
export type ModeType = "force" | "collision" | "tugofwar";

export interface SimCanvasConfig {
  /* ── Labels ── */
  title:   string;
  desc:    string;
  concept: string;   // key physics principle shown in a callout box

  /* ── Physics mode and environment ── */
  mode: ModeType;
  env:  EnvType;

  /* ── Force mode ── */
  mass:            number;   // kg, primary block
  initForceLeft?:  number;   // N, initial left-side applied force
  initForceRight?: number;   // N, initial right-side applied force
  initVelocity?:   number;   // m/s, initial velocity (positive = rightward)
  maxForce?:       number;   // slider max (default 100)

  /* ── Collision mode ── */
  mass2?:         number;   // kg, second block
  initVelocity2?: number;   // m/s, second block (positive = rightward)
  collisionType?: "elastic" | "inelastic";

  /* ── Tug-of-war mode ── */
  teamA?: number;   // N (Team A force, pulls rope rightward)
  teamB?: number;   // N (Team B force, pulls rope leftward)

  /* ── UI controls ── */
  allowForceChange?: boolean;
  allowMassChange?:  boolean;

  /* ── Visual ── */
  blockColor?:  [string, string];   // gradient [from, to] for block 1
  block2Color?: [string, string];   // gradient for block 2
}

/* ═══════════════════════════════════════════════════════════════════
 * ENVIRONMENT DATA
 * ═══════════════════════════════════════════════════════════════════ */

interface EnvData {
  mu:   number;          // kinetic friction coefficient
  mus:  number;          // static friction coefficient
  name: string;          // display name
  bg1:  string;          // background gradient top colour
  bg2:  string;          // background gradient bottom colour
  surf: string | null;   // surface fill (null = no ground, i.e. space)
  line: string | null;   // surface highlight line colour
}

const ENVS: Record<EnvType, EnvData> = {
  ice:      { mu:0.02, mus:0.03, name:"Ice Surface",    bg1:"#0a1628", bg2:"#051018", surf:"#1e3a5f", line:"#60a5fa" },
  wood:     { mu:0.35, mus:0.40, name:"Wooden Floor",   bg1:"#160d06", bg2:"#0d0803", surf:"#78350f", line:"#d97706" },
  space:    { mu:0.00, mus:0.00, name:"Deep Space",     bg1:"#020617", bg2:"#020617", surf:null,      line:null      },
  concrete: { mu:0.65, mus:0.75, name:"Concrete Floor", bg1:"#0f0f0f", bg2:"#080808", surf:"#374151", line:"#6b7280" },
  sand:     { mu:0.40, mus:0.50, name:"Sandy Ground",   bg1:"#1c1000", bg2:"#120b00", surf:"#92400e", line:"#ca8a04" },
  rubber:   { mu:0.80, mus:0.90, name:"Rubber Mat",     bg1:"#090909", bg2:"#060606", surf:"#111827", line:"#374151" },
  steel:    { mu:0.15, mus:0.20, name:"Steel Surface",  bg1:"#0a1020", bg2:"#060f1a", surf:"#1e293b", line:"#475569" },
  water:    { mu:0.08, mus:0.10, name:"Water Surface",  bg1:"#001a33", bg2:"#001224", surf:"#1e40af", line:"#60a5fa" },
};

/* ═══════════════════════════════════════════════════════════════════
 * PHYSICS CONSTANTS
 * ═══════════════════════════════════════════════════════════════════ */

const G    = 9.8;    // gravitational acceleration m/s²
const DT   = 1/60;  // physics timestep  (s)
const SCALE = 75;   // pixels per metre of displacement

/* ═══════════════════════════════════════════════════════════════════
 * CANVAS HELPERS
 * ═══════════════════════════════════════════════════════════════════ */

/** Draw an arrow from (x,y) in direction (dx,dy) with a labelled arrowhead. */
function drawArrow(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  dx: number, dy: number,
  color: string,
  label?: string,
  lineWidth = 2.5,
) {
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 4) return;

  const ux = dx / len, uy = dy / len;
  const headLen = Math.min(13, len * 0.4);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle   = color;
  ctx.lineWidth   = lineWidth;
  ctx.lineCap     = "round";

  /* Shaft */
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + dx, y + dy);
  ctx.stroke();

  /* Arrowhead */
  ctx.beginPath();
  ctx.moveTo(x + dx, y + dy);
  ctx.lineTo(x + dx - headLen * (ux - 0.42 * uy), y + dy - headLen * (uy + 0.42 * ux));
  ctx.lineTo(x + dx - headLen * (ux + 0.42 * uy), y + dy - headLen * (uy - 0.42 * ux));
  ctx.closePath();
  ctx.fill();

  /* Label (offset in arrow direction) */
  if (label) {
    ctx.font         = "bold 11px 'JetBrains Mono', monospace";
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x + dx + ux * 22, y + dy + uy * 16);
  }
  ctx.restore();
}

/** Draw a filled, rounded rectangle (polyfill for older TS types). */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  w: number, h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/** Generate a static star field (called once per canvas). */
function makeStars(n: number, W: number, H: number) {
  return Array.from({ length: n }, () => ({
    x: Math.random() * W,
    y: Math.random() * H * 0.85,
    r: Math.random() * 1.4 + 0.3,
    phase: Math.random() * Math.PI * 2,
  }));
}

/* ═══════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════════ */

export default function SimCanvas({ config }: { config: SimCanvasConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);

  /* Mutable physics state kept in a ref — NOT React state — for perf */
  const phys = useRef({
    /* Force / inertia mode */
    x:  0,    // block pixel offset from centre
    v:  0,    // velocity m/s
    /* Collision mode */
    x1: 0, v1: 0,
    x2: 0, v2: 0,
    collided: false,
    separateTimer: 0,
    /* Tug-of-war mode */
    ropeOff: 0,  // pixel offset of the knot from centre
    ropeV:   0,
    /* Time counter */
    t: 0,
  });

  /* React state (sliders, play/pause, reset token) */
  /* Auto-start: running = true so simulations play immediately when scrolled into view */
  const [running, setRunning] = useState(true);
  const [resetTok, setResetTok] = useState(0);
  const [fLeft,  setFLeft ] = useState(config.initForceLeft  ?? 0);
  const [fRight, setFRight] = useState(config.initForceRight ?? 0);
  const [mass,   setMass  ] = useState(config.mass);

  /* Refs that mirror slider state so animation loop always reads current values */
  const fLeftRef  = useRef(fLeft);
  const fRightRef = useRef(fRight);
  const massRef   = useRef(mass);
  useEffect(() => { fLeftRef.current  = fLeft;  }, [fLeft]);
  useEffect(() => { fRightRef.current = fRight; }, [fRight]);
  useEffect(() => { massRef.current   = mass;   }, [mass]);

  /* Stars for space environment (generated once) */
  const starsRef = useRef<ReturnType<typeof makeStars>>([]);

  /* ── Environment constants ── */
  const env   = ENVS[config.env];
  const bCol  = config.blockColor  ?? ["#4f46e5", "#7c3aed"];
  const b2Col = config.block2Color ?? ["#d97706", "#b45309"];

  /* ── Reset physics state ── */
  const resetPhys = useCallback(() => {
    const s = phys.current;
    s.t = 0;
    if (config.mode === "force") {
      s.x = 0;
      s.v = config.initVelocity ?? 0;
    } else if (config.mode === "collision") {
      s.x1 = -(SCALE * 2.8);
      s.x2 =  (SCALE * 2.8);
      s.v1 = config.initVelocity  ??  3;
      s.v2 = config.initVelocity2 ?? -1;
      s.collided = false;
      s.separateTimer = 0;
    } else if (config.mode === "tugofwar") {
      s.ropeOff = 0;
      s.ropeV   = 0;
    }
  }, [config]);

  useEffect(() => {
    resetPhys();
    setRunning(false);
    starsRef.current = [];
  }, [resetTok, resetPhys]);

  /* ══════════════════════════════════════════════════════════════════
   * DRAW
   * ══════════════════════════════════════════════════════════════════ */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    /* HiDPI resize */
    const dpr  = window.devicePixelRatio || 1;
    const cssW = canvas.clientWidth  || 580;
    const cssH = canvas.clientHeight || 230;
    if (canvas.width !== cssW * dpr || canvas.height !== cssH * dpr) {
      canvas.width  = cssW * dpr;
      canvas.height = cssH * dpr;
      starsRef.current = [];  // regenerate stars on resize
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const W = cssW, H = cssH;
    const cx = W / 2;
    const groundY = H - 52;  // y-coordinate of the ground surface
    const s = phys.current;

    /* ── Background ──────────────────────────────────────── */
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, env.bg1);
    bg.addColorStop(1, env.bg2);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* ── Stars (space only) ──────────────────────────────── */
    if (config.env === "space") {
      if (!starsRef.current.length) starsRef.current = makeStars(90, W, H);
      starsRef.current.forEach(st => {
        const a = 0.3 + 0.7 * Math.abs(Math.sin(st.phase + s.t * 0.7));
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a.toFixed(2)})`;
        ctx.fill();
      });
    }

    /* ── Ground surface ──────────────────────────────────── */
    if (env.surf) {
      ctx.fillStyle = env.surf;
      ctx.fillRect(0, groundY, W, H - groundY);

      /* Environment-specific surface textures */
      if (config.env === "wood") {
        ctx.strokeStyle = "rgba(180,110,40,0.22)";
        ctx.lineWidth = 1;
        for (let gx = 0; gx < W; gx += 20) {
          ctx.beginPath(); ctx.moveTo(gx, groundY); ctx.lineTo(gx, H); ctx.stroke();
        }
      } else if (config.env === "concrete") {
        ctx.strokeStyle = "rgba(100,100,100,0.18)";
        ctx.lineWidth = 0.8;
        for (let gy = groundY + 10; gy < H; gy += 12) {
          ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
        }
        for (let gx = 0; gx < W; gx += 32) {
          ctx.beginPath(); ctx.moveTo(gx, groundY); ctx.lineTo(gx, H); ctx.stroke();
        }
      } else if (config.env === "sand") {
        ctx.fillStyle = "rgba(202,138,4,0.18)";
        for (let i = 0; i < 18; i++) {
          ctx.beginPath();
          ctx.arc((i * 43 + 15) % W, groundY + 8, 5, 0, Math.PI);
          ctx.fill();
        }
      } else if (config.env === "rubber") {
        ctx.strokeStyle = "rgba(80,80,80,0.45)";
        ctx.lineWidth = 2.5;
        for (let gx = 0; gx < W; gx += 13) {
          ctx.beginPath(); ctx.moveTo(gx, groundY); ctx.lineTo(gx, H); ctx.stroke();
        }
      } else if (config.env === "steel") {
        const sheen = ctx.createLinearGradient(0, groundY, W, groundY + 18);
        sheen.addColorStop(0,   "rgba(148,163,184,0.05)");
        sheen.addColorStop(0.5, "rgba(148,163,184,0.22)");
        sheen.addColorStop(1,   "rgba(148,163,184,0.05)");
        ctx.fillStyle = sheen;
        ctx.fillRect(0, groundY, W, 18);
      } else if (config.env === "water") {
        ctx.strokeStyle = "rgba(96,165,250,0.45)";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        for (let wx = 0; wx <= W; wx += 4) {
          const wy = groundY + Math.sin(wx * 0.05 + s.t * 2.5) * 3.5;
          wx === 0 ? ctx.moveTo(wx, wy) : ctx.lineTo(wx, wy);
        }
        ctx.stroke();
      } else if (config.env === "ice") {
        /* Ice crystals */
        ctx.strokeStyle = "rgba(147,197,253,0.28)";
        ctx.lineWidth = 0.8;
        for (let i = 0; i < 9; i++) {
          const ix = (i * 70 + 18) % W, iy = groundY + 10 + (i % 3) * 10;
          for (let a = 0; a < 6; a++) {
            const ang = (a / 6) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(ix, iy);
            ctx.lineTo(ix + Math.cos(ang) * 7, iy + Math.sin(ang) * 7);
            ctx.stroke();
          }
        }
      }

      /* Surface highlight line */
      if (env.line) {
        ctx.strokeStyle = env.line;
        ctx.lineWidth   = config.env === "ice" ? 2 : 1.5;
        ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(W, groundY); ctx.stroke();
      }
    }

    /* ══════════════════════════════════════════════════════════════
     * MODE: FORCE
     * ══════════════════════════════════════════════════════════════ */
    if (config.mode === "force") {
      const bSz = 56;
      const fl = fLeftRef.current, fr = fRightRef.current, m = massRef.current;

      /* Clamp block within canvas */
      const rawBx = cx + s.x;
      const bx    = Math.max(bSz / 2 + 10, Math.min(W - bSz / 2 - 10, rawBx));
      const by    = groundY - bSz / 2;

      /* Block gradient */
      const g = ctx.createLinearGradient(bx - bSz/2, by - bSz/2, bx + bSz/2, by + bSz/2);
      g.addColorStop(0, bCol[0]);
      g.addColorStop(1, bCol[1]);
      ctx.fillStyle = g;
      roundRect(ctx, bx - bSz/2, by - bSz/2, bSz, bSz, 9);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      /* Mass label */
      ctx.fillStyle    = "#fff";
      ctx.font         = "bold 13px 'Inter', sans-serif";
      ctx.textAlign    = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${m}kg`, bx, by);

      /* ── Force arrows ── */
      const arrowPx = 1.0;  // pixels per Newton
      const maxPx   = 130;

      /* Right (blue) */
      if (fr > 0) {
        const len = Math.min(fr * arrowPx, maxPx);
        drawArrow(ctx, bx + bSz/2, by, len, 0, "#3b82f6", `${fr}N`);
      }
      /* Left (crimson) */
      if (fl > 0) {
        const len = Math.min(fl * arrowPx, maxPx);
        drawArrow(ctx, bx - bSz/2, by, -len, 0, "#ef4444", `${fl}N`);
      }

      /* Friction (amber) — opposes motion */
      if (env.mu > 0) {
        const normalF = m * G;
        const kFric   = env.mu  * normalF;
        const sFric   = env.mus * normalF;
        let fric = 0;
        if (Math.abs(s.v) > 0.01) {
          fric = kFric;
        } else {
          fric = Math.min(Math.abs(fr - fl), sFric);
        }
        if (fric > 0.05) {
          const dir = s.v > 0.01 ? -1 : (s.v < -0.01 ? 1 : (fr >= fl ? -1 : 1));
          const len = Math.min(fric * arrowPx, 80);
          drawArrow(ctx, bx + dir * (bSz/2 + 4), by + 14, dir * len, 0, "#f59e0b", `μ=${env.mu}`);
        }
      }

      /* Normal force (green, upward from top of block) */
      if (config.env !== "space") {
        const nLen = Math.min(m * G * 0.55, 50);
        drawArrow(ctx, bx, by - bSz/2, 0, -nLen, "#10b981", "N");
      }

      /* Weight (red, downward from centre — only label, shaft goes into ground) */
      if (config.env !== "space") {
        const wLen = Math.min(m * G * 0.55, 50);
        drawArrow(ctx, bx, by + bSz/2, 0, wLen * 0.6, "#ef4444", "W");
      }

      /* Velocity arc indicator */
      const spd = Math.abs(s.v);
      if (spd > 0.05) {
        const dir = s.v > 0 ? 1 : -1;
        ctx.strokeStyle = "rgba(251,191,36,0.55)";
        ctx.lineWidth   = 2;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.arc(bx, groundY - 4, 24, Math.PI, Math.PI + dir * Math.PI * Math.min(spd / 6, 1));
        ctx.stroke();
        ctx.setLineDash([]);
      }

      /* ── Telemetry overlay (top-left) ── */
      const netF_applied = fr - fl;
      const kFric2 = env.mu  * m * G;
      const sFric2 = env.mus * m * G;
      let fricForce = 0;
      if (Math.abs(s.v) > 0.01) {
        fricForce = Math.sign(s.v) * kFric2;
      } else {
        fricForce = Math.sign(netF_applied) * Math.min(Math.abs(netF_applied), sFric2);
      }
      const F_net = netF_applied - fricForce;
      const accel = F_net / m;

      ctx.fillStyle = "rgba(0,0,0,0.50)";
      roundRect(ctx, 8, 8, 210, 72, 8); ctx.fill();
      ctx.font      = "11px 'JetBrains Mono', monospace";
      ctx.textAlign = "left"; ctx.textBaseline = "top";

      const fmt = (v: number, d = 1) => (v >= 0 ? " " : "") + v.toFixed(d);
      ctx.fillStyle = "#94a3b8"; ctx.fillText(`F_net  = ${fmt(F_net)} N`,    18, 16);
      ctx.fillStyle = Math.abs(accel) < 0.05 ? "#10b981" : "#a78bfa";
      ctx.fillText(`a      = ${fmt(accel, 2)} m/s²`, 18, 34);
      ctx.fillStyle = Math.abs(s.v) < 0.05 ? "#64748b" : "#60a5fa";
      ctx.fillText(`v      = ${fmt(s.v, 2)} m/s`,  18, 52);
    }

    /* ══════════════════════════════════════════════════════════════
     * MODE: COLLISION
     * ══════════════════════════════════════════════════════════════ */
    else if (config.mode === "collision") {
      const bSz = 52;
      const m1  = massRef.current, m2 = config.mass2 ?? 5;

      const bx1 = cx + s.x1, by1 = groundY - bSz / 2;
      const bx2 = cx + s.x2, by2 = groundY - bSz / 2;

      /* Block 1 */
      const g1 = ctx.createLinearGradient(bx1 - bSz/2, by1 - bSz/2, bx1 + bSz/2, by1 + bSz/2);
      g1.addColorStop(0, bCol[0]); g1.addColorStop(1, bCol[1]);
      ctx.fillStyle = g1;
      roundRect(ctx, bx1 - bSz/2, by1 - bSz/2, bSz, bSz, 9); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.14)"; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.font = "bold 12px 'Inter',sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(`${m1}kg`, bx1, by1);

      /* Block 1 velocity arrow */
      if (Math.abs(s.v1) > 0.05) {
        const len = Math.min(Math.abs(s.v1) * 14, 90);
        drawArrow(ctx, bx1 + (s.v1 > 0 ? bSz/2 : -bSz/2), by1, s.v1 > 0 ? len : -len, 0, "#60a5fa", `${s.v1.toFixed(1)}m/s`);
      }

      /* Block 2 */
      const g2 = ctx.createLinearGradient(bx2 - bSz/2, by2 - bSz/2, bx2 + bSz/2, by2 + bSz/2);
      g2.addColorStop(0, b2Col[0]); g2.addColorStop(1, b2Col[1]);
      ctx.fillStyle = g2;
      roundRect(ctx, bx2 - bSz/2, by2 - bSz/2, bSz, bSz, 9); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.14)"; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(`${m2}kg`, bx2, by2);

      /* Block 2 velocity arrow */
      if (Math.abs(s.v2) > 0.05) {
        const len = Math.min(Math.abs(s.v2) * 14, 90);
        drawArrow(ctx, bx2 + (s.v2 > 0 ? bSz/2 : -bSz/2), by2, s.v2 > 0 ? len : -len, 0, "#f97316", `${s.v2.toFixed(1)}m/s`);
      }

      /* Momentum overlay */
      const p1 = m1 * s.v1, p2 = m2 * s.v2;
      ctx.fillStyle = "rgba(0,0,0,0.50)";
      roundRect(ctx, 8, 8, 225, 72, 8); ctx.fill();
      ctx.font = "11px 'JetBrains Mono',monospace"; ctx.textAlign = "left"; ctx.textBaseline = "top";
      ctx.fillStyle = "#60a5fa";  ctx.fillText(`p₁ = ${p1.toFixed(1)} kg·m/s`, 18, 16);
      ctx.fillStyle = "#fb923c";  ctx.fillText(`p₂ = ${p2.toFixed(1)} kg·m/s`, 18, 34);
      ctx.fillStyle = "#a78bfa";  ctx.fillText(`p_total = ${(p1+p2).toFixed(1)} kg·m/s`, 18, 52);
    }

    /* ══════════════════════════════════════════════════════════════
     * MODE: TUG OF WAR
     * ══════════════════════════════════════════════════════════════ */
    else if (config.mode === "tugofwar") {
      const tA = config.teamA ?? 200, tB = config.teamB ?? 200;
      const ropeY = groundY - 55;
      const knot  = cx + s.ropeOff;

      /* Team A box (left, blue) */
      ctx.fillStyle = "#1e3a5f";
      roundRect(ctx, 10, ropeY - 38, 145, 58, 10); ctx.fill();
      ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = "#93c5fd"; ctx.font = "bold 13px 'Inter',sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("Team A", 82, ropeY - 24);
      ctx.fillStyle = "#60a5fa"; ctx.font = "bold 12px 'JetBrains Mono',monospace";
      ctx.fillText(`${tA} N →`, 82, ropeY - 8);

      /* Team B box (right, red) */
      ctx.fillStyle = "#3f1515";
      roundRect(ctx, W - 155, ropeY - 38, 145, 58, 10); ctx.fill();
      ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = "#fca5a5"; ctx.font = "bold 13px 'Inter',sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("Team B", W - 77, ropeY - 24);
      ctx.fillStyle = "#f87171"; ctx.font = "bold 12px 'JetBrains Mono',monospace";
      ctx.fillText(`← ${tB} N`, W - 77, ropeY - 8);

      /* Rope */
      ctx.strokeStyle = "#a16207"; ctx.lineWidth = 6; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(155, ropeY);
      ctx.lineTo(W - 155, ropeY);
      ctx.stroke();
      /* Rope wraps */
      ctx.strokeStyle = "#ca8a04"; ctx.lineWidth = 1.5;
      for (let rx = 170; rx < W - 170; rx += 18) {
        ctx.beginPath();
        ctx.moveTo(rx, ropeY - 3);
        ctx.lineTo(rx + 8, ropeY + 3);
        ctx.stroke();
      }

      /* Knot (moves) */
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath(); ctx.arc(knot, ropeY, 11, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#92400e"; ctx.lineWidth = 2; ctx.stroke();

      /* Net force label */
      const netF = tA - tB;
      const balanced = Math.abs(netF) < 1;
      ctx.fillStyle = balanced ? "#10b981" : "#f59e0b";
      ctx.font      = "bold 16px 'Inter', sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(
        balanced ? "⚖️  BALANCED  ⚖️" : (netF > 0 ? `Team A Wins! →  (+${netF}N)` : `←  Team B Wins!  (${netF}N)`),
        cx, ropeY - 60,
      );
    }

    /* ── Environment badge (top-right) ── */
    ctx.fillStyle = "rgba(0,0,0,0.40)";
    roundRect(ctx, W - 138, 8, 130, 26, 8); ctx.fill();
    ctx.fillStyle    = env.line ?? "#94a3b8";
    ctx.font         = "bold 11px 'Inter', sans-serif";
    ctx.textAlign    = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(env.name, W - 12, 21);

  }, [config, env, bCol, b2Col]);  // draw re-created when env/config change

  /* ══════════════════════════════════════════════════════════════════
   * PHYSICS UPDATE (called every animation frame)
   * ══════════════════════════════════════════════════════════════════ */
  const update = useCallback(() => {
    const s  = phys.current;
    const fl = fLeftRef.current, fr = fRightRef.current, m = massRef.current;
    s.t += DT;

    /* ── Force mode ── */
    if (config.mode === "force") {
      const normalF    = m * G;
      const kineticF   = env.mu  * normalF;
      const staticMaxF = env.mus * normalF;
      const appliedNet = fr - fl;
      let friction = 0;

      if (Math.abs(s.v) > 0.008) {
        friction = -Math.sign(s.v) * kineticF;
      } else {
        /* Static friction exactly cancels applied until it's overcome */
        if (Math.abs(appliedNet) <= staticMaxF) {
          friction = -appliedNet;
          s.v = 0;
        } else {
          friction = -Math.sign(appliedNet) * staticMaxF;
        }
      }

      const F_net = appliedNet + friction;
      const a     = F_net / m;
      s.v += a * DT;

      /* Stop block if friction would reverse it with no applied force */
      if (Math.abs(s.v) < 0.02 && Math.abs(appliedNet) < 0.01) s.v = 0;

      s.x += s.v * DT * SCALE;

      /* Wrap in space; bounce on all other surfaces */
      const canvas = canvasRef.current;
      const halfW  = (canvas ? canvas.clientWidth : 580) / 2 - 38;
      if (config.env === "space") {
        if (s.x > halfW)  s.x = -halfW;
        if (s.x < -halfW) s.x =  halfW;
      } else {
        if (s.x >  halfW) { s.x =  halfW; s.v = 0; }
        if (s.x < -halfW) { s.x = -halfW; s.v = 0; }
      }
    }

    /* ── Collision mode ── */
    else if (config.mode === "collision") {
      const m1 = m, m2 = config.mass2 ?? 5;

      /* Apply friction */
      if (env.mu > 0) {
        const drag = env.mu * G * DT;
        if (Math.abs(s.v1) > drag) s.v1 -= Math.sign(s.v1) * drag; else s.v1 = 0;
        if (Math.abs(s.v2) > drag) s.v2 -= Math.sign(s.v2) * drag; else s.v2 = 0;
      }

      s.x1 += s.v1 * DT * SCALE;
      s.x2 += s.v2 * DT * SCALE;

      /* Collision detection — trigger when blocks overlap */
      const bSz = 52;
      if (!s.collided && s.separateTimer <= 0 && Math.abs(s.x1 - s.x2) < bSz) {
        s.collided = true;
        s.separateTimer = 30;  // frames before re-triggering

        if (config.collisionType === "inelastic") {
          const vf = (m1 * s.v1 + m2 * s.v2) / (m1 + m2);
          s.v1 = vf; s.v2 = vf;
        } else {
          /* Elastic */
          const v1n = ((m1 - m2) * s.v1 + 2 * m2 * s.v2) / (m1 + m2);
          const v2n = ((m2 - m1) * s.v2 + 2 * m1 * s.v1) / (m1 + m2);
          s.v1 = v1n; s.v2 = v2n;
        }
        /* Nudge blocks apart to prevent sticking */
        const overlap = bSz - Math.abs(s.x1 - s.x2);
        const dir = s.x1 < s.x2 ? -1 : 1;
        s.x1 += dir * overlap / 2;
        s.x2 -= dir * overlap / 2;
      }
      if (s.separateTimer > 0) {
        s.separateTimer--;
        if (s.separateTimer === 0) s.collided = false;
      }

      /* Wall bounce */
      const canvas = canvasRef.current;
      const halfW  = (canvas ? canvas.clientWidth : 580) / 2 - 35;
      if (s.x1 > halfW)  { s.x1 = halfW;  s.v1 = -Math.abs(s.v1); }
      if (s.x1 < -halfW) { s.x1 = -halfW; s.v1 =  Math.abs(s.v1); }
      if (s.x2 > halfW)  { s.x2 = halfW;  s.v2 = -Math.abs(s.v2); }
      if (s.x2 < -halfW) { s.x2 = -halfW; s.v2 =  Math.abs(s.v2); }
    }

    /* ── Tug-of-war mode ── */
    else if (config.mode === "tugofwar") {
      const tA  = config.teamA ?? 200, tB = config.teamB ?? 200;
      const net = tA - tB;
      const acc = net * 0.0003;   // symbolic slow drift
      s.ropeV   += acc;
      s.ropeV   *= 0.97;          // damping
      s.ropeOff += s.ropeV;
      s.ropeOff  = Math.max(-110, Math.min(110, s.ropeOff));
    }
  }, [config, env]);

  /* ══════════════════════════════════════════════════════════════════
   * ANIMATION LOOP
   * ══════════════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (!running) { draw(); return; }
    const loop = () => { update(); draw(); animRef.current = requestAnimationFrame(loop); };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [running, draw, update]);

  /* Initial draw on mount */
  useEffect(() => { draw(); }, [draw]);

  /* Redraw on resize */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [draw]);

  /* ══════════════════════════════════════════════════════════════════
   * TELEMETRY VALUES (for the panel below the canvas)
   * ══════════════════════════════════════════════════════════════════ */
  const s    = phys.current;
  const fl   = fLeft, fr = fRight, m = mass;
  const kF   = env.mu  * m * G;
  const sF   = env.mus * m * G;
  const netA = fr - fl;
  let fric = 0;
  if (Math.abs(s.v) > 0.01) fric = Math.sign(s.v) * kF;
  else fric = Math.sign(netA) * Math.min(Math.abs(netA), sF);
  const F_net = netA - fric;
  const accel = F_net / m;

  const maxF = config.maxForce ?? 100;

  /* ══════════════════════════════════════════════════════════════════
   * RENDER
   * ══════════════════════════════════════════════════════════════════ */
  return (
    <div style={{
      background: "#0b1120", borderRadius: 18, padding: 24, margin: "28px 0",
      border: "1px solid #1e293b", fontFamily: "Inter, sans-serif",
      boxShadow: "0 12px 40px rgba(0,0,0,0.55)",
    }}>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1e293b", paddingBottom: 14, marginBottom: 18 }}>
        <h3 style={{ color: "#f1f5f9", fontSize: 19, fontWeight: 800, margin: 0, letterSpacing: -0.3 }}>
          {config.title}
        </h3>
        <p style={{ color: "#64748b", fontSize: 13.5, margin: "7px 0 0", lineHeight: 1.65 }}>
          {config.desc}
        </p>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          width: "100%", height: 230, display: "block",
          borderRadius: 12, border: "1px solid #1e293b", cursor: "pointer",
        }}
        title="Click to play / pause"
        onClick={() => setRunning(r => !r)}
      />

      {/* Physics concept callout */}
      <div style={{
        background: "#0f172a", border: "1px solid #1e293b", borderLeft: "3px solid #2563eb",
        borderRadius: 8, padding: "10px 16px", margin: "14px 0 12px",
        fontSize: 13, color: "#93c5fd", lineHeight: 1.65,
      }}>
        💡 <strong style={{ color: "#bfdbfe" }}>Key concept: </strong>{config.concept}
      </div>

      {/* Telemetry (force mode only) */}
      {config.mode === "force" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 14 }}>
          {[
            { label: "NET FORCE",  value: `${F_net.toFixed(1)} N`,     color: Math.abs(F_net) < 0.2 ? "#10b981" : "#f59e0b" },
            { label: "FRICTION",   value: `${Math.abs(fric).toFixed(1)} N`, color: "#f97316" },
            { label: "VELOCITY",   value: `${s.v.toFixed(2)} m/s`,     color: Math.abs(s.v) < 0.02 ? "#475569" : "#60a5fa" },
            { label: "ACCEL",      value: `${accel.toFixed(2)} m/s²`,  color: Math.abs(accel) < 0.02 ? "#475569" : "#a78bfa" },
          ].map(it => (
            <div key={it.label} style={{ background: "#0f172a", borderRadius: 10, padding: "8px 10px", border: "1px solid #1e293b" }}>
              <div style={{ fontSize: 9, color: "#475569", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 }}>
                {it.label}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: it.color, fontFamily: "JetBrains Mono, monospace" }}>
                {it.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Controls */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <button
          onClick={() => setRunning(r => !r)}
          style={{
            padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer",
            fontWeight: 700, fontSize: 13, color: "#fff", transition: "background .15s",
            background: running ? "#ef4444" : "#10b981",
          }}
        >
          {running ? "⏸ Pause" : "▶ Play"}
        </button>
        <button
          onClick={() => { setResetTok(t => t + 1); setFLeft(config.initForceLeft ?? 0); setFRight(config.initForceRight ?? 0); setMass(config.mass); }}
          style={{ padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, background: "#1e293b", color: "#94a3b8" }}
        >
          ↺ Reset
        </button>

        {config.allowForceChange && (
          <>
            <div style={{ flex: 1, minWidth: 130 }}>
              <div style={{ fontSize: 11, color: "#475569", marginBottom: 3 }}>
                → Right Force: <strong style={{ color: "#3b82f6" }}>{fRight}N</strong>
              </div>
              <input type="range" min={0} max={maxF} value={fRight}
                onChange={e => setFRight(+e.target.value)} style={{ width: "100%", accentColor: "#3b82f6" }} />
            </div>
            <div style={{ flex: 1, minWidth: 130 }}>
              <div style={{ fontSize: 11, color: "#475569", marginBottom: 3 }}>
                ← Left Force: <strong style={{ color: "#ef4444" }}>{fLeft}N</strong>
              </div>
              <input type="range" min={0} max={maxF} value={fLeft}
                onChange={e => setFLeft(+e.target.value)} style={{ width: "100%", accentColor: "#ef4444" }} />
            </div>
          </>
        )}

        {config.allowMassChange && (
          <div style={{ flex: 1, minWidth: 130 }}>
            <div style={{ fontSize: 11, color: "#475569", marginBottom: 3 }}>
              Mass: <strong style={{ color: "#a78bfa" }}>{mass}kg</strong>
            </div>
            <input type="range" min={1} max={config.mass * 5} value={mass}
              onChange={e => setMass(+e.target.value)} style={{ width: "100%", accentColor: "#a78bfa" }} />
          </div>
        )}

        <span style={{ marginLeft: "auto", fontSize: 11, color: "#334155" }}>
          Click canvas to play / pause
        </span>
      </div>
    </div>
  );
}
