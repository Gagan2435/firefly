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
    <div className="flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="flex-1 overflow-y-auto p-6 md:p-8 max-w-5xl w-full mx-auto space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 rounded-full text-xs font-semibold mb-2">
            <Puzzle className="w-3.5 h-3.5" /> Integrations Hub
          </div>
          <h1 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
            App Integrations
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Connect your video conferencing, CRM, and workflow tools to automate meeting intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INTEGRATIONS.map((app) => (
            <div
              key={app.name}
              className="bg-white dark:bg-gray-800/90 p-5 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{app.name}</h3>
                  {app.connected ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium text-primary-600 dark:text-primary-400">{app.category}</span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                  {app.description}
                </p>
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-700/50 flex justify-end">
                <button
                  onClick={() => handleConnect(app.name)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                    app.connected
                      ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      : 'bg-primary-600 hover:bg-primary-700 text-white shadow-xs'
                  }`}
                >
                  {app.connected ? 'Configure' : 'Connect'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
