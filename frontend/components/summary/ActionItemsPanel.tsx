'use client';

import { useState } from 'react';
import { useActionItems, useCreateActionItem, useUpdateActionItem, useDeleteActionItem } from '@/hooks/useActionItems';
import { useToast } from '@/components/ui/Toast';
import Skeleton from '@/components/ui/Skeleton';
import { Plus, Trash2, CheckSquare, User } from 'lucide-react';

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

  const handleAdd = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
          <Skeleton key={i} className="h-12 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const actionList = items || [];
  const completedCount = actionList.filter((i) => i.status === 'completed').length;

  return (
    <div className="space-y-4" suppressHydrationWarning>
      {/* Header with completion counter */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <CheckSquare size={16} className="text-[#6C5CE7]" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Action Items ({actionList.length})
          </span>
        </div>
        <span className="text-xs font-medium text-[#a29bfe] px-2 py-0.5 rounded-full bg-[#1e233d]">
          {completedCount} of {actionList.length} completed
        </span>
      </div>

      {/* Items List */}
      <div className="space-y-2">
        {actionList.map((item) => {
          const isDone = item.status === 'completed';
          return (
            <div
              key={item.id}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-150 group ${
                isDone
                  ? 'bg-[#121526]/70 border-[#1f243d] opacity-75'
                  : 'bg-[#161a2e] border-[#252b47] hover:border-[#353e66]'
              }`}
            >
              <input
                type="checkbox"
                checked={isDone}
                onChange={() => handleToggle(item.id, item.status)}
                suppressHydrationWarning
                className="mt-0.5 w-4 h-4 rounded border-[#3a4168] bg-[#1e233d] text-[#6C5CE7] focus:ring-0 cursor-pointer accent-[#6C5CE7]"
              />

              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs sm:text-sm leading-relaxed transition-all ${
                    isDone ? 'line-through text-[#6b7294]' : 'text-[#f1f3fa] font-medium'
                  }`}
                >
                  {item.description}
                </p>

                {item.assignee && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#1e233d] text-[#a29bfe] border border-[#2d345a]">
                      <User size={10} />
                      {item.assignee}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                title="Delete action item"
                suppressHydrationWarning
                className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-[#8b8ba3] hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}

        {actionList.length === 0 && (
          <div className="text-center py-12 text-[#8b8ba3]">
            <CheckSquare size={24} className="mx-auto mb-2 opacity-40 text-[#6C5CE7]" />
            <p className="text-xs">No action items yet. Add one below!</p>
          </div>
        )}
      </div>

      {/* Add New Item Form */}
      <form onSubmit={handleAdd} className="pt-3 border-t border-[#232845]">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Add new action item..."
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            suppressHydrationWarning
            className="w-full px-3 py-2 bg-[#1e233d] border border-[#2d345a] rounded-xl text-xs text-white placeholder-[#6b7294] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/50 transition-all"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Assignee (optional)"
              value={newAssignee}
              onChange={(e) => setNewAssignee(e.target.value)}
              suppressHydrationWarning
              className="flex-1 px-3 py-2 bg-[#1e233d] border border-[#2d345a] rounded-xl text-xs text-white placeholder-[#6b7294] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/50 transition-all"
            />
            <button
              type="submit"
              disabled={!newDescription.trim()}
              suppressHydrationWarning
              className="px-4 py-2 bg-[#6C5CE7] hover:bg-[#5a4bd6] disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
            >
              <Plus size={14} />
              <span>Add</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
