"use client";
/**
 * FILE: UltraHumanEyeSim.tsx
 * PURPOSE: Ultra-realistic human eye simulation with:
 *   - Anatomically accurate eye cross-section (animated)
 *   - Normal vision, myopia (nearsightedness), hypermetropia (farsightedness)
 *   - Animated light rays converging on retina
 *   - Corrective lens overlay with before/after comparison
 *   - Accommodation animation (lens shape changing)
 *   - Near/far object slider
 *   - Animated ciliary muscle indicators
 */

import React, { useRef, useEffect, useState, useCallback } from "react";

const H_CSS = 460;
type EyeMode = "normal" | "myopia" | "hypermetropia";

export default function UltraHumanEyeSim() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const modeRef    = useRef<EyeMode>("normal");
  const corrRef    = useRef(false);
  const distRef    = useRef(0.5);  /* 0=near, 1=far */
  const timeRef    = useRef(0);
  const rafRef     = useRef(0);

  const [mode,       setMode]      = useState<EyeMode>("normal");
  const [corrected,  setCorrected] = useState(false);
  const [dist,       setDist]      = useState(0.5);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const W   = canvas.clientWidth || 700;
    const H   = canvas.clientHeight || H_CSS;
    if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
      canvas.width = W * dpr; canvas.height = H * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    timeRef.current += 0.015;
    const t = timeRef.current;

    /* ─ Background ─ */
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#030b15"); bg.addColorStop(1, "#06101e");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(99,102,241,0.04)"; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    const eyeCX = W * 0.55;
    const eyeCY = H * 0.50;
    const eyeR  = Math.min(W, H) * 0.26;
    const md    = modeRef.current;
    const corr  = corrRef.current;
    const d     = distRef.current;

    /* ─ Object (candle) ─ */
    const objX = W * (0.04 + d * 0.08);
    drawCandle(ctx, objX, eyeCY, t);

    /* ─ Light rays from object ─ */
    /* Cornea entry points */
    const numRays = 5;
    const rayColors = ["#fbbf24", "#f59e0b", "#fcd34d", "#fde68a", "#fed7aa"];

    for (let ri = 0; ri < numRays; ri++) {
      const frac = ri / (numRays - 1);
      const entryY = eyeCY + (frac - 0.5) * eyeR * 0.8;
      const entryX = eyeCX - eyeR * Math.sqrt(1 - ((entryY - eyeCY) / eyeR) ** 2) * 0.97;

      /* corrective lens */
      let startX = entryX;
      if (corr && md !== "normal") {
        const lensX = entryX - 30;
        const lensColor = md === "myopia" ? "rgba(248,113,113,0.6)" : "rgba(52,211,153,0.6)";
        ctx.save();
        ctx.strokeStyle = lensColor; ctx.lineWidth = 2; ctx.shadowColor = lensColor; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.moveTo(lensX, eyeCY - eyeR * 0.55); ctx.lineTo(lensX, eyeCY + eyeR * 0.55); ctx.stroke();
        ctx.restore();
        startX = lensX;
      }

      /* ray from object → cornea */
      ctx.save();
      ctx.strokeStyle = rayColors[ri]; ctx.lineWidth = 1.5;
      ctx.shadowColor = "#fbbf24"; ctx.shadowBlur = 8; ctx.globalAlpha = 0.75;
      ctx.beginPath(); ctx.moveTo(objX + 8, eyeCY - 20 + ri * 5); ctx.lineTo(startX, entryY); ctx.stroke();
      ctx.restore();

      /* Where does the refracted ray converge? */
      let focusX: number;
      const retX = eyeCX + eyeR * 0.88;  /* retina position */
      if (md === "normal" || corr) {
        focusX = retX;
      } else if (md === "myopia") {
        focusX = retX - eyeR * 0.25;     /* image forms BEFORE retina */
      } else {
        focusX = retX + eyeR * 0.22;     /* image forms BEHIND retina */
      }

      /* lens position (inside eye) */
      const lensIX = eyeCX - eyeR * 0.12;
      /* animated lens bulge for accommodation */
      const bulgeFactor = md === "normal" ? (1 - d) * 0.15 : 0.08;
      const lensWidth   = 14 + bulgeFactor * 20;

      /* ray inside eye: entry → lens → focus point */
      const focusY = eyeCY;  /* converge on axis */
      ctx.save();
      ctx.strokeStyle = rayColors[ri]; ctx.lineWidth = 1.2;
      ctx.shadowColor = "#fbbf24"; ctx.shadowBlur = 6; ctx.globalAlpha = 0.65;
      ctx.beginPath();
      ctx.moveTo(entryX, entryY);
      ctx.lineTo(lensIX, (entryY + focusY) / 2);
      ctx.lineTo(focusX, focusY + (entryY - eyeCY) * (focusX < retX ? -0.05 : 0.08));
      ctx.stroke();
      if (focusX > retX) {
        /* extend beyond retina (hypermetropia) */
        ctx.globalAlpha = 0.3; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(retX, focusY + (entryY - eyeCY) * 0.02); ctx.lineTo(focusX, focusY); ctx.stroke();
      }
      ctx.restore();

      /* animated photon */
      const phase = (t * 0.5 + ri * 0.18) % 1;
      const px = objX + 8 + (focusX - (objX + 8)) * phase;
      const py = eyeCY - 20 + ri * 5 + (focusY - (eyeCY - 20 + ri * 5)) * phase;
      ctx.save();
      ctx.fillStyle = rayColors[ri]; ctx.shadowColor = "#fbbf24"; ctx.shadowBlur = 16;
      ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    /* ─ Eye anatomy ─ */
    drawEyeAnatomy(ctx, eyeCX, eyeCY, eyeR, t, md);

    /* ─ Focus point indicator ─ */
    const retX2 = eyeCX + eyeR * 0.88;
    let focusX2: number;
    if (md === "normal" || corr) {
      focusX2 = retX2;
    } else if (md === "myopia") {
      focusX2 = retX2 - eyeR * 0.25;
    } else {
      focusX2 = retX2 + eyeR * 0.22;
    }

    const focColor = (md === "normal" || corr) ? "#34d399" : "#f87171";
    ctx.save();
    ctx.fillStyle = focColor; ctx.strokeStyle = focColor;
    ctx.shadowColor = focColor; ctx.shadowBlur = 20;
    ctx.beginPath(); ctx.arc(focusX2, eyeCY, 6, 0, Math.PI * 2); ctx.fill();
    ctx.font = "bold 12px Inter,sans-serif"; ctx.textAlign = "center"; ctx.shadowBlur = 8;
    ctx.fillText(
      (md === "normal" || corr) ? "✓ On Retina" :
      md === "myopia" ? "Before Retina" : "Behind Retina",
      focusX2, eyeCY - 16,
    );
    ctx.restore();

    /* ─ Info card ─ */
    drawInfoCard(ctx, 12, 12, md, corr, d);

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => { rafRef.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(rafRef.current); }, [draw]);
  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { corrRef.current = corrected; }, [corrected]);
  useEffect(() => { distRef.current = dist; }, [dist]);

  const btnStyle = (active: boolean, color: string) => ({
    padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
    border: "1px solid", borderColor: active ? color : "rgba(255,255,255,0.1)",
    background: active ? `${color}28` : "transparent",
    color: active ? color : "#94a3b8", transition: "all .2s",
  } as React.CSSProperties);

  return (
    <div style={{ fontFamily: "Inter,sans-serif", userSelect: "none" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
        <button onClick={() => { setMode("normal"); setCorrected(false); }} style={btnStyle(mode === "normal", "#34d399")}>👁️ Normal Eye</button>
        <button onClick={() => setMode("myopia")}    style={btnStyle(mode === "myopia",    "#f87171")}>😵 Myopia</button>
        <button onClick={() => setMode("hypermetropia")} style={btnStyle(mode === "hypermetropia", "#fbbf24")}>🤓 Hypermetropia</button>
        {mode !== "normal" && (
          <button onClick={() => setCorrected(c => !c)} style={btnStyle(corrected, corrected ? "#34d399" : "#818cf8")}>
            {corrected ? "✅ Corrected" : "🔧 Add Correction"}
          </button>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <span style={{ fontSize: 11, color: "#64748b" }}>Near</span>
          <input type="range" min={0} max={1} step={0.05} value={dist}
            onChange={e => setDist(Number(e.target.value))}
            style={{ width: 90, accentColor: "#818cf8" }} />
          <span style={{ fontSize: 11, color: "#64748b" }}>Far</span>
        </div>
      </div>
      <canvas ref={canvasRef}
        style={{ width: "100%", height: H_CSS, display: "block", borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 0 40px rgba(239,68,68,0.08)" }} />
      <div style={{
        marginTop: 10, padding: "10px 14px", background: "rgba(8,14,30,0.85)",
        borderRadius: 10, border: "1px solid rgba(239,68,68,0.12)",
        fontSize: 12, color: "#94a3b8",
      }}>
        {mode === "normal" && "✅ Normal eye: image focuses exactly on retina. Far point = ∞, Near point = 25 cm (least distance of distinct vision)."}
        {mode === "myopia" && !corrected && "😵 Myopia: eyeball too long or lens too convex → image forms BEFORE retina → blurry for distant objects. Correction: Concave (diverging) lens."}
        {mode === "myopia" && corrected && "✅ Myopia corrected with CONCAVE lens (negative power). Concave lens diverges rays before they enter the eye, pushing the focal point back to the retina."}
        {mode === "hypermetropia" && !corrected && "🤓 Hypermetropia: eyeball too short → image forms BEHIND retina → blurry for near objects. Correction: Convex (converging) lens."}
        {mode === "hypermetropia" && corrected && "✅ Hypermetropia corrected with CONVEX lens (positive power). Convex lens converges rays earlier, moving the focal point forward onto the retina."}
      </div>
    </div>
  );
}

function drawCandle(ctx: CanvasRenderingContext2D, x: number, y: number, t: number) {
  /* Body */
  ctx.save();
  ctx.fillStyle = "#f3e8d0"; ctx.strokeStyle = "#d97706"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.rect(x - 5, y - 4, 10, 24); ctx.fill(); ctx.stroke();
  /* Flame */
  const flicker = Math.sin(t * 8) * 2;
  const flameGrad = ctx.createRadialGradient(x, y - 14 + flicker * 0.3, 0, x, y - 14, 12);
  flameGrad.addColorStop(0, "#fef3c7");
  flameGrad.addColorStop(0.5, "#f59e0b");
  flameGrad.addColorStop(1, "transparent");
  ctx.fillStyle = flameGrad; ctx.shadowColor = "#f59e0b"; ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.moveTo(x, y - 28 + flicker);
  ctx.bezierCurveTo(x + 7, y - 20, x + 6, y - 14, x, y - 10);
  ctx.bezierCurveTo(x - 6, y - 14, x - 7, y - 20, x, y - 28 + flicker);
  ctx.fill();
  ctx.fillStyle = "#e2e8f0"; ctx.font = "10px Inter,sans-serif"; ctx.textAlign = "center"; ctx.shadowBlur = 0;
  ctx.fillText("Object", x, y + 30);
  ctx.restore();
}

function drawEyeAnatomy(
  ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number,
  t: number, mode: EyeMode,
) {
  /* Sclera (white of eye) */
  ctx.save();
  const scleraGrad = ctx.createRadialGradient(cx - R * 0.1, cy - R * 0.1, 0, cx, cy, R);
  scleraGrad.addColorStop(0, "rgba(240,234,220,0.15)");
  scleraGrad.addColorStop(1, "rgba(200,190,170,0.08)");
  ctx.fillStyle = scleraGrad;
  ctx.strokeStyle = "rgba(226,208,180,0.35)"; ctx.lineWidth = 2;
  ctx.shadowColor = "rgba(226,208,180,0.2)"; ctx.shadowBlur = 14;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();

  /* Cornea (front curved surface) */
  ctx.save();
  ctx.strokeStyle = "rgba(147,197,253,0.7)"; ctx.lineWidth = 2.5;
  ctx.shadowColor = "#93c5fd"; ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(cx - R * 0.82, cy, R * 0.38, -Math.PI * 0.42, Math.PI * 0.42);
  ctx.stroke();
  ctx.fillStyle = "rgba(147,197,253,0.15)";
  ctx.fill();
  ctx.fillStyle = "rgba(147,197,253,0.6)"; ctx.font = "10px Inter,sans-serif"; ctx.textAlign = "right";
  ctx.shadowBlur = 0; ctx.fillText("Cornea", cx - R * 0.86, cy - R * 0.36);
  ctx.restore();

  /* Iris */
  ctx.save();
  const irisGrad = ctx.createRadialGradient(cx - R * 0.38, cy, 0, cx - R * 0.38, cy, R * 0.22);
  irisGrad.addColorStop(0, "rgba(30,90,180,0.9)");
  irisGrad.addColorStop(1, "rgba(20,60,130,0.5)");
  ctx.fillStyle   = irisGrad;
  ctx.strokeStyle = "rgba(56,130,246,0.6)"; ctx.lineWidth = 1.5;
  ctx.shadowColor = "#3b82f6"; ctx.shadowBlur = 10;
  ctx.beginPath(); ctx.arc(cx - R * 0.38, cy, R * 0.22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  /* Pupil */
  ctx.fillStyle = "#000"; ctx.shadowBlur = 0;
  ctx.beginPath(); ctx.arc(cx - R * 0.38, cy, R * 0.10, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  /* Crystalline lens (animated accommodation) */
  const bulgeFactor = mode === "normal" ? 0.1 + Math.sin(t * 0.6) * 0.02 : 0.08;
  const lensX = cx - R * 0.12;
  const lensH = R * 0.48;
  const lensW = R * (0.12 + bulgeFactor);
  ctx.save();
  const lensGrad = ctx.createLinearGradient(lensX - lensW, cy - lensH * 0.5, lensX + lensW, cy + lensH * 0.5);
  lensGrad.addColorStop(0, "rgba(254,243,199,0.7)");
  lensGrad.addColorStop(1, "rgba(253,230,138,0.5)");
  ctx.fillStyle = lensGrad; ctx.strokeStyle = "rgba(253,230,138,0.6)"; ctx.lineWidth = 1.5;
  ctx.shadowColor = "#fde68a"; ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(lensX, cy - lensH * 0.5);
  ctx.bezierCurveTo(lensX + lensW, cy - lensH * 0.2, lensX + lensW, cy + lensH * 0.2, lensX, cy + lensH * 0.5);
  ctx.bezierCurveTo(lensX - lensW, cy + lensH * 0.2, lensX - lensW, cy - lensH * 0.2, lensX, cy - lensH * 0.5);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = "rgba(253,230,138,0.5)"; ctx.font = "10px Inter,sans-serif"; ctx.textAlign = "center"; ctx.shadowBlur = 0;
  ctx.fillText("Lens", lensX, cy + lensH * 0.5 + 14);
  ctx.restore();

  /* Retina */
  ctx.save();
  ctx.strokeStyle = mode === "normal" ? "rgba(239,68,68,0.7)" : "rgba(239,68,68,0.4)";
  ctx.lineWidth = 3; ctx.shadowColor = "#ef4444"; ctx.shadowBlur = 12;
  ctx.beginPath(); ctx.arc(cx + R * 0.5, cy, R * 0.62, -Math.PI * 0.38, Math.PI * 0.38); ctx.stroke();
  ctx.fillStyle = "#ef4444"; ctx.font = "10px Inter,sans-serif"; ctx.textAlign = "left"; ctx.shadowBlur = 0;
  ctx.fillText("Retina", cx + R * 0.88, cy - R * 0.18);
  /* Optic nerve spot */
  ctx.fillStyle = "rgba(239,68,68,0.4)";
  ctx.beginPath(); ctx.arc(cx + R * 0.84, cy, R * 0.06, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#ef4444"; ctx.font = "9px Inter,sans-serif";
  ctx.fillText("Optic nerve", cx + R * 0.9, cy + R * 0.14);
  ctx.restore();

  /* Optic axis */
  ctx.save(); ctx.strokeStyle = "rgba(148,163,184,0.2)"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(cx - R * 1.2, cy); ctx.lineTo(cx + R, cy); ctx.stroke(); ctx.restore();
}

function drawInfoCard(ctx: CanvasRenderingContext2D, x: number, y: number, mode: EyeMode, corr: boolean, dist: number) {
  const w = 195, h = 100;
  const color = mode === "normal" || corr ? "#34d399" : mode === "myopia" ? "#f87171" : "#fbbf24";
  ctx.save();
  ctx.fillStyle = "rgba(6,12,26,0.92)"; ctx.strokeStyle = color; ctx.lineWidth = 1.5;
  ctx.shadowColor = color; ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(x, y, w, h, 10) : (() => { ctx.rect(x, y, w, h); })();
  ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
  ctx.font = "bold 10px Inter,sans-serif"; ctx.fillStyle = "#64748b"; ctx.textAlign = "left";
  ctx.fillText("EYE STATUS", x + 10, y + 16);
  ctx.font = "12px Inter,sans-serif"; ctx.fillStyle = color;
  ctx.fillText(mode === "normal" ? "Normal Vision" : mode === "myopia" ? "Myopia (Short-sight)" : "Hypermetropia (Long-sight)", x + 10, y + 34);
  ctx.fillStyle = "#94a3b8"; ctx.font = "11px Inter,sans-serif";
  ctx.fillText(`Defect: ${mode === "normal" ? "None" : mode === "myopia" ? "Concave lens needed" : "Convex lens needed"}`, x + 10, y + 52);
  ctx.fillText(`Correction: ${corr ? "Applied ✓" : mode === "normal" ? "—" : "Not applied"}`, x + 10, y + 68);
  ctx.fillText(`Object distance: ${dist < 0.3 ? "Near" : dist > 0.7 ? "Far" : "Medium"}`, x + 10, y + 84);
  ctx.restore();
}
