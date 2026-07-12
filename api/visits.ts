import { Redis } from 'ioredis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const KEY = 'site:visits:total';

const redis = new Redis(process.env.REDIS_URL!);

interface AnalyticsCountResponse {
  version: number;
  query: {
    since?: string;
    until?: string;
  };
  data: {
    visitors: number;
    pageviews: number;
  };
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

async function fetchSeedCount(): Promise<number | null> {
  const token = process.env.VERCEL_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID;
  const projectId = process.env.VERCEL_PROJECT_ID;

  console.log('[visits] env check:', {
    hasToken: Boolean(token),
    hasTeamId: Boolean(teamId),
    hasProjectId: Boolean(projectId),
  });

  if (!token || !teamId || !projectId) {
    console.log('[visits] missing env vars, skipping seed');
    return null;
  }

  // Hobby / Free plans can only query the latest 31 days.
  // On Pro+ plans this returns all data since Web Analytics was enabled.
  const since = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString();
  const until = new Date().toISOString();

  const url = new URL('https://api.vercel.com/v1/query/web-analytics/visits/count');
  url.searchParams.set('projectId', projectId);
  url.searchParams.set('since', since);
  url.searchParams.set('until', until);
  url.searchParams.set('teamId', teamId);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const text = await response.text();
    console.log('[visits] Vercel API status:', response.status, 'body:', text.slice(0, 500));

    if (!response.ok) {
      return null;
    }

    const result = JSON.parse(text) as AnalyticsCountResponse;
    return result.data.pageviews;
  } catch (err) {
    console.log('[visits] Vercel API error:', err instanceof Error ? err.message : String(err));
    return null;
  }
}

async function ensureSeeded(): Promise<void> {
  // Only the first request that successfully creates the key will seed it.
  // Try to fetch the seed value first so we don't write 0 and then fail to retry.
  const initial = await fetchSeedCount();
  const seedValue = initial ?? 0;

  const seeded = await redis.setnx(KEY, String(seedValue));
  if (seeded === 1) {
    console.log('[visits] seeded counter with:', seedValue);
  } else {
    console.log('[visits] counter already exists, skipping seed');
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      await ensureSeeded();
      const count = Number((await redis.get(KEY)) ?? 0);
      res.setHeader('Cache-Control', 'public, s-maxage=60');
      res.status(200).json({ visits: count });
      return;
    }

    if (req.method === 'POST') {
      await ensureSeeded();
      const visits = await redis.incr(KEY);
      // Don't cache increment responses.
      res.setHeader('Cache-Control', 'no-store');
      res.status(200).json({ visits });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[visits] handler error:', message);
    res.status(500).json({ error: 'Failed to read visit count', message });
  }
}
