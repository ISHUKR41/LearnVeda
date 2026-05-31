/**
 * FILE: PhysicsSimulation.tsx
 * LOCATION: src/components/physics/PhysicsSimulation.tsx
 * PURPOSE: Professional physics simulations for Class 9 Force & Laws of Motion.
 *          Each topic features 5 interactive simulations selectable via tabs,
 *          PLUS a 6th real-world bonus simulation from BonusSimulations.tsx.
 *          Topics covered: Balanced/Unbalanced Forces, Newton's 1st/2nd/3rd Laws,
 *          and Conservation of Momentum.
 * LAST UPDATED: 2026-05-29
 */

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import styles from "./PhysicsSimulation.module.css";
import {
  CarSafetySimulation,
  SpacecraftSimulation,
  RocketLaunchSimulation,
  RecoilSimulation,
  BallisticPendulumSimulation,
} from "./BonusSimulations";

/* ─── Lazy-load the 15-sim advanced packs per topic ─── */
const AdvancedTopic1Sims = dynamic(
  () => import("./AdvancedSim1").then((m) => m.AdvancedTopic1Sims),
  { ssr: false }
);
const AdvancedTopic2Sims = dynamic(
  () => import("./AdvancedSim2").then((m) => m.AdvancedTopic2Sims),
  { ssr: false }
);
const AdvancedTopic3Sims = dynamic(
  () => import("./AdvancedSim3").then((m) => m.AdvancedTopic3Sims),
  { ssr: false }
);
const AdvancedTopic4Sims = dynamic(
  () => import("./AdvancedSim4").then((m) => m.AdvancedTopic4Sims),
  { ssr: false }
);
const AdvancedTopic5Sims = dynamic(
  () => import("./AdvancedSim5").then((m) => m.AdvancedTopic5Sims),
  { ssr: false }
);

/* ─── Lazy-load the 9-sim EXTRA packs per topic (new — brings total to ~30 per topic) ─── */
const AdvancedTopic1ExtraSims = dynamic(
  () => import("./AdvancedSim1Extra").then((m) => m.AdvancedTopic1ExtraSims),
  { ssr: false }
);
const AdvancedTopic2ExtraSims = dynamic(
  () => import("./AdvancedSim2Extra").then((m) => m.AdvancedTopic2ExtraSims),
  { ssr: false }
);
const AdvancedTopic3ExtraSims = dynamic(
  () => import("./AdvancedSim3Extra").then((m) => m.AdvancedTopic3ExtraSims),
  { ssr: false }
);
const AdvancedTopic4ExtraSims = dynamic(
  () => import("./AdvancedSim4Extra").then((m) => m.AdvancedTopic4ExtraSims),
  { ssr: false }
);
const AdvancedTopic5ExtraSims = dynamic(
  () => import("./AdvancedSim5Extra").then((m) => m.AdvancedTopic5ExtraSims),
  { ssr: false }
);

/* ───────────────────────────────────────────────────────
 * Helper: custom tab button row used by every simulation
 * ─────────────────────────────────────────────────────── */
interface SimTabsProps {
  tabs: string[];
  activeTab: number;
  setActiveTab: (idx: number) => void;
}

