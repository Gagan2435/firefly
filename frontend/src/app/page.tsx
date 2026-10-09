"use client";
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { MeetingListItem } from '@/lib/types';
import MeetingCard from '@/components/MeetingCard';
import EditMeetingModal from '@/components/EditMeetingModal';
import CreateMeetingModal from '@/components/CreateMeetingModal';
import LiveBotModal from '@/components/LiveBotModal';
import ScheduleMeetingModal from '@/components/ScheduleMeetingModal';
import PocketGuideModal from '@/components/PocketGuideModal';
import HelpModal from '@/components/HelpModal';
import Navbar from '@/components/Navbar';
import { 
  Play, 
  Video, 
  Upload, 
  Plus, 
  Settings, 
  ChevronRight, 
  Sparkles, 
  HelpCircle, 
  Bot,
  Calendar,
  CheckSquare,
  Download,
  Smartphone,
  Laptop,
  ArrowUpRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function HomePage() {
  const [meetings, setMeetings] = useState<MeetingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'recent' | 'upcoming' | 'aifeed'>('recent');
  const [editingMeeting, setEditingMeeting] = useState<MeetingListItem | null>(null);
  
  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [liveBotModalOpen, setLiveBotModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [pocketGuideOpen, setPocketGuideOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const fetchMeetings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getMeetings({ sortBy: 'recency', order: 'desc' });
      setMeetings(data);
    } catch {
      toast.error('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this meeting?')) return;
    try {
      await api.deleteMeeting(id);
      toast.success('Meeting deleted');
      setMeetings((prev) => prev.filter((m) => m.id !== id));
    } catch {
      toast.error('Failed to delete meeting');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#0E0E12] text-gray-100 select-none pb-12">
      <Navbar onMeetingCreated={fetchMeetings} />

      <div className="p-5 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* 1. Hero Card: Warm dark brown-purple gradient banner matching PDF Page 1 & 5 */}
        <div className="bg-gradient-to-r from-[#241B18] via-[#1D1724] to-[#14131D] border border-[#3A2722]/60 rounded-2xl p-6 sm:p-7 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-2xl">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Text matching PDF */}
          <div className="space-y-2 z-10 max-w-xl">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-tight">
              Welcome Aboard, GAGANDEEP!
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 font-normal leading-relaxed">
              Fireflies is now ready to automate your meetings and streamline your workflows.
            </p>
          </div>

          {/* Right Video Thumbnail Card (Fireflies 101 Pocket Guide) */}
          <div 
            onClick={() => setPocketGuideOpen(true)}
            className="w-full sm:w-80 h-44 rounded-xl border border-amber-900/40 bg-[#151222] p-2 relative shadow-2xl overflow-hidden group cursor-pointer shrink-0 z-10 hover:border-purple-500/40 transition-all"
          >
            <div className="w-full h-full rounded-lg bg-gradient-to-tr from-[#1A152E] to-[#251B3D] border border-white/5 p-3 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold tracking-wider text-purple-300 uppercase">
                  Fireflies 101 Pocket Guide
                </span>
                <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-mono">
                  3:15
                </span>
              </div>

              {/* Play Button in Center */}
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white mx-auto shadow-xl group-hover:scale-110 group-hover:bg-[#5B45E0] transition-all">
                <Play className="w-5 h-5 fill-white ml-0.5" />
              </div>

              {/* Presenter Avatar in bottom-left */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white ring-1 ring-white/20">
                  G
                </div>
                <span className="text-[10px] text-gray-300 font-medium">Quickstart Tutorial</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Quick Action Bar (PDF Page 1 & 5) */}
        <div>
          <p className="text-xs text-gray-400 font-normal mb-3">
            Schedule a meeting or upload a recording to see Fireflies in action.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Action 1: Schedule Meeting */}
            <button
              onClick={() => setScheduleModalOpen(true)}
              className="bg-[#1A161E] hover:bg-[#221C28] border border-[#2A2030] hover:border-purple-500/40 rounded-xl p-4 flex items-center justify-between text-left transition-all group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/15 text-sky-400 border border-sky-500/20 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-white group-hover:text-sky-300 transition-colors">
                  Schedule Meeting
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* Action 2: Upload File */}
            <button
              onClick={() => setCreateModalOpen(true)}
              className="bg-[#13191D] hover:bg-[#182228] border border-[#1E2B30] hover:border-emerald-500/40 rounded-xl p-4 flex items-center justify-between text-left transition-all group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">
                  Upload File
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* Action 3: Capture Meeting */}
            <button
              onClick={() => setLiveBotModalOpen(true)}
              className="bg-[#181524] hover:bg-[#201C30] border border-[#271E3A] hover:border-purple-500/40 rounded-xl p-4 flex items-center justify-between text-left transition-all group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-white group-hover:text-purple-300 transition-colors">
                  Capture Meeting
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>
        </div>

        {/* 3. Tabs Bar: Recent | Upcoming | AI Feed + Settings on Right (PDF Page 1) */}
        <div className="flex items-center justify-between border-b border-[#1E1E28] pb-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'recent'
                  ? 'bg-[#22222B] text-white border border-white/5 shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-[#22222B] text-white border border-white/5 shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('aifeed')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'aifeed'
                  ? 'bg-[#22222B] text-white border border-white/5 shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              AI Feed
            </button>
          </div>

          <Link
            href="/settings"
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-white/[0.04] transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </Link>
        </div>

        {/* 4. Tab Content: Recent vs Upcoming vs AI Feed */}
        {activeTab === 'recent' && (
          <div className="space-y-3">
            {loading ? (
              <div className="py-16 text-center text-xs text-gray-500 space-y-2">
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <div>Loading recent meetings...</div>
              </div>
            ) : meetings.length === 0 ? (
              <div className="text-center py-16 bg-[#14141B] rounded-2xl border border-[#22222E] p-8">
                <Bot className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-white">No meetings recorded yet</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1 mb-4">
                  Add Fireflies to your live call or upload a transcript file to see AI summaries and interactive playback.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setLiveBotModalOpen(true)}
                    className="px-3.5 py-2 bg-[#5B45E0] hover:bg-[#6850EB] text-white text-xs font-medium rounded-lg"
                  >
                    + Add to Live Meeting
                  </button>
                  <button
                    onClick={() => setCreateModalOpen(true)}
                    className="px-3.5 py-2 bg-[#1E1E28] hover:bg-[#282836] text-gray-300 text-xs font-medium rounded-lg border border-white/5"
                  >
                    Upload Transcript
                  </button>
                </div>
              </div>
            ) : (
              meetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  onDelete={handleDelete}
                  onEdit={(m) => setEditingMeeting(m)}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'upcoming' && (
          <div className="text-center py-16 bg-[#14141B] rounded-2xl border border-[#22222E] p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">No upcoming meeting scheduled</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto mt-1">
                Connect your Google Calendar or Microsoft Outlook to allow Fireflies to auto-join and transcribe your scheduled calendar calls.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setScheduleModalOpen(true)}
                className="px-4 py-2 bg-[#5B45E0] hover:bg-[#6850EB] text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-purple-900/30"
              >
                + Schedule Meeting
              </button>
              <button
                onClick={() => setLiveBotModalOpen(true)}
                className="px-4 py-2 bg-[#1E1E28] hover:bg-[#282838] text-gray-300 text-xs font-semibold rounded-xl border border-white/5 transition-all"
              >
                Capture Live Call
              </button>
            </div>
          </div>
        )}

        {activeTab === 'aifeed' && (
          <div className="space-y-4">
            {/* AI Feed Banner */}
            <div className="bg-[#14141B] border border-[#22222E] rounded-xl p-4 text-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-xs">Extract specific insights from your meetings</h4>
                  <p className="text-gray-400 text-[11px] mt-0.5">
                    Fireflies AI Feed analyzes key moments, sentiment, and recurring topics across all conversations.
                  </p>
                </div>
              </div>
              <Link
                href="/ai-skills"
                className="text-purple-400 hover:text-purple-300 font-semibold text-xs flex items-center gap-1 shrink-0"
              >
                Explore Skills <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Recommended Skills Grid (PDF Page 5) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-[#15151F] border border-[#222230] rounded-xl p-4 space-y-2 hover:border-purple-500/40 transition-colors group">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-white group-hover:text-purple-300 transition-colors">
                    1:1 Meeting Recap
                  </span>
                  <span className="text-[10px] font-mono bg-purple-500/15 text-purple-300 px-1.5 py-0.5 rounded">
                    Popular
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Extracts 1:1 goals, coaching feedback, blocker resolution, and next check-in action items.
                </p>
              </div>

              <div className="bg-[#15151F] border border-[#222230] rounded-xl p-4 space-y-2 hover:border-purple-500/40 transition-colors group">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-white group-hover:text-purple-300 transition-colors">
                    Idea Generator
                  </span>
                  <span className="text-[10px] font-mono bg-amber-500/15 text-amber-300 px-1.5 py-0.5 rounded">
                    Creative
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Extracts novel marketing hooks, feature proposals, and architectural brainstorms.
                </p>
              </div>

              <div className="bg-[#15151F] border border-[#222230] rounded-xl p-4 space-y-2 hover:border-purple-500/40 transition-colors group">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-white group-hover:text-purple-300 transition-colors">
                    Daily Standups
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-500/15 text-emerald-300 px-1.5 py-0.5 rounded">
                    Agile
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Synthesizes what was completed yesterday, what is planned today, and active engineering blockers.
                </p>
              </div>
            </div>

            {/* Meetings with extracted insights */}
            {meetings.slice(0, 3).map((m) => (
              <div key={m.id} className="bg-[#15151D] border border-[#22222E] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <Link href={`/meetings/${m.id}`} className="font-semibold text-white hover:text-purple-400">
                    {m.title}
                  </Link>
                  <span className="text-[11px] text-gray-500 font-mono">AI Processed</span>
                </div>
                {m.summary && (
                  <p className="text-xs text-gray-300 italic border-l-2 border-purple-500/50 pl-3">
                    "{m.summary}"
                  </p>
                )}
                <div className="flex items-center justify-between pt-1 text-[11px] text-gray-400">
                  <span>{m.action_items_count} Action Items Generated</span>
                  <Link href={`/meetings/${m.id}`} className="text-purple-400 hover:text-purple-300 font-medium">
                    Open in Notepad →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. "Try More" Section (Matching PDF Page 1 & 5) */}
        <div className="pt-6 border-t border-[#1C1C24] space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Try More Fireflies Apps
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Desktop App Card */}
            <div className="bg-[#14141C] border border-[#22222E] hover:border-purple-500/30 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 transition-all">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-600/15 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Desktop App</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Bot-less meetings & local audio recording with zero calendar setup.
                  </p>
                </div>
              </div>
              <button
                onClick={() => toast.success('Fireflies Desktop App installer downloaded')}
                className="px-3.5 py-1.5 bg-[#222230] hover:bg-[#2C2C3E] text-white text-xs font-semibold rounded-lg border border-white/5 transition-all shrink-0 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-purple-400" />
                <span>Download</span>
              </button>
            </div>

            {/* Mobile App Card */}
            <div className="bg-[#14141C] border border-[#22222E] hover:border-purple-500/30 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 transition-all">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/15 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Mobile App</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Capture in-person discussions and voice memos on the go.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => toast.success('Redirecting to Apple App Store')}
                  className="px-2.5 py-1 bg-[#222230] hover:bg-[#2C2C3E] text-[10px] text-gray-300 font-medium rounded border border-white/5"
                >
                  iOS
                </button>
                <button
                  onClick={() => toast.success('Redirecting to Google Play Store')}
                  className="px-2.5 py-1 bg-[#222230] hover:bg-[#2C2C3E] text-[10px] text-gray-300 font-medium rounded border border-white/5"
                >
                  Android
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating (?) Help Button in Bottom Right */}
      <button
        onClick={() => setHelpOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-base shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-black/10"
        title="Fireflies Help & Shortcuts"
      >
        ?
      </button>

      {/* Modals */}
      <PocketGuideModal
        isOpen={pocketGuideOpen}
        onClose={() => setPocketGuideOpen(false)}
      />

      <HelpModal
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
      />

      <CreateMeetingModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={fetchMeetings}
      />

      <ScheduleMeetingModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
      />

      <LiveBotModal
        isOpen={liveBotModalOpen}
        onClose={() => setLiveBotModalOpen(false)}
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
