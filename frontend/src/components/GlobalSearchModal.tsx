"use client";
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { MeetingListItem } from '@/lib/types';
import { Search, X, Calendar, Clock, ChevronRight, Mic } from 'lucide-react';
import { formatDate, formatTime } from '@/lib/utils';
import Link from 'next/link';

export default function GlobalSearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
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
    }, 250);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  // Keyboard shortcut ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-start justify-center p-4 sm:pt-20">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-150">
        {/* Search header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
          <Search className="w-5 h-5 text-primary-500 shrink-0" />
          <input
            type="text"
            placeholder="Search transcripts, summaries, topics across all meetings..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
            autoFocus
          />
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="text-center py-8 text-xs text-gray-400">
              Searching transcripts and notes...
            </div>
          ) : query.trim() && results.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-400">
              No meetings found matching "{query}".
            </div>
          ) : !query.trim() ? (
            <div className="text-center py-8 text-xs text-gray-400">
              Type keywords, participant names, or topics to search your entire meeting history.
            </div>
          ) : (
            results.map((m) => (
              <Link
                key={m.id}
                href={`/meetings/${m.id}`}
                onClick={onClose}
                className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200/70 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-950/20 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 truncate">
                      {m.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(m.date)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(m.duration)}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors shrink-0 ml-2" />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
