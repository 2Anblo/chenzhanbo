import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? '2Anblo';
const LEETCODE_USERNAME =
  process.env.LEETCODE_USERNAME ?? process.env.NEXT_PUBLIC_LEETCODE_USERNAME ?? 'zanblo';
const ACTIVITY_DAYS = 91;

interface GitHubUser {
  html_url?: string;
  public_repos?: number;
  followers?: number;
  following?: number;
}

interface GitHubRepo {
  stargazers_count?: number;
  forks_count?: number;
}

interface GitHubEvent {
  type?: string;
  created_at?: string;
}

interface GitHubContributionDay {
  date: string;
  count: number;
  level: number;
}

interface LeetCodeAcceptedQuestionCount {
  difficulty: string;
  count: number;
}

interface LeetCodeGraphqlResponse {
  data?: {
    userProfileUserQuestionProgressV2?: {
      numAcceptedQuestions?: LeetCodeAcceptedQuestionCount[];
    } | null;
  };
}

function toLevel(count: number) {
  if (count === 0) return 0;
  if (count <= 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

function buildActivityDays(countByDate: Map<string, GitHubContributionDay>) {
  return Array.from({ length: ACTIVITY_DAYS }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (ACTIVITY_DAYS - 1 - index));
    const day = date.toISOString().slice(0, 10);
    const contributionDay = countByDate.get(day);
    const count = contributionDay?.count ?? 0;

    return {
      date: day,
      count,
      level: contributionDay?.level ?? toLevel(count),
    };
  });
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(8000),
      headers: {
        Accept: 'application/json',
        'User-Agent': 'chenzhanbo.dev activity card',
        ...init?.headers,
      },
      next: { revalidate },
    });

    if (!response.ok) return null;

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: {
        Accept: 'text/html',
        'User-Agent': 'chenzhanbo.dev activity card',
      },
      next: { revalidate },
    });

    if (!response.ok) return null;

    return await response.text();
  } catch {
    return null;
  }
}

function parseContributionCalendar(html: string) {
  const days = new Map<string, GitHubContributionDay>();
  const dayPattern =
    /<td(?=[^>]*class="[^"]*ContributionCalendar-day)(?=[^>]*data-date="([^"]+)")(?=[^>]*data-level="(\d+)")[^>]*><\/td>\s*<tool-tip[^>]*>([^<]*)<\/tool-tip>/g;

  for (const match of html.matchAll(dayPattern)) {
    const [, date, level, label] = match;
    const countMatch = label.match(/([\d,]+)\s+contribution/);
    const count = countMatch ? Number(countMatch[1].replace(/,/g, '')) : 0;

    days.set(date, {
      date,
      count,
      level: Number(level),
    });
  }

  return days;
}

async function getContributionCalendarDays() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - (ACTIVITY_DAYS - 1));
  const years = Array.from(new Set([start.getUTCFullYear(), end.getUTCFullYear()]));
  const calendars = await Promise.all(
    years.map((year) =>
      fetchText(
        `https://github.com/users/${GITHUB_USERNAME}/contributions?from=${year}-01-01&to=${year}-12-31`,
      ),
    ),
  );
  const allDays = new Map<string, GitHubContributionDay>();

  for (const html of calendars) {
    if (!html) continue;
    for (const [date, day] of parseContributionCalendar(html)) {
      allDays.set(date, day);
    }
  }

  const days = buildActivityDays(allDays);

  return {
    days,
    activeDays: days.filter((day) => day.count > 0).length,
    totalContributions: days.reduce((sum, day) => sum + day.count, 0),
  };
}

async function getGitHubStats() {
  const [user, repos, events, calendar] = await Promise.all([
    fetchJson<GitHubUser>(`https://api.github.com/users/${GITHUB_USERNAME}`),
    fetchJson<GitHubRepo[]>(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?type=owner&sort=updated&per_page=100`,
    ),
    fetchJson<GitHubEvent[]>(
      `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100`,
    ),
    getContributionCalendarDays(),
  ]);

  if (!user) return null;

  const safeRepos = Array.isArray(repos) ? repos : [];
  const safeEvents = Array.isArray(events) ? events : [];
  const totalStars = safeRepos.reduce((sum, repo) => sum + (repo.stargazers_count ?? 0), 0);
  const totalForks = safeRepos.reduce((sum, repo) => sum + (repo.forks_count ?? 0), 0);

  return {
    username: GITHUB_USERNAME,
    profileUrl: user.html_url ?? `https://github.com/${GITHUB_USERNAME}`,
    publicRepos: user.public_repos ?? safeRepos.length,
    followers: user.followers ?? 0,
    following: user.following ?? 0,
    totalStars,
    totalForks,
    recentEvents: safeEvents.length,
    recentContributions: calendar.totalContributions,
    activeDays: calendar.activeDays,
    days: calendar.days,
  };
}

async function getLeetCodeStats() {
  const query = `
    query userProgress($userSlug: String!) {
      userProfileUserQuestionProgressV2(userSlug: $userSlug) {
        numAcceptedQuestions {
          difficulty
          count
        }
      }
    }
  `;

  const data = await fetchJson<LeetCodeGraphqlResponse>('https://leetcode.cn/graphql/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Referer: 'https://leetcode.cn',
    },
    body: JSON.stringify({
      query,
      variables: { userSlug: LEETCODE_USERNAME },
    }),
  });

  const acceptedQuestions = data?.data?.userProfileUserQuestionProgressV2?.numAcceptedQuestions;
  if (!acceptedQuestions) return null;

  const counts = Object.fromEntries(
    acceptedQuestions.map((item) => [item.difficulty.toLowerCase(), item.count]),
  );

  return {
    username: LEETCODE_USERNAME,
    profileUrl: `https://leetcode.cn/u/${LEETCODE_USERNAME}/`,
    solved: {
      all: (counts.easy ?? 0) + (counts.medium ?? 0) + (counts.hard ?? 0),
      easy: counts.easy ?? 0,
      medium: counts.medium ?? 0,
      hard: counts.hard ?? 0,
    },
    ranking: null,
    reputation: null,
    recent: [],
  };
}

export async function GET() {
  const [github, leetcode] = await Promise.all([getGitHubStats(), getLeetCodeStats()]);

  return NextResponse.json(
    {
      github,
      leetcode,
      updatedAt: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
      },
    },
  );
}
