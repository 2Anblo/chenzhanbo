'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const BOTTOM_THRESHOLD = 99.5;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

interface ReadingProgressButtonProps {
  contentSelector?: string;
  className?: string;
}

export default function ReadingProgressButton({
  contentSelector = '#blog-post-content',
  className,
}: ReadingProgressButtonProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const measureProgress = () => {
      frame = 0;

      const target = document.querySelector<HTMLElement>(contentSelector);
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;
      const targetRect = target?.getBoundingClientRect();
      const targetTop = targetRect ? targetRect.top + scrollTop : 0;
      const targetBottom = targetRect
        ? targetRect.bottom + scrollTop
        : document.documentElement.scrollHeight;
      const readableDistance = Math.max(targetBottom - viewportHeight - targetTop, 1);
      const nextProgress = ((scrollTop - targetTop) / readableDistance) * 100;
      const hasReachedBottom = scrollTop + viewportHeight >= targetBottom;

      setProgress(hasReachedBottom ? 100 : clamp(nextProgress, 0, 100));
    };

    const requestMeasure = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measureProgress);
    };

    measureProgress();
    window.addEventListener('scroll', requestMeasure, { passive: true });
    window.addEventListener('resize', requestMeasure);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener('scroll', requestMeasure);
      window.removeEventListener('resize', requestMeasure);
    };
  }, [contentSelector]);

  const isAtBottom = progress >= BOTTOM_THRESHOLD;
  const displayProgress = isAtBottom ? 100 : Math.min(100, Math.round(progress));
  const fillStyle: CSSProperties = { height: `${isAtBottom ? 100 : progress}%` };

  const handleClick = () => {
    if (!isAtBottom) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      aria-label={
        isAtBottom
          ? 'Reading complete, click to return to top'
          : `Reading progress ${displayProgress}%`
      }
      title={isAtBottom ? 'Back to top' : `Reading progress ${displayProgress}%`}
      onClick={handleClick}
      className={cn(
        'fixed bottom-5 right-5 z-40 flex size-12 items-center justify-center overflow-hidden rounded-lg border border-border bg-background/90 font-mono text-xs font-semibold shadow-lg shadow-black/10 backdrop-blur transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:bottom-8 md:right-8',
        isAtBottom ? 'cursor-pointer' : 'cursor-default',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 bg-primary/85 transition-[height] duration-150 ease-out"
        style={fillStyle}
      >
        {!isAtBottom && (
          <>
            <span className="reading-progress-wave absolute -left-6 -top-3 h-5 w-24 rounded-[45%] bg-background/65" />
            <span className="reading-progress-wave reading-progress-wave--slow absolute -left-8 -top-4 h-6 w-28 rounded-[48%] bg-primary-foreground/35" />
          </>
        )}
      </span>
      <span
        className={cn(
          'relative z-10 drop-shadow-sm',
          isAtBottom ? 'text-primary-foreground' : 'text-foreground',
        )}
      >
        {isAtBottom ? <ArrowUp size={18} strokeWidth={2.25} aria-hidden="true" /> : `${displayProgress}%`}
      </span>
    </button>
  );
}
