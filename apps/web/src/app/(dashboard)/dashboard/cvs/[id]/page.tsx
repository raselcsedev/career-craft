'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { CvDocument, CvContent, CvStyling, CvTemplate } from '@/types/cv';
import { CvRenderer } from '@/components/cv-templates/CvRenderer';
import { PersonalForm } from '@/components/cv-editor/PersonalForm';
import { SummaryForm } from '@/components/cv-editor/SummaryForm';
import { ExperienceForm } from '@/components/cv-editor/ExperienceForm';
import { EducationForm } from '@/components/cv-editor/EducationForm';
import { SkillsForm } from '@/components/cv-editor/SkillsForm';
import { ProjectsForm } from '@/components/cv-editor/ProjectsForm';
import { CertificationsForm } from '@/components/cv-editor/CertificationsForm';
import { DesignForm } from '@/components/cv-editor/DesignForm';
import { TemplateSelectorModal } from '@/components/cv-editor/TemplateSelectorModal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { downloadCvAsPdf, downloadCvAsDocx } from '@/lib/cv-download';
import {
  ArrowLeft,
  Download,
  Save,
  Check,
  Loader2,
  Sparkles,
  Layout,
  Palette,
  Eye,
  FileEdit,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  ChevronDown,
  FileDown,
} from 'lucide-react';

type TabSection =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'design';

