"use client";

import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";

export default function ThirdLawSimulation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const leftControls = useAnimation();
  const rightControls = useAnimation();
  const [showForce, setShowForce] = useState(false);

  const handlePush = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setShowForce(true);

    // Show force vectors briefly before they separate
    await new Promise(resolve => setTimeout(resolve, 800));
    setShowForce(false);

    // Both push away from each other
    leftControls.start({
      x: -150,
      transition: { duration: 1.5, ease: "easeOut" }
    });

    await rightControls.start({
      x: 150,
      transition: { duration: 1.5, ease: "easeOut" }
    });

    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setShowForce(false);
    leftControls.set({ x: 0 });
    rightControls.set({ x: 0 });
  };

  return (
    <div className="w-full bg-[#0f172a] rounded-2xl p-6 my-8 border border-white/10 shadow-2xl relative">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-white mb-2">Third Law: Action & Reaction</h3>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          When the person on the left pushes the person on the right (Action), the person on the right 
          simultaneously exerts an equal and opposite force on the left person (Reaction). Both move backward!
        </p>
      </div>

      <div className="relative h-48 bg-slate-900 rounded-xl mb-8 flex items-end justify-center overflow-hidden">
        {/* Ice / Ground */}
        <div className="absolute bottom-0 w-full h-8 bg-cyan-900/40 border-t border-cyan-500/30"></div>

        {/* Left Person (Action) */}
        <motion.div
          animate={leftControls}
          className="absolute bottom-8 right-1/2 translate-x-[-5px] flex flex-col items-center"
        >
          {showForce && (
            <div className="absolute -top-10 -right-20 flex flex-col items-center animate-pulse">
              <span className="text-xs text-red-400 font-bold mb-1 whitespace-nowrap">Action Force (F)</span>
              <div className="w-16 h-1 bg-red-500 relative">
                <div className="absolute right-0 -top-1 w-0 h-0 border-t-4 border-t-transparent border-l-[6px] border-l-red-500 border-b-4 border-b-transparent"></div>
              </div>
            </div>
          )}
          <div className="w-12 h-12 bg-blue-500 rounded-full border-2 border-blue-300 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <span className="text-xl">🧑‍🚀</span>
          </div>
          <div className="w-16 h-16 bg-blue-600/20 mt-1 rounded-t-3xl border-t-2 border-blue-500/50"></div>
        </motion.div>

        {/* Right Person (Reaction) */}
        <motion.div
          animate={rightControls}
          className="absolute bottom-8 left-1/2 translate-x-[5px] flex flex-col items-center"
        >
          {showForce && (
            <div className="absolute -top-4 -left-20 flex flex-col items-center animate-pulse">
              <div className="w-16 h-1 bg-green-500 relative mb-1">
                <div className="absolute left-0 -top-1 w-0 h-0 border-t-4 border-t-transparent border-r-[6px] border-r-green-500 border-b-4 border-b-transparent"></div>
              </div>
              <span className="text-xs text-green-400 font-bold whitespace-nowrap">Reaction Force (-F)</span>
            </div>
          )}
          <div className="w-12 h-12 bg-rose-500 rounded-full border-2 border-rose-300 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.5)]">
            <span className="text-xl">👩‍🚀</span>
          </div>
          <div className="w-16 h-16 bg-rose-600/20 mt-1 rounded-t-3xl border-t-2 border-rose-500/50"></div>
        </motion.div>
      </div>

      <div className="flex justify-center gap-4">
        <button 
          onClick={handlePush}
          disabled={isPlaying}
          className="px-6 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-lg transition-colors font-medium text-sm"
        >
          Push (Action!)
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
