'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Bot,
  Video,
  AlignLeft,
  Sparkles,
  BarChart2,
  Layers,
  Zap,
  UserPlus,
  Settings,
  FolderTree
} from 'lucide-react';
import { useUIStore } from '@/lib/store';
import CreateMeetingModal from '@/components/meetings/CreateMeetingModal';

interface NavDockItem {
  href: string;
  label: string;
  icon: React.ElementType;
  hasDot?: boolean;
}

function IntegrationsStackIcon({ size = 18, strokeWidth = 1.75, className }: { size?: number; strokeWidth?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3.5 L20.5 7.8 L12 12.2 L3.5 7.8 Z" />
      <path d="M3.5 12.2 L12 16.5 L20.5 12.2" />
      <path d="M3.5 16.5 L12 20.8 L20.5 16.5" />
    </svg>
  );
}

const mainNavItems: NavDockItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/meetings', label: 'Meetings', icon: Video },
  { href: '/search', label: 'Transcripts & Search', icon: AlignLeft },
  { href: '/meetings/1', label: 'Fred AI Assistant', icon: Bot },
  { href: '/meetings', label: 'AI Summaries', icon: Sparkles },
  { href: '/meetings', label: 'Analytics', icon: BarChart2 },
  { href: '/integrations', label: 'Integrations', icon: IntegrationsStackIcon },
  { href: '/meetings', label: 'Live Capture', icon: Zap, hasDot: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isCreateModalOpen, setIsCreateModalOpen } = useUIStore();

  return (
    <>
      <aside suppressHydrationWarning className="fixed left-0 top-0 h-screen w-[56px] bg-white border-r border-slate-200/80 flex flex-col items-center py-3 z-50 select-none shadow-[1px_0_4px_rgba(0,0,0,0.02)]">
        {/* Workspace Brand Avatar */}
        <Link
          href="/"
          title="Workspace Home"
          suppressHydrationWarning
          className="w-8 h-8 rounded-lg bg-[#6C5CE7] hover:bg-[#5a4bd6] flex items-center justify-center text-white font-bold text-sm shadow-sm transition-all mb-4"
        >
          A
        </Link>

        {/* Top Navigation Icons */}
        <nav suppressHydrationWarning className="flex-1 w-full flex flex-col items-center gap-1.5 px-2">
          {mainNavItems.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                title={item.label}
                suppressHydrationWarning
                className={`relative w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150 group
                  ${isActive
                    ? 'bg-slate-100 text-[#6C5CE7] font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.75} />

                {item.hasDot && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                )}

                {/* Subtle Hover Tooltip */}
                <span className="absolute left-[54px] px-2 py-1 bg-slate-900 text-white text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 shadow-md">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div suppressHydrationWarning className="w-full flex flex-col items-center gap-1.5 px-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            title="Invite Teammates"
            suppressHydrationWarning
            onClick={() => setIsCreateModalOpen(true)}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors group relative cursor-pointer"
          >
            <UserPlus size={17} strokeWidth={1.75} />
            <span className="absolute left-[54px] px-2 py-1 bg-slate-900 text-white text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 shadow-md">
              Invite Teammates
            </span>
          </button>

          <Link
            href="/settings"
            title="Workspaces"
            suppressHydrationWarning
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors group relative"
          >
            <FolderTree size={17} strokeWidth={1.75} />
            <span className="absolute left-[54px] px-2 py-1 bg-slate-900 text-white text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 shadow-md">
              Workspaces
            </span>
          </Link>

          <Link
            href="/settings"
            title="Settings"
            suppressHydrationWarning
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all group relative ${
              pathname.startsWith('/settings')
                ? 'bg-[#f0edfd] text-[#6C5CE7] shadow-xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Settings size={18} strokeWidth={pathname.startsWith('/settings') ? 2.2 : 1.75} />
            <span className="absolute left-[54px] px-2 py-1 bg-slate-900 text-white text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 shadow-md">
              Settings
            </span>
          </Link>
        </div>
      </aside>

      <CreateMeetingModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </>
  );
}
