'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import LocaleSwitcher from '@/components/LocaleSwitcher';

export default function Header() {
  const { t } = useTranslation();

  const navItems = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.about'), href: '/#about' },
    { label: t('nav.projects'), href: '/#projects' },
    { label: t('nav.blog'), href: '/#blog' },
    { label: t('nav.contact'), href: '/#contact' },
  ];

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith('/#')) {
      const id = href.slice(2);
      if (pathname === '/') {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 h-16 flex items-center transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-black/[0.08]'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-mono font-semibold text-[#1A1A2E] tracking-wider hover:text-[#3B82F6] transition-colors"
        >
          ZB.CHEN
        </Link>

        {/* Desktop Nav + Locale Switcher */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => handleNavClick(item.href)}
              className="relative text-sm font-medium text-[#5F6368] hover:text-[#1A1A2E] transition-colors group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#3B82F6] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          <LocaleSwitcher />
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-[#1A1A2E] p-2"
          aria-label={t('common.toggleMenu')}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {mobileMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-black/[0.08] md:hidden">
          <nav className="flex flex-col p-6 gap-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => handleNavClick(item.href)}
                className="text-base font-medium text-[#5F6368] hover:text-[#1A1A2E] transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-black/[0.08]">
              <LocaleSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
