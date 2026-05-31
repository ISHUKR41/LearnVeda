"use client";

/**
 * FILE: ForceEngine.tsx
 * PURPOSE: Professional canvas-based physics simulation engine for Force & Laws of Motion.
 *          Renders smooth 60fps animations with real Newtonian mechanics:
 *          - Newton's 2nd Law: F = ma
 *          - Kinetic & static friction: f = μN
 *          - Real-time telemetry overlay (velocity, acceleration, net force, KE)
 *          - Force vector arrows drawn on canvas (no DOM layout issues)
 *          - All animation state in refs → no stale-closure bugs
 */

import React, { useEffect, useRef, useState, useCallback } from "react";

export interface ForceEngineConfig {
  initialMass: number;
  initialVelocity: number;
  frictionCoefficient: number;
  environmentName: string;
  allowUserMassChange?: boolean;
  allowUserForceChange?: boolean;
  presetForceLeft?: number;
  presetForceRight?: number;
  scenarioDescription: string;
}

/* ── Physics state stored in a ref (never triggers re-renders) ─────────────── */
interface PhysicsState {
  x: number;        /* object centre x in metres (0 = start) */
  v: number;        /* velocity m/s */
  a: number;        /* acceleration m/s² */
  lastTime: number; /* DOMHighResTimeStamp of previous frame */
  forceLeft: number;
  forceRight: number;
  mass: number;
  mu: number;
}

/* ── Pixel‑per‑metre scale: 40 px = 1 m ─────────────────────── */
const PX_PER_M = 40;
const GRAVITY  = 9.8;

