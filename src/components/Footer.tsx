import { Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full py-8 border-t border-black/[0.08] bg-white">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-[#5F6368] font-mono">
          &copy; {new Date().getFullYear()} Zhanbo Chen. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/czbczb"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5F6368] hover:text-[#3B82F6] transition-colors"
            aria-label="GitHub"
          >
            <Github size={16} />
          </a>
          <a
            href="https://linkedin.com/in/czbczb"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5F6368] hover:text-[#3B82F6] transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={16} />
          </a>
          <a
            href="mailto:czbczb@sina.com"
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
