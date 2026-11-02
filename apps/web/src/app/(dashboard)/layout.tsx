'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  Sparkles,
  LayoutDashboard,
  FileText,
  Globe,
  User,
  Settings,
  ShieldCheck,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-gray-500">Loading your CareerCraft workspace...</p>
        </div>
      </div>
    );
  }

  const userInitials =
    user.profile?.firstName && user.profile?.lastName
      ? `${user.profile.firstName[0]}${user.profile.lastName[0]}`.toUpperCase()
      : user.email.slice(0, 2).toUpperCase();

  const displayName =
    user.profile?.firstName && user.profile?.lastName
      ? `${user.profile.firstName} ${user.profile.lastName}`
      : user.email.split('@')[0];

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My CVs', href: '/dashboard/cvs', icon: FileText },
    { label: 'Portfolios', href: '/dashboard/portfolios', icon: Globe },
    { label: 'Profile', href: '/dashboard/profile', icon: User },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  if (user.role === 'ADMIN') {
    navItems.push({ label: 'Admin Panel', href: '/dashboard/admin', icon: ShieldCheck });
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b1526] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-200">
      {/* Mobile Top Bar */}
      <div className="no-print md:hidden flex items-center justify-between bg-white dark:bg-[#101f38] border-b border-slate-200 dark:border-[#1B365D] px-4 py-3 sticky top-0 z-40 transition-colors">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#1B365D] via-[#005A9C] to-[#60C1E5] flex items-center justify-center text-white shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white">CareerCraft</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle size="sm" />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar Desktop */}
      <aside
        className={cn(
          'no-print fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#101f38] border-r border-slate-200 dark:border-[#1B365D] flex flex-col transition-transform md:translate-x-0 md:static transition-colors duration-200',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Brand */}
        <div className="p-6 border-b border-slate-100 dark:border-[#1B365D]/60 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1B365D] via-[#005A9C] to-[#60C1E5] flex items-center justify-center text-white shadow-sm shadow-[#005A9C]/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white">CareerCraft</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#005A9C]/10 dark:bg-[#005A9C]/25 text-[#005A9C] dark:text-[#60C1E5]'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-navy-800/60 hover:text-slate-900 dark:hover:text-slate-100',
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-[#005A9C] dark:text-[#60C1E5]' : 'text-slate-400 dark:text-slate-500')} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card, Theme Toggle & Logout */}
        <div className="p-4 border-t border-slate-100 dark:border-[#1B365D]/60 bg-slate-50/50 dark:bg-[#0b1526]/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1B365D] to-[#005A9C] text-white font-semibold text-xs flex items-center justify-center shrink-0">
                {userInitials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{displayName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Theme Toggle Pill in Sidebar */}
          <ThemeToggle className="w-full justify-center" showLabel={true} size="sm" />

          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-200"
            onClick={() => logout()}
            leftIcon={<LogOut className="w-3.5 h-3.5" />}
          >
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
