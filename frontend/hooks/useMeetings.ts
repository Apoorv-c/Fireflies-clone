'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMeetings, getMeeting, createMeeting, updateMeeting, deleteMeeting } from '@/lib/api';

export function useMeetings(params?: {
  search?: string;
  sort_by?: string;
  date_from?: string;
  date_to?: string;
  participant?: string;
}) {
  return useQuery({
    queryKey: ['meetings', params],
    queryFn: () => getMeetings(params),
  });
}

export function useMeeting(id: number) {
  return useQuery({
    queryKey: ['meeting', id],
    queryFn: () => getMeeting(id),
    enabled: !!id,
  });
}

export function useCreateMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMeeting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    },
  });
}

export function useUpdateMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateMeeting>[1] }) =>
      updateMeeting(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      queryClient.invalidateQueries({ queryKey: ['meeting', variables.id] });
    },
  });
}

export function useDeleteMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMeeting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    },
  });
}
