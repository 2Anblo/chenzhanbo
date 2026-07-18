'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import type { WalineInstance } from '@waline/client';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

interface WalineCommentsProps {
  path: string;
  className?: string;
}

const serverURL = process.env.NEXT_PUBLIC_WALINE_SERVER_URL?.replace(/\/$/, '');

export default function WalineComments({ path, className }: WalineCommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState(false);
  const { locale } = useTranslation();

  useEffect(() => {
    if (!serverURL || !containerRef.current) return;

    let cancelled = false;
    let waline: WalineInstance | null = null;

    import('@waline/client')
      .then(({ init }) => {
        if (cancelled || !containerRef.current) return;

        waline = init({
          el: containerRef.current,
          serverURL,
          path,
          lang: locale === 'zh' ? 'zh-CN' : 'en',
          dark: 'html.dark',
          meta: ['nick', 'mail', 'link'],
          requiredMeta: ['nick', 'mail'],
          commentSorting: 'latest',
          pageSize: 10,
          pageview: false,
          comment: false,
          emoji: false,
          search: false,
          highlighter: false,
          imageUploader: false,
          texRenderer: false,
        });
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(true);
        }
      });

    return () => {
      cancelled = true;
      waline?.destroy();
    };
  }, [locale, path]);

  if (!serverURL) {
    if (process.env.NODE_ENV !== 'development') {
      return null;
    }

    return (
      <section className={cn('mt-16 border-t border-border pt-8', className)}>
        <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
          Set <code className="rounded bg-muted px-1.5 py-0.5">NEXT_PUBLIC_WALINE_SERVER_URL</code> to enable comments.
        </div>
      </section>
    );
  }

  return (
    <section className={cn('waline-comments mt-16 border-t border-border pt-8', className)}>
      <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-foreground">
        <MessageSquare size={16} aria-hidden="true" />
        Comments
      </div>
      {loadError ? (
        <p className="text-sm text-muted-foreground">
          Comments failed to load. Please try again later.
        </p>
      ) : (
        <div ref={containerRef} />
      )}
    </section>
  );
}
