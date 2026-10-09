"use client";
import { MeetingListItem } from '@/lib/types';
import { formatTime, formatDate, getInitials } from '@/lib/utils';
import { Mic, Trash2, Edit2, CheckSquare, Calendar, Clock, ChevronRight, Video } from 'lucide-react';
import Link from 'next/link';
import TagBadge from './TagBadge';

export default function MeetingCard({ 
  meeting, 
  onDelete,
  onEdit,
  onTagClick
}: { 
  meeting: MeetingListItem; 
  onDelete: (id: number) => void;
  onEdit: (meeting: MeetingListItem) => void;
  onTagClick?: (tag: string) => void;
}) {
  const getPlatform = (id: number) => {
    if (id % 3 === 0) return { name: 'Zoom', bg: 'bg-[#10243E] text-[#4D9BFF] border-[#1E3A5F]' };
    if (id % 3 === 1) return { name: 'Google Meet', bg: 'bg-[#102D24] text-[#34D399] border-[#1C4E3D]' };
    return { name: 'MS Teams', bg: 'bg-[#201A38] text-[#A78BFA] border-[#372A60]' };
  };

  const platform = getPlatform(meeting.id);

  return (
    <div className="bg-[#15151D] border border-[#22222E] rounded-xl p-4 sm:p-5 hover:border-[#3A3A4D] hover:shadow-xl hover:shadow-purple-950/10 transition-all duration-200 group flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start gap-4 flex-1 min-w-0">
        {/* Leading Icon in Rounded Square */}
        <div className="w-11 h-11 rounded-xl bg-[#1E1B38] text-[#8165F5] border border-[#2D2852] flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 group-hover:bg-[#252048] transition-all">
          <Mic className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Header Row: Platform Tag + Title */}
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${platform.bg}`}>
              {platform.name}
            </span>
            <Link 
              href={`/meetings/${meeting.id}`} 
              className="text-sm sm:text-base font-semibold text-white hover:text-[#9B87F5] transition-colors truncate max-w-xl"
            >
              {meeting.title}
            </Link>
          </div>

          {/* Subtitle Line: Date • Duration • Tasks */}
          <div className="flex flex-wrap items-center gap-y-1 gap-x-2.5 text-xs text-gray-400 mb-2 font-normal">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-500" />
              {formatDate(meeting.date)}
            </span>
            <span className="text-gray-600">•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              {formatTime(meeting.duration)}
            </span>
            {meeting.action_items_count > 0 && (
              <>
                <span className="text-gray-600">•</span>
                <span className="inline-flex items-center gap-1 text-[#9B87F5] font-medium bg-[#221C38] border border-[#372A5E] px-2 py-0.5 rounded text-[11px]">
                  <CheckSquare className="w-3 h-3" />
                  {meeting.action_items_count} {meeting.action_items_count === 1 ? 'task' : 'tasks'}
                </span>
              </>
            )}
          </div>

          {/* Summary Excerpt Quote */}
          {meeting.summary && (
            <p className="text-xs text-gray-400 line-clamp-1 mb-2.5 leading-relaxed italic border-l-2 border-[#2F2F40] pl-2">
              "{meeting.summary}"
            </p>
          )}
        
          {/* Attendees & Tags */}
          <div className="flex flex-wrap items-center gap-3">
            {meeting.participants && meeting.participants.length > 0 && (
              <div className="flex -space-x-1.5 overflow-hidden py-0.5">
                {meeting.participants.map((p, i) => (
                  <div 
                    key={p.id || i} 
                    className="w-6 h-6 rounded-full bg-[#252536] text-[#A78BFA] border border-[#323247] flex items-center justify-center text-[10px] font-bold shadow-sm"
                    title={p.name}
                  >
                    {getInitials(p.name)}
                  </div>
                ))}
              </div>
            )}
            
            {meeting.tags && meeting.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 items-center">
                {meeting.tags.map(t => (
                  <TagBadge 
                    key={t.id} 
                    tag={t} 
                    onClick={() => onTagClick && onTagClick(t.name)} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Right Action Group: Open Notepad ➔, Edit, Delete */}
      <div className="flex items-center justify-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#22222E]">
        <Link
          href={`/meetings/${meeting.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#A78BFA] hover:text-white bg-[#221A38] hover:bg-[#5B45E0] border border-[#3A2A5E] rounded-lg transition-all shadow-sm"
        >
          <span>Open Notepad</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
        <button 
          onClick={(e) => { e.preventDefault(); onEdit(meeting); }}
          title="Edit meeting"
          className="p-1.5 text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button 
          onClick={(e) => { e.preventDefault(); onDelete(meeting.id); }}
          title="Delete meeting"
          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
