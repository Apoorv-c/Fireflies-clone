'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTranscript, uploadTranscript } from '@/lib/api';

export function useTranscript(meetingId: number) {
  return useQuery({
    queryKey: ['transcript', meetingId],
    queryFn: () => getTranscript(meetingId),
    enabled: !!meetingId,
  });
}

export function useUploadTranscript() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ meetingId, file }: { meetingId: number; file: File }) =>
      uploadTranscript(meetingId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transcript', variables.meetingId] });
    },
  });
}
