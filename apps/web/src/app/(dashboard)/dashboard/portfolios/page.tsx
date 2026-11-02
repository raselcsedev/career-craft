'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { PortfolioDocument, PortfolioTemplate } from '@/types/portfolio';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import {
  Globe,
  Plus,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Trash2,
  Edit3,
  Loader2,
  Lock,
  Layers,
  X,
  Radio,
} from 'lucide-react';

export default function PortfoliosDashboardPage() {
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<PortfolioDocument[]>([]);
  const [templates, setTemplates] = useState<PortfolioTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('My Developer Portfolio');
  const [newSlug, setNewSlug] = useState('my-portfolio');
  const [selectedTemplateId, setSelectedTemplateId] = useState('minimal-developer');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Action feedback
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Delete State
  const [portfolioToDelete, setPortfolioToDelete] = useState<PortfolioDocument | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [portsRes, tmplsRes] = await Promise.all([
        api.get<{ portfolios: PortfolioDocument[] }>('/portfolios'),
        api.get<{ templates: PortfolioTemplate[] }>('/portfolio-templates'),
      ]);
      setPortfolios(portsRes.portfolios || []);
      setTemplates(tmplsRes.templates || []);
      if (tmplsRes.templates && tmplsRes.templates.length > 0) {
        setSelectedTemplateId(tmplsRes.templates[0].slug);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load portfolio websites.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      setCreateError(null);

      const res = await api.post<{ portfolio: PortfolioDocument }>('/portfolios', {
        title: newTitle,
        slug: newSlug.toLowerCase().trim(),
        templateId: selectedTemplateId,
      });

      setIsCreateModalOpen(false);
      router.push(`/dashboard/portfolios/${res.portfolio.id}`);
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create portfolio.');
    } finally {
      setCreating(false);
    }
  };

  const handleTogglePublish = async (portfolio: PortfolioDocument) => {
    try {
      setTogglingId(portfolio.id);
      const endpoint = portfolio.isPublished
        ? `/portfolios/${portfolio.id}/unpublish`
        : `/portfolios/${portfolio.id}/publish`;
      const res = await api.post<{ portfolio: PortfolioDocument }>(endpoint);

      setPortfolios((prev) =>
        prev.map((p) => (p.id === portfolio.id ? { ...p, isPublished: res.portfolio.isPublished } : p)),
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update publishing status.');
    } finally {
      setTogglingId(null);
    }
  };

  const copyUrl = (slug: string) => {
    const url = `${window.location.origin}/p/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 3000);
  };

  const handleDelete = async () => {
    if (!portfolioToDelete) return;
    try {
      setDeleting(true);
      await api.delete(`/portfolios/${portfolioToDelete.id}`);
      setPortfolios((prev) => prev.filter((p) => p.id !== portfolioToDelete.id));
      setPortfolioToDelete(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete portfolio.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Personal Portfolios</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Build and publish personal developer or design portfolio websites with unique URLs.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="shadow-sm"
        >
          Create Portfolio
        </Button>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-20 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#005A9C] dark:text-[#60C1E5] mx-auto" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading your portfolios...</p>
        </div>
      ) : portfolios.length === 0 ? (
        /* Empty State */
        <div className="bg-white dark:bg-[#101f38] rounded-2xl border-2 border-dashed border-slate-200 dark:border-[#1B365D] p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#A0E0EF]/20 text-[#005A9C] dark:text-[#60C1E5] flex items-center justify-center mx-auto">
            <Globe className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Portfolios Published Yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Select one of the 6 portfolio designs, showcase your projects, and share your unique public link with
              recruiters.
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            size="md"
          >
            Create Your First Portfolio
          </Button>
        </div>
      ) : (
        /* Portfolio List Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((port) => (
            <Card key={port.id} className="hover:border-[#005A9C] dark:hover:border-[#60C1E5] hover:shadow-md transition-all flex flex-col justify-between">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg line-clamp-1">{port.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span>/p/{port.slug}</span>
                    </p>
                  </div>
                  <Badge variant={port.isPublished ? 'success' : 'neutral'}>
                    {port.isPublished ? 'Live' : 'Private'}
                  </Badge>
                </div>

                <div className="pt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-900/60 dark:text-slate-300 font-medium">
                    {port.template?.name || 'Standard Theme'}
                  </span>
                  <span>•</span>
                  <span>{(port as any)._count?.projects ?? (port.projects?.length || 0)} projects</span>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 dark:border-[#1B365D] space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Link href={`/dashboard/portfolios/${port.id}`}>
                      <Button variant="outline" size="sm" className="w-full" leftIcon={<Edit3 className="w-3.5 h-3.5" />}>
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant={port.isPublished ? 'ghost' : 'primary'}
                      size="sm"
                      className="w-full"
                      isLoading={togglingId === port.id}
                      onClick={() => handleTogglePublish(port)}
                    >
                      {port.isPublished ? 'Unpublish' : 'Publish Live'}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      onClick={() => copyUrl(port.slug)}
                      leftIcon={copiedSlug === port.slug ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    >
                      {copiedSlug === port.slug ? 'Copied Link!' : 'Copy Link'}
                    </Button>

                    {port.isPublished && (
                      <a
                        href={`/p/${port.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-slate-400 hover:text-[#005A9C] dark:hover:text-[#60C1E5] rounded-lg hover:bg-slate-50 dark:hover:bg-navy-900/40 transition-colors"
                        title="View Public Website"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    <button
                      onClick={() => setPortfolioToDelete(port)}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                      title="Delete Portfolio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#101f38] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 dark:border-[#1B365D] space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#1B365D]">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create New Portfolio</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-900/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && <Alert variant="error">{createError}</Alert>}

            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                label="Portfolio Title"
                placeholder="e.g. Alex Morgan — Senior Software Engineer"
                value={newTitle}
                onChange={(e) => {
                  setNewTitle(e.target.value);
                  if (!newSlug || newSlug === 'my-portfolio') {
                    setNewSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-|-$/g, '') || 'my-portfolio',
                    );
                  }
                }}
                required
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Public Slug URL</label>
                <div className="flex items-center rounded-lg border border-slate-300 dark:border-[#1B365D] bg-slate-50 dark:bg-[#0b1526] px-3 py-2 text-sm text-slate-500 dark:text-slate-400 focus-within:border-[#005A9C] dark:focus-within:border-[#60C1E5] focus-within:bg-white dark:focus-within:bg-[#0b1526] focus-within:ring-1 focus-within:ring-[#005A9C]">
                  <span className="text-slate-400 select-none">careercraft.com/p/</span>
                  <input
                    type="text"
                    value={newSlug}
                    onChange={(e) =>
                      setNewSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, '')
                          .replace(/--+/g, '-'),
                      )
                    }
                    placeholder="my-portfolio"
                    className="w-full bg-transparent text-slate-900 dark:text-slate-100 font-mono font-medium focus:outline-none pl-0.5"
                    required
                  />
                </div>
                <p className="text-xs text-slate-400">Lowercase letters, numbers, and hyphens only.</p>
              </div>

              {/* Template Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Choose Initial Design</label>
                <div className="grid grid-cols-2 gap-2.5 max-h-48 overflow-y-auto p-1">
                  {templates.map((tmpl) => (
                    <div
                      key={tmpl.id}
                      onClick={() => setSelectedTemplateId(tmpl.slug)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        selectedTemplateId === tmpl.slug
                          ? 'border-[#005A9C] dark:border-[#60C1E5] bg-[#A0E0EF]/20 dark:bg-[#005A9C]/25 ring-2 ring-[#005A9C]/30'
                          : 'border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900/30 hover:border-slate-300 dark:hover:border-navy-600'
                      }`}
                    >
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{tmpl.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{tmpl.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-[#1B365D]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={creating}>
                  Create Portfolio
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {portfolioToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#101f38] rounded-2xl max-w-sm w-full p-6 space-y-4 border border-slate-100 dark:border-[#1B365D] shadow-xl">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Delete Portfolio?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-white">{portfolioToDelete.title}</span>?
              Its public URL will stop resolving immediately.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setPortfolioToDelete(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" isLoading={deleting} onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
