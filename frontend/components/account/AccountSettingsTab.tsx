'use client';

import React, { useState, useRef } from 'react';
import UserAvatar from '@/components/ui/UserAvatar';
import { useUIStore } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import {
  User,
  Camera,
  Upload,
  Check,
  Crown,
  Trash2,
  Mail,
  Building,
  Briefcase,
  Phone,
  Globe,
  Clock,
  Shield,
  Key,
  Laptop,
  CheckCircle2,
  ExternalLink,
  Download,
  AlertTriangle,
  Sparkles,
  Calendar
} from 'lucide-react';

export default function AccountSettingsTab() {
  const { showToast } = useToast();
  const {
    userProfile,
    setUserProfile,
    isPremium,
    setIsPremium,
    setIsUpgradeModalOpen
  } = useUIStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [role, setRole] = useState(userProfile.role);
  const [company, setCompany] = useState(userProfile.company);
  const [phone, setPhone] = useState(userProfile.phone);
  const [timezone, setTimezone] = useState(userProfile.timezone);
  const [language, setLanguage] = useState(userProfile.language);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Passwords
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP, SVG)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size must be smaller than 5 MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUserProfile({ avatarUrl: result, avatarType: 'photo' });
      showToast('🎉 Custom profile photo uploaded successfully!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile({
      name: name.trim() || 'Alex Vance',
      email: email.trim() || 'alex.vance@company.com',
      role: role.trim() || 'Lead Product Architect',
      company: company.trim() || 'Fireflies Workspace',
      phone: phone.trim(),
      timezone,
      language,
    });
    showToast('🎉 Account & profile information saved successfully!', 'success');
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Please enter your current password', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters long', 'error');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    showToast('Security password updated successfully!', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Account & Profile
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage your profile photo, personal information, workspace preferences, and security.
        </p>
      </div>

      {/* 1. PROFILE PHOTO SECTION (Blank Photo & Custom Photo Picker) */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Profile Photo</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose a blank photo placeholder, an initial monogram, or upload your own portrait.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-[#6C5CE7] bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
            Current: {userProfile.avatarUrl ? 'Custom Photo' : userProfile.avatarType === 'blank' ? 'Blank Photo (Brand)' : userProfile.avatarType === 'blank-neutral' ? 'Blank Photo (Slate)' : 'Initial Monogram'}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-2">
          {/* Large Interactive Preview */}
          <div className="relative group flex-shrink-0">
            <UserAvatar size="xl" showProBadge={true} className="shadow-md ring-4 ring-purple-50" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Click to upload custom photo"
              className="absolute inset-0 bg-black/45 text-white rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all cursor-pointer"
            >
              <Camera size={22} />
              <span className="text-[10px] font-semibold mt-1">Change</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* Preset Photo Options */}
          <div className="flex-1 w-full space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 1. Blank Photo (Purple Gradient Silhouette) */}
              <div
                onClick={() => {
                  setUserProfile({ avatarUrl: null, avatarType: 'blank' });
                  showToast('Selected Blank Photo (Purple Gradient)', 'success');
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                  userProfile.avatarType === 'blank' && !userProfile.avatarUrl
                    ? 'border-[#6C5CE7] bg-[#f4f0fd] shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-2xs flex-shrink-0">
                  <img src="/blank-profile.svg" alt="Blank Profile" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">Blank Photo</p>
                  <p className="text-[10px] text-slate-500">Purple Brand</p>
                </div>
                {userProfile.avatarType === 'blank' && !userProfile.avatarUrl && (
                  <Check size={14} className="text-[#6C5CE7] ml-auto flex-shrink-0" />
                )}
              </div>

              {/* 2. Blank Photo (Neutral Slate Silhouette) */}
              <div
                onClick={() => {
                  setUserProfile({ avatarUrl: null, avatarType: 'blank-neutral' });
                  showToast('Selected Blank Photo (Neutral Slate)', 'success');
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                  userProfile.avatarType === 'blank-neutral' && !userProfile.avatarUrl
                    ? 'border-[#6C5CE7] bg-[#f4f0fd] shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-2xs flex-shrink-0">
                  <img src="/blank-avatar.svg" alt="Neutral Blank Profile" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">Slate Photo</p>
                  <p className="text-[10px] text-slate-500">Neutral Minimal</p>
                </div>
                {userProfile.avatarType === 'blank-neutral' && !userProfile.avatarUrl && (
                  <Check size={14} className="text-[#6C5CE7] ml-auto flex-shrink-0" />
                )}
              </div>

              {/* 3. Initial Monogram "A" */}
              <div
                onClick={() => {
                  setUserProfile({ avatarUrl: null, avatarType: 'initial' });
                  showToast('Selected Initial "A" Monogram', 'success');
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                  userProfile.avatarType === 'initial' && !userProfile.avatarUrl
                    ? 'border-[#6C5CE7] bg-[#f4f0fd] shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#6C5CE7] flex items-center justify-center text-white font-bold text-base shadow-2xs flex-shrink-0">
                  {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">Initial Monogram</p>
                  <p className="text-[10px] text-slate-500">Letter "{userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'A'}"</p>
                </div>
                {userProfile.avatarType === 'initial' && !userProfile.avatarUrl && (
                  <Check size={14} className="text-[#6C5CE7] ml-auto flex-shrink-0" />
                )}
              </div>
            </div>

            {/* Custom Upload Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-[#6C5CE7] bg-white hover:bg-purple-50/30 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              >
                <Upload size={13} className="text-[#6C5CE7]" />
                <span>Upload Custom Photo</span>
              </button>

              {userProfile.avatarUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setUserProfile({ avatarUrl: null, avatarType: 'blank' });
                    showToast('Custom photo removed. Reset to blank photo.', 'info');
                  }}
                  className="px-3.5 py-1.5 rounded-xl border border-red-200 hover:bg-red-50 text-xs font-semibold text-red-600 inline-flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>Remove Custom Photo</span>
                </button>
              )}

              <span className="text-[11px] text-slate-400">
                Recommended 400x400px. JPG, PNG, or WebP up to 5MB.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PERSONAL INFORMATION FORM */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Personal Details</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Your name and role are displayed across meeting transcripts, action items, and invitations.
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Vance"
                  className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7] transition-all"
                />
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Email Address *</span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                  <CheckCircle2 size={10} /> Verified
                </span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.vance@company.com"
                  className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7] transition-all"
                />
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Job Title / Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Role / Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Lead Product Architect"
                  className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7] transition-all"
                />
                <Briefcase size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Company / Workspace */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Company / Organization
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Fireflies Workspace"
                  className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7] transition-all"
                />
                <Building size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 234-5678"
                  className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7] transition-all"
                />
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Timezone
              </label>
              <div className="relative">
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7] transition-all bg-white"
                >
                  <option>UTC-08:00 (Pacific Time - US & Canada)</option>
                  <option>UTC-05:00 (Eastern Time - US & Canada)</option>
                  <option>UTC+00:00 (London, Dublin, Lisbon)</option>
                  <option>UTC+01:00 (Berlin, Paris, Rome)</option>
                  <option>UTC+05:30 (India Standard Time - IST)</option>
                  <option>UTC+09:00 (Tokyo, Seoul)</option>
                  <option>UTC+10:00 (Sydney, Melbourne)</option>
                </select>
                <Clock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#6C5CE7] hover:bg-[#5a4bd6] text-white text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </section>

      {/* 3. SUBSCRIPTION & PLAN SUMMARY */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Plan & Subscription</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review your monthly AI transcription capacity and storage limits.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsPremium(!isPremium);
              showToast(isPremium ? 'Switched to Free Plan' : '🎉 Pro Plan Activated!', 'success');
            }}
            className="px-3 py-1.5 rounded-xl border border-purple-200 bg-[#f4f0fd] text-[#6C5CE7] text-xs font-semibold hover:bg-purple-100 transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Crown size={13} />
            <span>Toggle Free / Pro Mode</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Monthly AI Transcription</span>
              <span className="text-xs font-bold text-slate-900">{isPremium ? 'Unlimited' : '240 / 800 min'}</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#6C5CE7] rounded-full transition-all"
                style={{ width: isPremium ? '10%' : '30%' }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              {isPremium ? 'Pro Business tier has no meeting recording limits.' : 'Resets on the 1st of every month.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Cloud Storage Used</span>
              <span className="text-xs font-bold text-slate-900">1.4 GB / 10 GB</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: '14%' }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Audio recordings, generated transcripts, and AI summaries.
            </p>
          </div>
        </div>
      </section>

      {/* 4. SECURITY & AUTHENTICATION */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Security & Credentials</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Keep your workspace account secure with password updates and 2FA.
          </p>
        </div>

        <form onSubmit={handleSavePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7] transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Shield size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Two-Factor Authentication (2FA)</p>
                <p className="text-[11px] text-slate-400">Extra layer of security with authenticator apps</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setTwoFactorEnabled(!twoFactorEnabled);
                showToast(twoFactorEnabled ? '2FA disabled' : '2FA activated successfully!', 'info');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                twoFactorEnabled
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-all cursor-pointer"
            >
              Update Password
            </button>
          </div>
        </form>

        {/* Active Session Info */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <Laptop size={16} className="text-slate-500" />
            <div>
              <p className="font-semibold text-slate-800">Chrome on Windows 11 (This Device)</p>
              <p className="text-[11px] text-slate-400">Current active session • IP 127.0.0.1</p>
            </div>
          </div>
          <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
            Active Now
          </span>
        </div>
      </section>

      {/* 5. DATA & PRIVACY DANGER ZONE */}
      <section className="bg-white border border-red-200/70 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={16} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-red-900">Account Management & Data</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Export all your stored meetings, transcripts, and summaries, or permanently deactivate your account.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              showToast('Exporting all meeting data archive...', 'info');
              setTimeout(() => showToast('Data export archive ready for download', 'success'), 1500);
            }}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download size={13} />
            <span>Export Meeting Data Archive</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                showToast('Account deletion request initiated.', 'info');
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-semibold text-red-700 transition-all cursor-pointer"
          >
            Delete Account
          </button>
        </div>
      </section>
    </div>
  );
}
