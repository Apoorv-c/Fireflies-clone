from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
from .participant import ParticipantCreate, ParticipantResponse
from .tag import TagResponse
from .speaker import SpeakerResponse
from .summary import SummaryResponse
from .action_item import ActionItemResponse

class MeetingBase(BaseModel):
    title: str
    date: Optional[datetime] = None
    duration_seconds: int = 0
    status: str = "completed"
    audio_url: Optional[str] = None

class MeetingCreate(MeetingBase):
    participants: List[ParticipantCreate] = []
    tags: List[str] = []

class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    date: Optional[datetime] = None
    duration_seconds: Optional[int] = None
    status: Optional[str] = None
    audio_url: Optional[str] = None

class MeetingResponse(MeetingBase):
    id: int
    created_at: datetime
    updated_at: datetime
    participants: List[ParticipantResponse] = []
    tags: List[TagResponse] = []
    speaker_count: int = 0
    segment_count: int = 0
    summary_snippet: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

class MeetingDetailResponse(MeetingResponse):
    speakers: List[SpeakerResponse] = []
    summary: Optional[SummaryResponse] = None
    action_items: List[ActionItemResponse] = []
    
    model_config = ConfigDict(from_attributes=True)
