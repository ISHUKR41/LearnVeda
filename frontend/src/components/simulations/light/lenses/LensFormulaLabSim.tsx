/**
 * FILE: LensFormulaLabSim.tsx
 * LOCATION: src/components/simulations/light/lenses/LensFormulaLabSim.tsx
 * PURPOSE: Ultra-interactive Lens Formula Laboratory.
 *
 * LENS FORMULA (New Cartesian Sign Convention):
 *   1/v − 1/u = 1/f
 *   Object always on left: u is always negative.
 *   Convex lens: f > 0; Concave lens: f < 0.
 *   Magnification: m = v/u = h_i/h_o
 *
 * FEATURES:
 *   ─ Canvas ray diagram: 3 principal rays drawn live
 *   ─ Object arrow draggable along principal axis (via slider)
 *   ─ Focal length slider (separate for convex/concave)
 *   ─ Live formula display with calculated values highlighted in colour
 *   ─ Image property cards: Real/Virtual, Erect/Inverted, Enlarged/Diminished
 *   ─ Toggle: Convex (converging) ↔ Concave (diverging) lens
 *   ─ Exam-ready sign convention reminder panel
 *   ─ Smooth HiDPI canvas, responsive, ResizeObserver
 *
 * LAST UPDATED: 2026-06-11
 */

"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

/* ─────────────────────────────────────────────
 * LENS FORMULA SOLVER
 * ───────────────────────────────────────────── */
interface LensResult {
  u: number;   /* signed object distance (always -ve) */
  f: number;   /* signed focal length */
  v: number;   /* solved image distance */
  m: number;   /* magnification */
  isReal: boolean;
  isErect: boolean;
  isEnlarged: boolean;
  nature: string;
}

function solveLens(uMag: number, fMag: number, type: "convex" | "concave"): LensResult {
  const u = -Math.abs(uMag);
  const f = type === "convex" ? Math.abs(fMag) : -Math.abs(fMag);

  /* 1/v = 1/f + 1/u */
  const inv_v = 1 / f + 1 / u;
  const v = Math.abs(inv_v) < 1e-6 ? 1e6 : 1 / inv_v;

  const m = v / u;
  const isReal = v > 0;
  const isErect = m > 0;
  const isEnlarged = Math.abs(m) > 1;

  let nature = "";
  if (isReal) nature += "Real, ";
  else nature += "Virtual, ";
  nature += isErect ? "Erect, " : "Inverted, ";
  nature += isEnlarged ? "Enlarged" : (Math.abs(m) === 1 ? "Same size" : "Diminished");

  return { u, f, v, m, isReal, isErect, isEnlarged, nature };
}

/* ─────────────────────────────────────────────
 * DRAWING HELPERS
 * ───────────────────────────────────────────── */
interface P { x: number; y: number }

function glowLine(ctx: CanvasRenderingContext2D, a: P, b: P, color: string, w: number, alpha: number) {
  for (const [lw, la] of [[w * 6, 0.03], [w * 3, 0.10], [w * 1.5, 0.45], [w, 1.0]] as [number, number][]) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lw;
    ctx.globalAlpha = la * alpha;
    ctx.shadowColor = color;
    ctx.shadowBlur = lw * 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.restore();
  }
}

function dashedLine(ctx: CanvasRenderingContext2D, a: P, b: P, color: string, w = 1.5) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.setLineDash([6, 5]);
  ctx.globalAlpha = 0.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
  ctx.restore();
}

function arrow(ctx: CanvasRenderingContext2D, x: number, baseY: number, topY: number, color: string, alpha = 1) {
  const up = topY < baseY;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.globalAlpha = alpha;
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x, baseY);
  ctx.lineTo(x, topY);
  ctx.stroke();
  /* Arrowhead */
  ctx.fillStyle = color;
  ctx.beginPath();
  const tip = topY;
  const dir = up ? -1 : 1;
  ctx.moveTo(x, tip);
  ctx.lineTo(x - 5, tip + dir * 10);
  ctx.lineTo(x + 5, tip + dir * 10);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/* ═══════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════ */
