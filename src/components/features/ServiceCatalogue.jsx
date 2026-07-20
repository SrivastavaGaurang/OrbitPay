import React, { useState } from 'react';
import { SERVICE_CATALOGUE } from '../../utils/constants';
import { Search, Grid, Plus } from 'lucide-react';

export const ServiceCatalogue = ({ onSelectService }) => {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', 'entertainment', 'utilities', 'work', 'health', 'education'];

  const filteredServices = SERVICE_CATALOGUE.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-5">
      {/* Search and Category Filter Header */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search popular services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl glass border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-brand-purple/40 text-xs"
          />
        </div>
        
        <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs capitalize font-medium transition-colors border select-none whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-brand-purple border-brand-purple text-white shadow-lg shadow-brand-purple/15'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List of Catalog Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[420px] overflow-y-auto pr-1">
        {filteredServices.map((service) => {
          const { name, logo, color, defaultCost, defaultCurrency, defaultCycle } = service;
          return (
            <div
              key={name}
              onClick={() => onSelectService(service)}
              className="group cursor-pointer rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 p-3 flex flex-col items-center text-center transition-all duration-300 relative overflow-hidden"
            >
              {/* Brand outline glow on hover */}
              <div 
                className="absolute inset-x-0 top-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity" 
                style={{ backgroundColor: color }} 
              />
              
              {/* Circle Logo */}
              <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-1.5 overflow-hidden mb-3 transition-transform duration-300 group-hover:scale-110">
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
                  className="w-full h-full flex items-center justify-center text-sm font-bold text-white uppercase"
                  style={{ display: logo ? 'none' : 'flex', backgroundColor: (color || '#8b5cf6') + '33' }}
                >
                  {name.charAt(0)}
                </div>
              </div>
              
              <span className="text-xs font-semibold text-white font-display truncate w-full">{name}</span>
              <span className="text-[10px] text-gray-400 mt-1 capitalize">{service.category}</span>
              
              {/* Hover Plus Button Overlay */}
              <div className="absolute right-2 bottom-2 w-5 h-5 rounded-md bg-brand-purple/20 text-brand-cyan group-hover:bg-brand-purple group-hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Plus size={12} />
              </div>
            </div>
          );
        })}
        {filteredServices.length === 0 && (
          <div className="col-span-full py-8 text-center text-gray-500 text-xs flex flex-col items-center gap-1.5">
            <Grid size={24} className="text-gray-600" />
            <span>No matching services found</span>
          </div>
        )}
      </div>
    </div>
  );
};
