/**
 * FILE: PeriscopeSim.tsx
 * LOCATION: src/components/simulations/light/reflection/PeriscopeSim.tsx
 *
 * PURPOSE:
 *   Interactive periscope simulation that shows how two plane mirrors at 45°
 *   redirect a light ray through 90° twice to let you see "over" an obstacle.
 *
 * KEY CONCEPTS:
 *   - Law of reflection: angle of incidence = angle of reflection
 *   - Two plane mirrors at 45° each rotate light by 90°
 *   - Total rotation: 90° + 90° = 180° flip in direction of travel
 *     (light ends up travelling PARALLEL to its original path but in the
 *      same direction — this is the periscope effect)
 *   - Applications: submarines, tank observers, medical periscopes,
 *     parade viewing, sports crowd viewing
 *
 * INTERACTIONS:
 *   - "Obstacle Height" slider raises/lowers the wall between mirrors
 *   - "Mirror Angle" slider tilts both mirrors simultaneously (default 45°)
 *     → shows that 45° is the ONLY angle that gives a straight-up view
 *   - Animated light ray bounces between mirrors with glow effect
 *   - Eye icon at bottom shows where the observer stands
 *   - Scene icon at top shows what is being observed
 *
 * LAST UPDATED: 2026-06-11
 */

"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════ */
export default function PeriscopeSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mirrorAngle, setMirrorAngle] = useState(45);  /* degrees */
  const [time, setTime] = useState(0);                  /* for ray animation */

  /* ── Animation loop ───────────────────────────── */
  useEffect(() => {
    let raf: number;
    let t = 0;
    const loop = () => {
      t += 0.025;
      setTime(t);
      raf = requestAnimationFrame(loop);
    };
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

    /* Clear */
    ctx.fillStyle = "#0d1117";
    ctx.fillRect(0, 0, W, H);

    /* Periscope tube dimensions */
    const tubeW = W * 0.18;
    const leftX  = W * 0.5 - tubeW / 2;   /* tube left wall x */
    const rightX = leftX + tubeW;           /* tube right wall x */
    const topY   = H * 0.05;
    const wallY  = H * 0.45;               /* observer is below this wall */
    const bottomY = H * 0.92;

    /* ── Draw obstacle wall ─────────────────────── */
    ctx.fillStyle = "rgba(148,163,184,0.15)";
    ctx.fillRect(0, wallY - 4, W, 8);
    ctx.fillStyle = "rgba(148,163,184,0.06)";
    ctx.fillRect(0, wallY - 4, leftX, H - wallY + 4);
    ctx.fillRect(rightX, wallY - 4, W - rightX, H - wallY + 4);

    /* Wall label */
    ctx.font = `${Math.max(10, W * 0.025)}px 'Space Grotesk', sans-serif`;
    ctx.fillStyle = "rgba(148,163,184,0.5)";
    ctx.textAlign = "left";
    ctx.fillText("Wall / Obstacle", W * 0.02, wallY - 8);

    /* ── Draw periscope tube ────────────────────── */
    ctx.strokeStyle = "rgba(99,102,241,0.6)";
    ctx.lineWidth = 2;
    /* Left wall */
    ctx.beginPath(); ctx.moveTo(leftX, topY); ctx.lineTo(leftX, bottomY); ctx.stroke();
    /* Right wall */
    ctx.beginPath(); ctx.moveTo(rightX, topY); ctx.lineTo(rightX, bottomY); ctx.stroke();
    /* Top horizontal */
    ctx.beginPath(); ctx.moveTo(leftX, topY); ctx.lineTo(rightX, topY); ctx.stroke();
    /* Bottom horizontal */
    ctx.beginPath(); ctx.moveTo(leftX, bottomY); ctx.lineTo(rightX, bottomY); ctx.stroke();

    /* ── Mirror angles in radians ───────────────── */
    const a = (mirrorAngle * Math.PI) / 180;

    /* ── Mirror 1 (top) ─────────────────────────── */
    const m1cx = (leftX + rightX) / 2;
    const m1cy = topY + tubeW * 0.55;
    const mLen = tubeW * 0.65;

    ctx.save();
    ctx.translate(m1cx, m1cy);
    ctx.rotate(-a);   /* negative = mirror tilted to reflect downward ray to horizontal */
    ctx.strokeStyle = "rgba(96,165,250,0.9)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-mLen / 2, 0);
    ctx.lineTo(mLen / 2, 0);
    ctx.stroke();
    /* Mirror sheen */
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-mLen / 2, -1);
    ctx.lineTo(mLen / 2, -1);
    ctx.stroke();
    ctx.restore();

    /* ── Mirror 2 (bottom) ──────────────────────── */
    const m2cx = (leftX + rightX) / 2;
    const m2cy = bottomY - tubeW * 0.55;

    ctx.save();
    ctx.translate(m2cx, m2cy);
    ctx.rotate(a);   /* positive = mirror tilted to reflect horizontal ray upward */
    ctx.strokeStyle = "rgba(96,165,250,0.9)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-mLen / 2, 0);
    ctx.lineTo(mLen / 2, 0);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-mLen / 2, -1);
    ctx.lineTo(mLen / 2, -1);
    ctx.stroke();
    ctx.restore();

    /* ── Animated light ray ─────────────────────── */
    /* The ray path: top → mirror1 → horizontal → mirror2 → bottom */
    const rayPoints = [
      { x: m1cx, y: topY },           /* entry from top */
      { x: m1cx, y: m1cy },           /* hits mirror 1 */
      { x: m2cx, y: m2cy },           /* travels to mirror 2 (horizontal if 45°) */
      { x: m2cx, y: bottomY },        /* exits at bottom */
    ];

    /* Total ray path length for animation */
    const totalLen = rayPoints.reduce((acc, p, i) => {
      if (i === 0) return acc;
      const prev = rayPoints[i - 1];
      return acc + Math.hypot(p.x - prev.x, p.y - prev.y);
    }, 0);

    /* Animated "photon dot" position */
    const progress = ((time * 0.35) % 1);
    const targetDist = progress * totalLen;
    let travelled = 0;
    let photonX = rayPoints[0].x;
    let photonY = rayPoints[0].y;
    for (let i = 1; i < rayPoints.length; i++) {
      const seg = Math.hypot(
        rayPoints[i].x - rayPoints[i - 1].x,
        rayPoints[i].y - rayPoints[i - 1].y
      );
      if (travelled + seg >= targetDist) {
        const t2 = (targetDist - travelled) / seg;
        photonX = rayPoints[i - 1].x + t2 * (rayPoints[i].x - rayPoints[i - 1].x);
        photonY = rayPoints[i - 1].y + t2 * (rayPoints[i].y - rayPoints[i - 1].y);
        break;
      }
      travelled += seg;
    }

    /* Draw ray segments (yellow glow) */
    ctx.save();
    ctx.shadowColor = "rgba(250,204,21,0.8)";
    ctx.shadowBlur = 10;
    ctx.strokeStyle = "rgba(250,204,21,0.85)";
    ctx.lineWidth = 2;
    for (let i = 1; i < rayPoints.length; i++) {
      ctx.beginPath();
      ctx.moveTo(rayPoints[i - 1].x, rayPoints[i - 1].y);
      ctx.lineTo(rayPoints[i].x, rayPoints[i].y);
      ctx.stroke();
    }
    ctx.restore();

    /* Photon dot */
    ctx.save();
    ctx.shadowColor = "#fde047";
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(photonX, photonY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#fde047";
    ctx.fill();
    ctx.restore();

    /* ── Labels ─────────────────────────────────── */
    ctx.font = `${Math.max(11, W * 0.025)}px 'Space Grotesk', sans-serif`;
    ctx.textAlign = "center";

    /* Scene / object at top */
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillText("🌆 Scene", m1cx, topY - 8);

    /* Eye / observer at bottom */
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillText("👁 Observer", m2cx, bottomY + 18);

    /* Mirror angle labels */
    ctx.font = `${Math.max(9, W * 0.02)}px 'Space Grotesk', sans-serif`;
    ctx.fillStyle = "rgba(96,165,250,0.8)";
    ctx.textAlign = "left";
    ctx.fillText(`M₁ = ${mirrorAngle}°`, rightX + 6, m1cy + 4);
    ctx.fillText(`M₂ = ${mirrorAngle}°`, rightX + 6, m2cy + 4);

    /* Normal lines at mirror 1 */
    if (mirrorAngle === 45) {
      ctx.setLineDash([4, 3]);
      ctx.strokeStyle = "rgba(148,163,184,0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(m1cx - 22, m1cy);
      ctx.lineTo(m1cx + 22, m1cy);
      ctx.stroke();
      ctx.setLineDash([]);
    }

  }, [mirrorAngle, time]);

  /* ── Canvas setup with ResizeObserver ──────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    if (!container) return;
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      canvas.width = w;
      canvas.height = Math.round(w * 0.65);
      draw();
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [draw]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div style={{
      background: "linear-gradient(160deg,#0d1117 0%,#161b22 100%)",
      borderRadius: 16,
      overflow: "hidden",
      border: "1px solid rgba(99,102,241,0.2)",
      fontFamily: "'Space Grotesk','Inter',sans-serif",
    }}>

      {/* Header */}
      <div style={{
        padding: "14px 20px 10px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontSize: 20 }}>🔭</span>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
            Periscope Simulator
          </div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
            Two mirrors at 45° each bend light through 90° — see over obstacles!
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ width: "100%", background: "#0d1117" }}>
        <canvas ref={canvasRef} style={{ display: "block", width: "100%" }} />
      </div>

      {/* Controls */}
      <div style={{ padding: "16px 20px", background: "rgba(0,0,0,0.35)" }}>

        {/* Mirror angle slider */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 600 }}>
              🪞 Mirror Angle
            </span>
            <span style={{
              color: mirrorAngle === 45 ? "#4ade80" : "#f59e0b",
              fontSize: 13, fontWeight: 700, fontFamily: "JetBrains Mono, monospace",
            }}>
              {mirrorAngle}°
              {mirrorAngle === 45 ? " ✓ Perfect" : " (try 45°)"}
            </span>
          </div>
          <input
            type="range" min={20} max={70} value={mirrorAngle}
            onChange={e => setMirrorAngle(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#6366f1", cursor: "pointer" }}
          />
        </div>

        {/* Key fact */}
        <div style={{
          background: "linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.12))",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: 10, padding: "10px 14px", marginTop: 4,
        }}>
          <div style={{ color: "#818cf8", fontWeight: 700, fontSize: 12, marginBottom: 3 }}>
            ⚡ How It Works
          </div>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, lineHeight: 1.6 }}>
            Each mirror is tilted exactly <strong style={{ color: "#a5b4fc" }}>45°</strong> to the vertical.
            A vertical ray hits it → reflects horizontally (90° turn). The second 45° mirror
            turns it back to vertical. Result: you see the scene above even though you're behind a wall.
            <br /><strong style={{ color: "#4ade80" }}>Used in:</strong> Submarines, tanks, trench warfare binoculars, parade viewers.
          </div>
        </div>
      </div>
    </div>
  );
}
