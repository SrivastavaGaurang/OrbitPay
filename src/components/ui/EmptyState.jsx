import React from 'react';
import { Sparkles, Plus } from 'lucide-react';
import { GradientButton } from './GradientButton';

export const EmptyState = ({ title = 'No Subscriptions Found', description = 'Start tracking your monthly expenses and unlock insights.', onAction, actionLabel = 'Add Subscription' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-2xl glass border border-white/5 text-center max-w-md mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-purple/20 to-brand-cyan/20 border border-brand-purple/30 flex items-center justify-center text-brand-purple mb-6 animate-bounce">
        <Sparkles size={28} className="text-brand-cyan" />
      </div>
      <h3 className="text-xl font-bold text-white font-display mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-6 leading-relaxed">{description}</p>
      {onAction && (
        <GradientButton onClick={onAction} variant="purple-cyan" className="flex items-center gap-1.5 text-sm">
          <Plus size={16} /> {actionLabel}
        </GradientButton>
      )}
    </div>
  );
};
