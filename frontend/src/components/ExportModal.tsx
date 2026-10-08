"use client";
import { useState } from 'react';
import { api } from '@/lib/api';
import { X, Download, FileText, Check, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ExportModal({
  meetingId,
  meetingTitle,
  isOpen,
  onClose,
}: {
  meetingId: number;
  meetingTitle: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [format, setFormat] = useState<'md' | 'txt'>('md');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setLoading(true);
    try {
      const content = await api.exportMeeting(meetingId, format);
      const blob = new Blob([content], {
        type: format === 'md' ? 'text/markdown;charset=utf-8' : 'text/plain;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${meetingTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_transcript.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Exported as .${format}`);
      onClose();
    } catch {
      toast.error('Failed to export meeting');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Export Meeting</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Export the complete transcript, AI executive summary, and action items for <strong>{meetingTitle}</strong>.
          </p>

          <div className="space-y-2">
            <div
              onClick={() => setFormat('md')}
              className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                format === 'md'
                  ? 'border-primary-500 bg-primary-50/60 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-primary-600" />
                <div>
                  <div className="text-xs font-semibold">Markdown (.md)</div>
                  <div className="text-[11px] text-gray-400">Formatted headings, checkboxes, and quotes</div>
                </div>
              </div>
              {format === 'md' && <Check className="w-4 h-4 text-primary-600" />}
            </div>

            <div
              onClick={() => setFormat('txt')}
              className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                format === 'txt'
                  ? 'border-primary-500 bg-primary-50/60 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                <div>
                  <div className="text-xs font-semibold">Plain Text (.txt)</div>
                  <div className="text-[11px] text-gray-400">Clean unformatted text for simple notes</div>
                </div>
              </div>
              {format === 'txt' && <Check className="w-4 h-4 text-primary-600" />}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print View
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                {loading ? 'Exporting...' : 'Download'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
