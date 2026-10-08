"use client";
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Settings, Shield, Bell, Bot, Save } from 'lucide-react';
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
    <div className="flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="flex-1 overflow-y-auto p-6 md:p-8 max-w-4xl w-full mx-auto space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 rounded-full text-xs font-semibold mb-2">
            <Settings className="w-3.5 h-3.5" /> Workspace Config
          </div>
          <h1 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
            Workspace Settings
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure meeting capture rules, transcription language, and AI notetaker preferences.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Bot Profile */}
          <div className="bg-white dark:bg-gray-800/90 p-6 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary-500" />
              Notetaker Bot Preferences
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Bot Name
                </label>
                <input
                  type="text"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Transcription Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-200"
                >
                  <option value="en">English (US/UK)</option>
                  <option value="es">Spanish (Español)</option>
                  <option value="fr">French (Français)</option>
                  <option value="de">German (Deutsch)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoJoin}
                  onChange={(e) => setAutoJoin(e.target.checked)}
                  className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                />
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  Automatically join calendar meetings that have a video link
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailRecap}
                  onChange={(e) => setEmailRecap(e.target.checked)}
                  className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                />
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  Send email digest to attendees with AI summary and action items post-meeting
                </span>
              </label>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-white dark:bg-gray-800/90 p-6 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              Privacy & Retention
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              In this environment, all meetings, audio tracks, and transcripts are stored securely in your local SQLite instance with zero third-party telemetry.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
