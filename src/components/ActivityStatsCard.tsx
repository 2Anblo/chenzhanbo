'use client';

import { useEffect, useState } from 'react';
import { Code2, ExternalLink, GitFork, Github, Star, Users, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityDay {
  date: string;
  count: number;
  level: number;
}

interface GitHubStats {
  username: string;
  profileUrl: string;
  publicRepos: number;
  followers: number;
  totalStars: number;
  totalForks: number;
  recentEvents: number;
  recentContributions: number;
  activeDays: number;
  days: ActivityDay[];
}

interface LeetCodeStats {
  username: string;
  profileUrl: string;
  solved: {
    all: number;
    easy: number;
    medium: number;
    hard: number;
  };
  ranking: number | null;
  recent: Array<{
    title: string;
    url: string;
    timestamp: number;
  }>;
}

interface ActivityStatsResponse {
  github: GitHubStats | null;
  leetcode: LeetCodeStats | null;
}

interface ActivityStatsCardProps {
  className?: string;
}

const HEAT_COLORS = [
  'bg-muted',
  'bg-primary/20 dark:bg-foreground/20',
  'bg-primary/35 dark:bg-foreground/35',
  'bg-primary/55 dark:bg-foreground/55',
  'bg-primary/80 dark:bg-foreground/80',
];

function formatNumber(value: number | null | undefined) {
  if (typeof value !== 'number') return '--';
  return new Intl.NumberFormat('en', { notation: value >= 10000 ? 'compact' : 'standard' }).format(
    value,
  );
}

function StatItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-md border border-border/50 bg-background/70 px-3 py-2">
      <Icon size={14} className="shrink-0 text-primary dark:text-foreground" aria-hidden="true" />
      <div className="min-w-0">
        <div className="font-mono text-sm font-semibold leading-none text-foreground">{value}</div>
        <div className="mt-1 truncate text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
      </div>
    </div>
  );
}

function buildSkeletonDays(): ActivityDay[] {
  return Array.from({ length: 91 }, (_, index) => ({
    date: '',
    count: 0,
    level: index % 11 === 0 ? 1 : 0,
  }));
}

const SKELETON_DAYS = buildSkeletonDays();

export default function ActivityStatsCard({ className }: ActivityStatsCardProps) {
  const [stats, setStats] = useState<ActivityStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/activity')
      .then((response) => (response.ok ? response.json() : null))
      .then((data: ActivityStatsResponse | null) => {
        if (!cancelled) {
          setStats(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const github = stats?.github;
  const leetcode = stats?.leetcode;
  const days = github?.days?.length ? github.days : SKELETON_DAYS;
  const latestSolved = leetcode?.recent[0];

  return (
    <div
      className={cn(
        'rounded-xl border border-border/40 bg-background/85 p-4 shadow-xl backdrop-blur-md animate-fade-in',
        loading && 'animate-pulse',
        className,
      )}
      style={{ animationDelay: '1.55s', opacity: 0 }}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-sm font-semibold text-foreground">
            <Github size={15} className="text-primary dark:text-foreground" aria-hidden="true" />
            Activity Stats
          </div>
          <p className="mt-1 text-xs text-muted-foreground">GitHub public activity and LeetCode progress</p>
        </div>
        {github && (
          <a
            href={github.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-mono text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary dark:hover:text-foreground"
          >
            @{github.username}
            <ExternalLink size={12} aria-hidden="true" />
          </a>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="min-w-0">
          <div className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-4">
            <StatItem icon={Code2} label="Repos" value={formatNumber(github?.publicRepos)} />
            <StatItem icon={Star} label="Stars" value={formatNumber(github?.totalStars)} />
            <StatItem icon={Users} label="Followers" value={formatNumber(github?.followers)} />
            <StatItem icon={GitFork} label="Forks" value={formatNumber(github?.totalForks)} />
          </div>

          <div className="rounded-lg border border-border/50 bg-card/80 p-3">
            <div className="mb-2 flex items-center justify-between gap-3 text-xs">
              <span className="font-mono text-muted-foreground">Contributions, last 13 weeks</span>
              <span className="shrink-0 font-mono text-foreground">
                {formatNumber(github?.recentContributions)} contributions
              </span>
            </div>
            <div className="grid grid-flow-col grid-rows-7 gap-[3px] overflow-hidden">
              {days.map((day, index) => (
                <span
                  key={`${day.date}-${index}`}
                  title={day.date ? `${day.count} contributions on ${day.date}` : 'Loading'}
                  className={cn(
                    'aspect-square min-h-2 rounded-[2px] transition-transform hover:scale-125 hover:ring-1 hover:ring-primary/60 dark:hover:ring-foreground/60',
                    HEAT_COLORS[Math.min(Math.max(day.level, 0), HEAT_COLORS.length - 1)],
                  )}
                />
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
              <span>{formatNumber(github?.activeDays)} active days</span>
              <span>Less - More</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border/50 bg-card/80 p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-sm font-semibold text-foreground">
              <Code2 size={15} className="text-[#ffa116]" aria-hidden="true" />
              LeetCode
            </div>
            {leetcode && (
              <a
                href={leetcode.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground transition-colors hover:text-[#ffa116]"
              >
                @{leetcode.username}
                <ExternalLink size={12} aria-hidden="true" />
              </a>
            )}
          </div>

          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <div className="font-mono text-3xl font-semibold leading-none text-foreground">
                {formatNumber(leetcode?.solved.all)}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                Problems solved
              </div>
            </div>
            <div className="text-right font-mono text-xs text-muted-foreground">
              {leetcode?.ranking ? `Rank ${formatNumber(leetcode.ranking)}` : 'leetcode.cn'}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-md bg-emerald-500/10 px-2 py-2 text-center">
              <div className="font-mono text-sm font-semibold text-emerald-500">
                {formatNumber(leetcode?.solved.easy)}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                Easy
              </div>
            </div>
            <div className="rounded-md bg-amber-500/10 px-2 py-2 text-center">
              <div className="font-mono text-sm font-semibold text-amber-500">
                {formatNumber(leetcode?.solved.medium)}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                Medium
              </div>
            </div>
            <div className="rounded-md bg-red-500/10 px-2 py-2 text-center">
              <div className="font-mono text-sm font-semibold text-red-500">
                {formatNumber(leetcode?.solved.hard)}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                Hard
              </div>
            </div>
          </div>

          <div className="mt-3 min-h-5 text-xs text-muted-foreground">
            {latestSolved ? (
              <a
                href={latestSolved.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate transition-colors hover:text-foreground"
                title={latestSolved.title}
              >
                Latest accepted: {latestSolved.title}
              </a>
            ) : (
              <span>{loading ? 'Loading LeetCode stats...' : 'Solved data from leetcode.cn'}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
