from pydantic import BaseModel, ConfigDict
from typing import List, Dict, Any, Optional

class SummaryResponse(BaseModel):
    id: int
    meeting_id: int
    overview: str
    key_topics: Optional[List[Dict[str, Any]]] = None
    chapters: Optional[List[Dict[str, Any]]] = None

    model_config = ConfigDict(from_attributes=True)

class SummaryGenerateRequest(BaseModel):
    meeting_id: Optional[int] = None
