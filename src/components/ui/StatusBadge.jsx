import React from 'react';

export const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'paused':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'cancelled':
      case 'canceled':
      default:
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${getStyles()}`}>
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current animate-pulse" />
      {status}
    </span>
  );
};
