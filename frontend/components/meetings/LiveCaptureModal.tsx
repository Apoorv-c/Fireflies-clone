'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import { useCreateMeeting } from '@/hooks/useMeetings';
import { useUploadTranscript } from '@/hooks/useTranscript';
import {
  X,
  Mic,
  MicOff,
  Square,
  Sparkles,
  Radio,
  Clock,
  Settings,
  CheckCircle2,
  Volume2
} from 'lucide-react';

export default function LiveCaptureModal() {
  const router = useRouter();
  const { isLiveCaptureOpen, setIsLiveCaptureOpen } = useUIStore();
  const { showToast } = useToast();
  const createMeeting = useCreateMeeting();
  const uploadTranscript = useUploadTranscript();

  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [meetingTitle, setMeetingTitle] = useState('Live In-Person Sync');
  const [audioWaves, setAudioWaves] = useState<number[]>([20, 35, 60, 45, 80, 55, 30, 70, 90, 40, 25, 65]);
  const [transcriptLines, setTranscriptLines] = useState<Array<{ speaker: string; text: string; time: string }>>([
    { speaker: 'Alex Vance', text: 'Welcome everyone, starting the live meeting recording now.', time: '00:03' }
  ]);
  const [selectedMic, setSelectedMic] = useState('Default Microphone (Realtek Audio)');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const waveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const simTextTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer logic
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);

      waveTimerRef.current = setInterval(() => {
        setAudioWaves(
          Array.from({ length: 14 }, () => Math.floor(Math.random() * 85) + 15)
        );
      }, 150);

      // Simulate real-time live speaker transcription stream
      const sampleDialogue = [
        { speaker: 'Sarah Chen', text: 'We are reviewing the Q3 pipeline and action items.' },
        { speaker: 'Alex Vance', text: 'The live transcription accuracy is looking sharp.' },
        { speaker: 'Mike Johnson', text: 'All API endpoints and webhooks are performing under 100ms.' },
        { speaker: 'Emily Park', text: 'Great, let us make sure to attach these notes to our sprint backlog.' }
      ];
      let dialIdx = 0;

      simTextTimerRef.current = setInterval(() => {
        if (dialIdx < sampleDialogue.length) {
          const item = sampleDialogue[dialIdx];
          const m = Math.floor((seconds + (dialIdx + 1) * 4) / 60);
          const s = ((seconds + (dialIdx + 1) * 4) % 60).toString().padStart(2, '0');
          setTranscriptLines((prev) => [...prev, { speaker: item.speaker, text: item.text, time: `${m}:${s}` }]);
          dialIdx++;
        }
      }, 4000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (waveTimerRef.current) clearInterval(waveTimerRef.current);
      if (simTextTimerRef.current) clearInterval(simTextTimerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (waveTimerRef.current) clearInterval(waveTimerRef.current);
      if (simTextTimerRef.current) clearInterval(simTextTimerRef.current);
    };
  }, [isRecording, seconds]);

  if (!isLiveCaptureOpen) return null;

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    showToast('Live Capture recording started!', 'success');
  };

  const handleStopAndSave = async () => {
    setIsRecording(false);
    showToast('Saving live captured meeting & generating AI transcript...', 'info');

    try {
      // Build plain transcript content
      const fullTranscript = transcriptLines
        .map((l) => `${l.speaker} (${l.time}): ${l.text}`)
        .join('\n\n');

      const newMeeting = await createMeeting.mutateAsync({
        title: meetingTitle,
        date: new Date().toISOString(),
        duration_seconds: Math.max(60, seconds),
        participants: [
          { name: 'Alex Vance', email: 'alex.vance@company.com' },
          { name: 'Sarah Chen', email: 'sarah@company.com' }
        ],
        tags: ['live-capture', 'pro']
      });

      if (newMeeting.id && fullTranscript) {
        const blob = new Blob([fullTranscript], { type: 'text/plain' });
        const file = new File([blob], 'live_transcript.txt', { type: 'text/plain' });
        await uploadTranscript.mutateAsync({ meetingId: newMeeting.id, file });
      }

      showToast('Live meeting captured and saved to Notebook!', 'success');
      setIsLiveCaptureOpen(false);
      if (newMeeting.id) {
        router.push(`/meetings/${newMeeting.id}`);
      }
    } catch {
      showToast('Failed to save live capture', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-xl p-6 sm:p-7 shadow-2xl relative animate-in zoom-in-95">
        {/* Close button */}
        <button
          type="button"
          onClick={() => {
            setIsRecording(false);
            setIsLiveCaptureOpen(false);
          }}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Live Indicator Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold border border-rose-200">
              <Radio size={13} className={isRecording ? 'animate-pulse text-rose-600' : 'text-rose-400'} />
              <span>{isRecording ? 'LIVE RECORDING' : 'LIVE CAPTURE (PRO)'}</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[#6C5CE7] text-[10px] font-semibold border border-purple-200">
              👑 Pro Plan
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
            <Clock size={13} className="text-slate-400" />
            <span>{formatTimer(seconds)}</span>
          </div>
        </div>

        {/* Meeting Title Input */}
        <div className="mb-4">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Meeting Title
          </label>
          <input
            type="text"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7]"
          />
        </div>

        {/* Audio Waveform Level Indicator */}
        <div className="bg-slate-900 rounded-2xl p-4 mb-4 text-white flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-1.5 h-14 w-full px-4">
            {audioWaves.map((height, i) => (
              <span
                key={i}
                className="w-1.5 rounded-full bg-gradient-to-t from-[#6C5CE7] to-[#a29bfe] transition-all duration-150"
                style={{
                  height: isRecording && !isMuted ? `${height}%` : '6px',
                  opacity: isRecording && !isMuted ? 1 : 0.4
                }}
              />
            ))}
          </div>

          <p className="text-[11px] text-slate-400 font-mono mt-1">
            {isRecording
              ? isMuted
                ? 'Microphone is muted'
                : 'Listening and capturing real-time speech...'
              : 'Ready to capture audio. Press Start below.'}
          </p>
        </div>

        {/* Live Streaming Transcript Window */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#6C5CE7]" />
              <span>Real-time Live Transcript</span>
            </span>
            <span className="text-[10px] text-slate-400">AI Transcription 100% On-Device</span>
          </div>

          <div className="h-36 overflow-y-auto bg-slate-50 border border-slate-200/80 rounded-2xl p-3 space-y-2.5 text-xs">
            {transcriptLines.map((line, idx) => (
              <div key={idx} className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-800">{line.speaker}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{line.time}</span>
                </div>
                <p className="text-slate-600 pl-1 border-l-2 border-purple-200 leading-relaxed">
                  {line.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Microphone Settings */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-5 px-1">
          <div className="flex items-center gap-2">
            <Volume2 size={14} className="text-slate-400" />
            <select
              value={selectedMic}
              onChange={(e) => setSelectedMic(e.target.value)}
              className="bg-transparent border-none text-slate-700 font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="Default Microphone (Realtek Audio)">Default Microphone (Realtek Audio)</option>
              <option value="External USB Headset Microphone">External USB Headset Microphone</option>
              <option value="Virtual System Audio Stream">Virtual System Audio Stream</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer font-medium"
          >
            {isMuted ? <MicOff size={13} className="text-rose-500" /> : <Mic size={13} />}
            <span>{isMuted ? 'Unmute Mic' : 'Mute Mic'}</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              setIsRecording(false);
              setIsLiveCaptureOpen(false);
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2.5">
            {!isRecording ? (
              <button
                type="button"
                onClick={handleStartRecording}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6C5CE7] hover:bg-[#5a4bd6] text-white text-xs font-bold shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <Mic size={14} />
                <span>Start Live Recording</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStopAndSave}
                disabled={createMeeting.isPending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <Square size={13} className="fill-current" />
                <span>Finish & Save Meeting</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
