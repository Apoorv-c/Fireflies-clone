'use client';

import React, { useState } from 'react';
import { useUIStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import Modal from '@/components/ui/Modal';
import {
  Check,
  CheckCircle2,
  Sparkles,
  Zap,
  Shield,
  HelpCircle,
  ExternalLink,
  Crown,
  Lock,
  ArrowRight,
} from 'lucide-react';

export default function PlanPage() {
  const { isPremium, setIsPremium, userProfile } = useUIStore();
  const { showToast } = useToast();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlanModal, setSelectedPlanModal] = useState<string | null>(null);
  const [isRateLimitsOpen, setIsRateLimitsOpen] = useState(false);
  const [rateLimitTier, setRateLimitTier] = useState<'Pro' | 'Business' | 'Enterprise'>('Pro');

  const handleUpgrade = (planName: string) => {
    setSelectedPlanModal(planName);
  };

  const confirmUpgrade = (planName: string) => {
    setIsPremium(true);
    setSelectedPlanModal(null);
    showToast(`🎉 Successfully upgraded to ${planName} Plan! All premium features are unlocked.`, 'success');
  };

  const handleDowngrade = () => {
    setIsPremium(false);
    showToast('Plan switched to Free tier.', 'info');
  };

  return (
    <div suppressHydrationWarning className="min-h-full pb-16 pt-2 font-sans text-slate-800">
      {/* 1. Header Section */}
      <div className="text-center max-w-3xl mx-auto px-4 pt-4 sm:pt-6 pb-8">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          You are on the{' '}
          <span className="text-[#6C5CE7] font-black">
            {isPremium ? 'Pro' : 'Free'}
          </span>{' '}
          plan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          You need to upgrade your plan to perform this action.
        </p>

        {/* Billing Cycle Pill Toggle */}
        <div className="mt-6 sm:mt-7 inline-flex items-center bg-slate-100 p-1 rounded-full border border-slate-200/70 shadow-2xs">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 sm:px-7 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            MONTHLY
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('annual')}
            className={`px-5 sm:px-7 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              billingCycle === 'annual'
                ? 'bg-white text-[#6C5CE7] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>ANNUAL</span>
            <span className="bg-[#10B981] text-white text-[10px] font-black px-1.5 py-0.5 rounded leading-none shadow-2xs">
              40% OFF
            </span>
          </button>
        </div>
      </div>

      {/* 2. Four Plan Cards Grid */}
      <div className="max-w-[1400px] mx-auto px-2 sm:px-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 items-stretch">
        {/* CARD 1: FREE */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow relative">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xl font-bold text-[#6C5CE7]">Free</h3>
                <CheckCircle2 size={18} className="text-[#6C5CE7] fill-[#6C5CE7]/15" />
              </div>
            </div>
            <p className="text-xs text-slate-500 min-h-[32px] leading-relaxed">
              For individuals starting with Fireflies
            </p>

            {/* Price */}
            <div className="my-5 pb-5 border-b border-slate-100">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">$0</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Free forever</p>
            </div>

            {/* Top 3 Dotted Highlights */}
            <div className="space-y-2 mb-6">
              <div className="flex items-start gap-2 text-xs text-slate-700">
                <Check size={14} className="text-slate-400 shrink-0 mt-0.5" />
                <span className="border-b border-dotted border-slate-400 cursor-help" title="Fair usage policy applies">
                  Unlimited transcription*
                </span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-700">
                <Check size={14} className="text-slate-400 shrink-0 mt-0.5" />
                <span className="border-b border-dotted border-slate-400 cursor-help" title="Basic summary bullet points included">
                  Limited AI summaries
                </span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-700">
                <Check size={14} className="text-slate-400 shrink-0 mt-0.5" />
                <span className="border-b border-dotted border-slate-400 cursor-help" title="Shared storage across team workspace">
                  400 minutes of storage/team
                </span>
              </div>
            </div>

            {/* Detailed Feature List */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Features</p>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-slate-400 shrink-0 mt-0.5" />
                  <span className="border-b border-dotted border-slate-300">
                    Record Zoom, GMeet, MS Teams, more
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>Transcription in 100+ languages</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>Real-time notes &amp; live transcriptions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>Meeting search</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>AskFred - AI assistant</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>Soundbites</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>Audio/video uploads</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>Chrome extension</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-slate-400 shrink-0" />
                  <span>Fireflies mobile app</span>
                  <span className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-500 px-1 rounded">
                    iOS / Android
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>Desktop app (Download)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>API access</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8 pt-4">
            {!isPremium ? (
              <button
                type="button"
                disabled
                className="w-full py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 text-xs font-semibold cursor-default text-center"
              >
                Current
              </button>
            ) : (
              <button
                type="button"
                onClick={handleDowngrade}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold transition-colors cursor-pointer text-center"
              >
                Downgrade to Free
              </button>
            )}
          </div>
        </div>

        {/* CARD 2: PRO */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow relative">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xl font-bold text-slate-900">Pro</h3>
            </div>
            <p className="text-xs text-slate-500 min-h-[32px] leading-relaxed">
              Best suited for individuals and small teams
            </p>

            {/* Price */}
            <div className="my-5 pb-5 border-b border-slate-100">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">
                  {billingCycle === 'annual' ? '$10' : '$18'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Per seat/month billed {billingCycle === 'annual' ? 'annually' : 'monthly'}
              </p>
            </div>

            {/* Top 3 Dotted Highlights */}
            <div className="space-y-2 mb-6">
              <div className="flex items-start gap-2 text-xs text-slate-700">
                <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                <span className="border-b border-dotted border-slate-400 cursor-help" title="No limits on meeting audio transcriptions">
                  Unlimited transcription
                </span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-700">
                <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                <span className="border-b border-dotted border-slate-400 cursor-help" title="Full AI generated meeting overviews and key topics">
                  Unlimited AI summaries
                </span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-700">
                <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                <span className="border-b border-dotted border-slate-400 cursor-help" title="Substantial storage allocation per team seat">
                  8,000 mins of storage/seat
                </span>
              </div>
            </div>

            {/* Detailed Feature List */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Everything in Free, plus</p>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-800">Capture meeting video</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span>Download transcripts, summaries, recordings</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span className="border-b border-dotted border-slate-300">Personal Assistant</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span className="border-b border-dotted border-slate-300">Email Assistant</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span>Action items &amp; Task Manager</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span className="border-b border-dotted border-slate-300">AI Skills</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span className="border-b border-dotted border-slate-300">Voice Agents</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span>Bulk Delete</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span>Unlimited public channels</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span className="border-b border-dotted border-slate-300">Unlimited integrations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span className="font-semibold text-slate-800">20 AI credits</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Rate Limits & Action Button */}
          <div className="mt-8 pt-4">
            <div className="text-center mb-3">
              <button
                type="button"
                onClick={() => {
                  setRateLimitTier('Pro');
                  setIsRateLimitsOpen(true);
                }}
                className="text-xs font-bold text-[#6C5CE7] hover:underline uppercase tracking-wider cursor-pointer"
              >
                RATE LIMITS
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleUpgrade('Pro')}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                isPremium
                  ? 'bg-purple-50 text-[#6C5CE7] border border-purple-200 hover:bg-purple-100'
                  : 'bg-[#6C5CE7] hover:bg-[#5a4bd6] text-white hover:shadow'
              }`}
            >
              {isPremium ? 'Current Plan' : 'Upgrade'}
            </button>
          </div>
        </div>

        {/* CARD 3: BUSINESS (MOST POPULAR HIGHLIGHTED) */}
        <div className="bg-white rounded-2xl border-2 border-[#6C5CE7] ring-4 ring-[#6C5CE7]/10 p-5 sm:p-6 flex flex-col justify-between shadow-xl relative scale-[1.01]">
          <div>
            {/* Header with MOST POPULAR pill */}
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xl font-bold text-slate-900">Business</h3>
              <span className="bg-[#FDF2F8] text-[#DB2777] border border-[#FBCFE8] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                MOST POPULAR
              </span>
            </div>
            <p className="text-xs text-slate-500 min-h-[32px] leading-relaxed">
              Manage your fast growing team or business
            </p>

            {/* Price */}
            <div className="my-5 pb-5 border-b border-slate-100">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">
                  {billingCycle === 'annual' ? '$19' : '$29'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Per seat/month billed {billingCycle === 'annual' ? 'annually' : 'monthly'}
              </p>
            </div>

            {/* Top 3 Dotted Highlights */}
            <div className="space-y-2 mb-6">
              <div className="flex items-start gap-2 text-xs text-slate-700">
                <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                <span className="border-b border-dotted border-slate-400 cursor-help" title="No limits on meeting audio transcriptions">
                  Unlimited transcription
                </span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-700">
                <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                <span className="border-b border-dotted border-slate-400 cursor-help" title="Full AI summaries, action items, and topic chapters">
                  Unlimited AI summaries
                </span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-700">
                <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                <span className="border-b border-dotted border-slate-400 font-semibold text-slate-900 cursor-help" title="Never run out of audio or video storage space">
                  Unlimited storage
                </span>
              </div>
            </div>

            {/* Detailed Feature List */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Everything in Pro, plus</p>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-800">Multi-language mode</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span className="border-b border-dotted border-slate-300">Conversation intelligence</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span className="border-b border-dotted border-slate-300">Team analytics (For admins)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span>Unlimited public &amp; private channels</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span>User groups</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span className="border-b border-dotted border-slate-300">Public meeting access</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span className="font-semibold text-slate-800">30 AI credits</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Rate Limits & Action Button */}
          <div className="mt-8 pt-4">
            <div className="text-center mb-3">
              <button
                type="button"
                onClick={() => {
                  setRateLimitTier('Business');
                  setIsRateLimitsOpen(true);
                }}
                className="text-xs font-bold text-[#6C5CE7] hover:underline uppercase tracking-wider cursor-pointer"
              >
                RATE LIMITS
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleUpgrade('Business')}
              className="w-full py-2.5 rounded-xl bg-[#6C5CE7] hover:bg-[#5a4bd6] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
            >
              Upgrade
            </button>
          </div>
        </div>

        {/* CARD 4: ENTERPRISE */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow relative">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xl font-bold text-slate-900">Enterprise</h3>
            </div>
            <p className="text-xs text-slate-500 min-h-[32px] leading-relaxed">
              For advanced security, control &amp; support
            </p>

            {/* Price */}
            <div className="my-5 pb-5 border-b border-slate-100">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">
                  {billingCycle === 'annual' ? '$39' : '$59'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Per seat/month billed {billingCycle === 'annual' ? 'annually' : 'monthly'}
              </p>
            </div>

            {/* Top 3 Dotted Highlights */}
            <div className="space-y-2 mb-6">
              <div className="flex items-start gap-2 text-xs text-slate-700">
                <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                <span className="border-b border-dotted border-slate-400 cursor-help" title="No limits on meeting audio transcriptions">
                  Unlimited transcription
                </span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-700">
                <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                <span className="border-b border-dotted border-slate-400 cursor-help" title="Full AI summaries and unlimited prompt queries">
                  Unlimited AI summaries
                </span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-700">
                <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                <span className="border-b border-dotted border-slate-400 font-semibold text-slate-900 cursor-help" title="Unlimited audio and video storage archive">
                  Unlimited storage
                </span>
              </div>
            </div>

            {/* Detailed Feature List */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Everything in Business, plus</p>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0" />
                  <span className="font-medium text-slate-800">Rules engine</span>
                  <span className="bg-[#10B981] text-white text-[9px] font-black px-1.5 py-0.2 rounded shadow-2xs">
                    NEW
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span>Super admin role</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span>Custom data retention</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span className="border-b border-dotted border-slate-300">Transcript + Summary only mode</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span>Onboarding program</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span>SSO + SCIM</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0" />
                  <span className="border-b border-dotted border-slate-300">Audit Logs (API)</span>
                  <span className="bg-[#10B981] text-white text-[9px] font-black px-1.5 py-0.2 rounded shadow-2xs">
                    NEW
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span>Private storage</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span>HIPAA compliance</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span>Dedicated support</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span className="border-b border-dotted border-slate-300">Payments by invoice*</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#6C5CE7] shrink-0 mt-0.5" />
                  <span className="font-semibold text-slate-800">50 AI credits</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Rate Limits & Action Button */}
          <div className="mt-8 pt-4">
            <div className="text-center mb-3">
              <button
                type="button"
                onClick={() => {
                  setRateLimitTier('Enterprise');
                  setIsRateLimitsOpen(true);
                }}
                className="text-xs font-bold text-[#6C5CE7] hover:underline uppercase tracking-wider cursor-pointer"
              >
                RATE LIMITS
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleUpgrade('Enterprise')}
              className="w-full py-2.5 rounded-xl bg-[#6C5CE7] hover:bg-[#5a4bd6] text-white text-xs font-bold transition-all shadow-xs hover:shadow active:scale-95 cursor-pointer"
            >
              Upgrade
            </button>
          </div>
        </div>
      </div>

      {/* 3. Upgrade Confirmation Modal */}
      {selectedPlanModal && (
        <Modal
          isOpen={!!selectedPlanModal}
          onClose={() => setSelectedPlanModal(null)}
          title={`Upgrade to ${selectedPlanModal} Plan`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#6C5CE7] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Crown size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{selectedPlanModal} Plan</h4>
                <p className="text-xs text-slate-500">
                  {billingCycle === 'annual'
                    ? selectedPlanModal === 'Pro'
                      ? '$10/seat/month (billed annually)'
                      : selectedPlanModal === 'Business'
                      ? '$19/seat/month (billed annually)'
                      : '$39/seat/month (billed annually)'
                    : selectedPlanModal === 'Pro'
                    ? '$18/seat/month (billed monthly)'
                    : selectedPlanModal === 'Business'
                    ? '$29/seat/month (billed monthly)'
                    : '$59/seat/month (billed monthly)'}
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-2">
              <p className="font-semibold text-slate-800">You will immediately unlock:</p>
              <ul className="space-y-1.5 pl-1">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600" />
                  <span>Full meeting video recording &amp; screen capture</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600" />
                  <span>Real-time Live Microphone capture &amp; audio visualizer</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600" />
                  <span>Custom Fireflies AI notetaker branding &amp; automated retention</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600" />
                  <span>AskFred unlimited queries and email assistant</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => setSelectedPlanModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => confirmUpgrade(selectedPlanModal)}
                className="px-5 py-2 text-xs font-bold text-white bg-[#6C5CE7] hover:bg-[#5a4bd6] rounded-xl shadow-md hover:shadow transition-all cursor-pointer active:scale-95"
              >
                Confirm Upgrade
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 4. Rate Limits Information Modal */}
      {isRateLimitsOpen && (
        <Modal
          isOpen={isRateLimitsOpen}
          onClose={() => setIsRateLimitsOpen(false)}
          title={`${rateLimitTier} Plan — Rate Limits & Quotas`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Monthly AI Credits</p>
                <p className="text-base font-extrabold text-[#6C5CE7] mt-1">
                  {rateLimitTier === 'Pro' ? '20 Credits' : rateLimitTier === 'Business' ? '30 Credits' : '50 Credits'}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">Refreshes on the 1st of every month</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase">API Throughput</p>
                <p className="text-base font-extrabold text-[#6C5CE7] mt-1">
                  {rateLimitTier === 'Pro' ? '120 req/min' : rateLimitTier === 'Business' ? '300 req/min' : '1,000+ req/min'}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">Burst allowance included</p>
              </div>
            </div>

            <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 space-y-1.5">
              <p className="font-bold text-slate-900">Transcription &amp; Processing</p>
              <p className="text-slate-600">
                All paid plans feature priority speech processing queues with 99.9% uptime SLA and real-time streaming audio ingestion.
              </p>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setIsRateLimitsOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#6C5CE7] hover:bg-[#5a4bd6] rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
