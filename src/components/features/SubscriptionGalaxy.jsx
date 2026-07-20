import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency } from '../../utils/helpers';
import { Sparkles, Orbit } from 'lucide-react';
import { motion } from 'framer-motion';

export const SubscriptionGalaxy = ({ subscriptions = [], totalSpend = 0, currency = 'INR' }) => {
  const activeSubs = subscriptions.filter(s => s.status === 'active');
  const { isDark } = useTheme();

  // Distribute subscriptions into 3 orbits based on cost / billing cycle
  const orbits = {
    inner: [],
    middle: [],
    outer: []
  };

  activeSubs.forEach(sub => {
    const costInINR = sub.currency === 'USD' ? sub.cost * 83 : sub.cost;
    
    if (sub.billingCycle === 'weekly' || costInINR < 300) {
      orbits.inner.push(sub);
    } else if (sub.billingCycle === 'yearly' || costInINR > 1500) {
      orbits.outer.push(sub);
    } else {
      orbits.middle.push(sub);
    }
  });

  const renderPlanet = (sub, index, totalCount, radius) => {
    const angle = (360 / totalCount) * index;
    const x = Math.round(radius * Math.cos((angle * Math.PI) / 180));
    const y = Math.round(radius * Math.sin((angle * Math.PI) / 180));

    // Size of planet based on cost
    const costNorm = Math.min(sub.cost, 3000);
    const size = Math.round(28 + (costNorm / 3000) * 24);

    return (
      <div
        key={sub.id}
        className="absolute transition-transform duration-300"
        style={{
          left: `calc(50% + ${x}px - ${size/2}px)`,
          top: `calc(50% + ${y}px - ${size/2}px)`,
        }}
      >
        {/* Anti-rotation wrapper */}
        <div className="orbit-counter-1">
          <motion.div
            className="relative cursor-pointer group"
            style={{ width: size, height: size }}
            whileHover={{ scale: 1.25, zIndex: 50 }}
          >
            {/* Pulsing ring around planet */}
            <div 
              className="absolute inset-[-4px] rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-all duration-300 animate-pulse"
              style={{ backgroundColor: sub.color || '#8b5cf6' }}
            />
            
            {/* Planet Body */}
            <div 
              className="w-full h-full rounded-full border-2 overflow-hidden flex items-center justify-center p-1.5 shadow-lg transition-all duration-300"
              style={{ 
                borderColor: sub.color || '#8b5cf6',
                backgroundColor: isDark ? '#0b0b1a' : '#ffffff' 
              }}
            >
              {sub.logo ? (
                <img 
                  src={sub.logo} 
                  alt={sub.name} 
                  className="w-full h-full object-contain" 
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <span 
                className="text-[10px] font-bold text-white uppercase hidden" 
                style={{ display: sub.logo ? 'none' : 'block' }}
              >
                {sub.name.charAt(0)}
              </span>
            </div>

            {/* Hover Tooltip CARD */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 w-36">
              <div className="glass-premium p-2.5 rounded-xl border border-brand-purple/20 text-center shadow-2xl">
                <p className="t-text font-bold text-xs font-display truncate">{sub.name}</p>
                <p className="text-brand-cyan text-xs font-extrabold mt-0.5">
                  {formatCurrency(sub.cost, sub.currency)}
                </p>
                <span className="text-[9px] t-text-muted capitalize block mt-0.5 font-medium">
                  {sub.billingCycle}
                </span>
              </div>
              <div className="w-2 h-2 t-bg-card border-r border-b t-border rotate-45 absolute top-full left-1/2 -translate-x-1/2 -translate-y-1" />
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full aspect-square max-w-[460px] mx-auto flex items-center justify-center bg-mesh rounded-full border t-border p-4 overflow-hidden orbit-pause">
      
      {/* Central Star - Total Spending */}
      <motion.div 
        className="z-10 w-36 h-36 rounded-full glass-premium border border-brand-purple/30 flex flex-col items-center justify-center text-center shadow-[0_0_40px_rgba(139,92,246,0.25)] select-none cursor-pointer"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 1 }}
        whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(139,92,246,0.35)' }}
      >
        <Sparkles size={16} className="text-brand-cyan mb-1 animate-pulse" />
        <span className="text-[10px] t-text-muted uppercase tracking-widest font-extrabold">Total Monthly</span>
        <span className="text-xl font-black font-display t-text mt-1">
          {formatCurrency(totalSpend, currency)}
        </span>
        <span className="text-[10px] t-text-secondary mt-0.5 flex items-center gap-0.5 font-bold">
          <Orbit size={10} className="animate-spin text-brand-purple" /> {activeSubs.length} Active
        </span>
      </motion.div>

      {/* Orbit Ring 1 - Inner */}
      <div className={`absolute w-[180px] h-[180px] rounded-full border border-dashed pointer-events-none ${isDark ? 'border-white/10' : 'border-slate-300'}`} />
      {orbits.inner.length > 0 && (
        <div className="absolute w-[180px] h-[180px] rounded-full orbit-container-1">
          {orbits.inner.map((sub, idx) => renderPlanet(sub, idx, orbits.inner.length, 90))}
        </div>
      )}

      {/* Orbit Ring 2 - Middle */}
      <div className={`absolute w-[290px] h-[290px] rounded-full border border-dashed pointer-events-none ${isDark ? 'border-white/10' : 'border-slate-300'}`} />
      {orbits.middle.length > 0 && (
        <div className="absolute w-[290px] h-[290px] rounded-full orbit-container-2">
          {orbits.middle.map((sub, idx) => renderPlanet(sub, idx, orbits.middle.length, 145))}
        </div>
      )}

      {/* Orbit Ring 3 - Outer */}
      <div className={`absolute w-[400px] h-[400px] rounded-full border border-dashed pointer-events-none ${isDark ? 'border-white/10' : 'border-slate-300'}`} />
      {orbits.outer.length > 0 && (
        <div className="absolute w-[400px] h-[400px] rounded-full orbit-container-3">
          {orbits.outer.map((sub, idx) => renderPlanet(sub, idx, orbits.outer.length, 200))}
        </div>
      )}

      {/* Floating Constellation Stars */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className={`absolute top-[15%] left-[20%] w-1.5 h-1.5 rounded-full animate-ping ${isDark ? 'bg-white' : 'bg-purple-600'}`} />
        <div className="absolute top-[80%] left-[10%] w-2 h-2 bg-brand-cyan rounded-full animate-pulse" />
        <div className="absolute top-[30%] left-[85%] w-1.5 h-1.5 bg-brand-purple rounded-full animate-pulse" />
        <div className={`absolute top-[75%] left-[70%] w-1.5 h-1.5 rounded-full animate-ping ${isDark ? 'bg-white' : 'bg-indigo-600'}`} />
      </div>
    </div>
  );
};
