'use client';

import Link from 'next/link';
import type { ComponentType } from 'react';
import {
  ArrowUpRight,
  Bot,
  Code2,
  GraduationCap,
  Network,
  PenLine,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { getResumeData } from '@/lib/i18n/resume-data';
import ActivityStatsCard from '@/components/ActivityStatsCard';

const focusAreas = [
  'Java',
  'Spring Boot',
  'Spring Cloud',
  'MySQL',
  'Redis',
  'Docker',
  'AI Agent',
  'RAG',
  'LLM',
  'Microservices',
];

const iconMap: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  Code2,
  Bot,
  Network,
  PenLine,
};

export default function About() {
  const { locale, dictionary } = useTranslation();
  const resumeData = getResumeData(locale);

  return (
    <section id="about" className="w-full bg-background px-5 py-20 sm:px-6 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 border-t border-foreground pt-8 lg:grid-cols-[340px_1fr] lg:gap-16">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
            Resume / Dossier
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Structured signals, not a pitch deck.
          </h2>
          <p className="mt-5 text-sm leading-7 text-muted-foreground">
            The resume section keeps the factual record close to the writing:
            education, focus areas, experience, and public activity.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {focusAreas.map((item) => (
              <span
                key={item}
                className="border border-border px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>

          <Link
            href="/resume"
            className="group mt-7 inline-flex items-center gap-1 border-b border-foreground/30 pb-0.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Full resume
            <ArrowUpRight
              size={13}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </aside>

        <div className="grid gap-10">
          <div className="grid gap-6 border-b border-border pb-10 md:grid-cols-[1fr_260px]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Profile
              </p>
              <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
                {resumeData.summary}
              </p>
            </div>
            <div className="border-t border-border pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Current
              </p>
              <p className="mt-3 text-lg font-semibold text-foreground">{resumeData.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Backend systems, AI applications, and technical writing.
              </p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                <GraduationCap size={15} className="text-primary" aria-hidden="true" />
                Education
              </div>
              <div className="mt-5 divide-y divide-border border-y border-border">
                {resumeData.education.map((edu) => (
                  <div key={edu.school} className="py-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <h3 className="text-base font-semibold text-foreground">{edu.school}</h3>
                      <p className="font-mono text-xs text-muted-foreground">
                        {edu.startDate} / {edu.endDate}
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {edu.degree}, {edu.major}
                    </p>
                    {edu.description && (
                      <p className="mt-2 font-mono text-xs text-muted-foreground">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Focus
              </p>
              <div className="mt-5 divide-y divide-border border-y border-border">
                {dictionary.about.workItems.map((item) => {
                  const Icon = iconMap[item.icon];
                  return (
                    <div key={item.title} className="grid gap-3 py-5 sm:grid-cols-[28px_1fr]">
                      <div className="pt-0.5">
                        {Icon && <Icon size={18} className="text-primary" aria-hidden="true" />}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <ActivityStatsCard compact className="max-w-xl" />
        </div>
      </div>
    </section>
  );
}
