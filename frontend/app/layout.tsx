import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/lib/providers';
import { ToastProvider } from '@/components/ui/Toast';
import AppLayoutClient from '@/components/layout/AppLayoutClient';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fireflies - Meeting Notes & Transcription',
  description: 'AI-powered meeting notes, transcription, and action items',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <QueryProvider>
          <ToastProvider>
            <AppLayoutClient>{children}</AppLayoutClient>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
