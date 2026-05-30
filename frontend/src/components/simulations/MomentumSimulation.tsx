"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

export default function MomentumSimulation() {
  const [mass1, setMass1] = useState(1);
  const [mass2, setMass2] = useState(1);
  const [velocity1, setVelocity1] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [collisionHappened, setCollisionHappened] = useState(false);
  
  const block1Controls = useAnimation();
  const block2Controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  const calculateFinalVelocities = () => {
    // Perfectly elastic collision:
    // v1f = ((m1 - m2) / (m1 + m2)) * v1i
    // v2f = ((2 * m1) / (m1 + m2)) * v1i
    const v1f = ((mass1 - mass2) / (mass1 + mass2)) * velocity1;
    const v2f = ((2 * mass1) / (mass1 + mass2)) * velocity1;
    return { v1f, v2f };
  };

  const handlePlay = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setCollisionHappened(false);

    // Initial state
    block1Controls.set({ x: 0 });
    block2Controls.set({ x: 0 });

    const timeToCollide = 2 / velocity1; 

    // Move block 1 to collision point
    await block1Controls.start({
      x: 200, // Distance to block 2
      transition: { duration: timeToCollide, ease: "linear" }
    });

    setCollisionHappened(true);
    const { v1f, v2f } = calculateFinalVelocities();

    // After collision
    const p1 = block1Controls.start({
      x: 200 + (v1f * 20),
      transition: { duration: 1, ease: "linear" }
    });

    const p2 = block2Controls.start({
      x: v2f * 20,
      transition: { duration: 1, ease: "linear" }
    });

    await Promise.all([p1, p2]);
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCollisionHappened(false);
    block1Controls.set({ x: 0 });
    block2Controls.set({ x: 0 });
  };

  return (
    <div className="w-full bg-[#0f172a] rounded-2xl p-6 my-8 border border-white/10 shadow-2xl relative">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Conservation of Momentum (Elastic Collision)</h3>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Adjust the masses and initial velocity of the blue block. Observe how momentum (p = m × v) is transferred 
          to the red block upon collision.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-slate-800/50 p-4 rounded-xl">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Mass 1 (Blue Block): {mass1} kg</label>
          <input 
            type="range" min="1" max="5" value={mass1} 
            onChange={(e) => setMass1(Number(e.target.value))}
            disabled={isPlaying}
            className="w-full accent-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Mass 2 (Red Block): {mass2} kg</label>
          <input 
            type="range" min="1" max="5" value={mass2} 
            onChange={(e) => setMass2(Number(e.target.value))}
            disabled={isPlaying}
            className="w-full accent-red-500"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Initial Velocity (Blue): {velocity1} m/s</label>
          <input 
            type="range" min="2" max="10" value={velocity1} 
            onChange={(e) => setVelocity1(Number(e.target.value))}
            disabled={isPlaying}
            className="w-full accent-indigo-500"
          />
        </div>
      </div>

      <div className="relative h-32 bg-slate-900 rounded-xl mb-8 flex items-end overflow-hidden" ref={containerRef}>
        {/* Track */}
        <div className="absolute bottom-0 w-full h-2 bg-slate-700"></div>

        {/* Block 1 */}
        <motion.div
          animate={block1Controls}
          style={{ width: 40 + mass1 * 10, height: 40 + mass1 * 10 }}
          className="absolute bottom-2 left-10 bg-blue-500 border-2 border-blue-400 flex items-center justify-center text-white font-bold text-xs shadow-[0_0_15px_rgba(59,130,246,0.5)]"
        >
          {mass1}kg
        </motion.div>

        {/* Block 2 */}
        <motion.div
          animate={block2Controls}
          style={{ width: 40 + mass2 * 10, height: 40 + mass2 * 10 }}
          className="absolute bottom-2 left-[250px] bg-red-500 border-2 border-red-400 flex items-center justify-center text-white font-bold text-xs shadow-[0_0_15px_rgba(239,68,68,0.5)]"
        >
          {mass2}kg
        </motion.div>
      </div>

      <div className="flex justify-center gap-4">
        <button 
          onClick={handlePlay}
          disabled={isPlaying}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg transition-colors font-medium text-sm"
        >
          Play Collision
        </button>
        <button 
          onClick={handleReset}
          disabled={isPlaying}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg transition-colors font-medium text-sm"
        >
          Reset
        </button>
      </div>
      
      {collisionHappened && (
        <div className="mt-6 text-center text-sm text-emerald-400 bg-emerald-900/30 p-3 rounded-lg border border-emerald-800/50">
          <strong>Observation:</strong> Momentum before = {mass1 * velocity1} kg·m/s. Total momentum is conserved!
        </div>
      )}
    </div>
  );
}
