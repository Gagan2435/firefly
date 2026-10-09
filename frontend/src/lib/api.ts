import { MeetingListItem, MeetingDetail, ActionItem, TaskItem, Comment, Tag } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error ${res.status}: ${errorText}`);
  }
  return res.json();
}

export const api = {
  // Meetings Library
  getMeetings: (params?: { search?: string; tag?: string; dateFilter?: string; sortBy?: 'recency' | 'duration' | 'title'; order?: 'asc' | 'desc' }) => {
    const qp = new URLSearchParams();
    if (params?.search) qp.append('q', params.search);
    if (params?.tag) qp.append('tag', params.tag);
    if (params?.dateFilter && params.dateFilter !== 'all') qp.append('date_filter', params.dateFilter);
    if (params?.sortBy) qp.append('sort_by', params.sortBy);
    if (params?.order) qp.append('order', params.order);
    return fetchJSON<MeetingListItem[]>(`/meetings?${qp.toString()}`);
  },

  getMeeting: (id: number | string) => fetchJSON<MeetingDetail>(`/meetings/${id}`),

  createMeeting: (data: {
    title: string;
    date: string;
    duration: number;
    summary?: string;
    key_topics?: string;
    participants: { name: string; email?: string }[];
    tags?: string[];
    transcript_segments?: { start_time: number; end_time?: number; text: string; order_index: number; speaker_name?: string }[];
    action_items?: { text: string; assignee?: string; due_date?: string; completed?: boolean }[];
  }) => fetchJSON<MeetingDetail>('/meetings', { method: 'POST', body: JSON.stringify(data) }),

  createMeetingFromText: (data: {
    title: string;
    transcript_text: string;
    participants?: string[];
    tags?: string[];
  }) => fetchJSON<MeetingDetail>('/meetings/from-text', { method: 'POST', body: JSON.stringify(data) }),

  uploadTranscript: async (file: File, title?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    const res = await fetch(`${API_BASE}/meetings/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Upload failed: ${err}`);
    }
    return res.json() as Promise<MeetingDetail>;
  },

  updateMeeting: (id: number | string, data: {
    title?: string;
    summary?: string;
    key_topics?: string;
    participants?: { name: string; email?: string }[];
    tags?: string[];
  }) => fetchJSON<MeetingDetail>(`/meetings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteMeeting: (id: number | string) =>
    fetchJSON<{ message: string }>(`/meetings/${id}`, { method: 'DELETE' }),

  // Tasks / Action Items
  getAllTasks: () => fetchJSON<TaskItem[]>('/tasks'),

  addActionItem: (meetingId: number | string, data: { text: string; assignee?: string; due_date?: string; completed?: boolean }) =>
    fetchJSON<ActionItem>(`/meetings/${meetingId}/action-items`, { method: 'POST', body: JSON.stringify(data) }),

  updateActionItem: (id: number | string, data: { text: string; assignee?: string; due_date?: string; completed?: boolean }) =>
    fetchJSON<ActionItem>(`/action-items/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteActionItem: (id: number | string) =>
    fetchJSON<{ message: string }>(`/action-items/${id}`, { method: 'DELETE' }),

  // Transcript Segment Bookmarking / Soundbites
  toggleBookmarkSegment: (segmentId: number | string) =>
    fetchJSON<{ id: number; is_bookmarked: boolean }>(`/segments/${segmentId}/bookmark`, { method: 'POST' }),

  // Comments
  addComment: (meetingId: number | string, data: { segment_id?: number; text: string; author?: string }) =>
    fetchJSON<Comment>(`/meetings/${meetingId}/comments`, { method: 'POST', body: JSON.stringify(data) }),

  getComments: (meetingId: number | string) =>
    fetchJSON<Comment[]>(`/meetings/${meetingId}/comments`),

  deleteComment: (id: number | string) =>
    fetchJSON<{ message: string }>(`/comments/${id}`, { method: 'DELETE' }),

  // Tags
  getTags: () => fetchJSON<Tag[]>('/tags'),

  addTag: (meetingId: number | string, data: { name: string }) =>
    fetchJSON<Tag>(`/meetings/${meetingId}/tags`, { method: 'POST', body: JSON.stringify(data) }),

  removeTag: (meetingId: number | string, tagId: number) =>
    fetchJSON<{ message: string }>(`/meetings/${meetingId}/tags/${tagId}`, { method: 'DELETE' }),

  // Global Search
  searchGlobal: (query: string) =>
    fetchJSON<MeetingListItem[]>(`/search?q=${encodeURIComponent(query)}`),

  // AskFred AI
  askQuestion: (meetingId: number | string, question: string) =>
    fetchJSON<{ answer: string; sources: string[] }>(`/meetings/${meetingId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ question }),
    }),

  askFred: (meetingId: number | string, question: string) =>
    fetchJSON<{ answer: string; sources: string[] }>(`/meetings/${meetingId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ question }),
    }),

  // Export
  exportMeeting: async (meetingId: number | string, format: 'txt' | 'md') => {
    const res = await fetch(`${API_BASE}/meetings/${meetingId}/export?format=${format}`);
    if (!res.ok) throw new Error('Export failed');
    return res.text();
  },

  // Reseed Sample Database
  reseedDatabase: () => fetchJSON<{ message: string }>('/seed', { method: 'POST' }),
};
