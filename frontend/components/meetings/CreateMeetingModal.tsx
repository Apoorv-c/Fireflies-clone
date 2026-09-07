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

  const { register, handleSubmit, reset, formState: { errors } } = useForm<MeetingFormData>({
    resolver: zodResolver(meetingSchema),
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
      const validParticipants = participants.filter(p => p.name.trim());
      const tags = data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

      const meeting = await createMeeting.mutateAsync({
        title: data.title,
        date: new Date(data.date).toISOString(),
        duration_seconds: data.duration_minutes * 60,
        participants: validParticipants,
        tags,
      });

      // Upload transcript file if provided
      if (transcriptFile && meeting.id) {
        try {
          await uploadTranscript.mutateAsync({ meetingId: meeting.id, file: transcriptFile });
          showToast('Meeting created with transcript');
        } catch {
          showToast('Meeting created but transcript upload failed', 'error');
        }
      } else if (transcriptText.trim() && meeting.id) {
        // Create a .txt file from pasted text and upload
        const blob = new Blob([transcriptText], { type: 'text/plain' });
        const file = new File([blob], 'transcript.txt', { type: 'text/plain' });
        try {
          await uploadTranscript.mutateAsync({ meetingId: meeting.id, file });
          showToast('Meeting created with transcript');
        } catch {
          showToast('Meeting created but transcript processing failed', 'error');
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
      showToast('Failed to create meeting', 'error');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Meeting" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        <Input label="Title" placeholder="Meeting title" error={errors.title?.message} {...register('title')} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Date & Time" type="datetime-local" error={errors.date?.message} {...register('date')} />
          <Input label="Duration (minutes)" type="number" placeholder="60" error={errors.duration_minutes?.message} {...register('duration_minutes')} />
        </div>

        {/* Participants */}
        <div>
          <label className="text-sm font-medium text-[#8b8ba3] block mb-2">Participants</label>
          {participants.map((p, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Name"
                value={p.name}
                onChange={(e) => updateParticipant(i, 'name', e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-[#2a2a4a] border border-[#3a3a5a] text-[#e0e0e0] placeholder-[#6b6b8a] text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/50"
              />
              <input
                type="email"
                placeholder="Email"
                value={p.email}
                onChange={(e) => updateParticipant(i, 'email', e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-[#2a2a4a] border border-[#3a3a5a] text-[#e0e0e0] placeholder-[#6b6b8a] text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/50"
              />
              {participants.length > 1 && (
                <button type="button" onClick={() => removeParticipant(i)} className="p-2 text-[#8b8ba3] hover:text-red-400 transition-colors">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addParticipant} className="text-xs text-[#6C5CE7] hover:text-[#a29bfe] flex items-center gap-1 mt-1">
            <Plus size={14} /> Add participant
          </button>
        </div>

        <Input label="Tags (comma-separated)" placeholder="design, review, sprint" {...register('tags')} />

        {/* Transcript Upload / Paste */}
        <div>
          <label className="text-sm font-medium text-[#8b8ba3] block mb-2">Transcript (optional)</label>
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => { setTranscriptMode('upload'); setTranscriptText(''); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                transcriptMode === 'upload' ? 'bg-[#6C5CE7]/15 text-[#6C5CE7]' : 'bg-[#2a2a4a] text-[#8b8ba3] hover:text-[#e0e0e0]'
              }`}
            >
              <Upload size={14} /> Upload file
            </button>
            <button
              type="button"
              onClick={() => { setTranscriptMode('paste'); setTranscriptFile(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                transcriptMode === 'paste' ? 'bg-[#6C5CE7]/15 text-[#6C5CE7]' : 'bg-[#2a2a4a] text-[#8b8ba3] hover:text-[#e0e0e0]'
              }`}
            >
              <FileText size={14} /> Paste text
            </button>
          </div>

          {transcriptMode === 'upload' && (
            <div className="relative">
              <input
                type="file"
                accept=".vtt,.txt,.json"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="border-2 border-dashed border-[#3a3a5a] rounded-lg p-4 text-center hover:border-[#6C5CE7]/50 transition-colors">
                {transcriptFile ? (
                  <div className="flex items-center justify-center gap-2">
                    <FileText size={16} className="text-[#6C5CE7]" />
                    <span className="text-sm text-[#e0e0e0]">{transcriptFile.name}</span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setTranscriptFile(null); }}
                      className="text-[#8b8ba3] hover:text-red-400 ml-2"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload size={20} className="text-[#6b6b8a] mx-auto mb-1" />
                    <p className="text-xs text-[#6b6b8a]">Drop a .vtt, .txt, or .json file here</p>
                  </>
                )}
              </div>
            </div>
          )}

          {transcriptMode === 'paste' && (
            <textarea
              value={transcriptText}
              onChange={(e) => setTranscriptText(e.target.value)}
              placeholder="Paste transcript text here...&#10;&#10;Format: one line per segment, or JSON array [{speaker, start, end, text}]"
              rows={6}
              className="w-full px-3 py-2 rounded-lg bg-[#2a2a4a] border border-[#3a3a5a] text-[#e0e0e0] placeholder-[#6b6b8a] text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/50 resize-none"
            />
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2 sticky bottom-0 bg-[#16213e]">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={createMeeting.isPending}>
            {createMeeting.isPending ? 'Creating...' : 'Create Meeting'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
