/**
 * FILE: PrismColorLabSim.tsx
 * LOCATION: src/components/simulations/light/dispersion/
 *
 * PURPOSE:
 *   Interactive glass prism simulation showing dispersion of white light into
 *   the visible spectrum (VIBGYOR). Student controls:
 *     • Prism apex angle (30° – 70°) via slider
 *     • Refractive index of prism material (1.45 – 1.75)
 *     • Angle of incidence of white light beam
 *
 *   Visual output:
 *     • White incident beam splits at first surface → 7 coloured rays emerge
 *     • Each ray bends according to Snell's Law (n varies per colour)
 *     • Spectrum fan showing VIBGYOR order
 *     • Live readout: deviation angle for each colour, angular dispersion
 *     • "Rainbow mode" — shows the circular arc a real rainbow would form
 *
 * PHYSICS COVERED (Class 10 Topic 8):
 *   Dispersion: splitting of white light into components
 *   Snell's Law at each surface: n₁ sin θ₁ = n₂ sin θ₂
 *   Angle of deviation: δ = (i - r₁) + (e - r₂)
 *   Angular dispersion: δᵥ − δᵣ
 *   VIBGYOR order of colours
 *
 * REAL-LIFE CONNECTION:
 *   Rainbows form by dispersion in water droplets.
 *   CD surfaces show diffraction (different mechanism).
 *   Diamond sparkle comes from high refractive index and TIR.
 *
 * DEPENDENCIES: SimulationEngine.module.css
 * LAST UPDATED: 2026-06-11
 */

"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import styles from "../SimulationEngine.module.css";

/* Refractive indices for different colours (glass ≈ 1.5 base)
   Real dispersion: violet bends more than red */
const COLORS = [
  { name: "Violet", hex: "#7c3aed", dn: +0.030 },
  { name: "Indigo", hex: "#4f46e5", dn: +0.022 },
  { name: "Blue",   hex: "#2563eb", dn: +0.015 },
  { name: "Green",  hex: "#16a34a", dn: +0.005 },
  { name: "Yellow", hex: "#ca8a04", dn: -0.002 },
  { name: "Orange", hex: "#ea580c", dn: -0.010 },
  { name: "Red",    hex: "#dc2626", dn: -0.018 },
];

function toRad(deg: number) { return deg * Math.PI / 180; }
function toDeg(rad: number) { return rad * 180 / Math.PI; }

