'use client';

import { useMemo, useState } from 'react';
import { Play, Copy, Check } from 'lucide-react';
import type { TranscriptSegment } from '@/types';

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

interface SegmentRowProps {
  segment: TranscriptSegment;
  isActive: boolean;
  searchQuery: string;
  onPlayFrom: (startTime: number) => void;
}

export default function SegmentRow({ segment, isActive, searchQuery, onPlayFrom }: SegmentRowProps) {
  const [copied, setCopied] = useState(false);

  const highlightedContent = useMemo(() => {
    if (!searchQuery.trim()) return segment.content;
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return segment.content.replace(regex, '<mark class="bg-amber-400/30 text-amber-200 font-medium rounded px-1 py-0.5">$1</mark>');
  }, [segment.content, searchQuery]);

  const initials = useMemo(() => {
    if (!segment.speaker_label) return 'SP';
    return segment.speaker_label
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [segment.speaker_label]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${segment.speaker_label || 'Speaker'}: ${segment.content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      onClick={() => onPlayFrom(segment.start_time)}
      className={`group relative flex items-start gap-3.5 px-4 py-3 cursor-pointer rounded-xl transition-all duration-150 mx-1 mb-1.5 ${
        isActive
          ? 'bg-[#1e233f] border-l-4 border-[#6C5CE7] shadow-md shadow-[#6C5CE7]/10'
          : 'hover:bg-[#161a2e] border-l-4 border-transparent'
      }`}
    >
      {/* Speaker Avatar Circle */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm transition-transform group-hover:scale-105"
        style={{ backgroundColor: segment.speaker_color || '#6C5CE7' }}
        title={segment.speaker_label || 'Speaker'}
      >
        {initials}
      </div>

      {/* Segment Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-semibold tracking-tight"
              style={{ color: segment.speaker_color || '#e0e0e0' }}
            >
              {segment.speaker_label || 'Speaker'}
            </span>

            {/* Clickable timestamp */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlayFrom(segment.start_time);
              }}
              suppressHydrationWarning
              className="flex items-center gap-1 text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#202540] text-[#a29bfe] hover:bg-[#6C5CE7] hover:text-white transition-colors"
            >
              <Play size={10} className="fill-current" />
              <span>{formatTimestamp(segment.start_time)}</span>
            </button>
          </div>

          {/* Action on hover */}
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
            <button
              onClick={handleCopy}
              title="Copy line"
              suppressHydrationWarning
              className="p-1 rounded text-[#8b8ba3] hover:text-white hover:bg-[#252b47] transition-colors"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            </button>
          </div>
        </div>

        {/* Text */}
        <p
          className="text-xs sm:text-sm text-[#d4d7e6] leading-relaxed select-text"
          dangerouslySetInnerHTML={{ __html: highlightedContent }}
        />
      </div>
    </div>
  );
}
