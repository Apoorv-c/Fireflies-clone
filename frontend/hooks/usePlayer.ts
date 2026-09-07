'use client';

import { useRef, useCallback, useEffect } from 'react';
import { usePlayerStore } from '@/lib/store';

export function usePlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { setCurrentTime, setIsPlaying, setDuration, isPlaying } = usePlayerStore();

  const play = useCallback(() => {
    audioRef.current?.play();
    setIsPlaying(true);
  }, [setIsPlaying]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, [setIsPlaying]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seek = useCallback(
    (time: number) => {
      if (audioRef.current) {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
      }
    },
    [setCurrentTime]
  );

  const onTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, [setCurrentTime]);

  const onLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, [setDuration]);

  const onEnded = useCallback(() => {
    setIsPlaying(false);
  }, [setIsPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', onTimeUpdate);
      audio.addEventListener('loadedmetadata', onLoadedMetadata);
      audio.addEventListener('ended', onEnded);

      return () => {
        audio.removeEventListener('timeupdate', onTimeUpdate);
        audio.removeEventListener('loadedmetadata', onLoadedMetadata);
        audio.removeEventListener('ended', onEnded);
      };
    }
  }, [onTimeUpdate, onLoadedMetadata, onEnded]);

  return { audioRef, play, pause, togglePlay, seek };
}
