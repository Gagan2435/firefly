"use client";
import Navbar from '@/components/Navbar';
import { BarChart2, TrendingUp, Users, Clock, Award, Smile, Sparkles } from 'lucide-react';

export default function AnalyticsPage() {
  const speakers = [
    { name: "Alex Chen", time: "42%", fill: "bg-purple-500", wordsPerMin: 142 },
    { name: "Sarah Lin", time: "28%", fill: "bg-indigo-500", wordsPerMin: 135 },
    { name: "David Kim", time: "18%", fill: "bg-cyan-500", wordsPerMin: 128 },
    { name: "Marcus Brody", time: "12%", fill: "bg-emerald-500", wordsPerMin: 150 },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#0E0E12] text-gray-100 select-none pb-12">
      <Navbar />

      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <div className="border-b border-[#1E1E28] pb-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Conversation Analytics</h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Data insights, talk-time ratios, sentiments, and participant engagement across meetings.
          </p>
        </div>

        {/* 4 Overview Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#15151D] border border-[#22222E] rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>Avg Talk Ratio</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-bold text-white">58% / 42%</div>
            <div className="text-[11px] text-emerald-400 mt-1 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Balanced conversation
            </div>
          </div>

          <div className="bg-[#15151D] border border-[#22222E] rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>Meeting Sentiment</span>
              <Smile className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-white">88% Positive</div>
            <div className="text-[11px] text-gray-400 mt-1">Based on 5 transcripts</div>
          </div>

          <div className="bg-[#15151D] border border-[#22222E] rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>Action Item Rate</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-white">3.6 per call</div>
            <div className="text-[11px] text-emerald-400 mt-1 font-medium">+18% follow-through</div>
          </div>

          <div className="bg-[#15151D] border border-[#22222E] rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>Time Saved</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl font-bold text-white">4.8 Hours</div>
            <div className="text-[11px] text-gray-400 mt-1">Automated notes & summaries</div>
          </div>
        </div>

        {/* Talk-time Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#15151D] border border-[#22222E] rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider">
              Speaker Talk Time Distribution
            </h3>
            <div className="space-y-3">
              {speakers.map((s, i) => (
                <div key={i} className="space-y-1 text-xs">
                  <div className="flex justify-between text-gray-300">
                    <span className="font-medium">{s.name}</span>
                    <span className="font-mono text-gray-400">{s.time} ({s.wordsPerMin} wpm)</span>
                  </div>
                  <div className="w-full bg-[#20202E] rounded-full h-2 overflow-hidden">
                    <div className={`${s.fill} h-full rounded-full`} style={{ width: s.time }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#15151D] border border-[#22222E] rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider">
              Sentiment Distribution
            </h3>
            <div className="space-y-3">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-300">
                  <span className="font-medium text-emerald-400">Positive & Constructive</span>
                  <span className="font-mono text-gray-400">72%</span>
                </div>
                <div className="w-full bg-[#20202E] rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '72%' }} />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-300">
                  <span className="font-medium text-gray-300">Neutral & Fact-based</span>
                  <span className="font-mono text-gray-400">22%</span>
                </div>
                <div className="w-full bg-[#20202E] rounded-full h-2 overflow-hidden">
                  <div className="bg-gray-400 h-full rounded-full" style={{ width: '22%' }} />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-300">
                  <span className="font-medium text-amber-400">Blockers & Risks Raised</span>
                  <span className="font-mono text-gray-400">6%</span>
                </div>
                <div className="w-full bg-[#20202E] rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '6%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
