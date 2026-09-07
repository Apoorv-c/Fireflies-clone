from pydantic import BaseModel, ConfigDict
from typing import Optional, List

class TranscriptSegmentResponse(BaseModel):
    id: int
    meeting_id: int
    speaker_id: Optional[int]
    speaker_label: Optional[str] = None
    speaker_color: Optional[str] = None
    start_time: float
    end_time: float
    content: str
    sequence: int

    model_config = ConfigDict(from_attributes=True)

class TranscriptUploadResponse(BaseModel):
    message: str
    segment_count: int
