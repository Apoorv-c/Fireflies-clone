'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import UpgradeModal from '@/components/ui/UpgradeModal';
import LiveCaptureModal from '@/components/meetings/LiveCaptureModal';

export default function AppLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSettings = pathname === '/settings' || pathname.startsWith('/settings');

  return (
    <div suppressHydrationWarning className="flex min-h-screen bg-[#ffffff]">
      {!isSettings && <Sidebar />}
      <div suppressHydrationWarning className={`flex-1 ${isSettings ? 'ml-0' : 'ml-[56px]'} min-w-0 min-h-screen flex flex-col bg-[#ffffff]`}>
        {!isSettings && <TopBar />}
        <main suppressHydrationWarning className={`flex-1 ${isSettings ? 'p-0' : 'p-6 md:p-8'}`}>{children}</main>
      </div>

      {/* Global Modals for Pro Features & Live Capture */}
      <UpgradeModal />
      <LiveCaptureModal />

      {/* Floating Help / Support Button (Bottom Right) */}
      <button
        type="button"
        title="Help and Support"
        suppressHydrationWarning
        onClick={() => {
          window.dispatchEvent(new CustomEvent('open-fireflies-help'));
        }}
        className="fixed right-6 bottom-6 w-9 h-9 rounded-full bg-[#3b176d] hover:bg-[#4c208c] text-white flex items-center justify-center font-bold text-sm shadow-lg transition-transform hover:scale-105 active:scale-95 z-40 cursor-pointer"
      >
        ?
      </button>
    </div>
  );
}
