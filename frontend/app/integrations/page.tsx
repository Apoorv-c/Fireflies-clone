'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  MessageSquare,
  X,
  Check,
  ExternalLink,
  ChevronDown,
  Sparkles,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface Integration {
  id: string;
  name: string;
  author: string;
  category: string;
  description: string;
  icon: string;
  connected?: boolean;
  setupGuideUrl?: string;
  isPopular?: boolean;
}

const INTEGRATIONS_DATA: Integration[] = [
  {
    id: 'activecampaign',
    name: 'ActiveCampaign',
    author: 'Fireflies',
    category: 'CRM',
    description: 'Sync Fireflies meeting notes to ActiveCampaign CRM and keep your contacts and companies automatically updated.',
    icon: 'activecampaign',
    isPopular: true
  },
  {
    id: 'activepieces',
    name: 'Activepieces',
    author: 'Activepieces',
    category: 'MCP',
    description: 'Activepieces offers a no-code integration with Fireflies.ai, enabling users to automate workflows involving meeting transcripts and actions.',
    icon: 'activepieces',
    isPopular: true
  },
  {
    id: 'aircall',
    name: 'Aircall',
    author: 'Fireflies',
    category: 'Audio recording',
    description: 'Automatically capture, transcribe, and generate meeting notes for calls made through Aircall.',
    icon: 'aircall',
    isPopular: true
  },
  {
    id: 'airtable',
    name: 'Airtable',
    author: 'Fireflies',
    category: 'Applicant tracking system',
    description: 'Automatically push meeting data and summaries to your Airtable bases',
    icon: 'airtable',
    isPopular: true
  },
  {
    id: 'amazons3',
    name: 'Amazon S3',
    author: 'Fireflies',
    category: 'Audio recording',
    description: 'Effortlessly sync your Fireflies meeting audio files and full markdown transcripts directly to your S3 bucket.',
    icon: 'amazons3'
  },
  {
    id: 'anydo',
    name: 'Any.do',
    author: 'Fireflies',
    category: 'Productivity',
    description: 'Effortlessly sync action items and tasks generated from Fireflies directly into your Any.do task lists.',
    icon: 'anydo'
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    author: 'Fireflies',
    category: 'CRM',
    description: 'Log call recordings, notes, and AI summaries under deals, contacts, and companies in HubSpot CRM.',
    icon: 'hubspot',
    connected: true,
    isPopular: true
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    author: 'Fireflies',
    category: 'CRM',
    description: 'Log call recordings, transcripts, and custom AI data fields directly into Salesforce opportunities.',
    icon: 'salesforce'
  },
  {
    id: 'slack',
    name: 'Slack',
    author: 'Fireflies',
    category: 'Collaboration',
    description: 'Push meeting recaps, audio soundbites, and action items directly to selected Slack channels.',
    icon: 'slack',
    connected: true,
    isPopular: true
  },
  {
    id: 'notion',
    name: 'Notion',
    author: 'Fireflies',
    category: 'Productivity',
    description: 'Automatically sync meeting notes, transcripts, and action items into your Notion databases.',
    icon: 'notion',
    isPopular: true
  },
  {
    id: 'greenhouse',
    name: 'Greenhouse',
    author: 'Fireflies',
    category: 'Applicant tracking system',
    description: 'Automatically log interview notes and scorecard summaries to candidate profiles in Greenhouse ATS.',
    icon: 'greenhouse'
  },
  {
    id: 'lever',
    name: 'Lever',
    author: 'Fireflies',
    category: 'Applicant tracking system',
    description: 'Sync candidate interviews and AI-extracted interview feedback directly into Lever ATS.',
    icon: 'lever'
  },
  {
    id: 'zoom',
    name: 'Zoom',
    author: 'Fireflies',
    category: 'Audio recording',
    description: 'Automatically import cloud recordings from Zoom and transcribe them with speaker identification.',
    icon: 'zoom',
    connected: true,
    isPopular: true
  },
  {
    id: 'mcp',
    name: 'Model Context Protocol (MCP)',
    author: 'Fireflies',
    category: 'MCP',
    description: 'Expose Fireflies transcripts and meeting intelligence as an MCP server for Claude Desktop, Cursor, and AI agents.',
    icon: 'mcp',
    isPopular: true
  },
  {
    id: 'googledrive',
    name: 'Google Drive',
    author: 'Fireflies',
    category: 'Cloud storage',
    description: 'Save meeting audio files and full markdown transcripts automatically to Google Drive folders.',
    icon: 'googledrive'
  },
  {
    id: 'asana',
    name: 'Asana',
    author: 'Fireflies',
    category: 'Project management',
    description: 'Automatically turn meeting action items into Asana tasks with assignees, due dates, and project tags.',
    icon: 'asana'
  }
];

