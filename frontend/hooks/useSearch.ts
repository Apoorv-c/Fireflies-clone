'use client';

import { useQuery } from '@tanstack/react-query';
import { searchTranscripts } from '@/lib/api';
import { useState, useEffect } from 'react';

export function useSearch(query: string, meetingId?: number) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  return useQuery({
    queryKey: ['search', debouncedQuery, meetingId],
    queryFn: () => searchTranscripts(debouncedQuery, meetingId),
    enabled: debouncedQuery.length >= 2,
  });
}
