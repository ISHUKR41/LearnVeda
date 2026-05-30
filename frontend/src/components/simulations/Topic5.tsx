import React from "react";
import ForceEngine from "./engine/ForceEngine";

export function Sim_momentum_heavy() {
  return <ForceEngine config={{
    initialMass: 100,
    initialVelocity: 10,
    frictionCoefficient: 0.01,
    environmentName: "Ice",
    presetForceLeft: 0,
    presetForceRight: 0,
    scenarioDescription: "High mass, low velocity = high momentum.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_momentum_fast() {
  return <ForceEngine config={{
    initialMass: 10,
    initialVelocity: 100,
    frictionCoefficient: 0.01,
    environmentName: "Ice",
    presetForceLeft: 0,
    presetForceRight: 0,
    scenarioDescription: "Low mass, high velocity = high momentum.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_momentum_collision() {
  return <ForceEngine config={{
    initialMass: 50,
    initialVelocity: 20,
    frictionCoefficient: 0.05,
    environmentName: "Track",
    presetForceLeft: 0,
    presetForceRight: 0,
    scenarioDescription: "Momentum p = mv = 50 * 20 = 1000 kg m/s.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_momentum_stop() {
  return <ForceEngine config={{
    initialMass: 50,
    initialVelocity: 20,
    frictionCoefficient: 0.5,
    environmentName: "Track",
    presetForceLeft: 0,
    presetForceRight: 0,
    scenarioDescription: "Friction reduces momentum over time.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_momentum_bullet() {
  return <ForceEngine config={{
    initialMass: 0.02,
    initialVelocity: 500,
    frictionCoefficient: 0.01,
    environmentName: "Air",
    presetForceLeft: 0,
    presetForceRight: 0,
    scenarioDescription: "Tiny mass, huge velocity. p = 10 kg m/s.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_momentum_train() {
  return <ForceEngine config={{
    initialMass: 5000,
    initialVelocity: 5,
    frictionCoefficient: 0.05,
    environmentName: "Rail",
    presetForceLeft: 0,
    presetForceRight: 0,
    scenarioDescription: "Huge mass, small velocity. p = 25000 kg m/s.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_momentum_change() {
  return <ForceEngine config={{
    initialMass: 20,
    initialVelocity: 5,
    frictionCoefficient: 0.01,
    environmentName: "Ice",
    presetForceLeft: 0,
    presetForceRight: 50,
    scenarioDescription: "Force changes momentum (Impulse = F * t).",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_momentum_braking() {
  return <ForceEngine config={{
    initialMass: 100,
    initialVelocity: 30,
    frictionCoefficient: 0.8,
    environmentName: "Road",
    presetForceLeft: 200,
    presetForceRight: 0,
    scenarioDescription: "Negative force reduces momentum.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_momentum_zero() {
  return <ForceEngine config={{
    initialMass: 100,
    initialVelocity: 0,
    frictionCoefficient: 0,
    environmentName: "Space",
    presetForceLeft: 0,
    presetForceRight: 0,
    scenarioDescription: "Zero velocity = zero momentum.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_momentum_asteroid() {
  return <ForceEngine config={{
    initialMass: 10000,
    initialVelocity: 2,
    frictionCoefficient: 0,
    environmentName: "Space",
    presetForceLeft: 0,
    presetForceRight: 0,
    scenarioDescription: "Massive momentum, hard to stop.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_momentum_pingpong() {
  return <ForceEngine config={{
    initialMass: 0.005,
    initialVelocity: 15,
    frictionCoefficient: 0.1,
    environmentName: "Table",
    presetForceLeft: 0,
    presetForceRight: 0,
    scenarioDescription: "Very low momentum.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_momentum_impulse1() {
  return <ForceEngine config={{
    initialMass: 10,
    initialVelocity: 0,
    frictionCoefficient: 0,
    environmentName: "Ice",
    presetForceLeft: 0,
    presetForceRight: 100,
    scenarioDescription: "High force applies large impulse quickly.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_momentum_impulse2() {
  return <ForceEngine config={{
    initialMass: 10,
    initialVelocity: 0,
    frictionCoefficient: 0,
    environmentName: "Ice",
    presetForceLeft: 0,
    presetForceRight: 10,
    scenarioDescription: "Low force applies small impulse.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_momentum_reverse() {
  return <ForceEngine config={{
    initialMass: 20,
    initialVelocity: 20,
    frictionCoefficient: 0,
    environmentName: "Ice",
    presetForceLeft: 100,
    presetForceRight: 0,
    scenarioDescription: "Reversing momentum requires large impulse.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_momentum_constant() {
  return <ForceEngine config={{
    initialMass: 50,
    initialVelocity: 15,
    frictionCoefficient: 0,
    environmentName: "Space",
    presetForceLeft: 0,
    presetForceRight: 0,
    scenarioDescription: "Momentum is perfectly conserved with zero net force.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

