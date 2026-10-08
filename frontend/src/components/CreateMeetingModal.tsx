"use client";
import { useState, useRef } from 'react';
import { api } from '@/lib/api';
import { X, UploadCloud, FileText, PlusCircle, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateMeetingModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSuccess: () => void;
}) {
  const [tab, setTab] = useState<'upload' | 'paste' | 'manual'>('upload');
  const [title, setTitle] = useState('');
  const [pasteText, setPasteText] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [participantsInput, setParticipantsInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please choose a transcript file (.txt, .vtt, .json)');
      return;
    }
    setLoading(true);
    try {
      await api.uploadTranscript(file, title.trim() || undefined);
      toast.success('Meeting transcribed and created!');
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload transcript');
    } finally {
      setLoading(false);
    }
  };

  const handlePasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please provide a meeting title');
      return;
    }
    if (!pasteText.trim()) {
      toast.error('Please paste transcript text');
      return;
    }
    setLoading(true);
    try {
      const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
      const participants = participantsInput.split(',').map((p) => p.trim()).filter(Boolean);
      
      await api.createMeetingFromText({
        title: title.trim(),
        transcript_text: pasteText.trim(),
        tags,
        participants,
      });
      toast.success('Meeting processed and created!');
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to process transcript');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please provide a meeting title');
      return;
    }
    setLoading(true);
    try {
      const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
      const participants = participantsInput
        .split(',')
        .map((p) => ({ name: p.trim(), email: `${p.trim().toLowerCase().replace(' ', '.')}@example.com` }))
        .filter((p) => p.name.length > 0);

      await api.createMeeting({
        title: title.trim(),
        date: new Date().toISOString(),
        duration: 1800,
        summary: `Meeting notes and agenda review for ${title.trim()}.`,
        key_topics: '1. Agenda & Scope\n2. Open Discussion\n3. Action Items',
        participants: participants.length > 0 ? participants : [{ name: 'User', email: 'user@example.com' }],
        tags: tags.length > 0 ? tags : ['meeting'],
        transcript_segments: [
          {
            start_time: 0.0,
            end_time: 15.0,
            text: `Welcome to ${title.trim()}. Let's review our agenda and open items.`,
            order_index: 0,
            speaker_name: 'Meeting Host',
          },
        ],
        action_items: [
          { text: 'Review meeting takeaways with stakeholders', assignee: 'Meeting Host', due_date: 'Next week', completed: false },
        ],
      });

      toast.success('Meeting created successfully');
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create meeting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Create New Meeting</h2>
            <p className="text-xs text-gray-500">Upload, paste transcript, or add meeting details</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 px-6 pt-2 gap-4">
          <button
            onClick={() => setTab('upload')}
            className={`pb-2.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-all ${
              tab === 'upload'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Upload File
          </button>
          <button
            onClick={() => setTab('paste')}
            className={`pb-2.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-all ${
              tab === 'paste'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Paste Transcript
          </button>
          <button
            onClick={() => setTab('manual')}
            className={`pb-2.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-all ${
              tab === 'manual'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Quick Form
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {tab === 'upload' && (
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Meeting Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Defaults to filename if left blank"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Transcript File (.txt, .vtt, .json)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 rounded-xl p-6 text-center cursor-pointer transition-all bg-gray-50/50 dark:bg-gray-900/50"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".txt,.vtt,.json,.srt"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <UploadCloud className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                  {file ? (
                    <div className="text-xs font-medium text-gray-800 dark:text-gray-200">
                      Selected: <span className="font-semibold text-primary-600">{file.name}</span> ({(file.size / 1024).toFixed(1)} KB)
                    </div>
                  ) : (
                    <>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Click or drag transcript file here
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Supports WebVTT (.vtt), JSON, and Plain Text (.txt)
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !file}
                  className="px-4 py-2 text-xs font-medium bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg transition-colors shadow-sm"
                >
                  {loading ? 'Processing...' : 'Upload & Transcribe'}
                </button>
              </div>
            </form>
          )}

          {tab === 'paste' && (
            <form onSubmit={handlePasteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Meeting Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weekly Product Sync"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Paste Transcript Text *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Paste dialogue with or without timestamps. For example:&#10;[00:00] Alice: Welcome to the meeting&#10;[00:15] Bob: Thanks Alice, glad to be here"
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  className="w-full text-xs font-mono p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="roadmap, engineering"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Participants
                  </label>
                  <input
                    type="text"
                    placeholder="Alice, Bob, Carol"
                    value={participantsInput}
                    onChange={(e) => setParticipantsInput(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !title || !pasteText}
                  className="px-4 py-2 text-xs font-medium bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg transition-colors shadow-sm"
                >
                  {loading ? 'Analyzing with AI...' : 'Generate Notes & Summary'}
                </button>
              </div>
            </form>
          )}

          {tab === 'manual' && (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Meeting Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Client Discovery Call"
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
                  placeholder="Alex Rivers, Maya Chen"
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
                  placeholder="design, sprint"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !title}
                  className="px-4 py-2 text-xs font-medium bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg transition-colors shadow-sm"
                >
                  {loading ? 'Creating...' : 'Create Meeting'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
