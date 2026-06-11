/**
 * FILE: ScatteringBlueSkySimNew.tsx
 * LOCATION: src/components/simulations/light/dispersion/ScatteringBlueSkySimNew.tsx
 * PURPOSE: Rayleigh Scattering simulation — why the sky is blue and sunsets are red.
 *
 * PHYSICS:
 *   Rayleigh scattering intensity ∝ 1/λ⁴  (shorter wavelength → scattered MORE)
 *   Blue light (λ ≈ 450 nm) scatters ~5.5× more than red (λ ≈ 700 nm).
 *   During noon: sunlight travels short path → blue scattered in all directions → blue sky.
 *   During sunset: sunlight travels long path → all blue scattered away → orange/red sky.
 *
 * FEATURES:
 *   ─ Full sky-scene canvas with Earth curvature and atmosphere layers
 *   ─ Animated sunlight beam with wavelength-coloured photon particles
 *   ─ Time-of-day slider (Sunrise → Noon → Sunset → Night)
 *   ─ "Path length" bar showing how much atmosphere sunlight traverses
 *   ─ Scatter particles burst from air molecules with correct hue
 *   ─ Live sky gradient that changes with sun position
 *   ─ Observer eye shows what colour they perceive
 *   ─ Wavelength scatter table (VIBGYOR with relative scatter amounts)
 *   ─ Smooth 60 fps animation, responsive canvas, HiDPI support
 *
 * LAST UPDATED: 2026-06-11
 */

"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

/* ─────────────────────────────────────────────
 * WAVELENGTH → RGB COLOUR
 * Approximate visible spectrum mapping
 * ───────────────────────────────────────────── */
const SPECTRUM: { name: string; λ: number; rgb: string; scatter: number }[] = [
  { name: "Violet", λ: 400, rgb: "#8b5cf6", scatter: 9.4 },
  { name: "Indigo", λ: 435, rgb: "#6366f1", scatter: 7.5 },
  { name: "Blue",   λ: 460, rgb: "#3b82f6", scatter: 5.6 },
  { name: "Green",  λ: 520, rgb: "#22c55e", scatter: 3.2 },
  { name: "Yellow", λ: 580, rgb: "#eab308", scatter: 2.0 },
  { name: "Orange", λ: 620, rgb: "#f97316", scatter: 1.5 },
  { name: "Red",    λ: 680, rgb: "#ef4444", scatter: 1.0 },
];

/* ─────────────────────────────────────────────
 * SCATTER PARTICLE
 * ───────────────────────────────────────────── */
interface ScatterParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;      /* 0 → 1 lifetime fraction */
  maxLife: number;
  size: number;
}

/* ─────────────────────────────────────────────
 * SKY COLOUR AT GIVEN SUN ANGLE
 * sunFraction: 0 = night, 0.25 = sunrise, 0.5 = noon, 0.75 = sunset
 * ───────────────────────────────────────────── */
function skyColorTop(f: number): string {
  if (f < 0.15 || f > 0.88) return "#0a0f1e";
  if (f < 0.28) {
    const t = (f - 0.15) / 0.13;
    return `rgb(${Math.round(30+t*50)},${Math.round(20+t*60)},${Math.round(40+t*100)})`;
  }
  if (f > 0.72) {
    const t = (f - 0.72) / 0.16;
    return `rgb(${Math.round(40+t*10)},${Math.round(40-t*30)},${Math.round(90-t*60)})`;
  }
  return "#0369a1";
}

function skyColorBot(f: number): string {
  if (f < 0.15 || f > 0.88) return "#111827";
  if (f < 0.28) {
    const t = (f - 0.15) / 0.13;
    return `rgb(${Math.round(180+t*50)},${Math.round(80+t*80)},${Math.round(20+t*30)})`;
  }
  if (f > 0.72) {
    const t = (f - 0.72) / 0.16;
    return `rgb(${Math.round(230-t*50)},${Math.round(100-t*60)},${Math.round(30-t*20)})`;
  }
  return "#7dd3fc";
}

function sunColor(f: number): string {
  if (f < 0.20 || f > 0.85) return "#fbbf24";
  if (f < 0.30 || f > 0.72) return "#f97316";
  return "#fef9c3";
}

