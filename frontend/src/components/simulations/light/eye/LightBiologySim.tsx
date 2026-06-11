/**
 * FILE: LightBiologySim.tsx
 * LOCATION: src/components/simulations/light/eye/LightBiologySim.tsx
 *
 * PURPOSE:
 *   Interactive simulation showing how the human eye detects light and
 *   how the pupil, lens, and retina work together — "The eye is just
 *   a biological camera obscura!"
 *
 * KEY CONCEPTS COVERED:
 *   1. Pupil dilation/constriction based on light intensity
 *   2. The crystalline lens changes curvature to focus near/far objects
 *      (accommodation) — like a zoom lens in a camera!
 *   3. Inverted real image formed on the retina (like a pinhole camera)
 *   4. Rods (low-light, B&W) vs Cones (colour, detail)
 *   5. Blind spot: where the optic nerve connects, no photoreceptors
 *   6. Near point (25 cm) and far point (∞) for a normal eye
 *
 * INTERACTIONS:
 *   - "Light Level" slider changes ambient brightness → pupil changes size
 *   - "Object Distance" slider moves object → lens curvature + image position changes
 *   - Animated rays from object tip/base through pupil to retina
 *   - Toggle "Defects" to switch between: Normal / Myopia / Hypermetropia
 *   - Corrective lens appears when defect is selected
 *
 * DESIGN:
 *   Cross-section of the human eye drawn on canvas.
 *   Eye parts labelled: Cornea, Iris/Pupil, Lens, Vitreous, Retina,
 *   Macula, Optic Nerve (blind spot).
 *
 * LAST UPDATED: 2026-06-11
 */

"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

type EyeMode = "normal" | "myopia" | "hypermetropia";

