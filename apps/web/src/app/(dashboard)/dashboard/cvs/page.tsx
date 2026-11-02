'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { CvDocument, CvTemplate } from '@/types/cv';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import {
  FileText,
  Plus,
  Sparkles,
  Layers,
  Copy,
  Trash2,
  ExternalLink,
  Loader2,
  Edit3,
  Calendar,
  X,
  Check,
} from 'lucide-react';

export default function CvsDashboardPage() {
  const router = useRouter();
  const [cvs, setCvs] = useState<CvDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State for creating a new CV
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('My Resume');
  const [selectedTemplateId, setSelectedTemplateId] = useState('classic-professional');
  const [templates, setTemplates] = useState<CvTemplate[]>([]);
  const [creating, setCreating] = useState(false);

  // Delete confirmation modal state
  const [cvToDelete, setCvToDelete] = useState<CvDocument | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Duplicating state
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  // Load CVs and templates
  const loadCvs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<{ cvs: CvDocument[] }>('/cvs');
      setCvs(res.cvs || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load CV documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCvs();

    // Fetch active templates
    api
      .get<{ templates: CvTemplate[] }>('/cv-templates')
      .then((res) => {
        if (res?.templates) {
          setTemplates(res.templates);
          if (res.templates.length > 0) {
            setSelectedTemplateId(res.templates[0].slug || res.templates[0].id);
          }
        }
      })
      .catch((err) => console.warn('Could not fetch templates list:', err));
  }, []);

  // Create CV
  const handleCreateCv = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      setCreating(true);
      const res = await api.post<{ cv: CvDocument }>('/cvs', {
        title: newTitle.trim(),
        templateId: selectedTemplateId,
      });

      if (res?.cv?.id) {
        setIsCreateModalOpen(false);
        router.push(`/dashboard/cvs/${res.cv.id}`);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create CV document');
    } finally {
      setCreating(false);
    }
  };

  // Duplicate CV
  const handleDuplicate = async (cv: CvDocument) => {
    try {
      setDuplicatingId(cv.id);
      await api.post(`/cvs/${cv.id}/duplicate`);
      await loadCvs();
    } catch (err: any) {
      alert(err.message || 'Failed to duplicate CV document');
    } finally {
      setDuplicatingId(null);
    }
  };

  // Delete CV
  const handleDelete = async () => {
    if (!cvToDelete) return;
    try {
      setDeleting(true);
      await api.delete(`/cvs/${cvToDelete.id}`);
      setCvToDelete(null);
      await loadCvs();
    } catch (err: any) {
      alert(err.message || 'Failed to delete CV document');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">My CV Documents</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create, customize, and export ATS-friendly resumes for every application.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create New CV
        </Button>
      </div>

      {error && (
        <Alert variant="error" title="Error">
          {error}
        </Alert>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-64 rounded-xl border border-gray-200 bg-gray-50 animate-pulse p-5 space-y-4"
            >
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-32 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : cvs.length === 0 ? (
        /* Empty State */
        <Card className="border-dashed border-2 bg-gray-50/50 text-center py-16">
          <CardContent className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">No resumes created yet</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto mt-1">
                Start by creating your first CV document. We will automatically pre-populate it
                with information from your profile so you can get going in seconds.
              </p>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create Your First CV
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Grid of CV Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvs.map((doc) => (
            <div
              key={doc.id}
              className="group relative bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header of card */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1">
                    <span className="text-[11px] font-semibold tracking-wider text-indigo-600 uppercase">
                      {doc.template?.name || 'Classic'}
                    </span>
                    <h2 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {doc.title || 'Untitled CV'}
                    </h2>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {doc.template?.layout || 'single-column'}
                  </Badge>
                </div>

                {/* Visual Document Mockup Preview Box */}
                <Link href={`/dashboard/cvs/${doc.id}`}>
                  <div className="w-full aspect-[16/10] bg-gray-50 border border-gray-100 rounded-xl p-3.5 flex flex-col justify-between group-hover:bg-indigo-50/30 transition-colors cursor-pointer mb-4 overflow-hidden relative">
                    <div className="space-y-2">
                      <div className="w-2/5 h-2 bg-gray-300 rounded-xs" />
                      <div className="w-1/3 h-1.5 bg-gray-200 rounded-xs" />
                      <div className="pt-2 space-y-1">
                        <div className="w-full h-1 bg-gray-200 rounded-xs" />
                        <div className="w-5/6 h-1 bg-gray-200 rounded-xs" />
                        <div className="w-4/6 h-1 bg-gray-200 rounded-xs" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium pt-2 border-t border-gray-200/50">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Updated {formatDate(doc.updatedAt)}
                      </span>
                      <span className="text-indigo-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Open Editor →
                      </span>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <Link href={`/dashboard/cvs/${doc.id}`} className="flex-1">
                  <Button size="sm" variant="outline" className="w-full" leftIcon={<Edit3 className="w-3.5 h-3.5" />}>
                    Edit
                  </Button>
                </Link>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDuplicate(doc)}
                  disabled={duplicatingId === doc.id}
                  title="Duplicate CV"
                >
                  {duplicatingId === doc.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setCvToDelete(doc)}
                  className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                  title="Delete CV"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create New CV Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Create New CV Document</h2>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCv} className="p-6 space-y-5">
              <Input
                label="Document Name / Title"
                placeholder="e.g. Senior Frontend Engineer Resume"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Starting Template
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
                  {(templates.length > 0 ? templates : [
                    { id: 'classic-professional', slug: 'classic-professional', name: 'Classic Professional', description: 'Traditional corporate layout', layout: 'single-column' },
                    { id: 'modern-corporate', slug: 'modern-corporate', name: 'Modern Corporate', description: 'Two-column layout with sidebar', layout: 'two-column-sidebar' },
                    { id: 'minimal', slug: 'minimal', name: 'Minimal', description: 'Clean airy minimalist typography', layout: 'minimal-clean' },
                    { id: 'creative', slug: 'creative', name: 'Creative', description: 'Vibrant accents and banners', layout: 'creative-accent' },
                    { id: 'developer', slug: 'developer', name: 'Developer', description: 'Monospace touches & tech badges', layout: 'developer-technical' },
                    { id: 'student-graduate', slug: 'student-graduate', name: 'Student / Graduate', description: 'Education and coursework first', layout: 'education-first' },
                  ]).map((t: any) => {
                    const isSelected = selectedTemplateId === (t.slug || t.id);
                    return (
                      <div
                        key={t.id || t.slug}
                        onClick={() => setSelectedTemplateId(t.slug || t.id)}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-gray-900">{t.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-1">{t.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={creating || !newTitle.trim()}
                  leftIcon={creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                >
                  {creating ? 'Creating...' : 'Create & Open Editor'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {cvToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Delete CV Document?</h3>
            <p className="text-sm text-gray-500">
              Are you sure you want to permanently delete &ldquo;{cvToDelete.title}&rdquo;? This
              action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => setCvToDelete(null)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={deleting}
                leftIcon={deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              >
                {deleting ? 'Deleting...' : 'Delete Permanently'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
