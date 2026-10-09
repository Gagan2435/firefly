"use client";
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Settings, Shield, Bell, Bot, Save, Key, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [botName, setBotName] = useState('Fireflies.ai Notetaker');
  const [language, setLanguage] = useState('en');
  const [autoJoin, setAutoJoin] = useState(true);
  const [emailRecap, setEmailRecap] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Workspace preferences saved');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#0E0E12] text-gray-100 select-none">
      <Navbar />

      <div className="flex-1 overflow-y-auto p-6 md:p-8 max-w-4xl w-full mx-auto space-y-6">
        <div className="border-b border-[#1E1E28] pb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Workspace Settings
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Configure meeting capture rules, transcription language, and AI notetaker preferences.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Bot Profile */}
          <div className="bg-[#15151D] p-6 rounded-2xl border border-[#22222E] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-400" />
              Notetaker Bot Preferences
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Bot Name
                </label>
                <input
                  type="text"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 bg-[#1A1A24] border border-[#2B2B3C] focus:border-purple-500 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Transcription Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 bg-[#1A1A24] border border-[#2B2B3C] focus:border-purple-500 rounded-xl text-gray-200 focus:outline-none cursor-pointer"
                >
                  <option value="en">English (US/UK)</option>
                  <option value="es">Spanish (Español)</option>
                  <option value="fr">French (Français)</option>
                  <option value="de">German (Deutsch)</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoJoin}
                  onChange={(e) => setAutoJoin(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 bg-[#1A1A24] border-gray-600 focus:ring-purple-500"
                />
                <div>
                  <span className="text-xs font-semibold text-white block">
                    Automatically join calendar meetings
                  </span>
                  <span className="text-[11px] text-gray-400">
                    Fred will join any meeting on your calendar containing Zoom, Meet, or Teams links
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailRecap}
                  onChange={(e) => setEmailRecap(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 bg-[#1A1A24] border-gray-600 focus:ring-purple-500"
                />
                <div>
                  <span className="text-xs font-semibold text-white block">
                    Email meeting recap notes automatically
                  </span>
                  <span className="text-[11px] text-gray-400">
                    Send full AI summary and action items to all participants post-meeting
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-[#15151D] p-6 rounded-2xl border border-[#22222E] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              Compliance & Data Privacy
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Fireflies complies with SOC 2 Type II, GDPR, and HIPAA data standards. Audio and transcript data is encrypted at rest and in transit.
            </p>
            <div className="flex items-center gap-3 text-xs text-emerald-400">
              <span className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                ✓ 256-bit TLS Encryption
              </span>
              <span className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                ✓ HIPAA Ready
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-[#5B45E0] hover:bg-[#6850EB] text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-900/20 transition-all flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
