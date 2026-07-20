import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = '', hoverEffect = true, onClick, delay = 0 }) => {
  const cardClasses = `glass rounded-2xl p-6 ${className} ${onClick ? 'cursor-pointer' : ''}`;
  
  if (hoverEffect) {
    return (
      <motion.div
        className={cardClasses}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ 
          y: -5, 
          borderColor: 'rgba(139, 92, 246, 0.4)',
          boxShadow: '0 10px 30px -10px rgba(139, 92, 246, 0.2)'
        }}
        whileTap={onClick ? { scale: 0.98 } : undefined}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cardClasses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
