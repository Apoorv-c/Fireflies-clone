'use client';

import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useDeleteMeeting } from '@/hooks/useMeetings';
import { useToast } from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingId: number;
  meetingTitle: string;
}

export default function DeleteConfirmModal({ isOpen, onClose, meetingId, meetingTitle }: DeleteConfirmModalProps) {
  const { showToast } = useToast();
  const deleteMeeting = useDeleteMeeting();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteMeeting.mutateAsync(meetingId);
      showToast('Meeting deleted successfully');
      onClose();
      router.push('/meetings');
    } catch {
      showToast('Failed to delete meeting', 'error');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Meeting">
      <div className="text-center py-4">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} className="text-red-400" />
        </div>
        <p className="text-[#e0e0e0] mb-2">
          Are you sure you want to delete
        </p>
        <p className="text-white font-semibold mb-4">&quot;{meetingTitle}&quot;?</p>
        <p className="text-sm text-[#8b8ba3]">
          This will permanently delete the meeting and all related data including transcripts, summaries, and action items.
        </p>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={handleDelete} disabled={deleteMeeting.isPending}>
          {deleteMeeting.isPending ? 'Deleting...' : 'Delete Meeting'}
        </Button>
      </div>
    </Modal>
  );
}
