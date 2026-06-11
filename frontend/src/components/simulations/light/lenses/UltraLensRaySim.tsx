"use client";
/**
 * FILE: UltraLensRaySim.tsx
 * PURPOSE: Ultra-realistic convex/concave lens simulation with:
 *   - Draggable object arrow along principal axis
 *   - 3 animated principal rays (parallel, optical center, focal)
 *   - Real-time image formation with glow
 *   - Live lens formula: 1/v − 1/u = 1/f
 *   - Image properties card (real/virtual, magnification)
 *   - Toggle convex/concave
 *   - Power of lens display P = 1/f (dioptres)
 *   - All 6 positions labelled
 */

import React, { useRef, useEffect, useState, useCallback } from "react";

const H_CSS = 440;

type LensType = "convex" | "concave";

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function glowLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, lw = 2, blur = 12, dashed = false) {
  ctx.save();
  if (dashed) ctx.setLineDash([5, 5]);
  ctx.strokeStyle = color; ctx.lineWidth = lw;
  ctx.shadowColor = color; ctx.shadowBlur = blur;
  ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  if (!dashed) {
    const a = Math.atan2(y2 - y1, x2 - x1);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 9 * Math.cos(a - 0.4), y2 - 9 * Math.sin(a - 0.4));
    ctx.lineTo(x2 - 9 * Math.cos(a + 0.4), y2 - 9 * Math.sin(a + 0.4));
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

function drawArrow(ctx: CanvasRenderingContext2D, x: number, yBase: number, h: number, color: string, label: string) {
  ctx.save();
  ctx.shadowColor = color; ctx.shadowBlur = 14;
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x, yBase); ctx.lineTo(x, yBase - h); ctx.stroke();
  const dir = h > 0 ? -1 : 1;
  ctx.beginPath();
  ctx.moveTo(x, yBase - h);
  ctx.lineTo(x - 7, yBase - h + dir * 12);
  ctx.lineTo(x + 7, yBase - h + dir * 12);
  ctx.closePath(); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.font = "bold 12px Inter,sans-serif"; ctx.textAlign = "center";
  ctx.fillText(label, x, yBase - h - 10 * Math.sign(h));
  ctx.restore();
}

