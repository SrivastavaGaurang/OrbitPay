import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen t-bg-deep t-text flex flex-col items-center justify-center p-4 bg-mesh select-none font-sans">
      
      <motion.div
        className="w-full max-w-md glass-premium rounded-2xl p-8 border border-white/10 shadow-2xl text-center flex flex-col items-center gap-5"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring' }}
      >
        <div className="w-16 h-16 rounded-full bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple animate-pulse">
          <Sparkles size={28} className="text-brand-cyan" />
        </div>
        
        <div>
          <h2 className="text-5xl font-extrabold text-white font-display">404</h2>
          <h4 className="font-bold text-white text-md font-display mt-2">Space Orbit Lost</h4>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            The page you are trying to visit has drifted out of OrbitPay's tracking orbit. Check the URL or return home.
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 text-xs font-semibold mt-4 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Safety
        </button>
      </motion.div>
    </div>
  );
}
