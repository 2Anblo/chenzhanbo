'use client';

import { useEffect, type CSSProperties } from 'react';

interface ImmersiveIntroProps {
  onEnter: () => void;
}

const LETTERS = ['Z', 'H', 'A', 'N', 'B', 'O'];
const INTRO_DURATION_MS = 4300;

export default function ImmersiveIntro({ onEnter }: ImmersiveIntroProps) {
  useEffect(() => {
    const timer = window.setTimeout(onEnter, INTRO_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [onEnter]);

  return (
    <section
      className="intro-scene relative h-full w-full overflow-hidden bg-[#050605] text-white"
      aria-label="Zhanbo Chen intro animation"
      onClick={onEnter}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.11),transparent_27%),radial-gradient(circle_at_50%_100%,rgba(78,119,255,0.12),transparent_38%)]" />
      <div className="intro-scanline absolute inset-0" />

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="intro-mark relative flex w-full max-w-4xl flex-col items-center justify-center">
          <div className="intro-light-line intro-light-line--top" />

          <h1 className="sr-only">Zhanbo Chen</h1>
          <div className="intro-name" aria-hidden="true">
            {LETTERS.map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                className="intro-letter"
                style={
                  {
                    '--letter-index': index,
                  } as CSSProperties
                }
              >
                {letter}
              </span>
            ))}
          </div>

          <div className="intro-light-line intro-light-line--bottom" />
        </div>
      </div>

      <div className="absolute bottom-8 left-6 right-6 flex items-center justify-between text-xs text-white/50 md:left-10 md:right-10">
        <span>Zhanbo Chen</span>
        <span>Click to enter</span>
      </div>
    </section>
  );
}
