import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-gray-900">CareerCraft</span>
            </div>
            <p className="text-sm text-gray-500 max-w-sm">
              The modern platform for professionals, developers, designers, and students to build ATS-friendly CVs and
              showcase their portfolio websites without writing code.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/#cv-templates" className="hover:text-indigo-600 transition-colors">
                  CV Builder
                </Link>
              </li>
              <li>
                <Link href="/#portfolio-templates" className="hover:text-indigo-600 transition-colors">
                  Portfolio Websites
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-indigo-600 transition-colors">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Architecture</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Next.js App Router &amp; Tailwind</li>
              <li>NestJS Modular Backend</li>
              <li>MySQL &amp; Prisma ORM</li>
              <li>JWT Secure HTTP-Only Auth</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} CareerCraft Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with production quality &amp; clean full-stack architecture.
          </p>
        </div>
      </div>
    </footer>
  );
}
