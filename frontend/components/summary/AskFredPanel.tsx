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
    <div className="flex flex-col h-full bg-[#141829] rounded-xl border border-[#252a4a] overflow-hidden" suppressHydrationWarning>
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#252a4a] bg-[#121526]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6C5CE7] to-[#a29bfe] flex items-center justify-center text-white shadow-md">
          <Bot size={18} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
            AskFred AI
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#6C5CE7]/20 text-[#a29bfe]">
              AI Copilot
            </span>
          </h3>
          <p className="text-xs text-[#8b8ba3]">Ask any question about this meeting transcript</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                m.sender === 'user'
                  ? 'bg-[#2a2f52] text-white'
                  : 'bg-[#6C5CE7] text-white'
              }`}
            >
              {m.sender === 'user' ? <User size={14} /> : <Sparkles size={14} />}
            </div>

            <div
              className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#6C5CE7] text-white rounded-tr-none shadow-md'
                  : 'bg-[#1b2038] text-[#e0e0e0] border border-[#2c3258] rounded-tl-none whitespace-pre-line'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#6C5CE7] text-white flex items-center justify-center flex-shrink-0">
              <Sparkles size={14} />
            </div>
            <div className="bg-[#1b2038] border border-[#2c3258] px-3.5 py-2.5 rounded-2xl rounded-tl-none text-xs text-[#8b8ba3] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#6C5CE7] animate-ping" />
              <span>Fred is reviewing the transcript...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 border-t border-[#252a4a] bg-[#121526]/50 flex items-center gap-1.5 overflow-x-auto">
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => {
              setInput(p);
            }}
            suppressHydrationWarning
            className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-[#1f243d] hover:bg-[#2c3358] text-[#a29bfe] border border-[#333a65] transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-3 bg-[#121526] border-t border-[#252a4a]">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Ask Fred a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            suppressHydrationWarning
            className="w-full pl-3.5 pr-10 py-2.5 bg-[#1b2038] border border-[#2c3258] rounded-xl text-xs text-[#e0e0e0] placeholder-[#6b7294] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/50 focus:border-[#6C5CE7] transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            suppressHydrationWarning
            className="absolute right-1.5 w-7 h-7 rounded-lg bg-[#6C5CE7] hover:bg-[#5a4bd6] disabled:opacity-40 text-white flex items-center justify-center transition-all"
          >
            <Send size={13} />
          </button>
        </div>
      </form>
    </div>
  );
}
