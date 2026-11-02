'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  PortfolioDocument,
  PortfolioProject,
  PortfolioTemplate,
  PublicPortfolioData,
} from '@/types/portfolio';
import { PortfolioRenderer } from '@/components/portfolio-templates/PortfolioRenderer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Card, CardContent } from '@/components/ui/Card';
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  Plus,
  Trash2,
  Check,
  Save,
  Loader2,
  Sparkles,
  Layout,
  Layers,
  Palette,
  Eye,
  FileEdit,
  Code2,
  FolderGit2,
  CheckCircle2,
  X,
  Smartphone,
  Monitor,
} from 'lucide-react';

type Tab = 'content' | 'projects' | 'theme';

export default function PortfolioEditorPage() {
  const params = useParams();
  const router = useRouter();
  const portfolioId = params.id as string;
  const { user } = useAuth();

  const [portfolio, setPortfolio] = useState<PortfolioDocument | null>(null);
  const [templates, setTemplates] = useState<PortfolioTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [bio, setBio] = useState('');
  const [templateSlug, setTemplateSlug] = useState('minimal-developer');
  const [primaryColor, setPrimaryColor] = useState('#4f46e5');
  const [isPublished, setIsPublished] = useState(false);

  // Projects state
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectTech, setNewProjectTech] = useState('TypeScript, Next.js, MySQL');
  const [newProjectDemoUrl, setNewProjectDemoUrl] = useState('');
  const [newProjectRepoUrl, setNewProjectRepoUrl] = useState('');
  const [newProjectFeatured, setNewProjectFeatured] = useState(false);
  const [addingProject, setAddingProject] = useState(false);

  // UI state
  const [activeTab, setActiveTab] = useState<Tab>('content');
  const [mobileMode, setMobileMode] = useState<'editor' | 'preview'>('editor');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [publishing, setPublishing] = useState(false);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoad = useRef(true);

  // Load portfolio
  const loadPortfolio = async () => {
    try {
      setLoading(true);
      setError(null);
      const [portRes, tmplsRes] = await Promise.all([
        api.get<{ portfolio: PortfolioDocument }>(`/portfolios/${portfolioId}`),
        api.get<{ templates: PortfolioTemplate[] }>('/portfolio-templates'),
      ]);

      const p = portRes.portfolio;
      setPortfolio(p);
      setTitle(p.title || '');
      setSlug(p.slug || '');
      setBio(p.bio || '');
      setTemplateSlug(p.template?.slug || 'minimal-developer');
      setPrimaryColor(p.themeConfig?.primaryColor || '#4f46e5');
      setIsPublished(p.isPublished || false);
      setProjects(p.projects || []);
      setTemplates(tmplsRes.templates || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load portfolio.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, [portfolioId]);

  // Debounced auto-save for general details
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    setSaveStatus('unsaved');
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        setSaveStatus('saving');
        await api.patch(`/portfolios/${portfolioId}`, {
          title,
          slug,
          bio,
          templateId: templateSlug,
          themeConfig: {
            primaryColor,
            fontFamily: 'Inter',
          },
        });
        setSaveStatus('saved');
      } catch (err: any) {
        setSaveStatus('unsaved');
      }
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [title, slug, bio, templateSlug, primaryColor, portfolioId]);

  // Manual save
  const handleSave = async () => {
    try {
      setSaveStatus('saving');
      await api.patch(`/portfolios/${portfolioId}`, {
        title,
        slug,
        bio,
        templateId: templateSlug,
        themeConfig: {
          primaryColor,
          fontFamily: 'Inter',
        },
      });
      setSaveStatus('saved');
    } catch (err: any) {
      alert(err.message || 'Failed to save changes.');
      setSaveStatus('unsaved');
    }
  };

  // Publish / Unpublish
  const handleTogglePublish = async () => {
    try {
      setPublishing(true);
      const endpoint = isPublished
        ? `/portfolios/${portfolioId}/unpublish`
        : `/portfolios/${portfolioId}/publish`;
      const res = await api.post<{ portfolio: PortfolioDocument }>(endpoint);
      setIsPublished(res.portfolio.isPublished);
    } catch (err: any) {
      alert(err.message || 'Failed to update publishing status.');
    } finally {
      setPublishing(false);
    }
  };

  // Add project
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setAddingProject(true);
      const res = await api.post<{ project: PortfolioProject }>(`/portfolios/${portfolioId}/projects`, {
        title: newProjectTitle,
        description: newProjectDesc,
        technologies: newProjectTech,
        projectUrl: newProjectDemoUrl || undefined,
        repoUrl: newProjectRepoUrl || undefined,
        isFeatured: newProjectFeatured,
      });

      setProjects((prev) => [...prev, res.project]);
      setIsAddProjectModalOpen(false);
      setNewProjectTitle('');
      setNewProjectDesc('');
      setNewProjectDemoUrl('');
      setNewProjectRepoUrl('');
      setNewProjectFeatured(false);
    } catch (err: any) {
      alert(err.message || 'Failed to add project.');
    } finally {
      setAddingProject(false);
    }
  };

  // Remove project
  const handleRemoveProject = async (projectId: string) => {
    try {
      await api.delete(`/portfolios/${portfolioId}/projects/${projectId}`);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err: any) {
      alert(err.message || 'Failed to remove project.');
    }
  };

  // Constructed preview data
  const previewData: PublicPortfolioData = useMemo(() => {
    return {
      id: portfolioId,
      title: title || 'Untitled Portfolio',
      slug: slug || 'preview',
      bio,
      themeConfig: {
        primaryColor,
        fontFamily: 'Inter',
      },
      template:
        templates.find((t) => t.slug === templateSlug) || {
          id: '1',
          slug: templateSlug,
          name: 'Template',
          description: '',
          layout: 'standard',
          isActive: true,
        },
      projects,
      owner: user?.profile || {
        firstName: 'Your',
        lastName: 'Name',
        headline: 'Professional Software Engineer',
        bio,
      },
    };
  }, [portfolioId, title, slug, bio, templateSlug, primaryColor, templates, projects, user]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm text-gray-500">Loading portfolio editor...</p>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="p-8 text-center space-y-4">
        <Alert variant="error">{error || 'Portfolio not found'}</Alert>
        <Link href="/dashboard/portfolios">
          <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Portfolios
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto">
      {/* Top Navbar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/portfolios">
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div className="space-y-0.5">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-bold text-lg text-gray-900 border-b border-transparent hover:border-gray-300 focus:border-indigo-500 focus:outline-none transition-colors px-1"
            />
            <p className="text-xs text-gray-400 font-mono flex items-center gap-1.5 px-1">
              <span>careercraft.com/p/{slug}</span>
              {isPublished && (
                <a
                  href={`/p/${slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:underline flex items-center gap-0.5"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </p>
          </div>
        </div>

        {/* Toolbar Center / Right */}
        <div className="flex items-center gap-3">
          {/* Save indicator */}
          <div className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
            {saveStatus === 'saving' && (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>Saving...</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">All changes saved</span>
              </>
            )}
            {saveStatus === 'unsaved' && <span className="text-amber-600">Unsaved changes</span>}
          </div>

          <Button
            variant={isPublished ? 'outline' : 'primary'}
            size="sm"
            isLoading={publishing}
            onClick={handleTogglePublish}
            leftIcon={isPublished ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Globe className="w-4 h-4" />}
          >
            {isPublished ? 'Published (Live)' : 'Publish Portfolio'}
          </Button>

          {/* Device toggle for preview */}
          <div className="hidden lg:flex items-center rounded-lg border border-gray-200 p-0.5 bg-gray-50">
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                previewDevice === 'desktop' ? 'bg-white shadow-xs text-indigo-600' : 'text-gray-500'
              }`}
              title="Desktop Preview"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                previewDevice === 'mobile' ? 'bg-white shadow-xs text-indigo-600' : 'text-gray-500'
              }`}
              title="Mobile Preview"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile view switch button */}
          <div className="lg:hidden flex rounded-lg border border-gray-200 p-0.5 bg-gray-50">
            <button
              onClick={() => setMobileMode('editor')}
              className={`px-3 py-1 rounded-md text-xs font-medium ${
                mobileMode === 'editor' ? 'bg-white shadow-xs text-indigo-600' : 'text-gray-500'
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setMobileMode('preview')}
              className={`px-3 py-1 rounded-md text-xs font-medium ${
                mobileMode === 'preview' ? 'bg-white shadow-xs text-indigo-600' : 'text-gray-500'
              }`}
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Editor & Preview Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[750px]">
        {/* Left Side: Editor Form */}
        <div
          className={`lg:col-span-5 space-y-4 ${
            mobileMode === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 bg-white rounded-t-xl px-4 pt-2 gap-4 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('content')}
              className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'content'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <FileEdit className="w-4 h-4" />
              <span>Bio &amp; Slug</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'projects'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>Projects ({projects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('theme')}
              className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'theme'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Design &amp; Theme</span>
            </button>
          </div>

          {/* Tab 1: Bio & Slug */}
          {activeTab === 'content' && (
            <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 p-6 space-y-5 shadow-xs">
              <Input
                label="Portfolio Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Alex Morgan — Portfolio"
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Public Slug URL</label>
                <div className="flex items-center rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-indigo-500">
                  <span className="text-gray-400 select-none">careercraft.com/p/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) =>
                      setSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, '')
                          .replace(/--+/g, '-'),
                      )
                    }
                    className="w-full bg-transparent text-gray-900 font-mono font-medium focus:outline-none pl-0.5"
                  />
                </div>
                <p className="text-xs text-gray-400">Claim your public handle.</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Headline Bio &amp; About</label>
                <textarea
                  rows={6}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Introduce yourself, your primary skillset, engineering philosophy, and mission..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button size="sm" onClick={handleSave} leftIcon={<Save className="w-3.5 h-3.5" />}>
                  Save Details
                </Button>
              </div>
            </div>
          )}

          {/* Tab 2: Projects */}
          {activeTab === 'projects' && (
            <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 p-6 space-y-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Featured Projects</h3>
                  <p className="text-xs text-gray-500">Showcase your apps, repositories, and case studies.</p>
                </div>
                <Button size="sm" onClick={() => setIsAddProjectModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
                  Add Project
                </Button>
              </div>

              <div className="space-y-3">
                {projects.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl text-xs text-gray-400">
                    No projects added yet. Click &quot;Add Project&quot; above to showcase your work!
                  </div>
                ) : (
                  projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors flex items-start justify-between gap-3 bg-gray-50/50"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-gray-900">{proj.title}</h4>
                          {proj.isFeatured && (
                            <Badge variant="default">Featured</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">{proj.description}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {proj.technologies?.map((tech, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-white border border-gray-200 text-[10px] text-gray-600">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveProject(proj.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Design & Theme */}
          {activeTab === 'theme' && (
            <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 p-6 space-y-6 shadow-xs">
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-900">Choose Visual Design</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {templates.map((tmpl) => (
                    <div
                      key={tmpl.id}
                      onClick={() => setTemplateSlug(tmpl.slug)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        templateSlug === tmpl.slug
                          ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-gray-900">{tmpl.name}</p>
                        {templateSlug === tmpl.slug && (
                          <Badge variant="default">Active</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{tmpl.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Live Interactive Preview */}
        <div
          className={`lg:col-span-7 ${
            mobileMode === 'editor' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="sticky top-20 bg-gray-100 rounded-2xl border border-gray-200 p-2 sm:p-4 shadow-inner">
            <div className="flex items-center justify-between px-2 pb-2 text-xs text-gray-500">
              <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                Live Preview
              </span>
              <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-gray-200">
                {templateSlug}
              </span>
            </div>

            {/* Viewport Frame */}
            <div
              className={`mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 max-h-[750px] overflow-y-auto ${
                previewDevice === 'mobile' ? 'max-w-sm' : 'w-full'
              }`}
            >
              <PortfolioRenderer data={previewData} templateSlug={templateSlug} />
            </div>
          </div>
        </div>
      </div>

      {/* Add Project Modal */}
      {isAddProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">Add Portfolio Project</h3>
              <button
                onClick={() => setIsAddProjectModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProject} className="space-y-4">
              <Input
                label="Project Title"
                placeholder="e.g. Distributed Task Queue Engine"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                required
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Project Description</label>
                <textarea
                  rows={3}
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="Explain the problem solved, architecture, and core outcomes..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <Input
                label="Technologies (comma-separated)"
                placeholder="TypeScript, Next.js, Redis, Docker"
                value={newProjectTech}
                onChange={(e) => setNewProjectTech(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Live Demo URL (optional)"
                  placeholder="https://app.example.com"
                  value={newProjectDemoUrl}
                  onChange={(e) => setNewProjectDemoUrl(e.target.value)}
                />
                <Input
                  label="Repository URL (optional)"
                  placeholder="https://github.com/..."
                  value={newProjectRepoUrl}
                  onChange={(e) => setNewProjectRepoUrl(e.target.value)}
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={newProjectFeatured}
                  onChange={(e) => setNewProjectFeatured(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <span>Feature this project prominently</span>
              </label>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <Button type="button" variant="outline" onClick={() => setIsAddProjectModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={addingProject}>
                  Add to Portfolio
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
