'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  ArrowUpRight,
  FileText,
  Github,
  Linkedin,
  Mail,
  NotebookText,
} from 'lucide-react';
import type { BlogPost, Project } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';

interface HeroProps {
  latestProject?: Project;
  latestPost?: BlogPost;
}

const socialLinks = [
  {
    href: 'https://github.com/2Anblo',
    label: 'GitHub',
    icon: Github,
    external: true,
  },
  {
    href: 'https://www.linkedin.com/in/zhanbo-chen-884913296/',
    label: 'LinkedIn',
    icon: Linkedin,
    external: true,
  },
  {
    href: 'mailto:zhanboc2@illinois.edu',
    label: 'Email',
    icon: Mail,
    external: false,
  },
];

function TextLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1 border-b border-foreground/30 pb-0.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
    >
      {children}
      <ArrowUpRight
        size={13}
        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  );
}

export default function Hero({ latestProject, latestPost }: HeroProps) {
  const { t } = useTranslation();

  return (
    <section
      id="hero"
      aria-label="Identity"
      className="w-full bg-background px-5 pt-24 sm:px-6 md:pt-28"
    >
      <div className="mx-auto max-w-7xl border-t-2 border-foreground">
        <div className="grid gap-10 py-14 md:grid-cols-[280px_1fr] md:gap-16 md:py-20 lg:grid-cols-[320px_1fr_320px]">
          <div className="mx-auto w-full max-w-[280px] md:mx-0">
            <div className="relative aspect-square overflow-hidden rounded-[4px] border border-foreground bg-muted">
              <Image
                src="/avatar.png"
                alt="Zhanbo Chen avatar"
                fill
                sizes="(min-width: 1024px) 320px, 280px"
                className="object-cover"
                priority
              />
            </div>
            <div className="mt-4 flex items-center justify-between border-y border-border py-2 font-mono text-xs text-muted-foreground">
              <span>@2Anblo</span>
              <span>Backend / AI</span>
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-center">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
              {t('hero.notebook.tagline')}
            </p>
            <h1 className="mt-5 max-w-4xl text-balance text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-6xl">
              {t('hero.notebook.heading')}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              {t('hero.notebook.description')}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <TextLink href="#blog">{t('hero.notebook.cta.readNotes')}</TextLink>
              <TextLink href="/resume">{t('hero.notebook.cta.viewResume')}</TextLink>
              <TextLink href="#projects">
                {t('hero.notebook.cta.selectedSystems')}
              </TextLink>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {socialLinks.map(({ href, label, icon: Icon, external }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className="inline-flex h-9 items-center gap-2 border border-border px-3 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  aria-label={label}
                >
                  <Icon size={14} aria-hidden="true" />
                  {label}
                </a>
              ))}
            </div>
          </div>

          <aside className="grid content-start gap-4 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                <NotebookText size={14} aria-hidden="true" />
                {t('hero.notebook.sidebar.latestNote')}
              </div>
              {latestPost ? (
                <Link href={`/blog/${latestPost.slug}`} className="group mt-3 block">
                  <h2 className="text-lg font-semibold leading-snug text-foreground group-hover:text-primary">
                    {latestPost.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {latestPost.excerpt}
                  </p>
                  <p className="mt-3 font-mono text-xs text-muted-foreground">
                    {latestPost.readingTime} min read / {latestPost.publishedAt}
                  </p>
                </Link>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  {t('hero.notebook.sidebar.notesComingSoon')}
                </p>
              )}
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                <FileText size={14} aria-hidden="true" />
                {t('hero.notebook.sidebar.currentSystem')}
              </div>
              {latestProject ? (
                <Link href={`/projects/${latestProject.slug}`} className="group mt-3 block">
                  <h2 className="text-base font-semibold text-foreground group-hover:text-primary">
                    {latestProject.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {latestProject.subtitle}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {latestProject.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </Link>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  {t('hero.notebook.sidebar.systemsComingSoon')}
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
