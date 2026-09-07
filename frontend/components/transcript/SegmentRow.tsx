'use client';

import { useMemo } from 'react';
import { usePlayerStore } from '@/lib/store';
import type { TranscriptSegment } from '@/types';

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface SegmentRowProps {
  segment: TranscriptSegment;
  isActive: boolean;
  searchQuery: string;
  onClick: () => void;
}

export default function SegmentRow({ segment, isActive, searchQuery, onClick }: SegmentRowProps) {
  const highlightedContent = useMemo(() => {
    if (!searchQuery.trim()) return segment.content;
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return segment.content.replace(regex, '<mark class="bg-yellow-400/30 text-yellow-200 rounded px-0.5">$1</mark>');
  }, [segment.content, searchQuery]);

  return (
    <div
      onClick={onClick}
      className={`flex gap-3 px-4 py-3 cursor-pointer transition-all duration-200 rounded-lg mx-2 group
        ${isActive ? 'segment-active border-l-2 border-[#6C5CE7]' : 'hover:bg-[#1a1a2e]/50 border-l-2 border-transparent'}`}
    >
      {/* Speaker Color Dot */}
      <div className="flex-shrink-0 pt-1">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: segment.speaker_color }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-xs font-semibold"
            style={{ color: segment.speaker_color }}
          >
            {segment.speaker_label}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="text-xs font-mono text-[#6C5CE7] hover:text-[#a29bfe] transition-colors"
          >
            {formatTimestamp(segment.start_time)}
          </button>
        </div>
        <p
          className="text-sm text-[#e0e0e0] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: highlightedContent }}
        />
      </div>
    </div>
  );
}
