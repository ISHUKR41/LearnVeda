/**
 * FILE: PhysicsSimulation.tsx
 * LOCATION: src/components/physics/PhysicsSimulation.tsx
 * PURPOSE: Extended physics simulations for Class 9 Force & Laws of Motion.
 *          Each topic features 3 interactive simulations selectable via tabs,
 *          providing a rich, fully responsive, and premium visual sandbox.
 * LAST UPDATED: 2026-05-29
 */

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./PhysicsSimulation.module.css";

/* ───────────────────────────────────────────────────────
 * helper component for custom tab buttons
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
 * 1. BALANCED & UNBALANCED FORCES
 * ═══════════════════════════════════════════════════════ */
export function BalancedForcesSimulation() {
  const [activeTab, setActiveTab] = useState(0);

  // Simulation 1: Tug of War
  const [forceA, setForceA] = useState(100);
  const [forceB, setForceB] = useState(100);
  const netForceTug = forceA - forceB;
  const ropeOffset = Math.max(-80, Math.min(80, netForceTug * 0.5));
  const isBalancedTug = Math.abs(netForceTug) < 5;

  // Simulation 2: Block on a Table
  const [pushLeft, setPushLeft] = useState(50); // pushing from left (moving block right)
  const [pushRight, setPushRight] = useState(50); // pushing from right (moving block left)
  const [frictionCoefficient, setFrictionCoefficient] = useState(30);
  const [blockX, setBlockX] = useState(150); // range 10 to 290
  const [isAnimatingBlock, setIsAnimatingBlock] = useState(false);

  const rawNet = pushLeft - pushRight;
  const maxFriction = frictionCoefficient;
  const frictionForce = Math.abs(rawNet) <= maxFriction ? rawNet : Math.sign(rawNet) * maxFriction;
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

  // Simulation 3: Vector Addition
  const [v1, setV1] = useState(60);
  const [v1Dir, setV1Dir] = useState(1); // 1 = right, -1 = left
  const [v2, setV2] = useState(40);
  const [v2Dir, setV2Dir] = useState(1);
  const resultant = v1 * v1Dir + v2 * v2Dir;

  return (
    <div className={styles.simCard}>
      <div className={styles.simTitle}>
        <span className={styles.simIcon}>⚡</span>
        Topic 1: Balanced & Unbalanced Forces Sandbox
      </div>
      <p className={styles.simDesc}>
        Explore how forces cancel out or combine to accelerate objects. Choose a simulation:
      </p>

      <SimTabs
        tabs={["Tug of War", "Block on a Table", "Vector Sandbox"]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Tug of War */}
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
                    background: isBalancedTug ? "#10b981" : netForceTug > 0 ? "#6366f1" : "#ef4444",
                  }}
                />
              </div>
              <div className={styles.netForceLabel} style={{ color: isBalancedTug ? "#10b981" : "#f59e0b" }}>
                Net Force: {Math.abs(netForceTug).toFixed(0)} N{" "}
                {isBalancedTug ? "✓ Balanced (Static)" : netForceTug > 0 ? "→ Unbalanced (A wins)" : "← Unbalanced (B wins)"}
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
              Team A Pull (Left side pulling Left? No, Team A pulls left): <strong style={{ color: "#6366f1" }}>{forceA} N</strong>
              <input
                type="range" min={0} max={200} value={forceA}
                onChange={(e) => setForceA(Number(e.target.value))}
                className={styles.slider} style={{ accentColor: "#6366f1" }}
              />
            </label>
            <label className={styles.sliderLabel}>
              Team B Pull (Right side pulling Right): <strong style={{ color: "#ef4444" }}>{forceB} N</strong>
              <input
                type="range" min={0} max={200} value={forceB}
                onChange={(e) => setForceB(Number(e.target.value))}
                className={styles.slider} style={{ accentColor: "#ef4444" }}
              />
            </label>
          </div>
        </div>
      )}

      {/* Block on Table */}
      {activeTab === 1 && (
        <div>
          <div className={styles.blockArena}>
            <div className={styles.blockTable} />
            
            {/* Left Push Arrow (Vector) */}
            <div className={styles.vectorArrow} style={{ left: "10px", width: `${pushLeft}px`, bottom: "60px" }}>
              <div className={styles.arrowShaftLine} style={{ background: "#6366f1", height: "4px", width: "100%" }} />
              <div className={styles.arrowHeadSymbol} style={{ color: "#6366f1" }}>▶</div>
              <span style={{ fontSize: "0.65rem", color: "#6366f1", marginLeft: "4px" }}>Push A: {pushLeft}N</span>
            </div>

            {/* Right Push Arrow (Vector) */}
            <div className={styles.vectorArrow} style={{ right: "10px", width: `${pushRight}px`, bottom: "60px", flexDirection: "row-reverse" }}>
              <div className={styles.arrowShaftLine} style={{ background: "#ef4444", height: "4px", width: "100%" }} />
              <div className={styles.arrowHeadSymbol} style={{ color: "#ef4444" }}>◀</div>
              <span style={{ fontSize: "0.65rem", color: "#ef4444", marginRight: "4px" }}>Push B: {pushRight}N</span>
            </div>

            {/* Friction Force Arrow */}
            {frictionForce !== 0 && (
              <div className={styles.vectorArrow} style={{
                left: `${blockX + 20}px`,
                width: `${Math.abs(frictionForce)}px`,
                bottom: "20px",
                flexDirection: frictionForce > 0 ? "row-reverse" : "row"
              }}>
                <div className={styles.arrowShaftLine} style={{ background: "#94a3b8", height: "2px", width: "100%" }} />
                <div className={styles.arrowHeadSymbol} style={{ color: "#94a3b8" }}>{frictionForce > 0 ? "◀" : "▶"}</div>
                <span style={{ fontSize: "0.55rem", color: "#94a3b8" }}>f: {Math.abs(frictionForce).toFixed(0)}N</span>
              </div>
            )}

            <div
              className={styles.slidingBlock}
              style={{ left: `${blockX}px`, width: "50px", height: "35px" }}
            >
              📦 Block
            </div>
          </div>

          <div style={{ textAlign: "center", fontSize: "0.8rem", color: "#e2e8f0", margin: "8px 0" }}>
            Net Force: <strong style={{ color: netForceBlock === 0 ? "#10b981" : "#f59e0b" }}>{netForceBlock.toFixed(1)} N</strong>
            {netForceBlock === 0 ? " (Balanced - Static Friction)" : netForceBlock > 0 ? " (Unbalanced - Moving Right)" : " (Unbalanced - Moving Left)"}
          </div>

          <div className={styles.sliderGroup}>
            <label className={styles.sliderLabel}>
              Push Left (→): <strong style={{ color: "#6366f1" }}>{pushLeft} N</strong>
              <input type="range" min={0} max={100} value={pushLeft} onChange={(e) => setPushLeft(Number(e.target.value))} className={styles.slider} style={{ accentColor: "#6366f1" }} />
            </label>
            <label className={styles.sliderLabel}>
              Push Right (←): <strong style={{ color: "#ef4444" }}>{pushRight} N</strong>
              <input type="range" min={0} max={100} value={pushRight} onChange={(e) => setPushRight(Number(e.target.value))} className={styles.slider} style={{ accentColor: "#ef4444" }} />
            </label>
            <label className={styles.sliderLabel}>
              Max Friction Threshold: <strong style={{ color: "#94a3b8" }}>{frictionCoefficient} N</strong>
              <input type="range" min={0} max={60} value={frictionCoefficient} onChange={(e) => setFrictionCoefficient(Number(e.target.value))} className={styles.slider} style={{ accentColor: "#94a3b8" }} />
            </label>
          </div>

          <div className={styles.simControls}>
            <button className={styles.simBtn} onClick={() => { setIsAnimatingBlock(!isAnimatingBlock); }} disabled={netForceBlock === 0 && !isAnimatingBlock}>
              {isAnimatingBlock ? "⏸ Pause" : "▶ Start Simulation"}
            </button>
            <button className={`${styles.simBtn} ${styles.simBtnDanger}`} onClick={() => { setBlockX(150); setIsAnimatingBlock(false); }}>
              ↺ Reset Block
            </button>
          </div>
        </div>
      )}

      {/* Vector Sandbox */}
      {activeTab === 2 && (
        <div>
          <div className={styles.tugWarArena} style={{ minHeight: "100px", justifyContent: "center", flexDirection: "column" }}>
            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
              {/* Force Vector 1 */}
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ color: "#6366f1" }}>Vector 1 (Blue):</span>
                <strong>{v1} N {v1Dir > 0 ? "Right (→)" : "Left (←)"}</strong>
              </div>
              {/* Force Vector 2 */}
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ color: "#ef4444" }}>Vector 2 (Red):</span>
                <strong>{v2} N {v2Dir > 0 ? "Right (→)" : "Left (←)"}</strong>
              </div>
            </div>

            {/* Resultant */}
            <div style={{ marginTop: "16px", fontSize: "1rem", color: "#34d399" }}>
              Resultant Vector: <strong>{Math.abs(resultant)} N {resultant === 0 ? "None" : resultant > 0 ? "Right (→)" : "Left (←)"}</strong>
            </div>

            {/* Vector visualizer */}
            <div style={{ width: "100%", height: "40px", position: "relative", marginTop: "12px", background: "rgba(255,255,255,0.05)", borderRadius: "6px" }}>
              {/* Center point */}
              <div style={{ position: "absolute", left: "50%", top: "50%", width: "6px", height: "6px", background: "#ffffff", borderRadius: "50%", transform: "translate(-50%, -50%)", zIndex: 10 }} />
              
              {/* V1 Arrow */}
              <div style={{
                position: "absolute",
                top: "50%",
                left: v1Dir > 0 ? "50%" : `calc(50% - ${v1}px)`,
                width: `${v1}px`,
                height: "3px",
                background: "#6366f1",
                transform: "translateY(-50%)"
              }}>
                <div style={{ position: "absolute", right: v1Dir > 0 ? "0" : "auto", left: v1Dir < 0 ? "0" : "auto", top: "-5px", color: "#6366f1", fontSize: "0.6rem" }}>{v1Dir > 0 ? "▶" : "◀"}</div>
              </div>

              {/* V2 Arrow */}
              <div style={{
                position: "absolute",
                top: "50%",
                left: v2Dir > 0 ? "50%" : `calc(50% - ${v2}px)`,
                width: `${v2}px`,
                height: "3px",
                background: "#ef4444",
                transform: "translateY(-50%)"
              }}>
                <div style={{ position: "absolute", right: v2Dir > 0 ? "0" : "auto", left: v2Dir < 0 ? "0" : "auto", top: "-5px", color: "#ef4444", fontSize: "0.6rem" }}>{v2Dir > 0 ? "▶" : "◀"}</div>
              </div>

              {/* Resultant arrow */}
              {resultant !== 0 && (
                <div style={{
                  position: "absolute",
                  top: "20%",
                  left: resultant > 0 ? "50%" : `calc(50% - ${Math.abs(resultant)}px)`,
                  width: `${Math.abs(resultant)}px`,
                  height: "4px",
                  background: "#10b981",
                  transform: "translateY(-50%)"
                }}>
                  <div style={{ position: "absolute", right: resultant > 0 ? "0" : "auto", left: resultant < 0 ? "0" : "auto", top: "-5px", color: "#10b981", fontSize: "0.7rem" }}>{resultant > 0 ? "▶" : "◀"}</div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.sliderGroup}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <label className={styles.sliderLabel}>
                  V1 Magnitude: <strong style={{ color: "#6366f1" }}>{v1} N</strong>
                  <input type="range" min={0} max={120} value={v1} onChange={(e) => setV1(Number(e.target.value))} className={styles.slider} style={{ accentColor: "#6366f1" }} />
                </label>
              </div>
              <button className={styles.simBtn} onClick={() => setV1Dir(prev => -prev)}>
                Flip V1 ({v1Dir > 0 ? "→" : "←"})
              </button>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <label className={styles.sliderLabel}>
                  V2 Magnitude: <strong style={{ color: "#ef4444" }}>{v2} N</strong>
                  <input type="range" min={0} max={120} value={v2} onChange={(e) => setV2(Number(e.target.value))} className={styles.slider} style={{ accentColor: "#ef4444" }} />
                </label>
              </div>
              <button className={styles.simBtn} onClick={() => setV2Dir(prev => -prev)}>
                Flip V2 ({v2Dir > 0 ? "→" : "←"})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
 * 2. NEWTON'S FIRST LAW (INERTIA)
 * ═══════════════════════════════════════════════════════ */
export function InertiaSimulation() {
  const [activeTab, setActiveTab] = useState(0);

  // Simulation 1: Frictionless Ice Arena
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
      if (hasFriction) {
        currentSpeed = Math.max(0, currentSpeed - 0.04);
      }
      pos += currentSpeed;
      posRef.current = pos;
      setBallPos(pos);
      setSpeed(currentSpeed);

      if (pos > 320 || currentSpeed <= 0) {
        stop();
        return;
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isMoving, hasFriction, stop]);

  // Simulation 2: Coin & Card
  const [flickForce, setFlickForce] = useState(70); // 0 to 100
  const [flicked, setFlicked] = useState(false);
  const [cardTranslateX, setCardTranslateX] = useState(0);
  const [coinOffsetY, setCoinOffsetY] = useState(0);
  const [coinOffsetX, setCoinOffsetX] = useState(0);
  const [coinMessage, setCoinMessage] = useState("Place the coin on the card.");

  const flickCard = () => {
    setFlicked(true);
    if (flickForce >= 50) {
      // High Force: Card flies out, coin falls in cup
      setCardTranslateX(200);
      setCoinMessage("Flick was fast! Card flies off, coin falls straight down due to its Inertia of Rest!");
      setTimeout(() => {
        setCoinOffsetY(60); // Falls into cup
      }, 300);
    } else {
      // Low Force: Coin moves with card due to friction
      setCardTranslateX(100);
      setCoinOffsetX(100);
      setCoinMessage("Flick was too slow! Friction holds the coin, and it moves with the card.");
      setTimeout(() => {
        setCoinOffsetY(60); // Falls off cup edge
        setCoinOffsetX(120);
      }, 400);
    }
  };

  const resetCoin = () => {
    setFlicked(false);
    setCardTranslateX(0);
    setCoinOffsetY(0);
    setCoinOffsetX(0);
    setCoinMessage("Placed coin on card. Ready to flick!");
  };

  // Simulation 3: Sudden Braking Bus
  const [busState, setBusState] = useState<"idle" | "accelerating" | "braking">("idle");
  const [passengerTilt, setPassengerTilt] = useState(0); // tilt angle in degrees
  const [busX, setBusX] = useState(30);

  const startBus = () => {
    setBusState("accelerating");
    setPassengerTilt(-20); // lurch backward
    // Animate bus moving
    let currentX = busX;
    const drive = setInterval(() => {
      currentX += 4;
      setBusX(currentX);
      if (currentX >= 180) {
        clearInterval(drive);
      }
    }, 30);
  };

  const brakeBus = () => {
    setBusState("braking");
    setPassengerTilt(35); // fall forward due to inertia of motion!
    setTimeout(() => {
      setPassengerTilt(0);
      setBusState("idle");
    }, 1500);
  };

  const resetBus = () => {
    setBusX(30);
    setPassengerTilt(0);
    setBusState("idle");
  };

  return (
    <div className={styles.simCard}>
      <div className={styles.simTitle}>
        <span className={styles.simIcon}>🔬</span>
        Topic 2: Newton&apos;s 1st Law (Inertia) Sandbox
      </div>
      <p className={styles.simDesc}>
        Experiment with Inertia of Rest and Motion. Choose a simulation:
      </p>

      <SimTabs
        tabs={["Frictionless Ice", "Coin & Card Trick", "Sudden Braking Bus"]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Frictionless Ice */}
      {activeTab === 0 && (
        <div>
          <div className={styles.inertiaTrack}>
            <div className={styles.trackSurface} style={{ background: hasFriction ? "rgba(239,68,68,0.15)" : "rgba(99,102,241,0.1)" }}>
              <div
                className={styles.ball}
                style={{ left: `${Math.min(ballPos, 300)}px` }}
              >
                ⚽
              </div>
              <div className={styles.trackLabel}>
                {hasFriction ? "🔴 Friction Surface" : "🔵 Frictionless Ice Surface"}
              </div>
            </div>
            <div className={styles.speedometer}>
              Speed: <strong style={{ color: speed > 1 ? "#10b981" : "#ef4444" }}>{speed.toFixed(1)} m/s</strong>
            </div>
          </div>

          <div className={styles.simControls}>
            <button className={styles.simBtn} onClick={launch} disabled={isMoving}>
              🚀 Launch Ball
            </button>
            <button
              className={`${styles.simBtn} ${hasFriction ? styles.simBtnDanger : styles.simBtnSuccess}`}
              onClick={() => setHasFriction(!hasFriction)}
              disabled={isMoving}
            >
              {hasFriction ? "Remove Friction (Make Ice)" : "Add Friction"}
            </button>
          </div>
        </div>
      )}

      {/* Coin & Card */}
      {activeTab === 1 && (
        <div>
          <div className={styles.coinCupArena}>
            {/* Card */}
            <div
              className={styles.card}
              style={{ transform: `translateX(${cardTranslateX}px)` }}
            />
            {/* Coin */}
            <div
              className={styles.coin}
              style={{
                transform: `translateX(${coinOffsetX}px) translateY(${coinOffsetY}px)`
              }}
            >
              🪙
            </div>
            {/* Cup */}
            <div className={styles.cup} />
          </div>

          <div style={{ textAlign: "center", fontSize: "0.8rem", color: "#e2e8f0", margin: "8px 0" }}>
            {coinMessage}
          </div>

          <div className={styles.sliderGroup}>
            <label className={styles.sliderLabel}>
              Flicking Force: <strong style={{ color: flickForce >= 50 ? "#10b981" : "#ef4444" }}>{flickForce} % ({flickForce >= 50 ? "FAST" : "SLOW"})</strong>
              <input type="range" min={10} max={100} value={flickForce} onChange={(e) => setFlickForce(Number(e.target.value))} className={styles.slider} style={{ accentColor: "#f59e0b" }} disabled={flicked} />
            </label>
          </div>

          <div className={styles.simControls}>
            <button className={styles.simBtn} onClick={flickCard} disabled={flicked}>
              💥 Flick Card
            </button>
            <button className={`${styles.simBtn} ${styles.simBtnDanger}`} onClick={resetCoin}>
              ↺ Reset
            </button>
          </div>
        </div>
      )}

      {/* Sudden Braking Bus */}
      {activeTab === 2 && (
        <div>
          <div className={styles.busArena}>
            <div className={styles.busTable} />
            
            <div className={styles.busBody} style={{ left: `${busX}px` }}>
              <div className={styles.passenger} style={{ transform: `rotate(${passengerTilt}deg)` }}>
                🧍
              </div>
              <div className={styles.busWheels}>
                <div className={styles.wheel} />
                <div className={styles.wheel} />
              </div>
              <div style={{ position: "absolute", top: "4px", fontSize: "0.6rem", color: "#ffffff", fontWeight: "bold" }}>SCHOOL BUS</div>
            </div>
          </div>

          <div style={{ textAlign: "center", fontSize: "0.8rem", color: "#e2e8f0", margin: "8px 0" }}>
            Status: <strong>{busState === "idle" ? "Stationary (Rest)" : busState === "accelerating" ? "Moving Forward (Inertia pulls passenger backward)" : "Brakes Applied! (Inertia of motion hurls passenger forward)"}</strong>
          </div>

          <div className={styles.simControls}>
            <button className={styles.simBtn} onClick={startBus} disabled={busState !== "idle" || busX > 150}>
              ⚡ Accelerate Bus
            </button>
            <button className={`${styles.simBtn} ${styles.simBtnDanger}`} onClick={brakeBus} disabled={busState !== "accelerating"}>
              🛑 Apply Sudden Brakes
            </button>
            <button className={styles.simBtn} onClick={resetBus}>
              ↺ Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
 * 3. NEWTON'S SECOND LAW (F = ma)
 * ═══════════════════════════════════════════════════════ */
export function FmaSimulation() {
  const [activeTab, setActiveTab] = useState(0);

  // Simulation 1: F=ma Calculator
  const [force, setForce] = useState(10);
  const [mass, setMass] = useState(2);
  const acceleration = (force / mass).toFixed(2);
  const boxSize = Math.max(35, Math.min(75, mass * 4 + 30));
  const arrowWidth = Math.min(200, force * 4 + 20);

  // Simulation 2: Racetrack
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
      const x1 = 0.5 * a1 * 2000 * (t * t);
      const x2 = 0.5 * a2 * 2000 * (t * t);

      setCar1Pos(Math.min(280, x1));
      setCar2Pos(Math.min(280, x2));

      if (x1 >= 280 || x2 >= 280) {
        clearInterval(interval);
        setIsRacing(false);
        if (x1 > x2) {
          setRaceWinner("Car A wins! (Higher force-to-mass ratio yields greater acceleration)");
        } else if (x2 > x1) {
          setRaceWinner("Car B wins! (Lower mass offers less inertia, accelerating faster)");
        } else {
          setRaceWinner("It's a tie! Both have identical acceleration.");
        }
      }
    }, 40);
  };

  // Simulation 3: Atwood Machine (Pulley)
  const [leftMass, setLeftMass] = useState(3); // kg
  const [rightMass, setRightMass] = useState(5); // kg
  const [leftY, setLeftY] = useState(70); // px from top
  const [rightY, setRightY] = useState(70);
  const [isReleased, setIsReleased] = useState(false);
  
  const g = 9.8;
  const netM = Math.abs(rightMass - leftMass);
  const totalM = leftMass + rightMass;
  const atwoodAcc = (g * netM) / totalM;

  const releasePulley = () => {
    setIsReleased(true);
    let lPos = 70;
    let rPos = 70;
    let speed = 0;
    const direction = rightMass > leftMass ? 1 : leftMass > rightMass ? -1 : 0;

    if (direction === 0) {
      setIsReleased(false);
      return;
    }

    const pulleyTimer = setInterval(() => {
      speed += atwoodAcc * 0.15; // v = u + at
      lPos -= speed * direction;
      rPos += speed * direction;

      // boundaries
      if (lPos < 20 || lPos > 120) {
        clearInterval(pulleyTimer);
        setIsReleased(false);
        return;
      }

      setLeftY(lPos);
      setRightY(rPos);
    }, 50);
  };

  const resetPulley = () => {
    setLeftY(70);
    setRightY(70);
    setIsReleased(false);
  };

  return (
    <div className={styles.simCard}>
      <div className={styles.simTitle}>
        <span className={styles.simIcon}>📐</span>
        Topic 3: Newton&apos;s 2nd Law (F=ma) Sandbox
      </div>
      <p className={styles.simDesc}>
        Discover the relationship between force, mass, and acceleration. Choose a simulation:
      </p>

      <SimTabs
        tabs={["F=ma Calculator", "Racetrack", "Atwood Pulley Machine"]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* F=ma Calculator */}
      {activeTab === 0 && (
        <div>
          <div className={styles.fmaArena}>
            {/* Force arrow */}
            <div className={styles.forceArrow} style={{ width: `${arrowWidth}px` }}>
              <div className={styles.arrowShaft} />
              <div className={styles.arrowHead}>▶</div>
              <span className={styles.arrowLabel}>{force} N</span>
            </div>

            {/* The box (mass) */}
            <div
              className={styles.massBox}
              style={{ width: `${boxSize}px`, height: `${boxSize}px` }}
            >
              <span className={styles.massLabel}>{mass} kg</span>
            </div>

            {/* Result */}
            <div className={styles.resultPanel}>
              <div className={styles.resultFormula}>
                a = F ÷ m = {force} ÷ {mass} = <strong style={{ color: "#10b981", fontSize: "1.2em" }}>{acceleration} m/s²</strong>
              </div>
            </div>
          </div>

          <div className={styles.sliderGroup}>
            <label className={styles.sliderLabel}>
              Force (F): <strong style={{ color: "#6366f1" }}>{force} N</strong>
              <input type="range" min={1} max={50} value={force}
                onChange={(e) => setForce(Number(e.target.value))}
                className={styles.slider} style={{ accentColor: "#6366f1" }} />
            </label>
            <label className={styles.sliderLabel}>
              Mass (m): <strong style={{ color: "#f59e0b" }}>{mass} kg</strong>
              <input type="range" min={1} max={20} value={mass}
                onChange={(e) => setMass(Number(e.target.value))}
                className={styles.slider} style={{ accentColor: "#f59e0b" }} />
            </label>
          </div>
        </div>
      )}

      {/* Racetrack */}
      {activeTab === 1 && (
        <div>
          <div className={styles.racetrackArena}>
            {/* Car 1 */}
            <div className={styles.raceLane}>
              <div className={styles.laneIndicator}>Car A (F={force1}N, m={mass1}kg)</div>
              <div className={styles.raceCar} style={{ left: `${car1Pos}px` }}>🟢🏎️</div>
            </div>

            {/* Car 2 */}
            <div className={styles.raceLane}>
              <div className={styles.laneIndicator}>Car B (F={force2}N, m={mass2}kg)</div>
              <div className={styles.raceCar} style={{ left: `${car2Pos}px` }}>🟡🏎️</div>
            </div>
          </div>

          {raceWinner && (
            <div style={{ textAlign: "center", fontSize: "0.8rem", color: "#10b981", margin: "12px 0", fontWeight: "bold" }}>
              🏁 {raceWinner}
            </div>
          )}

          <div className={styles.sliderGroup}>
            <div style={{ display: "flex", gap: "20px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.8rem", color: "#6366f1", fontWeight: "bold", marginBottom: "4px" }}>Car A Options:</div>
                <label className={styles.sliderLabel}>
                  Force: <strong>{force1} N</strong>
                  <input type="range" min={10} max={100} value={force1} onChange={(e) => setForce1(Number(e.target.value))} className={styles.slider} style={{ accentColor: "#6366f1" }} disabled={isRacing} />
                </label>
                <label className={styles.sliderLabel}>
                  Mass: <strong>{mass1} kg</strong>
                  <input type="range" min={200} max={1500} value={mass1} onChange={(e) => setMass1(Number(e.target.value))} className={styles.slider} style={{ accentColor: "#6366f1" }} disabled={isRacing} />
                </label>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.8rem", color: "#ef4444", fontWeight: "bold", marginBottom: "4px" }}>Car B Options:</div>
                <label className={styles.sliderLabel}>
                  Force: <strong>{force2} N</strong>
                  <input type="range" min={10} max={100} value={force2} onChange={(e) => setForce2(Number(e.target.value))} className={styles.slider} style={{ accentColor: "#ef4444" }} disabled={isRacing} />
                </label>
                <label className={styles.sliderLabel}>
                  Mass: <strong>{mass2} kg</strong>
                  <input type="range" min={200} max={1500} value={mass2} onChange={(e) => setMass2(Number(e.target.value))} className={styles.slider} style={{ accentColor: "#ef4444" }} disabled={isRacing} />
                </label>
              </div>
            </div>
          </div>

          <div className={styles.simControls}>
            <button className={styles.simBtn} onClick={startRace} disabled={isRacing}>
              🏁 Start Race!
            </button>
            <button className={`${styles.simBtn} ${styles.simBtnDanger}`} onClick={() => { setCar1Pos(0); setCar2Pos(0); setRaceWinner(""); }} disabled={isRacing}>
              ↺ Reset Track
            </button>
          </div>
        </div>
      )}

      {/* Atwood Machine */}
      {activeTab === 2 && (
        <div>
          <div className={styles.atwoodArena}>
            <div className={styles.pulleySupport} />
            <div className={styles.pulleyWheel}>
              <div style={{ position: "absolute", top: "50%", left: "50%", width: "8px", height: "8px", background: "#ffffff", borderRadius: "50%", transform: "translate(-50%, -50%)" }} />
            </div>

            {/* Left string */}
            <div className={styles.atwoodString} style={{ left: "calc(50% - 20px)", height: `${leftY}px` }} />
            {/* Right string */}
            <div className={styles.atwoodString} style={{ left: "calc(50% + 18px)", height: `${rightY}px` }} />

            {/* Left mass */}
            <div className={styles.atwoodMass} style={{ left: "calc(50% - 38px)", top: `${leftY + 34}px` }}>
              {leftMass} kg
            </div>

            {/* Right mass */}
            <div className={styles.atwoodMass} style={{ left: "calc(50% + 1px)", top: `${rightY + 34}px`, borderColor: "#ef4444", color: "#fca5a5" }}>
              {rightMass} kg
            </div>
          </div>

          <div style={{ textAlign: "center", fontSize: "0.8rem", color: "#e2e8f0", margin: "8px 0" }}>
            Acceleration: <strong style={{ color: "#34d399" }}>{atwoodAcc.toFixed(2)} m/s²</strong>
          </div>

          <div className={styles.sliderGroup}>
            <div style={{ display: "flex", gap: "20px" }}>
              <label className={styles.sliderLabel} style={{ flex: 1 }}>
                Left Mass (m1): <strong style={{ color: "#f59e0b" }}>{leftMass} kg</strong>
                <input type="range" min={1} max={10} value={leftMass} onChange={(e) => { setLeftMass(Number(e.target.value)); resetPulley(); }} className={styles.slider} style={{ accentColor: "#f59e0b" }} disabled={isReleased} />
              </label>
              <label className={styles.sliderLabel} style={{ flex: 1 }}>
                Right Mass (m2): <strong style={{ color: "#ef4444" }}>{rightMass} kg</strong>
                <input type="range" min={1} max={10} value={rightMass} onChange={(e) => { setRightMass(Number(e.target.value)); resetPulley(); }} className={styles.slider} style={{ accentColor: "#ef4444" }} disabled={isReleased} />
              </label>
            </div>
          </div>

          <div className={styles.simControls}>
            <button className={styles.simBtn} onClick={releasePulley} disabled={isReleased || leftMass === rightMass}>
              🔓 Release
            </button>
            <button className={`${styles.simBtn} ${styles.simBtnDanger}`} onClick={resetPulley}>
              ↺ Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
 * 4. NEWTON'S THIRD LAW (ACTION & REACTION)
 * ═══════════════════════════════════════════════════════ */
export function ActionReactionSimulation() {
  const [activeTab, setActiveTab] = useState(0);

  // Simulation 1: Rocket Launch
  const [thrust, setThrust] = useState(50);
  const [launched, setLaunched] = useState(false);
  const [rocketY, setRocketY] = useState(0);
  const animRef = useRef<number | null>(null);
  const posRef = useRef(0);

  const launchRocket = () => {
    posRef.current = 0;
    setRocketY(0);
    setLaunched(true);
  };

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [launched, thrust]);

  // Simulation 2: Skateboard Push
  const [massA, setMassA] = useState(50);
  const [massB, setMassB] = useState(75);
  const [pushForce, setPushForce] = useState(150);
  const [isSkating, setIsSkating] = useState(false);
  const [skaterAPos, setSkaterAPos] = useState(120);
  const [skaterBPos, setSkaterBPos] = useState(180);

  // Velocities after push (V = F * t / m)
  const velA = (pushForce / massA) * 0.5;
  const velB = (pushForce / massB) * 0.5;

  const pushOff = () => {
    setIsSkating(true);
    let t = 0;
    const skate = setInterval(() => {
      t += 0.05;
      setSkaterAPos((prev) => Math.max(10, prev - velA * 1.5));
      setSkaterBPos((prev) => Math.min(300, prev + velB * 1.5));
      if (t >= 2.0) {
        clearInterval(skate);
      }
    }, 45);
  };

  const resetSkates = () => {
    setIsSkating(false);
    setSkaterAPos(120);
    setSkaterBPos(180);
  };

  // Simulation 3: Gun Recoil
  const [bulletM, setBulletM] = useState(20); // grams
  const [gunM, setGunM] = useState(4); // kg
  const [isFired, setIsFired] = useState(false);
  const [recoilX, setRecoilX] = useState(0);
  const [bulletX, setBulletX] = useState(0);

  const mBulletKg = bulletM / 1000;
  const vBullet = 350; // m/s muzzle velocity
  const vRecoil = (mBulletKg * vBullet) / gunM; // m1v1 = -m2v2

  const fireGun = () => {
    setIsFired(true);
    let t = 0;
    const shot = setInterval(() => {
      t += 0.05;
      // Gun moves left slightly, Bullet shoots right very fast
      setRecoilX(-vRecoil * t * 30); // visual factor
      setBulletX(vBullet * t * 2.5); // visual factor
      if (t >= 0.8) {
        clearInterval(shot);
      }
    }, 40);
  };

  const resetGun = () => {
    setIsFired(false);
    setRecoilX(0);
    setBulletX(0);
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
        tabs={["Rocket Launch", "Skateboard Push", "Recoil of Gun"]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Rocket Launch */}
      {activeTab === 0 && (
        <div>
          <div className={styles.rocketArena}>
            <div className={styles.rocketContainer} style={{ bottom: `${rocketY}px` }}>
              <div className={styles.reactionLabel}>↑ Reaction on Rocket</div>
              <div className={styles.rocket}>🚀</div>
              <div className={styles.exhaustFlame} style={{ opacity: launched ? 1 : 0.3, fontSize: `${thrust / 20}em` }}>🔥</div>
              <div className={styles.actionLabel}>↓ Action: Gas pushed down</div>
            </div>
          </div>

          <div className={styles.sliderGroup}>
            <label className={styles.sliderLabel}>
              Thrust: <strong style={{ color: "#f59e0b" }}>{thrust} N</strong>
              <input type="range" min={10} max={100} value={thrust}
                onChange={(e) => { setThrust(Number(e.target.value)); }}
                className={styles.slider} style={{ accentColor: "#f59e0b" }}
                disabled={launched} />
            </label>
          </div>

          <div className={styles.simControls}>
            <button className={styles.simBtn} onClick={launchRocket} disabled={launched}>
              🚀 Launch Rocket
            </button>
            <button className={`${styles.simBtn} ${styles.simBtnDanger}`} onClick={resetRocket}>
              ↺ Reset
            </button>
          </div>
        </div>
      )}

      {/* Skateboard Push */}
      {activeTab === 1 && (
        <div>
          <div className={styles.skaterArena}>
            <div className={styles.skaterTrack} />

            {/* Skater A */}
            <div className={styles.skateboarder} style={{ left: `${skaterAPos}px` }}>
              <span className={styles.skaterEmoji}>🛹🧑‍🦱</span>
              <span className={styles.skaterMassLabel}>{massA} kg</span>
            </div>

            {/* Skater B */}
            <div className={styles.skateboarder} style={{ left: `${skaterBPos}px` }}>
              <span className={styles.skaterEmoji} style={{ transform: "scaleX(-1)" }}>🛹🧑‍🦰</span>
              <span className={styles.skaterMassLabel}>{massB} kg</span>
            </div>
          </div>

          <div style={{ textAlign: "center", fontSize: "0.8rem", color: "#e2e8f0", margin: "8px 0" }}>
            Velocities: <span style={{ color: "#6366f1" }}>A: -{velA.toFixed(1)} m/s</span> | <span style={{ color: "#ef4444" }}>B: +{velB.toFixed(1)} m/s</span>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px" }}>
              Action = Reaction force ({pushForce}N). Heavier skater moves slower.
            </div>
          </div>

          <div className={styles.sliderGroup}>
            <div style={{ display: "flex", gap: "20px" }}>
              <label className={styles.sliderLabel} style={{ flex: 1 }}>
                Skater A Mass: <strong>{massA} kg</strong>
                <input type="range" min={30} max={100} value={massA} onChange={(e) => { setMassA(Number(e.target.value)); resetSkates(); }} className={styles.slider} style={{ accentColor: "#6366f1" }} disabled={isSkating} />
              </label>
              <label className={styles.sliderLabel} style={{ flex: 1 }}>
                Skater B Mass: <strong>{massB} kg</strong>
                <input type="range" min={30} max={100} value={massB} onChange={(e) => { setMassB(Number(e.target.value)); resetSkates(); }} className={styles.slider} style={{ accentColor: "#ef4444" }} disabled={isSkating} />
              </label>
            </div>
            <label className={styles.sliderLabel}>
              Push Force: <strong>{pushForce} N</strong>
              <input type="range" min={50} max={300} value={pushForce} onChange={(e) => { setPushForce(Number(e.target.value)); resetSkates(); }} className={styles.slider} style={{ accentColor: "#f59e0b" }} disabled={isSkating} />
            </label>
          </div>

          <div className={styles.simControls}>
            <button className={styles.simBtn} onClick={pushOff} disabled={isSkating}>
              👐 Push Off!
            </button>
            <button className={`${styles.simBtn} ${styles.simBtnDanger}`} onClick={resetSkates}>
              ↺ Reset
            </button>
          </div>
        </div>
      )}

      {/* Recoil of Gun */}
      {activeTab === 2 && (
        <div>
          <div className={styles.gunArena}>
            {/* The Gun */}
            <div className={styles.gunElement} style={{ transform: `translateX(${recoilX}px)` }}>
              🔫
            </div>
            {/* The Bullet */}
            {isFired && (
              <div className={styles.bulletElement} style={{ left: `calc(30% + 45px + ${bulletX}px)` }}>
                🟡
              </div>
            )}

            <div style={{ position: "absolute", right: "20px", bottom: "10px", fontSize: "0.7rem", color: "#94a3b8" }}>
              Action: Bullet flies right ({vBullet} m/s) <br />
              Reaction: Gun recoils left (-{vRecoil.toFixed(2)} m/s)
            </div>
          </div>

          <div className={styles.sliderGroup}>
            <div style={{ display: "flex", gap: "20px" }}>
              <label className={styles.sliderLabel} style={{ flex: 1 }}>
                Bullet Mass: <strong>{bulletM} grams</strong>
                <input type="range" min={5} max={50} value={bulletM} onChange={(e) => { setBulletM(Number(e.target.value)); resetGun(); }} className={styles.slider} style={{ accentColor: "#f59e0b" }} disabled={isFired} />
              </label>
              <label className={styles.sliderLabel} style={{ flex: 1 }}>
                Rifle Mass: <strong>{gunM} kg</strong>
                <input type="range" min={2} max={10} value={gunM} onChange={(e) => { setGunM(Number(e.target.value)); resetGun(); }} className={styles.slider} style={{ accentColor: "#94a3b8" }} disabled={isFired} />
              </label>
            </div>
          </div>

          <div className={styles.simControls}>
            <button className={styles.simBtn} onClick={fireGun} disabled={isFired}>
              💥 Fire!
            </button>
            <button className={`${styles.simBtn} ${styles.simBtnDanger}`} onClick={resetGun}>
              ↺ Clean & Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
 * 5. CONSERVATION OF MOMENTUM
 * ═══════════════════════════════════════════════════════ */
export function MomentumSimulation() {
  const [activeTab, setActiveTab] = useState(0);

  // Simulation 1: Colliding Spheres
  const [mass1, setMass1] = useState(2);
  const [vel1, setVel1] = useState(4);
  const [mass2, setMass2] = useState(3);
  const [vel2, setVel2] = useState(0);
  const [collided, setCollided] = useState(false);

  const v1After = ((mass1 - mass2) * vel1 + 2 * mass2 * vel2) / (mass1 + mass2);
  const v2After = ((mass2 - mass1) * vel2 + 2 * mass1 * vel1) / (mass1 + mass2);
  const pBefore = mass1 * vel1 + mass2 * vel2;
  const pAfter = mass1 * v1After + mass2 * v2After;

  // Simulation 2: Newton's Cradle
  const [pullCount, setPullCount] = useState(1);
  const [cradleState, setCradleState] = useState<"idle" | "swinging-left" | "impact" | "swinging-right">("idle");
  const [cradleTimer, setCradleTimer] = useState<NodeJS.Timeout | null>(null);

  const triggerCradle = () => {
    if (cradleTimer) clearTimeout(cradleTimer);
    setCradleState("swinging-left");

    // swing animation cycle
    const t1 = setTimeout(() => {
      setCradleState("impact");
      const t2 = setTimeout(() => {
        setCradleState("swinging-right");
        const t3 = setTimeout(() => {
          setCradleState("idle");
        }, 600);
        setCradleTimer(t3);
      }, 100);
      setCradleTimer(t2);
    }, 600);
    setCradleTimer(t1);
  };

  useEffect(() => {
    return () => {
      if (cradleTimer) clearTimeout(cradleTimer);
    };
  }, [cradleTimer]);

  // Simulation 3: Space Docking Recoil
  const [astronautM, setAstronautM] = useState(80); // kg
  const [crateM, setCrateM] = useState(40); // kg
  const [throwSpeed, setThrowSpeed] = useState(4); // m/s relative throw speed
  const [dockState, setDockState] = useState<"ready" | "thrown">("ready");
  const [astroX, setAstroX] = useState(150);
  const [crateX, setCrateX] = useState(190);

  // Astronaut velocity and crate velocity in stationary space frame
  // Total momentum = 0. Astro moves left, Crate moves right.
  // v_crate * m_crate + v_astro * m_astro = 0
  // v_crate - v_astro = throwSpeed => v_astro = - (throwSpeed * m_crate) / (m_astro + m_crate)
  const vAstro = - (throwSpeed * crateM) / (astronautM + crateM);
  const vCrate = throwSpeed + vAstro;

  const launchDocking = () => {
    setDockState("thrown");
    let t = 0;
    const timer = setInterval(() => {
      t += 0.1;
      setAstroX((prev) => Math.max(10, prev + vAstro * 5));
      setCrateX((prev) => Math.min(320, prev + vCrate * 5));
      if (t >= 3.0) {
        clearInterval(timer);
      }
    }, 50);
  };

  const resetDocking = () => {
    setDockState("ready");
    setAstroX(150);
    setCrateX(190);
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
        tabs={["Colliding Spheres", "Newton's Cradle", "Space Recoil"]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Colliding Spheres */}
      {activeTab === 0 && (
        <div>
          <div className={styles.collisionArena}>
            {/* Before collision */}
            <div className={styles.collisionState}>
              <div className={styles.stateLabel}>Before Collision</div>
              <div className={styles.ballRow}>
                <div className={styles.collBall} style={{ width: `${25 + mass1 * 6}px`, height: `${25 + mass1 * 6}px`, background: "#6366f1" }}>
                  {mass1}kg
                  <span className={styles.velLabel}>→{vel1}m/s</span>
                </div>
                <div className={styles.collBall} style={{ width: `${25 + mass2 * 6}px`, height: `${25 + mass2 * 6}px`, background: "#ef4444" }}>
                  {mass2}kg
                  <span className={styles.velLabel}>{vel2 === 0 ? "at rest" : `→${vel2}m/s`}</span>
                </div>
              </div>
              <div className={styles.momentumTag}>Total Momentum before: <strong>{pBefore.toFixed(1)} kg·m/s</strong></div>
            </div>

            <button className={styles.collideBtn} onClick={() => setCollided(!collided)}>
              {collided ? "↺ Reset" : "💥 Collide!"}
            </button>

            {/* After collision */}
            {collided && (
              <div className={styles.collisionState}>
                <div className={styles.stateLabel}>After Collision</div>
                <div className={styles.ballRow}>
                  <div className={styles.collBall} style={{ width: `${25 + mass1 * 6}px`, height: `${25 + mass1 * 6}px`, background: "#6366f1" }}>
                    {mass1}kg
                    <span className={styles.velLabel}>{v1After > 0 ? "→" : "←"}{Math.abs(v1After).toFixed(1)}m/s</span>
                  </div>
                  <div className={styles.collBall} style={{ width: `${25 + mass2 * 6}px`, height: `${25 + mass2 * 6}px`, background: "#ef4444" }}>
                    {mass2}kg
                    <span className={styles.velLabel}>{v2After > 0 ? "→" : "←"}{Math.abs(v2After).toFixed(1)}m/s</span>
                  </div>
                </div>
                <div className={styles.momentumTag} style={{ color: "#10b981" }}>Total Momentum after: <strong>{pAfter.toFixed(1)} kg·m/s</strong> ✓ Conserved!</div>
              </div>
            )}
          </div>

          <div className={styles.sliderGroup}>
            <label className={styles.sliderLabel}>
              Ball A Mass: <strong style={{ color: "#6366f1" }}>{mass1} kg</strong>
              <input type="range" min={1} max={5} value={mass1} onChange={(e) => { setMass1(Number(e.target.value)); setCollided(false); }} className={styles.slider} style={{ accentColor: "#6366f1" }} />
            </label>
            <label className={styles.sliderLabel}>
              Ball A Velocity: <strong style={{ color: "#6366f1" }}>{vel1} m/s</strong>
              <input type="range" min={1} max={10} value={vel1} onChange={(e) => { setVel1(Number(e.target.value)); setCollided(false); }} className={styles.slider} style={{ accentColor: "#6366f1" }} />
            </label>
            <label className={styles.sliderLabel}>
              Ball B Mass: <strong style={{ color: "#ef4444" }}>{mass2} kg</strong>
              <input type="range" min={1} max={5} value={mass2} onChange={(e) => { setMass2(Number(e.target.value)); setCollided(false); }} className={styles.slider} style={{ accentColor: "#ef4444" }} />
            </label>
          </div>
        </div>
      )}

      {/* Newton's Cradle */}
      {activeTab === 1 && (
        <div>
          <div className={styles.cradleArena}>
            <div className={styles.cradleFrame} />
            
            {/* 5 Balls */}
            {[0, 1, 2, 3, 4].map((i) => {
              // Decide angle based on state
              let rotation = 0;
              if (cradleState === "swinging-left") {
                // Ball i swings left if it's within the pullCount
                if (i < pullCount) {
                  rotation = -35;
                }
              } else if (cradleState === "swinging-right") {
                // Ball i swings right if it's on the opposite side
                if (i >= 5 - pullCount) {
                  rotation = 35;
                }
              }

              return (
                <div
                  key={i}
                  className={styles.cradlePendant}
                  style={{
                    transform: `rotate(${rotation}deg)`
                  }}
                >
                  <div className={styles.cradleString} />
                  <div className={styles.cradleBallBody} />
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center", fontSize: "0.8rem", color: "#e2e8f0", margin: "8px 0" }}>
            Number of balls to pull: <strong>{pullCount}</strong>
          </div>

          <div className={styles.simControls}>
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                className={`${styles.simBtn} ${pullCount === num ? styles.simTabActive : ""}`}
                onClick={() => setPullCount(num)}
                disabled={cradleState !== "idle"}
              >
                Pull {num} {num === 1 ? "Ball" : "Balls"}
              </button>
            ))}
            <button className={`${styles.simBtn} ${styles.simBtnSuccess}`} onClick={triggerCradle} disabled={cradleState !== "idle"}>
              ▶ Release Balls
            </button>
          </div>
        </div>
      )}

      {/* Space Recoil */}
      {activeTab === 2 && (
        <div>
          <div className={styles.spaceArena}>
            {/* Astronaut */}
            <div className={styles.astronautBody} style={{ left: `${astroX}px` }}>
              👨‍🚀
              <div style={{ fontSize: "0.55rem", background: "rgba(0,0,0,0.5)", padding: "2px", borderRadius: "3px", textAlign: "center" }}>{astronautM}kg</div>
            </div>
            
            {/* Crate */}
            <div className={styles.crateBody} style={{ left: `${crateX}px` }}>
              📦
              <div style={{ fontSize: "0.55rem", background: "rgba(0,0,0,0.5)", padding: "2px", borderRadius: "3px", textAlign: "center" }}>{crateM}kg</div>
            </div>

            <div style={{ position: "absolute", left: "10px", top: "10px", fontSize: "0.75rem", color: "#34d399" }}>
              Total Momentum: <strong>0.00 kg·m/s (Conserved)</strong>
            </div>
          </div>

          <div style={{ textAlign: "center", fontSize: "0.8rem", color: "#e2e8f0", margin: "8px 0" }}>
            Velocities: <span style={{ color: "#a5b4fc" }}>Astronaut (Recoil): {vAstro.toFixed(2)} m/s</span> | <span style={{ color: "#fcd34d" }}>Crate: {vCrate.toFixed(2)} m/s</span>
          </div>

          <div className={styles.sliderGroup}>
            <div style={{ display: "flex", gap: "20px" }}>
              <label className={styles.sliderLabel} style={{ flex: 1 }}>
                Astronaut Mass: <strong>{astronautM} kg</strong>
                <input type="range" min={50} max={120} value={astronautM} onChange={(e) => { setAstronautM(Number(e.target.value)); resetDocking(); }} className={styles.slider} style={{ accentColor: "#6366f1" }} disabled={dockState === "thrown"} />
              </label>
              <label className={styles.sliderLabel} style={{ flex: 1 }}>
                Crate Mass: <strong>{crateM} kg</strong>
                <input type="range" min={10} max={100} value={crateM} onChange={(e) => { setCrateM(Number(e.target.value)); resetDocking(); }} className={styles.slider} style={{ accentColor: "#ef4444" }} disabled={dockState === "thrown"} />
              </label>
            </div>
            <label className={styles.sliderLabel}>
              Throw Speed (Relative): <strong>{throwSpeed} m/s</strong>
              <input type="range" min={2} max={10} value={throwSpeed} onChange={(e) => { setThrowSpeed(Number(e.target.value)); resetDocking(); }} className={styles.slider} style={{ accentColor: "#f59e0b" }} disabled={dockState === "thrown"} />
            </label>
          </div>

          <div className={styles.simControls}>
            <button className={styles.simBtn} onClick={launchDocking} disabled={dockState === "thrown"}>
              🚀 Throw Crate
            </button>
            <button className={`${styles.simBtn} ${styles.simBtnDanger}`} onClick={resetDocking}>
              ↺ Reset Space
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
 * TopicSimulation — picks the right simulation for the topic
 * ───────────────────────────────────────────── */
interface TopicSimulationProps {
  topicId: string;
}

export default function TopicSimulation({ topicId }: TopicSimulationProps) {
  switch (topicId) {
    case "balanced-unbalanced-forces":
      return <BalancedForcesSimulation />;
    case "first-law-of-motion-inertia":
    case "first-law-of-motion":
      return <InertiaSimulation />;
    case "second-law-of-motion":
      return <FmaSimulation />;
    case "third-law-of-motion":
      return <ActionReactionSimulation />;
    case "conservation-of-momentum":
      return <MomentumSimulation />;
    default:
      return null;
  }
}
