import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'CareerCraft — Build Your Professional CV & Portfolio',
  description:
    'Create stunning ATS-friendly CVs and personal portfolio websites without writing code. Multiple templates, live preview, and one-click publishing.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans antialiased text-slate-900 dark:text-slate-100 bg-[#f8fafc] dark:bg-[#0b1526] transition-colors duration-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
