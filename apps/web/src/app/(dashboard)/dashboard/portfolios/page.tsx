'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Globe, Plus } from 'lucide-react';

export default function PortfoliosDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Personal Portfolios</h1>
          <p className="text-sm text-gray-500 mt-1">
            Build and publish personal developer or design portfolio websites with unique URLs.
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          Create Portfolio
        </Button>
      </div>

      <Card className="border-dashed border-2 bg-gray-50/50 text-center py-12">
        <CardContent className="space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Globe className="w-6 h-6" />
          </div>
          <CardTitle>Portfolio Builder Module Ready for Phase 5</CardTitle>
          <CardDescription className="max-w-md mx-auto">
            Phase 5 will implement full portfolio CRUD, 6 portfolio themes, project showcase, slug reservation,
            and public URL routing at /p/[slug].
          </CardDescription>
          <div className="pt-2">
            <Badge variant="success">Phase 5 Feature</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
