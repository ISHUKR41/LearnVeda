/**
 * FILE: LensRayTracerSim.tsx
 * LOCATION: src/components/simulations/light/lenses/LensRayTracerSim.tsx
 *
 * PURPOSE:
 *   Full interactive virtual optics bench. Students place an object at any
 *   distance from a convex or concave lens, then see all three principal
 *   rays drawn in real-time, watch the image form (real/virtual, inverted/
 *   upright, magnified/diminished) and get the live mirror formula result.
 *
 * KEY CONCEPTS:
 *   Lens formula:   1/v − 1/u = 1/f
 *   Magnification:  m = v/u   (and m = hi/ho)
 *   Three principal rays from the object tip:
 *     Ray 1: Parallel to principal axis → passes through F' after lens
 *     Ray 2: Passes through optical centre O → undeviated
 *     Ray 3: Passes through F → emerges parallel after lens
 *
 * CASES SHOWN (auto-detected from u and f):
 *   Convex:  u > 2f  → real, inverted, diminished, beyond F'
 *            u = 2f  → real, inverted, same size, at 2F'
 *            f < u < 2f → real, inverted, magnified, beyond 2F'
 *            u = f   → image at infinity
 *            u < f   → virtual, upright, magnified (magnifying glass!)
 *   Concave: always virtual, upright, diminished, between F and O
 *
 * INTERACTIONS:
 *   - Drag the orange object arrow left/right  (or use the slider)
 *   - Toggle Convex ↔ Concave
 *   - Change focal length f (20–100 cm)
 *   - Rays toggle: show/hide each of the 3 principal rays
 *   - "Case Detective" badge auto-updates
 *
 * LAST UPDATED: 2026-06-11
 */

"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

type LensType = "convex" | "concave";

