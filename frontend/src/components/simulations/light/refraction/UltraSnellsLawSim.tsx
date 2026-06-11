"use client";
/**
 * FILE: UltraSnellsLawSim.tsx
 * PURPOSE: Ultra-realistic Snell's Law simulation with:
 *   - Draggable incident ray (click anywhere on top half to set angle)
 *   - Real-time refracted and reflected rays with glow
 *   - Live Snell's law display: n₁ sin θ₁ = n₂ sin θ₂
 *   - Material selector (air, water, glass, diamond)
 *   - Critical angle detection with TIR animation
 *   - Animated wavefronts showing speed change
 *   - Angle arc displays
 *   - HiDPI canvas
 */

import React, { useRef, useEffect, useState, useCallback } from "react";

const H_CSS = 440;

type Material = { name: string; n: number; color: string; bgColor: string };

const MATERIALS: Material[] = [
  { name: "Air",     n: 1.00, color: "#94a3b8", bgColor: "rgba(15,23,42,0.0)"  },
  { name: "Water",   n: 1.33, color: "#38bdf8", bgColor: "rgba(14,116,144,0.15)" },
  { name: "Glass",   n: 1.50, color: "#a78bfa", bgColor: "rgba(88,28,220,0.12)" },
  { name: "Diamond", n: 2.42, color: "#f9a8d4", bgColor: "rgba(236,72,153,0.12)" },
];

function toRad(deg: number) { return (deg * Math.PI) / 180; }
function toDeg(rad: number) { return (rad * 180) / Math.PI; }

