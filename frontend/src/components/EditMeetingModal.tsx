"use client";
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { MeetingListItem, MeetingDetail } from '@/lib/types';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditMeetingModal({
  meeting,
  isOpen,
  onClose,
  onSuccess,
}: {
  meeting: MeetingListItem | MeetingDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [participantsInput, setParticipantsInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (meeting) {
      setTitle(meeting.title || '');
      setTagsInput(meeting.tags?.map((t) => t.name).join(', ') || '');
      setParticipantsInput(meeting.participants?.map((p) => p.name).join(', ') || '');
    }
  }, [meeting]);

  if (!isOpen || !meeting) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title cannot be empty');
      return;
    }
    setLoading(true);
    try {
      const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
      const participants = participantsInput
        .split(',')
        .map((p) => ({
          name: p.trim(),
          email: `${p.trim().toLowerCase().replace(' ', '.')}@example.com`,
        }))
        .filter((p) => p.name.length > 0);

      await api.updateMeeting(meeting.id, {
        title: title.trim(),
        tags,
        participants,
      });

      toast.success('Meeting details updated');
      onSuccess();
      onClose();
    } catch {
      toast.error('Failed to update meeting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Edit Meeting</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Meeting Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Participants (comma separated)
            </label>
            <input
              type="text"
              value={participantsInput}
              onChange={(e) => setParticipantsInput(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-sm"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
