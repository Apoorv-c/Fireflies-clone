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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <QueryProvider>
          <ToastProvider>
            <div className="flex min-h-screen bg-[#ffffff]">
              <Sidebar />
              <div className="flex-1 ml-[56px] min-w-0 min-h-screen flex flex-col bg-[#ffffff]">
                <TopBar />
                <main className="flex-1 p-6 md:p-8">{children}</main>
              </div>

              {/* Floating Help / Support Button (Bottom Right) */}
              <button
                type="button"
                title="Help & Support"
                suppressHydrationWarning
                className="fixed right-6 bottom-6 w-9 h-9 rounded-full bg-[#3b176d] hover:bg-[#4c208c] text-white flex items-center justify-center font-bold text-sm shadow-lg transition-transform hover:scale-105 active:scale-95 z-40"
              >
                ?
              </button>
            </div>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
