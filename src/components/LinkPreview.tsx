'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ExternalLink, Globe, ScanEye } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type Preview = { title: string; description: string; image?: string; siteName: string };

export default function LinkPreview({ href, children, title }: { href?: string; children?: ReactNode; title?: string }) {
  const { locale } = useTranslation();
  const zh = locale === 'zh';
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [loading, setLoading] = useState(false);
  const [brokenImage, setBrokenImage] = useState(false);
  const loaded = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  let url: URL | null = null;
  try { url = href ? new URL(href) : null; } catch { /* Relative links stay ordinary links. */ }
  const external = url?.protocol === 'https:';
  const newTab = url?.protocol === 'https:' || url?.protocol === 'http:';
  const clearTimer = () => { if (timer.current) clearTimeout(timer.current); };
  const changeOpen = (next: boolean) => {
    clearTimer();
    setOpen(next);
    if (!next || loaded.current || !href) return;
    loaded.current = true;
    setLoading(true);
    fetch(`/api/link-preview?url=${encodeURIComponent(href)}`, { signal: AbortSignal.timeout(18000) })
      .then(async (response) => { if (response.ok) setPreview(await response.json()); })
      .catch(() => { /* Keep a usable link when metadata is unavailable. */ })
      .finally(() => setLoading(false));
  };
  const enter = () => { clearTimer(); timer.current = setTimeout(() => changeOpen(true), 250); };
  const leave = () => { clearTimer(); timer.current = setTimeout(() => changeOpen(false), 200); };
  const link = <a href={href} title={title} className="text-primary hover:underline" target={newTab ? '_blank' : undefined} rel={newTab ? 'noopener noreferrer' : undefined} onFocus={external ? () => changeOpen(true) : undefined}>{children}</a>;
  if (!external) return link;

  return (
    <Popover open={open} onOpenChange={changeOpen}>
      <PopoverAnchor asChild>
        <span onPointerEnter={(event) => { if (event.pointerType !== 'touch') enter(); }} onPointerLeave={(event) => { if (event.pointerType !== 'touch') leave(); }}>
          {link}
          <PopoverTrigger asChild>
            <button type="button" aria-label={`${zh ? '预览链接' : 'Preview link'}: ${url!.hostname}`} className="ml-0.5 inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground align-middle hover:bg-muted hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
              <ScanEye size={12} aria-hidden="true" />
            </button>
          </PopoverTrigger>
        </span>
      </PopoverAnchor>
      <PopoverContent side="top" sideOffset={10} collisionPadding={16} onOpenAutoFocus={(event) => event.preventDefault()} onCloseAutoFocus={(event) => event.preventDefault()} onPointerEnter={clearTimer} onPointerLeave={(event) => { if (event.pointerType !== 'touch') leave(); }} className="w-[300px] max-w-[calc(100vw-32px)] overflow-hidden rounded-xl p-0 shadow-xl">
        <a href={href} target="_blank" rel="noopener noreferrer" className="block text-popover-foreground no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
          {preview?.image && !brokenImage ? (
            // Remote metadata images have arbitrary dimensions and hosts.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview.image} alt="" referrerPolicy="no-referrer" onError={() => setBrokenImage(true)} className="m-0 aspect-[1.91/1] w-full object-cover" />
          ) : (
            <span className="flex h-24 items-center justify-center bg-gradient-to-br from-primary/10 to-muted"><Globe className="h-9 w-9 text-primary/50" aria-hidden="true" /></span>
          )}
          <span className="block space-y-2 p-4">
            <span className="block line-clamp-2 text-sm font-semibold leading-snug">{preview?.title || children}</span>
            <span aria-live="polite" className="block line-clamp-3 text-xs leading-relaxed text-muted-foreground">{loading ? (zh ? '正在读取链接摘要…' : 'Loading preview…') : preview?.description || (zh ? '打开原网页了解更多。' : 'Visit the original page to learn more.')}</span>
            <span className="flex items-center gap-1.5 border-t border-border pt-2 text-[10px] text-muted-foreground"><Globe size={11} aria-hidden="true" /><span className="truncate">{preview?.siteName || url!.hostname}</span><ExternalLink size={11} className="ml-auto shrink-0" aria-hidden="true" /></span>
          </span>
        </a>
      </PopoverContent>
    </Popover>
  );
}
