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

const categoryLabels: Record<string, { labelKey: string; color: string }> = {
  backend: { labelKey: 'techStack.categories.backend', color: '#3B82F6' },
  ai: { labelKey: 'techStack.categories.ai', color: '#8B5CF6' },
  tools: { labelKey: 'techStack.categories.tools', color: '#10B981' },
};

export default function AboutPage() {
  const { t, locale } = useTranslation();
  const resume = getResumeData(locale);

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
        <header className="mt-8 mb-16 flex flex-col md:flex-row gap-8 items-start">
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground bg-card border border-border rounded-lg hover:border-primary/30 hover:text-primary transition-colors duration-150"
              >
                <Github size={12} />
                GitHub
              </a>
              {resume.contact.linkedin && (
                <a
                  href={resume.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground bg-card border border-border rounded-lg hover:border-primary/30 hover:text-primary transition-colors duration-150"
                >
                  <Linkedin size={12} />
                  LinkedIn
                </a>
              )}
              <a
                href={`mailto:${resume.contact.email}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground bg-card border border-border rounded-lg hover:border-primary/30 hover:text-primary transition-colors duration-150"
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
          <div className="p-6 md:p-8 rounded-xl border border-border bg-card">
            <p className="text-muted-foreground text-sm leading-[1.8]">{resume.summary}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                href="/resume"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                <FileText size={14} />
                {t('aboutPage.viewResume')}
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-foreground text-sm font-medium rounded-lg hover:border-primary/30 hover:text-primary transition-colors duration-150"
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
          <div className="grid gap-4">
            {resume.education.map((edu) => (
              <div
                key={edu.school}
                className="p-6 rounded-lg border border-border bg-card"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <h3 className="text-base font-medium text-foreground">{edu.school}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {edu.major} · {edu.degree}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
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
            <div className="space-y-6">
              {resume.experience.map((exp) => (
                <div
                  key={`${exp.company}-${exp.period}`}
                  className="relative pl-6 border-l-2 border-primary/30"
                >
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-primary" />
                  <h3 className="text-base font-medium text-foreground">{exp.company}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {exp.role} · {exp.period}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {exp.description}
                  </p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resume.skills.map((skill) => {
              const cat = categoryLabels[skill.category];
              const label = cat ? t(cat.labelKey) : skill.category;
              const color = cat?.color || '#3B82F6';

              return (
                <div
                  key={skill.name}
                  className="p-5 rounded-lg border border-border bg-card hover:bg-muted transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <span
                        className="inline-block px-2 py-0.5 text-[9px] font-medium rounded uppercase tracking-wider mb-2"
                        style={{ color, backgroundColor: `${color}15` }}
                      >
                        {label}
                      </span>
                      <h3 className="text-base font-medium text-foreground">{skill.name}</h3>
                    </div>
                    {skill.proficiency && (
                      <span className="text-xs text-muted-foreground">
                        {skill.proficiency}%
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {skill.description}
                  </p>
                  {skill.proficiency && (
                    <div className="mt-3 h-[2px] bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${skill.proficiency}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="p-8 md:p-12 rounded-xl bg-card border border-border text-center">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground font-display">
            {t('aboutPage.contactTitle')}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {resume.contact.email}
          </p>
          <a
            href={`mailto:${resume.contact.email}`}
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Send size={14} />
            {t('aboutPage.contactCta')}
          </a>
        </section>
      </div>
    </div>
  );
}
