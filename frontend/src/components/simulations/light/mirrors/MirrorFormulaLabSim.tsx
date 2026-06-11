/**
 * FILE: MirrorFormulaLabSim.tsx
 * PURPOSE: Ultra-interactive mirror formula laboratory.
 *          Students enter object distance (u) and focal length (f), and the
 *          simulation instantly solves 1/v + 1/u = 1/f, draws the ray diagram
 *          on a canvas, and shows all image properties.
 *
 * FEATURES:
 *   - Input sliders for u (object distance) and f (focal length)
 *   - Live canvas ray diagram (3 principal rays: parallel, through focus, through centre)
 *   - Real-time display of v, magnification m = -v/u, image nature
 *   - Sign convention visual reminder
 *   - Toggle between Concave (f < 0) and Convex (f > 0) mirror
 *   - Exam-style answer breakdown panel
 *
 * SIGN CONVENTION (New Cartesian):
 *   All distances from the Pole (P).
 *   Object is always in front (left) → u is always negative.
 *   Concave mirror: f is negative; Convex mirror: f is positive.
 */

"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════
 * TYPES
 * ═══════════════════════════════════════════════════ */
type MirrorType = "concave" | "convex";

interface SolvedValues {
  u: number;    // signed object distance
  f: number;    // signed focal length
  v: number;    // solved image distance
  m: number;    // magnification
  isReal: boolean;
  isErect: boolean;
  isEnlarged: boolean;
  nature: string;
}

/* ═══════════════════════════════════════════════════
 * SOLVER
 * ═══════════════════════════════════════════════════ */
function solveMirrorFormula(uMag: number, fMag: number, type: MirrorType): SolvedValues {
  /* Apply sign convention */
  const u = -Math.abs(uMag);          // always negative
  const f = type === "concave" ? -Math.abs(fMag) : Math.abs(fMag);

  /* 1/v = 1/f - 1/u */
  const invV = 1 / f - 1 / u;
  const v    = invV === 0 ? Infinity : 1 / invV;
  const m    = isFinite(v) ? -(v / u) : 0;

  const isReal    = v < 0;           // real image: v < 0 (in front of mirror)
  const isErect   = m > 0;
  const isEnlarged = Math.abs(m) > 1;

  let nature = isReal ? "Real, " : "Virtual, ";
  nature += isErect ? "Erect, " : "Inverted, ";
  nature += isEnlarged ? "Enlarged" : (Math.abs(m) < 1 ? "Diminished" : "Same size");

  return { u, f, v, m, isReal, isErect, isEnlarged, nature };
}

/* ═══════════════════════════════════════════════════
 * RAY DIAGRAM DRAWER
 * ═══════════════════════════════════════════════════ */