/* ═══════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════ */
export default function ScatteringBlueSkySimNew() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef      = useRef<number>(0);
  const timeRef      = useRef<number>(0);
  const particlesRef = useRef<ScatterParticle[]>([]);

  /* 0 = midnight, 0.5 = noon, 1 = midnight */
  const [timeOfDay, setTimeOfDay] = useState<number>(0.5);

  /* Spawn scatter particles periodically */
  const spawnParticles = useCallback((sunX: number, sunY: number, f: number, W: number, H: number) => {
    if (f < 0.12 || f > 0.92) return;

    /* How many blue particles vs red — depends on path length */
    const pathLength = Math.abs(f - 0.5) * 2; /* 0 at noon, 1 at horizon */
    const nBlue = Math.max(1, Math.round(6 - pathLength * 5));
    const nRed  = Math.max(0, Math.round(pathLength * 3));

    const centerX = W * 0.5;
    const centerY = H * 0.6;

    /* Spawn blue scatter points across the atmosphere */
    for (let i = 0; i < nBlue; i++) {
      const bx = centerX + (Math.random() - 0.5) * W * 0.8;
      const by = centerY - Math.random() * H * 0.35;
      particlesRef.current.push({
        x: bx, y: by,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        color: `hsl(${210 + Math.random() * 40}, 90%, 65%)`,
        life: 0, maxLife: 60 + Math.random() * 40,
        size: 2 + Math.random() * 2,
      });
    }

    /* Red/orange particles travelling towards observer (few, only at sunset) */
    for (let i = 0; i < nRed; i++) {
      particlesRef.current.push({
        x: sunX, y: sunY,
        vx: (centerX - sunX) / 80 + (Math.random() - 0.5) * 0.5,
        vy: (centerY - sunY) / 80 + (Math.random() - 0.5) * 0.3,
        color: `hsl(${15 + Math.random() * 30}, 95%, 60%)`,
        life: 0, maxLife: 80 + Math.random() * 40,
        size: 1.5 + Math.random() * 1.5,
      });
    }

    /* Keep particle count manageable */
    if (particlesRef.current.length > 200) {
      particlesRef.current = particlesRef.current.slice(-160);
    }
  }, []);

  const draw = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width;
    const H = canvas.height;
    const w = W / dpr;
    const h = H / dpr;

    timeRef.current = timestamp * 0.001;

    ctx.clearRect(0, 0, W, H);

    const f = timeOfDay; /* 0–1, 0.5 = noon */

    /* ── Sky gradient ── */
    const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.72);
    skyGrad.addColorStop(0, skyColorTop(f));
    skyGrad.addColorStop(1, skyColorBot(f));
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H * 0.72);

    /* ── Ground ── */
    const groundGrad = ctx.createLinearGradient(0, H * 0.7, 0, H);
    groundGrad.addColorStop(0, f > 0.25 && f < 0.80 ? "#1c3a1c" : "#111827");
    groundGrad.addColorStop(1, "#0a0f1e");
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, H * 0.70, W, H * 0.30);

    /* ── Atmosphere curve (gentle arc) ── */
    ctx.save();
    ctx.strokeStyle = "rgba(147,197,253,0.18)";
    ctx.lineWidth = 2 * dpr;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.72);
    for (let x = 0; x <= w; x++) {
      const sag = 18 * Math.sin((x / w) * Math.PI);
      ctx.lineTo(x * dpr, (h * 0.72 - sag) * dpr);
    }
    ctx.stroke();
    ctx.restore();

    /* ── Sun position (tracks timeOfDay) ── */
    const sunAngle = (f - 0.5) * Math.PI * 0.85; /* -PI/2..+PI/2 range */
    const sunR = h * 0.4;
    const sunX = w * 0.5 + sunR * Math.sin(sunAngle);
    const sunY = h * 0.70 - sunR * Math.abs(Math.cos(sunAngle)) * 0.95;

    if (f > 0.12 && f < 0.92) {
      /* Sun glow */
      const sc = sunColor(f);
      const sunGlow = ctx.createRadialGradient(sunX * dpr, sunY * dpr, 0, sunX * dpr, sunY * dpr, 55 * dpr);
      sunGlow.addColorStop(0, sc);
      sunGlow.addColorStop(0.3, `${sc}88`);
      sunGlow.addColorStop(1, "transparent");
      ctx.save();
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX * dpr, sunY * dpr, 55 * dpr, 0, Math.PI * 2);
      ctx.fill();
      /* Sun disc */
      ctx.fillStyle = sc;
      ctx.shadowColor = sc;
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(sunX * dpr, sunY * dpr, 18 * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      /* ── Sunbeam towards observer ── */
      const obsX = w * 0.5;
      const obsY = h * 0.80;

      /* Path-length indicator line */
      ctx.save();
      ctx.strokeStyle = `${sc}55`;
      ctx.lineWidth = 1.5 * dpr;
      ctx.setLineDash([6 * dpr, 5 * dpr]);
      ctx.beginPath();
      ctx.moveTo(sunX * dpr, sunY * dpr);
      ctx.lineTo(obsX * dpr, obsY * dpr);
      ctx.stroke();
      ctx.restore();
    }

    /* ── Stars (night/twilight) ── */
    if (f < 0.22 || f > 0.80) {
      const starAlpha = f < 0.22 ? 1 - f / 0.22 : (f - 0.80) / 0.20;
      for (let i = 0; i < 30; i++) {
        const sx = (((i * 137.5) % 100) / 100) * w;
        const sy = (((i * 83.1) % 100) / 100) * h * 0.65;
        const twinkle = 0.5 + 0.5 * Math.sin(timeRef.current * 1.5 + i * 1.2);
        ctx.save();
        ctx.fillStyle = "#f8fafc";
        ctx.globalAlpha = starAlpha * twinkle * 0.8;
        ctx.beginPath();
        ctx.arc(sx * dpr, sy * dpr, 1.5 * dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    /* ── Scatter particles ── */
    /* Spawn new ones periodically */
    if (Math.random() < 0.35) spawnParticles(sunX, sunY, f, w, h);

    ctx.save();
    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const p = particlesRef.current[i];
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      if (p.life > p.maxLife) {
        particlesRef.current.splice(i, 1);
        continue;
      }
      const progress = p.life / p.maxLife;
      const alpha = progress < 0.2 ? progress / 0.2 : 1 - (progress - 0.2) / 0.8;
      ctx.save();
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.globalAlpha = alpha * 0.85;
      ctx.beginPath();
      ctx.arc(p.x * dpr, p.y * dpr, p.size * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    /* ── Observer eye ── */
    const obsX2 = w * 0.5;
    const obsY2 = h * 0.82;
    ctx.save();
    ctx.font = `${22 * dpr}px serif`;
    ctx.textAlign = "center";
    ctx.fillText("👁️", obsX2 * dpr, obsY2 * dpr);
    ctx.fillStyle = "#94a3b8";
    ctx.font = `${9 * dpr}px Inter, sans-serif`;
    ctx.fillText("Observer", obsX2 * dpr, (obsY2 + 14) * dpr);
    ctx.restore();

    /* ── Sky colour perception badge ── */
    let perceivedColor = "#0369a1";
    let perceivedLabel = "Blue Sky";
    if (f < 0.18 || f > 0.87) { perceivedColor = "#1e1b4b"; perceivedLabel = "Dark/Night"; }
    else if (f < 0.30 || f > 0.72) { perceivedColor = "#c2410c"; perceivedLabel = "Red/Orange Sunset"; }

    ctx.save();
    ctx.fillStyle = `${perceivedColor}cc`;
    ctx.strokeStyle = `${perceivedColor}ff`;
    ctx.lineWidth = 1.5 * dpr;
    const badgeW = 120 * dpr;
    const badgeH = 28 * dpr;
    roundRect(ctx, (w * 0.5 - 60) * dpr, (h * 0.90) * dpr, badgeW, badgeH, 8 * dpr);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#f8fafc";
    ctx.font = `bold ${10 * dpr}px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(`Perceived: ${perceivedLabel}`, w * 0.5 * dpr, (h * 0.90 + 18) * dpr);
    ctx.restore();

    /* Path length label */
    const pathFrac = Math.abs(f - 0.5) * 2;
    ctx.save();
    ctx.fillStyle = "rgba(148,163,184,0.85)";
    ctx.font = `${10 * dpr}px Inter, sans-serif`;
    ctx.textAlign = "left";
    ctx.fillText(`Atmosphere path: ${(pathFrac * 100).toFixed(0)}% longer than noon`, 10 * dpr, (h - 10) * dpr);
    ctx.restore();

    animRef.current = requestAnimationFrame(draw);
  }, [timeOfDay, spawnParticles]);

  useEffect(() => {
    cancelAnimationFrame(animRef.current);
    particlesRef.current = [];
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ro = new ResizeObserver(() => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width  = rect.width * dpr;
      canvas.height = Math.max(260, rect.width * 0.50) * dpr;
      canvas.style.width  = `${rect.width}px`;
      canvas.style.height = `${Math.max(260, rect.width * 0.50)}px`;
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  const timeLabel = (() => {
    if (timeOfDay < 0.20) return "🌙 Night";
    if (timeOfDay < 0.30) return "🌅 Sunrise";
    if (timeOfDay < 0.45) return "🌤️ Morning";
    if (timeOfDay < 0.55) return "☀️ Noon";
    if (timeOfDay < 0.68) return "🌤️ Afternoon";
    if (timeOfDay < 0.78) return "🌇 Sunset";
    return "🌙 Night";
  })();

  const pathLen = Math.abs(timeOfDay - 0.5) * 2;
  const blueScatter = Math.max(5, Math.round(100 - pathLen * 80));
  const redThrough  = Math.min(100, Math.round(20 + pathLen * 80));

  const panelStyle: React.CSSProperties = {
    background: "linear-gradient(135deg,#0f172a,#0a1628)",
    borderRadius: "16px", padding: "20px",
    fontFamily: "Inter,system-ui,sans-serif",
  };
  const chip: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px", padding: "10px 14px", fontSize: "12px", color: "#94a3b8",
    flex: "1", minWidth: "110px",
  };
  const lbl: React.CSSProperties = { display: "block", fontSize: "10px", color: "#64748b", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.06em" };
  const val: React.CSSProperties = { fontSize: "17px", fontWeight: 700, color: "#f8fafc", lineHeight: 1.2 };

  return (
    <div style={panelStyle}>
      <div ref={containerRef} style={{ width: "100%", borderRadius: "12px", overflow: "hidden" }}>
        <canvas ref={canvasRef} style={{ display: "block" }} />
      </div>

      {/* Time of day slider */}
      <div style={{ marginTop: "14px" }}>
        <label style={{ fontSize: "12px", color: "#94a3b8", display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <span>Time of Day</span>
          <span style={{ color: "#fbbf24", fontWeight: 700 }}>{timeLabel}</span>
        </label>
        <input type="range" min={0} max={100} value={Math.round(timeOfDay * 100)}
          onChange={e => { setTimeOfDay(Number(e.target.value) / 100); }}
          style={{ width: "100%", accentColor: "#fbbf24" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#475569", marginTop: "2px" }}>
          <span>🌙 Night</span><span>🌅 Sunrise</span><span>☀️ Noon</span><span>🌇 Sunset</span><span>🌙 Night</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "14px" }}>
        <div style={chip}>
          <span style={lbl}>Blue Scatter %</span>
          <span style={{ ...val, color: "#3b82f6" }}>{blueScatter}%</span>
        </div>
        <div style={chip}>
          <span style={lbl}>Red Transmission</span>
          <span style={{ ...val, color: "#ef4444" }}>{redThrough}%</span>
        </div>
        <div style={chip}>
          <span style={lbl}>Scattering Law</span>
          <span style={{ ...val, fontSize: "11px", color: "#a5b4fc" }}>I ∝ 1/λ⁴</span>
        </div>
      </div>

      {/* Scatter table */}
      <div style={{ marginTop: "14px" }}>
        <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Relative Scattering by Colour (Rayleigh Law)
        </div>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {SPECTRUM.map(s => (
            <div key={s.name} style={{
              flex: "1", minWidth: "48px", textAlign: "center",
              background: `${s.rgb}22`, border: `1px solid ${s.rgb}55`,
              borderRadius: "8px", padding: "6px 4px",
            }}>
              <div style={{ width: "100%", height: `${Math.round(s.scatter * 5)}px`, background: s.rgb, borderRadius: "4px", marginBottom: "4px" }} />
              <div style={{ fontSize: "9px", color: "#94a3b8" }}>{s.name}</div>
              <div style={{ fontSize: "9px", color: s.rgb, fontWeight: 700 }}>{s.scatter}×</div>
            </div>
          ))}
        </div>
      </div>

      {/* Key fact */}
      <div style={{
        marginTop: "14px", padding: "12px 16px",
        background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.20)",
        borderRadius: "10px", fontSize: "12.5px", color: "#94a3b8", lineHeight: 1.6,
      }}>
        💡 <strong style={{ color: "#60a5fa" }}>Key:</strong> Blue light (λ=450nm) scatters <strong>9× more</strong> than red (λ=680nm) because scattering ∝ 1/λ⁴. At sunset, sunlight travels through much more atmosphere, all blue is scattered away, leaving only red-orange for your eyes.
      </div>
    </div>
  );
}

/* Helper: rounded rectangle path */
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}
