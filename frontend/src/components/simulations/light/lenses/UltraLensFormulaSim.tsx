"use client";
/**
 * FILE: UltraLensFormulaSim.tsx
 * PURPOSE: Power of lens + lens formula interactive calculator:
 *   - Dual lens combination (P = P1 + P2) with visual spacer
 *   - Live 1/v - 1/u = 1/f display
 *   - 6 object positions with live image formation for convex lens
 *   - Power in diopters (P = 100/f_cm)
 *   - Animated light convergence visualization
 */

import React, { useRef, useEffect, useState, useCallback } from "react";

const H_CSS = 400;

export default function UltraLensFormulaSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const f1Ref     = useRef(20);   /* focal length in cm */
  const f2Ref     = useRef(30);
  const uRef      = useRef(-40);  /* object dist cm */
  const timeRef   = useRef(0);
  const rafRef    = useRef(0);
  const [f1, setF1] = useState(20);
  const [f2, setF2] = useState(30);
  const [u,  setU]  = useState(-40);

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

    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#030b14"); bg.addColorStop(1, "#060f1c");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(99,102,241,0.04)"; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    const midY = H * 0.5;
    const cx   = W * 0.5;
    const SCALE = 3;  /* cm to px */

    /* Principal axis */
    ctx.save(); ctx.strokeStyle = "rgba(148,163,184,0.2)"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(W, midY); ctx.stroke(); ctx.restore();

    /* Compute P combined */
    const P1 = 100 / f1Ref.current;  /* diopters */
    const P2 = 100 / f2Ref.current;
    const Pnet = P1 + P2;
    const fNet  = 100 / Pnet;         /* cm */

    /* Single equivalent lens */
    const fPx = fNet * SCALE;
    const uPx = uRef.current * SCALE; /* negative */
    const inv_v = 1 / (fNet) + 1 / uRef.current; /* 1/v = 1/f + 1/u */
    const v = Math.abs(inv_v) > 0.001 ? 1 / inv_v : null;
    const m = v !== null ? v / uRef.current : null;

    /* Draw lens (combined) */
    const lensH = H * 0.6;
    ctx.save();
    ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 3;
    ctx.shadowColor = "#38bdf8"; ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.moveTo(cx, midY - lensH / 2);
    ctx.bezierCurveTo(cx + 36, midY - lensH / 4, cx + 36, midY + lensH / 4, cx, midY + lensH / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, midY - lensH / 2);
    ctx.bezierCurveTo(cx - 36, midY - lensH / 4, cx - 36, midY + lensH / 4, cx, midY + lensH / 2);
    ctx.stroke();
    ctx.fillStyle = "#38bdf8"; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.moveTo(cx, midY - lensH / 2 - 8); ctx.lineTo(cx - 5, midY - lensH / 2 + 4); ctx.lineTo(cx + 5, midY - lensH / 2 + 4); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx, midY + lensH / 2 + 8); ctx.lineTo(cx - 5, midY + lensH / 2 - 4); ctx.lineTo(cx + 5, midY + lensH / 2 - 4); ctx.closePath(); ctx.fill();
    ctx.restore();

    /* Object */
    const objX = cx + uPx * SCALE * 0.4;
    const objH = 70;
    ctx.save();
    ctx.strokeStyle = "#a78bfa"; ctx.fillStyle = "#a78bfa"; ctx.lineWidth = 2.5;
    ctx.shadowColor = "#a78bfa"; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.moveTo(objX, midY); ctx.lineTo(objX, midY - objH); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(objX, midY - objH); ctx.lineTo(objX - 6, midY - objH + 10); ctx.lineTo(objX + 6, midY - objH + 10); ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0; ctx.font = "bold 11px Inter,sans-serif"; ctx.textAlign = "center"; ctx.fillText("O", objX, midY - objH - 10); ctx.restore();

    /* Image */
    if (v !== null && m !== null) {
      const imgX  = cx + v * SCALE * 0.4;
      const imgH  = objH * m;
      const iColor = v > 0 ? "#34d399" : "#f472b6";
      if (Math.abs(imgH) < H * 0.8 && imgX > 10 && imgX < W - 10) {
        ctx.save();
        ctx.strokeStyle = iColor; ctx.fillStyle = iColor; ctx.lineWidth = 2.5;
        ctx.shadowColor = iColor; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.moveTo(imgX, midY); ctx.lineTo(imgX, midY - imgH); ctx.stroke();
        const dir = imgH > 0 ? -1 : 1;
        ctx.beginPath(); ctx.moveTo(imgX, midY - imgH); ctx.lineTo(imgX - 6, midY - imgH + dir * 10); ctx.lineTo(imgX + 6, midY - imgH + dir * 10); ctx.closePath(); ctx.fill();
        ctx.shadowBlur = 0; ctx.font = "bold 11px Inter,sans-serif"; ctx.textAlign = "center"; ctx.fillText("I", imgX, midY - imgH + (imgH > 0 ? -12 : 14)); ctx.restore();
      }
      /* rays */
      ctx.save(); ctx.strokeStyle = "#f87171"; ctx.lineWidth = 1.5; ctx.shadowColor = "#f87171"; ctx.shadowBlur = 6;
      ctx.beginPath(); ctx.moveTo(objX, midY - objH); ctx.lineTo(cx, midY - objH); ctx.stroke();
      if (imgX > 10 && imgX < W - 10) { ctx.beginPath(); ctx.moveTo(cx, midY - objH); ctx.lineTo(imgX, midY - imgH); ctx.stroke(); }
      ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 1.5; ctx.shadowColor = "#fbbf24";
      ctx.beginPath(); ctx.moveTo(objX, midY - objH); ctx.lineTo(imgX, midY - imgH); ctx.stroke();
      ctx.restore();
    }

    /* ── Info panel ── */
    const panH = 88, panW = 210;
    ctx.save();
    ctx.fillStyle = "rgba(6,12,26,0.92)"; ctx.strokeStyle = "rgba(56,189,248,0.4)"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect ? ctx.roundRect(12, 12, panW, panH, 10) : ctx.rect(12, 12, panW, panH); ctx.fill(); ctx.stroke();
    ctx.font = "bold 10px Inter,sans-serif"; ctx.fillStyle = "#64748b"; ctx.textAlign = "left";
    ctx.fillText("LENS COMBINATION", 22, 28);
    ctx.font = "11px 'JetBrains Mono',monospace";
    ctx.fillStyle = "#38bdf8"; ctx.fillText(`P₁ = +${P1.toFixed(1)} D  (f₁ = ${f1Ref.current} cm)`, 22, 44);
    ctx.fillText(`P₂ = +${P2.toFixed(1)} D  (f₂ = ${f2Ref.current} cm)`, 22, 58);
    ctx.fillStyle = "#34d399"; ctx.fillText(`P = P₁ + P₂ = ${Pnet.toFixed(2)} D`, 22, 72);
    ctx.fillStyle = "#fbbf24"; ctx.fillText(`f_eq = ${fNet.toFixed(1)} cm`, 22, 86);
    ctx.restore();

    /* Image result */
    if (v !== null && m !== null) {
      ctx.save();
      ctx.fillStyle = "rgba(6,12,26,0.92)"; ctx.strokeStyle = v > 0 ? "rgba(52,211,153,0.4)" : "rgba(244,114,182,0.4)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(W - 195, 12, 183, 88, 10) : ctx.rect(W - 195, 12, 183, 88); ctx.fill(); ctx.stroke();
      ctx.font = "bold 10px Inter,sans-serif"; ctx.fillStyle = "#64748b"; ctx.textAlign = "left";
      ctx.fillText("LENS FORMULA", W - 185, 28);
      ctx.font = "11px 'JetBrains Mono',monospace";
      ctx.fillStyle = "#a78bfa"; ctx.fillText(`u = ${uRef.current.toFixed(0)} cm`, W - 185, 44);
      ctx.fillStyle = "#fbbf24"; ctx.fillText(`f = ${fNet.toFixed(1)} cm`, W - 185, 58);
      ctx.fillStyle = v > 0 ? "#34d399" : "#f472b6"; ctx.fillText(`v = ${v.toFixed(1)} cm`, W - 185, 72);
      ctx.fillStyle = "#a78bfa"; ctx.fillText(`m = ${m.toFixed(2)}×  (${v > 0 ? "Real" : "Virtual"})`, W - 185, 86);
      ctx.restore();
    }

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => { rafRef.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(rafRef.current); }, [draw]);

  return (
    <div style={{ fontFamily: "Inter,sans-serif", userSelect: "none" }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
        {[
          { label: "f₁ (cm)", val: f1, set: setF1, ref: f1Ref, min: 5, max: 100, color: "#38bdf8" },
          { label: "f₂ (cm)", val: f2, set: setF2, ref: f2Ref, min: 5, max: 100, color: "#a78bfa" },
          { label: "u (cm)", val: -u, set: (v: number) => { setU(-v); uRef.current = -v; }, ref: { current: 0 }, min: 10, max: 100, color: "#fbbf24" },
        ].map(({ label, val, set, ref, min, max, color }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, color }}>{label}:</span>
            <input type="range" min={min} max={max} value={label === "u (cm)" ? -u : val}
              onChange={e => {
                const n = Number(e.target.value);
                if (label === "f₁ (cm)") { f1Ref.current = n; setF1(n); }
                else if (label === "f₂ (cm)") { f2Ref.current = n; setF2(n); }
                else { uRef.current = -n; setU(-n); }
              }}
              style={{ width: 80, accentColor: color }}
            />
            <span style={{ fontSize: 12, color, fontFamily: "monospace", minWidth: 30 }}>
              {label === "u (cm)" ? -u : val}
            </span>
          </div>
        ))}
        <span style={{ fontSize: 12, color: "#34d399", fontFamily: "monospace", marginLeft: "auto" }}>
          P = {(100 / f1 + 100 / f2).toFixed(2)} D
        </span>
      </div>
      <canvas ref={canvasRef}
        style={{ width: "100%", height: H_CSS, display: "block", borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 0 40px rgba(56,189,248,0.1)" }} />
      <div style={{
        marginTop: 10, padding: "10px 16px", background: "rgba(8,14,30,0.85)",
        borderRadius: 10, border: "1px solid rgba(56,189,248,0.15)",
        display: "flex", gap: 20, flexWrap: "wrap",
      }}>
        <span style={{ fontSize: 12, color: "#38bdf8", fontFamily: "monospace" }}><strong>1/v − 1/u = 1/f</strong></span>
        <span style={{ fontSize: 12, color: "#34d399", fontFamily: "monospace" }}>P = 1/f(m)  =  100/f(cm)</span>
        <span style={{ fontSize: 12, color: "#fbbf24", fontFamily: "monospace" }}>P_combined = P₁ + P₂</span>
      </div>
    </div>
  );
}
