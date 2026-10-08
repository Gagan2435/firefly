export interface Participant {
  id: number;
  name: string;
  email?: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Speaker {
  id: number;
  name: string;
  meeting_id: number;
}

export interface Comment {
  id: number;
  meeting_id: number;
  segment_id?: number;
  text: string;
  author: string;
  created_at: string;
}

export interface TranscriptSegment {
  id: number;
  meeting_id: number;
  speaker_id?: number;
  speaker?: Speaker;
  start_time: number;
  end_time?: number;
  text: string;
  order_index: number;
  is_bookmarked?: boolean;
  comments?: Comment[];
}

export interface ActionItem {
  id: number;
  meeting_id: number;
  text: string;
  assignee?: string;
  due_date?: string;
  completed: boolean;
  created_at: string;
}

export interface TaskItem extends ActionItem {
  meeting_title: string;
  meeting_date: string;
}

export interface MeetingListItem {
  id: number;
  title: string;
  date: string;
  duration: number;
  summary?: string;
  key_topics?: string;
  audio_url?: string;
  participants: Participant[];
  tags: Tag[];
  action_items_count: number;
  created_at: string;
  updated_at: string;
}

export interface MeetingDetail extends MeetingListItem {
  action_items: ActionItem[];
  speakers: Speaker[];
  transcript_segments: TranscriptSegment[];
  comments: Comment[];
}
