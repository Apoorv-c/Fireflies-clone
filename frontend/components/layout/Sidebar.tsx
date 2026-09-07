'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  FolderTree,
  User,
  Camera,
  Crown,
  ChevronRight,
  X,
  Plus
} from 'lucide-react';
import { useUIStore } from '@/lib/store';
import CreateMeetingModal from '@/components/meetings/CreateMeetingModal';
import AccountModal from '@/components/account/AccountModal';
import UserAvatar from '@/components/ui/UserAvatar';

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

function TasksIcon({ size = 18, strokeWidth = 2, className }: { size?: number; strokeWidth?: number; className?: string }) {
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
      <line x1="4" y1="6" x2="18" y2="6" />
      <line x1="4" y1="12" x2="18" y2="12" />
      <line x1="4" y1="18" x2="12" y2="18" />
      <polyline points="15 17 18 20 23 14" />
    </svg>
  );
}

const mainNavItems: NavDockItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/meetings', label: 'Meetings', icon: Video },
  { href: '/tasks', label: 'Tasks', icon: TasksIcon },
  { href: '/search', label: 'Transcripts & Search', icon: AlignLeft },
  { href: '/meetings/1', label: 'Fred AI Assistant', icon: Bot },
  { href: '/integrations', label: 'Integrations', icon: IntegrationsStackIcon },
  { href: '/meetings', label: 'Analytics', icon: BarChart2 },
  { href: '/meetings', label: 'Live Capture', icon: Zap, hasDot: true },
];

