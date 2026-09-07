from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class ActionItemCreate(BaseModel):
    description: str
    assignee: Optional[str] = None
    due_date: Optional[datetime] = None

class ActionItemUpdate(BaseModel):
    description: Optional[str] = None
    assignee: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[datetime] = None

class ActionItemResponse(BaseModel):
    id: int
    meeting_id: int
    description: str
    assignee: Optional[str] = None
    status: str
    due_date: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
