"use client";
/**
 * FILE: UltraMirrorFormulaSim.tsx
 * PURPOSE: Ultra-realistic mirror formula calculator + magnification visualizer:
 *   - Input u and f with sliders, get v in real time
 *   - Live animated ray diagram updates
 *   - Magnification visualization (object vs image height comparison)
 *   - Sign convention explained with color coding
 *   - 6 standard positions labelled (Beyond C, At C, Between C&F, At F, Between F&P, Behind mirror)
 *   - Quick formula reference card
 */

import React, { useRef, useEffect, useState, useCallback } from "react";

const H_CSS = 420;

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : (() => { ctx.rect(x, y, w, h); })();
  ctx.closePath();
}

export default function UltraMirrorFormulaSim() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const uRef       = useRef(240);   /* object distance (positive px) */
  const fRef       = useRef(120);   /* focal length (positive px) */
  const timeRef    = useRef(0);
  const rafRef     = useRef(0);
  const [u, setU]  = useState(240);
  const [f, setF]  = useState(120);

  /* Compute image: 1/v = 1/f - 1/u (sign: u<0, f<0 for concave) */
  function compute(uPx: number, fPx: number) {
    const fSign = -Math.abs(fPx);   /* concave: f negative */
    const uSign = -Math.abs(uPx);
    const inv_v = 1 / fSign - 1 / uSign;
    if (Math.abs(inv_v) < 0.001) return null;
    const v = 1 / inv_v;
    const m = -v / uSign;
    return { v, m };
  }

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
    timeRef.current += 0.014;
    const t = timeRef.current;

    /* bg */
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#030b14"); bg.addColorStop(1, "#060f1c");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(99,102,241,0.04)"; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    const poleX = W * 0.60;
    const midY  = H * 0.50;
    const uPx   = uRef.current;
    const fPx   = fRef.current;

    /* principal axis */
    ctx.save(); ctx.strokeStyle = "rgba(148,163,184,0.2)"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(W, midY); ctx.stroke(); ctx.restore();

    /* key points */
    const fX   = poleX - fPx;
    const cX   = poleX - 2 * fPx;
    const objX = poleX - uPx;
    const objH = 72;

    /* mirror */
    ctx.save();
    ctx.strokeStyle = "#60a5fa"; ctx.lineWidth = 4; ctx.shadowColor = "#60a5fa"; ctx.shadowBlur = 16;
    ctx.beginPath(); ctx.moveTo(poleX, midY - H * 0.28); ctx.quadraticCurveTo(poleX + 36, midY, poleX, midY + H * 0.28); ctx.stroke();
    ctx.strokeStyle = "rgba(96,165,250,0.18)"; ctx.lineWidth = 1.2; ctx.shadowBlur = 0;
    for (let i = -5; i <= 5; i++) {
      const y = midY + (i * H * 0.28) / 6;
      ctx.beginPath(); ctx.moveTo(poleX + 2, y); ctx.lineTo(poleX + 14, y + 8); ctx.stroke();
    }
    ctx.restore();

    /* dots */
    const dot = (x: number, lbl: string, clr: string) => {
      if (x < 5 || x > W - 5) return;
      ctx.save(); ctx.fillStyle = clr; ctx.shadowColor = clr; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(x, midY, 5, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0; ctx.fillStyle = clr; ctx.font = "bold 12px Inter,sans-serif"; ctx.textAlign = "center";
      ctx.fillText(lbl, x, midY + 20); ctx.restore();
    };
    dot(poleX, "P", "#60a5fa"); dot(fX, "F", "#fbbf24"); dot(cX, "C", "#f87171");
    if (cX - fPx > 5) dot(cX - fPx, "∞", "#64748b");

    /* object */
    ctx.save(); ctx.strokeStyle = "#a78bfa"; ctx.fillStyle = "#a78bfa"; ctx.lineWidth = 3; ctx.shadowColor = "#a78bfa"; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.moveTo(objX, midY); ctx.lineTo(objX, midY - objH); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(objX, midY - objH); ctx.lineTo(objX - 7, midY - objH + 12); ctx.lineTo(objX + 7, midY - objH + 12); ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0; ctx.font = "bold 12px Inter,sans-serif"; ctx.textAlign = "center"; ctx.fillText("O", objX, midY - objH - 12); ctx.restore();

    const result = compute(uPx, fPx);
    const imgColor = result && result.v < 0 ? "#34d399" : "#f472b6";

    if (result) {
      const { v, m } = result;
      const imgX = poleX - v;  /* v negative → real image left of mirror */
      const imgH = objH * m;

      /* Simple principal ray (parallel → F) */
      if (imgX > 5 && imgX < W - 5) {
        ray(ctx, objX, midY - objH, poleX, midY - objH, "#f87171"); /* incident parallel */
        ray(ctx, poleX, midY - objH, imgX, midY - imgH, "#f87171"); /* reflected through F */
        ray(ctx, objX, midY - objH, imgX, midY - imgH, "#fbbf24", true); /* ray through center of curvature */
      }

      /* Image arrow */
      if (Math.abs(imgH) > 2 && Math.abs(imgH) < H * 0.8 && imgX > 5 && imgX < W - 5) {
        ctx.save(); ctx.strokeStyle = imgColor; ctx.fillStyle = imgColor; ctx.lineWidth = 3; ctx.shadowColor = imgColor; ctx.shadowBlur = 14;
        ctx.beginPath(); ctx.moveTo(imgX, midY); ctx.lineTo(imgX, midY - imgH); ctx.stroke();
        const dir = imgH > 0 ? -1 : 1;
        ctx.beginPath(); ctx.moveTo(imgX, midY - imgH); ctx.lineTo(imgX - 7, midY - imgH + dir * 12); ctx.lineTo(imgX + 7, midY - imgH + dir * 12); ctx.closePath(); ctx.fill();
        ctx.shadowBlur = 0; ctx.font = "bold 12px Inter,sans-serif"; ctx.textAlign = "center"; ctx.fillText("I", imgX, midY - imgH + (imgH > 0 ? -14 : 16)); ctx.restore();
      }

      /* Position label */
      const posLabel = getPositionLabel(uPx, fPx);
      ctx.save();
      ctx.fillStyle = "rgba(8,14,30,0.9)"; ctx.strokeStyle = imgColor; ctx.lineWidth = 1.5; ctx.shadowColor = imgColor; ctx.shadowBlur = 6;
      roundRect(ctx, 12, 12, 215, 130, 10); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
      ctx.font = "bold 10px Inter,sans-serif"; ctx.fillStyle = "#64748b"; ctx.textAlign = "left";
      ctx.fillText("MIRROR FORMULA", 22, 28);
      ctx.font = "12px Inter,sans-serif";
      const row = (l: string, val: string, y: number, c: string) => { ctx.fillStyle = "#64748b"; ctx.fillText(l, 22, y); ctx.fillStyle = c; ctx.fillText(val, 100, y); };
      row("u =", `−${uPx.toFixed(0)} px`, 46, "#a78bfa");
      row("f =", `−${fPx.toFixed(0)} px`, 62, "#fbbf24");
      row("v =", `${v.toFixed(1)} px`, 78, imgColor);
      row("m =", `${m.toFixed(3)}×`, 94, Math.abs(m) > 1 ? "#34d399" : "#f87171");
      ctx.fillStyle = "#64748b"; ctx.fillText("Position:", 22, 110);
      ctx.fillStyle = "#818cf8"; ctx.fillText(posLabel, 22, 126);
      ctx.restore();

      /* Image properties */
      ctx.save();
      ctx.fillStyle = "rgba(8,14,30,0.9)"; ctx.strokeStyle = "rgba(99,102,241,0.3)"; ctx.lineWidth = 1;
      roundRect(ctx, W - 200, 12, 188, 100, 10); ctx.fill(); ctx.stroke();
      ctx.font = "bold 10px Inter,sans-serif"; ctx.fillStyle = "#64748b"; ctx.textAlign = "left";
      ctx.fillText("IMAGE PROPERTIES", W - 192, 28);
      ctx.font = "12px Inter,sans-serif";
      ctx.fillStyle = imgColor;      ctx.fillText(v < 0 ? "Real" : "Virtual",    W - 192, 46);
      ctx.fillStyle = m > 0 ? "#34d399" : "#f87171"; ctx.fillText(m > 0 ? "Erect" : "Inverted", W - 192, 62);
      ctx.fillStyle = "#fbbf24";     ctx.fillText(Math.abs(m) > 1.05 ? "Enlarged" : Math.abs(m) < 0.95 ? "Diminished" : "Same size", W - 192, 78);
      ctx.fillStyle = "#a78bfa";     ctx.fillText(`|m| = ${Math.abs(m).toFixed(2)}×`, W - 192, 94);
      ctx.fillStyle = "#64748b";     ctx.fillText("1/v + 1/u = 1/f", W - 192, 108);
      ctx.restore();
    }

    /* photon on ray */
    const ph = (t * 0.6) % 1;
    const ppx = objX + (poleX - objX) * ph;
    const ppy = midY - objH;
    ctx.save(); ctx.fillStyle = "#f87171"; ctx.shadowColor = "#f87171"; ctx.shadowBlur = 16;
    ctx.beginPath(); ctx.arc(ppx, ppy, 3, 0, Math.PI * 2); ctx.fill(); ctx.restore();

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => { rafRef.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(rafRef.current); }, [draw]);

  return (
    <div style={{ fontFamily: "Inter,sans-serif", userSelect: "none" }}>
      <div style={{ display: "flex", gap: 16, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#a78bfa" }}>u (px):</span>
          <input type="range" min={40} max={300} value={u}
            onChange={e => { uRef.current = Number(e.target.value); setU(Number(e.target.value)); }}
            style={{ width: 110, accentColor: "#a78bfa" }} />
          <span style={{ fontSize: 12, color: "#a78bfa", fontFamily: "monospace", minWidth: 36 }}>{u}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#fbbf24" }}>f (px):</span>
          <input type="range" min={50} max={180} value={f}
            onChange={e => { fRef.current = Number(e.target.value); setF(Number(e.target.value)); }}
            style={{ width: 110, accentColor: "#fbbf24" }} />
          <span style={{ fontSize: 12, color: "#fbbf24", fontFamily: "monospace", minWidth: 36 }}>{f}</span>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 12, color: "#64748b" }}>
          {(() => { const r = compute(u, f); return r ? `v = ${r.v.toFixed(1)} px  |  m = ${r.m.toFixed(2)}×` : "Object at F — no image"; })()}
        </div>
      </div>
      <canvas ref={canvasRef}
        style={{ width: "100%", height: H_CSS, display: "block", borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 0 40px rgba(96,165,250,0.1)" }} />
      <div style={{
        marginTop: 10, padding: "10px 14px", background: "rgba(8,14,30,0.85)",
        borderRadius: 10, border: "1px solid rgba(96,165,250,0.15)",
        display: "flex", gap: 20, flexWrap: "wrap",
      }}>
        <span style={{ fontSize: 12, color: "#60a5fa", fontFamily: "monospace" }}><strong>1/v + 1/u = 1/f</strong></span>
        <span style={{ fontSize: 12, color: "#fbbf24", fontFamily: "monospace" }}>m = −v/u = h'/h</span>
        <span style={{ fontSize: 11, color: "#475569", marginLeft: "auto" }}>
          New Cartesian: u,v,f negative for concave (in front)
        </span>
      </div>
    </div>
  );
}

function ray(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, dashed = false) {
  ctx.save();
  if (dashed) ctx.setLineDash([5, 5]);
  ctx.strokeStyle = color; ctx.lineWidth = 1.8; ctx.shadowColor = color; ctx.shadowBlur = 8; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore();
}

function getPositionLabel(u: number, f: number) {
  const ratio = u / f;
  if (ratio > 2.05)  return "Object beyond C → Image between C & F (real, inv, dim)";
  if (ratio > 1.95)  return "Object at C → Image at C (real, inv, same size)";
  if (ratio > 1.05)  return "Object between C & F → Image beyond C (real, inv, large)";
  if (ratio > 0.95)  return "Object at F → Image at infinity";
  return "Object between F & P → Image behind mirror (virtual, erect, large)";
}