function SimTabs({ tabs, activeTab, setActiveTab }: SimTabsProps) {
  return (
    <div className={styles.simTabContainer}>
      {tabs.map((tab, idx) => (
        <button
          key={tab}
          className={`${styles.simTab} ${activeTab === idx ? styles.simTabActive : ""}`}
          onClick={() => setActiveTab(idx)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
 * 1. BALANCED & UNBALANCED FORCES  (5 simulations)
 * ═══════════════════════════════════════════════════════ */
export function BalancedForcesSimulation() {
  const [activeTab, setActiveTab] = useState(0);

  /* ── Simulation 1: Tug of War ── */
  const [forceA, setForceA] = useState(100);
  const [forceB, setForceB] = useState(100);
  const netForceTug = forceA - forceB;
  const ropeOffset = Math.max(-80, Math.min(80, netForceTug * 0.5));
  const isBalancedTug = Math.abs(netForceTug) < 5;

  /* ── Simulation 2: Block on a Table ── */
  const [pushLeft, setPushLeft] = useState(50);
  const [pushRight, setPushRight] = useState(50);
  const [frictionCoefficient, setFrictionCoefficient] = useState(30);
  const [blockX, setBlockX] = useState(150);
  const [isAnimatingBlock, setIsAnimatingBlock] = useState(false);

  const rawNet = pushLeft - pushRight;
  const maxFriction = frictionCoefficient;
  const frictionForce =
    Math.abs(rawNet) <= maxFriction ? rawNet : Math.sign(rawNet) * maxFriction;
  const netForceBlock = rawNet - frictionForce;

  useEffect(() => {
    if (!isAnimatingBlock) return;
    let timer: number;
    const step = () => {
      setBlockX((prev) => {
        const next = prev + netForceBlock * 0.1;
        if (next < 20 || next > 280) {
          setIsAnimatingBlock(false);
          return Math.max(20, Math.min(280, next));
        }
        return next;
      });
      timer = requestAnimationFrame(step);
    };
    timer = requestAnimationFrame(step);
    return () => cancelAnimationFrame(timer);
  }, [isAnimatingBlock, netForceBlock]);

  /* ── Simulation 3: Vector Sandbox ── */
  const [v1, setV1] = useState(60);
  const [v1Dir, setV1Dir] = useState(1);
  const [v2, setV2] = useState(40);
  const [v2Dir, setV2Dir] = useState(1);
  const resultant = v1 * v1Dir + v2 * v2Dir;

  /* ── Simulation 4: Balance Scale ── */
  const [leftWeight, setLeftWeight] = useState(50);
  const [rightWeight, setRightWeight] = useState(50);
  const scaleDiff = leftWeight - rightWeight;
  const beamAngle = Math.max(-28, Math.min(28, scaleDiff * 0.4));
  const isScaleBalanced = Math.abs(scaleDiff) < 3;

  /* ── Simulation 5: Force Components (2D decomposition) ── */
  const [forceMag, setForceMag] = useState(80);
  const [forceAngleDeg, setForceAngleDeg] = useState(40);
  const forceAngleRad = (forceAngleDeg * Math.PI) / 180;
  const Fx = (forceMag * Math.cos(forceAngleRad)).toFixed(1);
  const Fy = (forceMag * Math.sin(forceAngleRad)).toFixed(1);

  return (
    <div className={styles.simCard}>
      <div className={styles.simTitle}>
        <span className={styles.simIcon}>⚡</span>
        Topic 1: Balanced &amp; Unbalanced Forces Sandbox
      </div>
      <p className={styles.simDesc}>
        Explore how forces cancel out or combine to produce motion. Choose a simulation:
      </p>

      <SimTabs
        tabs={["Tug of War", "Block on Table", "Vector Sandbox", "Balance Scale", "Force Components"]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* ── TAB 0: Tug of War ── */}
      {activeTab === 0 && (
        <div>
          <div className={styles.tugWarArena}>
            <div className={styles.team} style={{ color: "#6366f1" }}>
              <div className={styles.teamLabel}>Team A</div>
              <div className={styles.teamForce}>{forceA} N →</div>
              <div className={styles.figures}>🏋️🏋️</div>
            </div>

            <div className={styles.ropeContainer}>
              <div className={styles.rope}>
                <div
                  className={styles.ropeFlag}
                  style={{
                    left: `calc(50% + ${ropeOffset}px)`,
                    background: isBalancedTug
                      ? "#10b981"
                      : netForceTug > 0
                      ? "#6366f1"
                      : "#ef4444",
                  }}
                />
              </div>
              <div
                className={styles.netForceLabel}
                style={{ color: isBalancedTug ? "#10b981" : "#f59e0b" }}
              >
                Net Force: {Math.abs(netForceTug).toFixed(0)} N{" "}
                {isBalancedTug
                  ? "✓ Balanced"
                  : netForceTug > 0
                  ? "→ A wins"
                  : "← B wins"}
              </div>
            </div>

            <div className={styles.team} style={{ color: "#ef4444" }}>
              <div className={styles.teamLabel}>Team B</div>
              <div className={styles.teamForce}>← {forceB} N</div>
              <div className={styles.figures}>🏋️🏋️</div>
            </div>
          </div>

          <div className={styles.sliderGroup}>
            <label className={styles.sliderLabel}>
              Team A Pull:{" "}
              <strong style={{ color: "#6366f1" }}>{forceA} N</strong>
              <input
                type="range"
                min={0}
                max={200}
                value={forceA}
                onChange={(e) => setForceA(Number(e.target.value))}
                className={styles.slider}
                style={{ accentColor: "#6366f1" }}
              />
            </label>
            <label className={styles.sliderLabel}>
              Team B Pull:{" "}
              <strong style={{ color: "#ef4444" }}>{forceB} N</strong>
              <input
                type="range"
                min={0}
                max={200}
                value={forceB}
                onChange={(e) => setForceB(Number(e.target.value))}
                className={styles.slider}
                style={{ accentColor: "#ef4444" }}
              />
            </label>
          </div>
        </div>
      )}

      {/* ── TAB 1: Block on Table ── */}
      {activeTab === 1 && (
        <div>
          <div className={styles.blockArena}>
            <div className={styles.blockTable} />
            <div
              className={styles.vectorArrow}
              style={{ left: "10px", width: `${pushLeft}px`, bottom: "60px" }}
            >
              <div
                className={styles.arrowShaftLine}
                style={{ background: "#6366f1", height: "4px", width: "100%" }}
              />
              <div
                className={styles.arrowHeadSymbol}
                style={{ color: "#6366f1" }}
              >
                ▶
              </div>
              <span
                style={{
                  fontSize: "0.65rem",
                  color: "#6366f1",
                  marginLeft: "4px",
                }}
              >
                Push A: {pushLeft}N
              </span>
            </div>
            <div
              className={styles.vectorArrow}
              style={{
                right: "10px",
                width: `${pushRight}px`,
                bottom: "60px",
                flexDirection: "row-reverse",
              }}
            >
              <div
                className={styles.arrowShaftLine}
                style={{ background: "#ef4444", height: "4px", width: "100%" }}
              />
              <div
                className={styles.arrowHeadSymbol}
                style={{ color: "#ef4444" }}
              >
                ◀
              </div>
              <span
                style={{
                  fontSize: "0.65rem",
                  color: "#ef4444",
                  marginRight: "4px",
                }}
              >
                Push B: {pushRight}N
              </span>
            </div>
            {frictionForce !== 0 && (
              <div
                className={styles.vectorArrow}
                style={{
                  left: `${blockX + 20}px`,
                  width: `${Math.abs(frictionForce)}px`,
                  bottom: "20px",
                  flexDirection: frictionForce > 0 ? "row-reverse" : "row",
                }}
              >
                <div
                  className={styles.arrowShaftLine}
                  style={{
                    background: "#94a3b8",
                    height: "2px",
                    width: "100%",
                  }}
                />
                <div
                  className={styles.arrowHeadSymbol}
                  style={{ color: "#94a3b8" }}
                >
                  {frictionForce > 0 ? "◀" : "▶"}
                </div>
                <span style={{ fontSize: "0.55rem", color: "#94a3b8" }}>
                  f: {Math.abs(frictionForce).toFixed(0)}N
                </span>
              </div>
            )}
            <div
              className={styles.slidingBlock}
              style={{ left: `${blockX}px`, width: "50px", height: "35px" }}
            >
              📦 Block
            </div>
          </div>

          <div
            style={{
              textAlign: "center",
              fontSize: "0.8rem",
              color: "#e2e8f0",
              margin: "8px 0",
            }}
          >
            Net Force:{" "}
            <strong
              style={{
                color: netForceBlock === 0 ? "#10b981" : "#f59e0b",
              }}
            >
              {netForceBlock.toFixed(1)} N
            </strong>
            {netForceBlock === 0
              ? " (Balanced)"
              : netForceBlock > 0
              ? " (Unbalanced → Right)"
              : " (Unbalanced → Left)"}
          </div>

          <div className={styles.sliderGroup}>
            <label className={styles.sliderLabel}>
              Push Left (→):{" "}
              <strong style={{ color: "#6366f1" }}>{pushLeft} N</strong>
              <input
                type="range"
                min={0}
                max={100}
                value={pushLeft}
                onChange={(e) => setPushLeft(Number(e.target.value))}
                className={styles.slider}
                style={{ accentColor: "#6366f1" }}
              />
            </label>
            <label className={styles.sliderLabel}>
              Push Right (←):{" "}
              <strong style={{ color: "#ef4444" }}>{pushRight} N</strong>
              <input
                type="range"
                min={0}
                max={100}
                value={pushRight}
                onChange={(e) => setPushRight(Number(e.target.value))}
                className={styles.slider}
                style={{ accentColor: "#ef4444" }}
              />
            </label>
            <label className={styles.sliderLabel}>
              Max Friction:{" "}
              <strong style={{ color: "#94a3b8" }}>
                {frictionCoefficient} N
              </strong>
              <input
                type="range"
                min={0}
                max={60}
                value={frictionCoefficient}
                onChange={(e) =>
                  setFrictionCoefficient(Number(e.target.value))
                }
                className={styles.slider}
                style={{ accentColor: "#94a3b8" }}
              />
            </label>
          </div>

          <div className={styles.simControls}>
            <button
              className={styles.simBtn}
              onClick={() => setIsAnimatingBlock(!isAnimatingBlock)}
              disabled={netForceBlock === 0 && !isAnimatingBlock}
            >
              {isAnimatingBlock ? "⏸ Pause" : "▶ Animate"}
            </button>
            <button
              className={`${styles.simBtn} ${styles.simBtnDanger}`}
              onClick={() => {
                setBlockX(150);
                setIsAnimatingBlock(false);
              }}
            >
              ↺ Reset
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 2: Vector Sandbox ── */}
      {activeTab === 2 && (
        <div>
          <div
            className={styles.tugWarArena}
            style={{
              minHeight: "100px",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <span style={{ color: "#6366f1" }}>V1:</span>
                <strong>
                  {v1} N {v1Dir > 0 ? "→" : "←"}
                </strong>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <span style={{ color: "#ef4444" }}>V2:</span>
                <strong>
                  {v2} N {v2Dir > 0 ? "→" : "←"}
                </strong>
              </div>
            </div>

            <div
              style={{ marginTop: "16px", fontSize: "1rem", color: "#34d399" }}
            >
              Resultant:{" "}
              <strong>
                {Math.abs(resultant)} N{" "}
                {resultant === 0
                  ? "(Balanced — Zero Net Force)"
                  : resultant > 0
                  ? "→"
                  : "←"}
              </strong>
            </div>

            <div
              style={{
                width: "100%",
                height: "40px",
                position: "relative",
                marginTop: "12px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "6px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: "6px",
                  height: "6px",
                  background: "#ffffff",
                  borderRadius: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 10,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: v1Dir > 0 ? "50%" : `calc(50% - ${v1}px)`,
                  width: `${v1}px`,
                  height: "3px",
                  background: "#6366f1",
                  transform: "translateY(-50%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: v2Dir > 0 ? "50%" : `calc(50% - ${v2}px)`,
                  width: `${v2}px`,
                  height: "3px",
                  background: "#ef4444",
                  transform: "translateY(-50%)",
                }}
              />
              {resultant !== 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "20%",
                    left:
                      resultant > 0
                        ? "50%"
                        : `calc(50% - ${Math.abs(resultant)}px)`,
                    width: `${Math.abs(resultant)}px`,
                    height: "4px",
                    background: "#10b981",
                  }}
                />
              )}
            </div>
          </div>

          <div className={styles.sliderGroup}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <label className={styles.sliderLabel}>
                  V1 Magnitude:{" "}
                  <strong style={{ color: "#6366f1" }}>{v1} N</strong>
                  <input
                    type="range"
                    min={0}
                    max={120}
                    value={v1}
                    onChange={(e) => setV1(Number(e.target.value))}
                    className={styles.slider}
                    style={{ accentColor: "#6366f1" }}
                  />
                </label>
              </div>
              <button
                className={styles.simBtn}
                onClick={() => setV1Dir((p) => -p)}
              >
                Flip V1
              </button>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <label className={styles.sliderLabel}>
                  V2 Magnitude:{" "}
                  <strong style={{ color: "#ef4444" }}>{v2} N</strong>
                  <input
                    type="range"
                    min={0}
                    max={120}
                    value={v2}
                    onChange={(e) => setV2(Number(e.target.value))}
                    className={styles.slider}
                    style={{ accentColor: "#ef4444" }}
                  />
                </label>
              </div>
              <button
                className={styles.simBtn}
                onClick={() => setV2Dir((p) => -p)}
              >
                Flip V2
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: Balance Scale ── */}
      {activeTab === 3 && (
        <div>
          {/* Scale visual built with divs */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0",
              minHeight: "160px",
              marginBottom: "8px",
              position: "relative",
            }}
          >
            {/* Pivot/stand */}
            <div
              style={{
                width: "6px",
                height: "50px",
                background: "#64748b",
                borderRadius: "3px",
                marginBottom: "0",
              }}
            />
            {/* Beam */}
            <div
              style={{
                width: "240px",
                height: "6px",
                background: "#94a3b8",
                borderRadius: "3px",
                transform: `rotate(${beamAngle}deg)`,
                transition: "transform 0.4s ease",
                position: "relative",
                marginTop: "-3px",
              }}
            >
              {/* Left pan string */}
              <div
                style={{
                  position: "absolute",
                  left: "0",
                  top: "3px",
                  width: "1px",
                  height: "30px",
                  background: "#94a3b8",
                }}
              />
              {/* Right pan string */}
              <div
                style={{
                  position: "absolute",
                  right: "0",
                  top: "3px",
                  width: "1px",
                  height: "30px",
                  background: "#94a3b8",
                }}
              />
            </div>
            {/* Pans */}
            <div
              style={{
                width: "240px",
                display: "flex",
                justifyContent: "space-between",
                marginTop: "24px",
                transform: `rotate(${beamAngle}deg)`,
                transition: "transform 0.4s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <div
                  style={{
                    width: "70px",
                    height: "14px",
                    background: "#6366f1",
                    borderRadius: "0 0 20px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.65rem",
                    color: "#fff",
                  }}
                >
                  {leftWeight} N
                </div>
                <span style={{ fontSize: "0.7rem", color: "#a5b4fc" }}>
                  Left Pan
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <div
                  style={{
                    width: "70px",
                    height: "14px",
                    background: "#ef4444",
                    borderRadius: "0 0 20px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.65rem",
                    color: "#fff",
                  }}
                >
                  {rightWeight} N
                </div>
                <span style={{ fontSize: "0.7rem", color: "#fca5a5" }}>
                  Right Pan
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              textAlign: "center",
              fontSize: "0.85rem",
              margin: "8px 0",
              fontWeight: "bold",
              color: isScaleBalanced ? "#10b981" : "#f59e0b",
            }}
          >
            {isScaleBalanced
              ? "✓ Scale is BALANCED — Net Force = 0 N"
              : `✗ UNBALANCED — Net Force = ${Math.abs(scaleDiff)} N ${scaleDiff > 0 ? "(Left heavier)" : "(Right heavier)"}`}
          </div>

          <div className={styles.sliderGroup}>
            <label className={styles.sliderLabel}>
              Left Pan Weight:{" "}
              <strong style={{ color: "#6366f1" }}>{leftWeight} N</strong>
              <input
                type="range"
                min={10}
                max={150}
                value={leftWeight}
                onChange={(e) => setLeftWeight(Number(e.target.value))}
                className={styles.slider}
                style={{ accentColor: "#6366f1" }}
              />
            </label>
            <label className={styles.sliderLabel}>
              Right Pan Weight:{" "}
              <strong style={{ color: "#ef4444" }}>{rightWeight} N</strong>
              <input
                type="range"
                min={10}
                max={150}
                value={rightWeight}
                onChange={(e) => setRightWeight(Number(e.target.value))}
                className={styles.slider}
                style={{ accentColor: "#ef4444" }}
              />
            </label>
          </div>

          <div
            style={{
              fontSize: "0.75rem",
              color: "#94a3b8",
              textAlign: "center",
              marginTop: "4px",
            }}
          >
            Key insight: Balanced forces (net = 0) keep the scale horizontal. Unbalanced forces
            tilt it — just like gravity acts differently on objects of different weights.
          </div>
        </div>
      )}

      {/* ── TAB 4: Force Components (2D Decomposition) ── */}
      {activeTab === 4 && (
        <div>
          {/* SVG vector diagram */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "12px",
            }}
          >
            <svg width="280" height="180" style={{ overflow: "visible" }}>
              {/* Origin */}
              <circle cx="40" cy="140" r="4" fill="#ffffff" />

              {/* Fx (horizontal component) */}
              <line
                x1="40"
                y1="140"
                x2={40 + Number(Fx) * 1.8}
                y2="140"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeDasharray="5,3"
              />
              <text
                x={40 + Number(Fx) * 0.9}
                y={155}
                fill="#6366f1"
                fontSize="11"
                textAnchor="middle"
              >
                Fx = {Fx} N
              </text>

              {/* Fy (vertical component) */}
              <line
                x1={40 + Number(Fx) * 1.8}
                y1="140"
                x2={40 + Number(Fx) * 1.8}
                y2={140 - Number(Fy) * 1.8}
                stroke="#ef4444"
                strokeWidth="2.5"
                strokeDasharray="5,3"
              />
              <text
                x={40 + Number(Fx) * 1.8 + 28}
                y={140 - Number(Fy) * 0.9}
                fill="#ef4444"
                fontSize="11"
                textAnchor="middle"
              >
                Fy = {Fy} N
              </text>

              {/* Resultant force vector */}
              <line
                x1="40"
                y1="140"
                x2={40 + Number(Fx) * 1.8}
                y2={140 - Number(Fy) * 1.8}
                stroke="#10b981"
                strokeWidth="3"
              />
              <polygon
                points={`${40 + Number(Fx) * 1.8},${140 - Number(Fy) * 1.8} ${
                  40 + Number(Fx) * 1.8 - 6
                },${140 - Number(Fy) * 1.8 + 10} ${
                  40 + Number(Fx) * 1.8 + 6
                },${140 - Number(Fy) * 1.8 + 10}`}
                fill="#10b981"
              />
              <text
                x={40 + Number(Fx) * 0.9 - 10}
                y={140 - Number(Fy) * 0.9 - 8}
                fill="#10b981"
                fontSize="11"
              >
                F = {forceMag} N
              </text>

              {/* Angle arc */}
              <path
                d={`M 60,140 A 20,20 0 0,0 ${
                  60 + 20 * Math.cos(-forceAngleRad)
                },${140 + 20 * Math.sin(-forceAngleRad)}`}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.5"
              />
              <text x="70" y="133" fill="#f59e0b" fontSize="11">
                {forceAngleDeg}°
              </text>
            </svg>
          </div>

          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              fontSize: "0.8rem",
              marginBottom: "8px",
            }}
          >
            <span style={{ color: "#6366f1" }}>
              Fx = F·cos(θ) = {Fx} N (horizontal)
            </span>
            <span style={{ color: "#ef4444" }}>
              Fy = F·sin(θ) = {Fy} N (vertical)
            </span>
          </div>

          <div className={styles.sliderGroup}>
            <label className={styles.sliderLabel}>
              Force Magnitude (F):{" "}
              <strong style={{ color: "#10b981" }}>{forceMag} N</strong>
              <input
                type="range"
                min={20}
                max={120}
                value={forceMag}
                onChange={(e) => setForceMag(Number(e.target.value))}
                className={styles.slider}
                style={{ accentColor: "#10b981" }}
              />
            </label>
            <label className={styles.sliderLabel}>
              Angle (θ):{" "}
              <strong style={{ color: "#f59e0b" }}>{forceAngleDeg}°</strong>
              <input
                type="range"
                min={5}
                max={85}
                value={forceAngleDeg}
                onChange={(e) => setForceAngleDeg(Number(e.target.value))}
                className={styles.slider}
                style={{ accentColor: "#f59e0b" }}
              />
            </label>
          </div>

          <div
            style={{
              fontSize: "0.75rem",
              color: "#94a3b8",
              textAlign: "center",
            }}
          >
            Every force on an inclined surface can be split into horizontal and vertical
            components using trigonometry. This is fundamental to solving real-world force problems.
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
 * 2. NEWTON'S FIRST LAW — INERTIA  (5 simulations)
 * ═══════════════════════════════════════════════════════ */
export function InertiaSimulation() {
  const [activeTab, setActiveTab] = useState(0);

  /* ── Simulation 1: Frictionless Ice Arena ── */
  const [hasFriction, setHasFriction] = useState(true);
  const [ballPos, setBallPos] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [speed, setSpeed] = useState(3);
  const animRef = useRef<number | null>(null);
  const posRef = useRef(0);

  const launch = () => {
    posRef.current = 0;
    setBallPos(0);
    setIsMoving(true);
    setSpeed(3);
  };

  const stop = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setIsMoving(false);
  }, []);

  useEffect(() => {
    if (!isMoving) return;
    let currentSpeed = 3;
    let pos = posRef.current;

    const animate = () => {
      if (hasFriction) currentSpeed = Math.max(0, currentSpeed - 0.04);
      pos += currentSpeed;
      posRef.current = pos;
      setBallPos(pos);
      setSpeed(currentSpeed);
      if (pos > 320 || currentSpeed <= 0) { stop(); return; }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isMoving, hasFriction, stop]);

  /* ── Simulation 2: Coin & Card ── */
  const [flickForce, setFlickForce] = useState(70);
  const [flicked, setFlicked] = useState(false);
  const [cardTranslateX, setCardTranslateX] = useState(0);
  const [coinOffsetY, setCoinOffsetY] = useState(0);
  const [coinOffsetX, setCoinOffsetX] = useState(0);
  const [coinMessage, setCoinMessage] = useState("Place the coin on the card.");

  const flickCard = () => {
    setFlicked(true);
    if (flickForce >= 50) {
      setCardTranslateX(200);
      setCoinMessage("Fast flick! Card flies out — coin drops due to Inertia of Rest.");
      setTimeout(() => setCoinOffsetY(60), 300);
    } else {
      setCardTranslateX(100);
      setCoinOffsetX(100);
      setCoinMessage("Slow flick — friction pulls coin with card. Inertia overcome.");
      setTimeout(() => { setCoinOffsetY(60); setCoinOffsetX(120); }, 400);
    }
  };

  const resetCoin = () => {
    setFlicked(false);
    setCardTranslateX(0);
    setCoinOffsetY(0);
    setCoinOffsetX(0);
    setCoinMessage("Placed coin on card. Ready to flick!");
  };

  /* ── Simulation 3: Sudden Braking Bus ── */
  const [busState, setBusState] = useState<"idle" | "accelerating" | "braking">("idle");
  const [passengerTilt, setPassengerTilt] = useState(0);
  const [busX, setBusX] = useState(30);

  const startBus = () => {
    setBusState("accelerating");
    setPassengerTilt(-20);
    let currentX = busX;
    const drive = setInterval(() => {
      currentX += 4;
      setBusX(currentX);
      if (currentX >= 180) clearInterval(drive);
    }, 30);
  };

  const brakeBus = () => {
    setBusState("braking");
    setPassengerTilt(35);
    setTimeout(() => { setPassengerTilt(0); setBusState("idle"); }, 1500);
  };

  const resetBus = () => { setBusX(30); setPassengerTilt(0); setBusState("idle"); };

  /* ── Simulation 4: Mass & Inertia Comparison ── */
  const [appliedForce, setAppliedForce] = useState(60); // N
  const [lightMass, setLightMass] = useState(2);  // kg
  const [heavyMass, setHeavyMass] = useState(8);  // kg
  const [massCompRunning, setMassCompRunning] = useState(false);
  const [lightPos, setLightPos] = useState(10);
  const [heavyPos, setHeavyPos] = useState(10);

  const lightAcc = (appliedForce / lightMass).toFixed(2);
  const heavyAcc = (appliedForce / heavyMass).toFixed(2);

  const runMassComp = () => {
    setMassCompRunning(true);
    setLightPos(10);
    setHeavyPos(10);
    let t = 0;
    const interval = setInterval(() => {
      t += 0.1;
      const aLight = appliedForce / lightMass;
      const aHeavy = appliedForce / heavyMass;
      setLightPos(Math.min(270, 10 + 0.5 * aLight * t * t * 30));
      setHeavyPos(Math.min(270, 10 + 0.5 * aHeavy * t * t * 30));
      if (t >= 2.5) { clearInterval(interval); setMassCompRunning(false); }
    }, 60);
  };

  /* ── Simulation 5: Circular Inertia (Ball on String) ── */
  const [stringCut, setStringCut] = useState(false);
  const [ballAngle, setBallAngle] = useState(0);
  const [flyX, setFlyX] = useState(0);
  const [flyY, setFlyY] = useState(0);
  const circleRadius = 70;

  // Animate circular motion or fly-off
  useEffect(() => {
    if (stringCut) return;
    const timer = setInterval(() => {
      setBallAngle((prev) => (prev + 3) % 360);
    }, 30);
    return () => clearInterval(timer);
  }, [stringCut]);

  const cutString = () => {
    setStringCut(true);
    // Ball flies off tangentially from current angle
    const rad = (ballAngle * Math.PI) / 180;
    const tangentVx = -Math.sin(rad); // tangential direction
    const tangentVy = Math.cos(rad);
    let t = 0;
    const fly = setInterval(() => {
      t += 1;
      setFlyX((prev) => prev + tangentVx * 4);
      setFlyY((prev) => prev + tangentVy * 4 + 0.08 * t); // slight gravity
      if (t > 50) clearInterval(fly);
    }, 40);
  };

  const ballRad = (ballAngle * Math.PI) / 180;
  const ballSvgX = 140 + (stringCut ? flyX : circleRadius * Math.cos(ballRad));
  const ballSvgY = 90 + (stringCut ? flyY : circleRadius * Math.sin(ballRad));

  return (
    <div className={styles.simCard}>
      <div className={styles.simTitle}>
        <span className={styles.simIcon}>🔬</span>
        Topic 2: Newton&apos;s 1st Law (Inertia) Sandbox
      </div>
      <p className={styles.simDesc}>
        Experiment with Inertia of Rest, Motion, and Direction. Choose a simulation:
      </p>

      <SimTabs
        tabs={["Frictionless Ice", "Coin & Card", "Braking Bus", "Mass & Inertia", "Circular Inertia"]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* ── TAB 0: Frictionless Ice ── */}
      {activeTab === 0 && (
        <div>
          <div className={styles.inertiaTrack}>
            <div
              className={styles.trackSurface}
              style={{
                background: hasFriction
                  ? "rgba(239,68,68,0.15)"
                  : "rgba(99,102,241,0.1)",
              }}
            >
              <div
                className={styles.ball}
                style={{ left: `${Math.min(ballPos, 300)}px` }}
              >
                ⚽
              </div>
              <div className={styles.trackLabel}>
                {hasFriction
                  ? "🔴 Friction Surface"
                  : "🔵 Frictionless Ice"}
              </div>
            </div>
            <div className={styles.speedometer}>
              Speed:{" "}
              <strong style={{ color: speed > 1 ? "#10b981" : "#ef4444" }}>
                {speed.toFixed(1)} m/s
              </strong>
            </div>
          </div>
          <div className={styles.simControls}>
            <button
              className={styles.simBtn}
              onClick={launch}
              disabled={isMoving}
            >
              🚀 Launch Ball
            </button>
            <button
              className={`${styles.simBtn} ${hasFriction ? styles.simBtnDanger : styles.simBtnSuccess}`}
              onClick={() => setHasFriction(!hasFriction)}
              disabled={isMoving}
            >
              {hasFriction ? "Remove Friction (Ice)" : "Add Friction"}
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 1: Coin & Card ── */}
      {activeTab === 1 && (
        <div>
          <div className={styles.coinCupArena}>
            <div
              className={styles.card}
              style={{ transform: `translateX(${cardTranslateX}px)` }}
            />
            <div
              className={styles.coin}
              style={{
                transform: `translateX(${coinOffsetX}px) translateY(${coinOffsetY}px)`,
              }}
            >
              🪙
            </div>
            <div className={styles.cup} />
          </div>
          <div
            style={{
              textAlign: "center",
              fontSize: "0.8rem",
              color: "#e2e8f0",
              margin: "8px 0",
            }}
          >
            {coinMessage}
          </div>
          <div className={styles.sliderGroup}>
            <label className={styles.sliderLabel}>
              Flicking Force:{" "}
              <strong
                style={{ color: flickForce >= 50 ? "#10b981" : "#ef4444" }}
              >
                {flickForce}% ({flickForce >= 50 ? "FAST" : "SLOW"})
              </strong>
              <input
                type="range"
                min={10}
                max={100}
                value={flickForce}
                onChange={(e) => setFlickForce(Number(e.target.value))}
                className={styles.slider}
                style={{ accentColor: "#f59e0b" }}
                disabled={flicked}
              />
            </label>
          </div>
          <div className={styles.simControls}>
            <button
              className={styles.simBtn}
              onClick={flickCard}
              disabled={flicked}
            >
              💥 Flick Card
            </button>
            <button
              className={`${styles.simBtn} ${styles.simBtnDanger}`}
              onClick={resetCoin}
            >
              ↺ Reset
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 2: Braking Bus ── */}
      {activeTab === 2 && (
        <div>
          <div className={styles.busArena}>
            <div className={styles.busTable} />
            <div
              className={styles.busBody}
              style={{ left: `${busX}px` }}
            >
              🚌
              <div
                className={styles.passenger}
                style={{ transform: `rotate(${passengerTilt}deg)` }}
              >
                🧍
              </div>
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
              fontSize: "0.8rem",
              color: "#e2e8f0",
              margin: "8px 0",
            }}
          >
            {busState === "accelerating"
              ? "Bus accelerates — passenger tilts BACK (Inertia of Rest trying to stay behind)"
              : busState === "braking"
              ? "Bus brakes suddenly — passenger tilts FORWARD (Inertia of Motion — body continues moving)"
              : "Bus is idle. Press Start to drive."}
          </div>
          <div className={styles.simControls}>
            <button
              className={styles.simBtn}
              onClick={startBus}
              disabled={busState !== "idle"}
            >
              🚌 Drive Bus
            </button>
            <button
              className={`${styles.simBtn} ${styles.simBtnDanger}`}
              onClick={brakeBus}
              disabled={busState !== "accelerating"}
            >
              🛑 Brake!
            </button>
            <button
              className={`${styles.simBtn}`}
              onClick={resetBus}
            >
              ↺ Reset
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 3: Mass & Inertia Comparison ── */}
      {activeTab === 3 && (
        <div>
          {/* Two lanes showing different blocks with same force */}
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "10px",
            }}
          >
            {/* Light mass lane */}
            <div style={{ marginBottom: "14px" }}>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#6366f1",
                  marginBottom: "4px",
                }}
              >
                🔵 Light Object — Mass: {lightMass} kg | Acceleration: {lightAcc} m/s²
              </div>
              <div
                style={{
                  position: "relative",
                  height: "32px",
                  background: "rgba(99,102,241,0.1)",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: `${lightPos}px`,
                    top: "4px",
                    width: "30px",
                    height: "24px",
                    background: "#6366f1",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    color: "#fff",
                    transition: "none",
                  }}
                >
                  {lightMass}kg
                </div>
              </div>
            </div>
            {/* Heavy mass lane */}
            <div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#ef4444",
                  marginBottom: "4px",
                }}
              >
                🔴 Heavy Object — Mass: {heavyMass} kg | Acceleration: {heavyAcc} m/s²
              </div>
              <div
                style={{
                  position: "relative",
                  height: "32px",
                  background: "rgba(239,68,68,0.1)",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: `${heavyPos}px`,
                    top: "4px",
                    width: "30px",
                    height: "24px",
                    background: "#ef4444",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    color: "#fff",
                    transition: "none",
                  }}
                >
                  {heavyMass}kg
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: "0.75rem",
              color: "#94a3b8",
              textAlign: "center",
              marginBottom: "8px",
            }}
          >
            Same force {appliedForce} N applied to both. Heavier object has more inertia — resists acceleration more.
          </div>

          <div className={styles.sliderGroup}>
            <label className={styles.sliderLabel}>
              Applied Force:{" "}
              <strong style={{ color: "#f59e0b" }}>{appliedForce} N</strong>
              <input
                type="range"
                min={20}
                max={120}
                value={appliedForce}
                onChange={(e) => {
                  setAppliedForce(Number(e.target.value));
                  setLightPos(10);
                  setHeavyPos(10);
                  setMassCompRunning(false);
                }}
                className={styles.slider}
                style={{ accentColor: "#f59e0b" }}
                disabled={massCompRunning}
              />
            </label>
            <div style={{ display: "flex", gap: "12px" }}>
              <label className={styles.sliderLabel} style={{ flex: 1 }}>
                Light Mass:{" "}
                <strong style={{ color: "#6366f1" }}>{lightMass} kg</strong>
                <input
                  type="range"
                  min={1}
                  max={6}
                  value={lightMass}
                  onChange={(e) => {
                    setLightMass(Number(e.target.value));
                    setLightPos(10);
                    setMassCompRunning(false);
                  }}
                  className={styles.slider}
                  style={{ accentColor: "#6366f1" }}
                  disabled={massCompRunning}
                />
              </label>
              <label className={styles.sliderLabel} style={{ flex: 1 }}>
                Heavy Mass:{" "}
                <strong style={{ color: "#ef4444" }}>{heavyMass} kg</strong>
                <input
                  type="range"
                  min={4}
                  max={15}
                  value={heavyMass}
                  onChange={(e) => {
                    setHeavyMass(Number(e.target.value));
                    setHeavyPos(10);
                    setMassCompRunning(false);
                  }}
                  className={styles.slider}
                  style={{ accentColor: "#ef4444" }}
                  disabled={massCompRunning}
                />
              </label>
            </div>
          </div>

          <div className={styles.simControls}>
            <button
              className={styles.simBtn}
              onClick={runMassComp}
              disabled={massCompRunning}
            >
              ▶ Apply Force
            </button>
            <button
              className={`${styles.simBtn} ${styles.simBtnDanger}`}
              onClick={() => {
                setLightPos(10);
                setHeavyPos(10);
                setMassCompRunning(false);
              }}
            >
              ↺ Reset
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 4: Circular Inertia ── */}
      {activeTab === 4 && (
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <svg width="280" height="180" style={{ overflow: "visible" }}>
              {/* Centre pivot */}
              <circle cx="140" cy="90" r="5" fill="#64748b" />
              {/* String (only when not cut) */}
              {!stringCut && (
                <line
                  x1="140"
                  y1="90"
                  x2={140 + circleRadius * Math.cos(ballRad)}
                  y2={90 + circleRadius * Math.sin(ballRad)}
                  stroke="#94a3b8"
                  strokeWidth="2"
                />
              )}
              {/* Circular path (dotted) */}
              {!stringCut && (
                <circle
                  cx="140"
                  cy="90"
                  r={circleRadius}
                  fill="none"
                  stroke="rgba(148,163,184,0.25)"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
              )}
              {/* Ball */}
              <circle cx={ballSvgX} cy={ballSvgY} r="10" fill="#6366f1" />
              <text
                x={ballSvgX}
                y={ballSvgY + 4}
                textAnchor="middle"
                fill="#fff"
                fontSize="10"
              >
                ⚽
              </text>
              {/* Velocity arrow when spinning */}
              {!stringCut && (
                <line
                  x1={140 + circleRadius * Math.cos(ballRad)}
                  y1={90 + circleRadius * Math.sin(ballRad)}
                  x2={
                    140 +
                    circleRadius * Math.cos(ballRad) -
                    Math.sin(ballRad) * 25
                  }
                  y2={
                    90 +
                    circleRadius * Math.sin(ballRad) +
                    Math.cos(ballRad) * 25
                  }
                  stroke="#10b981"
                  strokeWidth="2"
                />
              )}
              {stringCut && (
                <text x="60" y="170" fill="#ef4444" fontSize="11">
                  ✂ String cut — ball flies in straight line (inertia!)
                </text>
              )}
            </svg>

            <div
              style={{
                fontSize: "0.8rem",
                color: "#94a3b8",
                textAlign: "center",
                marginTop: "4px",
              }}
            >
              {stringCut
                ? "The ball continues in a straight line tangent to the circle — Newton's 1st Law!"
                : "Ball spins in a circle due to tension in string. Green arrow = velocity direction."}
            </div>
          </div>

          <div className={styles.simControls}>
            <button
              className={`${styles.simBtn} ${styles.simBtnDanger}`}
              onClick={cutString}
              disabled={stringCut}
            >
              ✂ Cut String
            </button>
            <button
              className={styles.simBtn}
              onClick={() => {
                setStringCut(false);
                setFlyX(0);
                setFlyY(0);
                setBallAngle(0);
              }}
            >
              ↺ Reconnect String
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
 * 3. NEWTON'S SECOND LAW — F = ma  (5 simulations)
 * ═══════════════════════════════════════════════════════ */
export function FmaSimulation() {
  const [activeTab, setActiveTab] = useState(0);

  /* ── Simulation 1: F=ma Calculator ── */
  const [force, setForce] = useState(10);
  const [mass, setMass] = useState(2);
  const acceleration = (force / mass).toFixed(2);
  const boxSize = Math.max(30, Math.min(80, mass * 8 + 20));
  const arrowWidth = Math.min(200, force * 4 + 20);

  /* ── Simulation 2: Racetrack ── */
  const [force1, setForce1] = useState(30);
  const [mass1, setMass1] = useState(500);
  const [force2, setForce2] = useState(30);
  const [mass2, setMass2] = useState(1000);
  const [car1Pos, setCar1Pos] = useState(0);
  const [car2Pos, setCar2Pos] = useState(0);
  const [isRacing, setIsRacing] = useState(false);
  const [raceWinner, setRaceWinner] = useState("");

  const a1 = force1 / mass1;
  const a2 = force2 / mass2;

  const startRace = () => {
    setCar1Pos(0);
    setCar2Pos(0);
    setIsRacing(true);
    setRaceWinner("");
    let t = 0;
    const interval = setInterval(() => {
      t += 0.15;
      const x1 = 0.5 * a1 * 2000 * t * t;
      const x2 = 0.5 * a2 * 2000 * t * t;
      setCar1Pos(Math.min(280, x1));
      setCar2Pos(Math.min(280, x2));
      if (x1 >= 280 || x2 >= 280) {
        clearInterval(interval);
        setIsRacing(false);
        if (x1 > x2) setRaceWinner("Car A wins! Higher F/m ratio → greater acceleration.");
        else if (x2 > x1) setRaceWinner("Car B wins! Lower mass → less inertia, faster acceleration.");
        else setRaceWinner("Tie! Both have identical acceleration.");
      }
    }, 40);
  };

  /* ── Simulation 3: Atwood Machine ── */
  const [leftMass, setLeftMass] = useState(3);
  const [rightMass, setRightMass] = useState(5);
  const [leftY, setLeftY] = useState(70);
  const [rightY, setRightY] = useState(70);
  const [isReleased, setIsReleased] = useState(false);

  const g = 9.8;
  const netM = Math.abs(rightMass - leftMass);
  const totalM = leftMass + rightMass;
  const atwoodAcc = (g * netM) / totalM;

  const releasePulley = () => {
    setIsReleased(true);
    let lPos = 70, rPos = 70, speed = 0;
    const direction = rightMass > leftMass ? 1 : -1;
    const pulleyTimer = setInterval(() => {
      speed += atwoodAcc * 0.15;
      lPos -= speed * direction;
      rPos += speed * direction;
      if (lPos < 20 || lPos > 120) { clearInterval(pulleyTimer); setIsReleased(false); return; }
      setLeftY(lPos);
      setRightY(rPos);
    }, 50);
  };

  const resetPulley = () => { setLeftY(70); setRightY(70); setIsReleased(false); };

  /* ── Simulation 4: Free Fall Lab ── */
  const [dropHeight, setDropHeight] = useState(50); // metres
  const [isFalling, setIsFalling] = useState(false);
  const [fallenY, setFallenY] = useState(0); // visual px
  const [fallTime, setFallTime] = useState(0);
  const [finalVelocity, setFinalVelocity] = useState(0);
  const [ballDropped, setBallDropped] = useState(false);

  const timeToDrop = Math.sqrt((2 * dropHeight) / 9.8);
  const finalVel = 9.8 * timeToDrop;

  const startDrop = () => {
    setIsFalling(true);
    setBallDropped(true);
    setFallenY(0);
    setFallTime(0);
    setFinalVelocity(0);
    let elapsed = 0;
    const dropAnim = setInterval(() => {
      elapsed += 0.08;
      const h = 0.5 * 9.8 * elapsed * elapsed;
      const fraction = Math.min(1, h / dropHeight);
      setFallenY(fraction * 120);
      setFallTime(elapsed);
      setFinalVelocity(9.8 * elapsed);
      if (h >= dropHeight) {
        clearInterval(dropAnim);
        setIsFalling(false);
        setFallTime(timeToDrop);
        setFinalVelocity(finalVel);
      }
    }, 80);
  };

  /* ── Simulation 5: Inclined Plane ── */
  const [rampAngle, setRampAngle] = useState(30); // degrees
  const [rampMass, setRampMass] = useState(3);    // kg
  const [rampFriction, setRampFriction] = useState(0.2); // μ (coefficient)
  const [rampBlockPos, setRampBlockPos] = useState(0);
  const [rampRunning, setRampRunning] = useState(false);

  const sinA = Math.sin((rampAngle * Math.PI) / 180);
  const cosA = Math.cos((rampAngle * Math.PI) / 180);
  const gravComp = rampMass * 9.8 * sinA;  // N component along ramp
  const normalForce = rampMass * 9.8 * cosA;
  const frictionRamp = rampFriction * normalForce;
  const netForceRamp = gravComp - frictionRamp;
  const rampAcc = netForceRamp > 0 ? (netForceRamp / rampMass).toFixed(2) : "0";

  const runRamp = () => {
    if (Number(netForceRamp) <= 0) return;
    setRampRunning(true);
    setRampBlockPos(0);
    let t = 0;
    const rampAnim = setInterval(() => {
      t += 0.1;
      setRampBlockPos(Math.min(100, 0.5 * Number(rampAcc) * t * t * 15));
      if (t >= 3 || rampBlockPos >= 100) { clearInterval(rampAnim); setRampRunning(false); }
    }, 60);
  };

  return (
    <div className={styles.simCard}>
      <div className={styles.simTitle}>
        <span className={styles.simIcon}>📐</span>
        Topic 3: Newton&apos;s 2nd Law (F = ma) Sandbox
      </div>
      <p className={styles.simDesc}>
        Discover the relationship between force, mass, and acceleration. Choose a simulation:
      </p>

      <SimTabs
        tabs={["F=ma Calculator", "Racetrack", "Atwood Pulley", "Free Fall Lab", "Inclined Plane"]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* ── TAB 0: F=ma Calculator ── */}
      {activeTab === 0 && (
        <div>
          <div className={styles.fmaArena}>
            <div className={styles.forceArrow} style={{ width: `${arrowWidth}px` }}>
              <div className={styles.arrowShaft} />
              <div className={styles.arrowHead}>▶</div>
              <span className={styles.arrowLabel}>{force} N</span>
            </div>
            <div
              className={styles.massBox}
              style={{ width: `${boxSize}px`, height: `${boxSize}px` }}
            >
              <span className={styles.massLabel}>{mass} kg</span>
            </div>
            <div className={styles.resultPanel}>
              <div className={styles.resultFormula}>
                a = F ÷ m = {force} ÷ {mass} ={" "}
                <strong style={{ color: "#10b981", fontSize: "1.2em" }}>
                  {acceleration} m/s²
                </strong>
              </div>
            </div>
          </div>
          <div className={styles.sliderGroup}>
            <label className={styles.sliderLabel}>
              Force (F):{" "}
              <strong style={{ color: "#6366f1" }}>{force} N</strong>
              <input
                type="range"
                min={1}
                max={50}
                value={force}
                onChange={(e) => setForce(Number(e.target.value))}
                className={styles.slider}
                style={{ accentColor: "#6366f1" }}
              />
            </label>
            <label className={styles.sliderLabel}>
              Mass (m):{" "}
              <strong style={{ color: "#f59e0b" }}>{mass} kg</strong>
              <input
                type="range"
                min={1}
                max={20}
                value={mass}
                onChange={(e) => setMass(Number(e.target.value))}
                className={styles.slider}
                style={{ accentColor: "#f59e0b" }}
              />
            </label>
          </div>
        </div>
      )}

      {/* ── TAB 1: Racetrack ── */}
      {activeTab === 1 && (
        <div>
          <div className={styles.racetrackArena}>
            <div className={styles.raceLane}>
              <div className={styles.laneIndicator}>
                Car A (F={force1}N, m={mass1}kg)
              </div>
              <div className={styles.raceCar} style={{ left: `${car1Pos}px` }}>
                🟢🏎️
              </div>
            </div>
            <div className={styles.raceLane}>
              <div className={styles.laneIndicator}>
                Car B (F={force2}N, m={mass2}kg)
              </div>
              <div className={styles.raceCar} style={{ left: `${car2Pos}px` }}>
                🟡🏎️
              </div>
            </div>
          </div>
          {raceWinner && (
            <div
              style={{
                textAlign: "center",
                fontSize: "0.8rem",
                color: "#10b981",
                margin: "12px 0",
                fontWeight: "bold",
              }}
            >
              🏁 {raceWinner}
            </div>
          )}
          <div className={styles.sliderGroup}>
            <div style={{ display: "flex", gap: "20px" }}>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#6366f1",
                    fontWeight: "bold",
                    marginBottom: "4px",
                  }}
                >
                  Car A:
                </div>
                <label className={styles.sliderLabel}>
                  Force: <strong>{force1} N</strong>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={force1}
                    onChange={(e) => setForce1(Number(e.target.value))}
                    className={styles.slider}
                    style={{ accentColor: "#6366f1" }}
                    disabled={isRacing}
                  />
                </label>
                <label className={styles.sliderLabel}>
                  Mass: <strong>{mass1} kg</strong>
                  <input
                    type="range"
                    min={200}
                    max={1500}
                    value={mass1}
                    onChange={(e) => setMass1(Number(e.target.value))}
                    className={styles.slider}
                    style={{ accentColor: "#6366f1" }}
                    disabled={isRacing}
                  />
                </label>
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#ef4444",
                    fontWeight: "bold",
                    marginBottom: "4px",
                  }}
                >
                  Car B:
                </div>
                <label className={styles.sliderLabel}>
                  Force: <strong>{force2} N</strong>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={force2}
                    onChange={(e) => setForce2(Number(e.target.value))}
                    className={styles.slider}
                    style={{ accentColor: "#ef4444" }}
                    disabled={isRacing}
                  />
                </label>
                <label className={styles.sliderLabel}>
                  Mass: <strong>{mass2} kg</strong>
                  <input
                    type="range"
                    min={200}
                    max={1500}
                    value={mass2}
                    onChange={(e) => setMass2(Number(e.target.value))}
                    className={styles.slider}
                    style={{ accentColor: "#ef4444" }}
                    disabled={isRacing}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className={styles.simControls}>
            <button
              className={styles.simBtn}
              onClick={startRace}
              disabled={isRacing}
            >
              🏁 Start Race!
            </button>
            <button
              className={`${styles.simBtn} ${styles.simBtnDanger}`}
              onClick={() => {
                setCar1Pos(0);
                setCar2Pos(0);
                setRaceWinner("");
              }}
              disabled={isRacing}
            >
              ↺ Reset
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 2: Atwood Pulley ── */}
      {activeTab === 2 && (
        <div>
          <div className={styles.atwoodArena}>
            <div className={styles.pulleySupport} />
            <div className={styles.pulleyWheel}>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "8px",
                  height: "8px",
                  background: "#ffffff",
                  borderRadius: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>
            <div
              className={styles.atwoodString}
              style={{ left: "calc(50% - 20px)", height: `${leftY}px` }}
            />
            <div
              className={styles.atwoodString}
              style={{ left: "calc(50% + 18px)", height: `${rightY}px` }}
            />
            <div
              className={styles.atwoodMass}
              style={{ left: "calc(50% - 38px)", top: `${leftY + 34}px` }}
            >
              {leftMass} kg
            </div>
            <div
              className={styles.atwoodMass}
              style={{
                left: "calc(50% + 1px)",
                top: `${rightY + 34}px`,
                borderColor: "#ef4444",
                color: "#fca5a5",
              }}
            >
              {rightMass} kg
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
              fontSize: "0.8rem",
              color: "#e2e8f0",
              margin: "8px 0",
            }}
          >
            Acceleration:{" "}
            <strong style={{ color: "#34d399" }}>
              {atwoodAcc.toFixed(2)} m/s²
            </strong>
          </div>
          <div className={styles.sliderGroup}>
            <div style={{ display: "flex", gap: "20px" }}>
              <label className={styles.sliderLabel} style={{ flex: 1 }}>
                Left Mass:{" "}
                <strong style={{ color: "#f59e0b" }}>{leftMass} kg</strong>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={leftMass}
                  onChange={(e) => {
                    setLeftMass(Number(e.target.value));
                    resetPulley();
                  }}
                  className={styles.slider}
                  style={{ accentColor: "#f59e0b" }}
                  disabled={isReleased}
                />
              </label>
              <label className={styles.sliderLabel} style={{ flex: 1 }}>
                Right Mass:{" "}
                <strong style={{ color: "#ef4444" }}>{rightMass} kg</strong>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={rightMass}
                  onChange={(e) => {
                    setRightMass(Number(e.target.value));
                    resetPulley();
                  }}
                  className={styles.slider}
                  style={{ accentColor: "#ef4444" }}
                  disabled={isReleased}
                />
              </label>
            </div>
          </div>
          <div className={styles.simControls}>
            <button
              className={styles.simBtn}
              onClick={releasePulley}
              disabled={isReleased || leftMass === rightMass}
            >
              🔓 Release
            </button>
            <button
              className={`${styles.simBtn} ${styles.simBtnDanger}`}
              onClick={resetPulley}
            >
              ↺ Reset
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 3: Free Fall Lab ── */}
      {activeTab === 3 && (
        <div>
          <div
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "flex-start",
              marginBottom: "12px",
            }}
          >
            {/* Drop shaft */}
            <div
              style={{
                width: "60px",
                height: "140px",
                background: "rgba(255,255,255,0.04)",
                borderRadius: "8px",
                position: "relative",
                flexShrink: 0,
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: `${fallenY}px`,
                  transform: "translateX(-50%)",
                  fontSize: "1.4rem",
                  transition: "none",
                }}
              >
                🔴
              </div>
              {ballDropped && !isFalling && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "4px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "0.5rem",
                    color: "#10b981",
                  }}
                >
                  LAND!
                </div>
              )}
            </div>

            {/* Readouts */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                }}
              >
                {[
                  { label: "Drop Height", val: `${dropHeight} m`, color: "#f59e0b" },
                  { label: "Time of Fall", val: `${fallTime.toFixed(2)} s`, color: "#6366f1" },
                  { label: "Final Velocity", val: `${finalVelocity.toFixed(1)} m/s`, color: "#10b981" },
                  { label: "g (constant)", val: "9.8 m/s²", color: "#94a3b8" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      borderRadius: "6px",
                      padding: "8px",
                      border: `1px solid ${item.color}25`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.65rem",
                        color: "#94a3b8",
                        marginBottom: "2px",
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: "bold",
                        color: item.color,
                      }}
                    >
                      {item.val}
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "0.7rem",
                  color: "#94a3b8",
                }}
              >
                Formulas: t = √(2h/g) | v = g·t | h = ½g·t²
              </div>
            </div>
          </div>

          <div className={styles.sliderGroup}>
            <label className={styles.sliderLabel}>
              Drop Height:{" "}
              <strong style={{ color: "#f59e0b" }}>{dropHeight} m</strong>
              <input
                type="range"
                min={5}
                max={200}
                value={dropHeight}
                onChange={(e) => {
                  setDropHeight(Number(e.target.value));
                  setFallenY(0);
                  setBallDropped(false);
                  setFallTime(0);
                  setFinalVelocity(0);
                }}
                className={styles.slider}
                style={{ accentColor: "#f59e0b" }}
                disabled={isFalling}
              />
            </label>
          </div>

          <div className={styles.simControls}>
            <button
              className={styles.simBtn}
              onClick={startDrop}
              disabled={isFalling}
            >
              ⬇ Drop Ball
            </button>
            <button
              className={`${styles.simBtn} ${styles.simBtnDanger}`}
              onClick={() => {
                setFallenY(0);
                setBallDropped(false);
                setIsFalling(false);
                setFallTime(0);
                setFinalVelocity(0);
              }}
            >
              ↺ Reset
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 4: Inclined Plane ── */}
      {activeTab === 4 && (
        <div>
          {/* Ramp visual */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "12px",
              position: "relative",
              height: "140px",
            }}
          >
            <svg width="280" height="130" style={{ overflow: "visible" }}>
              {/* Ramp triangle */}
              <polygon
                points={`0,120 200,120 200,${120 - 200 * Math.tan((rampAngle * Math.PI) / 180)}`}
                fill="rgba(100,116,139,0.3)"
                stroke="#64748b"
                strokeWidth="2"
              />
              {/* Angle label */}
              <text x="25" y="110" fill="#f59e0b" fontSize="11">
                {rampAngle}°
              </text>
              {/* Block on ramp */}
              <rect
                x={20 + rampBlockPos * 1.5}
                y={
                  120 -
                  (20 + rampBlockPos * 1.5) *
                    Math.tan((rampAngle * Math.PI) / 180) -
                  16
                }
                width="24"
                height="16"
                rx="3"
                fill="#6366f1"
                transform={`rotate(-${rampAngle}, ${32 + rampBlockPos * 1.5}, ${
                  120 -
                  (28 + rampBlockPos * 1.5) *
                    Math.tan((rampAngle * Math.PI) / 180) -
                  8
                })`}
              />
              {/* Force arrows */}
              {/* Gravity component along ramp */}
              <text x="205" y="60" fill="#ef4444" fontSize="10">
                mg·sin θ = {gravComp.toFixed(1)}N↓
              </text>
              <text x="205" y="75" fill="#94a3b8" fontSize="10">
                Friction = {frictionRamp.toFixed(1)}N↑
              </text>
              <text
                x="205"
                y="90"
                fill={Number(netForceRamp) > 0 ? "#10b981" : "#f59e0b"}
                fontSize="10"
                fontWeight="bold"
              >
                Net = {netForceRamp.toFixed(1)}N
              </text>
            </svg>
          </div>

          <div
            style={{
              textAlign: "center",
              fontSize: "0.8rem",
              marginBottom: "8px",
              color: Number(rampAcc) > 0 ? "#10b981" : "#f59e0b",
            }}
          >
            {Number(rampAcc) > 0
              ? `Block slides down! Acceleration = ${rampAcc} m/s²`
              : "Friction holds the block — it does not slide."}
          </div>

          <div className={styles.sliderGroup}>
            <label className={styles.sliderLabel}>
              Ramp Angle:{" "}
              <strong style={{ color: "#f59e0b" }}>{rampAngle}°</strong>
              <input
                type="range"
                min={5}
                max={75}
                value={rampAngle}
                onChange={(e) => {
                  setRampAngle(Number(e.target.value));
                  setRampBlockPos(0);
                  setRampRunning(false);
                }}
                className={styles.slider}
                style={{ accentColor: "#f59e0b" }}
                disabled={rampRunning}
              />
            </label>
            <label className={styles.sliderLabel}>
              Friction (μ):{" "}
              <strong style={{ color: "#94a3b8" }}>{rampFriction.toFixed(2)}</strong>
              <input
                type="range"
                min={0}
                max={0.8}
                step={0.05}
                value={rampFriction}
                onChange={(e) => {
                  setRampFriction(Number(e.target.value));
                  setRampBlockPos(0);
                  setRampRunning(false);
                }}
                className={styles.slider}
                style={{ accentColor: "#94a3b8" }}
                disabled={rampRunning}
              />
            </label>
            <label className={styles.sliderLabel}>
              Mass:{" "}
              <strong style={{ color: "#6366f1" }}>{rampMass} kg</strong>
              <input
                type="range"
                min={1}
                max={10}
                value={rampMass}
                onChange={(e) => {
                  setRampMass(Number(e.target.value));
                  setRampBlockPos(0);
                  setRampRunning(false);
                }}
                className={styles.slider}
                style={{ accentColor: "#6366f1" }}
                disabled={rampRunning}
              />
            </label>
          </div>

          <div className={styles.simControls}>
            <button
              className={styles.simBtn}
              onClick={runRamp}
              disabled={rampRunning || Number(rampAcc) <= 0}
            >
              ▶ Release Block
            </button>
            <button
              className={`${styles.simBtn} ${styles.simBtnDanger}`}
              onClick={() => {
                setRampBlockPos(0);
                setRampRunning(false);
              }}
            >
              ↺ Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
 * 4. NEWTON'S THIRD LAW — ACTION & REACTION  (5 simulations)
 * ═══════════════════════════════════════════════════════ */
export function ActionReactionSimulation() {
  const [activeTab, setActiveTab] = useState(0);

  /* ── Simulation 1: Rocket Launch ── */
  const [thrust, setThrust] = useState(50);
  const [launched, setLaunched] = useState(false);
  const [rocketY, setRocketY] = useState(0);
  const animRef = useRef<number | null>(null);
  const posRef = useRef(0);

  const launchRocket = () => { posRef.current = 0; setRocketY(0); setLaunched(true); };
  const resetRocket = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setLaunched(false);
    setRocketY(0);
    posRef.current = 0;
  };

  useEffect(() => {
    if (!launched) return;
    const speed = thrust / 20;
    let pos = posRef.current;
    const animate = () => {
      pos += speed;
      posRef.current = pos;
      setRocketY(pos);
      if (pos > 150) { resetRocket(); return; }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
     
  }, [launched, thrust]);

  /* ── Simulation 2: Skateboard Push ── */
  const [massA, setMassA] = useState(50);
  const [massB, setMassB] = useState(75);
  const [pushForce, setPushForce] = useState(150);
  const [isSkating, setIsSkating] = useState(false);
  const [skaterAPos, setSkaterAPos] = useState(120);
  const [skaterBPos, setSkaterBPos] = useState(180);

  const velA = (pushForce / massA) * 0.5;
  const velB = (pushForce / massB) * 0.5;

  const pushOff = () => {
    setIsSkating(true);
    let t = 0;
    const skate = setInterval(() => {
      t += 0.05;
      setSkaterAPos((prev) => Math.max(10, prev - velA * 1.5));
      setSkaterBPos((prev) => Math.min(300, prev + velB * 1.5));
      if (t >= 2.0) clearInterval(skate);
    }, 45);
  };

  const resetSkates = () => {
    setIsSkating(false);
    setSkaterAPos(120);
    setSkaterBPos(180);
  };

  /* ── Simulation 3: Gun Recoil ── */
  const [bulletM, setBulletM] = useState(20);
  const [gunM, setGunM] = useState(4);
  const [isFired, setIsFired] = useState(false);
  const [recoilX, setRecoilX] = useState(0);
  const [bulletX, setBulletX] = useState(0);

  const mBulletKg = bulletM / 1000;
  const vBullet = 350;
  const vRecoil = (mBulletKg * vBullet) / gunM;

  const fireGun = () => {
    setIsFired(true);
    let t = 0;
    const shot = setInterval(() => {
      t += 0.05;
      setRecoilX(-vRecoil * t * 30);
      setBulletX(vBullet * t * 2.5);
      if (t >= 0.8) clearInterval(shot);
    }, 40);
  };

  const resetGun = () => { setIsFired(false); setRecoilX(0); setBulletX(0); };

  /* ── Simulation 4: Rowing Boat ── */
  const [paddleForce, setPaddleForce] = useState(80); // N
  const [boatMassR, setBoatMassR] = useState(200);   // kg
  const [isRowing, setIsRowing] = useState(false);
  const [boatX, setBoatX] = useState(20);
  const [paddleAngle, setPaddleAngle] = useState(0);

  const rowBoat = () => {
    setIsRowing(true);
    let t = 0;
    let xPos = 20;
    const rowAnim = setInterval(() => {
      t += 0.1;
      xPos += (paddleForce / boatMassR) * 3;
      setBoatX(Math.min(260, xPos));
      setPaddleAngle(Math.sin(t * 4) * 30);
      if (xPos >= 260 || t >= 6) { clearInterval(rowAnim); setIsRowing(false); }
    }, 60);
  };

  const resetRow = () => { setBoatX(20); setPaddleAngle(0); setIsRowing(false); };

  /* ── Simulation 5: Balloon Jet ── */
  const [airPressure, setAirPressure] = useState(60);
  const [balloonInflated, setBalloonInflated] = useState(true);
  const [balloonX, setBalloonX] = useState(150);
  const [balloonFlying, setBalloonFlying] = useState(false);
  const [airJetX, setAirJetX] = useState(0); // visual air release trail

  const releaseBalloon = () => {
    if (!balloonInflated) return;
    setBalloonFlying(true);
    setBalloonInflated(false);
    let t = 0;
    let bx = 150;
    const flyAnim = setInterval(() => {
      t += 0.1;
      bx -= (airPressure / 40) * 3; // moves left as air shoots right
      setBalloonX(Math.max(-20, bx));
      setAirJetX((prev) => prev + (airPressure / 20) * 3); // air shoots right
      if (bx <= -20 || t >= 5) { clearInterval(flyAnim); setBalloonFlying(false); }
    }, 60);
  };

  const resetBalloon = () => {
    setBalloonX(150);
    setBalloonInflated(true);
    setBalloonFlying(false);
    setAirJetX(0);
  };

  return (
    <div className={styles.simCard}>
      <div className={styles.simTitle}>
        <span className={styles.simIcon}>🚀</span>
        Topic 4: Newton&apos;s 3rd Law (Action/Reaction) Sandbox
      </div>
      <p className={styles.simDesc}>
        Witness equal and opposite action-reaction force pairs. Choose a simulation:
      </p>

      <SimTabs
        tabs={["Rocket Launch", "Skateboard Push", "Recoil of Gun", "Rowing Boat", "Balloon Jet"]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* ── TAB 0: Rocket Launch ── */}
      {activeTab === 0 && (
        <div>
          <div className={styles.rocketArena}>
            <div
              className={styles.rocketContainer}
              style={{ bottom: `${rocketY}px` }}
            >
              <div className={styles.reactionLabel}>↑ Reaction on Rocket</div>
              <div className={styles.rocket}>🚀</div>
              <div
                className={styles.exhaustFlame}
                style={{
                  opacity: launched ? 1 : 0.3,
                  fontSize: `${thrust / 20}em`,
                }}
              >
                🔥
              </div>
              <div className={styles.actionLabel}>
                ↓ Action: Gas pushed down
              </div>
            </div>
          </div>
          <div className={styles.sliderGroup}>
            <label className={styles.sliderLabel}>
              Thrust:{" "}
              <strong style={{ color: "#f59e0b" }}>{thrust} N</strong>
              <input
                type="range"
                min={10}
                max={100}
                value={thrust}
                onChange={(e) => setThrust(Number(e.target.value))}
                className={styles.slider}
                style={{ accentColor: "#f59e0b" }}
                disabled={launched}
              />
            </label>
          </div>
          <div className={styles.simControls}>
            <button
              className={styles.simBtn}
              onClick={launchRocket}
              disabled={launched}
            >
              🚀 Launch Rocket
            </button>
            <button
              className={`${styles.simBtn} ${styles.simBtnDanger}`}
              onClick={resetRocket}
            >
              ↺ Reset
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 1: Skateboard Push ── */}
      {activeTab === 1 && (
        <div>
          <div className={styles.skaterArena}>
            <div className={styles.skaterTrack} />
            <div
              className={styles.skateboarder}
              style={{ left: `${skaterAPos}px` }}
            >
              <span className={styles.skaterEmoji}>🛹🧑‍🦱</span>
              <span className={styles.skaterMassLabel}>{massA} kg</span>
            </div>
            <div
              className={styles.skateboarder}
              style={{ left: `${skaterBPos}px` }}
            >
              <span
                className={styles.skaterEmoji}
                style={{ transform: "scaleX(-1)" }}
              >
                🛹🧑‍🦰
              </span>
              <span className={styles.skaterMassLabel}>{massB} kg</span>
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
              fontSize: "0.8rem",
              color: "#e2e8f0",
              margin: "8px 0",
            }}
          >
            <span style={{ color: "#6366f1" }}>A: -{velA.toFixed(1)} m/s</span>{" "}
            |{" "}
            <span style={{ color: "#ef4444" }}>B: +{velB.toFixed(1)} m/s</span>{" "}
            — Same force, different masses → different velocities
          </div>
          <div className={styles.sliderGroup}>
            <div style={{ display: "flex", gap: "20px" }}>
              <label className={styles.sliderLabel} style={{ flex: 1 }}>
                Skater A:{" "}
                <strong>{massA} kg</strong>
                <input
                  type="range"
                  min={30}
                  max={100}
                  value={massA}
                  onChange={(e) => {
                    setMassA(Number(e.target.value));
                    resetSkates();
                  }}
                  className={styles.slider}
                  style={{ accentColor: "#6366f1" }}
                  disabled={isSkating}
                />
              </label>
              <label className={styles.sliderLabel} style={{ flex: 1 }}>
                Skater B:{" "}
                <strong>{massB} kg</strong>
                <input
                  type="range"
                  min={30}
                  max={100}
                  value={massB}
                  onChange={(e) => {
                    setMassB(Number(e.target.value));
                    resetSkates();
                  }}
                  className={styles.slider}
                  style={{ accentColor: "#ef4444" }}
                  disabled={isSkating}
                />
              </label>
            </div>
            <label className={styles.sliderLabel}>
              Push Force:{" "}
              <strong>{pushForce} N</strong>
              <input
                type="range"
                min={50}
                max={300}
                value={pushForce}
                onChange={(e) => {
                  setPushForce(Number(e.target.value));
                  resetSkates();
                }}
                className={styles.slider}
                style={{ accentColor: "#f59e0b" }}
                disabled={isSkating}
              />
            </label>
          </div>
          <div className={styles.simControls}>
            <button
              className={styles.simBtn}
              onClick={pushOff}
              disabled={isSkating}
            >
              👐 Push Off!
            </button>
            <button
              className={`${styles.simBtn} ${styles.simBtnDanger}`}
              onClick={resetSkates}
            >
              ↺ Reset
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 2: Recoil of Gun ── */}
      {activeTab === 2 && (
        <div>
          <div className={styles.gunArena}>
            <div
              className={styles.gunElement}
              style={{ transform: `translateX(${recoilX}px)` }}
            >
              🔫
            </div>
            {isFired && (
              <div
                className={styles.bulletElement}
                style={{ left: `calc(30% + 45px + ${bulletX}px)` }}
              >
                🟡
              </div>
            )}
            <div
              style={{
                position: "absolute",
                right: "20px",
                bottom: "10px",
                fontSize: "0.7rem",
                color: "#94a3b8",
              }}
            >
              Bullet: {vBullet} m/s →<br />
              Gun recoil: -{vRecoil.toFixed(2)} m/s
            </div>
          </div>
          <div className={styles.sliderGroup}>
            <div style={{ display: "flex", gap: "20px" }}>
              <label className={styles.sliderLabel} style={{ flex: 1 }}>
                Bullet Mass:{" "}
                <strong>{bulletM} g</strong>
                <input
                  type="range"
                  min={5}
                  max={50}
                  value={bulletM}
                  onChange={(e) => {
                    setBulletM(Number(e.target.value));
                    resetGun();
                  }}
                  className={styles.slider}
                  style={{ accentColor: "#f59e0b" }}
                  disabled={isFired}
                />
              </label>
              <label className={styles.sliderLabel} style={{ flex: 1 }}>
                Rifle Mass:{" "}
                <strong>{gunM} kg</strong>
                <input
                  type="range"
                  min={2}
                  max={10}
                  value={gunM}
                  onChange={(e) => {
                    setGunM(Number(e.target.value));
                    resetGun();
                  }}
                  className={styles.slider}
                  style={{ accentColor: "#94a3b8" }}
                  disabled={isFired}
                />
              </label>
            </div>
          </div>
          <div className={styles.simControls}>
            <button
              className={styles.simBtn}
              onClick={fireGun}
              disabled={isFired}
            >
              💥 Fire!
            </button>
            <button
              className={`${styles.simBtn} ${styles.simBtnDanger}`}
              onClick={resetGun}
            >
              ↺ Reset
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 3: Rowing Boat ── */}
      {activeTab === 3 && (
        <div>
          <div
            style={{
              position: "relative",
              height: "100px",
              background: "linear-gradient(180deg, rgba(59,130,246,0.1) 50%, rgba(37,99,235,0.25) 100%)",
              borderRadius: "8px",
              marginBottom: "10px",
              overflow: "hidden",
            }}
          >
            {/* Water ripple lines */}
            {[30, 60, 90].map((y) => (
              <div
                key={y}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: `${y}px`,
                  height: "1px",
                  background: "rgba(99,179,237,0.2)",
                }}
              />
            ))}
            {/* Boat */}
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: `${boatX}px`,
                fontSize: "1.6rem",
                transition: "none",
              }}
            >
              🚣
            </div>
            {/* Paddle action/reaction labels */}
            {isRowing && (
              <>
                <div
                  style={{
                    position: "absolute",
                    bottom: "4px",
                    left: `${boatX - 30}px`,
                    fontSize: "0.6rem",
                    color: "#ef4444",
                    whiteSpace: "nowrap",
                  }}
                >
                  ← Reaction (boat)
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: "4px",
                    left: `${boatX + 40}px`,
                    fontSize: "0.6rem",
                    color: "#6366f1",
                    whiteSpace: "nowrap",
                  }}
                >
                  → Action (paddle pushes water)
                </div>
              </>
            )}
          </div>

          <div
            style={{
              textAlign: "center",
              fontSize: "0.75rem",
              color: "#94a3b8",
              marginBottom: "8px",
            }}
          >
            Paddle pushes water BACKWARD (Action) → Water pushes boat FORWARD (Reaction). Newton&apos;s 3rd Law!
          </div>

          <div className={styles.sliderGroup}>
            <div style={{ display: "flex", gap: "12px" }}>
              <label className={styles.sliderLabel} style={{ flex: 1 }}>
                Paddle Force:{" "}
                <strong style={{ color: "#6366f1" }}>{paddleForce} N</strong>
                <input
                  type="range"
                  min={20}
                  max={150}
                  value={paddleForce}
                  onChange={(e) => {
                    setPaddleForce(Number(e.target.value));
                    resetRow();
                  }}
                  className={styles.slider}
                  style={{ accentColor: "#6366f1" }}
                  disabled={isRowing}
                />
              </label>
              <label className={styles.sliderLabel} style={{ flex: 1 }}>
                Boat Mass:{" "}
                <strong style={{ color: "#f59e0b" }}>{boatMassR} kg</strong>
                <input
                  type="range"
                  min={50}
                  max={500}
                  value={boatMassR}
                  onChange={(e) => {
                    setBoatMassR(Number(e.target.value));
                    resetRow();
                  }}
                  className={styles.slider}
                  style={{ accentColor: "#f59e0b" }}
                  disabled={isRowing}
                />
              </label>
            </div>
          </div>

          <div className={styles.simControls}>
            <button
              className={styles.simBtn}
              onClick={rowBoat}
              disabled={isRowing}
            >
              🚣 Row Boat
            </button>
            <button
              className={`${styles.simBtn} ${styles.simBtnDanger}`}
              onClick={resetRow}
            >
              ↺ Reset
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 4: Balloon Jet ── */}
      {activeTab === 4 && (
        <div>
          <div
            style={{
              position: "relative",
              height: "100px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "8px",
              marginBottom: "10px",
              overflow: "hidden",
            }}
          >
            {/* Balloon */}
            <div
              style={{
                position: "absolute",
                top: "15px",
                left: `${balloonX}px`,
                fontSize: balloonInflated ? "2rem" : "1.2rem",
                transition: "none",
              }}
            >
              🎈
            </div>
            {/* Air jet trail */}
            {balloonFlying && (
              <div
                style={{
                  position: "absolute",
                  top: "38px",
                  left: `${balloonX + 30}px`,
                  width: `${Math.min(180, airJetX / 3)}px`,
                  height: "4px",
                  background:
                    "linear-gradient(90deg, rgba(148,163,184,0.8), transparent)",
                  borderRadius: "2px",
                }}
              />
            )}
            {/* Labels */}
            {balloonFlying && (
              <>
                <div
                  style={{
                    position: "absolute",
                    top: "70px",
                    left: `${balloonX - 20}px`,
                    fontSize: "0.6rem",
                    color: "#ef4444",
                    whiteSpace: "nowrap",
                  }}
                >
                  ← Reaction (balloon moves left)
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: "70px",
                    left: `${balloonX + 40}px`,
                    fontSize: "0.6rem",
                    color: "#6366f1",
                    whiteSpace: "nowrap",
                  }}
                >
                  → Action (air released right)
                </div>
              </>
            )}
          </div>

          <div
            style={{
              textAlign: "center",
              fontSize: "0.75rem",
              color: "#94a3b8",
              marginBottom: "8px",
            }}
          >
            Balloon releases air to the RIGHT (Action) → Balloon flies LEFT (Reaction).
            This is the principle behind rockets and jet engines!
          </div>

          <div className={styles.sliderGroup}>
            <label className={styles.sliderLabel}>
              Air Pressure:{" "}
              <strong style={{ color: "#6366f1" }}>{airPressure}%</strong>
              <input
                type="range"
                min={20}
                max={100}
                value={airPressure}
                onChange={(e) => {
                  setAirPressure(Number(e.target.value));
                  resetBalloon();
                }}
                className={styles.slider}
                style={{ accentColor: "#6366f1" }}
                disabled={balloonFlying}
              />
            </label>
          </div>

          <div className={styles.simControls}>
            <button
              className={styles.simBtn}
              onClick={releaseBalloon}
              disabled={balloonFlying || !balloonInflated}
            >
              💨 Release Balloon
            </button>
            <button
              className={`${styles.simBtn} ${styles.simBtnDanger}`}
              onClick={resetBalloon}
            >
              ↺ Re-inflate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
 * 5. CONSERVATION OF MOMENTUM  (5 simulations)
 * ═══════════════════════════════════════════════════════ */
