import React from 'react';
import { motion } from 'framer-motion';

export const GradientButton = ({ 
  children, 
  onClick, 
  type = 'button', 
  className = '', 
  variant = 'purple-cyan', 
  disabled = false,
  fullWidth = false 
}) => {
  const getGradient = () => {
    switch (variant) {
      case 'pink-purple':
        return 'background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)';
      case 'purple-cyan':
      default:
        return 'background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)';
    }
  };

  const buttonStyle = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative py-3 px-6 rounded-xl font-medium text-white transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-lg hover:shadow-brand-purple/20 ${buttonStyle} ${className}`}
      style={{
        background: variant === 'pink-purple' 
          ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' 
          : 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)'
      }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)'
      }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      {/* Gloss effect */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite]" />
    </motion.button>
  );
};
