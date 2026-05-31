/**
 * FILE: Topic3.tsx
 * PURPOSE: 15 professional simulations — Topic 3: Newton's Second Law (F = ma).
 *
 * "The acceleration of an object is directly proportional to the net force
 *  acting on it and inversely proportional to its mass."  a = F_net / m
 *
 * Each simulation isolates a different variable to build deep intuition:
 *   — Doubling force → doubling acceleration (same mass)
 *   — Doubling mass → halving acceleration (same force)
 *   — Role of friction in reducing net force
 *   — Extreme cases: micro-mass and macro-mass
 *   — Real-world F=ma: rockets, braking cars, bullets
 */
"use client";
import React from "react";
import SimCanvas from "./engine/SimCanvas";

/* ── 1. F=ma Standard Demo ───────────────────────────────────────────────── */
export function Sim_fma_standard() {
  return (
    <SimCanvas config={{
      title:   "F = ma — Standard Demonstration",
      desc:    "10 kg block, 60 N applied force, wood floor (μ = 0.35). Observe how all three variables interact.",
      concept: "Net force = 60 − (0.35 × 10 × 9.8) = 60 − 34.3 = 25.7 N. a = 25.7 / 10 = 2.57 m/s². This is F = ma working live. Change the force with the slider to see a change instantly.",
      mode: "force", env: "wood",
      mass: 10, initForceLeft: 0, initForceRight: 60,
      allowForceChange: true, allowMassChange: true, maxForce: 200,
      blockColor: ["#4f46e5", "#7c3aed"],
    }} />
  );
}

/* ── 2. Double Mass — Half Acceleration ──────────────────────────────────── */
export function Sim_fma_double_mass() {
  return (
    <SimCanvas config={{
      title:   "F=ma — Double Mass → Half Acceleration",
      desc:    "Same 60 N force, but 20 kg block (double mass). Watch how the acceleration is roughly halved.",
      concept: "a₁ = 25.7 / 10 = 2.57 m/s² (10 kg). a₂ = (60 − 0.35×20×9.8) / 20 = (60 − 68.6) / 20. Net force is actually NEGATIVE — friction exceeds applied force! The block won't move. You need 68.6+ N to start it.",
      mode: "force", env: "wood",
      mass: 20, initForceLeft: 0, initForceRight: 60,
      allowForceChange: true, allowMassChange: true, maxForce: 300,
      blockColor: ["#7c3aed", "#4c1d95"],
    }} />
  );
}

/* ── 3. Double Force — Double Acceleration ───────────────────────────────── */
export function Sim_fma_double_force() {
  return (
    <SimCanvas config={{
      title:   "F=ma — Double Force → Double Acceleration",
      desc:    "Same 10 kg block, but force doubled to 120 N on wood. Watch the block accelerate roughly twice as fast.",
      concept: "a₂ = (120 − 34.3) / 10 = 8.57 m/s² ≈ 2× the original 2.57 m/s². F=ma is directly proportional: doubling net force doubles acceleration (for the same mass). The friction term slightly skews the ratio.",
      mode: "force", env: "wood",
      mass: 10, initForceLeft: 0, initForceRight: 120,
      allowForceChange: true, allowMassChange: true, maxForce: 300,
      blockColor: ["#0369a1", "#0c4a6e"],
    }} />
  );
}

/* ── 4. Friction Reduces Net Force (Concrete) ────────────────────────────── */
export function Sim_fma_friction() {
  return (
    <SimCanvas config={{
      title:   "F=ma — Friction Reduces Net Force",
      desc:    "60 N force on rough concrete (μ = 0.65). Friction eats 63.7 N — more than the applied force! The block stays still.",
      concept: "F_net = 60 − (0.65 × 10 × 9.8) = 60 − 63.7 = −3.7 N. Negative means friction exceeds force — static friction holds the block still. You must apply > 73.5 N (μs×mg) to start motion. Friction fundamentally changes what 'net force' means.",
      mode: "force", env: "concrete",
      mass: 10, initForceLeft: 0, initForceRight: 60,
      allowForceChange: true, allowMassChange: true, maxForce: 250,
      blockColor: ["#78350f", "#451a03"],
    }} />
  );
}

