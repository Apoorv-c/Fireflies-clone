'use client';

import { useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { usePlayerStore } from '@/lib/store';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface AudioPlayerProps {
  audioUrl: string | null;
  duration: number;
}

export default function AudioPlayer({ audioUrl, duration: meetingDuration }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { currentTime, isPlaying, duration, setCurrentTime, setIsPlaying, setDuration } = usePlayerStore();

  useEffect(() => {
    setDuration(meetingDuration);
  }, [meetingDuration, setDuration]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [setCurrentTime, setDuration, setIsPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      // No audio - simulate playback for demo
      setIsPlaying(!isPlaying);
    }
  };

  // Simulate playback when no audio URL
  useEffect(() => {
    if (!audioUrl && isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(usePlayerStore.getState().currentTime + 0.25);
      }, 250);
      return () => clearInterval(interval);
    }
  }, [audioUrl, isPlaying, setCurrentTime]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const effectiveDuration = duration || meetingDuration;
  const progress = effectiveDuration > 0 ? (currentTime / effectiveDuration) * 100 : 0;

  return (
    <div className="bg-[#1a1a2e] rounded-lg px-5 py-3 mb-6">
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}

      <div className="flex items-center gap-4">
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-[#6C5CE7] hover:bg-[#5a4bd6] flex items-center justify-center text-white transition-colors flex-shrink-0"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>

        {/* Time */}
        <span className="text-sm text-[#8b8ba3] font-mono w-12 text-right">
          {formatTime(currentTime)}
        </span>

        {/* Seek Bar */}
        <div className="flex-1 relative group">
          <div className="w-full h-1.5 bg-[#2a2a4a] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#6C5CE7] rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={effectiveDuration}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Duration */}
        <span className="text-sm text-[#8b8ba3] font-mono w-12">
          {formatTime(effectiveDuration)}
        </span>

        {/* Volume */}
        <button className="text-[#8b8ba3] hover:text-[#e0e0e0] transition-colors">
          <Volume2 size={18} />
        </button>
      </div>
    </div>
  );
}
