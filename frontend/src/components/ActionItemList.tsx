"use client";
import { ActionItem } from '@/lib/types';
import { api } from '@/lib/api';
import { useState } from 'react';
import { Check, Trash2, Plus, Calendar, User, Edit2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ActionItemList({
  meetingId,
  items: initialItems,
}: {
  meetingId: number;
  items: ActionItem[];
}) {
  const [items, setItems] = useState<ActionItem[]>(initialItems);
  const [newTaskText, setNewTaskText] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const toggleComplete = async (item: ActionItem) => {
    try {
      const updated = await api.updateActionItem(item.id, {
        text: item.text,
        assignee: item.assignee,
        due_date: item.due_date,
        completed: !item.completed,
      });
      setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
      toast.success(updated.completed ? 'Task completed' : 'Task marked pending');
    } catch {
      toast.error('Failed to update action item');
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    try {
      const added = await api.addActionItem(meetingId, {
        text: newTaskText.trim(),
        assignee: newAssignee.trim() || undefined,
        due_date: 'Next week',
        completed: false,
      });
      setItems((prev) => [...prev, added]);
      setNewTaskText('');
      setNewAssignee('');
      setIsAdding(false);
      toast.success('Action item added');
    } catch {
      toast.error('Failed to add action item');
    }
  };

  const handleEditSave = async (item: ActionItem) => {
    if (!editText.trim()) return;
    try {
      const updated = await api.updateActionItem(item.id, {
        text: editText.trim(),
        assignee: item.assignee,
        due_date: item.due_date,
        completed: item.completed,
      });
      setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
      setEditingItemId(null);
      toast.success('Task updated');
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteActionItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success('Task removed');
    } catch {
      toast.error('Failed to delete action item');
    }
  };

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          No action items recorded for this meeting.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-xl border transition-all group ${
                item.completed
                  ? 'bg-gray-50/70 dark:bg-gray-900/40 border-gray-200 dark:border-gray-800 opacity-75'
                  : 'bg-white dark:bg-gray-800/80 border-gray-200/80 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 shadow-sm'
              }`}
            >
              {editingItemId === item.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 text-xs px-2.5 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                    autoFocus
                  />
                  <button
                    onClick={() => handleEditSave(item)}
                    className="px-2.5 py-1 text-xs font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingItemId(null)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleComplete(item)}
                    className={`mt-0.5 shrink-0 w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all ${
                      item.completed
                        ? 'bg-primary-600 border-primary-600 text-white'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary-500 bg-white dark:bg-gray-900'
                    }`}
                    title={item.completed ? 'Mark pending' : 'Mark completed'}
                  >
                    {item.completed && <Check className="w-3 h-3 stroke-[2.5]" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm leading-snug transition-all ${
                        item.completed
                          ? 'text-gray-400 dark:text-gray-500 line-through'
                          : 'text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {item.text}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                      {item.assignee && (
                        <span className="inline-flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full text-[11px] font-medium">
                          <User className="w-3 h-3" />
                          {item.assignee}
                        </span>
                      )}
                      {item.due_date && (
                        <span className="inline-flex items-center gap-1 text-[11px]">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          {item.due_date}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingItemId(item.id);
                        setEditText(item.text);
                      }}
                      className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      title="Edit task"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Task Control */}
      {isAdding ? (
        <form
          onSubmit={handleAdd}
          className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2.5"
        >
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full text-xs px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
            autoFocus
          />
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newAssignee}
              onChange={(e) => setNewAssignee(e.target.value)}
              placeholder="Assignee (e.g. Maya Chen)"
              className="flex-1 text-xs px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              Add Task
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-2 px-3 border border-dashed border-gray-300 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Action Item
        </button>
      )}
    </div>
  );
}
