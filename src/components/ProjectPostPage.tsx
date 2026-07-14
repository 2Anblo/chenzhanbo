'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { assetUrl } from '@/lib/assets';
import type { Project } from '@/types';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface ProjectPostPageProps {
  project: Project;
}

export default function ProjectPostPage({ project }: ProjectPostPageProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-[#5F6368] hover:text-[#3B82F6] transition-colors"
        >
          <ArrowLeft size={14} />
          {t('projectPost.backToProjects')}
        </Link>

        {/* Hero Image */}
        {project.image && (
          <div className="relative w-full h-64 md:h-80 mt-8 rounded-xl overflow-hidden border border-black/[0.08] bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]">
            <Image
              src={assetUrl(project.image)}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Header */}
        <header className="mt-8 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] tracking-tight font-display">
            {project.title}
          </h1>
          <p className="mt-2 text-sm text-[#5F6368]">{project.subtitle}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A1A2E] text-white text-sm font-medium rounded-lg hover:bg-[#3B82F6] transition-colors"
            >
              <Github size={14} />
              {t('projectPost.githubLink')}
            </a>
            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-black/[0.08] text-[#1A1A2E] text-sm font-medium rounded-lg hover:border-[#3B82F6]/30 hover:text-[#3B82F6] transition-colors duration-150"
              >
                <ExternalLink size={14} />
                {t('projectPost.demoLink')}
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 px-5 py-2.5 border border-black/[0.08] text-[#5F6368]/50 text-sm font-medium rounded-lg cursor-not-allowed">
                <ExternalLink size={14} />
                {t('projectPost.noDemo')}
              </span>
            )}
          </div>
        </header>

        {/* Tech Stack */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-4 font-display">
            {t('projectPost.techStackTitle')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs text-[#5F6368] bg-[#F8F9FA] border border-black/[0.08] rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Background */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-4 font-display">
            {t('projectPost.backgroundTitle')}
          </h2>
          <p className="text-sm text-[#5F6368] leading-[1.8]">{project.background}</p>
        </section>

        {/* Highlights */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-4 font-display">
            {t('projectPost.highlightsTitle')}
          </h2>
          <ul className="space-y-3">
            {project.highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-3 text-sm text-[#5F6368] leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] mt-2 flex-shrink-0" />
                {highlight}
              </li>
            ))}
          </ul>
        </section>

        {/* Contributions */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-4 font-display">
            {t('projectPost.contributionsTitle')}
          </h2>
          <ul className="space-y-3">
            {project.contributions.map((contribution) => (
              <li
                key={contribution}
                className="flex items-start gap-3 text-sm text-[#5F6368] leading-relaxed"
              >
                <span className="text-[#3B82F6] mt-0.5 flex-shrink-0">-</span>
                {contribution}
              </li>
            ))}
          </ul>
        </section>

        {/* Markdown Content */}
        {project.content.trim() && (
          <section className="mb-10">
            <MarkdownRenderer content={project.content} />
          </section>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-black/[0.08] flex items-center justify-between">
          <Link
            href="/projects"
            className="text-sm text-[#5F6368] hover:text-[#3B82F6] transition-colors"
          >
            {t('projectPost.backToProjects')}
          </Link>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#5F6368] hover:text-[#3B82F6] transition-colors"
          >
            <Github size={14} />
            {t('projectPost.githubLink')}
          </a>
        </footer>
      </div>
    </div>
  );
}
