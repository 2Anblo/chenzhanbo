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

function buildActivityDays(events: GitHubEvent[]) {
  const countByDate = new Map<string, number>();

  for (const event of events) {
    if (!event.created_at) continue;
    const date = event.created_at.slice(0, 10);
    countByDate.set(date, (countByDate.get(date) ?? 0) + 1);
  }

  return Array.from({ length: ACTIVITY_DAYS }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (ACTIVITY_DAYS - 1 - index));
    const day = date.toISOString().slice(0, 10);
    const count = countByDate.get(day) ?? 0;

    return {
      date: day,
      count,
      level: toLevel(count),
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

async function getGitHubStats() {
  const [user, repos, events] = await Promise.all([
    fetchJson<GitHubUser>(`https://api.github.com/users/${GITHUB_USERNAME}`),
    fetchJson<GitHubRepo[]>(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?type=owner&sort=updated&per_page=100`,
    ),
    fetchJson<GitHubEvent[]>(
      `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100`,
    ),
  ]);

  if (!user) return null;

  const safeRepos = Array.isArray(repos) ? repos : [];
  const safeEvents = Array.isArray(events) ? events : [];
  const totalStars = safeRepos.reduce((sum, repo) => sum + (repo.stargazers_count ?? 0), 0);
  const totalForks = safeRepos.reduce((sum, repo) => sum + (repo.forks_count ?? 0), 0);
  const activeDays = new Set(
    safeEvents.map((event) => event.created_at?.slice(0, 10)).filter(Boolean),
  ).size;

  return {
    username: GITHUB_USERNAME,
    profileUrl: user.html_url ?? `https://github.com/${GITHUB_USERNAME}`,
    publicRepos: user.public_repos ?? safeRepos.length,
    followers: user.followers ?? 0,
    following: user.following ?? 0,
    totalStars,
    totalForks,
    recentEvents: safeEvents.length,
    activeDays,
    days: buildActivityDays(safeEvents),
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
