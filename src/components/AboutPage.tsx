'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Github,
  Linkedin,
  Mail,
  FileText,
  GraduationCap,
  Briefcase,
  Wrench,
  Send,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { getResumeData } from '@/lib/i18n/resume-data';

const categoryLabels: Record<string, { labelKey: string }> = {
  ai: { labelKey: 'techStack.categories.ai' },
  backend: { labelKey: 'techStack.categories.backend' },
  tools: { labelKey: 'techStack.categories.tools' },
};

const categoryOrder = ['ai', 'backend', 'tools'];

export default function AboutPage() {
  const { t, locale } = useTranslation();
  const resume = getResumeData(locale);
  const groupedSkills = categoryOrder
    .map((category) => ({
      category,
      skills: resume.skills.filter((skill) => skill.category === category),
    }))
    .filter((group) => group.skills.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-24">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft size={14} />
          {t('common.backToHome')}
        </Link>

        {/* Header */}
        <header className="mt-8 mb-16 flex flex-col md:flex-row gap-8 items-start border-y border-border py-8">
          <div className="w-24 h-24 rounded-full bg-muted border border-border overflow-hidden relative flex-shrink-0">
            <Image
              src="/favicon.png"
              alt={resume.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight font-display">
              {resume.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{resume.title}</p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href={resume.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 border-b border-foreground/20 pb-0.5 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors duration-150"
              >
                <Github size={12} />
                GitHub
              </a>
              {resume.contact.linkedin && (
                <a
                  href={resume.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 border-b border-foreground/20 pb-0.5 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors duration-150"
                >
                  <Linkedin size={12} />
                  LinkedIn
                </a>
              )}
              <a
                href={`mailto:${resume.contact.email}`}
                className="inline-flex items-center gap-1.5 border-b border-foreground/20 pb-0.5 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors duration-150"
              >
                <Mail size={12} />
                {resume.contact.email}
              </a>
            </div>
          </div>
        </header>

        {/* Bio */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-foreground mb-4 font-display">
            {t('aboutPage.fullBioTitle')}
          </h2>
          <div className="grid gap-6 border-y border-border py-6 md:grid-cols-[1fr_220px]">
            <p className="text-muted-foreground text-sm leading-[1.8]">{resume.summary}</p>
            <div className="flex flex-wrap items-start gap-4 md:flex-col md:border-l md:border-border md:pl-5">
              <Link
                href="/resume"
                className="inline-flex items-center gap-2 border-b border-foreground/30 pb-0.5 text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <FileText size={14} />
                {t('aboutPage.viewResume')}
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 border-b border-foreground/30 pb-0.5 text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors duration-150"
              >
                {t('aboutPage.projectsTitle')}
              </Link>
            </div>
          </div>
        </section>

        {/* Education */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <GraduationCap size={18} className="text-primary" />
            {t('aboutPage.educationTitle')}
          </h2>
          <div className="divide-y divide-border border-y border-border">
            {resume.education.map((edu) => (
              <div
                key={edu.school}
                className="py-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <h3 className="text-base font-medium text-foreground">{edu.school}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {edu.major} · {edu.degree}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                {edu.description && (
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        {resume.experience && resume.experience.length > 0 && (
          <section className="mb-16">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Briefcase size={18} className="text-primary" />
              {t('aboutPage.experienceTitle')}
            </h2>
            <div className="divide-y divide-border border-y border-border">
              {resume.experience.map((exp) => (
                <div
                  key={`${exp.company}-${exp.period}`}
                  className="grid gap-3 py-5 md:grid-cols-[190px_1fr]"
                >
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">{exp.period}</p>
                    <p className="mt-2 text-sm font-medium text-foreground">{exp.role}</p>
                  </div>
                  <div className="md:border-l md:border-border md:pl-5">
                    <h3 className="text-base font-medium text-foreground">{exp.company}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tech Stack */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Wrench size={18} className="text-primary" />
            {t('aboutPage.techStackTitle')}
          </h2>
          <div className="divide-y divide-border border-y border-border">
            {groupedSkills.map(({ category, skills }, index) => {
              const cat = categoryLabels[category];
              const label = cat ? t(cat.labelKey) : category;

              return (
                <div
                  key={category}
                  className="grid gap-5 py-6 md:grid-cols-[150px_1fr]"
                >
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {label}
                    </p>
                    <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                  </div>
                  <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                    {skills.map((skill) => (
                      <article key={skill.name} className="border-l border-border pl-4">
                        <h3 className="text-base font-medium text-foreground">{skill.name}</h3>
                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                          {skill.description}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="border-y border-border py-8 text-center md:py-10">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground font-display">
            {t('aboutPage.contactTitle')}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {resume.contact.email}
          </p>
          <a
            href={`mailto:${resume.contact.email}`}
            className="inline-flex items-center gap-2 mt-6 border-b border-foreground/30 pb-0.5 text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
          >
            <Send size={14} />
            {t('aboutPage.contactCta')}
          </a>
        </section>
      </div>
    </div>
  );
}
