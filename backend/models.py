from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Float, Text, Table
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import database

meeting_participants = Table(
    'meeting_participants',
    database.Base.metadata,
    Column('id', Integer, primary_key=True),
    Column('meeting_id', Integer, ForeignKey('meetings.id', ondelete="CASCADE")),
    Column('participant_id', Integer, ForeignKey('participants.id', ondelete="CASCADE"))
)

meeting_tags = Table(
    'meeting_tags',
    database.Base.metadata,
    Column('id', Integer, primary_key=True),
    Column('meeting_id', Integer, ForeignKey('meetings.id', ondelete="CASCADE")),
    Column('tag_id', Integer, ForeignKey('tags.id', ondelete="CASCADE"))
)

class Participant(database.Base):
    __tablename__ = "participants"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=True)

class Tag(database.Base):
    __tablename__ = "tags"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)

class Meeting(database.Base):
    __tablename__ = "meetings"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    date = Column(DateTime, nullable=False)
    duration = Column(Integer, nullable=False)
    summary = Column(Text, nullable=True)
    key_topics = Column(Text, nullable=True)
    audio_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    participants = relationship("Participant", secondary=meeting_participants, backref="meetings")
    tags = relationship("Tag", secondary=meeting_tags, backref="meetings")
    speakers = relationship("Speaker", back_populates="meeting", cascade="all, delete-orphan")
    transcript_segments = relationship("TranscriptSegment", back_populates="meeting", cascade="all, delete-orphan", order_by="TranscriptSegment.order_index")
    action_items = relationship("ActionItem", back_populates="meeting", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="meeting", cascade="all, delete-orphan")

class Speaker(database.Base):
    __tablename__ = "speakers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    meeting_id = Column(Integer, ForeignKey('meetings.id', ondelete="CASCADE"))

    meeting = relationship("Meeting", back_populates="speakers")

class TranscriptSegment(database.Base):
    __tablename__ = "transcript_segments"
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey('meetings.id', ondelete="CASCADE"))
    speaker_id = Column(Integer, ForeignKey('speakers.id'), nullable=True)
    start_time = Column(Float, nullable=False)
    end_time = Column(Float, nullable=True)
    text = Column(Text, nullable=False)
    order_index = Column(Integer, nullable=False)
    is_bookmarked = Column(Boolean, default=False)

    meeting = relationship("Meeting", back_populates="transcript_segments")
    speaker = relationship("Speaker")
    comments = relationship("Comment", back_populates="segment", cascade="all, delete-orphan")

class ActionItem(database.Base):
    __tablename__ = "action_items"
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey('meetings.id', ondelete="CASCADE"))
    text = Column(Text, nullable=False)
    assignee = Column(String, nullable=True)
    due_date = Column(String, nullable=True)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    meeting = relationship("Meeting", back_populates="action_items")

class Comment(database.Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey('meetings.id', ondelete="CASCADE"))
    segment_id = Column(Integer, ForeignKey('transcript_segments.id', ondelete="CASCADE"), nullable=True)
    text = Column(Text, nullable=False)
    author = Column(String, default='User')
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    meeting = relationship("Meeting", back_populates="comments")
    segment = relationship("TranscriptSegment", back_populates="comments")
