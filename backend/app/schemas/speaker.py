from pydantic import BaseModel, ConfigDict

class SpeakerResponse(BaseModel):
    id: int
    label: str
    color: str

    model_config = ConfigDict(from_attributes=True)
