import React from "react";
import ForceEngine from "./engine/ForceEngine";

export function Sim_fma_standard() {
  return <ForceEngine config={{
    initialMass: 10,
    initialVelocity: 0,
    frictionCoefficient: 0,
    environmentName: "Lab",
    presetForceLeft: 0,
    presetForceRight: 50,
    scenarioDescription: "F = 50, m = 10. Acceleration should be 5 m/s².",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_fma_double_mass() {
  return <ForceEngine config={{
    initialMass: 20,
    initialVelocity: 0,
    frictionCoefficient: 0,
    environmentName: "Lab",
    presetForceLeft: 0,
    presetForceRight: 50,
    scenarioDescription: "Double the mass, half the acceleration (2.5 m/s²).",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_fma_double_force() {
  return <ForceEngine config={{
    initialMass: 10,
    initialVelocity: 0,
    frictionCoefficient: 0,
    environmentName: "Lab",
    presetForceLeft: 0,
    presetForceRight: 100,
    scenarioDescription: "Double the force, double the acceleration (10 m/s²).",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_fma_friction() {
  return <ForceEngine config={{
    initialMass: 10,
    initialVelocity: 0,
    frictionCoefficient: 0.2,
    environmentName: "Wood",
    presetForceLeft: 0,
    presetForceRight: 50,
    scenarioDescription: "Net force is Applied - Friction. F_net = ma.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_fma_heavy_friction() {
  return <ForceEngine config={{
    initialMass: 10,
    initialVelocity: 0,
    frictionCoefficient: 0.8,
    environmentName: "Rubber",
    presetForceLeft: 0,
    presetForceRight: 50,
    scenarioDescription: "High friction might prevent acceleration completely!",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_fma_micro() {
  return <ForceEngine config={{
    initialMass: 0.1,
    initialVelocity: 0,
    frictionCoefficient: 0,
    environmentName: "Vacuum",
    presetForceLeft: 0,
    presetForceRight: 1,
    scenarioDescription: "Small mass, small force. High acceleration.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_fma_macro() {
  return <ForceEngine config={{
    initialMass: 1000,
    initialVelocity: 0,
    frictionCoefficient: 0,
    environmentName: "Space",
    presetForceLeft: 0,
    presetForceRight: 1000,
    scenarioDescription: "Large mass, large force. F=ma scales up.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_fma_opposing() {
  return <ForceEngine config={{
    initialMass: 20,
    initialVelocity: 0,
    frictionCoefficient: 0,
    environmentName: "Ice",
    presetForceLeft: 30,
    presetForceRight: 70,
    scenarioDescription: "Net force is 40N right. a = 40/20 = 2 m/s².",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_fma_braking() {
  return <ForceEngine config={{
    initialMass: 50,
    initialVelocity: 20,
    frictionCoefficient: 0.6,
    environmentName: "Road",
    presetForceLeft: 100,
    presetForceRight: 0,
    scenarioDescription: "Force applied against motion. Negative acceleration.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_fma_rocket() {
  return <ForceEngine config={{
    initialMass: 100,
    initialVelocity: 0,
    frictionCoefficient: 0,
    environmentName: "Space",
    presetForceLeft: 0,
    presetForceRight: 300,
    scenarioDescription: "Rocket thruster: constant high force.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_fma_asteroid() {
  return <ForceEngine config={{
    initialMass: 5000,
    initialVelocity: 0,
    frictionCoefficient: 0,
    environmentName: "Space",
    presetForceLeft: 0,
    presetForceRight: 100,
    scenarioDescription: "Tiny force on massive asteroid. Very slow acceleration.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_fma_bullet() {
  return <ForceEngine config={{
    initialMass: 0.05,
    initialVelocity: 0,
    frictionCoefficient: 0.01,
    environmentName: "Air",
    presetForceLeft: 0,
    presetForceRight: 500,
    scenarioDescription: "Huge force on tiny mass. Massive acceleration.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_fma_tug() {
  return <ForceEngine config={{
    initialMass: 60,
    initialVelocity: 0,
    frictionCoefficient: 0.1,
    environmentName: "Ice",
    presetForceLeft: 120,
    presetForceRight: 100,
    scenarioDescription: "Net force left. Accelerates left.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_fma_equilibrium() {
  return <ForceEngine config={{
    initialMass: 10,
    initialVelocity: 0,
    frictionCoefficient: 0.3,
    environmentName: "Floor",
    presetForceLeft: 0,
    presetForceRight: 20,
    scenarioDescription: "Applied force (20N) is less than max static friction (29.4N). a = 0.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_fma_breakaway() {
  return <ForceEngine config={{
    initialMass: 10,
    initialVelocity: 0,
    frictionCoefficient: 0.3,
    environmentName: "Floor",
    presetForceLeft: 0,
    presetForceRight: 30,
    scenarioDescription: "Applied force (30N) just overcomes static friction (29.4N). a > 0.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

