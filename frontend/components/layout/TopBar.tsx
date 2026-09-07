'use client';

import { Search, Bell, Video, ChevronDown } from 'lucide-react';
import { useUIStore } from '@/lib/store';
import { useRouter, usePathname } from 'next/navigation';

export default function TopBar() {
  const { searchQuery, setSearchQuery, setIsCreateModalOpen } = useUIStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Determine header page title
  const getPageTitle = () => {
    if (pathname === '/') return 'Home';
    if (pathname.startsWith('/meetings/')) return 'Meeting Notebook';
    if (pathname === '/meetings') return 'Notebook';
    if (pathname === '/search') return 'Search All';
    if (pathname === '/settings') return 'Settings';
    return 'Fireflies AI';
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 px-7 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Page Title */}
        <div className="flex items-center gap-2">
          <h1 className="text-base font-semibold text-slate-800 tracking-tight">
            {getPageTitle()}
          </h1>
        </div>

        {/* Center: Search Box with Ctrl + K */}
        <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-4">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title or keyword"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              suppressHydrationWarning
              className="w-full pl-9 pr-16 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7] transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs pointer-events-none">
              Ctrl + K
            </kbd>
          </div>
        </form>

        {/* Right Actions: Free meetings, Upgrade, Notifications, Capture */}
        <div className="flex items-center gap-3">
          {/* Free Meetings Counter */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <span className="w-5 h-5 rounded bg-emerald-500 text-white flex items-center justify-center font-bold text-[11px] shadow-2xs">
              3
            </span>
            <span>Free meetings</span>
          </div>

          {/* Upgrade Button */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => router.push('/settings')}
            className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 text-xs font-semibold transition-all active:scale-95"
          >
            Upgrade
          </button>

          {/* Notification Bell with Red Dot */}
          <button
            type="button"
            suppressHydrationWarning
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {/* Purple Capture Dropdown Button */}
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            suppressHydrationWarning
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6C5CE7] hover:bg-[#5a4bd6] text-white text-xs font-semibold shadow-xs hover:shadow transition-all active:scale-95"
          >
            <Video size={14} className="fill-current" />
            <span>Capture</span>
            <ChevronDown size={13} className="opacity-80" />
          </button>
        </div>
      </div>
    </header>
  );
}
