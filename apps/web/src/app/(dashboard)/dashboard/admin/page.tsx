'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import {
  ShieldCheck,
  Users,
  FileText,
  Globe,
  Layers,
  Lock,
  ArrowLeft,
  Loader2,
  Check,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface AdminStats {
  users: number;
  cvs: number;
  portfolios: number;
  cvTemplates: number;
  portfolioTemplates: number;
}

interface TemplateItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  layout: string;
  isActive: boolean;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [cvTemplates, setCvTemplates] = useState<TemplateItem[]>([]);
  const [portfolioTemplates, setPortfolioTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, tmplsRes] = await Promise.all([
        api.get<AdminStats>('/admin/stats'),
        api.get<{ cvTemplates: TemplateItem[]; portfolioTemplates: TemplateItem[] }>('/admin/templates'),
      ]);

      setStats(statsRes);
      setCvTemplates(tmplsRes.cvTemplates || []);
      setPortfolioTemplates(tmplsRes.portfolioTemplates || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load administrative dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadAdminData();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Access check
  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white dark:bg-[#101f38] rounded-3xl border border-slate-200 dark:border-[#1B365D] p-8 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Restricted Administration</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            This section requires the <code className="bg-slate-100 dark:bg-navy-900 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200">ADMIN</code> role.
            Your current account role is <span className="font-semibold text-slate-900 dark:text-white">{user?.role}</span>.
          </p>
          <div className="pt-2">
            <Link href="/dashboard">
              <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleToggleCvTemplate = async (tmpl: TemplateItem) => {
    try {
      setTogglingId(tmpl.id);
      const res = await api.patch<{ template: TemplateItem }>(`/admin/cv-templates/${tmpl.id}`, {
        isActive: !tmpl.isActive,
      });

      setCvTemplates((prev) =>
        prev.map((t) => (t.id === tmpl.id ? { ...t, isActive: res.template.isActive } : t)),
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update template status.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleTogglePortfolioTemplate = async (tmpl: TemplateItem) => {
    try {
      setTogglingId(tmpl.id);
      const res = await api.patch<{ template: TemplateItem }>(`/admin/portfolio-templates/${tmpl.id}`, {
        isActive: !tmpl.isActive,
      });

      setPortfolioTemplates((prev) =>
        prev.map((t) => (t.id === tmpl.id ? { ...t, isActive: res.template.isActive } : t)),
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update template status.');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-8 w-full">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#A0E0EF]/25 text-[#005A9C] dark:text-[#60C1E5] text-xs font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">System Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Monitor live platform metrics and configure template availability.</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadAdminData} leftIcon={<Loader2 className="w-3.5 h-3.5" />}>
          Refresh Stats
        </Button>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Platform Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Users</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.users ?? '—'}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#A0E0EF]/20 text-[#005A9C] dark:text-[#60C1E5] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">CV Documents</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.cvs ?? '—'}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Portfolios</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.portfolios ?? '—'}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Templates</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {(stats?.cvTemplates || 0) + (stats?.portfolioTemplates || 0)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CV Templates Management */}
      <Card>
        <CardHeader>
          <CardTitle>CV Templates Availability</CardTitle>
          <CardDescription>
            Deactivating a template hides it from the creation gallery without breaking existing resumes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cvTemplates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-[#1B365D] bg-white dark:bg-[#101f38] space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{tmpl.name}</h4>
                    <Badge variant={tmpl.isActive ? 'success' : 'neutral'}>
                      {tmpl.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">slug: {tmpl.slug}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-2">{tmpl.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-[#1B365D] flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">layout: {tmpl.layout}</span>
                  <Button
                    variant={tmpl.isActive ? 'ghost' : 'outline'}
                    size="sm"
                    className="text-xs"
                    isLoading={togglingId === tmpl.id}
                    onClick={() => handleToggleCvTemplate(tmpl)}
                  >
                    {tmpl.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Templates Management */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Templates Availability</CardTitle>
          <CardDescription>
            Control which personal website themes are available to users during creation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolioTemplates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-[#1B365D] bg-white dark:bg-[#101f38] space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{tmpl.name}</h4>
                    <Badge variant={tmpl.isActive ? 'success' : 'neutral'}>
                      {tmpl.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">slug: {tmpl.slug}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-2">{tmpl.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-[#1B365D] flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">layout: {tmpl.layout}</span>
                  <Button
                    variant={tmpl.isActive ? 'ghost' : 'outline'}
                    size="sm"
                    className="text-xs"
                    isLoading={togglingId === tmpl.id}
                    onClick={() => handleTogglePortfolioTemplate(tmpl)}
                  >
                    {tmpl.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
