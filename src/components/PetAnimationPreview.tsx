'use client';

import { useEffect, useState } from 'react';
import { getPetFrameStyle, petRows } from '@/lib/desktop-pet';
import styles from '@/components/DesktopPet.module.css';

const labels = { idle: '待机 · 眨眼', walk: '走路', rest: '趴卧 · 休息', happy: '摸摸 · 回应' };

export default function PetAnimationPreview() {
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setFrame((previous) => (previous + 1) % 4);
    }, 240);
    return () => window.clearInterval(timer);
  }, [playing]);

  return (
    <section className="mt-10" aria-label="Animation preview">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-sm text-muted-foreground">动作预览 · Animation preview</h2>
        <button type="button" onClick={() => setPlaying((value) => !value)}
          className="rounded-full border border-border px-4 py-2 text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          {playing ? '暂停动画 · Pause' : '播放动画 · Play'}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {(Object.keys(petRows) as Array<keyof typeof petRows>).map((mood) => (
          <div key={mood} className="flex flex-col items-center rounded-xl border border-border bg-card/40 px-3 py-5">
            <div className="relative size-28" role="img" aria-label={`${mood} animation`}>
              <span className={styles.sprite} style={getPetFrameStyle(mood, frame)} />
            </div>
            <h3 className="mt-3 text-sm">{labels[mood]}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