function drawRayDiagram(
  ctx: CanvasRenderingContext2D,
  W: number, H: number,
  solved: SolvedValues,
  mirrorType: MirrorType
) {
  const cx = W * 0.55;  // pole position (x)
  const cy = H * 0.5;   // principal axis (y)
  const scale = W * 0.12; // pixels per unit

  const { u, f, v, m } = solved;

  /* Clear */
  ctx.clearRect(0, 0, W, H);

  /* Background */
  ctx.fillStyle = "#040a14";
  ctx.fillRect(0, 0, W, H);

  /* Grid */
  ctx.strokeStyle = "rgba(255,255,255,0.03)";
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  /* ── Principal axis ── */
  ctx.beginPath();
  ctx.moveTo(0, cy); ctx.lineTo(W, cy);
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 5]);
  ctx.stroke();
  ctx.setLineDash([]);

  /* ── Mirror arc ── */
  const mirrorH = H * 0.32;
  ctx.beginPath();
  if (mirrorType === "concave") {
    ctx.arc(cx + scale * 2, cy, scale * 2, Math.PI * 0.72, Math.PI * 1.28);
  } else {
    ctx.arc(cx - scale * 2, cy, scale * 2, -0.28 * Math.PI, 0.28 * Math.PI);
  }
  ctx.strokeStyle = "rgba(148,163,184,0.8)";
  ctx.lineWidth = 3;
  ctx.stroke();

  /* Mirror label */
  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 11px Inter, system-ui";
  ctx.fillText(mirrorType === "concave" ? "Concave Mirror" : "Convex Mirror", cx + 8, cy - mirrorH / 2 - 8);

  /* ── Key points on axis ── */
  const fX  = cx + (f / 1) * scale;   // focus F
  const cX  = cx + (2 * f / 1) * scale; // centre of curvature C
  const objX = cx + (u / 1) * scale;   // object (u is negative, so left)
  const imgX = isFinite(v) ? cx + (v / 1) * scale : null; // image

  /* Draw points */
  function drawPoint(x: number, label: string, color: string) {
    if (x < 0 || x > W) return;
    ctx.beginPath();
    ctx.arc(x, cy, 5, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.fillStyle = color;
    ctx.font = "bold 11px Inter, system-ui";
    ctx.fillText(label, x - 8, cy + 18);
  }

  drawPoint(cx,  "P",  "#ffffff");
  drawPoint(fX,  "F",  "#fbbf24");
  drawPoint(cX,  "C",  "#f87171");

  /* ── Object arrow ── */
  const objH = Math.min(H * 0.25, Math.abs(scale * 1.2));
  if (objX > 0 && objX < W) {
    ctx.beginPath();
    ctx.moveTo(objX, cy);
    ctx.lineTo(objX, cy - objH);
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 2.5;
    ctx.stroke();
    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(objX, cy - objH);
    ctx.lineTo(objX - 6, cy - objH + 10);
    ctx.lineTo(objX + 6, cy - objH + 10);
    ctx.closePath();
    ctx.fillStyle = "#60a5fa";
    ctx.fill();
    ctx.fillStyle = "#60a5fa";
    ctx.font = "bold 11px Inter, system-ui";
    ctx.fillText("Object", objX + 8, cy - objH * 0.5);
  }

  /* ── Image arrow (if real/finite) ── */
  if (imgX !== null && isFinite(v) && imgX > 0 && imgX < W) {
    const imgH = Math.min(H * 0.3, Math.abs(objH * m));
    const direction = solved.isErect ? -1 : 1;

    ctx.beginPath();
    ctx.moveTo(imgX, cy);
    ctx.lineTo(imgX, cy + direction * imgH);
    ctx.strokeStyle = solved.isReal ? "#f87171" : "#a78bfa";
    ctx.lineWidth = 2.5;
    ctx.setLineDash(solved.isReal ? [] : [5, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    const imgColor = solved.isReal ? "#f87171" : "#a78bfa";
    ctx.beginPath();
    ctx.moveTo(imgX, cy + direction * imgH);
    ctx.lineTo(imgX - 6, cy + direction * imgH - direction * 10);
    ctx.lineTo(imgX + 6, cy + direction * imgH - direction * 10);
    ctx.closePath();
    ctx.fillStyle = imgColor;
    ctx.fill();

    ctx.fillStyle = imgColor;
    ctx.font = "bold 11px Inter, system-ui";
    ctx.fillText(solved.isReal ? "Image (Real)" : "Image (Virtual)", imgX + 8, cy + direction * imgH * 0.5);
  }

  /* ── Ray 1: Parallel to axis → through focus ── */
  if (objX > 0 && objX < W) {
    const tipY = cy - objH;
    // Incident ray (horizontal)
    ctx.beginPath();
    ctx.moveTo(objX, tipY);
    ctx.lineTo(cx,   tipY);
    ctx.strokeStyle = "rgba(250,204,21,0.8)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Reflected ray: from mirror toward F
    if (mirrorType === "concave") {
      // Goes through F after reflection
      const slope = (tipY - cy) / (cx - fX);
      const endX = 0;
      const endY = tipY + slope * (cx - endX);
      ctx.beginPath();
      ctx.moveTo(cx, tipY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = "rgba(250,204,21,0.5)";
      ctx.setLineDash([4, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
}

/* ═══════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════ */
export default function MirrorFormulaLabSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mirrorType, setMirrorType] = useState<MirrorType>("concave");
  const [uMag, setUMag] = useState<number>(30); // |u| in cm
  const [fMag, setFMag] = useState<number>(15); // |f| in cm

  const solved = solveMirrorFormula(uMag, fMag, mirrorType);

  /* Draw ray diagram whenever values change */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width  = rect.width  * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    drawRayDiagram(ctx, rect.width, rect.height, solved, mirrorType);
  }, [solved, mirrorType, uMag, fMag]);

  const pillStyle = (color: string, bg: string) => ({
    display: "inline-block", padding: "3px 10px", borderRadius: "6px",
    background: bg, color, fontWeight: 700, fontSize: "12px",
  });

  return (
    <div style={{
      background: "#040a14",
      borderRadius: "16px",
      overflow: "hidden",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Ray Diagram Canvas */}
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "260px", display: "block" }}
      />

      {/* Controls */}
      <div style={{
        padding: "20px 24px",
        background: "rgba(8,14,26,0.98)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        {/* Mirror toggle */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "18px" }}>
          {(["concave", "convex"] as MirrorType[]).map(t => (
            <button key={t}
              onClick={() => setMirrorType(t)}
              style={{
                flex: 1, padding: "10px", borderRadius: "10px",
                border: mirrorType === t ? "2px solid #818cf8" : "1px solid rgba(255,255,255,0.1)",
                background: mirrorType === t ? "rgba(129,140,248,0.15)" : "transparent",
                color: mirrorType === t ? "#c7d2fe" : "#64748b",
                fontWeight: 700, fontSize: "13px", cursor: "pointer",
              }}
            >
              {t === "concave" ? "🔵 Concave Mirror (f < 0)" : "🔴 Convex Mirror (f > 0)"}
            </button>
          ))}
        </div>

        {/* Sliders */}
        {[
          { label: "Object distance |u|", value: uMag, min: 5, max: 80, step: 1, set: setUMag, unit: "cm", color: "#60a5fa" },
          { label: `Focal length |f|`, value: fMag, min: 5, max: 40, step: 1, set: setFMag, unit: "cm", color: "#fbbf24" },
        ].map(({ label, value, min, max, step, set, unit, color }) => (
          <div key={label} style={{ marginBottom: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ color: "#94a3b8", fontSize: "12px" }}>{label}</span>
              <span style={{
                color, fontWeight: 700, fontSize: "13px",
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {value} {unit}
              </span>
            </div>
            <input type="range" min={min} max={max} step={step} value={value}
              onChange={e => set(Number(e.target.value))}
              style={{ width: "100%", accentColor: color }}
            />
          </div>
        ))}

        {/* Results panel */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "10px", marginTop: "8px",
        }}>
          {/* Sign convention reminder */}
          <div style={{
            gridColumn: "1/-1", padding: "10px 14px",
            background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.2)",
            borderLeft: "3px solid #818cf8",
            borderRadius: "0 8px 8px 0",
            fontSize: "11px", color: "#94a3b8",
          }}>
            <strong style={{ color: "#818cf8" }}>Sign Convention:</strong>
            {" "}u = {solved.u} cm
            {" | "}f = {solved.f} cm
            {" | "}v = {isFinite(solved.v) ? `${solved.v.toFixed(1)} cm` : "∞"}
          </div>

          <div style={{
            padding: "12px", background: "rgba(251,191,36,0.07)",
            borderRadius: "10px", border: "1px solid rgba(251,191,36,0.2)",
          }}>
            <div style={{ color: "#fbbf24", fontSize: "10px", fontWeight: 700, marginBottom: "4px" }}>
              📐 MIRROR FORMULA
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px", color: "#fde047",
            }}>
              1/v + 1/u = 1/f
            </div>
            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
              v = {isFinite(solved.v) ? `${solved.v.toFixed(1)} cm` : "∞"}
            </div>
          </div>

          <div style={{
            padding: "12px", background: "rgba(34,197,94,0.07)",
            borderRadius: "10px", border: "1px solid rgba(34,197,94,0.2)",
          }}>
            <div style={{ color: "#4ade80", fontSize: "10px", fontWeight: 700, marginBottom: "4px" }}>
              🔭 MAGNIFICATION
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px", color: "#86efac",
            }}>
              m = −v/u = {solved.m.toFixed(2)}
            </div>
            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
              {Math.abs(solved.m) > 1 ? "Enlarged" : Math.abs(solved.m) < 1 ? "Diminished" : "Same size"}
            </div>
          </div>

          {/* Image nature */}
          <div style={{
            gridColumn: "1/-1", padding: "12px 14px",
            background: "rgba(15,23,42,0.8)",
            borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <div style={{ color: "#94a3b8", fontSize: "10px", fontWeight: 700, marginBottom: "6px" }}>
              🖼️ IMAGE NATURE
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <span style={pillStyle(
                solved.isReal ? "#f87171" : "#a78bfa",
                solved.isReal ? "rgba(248,113,113,0.1)" : "rgba(167,139,250,0.1)"
              )}>
                {solved.isReal ? "Real" : "Virtual"}
              </span>
              <span style={pillStyle(
                solved.isErect ? "#4ade80" : "#fb923c",
                solved.isErect ? "rgba(74,222,128,0.1)" : "rgba(251,146,60,0.1)"
              )}>
                {solved.isErect ? "Erect" : "Inverted"}
              </span>
              <span style={pillStyle("#94a3b8", "rgba(148,163,184,0.1)")}>
                {solved.isEnlarged ? "Enlarged" : Math.abs(solved.m) < 0.99 ? "Diminished" : "Same size"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
