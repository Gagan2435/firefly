"use client";
import { MeetingListItem } from '@/lib/types';
import { formatTime, formatDate, getInitials } from '@/lib/utils';
import { Mic, Trash2, Edit2, CheckSquare, Calendar, Clock, ChevronRight } from 'lucide-react';
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
  return (
    <div className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/80 rounded-xl p-5 hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-200 group flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
          <Mic className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Link 
              href={`/meetings/${meeting.id}`} 
              className="text-base font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors truncate max-w-md"
            >
              {meeting.title}
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-gray-500 dark:text-gray-400 mb-2.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              {formatDate(meeting.date)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              {formatTime(meeting.duration)}
            </span>
            {meeting.action_items_count > 0 && (
              <>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 font-medium bg-primary-50 dark:bg-primary-950/60 px-2 py-0.5 rounded-full text-[11px]">
                  <CheckSquare className="w-3 h-3" />
                  {meeting.action_items_count} {meeting.action_items_count === 1 ? 'task' : 'tasks'}
                </span>
              </>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {meeting.participants && meeting.participants.length > 0 && (
              <div className="flex -space-x-2 overflow-hidden py-0.5">
                {meeting.participants.map((p, i) => (
                  <div 
                    key={p.id || i} 
                    className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[10px] font-bold shadow-sm"
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
      
      <div className="flex items-center justify-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-700/50">
        <Link
          href={`/meetings/${meeting.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors"
        >
          View Details
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
        <button 
          onClick={(e) => { e.preventDefault(); onEdit(meeting); }}
          title="Edit meeting"
          className="p-1.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button 
          onClick={(e) => { e.preventDefault(); onDelete(meeting.id); }}
          title="Delete meeting"
          className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
