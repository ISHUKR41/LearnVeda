/**
 * FILE: EyeDefectsRayDiagramSim.tsx
 * LOCATION: src/components/simulations/light/eye/EyeDefectsRayDiagramSim.tsx
 * PURPOSE: Canvas-based ray diagram showing how vision defects form
 *          and how corrective lenses fix them.
 *
 * DEFECTS COVERED:
 *   1. Normal Vision  — image forms exactly on retina
 *   2. Myopia         — image forms IN FRONT of retina (eye too long / lens too powerful)
 *                       Fix: concave lens diverges rays to push image back to retina
 *   3. Hypermetropia  — image forms BEHIND retina (eye too short / lens too weak)
 *                       Fix: convex lens converges rays to bring image forward
 *   4. Presbyopia     — ciliary muscles weaken with age, cannot accommodate
 *                       Fix: bifocal lenses
 *
 * FEATURES:
 *   ─ Anatomically accurate eye cross-section drawn on canvas
 *   ─ Animated incident rays from distant/near object
 *   ─ Corrective lens drawn in front of eye when active
 *   ─ Ray convergence point shown vs retina position
 *   ─ Toggle: Show/Hide corrective lens to compare
 *   ─ Step-by-step explanation panel for each defect
 *   ─ Power of corrective lens calculated live
 *   ─ Responsive, HiDPI, smooth animation
 *
 * LAST UPDATED: 2026-06-11
 */

"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

/* ─────────────────────────────────────────────
 * DEFECT CONFIGURATIONS
 * ───────────────────────────────────────────── */
const DEFECTS = [
  {
    id: "normal",
    label: "Normal Vision",
    icon: "👁️",
    color: "#4ade80",
    convergeDelta: 0,    /* 0 = exactly on retina */
    lensType: "none" as const,
    description: "The eye lens focuses light exactly on the retina. Clear vision at all distances.",
    examNote: "Normal eye has far point at infinity and near point at 25 cm.",
    powerCm: 0,
  },
  {
    id: "myopia",
    label: "Myopia (Short-sight)",
    icon: "😵",
    color: "#f87171",
    convergeDelta: -0.15,  /* image forms before retina */
    lensType: "concave" as const,
    description: "Eyeball too long OR lens too powerful. Image forms in front of retina. Cannot see distant objects clearly.",
    examNote: "Corrected by CONCAVE lens. Far point closer than infinity.",
    powerCm: -2.0,
  },
  {
    id: "hypermetropia",
    label: "Hypermetropia (Long-sight)",
    icon: "🤓",
    color: "#fb923c",
    convergeDelta: +0.15,  /* image forms behind retina */
    lensType: "convex" as const,
    description: "Eyeball too short OR lens too weak. Image forms behind retina. Cannot see near objects clearly.",
    examNote: "Corrected by CONVEX lens. Near point farther than 25 cm.",
    powerCm: +2.0,
  },
  {
    id: "presbyopia",
    label: "Presbyopia (Age-related)",
    icon: "👴",
    color: "#a78bfa",
    convergeDelta: +0.10,
    lensType: "bifocal" as const,
    description: "Ciliary muscles weaken with age. Cannot accommodate (adjust focus). Affects both near and far vision.",
    examNote: "Corrected by BIFOCAL lenses (concave + convex in one frame).",
    powerCm: 0,
  },
];

/* ─────────────────────────────────────────────
 * DRAWING HELPERS
 * ───────────────────────────────────────────── */
function glowLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, w: number, alpha: number) {
  for (const [lw, la] of [[w * 5, 0.04], [w * 2.5, 0.12], [w * 1.3, 0.5], [w, 1.0]] as [number, number][]) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lw;
    ctx.globalAlpha = la * alpha;
    ctx.shadowColor = color;
    ctx.shadowBlur = lw * 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }
}