/** Draws an arrowhead at (x,y) pointing in direction θ (radians). */
function drawArrowHead(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  theta: number,
  size = 10,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(theta);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-size, -size / 2);
  ctx.lineTo(-size,  size / 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export default function ForceEngine({ config }: { config: ForceEngineConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const stateRef  = useRef<PhysicsState>({
    x:         0,
    v:         config.initialVelocity,
    a:         0,
    lastTime:  0,
    forceLeft:  config.presetForceLeft  ?? 0,
    forceRight: config.presetForceRight ?? 0,
    mass:       config.initialMass,
    mu:         config.frictionCoefficient,
  });

  /* ── UI sliders (only affect stateRef, NOT re-render physics) ──────── */
  const [mass,       setMass]       = useState(config.initialMass);
  const [forceLeft,  setForceLeft]  = useState(config.presetForceLeft  ?? 0);
  const [forceRight, setForceRight] = useState(config.presetForceRight ?? 0);
  const [isPlaying,  setIsPlaying]  = useState(false);

  /* ── Display telemetry (updated each frame via setState) ────────────── */
  const [tele, setTele] = useState({ v: config.initialVelocity, a: 0, netF: 0, ke: 0 });

  /* Propagate slider changes into the physics ref immediately */
  useEffect(() => { stateRef.current.mass       = mass;       }, [mass]);
  useEffect(() => { stateRef.current.forceLeft  = forceLeft;  }, [forceLeft]);
  useEffect(() => { stateRef.current.forceRight = forceRight; }, [forceRight]);

  /* ── HiDPI canvas setup — run once after mount ──────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    /* Physical pixels based on the CSS 700×220 logical size */
    canvas.width  = 700 * dpr;
    canvas.height = 220 * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  }, []);

  /* ── Canvas renderer (the simulation loop) ─────────────────────────── */
  const render = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const s   = stateRef.current;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const W   = canvas.width  / dpr;
    const H   = canvas.height / dpr;

    /* Physics step ─────────────────────────────────────── */
    if (s.lastTime > 0) {
      const dt = Math.min((timestamp - s.lastTime) / 1000, 0.05); /* cap at 50 ms */

      const fNet      = s.forceRight - s.forceLeft;
      const maxFric   = s.mu * s.mass * GRAVITY;

      let friction = 0;
      if (s.v > 0.01) {
        friction = -maxFric;
      } else if (s.v < -0.01) {
        friction =  maxFric;
      } else {
        /* Static friction: exactly opposes net applied force up to maxFric */
        friction = Math.abs(fNet) <= maxFric ? -fNet : (fNet > 0 ? -maxFric : maxFric);
      }

      const totalForce = fNet + friction;
      s.a = totalForce / s.mass;
      s.v += s.a * dt;

      /* Snap to zero if nearly still and net force is balanced */
      if (Math.abs(s.v) < 0.05 && Math.abs(fNet) <= maxFric) {
        s.v = 0;
        s.a = 0;
      }

      /* Position advance */
      s.x += s.v * dt;

      /* Screen wrap in metres */
      const halfW = (W / 2) / PX_PER_M;
      if (s.x >  halfW + 1) s.x = -halfW - 1;
      if (s.x < -halfW - 1) s.x =  halfW + 1;

      /* Update telemetry display (throttled via setState — safe, separate from physics) */
      const ke = 0.5 * s.mass * s.v * s.v;
      setTele({ v: s.v, a: s.a, netF: totalForce, ke });
    }
    s.lastTime = timestamp;

    /* ── Draw ────────────────────────────────────────────── */
    /* Background */
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, W, H);

    /* Grid lines */
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 1;
    const gridSpacing = 40;
    for (let gx = 0; gx < W; gx += gridSpacing) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
    }
    for (let gy = 0; gy < H; gy += gridSpacing) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
    }

    /* Ground surface */
    const groundY = H - 56;
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, groundY, W, 56);

    /* Surface texture lines */
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    for (let tx = 0; tx < W; tx += 20) {
      ctx.beginPath();
      ctx.moveTo(tx, groundY);
      ctx.lineTo(tx - 10, groundY + 20);
      ctx.stroke();
    }

    /* Surface label */
    ctx.fillStyle = "#475569";
    ctx.font = "bold 11px 'JetBrains Mono', monospace";
    ctx.textAlign = "left";
    ctx.fillText(`μ = ${config.frictionCoefficient} · ${config.environmentName}`, 12, groundY + 22);

    /* Object (block) */
    const blockW = 80;
    const blockH = 56;
    const cx     = W / 2 + s.x * PX_PER_M; /* object centre x in pixels */
    const blockX = cx - blockW / 2;
    const blockY = groundY - blockH;

    /* Block shadow */
    ctx.fillStyle = "rgba(99,102,241,0.15)";
    ctx.beginPath();
    ctx.ellipse(cx, groundY + 4, blockW / 2, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    /* Block body with gradient */
    const grad = ctx.createLinearGradient(blockX, blockY, blockX, blockY + blockH);
    grad.addColorStop(0, "#6366f1");
    grad.addColorStop(1, "#4338ca");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(blockX, blockY, blockW, blockH, 10);
    ctx.fill();

    /* Block highlight */
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.beginPath();
    ctx.roundRect(blockX + 6, blockY + 5, blockW - 12, 14, 5);
    ctx.fill();

    /* Block border */
    ctx.strokeStyle = "#818cf8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(blockX, blockY, blockW, blockH, 10);
    ctx.stroke();

    /* Mass label on block */
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${s.mass} kg`, cx, blockY + blockH / 2 + 6);

    /* ── Force arrows ────────────────────────────────────── */
    const arrowY = blockY + blockH / 2;

    /* Right force arrow (green) */
    if (s.forceRight > 0) {
      const arrowLen = Math.min(s.forceRight * 0.8, 140);
      const ax       = cx + blockW / 2;
      const bx       = ax + arrowLen;

      ctx.strokeStyle = "#10b981";
      ctx.lineWidth   = 3;
      ctx.beginPath(); ctx.moveTo(ax, arrowY); ctx.lineTo(bx - 2, arrowY); ctx.stroke();
      ctx.fillStyle = "#10b981";
      drawArrowHead(ctx, bx, arrowY, 0);

      ctx.font = "bold 12px 'JetBrains Mono', monospace";
      ctx.textAlign = "left";
      ctx.fillText(`${s.forceRight} N →`, bx + 4, arrowY + 4);
    }

    /* Left force arrow (red) */
    if (s.forceLeft > 0) {
      const arrowLen = Math.min(s.forceLeft * 0.8, 140);
      const ax       = cx - blockW / 2;
      const bx       = ax - arrowLen;

      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth   = 3;
      ctx.beginPath(); ctx.moveTo(ax, arrowY); ctx.lineTo(bx + 2, arrowY); ctx.stroke();
      ctx.fillStyle = "#ef4444";
      drawArrowHead(ctx, bx, arrowY, Math.PI);

      ctx.font = "bold 12px 'JetBrains Mono', monospace";
      ctx.textAlign = "right";
      ctx.fillText(`← ${s.forceLeft} N`, bx - 4, arrowY + 4);
    }

    /* Velocity vector (cyan, above block) */
    if (Math.abs(s.v) > 0.1) {
      const vScale = Math.min(Math.abs(s.v) * 8, 100);
      const dir    = s.v > 0 ? 1 : -1;
      const vy     = blockY - 20;

      ctx.strokeStyle = "#22d3ee";
      ctx.lineWidth   = 2;
      ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(cx, vy); ctx.lineTo(cx + dir * vScale, vy); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#22d3ee";
      drawArrowHead(ctx, cx + dir * (vScale + 2), vy, dir > 0 ? 0 : Math.PI, 8);

      ctx.font = "bold 11px 'JetBrains Mono', monospace";
      ctx.textAlign = dir > 0 ? "left" : "right";
      ctx.fillStyle = "#22d3ee";
      ctx.fillText(`v = ${Math.abs(s.v).toFixed(1)} m/s`, cx + dir * (vScale + 16), vy + 4);
    }

    /* Centre line (reference) */
    ctx.strokeStyle = "#1e3a5f";
    ctx.lineWidth   = 1;
    ctx.setLineDash([6, 4]);
    ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, groundY); ctx.stroke();
    ctx.setLineDash([]);

    rafRef.current = requestAnimationFrame(render);
  }, []); /* stable — all state accessed via refs */

  /* ── Animation lifecycle ────────────────────────────────────────────── */
  useEffect(() => {
    if (isPlaying) {
      stateRef.current.lastTime = 0;
      rafRef.current = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(rafRef.current);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, render]);

  /* Draw one static frame when paused so canvas isn't blank */
  useEffect(() => {
    if (!isPlaying) {
      const canvas = canvasRef.current;
      if (canvas) render(performance.now());
      cancelAnimationFrame(rafRef.current);
    }
  }, [isPlaying, render]);

  const handleReset = () => {
    setIsPlaying(false);
    cancelAnimationFrame(rafRef.current);
    const newMass      = config.initialMass;
    const newFL        = config.presetForceLeft  ?? 0;
    const newFR        = config.presetForceRight ?? 0;
    stateRef.current   = { x: 0, v: config.initialVelocity, a: 0, lastTime: 0, forceLeft: newFL, forceRight: newFR, mass: newMass, mu: config.frictionCoefficient };
    setMass(newMass);
    setForceLeft(newFL);
    setForceRight(newFR);
    setTele({ v: config.initialVelocity, a: 0, netF: 0, ke: 0 });
  };

  /* ── Label style helpers ─────────────────────────────────────────── */
  const card: React.CSSProperties  = { background: "#0b1120", borderRadius: 18, padding: "24px 28px", margin: "32px 0", border: "1px solid #1e293b", boxShadow: "0 12px 40px rgba(0,0,0,0.5)", fontFamily: "Inter, system-ui, sans-serif" };
  const tRow: React.CSSProperties  = { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, marginBottom: 8 };
  const tVal: React.CSSProperties  = { fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 15 };
  const bar : React.CSSProperties  = { height: 4, borderRadius: 2, background: "#1e293b", overflow: "hidden", marginBottom: 14 };
  const slRow: React.CSSProperties = { marginBottom: 16 };
  const slLbl: React.CSSProperties = { display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 6 };

  return (
    <div style={card}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #1e293b", paddingBottom: 16, marginBottom: 20 }}>
        <h3 style={{ color: "#f1f5f9", fontSize: 20, fontWeight: 800, margin: 0, letterSpacing: -0.3 }}>
          ⚡ Physics Sandbox — {config.environmentName}
        </h3>
        <p style={{ color: "#64748b", fontSize: 13, margin: "6px 0 0", lineHeight: 1.6 }}>
          {config.scenarioDescription}
        </p>
      </div>

      {/* Canvas viewport */}
      <canvas
        ref={canvasRef}
        width={700}
        height={220}
        style={{ width: "100%", borderRadius: 12, border: "1px solid #1e293b", display: "block" }}
      />

      {/* Telemetry + Controls row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>

        {/* Telemetry panel */}
        <div style={{ background: "#0f172a", borderRadius: 14, padding: 18, border: "1px solid #1e293b" }}>
          <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, marginBottom: 14 }}>Live Telemetry</div>

          <div style={tRow}>
            <span style={{ color: "#94a3b8" }}>Velocity</span>
            <span style={{ ...tVal, color: "#22d3ee" }}>{tele.v.toFixed(2)} m/s</span>
          </div>
          <div style={bar}><div style={{ height: "100%", borderRadius: 2, background: "#22d3ee", width: `${Math.min(Math.abs(tele.v) * 4, 100)}%`, transition: "width .1s" }} /></div>

          <div style={tRow}>
            <span style={{ color: "#94a3b8" }}>Acceleration</span>
            <span style={{ ...tVal, color: "#f59e0b" }}>{tele.a.toFixed(2)} m/s²</span>
          </div>
          <div style={bar}><div style={{ height: "100%", borderRadius: 2, background: "#f59e0b", width: `${Math.min(Math.abs(tele.a) * 8, 100)}%`, transition: "width .1s" }} /></div>

          <div style={tRow}>
            <span style={{ color: "#94a3b8" }}>Net Force</span>
            <span style={{ ...tVal, color: "#a78bfa" }}>{tele.netF.toFixed(1)} N</span>
          </div>
          <div style={bar}><div style={{ height: "100%", borderRadius: 2, background: "#a78bfa", width: `${Math.min(Math.abs(tele.netF) * 1.2, 100)}%`, transition: "width .1s" }} /></div>

          <div style={tRow}>
            <span style={{ color: "#94a3b8" }}>Kinetic Energy</span>
            <span style={{ ...tVal, color: "#10b981" }}>{tele.ke.toFixed(1)} J</span>
          </div>

          <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #1e293b", fontSize: 11, color: "#334155" }}>
            F = ma · μ = {config.frictionCoefficient} · g = 9.8 m/s²
          </div>
        </div>

        {/* Sliders panel */}
        <div style={{ background: "#0f172a", borderRadius: 14, padding: 18, border: "1px solid #1e293b" }}>
          <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, marginBottom: 14 }}>Controls</div>

          {config.allowUserForceChange !== false && (
            <>
              <div style={slRow}>
                <div style={slLbl}>
                  <span style={{ color: "#ef4444" }}>← Push Left</span>
                  <span style={{ color: "#ef4444", fontFamily: "monospace" }}>{forceLeft} N</span>
                </div>
                <input type="range" min={0} max={200} value={forceLeft} onChange={(e) => setForceLeft(Number(e.target.value))} style={{ width: "100%", accentColor: "#ef4444" }} />
              </div>

              <div style={slRow}>
                <div style={slLbl}>
                  <span style={{ color: "#10b981" }}>Push Right →</span>
                  <span style={{ color: "#10b981", fontFamily: "monospace" }}>{forceRight} N</span>
                </div>
                <input type="range" min={0} max={200} value={forceRight} onChange={(e) => setForceRight(Number(e.target.value))} style={{ width: "100%", accentColor: "#10b981" }} />
              </div>
            </>
          )}

          {config.allowUserMassChange !== false && (
            <div style={slRow}>
              <div style={slLbl}>
                <span style={{ color: "#818cf8" }}>Mass</span>
                <span style={{ color: "#818cf8", fontFamily: "monospace" }}>{mass} kg</span>
              </div>
              <input type="range" min={1} max={100} value={mass} onChange={(e) => setMass(Number(e.target.value))} style={{ width: "100%", accentColor: "#818cf8" }} />
            </div>
          )}

          {/* Play/Pause + Reset buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{ flex: 1, padding: "11px 0", borderRadius: 10, fontWeight: 800, fontSize: 13, border: "none", cursor: "pointer", background: isPlaying ? "rgba(239,68,68,0.15)" : "#10b981", color: isPlaying ? "#ef4444" : "#0f172a", boxShadow: isPlaying ? "none" : "0 0 18px rgba(16,185,129,0.35)", transition: "all .15s" }}
            >
              {isPlaying ? "⏸ PAUSE" : "▶ RUN"}
            </button>
            <button
              onClick={handleReset}
              style={{ padding: "11px 20px", borderRadius: 10, fontWeight: 700, fontSize: 13, border: "1px solid #334155", cursor: "pointer", background: "#1e293b", color: "#94a3b8", transition: "all .15s" }}
            >
              ↺ RESET
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
