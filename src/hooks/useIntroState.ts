'use client';

import { useCallback, useEffect, useState } from 'react';

type IntroState = 'loading' | 'playing' | 'skipped' | 'finished';

function getIntroParam(): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get('intro');
}

function shouldSkipIntro(): boolean {
  if (typeof window === 'undefined') return true;

  const introParam = getIntroParam();
  if (introParam === 'off') return true;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return true;
  }

  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
  };
  if (nav.connection?.saveData) return true;

  return false;
}

export interface UseIntroStateReturn {
  show: boolean;
  finished: boolean;
  skip: () => void;
  replay: () => void;
  complete: () => void;
}

export function useIntroState(): UseIntroStateReturn {
  const [state, setState] = useState<IntroState>('loading');

  useEffect(() => {
    if (shouldSkipIntro()) {
      setState('finished');
      return;
    }

    setState('playing');
  }, []);

  const skip = useCallback(() => {
    setState('skipped');
  }, []);

  const replay = useCallback(() => {
    setState('playing');
  }, []);

  const complete = useCallback(() => {
    setState('finished');
  }, []);

  return {
    show: state === 'playing',
    finished: state === 'finished' || state === 'skipped',
    skip,
    replay,
    complete,
  };
}
