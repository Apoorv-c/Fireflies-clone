'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Upload,
  Plus,
  ChevronRight,
  Settings,
  Flame,
  ArrowRight,
  Clock,
  Zap
} from 'lucide-react';
import { useMeetings } from '@/hooks/useMeetings';
import { useUIStore } from '@/lib/store';
import MeetingSettingsModal from '@/components/meetings/MeetingSettingsModal';

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
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const { data: meetings, isLoading } = useMeetings({ sort_by: 'newest' });
  const {
    setIsCreateModalOpen,
    isPremium,
    setIsUpgradeModalOpen,
    setUpgradeModalFeature,
    setIsLiveCaptureOpen,
  } = useUIStore();

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
            onClick={() => setIsCreateModalOpen(true, 'schedule')}
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
            onClick={() => setIsCreateModalOpen(true, 'upload')}
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

          {/* Card 3: Live Capture (Lavender / Pro) */}
          <button
            type="button"
            onClick={() => {
              if (!isPremium) {
                setUpgradeModalFeature('Live Capture');
                setIsUpgradeModalOpen(true);
              } else {
                setIsLiveCaptureOpen(true);
              }
            }}
            suppressHydrationWarning
            className="flex items-center justify-between p-4 rounded-xl bg-[#f5f3ff] hover:bg-[#ede9fe] border border-[#ede9fe] transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#ede9fe] flex items-center justify-center text-[#6C5CE7]">
                <Zap size={16} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-800 group-hover:text-slate-900">
                    Live Capture
                  </span>
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-white border border-[#6C5CE7]/30 text-[#6C5CE7] text-[10px] font-bold shadow-2xs">
                    <ProCrownBadge className="w-2.5 h-2.5" />
                    Pro
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Record in-person audio</p>
              </div>
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
          <button
            type="button"
            onClick={() => setIsSettingsModalOpen(true)}
            suppressHydrationWarning
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors font-medium px-2 py-1 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <Settings size={14} />
            <span>Settings</span>
          </button>
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

      {/* Meeting Settings Modal */}
      <MeetingSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
}
