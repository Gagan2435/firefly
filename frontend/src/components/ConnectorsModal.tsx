"use client";
import { useState } from 'react';
import { X, Check, ExternalLink, Zap, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

interface ConnectorApp {
  id: string;
  name: string;
  description: string;
  iconBg: string;
  iconLetter: string;
  connected: boolean;
  comingSoon?: boolean;
}

export default function ConnectorsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [connectors, setConnectors] = useState<ConnectorApp[]>([
    {
      id: 'gmail',
      name: 'Gmail',
      description: 'Search email threads and auto-send meeting recaps directly from Fred.',
      iconBg: 'bg-rose-500/20 text-rose-400',
      iconLetter: 'M',
      connected: true,
    },
    {
      id: 'gdocs',
      name: 'Google Docs',
      description: 'Allow Fred to reference meeting briefs and project specs in Docs.',
      iconBg: 'bg-blue-500/20 text-blue-400',
      iconLetter: 'D',
      connected: false,
    },
    {
      id: 'gdrive',
      name: 'Google Drive',
      description: 'Search presentations, slides, and shared files during meetings.',
      iconBg: 'bg-amber-500/20 text-amber-400',
      iconLetter: 'Δ',
      connected: false,
    },
    {
      id: 'gsheets',
      name: 'Google Sheets',
      description: 'Export structured data, action items, and financial metrics directly into Sheets.',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
      iconLetter: 'S',
      connected: false,
    },
    {
      id: 'asana',
      name: 'Asana',
      description: 'Convert meeting action items into Asana tasks automatically.',
      iconBg: 'bg-pink-500/20 text-pink-400',
      iconLetter: 'A',
      connected: false,
    },
    {
      id: 'clickup',
      name: 'ClickUp',
      description: 'Push extracted tasks and milestones into your ClickUp spaces.',
      iconBg: 'bg-purple-500/20 text-purple-400',
      iconLetter: 'C',
      connected: false,
    },
    {
      id: 'notion',
      name: 'Notion',
      description: 'Sync notes, chapters, and meeting transcripts to Notion databases.',
      iconBg: 'bg-slate-700 text-white',
      iconLetter: 'N',
      connected: true,
    },
    {
      id: 'jira',
      name: 'Jira Software',
      description: 'Create Jira sprint tickets from discussed technical blockers.',
      iconBg: 'bg-blue-600/20 text-blue-400',
      iconLetter: 'J',
      connected: false,
      comingSoon: true,
    },
  ]);

  if (!isOpen) return null;

  const toggleConnect = (id: string, name: string) => {
    setConnectors(prev =>
      prev.map(c => {
        if (c.id === id) {
          const nextState = !c.connected;
          if (nextState) {
            toast.success(`Connected ${name} successfully! Fred can now query its contents.`);
          } else {
            toast.success(`Disconnected ${name}`);
          }
          return { ...c, connected: nextState };
        }
        return c;
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-gray-100 select-none">
      <div className="bg-[#161622] border border-[#2B2B3C] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/5 flex items-center justify-between bg-[#1A1A28]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">AskFred Connectors</h3>
              <p className="text-[11px] text-gray-400">Connect your tools to give Fred full context across your workspace.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {connectors.map((c) => (
              <div
                key={c.id}
                className="p-3.5 bg-[#1B1B27] border border-[#262638] rounded-xl flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${c.iconBg}`}>
                    {c.iconLetter}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{c.name}</span>
                      {c.comingSoon && (
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                      {c.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  {c.connected ? (
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                      <Check className="w-3 h-3" /> Connected
                    </span>
                  ) : (
                    <span className="text-[11px] text-gray-500">Not connected</span>
                  )}

                  <button
                    onClick={() => {
                      if (c.comingSoon) {
                        toast('Coming soon in the next release!', { icon: '⏳' });
                      } else {
                        toggleConnect(c.id, c.name);
                      }
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      c.connected
                        ? 'bg-[#222230] hover:bg-rose-950/40 text-gray-300 hover:text-rose-400 border border-white/5'
                        : 'bg-[#5B45E0] hover:bg-[#6850EB] text-white shadow-xs'
                    }`}
                  >
                    {c.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-[#13131C] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#20202C] hover:bg-[#282838] text-gray-300 text-xs font-medium rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
