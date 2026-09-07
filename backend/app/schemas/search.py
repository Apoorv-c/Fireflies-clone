from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class SearchResult(BaseModel):
    segment_id: int
    meeting_id: int
    meeting_title: str
    speaker_label: Optional[str] = None
    content: str
    start_time: float

class SearchResponse(BaseModel):
    results: List[SearchResult]
    total_count: int
