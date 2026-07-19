'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useTheme } from 'next-themes';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';

interface MarkdownCodeProps {
  className?: string;
  children?: ReactNode;
}

const codeFont =
  '"JetBrains Mono", "Fira Code", "SFMono-Regular", Consolas, "Liberation Mono", monospace';

export default function MarkdownCode({ className, children }: MarkdownCodeProps) {
  const { resolvedTheme } = useTheme();
  const match = /language-(\w+)/.exec(className || '');

  if (!match) {
    return (
      <code
        className={cn(
          'rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.9em] font-semibold text-foreground',
          className,
        )}
      >
        {children}
      </code>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="my-5">
      <SyntaxHighlighter
        style={(isDark ? vscDarkPlus : oneLight) as Record<string, CSSProperties>}
        language={match[1]}
        PreTag="div"
        wrapLongLines
        customStyle={{
          margin: 0,
          padding: '1rem',
          borderRadius: '8px',
          color: 'hsl(var(--foreground))',
          fontFamily: codeFont,
          fontSize: '0.875rem',
          lineHeight: '1.7',
        }}
        codeTagProps={{
          style: {
            background: 'transparent',
            fontFamily: codeFont,
            fontWeight: 500,
            textShadow: 'none',
          },
        }}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
}
