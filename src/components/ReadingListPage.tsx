'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import ReadingListItem from '@/components/ReadingListItem';
import styles from './ReadingListItem.module.css';
import { useTranslation } from '@/hooks/useTranslation';
import type { ReadingItem } from '@/types/reading';

export default function ReadingListPage({ items }: { items: ReadingItem[] }) {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-5 pb-24 pt-24 sm:px-6 md:pt-32">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft size={14} aria-hidden="true" />
          {t('common.backToHome')}
        </Link>
        <header className="mb-12 mt-8">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-primary">Reading / 阅览</p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">{t('reading.title')}</h1>
        </header>
        {items.length ? (
          <ul className={styles.list} data-has-active={activeId !== null}
            onPointerLeave={(event) => {
              if (event.pointerType === 'mouse' && !event.currentTarget.contains(document.activeElement)) setActiveId(null);
            }}>
            {items.map((item) => (
              <ReadingListItem key={item.id} item={item} expanded={activeId === item.id}
                onExpand={() => setActiveId(item.id)}
                onCollapse={() => setActiveId((current) => current === item.id ? null : current)}
                onToggle={() => setActiveId((current) => current === item.id ? null : item.id)} />
            ))}
          </ul>
        ) : (
          <p className="border-y border-border py-12 text-sm text-muted-foreground">{t('reading.empty')}</p>
        )}
      </main>
    </div>
  );
}
