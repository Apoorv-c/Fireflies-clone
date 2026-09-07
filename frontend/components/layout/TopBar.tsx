'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Bell, Video, ChevronDown, Sparkles, CheckSquare, Bot, ArrowRight, Menu } from 'lucide-react';
import { useUIStore } from '@/lib/store';
import { useRouter, usePathname } from 'next/navigation';
import UserAvatar from '@/components/ui/UserAvatar';

export default function TopBar() {
  const { searchQuery, setSearchQuery, setIsCreateModalOpen, setIsAccountModalOpen, setMobileMenuOpen, isPremium } = useUIStore();
  const router = useRouter();
  const pathname = usePathname();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Q3 Product Roadmap Review',
      desc: 'AI transcript and meeting summary are ready',
      time: '15m ago',
      unread: true,
      href: '/meetings/1',
      icon: Sparkles,
      iconColor: 'text-[#6C5CE7] bg-purple-50',
    },
    {
      id: 2,
      title: 'Action Item Assigned',
      desc: 'Review tiered API rate limiting structure',
      time: '2h ago',
      unread: true,
      href: '/meetings/1',
      icon: CheckSquare,
      iconColor: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 3,
      title: 'Fred AI Assistant',
      desc: 'Generated chapter timeline for Sprint Planning',
      time: '1d ago',
      unread: true,
      href: '/meetings/2',
      icon: Bot,
      iconColor: 'text-blue-600 bg-blue-50',
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (href: string, id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
    setIsNotificationsOpen(false);
    router.push(href);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    if (isNotificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotificationsOpen]);

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
    if (pathname === '/plan') return 'Plan';
    return 'Fireflies AI';
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 px-3.5 sm:px-7 py-2.5 sm:py-3">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Drawer Trigger & Page Title */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            title="Open navigation menu"
            className="p-1.5 -ml-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden cursor-pointer flex-shrink-0"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-sm sm:text-base font-semibold text-slate-800 tracking-tight truncate">
            {getPageTitle()}
          </h1>
        </div>

        {/* Center: Search Box with Ctrl + K */}
        <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-1.5 sm:mx-4">
          <div className="relative">
            <Search size={15} className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title or keyword"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              suppressHydrationWarning
              className="w-full pl-8 sm:pl-9 pr-3 sm:pr-16 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7] transition-all"
            />
            <kbd className="hidden sm:block absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs pointer-events-none">
              Ctrl + K
            </kbd>
          </div>
        </form>

        {/* Right Actions: Free Meetings badge, Notifications Bell & Capture */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          {/* Free Meetings Pill / Pro Active badge */}
          <button
            type="button"
            onClick={() => router.push('/plan')}
            title="View Plans & Upgrade"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <span className={`text-white text-[10px] font-bold px-1.5 py-0.5 rounded leading-none ${isPremium ? 'bg-[#6C5CE7]' : 'bg-[#10B981]'}`}>
              {isPremium ? 'PRO' : '3'}
            </span>
            <span className="text-slate-600 text-xs font-medium">
              {isPremium ? 'Business Active' : 'Free meetings'}
            </span>
          </button>

          {/* Notification Bell with Working Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              suppressHydrationWarning
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-92 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="bg-[#6C5CE7] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-[11px] text-[#6C5CE7] hover:underline font-medium cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-100">
                  {notifications.map((n) => {
                    const Icon = n.icon;
                    return (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n.href, n.id)}
                        className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 ${
                          n.unread ? 'bg-purple-50/20' : ''
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${n.iconColor}`}>
                          <Icon size={15} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <p className={`text-xs font-semibold truncate ${n.unread ? 'text-slate-900' : 'text-slate-700'}`}>
                              {n.title}
                            </p>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{n.desc}</p>
                        </div>
                        {n.unread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#6C5CE7] mt-1.5 flex-shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="p-2.5 border-t border-slate-100 bg-slate-50/50 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNotificationsOpen(false);
                      router.push('/meetings');
                    }}
                    className="text-xs text-[#6C5CE7] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all meeting updates</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Purple Capture Dropdown Button */}
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            suppressHydrationWarning
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#6C5CE7] hover:bg-[#5a4bd6] text-white text-xs font-semibold shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer"
          >
            <Video size={14} className="fill-current" />
            <span>Capture</span>
            <ChevronDown size={13} className="opacity-80" />
          </button>

          {/* User Account Avatar Button */}
          <button
            type="button"
            onClick={() => setIsAccountModalOpen(true)}
            title="My Account"
            suppressHydrationWarning
            className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center hover:ring-2 hover:ring-[#6C5CE7]/40 transition-all cursor-pointer shadow-xs ml-1"
          >
            <UserAvatar size="sm" showProBadge={true} />
          </button>
        </div>
      </div>
    </header>
  );
}
