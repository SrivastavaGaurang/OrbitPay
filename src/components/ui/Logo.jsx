import React from 'react';
import { motion } from 'framer-motion';

export const Logo = ({ size = 'md', showText = true, className = '' }) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-sm', badge: 'w-4 h-4' },
    md: { icon: 'w-9 h-9', text: 'text-lg', badge: 'w-5 h-5' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', badge: 'w-7 h-7' }
  };

  const { icon, text } = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Premium Futuristic Orbital Logo Mark */}
      <div className={`relative ${icon} rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-[1px] flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(139,92,246,0.4)]`}>
        <div className="w-full h-full rounded-xl bg-[#0a0a1a] flex items-center justify-center relative overflow-hidden">
          
          {/* Animated Glowing Ring */}
          <motion.div
            className="absolute inset-1 rounded-full border border-cyan-400/40"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />

          {/* Counter Rotating Ring */}
          <motion.div
            className="absolute inset-1.5 rounded-full border border-purple-500/40 border-dashed"
            animate={{ rotate: -360 }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          />

          {/* Central Pulsing Core */}
          <svg className="w-1/2 h-1/2 text-cyan-300 z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>

          {/* Small Orbiting Moon dot */}
          <motion.span
            className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
            animate={{
              x: [0, 10, 0, -10, 0],
              y: [-10, 0, 10, 0, -10]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col text-left">
          <span className={`font-black font-display tracking-tight text-white leading-none ${text}`}>
            Orbit<span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Pay</span>
          </span>
          <span className="text-[8px] font-bold tracking-widest text-cyan-400/80 uppercase mt-0.5">
            Subscription Command
          </span>
        </div>
      )}
    </div>
  );
};
