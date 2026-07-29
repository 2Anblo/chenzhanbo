'use client';

import { useEffect, useState } from 'react';
import { Code2, ExternalLink, Github } from 'lucide-react';
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
}

const HEAT_COLORS = [
  'bg-foreground/[0.06] dark:bg-foreground/[0.08]',
  'bg-primary/20 dark:bg-primary/25',
  'bg-primary/35 dark:bg-primary/40',
  'bg-primary/55 dark:bg-primary/60',
  'bg-primary/80 dark:bg-primary/85',
];

function formatNumber(value: number | null | undefined) {
  if (typeof value !== 'number') return '--';
  return new Intl.NumberFormat('en', { notation: value >= 10000 ? 'compact' : 'standard' }).format(
    value,
  );
}

function LedgerMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l border-border pl-3">
      <div className="font-mono text-lg font-semibold leading-none text-foreground">{value}</div>
      <div className="mt-1 text-[11px] uppercase text-muted-foreground">{label}</div>
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
    <section
      className={cn(
        'animate-fade-in border-y border-border py-5',
        className,
      )}
      style={{ animationDelay: '1.55s', opacity: 0 }}
    >
      <div className="mb-5 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
            <Github size={15} className="text-primary dark:text-foreground" aria-hidden="true" />
            {t('activityStats.publicActivity')}
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{t('activityStats.description')}</p>
        </div>
        {github && (
          <a
            href={github.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 border-b border-foreground/20 pb-0.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary dark:hover:text-foreground"
          >
            @{github.username}
            <ExternalLink size={12} aria-hidden="true" />
          </a>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(220px,0.75fr)]">
        <div className="min-w-0">
          <div className="mb-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <LedgerMetric
              label={t('activityStats.contributionsPeriod')}
              value={formatNumber(github?.recentContributions)}
            />
            <LedgerMetric
              label={t('activityStats.activeDaysLabel')}
              value={formatNumber(github?.activeDays)}
            />
            <LedgerMetric label={t('activityStats.repos')} value={formatNumber(github?.publicRepos)} />
          </div>

          <div className="grid grid-flow-col grid-rows-7 gap-[3px] overflow-hidden border-y border-border py-3">
            {days.map((day, index) => (
              <span
                key={`${day.date}-${index}`}
                title={
                  day.date
                    ? t('activityStats.contributionTitle', { count: day.count, date: day.date })
                    : t('activityStats.loading')
                }
                className={cn(
                  'aspect-square min-h-2 border border-foreground/[0.03] transition-shadow hover:ring-1 hover:ring-primary/60 dark:hover:ring-foreground/60',
                  HEAT_COLORS[Math.min(Math.max(day.level, 0), HEAT_COLORS.length - 1)],
                )}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
            <span>{t('activityStats.contributionsCount', { count: formatNumber(github?.recentContributions) })}</span>
            <span>{t('activityStats.lessMore')}</span>
          </div>
        </div>

        <div className="border-l-0 border-border lg:border-l lg:pl-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Code2 size={15} className="text-[#ffa116]" aria-hidden="true" />
              {t('activityStats.leetcode')}
            </div>
            {leetcode && (
              <a
                href={leetcode.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 border-b border-foreground/20 pb-0.5 font-mono text-xs text-muted-foreground transition-colors hover:border-[#ffa116] hover:text-[#ffa116]"
              >
                @{leetcode.username}
                <ExternalLink size={12} aria-hidden="true" />
              </a>
            )}
          </div>

          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <div className="font-mono text-4xl font-semibold leading-none text-foreground">
                {formatNumber(leetcode?.solved.all)}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                {t('activityStats.problemsSolved')}
              </div>
            </div>
            <div className="text-right font-mono text-xs text-muted-foreground">
              {leetcode?.ranking
                ? t('activityStats.rank', { rank: formatNumber(leetcode.ranking) })
                : t('activityStats.leetcodeCn')}
            </div>
          </div>

          <div className="grid grid-cols-3 divide-x divide-border border-y border-border">
            <div className="px-2 py-2 text-center">
              <div className="font-mono text-sm font-semibold text-foreground">
                {formatNumber(leetcode?.solved.easy)}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                {t('activityStats.easy')}
              </div>
            </div>
            <div className="px-2 py-2 text-center">
              <div className="font-mono text-sm font-semibold text-foreground">
                {formatNumber(leetcode?.solved.medium)}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                {t('activityStats.medium')}
              </div>
            </div>
            <div className="px-2 py-2 text-center">
              <div className="font-mono text-sm font-semibold text-foreground">
                {formatNumber(leetcode?.solved.hard)}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
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
    </section>
  );
}
