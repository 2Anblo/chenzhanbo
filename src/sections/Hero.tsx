'use client';

import Link from 'next/link';
import { ArrowRight, FileText, Github, Linkedin, Mail } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Hero() {
  const { t } = useTranslation();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-screen bg-white overflow-hidden flex items-center justify-center">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#1A1A2E 1px, transparent 1px), linear-gradient(90deg, #1A1A2E 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Name */}
        <h1 className="text-5xl md:text-7xl font-bold text-[#1A1A2E] tracking-tight leading-[1.1] animate-fade-in">
          {t('hero.title')}
        </h1>

        {/* Title with status dot */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[#5F6368] animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm tracking-wide">
            {t('hero.tagline')}
          </span>
        </div>

        {/* Description */}
        <p className="mt-6 text-base text-[#5F6368] leading-relaxed max-w-lg animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
          {t('hero.description')}
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
          <button
            onClick={() => scrollToSection('projects')}
            className="group flex items-center gap-2 px-6 py-3 bg-[#1A1A2E] text-white text-sm font-medium rounded-lg hover:bg-[#3B82F6] transition-all duration-300"
          >
            {t('hero.viewProjects')}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <Link
            href="/blog"
            className="flex items-center gap-2 px-6 py-3 border border-black/[0.08] text-[#1A1A2E] text-sm font-medium rounded-lg hover:border-[#3B82F6] hover:text-[#3B82F6] transition-all duration-300"
          >
            {t('hero.readBlog')}
          </Link>
          <a
            href="/resume"
            className="flex items-center gap-2 px-6 py-3 border border-black/[0.08] text-[#1A1A2E] text-sm font-medium rounded-lg hover:border-[#3B82F6] hover:text-[#3B82F6] transition-all duration-300"
          >
            <FileText size={14} />
            {t('hero.viewResume')}
          </a>
        </div>

        {/* Social Links */}
        <div className="mt-10 flex items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s', opacity: 0 }}>
          <a
            href="https://github.com/2Anblo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#5F6368] bg-[#F8F9FA] rounded-lg hover:bg-[#1A1A2E] hover:text-white transition-all duration-300"
          >
            <Github size={16} />
            <span className="font-medium">GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/zhanbo-chen-884913296/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#5F6368] bg-[#F8F9FA] rounded-lg hover:bg-[#0A66C2] hover:text-white transition-all duration-300"
          >
            <Linkedin size={16} />
            <span className="font-medium">LinkedIn</span>
          </a>
          <a
            href="mailto:zhanboc2@illinois.edu"
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#5F6368] bg-[#F8F9FA] rounded-lg hover:bg-[#1A1A2E] hover:text-white transition-all duration-300"
          >
            <Mail size={16} />
            <span className="font-medium">Email</span>
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '0.8s', opacity: 0 }}>
        <span className="text-[10px] text-[#5F6368] uppercase tracking-widest">{t('hero.scroll')}</span>
        <div className="w-[1px] h-8 bg-[#3B82F6]" />
      </div>
    </section>
  );
}
