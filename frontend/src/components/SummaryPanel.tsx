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
    <div className="bg-white dark:bg-gray-800/90 rounded-xl border border-gray-200 dark:border-gray-700/80 shadow-sm h-full flex flex-col overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700/80 bg-gray-50/70 dark:bg-gray-800/50 p-1 gap-1">
        <button 
          onClick={() => setActiveTab('summary')}
          className={`flex-1 py-2 px-2.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'summary' 
              ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-xs' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Summary
        </button>
        <button 
          onClick={() => setActiveTab('outline')}
          className={`flex-1 py-2 px-2.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'outline' 
              ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-xs' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Outline
        </button>
        <button 
          onClick={() => setActiveTab('actions')}
          className={`flex-1 py-2 px-2.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'actions' 
              ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-xs' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <ListChecks className="w-3.5 h-3.5" />
          Tasks ({meeting.action_items?.length || 0})
        </button>
        <button 
          onClick={() => setActiveTab('soundbites')}
          className={`py-2 px-2.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'soundbites' 
              ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-xs' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
          title="Bookmarked soundbites"
        >
          <Bookmark className="w-3.5 h-3.5" />
          Clips ({bookmarkedSegments.length})
        </button>
      </div>
      
      {/* Panel Content */}
      <div className="p-4 flex-1 overflow-y-auto">
        {/* Tab 1: AI Summary */}
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Executive Overview
              </span>
              <button 
                onClick={handleCopySummary}
                className="text-xs text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1 transition-colors"
                title="Copy Summary"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="bg-primary-50/50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/40 rounded-xl p-4">
              <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-normal">
                {meeting.summary || 'No AI summary generated for this meeting yet.'}
              </p>
            </div>

            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Key Takeaways
              </h4>
              <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                  <span>Discussion structured across key agenda milestones and strategic priorities.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                  <span>Cross-functional ownership established with explicit action deliverables.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
        
        {/* Tab 2: Outline & Chapters */}
        {activeTab === 'outline' && (
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Meeting Chapters
            </div>
            {parsedTopics.length > 0 ? (
              <div className="space-y-2">
                {parsedTopics.map((topic, i) => (
                  <div 
                    key={i}
                    onClick={() => onSeek && onSeek(topic.seconds)}
                    className="p-3 bg-gray-50 dark:bg-gray-800/60 hover:bg-primary-50/80 dark:hover:bg-primary-950/40 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-2 group"
                  >
                    <span className="text-xs font-medium text-gray-800 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {topic.text}
                    </span>
                    {topic.rawTime ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-primary-600 dark:text-primary-400 bg-primary-100/70 dark:bg-primary-900/60 px-2 py-0.5 rounded-md font-medium shrink-0">
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
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
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
                    className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 rounded-xl hover:shadow-sm cursor-pointer transition-all space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-amber-900 dark:text-amber-200">
                        {seg.speaker ? seg.speaker.name : 'Speaker'}
                      </span>
                      <span className="font-mono text-[11px] text-amber-700 dark:text-amber-400">
                        {formatTime(seg.start_time)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 dark:text-gray-300 italic">
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