export default function PrismColorLabSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);
  const tRef      = useRef<number>(0);

  const [apexAngle,   setApexAngle]   = useState(60);   /* degrees */
  const [baseIndex,   setBaseIndex]   = useState(1.52); /* refractive index of glass */
  const [incAngle,    setIncAngle]    = useState(40);   /* angle of incidence */
  const [rainbowMode, setRainbowMode] = useState(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    tRef.current += 0.016;

    ctx.fillStyle = "#06091a";
    ctx.fillRect(0, 0, W, H);

    /* Prism geometry: equilateral-ish triangle */
    const A = toRad(apexAngle);
    const prismH  = 160;
    const prismBase = 2 * prismH * Math.tan(A / 2);
    const px = W * 0.42; /* apex x */
    const py = H * 0.22; /* apex y */

    /* Prism vertices */
    const v1 = { x: px, y: py };                              /* apex */
    const v2 = { x: px - prismBase / 2, y: py + prismH };    /* bottom-left */
    const v3 = { x: px + prismBase / 2, y: py + prismH };    /* bottom-right */

    /* ─── Draw prism ─── */
    ctx.save();
    const prismGrad = ctx.createLinearGradient(v2.x, v1.y, v3.x, v3.y);
    prismGrad.addColorStop(0,   "rgba(6,182,212,0.06)");
    prismGrad.addColorStop(0.5, "rgba(6,182,212,0.18)");
    prismGrad.addColorStop(1,   "rgba(6,182,212,0.06)");
    ctx.fillStyle   = prismGrad;
    ctx.strokeStyle = "rgba(6,182,212,0.7)";
    ctx.lineWidth   = 2.5;
    ctx.shadowColor = "#06b6d4";
    ctx.shadowBlur  = 16;
    ctx.beginPath();
    ctx.moveTo(v1.x, v1.y);
    ctx.lineTo(v2.x, v2.y);
    ctx.lineTo(v3.x, v3.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();

    /* Prism label */
    ctx.fillStyle = "rgba(6,182,212,0.7)";
    ctx.font      = "bold 11px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`Glass Prism (A=${apexAngle}°, n≈${baseIndex.toFixed(2)})`, px, py + prismH + 20);

    /* ─── Left face normal ─── */
    /* Left face goes from v1 to v2 */
    /* Normal to left face */
    const leftFaceAngle = Math.atan2(v2.y - v1.y, v2.x - v1.x);
    const leftNormalAngle = leftFaceAngle - Math.PI / 2; /* perpendicular inward */

    /* Entry point on left face */
    const t_entry = 0.5;
    const ex = v1.x + t_entry * (v2.x - v1.x);
    const ey = v1.y + t_entry * (v2.y - v1.y);

    /* ─── Incident white beam ─── */
    const incRad = toRad(incAngle);
    /* White beam direction: from upper-left hitting left face */
    const beamLen = 120;
    const beamStartX = ex - beamLen * Math.cos(leftFaceAngle + Math.PI / 2 - incRad);
    const beamStartY = ey - beamLen * Math.sin(leftFaceAngle + Math.PI / 2 - incRad);

    /* Animated photon on incident beam */
    const ph0 = (tRef.current * 0.5) % 1;
    const ph0x = beamStartX + ph0 * (ex - beamStartX);
    const ph0y = beamStartY + ph0 * (ey - beamStartY);

    /* Draw white incident beam */
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth   = 3;
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur  = 20;
    ctx.beginPath(); ctx.moveTo(beamStartX, beamStartY); ctx.lineTo(ex, ey); ctx.stroke();
    ctx.shadowBlur = 0;
    /* Animated photon */
    ctx.fillStyle = "#ffffff"; ctx.shadowColor = "#ffffff"; ctx.shadowBlur = 18;
    ctx.beginPath(); ctx.arc(ph0x, ph0y, 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    /* "White light" label */
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font      = "11px Inter, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("White light", beamStartX - 4, beamStartY - 4);

    /* ─── Dispersion through prism ─── */
    /* For each colour: compute refracted angle inside prism, then exit angle */
    const exitRays: { color: string; ex2: number; ey2: number; ex3: number; ey3: number; dev: number }[] = [];

    COLORS.forEach(({ hex, dn }) => {
      const n = baseIndex + dn; /* refractive index for this colour */

      /* Snell's Law at entry: sin(incAngle) = n * sin(r₁) */
      const sinR1 = Math.sin(incRad) / n;
      if (Math.abs(sinR1) > 1) return; /* TIR at entry — shouldn't happen */
      const r1 = Math.asin(sinR1);

      /* Angle inside prism at exit face */
      /* r₂ = A - r₁ (for equilateral prism geometry) */
      const r2 = toRad(apexAngle) - r1;

      /* Exit angle: n * sin(r₂) = sin(e) */
      const sinE = n * Math.sin(r2);
      if (Math.abs(sinE) > 1) return; /* TIR inside prism */
      const e = Math.asin(sinE);

      /* Exit point on right face */
      const t_exit = 0.5;
      const ex2 = v1.x + t_exit * (v3.x - v1.x);
      const ey2 = v1.y + t_exit * (v3.y - v1.y);

      /* Right face angle */
      const rightFaceAngle = Math.atan2(v3.y - v1.y, v3.x - v1.x);
      /* Exit ray direction */
      const exitAngle = rightFaceAngle - Math.PI / 2 + e;
      const exitLen   = 130 + dn * 400; /* violet exits higher */
      const ex3 = ex2 + exitLen * Math.cos(exitAngle);
      const ey3 = ey2 + exitLen * Math.sin(exitAngle);

      /* Deviation angle */
      const dev = toDeg(incRad + e - toRad(apexAngle));

      exitRays.push({ color: hex, ex2, ey2, ex3, ey3, dev });
    });

    /* Draw exit rays */
    exitRays.forEach(({ color, ex2, ey2, ex3, ey3 }) => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth   = 2.5;
      ctx.shadowColor = color;
      ctx.shadowBlur  = 14;
      ctx.globalAlpha = 0.9;
      /* Line through prism (from entry to exit, coloured) */
      ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex2, ey2); ctx.stroke();
      /* Exit ray */
      ctx.beginPath(); ctx.moveTo(ex2, ey2); ctx.lineTo(ex3, ey3); ctx.stroke();
      /* Animated photon on exit ray */
      const phT = (tRef.current * 0.55 + exitRays.indexOf({ color, ex2, ey2, ex3, ey3 } as any) * 0.05) % 1;
      const phx = ex2 + phT * (ex3 - ex2);
      const phy = ey2 + phT * (ey3 - ey2);
      ctx.fillStyle = color; ctx.beginPath(); ctx.arc(phx, phy, 3, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    });

    /* ─── VIBGYOR label on exit side ─── */
    if (exitRays.length > 0) {
      COLORS.forEach(({ name, hex }, i) => {
        const ray = exitRays[i];
        if (!ray) return;
        ctx.fillStyle = hex;
        ctx.font      = "bold 10px Inter, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(name[0], ray.ex3 + 6, ray.ey3 + 4);
      });
      /* Full VIBGYOR label */
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font      = "11px Inter, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("← VIBGYOR spectrum", exitRays[exitRays.length - 1].ex3 + 16, (exitRays[0].ey3 + exitRays[exitRays.length - 1].ey3) / 2);
    }

    /* ─── Rainbow mode — circular arc ─── */
    if (rainbowMode) {
      const arcCx = W * 0.5, arcCy = H * 0.95;
      COLORS.forEach(({ hex }, i) => {
        const r = 220 + i * 16;
        const arcGrad = ctx.createLinearGradient(arcCx - r, arcCy, arcCx + r, arcCy);
        arcGrad.addColorStop(0, "transparent");
        arcGrad.addColorStop(0.5, hex + "88");
        arcGrad.addColorStop(1, "transparent");
        ctx.save();
        ctx.strokeStyle = hex + "aa";
        ctx.lineWidth   = 12;
        ctx.shadowColor = hex;
        ctx.shadowBlur  = 16;
        ctx.beginPath();
        ctx.arc(arcCx, arcCy, r, Math.PI * 1.1, Math.PI * 1.9, false);
        ctx.stroke();
        ctx.restore();
      });
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font      = "11px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Rainbow (sunlight + water droplets)", W / 2, H - 12);
    }

    /* ─── Stats panel ─── */
    ctx.save();
    ctx.fillStyle  = "rgba(6,9,26,0.7)";
    ctx.strokeStyle = "rgba(6,182,212,0.2)";
    ctx.lineWidth  = 1;
    ctx.beginPath();
    ctx.roundRect(W - 185, 8, 178, 80, 10);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#94a3b8";
    ctx.font      = "11px Inter, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`∠Incidence: ${incAngle}°`, W - 178, 28);
    ctx.fillText(`∠Apex (A): ${apexAngle}°`, W - 178, 46);
    if (exitRays.length >= 2) {
      const disp = (exitRays[0].dev - exitRays[exitRays.length - 1].dev).toFixed(1);
      ctx.fillText(`Dispersion: ${disp}°`, W - 178, 64);
    }
    ctx.fillText(`n (mean): ${baseIndex.toFixed(2)}`, W - 178, 82);
    ctx.restore();

    animRef.current = requestAnimationFrame(draw);
  }, [apexAngle, baseIndex, incAngle, rainbowMode]);

  useEffect(() => {
    cancelAnimationFrame(animRef.current);
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return (
    <div className={styles.simWrapper}>
      <div className={styles.simTitle}>🌈 Prism Dispersion — Interactive Colour Lab</div>
      <div className={styles.simSubtitle}>
        Adjust prism angle and refractive index to see VIBGYOR splitting
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
        <div>
          <label style={{ color: "#94a3b8", fontSize: "0.8rem", display: "block", marginBottom: "4px" }}>
            Apex Angle A = <strong style={{ color: "#06b6d4" }}>{apexAngle}°</strong>
          </label>
          <input type="range" min={30} max={70} value={apexAngle}
            onChange={e => setApexAngle(Number(e.target.value))}
            style={{ width: "100%" }} />
        </div>
        <div>
          <label style={{ color: "#94a3b8", fontSize: "0.8rem", display: "block", marginBottom: "4px" }}>
            Refractive Index = <strong style={{ color: "#fbbf24" }}>{baseIndex.toFixed(2)}</strong>
          </label>
          <input type="range" min={145} max={175} value={Math.round(baseIndex * 100)}
            onChange={e => setBaseIndex(Number(e.target.value) / 100)}
            style={{ width: "100%" }} />
        </div>
        <div>
          <label style={{ color: "#94a3b8", fontSize: "0.8rem", display: "block", marginBottom: "4px" }}>
            ∠Incidence = <strong style={{ color: "#a78bfa" }}>{incAngle}°</strong>
          </label>
          <input type="range" min={20} max={65} value={incAngle}
            onChange={e => setIncAngle(Number(e.target.value))}
            style={{ width: "100%" }} />
        </div>
      </div>

      <canvas ref={canvasRef} width={700} height={360} className={styles.canvas} />

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "12px", flexWrap: "wrap" }}>
        <button onClick={() => setRainbowMode(v => !v)} style={{
          background: rainbowMode ? "rgba(124,58,237,0.25)" : "rgba(30,41,59,0.8)",
          border: `1px solid ${rainbowMode ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.1)"}`,
          color: rainbowMode ? "#c4b5fd" : "#94a3b8",
          borderRadius: "8px", padding: "6px 16px", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem",
        }}>{rainbowMode ? "✓" : "○"} Rainbow Mode</button>
      </div>

      {/* Colour wavelength table */}
      <div style={{
        display: "flex", gap: "6px", justifyContent: "center", marginTop: "14px", flexWrap: "wrap",
      }}>
        {[
          ["Violet","380-450nm","7c3aed"],["Indigo","450-495nm","4f46e5"],
          ["Blue","495-500nm","2563eb"],["Green","500-565nm","16a34a"],
          ["Yellow","565-590nm","ca8a04"],["Orange","590-625nm","ea580c"],["Red","625-750nm","dc2626"],
        ].map(([name, wl, hex]) => (
          <div key={name} style={{
            background: `#${hex}18`, border: `1px solid #${hex}40`,
            borderRadius: "8px", padding: "5px 10px", textAlign: "center",
          }}>
            <div style={{ color: `#${hex}`, fontWeight: 700, fontSize: "0.75rem" }}>{name[0]}</div>
            <div style={{ color: "#64748b", fontSize: "0.68rem" }}>{wl}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
