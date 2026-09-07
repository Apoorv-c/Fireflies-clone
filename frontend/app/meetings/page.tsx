'use client';

import { useState, useMemo } from 'react';
import { useMeetings } from '@/hooks/useMeetings';
import MeetingCard from '@/components/meetings/MeetingCard';
import MeetingFilters from '@/components/meetings/MeetingFilters';
import CreateMeetingModal from '@/components/meetings/CreateMeetingModal';
import { MeetingCardSkeleton } from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import { Plus, Mic, Clock, CheckCircle, Calendar, Sparkles } from 'lucide-react';

export default function MeetingsPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [participant, setParticipant] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: meetings, isLoading } = useMeetings({
    search: search || undefined,
    sort_by: sortBy,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    participant: participant || undefined,
  });

  // Calculate high-level stats
  const stats = useMemo(() => {
    if (!meetings || meetings.length === 0) {
      return { total: 0, totalHours: 0, totalParticipants: 0 };
    }
    const totalSecs = meetings.reduce((acc, m) => acc + (m.duration_seconds || 0), 0);
    const totalParts = meetings.reduce((acc, m) => acc + (m.participants ? m.participants.length : 0), 0);
    return {
      total: meetings.length,
      totalHours: (totalSecs / 3600).toFixed(1),
      totalParticipants: totalParts,
    };
  }, [meetings]);

  return (
    <div className="max-w-7xl mx-auto space-y-6" suppressHydrationWarning>
      {/* Top Banner with Stats (Fireflies Notebook Dashboard) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Meeting Notebook</h1>
            <span className="px-2 py-0.5 rounded-full bg-[#6C5CE7]/20 text-[#a29bfe] text-xs font-semibold">
              Live Workspace
            </span>
          </div>
          <p className="text-xs text-[#8b8ba3]">
            Browse all transcripts, audio recordings, and AI-generated notes
          </p>
        </div>

        <Button onClick={() => setIsCreateOpen(true)} className="shadow-lg shadow-[#6C5CE7]/25">
          <Plus size={16} />
          <span>New Meeting</span>
        </Button>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-[#121526] border border-[#232845] rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#6C5CE7]/15 flex items-center justify-center text-[#6C5CE7]">
            <Mic size={18} />
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#8b8ba3] uppercase tracking-wider">Total Meetings</p>
            <p className="text-lg font-bold text-white">{isLoading ? '...' : stats.total}</p>
          </div>
        </div>

        <div className="bg-[#121526] border border-[#232845] rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
            <Clock size={18} />
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#8b8ba3] uppercase tracking-wider">Recorded Time</p>
            <p className="text-lg font-bold text-white">{isLoading ? '...' : `${stats.totalHours} hrs`}</p>
          </div>
        </div>

        <div className="bg-[#121526] border border-[#232845] rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#8b8ba3] uppercase tracking-wider">AI Summaries</p>
            <p className="text-lg font-bold text-white">{isLoading ? '...' : `${stats.total} Ready`}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs: All Meetings vs My Meetings */}
      <div className="flex items-center gap-2 border-b border-[#232845] pb-2">
        <button
          onClick={() => setActiveTab('all')}
          suppressHydrationWarning
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-[#1e233d] text-white border border-[#313860]'
              : 'text-[#8b8ba3] hover:text-white'
          }`}
        >
          All Meetings ({stats.total})
        </button>
        <button
          onClick={() => setActiveTab('mine')}
          suppressHydrationWarning
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'mine'
              ? 'bg-[#1e233d] text-white border border-[#313860]'
              : 'text-[#8b8ba3] hover:text-white'
          }`}
        >
          My Meetings
        </button>
      </div>

      {/* Filter and Search Bar */}
      <MeetingFilters
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        participant={participant}
        onParticipantChange={setParticipant}
      />

      {/* Meetings Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <MeetingCardSkeleton key={i} />
          ))}
        </div>
      ) : meetings && meetings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-[#121526]/50 border border-dashed border-[#232845] rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-[#6C5CE7]/15 flex items-center justify-center mb-3">
            <Mic size={28} className="text-[#6C5CE7]" />
          </div>
          <h2 className="text-base font-semibold text-white mb-1">No meetings found</h2>
          <p className="text-xs text-[#8b8ba3] mb-5 text-center max-w-sm">
            {search || participant || dateFrom
              ? 'Try adjusting your search query or removing filters.'
              : 'Create or upload your first transcript to get started with Fireflies.'}
          </p>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus size={15} />
            <span>Add New Meeting</span>
          </Button>
        </div>
      )}

      {/* Create Modal */}
      <CreateMeetingModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}
