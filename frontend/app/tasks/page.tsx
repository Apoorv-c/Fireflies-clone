'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  MessageSquare,
  Plus,
  Check,
  Calendar,
  User,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Circle,
  SlidersHorizontal,
  X,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { getAllActionItems, createStandaloneActionItem, updateActionItem, deleteActionItem, getMeetings } from '@/lib/api';
import type { ActionItem, Meeting } from '@/types';

// App icons for the "Automatically send all your tasks to your work apps" banner
function WorkAppIcons() {
  return (
    <div className="flex items-center -space-x-1.5 shrink-0">
      {/* Asana */}
      <div className="w-6 h-6 rounded-md bg-white border border-slate-200 shadow-xs flex items-center justify-center p-0.5 z-40">
        <div className="flex flex-col items-center gap-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#F06A6A]" />
          <div className="flex gap-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#F06A6A]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#F06A6A]" />
          </div>
        </div>
      </div>

      {/* Monday.com */}
      <div className="w-6 h-6 rounded-md bg-white border border-slate-200 shadow-xs flex items-center justify-center p-0.5 z-30">
        <div className="flex items-center gap-0.5">
          <span className="w-1 h-3 rounded-full bg-rose-500" />
          <span className="w-1 h-2 rounded-full bg-amber-400" />
          <span className="w-1 h-3 rounded-full bg-emerald-500" />
        </div>
      </div>

      {/* Trello */}
      <div className="w-6 h-6 rounded-md bg-[#0079BF] border border-slate-200 shadow-xs flex items-center justify-center p-1 z-20 text-white">
        <div className="flex gap-0.5 h-full w-full justify-center">
          <span className="w-1 bg-white rounded-xs h-3" />
          <span className="w-1 bg-white rounded-xs h-2" />
        </div>
      </div>

      {/* ClickUp */}
      <div className="w-6 h-6 rounded-md bg-white border border-slate-200 shadow-xs flex items-center justify-center p-0.5 z-10">
        <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#7B68EE] via-[#FF007F] to-[#00E676] flex items-center justify-center text-white text-[7px] font-bold">
          ▲
        </div>
      </div>
    </div>
  );
}

// Lavender stacked rectangles outline icon from user screenshot media_1788810252268.png
function EmptyTasksIllustration() {
  return (
    <div className="w-12 h-12 flex flex-col items-center justify-center gap-1.5 mb-2">
      <div className="w-8 h-3.5 rounded-md border-2 border-[#d9d2fa] bg-[#f8f6fe]" />
      <div className="w-8 h-3.5 rounded-md border-2 border-[#d9d2fa] bg-[#f8f6fe]" />
    </div>
  );
}

