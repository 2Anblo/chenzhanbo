'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

interface MermaidDiagramProps {
  code: string;
}

let mermaidPromise: Promise<typeof import('mermaid')['default']> | null = null;

function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((mod) => mod.default);
  }
  return mermaidPromise;
}

export default function MermaidDiagram({ code }: MermaidDiagramProps) {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const reactId = useId().replace(/[:]/g, '-');

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      const mermaid = await loadMermaid();
      mermaid.initialize({
        startOnLoad: false,
        theme: resolvedTheme === 'dark' ? 'dark' : 'neutral',
        securityLevel: 'strict',
        fontFamily: 'inherit',
      });

      try {
        const { svg } = await mermaid.render(`mermaid${reactId}`, code);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      }
    };

    render();

    return () => {
      cancelled = true;
    };
  }, [code, resolvedTheme, reactId]);

  if (error) {
    return (
      <pre className="my-3 overflow-x-auto rounded border border-destructive/30 bg-destructive/5 p-4 text-xs text-muted-foreground">
        {code}
      </pre>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-4 flex justify-center overflow-x-auto rounded-lg border border-border bg-card p-4 [&_svg]:max-w-full"
    />
  );
}
