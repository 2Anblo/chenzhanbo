'use client';

import { useCallback, useEffect } from 'react';
import { RotateCcw, StepForward } from 'lucide-react';
import ImmersiveIntro from '@/components/ImmersiveIntro';
import { Button } from '@/components/ui/button';
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
        {open && <ImmersiveIntro onEnter={onComplete} />}

        {open && (
          <button
            type="button"
            onClick={handleSkip}
            className="fixed right-6 top-16 z-30 flex items-center gap-2 rounded-lg border border-border bg-card/80 px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={t('intro.skipAria')}
          >
            <StepForward size={14} aria-hidden="true" />
            <span>{t('intro.skip')}</span>
            <kbd className="rounded border border-white/15 bg-white/10 px-1.5 py-0.5 text-[10px]">
              Esc
            </kbd>
          </button>
        )}
      </div>

      {showReplay && !open && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReplay}
          aria-label={t('intro.replayAria')}
          className="group fixed bottom-6 right-6 z-50 h-9 gap-2 rounded-[40px] border-border bg-card/80 px-5 text-muted-foreground backdrop-blur-sm transition-colors hover:border-primary hover:bg-muted hover:text-primary focus-visible:ring-ring"
        >
          <RotateCcw
            className="h-4 w-4 transition-transform duration-500 ease-out group-hover:-rotate-[360deg]"
            aria-hidden="true"
          />
          <span className="text-[13px] font-medium tracking-tight">
            {t('intro.replay')}
          </span>
        </Button>
      )}
    </>
  );
}