/* ── 5. Heavy Mass + High Friction ───────────────────────────────────────── */
export function Sim_fma_heavy_friction() {
  return (
    <SimCanvas config={{
      title:   "Heavy Block — High Friction Rubber Mat",
      desc:    "20 kg on rubber (μ = 0.80). Enormous friction: 156.8 N kinetic! You need over 176 N just to get it moving.",
      concept: "Static friction limit = 0.90 × 20 × 9.8 = 176.4 N. Try applying 200 N: F_net = 200 − 156.8 = 43.2 N. a = 43.2 / 20 = 2.16 m/s². High friction and mass both fight against acceleration — F=ma still holds, but F_net is small.",
      mode: "force", env: "rubber",
      mass: 20, initForceLeft: 0, initForceRight: 200,
      allowForceChange: true, allowMassChange: true, maxForce: 400,
      blockColor: ["#374151", "#111827"],
    }} />
  );
}

/* ── 6. Tiny Mass — Huge Acceleration (Ice) ──────────────────────────────── */
export function Sim_fma_micro() {
  return (
    <SimCanvas config={{
      title:   "F=ma — Tiny Mass, Huge Acceleration",
      desc:    "A 0.1 kg (100 g) object on nearly frictionless ice with 5 N applied. Watch the enormous acceleration.",
      concept: "F_net ≈ 5 − (0.02 × 0.1 × 9.8) = 5 − 0.0196 ≈ 5 N. a = 5 / 0.1 = 50 m/s²! That's 5g of acceleration from just 5 N. Tiny mass dramatically amplifies acceleration — this is F=ma in an extreme case.",
      mode: "force", env: "ice",
      mass: 0.1, initForceLeft: 0, initForceRight: 5,
      allowForceChange: true, maxForce: 20,
      blockColor: ["#d97706", "#92400e"],
    }} />
  );
}

/* ── 7. Large Mass — Gentle Acceleration (Concrete) ─────────────────────── */
export function Sim_fma_macro() {
  return (
    <SimCanvas config={{
      title:   "F=ma — Large Mass, Gentle Acceleration",
      desc:    "A 200 kg block on concrete with 500 N. Enormous force, but massive inertia means modest acceleration.",
      concept: "F_net = 500 − (0.65 × 200 × 9.8) = 500 − 1274 = −774 N. The block doesn't move! Concrete friction dominates. You'd need over 1470 N (μs×m×g = 0.75×200×9.8) just to start it. Mass and friction combine to resist enormously.",
      mode: "force", env: "concrete",
      mass: 200, initForceLeft: 0, initForceRight: 500,
      allowForceChange: true, maxForce: 2000,
      blockColor: ["#374151", "#111827"],
    }} />
  );
}

/* ── 8. Opposing Forces — Net Force Calculation ──────────────────────────── */
export function Sim_fma_opposing() {
  return (
    <SimCanvas config={{
      title:   "Opposing Forces — Net Force = F₁ − F₂",
      desc:    "60 N rightward, 20 N leftward, on smooth ice. Net = 40 N. Watch the block accelerate rightward.",
      concept: "When forces oppose each other: F_net = F_right − F_left = 60 − 20 = 40 N. a = (40 − 1.96) / 10 = 3.8 m/s². Newton's 2nd Law uses NET force — always subtract opposing forces first before applying F = ma.",
      mode: "force", env: "ice",
      mass: 10, initForceLeft: 20, initForceRight: 60,
      allowForceChange: true, maxForce: 150,
      blockColor: ["#4f46e5", "#7c3aed"],
    }} />
  );
}

/* ── 9. Car Braking — F=ma for Deceleration ──────────────────────────────── */
export function Sim_fma_braking() {
  return (
    <SimCanvas config={{
      title:   "Car Braking — F=ma for Deceleration",
      desc:    "A 15 kg block at 4 m/s on steel, brakes applied (left force 60 N). F=ma determines how quickly it decelerates.",
      concept: "Braking force = 60 N (left). Kinetic friction also opposes (but braking is in the same direction here). Net deceleration force = 60 + 22 = 82 N. a = −82 / 15 = −5.47 m/s². Heavier car → more mass → longer stopping distance.",
      mode: "force", env: "steel",
      mass: 15, initForceLeft: 60, initForceRight: 0, initVelocity: 4,
      allowForceChange: true, maxForce: 200,
      blockColor: ["#059669", "#065f46"],
    }} />
  );
}

/* ── 10. Rocket Thrust — F=ma in Space ───────────────────────────────────── */
export function Sim_fma_rocket() {
  return (
    <SimCanvas config={{
      title:   "Rocket Thrust — F=ma in Space",
      desc:    "A 5 kg spacecraft with 150 N thruster in zero gravity. Pure F=ma — nothing but applied force and mass.",
      concept: "In space: μ = 0, so F_net = 150 N completely. a = 150 / 5 = 30 m/s²! This is 3g of acceleration. Real rocket engines produce this: the ISS can accelerate at ~0.3 m/s² from its 0.3 kN thrust and 420,000 kg mass.",
      mode: "force", env: "space",
      mass: 5, initForceLeft: 0, initForceRight: 150,
      allowForceChange: true, allowMassChange: true, maxForce: 300,
      blockColor: ["#1d4ed8", "#1e3a8a"],
    }} />
  );
}

