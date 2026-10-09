"use client";
import { useState } from 'react';
import { X, Play, CheckCircle2, Sparkles, Bot, Video, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PocketGuideModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: "1. Capture Any Conversation",
      desc: "Connect your calendar or invite Fred to your Zoom, Google Meet, or Microsoft Teams calls. You can also upload existing audio/video/text transcripts.",
      icon: Video,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20"
    },
    {
      title: "2. Real-Time & Post-Meeting Transcripts",
      desc: "Get 98%+ accurate interactive transcripts with speaker diarization, clickable timestamps, and instant audio-sync seeking.",
      icon: FileText,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      title: "3. Automated AI Summaries & Action Items",
      desc: "Fireflies extracts executive summaries, categorized action items with assignees, and structured chapter outlines automatically.",
      icon: Sparkles,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20"
    },
    {
      title: "4. Ask Fred Anything",
      desc: "Your AI meeting co-pilot answers questions about what was discussed, drafts follow-up emails, and analyzes meeting sentiment.",
      icon: Bot,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#16161F] border border-[#2B2B3C] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden text-gray-100 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#191924]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-purple-600/30 text-purple-400 border border-purple-500/30 flex items-center justify-center text-xs">
              ✦
            </div>
            <h3 className="text-sm font-semibold text-white">Fireflies 101 Pocket Guide</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Simulation Area */}
        <div className="relative aspect-video bg-[#0E0E14] border-b border-[#252535] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 via-transparent to-indigo-900/20 pointer-events-none" />
          
          <div className="text-center p-6 max-w-md z-10">
            <div className="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-900/40 cursor-pointer hover:scale-105 transition-transform">
              <Play className="w-6 h-6 fill-white ml-1" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">
              Mastering Fireflies in Under 3 Minutes
            </h4>
            <p className="text-xs text-gray-400">
              Learn how to transcribe, generate AI action items, and collaborate on meeting notes.
            </p>
          </div>

          <div className="absolute bottom-3 left-3 bg-[#191924]/90 border border-white/10 px-2.5 py-1 rounded-md text-[11px] text-gray-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Fireflies Productivity Suite
          </div>
        </div>

        {/* Step-by-Step Overview */}
        <div className="p-5 space-y-3">
          <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            Key Post-Meeting Workflows
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {steps.map((st, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all flex items-start gap-3"
              >
                <div className={`p-1.5 rounded-lg border ${st.color} shrink-0`}>
                  <st.icon className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-white">{st.title}</h5>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-[#14141C] flex items-center justify-between">
          <span className="text-xs text-gray-400">Ready to explore your meetings?</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#5B45E0] hover:bg-[#6850EB] text-white text-xs font-medium rounded-lg shadow-md shadow-purple-900/20 transition-all"
          >
            Got it, Let's Start
          </button>
        </div>
      </div>
    </div>
  );
}