const MAIN_CATEGORIES = [
  'All',
  'Audio recording',
  'Applicant tracking system',
  'CRM',
  'MCP'
];

const MORE_CATEGORIES = [
  'Productivity',
  'Cloud storage',
  'Project management',
  'Collaboration'
];

// App Logos matching brand visual identities
function AppIcon({ id, className = "w-9 h-9" }: { id: string; className?: string }) {
  switch (id) {
    case 'activecampaign':
      return (
        <div className={`${className} rounded-lg bg-blue-50 flex items-center justify-center text-[#004CFF]`}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M7 4L16 12L7 20L10 12L7 4Z" />
          </svg>
        </div>
      );
    case 'activepieces':
      return (
        <div className={`${className} rounded-lg bg-purple-50 flex items-center justify-center text-[#6833FF]`}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M12 2C9.5 2 7.5 4 7.5 6.5C7.5 7.5 7.8 8.4 8.4 9.2L4.5 13.1C3.7 13.9 3.7 15.1 4.5 15.9L8.1 19.5C8.9 20.3 10.1 20.3 10.9 19.5L14.8 15.6C15.6 16.2 16.5 16.5 17.5 16.5C20 16.5 22 14.5 22 12C22 9.5 20 7.5 17.5 7.5C16.5 7.5 15.6 7.8 14.8 8.4L10.9 4.5C11.7 3.7 12 2.8 12 2Z" />
          </svg>
        </div>
      );
    case 'aircall':
      return (
        <div className={`${className} rounded-lg bg-emerald-50 flex items-center justify-center text-[#00B388]`}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C15.87 5 19 8.13 19 12C19 13.93 18.22 15.68 16.95 16.95L15.54 15.54C16.44 14.64 17 13.38 17 12C17 9.24 14.76 7 12 7C9.24 7 7 9.24 7 12C7 13.38 7.56 14.64 8.46 15.54L7.05 16.95C5.78 15.68 5 13.93 5 12C5 8.13 8.13 5 12 5Z" />
          </svg>
        </div>
      );
    case 'airtable':
      return (
        <div className={`${className} rounded-lg bg-amber-50 flex items-center justify-center`}>
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M11.5 2.5L2 6.5L11.5 10.5L21 6.5L11.5 2.5Z" fill="#FCB400" />
            <path d="M13 11.5L21 8V16L13 20V11.5Z" fill="#18BFFF" />
            <path d="M11 11.5V20L2.5 16.5V8.5L11 11.5Z" fill="#ED3152" />
          </svg>
        </div>
      );
    case 'amazons3':
      return (
        <div className={`${className} rounded-lg bg-red-50 flex items-center justify-center text-[#E05243]`}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M12 2L4 6V18L12 22L20 18V6L12 2ZM12 4.3L17.5 7L12 9.7L6.5 7L12 4.3ZM6 8.5L11 11V19L6 16.5V8.5ZM13 19V11L18 8.5V16.5L13 19Z" />
          </svg>
        </div>
      );
    case 'anydo':
      return (
        <div className={`${className} rounded-lg bg-blue-500 flex items-center justify-center text-white`}>
          <Check size={18} strokeWidth={3} />
        </div>
      );
    case 'hubspot':
      return (
        <div className={`${className} rounded-lg bg-orange-50 flex items-center justify-center text-[#FF7A59]`}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M17.5 8.5V5.5H15.5C14.7 5.5 14 6.2 14 7C14 7.4 14.2 7.8 14.4 8.1L10.8 11.2C10.4 11.1 10 11 9.5 11C7.6 11 6 12.6 6 14.5C6 16.4 7.6 18 9.5 18C11.4 18 13 16.4 13 14.5C13 14 12.8 13.5 12.5 13.1L15.9 9.8C16.3 9.9 16.6 10 17 10C17.8 10 18.5 9.3 18.5 8.5Z" />
          </svg>
        </div>
      );
    case 'salesforce':
      return (
        <div className={`${className} rounded-lg bg-sky-50 flex items-center justify-center text-[#00A1E0]`}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M19.5 10C19 8.2 17.5 7 15.5 7C15.2 7 14.9 7 14.6 7.1C13.8 5.2 11.9 4 9.8 4C7.1 4 4.8 5.9 4.3 8.6C2.4 9.3 1 11.2 1 13.5C1 16.5 3.5 19 6.5 19H19C21.2 19 23 17.2 23 15C23 12.4 21.4 10.4 19.5 10Z" />
          </svg>
        </div>
      );
    case 'slack':
      return (
        <div className={`${className} rounded-lg bg-purple-50 flex items-center justify-center`}>
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M5.5 10C6.3 10 7 9.3 7 8.5V5.5C7 4.7 6.3 4 5.5 4S4 4.7 4 5.5V8.5C4 9.3 4.7 10 5.5 10Z" fill="#E01E5A" />
            <path d="M8.5 10H11.5C12.3 10 13 9.3 13 8.5S12.3 7 11.5 7H8.5C7.7 7 7 7.7 7 8.5S7.7 10 8.5 10Z" fill="#E01E5A" />
            <path d="M14 5.5C14 4.7 14.7 4 15.5 4S17 4.7 17 5.5V8.5C17 9.3 16.3 10 15.5 10S14 9.3 14 8.5V5.5Z" fill="#36C5F0" />
            <path d="M14 11.5V8.5C14 7.7 14.7 7 15.5 7S17 7.7 17 8.5V11.5C17 12.3 16.3 13 15.5 13S14 12.3 14 11.5Z" fill="#36C5F0" />
            <path d="M18.5 14C17.7 14 17 14.7 17 15.5V18.5C17 19.3 17.7 20 18.5 20S20 19.3 20 18.5V15.5C20 14.7 19.3 14 18.5 14Z" fill="#2EB67D" />
            <path d="M15.5 14H12.5C11.7 14 11 14.7 11 15.5S11.7 17 12.5 17H15.5C16.3 17 17 16.3 17 15.5S16.3 14 15.5 14Z" fill="#2EB67D" />
            <path d="M10 18.5C10 19.3 9.3 20 8.5 20S7 19.3 7 18.5V15.5C7 14.7 7.7 14 8.5 14S10 14.7 10 15.5V18.5Z" fill="#ECB22E" />
            <path d="M10 12.5V15.5C10 16.3 9.3 17 8.5 17S7 16.3 7 15.5V12.5C7 11.7 7.7 11 8.5 11S10 11.7 10 12.5Z" fill="#ECB22E" />
          </svg>
        </div>
      );
    case 'notion':
      return (
        <div className={`${className} rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 font-bold font-serif`}>
          N
        </div>
      );
    case 'greenhouse':
      return (
        <div className={`${className} rounded-lg bg-emerald-50 flex items-center justify-center text-[#207868]`}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M17 3C11.5 3 7 7.5 7 13C7 14.4 7.3 15.7 7.8 16.9L4 20.7L5.3 22L9.1 18.2C10.3 18.7 11.6 19 13 19C18.5 19 23 14.5 23 9C23 5.7 17 3 17 3Z" />
          </svg>
        </div>
      );
    case 'lever':
      return (
        <div className={`${className} rounded-lg bg-indigo-50 flex items-center justify-center text-[#103657] font-bold`}>
          L
        </div>
      );
    case 'zoom':
      return (
        <div className={`${className} rounded-lg bg-blue-500 flex items-center justify-center text-white`}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M4.5 7C3.7 7 3 7.7 3 8.5V15.5C3 16.3 3.7 17 4.5 17H13.5C14.3 17 15 16.3 15 15.5V8.5C15 7.7 14.3 7 13.5 7H4.5ZM16.5 9.8L20.2 7.3C20.7 7 21.5 7.3 21.5 8V16C21.5 16.7 20.7 17 20.2 16.7L16.5 14.2V9.8Z" />
          </svg>
        </div>
      );
    case 'mcp':
      return (
        <div className={`${className} rounded-lg bg-amber-50 flex items-center justify-center text-amber-600`}>
          <Sparkles size={18} />
        </div>
      );
    case 'googledrive':
      return (
        <div className={`${className} rounded-lg bg-emerald-50 flex items-center justify-center`}>
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M8.5 3.5L15.5 3.5L21.5 14L14.5 14L8.5 3.5Z" fill="#FFC107" />
            <path d="M2.5 14L8.5 3.5L14.5 14L8.5 20.5L2.5 14Z" fill="#0066DA" />
            <path d="M14.5 14L21.5 14L15.5 20.5L8.5 20.5L14.5 14Z" fill="#00AC47" />
          </svg>
        </div>
      );
    case 'asana':
      return (
        <div className={`${className} rounded-lg bg-rose-50 flex items-center justify-center`}>
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-2 h-2 rounded-full bg-[#F06A6A]" />
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-[#F06A6A]" />
              <div className="w-2 h-2 rounded-full bg-[#F06A6A]" />
            </div>
          </div>
        </div>
      );
    default:
      return (
        <div className={`${className} rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm`}>
          {id.slice(0, 1).toUpperCase()}
        </div>
      );
  }
}

export default function IntegrationsPage() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS_DATA);

  // Modals state
  const [activeIntegration, setActiveIntegration] = useState<Integration | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');

  const searchInputRef = useRef<HTMLInputElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut Ctrl+K / Cmd+K to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered integrations list
  const filteredIntegrations = useMemo(() => {
    return integrations.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [integrations, searchQuery, selectedCategory]);

  const toggleConnection = (id: string) => {
    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.connected;
          showToast(
            nextState ? `Connected to ${item.name} successfully!` : `Disconnected from ${item.name}`,
            nextState ? 'success' : 'info'
          );
          return { ...item, connected: nextState };
        }
        return item;
      })
    );
    if (activeIntegration && activeIntegration.id === id) {
      setActiveIntegration((prev) => (prev ? { ...prev, connected: !prev.connected } : null));
    }
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    showToast('Thank you for your feedback on Integrations!', 'success');
    setFeedbackText('');
    setFeedbackEmail('');
    setIsFeedbackOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto py-4 px-2 sm:px-4 space-y-6" suppressHydrationWarning>
      {/* Top Search Bar with Ctrl+K shortcut */}
      <div className="max-w-xl mx-auto">
        <div className="relative flex items-center">
          <Search size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or keyword"
            className="w-full pl-10 pr-20 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/20 focus:border-[#6C5CE7] transition-all shadow-xs"
          />
          <div className="absolute right-3 flex items-center">
            <kbd className="px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded-md select-none">
              Ctrl + K
            </kbd>
          </div>
        </div>
      </div>

      {/* Category Pills & More dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 flex-wrap">
          {MAIN_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'border border-[#6C5CE7] text-[#6C5CE7] bg-white font-semibold shadow-xs'
                    : 'border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            );
          })}

          {/* More Category Dropdown */}
          <div className="relative" ref={moreDropdownRef}>
            <button
              type="button"
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                MORE_CATEGORIES.includes(selectedCategory)
                  ? 'border-[#6C5CE7] text-[#6C5CE7] bg-white font-semibold'
                  : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <span>{MORE_CATEGORIES.includes(selectedCategory) ? selectedCategory : 'More'}</span>
              <ChevronDown size={13} className={`transition-transform duration-150 ${isMoreOpen ? 'rotate-180' : ''}`} />
            </button>

            {isMoreOpen && (
              <div className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-30 animate-in fade-in zoom-in-95">
                {MORE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsMoreOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#f4f0fd] text-[#6C5CE7] font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <Check size={13} className="text-[#6C5CE7]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Share Feedback Link */}
        <button
          type="button"
          onClick={() => setIsFeedbackOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <MessageSquare size={13} className="text-slate-400" />
          <span>Share Feedback</span>
        </button>
      </div>

      {/* Integrations Grid (2-columns matching media_1788809662517.png) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIntegrations.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveIntegration(item)}
            className="group relative bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-5 hover:shadow-sm transition-all duration-150 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Top Row: Icon + Connected Status Badge */}
              <div className="flex items-start justify-between">
                <AppIcon id={item.icon} className="w-10 h-10" />
                {item.connected && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-semibold border border-emerald-200/60">
                    <Check size={11} strokeWidth={2.5} />
                    Connected
                  </span>
                )}
              </div>

              {/* Title & Author */}
              <h3 className="text-sm font-semibold text-slate-900 mt-3.5 group-hover:text-[#6C5CE7] transition-colors">
                {item.name}
              </h3>
              <p className="text-xs text-slate-400 font-medium mb-2.5">{item.author}</p>

              {/* Description */}
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredIntegrations.length === 0 && (
        <div className="text-center py-16 bg-white border border-slate-200/80 rounded-2xl">
          <SlidersHorizontal size={28} className="mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-800">No integrations match your search</p>
          <p className="text-xs text-slate-400 mt-1 mb-4">Try clearing filters or search for another keyword</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Interactive Integration Connection Modal */}
      {activeIntegration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-6 shadow-xl relative animate-in zoom-in-95">
            <button
              type="button"
              onClick={() => setActiveIntegration(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <AppIcon id={activeIntegration.icon} className="w-12 h-12" />
              <div>
                <h3 className="text-base font-bold text-slate-900">{activeIntegration.name}</h3>
                <p className="text-xs text-slate-400">By {activeIntegration.author} • {activeIntegration.category}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              {activeIntegration.description}
            </p>

            {/* Feature Checkpoints */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 mb-5 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>Automatic transcript synchronization</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>AI-generated meeting summaries & action items</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>End-to-end encrypted integration tokens</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveIntegration(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => toggleConnection(activeIntegration.id)}
                className={`px-5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                  activeIntegration.connected
                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200'
                    : 'bg-[#6C5CE7] hover:bg-[#5a4bd6] text-white'
                }`}
              >
                {activeIntegration.connected ? 'Disconnect Integration' : 'Connect Integration'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Feedback Modal */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-6 shadow-xl relative animate-in zoom-in-95">
            <button
              type="button"
              onClick={() => setIsFeedbackOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={18} className="text-[#6C5CE7]" />
              <h3 className="text-base font-bold text-slate-900">Share Feedback on Integrations</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Missing an integration or have suggestions for new tools? Let our team know.
            </p>

            <form onSubmit={handleSendFeedback} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700">Which integration or feature would you like to see?</label>
                <textarea
                  required
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="e.g., Jira bidirectional sync, Linear ticket creation, ClickUp..."
                  className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/20 focus:border-[#6C5CE7]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Email (Optional)</label>
                <input
                  type="email"
                  value={feedbackEmail}
                  onChange={(e) => setFeedbackEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/20 focus:border-[#6C5CE7]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFeedbackOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#6C5CE7] hover:bg-[#5a4bd6] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
