'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Sparkles, Volume1 } from 'lucide-react';
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
  const { currentTime, isPlaying, duration, activeSegmentId, setCurrentTime, setIsPlaying, setDuration, setActiveSegmentId } = usePlayerStore();
  
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [volume, setVolume] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [voiceVoiceover, setVoiceVoiceover] = useState<boolean>(true);
  const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null);

  // References for speech synthesis engine
  const currentSpeakingIndexRef = useRef<number | null>(null);
  const isSpeakingRef = useRef<boolean>(false);
  const keepAliveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Sync total duration
  useEffect(() => {
    setDuration(meetingDuration);
  }, [meetingDuration, setDuration]);

  // Load browser voices
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const updateVoices = () => {
      const vs = window.speechSynthesis.getVoices();
      if (vs && vs.length > 0) {
        voicesRef.current = vs;
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Pick a voice and pitch for a specific speaker to give each person a unique character
  const getSpeakerVoiceSettings = useCallback((speakerLabel: string) => {
    const voices = voicesRef.current;
    if (!voices || voices.length === 0) {
      return { voice: null, pitch: 1.0 };
    }

    // Filter English voices if available, otherwise any
    const enVoices = voices.filter(v => v.lang.startsWith('en'));
    const pool = enVoices.length > 0 ? enVoices : voices;

    // Hash speaker name into consistent index
    let hash = 0;
    for (let i = 0; i < speakerLabel.length; i++) {
      hash = (hash << 5) - hash + speakerLabel.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash);
    const selectedVoice = pool[absHash % pool.length];

    // Subtle pitch variations: 0.9 (deeper), 1.0 (neutral), 1.15 (lighter)
    const pitches = [0.95, 1.05, 0.9, 1.1, 1.0];
    const pitch = pitches[absHash % pitches.length];

    return { voice: selectedVoice, pitch };
  }, []);

  // Clear running timers
  const clearTimers = useCallback(() => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    if (keepAliveTimerRef.current) {
      clearInterval(keepAliveTimerRef.current);
      keepAliveTimerRef.current = null;
    }
  }, []);

  // Main speech synthesis trigger for a given segment index
  const speakSegment = useCallback((index: number) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    clearTimers();
    window.speechSynthesis.cancel();

    if (index < 0 || index >= segments.length) {
      setIsPlaying(false);
      isSpeakingRef.current = false;
      currentSpeakingIndexRef.current = null;
      setCurrentSpeaker(null);
      return;
    }

    const seg = segments[index];
    currentSpeakingIndexRef.current = index;
    isSpeakingRef.current = true;
    setCurrentSpeaker(seg.speaker_label);
    setCurrentTime(seg.start_time);
    setActiveSegmentId(seg.id);

    // If user disabled voice voiceover or is muted, silently advance time
    if (!voiceVoiceover || isMuted) {
      const segDuration = Math.max(1, seg.end_time - seg.start_time);
      const startTime = Date.now();

      progressTimerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000 * playbackRate;
        const nextTime = seg.start_time + elapsed;

        if (nextTime >= seg.end_time) {
          clearInterval(progressTimerRef.current!);
          progressTimerRef.current = null;
          if (usePlayerStore.getState().isPlaying) {
            speakSegment(index + 1);
          }
        } else {
          setCurrentTime(nextTime);
        }
      }, 100);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(seg.content);
    utterance.rate = playbackRate;
    utterance.volume = volume;

    const { voice, pitch } = getSpeakerVoiceSettings(seg.speaker_label || 'Speaker');
    if (voice) utterance.voice = voice;
    utterance.pitch = pitch;

    // Smooth scrubber progress while speaking
    const segDuration = Math.max(1, seg.end_time - seg.start_time);
    let utteranceStartTime = Date.now();

    utterance.onstart = () => {
      utteranceStartTime = Date.now();
      isSpeakingRef.current = true;

      progressTimerRef.current = setInterval(() => {
        const elapsed = (Date.now() - utteranceStartTime) / 1000 * playbackRate;
        const progressTime = Math.min(seg.end_time, seg.start_time + elapsed);
        setCurrentTime(progressTime);
      }, 150);

      // Chrome 14-second pause bug workaround
      keepAliveTimerRef.current = setInterval(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 9000);
    };

    utterance.onend = () => {
      clearTimers();
      isSpeakingRef.current = false;
      setCurrentTime(seg.end_time);

      // Advance to next segment if still in playing mode
      if (usePlayerStore.getState().isPlaying) {
        if (index + 1 < segments.length) {
          setTimeout(() => {
            if (usePlayerStore.getState().isPlaying) {
              speakSegment(index + 1);
            }
          }, 100);
        } else {
          setIsPlaying(false);
          setCurrentTime(0);
          currentSpeakingIndexRef.current = null;
          setCurrentSpeaker(null);
        }
      }
    };

    utterance.onerror = (e) => {
      clearTimers();
      isSpeakingRef.current = false;
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        if (usePlayerStore.getState().isPlaying && index + 1 < segments.length) {
          speakSegment(index + 1);
        }
      }
    };

    window.speechSynthesis.speak(utterance);
  }, [segments, voiceVoiceover, isMuted, playbackRate, volume, getSpeakerVoiceSettings, clearTimers, setCurrentTime, setActiveSegmentId, setIsPlaying]);

  // Handle native audio element if real audio URL is available
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

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
  }, [audioUrl, setCurrentTime, setDuration, setIsPlaying]);

  // React to isPlaying changes from store (both internal button clicks and external triggers)
  useEffect(() => {
    if (audioUrl) {
      if (isPlaying) {
        audioRef.current?.play().catch(() => {});
      } else {
        audioRef.current?.pause();
      }
      return;
    }

    // TTS mode without audioUrl
    if (isPlaying) {
      // Find matching segment index based on currentTime
      const current = usePlayerStore.getState().currentTime;
      let targetIdx = segments.findIndex(s => current >= s.start_time && current < s.end_time);
      if (targetIdx === -1) {
        targetIdx = segments.findIndex(s => s.start_time >= current);
      }
      if (targetIdx === -1) targetIdx = 0;

      // If we are already speaking this segment, don't restart
      if (!isSpeakingRef.current || currentSpeakingIndexRef.current !== targetIdx) {
        speakSegment(targetIdx);
      }
    } else {
      clearTimers();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      isSpeakingRef.current = false;
      currentSpeakingIndexRef.current = null;
      setCurrentSpeaker(null);
    }
  }, [isPlaying, audioUrl, segments, speakSegment, clearTimers]);

  // React to seek or jump when already playing (e.g. user clicked another segment or chapter)
  useEffect(() => {
    if (!isPlaying || audioUrl || segments.length === 0) return;

    const currentIdx = currentSpeakingIndexRef.current;
    if (currentIdx !== null && segments[currentIdx]) {
      const activeSeg = segments[currentIdx];
      // If currentTime jumped outside current segment boundaries, switch segment immediately
      if (currentTime < activeSeg.start_time - 0.5 || currentTime >= activeSeg.end_time + 0.5) {
        let targetIdx = segments.findIndex(s => currentTime >= s.start_time && currentTime < s.end_time);
        if (targetIdx === -1) targetIdx = segments.findIndex(s => s.start_time >= currentTime);
        if (targetIdx !== -1 && targetIdx !== currentIdx) {
          speakSegment(targetIdx);
        }
      }
    }
  }, [currentTime, isPlaying, audioUrl, segments, speakSegment]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [clearTimers]);

  // Play / Pause toggle button
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time: number) => {
    const clamped = Math.max(0, Math.min(time, duration || meetingDuration));
    setCurrentTime(clamped);
    if (audioRef.current) {
      audioRef.current.currentTime = clamped;
    }
    if (isPlaying && !audioUrl && segments.length > 0) {
      let targetIdx = segments.findIndex(s => clamped >= s.start_time && clamped < s.end_time);
      if (targetIdx === -1) targetIdx = segments.findIndex(s => s.start_time >= clamped);
      if (targetIdx === -1) targetIdx = 0;
      speakSegment(targetIdx);
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
    // If currently speaking in TTS, re-trigger current segment with new rate
    if (isPlaying && !audioUrl && currentSpeakingIndexRef.current !== null) {
      speakSegment(currentSpeakingIndexRef.current);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
    if (nextMuted && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      isSpeakingRef.current = false;
    } else if (!nextMuted && isPlaying && !audioUrl && currentSpeakingIndexRef.current !== null) {
      speakSegment(currentSpeakingIndexRef.current);
    }
  };

  const effectiveDuration = duration || meetingDuration || 1;
  const progress = Math.min(100, (currentTime / effectiveDuration) * 100);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 mb-5 shadow-xs" suppressHydrationWarning>
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}

      {/* Scrubber and Waveform */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-1.5">
          <span className="text-[#6C5CE7] font-semibold">{formatTime(currentTime)}</span>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            {isPlaying && (
              <span className="flex items-center gap-1.5 text-emerald-600 font-sans font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {currentSpeaker ? `Speaking: ${currentSpeaker}` : 'Playing'}
              </span>
            )}
            <span>/</span>
            <span>{formatTime(effectiveDuration)}</span>
          </div>
        </div>

        {/* Custom Scrubber Bar */}
        <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden cursor-pointer group">
          <div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#6C5CE7] to-[#8075ea] rounded-full transition-all duration-100"
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Skip & Play Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => skipSeconds(-5)}
            title="Rewind 5s"
            type="button"
            suppressHydrationWarning
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <RotateCcw size={17} />
          </button>

          <button
            onClick={togglePlay}
            type="button"
            suppressHydrationWarning
            className="w-10 h-10 rounded-full bg-[#6C5CE7] hover:bg-[#5a4bd6] flex items-center justify-center text-white shadow-xs hover:shadow transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title={isPlaying ? 'Pause Narration' : 'Play Transcript to Voice'}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>

          <button
            onClick={() => skipSeconds(5)}
            title="Forward 5s"
            type="button"
            suppressHydrationWarning
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <RotateCw size={17} />
          </button>
        </div>

        {/* Center: AI Voice Status Badge */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setVoiceVoiceover(!voiceVoiceover)}
            type="button"
            title="Toggle AI Voiceover Narration"
            suppressHydrationWarning
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
              voiceVoiceover
                ? 'bg-[#6C5CE7]/10 border-[#6C5CE7]/30 text-[#6C5CE7]'
                : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}
          >
            <Sparkles size={13} className={voiceVoiceover ? 'text-[#6C5CE7]' : 'text-slate-400'} />
            <span>AI Voice: {voiceVoiceover ? 'Active (Multi-Speaker)' : 'Off (Muted)'}</span>
          </button>
        </div>

        {/* Right: Speed, Volume Slider, Mute */}
        <div className="flex items-center gap-3">
          {/* Playback speed toggle */}
          <button
            onClick={cyclePlaybackRate}
            type="button"
            suppressHydrationWarning
            className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors border border-slate-200 cursor-pointer"
            title="Toggle playback speed"
          >
            {playbackRate}x
          </button>

          {/* Volume control */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              type="button"
              suppressHydrationWarning
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX size={17} className="text-rose-500" />
              ) : volume > 0.5 ? (
                <Volume2 size={17} />
              ) : (
                <Volume1 size={17} />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const newVol = parseFloat(e.target.value);
                setVolume(newVol);
                if (isMuted && newVol > 0) setIsMuted(false);
              }}
              suppressHydrationWarning
              className="w-16 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#6C5CE7]"
              title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
