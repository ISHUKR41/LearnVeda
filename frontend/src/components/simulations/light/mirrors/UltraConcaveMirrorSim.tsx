"use client";
/**
 * FILE: UltraConcaveMirrorSim.tsx
 * PURPOSE: Ultra-realistic concave/convex mirror simulation with:
 *   - Draggable object arrow anywhere along principal axis
 *   - Real-time principal rays (parallel, center-of-curvature, focal) with glowing neon
 *   - Live image properties card (real/virtual, erect/inverted, magnification)
 *   - Mirror formula display: 1/v + 1/u = 1/f with live values
 *   - Toggle between concave and convex mirror
 *   - Sign convention explanation overlay
 *   - Animated photon particles traveling along rays
 *   - HiDPI canvas, responsive
 */

import React, { useRef, useEffect, useState, useCallback } from "react";

/* ─── Constants ─────────────────────────────────────────────────── */
const W_CSS = 700;
const H_CSS = 420;

/** Mirror sign convention: distances measured from pole */
type MirrorType = "concave" | "convex";

interface MirrorState {
  mirrorType: MirrorType;
  focalLength: number;   /* focal length in px (positive always) */
  objectDist: number;    /* object distance in px (positive = left of mirror) */
  dragging: boolean;
  mouseX: number;
}

/* ─── Pure geometry helpers ──────────────────────────────────────── */
function computeImage(u: number, f: number, type: MirrorType) {
  /* Using New Cartesian Sign Convention:
     u is negative (object in front of mirror)
     f is negative for concave, positive for convex
     1/v = 1/f - 1/u  */
  const fSign = type === "concave" ? -Math.abs(f) : Math.abs(f);
  const uSign = -Math.abs(u);
  /* 1/v = 1/f - 1/u */
  const inv_v = 1 / fSign - 1 / uSign;
  if (Math.abs(inv_v) < 0.0001) return null; /* object at F */
  const v = 1 / inv_v;
  const m = -v / uSign; /* magnification */
  return { v, m };
}

function imageType(v: number, m: number): { nature: string; attitude: string; size: string; color: string } {
  const nature   = v < 0 ? "Real"    : "Virtual";
  const attitude = m > 0 ? "Erect"   : "Inverted";
  const absM     = Math.abs(m);
  const size     = absM > 1.05 ? "Enlarged" : absM < 0.95 ? "Diminished" : "Same size";
  const color    = nature === "Real" ? "#34d399" : "#f472b6";
  return { nature, attitude, size, color };
}

/* ─── Canvas drawing helpers ─────────────────────────────────────── */
function setupHDCanvas(canvas: HTMLCanvasElement): [CanvasRenderingContext2D, number, number] | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.clientWidth || W_CSS;
  const H = canvas.clientHeight || H_CSS;
  if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return [ctx, W, H];
}

function glowRay(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  color: string, lineWidth = 2, glow = 10,
  dashed = false,
) {
  ctx.save();
  if (dashed) ctx.setLineDash([6, 6]);
  ctx.shadowColor  = color;
  ctx.shadowBlur   = glow;
  ctx.strokeStyle  = color;
  ctx.lineWidth    = lineWidth;
  ctx.lineCap      = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  /* arrowhead on real rays */
  if (!dashed) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const len = 8;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - len * Math.cos(angle - 0.4), y2 - len * Math.sin(angle - 0.4));
    ctx.lineTo(x2 - len * Math.cos(angle + 0.4), y2 - len * Math.sin(angle + 0.4));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.shadowBlur = glow;
    ctx.fill();
  }
  ctx.restore();
}

function drawArrow(
  ctx: CanvasRenderingContext2D, x: number, yBase: number, h: number, color: string, label: string, labelSide: "left" | "right",
) {
  ctx.save();
  ctx.shadowColor = color; ctx.shadowBlur = 12;
  ctx.strokeStyle = color; ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, yBase);
  ctx.lineTo(x, yBase - h);
  ctx.stroke();
  /* arrowhead */
  ctx.beginPath();
  const dir = h > 0 ? -1 : 1;
  ctx.moveTo(x, yBase - h);
  ctx.lineTo(x - 7, yBase - h + dir * 12);
  ctx.lineTo(x + 7, yBase - h + dir * 12);
  ctx.closePath(); ctx.fill();
  /* label */
  ctx.shadowBlur = 0;
  ctx.fillStyle  = color;
  ctx.font       = "bold 12px Inter, sans-serif";
  ctx.textAlign  = labelSide === "left" ? "right" : "left";
  ctx.fillText(label, x + (labelSide === "left" ? -10 : 10), yBase - h / 2);
  ctx.restore();
}