export function MomentumSimulation() {
  const [activeTab, setActiveTab] = useState(0);

  /* ── Simulation 1: Colliding Spheres (elastic) ── */
  const [mass1, setMass1] = useState(2);
  const [vel1, setVel1] = useState(4);
  const [mass2, setMass2] = useState(3);
  const [vel2, setVel2] = useState(0);
  const [collided, setCollided] = useState(false);

  const v1After = ((mass1 - mass2) * vel1 + 2 * mass2 * vel2) / (mass1 + mass2);
  const v2After = ((mass2 - mass1) * vel2 + 2 * mass1 * vel1) / (mass1 + mass2);
  const pBefore = mass1 * vel1 + mass2 * vel2;
  const pAfter = mass1 * v1After + mass2 * v2After;

  /* ── Simulation 2: Newton's Cradle ── */
  const [pullCount, setPullCount] = useState(1);
  const [cradleState, setCradleState] = useState<"idle" | "swinging-left" | "impact" | "swinging-right">("idle");
  const [cradleTimer, setCradleTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const triggerCradle = () => {
    if (cradleTimer) clearTimeout(cradleTimer);
    setCradleState("swinging-left");
    const t1 = setTimeout(() => {
      setCradleState("impact");
      const t2 = setTimeout(() => {
        setCradleState("swinging-right");
        const t3 = setTimeout(() => setCradleState("idle"), 600);
        setCradleTimer(t3);
      }, 100);
      setCradleTimer(t2);
    }, 600);
    setCradleTimer(t1);
  };

  useEffect(() => {
    return () => { if (cradleTimer) clearTimeout(cradleTimer); };
  }, [cradleTimer]);

  /* ── Simulation 3: Space Docking Recoil ── */
  const [astronautM, setAstronautM] = useState(80);
  const [crateM, setCrateM] = useState(40);
  const [throwSpeed, setThrowSpeed] = useState(4);
  const [dockState, setDockState] = useState<"ready" | "thrown">("ready");
  const [astroX, setAstroX] = useState(150);
  const [crateX, setCrateX] = useState(190);

  const vAstro = -(throwSpeed * crateM) / (astronautM + crateM);
  const vCrate = throwSpeed + vAstro;

  const launchDocking = () => {
    setDockState("thrown");
    let t = 0;
    const timer = setInterval(() => {
      t += 0.1;
      setAstroX((prev) => Math.max(10, prev + vAstro * 5));
      setCrateX((prev) => Math.min(320, prev + vCrate * 5));
      if (t >= 3.0) clearInterval(timer);
    }, 50);
  };

  const resetDocking = () => {
    setDockState("ready");
    setAstroX(150);
    setCrateX(190);
  };

  /* ── Simulation 4: Elastic vs Inelastic Collision ── */
  const [collisionType, setCollisionType] = useState<"elastic" | "inelastic">("elastic");
  const [mA, setMA] = useState(3);  // kg
  const [vA, setVA] = useState(6);  // m/s
  const [mB, setMB] = useState(3);  // kg (at rest)
  const [collisionDone, setCollisionDone] = useState(false);

  // Elastic: normal collision formulas
  const elVa2 = ((mA - mB) * vA) / (mA + mB);
  const elVb2 = (2 * mA * vA) / (mA + mB);
  // Inelastic: bodies stick together
  const inVfinal = (mA * vA) / (mA + mB);

  const keBeforeAI = 0.5 * mA * vA * vA;
  const keAfterElastic = 0.5 * mA * elVa2 * elVa2 + 0.5 * mB * elVb2 * elVb2;
  const keAfterInelastic = 0.5 * (mA + mB) * inVfinal * inVfinal;
  const keLoss = keBeforeAI - keAfterInelastic;

  /* ── Simulation 5: Explosion ── */
  const [expTotalMass, setExpTotalMass] = useState(10); // kg
  const [expMassRatio, setExpMassRatio] = useState(0.5); // fraction for fragment A
  const [expEnergyReleased, setExpEnergyReleased] = useState(200); // J
  const [exploded, setExploded] = useState(false);
  const [fragAX, setFragAX] = useState(150);
  const [fragBX, setFragBX] = useState(170);

  const expMassA = expTotalMass * expMassRatio;
  const expMassB = expTotalMass * (1 - expMassRatio);
  // From conservation: mA*vA = mB*vB → vA = sqrt(2KE * mB / (mA*(mA+mB)))
  const expVelA = Math.sqrt(Math.max(0, (2 * expEnergyReleased * expMassB) / (expMassA * expTotalMass)));
  const expVelB = Math.sqrt(Math.max(0, (2 * expEnergyReleased * expMassA) / (expMassB * expTotalMass)));
  const expMomentumCheck = (expMassA * expVelA - expMassB * expVelB).toFixed(2);

  const triggerExplosion = () => {
    setExploded(true);
    let t = 0;
    const expAnim = setInterval(() => {
      t += 0.1;
      setFragAX((prev) => Math.max(0, prev - expVelA * 3));
      setFragBX((prev) => Math.min(320, prev + expVelB * 3));
      if (t >= 3) clearInterval(expAnim);
    }, 60);
  };

  const resetExplosion = () => {
    setExploded(false);
    setFragAX(150);
    setFragBX(170);
  };

  return (
    <div className={styles.simCard}>
      <div className={styles.simTitle}>
        <span className={styles.simIcon}>💥</span>
        Topic 5: Conservation of Momentum Sandbox
      </div>
      <p className={styles.simDesc}>
        Confirm that total momentum is always conserved. Choose a simulation:
      </p>

      <SimTabs
        tabs={["Colliding Spheres", "Newton's Cradle", "Space Recoil", "Elastic vs Inelastic", "Explosion Lab"]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* ── TAB 0: Colliding Spheres ── */}
      {activeTab === 0 && (
        <div>
          <div className={styles.collisionArena}>
            <div className={styles.collisionState}>
              <div className={styles.stateLabel}>Before Collision</div>
              <div className={styles.ballRow}>
                <div
                  className={styles.collBall}
                  style={{
                    width: `${25 + mass1 * 6}px`,
                    height: `${25 + mass1 * 6}px`,
                    background: "#6366f1",
                  }}
                >
                  {mass1}kg
                  <span className={styles.velLabel}>→{vel1}m/s</span>
                </div>
                <div
                  className={styles.collBall}
                  style={{
                    width: `${25 + mass2 * 6}px`,
                    height: `${25 + mass2 * 6}px`,
                    background: "#ef4444",
                  }}
                >
                  {mass2}kg
                  <span className={styles.velLabel}>
                    {vel2 === 0 ? "rest" : `→${vel2}m/s`}
                  </span>
                </div>
              </div>
              <div className={styles.momentumTag}>
                Total p before:{" "}
                <strong>{pBefore.toFixed(1)} kg·m/s</strong>
              </div>
            </div>

            <button
              className={styles.collideBtn}
              onClick={() => setCollided(!collided)}
            >
              {collided ? "↺ Reset" : "💥 Collide!"}
            </button>

            {collided && (
              <div className={styles.collisionState}>
                <div className={styles.stateLabel}>After Collision</div>
                <div className={styles.ballRow}>
                  <div
                    className={styles.collBall}
                    style={{
                      width: `${25 + mass1 * 6}px`,
                      height: `${25 + mass1 * 6}px`,
                      background: "#6366f1",
                    }}
                  >
                    {mass1}kg
                    <span className={styles.velLabel}>
                      {v1After > 0 ? "→" : "←"}
                      {Math.abs(v1After).toFixed(1)}m/s
                    </span>
                  </div>
                  <div
                    className={styles.collBall}
                    style={{
                      width: `${25 + mass2 * 6}px`,
                      height: `${25 + mass2 * 6}px`,
                      background: "#ef4444",
                    }}
                  >
                    {mass2}kg
                    <span className={styles.velLabel}>
                      {v2After > 0 ? "→" : "←"}
                      {Math.abs(v2After).toFixed(1)}m/s
                    </span>
                  </div>
                </div>
                <div
                  className={styles.momentumTag}
                  style={{ color: "#10b981" }}
                >
                  Total p after:{" "}
                  <strong>{pAfter.toFixed(1)} kg·m/s</strong> ✓ Conserved!
                </div>
              </div>
            )}
          </div>

          <div className={styles.sliderGroup}>
            <label className={styles.sliderLabel}>
              Ball A Mass:{" "}
              <strong style={{ color: "#6366f1" }}>{mass1} kg</strong>
              <input
                type="range"
                min={1}
                max={5}
                value={mass1}
                onChange={(e) => {
                  setMass1(Number(e.target.value));
                  setCollided(false);
                }}
                className={styles.slider}
                style={{ accentColor: "#6366f1" }}
              />
            </label>
            <label className={styles.sliderLabel}>
              Ball A Velocity:{" "}
              <strong style={{ color: "#6366f1" }}>{vel1} m/s</strong>
              <input
                type="range"
                min={1}
                max={10}
                value={vel1}
                onChange={(e) => {
                  setVel1(Number(e.target.value));
                  setCollided(false);
                }}
                className={styles.slider}
                style={{ accentColor: "#6366f1" }}
              />
            </label>
            <label className={styles.sliderLabel}>
              Ball B Mass:{" "}
              <strong style={{ color: "#ef4444" }}>{mass2} kg</strong>
              <input
                type="range"
                min={1}
                max={5}
                value={mass2}
                onChange={(e) => {
                  setMass2(Number(e.target.value));
                  setCollided(false);
                }}
                className={styles.slider}
                style={{ accentColor: "#ef4444" }}
              />
            </label>
          </div>
        </div>
      )}

      {/* ── TAB 1: Newton's Cradle ── */}
      {activeTab === 1 && (
        <div>
          <div className={styles.cradleArena}>
            <div className={styles.cradleFrame} />
            {[0, 1, 2, 3, 4].map((i) => {
              let rotation = 0;
              if (cradleState === "swinging-left" && i < pullCount) rotation = -35;
              else if (cradleState === "swinging-right" && i >= 5 - pullCount) rotation = 35;
              return (
                <div
                  key={i}
                  className={styles.cradlePendant}
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  <div className={styles.cradleString} />
                  <div className={styles.cradleBallBody} />
                </div>
              );
            })}
          </div>
          <div
            style={{
              textAlign: "center",
              fontSize: "0.8rem",
              color: "#e2e8f0",
              margin: "8px 0",
            }}
          >
            Pulling {pullCount} ball(s) — exactly {pullCount} ball(s) fly out on the other side. Momentum transferred!
          </div>
          <div className={styles.simControls}>
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                className={`${styles.simBtn} ${pullCount === num ? styles.simTabActive : ""}`}
                onClick={() => setPullCount(num)}
                disabled={cradleState !== "idle"}
              >
                Pull {num}
              </button>
            ))}
            <button
              className={`${styles.simBtn} ${styles.simBtnSuccess}`}
              onClick={triggerCradle}
              disabled={cradleState !== "idle"}
            >
              ▶ Release
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 2: Space Recoil ── */}
      {activeTab === 2 && (
        <div>
          <div className={styles.spaceArena}>
            <div className={styles.astronautBody} style={{ left: `${astroX}px` }}>
              👨‍🚀
              <div
                style={{
                  fontSize: "0.55rem",
                  background: "rgba(0,0,0,0.5)",
                  padding: "2px",
                  borderRadius: "3px",
                  textAlign: "center",
                }}
              >
                {astronautM}kg
              </div>
            </div>
            <div className={styles.crateBody} style={{ left: `${crateX}px` }}>
              📦
              <div
                style={{
                  fontSize: "0.55rem",
                  background: "rgba(0,0,0,0.5)",
                  padding: "2px",
                  borderRadius: "3px",
                  textAlign: "center",
                }}
              >
                {crateM}kg
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                left: "10px",
                top: "10px",
                fontSize: "0.75rem",
                color: "#34d399",
              }}
            >
              Total Momentum: <strong>0.00 kg·m/s (Conserved)</strong>
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
              fontSize: "0.8rem",
              color: "#e2e8f0",
              margin: "8px 0",
            }}
          >
            <span style={{ color: "#a5b4fc" }}>
              Astronaut recoil: {vAstro.toFixed(2)} m/s
            </span>{" "}
            |{" "}
            <span style={{ color: "#fcd34d" }}>
              Crate: {vCrate.toFixed(2)} m/s
            </span>
          </div>
          <div className={styles.sliderGroup}>
            <div style={{ display: "flex", gap: "20px" }}>
              <label className={styles.sliderLabel} style={{ flex: 1 }}>
                Astronaut:{" "}
                <strong>{astronautM} kg</strong>
                <input
                  type="range"
                  min={50}
                  max={120}
                  value={astronautM}
                  onChange={(e) => {
                    setAstronautM(Number(e.target.value));
                    resetDocking();
                  }}
                  className={styles.slider}
                  style={{ accentColor: "#6366f1" }}
                  disabled={dockState === "thrown"}
                />
              </label>
              <label className={styles.sliderLabel} style={{ flex: 1 }}>
                Crate:{" "}
                <strong>{crateM} kg</strong>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={crateM}
                  onChange={(e) => {
                    setCrateM(Number(e.target.value));
                    resetDocking();
                  }}
                  className={styles.slider}
                  style={{ accentColor: "#ef4444" }}
                  disabled={dockState === "thrown"}
                />
              </label>
            </div>
            <label className={styles.sliderLabel}>
              Throw Speed:{" "}
              <strong>{throwSpeed} m/s</strong>
              <input
                type="range"
                min={2}
                max={10}
                value={throwSpeed}
                onChange={(e) => {
                  setThrowSpeed(Number(e.target.value));
                  resetDocking();
                }}
                className={styles.slider}
                style={{ accentColor: "#f59e0b" }}
                disabled={dockState === "thrown"}
              />
            </label>
          </div>
          <div className={styles.simControls}>
            <button
              className={styles.simBtn}
              onClick={launchDocking}
              disabled={dockState === "thrown"}
            >
              🚀 Throw Crate
            </button>
            <button
              className={`${styles.simBtn} ${styles.simBtnDanger}`}
              onClick={resetDocking}
            >
              ↺ Reset
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 3: Elastic vs Inelastic ── */}
      {activeTab === 3 && (
        <div>
          {/* Collision type toggle */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "center",
              marginBottom: "12px",
            }}
          >
            <button
              className={`${styles.simBtn} ${collisionType === "elastic" ? styles.simTabActive : ""}`}
              onClick={() => {
                setCollisionType("elastic");
                setCollisionDone(false);
              }}
            >
              ⚡ Elastic
            </button>
            <button
              className={`${styles.simBtn} ${collisionType === "inelastic" ? styles.simTabActive : ""}`}
              onClick={() => {
                setCollisionType("inelastic");
                setCollisionDone(false);
              }}
            >
              🧲 Perfectly Inelastic
            </button>
          </div>

          {/* Results table */}
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "10px",
              fontSize: "0.78rem",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "6px",
                color: "#94a3b8",
                marginBottom: "6px",
                fontWeight: "bold",
              }}
            >
              <span>Quantity</span>
              <span style={{ color: "#6366f1" }}>Before</span>
              <span style={{ color: collisionDone ? "#10b981" : "#94a3b8" }}>After</span>
            </div>
            {/* Momentum */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "6px",
                marginBottom: "4px",
              }}
            >
              <span style={{ color: "#e2e8f0" }}>Momentum (kg·m/s)</span>
              <span style={{ color: "#6366f1" }}>{(mA * vA).toFixed(1)}</span>
              <span style={{ color: "#10b981" }}>
                {collisionType === "elastic"
                  ? (mA * elVa2 + mB * elVb2).toFixed(1)
                  : ((mA + mB) * inVfinal).toFixed(1)}{" "}
                ✓
              </span>
            </div>
            {/* KE */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "6px",
              }}
            >
              <span style={{ color: "#e2e8f0" }}>Kinetic Energy (J)</span>
              <span style={{ color: "#6366f1" }}>{keBeforeAI.toFixed(1)}</span>
              <span
                style={{
                  color:
                    collisionType === "elastic" ? "#10b981" : "#f59e0b",
                }}
              >
                {collisionType === "elastic"
                  ? keAfterElastic.toFixed(1) + " ✓"
                  : keAfterInelastic.toFixed(1) +
                    " (-" +
                    keLoss.toFixed(1) +
                    "J)"}
              </span>
            </div>
          </div>

          <div
            style={{
              fontSize: "0.75rem",
              color: "#94a3b8",
              textAlign: "center",
              marginBottom: "8px",
            }}
          >
            {collisionType === "elastic"
              ? "Elastic: momentum AND kinetic energy are both conserved. Balls bounce apart."
              : "Inelastic: momentum conserved, but KE is LOST as heat/sound/deformation."}
          </div>

          <div className={styles.sliderGroup}>
            <div style={{ display: "flex", gap: "12px" }}>
              <label className={styles.sliderLabel} style={{ flex: 1 }}>
                Ball A Mass:{" "}
                <strong style={{ color: "#6366f1" }}>{mA} kg</strong>
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={mA}
                  onChange={(e) => {
                    setMA(Number(e.target.value));
                    setCollisionDone(false);
                  }}
                  className={styles.slider}
                  style={{ accentColor: "#6366f1" }}
                />
              </label>
              <label className={styles.sliderLabel} style={{ flex: 1 }}>
                Ball A Velocity:{" "}
                <strong style={{ color: "#6366f1" }}>{vA} m/s</strong>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={vA}
                  onChange={(e) => {
                    setVA(Number(e.target.value));
                    setCollisionDone(false);
                  }}
                  className={styles.slider}
                  style={{ accentColor: "#6366f1" }}
                />
              </label>
              <label className={styles.sliderLabel} style={{ flex: 1 }}>
                Ball B Mass:{" "}
                <strong style={{ color: "#ef4444" }}>{mB} kg</strong>
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={mB}
                  onChange={(e) => {
                    setMB(Number(e.target.value));
                    setCollisionDone(false);
                  }}
                  className={styles.slider}
                  style={{ accentColor: "#ef4444" }}
                />
              </label>
            </div>
          </div>

          <div className={styles.simControls}>
            <button
              className={styles.simBtn}
              onClick={() => setCollisionDone(true)}
            >
              💥 Collide
            </button>
            <button
              className={`${styles.simBtn} ${styles.simBtnDanger}`}
              onClick={() => setCollisionDone(false)}
            >
              ↺ Reset
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 4: Explosion Lab ── */}
      {activeTab === 4 && (
        <div>
          <div
            style={{
              position: "relative",
              height: "90px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "8px",
              marginBottom: "10px",
              overflow: "hidden",
            }}
          >
            {/* Fragment A (flies left) */}
            <div
              style={{
                position: "absolute",
                top: "22px",
                left: `${fragAX}px`,
                fontSize: "1.3rem",
                transition: "none",
              }}
            >
              🟦
            </div>
            <div
              style={{
                position: "absolute",
                top: "50px",
                left: `${fragAX - 10}px`,
                fontSize: "0.6rem",
                color: "#6366f1",
                whiteSpace: "nowrap",
              }}
            >
              {expMassA.toFixed(1)} kg | ←{expVelA.toFixed(1)} m/s
            </div>

            {/* Fragment B (flies right) */}
            <div
              style={{
                position: "absolute",
                top: "22px",
                left: `${fragBX}px`,
                fontSize: "1.3rem",
                transition: "none",
              }}
            >
              🟥
            </div>
            <div
              style={{
                position: "absolute",
                top: "50px",
                left: `${fragBX + 5}px`,
                fontSize: "0.6rem",
                color: "#ef4444",
                whiteSpace: "nowrap",
              }}
            >
              {expMassB.toFixed(1)} kg | {expVelB.toFixed(1)} m/s→
            </div>

            {/* Explosion flash */}
            {exploded && (
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "140px",
                  fontSize: "2rem",
                  animation: "none",
                }}
              >
                💥
              </div>
            )}
          </div>

          <div
            style={{
              textAlign: "center",
              fontSize: "0.75rem",
              color: "#94a3b8",
              marginBottom: "8px",
            }}
          >
            Total momentum = {expMomentumCheck} kg·m/s (should be ≈ 0 — conserved from initial rest!)
          </div>

          <div className={styles.sliderGroup}>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <label className={styles.sliderLabel} style={{ flex: "1 0 120px" }}>
                Total Mass:{" "}
                <strong style={{ color: "#f59e0b" }}>{expTotalMass} kg</strong>
                <input
                  type="range"
                  min={2}
                  max={20}
                  value={expTotalMass}
                  onChange={(e) => {
                    setExpTotalMass(Number(e.target.value));
                    resetExplosion();
                  }}
                  className={styles.slider}
                  style={{ accentColor: "#f59e0b" }}
                  disabled={exploded}
                />
              </label>
              <label className={styles.sliderLabel} style={{ flex: "1 0 120px" }}>
                Mass Ratio (A / Total):{" "}
                <strong style={{ color: "#6366f1" }}>
                  {(expMassRatio * 100).toFixed(0)}%
                </strong>
                <input
                  type="range"
                  min={0.1}
                  max={0.9}
                  step={0.05}
                  value={expMassRatio}
                  onChange={(e) => {
                    setExpMassRatio(Number(e.target.value));
                    resetExplosion();
                  }}
                  className={styles.slider}
                  style={{ accentColor: "#6366f1" }}
                  disabled={exploded}
                />
              </label>
              <label className={styles.sliderLabel} style={{ flex: "1 0 120px" }}>
                Explosion Energy:{" "}
                <strong style={{ color: "#ef4444" }}>{expEnergyReleased} J</strong>
                <input
                  type="range"
                  min={50}
                  max={600}
                  step={10}
                  value={expEnergyReleased}
                  onChange={(e) => {
                    setExpEnergyReleased(Number(e.target.value));
                    resetExplosion();
                  }}
                  className={styles.slider}
                  style={{ accentColor: "#ef4444" }}
                  disabled={exploded}
                />
              </label>
            </div>
          </div>

          <div className={styles.simControls}>
            <button
              className={styles.simBtn}
              onClick={triggerExplosion}
              disabled={exploded}
            >
              💥 Explode!
            </button>
            <button
              className={`${styles.simBtn} ${styles.simBtnDanger}`}
              onClick={resetExplosion}
            >
              ↺ Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
 * TopicSimulation — picks the correct simulation for the topic.
 * Each topic shows 5 core simulations + 1 real-world bonus simulation.
 * ───────────────────────────────────────────────────────── */
