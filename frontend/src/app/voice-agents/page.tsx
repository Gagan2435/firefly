"use client";
import Navbar from '@/components/Navbar';
import { Mic, PhoneCall, Plus, Play, Sparkles, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VoiceAgentsPage() {
  const agents = [
    {
      name: "Fred Interviewer",
      role: "Candidate Screening & Q&A",
      voice: "Alloy (Warm & Professional)",
      status: "Active",
      calls: 14
    },
    {
      name: "Customer Feedback Agent",
      role: "NPS & Product Feedback Collector",
      voice: "Echo (Friendly & Attentive)",
      status: "Active",
      calls: 29
    },
    {
      name: "Sprint Standup Scribe",
      role: "Daily Standup Bot & Blocker Resolver",
      voice: "Fable (Clear & Concise)",
      status: "Ready",
      calls: 8
    }
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#0E0E12] text-gray-100 select-none pb-12">
      <Navbar />

      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E1E28] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-purple-400" />
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Voice Agents</h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Deploy autonomous AI voice agents to attend, transcribe, and conduct phone or video conversations.
            </p>
          </div>
          <button
            onClick={() => toast.success('Voice agent setup dialog initialized')}
            className="px-3.5 py-2 bg-[#5B45E0] hover:bg-[#6850EB] text-white text-xs font-medium rounded-lg transition-all shadow-md shadow-purple-900/20 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Voice Agent
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {agents.map((ag, i) => (
            <div key={i} className="bg-[#15151D] border border-[#22222E] rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  {ag.status}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{ag.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{ag.role}</p>
              </div>
              <div className="text-[11px] text-gray-400 pt-2 border-t border-white/5 space-y-1">
                <div>Voice: <span className="text-gray-300 font-medium">{ag.voice}</span></div>
                <div>Calls Completed: <span className="text-gray-300 font-medium">{ag.calls}</span></div>
              </div>
              <button
                onClick={() => toast.success(`Simulating voice call with ${ag.name}...`)}
                className="w-full mt-2 py-1.5 bg-[#1F1F2B] hover:bg-[#282837] text-purple-300 text-xs font-medium rounded-lg border border-purple-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Play className="w-3 h-3 fill-purple-300" />
                Test Voice Call
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
