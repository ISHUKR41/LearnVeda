"use client";

import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

export default function SecondLawSimulation() {
  const [force, setForce] = useState(50);
  const [mass, setMass] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const objectControls = useAnimation();
  const acceleration = force / mass;

  const handlePush = async () => {
    if (isPlaying) return;
    setIsPlaying(true);

    objectControls.set({ x: 0 });

    // Since a = F/m, distance x = 0.5 * a * t^2. 
    // If we set a fixed distance of 300px, t = sqrt(2*300 / a)
    const distance = 300;
    // Scale acceleration for visual purposes
    const visualA = acceleration * 10; 
    const time = Math.sqrt((2 * distance) / visualA);

    await objectControls.start({
      x: distance,
      transition: { duration: time, ease: "easeIn" }
    });

    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    objectControls.set({ x: 0 });
  };

  return (
    <div className="w-full bg-[#0f172a] rounded-2xl p-6 my-8 border border-white/10 shadow-2xl relative">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Second Law: F = ma</h3>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Observe how the same force produces less acceleration on a heavier mass, and vice versa.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-slate-800/50 p-4 rounded-xl">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Applied Force: {force} N</label>
          <input 
            type="range" min="10" max="100" value={force} 
            onChange={(e) => setForce(Number(e.target.value))}
            disabled={isPlaying}
            className="w-full accent-green-500"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Mass of Object: {mass} kg</label>
          <input 
            type="range" min="5" max="50" step="5" value={mass} 
            onChange={(e) => setMass(Number(e.target.value))}
            disabled={isPlaying}
            className="w-full accent-purple-500"
          />
        </div>
      </div>

      <div className="flex justify-between items-center mb-4 px-4 text-sm font-mono bg-slate-900 p-2 rounded text-slate-300">
        <span>Force = {force} N</span>
        <span>Mass = {mass} kg</span>
        <span className="text-purple-400 font-bold">Acceleration = {acceleration.toFixed(2)} m/s²</span>
      </div>

      <div className="relative h-40 bg-slate-900 rounded-xl mb-8 flex items-end overflow-hidden">
        {/* Track */}
        <div className="absolute bottom-0 w-full h-2 bg-slate-700"></div>

        {/* The Object */}
        <motion.div
          animate={objectControls}
          style={{ 
            width: 40 + mass * 1.5, 
            height: 40 + mass * 1.5 
          }}
          className="absolute bottom-2 left-10 bg-purple-500 rounded-md border-2 border-purple-400 flex flex-col items-center justify-center text-white shadow-lg"
        >
          <span className="font-bold text-sm">{mass}kg</span>
        </motion.div>

        {/* Force Arrow visualization - only shows when playing or about to play */}
        <motion.div
          animate={objectControls}
          className="absolute bottom-6 left-[-20px] h-2 bg-green-500 rounded-full flex items-center justify-end"
          style={{ width: force }}
        >
          <div className="w-0 h-0 border-t-4 border-t-transparent border-l-[6px] border-l-green-500 border-b-4 border-b-transparent translate-x-[4px]"></div>
        </motion.div>
      </div>

      <div className="flex justify-center gap-4">
        <button 
          onClick={handlePush}
          disabled={isPlaying}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg transition-colors font-medium text-sm"
        >
          Apply Force
        </button>
        <button 
          onClick={handleReset}
          disabled={isPlaying}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg transition-colors font-medium text-sm"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