/* ── 11. Asteroid Deflection — Huge Mass ─────────────────────────────────── */
export function Sim_fma_asteroid() {
  return (
    <SimCanvas config={{
      title:   "Asteroid Deflection — F=ma with Huge Mass",
      desc:    "A 1000 kg 'asteroid' with 200 N thruster (NASA's DART mission concept). See why deflection is so hard.",
      concept: "a = 200 / 1000 = 0.2 m/s² — tiny! But over years, this tiny acceleration changes the orbit significantly. Real asteroid deflection works this way — small consistent force, huge mass, long time = big cumulative change.",
      mode: "force", env: "space",
      mass: 1000, initForceLeft: 0, initForceRight: 200,
      allowForceChange: true, maxForce: 2000,
      blockColor: ["#374151", "#111827"],
    }} />
  );
}

/* ── 12. Bullet in Barrel — Extreme Acceleration ─────────────────────────── */
export function Sim_fma_bullet() {
  return (
    <SimCanvas config={{
      title:   "Bullet Leaving Barrel — Extreme F=ma",
      desc:    "A 5 g (0.005 kg) bullet in space with 500 N propellant force. The tiny mass creates a spectacular acceleration.",
      concept: "a = 500 / 0.005 = 100,000 m/s² = 10,000g! This is why bullets reach 900 m/s in a ~45 cm barrel (only 0.9 ms of acceleration time). F=ma with tiny mass and large force creates extreme acceleration — the physics of ballistics.",
      mode: "force", env: "space",
      mass: 0.005, initForceLeft: 0, initForceRight: 500,
      allowForceChange: false,
      blockColor: ["#d97706", "#92400e"],
    }} />
  );
}

/* ── 13. Tug of War — Which Team Gets F=ma? ─────────────────────────────── */
export function Sim_fma_tug() {
  return (
    <SimCanvas config={{
      title:   "Tug of War Physics — Net Force = Net Acceleration",
      desc:    "Right force 80 N, left force 40 N, ice surface. Net force = 40 N. Watch how F=ma determines who 'wins'.",
      concept: "Net force = 80 − 40 = 40 N (right). F_friction on ice ≈ 2 N. Net ≈ 38 N. a = 38 / 10 = 3.8 m/s² rightward. The block (rope) moves right. F=ma doesn't care which team is 'trying harder' — only net force matters.",
      mode: "force", env: "ice",
      mass: 10, initForceLeft: 40, initForceRight: 80,
      allowForceChange: true, maxForce: 200,
      blockColor: ["#0369a1", "#0c4a6e"],
    }} />
  );
}

/* ── 14. Equilibrium — No Net Force, No Acceleration ────────────────────── */
export function Sim_fma_equilibrium() {
  return (
    <SimCanvas config={{
      title:   "F=ma — Equilibrium (a = 0)",
      desc:    "35 N from each side on wood. Even though forces are applied, net force = 0 → acceleration = 0. Perfect equilibrium.",
      concept: "F=ma: when a = 0, F_net must = 0. Applied forces can be large but if they cancel: equilibrium. This is NOT the absence of forces — it's forces IN BALANCE. The block is in static equilibrium: Σ F = 0.",
      mode: "force", env: "wood",
      mass: 10, initForceLeft: 35, initForceRight: 35,
      allowForceChange: true, maxForce: 150,
      blockColor: ["#4f46e5", "#7c3aed"],
    }} />
  );
}

/* ── 15. Breakaway — Overcoming Static Friction ──────────────────────────── */
export function Sim_fma_breakaway() {
  return (
    <SimCanvas config={{
      title:   "F=ma — Breaking Through Static Friction",
      desc:    "Rubber mat, 10 kg. You need >88.2 N to overcome static friction (μs=0.90). See the threshold of motion.",
      concept: "Static friction limit = 0.90 × 10 × 9.8 = 88.2 N. Below this: block stays still (friction matches applied force). Above: block breaks free and kinetic friction (78.4 N) takes over. The transition from static to kinetic friction is the 'breakaway' moment.",
      mode: "force", env: "rubber",
      mass: 10, initForceLeft: 0, initForceRight: 85,
      allowForceChange: true, maxForce: 200,
      blockColor: ["#065f46", "#064e3b"],
    }} />
  );
}
