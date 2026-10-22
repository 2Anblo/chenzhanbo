'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { usePathname } from 'next/navigation';
import { PawPrint, X } from 'lucide-react';
import { useI18n } from '@/components/I18nProvider';
import { getPetFrameStyle } from '@/lib/desktop-pet';
import styles from './DesktopPet.module.css';

type Mood = 'idle' | 'walk' | 'rest' | 'happy';
const size = 112;
const storageKey = 'calico-pet-collapsed';

function constrain(x: number, y: number) {
  return {
    x: Math.max(8, Math.min(x, window.innerWidth - size - 8)),
    y: Math.max(8, Math.min(y, window.innerHeight - size - 8)),
  };
}

export default function DesktopPet() {
  const { locale } = useI18n();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [mood, setMood] = useState<Mood>('idle');
  const [frame, setFrame] = useState(0);
  const [right, setRight] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [reduced, setReduced] = useState(false);
  const drag = useRef<{ x: number; y: number; left: number; top: number; moved: boolean } | null>(null);
  const happyUntil = useRef(0);
  const ticks = useRef(0);
  const zh = locale === 'zh';
  const excluded = pathname.startsWith('/admin') || pathname.startsWith('/dev-');

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReduced(media.matches);
    updateMotion();
    media.addEventListener('change', updateMotion);
    let saved: string | null = null;
    try { saved = localStorage.getItem(storageKey); } catch { /* Storage is optional. */ }
    setCollapsed(saved === null ? window.innerWidth < 768 : saved === 'true');
    setPosition(constrain(24, window.innerHeight - size - 24));
    setReady(true);
    const resize = () => setPosition((p) => constrain(p.x, p.y));
    window.addEventListener('resize', resize);
    return () => {
      media.removeEventListener('change', updateMotion);
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    if (!ready || collapsed || excluded || reduced || dragging) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      ticks.current += 1;
      setFrame((f) => (f + 1) % 4);
      const phase = ticks.current % 120;
      const nextMood: Mood = Date.now() < happyUntil.current ? 'happy'
        : phase < 48 ? 'idle' : phase < 60 ? 'walk' : phase < 112 ? 'rest' : 'idle';
      setMood(nextMood);
      if (nextMood === 'walk') {
        setPosition((p) => constrain(p.x + (right ? 5 : -5), p.y));
      }
      if (phase === 60) setRight((r) => !r);
    }, 240);
    return () => window.clearInterval(timer);
  }, [ready, collapsed, excluded, reduced, dragging, right]);

  function toggle(value: boolean) {
    setCollapsed(value);
    try { localStorage.setItem(storageKey, String(value)); } catch { /* Storage is optional. */ }
  }

  function respond() {
    happyUntil.current = Date.now() + 2400;
    setMood(reduced ? 'idle' : 'happy');
    setFrame(0);
  }

  function startDrag(event: PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) return;
    drag.current = { x: event.clientX, y: event.clientY, left: position.x, top: position.y, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  }

  function moveDrag(event: PointerEvent<HTMLButtonElement>) {
    const start = drag.current;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.hypot(dx, dy) > 5) start.moved = true;
    if (start.moved) setPosition(constrain(start.left + dx, start.top + dy));
  }

  if (!ready || excluded) return null;
  if (collapsed) return (
    <button type="button" onClick={() => toggle(false)} className={styles.restore}
      aria-label={zh ? '唤醒小猫' : 'Wake the cat'} title={zh ? '唤醒小猫' : 'Wake the cat'}>
      <PawPrint size={18} />
    </button>
  );

  const activeMood = reduced || dragging ? 'idle' : mood;
  return (
    <div className={styles.pet} style={{ left: position.x, top: position.y }}>
      <button type="button" className={styles.close} onClick={() => toggle(true)}
        aria-label={zh ? '收起小猫' : 'Hide the cat'} title={zh ? '收起小猫' : 'Hide the cat'}>
        <X size={14} />
      </button>
      <button type="button" className={styles.character}
        aria-label={zh ? '摸摸小猫，可拖动' : 'Pet the cat; drag to move'}
        title={zh ? '摸摸我 · 拖动搬家' : 'Pet me · Drag to move'}
        onPointerDown={startDrag} onPointerMove={moveDrag}
        onPointerUp={() => { setDragging(false); }}
        onPointerCancel={() => { drag.current = null; setDragging(false); }}
        onClick={() => { if (!drag.current?.moved) respond(); drag.current = null; }}>
        <span aria-hidden="true" className={styles.sprite} style={{
          ...getPetFrameStyle(activeMood, reduced || dragging ? 0 : frame),
          transform: activeMood === 'walk' && right ? 'scaleX(-1)' : undefined,
        }} />
      </button>
    </div>
  );
}
