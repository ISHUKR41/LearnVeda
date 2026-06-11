"use client";
/**
 * FILE: UltraGlassSlabLabSim.tsx
 * PURPOSE: Ultra-realistic interactive glass slab laboratory simulation.
 *
 * Features:
 *  – Drag the incident ray to any angle (5°–85°)
 *  – Snell's Law live calculation: n₁ sin(i) = n₂ sin(r)
 *  – Lateral shift formula: d = t × sin(i−r) / cos(r)
 *  – Animated photon ball traveling along the ray path
 *  – Wavefront lines showing the wave bending
 *  – Medium labels: AIR | GLASS | AIR with refractive index badges
 *  – Normal lines at both surfaces (dashed)
 *  – Angle arcs and live degree readouts at both surfaces
 *  – Adjustable glass refractive index (1.3 to 2.0) via slider
 *  – Glass thickness adjustable via slider
 *  – Full dark-mode physics lab aesthetic
 */

import React, { useRef, useEffect, useState, useCallback } from "react";

/* ─── Constants ─────────────────────────────────────────── */
const H_CSS = 480;
const GLASS_COLOR    = "rgba(56, 189, 248, 0.10)";
const GLASS_BORDER   = "rgba(56, 189, 248, 0.55)";
const INCIDENT_COLOR = "#facc15";   /* yellow-400 */
const REFRACT_COLOR  = "#38bdf8";   /* sky-400    */
const EMERGE_COLOR   = "#facc15";   /* same as incident — parallel */
const NORMAL_COLOR   = "rgba(148,163,184,0.45)";
const ARC_COLOR_I    = "#f472b6";   /* pink  */
const ARC_COLOR_R    = "#34d399";   /* green */
const PHOTON_RADIUS  = 7;
const PHOTON_GLOW    = 18;

/* ─── Helper: draw a glowing line ───────────────────────── */
function glowLine(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  color: string, lineWidth: number, blur: number
) {
  ctx.save();
  ctx.shadowColor  = color;
  ctx.shadowBlur   = blur;
  ctx.strokeStyle  = color;
  ctx.lineWidth    = lineWidth;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.restore();
}

/* ─── Helper: draw angle arc with label ─────────────────── */
function drawArc(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  startAngle: number, endAngle: number,
  color: string, label: string
) {
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(cx, cy, r, startAngle, endAngle);
  ctx.stroke();
  const midA = (startAngle + endAngle) / 2;
  const lx   = cx + (r + 18) * Math.cos(midA);
  const ly   = cy + (r + 18) * Math.sin(midA);
  ctx.fillStyle = color; ctx.font = "bold 13px monospace";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(label, lx, ly);
  ctx.restore();
}

