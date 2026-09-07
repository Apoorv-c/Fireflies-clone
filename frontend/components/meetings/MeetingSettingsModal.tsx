'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { Mail, Lock, Globe, ChevronDown } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface MeetingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MeetingSettingsModal({ isOpen, onClose }: MeetingSettingsModalProps) {
  const { showToast } = useToast();

  const [autoJoin, setAutoJoin] = useState(true);
  const [autoJoinOption, setAutoJoinOption] = useState('All meetings with web-conf link');
  const [emailRecapOption, setEmailRecapOption] = useState('Everyone on the invite');
  const [privacyOption, setPrivacyOption] = useState('Teammates & Anyone with Link');
  const [languageOption, setLanguageOption] = useState('English (Global)');

  const handleSave = () => {
    showToast('Meeting settings saved successfully');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Meeting Settings" maxWidth="max-w-md">
      <div className="space-y-4 py-1" suppressHydrationWarning>

        {/* 2. Auto-join calendar meetings */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {/* Google Calendar style icon */}
              <div className="w-5 h-5 rounded-md border border-blue-400 bg-white flex flex-col items-center justify-center text-[10px] font-bold text-blue-600 shadow-2xs overflow-hidden leading-none">
                <div className="w-full bg-blue-500 h-1.5" />
                <span className="text-[9px] font-black text-slate-800">31</span>
              </div>
              <span className="text-sm font-medium text-slate-800">
                Auto-join calendar meetings
              </span>
            </div>

            {/* Toggle Switch (Active by default) */}
            <button
              type="button"
              role="switch"
              aria-checked={autoJoin}
              onClick={() => setAutoJoin(!autoJoin)}
              suppressHydrationWarning
              style={{
                backgroundColor: autoJoin ? '#6C5CE7' : '#d8d4f8',
                width: '42px',
                height: '24px',
              }}
              className="relative shrink-0 rounded-full transition-colors cursor-pointer p-0.5 flex items-center"
            >
              <span
                style={{
                  transform: autoJoin ? 'translateX(18px)' : 'translateX(2px)',
                  width: '18px',
                  height: '18px',
                }}
                className="inline-block rounded-full bg-white shadow-sm transition-transform"
              />
            </button>
          </div>

          <div className="relative">
            <select
              value={autoJoinOption}
              onChange={(e) => setAutoJoinOption(e.target.value)}
              disabled={!autoJoin}
              suppressHydrationWarning
              className="w-full appearance-none px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
            >
              <option value="All meetings with web-conf link">All meetings with web-conf link</option>
              <option value="Only meetings I host">Only meetings I host</option>
              <option value="All calendar events">All calendar events</option>
              <option value="Ask before joining each meeting">Ask before joining each meeting</option>
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* 3. Send email recap to */}
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <Mail size={18} className="text-[#6C5CE7]" />
            <span className="text-sm font-medium text-slate-800">
              Send email recap to
            </span>
          </div>

          <div className="relative">
            <select
              value={emailRecapOption}
              onChange={(e) => setEmailRecapOption(e.target.value)}
              suppressHydrationWarning
              className="w-full appearance-none px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7] transition-all cursor-pointer shadow-2xs"
            >
              <option value="Everyone on the invite">Everyone on the invite</option>
              <option value="Only me">Only me</option>
              <option value="Only teammates in my organization">Only teammates in my organization</option>
              <option value="Do not send recap email">Do not send recap email</option>
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* 4. Meeting privacy */}
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <Lock size={18} className="text-[#6C5CE7]" />
            <span className="text-sm font-medium text-slate-800">
              Meeting privacy
            </span>
          </div>

          <div className="relative">
            <select
              value={privacyOption}
              onChange={(e) => setPrivacyOption(e.target.value)}
              suppressHydrationWarning
              className="w-full appearance-none px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7] transition-all cursor-pointer shadow-2xs"
            >
              <option value="Teammates & Anyone with Link">Teammates & Anyone with Link</option>
              <option value="Only me (Private)">Only me (Private)</option>
              <option value="Teammates only">Teammates only</option>
              <option value="Public (Anyone with URL)">Public (Anyone with URL)</option>
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* 5. Meeting language */}
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <Globe size={18} className="text-[#6C5CE7]" />
            <span className="text-sm font-medium text-slate-800">
              Meeting language
            </span>
          </div>

          <div className="relative">
            <select
              value={languageOption}
              onChange={(e) => setLanguageOption(e.target.value)}
              suppressHydrationWarning
              className="w-full appearance-none px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7] transition-all cursor-pointer shadow-2xs"
            >
              <option value="English (Global)">English (Global)</option>
              <option value="English (United States)">English (United States)</option>
              <option value="English (United Kingdom)">English (United Kingdom)</option>
              <option value="Spanish (Español)">Spanish (Español)</option>
              <option value="French (Français)">French (Français)</option>
              <option value="German (Deutsch)">German (Deutsch)</option>
              <option value="Japanese (日本語)">Japanese (日本語)</option>
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            suppressHydrationWarning
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-2xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            suppressHydrationWarning
            className="px-5 py-2 bg-[#6C5CE7] hover:bg-[#5a4bd6] text-white rounded-lg text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
