'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Github, Linkedin, Mail, MapPin, Calendar, GraduationCap, ArrowRight, Code2, Bot, Network, PenLine } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';
import { getResumeData } from '@/lib/i18n/resume-data';

const keywords = [
  'Java', 'Spring Boot', 'Spring Cloud', 'MySQL', 'Redis',
  'Docker', 'Linux', 'Git', 'AI Agent', 'RAG', 'LLM', 'Microservices'
];

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Code2,
  Bot,
  Network,
  PenLine,
};

function useInView(threshold = 0.2) {
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
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export default function About() {
  const { t, locale, dictionary } = useTranslation();
  const resumeData = getResumeData(locale);

  const section1 = useInView();
  const section2 = useInView();
  const section3 = useInView();

  const educationCards = resumeData.education.map((edu) => (
    <div
      key={edu.school}
      className={`p-6 rounded-lg border border-border bg-card transition-[opacity,transform] duration-700 ${
        section2.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium text-foreground">{edu.school}</h3>
          <p className="text-sm text-muted-foreground mt-1">{edu.major} · {edu.degree}</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar size={12} />
          {edu.startDate} - {edu.endDate}
        </div>
      </div>
      {edu.description && (
        <p className="mt-4 text-xs text-muted-foreground leading-relaxed">{edu.description}</p>
      )}
    </div>
  ));

  const workItems = dictionary.about.workItems;

  const workCards = workItems.map((item, i) => {
    const IconComponent = iconMap[item.icon];
    return (
      <div
        key={item.title}
        className={`p-6 rounded-lg border border-border bg-card hover:bg-muted transition-colors duration-150 ${
          section3.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
        style={{ transitionDelay: `${i * 100}ms` }}
      >
        {IconComponent && <IconComponent size={24} className="text-primary" />}
        <h3 className="mt-3 text-base font-medium text-foreground">{item.title}</h3>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
      </div>
    );
  });

  return (
    <section id="about" className="w-full py-32 md:py-40 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
          {/* Left: Profile Card */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-32">
              <div
                className={`p-6 rounded-lg border border-border bg-card transition-[opacity,transform] duration-700 ${
                  section1.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-muted border border-border overflow-hidden mb-4 relative">
                  <Image
                    src="/favicon.png"
                    alt={resumeData.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{resumeData.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{resumeData.title}</p>

                <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                  <MapPin size={12} />
                  <span>{t('common.location')}</span>
                </div>

                <div className="flex items-center gap-4 mt-6">
                  <a
                    href="https://github.com/2Anblo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded bg-muted text-muted-foreground hover:text-primary hover:bg-muted/80 transition-colors duration-150"
                    aria-label="GitHub"
                  >
                    <Github size={16} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/zhanbo-chen-884913296/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded bg-muted text-muted-foreground hover:text-primary hover:bg-muted/80 transition-colors duration-150"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={16} />
                  </a>
                  <a
                    href="mailto:zhanboc2@illinois.edu"
                    className="p-2 rounded bg-muted text-muted-foreground hover:text-primary hover:bg-muted/80 transition-colors duration-150"
                    aria-label="Email"
                  >
                    <Mail size={16} />
                  </a>
                </div>
              </div>

              {/* Keywords */}
              <div className="mt-6 flex flex-wrap gap-2">
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-3 py-1 text-[10px] font-medium text-muted-foreground bg-card border border-border rounded-full uppercase tracking-wider hover:border-primary/30 hover:text-primary transition-colors duration-150 cursor-default"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="lg:col-span-2 space-y-16">
            {/* 关于我 */}
            <div ref={section1.ref}>
              <h2 className="text-3xl font-semibold text-foreground tracking-tight font-display">
                {t('about.title')}
              </h2>
              <div className="mt-6 space-y-4">
                <p className="text-muted-foreground text-sm leading-[1.8]">
                  {resumeData.summary}
                </p>
              </div>
            </div>

            {/* 教育经历 */}
            <div ref={section2.ref}>
              <h2 className="text-3xl font-semibold text-foreground tracking-tight flex items-center gap-3">
                <GraduationCap size={24} className="text-primary" />
                {t('about.educationTitle')}
              </h2>
              <div className="mt-6 space-y-6">
                {educationCards}
              </div>
            </div>

            {/* 我的工作 */}
            <div ref={section3.ref}>
              <h2 className="text-3xl font-semibold text-foreground tracking-tight font-display">
                {t('about.workTitle')}
              </h2>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {workCards}
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 text-sm text-primary hover:text-primary transition-colors"
              >
                {t('common.viewMore')}
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
