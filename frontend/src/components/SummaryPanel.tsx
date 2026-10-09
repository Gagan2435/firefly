"use client";
import { useState } from 'react';
import { MeetingDetail } from '@/lib/types';
import ActionItemList from './ActionItemList';
import { Sparkles, ListChecks, Layers, Bookmark, Copy, Check, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatTime } from '@/lib/utils';

export default function SummaryPanel({ 
  meeting,
  onSeek
}: { 
  meeting: MeetingDetail;
  onSeek?: (time: number) => void;
}) {
  const [activeTab, setActiveTab] = useState<'summary' | 'outline' | 'actions' | 'soundbites'>('summary');
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    const textToCopy = `MEETING SUMMARY: ${meeting.title}\n\n${meeting.summary}\n\nKEY TOPICS:\n${meeting.key_topics}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success('Summary copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  // Extract chapters / key topics with clickable timestamps
  const parsedTopics = (meeting.key_topics || '').split('\n').filter(Boolean).map((line) => {
    const tsMatch = line.match(/\[(\d{1,2}):(\d{2})\]/);
    let seconds = 0;
    if (tsMatch) {
      seconds = parseInt(tsMatch[1], 10) * 60 + parseInt(tsMatch[2], 10);
    }
    return {
      text: line.replace(/\[\d{1,2}:\d{2}\]/, '').trim(),
      rawTime: tsMatch ? tsMatch[0] : null,
      seconds,
    };
  });

  const bookmarkedSegments = meeting.transcript_segments?.filter((s) => s.is_bookmarked) || [];

  return (
    <div className="bg-[#15151D] rounded-xl border border-[#22222E] shadow-sm h-full flex flex-col overflow-hidden text-gray-100">
      {/* Tab Navigation */}
      <div className="flex border-b border-[#22222E] bg-[#121218] p-1 gap-1">
        <button 
          onClick={() => setActiveTab('summary')}
          className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'summary' 
              ? 'bg-[#252535] text-white shadow-sm' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          Summary
        </button>
        <button 
          onClick={() => setActiveTab('outline')}
          className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'outline' 
              ? 'bg-[#252535] text-white shadow-sm' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          Outline
        </button>
        <button 
          onClick={() => setActiveTab('actions')}
          className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'actions' 
              ? 'bg-[#252535] text-white shadow-sm' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <ListChecks className="w-3.5 h-3.5 text-emerald-400" />
          Tasks ({meeting.action_items?.length || 0})
        </button>
        <button 
          onClick={() => setActiveTab('soundbites')}
          className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'soundbites' 
              ? 'bg-[#252535] text-white shadow-sm' 
              : 'text-gray-400 hover:text-white'
          }`}
          title="Bookmarked soundbites"
        >
          <Bookmark className="w-3.5 h-3.5 text-amber-400" />
          Clips ({bookmarkedSegments.length})
        </button>
      </div>
      
      {/* Panel Content */}
      <div className="p-4 flex-1 overflow-y-auto">
        {/* Tab 1: AI Summary */}
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Executive Overview
              </span>
              <button 
                onClick={handleCopySummary}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                title="Copy Summary"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="bg-[#1C1A2E]/60 border border-purple-900/40 rounded-xl p-4">
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-normal">
                {meeting.summary || 'No AI summary generated for this meeting yet.'}
              </p>
            </div>

            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Key Takeaways
              </h4>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                  <span>Discussion structured across key agenda milestones and strategic priorities.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                  <span>Cross-functional ownership established with explicit action deliverables.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
        
        {/* Tab 2: Outline & Chapters */}
        {activeTab === 'outline' && (
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Meeting Chapters
            </div>
            {parsedTopics.length > 0 ? (
              <div className="space-y-2">
                {parsedTopics.map((topic, i) => (
                  <div 
                    key={i}
                    onClick={() => onSeek && onSeek(topic.seconds)}
                    className="p-3 bg-[#1A1A24] hover:bg-[#252538] border border-[#2B2B3C] rounded-xl cursor-pointer transition-all flex items-center justify-between gap-2 group"
                  >
                    <span className="text-xs font-medium text-gray-200 group-hover:text-purple-300 transition-colors">
                      {topic.text}
                    </span>
                    {topic.rawTime ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-purple-300 bg-purple-950/60 border border-purple-800/50 px-2 py-0.5 rounded-md font-medium shrink-0">
                        <Play className="w-2.5 h-2.5 fill-current" />
                        {topic.rawTime.replace(/[\[\]]/g, '')}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No outline chapters detected.</p>
            )}
          </div>
        )}
        
        {/* Tab 3: Action Items */}
        {activeTab === 'actions' && (
          <ActionItemList meetingId={meeting.id} items={meeting.action_items || []} />
        )}

        {/* Tab 4: Soundbites */}
        {activeTab === 'soundbites' && (
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Clipped Soundbites & Quotes
            </div>
            {bookmarkedSegments.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs">
                No soundbites clipped yet. Click the bookmark icon on any transcript line to save it here!
              </div>
            ) : (
              <div className="space-y-2">
                {bookmarkedSegments.map((seg) => (
                  <div
                    key={seg.id}
                    onClick={() => onSeek && onSeek(seg.start_time)}
                    className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl hover:shadow-sm cursor-pointer transition-all space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-amber-300">
                        {seg.speaker ? seg.speaker.name : 'Speaker'}
                      </span>
                      <span className="font-mono text-[11px] text-amber-400">
                        {formatTime(seg.start_time)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 italic">
                      "{seg.text}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
