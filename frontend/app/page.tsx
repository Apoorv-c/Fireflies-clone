'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Upload,
  Plus,
  ChevronRight,
  Settings,
  Monitor,
  Smartphone,
  Download,
  Flame,
  ArrowRight,
  Clock
} from 'lucide-react';
import { useMeetings } from '@/hooks/useMeetings';
import { useUIStore } from '@/lib/store';

function formatMeetingDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }) + ', ' + d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'recent' | 'upcoming' | 'ai-feed'>('recent');
  const { data: meetings, isLoading } = useMeetings({ sort_by: 'newest' });
  const { setIsCreateModalOpen } = useUIStore();

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-2" suppressHydrationWarning>
      {/* 1. Quick Start Section */}
      <section>
        <h2 className="text-base font-bold text-slate-900 tracking-tight mb-0.5">
          Quick Start
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Capture your first meeting or upload a recording to see Fireflies in action.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Card 1: Schedule Meeting (Pink) */}
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            suppressHydrationWarning
            className="flex items-center justify-between p-4 rounded-xl bg-[#fdf2f4] hover:bg-[#fde7eb] border border-[#fce7ea] transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#fce7ea] flex items-center justify-center text-[#e11d48]">
                <Calendar size={16} />
              </div>
              <span className="text-xs font-semibold text-slate-800 group-hover:text-slate-900">
                Schedule Meeting
              </span>
            </div>
            <ChevronRight size={15} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Card 2: Upload File (Mint) */}
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            suppressHydrationWarning
            className="flex items-center justify-between p-4 rounded-xl bg-[#ecfdf5] hover:bg-[#d1fae5] border border-[#d1fae5] transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#d1fae5] flex items-center justify-center text-[#059669]">
                <Upload size={16} />
              </div>
              <span className="text-xs font-semibold text-slate-800 group-hover:text-slate-900">
                Upload File
              </span>
            </div>
            <ChevronRight size={15} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Card 3: Capture Meeting (Lavender) */}
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            suppressHydrationWarning
            className="flex items-center justify-between p-4 rounded-xl bg-[#f5f3ff] hover:bg-[#ede9fe] border border-[#ede9fe] transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#ede9fe] flex items-center justify-center text-[#6C5CE7]">
                <Plus size={16} />
              </div>
              <span className="text-xs font-semibold text-slate-800 group-hover:text-slate-900">
                Capture Meeting
              </span>
            </div>
            <ChevronRight size={15} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* 2. Tabs & Meeting List */}
      <section className="pt-2">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-3">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/70 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('recent')}
              suppressHydrationWarning
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeTab === 'recent'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Recent
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('upcoming')}
              suppressHydrationWarning
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upcoming
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ai-feed')}
              suppressHydrationWarning
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeTab === 'ai-feed'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              AI Feed
            </button>
          </div>

          {/* Settings button on the right */}
          <Link
            href="/settings"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors font-medium px-2 py-1 rounded-lg hover:bg-slate-100"
          >
            <Settings size={14} />
            <span>Settings</span>
          </Link>
        </div>

        {/* Meetings List */}
        {isLoading ? (
          <div className="space-y-3 py-4">
            <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        ) : meetings && meetings.length > 0 ? (
          <div className="space-y-1.5">
            {meetings.map((m) => (
              <Link
                key={m.id}
                href={`/meetings/${m.id}`}
                className="flex items-center justify-between p-3.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-all group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Fireflies Stylized Logo Mark */}
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6C5CE7] to-[#e84393] flex items-center justify-center text-white shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Flame size={16} className="fill-current" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xs font-semibold text-slate-800 group-hover:text-[#6C5CE7] transition-colors truncate">
                      {m.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5" suppressHydrationWarning>
                      {formatMeetingDate(m.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                    <Clock size={12} />
                    <span>{Math.floor((m.duration_seconds || 0) / 60)}m</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
                </div>
              </Link>
            ))}

            <div className="pt-2">
              <Link
                href="/meetings"
                className="inline-flex items-center gap-1 text-xs text-[#6C5CE7] hover:underline font-semibold"
              >
                <span>View all meetings in Notebook</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400">
            <p className="text-xs">No recent meetings. Click &apos;Capture Meeting&apos; to get started.</p>
          </div>
        )}
      </section>

      {/* 3. Try More Section */}
      <section className="pt-4">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-3">
          Try More
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Desktop App */}
          <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
                <Monitor size={18} strokeWidth={2} />
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">
                Desktop App
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Capture conversations without any bot present in your meeting.
              </p>
            </div>

            <div className="pt-5">
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => alert('Download link for Windows / Mac Desktop app')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#6C5CE7] hover:bg-[#5a4bd6] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Download size={14} />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Card 2: Mobile App */}
          <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center mb-3">
                <Smartphone size={18} strokeWidth={2} />
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">
                Mobile App
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Record in-person conversations and review meetings on the go.
              </p>
            </div>

            <div className="pt-5 flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs font-bold text-xs" title="Apple App Store">
                🍎
              </div>
              <div className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs font-bold text-xs" title="Google Play Store">
                ▶️
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
