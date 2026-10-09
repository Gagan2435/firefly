"use client";
import Navbar from '@/components/Navbar';
import { Zap, Check, Sparkles, Shield, Rocket, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UpgradePage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      desc: "Basic meeting capture & transcription",
      features: [
        "Up to 3 meetings per month",
        "Limited transcription storage",
        "Basic summary bullet points",
        "Export to text"
      ],
      current: false,
      cta: "Current Plan"
    },
    {
      name: "Business (Recommended)",
      badge: "40% OFF Special Offer",
      price: "$19",
      originalPrice: "$32",
      period: "per user / month",
      desc: "Full automated intelligence & unlimited transcripts",
      features: [
        "Unlimited transcription & storage",
        "Automated AI Action Items extraction",
        "Ask Fred AI co-pilot queries",
        "Smart Search & Sentiment filters",
        "Team workspace & shared channels",
        "Priority transcription speed",
        "CRM & Slack integrations"
      ],
      current: true,
      highlight: true,
      cta: "Claim 7-Day Free Trial"
    },
    {
      name: "Enterprise",
      price: "$39",
      period: "per user / month",
      desc: "Advanced security, custom AI models & dedicated support",
      features: [
        "Everything in Business",
        "Custom vocabulary & AI models",
        "HIPAA & SOC 2 compliance",
        "Dedicated Customer Success Manager",
        "SAML SSO & Audit logs"
      ],
      current: false,
      cta: "Contact Enterprise Sales"
    }
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#0E0E12] text-gray-100 select-none pb-12">
      <Navbar />

      <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto w-full">
        {/* Banner Promo */}
        <div className="text-center max-w-2xl mx-auto space-y-3 pt-4">
          <div className="inline-flex items-center gap-1.5 bg-[#251838] border border-purple-500/30 text-purple-300 px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Limited Offer: Save 40% on Business Annual Plan
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Supercharge Your Meeting Productivity
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Never take notes manually again. Get automated transcriptions, AI summaries, and team intelligence.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-6 flex flex-col justify-between transition-all ${
                p.highlight
                  ? 'bg-gradient-to-b from-[#1C162E] to-[#141220] border-2 border-[#5B45E0] shadow-2xl shadow-purple-900/20 relative'
                  : 'bg-[#15151D] border border-[#22222E]'
              }`}
            >
              {p.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5B45E0] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
                  {p.badge}
                </div>
              )}

              <div>
                <h3 className="text-base font-bold text-white">{p.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{p.desc}</p>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white">{p.price}</span>
                  {p.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">{p.originalPrice}</span>
                  )}
                  <span className="text-xs text-gray-400">{p.period}</span>
                </div>

                <div className="my-5 border-t border-white/5" />

                <div className="space-y-2.5">
                  <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider block">
                    What's included:
                  </span>
                  {p.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                      <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => toast.success(`Activated ${p.name} tier!`)}
                className={`mt-6 w-full py-2.5 rounded-xl font-medium text-xs transition-all ${
                  p.highlight
                    ? 'bg-[#5B45E0] hover:bg-[#6850EB] text-white shadow-lg shadow-purple-900/30'
                    : 'bg-[#20202C] hover:bg-[#2A2A3A] text-gray-200'
                }`}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