export default function UltraSnellsLawSim() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const angleRef   = useRef(40); /* incident angle in degrees */
  const mat1Ref    = useRef<Material>(MATERIALS[0]);
  const mat2Ref    = useRef<Material>(MATERIALS[2]);
  const draggingRef = useRef(false);

  const [mat1Idx, setMat1Idx] = useState(0);
  const [mat2Idx, setMat2Idx] = useState(2);
  const [incAngle, setIncAngle] = useState(40);
  const [refAngle, setRefAngle] = useState(0);
  const [isTIR, setIsTIR] = useState(false);
  const rafRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const W   = canvas.clientWidth  || 700;
    const H   = canvas.clientHeight || H_CSS;
    if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const m1  = mat1Ref.current;
    const m2  = mat2Ref.current;
    const thi = toRad(angleRef.current); /* incident angle */
    const midY = H / 2;
    const cx   = W / 2;

    /* Snell's law: n1 sin θ1 = n2 sin θ2 */
    const sinRef2 = (m1.n * Math.sin(thi)) / m2.n;
    const isTotalInternal = sinRef2 > 1;
    const thr = isTotalInternal ? null : Math.asin(sinRef2);

    setIncAngle(Math.round(toDeg(thi)));
    setRefAngle(thr !== null ? Math.round(toDeg(thr)) : -1);
    setIsTIR(isTotalInternal);

    /* ── Backgrounds for two media ── */
    ctx.fillStyle = m1.bgColor || "rgba(10,15,30,0)";
    ctx.fillRect(0, 0, W, midY);
    const bg1 = ctx.createLinearGradient(0, 0, 0, midY);
    bg1.addColorStop(0, "rgba(4,12,24,1)");
    bg1.addColorStop(1, "rgba(6,16,28,1)");
    ctx.fillStyle = bg1; ctx.fillRect(0, 0, W, midY);

    ctx.fillStyle = m2.bgColor;
    ctx.fillRect(0, midY, W, midY);
    const bg2 = ctx.createLinearGradient(0, midY, 0, H);
    bg2.addColorStop(0, m2.bgColor);
    bg2.addColorStop(1, "rgba(4,8,20,1)");
    ctx.fillStyle = bg2; ctx.fillRect(0, midY, W, H - midY);

    /* grid */
    ctx.strokeStyle = "rgba(99,102,241,0.04)";
    ctx.lineWidth   = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    /* ── Interface line ── */
    ctx.save();
    ctx.strokeStyle = "rgba(148,163,184,0.35)";
    ctx.lineWidth   = 2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(W, midY); ctx.stroke();
    ctx.restore();

    /* ── Normal (dashed vertical) ── */
    ctx.save();
    ctx.strokeStyle = "rgba(148,163,184,0.3)";
    ctx.lineWidth   = 1.5;
    ctx.setLineDash([6, 5]);
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
    ctx.restore();

    /* Ray length */
    const rayLen = Math.max(W, H) * 0.55;

    /* ── Incident ray ── */
    const incX = cx + Math.sin(thi) * (-rayLen);
    const incY = midY - Math.cos(thi) * rayLen;
    drawGlowRay(ctx, incX, incY, cx, midY, "#f59e0b", 2.5, 14);

    /* ── Reflected ray ── */
    const reflX = cx - Math.sin(thi) * rayLen;
    const reflY = midY - Math.cos(thi) * rayLen;
    drawGlowRay(ctx, cx, midY, reflX, reflY, isTotalInternal ? "#f97316" : "rgba(251,146,60,0.5)", isTotalInternal ? 2.5 : 1.5, isTotalInternal ? 14 : 5);

    /* ── Refracted ray (or TIR flash) ── */
    if (!isTotalInternal && thr !== null) {
      const refrX = cx + Math.sin(thr) * rayLen;
      const refrY = midY + Math.cos(thr) * rayLen;
      drawGlowRay(ctx, cx, midY, refrX, refrY, m2.color, 2.5, 14);
    } else {
      /* TIR — bright flash at interface */
      const grd = ctx.createRadialGradient(cx, midY, 0, cx, midY, 60);
      grd.addColorStop(0, "rgba(251,146,60,0.45)");
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(cx, midY, 60, 0, Math.PI * 2); ctx.fill();
    }

    /* ── Angle arcs ── */
    drawAngleArc(ctx, cx, midY, -Math.PI / 2, -Math.PI / 2 + thi, thi, "#f59e0b", `θ₁=${Math.round(toDeg(thi))}°`, false);
    if (!isTotalInternal && thr !== null) {
      drawAngleArc(ctx, cx, midY, Math.PI / 2, Math.PI / 2 - thr, thr, m2.color, `θ₂=${Math.round(toDeg(thr))}°`, true);
    }

    /* ── Wavefronts ── */
    drawWavefronts(ctx, incX, incY, cx, midY, m1.n, "#f59e0b");
    if (!isTotalInternal && thr !== null) {
      const refrX = cx + Math.sin(thr) * rayLen;
      const refrY = midY + Math.cos(thr) * rayLen;
      drawWavefronts(ctx, cx, midY, refrX, refrY, m2.n, m2.color);
    }

    /* ── Media labels ── */
    ctx.save();
    ctx.font      = "bold 14px Inter,sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = m1.color; ctx.shadowColor = m1.color; ctx.shadowBlur = 8;
    ctx.fillText(`${m1.name}  (n₁ = ${m1.n})`, 14, 24);
    ctx.fillStyle = m2.color; ctx.shadowColor = m2.color;
    ctx.fillText(`${m2.name}  (n₂ = ${m2.n})`, 14, midY + 24);
    ctx.restore();

    /* ── TIR label ── */
    if (isTotalInternal) {
      ctx.save();
      ctx.font      = "bold 18px Inter,sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#f97316"; ctx.shadowColor = "#f97316"; ctx.shadowBlur = 20;
      ctx.fillText("⚡ TOTAL INTERNAL REFLECTION", W / 2, H - 28);
      ctx.restore();
    }

    /* ── Critical angle indicator ── */
    const critAngle = m1.n < m2.n ? null : toDeg(Math.asin(m2.n / m1.n));
    if (critAngle !== null) {
      ctx.save();
      ctx.fillStyle = "rgba(248,113,113,0.7)";
      ctx.font      = "11px Inter,sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(`Critical angle: ${critAngle.toFixed(1)}°`, W - 12, midY - 8);
      ctx.restore();
    }

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => { rafRef.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(rafRef.current); }, [draw]);
  useEffect(() => { mat1Ref.current = MATERIALS[mat1Idx]; }, [mat1Idx]);
  useEffect(() => { mat2Ref.current = MATERIALS[mat2Idx]; }, [mat2Idx]);

  /* Mouse → incident angle */
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingRef.current) return;
    const canvas = canvasRef.current!;
    const rect   = canvas.getBoundingClientRect();
    const mx     = e.clientX - rect.left - canvas.clientWidth / 2;
    const my     = canvas.clientHeight / 2 - (e.clientY - rect.top);
    if (my < 0) return;
    const angle = Math.min(85, Math.max(0, toDeg(Math.atan2(Math.abs(mx), Math.abs(my)))));
    angleRef.current = angle;
  };

  return (
    <div style={{ fontFamily: "Inter,sans-serif", userSelect: "none" }}>
      {/* Controls */}
      <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>Medium 1 (top)</span>
          <div style={{ display: "flex", gap: 6 }}>
            {MATERIALS.map((m, i) => (
              <button key={i} onClick={() => setMat1Idx(i)} style={{
                padding: "4px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer",
                border: "1px solid", fontWeight: mat1Idx === i ? 700 : 400,
                borderColor: mat1Idx === i ? m.color : "rgba(255,255,255,0.08)",
                background: mat1Idx === i ? `${m.color}22` : "transparent",
                color: mat1Idx === i ? m.color : "#64748b",
              }}>{m.name}</button>
            ))}
          </div>
        </div>
        <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.07)" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>Medium 2 (bottom)</span>
          <div style={{ display: "flex", gap: 6 }}>
            {MATERIALS.map((m, i) => (
              <button key={i} onClick={() => setMat2Idx(i)} style={{
                padding: "4px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer",
                border: "1px solid", fontWeight: mat2Idx === i ? 700 : 400,
                borderColor: mat2Idx === i ? m.color : "rgba(255,255,255,0.08)",
                background: mat2Idx === i ? `${m.color}22` : "transparent",
                color: mat2Idx === i ? m.color : "#64748b",
              }}>{m.name}</button>
            ))}
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#64748b" }}>θ₁:</span>
          <input type="range" min={0} max={89} value={incAngle}
            onChange={e => { angleRef.current = Number(e.target.value); setIncAngle(Number(e.target.value)); }}
            style={{ width: 100, accentColor: "#f59e0b" }}
          />
          <span style={{ fontSize: 13, color: "#f59e0b", fontFamily: "monospace", minWidth: 36 }}>{incAngle}°</span>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        style={{
          width: "100%", height: H_CSS, display: "block", borderRadius: 14,
          cursor: "crosshair", border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 0 40px rgba(16,185,129,0.1)",
        }}
        onMouseDown={() => { draggingRef.current = true; }}
        onMouseMove={handleMouseMove}
        onMouseUp={() => { draggingRef.current = false; }}
        onMouseLeave={() => { draggingRef.current = false; }}
      />

      {/* Formula strip */}
      <div style={{
        display: "flex", gap: 16, flexWrap: "wrap", marginTop: 10,
        padding: "10px 16px", background: "rgba(8,15,32,0.8)",
        borderRadius: 10, border: "1px solid rgba(16,185,129,0.15)",
      }}>
        <span style={{ fontSize: 12, color: "#34d399", fontFamily: "monospace" }}>
          <strong>n₁ sin θ₁ = n₂ sin θ₂</strong>
        </span>
        <span style={{ color: "#334155" }}>|</span>
        <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: "monospace" }}>
          {mat1Ref.current.n} × sin({incAngle}°) = {mat2Ref.current.n} × sin({refAngle >= 0 ? refAngle + "°" : "—"})
        </span>
        {isTIR && <span style={{ fontSize: 12, color: "#f97316", fontWeight: 700 }}>⚡ TIR — No refracted ray</span>}
      </div>
    </div>
  );
}

