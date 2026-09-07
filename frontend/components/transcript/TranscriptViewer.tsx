'use client';

import { useRef, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const segmentRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync transcript with player
  useTranscriptSync(segments || []);

  // Auto-scroll to active segment
  useEffect(() => {
    if (activeSegmentId && segmentRefs.current.has(activeSegmentId)) {
      const el = segmentRefs.current.get(activeSegmentId);
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeSegmentId]);

  const handleSegmentClick = (startTime: number) => {
    setCurrentTime(startTime);
  };

  // Filter and count matches
  const filteredSegments = segments || [];
  const matchCount = searchQuery.trim()
    ? filteredSegments.filter(s =>
        s.content.toLowerCase().includes(searchQuery.toLowerCase())
      ).length
    : 0;

  if (isLoading) {
    return (
      <div className="bg-[#16213e] rounded-lg border border-[#2a2a4a] p-4">
        <TranscriptSkeleton />
      </div>
    );
  }

  return (
    <div className="bg-[#16213e] rounded-lg border border-[#2a2a4a] flex flex-col h-[600px]">
      {/* Search Header */}
      <div className="px-4 py-3 border-b border-[#2a2a4a] flex-shrink-0">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b8a]" />
          <input
            type="text"
            placeholder="Search transcript..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            suppressHydrationWarning
            className="w-full pl-9 pr-4 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-sm text-[#e0e0e0] placeholder-[#6b6b8a] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/50 focus:border-[#6C5CE7] transition-all"
          />
        </div>
        {searchQuery.trim() && (
          <p className="text-xs text-[#8b8ba3] mt-2">
            {matchCount} match{matchCount !== 1 ? 'es' : ''} found
          </p>
        )}
      </div>

      {/* Segments List */}
      <div ref={containerRef} className="flex-1 overflow-y-auto py-2">
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
                onClick={() => handleSegmentClick(segment.start_time)}
              />
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-[#8b8ba3]">
            <p>No transcript available</p>
          </div>
        )}
      </div>
    </div>
  );
}
