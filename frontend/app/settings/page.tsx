'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  MessageSquare,
  X,
  Video,
  Bell,
  Mail,
  Sparkles,
  Radio,
  BookOpen,
  Code,
  Shield,
  Gift,
  Contact,
  ShieldCheck,
  ChevronDown,
  Trash2,
  Type,
  ListOrdered,
  LayoutGrid,
  Bot,
  Crown,
  Plus,
  Check,
  ExternalLink,
  Users,
  Copy,
  Star,
  CheckCircle2,
  Calendar,
  Lock,
  Globe,
  Settings as SettingsIcon,
  HelpCircle,
  Sliders,
  Send,
  Zap,
  Info
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function SettingsPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Top banners & navigation state
  const [showTrialBanner, setShowTrialBanner] = useState(true);
  const [showPromoBanner, setShowPromoBanner] = useState(true);
  const [currentScope, setCurrentScope] = useState<'personal' | 'team'>('personal');
  const [activeTab, setActiveTab] = useState<
    | 'recording'
    | 'compliance'
    | 'email-assistant'
    | 'ai-settings'
    | 'live-assist'
    | 'knowledge-base'
    | 'mcp-api'
    | 'cookies'
    | 'account'
  >('recording');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlanTrial, setIsPlanTrial] = useState(false);

  // Settings values
  const [autoRecord, setAutoRecord] = useState(true);
  const [autoRecordScope, setAutoRecordScope] = useState('Record all calendar events with a meeting link');
  const [captureVideo, setCaptureVideo] = useState(false);
  const [meetingLanguage, setMeetingLanguage] = useState('English (Global)');
  const [autoDelete, setAutoDelete] = useState(false);
  const [autoDeletePeriod, setAutoDeletePeriod] = useState('30 days');

  const [recapRecipients, setRecapRecipients] = useState('Everyone on the invite');
  const [recapIncludes, setRecapIncludes] = useState('Overview');
  const [prepEmailRecipients, setPrepEmailRecipients] = useState('Send to all participants');

  const [notetakerName, setNotetakerName] = useState('Fireflies.ai Notetaker Apoorv');
  const [isNameSaved, setIsNameSaved] = useState(false);

  // Rules lists
  const [recordingRules, setRecordingRules] = useState<string[]>([
    'Title contains "Sprint"',
    'Title contains "Client"',
  ]);
  const [restrictionRules, setRestrictionRules] = useState<string[]>([
    'Title contains "Personal"',
    'Title contains "Doctor"',
  ]);

  // AI & Other Settings
  const [customVocabulary, setCustomVocabulary] = useState<string[]>(['Fireflies', 'FastAPI', 'NextJS', 'Roadmap']);
  const [newVocabWord, setNewVocabWord] = useState('');
  const [aiModel, setAiModel] = useState('Fireflies Intelligence (v2.4)');

  // Modals state
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [newRecordRule, setNewRecordRule] = useState('');
  const [newRecordRuleType, setNewRecordRuleType] = useState('Title contains');
  const [isRestrictModalOpen, setIsRestrictModalOpen] = useState(false);
  const [newRestrictRule, setNewRestrictRule] = useState('');
  const [newRestrictRuleType, setNewRestrictRuleType] = useState('Title contains');
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isInviteTeamModalOpen, setIsInviteTeamModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  // Team state
  const [teamMembers, setTeamMembers] = useState([
    { name: 'Apoorv Verma', email: 'apoorvverma.genaibuilder@gmail.com', role: 'Owner', status: 'Active' },
    { name: 'Sarah Chen', email: 'sarah@company.com', role: 'Member', status: 'Active' },
    { name: 'Mike Johnson', email: 'mike@company.com', role: 'Member', status: 'Active' },
  ]);

  const handleNameBlur = () => {
    setIsNameSaved(true);
    showToast('Notetaker name updated successfully!', 'success');
    setTimeout(() => setIsNameSaved(false), 2000);
  };

  const handleAddRecordRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecordRule.trim()) return;
    const rule = `${newRecordRuleType} "${newRecordRule.trim()}"`;
    setRecordingRules((prev) => [...prev, rule]);
    setNewRecordRule('');
    setIsRecordModalOpen(false);
    showToast(`Added recording rule: ${rule}`, 'success');
  };

  const handleRemoveRecordRule = (index: number) => {
    setRecordingRules((prev) => prev.filter((_, i) => i !== index));
    showToast('Recording rule removed', 'info');
  };

  const handleAddRestrictRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestrictRule.trim()) return;
    const rule = `${newRestrictRuleType} "${newRestrictRule.trim()}"`;
    setRestrictionRules((prev) => [...prev, rule]);
    setNewRestrictRule('');
    setIsRestrictModalOpen(false);
    showToast(`Added restriction rule: ${rule}`, 'success');
  };

  const handleRemoveRestrictRule = (index: number) => {
    setRestrictionRules((prev) => prev.filter((_, i) => i !== index));
    showToast('Restriction rule removed', 'info');
  };

  const handleAddVocab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVocabWord.trim()) return;
    if (!customVocabulary.includes(newVocabWord.trim())) {
      setCustomVocabulary((prev) => [...prev, newVocabWord.trim()]);
    }
    setNewVocabWord('');
    showToast('Vocabulary keyword added', 'success');
  };

  const handleRemoveVocab = (word: string) => {
    setCustomVocabulary((prev) => prev.filter((w) => w !== word));
  };

  const handleStartTrial = () => {
    setIsPlanTrial(true);
    setIsTrialModalOpen(false);
    showToast('7-Day Business Plan Free Trial Activated! Enjoy unlimited transcripts.', 'success');
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFeedbackModalOpen(false);
    setFeedbackText('');
    showToast('Thank you for your feedback! We appreciate your input.', 'success');
  };

  const handleInviteTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setTeamMembers((prev) => [
      ...prev,
      { name: inviteEmail.split('@')[0], email: inviteEmail.trim(), role: 'Member', status: 'Invited' }
    ]);
    setInviteEmail('');
    setIsInviteTeamModalOpen(false);
    showToast(`Invitation sent to ${inviteEmail}`, 'success');
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText('https://app.fireflies.ai/join?ref=apoorv-1024');
    showToast('Referral link copied to clipboard!', 'success');
  };

  if (!isMounted) {
    return <div suppressHydrationWarning className="min-h-screen bg-[#fafbfc]" />;
  }

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#fafbfc] flex flex-col font-sans text-slate-800">
      {/* 1. TOP TRIAL PROMO BANNER */}
      {showTrialBanner && (
        <div className="w-full bg-[#fbf9fe] border-b border-purple-100/70 px-4 py-2 flex items-center justify-between text-xs text-slate-700 select-none shadow-xs">
          <div className="flex-1 text-center">
            <span>You are eligible for 7 days business plan free trial. </span>
            <button
              type="button"
              onClick={() => setIsTrialModalOpen(true)}
              className="text-[#6C5CE7] hover:text-[#5a4bd6] font-semibold underline underline-offset-2 ml-1 cursor-pointer transition-colors inline-flex items-center gap-0.5"
            >
              Start free trial &rarr;
            </button>
          </div>
          <button
            type="button"
            title="Dismiss trial banner"
            onClick={() => setShowTrialBanner(false)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 2. SETTINGS HEADER BAR */}
      <header className="h-14 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/')}
            title="Go back to Home"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
        </div>

        {/* Centered Search settings input */}
        <div className="relative w-80 sm:w-96">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search settings"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] transition-all"
          />
        </div>

        {/* Right action button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsFeedbackModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <MessageSquare size={15} className="text-slate-500" />
            <span>Feedback</span>
          </button>
        </div>
      </header>

      {/* 3. MAIN SPLIT LAYOUT */}
      <div className="flex-1 flex max-w-[1440px] w-full mx-auto">
        {/* LEFT SETTINGS NAVIGATION SIDEBAR */}
        <aside className="w-60 flex-shrink-0 border-r border-slate-200/80 bg-white p-4 flex flex-col justify-between min-h-[calc(100vh-70px)]">
          <div>
            {/* User Account / Workspace Dropdown */}
            <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#6C5CE7] flex items-center justify-center text-white font-bold text-xs shadow-xs">
                  A
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-800 truncate">apoorvverma.genaibu...</p>
                  <p className="text-[11px] text-slate-400">
                    {isPlanTrial ? (
                      <span className="text-emerald-600 font-semibold">Business Trial</span>
                    ) : (
                      'Free Plan'
                    )}
                  </p>
                </div>
              </div>
              <ChevronDown size={14} className="text-slate-400 flex-shrink-0 ml-1" />
            </div>

            {/* Segmented Control [ Personal | Team ] */}
            <div className="bg-slate-100/90 p-1 rounded-xl flex items-center my-3 text-xs font-medium border border-slate-200/40">
              <button
                type="button"
                onClick={() => setCurrentScope('personal')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                  currentScope === 'personal'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Personal
              </button>
              <button
                type="button"
                onClick={() => setCurrentScope('team')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                  currentScope === 'team'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Team
              </button>
            </div>

            {/* Navigation Menu List */}
            {currentScope === 'personal' ? (
              <nav className="space-y-0.5">
                {[
                  { id: 'recording', label: 'Recording & Privacy', icon: Video },
                  { id: 'compliance', label: 'Compliance Notification', icon: Bell },
                  { id: 'email-assistant', label: 'Email Assistant', icon: Mail },
                  { id: 'ai-settings', label: 'AI Settings', icon: Sparkles },
                  { id: 'live-assist', label: 'Live Assist', icon: Radio },
                  { id: 'knowledge-base', label: 'Knowledge Base', icon: BookOpen },
                  { id: 'mcp-api', label: '<> MCP & API', icon: Code },
                  { id: 'cookies', label: 'Cookies', icon: Shield },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                        isActive
                          ? 'bg-slate-100 text-slate-900 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Icon size={16} className={isActive ? 'text-[#6C5CE7]' : 'text-slate-400'} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            ) : (
              <nav className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('account')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-900 cursor-pointer"
                >
                  <Users size={16} className="text-[#6C5CE7]" />
                  <span>Team Workspace</span>
                </button>
                <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-[11px] text-purple-900 mt-3 leading-relaxed">
                  Managing <strong>Fireflies Team Space</strong>. Add team seats, assign roles, and share recording policies.
                </div>
              </nav>
            )}
          </div>

          {/* Bottom Sidebar Items */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsReferralModalOpen(true)}
              className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-[#faf8ff] border border-purple-100/80 hover:bg-purple-50 text-xs text-slate-700 font-medium transition-all cursor-pointer group shadow-xs"
            >
              <Gift size={16} className="text-[#6C5CE7] group-hover:scale-110 transition-transform" />
              <span>Refer and earn $5 each</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('account')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                activeTab === 'account'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Contact size={16} className="text-slate-400" />
              <span>Account</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSecurityModalOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-slate-400" />
                <span>Security overview</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-purple-50 text-[#6C5CE7] font-semibold text-[10px]">
                2/3
              </span>
            </button>
          </div>
        </aside>

        {/* RIGHT SETTINGS CONTENT PANEL */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-4xl pb-32">
          {/* TAB 1: RECORDING & PRIVACY (Matches Demo Images 2, 3, 4) */}
          {activeTab === 'recording' && currentScope === 'personal' && (
            <div className="space-y-6">
              {/* Promo Banner */}
              {showPromoBanner && (
                <div className="p-3 px-4 bg-[#fcf8fa] border border-pink-100 rounded-xl flex items-center justify-between shadow-xs transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 flex items-center justify-center font-bold text-xs text-red-500">
                      <span className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-500 to-blue-500">M</span>
                    </div>
                    <p className="text-xs font-normal text-slate-800">
                      <strong className="font-semibold text-slate-900">Email Assistant</strong> — Auto-drafts replies and follow-ups, and labels your inbox.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('email-assistant')}
                      className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 flex items-center gap-1 shadow-xs cursor-pointer transition-colors"
                    >
                      <span>Try Now</span>
                      <span className="text-slate-500 font-bold">&rarr;</span>
                    </button>
                    <button
                      type="button"
                      title="Dismiss"
                      onClick={() => setShowPromoBanner(false)}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* 1. RECORDING SECTION */}
              <section className="space-y-2">
                <h3 className="text-xs font-medium text-slate-500">Recording</h3>
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-6">
                  {/* Auto-record meetings */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 flex items-center justify-center text-blue-500 mt-0.5">
                          <Calendar size={18} />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-slate-900">Auto-record meetings</h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Fireflies notetaker will join and record your calendar events.
                          </p>
                        </div>
                      </div>
                      {/* Purple Toggle Switch */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={autoRecord}
                        onClick={() => {
                          setAutoRecord(!autoRecord);
                          showToast(autoRecord ? 'Auto-recording paused' : 'Auto-recording enabled', 'info');
                        }}
                        style={{
                          width: '40px',
                          height: '22px',
                          backgroundColor: autoRecord ? '#6C5CE7' : '#e2e8f0',
                          borderRadius: '9999px',
                          padding: '2px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                          border: 'none',
                        }}
                      >
                        <span
                          style={{
                            width: '18px',
                            height: '18px',
                            backgroundColor: '#ffffff',
                            borderRadius: '9999px',
                            transform: autoRecord ? 'translateX(18px)' : 'translateX(0px)',
                            transition: 'transform 0.2s ease-in-out',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                          }}
                        />
                      </button>
                    </div>

                    {/* Scope select */}
                    <div className="relative pl-8">
                      <select
                        value={autoRecordScope}
                        onChange={(e) => {
                          setAutoRecordScope(e.target.value);
                          showToast(`Updated recording scope to: ${e.target.value}`, 'success');
                        }}
                        className="w-full px-3.5 py-2 bg-white hover:bg-slate-50/70 border border-slate-200/90 rounded-lg text-xs font-normal text-slate-700 appearance-none focus:outline-none focus:border-[#6C5CE7] cursor-pointer transition-colors"
                      >
                        <option>Record all calendar events with a meeting link</option>
                        <option>Record only events I organize</option>
                        <option>Record events with external participants</option>
                        <option>Do not join automatically (manual join only)</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Capture meeting video */}
                  <div className="flex items-start justify-between pt-1">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 flex items-center justify-center text-slate-400 mt-0.5">
                        <Video size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-semibold text-slate-900">Capture meeting video</h4>
                          <span className="w-4 h-4 rounded bg-purple-100 text-[#6C5CE7] flex items-center justify-center">
                            <Crown size={10} className="fill-[#6C5CE7]" />
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Capture your meeting screen and shared content as video.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={captureVideo}
                      onClick={() => {
                        setCaptureVideo(!captureVideo);
                        showToast(captureVideo ? 'Video capture disabled' : 'Video capture enabled (1080p)', 'info');
                      }}
                      style={{
                        width: '40px',
                        height: '22px',
                        backgroundColor: captureVideo ? '#6C5CE7' : '#e2e8f0',
                        borderRadius: '9999px',
                        padding: '2px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        border: 'none',
                      }}
                    >
                      <span
                        style={{
                          width: '18px',
                          height: '18px',
                          backgroundColor: '#ffffff',
                          borderRadius: '9999px',
                          transform: captureVideo ? 'translateX(18px)' : 'translateX(0px)',
                          transition: 'transform 0.2s ease-in-out',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                        }}
                      />
                    </button>
                  </div>

                  {/* Meeting language */}
                  <div className="space-y-3 pt-1">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 flex items-center justify-center text-slate-400 mt-0.5">
                        <Type size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-900">Meeting language</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          For transcripts and summaries.
                        </p>
                      </div>
                    </div>
                    <div className="relative pl-8">
                      <select
                        value={meetingLanguage}
                        onChange={(e) => {
                          setMeetingLanguage(e.target.value);
                          showToast(`Meeting language set to ${e.target.value}`, 'success');
                        }}
                        className="w-full px-3.5 py-2 bg-white hover:bg-slate-50/70 border border-slate-200/90 rounded-lg text-xs font-normal text-slate-700 appearance-none focus:outline-none focus:border-[#6C5CE7] cursor-pointer transition-colors"
                      >
                        <option>English (Global)</option>
                        <option>English (US)</option>
                        <option>English (UK)</option>
                        <option>Spanish (Español)</option>
                        <option>French (Français)</option>
                        <option>German (Deutsch)</option>
                        <option>Hindi (हिंदी)</option>
                        <option>Portuguese (Português)</option>
                        <option>Japanese (日本語)</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Auto-delete meetings */}
                  <div className="space-y-3 pt-1">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 flex items-center justify-center text-slate-400 mt-0.5">
                          <Trash2 size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-semibold text-slate-900">Auto-delete meetings</h4>
                            <span className="w-4 h-4 rounded bg-purple-100 text-[#6C5CE7] flex items-center justify-center">
                              <Crown size={10} className="fill-[#6C5CE7]" />
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Automatically delete meetings after a set retention period.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={autoDelete}
                        onClick={() => {
                          setAutoDelete(!autoDelete);
                          showToast(autoDelete ? 'Auto-delete disabled' : 'Auto-delete retention enabled', 'info');
                        }}
                        style={{
                          width: '40px',
                          height: '22px',
                          backgroundColor: autoDelete ? '#6C5CE7' : '#e2e8f0',
                          borderRadius: '9999px',
                          padding: '2px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                          border: 'none',
                        }}
                      >
                        <span
                          style={{
                            width: '18px',
                            height: '18px',
                            backgroundColor: '#ffffff',
                            borderRadius: '9999px',
                            transform: autoDelete ? 'translateX(18px)' : 'translateX(0px)',
                            transition: 'transform 0.2s ease-in-out',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                          }}
                        />
                      </button>
                    </div>
                    {autoDelete && (
                      <div className="relative pl-8">
                        <select
                          value={autoDeletePeriod}
                          onChange={(e) => setAutoDeletePeriod(e.target.value)}
                          className="w-full px-3.5 py-2 bg-white border border-slate-200/90 rounded-lg text-xs font-normal text-slate-700 appearance-none focus:outline-none focus:border-[#6C5CE7]"
                        >
                          <option>30 days</option>
                          <option>60 days</option>
                          <option>90 days</option>
                          <option>180 days</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* 2. EMAIL NOTIFICATION SECTION (Matches Image 3) */}
              <section className="space-y-2">
                <h3 className="text-xs font-medium text-slate-500">Email Notification</h3>
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-6">
                  {/* Meeting recap email */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 flex items-center justify-center text-slate-400 mt-0.5">
                        <ListOrdered size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-900">Meeting recap email</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Send a recap email to selected recipients after each meeting is processed.
                        </p>
                      </div>
                    </div>
                    <div className="relative pl-8">
                      <select
                        value={recapRecipients}
                        onChange={(e) => {
                          setRecapRecipients(e.target.value);
                          showToast(`Recap email recipient rule: ${e.target.value}`, 'success');
                        }}
                        className="w-full px-3.5 py-2 bg-white hover:bg-slate-50/70 border border-slate-200/90 rounded-lg text-xs font-normal text-slate-700 appearance-none focus:outline-none focus:border-[#6C5CE7] cursor-pointer"
                      >
                        <option>Everyone on the invite</option>
                        <option>Only me and participants from my company</option>
                        <option>Only me</option>
                        <option>No one</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    {/* What to include */}
                    <div className="pl-8 space-y-1.5 pt-1">
                      <p className="text-xs font-normal text-slate-500">What to include</p>
                      <div className="relative">
                        <select
                          value={recapIncludes}
                          onChange={(e) => {
                            setRecapIncludes(e.target.value);
                            showToast(`Recap content set to: ${e.target.value}`, 'info');
                          }}
                          className="w-full px-3.5 py-2 bg-white hover:bg-slate-50/70 border border-slate-200/90 rounded-lg text-xs font-normal text-slate-700 appearance-none focus:outline-none focus:border-[#6C5CE7] cursor-pointer"
                        >
                          <option>Overview</option>
                          <option>Overview + Action Items</option>
                          <option>Full Notes + Audio link</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Meeting-prep email */}
                  <div className="space-y-3 pt-1">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 flex items-center justify-center text-slate-400 mt-0.5">
                        <ListOrdered size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-900">Meeting-prep email</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Send a prep email 1 hour before each recurring meeting with context from past interactions.
                        </p>
                      </div>
                    </div>
                    <div className="relative pl-8">
                      <select
                        value={prepEmailRecipients}
                        onChange={(e) => {
                          setPrepEmailRecipients(e.target.value);
                          showToast(`Meeting-prep email set to: ${e.target.value}`, 'success');
                        }}
                        className="w-full px-3.5 py-2 bg-white hover:bg-slate-50/70 border border-slate-200/90 rounded-lg text-xs font-normal text-slate-700 appearance-none focus:outline-none focus:border-[#6C5CE7] cursor-pointer"
                      >
                        <option>Send to all participants</option>
                        <option>Send only to me</option>
                        <option>Disabled</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. RECORDING RULES SECTION (Matches Images 3 & 4) */}
              <section className="space-y-2">
                <h3 className="text-xs font-medium text-slate-500">Recording Rules</h3>
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-6">
                  {/* Recording rules */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 flex items-center justify-center text-slate-400 mt-0.5">
                        <Video size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-900">Recording rules</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Notetaker will record meetings if the calendar meeting title has mentioned keywords or emails id or domains.
                        </p>
                      </div>
                    </div>
                    <div className="pl-8 space-y-3">
                      <button
                        type="button"
                        onClick={() => setIsRecordModalOpen(true)}
                        className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                      >
                        <Plus size={14} className="text-slate-600" />
                        <span>Record Rules</span>
                      </button>

                      {/* Rule tags */}
                      {recordingRules.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {recordingRules.map((rule, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50 border border-purple-100 text-xs font-medium text-[#6C5CE7]"
                            >
                              <span>{rule}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveRecordRule(idx)}
                                className="text-purple-400 hover:text-purple-700 cursor-pointer"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Restriction rules */}
                  <div className="space-y-3 pt-1">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 flex items-center justify-center text-slate-400 mt-0.5">
                        <LayoutGrid size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-900">Restriction rules</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Notetaker will not record meetings if the calendar meeting title has mentioned keywords or emails id or domains.
                        </p>
                      </div>
                    </div>
                    <div className="pl-8 space-y-3">
                      <button
                        type="button"
                        onClick={() => setIsRestrictModalOpen(true)}
                        className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                      >
                        <Plus size={14} className="text-slate-600" />
                        <span>Restriction Rules</span>
                      </button>

                      {/* Restriction tags */}
                      {restrictionRules.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {restrictionRules.map((rule, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 border border-red-100 text-xs font-medium text-red-600"
                            >
                              <span>{rule}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveRestrictRule(idx)}
                                className="text-red-400 hover:text-red-700 cursor-pointer"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. NOTETAKER PREFERENCE SECTION (Matches Image 4) */}
              <section className="space-y-2">
                <h3 className="text-xs font-medium text-slate-500">Notetaker Preference</h3>
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 flex items-center justify-center text-slate-400 mt-0.5">
                      <Bot size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-semibold text-slate-900">Notetaker name</h4>
                        <span className="w-4 h-4 rounded bg-purple-100 text-[#6C5CE7] flex items-center justify-center">
                          <Crown size={10} className="fill-[#6C5CE7]" />
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Your Fireflies bot will join meetings using this name. Applies to all future meetings.
                      </p>
                    </div>
                  </div>
                  <div className="pl-8 relative">
                    <input
                      type="text"
                      value={notetakerName}
                      onChange={(e) => setNotetakerName(e.target.value)}
                      onBlur={handleNameBlur}
                      className="w-full px-3.5 py-2.5 bg-slate-50/60 focus:bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#6C5CE7] transition-all"
                    />
                    {isNameSaved && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 flex items-center gap-1 text-[11px] font-semibold">
                        <Check size={14} /> Saved
                      </span>
                    )}
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: COMPLIANCE NOTIFICATION */}
          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <section className="space-y-2">
                <h3 className="text-xs font-medium text-slate-500">Compliance & Disclaimers</h3>
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900">Announce bot in meeting chat</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Automatically post a notification in Zoom/Teams/Meet chat when Fireflies begins recording.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast('Compliance chat announcement updated', 'success')}
                      className="px-3 py-1.5 bg-[#6C5CE7] text-white rounded-lg text-xs font-medium cursor-pointer shadow-xs"
                    >
                      Active
                    </button>
                  </div>
                  <div className="border-t border-slate-100" />
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-900">Custom Recording Disclosure</h4>
                    <p className="text-xs text-slate-400">Message sent to participants before recording commences.</p>
                    <textarea
                      rows={3}
                      defaultValue="Hello! I'm Fireflies.ai, an AI notetaker invited to record and summarize this meeting for attendees. Let us know if you'd like to pause transcription."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-[#6C5CE7]"
                    />
                    <button
                      type="button"
                      onClick={() => showToast('Disclosure message saved', 'success')}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium cursor-pointer"
                    >
                      Save Disclosure
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 3: EMAIL ASSISTANT */}
          {activeTab === 'email-assistant' && (
            <div className="space-y-6">
              <section className="space-y-2">
                <h3 className="text-xs font-medium text-slate-500">Connected Mailboxes</h3>
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-red-500 font-bold text-sm">G</div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900">Google Workspace (Gmail)</p>
                        <p className="text-[11px] text-slate-400">apoorvverma.genaibuilder@gmail.com</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-semibold">Connected</span>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 font-bold text-sm">O</div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900">Microsoft Outlook</p>
                        <p className="text-[11px] text-slate-400">Not connected</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast('Connecting Microsoft Outlook...', 'info')}
                      className="px-3 py-1 border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 rounded-lg cursor-pointer"
                    >
                      Connect
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 4: AI SETTINGS */}
          {activeTab === 'ai-settings' && (
            <div className="space-y-6">
              <section className="space-y-2">
                <h3 className="text-xs font-medium text-slate-500">Custom Vocabulary & Model</h3>
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-5">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900">AI Transcription Model</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Select your primary engine for summary generation and speech recognition.</p>
                    <select
                      value={aiModel}
                      onChange={(e) => {
                        setAiModel(e.target.value);
                        showToast(`AI model changed to ${e.target.value}`, 'success');
                      }}
                      className="mt-2 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium cursor-pointer"
                    >
                      <option>Fireflies Intelligence (v2.4 - Default)</option>
                      <option>GPT-4o Meeting Intelligence</option>
                      <option>Claude 3.5 Sonnet Enterprise</option>
                    </select>
                  </div>

                  <div className="border-t border-slate-100" />

                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-slate-900">Custom Vocabulary</h4>
                    <p className="text-xs text-slate-400">Add proprietary jargon, product names, or acronyms to improve speech accuracy.</p>
                    <form onSubmit={handleAddVocab} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add custom keyword (e.g. Supabase, Q3)"
                        value={newVocabWord}
                        onChange={(e) => setNewVocabWord(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 bg-[#6C5CE7] hover:bg-[#5a4bd6] text-white text-xs font-medium rounded-lg cursor-pointer"
                      >
                        Add
                      </button>
                    </form>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {customVocabulary.map((word) => (
                        <span key={word} className="px-2.5 py-1 bg-purple-50 border border-purple-100 text-[#6C5CE7] text-xs font-medium rounded-md flex items-center gap-1.5">
                          <span>{word}</span>
                          <button type="button" onClick={() => handleRemoveVocab(word)} className="cursor-pointer text-purple-400 hover:text-purple-700">
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 5: LIVE ASSIST */}
          {activeTab === 'live-assist' && (
            <div className="space-y-6">
              <section className="space-y-2">
                <h3 className="text-xs font-medium text-slate-500">Live Assist & Cues</h3>
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900">Real-time Coaching & Battlecards</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Display relevant contextual notes when client mentions competitor keywords.</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-purple-50 text-[#6C5CE7] font-semibold text-xs">Enabled</span>
                  </div>
                  <div className="border-t border-slate-100" />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900">Live Transcript Stream</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Stream live meeting dialogue with 500ms latency.</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-semibold text-xs">Active</span>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 6: KNOWLEDGE BASE */}
          {activeTab === 'knowledge-base' && (
            <div className="space-y-6">
              <section className="space-y-2">
                <h3 className="text-xs font-medium text-slate-500">Indexed Knowledge Sources</h3>
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <BookOpen size={20} className="text-[#6C5CE7]" />
                      <div>
                        <p className="text-xs font-semibold text-slate-900">Company Meeting Transcripts</p>
                        <p className="text-[11px] text-slate-400">5 meetings indexed &middot; 1,420 sentences</p>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-600 font-semibold">Synced</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('Connecting Notion Knowledge Base...', 'info')}
                    className="w-full py-2 border-2 border-dashed border-slate-200 hover:border-[#6C5CE7] text-slate-600 hover:text-[#6C5CE7] rounded-xl text-xs font-medium transition-colors cursor-pointer"
                  >
                    + Connect Notion / Confluence Workspace
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* TAB 7: MCP & API */}
          {activeTab === 'mcp-api' && (
            <div className="space-y-6">
              <section className="space-y-2">
                <h3 className="text-xs font-medium text-slate-500">Model Context Protocol (MCP) & REST API</h3>
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-5">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900">Fireflies API Token</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Use this token to access the REST API or connect external LLM sidecars.</p>
                    <div className="flex gap-2 mt-2">
                      <input
                        type="password"
                        readOnly
                        value="ff_live_98a76d1234efc8901234b67"
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('ff_live_98a76d1234efc8901234b67');
                          showToast('API key copied to clipboard!', 'success');
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        <Copy size={13} />
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-slate-100" />

                  <div>
                    <h4 className="text-xs font-semibold text-slate-900">MCP SSE Endpoint</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Model Context Protocol server for cursor/antigravity assistants.</p>
                    <code className="block mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-[#6C5CE7]">
                      http://localhost:8000/mcp/sse
                    </code>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 8: COOKIES */}
          {activeTab === 'cookies' && (
            <div className="space-y-6">
              <section className="space-y-2">
                <h3 className="text-xs font-medium text-slate-500">Cookie & Privacy Preferences</h3>
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900">Strictly Necessary Cookies</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Required for authentication, session security, and basic operations.</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">Always Active</span>
                  </div>
                  <div className="border-t border-slate-100" />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900">Analytics & Telemetry</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Allows us to optimize meeting transcription speeds.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast('Cookie preferences updated', 'success')}
                      className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-medium cursor-pointer"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 9: ACCOUNT & PROFILE */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <section className="space-y-2">
                <h3 className="text-xs font-medium text-slate-500">Account & Profile</h3>
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Full Name</label>
                      <input
                        type="text"
                        defaultValue="Apoorv Verma"
                        className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Email Address</label>
                      <input
                        type="email"
                        readOnly
                        value="apoorvverma.genaibuilder@gmail.com"
                        className="w-full mt-1.5 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => showToast('Profile details updated!', 'success')}
                      className="px-4 py-2 bg-[#6C5CE7] hover:bg-[#5a4bd6] text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors shadow-xs"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 10: TEAM WORKSPACE VIEW */}
          {currentScope === 'team' && (
            <div className="space-y-6">
              <section className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-medium text-slate-500">Team Members & Seats</h3>
                  <button
                    type="button"
                    onClick={() => setIsInviteTeamModalOpen(true)}
                    className="px-3.5 py-1.5 bg-[#6C5CE7] hover:bg-[#5a4bd6] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus size={14} />
                    <span>Invite Member</span>
                  </button>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50/80 border-b border-slate-200/80 font-semibold text-slate-600">
                      <tr>
                        <th className="px-4 py-3">Member</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {teamMembers.map((member, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60">
                          <td className="px-4 py-3 font-medium text-slate-900">
                            <div>{member.name}</div>
                            <div className="text-[11px] text-slate-400">{member.email}</div>
                          </td>
                          <td className="px-4 py-3">{member.role}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold text-[10px]">
                              {member.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {member.role !== 'Owner' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setTeamMembers((prev) => prev.filter((_, i) => i !== idx));
                                  showToast(`Removed ${member.name} from team`, 'info');
                                }}
                                className="text-red-500 hover:text-red-700 font-medium cursor-pointer"
                              >
                                Remove
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>

      {/* ================= MODALS ================= */}

      {/* 1. TRIAL MODAL */}
      {isTrialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              type="button"
              onClick={() => setIsTrialModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-[#6C5CE7] flex items-center justify-center mb-4">
              <Crown size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Start 7-Day Business Trial</h3>
            <p className="text-xs text-slate-500 mt-1">Unlock all enterprise AI capabilities with zero upfront charge.</p>

            <div className="space-y-2.5 my-5">
              {[
                'Unlimited AI meeting transcripts & summaries',
                'Screen & meeting video recording (1080p)',
                'AskFred AI Copilot with unlimited prompt queries',
                'Smart search across all past conversations',
                'CRM integrations (Salesforce, HubSpot, Slack)'
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsTrialModalOpen(false)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartTrial}
                className="flex-1 py-2 rounded-xl bg-[#6C5CE7] hover:bg-[#5a4bd6] text-white text-xs font-semibold shadow-sm cursor-pointer transition-colors"
              >
                Activate Free Trial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. FEEDBACK MODAL */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              type="button"
              onClick={() => setIsFeedbackModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6C5CE7] flex items-center justify-center mb-3">
              <MessageSquare size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Share Feedback with Fireflies</h3>
            <p className="text-xs text-slate-500 mt-0.5">How can we make your meeting experience better?</p>

            <form onSubmit={handleSendFeedback} className="space-y-4 mt-4">
              <div className="flex justify-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackRating(star)}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      size={22}
                      className={star <= feedbackRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}
                    />
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Comments or Feature Suggestions</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell us what you loved or how we can improve..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full mt-1.5 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-[#6C5CE7]"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsFeedbackModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#6C5CE7] hover:bg-[#5a4bd6] text-white text-xs font-semibold shadow-sm cursor-pointer transition-colors"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. RECORD RULES MODAL */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              type="button"
              onClick={() => setIsRecordModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>
            <h3 className="text-base font-bold text-slate-900">Add Recording Rule</h3>
            <p className="text-xs text-slate-500 mt-0.5">Meetings matching this criteria will automatically be recorded.</p>

            <form onSubmit={handleAddRecordRule} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">Rule Condition</label>
                <select
                  value={newRecordRuleType}
                  onChange={(e) => setNewRecordRuleType(e.target.value)}
                  className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#6C5CE7]"
                >
                  <option>Title contains</option>
                  <option>Participant email is</option>
                  <option>Email domain matches</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Keyword / Value</label>
                <input
                  type="text"
                  required
                  placeholder='e.g. "Sprint", "Interview", "@client.com"'
                  value={newRecordRule}
                  onChange={(e) => setNewRecordRule(e.target.value)}
                  className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#6C5CE7]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#6C5CE7] hover:bg-[#5a4bd6] text-white text-xs font-semibold shadow-sm cursor-pointer transition-colors"
                >
                  Add Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. RESTRICTION RULES MODAL */}
      {isRestrictModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              type="button"
              onClick={() => setIsRestrictModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>
            <h3 className="text-base font-bold text-slate-900">Add Restriction Rule</h3>
            <p className="text-xs text-slate-500 mt-0.5">Fireflies will skip recording any calendar event matching this rule.</p>

            <form onSubmit={handleAddRestrictRule} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">Restriction Condition</label>
                <select
                  value={newRestrictRuleType}
                  onChange={(e) => setNewRestrictRuleType(e.target.value)}
                  className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#6C5CE7]"
                >
                  <option>Title contains</option>
                  <option>Participant email is</option>
                  <option>Email domain matches</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Restricted Keyword / Value</label>
                <input
                  type="text"
                  required
                  placeholder='e.g. "Personal", "Confidential", "Doctor"'
                  value={newRestrictRule}
                  onChange={(e) => setNewRestrictRule(e.target.value)}
                  className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#6C5CE7]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRestrictModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm cursor-pointer transition-colors"
                >
                  Add Restriction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. REFERRAL MODAL */}
      {isReferralModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              type="button"
              onClick={() => setIsReferralModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-[#6C5CE7] flex items-center justify-center mb-3">
              <Gift size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Refer Colleagues, Earn $5 Each</h3>
            <p className="text-xs text-slate-500 mt-0.5">Invite teammates and get $5 in Fireflies AI credit for every signup.</p>

            <div className="my-5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-[11px] font-semibold text-slate-600 mb-1">Your Personal Invite Link</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="https://app.fireflies.ai/join?ref=apoorv-1024"
                  className="flex-1 bg-white px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono text-slate-700"
                />
                <button
                  type="button"
                  onClick={copyReferralLink}
                  className="px-3 py-1.5 bg-[#6C5CE7] hover:bg-[#5a4bd6] text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Copy size={13} />
                  <span>Copy</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsReferralModalOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. SECURITY OVERVIEW MODAL */}
      {isSecurityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              type="button"
              onClick={() => setIsSecurityModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6C5CE7] flex items-center justify-center mb-3">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Security & Compliance Overview</h3>
            <p className="text-xs text-slate-500 mt-0.5">Your organization compliance score is 2 of 3.</p>

            <div className="space-y-3 my-5">
              <div className="flex items-center justify-between p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Verified Email Domain</p>
                    <p className="text-[11px] text-slate-500">apoorvverma.genaibuilder@gmail.com verified</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600">Passed</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Two-Factor Authentication (2FA)</p>
                    <p className="text-[11px] text-slate-500">TOTP Authenticator enabled</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600">Active</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-amber-50/50 border border-amber-100 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <Lock size={18} className="text-amber-600" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Enterprise SSO (SAML / Okta)</p>
                    <p className="text-[11px] text-slate-500">Available on Enterprise plans</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTrialModalOpen(true)}
                  className="text-[11px] font-semibold text-[#6C5CE7] hover:underline cursor-pointer"
                >
                  Upgrade
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSecurityModalOpen(false)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 7. INVITE TEAM MODAL */}
      {isInviteTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              type="button"
              onClick={() => setIsInviteTeamModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>
            <h3 className="text-base font-bold text-slate-900">Invite Teammates</h3>
            <p className="text-xs text-slate-500 mt-0.5">Share meeting recordings and collective AI intelligence.</p>

            <form onSubmit={handleInviteTeam} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">Teammate Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full mt-1.5 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#6C5CE7]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteTeamModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#6C5CE7] hover:bg-[#5a4bd6] text-white text-xs font-semibold shadow-sm cursor-pointer transition-colors"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
