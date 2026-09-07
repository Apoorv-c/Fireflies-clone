'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import UpgradeModal from '@/components/ui/UpgradeModal';
import LiveCaptureModal from '@/components/meetings/LiveCaptureModal';
import HelpSupportModal from '@/components/ui/HelpSupportModal';

export default function AppLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSettings = pathname === '/settings' || pathname.startsWith('/settings');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    const handleOpenHelp = () => setIsHelpOpen(true);
    window.addEventListener('open-fireflies-help', handleOpenHelp);
    return () => window.removeEventListener('open-fireflies-help', handleOpenHelp);
  }, []);

  return (
    <div suppressHydrationWarning className="flex min-h-screen bg-[#ffffff]">
      {!isSettings && <Sidebar />}
      <div suppressHydrationWarning className={`flex-1 ${isSettings ? 'ml-0' : 'ml-[56px]'} min-w-0 min-h-screen flex flex-col bg-[#ffffff]`}>
        {!isSettings && <TopBar />}
        <main suppressHydrationWarning className={`flex-1 ${isSettings ? 'p-0' : 'p-6 md:p-8'}`}>{children}</main>
      </div>

      {/* Global Modals for Pro Features, Live Capture & Help */}
      <UpgradeModal />
      <LiveCaptureModal />
      <HelpSupportModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Floating Help / Support Button (Bottom Right) matching Fireflies UI */}
      <button
        type="button"
        title="Help and Support"
        suppressHydrationWarning
        onClick={() => setIsHelpOpen(true)}
        className="fixed right-6 bottom-6 w-9 h-9 rounded-full bg-white hover:bg-slate-50 text-slate-900 border border-slate-200/90 flex items-center justify-center font-bold text-sm shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.16)] transition-all duration-150 hover:scale-105 active:scale-95 z-40 cursor-pointer"
      >
        ?
      </button>
    </div>
  );
}
