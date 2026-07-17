'use client';

import { useEffect, useState } from 'react';
import { Code2, ExternalLink, GitFork, Github, Star, Users, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

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
  compact?: boolean;
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
    <div className="glass-panel-inner flex min-w-0 items-center gap-2 px-3 py-2">
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

export default function ActivityStatsCard({ className, compact = false }: ActivityStatsCardProps) {
  const { t } = useTranslation();
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
        'glass-panel p-4 animate-fade-in',
        loading && 'animate-pulse',
        className,
      )}
      style={{ animationDelay: '1.55s', opacity: 0 }}
    >
      <div
        className={cn(
          'mb-4 flex gap-4',
          compact ? 'flex-col items-start' : 'items-start justify-between',
        )}
      >
        <div>
          <div className="flex items-center gap-2 font-mono text-sm font-semibold text-foreground">
            <Github size={15} className="text-primary dark:text-foreground" aria-hidden="true" />
            {t('activityStats.title')}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{t('activityStats.description')}</p>
        </div>
        {github && (
          <a
            href={github.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-mono text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary dark:hover:text-foreground',
              compact && '-mt-2',
            )}
          >
            @{github.username}
            <ExternalLink size={12} aria-hidden="true" />
          </a>
        )}
      </div>

      <div className={cn('grid gap-4', !compact && 'lg:grid-cols-[1.4fr_1fr]')}>
        <div className="min-w-0">
          <div className={cn('mb-3 grid grid-cols-2 gap-2', !compact && 'md:grid-cols-4')}>
            <StatItem icon={Code2} label={t('activityStats.repos')} value={formatNumber(github?.publicRepos)} />
            <StatItem icon={Star} label={t('activityStats.stars')} value={formatNumber(github?.totalStars)} />
            <StatItem icon={Users} label={t('activityStats.followers')} value={formatNumber(github?.followers)} />
            <StatItem icon={GitFork} label={t('activityStats.forks')} value={formatNumber(github?.totalForks)} />
          </div>

          <div className="glass-panel-inner p-3">
            <div className="mb-2 flex items-center justify-between gap-3 text-xs">
              <span className="font-mono text-muted-foreground">{t('activityStats.contributionsPeriod')}</span>
              <span className="shrink-0 font-mono text-foreground">
                {t('activityStats.contributionsCount', {
                  count: formatNumber(github?.recentContributions),
                })}
              </span>
            </div>
            <div className="grid grid-flow-col grid-rows-7 gap-[3px] overflow-hidden">
              {days.map((day, index) => (
                <span
                  key={`${day.date}-${index}`}
                  title={
                    day.date
                      ? t('activityStats.contributionTitle', { count: day.count, date: day.date })
                      : t('activityStats.loading')
                  }
                  className={cn(
                    'aspect-square min-h-2 rounded-[2px] transition-transform hover:scale-125 hover:ring-1 hover:ring-primary/60 dark:hover:ring-foreground/60',
                    HEAT_COLORS[Math.min(Math.max(day.level, 0), HEAT_COLORS.length - 1)],
                  )}
                />
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
              <span>{t('activityStats.activeDays', { count: formatNumber(github?.activeDays) })}</span>
              <span>{t('activityStats.lessMore')}</span>
            </div>
          </div>
        </div>

        <div className="glass-panel-inner p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-sm font-semibold text-foreground">
              <Code2 size={15} className="text-[#ffa116]" aria-hidden="true" />
              {t('activityStats.leetcode')}
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
                {t('activityStats.problemsSolved')}
              </div>
            </div>
            <div className="text-right font-mono text-xs text-muted-foreground">
              {leetcode?.ranking
                ? t('activityStats.rank', { rank: formatNumber(leetcode.ranking) })
                : t('activityStats.leetcodeCn')}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-md bg-emerald-500/10 px-2 py-2 text-center">
              <div className="font-mono text-sm font-semibold text-emerald-500">
                {formatNumber(leetcode?.solved.easy)}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                {t('activityStats.easy')}
              </div>
            </div>
            <div className="rounded-md bg-amber-500/10 px-2 py-2 text-center">
              <div className="font-mono text-sm font-semibold text-amber-500">
                {formatNumber(leetcode?.solved.medium)}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                {t('activityStats.medium')}
              </div>
            </div>
            <div className="rounded-md bg-red-500/10 px-2 py-2 text-center">
              <div className="font-mono text-sm font-semibold text-red-500">
                {formatNumber(leetcode?.solved.hard)}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                {t('activityStats.hard')}
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
                {t('activityStats.latestAccepted', { title: latestSolved.title })}
              </a>
            ) : (
              <span>
                {loading ? t('activityStats.loadingLeetcode') : t('activityStats.solvedFromLeetcode')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
