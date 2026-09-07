'use client';

import { useState } from 'react';
import {
  X,
  Search,
  BookOpen,
  ChevronRight,
  Keyboard,
  Sparkles,
  FileQuestion,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FAQS = [
  {
    q: 'How does Fireflies record my meetings?',
    a: 'Fireflies joins your calendar meetings (Google Meet, Zoom, MS Teams) as a participant ("Fred") and generates AI notes and real-time transcripts.',
  },
  {
    q: 'Can I upload pre-recorded audio or video?',
    a: 'Yes! Navigate to Home or Meetings and click "Upload File" or use the top-right "Capture" button to upload MP3, MP4, M4A, or WAV files.',
  },
  {
    q: 'How do I use AskFred AI assistant?',
    a: 'Open any meeting notebook and switch to the AskFred tab. You can ask for custom executive summaries, action items, or specific details discussed.',
  },
  {
    q: 'What integrations are supported?',
    a: 'Fireflies connects with Slack, Notion, Asana, Monday.com, Trello, ClickUp, HubSpot, Salesforce, and many other productivity apps.',
  },
];

export default function HelpSupportModal({ isOpen, onClose }: HelpSupportModalProps) {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'faq' | 'shortcuts' | 'contact'>('faq');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSent, setTicketSent] = useState(false);

  if (!isOpen) return null;

  const filteredFaqs = FAQS.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;
    setTicketSent(true);
    showToast('Support request submitted! Our team will respond shortly.', 'success');
    setTimeout(() => {
      setTicketSubject('');
      setTicketMessage('');
      setTicketSent(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200/90 w-full max-w-xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-800 font-bold text-lg">
              ?
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Help & Support</h2>
              <p className="text-xs text-slate-500">Guides, FAQs, and assistance for Fireflies.ai</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-slate-100 bg-slate-50/60">
          <button
            type="button"
            onClick={() => setActiveTab('faq')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'faq'
                ? 'bg-white text-[#6C5CE7] shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Help Center & FAQs
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shortcuts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'shortcuts'
                ? 'bg-white text-[#6C5CE7] shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Keyboard Shortcuts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'contact'
                ? 'bg-white text-[#6C5CE7] shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Contact Support
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'faq' && (
            <>
              {/* Search Bar */}
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles and troubleshooting..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/20 focus:border-[#6C5CE7] transition-all"
                />
              </div>

              {/* Quick Resource Cards */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <a
                  href="/integrations"
                  onClick={onClose}
                  className="p-3 rounded-xl border border-slate-200/80 hover:border-[#6C5CE7]/50 hover:bg-[#fcfaff] transition-all group flex items-start gap-2.5 cursor-pointer"
                >
                  <BookOpen size={16} className="text-[#6C5CE7] mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-slate-800 group-hover:text-[#6C5CE7] flex items-center gap-1">
                      Integrations Hub
                      <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-[11px] text-slate-500">Connect Slack, Notion, Asana</p>
                  </div>
                </a>

                <a
                  href="/tasks"
                  onClick={onClose}
                  className="p-3 rounded-xl border border-slate-200/80 hover:border-[#6C5CE7]/50 hover:bg-[#fcfaff] transition-all group flex items-start gap-2.5 cursor-pointer"
                >
                  <Sparkles size={16} className="text-[#6C5CE7] mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-slate-800 group-hover:text-[#6C5CE7] flex items-center gap-1">
                      Action Items & Tasks
                      <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-[11px] text-slate-500">Manage meeting deliverables</p>
                  </div>
                </a>
              </div>

              {/* FAQs Accordion/List */}
              <div className="pt-2 space-y-2.5">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Frequently Asked Questions</h3>
                {filteredFaqs.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No articles found matching &quot;{searchQuery}&quot;</p>
                ) : (
                  filteredFaqs.map((faq, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                      <div className="text-xs font-semibold text-slate-800 flex items-start gap-2">
                        <FileQuestion size={14} className="text-[#6C5CE7] mt-0.5 flex-shrink-0" />
                        <span>{faq.q}</span>
                      </div>
                      <p className="text-xs text-slate-600 pl-5 leading-relaxed">{faq.a}</p>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === 'shortcuts' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-600 flex items-center gap-2 mb-2">
                <Keyboard size={15} className="text-[#6C5CE7]" />
                <span>Productivity shortcuts across Fireflies.ai:</span>
              </div>

              <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden bg-white">
                <div className="flex items-center justify-between p-3 text-xs">
                  <span className="text-slate-700">Play / Pause meeting audio</span>
                  <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-[11px] font-mono text-slate-600 font-semibold">Space</kbd>
                </div>
                <div className="flex items-center justify-between p-3 text-xs">
                  <span className="text-slate-700">Skip back 10 seconds</span>
                  <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-[11px] font-mono text-slate-600 font-semibold">← (Left Arrow)</kbd>
                </div>
                <div className="flex items-center justify-between p-3 text-xs">
                  <span className="text-slate-700">Skip forward 10 seconds</span>
                  <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-[11px] font-mono text-slate-600 font-semibold">→ (Right Arrow)</kbd>
                </div>
                <div className="flex items-center justify-between p-3 text-xs">
                  <span className="text-slate-700">Cycle playback speed (1x → 2x)</span>
                  <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-[11px] font-mono text-slate-600 font-semibold">S</kbd>
                </div>
                <div className="flex items-center justify-between p-3 text-xs">
                  <span className="text-slate-700">Close open dialog / modal</span>
                  <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-[11px] font-mono text-slate-600 font-semibold">Esc</kbd>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-4">
              {ticketSent ? (
                <div className="p-8 text-center space-y-2">
                  <CheckCircle2 size={36} className="text-emerald-500 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-900">Ticket Received</h4>
                  <p className="text-xs text-slate-500">We will respond to your registered email (alex.vance@company.com) within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSendTicket} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="e.g. Issue connecting Zoom calendar"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/20 focus:border-[#6C5CE7]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">How can we help?</label>
                    <textarea
                      required
                      rows={4}
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      placeholder="Describe what you are experiencing or what question you have..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/20 focus:border-[#6C5CE7] resize-none"
                    />
                  </div>
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Response time: &lt; 2 hrs</span>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#6C5CE7] hover:bg-[#5a4bd6] text-white text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">Fireflies.ai Assistant v2.4</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
