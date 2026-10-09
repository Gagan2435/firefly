"use client";
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { MeetingListItem } from '@/lib/types';
import { Search, X, Calendar, Clock, ChevronRight, Mic, Bot, Sparkles } from 'lucide-react';
import { formatDate, formatTime } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function GlobalSearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MeetingListItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      if (query.trim()) {
        setLoading(true);
        try {
          const res = await api.searchGlobal(query.trim());
          setResults(res);
        } catch {
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 sm:pt-16 select-none animate-fade-in text-gray-100">
      <div className="bg-[#181822] border border-[#2B2B3C] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-[#1B1B26]">
          <Search className="w-4 h-4 text-purple-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by title or keyword"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-xs sm:text-sm bg-transparent border-none outline-none text-white placeholder:text-gray-500"
            autoFocus
          />
          {query && (
            <button 
              onClick={() => setQuery('')} 
              className="p-1 text-gray-400 hover:text-white rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onClose} 
            className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ask Fred banner matching PDF page 2 */}
        <div className="p-3 bg-[#1C182B] border-b border-purple-900/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-6 h-6 rounded-md bg-purple-600/30 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0 text-xs">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs text-purple-200 font-medium truncate">
              Ask Fred anything about your meetings
            </span>
          </div>
          <button
            onClick={() => {
              onClose();
              router.push('/askfred');
            }}
            className="px-3 py-1 bg-[#5B45E0] hover:bg-[#6850EB] text-white text-xs font-semibold rounded-lg shadow-sm transition-all shrink-0"
          >
            Try AskFred
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="text-center py-10 text-xs text-gray-400 space-y-2">
              <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <div>Searching transcripts and notes...</div>
            </div>
          ) : query.trim() && results.length === 0 ? (
            <div className="text-center py-10 text-xs text-gray-400">
              No meetings found matching "{query}".
            </div>
          ) : !query.trim() ? (
            <div className="text-center py-8 text-xs text-gray-400">
              Search transcripts, titles, action items, or attendees across all meetings.
            </div>
          ) : (
            results.map((m) => (
              <Link
                key={m.id}
                href={`/meetings/${m.id}`}
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl border border-[#242434] bg-[#14141C] hover:border-purple-500/40 hover:bg-[#1E1B2D] transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-800/40 text-purple-400 flex items-center justify-center shrink-0">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-white group-hover:text-purple-300 transition-colors truncate">
                      {m.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                      <span>{formatDate(m.date)}</span>
                      <span>•</span>
                      <span>{formatTime(m.duration)}</span>
                      {m.action_items_count > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-purple-400 font-medium">{m.action_items_count} tasks</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
