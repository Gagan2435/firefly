"use client";
import { useState } from 'react';
import { 
  Sparkles, 
  CheckSquare, 
  HelpCircle, 
  Calendar, 
  BarChart2, 
  Smile, 
  ChevronLeft, 
  ChevronRight,
  Filter
} from 'lucide-react';

export type SmartFilterType = 'all' | 'action_items' | 'questions' | 'metrics' | 'dates' | 'sentiment_positive';

export default function SmartSearchPanel({
  activeFilter,
  onSelectFilter,
  isCollapsed,
  onToggleCollapse,
  counts,
}: {
  activeFilter: SmartFilterType;
  onSelectFilter: (filter: SmartFilterType) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  counts: {
    action_items: number;
    questions: number;
    metrics: number;
    dates: number;
    sentiment_positive: number;
  };
}) {
  const filters: { id: SmartFilterType; label: string; icon: any; count: number; color: string }[] = [
    { id: 'all', label: 'All Transcript', icon: Filter, count: 0, color: 'text-gray-500' },
    { id: 'action_items', label: 'Action Items', icon: CheckSquare, count: counts.action_items, color: 'text-indigo-500' },
    { id: 'questions', label: 'Questions Asked', icon: HelpCircle, count: counts.questions, color: 'text-amber-500' },
    { id: 'metrics', label: 'Metrics & Data', icon: BarChart2, count: counts.metrics, color: 'text-emerald-500' },
    { id: 'dates', label: 'Dates & Deadlines', icon: Calendar, count: counts.dates, color: 'text-blue-500' },
    { id: 'sentiment_positive', label: 'Positive Sentiment', icon: Smile, count: counts.sentiment_positive, color: 'text-rose-500' },
  ];

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white dark:bg-gray-800/90 border-r border-gray-200 dark:border-gray-700/80 p-2 flex flex-col items-center justify-between shrink-0 transition-all">
        <div className="space-y-3 pt-1">
          <button
            onClick={onToggleCollapse}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 rounded-lg transition-colors"
            title="Expand Smart Search"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          {filters.slice(1).map((f) => (
            <button
              key={f.id}
              onClick={() => {
                onToggleCollapse();
                onSelectFilter(f.id);
              }}
              className={`p-2 rounded-xl transition-all relative ${
                activeFilter === f.id
                  ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-600'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title={f.label}
            >
              <f.icon className="w-4 h-4" />
              {f.count > 0 && (
                <span className="w-2 h-2 rounded-full bg-primary-500 absolute top-1 right-1" />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-60 bg-white dark:bg-gray-800/90 border-r border-gray-200 dark:border-gray-700/80 p-4 flex flex-col justify-between shrink-0 transition-all overflow-y-auto">
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-700/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              Smart Search
            </h3>
          </div>
          <button
            onClick={onToggleCollapse}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            title="Collapse Smart Search"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 block mb-2 px-1">
            AI Filters
          </span>
          <div className="space-y-1">
            {filters.map((f) => {
              const isActive = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => onSelectFilter(f.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-xs font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <f.icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : f.color}`} />
                    <span className="truncate">{f.label}</span>
                  </div>
                  {f.id !== 'all' && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {f.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {activeFilter !== 'all' && (
          <div className="p-2.5 bg-primary-50/60 dark:bg-primary-950/40 rounded-xl border border-primary-100 dark:border-primary-900/40 text-[11px] text-primary-800 dark:text-primary-300">
            Filtering transcript by <strong>{filters.find((f) => f.id === activeFilter)?.label}</strong>.
            <button
              onClick={() => onSelectFilter('all')}
              className="block mt-1 font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              Reset to full transcript
            </button>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-gray-100 dark:border-gray-700/60 text-[10px] text-gray-400 text-center">
        Powered by Fireflies AI NLP
      </div>
    </div>
  );
}
