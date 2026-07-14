'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Github, ExternalLink, ArrowUpRight, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { assetUrl } from '@/lib/assets';
import type { Project } from '@/types';

interface ProjectsSectionProps {
  projects: Project[];
}

function ProjectCard({ project, index, t }: { project: Project; index: number; t: (key: string) => string }) {
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
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group relative rounded-lg border border-border bg-card overflow-hidden transition-colors duration-150 hover:border-primary/30 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Card Header */}
      <div className="relative h-48 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] flex items-center justify-center overflow-hidden">
        {project.image ? (
          <Image
            src={assetUrl(project.image)}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="relative z-10 text-center">
            <span className="text-5xl font-bold text-[#1A1A1A] group-hover:text-primary/10 transition-colors duration-150">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-background/80 text-muted-foreground hover:text-primary transition-colors"
            aria-label={t('projects.viewOnGithub')}
          >
            <Github size={14} />
          </a>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">{project.subtitle}</p>
          </div>
          <ArrowUpRight
            size={16}
            className="text-muted-foreground group-hover:text-primary transition-colors"
          />
        </div>

        <p className="mt-4 text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-[10px] text-muted-foreground bg-muted rounded border border-border"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 5 && (
            <span className="px-2 py-0.5 text-[10px] text-muted-foreground">
              +{project.techStack.length - 5}
            </span>
          )}
        </div>

        {/* Highlights */}
        <div className="mt-4 pt-4 border-t border-border">
          <ul className="space-y-1.5">
            {project.highlights.map((hl) => (
              <li key={hl} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                {hl}
              </li>
            ))}
          </ul>
        </div>

        {/* Contributions */}
        <div className="mt-4">
          <p className="text-[10px] font-medium text-muted-foreground mb-2">{t('projects.contributions')}</p>
          <ul className="space-y-1">
            {project.contributions.slice(0, 3).map((c) => (
              <li key={c} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                <span className="text-primary mt-0.5">-</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Projects({ projects }: ProjectsSectionProps) {
  const { t } = useTranslation();
  const titleRef = useRef<HTMLDivElement>(null);
  const [titleInView, setTitleInView] = useState(false);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTitleInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" className="w-full py-32 md:py-40 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={titleRef}
          className={`mb-16 transition-[opacity,transform] duration-700 ${
            titleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight font-display">
            {t('projects.title')}
          </h2>
          <p className="mt-4 text-sm text-muted-foreground max-w-xl">
            {t('projects.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} t={t} />
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors duration-150"
          >
            {t('common.viewMore')}
            <ArrowRight size={14} />
          </Link>
          <a
            href="https://github.com/2Anblo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-border text-sm text-muted-foreground rounded-lg hover:border-primary/30 hover:text-primary transition-colors duration-150"
          >
            <Github size={14} />
            {t('projects.moreOnGitHub')}
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </section>
  );
}
