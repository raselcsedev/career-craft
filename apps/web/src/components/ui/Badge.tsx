import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'neutral' | 'outline';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default:
      'bg-[#A0E0EF]/25 text-[#005A9C] border-[#A0E0EF]/60 dark:bg-[#005A9C]/20 dark:text-[#60C1E5] dark:border-[#005A9C]/40',
    success:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40',
    warning:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/40',
    neutral:
      'bg-slate-100 text-slate-700 border-slate-200 dark:bg-navy-800/80 dark:text-slate-300 dark:border-navy-700',
    outline:
      'bg-transparent text-slate-700 dark:text-slate-300 border-slate-300 dark:border-navy-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
