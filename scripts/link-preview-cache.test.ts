import assert from 'node:assert/strict';
import { getCachedPreview, loadLinkPreview } from '../src/lib/link-preview-cache';
import { normalizePreviewUrl, getSitePreview } from '../src/lib/link-preview-data';

const key = 'https://example.com/paper';
const stale = { title: 'Previously saved', description: 'Ready immediately', siteName: 'Example' };
let stored = JSON.stringify([[key, { data: stale, savedAt: Date.now() - 8 * 86400000 }]]);
Object.defineProperty(globalThis, 'window', { value: { localStorage: {
  getItem: () => stored,
  setItem: (_key: string, value: string) => { stored = value; },
} }, configurable: true });

assert.equal(normalizePreviewUrl('https://arxiv.org/pdf/2111.00396.pdf#page=2'), 'https://arxiv.org/abs/2111.00396');
assert.equal(normalizePreviewUrl('https://export.arxiv.org/html/2111.00396v2'), 'https://arxiv.org/abs/2111.00396v2');
assert.notEqual(normalizePreviewUrl('https://example.com/?id=1'), normalizePreviewUrl('https://example.com/?id=2'));
assert.equal(getSitePreview('https://arxiv.org/abs/2601.00001')?.image, '/link-previews/arxiv.svg');
assert.equal(getSitePreview('https://arxiv.org.attacker.example/abs/2111.00396'), undefined);
assert.deepEqual(getCachedPreview(key), stale, 'Stored data is immediately available before refresh');

let requests = 0;
const fresh = { title: 'Updated paper', description: 'Updated abstract', siteName: 'Example' };
globalThis.fetch = async () => { requests++; return Response.json(fresh); };
const first = loadLinkPreview(key);
const second = loadLinkPreview(`${key}#section`);
assert.equal(first, second, 'Duplicate components must share one in-flight request');
assert.deepEqual(getCachedPreview(key), stale, 'Refreshing must not blank the existing card');
assert.deepEqual(await first, fresh);
await loadLinkPreview(key);
assert.equal(requests, 1, 'Reopening the same link must not fetch again');
assert.match(stored, /Updated paper/, 'Successful previews survive a page reload');

globalThis.fetch = async () => { requests++; throw new Error('Offline'); };
assert.equal(await loadLinkPreview('https://example.com/offline'), undefined);
await loadLinkPreview('https://example.com/offline');
assert.equal(requests, 2, 'Repeated failures have a cooldown');

const paper = 'https://arxiv.org/abs/2111.00396';
assert.ok(getCachedPreview(paper)?.description, 'Known papers ship with their own abstract');
assert.equal((await loadLinkPreview(paper))?.image, '/link-previews/arxiv.svg');
assert.equal(requests, 2, 'Saved paper previews must work with zero network requests');
console.log('Link previews: local snapshots, URL aliases, storage, deduplication, stale refresh and failure cooldown passed.');
