/**
 * FILE: SimulationRegistry.tsx
 * PURPOSE: Central registry for ALL simulations across all 5 Force & Laws of Motion topics.
 *
 * KEY DESIGN DECISIONS:
 *   1. "use client" — IntersectionObserver and useState require a client component.
 *   2. Each simulation is lazily IMPORTED via next/dynamic (code-split per simulation).
 *   3. Each simulation is lazily MOUNTED via IntersectionObserver — only renders when
 *      it scrolls into view (300px before). This prevents 30 canvas RAF loops running
 *      simultaneously, which caused severe performance issues.
 */
"use client";

import React, { ComponentType, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 1 — Balanced & Unbalanced Forces (original 15)
 * ══════════════════════════════════════════════════════════════════ */
const Sim_balanced_ice = dynamic(() => import('./Topic1').then(mod => mod.Sim_balanced_ice), { ssr: false });
const Sim_unbalanced_ice = dynamic(() => import('./Topic1').then(mod => mod.Sim_unbalanced_ice), { ssr: false });
const Sim_balanced_wood = dynamic(() => import('./Topic1').then(mod => mod.Sim_balanced_wood), { ssr: false });
const Sim_unbalanced_wood = dynamic(() => import('./Topic1').then(mod => mod.Sim_unbalanced_wood), { ssr: false });
const Sim_balanced_space = dynamic(() => import('./Topic1').then(mod => mod.Sim_balanced_space), { ssr: false });
const Sim_unbalanced_space = dynamic(() => import('./Topic1').then(mod => mod.Sim_unbalanced_space), { ssr: false });
const Sim_heavy_balanced = dynamic(() => import('./Topic1').then(mod => mod.Sim_heavy_balanced), { ssr: false });
const Sim_heavy_unbalanced = dynamic(() => import('./Topic1').then(mod => mod.Sim_heavy_unbalanced), { ssr: false });
const Sim_light_balanced = dynamic(() => import('./Topic1').then(mod => mod.Sim_light_balanced), { ssr: false });
const Sim_light_unbalanced = dynamic(() => import('./Topic1').then(mod => mod.Sim_light_unbalanced), { ssr: false });
const Sim_tug_of_war_tie = dynamic(() => import('./Topic1').then(mod => mod.Sim_tug_of_war_tie), { ssr: false });
const Sim_tug_of_war_win = dynamic(() => import('./Topic1').then(mod => mod.Sim_tug_of_war_win), { ssr: false });
const Sim_extreme_balanced = dynamic(() => import('./Topic1').then(mod => mod.Sim_extreme_balanced), { ssr: false });
const Sim_extreme_unbalanced = dynamic(() => import('./Topic1').then(mod => mod.Sim_extreme_unbalanced), { ssr: false });
const Sim_micro_forces = dynamic(() => import('./Topic1').then(mod => mod.Sim_micro_forces), { ssr: false });

/* ── Topic 1 Advanced (5) ── */
const Sim_fbd_builder = dynamic(() => import('./Topic1Advanced').then(mod => mod.Sim_fbd_builder), { ssr: false });
const Sim_elevator_scale = dynamic(() => import('./Topic1Advanced').then(mod => mod.Sim_elevator_scale), { ssr: false });
const Sim_parachute_terminal = dynamic(() => import('./Topic1Advanced').then(mod => mod.Sim_parachute_terminal), { ssr: false });
const Sim_spring_balance = dynamic(() => import('./Topic1Advanced').then(mod => mod.Sim_spring_balance), { ssr: false });
const Sim_friction_surfaces = dynamic(() => import('./Topic1Advanced').then(mod => mod.Sim_friction_surfaces), { ssr: false });

/* ── Topic 1 Extra (8) ── */
const Sim_inclined_plane = dynamic(() => import('./Topic1Extra').then(mod => mod.Sim_inclined_plane), { ssr: false });
const Sim_atwood_machine = dynamic(() => import('./Topic1Extra').then(mod => mod.Sim_atwood_machine), { ssr: false });
const Sim_buoyancy_forces = dynamic(() => import('./Topic1Extra').then(mod => mod.Sim_buoyancy_forces), { ssr: false });
const Sim_vector_2d = dynamic(() => import('./Topic1Extra').then(mod => mod.Sim_vector_2d), { ssr: false });
const Sim_gravity_planets = dynamic(() => import('./Topic1Extra').then(mod => mod.Sim_gravity_planets), { ssr: false });
const Sim_bridge_tension = dynamic(() => import('./Topic1Extra').then(mod => mod.Sim_bridge_tension), { ssr: false });
const Sim_seesaw_torque = dynamic(() => import('./Topic1Extra').then(mod => mod.Sim_seesaw_torque), { ssr: false });
const Sim_satellite_orbit = dynamic(() => import('./Topic1Extra').then(mod => mod.Sim_satellite_orbit), { ssr: false });

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 2 — Newton's First Law / Inertia (original 15)
 * ══════════════════════════════════════════════════════════════════ */
const Sim_inertia_rest = dynamic(() => import('./Topic2').then(mod => mod.Sim_inertia_rest), { ssr: false });
const Sim_inertia_motion_space = dynamic(() => import('./Topic2').then(mod => mod.Sim_inertia_motion_space), { ssr: false });
const Sim_inertia_heavy = dynamic(() => import('./Topic2').then(mod => mod.Sim_inertia_heavy), { ssr: false });
const Sim_inertia_light = dynamic(() => import('./Topic2').then(mod => mod.Sim_inertia_light), { ssr: false });
const Sim_friction_stop = dynamic(() => import('./Topic2').then(mod => mod.Sim_friction_stop), { ssr: false });
const Sim_ice_slide = dynamic(() => import('./Topic2').then(mod => mod.Sim_ice_slide), { ssr: false });
const Sim_sudden_push = dynamic(() => import('./Topic2').then(mod => mod.Sim_sudden_push), { ssr: false });
const Sim_sudden_pull = dynamic(() => import('./Topic2').then(mod => mod.Sim_sudden_pull), { ssr: false });
const Sim_space_push = dynamic(() => import('./Topic2').then(mod => mod.Sim_space_push), { ssr: false });
const Sim_space_coast = dynamic(() => import('./Topic2').then(mod => mod.Sim_space_coast), { ssr: false });
const Sim_train_start = dynamic(() => import('./Topic2').then(mod => mod.Sim_train_start), { ssr: false });
const Sim_train_stop = dynamic(() => import('./Topic2').then(mod => mod.Sim_train_stop), { ssr: false });
const Sim_coin_flick = dynamic(() => import('./Topic2').then(mod => mod.Sim_coin_flick), { ssr: false });
const Sim_book_slide = dynamic(() => import('./Topic2').then(mod => mod.Sim_book_slide), { ssr: false });
const Sim_hovercraft = dynamic(() => import('./Topic2').then(mod => mod.Sim_hovercraft), { ssr: false });

/* ── Topic 2 Advanced (5) ── */
const Sim_tablecloth_pull = dynamic(() => import('./Topic2Advanced').then(mod => mod.Sim_tablecloth_pull), { ssr: false });
const Sim_bus_passengers = dynamic(() => import('./Topic2Advanced').then(mod => mod.Sim_bus_passengers), { ssr: false });
const Sim_coin_stack_flick = dynamic(() => import('./Topic2Advanced').then(mod => mod.Sim_coin_stack_flick), { ssr: false });
const Sim_ball_on_train = dynamic(() => import('./Topic2Advanced').then(mod => mod.Sim_ball_on_train), { ssr: false });
const Sim_hammer_head = dynamic(() => import('./Topic2Advanced').then(mod => mod.Sim_hammer_head), { ssr: false });

/* ── Topic 2 Extra (7) ── */
const Sim_crash_test = dynamic(() => import('./Topic2Extra').then(mod => mod.Sim_crash_test), { ssr: false });
const Sim_marble_tube = dynamic(() => import('./Topic2Extra').then(mod => mod.Sim_marble_tube), { ssr: false });
const Sim_spinning_skater = dynamic(() => import('./Topic2Extra').then(mod => mod.Sim_spinning_skater), { ssr: false });
const Sim_pendulum_inertia = dynamic(() => import('./Topic2Extra').then(mod => mod.Sim_pendulum_inertia), { ssr: false });
const Sim_detailed_coin_flick = dynamic(() => import('./Topic2Extra').then(mod => mod.Sim_detailed_coin_flick), { ssr: false });
const Sim_friction_removal = dynamic(() => import('./Topic2Extra').then(mod => mod.Sim_friction_removal), { ssr: false });
const Sim_bus_jerk = dynamic(() => import('./Topic2Extra').then(mod => mod.Sim_bus_jerk), { ssr: false });

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 3 — Newton's Second Law F=ma (original 15)
 * ══════════════════════════════════════════════════════════════════ */
const Sim_fma_standard = dynamic(() => import('./Topic3').then(mod => mod.Sim_fma_standard), { ssr: false });
const Sim_fma_double_mass = dynamic(() => import('./Topic3').then(mod => mod.Sim_fma_double_mass), { ssr: false });
const Sim_fma_double_force = dynamic(() => import('./Topic3').then(mod => mod.Sim_fma_double_force), { ssr: false });
const Sim_fma_friction = dynamic(() => import('./Topic3').then(mod => mod.Sim_fma_friction), { ssr: false });
const Sim_fma_heavy_friction = dynamic(() => import('./Topic3').then(mod => mod.Sim_fma_heavy_friction), { ssr: false });
const Sim_fma_micro = dynamic(() => import('./Topic3').then(mod => mod.Sim_fma_micro), { ssr: false });
const Sim_fma_macro = dynamic(() => import('./Topic3').then(mod => mod.Sim_fma_macro), { ssr: false });
const Sim_fma_opposing = dynamic(() => import('./Topic3').then(mod => mod.Sim_fma_opposing), { ssr: false });
const Sim_fma_braking = dynamic(() => import('./Topic3').then(mod => mod.Sim_fma_braking), { ssr: false });
const Sim_fma_rocket = dynamic(() => import('./Topic3').then(mod => mod.Sim_fma_rocket), { ssr: false });
const Sim_fma_asteroid = dynamic(() => import('./Topic3').then(mod => mod.Sim_fma_asteroid), { ssr: false });
const Sim_fma_bullet = dynamic(() => import('./Topic3').then(mod => mod.Sim_fma_bullet), { ssr: false });
const Sim_fma_tug = dynamic(() => import('./Topic3').then(mod => mod.Sim_fma_tug), { ssr: false });
const Sim_fma_equilibrium = dynamic(() => import('./Topic3').then(mod => mod.Sim_fma_equilibrium), { ssr: false });
const Sim_fma_breakaway = dynamic(() => import('./Topic3').then(mod => mod.Sim_fma_breakaway), { ssr: false });

/* ── Topic 3 Advanced (5) ── */
const Sim_fma_calculator = dynamic(() => import('./Topic3Advanced').then(mod => mod.Sim_fma_calculator), { ssr: false });
const Sim_ramp_race = dynamic(() => import('./Topic3Advanced').then(mod => mod.Sim_ramp_race), { ssr: false });
const Sim_braking_distance = dynamic(() => import('./Topic3Advanced').then(mod => mod.Sim_braking_distance), { ssr: false });
const Sim_force_acceleration_graph = dynamic(() => import('./Topic3Advanced').then(mod => mod.Sim_force_acceleration_graph), { ssr: false });
const Sim_mass_comparison = dynamic(() => import('./Topic3Advanced').then(mod => mod.Sim_mass_comparison), { ssr: false });

/* ── Topic 3 Extra (7) ── */
const Sim_fma_live_graph = dynamic(() => import('./Topic3Extra').then(mod => mod.Sim_fma_live_graph), { ssr: false });
const Sim_impulse_demo = dynamic(() => import('./Topic3Extra').then(mod => mod.Sim_impulse_demo), { ssr: false });
const Sim_variable_mass_rocket = dynamic(() => import('./Topic3Extra').then(mod => mod.Sim_variable_mass_rocket), { ssr: false });
const Sim_sports_fma = dynamic(() => import('./Topic3Extra').then(mod => mod.Sim_sports_fma), { ssr: false });
const Sim_spring_mass_oscillator = dynamic(() => import('./Topic3Extra').then(mod => mod.Sim_spring_mass_oscillator), { ssr: false });
const Sim_braking_calc = dynamic(() => import('./Topic3Extra').then(mod => mod.Sim_braking_calc), { ssr: false });
const Sim_fma_race = dynamic(() => import('./Topic3Extra').then(mod => mod.Sim_fma_race), { ssr: false });

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 4 — Newton's Third Law (original 15)
 * ══════════════════════════════════════════════════════════════════ */
const Sim_action_reaction_push = dynamic(() => import('./Topic4').then(mod => mod.Sim_action_reaction_push), { ssr: false });
const Sim_recoil_gun = dynamic(() => import('./Topic4').then(mod => mod.Sim_recoil_gun), { ssr: false });
const Sim_rocket_launch = dynamic(() => import('./Topic4').then(mod => mod.Sim_rocket_launch), { ssr: false });
const Sim_swimmer_wall = dynamic(() => import('./Topic4').then(mod => mod.Sim_swimmer_wall), { ssr: false });
const Sim_walking_friction = dynamic(() => import('./Topic4').then(mod => mod.Sim_walking_friction), { ssr: false });
const Sim_ice_skater = dynamic(() => import('./Topic4').then(mod => mod.Sim_ice_skater), { ssr: false });
const Sim_bird_flight = dynamic(() => import('./Topic4').then(mod => mod.Sim_bird_flight), { ssr: false });
const Sim_boat_jump = dynamic(() => import('./Topic4').then(mod => mod.Sim_boat_jump), { ssr: false });
const Sim_balloon_air = dynamic(() => import('./Topic4').then(mod => mod.Sim_balloon_air), { ssr: false });
const Sim_firehose = dynamic(() => import('./Topic4').then(mod => mod.Sim_firehose), { ssr: false });
const Sim_hammer_nail = dynamic(() => import('./Topic4').then(mod => mod.Sim_hammer_nail), { ssr: false });
const Sim_car_tires = dynamic(() => import('./Topic4').then(mod => mod.Sim_car_tires), { ssr: false });
const Sim_spring_push = dynamic(() => import('./Topic4').then(mod => mod.Sim_spring_push), { ssr: false });
const Sim_magnet_repel = dynamic(() => import('./Topic4').then(mod => mod.Sim_magnet_repel), { ssr: false });
const Sim_cannon_fire = dynamic(() => import('./Topic4').then(mod => mod.Sim_cannon_fire), { ssr: false });

/* ── Topic 4 Advanced (5) ── */
const Sim_rocket_propulsion = dynamic(() => import('./Topic4Advanced').then(mod => mod.Sim_rocket_propulsion), { ssr: false });
const Sim_balloon_jet = dynamic(() => import('./Topic4Advanced').then(mod => mod.Sim_balloon_jet), { ssr: false });
const Sim_book_on_table_reaction = dynamic(() => import('./Topic4Advanced').then(mod => mod.Sim_book_on_table_reaction), { ssr: false });
const Sim_wall_push_skater = dynamic(() => import('./Topic4Advanced').then(mod => mod.Sim_wall_push_skater), { ssr: false });
const Sim_horse_cart_paradox = dynamic(() => import('./Topic4Advanced').then(mod => mod.Sim_horse_cart_paradox), { ssr: false });

/* ── Topic 4 Extra (6) ── */
const Sim_jet_engine = dynamic(() => import('./Topic4Extra').then(mod => mod.Sim_jet_engine), { ssr: false });
const Sim_astronaut_push = dynamic(() => import('./Topic4Extra').then(mod => mod.Sim_astronaut_push), { ssr: false });
const Sim_swimming_propulsion = dynamic(() => import('./Topic4Extra').then(mod => mod.Sim_swimming_propulsion), { ssr: false });
const Sim_spring_release = dynamic(() => import('./Topic4Extra').then(mod => mod.Sim_spring_release), { ssr: false });
const Sim_horse_cart_resolved = dynamic(() => import('./Topic4Extra').then(mod => mod.Sim_horse_cart_resolved), { ssr: false });
const Sim_trampoline_bounce = dynamic(() => import('./Topic4Extra').then(mod => mod.Sim_trampoline_bounce), { ssr: false });

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 5 — Conservation of Momentum (original 15)
 * ══════════════════════════════════════════════════════════════════ */
const Sim_momentum_heavy = dynamic(() => import('./Topic5').then(mod => mod.Sim_momentum_heavy), { ssr: false });
const Sim_momentum_fast = dynamic(() => import('./Topic5').then(mod => mod.Sim_momentum_fast), { ssr: false });
const Sim_momentum_collision = dynamic(() => import('./Topic5').then(mod => mod.Sim_momentum_collision), { ssr: false });
const Sim_momentum_stop = dynamic(() => import('./Topic5').then(mod => mod.Sim_momentum_stop), { ssr: false });
const Sim_momentum_bullet = dynamic(() => import('./Topic5').then(mod => mod.Sim_momentum_bullet), { ssr: false });
const Sim_momentum_train = dynamic(() => import('./Topic5').then(mod => mod.Sim_momentum_train), { ssr: false });
const Sim_momentum_change = dynamic(() => import('./Topic5').then(mod => mod.Sim_momentum_change), { ssr: false });
const Sim_momentum_braking = dynamic(() => import('./Topic5').then(mod => mod.Sim_momentum_braking), { ssr: false });
const Sim_momentum_zero = dynamic(() => import('./Topic5').then(mod => mod.Sim_momentum_zero), { ssr: false });
const Sim_momentum_asteroid = dynamic(() => import('./Topic5').then(mod => mod.Sim_momentum_asteroid), { ssr: false });
const Sim_momentum_pingpong = dynamic(() => import('./Topic5').then(mod => mod.Sim_momentum_pingpong), { ssr: false });
const Sim_momentum_impulse1 = dynamic(() => import('./Topic5').then(mod => mod.Sim_momentum_impulse1), { ssr: false });
const Sim_momentum_impulse2 = dynamic(() => import('./Topic5').then(mod => mod.Sim_momentum_impulse2), { ssr: false });
const Sim_momentum_reverse = dynamic(() => import('./Topic5').then(mod => mod.Sim_momentum_reverse), { ssr: false });
const Sim_momentum_constant = dynamic(() => import('./Topic5').then(mod => mod.Sim_momentum_constant), { ssr: false });

/* ── Topic 5 Advanced (5) ── */
const Sim_collision_lab = dynamic(() => import('./Topic5Advanced').then(mod => mod.Sim_collision_lab), { ssr: false });
const Sim_newtons_cradle = dynamic(() => import('./Topic5Advanced').then(mod => mod.Sim_newtons_cradle), { ssr: false });
const Sim_billiards_shot = dynamic(() => import('./Topic5Advanced').then(mod => mod.Sim_billiards_shot), { ssr: false });
const Sim_explosion_demo = dynamic(() => import('./Topic5Advanced').then(mod => mod.Sim_explosion_demo), { ssr: false });
const Sim_rocket_equation = dynamic(() => import('./Topic5Advanced').then(mod => mod.Sim_rocket_equation), { ssr: false });

/* ── Topic 5 Extra (7) ── */
const Sim_ballistic_pendulum = dynamic(() => import('./Topic5Extra').then(mod => mod.Sim_ballistic_pendulum), { ssr: false });
const Sim_2d_collision = dynamic(() => import('./Topic5Extra').then(mod => mod.Sim_2d_collision), { ssr: false });
const Sim_rocket_staging = dynamic(() => import('./Topic5Extra').then(mod => mod.Sim_rocket_staging), { ssr: false });
const Sim_ice_skater_collision = dynamic(() => import('./Topic5Extra').then(mod => mod.Sim_ice_skater_collision), { ssr: false });
const Sim_momentum_timeline = dynamic(() => import('./Topic5Extra').then(mod => mod.Sim_momentum_timeline), { ssr: false });
const Sim_recoil_calculator = dynamic(() => import('./Topic5Extra').then(mod => mod.Sim_recoil_calculator), { ssr: false });
const Sim_momentum_quiz = dynamic(() => import('./Topic5Extra').then(mod => mod.Sim_momentum_quiz), { ssr: false });

/* ══════════════════════════════════════════════════════════════════
 * PREMIUM TIER — High-fidelity, animated simulations
 * ══════════════════════════════════════════════════════════════════ */

/* ── Topic 1 Premium (2) ── */
const Sim_crane_load_balancer = dynamic(() => import('./Topic1Premium').then(mod => mod.Sim_crane_load_balancer), { ssr: false });
const Sim_banked_curve = dynamic(() => import('./Topic1Premium').then(mod => mod.Sim_banked_curve), { ssr: false });

/* ── Topic 2 Premium (2) ── */
const Sim_galileo_ramp = dynamic(() => import('./Topic2Premium').then(mod => mod.Sim_galileo_ramp), { ssr: false });
const Sim_iss_microgravity = dynamic(() => import('./Topic2Premium').then(mod => mod.Sim_iss_microgravity), { ssr: false });

/* ── Topic 3 Premium (3) ── */
const Sim_pulley_system = dynamic(() => import('./Topic3Premium').then(mod => mod.Sim_pulley_system), { ssr: false });
const Sim_elevator_fma = dynamic(() => import('./Topic3Premium').then(mod => mod.Sim_elevator_fma), { ssr: false });
const Sim_drag_race = dynamic(() => import('./Topic3Premium').then(mod => mod.Sim_drag_race), { ssr: false });

/* ── Topic 4 Premium (4) ── */
const Sim_skateboard_push = dynamic(() => import('./Topic4Premium').then(mod => mod.Sim_skateboard_push), { ssr: false });
const Sim_rowing_boat = dynamic(() => import('./Topic4Premium').then(mod => mod.Sim_rowing_boat), { ssr: false });
const Sim_fire_extinguisher_cart = dynamic(() => import('./Topic4Premium').then(mod => mod.Sim_fire_extinguisher_cart), { ssr: false });
const Sim_newtons_cradle_advanced = dynamic(() => import('./Topic4Premium').then(mod => mod.Sim_newtons_cradle_advanced), { ssr: false });

/* ── Topic 5 Premium (3) ── */
const Sim_car_crash_analysis = dynamic(() => import('./Topic5Premium').then(mod => mod.Sim_car_crash_analysis), { ssr: false });
const Sim_fireworks_explosion = dynamic(() => import('./Topic5Premium').then(mod => mod.Sim_fireworks_explosion), { ssr: false });
const Sim_pool_table = dynamic(() => import('./Topic5Premium').then(mod => mod.Sim_pool_table), { ssr: false });

/* ══════════════════════════════════════════════════════════════════
 * PROFESSIONAL TIER 6 — Deep-physics canvas sims (auto-start, HiDPI)
 * 15 fully-animated simulations from Topic6Professional.tsx
 * ══════════════════════════════════════════════════════════════════ */
const Sim_projectile_motion_pro  = dynamic(() => import('./Topic6Professional').then(m => m.Sim_projectile_motion_pro),  { ssr: false });
const Sim_simple_pendulum_pro    = dynamic(() => import('./Topic6Professional').then(m => m.Sim_simple_pendulum_pro),    { ssr: false });
const Sim_spring_oscillator_pro  = dynamic(() => import('./Topic6Professional').then(m => m.Sim_spring_oscillator_pro),  { ssr: false });
const Sim_free_fall_drag_pro     = dynamic(() => import('./Topic6Professional').then(m => m.Sim_free_fall_drag_pro),     { ssr: false });
const Sim_atwood_machine_pro     = dynamic(() => import('./Topic6Professional').then(m => m.Sim_atwood_machine_pro),     { ssr: false });
const Sim_inclined_plane_pro     = dynamic(() => import('./Topic6Professional').then(m => m.Sim_inclined_plane_pro),     { ssr: false });
const Sim_circular_motion_pro    = dynamic(() => import('./Topic6Professional').then(m => m.Sim_circular_motion_pro),    { ssr: false });
const Sim_impulse_momentum_pro   = dynamic(() => import('./Topic6Professional').then(m => m.Sim_impulse_momentum_pro),   { ssr: false });
const Sim_car_braking_pro        = dynamic(() => import('./Topic6Professional').then(m => m.Sim_car_braking_pro),        { ssr: false });
const Sim_vector_addition_pro    = dynamic(() => import('./Topic6Professional').then(m => m.Sim_vector_addition_pro),    { ssr: false });
const Sim_explosion_recoil_pro   = dynamic(() => import('./Topic6Professional').then(m => m.Sim_explosion_recoil_pro),   { ssr: false });
const Sim_friction_transition    = dynamic(() => import('./Topic6Professional').then(m => m.Sim_friction_transition),    { ssr: false });
const Sim_horizontal_throw_pro   = dynamic(() => import('./Topic6Professional').then(m => m.Sim_horizontal_throw_pro),   { ssr: false });
const Sim_newtons_cradle_pro     = dynamic(() => import('./Topic6Professional').then(m => m.Sim_newtons_cradle_pro),     { ssr: false });
const Sim_fma_graph_pro          = dynamic(() => import('./Topic6Professional').then(m => m.Sim_fma_graph_pro),          { ssr: false });

/* ══════════════════════════════════════════════════════════════════
 * PROFESSIONAL TIER 7 — Ultra-realistic advanced physics sims
 * 15 more fully-animated simulations from Topic7Professional.tsx
 * ══════════════════════════════════════════════════════════════════ */
const Sim_wind_tunnel            = dynamic(() => import('./Topic7Professional').then(m => m.Sim_wind_tunnel),            { ssr: false });
const Sim_seatbelt_demo          = dynamic(() => import('./Topic7Professional').then(m => m.Sim_seatbelt_demo),          { ssr: false });
const Sim_galileo_plane          = dynamic(() => import('./Topic7Professional').then(m => m.Sim_galileo_plane),          { ssr: false });
const Sim_elevator_accel         = dynamic(() => import('./Topic7Professional').then(m => m.Sim_elevator_accel),         { ssr: false });
const Sim_net_force_lab          = dynamic(() => import('./Topic7Professional').then(m => m.Sim_net_force_lab),          { ssr: false });
const Sim_stopping_distance_pro  = dynamic(() => import('./Topic7Professional').then(m => m.Sim_stopping_distance_pro),  { ssr: false });
const Sim_paired_magnets         = dynamic(() => import('./Topic7Professional').then(m => m.Sim_paired_magnets),         { ssr: false });
const Sim_propeller_thrust       = dynamic(() => import('./Topic7Professional').then(m => m.Sim_propeller_thrust),       { ssr: false });
const Sim_air_hockey             = dynamic(() => import('./Topic7Professional').then(m => m.Sim_air_hockey),             { ssr: false });
const Sim_billiards_2d           = dynamic(() => import('./Topic7Professional').then(m => m.Sim_billiards_2d),           { ssr: false });
const Sim_rocket_fuel_burn       = dynamic(() => import('./Topic7Professional').then(m => m.Sim_rocket_fuel_burn),       { ssr: false });
const Sim_superball_rebound      = dynamic(() => import('./Topic7Professional').then(m => m.Sim_superball_rebound),      { ssr: false });
const Sim_force_table_lab        = dynamic(() => import('./Topic7Professional').then(m => m.Sim_force_table_lab),        { ssr: false });
const Sim_centripetal_lab        = dynamic(() => import('./Topic7Professional').then(m => m.Sim_centripetal_lab),        { ssr: false });
const Sim_momentum_explosion_2d  = dynamic(() => import('./Topic7Professional').then(m => m.Sim_momentum_explosion_2d),  { ssr: false });

/* ══════════════════════════════════════════════════════════════════
 * PROFESSIONAL TIER 8 — 15 ultra-professional physics simulations
 * Topic8Professional.tsx: orbital slingshot, double pendulum,
 * 2D collision lab, friction lab, projectile range, spring SHM,
 * elevator weight, circular motion, terminal velocity, airbag
 * impulse, rolling incline, force decomposition, fluid buoyancy,
 * momentum split, resonance demo
 * ══════════════════════════════════════════════════════════════════ */
const Sim_orbital_slingshot  = dynamic(() => import('./Topic8Professional').then(m => m.Sim_orbital_slingshot),  { ssr: false });
const Sim_double_pendulum    = dynamic(() => import('./Topic8Professional').then(m => m.Sim_double_pendulum),    { ssr: false });
const Sim_collision_lab_2d   = dynamic(() => import('./Topic8Professional').then(m => m.Sim_collision_lab_2d),   { ssr: false });
const Sim_friction_lab       = dynamic(() => import('./Topic8Professional').then(m => m.Sim_friction_lab),       { ssr: false });
const Sim_projectile_range   = dynamic(() => import('./Topic8Professional').then(m => m.Sim_projectile_range),   { ssr: false });
const Sim_spring_shm         = dynamic(() => import('./Topic8Professional').then(m => m.Sim_spring_shm),         { ssr: false });
const Sim_elevator_weight    = dynamic(() => import('./Topic8Professional').then(m => m.Sim_elevator_weight),    { ssr: false });
const Sim_circular_centripetal = dynamic(() => import('./Topic8Professional').then(m => m.Sim_circular_centripetal), { ssr: false });
const Sim_terminal_velocity  = dynamic(() => import('./Topic8Professional').then(m => m.Sim_terminal_velocity),  { ssr: false });
const Sim_impulse_airbag     = dynamic(() => import('./Topic8Professional').then(m => m.Sim_impulse_airbag),     { ssr: false });
const Sim_rolling_incline    = dynamic(() => import('./Topic8Professional').then(m => m.Sim_rolling_incline),    { ssr: false });
const Sim_force_decomposition = dynamic(() => import('./Topic8Professional').then(m => m.Sim_force_decomposition), { ssr: false });
const Sim_fluid_buoyancy     = dynamic(() => import('./Topic8Professional').then(m => m.Sim_fluid_buoyancy),     { ssr: false });
const Sim_momentum_split     = dynamic(() => import('./Topic8Professional').then(m => m.Sim_momentum_split),     { ssr: false });
const Sim_resonance_demo     = dynamic(() => import('./Topic8Professional').then(m => m.Sim_resonance_demo),     { ssr: false });

/* ══════════════════════════════════════════════════════════════════
 * PROFESSIONAL TIER 9 — 15 brand-new ultra-realistic canvas sims
 * Topic9Professional.tsx: elastic/inelastic collision comparator,
 * Newton's 2nd law track, inclined plane analyzer, centripetal,
 * rocket propulsion, projectile with drag, pulley MA, spring SHM,
 * 2D momentum sandbox, impulse duration, FBD builder, Newton's
 * cradle, terminal velocity, 2D vector addition, energy track
 * ══════════════════════════════════════════════════════════════════ */
const Sim_collision_comparator         = dynamic(() => import('./Topic9Professional').then(m => m.Sim_collision_comparator),         { ssr: false });
const Sim_newton_second_track          = dynamic(() => import('./Topic9Professional').then(m => m.Sim_newton_second_track),          { ssr: false });
const Sim_inclined_force_lab           = dynamic(() => import('./Topic9Professional').then(m => m.Sim_inclined_force_lab),           { ssr: false });
const Sim_centripetal_force_explorer   = dynamic(() => import('./Topic9Professional').then(m => m.Sim_centripetal_force_explorer),   { ssr: false });
const Sim_rocket_variable_mass         = dynamic(() => import('./Topic9Professional').then(m => m.Sim_rocket_variable_mass),         { ssr: false });
const Sim_projectile_air_drag          = dynamic(() => import('./Topic9Professional').then(m => m.Sim_projectile_air_drag),          { ssr: false });
const Sim_pulley_mechanical_advantage  = dynamic(() => import('./Topic9Professional').then(m => m.Sim_pulley_mechanical_advantage),  { ssr: false });
const Sim_spring_damping_oscillator    = dynamic(() => import('./Topic9Professional').then(m => m.Sim_spring_damping_oscillator),    { ssr: false });
const Sim_momentum_2d_sandbox          = dynamic(() => import('./Topic9Professional').then(m => m.Sim_momentum_2d_sandbox),          { ssr: false });
const Sim_impulse_force_duration       = dynamic(() => import('./Topic9Professional').then(m => m.Sim_impulse_force_duration),       { ssr: false });
const Sim_fbd_interactive_builder      = dynamic(() => import('./Topic9Professional').then(m => m.Sim_fbd_interactive_builder),      { ssr: false });
const Sim_newtons_cradle_physics       = dynamic(() => import('./Topic9Professional').then(m => m.Sim_newtons_cradle_physics),       { ssr: false });
const Sim_free_fall_terminal           = dynamic(() => import('./Topic9Professional').then(m => m.Sim_free_fall_terminal),           { ssr: false });
const Sim_vector_force_addition_2d     = dynamic(() => import('./Topic9Professional').then(m => m.Sim_vector_force_addition_2d),     { ssr: false });
const Sim_energy_conservation_track    = dynamic(() => import('./Topic9Professional').then(m => m.Sim_energy_conservation_track),    { ssr: false });

/* ══════════════════════════════════════════════════════════════════
 * PROFESSIONAL TIER 10 — 28 brand-new advanced physics simulations
 * Topic10Professional.tsx: lunar lander, planet gravity drop, cannon
 * angles, crumple zone, spring catapult, centripetal cut, reaction
 * braking, pendulum energy, feather vacuum, fluid drag shapes,
 * collision lab, firework momentum, Newton sandbox, rolling slope,
 * airbag impulse, earth/moon drop, satellite orbit, swimming,
 * tug of war, molecular gas, cricket impulse, momentum graph,
 * parachute phases, archery, balloon car, trebuchet, roller coaster,
 * force superposition
 * ══════════════════════════════════════════════════════════════════ */
const Sim_lunar_lander               = dynamic(() => import('./Topic10Professional').then(m => m.Sim_lunar_lander),               { ssr: false });
const Sim_gravity_planets_drop       = dynamic(() => import('./Topic10Professional').then(m => m.Sim_gravity_planets_drop),       { ssr: false });
const Sim_cannon_angles              = dynamic(() => import('./Topic10Professional').then(m => m.Sim_cannon_angles),              { ssr: false });
const Sim_crumple_zone               = dynamic(() => import('./Topic10Professional').then(m => m.Sim_crumple_zone),               { ssr: false });
const Sim_spring_catapult            = dynamic(() => import('./Topic10Professional').then(m => m.Sim_spring_catapult),            { ssr: false });
const Sim_centripetal_cut            = dynamic(() => import('./Topic10Professional').then(m => m.Sim_centripetal_cut),            { ssr: false });
const Sim_reaction_braking           = dynamic(() => import('./Topic10Professional').then(m => m.Sim_reaction_braking),           { ssr: false });
const Sim_pendulum_energy            = dynamic(() => import('./Topic10Professional').then(m => m.Sim_pendulum_energy),            { ssr: false });
const Sim_feather_vacuum             = dynamic(() => import('./Topic10Professional').then(m => m.Sim_feather_vacuum),             { ssr: false });
const Sim_fluid_drag_shapes          = dynamic(() => import('./Topic10Professional').then(m => m.Sim_fluid_drag_shapes),          { ssr: false });
const Sim_collision_lab_pro          = dynamic(() => import('./Topic10Professional').then(m => m.Sim_collision_lab_pro),          { ssr: false });
const Sim_firework_momentum          = dynamic(() => import('./Topic10Professional').then(m => m.Sim_firework_momentum),          { ssr: false });
const Sim_newton_sandbox             = dynamic(() => import('./Topic10Professional').then(m => m.Sim_newton_sandbox),             { ssr: false });
const Sim_rolling_slope_mass         = dynamic(() => import('./Topic10Professional').then(m => m.Sim_rolling_slope_mass),         { ssr: false });
const Sim_airbag_impulse             = dynamic(() => import('./Topic10Professional').then(m => m.Sim_airbag_impulse),             { ssr: false });
const Sim_earth_moon_drop            = dynamic(() => import('./Topic10Professional').then(m => m.Sim_earth_moon_drop),            { ssr: false });
const Sim_satellite_orbit_pro        = dynamic(() => import('./Topic10Professional').then(m => m.Sim_satellite_orbit_pro),        { ssr: false });
const Sim_swimming_propulsion_pro    = dynamic(() => import('./Topic10Professional').then(m => m.Sim_swimming_propulsion_pro),    { ssr: false });
const Sim_tug_of_war_analysis        = dynamic(() => import('./Topic10Professional').then(m => m.Sim_tug_of_war_analysis),        { ssr: false });
const Sim_molecular_gas              = dynamic(() => import('./Topic10Professional').then(m => m.Sim_molecular_gas),              { ssr: false });
const Sim_cricket_impulse            = dynamic(() => import('./Topic10Professional').then(m => m.Sim_cricket_impulse),            { ssr: false });
const Sim_momentum_graph             = dynamic(() => import('./Topic10Professional').then(m => m.Sim_momentum_graph),             { ssr: false });
const Sim_parachute_phases           = dynamic(() => import('./Topic10Professional').then(m => m.Sim_parachute_phases),           { ssr: false });
const Sim_archery_launch             = dynamic(() => import('./Topic10Professional').then(m => m.Sim_archery_launch),             { ssr: false });
const Sim_balloon_rocket_car         = dynamic(() => import('./Topic10Professional').then(m => m.Sim_balloon_rocket_car),         { ssr: false });
const Sim_trebuchet                  = dynamic(() => import('./Topic10Professional').then(m => m.Sim_trebuchet),                  { ssr: false });
const Sim_roller_coaster             = dynamic(() => import('./Topic10Professional').then(m => m.Sim_roller_coaster),             { ssr: false });
const Sim_force_superposition        = dynamic(() => import('./Topic10Professional').then(m => m.Sim_force_superposition),        { ssr: false });

/* ── Topic 11 Professional (28) — ultra-professional physics simulations ── */
const Sim_bridge_load_forces = dynamic(() => import('./Topic11Professional').then(m => m.Sim_bridge_load_forces), { ssr: false });
const Sim_hot_air_balloon    = dynamic(() => import('./Topic11Professional').then(m => m.Sim_hot_air_balloon),    { ssr: false });
const Sim_curling_stone      = dynamic(() => import('./Topic11Professional').then(m => m.Sim_curling_stone),      { ssr: false });
const Sim_space_debris       = dynamic(() => import('./Topic11Professional').then(m => m.Sim_space_debris),       { ssr: false });
const Sim_electric_car       = dynamic(() => import('./Topic11Professional').then(m => m.Sim_electric_car),       { ssr: false });
const Sim_rocket_engine      = dynamic(() => import('./Topic11Professional').then(m => m.Sim_rocket_engine),      { ssr: false });
const Sim_elevator_dynamics  = dynamic(() => import('./Topic11Professional').then(m => m.Sim_elevator_dynamics),  { ssr: false });
const Sim_gun_recoil         = dynamic(() => import('./Topic11Professional').then(m => m.Sim_gun_recoil),         { ssr: false });
const Sim_rowing_boat_v11    = dynamic(() => import('./Topic11Professional').then(m => m.Sim_rowing_boat),        { ssr: false });
const Sim_billiards_break    = dynamic(() => import('./Topic11Professional').then(m => m.Sim_billiards_break),    { ssr: false });
const Sim_ice_skaters        = dynamic(() => import('./Topic11Professional').then(m => m.Sim_ice_skaters),        { ssr: false });
const Sim_newtons_cradle_v11 = dynamic(() => import('./Topic11Professional').then(m => m.Sim_newtons_cradle),     { ssr: false });
const Sim_ballistic_pendulum_v11 = dynamic(() => import('./Topic11Professional').then(m => m.Sim_ballistic_pendulum), { ssr: false });
const Sim_projectile_2d_v11  = dynamic(() => import('./Topic11Professional').then(m => m.Sim_projectile_2d),  { ssr: false });
const Sim_gas_piston_v11     = dynamic(() => import('./Topic11Professional').then(m => m.Sim_gas_piston),     { ssr: false });
const Sim_inclined_plane_v11 = dynamic(() => import('./Topic11Professional').then(m => m.Sim_inclined_plane_pro), { ssr: false });
const Sim_atwood_machine_v11 = dynamic(() => import('./Topic11Professional').then(m => m.Sim_atwood_machine), { ssr: false });
const Sim_force_superposition_v11 = dynamic(() => import('./Topic11Professional').then(m => m.Sim_force_superposition_pro), { ssr: false });
const Sim_cannon_ship_v11    = dynamic(() => import('./Topic11Professional').then(m => m.Sim_cannon_ship),    { ssr: false });
const Sim_impulse_momentum_v11 = dynamic(() => import('./Topic11Professional').then(m => m.Sim_impulse_momentum), { ssr: false });
const Sim_spring_hooke_v11   = dynamic(() => import('./Topic11Professional').then(m => m.Sim_spring_hooke),   { ssr: false });
const Sim_fbd_builder_v11    = dynamic(() => import('./Topic11Professional').then(m => m.Sim_fbd_builder_pro),    { ssr: false });
const Sim_circular_motion_v11 = dynamic(() => import('./Topic11Professional').then(m => m.Sim_circular_motion_pro), { ssr: false });
const Sim_friction_types_v11 = dynamic(() => import('./Topic11Professional').then(m => m.Sim_friction_types), { ssr: false });
const Sim_gravity_well_v11   = dynamic(() => import('./Topic11Professional').then(m => m.Sim_gravity_well),   { ssr: false });
const Sim_explosion_momentum_v11 = dynamic(() => import('./Topic11Professional').then(m => m.Sim_explosion_momentum), { ssr: false });
const Sim_pendulum_conservation_v11 = dynamic(() => import('./Topic11Professional').then(m => m.Sim_pendulum_conservation), { ssr: false });
const Sim_momentum_graph_v11 = dynamic(() => import('./Topic11Professional').then(m => m.Sim_momentum_graph_pro), { ssr: false });

/* ══════════════════════════════════════════════════════════════════
 * SIMULATION REGISTRY — maps string ID → React component
 * IDs use kebab-case (matching the simulationIds in topic content files)
 * ══════════════════════════════════════════════════════════════════ */
export const SIMULATION_REGISTRY: Record<string, ComponentType<any>> = {

  /* ── Topic 1: Balanced/Unbalanced Forces (15 + 5 + 8 + 2 premium = 30) ── */
  "balanced-ice":          Sim_balanced_ice,
  "unbalanced-ice":        Sim_unbalanced_ice,
  "balanced-wood":         Sim_balanced_wood,
  "unbalanced-wood":       Sim_unbalanced_wood,
  "balanced-space":        Sim_balanced_space,
  "unbalanced-space":      Sim_unbalanced_space,
  "heavy-balanced":        Sim_heavy_balanced,
  "heavy-unbalanced":      Sim_heavy_unbalanced,
  "light-balanced":        Sim_light_balanced,
  "light-unbalanced":      Sim_light_unbalanced,
  "tug-of-war-tie":        Sim_tug_of_war_tie,
  "tug-of-war-win":        Sim_tug_of_war_win,
  "extreme-balanced":      Sim_extreme_balanced,
  "extreme-unbalanced":    Sim_extreme_unbalanced,
  "micro-forces":          Sim_micro_forces,
  "fbd-builder":           Sim_fbd_builder,
  "elevator-scale":        Sim_elevator_scale,
  "parachute-terminal":    Sim_parachute_terminal,
  "spring-balance":        Sim_spring_balance,
  "friction-surfaces":     Sim_friction_surfaces,
  "inclined-plane":        Sim_inclined_plane,
  "atwood-machine":        Sim_atwood_machine,
  "buoyancy-forces":       Sim_buoyancy_forces,
  "vector-2d":             Sim_vector_2d,
  "gravity-planets":       Sim_gravity_planets,
  "bridge-tension":        Sim_bridge_tension,
  "seesaw-torque":         Sim_seesaw_torque,
  "satellite-orbit":       Sim_satellite_orbit,
  "crane-load-balancer":   Sim_crane_load_balancer,
  "banked-curve":          Sim_banked_curve,

  /* ── Topic 2: First Law / Inertia (15 + 5 + 7 + 2 premium = 29 → +1 needed but close) ── */
  "inertia-rest":          Sim_inertia_rest,
  "inertia-motion-space":  Sim_inertia_motion_space,
  "inertia-heavy":         Sim_inertia_heavy,
  "inertia-light":         Sim_inertia_light,
  "friction-stop":         Sim_friction_stop,
  "ice-slide":             Sim_ice_slide,
  "sudden-push":           Sim_sudden_push,
  "sudden-pull":           Sim_sudden_pull,
  "space-push":            Sim_space_push,
  "space-coast":           Sim_space_coast,
  "train-start":           Sim_train_start,
  "train-stop":            Sim_train_stop,
  "coin-flick":            Sim_coin_flick,
  "book-slide":            Sim_book_slide,
  "hovercraft":            Sim_hovercraft,
  "tablecloth-pull":       Sim_tablecloth_pull,
  "bus-passengers":        Sim_bus_passengers,
  "coin-stack-flick":      Sim_coin_stack_flick,
  "ball-on-train":         Sim_ball_on_train,
  "hammer-head":           Sim_hammer_head,
  "crash-test":            Sim_crash_test,
  "marble-tube":           Sim_marble_tube,
  "spinning-skater":       Sim_spinning_skater,
  "pendulum-inertia":      Sim_pendulum_inertia,
  "detailed-coin-flick":   Sim_detailed_coin_flick,
  "friction-removal":      Sim_friction_removal,
  "bus-jerk":              Sim_bus_jerk,
  "galileo-ramp":          Sim_galileo_ramp,
  "iss-microgravity":      Sim_iss_microgravity,

  /* ── Topic 3: Second Law F=ma (15 + 5 + 7 + 3 premium = 30) ── */
  "fma-standard":              Sim_fma_standard,
  "fma-double-mass":           Sim_fma_double_mass,
  "fma-double-force":          Sim_fma_double_force,
  "fma-friction":              Sim_fma_friction,
  "fma-heavy-friction":        Sim_fma_heavy_friction,
  "fma-micro":                 Sim_fma_micro,
  "fma-macro":                 Sim_fma_macro,
  "fma-opposing":              Sim_fma_opposing,
  "fma-braking":               Sim_fma_braking,
  "fma-rocket":                Sim_fma_rocket,
  "fma-asteroid":              Sim_fma_asteroid,
  "fma-bullet":                Sim_fma_bullet,
  "fma-tug":                   Sim_fma_tug,
  "fma-equilibrium":           Sim_fma_equilibrium,
  "fma-breakaway":             Sim_fma_breakaway,
  "fma-calculator":            Sim_fma_calculator,
  "ramp-race":                 Sim_ramp_race,
  "braking-distance":          Sim_braking_distance,
  "force-acceleration-graph":  Sim_force_acceleration_graph,
  "mass-comparison":           Sim_mass_comparison,
  "fma-live-graph":            Sim_fma_live_graph,
  "impulse-demo":              Sim_impulse_demo,
  "variable-mass-rocket":      Sim_variable_mass_rocket,
  "sports-fma":                Sim_sports_fma,
  "spring-mass-oscillator":    Sim_spring_mass_oscillator,
  "braking-calc":              Sim_braking_calc,
  "fma-race":                  Sim_fma_race,
  "pulley-system":             Sim_pulley_system,
  "elevator-fma":              Sim_elevator_fma,
  "drag-race":                 Sim_drag_race,

  /* ── Topic 4: Third Law (15 + 5 + 6 + 4 premium = 30) ── */
  "action-reaction-push":      Sim_action_reaction_push,
  "recoil-gun":                Sim_recoil_gun,
  "rocket-launch":             Sim_rocket_launch,
  "swimmer-wall":              Sim_swimmer_wall,
  "walking-friction":          Sim_walking_friction,
  "ice-skater":                Sim_ice_skater,
  "bird-flight":               Sim_bird_flight,
  "boat-jump":                 Sim_boat_jump,
  "balloon-air":               Sim_balloon_air,
  "firehose":                  Sim_firehose,
  "hammer-nail":               Sim_hammer_nail,
  "car-tires":                 Sim_car_tires,
  "spring-push":               Sim_spring_push,
  "magnet-repel":              Sim_magnet_repel,
  "cannon-fire":               Sim_cannon_fire,
  "rocket-propulsion":         Sim_rocket_propulsion,
  "balloon-jet":               Sim_balloon_jet,
  "book-on-table-reaction":    Sim_book_on_table_reaction,
  "wall-push-skater":          Sim_wall_push_skater,
  "horse-cart-paradox":        Sim_horse_cart_paradox,
  "jet-engine":                Sim_jet_engine,
  "astronaut-push":            Sim_astronaut_push,
  "swimming-propulsion":       Sim_swimming_propulsion,
  "spring-release":            Sim_spring_release,
  "horse-cart-resolved":       Sim_horse_cart_resolved,
  "trampoline-bounce":         Sim_trampoline_bounce,
  "skateboard-push":           Sim_skateboard_push,
  "rowing-boat":               Sim_rowing_boat,
  "fire-extinguisher-cart":    Sim_fire_extinguisher_cart,
  "newtons-cradle-advanced":   Sim_newtons_cradle_advanced,

  /* ── Topic 5: Conservation of Momentum (15 + 5 + 7 + 3 premium = 30) ── */
  "momentum-heavy":            Sim_momentum_heavy,
  "momentum-fast":             Sim_momentum_fast,
  "momentum-collision":        Sim_momentum_collision,
  "momentum-stop":             Sim_momentum_stop,
  "momentum-bullet":           Sim_momentum_bullet,
  "momentum-train":            Sim_momentum_train,
  "momentum-change":           Sim_momentum_change,
  "momentum-braking":          Sim_momentum_braking,
  "momentum-zero":             Sim_momentum_zero,
  "momentum-asteroid":         Sim_momentum_asteroid,
  "momentum-pingpong":         Sim_momentum_pingpong,
  "momentum-impulse1":         Sim_momentum_impulse1,
  "momentum-impulse2":         Sim_momentum_impulse2,
  "momentum-reverse":          Sim_momentum_reverse,
  "momentum-constant":         Sim_momentum_constant,
  "collision-lab":             Sim_collision_lab,
  "newtons-cradle":            Sim_newtons_cradle,
  "billiards-shot":            Sim_billiards_shot,
  "explosion-demo":            Sim_explosion_demo,
  "rocket-equation":           Sim_rocket_equation,
  "ballistic-pendulum":        Sim_ballistic_pendulum,
  "2d-collision":              Sim_2d_collision,
  "rocket-staging":            Sim_rocket_staging,
  "ice-skater-collision":      Sim_ice_skater_collision,
  "momentum-timeline":         Sim_momentum_timeline,
  "recoil-calculator":         Sim_recoil_calculator,
  "momentum-quiz":             Sim_momentum_quiz,
  "car-crash-analysis":        Sim_car_crash_analysis,
  "fireworks-explosion":       Sim_fireworks_explosion,
  "pool-table":                Sim_pool_table,

  /* ── Topic 6 Professional (15) ── distributed across all 5 topics ── */
  "projectile-motion-pro":     Sim_projectile_motion_pro,
  "simple-pendulum-pro":       Sim_simple_pendulum_pro,
  "spring-oscillator-pro":     Sim_spring_oscillator_pro,
  "free-fall-drag-pro":        Sim_free_fall_drag_pro,
  "atwood-machine-pro":        Sim_atwood_machine_pro,
  "inclined-plane-pro":        Sim_inclined_plane_pro,
  "circular-motion-pro":       Sim_circular_motion_pro,
  "impulse-momentum-pro":      Sim_impulse_momentum_pro,
  "car-braking-pro":           Sim_car_braking_pro,
  "vector-addition-pro":       Sim_vector_addition_pro,
  "explosion-recoil-pro":      Sim_explosion_recoil_pro,
  "friction-transition":       Sim_friction_transition,
  "horizontal-throw-pro":      Sim_horizontal_throw_pro,
  "newtons-cradle-pro":        Sim_newtons_cradle_pro,
  "fma-graph-pro":             Sim_fma_graph_pro,

  /* ── Topic 7 Professional (15) ── even more advanced physics sims ── */
  "wind-tunnel":               Sim_wind_tunnel,
  "seatbelt-demo":             Sim_seatbelt_demo,
  "galileo-plane":             Sim_galileo_plane,
  "elevator-accel":            Sim_elevator_accel,
  "net-force-lab":             Sim_net_force_lab,
  "stopping-distance-pro":     Sim_stopping_distance_pro,
  "paired-magnets":            Sim_paired_magnets,
  "propeller-thrust":          Sim_propeller_thrust,
  "air-hockey":                Sim_air_hockey,
  "billiards-2d":              Sim_billiards_2d,
  "rocket-fuel-burn":          Sim_rocket_fuel_burn,
  "superball-rebound":         Sim_superball_rebound,
  "force-table-lab":           Sim_force_table_lab,
  "centripetal-lab":           Sim_centripetal_lab,
  "momentum-explosion-2d":     Sim_momentum_explosion_2d,

  /* ── Topic 8 Professional (15) ── ultra-professional physics sims ── */
  "orbital-slingshot":         Sim_orbital_slingshot,
  "double-pendulum":           Sim_double_pendulum,
  "collision-lab-2d":          Sim_collision_lab_2d,
  "friction-lab":              Sim_friction_lab,
  "projectile-range":          Sim_projectile_range,
  "spring-shm":                Sim_spring_shm,
  "elevator-weight":           Sim_elevator_weight,
  "circular-centripetal":      Sim_circular_centripetal,
  "terminal-velocity":         Sim_terminal_velocity,
  "impulse-airbag":            Sim_impulse_airbag,
  "rolling-incline":           Sim_rolling_incline,
  "force-decomposition":       Sim_force_decomposition,
  "fluid-buoyancy":            Sim_fluid_buoyancy,
  "momentum-split":            Sim_momentum_split,
  "resonance-demo":            Sim_resonance_demo,

  /* ── Topic 9 Professional (15) — ultra-realistic new physics sims ── */
  "collision-comparator":        Sim_collision_comparator,
  "newton-second-track":         Sim_newton_second_track,
  "inclined-force-lab":          Sim_inclined_force_lab,
  "centripetal-force-explorer":  Sim_centripetal_force_explorer,
  "rocket-variable-mass":        Sim_rocket_variable_mass,
  "projectile-air-drag":         Sim_projectile_air_drag,
  "pulley-mechanical-advantage": Sim_pulley_mechanical_advantage,
  "spring-damping-oscillator":   Sim_spring_damping_oscillator,
  "momentum-2d-sandbox":         Sim_momentum_2d_sandbox,
  "impulse-force-duration":      Sim_impulse_force_duration,
  "fbd-interactive-builder":     Sim_fbd_interactive_builder,
  "newtons-cradle-physics":      Sim_newtons_cradle_physics,
  "free-fall-terminal":          Sim_free_fall_terminal,
  "vector-force-addition-2d":    Sim_vector_force_addition_2d,
  "energy-conservation-track":   Sim_energy_conservation_track,

  /* ── Topic 10 Professional (28) — new advanced CBSE Class 9 physics sims ── */
  "lunar-lander":                Sim_lunar_lander,
  "gravity-planets-drop":        Sim_gravity_planets_drop,
  "cannon-angles":               Sim_cannon_angles,
  "crumple-zone":                Sim_crumple_zone,
  "spring-catapult":             Sim_spring_catapult,
  "centripetal-cut":             Sim_centripetal_cut,
  "reaction-braking":            Sim_reaction_braking,
  "pendulum-energy":             Sim_pendulum_energy,
  "feather-vacuum":              Sim_feather_vacuum,
  "fluid-drag-shapes":           Sim_fluid_drag_shapes,
  "collision-lab-pro":           Sim_collision_lab_pro,
  "firework-momentum":           Sim_firework_momentum,
  "newton-sandbox":              Sim_newton_sandbox,
  "rolling-slope-mass":          Sim_rolling_slope_mass,
  "airbag-impulse":              Sim_airbag_impulse,
  "earth-moon-drop":             Sim_earth_moon_drop,
  "satellite-orbit-pro":         Sim_satellite_orbit_pro,
  "swimming-propulsion-pro":     Sim_swimming_propulsion_pro,
  "tug-of-war-analysis":         Sim_tug_of_war_analysis,
  "molecular-gas":               Sim_molecular_gas,
  "cricket-impulse":             Sim_cricket_impulse,
  "momentum-graph":              Sim_momentum_graph,
  "parachute-phases":            Sim_parachute_phases,
  "archery-launch":              Sim_archery_launch,
  "balloon-rocket-car":          Sim_balloon_rocket_car,
  "trebuchet":                   Sim_trebuchet,
  "roller-coaster":              Sim_roller_coaster,
  "force-superposition":         Sim_force_superposition,

  /* ── Topic 11 Professional (28) ── */
  "bridge-load-forces-v11":      Sim_bridge_load_forces,
  "hot-air-balloon-v11":         Sim_hot_air_balloon,
  "curling-stone-v11":           Sim_curling_stone,
  "space-debris-v11":            Sim_space_debris,
  "electric-car-v11":            Sim_electric_car,
  "rocket-engine-v11":           Sim_rocket_engine,
  "elevator-dynamics-v11":       Sim_elevator_dynamics,
  "gun-recoil-v11":              Sim_gun_recoil,
  "rowing-boat-v11":             Sim_rowing_boat_v11,
  "billiards-break-v11":         Sim_billiards_break,
  "ice-skaters-v11":             Sim_ice_skaters,
  "newtons-cradle-v11":          Sim_newtons_cradle_v11,
  "ballistic-pendulum-v11":      Sim_ballistic_pendulum_v11,
  "projectile-2d-v11":           Sim_projectile_2d_v11,
  "gas-piston-v11":              Sim_gas_piston_v11,
  "inclined-plane-v11":          Sim_inclined_plane_v11,
  "atwood-machine-v11":          Sim_atwood_machine_v11,
  "force-superposition-v11":     Sim_force_superposition_v11,
  "cannon-ship-v11":             Sim_cannon_ship_v11,
  "impulse-momentum-v11":        Sim_impulse_momentum_v11,
  "spring-hooke-v11":            Sim_spring_hooke_v11,
  "fbd-builder-v11":             Sim_fbd_builder_v11,
  "circular-motion-v11":         Sim_circular_motion_v11,
  "friction-types-v11":          Sim_friction_types_v11,
  "gravity-well-v11":            Sim_gravity_well_v11,
  "explosion-momentum-v11":      Sim_explosion_momentum_v11,
  "pendulum-conservation-v11":   Sim_pendulum_conservation_v11,
  "momentum-graph-v11":          Sim_momentum_graph_v11,
};

/* ══════════════════════════════════════════════════════════════════════
 * LazySimulation — mounts a simulation only when it scrolls into view.
 * Uses IntersectionObserver with a 300px rootMargin so each canvas
 * component is mounted just before the user reaches it, not all at once.
 * This prevents 30 simultaneous requestAnimationFrame loops.
 * ══════════════════════════════════════════════════════════════════════ */
interface LazySimProps {
  id: string;
  Comp: ComponentType<any>;
}

function LazySimulation({ id, Comp }: LazySimProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    /* Fallback for environments without IntersectionObserver */
    if (typeof IntersectionObserver === "undefined") { setVisible(true); return; }

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { rootMargin: "300px 0px", threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} id={`sim-${id}`}>
      {visible ? (
        <Comp />
      ) : (
        <div style={{
          height: 380, borderRadius: 18, background: "#0b1120",
          border: "1px solid #1e293b", display: "flex", alignItems: "center",
          justifyContent: "center", color: "#334155", fontSize: 14,
          fontFamily: "Inter, system-ui, sans-serif",
        }}>
          ⏳ Loading simulation…
        </div>
      )}
    </div>
  );
}

/* ── Renderer component — used by topic pages to render all simulations ── */
interface SimulationRendererProps {
  simulationIds: string[];
}

export default function SimulationRenderer({ simulationIds }: SimulationRendererProps) {
  if (!simulationIds || simulationIds.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, margin: "32px 0" }}>
      {simulationIds.map((id) => {
        const Comp = SIMULATION_REGISTRY[id];
        if (!Comp) {
          console.warn(`[SimulationRegistry] No component found for simulation ID: "${id}"`);
          return null;
        }
        return <LazySimulation key={id} id={id} Comp={Comp} />;
      })}
    </div>
  );
}