export default function TasksPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'my-tasks' | 'all-tasks'>('my-tasks');
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState<ActionItem[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAssignee, setNewAssignee] = useState('Alex Vance');
  const [newDueDate, setNewDueDate] = useState('');
  const [selectedMeetingId, setSelectedMeetingId] = useState<number | undefined>();
  const [feedbackText, setFeedbackText] = useState('');

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Ctrl+K to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch initial tasks & meetings from API
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [items, mList] = await Promise.all([
          getAllActionItems().catch(() => []),
          getMeetings().catch(() => [])
        ]);
        setTasks(items);
        setMeetings(mList);
      } catch {
        showToast('Could not load tasks', 'error');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [showToast]);

  // Current logged in user is Alex Vance
  const currentUser = 'Alex Vance';

  // Filter tasks based on activeTab (My Tasks vs All Tasks) and search query
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const isMyTask =
        !t.assignee ||
        t.assignee.toLowerCase().includes('alex') ||
        t.assignee.toLowerCase().includes('all');

      const matchesTab = activeTab === 'all-tasks' || isMyTask;

      const matchesSearch =
        searchQuery.trim() === '' ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.assignee && t.assignee.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesTab && matchesSearch;
    });
  }, [tasks, activeTab, searchQuery]);

  // Toggle completion status
  const handleToggleTask = async (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t))
    );

    try {
      await updateActionItem(id, { status: nextStatus });
      showToast(
        nextStatus === 'completed' ? 'Task completed!' : 'Task marked pending',
        'success'
      );
    } catch {
      // Revert if API fails
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: task.status } : t))
      );
      showToast('Failed to update task status', 'error');
    }
  };

  // Delete task
  const handleDeleteTask = async (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteActionItem(id);
      showToast('Task removed', 'info');
    } catch {
      showToast('Failed to delete task', 'error');
    }
  };

  // Create new task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const created = await createStandaloneActionItem({
        description: newTitle.trim(),
        assignee: newAssignee,
        due_date: newDueDate ? new Date(newDueDate).toISOString() : undefined
      });

      setTasks((prev) => [created, ...prev]);
      showToast('New task created successfully!', 'success');
      setNewTitle('');
      setNewDueDate('');
      setIsNewTaskOpen(false);
    } catch {
      showToast('Failed to create task', 'error');
    }
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    showToast('Thank you for your feedback on Tasks!', 'success');
    setFeedbackText('');
    setIsFeedbackOpen(false);
  };

  const getMeetingTitle = (meetingId?: number) => {
    if (!meetingId) return null;
    const m = meetings.find((item) => item.id === meetingId);
    return m ? m.title : `Meeting #${meetingId}`;
  };

  return (
    <div className="max-w-5xl mx-auto py-4 px-2 sm:px-4 space-y-6" suppressHydrationWarning>
      {/* 1. Top Search Bar with Ctrl + K */}
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center">
          <Search size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or keyword"
            className="w-full pl-10 pr-20 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/20 focus:border-[#6C5CE7] transition-all shadow-xs"
          />
          <div className="absolute right-3 flex items-center">
            <kbd className="px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded-md select-none">
              Ctrl + K
            </kbd>
          </div>
        </div>
      </div>

      {/* 2. Tabs & Share Feedback Link Header */}
      <div className="flex items-center justify-between pt-1">
        {/* Segmented Pill Tabs */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/70">
          <button
            type="button"
            onClick={() => setActiveTab('my-tasks')}
            className={`px-4 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
              activeTab === 'my-tasks'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            My Tasks
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('all-tasks')}
            className={`px-4 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
              activeTab === 'all-tasks'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            All Tasks
          </button>
        </div>

        {/* Share Feedback */}
        <button
          type="button"
          onClick={() => setIsFeedbackOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <MessageSquare size={13} className="text-slate-400" />
          <span>Share Feedback</span>
        </button>
      </div>

      {/* 3. Work Apps Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 px-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <WorkAppIcons />
          <span className="text-xs font-medium text-slate-700">
            Automatically send all your tasks to your work apps.
          </span>
        </div>

        <Link
          href="/integrations"
          className="text-xs font-semibold text-[#6C5CE7] hover:underline cursor-pointer"
        >
          Connect
        </Link>
      </div>

      {/* 4. Main Tasks Area: Empty State OR Populated List */}
      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white border border-slate-200/80 rounded-3xl shadow-xs">
          <EmptyTasksIllustration />

          <h3 className="text-base font-bold text-slate-900 mt-2 mb-1">
            All your meeting tasks in one place
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
            Manage, assign and update all your meeting tasks here.
          </p>

          <button
            type="button"
            onClick={() => setIsNewTaskOpen(true)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#6C5CE7] hover:bg-[#5a4bd6] text-white text-xs font-bold shadow-sm hover:shadow transition-all cursor-pointer active:scale-95"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>New</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header toolbar when tasks exist */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">
                {activeTab === 'my-tasks' ? 'My Assigned Tasks' : 'Team Meeting Tasks'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-mono">
                {filteredTasks.length}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsNewTaskOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#6C5CE7] hover:bg-[#5a4bd6] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Plus size={13} />
              <span>New Task</span>
            </button>
          </div>

          {/* Tasks List */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs divide-y divide-slate-100 overflow-hidden">
            {filteredTasks.map((task) => {
              const isDone = task.status === 'completed';
              const meetingTitle = getMeetingTitle(task.meeting_id);

              return (
                <div
                  key={task.id}
                  className={`p-4 flex items-start justify-between gap-3 transition-colors hover:bg-slate-50/70 group ${
                    isDone ? 'bg-slate-50/40 opacity-75' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => handleToggleTask(task.id)}
                      className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${
                        isDone
                          ? 'bg-[#6C5CE7] border-[#6C5CE7] text-white'
                          : 'border-slate-300 hover:border-[#6C5CE7] bg-white'
                      }`}
                    >
                      {isDone && <Check size={11} strokeWidth={3} />}
                    </button>

                    <div className="min-w-0">
                      <p
                        className={`text-xs font-medium transition-all ${
                          isDone ? 'line-through text-slate-400' : 'text-slate-800'
                        }`}
                      >
                        {task.description}
                      </p>

                      <div className="flex items-center gap-2 flex-wrap mt-1.5 text-[11px] text-slate-400">
                        {/* Assignee */}
                        {task.assignee && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                            <User size={10} />
                            <span>{task.assignee}</span>
                          </span>
                        )}

                        {/* Source Meeting */}
                        {meetingTitle && (
                          <Link
                            href={`/meetings/${task.meeting_id}`}
                            className="text-[#6C5CE7] hover:underline flex items-center gap-0.5 truncate max-w-[200px]"
                            title={meetingTitle}
                          >
                            <span>From: {meetingTitle}</span>
                            <ExternalLink size={10} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task.id)}
                      title="Delete task"
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Create Task Modal */}
      {isNewTaskOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95">
            <button
              type="button"
              onClick={() => setIsNewTaskOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#6C5CE7] flex items-center justify-center">
                <Plus size={16} />
              </div>
              <h3 className="text-base font-bold text-slate-900">Create New Task</h3>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Follow up with engineering on API rate limits"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Assignee
                </label>
                <select
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7] cursor-pointer"
                >
                  <option value="Alex Vance">Alex Vance (You)</option>
                  <option value="Sarah Chen">Sarah Chen</option>
                  <option value="Mike Johnson">Mike Johnson</option>
                  <option value="Emily Park">Emily Park</option>
                  <option value="David Kim">David Kim</option>
                  <option value="All Team">All Team</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewTaskOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#6C5CE7] hover:bg-[#5a4bd6] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Share Feedback Modal */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95">
            <button
              type="button"
              onClick={() => setIsFeedbackOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={18} className="text-[#6C5CE7]" />
              <h3 className="text-base font-bold text-slate-900">Share Feedback on Tasks</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              How can we make task management and meeting action items better for your team?
            </p>

            <form onSubmit={handleSendFeedback} className="space-y-3.5">
              <textarea
                required
                rows={4}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Tell us what you would like to see in Tasks..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
              />

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFeedbackOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#6C5CE7] hover:bg-[#5a4bd6] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
