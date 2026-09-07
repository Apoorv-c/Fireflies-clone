from pydantic import BaseModel, ConfigDict
from typing import Optional

class ParticipantCreate(BaseModel):
    name: str
    email: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

class ParticipantResponse(BaseModel):
    id: int
    name: str
    email: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)
