'use client';

import { Github, Linkedin, Mail } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full py-8 border-t border-black/[0.08] bg-white">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-[#5F6368] font-mono">
          &copy; {new Date().getFullYear()} Zhanbo Chen. {t('resume.rights')}
        </p>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/2Anblo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5F6368] hover:text-[#3B82F6] transition-colors"
            aria-label="GitHub"
          >
            <Github size={16} />
          </a>
          <a
            href="https://www.linkedin.com/in/zhanbo-chen-884913296/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5F6368] hover:text-[#3B82F6] transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={16} />
          </a>
          <a
            href="mailto:zhanboc2@illinois.edu"
            className="text-[#5F6368] hover:text-[#3B82F6] transition-colors"
            aria-label="Email"
          >
            <Mail size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
