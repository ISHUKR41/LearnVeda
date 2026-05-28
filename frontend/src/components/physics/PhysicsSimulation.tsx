/**
 * FILE: PhysicsSimulation.tsx
 * LOCATION: src/components/physics/PhysicsSimulation.tsx
 * PURPOSE: Interactive physics simulations for each Force & Laws of Motion topic.
 *          Each simulation is a self-contained React component with CSS animations
 *          and interactive controls to visualize the physics concept in real-time.
 *
 * TOPICS COVERED:
 *   - BalancedForcesSimulation   → Tug of war with adjustable forces
 *   - InertiaSimulation          → Object continues moving without friction
 *   - FmaSimulation              → F=ma: see how force/mass affect acceleration
 *   - ActionReactionSimulation   → Newton's 3rd Law rocket + gas
 *   - MomentumSimulation         → Elastic/inelastic collision
 *
 * USED BY: DeepResearchChapterClient.tsx, TopicStudyClient.tsx
 * DEPENDENCIES: React (useState, useEffect, useRef)
 * LAST UPDATED: 2026-05-28
 */

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./PhysicsSimulation.module.css";

/* ═══════════════════════════════════════════════════════
 * 1. BALANCED & UNBALANCED FORCES — Tug of War
 * Drag the sliders to control Team A and Team B force.
 * See the net force and rope movement in real-time.
 * ═══════════════════════════════════════════════════════ */
