'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { PublicPortfolioData } from '@/types/portfolio';
import { PortfolioRenderer } from '@/components/portfolio-templates/PortfolioRenderer';
import { Button } from '@/components/ui/Button';
import { Sparkles, Globe, Lock, ArrowLeft, Loader2 } from 'lucide-react';

export default function PublicPortfolioPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [data, setData] = useState<PublicPortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    api
      .get<{ portfolio: PublicPortfolioData }>(`/public/portfolios/${slug}`)
      .then((res) => {
        if (mounted && res?.portfolio) {
          setData(res.portfolio);
        }
      })
      .catch((err: any) => {
        if (mounted) {
          setError(err.message || 'Portfolio not found or is currently private.');
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm font-medium text-gray-400">Loading portfolio...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 p-8 shadow-sm space-y-5">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Portfolio Not Available</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              The portfolio <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">/{slug}</code> does not
              exist or is currently set to private by its owner.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <Link href="/">
              <Button variant="outline" className="w-full" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Go to CareerCraft Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <PortfolioRenderer data={data} templateSlug={data.template?.slug} />;
}
