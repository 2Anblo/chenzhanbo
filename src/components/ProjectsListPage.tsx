'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { assetUrl } from '@/lib/assets';
import type { Project } from '@/types';

interface ProjectsListPageProps {
  projects: Project[];
}

export default function ProjectsListPage({ projects }: ProjectsListPageProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#5F6368] hover:text-[#3B82F6] transition-colors"
        >
          <ArrowLeft size={14} />
          {t('common.backToHome')}
        </Link>

        <header className="mt-8 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] tracking-tight">
            {t('projectsList.title')}
          </h1>
          <p className="mt-4 text-sm text-[#5F6368] max-w-xl">
            {t('projectsList.description')}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group flex flex-col rounded-xl border border-black/[0.08] bg-[#F8F9FA] overflow-hidden hover:border-[#3B82F6]/30 transition-all duration-300"
            >
              {/* Cover / Placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] overflow-hidden">
                {project.image ? (
                  <Image
                    src={assetUrl(project.image)}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-5xl font-bold text-[#3B82F6]/10 group-hover:text-[#3B82F6]/20 transition-colors">
                      {project.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#1A1A2E] group-hover:text-[#3B82F6] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-[#5F6368] mt-1">{project.subtitle}</p>
                  <p className="mt-4 text-sm text-[#5F6368] leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-[10px] text-[#5F6368] bg-[#F1F3F4] rounded border border-black/[0.05]"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 5 && (
                      <span className="px-2 py-0.5 text-[10px] text-[#5F6368]">
                        +{project.techStack.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-black/[0.05] flex items-center gap-4">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-xs text-[#5F6368] hover:text-[#3B82F6] transition-colors"
                  >
                    <Github size={12} />
                    {t('projectPost.githubLink')}
                  </a>
                  {project.demoUrl ? (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-xs text-[#5F6368] hover:text-[#3B82F6] transition-colors"
                    >
                      <ExternalLink size={12} />
                      {t('projectPost.demoLink')}
                    </a>
                  ) : (
                    <span className="text-xs text-[#5F6368]/50">
                      {t('projectPost.noDemo')}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
