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
  ChevronLeft,
  ChevronRight,
  PanelTop,
  PanelLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

type NavMode = 'sidebar' | 'topbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Layout preferences (persisted in localStorage)
  const [navMode, setNavMode] = useState<NavMode>('sidebar');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedNavMode = localStorage.getItem('careercraft_nav_mode') as NavMode;
    if (savedNavMode === 'sidebar' || savedNavMode === 'topbar') {
      setNavMode(savedNavMode);
    }
    const savedCollapsed = localStorage.getItem('careercraft_sidebar_collapsed');
    if (savedCollapsed !== null) {
      setSidebarCollapsed(savedCollapsed === 'true');
    }
  }, []);

  const toggleNavMode = (mode: NavMode) => {
    setNavMode(mode);
    localStorage.setItem('careercraft_nav_mode', mode);
  };

  const toggleSidebarCollapse = () => {
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    localStorage.setItem('careercraft_sidebar_collapsed', String(next));
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0b1526]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#005A9C] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading your CareerCraft workspace...</p>
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
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b1526] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* ── Mobile Top Bar (Always sticky on mobile) ── */}
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

      {/* ── TOP NAVBAR MODE (Full-width horizontal navigation) ── */}
      {navMode === 'topbar' && (
        <header className="no-print hidden md:flex sticky top-0 z-40 bg-white/95 dark:bg-[#101f38]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#1B365D] px-6 py-3 items-center justify-between transition-colors shadow-2xs">
          {/* Brand Logo & Layout Switcher */}
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1B365D] via-[#005A9C] to-[#60C1E5] flex items-center justify-center text-white shadow-sm shadow-[#005A9C]/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight">
                CareerCraft
              </span>
            </Link>

            {/* Nav Links */}
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                      isActive
                        ? 'bg-[#005A9C] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800 hover:text-slate-900 dark:hover:text-white',
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Controls: Switch to Sidebar, Theme, User Avatar & Logout */}
          <div className="flex items-center gap-3">
            {/* Layout Switcher: Switch to Sidebar */}
            <button
              type="button"
              onClick={() => toggleNavMode('sidebar')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 border border-slate-200 dark:border-[#1B365D] transition-colors"
              title="Switch to Sidebar Navigation"
            >
              <PanelLeft className="w-3.5 h-3.5 text-[#005A9C] dark:text-[#60C1E5]" />
              <span className="hidden xl:inline">Sidebar Mode</span>
            </button>

            <ThemeToggle size="sm" />

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-[#1B365D]">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#1B365D] to-[#005A9C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                {userInitials}
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[120px] truncate hidden lg:inline">
                {displayName}
              </span>
              <button
                type="button"
                onClick={() => logout()}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* ── Main Layout Body ── */}
      <div className="flex-1 flex flex-col md:flex-row w-full min-h-0">
        {/* ── SIDEBAR MODE (Desktop Collapsible/Expandable Sidebar) ── */}
        {navMode === 'sidebar' && (
          <aside
            className={cn(
              'no-print fixed inset-y-0 left-0 z-50 bg-white dark:bg-[#101f38] border-r border-slate-200 dark:border-[#1B365D] flex flex-col transition-all duration-300 md:static',
              mobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0',
              sidebarCollapsed ? 'md:w-20' : 'md:w-64',
            )}
          >
            {/* Sidebar Brand & Collapse Button */}
            <div
              className={cn(
                'p-4 border-b border-slate-100 dark:border-[#1B365D]/60 flex items-center transition-all',
                sidebarCollapsed ? 'justify-center' : 'justify-between',
              )}
            >
              {!sidebarCollapsed ? (
                <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1B365D] via-[#005A9C] to-[#60C1E5] flex items-center justify-center text-white shadow-sm shadow-[#005A9C]/20 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-base text-slate-900 dark:text-white truncate">
                    CareerCraft
                  </span>
                </Link>
              ) : (
                <Link href="/dashboard" title="CareerCraft Dashboard">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1B365D] via-[#005A9C] to-[#60C1E5] flex items-center justify-center text-white shadow-sm shadow-[#005A9C]/20">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </Link>
              )}

              {/* Collapse/Expand Toggle Button (Desktop only) */}
              <button
                type="button"
                onClick={toggleSidebarCollapse}
                className="hidden md:flex p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-lg transition-colors"
                title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </button>

              {/* Close Button on Mobile */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                      sidebarCollapsed ? 'justify-center px-2' : '',
                      isActive
                        ? 'bg-[#005A9C] text-white shadow-xs font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/90 dark:hover:bg-navy-800/80 hover:text-slate-900 dark:hover:text-slate-100',
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-4 h-4 shrink-0 transition-transform group-hover:scale-110',
                        isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400',
                      )}
                    />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </nav>

            {/* Sidebar Bottom Controls: Switch to Topbar, Theme, User Card */}
            <div className="p-3 border-t border-slate-100 dark:border-[#1B365D]/60 bg-slate-50/50 dark:bg-[#0b1526]/50 space-y-2.5">
              {/* Option to Switch to Top Navbar */}
              <button
                type="button"
                onClick={() => toggleNavMode('topbar')}
                className={cn(
                  'w-full flex items-center gap-2 p-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-navy-800 border border-slate-200/80 dark:border-[#1B365D] shadow-2xs transition-all',
                  sidebarCollapsed ? 'justify-center' : 'justify-between',
                )}
                title="Switch to Top Navbar Layout"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <PanelTop className="w-3.5 h-3.5 text-[#005A9C] dark:text-[#60C1E5] shrink-0" />
                  {!sidebarCollapsed && <span className="truncate">Navbar Layout</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="text-[10px] uppercase font-bold text-slate-400">Switch</span>
                )}
              </button>

              {/* Theme Toggle */}
              {!sidebarCollapsed ? (
                <ThemeToggle className="w-full justify-center" showLabel={true} size="sm" />
              ) : (
                <div className="flex justify-center">
                  <ThemeToggle size="sm" />
                </div>
              )}

              {/* User Profile & Logout */}
              {!sidebarCollapsed ? (
                <div className="pt-2 border-t border-slate-200/60 dark:border-[#1B365D]/60 space-y-2">
                  <div className="flex items-center justify-between min-w-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1B365D] to-[#005A9C] text-white font-semibold text-xs flex items-center justify-center shrink-0">
                        {userInitials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          {displayName}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

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
              ) : (
                <div className="flex flex-col items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-[#1B365D]/60">
                  <div
                    className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1B365D] to-[#005A9C] text-white font-bold text-xs flex items-center justify-center shrink-0"
                    title={`${displayName} (${user.email})`}
                  >
                    {userInitials}
                  </div>
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* ── Main Content Workspace (Full Width, Auto Expanding) ── */}
        <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8 xl:p-10 w-full transition-all duration-300">
          <div className="w-full transition-all duration-300">{children}</div>
        </main>
      </div>
    </div>
  );
}
