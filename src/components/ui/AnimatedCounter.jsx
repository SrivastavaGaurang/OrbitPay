import React from 'react';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';

export const AnimatedCounter = ({ value, duration = 1200, prefix = '', suffix = '', decimals = 0 }) => {
  const animatedValue = useAnimatedCounter(value, duration);

  const formatted = animatedValue.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  return (
    <span>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};
