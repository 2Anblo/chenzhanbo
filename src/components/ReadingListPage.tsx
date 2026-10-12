'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, BookOpen, FileText } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import type { ReadingItem } from '@/data/reading';

function ReadingCover({ item }: { item: ReadingItem }) {
  const [failed, setFailed] = useState(false);
  const Icon = item.kind === 'paper' ? FileText : BookOpen;

  return (
    <div className="relative aspect-[4/3] overflow-hidden border border-border bg-muted">
      {item.image && !failed ? (
        <Image src={item.image} alt="" fill sizes="(max-width: 640px) 96px, 240px" className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none" onError={() => setFailed(true)} />
      ) : (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          <Icon className="h-8 w-8 sm:h-12 sm:w-12" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}

export default function ReadingListPage({ items }: { items: ReadingItem[] }) {
  const { t, locale } = useTranslation();

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
          <ul className="divide-y divide-border border-y border-border">
            {items.map((item) => (
              <li key={item.id}>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="group grid grid-cols-[96px_minmax(0,1fr)] items-start gap-4 py-7 outline-offset-4 transition-colors hover:bg-muted/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary sm:grid-cols-[240px_minmax(0,1fr)] sm:gap-8 sm:py-8">
                  <ReadingCover item={item} />
                  <div className="min-w-0">
                    <p className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-muted-foreground">
                      <span className="text-primary">{t(`reading.${item.kind}`)}</span>
                      <span>{item.source}</span>
                    </p>
                    <h2 className="break-words font-display text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-xl">{item.title}</h2>
                    <p className="mt-3 line-clamp-4 text-sm leading-7 text-muted-foreground sm:line-clamp-none">{item.summary[locale]}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-primary">
                      {t('reading.readOriginal')}<ArrowUpRight size={14} aria-hidden="true" />
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="border-y border-border py-12 text-sm text-muted-foreground">{t('reading.empty')}</p>
        )}
      </main>
    </div>
  );
}
