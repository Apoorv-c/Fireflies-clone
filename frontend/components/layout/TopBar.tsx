'use client';

import { Search, Bell } from 'lucide-react';
import { useUIStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function TopBar() {
  const { searchQuery, setSearchQuery } = useUIStore();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#1e1e3a] border-b border-[#2a2a4a] px-6 py-3">
      <div className="flex items-center justify-between">
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b8a]" />
            <input
              type="text"
              placeholder="Search meetings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              suppressHydrationWarning
              className="w-full pl-10 pr-4 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-sm text-[#e0e0e0] placeholder-[#6b6b8a] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/50 focus:border-[#6C5CE7] transition-all"
            />
          </div>
        </form>

        <div className="flex items-center gap-3">
          <button suppressHydrationWarning className="p-2 rounded-lg text-[#8b8ba3] hover:text-[#e0e0e0] hover:bg-[#2a2a4a] transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#6C5CE7] rounded-full" />
          </button>
          <div className="w-8 h-8 rounded-full bg-[#6C5CE7] flex items-center justify-center text-white font-semibold text-xs">
            JD
          </div>
        </div>
      </div>
    </header>
  );
}
