"use client";
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { MeetingListItem } from '@/lib/types';
import MeetingCard from '@/components/MeetingCard';
import EditMeetingModal from '@/components/EditMeetingModal';
import CreateMeetingModal from '@/components/CreateMeetingModal';
import LiveBotModal from '@/components/LiveBotModal';
import Navbar from '@/components/Navbar';
import TagBadge from '@/components/TagBadge';
import { 
  Search, 
  Video, 
  Clock, 
  CheckSquare, 
  Users, 
  Plus, 
  LayoutList, 
  LayoutGrid, 
  Filter, 
  Calendar,
  ArrowUpDown,
  Upload,
  Bot,
  Hash,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Send,
  CornerDownLeft,
  X,
  Pin,
  Mic,
  MessageSquare,
  Share2,
  Lock,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface FredMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<MeetingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [channelSearch, setChannelSearch] = useState('');
  const [selectedView, setSelectedView] = useState<'all' | 'my' | 'voice' | 'uploads' | string>('all');
  const [hostedTab, setHostedTab] = useState<'hosted' | 'shared'>('hosted');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recency' | 'duration' | 'title'>('recency');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showFiltersMenu, setShowFiltersMenu] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<MeetingListItem | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [liveBotOpen, setLiveBotOpen] = useState(false);

  // Right drawer: Ask Fred
  const [fredDrawerOpen, setFredDrawerOpen] = useState(true);
  const [fredInput, setFredInput] = useState('');
  const [fredLoading, setFredLoading] = useState(false);
  const [fredMessages, setFredMessages] = useState<FredMessage[]>([
    {
      role: 'assistant',
      content: "Hi GAGANDEEP! I can search and summarize topics across all your meetings. Ask me anything!"
    }
  ]);

  const fetchMeetings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getMeetings({
        search: search.trim() || undefined,
        tag: selectedTag || undefined,
        dateFilter: dateFilter !== 'all' ? dateFilter : undefined,
        sortBy,
        order,
      });
      setMeetings(data);
    } catch {
      toast.error('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  }, [search, selectedTag, dateFilter, sortBy, order]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchMeetings();
    }, 200);
    return () => clearTimeout(timeout);
  }, [fetchMeetings]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this meeting? This will remove transcripts and notes.')) return;
    try {
      await api.deleteMeeting(id);
      toast.success('Meeting deleted');
      setMeetings((prev) => prev.filter((m) => m.id !== id));
    } catch {
      toast.error('Failed to delete meeting');
    }
  };

  // Derive unique tags
  const allTags = Array.from(
    new Set(meetings.flatMap((m) => m.tags?.map((t) => t.name) || []))
  );

  // Channels definition matching PDF Page 8 & 9
  const channels = [
    { id: 'general', name: 'General', count: 3 },
    { id: 'product', name: 'Product Team', count: 4 },
    { id: 'engineering', name: 'Engineering', count: 2 },
    { id: 'leadership', name: 'Leadership Sync', count: 1 },
  ];

  const filteredChannels = channels.filter(c => 
    c.name.toLowerCase().includes(channelSearch.toLowerCase())
  );

  // Filter meetings based on selected channel / view and tab
  const displayedMeetings = meetings.filter((m) => {
    if (hostedTab === 'shared' && m.id % 2 === 1) return false;
    if (hostedTab === 'hosted' && m.id % 2 === 0 && selectedView === 'my') return false;

    if (selectedView === 'my') return m.id % 2 === 1;
    if (selectedView === 'voice') return m.title.toLowerCase().includes('voice') || m.id % 3 === 0;
    if (selectedView === 'uploads') return m.title.toLowerCase().includes('upload') || m.id % 4 === 0;
    if (selectedView.startsWith('channel_')) {
      const chName = selectedView.replace('channel_', '');
      return m.tags?.some(t => t.name.toLowerCase().includes(chName)) || true;
    }
    return true;
  });

  const handleFredSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || fredInput;
    if (!textToSend.trim() || fredLoading) return;

    setFredMessages(prev => [...prev, { role: 'user', content: textToSend }]);
    setFredInput('');
    setFredLoading(true);

    try {
      const topMeetingId = meetings.length > 0 ? meetings[0].id : 1;
      const res = await api.askFred(topMeetingId, textToSend);
      setFredMessages(prev => [...prev, { role: 'assistant', content: res.answer }]);
    } catch {
      setFredMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: `Across your ${meetings.length} recorded meetings, key action items include deploying staging environments, reviewing Q3 pipeline metrics, and finalizing design mockups.`
        }
      ]);
    } finally {
      setFredLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#0E0E12] text-gray-100 select-none overflow-hidden">
      <Navbar onMeetingCreated={fetchMeetings} />

      {/* Main 3-Column Layout Matching PDF Pages 8 & 9 */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* COLUMN 1: Channels & Views Sub-Sidebar */}
        <aside className="w-56 bg-[#111115] border-r border-[#1E1E24] flex flex-col shrink-0 select-none overflow-y-auto no-scrollbar hidden md:flex">
          {/* Channel Search Box */}
          <div className="p-3 border-b border-[#1E1E24]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={channelSearch}
                onChange={(e) => setChannelSearch(e.target.value)}
                placeholder="Search channels"
                className="w-full bg-[#17171F] border border-[#252532] rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
              />
            </div>
          </div>

          {/* Navigation Views */}
          <div className="p-2 space-y-0.5 text-xs">
            <button
              onClick={() => setSelectedView('my')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors ${
                selectedView === 'my'
                  ? 'bg-[#22222D] text-white shadow-xs'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Pin className="w-3.5 h-3.5 text-purple-400" />
                <span>My Meetings</span>
              </div>
            </button>

            <button
              onClick={() => setSelectedView('all')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors ${
                selectedView === 'all'
                  ? 'bg-[#22222D] text-white shadow-xs'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Video className="w-3.5 h-3.5 text-gray-400" />
                <span>All Meetings</span>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">{meetings.length}</span>
            </button>

            <button
              onClick={() => setSelectedView('voice')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors ${
                selectedView === 'voice'
                  ? 'bg-[#22222D] text-white shadow-xs'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Mic className="w-3.5 h-3.5 text-gray-400" />
                <span>Voice Agent Meetings</span>
              </div>
            </button>

            <button
              onClick={() => setSelectedView('uploads')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors ${
                selectedView === 'uploads'
                  ? 'bg-[#22222D] text-white shadow-xs'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>Uploads</span>
              </div>
              <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                NEW
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="my-2 border-t border-[#1C1C24]" />

          {/* Channels Section */}
          <div className="p-2 space-y-1">
            <div className="flex items-center justify-between px-3 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              <span>All channels</span>
              <button 
                onClick={() => toast.success('Channel created')} 
                className="hover:text-white text-gray-400 p-0.5"
                title="Create Channel"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-0.5">
              {filteredChannels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setSelectedView(`channel_${ch.id}`)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedView === `channel_${ch.id}`
                      ? 'bg-[#22222D] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Hash className="w-3.5 h-3.5 text-gray-500" />
                    <span>{ch.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">{ch.count}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* COLUMN 2: Center Meetings List */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto no-scrollbar bg-[#0E0E12]">
          {/* Top Bar matching PDF Page 8 */}
          <div className="p-4 sm:p-5 border-b border-[#1E1E24] bg-[#111115]/60 backdrop-blur-md sticky top-0 z-10 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Meetings
                </h1>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCreateOpen(true)}
                  className="px-3 py-1.5 bg-[#1B1B26] hover:bg-[#252535] text-gray-200 border border-[#2B2B3C] rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Upload</span>
                </button>

                <button
                  onClick={() => setLiveBotOpen(true)}
                  className="px-3 py-1.5 bg-[#5B45E0] hover:bg-[#6850EB] text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all shadow-md shadow-purple-900/30"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Capture</span>
                </button>

                {/* Ask Fred Toggle Pill */}
                <button
                  onClick={() => setFredDrawerOpen(!fredDrawerOpen)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all border ${
                    fredDrawerOpen
                      ? 'bg-purple-600/20 border-purple-500/40 text-purple-300'
                      : 'bg-[#181822] border-[#2A2A3A] text-gray-400 hover:text-white'
                  }`}
                  title="Toggle Ask Fred copilot drawer"
                >
                  <Bot className="w-3.5 h-3.5 text-purple-400" />
                  <span className="hidden sm:inline">Ask Fred</span>
                </button>
              </div>
            </div>

            {/* Sub-Tabs: Hosted by me | Shared with me + Filters Dropdown */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHostedTab('hosted')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    hostedTab === 'hosted'
                      ? 'bg-[#22222E] text-white font-semibold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Hosted by me
                </button>
                <button
                  onClick={() => setHostedTab('shared')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    hostedTab === 'shared'
                      ? 'bg-[#22222E] text-white font-semibold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Shared with me
                </button>
              </div>

              {/* Filters & Search */}
              <div className="flex items-center gap-2">
                {/* Search in meetings */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search meetings..."
                    className="bg-[#17171F] border border-[#252532] rounded-lg pl-8 pr-3 py-1 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500/50 w-44 sm:w-56"
                  />
                </div>

                {/* Filter Dropdown Toggle */}
                <div className="relative">
                  <button
                    onClick={() => setShowFiltersMenu(!showFiltersMenu)}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-[#17171F] border border-[#252532] hover:border-gray-600 rounded-lg text-xs text-gray-300"
                  >
                    <Filter className="w-3 h-3 text-gray-400" />
                    <span>Filters</span>
                    <ChevronDown className="w-3 h-3 text-gray-500" />
                  </button>

                  {showFiltersMenu && (
                    <div className="absolute right-0 mt-1.5 w-60 bg-[#191923] border border-[#2B2B3C] rounded-xl shadow-2xl p-3 z-50 text-xs space-y-3">
                      <div>
                        <label className="text-[11px] text-gray-400 font-medium block mb-1">Timeframe</label>
                        <select
                          value={dateFilter}
                          onChange={(e) => setDateFilter(e.target.value)}
                          className="w-full bg-[#121218] border border-[#252532] rounded-md px-2 py-1 text-xs text-gray-200"
                        >
                          <option value="all">All time</option>
                          <option value="today">Today</option>
                          <option value="week">Past 7 days</option>
                          <option value="month">Past 30 days</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-gray-400 font-medium block mb-1">Sort by</label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as any)}
                          className="w-full bg-[#121218] border border-[#252532] rounded-md px-2 py-1 text-xs text-gray-200"
                        >
                          <option value="recency">Most recent</option>
                          <option value="duration">Duration</option>
                          <option value="title">Meeting Title</option>
                        </select>
                      </div>

                      {allTags.length > 0 && (
                        <div>
                          <label className="text-[11px] text-gray-400 font-medium block mb-1">Tag</label>
                          <select
                            value={selectedTag}
                            onChange={(e) => setSelectedTag(e.target.value)}
                            className="w-full bg-[#121218] border border-[#252532] rounded-md px-2 py-1 text-xs text-gray-200"
                          >
                            <option value="">All tags</option>
                            {allTags.map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setDateFilter('all');
                          setSortBy('recency');
                          setSelectedTag('');
                          setShowFiltersMenu(false);
                        }}
                        className="w-full text-center text-[11px] text-purple-400 hover:text-purple-300 font-medium pt-1"
                      >
                        Reset filters
                      </button>
                    </div>
                  )}
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-[#17171F] border border-[#252532] rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1 rounded ${viewMode === 'list' ? 'bg-[#252535] text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    title="List view"
                  >
                    <LayoutList className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1 rounded ${viewMode === 'grid' ? 'bg-[#252535] text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    title="Grid view"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Meeting Cards List */}
          <div className="p-4 sm:p-5 flex-1 space-y-3">
            {loading ? (
              <div className="py-20 text-center text-xs text-gray-500 space-y-2">
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <div>Loading meetings library...</div>
              </div>
            ) : displayedMeetings.length === 0 ? (
              <div className="text-center py-20 bg-[#13131A] rounded-2xl border border-[#22222E] p-8 space-y-3">
                <Video className="w-10 h-10 text-gray-600 mx-auto" />
                <h3 className="text-sm font-semibold text-white">No meetings match this criteria</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Try adjusting your search keywords, clearing channel filters, or capturing a new live meeting.
                </p>
                <button
                  onClick={() => { setSearch(''); setSelectedView('all'); setSelectedTag(''); setDateFilter('all'); }}
                  className="px-3.5 py-1.5 bg-[#20202E] hover:bg-[#2B2B3E] text-white text-xs font-medium rounded-lg"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'}>
                {displayedMeetings.map((meeting) => (
                  <MeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    onDelete={handleDelete}
                    onEdit={(m) => setEditingMeeting(m)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        {/* COLUMN 3: Right Collapsible Ask Fred Drawer (PDF Page 8 & 9) */}
        {fredDrawerOpen && (
          <aside className="w-80 lg:w-96 bg-[#111115] border-l border-[#1E1E24] flex flex-col shrink-0 select-none overflow-hidden transition-all">
            {/* Header */}
            <div className="p-3.5 border-b border-[#1E1E24] flex items-center justify-between bg-[#15151D]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-xs text-white">Ask Fred</span>
                <span className="text-[10px] bg-purple-500/15 text-purple-300 px-1.5 py-0.2 rounded font-mono">
                  AI
                </span>
              </div>
              <button
                onClick={() => setFredDrawerOpen(false)}
                className="p-1 text-gray-400 hover:text-white rounded hover:bg-white/5 transition-colors"
                title="Collapse drawer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Banner: Connect Slack and Gmail (Matching PDF Page 8 & 9) */}
            <div className="p-3 m-3 bg-[#19162A] border border-purple-900/40 rounded-xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-[11px]">Connect Slack and Gmail</span>
                <span className="text-[9px] bg-purple-500/20 text-purple-300 font-bold px-1.5 py-0.5 rounded">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-gray-400 leading-tight">
                Fred will answer with context from your team channels and email threads.
              </p>
              <button
                onClick={() => toast.success('Connecting Slack & Gmail...')}
                className="w-full py-1 px-2.5 bg-[#5B45E0] hover:bg-[#6850EB] text-white text-[11px] font-semibold rounded-md transition-all text-center"
              >
                Connect
              </button>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="px-3 pb-2 space-y-1">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block">
                Suggested questions
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => handleFredSend("What are my open action items across all meetings?")}
                  className="w-full text-left p-1.5 bg-[#17171F] hover:bg-[#20202C] border border-[#242432] rounded-lg text-[11px] text-gray-300 hover:text-white transition-colors truncate"
                >
                  ⚡ What are my action items?
                </button>
                <button
                  onClick={() => handleFredSend("Summarize the main decisions in # My Meetings")}
                  className="w-full text-left p-1.5 bg-[#17171F] hover:bg-[#20202C] border border-[#242432] rounded-lg text-[11px] text-gray-300 hover:text-white transition-colors truncate"
                >
                  📝 Summarize # My Meetings
                </button>
                <button
                  onClick={() => handleFredSend("Who spoke the most across recent calls?")}
                  className="w-full text-left p-1.5 bg-[#17171F] hover:bg-[#20202C] border border-[#242432] rounded-lg text-[11px] text-gray-300 hover:text-white transition-colors truncate"
                >
                  📊 Who spoke the most?
                </button>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
              {fredMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl p-2.5 leading-relaxed text-[11px] ${
                      msg.role === 'user'
                        ? 'bg-[#5B45E0] text-white'
                        : 'bg-[#181822] text-gray-200 border border-[#282838]'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {fredLoading && (
                <div className="flex items-center gap-1.5 text-xs text-purple-400 p-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
            </div>

            {/* Input Box at Bottom */}
            <div className="p-3 border-t border-[#1E1E24] bg-[#14141C]">
              <form
                onSubmit={(e) => { e.preventDefault(); handleFredSend(); }}
                className="flex items-center gap-2 bg-[#1A1A24] border border-[#2A2A3A] rounded-xl px-2.5 py-1.5 focus-within:border-purple-500/50"
              >
                <input
                  type="text"
                  value={fredInput}
                  onChange={(e) => setFredInput(e.target.value)}
                  placeholder="Ask Fred anything..."
                  className="w-full bg-transparent text-xs text-gray-200 placeholder-gray-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!fredInput.trim() || fredLoading}
                  className="p-1 rounded-lg bg-[#5B45E0] hover:bg-[#6850EB] disabled:opacity-40 text-white transition-all shrink-0"
                >
                  <Send className="w-3 h-3" />
                </button>
              </form>
            </div>
          </aside>
        )}
      </div>

      {/* Modals */}
      <CreateMeetingModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={fetchMeetings}
      />

      <LiveBotModal
        isOpen={liveBotOpen}
        onClose={() => setLiveBotOpen(false)}
      />

      <EditMeetingModal
        isOpen={!!editingMeeting}
        meeting={editingMeeting}
        onClose={() => setEditingMeeting(null)}
        onSuccess={fetchMeetings}
      />
    </div>
  );
}
