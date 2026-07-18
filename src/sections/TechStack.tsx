'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { getResumeData } from '@/lib/i18n/resume-data';

function SkillCard({ skill, index, inView, categoryLabels }: { skill: ReturnType<typeof getResumeData>['skills'][0]; index: number; inView: boolean; categoryLabels: Record<string, { label: string; color: string }> }) {
  const cat = categoryLabels[skill.category];

  return (
    <div
      className={`group relative p-5 rounded-lg border border-border bg-card hover:bg-muted transition-colors duration-150 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <span
            className="mb-2 block text-[11px] font-medium text-muted-foreground"
          >
            {cat.label}
          </span>
          <h3 className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
            {skill.name}
          </h3>
        </div>
        {skill.proficiency && (
          <span className="text-xs text-muted-foreground">{skill.proficiency}%</span>
        )}
      </div>

      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
        {skill.description}
      </p>

      {skill.proficiency && (
        <div className="mt-3 h-[2px] bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-1000 ease-out"
            style={{
              width: inView ? `${skill.proficiency}%` : '0%',
              backgroundColor: cat.color,
              transitionDelay: `${index * 50 + 200}ms`,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function TechStack() {
  const { t, locale } = useTranslation();
  const resumeData = getResumeData(locale);
  const categoryLabels: Record<string, { label: string; color: string }> = {
    backend: { label: t('techStack.categories.backend'), color: '#3B82F6' },
    ai: { label: t('techStack.categories.ai'), color: '#8B5CF6' },
    tools: { label: t('techStack.categories.tools'), color: '#10B981' },
  };

  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const grouped = resumeData.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof resumeData.skills>);

  return (
    <section id="stack" className="w-full py-32 md:py-40 bg-card">
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`mb-16 transition-[opacity,transform] duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight font-display">
            {t('techStack.title')}
          </h2>
          <p className="mt-4 text-sm text-muted-foreground max-w-xl">
            {t('techStack.description')}
          </p>
        </div>

        <div ref={ref} className="space-y-12">
          {Object.entries(grouped).map(([category, skills]) => (
            <div key={category}>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: categoryLabels[category]?.color || '#3B82F6' }}
                />
                <h3 className="text-lg font-medium text-foreground">
                  {categoryLabels[category]?.label || category}
                </h3>
                <div className="flex-1 h-[1px] bg-background/[0.05]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {skills.map((skill, index) => (
                  <SkillCard key={skill.name} skill={skill} index={index} inView={inView} categoryLabels={categoryLabels} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
