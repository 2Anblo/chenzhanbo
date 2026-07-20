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
  '"SFMono-Regular", Menlo, Consolas, "Liberation Mono", monospace';

export default function MarkdownCode({ className, children }: MarkdownCodeProps) {
  const { resolvedTheme } = useTheme();
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const codeText = String(children || '');
  const isBlock = codeText.includes('\n');

  if (!match && !isBlock) {
    return (
      <code
        className={cn('rounded text-[0.9em]', className)}
        style={{
          background: 'rgba(135, 131, 120, 0.15)',
          color: '#eb5757',
          fontFamily: codeFont,
          padding: '0.15em 0.4em',
        }}
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
    <div
      className="relative my-3 overflow-hidden"
      style={{
        borderRadius: '4px',
        background: isDark ? '#2f3437' : '#f7f6f3',
      }}
    >
      {/* Copy button */}
      <button
        type="button"
        onClick={handleCopy}
        className="absolute top-2 right-2 z-10 flex items-center justify-center rounded border p-1.5 text-xs transition-all"
        style={{
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)',
          color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(4px)',
        }}
        onMouseEnter={(e) => {
          const target = e.currentTarget;
          target.style.background = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.95)';
          target.style.color = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)';
          target.style.borderColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
          const target = e.currentTarget;
          target.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)';
          target.style.color = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)';
          target.style.borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
        }}
        aria-label={copied ? '已复制' : '复制代码'}
        title={copied ? '已复制' : '复制代码'}
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </button>

      <SyntaxHighlighter
        style={(isDark ? vscDarkPlus : oneLight) as Record<string, CSSProperties>}
        language={match?.[1] || 'text'}
        showLineNumbers
        wrapLongLines
        customStyle={{
          margin: 0,
          padding: '1.25rem 1.25rem 1.25rem 0.75rem',
          borderRadius: 0,
          background: 'transparent',
          fontFamily: codeFont,
          fontSize: '0.875rem',
          lineHeight: 1.5,
        }}
        lineNumberStyle={{
          color: isDark ? 'rgba(255,255,255,0.2)' : '#c8c6c3',
          fontSize: '0.75rem',
          minWidth: '1.5rem',
          paddingRight: '1rem',
          userSelect: 'none',
          textAlign: 'right',
        }}
        codeTagProps={{
          style: {
            background: 'transparent',
            fontFamily: codeFont,
            fontWeight: 400,
            textShadow: 'none',
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
