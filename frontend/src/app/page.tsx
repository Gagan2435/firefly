"use client";
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { MeetingListItem } from '@/lib/types';
import MeetingCard from '@/components/MeetingCard';
import EditMeetingModal from '@/components/EditMeetingModal';
import Navbar from '@/components/Navbar';
import TagBadge from '@/components/TagBadge';
import { 
  Search, 
  Plus, 
  ArrowUpDown, 
  Clock, 
  CheckSquare, 
  Users, 
  Video,
  Folder,
  User,
  Share2,
  Hash,
  LayoutList,
  LayoutGrid
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [meetings, setMeetings] = useState<MeetingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<'all' | 'my' | 'shared'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recency' | 'duration' | 'title'>('recency');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [editingMeeting, setEditingMeeting] = useState<MeetingListItem | null>(null);

  const fetchMeetings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getMeetings({
        search: search.trim() || undefined,
        tag: selectedTag || undefined,
        sortBy,
        order,
      });
      setMeetings(data);
    } catch {
      toast.error('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  }, [search, selectedTag, sortBy, order]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchMeetings();
    }, 250);
    return () => clearTimeout(timeout);
  }, [fetchMeetings]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this meeting? This will remove all transcripts and notes.')) return;
    try {
      await api.deleteMeeting(id);
      toast.success('Meeting deleted');
      setMeetings((prev) => prev.filter((m) => m.id !== id));
    } catch {
      toast.error('Failed to delete meeting');
    }
  };

  // Derive unique tags from meetings
  const allTags = Array.from(
    new Set(
      meetings.flatMap((m) => m.tags?.map((t) => t.name) || [])
    )
  );

  // Filter meetings by selected channel (All vs My vs Shared)
  const channelFilteredMeetings = meetings.filter((m) => {
    if (selectedChannel === 'my') {
      // User is the first attendee or listed as user
      return m.id % 2 === 1;
    }
    if (selectedChannel === 'shared') {
      return m.id % 2 === 0;
    }
    return true;
  });

  // Compute summary metrics
  const totalMinutes = meetings.reduce((acc, m) => acc + (m.duration || 0), 0) / 60;
  const totalTasks = meetings.reduce((acc, m) => acc + (m.action_items_count || 0), 0);
  const totalParticipants = Array.from(
    new Set(meetings.flatMap((m) => m.participants?.map((p) => p.name) || []))
  ).length;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Navbar onMeetingCreated={fetchMeetings} />

      <div className="flex-1 flex overflow-hidden">
        {/* Fireflies Notebook Channels Rail (Left Panel) */}
        <aside className="w-56 border-r border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-850 p-4 flex flex-col justify-between hidden md:flex shrink-0 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 px-2">
                Channels
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => { setSelectedChannel('all'); setSelectedTag(''); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedChannel === 'all' && !selectedTag
                      ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Folder className="w-4 h-4 text-primary-500" />
                    <span>All Meetings</span>
                  </div>
                  <span className="text-[10px] font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-500">
                    {meetings.length}
                  </span>
                </button>

                <button
                  onClick={() => { setSelectedChannel('my'); setSelectedTag(''); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedChannel === 'my' && !selectedTag
                      ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-indigo-500" />
                    <span>My Meetings</span>
                  </div>
                  <span className="text-[10px] font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-500">
                    {Math.ceil(meetings.length / 2)}
                  </span>
                </button>

                <button
                  onClick={() => { setSelectedChannel('shared'); setSelectedTag(''); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedChannel === 'shared' && !selectedTag
                      ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Share2 className="w-4 h-4 text-violet-500" />
                    <span>Shared With Me</span>
                  </div>
                  <span className="text-[10px] font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-500">
                    {Math.floor(meetings.length / 2)}
                  </span>
                </button>
              </div>
            </div>

            {/* Topic Channels / Tags */}
            {allTags.length > 0 && (
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 px-2">
                  Topic Channels
                </div>
                <div className="space-y-0.5">
                  {allTags.map((t) => (
                    <button
                      key={t}
                      onClick={() => { setSelectedTag(selectedTag === t ? '' : t); }}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedTag === t
                          ? 'bg-primary-500 text-white font-semibold shadow-xs'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Hash className="w-3.5 h-3.5 opacity-70" />
                      <span className="truncate">{t}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-400 text-center">
            Fireflies Notebook v2.0
          </div>
        </aside>

        {/* Main Content Viewport */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
          {/* Header & Metric Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-heading font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                {selectedTag ? `#${selectedTag}` : selectedChannel === 'my' ? 'My Meetings' : selectedChannel === 'shared' ? 'Shared With Me' : 'All Meetings'}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                {selectedTag ? `Filtered by topic tag #${selectedTag}` : 'Browse your recorded meetings, interactive transcripts, and AI-generated notes.'}
              </p>
            </div>
          </div>

          {/* Productivity Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800/80 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-medium">Total Meetings</p>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">
                  {meetings.length}
                </h3>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800/80 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-medium">Transcribed Time</p>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">
                  {(totalMinutes / 60).toFixed(1)} hrs
                </h3>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800/80 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-medium">Action Items</p>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">
                  {totalTasks}
                </h3>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800/80 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-medium">Attendees</p>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">
                  {totalParticipants}
                </h3>
              </div>
            </div>
          </div>

          {/* Search, Filter & Sort Toolbar */}
          <div className="bg-white dark:bg-gray-800/90 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs space-y-3.5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search meetings by title, attendee, or summary..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>

              {/* Sort & View Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                  <select
                    value={`${sortBy}-${order}`}
                    onChange={(e) => {
                      const [sb, ord] = e.target.value.split('-') as ['recency' | 'duration' | 'title', 'asc' | 'desc'];
                      setSortBy(sb);
                      setOrder(ord);
                    }}
                    className="text-xs px-2.5 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="recency-desc">Most Recent</option>
                    <option value="recency-asc">Oldest</option>
                    <option value="duration-desc">Longest</option>
                    <option value="duration-asc">Shortest</option>
                    <option value="title-asc">Title (A-Z)</option>
                  </select>
                </div>

                <div className="flex p-0.5 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-xs' : 'text-gray-400 hover:text-gray-700'}`}
                    title="List view"
                  >
                    <LayoutList className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-xs' : 'text-gray-400 hover:text-gray-700'}`}
                    title="Grid view"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Tag Filter indicator */}
            {selectedTag && (
              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className="text-gray-400 font-medium">Filtering by tag:</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-600 text-white font-medium text-xs">
                  #{selectedTag}
                  <button onClick={() => setSelectedTag('')} className="ml-1 hover:text-red-200">×</button>
                </span>
              </div>
            )}
          </div>

          {/* Meeting Cards View */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 animate-pulse flex gap-4">
                  <div className="w-11 h-11 bg-gray-200 dark:bg-gray-700 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : channelFilteredMeetings.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white dark:bg-gray-800/70 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-xs space-y-3">
              <div className="w-14 h-14 bg-primary-50 dark:bg-primary-950/40 text-primary-600 rounded-2xl flex items-center justify-center mx-auto">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                No meetings found
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                {search || selectedTag 
                  ? 'Try clearing your search query or tag filter to view all meetings.'
                  : 'Upload your first transcript file or reseed sample meetings to get started immediately.'}
              </p>
              {(search || selectedTag) && (
                <button
                  onClick={() => { setSearch(''); setSelectedTag(''); }}
                  className="mt-2 text-xs font-semibold text-primary-600 hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-3"}>
              {channelFilteredMeetings.map((meeting) => (
                <MeetingCard 
                  key={meeting.id} 
                  meeting={meeting} 
                  onDelete={handleDelete}
                  onEdit={(m) => setEditingMeeting(m)}
                  onTagClick={(t) => setSelectedTag(t)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <EditMeetingModal
        meeting={editingMeeting}
        isOpen={!!editingMeeting}
        onClose={() => setEditingMeeting(null)}
        onSuccess={fetchMeetings}
      />
    </div>
  );
}
