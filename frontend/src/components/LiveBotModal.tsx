"use client";
import { useState } from 'react';
import { X, Bot, Sparkles, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LiveBotModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [meetingUrl, setMeetingUrl] = useState('');
  const [botName, setBotName] = useState('Fireflies.ai Notetaker (Fred)');
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  if (!isOpen) return null;

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingUrl.trim()) {
      toast.error('Please enter a valid Zoom, Google Meet, or Teams URL');
      return;
    }
    setJoining(true);
    setTimeout(() => {
      setJoining(false);
      setJoined(true);
      toast.success('Fred is joining the meeting as a silent notetaker!');
      setTimeout(() => {
        setJoined(false);
        setMeetingUrl('');
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Add Fred to Live Call</h2>
              <span className="text-[11px] font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                Live Notetaker Bot
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {joined ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Fred Dispatched Successfully!
              </h3>
              <p className="text-xs text-gray-500">
                The notetaker will request admission into your meeting room in ~10 seconds. Notes will appear in your Notebook once the call finishes.
              </p>
            </div>
          ) : (
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Meeting Invite Link *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Bot Display Name
                </label>
                <input
                  type="text"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="p-3 bg-primary-50/60 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900/40 rounded-xl space-y-1 text-xs text-primary-900 dark:text-primary-300">
                <div className="flex items-center gap-1.5 font-semibold text-primary-700 dark:text-primary-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  Live Meeting Intelligence
                </div>
                <p className="text-[11px] text-gray-600 dark:text-gray-400">
                  Fred will automatically record the audio track, perform speaker diarization, and generate action items and an executive summary.
                </p>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={joining || !meetingUrl}
                  className="px-4 py-2 text-xs font-medium bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg shadow-sm"
                >
                  {joining ? 'Connecting Bot...' : 'Send Bot to Call'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