export default function LensFormulaLabSim() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [uMag, setUMag]       = useState<number>(30);  /* object distance magnitude (cm) */
  const [fMag, setFMag]       = useState<number>(15);  /* focal length magnitude (cm) */
  const [lensType, setLensType] = useState<"convex" | "concave">("convex");

  const result = solveLens(uMag, fMag, lensType);

  const drawDiagram = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width;
    const H = canvas.height;
    const w = W / dpr;
    const h = H / dpr;

    ctx.clearRect(0, 0, W, H);

    /* Background */
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#0a0f1e");
    bg.addColorStop(1, "#0f172a");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* Scale: pixels per cm */
    const SCALE = Math.min((w * 0.38) / 50, h * 0.012);
    const O  = { x: w * 0.50, y: h * 0.52 }; /* optical centre */
    const OA = w * 0.45; /* half-axis length in pixels */

    /* ── Principal axis ── */
    dashedLine(ctx, { x: O.x - OA, y: O.y }, { x: O.x + OA, y: O.y }, "#475569", 1);

    /* ── Lens ── */
    const LH = h * 0.38; /* half-lens height */
    if (lensType === "convex") {
      /* Double convex lens shape */
      ctx.save();
      ctx.strokeStyle = "rgba(56,189,248,0.8)";
      ctx.fillStyle   = "rgba(56,189,248,0.08)";
      ctx.lineWidth   = 2 * dpr;
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur  = 12;
      const cx1 = 22 * dpr;
      ctx.beginPath();
      ctx.moveTo(O.x * dpr, (O.y - LH) * dpr);
      ctx.bezierCurveTo((O.x + cx1), (O.y - LH) * dpr, (O.x + cx1), (O.y + LH) * dpr, O.x * dpr, (O.y + LH) * dpr);
      ctx.bezierCurveTo((O.x - cx1), (O.y + LH) * dpr, (O.x - cx1), (O.y - LH) * dpr, O.x * dpr, (O.y - LH) * dpr);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    } else {
      /* Double concave lens shape */
      ctx.save();
      ctx.strokeStyle = "rgba(168,85,247,0.8)";
      ctx.fillStyle   = "rgba(168,85,247,0.08)";
      ctx.lineWidth   = 2 * dpr;
      ctx.shadowColor = "#a855f7";
      ctx.shadowBlur  = 12;
      const cx2 = 20 * dpr;
      ctx.beginPath();
      ctx.moveTo(O.x * dpr, (O.y - LH) * dpr);
      ctx.bezierCurveTo((O.x - cx2), (O.y - LH) * dpr, (O.x - cx2), (O.y + LH) * dpr, O.x * dpr, (O.y + LH) * dpr);
      ctx.bezierCurveTo((O.x + cx2), (O.y + LH) * dpr, (O.x + cx2), (O.y - LH) * dpr, O.x * dpr, (O.y - LH) * dpr);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    /* ── Focal points F and F' ── */
    const Fx  = O.x - result.f * SCALE;   /* F is on object side for convex: behind lens */
    const Fpx = O.x + result.f * SCALE;   /* F' is on image side */

    for (const [fx, lbl] of [[Fx, "F"], [Fpx, "F'"]] as [number, string][]) {
      ctx.save();
      ctx.fillStyle = "#fbbf24";
      ctx.shadowColor = "#fbbf24";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(fx * dpr, O.y * dpr, 4 * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fbbf24";
      ctx.font = `bold ${10 * dpr}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(lbl, fx * dpr, (O.y + 14) * dpr);
      ctx.restore();
    }

    /* ── Object arrow (always on left of lens) ── */
    const objX = O.x + result.u * SCALE;  /* u is negative → object left of O */
    const objH = h * 0.18;

    /* Clamp to canvas */
    if (objX > 10 && objX < O.x - 10) {
      arrow(ctx, objX * dpr, O.y * dpr, (O.y - objH) * dpr, "#4ade80");
      ctx.save();
      ctx.fillStyle = "#4ade80";
      ctx.font = `bold ${10 * dpr}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("Object", objX * dpr, (O.y + 14) * dpr);
      ctx.restore();
    }

    /* ── Image arrow ── */
    const imgX = O.x + result.v * SCALE;
    const imgH = objH * Math.abs(result.m);
    const imgColor = result.isReal ? "#f87171" : "#fb923c";

    if (Math.abs(result.v) < 10000 && imgX > 5 && imgX < w - 5) {
      const imgTopY = result.isErect ? O.y - imgH : O.y + imgH;
      arrow(ctx, imgX * dpr, O.y * dpr, imgTopY * dpr, imgColor, result.isReal ? 1 : 0.55);
      if (!result.isReal) {
        dashedLine(ctx, { x: imgX * dpr, y: O.y * dpr }, { x: imgX * dpr, y: imgTopY * dpr }, imgColor, 1.5);
      }
      ctx.save();
      ctx.fillStyle = imgColor;
      ctx.font = `bold ${10 * dpr}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("Image", imgX * dpr, (O.y + 14) * dpr);
      ctx.restore();
    }

    /* ── 3 Principal Rays ── */
    if (objX > 10 && objX < O.x - 10) {
      const ObjTip = { x: objX * dpr, y: (O.y - objH) * dpr };
      const OnAxis = { x: O.x * dpr, y: O.y * dpr };
      const OnLens = { x: O.x * dpr, y: ObjTip.y };
      const fPoint = { x: Fpx * dpr, y: O.y * dpr };
      const f2Point = { x: Fx * dpr, y: O.y * dpr };

      /* Image tip (target for all three rays to converge) */
      const iTipX = imgX * dpr;
      const iTipY = result.isErect ? (O.y - imgH) * dpr : (O.y + imgH) * dpr;
      const ImgTip = { x: iTipX, y: iTipY };
      const canShow = Math.abs(result.v) < 10000 && imgX > 5 && imgX < w - 5;

      if (lensType === "convex") {
        /* Ray 1: Parallel to axis → through F' after refraction */
        glowLine(ctx, ObjTip, OnLens, "#facc15", 2 * dpr, 0.8);
        if (canShow) {
          glowLine(ctx, OnLens, ImgTip, "#facc15", 2 * dpr, 0.8);
          /* Extension beyond image */
          const ext = { x: OnLens.x + (ImgTip.x - OnLens.x) * 2.5, y: OnLens.y + (ImgTip.y - OnLens.y) * 2.5 };
          if (!result.isReal) dashedLine(ctx, OnLens, ext, "#facc15");
        } else {
          /* Diverging: ray goes towards F' direction */
          glowLine(ctx, OnLens, fPoint, "#facc15", 2 * dpr, 0.8);
        }

        /* Ray 2: Through optical centre → straight (no deviation) */
        if (canShow) {
          glowLine(ctx, ObjTip, OnAxis, "#a78bfa", 2 * dpr, 0.8);
          glowLine(ctx, OnAxis, ImgTip, "#a78bfa", 2 * dpr, 0.8);
        } else {
          glowLine(ctx, ObjTip, OnAxis, "#a78bfa", 2 * dpr, 0.8);
          const ext2 = { x: OnAxis.x + (ObjTip.x - OnAxis.x) * (-2), y: OnAxis.y + (ObjTip.y - OnAxis.y) * (-2) };
          glowLine(ctx, OnAxis, ext2, "#a78bfa", 2 * dpr, 0.5);
        }

        /* Ray 3: Through F on object side → parallel after refraction */
        if (canShow && !result.isReal) {
          /* Concave-like situation: virtual image */
          glowLine(ctx, ObjTip, { x: f2Point.x, y: f2Point.y }, "#34d399", 2 * dpr, 0.6);
        } else {
          glowLine(ctx, ObjTip, OnLens, "#34d399", 2 * dpr, 0.6);
          const paraEnd = { x: O.x * dpr + (w * 0.4) * dpr, y: OnLens.y };
          glowLine(ctx, OnLens, paraEnd, "#34d399", 2 * dpr, 0.6);
        }
      } else {
        /* Concave lens rays */
        /* Ray 1: Parallel to axis → diverges away from F' */
        glowLine(ctx, ObjTip, OnLens, "#facc15", 2 * dpr, 0.8);
        const divDir = { x: OnLens.x + (OnLens.x - fPoint.x) * 0.4, y: OnLens.y + (OnLens.y - fPoint.y) * 0.4 };
        glowLine(ctx, OnLens, divDir, "#facc15", 2 * dpr, 0.8);
        if (!result.isReal) dashedLine(ctx, OnLens, { x: fPoint.x, y: fPoint.y }, "#facc15");

        /* Ray 2: Through optical centre → straight */
        if (canShow) {
          glowLine(ctx, ObjTip, ImgTip, "#a78bfa", 2 * dpr, 0.6);
        }
      }
    }

    /* ── Axes labels ── */
    ctx.save();
    ctx.fillStyle = "rgba(100,116,139,0.7)";
    ctx.font = `${9 * dpr}px Inter, sans-serif`;
    ctx.textAlign = "left";
    ctx.fillText("← Object side (−)", 10 * dpr, (O.y + 20) * dpr);
    ctx.textAlign = "right";
    ctx.fillText("Image side (+) →", (w - 8) * dpr, (O.y + 20) * dpr);
    ctx.restore();

  }, [uMag, fMag, lensType, result]);

  useEffect(() => {
    drawDiagram();
  }, [drawDiagram]);

  /* Responsive resize */
  useEffect(() => {
    const container = containerRef.current;
    const canvas    = canvasRef.current;
    if (!container || !canvas) return;
    const ro = new ResizeObserver(() => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width  = rect.width * dpr;
      canvas.height = Math.max(220, rect.width * 0.44) * dpr;
      canvas.style.width  = `${rect.width}px`;
      canvas.style.height = `${Math.max(220, rect.width * 0.44)}px`;
      drawDiagram();
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [drawDiagram]);

  /* ── UI ── */
  const lensColor = lensType === "convex" ? "#38bdf8" : "#a855f7";

  const panelStyle: React.CSSProperties = {
    background: "linear-gradient(135deg,#0f172a,#0a1628)",
    borderRadius: "16px", padding: "20px",
    fontFamily: "Inter,system-ui,sans-serif",
  };
  const chip: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px", padding: "10px 14px", fontSize: "12px", color: "#94a3b8",
    flex: "1", minWidth: "100px",
  };
  const lbl: React.CSSProperties = { display: "block", fontSize: "10px", color: "#64748b", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.06em" };
  const val: React.CSSProperties = { fontSize: "17px", fontWeight: 700, color: "#f8fafc", lineHeight: 1.2 };

  return (
    <div style={panelStyle}>
      {/* Canvas */}
      <div ref={containerRef} style={{ width: "100%", borderRadius: "12px", overflow: "hidden", background: "#080d1a" }}>
        <canvas ref={canvasRef} style={{ display: "block" }} />
      </div>

      {/* Lens type toggle */}
      <div style={{ marginTop: "14px", display: "flex", gap: "8px" }}>
        {(["convex", "concave"] as const).map(t => (
          <button key={t} onClick={() => setLensType(t)} style={{
            flex: 1, padding: "8px 16px", borderRadius: "10px", border: "1px solid",
            borderColor: lensType === t ? lensColor : "rgba(255,255,255,0.1)",
            background: lensType === t ? `${lensColor}22` : "transparent",
            color: lensType === t ? lensColor : "#64748b",
            cursor: "pointer", fontWeight: 700, fontSize: "13px", transition: "all 0.2s",
          }}>
            {t === "convex" ? "🔍 Convex (Converging)" : "🔎 Concave (Diverging)"}
          </button>
        ))}
      </div>

      {/* Object distance */}
      <div style={{ marginTop: "14px" }}>
        <label style={{ fontSize: "12px", color: "#94a3b8", display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <span>Object distance |u|</span>
          <span style={{ color: "#4ade80", fontWeight: 700 }}>{uMag} cm (u = −{uMag} cm)</span>
        </label>
        <input type="range" min={5} max={80} value={uMag}
          onChange={e => setUMag(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#4ade80" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#475569", marginTop: "2px" }}>
          <span>Very close (5 cm)</span><span>Far away (80 cm)</span>
        </div>
      </div>

      {/* Focal length */}
      <div style={{ marginTop: "10px" }}>
        <label style={{ fontSize: "12px", color: "#94a3b8", display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <span>Focal length |f|</span>
          <span style={{ color: lensColor, fontWeight: 700 }}>f = {lensType === "convex" ? "+" : "−"}{fMag} cm</span>
        </label>
        <input type="range" min={5} max={40} value={fMag}
          onChange={e => setFMag(Number(e.target.value))}
          style={{ width: "100%", accentColor: lensColor }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#475569", marginTop: "2px" }}>
          <span>Strong lens (5 cm)</span><span>Weak lens (40 cm)</span>
        </div>
      </div>

      {/* Formula display */}
      <div style={{
        marginTop: "14px", padding: "12px 16px",
        background: "rgba(99,102,241,0.10)", border: "1px solid rgba(99,102,241,0.20)",
        borderRadius: "12px",
      }}>
        <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Lens Formula: 1/v − 1/u = 1/f
        </div>
        <div style={{ fontSize: "15px", color: "#c7d2fe", fontFamily: "JetBrains Mono, monospace", lineHeight: 1.8 }}>
          <span style={{ color: "#94a3b8" }}>1/v</span>
          {" − "}
          <span style={{ color: "#94a3b8" }}>1/u</span>
          {" = "}
          <span style={{ color: lensColor }}>1/f</span>
          <br />
          <span style={{ color: "#f87171" }}>1/{result.v.toFixed(1)}</span>
          {" − "}
          <span style={{ color: "#4ade80" }}>1/({result.u.toFixed(1)})</span>
          {" = "}
          <span style={{ color: lensColor }}>1/{result.f.toFixed(1)}</span>
          <br />
          <span style={{ color: "#fbbf24", fontWeight: 700 }}>v = {Math.abs(result.v) > 9000 ? "∞" : result.v.toFixed(1)} cm</span>
          <span style={{ marginLeft: "16px", color: "#fb923c" }}>m = {result.m.toFixed(2)}</span>
        </div>
      </div>

      {/* Image properties */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
        <div style={chip}>
          <span style={lbl}>Image Distance</span>
          <span style={{ ...val, color: "#f87171" }}>{Math.abs(result.v) > 9000 ? "∞" : result.v.toFixed(1)} cm</span>
        </div>
        <div style={chip}>
          <span style={lbl}>Magnification</span>
          <span style={{ ...val, color: "#fb923c" }}>{result.m.toFixed(2)}×</span>
        </div>
        <div style={chip}>
          <span style={lbl}>Nature</span>
          <span style={{ ...val, fontSize: "11px", color: result.isReal ? "#4ade80" : "#f87171" }}>
            {result.isReal ? "Real" : "Virtual"}
          </span>
        </div>
        <div style={chip}>
          <span style={lbl}>Orientation</span>
          <span style={{ ...val, fontSize: "11px", color: result.isErect ? "#4ade80" : "#facc15" }}>
            {result.isErect ? "Erect" : "Inverted"}
          </span>
        </div>
      </div>

      {/* Sign convention reminder */}
      <div style={{
        marginTop: "12px", padding: "12px 16px",
        background: "rgba(250,204,21,0.07)", border: "1px solid rgba(250,204,21,0.15)",
        borderRadius: "10px", fontSize: "12px", color: "#94a3b8", lineHeight: 1.6,
      }}>
        <strong style={{ color: "#facc15" }}>📏 Sign Convention:</strong>{" "}
        All distances from optical centre (O). Object on left → u is always <strong style={{ color: "#f87171" }}>negative</strong>. Convex lens → f is <strong style={{ color: "#4ade80" }}>positive</strong>. Concave lens → f is <strong style={{ color: "#f87171" }}>negative</strong>.
      </div>
    </div>
  );
}
