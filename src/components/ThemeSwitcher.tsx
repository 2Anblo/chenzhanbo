'use client';

import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

const themes = ['system', 'light', 'dark'] as const;

const themeMeta = {
  system: { label: 'System theme', icon: Monitor },
  light: { label: 'Light theme', icon: Sun },
  dark: { label: 'Dark theme', icon: Moon },
};

type ThemeName = (typeof themes)[number];

function normalizeTheme(theme?: string): ThemeName {
  return themes.includes(theme as ThemeName) ? (theme as ThemeName) : 'system';
}

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? normalizeTheme(theme) : 'system';
  const currentIndex = themes.indexOf(currentTheme);
  const nextTheme = themes[(currentIndex + 1) % themes.length];
  const Icon = themeMeta[currentTheme].icon;
  const label = themeMeta[currentTheme].label;
  const nextLabel = themeMeta[nextTheme].label;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={() => setTheme(nextTheme)}
      aria-label={`${label}. Switch to ${nextLabel}.`}
      title={`${label}. Switch to ${nextLabel}.`}
      className="text-muted-foreground hover:text-foreground"
    >
      <Icon size={16} aria-hidden="true" />
    </Button>
  );
}
