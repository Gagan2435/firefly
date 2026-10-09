"use client";
import Navbar from '@/components/Navbar';
import { Sparkles, Check, Zap, MessageSquare, FileText, Bot, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AISkillsPage() {
  const skills = [
    {
      title: "Action Item Extractor",
      desc: "Automatically detects action items, due dates, and assigns them to participants based on speech context.",
      icon: Check,
      status: "Enabled",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      title: "Executive Summarizer",
      desc: "Generates a high-level briefing with bulleted key takeaways, blockers, and outcome resolutions.",
      icon: FileText,
      status: "Enabled",
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20"
    },
    {
      title: "Sales Objections & Questions",
      desc: "Extracts customer objections, competitor mentions, and pricing inquiries with sentiment analysis.",
      icon: Zap,
      status: "Enabled",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20"
    },
    {
      title: "Automated Recap Email",
      desc: "Drafts a polished, ready-to-send follow-up email to all meeting participants within 2 minutes of meeting end.",
      icon: MessageSquare,
      status: "Enabled",
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
    },
    {
      title: "Sentiment & Tone Analyzer",
      desc: "Monitors positive, neutral, and critical sentiment across speakers and detects friction points.",
      icon: Sparkles,
      status: "Enabled",
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20"
    },
    {
      title: "Custom Prompt Co-Pilot",
      desc: "Create bespoke prompts tailored to your team's specific meeting workflows and templates.",
      icon: Bot,
      status: "Customizable",
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
    }
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#0E0E12] text-gray-100 select-none pb-12">
      <Navbar />

      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E1E28] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">AI Skills</h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Configure and unlock automated AI intelligence workflows executed on every meeting.
            </p>
          </div>
          <button 
            onClick={() => toast.success('New custom AI skill template created')}
            className="px-3.5 py-2 bg-[#5B45E0] hover:bg-[#6850EB] text-white text-xs font-medium rounded-lg transition-all shadow-md shadow-purple-900/20"
          >
            + Create Custom Skill
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((s, idx) => (
            <div
              key={idx}
              className="bg-[#15151D] border border-[#22222E] hover:border-purple-500/40 rounded-xl p-5 space-y-3 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg border ${s.color}`}>
                    <s.icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-full">
                    {s.status}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white">{s.title}</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{s.desc}</p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-gray-500">Auto-runs on transcripts</span>
                <button
                  onClick={() => toast.success(`${s.title} settings saved`)}
                  className="text-purple-400 hover:text-purple-300 font-medium inline-flex items-center gap-1"
                >
                  Configure
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
