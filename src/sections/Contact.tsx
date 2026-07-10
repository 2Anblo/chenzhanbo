import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const labels = [
  'SPRING BOOT', 'JAVA', 'AI AGENT', 'GITHUB', '邮箱',
  'CONTACT', 'MYSQL', 'DOCKER', 'LINUX', 'RAG', 'LLM', 'CONTACT'
];

export default function 联系方式() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;
    const WORD_COUNT = 12;

    const engine = Matter.Engine.create();
    engine.gravity.y = 1;
    engine.gravity.scale = 0.001;
    const world = engine.world;

    const render = Matter.Render.create({
      element: scene,
      engine: engine,
      options: {
        width: WIDTH,
        height: HEIGHT,
        background: 'transparent',
        wireframes: false,
        pixelRatio: window.devicePixelRatio,
      },
    });

    Matter.Render.run(render);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Ground
    const ground = Matter.Bodies.rectangle(WIDTH / 2, HEIGHT + 50, 5000, 100, {
      isStatic: true,
      restitution: 0.6,
      render: { fillStyle: '#F8F9FA' },
    });
    Matter.Composite.add(world, ground);

    // Walls
    const leftWall = Matter.Bodies.rectangle(-100, HEIGHT / 2, 200, HEIGHT, {
      isStatic: true,
      restitution: 0.6,
      render: { fillStyle: '#F8F9FA' },
    });
    const rightWall = Matter.Bodies.rectangle(WIDTH + 100, HEIGHT / 2, 200, HEIGHT, {
      isStatic: true,
      restitution: 0.6,
      render: { fillStyle: '#F8F9FA' },
    });
    const topWall = Matter.Bodies.rectangle(WIDTH / 2, HEIGHT + 500, WIDTH, 100, {
      isStatic: true,
      restitution: 0.6,
      render: { fillStyle: '#F8F9FA' },
    });
    Matter.Composite.add(world, [leftWall, rightWall, topWall]);

    const words: Matter.Body[] = [];

    function addWord(text: string, x: number, y: number) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const font = 'bold 24px "JetBrains Mono", "Courier New", monospace';
      ctx.font = font;
      const textWidth = ctx.measureText(text).width;
      const padding = 20;
      const w = textWidth + padding * 2;
      const h = 40 + padding;

      canvas.width = w;
      canvas.height = h;
      ctx.font = font;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillStyle = '#F1F3F4';
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, 20);
      ctx.fill();

      ctx.fillStyle = '#1A1A2E';
      ctx.fillText(text, w / 2, h / 2);

      const texture = canvas.toDataURL();

      const body = Matter.Bodies.rectangle(x, y, w, h, {
        restitution: 0.5,
        friction: 0.1,
        render: {
          sprite: {
            texture: texture,
            xScale: 1,
            yScale: 1,
          },
        },
      });

      words.push(body);
      Matter.Composite.add(world, body);
    }

    for (let i = 0; i < WORD_COUNT; i++) {
      const x = Math.random() * WIDTH;
      const y = -Math.random() * HEIGHT * 1.5 - 100;
      const label = labels[i % labels.length];
      addWord(label, x, y);
    }

    // Mouse repulsion
    const handleMouseMove = (e: MouseEvent) => {
      if (!scene) return;
      const rect = scene.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      for (const body of words) {
        const pos = body.position;
        const dx = pos.x - mouseX;
        const dy = pos.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 200 && dist > 0) {
          const forceMagnitude = 0.015 * body.mass;
          Matter.Body.applyForce(body, pos, {
            x: (dx / dist) * forceMagnitude,
            y: (dy / dist) * forceMagnitude,
          });
        }
      }
    };

    scene.addEventListener('mousemove', handleMouseMove);

    // Trail & swing
    const trailPoints: { x: number; y: number }[] = [];

    Matter.Events.on(engine, 'beforeUpdate', () => {
      // Update trail from last mouse position
      if (scene) {
        // trail rendering is handled separately
      }

      // Swing detection
      if (trailPoints.length < 5) return;

      const lastP = trailPoints[trailPoints.length - 1];
      const prevP = trailPoints[trailPoints.length - 5];
      const swingDX = lastP.x - prevP.x;
      const swingDY = lastP.y - prevP.y;
      const speed = Math.sqrt(swingDX * swingDX + swingDY * swingDY);

      if (speed > 20) {
        const px = lastP.x;
        const py = lastP.y;
        const pdx = swingDX;
        const pdy = swingDY;
        const lenSq = pdx * pdx + pdy * pdy;

        for (const body of words) {
          const pos = body.position;
          let t = ((pos.x - px) * pdx + (pos.y - py) * pdy) / lenSq;
          t = Math.max(0, Math.min(1, t));

          const closestX = px + t * pdx;
          const closestY = py + t * pdy;
          const distDX = pos.x - closestX;
          const distDY = pos.y - closestY;
          const distSq = distDX * distDX + distDY * distDY;

          if (distSq < 10000) {
            const forceMag = 0.08 * body.mass;
            Matter.Body.applyForce(body, pos, {
              x: (swingDX / speed) * forceMag,
              y: (swingDY / speed) * forceMag,
            });
          }
        }
      }

      // Render trail
      if (trailPoints.length > 1) {
        const ctx = render.context;
        ctx.beginPath();
        ctx.moveTo(trailPoints[0].x, trailPoints[0].y);
        for (let i = 1; i < trailPoints.length; i++) {
          ctx.lineTo(trailPoints[i].x, trailPoints[i].y);
        }
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Capture mouse for trail
    const handleTrailMouseMove = (e: MouseEvent) => {
      if (!scene) return;
      const rect = scene.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      trailPoints.push({ x: mouseX, y: mouseY });
      if (trailPoints.length > 10) {
        trailPoints.shift();
      }
    };

    scene.addEventListener('mousemove', handleTrailMouseMove);

    return () => {
      scene.removeEventListener('mousemove', handleMouseMove);
      scene.removeEventListener('mousemove', handleTrailMouseMove);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  return (
    <section id="contact" className="relative w-full h-screen bg-white overflow-hidden">
      {/* 联系方式 Info Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-center pointer-events-auto">
          <p className="text-xs font-mono uppercase tracking-widest text-[#3B82F6] mb-3">
            联系方式
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1A1A2E] tracking-tight">
            与我联系
          </h2>
          <p className="mt-4 text-sm text-[#5F6368] max-w-md mx-auto">
            移动鼠标与下方的技术标签互动，或者直接通过以下方式联系我。
          </p>

          <div className="mt-8 flex flex-col items-center gap-4">
            <a
              href="mailto:czbczb@sina.com"
              className="flex items-center gap-2 px-6 py-3 bg-[#3B82F6] text-white text-sm font-medium rounded hover:bg-[#2563EB] transition-all"
            >
              发送邮件
            </a>
            <div className="flex items-center gap-6 mt-4">
              <a
                href="https://github.com/czbczb"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5F6368] hover:text-[#3B82F6] transition-colors text-xs font-mono uppercase tracking-wider"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/czbczb"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5F6368] hover:text-[#3B82F6] transition-colors text-xs font-mono uppercase tracking-wider"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Physics Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full bg-white relative overflow-hidden cursor-crosshair"
      >
        <div ref={sceneRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </section>
  );
}
