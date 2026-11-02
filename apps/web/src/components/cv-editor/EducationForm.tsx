'use client';

import React from 'react';
import { EducationItem } from '@/types/cv';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Trash2, GraduationCap } from 'lucide-react';

interface EducationFormProps {
  items: EducationItem[];
  onChange: (items: EducationItem[]) => void;
}

export function EducationForm({ items = [], onChange }: EducationFormProps) {
  const handleAdd = () => {
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      grade: '',
    };
    onChange([...items, newItem]);
  };

  const handleUpdate = (id: string, field: keyof EducationItem, value: any) => {
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
          List your university, college, or bootcamp qualifications.
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleAdd}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Add Education
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
          <GraduationCap className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">No education entries added yet</p>
          <Button
            type="button"
            size="sm"
            variant="primary"
            onClick={handleAdd}
            className="mt-3"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Education
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
                  <span className="w-6 h-6 rounded-full bg-violet-50 text-violet-600 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    {item.degree || 'Degree'}{' '}
                    {item.institution ? `at ${item.institution}` : ''}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Remove this entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Institution / University"
                  placeholder="e.g. Stanford University"
                  value={item.institution}
                  onChange={(e) => handleUpdate(item.id, 'institution', e.target.value)}
                  required
                />
                <Input
                  label="Degree"
                  placeholder="e.g. Bachelor of Science"
                  value={item.degree}
                  onChange={(e) => handleUpdate(item.id, 'degree', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Field of Study / Major"
                  placeholder="e.g. Computer Science"
                  value={item.field || ''}
                  onChange={(e) => handleUpdate(item.id, 'field', e.target.value)}
                />
                <Input
                  label="Start Date"
                  placeholder="e.g. 2018"
                  value={item.startDate}
                  onChange={(e) => handleUpdate(item.id, 'startDate', e.target.value)}
                />
                <Input
                  label="End Date / Expected"
                  placeholder="e.g. 2022"
                  value={item.endDate || ''}
                  onChange={(e) => handleUpdate(item.id, 'endDate', e.target.value)}
                />
              </div>

              <div className="sm:w-1/2">
                <Input
                  label="Grade / GPA / Honors (Optional)"
                  placeholder="e.g. 3.9 GPA, First Class Honours"
                  value={item.grade || ''}
                  onChange={(e) => handleUpdate(item.id, 'grade', e.target.value)}
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
            Add Another Qualification
          </Button>
        </div>
      )}
    </div>
  );
}
