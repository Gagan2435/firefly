"use client";
import { TranscriptSegment } from '@/lib/types';
import { formatTime, getInitials } from '@/lib/utils';
import { api } from '@/lib/api';
import { Search, Bookmark, MessageSquare, ChevronUp, ChevronDown, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { SmartFilterType } from './SmartSearchPanel';

const SPEAKER_COLORS = [
  'bg-blue-600',
  'bg-emerald-600',
  'bg-violet-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-cyan-600',
];

function getSpeakerColor(speakerName: string) {
  let hash = 0;
  for (let i = 0; i < speakerName.length; i++) {
    hash = speakerName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return SPEAKER_COLORS[Math.abs(hash) % SPEAKER_COLORS.length];
}

export default function TranscriptView({
  transcript: initialTranscript,
  currentTime,
  onTimeClick,
  meetingId,
  smartFilter = 'all',
}: {
  transcript: TranscriptSegment[];
  currentTime: number;
  onTimeClick: (time: number) => void;
  meetingId: number;
  smartFilter?: SmartFilterType;
}) {
  const [segments, setSegments] = useState<TranscriptSegment[]>(initialTranscript);
  const [search, setSearch] = useState('');
  const [speakerFilter, setSpeakerFilter] = useState<string>('all');
  const [activeCommentSegmentId, setActiveCommentSegmentId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSegments(initialTranscript);
  }, [initialTranscript]);

  // Extract unique speaker names
  const uniqueSpeakers = Array.from(
    new Set(
      segments.map((s) => (s.speaker ? s.speaker.name : 'Unknown'))
    )
  );

  // Filter segments by speaker, search, and Smart Search AI filter
  const filteredSegments = segments.filter((seg) => {
    const speakerName = seg.speaker ? seg.speaker.name : 'Unknown';
    if (speakerFilter !== 'all' && speakerName !== speakerFilter) {
      return false;
    }

    const textLower = seg.text.toLowerCase();

    // Smart Filter evaluation
    if (smartFilter === 'action_items') {
      const isAction = /\b(will|need to|should|must|action|follow up|assign|deploy|pr|deliver|finalize|schedule)\b/i.test(textLower);
      if (!isAction) return false;
    } else if (smartFilter === 'questions') {
      const isQuestion = seg.text.includes('?') || /\b(what|why|how|when|where|who|could you|can you)\b/i.test(textLower);
      if (!isQuestion) return false;
    } else if (smartFilter === 'metrics') {
      const isMetric = /\b\d+(\.\d+)?\b|%|\$|arr|ms|seconds|minutes|runway/i.test(textLower);
      if (!isMetric) return false;
    } else if (smartFilter === 'dates') {
      const isDate = /\b(monday|tuesday|wednesday|thursday|friday|july|august|today|tomorrow|sprint|week|deadline)\b/i.test(textLower);
      if (!isDate) return false;
    } else if (smartFilter === 'sentiment_positive') {
      const isPos = /\b(great|awesome|fantastic|wonderful|magic|approved|compelling|excellent|improvement|aligned)\b/i.test(textLower);
      if (!isPos) return false;
    }

    return true;
  });

  // Calculate search matches
  const matchSegmentIds = search.trim()
    ? filteredSegments
        .filter((s) => s.text.toLowerCase().includes(search.toLowerCase()))
        .map((s) => s.id)
    : [];

  const handleNextMatch = () => {
    if (matchSegmentIds.length === 0) return;
    const next = (currentMatchIndex + 1) % matchSegmentIds.length;
    setCurrentMatchIndex(next);
    scrollToSegment(matchSegmentIds[next]);
  };

  const handlePrevMatch = () => {
    if (matchSegmentIds.length === 0) return;
    const prev = (currentMatchIndex - 1 + matchSegmentIds.length) % matchSegmentIds.length;
    setCurrentMatchIndex(prev);
    scrollToSegment(matchSegmentIds[prev]);
  };

  const scrollToSegment = (segId: number) => {
    const el = document.getElementById(`segment-${segId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Auto-scroll when active segment changes during playback
  useEffect(() => {
    const activeSeg = segments.find(
      (s) => currentTime >= s.start_time && currentTime <= (s.end_time || s.start_time + 5)
    );
    if (activeSeg && !search && smartFilter === 'all') {
      const el = document.getElementById(`segment-${activeSeg.id}`);
      if (el && containerRef.current) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentTime, segments, search, smartFilter]);

  const toggleBookmark = async (segId: number) => {
    try {
      const res = await api.toggleBookmarkSegment(segId);
      setSegments((prev) =>
        prev.map((s) => (s.id === segId ? { ...s, is_bookmarked: res.is_bookmarked } : s))
      );
      toast.success(res.is_bookmarked ? 'Soundbite clipped to notes' : 'Soundbite removed');
    } catch {
      toast.error('Failed to update soundbite');
    }
  };

  const handleAddComment = async (segId: number) => {
    if (!commentText.trim()) return;
    try {
      const created = await api.addComment(meetingId, {
        segment_id: segId,
        text: commentText,
        author: 'User',
      });
      setSegments((prev) =>
        prev.map((s) => {
          if (s.id === segId) {
            return {
              ...s,
              comments: [...(s.comments || []), created],
            };
          }
          return s;
        })
      );
      setCommentText('');
      setActiveCommentSegmentId(null);
      toast.success('Comment added to thread');
    } catch {
      toast.error('Failed to add comment');
    }
  };

  const highlightMatches = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-amber-300 dark:bg-amber-500/30 text-gray-900 dark:text-amber-200 px-0.5 rounded font-medium">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#15151D] rounded-2xl border border-[#22222E] shadow-sm overflow-hidden text-gray-100">
      {/* Top filter and search bar */}
      <div className="p-3 border-b border-[#22222E] bg-[#121218] flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search in transcript..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentMatchIndex(0);
            }}
            className="w-full pl-9 pr-20 py-1.5 text-xs bg-[#1A1A24] border border-[#2B2B3C] focus:border-purple-500 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all"
          />
          {search && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-gray-400">
              <span className="text-[11px] font-mono">
                {matchSegmentIds.length > 0 ? `${currentMatchIndex + 1}/${matchSegmentIds.length}` : '0/0'}
              </span>
              <button onClick={handlePrevMatch} className="p-0.5 hover:text-white">
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button onClick={handleNextMatch} className="p-0.5 hover:text-white">
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setSearch('')} className="p-0.5 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Speaker Filter Dropdown */}
        <div className="shrink-0 w-full sm:w-auto">
          <select
            value={speakerFilter}
            onChange={(e) => setSpeakerFilter(e.target.value)}
            className="w-full sm:w-auto text-xs px-3 py-1.5 bg-[#1A1A24] border border-[#2B2B3C] focus:border-purple-500 rounded-lg text-gray-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Speakers ({uniqueSpeakers.length})</option>
            {uniqueSpeakers.map((spk) => (
              <option key={spk} value={spk} className="bg-[#181822] text-white">
                {spk}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transcript segments scroll area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={containerRef}>
        {filteredSegments.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-xs">
            No transcript segments match your filter criteria.
          </div>
        ) : (
          filteredSegments.map((segment) => {
            const speakerName = segment.speaker ? segment.speaker.name : 'Unknown Speaker';
            const isActive =
              currentTime >= segment.start_time &&
              currentTime <= (segment.end_time || segment.start_time + 5);

            return (
              <div
                id={`segment-${segment.id}`}
                key={segment.id}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest('button') || target.closest('input')) return;
                  onTimeClick(segment.start_time);
                }}
                className={`cursor-pointer flex gap-3.5 p-3.5 rounded-2xl transition-all border group ${
                  isActive
                    ? 'bg-[#221B38] border-l-4 border-l-[#8165F5] border-[#3A2D5C] shadow-md ring-1 ring-purple-500/20'
                    : segment.is_bookmarked
                    ? 'bg-amber-950/20 border-l-4 border-l-amber-500 border-amber-800/40'
                    : 'bg-[#181822] border-[#22222E] hover:border-[#323244]'
                }`}
              >
                {/* Speaker Avatar & Timestamp */}
                <div className="shrink-0 flex flex-col items-center gap-1.5 pt-0.5">
                  <div
                    className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold shadow-xs ${getSpeakerColor(
                      speakerName
                    )}`}
                    title={speakerName}
                  >
                    {getInitials(speakerName)}
                  </div>
                  <button
                    onClick={() => onTimeClick(segment.start_time)}
                    className="text-[11px] font-mono font-medium text-purple-300 hover:text-white px-1 py-0.5 rounded bg-purple-950/60 border border-purple-800/40 transition-colors"
                    title={`Seek to ${formatTime(segment.start_time)}`}
                  >
                    {formatTime(segment.start_time)}
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                      {speakerName}
                    </span>

                    {/* Soundbite / Comment Action Buttons */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => toggleBookmark(segment.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          segment.is_bookmarked
                            ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50'
                            : 'text-gray-400 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        title={segment.is_bookmarked ? 'Remove Soundbite' : 'Clip Soundbite'}
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <button
                        onClick={() =>
                          setActiveCommentSegmentId(
                            activeCommentSegmentId === segment.id ? null : segment.id
                          )
                        }
                        className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="Add to Thread"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
                    {highlightMatches(segment.text, search)}
                  </p>

                  {/* Existing comments on segment */}
                  {segment.comments && segment.comments.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-gray-700/60 space-y-1.5">
                      {segment.comments.map((c) => (
                        <div
                          key={c.id}
                          className="text-xs bg-gray-50 dark:bg-gray-900/60 p-2.5 rounded-xl border border-gray-200/60 dark:border-gray-700/60 flex items-start justify-between gap-2"
                        >
                          <div>
                            <span className="font-semibold text-gray-800 dark:text-gray-200 mr-1.5">
                              {c.author}:
                            </span>
                            <span className="text-gray-600 dark:text-gray-300">{c.text}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Inline comment form */}
                  {activeCommentSegmentId === segment.id && (
                    <div className="mt-2 pt-2 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Add to comment thread..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddComment(segment.id);
                        }}
                        className="flex-1 text-xs px-2.5 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500"
                        autoFocus
                      />
                      <button
                        onClick={() => handleAddComment(segment.id)}
                        className="px-3 py-1.5 text-xs font-medium bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                      >
                        Post
                      </button>
                      <button
                        onClick={() => setActiveCommentSegmentId(null)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
