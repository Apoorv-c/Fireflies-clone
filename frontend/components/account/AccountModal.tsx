'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import UserAvatar from '@/components/ui/UserAvatar';
import { useUIStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import {
  User,
  Settings,
  Shield,
  CreditCard,
  LogOut,
  Upload,
  Check,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Crown,
  Camera,
  Trash2
} from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountModal({ isOpen, onClose }: AccountModalProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const {
    userProfile,
    setUserProfile,
    isPremium,
    setIsPremium,
    setIsUpgradeModalOpen
  } = useUIStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP, SVG)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be smaller than 5 MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUserProfile({ avatarUrl: result, avatarType: 'photo' });
      showToast('Profile photo updated successfully!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const setBlankPhoto = () => {
    setUserProfile({ avatarUrl: null, avatarType: 'blank' });
    showToast('Switched to Blank Photo (Purple Gradient)', 'success');
  };

  const setNeutralBlankPhoto = () => {
    setUserProfile({ avatarUrl: null, avatarType: 'blank-neutral' });
    showToast('Switched to Blank Photo (Neutral Slate)', 'success');
  };

  const setInitialAvatar = () => {
    setUserProfile({ avatarUrl: null, avatarType: 'initial' });
    showToast('Switched to Initial "A" Avatar', 'success');
  };

  const removePhoto = () => {
    setUserProfile({ avatarUrl: null, avatarType: 'blank' });
    showToast('Photo removed. Reset to blank photo.', 'success');
  };

  const navigateToSettings = () => {
    onClose();
    router.push('/settings?tab=account');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="My Account"
      maxWidth="max-w-lg"
    >
      <div className="space-y-5">
        {/* Top Profile Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#f8f6fe] to-[#f1edfe] border border-[#e8dffc] flex items-center gap-4">
          <div className="relative group">
            <UserAvatar size="xl" showProBadge={true} className="shadow-md" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload new photo"
              className="absolute inset-0 bg-black/40 text-white rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
            >
              <Camera size={20} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 truncate">
                {userProfile.name}
              </h3>
              {isPremium ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6C5CE7] text-white shadow-2xs">
                  <Crown size={10} /> PRO
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200 text-slate-700">
                  FREE
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 truncate mt-0.5">
              {userProfile.email}
            </p>

            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500 font-medium">
              <span>{userProfile.role}</span>
              <span>•</span>
              <span>{userProfile.company}</span>
            </div>
          </div>
        </div>

        {/* Avatar Photo Selector Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Profile Photo Style
          </label>
          <div className="grid grid-cols-3 gap-2">
            {/* Blank Photo (Purple) */}
            <button
              type="button"
              onClick={setBlankPhoto}
              className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                userProfile.avatarType === 'blank' && !userProfile.avatarUrl
                  ? 'border-[#6C5CE7] bg-[#f4f0fd] shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="w-9 h-9 rounded-lg overflow-hidden shadow-2xs">
                <img src="/blank-profile.svg" alt="Blank Photo" className="w-full h-full object-cover" />
              </div>
              <span className="text-[11px] font-medium text-slate-800">Blank Photo</span>
              {userProfile.avatarType === 'blank' && !userProfile.avatarUrl && (
                <span className="text-[10px] text-[#6C5CE7] font-semibold flex items-center gap-0.5">
                  <Check size={11} /> Active
                </span>
              )}
            </button>

            {/* Blank Photo (Slate Neutral) */}
            <button
              type="button"
              onClick={setNeutralBlankPhoto}
              className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                userProfile.avatarType === 'blank-neutral' && !userProfile.avatarUrl
                  ? 'border-[#6C5CE7] bg-[#f4f0fd] shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="w-9 h-9 rounded-lg overflow-hidden shadow-2xs">
                <img src="/blank-avatar.svg" alt="Neutral Blank Photo" className="w-full h-full object-cover" />
              </div>
              <span className="text-[11px] font-medium text-slate-800">Slate Blank</span>
              {userProfile.avatarType === 'blank-neutral' && !userProfile.avatarUrl && (
                <span className="text-[10px] text-[#6C5CE7] font-semibold flex items-center gap-0.5">
                  <Check size={11} /> Active
                </span>
              )}
            </button>

            {/* Initial Avatar */}
            <button
              type="button"
              onClick={setInitialAvatar}
              className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                userProfile.avatarType === 'initial' && !userProfile.avatarUrl
                  ? 'border-[#6C5CE7] bg-[#f4f0fd] shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-[#6C5CE7] flex items-center justify-center text-white font-bold text-sm shadow-2xs">
                {userProfile.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-[11px] font-medium text-slate-800">Initial "A"</span>
              {userProfile.avatarType === 'initial' && !userProfile.avatarUrl && (
                <span className="text-[10px] text-[#6C5CE7] font-semibold flex items-center gap-0.5">
                  <Check size={11} /> Active
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-[#6C5CE7] hover:text-[#5a4bd6] font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <Upload size={13} />
              <span>Upload Custom Photo...</span>
            </button>

            {userProfile.avatarUrl && (
              <button
                type="button"
                onClick={removePhoto}
                className="text-xs text-red-600 hover:text-red-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Remove Custom Photo</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Menu Options */}
        <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden bg-white shadow-2xs">
          <button
            type="button"
            onClick={navigateToSettings}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#6C5CE7] flex items-center justify-center">
                <User size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Full Account & Profile Settings</p>
                <p className="text-[11px] text-slate-500">Edit name, timezone, company, and preferences</p>
              </div>
            </div>
            <ChevronRight size={15} className="text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => {
              setIsPremium(!isPremium);
              showToast(isPremium ? 'Switched to Free Plan' : '🎉 Pro Plan Activated!', 'success');
            }}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Crown size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  {isPremium ? 'Plan: Pro Business' : 'Plan: Free Tier'}
                </p>
                <p className="text-[11px] text-slate-500">Click to toggle Free / Pro testing</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#6C5CE7]">Toggle</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              router.push('/integrations');
            }}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <CreditCard size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Connected Calendars & Apps</p>
                <p className="text-[11px] text-slate-500">Google Calendar, Zoom, Teams, Slack</p>
              </div>
            </div>
            <ChevronRight size={15} className="text-slate-400" />
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              showToast('Logged out of session', 'info');
              onClose();
            }}
            className="text-xs text-red-600 hover:text-red-700 font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>

          <Button type="button" variant="secondary" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
