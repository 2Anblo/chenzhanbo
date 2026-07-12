'use client';

import Link from 'next/link';
import { ArrowLeft, Github, Linkedin, Mail, Download, ExternalLink } from 'lucide-react';
import { resumeData } from '@/data/resume';
import { projects } from '@/data/projects';

const categoryLabels: Record<string, { label: string; color: string }> = {
  backend: { label: '后端', color: '#3B82F6' },
  ai: { label: 'AI', color: '#8B5CF6' },
  tools: { label: '工具', color: '#10B981' },
};

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-24">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#5F6368] hover:text-[#3B82F6] transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          返回首页
        </Link>

        {/* Resume Header */}
        <header className="mb-12">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#1A1A2E] tracking-tight">
                {resumeData.name}
              </h1>
              <p className="mt-1 text-sm text-[#5F6368] font-mono">{resumeData.title}</p>
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.print();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] text-white text-xs font-medium rounded hover:bg-[#2563EB] transition-all"
            >
              <Download size={12} />
              打印 / PDF
            </a>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#5F6368] font-mono">
            <a href="mailto:zhanboc2@illinois.edu" className="flex items-center gap-1 hover:text-[#3B82F6] transition-colors">
              <Mail size={12} />
              zhanboc2@illinois.edu
            </a>
            <a href="https://github.com/2Anblo" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#3B82F6] transition-colors">
              <Github size={12} />
              github.com/2Anblo
            </a>
            <a href="https://www.linkedin.com/in/zhanbo-chen-884913296/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#3B82F6] transition-colors">
              <Linkedin size={12} />
              linkedin.com/in/zhanbo-chen-884913296
            </a>
          </div>
        </header>

        {/* 个人简介 */}
        <section className="mb-10">
          <h2 className="text-sm font-mono font-semibold text-[#1A1A2E] uppercase tracking-wider mb-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
            个人简介
          </h2>
          <p className="text-sm text-[#5F6368] leading-[1.8]">{resumeData.summary}</p>
        </section>

        {/* 教育经历 */}
        <section className="mb-10">
          <h2 className="text-sm font-mono font-semibold text-[#1A1A2E] uppercase tracking-wider mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
            教育经历
          </h2>
          {resumeData.education.map((edu) => (
            <div key={edu.school} className="mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-medium text-[#1A1A2E]">{edu.school}</h3>
                  <p className="text-sm text-[#5F6368]">{edu.major} · {edu.degree}</p>
                </div>
                <span className="text-xs font-mono text-[#5F6368]">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
              {edu.description && (
                <p className="mt-2 text-xs text-[#5F6368] leading-relaxed">{edu.description}</p>
              )}
            </div>
          ))}
        </section>

        {/* 技能 */}
        <section className="mb-10">
          <h2 className="text-sm font-mono font-semibold text-[#1A1A2E] uppercase tracking-wider mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
            技能
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {resumeData.skills.map((skill) => (
              <div
                key={skill.name}
                className="flex items-center gap-3 p-3 rounded-lg bg-[#F8F9FA] border border-black/[0.05]"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: categoryLabels[skill.category]?.color || '#3B82F6' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#1A1A2E]">{skill.name}</span>
                    {skill.proficiency && (
                      <span className="text-xs font-mono text-[#5F6368]">{skill.proficiency}%</span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#5F6368] mt-0.5 truncate">{skill.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 项目经历 */}
        <section className="mb-10">
          <h2 className="text-sm font-mono font-semibold text-[#1A1A2E] uppercase tracking-wider mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
            项目经历
          </h2>
          <div className="space-y-6">
            {projects.map((project) => (
              <div key={project.id} className="p-5 rounded-xl bg-[#F8F9FA] border border-black/[0.05]">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-medium text-[#1A1A2E]">{project.title}</h3>
                    <p className="text-xs text-[#5F6368] mt-0.5">{project.subtitle}</p>
                  </div>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-[#5F6368] hover:text-[#3B82F6] transition-colors"
                  >
                    <Github size={12} />
                    <ExternalLink size={10} />
                  </a>
                </div>

                <p className="mt-3 text-sm text-[#5F6368] leading-relaxed">{project.description}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-[10px] font-mono text-[#5F6368] bg-[#F1F3F4] rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <ul className="mt-3 space-y-1">
                  {project.contributions.slice(0, 3).map((c) => (
                    <li key={c} className="flex items-start gap-2 text-xs text-[#5F6368]">
                      <span className="w-1 h-1 rounded-full bg-[#3B82F6] mt-1.5 flex-shrink-0" />
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
          <h2 className="text-sm font-mono font-semibold text-[#1A1A2E] uppercase tracking-wider mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
            联系方式
          </h2>
          <div className="flex flex-wrap gap-4 text-sm text-[#5F6368]">
            <a href="mailto:zhanboc2@illinois.edu" className="flex items-center gap-2 hover:text-[#3B82F6] transition-colors">
              <Mail size={14} />
              zhanboc2@illinois.edu
            </a>
            <a href="https://github.com/2Anblo" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#3B82F6] transition-colors">
              <Github size={14} />
              github.com/2Anblo
            </a>
            <a href="https://www.linkedin.com/in/zhanbo-chen-884913296/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#3B82F6] transition-colors">
              <Linkedin size={14} />
              linkedin.com/in/zhanbo-chen-884913296
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-black/[0.08]">
          <p className="text-xs text-[#5F6368] font-mono text-center">
            &copy; {new Date().getFullYear()} Zhanbo Chen. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
