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
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col font-sans antialiased text-gray-900 bg-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
