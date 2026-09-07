'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Clock, Sparkles } from 'lucide-react';
import { useSummary } from '@/hooks/useSummary';
import { usePlayerStore } from '@/lib/store';
import Skeleton from '@/components/ui/Skeleton';

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

interface SummaryPanelProps {
  meetingId: number;
}

export default function SummaryPanel({ meetingId }: SummaryPanelProps) {
  const { data: summary, isLoading } = useSummary(meetingId);
  const setCurrentTime = usePlayerStore((s) => s.setCurrentTime);
  const setIsPlaying = usePlayerStore((s) => s.setIsPlaying);
  const [expandedTopics, setExpandedTopics] = useState<Set<number>>(new Set([0, 1])); // Expand first 2 by default

  const toggleTopic = (index: number) => {
    const next = new Set(expandedTopics);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setExpandedTopics(next);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    setIsPlaying(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-5 w-36 mb-2" />
        <Skeleton className="h-24 w-full rounded-xl mb-4" />
        <Skeleton className="h-5 w-28 mb-2" />
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-[#6C5CE7]/15 flex items-center justify-center text-[#6C5CE7] mb-3">
          <Sparkles size={24} />
        </div>
        <p className="text-sm font-medium text-white">No summary generated yet</p>
        <p className="text-xs text-[#8b8ba3] mt-1">AI summary will appear here once processed.</p>
      </div>
    );
  }

  const topics = summary.key_topics || [];
  const chapters = summary.chapters || [];

  return (
    <div className="space-y-6" suppressHydrationWarning>
      {/* Executive Summary Card */}
      <div className="bg-[#161a2e] border border-[#252b47] rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 text-[#a29bfe] font-semibold text-xs uppercase tracking-wider mb-2.5">
          <Sparkles size={14} className="text-[#6C5CE7]" />
          <span>Executive Overview</span>
        </div>
        <p className="text-sm text-[#f1f3fa] leading-relaxed font-normal">
          {summary.overview}
        </p>
      </div>

      {/* Key Topics Section */}
      {topics.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-[#8b8ba3] uppercase tracking-wider">
              Key Topics ({topics.length})
            </h4>
            <span className="text-[11px] text-[#6b7294]">Click to expand</span>
          </div>

          <div className="space-y-2">
            {topics.map((topic, i) => {
              const isExpanded = expandedTopics.has(i);
              return (
                <div
                  key={i}
                  className="bg-[#161a2e] border border-[#252b47] hover:border-[#353e66] rounded-xl overflow-hidden transition-all duration-150"
                >
                  <button
                    onClick={() => toggleTopic(i)}
                    type="button"
                    suppressHydrationWarning
                    className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors bg-transparent"
                  >
                    <div className="flex items-center gap-2.5 flex-1 pr-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6C5CE7]" />
                      <span className="text-xs sm:text-sm font-semibold text-white">
                        {topic.title}
                      </span>
                    </div>

                    <div className="p-1 rounded text-[#8b8ba3]">
                      {isExpanded ? (
                        <ChevronDown size={15} className="text-[#a29bfe]" />
                      ) : (
                        <ChevronRight size={15} />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-3.5 pt-1 border-t border-[#1e233d] bg-[#121526]/60">
                      <p className="text-xs text-[#c5c9de] leading-relaxed">
                        {topic.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Chapters / Timeline Section */}
      {chapters.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-[#8b8ba3] uppercase tracking-wider mb-3">
            Chapters &amp; Timeline ({chapters.length})
          </h4>

          <div className="space-y-1.5">
            {chapters.map((chapter, i) => (
              <button
                key={i}
                onClick={() => handleSeek(chapter.start_time)}
                type="button"
                suppressHydrationWarning
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#161a2e] hover:bg-[#1e233d] border border-[#252b47] hover:border-[#3b436e] transition-all group text-left"
              >
                <div className="flex items-center gap-2.5 flex-1 pr-2">
                  <div className="w-6 h-6 rounded-lg bg-[#6C5CE7]/15 flex items-center justify-center text-[#a29bfe] group-hover:bg-[#6C5CE7] group-hover:text-white transition-colors">
                    <Clock size={12} />
                  </div>
                  <span className="text-xs font-medium text-white group-hover:text-[#a29bfe] transition-colors">
                    {chapter.title}
                  </span>
                </div>

                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#1e233d] group-hover:bg-[#6C5CE7] text-[#a29bfe] group-hover:text-white transition-all font-semibold">
                  {formatTimestamp(chapter.start_time)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
