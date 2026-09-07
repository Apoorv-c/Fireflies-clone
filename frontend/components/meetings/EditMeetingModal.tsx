'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useUpdateMeeting } from '@/hooks/useMeetings';
import { useToast } from '@/components/ui/Toast';
import type { Meeting } from '@/types';

const editSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  duration_minutes: z.coerce.number().min(1, 'Duration must be at least 1 minute'),
});

type EditFormData = z.infer<typeof editSchema>;

interface EditMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: Meeting;
}

export default function EditMeetingModal({ isOpen, onClose, meeting }: EditMeetingModalProps) {
  const { showToast } = useToast();
  const updateMeeting = useUpdateMeeting();

  const { register, handleSubmit, formState: { errors } } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: meeting.title,
      date: meeting.date.slice(0, 16),
      duration_minutes: Math.floor(meeting.duration_seconds / 60),
    },
  });

  const onSubmit = async (data: EditFormData) => {
    try {
      await updateMeeting.mutateAsync({
        id: meeting.id,
        data: {
          title: data.title,
          date: new Date(data.date).toISOString(),
          duration_seconds: data.duration_minutes * 60,
        },
      });
      showToast('Meeting updated successfully');
      onClose();
    } catch {
      showToast('Failed to update meeting', 'error');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Meeting">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Title" error={errors.title?.message} {...register('title')} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Date & Time" type="datetime-local" error={errors.date?.message} {...register('date')} />
          <Input label="Duration (minutes)" type="number" error={errors.duration_minutes?.message} {...register('duration_minutes')} />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={updateMeeting.isPending}>
            {updateMeeting.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
