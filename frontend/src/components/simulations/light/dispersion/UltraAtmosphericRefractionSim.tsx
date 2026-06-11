/**
 * FILE: UltraAtmosphericRefractionSim.tsx
 * LOCATION: src/components/simulations/light/dispersion/UltraAtmosphericRefractionSim.tsx
 *
 * PURPOSE: Ultra-realistic animated canvas simulation of atmospheric refraction phenomena:
 *   MODE 1 — Twinkling Stars vs Steady Planets
 *     • Animated turbulent atmosphere layers (density waves)
 *     • Star: point source → scintillates (rays hit different cells → random colour/brightness)
 *     • Planet: extended disc → multiple cells average out → steady glow
 *   MODE 2 — Sunrise / Apparent vs Real Sun Position
 *     • Earth curvature arc at bottom
 *     • Dense atmosphere layers refract sunlight upward
 *     • "REAL position" below horizon, "APPARENT position" visible above horizon
 *     • Sun disc rises with ~2 min early label
 *   MODE 3 — Mirage Formation
 *     • Hot road layers (red) → cool upper layers (blue)
 *     • Ray from sky bends upward in hot air → virtual image of sky on road
 *     • Animated shimmer waves across the road surface
 *
 * CANVAS TECHNIQUE:
 *   • 700 × 420 canvas, 60 fps rAF loop
 *   • Atmospheric turbulence: Perlin-style noise via layered sin/cos
 *   • All inner draw functions use `const c = ctx` alias (TS non-null narrowing)
 *
 * CONTROLS: Mode selector tabs + auto-play toggle
 *
 * USED BY: SimulationRegistry (id: "ultra-atmospheric-refraction-sim")
 *          topic-10-optical-phenomena-in-nature.ts
 *
 * LAST UPDATED: 2026-06-11
 */

"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

/* ─────────────────── constants ─────────────────── */
const W = 700;
const H = 420;

type Mode = "stars" | "sunrise" | "mirage";

/* ── simple pseudo-noise for atmospheric turbulence ── */
function noise(x: number, y: number, t: number): number {
  return (
    Math.sin(x * 2.1 + t * 0.7) * 0.4 +
    Math.sin(y * 1.8 + t * 0.5) * 0.3 +
    Math.sin((x + y) * 1.3 + t * 0.9) * 0.3
  );
}

export default function UltraAtmosphericRefractionSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef<number>(0);

  const [mode, setMode] = useState<Mode>("stars");
  const modeRef = useRef<Mode>("stars");

  /* sync mode into ref for use inside rAF */
  useEffect(() => { modeRef.current = mode; }, [mode]);

  /* ═══════════════════════════════
   *  DRAW: TWINKLING STARS MODE
   * ═══════════════════════════════ */
  const drawStars = useCallback((c: CanvasRenderingContext2D, t: number) => {
    /* Night sky gradient */
    const sky = c.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#03050e");
    sky.addColorStop(0.6, "#0d1b3e");
    sky.addColorStop(1, "#1a2f1a");
    c.fillStyle = sky;
    c.fillRect(0, 0, W, H);

    /* Atmosphere layers — density ripples */
    for (let layer = 0; layer < 6; layer++) {
      const y = 60 + layer * 40;
      const alpha = 0.06 + layer * 0.015;
      const r = 40 + layer * 30;
      const g = 80 + layer * 10;
      c.globalAlpha = alpha;
      /* wavy scanline for each layer */
      c.beginPath();
      c.moveTo(0, y);
      for (let x = 0; x <= W; x += 4) {
        const wave = noise(x * 0.01, layer, t) * 8;
        c.lineTo(x, y + wave);
      }
      c.lineTo(W, y + 80);
      c.lineTo(0, y + 80);
      c.closePath();
      c.fillStyle = `rgba(${r},${g},160,1)`;
      c.fill();
    }
    c.globalAlpha = 1;

    /* Background static stars (tiny dots) */
    for (let i = 0; i < 60; i++) {
      const sx = (Math.sin(i * 73.13) * 0.5 + 0.5) * W;
      const sy = (Math.sin(i * 31.71) * 0.5 + 0.5) * (H * 0.5);
      const r = 0.5 + (Math.sin(i * 12.3) * 0.5 + 0.5) * 1;
      c.beginPath();
      c.arc(sx, sy, r, 0, Math.PI * 2);
      c.fillStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.2})`;
      c.fill();
    }

    /* ── TWINKLING STAR ── */
    const starX = W * 0.3;
    const starY = 90;
    const twinkle = noise(0, 0, t * 3.1);     /* fast turbulence */
    const starR = 5 + twinkle * 1.5;
    const starBright = 0.6 + twinkle * 0.4;
    /* colour shift: atmosphere disperses different wavelengths */
    const cr = Math.floor(200 + twinkle * 55);
    const cb = Math.floor(200 - twinkle * 60);

    /* glow */
    const sg = c.createRadialGradient(starX, starY, 0, starX, starY, 20);
    sg.addColorStop(0, `rgba(${cr},230,${cb},${starBright})`);
    sg.addColorStop(0.5, `rgba(${cr},230,${cb},${starBright * 0.4})`);
    sg.addColorStop(1, "rgba(0,0,0,0)");
    c.beginPath();
    c.arc(starX, starY, 20, 0, Math.PI * 2);
    c.fillStyle = sg;
    c.fill();

    /* core */
    c.beginPath();
    c.arc(starX, starY, Math.max(1, starR), 0, Math.PI * 2);
    c.fillStyle = `rgb(${cr},240,${cb})`;
    c.fill();

    /* ── STEADY PLANET ── */
    const planX = W * 0.7;
    const planY = 100;
    const planRadius = 10;

    /* Draw multiple point-source contributions that average out */
    let avgR = 0, avgG = 0, avgB = 0;
    for (let p = 0; p < 8; p++) {
      const px = planX + (Math.sin(p * 1.1) * planRadius * 0.9);
      const py = planY + (Math.cos(p * 1.1) * planRadius * 0.9);
      const n = noise(px * 0.05, py * 0.05, t * 3.1);
      avgR += 180 + n * 55;
      avgG += 200 + n * 30;
      avgB += 120 + n * 20;
    }
    const pr = Math.floor(avgR / 8);
    const pg = Math.floor(avgG / 8);
    const pb = Math.floor(avgB / 8);

    /* planet glow */
    const pg2 = c.createRadialGradient(planX, planY, 0, planX, planY, 28);
    pg2.addColorStop(0, `rgba(${pr},${pg},${pb},0.9)`);
    pg2.addColorStop(0.4, `rgba(${pr},${pg},${pb},0.35)`);
    pg2.addColorStop(1, "rgba(0,0,0,0)");
    c.beginPath();
    c.arc(planX, planY, 28, 0, Math.PI * 2);
    c.fillStyle = pg2;
    c.fill();

    /* planet disc */
    const pd = c.createRadialGradient(planX - 3, planY - 3, 0, planX, planY, planRadius);
    pd.addColorStop(0, `rgb(${pr + 30},${pg + 20},${pb + 40})`);
    pd.addColorStop(1, `rgb(${pr},${pg},${pb})`);
    c.beginPath();
    c.arc(planX, planY, planRadius, 0, Math.PI * 2);
    c.fillStyle = pd;
    c.fill();

    /* ── Labels ── */
    c.font = "bold 13px 'Inter', sans-serif";
    c.textAlign = "center";

    /* Star label */
    c.fillStyle = "#f59e0b";
    c.fillText("★ STAR", starX, starY + 35);
    c.font = "11px 'Inter', sans-serif";
    c.fillStyle = "rgba(255,255,255,0.55)";
    c.fillText("TWINKLES ✓", starX, starY + 50);
    c.fillText("(point source)", starX, starY + 63);

    /* Planet label */
    c.font = "bold 13px 'Inter', sans-serif";
    c.fillStyle = "#818cf8";
    c.fillText("● PLANET", planX, planY + 35);
    c.font = "11px 'Inter', sans-serif";
    c.fillStyle = "rgba(255,255,255,0.55)";
    c.fillText("STEADY ✓", planX, planY + 50);
    c.fillText("(extended disc — 8 points average)", planX, planY + 63);

    /* Explanation box */
    c.fillStyle = "rgba(15,23,42,0.82)";
    c.beginPath();
    c.rect(20, H - 110, W - 40, 90);
    c.fill();
    c.strokeStyle = "rgba(129,140,248,0.3)";
    c.lineWidth = 1;
    c.stroke();

    c.font = "bold 12px 'Inter', sans-serif";
    c.fillStyle = "#818cf8";
    c.textAlign = "left";
    c.fillText("💡 Why do stars twinkle but planets don't?", 36, H - 88);

    c.font = "11px 'Inter', sans-serif";
    c.fillStyle = "rgba(203,213,225,0.9)";
    c.fillText("Stars are point sources — turbulent atmosphere cells refract each ray differently → brightness/colour flickers.", 36, H - 70);
    c.fillText("Planets are extended discs — many points refracted in many directions simultaneously → fluctuations cancel out → STEADY.", 36, H - 53);
    c.fillText("The turbulent atmosphere cells (shown above as waves) are real — they move constantly due to temperature differences.", 36, H - 36);

  }, []);

  /* ═══════════════════════════════
   *  DRAW: SUNRISE / APPARENT SUN
   * ═══════════════════════════════ */
  const drawSunrise = useCallback((c: CanvasRenderingContext2D, t: number) => {
    /* Sky gradient — before sunrise */
    const sky = c.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#040812");
    sky.addColorStop(0.3, "#0f1b35");
    sky.addColorStop(0.65, "#2d1b00");
    sky.addColorStop(0.85, "#8b3d00");
    sky.addColorStop(1, "#cc5500");
    c.fillStyle = sky;
    c.fillRect(0, 0, W, H);

    /* Earth horizon arc */
    const earthY = H - 60;
    c.fillStyle = "#0f2010";
    c.beginPath();
    c.ellipse(W / 2, earthY + 80, W * 0.7, 100, 0, Math.PI, 0, true);
    c.fill();

    /* Atmosphere layers — refractive index gradient */
    for (let i = 0; i < 8; i++) {
      const ly = earthY - i * 18;
      const alpha = 0.04 + i * 0.008;
      const rr = 120 + i * 12;
      c.fillStyle = `rgba(${rr}, 100, 50, ${alpha})`;
      c.fillRect(0, ly, W, 18);
    }

    /* REAL sun position — below horizon (dashed circle) */
    const realSunX = W * 0.5;
    const realSunY = earthY + 30;   /* below earth's horizon */

    c.save();
    c.globalAlpha = 0.7;
    c.setLineDash([4, 4]);
    c.strokeStyle = "#ff6600";
    c.lineWidth = 2;
    c.beginPath();
    c.arc(realSunX, realSunY, 22, 0, Math.PI * 2);
    c.stroke();
    c.restore();

    c.fillStyle = "#ff4400";
    c.font = "bold 11px 'Inter', sans-serif";
    c.textAlign = "center";
    c.fillText("REAL SUN", realSunX, realSunY + 38);
    c.fillStyle = "rgba(255,100,0,0.7)";
    c.font = "10px 'Inter', sans-serif";
    c.fillText("(below horizon, not visible)", realSunX, realSunY + 51);

    /* APPARENT sun position — refracted up by atmosphere */
    const beatPhase = Math.sin(t * 0.4) * 0.5 + 0.5;   /* gentle pulse */
    const appSunY = earthY - 35 - beatPhase * 4;

    /* Refracted light rays from real → apparent */
    const numRays = 7;
    for (let ri = 0; ri < numRays; ri++) {
      const startX = W * 0.2 + ri * W * 0.1;
      /* Each ray curves upward through atmosphere */
      c.beginPath();
      c.moveTo(realSunX + (ri - 3) * 6, realSunY - 22);
      /* Cubic bezier curving through atmosphere */
      c.bezierCurveTo(
        realSunX + (ri - 3) * 8, realSunY - 60,
        startX + (ri - 3) * 4, appSunY + 20,
        realSunX + (ri - 3) * 5, appSunY
      );
      const alpha = 0.2 + (ri === 3 ? 0.4 : 0.1);
      c.strokeStyle = `rgba(255,160,50,${alpha})`;
      c.lineWidth = ri === 3 ? 2 : 1;
      c.setLineDash([]);
      c.stroke();
    }

    /* Sun glow — apparent position */
    const sg = c.createRadialGradient(realSunX, appSunY, 0, realSunX, appSunY, 55);
    sg.addColorStop(0, "rgba(255,230,100,0.95)");
    sg.addColorStop(0.35, "rgba(255,160,30,0.7)");
    sg.addColorStop(0.65, "rgba(255,80,0,0.3)");
    sg.addColorStop(1, "rgba(0,0,0,0)");
    c.beginPath();
    c.arc(realSunX, appSunY, 55, 0, Math.PI * 2);
    c.fillStyle = sg;
    c.fill();

    /* Sun disc */
    const sd = c.createRadialGradient(realSunX - 5, appSunY - 5, 0, realSunX, appSunY, 22);
    sd.addColorStop(0, "#fff8d0");
    sd.addColorStop(0.5, "#ffcc00");
    sd.addColorStop(1, "#ff8800");
    c.beginPath();
    c.arc(realSunX, appSunY, 22, 0, Math.PI * 2);
    c.fillStyle = sd;
    c.fill();

    /* Apparent sun label */
    c.fillStyle = "#fbbf24";
    c.font = "bold 12px 'Inter', sans-serif";
    c.textAlign = "center";
    c.fillText("APPARENT SUN ☀️", realSunX, appSunY - 30);
    c.fillStyle = "rgba(251,191,36,0.8)";
    c.font = "10px 'Inter', sans-serif";
    c.fillText("visible ~2 minutes early", realSunX, appSunY - 17);

    /* Horizon line label */
    c.strokeStyle = "rgba(255,255,255,0.25)";
    c.lineWidth = 1;
    c.setLineDash([6, 4]);
    c.beginPath();
    c.moveTo(0, earthY);
    c.lineTo(W, earthY);
    c.stroke();
    c.setLineDash([]);

    c.fillStyle = "rgba(255,255,255,0.45)";
    c.font = "10px 'Inter', sans-serif";
    c.textAlign = "left";
    c.fillText("Horizon", 10, earthY - 4);

    /* Info box */
    c.fillStyle = "rgba(15,23,42,0.85)";
    c.beginPath();
    c.rect(15, 12, W - 30, 68);
    c.fill();
    c.strokeStyle = "rgba(251,191,36,0.3)";
    c.lineWidth = 1;
    c.stroke();

    c.font = "bold 12px 'Inter', sans-serif";
    c.fillStyle = "#fbbf24";
    c.textAlign = "left";
    c.fillText("☀️ Atmospheric Refraction — Sunrise Effect", 28, 32);
    c.font = "11px 'Inter', sans-serif";
    c.fillStyle = "rgba(203,213,225,0.9)";
    c.fillText("Light from below the horizon bends through denser-to-rarer atmospheric layers, raising the apparent", 28, 50);
    c.fillText("position of the Sun. We see sunrise ~2 min BEFORE it geometrically rises, gaining ~4 extra minutes of daylight.", 28, 66);

  }, []);

  /* ═══════════════════════════════
   *  DRAW: MIRAGE FORMATION
   * ═══════════════════════════════ */
  const drawMirage = useCallback((c: CanvasRenderingContext2D, t: number) => {
    /* Sky gradient */
    const sky = c.createLinearGradient(0, 0, 0, H * 0.55);
    sky.addColorStop(0, "#0a1628");
    sky.addColorStop(0.5, "#1e3a6e");
    sky.addColorStop(1, "#4a7fad");
    c.fillStyle = sky;
    c.fillRect(0, 0, W, H * 0.55);

    /* Air temperature layers (cool → hot from top to bottom) */
    const roadY = H * 0.62;
    for (let layer = 0; layer < 12; layer++) {
      const ly = roadY - layer * 22;
      const heat = 1 - layer / 12;
      const alpha = 0.06 + heat * 0.08;
      /* Hot air = reddish tint; cool air = bluish */
      const r = Math.floor(80 + heat * 120);
      const g = Math.floor(60 + heat * 40);
      const b = Math.floor(200 - heat * 150);
      c.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      c.fillRect(0, ly, W, 22);
    }

    /* Labels: refractive index gradient */
    const labelData = [
      { y: roadY - 180, label: "Cool air  n ≈ 1.0003", col: "#93c5fd" },
      { y: roadY - 120, label: "Warm air  n ≈ 1.0002", col: "#fde68a" },
      { y: roadY - 70,  label: "Hot air    n ≈ 1.0001", col: "#fca5a5" },
      { y: roadY - 30,  label: "Very hot  n ≈ 1.00005", col: "#f87171" },
    ];
    c.font = "10px 'Inter', sans-serif";
    for (const ld of labelData) {
      c.fillStyle = ld.col;
      c.textAlign = "left";
      c.fillText(ld.label, 8, ld.y);
    }

    /* Road surface with heat shimmer */
    const road = c.createLinearGradient(0, roadY, 0, H);
    road.addColorStop(0, "#2d3748");
    road.addColorStop(0.3, "#1a202c");
    road.addColorStop(1, "#0d1117");
    c.fillStyle = road;
    c.fillRect(0, roadY, W, H - roadY);

    /* Road markings */
    c.strokeStyle = "rgba(255,255,200,0.5)";
    c.lineWidth = 3;
    c.setLineDash([30, 20]);
    c.beginPath();
    c.moveTo(W / 2, roadY + 10);
    c.lineTo(W / 2, H);
    c.stroke();
    c.setLineDash([]);

    /* Heat shimmer waves on road */
    for (let sw = 0; sw < 5; sw++) {
      const waveY = roadY + 5 + sw * 8;
      const waveAlpha = (0.15 - sw * 0.025) * (0.7 + Math.sin(t * 4 + sw) * 0.3);
      c.beginPath();
      c.moveTo(0, waveY);
      for (let wx = 0; wx <= W; wx += 3) {
        const wn = noise(wx * 0.02, sw, t * 5) * 4;
        c.lineTo(wx, waveY + wn);
      }
      c.strokeStyle = `rgba(255,180,100,${waveAlpha})`;
      c.lineWidth = 1;
      c.stroke();
    }

    /* Incoming ray from sky */
    const rayStartX = W * 0.25;
    const rayStartY = 80;
    /* Ray bends gradually in hot air — TIR at road level */
    const bendPoints = [];
    const nSegments = 14;
    for (let si = 0; si <= nSegments; si++) {
      const frac = si / nSegments;
      /* Parabolic bending — increasingly bent in hot air near road */
      const x = rayStartX + frac * (W * 0.25);
      const y = rayStartY + frac * (roadY - 80 - 10) + frac * frac * (-80);  /* bends upward */
      bendPoints.push({ x, y });
    }
    /* TIR — reflected ray going up */
    const tirX = bendPoints[bendPoints.length - 1].x;
    const tirY = bendPoints[bendPoints.length - 1].y;

    /* Incident ray */
    c.beginPath();
    c.moveTo(rayStartX, rayStartY);
    for (const bp of bendPoints) c.lineTo(bp.x, bp.y);
    c.strokeStyle = "#60a5fa";
    c.lineWidth = 2.5;
    c.shadowColor = "#60a5fa";
    c.shadowBlur = 6;
    c.stroke();
    c.shadowBlur = 0;

    /* Reflected ray (TIR — goes up and to the right) */
    c.beginPath();
    c.moveTo(tirX, tirY);
    c.bezierCurveTo(
      tirX + 40, tirY - 50,
      tirX + 80, tirY - 100,
      tirX + 120, tirY - 170
    );
    c.strokeStyle = "#34d399";
    c.lineWidth = 2.5;
    c.shadowColor = "#34d399";
    c.shadowBlur = 6;
    c.stroke();
    c.shadowBlur = 0;

    /* Eye of observer */
    const eyeX = tirX + 140;
    const eyeY = tirY - 190;
    c.beginPath();
    c.ellipse(eyeX, eyeY, 14, 9, 0, 0, Math.PI * 2);
    c.fillStyle = "rgba(255,255,255,0.15)";
    c.fill();
    c.strokeStyle = "rgba(255,255,255,0.7)";
    c.lineWidth = 1.5;
    c.stroke();
    c.beginPath();
    c.arc(eyeX, eyeY, 5, 0, Math.PI * 2);
    c.fillStyle = "#60a5fa";
    c.fill();

    /* Mirage image of sky (virtual) on the road */
    const mirageX = rayStartX + W * 0.08;
    const mirageWidth = W * 0.22;
    const mg = c.createLinearGradient(mirageX, roadY, mirageX, roadY + 18);
    mg.addColorStop(0, "rgba(100,170,255,0.55)");
    mg.addColorStop(1, "rgba(100,170,255,0.05)");
    c.fillStyle = mg;
    /* shimmer — warp the mirage reflection */
    c.beginPath();
    c.moveTo(mirageX, roadY);
    for (let mx = mirageX; mx <= mirageX + mirageWidth; mx += 3) {
      const my = roadY + noise(mx * 0.04, 0, t * 6) * 3;
      c.lineTo(mx, my);
    }
    c.lineTo(mirageX + mirageWidth, roadY + 18);
    c.lineTo(mirageX, roadY + 18);
    c.closePath();
    c.fill();

    /* Labels */
    c.fillStyle = "#60a5fa";
    c.font = "bold 11px 'Inter', sans-serif";
    c.textAlign = "center";
    c.fillText("Incident ray from sky", rayStartX + 60, rayStartY - 10);

    c.fillStyle = "#34d399";
    c.fillText("TIR reflected ray", tirX + 70, tirY - 100);

    c.fillStyle = "#fbbf24";
    c.textAlign = "center";
    c.fillText("Virtual image of sky", mirageX + mirageWidth / 2, roadY + 32);
    c.font = "10px 'Inter', sans-serif";
    c.fillStyle = "rgba(255,255,255,0.5)";
    c.fillText("(appears as shimmering water on road)", mirageX + mirageWidth / 2, roadY + 45);

    c.fillStyle = "rgba(255,255,255,0.8)";
    c.textAlign = "center";
    c.font = "11px 'Inter', sans-serif";
    c.fillText("👁 Observer", eyeX, eyeY - 20);

    /* Info panel */
    c.fillStyle = "rgba(15,23,42,0.88)";
    c.beginPath();
    c.rect(15, H - 100, W - 30, 82);
    c.fill();
    c.strokeStyle = "rgba(248,113,113,0.3)";
    c.lineWidth = 1;
    c.stroke();

    c.font = "bold 12px 'Inter', sans-serif";
    c.fillStyle = "#f87171";
    c.textAlign = "left";
    c.fillText("🌡️ Mirage Formation — Total Internal Refraction in Atmosphere", 28, H - 78);
    c.font = "11px 'Inter', sans-serif";
    c.fillStyle = "rgba(203,213,225,0.9)";
    c.fillText("Hot road heats the air just above it → hot air has LOWER refractive index. Light from the sky curves through", 28, H - 60);
    c.fillText("the density gradient and undergoes TIR near the road surface. The observer sees a virtual sky image — a MIRAGE!", 28, H - 43);
    c.fillText("Same physics as optical fibre — light bends toward denser (cooler) medium, reflecting off the hot air layer.", 28, H - 26);

  }, []);

  /* ═══════════════════════════════
   *  ANIMATION LOOP
   * ═══════════════════════════════ */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frame = () => {
      tRef.current += 0.016;
      const t = tRef.current;
      const c = ctx;   /* non-null alias for TS narrowing inside nested fns */

      /* Clear */
      c.clearRect(0, 0, W, H);

      /* Route to active mode */
      if (modeRef.current === "stars")   drawStars(c, t);
      if (modeRef.current === "sunrise") drawSunrise(c, t);
      if (modeRef.current === "mirage")  drawMirage(c, t);

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [drawStars, drawSunrise, drawMirage]);

  /* ═══════════════════════════════
   *  RENDER
   * ═══════════════════════════════ */
  const tabs: { id: Mode; label: string; icon: string }[] = [
    { id: "stars",   label: "Twinkling Stars",  icon: "⭐" },
    { id: "sunrise", label: "Early Sunrise",    icon: "🌅" },
    { id: "mirage",  label: "Mirage on Road",   icon: "🌡️" },
  ];

  return (
    <div style={{
      background: "#06091a",
      borderRadius: "16px",
      border: "1px solid rgba(129,140,248,0.2)",
      overflow: "hidden",
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 20px",
        background: "rgba(15,23,42,0.9)",
        borderBottom: "1px solid rgba(129,140,248,0.15)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}>
        <span style={{ fontSize: "1.25rem" }}>🌌</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "#e2e8f0" }}>
            Atmospheric Refraction Lab
          </div>
          <div style={{ fontSize: "0.73rem", color: "#64748b", marginTop: "2px" }}>
            Stars · Sunrise · Mirage — all caused by the same bending of light through air density gradients
          </div>
        </div>
      </div>

      {/* Mode tabs */}
      <div style={{
        display: "flex",
        gap: "6px",
        padding: "12px 16px 0",
        background: "rgba(15,23,42,0.5)",
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setMode(tab.id)}
            style={{
              padding: "7px 16px",
              borderRadius: "8px 8px 0 0",
              border: "1px solid",
              borderBottom: "none",
              borderColor: mode === tab.id ? "rgba(129,140,248,0.5)" : "rgba(255,255,255,0.07)",
              background: mode === tab.id ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.03)",
              color: mode === tab.id ? "#a5b4fc" : "#64748b",
              fontSize: "0.8rem",
              fontWeight: mode === tab.id ? 700 : 400,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s",
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ display: "block", width: "100%", maxWidth: W, height: "auto" }}
      />

      {/* Footer hint */}
      <div style={{
        padding: "10px 18px",
        background: "rgba(15,23,42,0.85)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        fontSize: "0.72rem",
        color: "#475569",
        textAlign: "center",
      }}>
        Switch between modes to explore the 3 key atmospheric refraction phenomena tested in CBSE Class 10 exams
      </div>
    </div>
  );
}
