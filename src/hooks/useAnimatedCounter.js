import { useState, useEffect } from 'react';

export const useAnimatedCounter = (target, duration = 1000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseFloat(target) || 0;
    if (end === 0) {
      setCount(0);
      return;
    }

    const totalFrames = Math.round((duration / 1000) * 60); // 60fps
    let frame = 0;

    const animate = () => {
      frame++;
      const progress = frame / totalFrames;
      // Easing out quadratic
      const easedProgress = progress * (2 - progress);
      const current = end * easedProgress;

      if (frame < totalFrames) {
        setCount(current);
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return count;
};
