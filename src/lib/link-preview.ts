import { lookup } from 'node:dns/promises';
import { request } from 'node:https';
import { load } from 'cheerio';
import ipaddr from 'ipaddr.js';

// Pin the validated address to the connection, including after redirects.
async function readPage(url: URL, redirects = 0): Promise<{ html: string; url: URL }> {
  if (url.protocol !== 'https:' || url.username || url.password || (url.port && url.port !== '443')) {
    throw new Error('Unsupported URL');
  }
  const hostname = url.hostname.replace(/^\[|\]$/g, '');
  const addresses = await lookup(hostname, { all: true });
  if (!addresses.length || addresses.some(({ address }) => ipaddr.process(address).range() !== 'unicast')) {
    throw new Error('Non-public address');
  }
  const address = addresses[0];
  return new Promise((resolve, reject) => {
    const req = request(url, {
      family: address.family,
      lookup: (_hostname, _options, callback) => callback(null, address.address, address.family),
      headers: { 'User-Agent': 'BlogLinkPreview/1.0', Accept: 'text/html', 'Accept-Encoding': 'identity' },
    }, (res) => {
      if (res.statusCode && [301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        res.destroy();
        if (redirects >= 3) return reject(new Error('Too many redirects'));
        readPage(new URL(res.headers.location, url), redirects + 1).then(resolve, reject);
        return;
      }
      if (res.statusCode !== 200 || !res.headers['content-type']?.includes('text/html')) {
        res.destroy();
        reject(new Error('No HTML preview'));
        return;
      }
      const chunks: Buffer[] = [];
      let size = 0;
      res.on('data', (chunk: Buffer) => {
        size += chunk.length;
        if (size > 1_000_000) {
          req.destroy(new Error('Page too large'));
          return;
        }
        chunks.push(chunk);
      });
      res.on('error', reject);
      res.on('end', () => resolve({ html: Buffer.concat(chunks).toString('utf8'), url }));
    });
    const timer = setTimeout(() => req.destroy(new Error('Preview timed out')), 4000);
    req.on('close', () => clearTimeout(timer));
    req.on('error', reject);
    req.end();
  });
}

export async function getLinkPreview(url: URL) {
  const page = await readPage(url);
  const $ = load(page.html);
  const meta = (key: string) => $(`meta[property="${key}"], meta[name="${key}"]`).first().attr('content')?.trim();
  const title = (meta('og:title') || meta('twitter:title') || $('title').first().text() || url.hostname).slice(0, 200);
  const description = (meta('og:description') || meta('twitter:description') || meta('description') || '').slice(0, 500);
  let image: string | undefined;
  try {
    const raw = meta('og:image') || meta('twitter:image');
    if (raw) {
      const candidate = new URL(raw, page.url);
      if (candidate.protocol === 'https:' && !candidate.username && !candidate.password) image = candidate.href;
    }
  } catch { /* A malformed image must not hide the rest of the preview. */ }
  return { title, description, image, siteName: (meta('og:site_name') || page.url.hostname).slice(0, 100) };
}
