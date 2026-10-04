import { getSavedPreview, normalizePreviewUrl, type LinkPreviewData } from '@/lib/link-preview-data';

const CACHE_KEY = 'link-previews:v1';
const MAX_ENTRIES = 100;
const FRESH_FOR = 7 * 24 * 60 * 60 * 1000;
const KEEP_FOR = 30 * 24 * 60 * 60 * 1000;
type Entry = { data: LinkPreviewData; savedAt: number };
const entries = new Map<string, Entry>();
const pending = new Map<string, Promise<LinkPreviewData | undefined>>();
const retryAfter = new Map<string, number>();
let hydrated = false;

function validEntry(value: unknown): value is Entry {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Partial<Entry>;
  return typeof entry.savedAt === 'number' && entry.savedAt <= Date.now()
    && Date.now() - entry.savedAt < KEEP_FOR && !!entry.data
    && typeof entry.data.title === 'string' && typeof entry.data.description === 'string'
    && typeof entry.data.siteName === 'string'
    && (entry.data.image === undefined || (typeof entry.data.image === 'string'
      && /^(https:\/\/|\/link-previews\/)/.test(entry.data.image)));
}

function hydrate() {
  if (hydrated || typeof window === 'undefined') return;
  hydrated = true;
  try {
    const stored: unknown = JSON.parse(window.localStorage.getItem(CACHE_KEY) || '[]');
    if (!Array.isArray(stored)) return;
    for (const item of stored.slice(-MAX_ENTRIES)) {
      if (Array.isArray(item) && typeof item[0] === 'string' && validEntry(item[1])) entries.set(item[0], item[1]);
    }
  } catch { /* Storage may be disabled or contain an older format. */ }
}

function persist() {
  while (entries.size > MAX_ENTRIES) entries.delete(entries.keys().next().value!);
  try { window.localStorage.setItem(CACHE_KEY, JSON.stringify([...entries])); } catch { /* Memory caching still works. */ }
}

export function getCachedPreview(href: string): LinkPreviewData | undefined {
  const saved = getSavedPreview(href);
  if (saved) return saved;
  hydrate();
  const entry = entries.get(normalizePreviewUrl(href));
  return entry && Date.now() - entry.savedAt < KEEP_FOR ? entry.data : undefined;
}

// All occurrences share the same in-flight request, including across article navigation.
// Older data stays visible while a refresh runs in the background.
export function loadLinkPreview(href: string): Promise<LinkPreviewData | undefined> {
  const saved = getSavedPreview(href);
  if (saved) return Promise.resolve(saved);
  hydrate();
  const key = normalizePreviewUrl(href);
  const cached = entries.get(key);
  if (cached && Date.now() - cached.savedAt < FRESH_FOR) return Promise.resolve(cached.data);
  if ((retryAfter.get(key) ?? 0) > Date.now()) return Promise.resolve(getCachedPreview(key));
  const existing = pending.get(key);
  if (existing) return existing;
  const request = fetch(`/api/link-preview?url=${encodeURIComponent(key)}`, { signal: AbortSignal.timeout(18000) })
    .then(async (response) => {
      if (!response.ok) throw new Error('Preview unavailable');
      const data: unknown = await response.json();
      const entry = { data, savedAt: Date.now() };
      if (!validEntry(entry)) throw new Error('Invalid preview');
      entries.delete(key);
      entries.set(key, entry);
      persist();
      retryAfter.delete(key);
      return entry.data;
    })
    .catch(() => {
      if (retryAfter.size >= MAX_ENTRIES) retryAfter.delete(retryAfter.keys().next().value!);
      retryAfter.set(key, Date.now() + 60_000);
      return getCachedPreview(key);
    })
    .finally(() => pending.delete(key));
  pending.set(key, request);
  return request;
}