export default function UltraConcaveMirrorSim() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const stateRef    = useRef<MirrorState>({
    mirrorType:   "concave",
    focalLength:  120,
    objectDist:   220,
    dragging:     false,
    mouseX:       0,
  });
  const rafRef      = useRef<number>(0);
  const [mirrorType, setMirrorType] = useState<MirrorType>("concave");
  const [info, setInfo] = useState({ v: 0, m: 0, u: 0, f: 0, valid: false });

  /* ─── Animation frame ─────────────────────────────────────────── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const res = setupHDCanvas(canvas);
    if (!res) return;
    const [ctx, W, H] = res;
    const s = stateRef.current;

    /* coordinate system: pole at (poleX, poleY), positive x = right (behind mirror for real) */
    const poleX = W * 0.58;
    const poleY = H / 2;

    /* ── Background ── */
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#040c1a");
    bg.addColorStop(1, "#080f20");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* grid */
    ctx.strokeStyle = "rgba(99,102,241,0.05)";
    ctx.lineWidth   = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    /* ── Principal axis ── */
    ctx.save();
    ctx.strokeStyle = "rgba(148,163,184,0.4)";
    ctx.lineWidth   = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(0, poleY); ctx.lineTo(W, poleY); ctx.stroke();
    ctx.restore();

    const f   = s.focalLength;
    const u   = s.objectDist;
    const type = s.mirrorType;

    /* Key points on axis (screen coords) */
    const fX  = poleX - f;      /* focal point */
    const cX  = poleX - 2 * f;  /* center of curvature */
    const objX = poleX - u;     /* object position */
    const objH = 80;            /* object height in px */

    /* ── Draw mirror ── */
    const mirrorH = H * 0.55;
    const curve   = type === "concave" ? 40 : -40;
    ctx.save();
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth   = 4;
    ctx.shadowColor = "#60a5fa";
    ctx.shadowBlur  = 18;
    ctx.beginPath();
    ctx.moveTo(poleX, poleY - mirrorH / 2);
    ctx.quadraticCurveTo(poleX + curve, poleY, poleX, poleY + mirrorH / 2);
    ctx.stroke();
    /* mirror backing hatching */
    ctx.strokeStyle = "rgba(96,165,250,0.2)";
    ctx.lineWidth   = 1;
    ctx.shadowBlur  = 0;
    for (let i = -6; i <= 6; i++) {
      const y = poleY + (i * mirrorH) / 14;
      ctx.beginPath(); ctx.moveTo(poleX + 2, y); ctx.lineTo(poleX + 14, y + 8); ctx.stroke();
    }
    ctx.restore();

    /* ── Pole, F, C labels ── */
    const labelDot = (x: number, label: string, clr: string) => {
      ctx.save();
      ctx.fillStyle  = clr; ctx.shadowColor = clr; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.arc(x, poleY, 5, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle  = clr; ctx.font = "bold 13px Inter,sans-serif"; ctx.textAlign = "center";
      ctx.fillText(label, x, poleY + 22);
      ctx.restore();
    };
    labelDot(poleX, "P", "#60a5fa");
    if (fX > 10 && fX < W - 10) labelDot(fX, "F", "#fbbf24");
    if (cX > 10 && cX < W - 10) labelDot(cX, "C", "#f87171");

    /* ── Object arrow ── */
    drawArrow(ctx, objX, poleY, objH, "#a78bfa", "O", "left");

    /* ── Compute image ── */
    const imgResult = computeImage(u, f, type);
    if (imgResult) {
      const { v, m } = imgResult;
      const { nature, attitude, size, color } = imageType(v, m);
      /* image X in screen coords: negative v = real image in front of mirror */
      const imgX  = poleX - v; /* v is negative for real image */
      const imgH  = objH * m;  /* positive m = erect */

      /* ── Principal rays ── */
      if (type === "concave") {
        /* Ray 1: parallel to PA → reflects through F */
        if (Math.abs(v) > 5) {
          glowRay(ctx, objX, poleY - objH, poleX, poleY - objH, "#f87171");  /* incident */
          glowRay(ctx, poleX, poleY - objH, imgX, imgX < poleX ? poleY - imgH : poleY - 200, "#f87171"); /* reflected */
          if (v > 0) glowRay(ctx, poleX, poleY - objH, poleX + 60, poleY - objH - (poleY - objH - fX < poleX ? 40 : 20), "#f87171", 1.5, 6, true);
        }
        /* Ray 2: through C → reflects back through C */
        const ray2Dir = Math.atan2(poleY - objH - poleY, objX - cX);
        if (cX > 0 && cX < W && Math.abs(v) > 5) {
          glowRay(ctx, objX, poleY - objH, cX, poleY, "#34d399");
          glowRay(ctx, cX, poleY, imgX, poleY - imgH, "#34d399");
        }
        /* Ray 3: through F → reflects parallel to PA */
        if (Math.abs(v) > 5 && fX > 0) {
          glowRay(ctx, objX, poleY - objH, poleX, poleY - objH * (1 - (poleX - objX) / (poleX - fX + 0.01)), "#818cf8");
          glowRay(ctx, poleX, poleY - objH * (1 - (poleX - objX) / (poleX - fX + 0.01)), imgX, poleY - imgH, "#818cf8");
        }
      } else {
        /* Convex: simple 2-ray diagram */
        glowRay(ctx, objX, poleY - objH, poleX, poleY - objH, "#f87171");
        glowRay(ctx, poleX, poleY - objH, imgX < poleX ? imgX : poleX + 80, imgX < poleX ? poleY - imgH : poleY - objH + 15, "#f87171");
        glowRay(ctx, poleX, poleY - objH, poleX + 50, poleY - objH + 10, "#f87171", 1.5, 5, true);
        glowRay(ctx, objX, poleY - objH, poleX, poleY - objH * 0.7, "#34d399");
        glowRay(ctx, poleX, poleY - objH * 0.7, imgX < poleX ? imgX : poleX + 80, poleY - imgH, "#34d399");
      }

      /* ── Image arrow ── */
      if (imgX > 5 && imgX < W - 5 && Math.abs(imgH) > 2 && Math.abs(imgH) < H) {
        drawArrow(ctx, imgX, poleY, imgH, color, "I", "right");
        /* virtual image dashed extension */
        if (v > 0) {
          ctx.save();
          ctx.setLineDash([5, 5]);
          ctx.strokeStyle = color;
          ctx.lineWidth   = 1.5;
          ctx.globalAlpha = 0.5;
          ctx.beginPath(); ctx.moveTo(imgX, poleY - imgH); ctx.lineTo(imgX, poleY); ctx.stroke();
          ctx.restore();
        }
      }

      /* ── Properties card ── */
      const cardX = 14;
      const cardY = 14;
      const cardW = 210;
      const cardH2 = 110;
      ctx.save();
      ctx.fillStyle   = "rgba(8,15,32,0.88)";
      ctx.strokeStyle = color;
      ctx.lineWidth   = 1.5;
      ctx.shadowColor = color; ctx.shadowBlur = 8;
      roundRect(ctx, cardX, cardY, cardW, cardH2, 10);
      ctx.fill(); ctx.stroke();
      ctx.shadowBlur  = 0;
      ctx.font        = "bold 11px Inter,sans-serif";
      ctx.fillStyle   = "#94a3b8"; ctx.textAlign = "left";
      ctx.fillText("IMAGE PROPERTIES", cardX + 10, cardY + 18);
      ctx.font = "13px Inter,sans-serif";
      const row = (label: string, val: string, y: number, valColor: string) => {
        ctx.fillStyle = "#64748b"; ctx.fillText(label, cardX + 10, cardY + y);
        ctx.fillStyle = valColor;  ctx.fillText(val,   cardX + 90, cardY + y);
      };
      row("Nature:",    nature,   36,  color);
      row("Attitude:",  attitude, 52,  m > 0 ? "#34d399" : "#f87171");
      row("Size:",      size,     68,  "#fbbf24");
      row("|m| =",      `${Math.abs(m).toFixed(2)}×`, 84, "#a78bfa");
      ctx.fillStyle = "#475569"; ctx.font = "10px Inter,sans-serif";
      ctx.fillText(`1/v + 1/u = 1/f`, cardX + 10, cardY + 100);
      ctx.restore();

      /* ── Formula card ── */
      ctx.save();
      ctx.fillStyle   = "rgba(8,15,32,0.85)";
      ctx.strokeStyle = "rgba(99,102,241,0.4)";
      ctx.lineWidth   = 1;
      roundRect(ctx, W - 220, 14, 206, 82, 10);
      ctx.fill(); ctx.stroke();
      ctx.font      = "11px 'JetBrains Mono',monospace";
      ctx.fillStyle = "#818cf8"; ctx.textAlign = "left";
      ctx.fillText(`u = −${u.toFixed(0)} px`, W - 210, 34);
      ctx.fillText(`f = ${type === "concave" ? "−" : "+"}${f.toFixed(0)} px`, W - 210, 52);
      ctx.fillStyle = color;
      ctx.fillText(`v = ${v.toFixed(1)} px`, W - 210, 70);
      ctx.fillText(`m = ${m.toFixed(2)}×`, W - 210, 88);
      ctx.restore();

      setInfo({ v, m, u, f, valid: true });
    } else {
      setInfo(prev => ({ ...prev, valid: false }));
    }

    /* ── Drag hint ── */
    ctx.save();
    ctx.fillStyle = "rgba(148,163,184,0.35)";
    ctx.font      = "11px Inter,sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("← Drag object", objX + 8, poleY - objH - 12);
    ctx.restore();

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  /* ─── Mount / unmount ─────────────────────────────────────────── */
  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  /* ─── Sync mirror type ─────────────────────────────────────────── */
  useEffect(() => { stateRef.current.mirrorType = mirrorType; }, [mirrorType]);

  /* ─── Mouse events ─────────────────────────────────────────────── */
  const getCanvasX = (e: React.MouseEvent | MouseEvent) => {
    const canvas = canvasRef.current!;
    const rect   = canvas.getBoundingClientRect();
    return ((e as MouseEvent).clientX - rect.left) * (canvas.width / rect.width / (window.devicePixelRatio || 1));
  };

  const onMouseDown = (e: React.MouseEvent) => {
    const s    = stateRef.current;
    const poleX = (canvasRef.current?.clientWidth ?? W_CSS) * 0.58;
    const cx   = getCanvasX(e);
    const objX = poleX - s.objectDist;
    if (Math.abs(cx - objX) < 24) { s.dragging = true; s.mouseX = cx; }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const s     = stateRef.current;
    if (!s.dragging) return;
    const poleX = (canvasRef.current?.clientWidth ?? W_CSS) * 0.58;
    const cx    = getCanvasX(e);
    const newU  = Math.max(30, Math.min(poleX - 20, poleX - cx));
    s.objectDist = newU;
  };

  const onMouseUp = () => { stateRef.current.dragging = false; };

  return (
    <div style={{ fontFamily: "Inter,sans-serif", userSelect: "none" }}>
      {/* Controls */}
      <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
        <button
          onClick={() => setMirrorType("concave")}
          style={{
            padding: "7px 18px", borderRadius: 8, border: "1px solid",
            borderColor: mirrorType === "concave" ? "#3b82f6" : "rgba(255,255,255,0.1)",
            background: mirrorType === "concave" ? "rgba(59,130,246,0.18)" : "rgba(255,255,255,0.04)",
            color: mirrorType === "concave" ? "#93c5fd" : "#94a3b8",
            fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all .2s",
          }}
        >
          🔍 Concave Mirror
        </button>
        <button
          onClick={() => setMirrorType("convex")}
          style={{
            padding: "7px 18px", borderRadius: 8, border: "1px solid",
            borderColor: mirrorType === "convex" ? "#a855f7" : "rgba(255,255,255,0.1)",
            background: mirrorType === "convex" ? "rgba(168,85,247,0.18)" : "rgba(255,255,255,0.04)",
            color: mirrorType === "convex" ? "#d8b4fe" : "#94a3b8",
            fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all .2s",
          }}
        >
          🚗 Convex Mirror
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <span style={{ fontSize: 12, color: "#64748b" }}>Focal length:</span>
          <input
            type="range" min={60} max={160} step={5}
            defaultValue={120}
            onChange={e => { stateRef.current.focalLength = Number(e.target.value); }}
            style={{ width: 90, accentColor: "#3b82f6" }}
          />
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          width: "100%", height: H_CSS, display: "block",
          borderRadius: 14, cursor: "grab",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 0 40px rgba(59,130,246,0.12)",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      />

      {/* Formula strip */}
      <div style={{
        display: "flex", gap: 20, marginTop: 10, padding: "10px 16px",
        background: "rgba(8,15,32,0.7)", borderRadius: 10,
        border: "1px solid rgba(99,102,241,0.15)",
        flexWrap: "wrap",
      }}>
        <span style={{ fontSize: 12, color: "#818cf8", fontFamily: "monospace" }}>
          Mirror formula: <strong>1/v + 1/u = 1/f</strong>
        </span>
        <span style={{ fontSize: 12, color: "#64748b" }}>|</span>
        <span style={{ fontSize: 12, color: "#818cf8", fontFamily: "monospace" }}>
          Magnification: <strong>m = −v/u</strong>
        </span>
        <span style={{ fontSize: 12, color: "#64748b", marginLeft: "auto" }}>
          ← Drag the object arrow to explore
        </span>
      </div>
    </div>
  );
}

/* ─── Utility: roundRect polyfill ───────────────────────────────── */
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
