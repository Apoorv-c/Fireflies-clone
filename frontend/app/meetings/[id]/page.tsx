'use client';

import { useState, use } from 'react';
import { useMeeting } from '@/hooks/useMeetings';
import AudioPlayer from '@/components/player/AudioPlayer';
import TranscriptViewer from '@/components/transcript/TranscriptViewer';
import SummaryPanel from '@/components/summary/SummaryPanel';
import ActionItemsPanel from '@/components/summary/ActionItemsPanel';
import EditMeetingModal from '@/components/meetings/EditMeetingModal';
import DeleteConfirmModal from '@/components/meetings/DeleteConfirmModal';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { ArrowLeft, Edit, Trash2, Calendar, Clock, Users } from 'lucide-react';
import Link from 'next/link';

const SPEAKER_COLORS = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#E91E63', '#1ABC9C', '#E67E22'];

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return `${hrs}h ${remainMins}m`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export default function MeetingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const meetingId = parseInt(id);
  const { data: meeting, isLoading } = useMeeting(meetingId);
  const [activeTab, setActiveTab] = useState<'summary' | 'actions'>('summary');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-48 mb-6" />
        <Skeleton className="h-16 w-full rounded-lg mb-6" />
        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-3"><Skeleton className="h-[600px] w-full rounded-lg" /></div>
          <div className="col-span-2"><Skeleton className="h-[600px] w-full rounded-lg" /></div>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-[#8b8ba3] mb-4">Meeting not found</p>
        <Link href="/meetings">
          <Button variant="secondary"><ArrowLeft size={16} /> Back to meetings</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link href="/meetings" className="inline-flex items-center gap-1.5 text-sm text-[#8b8ba3] hover:text-[#6C5CE7] transition-colors mb-4">
          <ArrowLeft size={16} />
          Back to meetings
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{meeting.title}</h1>
            <div className="flex items-center gap-4 text-sm text-[#8b8ba3]">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {formatDate(meeting.date)} at {formatTime(meeting.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {formatDuration(meeting.duration_seconds)}
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={14} />
                {meeting.participants.length} participants
              </span>
            </div>

            {/* Participants */}
            <div className="flex items-center gap-2 mt-3">
              {meeting.participants.map((p, i) => (
                <div key={p.id} className="flex items-center gap-1.5">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-semibold"
                    style={{ backgroundColor: SPEAKER_COLORS[i % SPEAKER_COLORS.length] }}
                  >
                    {p.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-xs text-[#8b8ba3]">{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setIsEditOpen(true)}>
              <Edit size={14} /> Edit
            </Button>
            <Button variant="danger" size="sm" onClick={() => setIsDeleteOpen(true)}>
              <Trash2 size={14} /> Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Audio Player */}
      <AudioPlayer audioUrl={meeting.audio_url} duration={meeting.duration_seconds} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Transcript - Left */}
        <div className="lg:col-span-3">
          <TranscriptViewer meetingId={meetingId} />
        </div>

        {/* Tabs Panel - Right */}
        <div className="lg:col-span-2">
          <div className="bg-[#16213e] rounded-lg border border-[#2a2a4a] h-[600px] flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-[#2a2a4a] flex-shrink-0">
              <button
                onClick={() => setActiveTab('summary')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors
                  ${activeTab === 'summary' ? 'text-[#6C5CE7] border-b-2 border-[#6C5CE7]' : 'text-[#8b8ba3] hover:text-[#e0e0e0]'}`}
              >
                Summary
              </button>
              <button
                onClick={() => setActiveTab('actions')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors
                  ${activeTab === 'actions' ? 'text-[#6C5CE7] border-b-2 border-[#6C5CE7]' : 'text-[#8b8ba3] hover:text-[#e0e0e0]'}`}
              >
                Action Items
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'summary' ? (
                <SummaryPanel meetingId={meetingId} />
              ) : (
                <ActionItemsPanel meetingId={meetingId} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isEditOpen && (
        <EditMeetingModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          meeting={meeting}
        />
      )}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        meetingId={meeting.id}
        meetingTitle={meeting.title}
      />
    </div>
  );
}