export function BalancedForcesSimulation() {
  const [forceA, setForceA] = useState(100);
  const [forceB, setForceB] = useState(100);
  const netForce = forceA - forceB;
  const ropeOffset = Math.max(-80, Math.min(80, netForce * 0.5));
  const isBalanced = Math.abs(netForce) < 5;

  return (
    <div className={styles.simCard}>
      <div className={styles.simTitle}>
        <span className={styles.simIcon}>⚡</span>
        Interactive: Balanced vs Unbalanced Forces
      </div>
      <p className={styles.simDesc}>
        Adjust the forces of each team. Watch the rope move when forces are unbalanced!
      </p>

      <div className={styles.tugWarArena}>
        {/* Team A */}
        <div className={styles.team} style={{ color: "#6366f1" }}>
          <div className={styles.teamLabel}>Team A</div>
          <div className={styles.teamForce}>{forceA} N →</div>
          <div className={styles.figures}>🏋️🏋️</div>
        </div>

        {/* Rope with flag */}
        <div className={styles.ropeContainer}>
          <div className={styles.rope}>
            <div
              className={styles.ropeFlag}
              style={{
                left: `calc(50% + ${ropeOffset}px)`,
                background: isBalanced ? "#10b981" : netForce > 0 ? "#6366f1" : "#ef4444",
              }}
            />
          </div>
          <div
            className={styles.netForceLabel}
            style={{ color: isBalanced ? "#10b981" : "#f59e0b" }}
          >
            Net Force: {Math.abs(netForce).toFixed(0)} N{" "}
            {isBalanced ? "✓ Balanced" : netForce > 0 ? "→ A winning" : "← B winning"}
          </div>
        </div>

        {/* Team B */}
        <div className={styles.team} style={{ color: "#ef4444" }}>
          <div className={styles.teamLabel}>Team B</div>
          <div className={styles.teamForce}>← {forceB} N</div>
          <div className={styles.figures}>🏋️🏋️</div>
        </div>
      </div>

      <div className={styles.sliderGroup}>
        <label className={styles.sliderLabel}>
          Team A Force: <strong style={{ color: "#6366f1" }}>{forceA} N</strong>
          <input
            type="range" min={0} max={200} value={forceA}
            onChange={(e) => setForceA(Number(e.target.value))}
            className={styles.slider}
            style={{ accentColor: "#6366f1" }}
          />
        </label>
        <label className={styles.sliderLabel}>
          Team B Force: <strong style={{ color: "#ef4444" }}>{forceB} N</strong>
          <input
            type="range" min={0} max={200} value={forceB}
            onChange={(e) => setForceB(Number(e.target.value))}
            className={styles.slider}
            style={{ accentColor: "#ef4444" }}
          />
        </label>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
 * 2. NEWTON'S FIRST LAW — Inertia Simulation
 * Press Launch to send the ball. Toggle friction to see
 * how inertia keeps it going on a frictionless surface.
 * ═══════════════════════════════════════════════════════ */
export function InertiaSimulation() {
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
      /* Friction reduces speed over time; no friction → constant speed */
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

  return (
    <div className={styles.simCard}>
      <div className={styles.simTitle}>
        <span className={styles.simIcon}>🔬</span>
        Newton&apos;s 1st Law: Inertia in Action
      </div>
      <p className={styles.simDesc}>
        Toggle friction and launch the ball. On a frictionless surface, it never stops!
      </p>

      <div className={styles.inertiaTrack}>
        <div className={styles.trackSurface} style={{ background: hasFriction ? "rgba(239,68,68,0.15)" : "rgba(99,102,241,0.1)" }}>
          <div
            className={styles.ball}
            style={{ left: `${Math.min(ballPos, 300)}px` }}
          >
            ⚽
          </div>
          <div className={styles.trackLabel}>
            {hasFriction ? "🔴 Friction Surface" : "🔵 Frictionless Surface"}
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
          {hasFriction ? "Remove Friction" : "Add Friction"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
 * 3. NEWTON'S SECOND LAW — F = ma Calculator
 * Adjust Force and Mass to see how acceleration changes.
 * Visual: a box being pushed harder/lighter on a surface.
 * ═══════════════════════════════════════════════════════ */
export function FmaSimulation() {
  const [force, setForce] = useState(10);
  const [mass, setMass] = useState(2);
  const acceleration = (force / mass).toFixed(2);
  const boxSize = Math.max(30, Math.min(80, mass * 8));
  const arrowWidth = Math.min(200, force * 5);

  return (
    <div className={styles.simCard}>
      <div className={styles.simTitle}>
        <span className={styles.simIcon}>📐</span>
        F = ma: Interactive Calculator
      </div>
      <p className={styles.simDesc}>
        Change Force and Mass to see how acceleration changes. Larger force = more acceleration. Larger mass = less acceleration.
      </p>

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
  );
}

/* ═══════════════════════════════════════════════════════
 * 4. NEWTON'S THIRD LAW — Action & Reaction Pairs
 * Animated rocket with exhaust demonstrating action-reaction.
 * ═══════════════════════════════════════════════════════ */
export function ActionReactionSimulation() {
  const [thrust, setThrust] = useState(50);
  const [launched, setLaunched] = useState(false);
  const [rocketY, setRocketY] = useState(0);
  const animRef = useRef<number | null>(null);
  const posRef = useRef(0);

  const launch = () => {
    posRef.current = 0;
    setRocketY(0);
    setLaunched(true);
  };

  const reset = () => {
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
      if (pos > 150) { reset(); return; }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [launched, thrust]);

  return (
    <div className={styles.simCard}>
      <div className={styles.simTitle}>
        <span className={styles.simIcon}>🚀</span>
        Newton&apos;s 3rd Law: Rocket Launch
      </div>
      <p className={styles.simDesc}>
        The rocket pushes gas <strong>downward</strong> (Action). The gas pushes the rocket <strong>upward</strong> (Reaction). Adjust thrust and watch!
      </p>

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
        <button className={styles.simBtn} onClick={launch} disabled={launched}>
          🚀 Launch
        </button>
        <button className={`${styles.simBtn} ${styles.simBtnDanger}`} onClick={reset}>
          ↺ Reset
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
 * 5. CONSERVATION OF MOMENTUM — Collision Simulation
 * Two balls collide. Total momentum before = after (elastic).
 * ═══════════════════════════════════════════════════════ */
export function MomentumSimulation() {
  const [mass1, setMass1] = useState(2);
  const [vel1, setVel1] = useState(4);
  const [mass2, setMass2] = useState(3);
  const [vel2, setVel2] = useState(0);
  const [collided, setCollided] = useState(false);

  /* Elastic collision formulas */
  const v1After = ((mass1 - mass2) * vel1 + 2 * mass2 * vel2) / (mass1 + mass2);
  const v2After = ((mass2 - mass1) * vel2 + 2 * mass1 * vel1) / (mass1 + mass2);
  const pBefore = mass1 * vel1 + mass2 * vel2;
  const pAfter = mass1 * v1After + mass2 * v2After;

  return (
    <div className={styles.simCard}>
      <div className={styles.simTitle}>
        <span className={styles.simIcon}>💥</span>
        Conservation of Momentum: Elastic Collision
      </div>
      <p className={styles.simDesc}>
        Total momentum before = Total momentum after. Adjust masses and velocities!
      </p>

      <div className={styles.collisionArena}>
        {/* Before collision */}
        <div className={styles.collisionState}>
          <div className={styles.stateLabel}>Before Collision</div>
          <div className={styles.ballRow}>
            <div className={styles.collBall} style={{ width: `${20 + mass1 * 10}px`, height: `${20 + mass1 * 10}px`, background: "#6366f1" }}>
              {mass1}kg
              <span className={styles.velLabel}>→{vel1}m/s</span>
            </div>
            <div className={styles.collBall} style={{ width: `${20 + mass2 * 10}px`, height: `${20 + mass2 * 10}px`, background: "#ef4444" }}>
              {mass2}kg
              <span className={styles.velLabel}>{vel2 === 0 ? "at rest" : `→${vel2}m/s`}</span>
            </div>
          </div>
          <div className={styles.momentumTag}>p = {pBefore.toFixed(1)} kg·m/s</div>
        </div>

        <button className={styles.collideBtn} onClick={() => setCollided(!collided)}>
          {collided ? "↺ Reset" : "💥 Collide!"}
        </button>

        {/* After collision */}
        {collided && (
          <div className={styles.collisionState}>
            <div className={styles.stateLabel}>After Collision</div>
            <div className={styles.ballRow}>
              <div className={styles.collBall} style={{ width: `${20 + mass1 * 10}px`, height: `${20 + mass1 * 10}px`, background: "#6366f1" }}>
                {mass1}kg
                <span className={styles.velLabel}>{v1After > 0 ? "→" : "←"}{Math.abs(v1After).toFixed(1)}m/s</span>
              </div>
              <div className={styles.collBall} style={{ width: `${20 + mass2 * 10}px`, height: `${20 + mass2 * 10}px`, background: "#ef4444" }}>
                {mass2}kg
                <span className={styles.velLabel}>{v2After > 0 ? "→" : "←"}{Math.abs(v2After).toFixed(1)}m/s</span>
              </div>
            </div>
            <div className={styles.momentumTag} style={{ color: "#10b981" }}>p = {pAfter.toFixed(1)} kg·m/s ✓ Conserved!</div>
          </div>
        )}
      </div>

      <div className={styles.sliderGroup}>
        <label className={styles.sliderLabel}>
          Ball 1 Mass: <strong style={{ color: "#6366f1" }}>{mass1} kg</strong>
          <input type="range" min={1} max={5} value={mass1} onChange={(e) => { setMass1(Number(e.target.value)); setCollided(false); }} className={styles.slider} style={{ accentColor: "#6366f1" }} />
        </label>
        <label className={styles.sliderLabel}>
          Ball 1 Velocity: <strong style={{ color: "#6366f1" }}>{vel1} m/s</strong>
          <input type="range" min={1} max={10} value={vel1} onChange={(e) => { setVel1(Number(e.target.value)); setCollided(false); }} className={styles.slider} style={{ accentColor: "#6366f1" }} />
        </label>
        <label className={styles.sliderLabel}>
          Ball 2 Mass: <strong style={{ color: "#ef4444" }}>{mass2} kg</strong>
          <input type="range" min={1} max={5} value={mass2} onChange={(e) => { setMass2(Number(e.target.value)); setCollided(false); }} className={styles.slider} style={{ accentColor: "#ef4444" }} />
        </label>
      </div>
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
