'use client';

import { useUIStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';
import { X, Check, Zap, Video, ShieldCheck, Bot, ArrowRight } from 'lucide-react';

function ProCrownBadge({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 13 11" fill="none" className={className}>
      <path
        d="M1 9.5H12M1.5 7.5L1 2L4.5 4.8L6.5 1.5L8.5 4.8L12 2L11.5 7.5H1.5Z"
        fill="#6C5CE7"
        stroke="#6C5CE7"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function UpgradeModal() {
  const router = useRouter();
  const {
    isUpgradeModalOpen,
    setIsUpgradeModalOpen,
    upgradeModalFeature,
    isPremium,
    setIsPremium,
    setIsLiveCaptureOpen
  } = useUIStore();
  const { showToast } = useToast();

  if (!isUpgradeModalOpen) return null;

  const handleActivateTrial = () => {
    setIsPremium(true);
    setIsUpgradeModalOpen(false);
    showToast(`🎉 Business Plan 7-day trial activated! ${upgradeModalFeature} is now unlocked.`, 'success');
    if (upgradeModalFeature === 'Live Capture') {
      setTimeout(() => {
        setIsLiveCaptureOpen(true);
      }, 200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200/90 w-full max-w-lg p-6 sm:p-7 shadow-2xl relative animate-in zoom-in-95">
        {/* Close button */}
        <button
          type="button"
          onClick={() => setIsUpgradeModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Crown Icon Header */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-[#f4f0fd] flex items-center justify-center border border-[#6C5CE7]/20 shadow-xs">
            <ProCrownBadge className="w-4 h-4" />
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#f4f0fd] text-[#6C5CE7] text-[11px] font-bold tracking-wide uppercase">
            Pro & Business Feature
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mt-2 mb-1.5">
          Unlock {upgradeModalFeature}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          {upgradeModalFeature === 'Live Capture'
            ? 'Live Capture allows you to transcribe in-person discussions, mic audio, and browser streams in real time with AI.'
            : `${upgradeModalFeature} is exclusively available on Fireflies Pro and Business tiers.`}
          {' ' }Start your risk-free 7-day free trial to unlock all premium capabilities immediately.
        </p>

        {/* Feature Benefits List */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6 space-y-3">
          <div className="flex items-start gap-3 text-xs text-slate-700">
            <div className="w-5 h-5 rounded-full bg-purple-100 text-[#6C5CE7] flex items-center justify-center shrink-0 mt-0.5">
              <Zap size={12} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Live Microphone & Meeting Capture</p>
              <p className="text-slate-500 text-[11px]">Real-time audio visualizer, automatic speaker identification, and live notes.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs text-slate-700">
            <div className="w-5 h-5 rounded-full bg-purple-100 text-[#6C5CE7] flex items-center justify-center shrink-0 mt-0.5">
              <Video size={12} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-semibold text-slate-900">1080p Screen & Video Capture</p>
              <p className="text-slate-500 text-[11px]">Full HD video recording of screen shares, presentations, and webinars.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs text-slate-700">
            <div className="w-5 h-5 rounded-full bg-purple-100 text-[#6C5CE7] flex items-center justify-center shrink-0 mt-0.5">
              <Bot size={12} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Unlimited AskFred & AI Notes</p>
              <p className="text-slate-500 text-[11px]">Query any past meeting, generate follow-up emails, and extract action items.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs text-slate-700">
            <div className="w-5 h-5 rounded-full bg-purple-100 text-[#6C5CE7] flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck size={12} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Custom Bot Name & Auto-Delete Rules</p>
              <p className="text-slate-500 text-[11px]">Brand your AI notetaker and configure automated data retention policies.</p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleActivateTrial}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#7d6df0] hover:from-[#5a4bd6] hover:to-[#6C5CE7] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <ProCrownBadge className="w-3.5 h-3.5 text-white" />
            <span>Start 7-Day Business Free Trial</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsUpgradeModalOpen(false);
              router.push('/plan');
            }}
            className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-[#6C5CE7] hover:text-[#5a4bd6] hover:bg-purple-50 transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
          >
            <span>Compare all plans &amp; pricing</span>
            <ArrowRight size={13} />
          </button>

          <button
            type="button"
            onClick={() => setIsUpgradeModalOpen(false)}
            className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer text-center"
          >
            Maybe Later
          </button>
        </div>

        {/* Current status & dev toggle */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Current tier: <strong className="text-slate-700">{isPremium ? '✓ Pro / Business' : 'Free Plan'}</strong></span>
          <button
            type="button"
            onClick={() => {
              setIsPremium(!isPremium);
              showToast(!isPremium ? 'Switched to Pro Plan' : 'Switched to Free Plan', 'info');
            }}
            className="text-[#6C5CE7] hover:underline font-medium cursor-pointer"
          >
            {isPremium ? 'Switch to Free (Test)' : 'Switch to Pro (Test)'}
          </button>
        </div>
      </div>
    </div>
  );
}
