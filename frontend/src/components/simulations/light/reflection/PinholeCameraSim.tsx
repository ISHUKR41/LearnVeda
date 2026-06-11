/**
 * FILE: PinholeCameraSim.tsx
 * LOCATION: src/components/simulations/light/reflection/PinholeCameraSim.tsx
 *
 * PURPOSE:
 *   Interactive pinhole camera (Camera Obscura) simulation showing how light
 *   travels in straight lines to form an inverted real image.
 *
 * KEY CONCEPTS:
 *   - Rectilinear propagation of light — light travels in straight lines
 *   - Pinhole camera: rays from the TOP of the object pass through the hole
 *     and hit the BOTTOM of the screen → image is INVERTED.
 *   - Hole size vs sharpness: smaller hole → sharper image (less blurring)
 *     but DIMMER; larger hole → brighter but blurry.
 *   - Magnification: m = image height / object height = image distance / object distance
 *   - This is the OLDEST camera — used by Renaissance artists (Camera Obscura),
 *     ancestor of modern cameras and the human eye!
 *
 * INTERACTIONS:
 *   - "Object Distance" slider moves the object closer/farther
 *   - "Hole Size" slider changes aperture (small = sharp, large = blurry)
 *   - Live magnification and image size calculations displayed
 *   - Animated light rays from object tip + base through pinhole
 *
 * LAST UPDATED: 2026-06-11
 */

"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

