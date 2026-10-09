"use client";
import { useState } from 'react';
import { X, Link2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LiveBotModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [meetingName, setMeetingName] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [language, setLanguage] = useState('English (Global)');
  const [capturing, setCapturing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleStartCapture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingLink.trim()) {
      toast.error('Please enter a valid meeting invite link');
      return;
    }
    setCapturing(true);
    setTimeout(() => {
      setCapturing(false);
      setSuccess(true);
      toast.success('Fireflies Notetaker dispatched to meeting!');
      setTimeout(() => {
        setSuccess(false);
        setMeetingLink('');
        setMeetingName('');
        onClose();
      }, 1800);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-gray-100 select-none animate-fade-in">
      <div className="bg-[#181822] border border-[#2B2B3C] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-[#1B1B26]">
          <h2 className="text-sm font-semibold text-white">Add to live meeting</h2>
          <button 
            onClick={onClose} 
            className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-white">
                Notetaker Dispatched Successfully!
              </h3>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Fireflies will request access to the call in a few seconds. The transcript and AI summary will sync to your notebook.
              </p>
            </div>
          ) : (
            <form onSubmit={handleStartCapture} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Name your meeting <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Product team sync"
                  value={meetingName}
                  onChange={(e) => setMeetingName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-[#14141C] border border-[#2B2B3C] focus:border-purple-500 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Meeting link
                </label>
                <p className="text-[11px] text-gray-400 mb-2">
                  Capture meetings from GMeet, Zoom, MS Teams, and more.
                </p>
                <div className="relative">
                  <Link2 className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    required
                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 bg-[#14141C] border border-[#2B2B3C] focus:border-purple-500 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Meeting language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-[#14141C] border border-[#2B2B3C] focus:border-purple-500 rounded-xl text-gray-200 focus:outline-none cursor-pointer"
                >
                  <option value="English (Global)">English (Global)</option>
                  <option value="Spanish (Español)">Spanish (Español)</option>
                  <option value="French (Français)">French (Français)</option>
                  <option value="German (Deutsch)">German (Deutsch)</option>
                  <option value="Hindi (हिन्दी)">Hindi (हिन्दी)</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={capturing}
                  className="px-5 py-2 bg-[#5B45E0] hover:bg-[#6850EB] disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-900/30 transition-all"
                >
                  {capturing ? 'Connecting...' : 'Start Capturing'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
