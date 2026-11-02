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
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-gray-900">CareerCraft</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-gray-600 rounded-lg hover:bg-gray-100"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Desktop */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform md:translate-x-0 md:static',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Brand */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-xs shadow-indigo-100">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-gray-900">CareerCraft</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
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
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900',
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-indigo-600' : 'text-gray-400')} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-semibold text-xs flex items-center justify-center shrink-0">
              {userInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
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
