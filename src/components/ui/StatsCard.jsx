import React from 'react';
import { GlassCard } from './GlassCard';
import { AnimatedCounter } from './AnimatedCounter';
import * as Icons from 'lucide-react';

export const StatsCard = ({ title, value, prefix = '', suffix = '', decimals = 0, icon, trend, trendLabel, delay = 0 }) => {
  const IconComponent = Icons[icon] || Icons.HelpCircle;

  return (
    <GlassCard className="flex flex-col justify-between" delay={delay}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</span>
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-brand-purple">
          <IconComponent size={20} />
        </div>
      </div>
      
      <div>
        <h3 className="text-3xl font-bold font-display text-white mb-2">
          <AnimatedCounter 
            value={value} 
            prefix={prefix} 
            suffix={suffix} 
            decimals={decimals} 
          />
        </h3>
        
        {trend !== undefined && (
          <div className="flex items-center gap-1.5 text-sm">
            <span className={`flex items-center font-semibold ${trend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend >= 0 ? '+' : ''}{trend}%
            </span>
            <span className="text-gray-500">{trendLabel || 'vs last month'}</span>
          </div>
        )}
      </div>
    </GlassCard>
  );
};
