'use client';

import React from 'react';
import { ExperienceItem } from '@/types/cv';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Trash2, GripVertical, Briefcase } from 'lucide-react';

interface ExperienceFormProps {
  items: ExperienceItem[];
  onChange: (items: ExperienceItem[]) => void;
}

export function ExperienceForm({ items = [], onChange }: ExperienceFormProps) {
  const handleAdd = () => {
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    onChange([...items, newItem]);
  };

  const handleUpdate = (id: string, field: keyof ExperienceItem, value: any) => {
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
          Add your work history, starting with your most recent role.
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleAdd}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Add Position
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
          <Briefcase className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">No work experiences added yet</p>
          <p className="text-xs text-gray-500 mt-1">Click the button below to add your first job</p>
          <Button
            type="button"
            size="sm"
            variant="primary"
            onClick={handleAdd}
            className="mt-3"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Experience
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="p-4 border border-gray-200 rounded-xl bg-white shadow-xs space-y-3.5"
            >
              <div className="flex items-center justify-between border-b pb-2.5 border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    {item.position || 'Untitled Role'}{' '}
                    {item.company ? `at ${item.company}` : ''}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Remove this position"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Job Title / Position"
                  placeholder="e.g. Senior Frontend Developer"
                  value={item.position}
                  onChange={(e) => handleUpdate(item.id, 'position', e.target.value)}
                  required
                />
                <Input
                  label="Company Name"
                  placeholder="e.g. Google or Acme Inc"
                  value={item.company}
                  onChange={(e) => handleUpdate(item.id, 'company', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Location"
                  placeholder="e.g. New York, NY (or Remote)"
                  value={item.location || ''}
                  onChange={(e) => handleUpdate(item.id, 'location', e.target.value)}
                />
                <Input
                  label="Start Date"
                  type="text"
                  placeholder="e.g. Jan 2022"
                  value={item.startDate}
                  onChange={(e) => handleUpdate(item.id, 'startDate', e.target.value)}
                />
                <div className="space-y-1.5">
                  <Input
                    label="End Date"
                    type="text"
                    placeholder={item.current ? 'Present' : 'e.g. Present or Dec 2024'}
                    value={item.endDate || ''}
                    disabled={item.current}
                    onChange={(e) => handleUpdate(item.id, 'endDate', e.target.value)}
                  />
                  <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer pt-0.5">
                    <input
                      type="checkbox"
                      checked={item.current || false}
                      onChange={(e) => {
                        handleUpdate(item.id, 'current', e.target.checked);
                        if (e.target.checked) {
                          handleUpdate(item.id, 'endDate', '');
                        }
                      }}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    I currently work here
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Description & Impact (Bullet points or narrative)
                </label>
                <textarea
                  rows={3}
                  value={item.description || ''}
                  onChange={(e) => handleUpdate(item.id, 'description', e.target.value)}
                  placeholder="• Spearheaded redesign of core checkout flow, increasing conversion by 22%&#10;• Mentored 4 junior engineers on modern React architecture"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-400"
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
            Add Another Position
          </Button>
        </div>
      )}
    </div>
  );
}
