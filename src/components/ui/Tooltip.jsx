import React, { useState } from 'react';

export const Tooltip = ({ content, children, position = 'top' }) => {
  const [active, setActive] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      {children}
      {active && (
        <div className={`absolute z-30 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 border border-white/10 rounded-lg shadow-xl whitespace-nowrap ${positionClasses[position]}`}>
          {content}
          {/* Arrow */}
          <div className={`absolute w-1.5 h-1.5 bg-slate-900 border-r border-b border-white/10 rotate-45 ${
            position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -translate-y-[3px]' :
            position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 translate-y-[3px]' :
            position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -translate-x-[3px]' :
            'right-full top-1/2 -translate-y-1/2 translate-x-[3px]'
          }`} />
        </div>
      )}
    </div>
  );
};
