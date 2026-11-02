'use client';

import React, { useState } from 'react';
import { SkillItem } from '@/types/cv';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, X, Sparkles } from 'lucide-react';

interface SkillsFormProps {
  items: SkillItem[];
  onChange: (items: SkillItem[]) => void;
}

export function SkillsForm({ items = [], onChange }: SkillsFormProps) {
  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('Technical');

  const popularSuggestions = [
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'NestJS',
    'Python',
    'SQL / MySQL',
    'PostgreSQL',
    'Docker',
    'Git',
    'REST APIs',
    'GraphQL',
    'Tailwind CSS',
    'AWS',
    'Agile / Scrum',
    'UI / UX Design',
    'Leadership',
  ];

  const handleAdd = (nameToAdd?: string) => {
    const finalName = (nameToAdd || skillName).trim();
    if (!finalName) return;

    if (items.some((s) => s.name.toLowerCase() === finalName.toLowerCase())) {
      setSkillName('');
      return;
    }

    const newItem: SkillItem = {
      id: `skill-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: finalName,
      category,
    };
    onChange([...items, newItem]);
    setSkillName('');
  };

  const handleRemove = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-xs text-gray-500">
          Highlight key competencies, programming languages, libraries, tools, and methodologies.
        </p>
      </div>

      {/* Add Skill Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Input
            placeholder="Type a skill (e.g. Next.js, Team Leadership)..."
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="Technical">Technical</option>
          <option value="Soft">Soft Skill</option>
          <option value="Tools">Tool / Platform</option>
          <option value="Design">Design</option>
        </select>
        <Button
          type="button"
          onClick={() => handleAdd()}
          disabled={!skillName.trim()}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add
        </Button>
      </div>

      {/* Quick Add Suggestions */}
      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          Quick Add Popular Skills:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {popularSuggestions.map((pop) => {
            const alreadyAdded = items.some(
              (i) => i.name.toLowerCase() === pop.toLowerCase(),
            );
            return (
              <button
                key={pop}
                type="button"
                disabled={alreadyAdded}
                onClick={() => handleAdd(pop)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                  alreadyAdded
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-default'
                    : 'bg-white hover:bg-indigo-50 hover:border-indigo-300 text-gray-700 border-gray-300 cursor-pointer shadow-2xs'
                }`}
              >
                + {pop}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Skills List */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Your Selected Skills ({items.length})
        </h4>
        {items.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No skills added yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {items.map((skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-300 text-gray-800 rounded-lg text-xs font-medium shadow-2xs group hover:border-indigo-300"
              >
                <span>{skill.name}</span>
                {skill.category && skill.category !== 'Technical' && (
                  <span className="text-[10px] text-gray-400">({skill.category})</span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(skill.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-0.5 rounded cursor-pointer"
                  title="Remove skill"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
