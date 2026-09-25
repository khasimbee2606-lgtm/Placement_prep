import React, { useState, useEffect } from 'react';

/**
 * AnimatedCounter
 * Smoothly animates numbers increasing (count-up effect)
 * Easing: ease-out cubic
 */
const AnimatedCounter = ({ end = 0, duration = 900, decimals = 0, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const target = Number(end) || 0;
    const startValue = 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (target - startValue) * easeOut;

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [end, duration]);

  const formatted = decimals > 0 ? count.toFixed(decimals) : Math.round(count);

  return (
    <span>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
