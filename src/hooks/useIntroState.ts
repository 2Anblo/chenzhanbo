'use client';

import { useCallback, useEffect, useState } from 'react';

const SEEN_SESSION_KEY = 'chen:intro:v2:seen';

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

function hasSeenIntroThisSession(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(SEEN_SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function markIntroSeenThisSession() {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(SEEN_SESSION_KEY, '1');
  } catch {
    // sessionStorage can be unavailable in private or restricted contexts.
  }
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
    const introParam = getIntroParam();

    if (shouldSkipIntro()) {
      setState('finished');
      return;
    }

    if (introParam === 'play' || !hasSeenIntroThisSession()) {
      setState('playing');
      return;
    }

    setState('finished');
  }, []);

  const skip = useCallback(() => {
    markIntroSeenThisSession();
    setState('skipped');
  }, []);

  const replay = useCallback(() => {
    setState('playing');
  }, []);

  const complete = useCallback(() => {
    markIntroSeenThisSession();
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
