import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({ value, onChange, placeholder = 'Search subscriptions...', onClear }) => {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
        <Search size={18} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 rounded-xl glass border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-brand-purple/40 transition-colors text-sm"
      />
      {value && (
        <button
          onClick={onClear || (() => onChange(''))}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
