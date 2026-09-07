'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSummary, generateSummary } from '@/lib/api';

export function useSummary(meetingId: number) {
  return useQuery({
    queryKey: ['summary', meetingId],
    queryFn: () => getSummary(meetingId),
    enabled: !!meetingId,
    retry: false,
  });
}

export function useGenerateSummary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateSummary,
    onSuccess: (_, meetingId) => {
      queryClient.invalidateQueries({ queryKey: ['summary', meetingId] });
      queryClient.invalidateQueries({ queryKey: ['meeting', meetingId] });
    },
  });
}
