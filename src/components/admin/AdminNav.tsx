'use client';

import Link from 'next/link';
import { useAdminTranslation } from '@/components/admin/AdminText';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, FolderGit, LogOut, BookOpen } from 'lucide-react';
import { clearSession } from '@/lib/admin/auth';
import { cn } from '@/lib/utils';
import LocaleSwitcher from '@/components/LocaleSwitcher';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/projects', label: 'Projects', icon: FolderGit },
  { href: '/admin/reading', label: '阅览', icon: BookOpen },
];

export default function AdminNav() {
  const { t } = useAdminTranslation();
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin" className="font-display font-bold text-lg"> {t("Admin")} </Link>
          <nav className="flex flex-wrap items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <Icon size={14} />
                  {t(item.label)}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
        <LocaleSwitcher />
        <form action={clearSession}>
          <button
            type="submit"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut size={14} /> {t("Logout")} </button>
        </form>
        </div>
      </div>
    </header>
  );
}