export default function UltraGlassSlabLabSim() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const rafRef      = useRef<number>(0);
  const timeRef     = useRef(0);
  const angleRef    = useRef(40);   /* incident angle in degrees */
  const nRef        = useRef(1.5);
  const thickRef    = useRef(0.35); /* fraction of canvas height */

  const [incAngle, setIncAngle] = useState(40);
  const [nGlass,   setNGlass]   = useState(1.5);
  const [thickness, setThick]   = useState(35); /* percentage */

  /* sync refs */
  useEffect(() => { angleRef.current = incAngle; }, [incAngle]);
  useEffect(() => { nRef.current = nGlass; },       [nGlass]);
  useEffect(() => { thickRef.current = thickness / 100; }, [thickness]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W   = canvas.clientWidth  || 700;
    const H   = canvas.clientHeight || H_CSS;
    if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
      canvas.width = W * dpr; canvas.height = H * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    timeRef.current += 0.016;
    const t     = timeRef.current;
    const iDeg  = angleRef.current;
    const iRad  = (iDeg * Math.PI) / 180;
    const n2    = nRef.current;
    const sinR  = Math.sin(iRad) / n2;
    const rRad  = Math.asin(sinR);
    const rDeg  = rRad * 180 / Math.PI;

    /* Glass slab geometry */
    const glassTop    = H * 0.28;
    const glassBot    = glassTop + H * thickRef.current;
    const cx          = W * 0.5;

    /* ── Background ── */
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#030b14"); bg.addColorStop(1, "#050d1a");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    /* Grid */
    ctx.strokeStyle = "rgba(99,102,241,0.05)"; ctx.lineWidth = 0.8;
    for (let x = 0; x < W; x += 50) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 50) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    /* ── Glass slab ── */
    ctx.save();
    ctx.fillStyle   = GLASS_COLOR;
    ctx.strokeStyle = GLASS_BORDER;
    ctx.lineWidth   = 2;
    ctx.shadowColor = "#38bdf8"; ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.rect(W * 0.12, glassTop, W * 0.76, glassBot - glassTop);
    ctx.fill(); ctx.stroke();
    ctx.restore();

    /* Medium labels */
    const c = ctx; /* non-null reference for closures */
    const medLabel = (text: string, x: number, y: number, col: string) => {
      c.save();
      c.fillStyle = col; c.font = "bold 12px sans-serif";
      c.textAlign = "center"; c.textBaseline = "middle";
      c.globalAlpha = 0.7;
      c.fillText(text, x, y);
      c.restore();
    };
    medLabel("AIR  (n = 1.0)",  W * 0.85, glassTop * 0.55,  "#94a3b8");
    medLabel(`GLASS (n = ${n2.toFixed(2)})`, W * 0.85, (glassTop + glassBot) / 2, "#7dd3fc");
    medLabel("AIR  (n = 1.0)",  W * 0.85, glassBot + (H - glassBot) * 0.45, "#94a3b8");

    /* ── Normal lines (dashed) ── */
    const drawNormal = (y: number) => {
      c.save();
      c.setLineDash([8, 5]);
      c.strokeStyle = NORMAL_COLOR; c.lineWidth = 1.4;
      c.beginPath(); c.moveTo(cx, y - 80); c.lineTo(cx, y + 80); c.stroke();
      c.setLineDash([]);
      c.restore();
    };
    drawNormal(glassTop);
    drawNormal(glassBot);

    /* ── Ray geometry ── */
    /* Incident: comes from upper-left */
    const incLen  = glassTop * 0.92;
    const incX0   = cx - incLen * Math.sin(iRad);
    const incY0   = glassTop - incLen * Math.cos(iRad);

    /* Inside glass: refracted */
    const glassDist = glassBot - glassTop;
    const refX1     = cx + glassDist * Math.tan(rRad);
    const refY1     = glassBot;

    /* Emergent: parallel to incident, starts at (refX1, glassBot) */
    const emergeLen = (H - glassBot) * 0.90;
    const emergX2   = refX1 + emergeLen * Math.sin(iRad);
    const emergY2   = glassBot + emergeLen * Math.cos(iRad);

    /* Lateral shift extension line */
    const lsX1 = incX0 + (incLen + glassDist / Math.cos(iRad) + emergeLen) * Math.sin(iRad);
    const lsY1 = incY0 + (incLen + glassDist / Math.cos(iRad) + emergeLen) * Math.cos(iRad);
    /* Dashed line showing where incident ray WOULD have gone */
    ctx.save();
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = "rgba(250,204,21,0.28)"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(cx, glassTop); ctx.lineTo(emergX2, emergY2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    /* ── Draw rays ── */
    glowLine(ctx, incX0, incY0, cx, glassTop, INCIDENT_COLOR, 2.2, 16);
    glowLine(ctx, cx, glassTop, refX1, glassBot, REFRACT_COLOR, 2.2, 14);
    glowLine(ctx, refX1, glassBot, emergX2, emergY2, EMERGE_COLOR, 2.2, 16);

    /* Arrowhead on emergent ray */
    (function arrowHead(x1: number, y1: number, x2: number, y2: number) {
      const ang = Math.atan2(y2 - y1, x2 - x1);
      const a = 10, b = 0.4;
      ctx.save(); ctx.fillStyle = EMERGE_COLOR;
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - a * Math.cos(ang - b), y2 - a * Math.sin(ang - b));
      ctx.lineTo(x2 - a * Math.cos(ang + b), y2 - a * Math.sin(ang + b));
      ctx.closePath(); ctx.fill();
      ctx.restore();
    })(refX1, glassBot, emergX2, emergY2);

    /* ── Wavefronts inside glass ── */
    const nWaves = 5;
    for (let k = 0; k < nWaves; k++) {
      const frac  = ((k / nWaves) + t * 0.25) % 1;
      const wy    = glassTop + frac * glassDist;
      const wx    = cx + (wy - glassTop) * Math.tan(rRad);
      const len   = 40;
      const perX  = -Math.cos(rRad);
      const perY  =  Math.sin(rRad);
      ctx.save();
      ctx.globalAlpha = 0.25 * (1 - frac * 0.6);
      ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(wx - len * perX, wy - len * perY);
      ctx.lineTo(wx + len * perX, wy + len * perY);
      ctx.stroke();
      ctx.restore();
    }

    /* ── Angle arcs at top surface ── */
    /* i: from -π/2 (upward normal) to (iRad - π/2) on the left */
    drawArc(ctx, cx, glassTop, 40,
      -Math.PI / 2 - iRad, -Math.PI / 2,
      ARC_COLOR_I, `${iDeg}°`
    );
    /* r: from -π/2 to -π/2 + rRad on the right */
    drawArc(ctx, cx, glassTop, 35,
      -Math.PI / 2, -Math.PI / 2 + rRad,
      ARC_COLOR_R, `${rDeg.toFixed(1)}°`
    );

    /* ── Animated photon ── */
    /* Path length segments */
    const seg1 = Math.hypot(cx - incX0, glassTop - incY0);
    const seg2 = Math.hypot(refX1 - cx, glassBot - glassTop);
    const seg3 = Math.hypot(emergX2 - refX1, emergY2 - glassBot);
    const total = seg1 + seg2 + seg3;
    const speed = total * 0.28;
    const dist  = ((t * speed) % total + total) % total;

    let px: number, py: number;
    if (dist < seg1) {
      const f = dist / seg1;
      px = incX0 + f * (cx - incX0);
      py = incY0 + f * (glassTop - incY0);
    } else if (dist < seg1 + seg2) {
      const f = (dist - seg1) / seg2;
      px = cx   + f * (refX1 - cx);
      py = glassTop + f * (glassBot - glassTop);
    } else {
      const f = (dist - seg1 - seg2) / seg3;
      px = refX1  + f * (emergX2 - refX1);
      py = glassBot + f * (emergY2 - glassBot);
    }

    /* Photon glow */
    const grad = ctx.createRadialGradient(px, py, 0, px, py, PHOTON_GLOW);
    grad.addColorStop(0,   "rgba(250,250,255,0.95)");
    grad.addColorStop(0.3, dist >= seg1 && dist < seg1 + seg2 ? "rgba(56,189,248,0.7)" : "rgba(250,204,21,0.7)");
    grad.addColorStop(1,   "rgba(0,0,0,0)");
    ctx.beginPath(); ctx.arc(px, py, PHOTON_GLOW, 0, Math.PI * 2);
    ctx.fillStyle = grad; ctx.fill();
    ctx.beginPath(); ctx.arc(px, py, PHOTON_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "white"; ctx.fill();

    /* ── Lateral shift indicator ── */
    const lateralShift = glassDist * Math.abs(Math.sin(iRad - rRad)) / Math.cos(rRad);
    if (lateralShift > 4) {
      /* bracket between incident extension and emergent ray at glassBot level */
      const extX = cx + glassDist * Math.tan(iRad);
      ctx.save();
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = "rgba(251,146,60,0.6)"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(extX, glassBot + 30); ctx.lineTo(refX1, glassBot + 30); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#fb923c"; ctx.font = "11px monospace"; ctx.textAlign = "center";
      ctx.fillText(`d = ${lateralShift.toFixed(1)} px`, (extX + refX1) / 2, glassBot + 46);
      ctx.restore();
    }

    /* ── Labels: i and r ── */
    ctx.save();
    ctx.fillStyle = ARC_COLOR_I; ctx.font = "bold 14px monospace"; ctx.textAlign = "center";
    ctx.fillText("∠i", cx - 65, glassTop - 18);
    ctx.fillStyle = ARC_COLOR_R;
    ctx.fillText("∠r", cx + 50, glassTop + 22);
    ctx.restore();

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  /* Click to set angle */
  const handleClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current!;
    const rect   = canvas.getBoundingClientRect();
    const mx     = e.clientX - rect.left;
    const my     = e.clientY - rect.top;
    const W      = canvas.clientWidth  || 700;
    const H      = canvas.clientHeight || H_CSS;
    const glassTop = H * 0.28;
    const cx       = W * 0.5;
    if (my < glassTop) {
      const ang = Math.max(5, Math.min(85,
        Math.atan2(Math.abs(mx - cx), glassTop - my) * 180 / Math.PI
      ));
      setIncAngle(Math.round(ang));
    }
  };

  const n2   = nGlass;
  const iRad = (incAngle * Math.PI) / 180;
  const sinR = Math.min(1, Math.sin(iRad) / n2);
  const rDeg = Math.asin(sinR) * 180 / Math.PI;

  /* ─── UI ─────────────────────────────────────────────── */
  return (
    <div style={{ fontFamily: "sans-serif", background: "#050d1a", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(56,189,248,0.2)" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,rgba(56,189,248,0.10) 0%,rgba(99,102,241,0.08) 100%)", padding: "14px 20px", borderBottom: "1px solid rgba(56,189,248,0.15)", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 22 }}>🔬</span>
        <div>
          <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "0.95rem" }}>Glass Slab Refraction Lab</div>
          <div style={{ color: "#64748b", fontSize: "0.75rem" }}>Click above the glass to set incident angle • n₁sin(i) = n₂sin(r)</div>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: H_CSS, display: "block", cursor: "crosshair" }}
        onClick={handleClick}
      />

      {/* Controls */}
      <div style={{ padding: "14px 20px", background: "rgba(0,0,0,0.3)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 24px", borderTop: "1px solid rgba(56,189,248,0.1)" }}>
        <label style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
          Incident Angle: <span style={{ color: "#facc15", fontWeight: 700 }}>{incAngle}°</span>
          <input type="range" min={5} max={85} value={incAngle}
            onChange={e => setIncAngle(Number(e.target.value))}
            style={{ display: "block", width: "100%", marginTop: 4, accentColor: "#facc15" }} />
        </label>
        <label style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
          Glass (n₂): <span style={{ color: "#38bdf8", fontWeight: 700 }}>{n2.toFixed(2)}</span>
          <input type="range" min={130} max={200} value={Math.round(n2 * 100)}
            onChange={e => setNGlass(Number(e.target.value) / 100)}
            style={{ display: "block", width: "100%", marginTop: 4, accentColor: "#38bdf8" }} />
        </label>
        <label style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
          Glass Thickness: <span style={{ color: "#a78bfa", fontWeight: 700 }}>{thickness}%</span>
          <input type="range" min={15} max={55} value={thickness}
            onChange={e => setThick(Number(e.target.value))}
            style={{ display: "block", width: "100%", marginTop: 4, accentColor: "#a78bfa" }} />
        </label>
        {/* Live calculations */}
        <div style={{ background: "rgba(0,0,0,0.4)", borderRadius: 10, padding: "10px 12px", border: "1px solid rgba(56,189,248,0.15)" }}>
          <div style={{ color: "#64748b", fontSize: "0.7rem", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>Live Calculation</div>
          <div style={{ color: "#38bdf8", fontSize: "0.82rem", fontFamily: "monospace" }}>sin({incAngle}°)/{n2.toFixed(2)} = sin({rDeg.toFixed(1)}°)</div>
          <div style={{ color: "#86efac", fontSize: "0.78rem", fontFamily: "monospace", marginTop: 3 }}>Refraction ∠r = {rDeg.toFixed(2)}°</div>
        </div>
      </div>
    </div>
  );
}
