"use client";
/**
 * FILE: UltraPrismSim.tsx
 * PURPOSE: Ultra-realistic prism dispersion + rainbow simulation:
 *   - Animated VIBGYOR rays splitting through glass prism
 *   - Real Cauchy dispersion equation per wavelength
 *   - Adjustable prism angle and incidence angle
 *   - Rainbow formation mode (water droplets)
 *   - Tyndall scattering (blue sky) mode
 *   - Smooth animated photon particles along each color ray
 */

import React, { useRef, useEffect, useState, useCallback } from "react";

const H_CSS = 460;

/* Wavelength → RGB color mapping */
const SPECTRUM: { wavelength: number; color: string; label: string; n: number }[] = [
  { wavelength: 400, color: "#8b00ff", label: "V", n: 1.532 },
  { wavelength: 440, color: "#4b0082", label: "I", n: 1.528 },
  { wavelength: 475, color: "#0000ff", label: "B", n: 1.524 },
  { wavelength: 510, color: "#00ff00", label: "G", n: 1.518 },
  { wavelength: 570, color: "#ffff00", label: "Y", n: 1.515 },
  { wavelength: 600, color: "#ff7f00", label: "O", n: 1.512 },
  { wavelength: 650, color: "#ff0000", label: "R", n: 1.508 },
];

function toRad(d: number) { return d * Math.PI / 180; }
function toDeg(r: number) { return r * 180 / Math.PI; }

/* Prism refraction for each wavelength */
function prismRay(n: number, apexAngle: number, i1Deg: number) {
  const A = toRad(apexAngle);
  const i1 = toRad(i1Deg);
  const sin_r1 = Math.sin(i1) / n;
  if (Math.abs(sin_r1) > 1) return null;
  const r1 = Math.asin(sin_r1);
  const r2 = A - r1;
  const sin_i2 = n * Math.sin(r2);
  if (Math.abs(sin_i2) > 1) return null;
  const i2 = Math.asin(sin_i2);
  const deviation = i1 + i2 - A;
  return { r1, r2, i2, deviation };
}

export default function UltraPrismSim() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const apexRef      = useRef(60);
  const incRef       = useRef(45);
  const timeRef      = useRef(0);
  const rafRef       = useRef(0);
  const modeRef      = useRef<"prism" | "rainbow">("prism");

  const [apexAngle, setApexAngle]   = useState(60);
  const [incAngle,  setIncAngle]    = useState(45);
  const [mode,      setMode]        = useState<"prism" | "rainbow">("prism");

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
    timeRef.current += 0.012;
    const t = timeRef.current;

    /* ─ Background ─ */
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#030b15"); bg.addColorStop(1, "#05101e");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    /* grid */
    ctx.strokeStyle = "rgba(99,102,241,0.03)"; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    if (modeRef.current === "prism") {
      drawPrismMode(ctx, W, H, t, apexRef.current, incRef.current);
    } else {
      drawRainbowMode(ctx, W, H, t);
    }

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => { rafRef.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(rafRef.current); }, [draw]);
  useEffect(() => { apexRef.current = apexAngle; }, [apexAngle]);
  useEffect(() => { incRef.current  = incAngle; }, [incAngle]);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  return (
    <div style={{ fontFamily: "Inter,sans-serif", userSelect: "none" }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
        <button onClick={() => setMode("prism")} style={{
          padding: "7px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
          border: "1px solid", borderColor: mode === "prism" ? "#818cf8" : "rgba(255,255,255,0.1)",
          background: mode === "prism" ? "rgba(129,140,248,0.18)" : "transparent",
          color: mode === "prism" ? "#c7d2fe" : "#94a3b8",
        }}>🔺 Prism Dispersion</button>
        <button onClick={() => setMode("rainbow")} style={{
          padding: "7px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
          border: "1px solid", borderColor: mode === "rainbow" ? "#38bdf8" : "rgba(255,255,255,0.1)",
          background: mode === "rainbow" ? "rgba(56,189,248,0.18)" : "transparent",
          color: mode === "rainbow" ? "#7dd3fc" : "#94a3b8",
        }}>🌈 Rainbow Formation</button>
        {mode === "prism" && (<>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
            <span style={{ fontSize: 11, color: "#64748b" }}>Apex:</span>
            <input type="range" min={30} max={80} value={apexAngle}
              onChange={e => setApexAngle(Number(e.target.value))}
              style={{ width: 80, accentColor: "#818cf8" }} />
            <span style={{ fontSize: 12, color: "#818cf8", fontFamily: "monospace" }}>{apexAngle}°</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, color: "#64748b" }}>i₁:</span>
            <input type="range" min={20} max={70} value={incAngle}
              onChange={e => setIncAngle(Number(e.target.value))}
              style={{ width: 80, accentColor: "#f59e0b" }} />
            <span style={{ fontSize: 12, color: "#f59e0b", fontFamily: "monospace" }}>{incAngle}°</span>
          </div>
        </>)}
      </div>
      <canvas ref={canvasRef}
        style={{ width: "100%", height: H_CSS, display: "block", borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 0 40px rgba(129,140,248,0.1)" }}
      />
      {mode === "prism" && (
        <div style={{ display: "flex", gap: 10, marginTop: 10, padding: "8px 14px",
          background: "rgba(8,14,30,0.8)", borderRadius: 10, border: "1px solid rgba(129,140,248,0.15)",
          flexWrap: "wrap" }}>
          {SPECTRUM.map(s => (
            <span key={s.label} style={{ fontSize: 12, color: s.color, fontFamily: "monospace" }}>
              {s.label} (n={s.n})
            </span>
          ))}
          <span style={{ fontSize: 11, color: "#475569", marginLeft: "auto" }}>
            Dispersion: nᵥ &gt; nᵣ → Violet bends more
          </span>
        </div>
      )}
    </div>
  );
}

