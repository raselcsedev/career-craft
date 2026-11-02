'use client';

import React from 'react';
import { ProjectItem } from '@/types/cv';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Trash2, FolderGit2 } from 'lucide-react';

interface ProjectsFormProps {
  items: ProjectItem[];
  onChange: (items: ProjectItem[]) => void;
}

export function ProjectsForm({ items = [], onChange }: ProjectsFormProps) {
  const handleAdd = () => {
    const newItem: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: '',
      description: '',
      technologies: '',
      url: '',
      github: '',
    };
    onChange([...items, newItem]);
  };

  const handleUpdate = (id: string, field: keyof ProjectItem, value: any) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const handleDelete = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          Showcase notable software projects, research papers, or open source repositories.
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleAdd}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Add Project
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
          <FolderGit2 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">No projects added yet</p>
          <Button
            type="button"
            size="sm"
            variant="primary"
            onClick={handleAdd}
            className="mt-3"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Project
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="p-4 border border-gray-200 rounded-xl bg-white shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between border-b pb-2 border-gray-100">
                <span className="text-sm font-semibold text-gray-800">
                  {index + 1}. {item.title || 'Untitled Project'}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Remove project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Project Title"
                  placeholder="e.g. AI Workflow Platform"
                  value={item.title}
                  onChange={(e) => handleUpdate(item.id, 'title', e.target.value)}
                  required
                />
                <Input
                  label="Technologies Used"
                  placeholder="e.g. Next.js, TypeScript, Tailwind, Prisma"
                  value={item.technologies || ''}
                  onChange={(e) => handleUpdate(item.id, 'technologies', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Live Demo URL"
                  placeholder="https://myproject.com"
                  value={item.url || ''}
                  onChange={(e) => handleUpdate(item.id, 'url', e.target.value)}
                />
                <Input
                  label="Source Code / GitHub URL"
                  placeholder="https://github.com/user/project"
                  value={item.github || ''}
                  onChange={(e) => handleUpdate(item.id, 'github', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={item.description || ''}
                  onChange={(e) => handleUpdate(item.id, 'description', e.target.value)}
                  placeholder="Brief summary of what you built, technical challenges overcome, and outcomes."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400"
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed"
            onClick={handleAdd}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Another Project
          </Button>
        </div>
      )}
    </div>
  );
}
