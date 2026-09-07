'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { Search, Users, X } from 'lucide-react';
import { usePlayerStore } from '@/lib/store';
import { useTranscript } from '@/hooks/useTranscript';
import { useTranscriptSync } from '@/hooks/useTranscriptSync';
import SegmentRow from './SegmentRow';
import { TranscriptSkeleton } from '@/components/ui/Skeleton';

interface TranscriptViewerProps {
  meetingId: number;
}

export default function TranscriptViewer({ meetingId }: TranscriptViewerProps) {
  const { data: segments, isLoading } = useTranscript(meetingId);
  const activeSegmentId = usePlayerStore((s) => s.activeSegmentId);
  const setCurrentTime = usePlayerStore((s) => s.setCurrentTime);
  const setIsPlaying = usePlayerStore((s) => s.setIsPlaying);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>('all');
  const segmentRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync transcript highlighting with current audio time
  useTranscriptSync(segments || []);

  // Auto-scroll to active segment
  useEffect(() => {
    if (activeSegmentId && segmentRefs.current.has(activeSegmentId)) {
      const el = segmentRefs.current.get(activeSegmentId);
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeSegmentId]);

  const handlePlayFrom = (startTime: number) => {
    setCurrentTime(startTime);
    setIsPlaying(true);
  };

  // Distinct speakers list for filtering
  const speakers = useMemo(() => {
    if (!segments) return [];
    const set = new Set<string>();
    segments.forEach((s) => {
      if (s.speaker_label) set.add(s.speaker_label);
    });
    return Array.from(set);
  }, [segments]);

  // Filtered segments by speaker and search
  const filteredSegments = useMemo(() => {
    if (!segments) return [];
    return segments.filter((s) => {
      const matchSpeaker = selectedSpeaker === 'all' || s.speaker_label === selectedSpeaker;
      const matchSearch = !searchQuery.trim() || s.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSpeaker && matchSearch;
    });
  }, [segments, selectedSpeaker, searchQuery]);

  const matchCount = useMemo(() => {
    if (!searchQuery.trim() || !segments) return 0;
    return segments.filter((s) => s.content.toLowerCase().includes(searchQuery.toLowerCase())).length;
  }, [segments, searchQuery]);

  if (isLoading) {
    return (
      <div className="bg-[#121526] rounded-xl border border-[#232845] p-5">
        <TranscriptSkeleton />
      </div>
    );
  }

  return (
    <div className="bg-[#121526] rounded-xl border border-[#232845] flex flex-col h-[680px] shadow-lg overflow-hidden" suppressHydrationWarning>
      {/* Header with Search and Speaker Filter */}
      <div className="p-3.5 border-b border-[#232845] bg-[#15192d] flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7294]" />
          <input
            type="text"
            placeholder="Search in transcript..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            suppressHydrationWarning
            className="w-full pl-9 pr-8 py-1.5 bg-[#1e233d] border border-[#2e355c] rounded-lg text-xs text-[#e0e0e0] placeholder-[#6b7294] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              suppressHydrationWarning
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b8ba3] hover:text-white"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Speaker Filter */}
        <div className="flex items-center gap-1.5">
          <Users size={14} className="text-[#8b8ba3]" />
          <select
            value={selectedSpeaker}
            onChange={(e) => setSelectedSpeaker(e.target.value)}
            suppressHydrationWarning
            className="px-2.5 py-1.5 bg-[#1e233d] border border-[#2e355c] rounded-lg text-xs text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/50 cursor-pointer"
          >
            <option value="all">All Speakers ({speakers.length})</option>
            {speakers.map((spk) => (
              <option key={spk} value={spk}>
                {spk}
              </option>
            ))}
          </select>
        </div>

        {searchQuery.trim() && (
          <span className="text-[11px] text-[#a29bfe] font-medium">
            {matchCount} match{matchCount !== 1 ? 'es' : ''}
          </span>
        )}
      </div>

      {/* Transcript Segments Body */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-2 scrollbar-thin">
        {filteredSegments.length > 0 ? (
          filteredSegments.map((segment) => (
            <div
              key={segment.id}
              ref={(el) => {
                if (el) segmentRefs.current.set(segment.id, el);
              }}
            >
              <SegmentRow
                segment={segment}
                isActive={segment.id === activeSegmentId}
                searchQuery={searchQuery}
                onPlayFrom={handlePlayFrom}
              />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-[#8b8ba3] py-16">
            <Search size={28} className="mb-2 opacity-40 text-[#6C5CE7]" />
            <p className="text-xs font-medium">No matching dialogue found</p>
            {(searchQuery || selectedSpeaker !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSpeaker('all');
                }}
                suppressHydrationWarning
                className="mt-2 text-xs text-[#6C5CE7] hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