export default function CvEditorPage() {
  const params = useParams();
  const router = useRouter();
  const cvId = params.id as string;

  // CV Data State
  const [cv, setCv] = useState<CvDocument | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<CvContent | null>(null);
  const [styling, setStyling] = useState<CvStyling | null>(null);
  const [template, setTemplate] = useState<CvTemplate | null>(null);

  // UI State
  const [activeSection, setActiveSection] = useState<TabSection>('personal');
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  // Download dropdown state
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [downloading, setDownloading] = useState<'pdf' | 'docx' | null>(null);
  const downloadRef = useRef<HTMLDivElement>(null);

  // Debounced Autosave ref
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoad = useRef(true);

  // 1. Fetch CV on mount
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    api
      .get<{ cv: CvDocument }>(`/cvs/${cvId}`)
      .then((res) => {
        if (mounted && res?.cv) {
          setCv(res.cv);
          setTitle(res.cv.title || 'Untitled CV');
          setContent(res.cv.content);
          setStyling(
            res.cv.styling || {
              primaryColor: '#4f46e5',
              fontFamily: 'Inter',
              fontSize: 'normal',
              spacing: 'normal',
            },
          );
          setTemplate(res.cv.template || null);
          setSaveStatus('saved');
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message || 'Failed to load CV. It may have been deleted or moved.');
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
          // Wait a tick before enabling autosave trigger
          setTimeout(() => {
            isInitialLoad.current = false;
          }, 300);
        }
      });

    return () => {
      mounted = false;
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [cvId]);

  // 2. Perform Save API call
  const triggerSave = useCallback(
    async (
      updatedTitle = title,
      updatedContent = content,
      updatedStyling = styling,
      updatedTemplateId = template?.id,
    ) => {
      if (!cvId || !updatedContent) return;

      try {
        setSaveStatus('saving');
        await api.patch(`/cvs/${cvId}`, {
          title: updatedTitle,
          content: updatedContent,
          styling: updatedStyling,
          ...(updatedTemplateId && { templateId: updatedTemplateId }),
        });
        setSaveStatus('saved');
      } catch (err: any) {
        console.error('Autosave failed:', err);
        setSaveStatus('unsaved');
      }
    },
    [cvId, title, content, styling, template?.id],
  );

  // 3. Queue debounced autosave whenever content/styling/title changes
  const queueAutosave = useCallback(
    (
      newTitle: string,
      newContent: CvContent | null,
      newStyling: CvStyling | null,
      newTemplateId?: string,
    ) => {
      if (isInitialLoad.current) return;
      setSaveStatus('unsaved');

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        triggerSave(newTitle, newContent, newStyling, newTemplateId);
      }, 1200);
    },
    [triggerSave],
  );

  // Form Change Handlers
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    queueAutosave(newTitle, content, styling);
  };

  const handleContentChange = (updater: (prev: CvContent) => CvContent) => {
    if (!content) return;
    const nextContent = updater(content);
    setContent(nextContent);
    queueAutosave(title, nextContent, styling);
  };

  const handleStylingChange = (newStyling: CvStyling) => {
    setStyling(newStyling);
    queueAutosave(title, content, newStyling);
  };

  const handleTemplateSelect = (newTemplate: CvTemplate) => {
    setTemplate(newTemplate);
    queueAutosave(title, content, styling, newTemplate.id);
  };

  // ── Download handlers ──────────────────────────────────────────────────────
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (downloadRef.current && !downloadRef.current.contains(e.target as Node)) {
        setIsDownloadOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const safeName = (title || 'resume').replace(/[^a-z0-9]/gi, '_').toLowerCase();

  const handleDownloadPdf = async () => {
    setIsDownloadOpen(false);
    setDownloading('pdf');
    try {
      await downloadCvAsPdf('cv-printable-area', `${safeName}.pdf`);
    } catch (err: any) {
      alert(`PDF export failed: ${err.message}`);
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadDocx = async () => {
    setIsDownloadOpen(false);
    setDownloading('docx');
    try {
      if (!content) throw new Error('No CV content to export');
      await downloadCvAsDocx(content, title, `${safeName}.docx`);
    } catch (err: any) {
      alert(`Word export failed: ${err.message}`);
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm font-medium text-gray-600">Loading CV Builder...</p>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="max-w-2xl mx-auto py-12 space-y-4">
        <Alert variant="error" title="Could not open CV">
          {error || 'CV data could not be retrieved.'}
        </Alert>
        <Link href="/dashboard/cvs">
          <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to All CVs
          </Button>
        </Link>
      </div>
    );
  }

  const navItems: Array<{ id: TabSection; label: string; icon: React.ReactNode; count?: number }> = [
    { id: 'personal', label: 'Personal Info', icon: <User className="w-4 h-4" /> },
    { id: 'summary', label: 'Summary', icon: <FileText className="w-4 h-4" /> },
    {
      id: 'experience',
      label: 'Experience',
      icon: <Briefcase className="w-4 h-4" />,
      count: content.experiences?.length || 0,
    },
    {
      id: 'education',
      label: 'Education',
      icon: <GraduationCap className="w-4 h-4" />,
      count: content.educations?.length || 0,
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: <Wrench className="w-4 h-4" />,
      count: content.skills?.length || 0,
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <FolderGit2 className="w-4 h-4" />,
      count: content.projects?.length || 0,
    },
    {
      id: 'certifications',
      label: 'Credentials',
      icon: <Award className="w-4 h-4" />,
      count: (content.certifications?.length || 0) + (content.languages?.length || 0),
    },
    { id: 'design', label: 'Design & Theme', icon: <Palette className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-4 -mt-2">
      {/* Top Action Bar (hidden in print) */}
      <div className="no-print bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Back & CV Title */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard/cvs">
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              title="Back to all CVs"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="CV Title (e.g. Full Stack Resume)"
              className="font-bold text-gray-900 text-base sm:text-lg bg-transparent border-b border-transparent hover:border-gray-300 focus:border-indigo-600 focus:outline-none px-1 py-0.5 rounded transition-all"
            />
          </div>
        </div>

        {/* Center: Save status */}
        <div className="flex items-center gap-2 text-xs">
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-1.5 text-indigo-600 font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Saving changes...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <Check className="w-3.5 h-3.5" />
              All changes saved
            </span>
          )}
          {saveStatus === 'unsaved' && (
            <span className="flex items-center gap-1.5 text-amber-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Unsaved changes
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Template Switcher */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsTemplateModalOpen(true)}
            leftIcon={<Layout className="w-4 h-4 text-indigo-600" />}
          >
            <span className="hidden sm:inline">Template:</span>{' '}
            <span className="font-semibold">{template?.name || 'Classic'}</span>
          </Button>

          {/* Download Dropdown */}
          <div className="relative" ref={downloadRef}>
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsDownloadOpen((o) => !o)}
              disabled={downloading !== null}
              leftIcon={
                downloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )
              }
            >
              {downloading === 'pdf'
                ? 'Exporting PDF…'
                : downloading === 'docx'
                  ? 'Exporting Word…'
                  : 'Download'}
              <ChevronDown className="w-3.5 h-3.5 ml-1" />
            </Button>

            {isDownloadOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                >
                  <span className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </span>
                  <div className="text-left">
                    <p className="font-semibold">Download PDF</p>
                    <p className="text-xs text-gray-400">A4 · Perfect for applying</p>
                  </div>
                </button>
                <div className="border-t border-gray-100" />
                <button
                  type="button"
                  onClick={handleDownloadDocx}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                >
                  <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <FileDown className="w-4 h-4" />
                  </span>
                  <div className="text-left">
                    <p className="font-semibold">Download Word</p>
                    <p className="text-xs text-gray-400">.docx · Editable in MS Word</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Tab Switcher: Editor vs Preview */}
      <div className="no-print lg:hidden flex bg-gray-100 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setMobileView('editor')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            mobileView === 'editor'
              ? 'bg-white text-gray-900 shadow-xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <FileEdit className="w-3.5 h-3.5" />
          Edit Sections
        </button>
        <button
          type="button"
          onClick={() => setMobileView('preview')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            mobileView === 'preview'
              ? 'bg-white text-gray-900 shadow-xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          Live Preview
        </button>
      </div>

      {/* Main Workspace Layout (Side-by-side on desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Forms & Section Tabs (hidden on mobile if viewing preview) */}
        <div
          className={`no-print lg:col-span-6 space-y-4 ${
            mobileView === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* Section Navigation Tabs — 2x4 responsive grid so all 8 sections are always visible & clickable */}
          <div className="bg-white border border-gray-200 rounded-xl p-2 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-gray-50/80 text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-gray-100'
                  }`}
                >
                  <span className="flex items-center gap-1.5 min-w-0 truncate">
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </span>
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span
                      className={`shrink-0 ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Section Form Content Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-xs min-h-[500px]">
            {activeSection === 'personal' && (
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Personal Details</h3>
                <p className="text-xs text-gray-500 mb-5">
                  Your full name, target title, and contact methods.
                </p>
                <PersonalForm
                  data={content.personalInfo}
                  onChange={(updated) =>
                    handleContentChange((prev) => ({ ...prev, personalInfo: updated }))
                  }
                />
              </div>
            )}

            {activeSection === 'summary' && (
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Professional Summary</h3>
                <p className="text-xs text-gray-500 mb-5">
                  An elevator pitch capturing your core strengths and background.
                </p>
                <SummaryForm
                  value={content.summary}
                  onChange={(updated) =>
                    handleContentChange((prev) => ({ ...prev, summary: updated }))
                  }
                />
              </div>
            )}

            {activeSection === 'experience' && (
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Work History</h3>
                <ExperienceForm
                  items={content.experiences || []}
                  onChange={(updated) =>
                    handleContentChange((prev) => ({ ...prev, experiences: updated }))
                  }
                />
              </div>
            )}

            {activeSection === 'education' && (
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Education & Degrees</h3>
                <EducationForm
                  items={content.educations || []}
                  onChange={(updated) =>
                    handleContentChange((prev) => ({ ...prev, educations: updated }))
                  }
                />
              </div>
            )}

            {activeSection === 'skills' && (
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Skills & Tools</h3>
                <SkillsForm
                  items={content.skills || []}
                  onChange={(updated) =>
                    handleContentChange((prev) => ({ ...prev, skills: updated }))
                  }
                />
              </div>
            )}

            {activeSection === 'projects' && (
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Key Projects</h3>
                <ProjectsForm
                  items={content.projects || []}
                  onChange={(updated) =>
                    handleContentChange((prev) => ({ ...prev, projects: updated }))
                  }
                />
              </div>
            )}

            {activeSection === 'certifications' && (
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  Certifications & Languages
                </h3>
                <CertificationsForm
                  certifications={content.certifications || []}
                  languages={content.languages || []}
                  onChangeCertifications={(updated) =>
                    handleContentChange((prev) => ({ ...prev, certifications: updated }))
                  }
                  onChangeLanguages={(updated) =>
                    handleContentChange((prev) => ({ ...prev, languages: updated }))
                  }
                />
              </div>
            )}

            {activeSection === 'design' && (
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Design & Styling</h3>
                <p className="text-xs text-gray-500 mb-5">
                  Customize the theme color palette and typography.
                </p>
                <DesignForm
                  styling={
                    styling || {
                      primaryColor: '#4f46e5',
                      fontFamily: 'Inter',
                      fontSize: 'normal',
                      spacing: 'normal',
                    }
                  }
                  onChange={handleStylingChange}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Live Interactive Resume Preview (always visible on desktop or when toggled on mobile) */}
        <div
          id="cv-printable-area"
          className={`lg:col-span-6 ${
            mobileView === 'editor' ? 'hidden lg:block' : 'block'
          } print:block print:w-full print:m-0 print:p-0`}
        >
          {/* Preview Container Bar (hidden in print) */}
          <div className="no-print flex items-center justify-between mb-2 px-1 text-xs text-gray-500">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Live Preview ({template?.name || 'Classic Professional'})
            </span>
            <span className="text-gray-400">Updates live as you type</span>
          </div>

          {/* Rendered CV Document */}
          <div className="print-container overflow-hidden rounded-xl bg-gray-100 p-2 sm:p-4 border border-gray-200/80 shadow-inner">
            <CvRenderer
              content={content}
              styling={styling || undefined}
              templateSlug={template?.slug || 'classic-professional'}
            />
          </div>
        </div>
      </div>

      {/* Template Selector Modal */}
      <TemplateSelectorModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        selectedTemplateSlug={template?.slug || 'classic-professional'}
        onSelect={handleTemplateSelect}
      />
    </div>
  );
}
