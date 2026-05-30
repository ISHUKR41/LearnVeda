"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export interface ForceEngineConfig {
  initialMass: number;
  initialVelocity: number;
  frictionCoefficient: number;
  environmentName: string;
  allowUserMassChange?: boolean;
  allowUserForceChange?: boolean;
  presetForceLeft?: number;
  presetForceRight?: number;
  scenarioDescription: string;
}

export default function ForceEngine({ config }: { config: ForceEngineConfig }) {
  const [mass, setMass] = useState(config.initialMass);
  const [forceLeft, setForceLeft] = useState(config.presetForceLeft || 0);
  const [forceRight, setForceRight] = useState(config.presetForceRight || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Physics state
  const physicsState = useRef({
    x: 0,
    v: config.initialVelocity,
    a: 0,
    lastTime: 0
  });

  const [displayState, setDisplayState] = useState({ x: 0, v: config.initialVelocity, a: 0 });
  const reqRef = useRef<number>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePhysics = (time: number) => {
    if (!physicsState.current.lastTime) {
      physicsState.current.lastTime = time;
      reqRef.current = requestAnimationFrame(updatePhysics);
      return;
    }

    const dt = (time - physicsState.current.lastTime) / 1000; // seconds
    physicsState.current.lastTime = time;

    const netAppliedForce = forceRight - forceLeft;
    
    // Friction calculation (f = mu * N = mu * m * g)
    const gravity = 9.8;
    const maxFriction = config.frictionCoefficient * mass * gravity;
    
    let actualFriction = 0;
    
    if (physicsState.current.v > 0) {
      actualFriction = -maxFriction;
    } else if (physicsState.current.v < 0) {
      actualFriction = maxFriction;
    } else {
      // If stationary, static friction opposes applied force up to maxFriction
      if (Math.abs(netAppliedForce) <= maxFriction) {
        actualFriction = -netAppliedForce;
      } else {
        actualFriction = netAppliedForce > 0 ? -maxFriction : maxFriction;
      }
    }

    const netForce = netAppliedForce + actualFriction;
    const a = netForce / mass;
    
    physicsState.current.a = a;
    physicsState.current.v += a * dt;
    
    // Stop completely if velocity is tiny and acceleration is near zero due to friction
    if (Math.abs(physicsState.current.v) < 0.1 && Math.abs(netAppliedForce) <= maxFriction) {
      physicsState.current.v = 0;
      physicsState.current.a = 0;
    }

    physicsState.current.x += physicsState.current.v * dt * 10; // *10 for visual scale (pixels/m)

    // Wrap around screen
    if (containerRef.current) {
      const width = containerRef.current.clientWidth;
      if (physicsState.current.x > width / 2 + 50) physicsState.current.x = -width / 2 - 50;
      if (physicsState.current.x < -width / 2 - 50) physicsState.current.x = width / 2 + 50;
    }

    setDisplayState({
      x: physicsState.current.x,
      v: physicsState.current.v,
      a: physicsState.current.a
    });

    reqRef.current = requestAnimationFrame(updatePhysics);
  };

  useEffect(() => {
    if (isPlaying) {
      physicsState.current.lastTime = performance.now();
      reqRef.current = requestAnimationFrame(updatePhysics);
    } else {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    }
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [isPlaying, forceLeft, forceRight, mass]);

  const handleReset = () => {
    setIsPlaying(false);
    physicsState.current = { x: 0, v: config.initialVelocity, a: 0, lastTime: 0 };
    setDisplayState({ x: 0, v: config.initialVelocity, a: 0 });
    setForceLeft(config.presetForceLeft || 0);
    setForceRight(config.presetForceRight || 0);
    setMass(config.initialMass);
  };

  return (
    <div className="w-full bg-[#0b1120] rounded-2xl p-6 my-8 border border-slate-800 shadow-2xl relative overflow-hidden font-sans">
      <div className="mb-6 border-b border-slate-800 pb-4">
        <h3 className="text-xl font-bold text-white mb-2">Physics Sandbox: {config.environmentName}</h3>
        <p className="text-slate-400 text-sm">{config.scenarioDescription}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="col-span-1 md:col-span-3">
          <div ref={containerRef} className="relative h-64 border-b-4 border-slate-600 bg-gradient-to-b from-transparent to-slate-900/50 flex items-end justify-center overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            
            {/* The Object */}
            <motion.div
              className="absolute bottom-0 w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-[0_0_30px_rgba(79,70,229,0.4)] flex flex-col items-center justify-center z-10 border-2 border-indigo-300"
              style={{ x: displayState.x }}
            >
              <span className="text-white font-bold text-2xl">{mass} kg</span>
              
              {/* Force Vectors */}
              {forceRight > 0 && (
                <div className="absolute top-1/2 -right-4 translate-x-full -translate-y-1/2 flex items-center">
                  <div className="h-2 bg-emerald-500" style={{ width: `${Math.min(forceRight, 150)}px` }}></div>
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-emerald-500 border-b-[8px] border-b-transparent"></div>
                  <span className="ml-2 text-emerald-400 font-mono font-bold whitespace-nowrap">{forceRight} N</span>
                </div>
              )}
              {forceLeft > 0 && (
                <div className="absolute top-1/2 -left-4 -translate-x-full -translate-y-1/2 flex items-center flex-row-reverse">
                  <div className="h-2 bg-rose-500" style={{ width: `${Math.min(forceLeft, 150)}px` }}></div>
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-r-[12px] border-r-rose-500 border-b-[8px] border-b-transparent"></div>
                  <span className="mr-2 text-rose-400 font-mono font-bold whitespace-nowrap">{forceLeft} N</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Dashboard */}
        <div className="col-span-1 bg-slate-900 rounded-xl p-4 border border-slate-800 flex flex-col gap-4">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">Telemetry</div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Velocity</span>
              <span className="text-cyan-400 font-mono">{displayState.v.toFixed(2)} m/s</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full transition-all" style={{ width: `${Math.min(Math.abs(displayState.v) * 2, 100)}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Acceleration</span>
              <span className="text-amber-400 font-mono">{displayState.a.toFixed(2)} m/s²</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full transition-all" style={{ width: `${Math.min(Math.abs(displayState.a) * 5, 100)}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Net Force</span>
              <span className="text-purple-400 font-mono">{(forceRight - forceLeft).toFixed(1)} N</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Friction Coeff</span>
              <span className="text-slate-300 font-mono">μ = {config.frictionCoefficient}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 bg-slate-900/50 p-6 rounded-xl border border-slate-800">
        {config.allowUserForceChange !== false && (
          <>
            <div>
              <label className="block text-rose-400 text-sm font-bold mb-3 flex justify-between">
                <span>Push Left (N)</span>
                <span>{forceLeft}</span>
              </label>
              <input type="range" min="0" max="200" value={forceLeft} onChange={(e) => setForceLeft(Number(e.target.value))} className="w-full accent-rose-500" />
            </div>
            <div>
              <label className="block text-emerald-400 text-sm font-bold mb-3 flex justify-between">
                <span>Push Right (N)</span>
                <span>{forceRight}</span>
              </label>
              <input type="range" min="0" max="200" value={forceRight} onChange={(e) => setForceRight(Number(e.target.value))} className="w-full accent-emerald-500" />
            </div>
          </>
        )}
        
        {config.allowUserMassChange !== false && (
          <div>
            <label className="block text-indigo-400 text-sm font-bold mb-3 flex justify-between">
              <span>Mass (kg)</span>
              <span>{mass}</span>
            </label>
            <input type="range" min="1" max="100" value={mass} onChange={(e) => setMass(Number(e.target.value))} className="w-full accent-indigo-500" />
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4">
        <button onClick={() => setIsPlaying(!isPlaying)} className={`px-8 py-3 rounded-xl font-bold transition-all ${isPlaying ? 'bg-rose-500/20 text-rose-500 border border-rose-500/50 hover:bg-rose-500/30' : 'bg-emerald-500 text-slate-900 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'}`}>
          {isPlaying ? "PAUSE SIMULATION" : "RUN SIMULATION"}
        </button>
        <button onClick={handleReset} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors font-semibold">
          RESET
        </button>
      </div>
    </div>
  );
}