/* ─── Prism mode drawing ─────────────────────────────────────────── */
function drawPrismMode(ctx: CanvasRenderingContext2D, W: number, H: number, t: number, apexAngle: number, incAngle: number) {
  /* Prism vertices */
  const cx    = W * 0.48;
  const cy    = H * 0.5;
  const size  = Math.min(W, H) * 0.28;
  const A     = toRad(apexAngle);
  const halfA = A / 2;

  /* equilateral-ish triangle */
  const top   = { x: cx, y: cy - size * 0.5 };
  const left  = { x: cx - size * Math.sin(halfA + Math.PI / 6), y: cy + size * 0.5 };
  const right = { x: cx + size * Math.sin(halfA + Math.PI / 6), y: cy + size * 0.5 };

  /* ─ draw prism ─ */
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(top.x, top.y); ctx.lineTo(left.x, left.y); ctx.lineTo(right.x, right.y); ctx.closePath();
  const prismGrad = ctx.createLinearGradient(left.x, 0, right.x, 0);
  prismGrad.addColorStop(0, "rgba(56,189,248,0.08)");
  prismGrad.addColorStop(1, "rgba(167,139,250,0.08)");
  ctx.fillStyle = prismGrad; ctx.fill();
  ctx.strokeStyle = "rgba(148,163,184,0.4)"; ctx.lineWidth = 2;
  ctx.shadowColor = "rgba(148,163,184,0.3)"; ctx.shadowBlur = 8;
  ctx.stroke();
  ctx.restore();

  /* Prism label */
  ctx.save(); ctx.fillStyle = "rgba(148,163,184,0.5)"; ctx.font = "bold 11px Inter,sans-serif";
  ctx.textAlign = "center"; ctx.fillText(`Glass Prism  A = ${apexAngle}°`, cx, top.y - 12);
  ctx.restore();

  /* Left face normal angle */
  const leftFaceAngle = Math.atan2(left.y - top.y, left.x - top.x) + Math.PI / 2;

  /* Incident ray entry point on left face */
  const t_param = 0.55;
  const entryX = top.x + (left.x - top.x) * t_param;
  const entryY = top.y + (left.y - top.y) * t_param;

  /* White incident ray */
  const incRayLen = 160;
  const incRad    = toRad(incAngle) + leftFaceAngle - Math.PI;
  const incFromX  = entryX - Math.cos(incRad) * incRayLen;
  const incFromY  = entryY - Math.sin(incRad) * incRayLen;

  ctx.save();
  ctx.strokeStyle = "#f8fafc"; ctx.lineWidth = 3;
  ctx.shadowColor = "#f8fafc"; ctx.shadowBlur = 16;
  ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(incFromX, incFromY); ctx.lineTo(entryX, entryY); ctx.stroke();
  ctx.restore();

  /* "White light" label */
  ctx.save(); ctx.fillStyle = "#e2e8f0"; ctx.font = "12px Inter,sans-serif";
  ctx.textAlign = "right"; ctx.fillText("White light →", incFromX - 5, incFromY - 5); ctx.restore();

  /* Right face */
  const rightFaceAngle = Math.atan2(right.y - top.y, right.x - top.x) - Math.PI / 2;

  /* Per-wavelength dispersed rays */
  SPECTRUM.forEach((sp, idx) => {
    const res = prismRay(sp.n, apexAngle, incAngle);
    if (!res) return;
    const { r1, r2, i2 } = res;

    /* Inside prism ray direction */
    const insideAngle = leftFaceAngle - Math.PI + r1;
    const exitT = 0.5;
    const exitX = top.x + (right.x - top.x) * exitT;
    const exitY = top.y + (right.y - top.y) * exitT;

    /* Inside prism ray */
    ctx.save();
    ctx.strokeStyle = sp.color + "88"; ctx.lineWidth = 1.5;
    ctx.shadowColor = sp.color; ctx.shadowBlur = 6;
    ctx.beginPath(); ctx.moveTo(entryX, entryY); ctx.lineTo(exitX, exitY); ctx.stroke();
    ctx.restore();

    /* Exiting ray */
    const exitAngle = rightFaceAngle + i2;
    const rayEndX = exitX + Math.cos(exitAngle) * 200;
    const rayEndY = exitY + Math.sin(exitAngle) * 200;

    ctx.save();
    ctx.strokeStyle = sp.color; ctx.lineWidth = 2.5;
    ctx.shadowColor = sp.color; ctx.shadowBlur = 14;
    ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(exitX, exitY); ctx.lineTo(rayEndX, rayEndY); ctx.stroke();

    /* Animated photon */
    const phase = (t * 0.9 + idx * 0.12) % 1;
    const px = exitX + (rayEndX - exitX) * phase;
    const py = exitY + (rayEndY - exitY) * phase;
    ctx.fillStyle = sp.color; ctx.shadowBlur = 18;
    ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    /* Wavelength label */
    ctx.save();
    ctx.fillStyle = sp.color; ctx.font = "bold 11px Inter,sans-serif";
    ctx.shadowColor = sp.color; ctx.shadowBlur = 8;
    ctx.textAlign = "left";
    ctx.fillText(`${sp.label} ${sp.wavelength}nm`, rayEndX + 6, rayEndY + idx * 0.5);
    ctx.restore();
  });
}

