'use client';

/**
 * Progressive blur fade at the top edge of the viewport.
 *
 * Stacks 7 banded blur layers so content dissolves naturally as it
 * approaches the fixed header, topped with a soft surface-colored tint
 * to keep header text readable in both light and dark modes.
 */

const LAYERS = [
  { blur: 48, transparentStart: 0, blackStart: 0, blackEnd: 12.5, transparentEnd: 25 },
  { blur: 32, transparentStart: 0, blackStart: 12.5, blackEnd: 25, transparentEnd: 37.5 },
  { blur: 16, transparentStart: 12.5, blackStart: 25, blackEnd: 37.5, transparentEnd: 50 },
  { blur: 8, transparentStart: 25, blackStart: 37.5, blackEnd: 50, transparentEnd: 62.5 },
  { blur: 4, transparentStart: 37.5, blackStart: 50, blackEnd: 62.5, transparentEnd: 75 },
  { blur: 2, transparentStart: 50, blackStart: 62.5, blackEnd: 75, transparentEnd: 87.5 },
  { blur: 1, transparentStart: 62.5, blackStart: 75, blackEnd: 87.5, transparentEnd: 100 },
] as const;

export default function ProgressiveBlurOverlay() {
  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-0 z-40 h-20"
      aria-hidden="true"
    >
      {LAYERS.map(({ blur, transparentStart, blackStart, blackEnd, transparentEnd }) => {
        const mask = `linear-gradient(to bottom, transparent ${transparentStart}%, black ${blackStart}%, black ${blackEnd}%, transparent ${transparentEnd}%)`;
        return (
          <div
            key={blur}
            className="absolute inset-0"
            style={{
              WebkitBackdropFilter: `blur(${blur}px)`,
              backdropFilter: `blur(${blur}px)`,
              WebkitMask: mask,
              mask,
            }}
          />
        );
      })}

      {/* Soft surface-colored tint to keep header text readable */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, hsl(var(--background) / 0.55) 0%, hsl(var(--background) / 0.25) 50%, hsl(var(--background) / 0) 100%)`,
        }}
      />
    </div>
  );
}
