'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FileText, Plus, Sparkles, Layers } from 'lucide-react';

export default function CvsDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">My CV Documents</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage customized resumes for different job applications.
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          New CV Document
        </Button>
      </div>

      <Card className="border-dashed border-2 bg-gray-50/50 text-center py-12">
        <CardContent className="space-y-3">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <CardTitle>CV Builder Module Ready for Phase 4</CardTitle>
          <CardDescription className="max-w-md mx-auto">
            Phase 4 will implement full CV creation, structured forms (experience, education, skills), 6 template
            layouts, live side-by-side preview, autosave, and PDF download.
          </CardDescription>
          <div className="pt-2">
            <Badge variant="default">Phase 4 Feature</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
