'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { usePlayerStore } from '@/lib/store';
import type { TranscriptSegment } from '@/types';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface AudioPlayerProps {
  audioUrl: string | null;
  duration: number;
  segments?: TranscriptSegment[];
}

export default function AudioPlayer({ audioUrl, duration: meetingDuration, segments = [] }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { currentTime, isPlaying, duration, setCurrentTime, setIsPlaying, setDuration } = usePlayerStore();
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [voiceVoiceover, setVoiceVoiceover] = useState<boolean>(true);

  // Sync total duration
  useEffect(() => {
    setDuration(meetingDuration);
  }, [meetingDuration, setDuration]);

  // Handle native audio events if real audio is provided
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

  // Voice narration using Web Speech API when audioUrl is not available
  const speakCurrentSegment = useCallback((time: number) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !voiceVoiceover) return;

    // Find segment corresponding to current time
    const currentSeg = segments.find(s => time >= s.start_time && time < s.end_time);
    if (!currentSeg) return;

    window.speechSynthesis.cancel(); // Stop prior speech
    if (isMuted) return;

    const utterance = new SpeechSynthesisUtterance(currentSeg.content);
    utterance.rate = playbackRate;
    utterance.volume = isMuted ? 0 : volume;
    window.speechSynthesis.speak(utterance);
  }, [segments, voiceVoiceover, playbackRate, volume, isMuted]);

  // Play / Pause toggle
  const togglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);

    if (audioRef.current && audioUrl) {
      if (nextState) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    } else {
      if (nextState) {
        speakCurrentSegment(currentTime);
      } else {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      }
    }
  };

  // Clock progression when simulated
  useEffect(() => {
    if (!audioUrl && isPlaying) {
      const interval = setInterval(() => {
        const nextTime = usePlayerStore.getState().currentTime + (0.5 * playbackRate);
        const maxDuration = duration || meetingDuration || 3600;

        if (nextTime >= maxDuration) {
          setIsPlaying(false);
          setCurrentTime(0);
          if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
          }
        } else {
          setCurrentTime(nextTime);
        }
      }, 500);

      return () => clearInterval(interval);
    }
  }, [audioUrl, isPlaying, playbackRate, duration, meetingDuration, setCurrentTime, setIsPlaying]);

  const handleSeek = (time: number) => {
    const clamped = Math.max(0, Math.min(time, duration || meetingDuration));
    setCurrentTime(clamped);
    if (audioRef.current) {
      audioRef.current.currentTime = clamped;
    }
    if (isPlaying) {
      speakCurrentSegment(clamped);
    }
  };

  const skipSeconds = (delta: number) => {
    handleSeek(currentTime + delta);
  };

  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 2];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    if (!isMuted && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const effectiveDuration = duration || meetingDuration || 1;
  const progress = Math.min(100, (currentTime / effectiveDuration) * 100);

  return (
    <div className="bg-[#121526] border border-[#232845] rounded-xl p-4 mb-6 shadow-xl" suppressHydrationWarning>
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}

      {/* Scrubber and Waveform */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs font-mono text-[#8b8ba3] mb-1.5">
          <span className="text-[#a29bfe] font-semibold">{formatTime(currentTime)}</span>
          <div className="flex items-center gap-1.5 text-[11px] text-[#6b6b8a]">
            {isPlaying && (
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Playing
              </span>
            )}
            <span>/</span>
            <span>{formatTime(effectiveDuration)}</span>
          </div>
        </div>

        {/* Custom Scrubber Bar */}
        <div className="relative h-2 bg-[#1e233d] rounded-full overflow-hidden cursor-pointer group">
          {/* Visual pseudo-waveform */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#6C5CE7] to-[#a29bfe] rounded-full transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
          <input
            type="range"
            min={0}
            max={effectiveDuration}
            step={0.5}
            value={currentTime}
            onChange={(e) => handleSeek(parseFloat(e.target.value))}
            suppressHydrationWarning
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Player Controls Bar */}
      <div className="flex items-center justify-between gap-4">
        {/* Left: Skip & Play Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => skipSeconds(-5)}
            title="Rewind 5s"
            suppressHydrationWarning
            className="p-2 rounded-lg text-[#8b8ba3] hover:text-white hover:bg-[#1f243d] transition-colors"
          >
            <RotateCcw size={18} />
          </button>

          <button
            onClick={togglePlay}
            suppressHydrationWarning
            className="w-11 h-11 rounded-full bg-[#6C5CE7] hover:bg-[#5a4bd6] flex items-center justify-center text-white shadow-lg shadow-[#6C5CE7]/30 transition-all hover:scale-105 active:scale-95"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
          </button>

          <button
            onClick={() => skipSeconds(5)}
            title="Forward 5s"
            suppressHydrationWarning
            className="p-2 rounded-lg text-[#8b8ba3] hover:text-white hover:bg-[#1f243d] transition-colors"
          >
            <RotateCw size={18} />
          </button>
        </div>

        {/* Center: AI Voiceover Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#1a1d30] border border-[#2b3052] rounded-full text-xs text-[#a29bfe]">
          <Sparkles size={13} className="text-[#6C5CE7]" />
          <span>Sync &amp; Speech Narration Active</span>
        </div>

        {/* Right: Speed, Volume, Mute */}
        <div className="flex items-center gap-2">
          {/* Playback speed toggle */}
          <button
            onClick={cyclePlaybackRate}
            suppressHydrationWarning
            className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#1e233d] hover:bg-[#282f52] text-[#e0e0e0] transition-colors border border-[#313860]"
            title="Toggle playback speed"
          >
            {playbackRate}x
          </button>

          {/* Volume toggle */}
          <button
            onClick={toggleMute}
            suppressHydrationWarning
            className="p-2 rounded-lg text-[#8b8ba3] hover:text-white hover:bg-[#1f243d] transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={18} className="text-red-400" /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
