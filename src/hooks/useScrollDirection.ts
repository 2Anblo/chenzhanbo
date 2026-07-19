'use client';

import { useState, useEffect, useRef } from 'react';

interface ScrollState {
  scrollY: number;
  direction: 'up' | 'down';
  isAtTop: boolean;
}

export function useScrollDirection(threshold = 10): ScrollState {
  const [scrollY, setScrollY] = useState(0);
  const [direction, setDirection] = useState<'up' | 'down'>('down');
  const ticking = useRef(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;
        const diff = y - lastScrollY.current;

        setScrollY(y);

        if (Math.abs(diff) >= threshold) {
          setDirection(diff > 0 ? 'down' : 'up');
          lastScrollY.current = y;
        }

        ticking.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return {
    scrollY,
    direction,
    isAtTop: scrollY < 80,
  };
}
