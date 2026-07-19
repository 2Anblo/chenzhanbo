'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { cn } from '@/lib/utils';

export default function Header() {
  const { t } = useTranslation();
  const { scrollY, direction, isAtTop } = useScrollDirection(10);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Hide site header inside admin area so it doesn't overlap with the admin nav
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // Determine header visual state
  let headerState: 'expanded' | 'floating' | 'hidden';
  if (isAtTop) {
    headerState = 'expanded';
  } else if (direction === 'down' && scrollY > 200) {
    headerState = 'hidden';
  } else {
    headerState = 'floating';
  }

  const isExpanded = headerState === 'expanded';
  const isHidden = headerState === 'hidden';

  const navItems = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.projects'), href: '/projects' },
    { label: t('nav.blog'), href: '/blog' },
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          'fixed left-1/2 z-50 flex -translate-x-1/2 items-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          isExpanded
            ? 'top-0 h-16 w-[min(100%,80rem)] rounded-none border border-transparent bg-transparent px-6'
            : 'top-4 h-12 w-[min(calc(100%-2rem),42rem)] rounded-xl px-5',
          !isExpanded && [
            'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80',
            'shadow-lg shadow-foreground/5',
          ],
          isHidden && '-translate-y-[200%]',
        )}
      >
        <div className="flex h-full w-full items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold text-foreground tracking-wider hover:text-primary transition-colors shrink-0"
          >
            <span className="font-display">ZB.CHEN</span>
          </Link>

          {/* Desktop Nav + Locale Switcher */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleNavClick}
                className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group whitespace-nowrap"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-primary transition-[width] duration-150 group-hover:w-full" />
              </Link>
            ))}
            <div className="flex items-center gap-1">
              <ThemeSwitcher />
              <LocaleSwitcher />
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-foreground p-2 shrink-0"
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
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className={cn(
            'fixed z-40 bg-background/95 border border-border backdrop-blur md:hidden',
            isExpanded
              ? 'top-16 left-0 w-full border-b rounded-none'
              : 'top-20 left-4 right-4 rounded-xl shadow-lg',
          )}
        >
          <nav className="flex flex-col p-6 gap-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleNavClick}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border flex items-center gap-2">
              <ThemeSwitcher />
              <LocaleSwitcher />
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
