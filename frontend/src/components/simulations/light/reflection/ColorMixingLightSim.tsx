/**
 * FILE: ColorMixingLightSim.tsx
 * LOCATION: src/components/simulations/light/reflection/ColorMixingLightSim.tsx
 *
 * PURPOSE:
 *   Interactive additive colour-mixing simulation inspired by the clean,
 *   card-based design of skills.sh. Three RGB spotlights shine on a stage —
 *   students drag sliders to control intensity and watch colours blend live.
 *
 * KEY CONCEPTS DEMONSTRATED:
 *   - Additive colour mixing (light): R+G=Yellow, R+B=Magenta, G+B=Cyan,
 *     R+G+B=White — opposite to subtractive (paint/pigment) mixing.
 *   - Primary colours of light: Red (700nm), Green (546nm), Blue (436nm).
 *   - Why a TV screen glows white from tiny R, G, B sub-pixels.
 *   - Complementary colour pairs and their applications (photography,
 *     stage lighting, CRT/LCD displays, photography, printing).
 *
 * SIMULATION DESIGN (Canvas-based, SSR disabled):
 *   - Three circular "spotlight" beams radiate from top-left, top-centre,
 *     top-right corners and overlap in the centre of the canvas.
 *   - Overlap regions rendered with globalCompositeOperation "screen"
 *     (correct for additive light mixing).
 *   - Sliders below canvas control each channel's intensity (0–100%).
 *   - Live colour badge shows the HEX code and colour name of the
 *     final blended centre circle.
 *   - "Real World" panel shows the current mix applied to 3 examples:
 *     TV screen pixel, stage spotlight, sunset gradient.
 *
 * LAST UPDATED: 2026-06-11
 */

"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════
 * TYPES
 * ═══════════════════════════════════════════════════ */
interface RGBChannel {
  value: number; /* 0 – 255 */
  label: string;
  color: string; /* CSS color for slider thumb */
  emoji: string;
}

/* ═══════════════════════════════════════════════════
 * HELPER — determine the mix name for three channels
 * ═══════════════════════════════════════════════════ */
function getMixName(r: number, g: number, b: number): string {
  const rOn = r > 60, gOn = g > 60, bOn = b > 60;
  if (!rOn && !gOn && !bOn) return "Black — no light";
  if (rOn && !gOn && !bOn)  return "Red Light";
  if (!rOn && gOn && !bOn)  return "Green Light";
  if (!rOn && !gOn && bOn)  return "Blue Light";
  if (rOn && gOn && !bOn)   return "Yellow (Red + Green)";
  if (rOn && !gOn && bOn)   return "Magenta (Red + Blue)";
  if (!rOn && gOn && bOn)   return "Cyan (Green + Blue)";
  if (rOn && gOn && bOn)    return "White — all three mixed!";
  return "Mixed Colour";
}

/* ═══════════════════════════════════════════════════
 * toHex helper
 * ═══════════════════════════════════════════════════ */
function toHex(n: number): string {
  return n.toString(16).padStart(2, "0").toUpperCase();
}

