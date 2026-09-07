'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useCreateMeeting } from '@/hooks/useMeetings';
import { useToast } from '@/components/ui/Toast';
import { Plus, Trash2 } from 'lucide-react';

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
  const [participants, setParticipants] = useState<{ name: string; email: string }[]>([{ name: '', email: '' }]);

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

  const onSubmit = async (data: MeetingFormData) => {
    try {
      const validParticipants = participants.filter(p => p.name.trim());
      const tags = data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

      await createMeeting.mutateAsync({
        title: data.title,
        date: new Date(data.date).toISOString(),
        duration_seconds: data.duration_minutes * 60,
        participants: validParticipants,
        tags,
      });

      showToast('Meeting created successfully');
      reset();
      setParticipants([{ name: '', email: '' }]);
      onClose();
    } catch {
      showToast('Failed to create meeting', 'error');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Meeting" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={createMeeting.isPending}>
            {createMeeting.isPending ? 'Creating...' : 'Create Meeting'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
