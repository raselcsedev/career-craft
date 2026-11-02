'use client';

import React from 'react';
import { CertificationItem, LanguageItem } from '@/types/cv';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Trash2, Award, Languages } from 'lucide-react';

interface CertificationsFormProps {
  certifications: CertificationItem[];
  languages: LanguageItem[];
  onChangeCertifications: (items: CertificationItem[]) => void;
  onChangeLanguages: (items: LanguageItem[]) => void;
}

export function CertificationsForm({
  certifications = [],
  languages = [],
  onChangeCertifications,
  onChangeLanguages,
}: CertificationsFormProps) {
  // Certification handlers
  const handleAddCert = () => {
    const newItem: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      date: '',
    };
    onChangeCertifications([...certifications, newItem]);
  };

  const handleUpdateCert = (id: string, field: keyof CertificationItem, value: any) => {
    onChangeCertifications(
      certifications.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const handleDeleteCert = (id: string) => {
    onChangeCertifications(certifications.filter((item) => item.id !== id));
  };

  // Language handlers
  const handleAddLang = () => {
    const newItem: LanguageItem = {
      id: `lang-${Date.now()}`,
      name: '',
      proficiency: 'Fluent',
    };
    onChangeLanguages([...languages, newItem]);
  };

  const handleUpdateLang = (id: string, field: keyof LanguageItem, value: any) => {
    onChangeLanguages(
      languages.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const handleDeleteLang = (id: string) => {
    onChangeLanguages(languages.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Certifications Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-600" />
              Certifications & Credentials
            </h3>
            <p className="text-xs text-gray-500">
              Industry licenses, cloud certifications, or specialized courses.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAddCert}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Cert
          </Button>
        </div>

        {certifications.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No certifications added.</p>
        ) : (
          <div className="space-y-3">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="p-3 border border-gray-200 rounded-lg bg-white flex flex-col sm:flex-row gap-3 items-start sm:items-center"
              >
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                  <Input
                    placeholder="Certification Name (e.g. AWS Solutions Architect)"
                    value={cert.name}
                    onChange={(e) => handleUpdateCert(cert.id, 'name', e.target.value)}
                  />
                  <Input
                    placeholder="Issuer (e.g. Amazon Web Services)"
                    value={cert.issuer}
                    onChange={(e) => handleUpdateCert(cert.id, 'issuer', e.target.value)}
                  />
                  <Input
                    placeholder="Year (e.g. 2024)"
                    value={cert.date || ''}
                    onChange={(e) => handleUpdateCert(cert.id, 'date', e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteCert(cert.id)}
                  className="text-gray-400 hover:text-red-500 p-1 self-end sm:self-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Languages Section */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-indigo-600" />
              Languages
            </h3>
            <p className="text-xs text-gray-500">
              Spoken and written language proficiencies.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAddLang}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Language
          </Button>
        </div>

        {languages.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No languages added.</p>
        ) : (
          <div className="space-y-3">
            {languages.map((lang) => (
              <div
                key={lang.id}
                className="p-3 border border-gray-200 rounded-lg bg-white flex items-center gap-3"
              >
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input
                    placeholder="Language (e.g. English, Spanish)"
                    value={lang.name}
                    onChange={(e) => handleUpdateLang(lang.id, 'name', e.target.value)}
                  />
                  <select
                    value={lang.proficiency}
                    onChange={(e) => handleUpdateLang(lang.id, 'proficiency', e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Native / Bilingual">Native / Bilingual</option>
                    <option value="Fluent / Full Professional">Fluent / Full Professional</option>
                    <option value="Professional Working">Professional Working</option>
                    <option value="Conversational">Conversational</option>
                    <option value="Elementary">Elementary</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteLang(lang.id)}
                  className="text-gray-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
