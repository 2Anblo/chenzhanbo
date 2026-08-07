'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Code2, ExternalLink, Github } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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

const SPOTLIGHT_HEAT_COLORS = [
  'bg-foreground/[0.14] dark:bg-foreground/[0.16]',
  'bg-primary/35 dark:bg-primary/40',
  'bg-primary/55 dark:bg-primary/60',
  'bg-primary/75 dark:bg-primary/80',
  'bg-primary dark:bg-primary',
];

const ACTIVITY_DAYS = 365;
const HEAT_CELL_SIZE = 9;
const HEAT_GAP = 3;
const HEAT_PITCH = HEAT_CELL_SIZE + HEAT_GAP;

type SpotlightStyle = CSSProperties & {
  '--spotlight-x': string;
  '--spotlight-y': string;
};

const CONTRIBUTION_DATE_FORMATTERS = {
  en: new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }),
};

function formatNumber(value: number | null | undefined) {
  if (typeof value !== 'number') return '--';
  return new Intl.NumberFormat('en', { notation: value >= 10000 ? 'compact' : 'standard' }).format(
    value,
  );
}

function formatContributionDate(date: string, locale: string) {
  if (locale === 'zh') {
    const [year, month, day] = date.split('-').map(Number);
    return `${year}年${month}月${day}日`;
  }

  return CONTRIBUTION_DATE_FORMATTERS.en.format(new Date(`${date}T00:00:00Z`));
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
  return Array.from({ length: ACTIVITY_DAYS }, (_, index) => {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - (ACTIVITY_DAYS - 1 - index));

    return {
      date: date.toISOString().slice(0, 10),
      count: 0,
      level: index % 17 === 0 ? 1 : 0,
    };
  });
}

const SKELETON_DAYS = buildSkeletonDays();

function alignDaysToCalendar(days: ActivityDay[]) {
  const firstDate = days[0]?.date;
  if (!firstDate) return days;

  const leadingDays = new Date(`${firstDate}T00:00:00Z`).getUTCDay();
  return [
    ...Array.from({ length: leadingDays }, () => ({ date: '', count: 0, level: 0 })),
    ...days,
  ];
}

function getMonthLabels(days: ActivityDay[], locale: string) {
  const formatter = new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en', {
    month: 'short',
    timeZone: 'UTC',
  });
  const labels: Array<{ column: number; label: string }> = [];
  let previousMonth = '';

  days.forEach((day, index) => {
    if (!day.date) return;
    const month = day.date.slice(0, 7);
    if (previousMonth && month !== previousMonth) {
      labels.push({
        column: Math.floor(index / 7),
        label: formatter.format(new Date(`${day.date}T00:00:00Z`)),
      });
    }
    previousMonth = month;
  });

  return labels;
}

export default function ActivityStatsCard({ className }: ActivityStatsCardProps) {
  const { locale, t } = useTranslation();
  const [stats, setStats] = useState<ActivityStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const heatmapScrollRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

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
  const calendarDays = alignDaysToCalendar(days);
  const heatmapColumns = Math.ceil(calendarDays.length / 7);
  const heatmapWidth = heatmapColumns * HEAT_CELL_SIZE + (heatmapColumns - 1) * HEAT_GAP;
  const monthLabels = getMonthLabels(calendarDays, locale);
  const latestSolved = leetcode?.recent[0];

  useEffect(() => {
    const scroller = heatmapScrollRef.current;
    if (scroller) scroller.scrollLeft = scroller.scrollWidth;
  }, [days.length]);

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

          <div className="overflow-hidden border-y border-border py-3">
            <div
              ref={heatmapScrollRef}
              className="overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              onPointerMove={(event) => {
                if (event.pointerType === 'touch') return;
                const scroller = heatmapScrollRef.current;
                const spotlight = spotlightRef.current;
                if (!scroller || !spotlight) return;

                const bounds = scroller.getBoundingClientRect();
                spotlight.style.setProperty(
                  '--spotlight-x',
                  `${event.clientX - bounds.left + scroller.scrollLeft}px`,
                );
                spotlight.style.setProperty('--spotlight-y', `${event.clientY - bounds.top}px`);
                spotlight.style.opacity = '1';
              }}
              onPointerLeave={() => {
                if (spotlightRef.current) spotlightRef.current.style.opacity = '0';
              }}
            >
              <div className="relative" style={{ width: heatmapWidth }}>
                <div
                  className="grid grid-flow-col grid-rows-[repeat(7,9px)] gap-[3px]"
                  style={{ gridAutoColumns: HEAT_CELL_SIZE }}
                >
                  {calendarDays.map((day, index) => {
                    if (!day.date) {
                      return (
                        <span
                          key={`empty-${index}`}
                          aria-hidden="true"
                          className="size-[9px] rounded-[2px] border border-transparent bg-transparent"
                        />
                      );
                    }

                    const contributionLabel = t(
                      day.count === 1
                        ? 'activityStats.contributionTitleSingle'
                        : 'activityStats.contributionTitle',
                      {
                        count: day.count,
                        date: formatContributionDate(day.date, locale),
                      },
                    );

                    return (
                      <Tooltip key={`${day.date}-${index}`} delayDuration={80}>
                        <TooltipTrigger asChild>
                          <span
                            aria-label={contributionLabel}
                            className={cn(
                              'size-[9px] rounded-[2px] border border-foreground/[0.03] transition-[transform,box-shadow] duration-150 hover:z-10 hover:scale-[1.3] hover:ring-1 hover:ring-primary/70 hover:shadow-[0_0_8px_hsl(var(--primary)/0.4)] motion-reduce:transition-none',
                              HEAT_COLORS[
                                Math.min(Math.max(day.level, 0), HEAT_COLORS.length - 1)
                              ],
                            )}
                          />
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          sideOffset={7}
                          className="rounded-[2px] px-2.5 py-1.5 font-mono text-[11px] shadow-[0_8px_24px_hsl(var(--foreground)/0.16)]"
                        >
                          {contributionLabel}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>

                <div
                  ref={spotlightRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-0 grid grid-flow-col grid-rows-[repeat(7,9px)] gap-[3px] opacity-0 transition-opacity duration-200 motion-reduce:transition-none"
                  style={
                    {
                      '--spotlight-x': '-100px',
                      '--spotlight-y': '-100px',
                      gridAutoColumns: HEAT_CELL_SIZE,
                      WebkitMaskImage:
                        'radial-gradient(circle 64px at var(--spotlight-x) var(--spotlight-y), #000 0%, rgba(0, 0, 0, 0.72) 38%, transparent 78%)',
                      maskImage:
                        'radial-gradient(circle 64px at var(--spotlight-x) var(--spotlight-y), #000 0%, rgba(0, 0, 0, 0.72) 38%, transparent 78%)',
                    } as SpotlightStyle
                  }
                >
                  {calendarDays.map((day, index) => (
                    <span
                      key={`spotlight-${day.date || 'empty'}-${index}`}
                      className={cn(
                        'size-[9px] rounded-[2px]',
                        day.date
                          ? SPOTLIGHT_HEAT_COLORS[
                              Math.min(Math.max(day.level, 0), SPOTLIGHT_HEAT_COLORS.length - 1)
                            ]
                          : 'bg-transparent',
                      )}
                    />
                  ))}
                </div>

                <div className="relative mt-2 h-3 font-mono text-[9px] leading-none text-muted-foreground/75">
                  {monthLabels.map((month) => (
                    <span
                      key={`${month.column}-${month.label}`}
                      className="absolute top-0 whitespace-nowrap"
                      style={{ left: month.column * HEAT_PITCH }}
                    >
                      {month.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
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
