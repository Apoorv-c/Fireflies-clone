import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/lib/providers';
import { ToastProvider } from '@/components/ui/Toast';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';

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
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <ToastProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex-1 ml-[250px]">
                <TopBar />
                <main className="p-6">{children}</main>
              </div>
            </div>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
