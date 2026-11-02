'use client';

import React from 'react';
import { useTheme } from '@/lib/theme-context';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export function ThemeToggle({ className, showLabel = false, size = 'sm' }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={cn(
        'relative inline-flex items-center gap-2 rounded-xl transition-all duration-200 cursor-pointer',
        'border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs',
        'dark:border-navy-700/60 dark:bg-navy-900/80 dark:hover:bg-navy-800 dark:text-sky-300 dark:shadow-none',
        size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-sm',
        className,
      )}
    >
      <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
        <Sun
          className={cn(
            'w-4 h-4 text-amber-500 transition-all duration-300 transform',
            isDark ? 'scale-0 rotate-90 opacity-0 absolute' : 'scale-100 rotate-0 opacity-100',
          )}
        />
        <Moon
          className={cn(
            'w-4 h-4 text-sky-400 transition-all duration-300 transform',
            isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0 absolute',
          )}
        />
      </div>
      {showLabel && (
        <span className="font-medium select-none">
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
    </button>
  );
}
