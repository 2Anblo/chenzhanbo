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

  if (!token || !teamId || !projectId) {
    return null;
  }

  // Hobby / Free plans can only query the latest 31 days.
  // On Pro+ plans this returns all data since Web Analytics was enabled,
  // so the seed value will be the true historical count.
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

    if (!response.ok) {
      return null;
    }

    const result = (await response.json()) as AnalyticsCountResponse;
    return result.data.pageviews;
  } catch {
    return null;
  }
}

async function ensureSeeded(): Promise<void> {
  // Only the first request that successfully creates the key will seed it.
  const seeded = await redis.setnx(KEY, '0');
  if (seeded !== 1) {
    return;
  }

  const initial = await fetchSeedCount();
  if (initial !== null && initial > 0) {
    await redis.set(KEY, String(initial));
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
    res.status(500).json({ error: 'Failed to read visit count', message });
  }
}
