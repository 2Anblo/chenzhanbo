'use client';

import Link from 'next/link';
import { ArrowRight, FileText, Github, Linkedin, Mail } from 'lucide-react';

export default function Hero() {
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

      {/* Decorative gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3B82F6]/[0.03] rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#3B82F6]/[0.05] rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Name */}
        <h1 className="text-5xl md:text-7xl font-bold text-[#1A1A2E] tracking-tight leading-[1.1] animate-fade-in">
          陈展博
        </h1>

        {/* Title with status dot */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[#5F6368] animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm font-mono tracking-wide">
            计算机专业学生 | Java 后端 & AI Agent 开发
          </span>
        </div>

        {/* Description */}
        <p className="mt-6 text-base text-[#5F6368] leading-relaxed max-w-lg animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
          专注于 Java 后端开发与 AI 应用开发，熟悉 Spring 生态、微服务架构和大语言模型应用开发。
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
          <button
            onClick={() => scrollToSection('projects')}
            className="group flex items-center gap-2 px-6 py-3 bg-[#1A1A2E] text-white text-sm font-medium rounded-lg hover:bg-[#3B82F6] transition-all duration-300"
          >
            查看项目
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <Link
            href="/blog"
            className="flex items-center gap-2 px-6 py-3 border border-black/[0.08] text-[#1A1A2E] text-sm font-medium rounded-lg hover:border-[#3B82F6] hover:text-[#3B82F6] transition-all duration-300"
          >
            阅读博客
          </Link>
          <a
            href="/resume"
            className="flex items-center gap-2 px-6 py-3 border border-black/[0.08] text-[#1A1A2E] text-sm font-medium rounded-lg hover:border-[#3B82F6] hover:text-[#3B82F6] transition-all duration-300"
          >
            <FileText size={14} />
            查看简历
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
            <span className="font-mono">GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/zhanbo-chen-884913296/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#5F6368] bg-[#F8F9FA] rounded-lg hover:bg-[#0A66C2] hover:text-white transition-all duration-300"
          >
            <Linkedin size={16} />
            <span className="font-mono">LinkedIn</span>
          </a>
          <a
            href="mailto:zhanboc2@illinois.edu"
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#5F6368] bg-[#F8F9FA] rounded-lg hover:bg-[#1A1A2E] hover:text-white transition-all duration-300"
          >
            <Mail size={16} />
            <span className="font-mono">Email</span>
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '0.8s', opacity: 0 }}>
        <span className="text-[10px] text-[#5F6368] font-mono uppercase tracking-widest">滚动</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-[#3B82F6] to-transparent" />
      </div>
    </section>
  );
}
