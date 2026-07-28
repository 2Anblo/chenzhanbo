'use client';

import { useEffect, useState, useCallback } from 'react';

interface ImmersiveIntroProps {
  onEnter: () => void;
}

const INTRO_DURATION_MS = 1600;
const FILL_DELAY_MS = 300;
const NAME = 'Zhanbo';

export default function ImmersiveIntro({ onEnter }: ImmersiveIntroProps) {
  const [fillStarted, setFillStarted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(onEnter, INTRO_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [onEnter]);

  useEffect(() => {
    const timer = window.setTimeout(() => setFillStarted(true), FILL_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const handleClick = useCallback(() => {
    onEnter();
  }, [onEnter]);

  return (
    <section
      className="intro-scene"
      aria-label="Zhanbo intro animation"
      onClick={handleClick}
    >
      <h1 className="sr-only">{NAME}</h1>

      <div className="intro-inner">
        <div className="intro-meta intro-meta--top" aria-hidden="true">
          identity / notebook / systems
        </div>
        <div className="intro-signature" aria-hidden="true">
          <span className="intro-signature__outline">{NAME}</span>
          <span
            className={`intro-signature__filled ${
              fillStarted ? 'intro-signature__filled--complete' : ''
            }`}
          >
            <span className="intro-signature__inner">{NAME}</span>
          </span>
        </div>
        <div className="intro-meta intro-meta--bottom" aria-hidden="true">
          loading technical archive
        </div>
      </div>
    </section>
  );
}
