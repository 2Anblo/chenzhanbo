import type { VercelRequest, VercelResponse } from '@vercel/node';

interface AnalyticsCountResponse {
  version: number;
  query: {
    since: string;
    until: string;
  };
  data: {
    visitors: number;
    pageviews: number;
  };
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
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

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const token = getRequiredEnv('VERCEL_TOKEN');
    const teamId = getRequiredEnv('VERCEL_TEAM_ID');
    const projectId = getRequiredEnv('VERCEL_PROJECT_ID');

    // Hobby / Free plans can only query the latest 31 days.
    const since = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString();
    const until = new Date().toISOString();

    const url = new URL('https://api.vercel.com/v1/query/web-analytics/visits/count');
    url.searchParams.set('projectId', projectId);
    url.searchParams.set('since', since);
    url.searchParams.set('until', until);
    url.searchParams.set('teamId', teamId);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Vercel API ${response.status}: ${text}`);
    }

    const result = (await response.json()) as AnalyticsCountResponse;

    // Cache the response on Vercel's edge for 5 minutes, stale-while-revalidate for 1 hour.
    // This protects against rate limits and keeps the number close to real-time.
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=3600',
    );

    res.status(200).json({
      visits: result.data.pageviews,
      visitors: result.data.visitors,
      since: result.query.since,
      until: result.query.until,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch visit count', message });
  }
}
