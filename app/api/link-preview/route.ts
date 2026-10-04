import { NextRequest, NextResponse } from 'next/server';
import { getLinkPreview } from '@/lib/link-preview';

export const runtime = 'nodejs';

const cache = new Map<string, { expires: number; result: ReturnType<typeof getLinkPreview> }>();

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('url');
  let url: URL;
  try {
    if (!raw || raw.length > 2048) throw new Error('Invalid URL');
    url = new URL(raw);
    if (url.protocol !== 'https:') throw new Error('HTTPS required');
    url.hash = '';
  } catch {
    return NextResponse.json({ error: 'Invalid preview URL' }, { status: 400 });
  }
  try {
    let entry = cache.get(url.href);
    if (!entry || entry.expires < Date.now()) {
      if (cache.size >= 200) cache.delete(cache.keys().next().value!);
      entry = { expires: Date.now() + 3_600_000, result: getLinkPreview(url) };
      cache.set(url.href, entry);
    }
    return NextResponse.json(await entry.result, { headers: { 'Cache-Control': 'public, max-age=3600' } });
  } catch {
    return NextResponse.json({ error: 'Preview unavailable' }, { status: 422 });
  }
}
