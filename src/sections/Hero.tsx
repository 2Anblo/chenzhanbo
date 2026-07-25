'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  FileText,
  Github,
  Linkedin,
  Mail,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';
import type { BlogPost, Project } from '@/types';

interface HeroProps {
  latestProject?: Project;
  latestPost?: BlogPost;
}

function Tile({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={cn(
        'glass-panel glass-panel-hover flex flex-col overflow-hidden animate-fade-in-up motion-reduce:animate-none motion-reduce:opacity-100',
        className
      )}
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      {children}
    </div>
  );
}

function IdentityTile({ delay }: { delay: number }) {
  const { dictionary } = useTranslation();
  const b = dictionary.hero.bento;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const socialLinks = [
    {
      href: 'https://github.com/2Anblo',
      icon: Github,
      label: 'GitHub',
      external: true,
    },
    {
      href: 'https://www.linkedin.com/in/zhanbo-chen-884913296/',
      icon: Linkedin,
      label: 'LinkedIn',
      external: true,
    },
    {
      href: 'mailto:zhanboc2@illinois.edu',
      icon: Mail,
      label: 'Email',
      external: false,
    },
  ];

  return (
    <Tile
      className="md:col-span-1 lg:col-span-2 lg:row-span-2 p-6 md:p-8 justify-between"
      delay={delay}
    >
      <div className="flex items-start gap-5">
        <div className="relative shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border border-border bg-muted">
          <Image
            src="/avatar.png"
            alt={b.name}
            fill
            sizes="(max-width: 768px) 80px, 96px"
            className="object-cover"
            priority
          />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{b.greeting}</p>
          <h1 className="mt-1 text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground font-display">
            {b.name}
          </h1>
          <p className="mt-2 text-sm md:text-base text-primary font-medium">
            {b.role}
          </p>
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground leading-relaxed max-w-lg">
        {b.bio}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => scrollToSection('projects')}
          className={cn(
            'group inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg',
            'hover:bg-primary/90 transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          )}
        >
          {b.cta.projects}
          <ArrowRight size={14} />
        </button>
        <Link
          href="/blog"
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 border border-border text-foreground text-sm font-medium rounded-lg',
            'hover:border-primary hover:text-primary transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          )}
        >
          {b.cta.blog}
        </Link>
        <a
          href="/resume"
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 border border-border text-foreground text-sm font-medium rounded-lg',
            'hover:border-primary hover:text-primary transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          )}
        >
          <FileText size={14} />
          {b.cta.resume}
        </a>
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center gap-3">
          {socialLinks.map(({ href, icon: Icon, label, external }) => (
            <a
              key={label}
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className={cn(
                'inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background',
                'text-xs text-foreground hover:border-primary hover:text-primary',
                'transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              )}
              aria-label={label}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </Tile>
  );
}

function LatestProjectTile({
  project,
  delay,
}: {
  project?: Project;
  delay: number;
}) {
  const { dictionary } = useTranslation();
  const b = dictionary.hero.bento;

  if (!project) {
    return (
      <Tile className="p-5 justify-center" delay={delay}>
        <p className="text-sm text-muted-foreground">{b.latestProject.label}</p>
        <p className="mt-1 text-sm text-foreground/60">Coming soon</p>
      </Tile>
    );
  }

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group focus-visible:outline-none"
    >
      <Tile className="h-full p-5 justify-between" delay={delay}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {b.latestProject.label}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {project.title}
            </h3>
            <p className="text-xs text-muted-foreground truncate">{project.subtitle}</p>
          </div>
          <ArrowUpRight
            size={16}
            className="text-muted-foreground group-hover:text-primary transition-colors shrink-0"
          />
        </div>
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {project.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded border border-border bg-background px-2 py-0.5 text-[10px] text-muted-foreground"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="px-2 py-0.5 text-[10px] text-muted-foreground">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>
        <span className="mt-4 inline-flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          {b.latestProject.view}
          <ArrowRight size={12} />
        </span>
      </Tile>
    </Link>
  );
}

function LatestPostTile({
  post,
  delay,
}: {
  post?: BlogPost;
  delay: number;
}) {
  const { t, dictionary } = useTranslation();
  const b = dictionary.hero.bento;

  if (!post) {
    return (
      <Tile className="p-5 justify-center" delay={delay}>
        <p className="text-sm text-muted-foreground">{b.latestPost.label}</p>
        <p className="mt-1 text-sm text-foreground/60">Coming soon</p>
      </Tile>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group focus-visible:outline-none"
    >
      <Tile className="h-full p-5 justify-between" delay={delay}>
        <div>
          <div className="flex items-center gap-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {b.latestPost.label}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock size={10} />
              {t('common.readingTime', { n: post.readingTime })}
            </div>
          </div>
          <h3 className="mt-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>
        <span className="mt-4 inline-flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          {b.latestPost.read}
          <ArrowRight size={12} />
        </span>
      </Tile>
    </Link>
  );
}

export default function Hero({ latestProject, latestPost }: HeroProps) {
  const { dictionary } = useTranslation();
  const b = dictionary.hero.bento;

  return (
    <section
      id="hero"
      aria-label={b.sectionLabel}
      className="relative w-full min-h-screen overflow-hidden flex items-center bg-background"
    >
      <div
        className="absolute top-0 right-0 w-[60vw] h-[60vh] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at top right, hsl(var(--primary) / 0.07), transparent 50%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 auto-rows-[minmax(180px,auto)]">
          <IdentityTile delay={100} />
          <LatestProjectTile project={latestProject} delay={200} />
          <LatestPostTile post={latestPost} delay={300} />
        </div>

        <div
          className={cn(
            'mt-12 md:mt-16 flex flex-col items-center gap-2',
            'animate-fade-in motion-reduce:animate-none motion-reduce:opacity-100'
          )}
          style={{ animationDelay: '500ms', opacity: 0 }}
        >
          <span className="text-xs text-muted-foreground uppercase tracking-widest">
            {b.scroll}
          </span>
          <div className="w-[1px] h-8 bg-primary" />
        </div>
      </div>
    </section>
  );
}
