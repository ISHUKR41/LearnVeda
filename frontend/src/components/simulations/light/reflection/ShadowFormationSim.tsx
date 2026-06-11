/**
 * FILE: ShadowFormationSim.tsx
 * LOCATION: src/components/simulations/light/reflection/ShadowFormationSim.tsx
 *
 * PURPOSE:
 *   Interactive simulation of shadow and eclipse formation — proof that
 *   light travels in straight lines (rectilinear propagation).
 *
 * KEY CONCEPTS:
 *   1. Umbra: Region of complete shadow (no direct light reaches)
 *   2. Penumbra: Partial shadow (some light, some blocked)
 *   3. For a POINT source: only umbra, sharp shadow
 *   4. For an EXTENDED source: umbra + penumbra, soft shadow edges
 *   5. Solar eclipse: Moon's umbra → total eclipse, penumbra → partial eclipse
 *   6. Lunar eclipse: Earth's umbra covers the Moon
 *   7. Pinhole camera: inverted image from rectilinear propagation
 *
 * INTERACTIONS:
 *   - "Source size" slider: point → small → extended (affects shadow sharpness)
 *   - "Object distance" slider: moves opaque object closer/farther from screen
 *   - "Screen distance" slider: moves the screen
 *   - Toggle: Normal shadow / Solar eclipse / Lunar eclipse modes
 *   - "Rays" toggle: show individual rays from extended source
 *
 * LAST UPDATED: 2026-06-11
 */

"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

type Mode = "shadow" | "solar" | "lunar";

