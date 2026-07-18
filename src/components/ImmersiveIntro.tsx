'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { assetUrl } from '@/lib/assets';

interface ImmersiveIntroProps {
  onEnter: () => void;
}

const sceneItems = [
  {
    title: 'Online Judge',
    meta: 'Spring Cloud / Redis / Docker',
    image: assetUrl('projects/ojsystem.png'),
  },
  {
    title: 'MusicLens',
    meta: 'Recommendation / Data / UI',
    image: assetUrl('projects/musiclens.png'),
  },
  {
    title: 'RAG Notes',
    meta: 'Spring AI / Retrieval / Agents',
    image: assetUrl('blog/spring-ai-rag-architecture.png'),
  },
];

export default function ImmersiveIntro({ onEnter }: ImmersiveIntroProps) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const panelStyle = useMemo(
    () =>
      ({
        '--intro-x': pointer.x.toFixed(3),
        '--intro-y': pointer.y.toFixed(3),
      }) as CSSProperties,
    [pointer],
  );

  return (
    <section
      className="intro-scene relative h-full w-full overflow-hidden bg-[#070807] text-white"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setPointer({
          x: (event.clientX - rect.left) / rect.width - 0.5,
          y: (event.clientY - rect.top) / rect.height - 0.5,
        });
      }}
      style={panelStyle}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.14),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_34%)]" />
      <div className="intro-grid absolute inset-0 opacity-35" />

      <header className="absolute left-6 right-6 top-6 z-20 flex items-center justify-between text-xs font-medium text-white/55 md:left-10 md:right-10">
        <span>Zhanbo Chen</span>
        <span>Portfolio 2026</span>
      </header>

      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="intro-gallery relative h-[58vh] w-[min(74rem,92vw)]">
          {sceneItems.map((item) => (
            <article
              key={item.title}
              className="intro-panel absolute overflow-hidden rounded-lg border border-white/15 bg-white/[0.04]"
            >
              <Image
                src={item.image}
                alt=""
                fill
                sizes="(max-width: 640px) 13rem, 26vw"
                className="object-cover opacity-70 saturate-[0.75]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-[11px] text-white/55">{item.meta}</p>
                <h2 className="mt-1 text-xl font-semibold tracking-normal text-white md:text-2xl">
                  {item.title}
                </h2>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 -translate-y-1/2 px-6 md:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="intro-kicker text-xs font-medium text-white/55">
            Backend systems / AI agents / technical notes
          </p>
          <h1 className="intro-title mt-5 max-w-3xl text-5xl font-semibold leading-[0.95] tracking-normal text-white md:text-7xl">
            Work that turns into systems.
          </h1>
        </div>
      </div>

      <div className="absolute bottom-8 left-6 right-6 z-30 flex flex-col gap-5 md:left-10 md:right-10 md:flex-row md:items-end md:justify-between">
        <div className="w-full max-w-sm">
          <div className="h-px overflow-hidden bg-white/15">
            <div className="intro-progress h-full bg-white" />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-white/55">
            A short pass through recent projects before the site opens.
          </p>
        </div>

        <button
          type="button"
          onClick={onEnter}
          className="inline-flex w-fit items-center gap-2 rounded-md border border-white/25 bg-white px-4 py-2 text-sm font-medium text-black transition-colors duration-150 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          Enter site
          <ArrowRight size={15} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
