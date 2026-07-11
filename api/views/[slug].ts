import { Redis } from 'ioredis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const KEY_PREFIX = 'blog:views:';

const redis = new Redis(process.env.REDIS_URL!);

function buildKey(slug: string): string {
  return `${KEY_PREFIX}${slug}`;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  // Allow local Vite dev server to call the API during development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { slug } = req.query;
  if (typeof slug !== 'string' || !slug.trim()) {
    res.status(400).json({ error: 'Invalid or missing slug' });
    return;
  }

  const key = buildKey(slug);

  try {
    if (req.method === 'POST') {
      const views = await redis.incr(key);
      res.status(200).json({ views });
      return;
    }

    if (req.method === 'GET') {
      const views = Number((await redis.get(key)) ?? 0);
      res.status(200).json({ views });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to read view count', message });
  }
}
