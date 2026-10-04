'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ExternalLink, Globe, ScanEye } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getSavedPreview, getSitePreview, type LinkPreviewData } from '@/lib/link-preview-data';
import { getCachedPreview, loadLinkPreview } from '@/lib/link-preview-cache';

export default function LinkPreview({ href, children, title }: { href?: string; children?: ReactNode; title?: string }) {
  const { locale } = useTranslation();
  const zh = locale === 'zh';
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<LinkPreviewData>();
  const [loading, setLoading] = useState(false);
  const [brokenImage, setBrokenImage] = useState<string>();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  let url: URL | null = null;
  try { url = href ? new URL(href) : null; } catch { /* Relative links stay ordinary links. */ }
  const external = url?.protocol === 'https:';
  const savedPreview = external ? getSavedPreview(href!) : undefined;
  const sitePreview = external ? getSitePreview(href!) : undefined;
  const displayed = savedPreview || preview;
  const image = sitePreview?.image || displayed?.image;
  const newTab = url?.protocol === 'https:' || url?.protocol === 'http:';
  const clearTimer = () => { if (timer.current) clearTimeout(timer.current); };
  const changeOpen = (next: boolean) => {
    clearTimer();
    setOpen(next);
    if (!next || !href) return;
    const cached = getCachedPreview(href);
    setPreview(cached);
    setLoading(!cached);
    loadLinkPreview(href)
      .then((data) => { if (data) setPreview(data); })
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
          {image && brokenImage !== image ? (
            // Remote metadata images have arbitrary dimensions and hosts.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" referrerPolicy="no-referrer" onError={() => setBrokenImage(image)} className="m-0 aspect-[1.91/1] w-full object-cover" />
          ) : (
            <span className="flex h-24 items-center justify-center bg-gradient-to-br from-primary/10 to-muted"><Globe className="h-9 w-9 text-primary/50" aria-hidden="true" /></span>
          )}
          <span className="block space-y-2 p-4">
            <span className="line-clamp-2 text-sm font-semibold leading-snug">{displayed?.title || children}</span>
            <span aria-live="polite" className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">{displayed?.description || (loading ? (zh ? '正在读取链接摘要…' : 'Loading preview…') : (zh ? '打开原网页了解更多。' : 'Visit the original page to learn more.'))}</span>
            <span className="flex items-center gap-1.5 border-t border-border pt-2 text-[10px] text-muted-foreground"><Globe size={11} aria-hidden="true" /><span className="truncate">{displayed?.siteName || sitePreview?.siteName || url!.hostname}</span><ExternalLink size={11} className="ml-auto shrink-0" aria-hidden="true" /></span>
          </span>
        </a>
      </PopoverContent>
    </Popover>
  );
}