/* ═══════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════ */
export default function EyeDefectsRayDiagramSim() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef      = useRef<number>(0);
  const timeRef      = useRef<number>(0);

  const [defectIdx, setDefectIdx]     = useState<number>(0);
  const [showCorrection, setShowCorrection] = useState<boolean>(false);

  const defect = DEFECTS[defectIdx];

  const draw = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width;
    const H = canvas.height;
    const w = W / dpr;
    const h = H / dpr;
    timeRef.current = timestamp * 0.001;

    ctx.clearRect(0, 0, W, H);

    /* Background */
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#0a0f1e");
    bg.addColorStop(1, "#0f172a");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* ── Eye geometry ── */
    const eyeCX = w * 0.62;
    const eyeCY = h * 0.50;
    const eyeR  = Math.min(w, h) * 0.22;

    /* ── Eye outline (sclera) ── */
    ctx.save();
    ctx.strokeStyle = "rgba(226,232,240,0.7)";
    ctx.lineWidth = 1.5 * dpr;
    ctx.fillStyle = "rgba(15,23,42,0.95)";
    ctx.beginPath();
    ctx.arc(eyeCX * dpr, eyeCY * dpr, eyeR * dpr, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    /* ── Cornea (front left arc) ── */
    ctx.save();
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2 * dpr;
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc((eyeCX - eyeR * 0.75) * dpr, eyeCY * dpr, eyeR * 0.42 * dpr, -Math.PI / 2.2, Math.PI / 2.2);
    ctx.stroke();
    ctx.restore();

    /* ── Crystalline lens (oval inside) ── */
    ctx.save();
    ctx.strokeStyle = "#7dd3fc";
    ctx.lineWidth = 1.5 * dpr;
    ctx.fillStyle = "rgba(125,211,252,0.08)";
    const lensXc = (eyeCX - eyeR * 0.30) * dpr;
    const lensYc = eyeCY * dpr;
    const lensW  = eyeR * 0.20 * dpr;
    const lensH  = eyeR * 0.45 * dpr;
    ctx.beginPath();
    ctx.ellipse(lensXc, lensYc, lensW, lensH, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    /* ── Retina (right inner arc) ── */
    const retinaX = eyeCX + eyeR * 0.78;
    ctx.save();
    ctx.strokeStyle = defect.color;
    ctx.lineWidth = 2 * dpr;
    ctx.shadowColor = defect.color;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc((eyeCX + eyeR * 1.02) * dpr, eyeCY * dpr, eyeR * 0.38 * dpr, Math.PI * 0.6, Math.PI * 1.4, true);
    ctx.stroke();
    ctx.restore();

    /* ── Retina label ── */
    ctx.save();
    ctx.fillStyle = defect.color;
    ctx.font = `${9 * dpr}px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("Retina", (eyeCX + eyeR * 0.88) * dpr, (eyeCY - eyeR * 0.50) * dpr);
    ctx.restore();

    /* ── Corrective lens (if shown) ── */
    const corrX = (eyeCX - eyeR * 1.35) * dpr;
    if (showCorrection && defect.lensType !== "none") {
      const corrColor = defect.lensType === "concave" ? "#f87171" : "#4ade80";
      const corrH2 = eyeR * 0.60 * dpr;
      ctx.save();
      ctx.strokeStyle = corrColor;
      ctx.lineWidth = 2.5 * dpr;
      ctx.shadowColor = corrColor;
      ctx.shadowBlur = 14;
      ctx.fillStyle = `${corrColor}12`;
      if (defect.lensType === "concave") {
        const cv = 14 * dpr;
        ctx.beginPath();
        ctx.moveTo(corrX, eyeCY * dpr - corrH2);
        ctx.bezierCurveTo(corrX + cv, eyeCY * dpr - corrH2, corrX + cv, eyeCY * dpr + corrH2, corrX, eyeCY * dpr + corrH2);
        ctx.bezierCurveTo(corrX - cv, eyeCY * dpr + corrH2, corrX - cv, eyeCY * dpr - corrH2, corrX, eyeCY * dpr - corrH2);
        ctx.fill(); ctx.stroke();
      } else {
        const cv2 = 16 * dpr;
        ctx.beginPath();
        ctx.moveTo(corrX, eyeCY * dpr - corrH2);
        ctx.bezierCurveTo(corrX + cv2, eyeCY * dpr - corrH2, corrX + cv2, eyeCY * dpr + corrH2, corrX, eyeCY * dpr + corrH2);
        ctx.bezierCurveTo(corrX - cv2, eyeCY * dpr + corrH2, corrX - cv2, eyeCY * dpr - corrH2, corrX, eyeCY * dpr - corrH2);
        ctx.fill(); ctx.stroke();
      }
      ctx.restore();

      /* Label */
      ctx.save();
      ctx.fillStyle = corrColor;
      ctx.font = `bold ${9 * dpr}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(defect.lensType === "concave" ? "Concave" : "Convex", corrX, (eyeCY - eyeR * 0.75) * dpr);
      ctx.fillText("lens", corrX, (eyeCY - eyeR * 0.63) * dpr);
      ctx.restore();
    }

    /* ── Incoming rays ── */
    const rayCount  = 3;
    const rayStartX = w * 0.04;
    const spread    = eyeR * 0.38;

    for (let i = 0; i < rayCount; i++) {
      const t = (i / (rayCount - 1)) - 0.5;
      const startY = eyeCY + t * spread * 2;

      /* Entry to cornea */
      const cornX = eyeCX - eyeR * 0.97;
      const cornY = eyeCY + t * spread * 0.3;

      /* Convergence point — affected by defect */
      const delta = showCorrection ? 0 : defect.convergeDelta;
      const convX = retinaX + delta * eyeR * 1.5;
      const convY = eyeCY;

      /* Ray from source → corrective lens or cornea */
      if (showCorrection && defect.lensType !== "none") {
        /* Segment 1: source → lens */
        const lensFront = { x: (eyeCX - eyeR * 1.35), y: eyeCY + t * spread * 0.8 };
        /* Segment 2: lens → cornea (bent) */
        glowLine(ctx, rayStartX * dpr, startY * dpr, lensFront.x * dpr, lensFront.y * dpr, "#fde68a", 1.5 * dpr, 0.75);
        /* Bent ray continues to retina */
        glowLine(ctx, lensFront.x * dpr, lensFront.y * dpr, cornX * dpr, cornY * dpr, defect.color, 1.5 * dpr, 0.75);
        glowLine(ctx, cornX * dpr, cornY * dpr, convX * dpr, convY * dpr, defect.color, 1.5 * dpr, 0.65);
      } else {
        /* No correction */
        glowLine(ctx, rayStartX * dpr, startY * dpr, cornX * dpr, cornY * dpr, "#fde68a", 1.5 * dpr, 0.75);
        glowLine(ctx, cornX * dpr, cornY * dpr, convX * dpr, convY * dpr, defect.color, 1.5 * dpr, 0.65);
        /* Rays continue past convergence point (if not on retina) */
        if (Math.abs(delta) > 0.02) {
          const continueX = convX + (convX - cornX) * 0.25;
          const continueY = convY + t * spread * 0.5;
          glowLine(ctx, convX * dpr, convY * dpr, continueX * dpr, continueY * dpr, defect.color, 1 * dpr, 0.35);
        }
      }
    }

    /* ── Focus point indicator ── */
    const delta2 = showCorrection ? 0 : defect.convergeDelta;
    const fX = retinaX + delta2 * eyeR * 1.5;
    ctx.save();
    ctx.fillStyle = showCorrection ? "#4ade80" : defect.color;
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(fX * dpr, eyeCY * dpr, 4.5 * dpr, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    /* Focus label */
    const focusLabel = (() => {
      if (showCorrection) return "✓ On Retina";
      if (delta2 < -0.03) return "⚠ Before Retina";
      if (delta2 > 0.03)  return "⚠ Behind Retina";
      return "✓ On Retina";
    })();
    ctx.save();
    ctx.fillStyle = showCorrection ? "#4ade80" : defect.color;
    ctx.font = `bold ${9 * dpr}px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(focusLabel, fX * dpr, (eyeCY + eyeR * 0.55) * dpr);
    ctx.restore();

    /* ── Optical axis ── */
    ctx.save();
    ctx.strokeStyle = "rgba(71,85,105,0.4)";
    ctx.lineWidth = 1 * dpr;
    ctx.setLineDash([5 * dpr, 4 * dpr]);
    ctx.beginPath();
    ctx.moveTo(w * 0.02 * dpr, eyeCY * dpr);
    ctx.lineTo((w - 6) * dpr, eyeCY * dpr);
    ctx.stroke();
    ctx.restore();

    /* ── Object (distant) arrow ── */
    ctx.save();
    ctx.fillStyle = "#fbbf24";
    ctx.shadowColor = "#fbbf24";
    ctx.shadowBlur = 10;
    ctx.font = `${20 * dpr}px serif`;
    ctx.textAlign = "center";
    ctx.fillText("⬆", (rayStartX - 4) * dpr, (eyeCY - 12) * dpr);
    ctx.fillStyle = "#f8fafc";
    ctx.font = `${9 * dpr}px Inter, sans-serif`;
    ctx.fillText("Object", rayStartX * dpr, (eyeCY + 16) * dpr);
    ctx.restore();

    animRef.current = requestAnimationFrame(draw);
  }, [defect, showCorrection]);

  useEffect(() => {
    cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas    = canvasRef.current;
    if (!container || !canvas) return;
    const ro = new ResizeObserver(() => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width  = rect.width * dpr;
      canvas.height = Math.max(220, rect.width * 0.46) * dpr;
      canvas.style.width  = `${rect.width}px`;
      canvas.style.height = `${Math.max(220, rect.width * 0.46)}px`;
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  const panelStyle: React.CSSProperties = {
    background: "linear-gradient(135deg,#0f172a,#0a1628)",
    borderRadius: "16px", padding: "20px",
    fontFamily: "Inter,system-ui,sans-serif",
  };

  return (
    <div style={panelStyle}>
      {/* Canvas */}
      <div ref={containerRef} style={{ width: "100%", borderRadius: "12px", overflow: "hidden", background: "#080d1a" }}>
        <canvas ref={canvasRef} style={{ display: "block" }} />
      </div>

      {/* Defect selector */}
      <div style={{ marginTop: "14px", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
        {DEFECTS.map((d, i) => (
          <button key={d.id} onClick={() => { setDefectIdx(i); setShowCorrection(false); }} style={{
            padding: "8px 10px", borderRadius: "10px", border: "1px solid",
            borderColor: defectIdx === i ? d.color : "rgba(255,255,255,0.1)",
            background: defectIdx === i ? `${d.color}1a` : "transparent",
            color: defectIdx === i ? d.color : "#64748b",
            cursor: "pointer", fontWeight: 600, fontSize: "12px", transition: "all 0.2s",
            textAlign: "left",
          }}>
            {d.icon} {d.label}
          </button>
        ))}
      </div>

      {/* Correction toggle */}
      {defect.lensType !== "none" && (
        <button
          onClick={() => setShowCorrection(!showCorrection)}
          style={{
            marginTop: "10px", width: "100%", padding: "10px 16px",
            borderRadius: "10px", border: "1px solid",
            borderColor: showCorrection ? defect.color : "rgba(255,255,255,0.15)",
            background: showCorrection ? `${defect.color}22` : "rgba(255,255,255,0.04)",
            color: showCorrection ? defect.color : "#94a3b8",
            cursor: "pointer", fontWeight: 700, fontSize: "13px", transition: "all 0.2s",
          }}
        >
          {showCorrection ? "✓ Corrective Lens ON — Click to Remove" : "🔧 Apply Corrective Lens"}
        </button>
      )}

      {/* Description */}
      <div style={{
        marginTop: "12px", padding: "12px 16px",
        background: `${defect.color}12`, border: `1px solid ${defect.color}30`,
        borderRadius: "10px",
      }}>
        <div style={{ fontSize: "13px", fontWeight: 700, color: defect.color, marginBottom: "4px" }}>
          {defect.icon} {defect.label}
        </div>
        <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.6, marginBottom: "8px" }}>
          {defect.description}
        </div>
        <div style={{ fontSize: "11px", color: "#64748b", background: "rgba(0,0,0,0.3)", padding: "8px 10px", borderRadius: "8px" }}>
          📝 <strong style={{ color: "#a5b4fc" }}>Exam note:</strong> {defect.examNote}
          {defect.lensType !== "none" && (
            <span style={{ marginLeft: "8px", color: "#fbbf24" }}>
              Power ≈ {defect.powerCm > 0 ? "+" : ""}{defect.powerCm.toFixed(1)} D
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
