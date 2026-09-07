'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mic, Search, Settings, Flame } from 'lucide-react';

const navItems = [
  { href: '/meetings', label: 'Meetings', icon: Mic },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[250px] bg-[#1a1a2e] border-r border-[#2a2a4a] flex flex-col z-50">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-[#2a2a4a]">
        <Link href="/meetings" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#6C5CE7] rounded-lg flex items-center justify-center">
            <Flame size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">Fireflies</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-[#6C5CE7]/15 text-[#6C5CE7]'
                  : 'text-[#8b8ba3] hover:text-[#e0e0e0] hover:bg-[#2a2a4a]'
                }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Profile */}
      <div className="px-3 py-4 border-t border-[#2a2a4a]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-full bg-[#6C5CE7] flex items-center justify-center text-white font-semibold text-sm">
            JD
          </div>
          <div>
            <p className="text-sm font-medium text-[#e0e0e0]">John Doe</p>
            <p className="text-xs text-[#8b8ba3]">john@fireflies.ai</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
