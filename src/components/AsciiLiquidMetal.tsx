import { useRef, useEffect } from 'react';

const charMap1: Record<string, number[][]> = {
  'H': [[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1]],
  'E': [[1,1,1,1,1],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,0],[1,1,1,1,1]],
  'L': [[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,1]],
  'O': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  '_': [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[1,1,1,1,1]],
  'W': [[1,0,0,0,1],[1,0,0,0,1],[1,0,1,0,1],[1,0,1,0,1],[0,1,0,1,0]],
  'R': [[1,1,1,1,0],[1,0,0,0,1],[1,1,1,1,0],[1,0,1,0,0],[1,0,0,1,1]],
  'D': [[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0]],
};

const charMap2: Record<string, number[][]> = {
  '展': [[0,0,1,0,0],[0,1,1,1,0],[1,1,1,1,1],[0,1,1,1,0],[0,0,1,0,0]],
  '博': [[0,1,1,1,0],[1,0,1,0,1],[1,1,1,1,1],[1,0,1,0,1],[0,1,1,1,0]],
  '的': [[0,0,1,0,0],[0,1,1,1,0],[0,0,1,0,0],[0,1,1,1,0],[0,0,1,0,0]],
  '代': [[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,1,0,1,0],[1,0,0,0,1]],
  '码': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  '空': [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]],
  '间': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
};

const baseChars = ' .,;:!|/~^-';
const scaleChars = '\\/|';

function getTextMask(
  cols: number,
  rows: number,
  map: Record<string, number[][]>,
  widthPercent: number,
  heightPercent: number
): boolean[][] {
  const mask: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
  const textWidth = Math.floor(cols * widthPercent);
  const textHeight = Math.floor(rows * heightPercent);
  const startCol = Math.floor((cols - textWidth) / 2);
  const startRow = Math.floor((rows - textHeight) / 2) + 1;
  const letterSpacing = 1;

  let colOffset = 0;
  for (const char of Object.keys(map)) {
    const charGrid = map[char];
    if (!charGrid) continue;
    const cw = charGrid[0].length;
    const ch = charGrid.length;
    for (let row = 0; row < ch; row++) {
      for (let col = 0; col < cw; col++) {
        if (charGrid[row][col]) {
          const mr = startRow + row;
          const mc = startCol + colOffset + col;
          if (mr >= 0 && mr < rows && mc >= 0 && mc < cols) {
            mask[mr][mc] = true;
          }
        }
      }
    }
    colOffset += cw + letterSpacing;
  }

  return mask;
}

export default function AsciiLiquidMetal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cols = 0;
    let rows = 0;
    let fontSize = 14;

    const mouse = { x: -1000, y: -1000, active: false };
    const smoothMouse = { x: -1000, y: -1000 };
    let mouseTimeout: ReturnType<typeof setTimeout> | null = null;

    function resize() {
      if (!canvas) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      fontSize = Math.max(10, Math.min(16, width / 100));
      cols = Math.floor((width / fontSize) * 0.7);
      rows = Math.floor(height / fontSize);
      draw(0);
    }

    window.addEventListener('resize', resize);
    resize();

    function draw(t: number) {
      if (!ctx || !canvas) return;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const mask1 = getTextMask(cols, rows, charMap1, 0.75, 0.35);
      const mask2 = getTextMask(cols, rows, charMap2, 0.55, 0.25);
      const charWidth = fontSize * 0.7;
      const charHeight = fontSize;
      const offsetX = (canvas.width - cols * charWidth) / 2;
      const offsetY = (canvas.height - rows * charHeight) / 2;

      smoothMouse.x += (mouse.x - smoothMouse.x) * 0.08;
      smoothMouse.y += (mouse.y - smoothMouse.y) * 0.08;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * charWidth + offsetX;
          const y = row * charHeight + offsetY;
          const normX = col / cols;
          const normY = row / rows;
          const dx = col - (smoothMouse.x / canvas.width) * cols;
          const dy = row - (smoothMouse.y / canvas.height) * rows;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let wave1 = Math.sin(normX * 6 + t * 1.5) * Math.cos(normY * 5 + t * 1.2);
          let wave2 = Math.sin(normX * 10 - t * 2) * Math.sin(normY * 8 + t);
          let wave3 = Math.cos((normX + normY) * 7 + t * 1.8);
          let field = (wave1 + wave2 * 0.5 + wave3 * 0.3) / 1.8;

          const mouseFalloff = Math.exp(-dist * 0.3);
          if (mouse.active) {
            field += Math.sin(dist * 1.5 - t * 3) * mouseFalloff * 2;
          }

          const inText =
            (mask1[row] && mask1[row][col]) || (mask2[row] && mask2[row][col]);
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
          if (field > 0.5) {
            color = '#ffffff';
          } else if (field > 0.1) {
            color = '#888888';
          } else {
            color = '#444444';
          }

          if (field > -0.4) {
            if (Math.random() > 0.97) {
              ctx.fillStyle = '#6B7280';
            } else if (Math.random() > 0.98) {
              ctx.fillStyle = '#9CA3AF';
            } else if (Math.random() > 0.995) {
              char = '.';
              ctx.fillStyle = '#E5E7EB';
            } else {
              ctx.fillStyle = color;
            }

            ctx.font = `${fontSize}px "Courier New", monospace`;
            ctx.textBaseline = 'middle';
            ctx.fillText(char, x, y);
          }
        }
      }

      requestAnimationFrame(() => draw(t + 0.015));
    }

    const animationFrameId = requestAnimationFrame(() => draw(0));

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
      if (mouseTimeout) clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        mouse.active = false;
      }, 100);
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
      if (mouseTimeout) clearTimeout(mouseTimeout);
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center bg-black relative overflow-hidden">
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}
