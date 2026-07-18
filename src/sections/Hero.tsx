'use client';

import Link from 'next/link';
import { ArrowRight, FileText, Github, Linkedin, Mail } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import AsciiLiquidMetal from '@/components/AsciiLiquidMetal';
import TypewriterText from '@/components/TypewriterText';

interface HeroProps {
  asIntro?: boolean;
  onComplete?: () => void;
}

export default function Hero({ asIntro = false, onComplete }: HeroProps) {
  const { t } = useTranslation();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const terminalLines = [
    { prefix: '> whoami: ', text: t('hero.terminal.whoami') },
    { prefix: t('hero.terminal.rolePrefix'), text: t('hero.tagline') },
    { prefix: t('hero.terminal.aboutPrefix'), text: t('hero.description') },
  ];

  return (
    <section className="relative w-full min-h-screen bg-background overflow-hidden flex items-center justify-center">
      {/* ASCII animated background */}
      <AsciiLiquidMetal
        text="Zhanbo Chen"
        className="absolute inset-0 z-0 opacity-40 dark:opacity-25"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 py-24">
        <div className="glass-panel overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-muted/60 border-b border-border/40">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-auto text-xs text-muted-foreground font-mono">
              zhanbo@portfolio:~
            </span>
          </div>

          {/* Terminal body */}
          <div className="p-6 md:p-8">
            <TypewriterText
              lines={terminalLines}
              className="text-sm md:text-base leading-relaxed"
              typingSpeed={35}
              lineDelay={500}
              onComplete={asIntro ? onComplete : undefined}
            />

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3 animate-fade-in" style={{ animationDelay: '1.2s', opacity: 0 }}>
              <button
                onClick={() => scrollToSection('projects')}
                className="group flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors duration-150"
              >
                {t('hero.viewProjects')}
                <ArrowRight size={14} />
              </button>
              <Link
                href="/blog"
                className="flex items-center gap-2 px-5 py-2.5 border border-border text-foreground text-sm font-medium rounded-lg hover:border-primary hover:text-primary transition-colors duration-150"
              >
                {t('hero.readBlog')}
              </Link>
              <a
                href="/resume"
                className="flex items-center gap-2 px-5 py-2.5 border border-border text-foreground text-sm font-medium rounded-lg hover:border-primary hover:text-primary transition-colors duration-150"
              >
                <FileText size={14} />
                {t('hero.viewResume')}
              </a>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3 animate-fade-in" style={{ animationDelay: '1.4s', opacity: 0 }}>
              <a
                href="https://github.com/2Anblo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors duration-150"
              >
                <Github size={14} />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/zhanbo-chen-884913296/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors duration-150"
              >
                <Linkedin size={14} />
                <span>LinkedIn</span>
              </a>
              <a
                href="mailto:zhanboc2@illinois.edu"
                className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors duration-150"
              >
                <Mail size={14} />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Scroll Indicator */}
      {!asIntro && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '1.8s', opacity: 0 }}>
          <span className="text-xs text-muted-foreground">{t('hero.scroll')}</span>
          <div className="w-[1px] h-8 bg-primary" />
        </div>
      )}
    </section>
  );
}