interface TopicSimulationProps {
  topicId: string;
}

export default function TopicSimulation({ topicId }: TopicSimulationProps) {
  const [showBonus, setShowBonus] = useState(false);

  let coreSim: React.ReactNode = null;
  let bonusSim: React.ReactNode = null;
  let bonusLabel = "";

  switch (topicId) {
    case "balanced-unbalanced-forces":
      coreSim = <BalancedForcesSimulation />;
      bonusSim = <CarSafetySimulation />;
      bonusLabel = "🚗 Car Safety Physics";
      break;
    case "first-law-of-motion-inertia":
    case "first-law-of-motion":
      coreSim = <InertiaSimulation />;
      bonusSim = <SpacecraftSimulation />;
      bonusLabel = "🛸 Spacecraft Free Motion";
      break;
    case "second-law-of-motion":
      coreSim = <FmaSimulation />;
      bonusSim = <RocketLaunchSimulation />;
      bonusLabel = "🚀 Rocket Launch";
      break;
    case "third-law-of-motion":
      coreSim = <ActionReactionSimulation />;
      bonusSim = <RecoilSimulation />;
      bonusLabel = "🔫 Gun Recoil";
      break;
    case "conservation-of-momentum":
      coreSim = <MomentumSimulation />;
      bonusSim = <BallisticPendulumSimulation />;
      bonusLabel = "🎯 Ballistic Pendulum";
      break;
    default:
      return null;
  }

  /* Which advanced sim pack to render for this topic */
  let advancedSims: React.ReactNode = null;
  switch (topicId) {
    case "balanced-unbalanced-forces":
      advancedSims = <AdvancedTopic1Sims />;
      break;
    case "first-law-of-motion-inertia":
    case "first-law-of-motion":
      advancedSims = <AdvancedTopic2Sims />;
      break;
    case "second-law-of-motion":
      advancedSims = <AdvancedTopic3Sims />;
      break;
    case "third-law-of-motion":
      advancedSims = <AdvancedTopic4Sims />;
      break;
    case "conservation-of-momentum":
      advancedSims = <AdvancedTopic5Sims />;
      break;
  }

  /* Which EXTRA sim pack to render (9 additional sims per topic — brings total to ~30) */
  let extraSims: React.ReactNode = null;
  switch (topicId) {
    case "balanced-unbalanced-forces":
      extraSims = <AdvancedTopic1ExtraSims />;
      break;
    case "first-law-of-motion-inertia":
    case "first-law-of-motion":
      extraSims = <AdvancedTopic2ExtraSims />;
      break;
    case "second-law-of-motion":
      extraSims = <AdvancedTopic3ExtraSims />;
      break;
    case "third-law-of-motion":
      extraSims = <AdvancedTopic4ExtraSims />;
      break;
    case "conservation-of-momentum":
      extraSims = <AdvancedTopic5ExtraSims />;
      break;
  }

  return (
    <div>
      {coreSim}

      {/* Bonus simulation toggle */}
      <div style={{ marginTop: 16 }}>
        <button
          onClick={() => setShowBonus((v) => !v)}
          style={{
            width: "100%",
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px dashed rgba(99,102,241,0.5)",
            background: showBonus
              ? "rgba(99,102,241,0.12)"
              : "rgba(255,255,255,0.03)",
            color: "#a5b4fc",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "all 0.2s",
          }}
        >
          <span style={{
            padding: "2px 8px",
            borderRadius: 6,
            background: "rgba(99,102,241,0.25)",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
            color: "#c7d2fe",
          }}>
            SIM 6
          </span>
          {showBonus ? "▲ Hide" : "▼ Show"} Bonus Real-World Simulation: {bonusLabel}
        </button>

        {showBonus && (
          <div style={{ marginTop: 12 }}>
            {bonusSim}
          </div>
        )}
      </div>

      {/* Advanced simulations pack (15 sims per topic) */}
      {advancedSims}

      {/* Extra simulations pack (9 more per topic — total ≈ 30 simulations) */}
      {extraSims}
    </div>
  );
}