/* ─── Helper: glow ray ─────────────────────────────────────────── */
function drawGlowRay(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, lw: number, blur: number) {
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = lw;
  ctx.shadowColor = color; ctx.shadowBlur = blur;
  ctx.lineCap     = "round";
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  /* arrowhead */
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 10 * Math.cos(angle - 0.4), y2 - 10 * Math.sin(angle - 0.4));
  ctx.lineTo(x2 - 10 * Math.cos(angle + 0.4), y2 - 10 * Math.sin(angle + 0.4));
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

/* ─── Helper: angle arc ────────────────────────────────────────── */
function drawAngleArc(ctx: CanvasRenderingContext2D, cx: number, cy: number, startAng: number, endAng: number, angle: number, color: string, label: string, below: boolean) {
  if (angle < 0.01) return;
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.shadowColor = color; ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, 44, Math.min(startAng, endAng), Math.max(startAng, endAng));
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle  = color; ctx.font = "bold 12px Inter,sans-serif"; ctx.textAlign = "center";
  const midAng = (startAng + endAng) / 2;
  ctx.fillText(label, cx + Math.cos(midAng) * 64, cy + Math.sin(midAng) * 64 + (below ? 4 : -4));
  ctx.restore();
}

/* ─── Helper: wavefronts ───────────────────────────────────────── */
function drawWavefronts(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, n: number, color: string) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  if (len < 10) return;
  const dx = (x2 - x1) / len;
  const dy = (y2 - y1) / len;
  const nx = -dy; const ny = dx; /* normal to ray */
  const spacing = 30 / n; /* closer wavefronts = higher n = slower */
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = 0.8; ctx.globalAlpha = 0.22;
  const steps = Math.floor(len / spacing);
  for (let i = 1; i <= steps; i++) {
    const px = x1 + dx * i * spacing;
    const py = y1 + dy * i * spacing;
    ctx.beginPath();
    ctx.moveTo(px + nx * 20, py + ny * 20);
    ctx.lineTo(px - nx * 20, py - ny * 20);
    ctx.stroke();
  }
  ctx.restore();
}
