'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface TypewriterLine {
  prefix: string;
  text: string;
  delay?: number;
}

export interface TypewriterTextProps {
  lines: TypewriterLine[];
  className?: string;
  typingSpeed?: number;
  lineDelay?: number;
  showCursor?: boolean;
  reducedMotion?: boolean;
}

export default function TypewriterText({
  lines,
  className,
  typingSpeed = 40,
  lineDelay = 400,
  showCursor = true,
  reducedMotion = false,
}: TypewriterTextProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [finished, setFinished] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setCurrentLine(lines.length);
      setCurrentChar(lines[lines.length - 1]?.text.length ?? 0);
      setFinished(true);
      return;
    }

    if (finished) return;

    const line = lines[currentLine];
    if (!line) {
      setFinished(true);
      return;
    }

    const delay = line.delay ?? lineDelay;

    if (currentChar === 0 && currentLine > 0) {
      const timeout = setTimeout(() => {
        if (!mountedRef.current) return;
        setCurrentChar(1);
      }, delay);
      return () => clearTimeout(timeout);
    }

    if (currentChar < line.text.length) {
      const timeout = setTimeout(() => {
        if (!mountedRef.current) return;
        setCurrentChar((c) => c + 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    }

    if (currentLine < lines.length - 1) {
      const timeout = setTimeout(() => {
        if (!mountedRef.current) return;
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }, delay);
      return () => clearTimeout(timeout);
    }

    setFinished(true);
  }, [currentChar, currentLine, finished, lineDelay, lines, reducedMotion, typingSpeed]);

  return (
    <div className={cn('font-mono text-sm md:text-base leading-relaxed', className)}>
      {lines.map((line, index) => {
        const isActive = index === currentLine;
        const isPast = index < currentLine;
        const isFuture = index > currentLine;

        const visibleText = isPast
          ? line.text
          : isActive
            ? line.text.slice(0, currentChar)
            : '';

        return (
          <div
            key={`${line.prefix}-${index}`}
            className={cn(
              'transition-opacity duration-300',
              isFuture && 'opacity-0'
            )}
          >
            <span className="text-muted-foreground">{line.prefix}</span>
            <span className="text-foreground">{visibleText}</span>
            {showCursor && isActive && !finished && (
              <span className="inline-block w-2 h-4 md:h-5 bg-primary ml-0.5 align-middle animate-blink" />
            )}
          </div>
        );
      })}
      {showCursor && finished && (
        <div className="text-muted-foreground">
          <span>{lines[lines.length - 1]?.prefix ?? '> '}</span>
          <span className="inline-block w-2 h-4 md:h-5 bg-primary ml-0.5 align-middle animate-blink" />
        </div>
      )}
    </div>
  );
}
