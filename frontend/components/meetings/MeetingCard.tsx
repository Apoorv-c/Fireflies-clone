'use client';

import Link from 'next/link';
import type { Meeting } from '@/types';
import Badge from '@/components/ui/Badge';
import { Clock, Calendar, Volume2, ArrowRight } from 'lucide-react';

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return `${hrs}h ${remainMins}m`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

const SPEAKER_COLORS = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#E91E63', '#1ABC9C', '#E67E22'];

interface MeetingCardProps {
  meeting: Meeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const borderColor = SPEAKER_COLORS[(meeting.id - 1) % SPEAKER_COLORS.length];
  const participants = meeting.participants || [];
  const tags = meeting.tags || [];

  return (
    <Link href={`/meetings/${meeting.id}`} className="block group">
      <div
        className="bg-white rounded-xl p-5 border border-slate-200/80 hover:border-[#6C5CE7]/60 hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full"
        style={{ borderLeftWidth: '4px', borderLeftColor: borderColor }}
      >
        <div>
          {/* Header Row: Title & Duration */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-slate-900 font-semibold text-sm group-hover:text-[#6C5CE7] transition-colors line-clamp-1 flex-1">
              {meeting.title}
            </h3>
            <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex-shrink-0">
              <Clock size={11} />
              {formatDuration(meeting.duration_seconds)}
            </span>
          </div>

          {/* Date & Time */}
          <div className="flex items-center gap-2 mb-3 text-slate-500 text-xs">
            <Calendar size={12} className="text-[#6C5CE7]" />
            <span>{formatDate(meeting.date)} at {formatTime(meeting.date)}</span>
          </div>

          {/* Summary Preview */}
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
            {meeting.summary_snippet || 'Discussion notes, transcript, and key action items generated.'}
          </p>
        </div>

        <div>
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 mb-3.5">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Footer: Attendees & Action */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            {/* Avatar Stack */}
            <div className="flex items-center">
              {participants.slice(0, 4).map((p, i) => (
                <div
                  key={p.id}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold border-2 border-white shadow-2xs"
                  style={{
                    backgroundColor: SPEAKER_COLORS[i % SPEAKER_COLORS.length],
                    marginLeft: i > 0 ? '-6px' : '0',
                    zIndex: 4 - i,
                  }}
                  title={p.name}
                >
                  {p.name.slice(0, 1).toUpperCase()}
                </div>
              ))}
              {participants.length > 4 && (
                <div
                  className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-[9px] font-medium border-2 border-white"
                  style={{ marginLeft: '-6px' }}
                >
                  +{participants.length - 4}
                </div>
              )}
            </div>

            {/* View prompt */}
            <span className="text-xs text-[#6C5CE7] group-hover:text-[#5a4bd6] font-medium flex items-center gap-1 transition-colors">
              <span>View</span>
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