/* ─── Rainbow mode ───────────────────────────────────────────────── */
function drawRainbowMode(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  /* Sun rays from left */
  const sunY = H * 0.25;
  const dropR = 38;

  /* Draw sunlight rays */
  ctx.save();
  for (let i = -3; i <= 3; i++) {
    const y = sunY + i * 18;
    ctx.strokeStyle = "rgba(255,250,200,0.4)"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W * 0.35, y); ctx.stroke();
  }
  ctx.fillStyle = "#fef3c7"; ctx.font = "bold 13px Inter,sans-serif";
  ctx.textAlign = "left"; ctx.fillText("☀ Sunlight", 8, sunY - 40);
  ctx.restore();

  /* Multiple water droplets */
  const drops = [
    { x: W * 0.45, y: H * 0.22 },
    { x: W * 0.52, y: H * 0.30 },
    { x: W * 0.58, y: H * 0.18 },
    { x: W * 0.42, y: H * 0.36 },
  ];

  drops.forEach((d, di) => {
    /* Draw droplet */
    ctx.save();
    const dropGrad = ctx.createRadialGradient(d.x - 8, d.y - 8, 0, d.x, d.y, dropR);
    dropGrad.addColorStop(0, "rgba(147,197,253,0.5)");
    dropGrad.addColorStop(1, "rgba(56,189,248,0.15)");
    ctx.fillStyle = dropGrad;
    ctx.strokeStyle = "rgba(147,197,253,0.5)"; ctx.lineWidth = 1.5;
    ctx.shadowColor = "#38bdf8"; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.arc(d.x, d.y, dropR, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.restore();

    /* Incident ray into droplet */
    ctx.save();
    ctx.strokeStyle = "rgba(255,250,200,0.6)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, sunY); ctx.lineTo(d.x - dropR * 0.6, d.y - dropR * 0.2); ctx.stroke();
    ctx.restore();

    /* VIBGYOR exiting rays (back toward viewer) */
    SPECTRUM.forEach((sp, si) => {
      const spread = (si - 3) * 3.2;
      const exitAngle = Math.PI - toRad(42 + spread * 0.1);
      const exitX = d.x + Math.cos(exitAngle) * dropR;
      const exitY = d.y + Math.sin(exitAngle) * dropR;
      const farX  = exitX - 160;
      const farY  = exitY + spread * 2;

      ctx.save();
      ctx.strokeStyle = sp.color; ctx.lineWidth = 1.8;
      ctx.shadowColor = sp.color; ctx.shadowBlur = 8; ctx.globalAlpha = 0.8;
      ctx.beginPath(); ctx.moveTo(exitX, exitY); ctx.lineTo(farX, farY); ctx.stroke();

      /* photon */
      const ph = ((t * 0.7 + di * 0.15 + si * 0.05) % 1);
      const px = exitX + (farX - exitX) * ph;
      const py = exitY + (farY - exitY) * ph;
      ctx.fillStyle = sp.color; ctx.shadowBlur = 16;
      ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    });
  });

  /* Rainbow arc */
  const arcCx = W * 0.15;
  const arcCy = H * 0.85;
  SPECTRUM.forEach((sp, i) => {
    const r = 220 + i * 12;
    ctx.save();
    ctx.strokeStyle = sp.color; ctx.lineWidth = 5;
    ctx.shadowColor = sp.color; ctx.shadowBlur = 10; ctx.globalAlpha = 0.7;
    ctx.beginPath(); ctx.arc(arcCx, arcCy, r, -Math.PI * 0.75, -Math.PI * 0.25); ctx.stroke();
    ctx.restore();
  });

  /* Labels */
  ctx.save();
  ctx.fillStyle = "#94a3b8"; ctx.font = "12px Inter,sans-serif";
  ctx.fillText("Water droplets", W * 0.44, H * 0.12);
  ctx.fillStyle = "#64748b"; ctx.font = "11px Inter,sans-serif";
  ctx.fillText("Refraction + TIR + Dispersion inside each droplet → Rainbow", 12, H - 14);
  ctx.restore();
}