export default function PinholeCameraSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* Sliders */
  const [objDist, setObjDist] = useState(180);   /* pixels: object distance from box */
  const [holeSize, setHoleSize] = useState(3);    /* pixels: radius of pinhole */

  /* ── Draw ─────────────────────────────────────── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    ctx.fillStyle = "#0a0f1a";
    ctx.fillRect(0, 0, W, H);

    /* Layout constants */
    const boxW    = W * 0.32;
    const boxH    = H * 0.55;
    const boxX    = W * 0.5;                /* left edge of camera box */
    const boxY    = (H - boxH) / 2;
    const screenX = boxX + boxW;            /* right (back) wall of box */
    const holeY   = boxY + boxH / 2;        /* pinhole is at middle height */

    /* Object position */
    const normDist  = objDist / 300;        /* 0.6 … 1 */
    const actualDist = normDist * W * 0.38; /* distance in canvas pixels */
    const objectX   = boxX - actualDist;
    const objHeight = H * 0.22;
    const objTopY   = holeY - objHeight;
    const objBotY   = holeY;

    /* Image on screen: magnification = imgDist / objDist */
    const imgDist   = boxW;
    const mag       = imgDist / actualDist;
    const imgHeight = objHeight * mag;
    const imgTopY   = holeY + imgHeight;  /* inverted → top ray hits below centre */
    const imgBotY   = holeY;

    /* ── Camera box ──────────────────────────────── */
    ctx.fillStyle = "rgba(30,41,59,0.9)";
    ctx.strokeStyle = "rgba(99,102,241,0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(boxX, boxY, boxW, boxH);
    ctx.fill();
    ctx.stroke();

    /* Box label */
    ctx.fillStyle = "rgba(99,102,241,0.6)";
    ctx.font = `${Math.max(9, W * 0.02)}px 'Space Grotesk', sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("📦 Camera Box", boxX + boxW / 2, boxY - 8);

    /* ── Screen line ──────────────────────────────── */
    ctx.strokeStyle = "rgba(148,163,184,0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(screenX, boxY);
    ctx.lineTo(screenX, boxY + boxH);
    ctx.stroke();
    ctx.fillStyle = "rgba(148,163,184,0.45)";
    ctx.fillText("Screen", screenX + 12, holeY);

    /* ── Front wall with pinhole ─────────────────── */
    ctx.strokeStyle = "rgba(99,102,241,0.7)";
    ctx.lineWidth = 3;
    /* Wall top segment (above pinhole) */
    ctx.beginPath();
    ctx.moveTo(boxX, boxY);
    ctx.lineTo(boxX, holeY - holeSize);
    ctx.stroke();
    /* Wall bottom segment (below pinhole) */
    ctx.beginPath();
    ctx.moveTo(boxX, holeY + holeSize);
    ctx.lineTo(boxX, boxY + boxH);
    ctx.stroke();

    /* Pinhole highlight */
    ctx.save();
    ctx.shadowColor = "#fde047";
    ctx.shadowBlur = 8 + holeSize * 2;
    ctx.fillStyle = "#fde047";
    ctx.beginPath();
    ctx.arc(boxX, holeY, holeSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    /* ── Object (arrow upward) ───────────────────── */
    ctx.save();
    ctx.strokeStyle = "#f97316";
    ctx.fillStyle = "#f97316";
    ctx.lineWidth = 3;
    ctx.shadowColor = "rgba(249,115,22,0.6)";
    ctx.shadowBlur = 8;
    /* Stem */
    ctx.beginPath();
    ctx.moveTo(objectX, objBotY);
    ctx.lineTo(objectX, objTopY + 8);
    ctx.stroke();
    /* Arrow head */
    ctx.beginPath();
    ctx.moveTo(objectX, objTopY);
    ctx.lineTo(objectX - 6, objTopY + 10);
    ctx.lineTo(objectX + 6, objTopY + 10);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = "rgba(249,115,22,0.8)";
    ctx.font = `bold ${Math.max(10, W * 0.022)}px 'Space Grotesk', sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("Object", objectX, objBotY + 14);

    /* ── Image (inverted arrow) ───────────────────── */
    if (imgHeight > 2) {
      ctx.save();
      ctx.strokeStyle = "rgba(16,185,129,0.9)";
      ctx.fillStyle = "rgba(16,185,129,0.9)";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "rgba(16,185,129,0.5)";
      ctx.shadowBlur = 6;
      /* Stem (going DOWN from holeY — inverted) */
      ctx.beginPath();
      ctx.moveTo(screenX - 5, imgBotY);
      ctx.lineTo(screenX - 5, imgTopY - 8);
      ctx.stroke();
      /* Arrow head pointing DOWN (inverted) */
      ctx.beginPath();
      ctx.moveTo(screenX - 5, imgTopY);
      ctx.lineTo(screenX - 5 - 5, imgTopY - 9);
      ctx.lineTo(screenX - 5 + 5, imgTopY - 9);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = "rgba(16,185,129,0.8)";
      ctx.font = `bold ${Math.max(9, W * 0.019)}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("Image", screenX - 5, imgTopY + 14);
      ctx.font = `${Math.max(8, W * 0.016)}px 'Space Grotesk', sans-serif`;
      ctx.fillText("(inverted)", screenX - 5, imgTopY + 26);
    }

    /* ── Light rays ──────────────────────────────── */
    /* Ray from TOP of object → pinhole → hits BELOW centre on screen */
    /* Ray from BASE of object → pinhole → hits AT centre on screen */
    const rays = [
      {
        from: { x: objectX, y: objTopY },   /* top of object */
        col: "rgba(250,204,21,0.75)",
      },
      {
        from: { x: objectX, y: objBotY },   /* base of object */
        col: "rgba(251,146,60,0.65)",
      },
    ];

    rays.forEach(({ from, col }) => {
      /* Ray to pinhole */
      ctx.save();
      ctx.strokeStyle = col;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = col;
      ctx.shadowBlur = 5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(boxX, holeY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      /* Continue through pinhole to screen */
      /* Slope: (holeY - from.y) / (boxX - from.x) → screen hit = holeY + slope * boxW */
      const slope = (holeY - from.y) / (boxX - from.x);
      const screenHitY = holeY + slope * boxW;
      ctx.save();
      ctx.strokeStyle = col;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = col;
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.moveTo(boxX, holeY);
      ctx.lineTo(screenX, screenHitY);
      ctx.stroke();
      ctx.restore();
    });

    /* ── Dimensions annotation ───────────────────── */
    ctx.fillStyle = "rgba(148,163,184,0.5)";
    ctx.font = `${Math.max(9, W * 0.018)}px 'Space Grotesk', sans-serif`;
    ctx.textAlign = "center";
    /* Object distance arrow */
    const arrowY = boxY + boxH + 20;
    ctx.strokeStyle = "rgba(148,163,184,0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(objectX, arrowY);
    ctx.lineTo(boxX, arrowY);
    ctx.stroke();
    ctx.fillText(`u = ${(actualDist).toFixed(0)} px`, (objectX + boxX) / 2, arrowY - 4);

    /* Image distance */
    ctx.beginPath();
    ctx.moveTo(boxX, arrowY + 16);
    ctx.lineTo(screenX, arrowY + 16);
    ctx.stroke();
    ctx.fillText(`v = ${boxW.toFixed(0)} px`, boxX + boxW / 2, arrowY + 12);

    /* Magnification */
    ctx.fillStyle = mag >= 1
      ? "rgba(74,222,128,0.7)"
      : "rgba(250,204,21,0.7)";
    ctx.font = `bold ${Math.max(10, W * 0.02)}px 'Space Grotesk', sans-serif`;
    ctx.textAlign = "right";
    ctx.fillText(`m = v/u = ${mag.toFixed(2)}`, W - 8, H - 8);

  }, [objDist, holeSize]);

  /* ── Canvas setup ──────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    if (!container) return;
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      canvas.width = w;
      canvas.height = Math.round(w * 0.55);
      draw();
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [draw]);

  useEffect(() => { draw(); }, [draw]);

  const actualDist = (objDist / 300) * 200;
  const boxW_approx = 120;
  const mag = boxW_approx / actualDist;

  return (
    <div style={{
      background: "linear-gradient(135deg,#0a0f1a 0%,#0f172a 100%)",
      borderRadius: 16,
      overflow: "hidden",
      border: "1px solid rgba(249,115,22,0.2)",
      fontFamily: "'Space Grotesk','Inter',sans-serif",
    }}>

      {/* Header */}
      <div style={{
        padding: "14px 20px 10px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontSize: 20 }}>📷</span>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
            Pinhole Camera (Camera Obscura)
          </div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
            Light travels straight → image is inverted and real
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ width: "100%", background: "#0a0f1a" }}>
        <canvas ref={canvasRef} style={{ display: "block", width: "100%" }} />
      </div>

      {/* Controls */}
      <div style={{ padding: "16px 20px", background: "rgba(0,0,0,0.3)" }}>

        {[
          {
            label: "📏 Object Distance", val: objDist, set: setObjDist,
            min: 100, max: 300, accent: "#f97316",
            display: `${Math.round(objDist / 3)} cm (scaled)`,
          },
          {
            label: "🔬 Hole Size", val: holeSize, set: setHoleSize,
            min: 1, max: 14, accent: "#fde047",
            display: holeSize <= 3 ? `${holeSize}px — sharp` : holeSize <= 8 ? `${holeSize}px — blurry` : `${holeSize}px — very blurry`,
          },
        ].map(({ label, val, set, min, max, accent, display }) => (
          <div key={label} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 600 }}>{label}</span>
              <span style={{ color: accent, fontSize: 12, fontFamily: "JetBrains Mono, monospace" }}>{display}</span>
            </div>
            <input
              type="range" min={min} max={max} value={val}
              onChange={e => set(Number(e.target.value))}
              style={{ width: "100%", accentColor: accent, cursor: "pointer" }}
            />
          </div>
        ))}

        {/* Key insight */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8,
        }}>
          {[
            { icon: "🔄", title: "Inverted Image", desc: "Top ray goes through pinhole and hits BOTTOM of screen" },
            { icon: "📏", title: "Magnification", desc: `m = v/u = image_dist/object_dist` },
            { icon: "🔍", title: "Smaller Hole", desc: "Sharper image but dimmer — less light enters" },
            { icon: "📸", title: "Camera Ancestor", desc: "Renaissance artists used Camera Obscura to trace scenes" },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8, padding: "8px 10px",
            }}>
              <div style={{ color: "#f97316", fontWeight: 700, fontSize: 12, marginBottom: 3 }}>
                {icon} {title}
              </div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
