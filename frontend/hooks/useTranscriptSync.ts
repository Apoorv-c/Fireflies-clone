'use client';

import { useEffect, useCallback } from 'react';
import { usePlayerStore } from '@/lib/store';
import type { TranscriptSegment } from '@/types';

export function useTranscriptSync(segments: TranscriptSegment[]) {
  const currentTime = usePlayerStore((s) => s.currentTime);
  const setActiveSegmentId = usePlayerStore((s) => s.setActiveSegmentId);

  const findActiveSegment = useCallback(
    (time: number): number | null => {
      if (!segments.length) return null;

      let low = 0;
      let high = segments.length - 1;

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const seg = segments[mid];

        if (time >= seg.start_time && time < seg.end_time) {
          return seg.id;
        } else if (time < seg.start_time) {
          high = mid - 1;
        } else {
          low = mid + 1;
        }
      }

      // If no exact match, find the closest segment before current time
      for (let i = segments.length - 1; i >= 0; i--) {
        if (segments[i].start_time <= time) {
          return segments[i].id;
        }
      }

      return segments[0]?.id ?? null;
    },
    [segments]
  );

  useEffect(() => {
    const activeId = findActiveSegment(currentTime);
    setActiveSegmentId(activeId);
  }, [currentTime, findActiveSegment, setActiveSegmentId]);
}
