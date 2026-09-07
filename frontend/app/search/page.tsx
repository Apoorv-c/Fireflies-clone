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
    return text.replace(regex, '<mark class="bg-purple-100 text-purple-900 font-medium rounded px-0.5">$1</mark>');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Search Transcripts</h1>

      <div className="relative mb-6 max-w-2xl">
        <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search across all meeting transcripts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          suppressHydrationWarning
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all shadow-xs"
          autoFocus
        />
      </div>

      {isLoading && query.length >= 2 && (
        <p className="text-slate-400 text-sm">Searching...</p>
      )}

      {data && (
        <div>
          <p className="text-sm text-slate-500 mb-4">
            {data.total_count} result{data.total_count !== 1 ? 's' : ''} found
          </p>

          <div className="space-y-3 max-w-3xl">
            {data.results.map((result) => (
              <Link key={result.segment_id} href={`/meetings/${result.meeting_id}`}>
                <div className="bg-white rounded-xl p-4 border border-slate-200 hover:border-purple-300 hover:shadow-xs transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-slate-900">{result.meeting_title}</h3>
                    <span className="flex items-center gap-1 text-xs text-[#7c3aed] font-mono">
                      <Clock size={12} />
                      {formatTimestamp(result.start_time)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-1 font-medium">{result.speaker_label}</p>
                  <p
                    className="text-sm text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: highlightMatch(result.content, query) }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {query.length > 0 && query.length < 2 && (
        <p className="text-slate-400 text-sm">Type at least 2 characters to search</p>
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
