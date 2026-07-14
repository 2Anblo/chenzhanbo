'use client';

import { useCallback, useEffect } from 'react';
import { RotateCcw, StepForward } from 'lucide-react';
import Hero from '@/sections/Hero';
import { useTranslation } from '@/hooks/useTranslation';

interface IntroOverlayProps {
  open: boolean;
  showReplay: boolean;
  onSkip: () => void;
  onComplete: () => void;
  onReplay: () => void;
}

export default function IntroOverlay({
  open,
  showReplay,
  onSkip,
  onComplete,
  onReplay,
}: IntroOverlayProps) {
  const { t } = useTranslation();

  const handleSkip = useCallback(() => {
    onSkip();
  }, [onSkip]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleSkip();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleSkip, open]);

  useEffect(() => {
    document.documentElement.classList.toggle('intro-scroll-lock', open);

    return () => {
      document.documentElement.classList.remove('intro-scroll-lock');
    };
  }, [open]);

  return (
    <>
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-opacity duration-500 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {open && <Hero asIntro onComplete={onComplete} />}

        {open && (
          <button
            type="button"
            onClick={handleSkip}
            className="fixed bottom-6 right-6 z-10 flex items-center gap-2 rounded-lg border border-border bg-card/90 px-4 py-2 text-xs font-medium font-mono text-muted-foreground shadow-lg backdrop-blur transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={t('intro.skipAria')}
          >
            <StepForward size={14} aria-hidden="true" />
            <span>{t('intro.skip')}</span>
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px]">
              Esc
            </kbd>
          </button>
        )}
      </div>

      {showReplay && !open && (
        <button
          type="button"
          onClick={onReplay}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-border bg-card/90 px-4 py-2 text-xs font-medium font-mono text-muted-foreground shadow-lg backdrop-blur transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={t('intro.replayAria')}
        >
          <RotateCcw size={14} aria-hidden="true" />
          <span>{t('intro.replay')}</span>
        </button>
      )}
    </>
  );
}
