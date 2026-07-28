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
    { label: t('nav.blog'), href: '/blog' },
    { label: t('nav.projects'), href: '/projects' },
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          'fixed left-1/2 z-50 flex -translate-x-1/2 items-center font-mono transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          isExpanded
            ? 'top-0 h-16 w-[min(100%,80rem)] rounded-none border-x-0 border-b border-t-0 border-border bg-background/95 px-5 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6 md:h-20'
            : 'top-4 h-12 w-[min(calc(100%-2rem),54rem)] rounded-none border border-border bg-background/95 px-4 shadow-lg shadow-foreground/5 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-5',
          isHidden && '-translate-y-[200%]',
        )}
      >
        <div className="hidden h-full w-full items-center md:flex">
          {isExpanded ? (
            <div className="grid h-full w-full grid-cols-[1fr_auto_1fr] items-center gap-4">
              <p className="min-w-0 truncate text-xs text-muted-foreground">
                Currently: UIUC MCS
              </p>

              <Link
                href="/"
                className="shrink-0 text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
              >
                Zhanbo Chen
              </Link>

              <nav className="flex h-full items-center justify-end gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={handleNavClick}
                    className="group relative inline-flex h-full items-center whitespace-nowrap text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                    <span className="absolute bottom-5 left-0 h-[1px] w-0 bg-primary transition-[width] duration-150 group-hover:w-full" />
                  </Link>
                ))}
                <div className="flex h-full items-center gap-1">
                  <ThemeSwitcher />
                  <LocaleSwitcher />
                </div>
              </nav>
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-between gap-5">
              <Link
                href="/"
                className="shrink-0 text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
              >
                Zhanbo&apos;s Blog
              </Link>

              <nav className="flex h-full min-w-0 items-center justify-end gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={handleNavClick}
                    className="group relative inline-flex h-full items-center whitespace-nowrap text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                    <span className="absolute bottom-3 left-0 h-[1px] w-0 bg-primary transition-[width] duration-150 group-hover:w-full" />
                  </Link>
                ))}
                <div className="flex h-full items-center gap-1">
                  <ThemeSwitcher />
                  <LocaleSwitcher />
                </div>
              </nav>
            </div>
          )}
        </div>

        <div className="flex h-full w-full items-center justify-between md:hidden">
          <Link
            href="/"
            className="shrink-0 text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
          >
            Zhanbo&apos;s Blog
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-foreground"
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
              : 'top-20 left-4 right-4 shadow-lg',
          )}
        >
          <nav className="flex flex-col gap-4 p-6 font-mono">
            <p className="border-b border-border pb-4 text-xs text-muted-foreground">
              Currently: UIUC MCS
            </p>
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleNavClick}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
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
