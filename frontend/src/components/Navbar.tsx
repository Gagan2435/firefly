"use client";
import { useState } from 'react';
import { Search, Plus, Bell, Bot, Sparkles } from 'lucide-react';
import CreateMeetingModal from './CreateMeetingModal';
import LiveBotModal from './LiveBotModal';
import GlobalSearchModal from './GlobalSearchModal';

export default function Navbar({ onMeetingCreated }: { onMeetingCreated?: () => void }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [liveBotOpen, setLiveBotOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      <header className="h-16 bg-white dark:bg-gray-800/90 border-b border-gray-200 dark:border-gray-700/80 px-6 flex items-center justify-between shrink-0 z-10">
        {/* Global Search trigger bar */}
        <div className="flex-1 max-w-md">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between text-xs text-gray-400 bg-gray-50 dark:bg-gray-900/60 hover:bg-gray-100 dark:hover:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2 transition-all group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
              <span>Search transcripts, action items, participants...</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-gray-500">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLiveBotOpen(true)}
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700/60 rounded-xl transition-colors"
          >
            <Bot className="w-4 h-4 text-primary-500" />
            Live Bot
          </button>

          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white px-3.5 py-2 rounded-xl font-semibold text-xs transition-all shadow-sm shadow-primary-600/30"
          >
            <Plus className="w-4 h-4" />
            Upload Transcript
          </button>

          {/* Notifications dropdown trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/60 rounded-xl relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-primary-500 absolute top-1.5 right-1.5" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-700 mb-2">
                  <span className="text-xs font-bold text-gray-900 dark:text-white">Notifications</span>
                  <span className="text-[10px] text-primary-600 font-semibold cursor-pointer">Mark read</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-primary-50/50 dark:bg-primary-950/30 rounded-xl border border-primary-100/50 dark:border-primary-900/30">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">AI Summary ready</p>
                    <p className="text-[11px] text-gray-500">"Q3 Product Strategy" has been transcribed and processed.</p>
                  </div>
                  <div className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">Action item assigned to you</p>
                    <p className="text-[11px] text-gray-500">Jordan Bell assigned "Stress test regression suite".</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <CreateMeetingModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => onMeetingCreated && onMeetingCreated()}
      />

      <LiveBotModal isOpen={liveBotOpen} onClose={() => setLiveBotOpen(false)} />

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
