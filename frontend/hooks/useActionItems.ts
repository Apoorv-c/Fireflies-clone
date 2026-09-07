'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getActionItems, createActionItem, updateActionItem, deleteActionItem } from '@/lib/api';
import type { ActionItem } from '@/types';

export function useActionItems(meetingId: number) {
  return useQuery({
    queryKey: ['actionItems', meetingId],
    queryFn: () => getActionItems(meetingId),
    enabled: !!meetingId,
  });
}

export function useCreateActionItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ meetingId, data }: { meetingId: number; data: { description: string; assignee?: string; due_date?: string } }) =>
      createActionItem(meetingId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['actionItems', variables.meetingId] });
    },
  });
}

export function useUpdateActionItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { description?: string; assignee?: string; status?: string; due_date?: string } }) =>
      updateActionItem(id, data),
    onMutate: async ({ id, data }) => {
      const queries = queryClient.getQueriesData<ActionItem[]>({ queryKey: ['actionItems'] });
      for (const [queryKey, oldData] of queries) {
        if (oldData) {
          queryClient.setQueryData(queryKey, oldData.map(item =>
            item.id === id ? { ...item, ...data } : item
          ));
        }
      }
      return { queries };
    },
    onError: (_, __, context) => {
      if (context?.queries) {
        for (const [queryKey, oldData] of context.queries) {
          queryClient.setQueryData(queryKey, oldData);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['actionItems'] });
    },
  });
}

export function useDeleteActionItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteActionItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actionItems'] });
    },
  });
}
