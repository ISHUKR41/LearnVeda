"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

export default function BalancedForcesSimulation() {
  const [leftForce, setLeftForce] = useState(50);
  const [rightForce, setRightForce] = useState(50);
  const controls = useAnimation();
  const boxRef = useRef<HTMLDivElement>(null);

  const netForce = rightForce - leftForce;

  useEffect(() => {
    if (netForce === 0) {
      controls.stop();
      controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
    } else {
      // Net force is not zero, box accelerates.
      // We simulate this by moving it infinitely in the direction of the force.
      const direction = netForce > 0 ? 1 : -1;
      controls.start({
        x: direction * 500,
        transition: { 
          duration: 100 / Math.abs(netForce), // Stronger force = faster duration
          ease: "easeIn",
          repeat: Infinity
        }
      });
    }
  }, [netForce, controls]);

  const handleReset = () => {
    setLeftForce(50);
    setRightForce(50);
    controls.stop();
    controls.set({ x: 0 });
  };

  return (
    <div className="w-full bg-[#0f172a] rounded-2xl p-6 my-8 border border-white/10 shadow-2xl overflow-hidden relative">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-white mb-2">Balanced & Unbalanced Forces</h3>
        <p className="text-slate-400 text-sm">
          Adjust the forces on both sides. When forces are equal (balanced), the net force is 0 and the object doesn't move. 
          When forces are unequal (unbalanced), the object accelerates in the direction of the greater force.
        </p>
      </div>

      <div className="relative h-48 border-b-2 border-slate-700 flex items-center justify-center mb-12">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* The Box */}
        <motion.div
          ref={boxRef}
          animate={controls}
          className="relative w-32 h-32 bg-indigo-600 rounded-xl shadow-[0_0_30px_rgba(79,70,229,0.3)] flex items-center justify-center z-10 border border-indigo-400"
          style={{ x: 0 }}
        >
          <span className="text-white font-bold text-lg">Mass</span>
          <div className="absolute -bottom-8 text-indigo-300 font-mono text-sm">
            Net Force: <span className={netForce === 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>{Math.abs(netForce)}N</span> {netForce !== 0 && (netForce > 0 ? "Right" : "Left")}
          </div>
        </motion.div>

        {/* Force Arrows */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 pointer-events-none z-20">
          {/* Left Arrow (Pulling Left) */}
          <div className="flex items-center" style={{ opacity: leftForce > 0 ? 1 : 0.3, width: `calc(50% - 64px)`, justifyContent: 'flex-start' }}>
             <div className="h-2 bg-rose-500 rounded-l-full relative transition-all duration-300" style={{ width: `${leftForce}%`, maxWidth: '100%' }}>
               <div className="absolute -left-3 -top-2 w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-rose-500 border-b-[10px] border-b-transparent"></div>
               <span className="absolute -top-8 left-0 text-rose-400 font-mono font-bold text-sm bg-slate-900/80 px-2 py-1 rounded">{leftForce}N</span>
             </div>
          </div>

          {/* Right Arrow (Pulling Right) */}
          <div className="flex items-center" style={{ opacity: rightForce > 0 ? 1 : 0.3, width: `calc(50% - 64px)`, justifyContent: 'flex-end' }}>
             <div className="h-2 bg-emerald-500 rounded-r-full relative transition-all duration-300" style={{ width: `${rightForce}%`, maxWidth: '100%' }}>
               <div className="absolute -right-3 -top-2 w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-emerald-500 border-b-[10px] border-b-transparent"></div>
               <span className="absolute -top-8 right-0 text-emerald-400 font-mono font-bold text-sm bg-slate-900/80 px-2 py-1 rounded">{rightForce}N</span>
             </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <label className="block text-rose-400 font-semibold mb-3 flex justify-between">
            <span>Force Left (N)</span>
            <span className="bg-slate-900 px-2 rounded">{leftForce}</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={leftForce}
            onChange={(e) => setLeftForce(Number(e.target.value))}
            className="w-full accent-rose-500"
          />
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <label className="block text-emerald-400 font-semibold mb-3 flex justify-between">
            <span>Force Right (N)</span>
            <span className="bg-slate-900 px-2 rounded">{rightForce}</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={rightForce}
            onChange={(e) => setRightForce(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </div>
      </div>
      
      <div className="flex justify-center">
        <button 
          onClick={handleReset}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium text-sm flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          Reset Simulation
        </button>
      </div>
    </div>
  );
}
