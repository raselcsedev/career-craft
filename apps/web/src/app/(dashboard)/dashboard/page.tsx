'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  FileText,
  Globe,
  User,
  Plus,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Layers,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const { user } = useAuth();

  const firstName = user?.profile?.firstName || user?.email?.split('@')[0] || 'Professional';

  // Calculate profile completeness percentage
  const profileFields = [
    user?.profile?.firstName,
    user?.profile?.lastName,
    user?.profile?.headline,
    user?.profile?.bio,
    user?.profile?.phone,
    user?.profile?.city,
    user?.profile?.website || user?.profile?.github || user?.profile?.linkedin,
  ];
  const completedFields = profileFields.filter(Boolean).length;
  const completenessPercent = Math.round((completedFields / profileFields.length) * 100);

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1B365D] via-[#005A9C] to-[#1B365D] p-6 sm:p-8 text-white shadow-md relative overflow-hidden border border-[#005A9C]/30">
        <div className="relative z-10 max-w-2xl space-y-3">
          <Badge variant="default" className="bg-white/10 text-[#A0E0EF] border-white/20">
            Welcome to CareerCraft
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Hello, {firstName}! 👋
          </h1>
          <p className="text-sm text-[#A0E0EF] leading-relaxed">
            Your single profile fuels all your CV documents and live portfolio websites. Manage everything right here
            with real-time previews.
          </p>
          <div className="pt-3 flex flex-wrap gap-3">
            <Link href="/dashboard/cvs">
              <Button size="sm" className="bg-white text-[#1B365D] hover:bg-[#A0E0EF] hover:text-[#1B365D] font-bold border-none" leftIcon={<Plus className="w-4 h-4" />}>
                Create New CV
              </Button>
            </Link>
            <Link href="/dashboard/portfolios">
              <Button size="sm" variant="outline" className="border-white/40 text-white hover:bg-white/10" leftIcon={<Globe className="w-4 h-4" />}>
                Manage Portfolios
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CV Card */}
        <Card className="hover:border-[#005A9C] dark:hover:border-[#60C1E5] hover:shadow-sm transition-all flex flex-col justify-between">
          <CardHeader>
            <div className="w-10 h-10 rounded-xl bg-[#A0E0EF]/25 dark:bg-[#005A9C]/25 text-[#005A9C] dark:text-[#60C1E5] flex items-center justify-center mb-2">
              <FileText className="w-5 h-5" />
            </div>
            <CardTitle>CV Builder</CardTitle>
            <CardDescription>
              Build customized resumes with 6 professional ATS-conscious templates and download crisp PDFs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/cvs">
              <Button variant="outline" size="sm" className="w-full justify-between" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Go to CVs
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Portfolio Card */}
        <Card className="hover:border-[#005A9C] dark:hover:border-[#60C1E5] hover:shadow-sm transition-all flex flex-col justify-between">
          <CardHeader>
            <div className="w-10 h-10 rounded-xl bg-[#A0E0EF]/25 dark:bg-[#005A9C]/25 text-[#005A9C] dark:text-[#60C1E5] flex items-center justify-center mb-2">
              <Globe className="w-5 h-5" />
            </div>
            <CardTitle>Portfolio Sites</CardTitle>
            <CardDescription>
              Claim a unique public slug and host your responsive personal developer or designer portfolio website.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/portfolios">
              <Button variant="outline" size="sm" className="w-full justify-between" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Go to Portfolios
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Profile Card */}
        <Card className="hover:border-[#005A9C] dark:hover:border-[#60C1E5] hover:shadow-sm transition-all flex flex-col justify-between">
          <CardHeader>
            <div className="w-10 h-10 rounded-xl bg-[#A0E0EF]/25 dark:bg-[#005A9C]/25 text-[#005A9C] dark:text-[#60C1E5] flex items-center justify-center mb-2">
              <User className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <CardTitle>Profile Strength</CardTitle>
              <Badge variant={completenessPercent > 70 ? 'success' : 'warning'}>
                {completenessPercent}% Complete
              </Badge>
            </div>
            <CardDescription>
              Keep your contact details, bio, and social links up to date to reuse across all documents.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Progress bar */}
            <div className="w-full bg-slate-100 dark:bg-navy-900 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#005A9C] dark:bg-[#60C1E5] h-2 rounded-full transition-all duration-500"
                style={{ width: `${completenessPercent}%` }}
              />
            </div>
            <Link href="/dashboard/profile">
              <Button variant="outline" size="sm" className="w-full justify-between" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Edit Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Profile Details Quick Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Reusable Profile Information</CardTitle>
          <CardDescription>
            These details automatically populate new CVs and your public portfolio site.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0b1526]/60 border border-slate-100 dark:border-navy-700/60 space-y-1">
              <p className="text-xs text-slate-400 font-medium">Full Name</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {user?.profile?.firstName || user?.profile?.lastName
                  ? `${user.profile.firstName || ''} ${user.profile.lastName || ''}`.trim()
                  : 'Not provided yet'}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0b1526]/60 border border-slate-100 dark:border-navy-700/60 space-y-1">
              <p className="text-xs text-slate-400 font-medium">Headline</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                {user?.profile?.headline || 'No headline set'}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0b1526]/60 border border-slate-100 dark:border-navy-700/60 space-y-1">
              <p className="text-xs text-slate-400 font-medium">Location</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {user?.profile?.city || user?.profile?.country
                  ? `${user.profile.city || ''}, ${user.profile.country || ''}`.replace(/^,\s*|,\s*$/g, '')
                  : 'Not provided'}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0b1526]/60 border border-slate-100 dark:border-navy-700/60 space-y-1">
              <p className="text-xs text-slate-400 font-medium">Social Links</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {[user?.profile?.github && 'GitHub', user?.profile?.linkedin && 'LinkedIn', user?.profile?.website && 'Web']
                  .filter(Boolean)
                  .join(' • ') || 'None linked'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
