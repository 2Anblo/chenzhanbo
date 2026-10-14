'use client';

import { usePathname } from 'next/navigation';
import LocaleSwitcher from '@/components/LocaleSwitcher';

export default function AdminLanguageControl() {
  const pathname = usePathname();
  if (pathname !== '/admin/login') return null;
  return <div className="fixed right-4 top-4 z-10"><LocaleSwitcher /></div>;
}
