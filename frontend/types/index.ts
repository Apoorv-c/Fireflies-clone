export interface Meeting {
  id: number;
  title: string;
  date: string;
  duration_seconds: number;
  status: string;
  audio_url: string | null;
  created_at: string;
  updated_at: string;
  participants: Participant[];
  tags: Tag[];
  speakers?: Speaker[];
  summary?: Summary | null;
  action_items?: ActionItem[];
  speaker_count?: number;
  segment_count?: number;
  summary_snippet?: string | null;
}

export interface TranscriptSegment {
  id: number;
  meeting_id: number;
  speaker_id: number | null;
  speaker_label: string;
  speaker_color: string;
  start_time: number;
  end_time: number;
  content: string;
  sequence: number;
}

export interface Speaker {
  id: number;
  label: string;
  color: string;
}

export interface Participant {
  id: number;
  name: string;
  email: string | null;
}

export interface Summary {
  id: number;
  meeting_id: number;
  overview: string;
  key_topics: KeyTopic[];
  chapters: Chapter[];
}

export interface KeyTopic {
  title: string;
  description: string;
}

export interface Chapter {
  title: string;
  start_time: number;
  end_time: number;
}

export interface ActionItem {
  id: number;
  meeting_id: number;
  description: string;
  assignee: string | null;
  status: string;
  due_date: string | null;
  created_at: string;
}

export interface Highlight {
  id: number;
  segment_id: number;
  color: string;
  note: string | null;
  created_at: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface SearchResult {
  segment_id: number;
  meeting_id: number;
  meeting_title: string;
  speaker_label: string;
  content: string;
  start_time: number;
}
