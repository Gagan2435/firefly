"use client";
import Navbar from '@/components/Navbar';
import { Puzzle, CheckCircle2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const INTEGRATIONS = [
  { name: 'Zoom', description: 'Automatically join Zoom cloud meetings and capture video/audio', connected: true, category: 'Video Conferencing' },
  { name: 'Google Meet', description: 'Connect Google Calendar and dispatch Fred to Google Meet links', connected: true, category: 'Video Conferencing' },
  { name: 'Microsoft Teams', description: 'Sync Teams organization meetings with tenant security', connected: false, category: 'Video Conferencing' },
  { name: 'Slack', description: 'Post AI summaries and action item digests into project channels', connected: true, category: 'Collaboration' },
  { name: 'Notion', description: 'Automatically sync meeting notes into your team Notion databases', connected: false, category: 'Productivity' },
  { name: 'Salesforce', description: 'Log client call notes and pipeline commitments against CRM accounts', connected: false, category: 'CRM' },
  { name: 'HubSpot', description: 'Auto-associate meeting transcripts with contact & deal timelines', connected: false, category: 'CRM' },
  { name: 'Zapier', description: 'Connect Fireflies triggers to 5,000+ business workflow tools', connected: false, category: 'Automation' },
];

export default function IntegrationsPage() {
  const handleConnect = (name: string) => {
    toast.success(`${name} integration setup simulated!`);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#0E0E12] text-gray-100 select-none">
      <Navbar />

      <div className="flex-1 overflow-y-auto p-6 md:p-8 max-w-5xl w-full mx-auto space-y-6">
        <div className="border-b border-[#1E1E28] pb-4">
          <div className="flex items-center gap-2">
            <Puzzle className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              App Integrations
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Connect your video conferencing, CRM, and workflow tools to automate meeting intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INTEGRATIONS.map((app) => (
            <div
              key={app.name}
              className="bg-[#15151D] p-5 rounded-2xl border border-[#22222E] shadow-sm flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-sm font-bold text-white">{app.name}</h3>
                  {app.connected ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-[#20202A] px-2 py-0.5 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium text-purple-400">{app.category}</span>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  {app.description}
                </p>
              </div>

              <button
                onClick={() => handleConnect(app.name)}
                className={`w-full py-2 px-3 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  app.connected
                    ? 'bg-[#1C1C26] text-gray-300 hover:text-white border border-white/5'
                    : 'bg-[#5B45E0] hover:bg-[#6850EB] text-white shadow-md shadow-purple-900/20'
                }`}
              >
                <span>{app.connected ? 'Manage Settings' : 'Connect'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
