import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { load } from 'cheerio';
import { getLinkPreview } from '../src/lib/link-preview';
import { getSitePreview, normalizePreviewUrl, type LinkPreviewData } from '../src/lib/link-preview-data';

const output = 'src/data/link-previews.json';
const previews: Record<string, LinkPreviewData> = JSON.parse(await readFile(output, 'utf8'));
const links = new Set<string>();

function addLink(href: string) {
  try {
    const url = new URL(href);
    if (url.protocol !== 'https:' || url.username || url.password || url.hostname.endsWith('chenzhanbo.com')) return;
    if (/\.(png|jpe?g|gif|svg|webp|mp4|zip)$/i.test(url.pathname)) return;
    links.add(normalizePreviewUrl(href));
  } catch { /* Skip relative links and malformed text. */ }
}

async function scan(directory: string) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await scan(path);
    else if (/\.(md|json)$/.test(entry.name)) {
      const raw = await readFile(path, 'utf8');
      const markdown = entry.name.endsWith('.json') ? JSON.parse(raw).content || '' : raw;
      for (const match of markdown.matchAll(/(?<!!)\[[^\]]*\]\((https:\/\/[^\s)]+)(?:\s+"[^"]*")?\)|<(https:\/\/[^>\s]+)>/g)) {
        addLink(match[1] || match[2]);
      }
    }
  }
}

await scan('content');
await scan('src/data/blog-translations/en');

// Published articles may be newer than the checked-in Markdown. No database credentials needed.
if (process.argv.includes('--live')) {
  const origin = 'https://www.chenzhanbo.com';
  const response = await fetch(`${origin}/sitemap.xml`, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`Sitemap: HTTP ${response.status}`);
  const sitemap = load(await response.text(), { xmlMode: true });
  const articles = sitemap('loc').toArray().map((node) => sitemap(node).text())
    .filter((href) => href.startsWith(`${origin}/blog/`));
  for (const href of articles) {
    try {
      const page = await fetch(href, { signal: AbortSignal.timeout(15000) });
      if (!page.ok) throw new Error('Article unavailable');
      const $ = load(await page.text());
      $('article a[href]').each((_index, node) => { addLink($(node).attr('href')!); });
    } catch { console.warn(`Could not scan ${href}`); }
  }
  console.log(`Scanned ${articles.length} published articles.`);
}

const images = new Map<string, string>();
await mkdir('public/link-previews', { recursive: true });
async function saveImage(href: string) {
  if (images.has(href)) return images.get(href);
  const response = await fetch(href, { signal: AbortSignal.timeout(10000) });
  const extension = new Map([['image/png', 'png'], ['image/jpeg', 'jpg'], ['image/webp', 'webp'], ['image/gif', 'gif']])
    .get(response.headers.get('content-type')?.split(';')[0] || '');
  if (!response.ok || !extension || !response.body) { await response.body?.cancel(); return undefined; }
  const chunks: Uint8Array[] = [];
  let size = 0;
  for await (const chunk of response.body) {
    size += chunk.length;
    if (size > 3_000_000) return undefined;
    chunks.push(chunk);
  }
  const bytes = Buffer.concat(chunks);
  const filename = `${createHash('sha256').update(bytes).digest('hex').slice(0, 20)}.${extension}`;
  await writeFile(`public/link-previews/${filename}`, bytes);
  const local = `/link-previews/${filename}`;
  images.set(href, local);
  return local;
}

let updated = 0;
for (const href of [...links].sort()) {
  if (previews[href] && !process.argv.includes('--refresh')) continue;
  try {
    const preview = await getLinkPreview(new URL(href));
    const site = getSitePreview(href);
    if (site?.image) preview.image = site.image;
    else if (preview.image) {
      try { preview.image = await saveImage(preview.image); } catch { preview.image = undefined; }
    }
    previews[href] = preview;
    updated++;
    console.log(`Saved ${href}`);
  } catch { console.warn(`Kept runtime fallback for ${href}`); }
  // Respect arXiv's request spacing when a refresh contains several papers.
  if (new URL(href).hostname === 'arxiv.org') await new Promise((resolve) => setTimeout(resolve, 3100));
}
await writeFile(output, JSON.stringify(Object.fromEntries(Object.entries(previews).sort()), null, 2) + '\n');
console.log(`Saved ${updated} previews; ${Object.keys(previews).length} available locally.`);