export default function LightBiologySim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lightLevel, setLightLevel] = useState(70);    /* 0=dark, 100=bright */
  const [objDist,   setObjDist]   = useState(60);       /* cm, 10–500 */
  const [mode,      setMode]      = useState<EyeMode>("normal");
  const [time,      setTime]      = useState(0);

  /* ── Animation loop ─────────────────────────────── */
  useEffect(() => {
    let raf: number;
    let t = 0;
    const loop = () => { t += 0.018; setTime(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ── Draw ─────────────────────────────────────── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    /* Background */
    const bgBrightness = Math.round(5 + lightLevel * 0.15);
    ctx.fillStyle = `rgb(${bgBrightness},${bgBrightness},${bgBrightness + 20})`;
    ctx.fillRect(0, 0, W, H);

    /* ── Eye cross-section geometry ─────────────── */
    const eyeCX = W * 0.62;
    const eyeCY = H * 0.5;
    const eyeRX = Math.min(W, H) * 0.28;  /* horizontal radius */
    const eyeRY = Math.min(W, H) * 0.22;  /* vertical radius */

    /* Vitreous (interior) */
    const vitGrad = ctx.createRadialGradient(eyeCX, eyeCY, 0, eyeCX, eyeCY, eyeRX);
    vitGrad.addColorStop(0, "rgba(180,230,255,0.35)");
    vitGrad.addColorStop(1, "rgba(100,160,220,0.12)");
    ctx.beginPath();
    ctx.ellipse(eyeCX, eyeCY, eyeRX, eyeRY, 0, 0, Math.PI * 2);
    ctx.fillStyle = vitGrad;
    ctx.fill();

    /* Eye outline (sclera) */
    ctx.strokeStyle = "rgba(200,200,220,0.6)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(eyeCX, eyeCY, eyeRX, eyeRY, 0, 0, Math.PI * 2);
    ctx.stroke();

    /* ── Cornea (front bulge) ──────────────────── */
    const corneaX = eyeCX - eyeRX;
    ctx.beginPath();
    ctx.arc(corneaX + eyeRX * 0.25, eyeCY, eyeRX * 0.35, Math.PI * 0.6, Math.PI * 1.4, false);
    ctx.strokeStyle = "rgba(200,230,255,0.8)";
    ctx.lineWidth = 3;
    ctx.stroke();

    /* ── Iris & Pupil ──────────────────────────── */
    /* Pupil size: larger when dark, smaller when bright */
    const pupilR = Math.max(
      eyeRY * 0.08,
      eyeRY * (0.45 - lightLevel * 0.003)
    );
    const lensX = eyeCX - eyeRX * 0.55;

    /* Iris (coloured ring) */
    ctx.beginPath();
    ctx.arc(lensX, eyeCY, eyeRY * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(96,130,200,0.6)";
    ctx.fill();

    /* Pupil */
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(lensX, eyeCY, pupilR, 0, Math.PI * 2);
    ctx.fillStyle = "#020408";
    ctx.fill();
    ctx.restore();

    /* ── Crystalline lens ──────────────────────── */
    /* Fatter (shorter focal length) for near objects, thinner for far */
    const lensThick = mode === "myopia"
      ? eyeRY * 0.25  /* myopic eye has fatter lens */
      : mode === "hypermetropia"
      ? eyeRY * 0.14  /* hypermetropic eye has thinner lens */
      : eyeRY * (0.16 + (100 - Math.min(objDist, 100)) * 0.0018);

    ctx.strokeStyle = "rgba(150,220,255,0.8)";
    ctx.lineWidth = 2;

    /* Left curve of lens */
    ctx.beginPath();
    ctx.arc(lensX + lensThick * 2, eyeCY, lensThick * 2.5, Math.PI * 0.65, Math.PI * 1.35, false);
    ctx.stroke();
    /* Right curve */
    ctx.beginPath();
    ctx.arc(lensX - lensThick * 2, eyeCY, lensThick * 2.5, -Math.PI * 0.35, Math.PI * 0.35, false);
    ctx.stroke();

    /* ── Retina area ───────────────────────────── */
    ctx.strokeStyle = "rgba(255,180,100,0.7)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(eyeCX, eyeCY, eyeRX * 0.92, -Math.PI * 0.45, Math.PI * 0.45, false);
    ctx.stroke();

    /* Macula (central vision) */
    ctx.fillStyle = "rgba(255,220,80,0.5)";
    ctx.beginPath();
    ctx.arc(eyeCX + eyeRX * 0.72, eyeCY, eyeRY * 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,220,80,0.8)";
    ctx.font = `${Math.max(8, W * 0.016)}px 'Space Grotesk', sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("Macula", eyeCX + eyeRX * 0.72, eyeCY + eyeRY * 0.2);

    /* Optic nerve (blind spot) */
    ctx.fillStyle = "rgba(255,80,80,0.5)";
    ctx.beginPath();
    ctx.arc(eyeCX + eyeRX * 0.72, eyeCY + eyeRY * 0.4, eyeRY * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,80,80,0.7)";
    ctx.fillText("Blind Spot", eyeCX + eyeRX * 0.72, eyeCY + eyeRY * 0.65);

    /* ── Labels ──────────────────────────────────── */
    ctx.fillStyle = "rgba(200,230,255,0.6)";
    ctx.font = `${Math.max(8, W * 0.016)}px 'Space Grotesk', sans-serif`;
    ctx.textAlign = "center";

    const labels = [
      { text: "Cornea",  x: lensX - eyeRX * 0.45,  y: eyeCY - eyeRY * 0.55 },
      { text: "Iris",    x: lensX,                   y: eyeCY - eyeRY * 0.52 },
      { text: "Lens",    x: lensX + eyeRX * 0.1,    y: eyeCY - eyeRY * 0.5  },
      { text: "Retina",  x: eyeCX + eyeRX * 0.5,    y: eyeCY - eyeRY * 0.6  },
      { text: "Vitreous",x: eyeCX,                   y: eyeCY - eyeRY * 0.55 },
    ];
    labels.forEach(l => {
      ctx.fillText(l.text, l.x, l.y);
    });

    /* ── Corrective lens for defects ─────────────── */
    if (mode !== "normal") {
      const corrX = lensX - eyeRX * 0.5;
      ctx.save();
      ctx.strokeStyle = mode === "myopia" ? "rgba(239,68,68,0.8)" : "rgba(34,197,94,0.8)";
      ctx.lineWidth = 3;
      ctx.shadowColor = mode === "myopia" ? "rgba(239,68,68,0.4)" : "rgba(34,197,94,0.4)";
      ctx.shadowBlur = 8;

      if (mode === "myopia") {
        /* Concave lens (diverging) — curves outward on both sides */
        ctx.beginPath(); ctx.arc(corrX - 6, eyeCY, eyeRY * 0.45, -0.45, 0.45); ctx.stroke();
        ctx.beginPath(); ctx.arc(corrX + 6, eyeCY, eyeRY * 0.45, Math.PI - 0.45, Math.PI + 0.45); ctx.stroke();
        ctx.fillStyle = "rgba(239,68,68,0.7)";
        ctx.font = `bold ${Math.max(8, W * 0.016)}px 'Space Grotesk', sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("Concave\n(−ve)", corrX, eyeCY + eyeRY * 0.65);
      } else {
        /* Convex lens (converging) — curves inward */
        ctx.beginPath(); ctx.arc(corrX + 6, eyeCY, eyeRY * 0.45, Math.PI - 0.45, Math.PI + 0.45); ctx.stroke();
        ctx.beginPath(); ctx.arc(corrX - 6, eyeCY, eyeRY * 0.45, -0.45, 0.45); ctx.stroke();
        ctx.fillStyle = "rgba(34,197,94,0.7)";
        ctx.font = `bold ${Math.max(8, W * 0.016)}px 'Space Grotesk', sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("Convex\n(+ve)", corrX, eyeCY + eyeRY * 0.65);
      }
      ctx.restore();
    }

    /* ── Animated light ray ─────────────────────── */
    /* Ray from object (left edge) through pupil to retina */
    const objX = 20;
    const objH = H * 0.18;
    const objTopY = eyeCY - objH / 2;

    const rayPhase = (time * 0.4) % 1;
    const rayProgress = Math.min(rayPhase, 1);
    const retinaX = eyeCX + eyeRX * 0.78;
    const targetY = eyeCY + objH * 0.3; /* inverted: top of object → below centre on retina */

    /* Segment 1: object to pupil */
    const seg1End = {
      x: objX + (lensX - objX) * Math.min(rayProgress * 1.5, 1),
      y: objTopY + (eyeCY - objTopY) * Math.min(rayProgress * 1.5, 1),
    };

    ctx.save();
    ctx.strokeStyle = "rgba(250,204,21,0.75)";
    ctx.lineWidth = 1.8;
    ctx.shadowColor = "rgba(250,204,21,0.4)";
    ctx.shadowBlur = 5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(objX, objTopY);
    ctx.lineTo(seg1End.x, seg1End.y);
    ctx.stroke();

    /* Segment 2: pupil to retina (bent by lens) */
    if (rayProgress > 0.4) {
      const seg2P = (rayProgress - 0.4) / 0.6;
      const seg2End = {
        x: lensX + (retinaX - lensX) * seg2P,
        y: eyeCY + (targetY - eyeCY) * seg2P,
      };
      ctx.beginPath();
      ctx.moveTo(lensX, eyeCY);
      ctx.lineTo(seg2End.x, seg2End.y);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.restore();

    /* Object arrow */
    ctx.save();
    ctx.strokeStyle = "#f97316";
    ctx.fillStyle = "#f97316";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "rgba(249,115,22,0.5)";
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(objX, eyeCY + objH / 2);
    ctx.lineTo(objX, objTopY + 6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(objX, objTopY);
    ctx.lineTo(objX - 5, objTopY + 8);
    ctx.lineTo(objX + 5, objTopY + 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = "rgba(249,115,22,0.7)";
    ctx.font = `${Math.max(8, W * 0.016)}px 'Space Grotesk', sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("Object", objX, eyeCY + objH / 2 + 14);
    ctx.fillText(`${objDist} cm`, objX, eyeCY + objH / 2 + 24);

    /* ── Defect indicator ────────────────────────── */
    const defectColors: Record<EyeMode, string> = {
      normal: "#4ade80", myopia: "#ef4444", hypermetropia: "#f59e0b",
    };
    const defectLabels: Record<EyeMode, string> = {
      normal: "Normal Vision ✓",
      myopia: "Myopia (Short-Sightedness)",
      hypermetropia: "Hypermetropia (Long-Sightedness)",
    };
    ctx.fillStyle = defectColors[mode];
    ctx.font = `bold ${Math.max(10, W * 0.022)}px 'Space Grotesk', sans-serif`;
    ctx.textAlign = "left";
    ctx.fillText(defectLabels[mode], 10, 18);

    /* Pupil size indicator */
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = `${Math.max(8, W * 0.016)}px 'Space Grotesk', sans-serif`;
    ctx.textAlign = "right";
    ctx.fillText(lightLevel < 30 ? "🌙 Low Light → Pupil Dilated" : lightLevel > 70 ? "☀️ Bright → Pupil Constricted" : "💡 Normal Light", W - 8, 18);

  }, [lightLevel, objDist, mode, time]);

  /* ── Canvas setup ──────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    if (!container) return;
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      canvas.width = w;
      canvas.height = Math.round(w * 0.56);
      draw();
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [draw]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div style={{
      background: "linear-gradient(135deg,#0a0814 0%,#0f172a 100%)",
      borderRadius: 16, overflow: "hidden",
      border: "1px solid rgba(239,68,68,0.2)",
      fontFamily: "'Space Grotesk','Inter',sans-serif",
    }}>
      {/* Header */}
      <div style={{ padding: "14px 20px 10px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>👁</span>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Human Eye — Interactive Biology Lab</div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>Pupil, lens, retina — your eye IS a biological camera</div>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ width: "100%", background: "#0a0814" }}>
        <canvas ref={canvasRef} style={{ display: "block", width: "100%" }} />
      </div>

      {/* Controls */}
      <div style={{ padding: "14px 18px", background: "rgba(0,0,0,0.4)" }}>

        {/* Mode selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          {(["normal","myopia","hypermetropia"] as EyeMode[]).map(m => {
            const colors = { normal: "#4ade80", myopia: "#ef4444", hypermetropia: "#f59e0b" };
            const labels = { normal: "👁 Normal", myopia: "🔴 Myopia", hypermetropia: "🟡 Hypermetropia" };
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  background: mode === m ? `rgba(${hexToRgb(colors[m])},0.2)` : "rgba(255,255,255,0.04)",
                  border: `1.5px solid ${mode === m ? colors[m] : "rgba(255,255,255,0.1)"}`,
                  color: mode === m ? colors[m] : "rgba(255,255,255,0.5)",
                  borderRadius: 8, padding: "6px 12px",
                  fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                }}
              >{labels[m]}</button>
            );
          })}
        </div>

        {/* Sliders */}
        {[
          { label: "☀️ Light Level", val: lightLevel, set: setLightLevel, min: 0, max: 100, accent: "#fbbf24",
            display: lightLevel < 30 ? "Dark — Pupil wide open" : lightLevel > 70 ? "Bright — Pupil tiny" : "Normal" },
          { label: "📏 Object Distance", val: objDist, set: setObjDist, min: 10, max: 500, accent: "#f97316",
            display: `${objDist} cm${objDist < 25 ? " (too close — strain)" : objDist < 100 ? " (near)" : " (far)"}` },
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

        {/* Key facts grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
          {[
            { icon: "🔭", title: "Normal Far Point", desc: "∞ (infinity) — parallel rays focus on retina" },
            { icon: "📏", title: "Normal Near Point", desc: "25 cm — minimum clear vision distance" },
            { icon: "😢", title: "Myopia Fix", desc: "Concave (diverging) lens, −ve power" },
            { icon: "😊", title: "Hypermetropia Fix", desc: "Convex (converging) lens, +ve power" },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "7px 10px" }}>
              <div style={{ color: "#a78bfa", fontWeight: 700, fontSize: 11, marginBottom: 2 }}>{icon} {title}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, lineHeight: 1.4 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