function ProCrownBadge({ className = "w-2.5 h-2.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 13 11" fill="none" className={className}>
      <path
        d="M1 9.5H12M1.5 7.5L1 2L4.5 4.8L6.5 1.5L8.5 4.8L12 2L11.5 7.5H1.5Z"
        fill="#6C5CE7"
        stroke="#6C5CE7"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    isPremium,
    setIsUpgradeModalOpen,
    setUpgradeModalFeature,
    setIsLiveCaptureOpen,
    userProfile,
    isAccountModalOpen,
    setIsAccountModalOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
  } = useUIStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    if (isAccountMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAccountMenuOpen]);

  return (
    <>
      <aside suppressHydrationWarning className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-[56px] bg-white border-r border-slate-200/80 items-center py-3 z-50 select-none shadow-[1px_0_4px_rgba(0,0,0,0.02)]">
        {/* Workspace Brand / User Account Avatar */}
        <div className="relative mb-4" ref={accountMenuRef}>
          <button
            type="button"
            onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
            title="Account & Profile"
            suppressHydrationWarning
            className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-xs hover:ring-2 hover:ring-[#6C5CE7]/50 transition-all cursor-pointer group"
          >
            <UserAvatar size="md" showProBadge={true} />
          </button>

          {/* Quick Tooltip */}
          {!isAccountMenuOpen && (
            <span className="absolute left-[54px] top-1 px-2 py-1 bg-slate-900 text-white text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 shadow-md">
              Account: {userProfile.name}
            </span>
          )}

          {/* Account Flyout Menu */}
          {isAccountMenuOpen && (
            <div className="absolute left-[54px] top-0 w-64 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden py-1.5 animate-in fade-in slide-in-from-left-2 duration-150">
              <div className="px-3.5 py-2.5 border-b border-slate-100 flex items-center gap-3">
                <UserAvatar size="md" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">{userProfile.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{userProfile.email}</p>
                  <div className="mt-1">
                    {isPremium ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#6C5CE7] bg-purple-50 px-1.5 py-0.5 rounded-full">
                        <Crown size={9} /> Pro Plan
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-400">Free Plan</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-1 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsAccountMenuOpen(false);
                    router.push('/settings?tab=account');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <User size={15} className="text-[#6C5CE7]" />
                  <span>Account & Profile Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsAccountMenuOpen(false);
                    setIsAccountModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <Camera size={15} className="text-slate-400" />
                  <span>Change Profile Photo...</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsAccountMenuOpen(false);
                    router.push('/settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <Settings size={15} className="text-slate-400" />
                  <span>Workspace Settings</span>
                </button>
              </div>

              <div className="p-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAccountMenuOpen(false);
                    setIsAccountModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer text-left"
                >
                  <span>More Options</span>
                  <ChevronRight size={13} className="text-slate-400" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Top Navigation Icons */}
        <nav suppressHydrationWarning className="flex-1 w-full flex flex-col items-center gap-1.5 px-2">
          {mainNavItems.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            const Icon = item.icon;

            if (item.label === 'Live Capture') {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    if (!isPremium) {
                      setUpgradeModalFeature('Live Capture');
                      setIsUpgradeModalOpen(true);
                    } else {
                      setIsLiveCaptureOpen(true);
                    }
                  }}
                  title={!isPremium ? 'Live Capture 👑 (Pro Plan)' : 'Live Capture (Ready)'}
                  suppressHydrationWarning
                  className={`relative w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150 group cursor-pointer ${
                    !isPremium
                      ? 'text-slate-500 hover:text-[#6C5CE7] hover:bg-[#f4f0fd]'
                      : 'text-[#6C5CE7] bg-purple-50 hover:bg-purple-100 shadow-xs'
                  }`}
                >
                  <Icon size={18} strokeWidth={1.75} />

                  {/* Pro Crown Badge indicator */}
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#f4f0fd] border border-[#6C5CE7]/30 flex items-center justify-center shadow-2xs">
                    <ProCrownBadge className="w-2 h-2" />
                  </span>

                  {/* Subtle Hover Tooltip */}
                  <span className="absolute left-[54px] px-2 py-1 bg-slate-900 text-white text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 shadow-md">
                    {!isPremium ? 'Live Capture 👑 (Pro Plan)' : 'Live Capture (Ready)'}
                  </span>
                </button>
              );
            }

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

      {/* Mobile Bottom Navigation Dock */}
      <nav
        aria-label="Mobile navigation"
        suppressHydrationWarning
        className="flex md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-md border-t border-slate-200/90 z-40 px-2 items-center justify-around shadow-[0_-2px_12px_rgba(0,0,0,0.05)] select-none"
      >
        <Link
          href="/"
          suppressHydrationWarning
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors ${
            pathname === '/' ? 'text-[#6C5CE7] font-semibold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home size={18} strokeWidth={pathname === '/' ? 2.4 : 1.8} />
          <span className="text-[10px] mt-0.5 font-medium">Home</span>
        </Link>

        <Link
          href="/meetings"
          suppressHydrationWarning
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors ${
            pathname.startsWith('/meetings') ? 'text-[#6C5CE7] font-semibold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Video size={18} strokeWidth={pathname.startsWith('/meetings') ? 2.4 : 1.8} />
          <span className="text-[10px] mt-0.5 font-medium">Notebook</span>
        </Link>

        {/* Center Floating Plus Capture Button */}
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          suppressHydrationWarning
          className="w-10 h-10 -mt-4 rounded-full bg-[#6C5CE7] hover:bg-[#5a4bd6] text-white flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer border-2 border-white ring-2 ring-purple-100"
          title="Capture / Schedule Meeting"
        >
          <Plus size={20} strokeWidth={2.5} />
        </button>

        <Link
          href="/tasks"
          suppressHydrationWarning
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors ${
            pathname === '/tasks' ? 'text-[#6C5CE7] font-semibold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <TasksIcon size={18} />
          <span className="text-[10px] mt-0.5 font-medium">Tasks</span>
        </Link>

        <button
          type="button"
          onClick={() => setIsAccountModalOpen(true)}
          suppressHydrationWarning
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-500 hover:text-slate-900 cursor-pointer"
        >
          <UserAvatar size="sm" showProBadge={true} />
          <span className="text-[10px] mt-0.5 text-slate-600 font-medium">Account</span>
        </button>
      </nav>

      {/* Mobile Slide-out Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden" suppressHydrationWarning>
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col justify-between p-4 z-10 animate-in slide-in-from-left duration-200">
            <div>
              {/* Drawer Top Header with Profile */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <div
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAccountModalOpen(true);
                  }}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <UserAvatar size="md" showProBadge={true} />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{userProfile.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{userProfile.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Navigation links */}
              <div className="space-y-1 py-3 overflow-y-auto max-h-[calc(100vh-180px)]">
                {mainNavItems.map((item) => {
                  const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                  const Icon = item.icon;

                  if (item.label === 'Live Capture') {
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          if (!isPremium) {
                            setUpgradeModalFeature('Live Capture');
                            setIsUpgradeModalOpen(true);
                          } else {
                            setIsLiveCaptureOpen(true);
                          }
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors text-left ${
                          isPremium
                            ? 'bg-purple-50 text-[#6C5CE7] font-semibold'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon size={18} className="text-[#6C5CE7]" />
                        <span className="flex-1">Live Capture</span>
                        {!isPremium && <ProCrownBadge className="w-2 h-2" />}
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-purple-50 text-[#6C5CE7] font-semibold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'text-[#6C5CE7]' : 'text-slate-400'} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions inside Drawer */}
            <div className="pt-3 border-t border-slate-100 space-y-1">
              <Link
                href="/settings?tab=account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <User size={17} className="text-[#6C5CE7]" />
                <span>Account & Profile</span>
              </Link>

              <Link
                href="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Settings size={17} className="text-slate-400" />
                <span>Workspace Settings</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <CreateMeetingModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <AccountModal isOpen={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} />
    </>
  );
}
