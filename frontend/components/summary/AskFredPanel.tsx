'use client';

import { useState } from 'react';
import { Bot, Send, Sparkles, User } from 'lucide-react';
import { askMeeting } from '@/lib/api';

interface AskFredPanelProps {
  meetingId: number;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'fred';
  text: string;
  timestamp: string;
}

export default function AskFredPanel({ meetingId }: AskFredPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'fred',
      text: "Hi, I'm **Fred**, your AI meeting assistant! Ask me anything about this meeting — like key decisions, action items, or what specific attendees discussed.",
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = input.trim();
    if (!query || isThinking) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: query,
      timestamp: 'Now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      const res = await askMeeting(meetingId, query);
      const fredMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'fred',
        text: res.answer,
        timestamp: 'Now',
      };
      setMessages((prev) => [...prev, fredMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'fred',
        text: "I couldn't fetch an answer right now. Please verify your backend server is running and try again.",
        timestamp: 'Now',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const samplePrompts = [
    'What are the action items?',
    'Give me an executive summary',
    'What were the main blockers discussed?',
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden" suppressHydrationWarning>
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100 bg-slate-50/70">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7c3aed] to-[#a855f7] flex items-center justify-center text-white shadow-xs">
          <Bot size={18} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
            AskFred AI
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-[#7c3aed]">
              AI Copilot
            </span>
          </h3>
          <p className="text-xs text-slate-500">Ask any question about this meeting transcript</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-white">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                m.sender === 'user'
                  ? 'bg-slate-700 text-white'
                  : 'bg-[#7c3aed] text-white'
              }`}
            >
              {m.sender === 'user' ? <User size={13} /> : <Sparkles size={13} />}
            </div>

            <div
              className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#7c3aed] text-white rounded-tr-none shadow-xs'
                  : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none whitespace-pre-line shadow-2xs'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#7c3aed] text-white flex items-center justify-center flex-shrink-0">
              <Sparkles size={13} />
            </div>
            <div className="bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-2xl rounded-tl-none text-xs text-slate-500 flex items-center gap-2 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#7c3aed] animate-ping" />
              <span>Fred is reviewing the transcript...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center gap-1.5 overflow-x-auto">
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => {
              setInput(p);
            }}
            suppressHydrationWarning
            className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-purple-50 text-slate-600 hover:text-[#7c3aed] border border-slate-200 hover:border-purple-200 transition-colors shadow-2xs cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-3 bg-slate-50/70 border-t border-slate-100">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Ask Fred a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            suppressHydrationWarning
            className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/30 focus:border-[#7c3aed] transition-all shadow-xs"
          />
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            suppressHydrationWarning
            className="absolute right-1.5 w-7 h-7 rounded-lg bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
          >
            <Send size={13} />
          </button>
        </div>
      </form>
    </div>
  );
}
