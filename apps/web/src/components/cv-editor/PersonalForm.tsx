'use client';

import React from 'react';
import { PersonalInfo } from '@/types/cv';
import { Input } from '@/components/ui/Input';
import { User, Mail, Phone, MapPin, Globe, Briefcase } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/Icons';

interface PersonalFormProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export function PersonalForm({ data, onChange }: PersonalFormProps) {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          placeholder="e.g. Jane Doe"
          value={data.fullName || ''}
          onChange={(e) => handleChange('fullName', e.target.value)}
          leftIcon={<User className="w-4 h-4" />}
          required
        />
        <Input
          label="Job Title / Professional Headline"
          placeholder="e.g. Senior Software Engineer"
          value={data.headline || ''}
          onChange={(e) => handleChange('headline', e.target.value)}
          leftIcon={<Briefcase className="w-4 h-4" />}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="e.g. jane@example.com"
          value={data.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
          required
        />
        <Input
          label="Phone Number"
          placeholder="e.g. +1 (555) 000-0000"
          value={data.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          leftIcon={<Phone className="w-4 h-4" />}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="City / State"
          placeholder="e.g. San Francisco, CA"
          value={data.city || ''}
          onChange={(e) => handleChange('city', e.target.value)}
          leftIcon={<MapPin className="w-4 h-4" />}
        />
        <Input
          label="Country"
          placeholder="e.g. United States"
          value={data.country || ''}
          onChange={(e) => handleChange('country', e.target.value)}
        />
        <Input
          label="Profile Photo / Avatar URL"
          placeholder="https://example.com/photo.jpg"
          value={data.avatarUrl || ''}
          onChange={(e) => handleChange('avatarUrl', e.target.value)}
        />
      </div>

      <div className="pt-2 border-t border-gray-100">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Links & Social Profiles
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Portfolio / Website"
            placeholder="https://janedoe.com"
            value={data.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
            leftIcon={<Globe className="w-4 h-4" />}
          />
          <Input
            label="GitHub Profile"
            placeholder="github.com/janedoe"
            value={data.github || ''}
            onChange={(e) => handleChange('github', e.target.value)}
            leftIcon={<GithubIcon className="w-4 h-4" />}
          />
          <Input
            label="LinkedIn Profile"
            placeholder="linkedin.com/in/janedoe"
            value={data.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            leftIcon={<LinkedinIcon className="w-4 h-4" />}
          />
        </div>
      </div>
    </div>
  );
}