/* ═══════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════ */
export default function ColorMixingLightSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* RGB channel intensities 0–255 */
  const [red,   setRed]   = useState(200);
  const [green, setGreen] = useState(0);
  const [blue,  setBlue]  = useState(200);

  /* ── Draw function ─────────────────────────────── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    /* Dark stage background */
    ctx.fillStyle = "#0a0a12";
    ctx.fillRect(0, 0, W, H);

    /* Center of mixing area */
    const cx = W / 2;
    const cy = H * 0.52;
    const R = Math.min(W, H) * 0.28;    /* spotlight beam radius */
    const offset = R * 0.45;              /* how far each beam centre is offset */

    /* Three spotlight origin centres (top-left, top, top-right) */
    const spots = [
      { x: cx - offset, y: cy - offset, r: red,   g: 0,     b: 0   },
      { x: cx,          y: cy - offset, r: 0,     g: green, b: 0   },
      { x: cx + offset, y: cy - offset, r: 0,     g: 0,     b: blue},
    ];

    /* Use screen blending for additive light */
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    spots.forEach(({ x, y, r, g, b }) => {
      const intensity = Math.max(r, g, b);
      if (intensity === 0) return;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, R * 1.3);
      const alpha = (intensity / 255).toFixed(2);
      grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
      grad.addColorStop(0.5, `rgba(${r},${g},${b},${(intensity / 255 * 0.6).toFixed(2)})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(x, y, R * 1.3, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    ctx.restore();

    /* Spotlight labels */
    ctx.save();
    ctx.font = `bold ${Math.max(11, W * 0.022)}px 'Space Grotesk', sans-serif`;
    ctx.textAlign = "center";

    const labelData = [
      { x: cx - offset, y: cy - offset - R * 0.6, text: "🔴 Red", col: `rgb(${red},50,50)` },
      { x: cx,          y: cy - offset - R * 0.6, text: "🟢 Green", col: `rgb(50,${green},50)` },
      { x: cx + offset, y: cy - offset - R * 0.6, text: "🔵 Blue", col: `rgb(50,50,${blue})` },
    ];
    labelData.forEach(({ x, y, text, col }) => {
      ctx.fillStyle = col;
      ctx.fillText(text, x, y);
    });
    ctx.restore();

    /* Centre mix circle — filled with the actual blended colour */
    const mixR = Math.min(255, red);
    const mixG = Math.min(255, green);
    const mixB = Math.min(255, blue);

    ctx.beginPath();
    ctx.arc(cx, cy + offset * 0.3, R * 0.32, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${mixR},${mixG},${mixB})`;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    /* Mix label inside centre circle */
    const brightness = (mixR * 299 + mixG * 587 + mixB * 114) / 1000;
    ctx.fillStyle = brightness > 128 ? "#111" : "#fff";
    ctx.font = `bold ${Math.max(10, W * 0.019)}px 'Space Grotesk', sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("MIX", cx, cy + offset * 0.3);
    ctx.textBaseline = "alphabetic";

  }, [red, green, blue]);

  /* ── Canvas setup ──────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    if (!container) return;

    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = Math.round(w * 0.55);
      canvas.width = w;
      canvas.height = h;
      draw();
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [draw]);

  useEffect(() => { draw(); }, [draw]);

  const hexCode = `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
  const mixName = getMixName(red, green, blue);

  return (
    <div style={{
      background: "linear-gradient(135deg,#0f0f1e 0%,#1a1a2e 100%)",
      borderRadius: 16,
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.08)",
      fontFamily: "'Space Grotesk', 'Inter', sans-serif",
    }}>

      {/* Header */}
      <div style={{
        padding: "14px 20px 10px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontSize: 20 }}>🎨</span>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
            Additive Colour Mixing Lab
          </div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
            Mix light like a TV pixel — Red + Green + Blue = White
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ position: "relative", width: "100%", background: "#0a0a12" }}>
        <canvas ref={canvasRef} style={{ display: "block", width: "100%" }} />
      </div>

      {/* Controls */}
      <div style={{ padding: "16px 20px", background: "rgba(0,0,0,0.4)" }}>

        {/* Mix result badge */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 10, padding: "10px 16px",
          marginBottom: 16,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: `rgb(${red},${green},${blue})`,
            border: "2px solid rgba(255,255,255,0.2)",
            flexShrink: 0,
          }} />
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{mixName}</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}>{hexCode}</div>
          </div>
        </div>

        {/* RGB Sliders */}
        {[
          { label: "🔴 Red",   val: red,   set: setRed,   accent: "#ef4444" },
          { label: "🟢 Green", val: green, set: setGreen, accent: "#22c55e" },
          { label: "🔵 Blue",  val: blue,  set: setBlue,  accent: "#3b82f6" },
        ].map(({ label, val, set, accent }) => (
          <div key={label} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600 }}>{label}</span>
              <span style={{ color: accent, fontSize: 13, fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>
                {val} ({Math.round(val / 255 * 100)}%)
              </span>
            </div>
            <input
              type="range" min={0} max={255} value={val}
              onChange={e => set(Number(e.target.value))}
              style={{ width: "100%", accentColor: accent, height: 4, cursor: "pointer" }}
            />
          </div>
        ))}

        {/* Preset colour buttons */}
        <div style={{ marginTop: 14 }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Quick Presets
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { name: "Yellow",  r: 255, g: 255, b: 0   },
              { name: "Cyan",    r: 0,   g: 255, b: 255 },
              { name: "Magenta", r: 255, g: 0,   b: 255 },
              { name: "White",   r: 255, g: 255, b: 255 },
              { name: "Reset",   r: 200, g: 0,   b: 200 },
            ].map(({ name, r, g, b }) => (
              <button
                key={name}
                onClick={() => { setRed(r); setGreen(g); setBlue(b); }}
                style={{
                  background: `rgb(${r},${g},${b})`,
                  color: (r + g + b > 400) ? "#000" : "#fff",
                  border: "none", borderRadius: 6, padding: "5px 12px",
                  fontSize: 12, fontWeight: 700, cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >{name}</button>
            ))}
          </div>
        </div>

        {/* Fun fact */}
        <div style={{
          marginTop: 16,
          background: "linear-gradient(135deg,rgba(59,130,246,0.12),rgba(139,92,246,0.12))",
          border: "1px solid rgba(59,130,246,0.25)",
          borderRadius: 10, padding: "10px 14px",
        }}>
          <div style={{ color: "#60a5fa", fontWeight: 700, fontSize: 12, marginBottom: 3 }}>⚡ Real World</div>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, lineHeight: 1.6 }}>
            Your phone screen has millions of tiny pixels — each one a cluster of Red, Green, and Blue sub-LEDs.
            When all three glow at full power → you see pure White. Turn off all three → Black screen.
            This is <strong style={{ color: "#93c5fd" }}>additive mixing</strong> — opposite to paint mixing!
          </div>
        </div>
      </div>
    </div>
  );
}
