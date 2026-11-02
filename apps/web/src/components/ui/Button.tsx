'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9C] dark:focus-visible:ring-[#60C1E5] disabled:pointer-events-none disabled:opacity-50 cursor-pointer rounded-lg';

    const variants = {
      primary:
        'bg-[#005A9C] text-white hover:bg-[#1B365D] shadow-xs active:scale-[0.99] border border-[#005A9C]/30 dark:bg-[#005A9C] dark:hover:bg-[#1B365D] dark:border-sky-400/20',
      secondary:
        'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-navy-800/80 dark:text-slate-200 dark:hover:bg-navy-700/80 border border-slate-200/60 dark:border-navy-700/60',
      outline:
        'border border-slate-300 dark:border-navy-700 bg-transparent hover:bg-slate-50 dark:hover:bg-navy-800/50 text-slate-700 dark:text-slate-200',
      ghost:
        'bg-transparent hover:bg-slate-100 dark:hover:bg-navy-800/50 text-slate-700 dark:text-slate-200',
      danger:
        'bg-rose-600 text-white hover:bg-rose-700 shadow-xs border border-rose-700/30',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';
