import axios from 'axios';
import type { Meeting, TranscriptSegment, Summary, ActionItem, Highlight, SearchResult } from '@/types';

const getBaseURL = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    // If running on a deployed domain (Railway, Render, custom host), use relative '' so Nginx/Next proxies /api
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return '';
    }
    return 'http://localhost:8000';
  }
  return process.env.BACKEND_INTERNAL_URL || 'http://127.0.0.1:8000';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: { 'Content-Type': 'application/json' },
});

// Dynamic interceptor to ensure browser requests on deployed domains never mistakenly hit localhost
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    if (process.env.NEXT_PUBLIC_API_URL) {
      config.baseURL = process.env.NEXT_PUBLIC_API_URL;
    } else if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      config.baseURL = '';
    }
  }
  return config;
});

// Meetings
export const getMeetings = async (params?: {
  search?: string;
  sort_by?: string;
  date_from?: string;
  date_to?: string;
  participant?: string;
  skip?: number;
  limit?: number;
}): Promise<Meeting[]> => {
  const { data } = await api.get('/api/meetings', { params });
  return data;
};

export const getMeeting = async (id: number): Promise<Meeting> => {
  const { data } = await api.get(`/api/meetings/${id}`);
  return data;
};

export const createMeeting = async (meetingData: {
  title: string;
  date: string;
  duration_seconds: number;
  status?: string;
  audio_url?: string;
  participants?: { name: string; email?: string }[];
  tags?: string[];
}): Promise<Meeting> => {
  const { data } = await api.post('/api/meetings', meetingData);
  return data;
};

export const updateMeeting = async (id: number, meetingData: {
  title?: string;
  date?: string;
  duration_seconds?: number;
  status?: string;
  audio_url?: string;
}): Promise<Meeting> => {
  const { data } = await api.patch(`/api/meetings/${id}`, meetingData);
  return data;
};

export const deleteMeeting = async (id: number): Promise<void> => {
  await api.delete(`/api/meetings/${id}`);
};

// Transcripts
export const getTranscript = async (meetingId: number): Promise<TranscriptSegment[]> => {
  const { data } = await api.get(`/api/meetings/${meetingId}/transcript`);
  return data;
};

export const uploadTranscript = async (meetingId: number, file: File): Promise<{ message: string; segment_count: number }> => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post(`/api/meetings/${meetingId}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// Summaries
export const getSummary = async (meetingId: number): Promise<Summary> => {
  const { data } = await api.get(`/api/meetings/${meetingId}/summary`);
  return data;
};

export const generateSummary = async (meetingId: number): Promise<Summary> => {
  const { data } = await api.post(`/api/meetings/${meetingId}/summary/generate`);
  return data;
};

// Action Items
export const getAllActionItems = async (): Promise<ActionItem[]> => {
  const { data } = await api.get('/api/action-items');
  return data;
};

export const createStandaloneActionItem = async (itemData: {
  description: string;
  assignee?: string;
  due_date?: string;
}): Promise<ActionItem> => {
  const { data } = await api.post('/api/action-items', itemData);
  return data;
};

export const getActionItems = async (meetingId: number): Promise<ActionItem[]> => {
  const { data } = await api.get(`/api/meetings/${meetingId}/action-items`);
  return data;
};

export const createActionItem = async (meetingId: number, itemData: {
  description: string;
  assignee?: string;
  due_date?: string;
}): Promise<ActionItem> => {
  const { data } = await api.post(`/api/meetings/${meetingId}/action-items`, itemData);
  return data;
};

export const updateActionItem = async (id: number, itemData: {
  description?: string;
  assignee?: string;
  status?: string;
  due_date?: string;
}): Promise<ActionItem> => {
  const { data } = await api.patch(`/api/action-items/${id}`, itemData);
  return data;
};

export const deleteActionItem = async (id: number): Promise<void> => {
  await api.delete(`/api/action-items/${id}`);
};

// Search
export const searchTranscripts = async (q: string, meetingId?: number): Promise<{ results: SearchResult[]; total_count: number }> => {
  const { data } = await api.get('/api/search', { params: { q, meeting_id: meetingId } });
  return data;
};

// Highlights
export const createHighlight = async (highlightData: {
  segment_id: number;
  color?: string;
  note?: string;
}): Promise<Highlight> => {
  const { data } = await api.post('/api/highlights', highlightData);
  return data;
};

export const deleteHighlight = async (id: number): Promise<void> => {
  await api.delete(`/api/highlights/${id}`);
};

// Ask Fred AI Assistant
export const askMeeting = async (meetingId: number, question: string): Promise<{ answer: string }> => {
  const { data } = await api.post('/api/ask', { meeting_id: meetingId, question });
  return data;
};

// Export Meeting Transcript / Summary
export const exportMeeting = async (meetingId: number, format: 'markdown' | 'txt' = 'markdown'): Promise<string> => {
  const { data } = await api.get(`/api/meetings/${meetingId}/export`, {
    params: { format },
    responseType: 'text',
  });
  return data;
};

export default api;
