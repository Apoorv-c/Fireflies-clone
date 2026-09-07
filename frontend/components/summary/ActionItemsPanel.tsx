'use client';

import { useState } from 'react';
import { useActionItems, useCreateActionItem, useUpdateActionItem, useDeleteActionItem } from '@/hooks/useActionItems';
import { useToast } from '@/components/ui/Toast';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import { Plus, Trash2, CheckSquare } from 'lucide-react';

interface ActionItemsPanelProps {
  meetingId: number;
}

export default function ActionItemsPanel({ meetingId }: ActionItemsPanelProps) {
  const { data: items, isLoading } = useActionItems(meetingId);
  const createItem = useCreateActionItem();
  const updateItem = useUpdateActionItem();
  const deleteItem = useDeleteActionItem();
  const { showToast } = useToast();

  const [newDescription, setNewDescription] = useState('');
  const [newAssignee, setNewAssignee] = useState('');

  const handleAdd = async () => {
    if (!newDescription.trim()) return;
    try {
      await createItem.mutateAsync({
        meetingId,
        data: {
          description: newDescription.trim(),
          assignee: newAssignee.trim() || undefined,
        },
      });
      setNewDescription('');
      setNewAssignee('');
      showToast('Action item added');
    } catch {
      showToast('Failed to add action item', 'error');
    }
  };

  const handleToggle = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      await updateItem.mutateAsync({ id, data: { status: newStatus } });
    } catch {
      showToast('Failed to update action item', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteItem.mutateAsync(id);
      showToast('Action item deleted');
    } catch {
      showToast('Failed to delete action item', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 text-[#6C5CE7]">
        <CheckSquare size={16} />
        <span className="text-sm font-semibold">Action Items</span>
        {items && (
          <span className="text-xs text-[#8b8ba3]">
            ({items.filter(i => i.status === 'completed').length}/{items.length} done)
          </span>
        )}
      </div>

      {/* Items List */}
      <div className="space-y-2 mb-4">
        {items?.map((item) => (
          <div
            key={item.id}
            className={`flex items-start gap-3 px-3 py-2.5 rounded-lg group transition-all
              ${item.status === 'completed' ? 'bg-[#1a1a2e]/50' : 'bg-[#1a1a2e] hover:bg-[#2a2a4a]/50'}`}
          >
            <input
              type="checkbox"
              checked={item.status === 'completed'}
              onChange={() => handleToggle(item.id, item.status)}
              className="mt-0.5 w-4 h-4 rounded border-[#3a3a5a] bg-[#2a2a4a] text-[#6C5CE7] focus:ring-[#6C5CE7] focus:ring-offset-0 cursor-pointer accent-[#6C5CE7]"
            />
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${item.status === 'completed' ? 'line-through text-[#8b8ba3]/50' : 'text-[#e0e0e0]'}`}>
                {item.description}
              </p>
              {item.assignee && (
                <Badge className="mt-1" color="#6C5CE7">
                  {item.assignee}
                </Badge>
              )}
            </div>
            <button
              onClick={() => handleDelete(item.id)}
              className="opacity-0 group-hover:opacity-100 p-1 text-[#8b8ba3] hover:text-red-400 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Add New */}
      <div className="border-t border-[#2a2a4a] pt-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add action item..."
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            suppressHydrationWarning
            className="flex-1 px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-sm text-[#e0e0e0] placeholder-[#6b6b8a] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/50"
          />
          <input
            type="text"
            placeholder="Assignee"
            value={newAssignee}
            onChange={(e) => setNewAssignee(e.target.value)}
            suppressHydrationWarning
            className="w-28 px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg text-sm text-[#e0e0e0] placeholder-[#6b6b8a] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/50"
          />
          <button
            onClick={handleAdd}
            disabled={!newDescription.trim()}
            className="p-2 bg-[#6C5CE7] hover:bg-[#5a4bd6] text-white rounded-lg disabled:opacity-50 transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
