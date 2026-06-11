"use client";
/**
 * FILE: UltraRainbowDropletSim.tsx
 * PURPOSE: Ultra-realistic interactive rainbow formation simulation.
 *
 * Shows how sunlight entering a water droplet produces a rainbow:
 *  – White light ray enters the droplet
 *  – Refraction splits it into ROYGBIV (different n for each wavelength)
 *  – Total internal reflection at the back surface
 *  – Second refraction on exit — dispersed rainbow colours emerge
 *  – Animated photons on each colour path
 *  – Draggable sun angle to explore how the rainbow angle changes
 *  – Labels show actual wavelengths (nm) and Descartes' rainbow angle (42°)
 *  – Rayleigh scattering sky panel showing why the sky is blue
 *  – Dark cosmic aesthetic with realistic colour rendering
 */

import React, { useRef, useEffect, useState, useCallback } from "react";

const H_CSS = 520;

/* ROYGBIV — wavelength, refractive index for water, display colour */
const SPECTRUM = [
  { name: "Red",    nm: 700, n: 1.3311, color: "#ff4444" },
  { name: "Orange", nm: 620, n: 1.3320, color: "#ff8800" },
  { name: "Yellow", nm: 580, n: 1.3330, color: "#ffee00" },
  { name: "Green",  nm: 550, n: 1.3345, color: "#44ff44" },
  { name: "Blue",   nm: 480, n: 1.3366, color: "#4488ff" },
  { name: "Indigo", nm: 440, n: 1.3385, color: "#6644cc" },
  { name: "Violet", nm: 400, n: 1.3400, color: "#cc44ff" },
];

function glowLine(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  color: string, w: number, blur: number
) {
  ctx.save();
  ctx.shadowColor = color; ctx.shadowBlur = blur;
  ctx.strokeStyle = color; ctx.lineWidth   = w;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.restore();
}

