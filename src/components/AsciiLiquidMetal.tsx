'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const charMapLatin: Record<string, number[][]> = {
  A: [[0,1,1,1,0],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1]],
  B: [[1,1,1,1,0],[1,0,0,0,1],[1,1,1,1,0],[1,0,0,0,1],[1,1,1,1,0]],
  C: [[0,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[0,1,1,1,1]],
  D: [[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0]],
  E: [[1,1,1,1,1],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,0],[1,1,1,1,1]],
  F: [[1,1,1,1,1],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0]],
  G: [[0,1,1,1,1],[1,0,0,0,0],[1,0,1,1,1],[1,0,0,0,1],[0,1,1,1,1]],
  H: [[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1]],
  I: [[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[1,1,1,1,1]],
  J: [[0,0,0,0,1],[0,0,0,0,1],[0,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  K: [[1,0,0,0,1],[1,0,0,1,0],[1,1,1,0,0],[1,0,0,1,0],[1,0,0,0,1]],
  L: [[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,1]],
  M: [[1,0,0,0,1],[1,1,0,1,1],[1,0,1,0,1],[1,0,0,0,1],[1,0,0,0,1]],
  N: [[1,0,0,0,1],[1,1,0,0,1],[1,0,1,0,1],[1,0,0,1,1],[1,0,0,0,1]],
  O: [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  P: [[1,1,1,1,0],[1,0,0,0,1],[1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0]],
  Q: [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,1,0],[0,1,1,0,1]],
  R: [[1,1,1,1,0],[1,0,0,0,1],[1,1,1,1,0],[1,0,1,0,0],[1,0,0,1,1]],
  S: [[0,1,1,1,1],[1,0,0,0,0],[0,1,1,1,0],[0,0,0,0,1],[1,1,1,1,0]],
  T: [[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
  U: [[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  V: [[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0]],
  W: [[1,0,0,0,1],[1,0,0,0,1],[1,0,1,0,1],[1,1,0,1,1],[1,0,0,0,1]],
  X: [[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,1,0,1,0],[1,0,0,0,1]],
  Y: [[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
  Z: [[1,1,1,1,1],[0,0,0,1,0],[0,0,1,0,0],[0,1,0,0,0],[1,1,1,1,1]],
  _: [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[1,1,1,1,1]],
  '.': [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,1,0,0]],
  '!': [[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,0,0,0],[0,0,1,0,0]],
  '?': [[0,1,1,1,0],[1,0,0,0,1],[0,0,0,1,0],[0,0,1,0,0],[0,0,1,0,0]],
  '/': [[0,0,0,0,1],[0,0,0,1,0],[0,0,1,0,0],[0,1,0,0,0],[1,0,0,0,0]],
  '0': [[0,1,1,1,0],[1,0,0,1,1],[1,0,1,0,1],[1,1,0,0,1],[0,1,1,1,0]],
  '1': [[0,0,1,0,0],[0,1,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,1,1,1,0]],
  '2': [[0,1,1,1,0],[1,0,0,0,1],[0,0,0,1,0],[0,0,1,0,0],[1,1,1,1,1]],
  '3': [[1,1,1,1,0],[0,0,0,0,1],[0,0,1,1,0],[0,0,0,0,1],[1,1,1,1,0]],
  '4': [[1,0,0,1,0],[1,0,0,1,0],[1,1,1,1,1],[0,0,0,1,0],[0,0,0,1,0]],
  '5': [[1,1,1,1,1],[1,0,0,0,0],[1,1,1,1,0],[0,0,0,0,1],[1,1,1,1,0]],
  '6': [[0,1,1,1,0],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,1],[0,1,1,1,0]],
  '7': [[1,1,1,1,1],[0,0,0,0,1],[0,0,0,1,0],[0,0,1,0,0],[0,0,1,0,0]],
  '8': [[0,1,1,1,0],[1,0,0,0,1],[0,1,1,1,0],[1,0,0,0,1],[0,1,1,1,0]],
  '9': [[0,1,1,1,0],[1,0,0,0,1],[0,1,1,1,1],[0,0,0,0,1],[0,1,1,1,0]],
};

const charMapCJK: Record<string, number[][]> = {
  '展': [[0,0,1,0,0],[0,1,1,1,0],[1,1,1,1,1],[0,1,1,1,0],[0,0,1,0,0]],
  '博': [[0,1,1,1,0],[1,0,1,0,1],[1,1,1,1,1],[1,0,1,0,1],[0,1,1,1,0]],
  '的': [[0,0,1,0,0],[0,1,1,1,0],[0,0,1,0,0],[0,1,1,1,0],[0,0,1,0,0]],
  '代': [[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,1,0,1,0],[1,0,0,0,1]],
  '码': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  '空': [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]],
  '间': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
};

const emptyChar: number[][] = [
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0],
];

const baseChars = ' .,;:!|/~^-';
const scaleChars = '\\/|';

function getCharGrid(char: string): number[][] {
  if (char === ' ') return emptyChar;
  const latin = charMapLatin[char.toUpperCase()];
  if (latin) return latin;
  const cjk = charMapCJK[char];
  if (cjk) return cjk;
  return emptyChar;
}

function getTextMask(
  cols: number,
  rows: number,
  text: string,
  widthPercent: number
): boolean[][] {
  const mask: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));

  const chars = text.split('');
  const totalCellWidth = chars.length * 6 - 1; // 5 cols + 1 spacing
  const textWidth = Math.min(Math.floor(cols * widthPercent), totalCellWidth);
  const scale = textWidth / totalCellWidth;
  const scaledCellWidth = Math.max(3, Math.floor(6 * scale));
  const scaledCellHeight = Math.max(4, Math.floor(5 * scale));

  const startCol = Math.floor((cols - chars.length * scaledCellWidth) / 2);
  const startRow = Math.floor((rows - scaledCellHeight) / 2) + 1;

  let colOffset = 0;
  for (const char of chars) {
    const grid = getCharGrid(char);
    const cw = grid[0].length;
    const ch = grid.length;
    for (let row = 0; row < ch; row++) {
      for (let col = 0; col < cw; col++) {
        if (grid[row][col]) {
          const mr = startRow + row;
          const mc = startCol + colOffset + col;
          if (mr >= 0 && mr < rows && mc >= 0 && mc < cols) {
            mask[mr][mc] = true;
          }
        }
      }
    }
    colOffset += scaledCellWidth;
  }

  return mask;
}

export interface AsciiLiquidMetalProps {
  className?: string;
  text?: string;
  speed?: number;
  reducedMotion?: boolean;
}

export default function AsciiLiquidMetal({
  className,
  text = 'Zhanbo Chen',
  speed = 1,
  reducedMotion = false,
}: AsciiLiquidMetalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  const draw = useCallback((t: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const root = document.documentElement;
    const bgHsl = getComputedStyle(root).getPropertyValue('--background').trim();
    const fgHsl = getComputedStyle(root).getPropertyValue('--foreground').trim();
    const mutedHsl = getComputedStyle(root).getPropertyValue('--muted-foreground').trim();

    const bg = `hsl(${bgHsl})`;
    const dim = `hsl(${mutedHsl} / 0.35)`;
    const mid = `hsl(${mutedHsl} / 0.65)`;
    const bright = `hsl(${fgHsl})`;
    const accent = `hsl(${getComputedStyle(root).getPropertyValue('--primary').trim()})`;

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const fontSize = Math.max(10, Math.min(16, width / 100));
    const cols = Math.floor((width / fontSize) * 0.7);
    const rows = Math.floor(height / fontSize);

    const mask = getTextMask(cols, rows, text, 0.8);

    const charWidth = fontSize * 0.7;
    const charHeight = fontSize;
    const offsetX = (width - cols * charWidth) / 2;
    const offsetY = (height - rows * charHeight) / 2;

    ctx.font = `${fontSize}px var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
    ctx.textBaseline = 'middle';

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * charWidth + offsetX;
        const y = row * charHeight + offsetY;
        const normX = col / cols;
        const normY = row / rows;

        let wave1 = Math.sin(normX * 6 + t * 1.5) * Math.cos(normY * 5 + t * 1.2);
        let wave2 = Math.sin(normX * 10 - t * 2) * Math.sin(normY * 8 + t);
        let wave3 = Math.cos((normX + normY) * 7 + t * 1.8);
        let field = (wave1 + wave2 * 0.5 + wave3 * 0.3) / 1.8;

        const inText = mask[row]?.[col];
        if (inText) {
          field *= 2.5;
          field += Math.sin(t * 2) * 0.3;
        }

        let charIndex = Math.floor(((field + 1) * 0.5) * baseChars.length);
        let clampedIndex = Math.max(0, Math.min(baseChars.length - 1, charIndex));
        let char = baseChars[clampedIndex];

        if (field > 0.6 && Math.random() > 0.7) {
          char = scaleChars[Math.floor(Math.random() * scaleChars.length)];
        }
        if (field > 0.8) {
          char = '\\';
        }

        let color: string;
        if (inText) {
          color = accent;
        } else if (field > 0.5) {
          color = bright;
        } else if (field > 0.1) {
          color = mid;
        } else {
          color = dim;
        }

        if (field > -0.4) {
          if (!inText && Math.random() > 0.97) {
            ctx.fillStyle = mid;
          } else if (!inText && Math.random() > 0.98) {
            ctx.fillStyle = bright;
          } else if (!inText && Math.random() > 0.995) {
            char = '.';
            ctx.fillStyle = dim;
          } else {
            ctx.fillStyle = color;
          }

          ctx.fillText(char, x, y);
        }
      }
    }
  }, [text]);

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let rafId: number;
    let visible = true;
    let t = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const loop = () => {
      if (visible) {
        t += 0.015 * speed;
        draw(t);
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    const handleResize = () => draw(t);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [draw, reducedMotion, speed, resolvedTheme]);

  useEffect(() => {
    if (!reducedMotion) return;
    draw(0);
  }, [draw, reducedMotion, resolvedTheme]);

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />
    </div>
  );
}
