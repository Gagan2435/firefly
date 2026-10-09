"use client";
import { useEffect, useState, useCallback, useMemo } from 'react';
import { api } from '@/lib/api';
import { MeetingDetail } from '@/lib/types';
import { formatDate, formatTime } from '@/lib/utils';
import MediaPlayer from '@/components/MediaPlayer';
import TranscriptView from '@/components/TranscriptView';
import SummaryPanel from '@/components/SummaryPanel';
import AskFredPanel from '@/components/AskFredPanel';
import SmartSearchPanel, { SmartFilterType } from '@/components/SmartSearchPanel';
import TagBadge from '@/components/TagBadge';
import ExportModal from '@/components/ExportModal';
import EditMeetingModal from '@/components/EditMeetingModal';
import { 
  ArrowLeft, 
  Sparkles, 
  Download, 
  Edit3, 
  Trash2, 
  Calendar, 
  Clock, 
  Share2,
  Check,
  FileText,
  Volume2,
  Bookmark
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function MeetingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTab, setActiveTab] = useState<'thread' | 'media' | 'soundbites'>('thread');
  const [smartFilter, setSmartFilter] = useState<SmartFilterType>('all');
  const [smartSearchCollapsed, setSmartSearchCollapsed] = useState(false);
  const [showFred, setShowFred] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchMeeting = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getMeeting(params.id);
      setMeeting(data);
    } catch {
      toast.error('Failed to load meeting details');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchMeeting();
  }, [fetchMeeting]);

  const handleDelete = async () => {
    if (!meeting || !confirm('Are you sure you want to delete this meeting?')) return;
    try {
      await api.deleteMeeting(meeting.id);
      toast.success('Meeting deleted');
      router.push('/');
    } catch {
      toast.error('Failed to delete meeting');
    }
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    toast.success('Meeting link copied to clipboard');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Calculate Smart Filter occurrence counts across transcript segments
  const filterCounts = useMemo(() => {
    if (!meeting?.transcript_segments) {
      return { action_items: 0, questions: 0, metrics: 0, dates: 0, sentiment_positive: 0 };
    }
    const segs = meeting.transcript_segments;
    return {
      action_items: segs.filter((s) => /\b(will|need to|should|must|action|follow up|assign|deploy|pr|deliver|finalize|schedule)\b/i.test(s.text)).length,
      questions: segs.filter((s) => s.text.includes('?') || /\b(what|why|how|when|where|who|could you|can you)\b/i.test(s.text)).length,
      metrics: segs.filter((s) => /\b\d+(\.\d+)?\b|%|\$|arr|ms|seconds|minutes|runway/i.test(s.text)).length,
      dates: segs.filter((s) => /\b(monday|tuesday|wednesday|thursday|friday|july|august|today|tomorrow|sprint|week|deadline)\b/i.test(s.text)).length,
      sentiment_positive: segs.filter((s) => /\b(great|awesome|fantastic|wonderful|magic|approved|compelling|excellent|improvement|aligned)\b/i.test(s.text)).length,
    };
  }, [meeting]);

  const soundbitesList = useMemo(() => {
    return meeting?.transcript_segments?.filter((s) => s.is_bookmarked) || [];
  }, [meeting]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-xs text-gray-500">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading Fireflies Notepad workspace...</span>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-3">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Meeting Not Found</h2>
        <p className="text-xs text-gray-500">The meeting you are looking for may have been deleted.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-semibold hover:bg-primary-700"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Notebook
        </Link>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#0E0E12] text-gray-100 select-none">
      {/* Top Notepad Header */}
      <header className="bg-[#111115] border-b border-[#1E1E24] px-5 py-3 flex items-center justify-between shrink-0 shadow-xs z-10">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/meetings"
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
            title="Back to Meetings"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-gray-400">Notebook /</span>
              <h1 className="text-sm font-heading font-bold text-white truncate max-w-sm sm:max-w-md">
                {meeting.title}
              </h1>
              <button 
                onClick={() => setEditOpen(true)} 
                className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors"
                title="Edit title & participants"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                meeting.id % 3 === 0
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                  : meeting.id % 3 === 1
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                  : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
              }`}>
                {meeting.id % 3 === 0 ? 'Zoom' : meeting.id % 3 === 1 ? 'Google Meet' : 'MS Teams'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-gray-400" />
                {formatDate(meeting.date)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-400" />
                {formatTime(meeting.duration)}
              </span>
              {meeting.participants && meeting.participants.length > 0 && (
                <div className="flex -space-x-1.5 overflow-hidden ml-1">
                  {meeting.participants.map((p, i) => (
                    <div 
                      key={p.id || i} 
                      className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 border border-white dark:border-gray-800 flex items-center justify-center text-[9px] font-bold"
                      title={p.name}
                    >
                      {p.name.charAt(0)}
                    </div>
                  ))}
                </div>
              )}
              {meeting.tags && meeting.tags.length > 0 && (
                <div className="flex items-center gap-1 ml-1">
                  {meeting.tags.map((t) => (
                    <TagBadge key={t.id} tag={t} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center Mode Tabs: Thread, Media, Soundbites */}
        <div className="hidden md:flex p-1 bg-[#161620] rounded-xl border border-[#22222E] text-xs">
          <button
            onClick={() => setActiveTab('thread')}
            className={`px-3 py-1 font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'thread'
                ? 'bg-[#252535] text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Thread
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`px-3 py-1 font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'media'
                ? 'bg-[#252535] text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            Media Player
          </button>
          <button
            onClick={() => setActiveTab('soundbites')}
            className={`px-3 py-1 font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'soundbites'
                ? 'bg-[#252535] text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            Soundbites ({soundbitesList.length})
          </button>
        </div>

        {/* Action button row */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowFred(!showFred)}
            className="inline-flex items-center gap-1.5 bg-[#5B45E0] hover:bg-[#6850EB] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-md shadow-purple-900/25 transition-all active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Fred</span>
          </button>

          <button
            onClick={() => setExportOpen(true)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
            title="Export transcript / summary"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleShareLink}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
            title="Share meeting link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setEditOpen(true)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
            title="Edit metadata"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            onClick={handleDelete}
            className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
            title="Delete meeting"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Notepad Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Collapsible Smart Search & AI Filters Panel */}
        <SmartSearchPanel
          activeFilter={smartFilter}
          onSelectFilter={setSmartFilter}
          isCollapsed={smartSearchCollapsed}
          onToggleCollapse={() => setSmartSearchCollapsed(!smartSearchCollapsed)}
          counts={filterCounts}
        />

        {/* Center & Right Split Area */}
        <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
          {/* Transcript & Media Area */}
          <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
            <MediaPlayer
              duration={meeting.duration}
              currentTime={currentTime}
              onTimeUpdate={setCurrentTime}
            />

            {activeTab === 'soundbites' ? (
              <div className="flex-1 bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-200 dark:border-gray-700/80 p-5 overflow-y-auto space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-amber-500" />
                    Saved Soundbites & Quotes ({soundbitesList.length})
                  </h3>
                  <span className="text-[11px] text-gray-400">Click any clip to seek audio</span>
                </div>

                {soundbitesList.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-xs">
                    No soundbites saved yet. Switch to Thread and click the bookmark icon on any transcript line to clip it!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {soundbitesList.map((seg) => (
                      <div
                        key={seg.id}
                        onClick={() => setCurrentTime(seg.start_time)}
                        className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 rounded-2xl hover:shadow-md cursor-pointer transition-all space-y-2 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                            {seg.speaker ? seg.speaker.name : 'Speaker'}
                          </span>
                          <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-900/60 px-2 py-0.5 rounded-md">
                            {formatTime(seg.start_time)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300 italic leading-relaxed">
                          "{seg.text}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 min-h-0 overflow-hidden">
                <TranscriptView
                  transcript={meeting.transcript_segments || []}
                  currentTime={currentTime}
                  onTimeClick={setCurrentTime}
                  meetingId={meeting.id}
                  smartFilter={smartFilter}
                />
              </div>
            )}
          </div>

          {/* Right Panel: AI Summary & Thread Notes */}
          <div className="w-full lg:w-96 xl:w-[420px] h-full flex flex-col shrink-0 min-w-0 overflow-hidden">
            <SummaryPanel
              meeting={meeting}
              onSeek={(t) => setCurrentTime(t)}
            />
          </div>
        </div>
      </div>

      {/* Floating Ask Fred Copilot */}
      {showFred && (
        <AskFredPanel
          meetingId={meeting.id}
          meetingTitle={meeting.title}
          onClose={() => setShowFred(false)}
        />
      )}

      {/* Export Modal */}
      <ExportModal
        meetingId={meeting.id}
        meetingTitle={meeting.title}
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
      />

      {/* Edit Modal */}
      <EditMeetingModal
        meeting={meeting}
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSuccess={fetchMeeting}
      />
    </div>
  );
}
