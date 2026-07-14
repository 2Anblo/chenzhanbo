'use client';

import type { ReactNode } from 'react';
import IntroOverlay from '@/components/IntroOverlay';
import { useIntroState } from '@/hooks/useIntroState';

interface HomeIntroProps {
  children: ReactNode;
}

export default function HomeIntro({ children }: HomeIntroProps) {
  const { show, finished, skip, replay, complete } = useIntroState();

  return (
    <>
      <IntroOverlay
        open={show}
        showReplay={finished}
        onSkip={skip}
        onComplete={complete}
        onReplay={replay}
      />
      <main
        className="w-full bg-background"
        aria-hidden={show}
        inert={show ? true : undefined}
      >
        {children}
      </main>
    </>
  );
}