export default function UltraRainbowDropletSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const timeRef   = useRef(0);
  const modeRef   = useRef<"rainbow" | "sky">("rainbow");
  const [mode, setMode] = useState<"rainbow" | "sky">("rainbow");
  const [sunAngle, setSunAngle] = useState(60); /* degrees from horizontal */

  useEffect(() => { modeRef.current = mode; }, [mode]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W   = canvas.clientWidth  || 700;
    const H   = canvas.clientHeight || H_CSS;
    if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
      canvas.width = W * dpr; canvas.height = H * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    timeRef.current += 0.016;
    const t = timeRef.current;
    const md = modeRef.current;

    /* ── Background ── */
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#010508"); bg.addColorStop(1, "#020810");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    if (md === "rainbow") {
      drawRainbow(ctx, W, H, t, sunAngle);
    } else {
      drawRayleigh(ctx, W, H, t);
    }

    rafRef.current = requestAnimationFrame(draw);
  }, [sunAngle]);

  function drawRainbow(
    ctx: CanvasRenderingContext2D,
    W: number, H: number, t: number, sunAngDeg: number
  ) {
    /* Droplet */
    const dr = Math.min(W, H) * 0.22;
    const dcx = W * 0.42, dcy = H * 0.48;

    /* Draw droplet */
    ctx.save();
    const dropGrad = ctx.createRadialGradient(dcx - dr * 0.2, dcy - dr * 0.2, 0, dcx, dcy, dr);
    dropGrad.addColorStop(0,   "rgba(120,200,255,0.25)");
    dropGrad.addColorStop(0.7, "rgba(56,180,240,0.10)");
    dropGrad.addColorStop(1,   "rgba(0,100,200,0.05)");
    ctx.fillStyle   = dropGrad;
    ctx.strokeStyle = "rgba(100,200,255,0.5)";
    ctx.shadowColor = "#38bdf8"; ctx.shadowBlur = 20;
    ctx.lineWidth   = 2;
    ctx.beginPath(); ctx.arc(dcx, dcy, dr, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.restore();

    /* Sun ray angle */
    const iRad = ((90 - sunAngDeg) * Math.PI) / 180;

    /* Entry point on droplet (left side) */
    const entryFrac = 0.4; /* fraction from top to center */
    const entX = dcx - dr * Math.cos(iRad) * 0.0 - dr * Math.sin(iRad) * entryFrac;
    const entY = dcy - dr * Math.cos(iRad) * entryFrac;

    /* Incoming white ray */
    glowLine(ctx, entX - 160 * Math.sin(iRad), entY - 160 * Math.cos(iRad), entX, entY, "rgba(255,255,255,0.9)", 3, 20);

    /* For each wavelength */
    SPECTRUM.forEach((sp, si) => {
      /* Refraction at entry */
      const sinI = Math.sin(iRad);
      const sinR = sinI / sp.n;
      const rRad = Math.asin(Math.min(1, sinR));

      /* Normal at entry point */
      const nx = (entX - dcx) / dr;
      const ny = (entY - dcy) / dr;

      /* Incident direction */
      const idx_dir = Math.sin(iRad);
      const idy_dir = Math.cos(iRad);

      /* Refracted direction inside drop */
      const dot = idx_dir * nx + idy_dir * ny;
      const rfx = idx_dir - (2 * dot - 0) * nx + (sinI - sinR) * ny; /* approx */
      const rfy = idy_dir - (2 * dot - 0) * ny - (sinI - sinR) * nx;
      const rfLen = Math.hypot(rfx, rfy);
      const rfDx  = rfx / rfLen;
      const rfDy  = rfy / rfLen;

      /* Propagate refracted ray to back of droplet */
      /* Find intersection with droplet circle */
      /* Ray: (entX + s*rfDx, entY + s*rfDy), circle: (dcx, dcy, dr) */
      const ex = entX - dcx, ey = entY - dcy;
      const a  = 1;
      const b2 = 2 * (ex * rfDx + ey * rfDy);
      const cc = ex*ex + ey*ey - dr*dr;
      const disc = b2*b2 - 4*a*cc;
      if (disc < 0) return;
      const s1 = (-b2 + Math.sqrt(disc)) / 2;
      const s2 = (-b2 - Math.sqrt(disc)) / 2;
      const s  = Math.max(s1, s2);

      const backX = entX + s * rfDx;
      const backY = entY + s * rfDy;

      /* Draw refracted ray inside */
      glowLine(ctx, entX, entY, backX, backY, sp.color, 1.5, 10);

      /* TIR at back surface — reflect */
      const bnx = (backX - dcx) / dr;
      const bny = (backY - dcy) / dr;
      const dot2 = rfDx * bnx + rfDy * bny;
      const reflDx = rfDx - 2 * dot2 * bnx;
      const reflDy = rfDy - 2 * dot2 * bny;

      /* Propagate reflected ray to front of droplet */
      const ex2 = backX - dcx, ey2 = backY - dcy;
      const b2b = 2 * (ex2 * reflDx + ey2 * reflDy);
      const ccb = ex2*ex2 + ey2*ey2 - dr*dr;
      const discB = b2b*b2b - 4*ccb;
      if (discB < 0) return;
      const sB = Math.max((-b2b + Math.sqrt(discB))/2, (-b2b - Math.sqrt(discB))/2);
      const exitX = backX + sB * reflDx;
      const exitY = backY + sB * reflDy;

      glowLine(ctx, backX, backY, exitX, exitY, sp.color, 1.5, 10);

      /* Second refraction at exit */
      const enx2 = (exitX - dcx) / dr;
      const eny2 = (exitY - dcy) / dr;
      const dot3 = reflDx * enx2 + reflDy * eny2;
      /* Snell reverse: n_water * sin(θ_inside) = 1 * sin(θ_exit) */
      const sinIn = Math.sqrt(1 - dot3*dot3);
      const sinOut = sp.n * sinIn;
      if (sinOut > 1) return;
      const thetaOut = Math.asin(sinOut);
      const exitDx = reflDx + (sp.n * sinIn - sinOut) * enx2;
      const exitDy = reflDy + (sp.n * sinIn - sinOut) * eny2;
      const eLen   = Math.hypot(exitDx, exitDy);
      const ex3 = exitDx / eLen, ey3 = exitDy / eLen;

      /* Draw exiting ray with animation */
      const exitLen = 130 + si * 8;
      const phase = ((t * 0.6 + si * 0.15) % 1);
      glowLine(ctx, exitX, exitY, exitX + ex3 * exitLen, exitY + ey3 * exitLen, sp.color, 2, 14);

      /* Animated photon */
      const px2 = exitX + ex3 * exitLen * phase;
      const py2 = exitY + ey3 * exitLen * phase;
      const g2  = ctx.createRadialGradient(px2, py2, 0, px2, py2, 14);
      g2.addColorStop(0, "rgba(255,255,255,0.9)");
      g2.addColorStop(0.3, sp.color.replace(")", ",0.7)").replace("rgb", "rgba"));
      g2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath(); ctx.arc(px2, py2, 14, 0, Math.PI * 2);
      ctx.fillStyle = g2; ctx.fill();
      ctx.beginPath(); ctx.arc(px2, py2, 4, 0, Math.PI * 2);
      ctx.fillStyle = "white"; ctx.fill();

      /* Wavelength label */
      if (si % 2 === 0) {
        ctx.save();
        ctx.fillStyle = sp.color; ctx.font = "11px monospace";
        ctx.textAlign = "left";
        ctx.fillText(`${sp.name} (${sp.nm} nm)`, exitX + ex3 * exitLen + 6, exitY + ey3 * exitLen + 4);
        ctx.restore();
      }
    });

    /* "SUN" label */
    ctx.save();
    ctx.fillStyle = "#fde68a"; ctx.font = "bold 13px monospace";
    ctx.textAlign = "center";
    ctx.fillText("☀ Sunlight", entX - 170 * Math.sin(iRad) + 10, entY - 170 * Math.cos(iRad) - 10);
    ctx.restore();

    /* Rainbow angle annotation */
    ctx.save();
    ctx.fillStyle = "#a78bfa"; ctx.font = "12px monospace";
    ctx.textAlign = "left"; ctx.fillText("🌈 Rainbow angle ≈ 42° for red, 40° for violet", 16, H - 16);
    ctx.restore();
  }

  function drawRayleigh(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
    /* Sky gradient */
    const sky = ctx.createLinearGradient(0, 0, 0, H * 0.7);
    sky.addColorStop(0, "#0a0a2e");
    sky.addColorStop(0.5, "#1a2a6c");
    sky.addColorStop(1, "#b21f1f");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H * 0.7);

    /* Particles (air molecules) */
    for (let i = 0; i < 30; i++) {
      const px2 = (i * 97 + t * 20 * (i % 3 === 0 ? 1 : -0.5)) % W;
      const py2 = ((i * 53) % (H * 0.6)) + 20;
      const r2  = 3 + Math.sin(t * 2 + i) * 1.5;
      ctx.beginPath(); ctx.arc(px2, py2, r2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(120,180,255,0.7)"; ctx.fill();
      /* Scatter blue rays */
      for (let ang = 0; ang < Math.PI * 2; ang += Math.PI / 3) {
        const sl = 20 + Math.sin(t * 3 + ang) * 5;
        glowLine(ctx, px2, py2, px2 + Math.cos(ang) * sl, py2 + Math.sin(ang) * sl, "#60a5fa", 0.8, 6);
      }
    }

    /* Sun */
    ctx.save();
    ctx.beginPath(); ctx.arc(W * 0.8, H * 0.1, 30, 0, Math.PI * 2);
    ctx.fillStyle = "#fef08a"; ctx.shadowColor = "#fde68a"; ctx.shadowBlur = 40; ctx.fill();
    ctx.restore();

    /* Info text */
    ctx.save();
    ctx.fillStyle = "#e2e8f0"; ctx.font = "14px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("Rayleigh Scattering: Blue light (shorter λ) scatters ~10× more than red", W/2, H * 0.78);
    ctx.fillStyle = "#60a5fa"; ctx.font = "12px monospace";
    ctx.fillText("Scattering ∝ 1/λ⁴  →  Blue (450 nm) scatters far more than Red (700 nm)", W/2, H * 0.83);
    ctx.fillStyle = "#94a3b8"; ctx.font = "11px monospace";
    ctx.fillText("This is why the sky is blue and sunsets are red!", W/2, H * 0.88);
    ctx.restore();
  }

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <div style={{ fontFamily: "sans-serif", background: "#010508", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(99,102,241,0.25)" }}>
      <div style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.12) 0%,rgba(168,85,247,0.08) 100%)", padding: "14px 20px", borderBottom: "1px solid rgba(99,102,241,0.15)", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 22 }}>🌈</span>
        <div>
          <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "0.95rem" }}>Rainbow Formation & Rayleigh Scattering</div>
          <div style={{ color: "#64748b", fontSize: "0.75rem" }}>Interactive water droplet • Dispersion, TIR, and sky colour explained</div>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ width: "100%", height: H_CSS, display: "block" }} />

      <div style={{ padding: "12px 20px", background: "rgba(0,0,0,0.4)", borderTop: "1px solid rgba(99,102,241,0.1)", display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 8 }}>
          {(["rainbow", "sky"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              padding: "7px 18px", borderRadius: 20, border: "none", cursor: "pointer",
              fontWeight: 700, fontSize: "0.82rem", transition: "all 0.2s",
              background: mode === m ? "#818cf8" : "rgba(99,102,241,0.1)",
              color: mode === m ? "#030912" : "#94a3b8",
            }}>
              {m === "rainbow" ? "🌈 Rainbow" : "🌤 Sky Colour"}
            </button>
          ))}
        </div>
        {mode === "rainbow" && (
          <label style={{ color: "#94a3b8", fontSize: "0.8rem", flex: 1, minWidth: 180 }}>
            Sun Elevation: <span style={{ color: "#fde68a", fontWeight: 700 }}>{sunAngle}°</span>
            <input type="range" min={20} max={80} value={sunAngle}
              onChange={e => setSunAngle(Number(e.target.value))}
              style={{ display: "block", width: "100%", marginTop: 4, accentColor: "#fde68a" }} />
          </label>
        )}
        <div style={{ color: "#64748b", fontSize: "0.75rem" }}>
          ROYGBIV: n<sub>red</sub>=1.331 → n<sub>violet</sub>=1.340 (chromatic dispersion)
        </div>
      </div>
    </div>
  );
}
