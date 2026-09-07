'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useCreateMeeting } from '@/hooks/useMeetings';
import { useUploadTranscript } from '@/hooks/useTranscript';
import { useToast } from '@/components/ui/Toast';
import { Plus, Trash2, Upload, FileText } from 'lucide-react';

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
  const createMeeting = useCreateMeeting();
  const uploadTranscript = useUploadTranscript();
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validExts = ['.vtt', '.txt', '.json'];
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!validExts.includes(ext)) {
        showToast('Please upload a .vtt, .txt, or .json file', 'error');
        return;
      }
      setTranscriptFile(file);
      setTranscriptMode('upload');
      setTranscriptText('');
    }
  };

  const onSubmit = async (data: MeetingFormData) => {
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

      // Upload transcript file if provided
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
        showToast('Meeting created successfully');
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
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Meeting" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <label className="text-xs font-semibold text-[#8b8ba3] uppercase tracking-wider block mb-1.5">
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
                className="flex-1 px-3 py-2 rounded-lg bg-[#1e233d] border border-[#2e355c] text-white placeholder-[#6b7294] text-xs focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/50"
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={p.email}
                onChange={(e) => updateParticipant(i, 'email', e.target.value)}
                suppressHydrationWarning
                className="flex-1 px-3 py-2 rounded-lg bg-[#1e233d] border border-[#2e355c] text-white placeholder-[#6b7294] text-xs focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/50"
              />
              {participants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeParticipant(i)}
                  className="p-2 text-[#8b8ba3] hover:text-red-400 transition-colors"
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
            className="text-xs text-[#a29bfe] hover:text-white flex items-center gap-1 mt-1 font-medium"
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
        <div className="pt-2 border-t border-[#232845]">
          <label className="text-xs font-semibold text-[#8b8ba3] uppercase tracking-wider block mb-2">
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                transcriptMode === 'upload'
                  ? 'bg-[#6C5CE7] text-white shadow-sm'
                  : 'bg-[#1e233d] text-[#8b8ba3] hover:text-white'
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                transcriptMode === 'paste'
                  ? 'bg-[#6C5CE7] text-white shadow-sm'
                  : 'bg-[#1e233d] text-[#8b8ba3] hover:text-white'
              }`}
            >
              <FileText size={13} /> Paste Transcript
            </button>
          </div>

          {transcriptMode === 'upload' && (
            <div className="relative">
              <input
                type="file"
                accept=".vtt,.txt,.json"
                onChange={handleFileChange}
                suppressHydrationWarning
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="border-2 border-dashed border-[#2d345a] rounded-xl p-5 text-center hover:border-[#6C5CE7] transition-colors bg-[#181c33]/50">
                {transcriptFile ? (
                  <div className="flex items-center justify-center gap-2">
                    <FileText size={16} className="text-[#6C5CE7]" />
                    <span className="text-xs font-medium text-white">{transcriptFile.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTranscriptFile(null);
                      }}
                      className="text-[#8b8ba3] hover:text-red-400 ml-2"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload size={22} className="text-[#6C5CE7] mx-auto mb-1.5" />
                    <p className="text-xs text-[#e0e0e0] font-medium">Click or drag a transcript file</p>
                    <p className="text-[11px] text-[#6b7294] mt-0.5">Supports WebVTT (.vtt), plain text (.txt), and JSON</p>
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
              rows={5}
              suppressHydrationWarning
              className="w-full px-3 py-2 rounded-xl bg-[#1e233d] border border-[#2d345a] text-white placeholder-[#6b7294] text-xs focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/50 resize-none font-mono"
            />
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2.5 pt-3 border-t border-[#232845]">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={createMeeting.isPending}>
            {createMeeting.isPending ? 'Creating Meeting...' : 'Create Meeting'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
