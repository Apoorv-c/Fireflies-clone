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

  // References to guarantee immediate, non-stale access across callbacks, timers, and utterances
  const playbackRateRef = useRef<number>(1);
  const volumeRef = useRef<number>(0.9);
  const isMutedRef = useRef<boolean>(false);
  const prevVolumeRef = useRef<number>(0.9);
  const voiceVoiceoverRef = useRef<boolean>(true);

  // References for speech synthesis engine
  const currentSpeakingIndexRef = useRef<number | null>(null);
  const isSpeakingRef = useRef<boolean>(false);
  const keepAliveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speechDelayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Sync total duration
  useEffect(() => {
    setDuration(meetingDuration);
  }, [meetingDuration, setDuration]);

  // Sync native audio element properties whenever volume, muted or rate changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.muted = isMuted;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [volume, isMuted, playbackRate]);

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

    const enVoices = voices.filter(v => v.lang.startsWith('en'));
    const pool = enVoices.length > 0 ? enVoices : voices;

    let hash = 0;
    for (let i = 0; i < speakerLabel.length; i++) {
      hash = (hash << 5) - hash + speakerLabel.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash);
    const selectedVoice = pool[absHash % pool.length];

    const pitches = [0.95, 1.05, 0.9, 1.1, 1.0];
    const pitch = pitches[absHash % pitches.length];

    return { voice: selectedVoice, pitch };
  }, []);

  // Clear running timers safely
  const clearTimers = useCallback(() => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    if (keepAliveTimerRef.current) {
      clearInterval(keepAliveTimerRef.current);
      keepAliveTimerRef.current = null;
    }
    if (speechDelayTimerRef.current) {
      clearTimeout(speechDelayTimerRef.current);
      speechDelayTimerRef.current = null;
    }
  }, []);

  // Main speech synthesis trigger for a given segment index
  const speakSegment = useCallback((
    index: number,
    options?: { rate?: number; volume?: number; isMuted?: boolean }
  ) => {
    if (typeof window === 'undefined') return;

    const activeRate = options?.rate ?? playbackRateRef.current;
    const activeVol = options?.volume ?? volumeRef.current;
    const activeMuted = options?.isMuted ?? isMutedRef.current;
    const activeVoiceover = voiceVoiceoverRef.current;

    clearTimers();
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

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

    // If voiceover is disabled, muted, or zero volume, advance time silently
    if (!activeVoiceover || activeMuted || activeVol <= 0 || !window.speechSynthesis) {
      const startTime = Date.now();

      progressTimerRef.current = setInterval(() => {
        // Read dynamic playbackRateRef to immediately adjust speed even in silent mode
        const currentRate = playbackRateRef.current;
        const elapsed = ((Date.now() - startTime) / 1000) * currentRate;
        const nextTime = seg.start_time + elapsed;

        if (nextTime >= seg.end_time) {
          if (progressTimerRef.current) {
            clearInterval(progressTimerRef.current);
            progressTimerRef.current = null;
          }
          if (usePlayerStore.getState().isPlaying) {
            speakSegment(index + 1);
          }
        } else {
          setCurrentTime(nextTime);
        }
      }, 100);
      return;
    }

    // Small delay ensures Chromium speech synthesizer flushes previous cancel operation cleanly
    speechDelayTimerRef.current = setTimeout(() => {
      if (!usePlayerStore.getState().isPlaying || !window.speechSynthesis) return;

      const utterance = new SpeechSynthesisUtterance(seg.content);
      utterance.rate = activeRate;
      utterance.volume = Math.max(0, Math.min(1, activeVol));

      const { voice, pitch } = getSpeakerVoiceSettings(seg.speaker_label || 'Speaker');
      if (voice) utterance.voice = voice;
      utterance.pitch = pitch;

      let utteranceStartTime = Date.now();

      utterance.onstart = () => {
        utteranceStartTime = Date.now();
        isSpeakingRef.current = true;

        progressTimerRef.current = setInterval(() => {
          // Dynamic calculation using playbackRateRef ensures speed changes are reflected instantly
          const currentRate = playbackRateRef.current;
          const elapsed = ((Date.now() - utteranceStartTime) / 1000) * currentRate;
          const progressTime = Math.min(seg.end_time, seg.start_time + elapsed);
          setCurrentTime(progressTime);
        }, 120);

        // Chrome 14-second pause bug workaround
        keepAliveTimerRef.current = setInterval(() => {
          if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }
        }, 9000);
      };

      utterance.onend = () => {
        clearTimers();
        isSpeakingRef.current = false;
        setCurrentTime(seg.end_time);

        if (usePlayerStore.getState().isPlaying) {
          if (index + 1 < segments.length) {
            setTimeout(() => {
              if (usePlayerStore.getState().isPlaying) {
                speakSegment(index + 1);
              }
            }, 50);
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
    }, 25);
  }, [segments, getSpeakerVoiceSettings, clearTimers, setCurrentTime, setActiveSegmentId, setIsPlaying]);

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

  // React to isPlaying changes from store
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
      const current = usePlayerStore.getState().currentTime;
      let targetIdx = segments.findIndex(s => current >= s.start_time && current < s.end_time);
      if (targetIdx === -1) {
        targetIdx = segments.findIndex(s => s.start_time >= current);
      }
      if (targetIdx === -1) targetIdx = 0;

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

  // React to seek or jump when already playing
  useEffect(() => {
    if (!isPlaying || audioUrl || segments.length === 0) return;

    const currentIdx = currentSpeakingIndexRef.current;
    if (currentIdx !== null && segments[currentIdx]) {
      const activeSeg = segments[currentIdx];
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

  // Play / Pause toggle
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

  // Immediate speed cycling: updates ref and state, and immediately re-triggers audio/TTS at new rate
  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRateRef.current);
    const nextRate = rates[(currentIndex + 1) % rates.length];

    playbackRateRef.current = nextRate;
    setPlaybackRate(nextRate);

    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }

    if (isPlaying && !audioUrl && currentSpeakingIndexRef.current !== null) {
      speakSegment(currentSpeakingIndexRef.current, { rate: nextRate });
    }
  };

  // Mute toggle: correctly mutes without freezing progress, and cleanly restores volume on unmute
  const toggleMute = () => {
    if (isMuted) {
      // Unmute: restore previous non-zero volume
      const restoredVol = prevVolumeRef.current > 0 ? prevVolumeRef.current : 0.9;
      isMutedRef.current = false;
      volumeRef.current = restoredVol;
      setIsMuted(false);
      setVolume(restoredVol);

      if (audioRef.current) {
        audioRef.current.muted = false;
        audioRef.current.volume = restoredVol;
      }

      if (isPlaying && !audioUrl && currentSpeakingIndexRef.current !== null) {
        speakSegment(currentSpeakingIndexRef.current, { volume: restoredVol, isMuted: false });
      }
    } else {
      // Mute: store current volume and silence
      if (volume > 0) {
        prevVolumeRef.current = volume;
      }
      isMutedRef.current = true;
      setIsMuted(true);

      if (audioRef.current) {
        audioRef.current.muted = true;
      }

      if (isPlaying && !audioUrl && currentSpeakingIndexRef.current !== null) {
        speakSegment(currentSpeakingIndexRef.current, { isMuted: true });
      }
    }
  };

  // Volume slider handler: smoothly adjusts volume and un-mutes if volume dragged above 0
  const handleVolumeChange = (newVol: number) => {
    volumeRef.current = newVol;
    setVolume(newVol);

    if (newVol === 0) {
      isMutedRef.current = true;
      setIsMuted(true);

      if (audioRef.current) {
        audioRef.current.muted = true;
        audioRef.current.volume = 0;
      }

      if (isPlaying && !audioUrl && currentSpeakingIndexRef.current !== null) {
        speakSegment(currentSpeakingIndexRef.current, { volume: 0, isMuted: true });
      }
    } else {
      const wasMuted = isMutedRef.current;
      prevVolumeRef.current = newVol;
      isMutedRef.current = false;
      setIsMuted(false);

      if (audioRef.current) {
        audioRef.current.muted = false;
        audioRef.current.volume = newVol;
      }

      if (wasMuted && isPlaying && !audioUrl && currentSpeakingIndexRef.current !== null) {
        speakSegment(currentSpeakingIndexRef.current, { volume: newVol, isMuted: false });
      }
    }
  };

  const toggleVoiceover = () => {
    const nextVal = !voiceVoiceover;
    voiceVoiceoverRef.current = nextVal;
    setVoiceVoiceover(nextVal);

    if (isPlaying && !audioUrl && currentSpeakingIndexRef.current !== null) {
      if (nextVal) {
        speakSegment(currentSpeakingIndexRef.current, { isMuted: isMutedRef.current });
      } else {
        speakSegment(currentSpeakingIndexRef.current, { isMuted: true });
      }
    }
  };

  const effectiveDuration = duration || meetingDuration || 1;
  const progress = Math.min(100, (currentTime / effectiveDuration) * 100);
  const displayVol = isMuted ? 0 : volume;
  const volPercent = Math.round(displayVol * 100);

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
            aria-label="Seek time slider"
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
            onClick={toggleVoiceover}
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
            className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors border border-slate-200 cursor-pointer min-w-[38px] text-center"
            title={`Current speed: ${playbackRate}x. Click to change.`}
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
              title={isMuted || volume === 0 ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX size={17} className="text-rose-500" />
              ) : volume <= 0.4 ? (
                <Volume1 size={17} className="text-slate-600" />
              ) : (
                <Volume2 size={17} className="text-slate-700" />
              )}
            </button>

            <div className="relative flex items-center">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={displayVol}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                suppressHydrationWarning
                aria-label="Volume level"
                style={{
                  background: `linear-gradient(to right, #6C5CE7 0%, #6C5CE7 ${volPercent}%, #e2e8f0 ${volPercent}%, #e2e8f0 100%)`
                }}
                className="w-18 h-1.5 rounded-lg appearance-none cursor-pointer accent-[#6C5CE7] transition-all"
                title={`Volume: ${volPercent}%`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
