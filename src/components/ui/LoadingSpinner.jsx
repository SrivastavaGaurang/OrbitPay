import React from 'react';

export const LoadingSpinner = ({ size = 'md', fullscreen = false }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4'
  };

  const spinner = (
    <div className="relative">
      <div className={`rounded-full border-white/10 ${sizeClasses[size]}`} />
      <div className={`absolute inset-0 rounded-full border-t-brand-purple border-r-brand-cyan animate-spin ${sizeClasses[size]}`} />
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 t-bg-deep flex flex-col items-center justify-center gap-4">
        {spinner}
        <span className="text-sm font-medium text-gray-400 font-display tracking-widest uppercase animate-pulse">
          Loading OrbitPay...
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-6">
      {spinner}
    </div>
  );
};