export default function LensRayTracerSim() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const [lensType,   setLensType]   = useState<LensType>("convex");
  const [focalLen,   setFocalLen]   = useState(60);   /* cm */
  const [objDist,    setObjDist]    = useState(120);  /* |u| in cm, object is on left */
  const [showRay1,   setShowRay1]   = useState(true);
  const [showRay2,   setShowRay2]   = useState(true);
  const [showRay3,   setShowRay3]   = useState(true);

  /* ── Lens formula computation ────────────────────── */
  const computeImage = useCallback(() => {
    /* Sign convention: object on left → u is negative */
    const u  = -Math.abs(objDist);
    const f  = lensType === "convex" ? Math.abs(focalLen) : -Math.abs(focalLen);
    const v  = 1 / (1 / f - 1 / u);          /* 1/v = 1/f + 1/u */
    const m  = v / u;
    return { u, f, v, m };
  }, [objDist, focalLen, lensType]);

  const { u, f, v, m } = computeImage();

  /* ── Nature of image description ─────────────────── */
  const imageNature = useCallback(() => {
    if (Math.abs(v) > 1e6 || !isFinite(v)) return "Image at ∞ (object at F)";
    const parts: string[] = [];
    parts.push(v > 0 ? "Real" : "Virtual");
    parts.push(m < 0 ? "Inverted" : "Upright");
    parts.push(Math.abs(m) > 1.05 ? "Magnified" : Math.abs(m) < 0.95 ? "Diminished" : "Same size");
    return parts.join(" · ");
  }, [v, m]);

  /* ── Draw ─────────────────────────────────────────── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;     /* lens position */
    const cy = H / 2;     /* principal axis */

    /* Background */
    ctx.fillStyle = "#060b14";
    ctx.fillRect(0, 0, W, H);

    /* ── Scale: pixels per cm ─────────────────────── */
    /* We want to show ± 200 cm on screen */
    const RANGE = 200;  /* cm each side */
    const scale = (W / 2) / RANGE;

    const cmToPx = (cm: number) => cx + cm * scale;
    const objTopY = cy - H * 0.22;
    const objH = H * 0.22;

    /* ── Grid lines ───────────────────────────────── */
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    for (let x = -RANGE; x <= RANGE; x += 20) {
      const px = cmToPx(x);
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, H); ctx.stroke();
    }

    /* ── Principal axis ───────────────────────────── */
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.setLineDash([]);

    /* ── Lens ─────────────────────────────────────── */
    const lensH = H * 0.65;
    const lensColor = lensType === "convex" ? "#38bdf8" : "#fb923c";
    ctx.save();
    ctx.strokeStyle = lensColor;
    ctx.lineWidth = 3;
    ctx.shadowColor = lensColor;
    ctx.shadowBlur = 12;

    if (lensType === "convex") {
      /* Double convex — two outward arcs */
      ctx.beginPath();
      ctx.arc(cx - W * 0.04, cy, W * 0.1, -Math.PI * 0.35, Math.PI * 0.35);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + W * 0.04, cy, W * 0.1, Math.PI - Math.PI * 0.35, Math.PI + Math.PI * 0.35);
      ctx.stroke();
    } else {
      /* Double concave — two inward arcs */
      ctx.beginPath();
      ctx.arc(cx + W * 0.04, cy, W * 0.1, Math.PI - Math.PI * 0.35, Math.PI + Math.PI * 0.35);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx - W * 0.04, cy, W * 0.1, -Math.PI * 0.35, Math.PI * 0.35);
      ctx.stroke();
    }

    /* Lens axis arrows */
    ctx.lineWidth = 2;
    ctx.shadowBlur = 0;
    ctx.strokeStyle = `${lensColor}80`;
    ctx.beginPath(); ctx.moveTo(cx, cy - lensH / 2); ctx.lineTo(cx, cy + lensH / 2); ctx.stroke();
    ctx.restore();

    /* Lens label */
    ctx.fillStyle = lensColor;
    ctx.font = `bold ${Math.max(9, W * 0.02)}px 'Space Grotesk', sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(lensType === "convex" ? "Convex (+)" : "Concave (−)", cx, cy - lensH / 2 - 6);

    /* ── Focal points F and F' ────────────────────── */
    const fPx   = cmToPx(f);     /* F' on image side */
    const f2Px  = cmToPx(-Math.abs(focalLen));  /* F on object side */
    const f2fPx = cmToPx(2 * f);
    const f2fNPx = cmToPx(-2 * Math.abs(focalLen));

    const drawFPoint = (px: number, label: string, col: string) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(px, cy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = `bold ${Math.max(8, W * 0.018)}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(label, px, cy + 16);
    };
    drawFPoint(fPx,   "F'",  "#22c55e");
    drawFPoint(f2Px,  "F",   "#22c55e");
    drawFPoint(f2fPx, "2F'", "#4ade8080");
    drawFPoint(f2fNPx,"2F",  "#4ade8080");

    /* ── Object arrow ─────────────────────────────── */
    const uPx = cmToPx(u);   /* u is negative, so this is left of lens */

    ctx.save();
    ctx.strokeStyle = "#f97316";
    ctx.fillStyle   = "#f97316";
    ctx.lineWidth   = 3;
    ctx.shadowColor = "rgba(249,115,22,0.6)";
    ctx.shadowBlur  = 8;
    ctx.beginPath(); ctx.moveTo(uPx, cy); ctx.lineTo(uPx, objTopY + 6); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(uPx, objTopY);
    ctx.lineTo(uPx - 6, objTopY + 10);
    ctx.lineTo(uPx + 6, objTopY + 10);
    ctx.closePath(); ctx.fill();
    ctx.fillText("O", uPx, cy + 16);
    ctx.restore();

    /* ── Image arrow ──────────────────────────────── */
    if (isFinite(v) && Math.abs(v) < RANGE * 0.95) {
      const vPx  = cmToPx(v);
      const imgH = objH * Math.abs(m);
      const imgTopY = m < 0 ? cy + imgH : cy - imgH;

      ctx.save();
      ctx.strokeStyle = v > 0 ? "#a855f7" : "#64748b";
      ctx.fillStyle   = v > 0 ? "#a855f7" : "#64748b";
      ctx.lineWidth   = 2;
      ctx.setLineDash(v < 0 ? [4, 3] : []);
      ctx.shadowColor = "rgba(168,85,247,0.5)";
      ctx.shadowBlur  = 8;
      ctx.beginPath(); ctx.moveTo(vPx, cy); ctx.lineTo(vPx, imgTopY + (m < 0 ? -6 : 6)); ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      const tipY = m < 0 ? imgTopY : imgTopY;
      ctx.moveTo(vPx, tipY);
      ctx.lineTo(vPx - 5, tipY + (m < 0 ? 8 : -8));
      ctx.lineTo(vPx + 5, tipY + (m < 0 ? 8 : -8));
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    /* ── Ray 1: Parallel → through F' ────────────── */
    if (showRay1) {
      ctx.save();
      ctx.strokeStyle = "#fde047";
      ctx.lineWidth   = 1.8;
      ctx.shadowColor = "rgba(253,224,71,0.4)";
      ctx.shadowBlur  = 4;

      /* Incoming: horizontal from object tip to lens */
      ctx.beginPath();
      ctx.moveTo(uPx, objTopY);
      ctx.lineTo(cx, objTopY);
      ctx.stroke();

      /* Outgoing: from lens top through focal point */
      if (isFinite(v)) {
        if (lensType === "convex") {
          /* Goes through F' */
          const slope = (cy - objTopY) / (fPx - cx);
          const endX  = v > 0 ? W : 0;
          const endY  = objTopY + slope * (endX - cx);
          ctx.beginPath(); ctx.moveTo(cx, objTopY); ctx.lineTo(endX, endY); ctx.stroke();
        } else {
          /* Diverges as if coming from F' (on same side as object) */
          const virtFx = cmToPx(Math.abs(focalLen));
          const slope2 = (objTopY - cy) / (cx - virtFx);
          const endX2  = 0;
          const endY2  = objTopY + slope2 * (endX2 - cx);
          ctx.setLineDash([3, 3]);
          ctx.beginPath(); ctx.moveTo(cx, objTopY); ctx.lineTo(virtFx, cy); ctx.stroke();
          ctx.setLineDash([]);
          ctx.beginPath(); ctx.moveTo(cx, objTopY); ctx.lineTo(endX2, endY2); ctx.stroke();
        }
      }
      ctx.restore();
    }

    /* ── Ray 2: Through optical centre — undeviated ─ */
    if (showRay2) {
      ctx.save();
      ctx.strokeStyle = "#34d399";
      ctx.lineWidth   = 1.8;
      ctx.shadowColor = "rgba(52,211,153,0.4)";
      ctx.shadowBlur  = 4;

      const slope2 = (cy - objTopY) / (cx - uPx);
      /* Extend both sides */
      ctx.beginPath();
      ctx.moveTo(uPx, objTopY);
      ctx.lineTo(W, objTopY + slope2 * (W - uPx));
      ctx.stroke();
      ctx.restore();
    }

    /* ── Ray 3: Through F → parallel ─────────────── */
    if (showRay3) {
      ctx.save();
      ctx.strokeStyle = "#f472b6";
      ctx.lineWidth   = 1.8;
      ctx.shadowColor = "rgba(244,114,182,0.4)";
      ctx.shadowBlur  = 4;

      if (lensType === "convex") {
        /* Ray heads from object tip toward F (on object side), then exits parallel */
        const slope3 = (cy - objTopY) / (f2Px - uPx);
        const yAtLens = objTopY + slope3 * (cx - uPx);
        ctx.beginPath(); ctx.moveTo(uPx, objTopY); ctx.lineTo(cx, yAtLens); ctx.stroke();
        /* Emerges horizontal */
        ctx.beginPath(); ctx.moveTo(cx, yAtLens); ctx.lineTo(W, yAtLens); ctx.stroke();
      } else {
        const fVirtX = cmToPx(Math.abs(focalLen));
        const slope3c = (cy - objTopY) / (fVirtX - uPx);
        const yAtLens3 = objTopY + slope3c * (cx - uPx);
        ctx.beginPath(); ctx.moveTo(uPx, objTopY); ctx.lineTo(cx, yAtLens3); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, yAtLens3); ctx.lineTo(0, yAtLens3); ctx.stroke();
      }
      ctx.restore();
    }

    /* ── Formula box ────────────────────────────────── */
    const fmtV = isFinite(v) && Math.abs(v) < 1e5 ? v.toFixed(1) : "∞";
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.beginPath(); ctx.roundRect(6, 6, W * 0.38, 54, 8); ctx.fill();
    ctx.fillStyle = "#60a5fa";
    ctx.font = `bold ${Math.max(9, W * 0.02)}px 'JetBrains Mono', monospace`;
    ctx.textAlign = "left";
    ctx.fillText(`1/v − 1/u = 1/f`, 12, 22);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = `${Math.max(8, W * 0.018)}px 'JetBrains Mono', monospace`;
    ctx.fillText(`v=${fmtV}cm  u=${u}cm  f=${f}cm`, 12, 38);
    ctx.fillText(`m = v/u = ${isFinite(m) ? m.toFixed(2) : "∞"}`, 12, 52);

  }, [lensType, focalLen, objDist, showRay1, showRay2, showRay3, computeImage, u, f, v, m]);

  /* ── Canvas setup ──────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    if (!container) return;
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      canvas.width = w;
      canvas.height = Math.round(w * 0.52);
      draw();
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [draw]);

  useEffect(() => { draw(); }, [draw]);

  const nature = imageNature();

  return (
    <div style={{
      background: "linear-gradient(135deg,#060b14 0%,#0f172a 100%)",
      borderRadius: 16, overflow: "hidden",
      border: "1px solid rgba(56,189,248,0.2)",
      fontFamily: "'Space Grotesk','Inter',sans-serif",
    }}>
      {/* Header */}
      <div style={{ padding: "14px 20px 10px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>🔬</span>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Virtual Optics Bench — Lens Ray Tracer</div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>All 3 principal rays live · 1/v − 1/u = 1/f · real-time case detection</div>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ width: "100%", background: "#060b14" }}>
        <canvas ref={canvasRef} style={{ display: "block", width: "100%" }} />
      </div>

      {/* Controls */}
      <div style={{ padding: "14px 18px", background: "rgba(0,0,0,0.45)" }}>

        {/* Lens type toggle */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {(["convex","concave"] as LensType[]).map(t => (
            <button
              key={t}
              onClick={() => setLensType(t)}
              style={{
                flex: 1,
                background: lensType === t
                  ? t === "convex" ? "rgba(56,189,248,0.2)" : "rgba(251,146,60,0.2)"
                  : "rgba(255,255,255,0.04)",
                border: `1.5px solid ${lensType === t ? (t === "convex" ? "#38bdf8" : "#fb923c") : "rgba(255,255,255,0.1)"}`,
                color: lensType === t ? (t === "convex" ? "#38bdf8" : "#fb923c") : "rgba(255,255,255,0.5)",
                borderRadius: 8, padding: "7px 12px",
                fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                textAlign: "center",
              }}
            >{t === "convex" ? "⬭ Convex (+)" : "⬯ Concave (−)"}</button>
          ))}
        </div>

        {/* Sliders */}
        {[
          {
            label: "📏 Object Distance (u)",
            val: objDist, set: setObjDist, min: 10, max: 199, accent: "#f97316",
            display: `${objDist} cm`,
          },
          {
            label: "🎯 Focal Length (f)",
            val: focalLen, set: setFocalLen, min: 20, max: 100, accent: "#22c55e",
            display: `${focalLen} cm (${lensType === "convex" ? "+" : "−"}${focalLen})`,
          },
        ].map(({ label, val, set, min, max, accent, display }) => (
          <div key={label} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 600 }}>{label}</span>
              <span style={{ color: accent, fontSize: 12, fontFamily: "JetBrains Mono, monospace" }}>{display}</span>
            </div>
            <input type="range" min={min} max={max} value={val}
              onChange={e => set(Number(e.target.value))}
              style={{ width: "100%", accentColor: accent, cursor: "pointer" }}
            />
          </div>
        ))}

        {/* Ray toggles */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          {[
            { label: "Ray 1 — Parallel→F'", active: showRay1, toggle: () => setShowRay1(v => !v), color: "#fde047" },
            { label: "Ray 2 — Through O", active: showRay2, toggle: () => setShowRay2(v => !v), color: "#34d399" },
            { label: "Ray 3 — Through F", active: showRay3, toggle: () => setShowRay3(v => !v), color: "#f472b6" },
          ].map(({ label, active, toggle, color }) => (
            <button
              key={label}
              onClick={toggle}
              style={{
                background: active ? `${color}18` : "rgba(255,255,255,0.03)",
                border: `1px solid ${active ? color : "rgba(255,255,255,0.08)"}`,
                color: active ? color : "rgba(255,255,255,0.3)",
                borderRadius: 7, padding: "4px 10px",
                fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              }}
            >{active ? "✓" : "○"} {label}</button>
          ))}
        </div>

        {/* Image nature card */}
        <div style={{
          background: "linear-gradient(135deg,rgba(96,165,250,0.12),rgba(139,92,246,0.08))",
          border: "1px solid rgba(96,165,250,0.25)",
          borderRadius: 10, padding: "10px 14px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ color: "#60a5fa", fontWeight: 700, fontSize: 12, marginBottom: 3 }}>🔍 Image Nature</div>
            <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600 }}>{nature}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>Magnification</div>
            <div style={{ color: "#a78bfa", fontSize: 16, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>
              {isFinite(m) ? `${m.toFixed(2)}×` : "∞"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
