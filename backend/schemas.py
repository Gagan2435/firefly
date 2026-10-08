from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ParticipantBase(BaseModel):
    name: str
    email: Optional[str] = None

class ParticipantCreate(ParticipantBase):
    pass

class Participant(ParticipantBase):
    id: int
    class Config:
        from_attributes = True

class TagBase(BaseModel):
    name: str

class TagCreate(TagBase):
    pass

class Tag(TagBase):
    id: int
    class Config:
        from_attributes = True

class SpeakerBase(BaseModel):
    name: str

class SpeakerCreate(SpeakerBase):
    pass

class Speaker(SpeakerBase):
    id: int
    meeting_id: int
    class Config:
        from_attributes = True

class CommentBase(BaseModel):
    text: str
    author: Optional[str] = 'User'
    segment_id: Optional[int] = None

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    meeting_id: int
    created_at: datetime
    class Config:
        from_attributes = True

class ActionItemBase(BaseModel):
    text: str
    assignee: Optional[str] = None
    due_date: Optional[str] = None
    completed: bool = False

class ActionItemCreate(ActionItemBase):
    pass

class ActionItem(ActionItemBase):
    id: int
    meeting_id: int
    created_at: datetime
    class Config:
        from_attributes = True

class TaskItem(ActionItem):
    meeting_title: str
    meeting_date: datetime

class TranscriptSegmentBase(BaseModel):
    start_time: float
    end_time: Optional[float] = None
    text: str
    order_index: int
    speaker_id: Optional[int] = None
    is_bookmarked: bool = False

class TranscriptSegmentCreate(TranscriptSegmentBase):
    speaker_name: Optional[str] = None

class TranscriptSegment(TranscriptSegmentBase):
    id: int
    meeting_id: int
    speaker: Optional[Speaker] = None
    comments: List[Comment] = []
    class Config:
        from_attributes = True

class MeetingBase(BaseModel):
    title: str
    date: datetime
    duration: int
    summary: Optional[str] = None
    key_topics: Optional[str] = None
    audio_url: Optional[str] = None

class MeetingCreate(MeetingBase):
    participants: List[ParticipantCreate] = []
    tags: List[str] = []
    transcript_segments: List[TranscriptSegmentCreate] = []
    action_items: List[ActionItemCreate] = []

class MeetingFromTextCreate(BaseModel):
    title: str
    transcript_text: str
    date: Optional[datetime] = None
    participants: Optional[List[str]] = []
    tags: Optional[List[str]] = []

class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None
    key_topics: Optional[str] = None
    participants: Optional[List[ParticipantCreate]] = None
    tags: Optional[List[str]] = None

class MeetingList(MeetingBase):
    id: int
    participants: List[Participant] = []
    tags: List[Tag] = []
    action_items_count: int = 0
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

class MeetingDetail(MeetingList):
    action_items: List[ActionItem] = []
    speakers: List[Speaker] = []
    transcript_segments: List[TranscriptSegment] = []
    comments: List[Comment] = []

class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str
    sources: Optional[List[str]] = []
