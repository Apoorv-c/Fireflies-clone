'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Search, Settings, Flame, Plus, Sparkles, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import CreateMeetingModal from '@/components/meetings/CreateMeetingModal';

const navItems = [
  { href: '/meetings', label: 'Notebook', icon: BookOpen },
  { href: '/search', label: 'Search All', icon: Search },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-[250px] bg-[#0f1222] border-r border-[#202540] flex flex-col z-50 shadow-2xl">
        {/* Logo & Workspace */}
        <div className="px-5 py-5 border-b border-[#202540]">
          <Link href="/meetings" className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-[#6C5CE7] to-[#a29bfe] rounded-xl flex items-center justify-center shadow-lg shadow-[#6C5CE7]/30">
              <Flame size={18} className="text-white fill-current" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-white tracking-tight">Fireflies</span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#6C5CE7]/20 text-[#a29bfe]">
                AI
              </span>
            </div>
          </Link>

          {/* Workspace Pill */}
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#161b33] border border-[#262c4f] text-xs text-[#a5accc]">
            <span className="font-medium truncate">My Workspace</span>
            <ChevronDown size={13} className="text-[#6c7499]" />
          </div>
        </div>

        {/* Quick Action: New Meeting */}
        <div className="px-4 pt-4 pb-2">
          <button
            onClick={() => setIsCreateOpen(true)}
            suppressHydrationWarning
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#6C5CE7] hover:bg-[#5a4bd6] text-white text-xs font-semibold shadow-md shadow-[#6C5CE7]/25 transition-all active:scale-95"
          >
            <Plus size={15} />
            <span>Add to Meeting</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150
                  ${isActive
                    ? 'bg-[#6C5CE7]/15 text-[#a29bfe] font-semibold border-l-2 border-[#6C5CE7]'
                    : 'text-[#8b8ba3] hover:text-[#e0e0e0] hover:bg-[#161a30]'
                  }`}
              >
                <item.icon size={17} className={isActive ? 'text-[#6C5CE7]' : ''} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* AI Fred Banner */}
        <div className="mx-3 my-2 p-3 rounded-xl bg-gradient-to-b from-[#1c1f38] to-[#14172b] border border-[#2a3059] text-xs">
          <div className="flex items-center gap-1.5 text-[#a29bfe] font-semibold mb-1">
            <Sparkles size={13} className="text-[#6C5CE7]" />
            <span>Fred AI Copilot</span>
          </div>
          <p className="text-[11px] text-[#8b8ba3] leading-relaxed">
            Open any meeting to ask Fred questions about the conversation.
          </p>
        </div>

        {/* User Profile Footer */}
        <div className="px-4 py-3.5 border-t border-[#202540] bg-[#0c0e1b]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6C5CE7] to-[#3498DB] flex items-center justify-center text-white font-bold text-xs shadow-sm">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">John Doe</p>
              <p className="text-[10px] text-[#6b7294] truncate">john@fireflies.ai</p>
            </div>
            <span className="text-[9px] font-bold uppercase px-1 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              Pro
            </span>
          </div>
        </div>
      </aside>

      <CreateMeetingModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </>
  );
}
