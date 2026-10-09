"use client";
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';

export default function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="w-full bg-[#241735] border-b border-[#3D2660]/50 text-xs px-4 py-2 flex items-center justify-center gap-2 relative z-30 shrink-0 text-gray-200">
      <span>You are eligible for 7 days business plan free trial.</span>
      <Link
        href="/upgrade"
        className="text-[#A78BFA] hover:text-[#C4B5FD] font-medium inline-flex items-center gap-1 transition-colors group"
      >
        <span>Start free trial</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 p-1 text-gray-400 hover:text-white rounded transition-colors"
        title="Dismiss announcement"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
