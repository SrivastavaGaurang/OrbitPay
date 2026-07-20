import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { StatusBadge } from './StatusBadge';
import { formatCurrency, daysUntilRenewal } from '../../utils/helpers';
import { MoreVertical, Calendar, CreditCard, Play, Pause, Trash2, Edit3, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SubscriptionCard = ({ subscription, onEdit, onStatusChange, onDelete, delay = 0 }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { id, name, logo, cost, currency, billingCycle, nextRenewal, status, category, paymentMethod, color } = subscription;
  
  const daysLeft = daysUntilRenewal(nextRenewal);
  
  // Calculate renewal urgency progress (30 days cycle)
  const percentRemaining = Math.max(0, Math.min(100, (daysLeft / 30) * 100));
  
  const handleToggleStatus = () => {
    const nextStatus = status === 'active' ? 'paused' : 'active';
    onStatusChange(id, nextStatus);
    setShowMenu(false);
  };

  return (
    <GlassCard className="relative overflow-visible" delay={delay}>
      {/* Brand Color Indicator Bar */}
      <div 
        className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl" 
        style={{ backgroundColor: color || '#8b5cf6' }} 
      />

      <div className="flex justify-between items-start pt-2 mb-4">
        <div className="flex items-center gap-3">
          {/* Logo container */}
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden p-1">
            {logo ? (
              <img 
                src={logo} 
                alt={name} 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="w-full h-full flex items-center justify-center text-lg font-bold text-white uppercase"
              style={{ display: logo ? 'none' : 'flex', backgroundColor: (color || '#8b5cf6') + '33' }}
            >
              {name.charAt(0)}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white text-lg font-display">{name}</h4>
            <span className="text-xs text-gray-400 capitalize">{category}</span>
          </div>
        </div>

        {/* Dropdown Menu Trigger */}
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)} 
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <MoreVertical size={18} />
          </button>
          
          <AnimatePresence>
            {showMenu && (
              <>
                {/* Click overlay to close */}
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <motion.div 
                  className="absolute right-0 mt-1 w-48 rounded-xl glass-premium border border-white/10 shadow-xl py-1.5 z-20"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <button 
                    onClick={() => { onEdit(subscription); setShowMenu(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                  >
                    <Edit3 size={14} className="text-brand-cyan" /> Edit Details
                  </button>
                  <button 
                    onClick={handleToggleStatus}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                  >
                    {status === 'active' ? (
                      <>
                        <Pause size={14} className="text-amber-400" /> Pause Subscription
                      </>
                    ) : (
                      <>
                        <Play size={14} className="text-emerald-400" /> Resume Subscription
                      </>
                    )}
                  </button>
                  <div className="border-t border-white/5 my-1" />
                  <button 
                    onClick={() => { onDelete(id, name); setShowMenu(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-2"
                  >
                    <Trash2 size={14} /> Remove Tracker
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Subscription Pricing */}
      <div className="mb-4">
        <span className="text-2xl font-bold text-white font-display">
          {formatCurrency(cost, currency)}
        </span>
        <span className="text-gray-400 text-sm"> / {billingCycle}</span>
      </div>

      <div className="border-t border-white/5 pt-3 flex flex-col gap-2.5">
        {/* Status & Payment Method */}
        <div className="flex justify-between items-center text-xs">
          <StatusBadge status={status} />
          <span className="text-gray-400 flex items-center gap-1">
            <CreditCard size={12} /> {paymentMethod || 'Card'}
          </span>
        </div>

        {/* Next Renewal Date */}
        {status === 'active' && nextRenewal && (
          <div className="mt-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400 flex items-center gap-1">
                <Calendar size={12} /> Renewal in
              </span>
              <span className={`font-semibold ${daysLeft <= 3 ? 'text-rose-400 font-bold' : 'text-brand-cyan'}`}>
                {daysLeft < 0 ? 'Overdue' : daysLeft === 0 ? 'Today' : `${daysLeft} days`}
              </span>
            </div>
            
            {/* Countdown Slider Progress Bar */}
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500" 
                style={{ 
                  width: `${percentRemaining}%`,
                  backgroundColor: daysLeft <= 3 ? '#f43f5e' : (color || '#06b6d4')
                }}
              />
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};
