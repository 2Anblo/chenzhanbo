import { NextRequest, NextResponse } from 'next/server';
import { getLinkPreview } from '@/lib/link-preview';
import { unstable_cache } from 'next/cache';
import { getSavedPreview, normalizePreviewUrl } from '@/lib/link-preview-data';

export const runtime = 'nodejs';

const cache = new Map<string, { expires: number; result: ReturnType<typeof getLinkPreview> }>();
const getPersistentPreview = unstable_cache(
  (href: string) => getLinkPreview(new URL(href)),
  ['link-preview-v2'],
  { revalidate: 7 * 24 * 60 * 60 },
);

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('url');
  let url: URL;
  try {
    if (!raw || raw.length > 2048) throw new Error('Invalid URL');
    url = new URL(raw);
    if (url.protocol !== 'https:') throw new Error('HTTPS required');
    url = new URL(normalizePreviewUrl(url.href));
  } catch {
    return NextResponse.json({ error: 'Invalid preview URL' }, { status: 400 });
  }
  try {
    const saved = getSavedPreview(url.href);
    if (saved) return NextResponse.json(saved, { headers: { 'Cache-Control': 'public, max-age=86400' } });
    let entry = cache.get(url.href);
    if (!entry || entry.expires < Date.now()) {
      if (cache.size >= 200) cache.delete(cache.keys().next().value!);
      entry = { expires: Date.now() + 3_600_000, result: getPersistentPreview(url.href) };
      cache.set(url.href, entry);
    }
    return NextResponse.json(await entry.result, { headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800' } });
  } catch {
    cache.delete(url.href);
    return NextResponse.json({ error: 'Preview unavailable' }, { status: 422 });
  }
}
