'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Clock, Sparkles } from 'lucide-react';
import { useSummary } from '@/hooks/useSummary';
import { usePlayerStore } from '@/lib/store';
import Skeleton from '@/components/ui/Skeleton';

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface SummaryPanelProps {
  meetingId: number;
}

export default function SummaryPanel({ meetingId }: SummaryPanelProps) {
  const { data: summary, isLoading } = useSummary(meetingId);
  const setCurrentTime = usePlayerStore((s) => s.setCurrentTime);
  const [expandedTopics, setExpandedTopics] = useState<Set<number>>(new Set());

  const toggleTopic = (index: number) => {
    const newSet = new Set(expandedTopics);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setExpandedTopics(newSet);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-[#8b8ba3]">
        <Sparkles size={32} className="mb-3 text-[#6C5CE7]" />
        <p className="text-sm">No summary available yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Summary Badge */}
      <div className="flex items-center gap-2 text-[#6C5CE7]">
        <Sparkles size={16} />
        <span className="text-sm font-semibold">AI Summary</span>
      </div>

      {/* Overview */}
      <div className="bg-[#1a1a2e] rounded-lg p-4">
        <p className="text-sm text-[#e0e0e0] leading-relaxed">{summary.overview}</p>
      </div>

      {/* Key Topics */}
      {summary.key_topics && summary.key_topics.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-[#8b8ba3] mb-3 uppercase tracking-wider">Key Topics</h4>
          <div className="space-y-2">
            {summary.key_topics.map((topic, i) => (
              <div key={i} className="bg-[#1a1a2e] rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleTopic(i)}
                  className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-[#2a2a4a]/50 transition-colors"
                >
                  {expandedTopics.has(i) ? (
                    <ChevronDown size={16} className="text-[#6C5CE7] flex-shrink-0" />
                  ) : (
                    <ChevronRight size={16} className="text-[#8b8ba3] flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium text-[#e0e0e0]">{topic.title}</span>
                </button>
                {expandedTopics.has(i) && (
                  <div className="px-4 pb-3 pl-10">
                    <p className="text-xs text-[#8b8ba3] leading-relaxed">{topic.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chapters */}
      {summary.chapters && summary.chapters.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-[#8b8ba3] mb-3 uppercase tracking-wider">Chapters</h4>
          <div className="space-y-1">
            {summary.chapters.map((chapter, i) => (
              <button
                key={i}
                onClick={() => setCurrentTime(chapter.start_time)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-[#1a1a2e] transition-colors group text-left"
              >
                <Clock size={14} className="text-[#6C5CE7] flex-shrink-0" />
                <span className="text-sm text-[#e0e0e0] flex-1">{chapter.title}</span>
                <span className="text-xs font-mono text-[#6C5CE7] group-hover:text-[#a29bfe]">
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
