from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class HighlightCreate(BaseModel):
    segment_id: int
    color: Optional[str] = "#FBBF24"
    note: Optional[str] = None

class HighlightResponse(BaseModel):
    id: int
    segment_id: int
    color: str
    note: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
