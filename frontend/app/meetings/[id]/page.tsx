'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { usePlayerStore } from '@/lib/store';
import { useMeeting } from '@/hooks/useMeetings';
import { useTranscript } from '@/hooks/useTranscript';
import AudioPlayer from '@/components/player/AudioPlayer';
import TranscriptViewer from '@/components/transcript/TranscriptViewer';
import SummaryPanel from '@/components/summary/SummaryPanel';
import ActionItemsPanel from '@/components/summary/ActionItemsPanel';
import AskFredPanel from '@/components/summary/AskFredPanel';
import EditMeetingModal from '@/components/meetings/EditMeetingModal';
import DeleteConfirmModal from '@/components/meetings/DeleteConfirmModal';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { exportMeeting } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Users,
  Download,
  Share2,
  Sparkles,
  CheckSquare,
  Bot,
  FileText
} from 'lucide-react';
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
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export default function MeetingDetailPage() {
  const params = useParams();
  const idStr = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '1';
  const meetingId = parseInt(idStr, 10) || 1;

  const { data: meeting, isLoading } = useMeeting(meetingId);
  const { data: transcriptSegments } = useTranscript(meetingId);
  const { showToast } = useToast();

  // Reset audio player state whenever switching meetings
  useEffect(() => {
    usePlayerStore.getState().setCurrentTime(0);
    usePlayerStore.getState().setIsPlaying(false);
    usePlayerStore.getState().setActiveSegmentId(null);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [meetingId]);

  const [activeTab, setActiveTab] = useState<'summary' | 'actions' | 'ask'>('summary');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const content = await exportMeeting(meetingId, 'markdown');
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(meeting?.title || 'Meeting').replace(/\s+/g, '_')}_notes.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Meeting notes exported to Markdown');
    } catch {
      showToast('Failed to export notes', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast('Meeting link copied to clipboard');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-5 w-96 mb-6" />
        <Skeleton className="h-24 w-full rounded-xl mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7"><Skeleton className="h-[680px] w-full rounded-xl" /></div>
          <div className="lg:col-span-5"><Skeleton className="h-[680px] w-full rounded-xl" /></div>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-[#6C5CE7]/10 flex items-center justify-center text-[#6C5CE7] mb-4">
          <FileText size={32} />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Meeting not found</h2>
        <p className="text-sm text-[#8b8ba3] mb-6">This meeting record might have been removed or does not exist.</p>
        <Link href="/meetings">
          <Button variant="secondary"><ArrowLeft size={16} /> Back to Notebook</Button>
        </Link>
      </div>
    );
  }

  const participantsList = meeting.participants || [];
  const tagsList = meeting.tags || [];

  return (
    <div className="max-w-7xl mx-auto space-y-5" suppressHydrationWarning>
      {/* Top Breadcrumbs & Actions Header */}
      <div className="bg-[#121526] border border-[#232845] rounded-xl p-5 shadow-sm">
        {/* Navigation back */}
        <div className="flex items-center justify-between mb-3">
          <Link
            href="/meetings"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8b8ba3] hover:text-[#6C5CE7] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Notebook</span>
            <span className="text-[#454d75]">/</span>
            <span className="text-[#a29bfe] line-clamp-1">{meeting.title}</span>
          </Link>

          {/* Quick Toolbar */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              title="Share meeting"
              suppressHydrationWarning
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#8b8ba3] hover:text-white bg-[#1a1e36] hover:bg-[#252b4d] border border-[#2b3259] transition-all"
            >
              <Share2 size={13} />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={handleExport}
              disabled={isExporting}
              title="Export Markdown notes"
              suppressHydrationWarning
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#8b8ba3] hover:text-white bg-[#1a1e36] hover:bg-[#252b4d] border border-[#2b3259] transition-all"
            >
              <Download size={13} />
              <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export'}</span>
            </button>

            <button
              onClick={() => setIsEditOpen(true)}
              title="Edit meeting"
              suppressHydrationWarning
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#8b8ba3] hover:text-white bg-[#1a1e36] hover:bg-[#252b4d] border border-[#2b3259] transition-all"
            >
              <Edit size={13} />
              <span className="hidden sm:inline">Edit</span>
            </button>

            <button
              onClick={() => setIsDeleteOpen(true)}
              title="Delete meeting"
              suppressHydrationWarning
              className="p-1.5 rounded-lg text-red-400 hover:text-white hover:bg-red-500/20 border border-red-500/20 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Title and Metadata */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">{meeting.title}</h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#8b8ba3]">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-[#6C5CE7]" />
              {formatDate(meeting.date)} at {formatTime(meeting.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} className="text-[#6C5CE7]" />
              {formatDuration(meeting.duration_seconds)}
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={13} className="text-[#6C5CE7]" />
              {participantsList.length} Participants
            </span>
          </div>

          {/* Attendees Chips & Tags */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-3.5 pt-3 border-t border-[#1e233d]">
            <div className="flex flex-wrap items-center gap-2">
              {participantsList.map((p, i) => (
                <div
                  key={p.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#181c33] border border-[#293054] text-xs text-[#d0d3e6]"
                >
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold"
                    style={{ backgroundColor: SPEAKER_COLORS[i % SPEAKER_COLORS.length] }}
                  >
                    {p.name.slice(0, 1).toUpperCase()}
                  </div>
                  <span>{p.name}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              {tagsList.map((tag) => (
                <Badge key={tag.id} variant="outline" className="text-[10px] text-[#a29bfe] border-[#373f6b]">
                  #{tag.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Media Player Bar with Narration and Scrubber */}
      <AudioPlayer
        audioUrl={meeting.audio_url}
        duration={meeting.duration_seconds}
        segments={transcriptSegments || meeting.transcript_segments || []}
      />

      {/* Dual Panel Workspace (Fireflies Split-View) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Interactive Transcript (7 cols) */}
        <div className="lg:col-span-7">
          <div className="mb-2 flex items-center justify-between px-1">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#6C5CE7]" />
              Interactive Transcript
            </h2>
            <span className="text-xs text-[#8b8ba3]">
              Click any line to seek &amp; listen
            </span>
          </div>
          <TranscriptViewer meetingId={meetingId} />
        </div>

        {/* Right Column: AI Notebook, Action Items, AskFred (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-[#121526] rounded-xl border border-[#232845] h-[680px] flex flex-col shadow-lg overflow-hidden">
            {/* Tabs Header */}
            <div className="flex border-b border-[#232845] bg-[#121526] p-1.5 gap-1.5 flex-shrink-0">
              <button
                onClick={() => setActiveTab('summary')}
                suppressHydrationWarning
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'summary'
                    ? 'bg-[#6C5CE7] text-white shadow-md border border-[#6C5CE7]'
                    : 'bg-[#181d33] text-[#9ca3af] hover:text-white hover:bg-[#202644] border border-[#262c4a]'
                }`}
              >
                <Sparkles size={13} />
                <span>AI Summary</span>
              </button>

              <button
                onClick={() => setActiveTab('actions')}
                suppressHydrationWarning
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'actions'
                    ? 'bg-[#6C5CE7] text-white shadow-md border border-[#6C5CE7]'
                    : 'bg-[#181d33] text-[#9ca3af] hover:text-white hover:bg-[#202644] border border-[#262c4a]'
                }`}
              >
                <CheckSquare size={13} />
                <span>Action Items</span>
              </button>

              <button
                onClick={() => setActiveTab('ask')}
                suppressHydrationWarning
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'ask'
                    ? 'bg-[#6C5CE7] text-white shadow-md border border-[#6C5CE7]'
                    : 'bg-[#181d33] text-[#9ca3af] hover:text-white hover:bg-[#202644] border border-[#262c4a]'
                }`}
              >
                <Bot size={13} />
                <span>AskFred</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
              {activeTab === 'summary' && <SummaryPanel meetingId={meetingId} />}
              {activeTab === 'actions' && <ActionItemsPanel meetingId={meetingId} />}
              {activeTab === 'ask' && <AskFredPanel meetingId={meetingId} />}
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
