from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Meeting(Base):
    __tablename__ = "meetings"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    date = Column(DateTime, nullable=False, default=datetime.utcnow)
    duration_seconds = Column(Integer, nullable=False, default=0)
    status = Column(String(50), default="completed")  # completed, in_progress, scheduled
    audio_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    transcript_segments = relationship("TranscriptSegment", back_populates="meeting", cascade="all, delete-orphan")
    speakers = relationship("Speaker", back_populates="meeting", cascade="all, delete-orphan")
    participants = relationship("Participant", back_populates="meeting", cascade="all, delete-orphan")
    summary = relationship("Summary", back_populates="meeting", uselist=False, cascade="all, delete-orphan")
    action_items = relationship("ActionItem", back_populates="meeting", cascade="all, delete-orphan")
    tags = relationship("Tag", back_populates="meeting", cascade="all, delete-orphan")

class TranscriptSegment(Base):
    __tablename__ = "transcript_segments"
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False)
    speaker_id = Column(Integer, ForeignKey("speakers.id", ondelete="SET NULL"), nullable=True)
    start_time = Column(Float, nullable=False)  # seconds
    end_time = Column(Float, nullable=False)
    content = Column(Text, nullable=False)
    sequence = Column(Integer, nullable=False)
    
    meeting = relationship("Meeting", back_populates="transcript_segments")
    speaker = relationship("Speaker", back_populates="segments")
    highlights = relationship("Highlight", back_populates="segment", cascade="all, delete-orphan")

class Speaker(Base):
    __tablename__ = "speakers"
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False)
    label = Column(String(100), nullable=False)
    color = Column(String(7), nullable=False)  # hex color
    
    meeting = relationship("Meeting", back_populates="speakers")
    segments = relationship("TranscriptSegment", back_populates="speaker")

class Participant(Base):
    __tablename__ = "participants"
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=True)
    
    meeting = relationship("Meeting", back_populates="participants")

class Summary(Base):
    __tablename__ = "summaries"
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False, unique=True)
    overview = Column(Text, nullable=False)
    key_topics = Column(JSON, nullable=True)  # [{"title": "...", "description": "..."}]
    chapters = Column(JSON, nullable=True)  # [{"title": "...", "start_time": 0, "end_time": 60}]
    
    meeting = relationship("Meeting", back_populates="summary")

class ActionItem(Base):
    __tablename__ = "action_items"
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False)
    description = Column(Text, nullable=False)
    assignee = Column(String(100), nullable=True)
    status = Column(String(20), default="pending")  # pending, completed
    due_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    meeting = relationship("Meeting", back_populates="action_items")

class Highlight(Base):
    __tablename__ = "highlights"
    id = Column(Integer, primary_key=True, index=True)
    segment_id = Column(Integer, ForeignKey("transcript_segments.id", ondelete="CASCADE"), nullable=False)
    color = Column(String(7), default="#FBBF24")
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    segment = relationship("TranscriptSegment", back_populates="highlights")

class Tag(Base):
    __tablename__ = "tags"
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(50), nullable=False)
    
    meeting = relationship("Meeting", back_populates="tags")
