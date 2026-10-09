"use client";
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  Bell, 
  Video, 
  ChevronDown, 
  Upload, 
  Mic, 
  Bot, 
  Calendar,
  Zap, 
  Check, 
  X,
  Sparkles
} from 'lucide-react';
import CreateMeetingModal from './CreateMeetingModal';
import LiveBotModal from './LiveBotModal';
import ScheduleMeetingModal from './ScheduleMeetingModal';
import GlobalSearchModal from './GlobalSearchModal';
import toast from 'react-hot-toast';

export default function Navbar({ onMeetingCreated }: { onMeetingCreated?: () => void }) {
  const pathname = usePathname();
  const [createOpen, setCreateOpen] = useState(false);
  const [liveBotOpen, setLiveBotOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [captureMenuOpen, setCaptureMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (captureRef.current && !captureRef.current.contains(event.target as Node)) {
        setCaptureMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRecordMic = () => {
    setCaptureMenuOpen(false);
    toast.success('Microphone capture initialized. Recording meeting audio...');
  };

  // Derive human-readable page title
  const getPageTitle = () => {
    if (pathname === '/') return 'Home';
    if (pathname === '/meetings') return 'Meetings';
    if (pathname.startsWith('/meetings/')) return 'Notepad';
    if (pathname === '/tasks') return 'Tasks';
    if (pathname === '/ai-skills') return 'AI Skills';
    if (pathname === '/askfred') return 'AskFred';
    if (pathname === '/analytics') return 'Analytics';
    if (pathname === '/voice-agents') return 'Voice Agents';
    if (pathname === '/integrations') return 'Integrations';
    if (pathname === '/settings') return 'Settings';
    if (pathname === '/upgrade') return 'Upgrade Plan';
    if (pathname === '/team') return 'Team Workspace';
    return 'Fireflies';
  };

  return (
    <>
      <header className="h-14 bg-[#111115] border-b border-[#1E1E24] px-5 sm:px-6 flex items-center justify-between shrink-0 z-20 select-none">
        {/* Left: Dynamic Page Title / Breadcrumb */}
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-white tracking-wide">
            {getPageTitle()}
          </h2>
        </div>

        {/* Center: Search input bar matching real Fireflies layout */}
        <div className="flex-1 max-w-md mx-4">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between text-xs text-gray-400 bg-[#16161D] hover:bg-[#1C1C24] border border-[#252530] hover:border-gray-600 rounded-lg px-3 py-1.5 transition-all group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-gray-400 group-hover:text-purple-400 transition-colors" />
              <span className="text-gray-400 font-normal">Search by title or keyword</span>
            </div>
            <kbd className="inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#21212B] border border-[#2D2D3A] rounded text-gray-400">
              Ctrl + K
            </kbd>
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Upgrade Pill Badge: [ 3 free meetings | Upgrade ] (PDF Page 1, 2, 3) */}
          <Link
            href="/upgrade"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1A1824] hover:bg-[#232034] border border-amber-500/30 hover:border-amber-500/50 text-[11px] font-medium text-gray-300 transition-all group shadow-xs"
          >
            <span className="text-gray-400 group-hover:text-gray-200">3 free meetings</span>
            <span className="text-gray-600">|</span>
            <span className="text-amber-400 group-hover:text-amber-300 font-semibold flex items-center gap-0.5">
              Upgrade
              <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
            </span>
          </Link>

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-lg relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1 right-1 ring-2 ring-[#111115]" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#181822] border border-[#262634] rounded-xl shadow-2xl p-3 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-2">
                  <span className="font-semibold text-white">Notifications</span>
                  <span 
                    onClick={() => toast.success('All notifications marked as read')} 
                    className="text-[11px] text-purple-400 hover:text-purple-300 cursor-pointer font-medium"
                  >
                    Mark read
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 bg-[#201D2C] rounded-lg border border-purple-900/30">
                    <p className="font-semibold text-white">AI Summary ready</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">"Quarterly Financial Review" has been transcribed and processed.</p>
                  </div>
                  <div className="p-2.5 bg-white/[0.02] hover:bg-white/[0.05] rounded-lg border border-white/5 transition-colors">
                    <p className="font-semibold text-gray-200">Action item assigned to you</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Jordan Bell assigned "Stress test regression suite".</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Capture Dropdown Button (Vibrant Purple [ 📹 Capture ⌵ ]) */}
          <div className="relative" ref={captureRef}>
            <button
              onClick={() => setCaptureMenuOpen(!captureMenuOpen)}
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#5B45E0] hover:bg-[#6850EB] active:scale-98 text-white px-3 sm:px-3.5 py-1.5 rounded-lg font-medium text-xs transition-all shadow-md shadow-purple-900/30"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Capture</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${captureMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {captureMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-60 bg-[#181822] border border-[#272736] rounded-xl shadow-2xl p-1.5 z-50 text-xs space-y-1 backdrop-blur-md">
                <button
                  onClick={() => { setCaptureMenuOpen(false); setLiveBotOpen(true); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-lg text-gray-200 hover:text-white hover:bg-[#252535] transition-colors"
                >
                  <Bot className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <div className="font-medium">Add to live meeting</div>
                    <div className="text-[10px] text-gray-400">Invite Fred bot to Zoom / Meet</div>
                  </div>
                </button>

                <button
                  onClick={() => { setCaptureMenuOpen(false); setScheduleOpen(true); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-lg text-gray-200 hover:text-white hover:bg-[#252535] transition-colors"
                >
                  <Calendar className="w-4 h-4 text-sky-400 shrink-0" />
                  <div>
                    <div className="font-medium">Schedule new meeting</div>
                    <div className="text-[10px] text-gray-400">Sync Google or Outlook calendar</div>
                  </div>
                </button>

                <button
                  onClick={() => { setCaptureMenuOpen(false); setCreateOpen(true); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-lg text-gray-200 hover:text-white hover:bg-[#252535] transition-colors"
                >
                  <Upload className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-medium">Upload audio or video</div>
                    <div className="text-[10px] text-gray-400">Upload audio, video or transcript</div>
                  </div>
                </button>

                <button
                  onClick={handleRecordMic}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-lg text-gray-200 hover:text-white hover:bg-[#252535] transition-colors"
                >
                  <Mic className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <div className="font-medium">Start recording</div>
                    <div className="text-[10px] text-gray-400">Record through your microphone</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      <CreateMeetingModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => onMeetingCreated && onMeetingCreated()}
      />

      <ScheduleMeetingModal
        isOpen={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
      />

      <LiveBotModal isOpen={liveBotOpen} onClose={() => setLiveBotOpen(false)} />

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
