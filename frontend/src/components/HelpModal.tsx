"use client";
import { X, Keyboard, HelpCircle, BookOpen, MessageSquare, ExternalLink } from 'lucide-react';

export default function HelpModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in text-gray-100">
      <div className="bg-[#181822] border border-[#2A2A38] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col text-xs">
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#1B1B26]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white text-black font-bold flex items-center justify-center text-xs">
              ?
            </div>
            <h3 className="text-sm font-semibold text-white">Fireflies Help & Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5 text-purple-400" />
              Keyboard Shortcuts
            </h4>
            <div className="grid grid-cols-2 gap-2 bg-[#12121A] p-3 rounded-xl border border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Global Search</span>
                <kbd className="px-1.5 py-0.5 bg-[#22222E] border border-[#333344] rounded text-[10px] text-gray-300 font-mono">
                  Ctrl + K
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Play / Pause</span>
                <kbd className="px-1.5 py-0.5 bg-[#22222E] border border-[#333344] rounded text-[10px] text-gray-300 font-mono">
                  Space
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Seek Backward 5s</span>
                <kbd className="px-1.5 py-0.5 bg-[#22222E] border border-[#333344] rounded text-[10px] text-gray-300 font-mono">
                  ← Left
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Seek Forward 5s</span>
                <kbd className="px-1.5 py-0.5 bg-[#22222E] border border-[#333344] rounded text-[10px] text-gray-300 font-mono">
                  → Right
                </kbd>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              Support & Documentation
            </h4>
            <div className="space-y-1.5">
              <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Getting Started Guide</div>
                  <div className="text-[11px] text-gray-400">How to capture, summarize, and automate meetings</div>
                </div>
                <BookOpen className="w-4 h-4 text-gray-400" />
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Ask Fred Capabilities</div>
                  <div className="text-[11px] text-gray-400">Prompting tips for smart meeting queries</div>
                </div>
                <MessageSquare className="w-4 h-4 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-[#14141C] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#22222E] hover:bg-[#2B2B3A] text-gray-200 text-xs font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
