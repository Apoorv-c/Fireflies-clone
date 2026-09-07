'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSearch } from '@/hooks/useSearch';
import { Search as SearchIcon, Clock } from 'lucide-react';
import Link from 'next/link';

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const { data, isLoading } = useSearch(query);

  const highlightMatch = (text: string, q: string) => {
    if (!q.trim()) return text;
    const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-400/30 text-yellow-200 rounded px-0.5">$1</mark>');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Search Transcripts</h1>

      <div className="relative mb-6 max-w-2xl">
        <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b6b8a]" />
        <input
          type="text"
          placeholder="Search across all meeting transcripts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          suppressHydrationWarning
          className="w-full pl-12 pr-4 py-3 bg-[#16213e] border border-[#2a2a4a] rounded-xl text-[#e0e0e0] placeholder-[#6b6b8a] text-base focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/50 focus:border-[#6C5CE7] transition-all"
          autoFocus
        />
      </div>

      {isLoading && query.length >= 2 && (
        <p className="text-[#8b8ba3] text-sm">Searching...</p>
      )}

      {data && (
        <div>
          <p className="text-sm text-[#8b8ba3] mb-4">
            {data.total_count} result{data.total_count !== 1 ? 's' : ''} found
          </p>

          <div className="space-y-3 max-w-3xl">
            {data.results.map((result) => (
              <Link key={result.segment_id} href={`/meetings/${result.meeting_id}`}>
                <div className="bg-[#16213e] rounded-lg p-4 border border-[#2a2a4a] hover:bg-[#1a1a3e] transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-[#e0e0e0]">{result.meeting_title}</h3>
                    <span className="flex items-center gap-1 text-xs text-[#6C5CE7] font-mono">
                      <Clock size={12} />
                      {formatTimestamp(result.start_time)}
                    </span>
                  </div>
                  <p className="text-xs text-[#8b8ba3] mb-1">{result.speaker_label}</p>
                  <p
                    className="text-sm text-[#e0e0e0] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: highlightMatch(result.content, query) }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {query.length > 0 && query.length < 2 && (
        <p className="text-[#8b8ba3] text-sm">Type at least 2 characters to search</p>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="text-[#8b8ba3]">Loading...</p>}>
      <SearchContent />
    </Suspense>
  );
}
