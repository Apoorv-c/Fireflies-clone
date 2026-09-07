'use client';

import { useState } from 'react';
import { useMeetings } from '@/hooks/useMeetings';
import MeetingCard from '@/components/meetings/MeetingCard';
import MeetingFilters from '@/components/meetings/MeetingFilters';
import CreateMeetingModal from '@/components/meetings/CreateMeetingModal';
import { MeetingCardSkeleton } from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import { Plus, Mic } from 'lucide-react';

export default function MeetingsPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: meetings, isLoading } = useMeetings({
    search: search || undefined,
    sort_by: sortBy,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">My Meetings</h1>
          {meetings && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#6C5CE7]/15 text-[#6C5CE7] text-sm font-medium">
              {meetings.length}
            </span>
          )}
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus size={18} />
          New Meeting
        </Button>
      </div>

      {/* Filters */}
      <MeetingFilters
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
      />

      {/* Grid */}
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
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 rounded-full bg-[#6C5CE7]/10 flex items-center justify-center mb-4">
            <Mic size={36} className="text-[#6C5CE7]" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No meetings found</h2>
          <p className="text-[#8b8ba3] mb-6 text-center max-w-sm">
            {search ? 'Try adjusting your search or filters' : 'Create your first meeting to get started with Fireflies'}
          </p>
          {!search && (
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus size={18} />
              Create your first meeting
            </Button>
          )}
        </div>
      )}

      <CreateMeetingModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}
