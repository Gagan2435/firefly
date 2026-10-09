"use client";
import { X, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ScheduleMeetingModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  const handleConnectCalendar = (provider: string) => {
    toast.success(`Connected ${provider}. Fireflies will auto-join scheduled calendar meetings!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-gray-100 select-none">
      <div className="bg-[#181822] border border-[#2B2B3C] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#1B1B26]">
          <h3 className="text-sm font-semibold text-white">Schedule Meeting</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-center">
          <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
            Your AI Notetaker will be invited to the calendar meeting to record, transcribe and summarize.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => handleConnectCalendar('Google Calendar')}
              className="w-full py-2.5 px-4 bg-[#1F1F2B] hover:bg-[#282838] border border-[#2C2C3E] hover:border-purple-500/40 rounded-xl text-xs font-semibold text-white transition-all flex items-center justify-center gap-3 group"
            >
              <div className="w-5 h-5 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                G
              </div>
              <span>Google Calendar</span>
            </button>

            <button
              onClick={() => handleConnectCalendar('Microsoft Outlook')}
              className="w-full py-2.5 px-4 bg-[#1F1F2B] hover:bg-[#282838] border border-[#2C2C3E] hover:border-purple-500/40 rounded-xl text-xs font-semibold text-white transition-all flex items-center justify-center gap-3 group"
            >
              <div className="w-5 h-5 rounded bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-bold">
                O
              </div>
              <span>Microsoft Outlook</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-[#14141C] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#22222E] hover:bg-[#2B2B3A] text-gray-300 text-xs font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
