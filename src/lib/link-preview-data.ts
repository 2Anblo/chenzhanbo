import savedPreviews from '@/data/link-previews.json';

export type LinkPreviewData = { title: string; description: string; image?: string; siteName: string };

export function normalizePreviewUrl(href: string): string {
  const url = new URL(href);
  url.hash = '';
  if (['arxiv.org', 'www.arxiv.org', 'export.arxiv.org'].includes(url.hostname)) {
    const paper = /^\/(?:abs|pdf|html)\/(.+?)(?:\.pdf)?\/?$/.exec(url.pathname);
    if (paper) {
      url.hostname = 'arxiv.org';
      url.protocol = 'https:';
      url.pathname = `/abs/${paper[1]}`;
      url.search = '';
    }
  }
  return url.href;
}

export function getSavedPreview(href: string): LinkPreviewData | undefined {
  return (savedPreviews as Record<string, LinkPreviewData>)[normalizePreviewUrl(href)];
}

export function getSitePreview(href: string): Pick<LinkPreviewData, 'image' | 'siteName'> | undefined {
  const hostname = new URL(href).hostname;
  if (['arxiv.org', 'www.arxiv.org', 'export.arxiv.org'].includes(hostname)) {
    return { siteName: 'arXiv', image: '/link-previews/arxiv.svg' };
  }
}
