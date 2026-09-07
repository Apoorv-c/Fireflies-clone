'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useCreateMeeting } from '@/hooks/useMeetings';
import { useUploadTranscript } from '@/hooks/useTranscript';
import { useToast } from '@/components/ui/Toast';
import { useUIStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Trash2,
  Upload,
  FileText,
  Calendar,
  Music,
  Video,
  FileAudio,
  CheckCircle2,
  Sparkles,
  Loader2,
  Clock,
  ArrowRight
} from 'lucide-react';

const meetingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  duration_minutes: z.coerce.number().min(1, 'Duration must be at least 1 minute'),
  tags: z.string().optional(),
});

type MeetingFormData = z.infer<typeof meetingSchema>;

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateMeetingModal({ isOpen, onClose }: CreateMeetingModalProps) {
  const { showToast } = useToast();
  const router = useRouter();
  const createMeeting = useCreateMeeting();
  const uploadTranscript = useUploadTranscript();
  const { createModalInitialTab } = useUIStore();

  // Tab mode: 'upload' (Upload File) or 'schedule' (Schedule Meeting)
  const [activeTab, setActiveTab] = useState<'schedule' | 'upload'>('upload');

  // Upload Tab state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadMeetingTitle, setUploadMeetingTitle] = useState('');
  const [uploadDuration, setUploadDuration] = useState(45);
  const [uploadLanguage, setUploadLanguage] = useState('English (Global)');
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Schedule Tab state
  const [participants, setParticipants] = useState<{ name: string; email: string }[]>([{ name: '', email: '' }]);
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [transcriptText, setTranscriptText] = useState('');
  const [transcriptMode, setTranscriptMode] = useState<'none' | 'upload' | 'paste'>('none');

  // Format current local date-time for datetime-local input
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const defaultDateTime = now.toISOString().slice(0, 16);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<MeetingFormData>({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      title: '',
      date: defaultDateTime,
      duration_minutes: 45,
      tags: '',
    },
  });

  // Sync tab with user action trigger (e.g. clicking Upload File vs Schedule Meeting)
  useEffect(() => {
    if (isOpen) {
      setActiveTab(createModalInitialTab || 'upload');
      setUploadedFile(null);
      setUploadMeetingTitle('');
      setIsProcessingUpload(false);
      setUploadProgress(0);
    }
  }, [isOpen, createModalInitialTab]);

  const addParticipant = () => {
    setParticipants([...participants, { name: '', email: '' }]);
  };

  const removeParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const updateParticipant = (index: number, field: 'name' | 'email', value: string) => {
    const updated = [...participants];
    updated[index][field] = value;
    setParticipants(updated);
  };

  // Handle file selection in Upload Tab
  const handleUploadedFileSelect = (file: File) => {
    const validExts = ['.mp3', '.mp4', '.m4a', '.wav', '.webm', '.ogg', '.mov', '.aac', '.vtt', '.txt', '.json', '.docx', '.pdf'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!validExts.includes(ext)) {
      showToast(`Unsupported file type. Please upload audio, video, or transcripts (${validExts.slice(0, 6).join(', ')}).`, 'error');
      return;
    }

    setUploadedFile(file);
    // Auto populate a clean meeting title from the filename
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    if (!uploadMeetingTitle) {
      setUploadMeetingTitle(cleanName);
    }
  };

  // Submit Upload Tab
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile) {
      showToast('Please select a file to upload', 'error');
      return;
    }

    const title = uploadMeetingTitle.trim() || uploadedFile.name.replace(/\.[^/.]+$/, '');

    try {
      setIsProcessingUpload(true);
      setUploadProgress(25);

      // 1. Create meeting in database
      const createdMeeting = await createMeeting.mutateAsync({
        title,
        date: new Date().toISOString(),
        duration_seconds: uploadDuration * 60,
        status: 'completed',
        participants: [
          { name: 'Alex Vance', email: 'alex.vance@company.com' },
          { name: 'Sarah Chen', email: 'sarah.chen@company.com' },
          { name: 'Mike Johnson', email: 'mike.johnson@company.com' }
        ],
        tags: ['uploaded', uploadedFile.name.split('.').pop() || 'recording']
      });

      setUploadProgress(65);

      // 2. Upload and generate multi-speaker transcript segments & AI notes
      await uploadTranscript.mutateAsync({
        meetingId: createdMeeting.id,
        file: uploadedFile
      });

      setUploadProgress(100);
      showToast(`🎉 "${title}" transcribed and notebook created!`, 'success');

      setTimeout(() => {
        setIsProcessingUpload(false);
        onClose();
        router.push(`/meetings/${createdMeeting.id}`);
      }, 500);

    } catch (err) {
      console.error(err);
      setIsProcessingUpload(false);
      showToast('Failed to upload and transcribe file. Check server status.', 'error');
    }
  };

  // Submit Schedule Tab
  const onScheduleSubmit = async (data: MeetingFormData) => {
    try {
      const validParticipants = participants.filter((p) => p.name.trim());
      const tags = data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];

      const meeting = await createMeeting.mutateAsync({
        title: data.title,
        date: new Date(data.date).toISOString(),
        duration_seconds: Number(data.duration_minutes) * 60,
        participants: validParticipants,
        tags,
      });

      if (transcriptFile && meeting.id) {
        try {
          await uploadTranscript.mutateAsync({ meetingId: meeting.id, file: transcriptFile });
          showToast('Meeting created with transcript file');
        } catch {
          showToast('Meeting created, but transcript parsing encountered an issue', 'error');
        }
      } else if (transcriptText.trim() && meeting.id) {
        const blob = new Blob([transcriptText], { type: 'text/plain' });
        const file = new File([blob], 'transcript.txt', { type: 'text/plain' });
        try {
          await uploadTranscript.mutateAsync({ meetingId: meeting.id, file });
          showToast('Meeting created with pasted transcript');
        } catch {
          showToast('Meeting created, but transcript parsing encountered an issue', 'error');
        }
      } else {
        showToast('Meeting scheduled successfully', 'success');
      }

      reset();
      setParticipants([{ name: '', email: '' }]);
      setTranscriptFile(null);
      setTranscriptText('');
      setTranscriptMode('none');
      onClose();
    } catch {
      showToast('Failed to create meeting. Ensure the backend is running.', 'error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Capture or Schedule Meeting"
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        {/* Top Segmented Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white text-[#059669] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <div className={`w-4 h-4 rounded-md flex items-center justify-center ${activeTab === 'upload' ? 'bg-[#ecfdf5] text-[#059669]' : 'text-slate-400'}`}>
              <Upload size={12} />
            </div>
            <span>Upload File</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'schedule'
                ? 'bg-white text-[#e11d48] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <div className={`w-4 h-4 rounded-md flex items-center justify-center ${activeTab === 'schedule' ? 'bg-[#fdf2f4] text-[#e11d48]' : 'text-slate-400'}`}>
              <Calendar size={12} />
            </div>
            <span>Schedule Meeting</span>
          </button>
        </div>

        {/* 1. UPLOAD FILE TAB */}
        {activeTab === 'upload' && (
          <form onSubmit={handleUploadSubmit} className="space-y-4 pt-1">
            {/* Drag & Drop Upload Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer.files?.[0]) {
                  handleUploadedFileSelect(e.dataTransfer.files[0]);
                }
              }}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer select-none ${
                uploadedFile
                  ? 'border-emerald-400 bg-emerald-50/40'
                  : 'border-slate-200 hover:border-[#059669] hover:bg-emerald-50/20 bg-slate-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp3,.mp4,.m4a,.wav,.webm,.ogg,.mov,.aac,.vtt,.txt,.json,.docx,.pdf"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleUploadedFileSelect(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              {uploadedFile ? (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#059669] mx-auto flex items-center justify-center shadow-xs">
                    <FileAudio size={24} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-800 break-all">{uploadedFile.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for AI Transcription
                    </p>
                  </div>
                  <div className="pt-1 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedFile(null);
                      }}
                      className="px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Replace file
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-[#059669] mx-auto flex items-center justify-center shadow-xs">
                    <Upload size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Drag & drop your recording or <span className="text-[#059669] underline">browse</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Supports MP3, MP4, M4A, WAV, WebM, VTT, TXT, JSON (up to 500 MB)
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-1 text-[10px] text-slate-400 font-medium">
                    <span className="inline-flex items-center gap-1">
                      <Sparkles size={11} className="text-[#059669]" /> Auto AI Transcription
                    </span>
                    <span>•</span>
                    <span>Speaker Detection</span>
                    <span>•</span>
                    <span>Executive Summary</span>
                  </div>
                </div>
              )}
            </div>

            {/* Meeting Name & Options */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Meeting / Title *
                </label>
                <input
                  type="text"
                  required
                  value={uploadMeetingTitle}
                  onChange={(e) => setUploadMeetingTitle(e.target.value)}
                  placeholder="e.g. Client Discovery Sync or Sprint Retro"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={uploadDuration}
                    onChange={(e) => setUploadDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Audio Language
                  </label>
                  <select
                    value={uploadLanguage}
                    onChange={(e) => setUploadLanguage(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                  >
                    <option>English (Global)</option>
                    <option>Spanish (Español)</option>
                    <option>French (Français)</option>
                    <option>German (Deutsch)</option>
                    <option>Auto-Detect</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Progress bar when uploading */}
            {isProcessingUpload && (
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1.5 animate-in fade-in">
                <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Loader2 size={13} className="animate-spin text-[#059669]" />
                    Processing audio and generating AI transcript...
                  </span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-emerald-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#059669] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <button
                type="submit"
                disabled={!uploadedFile || isProcessingUpload}
                className="px-4 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] disabled:opacity-50 text-white text-xs font-semibold shadow-xs hover:shadow transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                {isProcessingUpload ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Upload size={13} />
                    <span>Upload & Transcribe</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* 2. SCHEDULE MEETING TAB */}
        {activeTab === 'schedule' && (
          <form onSubmit={handleSubmit(onScheduleSubmit)} className="space-y-4 pt-1">
            <Input
              label="Meeting Title *"
              placeholder="e.g. Q4 Strategy Review"
              error={errors.title?.message}
              {...register('title')}
              autoFocus
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Date & Time *"
                type="datetime-local"
                error={errors.date?.message}
                {...register('date')}
              />
              <Input
                label="Duration (minutes) *"
                type="number"
                placeholder="45"
                error={errors.duration_minutes?.message}
                {...register('duration_minutes')}
              />
            </div>

            {/* Participants */}
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
                Participants
              </label>
              {participants.map((p, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Participant Name"
                    value={p.name}
                    onChange={(e) => updateParticipant(i, 'name', e.target.value)}
                    suppressHydrationWarning
                    className="flex-1 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/30 focus:border-[#7c3aed] shadow-xs"
                  />
                  <input
                    type="email"
                    placeholder="Email (optional)"
                    value={p.email}
                    onChange={(e) => updateParticipant(i, 'email', e.target.value)}
                    suppressHydrationWarning
                    className="flex-1 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/30 focus:border-[#7c3aed] shadow-xs"
                  />
                  {participants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeParticipant(i)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addParticipant}
                suppressHydrationWarning
                className="text-xs text-[#7c3aed] hover:text-[#6d28d9] flex items-center gap-1 mt-1 font-medium cursor-pointer"
              >
                <Plus size={13} /> Add another participant
              </button>
            </div>

            <Input
              label="Tags (comma-separated)"
              placeholder="e.g. roadmap, engineering, Q4"
              {...register('tags')}
            />

            {/* Transcript Upload / Paste Option */}
            <div className="pt-2 border-t border-slate-100">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                Transcript (Optional)
              </label>
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => {
                    setTranscriptMode('upload');
                    setTranscriptText('');
                  }}
                  suppressHydrationWarning
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    transcriptMode === 'upload'
                      ? 'bg-[#7c3aed] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <Upload size={13} /> Upload File (.vtt, .txt, .json)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTranscriptMode('paste');
                    setTranscriptFile(null);
                  }}
                  suppressHydrationWarning
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    transcriptMode === 'paste'
                      ? 'bg-[#7c3aed] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <FileText size={13} /> Paste Transcript
                </button>
              </div>

              {transcriptMode === 'upload' && (
                <div className="relative">
                  <input
                    type="file"
                    accept=".vtt,.txt,.json,.mp3,.mp4,.wav,.m4a"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setTranscriptFile(file);
                      }
                    }}
                    suppressHydrationWarning
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center hover:border-[#7c3aed] transition-colors bg-slate-50/70">
                    {transcriptFile ? (
                      <div className="flex items-center justify-center gap-2">
                        <FileText size={16} className="text-[#7c3aed]" />
                        <span className="text-xs font-medium text-slate-900">{transcriptFile.name}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTranscriptFile(null);
                          }}
                          className="text-slate-400 hover:text-red-500 ml-2"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload size={22} className="text-[#7c3aed] mx-auto mb-1.5" />
                        <p className="text-xs text-slate-800 font-medium">Click or drag a transcript file</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Supports WebVTT (.vtt), plain text (.txt), and JSON</p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {transcriptMode === 'paste' && (
                <textarea
                  value={transcriptText}
                  onChange={(e) => setTranscriptText(e.target.value)}
                  placeholder="Paste dialogue here...&#10;&#10;Sarah Chen: Let's get started on the sprint.&#10;Mike Johnson: The auth bug has been resolved."
                  rows={4}
                  suppressHydrationWarning
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/30 focus:border-[#7c3aed] resize-none font-mono shadow-xs"
                />
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMeeting.isPending}>
                {createMeeting.isPending ? 'Scheduling Meeting...' : 'Schedule Meeting'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
