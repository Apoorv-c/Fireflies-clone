'use client';

import { Search, SortAsc } from 'lucide-react';

interface MeetingFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  dateFrom: string;
  onDateFromChange: (value: string) => void;
  dateTo: string;
  onDateToChange: (value: string) => void;
}

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'longest', label: 'Longest' },
  { value: 'shortest', label: 'Shortest' },
];

export default function MeetingFilters({
  search, onSearchChange,
  sortBy, onSortChange,
  dateFrom, onDateFromChange,
  dateTo, onDateToChange,
}: MeetingFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b8a]" />
        <input
          type="text"
          placeholder="Filter meetings..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-sm text-[#e0e0e0] placeholder-[#6b6b8a] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/50 focus:border-[#6C5CE7] transition-all"
        />
      </div>

      {/* Date From */}
      <input
        type="date"
        value={dateFrom}
        onChange={(e) => onDateFromChange(e.target.value)}
        className="px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-sm text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/50 focus:border-[#6C5CE7] transition-all [color-scheme:dark]"
        placeholder="From"
      />

      {/* Date To */}
      <input
        type="date"
        value={dateTo}
        onChange={(e) => onDateToChange(e.target.value)}
        className="px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-sm text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/50 focus:border-[#6C5CE7] transition-all [color-scheme:dark]"
        placeholder="To"
      />

      {/* Sort */}
      <div className="flex items-center gap-2">
        <SortAsc size={16} className="text-[#8b8ba3]" />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-sm text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/50 focus:border-[#6C5CE7] transition-all appearance-none cursor-pointer pr-8"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
