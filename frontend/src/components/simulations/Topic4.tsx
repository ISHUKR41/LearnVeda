import React from "react";
import ForceEngine from "./engine/ForceEngine";

export function Sim_action_reaction_push() {
  return <ForceEngine config={{
    initialMass: 50,
    initialVelocity: 0,
    frictionCoefficient: 0,
    environmentName: "Space",
    presetForceLeft: 0,
    presetForceRight: 100,
    scenarioDescription: "Pushing a wall: The wall pushes back. (Simulated as force on object)",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_recoil_gun() {
  return <ForceEngine config={{
    initialMass: 5,
    initialVelocity: 0,
    frictionCoefficient: 0.1,
    environmentName: "Lab",
    presetForceLeft: 200,
    presetForceRight: 0,
    scenarioDescription: "Gun recoils backward when firing bullet forward.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_rocket_launch() {
  return <ForceEngine config={{
    initialMass: 200,
    initialVelocity: 0,
    frictionCoefficient: 0,
    environmentName: "Space",
    presetForceLeft: 0,
    presetForceRight: 500,
    scenarioDescription: "Rocket pushes gas back, gas pushes rocket forward.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_swimmer_wall() {
  return <ForceEngine config={{
    initialMass: 60,
    initialVelocity: 0,
    frictionCoefficient: 0.05,
    environmentName: "Pool",
    presetForceLeft: 0,
    presetForceRight: 150,
    scenarioDescription: "Swimmer pushes wall, wall pushes swimmer.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_walking_friction() {
  return <ForceEngine config={{
    initialMass: 70,
    initialVelocity: 0,
    frictionCoefficient: 0.5,
    environmentName: "Road",
    presetForceLeft: 0,
    presetForceRight: 50,
    scenarioDescription: "Foot pushes ground back, ground pushes person forward.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_ice_skater() {
  return <ForceEngine config={{
    initialMass: 55,
    initialVelocity: 0,
    frictionCoefficient: 0.01,
    environmentName: "Ice",
    presetForceLeft: 0,
    presetForceRight: 30,
    scenarioDescription: "Skater throws object, moves backward.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_bird_flight() {
  return <ForceEngine config={{
    initialMass: 2,
    initialVelocity: 0,
    frictionCoefficient: 0.1,
    environmentName: "Air",
    presetForceLeft: 0,
    presetForceRight: 10,
    scenarioDescription: "Wings push air down, air pushes bird up/forward.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_boat_jump() {
  return <ForceEngine config={{
    initialMass: 80,
    initialVelocity: 0,
    frictionCoefficient: 0.05,
    environmentName: "Water",
    presetForceLeft: 100,
    presetForceRight: 0,
    scenarioDescription: "Jumping off boat: you go forward, boat goes backward.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_balloon_air() {
  return <ForceEngine config={{
    initialMass: 0.5,
    initialVelocity: 0,
    frictionCoefficient: 0.02,
    environmentName: "Air",
    presetForceLeft: 0,
    presetForceRight: 5,
    scenarioDescription: "Air rushes out of balloon, balloon flies forward.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_firehose() {
  return <ForceEngine config={{
    initialMass: 40,
    initialVelocity: 0,
    frictionCoefficient: 0.4,
    environmentName: "Ground",
    presetForceLeft: 300,
    presetForceRight: 0,
    scenarioDescription: "Water shoots forward, hose pushes backward.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_hammer_nail() {
  return <ForceEngine config={{
    initialMass: 1,
    initialVelocity: 0,
    frictionCoefficient: 0.8,
    environmentName: "Wood",
    presetForceLeft: 0,
    presetForceRight: 200,
    scenarioDescription: "Hammer hits nail, nail stops hammer.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_car_tires() {
  return <ForceEngine config={{
    initialMass: 1000,
    initialVelocity: 0,
    frictionCoefficient: 0.7,
    environmentName: "Asphalt",
    presetForceLeft: 0,
    presetForceRight: 800,
    scenarioDescription: "Tires push road backward, road pushes car forward.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_spring_push() {
  return <ForceEngine config={{
    initialMass: 10,
    initialVelocity: 0,
    frictionCoefficient: 0.01,
    environmentName: "Track",
    presetForceLeft: 0,
    presetForceRight: 100,
    scenarioDescription: "Compressed spring releases against block.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_magnet_repel() {
  return <ForceEngine config={{
    initialMass: 5,
    initialVelocity: 0,
    frictionCoefficient: 0.05,
    environmentName: "Track",
    presetForceLeft: 0,
    presetForceRight: 40,
    scenarioDescription: "Magnets push each other apart.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

export function Sim_cannon_fire() {
  return <ForceEngine config={{
    initialMass: 500,
    initialVelocity: 0,
    frictionCoefficient: 0.3,
    environmentName: "Ground",
    presetForceLeft: 1000,
    presetForceRight: 0,
    scenarioDescription: "Cannon fires ball, cannon rolls back.",
    allowUserMassChange: false,
    allowUserForceChange: true
  }} />
}

