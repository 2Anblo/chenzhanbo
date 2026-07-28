'use client';

import Link from 'next/link';
import { ArrowUpRight, Github } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import type { Project } from '@/types';

interface ProjectsSectionProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsSectionProps) {
  const { t } = useTranslation();

  const categoryLabel = (category: Project['category']) => {
    const labels: Record<Project['category'], string> = {
      ai: t('projectsSection.categories.ai'),
      microservices: t('projectsSection.categories.microservices'),
      personal: t('projectsSection.categories.personal'),
    };
    return labels[category];
  };

  const visibleProjects = projects.slice(0, 4);

  return (
    <section id="projects" className="w-full bg-background px-5 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-7xl border-t border-foreground">
        <div className="grid gap-6 border-b border-border py-6 md:grid-cols-[260px_1fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
              {t('projectsSection.tagline')}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {t('projectsSection.heading')}
            </h2>
          </div>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
            {t('projectsSection.description')}
          </p>
        </div>

        <div className="divide-y divide-border border-b border-border">
          {visibleProjects.map((project, index) => (
            <article
              key={project.id}
              className="grid gap-6 py-8 md:grid-cols-[88px_1fr_320px] md:gap-8"
            >
              <div className="font-mono text-xs text-muted-foreground">
                {String(index + 1).padStart(2, '0')}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
                  <span>{categoryLabel(project.category)}</span>
                  <span>/</span>
                  <span>{project.techStack.slice(0, 2).join(' + ')}</span>
                </div>
                <Link href={`/projects/${project.slug}`} className="group mt-3 inline-block">
                  <h3 className="text-2xl font-semibold leading-tight text-foreground transition-colors group-hover:text-primary md:text-3xl">
                    {project.title}
                  </h3>
                </Link>
                <p className="mt-3 text-sm font-medium text-foreground/80">{project.subtitle}</p>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
                  {project.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {project.techStack.slice(0, 7).map((tech) => (
                    <span
                      key={tech}
                      className="border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {t('projectsSection.implementationNotes')}
                </p>
                <ul className="mt-4 space-y-3">
                  {project.contributions.slice(0, 3).map((item) => (
                    <li key={item} className="grid grid-cols-[12px_1fr] gap-3 text-sm leading-6 text-muted-foreground">
                      <span className="mt-2 h-px bg-primary" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-4">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group inline-flex items-center gap-1 border-b border-foreground/30 pb-0.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {t('projectsSection.caseStudy')}
                    <ArrowUpRight
                      size={13}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      <Github size={14} aria-hidden="true" />
                      {t('projectsSection.github')}
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="flex justify-end py-6">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-1 border-b border-foreground/30 pb-0.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {t('projectsSection.allSystems')}
            <ArrowUpRight
              size={13}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
