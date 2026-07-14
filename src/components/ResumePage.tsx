'use client';

import Link from 'next/link';
import { ArrowLeft, Github, Linkedin, Mail, Download, ExternalLink } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { getResumeData } from '@/lib/i18n/resume-data';
import type { Project } from '@/types';

const categoryLabels: Record<string, { label: string; color: string }> = {
  backend: { label: '#3B82F6', color: '#3B82F6' },
  ai: { label: '#8B5CF6', color: '#8B5CF6' },
  tools: { label: '#10B981', color: '#10B981' },
};

interface ResumePageProps {
  projects: Project[];
}

export default function ResumePage({ projects }: ResumePageProps) {
  const { t, locale } = useTranslation();
  const resumeData = getResumeData(locale);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-24">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          {t('common.backToHome')}
        </Link>

        {/* Resume Header */}
        <header className="mb-12">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight font-display">
                {resumeData.name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">{resumeData.title}</p>
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.print();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded hover:bg-primary/90 transition-colors duration-150"
            >
              <Download size={12} />
              {t('common.printPdf')}
            </a>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <a href="mailto:zhanboc2@illinois.edu" className="flex items-center gap-1 hover:text-primary transition-colors">
              <Mail size={12} />
              zhanboc2@illinois.edu
            </a>
            <a href="https://github.com/2Anblo" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
              <Github size={12} />
              github.com/2Anblo
            </a>
            <a href="https://www.linkedin.com/in/zhanbo-chen-884913296/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
              <Linkedin size={12} />
              linkedin.com/in/zhanbo-chen-884913296
            </a>
          </div>
        </header>

        {/* 个人简介 */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-3 font-display">
            {t('resume.summaryTitle')}
          </h2>
          <p className="text-sm text-muted-foreground leading-[1.8]">{resumeData.summary}</p>
        </section>

        {/* 教育经历 */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4 font-display">
            {t('resume.educationTitle')}
          </h2>
          {resumeData.education.map((edu) => (
            <div key={edu.school} className="mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-medium text-foreground">{edu.school}</h3>
                  <p className="text-sm text-muted-foreground">{edu.major} · {edu.degree}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
              {edu.description && (
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{edu.description}</p>
              )}
            </div>
          ))}
        </section>

        {/* 技能 */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4 font-display">
            {t('resume.skillsTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {resumeData.skills.map((skill) => (
              <div
                key={skill.name}
                className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: categoryLabels[skill.category]?.color || '#3B82F6' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{skill.name}</span>
                    {skill.proficiency && (
                      <span className="text-xs text-muted-foreground">{skill.proficiency}%</span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{skill.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 项目经历 */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4 font-display">
            {t('resume.projectsTitle')}
          </h2>
          <div className="space-y-6">
            {projects.map((project) => (
              <div key={project.id} className="p-5 rounded-lg bg-card border border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-medium text-foreground">{project.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{project.subtitle}</p>
                  </div>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github size={12} />
                    <ExternalLink size={10} />
                  </a>
                </div>

                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{project.description}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-[10px] text-muted-foreground bg-muted rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <ul className="mt-3 space-y-1">
                  {project.contributions.slice(0, 3).map((c) => (
                    <li key={c} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 联系方式 */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4 font-display">
            {t('resume.contactTitle')}
          </h2>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <a href="mailto:zhanboc2@illinois.edu" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Mail size={14} />
              zhanboc2@illinois.edu
            </a>
            <a href="https://github.com/2Anblo" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Github size={14} />
              github.com/2Anblo
            </a>
            <a href="https://www.linkedin.com/in/zhanbo-chen-884913296/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Linkedin size={14} />
              linkedin.com/in/zhanbo-chen-884913296
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} {resumeData.name}. {t('resume.rights')}
          </p>
        </footer>
      </div>
    </div>
  );
}
