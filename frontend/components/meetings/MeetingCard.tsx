'use client';

import Link from 'next/link';
import type { Meeting } from '@/types';
import Badge from '@/components/ui/Badge';
import { Clock, Users, Calendar } from 'lucide-react';

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return `${hrs}h ${remainMins}m`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

  return (
    <Link href={`/meetings/${meeting.id}`}>
      <div
        className="bg-[#16213e] rounded-lg p-5 border border-[#2a2a4a] hover:bg-[#1a1a3e] transition-all duration-200 cursor-pointer group"
        style={{ borderLeftWidth: '4px', borderLeftColor: borderColor }}
      >
        {/* Title and Duration */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-[#e0e0e0] font-semibold text-sm group-hover:text-white transition-colors line-clamp-1 flex-1 mr-2">
            {meeting.title}
          </h3>
          <Badge color={borderColor}>
            <Clock size={12} className="mr-1" />
            {formatDuration(meeting.duration_seconds)}
          </Badge>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 mb-3 text-[#8b8ba3] text-xs">
          <Calendar size={13} />
          <span>{formatDate(meeting.date)} at {formatTime(meeting.date)}</span>
        </div>

        {/* Summary Snippet */}
        {meeting.summary_snippet && (
          <p className="text-[#8b8ba3] text-xs leading-relaxed line-clamp-2 mb-3">
            {meeting.summary_snippet}
          </p>
        )}

        {/* Participants and Tags */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {meeting.participants.slice(0, 3).map((p, i) => (
              <div
                key={p.id}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold border-2 border-[#16213e]"
                style={{
                  backgroundColor: SPEAKER_COLORS[i % SPEAKER_COLORS.length],
                  marginLeft: i > 0 ? '-6px' : '0',
                  zIndex: 3 - i,
                }}
                title={p.name}
              >
                {p.name.split(' ').map(n => n[0]).join('')}
              </div>
            ))}
            {meeting.participants.length > 3 && (
              <div className="w-7 h-7 rounded-full bg-[#2a2a4a] flex items-center justify-center text-[#8b8ba3] text-[10px] font-medium border-2 border-[#16213e]" style={{ marginLeft: '-6px' }}>
                +{meeting.participants.length - 3}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {meeting.tags.slice(0, 2).map((tag) => (
              <Badge key={tag.id} variant="outline" className="text-[10px]">
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