export default function UltraLensRaySim() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const lensTypeRef = useRef<LensType>("convex");
  const objDistRef  = useRef(200);   /* px from lens */
  const focalRef    = useRef(120);   /* px, always positive */
  const draggingRef = useRef(false);
  const rafRef      = useRef(0);

  const [lensType, setLensType] = useState<LensType>("convex");
  const [focalLen, setFocalLen] = useState(120);
  const [info, setInfo] = useState({ v: 0, m: 0, nature: "", attitude: "", power: 0 });

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

    const lensX = W * 0.52;
    const midY  = H / 2;
    const lt    = lensTypeRef.current;
    const f     = focalRef.current;
    const u     = objDistRef.current; /* positive px from lens */
    const objH  = 80;

    /* ─ background ─ */
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#040c1a"); bg.addColorStop(1, "#06101e");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    /* grid */
    ctx.strokeStyle = "rgba(99,102,241,0.04)"; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    /* principal axis */
    ctx.save(); ctx.strokeStyle = "rgba(148,163,184,0.25)"; ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(W, midY); ctx.stroke(); ctx.restore();

    /* ─ focal points ─ */
    const f1X = lensX - f; /* front focal point */
    const f2X = lensX + f; /* back focal point */
    const dot = (x: number, label: string, color: string) => {
      ctx.save();
      ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(x, midY, 5, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0; ctx.fillStyle = color;
      ctx.font = "bold 12px Inter,sans-serif"; ctx.textAlign = "center";
      ctx.fillText(label, x, midY + 22); ctx.restore();
    };
    dot(lensX, "O", "#60a5fa");
    dot(f1X, "F₁", "#fbbf24");
    dot(f2X, "F₂", "#fbbf24");
    if (f1X - f > 20 && f1X - f < W - 20) dot(f1X - f, "2F₁", "#f87171");
    if (f2X + f > 20 && f2X + f < W - 20) dot(f2X + f, "2F₂", "#f87171");

    /* ─ LENS shape ─ */
    ctx.save();
    ctx.strokeStyle = lt === "convex" ? "#38bdf8" : "#a78bfa";
    ctx.lineWidth = 4; ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 20;
    const lensH = H * 0.6;
    const top = midY - lensH / 2, bot = midY + lensH / 2;
    if (lt === "convex") {
      ctx.beginPath();
      ctx.moveTo(lensX, top);
      ctx.bezierCurveTo(lensX + 40, midY - 20, lensX + 40, midY + 20, lensX, bot);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(lensX, top);
      ctx.bezierCurveTo(lensX - 40, midY - 20, lensX - 40, midY + 20, lensX, bot);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(lensX, top);
      ctx.bezierCurveTo(lensX - 30, midY - 20, lensX - 30, midY + 20, lensX, bot);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(lensX, top);
      ctx.bezierCurveTo(lensX + 30, midY - 20, lensX + 30, midY + 20, lensX, bot);
      ctx.stroke();
    }
    /* center line */
    ctx.lineWidth = 2; ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(lensX, top - 8); ctx.lineTo(lensX, top);
    ctx.moveTo(lensX, bot); ctx.lineTo(lensX, bot + 8);
    ctx.stroke();
    /* arrows on lens line */
    const arrLen = 12;
    if (lt === "convex") {
      ctx.fillStyle = ctx.strokeStyle;
      /* top arrow outward */
      ctx.beginPath(); ctx.moveTo(lensX, top - 8);
      ctx.lineTo(lensX - 5, top + 4); ctx.lineTo(lensX + 5, top + 4); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(lensX, bot + 8);
      ctx.lineTo(lensX - 5, bot - 4); ctx.lineTo(lensX + 5, bot - 4); ctx.closePath(); ctx.fill();
    } else {
      ctx.fillStyle = ctx.strokeStyle;
      ctx.beginPath(); ctx.moveTo(lensX, top - 8);
      ctx.lineTo(lensX - 5, top - 20); ctx.lineTo(lensX + 5, top - 20); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(lensX, bot + 8);
      ctx.lineTo(lensX - 5, bot + 20); ctx.lineTo(lensX + 5, bot + 20); ctx.closePath(); ctx.fill();
    }
    ctx.restore();

    /* ─ Object arrow ─ */
    const objX = lensX - u;
    drawArrow(ctx, objX, midY, objH, "#a78bfa", "O");

    /* ─ Lens formula: 1/v - 1/u = 1/f ─ */
    /* Sign convention: u is negative (object on left), f positive for convex, negative for concave */
    const fSign = lt === "convex" ? f : -f;
    const uSign = -u;
    const inv_v = 1 / fSign + 1 / uSign; /* 1/v = 1/f + 1/u */
    const invalid = Math.abs(inv_v) < 0.001;
    if (!invalid) {
      const v  = 1 / inv_v;
      const m  = v / (-uSign); /* m = v/u but u is negative */
      const imgX = lensX + v; /* v positive → real image right side; negative → virtual left side */
      const imgH = objH * m;

      const nature   = v > 0 ? "Real"    : "Virtual";
      const attitude = m > 0 ? "Erect"   : "Inverted";
      const absM     = Math.abs(m);
      const size     = absM > 1.05 ? "Enlarged" : absM < 0.95 ? "Diminished" : "Same size";
      const iColor   = v > 0 ? "#34d399" : "#f472b6";

      /* ─ Principal rays ─ */
      if (lt === "convex") {
        /* Ray 1: parallel → refracts through F₂ */
        glowLine(ctx, objX, midY - objH, lensX, midY - objH, "#f87171");
        glowLine(ctx, lensX, midY - objH, imgX > 10 ? imgX : lensX + 200, imgX > 10 ? midY - imgH : midY - objH - (midY - objH - midY) * 2, "#f87171");
        if (v < 0) glowLine(ctx, lensX, midY - objH, lensX + 80, midY - objH + (midY - objH - midY) * 0.4, "#f87171", 1.5, 5, true);

        /* Ray 2: through optical center → straight */
        if (imgX > 10 && imgX < W) {
          glowLine(ctx, objX, midY - objH, imgX, midY - imgH, "#fbbf24");
        }

        /* Ray 3: aimed at F₁ → emerges parallel */
        const slope = (midY - objH - midY) / (objX - f1X + 0.01);
        const yAtLens = midY - objH + slope * (lensX - objX);
        glowLine(ctx, objX, midY - objH, lensX, yAtLens, "#34d399");
        glowLine(ctx, lensX, yAtLens, imgX > 10 ? imgX : lensX + 200, imgX > 10 ? midY - imgH : yAtLens, "#34d399");
      } else {
        /* Concave: ray parallel → diverges as if from F₁ */
        glowLine(ctx, objX, midY - objH, lensX, midY - objH, "#f87171");
        const extX = lensX + 120;
        const extY = midY - objH + (midY - objH - midY) * 0.3;
        glowLine(ctx, lensX, midY - objH, extX, extY, "#f87171");
        /* extension to F₁ (dashed) */
        glowLine(ctx, lensX, midY - objH, f1X, midY, "#f87171", 1.2, 5, true);

        /* Ray through optical center */
        if (imgX > 0 && imgX < W) {
          glowLine(ctx, objX, midY - objH, imgX, midY - imgH, "#fbbf24");
        }
      }

      /* ─ Image arrow ─ */
      if (imgX > 5 && imgX < W - 5 && Math.abs(imgH) > 2 && Math.abs(imgH) < H * 0.9) {
        drawArrow(ctx, imgX, midY, imgH, iColor, "I");
        if (v < 0) {
          ctx.save(); ctx.setLineDash([5, 5]); ctx.strokeStyle = iColor;
          ctx.lineWidth = 1.5; ctx.globalAlpha = 0.5;
          ctx.beginPath(); ctx.moveTo(imgX, midY - imgH); ctx.lineTo(imgX, midY); ctx.stroke();
          ctx.restore();
        }
      }

      /* ─ Properties card ─ */
      ctx.save();
      ctx.fillStyle = "rgba(8,14,30,0.9)"; ctx.strokeStyle = iColor; ctx.lineWidth = 1.5;
      ctx.shadowColor = iColor; ctx.shadowBlur = 8;
      roundRect(ctx, 12, 12, 205, 116, 10); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
      ctx.font = "bold 10px Inter,sans-serif"; ctx.fillStyle = "#64748b"; ctx.textAlign = "left";
      ctx.fillText("IMAGE PROPERTIES", 22, 30);
      const row = (lbl: string, val: string, y: number, c: string) => {
        ctx.fillStyle = "#64748b"; ctx.fillText(lbl, 22, y);
        ctx.fillStyle = c;          ctx.fillText(val, 100, y);
      };
      row("Nature:", nature,   48, iColor);
      row("Attitude:", attitude, 64, m > 0 ? "#34d399" : "#f87171");
      row("Size:", size,      80, "#fbbf24");
      row("|m| =", `${Math.abs(m).toFixed(2)}×`, 96, "#a78bfa");
      ctx.fillStyle = "#334155"; ctx.font = "10px Inter,sans-serif";
      ctx.fillText(`1/v − 1/u = 1/f`, 22, 112);
      ctx.restore();

      /* ─ Formula card ─ */
      ctx.save();
      ctx.fillStyle = "rgba(8,14,30,0.88)"; ctx.strokeStyle = "rgba(99,102,241,0.35)"; ctx.lineWidth = 1;
      roundRect(ctx, W - 200, 12, 188, 88, 10); ctx.fill(); ctx.stroke();
      ctx.font = "11px 'JetBrains Mono',monospace"; ctx.fillStyle = "#818cf8"; ctx.textAlign = "left";
      ctx.fillText(`u = −${u.toFixed(0)} px`, W - 192, 32);
      ctx.fillText(`f = ${lt === "convex" ? "+" : "−"}${f.toFixed(0)} px`, W - 192, 50);
      ctx.fillStyle = iColor;
      ctx.fillText(`v = ${v.toFixed(1)} px`, W - 192, 68);
      ctx.fillText(`P = ${(1 / (fSign / 100)).toFixed(2)} D`, W - 192, 86);
      ctx.restore();

      setInfo({ v, m, nature, attitude, power: 1 / (fSign / 100) });
    }

    /* drag hint */
    const objX2 = lensX - objDistRef.current;
    ctx.save(); ctx.fillStyle = "rgba(148,163,184,0.4)"; ctx.font = "11px Inter,sans-serif"; ctx.textAlign = "center";
    ctx.fillText("← drag", objX2, midY - 100); ctx.restore();

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => { rafRef.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(rafRef.current); }, [draw]);
  useEffect(() => { lensTypeRef.current = lensType; }, [lensType]);
  useEffect(() => { focalRef.current = focalLen; }, [focalLen]);

  const onMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width / (window.devicePixelRatio || 1));
    const lensX = (canvas.clientWidth || 700) * 0.52;
    if (Math.abs(mx - (lensX - objDistRef.current)) < 22) draggingRef.current = true;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!draggingRef.current) return;
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width / (window.devicePixelRatio || 1));
    const lensX = (canvas.clientWidth || 700) * 0.52;
    objDistRef.current = Math.max(20, Math.min(lensX - 20, lensX - mx));
  };
  const onMouseUp = () => { draggingRef.current = false; };

  return (
    <div style={{ fontFamily: "Inter,sans-serif", userSelect: "none" }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
        <button onClick={() => setLensType("convex")} style={{
          padding: "7px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
          border: "1px solid", borderColor: lensType === "convex" ? "#38bdf8" : "rgba(255,255,255,0.1)",
          background: lensType === "convex" ? "rgba(56,189,248,0.15)" : "rgba(255,255,255,0.03)",
          color: lensType === "convex" ? "#7dd3fc" : "#94a3b8", transition: "all .2s",
        }}>🔬 Convex Lens</button>
        <button onClick={() => setLensType("concave")} style={{
          padding: "7px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
          border: "1px solid", borderColor: lensType === "concave" ? "#a78bfa" : "rgba(255,255,255,0.1)",
          background: lensType === "concave" ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.03)",
          color: lensType === "concave" ? "#c4b5fd" : "#94a3b8", transition: "all .2s",
        }}>🔎 Concave Lens</button>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <span style={{ fontSize: 12, color: "#64748b" }}>f =</span>
          <input type="range" min={60} max={180} step={5} value={focalLen}
            onChange={e => setFocalLen(Number(e.target.value))}
            style={{ width: 90, accentColor: lensType === "convex" ? "#38bdf8" : "#a78bfa" }}
          />
          <span style={{ fontSize: 12, color: "#fbbf24", fontFamily: "monospace" }}>{focalLen}px</span>
        </div>
      </div>
      <canvas ref={canvasRef}
        style={{ width: "100%", height: H_CSS, display: "block", borderRadius: 14, cursor: "grab",
          border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 0 40px rgba(56,189,248,0.08)" }}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
      />
      <div style={{
        display: "flex", gap: 20, marginTop: 10, padding: "10px 16px",
        background: "rgba(8,14,30,0.8)", borderRadius: 10, border: "1px solid rgba(56,189,248,0.12)",
        flexWrap: "wrap",
      }}>
        <span style={{ fontSize: 12, color: "#38bdf8", fontFamily: "monospace" }}><strong>1/v − 1/u = 1/f</strong></span>
        <span style={{ color: "#1e3a5f" }}>|</span>
        <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: "monospace" }}>m = v/u</span>
        <span style={{ color: "#1e3a5f" }}>|</span>
        <span style={{ fontSize: 12, color: "#fbbf24", fontFamily: "monospace" }}>P = {info.power.toFixed(2)} D</span>
        <span style={{ fontSize: 12, color: "#64748b", marginLeft: "auto" }}>← Drag object to explore</span>
      </div>
    </div>
  );
}
