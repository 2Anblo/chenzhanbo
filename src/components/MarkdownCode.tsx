'use client';

import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { useTheme } from 'next-themes';
import { Copy, Check } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);
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
  const code = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative mt-5 mb-8 rounded-lg border border-border bg-muted overflow-hidden">
      <button
        type="button"
        onClick={handleCopy}
        className="absolute top-2 right-2 z-10 p-1.5 rounded-md border border-border/50 bg-card/80 text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
        aria-label={copied ? '已复制' : '复制代码'}
        title={copied ? '已复制' : '复制代码'}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
      <SyntaxHighlighter
        style={(isDark ? vscDarkPlus : oneLight) as Record<string, CSSProperties>}
        language={match[1]}
        PreTag="div"
        showLineNumbers
        wrapLongLines
        customStyle={{
          margin: 0,
          padding: '1rem',
          borderRadius: 0,
          background: 'transparent',
          fontFamily: codeFont,
          fontSize: '0.875rem',
          lineHeight: '1.7',
        }}
        lineNumberStyle={{
          color: 'hsl(var(--muted-foreground))',
          fontSize: '0.75rem',
          minWidth: '1.5rem',
          paddingRight: '1rem',
          opacity: 0.6,
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
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
