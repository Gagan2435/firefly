"use client";
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { TaskItem } from '@/lib/types';
import Navbar from '@/components/Navbar';
import { CheckSquare, Calendar, User, ExternalLink, Check, Filter } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.getAllTasks();
      setTasks(res);
    } catch {
      toast.error('Failed to load action items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const toggleComplete = async (task: TaskItem) => {
    try {
      const updated = await api.updateActionItem(task.id, {
        text: task.text,
        assignee: task.assignee,
        due_date: task.due_date,
        completed: !task.completed,
      });
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: updated.completed } : t))
      );
      toast.success(updated.completed ? 'Task completed' : 'Task marked pending');
    } catch {
      toast.error('Failed to update action item');
    }
  };

  const uniqueAssignees = Array.from(
    new Set(tasks.map((t) => t.assignee).filter(Boolean) as string[])
  );

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending' && t.completed) return false;
    if (filter === 'completed' && !t.completed) return false;
    if (assigneeFilter !== 'all' && t.assignee !== assigneeFilter) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Navbar onMeetingCreated={fetchTasks} />

      <div className="flex-1 overflow-y-auto p-6 md:p-8 max-w-5xl w-full mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
              Action Items & Tasks
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage and track tasks extracted across all meeting transcripts
            </p>
          </div>

          {/* Filter switches */}
          <div className="flex items-center gap-2">
            <div className="flex p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  filter === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                }`}
              >
                All ({tasks.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  filter === 'pending'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                }`}
              >
                Pending ({tasks.filter((t) => !t.completed).length})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  filter === 'completed'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                }`}
              >
                Completed ({tasks.filter((t) => t.completed).length})
              </button>
            </div>

            {uniqueAssignees.length > 0 && (
              <select
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
                className="text-xs px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Assignees</option>
                {uniqueAssignees.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Task list */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 animate-pulse h-16" />
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-2">
            <CheckSquare className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">No tasks found</h3>
            <p className="text-xs text-gray-500">
              {filter !== 'all' ? 'No tasks match the active filter status.' : 'No action items extracted yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 group ${
                  task.completed
                    ? 'bg-gray-50/60 dark:bg-gray-900/40 border-gray-200 dark:border-gray-800/80 opacity-70'
                    : 'bg-white dark:bg-gray-800/90 border-gray-200 dark:border-gray-700/80 hover:border-primary-400 dark:hover:border-primary-600 shadow-xs'
                }`}
              >
                <button
                  onClick={() => toggleComplete(task)}
                  className={`mt-0.5 shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                    task.completed
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary-500 bg-white dark:bg-gray-900'
                  }`}
                  title={task.completed ? 'Mark pending' : 'Mark completed'}
                >
                  {task.completed && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p
                      className={`text-sm font-medium leading-snug transition-all ${
                        task.completed
                          ? 'text-gray-400 dark:text-gray-500 line-through'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {task.text}
                    </p>

                    <Link
                      href={`/meetings/${task.meeting_id}`}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-600 dark:text-primary-400 hover:underline shrink-0"
                    >
                      <span>{task.meeting_title}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {task.assignee && (
                      <span className="inline-flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full text-[11px] font-medium">
                        <User className="w-3 h-3" />
                        {task.assignee}
                      </span>
                    )}
                    {task.due_date && (
                      <span className="inline-flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        Due: {task.due_date}
                      </span>
                    )}
                    <span className="text-[11px] text-gray-400">
                      • Recorded {formatDate(task.meeting_date)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
