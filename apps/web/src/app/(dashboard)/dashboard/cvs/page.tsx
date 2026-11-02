'use client';

import React, { useEffect, useState, useRef } from 'react';
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
  Copy,
  Trash2,
  Loader2,
  Edit3,
  Calendar,
  X,
  Check,
  Upload,
  FileUp,
  AlertCircle,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
type CreateMode = 'blank' | 'import';

export default function CvsDashboardPage() {
  const router = useRouter();
  const [cvs, setCvs] = useState<CvDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createMode, setCreateMode] = useState<CreateMode>('blank');

  // Blank-create form state
  const [newTitle, setNewTitle] = useState('My Resume');
  const [selectedTemplateId, setSelectedTemplateId] = useState('classic-professional');
  const [templates, setTemplates] = useState<CvTemplate[]>([]);
  const [creating, setCreating] = useState(false);

  // File-import state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsedPreview, setParsedPreview] = useState<Record<string, any> | null>(null);
  const [importTitle, setImportTitle] = useState('Imported Resume');

  // Delete confirmation modal state
  const [cvToDelete, setCvToDelete] = useState<CvDocument | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Duplicating state
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  // ── Data loading ────────────────────────────────────────────────────────────
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

  // ── Reset modal state ───────────────────────────────────────────────────────
  const resetModal = () => {
    setCreateMode('blank');
    setNewTitle('My Resume');
    setSelectedFile(null);
    setParsedPreview(null);
    setParseError(null);
    setImportTitle('Imported Resume');
    setParsing(false);
    setCreating(false);
  };

  const openModal = () => {
    resetModal();
    setIsCreateModalOpen(true);
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
  };

  // ── Blank create ────────────────────────────────────────────────────────────
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
        closeModal();
        router.push(`/dashboard/cvs/${res.cv.id}`);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create CV document');
    } finally {
      setCreating(false);
    }
  };

  // ── File selection & parse ──────────────────────────────────────────────────
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setParsedPreview(null);
    setParseError(null);
    // Auto-suggest title from filename
    const titleFromFile = file.name.replace(/\.(pdf|docx?|doc)$/i, '').replace(/[-_]/g, ' ');
    setImportTitle(titleFromFile || 'Imported Resume');
  };

  const handleParseFile = async () => {
    if (!selectedFile) return;
    try {
      setParsing(true);
      setParseError(null);
      setParsedPreview(null);

      const formData = new FormData();
      formData.append('file', selectedFile);

      // We call the raw fetch here instead of api.post because we need
      // multipart/form-data (not JSON) — api.post always sends JSON.
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/v1/cvs/parse-document`, {
        method: 'POST',
        credentials: 'include', // send the JWT cookie
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Server error ${response.status}`);
      }

      const data = await response.json();
      setParsedPreview(data.extractedData);
    } catch (err: any) {
      setParseError(err.message || 'Failed to parse file. Please check the file and try again.');
    } finally {
      setParsing(false);
    }
  };

  // ── Create CV from parsed data ──────────────────────────────────────────────
  const handleCreateFromFile = async () => {
    if (!parsedPreview) return;
    try {
      setCreating(true);
      const res = await api.post<{ cv: CvDocument }>('/cvs', {
        title: importTitle.trim() || 'Imported Resume',
        templateId: selectedTemplateId,
        content: parsedPreview,
      });
      if (res?.cv?.id) {
        closeModal();
        router.push(`/dashboard/cvs/${res.cv.id}`);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create CV from file');
    } finally {
      setCreating(false);
    }
  };

  // ── Duplicate ───────────────────────────────────────────────────────────────
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

  // ── Delete ──────────────────────────────────────────────────────────────────
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

  // ── Template list (fallback if API fails) ───────────────────────────────────
  const defaultTemplates = [
    { id: 'classic-professional', slug: 'classic-professional', name: 'Classic Professional', description: 'Traditional corporate layout', layout: 'single-column' },
    { id: 'modern-corporate', slug: 'modern-corporate', name: 'Modern Corporate', description: 'Two-column layout with sidebar', layout: 'two-column-sidebar' },
    { id: 'minimal', slug: 'minimal', name: 'Minimal', description: 'Clean airy minimalist typography', layout: 'minimal-clean' },
    { id: 'creative', slug: 'creative', name: 'Creative', description: 'Vibrant accents and banners', layout: 'creative-accent' },
    { id: 'developer', slug: 'developer', name: 'Developer', description: 'Monospace touches & tech badges', layout: 'developer-technical' },
    { id: 'student-graduate', slug: 'student-graduate', name: 'Student / Graduate', description: 'Education and coursework first', layout: 'education-first' },
  ];
  const displayTemplates = templates.length > 0 ? templates : defaultTemplates;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">My CV Documents</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Create, customize, and export ATS-friendly resumes for every application.
          </p>
        </div>
        <Button onClick={openModal} leftIcon={<Plus className="w-4 h-4" />}>
          Create New CV
        </Button>
      </div>

      {error && <Alert variant="error" title="Error">{error}</Alert>}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 rounded-xl border border-slate-200 dark:border-[#1B365D] bg-slate-50 dark:bg-[#101f38] animate-pulse p-5 space-y-4">
              <div className="h-4 bg-slate-200 dark:bg-navy-700 rounded w-1/3" />
              <div className="h-6 bg-slate-200 dark:bg-navy-700 rounded w-3/4" />
              <div className="h-32 bg-slate-200 dark:bg-navy-700 rounded" />
            </div>
          ))}
        </div>
      ) : cvs.length === 0 ? (
        /* Empty State */
        <Card className="border-dashed border-2 bg-slate-50/50 dark:bg-[#101f38]/40 text-center py-16">
          <CardContent className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#A0E0EF]/25 text-[#005A9C] dark:text-[#60C1E5] flex items-center justify-center mx-auto shadow-2xs">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No resumes created yet</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                Start from scratch or import your existing CV from a PDF or Word document.
              </p>
            </div>
            <Button onClick={openModal} leftIcon={<Plus className="w-4 h-4" />}>
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
              className="group relative bg-white dark:bg-[#101f38] border border-slate-200 dark:border-[#1B365D] rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-[#005A9C] dark:hover:border-[#60C1E5] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header of card */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1">
                    <span className="text-[11px] font-semibold tracking-wider text-[#005A9C] dark:text-[#60C1E5] uppercase">
                      {doc.template?.name || 'Classic'}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#005A9C] dark:group-hover:text-[#60C1E5] transition-colors">
                      {doc.title || 'Untitled CV'}
                    </h2>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {doc.template?.layout || 'single-column'}
                  </Badge>
                </div>

                {/* Visual Document Mockup Preview Box */}
                <Link href={`/dashboard/cvs/${doc.id}`}>
                  <div className="w-full aspect-[16/10] bg-slate-50 dark:bg-[#0b1526] border border-slate-100 dark:border-navy-700/60 rounded-xl p-3.5 flex flex-col justify-between group-hover:bg-[#A0E0EF]/10 dark:group-hover:bg-[#005A9C]/15 transition-colors cursor-pointer mb-4 overflow-hidden relative">
                    <div className="space-y-2">
                      <div className="w-2/5 h-2 bg-slate-300 dark:bg-navy-600 rounded-xs" />
                      <div className="w-1/3 h-1.5 bg-slate-200 dark:bg-navy-700 rounded-xs" />
                      <div className="pt-2 space-y-1">
                        <div className="w-full h-1 bg-slate-200 dark:bg-navy-700 rounded-xs" />
                        <div className="w-5/6 h-1 bg-slate-200 dark:bg-navy-700 rounded-xs" />
                        <div className="w-4/6 h-1 bg-slate-200 dark:bg-navy-700 rounded-xs" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-medium pt-2 border-t border-slate-200/50 dark:border-navy-700/50">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Updated {formatDate(doc.updatedAt)}
                      </span>
                      <span className="text-[#005A9C] dark:text-[#60C1E5] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Open Editor →
                      </span>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-[#1B365D]/60 flex items-center justify-between gap-2">
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
                  className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  title="Delete CV"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create New CV Modal ─────────────────────────────────────────────── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#101f38] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#1B365D] overflow-hidden transition-colors">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-[#1B365D] flex items-center justify-between bg-slate-50/50 dark:bg-[#0b1526]/50">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create New CV Document</h2>
              <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Tabs */}
            <div className="flex border-b border-slate-200 dark:border-[#1B365D]">
              <button
                type="button"
                onClick={() => setCreateMode('blank')}
                className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  createMode === 'blank'
                    ? 'text-[#005A9C] dark:text-[#60C1E5] border-b-2 border-[#005A9C] dark:border-[#60C1E5] bg-[#A0E0EF]/15 dark:bg-[#005A9C]/20 font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-navy-800'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Start from Blank
              </button>
              <button
                type="button"
                onClick={() => setCreateMode('import')}
                className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  createMode === 'import'
                    ? 'text-[#005A9C] dark:text-[#60C1E5] border-b-2 border-[#005A9C] dark:border-[#60C1E5] bg-[#A0E0EF]/15 dark:bg-[#005A9C]/20 font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-navy-800'
                }`}
              >
                <Upload className="w-4 h-4" />
                Import from PDF / DOCX
              </button>
            </div>

            {/* ── BLANK TAB ───────────────────────────────────────────────── */}
            {createMode === 'blank' && (
              <form onSubmit={handleCreateCv} className="p-6 space-y-5">
                <Input
                  label="Document Name / Title"
                  placeholder="e.g. Senior Frontend Engineer Resume"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Select Starting Template
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
                    {displayTemplates.map((t: any) => {
                      const isSelected = selectedTemplateId === (t.slug || t.id);
                      return (
                        <div
                          key={t.id || t.slug}
                          onClick={() => setSelectedTemplateId(t.slug || t.id)}
                          className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#005A9C] dark:border-[#60C1E5] bg-[#A0E0EF]/15 dark:bg-[#005A9C]/25 shadow-xs'
                              : 'border-slate-200 dark:border-navy-700 hover:border-slate-300 dark:hover:border-navy-600 bg-white dark:bg-navy-900/40'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{t.name}</span>
                            {isSelected && <Check className="w-4 h-4 text-[#005A9C] dark:text-[#60C1E5]" />}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{t.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-[#1B365D] flex items-center justify-end gap-3">
                  <Button type="button" variant="secondary" onClick={closeModal}>
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
            )}

            {/* ── IMPORT TAB ──────────────────────────────────────────────── */}
            {createMode === 'import' && (
              <div className="p-6 space-y-5">
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Upload your existing CV as a <strong>PDF</strong> or <strong>DOCX</strong> file.
                  We&apos;ll extract your name, contact info, experience, education, and skills and
                  pre-fill the editor so you can fine-tune and download a polished new version.
                </p>

                {/* File Drop Zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                    selectedFile
                      ? 'border-[#005A9C] dark:border-[#60C1E5] bg-[#A0E0EF]/15 dark:bg-[#005A9C]/20'
                      : 'border-slate-300 dark:border-navy-700 hover:border-[#005A9C] dark:hover:border-[#60C1E5] hover:bg-slate-50 dark:hover:bg-navy-900/40'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  {selectedFile ? (
                    <div className="space-y-2">
                      <FileUp className="w-8 h-8 text-[#005A9C] dark:text-[#60C1E5] mx-auto" />
                      <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{selectedFile.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {(selectedFile.size / 1024).toFixed(1)} KB — Click to change file
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto" />
                      <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                        Click to upload your CV
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">PDF, DOC, or DOCX · Max 10 MB</p>
                    </div>
                  )}
                </div>

                {/* Parse button */}
                {selectedFile && !parsedPreview && (
                  <Button
                    className="w-full"
                    onClick={handleParseFile}
                    disabled={parsing}
                    leftIcon={
                      parsing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )
                    }
                  >
                    {parsing ? 'Extracting data from file…' : 'Extract CV Data from File'}
                  </Button>
                )}

                {/* Parse error */}
                {parseError && (
                  <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl p-3.5 text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{parseError}</span>
                  </div>
                )}

                {/* Parsed preview summary */}
                {parsedPreview && (
                  <div className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-1">
                      <p className="text-sm font-bold text-emerald-800 flex items-center gap-2">
                        <Check className="w-4 h-4" /> Data extracted successfully!
                      </p>
                      <p className="text-xs text-emerald-700">
                        Review the summary below, then click &ldquo;Create CV from File&rdquo; to open the editor with your data pre-filled.
                      </p>
                    </div>

                    {/* Summary chips */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { label: 'Name', value: parsedPreview.personalInfo?.fullName || '—' },
                        { label: 'Email', value: parsedPreview.personalInfo?.email || '—' },
                        { label: 'Phone', value: parsedPreview.personalInfo?.phone || '—' },
                        { label: 'Location', value: parsedPreview.personalInfo?.location || '—' },
                        { label: 'Experiences', value: `${parsedPreview.experiences?.length || 0} found` },
                        { label: 'Educations', value: `${parsedPreview.educations?.length || 0} found` },
                        { label: 'Skills', value: `${parsedPreview.skills?.length || 0} found` },
                        { label: 'Projects', value: `${parsedPreview.projects?.length || 0} found` },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                          <p className="text-gray-400 font-medium">{label}</p>
                          <p className="text-gray-900 font-semibold truncate">{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* CV title for import */}
                    <Input
                      label="CV Document Title"
                      value={importTitle}
                      onChange={(e) => setImportTitle(e.target.value)}
                      placeholder="e.g. John Doe — Imported Resume"
                    />

                    {/* Template pick for import */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Choose a Template
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto p-1">
                        {displayTemplates.map((t: any) => {
                          const isSelected = selectedTemplateId === (t.slug || t.id);
                          return (
                            <div
                              key={t.id || t.slug}
                              onClick={() => setSelectedTemplateId(t.slug || t.id)}
                              className={`p-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-indigo-600 bg-indigo-50/40'
                                  : 'border-gray-200 hover:border-gray-300 bg-white'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-0.5">
                                <span className="font-bold text-xs text-gray-900 truncate">{t.name}</span>
                                {isSelected && <Check className="w-3 h-3 text-indigo-600 shrink-0" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer actions */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                  <Button type="button" variant="secondary" onClick={closeModal}>
                    Cancel
                  </Button>
                  {parsedPreview && (
                    <Button
                      onClick={handleCreateFromFile}
                      disabled={creating}
                      leftIcon={
                        creating ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )
                      }
                    >
                      {creating ? 'Creating CV…' : 'Create CV from File'}
                    </Button>
                  )}
                </div>
              </div>
            )}
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
              <Button variant="secondary" onClick={() => setCvToDelete(null)} disabled={deleting}>
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