export default function ShadowFormationSim() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const [mode,     setMode]     = useState<Mode>("shadow");
  const [srcSize,  setSrcSize]  = useState(20);   /* 0 = point, 100 = extended */
  const [objDist,  setObjDist]  = useState(40);   /* % of width */
  const [scrDist,  setScrDist]  = useState(85);   /* % of width where screen is */
  const [showRays, setShowRays] = useState(true);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cy = H / 2;

    /* ── Background ──────────────────────────────── */
    ctx.fillStyle = "#04090f";
    ctx.fillRect(0, 0, W, H);

    /* ── Setup positions ──────────────────────────── */
    const srcX  = W * 0.08;
    const objX  = W * (objDist / 100);
    const scrX  = W * (scrDist / 100);

    /* Source radius */
    const srcR  = srcSize < 5 ? 3 : 3 + srcSize * 0.14;

    /* Object radius */
    const objR  = mode === "solar"  ? H * 0.07 :
                  mode === "lunar"  ? H * 0.055 :
                  H * 0.12;

    /* ── Compute umbra / penumbra geometry ─────────── */
    /* For extended source (srcR > 0): */
    /* Upper edge of umbra ray: from top of source to top of object, extended */
    /* Lower edge of umbra ray: from bottom of source to bottom of object, extended */
    /* Upper edge of penumbra ray: from bottom of source to top of object */
    /* Lower edge of penumbra ray: from top of source to bottom of object */

    const srcTop    = cy - srcR;
    const srcBot    = cy + srcR;
    const objTop    = cy - objR;
    const objBot    = cy + objR;

    /* Umbra edges (where both rays converge to form complete shadow) */
    const umbTopSlope  = (objTop - srcTop) / (objX - srcX);
    const umbBotSlope  = (objBot - srcBot) / (objX - srcX);

    const umbTopAtScr  = objTop + umbTopSlope * (scrX - objX);
    const umbBotAtScr  = objBot + umbBotSlope * (scrX - objX);

    /* Penumbra edges */
    const penTopSlope  = (objTop - srcBot) / (objX - srcX);   /* bot-src → top-obj */
    const penBotSlope  = (objBot - srcTop) / (objX - srcX);   /* top-src → bot-obj */

    const penTopAtScr  = objTop + penTopSlope * (scrX - objX);
    const penBotAtScr  = objBot + penBotSlope * (scrX - objX);

    /* ── Draw rays from source edges to object ──────── */
    if (showRays) {
      /* Upper-edge ray (creates top umbra boundary) */
      ctx.save();
      ctx.strokeStyle = "rgba(253,224,71,0.35)";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(srcX, srcTop);
      ctx.lineTo(objX, objTop);
      ctx.lineTo(Math.min(scrX + 10, W), objTop + umbTopSlope * (W - objX)); ctx.stroke();

      /* Lower-edge ray */
      ctx.beginPath(); ctx.moveTo(srcX, srcBot);
      ctx.lineTo(objX, objBot);
      ctx.lineTo(Math.min(scrX + 10, W), objBot + umbBotSlope * (W - objX)); ctx.stroke();

      if (srcSize > 5) {
        /* Penumbra rays (softer) */
        ctx.strokeStyle = "rgba(253,224,71,0.15)";
        ctx.beginPath(); ctx.moveTo(srcX, srcBot);
        ctx.lineTo(objX, objTop);
        ctx.lineTo(Math.min(scrX + 10, W), objTop + penTopSlope * (W - objX)); ctx.stroke();

        ctx.beginPath(); ctx.moveTo(srcX, srcTop);
        ctx.lineTo(objX, objBot);
        ctx.lineTo(Math.min(scrX + 10, W), objBot + penBotSlope * (W - objX)); ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.restore();
    }

    /* ── Screen ───────────────────────────────────── */
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(scrX, 8); ctx.lineTo(scrX, H - 8); ctx.stroke();

    /* Screen illuminated: gradient from lit → penumbra → umbra */
    /* Top lit region */
    if (penTopAtScr > 8) {
      ctx.fillStyle = "rgba(253,224,71,0.45)";
      ctx.fillRect(scrX, 8, 8, penTopAtScr - 8);
    }

    /* Top penumbra gradient */
    if (srcSize > 5 && penTopAtScr < umbTopAtScr) {
      const penGrad = ctx.createLinearGradient(0, penTopAtScr, 0, umbTopAtScr);
      penGrad.addColorStop(0, "rgba(253,224,71,0.45)");
      penGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = penGrad;
      ctx.fillRect(scrX, penTopAtScr, 8, umbTopAtScr - penTopAtScr);
    }

    /* Umbra (complete shadow) */
    const umbraTop = Math.max(umbTopAtScr, 8);
    const umbraBot = Math.min(umbBotAtScr, H - 8);
    if (umbraBot > umbraTop) {
      ctx.fillStyle = "rgba(0,0,0,0.95)";
      ctx.fillRect(scrX, umbraTop, 8, umbraBot - umbraTop);
    }

    /* Bottom penumbra gradient */
    if (srcSize > 5 && umbBotAtScr < penBotAtScr) {
      const penGrad2 = ctx.createLinearGradient(0, umbBotAtScr, 0, penBotAtScr);
      penGrad2.addColorStop(0, "rgba(0,0,0,0)");
      penGrad2.addColorStop(1, "rgba(253,224,71,0.45)");
      ctx.fillStyle = penGrad2;
      ctx.fillRect(scrX, umbBotAtScr, 8, penBotAtScr - umbBotAtScr);
    }

    /* Bottom lit region */
    if (penBotAtScr < H - 8) {
      ctx.fillStyle = "rgba(253,224,71,0.45)";
      ctx.fillRect(scrX, penBotAtScr, 8, H - 8 - penBotAtScr);
    }

    /* Screen labels */
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = `${Math.max(8, W * 0.016)}px 'Space Grotesk', sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("Screen", scrX + 4, H - 4);

    /* ── Light source ───────────────────────────────── */
    ctx.save();
    if (mode === "solar" || mode === "lunar") {
      /* Sun: larger, glowing yellow */
      const sunR = srcR * 1.8;
      const sunGrad = ctx.createRadialGradient(srcX, cy, 0, srcX, cy, sunR * 2);
      sunGrad.addColorStop(0, "rgba(255,235,50,0.9)");
      sunGrad.addColorStop(0.4, "rgba(253,170,30,0.6)");
      sunGrad.addColorStop(1, "rgba(253,170,30,0)");
      ctx.fillStyle = sunGrad;
      ctx.beginPath(); ctx.arc(srcX, cy, sunR * 2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fde047";
      ctx.beginPath(); ctx.arc(srcX, cy, sunR, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = `bold ${Math.max(8, W * 0.016)}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("☀ Sun", srcX, cy + sunR + 14);
    } else {
      /* Configurable source */
      if (srcSize < 5) {
        /* Point source */
        ctx.shadowColor = "#fde047"; ctx.shadowBlur = 20;
        ctx.fillStyle = "#fde047";
        ctx.beginPath(); ctx.arc(srcX, cy, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.font = `${Math.max(8, W * 0.016)}px 'Space Grotesk', sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("Point source", srcX, cy + 18);
      } else {
        /* Extended source: glowing bar */
        ctx.shadowColor = "#fde047"; ctx.shadowBlur = 15;
        const extGrad = ctx.createLinearGradient(srcX - 4, 0, srcX + 4, 0);
        extGrad.addColorStop(0, "#fde04788");
        extGrad.addColorStop(0.5, "#fde047ff");
        extGrad.addColorStop(1, "#fde04788");
        ctx.fillStyle = extGrad;
        ctx.beginPath(); ctx.arc(srcX, cy, srcR, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.font = `${Math.max(8, W * 0.016)}px 'Space Grotesk', sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("Extended source", srcX, cy + srcR + 14);
      }
    }
    ctx.restore();

    /* ── Opaque object ────────────────────────────── */
    ctx.save();
    if (mode === "solar") {
      /* Moon */
      const moonGrad = ctx.createRadialGradient(objX, cy, 0, objX, cy, objR);
      moonGrad.addColorStop(0, "#94a3b8");
      moonGrad.addColorStop(1, "#475569");
      ctx.fillStyle = moonGrad;
      ctx.beginPath(); ctx.arc(objX, cy, objR, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = `${Math.max(8, W * 0.016)}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("🌑 Moon", objX, cy + objR + 14);
    } else if (mode === "lunar") {
      /* Earth */
      const earthGrad = ctx.createRadialGradient(objX - objR*0.3, cy - objR*0.3, objR*0.1, objX, cy, objR);
      earthGrad.addColorStop(0, "#3b82f6");
      earthGrad.addColorStop(0.5, "#1d4ed8");
      earthGrad.addColorStop(1, "#1e3a5f");
      ctx.fillStyle = earthGrad;
      ctx.beginPath(); ctx.arc(objX, cy, objR, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = `${Math.max(8, W * 0.016)}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("🌍 Earth", objX, cy + objR + 14);
    } else {
      /* Generic opaque object */
      ctx.fillStyle = "#334155";
      ctx.beginPath(); ctx.roundRect(objX - 8, cy - objR, 16, objR * 2, 4); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = `${Math.max(8, W * 0.016)}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("Object", objX, cy + objR + 14);
    }
    ctx.restore();

    /* ── Labels on screen shadow regions ─────────── */
    const labelX = scrX + 20;
    if (umbraBot > umbraTop) {
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = `bold ${Math.max(8, W * 0.016)}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = "left";
      ctx.fillText("Umbra", labelX, (umbraTop + umbraBot) / 2 + 4);
    }
    if (srcSize > 5) {
      if (penTopAtScr < umbTopAtScr) {
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.font = `${Math.max(7, W * 0.014)}px 'Space Grotesk', sans-serif`;
        ctx.fillText("Penumbra", labelX, (penTopAtScr + umbTopAtScr) / 2 + 4);
        ctx.fillText("Penumbra", labelX, (umbBotAtScr + penBotAtScr) / 2 + 4);
      }
    }

    /* ── Title ──────────────────────────────────────── */
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = `bold ${Math.max(10, W * 0.022)}px 'Space Grotesk', sans-serif`;
    ctx.textAlign = "left";
    const titles: Record<Mode, string> = {
      shadow: "Shadow Formation — Rectilinear Propagation",
      solar: "🌑 Solar Eclipse — Moon's Umbra on Earth",
      lunar: "🌍 Lunar Eclipse — Earth's Umbra on Moon",
    };
    ctx.fillText(titles[mode], 6, 18);

  }, [mode, srcSize, objDist, scrDist, showRays]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    if (!container) return;
    const ro = new ResizeObserver(() => {
      canvas.width  = container.clientWidth;
      canvas.height = Math.round(container.clientWidth * 0.46);
      draw();
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [draw]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div style={{
      background: "linear-gradient(135deg,#04090f 0%,#0a1020 100%)",
      borderRadius: 16, overflow: "hidden",
      border: "1px solid rgba(253,224,71,0.15)",
      fontFamily: "'Space Grotesk','Inter',sans-serif",
    }}>
      <div style={{ padding: "14px 20px 10px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>🔦</span>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Shadow Formation & Eclipses Lab</div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
            Umbra + Penumbra · Solar & Lunar eclipses · Rectilinear propagation
          </div>
        </div>
      </div>

      <div style={{ width: "100%", background: "#04090f" }}>
        <canvas ref={canvasRef} style={{ display: "block", width: "100%" }} />
      </div>

      <div style={{ padding: "14px 18px", background: "rgba(0,0,0,0.45)" }}>

        {/* Mode buttons */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          {([
            { m: "shadow" as Mode, label: "🔦 Shadow", color: "#fde047" },
            { m: "solar"  as Mode, label: "🌑 Solar Eclipse", color: "#f97316" },
            { m: "lunar"  as Mode, label: "🌍 Lunar Eclipse", color: "#60a5fa" },
          ]).map(({ m, label, color }) => (
            <button key={m} onClick={() => setMode(m)} style={{
              background: mode === m ? `${color}22` : "rgba(255,255,255,0.04)",
              border: `1.5px solid ${mode === m ? color : "rgba(255,255,255,0.1)"}`,
              color: mode === m ? color : "rgba(255,255,255,0.5)",
              borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
            }}>{label}</button>
          ))}
        </div>

        {/* Sliders (only for shadow mode) */}
        {mode === "shadow" && (
          <>
            {[
              { label: "💡 Source Size", val: srcSize, set: setSrcSize, min: 0, max: 100, accent: "#fde047",
                display: srcSize < 5 ? "Point source" : srcSize < 40 ? "Small source" : "Extended source" },
              { label: "📍 Object Position", val: objDist, set: setObjDist, min: 20, max: 75, accent: "#f97316",
                display: `${objDist}% from left` },
              { label: "🖥 Screen Position", val: scrDist, set: setScrDist, min: Math.max(objDist + 10, 50), max: 95, accent: "#60a5fa",
                display: `${scrDist}% from left` },
            ].map(({ label, val, set, min, max, accent, display }) => (
              <div key={label} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 600 }}>{label}</span>
                  <span style={{ color: accent, fontSize: 12, fontFamily: "JetBrains Mono, monospace" }}>{display}</span>
                </div>
                <input type="range" min={min} max={max} value={val} onChange={e => set(Number(e.target.value))}
                  style={{ width: "100%", accentColor: accent, cursor: "pointer" }} />
              </div>
            ))}
          </>
        )}

        {/* Ray toggle */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <button onClick={() => setShowRays(v => !v)} style={{
            background: showRays ? "rgba(253,224,71,0.12)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${showRays ? "#fde047" : "rgba(255,255,255,0.1)"}`,
            color: showRays ? "#fde047" : "rgba(255,255,255,0.4)",
            borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
          }}>{showRays ? "✓" : "○"} Show Rays</button>
        </div>

        {/* Fact card */}
        <div style={{ background: "rgba(253,224,71,0.06)", border: "1px solid rgba(253,224,71,0.15)", borderRadius: 10, padding: "10px 14px" }}>
          <div style={{ color: "#fde047", fontWeight: 700, fontSize: 12, marginBottom: 4 }}>
            {mode === "shadow" ? "⚡ Key Concept" : mode === "solar" ? "🌑 Solar Eclipse" : "🌍 Lunar Eclipse"}
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, lineHeight: 1.65 }}>
            {mode === "shadow" && "Point source → only umbra (sharp shadow). Extended source → umbra + penumbra (soft shadow edges). The larger the source, the softer the shadow — that's why fluorescent light gives no hard shadows!"}
            {mode === "solar" && "Moon's umbra (tiny cone) falls on Earth's surface → total solar eclipse visible in a narrow strip ~250 km wide. In penumbra → partial eclipse. Moon is 400× smaller than Sun but 400× closer — perfect coincidence!"}
            {mode === "lunar" && "Earth's umbra covers the entire Moon → everyone on the night side sees a total lunar eclipse simultaneously. The Moon turns red (Blood Moon) because Earth's atmosphere bends red light into the umbra."}
          </div>
        </div>
      </div>
    </div>
  );
}
