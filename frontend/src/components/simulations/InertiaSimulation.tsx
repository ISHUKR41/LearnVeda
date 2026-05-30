"use client";

import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

export default function InertiaSimulation() {
  const [isFlicked, setIsFlicked] = useState(false);
  const cardControls = useAnimation();
  const coinControls = useAnimation();

  const handleFlick = async () => {
    if (isFlicked) return;
    setIsFlicked(true);
    
    // Flick the card away quickly
    cardControls.start({
      x: 300,
      opacity: 0,
      rotate: 45,
      transition: { duration: 0.3, ease: "easeIn" }
    });

    // The coin falls straight down due to gravity, staying in place horizontally due to inertia
    await new Promise(resolve => setTimeout(resolve, 150));
    coinControls.start({
      y: 120,
      transition: { type: "spring", bounce: 0.4, duration: 0.6 }
    });
  };

  const handleReset = () => {
    setIsFlicked(false);
    cardControls.set({ x: 0, opacity: 1, rotate: 0 });
    coinControls.set({ y: 0 });
  };

  return (
    <div className="w-full bg-[#0f172a] rounded-2xl p-6 my-8 border border-white/10 shadow-2xl relative">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-white mb-2">Law of Inertia: Coin and Card</h3>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Flick the card quickly. Because of inertia of rest, the coin tends to stay exactly where it is horizontally. 
          When the support (card) is removed, gravity pulls the coin straight down into the glass.
        </p>
      </div>

      <div className="relative h-64 flex flex-col items-center justify-end mb-8 overflow-hidden">
        {/* The Glass */}
        <div className="relative w-24 h-32 border-4 border-t-0 border-blue-400/50 rounded-b-xl bg-blue-500/10 backdrop-blur-sm flex justify-center pb-2 z-10">
          <div className="absolute top-0 w-full h-1 bg-blue-300/30"></div>
        </div>

        {/* The Card */}
        <motion.div
          animate={cardControls}
          className="absolute bottom-32 w-36 h-2 bg-amber-200 shadow-md rounded-sm z-20 cursor-pointer"
          onClick={handleFlick}
        />

        {/* The Coin */}
        <motion.div
          animate={coinControls}
          className="absolute bottom-[136px] w-10 h-10 bg-yellow-400 rounded-full shadow-lg border-2 border-yellow-500 flex items-center justify-center z-30"
        >
          <span className="text-yellow-700 font-bold text-xs">₹5</span>
        </motion.div>
      </div>

      <div className="flex justify-center gap-4">
        <button 
          onClick={handleFlick}
          disabled={isFlicked}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium text-sm"
        >
          Flick Card
        </button>
        <button 
          onClick={handleReset}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium text-sm"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
